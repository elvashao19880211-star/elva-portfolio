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
  
  // Only process files that are new/untracked
  for (const file of files) {
    const fp = path.join(dir, file);
    try {
      execSync(`git ls-files --error-unmatch "${fp}"`, { stdio: 'pipe' });
      // already tracked, skip
    } catch {
      // untracked - add to batch
      process.stdout.write(`+ ${file}\n`);
    }
  }
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const untracked = batch.filter(f => {
      try {
        execSync(`git ls-files --error-unmatch "${path.join(dir, f)}"`, { stdio: 'pipe' });
        return false;
      } catch { return true; }
    });
    if (untracked.length === 0) continue;
    
    const filePaths = untracked.map(f => path.join(dir, f));
    execSync(`git add ${filePaths.map(p => `"${p}"`).join(' ')}`, { stdio: 'inherit' });
    execSync(`git commit -m "watermark: ${label} batch ${Math.floor(i / BATCH_SIZE) + 1}"`, { stdio: 'inherit' });
    execSync(`git push origin main`, { stdio: 'inherit' });
    
    console.log(`✅ ${label} batch done`);
  }
}

console.log('\n🎉 All done!');
