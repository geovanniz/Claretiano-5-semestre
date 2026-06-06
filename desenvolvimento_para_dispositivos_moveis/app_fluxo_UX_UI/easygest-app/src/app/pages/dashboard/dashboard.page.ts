import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SalesService } from '../../core/services/sales.service';
import { FinancialService } from '../../core/services/financial.service';
import { Sale, FinancialSummary } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Olá, {{ auth.currentUser()?.name?.split(' ')[0] }} 👋</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="auth.logout()">
            <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="load($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <div class="stat-card success">
              <p class="stat-label">Recebido</p>
              <p class="stat-value">{{ summary?.total_received | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
            </div>
          </ion-col>
          <ion-col size="6">
            <div class="stat-card warning">
              <p class="stat-label">A receber</p>
              <p class="stat-value">{{ summary?.total_pending | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
            </div>
          </ion-col>
          <ion-col size="6">
            <div class="stat-card">
              <p class="stat-label">Vendas</p>
              <p class="stat-value">{{ summary?.sales_count }}</p>
            </div>
          </ion-col>
          <ion-col size="6">
            <div class="stat-card">
              <p class="stat-label">Pendentes</p>
              <p class="stat-value">{{ summary?.pending_count }}</p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-list-header>
        <ion-label>Vendas recentes</ion-label>
      </ion-list-header>

      <ion-list lines="full">
        <ion-item *ngFor="let sale of recentSales">
          <ion-label>
            <h2>{{ sale.customer_name }}</h2>
            <p>{{ sale.created_at | date:'dd/MM/yyyy' }}</p>
          </ion-label>
          <div slot="end" class="ion-text-right">
            <p>{{ sale.total | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
            <ion-badge [color]="sale.status === 'pago' ? 'success' : 'warning'">
              {{ sale.status }}
            </ion-badge>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class DashboardPage implements OnInit {
  summary?: FinancialSummary;
  recentSales: Sale[] = [];

  constructor(
    public auth: AuthService,
    private salesService: SalesService,
    private financialService: FinancialService,
  ) {}

  ngOnInit(): void { this.load(); }

  load(event?: unknown): void {
    this.financialService.getSummary().subscribe(s => {
      this.summary = s;
      (event as { target: { complete: () => void } })?.target?.complete();
    });
    this.salesService.getAll().subscribe(sales => {
      this.recentSales = sales.slice(0, 5);
    });
  }
}
