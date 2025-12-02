import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela exclusão de clientes
 * 
 * Este componente:
 * - Carrega os dados do cliente a ser excluído através do ID na rota
 * - Exibe uma tela de confirmação com os dados do cliente
 * - Realiza a exclusão após confirmação do usuário
 * - Trata erros específicos (cliente associado a chamados, não encontrado, etc.)
 * 
 * Acesso: Apenas ADMIN (controlado pelo RoleGuard)
 */
@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  /**
   * Objeto cliente que será excluído
   * Inicializado com valores vazios para evitar erros de binding
   */
  cliente: Cliente = {
    nome: '',
    cpf: '',
    email: '',
    perfis: []
  };

  /**
   * ID do cliente obtido da rota
   */
  clienteId: number | null = null;

  constructor(
    private service: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  /**
   * Método executado ao inicializar o componente
   * Obtém o ID do cliente da rota e carrega seus dados
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      // Converte o ID da string para número
      this.clienteId = parseInt(idParam, 10);
      
      // Valida se o ID é um número válido
      if (isNaN(this.clienteId) || this.clienteId <= 0) {
        this.toastr.error('ID inválido.', 'Erro');
        this.router.navigate(['/clientes']);
        return;
      }
      
      // Busca os dados do cliente
      this.findById();
    } else {
      this.toastr.error('ID não fornecido.', 'Erro');
      this.router.navigate(['/clientes']);
    }
  }

  /**
   * Busca os dados do cliente pelo ID
   * Carrega as informações para exibição na tela de confirmação
   */
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
        
        // Tratamento específico de erros HTTP
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

  /**
   * Realiza a exclusão do cliente
   * 
   * Tratamento de erros:
   * - 500/400: Cliente associado a chamados (não pode excluir)
   * - 404: Cliente não encontrado
   * - 403: Sem permissão para excluir
   * - Outros: Erro genérico
   */
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
        
        // Erro 500: Geralmente indica constraint de chave estrangeira
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
        
        // Erro 404: Cliente não existe
        if (err.status === 404) {
          this.toastr.error('Cliente não encontrado.', 'Erro');
          return;
        }
        
        // Erro 403: Sem permissão
        if (err.status === 403) {
          this.toastr.error('Você não tem permissão para excluir este cliente.', 'Erro');
          return;
        }
        
        // Erro 400: Bad request (pode indicar constraint)
        if (err.status === 400) {
          this.toastr.error('Não é possível excluir este cliente. Pode estar associado a chamados.', 'Erro');
          return;
        }
        
        // Extrai mensagem de erro do backend
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
        
        // Verifica se a mensagem indica associação com chamados
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
        
        // Exibe mensagem de erro genérica ou específica
        if (errorMessage) {
          this.toastr.error(errorMessage, 'Erro');
        } else {
          this.toastr.error('Erro ao excluir cliente. Tente novamente.', 'Erro');
        }
      }
    });
  }

  /**
   * Cancela a exclusão e retorna para a lista de clientes
   */
  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}

