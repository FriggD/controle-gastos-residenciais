# Sistema de Controle de Gastos Residenciais

Sistema completo para gerenciamento de gastos residenciais desenvolvido com .NET 8, React e PostgreSQL.

## Tecnologias Utilizadas

### Backend
- C# .NET 8
- ASP.NET Core Web API
- Entity Framework Core 8
- PostgreSQL
- MediatR (CQRS)
- FluentValidation
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- React Router DOM

### Infraestrutura
- Docker
- Docker Compose
- Nginx

## Arquitetura

O projeto segue os princípios de Clean Architecture e está organizado em camadas:

### Backend

```
backend/
├── src/
│   ├── ControleGastos.Api/          # Camada de apresentação (Controllers)
│   ├── ControleGastos.Application/  # Camada de aplicação (CQRS, Handlers, Validators)
│   ├── ControleGastos.Domain/       # Camada de domínio (Entidades, Interfaces)
│   └── ControleGastos.Infrastructure/ # Camada de infraestrutura (DbContext, Repositories)
```

### Frontend

```
frontend/
├── src/
│   ├── components/  # Componentes reutilizáveis
│   ├── pages/       # Páginas da aplicação
│   ├── services/    # Serviços de API
│   ├── types/       # Tipos TypeScript
│   └── styles/      # Estilos globais
```

## Funcionalidades

### Cadastro de Pessoas
- Criar nova pessoa (nome e idade)
- Editar pessoa existente
- Deletar pessoa (remove todas as transações associadas em cascata)
- Listar todas as pessoas

### Cadastro de Categorias
- Criar nova categoria com descrição e finalidade (Despesa, Receita ou Ambas)
- Listar todas as categorias

### Cadastro de Transações
- Criar nova transação vinculada a uma pessoa e categoria
- Validação: menores de 18 anos só podem ter despesas
- Validação: categoria deve ser compatível com o tipo de transação
- Listar todas as transações

### Relatórios
- Totais por pessoa: exibe receitas, despesas e saldo de cada pessoa
- Totais por categoria: exibe receitas, despesas e saldo de cada categoria
- Total geral: soma de todas as transações do sistema

## Padrões e Práticas Implementadas

### Backend
- CQRS (Command Query Responsibility Segregation)
- MediatR para mediação de comandos e queries
- FluentValidation para validação de entrada
- Repository Pattern
- Dependency Injection
- Object Calisthenics
- Encapsulamento de entidades
- Validações de regras de negócio no domínio

### Frontend
- Componentização
- Hooks do React (useState, useEffect)
- Tipagem forte com TypeScript
- Separação de responsabilidades
- Serviços centralizados para chamadas API

## Como Executar o Projeto

### Pré-requisitos
- Docker Desktop instalado
- Docker Compose instalado

### Executando com Docker Compose

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd controle-gastos-residenciais
```

2. Execute o Docker Compose:
```bash
docker-compose up --build
```

3. Aguarde a inicialização dos containers. O sistema estará disponível em:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Swagger: http://localhost:5000/swagger
   - PostgreSQL: localhost:5432

### Executando Localmente (Desenvolvimento)

#### Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Restaure as dependências:
```bash
dotnet restore
```

3. Configure a connection string no appsettings.json (se necessário):
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=controlegastos;Username=postgres;Password=postgres"
}
```

4. Execute as migrations:
```bash
cd src/ControleGastos.Api
dotnet ef database update
```

5. Execute a API:
```bash
dotnet run
```

A API estará disponível em: http://localhost:5000

#### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Estrutura do Banco de Dados

### Tabela Pessoas
- Id (UUID, PK)
- Nome (VARCHAR 200)
- Idade (INT)

### Tabela Categorias
- Id (UUID, PK)
- Descricao (VARCHAR 400)
- Finalidade (INT) - 1: Despesa, 2: Receita, 3: Ambas

### Tabela Transacoes
- Id (UUID, PK)
- Descricao (VARCHAR 400)
- Valor (DECIMAL 18,2)
- Tipo (INT) - 1: Despesa, 2: Receita
- CategoriaId (UUID, FK)
- PessoaId (UUID, FK)

## Endpoints da API

### Pessoas
- GET /api/pessoas - Lista todas as pessoas
- GET /api/pessoas/{id} - Obtém uma pessoa por ID
- POST /api/pessoas - Cria uma nova pessoa
- PUT /api/pessoas/{id} - Atualiza uma pessoa
- DELETE /api/pessoas/{id} - Deleta uma pessoa

### Categorias
- GET /api/categorias - Lista todas as categorias
- POST /api/categorias - Cria uma nova categoria

### Transações
- GET /api/transacoes - Lista todas as transações
- POST /api/transacoes - Cria uma nova transação

### Relatórios
- GET /api/relatorios/totais-por-pessoa - Obtém totais por pessoa
- GET /api/relatorios/totais-por-categoria - Obtém totais por categoria

## Validações Implementadas

### Pessoa
- Nome: obrigatório, máximo 200 caracteres
- Idade: obrigatória, maior que zero

### Categoria
- Descrição: obrigatória, máximo 400 caracteres
- Finalidade: obrigatória, valores válidos (1, 2 ou 3)

### Transação
- Descrição: obrigatória, máximo 400 caracteres
- Valor: obrigatório, maior que zero
- Tipo: obrigatório, valores válidos (1 ou 2)
- Categoria: obrigatória, deve existir no banco
- Pessoa: obrigatória, deve existir no banco
- Regra de negócio: menor de idade só pode ter despesas
- Regra de negócio: categoria deve aceitar o tipo de transação

## Tratamento de Erros

A API retorna códigos HTTP apropriados:
- 200: Sucesso
- 201: Criado com sucesso
- 204: Deletado com sucesso
- 400: Erro de validação ou regra de negócio
- 404: Recurso não encontrado
- 500: Erro interno do servidor

Todos os erros retornam um objeto JSON com a mensagem de erro:
```json
{
  "error": "Mensagem de erro"
}
```

## Migrations

Para criar uma nova migration:
```bash
cd backend/src/ControleGastos.Api
dotnet ef migrations add NomeDaMigration
```

Para aplicar migrations:
```bash
dotnet ef database update
```

## Licença

Este projeto está sob a licença MIT.

