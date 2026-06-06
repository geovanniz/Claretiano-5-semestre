import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../core/services/financial.service';
import { SalesService } from '../../core/services/sales.service';
import { Sale, FinancialSummary } from '../../core/models';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-financial',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Financeiro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid *ngIf="summary">
        <ion-row>
          <ion-col size="6">
            <div class="stat-card success">
              <p class="stat-label">Recebido</p>
              <p class="stat-value">{{ summary.total_received | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
            </div>
          </ion-col>
          <ion-col size="6">
            <div class="stat-card warning">
              <p class="stat-label">A receber</p>
              <p class="stat-value">{{ summary.total_pending | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-list-header><ion-label>Lançamentos</ion-label></ion-list-header>
      <ion-list>
        <ion-item *ngFor="let sale of sales" [detail]="sale.status === 'pendente'">
          <ion-label>
            <h2>{{ sale.customer_name }}</h2>
            <p>{{ sale.created_at | date:'dd/MM/yyyy' }} · Venda #{{ sale.id }}</p>
          </ion-label>
          <div slot="end" class="ion-text-right">
            <p>{{ sale.total | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
            <ion-badge [color]="sale.status === 'pago' ? 'success' : sale.status === 'cancelado' ? 'medium' : 'warning'">
              {{ sale.status }}
            </ion-badge>
            <ion-button *ngIf="sale.status === 'pendente'" fill="outline" size="small"
              (click)="openBoleto(sale.id)">
              Boleto
            </ion-button>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class FinancialPage implements OnInit {
  summary?: FinancialSummary;
  sales: Sale[] = [];

  constructor(
    private financialService: FinancialService,
    private salesService: SalesService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.financialService.getSummary().subscribe(s => this.summary = s);
    this.salesService.getAll().subscribe(s => this.sales = s);
  }

  async openBoleto(saleId: number): Promise<void> {
    this.financialService.getBoleto(saleId).subscribe(async boleto => {
      const alert = await this.alertCtrl.create({
        header: `Boleto #${boleto.boleto_number}`,
        message: `
          <strong>Pagador:</strong> ${boleto.payer_name}<br>
          <strong>Doc:</strong> ${boleto.payer_doc}<br>
          <strong>Valor:</strong> R$ ${boleto.amount.toFixed(2)}<br>
          <strong>Vencimento:</strong> ${new Date(boleto.due_date).toLocaleDateString('pt-BR')}<br>
          <br>
          <small>${boleto.barcode}</small>
        `,
        buttons: [
          { text: 'Fechar' },
          {
            text: 'Marcar como pago',
            handler: () => {
              this.salesService.updateStatus(saleId, 'pago').subscribe(() => {
                this.load();
                this.toastCtrl.create({
                  message: 'Venda marcada como paga!', duration: 2000, color: 'success',
                }).then(t => t.present());
              });
            },
          },
        ],
      });
      await alert.present();
    });
  }
}
