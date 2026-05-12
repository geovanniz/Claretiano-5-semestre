import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonIcon, IonToast, IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, alertCircleOutline } from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';
import { Tecnico } from '../../models/tecnico.model';

@Component({
  selector: 'app-cadastro-chamado',
  templateUrl: './cadastro-chamado.page.html',
  styleUrls: ['./cadastro-chamado.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonTextarea, IonButton, IonIcon, IonToast, IonNote
  ]
})
export class CadastroChamadoPage implements OnInit {

  // ── Campos do formulário ──────────────────────────────────────────────────
  solicitante = '';
  setor = '';
  titulo = '';
  descricao = '';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente' = 'Baixa';
  tecnico = '';
  observacao = '';
  readonly dataAbertura = new Date().toLocaleDateString('pt-BR');

  // ── Dados auxiliares ──────────────────────────────────────────────────────
  tecnicosAtivos: Tecnico[] = [];
  prioridades: Array<'Baixa' | 'Média' | 'Alta' | 'Urgente'> = ['Baixa', 'Média', 'Alta', 'Urgente'];

  // ── Toast ─────────────────────────────────────────────────────────────────
  toastAberto = false;
  toastMensagem = '';
  toastCor = 'danger';

  constructor(
    private dadosService: DadosService,
    private navCtrl: NavController
  ) {
    addIcons({ saveOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.tecnicosAtivos = this.dadosService.listarTecnicosAtivos();
  }

  // Recarrega técnicos caso alguém seja cadastrado enquanto essa tela estava aberta
  ionViewWillEnter() {
    this.tecnicosAtivos = this.dadosService.listarTecnicosAtivos();
  }

  get formularioValido(): boolean {
    return (
      this.solicitante.trim() !== '' &&
      this.titulo.trim() !== '' &&
      this.descricao.trim() !== '' &&
      this.tecnico !== ''
    );
  }

  salvar() {
    if (!this.formularioValido) {
      this.toastMensagem = 'Preencha todos os campos obrigatórios';
      this.toastCor = 'danger';
      this.toastAberto = true;
      return;
    }

    this.dadosService.adicionarChamado({
      id: this.dadosService.gerarIdChamado(),
      solicitante: this.solicitante.trim(),
      setor: this.setor.trim(),
      titulo: this.titulo.trim(),
      descricao: this.descricao.trim(),
      prioridade: this.prioridade,
      dataAbertura: this.dataAbertura,
      tecnico: this.tecnico,
      status: 'Aberto',
      observacao: this.observacao.trim()
    });

    this.toastMensagem = 'Chamado aberto com sucesso!';
    this.toastCor = 'success';
    this.toastAberto = true;

    setTimeout(() => this.navCtrl.navigateBack('/lista-chamados'), 1200);
  }

  voltar() {
    this.navCtrl.back();
  }
}
