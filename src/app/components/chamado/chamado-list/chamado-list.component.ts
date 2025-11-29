import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChamadoService } from '../../../services/chamado.service';
import { Chamado } from '../../../models/chamado.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TecnicoService } from '../../../services/tecnico.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  ELEMENT_DATA: Chamado[] = [];
  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico', 'status', 'prioridade', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
  tecnicoMap: any = {};
  clienteMap: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.loadMaps();
    this.findAll();
  }

  loadMaps(): void {
    this.tecnicoService.findAll().subscribe(tecnicos => {
      tecnicos.forEach(t => {
        if (t.id) {
          this.tecnicoMap[t.id] = t.nome;
        }
      });
    });

    this.clienteService.findAll().subscribe(clientes => {
      clientes.forEach(c => {
        if (c.id) {
          this.clienteMap[c.id] = c.nome;
        }
      });
    });
  }

  findAll(): void {
    this.service.findAll().subscribe(res => {
      this.ELEMENT_DATA = res;
      this.dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'ABERTO': return '#3b82f6';
      case 'ANDAMENTO': return '#f59e0b';
      case 'ENCERRADO': return '#10b981';
      default: return '#6b7280';
    }
  }

  getPrioridadeColor(prioridade: string): string {
    switch(prioridade) {
      case 'BAIXA': return '#10b981';
      case 'MEDIA': return '#f59e0b';
      case 'ALTA': return '#ef4444';
      default: return '#6b7280';
    }
  }
}

