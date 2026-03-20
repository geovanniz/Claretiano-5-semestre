import { Component } from '@angular/core';
import { Aluno } from './aluno.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  isExpanded: boolean = false;

  estudante: Aluno ={
    nome: "Thiago Tomazella",
    faltas: 0
  };

  constructor(private router: Router) {}

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  
  adicionarFalta(){
    this.estudante.faltas+=1;
  }
  limparFalta(){
    this.estudante.faltas=0;
  }

  abriCadastroUsuario(){
    this.router.navigate(['/cadastro-usuario'])
  }

}
