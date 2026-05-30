#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(import.meta.dirname, '..');
const productDataPath = path.join(repoRoot, 'prototypes/hidden-reef/assets/product-data.js');
const sitemapUrl = 'https://www.thehiddenreef.com/sitemap.xml';
const sitemapSlug = 'public-sitemap';
const userAgent = 'Mozilla/5.0 Hidden Reef public sitemap catalog import';

const args = parseArgs(process.argv.slice(2));
const write = Boolean(args.write);
const concurrency = Number(args.concurrency || 4);
const limit = Number(args.limit || 0);
const timestamp = new Date().toISOString();
const reportDir = path.join(repoRoot, 'tmp', `hidden-reef-sitemap-import-${timestamp.replace(/[:.]/g, '-')}`);

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

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/$/, '').toLowerCase();
  } catch {
    return String(value || '').replace(/\/$/, '').toLowerCase();
  }
}

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(value = '') {
  return decodeHtml(value.replace(/<[^>]+>/g, ' '));
}

function attr(html, pattern) {
  return decodeHtml(html.match(pattern)?.[1] || '');
}

function titleFromUrl(url) {
  const slug = new URL(url).pathname.replace(/^\/|\.html$/g, '');
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.toUpperCase())
    .join(' ');
}

function formatPrice(value) {
  const number = Number.parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : '';
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': userAgent,
      accept: 'text/html,application/xhtml+xml,text/xml,application/xml'
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function parseProductPage(html, productUrl) {
  const name = attr(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i)
    || stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
    || titleFromUrl(productUrl);
  const price = formatPrice(attr(html, /<meta\s+itemprop="price"\s+content="([^"]*)"/i))
    || stripTags(html.match(/class="product__price[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '');
  const imageUrl = attr(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i)
    || attr(html, /<meta\s+itemprop="image"\s+content="([^"]*)"/i);
  const barcode = attr(html, /<meta\s+itemprop="gtin(?:8|12|13|14)?"\s+content="([^"]*)"/i);
  const sku = attr(html, /<meta\s+itemprop="sku"\s+content="([^"]*)"/i);
  return {
    name,
    price: price || 'See site',
    productUrl,
    imageUrl,
    page: 1,
    ...(barcode ? { barcode } : {}),
    ...(sku ? { sku } : {})
  };
}

async function mapLimit(items, maxConcurrent, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.max(1, maxConcurrent) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

function serializeProducts(productsBySlug, metadata) {
  const slugs = Object.keys(productsBySlug);
  const total = slugs.reduce((sum, slug) => sum + productsBySlug[slug].length, 0);
  const lines = [
    '// The Hidden Reef - Product Data (scraped from thehiddenreef.com)',
    '// Each product links back to the original Hidden Reef product page',
    `// Total: ${total} unique products across ${slugs.length} subcategories`,
    ...(metadata.presentationLine ? [metadata.presentationLine] : []),
    ...(metadata.galleryLine ? [metadata.galleryLine] : []),
    ...(metadata.removedLine ? [metadata.removedLine] : []),
    `// Public sitemap import: ${metadata.sitemapCount} products checked ${metadata.timestamp}`,
    '',
    'const THR_PRODUCTS = {'
  ];
  slugs.forEach((slug, slugIndex) => {
    lines.push(`  ${JSON.stringify(slug)}: [`);
    productsBySlug[slug].forEach((product, productIndex) => {
      lines.push(`    ${JSON.stringify(product)}${productIndex === productsBySlug[slug].length - 1 ? '' : ','}`);
    });
    lines.push(`  ]${slugIndex === slugs.length - 1 ? '' : ','}`);
  });
  lines.push('};', '', 'window.THR_PRODUCTS = THR_PRODUCTS;', '');
  lines.push(
    'const THR_PRODUCT_META = ' + JSON.stringify({
      total,
      subcategories: slugs.length,
      refreshedAt: metadata.refreshedAt || metadata.timestamp,
      publicSitemapCheckedAt: metadata.timestamp,
      publicSitemapProducts: metadata.sitemapCount
    }) + ';',
    'window.THR_PRODUCT_META = THR_PRODUCT_META;',
    ''
  );
  return lines.join('\n');
}

const productDataJs = await fs.readFile(productDataPath, 'utf8');
const dataWindow = loadBrowserScript(productDataJs, productDataPath);
const productsBySlug = dataWindow.THR_PRODUCTS;
const existingPublic = productsBySlug[sitemapSlug] || [];
const existingPublicByUrl = new Map(existingPublic.map(product => [normalizeUrl(product.productUrl), product]));

const sitemapXml = await fetchText(sitemapUrl);
let sitemapProductUrls = [...sitemapXml.matchAll(/<loc>([^<]+\.html)<\/loc>/g)].map(match => decodeHtml(match[1]));
sitemapProductUrls = [...new Set(sitemapProductUrls.map(url => normalizeUrl(url)))].sort();

const mappedUrls = new Set();
for (const [slug, products] of Object.entries(productsBySlug)) {
  if (slug === sitemapSlug) continue;
  for (const product of products || []) {
    mappedUrls.add(normalizeUrl(product.productUrl));
  }
}

let neededUrls = sitemapProductUrls.filter(url => !mappedUrls.has(url));
if (limit > 0) neededUrls = neededUrls.slice(0, limit);

await fs.mkdir(reportDir, { recursive: true });
const imported = [];
const errors = [];

const results = await mapLimit(neededUrls, concurrency, async (url, index) => {
  const previous = existingPublicByUrl.get(url);
  if (previous?.name && previous?.imageUrl && previous?.price) {
    return { product: previous, reused: true };
  }
  try {
    const html = await fetchText(url);
    return { product: parseProductPage(html, url), reused: false };
  } catch (error) {
    return { error: { url, error: error.message, index } };
  }
});

for (const result of results) {
  if (result?.product) imported.push(result.product);
  if (result?.error) errors.push(result.error);
}

productsBySlug[sitemapSlug] = imported;

const report = {
  timestamp,
  write,
  sitemapProducts: sitemapProductUrls.length,
  mappedProductUrls: mappedUrls.size,
  sitemapOnlyProducts: neededUrls.length,
  imported: imported.length,
  errors
};
const reportPath = path.join(reportDir, 'report.json');
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (write) {
  const nextJs = serializeProducts(productsBySlug, {
    timestamp,
    sitemapCount: sitemapProductUrls.length,
    refreshedAt: dataWindow.THR_PRODUCT_META?.refreshedAt || '',
    presentationLine: productDataJs.match(/^\/\/ Presentation refresh:.*$/m)?.[0] || '',
    galleryLine: productDataJs.match(/^\/\/ Gallery refresh:.*$/m)?.[0] || '',
    removedLine: productDataJs.match(/^\/\/ Removed stale 404 product URLs:.*$/m)?.[0] || ''
  });
  await fs.writeFile(productDataPath, nextJs);
}

console.log(JSON.stringify({
  mode: write ? 'write' : 'dry-run',
  sitemapProducts: sitemapProductUrls.length,
  mappedProductUrls: mappedUrls.size,
  sitemapOnlyProducts: neededUrls.length,
  imported: imported.length,
  errors: errors.length,
  reportPath
}, null, 2));
