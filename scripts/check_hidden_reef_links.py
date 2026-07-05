#!/usr/bin/env python3
"""Preflight checker for the Hidden Reef prototype.

Walks every HTML file, resolves internal href/src/srcset targets against the
filesystem, and validates ?cat=/&sub= catalog params against the slugs defined
in assets/products.js. Exits non-zero if anything is broken so the deploy
script can refuse to ship it.

Usage: check_hidden_reef_links.py [prototype-root]
"""
import os
import re
import sys
import urllib.parse

DEFAULT_ROOT = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "prototypes", "hidden-reef")
)

ATTR_RE = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.I)
SRCSET_RE = re.compile(r'srcset\s*=\s*["\']([^"\']+)["\']', re.I)
SKIP_SCHEMES = ("http", "https", "mailto", "tel", "data", "javascript")


def load_slugs(root):
    prod = open(os.path.join(root, "assets", "products.js"), encoding="utf-8").read()
    top = re.findall(r'^    slug: "([^"]+)"', prod, re.M)
    sub = re.findall(r'^        slug: "([^"]+)"', prod, re.M)
    dept_match = re.search(r"departmentMap = \{(.*?)\};", prod, re.S)
    dept = re.findall(r"(\w[\w-]*):\s*\[", dept_match.group(1)) if dept_match else []
    return set(top) | set(dept), set(sub)


def main():
    root = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_ROOT
    valid_cat, valid_sub = load_slugs(root)

    html_files = []
    for dirpath, _dirs, files in os.walk(root):
        html_files.extend(os.path.join(dirpath, f) for f in files if f.endswith(".html"))

    problems = []
    for hf in html_files:
        rel_hf = os.path.relpath(hf, root)
        text = open(hf, encoding="utf-8", errors="replace").read()
        links = set(ATTR_RE.findall(text))
        for srcset in SRCSET_RE.findall(text):
            for part in srcset.split(","):
                candidate = part.strip().split()[0] if part.strip() else ""
                if candidate:
                    links.add(candidate)

        for link in links:
            parsed = urllib.parse.urlparse(link)
            if parsed.scheme in SKIP_SCHEMES or link.startswith("#") or not link:
                continue
            path = urllib.parse.unquote(parsed.path)
            if path:
                if path.startswith("/"):
                    target = os.path.join(root, path.lstrip("/"))
                else:
                    target = os.path.normpath(os.path.join(os.path.dirname(hf), path))
                if os.path.isdir(target):
                    if not os.path.exists(os.path.join(target, "index.html")):
                        problems.append(f"{rel_hf}: {link} -> directory without index.html")
                elif not os.path.exists(target) and not os.path.exists(target + "/index.html"):
                    problems.append(f"{rel_hf}: {link} -> missing target")

            query = urllib.parse.parse_qs(parsed.query)
            for cat in query.get("cat", []):
                if cat not in valid_cat:
                    problems.append(f"{rel_hf}: {link} -> unknown cat '{cat}'")
            for sub in query.get("sub", []):
                if sub not in valid_sub:
                    problems.append(f"{rel_hf}: {link} -> unknown sub '{sub}'")

    if problems:
        print(f"Hidden Reef link check FAILED ({len(problems)} problems in {len(html_files)} pages):")
        for problem in sorted(problems):
            print(f"  {problem}")
        return 1
    print(f"Hidden Reef link check passed ({len(html_files)} pages).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
