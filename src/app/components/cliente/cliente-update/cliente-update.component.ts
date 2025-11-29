import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

  clienteForm: FormGroup;
  perfis: string[] = ['ADMIN', 'CLIENTE', 'TECNICO'];
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      perfis: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.clienteId!).subscribe({
      next: (cliente) => {
        const cpfSemFormatacao = cliente.cpf ? cliente.cpf.replace(/\D/g, '') : '';
        const perfis = cliente.perfis && cliente.perfis.length > 0 ? cliente.perfis : ['CLIENTE'];
        
        this.clienteForm.patchValue({
          nome: cliente.nome,
          cpf: cpfSemFormatacao,
          email: cliente.email,
          perfis: perfis
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar cliente.', 'Erro');
        this.router.navigate(['/clientes']);
      }
    });
  }

  update(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const cliente: Cliente = {
      ...this.clienteForm.value,
      id: this.clienteId,
      cpf: this.clienteForm.value.cpf.replace(/\D/g, '')
    };

    if (!cliente.senha || cliente.senha.trim() === '') {
      delete cliente.senha;
    }

    this.service.update(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente atualizado com sucesso!', 'Sucesso');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao atualizar cliente. Tente novamente.', 'Erro');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }

  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    this.clienteForm.patchValue({ cpf: value });
  }

  get f() {
    return this.clienteForm.controls;
  }
}

