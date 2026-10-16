import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

console.log('[verify-build] Checking production build integrity...');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[verify-build] FAILED: dist/index.html does not exist.');
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, 'utf-8');

if (html.includes('main.tsx')) {
  console.error('[verify-build] FAILED: dist/index.html still references main.tsx!');
  process.exit(1);
}

const requiredFiles = [
  'dist/index.html',
  'dist/admin/index.html',
  'dist/services/index.html',
  'dist/404.html',
  'dist/.nojekyll',
];

for (const file of requiredFiles) {
  const fullPath = path.join(projectRoot, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`[verify-build] FAILED: Required file missing: ${file}`);
    process.exit(1);
  }
}

// Verify script and stylesheet assets
const scriptMatches = html.match(/src="([^"]+)"/g) || [];
const linkMatches = html.match(/href="([^"]+\.css)"/g) || [];

for (const match of [...scriptMatches, ...linkMatches]) {
  const url = match.match(/(?:src|href)="([^"]+)"/)[1];
  if (url.startsWith('/Top-Spark-Digital/assets/')) {
    const relFile = url.replace('/Top-Spark-Digital/', 'dist/');
    const assetPath = path.join(projectRoot, relFile);
    if (!fs.existsSync(assetPath)) {
      console.error(`[verify-build] FAILED: Asset referenced in HTML does not exist: ${relFile}`);
      process.exit(1);
    }
    console.log(`  ✓ Verified asset: ${relFile}`);
  }
}

console.log('[verify-build] SUCCESS: Production build integrity verified 100%!');
