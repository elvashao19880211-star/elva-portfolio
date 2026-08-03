import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import path from 'path';

const BATCH_SIZE = 5;
const DIRS = [
  { dir: 'public/images/revival', label: 'revival' },
  { dir: 'public/images/innovation', label: 'innovation' },
];

for (const { dir, label } of DIRS) {
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter(f => /\.png$/i.test(f) && !f.startsWith('.'));
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const filePaths = batch.map(f => path.join(dir, f));
    
    execSync(`git add ${filePaths.map(p => `"${p}"`).join(' ')}`, { stdio: 'inherit' });
    execSync(`git commit -m "watermark: ${label} batch ${Math.floor(i / BATCH_SIZE) + 1}"`, { stdio: 'inherit' });
    execSync(`git push origin main`, { stdio: 'inherit' });
    
    console.log(`✅ ${label} ${i + batch.length}/${files.length} done`);
  }
}

console.log('\n🎉 All watermarked images pushed!');
