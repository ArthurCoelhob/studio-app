# Frontend - Studio App

Frontend do sistema de agendamento desenvolvido com Vue.js 2 + TypeScript + Vuetify.

## Instalação

```bash
npm install
```

## Execução

```bash
# Desenvolvimento
npm run serve

# Build para produção
npm run build
```

## Usuários de Teste

- **Admin**: CPF `12345678901`
- **Cliente**: CPF `98765432100`
- Qualquer senha funciona

## Estrutura

```
src/
├── components/          # Componentes reutilizáveis
├── views/              # Páginas da aplicação
├── router/             # Configuração de rotas
├── store/              # Estado global (Vuex)
├── services/           # Serviços e mocks
├── types/              # Tipos TypeScript
└── plugins/            # Configuração do Vuetify
```