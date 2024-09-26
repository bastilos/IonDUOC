import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicSafeString } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Persona } from 'src/app/model/persona';
import { UserService } from 'src/app/services/user.service';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';






@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileinput') fileinput!: ElementRef<HTMLInputElement>;

public loading: HTMLIonLoadingElement | null = null;
public escaneando = false;
public datosQR = '';
  
  public usuario: Usuario = new Usuario('', '', '', '', '', '');

  public nivelesEducacionales: NivelEducacional[] = new NivelEducacional().getNivelesEducacionales();

  public persona: Persona = new Persona();

 
  /*
    En el constructor del HomePage se ponen como parametros los siguientes objetos:
      (1) activeroute (del tipo de dato ActivatedRoute) y router (del tipo de dato Router),
      que se usarán para obtener los datos enviados por la página que invocó a "home".
      (2) alertController (del tipo de dato AlertController), que se usará para mostrar
      mensajes emergentes en la pantalla.

    Nótese que los parámetros tuvieron que declararse con "private", y esto es necesario
    para que los parámetros pasen a considerarse automáticamente como propiedades
    de la clase "HomePage" y de este modo puedan usarse dentro de los otros métodos.
   */
   constructor(
        private activeroute: ActivatedRoute
      , private router: Router
      , private alertController: AlertController,
        private userService: UserService,
        private loadingController: LoadingController,
        private animationController: AnimationController
      ) {

        this.activeroute.queryParams.subscribe(params => {
          const navigation = this.router.getCurrentNavigation();
          if (navigation && navigation.extras.state) {
            this.usuario = navigation.extras.state['usuario'];
            this.userService.setUsuarioAutenticado(this.usuario); // Guarda el usuario en el servicio
          } else {
            this.router.navigate(['/login']);
          }
        });

    // Se llama a la ruta activa y se obtienen sus parámetros mediante una subscripcion
    this.activeroute.queryParams.subscribe(params => {       // Utilizamos expresión lambda
      const navigation = this.router.getCurrentNavigation();
      if (navigation) {
        if (navigation.extras.state) { // Validar que tenga datos extras
          // Si tiene datos extra, se rescatan y se asignan a una propiedad
          this.usuario = navigation.extras.state['usuario'];
        } else {
          /*
            Si no vienen datos extra desde la página anterior, quiere decir que el usuario
            intentó entrar directamente a la página home sin pasar por el login,
            de modo que el sistema debe enviarlo al login para que inicie sesión.
          */
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
  });
}

ngAfterViewInit(): void {
  if (this.itemTitulo) {
    const animation = this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .fromTo('transform', 'translate(0%)', 'translate(100%)')
      .fromTo('opacity', 0.2, 1);
    animation.play();
  }
}

ngOnInit(): void {
  this.comenzarEscaneoQR();
}

  // Este método sirve para mostrar el mensaje emergente
  public async presentAlert(titulo: string, mensaje: string) {

    const alert = await this.alertController.create({
      header: titulo,
      message: new IonicSafeString(mensaje),
      buttons: ['OK']
    });

    await alert.present();
  }
  public limpiarDatos(): void {
    this.escaneando = false;
    this.datosQR = '';
    this.loading = null;
    (document.getElementById('input-file') as HTMLInputElement).value = '';
  }

  public async comenzarEscaneoQR() {
    this.limpiarDatos();
    const mediaProvider = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.loading = await this.loadingController.create({});
    await this.loading.present();
    this.video.nativeElement.play();
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  public obtenerDatosQR(source?: CanvasImageSource): boolean {
    let w = 0;
    let h = 0;

    if (!source) {
      this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
      this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    }

    w = this.canvas.nativeElement.width;
    h = this.canvas.nativeElement.height;
    const context = this.canvas.nativeElement.getContext('2d');

    if (!context) {
      console.error('No se pudo obtener el contexto del canvas.');
      return false;
    }

    context.drawImage(source ? source : this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    const qrCode: QRCode | null = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });

    if (qrCode) {
      this.escaneando = false;
      this.datosQR = qrCode.data;
    }

    return this.datosQR !== '';
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.escaneando = true;
      }
      if (this.obtenerDatosQR()) {
        console.log(1);
      } else {
        if (this.escaneando) {
          console.log(2);
          requestAnimationFrame(this.verificarVideo.bind(this));
        }
      }
    } else {
      console.log(3);
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  public cargarImagenDesdeArchivo(): void {
    this.limpiarDatos();
    this.fileinput.nativeElement.click();
  }

  public verificarArchivoConQR(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const img = new Image();
      img.onload = () => {
        this.obtenerDatosQR(img);
      };
      img.src = URL.createObjectURL(file);
    }
  }
}
