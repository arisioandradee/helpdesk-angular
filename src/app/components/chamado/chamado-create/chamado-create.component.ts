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

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {

  chamadoForm: FormGroup;
  statusOptions: string[] = ['ABERTO', 'ANDAMENTO', 'ENCERRADO'];
  prioridadeOptions: string[] = ['BAIXA', 'MEDIA', 'ALTA'];
  tecnicos: Tecnico[] = [];
  clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.chamadoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      observacoes: ['', [Validators.required, Validators.minLength(10)]],
      prioridade: ['', Validators.required],
      status: ['ABERTO', Validators.required],
      tecnico: [''],
      cliente: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTecnicos();
    this.loadClientes();
  }

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

  create(): void {
    if (this.chamadoForm.invalid) {
      this.chamadoForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const chamado: any = {
      titulo: this.chamadoForm.value.titulo,
      observacoes: this.chamadoForm.value.observacoes,
      prioridade: this.chamadoForm.value.prioridade,
      status: this.chamadoForm.value.status,
      cliente: this.chamadoForm.value.cliente,
      tecnico: this.chamadoForm.value.tecnico || null
    };

    this.service.create(chamado).subscribe({
      next: () => {
        this.toastr.success('Chamado criado com sucesso!', 'Sucesso');
        this.router.navigate(['/chamados']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao criar chamado. Tente novamente.', 'Erro');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/chamados']);
  }

  get f() {
    return this.chamadoForm.controls;
  }
}

