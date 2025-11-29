import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnico } from '../models/tecnico.model';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  private baseUrl = 'http://localhost:8080/tecnicos'; 

  constructor(private http: HttpClient) { }

  findAll(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(this.baseUrl);
  }

  findById(id: any): Observable<Tecnico> {
    return this.http.get<Tecnico>(`${this.baseUrl}/${id}`);
  }

  create(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.post<Tecnico>(this.baseUrl, tecnico);
  }

  update(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.put<Tecnico>(`${this.baseUrl}/${tecnico.id}`, tecnico);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}