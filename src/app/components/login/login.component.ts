import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Credenciais } from '../../models/credenciais';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // injetando Toastr
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const creds: Credenciais = this.loginForm.value;

    this.authService.authenticate(creds).subscribe({
      next: (resp: any) => {
        const authToken = resp.headers.get('Authorization')?.replace('Bearer ', '');
        if (authToken) {
          this.authService.sucessfulLogin(authToken);
          localStorage.setItem('token', authToken);
          this.router.navigate(['/home']);
        } else {
          this.toastr.error('Não foi possível obter o token!', 'Erro');
        }
      },
      error: () => {
        // Aqui mostramos a mensagem independentemente do status
        this.toastr.error('Usuário ou senha inválidos!', 'Erro');
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}
