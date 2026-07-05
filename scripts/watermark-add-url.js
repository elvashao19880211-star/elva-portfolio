// 纹样图补网址水印
// 只追加 hetu-pattern.com，不重复加河图（上次脚本已加）
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const dirs = ['public/images/revival', 'public/images/innovation'];

async function addUrlWatermark(inputPath, outputPath) {
  try {
    const meta = await sharp(inputPath).metadata();
    const w = meta.width;
    const h = meta.height;

    const fontSize = Math.round(Math.min(w, h) * 0.035);
    const urlSize = Math.round(fontSize * 0.55);
    const spacingX = Math.round(fontSize * 5);
    const spacingY = Math.round(fontSize * 6);
    const lineGap = Math.round(fontSize * 1.4);

    const cols = Math.ceil(w / spacingX) + 1;
    const rows = Math.ceil(h / spacingY) + 1;

    let textElements = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacingX;
        const y = r * spacingY + fontSize;
        textElements += `<text x="${x + fontSize * 0.2}" y="${y + lineGap}" font-size="${urlSize}" fill="rgba(255,255,255,0.08)" font-family="sans-serif" font-style="italic">hetu-pattern.com</text>`;
      }
    }

    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;

    await sharp(inputPath)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png()
      .toFile(outputPath + '.tmp');

    fs.renameSync(outputPath + '.tmp', outputPath);
    console.log(`  ✅ ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`  ❌ ${path.basename(outputPath)}:`, err.message);
  }
}

async function main() {
  const root = path.join(__dirname, '..');
  let total = 0;

  for (const dir of dirs) {
    const srcDir = path.join(root, dir);
    const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
    console.log(`\n📂 ${dir} — ${files.length} 张`);

    for (const file of files) {
      await addUrlWatermark(path.join(srcDir, file), path.join(srcDir, file));
      total++;
    }
  }

  console.log(`\n🏁 完成！共 ${total} 张`);
}

main();
