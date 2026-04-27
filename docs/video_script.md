# 🎬 Roteiro de Apresentação - VibeMatch (Atividade 1)

Este roteiro guiará sua apresentação de vídeo para a 1ª Avaliação. Siga a ordem dos tópicos para garantir que todos os IDs (1 a 4) sejam comprovados.

---

## 1. Introdução (30s)
- **O que falar:** "Olá, meu nome é Milena Hamerski e vou apresentar a fundação do projeto VibeMatch para a disciplina de Tópicos Especiais. O VibeMatch é um recomendador de mídia baseado no humor do usuário, conectando emoções a conteúdos como filmes, livros e séries."

---

## 2. Vitrine e Gestão (ID3) (1m)
- **O que mostrar:** O arquivo `README.md` no VS Code ou no GitHub.
- **O que falar:** "Aqui temos o README do projeto com a visão geral, autores e a stack tecnológica que utilizaremos: NestJS no backend com Prisma ORM e Vue.js no frontend."
- **O que mostrar:** O quadro de Issues no GitHub.
- **O que falar:** "Para a gestão ágil, mapeamos o PRD em 9 Histórias de Usuário (User Stories) como Issues no GitHub. Cada issue já possui seus critérios de aceitação definidos para guiar o desenvolvimento."

---

## 3. Regras e Modelagem (ID1) (1m 30s)
- **O que mostrar:** O arquivo `docs/prd.md`.
- **O que falar:** "No PRD, definimos o escopo do MVP. A regra central é a recomendação contextualizada: o usuário seleciona um 'vibe' ou humor e o sistema filtra os conteúdos ideais."
- **O que mostrar:** O arquivo `docs/sdd.md` (especificamente o diagrama Mermaid).
- **O que falar:** "No SDD, temos o Diagrama Entidade-Relacionamento. Destaco os relacionamentos 1:N essenciais: um Usuário pode ter múltiplas Avaliações e Favoritos, e um Conteúdo pode pertencer a várias Listas através da tabela associativa List_Item. Essa estrutura garante a integridade dos dados no Prisma."

---

## 4. Prova de Setup e GitFlow (ID2 e ID4) (1m)
- **O que mostrar:** A estrutura de pastas no VS Code (`apps/api`, `apps/web`, `docs`).
- **O que falar:** "O projeto foi estruturado como um Monorepo, separando claramente as responsabilidades de API e Web. Isso facilita a gestão de pacotes e o deploy unificado."
- **O que mostrar:** O terminal ou a aba de controle de versão (Git).
- **O que falar:** "Estamos utilizando o GitFlow. Demonstro aqui a existência das branches `main` e `develop`, além da branch de feature `feature/setup-domain-modules` onde finalizamos este planejamento inicial."

---

## 5. Encerramento (15s)
- **O que falar:** "Com essa base sólida de documentação e arquitetura, o VibeMatch está pronto para as próximas fases de implementação. Obrigado."
