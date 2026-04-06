# 📖 Checklist de Avaliação | ID & RA

> **Projeto:** VibeMatch (Mood-Based Media Recommender)  
> **Disciplina:** Tópicos Especiais em Programação

---

## 🎯 RA1 - Arquitetura, Engenharia de Requisitos com IA e Gestão Ágil

- [ ] **ID1:** Estruturou o **PRD** e o **SDD** (Diagrama Mermaid) de forma clara, utilizando IA para modelar o sistema de recomendação baseado em humor.
- [ ] **ID2:** A aplicação foi estruturada em formato de **Monorepo** (Frontend + Backend) no GitHub.
- [ ] **ID3:** Mapeou o PRD em **Histórias de Usuário** no GitHub Projects, criando backlog com funcionalidades como recomendação, avaliação e favoritos.
- [ ] **ID4:** Demonstrou domínio do **GitFlow**, utilizando branches (`feature/*`, `develop`, `main`) e Pull Requests.

---

## ⚙️ RA2 - Desenvolvimento Backend Assistido por IA

- [ ] **ID5:** O backend em NestJS mantém **separação de camadas** (Controllers, Services, Modules).
- [ ] **ID6:** Implementou **DTOs e ValidationPipes** para validação de dados (ex: avaliação, criação de listas).
- [ ] **ID7:** Desenvolveu operações **CRUD relacionais** com Prisma ORM (users, contents, reviews, lists).
- [ ] **ID8:** Implementou **autenticação JWT** para controle de acesso aos dados do usuário.
- [ ] **ID9:** Padronizou respostas com **Interceptors** e tratamento global de erros com **Exception Filters**.

---

## 🧪 RA3 - Qualidade de Software e TDD Guiado por IA

- [ ] **ID10:** Utilizou IA para gerar **testes automatizados (Jest)** baseados nas histórias de usuário (ex: avaliar conteúdo, favoritar, recomendar).
- [ ] **ID11:** Os testes cobrem cenários de sucesso e erro (ex: avaliação duplicada, acesso sem login).

---

## 🎨 RA4 - Prototipagem e Integração Frontend

- [ ] **ID12:** A API está documentada com **Swagger (OpenAPI)**.
- [ ] **ID13:** Desenvolveu interfaces visuais (Vue) representando o fluxo de seleção de humor e recomendações.
- [ ] **ID14:** O frontend consome a API NestJS utilizando **tokens JWT**, garantindo autenticação e integração correta.

---

## 🚀 RA5 - Pipeline CI/CD e Implantação Contínua

- [ ] **ID15:** Variáveis sensíveis (ex: DATABASE_URL, JWT_SECRET) são protegidas via **ConfigModule**.
- [ ] **ID16:** Configurou pipeline de **CI com GitHub Actions** para rodar testes e validações.
- [ ] **ID17:** Realizou **deploy da aplicação** com backend e banco relacional em produção.

---

## 🟣 Extra (Opcional - Diferencial)

- [ ] **ID18:** Implementou lógica de recomendação baseada em humor + histórico do usuário.
- [ ] **ID19:** Integração com API externa (filmes, séries ou livros).
- [ ] **ID20:** Implementou ranking de conteúdos (ex: mais bem avaliados).
