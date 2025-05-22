import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-jornada-board',
  templateUrl: './jornada-board.page.html',
  styleUrls: ['./jornada-board.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonImg]
})
export class JornadaBoardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
