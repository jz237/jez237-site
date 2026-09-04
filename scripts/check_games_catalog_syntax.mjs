#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { Script } from "node:vm";

const DEFAULT_CATALOG = "games/index.html";

export function checkGamesCatalogSyntax(path = DEFAULT_CATALOG) {
  const html = readFileSync(path, "utf8");
  const scripts = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi);
  let checked = 0;

  for (const match of scripts) {
    const attributes = match[1];
    const source = match[2];
    if (/\bsrc\s*=/i.test(attributes)) continue;

    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1];
    if (type && !/^(?:text|application)\/javascript$/i.test(type)) continue;

    const line = html.slice(0, match.index).split("\n").length;
    new Script(source, { filename: `${path}:${line}` });
    checked += 1;
  }

  if (checked === 0) throw new Error(`${path}: no inline JavaScript found`);
  return checked;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const checked = checkGamesCatalogSyntax(process.argv[2] || DEFAULT_CATALOG);
    console.log(`Games catalog syntax passed (${checked} inline scripts).`);
  } catch (error) {
    console.error(`Games catalog syntax failed: ${error.message}`);
    process.exit(1);
  }
}
