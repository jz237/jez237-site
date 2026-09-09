export function detailMessage(detail) {
  if (detail.state==='regional') return 'Regional aerial';
  if (detail.state==='unavailable') return 'Using available imagery';
  if (detail.state==='loading') return detail.refining ? 'Sharpening rooftops…'
    : `Loading view · ${detail.loaded || 0}/${detail.visible || 0} areas`;
  const resolution=Number(detail.resolutionM);
  return Number.isFinite(resolution) && resolution>0 ? `${resolution.toFixed(2)} m sampling` : 'Aerial ready';
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
  const click=() => {
    const collapsed=document.body.classList.toggle('notes-collapsed');
    button.textContent=collapsed ? 'Show notes' : 'Hide notes';
    button.setAttribute('aria-expanded',String(!collapsed));
  };
  button.addEventListener('click',click);
  return () => button.removeEventListener('click',click);
}
