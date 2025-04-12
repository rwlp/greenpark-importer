# Projeto Teste Técnico Green Access

## Summary

- [Rodando Localmente](#Rodando-Localmente)
- [Detalhes da Sprint (Baseado no framework Scrum)](#detalhes-da-sprint)
- [Como tratamos Injecao de Dependencias](#TypeInject)
- [Tratamento de Erros e Execoes Centralizado](#erros-e-execoes)
- [Definicao de requisicoes HTTP](#definicao-de-requests-http)
- [Banco de dados](#banco-de-dados)

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
  - Configurar ambiente Docker (opcional)
  - Configurar ambiente de testes para framework TDD ![badge-green](https://img.shields.io/badge/Status--green)
  - Configurar ambiente para banco de dados ![badge-green](https://img.shields.io/badge/Status--green)
  - Configurar TypeScript e processos de build ![badge-green](https://img.shields.io/badge/Status--green)
- Criar tabelas e migrações para o banco de dados ![badge-green](https://img.shields.io/badge/Status--green)
- Criar dados fake (PDFs, CSVs, bem como inserir dados iniciais no banco de dados se for preciso) ![badge-green](https://img.shields.io/badge/Status--green)
- Definir requisições HTTP usando Postman ![badge-green](https://img.shields.io/badge/Status--green)
- Escrever código dos endpoints no backend ![badge-green](https://img.shields.io/badge/Status--green)
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
│   ├── dateUtils.ts             # Exemplos
│   └── stringUtils.ts           # Exemplos
│
├── types/                       # Tipos globais
│   ├── express.d.ts             # Exemplos 
│   └── user.d.ts                # Exemplos
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

## Erros e Execoes

Tratamos o erro de forma centralizada atraves do middleware `app.use(GloblaMiddlewareErrorHandling.globalErrorMiddleware);`

### Fluxo de Exceptions
 - Em qualquer lugar da aplicacao as execoes vao para o middleware, ele e responsavel por tratar todos de responder todos erros no formato `{"message":string,"status":number}`

### AppError
 - A classe `AppError` deve ser usada para se evitar erros genericos, detalhando seu codigo e sua mensagem.
 - para usa-lo basta digitar `throw new AppError({message: 'sua mensagem', status: number})` onde o status eh o codigo http correspondente ao erro (404, 503, 401, etc);
 - Existe a possiblidade de ativar uma feature para gravar em logs de seguranca internos erros que merecem analise usando o argumento `saveError = true` porem ate o presente momento nao estamos usando essa modalidade


 ## Definicao de Requests Http

 - Acesso o link do postman para mais detalhes. [link_postman](https://www.postman.com/orbital-module-observer-37649517/technical-test-green-access/collection/ayu282u/definicao-de-endpoints?action=share&creator=37035636)


 ## Banco de dados
 Optamos por postgreeSQL gratuito do Render.com

## Rodando Localmente
- A url do banco de dados esta disponivel via formulario, voce deve adiciona-la no arquivo .env na pasta src/config/prisma/.env
 - o .env deve conter a linha `DATABASE_URL=urldobancodedados`  
- siga a seguencia de comandos: `npm install`, `npm run generatePrisma`, `npm run generateDI`, `npm run dev`
- apos estes passos voce deve ver a mensagem `Server is lauched on port:  3000  🚀🚀🚀` no console. 
- use o postman para fazer requisisoes [linkPostman](https://www.postman.com/orbital-module-observer-37649517/technical-test-green-access/collection/ayu282u/definicao-de-endpoints?action=share&creator=37035636)
- Observe que tudo roda localmente atraves de localhost:3000. 
- use os arquivos dentro da pasta tests/ para fazer requisicoes. 
- voce pode visualizar pdf em base64 pelo navegador digitando `data:application/pdf;base64,<base64retornado>` na url do navegador chrome(de preferencia)