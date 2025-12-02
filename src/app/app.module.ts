import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/**
 * Módulo principal da aplicação Angular
 * 
 * Este módulo configura:
 * - Todos os componentes da aplicação
 * - Módulos do Angular Material utilizados
 * - Interceptor HTTP para autenticação
 * - Configurações do Toastr para notificações
 * - Sistema de rotas
 */

// Angular Material - Componentes UI
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';

// Biblioteca de terceiros - Notificações toast
import { ToastrModule } from 'ngx-toastr';

// Sistema de rotas
import { AppRoutingModule } from './app-routing.module';

// Componentes da aplicação
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TecnicoComponent } from './components/tecnico/tecnico.component';
import { TecnicoListComponent } from './components/tecnico/tecnico-list/tecnico-list.component';
import { TecnicoCreateComponent } from './components/tecnico/tecnico-create/tecnico-create.component';
import { TecnicoUpdateComponent } from './components/tecnico/tecnico-update/tecnico-update.component';
import { TecnicoDeleteComponent } from './components/tecnico/tecnico-delete/tecnico-delete.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteCreateComponent } from './components/cliente/cliente-create/cliente-create.component';
import { ClienteUpdateComponent } from './components/cliente/cliente-update/cliente-update.component';
import { ClienteDeleteComponent } from './components/cliente/cliente-delete/cliente-delete.component';
import { ChamadoComponent } from './components/chamado/chamado.component';
import { ChamadoListComponent } from './components/chamado/chamado-list/chamado-list.component';
import { ChamadoCreateComponent } from './components/chamado/chamado-create/chamado-create.component';
import { ChamadoUpdateComponent } from './components/chamado/chamado-update/chamado-update.component';
import { ChamadoDeleteComponent } from './components/chamado/chamado-delete/chamado-delete.component';

// Interceptor HTTP para autenticação
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

/**
 * Módulo principal da aplicação
 * 
 * Configurações:
 * - Declara todos os componentes
 * - Importa módulos necessários (Angular Material, Forms, HTTP, etc.)
 * - Registra o AuthInterceptor para adicionar token JWT nas requisições
 * - Configura o Toastr para exibir notificações
 */
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    LoginComponent,
    HomeComponent,
    TecnicoComponent,
    TecnicoListComponent,
    TecnicoCreateComponent,
    TecnicoUpdateComponent,
    TecnicoDeleteComponent,
    ClienteComponent,
    ClienteListComponent,
    ClienteCreateComponent,
    ClienteUpdateComponent,
    ClienteDeleteComponent,
    ChamadoComponent,
    ChamadoListComponent,
    ChamadoCreateComponent,
    ChamadoUpdateComponent,
    ChamadoDeleteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Angular Material
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    // Biblioteca de notificações Toastr
    ToastrModule.forRoot({
      timeOut: 3000,                      // Duração de 3 segundos
      positionClass: 'toast-top-right',   // Posição no canto superior direito
      preventDuplicates: true             // Evita exibir notificações duplicadas
    }),

    // Rotas
    AppRoutingModule
  ],
  providers: [
    /**
     * Registra o AuthInterceptor para interceptar todas as requisições HTTP
     * e adicionar automaticamente o token JWT no header Authorization
     */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  // Permite múltiplos interceptors
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
