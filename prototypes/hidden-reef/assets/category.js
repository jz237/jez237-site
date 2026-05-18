// The Hidden Reef — Category Page Controller
// Reads URL params (?cat=slug&sub=slug) and renders products from THR_PRODUCTS

(function() {
  'use strict';

  const PRODUCTS_PER_PAGE = 24;
  let currentPage = 1;
  let currentProducts = [];
  let baseProducts = [];
  let currentSubcategory = null;

  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      cat: p.get('cat') || '',
      sub: p.get('sub') || '',
      brand: p.get('brand') || '',
      page: parseInt(p.get('page')) || 1
    };
  }

  function findCategory(catSlug) {
    if (!THR || !THR.categories) return null;
    for (const key of Object.keys(THR.categories)) {
      const cat = THR.categories[key];
      if (cat.slug === catSlug) return cat;
    }
    if (THR.departmentMap && THR.departmentMap[catSlug]) {
      const departmentNames = {
        freshwater: 'Freshwater',
        saltwater: 'Saltwater',
        pond: 'Pond',
        equipment: 'Equipment',
        food: 'Food',
        decor: 'Decorations'
      };
      const departmentDescriptions = {
        freshwater: 'Aquariums, planted tank care, water conditioners, and testing',
        saltwater: 'Reef systems, protein skimmers, coral supplements, and marine testing',
        pond: 'Koi, pumps, treatments, season prep, and pond food',
        equipment: 'Filtration, lighting, heating, air equipment, and maintenance',
        food: 'Flakes, freeze-dried food, feeders, and pond nutrition',
        decor: 'Ornaments, accents, rockwork, and aquascaping pieces'
      };
      const children = {};
      THR.departmentMap[catSlug].forEach(groupSlug => {
        const group = THR.categories[groupSlug];
        if (!group || !group.children) return;
        Object.values(group.children).forEach(child => {
          children[child.slug] = child;
        });
      });
      return {
        name: departmentNames[catSlug] || catSlug,
        slug: catSlug,
        description: departmentDescriptions[catSlug] || 'Browse department products',
        children
      };
    }
    return null;
  }

  function findSubcategory(cat, subSlug) {
    if (!cat || !cat.children) return null;
    for (const key of Object.keys(cat.children)) {
      const sub = cat.children[key];
      if (sub.slug === subSlug) return sub;
    }
    return null;
  }

  function getProducts(subSlug) {
    if (!window.THR_PRODUCTS || !THR_PRODUCTS[subSlug]) return [];
    return THR_PRODUCTS[subSlug];
  }

  function formatPrice(price) {
    if (!price || price === '') return 'See site';
    return price;
  }

  function parsePrice(price) {
    const number = parseFloat(String(price || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(number) ? number : null;
  }

  // Extract brand name from product name (first word, unless it's a common non-brand prefix)
  function extractBrand(name) {
    if (!name) return '';
    const knownBrands = [
      'Innovative Marine',
      'Red Sea',
      'Two Little Fishies',
      'Zoo Med',
      'San Francisco Bay',
      'Seachem',
      'Fluval',
      'Hikari',
      'Sera',
      'Tetra',
      'Omega',
      'API',
      'Aquatop',
      'Eheim',
      'GloFish',
      'Maxspect',
      'Neptune',
      'Xtreme'
    ];
    const normalized = name.trim().toLowerCase();
    const known = knownBrands.find(brand => normalized.startsWith(brand.toLowerCase()));
    if (known) return known;
    const skipWords = ['copy', 'new', 'the', 'a', 'an'];
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return '';
    const first = parts[0];
    // If first word is all caps or starts with caps and looks like a brand
    if (first.length <= 1) return '';
    if (skipWords.some(w => w === first.toLowerCase())) {
      // Try second word
      if (parts.length > 2 && parts[1].length > 1) return parts[1];
      return '';
    }
    return first;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  }

  function getActiveControls() {
    return {
      query: (document.getElementById('search')?.value || '').trim(),
      brand: document.getElementById('brand-filter')?.value || '',
      sort: document.getElementById('sort-products')?.value || 'featured'
    };
  }

  function sortProducts(products, sort) {
    const sorted = products.slice();
    if (sort === 'name-asc') {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'price-asc') {
      sorted.sort((a, b) => (parsePrice(a.price) ?? Infinity) - (parsePrice(b.price) ?? Infinity));
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => (parsePrice(b.price) ?? -Infinity) - (parsePrice(a.price) ?? -Infinity));
    }
    return sorted;
  }

  function applyProductControls(products) {
    const controls = getActiveControls();
    const query = controls.query.toLowerCase();
    let filtered = products.filter(product => {
      const name = product.name || '';
      const brand = extractBrand(name);
      const matchesQuery = !query || name.toLowerCase().includes(query) || brand.toLowerCase().includes(query);
      const matchesBrand = !controls.brand || brand === controls.brand;
      return matchesQuery && matchesBrand;
    });
    filtered = sortProducts(filtered, controls.sort);
    return filtered;
  }

  function renderProductControls(products) {
    const el = document.getElementById('product-controls');
    if (!el) return;

    const brands = Array.from(new Set(products.map(product => extractBrand(product.name)).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    const brandOptions = brands.map(brand => '<option value="' + escapeHtml(brand) + '">' + escapeHtml(brand) + '</option>').join('');
    el.innerHTML = '<label><span>Brand</span><select id="brand-filter"><option value="">All brands</option>' + brandOptions + '</select></label><label><span>Sort</span><select id="sort-products"><option value="featured">Featured order</option><option value="name-asc">Name A-Z</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option></select></label><button type="button" id="reset-products">Reset</button>';

    el.querySelectorAll('select').forEach(control => {
      control.addEventListener('change', () => updateProductView(1));
    });
    el.querySelector('#reset-products')?.addEventListener('click', () => {
      const searchInput = document.getElementById('search');
      const brandFilter = document.getElementById('brand-filter');
      const sortControl = document.getElementById('sort-products');
      if (searchInput) searchInput.value = '';
      if (brandFilter) brandFilter.value = '';
      if (sortControl) sortControl.value = 'featured';
      updateProductView(1);
    });
  }

  function renderBreadcrumb(cat, sub) {
    const el = document.getElementById('breadcrumb');
    if (!el) return;
    let html = `<a href="../">Home</a><span>›</span>`;
    if (cat) {
      html += `<a href="?cat=${cat.slug}">${cat.name}</a>`;
      if (sub) {
        html += `<span>›</span><span style="color:#fff;">${sub.name}</span>`;
      }
    }
    el.innerHTML = html;
  }

  function renderHeader(cat, sub) {
    const el = document.getElementById('cat-header');
    if (!el) return;
    const title = sub ? sub.name : (cat ? cat.name : 'All Products');
    const desc = sub ? sub.description : (cat ? cat.description : 'Browse our full catalog');
    const sourceUrl = sub ? sub.sourceUrl : '';
    const heroImages = {
      saltwater: '../assets/department/saltwater-reef.jpg',
      aquariums: '../assets/department/freshwater.jpg',
      additives: '../assets/department/aquarium.jpg',
      pond: '../assets/department/pond.jpg',
      equipment: '../assets/department/lighting.jpg',
      lighting: '../assets/department/lighting.jpg',
      food: '../assets/department/food-care.jpg',
      decor: '../assets/department/aquascaping.jpg',
      decorations: '../assets/department/aquascaping.jpg',
      maintenance: '../assets/department/maintenance-care.jpg',
      filtration: '../assets/department/maintenance-care.jpg',
      testing: '../assets/department/maintenance-care.jpg',
      'air-equipment': '../assets/department/maintenance-care.jpg',
      'heating-temperature': '../assets/department/lighting.jpg',
      'protein-skimmers': '../assets/department/saltwater-reef.jpg'
    };
    const heroImage = cat ? heroImages[cat.slug] : '../assets/site/hero-aquatic-world.jpg';
    el.style.setProperty('--cat-hero-image', 'url("' + heroImage + '")');
    let html = `<h1>${title}</h1><p>${desc}</p>`;
    if (sourceUrl) {
      html += `<a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener">View on Hidden Reef site ↗</a>`;
    }
    el.innerHTML = html;
    document.getElementById('page-title').textContent = title + ' — The Hidden Reef';
  }

  function renderSubcatTabs(cat, activeSubSlug) {
    const el = document.getElementById('subcat-tabs');
    if (!el || !cat || !cat.children) return;
    const subs = Object.values(cat.children);
    if (subs.length <= 1) { el.innerHTML = ''; return; }

    let html = `<button class="subcat-tab ${!activeSubSlug ? 'active' : ''}" data-sub="">All ${cat.name}</button>`;
    for (const sub of subs) {
      const isActive = sub.slug === activeSubSlug ? 'active' : '';
      html += `<button class="subcat-tab ${isActive}" data-sub="${sub.slug}">${sub.name}</button>`;
    }
    el.innerHTML = html;

    el.querySelectorAll('.subcat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const subSlug = btn.dataset.sub;
        const url = subSlug ? `?cat=${cat.slug}&sub=${subSlug}` : `?cat=${cat.slug}`;
        window.location.href = url;
      });
    });
  }

  function renderProducts(products, page) {
    const el = document.getElementById('product-grid');
    if (!el) return;

    products = window.THR?.groupProductVariants ? THR.groupProductVariants(products) : products;
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const pageProducts = products.slice(start, end);

    if (pageProducts.length === 0) {
      el.innerHTML = '<p style="color:var(--reef-muted);text-align:center;padding:40px;">No products found.</p>';
      return;
    }

    // Calculate how many columns for row striping
    let html = '';
    pageProducts.forEach((p, i) => {
      const brand = extractBrand(p.name);
      const imgSrc = p.imageUrl || '../assets/site/product-placeholder.jpg';
      const imgAlt = (p.name || 'Product').replace(/"/g, '&quot;');
      const name = (p.name || 'Unknown Product').replace(/</g, '&lt;');
      const price = formatPrice(p.price);
      const url = p.productUrl || '#';
      const pageLabel = p.page > 1 ? `Page ${p.page}` : '';
      const brandHtml = brand ? `<span class="thr-brand">${brand}</span>` : '';
      const badge = pageLabel ? `<span class="thr-page">${pageLabel}</span>` : '';
      const optionBadge = p.variants && p.variants.length > 1 ? `<span class="thr-options">${p.variants.length} options</span>` : '';

      html += `
        <a class="thr-product" href="${url}" target="_blank" rel="noopener">
          <span class="thr-ext" title="View on Hidden Reef">↗</span>
          ${brandHtml}
          <div class="thr-img">
            <img src="${imgSrc}" alt="${imgAlt}" loading="lazy" onerror="this.parentElement.style.background='linear-gradient(180deg,#0c2030,#071a27)';this.style.display='none'" />
            ${badge}
            ${optionBadge}
          </div>
          <div class="thr-info">
            <span class="thr-price">${price}</span>
            <h3 class="thr-name">${name}</h3>
          </div>
        </a>`;
    });
    el.innerHTML = html;
  }

  function renderPagination(total, page) {
    const el = document.getElementById('pagination');
    if (!el) return;

    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
    if (totalPages <= 1) { el.innerHTML = ''; return; }

    const params = getParams();
    let html = '';

    if (page > 1) {
      html += `<button onclick="goPage(${page - 1})">← Prev</button>`;
    }

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      const active = i === page ? 'active' : '';
      html += `<button class="${active}" onclick="goPage(${i})">${i}</button>`;
    }

    if (page < totalPages) {
      html += `<button onclick="goPage(${page + 1})">Next →</button>`;
    }

    html += `<span class="info">Page ${page} of ${totalPages}</span>`;
    el.innerHTML = html;
  }

  function renderCountBar(shown, total, sub) {
    const el = document.getElementById('count-bar');
    if (!el) return;
    const label = sub ? sub.name : 'All products';
    el.innerHTML = `<span>${label}</span><span class="total">${shown} of ${total} products shown</span>`;
  }

  function updateProductView(page) {
    currentPage = page || 1;
    const filteredProducts = applyProductControls(baseProducts);
    currentProducts = window.THR?.groupProductVariants ? THR.groupProductVariants(filteredProducts) : filteredProducts;
    const totalPages = Math.max(1, Math.ceil(currentProducts.length / PRODUCTS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const shown = Math.max(0, Math.min(PRODUCTS_PER_PAGE, currentProducts.length - start));
    renderProducts(currentProducts, currentPage);
    renderCountBar(shown, currentProducts.length, currentSubcategory);
    renderPagination(currentProducts.length, currentPage);
  }

  window.goPage = function(page) {
    updateProductView(page);
    document.getElementById('product-controls')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function init() {
    const params = getParams();
    currentPage = params.page;

    const cat = findCategory(params.cat);
    const sub = params.sub ? findSubcategory(cat, params.sub) : null;
    currentSubcategory = sub;

    renderBreadcrumb(cat, sub);
    renderHeader(cat, sub);
    renderSubcatTabs(cat, params.sub);

    // Get products
    let products;
    if (sub) {
      products = getProducts(sub.slug);
    } else if (cat) {
      products = [];
      if (cat.children) {
        for (const child of Object.values(cat.children)) {
          products = products.concat(getProducts(child.slug));
        }
      }
    } else {
      products = [];
      if (window.THR_PRODUCTS) {
        for (const key of Object.keys(THR_PRODUCTS)) {
          products = products.concat(THR_PRODUCTS[key]);
        }
      }
    }
    baseProducts = products;
    currentProducts = products;
    renderProductControls(products);
    if (params.brand) {
      const brandFilter = document.getElementById('brand-filter');
      if (brandFilter) brandFilter.value = params.brand;
    }

    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', () => updateProductView(1));
    }

    updateProductView(currentPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
