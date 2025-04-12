import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs


import { Boleto } from '@/config/prisma/generatedFiles';

export default class PDFUtils {
    static async gerarPDFComTabelaParaBoletosBase64(boletos: Boleto[]):  Promise<string> {
      const docDefinition = {
        content: [
          { text: 'Relatório de Boletos', style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', '*'],
              body: [
                ['id', 'nome_sacado', 'id_lote', 'valor', 'linha_digitavel'],
                ...boletos.map((b) => [
                  b.id,
                  b.nomeSacado,
                  b.lote_id,
                  `R$ ${b.valor.toFixed(2)}`,
                  b.linha_digitavel,
                ])
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 0, 0, 10] as [number, number, number, number]
          }
        },
        defaultStyle: {
          fontSize: 10
        }
      };
    
      return new Promise((resolve, reject) => {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    
        pdfDocGenerator.getBase64((base64) => {
          resolve(base64);
        });
      });
    }
}