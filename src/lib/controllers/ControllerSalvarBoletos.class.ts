import { Request, Response } from "express";
import * as fs from 'fs';
import BaseControllerInterface from "../interfaces/BaseControllerInterface";
import ResponseWrapperDTO from "@/types/DTOs/ResponseWrapperDTO.class";
import AppError from "@/utils/AppError.class";
import ServiceBoleto from "../services/ServiceBoleto.class";
import MulterUtils from "@/utils/MulterUtils";
import { Autowired, Inject } from "@/config/typeinject/decorators/decorators";

@Inject()
export default class ControllerSalvarBoleto implements BaseControllerInterface {

    @Autowired("ServiceBoleto")
    readonly boletoService: ServiceBoleto;

    async POST(req: Request, res: Response) {
        let file: Express.Multer.File | undefined

        try {
            file = await MulterUtils.handleMulterUpload('pdf', req, res)
            if (!file) {
                throw new AppError({ message: "Arquivo não enviado", statusCode: 400 });
            }

            await this.boletoService.salvarBoletosNoServidor(file);

            ResponseWrapperDTO.responseWrapper(res, "PDF importado com sucesso", 200, "string", "Os boletos foram salvos no sistema na pasta /boletos");
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

    GET: (req: Request, res: Response) => Promise<void>;
    }
