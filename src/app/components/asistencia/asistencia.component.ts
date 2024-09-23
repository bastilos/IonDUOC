import { Component, OnInit } from '@angular/core';
import { Asistencia } from '../../interfaces/asistencia';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent implements OnInit {
  asistencias: Asistencia[] = [];

  constructor() {}

  ngOnInit(): void {
    this.obtenerAsistencias();
  }

  obtenerAsistencias(): void {
    this.asistencias = [
      {
        bloqueInicio: 1,
        bloqueTermino: 2,
        dia: 'Lunes',
        horaFin: '10:00',
        horaInicio: '08:00',
        idAsignatura: 'MAT101',
        nombreAsignatura: 'Matemáticas',
        nombreProfesor: 'Juan Pérez',
        seccion: 'A',
        sede: 'Sede Principal',
      },
      {
        bloqueInicio: 3,
        bloqueTermino: 4,
        dia: 'Martes',
        horaFin: '12:00',
        horaInicio: '10:00',
        idAsignatura: 'FIS102',
        nombreAsignatura: 'Física',
        nombreProfesor: 'María López',
        seccion: 'B',
        sede: 'Sede Secundaria',
      },
    ];
  }
}
