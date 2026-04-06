# 📄 Product Requirements Document (PRD) - VibeMatch

Projeto: VibeMatch (Mood-Based Media Recommender)
Versão: 1.0.0 (MVP)
Status: 🟢 Definido

## 🎯 Visão do Produto

Com a grande quantidade de filmes, séries e livros disponíveis atualmente, usuários frequentemente enfrentam dificuldade em escolher conteúdos que combinem com seu estado emocional no momento.

O VibeMatch resolve esse problema ao recomendar conteúdos personalizados com base no humor do usuário, permitindo uma experiência mais intuitiva e contextualizada.

O objetivo do sistema é conectar emoções a conteúdos, permitindo que usuários descubram rapidamente algo relevante para assistir ou ler, além de registrar suas interações (avaliações, favoritos e listas).

## 📖 2. Glossário Ubíquo

Humor (Mood): Estado emocional selecionado pelo usuário (ex: feliz, triste, relaxado).
Conteúdo (Content): Item disponível no sistema (filme, série ou livro).
Recomendação: Lista de conteúdos sugeridos com base no humor.
Avaliação (Review): Nota e/ou comentário feito pelo usuário sobre um conteúdo.
Favorito: Conteúdo marcado como preferido pelo usuário.
Lista: Coleção personalizada de conteúdos criada pelo usuário.

---

## 👤 3. Atores e Permissões

Usuário Visitante:

- Visualiza conteúdos (limitado)
- Não pode interagir

Usuário Autenticado:

- Seleciona humor
- Recebe recomendações
- Avalia conteúdos
- Cria listas e favoritos

Administrador:

- Gerencia conteúdos (CRUD)
- Modera dados do sistema

---

## 📝 4. Escopo Funcional, Histórias de Usuário e Critérios de Aceitação (MoSCoW)

🔴 US01 - Autenticação de Usuário (Must Have)

Ator: Usuário
História: Como usuário, quero me cadastrar e fazer login para acessar funcionalidades personalizadas.

✅ Critérios de Aceitação:

- O sistema deve permitir cadastro com e-mail e senha.
- O sistema deve validar credenciais no login.
- O sistema deve manter sessão autenticada.
- Usuários não autenticados não podem acessar funcionalidades restritas.

🔴 US02 - Seleção de Humor (Must Have)

Ator: Usuário
História: Como usuário, quero selecionar meu humor atual para receber recomendações.

✅ Critérios de Aceitação:

- O sistema deve apresentar opções de humor (feliz, triste, etc.).
- O usuário deve selecionar apenas um humor por vez.
- O humor selecionado deve ser enviado ao backend.
- O sistema deve permitir alteração do humor a qualquer momento.

🔴 US03 - Recomendação de Conteúdos (Must Have)

Ator: Usuário
História: Como usuário, quero receber recomendações com base no meu humor.

✅ Critérios de Aceitação:

- O sistema deve retornar uma lista de conteúdos.
- Cada conteúdo deve conter título, tipo e gênero.
- As recomendações devem variar conforme o humor selecionado.
- O sistema deve garantir resposta rápida (< 2 segundos).

🔴 US04 - Avaliação de Conteúdos (Must Have)

Ator: Usuário
História: Como usuário, quero avaliar conteúdos para registrar minha opinião.

✅ Critérios de Aceitação:

- O usuário pode atribuir nota de 1 a 5.
- O usuário pode adicionar comentário opcional.
- O sistema deve impedir avaliações duplicadas para o mesmo conteúdo.
- A avaliação deve ser associada ao usuário.

🔴 US05 - Favoritar Conteúdos (Must Have)

Ator: Usuário
História: Como usuário, quero favoritar conteúdos para acessá-los facilmente depois.

✅ Critérios de Aceitação:

- O usuário pode marcar e desmarcar favoritos.
- O sistema deve armazenar favoritos por usuário.
- O usuário deve visualizar sua lista de favoritos.

🔴 US06 - Criação de Listas (Must Have)

Ator: Usuário
História: Como usuário, quero criar listas personalizadas de conteúdos.

✅ Critérios de Aceitação:

- O usuário pode criar múltiplas listas.
- O usuário pode adicionar/remover conteúdos.
- Cada lista pertence a um único usuário.

🟡 US07 - Histórico de Interações (Should Have)

Ator: Usuário
História: Como usuário, quero visualizar meu histórico para acompanhar minhas atividades.

✅ Critérios de Aceitação:

- O sistema deve registrar avaliações e favoritos.
- O usuário deve visualizar histórico ordenado por data.

🟡 US08 - Filtro e Busca (Should Have)

Ator: Usuário
História: Como usuário, quero buscar conteúdos para encontrar rapidamente o que desejo.

✅ Critérios de Aceitação:

- O sistema deve permitir busca por título.
- Deve permitir filtro por tipo (filme, série, livro).

🔵 US09 - Recomendação Baseada em Avaliações (Could Have)

Ator: Sistema
História: Como sistema, quero sugerir conteúdos com base nas avaliações do usuário.

✅ Critérios de Aceitação:

- O sistema deve considerar histórico de avaliações.
- Deve sugerir conteúdos similares.

---

## 🛡️ 5. Regras de Negócio (Constraints)

RN01 (Autenticação): Apenas usuários autenticados podem interagir com o sistema.

RN02 (Avaliação Única): Um usuário só pode avaliar um conteúdo uma única vez.

RN03 (Isolamento de Dados): Usuários só podem acessar seus próprios dados.

RN04 (Consistência de Recomendação): Recomendações devem sempre considerar o humor selecionado.

---

## 6. Fora de Escopo (Non-goals)

- Sistema de streaming de conteúdo (assistir filmes dentro da plataforma)
- Integração com redes sociais
- Aplicativos mobile nativos
- Algoritmos avançados de IA (apenas lógica simples no MVP)

---

## 7. Requisitos Não Funcionais (Qualidade)

Desempenho:

- Recomendações devem ser retornadas em até 2 segundos.

Escalabilidade:

- Sistema deve suportar múltiplos usuários simultâneos.

Segurança:

- Senhas devem ser armazenadas de forma criptografada.

Usabilidade:

- Interface deve ser responsiva e intuitiva.
