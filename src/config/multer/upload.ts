import multer from 'multer'
// --- Configuração do multer ---
const upload = multer({
  dest: 'tmp/csv/',
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (_req, file, cb) => {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')
    cb(null, isCsv)
  }
}).single('file') // aceita só 1 arquivo chamado 'file'

export default upload;