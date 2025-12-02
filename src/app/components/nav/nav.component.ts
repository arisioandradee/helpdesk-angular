import { Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';

/**
 * Componente de Navegação Lateral (Sidebar)
 * 
 * Este componente:
 * - Exibe o menu de navegação lateral
 * - Controla a visibilidade dos links baseado nas permissões do usuário
 * - Oculto/mostra dinamicamente itens do menu conforme as roles
 * - Gerencia o estado de expansão do menu
 * - Fornece funcionalidade de logout
 * 
 * Links exibidos baseado em permissões:
 * - Home: Todos os usuários autenticados
 * - Técnicos: Todos podem ver
 * - Clientes: Todos podem ver
 * - Chamados: Todos podem ver
 * - GitHub: Link externo, sempre visível
 */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  /**
   * Input que controla se o menu está aberto
   * Pode ser controlado externamente
   */
  @Input() isOpen = true;

  /**
   * Controla a visibilidade do menu mobile (não utilizado atualmente)
   */
  isNavbarVisible = false;

  /**
   * Objeto que controla o estado dos dropdowns do menu
   */
  dropdowns = {
    profile: false,
    notifications: false
  };

  /**
   * Flags que controlam a visibilidade dos links no menu
   * Atualizados baseado nas permissões do usuário
   */
  canViewTecnicos = false;
  canViewClientes = false;
  canViewChamados = false;

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Método executado ao inicializar o componente
   * Carrega as permissões do usuário e configura listeners
   */
  ngOnInit(): void {
    // Aguarda um delay para garantir que o token JWT esteja disponível
    // Isso é necessário porque o componente pode ser inicializado antes do login
    setTimeout(() => {
      this.updatePermissions();
    }, 100);

    // Escuta eventos customizados de atualização de roles
    // Permite que outros componentes notifiquem quando as roles mudarem
    window.addEventListener('rolesUpdated', () => {
      this.updatePermissions();
    });
  }

  /**
   * Atualiza as permissões e visibilidade dos links no menu
   * 
   * Este método:
   * 1. Obtém as roles do usuário logado
   * 2. Verifica quais módulos o usuário pode visualizar
   * 3. Atualiza as flags de visibilidade
   * 4. Força detecção de mudanças para atualizar a view
   */
  updatePermissions(): void {
    // Obtém as roles do usuário (usa cache se disponível)
    const roles = this.permissionService.getUserRoles();
    
    // Verifica permissões para cada módulo
    // Estas permissões controlam quais links aparecem no menu
    this.canViewTecnicos = this.permissionService.canViewTecnicos();
    this.canViewClientes = this.permissionService.canViewClientes();
    this.canViewChamados = this.permissionService.canViewChamados();
    
    // Força o Angular a verificar mudanças na view
    // Necessário porque as permissões podem ser atualizadas assincronamente
    this.cdr.detectChanges();
  }

  /**
   * Alterna a visibilidade do menu mobile
   * (Funcionalidade não utilizada atualmente)
   */
  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  /**
   * Alterna o estado de um dropdown específico
   * @param menu Nome do menu dropdown ('profile' ou 'notifications')
   */
  toggleDropdown(menu: 'profile' | 'notifications'): void {
    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  /**
   * Realiza logout do usuário
   * Limpa tokens e roles e redireciona para login
   */
  logout(): void {
    this.authService.logout();
  }
}

