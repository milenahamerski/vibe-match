# Relatório de Reflexão Teórica: Arquitetura de Exceções e Regras de Negócio no NestJS

## 1. Escolha de Domínio: Limitação de Favoritos no VibeMatch
Para fugir de exemplos genéricos, aplicamos os conceitos de arquitetura de exceções diretamente ao domínio do **VibeMatch** (plataforma de match de vibrações, mídias e conteúdos). 

Definimos uma restrição clara de plano comercial (Gratuito): **o limite de 3 favoritos cadastrados**.
Quando o usuário tenta adicionar mídias favoritas além do limite, o sistema aciona nossa exceção de domínio **`LimiteFavoritosExcedidoException`**.

---

## 2. Por que Usar HTTP 422 (Unprocessable Entity) em Vez de 400 ou 500?

### ❌ `500 Internal Server Error` (Erro do Sistema)
O status 500 deve ser reservado unicamente para erros catastróficos não previstos (falhas de conexão com banco de dados, ponteiros nulos ou erros de sintaxe). Tratar uma violação de regra de negócio (como estourar o limite de favoritos) como 500 é péssima prática:
- Assusta o usuário final com telas de erro genéricas ("Erro Interno").
- Dispara alertas falsos nos sistemas de monitoramento de infraestrutura (como Sentry ou Datadog), gerando ruído para a equipe de DevOps.

### ❌ `400 Bad Request` (Erro de Sintaxe/Formato)
O status 400 indica que a requisição está malformada. Por exemplo, passar uma string no lugar de um número, omitir um campo obrigatório no DTO ou enviar um JSON inválido. O servidor nem sequer consegue prosseguir para aplicar as regras de negócio porque a entrada de dados está sintaticamente incorreta.

### ✅ `422 Unprocessable Entity` (Erro de Semântica/Negócio)
O status 422 é ideal para violação de regras de negócio em arquiteturas modernas:
- O servidor compreende perfeitamente o formato da requisição (a sintaxe está correta, os campos estão preenchidos e válidos).
- No entanto, a instrução não pode ser processada devido a restrições lógicas do domínio (por exemplo: saldo insuficiente, vaga esgotada ou, no nosso caso, **limite de favoritos excedido**).
- Facilita a comunicação com o Frontend, que pode exibir um alerta visual interativo oferecendo o upgrade de plano de forma contextualizada.

---

## 3. Diagrama de Sequência do Ciclo de Exceções

O diagrama a seguir descreve o fluxo detalhado de como a requisição HTTP é processada, interceptada e convertida em uma resposta amigável de negócio no NestJS:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Frontend / Cliente cURL
    participant C as FavoritosController
    participant Ex as LimiteFavoritosExcedidoException
    participant F as OfertaPremiumFilter (Filtro Local)
    participant L as Logger (Console do Servidor)

    Cliente->>C: GET /favoritos/adicionar/5
    Note over C: Verifica se total (5) > Limite (3)
    C->>Ex: Instancia e Lança exceção de domínio
    deactivate C
    activate Ex
    Ex-->>C: Lançamento do erro HTTP 422
    deactivate Ex
    
    Note over F: Intercepta apenas LimiteFavoritosExcedidoException
    C->>F: Captura a Exceção
    activate F
    
    F->>L: logger.warn("Aviso de Negócio: Limite Violado...")
    Note over L: Console exibe mensagem amarela do aviso
    
    F-->>Cliente: JSON com status 422 + sugestaoAutomatica ("Upgrade Premium")
    deactivate F
```

---

## 4. Diferença entre Filtros Globais e Locais
No VibeMatch:
1. **Filtro Global (`HttpExceptionFilter`):** Registrado no `main.ts`. Ele é a nossa "Enfermaria Central" de infraestrutura, garantindo que qualquer exceção de sistema ou nativa (`NotFoundException`, `UnauthorizedException`) que escape sem tratamento seja padronizada no formato padrão `{ success: false, statusCode, ... }`.
2. **Filtro Específico Local (`OfertaPremiumFilter`):** Aplicado localmente em `@UseFilters` no `FavoritosController`. Ele é cirúrgico: captura **apenas** a nossa exceção de negócio `LimiteFavoritosExcedidoException` para realizar enriquecimento comercial (injetando a chave `sugestaoAutomatica`). Erros comuns de sistema continuam passando para o filtro global, mantendo a responsabilidade de cada camada limpa e bem definida.
