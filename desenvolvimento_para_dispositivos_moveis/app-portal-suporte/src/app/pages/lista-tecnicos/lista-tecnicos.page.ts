import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonList, IonItem, IonLabel, IonBadge,
  IonButton, IonIcon, IonFab, IonFabButton, IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, personOutline } from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';
import { Tecnico } from '../../models/tecnico.model';

@Component({
  selector: 'app-lista-tecnicos',
  templateUrl: './lista-tecnicos.page.html',
  styleUrls: ['./lista-tecnicos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonList, IonItem, IonLabel, IonBadge,
    IonButton, IonIcon, IonFab, IonFabButton, IonNote
  ]
})
export class ListaTecnicosPage implements OnInit {

  tecnicos: Tecnico[] = [];

  constructor(
    private dadosService: DadosService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    addIcons({ addOutline, trashOutline, personOutline });
  }

  ngOnInit() {
    this.carregarTecnicos();
  }

  // Recarrega sempre que a tela fica visível (após cadastrar, voltar, etc.)
  ionViewWillEnter() {
    this.carregarTecnicos();
  }

  carregarTecnicos() {
    this.tecnicos = this.dadosService.listarTecnicos();
  }

  novoTecnico() {
    this.navCtrl.navigateForward('/cadastro-tecnico');
  }

  async confirmarExclusao(tecnico: Tecnico) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Técnico',
      message: `Deseja excluir <strong>${tecnico.nome}</strong>? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-btn-cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          cssClass: 'alert-btn-excluir',
          handler: () => {
            this.dadosService.excluirTecnico(tecnico.id);
            this.carregarTecnicos();
          }
        }
      ]
    });

    await alert.present();
  }

  corEspecialidade(esp: string): string {
    const mapa: Record<string, string> = {
      'Hardware':        'tertiary',
      'Software':        'primary',
      'Rede':            'success',
      'Impressora':      'warning',
      'Sistema interno': 'secondary',
      'Outros':          'medium'
    };
    return mapa[esp] ?? 'medium';
  }
}
