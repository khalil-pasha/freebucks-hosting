const axios = require('axios');
async function test() {
  const res = await axios.get('https://api.modrinth.com/v2/project/logo-smp-essentials/version');
  console.log(JSON.stringify(res.data[0], null, 2));
}
test();
