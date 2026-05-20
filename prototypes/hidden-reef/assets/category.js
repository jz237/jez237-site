// The Hidden Reef — Category Page Controller
// Reads URL params (?cat=slug&sub=slug) and renders products from THR_PRODUCTS

(function() {
  'use strict';

  const PRODUCTS_PER_PAGE = 24;
  const NEW_ARRIVALS_FILTER = 'new-arrivals';
  const NEW_ARRIVAL_SLUGS = ['starter-kits', 'planted', 'flake-tropical', 'skimmers', 'pond-supplies', 'led-fixtures', 'ornaments', 'gravel-cleaners', 'controllers', 'pumps'];
  const pageConfig = window.THR_CATEGORY_CONFIG || {};
  const categoryBase = pageConfig.categoryBase || './';
  const assetBase = pageConfig.assetBase || '../assets';
  const homeHref = pageConfig.homeHref || '../';
  const defaultFilter = pageConfig.defaultFilter || '';
  let currentPage = 1;
  let currentProducts = [];
  let baseProducts = [];
  let currentCategory = null;
  let currentSubcategory = null;
  let currentResultLabel = '';
  let showNewArrivalsFilter = false;
  let categoryHeroRotator = 0;

  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      cat: p.get('cat') || '',
      sub: p.get('sub') || '',
      filter: p.get('filter') || '',
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

  function findSubcategoryGlobal(subSlug) {
    if (!THR || !THR.categories) return null;
    for (const key of Object.keys(THR.categories)) {
      const sub = findSubcategory(THR.categories[key], subSlug);
      if (sub) return sub;
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

  function getCategoryProducts(cat) {
    let products = [];
    if (!cat || !cat.children) return products;
    for (const child of Object.values(cat.children)) {
      products = products.concat(getProducts(child.slug));
    }
    return products;
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

  function getProductKey(product) {
    return product.productUrl || product.name || '';
  }

  function getNewArrivalKeys(products) {
    const keys = new Set();
    NEW_ARRIVAL_SLUGS.forEach(slug => {
      products
        .filter(product => product.categorySlug === slug)
        .slice(0, 3)
        .forEach(product => keys.add(getProductKey(product)));
    });
    return keys;
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
    const newArrivalKeys = controls.category === NEW_ARRIVALS_FILTER ? getNewArrivalKeys(products) : null;
    let filtered = products.filter(product => {
      const name = product.name || '';
      const brand = extractBrand(name);
      const matchesQuery = !query || name.toLowerCase().includes(query) || brand.toLowerCase().includes(query);
      const matchesCategory = !controls.category ||
        (controls.category === NEW_ARRIVALS_FILTER ? newArrivalKeys.has(getProductKey(product)) : product.groupSlug === controls.category);
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
      .filter(product => product.groupSlug !== 'aquariums')
      .map(product => [product.groupSlug, product.groupName]))
      .entries())
      .sort((a, b) => a[1].localeCompare(b[1]));
    const newArrivalsOption = showNewArrivalsFilter ? '<option value="' + NEW_ARRIVALS_FILTER + '">New Arrivals</option>' : '';
    const categoryOptions = newArrivalsOption + categories.map(([slug, name]) => '<option value="' + escapeHtml(slug) + '">' + escapeHtml(name) + '</option>').join('');
    el.innerHTML = '<label><span>Category</span><select id="category-filter"><option value="">All categories</option>' + categoryOptions + '</select></label><label><span>Brand</span><select id="brand-filter"><option value="">All brands</option>' + brandOptions + '</select></label><label><span>Sort</span><select id="sort-products"><option value="featured">Featured order</option><option value="name-asc">Name A-Z</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option></select></label><button type="button" id="reset-products">Reset</button><a class="home-control" href="' + homeHref + '">Home</a>';

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
    if (categoryHeroRotator) {
      window.clearInterval(categoryHeroRotator);
      categoryHeroRotator = 0;
    }
    el.classList.remove('is-rotating');
    const title = sub ? sub.name : (cat ? cat.name + ' Dept.' : 'All Products');
    const desc = sub ? sub.description : (cat ? cat.description : 'Browse our full catalog');
    const sourceUrl = sub ? sub.sourceUrl : '';
    const heroImages = {
      freshwater: assetBase + '/department/freshwater.jpg',
      saltwater: assetBase + '/department/saltwater-reef.jpg',
      aquariums: assetBase + '/department/aquarium.jpg',
      additives: assetBase + '/department/additives.png',
      pond: assetBase + '/department/pond.jpg',
      equipment: assetBase + '/department/lighting.jpg',
      lighting: assetBase + '/department/lighting.jpg',
      food: assetBase + '/department/food-care.jpg',
      decor: assetBase + '/department/aquascaping.jpg',
      decorations: assetBase + '/department/aquascaping.jpg',
      maintenance: assetBase + '/department/maintenance-care.jpg',
      filtration: assetBase + '/department/maintenance-care.jpg',
      testing: assetBase + '/department/maintenance-care.jpg',
      'air-equipment': assetBase + '/department/maintenance-care.jpg',
      'heating-temperature': assetBase + '/department/lighting.jpg',
      'protein-skimmers': assetBase + '/department/saltwater-reef.jpg'
    };
    const heroRotators = {
      freshwater: [
        assetBase + '/department/freshwater.jpg',
        assetBase + '/department/freshwater-hero-2.jpg',
        assetBase + '/department/freshwater-hero-3.jpg',
        assetBase + '/department/freshwater-hero-4.jpg',
        assetBase + '/department/freshwater-hero-5.jpg'
      ]
    };
    const heroImage = cat ? heroImages[cat.slug] : assetBase + '/site/hero-aquatic-world.jpg';
    const rotatorImages = cat ? heroRotators[cat.slug] : null;
    el.style.setProperty('--cat-hero-image', 'url("' + heroImage + '")');
    let html = '';
    if (rotatorImages && rotatorImages.length > 1 && !sub) {
      el.classList.add('is-rotating');
      html += '<div class="cat-hero-slides" aria-hidden="true"><img class="cat-hero-slide is-active" src="' + rotatorImages[0] + '" alt="" fetchpriority="high"><img class="cat-hero-slide" src="' + rotatorImages[1] + '" alt="" loading="eager"></div>';
    }
    html += `<div class="cat-header__copy"><h1>${title}</h1><p>${desc}</p></div>`;
    const actions = [];
    if (sourceUrl) {
      actions.push(`<a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener">View on Hidden Reef site ↗</a>`);
    }
    if (actions.length) {
      html += `<div class="cat-header__actions">${actions.join('')}</div>`;
    }
    el.innerHTML = html;
    if (rotatorImages && rotatorImages.length > 1 && !sub) {
      startCategoryHeroRotator(el, rotatorImages);
    }
    document.getElementById('page-title').textContent = title + ' — The Hidden Reef';
  }

  function startCategoryHeroRotator(header, images) {
    const slides = Array.from(header.querySelectorAll('.cat-hero-slide'));
    if (slides.length < 2) return;
    images.slice(1).forEach(src => {
      const image = new Image();
      image.src = src;
    });
    let activeImage = 0;
    let activeLayer = 0;
    categoryHeroRotator = window.setInterval(async () => {
      activeImage = (activeImage + 1) % images.length;
      const nextLayer = activeLayer === 0 ? 1 : 0;
      const incomingSlide = slides[nextLayer];
      const outgoingSlide = slides[activeLayer];
      incomingSlide.src = images[activeImage];
      if (incomingSlide.decode) {
        try {
          await incomingSlide.decode();
        } catch (error) {
          // Continue with the browser's normal image loading behavior.
        }
      }
      requestAnimationFrame(() => {
        incomingSlide.classList.add('is-active');
        outgoingSlide.classList.remove('is-active');
        activeLayer = nextLayer;
      });
    }, 4000);
  }

  function renderDepartmentSwitcher(activeCatSlug) {
    const el = document.getElementById('department-switcher');
    if (!el) return;
    const departments = [
      ['saltwater', 'Saltwater'],
      ['freshwater', 'Freshwater'],
      ['pond', 'Pond'],
      ['additives', 'Additives'],
      ['equipment', 'Equipment'],
      ['food', 'Food'],
      ['decor', 'Decorations'],
      ['maintenance', 'Maintenance']
    ];
    const tabs = departments.map(([slug, label]) => {
      const active = slug === activeCatSlug ? ' active' : '';
      return '<a class="department-tab' + active + '" href="' + categoryBase + '?cat=' + slug + '">' + label + '</a>';
    }).join('');
    el.innerHTML = '<div class="department-tabs" aria-label="Shop by department">' + tabs + '</div><a class="department-all-products" href="' + categoryBase + '"><span>Reset department</span><strong>Shop all products</strong></a>';
  }

  const sidebarConfig = {
    saltwater: [
      {
        title: 'Saltwater & Reef',
        open: true,
        items: [
          { type: 'link', label: 'All Saltwater & Reef', href: '?cat=saltwater', active: true },
          { type: 'check', label: 'Fish & Livestock (in-store)' },
          { type: 'check', label: 'Corals & Frags (in-store)' },
          { type: 'check', label: 'Invertebrates (in-store)' },
          { type: 'check', label: 'Cleanup Crew (in-store)' },
          { type: 'link', label: 'Reef Systems & Tanks', href: '?cat=saltwater&sub=starter-kits' }
        ]
      },
      {
        title: 'Equipment',
        items: [
          { type: 'link', label: 'Skimmers & Filtration', href: '?cat=saltwater&sub=skimmers' },
          { type: 'link', label: 'Lighting & Spectrum', href: '?cat=equipment&sub=led-fixtures' },
          { type: 'link', label: 'Flow & Powerheads', href: '?cat=saltwater&sub=wave-makers' },
          { type: 'link', label: 'Controllers & Monitors', href: '?cat=saltwater&sub=controllers' }
        ]
      },
      {
        title: 'Food & Care',
        items: [
          { type: 'link', label: 'Salt Mix & Additives', href: '?cat=additives' },
          { type: 'link', label: 'Test Kits & Refractometers', href: '?cat=maintenance' },
          { type: 'link', label: 'Calcium, Alk & Magnesium', href: '?cat=additives' },
          { type: 'link', label: 'Water Conditioner', href: '?cat=additives&sub=water-conditioners' }
        ]
      },
      {
        title: 'Quick Tips',
        items: [
          { type: 'check', label: 'Tank size and sump plan' },
          { type: 'check', label: 'Lighting for coral goals' },
          { type: 'check', label: 'Flow and dead spots' },
          { type: 'check', label: 'Salt, testing, stability' },
          { type: 'check', label: 'Livestock compatibility' }
        ]
      }
    ],
    freshwater: [
      {
        title: 'Freshwater Categories',
        open: true,
        items: [
          { type: 'link', label: 'All Freshwater', href: '?cat=freshwater', active: true },
          { type: 'check', label: 'Tetras & Community (in-store)' },
          { type: 'check', label: 'Cichlids (in-store)' },
          { type: 'check', label: 'Betta & Gourami (in-store)' },
          { type: 'check', label: 'Livebearers (in-store)' },
          { type: 'link', label: 'Planted Tanks', href: '?cat=additives&sub=planted' },
          { type: 'check', label: 'Goldfish & Koi (in-store)' },
          { type: 'check', label: 'Invertebrates (in-store)' }
        ]
      },
      {
        title: 'Equipment',
        items: [
          { type: 'link', label: 'Filters & Filtration', href: '?cat=equipment' },
          { type: 'link', label: 'Heaters & Thermometers', href: '?cat=equipment&sub=heaters' },
          { type: 'link', label: 'Lighting', href: '?cat=equipment&sub=led-fixtures' },
          { type: 'link', label: 'Air Pumps & Accessories', href: '?cat=equipment&sub=air-pumps' }
        ]
      },
      {
        title: 'Food & Care',
        items: [
          { type: 'link', label: 'Flake Food', href: '?cat=food&sub=flake-tropical' },
          { type: 'link', label: 'Pellets & Granules', href: '?cat=food&sub=flake-tropical' },
          { type: 'link', label: 'Freeze-Dried', href: '?cat=food&sub=freeze-dry' },
          { type: 'link', label: 'Water Conditioner', href: '?cat=additives&sub=water-conditioners' }
        ]
      },
      {
        title: 'Beginner Tips',
        items: [
          { type: 'check', label: 'Choose tank size first' },
          { type: 'check', label: 'Cycle before stocking' },
          { type: 'check', label: 'Match fish temperament' },
          { type: 'check', label: 'Do not overfeed' },
          { type: 'check', label: 'Test water before guessing' }
        ]
      }
    ],
    aquariums: [
      {
        title: 'Aquariums',
        open: true,
        items: [
          { type: 'link', label: 'All Aquariums', href: '?cat=aquariums', active: true },
          { type: 'link', label: 'Starter Aquarium Kits', href: '?cat=aquariums&sub=starter-kits' },
          { type: 'link', label: 'Aquarium & Stand Combos', href: '?cat=aquariums&sub=aquarium-and-stand' },
          { type: 'check', label: 'Glass and acrylic options (ask staff)' },
          { type: 'check', label: 'Cabinet and stand planning' }
        ]
      },
      {
        title: 'Related Departments',
        items: [
          { type: 'link', label: 'Freshwater', href: '?cat=freshwater' },
          { type: 'link', label: 'Saltwater', href: '?cat=saltwater' },
          { type: 'link', label: 'Equipment', href: '?cat=equipment' },
          { type: 'link', label: 'Decorations', href: '?cat=decor' }
        ]
      }
    ],
    additives: [
      {
        title: 'Additives',
        open: true,
        items: [
          { type: 'link', label: 'All Additives', href: '?cat=additives', active: true },
          { type: 'link', label: 'Water Conditioners', href: '?cat=additives&sub=water-conditioners' },
          { type: 'link', label: 'Planted Tank Additives', href: '?cat=additives&sub=planted' },
          { type: 'link', label: 'Coral & Saltwater Supplements', href: '?cat=additives&sub=coral-supplements' },
          { type: 'check', label: 'Bring a water sample for advice' }
        ]
      },
      {
        title: 'Related Departments',
        items: [
          { type: 'link', label: 'Freshwater', href: '?cat=freshwater' },
          { type: 'link', label: 'Saltwater', href: '?cat=saltwater' },
          { type: 'link', label: 'Maintenance', href: '?cat=maintenance' },
          { type: 'link', label: 'Food & Care', href: '?cat=food' }
        ]
      }
    ],
    pond: [
      {
        title: 'Pond & Water Garden',
        open: true,
        items: [
          { type: 'link', label: 'All Pond', href: '?cat=pond', active: true },
          { type: 'check', label: 'Koi & Pond Fish (in-store)' },
          { type: 'check', label: 'Pond Plants (in-store)' },
          { type: 'link', label: 'Pumps & Filtration', href: '?cat=pond&sub=pond-pumps' },
          { type: 'link', label: 'Waterfalls & Aeration', href: '?cat=pond&sub=pond-pumps' }
        ]
      },
      {
        title: 'Equipment',
        items: [
          { type: 'link', label: 'Pumps & Waterfall Kits', href: '?cat=pond&sub=pond-pumps' },
          { type: 'link', label: 'Pond Lighting', href: '?cat=equipment&sub=led-fixtures' },
          { type: 'check', label: 'Liners & Underlayment (ask staff)' },
          { type: 'check', label: 'Netting & Predators (ask staff)' }
        ]
      },
      {
        title: 'Food & Care',
        items: [
          { type: 'link', label: 'Pond Food & Feeding', href: '?cat=pond&sub=pond-food' },
          { type: 'link', label: 'Water Treatments', href: '?cat=maintenance' },
          { type: 'link', label: 'Bacteria & Startup', href: '?cat=maintenance' },
          { type: 'link', label: 'Seasonal Care', href: '?cat=maintenance' }
        ]
      }
    ],
    equipment: [
      {
        title: 'Equipment',
        open: true,
        items: [
          { type: 'link', label: 'All Equipment', href: '?cat=equipment', active: true },
          { type: 'link', label: 'Filters & Canisters', href: '?cat=equipment&sub=canister-filters' },
          { type: 'link', label: 'Heaters & Chillers', href: '?cat=equipment&sub=heaters' },
          { type: 'link', label: 'Lighting Fixtures', href: '?cat=equipment&sub=led-fixtures' },
          { type: 'link', label: 'Air Pumps & Accessories', href: '?cat=equipment&sub=air-pumps' }
        ]
      },
      {
        title: 'Related Departments',
        items: [
          { type: 'link', label: 'Filter Media & Replacement', href: '?cat=maintenance' },
          { type: 'link', label: 'Food & Water Care', href: '?cat=food' },
          { type: 'link', label: 'Freshwater', href: '?cat=freshwater' },
          { type: 'link', label: 'Saltwater', href: '?cat=saltwater' }
        ]
      }
    ],
    food: [
      {
        title: 'Food & Water Care',
        open: true,
        items: [
          { type: 'link', label: 'All Food & Care', href: '?cat=food', active: true },
          { type: 'link', label: 'Flake Food', href: '?cat=food&sub=flake-tropical' },
          { type: 'link', label: 'Pellets & Granules', href: '?cat=food&sub=flake-tropical' },
          { type: 'link', label: 'Freeze-Dried Treats', href: '?cat=food&sub=freeze-dry' },
          { type: 'check', label: 'Frozen Food (in-store)' }
        ]
      },
      {
        title: 'Equipment',
        items: [
          { type: 'link', label: 'Automatic Feeders', href: '?cat=food&sub=feeders' },
          { type: 'link', label: 'Feeding Lids & Clips', href: '?cat=food&sub=feeders' },
          { type: 'link', label: 'Water Conditioner', href: '?cat=additives&sub=water-conditioners' },
          { type: 'link', label: 'Bacteria & Additives', href: '?cat=additives' }
        ]
      }
    ],
    decor: [
      {
        title: 'Decorations',
        open: true,
        items: [
          { type: 'link', label: 'All Decorations', href: '?cat=decor', active: true },
          { type: 'link', label: 'Ornaments & Hides', href: '?cat=decor&sub=ornaments' },
          { type: 'link', label: 'Driftwood & Rock', href: '?cat=decor&sub=all-decorations' },
          { type: 'link', label: 'Artificial Plants', href: '?cat=decor&sub=all-decorations' },
          { type: 'link', label: 'Backgrounds', href: '?cat=decor&sub=all-decorations' }
        ]
      },
      {
        title: 'Related Departments',
        items: [
          { type: 'link', label: 'Aquascaping Tools', href: '?cat=decor' },
          { type: 'link', label: 'Substrate & Gravel', href: '?cat=decor&sub=all-decorations' },
          { type: 'link', label: 'Live Plants', href: '?cat=freshwater' },
          { type: 'link', label: 'LED Plant Lighting', href: '?cat=equipment&sub=led-fixtures' }
        ]
      }
    ],
    maintenance: [
      {
        title: 'Maintenance',
        open: true,
        items: [
          { type: 'link', label: 'All Maintenance', href: '?cat=maintenance', active: true },
          { type: 'link', label: 'Test Kits', href: '?cat=maintenance' },
          { type: 'link', label: 'Filter Media', href: '?cat=maintenance' },
          { type: 'link', label: 'Algae Control', href: '?cat=maintenance&sub=gravel-cleaners' },
          { type: 'link', label: 'Cleaning Tools', href: '?cat=maintenance&sub=gravel-cleaners' }
        ]
      },
      {
        title: 'Equipment',
        items: [
          { type: 'link', label: 'Gravel Vac & Siphons', href: '?cat=maintenance&sub=gravel-cleaners' },
          { type: 'link', label: 'Magnetic Cleaners', href: '?cat=maintenance&sub=gravel-cleaners' },
          { type: 'link', label: 'Filter Replacements', href: '?cat=maintenance' },
          { type: 'link', label: 'Water Change Systems', href: '?cat=maintenance&sub=gravel-cleaners' }
        ]
      }
    ]
  };

  function renderDepartmentSidebar(cat) {
    const el = document.getElementById('department-sidebar');
    if (!el) return;
    const layout = el.closest('.shopping-layout');
    if (!cat || !sidebarConfig[cat.slug]) {
      el.innerHTML = '';
      layout?.classList.add('sidebar-empty');
      return;
    }
    layout?.classList.remove('sidebar-empty');
    const html = sidebarConfig[cat.slug].map((section, index) => {
      const sectionHasActive = section.items.some(item => {
        if (item.type !== 'link') return false;
        const itemParams = new URLSearchParams(item.href.replace(/^\?/, ''));
        const itemSub = itemParams.get('sub') || '';
        const itemCat = itemParams.get('cat') || '';
        return currentSubcategory ? itemSub === currentSubcategory.slug : itemCat === cat.slug && !itemSub;
      });
      const open = section.open || index === 0 || sectionHasActive;
      const items = section.items.map(item => {
        if (item.type === 'check') {
          return '<div class="check-item">' + escapeHtml(item.label) + '</div>';
        }
        const itemParams = new URLSearchParams(item.href.replace(/^\?/, ''));
        const itemSub = itemParams.get('sub') || '';
        const itemCat = itemParams.get('cat') || '';
        const isActive = currentSubcategory ? itemSub === currentSubcategory.slug : itemCat === cat.slug && !itemSub;
        const active = isActive ? ' class="active-filter"' : '';
        return '<a href="' + item.href + '" data-sidebar-filter="true"' + active + '>' + escapeHtml(item.label) + '</a>';
      }).join('');
      return '<div class="sidebar-section"><button class="sidebar-toggle" type="button" aria-expanded="' + (open ? 'true' : 'false') + '">' + escapeHtml(section.title) + ' <span class="arrow">▶</span></button><div class="sidebar-body' + (open ? ' open' : '') + '"><div class="sidebar-body-inner">' + items + '</div></div></div>';
    }).join('');
    el.innerHTML = html;
    el.querySelectorAll('.sidebar-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const body = button.nextElementSibling;
        const isOpen = body.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
    el.querySelectorAll('[data-sidebar-filter]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        applySidebarFilter(link);
      });
    });
  }

  function applySidebarFilter(link) {
    if (!currentCategory) return;
    const params = new URLSearchParams(link.getAttribute('href').replace(/^\?/, ''));
    const targetCat = findCategory(params.get('cat') || '');
    const subSlug = params.get('sub') || '';
    const targetSub = subSlug ? findSubcategory(targetCat, subSlug) || findSubcategoryGlobal(subSlug) : null;
    const activeSection = link.closest('.sidebar-section');

    document.querySelectorAll('#department-sidebar .active-filter').forEach(active => active.classList.remove('active-filter'));
    link.classList.add('active-filter');
    if (activeSection) {
      activeSection.querySelector('.sidebar-body')?.classList.add('open');
      activeSection.querySelector('.sidebar-toggle')?.setAttribute('aria-expanded', 'true');
    }

    if (targetSub) {
      currentSubcategory = targetSub;
      currentResultLabel = targetSub.name;
      baseProducts = getProducts(targetSub.slug);
    } else if (targetCat && targetCat.slug !== currentCategory.slug) {
      currentSubcategory = null;
      currentResultLabel = targetCat.name;
      baseProducts = getCategoryProducts(targetCat);
    } else {
      currentSubcategory = null;
      currentResultLabel = currentCategory.name;
      baseProducts = getCategoryProducts(currentCategory);
    }

    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');
    const sortControl = document.getElementById('sort-products');
    if (categoryFilter) categoryFilter.value = '';
    if (brandFilter) brandFilter.value = '';
    if (sortControl) sortControl.value = 'featured';
    updateProductView(1);
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
      const imgSrc = p.imageUrl || assetBase + '/site/product-placeholder.jpg';
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
    const label = selectedCategory || currentResultLabel || (sub ? sub.name : 'All products');
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
    currentCategory = cat;
    currentSubcategory = sub;
    currentResultLabel = sub ? sub.name : (cat ? cat.name : '');
    showNewArrivalsFilter = !cat && !sub;

    renderBreadcrumb(cat, sub);
    renderHeader(cat, sub);
    renderDepartmentSwitcher(cat ? cat.slug : '');
    renderDepartmentSidebar(cat);

    // Get products
    let products;
    if (sub) {
      products = getProducts(sub.slug);
    } else if (cat) {
      products = getCategoryProducts(cat);
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
    const initialFilter = params.filter || defaultFilter;
    if (showNewArrivalsFilter && initialFilter === NEW_ARRIVALS_FILTER) {
      const categoryFilter = document.getElementById('category-filter');
      if (categoryFilter) categoryFilter.value = NEW_ARRIVALS_FILTER;
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
