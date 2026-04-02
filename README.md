# ProjectHub

Frontend em Next.js para um sistema de gerenciamento de projetos consumindo uma API Spring Boot real.

## Configuracao

1. Crie um arquivo `.env.local` com:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. Inicie a API Spring Boot.
3. Rode o frontend:

```bash
npm install
npm run dev
```

4. Abra `http://localhost:3000/dashboard`.

## Rotas principais

- `/dashboard`
- `/projetos`
- `/projetos/[id]`
- `/participantes`
- `/atividades`
- `/recursos`
- `/custos`
- `/riscos`

## Observacoes tecnicas

- As consultas usam `fetch` nativo com `cache: "no-store"` para refletir mudancas da API ao recarregar.
- Os endpoints tentam caminhos comuns como `/projetos` e `/api/projetos`.
- As respostas sao normalizadas para acomodar variacoes comuns de DTOs entre camelCase, snake_case e objetos aninhados.
