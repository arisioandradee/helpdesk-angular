import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

  clienteForm: FormGroup;
  perfis: string[] = ['ADMIN', 'CLIENTE', 'TECNICO'];

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      perfis: [[], Validators.required]
    });
  }

  ngOnInit(): void {
  }

  create(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const cliente: any = {
      nome: this.clienteForm.value.nome,
      cpf: this.clienteForm.value.cpf.replace(/\D/g, ''),
      email: this.clienteForm.value.email,
      senha: this.clienteForm.value.senha,
      perfis: this.clienteForm.value.perfis
    };
    this.service.create(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente criado com sucesso!', 'Sucesso');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao criar cliente. Tente novamente.', 'Erro');
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

