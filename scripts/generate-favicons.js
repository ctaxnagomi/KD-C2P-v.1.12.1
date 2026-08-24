import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('./public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Master vector SVG with high contrast and cyber neon aesthetics
const svgMaster = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#003300" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="1"/>
    </radialGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="cyberGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#39FF14" />
      <stop offset="100%" stop-color="#00CC00" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="#060806" />
  <rect width="512" height="512" rx="100" fill="url(#bgGlow)" />
  
  <!-- Border subtle grid glow -->
  <rect x="16" y="16" width="480" height="480" rx="88" fill="none" stroke="#00FF41" stroke-width="2" stroke-opacity="0.25" />
  <rect x="24" y="24" width="464" height="464" rx="80" fill="none" stroke="#00CC00" stroke-width="1" stroke-opacity="0.1" />

  <!-- Pixel Grid Backdrop Accents -->
  <g opacity="0.08" fill="#00FF41">
    <circle cx="64" cy="64" r="3" />
    <circle cx="128" cy="64" r="3" />
    <circle cx="384" cy="64" r="3" />
    <circle cx="448" cy="64" r="3" />
    <circle cx="64" cy="448" r="3" />
    <circle cx="448" cy="448" r="3" />
  </g>

  <!-- KD Glyph Structure (Centered and Scaled) -->
  <g transform="translate(48, 64) scale(5.2)" filter="url(#neonGlow)">
    <!-- Letter K -->
    <!-- Vertical stem -->
    <rect x="10" y="8" width="6" height="64" fill="url(#cyberGreen)" rx="1" />
    
    <!-- Top branch -->
    <rect x="18" y="34" width="6" height="8" fill="url(#cyberGreen)" rx="1" />
    <rect x="26" y="26" width="6" height="8" fill="url(#cyberGreen)" rx="1" />
    <rect x="34" y="18" width="6" height="8" fill="url(#cyberGreen)" rx="1" />
    <rect x="42" y="10" width="7" height="8" fill="url(#cyberGreen)" rx="1" />
    
    <!-- Bottom branch -->
    <rect x="18" y="42" width="6" height="8" fill="url(#cyberGreen)" rx="1" />
    <rect x="26" y="50" width="6" height="8" fill="url(#cyberGreen)" rx="1" />
    <rect x="34" y="58" width="6" height="8" fill="url(#cyberGreen)" rx="1" />
    <rect x="42" y="64" width="7" height="8" fill="url(#cyberGreen)" rx="1" />

    <!-- Letter D -->
    <!-- Left vertical stem -->
    <rect x="56" y="8" width="6" height="64" fill="url(#cyberGreen)" rx="1" />
    <!-- Top bar -->
    <rect x="62" y="8" width="14" height="6" fill="url(#cyberGreen)" rx="1" />
    <!-- Bottom bar -->
    <rect x="62" y="66" width="14" height="6" fill="url(#cyberGreen)" rx="1" />
    <!-- Right curve / vertical edge -->
    <rect x="76" y="14" width="6" height="52" fill="url(#cyberGreen)" rx="1" />
  </g>
</svg>`;

// Scalable favicon.svg (with transparent background or clean dark background for browsers)
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="kdg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#39FF14" />
      <stop offset="100%" stop-color="#00CC00" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#050505"/>
  <rect x="2" y="2" width="96" height="96" rx="18" fill="none" stroke="#00CC00" stroke-width="1.5" stroke-opacity="0.3"/>
  <g fill="url(#kdg)">
    <!-- K -->
    <rect x="14" y="18" width="8" height="64" rx="1"/>
    <rect x="24" y="44" width="7" height="8" rx="1"/>
    <rect x="33" y="34" width="7" height="8" rx="1"/>
    <rect x="42" y="24" width="7" height="8" rx="1"/>
    <rect x="51" y="18" width="8" height="8" rx="1"/>
    
    <rect x="24" y="52" width="7" height="8" rx="1"/>
    <rect x="33" y="60" width="7" height="8" rx="1"/>
    <rect x="42" y="68" width="7" height="8" rx="1"/>
    <rect x="51" y="74" width="8" height="8" rx="1"/>

    <!-- D -->
    <rect x="65" y="18" width="8" height="64" rx="1"/>
    <rect x="73" y="18" width="12" height="7" rx="1"/>
    <rect x="73" y="75" width="12" height="7" rx="1"/>
    <rect x="85" y="25" width="7" height="50" rx="1"/>
  </g>
</svg>`;

// Maskable icon SVG (with safe margin for Android adaptive launcher icons)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlowM" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#003300" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="1"/>
    </radialGradient>
    <filter id="neonGlowM" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="cyberGreenM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#39FF14" />
      <stop offset="100%" stop-color="#00CC00" />
    </linearGradient>
  </defs>
  
  <!-- Solid background extending to edges for maskable adaptive icons -->
  <rect width="512" height="512" fill="#060806" />
  <rect width="512" height="512" fill="url(#bgGlowM)" />

  <!-- Center safe zone KD Glyph -->
  <g transform="translate(100, 110) scale(3.9)" filter="url(#neonGlowM)">
    <!-- Letter K -->
    <rect x="10" y="8" width="6" height="64" fill="url(#cyberGreenM)" rx="1" />
    <rect x="18" y="34" width="6" height="8" fill="url(#cyberGreenM)" rx="1" />
    <rect x="26" y="26" width="6" height="8" fill="url(#cyberGreenM)" rx="1" />
    <rect x="34" y="18" width="6" height="8" fill="url(#cyberGreenM)" rx="1" />
    <rect x="42" y="10" width="7" height="8" fill="url(#cyberGreenM)" rx="1" />
    
    <rect x="18" y="42" width="6" height="8" fill="url(#cyberGreenM)" rx="1" />
    <rect x="26" y="50" width="6" height="8" fill="url(#cyberGreenM)" rx="1" />
    <rect x="34" y="58" width="6" height="8" fill="url(#cyberGreenM)" rx="1" />
    <rect x="42" y="64" width="7" height="8" fill="url(#cyberGreenM)" rx="1" />

    <!-- Letter D -->
    <rect x="56" y="8" width="6" height="64" fill="url(#cyberGreenM)" rx="1" />
    <rect x="62" y="8" width="14" height="6" fill="url(#cyberGreenM)" rx="1" />
    <rect x="62" y="66" width="14" height="6" fill="url(#cyberGreenM)" rx="1" />
    <rect x="76" y="14" width="6" height="52" fill="url(#cyberGreenM)" rx="1" />
  </g>
</svg>`;

async function generateAllIcons() {
  console.log('Generating favicon and app icons...');

  // 1. Write SVG icons
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon-master.svg'), svgMaster, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'safari-pinned-tab.svg'), svgFavicon, 'utf8');

  const svgBuffer = Buffer.from(svgMaster);
  const svgFaviconBuffer = Buffer.from(svgFavicon);
  const svgMaskableBuffer = Buffer.from(svgMaskable);

  // 2. Generate standard PNG favicons
  await sharp(svgFaviconBuffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(svgFaviconBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(svgFaviconBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));

  // 3. Generate Apple Touch Icon for iOS Mobile (180x180 and fallback sizes)
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'));
  await sharp(svgBuffer).resize(152, 152).png().toFile(path.join(publicDir, 'apple-touch-icon-152x152.png'));
  await sharp(svgBuffer).resize(167, 167).png().toFile(path.join(publicDir, 'apple-touch-icon-167x167.png'));

  // 4. Generate Android Chrome Icons (192x192, 512x512, and maskable)
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  await sharp(svgMaskableBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'android-chrome-maskable-192x192.png'));
  await sharp(svgMaskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'android-chrome-maskable-512x512.png'));

  // 5. Windows / Microsoft Tile Icons
  await sharp(svgBuffer).resize(150, 150).png().toFile(path.join(publicDir, 'mstile-150x150.png'));
  await sharp(svgBuffer).resize(310, 310).png().toFile(path.join(publicDir, 'mstile-310x310.png'));

  // 6. Generate favicon.ico (using 32x32 / 48x48)
  // For favicon.ico in modern web, writing a 32x32/48x48 PNG or ICO buffer works reliably across all browsers
  const ico32Buffer = await sharp(svgFaviconBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32Buffer);

  // 7. Write site.webmanifest and manifest.json for Android and PWA
  const manifest = {
    name: "KD | MVP Synthesizer",
    short_name: "KD Synthesizer",
    description: "Convert repositories into structured MVP showcases with tech stacks, funding integrations, and contributor management.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#00CC00",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  // 8. Write browserconfig.xml for Windows / Edge tiles
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <square310x310logo src="/mstile-310x310.png"/>
            <TileColor>#050505</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
  fs.writeFileSync(path.join(publicDir, 'browserconfig.xml'), browserConfig, 'utf8');

  console.log('All favicon and mobile app assets generated successfully in /public!');
}

generateAllIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
