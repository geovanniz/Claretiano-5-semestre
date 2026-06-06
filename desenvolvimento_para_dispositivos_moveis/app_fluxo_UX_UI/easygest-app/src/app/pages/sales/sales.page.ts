import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CustomersService } from '../../core/services/customers.service';
import { ProductsService } from '../../core/services/products.service';
import { SalesService } from '../../core/services/sales.service';
import { Product, Customer } from '../../core/models';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sales',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Nova venda</ion-title>
        <ion-buttons slot="end">
          <ion-button *ngIf="cart.count() > 0" (click)="openCart()">
            <ion-icon name="cart-outline"></ion-icon>
            <ion-badge color="success">{{ cart.count() }}</ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar placeholder="Buscar produto..." (ionInput)="filterProducts($event)"></ion-searchbar>

      <ion-grid>
        <ion-row>
          <ion-col size="6" *ngFor="let p of filteredProducts">
            <ion-card (click)="addToCart(p)">
              <ion-card-content>
                <ion-icon name="cube-outline" size="large" color="medium"></ion-icon>
                <p class="product-name">{{ p.name }}</p>
                <p class="product-price">{{ p.price | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
                <ion-badge color="medium">Estq: {{ p.stock }}</ion-badge>

                <div *ngIf="getCartQty(p.id) > 0" class="qty-control" (click)="$event.stopPropagation()">
                  <ion-button fill="outline" size="small" (click)="cart.remove(p.id)">−</ion-button>
                  <span>{{ getCartQty(p.id) }}</span>
                  <ion-button fill="outline" size="small" (click)="cart.add(p)">+</ion-button>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class SalesPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  customers: Customer[] = [];

  constructor(
    public cart: CartService,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private salesService: SalesService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit(): void {
    this.productsService.getAll().subscribe(p => {
      this.products = p;
      this.filteredProducts = p;
    });
    this.customersService.getAll().subscribe(c => this.customers = c);
  }

  filterProducts(event: CustomEvent): void {
    const q = (event.detail.value as string).toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }

  addToCart(p: Product): void { this.cart.add(p); }

  getCartQty(productId: number): number {
    return this.cart.cartItems().find(i => i.product.id === productId)?.quantity ?? 0;
  }

  async openCart(): Promise<void> {
    const inputs = this.customers.map(c => ({
      type: 'radio' as const,
      label: `${c.name} (${c.doc_type})`,
      value: c.id,
    }));

    const alert = await this.alertCtrl.create({
      header: `Carrinho — ${this.cart.count()} item(s)`,
      subHeader: `Total: R$ ${this.cart.total().toFixed(2)}`,
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Finalizar venda',
          handler: async (customerId: number) => {
            if (!customerId) return false;
            await this.checkout(customerId);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private async checkout(customerId: number): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Registrando venda...' });
    await loading.present();

    this.salesService.create(this.cart.toDTO(customerId)).subscribe({
      next: async sale => {
        this.cart.clear();
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: `Venda #${sale.id} registrada! Gere o boleto em Financeiro.`,
          duration: 4000, color: 'success',
        });
        toast.present();
      },
      error: async (err: Error) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: err.message, duration: 3000, color: 'danger',
        });
        toast.present();
      },
    });
  }
}
