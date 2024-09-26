import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
//import { Persona } from 'src/app/model/persona';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { UserService } from 'src/app/services/user.service';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit, AfterViewInit{
  
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef; public usuario: Usuario = new Usuario('', '', '', '', '', '');

  fechaNacimiento: string = '';
  idNivelEducacional: number = 0;

  nivelesEducacionales: NivelEducacional[] = [];

  ngOnInit() {
    const usuarioAutenticado = this.userService.obtenerUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.usuario = usuarioAutenticado;
      this.idNivelEducacional = this.usuario.nivelEducacional.id;
      this.fechaNacimiento = this.usuario.fechaNacimiento;
    } else {
      alert('No hay usuario autenticado.');
    }
    
    this.cargarNivelesEducacionales();
  }
  

  constructor(private userService: UserService,private loadingController: LoadingController,
    private animationController: AnimationController) {}

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

  cargarNivelesEducacionales() {
    this.nivelesEducacionales = new NivelEducacional().getNivelesEducacionales();
  }

  cambiarNombre(event: any) {
    this.usuario.nombre = event;
  }

  cambiarApellido(event: any) {
    this.usuario.apellido = event;
  }

  cambiarFechaNacimiento(event: any) {
    this.fechaNacimiento = event;
  }

  cambiarNivelEducacional(event: any) {
    this.idNivelEducacional = event;
  }

  limpiarFormulario() {
    this.usuario = new Usuario('', '', '', '', '', '');
    this.fechaNacimiento = '';
    this.idNivelEducacional = 0;
  }

  mostrarDatosusuario() {
    const usuarioAutenticado = this.userService.obtenerUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.usuario = usuarioAutenticado;
      this.idNivelEducacional = this.usuario.nivelEducacional.id;
      this.fechaNacimiento = this.usuario.fechaNacimiento;
      console.log('Datos del usuario cargados:', this.usuario);
    } else {
      alert('No hay usuario autenticado.');
    }
  }  

  actualizarDatos() {
    const actualizado = this.userService.actualizarUsuario(this.usuario);
    
    if (actualizado) {
      alert('Datos actualizados correctamente.');
    } else {
      alert('Error al actualizar los datos.');
    }
  }
  
  get nombreUsuario(): string {
    return this.usuario.correo.split('@')[0]; // Devuelve la parte antes del '@'
  }

}
