import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { Router, NavigationExtras } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;


  public correo: string = '';

  constructor(private router: Router,
    private loadingController: LoadingController,
    private animationController: AnimationController,
    private toastController: ToastController) { }

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
  ngOnInit() { }

  public ingresarPaginaValidarRespuestaSecreta(): void {
    const usuarioEncontrado = Usuario.buscarUsuarioPorCorreo(this.correo);
    if (!usuarioEncontrado) {
      this.mostrarMensaje('EL CORREO NO EXISTE DENTRO DE LAS CUENTAS VALIDAS DEL SISTEMA');
    } else {
      console.log('Usuario encontrado:', usuarioEncontrado);
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: usuarioEncontrado
        }
      };
      this.router.navigate(['/pregunta'], navigationExtras);
    }
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000,
        position: 'top'
      });
    toast.present();
  }
}
 