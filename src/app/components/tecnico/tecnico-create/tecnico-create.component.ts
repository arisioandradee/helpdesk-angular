import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico.model';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela criação de novos técnicos
 * 
 * Este componente:
 * - Exibe formulário para criação de técnico
 * - Valida os dados do formulário antes do envio
 * - Remove caracteres especiais do CPF
 * - Garante que nenhum ID seja enviado (gerado pelo backend)
 * - Trata erros de validação e de duplicação
 * 
 * Acesso: Apenas ADMIN (controlado pelo RoleGuard)
 */
@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit {

  /**
   * FormGroup que gerencia o formulário reativo
   * Contém validações para cada campo
   */
  tecnicoForm: FormGroup;

  /**
   * Lista de perfis disponíveis para atribuição ao técnico
   */
  perfis: string[] = ['ADMIN', 'CLIENTE', 'TECNICO'];

  constructor(
    private fb: FormBuilder,
    private service: TecnicoService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Inicializa o formulário com validações
    this.tecnicoForm = this.fb.group({
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
    if (this.tecnicoForm.invalid) {
      this.tecnicoForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    // Prepara o objeto técnico com os dados do formulário
    // Importante: remove qualquer caracter não numérico do CPF
    const tecnico: any = {
      nome: this.tecnicoForm.value.nome,
      cpf: this.tecnicoForm.value.cpf.replace(/\D/g, ''),
      email: this.tecnicoForm.value.email,
      senha: this.tecnicoForm.value.senha,
      perfis: this.tecnicoForm.value.perfis
    };
    
    // CRÍTICO: Remove o campo ID para evitar erro de chave primária duplicada
    // O backend gera o ID automaticamente
    delete tecnico.id;
    
    // Envia a requisição de criação
    this.service.create(tecnico).subscribe({
      next: () => {
        this.toastr.success('Técnico criado com sucesso!', 'Sucesso');
        this.router.navigate(['/tecnicos']);
      },
      error: (err) => {
        console.error('Erro ao criar técnico:', err);
        let errorMessage = 'Erro ao criar técnico. Tente novamente.';
        
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
   * Cancela a criação e retorna para a lista de técnicos
   */
  cancel(): void {
    this.router.navigate(['/tecnicos']);
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
    this.tecnicoForm.patchValue({ cpf: value });
  }

  /**
   * Getter para facilitar o acesso aos controles do formulário no template
   * Exemplo: f.nome.errors no HTML
   */
  get f() {
    return this.tecnicoForm.controls;
  }
}
