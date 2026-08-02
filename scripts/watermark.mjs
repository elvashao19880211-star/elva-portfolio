import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const WATERMARK = path.resolve('_incoming/网站水印图.png');
const REVIVAL_DIR = path.resolve('public/images/revival');
const INNOVATION_DIR = path.resolve('public/images/innovation');

const OPACITY = 0.48;
const SCALE = 1.5;
const SPACING_X = 500;
const SPACING_Y = 800;
const JITTER_X = 120;
const JITTER_Y = 80;
const MAX_ROTATE = 15;

async function extractPalette(imgPath, n = 5) {
  const { data } = await sharp(imgPath)
    .resize(20, 20, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const map = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const k = `${Math.round(data[i] / 32) * 32},${Math.round(data[i + 1] / 32) * 32},${Math.round(data[i + 2] / 32) * 32}`;
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k.split(',').map(Number));
}

async function processOne(inputPath, outputPath, wmInfo, wmRaw) {
  const meta = await sharp(inputPath).metadata();
  const palette = await extractPalette(inputPath, 5);
  const wmW = Math.round((wmInfo.width || 150) * SCALE);
  const wmH = Math.round((wmInfo.height || 450) * SCALE);
  const cols = Math.ceil((meta.width || 5000) / SPACING_X) + 1;
  const rows = Math.ceil((meta.height || 5000) / SPACING_Y) + 1;

  const composites = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [cr, cg, cb] = palette[Math.floor(Math.random() * palette.length)];
      const angle = Math.random() < 0.3 ? Math.round((Math.random() - 0.5) * MAX_ROTATE * 2) : 0;
      const tinted = Buffer.from(wmRaw);
      for (let i = 0; i < tinted.length; i += 4) {
        if (tinted[i + 3] > 0) {
          tinted[i] = cr; tinted[i + 1] = cg; tinted[i + 2] = cb;
          tinted[i + 3] = Math.round(tinted[i + 3] * OPACITY);
        }
      }
      const buf = await sharp(tinted, { raw: { width: wmW, height: wmH, channels: 4 } })
        .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      composites.push({
        input: buf,
        top: Math.round(r * SPACING_Y + (Math.random() - 0.5) * JITTER_Y * 2),
        left: Math.round(c * SPACING_X + (Math.random() - 0.5) * JITTER_X * 2),
      });
    }
  }

  const watermarked = await sharp(inputPath).composite(composites).png().toBuffer();
  const imgW = meta.width || 5000, imgH = meta.height || 5000;
  const fontSize = Math.max(Math.round(imgW / 50), 20);
  const warning = '© 北京德明兴利科技有限公司 | hetu-pattern.com | 禁止未授权使用';
  const svg = `<svg width="${imgW}" height="${imgH}"><text x="${imgW - fontSize}" y="${imgH - fontSize}" font-family="Source Han Serif SC, SimSun, serif" font-size="${fontSize}px" fill="white" fill-opacity="0.75" text-anchor="end">${warning}</text></svg>`;

  const ext = path.extname(outputPath).toLowerCase();
  const fmt = ext === '.jpg' || ext === '.jpeg' ? 'jpeg' : 'png';
  await sharp(watermarked)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .withMetadata({
      exif: {
        IFD0: {
          Copyright: '© 2026 河图纹样工作室 · hetu-pattern.com',
          Artist: '河图纹样工作室',
          ImageDescription: '河图纹样工作室 | hetu-pattern.com | 版权保护，禁止未授权使用',
        },
      },
    })
    .toFormat(fmt, fmt === 'jpeg' ? { quality: 90 } : { compressionLevel: 6 })
    .toFile(outputPath);
}

async function processDir(dir, label) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  if (files.length === 0) return;
  console.log(`\n📂 ${label}: ${files.length} 张图`);

  const wmInfo = await sharp(WATERMARK).metadata();
  const { data: wmRaw } = await sharp(WATERMARK)
    .resize(Math.round((wmInfo.width || 150) * SCALE), Math.round((wmInfo.height || 450) * SCALE))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let done = 0;
  for (const file of files) {
    const fp = path.join(dir, file);
    try {
      await processOne(fp, fp, wmInfo, wmRaw);
      done++;
      process.stdout.write(`\r  ${done}/${files.length}`);
    } catch (e) {
      console.error(`\n  ❌ ${file}: ${e.message}`);
    }
  }
  console.log(`\n✅ ${label} 完成`);
}

async function main() {
  console.log('🖋️  河图纹样水印批量处理');
  console.log(`   透明度: ${OPACITY * 100}% | 水印尺寸: ${Math.round(150 * SCALE)}x${Math.round(450 * SCALE)} | 旋转±${MAX_ROTATE}°\n`);
  await processDir(REVIVAL_DIR, 'revival');
  await processDir(INNOVATION_DIR, 'innovation');
  console.log('\n🎉 全部完成');
}

main().catch(console.error);
