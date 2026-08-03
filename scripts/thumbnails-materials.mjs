import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.resolve('public/images/materials');
const OUT = path.resolve('public/images/materials/thumbs');
const SIZE = 480;

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

async function go() {
  for (const f of files) {
    const srcPath = path.join(SRC, f);
    const outPath = path.join(OUT, f);
    if (fs.existsSync(outPath)) { console.log(`  ⏭ ${f}`); continue; }
    try {
      await sharp(srcPath)
        .resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 75 })
        .toFile(outPath);
      console.log(`  ✅ ${f}`);
    } catch (e) {
      console.error(`  ❌ ${f}: ${e.message}`);
    }
  }
  const done = fs.readdirSync(OUT).filter(f => /\.png$/i.test(f));
  console.log(`\n完成: ${done.length}/${files.length} 张`);
}

go();
