import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonCard, IonCardContent,
  IonList, IonItem, IonLabel, IonIcon, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  phonePortraitOutline, schoolOutline, codeSlashOutline,
  layersOutline, informationCircleOutline, checkmarkOutline, constructOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonCard, IonCardContent,
    IonList, IonItem, IonLabel, IonIcon, IonBadge
  ]
})
export class SobrePage {

  readonly anoAtual = new Date().getFullYear();
  infos = [
    {
      icon: 'phone-portrait-outline',
      rotulo: 'Aplicativo',
      valor: 'App de Controle de Chamados Técnicos'
    },
    {
      icon: 'school-outline',
      rotulo: 'Disciplina',
      valor: 'Desenvolvimento Mobile com Ionic/Angular'
    },
    {
      icon: 'information-circle-outline',
      rotulo: 'Objetivo',
      valor: 'Praticar arrays, formulários, navegação e services em Angular'
    },
    {
      icon: 'layers-outline',
      rotulo: 'Tecnologias',
      valor: 'Ionic · Angular · TypeScript'
    },
    {
      icon: 'checkmark-outline',
      rotulo: 'Versão',
      valor: '1.0.0'
    },
  ];

  constructor() {
    addIcons({
      phonePortraitOutline, schoolOutline, codeSlashOutline,
      layersOutline, informationCircleOutline, checkmarkOutline, constructOutline
    });
  }
}
