import { Usuario } from 'src/app/model/usuario';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit {

  public correo: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  public ingresarPaginaValidarRespuestaSecreta(): void {
    const usuarioEncontrado = Usuario.buscarUsuarioPorCorreo(this.correo);
    if (!usuarioEncontrado) {
      alert('EL CORREO NO EXISTE DENTRO DE LAS CUENTAS VALIDAS DEL SISTEMA');
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
}
 