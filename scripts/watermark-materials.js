// 素材库水印打标脚本
// 给 public/images/materials/ 下所有图片叠加"河图"半透明水印
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcDir = path.join(__dirname, '..', 'public', 'images', 'materials');

const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

async function addWatermark(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const imgWidth = metadata.width;
    const imgHeight = metadata.height;

    const fontSize = Math.round(Math.min(imgWidth, imgHeight) * 0.04);
    const spacing = Math.round(fontSize * 4);
    const offsetY = Math.round(fontSize * 1.2);

    const cols = Math.ceil(imgWidth / spacing) + 1;
    const rows = Math.ceil(imgHeight / spacing) + 1;

    let textElements = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing;
        const y = row * spacing + offsetY;
        textElements += `<text x="${x}" y="${y}" font-size="${fontSize}" fill="rgba(255,255,255,0.12)" font-family="sans-serif">河图</text>`;
      }
    }

    const watermarkSvg = `<svg width="${imgWidth}" height="${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${textElements}
    </svg>`;

    await image
      .composite([{ input: Buffer.from(watermarkSvg), top: 0, left: 0 }])
      .png()
      .toFile(outputPath + '.tmp');

    fs.renameSync(outputPath + '.tmp', outputPath);
    console.log(`✅ ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`❌ ${path.basename(outputPath)}:`, err.message);
  }
}

async function main() {
  console.log(`素材库水印打标，共 ${files.length} 张...\n`);
  for (const file of files) {
    await addWatermark(path.join(srcDir, file), path.join(srcDir, file));
  }
  console.log(`\n全部完成! ${files.length} 张已打标。`);
}

main();
