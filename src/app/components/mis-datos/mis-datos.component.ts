import { Component } from '@angular/core';
//import { Persona } from 'src/app/model/persona';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent {
  
  public usuario: Usuario = new Usuario('', '', '', '', '', '');

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
  

  constructor(private userService: UserService) {}

  
  
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
  
  

}
