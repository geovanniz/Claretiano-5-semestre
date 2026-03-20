import { Component, OnInit } from '@angular/core';

interface Usuario{
  nome:string;
  idade:number;
}

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.page.html',
  styleUrls: ['./cadastro-usuario.page.scss'],
  standalone:false,
})
export class CadastroUsuarioPage implements OnInit {

  usuario= {
    nome: '',
    idade: null as number | null,
  }

  usuariosCadastrados: Usuario[] = [];

  cadastrarUsuario(){
    const nome = this.usuario.nome.trim();
    const idade = this.usuario.idade;

    if(!nome || idade == null || idade < 0){
      return;
    }

    this.usuariosCadastrados.unshift({nome, idade});
    this.limparFormulario();

  }

  limparFormulario(){
    this.usuario ={
      nome: '',
      idade:null,
    }
  }

  excluirUsuario(index: number){
    this.usuariosCadastrados.splice(index, 1);
    return;
  }


  constructor() { }

  ngOnInit() {
  }

}
