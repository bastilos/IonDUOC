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
import { AsistenciaService, Asistencia } from '../../services/asistencia.service'; // Importa el servicio

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

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private loadingController: LoadingController,
    private animationController: AnimationController,
    private asistenciaService: AsistenciaService // Inyecta el servicio
  ) {
    const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        this.usuario = JSON.parse(storedUser);
        this.userService.setUsuarioAutenticado(this.usuario);
      }
    // Tu lógica para la navegación
    this.activeroute.queryParams.subscribe(params => {
      const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        this.usuario = JSON.parse(storedUser);
        this.userService.setUsuarioAutenticado(this.usuario);
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
    const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state) {
        this.usuario = navigation.extras.state['usuario'];
        this.userService.setUsuarioAutenticado(this.usuario);
      } else {
        this.router.navigate(['/login']);
      }
    this.comenzarEscaneoQR();
  }

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
      console.log("Datos QR escaneados: ", this.datosQR); // Depura aquí

      // Procesar los datos del QR y enviarlos al servicio
      this.procesarDatosQR(this.datosQR);
    }

    return this.datosQR !== '';
  }

  // Nuevo método para procesar los datos escaneados
  private procesarDatosQR(datos: string) {
    try {
      const asistenciaData: Asistencia = JSON.parse(datos); // Asumiendo que el QR contiene un JSON
      this.asistenciaService.setAsistencia(asistenciaData); // Enviar los datos al servicio
    } catch (error) {
      console.error('Error al procesar los datos del QR: ', error);
      this.presentAlert('Error', 'Los datos del QR no son válidos.');
    }
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
