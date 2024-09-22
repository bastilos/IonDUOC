import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuarioAutenticado: Usuario | null = null;

  // Guardar el usuario autenticado
  setUsuarioAutenticado(usuario: Usuario) {
    this.usuarioAutenticado = usuario;
  }

  // Obtener el usuario autenticado
  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioAutenticado;
  }

  actualizarUsuario(usuarioActualizado: Usuario): boolean {
    if (this.usuarioAutenticado?.correo === usuarioActualizado.correo) {
      this.usuarioAutenticado = usuarioActualizado;  // Actualiza el usuario autenticado en memoria
      return true;
    }
    return false;
  }
  
}
