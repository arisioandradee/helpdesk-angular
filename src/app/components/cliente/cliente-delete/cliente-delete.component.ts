import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  cliente: Cliente = {
    nome: '',
    cpf: '',
    email: '',
    perfis: []
  };

  clienteId: number | null = null;

  constructor(
    private service: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = parseInt(idParam, 10);
      if (isNaN(this.clienteId) || this.clienteId <= 0) {
        this.toastr.error('ID inválido.', 'Erro');
        this.router.navigate(['/clientes']);
        return;
      }
      this.findById();
    } else {
      this.toastr.error('ID não fornecido.', 'Erro');
      this.router.navigate(['/clientes']);
    }
  }

  findById(): void {
    if (!this.clienteId) {
      this.toastr.error('ID inválido.', 'Erro');
      this.router.navigate(['/clientes']);
      return;
    }

    this.service.findById(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
      },
      error: (err) => {
        console.error('Erro ao carregar cliente:', err);
        if (err.status === 404) {
          this.toastr.error('Cliente não encontrado.', 'Erro');
        } else if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao carregar cliente.', 'Erro');
        }
        this.router.navigate(['/clientes']);
      }
    });
  }

  delete(): void {
    if (!this.clienteId) {
      this.toastr.error('ID inválido.', 'Erro');
      return;
    }

    this.service.delete(this.clienteId).subscribe({
      next: () => {
        this.toastr.success('Cliente excluído com sucesso!', 'Sucesso');
        this.router.navigate(['/clientes']);
      },
      error: (err: any) => {
        console.error('Erro ao excluir cliente:', err);
        
        if (err.status === 500) {
          this.toastr.error(
            'Não é possível excluir este cliente pois ele está associado a um ou mais chamados em andamento. Finalize os chamados antes de excluir.',
            'Atenção',
            { 
              timeOut: 6000,
              positionClass: 'toast-top-right',
              closeButton: true,
              progressBar: true
            }
          );
          return;
        }
        
        if (err.status === 404) {
          this.toastr.error('Cliente não encontrado.', 'Erro');
          return;
        }
        
        if (err.status === 403) {
          this.toastr.error('Você não tem permissão para excluir este cliente.', 'Erro');
          return;
        }
        
        if (err.status === 400) {
          this.toastr.error('Não é possível excluir este cliente. Pode estar associado a chamados.', 'Erro');
          return;
        }
        
        let errorMessage = '';
        if (err.error) {
          if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error) {
            errorMessage = err.error.error;
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          }
        }
        
        if (errorMessage) {
          const lowerMessage = errorMessage.toLowerCase();
          if (lowerMessage.includes('chamado') || lowerMessage.includes('associado') || lowerMessage.includes('em andamento')) {
            this.toastr.error(
              'Não é possível excluir este cliente pois ele está associado a um ou mais chamados em andamento. Finalize os chamados antes de excluir.',
              'Atenção',
              { timeOut: 6000 }
            );
            return;
          }
        }
        
        if (errorMessage) {
          this.toastr.error(errorMessage, 'Erro');
        } else {
          this.toastr.error('Erro ao excluir cliente. Tente novamente.', 'Erro');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}

