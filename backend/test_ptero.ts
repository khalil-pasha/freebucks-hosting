import 'dotenv/config';
import axios from 'axios';

async function main() {
  const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client`;
  const res = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${process.env.PTERODACTYL_CLIENT_KEY}`,
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  });
  console.log(JSON.stringify(res.data.data[0].attributes, null, 2));
}

main().catch(console.error);
