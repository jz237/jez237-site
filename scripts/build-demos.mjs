import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
const root = new URL('../demos/', import.meta.url);
const demos = JSON.parse(readFileSync(new URL('catalog.json', root), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageSize = 10;
const ids = new Set();
if (!Array.isArray(demos) || !demos.length) throw new Error('Add at least one demo to the catalog.');
const cards = demos.map((demo, i) => {
  for (const key of ['id','title','category','description','url','image','imageAlt','source','note']) {
    if (typeof demo[key] !== 'string' || !demo[key].trim()) throw new Error(`Demo ${i}: missing ${key}`);
  }
  if (ids.has(demo.id)) throw new Error(`Duplicate demo ID: ${demo.id}`);
  ids.add(demo.id);
  if (!/^[a-z0-9][a-z0-9/-]*\/$/i.test(demo.url) || !/^assets\/[\w.-]+$/.test(demo.image) || !demo.source.startsWith('https://github.com/jz237/')) throw new Error(`Invalid paths for ${demo.title}`);
  for (const key of ['features','facts']) if (!Array.isArray(demo[key]) || demo[key].some(v => typeof v !== 'string')) throw new Error(`Invalid ${key}`);
  readFileSync(new URL(`${demo.url}index.html`, root));
  readFileSync(new URL(demo.image, root));
  if (demo.alternateUrl !== undefined) {
    if (!/^[a-z0-9][a-z0-9/-]*(?:\/|\.html)$/i.test(demo.alternateUrl) || typeof demo.alternateLabel !== 'string' || !demo.alternateLabel.trim()) throw new Error(`Invalid alternate view for ${demo.title}`);
    readFileSync(new URL(demo.alternateUrl.endsWith('/') ? `${demo.alternateUrl}index.html` : demo.alternateUrl, root));
  }
  const d = Object.fromEntries(Object.entries(demo).filter(([,v]) => typeof v === 'string').map(([k,v]) => [k,escape(v)]));
  return `<article class="demo-card${i % pageSize === 0 ? ' featured' : ''}">
  <a class="preview" href="${d.url}" aria-label="Open ${d.title}"><span class="preview-label">EXPERIMENT / ${d.id}</span><img src="${d.image}" width="1100" height="579" alt="${d.imageAlt}" ${i % pageSize === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}><span class="preview-hint"><b aria-hidden="true">↗</b> OPEN INTERACTIVE DEMO</span></a>
  <div class="details"><div class="card-meta"><span>${d.category}</span><span class="live"><i class="signal"></i> LIVE DEMO</span></div><h2>${d.title}</h2><p class="description">${d.description}</p>
  <ul class="features">${demo.features.map(v => `<li>${escape(v)}</li>`).join('')}</ul>
  <div class="actions"><a class="primary" href="${d.url}">Launch demo <span aria-hidden="true">→</span></a>${d.alternateUrl ? `<a href="${d.alternateUrl}">${d.alternateLabel}</a>` : ''}<a href="${d.source}">View source ↗</a></div>
  <p class="compatibility">${d.note}</p><div class="facts">${demo.facts.map(v => `<span>${escape(v)}</span>`).join('')}</div></div>
  </article>`;
});
const page = new URL('index.html', root);
const html = readFileSync(page, 'utf8');
if (!html.includes('<!-- CATALOG START -->') || !html.includes('<!-- CATALOG END -->')) throw new Error('Missing catalog markers');
const pageCount = Math.ceil(cards.length / pageSize);
const pageFile = number => number === 1 ? 'index.html' : `page-${number}.html`;
const pageHref = number => number === 1 ? './#experiments' : `${pageFile(number)}#experiments`;
const generatedMarker = '<!-- GENERATED DEMO PAGE: scripts/build-demos.mjs -->';
for (let number = 1; number <= pageCount; number++) {
  const start = (number - 1) * pageSize;
  const end = Math.min(start + pageSize, cards.length);
  const navigation = position => `<nav class="pagination" aria-label="Demo pages (${position})">
  <p class="page-summary">Demos ${start + 1}–${end} of ${cards.length} · Page ${number} of ${pageCount}</p>
  <div class="page-links">${number > 1 ? `<a href="${pageHref(number - 1)}" rel="prev">← Previous</a>` : '<span class="page-disabled" aria-disabled="true">← Previous</span>'}
  ${Array.from({length: pageCount}, (_, index) => index + 1).map(n => n === number ? `<span aria-current="page" aria-label="Page ${n}">${n}</span>` : `<a href="${pageHref(n)}" aria-label="Page ${n}">${n}</a>`).join('')}
  ${number < pageCount ? `<a href="${pageHref(number + 1)}" rel="next">Next →</a>` : '<span class="page-disabled" aria-disabled="true">Next →</span>'}</div></nav>`;
  let output = html
    .replace(/<!-- CATALOG START -->[\s\S]*?<!-- CATALOG END -->/, `<!-- CATALOG START -->\n${cards.slice(start, end).join('\n')}\n<!-- CATALOG END -->`)
    .replace(/data-demo-count>[^<]*/, `data-demo-count>${String(demos.length).padStart(2,'0')}`)
    .replace(/<title>[^<]*<\/title>/, `<title>Website Demos${number > 1 ? ` — Page ${number}` : ''} — Jez237</title>`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://jez237.com/demos/${number === 1 ? '' : pageFile(number)}">`);
  for (const position of ['TOP', 'BOTTOM']) {
    // String.raw keeps the character class intact in the dynamic expression.
    const marker = new RegExp(String.raw`<!-- PAGINATION ${position} START -->[\s\S]*?<!-- PAGINATION ${position} END -->`);
    if (!marker.test(output)) throw new Error(`Missing ${position} pagination markers`);
    output = output.replace(marker, `<!-- PAGINATION ${position} START -->\n${navigation(position.toLowerCase())}\n<!-- PAGINATION ${position} END -->`);
  }
  writeFileSync(new URL(pageFile(number), root), number === 1 ? output : `${generatedMarker}\n${output}`);
}
// Retire only this generator's extra pages if the collection becomes smaller.
for (const name of readdirSync(root)) {
  const match = /^page-(\d+)\.html$/.exec(name);
  if (match && Number(match[1]) > pageCount && readFileSync(new URL(name, root), 'utf8').startsWith(generatedMarker)) unlinkSync(new URL(name, root));
}
console.log(`Built ${demos.length} demo cards across ${pageCount} pages (up to ${pageSize} each); local assets and links validated.`);
