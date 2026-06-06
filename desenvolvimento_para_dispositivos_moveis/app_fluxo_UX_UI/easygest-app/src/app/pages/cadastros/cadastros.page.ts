import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastros',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Cadastros</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item button (click)="go('products')" detail>
          <ion-icon name="cube-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>Produtos</h2>
            <p>Estoque e preços</p>
          </ion-label>
        </ion-item>

        <ion-item button (click)="go('customers')" detail>
          <ion-icon name="people-outline" slot="start" color="tertiary"></ion-icon>
          <ion-label>
            <h2>Clientes</h2>
            <p>CPF e CNPJ</p>
          </ion-label>
        </ion-item>

        <ion-item button (click)="go('users')" detail *ngIf="auth.hasRole('admin')">
          <ion-icon name="shield-outline" slot="start" color="warning"></ion-icon>
          <ion-label>
            <h2>Usuários</h2>
            <p>Perfis de acesso</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class CadastrosPage {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  go(page: string): void {
    this.router.navigateByUrl(`/tabs/cadastros/${page}`);
  }
}
