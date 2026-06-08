import * as dotenv from 'dotenv';
dotenv.config();
import { db } from '../src/utils/db';

async function diagnose() {
  console.log('--- DATABASE DIAGNOSTICS ---');
  
  try {
    const adminCount = await db.user.count({ where: { role: 'ADMIN' } });
    console.log(`Total ADMIN users: ${adminCount}`);

    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, username: true, discordId: true, role: true }
    });

    if (admins.length > 0) {
      console.table(admins);
    } else {
      console.log('No users with ADMIN role found in the database. Run the promote script.');
    }
    
    console.log('--- END DIAGNOSTICS ---');
  } catch (error) {
    console.error('Diagnostic error:', error);
  }
}

diagnose().finally(() => db.$disconnect());
