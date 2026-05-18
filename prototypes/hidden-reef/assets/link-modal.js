(function () {
  function ensureModal() {
    let modal = document.querySelector('.link-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'link-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="link-modal__backdrop" data-link-close></div><section class="link-modal__panel" role="dialog" aria-modal="true" aria-labelledby="link-modal-title"><button class="link-modal__close" type="button" data-link-close>Close</button><div class="link-modal__media"><img class="link-modal__image" alt=""></div><div class="link-modal__body"><span class="link-modal__eyebrow">Product preview</span><h2 id="link-modal-title"></h2><div class="link-modal__facts"></div><p></p><div class="link-modal__status"></div><ul class="link-modal__details"></ul><div class="link-modal__related"></div><div class="link-modal__meta"></div><a class="btn link-modal__open" target="_blank" rel="noopener">View product on Hidden Reef</a></div></section>';
    document.body.appendChild(modal);
    modal.addEventListener('click', event => {
      if (event.target.matches('[data-link-close]')) closeModal(modal);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
    });
    return modal;
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('link-modal-open');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  }

  function normalizeUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      url.hash = '';
      return url.href.replace(/\/$/, '');
    } catch (error) {
      return String(value || '').replace(/\/$/, '');
    }
  }

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
    const skip = ['copy', 'new', 'the', 'a', 'an'];
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return '';
    if (skip.includes(parts[0].toLowerCase())) return parts[1] || '';
    return parts[0];
  }

  function getCatalogGroups() {
    const categories = window.THR?.categories || {};
    const groups = {};
    Object.keys(categories).forEach(groupSlug => {
      const group = categories[groupSlug];
      Object.keys(group.children || {}).forEach(childKey => {
        const child = group.children[childKey];
        groups[child.slug] = {
          groupName: group.name,
          childName: child.name,
          description: child.description,
          sourceUrl: child.sourceUrl
        };
      });
    });
    return groups;
  }

  function getProductContext(href) {
    const target = normalizeUrl(href);
    const groups = getCatalogGroups();
    const productsBySlug = window.THR_PRODUCTS || {};

    for (const slug of Object.keys(productsBySlug)) {
      const products = productsBySlug[slug] || [];
      const product = products.find(item => normalizeUrl(item.productUrl) === target);
      if (product) {
        return {
          product,
          slug,
          related: products.filter(item => normalizeUrl(item.productUrl) !== target).slice(0, 3),
          category: groups[slug] || {}
        };
      }
    }

    return { product: null, slug: '', related: [], category: {} };
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('.product a[href^="https://www.thehiddenreef.com"], .product-link, .live-link[href^="https://www.thehiddenreef.com"], .thr-product[href^="https://www.thehiddenreef.com"]');
    if (!link) return;

    event.preventDefault();
    const card = link.closest('.product') || link.closest('.thr-product') || link.closest('.live-link');
    const modal = ensureModal();
    const context = getProductContext(link.href);
    const product = context.product || {};
    const title = product.name || card?.querySelector('h3, strong')?.textContent?.trim() || link.textContent.trim() || 'Hidden Reef item';
    const categoryName = context.category.childName || card?.dataset.category || card?.querySelector('.thr-brand, span')?.textContent?.trim() || 'Catalog item';
    const departmentName = context.category.groupName || 'Hidden Reef catalog';
    const desc = card?.dataset.info || context.category.description || card?.querySelector('p, em')?.textContent?.trim() || 'Product details are from the current demo catalog import.';
    const img = card?.querySelector('img');
    const price = product.price || card?.dataset.price || card?.querySelector('.price, .thr-price')?.textContent?.trim() || 'See site';
    const source = card?.dataset.source || 'Original Hidden Reef page';
    const details = (card?.dataset.details || '').split('|').map(item => item.trim()).filter(Boolean);
    const url = new URL(link.href);
    const brand = card?.querySelector('.thr-brand')?.textContent?.trim() || extractBrand(title) || 'Hidden Reef';
    const detailItems = details.length ? details : [
      'Listed under ' + departmentName + ' / ' + categoryName + '.',
      'Price reflects the latest static catalog import for this demo.',
      'Availability and final price should be confirmed on the store page or in person.'
    ];
    const relatedHtml = context.related.length
      ? '<strong>Related products</strong><div>' + context.related.map(item => '<a href="' + escapeHtml(item.productUrl) + '" target="_blank" rel="noopener">' + escapeHtml(item.name) + '</a>').join('') + '</div>'
      : '';

    modal.querySelector('h2').textContent = title;
    modal.querySelector('p').textContent = desc;
    modal.querySelector('.link-modal__open').href = link.href;
    modal.querySelector('.link-modal__facts').innerHTML = '<span><strong>Brand</strong>' + escapeHtml(brand) + '</span><span><strong>Price</strong>' + escapeHtml(price) + '</span><span><strong>Department</strong>' + escapeHtml(departmentName) + '</span><span><strong>Category</strong>' + escapeHtml(categoryName) + '</span>';
    modal.querySelector('.link-modal__status').innerHTML = '<strong>Store availability</strong><span>Confirm current stock before visiting. Live inventory comes later when API access is available.</span>';
    modal.querySelector('.link-modal__details').innerHTML = detailItems.map(item => '<li>' + escapeHtml(item) + '</li>').join('');
    modal.querySelector('.link-modal__details').style.display = detailItems.length ? '' : 'none';
    modal.querySelector('.link-modal__related').innerHTML = relatedHtml;
    modal.querySelector('.link-modal__related').style.display = relatedHtml ? '' : 'none';
    modal.querySelector('.link-modal__meta').innerHTML = '<strong>' + escapeHtml(source) + '</strong><span>' + escapeHtml(url.hostname) + '</span><span class="link-modal__url">' + escapeHtml(link.href) + '</span>';
    modal.querySelector('.link-modal__image').src = product.imageUrl || img?.getAttribute('src') || 'assets/site/hero-aquatic-world.jpg';
    modal.querySelector('.link-modal__image').alt = img?.getAttribute('alt') || title;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('link-modal-open');
    modal.querySelector('.link-modal__open').focus();
  });
}());
