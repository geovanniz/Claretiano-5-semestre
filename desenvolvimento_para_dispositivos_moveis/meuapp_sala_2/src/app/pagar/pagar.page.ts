import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.page.html',
  styleUrls: ['./pagar.page.scss'],
  standalone: false,
})
export class PagarPage implements OnInit {

  fornecedor: string = '';
  vencimento: string = '';
  pagamento: string = '';
  valor: string = '';
  listaPagar: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  criarPagamento() {
    return {
      fornecedor: this.fornecedor,
      vencimento: this.vencimento,
      pagamento: this.pagamento,
      valor: this.valor
    };
  }

  cadastrar() {
    this.listaPagar.unshift(this.criarPagamento());
    this.limparFormulario();
  }

  excluir(posicao: number) {
    this.listaPagar.splice(posicao, 1);
  }

  limparFormulario() {
    this.fornecedor = '';
    this.vencimento = '';
    this.pagamento = '';
    this.valor = '';
  }

}
