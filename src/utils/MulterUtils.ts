import { Request, Response } from 'express'
import * as multer from 'multer'
import * as path from 'path'
import { randomUUID } from 'crypto'
import AppError from './AppError.class';

export const storageMulter = multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'temp'), // ou ajuste caminho
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${randomUUID()}${ext}`)
    }
  });

export const uploadCSVMulter = multer({
    storage: storageMulter,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      if (file.mimetype !== 'text/csv') return cb(new Error('Arquivo deve estar no formato CSV'))
      cb(null, true)
    }
  }).single('file')


  function getMimeTypes(tipo: 'csv' | 'pdf'): string[] {
    return tipo === 'csv'
      ? ['text/csv', 'application/vnd.ms-excel']
      : ['application/pdf'];
  }

  function getMulterUploader(tipo: 'csv' | 'pdf') {
  return multer({
    storage: storageMulter,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      const allowed = getMimeTypes(tipo);
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error(`Arquivo deve estar no formato ${tipo.toUpperCase()}`));
      }
      cb(null, true);
    },
  }).single('file');
}

export default class MulterUtils {
  static handleMulterUpload(
    tipo: 'csv' | 'pdf',
    req: Request & { file?: any },
    res: Response
  ): Promise<Express.Multer.File> {
    const uploader = getMulterUploader(tipo);

    return new Promise((resolve, reject) => {
      uploader(req, res, (err) => {
        if (err || !req.file) {
          return reject(
            new AppError({
              message: 'Falha no upload do arquivo, arquivo ausente ou inválido',
              statusCode: 400,
            })
          );
        }
        resolve(req.file);
      });
    });
  }
}