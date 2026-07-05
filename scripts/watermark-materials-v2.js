// 素材库水印更新脚本
// 给已有水印的素材图追加 hetu-pattern.com 网址层
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcDir = path.join(__dirname, '..', 'public', 'images', 'materials');

const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

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
        // 只加网址，不加河图（已有）
        textElements += `<text x="${x + fontSize * 0.2}" y="${y + lineGap}" font-size="${urlSize}" fill="rgba(255,255,255,0.08)" font-family="sans-serif" font-style="italic">hetu-pattern.com</text>`;
      }
    }

    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;

    await sharp(inputPath)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png()
      .toFile(outputPath + '.tmp');

    fs.renameSync(outputPath + '.tmp', outputPath);
    console.log(`✅ ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`❌ ${path.basename(outputPath)}:`, err.message);
  }
}

async function main() {
  console.log(`素材库水印更新，共 ${files.length} 张...\n`);
  for (const file of files) {
    const p = path.join(srcDir, file);
    await addUrlWatermark(p, p);
  }
  console.log(`\n全部完成!`);
}

main();
