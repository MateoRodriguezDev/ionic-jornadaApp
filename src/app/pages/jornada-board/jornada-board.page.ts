import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonIcon, IonButton, IonItem, IonLabel, IonList, IonModal, IonAvatar, IonToast } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from 'src/services/api.service';
import { Jornada } from 'src/interfaces/jornada.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { environment } from 'src/environments/environment';
import { User } from 'src/interfaces/user.interface';


@Component({
  selector: 'app-jornada-board',
  templateUrl: './jornada-board.page.html',
  styleUrls: ['./jornada-board.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonIcon, IonButton, IonItem, IonLabel, IonList, IonModal, IonAvatar, IonToast]
})
export class JornadaBoardPage implements OnInit {

  latitud: number = 0;
  longitud: number = 0;
  token: string | null = null;
  firstImgUrl: string | null = null;
  lastImgUrl: string | null = null;
  user: User | null = null
  jornadas: Jornada[] = []
  jornadasFiltradas: Jornada[] = []
  selectedJornada: Jornada | null = null

  toastMessage: string = '';
  showToast: boolean = false;
  public toastButtons = [
    {
      text: 'Dismiss',
      role: 'cancel',
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    //Revisa si hay un token y si no te lleva al login
    this.token = localStorage.getItem('access_token')
    if (!this.token) {
      this.router.navigate(['/login'])
    }

    this.obtenerUbicacion()
    this.getJornadas()
  }

  //Agarra tu ubicación actual
  async obtenerUbicacion() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitud = coordinates.coords.latitude
    this.longitud = coordinates.coords.longitude
  }

  //Te cierra la sesión y te lleva al login
  logout() {
    localStorage.removeItem('access_token')
    this.router.navigate(['/login'])
  }


  //Trae las jornadas y el user al entrar a la vista
  getJornadas() {
    this.apiService.get('jornadas/mis-jornadas',).subscribe(
      (res: any) => {
        if (typeof res === 'object') {
          res.jornadas.map((jornada: Jornada) => {
            this.jornadas.push(jornada)
            this.jornadasFiltradas.push(jornada)
          });

          this.user = res.user
          
        }
      },
      (err: any) => {
        if (typeof err.error.message === 'object') {
          this.toastMessage = err.error.message[0]
        } else if (typeof err.error.message === 'string') {
          this.toastMessage = err.error.message
        }

        console.log(this.toastMessage)

        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
      }
    );
  }

  


  //Logica para filtro de jornadas
  mostrarTodas() {
    this.jornadasFiltradas = this.jornadas
  }

  mostrarPendientes() {
    this.jornadasFiltradas = this.jornadas.filter(jornada => jornada.state === 'Pendiente')
  }

  mostrarEnProceso() {
    this.jornadasFiltradas = this.jornadas.filter(jornada => jornada.state === 'En Proceso')
  }

  mostrarFinalizadas() {
    this.jornadasFiltradas = this.jornadas.filter(jornada => jornada.state === 'Finalizada')
  }


  //Cambia el estado de la jornada al interactuar
  async cambiarEstadoJornada(jornada: Jornada | null) {
    if (jornada) {
      try {
        // Se toma la foto
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera
        });

        // Convertir base64 a blob
        const byteString = atob(image.base64String!);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/jpeg' });

        // Se crea el payload
        const formData = new FormData();
        formData.append('image', blob, 'foto.jpg');
        formData.append('lat', this.latitud.toString());
        formData.append('long', this.longitud.toString());


        this.apiService.postFormData(`jornadas/change-jornada-state/${jornada.id}`, formData).subscribe(
          (res: any) => {
            console.log(res);
          },
          (err: any) => {
            this.toastMessage = typeof err.error.message === 'object' ? err.error.message[0] : err.error.message;
            console.log(this.toastMessage);
            this.showToast = true;
            setTimeout(() => this.showToast = false, 3000);
          }
        );


        //Recargo la pagina para ver los cambios
        window.location.reload();



      } catch (error) {
        console.error('Error al tomar la foto', error);
        this.toastMessage = 'No se pudo capturar la imagen.';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
      }
    }
  }




  abrirModal(jornada: Jornada) {
    this.selectedJornada = jornada

    //Traigo las imagenes tomadas de la jornada
    this.cargarImagen()
    this.setOpen(true)
  }

  //Logica del modal de la jornada
  isModalOpen = false;
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  //Logica para traer las imagenes desde firebase
  async cargarImagen() {

    this.firstImgUrl = null
    this.lastImgUrl = null

    if (this.selectedJornada?.firstImgURL) {
      this.firstImgUrl = `${environment.firebaseBucketUrl}${this.selectedJornada.firstImgURL}`
    }
    if (this.selectedJornada?.lastImgURL) {
      this.lastImgUrl = `${environment.firebaseBucketUrl}${this.selectedJornada.lastImgURL}`
    }
  }

}
