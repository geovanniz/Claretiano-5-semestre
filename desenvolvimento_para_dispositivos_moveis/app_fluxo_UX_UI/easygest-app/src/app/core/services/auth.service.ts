import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { from, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginDTO } from '../models';

const TOKEN_KEY = 'eg_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal reativo — componentes lêem currentUser() diretamente
  currentUser = signal<User | null>(null);

  constructor(
    private api: ApiService,
    private storage: Storage,
    private router: Router,
  ) {}

  async init(): Promise<void> {
    await this.storage.create();
    const token = await this.storage.get(TOKEN_KEY);
    if (token) {
      // Valida token fazendo GET /auth/me (o interceptor já adiciona o header)
      this.api.get<User>('/auth/me').subscribe({
        next:  user  => this.currentUser.set(user),
        error: ()    => this.logout(),
      });
    }
  }

  login(dto: LoginDTO): Observable<{ token: string; user: User }> {
    return this.api
      .post<{ token: string; user: User }>('/auth/login', dto)
      .pipe(
        tap(async ({ token, user }) => {
          await this.storage.set(TOKEN_KEY, token);
          this.currentUser.set(user);
        }),
      );
  }

  async logout(): Promise<void> {
    await this.storage.remove(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async getToken(): Promise<string | null> {
    return this.storage.get(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  hasRole(...roles: User['role'][]): boolean {
    const role = this.currentUser()?.role;
    return !!role && roles.includes(role);
  }
}
