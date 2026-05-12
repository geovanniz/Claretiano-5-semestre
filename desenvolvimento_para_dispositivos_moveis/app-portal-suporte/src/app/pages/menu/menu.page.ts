import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, listOutline, personAddOutline, peopleOutline,
  barChartOutline, informationCircleOutline, logOutOutline, constructOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonButton, IonIcon
  ]
})
export class MenuPage {

  opcoes = [
    { label: 'Cadastrar Chamado',  icon: 'add-circle-outline',         rota: '/cadastro-chamado', cor: 'primary' },
    { label: 'Lista de Chamados',  icon: 'list-outline',               rota: '/lista-chamados',   cor: 'primary' },
    { label: 'Cadastrar Técnico',  icon: 'person-add-outline',         rota: '/cadastro-tecnico', cor: 'primary' },
    { label: 'Lista de Técnicos',  icon: 'people-outline',             rota: '/lista-tecnicos',   cor: 'primary' },
    { label: 'Resumo',             icon: 'bar-chart-outline',          rota: '/resumo',           cor: 'primary' },
    { label: 'Sobre',              icon: 'information-circle-outline', rota: '/sobre',            cor: 'medium'  },
  ];

  constructor(private navCtrl: NavController) {
    addIcons({
      addCircleOutline, listOutline, personAddOutline, peopleOutline,
      barChartOutline, informationCircleOutline, logOutOutline, constructOutline
    });
  }

  navegar(rota: string) {
    this.navCtrl.navigateForward(rota);
  }

  sair() {
    // Limpa todo o histórico de navegação e volta ao login
    this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'back' });
  }
}
