import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public usuario?: Usuario; // Propiedad opcional para evitar error de inicialización
  public respuesta: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private animationController: AnimationController
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state && navigation.extras.state['usuario']) {
        this.usuario = navigation.extras.state['usuario'];
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

  ngOnInit() { }

  public validarRespuestaSecreta(): void {
    if (this.usuario && this.usuario.respuestaSecreta === this.respuesta) {
      alert('CORRECTO!!! TU CLAVE ES ' + this.usuario.password);
    } else {
      alert('INCORRECTO!!!');
    }
  }
}
