#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(import.meta.dirname, '..');
const productDataPath = path.join(repoRoot, 'prototypes/hidden-reef/assets/product-data.js');
const args = parseArgs(process.argv.slice(2));
const write = Boolean(args.write);
const concurrency = Number(args.concurrency || 10);
const limit = Number(args.limit || 0);
const timestamp = new Date().toISOString();

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      parsed.write = true;
    } else if (arg.startsWith('--')) {
      parsed[arg.slice(2)] = argv[index + 1];
      index += 1;
    }
  }
  return parsed;
}

function loadBrowserScript(source, filename) {
  const context = { window: {}, console };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(source, context, { filename });
  return context.window;
}

function absoluteUrl(url, baseUrl) {
  if (!url) return '';
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function unique(items) {
  const seen = new Set();
  return items.filter(item => {
    const value = String(item || '').trim();
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function extractGalleryImages(html, pageUrl) {
  const images = [];
  let match;
  const imageRe = /<img\b[^>]*class="[^"]*js-img-mag__asset[^"]*"[^>]*src="([^"]+)"/g;
  while ((match = imageRe.exec(html))) {
    images.push(absoluteUrl(match[1], pageUrl));
  }
  if (!images.length) {
    const thumbRe = /<li\b[^>]*class="[^"]*js-slideshow__item[^"]*"[^>]*data-thumb="([^"]+)"/g;
    while ((match = thumbRe.exec(html))) {
      images.push(absoluteUrl(match[1], pageUrl).replace('/168x224x2/', '/800x800x2/'));
    }
  }
  return unique(images);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 Hidden Reef demo product gallery refresh',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function serializeProducts(productsBySlug, metadata) {
  const slugs = Object.keys(productsBySlug);
  const total = slugs.reduce((sum, slug) => sum + productsBySlug[slug].length, 0);
  const lines = [
    '// The Hidden Reef - Product Data (scraped from thehiddenreef.com)',
    '// Each product links back to the original Hidden Reef product page',
    `// Total: ${total} unique products across ${slugs.length} subcategories`,
    metadata.presentationLine,
    `// Gallery refresh: product image galleries refreshed ${metadata.timestamp}`,
    `// Removed stale 404 product URLs: ${metadata.removedCount} removed ${metadata.removedDate}`,
    '',
    'const THR_PRODUCTS = {'
  ];
  slugs.forEach((slug, slugIndex) => {
    lines.push(`  ${JSON.stringify(slug)}: [`);
    productsBySlug[slug].forEach((product, productIndex) => {
      const comma = productIndex === productsBySlug[slug].length - 1 ? '' : ',';
      lines.push(`    ${JSON.stringify(product)}${comma}`);
    });
    lines.push(`  ]${slugIndex === slugs.length - 1 ? '' : ','}`);
  });
  lines.push('};', '', 'window.THR_PRODUCTS = THR_PRODUCTS;', '');
  return lines.join('\n');
}

const productData = await fs.readFile(productDataPath, 'utf8');
const dataWindow = loadBrowserScript(productData, productDataPath);
const productsBySlug = dataWindow.THR_PRODUCTS;
const presentationLine = productData.match(/^\/\/ Presentation refresh:.*$/m)?.[0] || '// Presentation refresh: unknown';
const previousRemovedLine = productData.match(/^\/\/ Removed stale 404 product URLs:.*$/m)?.[0] || '';
const previousRemovedCount = Number(previousRemovedLine.match(/: (\d+) removed/)?.[1] || 0);
const previousRemovedDate = previousRemovedLine.match(/removed ([0-9-]+)/)?.[1] || timestamp.slice(0, 10);
const products = Object.entries(productsBySlug)
  .flatMap(([slug, items]) => items.map(product => ({ slug, product })))
  .slice(0, limit || undefined);
let cursor = 0;
let enriched = 0;
let unchanged = 0;
const removed = [];
const errors = [];

async function worker() {
  while (cursor < products.length) {
    const { slug, product } = products[cursor];
    cursor += 1;
    if (!product.productUrl) continue;
    try {
      const html = await fetchWithTimeout(product.productUrl);
      const images = extractGalleryImages(html, product.productUrl);
      if (images.length > 1) {
        product.images = images;
        enriched += 1;
      } else {
        delete product.images;
        unchanged += 1;
      }
    } catch (error) {
      if (error.status === 404) {
        product.__remove404 = true;
        removed.push({ slug, name: product.name, url: product.productUrl, error: error.message });
        continue;
      }
      errors.push({ name: product.name, url: product.productUrl, error: error.message });
    }
  }
}

await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));

if (write && removed.length) {
  for (const slug of Object.keys(productsBySlug)) {
    productsBySlug[slug] = productsBySlug[slug].filter(product => !product.__remove404);
  }
}
for (const { product } of products) {
  delete product.__remove404;
}

const removedCount = previousRemovedCount + (write ? removed.length : 0);
const removedDate = removed.length && write ? timestamp.slice(0, 10) : previousRemovedDate;
const report = { timestamp, write, total: products.length, enriched, unchanged, removed404: removed.length, failed: errors.length, removed, errors };
const reportDir = path.join(repoRoot, 'tmp', `hidden-reef-gallery-refresh-${timestamp.replace(/[:.]/g, '-')}`);
await fs.mkdir(reportDir, { recursive: true });
await fs.writeFile(path.join(reportDir, 'report.json'), JSON.stringify(report, null, 2));

if (write) {
  await fs.writeFile(productDataPath, serializeProducts(productsBySlug, { timestamp, presentationLine, removedCount, removedDate }));
}

console.log(JSON.stringify({ ...report, report: path.relative(repoRoot, path.join(reportDir, 'report.json')) }, null, 2));
