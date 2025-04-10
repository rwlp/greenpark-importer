# Projeto Teste Técnico Green Access

## Summary

- [Detalhes da Sprint (Baseado no framework Scrum)](#detalhes-da-sprint)

## Detalhes da Sprint

Baseamos nosso planejamento no framework Scrum.

### Sprint Goal

Em acordo com a demanda do [cliente](https://jumbled-smoke-7ef.notion.site/Desafio-T-cnico-Backend-NodeJS-fd6b6af685a5460794ffd45622f27dad), temos 4 objetivos principais:

- Criar um banco de dados com duas tabelas: `boletos` e `lotes`.
- Criar um endpoint que sincronize dados enviados via arquivos com o banco de dados.
- Criar um endpoint que receba arquivos PDF (boletos) e salve localmente em formato específico.
- Criar um endpoint que retorne todos os boletos no sistema, bem como versões em PDF de relatorio.

### Definição de Pronto

- Ter documentação clara de como rodar o projeto localmente após a instalação de todas as dependências.
- O projeto deve rodar sem problemas os três endpoints solicitados na demanda do cliente e especificados no Sprint Goal.

### Sprint Backlog

O Sprint Backlog deve ser atualizado a cada commit, bem como a cada alteracao na produção deverá se adicionar as seguintes tags:

- ![badge-green](https://img.shields.io/badge/Status--green): Para itens que foram concluídos com sucesso e foram entregues
- ![badge-yellow](https://img.shields.io/badge/Status--yellow): Para itens que estão em progresso

#### Tarefas

- Criar repositório e configurações iniciais:
  - Criar repositório no GitHub ![badge-green](https://img.shields.io/badge/Status--green)
  - Configurar a estrutura de código da aplicação backend 
  - Configurar ambiente Docker
  - Configurar ambiente de testes para framework TDD
  - Configurar ambiente para banco de dados
  - Configurar TypeScript e processos de build
- Criar tabelas e migrações para o banco de dados
- Criar dados fake (PDFs, CSVs, bem como inserir dados iniciais no banco de dados se for preciso)
- Definir requisições HTTP usando Postman
- Escrever código dos endpoints no backend
- Fazer testes de integração(opcional)
