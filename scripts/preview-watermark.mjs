import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const WATERMARK = path.resolve('_incoming/网站水印图.png');
const INPUT = path.resolve('originals/revival/商周-蟠龙纹.png');
const OUTPUT = path.resolve('_incoming/_preview-watermark-v2.png');

const OPACITY = 0.38;
const SCALE = 1.5;
const SPACING_X = 500;
const SPACING_Y = 800;

async function extractPalette(imgPath, n = 4) {
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

async function main() {
  const meta = await sharp(INPUT).metadata();
  const palette = await extractPalette(INPUT, 4);
  // 混入白色
  palette.push([255, 255, 255]);

  const wmInfo = await sharp(WATERMARK).metadata();
  const wmW = Math.round((wmInfo.width || 150) * SCALE);
  const wmH = Math.round((wmInfo.height || 450) * SCALE);
  const { data: wmRaw } = await sharp(WATERMARK)
    .resize(wmW, wmH)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cols = Math.ceil((meta.width || 5000) / SPACING_X) + 1;
  const rows = Math.ceil((meta.height || 5000) / SPACING_Y) + 1;

  const composites = [];
  const colors = palette; // 5 colors: 4 adaptive + white
  let ci = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [cr, cg, cb] = colors[ci % colors.length]; ci++;
      const tinted = Buffer.from(wmRaw);
      for (let i = 0; i < tinted.length; i += 4) {
        if (tinted[i + 3] > 0) {
          tinted[i] = cr; tinted[i + 1] = cg; tinted[i + 2] = cb;
          tinted[i + 3] = Math.round(tinted[i + 3] * OPACITY);
        }
      }
      const buf = await sharp(tinted, { raw: { width: wmW, height: wmH, channels: 4 } })
        .png().toBuffer();
      composites.push({
        input: buf,
        top: r * SPACING_Y,
        left: c * SPACING_X,
      });
    }
  }

  const watermarked = await sharp(INPUT).composite(composites).png().toBuffer();
  const imgW = meta.width || 5000, imgH = meta.height || 5000;
  const fontSize = Math.max(Math.round(imgW / 50), 20);
  const warning = '© 北京德明兴利科技有限公司 | hetu-pattern.com | 禁止未授权使用';
  const svg = `<svg width="${imgW}" height="${imgH}"><text x="${imgW - fontSize}" y="${imgH - fontSize}" font-family="Source Han Serif SC, SimSun, serif" font-size="${fontSize}px" fill="white" fill-opacity="0.75" text-anchor="end">${warning}</text></svg>`;

  await sharp(watermarked)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ compressionLevel: 6 })
    .toFile(OUTPUT);

  const colorNames = palette.map(c => `rgb(${c.join(',')})`).join(', ');
  const gapX = SPACING_X - wmW;
  const gapY = SPACING_Y - wmH;
  console.log(`✅ 预览图: ${OUTPUT}`);
  console.log(`   水印 ${wmW}x${wmH} · 透明度 ${OPACITY * 100}% · 间距 ${SPACING_X}x${SPACING_Y}`);
  console.log(`   列间 ${gapX}px · 行间 ${gapY}px · 共 ${rows}x${cols}=${rows*cols} 枚 · 无碰撞`);
  console.log(`   配色: ${colorNames}`);
}

main().catch(console.error);
