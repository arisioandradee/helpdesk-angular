import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela criação de novos clientes
 * 
 * Este componente:
 * - Exibe formulário para criação de cliente
 * - Valida os dados do formulário antes do envio
 * - Remove caracteres especiais do CPF
 * - Garante que nenhum ID seja enviado (gerado pelo backend)
 * - Trata erros de validação e de duplicação
 * 
 * Acesso: Apenas ADMIN (controlado pelo RoleGuard)
 */
@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

  /**
   * FormGroup que gerencia o formulário reativo
   * Contém validações para cada campo
   */
  clienteForm: FormGroup;

  /**
   * Lista de perfis disponíveis para atribuição ao cliente
   */
  perfis: string[] = ['ADMIN', 'CLIENTE', 'TECNICO'];

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Inicializa o formulário com validações
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      perfis: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    // Componente pronto para uso
  }

  /**
   * Método executado ao submeter o formulário
   * 
   * Processo:
   * 1. Valida o formulário
   * 2. Remove caracteres não numéricos do CPF
   * 3. Remove o campo ID (se existir) para evitar conflitos
   * 4. Envia os dados para o backend
   * 5. Trata sucesso e erros
   */
  create(): void {
    // Verifica se o formulário é válido
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    // Prepara o objeto cliente com os dados do formulário
    // Importante: remove qualquer caracter não numérico do CPF
    const cliente: any = {
      nome: this.clienteForm.value.nome,
      cpf: this.clienteForm.value.cpf.replace(/\D/g, ''),
      email: this.clienteForm.value.email,
      senha: this.clienteForm.value.senha,
      perfis: this.clienteForm.value.perfis
    };
    
    // CRÍTICO: Remove o campo ID para evitar erro de chave primária duplicada
    // O backend gera o ID automaticamente
    delete cliente.id;
    
    // Envia a requisição de criação
    this.service.create(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente criado com sucesso!', 'Sucesso');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        console.error('Erro ao criar cliente:', err);
        let errorMessage = 'Erro ao criar cliente. Tente novamente.';
        
        // Extrai mensagem de erro do backend
        if (err.error) {
          if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error) {
            errorMessage = err.error.error;
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          }
          
          // Detecta erro específico de chave primária duplicada (problema de sequência do banco)
          if (errorMessage.includes('duplicate key') || errorMessage.includes('violates unique constraint')) {
            errorMessage = 'Erro: ID duplicado. Por favor, recarregue a página e tente novamente.';
          }
        }
        
        this.toastr.error(errorMessage, 'Erro');
      }
    });
  }

  /**
   * Cancela a criação e retorna para a lista de clientes
   */
  cancel(): void {
    this.router.navigate(['/clientes']);
  }

  /**
   * Formata o CPF removendo caracteres não numéricos
   * Limita a 11 dígitos
   * 
   * @param event Evento de input do campo CPF
   */
  formatCpf(event: any): void {
    // Remove tudo que não é dígito
    let value = event.target.value.replace(/\D/g, '');
    
    // Limita a 11 caracteres (tamanho do CPF)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Atualiza o valor no formulário
    this.clienteForm.patchValue({ cpf: value });
  }

  /**
   * Getter para facilitar o acesso aos controles do formulário no template
   * Exemplo: f.nome.errors no HTML
   */
  get f() {
    return this.clienteForm.controls;
  }
}

