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
    'open-water': { primary: [64, 217, 255], secondary: [121, 108, 225] },
    saltwater: { primary: [70, 220, 255], secondary: [145, 105, 238] },
    freshwater: { primary: [66, 224, 184], secondary: [84, 174, 116] },
    pond: { primary: [120, 210, 166], secondary: [230, 171, 74] },
    equipment: { primary: [88, 205, 255], secondary: [93, 130, 232] },
    food: { primary: [96, 220, 225], secondary: [242, 144, 76] },
    decor: { primary: [104, 211, 204], secondary: [183, 111, 231] },
    maintenance: { primary: [79, 208, 237], secondary: [88, 174, 166] },
    learn: { primary: [78, 218, 240], secondary: [255, 153, 78] }
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
      '.has-reef-background{background:#03182c url("/assets/water-lab/clear-reef-water-gpt-image-2.webp") center top/cover fixed no-repeat!important;}',
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

    const homeLink = Array.from(nav.children).find(function(child) {
      return child.tagName === 'A' && child.textContent.trim().toLowerCase() === 'home';
    });

    const compactBrand = document.createElement('a');
    compactBrand.className = 'main-nav__compact-brand';
    compactBrand.href = brand.href;
    compactBrand.textContent = 'Hidden Reef';
    compactBrand.setAttribute('aria-label', 'The Hidden Reef home');
    if (homeLink && homeLink.classList.contains('active')) {
      compactBrand.classList.add('active');
      compactBrand.setAttribute('aria-current', 'page');
    }
    if (homeLink) homeLink.remove();

    const menu = document.createElement('button');
    menu.className = 'main-nav__menu';
    menu.type = 'button';
    menu.setAttribute('aria-controls', nav.id);
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open store navigation');
    menu.textContent = 'Menu';

    const actions = document.createElement('div');
    actions.className = 'main-nav__actions';
    const hasPreviewDrawer = Boolean(window.THR && window.THR.openProductModal);
    actions.innerHTML = [
      '<a href="/category/" aria-label="Search products"><span aria-hidden="true">&#8981;</span><span>Search</span></a>',
      hasPreviewDrawer
        ? '<button class="cart-button main-nav__preview" type="button" aria-label="Open empty preview list"><span>0</span><strong>Preview</strong></button>'
        : '<a href="/category/?preview=open" aria-label="Open preview list"><span aria-hidden="true">&#9776;</span><span>Preview</span></a>'
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
      if (!event.target.closest('a,button.cart-button') || window.innerWidth > 760) return;
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

  function createRefractiveWaterRenderer() {
    const waterCanvas = document.createElement('canvas');
    waterCanvas.className = 'reef-water-image';
    waterCanvas.setAttribute('aria-hidden', 'true');
    Object.assign(waterCanvas.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '0',
      width: '100%',
      height: '100%',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 700ms ease'
    });
    canvas.parentNode.insertBefore(waterCanvas, canvas);

    const gl = waterCanvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance'
    });
    if (!gl) return null;

    const vertexSource = [
      'attribute vec2 aPosition;',
      'varying vec2 vUv;',
      'void main(){',
      'vUv=aPosition*.5+.5;',
      'gl_Position=vec4(aPosition,0.0,1.0);',
      '}'
    ].join('');
    const fragmentSource = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uClear;',
      'uniform sampler2D uDeep;',
      'uniform vec2 uResolution;',
      'uniform vec2 uClearSize;',
      'uniform vec2 uDeepSize;',
      'uniform float uTime;',
      'uniform float uDepth;',
      'vec2 coverUv(vec2 screenUv,vec2 imageSize){',
      'vec2 ratio=uResolution/imageSize;',
      'float scale=max(ratio.x,ratio.y);',
      'vec2 visible=uResolution/(imageSize*scale);',
      'return(screenUv-.5)*visible+.5;',
      '}',
      'void main(){',
      'float surface=smoothstep(.1,1.04,vUv.y);',
      'float intensity=mix(1.0,.72,uDepth);',
      'float waveX=sin(vUv.y*19.0+uTime*.82)+.52*sin(vUv.y*47.0-uTime*1.12)+.28*sin((vUv.x+vUv.y)*31.0+uTime*.66);',
      'float waveY=sin(vUv.x*17.0-uTime*.58)+.44*sin(vUv.x*38.0+uTime*.91)+.22*sin((vUv.x-vUv.y)*53.0-uTime*.48);',
      'float amplitude=mix(.0015,.0074,surface)*intensity;',
      'vec2 distortion=vec2(waveX,waveY)*amplitude;',
      'vec2 clearUv=clamp(coverUv(vUv+distortion,uClearSize),.002,.998);',
      'vec2 deepUv=clamp(coverUv(vUv+distortion*.78,uDeepSize),.002,.998);',
      'vec3 clearColor=texture2D(uClear,clearUv).rgb;',
      'vec3 deepColor=texture2D(uDeep,deepUv).rgb;',
      'float blend=smoothstep(0.0,1.0,uDepth);',
      'vec3 color=mix(clearColor,deepColor,blend);',
      'float light=sin(vUv.x*12.0+vUv.y*15.0+uTime*.54)+.55*sin(vUv.x*27.0-vUv.y*10.0-uTime*.43);',
      'color+=light*.0085*intensity*(.34+surface*.66);',
      'gl_FragColor=vec4(color,1.0);',
      '}'
    ].join('');

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Water shader failed to compile.');
      }
      return shader;
    }

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (error) {
      console.warn(error);
      waterCanvas.remove();
      return null;
    }

    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      clearSize: gl.getUniformLocation(program, 'uClearSize'),
      deepSize: gl.getUniformLocation(program, 'uDeepSize'),
      time: gl.getUniformLocation(program, 'uTime'),
      depth: gl.getUniformLocation(program, 'uDepth')
    };
    const imageSizes = {
      clear: [1774, 887],
      deep: [1983, 793]
    };
    let loaded = 0;
    let ready = false;

    function loadTexture(unit, uniformName, source, sizeName) {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(gl.getUniformLocation(program, uniformName), unit);
      const image = new Image();
      image.decoding = 'async';
      image.onload = function() {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        imageSizes[sizeName] = [image.naturalWidth, image.naturalHeight];
        loaded += 1;
        if (loaded === 2) {
          ready = true;
          waterCanvas.dataset.waterRenderer = 'active';
          waterCanvas.style.opacity = '1';
        }
      };
      image.src = source;
    }

    loadTexture(0, 'uClear', '/assets/water-lab/clear-reef-water-gpt-image-2.webp', 'clear');
    loadTexture(1, 'uDeep', '/assets/water-lab/deep-aquarium-water-gpt-image-2.webp', 'deep');

    function resizeWaterCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.max(1, Math.round(window.innerWidth * ratio));
      const nextHeight = Math.max(1, Math.round(window.innerHeight * ratio));
      if (waterCanvas.width === nextWidth && waterCanvas.height === nextHeight) return;
      waterCanvas.width = nextWidth;
      waterCanvas.height = nextHeight;
      gl.viewport(0, 0, nextWidth, nextHeight);
    }

    waterCanvas.addEventListener('webglcontextlost', function(event) {
      event.preventDefault();
      ready = false;
      waterCanvas.style.opacity = '0';
      waterCanvas.dataset.waterRenderer = 'fallback';
    });

    return {
      render: function(time, depth) {
        if (!ready) return;
        resizeWaterCanvas();
        gl.useProgram(program);
        gl.uniform2f(uniforms.resolution, waterCanvas.width, waterCanvas.height);
        gl.uniform2f(uniforms.clearSize, imageSizes.clear[0], imageSizes.clear[1]);
        gl.uniform2f(uniforms.deepSize, imageSizes.deep[0], imageSizes.deep[1]);
        gl.uniform1f(uniforms.time, time * 0.001);
        gl.uniform1f(uniforms.depth, depth);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
      resize: resizeWaterCanvas,
      canvas: waterCanvas
    };
  }

  const waterRenderer = createRefractiveWaterRenderer();

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let bubbles = [];
  let raf = 0;
  let last = performance.now();
  let depthMix = 0;

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
      : Math.round(Math.min(isDesktop ? 135 : 46, Math.max(isDesktop ? 82 : 28, width / (isDesktop ? 12 : 11))));
    canvas.dataset.reefBubbleCount = String(count);
    bubbles = Array.from({ length: count }, function(_, index) {
      const featured = isDesktop && index % 10 === 0;
      return {
        x: random(-40, width + 40),
        y: random(-height * 0.2, height * 1.15),
        radius: random(featured ? 3.2 : 1.1, featured ? 7.4 : 4.2),
        speed: random(isDesktop ? 7 : 7, isDesktop ? 25 : 21),
        wobble: random(8, isDesktop ? 36 : 26),
        phase: random(0, Math.PI * 2),
        alpha: random(isDesktop ? 0.055 : 0.05, isDesktop ? 0.21 : 0.18)
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

  function drawFreshwaterPlants(time) {
    const swayTime = time * motionScale * 0.00045;
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.lineCap = 'round';
    for (let plant = 0; plant < (width >= 900 ? 13 : 7); plant += 1) {
      const baseX = width * (0.04 + plant / (width >= 900 ? 12.5 : 6.5));
      const baseY = height + 12;
      const stemHeight = height * (0.1 + (plant % 4) * 0.025);
      const sway = Math.sin(swayTime + plant * 0.72) * (8 + plant % 3 * 3);
      ctx.strokeStyle = rgba(biome.secondary, 0.8);
      ctx.lineWidth = 2 + (plant % 2);
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.bezierCurveTo(baseX - sway * 0.2, baseY - stemHeight * 0.38, baseX + sway, baseY - stemHeight * 0.72, baseX + sway * 0.58, baseY - stemHeight);
      ctx.stroke();
      for (let leaf = 1; leaf <= 3; leaf += 1) {
        const leafY = baseY - stemHeight * (0.24 + leaf * 0.18);
        const side = leaf % 2 ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(baseX + sway * leaf * 0.08, leafY);
        ctx.quadraticCurveTo(baseX + side * 13 + sway * 0.3, leafY - 8, baseX + side * 21 + sway * 0.42, leafY - 3);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawBiomeAccent(time) {
    if (biomeName === 'freshwater') drawFreshwaterPlants(time);
  }

  function getScrollDepth() {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (maxScroll <= 1) return 0;
    const raw = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    return raw * raw * (3 - 2 * raw);
  }

  function draw(time) {
    const dt = Math.min(48, time - last);
    last = time;
    ctx.clearRect(0, 0, width, height);

    const targetDepth = getScrollDepth();
    depthMix = prefersReducedMotion
      ? targetDepth
      : depthMix + (targetDepth - depthMix) * Math.min(1, dt * 0.0065);
    canvas.dataset.reefDepth = depthMix.toFixed(3);
    document.documentElement.style.setProperty('--reef-depth', depthMix.toFixed(3));
    if (waterRenderer) waterRenderer.render(time * motionScale, depthMix);

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
    if (waterRenderer) waterRenderer.resize();
    if (prefersReducedMotion) draw(0);
  }, { passive: true });
  if (prefersReducedMotion) {
    window.addEventListener('scroll', function() { draw(performance.now()); }, { passive: true });
  }
  resize();
  draw(prefersReducedMotion ? 0 : performance.now());
})();
