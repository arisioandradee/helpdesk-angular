import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { Credenciais } from '../../models/credenciais';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente de Login
 * 
 * Este componente:
 * - Exibe formulário de autenticação (email e senha)
 * - Valida os dados antes do envio
 * - Envia credenciais para o backend
 * - Armazena o token JWT no localStorage
 * - Tenta obter e armazenar as roles do usuário
 * - Redireciona para o dashboard após login bem-sucedido
 * - Redireciona usuários já autenticados para o dashboard
 * 
 * Acesso: Público (não requer autenticação)
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * FormGroup que gerencia o formulário de login
   * Campos: email (obrigatório, formato email) e senha (obrigatório, mínimo 3 caracteres)
   */
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Inicializa o formulário com validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Método executado ao inicializar o componente
   * Verifica se o usuário já está autenticado
   * Se estiver, redireciona para o dashboard (evita login duplicado)
   */
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Método executado ao submeter o formulário de login
   * 
   * Processo:
   * 1. Valida o formulário
   * 2. Envia credenciais para o backend
   * 3. Extrai o token JWT do header Authorization
   * 4. Armazena o token no localStorage
   * 5. Tenta obter roles do body da resposta ou do backend
   * 6. Redireciona para o dashboard
   */
  login() {
    // Valida o formulário antes de enviar
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    // Prepara as credenciais do formulário
    const creds: Credenciais = this.loginForm.value;

    // Envia requisição de autenticação
    this.authService.authenticate(creds).subscribe({
      next: (resp: any) => {
        // Extrai o token JWT do header Authorization
        // O backend envia no formato "Bearer <token>", então remove o prefixo
        const authToken = resp.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (authToken) {
          // Armazena o token no localStorage via serviço
          this.authService.sucessfulLogin(authToken);
          localStorage.setItem('token', authToken);
          
          // Tenta obter as roles do body da resposta do login
          // Isso evita necessidade de fazer requisição adicional
          if (resp.body && resp.body.perfis) {
            localStorage.setItem('userRoles', JSON.stringify(resp.body.perfis));
          } else if (resp.body && resp.body.roles) {
            localStorage.setItem('userRoles', JSON.stringify(resp.body.roles));
          } else {
            // Se não encontrou no body, força busca do backend após um delay
            // O delay garante que o token já esteja disponível
            setTimeout(() => {
              this.permissionService.getUserRoles(); // Dispara a busca do backend
            }, 500);
          }
          
          // Redireciona para o dashboard após login bem-sucedido
          this.router.navigate(['/home']);
        } else {
          this.toastr.error('Não foi possível obter o token!', 'Erro');
        }
      },
      error: () => {
        // Em caso de erro, sempre mostra mensagem genérica
        // Isso evita expor informações sobre usuários existentes
        this.toastr.error('Usuário ou senha inválidos!', 'Erro');
      }
    });
  }

  /**
   * Getter para facilitar o acesso aos controles do formulário no template
   * Exemplo: f.email.errors no HTML
   */
  get f() {
    return this.loginForm.controls;
  }
}
