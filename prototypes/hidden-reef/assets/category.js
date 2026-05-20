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
        decor: 'Decorations',
        maintenance: 'Maintenance'
      };
      const departmentDescriptions = {
        freshwater: 'Aquariums, planted tank care, water conditioners, and testing',
        saltwater: 'Reef systems, protein skimmers, coral supplements, and marine testing',
        pond: 'Koi, pumps, treatments, season prep, and pond food',
        equipment: 'Filtration, lighting, heating, air equipment, and maintenance',
        food: 'Flakes, freeze-dried food, feeders, and pond nutrition',
        decor: 'Ornaments, accents, rockwork, and aquascaping pieces',
        maintenance: 'Cleaning tools, filter media, water care, and test kits'
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
    const meta = getCategoryMeta(subSlug);
    return THR_PRODUCTS[subSlug].map(product => Object.assign({}, product, {
      categorySlug: subSlug,
      categoryName: meta.childName || '',
      groupSlug: meta.groupSlug || '',
      groupName: meta.groupName || ''
    }));
  }

  function getCategoryMeta(subSlug) {
    const categories = window.THR?.categories || {};
    for (const groupSlug of Object.keys(categories)) {
      const group = categories[groupSlug];
      for (const child of Object.values(group.children || {})) {
        if (child.slug === subSlug) {
          return {
            groupSlug,
            groupName: group.name,
            childName: child.name
          };
        }
      }
    }
    return {};
  }

  function formatPrice(price) {
    if (!price || price === '') return 'See site';
    return price;
  }

  function parsePrice(price) {
    const number = parseFloat(String(price || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(number) ? number : null;
  }

  function extractBrand(name) {
    return window.THR?.extractBrand ? THR.extractBrand(name) : '';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  }

  function getActiveControls() {
    return {
      query: (document.getElementById('search')?.value || '').trim(),
      category: document.getElementById('category-filter')?.value || '',
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
      const matchesCategory = !controls.category || product.groupSlug === controls.category;
      const matchesBrand = !controls.brand || brand === controls.brand;
      return matchesQuery && matchesCategory && matchesBrand;
    });
    filtered = sortProducts(filtered, controls.sort);
    return filtered;
  }

  function renderProductControls(products) {
    const el = document.getElementById('product-controls');
    if (!el) return;

    const brands = Array.from(new Set(products.map(product => extractBrand(product.name)).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    const brandOptions = brands.map(brand => '<option value="' + escapeHtml(brand) + '">' + escapeHtml(brand) + '</option>').join('');
    const categories = Array.from(new Map(products
      .filter(product => product.groupSlug && product.groupName)
      .map(product => [product.groupSlug, product.groupName]))
      .entries())
      .sort((a, b) => a[1].localeCompare(b[1]));
    const categoryOptions = categories.map(([slug, name]) => '<option value="' + escapeHtml(slug) + '">' + escapeHtml(name) + '</option>').join('');
    el.innerHTML = '<label><span>Category</span><select id="category-filter"><option value="">All categories</option>' + categoryOptions + '</select></label><label><span>Brand</span><select id="brand-filter"><option value="">All brands</option>' + brandOptions + '</select></label><label><span>Sort</span><select id="sort-products"><option value="featured">Featured order</option><option value="name-asc">Name A-Z</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option></select></label><button type="button" id="reset-products">Reset</button><a class="home-control" href="../">Home</a>';

    el.querySelectorAll('select').forEach(control => {
      control.addEventListener('change', () => updateProductView(1));
    });
    el.querySelector('#reset-products')?.addEventListener('click', () => {
      const searchInput = document.getElementById('search');
      const categoryFilter = document.getElementById('category-filter');
      const brandFilter = document.getElementById('brand-filter');
      const sortControl = document.getElementById('sort-products');
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = '';
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
      aquariums: '../assets/department/aquarium.jpg',
      additives: '../assets/department/additives.png',
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
    let html = `<div class="cat-header__copy"><h1>${title}</h1><p>${desc}</p></div>`;
    const actions = [];
    if (cat || sub) {
      actions.push('<a class="source-link all-products-link" href="./">View all products</a>');
    }
    if (sourceUrl) {
      actions.push(`<a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener">View on Hidden Reef site ↗</a>`);
    }
    if (actions.length) {
      html += `<div class="cat-header__actions">${actions.join('')}</div>`;
    }
    el.innerHTML = html;
    document.getElementById('page-title').textContent = title + ' — The Hidden Reef';
  }

  function renderDepartmentSwitcher(activeCatSlug) {
    const el = document.getElementById('department-switcher');
    if (!el) return;
    const departments = [
      ['saltwater', 'Saltwater'],
      ['freshwater', 'Freshwater'],
      ['pond', 'Pond'],
      ['aquariums', 'Aquariums'],
      ['additives', 'Additives'],
      ['equipment', 'Equipment'],
      ['food', 'Food'],
      ['decor', 'Decorations'],
      ['maintenance', 'Maintenance']
    ];
    const tabs = departments.map(([slug, label]) => {
      const active = slug === activeCatSlug ? ' active' : '';
      return '<a class="department-tab' + active + '" href="?cat=' + slug + '">' + label + '</a>';
    }).join('');
    el.innerHTML = '<div class="department-tabs" aria-label="Shop by department">' + tabs + '</div><a class="department-all-products" href="./"><span>Reset department</span><strong>Shop all products</strong></a>';
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
    const controls = getActiveControls();
    const selectedCategory = controls.category
      ? document.querySelector('#category-filter option:checked')?.textContent || ''
      : '';
    const label = sub ? sub.name : (selectedCategory || 'All products');
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
    renderDepartmentSwitcher(cat ? cat.slug : '');
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
          products = products.concat(getProducts(key));
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
