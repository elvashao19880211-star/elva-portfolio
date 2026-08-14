import OSS from 'ali-oss';
import fs from 'fs';
import path from 'path';

const AK_ID = process.env.OSS_AK_ID;
const AK_SECRET = process.env.OSS_AK_SECRET;
const BUCKET = process.env.OSS_BUCKET;
const REGION = process.env.OSS_REGION || 'oss-cn-beijing';

if (!AK_ID || !AK_SECRET || !BUCKET) {
  console.error('缺少环境变量 OSS_AK_ID / OSS_AK_SECRET / OSS_BUCKET');
  process.exit(1);
}

const client = new OSS({ region: REGION, accessKeyId: AK_ID, accessKeySecret: AK_SECRET, bucket: BUCKET, timeout: 600000 });

const categories = ['materials', 'revival', 'innovation'];
const CONCURRENCY = 6;

// 1. 列已存在对象（断点续传）
const existing = new Set();
try {
  let marker = null;
  do {
    const r = await client.list({ 'max-keys': 1000, marker: marker || undefined }, {});
    (r.objects || []).forEach((o) => existing.add(o.name));
    marker = r.nextMarker || null;
  } while (marker);
} catch (e) {
  console.warn('列已有对象失败（忽略，按全量上传）:', e.message);
}
console.log(`OSS 已有对象: ${existing.size}`);

// 2. 收集待上传
const tasks = [];
for (const cat of categories) {
  const dir = path.join('originals', cat);
  if (!fs.existsSync(dir)) { console.warn('目录不存在:', dir); continue; }
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  for (const f of files) {
    const key = `${cat}/${f}`;
    if (existing.has(key)) continue;
    const st = fs.statSync(path.join(dir, f));
    tasks.push({ key, local: path.join(dir, f), size: st.size });
  }
}

const total = tasks.length;
const totalBytes = tasks.reduce((s, t) => s + t.size, 0);
console.log(`待上传: ${total} 个文件, ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);

if (total === 0) { console.log('无待上传文件，全部已存在'); process.exit(0); }

let done = 0, doneBytes = 0, fail = 0;
const errors = [];
const t0 = Date.now();

function report() {
  const pct = totalBytes ? ((doneBytes / totalBytes) * 100).toFixed(1) : '0';
  const el = (Date.now() - t0) / 1000;
  const speed = doneBytes / (el || 1) / 1024 / 1024;
  console.log(`[${done}/${total}] ${pct}% · ${(doneBytes / 1024 / 1024).toFixed(0)}MB · ${speed.toFixed(1)} MB/s · 失败 ${fail}`);
}

async function worker() {
  while (true) {
    const t = tasks.shift();
    if (!t) break;
    try {
      await client.put(t.key, t.local);
      done++;
      doneBytes += t.size;
      if (done % 10 === 0) report();
    } catch (e) {
      fail++;
      errors.push(`${t.key}: ${e.code || ''} ${e.message}`);
      console.error(`❌ ${t.key}: ${e.code || ''} ${e.message}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
report();
console.log(`\n完成: ${done} 成功, ${fail} 失败`);
if (errors.length) {
  console.log('失败清单:');
  errors.forEach((e) => console.log('  ' + e));
}
