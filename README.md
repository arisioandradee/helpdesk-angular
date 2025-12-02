# Help Desk - Sistema de Gerenciamento de Chamados

Sistema completo de help desk desenvolvido em Angular com controle de acesso baseado em roles.

## 📋 Sobre o Projeto

Sistema web para gerenciamento de chamados técnicos com três tipos de usuários:
- **ADMIN**: Acesso total ao sistema
- **TECNICO**: Gerencia chamados
- **CLIENTE**: Cria e visualiza seus chamados

## 🚀 Tecnologias Utilizadas

- **Angular 12**
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa
- **JWT** - Autenticação e autorização
- **TypeScript**
- **RxJS Operators**

## 🏗️ Estrutura do Projeto

```
src/app/
├── auth/                    # Guards de autenticação e autorização
│   ├── auth.guard.ts       # Verifica se usuário está autenticado
│   └── role.guard.ts       # Verifica permissões baseadas em roles
├── components/             # Componentes da aplicação
│   ├── chamado/           # Módulo de chamados (CRUD)
│   ├── cliente/           # Módulo de clientes (CRUD)
│   ├── tecnico/           # Módulo de técnicos (CRUD)
│   ├── home/              # Dashboard principal
│   ├── login/             # Página de login
│   ├── nav/               # Menu lateral (sidebar)
│   └── header/            # Cabeçalho fixo
├── config/                # Configurações
│   └── api.config.ts      # URL base da API
├── interceptors/          # Interceptores HTTP
│   └── auth.interceptor.ts # Adiciona token JWT nas requisições
├── models/                # Interfaces TypeScript
├── services/              # Serviços da aplicação
│   ├── auth.service.ts    # Serviço de autenticação
│   ├── permission.service.ts # Controle de permissões
│   └── ...
└── app-routing.module.ts  # Configuração de rotas
```

## 🔐 Sistema de Autenticação e Autorização

### Autenticação (AuthGuard)
- Verifica se o usuário está logado antes de acessar qualquer rota protegida
- Redireciona para login se não autenticado

### Autorização (RoleGuard)
- Controla acesso baseado nas roles do usuário
- Verifica permissões específicas para cada operação

### Permissões por Tipo de Usuário

#### ADMIN
- ✅ Criar, editar e excluir técnicos
- ✅ Criar, editar e excluir clientes
- ✅ Criar, editar e excluir chamados
- ✅ Visualizar todas as listas

#### TECNICO
- ✅ Visualizar todas as listas
- ✅ Criar chamados
- ✅ Atualizar chamados
- ❌ Criar/editar/excluir técnicos ou clientes
- ❌ Excluir chamados

#### CLIENTE
- ✅ Visualizar todas as listas
- ✅ Criar chamados
- ❌ Editar ou excluir qualquer dado

## 🔑 Controle de Permissões

O sistema utiliza o serviço `PermissionService` que:
1. Decodifica as roles do token JWT
2. Normaliza as roles removendo o prefixo "ROLE_" se existir
3. Armazena em cache para melhor performance
4. Fornece métodos para verificar permissões específicas

## 🌐 Interceptor HTTP

O `AuthInterceptor` adiciona automaticamente o token JWT no header `Authorization` de todas as requisições HTTP, exceto para a rota de login.

## 📝 Rotas Protegidas

Todas as rotas (exceto login) são protegidas pelo `AuthGuard`. Rotas específicas também utilizam o `RoleGuard` para controle de acesso baseado em roles:

- `/home` - Dashboard (autenticação obrigatória)
- `/tecnicos` - Lista (todos), Create/Update/Delete (apenas ADMIN)
- `/clientes` - Lista (todos), Create/Update/Delete (apenas ADMIN)
- `/chamados` - Lista (todos), Create (todos), Update (ADMIN/TECNICO), Delete (apenas ADMIN)

## 🎨 Componentes Principais

### Dashboard (Home)
- Exibe estatísticas de chamados
- Gráfico de chamados por técnico
- Tabela de chamados recentes

### CRUD Completo
Cada módulo (Chamado, Cliente, Técnico) possui:
- Listagem com busca e paginação
- Criação de novos registros
- Edição de registros existentes
- Exclusão com confirmação

## 🔧 Configuração

### API Backend
Configure a URL da API em `src/app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: 'http://localhost:8080'
};
```

### Instalação

```bash
npm install
ng serve
```

A aplicação estará disponível em `http://localhost:4200`

## 📦 Principais Funcionalidades

1. **Autenticação JWT** - Login seguro com tokens
2. **Controle de Acesso Granular** - Permissões por tipo de usuário
3. **Interface Responsiva** - Design moderno com Angular Material
4. **Validação de Formulários** - Validação em tempo real
5. **Feedback Visual** - Toasts para ações do usuário
6. **Busca e Filtros** - Filtragem em tempo real nas tabelas
7. **Paginação** - Tabelas paginadas para melhor performance

## 🎯 Diferenciais Técnicos

- **Separação de Responsabilidades**: Guards, Services e Components bem organizados
- **Reatividade**: Uso de RxJS para gerenciamento de estado assíncrono
- **Type Safety**: TypeScript para maior segurança de tipos
- **Cache Inteligente**: Cache de roles para melhor performance
- **Fallback de Roles**: Sistema busca roles do backend se não estiverem no token

## 📚 Padrões Utilizados

- **Service Pattern** - Serviços para lógica de negócio
- **Guard Pattern** - Proteção de rotas
- **Interceptor Pattern** - Manipulação de requisições HTTP
- **Observer Pattern** - RxJS Observables

## 🔍 Detalhes de Implementação

### Normalização de Roles
O sistema remove automaticamente o prefixo "ROLE_" das roles do backend para padronização interna.

### Cache de Permissões
As roles são armazenadas em cache e no localStorage para evitar decodificação repetida do token.

### Tratamento de Erros
Tratamento robusto de erros com mensagens amigáveis ao usuário e logs para debug.

## 🛠️ Solução de Problemas

### Erro de ID Duplicado
Se encontrar erro de chave primária duplicada ao criar registros, execute no PostgreSQL:

```sql
SELECT setval('chamado_id_seq', (SELECT MAX(id) FROM chamado));
SELECT setval('cliente_id_seq', (SELECT MAX(id) FROM cliente));
SELECT setval('tecnico_id_seq', (SELECT MAX(id) FROM tecnico));
```

Isso sincroniza as sequências com os IDs existentes.

## 📖 Estrutura de Código

O código está bem documentado com comentários explicativos em:
- Componentes: explicam propósito e funcionamento
- Serviços: documentam métodos e retornos
- Guards: descrevem lógica de proteção
- Models: definem estrutura de dados

---

Desenvolvido com foco em segurança, performance e experiência do usuário.

by: Arisio Andrade