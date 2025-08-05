# Food Mao API 🍔

API RESTful para sistema de gestão de pedidos de comida, desenvolvida com NestJS e arquitetura hexagonal (Clean Architecture).

> **Projeto desenvolvido para a Fase 01 do Tech Challenge em Software Architecture da FIAP**

## 👥 Equipe de Desenvolvimento

- **[Aldair Azevedo](https://github.com/AldairAzevedo)** - RM361097
- **[Andre Costa](https://github.com/andreneox)** - RM361095  
- **[Anthony Freitas](https://github.com/Anthony07M)** - RM361093

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Entidades e Relacionamentos](#entidades-e-relacionamentos)
- [Fluxo de Dados](#fluxo-de-dados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando a API](#executando-a-api)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)

## 🎯 Sobre o Projeto

O **Food Mao API** é um sistema backend robusto para gerenciamento de restaurantes e pedidos, oferecendo funcionalidades completas para:

- 👥 Gestão de clientes
- 📝 Criação e gerenciamento de pedidos
- 🏷️ Categorização de produtos
- 🍕 Catálogo de produtos
- 📦 Controle de itens de pedido

## 🚀 Tecnologias Utilizadas

### Core Framework
- **[NestJS](https://nestjs.com/)** `^11.0.1` - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** `^5.7.3` - Superset tipado do JavaScript
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript

### Banco de Dados
- **[Prisma ORM](https://www.prisma.io/)** `^6.7.0` - ORM moderno para TypeScript
- **[@prisma/client](https://www.prisma.io/client)** `^6.7.0` - Cliente do Prisma

### Validação e Transformação
- **[class-validator](https://github.com/typestack/class-validator)** `^0.14.2` - Validação baseada em decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** `^0.5.1` - Transformação de objetos

### Documentação
- **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)** `^11.2.0` - Documentação automática da API

### Segurança
- **[Helmet](https://helmetjs.github.io/)** `^8.1.0` - Middleware de segurança HTTP

### Utilitários
- **[UUID](https://github.com/uuidjs/uuid)** `^11.1.0` - Geração de identificadores únicos
- **[Loadash](https://lodash.com/)** `^1.0.0` - Biblioteca de utilitários JavaScript
- **[RxJS](https://rxjs.dev/)** `^7.8.1` - Programação reativa

### Ferramentas de Desenvolvimento
- **[Jest](https://jestjs.io/)** `^29.7.0` - Framework de testes
- **[ESLint](https://eslint.org/)** `^9.18.0` - Linter para JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** `^3.4.2` - Formatador de código
- **[SWC](https://swc.rs/)** `^1.10.7` - Compilador rápido para TypeScript

### DevOps
- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers

## 🏗️ Arquitetura

Este projeto segue os princípios da **Arquitetura Hexagonal (Clean Architecture)**, organizando o código em camadas bem definidas para garantir baixo acoplamento e alta coesão.

### Princípios da Arquitetura Limpa em Ação

Para reforçar a separação de responsabilidades, o fluxo de criação de dados segue um padrão rigoroso:

1.  **Entidade de Domínio (Guardiã das Regras de Negócio):**
    *   Toda a lógica de validação e as regras de negócio essenciais residem dentro da própria entidade de domínio (ex: `Client`, `Product`).
    *   A entidade possui um método estático `create()` que garante que nenhum objeto pode ser instanciado em um estado inválido. Se uma regra for violada (ex: um preço de produto negativo), a entidade lança um erro.

2.  **Controller (Orquestrador da Camada de Adaptação):**
    *   Recebe os DTOs (Data Transfer Objects) da requisição HTTP.
    *   Busca as entidades relacionadas necessárias (ex: busca a `Category` ao criar um `Product`).
    *   Chama o método `create()` da entidade para criar uma instância de domínio válida, passando os dados recebidos.
    *   Captura erros de validação lançados pela entidade e os converte em respostas HTTP apropriadas (ex: `400 Bad Request`).
    *   Se a criação da entidade for bem-sucedida, ele passa o objeto de domínio para o Caso de Uso.

3.  **Caso de Uso (Executor da Lógica de Aplicação):**
    *   Recebe a entidade de domínio já criada e validada.
    *   **Não conhece DTOs** ou detalhes do protocolo HTTP.
    *   Sua única responsabilidade é executar a lógica de aplicação, como orquestrar a persistência dos dados chamando o repositório.

Este fluxo garante que o núcleo da aplicação (`domain` e `application`) permaneça puro e independente de detalhes de infraestrutura, como a API web.

### Estrutura de Diretórios

```
📁 src/
├── 📁 adapters/           # Camada de Adaptadores
│   ├── 📁 inbound/
│   │   └── 📁 http/       # Controladores HTTP
│   ├── 📁 outbound/       # Adaptadores de Saída
│   │   ├── 📁 database/
│   │   └── 📁 payment/
│   └── 📁 shared/         # Componentes Compartilhados dos Adaptadores
├── 📁 application/        # Camada de Aplicação
│   ├── 📁 ports/          # Portas de Entrada e Saída
│   │   ├── 📁 in/
│   │   └── 📁 out/
│   └── 📁 use-cases/      # Casos de Uso
├── 📁 domain/             # Camada de Domínio
│   ├── 📁 entities/       # Entidades de Negócio
│   ├── 📁 repositories/   # Interfaces dos Repositórios
│   └── 📁 value-objects/  # Objetos de Valor
├── 📁 infrastructure/     # Camada de Infraestrutura
│   ├── 📁 config/         # Configurações
│   ├── 📁 logger/         # Sistema de Logs
│   └── 📁 persistence/    # Implementações dos Repositórios
└── 📁 modules/            # Módulos NestJS
```

### Benefícios da Arquitetura Adotada:
- ✅ **Separação de Responsabilidades**
- ✅ **Facilidade de Testes**
- ✅ **Baixo Acoplamento**
- ✅ **Alta Coesão**
- ✅ **Manutenibilidade**

## 📊 Entidades e Relacionamentos

### Modelo de Dados

![Diagrama ER](./docs/images/er-diagram.png)

*Modelo Entidade-Relacionamento mostrando as relações entre Client, Category, Product, Order e OrderItem*

### Descrição das Entidades

#### 👤 **Client (Cliente)**
- Representa os clientes do sistema
- Contém informações básicas como nome, email e telefone
- Um cliente pode ter múltiplos pedidos

#### 🏷️ **Category (Categoria)**
- Organiza os produtos em categorias
- Facilita a navegação e busca de produtos
- Uma categoria pode ter múltiplos produtos

#### 🍕 **Product (Produto)**
- Representa os itens do cardápio
- Possui nome, descrição, preço e categoria
- Pode estar presente em múltiplos itens de pedido

#### 📝 **Order (Pedido)**
- Representa um pedido feito por um cliente
- Possui status, valor total e data de criação
- Contém múltiplos itens de pedido

#### 📦 **OrderItem (Item do Pedido)**
- Representa cada produto dentro de um pedido
- Contém quantidade, preço unitário e preço total
- Liga pedidos aos produtos específicos

## 🔄 Fluxo de Dados

### Fluxo Principal de Criação de Pedido

```mermaid
sequenceDiagram
    participant C as Cliente
    participant API as API Gateway
    participant UC as Use Case
    participant R as Repository
    participant DB as Database

    C->>+API: POST /orders
    API->>+UC: CreateOrderUseCase
    UC->>+R: OrderRepository
    R->>+DB: Save Order
    DB-->>-R: Order Created
    R-->>-UC: Order Entity
    UC-->>-API: Order Response
    API-->>-C: 201 Created
```

### Fluxo de Consulta de Produtos

![Fluxo de Arquitetura](./docs/images/architecture-flow.png)

*Fluxo de dados seguindo a Arquitetura Hexagonal - da requisição HTTP até a resposta final*

## 📁 Estrutura do Projeto

```
FOOD-MAO-API/
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 nest-cli.json
├── 📄 tsconfig.json
├── 📄 tsconfig.build.json
├── 📄 docker-compose.yml
├── 📄 eslint.config.mjs
├── 📄 README.md
├── 📁 docs/
│   └── 📁 images/
│       ├── 📄 architecture-flow.png
│       └── 📄 create-order-flow.png
│       └── 📄 er-diagram.png
├── 📁 prisma/
│   ├── 📁 migrations/
│   │   ├── 📁 20250523012449_client/
│   │   ├── 📁 20250523012522_category/
│   │   ├── 📁 20250523012612_product/
│   │   ├── 📁 20250523012809_order/
│   │   ├── 📁 20250523012918_order_item/
│   │   └── 📄 migration_lock.toml
│   ├── 📄 schema.prisma
│   └── 📄 seed.ts
├── 📁 test/
│   ├── 📄 app.e2e-spec.ts
│   └── 📄 jest-e2e.json
└── 📁 src/
    ├── 📄 main.ts
    ├── 📄 app.module.ts
    ├── 📁 adapters/
    │   ├── 📁 inbound/
    │   │   └── 📁 http/
    │   │       ├── 📁 category/
    │   │       │   ├── 📁 dtos/
    │   │       │   │   ├── 📄 create-category.dto.ts
    │   │       │   │   └── 📄 update-category.dto.ts
    │   │       │   ├── 📄 category.controller.spec.ts
    │   │       │   └── 📄 category.controller.ts
    │   │       ├── 📁 client/
    │   │       │   ├── 📁 dto/
    │   │       │   │   ├── 📄 create-client.dto.ts
    │   │       │   │   └── 📄 update-client.dto.ts
    │   │       │   ├── 📄 client.controller.spec.ts
    │   │       │   └── 📄 client.controller.ts
    │   │       ├── 📁 order/
    │   │       │   ├── 📁 dto/
    │   │       │   │   ├── 📄 create-order.dto.ts
    │   │       │   │   └── 📄 update-order.dto.ts
    │   │       │   ├── 📄 order.controller.spec.ts
    │   │       │   └── 📄 order.controller.ts
    │   │       ├── 📁 order_item/
    │   │       │   ├── 📁 dto/
    │   │       │   │   ├── 📄 create-order-item.dto.ts
    │   │       │   │   └── 📄 update-order-item.dto.ts
    │   │       │   ├── 📄 order-item.controller.spec.ts
    │   │       │   └── 📄 order-item.controller.ts
    │   │       └── 📁 product/
    │   │           ├── 📁 dto/
    │   │           │   ├── 📄 create-product.dto.ts
    │   │           │   └── 📄 update-product.dto.ts
    │   │           ├── 📄 product.controller.spec.ts
    │   │           └── 📄 product.controller.ts
    │   ├── 📁 outbound/
    │   │   ├── 📁 database/
    │   │   │   └── 📁 repositories/
    │   │   └── 📁 payment/
    │   └── 📁 shared/
    │       ├── 📁 repositories/
    │       │   └── 📄 repository.interface.ts
    │       └── 📁 value-objects/
    │           ├── 📄 uui.vo.ts
    │           └── 📄 value.object.ts
    ├── 📁 application/
    │   ├── 📁 ports/
    │   │   ├── 📁 in/
    │   │   └── 📁 out/
    │   └── 📁 use-cases/
    │       ├── 📁 category/
    │       │   ├── 📄 create-category.usecase.ts
    │       │   ├── 📄 find-all-categories.usecase.ts
    │       │   ├── 📄 findById.usecase.ts
    │       │   └── 📄 update-category.usecase.ts
    │       ├── 📁 client/
    │       │   ├── 📄 create-client.usecase.ts
    │       │   ├── 📄 delete-client.usecase.ts
    │       │   ├── 📄 get-all-clients.usecase.ts
    │       │   ├── 📄 get-client-by-id.usecase.ts
    │       │   └── 📄 update-client.usecase.ts
    │       ├── 📁 order/
    │       │   ├── 📄 create-order.usecase.ts
    │       │   ├── 📄 delete-order.usecase.ts
    │       │   ├── 📄 findById-order.usecase.ts
    │       │   ├── 📄 get-all-orders.usecase.ts
    │       │   └── 📄 update-order.usecase.ts
    │       ├── 📁 order_item/
    │       │   ├── 📄 create-order-item.usecase.ts
    │       │   ├── 📄 delete-order-item.usecase.ts
    │       │   ├── 📄 get-all-order-items.usecase.ts
    │       │   ├── 📄 get-order-item-by-id.usecase.ts
    │       │   ├── 📄 get-order-items-by-order.usecase.ts
    │       │   └── 📄 update-order-item.usecase.ts
    │       └── 📁 product/
    │           ├── 📄 create-product.usecase.ts
    │           ├── 📄 find-all-products.usecase.ts
    │           ├── 📄 findById.usecase.ts
    │           ├── 📄 remove-product.usecase.ts
    │           └── 📄 update-product.usecase.ts
    ├── 📁 domain/
    │   ├── 📁 entities/
    │   │   ├── 📁 client/
    │   │   │   └── 📄 client.entity.ts
    │   │   ├── 📁 order/
    │   │   │   └── 📄 order.entity.ts
    │   │   ├── 📁 order_item/
    │   │   │   └── 📄 order-item.entity.ts
    │   │   ├── 📁 __tests__/
    │   │   │   ├── 📄 category.entity.spec.ts
    │   │   │   ├── 📄 client.entity.spec.ts
    │   │   │   ├── 📄 order.entity.spec.ts
    │   │   │   ├── 📄 order-item.entity.spec.ts
    │   │   │   └── 📄 product.entity.spec.ts
    │   │   ├── 📄 category.entity.ts
    │   │   └── 📄 product.entity.ts
    │   ├── 📁 repositories/
    │   │   ├── 📁 client/
    │   │   │   └── 📄 client.repository.interface.ts
    │   │   ├── 📁 order/
    │   │   │   └── 📄 order.repository.interface.ts
    │   │   ├── 📁 order_item/
    │   │   │   └── 📄 order-item.repository.interface.ts
    │   │   ├── 📄 category.repository.interface.ts
    │   │   └── 📄 product.repository.interface.ts
    │   └── 📁 value-objects/
    ├── 📁 infrastructure/
    │   ├── 📁 config/
    │   │   ├── 📁 prisma/
    │   │   │   ├── 📄 prisma-extensions.ts
    │   │   │   ├── 📄 prisma.service.spec.ts
    │   │   │   └── 📄 prisma.service.ts
    │   │   └── 📁 swagger/
    │   │       └── 📄 setup.ts
    │   ├── 📁 logger/
    │   └── 📁 persistence/
    │       └── 📁 prisma/
    │           ├── 📁 client/
    │           │   └── 📄 client.repository.persistence.ts
    │           ├── 📁 order/
    │           │   └── 📄 order.repository.persistence.ts
    │           ├── 📁 order_item/
    │           │   └── 📄 order-item.repository.persistence.ts
    │           ├── 📁 __tests__/
    │           │   ├── 📄 client.repository.persistence.spec.ts
    │           │   ├── 📄 order-item.repository.persistence.spec.ts
    │           │   └── 📄 order.repository.persistence.spec.ts
    │           ├── 📄 category.repository.persistence.ts
    │           └── 📄 product.repository.persistence.ts
    └── 📁 modules/
        ├── 📄 client.module.ts
        └── 📄 order-item.module.ts
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js >= 18.x
- npm ou yarn
- Docker e Docker Compose
- Banco de dados (PostgreSQL, MySQL, etc.) - ou use o Docker Compose

### 1. Clone o repositório
```bash
git clone https://github.com/Anthony07M/food-mao-api.git
cd food-mao-api
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/food_mao_db"
PORT=3000
```

### 4. Execute com Docker Compose (Recomendado)
O projeto inclui um `docker-compose.yml` que configura automaticamente o banco de dados e a aplicação:

```bash
# Inicia todos os serviços (banco de dados + aplicação)
docker-compose up -d

# Para ver os logs
docker-compose logs -f

# Para parar os serviços
docker-compose down
```

### 5. Ou configure manualmente o banco

#### 5.1. Execute as migrações do banco
```bash
npx prisma migrate dev
# ou
yarn prisma migrate dev
```

#### 5.2. Gere o cliente Prisma
```bash
npx prisma generate
# ou
yarn prisma generate
```

#### 5.3. (Opcional) Execute o seed do banco
```bash
npx prisma db seed
# ou
yarn prisma db seed
```

## 🏃‍♂️ Executando a API

### Com Docker Compose (Recomendado)
```bash
# Inicia todos os serviços em background
docker-compose up -d

# Inicia e acompanha os logs
docker-compose up

# Para apenas a aplicação (assumindo que o banco já está rodando)
docker-compose up app
```

### Desenvolvimento (Local)
```bash
npm run start:dev
# ou
yarn start:dev
```

### Produção
```bash
npm run build
npm run start:prod
# ou
yarn build
yarn start:prod
```

### Debug
```bash
npm run start:debug
# ou
yarn start:debug
```

A API estará disponível em: `http://localhost:3000`

### Comandos Docker Compose úteis
```bash
# Ver status dos containers
docker-compose ps

# Ver logs da aplicação
docker-compose logs app

# Ver logs do banco de dados
docker-compose logs db

# Reiniciar apenas a aplicação
docker-compose restart app

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpa dados do banco)
docker-compose down -v
```

## 📡 Endpoints

### 👤 Clientes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/clients` | Lista todos os clientes |
| `GET` | `/clients/:id` | Busca cliente por ID |
| `POST` | `/clients` | Cria novo cliente |
| `PUT` | `/clients/:id` | Atualiza cliente |
| `DELETE` | `/clients/:id` | Remove cliente |

### 🏷️ Categorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/categories` | Lista todas as categorias |
| `GET` | `/categories/:id` | Busca categoria por ID |
| `POST` | `/categories` | Cria nova categoria |
| `PUT` | `/categories/:id` | Atualiza categoria |
| `DELETE` | `/categories/:id` | Remove categoria |

### 🍕 Produtos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/products` | Lista todos os produtos |
| `GET` | `/products/:id` | Busca produto por ID |
| `POST` | `/products` | Cria novo produto |
| `PUT` | `/products/:id` | Atualiza produto |
| `DELETE` | `/products/:id` | Remove produto |

### 📝 Pedidos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/orders` | Lista todos os pedidos |
| `GET` | `/orders/:id` | Busca pedido por ID |
| `POST` | `/orders` | Cria novo pedido |
| `PUT` | `/orders/:id` | Atualiza pedido |
| `DELETE` | `/orders/:id` | Remove pedido |

### 📦 Itens de Pedido
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/order-items` | Lista todos os itens |
| `GET` | `/order-items/:id` | Busca item por ID |
| `POST` | `/order-items` | Cria novo item |
| `PUT` | `/order-items/:id` | Atualiza item |
| `DELETE` | `/order-items/:id` | Remove item |

## 🧪 Testes

### Executar todos os testes
```bash
npm run test
# ou
yarn test
```

### Testes em modo watch
```bash
npm run test:watch
# ou
yarn test:watch
```

### Testes com coverage
```bash
npm run test:cov
# ou
yarn test:cov
```

### Testes E2E
```bash
npm run test:e2e
# ou
yarn test:e2e
```

### Configuração de Testes
O projeto utiliza Jest com as seguintes configurações:
- Cobertura de código excludindo: `entities`, `dto`, `main.ts`, `prisma`, `*.providers.ts`
- Suporte a TypeScript
- Mapeamento de módulos para facilitar imports

### Estrutura de Testes
```
📁 Testes organizados por camada:
├── 📁 domain/entities/__tests__/     # Testes das entidades
├── 📁 infrastructure/persistence/__tests__/  # Testes dos repositórios
├── 📁 adapters/inbound/http/         # Testes dos controladores
└── 📁 test/                          # Testes E2E
```

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI:

**URL:** `http://localhost:3000/docs`

### Recursos da Documentação:
- 📖 Especificação completa de todos os endpoints
- 🧪 Interface para testar APIs diretamente
- 📋 Modelos de dados (DTOs)
- ✅ Códigos de resposta HTTP
- 🔍 Exemplos de requisições e respostas

### Configuração do Swagger
O Swagger está configurado em `src/infrastructure/config/swagger/setup.ts` com:
- Informações do projeto
- Esquemas de autenticação
- Tags organizadas por módulo
- Exemplos de uso

## 🔧 Scripts Disponíveis

```json
{
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

## 🗄️ Banco de Dados

### Migrações
O projeto utiliza Prisma para gerenciamento do banco de dados:

```bash
# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Resetar banco de dados (desenvolvimento)
npx prisma migrate reset

# Ver status das migrações
npx prisma migrate status
```

### Schema
O schema do banco está definido em `prisma/schema.prisma` e inclui:
- Configuração do provider (PostgreSQL/MySQL)
- Definição das tabelas e relacionamentos
- Configuração do Prisma Client

### Seed
Execute o seed para popular o banco com dados iniciais:
```bash
npx prisma db seed
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript
- Siga as configurações do ESLint e Prettier
- Escreva testes para novas funcionalidades
- Documente APIs usando decorators do Swagger
- Siga os princípios da Clean Architecture

### Estrutura de Commits
```
type: description
feat: add JWT authentication
fix: resolve calculation bug
docs: update installation guide
test: add unit tests for user service
```

## 📝 Licença

Este projeto está sob a licença UNLICENSED.

## 👨‍💻 Equipe

**Projeto desenvolvido para a Fase 01 do Tech Challenge em Software Architecture da FIAP**

- **[Aldair Azevedo](https://github.com/AldairAzevedo)** - RM361097
- **[Andre Costa](https://github.com/andreneox)** - RM361095  
- **[Anthony Freitas](https://github.com/Anthony07M)** - RM361093

---

# Food Mao API 🍔 (Fase 2)

API RESTful para sistema de gestão de pedidos de comida, desenvolvida com NestJS, Clean Architecture e implantada em um ambiente Kubernetes escalável.

> [cite_start]**Projeto desenvolvido para a Fase 02 do Tech Challenge em Software Architecture da FIAP** 

## 👥 Equipe de Desenvolvimento

- **[Aldair Azevedo](https://github.com/AldairAzevedo)** - RM361097
- **[Andre Costa](https://github.com/andreneox)** - RM361095  
- **[Anthony Freitas](https://github.com/Anthony07M)** - RM361093

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Entregáveis da Fase 2](#-entregáveis-da-fase-2)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura de Software](#️-arquitetura-de-software)
- [Arquitetura de Infraestrutura (Kubernetes)](#-arquitetura-de-infraestrutura-kubernetes)
- [Desenho da Arquitetura](#-desenho-da-arquitetura)
- [Guia de Execução](#-guia-de-execução)
- [Endpoints da API](#-endpoints-da-api)
- [Testes](#-testes)
- [Documentação da API (Swagger & Postman)](#-documentação-da-api-swagger--postman)
- [Vídeo de Demonstração](#-vídeo-de-demonstração)

## 🎯 Sobre o Projeto

[cite_start]O **Food Mao API** é um sistema de autoatendimento para uma lanchonete, projetado para otimizar o fluxo de pedidos, desde a seleção dos produtos pelo cliente até a preparação na cozinha e a entrega final[cite: 19]. [cite_start]A Fase 2 do projeto focou em evoluir a aplicação para uma arquitetura de microsserviços robusta, escalável e segura, pronta para um ambiente de produção na nuvem[cite: 48, 63].

## 🏆 Entregáveis da Fase 2

[cite_start]Este projeto atende a todos os requisitos da Fase 2 do Tech Challenge[cite: 47]:

- [cite_start]✅ **APIs Refatoradas:** Código atualizado seguindo os padrões de Clean Code e Clean Architecture, com endpoints para checkout, consulta de status de pagamento, webhook do Mercado Pago e listagem de pedidos priorizada[cite: 48, 49, 50, 51, 52, 53].
- [cite_start]✅ **Arquitetura em Kubernetes:** Infraestrutura como código utilizando manifestos YAML para garantir escalabilidade, segurança e boas práticas[cite: 63, 66].
- [cite_start]✅ **Escalabilidade com HPA:** Implementação do Horizontal Pod Autoscaler para escalar a aplicação horizontalmente conforme a demanda[cite: 65].
- [cite_start]✅ **Segurança:** Uso de `Secrets` para dados sensíveis e `ConfigMaps` para configurações, evitando exposição de informações críticas[cite: 67].
- [cite_start]✅ **Boas Práticas:** Utilização de `Deployments` para gerenciar os Pods e `Services` para expor a aplicação de forma estável[cite: 68].
- [cite_start]✅ **Documentação Completa:** Este README contém o desenho da arquitetura, guia de execução, e links para a collection da API e vídeo de demonstração[cite: 69].

## 🚀 Tecnologias Utilizadas

### Core Framework
- **[NestJS](https://nestjs.com/)**, **[TypeScript](https://www.typescriptlang.org/)**, **[Node.js](https://nodejs.org/)**

### Banco de Dados
- **[Prisma ORM](https://www.prisma.io/)**, **[PostgreSQL](https://www.postgresql.org/)**

### DevOps & Cloud
- **[Docker](https://www.docker.com/)**: Containerização da aplicação.
- [cite_start]**[Kubernetes (K8s)](https://kubernetes.io/)**: Orquestração de contêineres para automação, escalabilidade e resiliência[cite: 63].
- **[kubectl](https://kubernetes.io/docs/reference/kubectl/)**: Ferramenta de linha de comando para interagir com o cluster K8s.

[cite_start]*(O ambiente pode ser executado em qualquer provedor de nuvem como EKS (Amazon), GKE (Google), AKS (Azure) ou localmente com Minikube/Kind [cite: 73, 74])*

## 🏗️ Arquitetura de Software

[cite_start]O projeto segue os princípios da **Arquitetura Hexagonal (Clean Architecture)**, organizando o código em camadas bem definidas (`domain`, `application`, `adapters`, `infrastructure`) para garantir baixo acoplamento, alta coesão e testabilidade[cite: 48].

*(A explicação detalhada da arquitetura de software, entidades e fluxos de dados permanece a mesma da Fase 1 e pode ser mantida aqui).*

## ☁️ Arquitetura de Infraestrutura (Kubernetes)

[cite_start]Para a Fase 2, a aplicação foi conteinerizada e orquestrada com Kubernetes para criar um ambiente de produção resiliente e escalável[cite: 63]. Os seguintes componentes foram criados:

- **`Service` (`service.yml`):** Atua como o ponto de entrada de rede para a nossa aplicação. [cite_start]Ele é do tipo `LoadBalancer`, o que significa que o provedor de nuvem irá provisionar um balanceador de carga externo para expor a API à internet de forma estável, distribuindo o tráfego entre os Pods disponíveis[cite: 68].

- **`Deployment` (`deployment.yml`):** É o cérebro que gerencia os Pods da nossa aplicação. [cite_start]Ele garante que o número desejado de réplicas esteja sempre em execução[cite: 68]. Além disso, ele gerencia as atualizações de imagem sem tempo de inatividade (rolling updates).
    - **Init Container:** Um contêiner de inicialização (`prisma-migration`) é usado para executar as migrações do banco de dados (`npx prisma migrate deploy`) antes que o contêiner principal da aplicação inicie. Isso garante que a aplicação sempre se conecte a um banco de dados com o schema correto.

- **`HPA (HorizontalPodAutoscaler)` (`hpa.yml`):** Este é o componente chave para a escalabilidade. [cite_start]Ele monitora o uso de CPU dos Pods[cite: 65]. Se a média de utilização ultrapassar 80%, o HPA automaticamente aumenta o número de réplicas (até um máximo de 5). [cite_start]Quando a demanda diminui, ele reduz o número de réplicas (para um mínimo de 2), otimizando custos e garantindo performance durante picos de acesso[cite: 81].

- **`Secret` (`secret.yml`):** Utilizado para armazenar e injetar dados sensíveis, como a `DATABASE_URL` e o `MERCADO_PAGO_ACCESS_TOKEN`. [cite_start]Os dados são armazenados no cluster em formato Base64 e montados nos Pods como variáveis de ambiente, evitando que segredos fiquem expostos no código-fonte ou nos manifestos[cite: 67].

- [cite_start]**`ConfigMap` (`configmap.yml`):** Usado para desacoplar as configurações do ambiente da imagem do contêiner[cite: 67]. No nosso caso, ele define a variável `NODE_ENV` como `production`, permitindo que a mesma imagem Docker seja usada em diferentes ambientes (desenvolvimento, produção) apenas alterando o ConfigMap.

## 🗺️ Desenho da Arquitetura (HPA)

[cite_start]O diagrama abaixo ilustra a interação entre todos os componentes da infraestrutura, o fluxo de requisições e como o HPA atua para garantir a escalabilidade da aplicação, conforme solicitado nos requisitos[cite: 70, 81].

![Arquitetura Kubernetes hpa](./docs/images/hpa.png)

## 🚀 Guia de Execução

Existem duas formas de executar o projeto: localmente com Docker Compose (ideal para desenvolvimento) e em um cluster Kubernetes (ambiente de produção).

### 1. Execução Local (Desenvolvimento)

*(Mantenha a seção de "Instalação e Configuração" e "Executando a API" do seu README original aqui, pois ela é perfeita para o ambiente de desenvolvimento).*

### 2. Execução em Ambiente Kubernetes

[cite_start]Este guia assume que você já tem `kubectl` instalado e configurado para acessar seu cluster (Minikube, EKS, GKE, AKS, etc.)[cite: 73, 74].

#### Pré-requisito: Codificar os Segredos

Os valores no arquivo `secret.yml` precisam ser codificados em **Base64**. Você pode usar os seguintes comandos:

```bash
# Para a URL do banco de dados
echo -n 'SUA_DATABASE_URL' | base64

# Para o token do Mercado Pago
echo -n 'SEU_MERCADO_PAGO_ACCESS_TOKEN' | base64