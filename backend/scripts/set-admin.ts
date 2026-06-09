import * as dotenv from 'dotenv';
dotenv.config();
import { db } from '../src/utils/db';
import bcrypt from 'bcrypt';

async function setAdmin() {
  const username = process.argv[2];
  const password = process.argv[3];
  const email = process.argv[4];
  
  if (!username || !password) {
    console.error('Usage: npx ts-node scripts/set-admin.ts <username> <password> [email]');
    process.exit(1);
  }

  console.log(`Setting up admin user: ${username}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await db.admin.upsert({
    where: { username },
    update: { password: hashedPassword, ...(email && { email }) },
    create: {
      username,
      password: hashedPassword,
      ...(email && { email })
    }
  });

  console.log('✅ Successfully created/updated admin:');
  console.log(`Username: ${admin.username}`);
  console.log('Password has been securely hashed and stored.');
}

setAdmin().finally(() => db.$disconnect());
