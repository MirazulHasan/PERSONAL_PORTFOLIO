const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.socialLink.findMany().then(links => {
  console.log(links);
}).finally(() => prisma.$disconnect());
