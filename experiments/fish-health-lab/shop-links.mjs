// Optional "find it in the store" links for a host site (Jez, Nov 6 2026 13:21 EST: bring the
// guide into The Hidden Reef). jez237.com sets nothing, so no links show there. A host sets
// window.FHL_SHOP before app.mjs loads:
//   { steps: { test: {href, label}, … },                 // by step picture id (fish plans)
//     keywords: [{ match: 'regex source', water?: 'fresh'|'marine'|'pond', href, label }, …],
//     medicines: { copper: {href, label}, … } }          // medicine check
// Links are quiet text links to the host's shop; nothing is bought or sent from the guide.
export const SHOP = globalThis.FHL_SHOP || null;
const rules = (SHOP?.keywords || []).map(r => ({ ...r, re: new RegExp(r.match, 'i') }));

export function shopLinkFor(text, stepId = '', water = '') {
  if (!SHOP) return null;
  const rule = rules.find(r => (!r.water || r.water === water) && r.re.test(text));
  // steps may be keyed per water ("marine:test") with a plain fallback ("test").
  return rule || SHOP.steps?.[`${water}:${stepId}`] || SHOP.steps?.[stepId] || null;
}

export const shopLinkHtml = (link, escape) => link ? `<a class="shop-link" href="${escape(link.href)}">${escape(link.label)} →</a>` : '';

// One link per destination in each rendered result: two steps that both say "test the water"
// would otherwise show the same "Shop … →" twice. Runs only when a host set FHL_SHOP.
if (SHOP && globalThis.document && globalThis.MutationObserver) {
  new MutationObserver(changes => {
    for (const { target } of changes) {
      const seen = new Set();
      // Only the care steps of a result; the prevention page's shopping lists keep every item.
      for (const a of target.querySelectorAll?.('a.shop-link') || []) if (!a.closest('.prevent-shop')) seen.has(a.href) ? a.remove() : seen.add(a.href);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
}
