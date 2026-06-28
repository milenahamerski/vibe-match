# 🚀 Guia de Deploy - VibeMatch

Este guia orienta o deploy em produção do Frontend (na **Vercel**) e do Backend (no **Render**), conectados ao banco de dados relacional **Neon.tech**.

---

## 📦 Passo 0: Subir alterações para o GitHub
Antes de iniciar os deploys, garanta que seu repositório Git local está sincronizado com o GitHub:
```bash
git add .
git commit -m "feat: frontend and backend integration ready for production"
git push origin main
```
Isso também disparará a esteira de CI/CD do GitHub Actions automaticamente.

---

## 🛠️ Passo 1: Deploy do Backend (Render)
Como já temos o arquivo `render.yaml` configurado na raiz do projeto, utilizaremos o recurso de **Blueprints** do Render para automatizar tudo.

1. Acesse o [Render.com](https://render.com/) e faça login (recomenda-se entrar com sua conta do GitHub).
2. No painel principal, clique em **New** (canto superior direito) e selecione **Blueprint**.
3. Conecte o repositório do seu projeto do GitHub.
4. O Render lerá o arquivo `render.yaml` e preencherá as configurações do serviço `vibe-match-api`.
5. Na tela de configuração, ele solicitará o preenchimento das seguintes **variáveis de ambiente**:
   - `DATABASE_URL`: Cole a string de conexão do seu banco de dados **Neon.tech** (aquela presente no seu `.env` local).
   - `JWT_SECRET`: Insira uma chave secreta e longa de sua escolha para criptografia dos tokens JWT.
6. Clique em **Apply** / **Deploy**.
7. O Render começará a compilar e iniciar a API. Uma vez concluído, salve a URL gerada para a API (ex: `https://vibe-match-api.onrender.com`).

---

## ⚡ Passo 2: Deploy do Frontend (Vercel)
A Vercel hospedará o frontend construído em React + Vite. Siga estes passos para configurar o monorepo corretamente:

1. Acesse o [Vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
2. Clique em **Add New** -> **Project**.
3. Selecione o repositório do seu projeto.
4. Na tela de configurações do projeto (**Configure Project**), faça os seguintes ajustes cruciais:
   - **Framework Preset:** Selecione `Vite`.
   - **Root Directory:** Clique em *Edit* e selecione a pasta **`apps/web`** (isso informa à Vercel que o frontend está dentro dessa subpasta do monorepo).
   - **Build and Output Settings:** Deixe os valores padrões (Build command: `npm run build`, Output directory: `dist`).
   - **Environment Variables:** Adicione a seguinte variável:
     - **Key:** `VITE_API_URL`
     - **Value:** A URL do seu backend no Render (ex: `https://vibe-match-api.onrender.com`) — *Atenção: Não coloque barra `/` no final da URL*.
5. Clique em **Deploy**.
6. A Vercel instalará as dependências da pasta do frontend, compilará o bundle de produção e disponibilizará o link público do seu site!
