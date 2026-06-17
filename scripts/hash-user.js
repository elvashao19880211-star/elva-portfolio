const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'users.json');
bcrypt.hash('elva2026', 10).then(h => {
  const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  users[0].passwordHash = h;
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  console.log('Done. Password hash:', h);
});
