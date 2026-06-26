const { PrismaClient } = require('@prisma/client'); const db = new PrismaClient(); db.user.findMany().then(users => console.log(users.map(u => u.createdAt))).finally(() => db.$disconnect());
