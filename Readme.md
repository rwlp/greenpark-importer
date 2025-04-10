# Projeto Teste Técnico Green Access

## Summary

- [Detalhes da Sprint (Baseado no framework Scrum)](#detalhes-da-sprint)
- [Como tratamos Injecao de Dependencias](#TypeInject)

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
  - Configurar a estrutura de código da aplicação backend ![badge-green](https://img.shields.io/badge/Status--green)
  - Configurar ambiente Docker
  - Configurar ambiente de testes para framework TDD
  - Configurar ambiente para banco de dados
  - Configurar TypeScript e processos de build ![badge-green](https://img.shields.io/badge/Status--green)
- Criar tabelas e migrações para o banco de dados
- Criar dados fake (PDFs, CSVs, bem como inserir dados iniciais no banco de dados se for preciso)
- Definir requisições HTTP usando Postman
- Escrever código dos endpoints no backend
- Fazer testes de integração(opcional)


## Estrutura de Pastas
```
src/
├── config/                  # Configurações globais de frameworks e libs utilizadas no app
│   ├── typeInject           # Configuração e container para injeção de dependência
│   │   ├── bin              # Scripts para geração de arquivos
│   │   ├── generatedFiles   # Contém todos os arquivos gerados automaticamente
│   │   ├── types            # Tipos utilizados pelo container
│   │   └── decorators.ts    # Decorators @Provide e @Inject
│   ├── prisma               # Arquivos de configuração do framework Prisma para ORM
│   │   ├── schema.prisma    # Schema do Prisma para banco de dados SQL
│   │   ├── .env             # Usado apenas para desenvolvimento local
│   │   └── generatedFiles/  # Arquivos gerados pelo Prisma, considerados sempre locais
│   └── serverConfigs        # Configurações do servidor (utilizamos o framework ExpressJS)
│       ├── configs.ts       # Configurações globais do ExpressJS
│       └── router.ts        # Configurações globais relacionadas às rotas dos endpoints
│
├── lib/                         # Utilizamos design orientado a objetos; cada pasta representa um design pattern ou recurso
│   ├── dataAccessObjects/       # DAOs (Data Access Objects), responsáveis pela abstração da comunicação com o banco de dados
│   ├── middlewares/             # Todos os códigos relacionados a middlewares usados no app
│   ├── repositories/            # Repositórios, padrão Repository para acesso a dados específicos
│   ├── services/                # Camada de lógica de negócio
│   ├── controller/              # Camada que lida com requisições e respostas do servidor
│   └── interfaces/              # Interfaces e classes abstratas
│
├── utils/                       # Funções utilitárias
│   ├── dateUtils.ts
│   └── stringUtils.ts
│
├── types/                       # Tipos globais
│   ├── express.d.ts
│   └── user.d.ts
│
└── ...
```

## TypeInject

Automação transparente para injeção de dependência em TypeScript.  
**Atenção**: isso **não é uma biblioteca externa**, mas sim uma solução desenvolvida localmente utilizando algumas bibliotecas de terceiros como suporte.

### Como funciona o TypeInject

- Use `@Provider("ChaveQualquer")` em uma classe (ou método de classe) para registrá-la como um provedor.
- Execute `ts-node generateDI` para gerar automaticamente um container com os arquivos e tipos necessários para a injeção de dependência.
- Utilize `@Inject()` como decorator de classes e `@Autowired("ChaveCriada")` apenas em propriedades para realizar a injeção automática.
- Use `@Singleton()` para aplicar o padrão de projeto Singleton.
- Funciona exclusivamente em arquivos com extensão `.class.ts` que utilizem `export default`.
> **Nota:** Utilize o arquivo `typeinject.config.ts` para configurações globais.

