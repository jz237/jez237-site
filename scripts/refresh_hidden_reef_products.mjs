#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(import.meta.dirname, '..');
const productsJsPath = path.join(repoRoot, 'prototypes/hidden-reef/assets/products.js');
const productDataPath = path.join(repoRoot, 'prototypes/hidden-reef/assets/product-data.js');
const defaultSlugs = [
  'starter-kits',
  'planted',
  'water-conditioners',
  'flake-tropical',
  'canister-filters',
  'filter-media',
  'led-fixtures',
  'heaters',
  'gravel-cleaners',
  'ornaments',
  'all-decorations',
  'test-kits',
  'skimmers',
  'pond-supplies',
  'pond-pumps',
  'pond-food',
  'controllers'
];

const args = parseArgs(process.argv.slice(2));
const write = Boolean(args.write);
const maxPages = Number(args['max-pages'] || 2);
const slugs = String(args.slugs || '')
  .split(',')
  .map(slug => slug.trim())
  .filter(Boolean);
const refreshSlugs = slugs.length ? slugs : defaultSlugs;
const timestamp = new Date().toISOString();
const reportDir = path.join(repoRoot, 'tmp', `hidden-reef-refresh-${timestamp.replace(/[:.]/g, '-')}`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      parsed.write = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      parsed[key] = argv[index + 1];
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

function collectSourceUrls(categories) {
  const sources = new Map();
  for (const group of Object.values(categories || {})) {
    for (const child of Object.values(group.children || {})) {
      if (child.slug && child.sourceUrl) {
        sources.set(child.slug, {
          groupSlug: group.slug,
          groupName: group.name,
          childName: child.name,
          sourceUrl: child.sourceUrl
        });
      }
    }
  }
  return sources;
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

function absoluteUrl(url, baseUrl) {
  if (!url) return '';
  try {
    return new URL(decodeHtml(url), baseUrl).toString();
  } catch {
    return decodeHtml(url);
  }
}

function bestImageFromSrcset(srcset = '', src = '', baseUrl = '') {
  const candidates = srcset
    .split(',')
    .map(part => {
      const bits = part.trim().split(/\s+/);
      const width = Number((bits[1] || '').replace(/\D/g, '')) || 0;
      return { url: absoluteUrl(bits[0], baseUrl), width };
    })
    .filter(item => item.url);
  if (candidates.length) {
    candidates.sort((a, b) => b.width - a.width);
    return candidates[0].url;
  }
  return absoluteUrl(src, baseUrl);
}

function parseProductCards(html, pageUrl, page) {
  const cards = html.match(/<div class="prod-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];
  return cards.map(card => {
    const titleMatch = card.match(/<a[^>]+class="product-card__title"[^>]*>([\s\S]*?)<\/a>/);
    const imageLinkMatch = card.match(/<a[^>]+class="prod-card__img-link"[^>]+href="([^"]+)"/);
    const titleLinkMatch = card.match(/<a[^>]+href="([^"]+)"[^>]+class="product-card__title"/);
    const ariaMatch = card.match(/class="prod-card__img-link"[^>]+aria-label="([^"]+)"/);
    const priceMatch = card.match(/<ins[^>]+class="prod-card__price"[^>]*>([\s\S]*?)<\/ins>/);
    const imgMatch = card.match(/<img\b[\s\S]*?>/);
    const imgTag = imgMatch ? imgMatch[0] : '';
    const srcMatch = imgTag.match(/\bsrc="([^"]+)"/);
    const srcsetMatch = imgTag.match(/\bsrcset="([\s\S]*?)"/);
    const name = stripTags(titleMatch?.[1] || ariaMatch?.[1] || '');
    const productUrl = absoluteUrl(titleLinkMatch?.[1] || imageLinkMatch?.[1] || '', pageUrl);
    const price = stripTags(priceMatch?.[1] || '');
    const imageUrl = bestImageFromSrcset(srcsetMatch?.[1] || '', srcMatch?.[1] || '', pageUrl);
    if (!name || !productUrl) return null;
    return { name, price, productUrl, imageUrl, page };
  }).filter(Boolean);
}

function findNextUrl(html, pageUrl) {
  const nextMatch = html.match(/<link\s+rel="next"\s+href="([^"]+)"/i);
  return nextMatch ? absoluteUrl(nextMatch[1], pageUrl) : '';
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 Hidden Reef demo catalog refresh',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function scrapeCategory(sourceUrl) {
  const products = [];
  const pages = [];
  let nextUrl = sourceUrl;
  for (let page = 1; page <= maxPages && nextUrl; page += 1) {
    const html = await fetchWithTimeout(nextUrl);
    const pageProducts = parseProductCards(html, nextUrl, page);
    products.push(...pageProducts);
    pages.push({ url: nextUrl, count: pageProducts.length });
    nextUrl = findNextUrl(html, nextUrl);
  }
  return { products: uniqueByProduct(products), pages };
}

function productKey(product) {
  return String(product.productUrl || product.name || '').toLowerCase();
}

function uniqueByProduct(products) {
  const seen = new Set();
  return products.filter(product => {
    const key = productKey(product);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeProducts(fresh, existing) {
  const existingByUrl = new Map();
  existing.forEach(product => {
    if (product.productUrl) existingByUrl.set(productKey(product), product);
  });
  const freshWithBarcodes = fresh.map(product => {
    const previous = existingByUrl.get(productKey(product));
    return {
      ...product,
      ...(previous?.barcode ? { barcode: previous.barcode } : {}),
      ...(previous?.images ? { images: previous.images } : {})
    };
  });
  const freshKeys = new Set(freshWithBarcodes.map(productKey));
  const tail = existing.filter(product => !freshKeys.has(productKey(product)));
  return uniqueByProduct([...freshWithBarcodes, ...tail]);
}

function serializeProducts(productsBySlug, metadata) {
  const slugs = Object.keys(productsBySlug);
  const total = slugs.reduce((sum, slug) => sum + productsBySlug[slug].length, 0);
  const lines = [
    '// The Hidden Reef - Product Data (scraped from thehiddenreef.com)',
    '// Each product links back to the original Hidden Reef product page',
    `// Total: ${total} unique products across ${slugs.length} subcategories`,
    `// Presentation refresh: ${metadata.refreshedSlugs.length} subcategories refreshed ${metadata.timestamp}`,
    ...(metadata.galleryLine ? [metadata.galleryLine] : []),
    ...(metadata.removedLine ? [metadata.removedLine] : []),
    '',
    'const THR_PRODUCTS = {'
  ];
  slugs.forEach((slug, slugIndex) => {
    lines.push(`  ${JSON.stringify(slug)}: [`);
    productsBySlug[slug].forEach((product, productIndex) => {
      const body = JSON.stringify(product);
      const comma = productIndex === productsBySlug[slug].length - 1 ? '' : ',';
      lines.push(`    ${body}${comma}`);
    });
    lines.push(`  ]${slugIndex === slugs.length - 1 ? '' : ','}`);
  });
  lines.push('};', '', 'window.THR_PRODUCTS = THR_PRODUCTS;', '');
  return lines.join('\n');
}

const [productsJs, productDataJs] = await Promise.all([
  fs.readFile(productsJsPath, 'utf8'),
  fs.readFile(productDataPath, 'utf8')
]);
const productWindow = loadBrowserScript(productsJs, productsJsPath);
const dataWindow = loadBrowserScript(productDataJs, productDataPath);
const sources = collectSourceUrls(productWindow.THR.categories);
const productsBySlug = dataWindow.THR_PRODUCTS;
const galleryLine = productDataJs.match(/^\/\/ Gallery refresh:.*$/m)?.[0] || '';
const removedLine = productDataJs.match(/^\/\/ Removed stale 404 product URLs:.*$/m)?.[0] || '';

await fs.mkdir(reportDir, { recursive: true });

const report = {
  timestamp,
  write,
  maxPages,
  requestedSlugs: refreshSlugs,
  refreshed: [],
  errors: []
};

for (const slug of refreshSlugs) {
  const source = sources.get(slug);
  if (!source) {
    report.errors.push({ slug, error: 'No sourceUrl found' });
    continue;
  }
  try {
    const existing = productsBySlug[slug] || [];
    const scraped = await scrapeCategory(source.sourceUrl);
    if (!scraped.products.length) {
      report.errors.push({ slug, sourceUrl: source.sourceUrl, error: 'No products parsed' });
      continue;
    }
    const merged = mergeProducts(scraped.products, existing);
    productsBySlug[slug] = merged;
    report.refreshed.push({
      slug,
      sourceUrl: source.sourceUrl,
      pages: scraped.pages,
      freshCount: scraped.products.length,
      previousCount: existing.length,
      finalCount: merged.length,
      firstProduct: scraped.products[0]?.name || ''
    });
  } catch (error) {
    report.errors.push({ slug, sourceUrl: source.sourceUrl, error: error.message });
  }
}

const reportPath = path.join(reportDir, 'report.json');
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (write) {
  const nextJs = serializeProducts(productsBySlug, {
    refreshedSlugs: report.refreshed.map(item => item.slug),
    timestamp,
    galleryLine,
    removedLine
  });
  await fs.writeFile(productDataPath, nextJs);
}

console.log(JSON.stringify({
  mode: write ? 'write' : 'dry-run',
  refreshed: report.refreshed.length,
  errors: report.errors.length,
  reportPath
}, null, 2));
