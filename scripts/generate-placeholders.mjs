import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "placeholders");
mkdirSync(outDir, { recursive: true });

const brandColors = {
  ASUS: ["#0f172a", "#dc2626"],
  Acer: ["#0f172a", "#16a34a"],
  Lenovo: ["#0f172a", "#e11d48"],
  HP: ["#0f172a", "#2563eb"],
  MSI: ["#0f172a", "#ea580c"],
  Dell: ["#0f172a", "#2563eb"],
  Microsoft: ["#0f172a", "#059669"],
};

const products = [
  { slug: "asus-rog-strix-g16", name: "ASUS ROG Strix G16", brand: "ASUS" },
  { slug: "acer-nitro-v-15", name: "Acer Nitro V 15", brand: "Acer" },
  { slug: "lenovo-loq-15", name: "Lenovo LOQ 15", brand: "Lenovo" },
  { slug: "hp-victus-15", name: "HP Victus 15", brand: "HP" },
  { slug: "msi-cyborg-15", name: "MSI Cyborg 15", brand: "MSI" },
  { slug: "dell-g15-5530", name: "Dell G15 5530", brand: "Dell" },
  { slug: "asus-tuf-a15", name: "ASUS TUF Gaming A15", brand: "ASUS" },
  { slug: "acer-predator-helios-neo-16", name: "Acer Predator Helios Neo 16", brand: "Acer" },
  { slug: "dell-latitude-7400", name: "Dell Latitude 7400", brand: "Dell" },
  { slug: "lenovo-thinkpad-t470", name: "Lenovo ThinkPad T470", brand: "Lenovo" },
  { slug: "hp-elitebook-840-g5", name: "HP EliteBook 840 G5", brand: "HP" },
  { slug: "dell-latitude-5300", name: "Dell Latitude 5300", brand: "Dell" },
  { slug: "lenovo-thinkpad-x1-carbon-g6", name: "Lenovo ThinkPad X1 Carbon Gen 6", brand: "Lenovo" },
  { slug: "hp-probook-450-g6", name: "HP ProBook 450 G6", brand: "HP" },
  { slug: "dell-latitude-7480", name: "Dell Latitude 7480", brand: "Dell" },
  { slug: "lenovo-thinkpad-t480", name: "Lenovo ThinkPad T480", brand: "Lenovo" },
  { slug: "hp-elitebook-830-g5", name: "HP EliteBook 830 G5", brand: "HP" },
  { slug: "microsoft-surface-laptop-2", name: "Microsoft Surface Laptop 2", brand: "Microsoft" },
];

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svgFor({ name, brand }) {
  const [bg, accent] = brandColors[brand] ?? ["#0f172a", "#64748b"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <g transform="translate(400,250)">
    <rect x="-160" y="-100" width="320" height="200" rx="14" fill="none" stroke="${accent}" stroke-width="6"/>
    <rect x="-140" y="-80" width="280" height="160" rx="6" fill="${accent}" opacity="0.18"/>
    <rect x="-190" y="100" width="380" height="18" rx="6" fill="${accent}"/>
  </g>
  <text x="400" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="${accent}" font-weight="700" letter-spacing="2">${escapeXml(brand.toUpperCase())}</text>
  <text x="400" y="460" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">${escapeXml(name)}</text>
  <text x="400" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">Photo coming soon — FactoryBuyo</text>
</svg>`;
}

for (const product of products) {
  const svg = svgFor(product);
  writeFileSync(path.join(outDir, `${product.slug}.svg`), svg, "utf8");
}

console.log(`Generated ${products.length} placeholder images in ${outDir}`);
