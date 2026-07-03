

// ----- 水印打标（内联版本，避免依赖外部模块） -----
async function addWatermarks() {
  const watermarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80">
    <text x="100" y="55" text-anchor="middle" font-size="28" fill="rgba(255,255,255,0.15)" font-family="sans-serif">河图</text>
  </svg>`;
  const watermarkBuf = Buffer.from(watermarkSvg);

  const files = fs.readdirSync(IMG_DIR).filter(f => /\\.(png|jpg|jpeg)$/i.test(f));
  for (const file of files) {
    try {
      const imgPath = path.join(IMG_DIR, file);
      const metadata = await sharp(imgPath).metadata();
      await sharp(imgPath)
        .composite([{
          input: watermarkBuf,
          top: 0, left: 0,
          tile: true,
          blend: 'over',
        }])
        .png()
        .toFile(imgPath + '.tmp');
      fs.renameSync(imgPath + '.tmp', imgPath);
    } catch (err) {
      console.error(`  ❌ 打标失败 ${file}:`, err.message);
    }
  }
  console.log(`✅ 打标完成！${files.length} 张已处理。`);
}
