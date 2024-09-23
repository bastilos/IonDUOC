import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit, AfterViewInit {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileinput') fileinput!: ElementRef<HTMLInputElement>;
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public loading: HTMLIonLoadingElement | null = null;
  public escaneando = false;
  public datosQR = '';

  constructor(
    private loadingController: LoadingController,
    private animationController: AnimationController
  ) {}

  ngOnInit(): void {
    this.comenzarEscaneoQR();

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

    // Si no hay fuente, configura las dimensiones del canvas
    if (!source) {
      this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
      this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    }

    w = this.canvas.nativeElement.width;
    h = this.canvas.nativeElement.height;
    const context = this.canvas.nativeElement.getContext('2d');

    // Verifica si el contexto es nulo
    if (!context) {
      console.error('No se pudo obtener el contexto del canvas.');
      return false;
    }

    context.drawImage(source ? source : this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    const qrCode: QRCode | null = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });

    // Verifica si qrCode es nulo
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
    const input = event.target as HTMLInputElement; // Afirmar que es un HTMLInputElement
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
