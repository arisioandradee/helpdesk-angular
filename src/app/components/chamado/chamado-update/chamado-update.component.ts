import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChamadoService } from '../../../services/chamado.service';
import { Chamado } from '../../../models/chamado.model';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from '../../../services/tecnico.service';
import { ClienteService } from '../../../services/cliente.service';
import { Tecnico } from '../../../models/tecnico.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent implements OnInit {

  chamadoForm: FormGroup;
  statusOptions: string[] = ['ABERTO', 'ANDAMENTO', 'ENCERRADO'];
  prioridadeOptions: string[] = ['BAIXA', 'MEDIA', 'ALTA'];
  tecnicos: Tecnico[] = [];
  clientes: Cliente[] = [];
  chamadoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.chamadoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      observacoes: ['', [Validators.required, Validators.minLength(10)]],
      prioridade: ['', Validators.required],
      status: ['', Validators.required],
      tecnico: [''],
      cliente: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chamadoId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.loadTecnicos();
    this.loadClientes();
    this.findById();
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

  findById(): void {
    this.service.findById(this.chamadoId!).subscribe({
      next: (chamado) => {
        this.chamadoForm.patchValue({
          titulo: chamado.titulo,
          observacoes: chamado.observacoes,
          prioridade: chamado.prioridade,
          status: chamado.status,
          cliente: chamado.cliente,
          tecnico: chamado.tecnico ? chamado.tecnico : null
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar chamado.', 'Erro');
        this.router.navigate(['/chamados']);
      }
    });
  }

  update(): void {
    if (this.chamadoForm.invalid) {
      this.chamadoForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const chamado: Chamado = {
      ...this.chamadoForm.value,
      id: this.chamadoId,
      tecnico: this.chamadoForm.value.tecnico || null
    };

    this.service.update(chamado).subscribe({
      next: () => {
        this.toastr.success('Chamado atualizado com sucesso!', 'Sucesso');
        this.router.navigate(['/chamados']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao atualizar chamado. Tente novamente.', 'Erro');
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

