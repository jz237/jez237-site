(() => {
  const items = [
    ['overview', './', '⌘', 'Overview'],
    ['weather', 'weather/', '☀', 'Weather Console'],
    ['plants', 'plants/', '✿', 'Garden Center'],
    ['garden', 'garden/', '▣', 'Garden Calendar'],
    ['image-gen', 'experiments/image-gen-2-benchmark/', '▧', 'GPT Image 2 Gallery'],
    ['ai-news', 'ai-news/', '◌', 'AI News'],
    ['photos', 'photos/', '▧', 'Photos, kept casual'],
    ['games', 'games/', '◇', 'GameMaster Arcade'],
    ['ai-explainer', 'experiments/ai-explainer/', '☷', 'How AI Works'],
    ['hidden-reef', 'prototypes/hidden-reef/', '▧', 'Hidden Reef Demo'],
    ['stocks', 'https://jz237.github.io/stock-command-center/', '↗', 'Stock Command Center'],
    ['archives', 'plants/past-years/', '□', 'Archives'],
    ['bauder', 'https://baudersigns.com/', '↗', 'Bauder Signs']
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
      return '<a ' + attrs + '>' + icon + ' <span>' + label + '</span></a>';
    }).join('');
  });
})();
