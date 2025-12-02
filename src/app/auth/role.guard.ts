import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionService, UserRole } from '../services/permission.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Guard de controle de acesso baseado em roles
 * 
 * Verifica se o usuário possui as roles necessárias para acessar determinada rota.
 * As roles são definidas no objeto 'data' de cada rota no app-routing.module.ts
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles'] || [];
    
    if (requiredRoles.length === 0) {
      return true;
    }

    const hasPermission = this.permissionService.hasAnyRole(requiredRoles);

    if (!hasPermission) {
      this.toastr.warning('Você não tem permissão para acessar esta página.', 'Acesso Negado');
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}

