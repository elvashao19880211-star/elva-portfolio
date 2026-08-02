// 元代水印重新打标脚本
// 从 revival 目录读取已替换好的原始文件，叠加半透明文字水印
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcDir = path.join(__dirname, '..', 'public', 'images', 'revival');
// 需要处理的元代文件
const yuanFiles = [
  '元代-卐字地龙纹.png',
  '元代-柿蒂窠.png',
  '元代-荷塘鸳鸯纹.png',
  '元代-落花流水纹.png',
  '元代-鸳鸯纹.png',
];

async function addWatermark(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const imgWidth = metadata.width;
    const imgHeight = metadata.height;

    // 水印文字 SVG 叠加，铺满整图
    const fontSize = Math.round(Math.min(imgWidth, imgHeight) * 0.04);
    const spacing = Math.round(fontSize * 4);
    const offsetX = Math.round(fontSize * 0.8);
    const offsetY = Math.round(fontSize * 1.2);

    // 生成平铺的水印 SVG
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

    // 原子替换
    fs.renameSync(outputPath + '.tmp', outputPath);
    console.log(`✅ 水印完成: ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`❌ 失败: ${path.basename(outputPath)}`, err.message);
  }
}

async function main() {
  console.log('开始元代水印重新打标...\n');
  for (const file of yuanFiles) {
    const inputPath = path.join(srcDir, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  跳过（文件不存在）: ${file}`);
      continue;
    }
    await addWatermark(inputPath, inputPath);
  }
  console.log('\n全部完成!');
}

main();
