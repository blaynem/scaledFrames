import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  prisma.intentClickTracking.findFirst({
    include: {
      project: true,
      intent: {
        inclu
      }
    }
  }).then((res) => {res?.intent
  // Create the contract
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
