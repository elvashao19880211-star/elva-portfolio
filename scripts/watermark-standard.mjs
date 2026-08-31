// ============================================================
// 标准打标脚本 v7（2026-08-31 Elva 验收通过，永久保存）
// 用法: node scripts/watermark-standard.mjs <原图路径> <输出路径>
//   例: node scripts/watermark-standard.mjs _originals/innovation/球路杂宝龙纹.png public/images/innovation/球路杂宝龙纹.webp
// 参数: 水印85x358 / 多色板(白+深蓝+红+深绿+原图4色) / alpha*0.6 / 密集交错250x350 / 旋转-18~8°
// ============================================================
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const WATERMARK = path.resolve(root, '_incoming/网站水印图.png');

// ===== 最终定稿参数 =====
const WM_W = 85;
const WM_H = 358;
const ALPHA_WEAKEN = 0.6;
const SPACING_X = 250;
const SPACING_Y = 350;
const ROTATE_MIN = -18;
const ROTATE_MAX = 8;
const MAX_DIM = 1600;
const WEBP_QUALITY = 85;

// 多色板：白 + 深色系 + 原图色
const EXTRA_COLORS = [
  [255, 255, 255],
  [40, 60, 130],
  [190, 60, 50],
  [30, 100, 60],
];

async function extractPalette(img, n = 4) {
  const { data } = await sharp(img).resize(24, 24, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const map = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const k = `${Math.round(data[i] / 24) * 24},${Math.round(data[i + 1] / 24) * 24},${Math.round(data[i + 2] / 24) * 24}`;
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
  const img = await pre.png().toBuffer();
  const meta = await sharp(img).metadata();

  // 2. 色板
  const palette = await extractPalette(img, 4);
  const fullPalette = [...EXTRA_COLORS, ...palette];

  // 3. 水印图
  const { data: wmRaw } = await sharp(WATERMARK).resize(WM_W, WM_H).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // 4. 密集交错 + 旋转 + 循环换色 + 弱化alpha
  const cols = Math.ceil(meta.width / SPACING_X) + 2;
  const rows = Math.ceil(meta.height / SPACING_Y) + 2;
  const composites = [];
  let ci = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offX = (r % 2 === 1) ? SPACING_X / 2 : 0;
      const x = c * SPACING_X + offX;
      const y = r * SPACING_Y;
      const [cr, cg, cb] = fullPalette[ci % fullPalette.length]; ci++;
      const tinted = Buffer.from(wmRaw);
      for (let i = 0; i < tinted.length; i += 4) {
        if (tinted[i + 3] > 0) {
          tinted[i] = cr; tinted[i + 1] = cg; tinted[i + 2] = cb;
          tinted[i + 3] = Math.round(tinted[i + 3] * ALPHA_WEAKEN);
        }
      }
      const angle = ROTATE_MIN + ((r * 7 + c * 13) % (ROTATE_MAX - ROTATE_MIN + 1));
      const rotBuf = await sharp(tinted, { raw: { width: WM_W, height: WM_H, channels: 4 } })
        .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      composites.push({ input: rotBuf, top: y, left: x });
    }
  }

  // 5. 合成 + webp
  await sharp(img).composite(composites).webp({ quality: WEBP_QUALITY }).toFile(OUTPUT);
  console.log('✅', OUTPUT, Math.round(fs.statSync(OUTPUT).size / 1024) + 'KB');
  console.log('   水印', WM_W + 'x' + WM_H, '· alpha×' + ALPHA_WEAKEN, '· 间距', SPACING_X + 'x' + SPACING_Y, '·', composites.length + '枚');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
