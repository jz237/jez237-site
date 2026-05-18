// The Hidden Reef — Category Page Controller
// Reads URL params (?cat=slug&sub=slug) and renders products from THR_PRODUCTS

(function() {
  'use strict';

  const PRODUCTS_PER_PAGE = 24;
  let currentPage = 1;
  let currentProducts = [];

  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return { cat: p.get('cat') || '', sub: p.get('sub') || '', page: parseInt(p.get('page')) || 1 };
  }

  function findCategory(catSlug) {
    if (!THR || !THR.categories) return null;
    for (const key of Object.keys(THR.categories)) {
      const cat = THR.categories[key];
      if (cat.slug === catSlug) return cat;
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

  // Extract brand name from product name (first word, unless it's a common non-brand prefix)
  function extractBrand(name) {
    if (!name) return '';
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
      const brandHtml = brand ? `<span class="brand-pill">${brand}</span>` : '';
      const badge = pageLabel ? `<span class="page-badge">${pageLabel}</span>` : '';

      // Row striping: determine column count approximation
      const rowIndex = Math.floor(i / 5); // assume ~5 cols on desktop
      const rowClass = (rowIndex % 2 === 1) ? ' product-row-even' : '';

      html += `
        <article class="product${rowClass}">
          <a href="${url}" target="_blank" rel="noopener" class="ext-link" title="View on Hidden Reef">↗</a>
          ${brandHtml}
          <div class="img-wrap">
            <img src="${imgSrc}" alt="${imgAlt}" loading="lazy" onerror="this.parentElement.style.background='linear-gradient(180deg,#0c2030,#071a27)';this.style.display='none'" />
            ${badge}
          </div>
          <div class="info-bar">
            <span class="price-tag">${price}</span>
            <h3>${name}</h3>
          </div>
        </article>`;
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

  function filterBySearch(products, query) {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p => (p.name || '').toLowerCase().includes(q));
  }

  window.goPage = function(page) {
    const params = getParams();
    let url = `?cat=${params.cat}`;
    if (params.sub) url += `&sub=${params.sub}`;
    if (page > 1) url += `&page=${page}`;
    window.location.href = url;
  };

  function init() {
    const params = getParams();
    currentPage = params.page;

    const cat = findCategory(params.cat);
    const sub = params.sub ? findSubcategory(cat, params.sub) : null;

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
    currentProducts = products;

    // Search filter
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        const filtered = filterBySearch(products, q);
        currentPage = 1;
        renderProducts(filtered, 1);
        renderCountBar(Math.min(PRODUCTS_PER_PAGE, filtered.length), filtered.length, sub);
        renderPagination(filtered.length, 1);
      });
    }

    // Render
    const filtered = filterBySearch(products, '');
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const shown = Math.min(PRODUCTS_PER_PAGE, filtered.length - start);

    renderProducts(filtered, currentPage);
    renderCountBar(shown > 0 ? shown : filtered.length, filtered.length, sub);
    renderPagination(filtered.length, currentPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();