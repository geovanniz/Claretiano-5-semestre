import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-product-form',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/cadastros/products"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit ? 'Editar' : 'Novo' }} produto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="save()">
        <ion-item>
          <ion-label position="floating">Nome *</ion-label>
          <ion-input formControlName="name"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">SKU *</ion-label>
          <ion-input formControlName="sku" autocapitalize="characters"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Categoria</ion-label>
          <ion-select formControlName="category" placeholder="Selecionar">
            <ion-select-option *ngFor="let cat of categories" [value]="cat">{{ cat }}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Preço (R$) *</ion-label>
          <ion-input formControlName="price" type="number" step="0.01"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Estoque</ion-label>
          <ion-input formControlName="stock" type="number"></ion-input>
        </ion-item>

        <ion-button
          expand="block"
          type="submit"
          class="ion-margin-top"
          [disabled]="form.invalid">
          {{ isEdit ? 'Salvar alterações' : 'Cadastrar produto' }}
        </ion-button>
      </form>
    </ion-content>
  `,
})
export class ProductFormPage implements OnInit {
  form!: FormGroup;
  isEdit = false;
  categories = ['Eletrônicos', 'Periféricos', 'Móveis', 'Áudio', 'Outros'];
  private productId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:     ['', Validators.required],
      sku:      ['', Validators.required],
      category: ['Eletrônicos', Validators.required],
      price:    [0, [Validators.required, Validators.min(0)]],
      stock:    [0, [Validators.required, Validators.min(0)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.productId = +id;
      this.productsService.getById(+id).subscribe(p => this.form.patchValue(p));
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    const obs = this.isEdit
      ? this.productsService.update(this.productId!, this.form.value)
      : this.productsService.create(this.form.value);

    obs.subscribe({
      next: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: `Produto ${this.isEdit ? 'atualizado' : 'cadastrado'}!`,
          duration: 2000, color: 'success',
        });
        toast.present();
        this.router.navigateByUrl('/tabs/cadastros/products');
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
