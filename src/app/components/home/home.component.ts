import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ticketsOpen = 0;
  ticketsClosed = 0;
  ticketsPending = 0;
  newClients = 0;

  departments: any[] = [];
  recentTickets: any[] = [];

  tecnicoMap: any = {};

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getTecnicos().subscribe(tecnicos => {
      tecnicos.forEach(t => this.tecnicoMap[t.id] = t.nome);

      this.dashboardService.getChamados().subscribe(chamados => {
        this.ticketsOpen = chamados.filter(c => c.status === 'ABERTO').length;
        this.ticketsClosed = chamados.filter(c => c.status === 'ENCERRADO').length;
        this.ticketsPending = chamados.filter(c => c.status === 'ANDAMENTO').length;

        this.recentTickets = chamados
          .sort((a, b) => new Date(a.dataAbertura) < new Date(b.dataAbertura) ? 1 : -1)
          .slice(0, 7);

        const grouped: any = {};
        chamados.forEach(c => {
          const key = c.tecnico || 'Sem Técnico';
          if (!grouped[key]) grouped[key] = 0;
          grouped[key]++;
        });

        this.departments = Object.keys(grouped).map(k => ({
          name: this.tecnicoMap[k] || k,
          count: grouped[k]
        }));
      });
    });

    this.dashboardService.getClientes().subscribe(clientes => {
      this.newClients = clientes.length;
    });
  }
}
