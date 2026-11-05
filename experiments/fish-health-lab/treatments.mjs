// Verified Merck pet-owner sections, checked 2026-11-05. These are reading
// destinations, not prescriptions. Never add observations or readings to URLs.
const OWNER_GUIDE = 'https://www.merckvetmanual.com/all-other-pets/fish/disorders-and-diseases-of-fish';
const ROUTINE_CARE = 'https://www.merckvetmanual.com/all-other-pets/fish/routine-health-care-of-fish';

const GUIDES = {
  water: { section: 'v3226697', title: 'Water-quality and oxygen care', scope: 'both', type: 'care' },
  'ich-fresh': { section: 'v3226751', title: 'Treatment for freshwater ich', scope: 'fresh' },
  'ich-marine': { section: 'v3226751', title: 'Treatment for marine ich', scope: 'marine' },
  'velvet-fresh': { section: 'v3226757', title: 'Treatment for freshwater velvet', scope: 'fresh' },
  'velvet-marine': { section: 'v3226757', title: 'Treatment for marine velvet', scope: 'marine' },
  'water-mold': { section: 'v3226818', title: 'Treatment for cottony water mold', scope: 'fresh' },
  columnaris: { section: 'v3226736', title: 'Treatment for columnaris', scope: 'fresh' },
  'fin-damage': { section: 'Skin-Disorders_v3226728', title: 'Care for damaged fins', scope: 'both', type: 'care' },
  ulcer: { section: 'Skin-Disorders_v3226728', title: 'Care for sores and damaged skin', scope: 'both', type: 'care' },
  dropsy: { section: 'Disorders-Affecting-Multiple-Body-Systems_v3226802', title: 'Care for a swollen or unwell fish', scope: 'both', type: 'care' },
  'eye-change': { section: 'Eye-Disorders_v3226655', title: 'Care for eye problems', scope: 'both', type: 'care' },
  buoyancy: { url: ROUTINE_CARE, title: 'Care for an unwell fish', scope: 'both', type: 'care' },
  'gill-parasites': { section: 'v3226711', title: 'Care for gill problems', scope: 'both', type: 'care' },
  growth: { section: 'Skin-Disorders_v3226728', title: 'Care for skin growths', scope: 'both', type: 'care' },
};

export function treatmentGuideFor(id, water) {
  const guide = GUIDES[id];
  if (!guide || (guide.scope !== 'both' && guide.scope !== water)) return null;
  return { ...guide, url: guide.url || `${OWNER_GUIDE}#${guide.section}`, provider: 'Merck Veterinary Manual · Pet owner guide' };
}

// Called only from a direct click. A real target=_blank anchor remains the
// fallback when pop-ups are blocked; modified clicks keep normal browser behavior.
export function openTreatmentPopup(event, link, openWindow = window.open.bind(window)) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;
  const guide = treatmentGuideFor(link.dataset.treatment, link.dataset.water);
  if (!guide) return false;
  let popup;
  try {
    popup = openWindow('about:blank', '_blank', 'popup,width=1040,height=800,resizable=yes,scrollbars=yes');
    if (!popup) return false;
    popup.opener = null;
    const referrer = popup.document.createElement('meta');
    referrer.name = 'referrer'; referrer.content = 'no-referrer';
    popup.document.head.append(referrer);
    // Use a noreferrer link inside the popup. A location.replace initiated by
    // the source page can retain that page's origin as the navigation referrer.
    const destination = popup.document.createElement('a');
    destination.href = guide.url;
    destination.target = '_self';
    destination.rel = 'noopener noreferrer';
    (popup.document.body || popup.document.documentElement).append(destination);
    destination.click();
    event.preventDefault();
    return true;
  } catch {
    try { popup?.close(); } catch { /* Keep the native link fallback. */ }
    return false;
  }
}
