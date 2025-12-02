import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnico } from '../models/tecnico.model';

/**
 * Serviço para gerenciar operações CRUD de técnicos
 * 
 * Este serviço fornece métodos para:
 * - Listar todos os técnicos
 * - Buscar um técnico por ID
 * - Criar um novo técnico
 * - Atualizar um técnico existente
 * - Excluir um técnico
 * 
 * Todas as requisições incluem automaticamente o token JWT
 * através do AuthInterceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  /**
   * URL base da API de técnicos
   */
  private baseUrl = 'https://helpdesk-project-1-iyi4.onrender.com/tecnicos'; 

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os técnicos
   * @returns Observable com array de técnicos
   */
  findAll(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(this.baseUrl);
  }

  /**
   * Busca um técnico específico pelo ID
   * @param id ID do técnico
   * @returns Observable com os dados do técnico
   */
  findById(id: any): Observable<Tecnico> {
    return this.http.get<Tecnico>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo técnico
   * @param tecnico Objeto com os dados do técnico (sem ID)
   * @returns Observable com o técnico criado (incluindo ID gerado)
   */
  create(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.post<Tecnico>(this.baseUrl, tecnico);
  }

  /**
   * Atualiza um técnico existente
   * @param tecnico Objeto com os dados atualizados (deve incluir o ID)
   * @returns Observable com o técnico atualizado
   */
  update(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.put<Tecnico>(`${this.baseUrl}/${tecnico.id}`, tecnico);
  }

  /**
   * Exclui um técnico
   * @param id ID do técnico a ser excluído
   * @returns Observable vazio (void)
   */
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}