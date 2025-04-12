import { Autowired, Inject, Provider } from "@/config/typeInject/decorators/decorators";
import PrismaInstanceDAO from "../DataAccessObjects/PrismaInstanceDAO.class";



@Provider("LoteRepo")
@Inject()
export default class LoteRepository {
    @Autowired("PrismaInstance")
    dao: PrismaInstanceDAO;

    async lotesPorNomes(nomes: string[]) {
        return await this.dao.prismaInstance.lote.findMany({
            where: { nome: { in: nomes } }
        });
    }
}