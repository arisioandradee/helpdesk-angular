import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent implements OnInit {

  tecnico: Tecnico = {
    nome: '',
    cpf: '',
    email: '',
    perfis: []
  };

  tecnicoId: number | null = null;

  constructor(
    private service: TecnicoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.tecnicoId = parseInt(idParam, 10);
      if (isNaN(this.tecnicoId) || this.tecnicoId <= 0) {
        this.toastr.error('ID inválido.', 'Erro');
        this.router.navigate(['/tecnicos']);
        return;
      }
      this.findById();
    } else {
      this.toastr.error('ID não fornecido.', 'Erro');
      this.router.navigate(['/tecnicos']);
    }
  }

  findById(): void {
    if (!this.tecnicoId) {
      this.toastr.error('ID inválido.', 'Erro');
      this.router.navigate(['/tecnicos']);
      return;
    }

    this.service.findById(this.tecnicoId).subscribe({
      next: (tecnico) => {
        this.tecnico = tecnico;
      },
      error: (err) => {
        console.error('Erro ao carregar técnico:', err);
        if (err.status === 404) {
          this.toastr.error('Técnico não encontrado.', 'Erro');
        } else if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao carregar técnico.', 'Erro');
        }
        this.router.navigate(['/tecnicos']);
      }
    });
  }

  delete(): void {
    if (!this.tecnicoId) {
      this.toastr.error('ID inválido.', 'Erro');
      return;
    }

    this.service.delete(this.tecnicoId).subscribe({
      next: () => {
        this.toastr.success('Técnico excluído com sucesso!', 'Sucesso');
        this.router.navigate(['/tecnicos']);
      },
      error: (err: any) => {
        console.error('Erro ao excluir técnico:', err);
        
        if (err.status === 500) {
          this.toastr.error(
            'Não é possível excluir este técnico pois ele está associado a um ou mais chamados em andamento. Finalize os chamados antes de excluir.',
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
        
        if (err.status === 404) {
          this.toastr.error('Técnico não encontrado.', 'Erro');
          return;
        }
        
        if (err.status === 403) {
          this.toastr.error('Você não tem permissão para excluir este técnico.', 'Erro');
          return;
        }
        
        if (err.status === 400) {
          this.toastr.error('Não é possível excluir este técnico. Pode estar associado a chamados.', 'Erro');
          return;
        }
        
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
        
        if (errorMessage) {
          const lowerMessage = errorMessage.toLowerCase();
          if (lowerMessage.includes('chamado') || lowerMessage.includes('associado') || lowerMessage.includes('em andamento')) {
            this.toastr.error(
              'Não é possível excluir este técnico pois ele está associado a um ou mais chamados em andamento. Finalize os chamados antes de excluir.',
              'Atenção',
              { timeOut: 6000 }
            );
            return;
          }
        }
        
        if (errorMessage) {
          this.toastr.error(errorMessage, 'Erro');
        } else {
          this.toastr.error('Erro ao excluir técnico. Tente novamente.', 'Erro');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tecnicos']);
  }
}
