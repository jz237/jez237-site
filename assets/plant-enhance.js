/* === plant-enhance.js — shared ambient layer + interactions for plant sub-pages === */
(function () {
  // ---- Seasonal palette ----
  const SEASONS = {
    spring: { primary: '#7ab362', secondary: '#f4a7b9', warm: '#e8c57a',
              glow: 'rgba(122,179,98,0.45)',
              petalColors: ['#f4a7b9','#f7c8cf','#e8c57a','#b4d99c','#c48ad0'] },
    summer: { primary: '#4fa36a', secondary: '#ffcc4a', warm: '#ff8b4a',
              glow: 'rgba(79,163,106,0.45)',
              petalColors: ['#ffcc4a','#ff8b4a','#4fa36a','#ffffff','#7ec85a'] },
    fall:   { primary: '#d87b3a', secondary: '#c94b2d', warm: '#f2b84a',
              glow: 'rgba(216,123,58,0.45)',
              petalColors: ['#d87b3a','#c94b2d','#f2b84a','#8b5a2b','#e5a658'] },
    winter: { primary: '#7fb3cf', secondary: '#b8d4e2', warm: '#d9b88a',
              glow: 'rgba(127,179,207,0.4)',
              petalColors: ['#ffffff','#b8d4e2','#7fb3cf','#d9b88a','#cfe2ec'] }
  };
  function seasonOf(d){
    const m = d.getMonth(), day = d.getDate();
    if ((m === 2 && day >= 20) || m === 3 || m === 4 || (m === 5 && day <= 20)) return 'spring';
    if ((m === 5 && day >= 21) || m === 6 || m === 7 || (m === 8 && day <= 22)) return 'summer';
    if ((m === 8 && day >= 23) || m === 9 || m === 10 || (m === 11 && day <= 20)) return 'fall';
    return 'winter';
  }
  const s = SEASONS[seasonOf(new Date())];
  const root = document.documentElement;
  root.style.setProperty('--pe-accent-primary',   s.primary);
  root.style.setProperty('--pe-accent-secondary', s.secondary);
  root.style.setProperty('--pe-accent-warm',      s.warm);
  root.style.setProperty('--pe-accent-glow',      s.glow);

  // ---- Growing branching tree SVG (fixed, right edge) ----
  const tree = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tree.setAttribute('class', 'pe-tree');
  tree.setAttribute('viewBox', '0 0 200 800');
  tree.setAttribute('preserveAspectRatio', 'xMaxYMax meet');
  tree.setAttribute('aria-hidden', 'true');
  const branches = [
    { d: 'M100 800 C100 650 108 500 105 420 C100 320 108 200 100 40',  w: 11, cls: 'b-0' },
    { d: 'M104 470 C 80 440, 50 420, 12 400',                           w: 6,  cls: 'b-1' },
    { d: 'M106 400 C 130 380, 165 360, 196 340',                        w: 6,  cls: 'b-2' },
    { d: 'M103 320 C 80 300, 50 285, 15 270',                           w: 5,  cls: 'b-3' },
    { d: 'M105 240 C 130 220, 160 200, 188 180',                        w: 5,  cls: 'b-4' },
    { d: 'M102 160 C 85 140, 70 120, 55 100',                           w: 4,  cls: 'b-5' },
    { d: 'M103 90 C 120 70, 135 50, 150 30',                            w: 4,  cls: 'b-6' },
    { d: 'M40 408 C 28 395, 20 385, 12 372',                            w: 2,  cls: 'b-7' },
    { d: 'M170 350 C 178 338, 182 328, 192 318',                        w: 2,  cls: 'b-8' },
    { d: 'M60 282 C 50 270, 44 258, 38 246',                            w: 2,  cls: 'b-9' },
    { d: 'M155 195 C 165 184, 170 172, 178 160',                        w: 2,  cls: 'b-10' },
    { d: 'M75 115 C 65 100, 58 85, 52 70',                              w: 2,  cls: 'b-11' }
  ];
  branches.forEach(b => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', b.d);
    p.setAttribute('stroke-width', b.w);
    p.setAttribute('class', 'branch ' + b.cls);
    tree.appendChild(p);
  });
  // A few buds at branch tips with delayed bloom
  const budSpots = [
    [12,400],[196,340],[15,270],[188,180],[55,100],[150,30],
    [12,372],[192,318],[38,246],[178,160],[52,70]
  ];
  budSpots.forEach((pt, i) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', pt[0]);
    c.setAttribute('cy', pt[1]);
    c.setAttribute('r', 3.2);
    c.setAttribute('class', 'pe-tree-bud');
    c.style.animationDelay = (3.2 + i * 0.12) + 's';
    tree.appendChild(c);
  });
  document.body.appendChild(tree);

  // ---- Falling skeletal leaves ----
  const LEAVES = [
    { silhouette:'M20 2 C31 7 32 34 20 46 C8 34 9 7 20 2 Z',
      petiole:'M20 46 L20 50', midrib:'M20 4 L20 45',
      veins:'M20 10 Q14 11 9 14 M20 10 Q26 11 31 14 M20 18 Q12 20 6 23 M20 18 Q28 20 34 23 M20 27 Q13 29 8 32 M20 27 Q27 29 32 32 M20 36 Q15 37 11 39 M20 36 Q25 37 29 39',
      tertiary:'M13 12 Q13 16 10 18 M27 12 Q27 16 30 18 M11 21 Q13 25 10 28 M29 21 Q27 25 30 28 M11 30 Q13 33 11 36 M29 30 Q27 33 29 36' },
    { silhouette:'M20 2 C24 10 24 40 20 48 C16 40 16 10 20 2 Z',
      petiole:'M20 48 L20 52', midrib:'M20 4 L20 46',
      veins:'M20 8 Q17 9 14 12 M20 8 Q23 9 26 12 M20 16 Q16 17 13 20 M20 16 Q24 17 27 20 M20 24 Q16 25 13 28 M20 24 Q24 25 27 28 M20 32 Q17 33 14 36 M20 32 Q23 33 26 36 M20 40 Q18 41 16 43 M20 40 Q22 41 24 43',
      tertiary:'M15 14 Q15 17 13 19 M25 14 Q25 17 27 19 M14 22 Q14 25 13 27 M26 22 Q26 25 27 27 M15 30 Q15 33 14 35 M25 30 Q25 33 26 35' },
    { silhouette:'M20 9 C27 -1 39 11 36 22 C33 33 25 42 20 46 C15 42 7 33 4 22 C1 11 13 -1 20 9 Z',
      petiole:'M20 46 L20 51', midrib:'M20 11 L20 44',
      veins:'M20 11 Q10 14 5 21 M20 11 Q30 14 35 21 M20 11 Q13 22 9 30 M20 11 Q27 22 31 30 M20 11 Q16 30 15 40 M20 11 Q24 30 25 40',
      tertiary:'M12 17 Q10 20 7 22 M28 17 Q30 20 33 22 M11 25 Q11 29 9 32 M29 25 Q29 29 31 32' },
    { silhouette:'M20 3 C31 4 36 14 35 26 C33 38 26 45 20 45 C14 45 7 38 5 26 C4 14 9 4 20 3 Z',
      petiole:'M20 45 L20 50', midrib:'M20 5 L20 44',
      veins:'M20 12 Q12 13 6 16 M20 12 Q28 13 34 16 M20 22 Q10 23 4 26 M20 22 Q30 23 36 26 M20 32 Q12 34 8 38 M20 32 Q28 34 32 38',
      tertiary:'M12 14 Q12 18 10 20 M28 14 Q28 18 30 20 M10 24 Q11 28 9 31 M30 24 Q29 28 31 31' },
    { silhouette:'M20 46 Q17 40 14 38 Q4 38 5 28 Q12 30 13 24 Q3 23 5 15 Q13 17 15 13 Q16 4 20 3 Q24 4 25 13 Q27 17 35 15 Q37 23 27 24 Q28 30 35 28 Q36 38 26 38 Q23 40 20 46 Z',
      petiole:'M20 46 L20 50', midrib:'M20 44 L20 5',
      veins:'M20 20 L20 4 M20 20 L15 13 M20 20 L25 13 M20 22 L5 15 M20 22 L35 15 M20 26 L5 28 M20 26 L35 28 M20 30 L14 38 M20 30 L26 38',
      tertiary:'M16 12 Q14 10 13 8 M24 12 Q26 10 27 8 M12 18 Q10 16 8 15 M28 18 Q30 16 32 15 M10 27 Q8 28 6 30 M30 27 Q32 28 34 30' }
  ];
  const petalLayer = document.createElement('div');
  petalLayer.className = 'pe-petals';
  petalLayer.setAttribute('aria-hidden','true');
  document.body.appendChild(petalLayer);
  const petalCount = window.matchMedia('(max-width: 700px)').matches ? 14 : 30;
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('span');
    p.className = 'pe-petal';
    const color   = s.petalColors[Math.floor(Math.random() * s.petalColors.length)];
    const leaf    = LEAVES[Math.floor(Math.random() * LEAVES.length)];
    const size    = 16 + Math.random() * 20;
    const aspect  = 0.95 + Math.random() * 0.45;
    const dur     = 16 + Math.random() * 22;
    const delay   = -Math.random() * dur;
    const left    = Math.random() * 100;
    const drift   = (Math.random() * 180 - 90) + 'px';
    const tilt    = (Math.random() * 40 - 20).toFixed(1);
    const opacity = (0.6 + Math.random() * 0.3).toFixed(2);
    const outline  = 'rgba(0,0,0,0.22)';
    const veinDark = 'rgba(0,0,0,0.42)';
    const veinLight = 'rgba(255,255,255,0.18)';
    const veinFaint = 'rgba(0,0,0,0.28)';
    p.style.cssText =
      'left:' + left + 'vw;' +
      'width:' + size + 'px;' +
      'height:' + (size * aspect * 1.2) + 'px;' +
      'opacity:' + opacity + ';' +
      'animation-duration:' + dur + 's;' +
      'animation-delay:' + delay + 's;' +
      '--drift:' + drift + ';';
    p.innerHTML =
      '<svg viewBox="0 0 40 54" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(' + tilt + 'deg);overflow:visible;">' +
        '<path d="' + leaf.silhouette + '" fill="' + color + '" stroke="' + outline + '" stroke-width="0.6" stroke-linejoin="round"/>' +
        '<path d="' + leaf.petiole + '" stroke="' + veinDark + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
        '<path d="' + leaf.tertiary + '" stroke="' + veinFaint + '" stroke-width="0.35" fill="none" stroke-linecap="round"/>' +
        '<path d="' + leaf.veins + '" stroke="' + veinLight + '" stroke-width="0.55" fill="none" stroke-linecap="round" transform="translate(0.4,0.4)"/>' +
        '<path d="' + leaf.veins + '" stroke="' + veinDark + '" stroke-width="0.55" fill="none" stroke-linecap="round"/>' +
        '<path d="' + leaf.midrib + '" stroke="' + veinDark + '" stroke-width="0.95" fill="none" stroke-linecap="round"/>' +
      '</svg>';
    petalLayer.appendChild(p);
  }

  // ---- Timeline entry scroll-reveal (alternating sides) ----
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('pe-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.timeline-entry').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.timeline-entry').forEach(el => el.classList.add('pe-in'));
  }

  // ---- 3D tilt on .photo elements ----
  document.querySelectorAll('.photo').forEach(img => {
    img.addEventListener('mousemove', ev => {
      const r = img.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;
      img.style.setProperty('--pe-rx', ((0.5 - y) * 9) + 'deg');
      img.style.setProperty('--pe-ry', ((x - 0.5) * 9) + 'deg');
    });
    img.addEventListener('mouseleave', () => {
      img.style.setProperty('--pe-rx', '0deg');
      img.style.setProperty('--pe-ry', '0deg');
    });
  });
})();
