import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { TecnicoComponent } from './components/tecnico/tecnico.component';
import { TecnicoCreateComponent } from './components/tecnico/tecnico-create/tecnico-create.component';
import { TecnicoDeleteComponent } from './components/tecnico/tecnico-delete/tecnico-delete.component';
import { TecnicoListComponent } from './components/tecnico/tecnico-list/tecnico-list.component';
import { TecnicoUpdateComponent } from './components/tecnico/tecnico-update/tecnico-update.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ClienteCreateComponent } from './components/cliente/cliente-create/cliente-create.component';
import { ClienteDeleteComponent } from './components/cliente/cliente-delete/cliente-delete.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteUpdateComponent } from './components/cliente/cliente-update/cliente-update.component';
import { ChamadoComponent } from './components/chamado/chamado.component';
import { ChamadoCreateComponent } from './components/chamado/chamado-create/chamado-create.component';
import { ChamadoDeleteComponent } from './components/chamado/chamado-delete/chamado-delete.component';
import { ChamadoListComponent } from './components/chamado/chamado-list/chamado-list.component';
import { ChamadoUpdateComponent } from './components/chamado/chamado-update/chamado-update.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { UserRole } from './services/permission.service';

/**
 * Configuração de rotas da aplicação
 * 
 * A estrutura de rotas implementa:
 * - Autenticação obrigatória (AuthGuard) para todas as rotas exceto login
 * - Controle de acesso baseado em roles (RoleGuard) para operações específicas
 * 
 * Permissões por tipo de usuário:
 * - ADMIN: Acesso total (criar, editar, excluir técnicos, clientes e chamados)
 * - TECNICO: Pode ver tudo, atualizar chamados, mas não criar/editar/excluir técnicos ou clientes
 * - CLIENTE: Pode ver listas e criar chamados, mas não pode editar/excluir dados
 */

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'tecnicos',
    component: TecnicoComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        component: TecnicoListComponent,
        data: { roles: [UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE] }
      },           
      { 
        path: 'create', 
        component: TecnicoCreateComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      },  
      { 
        path: 'update/:id', 
        component: TecnicoUpdateComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }, 
      { 
        path: 'delete/:id', 
        component: TecnicoDeleteComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }, 
    ]
  },
  {
    path: 'clientes',
    component: ClienteComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        component: ClienteListComponent,
        data: { roles: [UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE] }
      },           
      { 
        path: 'create', 
        component: ClienteCreateComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      },  
      { 
        path: 'update/:id', 
        component: ClienteUpdateComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }, 
      { 
        path: 'delete/:id', 
        component: ClienteDeleteComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }, 
    ]
  },
  {
    path: 'chamados',
    component: ChamadoComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        component: ChamadoListComponent,
        data: { roles: [UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE] }
      },           
      { 
        path: 'create', 
        component: ChamadoCreateComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.TECNICO, UserRole.CLIENTE] }
      },  
      { 
        path: 'update/:id', 
        component: ChamadoUpdateComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.TECNICO] }
      }, 
      { 
        path: 'delete/:id', 
        component: ChamadoDeleteComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }, 
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
