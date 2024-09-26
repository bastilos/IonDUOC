import { Component, OnInit } from '@angular/core';
import { Asistencia, AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.page.html',
  styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit {
  asistencia: Asistencia | null = null;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    this.asistenciaService.asistencia$.subscribe((data: Asistencia | null) => {
      this.asistencia = data;
    });
  }
}
