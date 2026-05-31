# Relatório de Reflexão Teórica e Prática: Autenticação com JWT e Prisma no NestJS

## 1. Contextualização e Objetivos (Atividade 14)

Nesta atividade prática, implementamos uma **arquitetura de autenticação robusta usando JSON Web Tokens (JWT)** integrada ao **Prisma ORM** no backend do **VibeMatch**.
A segurança da API foi estruturada em três pilares fundamentais:
1. **Hash de senhas no registro e atualização** utilizando `bcrypt` com 10 rounds de salt.
2. **Autenticação via login**, validando as credenciais no banco de dados e emitindo um token JWT assinado digitalmente.
3. **Proteção de rotas utilizando Guards baseados em Passport**, garantindo que apenas portadores de tokens JWT válidos acessem rotas protegidas (como `/auth/perfil`).

---

## 2. Respostas às Perguntas Teóricas da Atividade

### ❓ Questão 1: Qual o papel do método `validate()` na classe `JwtStrategy` e o que acontece com o retorno desse método?

O método `validate(payload: any)` é um gancho (hook) chamado automaticamente pelo Passport após o token JWT da requisição ser extraído e verificado com sucesso contra a assinatura (a chave secreta `JWT_SECRET`).

*   **Papel do Método**: Sua função primária é receber o payload decodificado do JWT (que contém informações básicas como o ID do usuário no campo `sub` e o e-mail) e realizar validações adicionais de negócio. Em nossa implementação, ele faz uma consulta ao banco de dados via `PrismaService` para garantir que o usuário dono do token ainda existe na base de dados (`this.prisma.user.findUnique({ where: { id: userId } })`).
*   **Destino do Retorno**: O objeto de usuário retornado pelo método `validate()` (com o campo `password` removido via cast `(user as any).password` por motivos de segurança) é automaticamente anexado pelo Passport ao objeto de requisição do Express/NestJS, tornando-se disponível em `req.user` para qualquer rota ou controller protegido por aquele Guard.
*   **Tratamento de Exceções**: Se o usuário não for encontrado na base de dados, o método lança um `UnauthorizedException('Usuário não encontrado.')`, que resulta em uma resposta HTTP `401 Unauthorized` imediata para o cliente.

---

### ❓ Questão 2: Como o `JwtAuthGuard` protege as rotas e como ele se integra com o Passport e o ciclo de vida do NestJS?

O `JwtAuthGuard` estende o `AuthGuard('jwt')` fornecido pelo `@nestjs/passport`. Ele atua como um interceptador no ciclo de vida de requisição do NestJS, rodando antes de o fluxo alcançar o manipulador (handler) da rota.

1.  **Fase de Intercepção**: Quando uma requisição bate em uma rota anotada com `@UseGuards(JwtAuthGuard)`, o NestJS invoca o guard.
2.  **Integração com Passport**: O `JwtAuthGuard` ativa a estratégia registrada com o nome `'jwt'` (que é a nossa `JwtStrategy`).
3.  **Extração e Verificação**: A estratégia extrai o token do cabeçalho `Authorization` (no formato `Bearer <TOKEN>`), verifica a validade da assinatura e a expiração.
4.  **Execução do `validate()`**: Se o token for íntegro e dentro do prazo de validade, o Passport executa o método `validate()` que criamos na estratégia.
5.  **Injeção em `req.user`**: O valor retornado por `validate()` é injetado no objeto de request (`req.user`) e o guard retorna `true`, permitindo que o NestJS prossiga para a execução do método do controller.
6.  **Bloqueio de Acesso**: Se o token for inválido, expirado, ausente ou se a validação lançar um erro, o guard retorna `false` ou lança um erro HTTP 401, interrompendo a requisição imediatamente sem tocar no controller.

---

### ❓ Questão 3: O que faz o método `AuthService.login()` e qual a importância de assinar o payload e definir um tempo de expiração (`expiresIn`)?

O método `login(loginDto: LoginDto)` é o ponto final do fluxo de autenticação de credenciais diretas (e-mail/senha).

*   **Responsabilidade do Método**: Ele valida se o usuário com o e-mail fornecido existe na base de dados. Caso exista, compara o hash da senha fornecida com o hash armazenado no banco usando `bcrypt.compare()`. Se as credenciais forem válidas, ele assina um payload contendo informações não sensíveis do usuário (como `sub` e `email`) usando o `JwtService.sign()`, devolvendo ao cliente um objeto contendo o token JWT (`{ access_token: string }`).
*   **Importância de Assinar o Payload**: A assinatura digital do token (utilizando o algoritmo HMAC SHA-256 e a chave secreta `JWT_SECRET`) garante a integridade dos dados trafegados. Como a chave secreta é mantida exclusivamente no servidor, qualquer alteração maliciosa no payload por parte do cliente ou de interceptadores invalida a assinatura, permitindo que a API recuse o token de forma segura.
*   **Importância do Tempo de Expiração (`expiresIn`)**: Definir um tempo de expiração limitado (como `1h` em nossa implementação) é uma prática essencial de segurança. Caso um token JWT seja interceptado ou roubado por agentes maliciosos, a janela de oportunidade para o atacante utilizá-lo é drasticamente reduzida. Após expirar, o token torna-se inutilizável, exigindo um novo login ou uso de refresh tokens.

---

## 3. Evidências de Testes da API (Execução do Script)

Criamos e executamos um script de automação (`test_auth.sh`) para validar todas as rotas e regras de negócios descritas na atividade. Abaixo estão os logs exatos capturados das requisições reais:

### 3.1. Teste de Acesso Sem Token (GET `/auth/perfil`)
Tenta acessar a rota protegida sem enviar o token. Resposta esperada: **401 Unauthorized**.

```http
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 43
Date: Sun, 31 May 2026 23:36:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Unauthorized","statusCode":401}
```

### 3.2. Registro de Novo Usuário (POST `/auth/register`)
Envia dados de cadastro e garante que a senha é devidamente ocultada da resposta. Resposta esperada: **201 Created**.

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 161
Date: Sun, 31 May 2026 23:36:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"ca08dd5e-a2f0-448b-8270-30a824ec6875","name":"User Test Auth","email":"testuser_1780270592@example.com","age":null,"createdAt":"2026-05-31T23:36:34.423Z"}
```

### 3.3. Login com Dados Corretos (POST `/auth/login`)
Valida as credenciais recém-criadas e emite o token assinado. Resposta esperada: **200 OK** com o token.

```json
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTA4ZGQ1ZS1hMmYwLTQ0OGItODI3MC0zMGE4MjRlYzY4NzUiLCJlbWFpbCI6InRlc3R1c2VyXzE3ODAyNzA1OTJAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODAyNzA1OTQsImV4cCI6MTc4MDI3NDE5NH0.OnL3TUlM0QC-QlTyxTuSzleMWn8H3269Bi6exfk3mTM"}
```

### 3.4. Acesso com Token Correto (GET `/auth/perfil`)
Envia o token obtido no passo anterior via cabeçalho `Authorization: Bearer <TOKEN>`. Resposta esperada: **200 OK** com os dados sanitizados do usuário.

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 216
Date: Sun, 31 May 2026 23:36:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Você acessou uma rota protegida!","user":{"id":"ca08dd5e-a2f0-448b-8270-30a824ec6875","name":"User Test Auth","email":"testuser_1780270592@example.com","age":null,"createdAt":"2026-05-31T23:36:34.423Z"}}
```

### 3.5. Login com Senha Incorreta (POST `/auth/login`)
Garante que tentativas de autenticação com dados inválidos sejam bloqueadas. Resposta esperada: **401 Unauthorized** com mensagem tratada.

```http
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 77
Date: Sun, 31 May 2026 23:36:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Credenciais inválidas.","error":"Unauthorized","statusCode":401}
```

---

## 4. O Papel do Assistente de IA no Desenvolvimento

A utilização da inteligência artificial no desenvolvimento da Atividade 14 funcionou como um copiloto técnico de alto nível, com especial destaque para:

1.  **Garantia de Tipagem e Solução de Erros do Compilador**: Durante a compilação em watch mode, o compilador do TypeScript disparou erros (`TS2790`) sinalizando que a operação `delete` em propriedades de um objeto tipado e obrigatório (no caso, a propriedade `password` gerada pelo Prisma Client para o modelo `User`) seria inválida. A IA auxiliou na imediata refatoração aplicando casts explícitos de tipagem `delete (user as any).password`, restabelecendo a compilação instantaneamente sem a necessidade de reescrever as tipagens globais auto-geradas do Prisma.
2.  **Validação dos Padrões do Framework**: A IA garantiu a perfeita integração do fluxo do Passport-JWT com as regras de validação por DTOs (`LoginDto` usando `class-validator`) e com a sanitização correta do objeto de retorno (impedindo o vazamento de hashes de senhas em todo o fluxo da aplicação).
3.  **Desenvolvimento Ágil de Scripts de Teste**: A criação do script de testes automatizado em Bash com geração dinâmica de e-mails via timestamp (`testuser_$(date +%s)@example.com`) e extração do JWT com expressões regulares permitiu testar repetidas vezes e isolar o ambiente sem dependência de ferramentas visuais externas.
