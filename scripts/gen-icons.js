const sharp = require('sharp');
const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#3F9EAC"/>
  <text x="256" y="360" text-anchor="middle" fill="white" font-size="320" font-family="serif" font-weight="700">河</text>
</svg>`;
const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="24" fill="#3F9EAC"/>
  <text x="96" y="135" text-anchor="middle" fill="white" font-size="120" font-family="serif" font-weight="700">河</text>
</svg>`;
Promise.all([
  sharp(Buffer.from(svg512)).png().toFile('public/icon-512.png'),
  sharp(Buffer.from(svg192)).png().toFile('public/icon-192.png'),
]).then(() => console.log('Icons created!'));
