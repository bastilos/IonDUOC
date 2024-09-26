import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Asistencia, AsistenciaService } from '../../services/asistencia.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.page.html',
  styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit, AfterViewInit {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  asistencia: Asistencia | null = null;

  constructor(private asistenciaService: AsistenciaService, private animationController: AnimationController) {}

  ngOnInit() {
    this.asistenciaService.asistencia$.subscribe((data: Asistencia | null) => {
      this.asistencia = data;
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
}
