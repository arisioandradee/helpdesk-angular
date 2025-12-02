import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChamadoService } from '../../../services/chamado.service';
import { Chamado } from '../../../models/chamado.model';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from '../../../services/tecnico.service';
import { ClienteService } from '../../../services/cliente.service';
import { Tecnico } from '../../../models/tecnico.model';
import { Cliente } from '../../../models/cliente.model';

/**
 * Componente responsável pela criação de novos chamados
 * 
 * Este componente:
 * - Exibe formulário para criação de chamado
 * - Carrega lista de técnicos e clientes para seleção
 * - Valida os dados do formulário antes do envio
 * - Permite criar chamado sem técnico atribuído (técnico opcional)
 * - Garante que nenhum ID seja enviado (gerado pelo backend)
 * - Trata erros de validação e de duplicação
 * 
 * Campos do formulário:
 * - Título: obrigatório, mínimo 3 caracteres
 * - Observações: obrigatório, mínimo 10 caracteres
 * - Prioridade: obrigatória (BAIXA, MEDIA, ALTA)
 * - Status: obrigatório (padrão: ABERTO)
 * - Cliente: obrigatório (seleção de lista)
 * - Técnico: opcional (seleção de lista)
 * 
 * Acesso: ADMIN, TECNICO, CLIENTE (controlado pelo RoleGuard)
 */
@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {

  /**
   * FormGroup que gerencia o formulário reativo
   * Contém validações para cada campo
   */
  chamadoForm: FormGroup;

  /**
   * Opções de status disponíveis para o chamado
   */
  statusOptions: string[] = ['ABERTO', 'ANDAMENTO', 'ENCERRADO'];

  /**
   * Opções de prioridade disponíveis para o chamado
   */
  prioridadeOptions: string[] = ['BAIXA', 'MEDIA', 'ALTA'];

  /**
   * Lista de técnicos carregada do backend
   * Usada para preencher o dropdown de seleção de técnico
   */
  tecnicos: Tecnico[] = [];

  /**
   * Lista de clientes carregada do backend
   * Usada para preencher o dropdown de seleção de cliente
   */
  clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Inicializa o formulário com validações
    this.chamadoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      observacoes: ['', [Validators.required, Validators.minLength(10)]],
      prioridade: ['', Validators.required],
      status: ['ABERTO', Validators.required],  // Status padrão ao criar
      tecnico: [''],  // Técnico é opcional
      cliente: ['', Validators.required]  // Cliente é obrigatório
    });
  }

  /**
   * Método executado ao inicializar o componente
   * Carrega as listas de técnicos e clientes para os dropdowns
   */
  ngOnInit(): void {
    this.loadTecnicos();
    this.loadClientes();
  }

  /**
   * Carrega a lista de técnicos do backend
   * Usado para preencher o dropdown de seleção de técnico
   */
  loadTecnicos(): void {
    this.tecnicoService.findAll().subscribe({
      next: (tecnicos) => {
        this.tecnicos = tecnicos;
      },
      error: () => {
        this.toastr.error('Erro ao carregar técnicos.', 'Erro');
      }
    });
  }

  /**
   * Carrega a lista de clientes do backend
   * Usado para preencher o dropdown de seleção de cliente
   */
  loadClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: () => {
        this.toastr.error('Erro ao carregar clientes.', 'Erro');
      }
    });
  }

  /**
   * Método executado ao submeter o formulário
   * 
   * Processo:
   * 1. Valida o formulário
   * 2. Prepara o objeto chamado com os dados do formulário
   * 3. Remove campos que não devem ser enviados (id, datas)
   * 4. Envia os dados para o backend
   * 5. Trata sucesso e erros
   */
  create(): void {
    // Verifica se o formulário é válido
    if (this.chamadoForm.invalid) {
      this.chamadoForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    // Prepara o objeto chamado com os dados do formulário
    const chamado: any = {
      titulo: this.chamadoForm.value.titulo,
      observacoes: this.chamadoForm.value.observacoes,
      prioridade: this.chamadoForm.value.prioridade,
      status: this.chamadoForm.value.status,
      cliente: this.chamadoForm.value.cliente,
      tecnico: this.chamadoForm.value.tecnico || null  // Se não selecionou técnico, envia null
    };
    
    // CRÍTICO: Remove campos que não devem ser enviados na criação
    // O backend gera automaticamente: id, dataAbertura, dataFechamento
    delete chamado.id;
    delete chamado.dataAbertura;
    delete chamado.dataFechamento;

    // Envia a requisição de criação
    this.service.create(chamado).subscribe({
      next: () => {
        this.toastr.success('Chamado criado com sucesso!', 'Sucesso');
        this.router.navigate(['/chamados']);
      },
      error: (err) => {
        console.error('Erro ao criar chamado:', err);
        let errorMessage = 'Erro ao criar chamado. Tente novamente.';
        
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
   * Cancela a criação e retorna para a lista de chamados
   */
  cancel(): void {
    this.router.navigate(['/chamados']);
  }

  /**
   * Getter para facilitar o acesso aos controles do formulário no template
   * Exemplo: f.titulo.errors no HTML
   */
  get f() {
    return this.chamadoForm.controls;
  }
}
