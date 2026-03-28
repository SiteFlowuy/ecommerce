#!/usr/bin/env node
// scripts/download-placeholders.js
// Downloads placeholder images from picsum.photos into assets/
// Requires Node 18+ (native fetch). Run: node scripts/download-placeholders.js

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync }       from 'node:fs';
import path                 from 'node:path';
import { fileURLToPath }    from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

const images = [
  // Hero & banners
  { dest: 'assets/hero.jpg',          url: 'https://picsum.photos/560/420?random=1'   },
  { dest: 'assets/offer-banner.jpg',  url: 'https://picsum.photos/480/320?random=10'  },
  { dest: 'assets/og-home.jpg',       url: 'https://picsum.photos/1200/630?random=99' },
  // Product cards (1–8)
  { dest: 'assets/products/product-1.jpg', url: 'https://picsum.photos/300/300?random=2' },
  { dest: 'assets/products/product-2.jpg', url: 'https://picsum.photos/300/300?random=3' },
  { dest: 'assets/products/product-3.jpg', url: 'https://picsum.photos/300/300?random=4' },
  { dest: 'assets/products/product-4.jpg', url: 'https://picsum.photos/300/300?random=5' },
  { dest: 'assets/products/product-5.jpg', url: 'https://picsum.photos/300/300?random=6' },
  { dest: 'assets/products/product-6.jpg', url: 'https://picsum.photos/300/300?random=7' },
  { dest: 'assets/products/product-7.jpg', url: 'https://picsum.photos/300/300?random=8' },
  { dest: 'assets/products/product-8.jpg', url: 'https://picsum.photos/300/300?random=9' },
];

async function download({ dest, url }) {
  const fullPath = path.join(ROOT, dest);
  const dir      = path.dirname(fullPath);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  console.log(`⬇  ${dest}`);
  const res = await fetch(url, { redirect: 'follow' });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(fullPath, buffer);
  console.log(`✓  ${dest} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('ShopBase — downloading placeholder images\n');

  const results = await Promise.allSettled(images.map(download));

  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length) {
    console.error(`\n✗ ${failed.length} download(s) failed:`);
    failed.forEach(r => console.error(' ', r.reason.message));
    process.exit(1);
  }

  console.log('\nAll images downloaded successfully.');
}

main();
