import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonBadge, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline, timeOutline, closeCircleOutline,
  ellipseOutline, alertCircleOutline, barChartOutline
} from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';

interface ResumoStatus {
  aberto: number;
  emAtendimento: number;
  concluido: number;
  cancelado: number;
}

interface ResumoPrioridade {
  baixa: number;
  media: number;
  alta: number;
  urgente: number;
}

@Component({
  selector: 'app-resumo',
  templateUrl: './resumo.page.html',
  styleUrls: ['./resumo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonBadge, IonIcon
  ]
})
export class ResumoPage implements OnInit {

  totalGeral = 0;
  status: ResumoStatus = { aberto: 0, emAtendimento: 0, concluido: 0, cancelado: 0 };
  prioridade: ResumoPrioridade = { baixa: 0, media: 0, alta: 0, urgente: 0 };
  temChamados = false;

  statusCards = [
    { label: 'Abertos',         key: 'aberto' as const,        cor: 'danger',  icon: 'ellipse-outline' },
    { label: 'Em Atendimento',  key: 'emAtendimento' as const,  cor: 'warning', icon: 'time-outline' },
    { label: 'Concluídos',      key: 'concluido' as const,      cor: 'success', icon: 'checkmark-circle-outline' },
    { label: 'Cancelados',      key: 'cancelado' as const,      cor: 'medium',  icon: 'close-circle-outline' },
  ];

  prioridadeCards = [
    { label: 'Baixa',   key: 'baixa' as const,   cor: 'success',  icon: 'ellipse-outline' },
    { label: 'Média',   key: 'media' as const,    cor: 'warning',  icon: 'alert-circle-outline' },
    { label: 'Alta',    key: 'alta' as const,     cor: 'tertiary', icon: 'alert-circle-outline' },
    { label: 'Urgente', key: 'urgente' as const,  cor: 'danger',   icon: 'alert-circle-outline' },
  ];

  constructor(private dadosService: DadosService) {
    addIcons({
      checkmarkCircleOutline, timeOutline, closeCircleOutline,
      ellipseOutline, alertCircleOutline, barChartOutline
    });
  }

  ngOnInit() {
    this.carregarResumo();
  }

  // Atualiza sempre que a tela fica visível — dados são em tempo real
  ionViewWillEnter() {
    this.carregarResumo();
  }

  carregarResumo() {
    this.status = this.dadosService.getTotalPorStatus();
    this.prioridade = this.dadosService.getTotalPorPrioridade();
    this.totalGeral = this.dadosService.listarChamados().length;
    this.temChamados = this.totalGeral > 0;
  }
}
