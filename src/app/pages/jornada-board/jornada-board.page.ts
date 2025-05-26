import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCard, IonIcon, IonButton, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from 'src/services/api.service';
import { Jornada } from 'src/interfaces/jornada.interface';


@Component({
  selector: 'app-jornada-board',
  templateUrl: './jornada-board.page.html',
  styleUrls: ['./jornada-board.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonImg, IonCard, IonIcon, IonButton, IonItem, IonLabel, IonList]
})
export class JornadaBoardPage implements OnInit {

  latitud: number = 0;
  longitud: number = 0;
  token: string | null = null;
  jornadas: Jornada[] = []
  jornadasFiltradas: Jornada[] = []

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('access_token')

    if (!this.token) {
      this.router.navigate(['/login'])
    }

    this.obtenerUbicacion()
    this.getJornadas()
  }

  async obtenerUbicacion() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitud = coordinates.coords.latitude
    this.longitud = coordinates.coords.longitude
    console.log('Latitud:', this.latitud);
    console.log('Longitud:', this.longitud);
  }


  logout() {
    localStorage.removeItem('access_token')
    this.router.navigate(['/login'])
  }

  getJornadas() {
    this.apiService.get('jornadas/mis-jornadas',).subscribe(
      (res: any) => {
       if(typeof res === 'object'){
        res.map((jornada: Jornada) => {
          this.jornadas.push(jornada)
          this.jornadasFiltradas.push(jornada)
        });
       }
      },
      (err: any) => {
        console.log(err)
      }
    );
  }

  mostrarTodas(){
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


  cambiarEstadoJornada(jornada: Jornada) {
    this.apiService.post(`jornadas/change-jornada-state/${jornada.id}`, {lat: this.latitud, long: this.longitud}).subscribe(
      (res: any) => {
       console.log(res)
      },
      (err: any) => {
        console.log(err.error.message)
      }
    );
  }

}
