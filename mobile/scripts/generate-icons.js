import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../assets');

// 1. Full Icon SVG (1024x1024)
const fullIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <defs>
    <radialGradient id="dawnBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.95" />
      <stop offset="60%" stop-color="#FDF9F1" stop-opacity="1" />
      <stop offset="100%" stop-color="#FDF9F1" stop-opacity="1" />
    </radialGradient>

    <radialGradient id="sunAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.38" />
      <stop offset="60%" stop-color="#FCD34D" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#FDF9F1" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="sunCore" cx="36%" cy="34%" r="66%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#FFFBEB" />
      <stop offset="55%" stop-color="#FDE68A" />
      <stop offset="80%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </radialGradient>

    <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>

    <filter id="softBloom" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Container Base -->
  <rect width="1024" height="1024" rx="230" fill="url(#dawnBg)" />

  <!-- Ambient Breathing Sun Glow -->
  <circle cx="512" cy="512" r="420" fill="url(#sunAura)" />
  <circle cx="512" cy="512" r="320" fill="url(#sunAura)" opacity="0.8" />

  <!-- 12 Illuminating Solar Rays -->
  <!-- Cardinal Rays -->
  <line x1="512" y1="332" x2="512" y2="176" stroke="url(#rayGrad)" stroke-width="36" stroke-linecap="round" />
  <line x1="512" y1="692" x2="512" y2="848" stroke="url(#rayGrad)" stroke-width="36" stroke-linecap="round" />
  <line x1="332" y1="512" x2="176" y2="512" stroke="url(#rayGrad)" stroke-width="36" stroke-linecap="round" />
  <line x1="692" y1="512" x2="848" y2="512" stroke="url(#rayGrad)" stroke-width="36" stroke-linecap="round" />

  <!-- Diagonal Rays (45 deg) -->
  <line x1="384.6" y1="384.6" x2="274.4" y2="274.4" stroke="url(#rayGrad)" stroke-width="28" stroke-linecap="round" />
  <line x1="639.4" y1="384.6" x2="749.6" y2="274.4" stroke="url(#rayGrad)" stroke-width="28" stroke-linecap="round" />
  <line x1="384.6" y1="639.4" x2="274.4" y2="749.6" stroke="url(#rayGrad)" stroke-width="28" stroke-linecap="round" />
  <line x1="639.4" y1="639.4" x2="749.6" y2="749.6" stroke="url(#rayGrad)" stroke-width="28" stroke-linecap="round" />

  <!-- Sub-Intermediate Rays (30 / 60 deg) -->
  <line x1="422" y1="356" x2="354" y2="238" stroke="url(#rayGrad)" stroke-width="22" stroke-linecap="round" opacity="0.9" />
  <line x1="602" y1="356" x2="670" y2="238" stroke="url(#rayGrad)" stroke-width="22" stroke-linecap="round" opacity="0.9" />
  <line x1="422" y1="668" x2="354" y2="786" stroke="url(#rayGrad)" stroke-width="22" stroke-linecap="round" opacity="0.9" />
  <line x1="602" y1="668" x2="670" y2="786" stroke="url(#rayGrad)" stroke-width="22" stroke-linecap="round" opacity="0.9" />

  <!-- Radiant Illuminating Sun Core -->
  <circle cx="512" cy="512" r="204" fill="url(#sunCore)" filter="url(#softBloom)" />
  <circle cx="512" cy="512" r="190" stroke="#FFFFFF" stroke-width="10" stroke-opacity="0.65" fill="none" />
</svg>
`;

// 2. Android Adaptive Foreground SVG (1024x1024 with transparent background and icon within 66% safe zone)
const adaptiveForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <defs>
    <radialGradient id="sunAuraFg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.3" />
      <stop offset="70%" stop-color="#FCD34D" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="sunCoreFg" cx="36%" cy="34%" r="66%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#FFFBEB" />
      <stop offset="55%" stop-color="#FDE68A" />
      <stop offset="80%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </radialGradient>

    <linearGradient id="rayGradFg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>
  </defs>

  <!-- Ambient Glow within safe zone -->
  <circle cx="512" cy="512" r="320" fill="url(#sunAuraFg)" />

  <!-- 12 Illuminating Solar Rays within 432dp safe zone -->
  <line x1="512" y1="368" x2="512" y2="248" stroke="url(#rayGradFg)" stroke-width="32" stroke-linecap="round" />
  <line x1="512" y1="656" x2="512" y2="776" stroke="url(#rayGradFg)" stroke-width="32" stroke-linecap="round" />
  <line x1="368" y1="512" x2="248" y2="512" stroke="url(#rayGradFg)" stroke-width="32" stroke-linecap="round" />
  <line x1="656" y1="512" x2="776" y2="512" stroke="url(#rayGradFg)" stroke-width="32" stroke-linecap="round" />

  <!-- Diagonals -->
  <line x1="410" y1="410" x2="324" y2="324" stroke="url(#rayGradFg)" stroke-width="24" stroke-linecap="round" />
  <line x1="614" y1="410" x2="700" y2="324" stroke="url(#rayGradFg)" stroke-width="24" stroke-linecap="round" />
  <line x1="410" y1="614" x2="324" y2="700" stroke="url(#rayGradFg)" stroke-width="24" stroke-linecap="round" />
  <line x1="614" y1="614" x2="700" y2="700" stroke="url(#rayGradFg)" stroke-width="24" stroke-linecap="round" />

  <!-- Intermediates -->
  <line x1="440" y1="388" x2="388" y2="296" stroke="url(#rayGradFg)" stroke-width="18" stroke-linecap="round" opacity="0.9" />
  <line x1="584" y1="388" x2="636" y2="296" stroke="url(#rayGradFg)" stroke-width="18" stroke-linecap="round" opacity="0.9" />
  <line x1="440" y1="636" x2="388" y2="728" stroke="url(#rayGradFg)" stroke-width="18" stroke-linecap="round" opacity="0.9" />
  <line x1="584" y1="636" x2="636" y2="728" stroke="url(#rayGradFg)" stroke-width="18" stroke-linecap="round" opacity="0.9" />

  <!-- Core Illuminating Sphere -->
  <circle cx="512" cy="512" r="160" fill="url(#sunCoreFg)" />
  <circle cx="512" cy="512" r="150" stroke="#FFFFFF" stroke-width="8" stroke-opacity="0.65" fill="none" />
</svg>
`;

// 3. Android Adaptive Background SVG (1024x1024)
const adaptiveBackgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.9" />
    <stop offset="70%" stop-color="#FDF9F1" stop-opacity="1" />
    <stop offset="100%" stop-color="#FDF9F1" stop-opacity="1" />
  </radialGradient>
  <rect width="1024" height="1024" fill="url(#bgGrad)" />
</svg>
`;

// 4. Android Adaptive Monochrome SVG (1024x1024)
const adaptiveMonochromeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <!-- 12 Solar Rays -->
  <line x1="512" y1="368" x2="512" y2="248" stroke="#000000" stroke-width="32" stroke-linecap="round" />
  <line x1="512" y1="656" x2="512" y2="776" stroke="#000000" stroke-width="32" stroke-linecap="round" />
  <line x1="368" y1="512" x2="248" y2="512" stroke="#000000" stroke-width="32" stroke-linecap="round" />
  <line x1="656" y1="512" x2="776" y2="512" stroke="#000000" stroke-width="32" stroke-linecap="round" />

  <!-- Diagonals -->
  <line x1="410" y1="410" x2="324" y2="324" stroke="#000000" stroke-width="24" stroke-linecap="round" />
  <line x1="614" y1="410" x2="700" y2="324" stroke="#000000" stroke-width="24" stroke-linecap="round" />
  <line x1="410" y1="614" x2="324" y2="700" stroke="#000000" stroke-width="24" stroke-linecap="round" />
  <line x1="614" y1="614" x2="700" y2="700" stroke="#000000" stroke-width="24" stroke-linecap="round" />

  <!-- Core Sphere -->
  <circle cx="512" cy="512" r="160" fill="#000000" />
</svg>
`;

async function generateAllAssets() {
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('☀️ Generating high-resolution Illuminating Sun app assets...');

  // 1. icon.png (1024x1024)
  await sharp(Buffer.from(fullIconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('✓ mobile/assets/icon.png generated (1024x1024)');

  // 2. android-icon-foreground.png (1024x1024)
  await sharp(Buffer.from(adaptiveForegroundSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'android-icon-foreground.png'));
  console.log('✓ mobile/assets/android-icon-foreground.png generated (1024x1024)');

  // 3. android-icon-background.png (1024x1024)
  await sharp(Buffer.from(adaptiveBackgroundSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'android-icon-background.png'));
  console.log('✓ mobile/assets/android-icon-background.png generated (1024x1024)');

  // 4. android-icon-monochrome.png (1024x1024)
  await sharp(Buffer.from(adaptiveMonochromeSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'android-icon-monochrome.png'));
  console.log('✓ mobile/assets/android-icon-monochrome.png generated (1024x1024)');

  // 5. splash-icon.png (1024x1024)
  await sharp(Buffer.from(adaptiveForegroundSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✓ mobile/assets/splash-icon.png generated (1024x1024)');

  // 6. favicon.png (192x192)
  await sharp(Buffer.from(fullIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✓ mobile/assets/favicon.png generated (192x192)');

  console.log('🎉 All mobile Illuminating Sun assets successfully generated!');
}

generateAllAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
