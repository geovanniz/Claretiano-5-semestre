import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonIcon, IonToast, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';
import { Chamado } from '../../models/chamado.model';

@Component({
  selector: 'app-atualizar-status',
  templateUrl: './atualizar-status.page.html',
  styleUrls: ['./atualizar-status.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonTextarea, IonButton, IonIcon, IonToast, IonBadge
  ]
})
export class AtualizarStatusPage implements OnInit {

  chamado: Chamado | undefined;

  novoStatus: Chamado['status'] = 'Aberto';
  observacao = '';

  statusOpcoes: Chamado['status'][] = ['Aberto', 'Em atendimento', 'Concluído', 'Cancelado'];

  toastAberto = false;
  toastMensagem = '';
  toastCor = 'success';

  constructor(
    private route: ActivatedRoute,
    private dadosService: DadosService,
    private navCtrl: NavController
  ) {
    addIcons({ checkmarkCircleOutline });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.chamado = this.dadosService.buscarChamadoPorId(id);
    if (this.chamado) {
      this.novoStatus = this.chamado.status;
      this.observacao = this.chamado.observacao;
    }
  }

  salvar() {
    if (!this.chamado) return;

    this.dadosService.atualizarStatus(this.chamado.id, this.novoStatus, this.observacao);

    this.toastMensagem = 'Status atualizado com sucesso!';
    this.toastCor = 'success';
    this.toastAberto = true;

    setTimeout(() => this.navCtrl.navigateBack('/lista-chamados'), 1200);
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
}
