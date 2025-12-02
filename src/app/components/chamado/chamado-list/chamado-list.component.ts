import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChamadoService } from '../../../services/chamado.service';
import { Chamado } from '../../../models/chamado.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TecnicoService } from '../../../services/tecnico.service';
import { ClienteService } from '../../../services/cliente.service';
import { PermissionService } from '../../../services/permission.service';

/**
 * Componente de Listagem de Chamados
 * 
 * Este componente:
 * - Exibe lista de chamados em tabela do Angular Material
 * - Implementa busca/filtro em tempo real
 * - Implementa paginação e ordenação
 * - Controla visibilidade de botões e ações baseado em permissões
 * - Traduz IDs de técnico/cliente para nomes usando mapas
 * - Aplica cores diferentes para status e prioridade
 * 
 * Funcionalidades:
 * - Listagem com paginação
 * - Busca por título ou status
 * - Ordenação por qualquer coluna
 * - Badges coloridos para status e prioridade
 * - Botões de editar (ADMIN/TECNICO) e excluir (apenas ADMIN)
 * 
 * Acesso: Todos os usuários autenticados (todos podem visualizar a lista)
 */
@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  /**
   * Array com os dados dos chamados carregados do backend
   */
  ELEMENT_DATA: Chamado[] = [];

  /**
   * Colunas que serão exibidas na tabela
   * Inicialmente sem a coluna 'acoes', adicionada dinamicamente se usuário tiver permissão
   */
  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico', 'status', 'prioridade'];

  /**
   * DataSource do Angular Material para gerenciar a tabela
   * Suporta paginação, ordenação e filtro
   */
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  /**
   * Mapa para traduzir ID do técnico em nome
   * Formato: { id: 'nome do técnico' }
   * Usado para exibir o nome do técnico ao invés do ID na tabela
   */
  tecnicoMap: any = {};

  /**
   * Mapa para traduzir ID do cliente em nome
   * Formato: { id: 'nome do cliente' }
   * Usado para exibir o nome do cliente ao invés do ID na tabela
   */
  clienteMap: any = {};

  /**
   * Referência ao componente de paginação do Angular Material
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Referência ao componente de ordenação do Angular Material
   */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Flag que indica se o usuário pode criar novos chamados
   * Todos os usuários autenticados podem criar chamados
   */
  canCreate = false;

  /**
   * Flag que indica se o usuário pode atualizar chamados
   * Apenas ADMIN e TECNICO têm esta permissão
   */
  canUpdate = false;

  /**
   * Flag que indica se o usuário pode excluir chamados
   * Apenas ADMIN tem esta permissão
   */
  canDelete = false;

  constructor(
    private service: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private permissionService: PermissionService
  ) { }

  /**
   * Método executado ao inicializar o componente
   * 
   * Processo:
   * 1. Verifica permissões do usuário
   * 2. Adiciona coluna de ações se usuário tiver permissão
   * 3. Carrega mapas de técnicos e clientes (para traduzir IDs em nomes)
   * 4. Carrega os dados dos chamados
   */
  ngOnInit(): void {
    // Verifica permissões do usuário logado
    this.canCreate = this.permissionService.canCreateChamado();
    this.canUpdate = this.permissionService.canUpdateChamado();
    this.canDelete = this.permissionService.canDeleteChamado();
    
    // Adiciona coluna de ações se usuário tiver permissão de atualizar ou excluir
    // Isso evita mostrar coluna vazia para usuários sem permissão
    if (this.canUpdate || this.canDelete) {
      this.displayedColumns.push('acoes');
    }
    
    // Carrega os mapas primeiro para traduzir IDs em nomes
    this.loadMaps();
    
    // Depois carrega os chamados
    this.findAll();
  }

  /**
   * Carrega os mapas de técnicos e clientes
   * 
   * Os chamados retornam apenas IDs de técnico e cliente.
   * Este método cria mapas para traduzir esses IDs em nomes,
   * melhorando a experiência do usuário na tabela.
   */
  loadMaps(): void {
    // Carrega técnicos e cria mapa ID -> Nome
    this.tecnicoService.findAll().subscribe(tecnicos => {
      tecnicos.forEach(t => {
        if (t.id) {
          this.tecnicoMap[t.id] = t.nome;
        }
      });
    });

    // Carrega clientes e cria mapa ID -> Nome
    this.clienteService.findAll().subscribe(clientes => {
      clientes.forEach(c => {
        if (c.id) {
          this.clienteMap[c.id] = c.nome;
        }
      });
    });
  }

  /**
   * Busca todos os chamados do backend e atualiza a tabela
   * Configura paginação e ordenação após carregar os dados
   */
  findAll(): void {
    this.service.findAll().subscribe(res => {
      this.ELEMENT_DATA = res;
      
      // Atualiza o DataSource com os novos dados
      this.dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
      
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

  /**
   * Retorna a cor correspondente ao status do chamado
   * Usado para estilizar os badges de status na tabela
   * 
   * @param status Status do chamado (ABERTO, ANDAMENTO, ENCERRADO)
   * @returns Código hexadecimal da cor
   */
  getStatusColor(status: string): string {
    switch(status) {
      case 'ABERTO': return '#3b82f6';      // Azul
      case 'ANDAMENTO': return '#f59e0b';   // Laranja/Amarelo
      case 'ENCERRADO': return '#10b981';   // Verde
      default: return '#6b7280';            // Cinza (status desconhecido)
    }
  }

  /**
   * Retorna a cor correspondente à prioridade do chamado
   * Usado para estilizar os badges de prioridade na tabela
   * 
   * @param prioridade Prioridade do chamado (BAIXA, MEDIA, ALTA)
   * @returns Código hexadecimal da cor
   */
  getPrioridadeColor(prioridade: string): string {
    switch(prioridade) {
      case 'BAIXA': return '#10b981';   // Verde
      case 'MEDIA': return '#f59e0b';   // Laranja/Amarelo
      case 'ALTA': return '#ef4444';    // Vermelho
      default: return '#6b7280';        // Cinza (prioridade desconhecida)
    }
  }
}

