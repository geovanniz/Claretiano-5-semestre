import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navegarParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  navegarParaPagamentos() {
    this.router.navigate(['/pagar']);
  }

  navegarParaCobrancas() {
    this.router.navigate(['/receber']);
  }

}
