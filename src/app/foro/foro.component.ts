import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Publicacion {
  id?: number;
  titulo: string;
  cuerpo: string;
  autor: string;
}

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
})
export class ForoComponent implements OnInit {
  publicacion: Publicacion = { titulo: '', cuerpo: '', autor: 'Usuario actual' };
  publicaciones: Publicacion[] = [];
  private apiUrl = 'http://localhost:3000/publicaciones';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerPublicaciones();
  }

  obtenerPublicaciones() {
    this.http.get<Publicacion[]>(this.apiUrl).subscribe((data) => {
      this.publicaciones = data;
    });
  }

  guardarPublicacion() {
    if (this.publicacion.id) {
      // Editar publicación existente
      this.http.put(`${this.apiUrl}/${this.publicacion.id}`, this.publicacion).subscribe(() => {
        this.obtenerPublicaciones();
        this.limpiarFormulario();
      });
    } else {
      // Crear nueva publicación
      this.http.post(this.apiUrl, this.publicacion).subscribe(() => {
        this.obtenerPublicaciones();
        this.limpiarFormulario();
      });
    }
  }

  limpiarFormulario() {
    this.publicacion = { titulo: '', cuerpo: '', autor: 'Usuario actual' };
  }

  editarPublicacion(pub: Publicacion) {
    this.publicacion = { ...pub };
  }

  eliminarPublicacion(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.obtenerPublicaciones();
    });
  }
}