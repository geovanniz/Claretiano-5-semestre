import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-user-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/cadastros"></ion-back-button>
        </ion-buttons>
        <ion-title>Usuários</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="router.navigate(['/tabs/cadastros/users/new'])">
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
        <ion-item-sliding *ngFor="let u of filtered">
          <ion-item [routerLink]="['/tabs/cadastros/users', u.id]" detail>
            <ion-label>
              <h2>{{ u.name }}</h2>
              <p>{{ u.email }}</p>
            </ion-label>
            <div slot="end" class="ion-text-right">
              <ion-badge [color]="u.role === 'admin' ? 'warning' : 'primary'">
                {{ u.role }}
              </ion-badge>
            </div>
          </ion-item>

          <ion-item-options side="end" *ngIf="u.id !== currentUserId">
            <ion-item-option color="danger" (click)="confirmDelete(u)">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button [routerLink]="['/tabs/cadastros/users/new']">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class UserListPage implements OnInit {
  users: User[] = [];
  filtered: User[] = [];

  constructor(
    public router: Router,
    private usersService: UsersService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  get currentUserId(): number | undefined {
    return this.authService.currentUser()?.id;
  }

  ngOnInit(): void {
    this.usersService.getAll().subscribe(us => {
      this.users = us;
      this.filtered = us;
    });
  }

  filter(event: CustomEvent): void {
    const q = (event.detail.value as string).toLowerCase();
    this.filtered = this.users.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  async confirmDelete(u: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Remover "${u.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover', role: 'destructive',
          handler: () => {
            this.usersService.deactivate(u.id).subscribe(() => {
              this.users = this.users.filter(x => x.id !== u.id);
              this.filtered = this.filtered.filter(x => x.id !== u.id);
              this.toastCtrl.create({
                message: 'Usuário desativado.', duration: 2000, color: 'success',
              }).then(t => t.present());
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
