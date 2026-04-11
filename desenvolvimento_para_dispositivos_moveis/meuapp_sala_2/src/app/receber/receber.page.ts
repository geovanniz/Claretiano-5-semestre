import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receber',
  templateUrl: './receber.page.html',
  styleUrls: ['./receber.page.scss'],
  standalone: false,
})
export class ReceberPage implements OnInit {

  cliente: string = '';
  vencimento: string = '';
  pagamento: string = '';
  valor: string = '';
  listaReceber: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  criarCobranca() {
    return {
      cliente: this.cliente,
      vencimento: this.vencimento,
      pagamento: this.pagamento,
      valor: this.valor
    };
  }

  cadastrar() {
    this.listaReceber.unshift(this.criarCobranca());
    this.limparFormulario();
  }

  excluir(posicao: number) {
    this.listaReceber.splice(posicao, 1);
  }

  limparFormulario() {
    this.cliente = '';
    this.vencimento = '';
    this.pagamento = '';
    this.valor = '';
  }

}
