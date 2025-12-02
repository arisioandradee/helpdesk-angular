import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

/**
 * Componente principal do Dashboard (Home)
 * 
 * Este componente exibe:
 * - Estatísticas de chamados (abertos, fechados, em andamento)
 * - Total de clientes cadastrados
 * - Gráfico de chamados por técnico
 * - Lista dos 7 chamados mais recentes
 * 
 * Acesso: Todos os usuários autenticados
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Contadores de chamados por status
  ticketsOpen = 0;      // Chamados com status ABERTO
  ticketsClosed = 0;    // Chamados com status ENCERRADO
  ticketsPending = 0;   // Chamados com status ANDAMENTO

  // Total de clientes cadastrados
  newClients = 0;

  /**
   * Array com dados agrupados de chamados por técnico
   * Usado para exibir o gráfico de barras
   */
  departments: any[] = [];

  /**
   * Array com os 7 chamados mais recentes
   * Ordenados por data de abertura (mais recente primeiro)
   */
  recentTickets: any[] = [];

  /**
   * Mapa para traduzir ID do técnico em nome
   * Formato: { id: 'nome do técnico' }
   */
  tecnicoMap: any = {};

  constructor(private dashboardService: DashboardService) { }

  /**
   * Método executado ao inicializar o componente
   * Carrega todos os dados do dashboard
   */
  ngOnInit(): void {
    this.loadDashboard();
  }

  /**
   * Carrega todos os dados necessários para o dashboard
   * 
   * Processo:
   * 1. Carrega técnicos e cria mapa ID -> Nome
   * 2. Carrega chamados e calcula estatísticas
   * 3. Agrupa chamados por técnico para o gráfico
   * 4. Seleciona os 7 chamados mais recentes
   * 5. Carrega total de clientes
   */
  loadDashboard() {
    // Primeiro carrega técnicos para criar o mapa de nomes
    this.dashboardService.getTecnicos().subscribe(tecnicos => {
      // Cria um mapa para traduzir ID do técnico em nome
      // Facilita a exibição do nome nas tabelas e gráficos
      tecnicos.forEach(t => {
        if (t.id) {
          this.tecnicoMap[t.id] = t.nome;
        }
      });

      // Depois carrega chamados para calcular estatísticas
      this.dashboardService.getChamados().subscribe(chamados => {
        // Conta chamados por status
        this.ticketsOpen = chamados.filter(c => c.status === 'ABERTO').length;
        this.ticketsClosed = chamados.filter(c => c.status === 'ENCERRADO').length;
        this.ticketsPending = chamados.filter(c => c.status === 'ANDAMENTO').length;

        // Seleciona os 7 chamados mais recentes
        // Ordena por data de abertura (mais recente primeiro) e pega os 7 primeiros
        this.recentTickets = chamados
          .sort((a, b) => {
            const dateA = new Date(a.dataAbertura || 0).getTime();
            const dateB = new Date(b.dataAbertura || 0).getTime();
            return dateB - dateA; // Ordem decrescente (mais recente primeiro)
          })
          .slice(0, 7);

        // Agrupa chamados por técnico para o gráfico
        const grouped: any = {};
        chamados.forEach(c => {
          // Usa 'Sem Técnico' se o chamado não tiver técnico atribuído
          const key = c.tecnico || 'Sem Técnico';
          if (!grouped[key]) {
            grouped[key] = 0;
          }
          grouped[key]++;
        });

        // Converte o objeto agrupado em array para o gráfico
        // Traduz o ID do técnico para nome usando o mapa
        this.departments = Object.keys(grouped).map(k => ({
          name: this.tecnicoMap[k] || k,
          count: grouped[k]
        }));
      });
    });

    // Carrega total de clientes
    this.dashboardService.getClientes().subscribe(clientes => {
      this.newClients = clientes.length;
    });
  }
}
