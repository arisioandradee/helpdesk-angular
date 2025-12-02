import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionService } from '../../../services/permission.service';

/**
 * Componente de Listagem de Técnicos
 * 
 * Este componente:
 * - Exibe lista de técnicos em tabela do Angular Material
 * - Implementa busca/filtro em tempo real
 * - Implementa paginação e ordenação
 * - Controla visibilidade de botões e ações baseado em permissões
 * - Apenas ADMIN pode ver botão "Novo Técnico" e coluna de ações
 * 
 * Funcionalidades:
 * - Listagem com paginação
 * - Busca por nome ou email
 * - Ordenação por qualquer coluna
 * - Botões de editar/excluir (apenas para ADMIN)
 * 
 * Acesso: Todos os usuários autenticados (todos podem visualizar a lista)
 */
@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit {

  /**
   * Array com os dados dos técnicos carregados do backend
   */
  ELEMENT_DATA: Tecnico[] = [];

  /**
   * Colunas que serão exibidas na tabela
   * Inicialmente sem a coluna 'acoes', adicionada dinamicamente se usuário tiver permissão
   */
  displayedColumns: string[] = ['id', 'nome', 'email', 'cpf'];

  /**
   * DataSource do Angular Material para gerenciar a tabela
   * Suporta paginação, ordenação e filtro
   */
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  /**
   * Referência ao componente de paginação do Angular Material
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Referência ao componente de ordenação do Angular Material
   */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Flag que indica se o usuário pode criar novos técnicos
   * Apenas ADMIN tem esta permissão
   */
  canCreate = false;

  /**
   * Flag que indica se o usuário pode editar/excluir técnicos
   * Apenas ADMIN tem esta permissão
   */
  canManage = false;

  constructor(
    private service: TecnicoService,
    private permissionService: PermissionService
  ) { }

  /**
   * Método executado ao inicializar o componente
   * 
   * Processo:
   * 1. Verifica permissões do usuário
   * 2. Adiciona coluna de ações se usuário tiver permissão
   * 3. Carrega os dados dos técnicos
   */
  ngOnInit(): void {
    // Verifica permissões do usuário logado
    this.canCreate = this.permissionService.canCreateTecnico();
    this.canManage = this.permissionService.canManageTecnico();
    
    // Adiciona coluna de ações apenas se usuário tiver permissão de gerenciar
    // Isso evita mostrar coluna vazia para usuários sem permissão
    if (this.canManage) {
      this.displayedColumns.push('acoes');
    }
    
    // Carrega os dados dos técnicos
    this.findAll();
  }

  /**
   * Busca todos os técnicos do backend e atualiza a tabela
   * Configura paginação e ordenação após carregar os dados
   */
  findAll(): void {
    this.service.findAll().subscribe(res => {
      this.ELEMENT_DATA = res;
      
      // Atualiza o DataSource com os novos dados
      this.dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);
      
      // Configura paginação e ordenação após a view ser inicializada
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Aplica filtro de busca na tabela
   * 
   * O filtro funciona em todas as colunas da tabela automaticamente
   * 
   * @param event Evento de digitação no campo de busca
   */
  applyFilter(event: Event) {
    // Obtém o valor digitado e remove espaços em branco
    const filterValue = (event.target as HTMLInputElement).value;
    
    // Aplica o filtro convertendo para minúsculas para busca case-insensitive
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Volta para a primeira página quando aplicar um filtro
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
