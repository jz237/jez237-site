(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionScale = prefersReducedMotion ? 0 : 1;
  const canvas = document.querySelector('[data-reef-background]');
  if (!canvas) return;

  const pathAndQuery = (window.location.pathname + window.location.search).toLowerCase();
  const biomeName = [
    'saltwater', 'freshwater', 'pond', 'equipment', 'food', 'decor', 'maintenance', 'learn'
  ].find(function(name) { return pathAndQuery.includes(name); }) || 'open-water';
  const biomeThemes = {
    'open-water': { primary: [64, 217, 255], secondary: [121, 108, 225], fish: [133, 226, 244] },
    saltwater: { primary: [70, 220, 255], secondary: [145, 105, 238], fish: [129, 225, 244] },
    freshwater: { primary: [66, 224, 184], secondary: [84, 174, 116], fish: [152, 235, 197] },
    pond: { primary: [120, 210, 166], secondary: [230, 171, 74], fish: [239, 185, 88] },
    equipment: { primary: [88, 205, 255], secondary: [93, 130, 232], fish: [137, 213, 243] },
    food: { primary: [96, 220, 225], secondary: [242, 144, 76], fish: [240, 185, 110] },
    decor: { primary: [104, 211, 204], secondary: [183, 111, 231], fish: [173, 219, 218] },
    maintenance: { primary: [79, 208, 237], secondary: [88, 174, 166], fish: [139, 221, 226] },
    learn: { primary: [78, 218, 240], secondary: [255, 153, 78], fish: [154, 224, 232] }
  };
  const biome = biomeThemes[biomeName];
  const rgba = function(rgb, alpha) {
    return 'rgba(' + rgb.join(',') + ',' + alpha + ')';
  };
  document.documentElement.dataset.reefBiome = biomeName;
  document.documentElement.style.setProperty('--reef-accent', 'rgb(' + biome.primary.join(',') + ')');
  document.documentElement.style.setProperty('--reef-accent-soft', rgba(biome.primary, 0.18));

  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  });
  document.documentElement.classList.add('has-reef-background');
  if (!document.getElementById('reef-background-glass-style')) {
    const style = document.createElement('style');
    style.id = 'reef-background-glass-style';
    style.textContent = [
      '.has-reef-background{background:#03182c!important;}',
      '.has-reef-background body{background:transparent!important;}',
      '.has-reef-background .page{background:transparent!important;}',
      '.has-reef-background .header:not(.masthead),',
      '.has-reef-background .main-nav,',
      '.has-reef-background .preview-banner,',
      '.has-reef-background .catalog-frame,',
      '.has-reef-background .shopping-tools,',
      '.has-reef-background .product-controls,',
      '.has-reef-background .department-tabs,',
      '.has-reef-background .department-switcher,',
      '.has-reef-background .department-sidebar,',
      '.has-reef-background .product-results,',
      '.has-reef-background .sidebar,',
      '.has-reef-background .panel,',
      '.has-reef-background .path-card,',
      '.has-reef-background .style-card,',
      '.has-reef-background .care-card,',
      '.has-reef-background .routine-card,',
      '.has-reef-background .path-link,',
      '.has-reef-background .guide,',
      '.has-reef-background .live-link,',
      '.has-reef-background .learn-panel,',
      '.has-reef-background .learn-column,',
      '.has-reef-background .learn-disclosure,',
      '.has-reef-background .infographic-toggle,',
      '.has-reef-background .visual-band,',
      '.has-reef-background .callout,',
      '.has-reef-background .step-card,',
      '.has-reef-background .type-card,',
      '.has-reef-background .cause-card,',
      '.has-reef-background .product-card,',
      '.has-reef-background .gear-card,',
      '.has-reef-background .footer{',
      'background:radial-gradient(circle at 100% 0%,var(--reef-accent-soft),transparent 38%),rgba(7,26,39,.82)!important;',
      'backdrop-filter:blur(8px) saturate(1.08);',
      '}',
      '.has-reef-background .thr-product,',
      '.has-reef-background .brand-tile,',
      '.has-reef-background .product{background:rgba(231,243,247,.96)!important;}',
      '.has-reef-background .thr-product .thr-img,',
      '.has-reef-background .thr-product .thr-info,',
      '.has-reef-background .product img{background:linear-gradient(145deg,rgba(244,250,252,.98),rgba(224,239,244,.96))!important;}',
      '.has-reef-background .drawer,',
      '.has-reef-background .link-modal__panel{background:rgba(7,26,39,.94)!important;}',
      '.has-reef-background .link-modal__backdrop{background:rgba(0,8,16,.72)!important;backdrop-filter:blur(7px);}',
      '.has-reef-background .link-modal__panel{border-color:rgba(116,205,235,.32)!important;box-shadow:0 28px 80px rgba(0,0,0,.58),0 0 0 1px rgba(64,217,255,.08)!important;}',
      '.preview-banner{position:relative;padding-right:48px!important;}',
      '.preview-banner__close{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:28px;height:28px;border:1px solid rgba(116,205,235,.26);border-radius:50%;color:#dff8ff;background:rgba(2,17,29,.62);cursor:pointer;font:900 16px/1 system-ui;}',
      '.preview-banner__close:hover,.preview-banner__close:focus-visible{border-color:var(--reef-accent);background:rgba(64,217,255,.14);}',
      '.preview-banner[hidden]{display:none!important;}',
      '.mobile-filter-toggle,.mobile-filter-backdrop{display:none;}',
      '@media(max-width:760px){',
      '.preview-banner{grid-template-columns:1fr!important;padding:12px 44px 12px 12px!important;}',
      '.preview-banner>a{justify-self:start;}',
      '.mobile-filter-toggle{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));z-index:130;display:flex;align-items:center;justify-content:center;gap:8px;min-width:178px;min-height:46px;padding:10px 18px;border:1px solid rgba(116,205,235,.42);border-radius:999px;color:#fff;background:linear-gradient(135deg,rgba(0,113,151,.98),rgba(35,57,117,.98));box-shadow:0 14px 32px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.12);font:900 14px/1 system-ui;transform:translate(-50%,80px);opacity:0;pointer-events:none;transition:transform .26s cubic-bezier(.22,.8,.25,1),opacity .2s ease;cursor:pointer;}',
      '.mobile-filter-toggle.is-visible,body.mobile-filters-open .mobile-filter-toggle{transform:translate(-50%,0);opacity:1;pointer-events:auto;}',
      'body.link-modal-open .mobile-filter-toggle,body.cart-open .mobile-filter-toggle{display:none!important;}',
      '.mobile-filter-toggle::before{content:"\\2699";font-size:18px;}',
      '.mobile-filter-backdrop{position:fixed;inset:0;z-index:118;background:rgba(0,8,16,.72);backdrop-filter:blur(5px);}',
      'body.mobile-filters-open .mobile-filter-backdrop{display:block;}',
      '.product-controls.mobile-filter-panel{position:fixed!important;left:8px!important;right:8px!important;bottom:max(68px,calc(58px + env(safe-area-inset-bottom)))!important;z-index:125!important;display:grid!important;max-height:min(72vh,590px);margin:0!important;padding:16px!important;overflow:auto;border:1px solid rgba(116,205,235,.38)!important;border-radius:14px!important;background:rgba(3,24,43,.97)!important;box-shadow:0 24px 70px rgba(0,0,0,.66)!important;transform:translateY(calc(100% + 100px));opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.22,.8,.25,1),opacity .2s ease;}',
      'body.mobile-filters-open .product-controls.mobile-filter-panel{transform:translateY(0);opacity:1;pointer-events:auto;}',
      'body.mobile-filters-open{overflow:hidden;}',
      '}',
      '@media(prefers-reduced-motion:reduce){.product-controls.mobile-filter-panel{transition:none!important;}}'
    ].join('');
    document.head.appendChild(style);
  }
  Array.from(document.body.children).forEach(function(child) {
    if (child === canvas || child.tagName === 'SCRIPT') return;
    if (window.getComputedStyle(child).position !== 'static') return;
    child.style.position = 'relative';
    child.style.zIndex = '1';
  });

  function enhanceMasthead() {
    const nav = document.querySelector('.header.masthead + .main-nav');
    const brand = document.querySelector('.header.masthead .brand');
    if (!nav || !brand || nav.querySelector('.main-nav__compact-brand')) return;

    if (!nav.id) nav.id = 'hidden-reef-main-nav';

    const compactBrand = document.createElement('a');
    compactBrand.className = 'main-nav__compact-brand';
    compactBrand.href = brand.href;
    compactBrand.textContent = 'Hidden Reef';
    compactBrand.setAttribute('aria-label', 'The Hidden Reef home');

    const menu = document.createElement('button');
    menu.className = 'main-nav__menu';
    menu.type = 'button';
    menu.setAttribute('aria-controls', nav.id);
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open store navigation');
    menu.textContent = 'Menu';

    const actions = document.createElement('div');
    actions.className = 'main-nav__actions';
    actions.innerHTML = [
      '<a href="/category/" aria-label="Search products"><span aria-hidden="true">&#8981;</span><span>Search</span></a>',
      '<a href="https://www.thehiddenreef.com/" target="_blank" rel="noopener" aria-label="Shop on the official Hidden Reef site"><span aria-hidden="true">&#8599;</span><span>Shop</span></a>'
    ].join('');

    nav.insertBefore(compactBrand, nav.firstChild);
    nav.insertBefore(menu, compactBrand.nextSibling);
    nav.appendChild(actions);

    menu.addEventListener('click', function() {
      const open = nav.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close store navigation' : 'Open store navigation');
      menu.textContent = open ? 'Close' : 'Menu';
    });

    nav.addEventListener('click', function(event) {
      if (!event.target.closest('a') || window.innerWidth > 760) return;
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open store navigation');
      menu.textContent = 'Menu';
    });

    const updateCompactHeader = function() {
      const threshold = Math.max(72, Math.round(brand.getBoundingClientRect().height * 0.55));
      document.documentElement.classList.toggle('has-compact-masthead', window.scrollY > threshold);
    };
    window.addEventListener('scroll', updateCompactHeader, { passive: true });
    updateCompactHeader();
  }

  function enhancePreviewNotice() {
    const banner = document.querySelector('.preview-banner');
    if (!banner || banner.querySelector('.preview-banner__close')) return;
    const storageKey = 'hidden-reef-preview-notice-dismissed';
    try {
      if (window.sessionStorage.getItem(storageKey) === 'yes') banner.hidden = true;
    } catch (error) {
      /* The notice remains visible when storage is unavailable. */
    }

    const close = document.createElement('button');
    close.className = 'preview-banner__close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Hide preview storefront notice for this visit');
    close.textContent = '\u00d7';
    close.addEventListener('click', function() {
      banner.hidden = true;
      try {
        window.sessionStorage.setItem(storageKey, 'yes');
      } catch (error) {
        /* Hiding the notice still works for the current page. */
      }
    });
    banner.appendChild(close);
  }

  function enhanceMobileFilters() {
    const controls = document.querySelector('.product-controls');
    if (!controls || document.querySelector('.mobile-filter-toggle')) return;

    const finish = function() {
      if (!controls.children.length || controls.classList.contains('mobile-filter-panel')) return false;
      controls.classList.add('mobile-filter-panel');

      const toggle = document.createElement('button');
      toggle.className = 'mobile-filter-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Filters & sort';

      const backdrop = document.createElement('button');
      backdrop.className = 'mobile-filter-backdrop';
      backdrop.type = 'button';
      backdrop.setAttribute('aria-label', 'Close filters');

      const setOpen = function(open) {
        document.body.classList.toggle('mobile-filters-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Close filters' : 'Filters & sort';
      };

      toggle.addEventListener('click', function() {
        setOpen(!document.body.classList.contains('mobile-filters-open'));
      });
      backdrop.addEventListener('click', function() { setOpen(false); });
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') setOpen(false);
      });
      window.addEventListener('resize', function() {
        if (window.innerWidth > 760) setOpen(false);
      }, { passive: true });

      (controls.closest('main') || document.body).appendChild(backdrop);
      document.body.appendChild(toggle);

      const filterSection = controls.closest('section') || controls;
      if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver(function(entries) {
          toggle.classList.toggle('is-visible', entries.some(function(entry) { return entry.isIntersecting; }));
        }, { threshold: 0, rootMargin: '8% 0px 8% 0px' });
        visibilityObserver.observe(filterSection);
      } else {
        toggle.classList.add('is-visible');
      }
      return true;
    };

    if (finish()) return;
    const observer = new MutationObserver(function() {
      if (!finish()) return;
      observer.disconnect();
    });
    observer.observe(controls, { childList: true });
  }

  enhanceMasthead();
  enhancePreviewNotice();
  enhanceMobileFilters();

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let bubbles = [];
  let fish = [];
  let raf = 0;
  let last = performance.now();

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.65);
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDesktop = width >= 900;
    const count = prefersReducedMotion
      ? 0
      : Math.round(Math.min(isDesktop ? 88 : 24, Math.max(isDesktop ? 46 : 12, width / (isDesktop ? 22 : 24))));
    bubbles = Array.from({ length: count }, function(_, index) {
      const featured = isDesktop && index % 9 === 0;
      return {
        x: random(-40, width + 40),
        y: random(-height * 0.2, height * 1.15),
        radius: random(featured ? 3.2 : 1.1, featured ? 7.4 : 4.2),
        speed: random(isDesktop ? 9 : 8, isDesktop ? 28 : 23),
        wobble: random(8, isDesktop ? 36 : 26),
        phase: random(0, Math.PI * 2),
        alpha: random(isDesktop ? 0.08 : 0.07, isDesktop ? 0.27 : 0.21)
      };
    });

    fish = prefersReducedMotion ? [] : Array.from({ length: isDesktop ? 5 : 2 }, function(_, index) {
      const direction = index % 2 === 0 ? 1 : -1;
      return {
        x: direction > 0 ? random(-width * 0.3, width * 0.45) : random(width * 0.55, width * 1.3),
        y: random(height * 0.16, height * 0.82),
        size: random(isDesktop ? 8 : 6, isDesktop ? 15 : 10),
        speed: random(isDesktop ? 4 : 3, isDesktop ? 9 : 6),
        alpha: random(0.035, 0.085),
        direction: direction,
        phase: random(0, Math.PI * 2)
      };
    });
  }

  function drawCaustics(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const isDesktop = width >= 900;
    for (let band = 0; band < (isDesktop ? 7 : 4); band += 1) {
      const yBase = height * (0.14 + band * (isDesktop ? 0.15 : 0.22));
      const amp = (isDesktop ? 14 : 10) + band * 1.8;
      const drift = time * motionScale * (0.00028 + band * 0.000018);
      const gradient = ctx.createLinearGradient(0, yBase - 26, width, yBase + 38);
      gradient.addColorStop(0, rgba(biome.primary, 0));
      gradient.addColorStop(0.5, rgba(biome.primary, isDesktop ? 0.065 : 0.04));
      gradient.addColorStop(1, rgba(biome.primary, 0));
      ctx.strokeStyle = gradient;
      ctx.lineWidth = (isDesktop ? 1.6 : 1.2) + (band % 3) * 0.5;
      ctx.beginPath();
      for (let x = -40; x <= width + 44; x += 28) {
        const y = yBase
          + Math.sin(x * 0.012 + drift * 3.1 + band) * amp
          + Math.sin(x * 0.027 - drift * 2.4) * (amp * 0.34);
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLightRays(time) {
    if (width < 900) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let ray = 0; ray < 4; ray += 1) {
      const center = width * (0.12 + ray * 0.24) + Math.sin(time * motionScale * 0.00016 + ray) * 38;
      const top = -height * 0.05;
      const bottom = height * 1.08;
      const rayWidth = width * (0.08 + (ray % 3) * 0.025);
      const gradient = ctx.createLinearGradient(center, top, center + rayWidth, bottom);
      gradient.addColorStop(0, rgba(biome.primary, 0.075));
      gradient.addColorStop(0.48, rgba(biome.primary, 0.025));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(center - rayWidth * 0.45, top);
      ctx.lineTo(center + rayWidth * 0.35, top);
      ctx.lineTo(center + rayWidth * 1.6, bottom);
      ctx.lineTo(center - rayWidth * 0.85, bottom);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBubble(bubble, time) {
    const x = bubble.x + Math.sin(time * motionScale * 0.0012 + bubble.phase) * bubble.wobble;
    const y = bubble.y;
    const glow = ctx.createRadialGradient(
      x - bubble.radius * 0.35,
      y - bubble.radius * 0.35,
      bubble.radius * 0.1,
      x,
      y,
      bubble.radius * 1.7
    );
    glow.addColorStop(0, 'rgba(255,255,255,' + Math.min(0.65, bubble.alpha + 0.2) + ')');
    glow.addColorStop(0.34, 'rgba(152,236,255,' + bubble.alpha + ')');
    glow.addColorStop(1, 'rgba(64,217,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, bubble.radius * 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(214,250,255,' + Math.min(0.48, bubble.alpha + 0.1) + ')';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(x, y, bubble.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawFish(fishItem, time, dt) {
    const bob = Math.sin(time * 0.00055 + fishItem.phase) * fishItem.size * 0.5;
    ctx.save();
    ctx.translate(fishItem.x, fishItem.y + bob);
    ctx.scale(fishItem.direction, 1);
    ctx.globalAlpha = fishItem.alpha;
    ctx.fillStyle = rgba(biome.fish, 1);

    ctx.beginPath();
    ctx.ellipse(0, 0, fishItem.size * 1.45, fishItem.size * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-fishItem.size * 1.2, 0);
    ctx.lineTo(-fishItem.size * 2.05, -fishItem.size * 0.72);
    ctx.lineTo(-fishItem.size * 2.05, fishItem.size * 0.72);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = fishItem.alpha * 1.8;
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.beginPath();
    ctx.arc(fishItem.size * 0.82, -fishItem.size * 0.13, Math.max(0.7, fishItem.size * 0.08), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    fishItem.x += fishItem.speed * fishItem.direction * motionScale * dt / 1000;
    const margin = fishItem.size * 3;
    if (fishItem.direction > 0 && fishItem.x > width + margin) fishItem.x = -margin;
    if (fishItem.direction < 0 && fishItem.x < -margin) fishItem.x = width + margin;
  }

  function draw(time) {
    const dt = Math.min(48, time - last);
    last = time;
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, 'rgba(5,38,68,1)');
    bg.addColorStop(0.5, 'rgba(3,21,43,1)');
    bg.addColorStop(1, 'rgba(0,5,13,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const topLight = ctx.createRadialGradient(width * 0.5, -height * 0.12, 0, width * 0.5, -height * 0.12, Math.max(width, height) * 0.75);
    topLight.addColorStop(0, rgba(biome.primary, 0.17));
    topLight.addColorStop(0.42, rgba(biome.secondary, 0.055));
    topLight.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topLight;
    ctx.fillRect(0, 0, width, height);

    drawLightRays(time);
    drawCaustics(time);

    // Darken the left/right gutters so the content column reads as framed
    // deep blue instead of a flat wash. Bubbles still float over the sides.
    const isWide = width >= 900;
    const sideShade = ctx.createLinearGradient(0, 0, width, 0);
    sideShade.addColorStop(0, 'rgba(0,4,11,0.74)');
    sideShade.addColorStop(isWide ? 0.17 : 0.1, 'rgba(0,4,11,0)');
    sideShade.addColorStop(isWide ? 0.83 : 0.9, 'rgba(0,4,11,0)');
    sideShade.addColorStop(1, 'rgba(0,4,11,0.74)');
    ctx.fillStyle = sideShade;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    fish.forEach(function(fishItem) {
      drawFish(fishItem, time, dt);
    });
    bubbles.forEach(function(bubble) {
      drawBubble(bubble, time);
      bubble.y -= bubble.speed * motionScale * dt / 1000;
      bubble.phase += dt * motionScale * 0.00042;
      if (bubble.y < -24) {
        bubble.y = height + random(20, 90);
        bubble.x = random(-40, width + 40);
        bubble.radius = random(1.4, bubble.radius > 4.8 ? 6.2 : 4.2);
      }
    });
    ctx.restore();

    if (!prefersReducedMotion) raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function() {
    resize();
    if (prefersReducedMotion) draw(0);
  }, { passive: true });
  resize();
  draw(prefersReducedMotion ? 0 : performance.now());
})();
