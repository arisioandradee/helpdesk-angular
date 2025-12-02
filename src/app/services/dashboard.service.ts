import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Serviço para buscar dados do Dashboard
 * 
 * Este serviço fornece métodos para carregar os dados necessários
 * para exibir o dashboard (estatísticas e gráficos).
 * 
 * NOTA: Este serviço adiciona headers manualmente, mas na prática
 * o AuthInterceptor já adiciona automaticamente. Mantido para compatibilidade.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
   * URL base da API (não utilizado atualmente, cada método usa URL completa)
   */
  private baseUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  /**
   * Cria headers de autenticação com o token JWT
   * @returns HttpHeaders com o token de autorização
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Busca todos os chamados para o dashboard
   * @returns Observable com array de chamados
   */
  getChamados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/chamados', { headers: this.getAuthHeaders() });
  }

  /**
   * Busca todos os clientes para o dashboard
   * @returns Observable com array de clientes
   */
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/clientes', { headers: this.getAuthHeaders() });
  }

  /**
   * Busca todos os técnicos para o dashboard
   * @returns Observable com array de técnicos
   */
  getTecnicos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/tecnicos', { headers: this.getAuthHeaders() });
  }
}
