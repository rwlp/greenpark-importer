import { Prisma, PrismaClient } from "@/config/prisma/generatedFiles";
import PrismaInstanceDAO from "../DataAccessObjects/PrismaInstanceDAO.class";
import { Autowired, Inject, Provider } from "@/config/typeinject/decorators/decorators";


@Provider("BoletoRepo")
@Inject()
export default class BoletoRepository {
    @Autowired("PrismaInstance")
    dao: PrismaInstanceDAO;

    async existemBoletosImportados() {
        const boletos = await this.dao.prismaInstance.boleto.findMany();

        return Boolean(boletos.length);
    }

    async lotesPorNomes(nomes: string[]) {
        return await this.dao.prismaInstance.lote.findMany({
            where: { nome: { in: nomes } }
        });
    }
    
    async criarBoletos(boletos: Prisma.BoletoCreateInput[]) {
        await Promise.all(
            boletos.map(b =>
                this.dao.prismaInstance.boleto.create({ data: b })
            )
        );
    }

    async boletoPorNomeDoSacado(nome: string) {
        return await this.dao.prismaInstance.boleto.findFirst({ where: {
            nomeSacado: nome
        }});
    }

    async boletosPorFiltros(filtros: any) {
        return await this.dao.prismaInstance.boleto.findMany(filtros);
    }

    async apagarDadosDeBoletoNoBancoDeDados() {
        await this.dao.prismaInstance.boleto.deleteMany();
    }
}