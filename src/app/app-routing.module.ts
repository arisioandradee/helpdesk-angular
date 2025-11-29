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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'tecnicos',
    component: TecnicoComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TecnicoListComponent },           
      { path: 'create', component: TecnicoCreateComponent },  
      { path: 'update/:id', component: TecnicoUpdateComponent }, 
      { path: 'delete/:id', component: TecnicoDeleteComponent }, 
    ]
  },
  {
    path: 'clientes',
    component: ClienteComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ClienteListComponent },           
      { path: 'create', component: ClienteCreateComponent },  
      { path: 'update/:id', component: ClienteUpdateComponent }, 
      { path: 'delete/:id', component: ClienteDeleteComponent }, 
    ]
  },
  {
    path: 'chamados',
    component: ChamadoComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ChamadoListComponent },           
      { path: 'create', component: ChamadoCreateComponent },  
      { path: 'update/:id', component: ChamadoUpdateComponent }, 
      { path: 'delete/:id', component: ChamadoDeleteComponent }, 
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
