import { Injectable } from '@angular/core';
import { Credenciais } from '../models/credenciais';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Serviço de autenticação
 * 
 * Gerencia todo o fluxo de autenticação da aplicação:
 * - Login de usuários
 * - Validação de tokens JWT
 * - Logout e limpeza de dados de sessão
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Autentica o usuário no backend
   * @param creds Credenciais (email e senha) do usuário
   * @returns Observable com a resposta do servidor contendo o token JWT no header
   */
  authenticate(creds: Credenciais): Observable<any> {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, { observe: 'response' });
  }

  /**
   * Armazena o token JWT no localStorage após login bem-sucedido
   * @param authToken Token JWT recebido do backend
   */
  sucessfulLogin(authToken: string) {
    localStorage.setItem('token', authToken);
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se o token existe e não está expirado, false caso contrário
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtService.isTokenExpired(token);
  }

  /**
   * Retorna o token JWT armazenado
   * @returns Token JWT ou null se não existir
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Realiza logout do usuário
   * Remove token e roles do localStorage e redireciona para login
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    this.router.navigate(['/login']); 
  }

  /**
   * Extrai o email do usuário do token JWT
   * @returns Email do usuário ou null se não for possível decodificar
   */
  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.sub || null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }
}
