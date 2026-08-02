// 全站纹样统一水印重打脚本
// 1. 从 _originals/ 恢复原图
// 2. 用统一格式（河图+hetu-pattern.com）重新打标
// 3. 缩放到1500px
// 跳过已从干净原图修复的5张
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const dirs = [
  { src: '_originals/revival', dst: 'public/images/revival' },
  { src: '_originals/innovation', dst: 'public/images/innovation' },
];

// 已用干净原图修复的5张，跳过
const skipFiles = new Set([
  '初唐-葡萄石榴藻井.png',
  '北凉-第272窟忍冬藻井.png',
  '唐代-卷草纹.png',
  '北朝-联珠日神纹.png',
  '初唐-四人飞天.png',
]);

function makeWatermarkSvg(width, height) {
  const fontSize = Math.round(Math.min(width, height) * 0.035);
  const urlSize = Math.round(fontSize * 0.55);
  const spacingX = Math.round(fontSize * 5);
  const spacingY = Math.round(fontSize * 6);
  const lineGap = Math.round(fontSize * 1.4);

  const cols = Math.ceil(width / spacingX) + 1;
  const rows = Math.ceil(height / spacingY) + 1;

  let text = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * spacingX;
      const y = r * spacingY + fontSize;
      text += `<text x="${x}" y="${y}" font-size="${fontSize}" fill="rgba(255,255,255,0.12)" font-family="sans-serif">河图</text>`;
      text += `<text x="${x + fontSize * 0.2}" y="${y + lineGap}" font-size="${urlSize}" fill="rgba(255,255,255,0.08)" font-family="sans-serif" font-style="italic">hetu-pattern.com</text>`;
    }
  }
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${text}</svg>`;
}

async function process(srcPath, dstPath) {
  const meta = await sharp(srcPath).metadata();
  const maxDim = 1500;

  let image = sharp(srcPath);
  if (meta.width > maxDim || meta.height > maxDim) {
    if (meta.width >= meta.height) image = image.resize({ width: maxDim });
    else image = image.resize({ height: maxDim });
  }

  const resizedBuf = await image.png().toBuffer();
  const resizedMeta = await sharp(resizedBuf).metadata();
  const svg = makeWatermarkSvg(resizedMeta.width, resizedMeta.height);

  await sharp(resizedBuf)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(dstPath + '.tmp');

  fs.renameSync(dstPath + '.tmp', dstPath);
  console.log(`  ✅ ${path.basename(dstPath)} → ${resizedMeta.width}x${resizedMeta.height}`);
}

async function main() {
  let total = 0;

  for (const { src, dst } of dirs) {
    const srcDir = path.join(root, src);
    const dstDir = path.join(root, dst);

    if (!fs.existsSync(srcDir)) continue;

    const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f) && !skipFiles.has(f));
    console.log(`\n📂 ${dst} — ${files.length} 张（跳过 ${skipFiles.size} 张已修复）`);

    for (const file of files) {
      try {
        await process(path.join(srcDir, file), path.join(dstDir, file));
        total++;
      } catch (err) {
        console.error(`  ❌ ${file}: ${err.message}`);
      }
    }
  }

  console.log(`\n🏁 完成！共重打 ${total} 张`);
  console.log('⚠️ 素材库需单独处理（从素材待导入_v2/重跑导入脚本）');
}

main();
