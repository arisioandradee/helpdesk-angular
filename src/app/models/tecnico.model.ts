/**
 * Interface que representa um Técnico no sistema
 * 
 * Campos:
 * - id: ID único do técnico (gerado pelo backend)
 * - nome: Nome completo do técnico
 * - cpf: CPF do técnico (apenas números, 11 dígitos)
 * - email: Email do técnico (usado para login)
 * - senha: Senha do técnico (opcional na leitura, sempre presente na criação)
 * - perfis: Array com as roles/perfis do técnico (ex: ['TECNICO'])
 */
export interface Tecnico {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  perfis?: string[];
}