export function normalizeSearch(value) {
  return String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9:]+/g,' ').trim().split(/\s+/).map(token =>
      ({st:'street',rd:'road',ave:'avenue',blvd:'boulevard',pkwy:'parkway'}[token] || token)).join(' ');
}

export function searchScore(entry, query) {
  const name=normalizeSearch(entry.name), q=normalizeSearch(query);
  if (!q) return 1;
  if (name===q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.split(' ').some(word => word.startsWith(q))) return 2;
  if (name.includes(q)) return 3;
  const words=normalizeSearch(`${entry.name} ${entry.searchText || ''}`).split(' ');
  return q.split(' ').every(token => words.some(word => word.startsWith(token))) ? 4 : Infinity;
}
