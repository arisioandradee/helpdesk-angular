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

  // d. Criar método findAll()
  findAll(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(this.baseUrl);
  }
}