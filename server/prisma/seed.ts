import { PrismaClient, TaskCategory, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Limpando dados antigos...');
  await prisma.task.deleteMany();

  console.log('📝 Inserindo tarefas de teste...');
  await prisma.task.createMany({
    data: [
      {
        title: 'Estudar conceitos de Pointers e Memória',
        description: 'Revisar material de Estrutura de Dados para a prova.',
        category: TaskCategory.ACADEMIC,
        status: TaskStatus.TODO,
        dueDate: new Date('2026-10-01'),
      },
      {
        title: 'Entregar Projeto de Banco de Dados',
        description: 'Subir modelo ER e scripts de criação das tabelas no GitHub.',
        category: TaskCategory.ACADEMIC,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2026-09-28'),
      },
      {
        title: 'Comprar Creatina e Proteína',
        description: 'Verificar ofertas e repor estoque de suplementos.',
        category: TaskCategory.PERSONAL,
        status: TaskStatus.DONE,
      },
      {
        title: 'Treino de Pernas e Core',
        description: 'Foco em progressão de carga no agachamento.',
        category: TaskCategory.PERSONAL,
        status: TaskStatus.TODO,
        dueDate: new Date('2026-09-25'),
      },
    ],
  });

  const total = await prisma.task.count();
  console.log(`🌱 SEED EXECUTADO COM SUCESSO! Total de tarefas inseridas: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ ERRO NO SEED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });