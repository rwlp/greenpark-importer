
import * as fs from 'fs'
import * as csv from 'csv-parser'
import * as path from 'path'
import * as pdf from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { Prisma } from "@/config/prisma/generatedFiles";
import { BoletoFromCSV, FiltrosDeBoletos } from "@/types/Boletos";
import AppError from '@/utils/AppError.class'
import checkSeCSVEstaInfectado from '@/utils/checkSeCSVEstaInfectado';
import PDFUtils from '@/utils/PDFUtils';
import BoletoRepository from '../repositories/BoletoRepository.class';
import { Autowired, Inject, Provider } from '@/config/typeinject/decorators/decorators';
import LoteRepository from '../repositories/LoteRepository.class';

const MAX_SIZE_FOR_PDF = 5 * 1024 * 1024;
const EXPECTED_PAGES_FOR_PDF = 20;
const ORDEM_DE_PAGINAS_POR_NOME_DE_PDF = [
    "JOAO PEREIRA", "ANA SILVA", "CARLOS EDUARDO", "FABIANA MELO", "JOSE DA SILVA",
    "MARCOS ROBERTO", "PATRICIA SOUZA", "LUCIANA MATTOS", "DIOGO RIBEIRO", "MARCIA CARVALHO",
    "RAFAEL LIMA", "JULIANA FERREIRA", "THIAGO COSTA", "CAMILA NUNES", "ROBERTO MORAES",
    "ANDREIA DIAS", "GUSTAVO ALMEIDA", "RENATA LOPES", "FELIPE TEIXEIRA", "SANDRA VIEIRA"
];

@Provider("ServiceBoleto")
@Inject()
export default class ServiceBoleto {
    @Autowired("BoletoRepo")
    boletoRepo: BoletoRepository;

    @Autowired("LoteRepo")
    loteRepo: LoteRepository;

    private headersEsperados = ['nome', 'unidade', 'valor', 'linha_digitavel'];

    async validaFormatoCSVDeBoletos(filePath: string): Promise<BoletoFromCSV[]> {
        const results: BoletoFromCSV[] = []

        // Valida se headers estao certos
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({ separator: ';' }))
                .on('headers', (headers: string[]) => {
                    const headersLower = headers.map(h => h.toLowerCase())
                    const isValid = this.headersEsperados.every(h => headersLower.includes(h))
                    if (!isValid) {
                        fs.unlinkSync(filePath)
                        return reject(new AppError({ message: 'Headers inválidos no CSV', statusCode: 400 }))
                    }
                })
                .on('data', (data) => {
                    const sanitized = {
                        nome: data.nome?.trim(),
                        unidade: parseInt(data.unidade, 10),
                        valor: parseFloat(data.valor),
                        linha_digitavel: data.linha_digitavel?.trim()
                    }

                    const isValid =
                        sanitized.nome &&
                        !checkSeCSVEstaInfectado(sanitized.nome) &&
                        !isNaN(sanitized.unidade) &&
                        !isNaN(sanitized.valor) &&
                        /^\d+$/.test(sanitized.linha_digitavel)

                    if (isValid) {
                        results.push(sanitized)
                    }
                })
                .on('end', () => {
                    fs.unlinkSync(filePath)
                    if (results.length === 0) {
                        return reject(new AppError({ message: 'Nenhum boleto válido encontrado no CSV', statusCode: 422 }))
                    }
                    resolve(results)
                })
                .on('error', () => {
                    fs.unlinkSync(filePath)
                    reject(new AppError({ message: 'Erro ao processar CSV', statusCode: 500 }))
                })
        })
    }

    async insertBoletosFromBoletoCSVList(listaBoletos: BoletoFromCSV[]) {
        // Consulta os lotes com id, assumindo o exemplo unidade = '17' e lote_id = '0017'
        const nomes = listaBoletos.map(b => String(b.unidade).padStart(4, '0'));
        const lotes = await this.loteRepo.lotesPorNomes(nomes);

        // Mapping pra acessar o id
        const mapaLotes = new Map(lotes.map(l => [l.nome, l.id]));

        // Arruma a lista de boletos com lote_id no formato correto
        const boletosComLoteId = listaBoletos.map(boleto => {
            const loteNome = String(boleto.unidade).padStart(4, '0');
            const loteId = mapaLotes.get(loteNome);
            if (!loteId) throw new AppError({ message: `Lote não encontrado para ${boleto.unidade}`, statusCode: 400 });
            const boletoDBFormat: Prisma.BoletoCreateInput = {
                nomeSacado: boleto.nome,
                ativo: true,
                linha_digitavel: boleto.linha_digitavel,
                valor: boleto.valor,
                lote: {
                    connect: { id: loteId }
                }
            }

            return boletoDBFormat;
        });

        // Cria novos boletos no banco de dados

        await this.boletoRepo.criarBoletos(boletosComLoteId)
        // Retorna os boletos que foram adicionados no banco de dados

        // Cria a pasta boletos vazia
        const outputDir = path.join(__dirname, "../..", "..", "boletos");

            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        return boletosComLoteId;
    }

    async salvarBoletosNoServidor(file: Express.Multer.File) {
        const existemBoletosImportados = await this.boletoRepo.existemBoletosImportados();
        if (!existemBoletosImportados) throw new AppError({message: "Voce precisa importar boletos antes dessa operacao", statusCode: 400})

        const filePath = file.path;

        if (path.extname(filePath).toLowerCase() !== '.pdf') {
            fs.unlinkSync(filePath);
            throw new AppError({ message: "Apenas arquivos PDF são aceitos", statusCode: 400 });
        }

        if (file.size > MAX_SIZE_FOR_PDF) {
            fs.unlinkSync(filePath);
            throw new AppError({ message: "Arquivo excede o tamanho máximo de 5MB", statusCode: 400 });
        }

        try {
            const dataBuffer = fs.readFileSync(filePath);
            const parsed = await pdf(dataBuffer);

            if (parsed.info?.Encrypted) {
                throw new AppError({ message: "PDF criptografado não é permitido", statusCode: 400 });
            }

            if (!parsed.text || parsed.text.trim().length === 0) {
                throw new AppError({ message: "PDF sem conteúdo legível.", statusCode: 400 });
            }

            if (parsed.numpages !== EXPECTED_PAGES_FOR_PDF) {
                throw new AppError({ message: `PDF deve conter exatamente ${EXPECTED_PAGES_FOR_PDF} páginas.`, statusCode: 400 });
            }

            const raw = parsed.text;
            const binarios = raw.match(/[^\x09\x0A\x0D\x20-\x7E]/g);
            if (binarios && binarios.length > 500) {
                throw new AppError({ message: 'Conteúdo do PDF suspeito (possível binário/macro).', statusCode: 400 });
            }

            const paginas = raw.split(/\f|\n{3,}/);
            const nomesExtraidos = paginas.map((p) => {
                const match = p.match(/Nome do Sacado:\s*(.+)/);
                return match?.[1]?.trim().toUpperCase();
            });

            const ordemOk = nomesExtraidos.every((nome, i) => nome === ORDEM_DE_PAGINAS_POR_NOME_DE_PDF[i]);
            if (!ordemOk) throw new AppError({ message: "Ordem dos nomes no PDF não corresponde à esperada.", statusCode: 400 })

            // SPLIT PDF
            const pdfDoc = await PDFDocument.load(dataBuffer);
            const outputDir = path.join(__dirname, "../..", "..", "boletos");

            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);


            // salvando cada boleto por nomedapessoa mas quero por ID
            for (let i = 0; i < EXPECTED_PAGES_FOR_PDF; i++) {
                const singlePageDoc = await PDFDocument.create();
                const [page] = await singlePageDoc.copyPages(pdfDoc, [i]);
                singlePageDoc.addPage(page);

                const boletoCorrespondente = await this.boletoRepo.boletoPorNomeDoSacado(ORDEM_DE_PAGINAS_POR_NOME_DE_PDF[i])
                const nomeArquivo = boletoCorrespondente?.id;
                const finalPath = path.join(outputDir, `${nomeArquivo}.pdf`);
                const pdfBytes = await singlePageDoc.save();
                fs.writeFileSync(finalPath, pdfBytes);
            }

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            fs.unlinkSync(filePath); // limpa o tmp
        }
    }

    async gerarRelatorioFiltrados(filtros: FiltrosDeBoletos) {
        const existemBoletosImportados = await this.boletoRepo.existemBoletosImportados();
        if (!existemBoletosImportados) throw new AppError({message: "Voce precisa importar boletos antes dessa operacao", statusCode: 400})

        const filtrosParaBancoDeDados = {
            where: {
                nomeSacado: filtros.nome ? { contains: String(filtros.nome), mode: 'insensitive' } : undefined,
                valor: {
                    gte: filtros.valor_inicial ? Number(filtros.valor_inicial) : undefined,
                    lte: filtros.valor_final ? Number(filtros.valor_final) : undefined,
                },
                lote_id: filtros.id_lote ? String(filtros.id_lote) : undefined,
            },
        }

        const boletos = await this.boletoRepo.boletosPorFiltros(filtrosParaBancoDeDados);

        return boletos;
    }

    async gerarRelatorioPDFBoletos(filtros: FiltrosDeBoletos) {
        const existemBoletosImportados = await this.boletoRepo.existemBoletosImportados();
        if (!existemBoletosImportados) throw new AppError({message: "Voce precisa importar boletos antes dessa operacao", statusCode: 400})
    
        const boletos = await this.gerarRelatorioFiltrados(filtros)
        const base64PDF = await PDFUtils.gerarPDFComTabelaParaBoletosBase64(boletos);

        return base64PDF;
    }

    async apagarDadosDeBoletos() {
        const existemBoletosImportados = await this.boletoRepo.existemBoletosImportados();
        if (!existemBoletosImportados) throw new AppError({message: "Voce precisa importar boletos antes dessa operacao", statusCode: 400})

        await this.boletoRepo.apagarDadosDeBoletoNoBancoDeDados();
        fs.rmdirSync(path.resolve(path.join(__dirname, "../..", "..", "boletos")), { recursive: true });
    }
}
