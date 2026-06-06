import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/cadastros"></ion-back-button>
        </ion-buttons>
        <ion-title>Produtos</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="router.navigate(['/tabs/cadastros/products/new'])">
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
        <ion-item-sliding *ngFor="let p of filtered">
          <ion-item [routerLink]="['/tabs/cadastros/products', p.id]" detail>
            <ion-label>
              <h2>{{ p.name }}</h2>
              <p>{{ p.sku }} · {{ p.category }}</p>
            </ion-label>
            <div slot="end" class="ion-text-right">
              <p>{{ p.price | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
              <ion-badge [color]="p.stock < 5 ? 'danger' : 'medium'">
                Estq: {{ p.stock }}
              </ion-badge>
            </div>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="confirmDelete(p)">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button [routerLink]="['/tabs/cadastros/products/new']">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class ProductListPage implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];

  constructor(
    public router: Router,
    private productsService: ProductsService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.productsService.getAll().subscribe(ps => {
      this.products = ps;
      this.filtered = ps;
    });
  }

  filter(event: CustomEvent): void {
    const q = (event.detail.value as string).toLowerCase();
    this.filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }

  async confirmDelete(p: Product): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Remover "${p.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover', role: 'destructive',
          handler: () => {
            this.productsService.remove(p.id).subscribe(() => {
              this.products = this.products.filter(x => x.id !== p.id);
              this.filtered = this.filtered.filter(x => x.id !== p.id);
              this.toastCtrl.create({
                message: 'Produto removido.', duration: 2000, color: 'success',
              }).then(t => t.present());
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
