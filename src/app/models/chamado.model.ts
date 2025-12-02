/**
 * Interface que representa um Chamado no sistema
 * 
 * Campos:
 * - id: ID único do chamado (gerado pelo backend)
 * - titulo: Título/resumo do chamado
 * - observacoes: Descrição detalhada do problema
 * - prioridade: Nível de prioridade (BAIXA, MEDIA, ALTA)
 * - status: Status atual (ABERTO, ANDAMENTO, ENCERRADO)
 * - tecnico: ID do técnico responsável (opcional)
 * - cliente: ID do cliente que abriu o chamado (obrigatório)
 * - dataAbertura: Data de abertura (gerada automaticamente)
 * - dataFechamento: Data de fechamento (gerada ao encerrar)
 */
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

