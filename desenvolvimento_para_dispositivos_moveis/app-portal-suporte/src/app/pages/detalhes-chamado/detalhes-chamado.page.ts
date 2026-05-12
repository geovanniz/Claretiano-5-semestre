import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonItem, IonLabel, IonBadge, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';
import { Chamado } from '../../models/chamado.model';

@Component({
  selector: 'app-detalhes-chamado',
  templateUrl: './detalhes-chamado.page.html',
  styleUrls: ['./detalhes-chamado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonItem, IonLabel, IonBadge, IonButton, IonIcon
  ]
})
export class DetalhesChamadoPage implements OnInit {

  chamado: Chamado | undefined;

  constructor(
    private route: ActivatedRoute,
    private dadosService: DadosService,
    private navCtrl: NavController
  ) {
    addIcons({ createOutline });
  }

  ngOnInit() {
    this.carregarChamado();
  }

  ionViewWillEnter() {
    this.carregarChamado();
  }

  carregarChamado() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.chamado = this.dadosService.buscarChamadoPorId(id);
  }

  atualizarStatus() {
    if (this.chamado) {
      this.navCtrl.navigateForward(`/atualizar-status/${this.chamado.id}`);
    }
  }

  corStatus(status: string): string {
    const mapa: Record<string, string> = {
      'Aberto':         'danger',
      'Em atendimento': 'warning',
      'Concluído':      'success',
      'Cancelado':      'medium'
    };
    return mapa[status] ?? 'primary';
  }

  corPrioridade(prioridade: string): string {
    const mapa: Record<string, string> = {
      'Baixa':   'success',
      'Média':   'warning',
      'Alta':    'tertiary',
      'Urgente': 'danger'
    };
    return mapa[prioridade] ?? 'medium';
  }
}
