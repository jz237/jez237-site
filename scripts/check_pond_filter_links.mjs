import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Compare with this checkout, not a fixed button label that could mask an
// older release. Hosting may append analytics outside this navigation.
export async function checkPondFilterLinks(base, fetcher = fetch, { hiddenReef = false } = {}) {
  const mounts = hiddenReef
    ? [['prototypes/hidden-reef/learn/koi-pond', '/learn/koi-pond/', false]]
    : [['demos/hidden-reef-koi', '/demos/hidden-reef-koi/', true],
       ['demos/koi-pond-garden', '/demos/koi-pond-garden/', true],
       ['prototypes/hidden-reef/learn/koi-pond', '/prototypes/hidden-reef/learn/koi-pond/', false],
       ['prototypes/hidden-reef-header-preview/learn/koi-pond', '/prototypes/hidden-reef-header-preview/learn/koi-pond/', false]];
  const filters = new Set();
  const styles = new Map();
  for (const [folder, mount, alias] of mounts) {
    for (const entry of alias ? ['index.html', 'koi-pond.html'] : ['index.html']) {
      const path = `${folder}/${entry}`;
      const expected = readFileSync(resolve(repo, path), 'utf8').replaceAll('\r\n', '\n');
      const nav = expected.match(/<nav id="learn-nav"[\s\S]*?<\/nav>/)?.[0];
      const css = expected.match(/href="(\.\/assets\/[^" ]+\/reef\.css)"/)?.[1];
      if (!nav?.includes('class="filter-link"') || !css) throw new Error(`Pond source missing filter link or styles: ${path}.`);
      const url = new URL(mount + (entry === 'index.html' ? '' : 'koi-pond'), base);
      filters.add(new URL(alias ? '../filtoclear-studio/' : '../filtoclear/', url).href);
      url.searchParams.set('deployment-check', Date.now());
      const response = await fetcher(url, { signal: AbortSignal.timeout(20000) });
      const html = (await response.text()).replaceAll('\r\n', '\n');
      if (!response.ok || !html.includes(nav) || !html.includes(`href="${css}"`)) {
        throw new Error(`Pond deployment blocked: outdated or missing filter navigation at ${url.pathname}.`);
      }
      styles.set(`${folder}/${css.slice(2)}`, new URL(css, url));
    }
  }
  for (const [path, url] of styles) {
    const response = await fetcher(url, { signal: AbortSignal.timeout(20000) });
    const css = (await response.text()).replaceAll('\r\n', '\n');
    if (!response.ok || css !== readFileSync(resolve(repo, path), 'utf8').replaceAll('\r\n', '\n')) {
      throw new Error(`Pond deployment blocked: missing or outdated navigation styles at ${url.pathname}.`);
    }
  }
  for (const url of filters) {
  const filter = await fetcher(url, { signal: AbortSignal.timeout(20000) });
  if (!filter.ok || !(await filter.text()).includes('Inside the FiltoClear 5200')) {
    throw new Error('Pond deployment blocked: filter link destination unavailable.');
  }
  }
  console.log('Pond filter links passed: current navigation, styles and local filter destinations.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkPondFilterLinks(process.argv[2] || 'https://jez237.com', fetch, { hiddenReef: process.argv.includes('--hidden-reef') });
}
