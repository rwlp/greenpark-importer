import ControllerImportarBoleto from "@/lib/controllers/ControllerImportarBoleto.class";
import ControllerRelatoriosBoletos from "@/lib/controllers/ControllerRelatoriosBoletos.class";
import ControllerSalvarBoleto from "@/lib/controllers/ControllerSalvarBoletos.class";
import ServiceBoleto from "@/lib/services/ServiceBoleto.class";
import { Router } from "express";

const router = Router();

const controllerImportarBoleto = new ControllerImportarBoleto();
const controllerSalvarBoleto = new ControllerSalvarBoleto();
const controllerRelatoriosBoletos = new ControllerRelatoriosBoletos();

router.post('/importar-boletos-csv', (req, res) => controllerImportarBoleto.POST(req, res))
router.get('/importar-boletos-csv', (req, res) => controllerImportarBoleto.GET(req, res))
router.post('/salvar-boletos-pdf', (req, res) => controllerSalvarBoleto.POST(req, res))
router.get('/gerar-relatorio', (req, res) => controllerRelatoriosBoletos.GET(req, res))

export default router;