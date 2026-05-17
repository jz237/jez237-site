(function () {
  function ensureModal() {
    let modal = document.querySelector('.link-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'link-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="link-modal__backdrop" data-link-close></div><section class="link-modal__panel" role="dialog" aria-modal="true" aria-labelledby="link-modal-title"><button class="link-modal__close" type="button" data-link-close>Close</button><img class="link-modal__image" alt=""><div class="link-modal__body"><span class="link-modal__eyebrow">Opens on thehiddenreef.com</span><h2 id="link-modal-title"></h2><p></p><div class="link-modal__meta"></div><a class="btn link-modal__open" target="_blank" rel="noopener">Open original Hidden Reef page</a></div></section>';
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

  document.querySelectorAll('.product a[href^="https://www.thehiddenreef.com"], .product-link, .live-link[href^="https://www.thehiddenreef.com"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const card = link.closest('.product') || link.closest('.live-link');
      const modal = ensureModal();
      const title = card?.querySelector('h3, strong')?.textContent?.trim() || link.textContent.trim() || 'Hidden Reef item';
      const desc = card?.dataset.info || card?.querySelector('p, em')?.textContent?.trim() || 'View this item on the real Hidden Reef site.';
      const img = card?.querySelector('img');
      const category = card?.dataset.category || card?.querySelector('span')?.textContent?.trim() || 'Current site link';
      const price = card?.dataset.price || card?.querySelector('.price')?.textContent?.trim() || 'More details available on the original site.';

      modal.querySelector('h2').textContent = title;
      modal.querySelector('p').textContent = desc;
      modal.querySelector('.link-modal__open').href = link.href;
      modal.querySelector('.link-modal__meta').innerHTML = '<strong>' + category + '</strong><span>' + price + '</span><span class="link-modal__url">' + link.href + '</span>';
      modal.querySelector('.link-modal__image').src = img?.getAttribute('src') || 'assets/site/hero-aquatic-world.jpg';
      modal.querySelector('.link-modal__image').alt = img?.getAttribute('alt') || title;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('link-modal-open');
      modal.querySelector('.link-modal__open').focus();
    });
  });
}());
