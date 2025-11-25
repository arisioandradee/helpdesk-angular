import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component'
import { TecnicoComponent } from './components/tecnico/tecnico.component';
import { TecnicoCreateComponent } from './components/tecnico/tecnico-create/tecnico-create.component';
import { TecnicoDeleteComponent } from './components/tecnico/tecnico-delete/tecnico-delete.component';
import { TecnicoListComponent } from './components/tecnico/tecnico-list/tecnico-list.component';
import { TecnicoUpdateComponent } from './components/tecnico/tecnico-update/tecnico-update.component';
import { AuthGuard } from './auth/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainLayoutComponent, canActivate: [AuthGuard] },
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

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
