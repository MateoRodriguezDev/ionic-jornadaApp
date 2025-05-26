import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonItem, IonInput, IonIcon, IonButton, IonToast } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonImg, IonIcon, IonItem, IonInput, IonButton, IonToast]
})
export class LoginPage implements OnInit {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  email: string = '';
  password: string = '';
  toastMessage: string = '';
  showToast: boolean = false;

  public toastButtons = [
    {
      text: 'Dismiss',
      role: 'cancel',
    },
  ];

  ngOnInit() { 
    const token = localStorage.getItem('access_token')

    if(token) {
      this.router.navigate(['/jornada-board'])
    }

  }

  login() {
    this.apiService.post('auth/login', { email: this.email, password: this.password }).subscribe(
      (res: any) => {
        localStorage.setItem('access_token', res.token);
        this.toastMessage = 'Login Exitoso'
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.router.navigate(['/jornada-board'])
        console.log('Token guardado');
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
}

