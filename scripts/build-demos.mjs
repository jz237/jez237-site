import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../demos/', import.meta.url);
const demos = JSON.parse(readFileSync(new URL('catalog.json', root), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  const d = Object.fromEntries(Object.entries(demo).filter(([,v]) => typeof v === 'string').map(([k,v]) => [k,escape(v)]));
  return `<article class="demo-card${i === 0 ? ' featured' : ''}">
  <a class="preview" href="${d.url}" aria-label="Open ${d.title}"><span class="preview-label">EXPERIMENT / ${d.id}</span><img src="${d.image}" width="1100" height="579" alt="${d.imageAlt}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}><span class="preview-hint"><b aria-hidden="true">↗</b> OPEN INTERACTIVE DEMO</span></a>
  <div class="details"><div class="card-meta"><span>${d.category}</span><span class="live"><i class="signal"></i> LIVE DEMO</span></div><h2>${d.title}</h2><p class="description">${d.description}</p>
  <ul class="features">${demo.features.map(v => `<li>${escape(v)}</li>`).join('')}</ul>
  <div class="actions"><a class="primary" href="${d.url}">Launch demo <span aria-hidden="true">→</span></a><a href="${d.source}">View source ↗</a></div>
  <p class="compatibility">${d.note}</p><div class="facts">${demo.facts.map(v => `<span>${escape(v)}</span>`).join('')}</div></div>
  </article>`;
});
const page = new URL('index.html', root);
const html = readFileSync(page, 'utf8');
if (!html.includes('<!-- CATALOG START -->') || !html.includes('<!-- CATALOG END -->')) throw new Error('Missing catalog markers');
writeFileSync(page, html.replace(/<!-- CATALOG START -->[\s\S]*?<!-- CATALOG END -->/, `<!-- CATALOG START -->\n${cards.join('\n')}\n<!-- CATALOG END -->`).replace(/data-demo-count>[^<]*/, `data-demo-count>${String(demos.length).padStart(2,'0')}`));
console.log(`Built ${demos.length} demo cards; local assets and links validated.`);
