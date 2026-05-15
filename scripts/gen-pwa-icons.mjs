/**
 * Genera los iconos PWA de Propaily a partir del glifo "P" de la marca.
 * Salida: public/icons/*.png. Correr con `node scripts/gen-pwa-icons.mjs`.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Glifo "P" de Propaily (PropailyMark, viewBox 0 0 38 68).
const GLYPH =
  "M0,35.26c0-11.97,8.08-19.11,18.96-19.11s19.25,7.71,19.25,19.18c0,12.4-9.23,18.31-17.3,18.31-4.25,0-7.86-1.66-10.09-4.83v19.11H0v-32.66ZM27.25,34.9c0-5.12-3.32-8.65-8.22-8.65s-8.22,3.53-8.22,8.65,3.32,8.65,8.22,8.65,8.22-3.53,8.22-8.65Z";

const PURPLE = "#6E3AFF";

/** SVG: cuadro morado + glifo blanco centrado. `glyphH` = alto del glifo en px. */
function iconSvg({ size, rx, glyphH }) {
  const scale = glyphH / 68;
  const w = 38 * scale;
  const x = (size - w) / 2;
  const y = (size - glyphH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${PURPLE}"/>
  <g transform="translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${scale.toFixed(4)})">
    <path fill="#ffffff" d="${GLYPH}"/>
  </g>
</svg>`;
}

const ICONS = [
  // "any" — esquinas redondeadas suaves.
  { file: "icon-192.png", size: 192, rx: 42, glyphH: 104 },
  { file: "icon-512.png", size: 512, rx: 112, glyphH: 280 },
  // "maskable" — sin redondeo (lo aplica el SO), glifo dentro de la zona segura.
  { file: "icon-maskable-512.png", size: 512, rx: 0, glyphH: 220 },
  // apple-touch-icon — cuadro completo, iOS aplica su propio recorte.
  { file: "apple-touch-icon-180.png", size: 180, rx: 0, glyphH: 100 },
];

await mkdir("public/icons", { recursive: true });
for (const { file, ...cfg } of ICONS) {
  await sharp(Buffer.from(iconSvg(cfg))).png().toFile(`public/icons/${file}`);
  console.log("✓ public/icons/" + file);
}
