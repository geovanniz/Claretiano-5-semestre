import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonList, IonItem, IonLabel, IonBadge,
  IonFab, IonFabButton, IonIcon, IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, clipboardOutline } from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';
import { Chamado } from '../../models/chamado.model';

@Component({
  selector: 'app-lista-chamados',
  templateUrl: './lista-chamados.page.html',
  styleUrls: ['./lista-chamados.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonList, IonItem, IonLabel, IonBadge,
    IonFab, IonFabButton, IonIcon, IonNote
  ]
})
export class ListaChamadosPage implements OnInit {

  chamados: Chamado[] = [];

  constructor(
    private dadosService: DadosService,
    private navCtrl: NavController
  ) {
    addIcons({ addOutline, clipboardOutline });
  }

  ngOnInit() {
    this.carregarChamados();
  }

  // Recarrega sempre que a tela fica visível (após salvar, voltar, etc.)
  ionViewWillEnter() {
    this.carregarChamados();
  }

  carregarChamados() {
    // Cópia reversa → chamados mais recentes no topo
    this.chamados = [...this.dadosService.listarChamados()].reverse();
  }

  abrirDetalhes(id: number) {
    this.navCtrl.navigateForward(`/detalhes-chamado/${id}`);
  }

  novoChamado() {
    this.navCtrl.navigateForward('/cadastro-chamado');
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
