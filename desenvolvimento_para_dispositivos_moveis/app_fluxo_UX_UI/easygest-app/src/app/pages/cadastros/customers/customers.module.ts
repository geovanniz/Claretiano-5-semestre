import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CustomerListPage } from './customer-list.page';
import { CustomerFormPage } from './customer-form.page';

@NgModule({
  declarations: [CustomerListPage, CustomerFormPage],
  imports: [
    CommonModule, ReactiveFormsModule, IonicModule,
    RouterModule.forChild([
      { path: '',    component: CustomerListPage },
      { path: 'new', component: CustomerFormPage },
      { path: ':id', component: CustomerFormPage },
    ]),
  ],
})
export class CustomersPageModule {}
