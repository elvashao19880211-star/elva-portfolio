const fs = require('fs');
const t = fs.readFileSync('app/patterns/revival/data.ts','utf8');
const entries = t.split('"id"').slice(1);
let withCulture = 0, withDesc = 0, withDetail = 0;
entries.forEach(e => {
  if (/"culture": "(.+?)"/.test(e) && RegExp.$1.length > 0) withCulture++;
  if (/"description": "(.+?)"/.test(e) && RegExp.$1.length > 0) withDesc++;
  if (/"detail": "(.+?)"/.test(e) && RegExp.$1.length > 0) withDetail++;
});
console.log('total:', entries.length, 'culture:', withCulture, 'desc:', withDesc, 'detail:', withDetail);
