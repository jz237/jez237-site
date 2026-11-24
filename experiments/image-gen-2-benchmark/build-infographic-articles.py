#!/usr/bin/env python3
"""Build static factual infographic articles and their main sitemap entries."""
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ARCHIVE = Path(__file__).resolve().parent
BASE = "https://jez237.com/experiments/image-gen-2-benchmark/"
MEDIA = "https://media.jez237.com/image-gen-2-benchmark/"
BEGIN = "  <!-- Factual infographic articles: generated -->"
END = "  <!-- End factual infographic articles -->"
CATEGORIES = {
    "factual-infographic": "General Science",
    "bizarre-insect-life": "Bizarre Insect Life",
    "rare-insect": "Bizarre Insect Life",
    "reef-fish-infographic": "Reef Fish Atlas",
    "medical-health-infographic": "Medical & Health",
    "cat-infographic": "Cat Atlas",
    "phobia-infographic": "Factual Phobias",
}


def escape(value):
    return html.escape(value or "", quote=True)


def tag(notes, key):
    match = re.search(rf"(?:^|;)\s*{key}:\s*([a-z-]+)", notes or "")
    return match[1] if match else ""


def web_url(value):
    parsed = urlsplit(value)
    if parsed.scheme in {"https", "http"} and parsed.netloc:
        return escape(value)
    raise ValueError(f"Invalid source URL: {value}")


def research(facts, supplement):
    evidence = facts.get("evidence") or supplement or {}
    if not evidence.get("sources"):
        note = facts.get("sourceNote", "")
        parts = []
        cursor = 0
        for match in re.finditer(r"""https?://[^\s<>"']+""", note):
            url = match[0].rstrip(".,;)]")
            parts.append(escape(note[cursor:match.start()]))
            target = web_url(url)
            parts.append(f'<a href="{target}">{target}</a>')
            cursor = match.start() + len(url)
        parts.append(escape(note[cursor:]))
        return f"""<section><h2>Archive source notes</h2>
<p>{"".join(parts)}</p>
<p>This older entry does not yet have a source-by-source research record.</p></section>"""
    sources = {}
    for index, item in enumerate(evidence["sources"], start=1):
        sources[item["id"]] = (index, item)
    claims = []
    for claim in evidence["claims"]:
        refs = " ".join(f'<a href="#source-{sources[key][0]}">[{sources[key][0]}]</a>'
                        for key in claim["sourceIds"])
        claims.append(f'<li>{escape(claim["claim"])} {refs}</li>')
    citations = []
    for index, item in sources.values():
        citations.append(f'<li id="source-{index}"><a href="{web_url(item["url"])}">'
                         f'{escape(item["title"])}</a> — {escape(item["publisher"])}</li>')
    heading = "Research behind the infographic" if facts.get("evidence") else "Research added after publication"
    return (f'<section><h2>{heading}</h2><ul>' + "".join(claims)
            + '</ul><h3>Sources</h3><ol>' + "".join(citations) + '</ol></section>')


def article(row, url, supplement):
    facts = row["factualInfographic"]
    title = row["title"].removeprefix("Factual infographic:").strip()
    description = facts["description"]
    image_path = row["image"]
    if not re.fullmatch(r"images/[a-zA-Z0-9_.-]+", image_path):
        raise ValueError(f"Invalid archived image path: {image_path}")
    image = MEDIA + image_path
    notes = row.get("tests", "")
    subtype = tag(notes, "factual_subtype")
    cat_category = tag(notes, "cat_category").replace("-", " ").title()
    category = CATEGORIES.get(subtype, "Factual Infographics")
    if subtype == "cat-infographic":
        category = '<a href="../../cat-infographics">' + category + "</a>"
        if cat_category:
            category += " / " + escape(cat_category)
    else:
        category = escape(category)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} | Jez237 Factual Infographics</title>
<meta name="description" content="{escape(description)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(description)}">
<meta property="og:image" content="{escape(image)}">
<link rel="stylesheet" href="../../infographic-article.css">
</head>
<body>
<header><nav aria-label="Breadcrumb"><a href="../../factual-infographics">Factual Infographics</a> / {category}</nav></header>
<main><article>
<header><time datetime="{escape(row["date"])}">{escape(row["date"])}</time>
<h1>{escape(title)}</h1><p class="intro">{escape(description)}</p></header>
<figure><a href="{escape(image)}"><img src="{escape(image)}" alt="{escape(title)}"></a>
<figcaption><a href="{escape(image)}">View full-size infographic</a></figcaption></figure>
{research(facts, supplement)}
</article></main>
</body>
</html>
"""


def write_if_changed(path, value):
    if not path.exists() or path.read_text(encoding="utf-8") != value:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value, encoding="utf-8")


def main():
    rows = json.loads((ARCHIVE / "factual-infographics-data.json").read_text())
    supplements = json.loads((ARCHIVE / "infographic-research-supplements.json").read_text())
    pages = {}
    for row in rows:
        key = row["id"]
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", key) or key in pages:
            raise ValueError(f"Invalid or duplicate infographic ID: {key}")
        url = BASE + f"infographics/{key}/"
        pages[key] = (url, row["date"], article(row, url, supplements.get(key)))

    if set(supplements) - pages.keys():
        raise ValueError("Research supplement has no matching infographic")
    sitemap = ARCHIVE.parents[1] / "sitemap.xml"
    original = sitemap.read_text(encoding="utf-8")
    original = re.sub(r"(?ms)^" + re.escape(BEGIN) + r"\n.*?^" + re.escape(END) + r"\n", "", original)
    if original.count("</urlset>") != 1:
        raise ValueError("Unexpected sitemap structure")
    entries = [f"  <url><loc>{url}</loc><lastmod>{escape(date)}</lastmod></url>"
               for url, date, _ in sorted(pages.values())]
    for key, (_, _, page) in pages.items():
        write_if_changed(ARCHIVE / "infographics" / key / "index.html", page)
    write_if_changed(sitemap, original.replace("</urlset>", "\n".join([BEGIN, *entries, END, "</urlset>"])))
    print(f"Built {len(pages)} infographic articles and sitemap URLs.")


if __name__ == "__main__":
    main()
