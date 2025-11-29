import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chamado } from '../models/chamado.model';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {

  private baseUrl = 'http://localhost:8080/chamados'; 

  constructor(private http: HttpClient) { }

  findAll(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(this.baseUrl);
  }

  findById(id: any): Observable<Chamado> {
    return this.http.get<Chamado>(`${this.baseUrl}/${id}`);
  }

  create(chamado: Chamado): Observable<Chamado> {
    return this.http.post<Chamado>(this.baseUrl, chamado);
  }

  update(chamado: Chamado): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/${chamado.id}`, chamado);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

