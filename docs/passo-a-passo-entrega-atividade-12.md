# Guia Prático de Testes e Validação - Atividade 12

Este documento contém o passo a passo para testar, validar e documentar a entrega da **Atividade 12** do VibeMatch.

---

## 🚀 Como Executar o Servidor da API
No diretório raiz do projeto `vibe-match`, execute o seguinte comando no terminal:
```bash
npm run dev:api
```
Certifique-se de que o console exiba a mensagem:
`[NestApplication] Nest application successfully started`

---

## 🔍 Comandos de Validação e Snapshots de Resposta

### 1. Testar Exceção Nativa 404 (Usuário Não Encontrado)
Simula a busca por um usuário inexistente na plataforma VibeMatch.
```bash
curl -i http://localhost:3000/favoritos/usuario/99
```
**Resposta HTTP Obtida (404 Not Found):**
```json
{
  "message": "Usuário com ID '99' não foi localizado em nossa base do VibeMatch.",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 2. Testar Exceção Nativa 401 (Acesso Não Autorizado)
Simula a tentativa de acesso à área administrativa de favoritos sem token.
```bash
curl -i http://localhost:3000/favoritos/admin
```
**Resposta HTTP Obtida (401 Unauthorized):**
```json
{
  "message": "Acesso negado: Você não possui privilégios de Administrador para gerenciar os favoritos globais.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 3. Testar Exceção de Domínio 422 (Limite de Favoritos Excedido)
Adicionar 5 favoritos no plano Gratuito (violando a regra de negócio que permite no máximo 3).
```bash
curl -i http://localhost:3000/favoritos/adicionar/5
```
**Resposta HTTP Obtida (422 Unprocessable Entity):**
```json
{
  "erro": "Regra de Negócio Violada",
  "mensagem": "Operação negada: Seu limite de 3 favoritos no plano Gratuito foi excedido (tentativa de configurar 5 favoritos).",
  "sugestaoAutomatica": "Que tal assinar o VibeMatch Premium por apenas R$ 9,90/mês para ter favoritos ilimitados e sem anúncios?",
  "data": "2026-05-18T02:32:45.653Z"
}
```

**Log Gerado no Console do Servidor (WARN):**
```text
[Nest] 18183  - 05/17/2026, 11:32:45 PM    WARN [OfertaPremiumFilter] [GET] /favoritos/adicionar/5 - Alerta de Negócio: Limite de favoritos violado. Retornando proposta de Upgrade Premium.
```

---

### 4. Testar Caminho Feliz (Dentro do Limite)
Adicionar 2 favoritos (operação permitida pela regra de negócio).
```bash
curl -i http://localhost:3000/favoritos/adicionar/2
```
**Resposta HTTP Obtida (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Vibes favoritadas com sucesso! Você adicionou 2 itens na sua lista.",
  "limiteRestante": 1
}
```

---

## 📝 Resumo do Trabalho Realizado
1. **Padrão GitFlow:** Checkout e ramificação da branch `feature/atividade-12-excecoes` a partir de `develop`.
2. **Criação de Exceção de Domínio:** `LimiteFavoritosExcedidoException` gerada sob HttpStatus `422`.
3. **Filtro Específico:** `OfertaPremiumFilter` capturando cirurgicamente violações de favoritos, inserindo log `warn` no console e formatando o retorno comercial.
4. **End-to-End validado:** Todas as rotas respondendo perfeitamente via cURL.
