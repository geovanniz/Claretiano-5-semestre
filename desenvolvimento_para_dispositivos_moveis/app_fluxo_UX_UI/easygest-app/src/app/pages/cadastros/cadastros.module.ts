import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CadastrosPage } from './cadastros.page';

const routes = [
  { path: '', component: CadastrosPage },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule) },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersPageModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule) },
];

@NgModule({
  declarations: [CadastrosPage],
  imports: [
    CommonModule, IonicModule,
    RouterModule.forChild(routes)
  ],
})
export class CadastrosPageModule {}
