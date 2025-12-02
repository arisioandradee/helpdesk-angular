import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Enum com os tipos de usuário do sistema
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE'
}

/**
 * Serviço de controle de permissões baseado em roles
 * 
 * Este serviço gerencia todas as permissões da aplicação baseadas nas roles do usuário.
 * As roles são obtidas do token JWT ou do localStorage (cache).
 * 
 * Funcionalidades principais:
 * - Decodificação de roles do token JWT
 * - Verificação de permissões específicas
 * - Controle de acesso granular por tipo de usuário
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private cachedRoles: string[] | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  /**
   * Obtém as roles do usuário logado
   * Tenta primeiro do localStorage, depois do token JWT, e por último do backend
   */
  getUserRoles(): string[] {
    // Se já temos roles em cache, retorna
    if (this.cachedRoles) {
      return this.cachedRoles;
    }

    // Tenta obter do localStorage (salvo após login)
    const storedRoles = localStorage.getItem('userRoles');
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        this.cachedRoles = Array.isArray(roles) ? roles : [roles];
        return this.cachedRoles;
      } catch (error) {
        console.error('Erro ao parsear roles do localStorage:', error);
      }
    }

    // Tenta obter do token JWT
    const token = this.authService.getToken();
    if (!token) {
      return [];
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      // Tenta diferentes formatos comuns de roles no JWT
      let roles: any = null;
      
      if (tokenPayload.authorities) {
        roles = tokenPayload.authorities;
      } else if (tokenPayload.roles) {
        roles = tokenPayload.roles;
      } else if (tokenPayload.role) {
        roles = tokenPayload.role;
      } else if (tokenPayload.perfis) {
        roles = tokenPayload.perfis;
      } else {
        // Se não encontrou no token, tenta buscar do backend
        this.fetchRolesFromBackend();
        return [];
      }
      
      if (!roles) {
        this.fetchRolesFromBackend();
        return [];
      }
      
      let finalRoles: string[] = [];
      
      // Se for array, retorna como está
      if (Array.isArray(roles)) {
        finalRoles = roles.map((r: any) => {
          let roleStr = '';
          if (typeof r === 'string') {
            roleStr = r;
          } else if (r && typeof r === 'object') {
            roleStr = r.authority || r.role || r.name || String(r);
          } else {
            roleStr = String(r);
          }
          // Remove o prefixo "ROLE_" se existir e retorna em maiúsculo
          return roleStr.replace(/^ROLE_/i, '').toUpperCase();
        });
      } else if (typeof roles === 'string') {
        // Se for string única, retorna como array
        finalRoles = [roles.replace(/^ROLE_/i, '').toUpperCase()];
      } else if (typeof roles === 'object' && roles.authority) {
        // Se for objeto com authority, extrai
        finalRoles = [roles.authority.replace(/^ROLE_/i, '').toUpperCase()];
      }
      
      // Salva no cache e localStorage
      this.cachedRoles = finalRoles;
      localStorage.setItem('userRoles', JSON.stringify(finalRoles));
      
      return finalRoles;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.fetchRolesFromBackend();
      return [];
    }
  }

  /**
   * Busca as roles do backend usando o email do token
   * Tenta buscar o usuário em diferentes endpoints (tecnicos, clientes)
   * Fallback caso as roles não estejam disponíveis no token JWT
   */
  private fetchRolesFromBackend(): void {
    const email = this.authService.getEmailFromToken();
    if (!email) {
      return;
    }

    // Tenta buscar em diferentes endpoints
    // Primeiro tenta buscar em técnicos
    this.http.get<any[]>(`${API_CONFIG.baseUrl}/tecnicos`).pipe(
      map((tecnicos: any[]) => {
        const tecnico = tecnicos.find(t => t.email === email);
        if (tecnico && tecnico.perfis) {
          const roles = Array.isArray(tecnico.perfis) ? tecnico.perfis : [tecnico.perfis];
          // Normaliza as roles removendo ROLE_ e convertendo para maiúsculo
          this.cachedRoles = roles.map(r => this.normalizeRole(r));
          localStorage.setItem('userRoles', JSON.stringify(this.cachedRoles));
          return this.cachedRoles;
        }
        return null;
      }),
      catchError(() => {
        // Se falhar, tenta buscar em clientes
        return this.http.get<any[]>(`${API_CONFIG.baseUrl}/clientes`).pipe(
          map((clientes: any[]) => {
            const cliente = clientes.find(c => c.email === email);
            if (cliente && cliente.perfis) {
              const roles = Array.isArray(cliente.perfis) ? cliente.perfis : [cliente.perfis];
              // Normaliza as roles removendo ROLE_ e convertendo para maiúsculo
              this.cachedRoles = roles.map(r => this.normalizeRole(r));
              localStorage.setItem('userRoles', JSON.stringify(this.cachedRoles));
              return this.cachedRoles;
            }
            return null;
          }),
          catchError((err) => {
            console.error('Não foi possível buscar roles do backend:', err);
            return of(null);
          })
        );
      })
    ).subscribe((roles) => {
      if (roles) {
        // Força atualização dos componentes que dependem das roles
        setTimeout(() => {
          window.dispatchEvent(new Event('rolesUpdated'));
        }, 100);
      }
    });
  }

  /**
   * Normaliza uma role removendo o prefixo ROLE_ e convertendo para maiúsculo
   */
  private normalizeRole(role: string): string {
    return role.replace(/^ROLE_/i, '').toUpperCase().trim();
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    const normalizedRole = this.normalizeRole(role);
    return roles.some(r => this.normalizeRole(r) === normalizedRole);
  }

  /**
   * Verifica se o usuário tem alguma das roles fornecidas
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    const normalizedUserRoles = userRoles.map(r => this.normalizeRole(r));
    return roles.some(role => normalizedUserRoles.includes(this.normalizeRole(role)));
  }

  /**
   * Verifica se o usuário é ADMIN
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  /**
   * Verifica se o usuário é TECNICO
   */
  isTecnico(): boolean {
    return this.hasRole(UserRole.TECNICO);
  }

  /**
   * Verifica se o usuário é CLIENTE
   */
  isCliente(): boolean {
    return this.hasRole(UserRole.CLIENTE);
  }

  /**
   * Verifica se pode criar técnicos (apenas ADMIN)
   */
  canCreateTecnico(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se pode editar/excluir técnicos (apenas ADMIN)
   */
  canManageTecnico(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se pode criar clientes (apenas ADMIN)
   */
  canCreateCliente(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se pode editar/excluir clientes (apenas ADMIN)
   */
  canManageCliente(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se pode criar chamados (ADMIN, TECNICO, CLIENTE)
   */
  canCreateChamado(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE]);
  }

  /**
   * Verifica se pode atualizar chamados (ADMIN, TECNICO)
   */
  canUpdateChamado(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.TECNICO]);
  }

  /**
   * Verifica se pode excluir chamados (apenas ADMIN)
   */
  canDeleteChamado(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se pode ver lista de técnicos (todos)
   */
  canViewTecnicos(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE]);
  }

  /**
   * Verifica se pode ver lista de clientes (todos)
   */
  canViewClientes(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE]);
  }

  /**
   * Verifica se pode ver lista de chamados (todos)
   */
  canViewChamados(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE]);
  }
}

