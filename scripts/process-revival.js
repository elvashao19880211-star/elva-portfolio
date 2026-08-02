const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const REVIVAL_DIR = 'public/images/revival';
const RAW_DIR = 'public/images/revival_raw';
const THUMBS_DIR = 'public/images/revival/thumbs';

// Step 1: Move originals to raw
if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

const files = fs.readdirSync(REVIVAL_DIR).filter(f => f.endsWith('.png') && !fs.statSync(path.join(REVIVAL_DIR, f)).isDirectory());

console.log(`Moving ${files.length} originals to raw...`);
for (const f of files) {
  fs.renameSync(path.join(REVIVAL_DIR, f), path.join(RAW_DIR, f));
}
console.log('Done.\n');

// Step 2: Create output dirs
if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR, { recursive: true });

// Step 3: Compress
const rawFiles = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.png'));

async function processAll() {
  let totalBefore = 0, totalAfter = 0, totalThumb = 0;

  for (let i = 0; i < rawFiles.length; i++) {
    const f = rawFiles[i];
    const rawPath = path.join(RAW_DIR, f);
    const outPath = path.join(REVIVAL_DIR, f);
    const thumbPath = path.join(THUMBS_DIR, f);
    const rawSize = fs.statSync(rawPath).size;
    totalBefore += rawSize;

    // Compress main image (1200px max dimension)
    await sharp(rawPath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outPath);
    const mainSize = fs.statSync(outPath).size;
    totalAfter += mainSize;

    // Thumbnail (400px max)
    await sharp(rawPath)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 75, compressionLevel: 9 })
      .toFile(thumbPath);
    const thumbSize = fs.statSync(thumbPath).size;
    totalThumb += thumbSize;

    if ((i + 1) % 10 === 0 || i === rawFiles.length - 1) {
      console.log(`[${i + 1}/${rawFiles.length}] ${f} — ${(rawSize/1024/1024).toFixed(1)}MB → ${(mainSize/1024).toFixed(0)}KB (main) + ${(thumbSize/1024).toFixed(0)}KB (thumb)`);
    }
  }

  console.log('\n=== DONE ===');
  console.log(`原图总大小: ${(totalBefore/1024/1024).toFixed(0)}MB`);
  console.log(`大图总大小: ${(totalAfter/1024/1024).toFixed(1)}MB (压缩比 ${((1 - totalAfter/totalBefore)*100).toFixed(0)}%)`);
  console.log(`缩略图总大小: ${(totalThumb/1024/1024).toFixed(1)}MB`);

  // Step 4: Generate data.ts
  console.log('\n生成 data.ts...');
  generateData(rawFiles);
}

function parseFilename(filename) {
  // Format: 朝代-名称.png
  const name = filename.replace('.png', '');
  const dashIdx = name.indexOf('-');
  if (dashIdx === -1) return { dynasty: '', title: name };
  return {
    dynasty: name.slice(0, dashIdx),
    title: name.slice(dashIdx + 1),
  };
}

function generateData(files) {
  const patterns = files.map((f, i) => {
    const { dynasty, title } = parseFilename(f);
    return {
      id: `revival-${i + 1}`,
      title,
      dynasty,
      era: '',
      culture: '',
      elements: [],
      description: '',
      detail: '',
      src: `/images/revival/${f}`,
      thumbSrc: `/images/revival/thumbs/${f}`,
    };
  });

  const ts = `// 复原纹样数据 — 自动生成于 ${new Date().toISOString().slice(0, 10)}
export interface RevivalPattern {
  id: string;
  title: string;
  dynasty: string;
  era?: string;
  culture?: string;
  elements?: string[];
  description: string;
  detail?: string;
  src: string;
  thumbSrc?: string;
}

export const revivalPatterns: RevivalPattern[] = ${JSON.stringify(patterns, null, 2)};
`;

  fs.writeFileSync('app/patterns/revival/data.ts', ts, 'utf-8');
  console.log(`✓ 已生成 ${patterns.length} 条数据`);
}

processAll().catch(e => { console.error(e); process.exit(1); });
