(() => {
  const icons = {
    overview: '<path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
    weather: '<path d="M16.5 18H8a5 5 0 1 1 1.4-9.8A6.2 6.2 0 0 1 21 11.5 3.6 3.6 0 0 1 16.5 18Z"/>',
    plants: '<path d="M12 21V11"/><path d="M12 12c-4.5 0-7-2.6-7.5-7.5C9.4 5 12 7.5 12 12Z"/><path d="M12 14c4.5 0 7-2.4 7.5-7C15 7 12 9.4 12 14Z"/>',
    garden: '<path d="M7 3v4"/><path d="M17 3v4"/><path d="M4.5 8h15"/><rect x="4.5" y="5" width="15" height="15.5" rx="2"/><path d="M8 12h2.5M13.5 12H16M8 16h2.5M13.5 16H16"/>',
    imageGen: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m7 16 3.4-3.4 2.6 2.6 2.2-2.2L19 16.8"/><circle cx="15.5" cy="9.5" r="1.4"/>',
    aiNews: '<path d="M12 4v16"/><path d="M8.2 7.2a3 3 0 0 0-1.8 5.4 3 3 0 0 0 1.4 5.8"/><path d="M15.8 7.2a3 3 0 0 1 1.8 5.4 3 3 0 0 1-1.4 5.8"/><path d="M8.2 7.2A3.6 3.6 0 0 1 12 4"/><path d="M15.8 7.2A3.6 3.6 0 0 0 12 4"/><path d="M8.5 12h7"/><path d="M8.8 16h6.4"/>',
    photos: '<path d="M6.5 8.5h2l1.5-2h4l1.5 2h2a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2Z"/><circle cx="12" cy="14" r="3"/>',
    games: '<path d="M7 10h10a4 4 0 0 1 3.8 2.8l.7 2.3a3 3 0 0 1-5 3l-1.4-1.6H8.9l-1.4 1.6a3 3 0 0 1-5-3l.7-2.3A4 4 0 0 1 7 10Z"/><path d="M7.5 14h4"/><path d="M9.5 12v4"/><path d="M16.5 13.2h.1"/><path d="M18.5 15.2h.1"/>',
    aiExplainer: '<path d="M12 4v16"/><path d="M5 7h4"/><path d="M15 7h4"/><path d="M5 17h4"/><path d="M15 17h4"/><circle cx="12" cy="12" r="3"/><circle cx="5" cy="7" r="1.7"/><circle cx="19" cy="7" r="1.7"/><circle cx="5" cy="17" r="1.7"/><circle cx="19" cy="17" r="1.7"/>',
    reef: '<path d="M12 21V8"/><path d="M12 14c-3.8-1.2-5.8-3.8-6-7.8 3.9 1 6 3.6 6 7.8Z"/><path d="M12 16c3.8-1 5.9-3.4 6.4-7.3-4.1.8-6.4 3.2-6.4 7.3Z"/><path d="M8 21h8"/><path d="M9 18c-2.4-.4-4-1.7-4.8-4"/><path d="M15 18c2.4-.5 4-1.8 4.8-4"/>',
    stocks: '<path d="M4 19h16"/><path d="m5.5 15.5 4-4 3 3 6-7"/><path d="M16 7.5h2.5V10"/>',
    archives: '<rect x="5" y="4" width="14" height="4" rx="1.5"/><path d="M6.5 8v10.5A1.5 1.5 0 0 0 8 20h8a1.5 1.5 0 0 0 1.5-1.5V8"/><path d="M10 12h4"/>',
    bauder: '<path d="m4 17 9.8-9.8a2.8 2.8 0 0 1 4 4L8 21H4v-4Z"/><path d="m12.5 8.5 3 3"/>'
  };

  const items = [
    ['overview', './', 'overview', 'Overview'],
    ['weather', 'weather/', 'weather', 'Weather Console'],
    ['plants', 'plants/', 'plants', 'Garden Center'],
    ['garden', 'garden/', 'garden', 'Garden Calendar'],
    ['image-gen', 'experiments/image-gen-2-benchmark/', 'imageGen', 'GPT Image 2 Gallery'],
    ['ai-news', 'ai-news/', 'aiNews', 'AI News'],
    ['photos', 'photos/', 'photos', 'Photos, kept casual'],
    ['games', 'games/', 'games', 'GameMaster Arcade'],
    ['ai-explainer', 'experiments/ai-explainer/', 'aiExplainer', 'How AI Works'],
    ['hidden-reef', 'prototypes/hidden-reef/', 'reef', 'Hidden Reef Demo'],
    ['stocks', 'https://jz237.github.io/stock-command-center/', 'stocks', 'Stock Command Center'],
    ['archives', 'plants/past-years/', 'archives', 'Archives'],
    ['bauder', 'https://baudersigns.com/', 'bauder', 'Bauder Signs']
  ];

  function hrefFor(base, href) {
    if (/^https?:\/\//.test(href)) return href;
    return (base || '') + href;
  }

  document.querySelectorAll('.side-nav[data-site-menu]').forEach(nav => {
    const base = nav.dataset.base || '';
    const active = nav.dataset.active || '';
    nav.innerHTML = items.map(([key, href, icon, label]) => {
      const external = /^https?:\/\//.test(href);
      const attrs = [
        'href="' + hrefFor(base, href) + '"',
        key === active ? 'class="active"' : '',
        external ? 'target="_blank" rel="noopener"' : ''
      ].filter(Boolean).join(' ');
      return '<a ' + attrs + '><svg class="side-nav-icon" viewBox="0 0 24 24" aria-hidden="true">' + icons[icon] + '</svg><span>' + label + '</span></a>';
    }).join('');
  });
})();
