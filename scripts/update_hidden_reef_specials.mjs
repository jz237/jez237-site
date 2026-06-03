#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const pagePath = path.join(repoRoot, 'prototypes/hidden-reef/index.html');
const saleDataPath = path.join(repoRoot, 'prototypes/hidden-reef/assets/sale-data.js');
const reportDir = path.join(repoRoot, 'tmp', `hidden-reef-specials-${new Date().toISOString().replace(/[:.]/g, '-')}`);
const homeUrl = 'https://www.thehiddenreef.com/';
const salesUrl = 'https://www.thehiddenreef.com/sales-online/';
const args = parseArgs(process.argv.slice(2));
const write = Boolean(args.write);
const maxSpecials = Number(args.limit || 8);

const artBySlug = {
  'red-sea-memorial-sale-may-22-may-28': {
    image: 'assets/site/specials/red-sea-special-gpt2.jpg',
    label: 'Test kits, care, media, pumps, parts, systems',
    alt: 'Premium reef care products arranged beside a reef aquarium'
  },
  'sale-innovative-marine-mto-50-off': {
    image: 'assets/site/specials/innovative-marine-mto-import.jpg',
    label: 'Large MTO reef systems with APS stands',
    alt: 'Innovative Marine made-to-order aquariums promotion: save 50 percent on MTO orders'
  },
  'innovative-marine-10-off-25-100-g-complete': {
    image: 'assets/site/specials/innovative-marine-complete-special-gpt2.jpg',
    label: '25-100 gallon complete reef systems',
    alt: 'Complete mid-size reef aquarium system with filtration equipment'
  },
  'innovative-marine-fleece-roller-30-off': {
    image: 'assets/site/specials/nuvo-roller-special-gpt2.jpg',
    label: 'Aqua Gadget Nuvo Roller manual fleece roller',
    alt: 'Manual fleece roller aquarium filter beside a reef tank'
  },
  'reef-factory-sale-40': {
    image: 'assets/site/specials/reef-factory-special-gpt2.jpg',
    label: 'ATO, meters, smart rollers, controllers',
    alt: 'Reef aquarium automation and monitoring equipment beside a reef tank'
  },
  aiosale: {
    image: 'assets/site/specials/nuvo-starter-kits-import.jpg',
    label: 'Featured AIO aquarium systems',
    alt: 'NUVO starter kits promotion with Fusion 15 AIO Cube and Fusion 20 AIO Long aquarium sale pricing'
  }
};

const copyBySlug = {
  'red-sea-memorial-sale-may-22-may-28': {
    title: 'Red Sea Memorial Day Sale',
    primaryLabel: 'Shop Red Sea Sale',
    discountLabel: '12% off select Red Sea products',
    localCategory: { label: 'Browse reef gear', href: 'category/?cat=saltwater' }
  },
  'sale-innovative-marine-mto-50-off': {
    title: 'Innovative Marine MTO Systems',
    primaryLabel: 'Shop MTO Systems',
    discountLabel: '50% off MTO reef systems',
    localCategory: { label: 'Plan a setup', href: 'category/?cat=equipment' },
    imageText: [
      'Innovative Marine',
      'Built to inspire. Designed for life.',
      'Made-to-Order Aquariums',
      'Made to order. Built for you. Worth the wait.',
      'Save 50% on all MTO orders',
      '112-240 gallons. Wide range of sizes.',
      'Tank + stand or complete system. Choose your perfect setup.',
      'Premium euro-braced designs. Built stronger. Built safer.',
      'Please allow 4-6 months. Crafted with care just for you.',
      'Order yours today',
      'Trusted quality, built in California',
      'Available at The Hidden Reef'
    ]
  },
  'innovative-marine-10-off-25-100-g-complete': {
    title: 'Innovative Marine 25-100 Gallon Sale',
    primaryLabel: 'Shop Complete Systems',
    discountLabel: '10% off complete systems',
    localCategory: { label: 'See saltwater', href: 'category/?cat=saltwater' }
  },
  'innovative-marine-fleece-roller-30-off': {
    title: 'Innovative Marine Nuvo Roller',
    primaryLabel: 'Shop Nuvo Roller',
    discountLabel: '30% off fleece roller',
    localCategory: { label: 'Filter media', href: 'category/?cat=maintenance' }
  },
  'reef-factory-sale-40': {
    title: 'Reef Factory Equipment Sale',
    primaryLabel: 'Shop Reef Factory',
    discountLabel: '40% off Reef Factory',
    localCategory: { label: 'Water care', href: 'category/?cat=maintenance' }
  },
  aiosale: {
    title: 'Innovative Marine AIO Aquariums',
    primaryLabel: 'Shop AIO Aquariums',
    discountLabel: 'Homepage feature',
    localCategory: { label: 'See aquariums', href: 'category/?cat=aquariums' },
    imageText: [
      'NUVO Starter Kits',
      'Ready to ship. In stock. Lowest price.',
      'Fusion 15 AIO Cube Aquarium. Desktop starter kit.',
      'Fusion 15 dimensions: 15 in x 15 in x 15 in.',
      'Fusion 15 price: $99.99.',
      'Fusion 20 AIO Long Aquarium. Desktop starter kit.',
      'Fusion 20 dimensions: 23.6 in x 15 in x 13 in.',
      'Fusion 20 price: $169.99.',
      'All-in-one filtration',
      'Sleek, modern design',
      'Easy setup and maintenance',
      'Vibrant reef ready',
      'Shop now',
      'Premium quality. Beautiful results. Right on your desk.'
    ]
  }
};

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

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absoluteUrl(url, baseUrl) {
  if (!url) return '';
  try {
    return new URL(decodeHtml(url), baseUrl).toString();
  } catch {
    return decodeHtml(url);
  }
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 Hidden Reef daily specials refresh',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function slugFromUrl(url) {
  const pathname = new URL(url).pathname.replace(/\/+$/, '');
  return pathname.split('/').pop() || '';
}

function parseBackgroundImageUrl(value = '', baseUrl = '') {
  const match = value.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
  return match ? absoluteUrl(match[2], baseUrl) : '';
}

function inferHomepagePromoTitle(url) {
  const slug = slugFromUrl(url);
  if (copyBySlug[slug]?.title) return copyBySlug[slug].title;
  return titleCaseSale(slug.replace(/-/g, ' '));
}

function parseHomepagePromos(html) {
  const promos = [];
  const seen = new Set();
  const blockPattern = /<(?:div|section)\b[^>]*style="([^"]*background-image:[^"]*)"[^>]*>[\s\S]*?<a\s+href="([^"]+)"[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = blockPattern.exec(html))) {
    const url = absoluteUrl(match[2], homeUrl);
    const slug = slugFromUrl(url);
    const isSpecial = /\/sales-online\/[^/]+\/?$/.test(new URL(url).pathname) || slug === 'aiosale';
    if (!isSpecial || seen.has(url)) continue;
    seen.add(url);
    promos.push({
      title: inferHomepagePromoTitle(url),
      url,
      slug,
      count: 0,
      homepageImage: parseBackgroundImageUrl(match[1], homeUrl),
      homepageButton: stripTags(match[3])
    });
  }
  return promos;
}

function parseSaleDepartments(html) {
  const salesSection = html.match(/<a href="https:\/\/www\.thehiddenreef\.com\/sales-online\/"[^>]*aria-current="page"[\s\S]*?<ul class="filter-categories__subcat[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
  const salesBlock = salesSection?.[1] || '';
  if (!salesBlock) return [];
  const items = [];
  const itemPattern = /<li class="filter-categories__item">([\s\S]*?)<\/li>/g;
  let match;
  while ((match = itemPattern.exec(salesBlock))) {
    const itemHtml = match[1];
    const link = itemHtml.match(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    const count = itemHtml.match(/<span[^>]*class="filter-categories__count[^"]*"[^>]*>\((\d+)\)<\/span>/);
    if (!link) continue;
    const url = absoluteUrl(link[1], salesUrl);
    const title = stripTags(link[2]);
    items.push({
      title,
      url,
      slug: slugFromUrl(url),
      count: Number(count?.[1] || 0)
    });
  }
  return items;
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

function parseProductCards(html, pageUrl) {
  const cards = html.match(/<div class="prod-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];
  return cards.map(card => {
    const titleMatch = card.match(/<a[^>]+class="product-card__title"[^>]*>([\s\S]*?)<\/a>/);
    const imageLinkMatch = card.match(/<a[^>]+class="prod-card__img-link"[^>]+href="([^"]+)"/);
    const titleLinkMatch = card.match(/<a[^>]+href="([^"]+)"[^>]+class="product-card__title"/);
    const ariaMatch = card.match(/class="prod-card__img-link"[^>]+aria-label="([^"]+)"/);
    const priceMatch = card.match(/<ins[^>]+class="prod-card__price"[^>]*>([\s\S]*?)<\/ins>/);
    const oldPriceMatch = card.match(/<del[^>]+class="prod-card__old-price"[^>]*>([\s\S]*?)<\/del>/);
    const imgTag = card.match(/<img\b[\s\S]*?>/)?.[0] || '';
    const srcMatch = imgTag.match(/\bsrc="([^"]+)"/);
    const srcsetMatch = imgTag.match(/\bsrcset="([\s\S]*?)"/);
    const name = stripTags(titleMatch?.[1] || ariaMatch?.[1] || '');
    const productUrl = absoluteUrl(titleLinkMatch?.[1] || imageLinkMatch?.[1] || '', pageUrl);
    const price = stripTags(priceMatch?.[1] || '');
    const oldPrice = stripTags(oldPriceMatch?.[1] || '');
    const imageUrl = bestImageFromSrcset(srcsetMatch?.[1] || '', srcMatch?.[1] || '', pageUrl);
    if (!name || !productUrl) return null;
    return { name, productUrl, price, oldPrice, imageUrl };
  }).filter(Boolean);
}

function moneyToNumber(value = '') {
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function discountFromProduct(product) {
  const sale = moneyToNumber(product.price);
  const regular = moneyToNumber(product.oldPrice);
  if (!sale || !regular || regular <= sale) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}

function discountFromTitle(title, products) {
  const explicit = title.match(/(\d+)\s*%/);
  if (explicit) return Number(explicit[1]);
  const discounts = products.map(discountFromProduct).filter(Boolean).sort((a, b) => a - b);
  if (!discounts.length) return 0;
  return discounts[Math.floor(discounts.length / 2)];
}

function titleCaseSale(title) {
  return title
    .replace(/\s+/g, ' ')
    .replace(/\bMto\b/g, 'MTO')
    .replace(/\bG\b/g, 'G')
    .trim();
}

function eyebrowFor(title) {
  const date = title.match(/[A-Z][a-z]{2,8}\s+\d{1,2}\s*-\s*[A-Z]?[a-z]*\s*\d{1,2}/);
  if (date) return date[0].replace(/\s*-\s*/g, ' - ');
  if (/made|mto/i.test(title)) return 'Made to order';
  if (/complete/i.test(title)) return 'Complete systems';
  if (/roller|filter|fleece/i.test(title)) return 'Filtration upgrade';
  if (/reef factory|controller|meter|ato|smart/i.test(title)) return 'Reef automation';
  return 'Current sale';
}

function localCategoryFor(title) {
  if (/filter|fleece|media|roller|factory|controller|meter|ato/i.test(title)) {
    return { label: 'Water care', href: 'category/?cat=maintenance' };
  }
  if (/reef|red sea|marine|system|aquarium|tank/i.test(title)) {
    return { label: 'Browse reef gear', href: 'category/?cat=saltwater' };
  }
  return { label: 'Browse products', href: 'category/' };
}

function describeSale(title, products) {
  if (/aio/i.test(title)) {
    return 'Their homepage is featuring compact Innovative Marine all-in-one aquariums, a good fit for clean desktop or small-room setups.';
  }
  if (/red sea/i.test(title)) {
    return 'Save on Red Sea reef test kits, supplements, meters, media, pumps, replacement parts, and aquarium systems while the sale is active.';
  }
  if (/mto/i.test(title)) {
    return 'Plan a larger reef build with made-to-order lagoon, EXT, and SR Pro aquarium systems paired with sturdy APS-style stands.';
  }
  if (/complete/i.test(title)) {
    return 'Complete reef systems make it easier to step into a polished setup with the tank, stand, and core equipment matched from the start.';
  }
  if (/fleece|roller/i.test(title)) {
    return 'Upgrade mechanical filtration with a compact fleece roller built for cleaner water and easier maintenance.';
  }
  if (/reef factory/i.test(title)) {
    return 'Dial in reef stability with automation and monitoring gear, including smart rollers, ATO equipment, meters, pumps, and controllers.';
  }
  const first = products[0]?.name ? products[0].name.toLowerCase() : 'aquarium gear';
  return `Current sale pricing is available on ${first} and related Hidden Reef products.`;
}

function exampleLine(products) {
  const examples = products
    .slice(0, 2)
    .map(product => `${shortProductName(product.name)} ${product.price}`.trim())
    .filter(Boolean);
  return examples.length ? `Examples: ${examples.join(', ')}` : '';
}

function shortProductName(name) {
  return name
    .replace(/^Innovative Marine\s+/i, '')
    .replace(/^Red Sea\s+/i, '')
    .replace(/^Reef Factory\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function artFor(department, products) {
  const configured = artBySlug[department.slug];
  if (configured) return configured;
  if (department.homepageImage) {
    return {
      image: department.homepageImage,
      label: department.title,
      alt: department.title
    };
  }
  const first = products.find(product => product.imageUrl);
  return {
    image: first?.imageUrl || 'assets/site/hidden-reef-masthead.png',
    label: department.title,
    alt: first?.name || department.title
  };
}

async function enrichDepartment(department) {
  const html = await fetchHtml(department.url);
  const products = parseProductCards(html, department.url);
  const discount = discountFromTitle(department.title, products);
  const count = department.count || products.length;
  return {
    ...department,
    count,
    title: copyBySlug[department.slug]?.title || titleCaseSale(department.title),
    eyebrow: eyebrowFor(department.title),
    products,
    discount,
    description: describeSale(department.title, products),
    example: exampleLine(products),
    art: artFor(department, products),
    discountLabel: copyBySlug[department.slug]?.discountLabel || '',
    primaryLabel: copyBySlug[department.slug]?.primaryLabel || 'Shop Sale',
    localCategory: copyBySlug[department.slug]?.localCategory || localCategoryFor(department.title),
    imageText: copyBySlug[department.slug]?.imageText || []
  };
}

function renderDiscountBadge(special) {
  if (special.discount) return `${special.discount}%<small>off</small>`;
  const label = special.discountLabel || '';
  const explicit = label.match(/(\d+)\s*%/);
  if (explicit) return `${explicit[1]}%<small>off</small>`;
  return 'Sale<small>now</small>';
}

function renderCard(special) {
  const discountText = special.discountLabel || (special.discount ? `${special.discount}% off` : 'Sale pricing');
  const countText = `${special.count} sale ${special.count === 1 ? 'item' : 'items'}`;
  const example = special.example ? `\n                <li>${escapeHtml(special.example)}</li>` : '';
  return `          <article class="special-card">
            <a class="special-card__media" href="${escapeHtml(special.url)}" target="_blank" rel="noopener">
              <img src="${escapeHtml(special.art.image)}" alt="${escapeHtml(special.art.alt)}" />
              <span class="special-card__discount">${renderDiscountBadge(special)}</span>
            </a>
            <div class="special-card__body">
              <span class="special-card__eyebrow">${escapeHtml(special.eyebrow)}</span>
              <h2>${escapeHtml(special.title)}</h2>
              <p>${escapeHtml(special.description)}</p>
              <ul class="special-card__notes">
                <li>${escapeHtml(discountText)}</li>
                <li>${escapeHtml(countText)}</li>${example}
              </ul>
              <div class="special-actions">
                <a class="btn" href="${escapeHtml(special.url)}" target="_blank" rel="noopener">${escapeHtml(special.primaryLabel)}</a>
                <a class="btn secondary" href="sales/?sale=${escapeHtml(special.slug)}#sale-view">View sale items</a>
                <a class="btn secondary" href="${escapeHtml(special.localCategory.href)}">${escapeHtml(special.localCategory.label)}</a>
              </div>
            </div>
          </article>`;
}

function renderSpecialsSection(specials) {
  if (!specials.length) return '<!-- THR_SPECIALS_START -->\n<!-- THR_SPECIALS_END -->';
  const renderedCards = specials.map(renderCard).join('\n');
  return `<!-- THR_SPECIALS_START -->
    <section class="specials-spotlight" aria-labelledby="specials-title">
      <div class="specials-head">
        <span id="specials-title">Current specials</span>
        <a href="sales/">View all sale departments</a>
      </div>
      <div class="specials-carousel">
        <div class="specials-track" id="specials-track">
${renderedCards}
        </div>
      </div>
      <div class="special-controls" aria-label="Specials carousel controls">
        <div class="special-arrows">
          <button class="special-control" type="button" data-special-dir="-1" aria-label="Previous special">‹</button>
          <button class="special-control" type="button" data-special-dir="1" aria-label="Next special">›</button>
        </div>
        <div class="special-dots" id="special-dots" aria-label="Choose special"></div>
      </div>
    </section>
    <!-- THR_SPECIALS_END -->`;
}

function replaceSpecialsSection(page, specials) {
  const pattern = /<!-- THR_SPECIALS_START -->[\s\S]*?<!-- THR_SPECIALS_END -->/;
  if (!pattern.test(page)) {
    throw new Error('Could not find managed specials section in homepage');
  }
  return page.replace(pattern, renderSpecialsSection(specials));
}

function uniqueDepartments(departments) {
  const seen = new Set();
  const unique = [];
  departments.forEach(department => {
    const key = department.url || department.slug || department.title;
    if (!key || seen.has(key)) return;
    seen.add(key);
    unique.push(department);
  });
  return unique;
}

function saleDataProduct(product) {
  return {
    name: product.name || '',
    price: product.price || '',
    oldPrice: product.oldPrice || '',
    productUrl: product.productUrl || '',
    imageUrl: product.imageUrl || ''
  };
}

function saleDataDepartment(special) {
  return {
    title: special.title,
    slug: special.slug,
    url: special.url,
    eyebrow: special.eyebrow,
    count: special.count,
    discount: special.discount,
    discountLabel: special.discountLabel,
    description: special.description,
    primaryLabel: special.primaryLabel,
    localCategory: special.localCategory,
    art: special.art,
    products: special.products.map(saleDataProduct)
  };
}

function renderSaleDataFile(specials, sourceMode) {
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceUrl: salesUrl,
    sourceMode,
    departments: specials.map(saleDataDepartment)
  };
  const json = JSON.stringify(payload, null, 2)
    .replace(/<\/script/gi, '<\\/script')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `// The Hidden Reef sale data\n// Generated by scripts/update_hidden_reef_specials.mjs\nwindow.THR_SALE_DATA = ${json};\n`;
}

await fs.mkdir(reportDir, { recursive: true });

const homeHtml = await fetchHtml(homeUrl);
const salesHtml = await fetchHtml(salesUrl);
const salesDepartments = parseSaleDepartments(salesHtml);
const salesDepartmentByUrl = new Map(salesDepartments.map(department => [department.url, department]));
const homepagePromos = parseHomepagePromos(homeHtml).map(promo => ({
  ...promo,
  count: salesDepartmentByUrl.get(promo.url)?.count || promo.count
}));
const allDepartments = uniqueDepartments([...homepagePromos, ...salesDepartments]);
const carouselDepartments = (homepagePromos.length ? homepagePromos : salesDepartments).slice(0, maxSpecials);

const enrichedByUrl = new Map();
for (const department of uniqueDepartments([...carouselDepartments, ...allDepartments])) {
  enrichedByUrl.set(department.url, await enrichDepartment(department));
}
const specials = carouselDepartments.map(department => enrichedByUrl.get(department.url)).filter(Boolean);
const salePageSpecials = allDepartments.map(department => enrichedByUrl.get(department.url)).filter(Boolean);

const page = await fs.readFile(pagePath, 'utf8');
const previousSaleData = await fs.readFile(saleDataPath, 'utf8').catch(() => '');
const nextPage = replaceSpecialsSection(page, specials);
const nextSaleData = renderSaleDataFile(salePageSpecials, homepagePromos.length ? 'homepage-and-sales-dropdown' : 'sales-online');
const changed = nextPage !== page || nextSaleData !== previousSaleData;

const report = {
  timestamp: new Date().toISOString(),
  sourceUrl: homepagePromos.length ? homeUrl : salesUrl,
  sourceMode: homepagePromos.length ? 'homepage-promos' : 'sales-online-fallback',
  write,
  changed,
  saleDepartments: salePageSpecials.length,
  specials: specials.map(special => ({
    title: special.title,
    url: special.url,
    count: special.count,
    discount: special.discount,
    firstProduct: special.products[0]?.name || ''
  }))
};

await fs.writeFile(path.join(reportDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (write && changed) {
  await fs.writeFile(pagePath, nextPage);
  await fs.writeFile(saleDataPath, nextSaleData);
}

console.log(JSON.stringify({
  mode: write ? 'write' : 'dry-run',
  changed,
  specials: specials.length,
  reportPath: path.join(reportDir, 'report.json')
}, null, 2));
