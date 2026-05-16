# Ordering

Projeto desenvolvido no contexto do Trabalho Prático da disciplina **Verificação, Validação e Teste de Software** (IFSP Câmpus São Carlos – Prof. Dr. Lucas Oliveira).

## Regras de negócio (alto nível)
- Criar pedido
- Alterar pedido (SKUs/itens, quantidades, etc.)
- Atualizar status (mover para o próximo status válido)
- Calcular valores totais (bruto e líquido)
- Consultar descontos elegíveis dado o estado/valor do pedido
- Aplicar desconto(s) e finalizar/cancelar pedido

## Execução Local com Docker

A aplicação pode ser executada localmente de duas formas:

1. **Ambiente de produção local**
2. **Ambiente de desenvolvimento local**

---

### Variáveis de ambiente

Antes de executar o projeto, crie um arquivo chamado `.env` na raiz do projeto.

Você pode usar o arquivo `.env.example` como base:

```bash
cp .env.example .env
```

Exemplo de `.env`:

```env
AUTH_SECRET=change-me-with-a-secure-random-string
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

#### `AUTH_SECRET`

Chave usada pela camada de autenticação da aplicação.

Ela é obrigatória para o build e para a execução da aplicação em produção local.

Exemplo:

```env
AUTH_SECRET=uma-chave-secreta-com-mais-de-32-caracteres
```

Para gerar uma chave segura, você pode usar:

```bash
npx auth secret
```

#### `NEXT_PUBLIC_API_BASE_URL`

URL base da API usada pelo frontend.

Para execução apenas do frontend, sem backend real disponível, você pode manter:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Caso o backend esteja rodando em outra porta ou endereço, altere o valor conforme necessário.

Exemplo:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.exemplo.com
```

---

### Ambiente de produção local

O ambiente de produção local simula a forma como a aplicação seria executada após o build.

Nesse modo:

- O Next.js executa o build da aplicação;
- A aplicação é iniciada em modo production;
- Não há hot reload;
- É o modo mais indicado para apresentação, entrega e validação final.

#### Como executar

Na raiz do projeto, rode:

```bash
docker compose up --build
```

Depois acesse:

```txt
http://localhost:3000
```

#### Como parar

```bash
docker compose down
```

---

### Ambiente de desenvolvimento local

O ambiente de desenvolvimento local é usado durante a implementação da aplicação.

Nesse modo:

- O Next.js roda com `npm run dev`;
- O código local é montado dentro do container;
- Alterações no código refletem automaticamente na aplicação;
- É indicado para desenvolvimento diário.

#### Como executar

Na raiz do projeto, rode:

```bash
docker compose -f docker-compose.dev.yaml up --build
```

Depois acesse:

```txt
http://localhost:3000
```

#### Como parar

```bash
docker compose -f docker-compose.dev.yaml down
```

---

### 5. Diferença entre produção local e desenvolvimento local

| Característica | Produção local | Desenvolvimento local |
|---|---|---|
| Arquivo Compose | `docker-compose.yaml` | `docker-compose.dev.yaml` |
| Dockerfile | `Dockerfile` | `Dockerfile.dev` |
| Comando principal | `npm run build` + `node server.js` | `npm run dev` |
| Hot reload | Não | Sim |
| Performance | Mais próxima de produção | Mais focada em desenvolvimento |
| Uso recomendado | Entrega e apresentação | Desenvolvimento diário |
| Precisa rebuildar após mudanças? | Sim | Normalmente não |
