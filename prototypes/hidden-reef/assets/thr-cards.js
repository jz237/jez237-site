// The Hidden Reef — Product Card Renderer (shared)
// Usage: THR.renderProducts(containerEl, productsArray, options)
// Or: THR.renderCategoryInto(containerId, categorySlugs[])

(function() {
  'use strict';

  const PER_PAGE = 24;

  function extractBrand(name) {
    return window.THR?.extractBrand ? THR.extractBrand(name) : '';
  }

  function formatPrice(price) {
    if (!price || price === '') return 'See site';
    return price;
  }

  function usefulDetail(product, brand) {
    var name = String(product?.name || '');
    var size = name.match(/\b\d+(?:\.\d+)?\s*(?:gal(?:lon)?s?|oz|ml|liters?|litres?|lb|lbs|g|kg|w|watts?|in|inch|pk|pack|ct|count)\b/i);
    if (product?.variants?.length > 1) return product.variants.length + ' options - choose exact size or color';
    if (size) return 'Listed size: ' + size[0].toUpperCase() + ' - confirm fit';
    if (/filter|cartridge|insert|media|impeller|replacement|foam|pad/i.test(name)) return 'Check filter model compatibility';
    if (/heater|light|lamp|pump|powerhead|skimmer|wavemaker/i.test(name)) return 'Match output to tank size';
    if (/food|flake|pellet|wafer|treat|frozen/i.test(name)) return 'Match food to species and mouth size';
    return brand ? 'Brand: ' + brand + ' - open for full details' : 'Open for size, stock, and compatibility';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function(char) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char];
    });
  }

  /* Variant keys strip color/size/package tokens so siblings group together.
     The brand is kept as a key prefix (so same-sounding products from
     different brands never merge), while the brand name and its initials
     ("IM" for Innovative Marine) are stripped from the name portion so
     inconsistently prefixed listings still match. */
  function normalizeVariantKey(product) {
    var rawName = String(product?.name || '');
    var name = rawName.toLowerCase();
    var brand = String((window.THR?.extractBrand && THR.extractBrand(rawName)) || '').toLowerCase();
    var brandPrefix = '';
    if (brand) {
      brandPrefix = brand.replace(/[^a-z0-9]+/g, '');
      if (name.indexOf(brand) === 0) name = name.slice(brand.length);
      var initials = brand.split(/\s+/).map(function(word) { return word.charAt(0); }).join('');
      if (initials.length > 1) name = name.replace(new RegExp('^\\s*' + initials + '\\b'), '');
    }
    return brandPrefix + name
      .replace(/\b(teak|white|black|blue|red|green|brown|gray|grey|silver|tan|clear|assorted|orange|yellow|pink|purple|teal|ivory|beige)\b/g, '')
      .replace(/\b\d+(\.\d+)?\s*(oz|ml|l|liter|litre|gal|gallon|gallons|g|w|watt|watts|lb|lbs|pk|pack|ct|count|in|inch|\")\b/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function variantIdentity(product) {
    return product?.productUrl || product?.name || '';
  }

  /* The same product can be cross-listed in several catalog groups; only
     distinct product URLs count as real variants. */
  function dedupeVariants(variants) {
    var seen = {};
    var out = [];
    (variants || []).forEach(function(variant) {
      var id = variantIdentity(variant);
      if (id && seen[id]) return;
      if (id) seen[id] = true;
      out.push(variant);
    });
    return out;
  }

  function groupProductVariants(products) {
    var groups = [];
    var indexByKey = {};
    (products || []).forEach(function(product) {
      var key = normalizeVariantKey(product) || normalizeVariantKey({ name: product?.productUrl || product?.name });
      var variants = Array.isArray(product?.variants) ? product.variants : [product];
      if (!key || !indexByKey[key]) {
        var representative = Object.assign({}, product);
        representative.variants = dedupeVariants(variants);
        groups.push(representative);
        indexByKey[key] = representative;
        return;
      }
      indexByKey[key].variants = dedupeVariants(indexByKey[key].variants.concat(variants));
    });
    return groups;
  }

  function renderCards(container, products, page) {
    products = groupProductVariants(products);
    var start = (page - 1) * PER_PAGE;
    var end = start + PER_PAGE;
    var items = products.slice(start, end);
    if (items.length === 0) {
      container.innerHTML = '<p style="color:var(--reef-muted);text-align:center;padding:40px;">No products found. Try a shorter search.</p>';
      return;
    }
    var html = '';
    items.forEach(function(p, i) {
      var brand = extractBrand(p.name);
      var imgSrc = p.imageUrl || '../assets/site/product-placeholder.jpg';
      var name = escapeHtml(p.name || 'Unknown Product');
      var price = escapeHtml(formatPrice(p.price));
      var url = escapeHtml(p.productUrl || '#');
      var brandHtml = brand ? '<span class="thr-brand">' + escapeHtml(brand) + '</span>' : '';
      var optionBadge = p.variants && p.variants.length > 1 ? '<span class="thr-options">' + p.variants.length + ' options</span>' : '';
      var detail = escapeHtml(usefulDetail(p, brand));

      html += '<a class="thr-product" href="' + url + '" target="_blank" rel="noopener">'
        + '<span class="thr-ext" title="View on Hidden Reef">↗</span>'
        + brandHtml
        + '<div class="thr-img">'
        + '<img src="' + escapeHtml(imgSrc) + '" alt="' + name + '" loading="lazy" onerror="this.parentElement.style.background=\'linear-gradient(180deg,#0c2030,#071a27)\';this.style.display=\'none\'" />'
        + optionBadge
        + '</div>'
        + '<div class="thr-info">'
        + '<span class="thr-price">' + price + '</span>'
        + '<h3 class="thr-name">' + name + '</h3>'
        + '<span class="thr-detail">' + detail + '</span>'
        + '</div>'
        + '</a>';
    });
    container.innerHTML = html;
  }

  function getProducts(slugs) {
    if (!window.THR_PRODUCTS) return [];
    var products = [];
    slugs.forEach(function(slug) {
      if (THR_PRODUCTS[slug]) {
        products = products.concat(THR_PRODUCTS[slug]);
      }
    });
    return products;
  }

  function filterProducts(products, query) {
    var q = String(query || '').trim().toLowerCase();
    if (!q) return products;
    return (products || []).filter(function(product) {
      var name = product?.name || '';
      var brand = extractBrand(name);
      var price = product?.price || '';
      return name.toLowerCase().includes(q) ||
        brand.toLowerCase().includes(q) ||
        price.toLowerCase().includes(q);
    });
  }

  function bindSearch(container, products) {
    if (!container || container.dataset.searchBound === 'true') return;
    var form = document.querySelector('.search-box');
    var input = form?.querySelector('input');
    if (!form || !input) return;

    container.dataset.searchBound = 'true';
    function applySearch() {
      var results = filterProducts(products, input.value);
      /* No hits in this department's products: search the whole catalog. */
      if (!results.length && String(input.value || '').trim() && window.THR_PRODUCTS) {
        var all = [];
        Object.keys(THR_PRODUCTS).forEach(function(k) {
          all = all.concat(THR_PRODUCTS[k]);
        });
        results = filterProducts(all, input.value);
      }
      renderCards(container, results, 1);
    }
    input.addEventListener('input', applySearch);
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      applySearch();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  var THR = window.THR || {};

  THR.renderProducts = function(containerId, slugs, page) {
    page = page || 1;
    var container = document.getElementById(containerId);
    if (!container) return;
    var products = getProducts(slugs);
    // Add thr-product-grid class if not present
    if (!container.classList.contains('thr-product-grid')) {
      container.classList.add('thr-product-grid');
    }
    renderCards(container, products, page);
    bindSearch(container, products);
  };

  THR.renderProductList = function(containerId, products, page) {
    page = page || 1;
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!container.classList.contains('thr-product-grid')) {
      container.classList.add('thr-product-grid');
    }
    renderCards(container, products || [], page);
  };

  THR.renderAllInto = function(containerId, page) {
    page = page || 1;
    var container = document.getElementById(containerId);
    if (!container) return;
    var products = [];
    if (window.THR_PRODUCTS) {
      Object.keys(THR_PRODUCTS).forEach(function(k) {
        products = products.concat(THR_PRODUCTS[k]);
      });
    }
    if (!container.classList.contains('thr-product-grid')) {
      container.classList.add('thr-product-grid');
    }
    renderCards(container, products, page);
  };

  THR.normalizeVariantKey = normalizeVariantKey;
  THR.groupProductVariants = groupProductVariants;

  window.THR = THR;
})();
