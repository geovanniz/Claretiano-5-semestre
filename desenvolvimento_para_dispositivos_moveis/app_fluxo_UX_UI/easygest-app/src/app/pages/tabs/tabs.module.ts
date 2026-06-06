// ── tabs.page.ts ──────────────────────────────────────────────────────────────
import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="dashboard">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Início</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sales">
          <ion-icon name="cart-outline"></ion-icon>
          <ion-label>Vendas</ion-label>
          <ion-badge *ngIf="cart.count() > 0" color="success">
            {{ cart.count() }}
          </ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="financial">
          <ion-icon name="bar-chart-outline"></ion-icon>
          <ion-label>Financeiro</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="cadastros">
          <ion-icon name="grid-outline"></ion-icon>
          <ion-label>Cadastros</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor(public cart: CartService) {}
}

// ── tabs-routing.module.ts ────────────────────────────────────────────────────
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const tabRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('../sales/sales.module').then(m => m.SalesPageModule),
      },
      {
        path: 'financial',
        loadChildren: () => import('../financial/financial.module').then(m => m.FinancialPageModule),
      },
      {
        path: 'cadastros',
        loadChildren: () => import('../cadastros/cadastros.module').then(m => m.CadastrosPageModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

// ── tabs.module.ts ────────────────────────────────────────────────────────────
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TabsPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(tabRoutes),
  ],
})
export class TabsPageModule {}
