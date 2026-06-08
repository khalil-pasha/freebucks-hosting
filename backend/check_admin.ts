import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './src/utils/db';

async function verifyAdmin() {
  const admin = await db.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, username: true, discordId: true, role: true }
  });
  console.log('--- ADMIN USER VERIFICATION ---');
  console.log(admin ? admin : 'No ADMIN user found in PostgreSQL.');
  console.log('-------------------------------');
}

verifyAdmin().finally(() => db.$disconnect());
