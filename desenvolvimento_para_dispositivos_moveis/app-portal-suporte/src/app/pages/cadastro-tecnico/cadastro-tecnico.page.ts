import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
  IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonToast, IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { DadosService } from '../../services/dados.service';
import { Tecnico } from '../../models/tecnico.model';

@Component({
  selector: 'app-cadastro-tecnico',
  templateUrl: './cadastro-tecnico.page.html',
  styleUrls: ['./cadastro-tecnico.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons,
    IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonIcon, IonToast, IonNote
  ]
})
export class CadastroTecnicoPage {

  // ── Campos do formulário ──────────────────────────────────────────────────
  nome = '';
  especialidade: Tecnico['especialidade'] = 'Hardware';
  contato = '';
  situacao: Tecnico['situacao'] = 'Ativo';

  // ── Opções dos selects ────────────────────────────────────────────────────
  especialidades: Tecnico['especialidade'][] = [
    'Hardware', 'Software', 'Rede', 'Impressora', 'Sistema interno', 'Outros'
  ];
  situacoes: Tecnico['situacao'][] = ['Ativo', 'Inativo'];

  // ── Toast ─────────────────────────────────────────────────────────────────
  toastAberto = false;
  toastMensagem = '';
  toastCor = 'danger';

  constructor(
    private dadosService: DadosService,
    private navCtrl: NavController
  ) {
    addIcons({ saveOutline });
  }

  get formularioValido(): boolean {
    return (
      this.nome.trim() !== '' &&
      this.especialidade !== undefined &&
      this.contato.trim() !== ''
    );
  }

  salvar() {
    if (!this.formularioValido) {
      this.toastMensagem = 'Preencha todos os campos obrigatórios';
      this.toastCor = 'danger';
      this.toastAberto = true;
      return;
    }

    this.dadosService.adicionarTecnico({
      id: this.dadosService.gerarIdTecnico(),
      nome: this.nome.trim(),
      especialidade: this.especialidade,
      contato: this.contato.trim(),
      situacao: this.situacao
    });

    this.toastMensagem = 'Técnico cadastrado com sucesso!';
    this.toastCor = 'success';
    this.toastAberto = true;

    setTimeout(() => this.navCtrl.navigateBack('/lista-tecnicos'), 1200);
  }
}
