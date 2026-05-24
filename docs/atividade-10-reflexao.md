# Atividade 10 | Reflexão e Testes da Validação

## 1. O Papel do `ParseIntPipe`, `@Type`, `@Transform` e DTOs

O uso de `ParseIntPipe` foi fundamental para garantir que IDs passados pelas rotas (ex: `/conteudos/1`) fossem convertidos de `string` para `number` na camada de controle, antes mesmo de atingir a lógica de negócios. Os DTOs serviram como contratos estritos do formato dos dados esperados.
Através do `@Type` dentro dos DTOs complexos e com objetos aninhados, garantimos que a classe da instância (`DetailsDto`, por exemplo) ou a representação correta dos dados fosse respeitada e convertida (`rating` foi convertido de string para Number, caso viesse como form-data, por exemplo).
Já o `@Transform` foi essencial para aplicar regras automáticas antes da validação da regra, como remover espaços inúteis (`trim()`) no filtro de busca, deixando a experiência da API mais resiliente a erros simples do cliente.

---

## 2. Ferramentas de IA de Código: APIs Customizadas vs Comerciais

Configurar meu próprio agente usando provedores de API como OpenRouter/Groq integrado ao Antigravity traz uma vantagem fundamental: **A liberdade arquitetural e econômica**. 
Enquanto ferramentas comerciais (Cursor, Windsurf) oferecem excelentes integrações prontas limitadas pelos planos *Free Tiers*, um ambiente agnóstico configurado via API me permite alternar modelos de IA com base na demanda. Por exemplo, usar Llama 3 via Groq para tarefas de linting incrivelmente velozes ou Claude 3.5 Sonnet no OpenRouter para arquiteturas complexas. O preço pago sob demanda (apenas pelo uso) é frequentemente menor, com menor risco de bloqueios.

---

## 3. Delegação de Validações e o Aprendizado

Delegar tarefas como escrita de validações, `Regex` complexas ou configurações repetitivas de _decorators_ para a IA é altamente positivo e **facilita o aprendizado**. Em vez de focar na memorização mecânica de atributos do `class-validator` ou da sintaxe das regex, o foco passa a ser **entender as regras de negócio e a estrutura do dado**. A dependência só ocorre se o dev deixa de ler os contratos gerados. Desde que haja revisão para garantir que as condições estipuladas reflitam os requisitos reais (como idade mínima ou padrões de string), a IA age como um assistente de produtividade, permitindo pensar na arquitetura de forma mais elevada.
