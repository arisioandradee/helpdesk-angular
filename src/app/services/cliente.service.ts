import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

/**
 * Serviço para gerenciar operações CRUD de clientes
 * 
 * Este serviço fornece métodos para:
 * - Listar todos os clientes
 * - Buscar um cliente por ID
 * - Criar um novo cliente
 * - Atualizar um cliente existente
 * - Excluir um cliente
 * 
 * Todas as requisições incluem automaticamente o token JWT
 * através do AuthInterceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  /**
   * URL base da API de clientes
   */
  private baseUrl = 'http://localhost:8080/clientes'; 

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os clientes
   * @returns Observable com array de clientes
   */
  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  /**
   * Busca um cliente específico pelo ID
   * @param id ID do cliente
   * @returns Observable com os dados do cliente
   */
  findById(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo cliente
   * @param cliente Objeto com os dados do cliente (sem ID)
   * @returns Observable com o cliente criado (incluindo ID gerado)
   */
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  /**
   * Atualiza um cliente existente
   * @param cliente Objeto com os dados atualizados (deve incluir o ID)
   * @returns Observable com o cliente atualizado
   */
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${cliente.id}`, cliente);
  }

  /**
   * Exclui um cliente
   * @param id ID do cliente a ser excluído
   * @returns Observable vazio (void)
   */
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

