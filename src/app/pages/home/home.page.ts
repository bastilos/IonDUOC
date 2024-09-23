import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicSafeString } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Persona } from 'src/app/model/persona';
import { UserService } from 'src/app/services/user.service';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  
  public usuario: Usuario = new Usuario('', '', '', '', '', '');

  public nivelesEducacionales: NivelEducacional[] = new NivelEducacional().getNivelesEducacionales();

  public persona: Persona = new Persona();

 
  /*
    En el constructor del HomePage se ponen como parametros los siguientes objetos:
      (1) activeroute (del tipo de dato ActivatedRoute) y router (del tipo de dato Router),
      que se usarán para obtener los datos enviados por la página que invocó a "home".
      (2) alertController (del tipo de dato AlertController), que se usará para mostrar
      mensajes emergentes en la pantalla.

    Nótese que los parámetros tuvieron que declararse con "private", y esto es necesario
    para que los parámetros pasen a considerarse automáticamente como propiedades
    de la clase "HomePage" y de este modo puedan usarse dentro de los otros métodos.
   */
   constructor(
        private activeroute: ActivatedRoute
      , private router: Router
      , private alertController: AlertController,
        private userService: UserService,
        private loadingController: LoadingController,
        private animationController: AnimationController
      ) {

        this.activeroute.queryParams.subscribe(params => {
          const navigation = this.router.getCurrentNavigation();
          if (navigation && navigation.extras.state) {
            this.usuario = navigation.extras.state['usuario'];
            this.userService.setUsuarioAutenticado(this.usuario); // Guarda el usuario en el servicio
          } else {
            this.router.navigate(['/login']);
          }
        });

    // Se llama a la ruta activa y se obtienen sus parámetros mediante una subscripcion
    this.activeroute.queryParams.subscribe(params => {       // Utilizamos expresión lambda
      const navigation = this.router.getCurrentNavigation();
      if (navigation) {
        if (navigation.extras.state) { // Validar que tenga datos extras
          // Si tiene datos extra, se rescatan y se asignan a una propiedad
          this.usuario = navigation.extras.state['usuario'];
        } else {
          /*
            Si no vienen datos extra desde la página anterior, quiere decir que el usuario
            intentó entrar directamente a la página home sin pasar por el login,
            de modo que el sistema debe enviarlo al login para que inicie sesión.
          */
          this.router.navigate(['/login']);
        }
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

public ngOnInit() {
  if (this.usuario) {
    this.persona.nombre = this.usuario.nombre;
    this.persona.apellido = this.usuario.apellido;
    this.persona.fechaNacimiento = this.usuario.fechaNacimiento;
    this.persona.nivelEducacional = this.usuario.nivelEducacional; 
  }
}

public limpiarFormulario(): void {
  /*
    El método limpiar recorre cada uno de los campos de la propiedad persona,
    de modo que la variable "key" va tomando el nombre de dichos campos (nombre,
    apellido, etc.) y "value" adopta el valor que tiene en ese momento el
    campo asociado a key.
  */
  for (const [key, value] of Object.entries(this.persona)) {
    /*
      Con la siguiente instrucción se cambia el valor de cada campo
      de la propiedad persona, y como los controles gráficos están
      asociados a dichos nombres de campos a través de ngModel, entonces
      al limpiar el valor del campo, también se limpia el control gráfico.
    */
      Object.defineProperty(this.persona, key, {value: ''});
    }
    this.persona.nivelEducacional = new NivelEducacional();
  }

 
  public mostrarDatosPersona(): void {
    if (this.usuario) {
      this.persona.nombre = this.usuario.nombre;
      this.persona.apellido = this.usuario.apellido;
      this.persona.fechaNacimiento = this.usuario.fechaNacimiento;
      this.persona.nivelEducacional = this.usuario.nivelEducacional;
    } else {
      console.log('No hay usuario cargado.');
    }

    // Mostrar un mensaje emergente con los datos de la persona
    let mensaje = '<br><b>Usuario:</b> ' + this.usuario.correo;
    mensaje += '<br><b>Nombre:</b> ' + this.persona.nombre;
    mensaje += '<br><b>Apellido:</b> ' + this.persona.apellido;
    mensaje += '<br><b>Educación:</b> ' + this.persona.getTextoNivelEducacional();
    mensaje += '<br><b>Nacimiento:</b> ' + this.persona.getTextoFechaNacimiento();

    this.presentAlert('Datos personales', mensaje);
  }

  // Este método sirve para mostrar el mensaje emergente
  public async presentAlert(titulo: string, mensaje: string) {

    const alert = await this.alertController.create({
      header: titulo,
      message: new IonicSafeString(mensaje),
      buttons: ['OK']
    });

    await alert.present();
  }
  public actualizarDatos(): void {
    if (this.usuario) {
      const usuarioActualizado = new Usuario(
        this.usuario.correo,
        this.usuario.password,
        this.persona.nombre,
        this.persona.apellido,
        this.usuario.preguntaSecreta,
        this.usuario.respuestaSecreta,
        this.persona.nivelEducacional,
        this.persona.fechaNacimiento
      );
  
      const actualizado = this.userService.actualizarUsuario(usuarioActualizado);
  
      if (actualizado) {
        this.presentAlert('Actualización', 'Los datos han sido actualizados correctamente.');
      } else {
        this.presentAlert('Error', 'No se pudo actualizar el usuario.');
      }
    }
  }
}
