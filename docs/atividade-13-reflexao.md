# Relatório de Reflexão Teórica: Integração de Banco de Dados com Prisma ORM no NestJS

## 1. Contextualização e Escolha de Domínio (VibeMatch)

Nesta atividade, realizamos a transição do armazenamento em memória para um banco de dados relacional persistente (**PostgreSQL** hospedado na plataforma serverless **Neon.tech**). Para manter a coerência com as atividades anteriores do **VibeMatch**, a modelagem foi desenhada de acordo com as especificações do Software Design Document (`docs/sdd.md`), estendendo o domínio com o CRUD completo do módulo de **Usuários** (`usuarios`).

A modelagem reflete as seguintes relações no banco:
- **`User` (Usuário)**: Possui relacionamento 1:N com as avaliações (`Review`), favoritos (`Favorite`) e listas (`List`).
- **`Content` (Conteúdo)**: Cadastro de filmes, séries e livros consumíveis.
- **`Review` (Avaliação)**: Tabela de junção enriquecida com a nota (`rating`) e comentário (`comment`).
- **`Favorite` (Favorito)** e **`List` (Lista)**: Tabelas com regras de deleção em cascata (`onDelete: Cascade`) para manter a integridade referencial quando um usuário é removido.

---

## 2. Reflexão Teórica: ORM vs. SQL Puro no NestJS

A escolha de utilizar o **Prisma ORM** em comparação à escrita de consultas SQL puras (ou query builders como Knex) traz trade-offs importantes na arquitetura:

### Vantagens do Prisma ORM:
1. **Segurança de Tipos Ponta a Ponta (Type Safety)**: O cliente gerado a partir do `schema.prisma` mapeia precisamente os tipos das tabelas no TypeScript. Se alteramos um campo do banco, o compilador imediatamente sinaliza erros nas queries, services e controllers do NestJS.
2. **Migrations Declarativas**: Em vez de escrever scripts DDL (`CREATE TABLE`, `ALTER TABLE`) imperativos manuais, declaramos o estado final do modelo no arquivo `.prisma` e o Migrate cuida de gerar o arquivo SQL correto incremental.
3. **Redução de Boilerplate**: Queries de relacionamento complexas (como carregar usuários com suas respectivas listas e favoritos) são feitas em poucas linhas usando `include` ou `select`, abstraindo os comandos de `JOIN`.

### Desvantagens e Riscos:
1. **Sobrecarga de Abstração (Performance)**: Consultas muito complexas ou de alta performance (como análises ou relatórios) podem gerar queries SQL subótimas sob o capô (problema do N+1).
2. **Curva de Aprendizado e Atualizações**: Mudanças bruscas de versão (como a transição do Prisma 5/6 para o Prisma 7) alteram o ecossistema e exigem configurações extras de drivers nativos.

---

## 3. Desafios de Integração com o Prisma 7

Um dos maiores aprendizados técnicos desta prática foi lidar com as **restrições arquiteturais do Prisma 7**:

1. **Remoção da URL no Schema**: No Prisma 7, a declaração direta de `url = env("DATABASE_URL")` dentro do bloco `datasource` no `schema.prisma` passou a ser inválida para operações de migrate em ambientes específicos, sendo exigido o uso do arquivo unificado de configuração `prisma.config.ts`.
2. **Uso de Driver Adapters**: Conexões TCP convencionais e ambientes serverless no Prisma 7 exigem explicitamente o uso de adaptadores de conexão (`driver adapters`). Tivemos que configurar o cliente importando `@prisma/adapter-pg` e utilizando um pool de conexões do pacote `pg` clássico dentro da inicialização do `PrismaService`:
   ```typescript
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const adapter = new PrismaPg(pool);
   super({ adapter });
   ```
   Essa abordagem garante segurança de conexão e previne vazamento de sockets ao liberar os recursos do pool no encerramento (`onModuleDestroy`) da aplicação NestJS.

---

## 4. O Papel do Assistente de IA no Desenvolvimento desta Atividade

A colaboração com ferramentas de IA agiu como um acelerador e orientador no desenvolvimento:

- **Configuração de Ambiente e Troubleshooting**: A detecção rápida do erro `P1012` (erro de schema do Prisma 7 relacionado à URL de banco) e a resolução configurando o driver adapter correto economizaram tempo significativo que seria gasto lendo documentações e fóruns.
- **Garantia de Padrões Arquiteturais**: A IA auxiliou a mapear as regras globais de validação já construídas (filtros de exceção globais e `ValidationPipe` do NestJS) e a integrá-las de forma que entradas inconsistentes nos endpoints fossem rejeitadas automaticamente em português.
- **Automação de Testes de Integração**: A rápida prototipação de comandos `curl` para testar os cenários de sucesso, de dados inválidos (400 Bad Request) e conflito de negócio (409 Conflict) agilizou a validação do ciclo de vida completo da requisição.
