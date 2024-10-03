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
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      this.setUsuarioAutenticado(usuario);
    }
    return this.usuarioAutenticado;
  }

  actualizarUsuario(usuarioActualizado: Usuario): boolean {
    if (this.usuarioAutenticado?.correo === usuarioActualizado.correo) {
      this.usuarioAutenticado = usuarioActualizado;  // Actualiza el usuario autenticado en memoria
      sessionStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      return true;
    }
    return false;
  }
  
}
