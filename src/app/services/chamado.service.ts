import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chamado } from '../models/chamado.model';

/**
 * Serviço para gerenciar operações CRUD de chamados
 * 
 * Este serviço fornece métodos para:
 * - Listar todos os chamados
 * - Buscar um chamado por ID
 * - Criar um novo chamado
 * - Atualizar um chamado existente
 * - Excluir um chamado
 * 
 * Todas as requisições incluem automaticamente o token JWT
 * através do AuthInterceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class ChamadoService {

  /**
   * URL base da API de chamados
   */
  private baseUrl = 'http://localhost:8080/chamados'; 

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os chamados
   * @returns Observable com array de chamados
   */
  findAll(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(this.baseUrl);
  }

  /**
   * Busca um chamado específico pelo ID
   * @param id ID do chamado
   * @returns Observable com os dados do chamado
   */
  findById(id: any): Observable<Chamado> {
    return this.http.get<Chamado>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo chamado
   * @param chamado Objeto com os dados do chamado (sem ID)
   * @returns Observable com o chamado criado (incluindo ID gerado)
   */
  create(chamado: Chamado): Observable<Chamado> {
    return this.http.post<Chamado>(this.baseUrl, chamado);
  }

  /**
   * Atualiza um chamado existente
   * @param chamado Objeto com os dados atualizados (deve incluir o ID)
   * @returns Observable com o chamado atualizado
   */
  update(chamado: Chamado): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/${chamado.id}`, chamado);
  }

  /**
   * Exclui um chamado
   * @param id ID do chamado a ser excluído
   * @returns Observable vazio (void)
   */
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

