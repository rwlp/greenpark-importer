import { Request, Response } from "express";
import BaseControllerInterface from "../interfaces/BaseControllerInterface";
import ServiceBoleto from "../services/ServiceBoleto.class";
import ResponseWrapperDTO from "@/types/DTOs/ResponseWrapperDTO.class";
import { Autowired, Inject } from "@/config/typeinject/decorators/decorators";

@Inject()
export default class ControllerRelatoriosBoletos implements BaseControllerInterface { 

    @Autowired("ServiceBoleto")
    boletoService: ServiceBoleto;
    
    async GET(req: Request, res: Response) {
        const filtros = req.query;

        if (filtros.relatorio === '1') {
            const base64PDF = await this.boletoService.gerarRelatorioPDFBoletos(filtros);
            ResponseWrapperDTO.responseWrapper(res, 'Relatorio gerado com sucesso em formato base64', 200, 'string', base64PDF);
        } else {
            const boletosFiltrados = await this.boletoService.gerarRelatorioFiltrados(filtros);
            ResponseWrapperDTO.responseWrapper(res, 'Relatorio gerado com sucesso', 200, 'Boletos[]', boletosFiltrados);
        }
    };

    POST: (req: Request, res: Response) => Promise<void>;
}