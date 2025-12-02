/**
 * Interface que representa um Cliente no sistema
 * 
 * Campos:
 * - id: ID único do cliente (gerado pelo backend)
 * - nome: Nome completo do cliente
 * - cpf: CPF do cliente (apenas números, 11 dígitos)
 * - email: Email do cliente (usado para login)
 * - senha: Senha do cliente (opcional na leitura, sempre presente na criação)
 * - perfis: Array com as roles/perfis do cliente (ex: ['CLIENTE'])
 */
export interface Cliente {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  perfis?: string[];
}

