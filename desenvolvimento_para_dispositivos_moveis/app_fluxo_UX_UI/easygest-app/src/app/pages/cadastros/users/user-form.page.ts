import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-form',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/cadastros/users"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit ? 'Editar' : 'Novo' }} usuário</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="save()">
        <ion-item>
          <ion-label position="floating">Nome *</ion-label>
          <ion-input formControlName="name"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">E-mail *</ion-label>
          <ion-input formControlName="email" type="email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha {{ isEdit ? '(opcional)' : '*' }}</ion-label>
          <ion-input formControlName="password" type="password"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Perfil</ion-label>
          <ion-select formControlName="role" placeholder="Selecionar">
            <ion-select-option value="admin">Admin</ion-select-option>
            <ion-select-option value="vendedor">Vendedor</ion-select-option>
            <ion-select-option value="estoque">Estoque</ion-select-option>
            <ion-select-option value="financeiro">Financeiro</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button
          expand="block"
          type="submit"
          class="ion-margin-top"
          [disabled]="form.invalid">
          {{ isEdit ? 'Salvar alterações' : 'Cadastrar usuário' }}
        </ion-button>
      </form>
    </ion-content>
  `,
})
export class UserFormPage implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private userId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:     ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: [''], // validator is added conditionally
      role:     ['vendedor', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.userId = +id;
      // In a real scenario, you might get user details here to patch
      // Example: this.usersService.getAll().subscribe(...) then patchValue
    } else {
      this.form.get('password')?.setValidators(Validators.required);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    const payload = { ...this.form.value };
    if (this.isEdit && !payload.password) {
      delete payload.password; // Don't send empty password if editing
    }

    const obs = this.isEdit
      ? this.usersService.update(this.userId!, payload)
      : this.usersService.create(payload);

    obs.subscribe({
      next: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: `Usuário ${this.isEdit ? 'atualizado' : 'cadastrado'}!`,
          duration: 2000, color: 'success',
        });
        toast.present();
        this.router.navigateByUrl('/tabs/cadastros/users');
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
