import { PrismaClient } from "../generatedFiles";

const prisma = new PrismaClient();

async function seedLotes() {
  const lotes = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1 + '',
    nome: String(i + 1).padStart(4, '0'),
    ativo: true,
  }));

  for (const lote of lotes) {
    await prisma.lote.upsert({
      where: { id: lote.id },
      update: {},
      create: lote,
    });
  }

  console.log('20 lotes criados com sucesso.');
  await prisma.$disconnect();
}

seedLotes().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
