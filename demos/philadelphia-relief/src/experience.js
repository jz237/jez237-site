export function detailMessage(detail) {
  if (detail.state==='regional') return 'Regional aerial';
  if (detail.state==='unavailable') return 'Using available imagery';
  if (detail.state==='loading') return detail.refining ? 'Sharpening rooftops…'
    : `Loading view · ${detail.loaded || 0}/${detail.visible || 0} areas`;
  const resolution=Number(detail.resolutionM);
  return Number.isFinite(resolution) && resolution>0
    ? `${resolution.toFixed(2)} m sampling` : 'Aerial ready';
}

export function updateImageryCredit(host, detail) {
  if (!host) return;
  if (!host.querySelector('.credit-source')) {
    const source=document.createElement('span'), status=document.createElement('span');
    source.className='credit-source'; status.className='credit-detail';
    status.setAttribute('role','status'); host.replaceChildren(source,status);
  }
  const source=host.querySelector('.credit-source'), status=host.querySelector('.credit-detail');
  const text=`Aerial: ${detail.source || 'USDA / USGS The National Map'}`;
  if (source.textContent!==text) source.textContent=text;
  const message=detailMessage(detail);
  if (status.textContent!==message) status.textContent=message;
  host.dataset.loading=String(detail.state==='loading');
}

export function wireFieldNotes(button) {
  if (!button) return () => {};
  const narrow = window.matchMedia('(max-width: 820px)');
  const set = collapsed => {
    document.body.classList.toggle('notes-collapsed', collapsed);
    button.textContent = collapsed ? 'Show notes' : 'Hide notes';
    button.setAttribute('aria-expanded', String(!collapsed));
  };
  const click=() => {
    set(!document.body.classList.contains('notes-collapsed'));
  };
  const resize = () => set(narrow.matches);
  resize(); narrow.addEventListener('change', resize);
  button.addEventListener('click',click);
  return () => { button.removeEventListener('click',click); narrow.removeEventListener('change',resize); };
}

export function wireMapChrome() {
  const narrow = window.matchMedia('(max-width: 820px)');
  const layers = document.getElementById('mapControls');
  const tools = document.getElementById('pageTools');
  const locator = document.querySelector('#orientation details');
  const notes = document.getElementById('toggleNotes');
  const close = document.getElementById('closeMapControls');
  const collapseNotes = () => {
    if (!document.body.classList.contains('notes-collapsed')) notes.click();
  };
  const resized = () => {
    layers.open = !narrow.matches; locator.open = !narrow.matches; tools.open = !narrow.matches;
  };
  const layerToggle = () => {
    if (!narrow.matches || !layers.open) return;
    locator.open = false; tools.open = false; collapseNotes();
  };
  const locatorToggle = () => {
    if (!narrow.matches || !locator.open) return;
    layers.open = false; tools.open = false; collapseNotes();
  };
  const toolsToggle = () => {
    if (!narrow.matches || !tools.open) return;
    layers.open = false; locator.open = false; collapseNotes();
  };
  const toolsClick = event => {
    if (narrow.matches && event.target.closest('button')) tools.open = false;
  };
  const notesClick = () => {
    if (narrow.matches && !document.body.classList.contains('notes-collapsed')) {
      layers.open = false; locator.open = false; tools.open = false;
    }
  };
  const dismiss = () => { layers.open = false; layers.querySelector('summary').focus(); };
  const escape = event => {
    if (event.key !== 'Escape' || !narrow.matches) return;
    if (layers.open) dismiss();
    if (tools.open) { tools.open = false; tools.querySelector('summary').focus(); }
    if (locator.open) { locator.open = false; locator.querySelector('summary').focus(); }
  };
  const sheetChange = () => {
    if (narrow.matches && document.body.classList.contains('sheet-open')) {
      layers.open = false; locator.open = false; tools.open = false; collapseNotes();
    }
  };
  const observer = new MutationObserver(sheetChange);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  resized(); narrow.addEventListener('change', resized);
  layers.addEventListener('toggle', layerToggle); locator.addEventListener('toggle', locatorToggle);
  tools.addEventListener('toggle', toolsToggle); tools.addEventListener('click', toolsClick);
  notes.addEventListener('click', notesClick); close.addEventListener('click', dismiss);
  document.addEventListener('keydown', escape);
  return () => {
    observer.disconnect(); narrow.removeEventListener('change', resized);
    layers.removeEventListener('toggle', layerToggle); locator.removeEventListener('toggle', locatorToggle);
    tools.removeEventListener('toggle', toolsToggle); tools.removeEventListener('click', toolsClick);
    notes.removeEventListener('click', notesClick); close.removeEventListener('click', dismiss);
    document.removeEventListener('keydown', escape);
  };
}

export function timelineSeek(key, seconds, total) {
  const max=Math.max(0,total-.01);
  if (key==='Home') return 0;
  if (key==='End') return max;
  if (key==='ArrowLeft') return Math.max(0,seconds-5);
  if (key==='ArrowRight') return Math.min(max,seconds+5);
  return null;
}

export function captureName(state, timestamp) {
  const part=(n,positive,negative) => `${Math.abs(Number(n)||0).toFixed(4)}${n<0 ? negative : positive}`;
  const lat=part(state.camLat,'N','S'),lon=part(state.camLon,'E','W');
  return `philadelphia-relief-${lat}-${lon}-${timestamp}.png`;
}
