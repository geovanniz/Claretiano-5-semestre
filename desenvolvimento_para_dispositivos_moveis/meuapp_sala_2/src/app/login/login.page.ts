import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  nome: string = '';
  senha: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  executarAcesso() {
    this.router.navigate(['/menu']);
  }

}
