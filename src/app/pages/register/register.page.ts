import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonItem, IonInput, IonIcon, IonButton, IonToast } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonImg, IonIcon, IonItem, IonInput, IonButton, IonToast]
})
export class RegisterPage implements OnInit {

  constructor(
    private apiService: ApiService,
    private router : Router
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
  }

  register() {
    this.apiService.post('auth/register', { email: this.email, password: this.password }).subscribe(
      (res: any) => {
        localStorage.setItem('access_token', res.token);
        this.toastMessage = 'Registro Exitoso'
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false
          this.router.navigate(['/login'])
        }, 3000);
        console.log('Cuenta Creada');
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
