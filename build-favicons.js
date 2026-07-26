const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const masterImage = path.join(__dirname, 'assets', 'android-chrome-512x512.png');

async function buildIcons() {
  console.log('Generating icons from master image...');

  // 1. Generate PNGs of various sizes
  const sizes = [16, 32, 48, 96, 180, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    pngBuffers[size] = await sharp(masterImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  // 2. Write PNGs to assets folder
  fs.writeFileSync(path.join(__dirname, 'assets', 'favicon-16x16.png'), pngBuffers[16]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'favicon-32x32.png'), pngBuffers[32]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon-48x48.png'), pngBuffers[48]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'favicon-96x96.png'), pngBuffers[96]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'apple-touch-icon.png'), pngBuffers[180]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'android-chrome-192x192.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'android-chrome-512x512.png'), pngBuffers[512]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon.png'), pngBuffers[192]); // 192x192 high quality icon.png

  // 3. Generate multi-resolution favicon.ico (16, 32, 48)
  const icoBuffer = await toIco([pngBuffers[16], pngBuffers[32], pngBuffers[48]]);
  fs.writeFileSync(path.join(__dirname, 'assets', 'favicon.ico'), icoBuffer);

  // 4. Also copy primary root icons to project root for standard crawler access (/favicon.ico, /icon.png, /apple-touch-icon.png, /icon-48x48.png)
  fs.writeFileSync(path.join(__dirname, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, 'icon.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(__dirname, 'icon-48x48.png'), pngBuffers[48]);
  fs.writeFileSync(path.join(__dirname, 'apple-touch-icon.png'), pngBuffers[180]);

  console.log('All icons generated successfully!');
}

buildIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
