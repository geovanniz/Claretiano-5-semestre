import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
  {
    path: 'cadastro-chamado',
    loadComponent: () => import('./pages/cadastro-chamado/cadastro-chamado.page').then((m) => m.CadastroChamadoPage),
  },
  {
    path: 'lista-chamados',
    loadComponent: () => import('./pages/lista-chamados/lista-chamados.page').then((m) => m.ListaChamadosPage),
  },
  {
    path: 'detalhes-chamado/:id',
    loadComponent: () => import('./pages/detalhes-chamado/detalhes-chamado.page').then((m) => m.DetalhesChamadoPage),
  },
  {
    path: 'atualizar-status/:id',
    loadComponent: () => import('./pages/atualizar-status/atualizar-status.page').then((m) => m.AtualizarStatusPage),
  },
  {
    path: 'cadastro-tecnico',
    loadComponent: () => import('./pages/cadastro-tecnico/cadastro-tecnico.page').then((m) => m.CadastroTecnicoPage),
  },
  {
    path: 'lista-tecnicos',
    loadComponent: () => import('./pages/lista-tecnicos/lista-tecnicos.page').then((m) => m.ListaTecnicosPage),
  },
  {
    path: 'resumo',
    loadComponent: () => import('./pages/resumo/resumo.page').then((m) => m.ResumoPage),
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then((m) => m.SobrePage),
  },
];
