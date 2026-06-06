import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProductListPage } from './product-list.page';
import { ProductFormPage } from './product-form.page';

@NgModule({
  declarations: [ProductListPage, ProductFormPage],
  imports: [
    CommonModule, ReactiveFormsModule, IonicModule,
    RouterModule.forChild([
      { path: '',    component: ProductListPage },
      { path: 'new', component: ProductFormPage },
      { path: ':id', component: ProductFormPage },
    ]),
  ],
})
export class ProductsPageModule {}
