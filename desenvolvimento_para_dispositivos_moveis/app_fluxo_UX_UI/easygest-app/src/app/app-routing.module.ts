import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/dashboard', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule),
  },

  // Todas as rotas protegidas ficam dentro de /tabs
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
  },

  { path: '**', redirectTo: 'tabs/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
