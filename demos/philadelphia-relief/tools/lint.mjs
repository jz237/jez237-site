/**
 * Dependency-free lint.
 *
 * The site has no build step and no node_modules, so rather than pull in a
 * linter this checks the rules that actually matter for shipping this app to a
 * static host — most importantly that nothing resembling a credential and no
 * third-party runtime call can reach the browser.
 *
 *   node tools/lint.mjs
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Files that ship to the browser. Everything here is held to the strict rules. */
const BROWSER_DIRS = ['src'];
const BROWSER_ROOT_FILES = ['index.html', 'app.css'];

const problems = [];
const notes = [];

function fail(file, line, rule, message) {
  problems.push({ file, line, rule, message });
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/** Things that look like a key, token or password. */
const SECRET_PATTERNS = [
  [/\b(?:api[_-]?key|apikey|access[_-]?token|auth[_-]?token|secret|password|passwd|credential)\s*[:=]\s*['"][^'"]{8,}/i,
    'looks like a hard-coded credential'],
  [/\bpk\.[A-Za-z0-9_-]{20,}/, 'looks like a Mapbox public token'],
  [/\bsk\.[A-Za-z0-9_-]{20,}/, 'looks like a Mapbox secret token'],
  [/\bAIza[0-9A-Za-z_-]{30,}/, 'looks like a Google API key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'looks like an AWS access key id'],
  [/\bghp_[A-Za-z0-9]{30,}/, 'looks like a GitHub token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'contains a private key'],
  [/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, 'looks like a JWT'],
];

/**
 * Hosts the browser bundle may reference at all. Documentation links in the
 * About panel are fine; anything the code would *fetch* is not.
 */
const ALLOWED_LINK_HOSTS = [
  'registry.opendata.aws',
  'www.openstreetmap.org',
  'openstreetmap.org',
  'basemap.nationalmap.gov',
];

const RUNTIME_FETCH = /\b(?:fetch|XMLHttpRequest|importScripts|WebSocket|EventSource)\s*\(\s*['"`](https?:)?\/\//i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function checkSecrets(rel, text) {
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const [pattern, message] of SECRET_PATTERNS) {
      if (pattern.test(line)) fail(rel, i + 1, 'secret', message);
    }
  });
}

function checkBrowserSource(rel, text) {
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    const n = i + 1;

    // No third-party network calls: everything must be same-origin static.
    if (RUNTIME_FETCH.test(line)) {
      fail(rel, n, 'no-external-runtime', 'browser code must not fetch a remote origin');
    }

    // Debug logging should not ship; warnings and errors are intentional.
    if (/\bconsole\.(log|debug|trace|dir|table)\s*\(/.test(line)) {
      fail(rel, n, 'no-debug-log', 'stray console.log in shipped code');
    }

    if (/\bdebugger\b/.test(line)) fail(rel, n, 'no-debugger', 'debugger statement');

    // innerHTML with anything but a literal empty string is an XSS foot-gun.
    if (/\.innerHTML\s*=/.test(line) && !/\.innerHTML\s*=\s*['"]{2}\s*;?\s*$/.test(line.trim())) {
      fail(rel, n, 'no-innerhtml', 'assign textContent, or clear with innerHTML = ""');
    }

    if (/\b(eval|Function)\s*\(\s*['"`]/.test(line)) {
      fail(rel, n, 'no-eval', 'eval / Function constructor');
    }

    if (/[ \t]+$/.test(line)) fail(rel, n, 'trailing-space', 'trailing whitespace');
    if (line.includes('\t')) fail(rel, n, 'no-tabs', 'tab character; this project uses spaces');
    if (line.length > 110) fail(rel, n, 'line-length', `line is ${line.length} chars (max 110)`);
  });

  // Every backtick template literal must be balanced. A stray backtick inside a
  // shader comment silently terminates the string and breaks the whole module —
  // which is exactly the bug that took the app down during development.
  const ticks = (text.match(/`/g) || []).length;
  if (ticks % 2 !== 0) {
    fail(rel, 0, 'unbalanced-template', `${ticks} backticks; a template literal is unterminated`);
  }
}

function checkHtml(rel, text) {
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const n = i + 1;
    // Only things the browser actually *loads*. A canonical link or an og:url
    // naming jez237.com is metadata, not a dependency.
    const loaded = [
      ...[...line.matchAll(/\ssrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]),
      ...(/<link\b[^>]*\brel\s*=\s*["'](?:stylesheet|preload|modulepreload)["']/i.test(line)
        ? [...line.matchAll(/\shref\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1])
        : []),
    ];
    for (const url of loaded) {
      if (!/^https?:\/\//i.test(url)) continue;
      fail(rel, n, 'external-asset',
        `loads ${new URL(url).hostname}; the page must be self-contained`);
    }
    // Anchors may point anywhere, but only to sources we actually cite.
    for (const m of line.matchAll(/<a\b[^>]*\shref\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
      const host = new URL(m[1]).hostname;
      if (!ALLOWED_LINK_HOSTS.includes(host)) {
        fail(rel, n, 'external-link', `links to ${host}, which is not a cited source`);
      }
    }
  });
  if (!/<html[^>]+lang=/i.test(text)) fail(rel, 0, 'a11y', '<html> needs a lang attribute');
  if (!/<meta[^>]+name=["']viewport["']/i.test(text)) fail(rel, 0, 'a11y', 'missing viewport meta');

  // Every control must be reachable by a screen reader.
  const buttons = [...text.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)];
  for (const [full, inner] of buttons) {
    const hasLabel = /aria-label\s*=/.test(full) || inner.replace(/<[^>]+>/g, '').trim().length > 0;
    if (!hasLabel) fail(rel, 0, 'a11y', 'a <button> has neither text nor aria-label');
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const browserFiles = [];
  for (const dir of BROWSER_DIRS) {
    browserFiles.push(...await walk(path.join(ROOT, dir)));
  }
  for (const name of BROWSER_ROOT_FILES) browserFiles.push(path.join(ROOT, name));

  for (const file of browserFiles) {
    const rel = path.relative(ROOT, file);
    const text = await readFile(file, 'utf8');
    checkSecrets(rel, text);
    if (file.endsWith('.js')) checkBrowserSource(rel, text);
    if (file.endsWith('.html')) checkHtml(rel, text);
  }

  // Secrets check applies to the tooling and tests too, just not the style rules.
  for (const dir of ['tools', 'tests']) {
    for (const file of await walk(path.join(ROOT, dir))) {
      const rel = path.relative(ROOT, file);
      if (!/\.(js|mjs|py|json)$/.test(file)) continue;
      checkSecrets(rel, await readFile(file, 'utf8'));
    }
  }

  // The vendored library must carry its licence.
  const vendor = await readFile(path.join(ROOT, 'vendor/three.module.min.js'), 'utf8');
  if (!/@license/.test(vendor.slice(0, 400))) {
    fail('vendor/three.module.min.js', 1, 'license', 'vendored file lost its licence header');
  }

  notes.push(`checked ${browserFiles.length} browser files`);

  for (const note of notes) console.log(`  ${note}`);
  if (!problems.length) {
    console.log('lint: clean');
    return;
  }
  console.log(`\nlint: ${problems.length} problem(s)\n`);
  for (const p of problems) {
    console.log(`  ${p.file}:${p.line}  [${p.rule}] ${p.message}`);
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('lint crashed:', error);
  process.exitCode = 1;
});
