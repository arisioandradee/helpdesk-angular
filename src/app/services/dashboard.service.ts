import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getChamados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/chamados', { headers: this.getAuthHeaders() });
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/clientes', { headers: this.getAuthHeaders() });
  }

  getTecnicos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/tecnicos', { headers: this.getAuthHeaders() });
  }
}
