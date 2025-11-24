import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; 
    } else {
      this.toastr.warning('Você precisa estar logado para acessar esta página.', 'Atenção');
      this.router.navigate(['/login']); 
      return false;
    }
  }
}
