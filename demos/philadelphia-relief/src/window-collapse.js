// Observe only popup roots, never map animation, marker positions or the full DOM.
export const COLLAPSIBLE_WINDOWS = [
  ['#card', 'Place details'], ['.camera-map-card', 'Camera preview'],
  ['.aircraft-card', 'Aircraft details'], ['.map-data-card', 'Map details'],
  ['#regionalViews', 'Cameras & local views'], ['.airport-camera-dialog', 'PHL camera'],
  ['#about', 'About this map'], ['#shortcuts', 'Keyboard shortcuts'], ['#share', 'Share view'],
  ['#onboarding', 'Welcome'], ['#caption', 'Tour caption'], ['#eraBanner', 'Historical view'],
  ['#bathymetryLegend', 'Riverbed legend'], ['.aircraft-ride-bar', 'Aircraft ride controls'],
  ['#readout', 'Map details & tour'],
];

export function wireWindowCollapse() {
  const dock = document.createElement('nav'); dock.className = 'window-dock'; dock.hidden = true;
  dock.setAttribute('aria-label', 'Collapsed map windows'); document.body.append(dock);
  const entries = [];
  const updateDock = () => { dock.hidden = !entries.some(e => e.minimized); };
  for (const [selector, fallback] of COLLAPSIBLE_WINDOWS) {
    const node = document.querySelector(selector); if (!node) continue;
    const host = node.querySelector('.overlay-card') || node;
    const native = node.tagName === 'DIALOG';
    const entry = { minimized: false }; entries.push(entry);
    const restore = document.createElement('button'); restore.type = 'button';
    restore.className = 'window-restore'; restore.hidden = true; dock.append(restore);
    const button = document.createElement('button'); button.type = 'button';
    button.className = 'window-collapse'; button.textContent = '− Collapse';
    button.setAttribute('aria-label', `Collapse ${fallback}`);
    const title = () => node.querySelector('h2,h3')?.textContent.trim() || fallback;
    const reset = () => {
      entry.minimized = false; node.classList.remove('window-minimized'); node.inert = false;
      restore.hidden = true; updateDock();
    };
    button.onclick = event => {
      event.stopPropagation();
      restore.textContent = `↗ ${title()}`;
      restore.setAttribute('aria-label', `Restore ${title()}`);
      entry.minimized = true; restore.hidden = false;
      node.dispatchEvent(new Event('map-window-collapse'));
      if (native && node.open) node.close(); // Release the backdrop and native focus trap.
      if (!native) node.hidden = true; // Existing popup tasks can stop while put away.
      node.classList.add('window-minimized'); node.inert = true;
      updateDock(); restore.focus({ preventScroll: true });
    };
    restore.onclick = () => {
      reset();
      if (native) node.showModal();
      else node.hidden = false;
      node.dispatchEvent(new Event('map-window-restore'));
      queueMicrotask(() => button.focus({ preventScroll: true }));
    };
    const fitPopup = () => {
      if (node.hidden || !node.matches('.camera-map-card,.aircraft-card')) return;
      const box = node.getBoundingClientRect();
      node.style.top = `${Math.max(12, Math.min(box.top, innerHeight - box.height - 12))}px`;
    };
    // Media can change height after loading; only these two anchored cards need fitting.
    const resize = node.matches('.camera-map-card,.aircraft-card')
      ? new ResizeObserver(fitPopup) : null;
    resize?.observe(node);
    const sync = records => {
      // A normal opener or a newly selected item takes precedence over a saved tab.
      if (entry.minimized && records.some(r => r.type === 'attributes'
        && ((r.attributeName === 'hidden' && !node.hidden)
          || (r.attributeName === 'open' && node.open)))) {
        // Tour narration changes automatically; keep it put away until restored.
        if (selector === '#caption') node.hidden = true;
        else reset();
      }
      if (!host.contains(button)) { host.prepend(button); fitPopup(); }
    };
    const observer = new MutationObserver(sync);
    observer.observe(host, { childList: true });
    observer.observe(node, { childList: true, attributes: true, attributeFilter: ['hidden', 'open'] });
    sync([]);
    entry.dispose = () => { observer.disconnect(); resize?.disconnect(); button.remove(); node.inert = false;
      node.classList.remove('window-minimized'); };
  }
  return () => { entries.forEach(e => e.dispose()); dock.remove(); };
}
