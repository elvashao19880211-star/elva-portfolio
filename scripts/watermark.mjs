import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const WATERMARK = path.resolve('_incoming/网站水印图.png');
const ORIGINALS = path.resolve('originals');
const PUBLIC = path.resolve('public/images');

const OPACITY = 0.38;
const SCALE = 1.5;
const SPACING_X = 500;
const SPACING_Y = 800;

async function extractPalette(imgPath, n = 4) {
  const { data } = await sharp(imgPath).resize(20, 20, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const map = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const k = `${Math.round(data[i] / 32) * 32},${Math.round(data[i + 1] / 32) * 32},${Math.round(data[i + 2] / 32) * 32}`;
    map.set(k, (map.get(k) || 0) + 1);
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  return sorted.map(([k]) => k.split(',').map(Number));
}

async function processOne(inputPath, outputPath) {
  const meta = await sharp(inputPath).metadata();
  const palette = await extractPalette(inputPath, 4);
  palette.push([255, 255, 255]); // white

  const wmInfo = await sharp(WATERMARK).metadata();
  const wmW = Math.round((wmInfo.width || 150) * SCALE);
  const wmH = Math.round((wmInfo.height || 450) * SCALE);
  const { data: wmRaw } = await sharp(WATERMARK).resize(wmW, wmH).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const cols = Math.ceil((meta.width || 5000) / SPACING_X) + 1;
  const rows = Math.ceil((meta.height || 5000) / SPACING_Y) + 1;

  const composites = [];
  let ci = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [cr, cg, cb] = palette[ci % palette.length]; ci++;
      const tinted = Buffer.from(wmRaw);
      for (let i = 0; i < tinted.length; i += 4) {
        if (tinted[i + 3] > 0) {
          tinted[i] = cr; tinted[i + 1] = cg; tinted[i + 2] = cb;
          tinted[i + 3] = Math.round(tinted[i + 3] * OPACITY);
        }
      }
      composites.push({
        input: await sharp(tinted, { raw: { width: wmW, height: wmH, channels: 4 } }).png().toBuffer(),
        top: r * SPACING_Y,
        left: c * SPACING_X,
      });
    }
  }

  const watermarked = await sharp(inputPath).composite(composites).png().toBuffer();
  const imgW = meta.width || 5000, imgH = meta.height || 5000;
  const fontSize = Math.max(Math.round(imgW / 50), 20);
  const svg = `<svg width="${imgW}" height="${imgH}"><text x="${imgW - fontSize}" y="${imgH - fontSize}" font-family="Source Han Serif SC, SimSun, serif" font-size="${fontSize}px" fill="white" fill-opacity="0.75" text-anchor="end">© 北京德明兴利科技有限公司 | hetu-pattern.com | 禁止未授权使用</text></svg>`;

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
    .toFormat('png', { compressionLevel: 6 })
    .toFile(outputPath);
}

async function processDir(label) {
  const srcDir = path.join(ORIGINALS, label);
  const outDir = path.join(PUBLIC, label);
  if (!fs.existsSync(srcDir)) return;
  
  const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  if (files.length === 0) return;
  console.log(`\n📂 ${label}: ${files.length} 张`);

  let done = 0;
  for (const file of files) {
    try {
      await processOne(path.join(srcDir, file), path.join(outDir, file));
      done++;
      process.stdout.write(`\r  ${done}/${files.length}`);
    } catch (e) {
      console.error(`\n  ❌ ${file}: ${e.message}`);
    }
  }
  console.log(`\n✅ ${label} 完成`);
}

async function main() {
  console.log(`🖋️  河图纹样水印 · 规整网格\n   透明度 ${OPACITY * 100}% · 间距 ${SPACING_X}x${SPACING_Y} · 自适应5色+白\n`);
  await processDir('revival');
  await processDir('innovation');
  console.log('\n🎉 全部完成');
}

main().catch(console.error);
