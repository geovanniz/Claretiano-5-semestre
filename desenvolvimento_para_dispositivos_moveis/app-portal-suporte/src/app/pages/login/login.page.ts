import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle,
  IonContent, IonItem, IonLabel, IonInput,
  IonButton, IonToast, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, logInOutline, constructOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonItem, IonLabel, IonInput,
    IonButton, IonToast, IonIcon
  ]
})
export class LoginPage {
  usuario = '';
  senha = '';
  toastAberto = false;
  toastMensagem = '';

  constructor(private navCtrl: NavController) {
    addIcons({ personOutline, lockClosedOutline, logInOutline, constructOutline });
  }

  entrar() {
    if (this.usuario.trim() === '' || this.senha.trim() === '') {
      this.toastMensagem = 'Preencha usuário e senha';
      this.toastAberto = true;
      return;
    }

    // NavController.navigateRoot substitui o histórico de navegação,
    // impedindo que o botão físico "Voltar" retorne ao Login.
    this.navCtrl.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
  }

  fecharToast() {
    this.toastAberto = false;
  }
}
