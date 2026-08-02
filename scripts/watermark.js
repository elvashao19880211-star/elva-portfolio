/**
 * watermark.js - 批量给 images/revival + images/revival/thumbs + images/innovation 添加斜铺水印
 * 
 * 用法:
 *   node scripts/watermark.js          # 跑全部
 *   node scripts/watermark.js 5        # 测试：只跑 revival 前 5 张（含 thumbs）
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');

// 要处理的目录对: [大图目录, 对应缩略图目录]
const DIRS = [
  { label: 'revival',       dir: path.join(ROOT, 'public', 'images', 'revival') },
  { label: 'revival/thumbs',dir: path.join(ROOT, 'public', 'images', 'revival', 'thumbs') },
  { label: 'innovation',    dir: path.join(ROOT, 'public', 'images', 'innovation') },
];

const WATERMARK_TEXT = 'hetu-pattern.com';
const OPACITY = 0.15;
const ROTATION = -30;
const FONT_RATIO = 1 / 15;  // 字号 = 图片宽 / 15

function createSvg(width, height, fontSize) {
  const sp = Math.round(fontSize * 2.5);  // 间距
  const rows = Math.ceil(height / sp) + 4;
  const cols = Math.ceil(width / sp) + 4;
  let texts = '';
  for (let r = -2; r < rows; r++) {
    for (let c = -2; c < cols; c++) {
      const x = c * sp;
      const y = r * sp + (c % 2) * (sp * 0.5); // 交错排列
      texts += `<text x="${x}" y="${y}" font-size="${fontSize}px" font-family="Arial,sans-serif" font-weight="bold" fill="white" fill-opacity="${OPACITY}" transform="rotate(${ROTATION},${x},${y})">${WATERMARK_TEXT}</text>`;
    }
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${texts}</svg>`);
}

async function processFile(filePath) {
  const meta = await sharp(filePath).metadata();
  const fontSize = Math.max(16, Math.round(meta.width * FONT_RATIO));
  const svg = createSvg(meta.width, meta.height, fontSize);
  const out = await sharp(filePath).composite([{ input: svg, blend: 'over' }]).toBuffer();
  fs.writeFileSync(filePath, out);
  return { name: path.basename(filePath), w: meta.width, h: meta.height, fontSize };
}

async function main() {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : null;
  let totalOk = 0, totalFail = 0;

  for (const { label, dir } of DIRS) {
    let files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    files.sort();
    
    if (limit && label.startsWith('revival')) {
      // 限制模式：只处理 revival 的前 N 张（不含 thumbs）
      if (label === 'revival') files = files.slice(0, limit);
      else continue; // 跳过 thumbs
    }

    console.log(`\n📁 ${label} (${dir}) — ${files.length} 张`);
    
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      process.stdout.write(`  [${i+1}/${files.length}] ${f}...`);
      try {
        const r = await processFile(path.join(dir, f));
        console.log(`✅ ${r.w}x${r.h} (字号${r.fontSize})`);
        ok++;
      } catch (e) {
        console.log(`❌ ${e.message}`);
        fail++;
      }
    }
    console.log(`  → ${label}: 成功 ${ok}, 失败 ${fail}`);
    totalOk += ok;
    totalFail += fail;
    
    if (limit) break; // 测试模式只跑 revival 前 N 张
  }

  console.log(`\n🎉 全部完成！总计: 成功 ${totalOk}, 失败 ${totalFail}`);
}

main().catch(e => { console.error(e); process.exit(1); });
