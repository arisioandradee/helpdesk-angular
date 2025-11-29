import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChamadoService } from '../../../services/chamado.service';
import { Chamado } from '../../../models/chamado.model';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from '../../../services/tecnico.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-chamado-delete',
  templateUrl: './chamado-delete.component.html',
  styleUrls: ['./chamado-delete.component.css']
})
export class ChamadoDeleteComponent implements OnInit {

  chamado: Chamado = {
    titulo: '',
    observacoes: '',
    prioridade: '',
    status: '',
    cliente: 0
  };

  chamadoId: number | null = null;
  tecnicoNome: string = '';
  clienteNome: string = '';

  constructor(
    private service: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chamadoId = parseInt(idParam, 10);
      if (isNaN(this.chamadoId) || this.chamadoId <= 0) {
        this.toastr.error('ID inválido.', 'Erro');
        this.router.navigate(['/chamados']);
        return;
      }
      this.findById();
    } else {
      this.toastr.error('ID não fornecido.', 'Erro');
      this.router.navigate(['/chamados']);
    }
  }

  findById(): void {
    if (!this.chamadoId) {
      this.toastr.error('ID inválido.', 'Erro');
      this.router.navigate(['/chamados']);
      return;
    }

    this.service.findById(this.chamadoId).subscribe({
      next: (chamado) => {
        this.chamado = chamado;
        this.loadNames();
      },
      error: (err) => {
        console.error('Erro ao carregar chamado:', err);
        if (err.status === 404) {
          this.toastr.error('Chamado não encontrado.', 'Erro');
        } else if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao carregar chamado.', 'Erro');
        }
        this.router.navigate(['/chamados']);
      }
    });
  }

  loadNames(): void {
    if (this.chamado.tecnico) {
      this.tecnicoService.findById(this.chamado.tecnico).subscribe({
        next: (tecnico) => {
          this.tecnicoNome = tecnico.nome;
        },
        error: () => {
          this.tecnicoNome = 'N/A';
        }
      });
    } else {
      this.tecnicoNome = 'Sem Técnico';
    }

    this.clienteService.findById(this.chamado.cliente).subscribe({
      next: (cliente) => {
        this.clienteNome = cliente.nome;
      },
      error: () => {
        this.clienteNome = 'N/A';
      }
    });
  }

  delete(): void {
    if (!this.chamadoId) {
      this.toastr.error('ID inválido.', 'Erro');
      return;
    }

    this.service.delete(this.chamadoId).subscribe({
      next: () => {
        this.toastr.success('Chamado excluído com sucesso!', 'Sucesso');
        this.router.navigate(['/chamados']);
      },
      error: (err: any) => {
        console.error('Erro ao excluir chamado:', err);
        
        if (err.status === 404) {
          this.toastr.error('Chamado não encontrado.', 'Erro');
          return;
        }
        
        if (err.status === 403) {
          this.toastr.error('Você não tem permissão para excluir este chamado.', 'Erro');
          return;
        }
        
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao excluir chamado. Tente novamente.', 'Erro');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/chamados']);
  }
}

