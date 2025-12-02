import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela atualização de clientes
 * 
 * Este componente:
 * - Carrega os dados do cliente a ser editado através do ID na rota
 * - Preenche o formulário com os dados existentes
 * - Permite editar todos os campos exceto o ID
 * - Valida os dados antes do envio
 * - Permite atualizar sem alterar a senha (campo senha é opcional)
 * - Trata erros de validação e do backend
 * 
 * Comportamento especial:
 * - Se o campo senha estiver vazio, não é enviado (mantém a senha atual)
 * - CPF é formatado automaticamente removendo caracteres não numéricos
 * 
 * Acesso: Apenas ADMIN (controlado pelo RoleGuard)
 */
@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

  /**
   * FormGroup que gerencia o formulário reativo
   * Contém validações para cada campo
   */
  clienteForm: FormGroup;

  /**
   * Lista de perfis disponíveis para atribuição ao cliente
   */
  perfis: string[] = ['ADMIN', 'CLIENTE', 'TECNICO'];

  /**
   * ID do cliente sendo editado
   * Obtido da rota e usado para atualizar o registro correto
   */
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Inicializa o formulário com validações
    // Nota: senha não é obrigatória na atualização (pode manter a atual)
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],  // Opcional na atualização
      perfis: [[], Validators.required]
    });
  }

  /**
   * Método executado ao inicializar o componente
   * Obtém o ID do cliente da rota e carrega seus dados
   */
  ngOnInit(): void {
    // Obtém o ID da rota
    this.clienteId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    // Busca os dados do cliente para preencher o formulário
    this.findById();
  }

  /**
   * Busca os dados do cliente pelo ID
   * Preenche o formulário com os dados existentes
   */
  findById(): void {
    this.service.findById(this.clienteId!).subscribe({
      next: (cliente) => {
        // Remove formatação do CPF (pontos e traços) para exibir apenas números
        const cpfSemFormatacao = cliente.cpf ? cliente.cpf.replace(/\D/g, '') : '';
        
        // Garante que sempre tenha pelo menos um perfil selecionado
        const perfis = cliente.perfis && cliente.perfis.length > 0 ? cliente.perfis : ['CLIENTE'];
        
        // Preenche o formulário com os dados do cliente
        this.clienteForm.patchValue({
          nome: cliente.nome,
          cpf: cpfSemFormatacao,
          email: cliente.email,
          perfis: perfis
          // Senha não é preenchida por segurança (deixa vazio para manter a atual)
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar cliente.', 'Erro');
        this.router.navigate(['/clientes']);
      }
    });
  }

  /**
   * Método executado ao submeter o formulário
   * 
   * Processo:
   * 1. Valida o formulário
   * 2. Prepara o objeto cliente com os dados do formulário
   * 3. Remove a senha se estiver vazia (mantém a senha atual no backend)
   * 4. Envia os dados para o backend
   * 5. Trata sucesso e erros
   */
  update(): void {
    // Verifica se o formulário é válido
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    // Prepara o objeto cliente com os dados do formulário
    const cliente: Cliente = {
      ...this.clienteForm.value,
      id: this.clienteId,  // ID é obrigatório para atualização
      cpf: this.clienteForm.value.cpf.replace(/\D/g, '')  // Remove formatação do CPF
    };

    // Se a senha estiver vazia, remove do objeto
    // Isso permite atualizar sem alterar a senha (backend mantém a atual)
    if (!cliente.senha || cliente.senha.trim() === '') {
      delete cliente.senha;
    }

    // Envia a requisição de atualização
    this.service.update(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente atualizado com sucesso!', 'Sucesso');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        // Tratamento de erros do backend
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao atualizar cliente. Tente novamente.', 'Erro');
        }
      }
    });
  }

  /**
   * Cancela a edição e retorna para a lista de clientes
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

