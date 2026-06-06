import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FinancialPage } from './financial.page';

@NgModule({
  declarations: [FinancialPage],
  imports: [
    CommonModule, IonicModule,
    RouterModule.forChild([{ path: '', component: FinancialPage }])
  ],
})
export class FinancialPageModule {}
