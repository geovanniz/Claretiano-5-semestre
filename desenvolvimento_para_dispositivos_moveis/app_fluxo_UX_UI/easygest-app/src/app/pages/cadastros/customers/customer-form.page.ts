import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CustomersService } from '../../../core/services/customers.service';

@Component({
  selector: 'app-customer-form',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/cadastros/customers"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit ? 'Editar' : 'Novo' }} cliente</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="save()">
        <ion-item>
          <ion-label position="floating">Nome *</ion-label>
          <ion-input formControlName="name"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Tipo de Documento</ion-label>
          <ion-select formControlName="doc_type" placeholder="Selecionar">
            <ion-select-option value="CPF">CPF</ion-select-option>
            <ion-select-option value="CNPJ">CNPJ</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Documento *</ion-label>
          <ion-input formControlName="doc_number" [placeholder]="docPlaceholder"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input formControlName="email" type="email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Telefone</ion-label>
          <ion-input formControlName="phone" type="tel"></ion-input>
        </ion-item>

        <ion-button
          expand="block"
          type="submit"
          class="ion-margin-top"
          [disabled]="form.invalid">
          {{ isEdit ? 'Salvar alterações' : 'Cadastrar cliente' }}
        </ion-button>
      </form>
    </ion-content>
  `,
})
export class CustomerFormPage implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private customerId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:       ['', Validators.required],
      doc_type:   ['CPF', Validators.required],
      doc_number: ['', Validators.required],
      email:      [''],
      phone:      [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.customerId = +id;
      this.customersService.getById(+id).subscribe(c => this.form.patchValue(c));
    }
  }

  get docPlaceholder(): string {
    return this.form.get('doc_type')?.value === 'CNPJ' ? '00.000.000/0000-00' : '000.000.000-00';
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    const obs = this.isEdit
      ? this.customersService.update(this.customerId!, this.form.value)
      : this.customersService.create(this.form.value);

    obs.subscribe({
      next: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: `Cliente ${this.isEdit ? 'atualizado' : 'cadastrado'}!`,
          duration: 2000, color: 'success',
        });
        toast.present();
        this.router.navigateByUrl('/tabs/cadastros/customers');
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
