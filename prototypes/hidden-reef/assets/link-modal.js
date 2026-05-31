(function () {
  const IMAGE_ZOOM_SCALE = 2.55;

  function ensureModal() {
    let modal = document.querySelector('.link-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'link-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="link-modal__backdrop" data-link-close></div><section class="link-modal__panel" role="dialog" aria-modal="true" aria-labelledby="link-modal-title"><button class="link-modal__close" type="button" data-link-close>Close</button><div class="link-modal__gallery"><div class="link-modal__media" aria-label="Product image. Hover to zoom in the preview pane."><img class="link-modal__image" alt=""><span class="link-modal__zoom-lens" aria-hidden="true"></span><span class="link-modal__zoom-hint">Roll over image to zoom in</span></div><div class="link-modal__thumbs" aria-label="Product images"></div></div><div class="link-modal__zoom-pane" aria-hidden="true"><img class="link-modal__zoom-image" alt=""></div><div class="link-modal__body"><span class="link-modal__eyebrow">Product details</span><h2 id="link-modal-title"></h2><div class="link-modal__facts"></div><p></p><div class="link-modal__variants"></div><div class="link-modal__status"></div><ul class="link-modal__details"></ul><div class="link-modal__related"></div><div class="link-modal__meta"></div><div class="link-modal__actions"><button class="btn link-modal__add" type="button">Add to preview list</button><a class="btn secondary link-modal__open" target="_blank" rel="noopener">View on Hidden Reef</a></div></div></section>';
    document.body.appendChild(modal);
    modal.addEventListener('click', event => {
      if (event.target.matches('[data-link-close]')) closeModal(modal);
      if (event.target.matches('.link-modal__add')) {
        const button = event.target;
        addToCart({
          name: button.dataset.name,
          price: button.dataset.price,
          url: button.dataset.url,
          image: button.dataset.image
        });
        closeModal(modal);
        openCart();
      }
      const thumb = event.target.closest('.link-modal__thumb');
      if (thumb) {
        event.preventDefault();
        setModalImage(modal, Number(thumb.dataset.modalImageIndex || 0));
      }
    });
    modal.addEventListener('change', event => {
      if (!event.target.matches('.link-modal__variant-select')) return;
      const selected = event.target.selectedOptions[0];
      if (selected) setModalVariant(modal, {
        name: selected.dataset.name,
        price: selected.dataset.price,
        url: selected.value,
        image: selected.dataset.image,
        images: parseJsonList(selected.dataset.images),
        barcode: selected.dataset.barcode
      });
    });
    initImageZoom(modal);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
    });
    return modal;
  }

  function closeModal(modal) {
    resetImageZoom(modal);
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('link-modal-open');
  }

  function setImageZoom(modal, event) {
    const panel = modal.querySelector('.link-modal__panel');
    const media = modal.querySelector('.link-modal__media');
    const zoomImage = modal.querySelector('.link-modal__zoom-image');
    if (!panel || !media || !zoomImage || !event) return;
    const rect = media.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    media.style.setProperty('--modal-lens-x', x.toFixed(2) + '%');
    media.style.setProperty('--modal-lens-y', y.toFixed(2) + '%');
    zoomImage.style.setProperty('--modal-zoom-x', x.toFixed(2) + '%');
    zoomImage.style.setProperty('--modal-zoom-y', y.toFixed(2) + '%');
    zoomImage.style.setProperty('--modal-image-zoom', String(IMAGE_ZOOM_SCALE));
    media.classList.add('is-zoomed');
    panel.classList.add('is-image-zooming');
  }

  function resetImageZoom(modal) {
    const panel = modal.querySelector('.link-modal__panel');
    const media = modal.querySelector('.link-modal__media');
    const zoomImage = modal.querySelector('.link-modal__zoom-image');
    media?.classList.remove('is-zoomed');
    panel?.classList.remove('is-image-zooming');
    if (media) {
      media.style.removeProperty('--modal-lens-x');
      media.style.removeProperty('--modal-lens-y');
    }
    if (zoomImage) {
      zoomImage.style.removeProperty('--modal-zoom-x');
      zoomImage.style.removeProperty('--modal-zoom-y');
      zoomImage.style.removeProperty('--modal-image-zoom');
    }
  }

  function initImageZoom(modal) {
    const media = modal.querySelector('.link-modal__media');
    if (!media) return;

    media.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      setImageZoom(modal, event);
    });

    media.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') resetImageZoom(modal);
    });

    media.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') resetImageZoom(modal);
    });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  }

  function parseJsonList(value) {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function uniqueList(items) {
    const seen = new Set();
    return items.filter(item => {
      const value = String(item || '').trim();
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  function getProductImages(product, fallbackImage) {
    if (product?.images?.length) return uniqueList(product.images);
    return uniqueList([product?.imageUrl, fallbackImage]);
  }

  function setModalImage(modal, imageIndex) {
    const images = parseJsonList(modal.dataset.images);
    const image = images[imageIndex] || images[0] || '';
    const imageNode = modal.querySelector('.link-modal__image');
    const zoomImage = modal.querySelector('.link-modal__zoom-image');
    if (!imageNode || !image) return;
    resetImageZoom(modal);
    imageNode.src = image;
    if (zoomImage) zoomImage.src = image;
    modal.querySelector('.link-modal__add').dataset.image = image;
    modal.querySelectorAll('.link-modal__thumb').forEach((button, index) => {
      button.classList.toggle('active', index === imageIndex);
      button.setAttribute('aria-pressed', index === imageIndex ? 'true' : 'false');
    });
  }

  function renderImageGallery(modal, images, title) {
    const normalizedImages = uniqueList(images);
    const gallery = modal.querySelector('.link-modal__gallery');
    const thumbs = modal.querySelector('.link-modal__thumbs');
    modal.dataset.images = JSON.stringify(normalizedImages);
    gallery?.classList.toggle('has-thumbs', normalizedImages.length > 1);
    if (!thumbs) return;
    if (normalizedImages.length <= 1) {
      thumbs.innerHTML = '';
      thumbs.style.display = 'none';
    } else {
      thumbs.style.display = '';
      thumbs.innerHTML = normalizedImages.map((image, index) => '<button class="link-modal__thumb' + (index === 0 ? ' active' : '') + '" type="button" data-modal-image-index="' + index + '" aria-label="View product image ' + (index + 1) + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '"><img src="' + escapeHtml(image) + '" alt="' + escapeHtml(title || 'Product image') + ' thumbnail"></button>').join('');
    }
    setModalImage(modal, 0);
  }

  const CART_KEY = 'hiddenReefDemoCart';
  const LIGHTSPEED_CART_URL = 'https://www.thehiddenreef.com/';

  function parsePrice(price) {
    const value = parseFloat(String(price || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? value : 0;
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function ensureCartDrawer() {
    const drawerNoteHtml = '<strong>Preview list only.</strong> This is not a live order or checkout. Final availability, discounts, shipping, tax, and payment are handled on The Hidden Reef site or in store.';
    let drawer = document.querySelector('.drawer');
    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.className = 'drawer';
      drawer.setAttribute('aria-label', 'Preview list drawer');
      drawer.innerHTML = '<div class="drawer-head"><h2>Preview list</h2><button class="close-cart" type="button">Close</button></div><div id="cart-items" class="cart-items"></div><p id="empty-cart" class="empty-cart">Your preview list is empty. Add products you want to check with the store.</p><div class="cart-summary"></div><p class="drawer-note">' + drawerNoteHtml + '</p><a class="btn cart-handoff" href="https://www.thehiddenreef.com/" target="_blank" rel="noopener">Shop on Hidden Reef site →</a>';
      document.body.appendChild(drawer);
    }
    const title = drawer.querySelector('.drawer-head h2');
    if (title) title.textContent = 'Preview list';
    const empty = drawer.querySelector('#empty-cart');
    if (empty) empty.textContent = 'Your preview list is empty. Add products you want to check with the store.';
    if (!drawer.querySelector('.cart-summary')) {
      const summary = document.createElement('div');
      summary.className = 'cart-summary';
      drawer.querySelector('#empty-cart')?.after(summary);
    }
    if (!drawer.querySelector('.drawer-note')) {
      const note = document.createElement('p');
      note.className = 'drawer-note';
      note.innerHTML = drawerNoteHtml;
      drawer.querySelector('.cart-summary')?.after(note);
    }
    const note = drawer.querySelector('.drawer-note');
    if (note) note.innerHTML = drawerNoteHtml;
    const handoff = drawer.querySelector('.cart-handoff') || drawer.querySelector('.drawer .btn, .btn');
    if (handoff) {
      handoff.classList.add('cart-handoff');
      handoff.textContent = 'Shop on Hidden Reef site →';
      handoff.setAttribute('href', LIGHTSPEED_CART_URL);
      handoff.setAttribute('target', '_blank');
      handoff.setAttribute('rel', 'noopener');
    }
    return drawer;
  }

  function updateCartCount(items) {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-button span').forEach(countNode => {
      countNode.textContent = String(count);
    });
    document.querySelectorAll('.cart-button').forEach(button => {
      button.setAttribute('aria-label', count ? 'Open preview list with ' + count + ' item' + (count === 1 ? '' : 's') : 'Open empty preview list');
    });
  }

  function renderCart() {
    const drawer = ensureCartDrawer();
    const items = readCart();
    updateCartCount(items);
    const list = drawer.querySelector('#cart-items');
    const empty = drawer.querySelector('#empty-cart');
    const summary = drawer.querySelector('.cart-summary');
    const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);

    if (empty) empty.style.display = items.length ? 'none' : '';
    if (list) {
      list.innerHTML = items.map((item, index) => '<div class="cart-item"><div><strong>' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.price || 'See site') + '</span><div class="cart-qty" aria-label="Quantity controls"><button type="button" data-cart-dec="' + index + '" aria-label="Decrease quantity">−</button><strong>' + item.qty + '</strong><button type="button" data-cart-inc="' + index + '" aria-label="Increase quantity">+</button></div></div><button type="button" data-cart-remove="' + index + '">Remove</button></div>').join('');
    }
    if (summary) {
      summary.innerHTML = items.length ? '<span>Reference subtotal</span><strong>$' + total.toFixed(2) + '</strong>' : '<span>Reference subtotal</span><strong>$0.00</strong>';
    }
  }

  function addToCart(product) {
    const items = readCart();
    const key = normalizeUrl(product.url || product.name);
    const existing = items.find(item => item.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        key,
        name: product.name || 'Hidden Reef item',
        price: product.price || 'See site',
        url: product.url || 'https://www.thehiddenreef.com/',
        image: product.image || '',
        qty: 1
      });
    }
    writeCart(items);
    renderCart();
  }

  function openCart() {
    const drawer = ensureCartDrawer();
    renderCart();
    drawer.classList.add('is-open');
    drawer.style.transform = 'translateX(0)';
    document.body.classList.add('cart-open');
  }

  function initDemoCart() {
    document.querySelectorAll('.cart-button strong').forEach(label => {
      label.textContent = 'Cart';
    });
    ensureCartDrawer();
    renderCart();
    document.addEventListener('click', event => {
      const cartButton = event.target.closest('.cart-button');
      if (cartButton) {
        event.preventDefault();
        openCart();
      }
      if (event.target.matches('.close-cart')) {
        const drawer = document.querySelector('.drawer');
        drawer?.classList.remove('is-open');
        if (drawer) drawer.style.transform = '';
        document.body.classList.remove('cart-open');
      }
      const remove = event.target.closest('[data-cart-remove]');
      if (remove) {
        const items = readCart();
        items.splice(Number(remove.dataset.cartRemove), 1);
        writeCart(items);
        renderCart();
      }
      const inc = event.target.closest('[data-cart-inc]');
      if (inc) {
        const items = readCart();
        const item = items[Number(inc.dataset.cartInc)];
        if (item) item.qty += 1;
        writeCart(items);
        renderCart();
      }
      const dec = event.target.closest('[data-cart-dec]');
      if (dec) {
        const items = readCart();
        const index = Number(dec.dataset.cartDec);
        const item = items[index];
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) items.splice(index, 1);
        }
        writeCart(items);
        renderCart();
      }
    });
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
    return window.THR?.extractBrand ? THR.extractBrand(name) : '';
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
    const normalizeVariantKey = window.THR?.normalizeVariantKey || fallbackVariantKey;

    for (const slug of Object.keys(productsBySlug)) {
      const products = productsBySlug[slug] || [];
      const product = products.find(item => normalizeUrl(item.productUrl) === target);
      if (product) {
        const variantKey = normalizeVariantKey(product);
        const variants = products.filter(item => normalizeVariantKey(item) === variantKey);
        return {
          product,
          slug,
          variants,
          related: products
            .filter(item => normalizeUrl(item.productUrl) !== target && normalizeVariantKey(item) !== variantKey)
            .slice(0, 3),
          category: groups[slug] || {}
        };
      }
    }

    return { product: null, slug: '', variants: [], related: [], category: {} };
  }

  function fallbackVariantKey(product) {
    return (product?.name || '')
      .toLowerCase()
      .replace(/\b(teak|white|black|blue|red|green|brown|gray|grey|silver|tan|clear|assorted)\b/g, '')
      .replace(/\b\d+(\.\d+)?\s*(oz|ml|l|liter|litre|gal|g|w|lb|lbs|pk|pack|ct|count|in|inch|\")\b/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function setModalVariant(modal, variant) {
    const title = variant.name || 'Hidden Reef item';
    const price = variant.price || 'See site';
    const url = variant.url || 'https://www.thehiddenreef.com/';
    const images = getProductImages({ imageUrl: variant.image, images: variant.images }, variant.image);
    const image = images[0] || '';
    const barcode = variant.barcode || '';
    modal.querySelector('h2').textContent = title;
    modal.querySelector('.link-modal__open').href = url;
    const addButton = modal.querySelector('.link-modal__add');
    addButton.dataset.name = title;
    addButton.dataset.price = price;
    addButton.dataset.url = url;
    addButton.dataset.image = image;
    const imageNode = modal.querySelector('.link-modal__image');
    imageNode.alt = title;
    renderImageGallery(modal, images, title);
    const priceFact = modal.querySelector('[data-modal-price]');
    if (priceFact) priceFact.textContent = price;
    const urlNode = modal.querySelector('.link-modal__url');
    if (urlNode) urlNode.textContent = url;
    const barcodeNode = modal.querySelector('.link-modal__barcode');
    if (barcodeNode) {
      barcodeNode.textContent = barcode ? 'Barcode: ' + barcode : '';
      barcodeNode.style.display = barcode ? '' : 'none';
    }
  }

  function renderVariantSelector(modal, variants, activeUrl) {
    const wrap = modal.querySelector('.link-modal__variants');
    if (!wrap) return;
    if (!variants || variants.length <= 1) {
      wrap.innerHTML = '';
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = '';
    wrap.innerHTML = '<label for="link-modal-variant">Options</label><select id="link-modal-variant" class="link-modal__variant-select">' + variants.map(item => {
      const selected = normalizeUrl(item.productUrl) === normalizeUrl(activeUrl) ? ' selected' : '';
      return '<option value="' + escapeHtml(item.productUrl || '') + '" data-name="' + escapeHtml(item.name || '') + '" data-price="' + escapeHtml(item.price || 'See site') + '" data-image="' + escapeHtml(item.imageUrl || '') + '" data-images="' + escapeHtml(JSON.stringify(item.images || [])) + '" data-barcode="' + escapeHtml(item.barcode || '') + '"' + selected + '>' + escapeHtml(item.name || 'Option') + ' - ' + escapeHtml(item.price || 'See site') + '</option>';
    }).join('') + '</select><span>Select the exact color, size, or package before adding it to your cart.</span>';
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
    const desc = card?.dataset.info || context.category.description || card?.querySelector('p, em')?.textContent?.trim() || 'Check the product page for current details, options, and availability.';
    const img = card?.querySelector('img');
    const productImages = getProductImages(product, img?.getAttribute('src') || 'assets/site/hero-aquatic-world.jpg');
    const price = product.price || card?.dataset.price || card?.querySelector('.price, .thr-price')?.textContent?.trim() || 'See site';
    const source = card?.dataset.source || 'Original Hidden Reef page';
    const barcode = product.barcode || '';
    const details = (card?.dataset.details || '').split('|').map(item => item.trim()).filter(Boolean);
    const url = new URL(link.href);
    const brand = card?.querySelector('.thr-brand')?.textContent?.trim() || extractBrand(title) || 'Hidden Reef';
    const detailItems = details.length ? details : [
      'Listed under ' + departmentName + ' / ' + categoryName + '.',
      'Current online price is shown for reference.',
      'Availability and final price are confirmed on the store page or in person.'
    ];
    const relatedHtml = context.related.length
      ? '<strong>Related products</strong><div>' + context.related.map(item => '<a class="product-link" href="' + escapeHtml(item.productUrl) + '">' + escapeHtml(item.name) + '</a>').join('') + '</div>'
      : '';

    modal.querySelector('h2').textContent = title;
    modal.querySelector('p').textContent = desc;
    modal.querySelector('.link-modal__open').href = link.href;
    const addButton = modal.querySelector('.link-modal__add');
    addButton.dataset.name = title;
    addButton.dataset.price = price;
    addButton.dataset.url = link.href;
    addButton.dataset.image = productImages[0] || '';
    modal.querySelector('.link-modal__facts').innerHTML = '<span><strong>Brand</strong>' + escapeHtml(brand) + '</span><span><strong>Price</strong><em data-modal-price>' + escapeHtml(price) + '</em></span><span><strong>Department</strong>' + escapeHtml(departmentName) + '</span><span><strong>Category</strong>' + escapeHtml(categoryName) + '</span>';
    renderVariantSelector(modal, context.variants, link.href);
    modal.querySelector('.link-modal__status').innerHTML = '<strong>Store availability</strong><span>Stock can change quickly. Check the product page or contact the store before making a special trip.</span>';
    modal.querySelector('.link-modal__details').innerHTML = detailItems.map(item => '<li>' + escapeHtml(item) + '</li>').join('');
    modal.querySelector('.link-modal__details').style.display = detailItems.length ? '' : 'none';
    modal.querySelector('.link-modal__related').innerHTML = relatedHtml;
    modal.querySelector('.link-modal__related').style.display = relatedHtml ? '' : 'none';
    modal.querySelector('.link-modal__meta').innerHTML = '<strong>' + escapeHtml(source) + '</strong><span>' + escapeHtml(url.hostname) + '</span><span class="link-modal__barcode"' + (barcode ? '' : ' style="display:none"') + '>' + (barcode ? 'Barcode: ' + escapeHtml(barcode) : '') + '</span><span class="link-modal__url">' + escapeHtml(link.href) + '</span>';
    modal.querySelector('.link-modal__image').alt = img?.getAttribute('alt') || title;
    renderImageGallery(modal, productImages, title);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('link-modal-open');
    modal.querySelector('.link-modal__panel').scrollTop = 0;
    modal.querySelector('.link-modal__close').focus();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoCart);
  } else {
    initDemoCart();
  }
}());
