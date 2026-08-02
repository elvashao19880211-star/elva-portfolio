import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ── 配置 ──────────────────────────────────────────────
const WATERMARK_TEXT = 'hetu-pattern.com';
const OPACITY = 0.15;           // 15% 透明度
const FONT_SIZE = 36;           // 水印字号
const SPACING = 180;            // 水印间距（横向+纵向）

const TARGET_DIRS = [
  'public/images/revival',
  'public/images/revival/thumbs',
  'public/images/innovation',
];

// ── 生成平铺水印 SVG ────────────────────────────────
function makeWatermarkSVG(imgWidth, imgHeight) {
  const chars = WATERMARK_TEXT.length;
  const w = chars * FONT_SIZE * 0.65;  // 单个水印文字的宽度
  const h = FONT_SIZE * 1.4;           // 单个水印文字的高度
  const rows = Math.ceil(imgHeight / SPACING) + 1;
  const cols = Math.ceil(imgWidth / SPACING) + 1;

  let texts = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * SPACING + (r % 2 === 1 ? SPACING / 2 : 0); // 交错排列
      const y = r * SPACING;
      texts += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${FONT_SIZE}" fill="white" text-anchor="middle" dominant-baseline="middle" transform="rotate(-30, ${x}, ${y})">${WATERMARK_TEXT}</text>`;
    }
  }

  return Buffer.from(
    `<svg width="${imgWidth}" height="${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>text { font-family: Arial, Helvetica, sans-serif; }</style>
      ${texts}
    </svg>`
  );
}

// ── 处理单张图片 ──────────────────────────────────────
async function addWatermark(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return;

  const metadata = await sharp(filePath).metadata();
  const { width, height } = metadata;
  if (!width || !height) return;

  const svg = makeWatermarkSVG(width, height);

  await sharp(filePath)
    .composite([{
      input: svg,
      top: 0,
      left: 0,
      blend: 'overlay',
      opacity: OPACITY,
    }])
    .toFile(filePath + '.tmp')
    .then(() => {
      fs.renameSync(filePath + '.tmp', filePath);
    });

  console.log(`  ✓ ${path.relative(root, filePath)}`);
}

// ── 主函数 ──────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  let total = 0;

  for (const dir of TARGET_DIRS) {
    const fullDir = path.resolve(root, dir);
    if (!fs.existsSync(fullDir)) {
      console.log(`⚠ 目录不存在: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(fullDir)
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .map(f => path.join(fullDir, f));

    if (files.length === 0) {
      console.log(`  (${dir} 无图片文件)`);
      continue;
    }

    console.log(`\n📁 ${dir}/  (${files.length} 张)`);
    for (const file of files) {
      await addWatermark(file);
      total++;
    }
  }

  console.log(`\n✅ 全部完成！共处理 ${total} 张图片，耗时 ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
}

main().catch(err => {
  console.error('❌ 出错:', err);
  process.exit(1);
});
