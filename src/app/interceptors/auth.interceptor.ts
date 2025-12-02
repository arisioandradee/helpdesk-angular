import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interceptor HTTP que adiciona automaticamente o token JWT em todas as requisições
 * 
 * Funcionalidade:
 * - Intercepta todas as requisições HTTP
 * - Adiciona o token JWT no header Authorization
 * - Exceção: não adiciona token em requisições para /login
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token && !req.url.includes('/login')) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}