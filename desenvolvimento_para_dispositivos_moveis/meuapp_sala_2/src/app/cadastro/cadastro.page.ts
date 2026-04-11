import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false,
})
export class CadastroPage implements OnInit {

  nome: string = '';
  tipo: string = '';
  endereco: string = '';
  mensagemErro: string = '';
  listaCadastros: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  validarTipo(): boolean {
    const tipoNormalizado = this.tipo.toUpperCase();
    const tipoValido = tipoNormalizado === 'C' || tipoNormalizado === 'F';
    if (!tipoValido) {
      this.mensagemErro = 'Tipo deve ser C ou F';
    }
    return tipoValido;
  }

  criarRegistro() {
    return {
      nome: this.nome,
      tipo: this.tipo.toUpperCase(),
      endereco: this.endereco
    };
  }

  cadastrar() {
    if (this.validarTipo()) {
      this.listaCadastros.unshift(this.criarRegistro());
      this.mensagemErro = '';
      this.limparFormulario();
    }
  }

  excluir(posicao: number) {
    this.listaCadastros.splice(posicao, 1);
  }

  limparFormulario() {
    this.nome = '';
    this.tipo = '';
    this.endereco = '';
  }

}
