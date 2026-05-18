// The Hidden Reef — Product Card Renderer (shared)
// Usage: THR.renderProducts(containerEl, productsArray, options)
// Or: THR.renderCategoryInto(containerId, categorySlugs[])

(function() {
  'use strict';

  const PER_PAGE = 24;

  function extractBrand(name) {
    if (!name) return '';
    var skip = ['copy','new','the','a','an'];
    var parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return '';
    var first = parts[0];
    if (first.length <= 1) return '';
    if (skip.some(function(w) { return w === first.toLowerCase(); })) {
      if (parts.length > 2 && parts[1].length > 1) return parts[1];
      return '';
    }
    return first;
  }

  function formatPrice(price) {
    if (!price || price === '') return 'See site';
    return price;
  }

  function renderCards(container, products, page) {
    var start = (page - 1) * PER_PAGE;
    var end = start + PER_PAGE;
    var items = products.slice(start, end);
    if (items.length === 0) {
      container.innerHTML = '<p style="color:var(--reef-muted);text-align:center;padding:40px;">No products found.</p>';
      return;
    }
    var html = '';
    items.forEach(function(p, i) {
      var brand = extractBrand(p.name);
      var imgSrc = p.imageUrl || '../assets/site/product-placeholder.jpg';
      var name = (p.name || 'Unknown Product').replace(/</g, '&lt;');
      var price = formatPrice(p.price);
      var url = p.productUrl || '#';
      var pageLabel = p.page > 1 ? 'Page ' + p.page : '';
      var brandHtml = brand ? '<span class="thr-brand">' + brand + '</span>' : '';
      var badge = pageLabel ? '<span class="thr-page">' + pageLabel + '</span>' : '';

      html += '<a class="thr-product" href="' + url + '" target="_blank" rel="noopener">'
        + '<span class="thr-ext" title="View on Hidden Reef">↗</span>'
        + brandHtml
        + '<div class="thr-img">'
        + '<img src="' + imgSrc + '" alt="' + name.replace(/"/g, '&quot;') + '" loading="lazy" onerror="this.parentElement.style.background=\'linear-gradient(180deg,#0c2030,#071a27)\';this.style.display=\'none\'" />'
        + badge
        + '</div>'
        + '<div class="thr-info">'
        + '<span class="thr-price">' + price + '</span>'
        + '<h3 class="thr-name">' + name + '</h3>'
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

  window.THR = THR;
})();