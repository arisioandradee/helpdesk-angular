export interface Chamado {
  id?: number;
  titulo: string;
  observacoes: string;
  prioridade: string;
  status: string;
  tecnico?: number;
  cliente: number;
  dataAbertura?: string;
  dataFechamento?: string;
}

