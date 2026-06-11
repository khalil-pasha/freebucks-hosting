const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputImage = path.join(__dirname, '../public/LOGO 1.png');
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(inputImage)) {
    console.error('Input image not found:', inputImage);
    return;
  }

  const sizes = [16, 32, 48, 64];

  try {
    for (const size of sizes) {
      await sharp(inputImage)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
      console.log(`Generated favicon-${size}x${size}.png`);
    }

    // Generate apple-touch-icon
    await sharp(inputImage)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log(`Generated apple-touch-icon.png`);

    // Generate favicon.ico (just copy the 32x32 for simplicity or save as ico if sharp supports it)
    // Sharp doesn't support writing .ico directly easily, but browsers accept png named as ico,
    // or we can just rely on the layout.tsx 'icons' metadata and copy 32x32 to favicon.ico as a fallback.
    fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
    console.log(`Generated favicon.ico`);
    
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
