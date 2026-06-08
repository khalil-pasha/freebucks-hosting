import * as dotenv from 'dotenv';
dotenv.config();
import { db } from '../src/utils/db';

async function promote() {
  const usernameOrId = process.argv[2];
  
  if (!usernameOrId) {
    console.error('Usage: npx ts-node scripts/promote.ts <username_or_discord_id>');
    process.exit(1);
  }

  console.log(`Looking for user: ${usernameOrId}...`);

  const user = await db.user.findFirst({
    where: {
      OR: [
        { username: usernameOrId },
        { discordId: usernameOrId },
        { id: usernameOrId }
      ]
    }
  });

  if (!user) {
    console.error('User not found!');
    process.exit(1);
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' }
  });

  console.log('✅ Successfully promoted user to ADMIN:');
  console.log(`Username: ${updated.username}`);
  console.log(`Discord ID: ${updated.discordId}`);
  console.log(`New Role: ${updated.role}`);
}

promote().finally(() => db.$disconnect());
