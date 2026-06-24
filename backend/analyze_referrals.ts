import 'dotenv/config';
import { db } from './src/utils/db';

async function main() {
  const referrals = await db.referral.findMany({
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Total Referral rows: ${referrals.length}`);

  const grouped = referrals.reduce((acc: any, ref: any) => {
    if (!acc[ref.referredId]) acc[ref.referredId] = [];
    acc[ref.referredId].push(ref);
    return acc;
  }, {});

  const duplicates = Object.keys(grouped).filter(id => grouped[id].length > 1);
  console.log(`Duplicate referredId values: ${duplicates.length}\n`);

  if (duplicates.length === 0) {
    console.log("No duplicates found. Safe to proceed.");
    process.exit(0);
  }

  for (const refId of duplicates) {
    const refs = grouped[refId];
    console.log(`--- Duplicate referredId: ${refId} ---`);
    console.log(`Found ${refs.length} records.`);
    
    // Logic: 
    // Keep COMPLETED if one exists. If multiple, earliest createdAt.
    // If none COMPLETED, earliest createdAt.
    let keepRef = refs[0];
    const completed = refs.filter((r: any) => r.status === 'COMPLETED');
    
    if (completed.length > 0) {
      keepRef = completed.reduce((oldest: any, curr: any) => {
        return (new Date(curr.createdAt) < new Date(oldest.createdAt)) ? curr : oldest;
      });
    } else {
      keepRef = refs.reduce((oldest: any, curr: any) => {
        return (new Date(curr.createdAt) < new Date(oldest.createdAt)) ? curr : oldest;
      });
    }

    console.log(`KEPT: ${keepRef.id} [Status: ${keepRef.status}, CreatedAt: ${keepRef.createdAt}] - Reason: Earliest created${keepRef.status === 'COMPLETED' ? ' completed' : ''} record.`);
    
    const toDelete = refs.filter((r: any) => r.id !== keepRef.id);
    for (const del of toDelete) {
      console.log(`DELETED: ${del.id} [Status: ${del.status}, CreatedAt: ${del.createdAt}] - Reason: Duplicate of kept record.`);
    }
    console.log("");
  }
}

main().catch(console.error).finally(() => db.$disconnect());
