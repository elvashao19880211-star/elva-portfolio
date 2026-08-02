import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = ['public/images/revival', 'public/images/innovation'];

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f) && !f.startsWith('.'));
  const thumbDir = path.join(dir, 'thumbs');
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
  
  let count = 0;
  for (const file of files) {
    const src = path.join(dir, file);
    const dest = path.join(thumbDir, file.replace(/\.(jpg|jpeg)$/i, '.png'));
    try {
      await sharp(src)
        .resize(250, 250, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: 75, compressionLevel: 9 })
        .toFile(dest);
      count++;
    } catch (e) {
      console.error(`  ❌ ${file}: ${e.message}`);
    }
  }
  console.log(`✅ ${dir.split('/').pop()}: ${count} 张缩略图`);
}
console.log('全部完成');
