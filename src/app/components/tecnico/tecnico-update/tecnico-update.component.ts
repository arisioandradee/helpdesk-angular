import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

  tecnicoForm: FormGroup;
  perfis: string[] = ['ADMIN', 'CLIENTE', 'TECNICO'];
  tecnicoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: TecnicoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.tecnicoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      perfis: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.tecnicoId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnicoId!).subscribe({
      next: (tecnico) => {
        const cpfSemFormatacao = tecnico.cpf ? tecnico.cpf.replace(/\D/g, '') : '';
        const perfis = tecnico.perfis && tecnico.perfis.length > 0 ? tecnico.perfis : ['TECNICO'];
        
        this.tecnicoForm.patchValue({
          nome: tecnico.nome,
          cpf: cpfSemFormatacao,
          email: tecnico.email,
          perfis: perfis
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar técnico.', 'Erro');
        this.router.navigate(['/tecnicos']);
      }
    });
  }

  update(): void {
    if (this.tecnicoForm.invalid) {
      this.tecnicoForm.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const tecnico: Tecnico = {
      ...this.tecnicoForm.value,
      id: this.tecnicoId,
      cpf: this.tecnicoForm.value.cpf.replace(/\D/g, '')
    };

    if (!tecnico.senha || tecnico.senha.trim() === '') {
      delete tecnico.senha;
    }

    this.service.update(tecnico).subscribe({
      next: () => {
        this.toastr.success('Técnico atualizado com sucesso!', 'Sucesso');
        this.router.navigate(['/tecnicos']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao atualizar técnico. Tente novamente.', 'Erro');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tecnicos']);
  }

  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    this.tecnicoForm.patchValue({ cpf: value });
  }

  get f() {
    return this.tecnicoForm.controls;
  }
}
