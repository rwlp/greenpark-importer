import { Request, Response } from "express";
import * as fs from 'fs';
import BaseControllerInterface from "../interfaces/BaseControllerInterface";
import MulterUtils from "@/utils/MulterUtils";
import AppError from "@/utils/AppError.class";
import ResponseWrapperDTO from "@/types/DTOs/ResponseWrapperDTO.class";
import ServiceBoleto from "../services/ServiceBoleto.class";
import { Autowired, Inject } from "@/config/typeInject/decorators/decorators";

@Inject()
export default class ControllerImportarBoleto implements BaseControllerInterface {

    @Autowired("ServiceBoleto")
    boletoService: ServiceBoleto;

    async POST(req: Request, res: Response) {

        let file: Express.Multer.File | undefined

        try {
            file = await MulterUtils.handleMulterUpload('csv', req, res)
            const boletos = await this.boletoService.validaFormatoCSVDeBoletos(file!.path)
            const inserted = await this.boletoService.insertBoletosFromBoletoCSVList(boletos)

            ResponseWrapperDTO.responseWrapper(res, "Os boletos abaixo foram importados para o sistema", 200, "Boletos[]", inserted);

        } catch (error) {
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
            if (error instanceof AppError) throw error;

            throw new AppError({
                message: 'Erro inesperado no Sistema, tente novamente',
                statusCode: 500
            })
        }
    }

    async GET(req: Request, res: Response) {
        await this.boletoService.apagarDadosDeBoletos();

        ResponseWrapperDTO.responseWrapper(res, 'Os dados de boletos importados foram apagados!', 200, 'string', 'Os dados de boletos importados foram apagados!')
    };
}