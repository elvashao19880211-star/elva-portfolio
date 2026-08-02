// 纹样作品展示图处理脚本
// 1. 备份原图到 _originals/
// 2. 缩放到 1500px（最长边）
// 3. 叠加"河图"水印
// 处理范围：public/images/revival/ 和 public/images/innovation/
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const dirs = ['public/images/revival', 'public/images/innovation'];

async function addWatermark(image, width, height) {
  // 主文字大小
  const fontSize = Math.round(Math.min(width, height) * 0.035);
  const urlSize = Math.round(fontSize * 0.55);
  const spacingX = Math.round(fontSize * 5);
  const spacingY = Math.round(fontSize * 6);
  const lineGap = Math.round(fontSize * 1.4);

  const cols = Math.ceil(width / spacingX) + 1;
  const rows = Math.ceil(height / spacingY) + 1;

  let textElements = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacingX;
      const y = row * spacingY + fontSize;
      textElements +=
        `<text x="${x}" y="${y}" font-size="${fontSize}" fill="rgba(255,255,255,0.12)" font-family="sans-serif">河图</text>` +
        `<text x="${x + fontSize * 0.2}" y="${y + lineGap}" font-size="${urlSize}" fill="rgba(255,255,255,0.08)" font-family="sans-serif" font-style="italic">hetu-pattern.com</text>`;
    }
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;
  return Buffer.from(svg);
}

async function processFile(srcDir, file, originalsDir) {
  const srcPath = path.join(srcDir, file);
  const backupPath = path.join(originalsDir, file);
  const tmpPath = srcPath + '.tmp';

  // 1. 备份原图（如果还没备份）
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(srcPath, backupPath);
  }

  // 2. 缩放到 1500px 最长边
  const metadata = await sharp(srcPath).metadata();
  const maxDim = 1500;
  let resizeOpts = {};
  if (metadata.width > maxDim || metadata.height > maxDim) {
    if (metadata.width >= metadata.height) {
      resizeOpts = { width: maxDim };
    } else {
      resizeOpts = { height: maxDim };
    }
  }

  // 3. 缩放 + 水印
  const image = sharp(srcPath);
  if (Object.keys(resizeOpts).length > 0) {
    image.resize(resizeOpts);
  }

  const resizedMeta = Object.keys(resizeOpts).length > 0
    ? { width: resizeOpts.width || Math.round(metadata.width * maxDim / metadata.height), height: resizeOpts.height || Math.round(metadata.height * maxDim / metadata.width) }
    : metadata;

  const watermark = await addWatermark(image, resizedMeta.width, resizedMeta.height);

  await image
    .composite([{ input: watermark, top: 0, left: 0 }])
    .png()
    .toFile(tmpPath);

  fs.renameSync(tmpPath, srcPath);
}

async function main() {
  const root = path.join(__dirname, '..');
  let total = 0;

  for (const dir of dirs) {
    const srcDir = path.join(root, dir);
    const originalsDir = path.join(root, '_originals', path.basename(dir));

    if (!fs.existsSync(srcDir)) continue;
    fs.mkdirSync(originalsDir, { recursive: true });

    const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
    console.log(`\n📂 ${dir} — ${files.length} 张`);

    for (const file of files) {
      try {
        await processFile(srcDir, file, originalsDir);
        console.log(`  ✅ ${file}`);
        total++;
      } catch (err) {
        console.error(`  ❌ ${file}: ${err.message}`);
      }
    }
  }

  console.log(`\n🏁 完成！共处理 ${total} 张`);
  console.log(`📦 原图备份在 _originals/revival/ 和 _originals/innovation/`);
  console.log(`⚠️  请确认效果后提交 git push`);
}

main();
