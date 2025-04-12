-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boleto" (
    "id" TEXT NOT NULL,
    "nomeSacado" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "linha_digitavel" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "dataCricacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lote_id" TEXT NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lote_nome_key" ON "Lote"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_nomeSacado_key" ON "Boleto"("nomeSacado");

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_linha_digitavel_key" ON "Boleto"("linha_digitavel");

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
