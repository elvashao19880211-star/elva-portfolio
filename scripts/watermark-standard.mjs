// ============================================================
// 标准打标脚本（永久保存，勿删）—— 上架新纹样统一用这个
// 手写水印图 + 45%透明度 + 500x800交错网格 + 多色 + 角标 + EXIF
// 用法: node scripts/watermark-standard.mjs <原图路径> <输出路径>
//   例: node scripts/watermark-standard.mjs _originals/innovation/球路杂宝龙纹.png public/images/innovation/球路杂宝龙纹.webp
// ============================================================
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const WATERMARK = path.resolve(root, '_incoming/网站水印图.png');

// ===== 参数（2026-08-31 Elva 定稿：原1.5 小两个字号 = 1.2） =====
const OPACITY = 0.45;
const SCALE = 1.2;
const SPACING_X = 500;
const SPACING_Y = 800;
const MAX_DIM = 1600;      // 输出最长边
const WEBP_QUALITY = 82;

async function extractPalette(img, n = 4) {
  const { data } = await sharp(img).resize(20, 20, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const map = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const k = `${Math.round(data[i] / 32) * 32},${Math.round(data[i + 1] / 32) * 32},${Math.round(data[i + 2] / 32) * 32}`;
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k.split(',').map(Number));
}

async function main() {
  const INPUT = path.resolve(root, process.argv[2]);
  const OUTPUT = path.resolve(root, process.argv[3]);

  if (!fs.existsSync(INPUT)) { console.error('❌ 原图不存在:', INPUT); process.exit(1); }

  // 1. 缩放
  const srcMeta = await sharp(INPUT).metadata();
  let pre = sharp(INPUT);
  if (srcMeta.width > MAX_DIM || srcMeta.height > MAX_DIM) {
    pre = srcMeta.width >= srcMeta.height ? pre.resize({ width: MAX_DIM }) : pre.resize({ height: MAX_DIM });
  }
  const resizedBuf = await pre.png().toBuffer();
  const meta = await sharp(resizedBuf).metadata();

  // 2. 提取主色 + 白×2
  const palette = await extractPalette(resizedBuf, 4);
  palette.push([255, 255, 255]);
  palette.push([255, 255, 255]);

  // 3. 水印图缩放
  const wmInfo = await sharp(WATERMARK).metadata();
  const wmW = Math.round((wmInfo.width || 150) * SCALE);
  const wmH = Math.round((wmInfo.height || 450) * SCALE);
  const { data: wmRaw } = await sharp(WATERMARK).resize(wmW, wmH).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // 4. 交错平铺
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

  // 5. 合成 + 角标 + EXIF + webp
  const imgW = meta.width, imgH = meta.height;
  const fontSize = Math.max(Math.round(imgW / 50), 20);
  const svg = `<svg width="${imgW}" height="${imgH}"><text x="${imgW - fontSize}" y="${imgH - fontSize}" font-family="Source Han Serif SC, SimSun, serif" font-size="${fontSize}px" fill="white" fill-opacity="0.75" text-anchor="end">© 北京德明兴利科技有限公司 | hetu-pattern.com | 禁止未授权使用</text></svg>`;

  await sharp(resizedBuf)
    .composite(composites)
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
    .webp({ quality: WEBP_QUALITY })
    .toFile(OUTPUT);

  console.log('✅', OUTPUT);
  console.log('   ', imgW + 'x' + imgH, Math.round(fs.statSync(OUTPUT).size / 1024) + 'KB');
  console.log('   水印', wmW + 'x' + wmH, '透明度', OPACITY * 100 + '%', '间距', SPACING_X + 'x' + SPACING_Y);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
