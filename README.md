# 🏦 Banco Digital API

## Descrição do Projeto
API de um sistema bancário digital que permite operações financeiras seguras com controle de concorrência. Desenvolvida em Node.js com TypeScript, oferece:

- Criação de usuários com CPF
- Operações de depósito e saque
- Consulta de extrato
- Proteção contra race conditions
- Validação de dados robusta

**Tecnologias**: Node.js, Express, TypeScript, Zod, async-mutex, Jest

## Estrutura do Repositório
```
.
├── src/                          # Diretório de código fonte
│   ├── config/                   # Arquivos de configuração e setup de ambiente
│   ├── controllers/              # Manipuladores de requisições e controladores de lógica de negócio
│   ├── interfaces/              # Interfaces TypeScript e definições de tipos
│   ├── middlewares/             # Middleware Express incluindo tratamento de erros
│   ├── models/                  # Modelos de dados e schemas de banco de dados
│   ├── routes/                  # Definições de rotas da API
│   ├── services/                # Lógica de negócio principal e manipulação de transações
│   ├── tests/                   # Suites de teste para serviços e componentes
│   ├── utils/                   # Funções utilitárias e operações de banco de dados
├── data.json                    # Armazenamento baseado em arquivo para dados de usuários e transações
├── eslint.config.mjs           # Configuração ESLint para estilo de código
├── jest.config.js              # Configuração do framework de testes Jest
├── package.json                # Dependências e scripts do projeto
└── tsconfig.json              # Configuração do compilador TypeScript
```

## Instruções de Uso

### Pré-requisitos
- Node.js
- npm package manager
- TypeScript

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ricardo-rals/4pay-nodejs-transaction-test.git
cd 4pay-nodejs-transaction-test

# Instale as dependências
npm install

# Crie o arquivo de ambiente
cp .env.example .env

# Compile o projeto
npm run build
```

### Início Rápido

1. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

2. Para produção:
```bash
npm run build
npm start
```

### Testes

Execute os testes usando os seguintes comandos:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm test -- --coverage
```

### Usando o Insomnia

Para testar a API, você pode usar o Insomnia. Aqui estão os principais endpoints:

1. **Criar Usuário**
   - Método: POST
   - URL: `http://localhost:3000/api/v1/users`
   - Body (JSON):
   ```json
   {
     "name": "Ricardo Augusto",
     "cpf": "123.456.789-00",
     "initialBalance": 1000
   }
   ```

2. **Realizar Depósito**
   - Método: POST
   - URL: `http://localhost:3000/api/v1/users/{userId}/deposit`
   - Body (JSON):
   ```json
   {
     "amount": 500
   }
   ```

3. **Realizar Saque**
   - Método: POST
   - URL: `http://localhost:3000/api/v1/users/{userId}/withdraw`
   - Body (JSON):
   ```json
   {
     "amount": 200
   }
   ```

4. **Consultar Extrato**
   - Método: GET
   - URL: `http://localhost:3000/api/v1/users/{userId}/statement`
