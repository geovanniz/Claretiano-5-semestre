import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CustomersService } from '../../../core/services/customers.service';
import { Customer } from '../../../core/models';

@Component({
  selector: 'app-customer-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/cadastros"></ion-back-button>
        </ion-buttons>
        <ion-title>Clientes</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="router.navigate(['/tabs/cadastros/customers/new'])">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="Buscar..." (ionInput)="filter($event)"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let c of filtered">
          <ion-item [routerLink]="['/tabs/cadastros/customers', c.id]" detail>
            <ion-label>
              <h2>{{ c.name }}</h2>
              <p>{{ c.email }} · {{ c.phone }}</p>
            </ion-label>
            <div slot="end" class="ion-text-right">
              <ion-badge color="primary">
                {{ c.doc_type }}
              </ion-badge>
            </div>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="confirmDelete(c)">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button [routerLink]="['/tabs/cadastros/customers/new']">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class CustomerListPage implements OnInit {
  customers: Customer[] = [];
  filtered: Customer[] = [];

  constructor(
    public router: Router,
    private customersService: CustomersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.customersService.getAll().subscribe(cs => {
      this.customers = cs;
      this.filtered = cs;
    });
  }

  filter(event: CustomEvent): void {
    const q = (event.detail.value as string).toLowerCase();
    this.filtered = this.customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.doc_number.includes(q)
    );
  }

  async confirmDelete(c: Customer): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Remover "${c.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover', role: 'destructive',
          handler: () => {
            this.customersService.remove(c.id).subscribe(() => {
              this.customers = this.customers.filter(x => x.id !== c.id);
              this.filtered = this.filtered.filter(x => x.id !== c.id);
              this.toastCtrl.create({
                message: 'Cliente removido.', duration: 2000, color: 'success',
              }).then(t => t.present());
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
