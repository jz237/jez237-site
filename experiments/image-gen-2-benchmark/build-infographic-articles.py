#!/usr/bin/env python3
"""Build the text page for every factual infographic, pack them by month and refresh their sitemap entries.

Each infographic has a page at /experiments/image-gen-2-benchmark/infographics/<id>/ (served from the monthly
packs by functions/experiments/image-gen-2-benchmark/infographics/[id].js). A page is put together from:

  factual-infographics-data.json         the entry, its description, source note and research record
  infographic-research-supplements.json  research added later for entries that had no record
  infographic-article-text.json          the written text: an introduction, "At a glance" and titled sections

The written text may only restate what the entry's research record says. check_text() enforces what a script
can: the shape, the lengths, that each section names sources the entry has, and that every figure in the text
appears in the entry's own record. An entry with no written text still gets a page, showing its research notes.

    python3 build-infographic-articles.py                 build the packs and the sitemap block
    python3 build-infographic-articles.py --check FILE    check a text file (or a draft batch) and build nothing
"""
import html
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlsplit

ARCHIVE = Path(__file__).resolve().parent
BASE = "https://jez237.com/experiments/image-gen-2-benchmark/"
MEDIA = "https://media.jez237.com/image-gen-2-benchmark/"
BEGIN = "  <!-- Factual infographic articles: generated -->"
END = "  <!-- End factual infographic articles -->"
STYLE_VERSION = "20261125"
# Topic group -> (label, gallery page). The groups are the ones in factual_groups.py.
GROUPS = {
    "cats": ("Cat Atlas", "cat-infographics"),
    "insects": ("Insects", "insect-infographics"),
    "phobias": ("Phobias", "phobia-infographics"),
    "health": ("Health conditions", "health-infographics"),
    "reef-fish": ("Reef fish", "reef-fish-infographics"),
    "earth-space": ("Earth & space", "earth-space-infographics"),
    "how-things-work": ("How things work", "how-things-work-infographics"),
    "nature-science": ("Nature & science", "nature-science-infographics"),
}
MONTHS = ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
          "November", "December")
HEALTH_NOTE = ("This page is general information for learning. It is not a diagnosis or medical advice. "
               "Talk to a health professional about your own situation.")

# Limits for the written text (words).
DEK_WORDS = (12, 55)
PARAGRAPH_WORDS = (18, 130)
BODY_WORDS = (80, 520)
BRITISH = re.compile(
    r"\b(?:coloured|colours?|behaviours?|favourites?|favours?|centres?|centred|metres?|litres?|fibres?|defence|"
    r"analys(?:e|ed|ing)|\w*(?:organis|recognis|specialis|minimis|maximis|crystallis|stabilis|fertilis|"
    r"neutralis|magnetis|polaris|vaporis|oxidis|ionis|synchronis|colonis|characteris|categoris|emphasis)"
    r"(?:e|ed|es|ing|ation|ations)|travell(?:ed|ing)|labell(?:ed|ing)|modell(?:ed|ing)|programmes?|tyres?|"
    r"aluminium|moulds?|moult(?:s|ed|ing)?|oesophag\w*|haemo\w*|anaemi\w*|foetus|paediatric\w*|oedema|"
    r"diarrhoea|tumours?|neighbours?|neighbouring|odours?|vapours?|harbours?|armoured|armour|"
    r"catalogues?|grey|whilst|amongst)\b", re.I)
BANNED = re.compile(
    r"—|<|>|\*\*|https?:|\bthe claims?\b|\bthe prompt\b|source-verified|\bverified\b|fascinating|"
    r"\bdelve|\bboasts?\b|\bstunning\b|\bincredibl[ey]\b|\bamazing\b", re.I)
NUMBER = re.compile(r"\d+(?:[.,]\d+)*")


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


def long_date(value):
    year, month, day = (int(part) for part in value[:10].split("-"))
    return f"{MONTHS[month - 1]} {day}, {year}"


def plain_title(row):
    return row["title"].removeprefix("Factual infographic:").strip()


def evidence_for(row, supplement):
    facts = row["factualInfographic"]
    evidence = facts.get("evidence") or supplement or {}
    return evidence if evidence.get("sources") else {}


def numbers(value):
    return {match[0].replace(",", "").rstrip(".") for match in NUMBER.finditer(value or "")}


def words(value):
    return len(re.findall(r"[^\s]+", value or ""))


def record_text(row, evidence, extra_claims=()):
    """Everything the entry's own record says: the only place the written text may take a figure from."""
    facts = row["factualInfographic"]
    parts = [row["title"], facts.get("topic", ""), facts.get("description", ""), facts.get("sourceNote", "")]
    parts += [claim["claim"] for claim in evidence.get("claims", [])]
    parts += [claim["claim"] for claim in extra_claims]
    parts += [source.get("title", "") + " " + source.get("publisher", "") for source in evidence.get("sources", [])]
    return "\n".join(parts)


def check_text(key, text, row, evidence, extra_claims=()):
    """Return the problems with one entry's written text (an empty list when it is fine)."""
    problems = []
    if not isinstance(text, dict):
        return ["must be an object"]
    unknown = set(text) - {"dek", "glance", "sections"}
    if unknown:
        problems.append(f"unknown keys: {sorted(unknown)}")
    dek = text.get("dek")
    glance = text.get("glance")
    sections = text.get("sections")
    if not isinstance(dek, str) or not DEK_WORDS[0] <= words(dek) <= DEK_WORDS[1]:
        problems.append(f"dek must be {DEK_WORDS[0]} to {DEK_WORDS[1]} words")
    if not isinstance(glance, list) or not 3 <= len(glance) <= 6:
        problems.append("glance must have 3 to 6 rows")
        glance = []
    for item in glance:
        if (not isinstance(item, list) or len(item) != 2 or not all(isinstance(part, str) and part.strip() for part in item)
                or words(item[0]) > 4 or words(item[1]) > 18):
            problems.append(f"glance row must be [label of up to 4 words, value of up to 18 words]: {item!r}")
    if not isinstance(sections, list) or not 2 <= len(sections) <= 5:
        problems.append("sections must have 2 to 5 entries")
        sections = []
    known = {source["id"] for source in evidence.get("sources", [])}
    body_words = 0
    strings = [dek or ""] + [part for item in glance if isinstance(item, list) for part in item if isinstance(part, str)]
    headings = set()
    for section in sections:
        if not isinstance(section, dict) or set(section) != {"heading", "body", "sources"}:
            problems.append("each section needs exactly heading, body and sources")
            continue
        heading, body, cited = section["heading"], section["body"], section["sources"]
        if not isinstance(heading, str) or not 1 <= words(heading) <= 8 or heading in headings:
            problems.append(f"heading must be 1 to 8 words and not repeated: {heading!r}")
        headings.add(heading)
        if not isinstance(body, list) or not 1 <= len(body) <= 3 or not all(isinstance(part, str) for part in body):
            problems.append(f"{heading!r}: body must be 1 to 3 paragraphs")
            continue
        for paragraph in body:
            count = words(paragraph)
            body_words += count
            if not PARAGRAPH_WORDS[0] <= count <= PARAGRAPH_WORDS[1]:
                problems.append(f"{heading!r}: a paragraph has {count} words; keep to {PARAGRAPH_WORDS[0]}-{PARAGRAPH_WORDS[1]}")
        if not isinstance(cited, list) or not cited or not set(cited) <= known:
            problems.append(f"{heading!r}: sources must name at least one of {sorted(known)}")
        strings += [heading, *body]
    if sections and not BODY_WORDS[0] <= body_words <= BODY_WORDS[1]:
        problems.append(f"sections total {body_words} words; keep to {BODY_WORDS[0]}-{BODY_WORDS[1]}")
    allowed = numbers(record_text(row, evidence, extra_claims))
    for value in strings:
        stray = numbers(value) - allowed
        if stray:
            problems.append(f"figure not in this entry's record: {sorted(stray)} in {value[:70]!r}")
        hit = BANNED.search(value)
        if hit:
            problems.append(f"not allowed: {hit[0]!r} in {value[:70]!r}")
        hit = BRITISH.search(value)
        if hit and hit[0].lower() not in record_text(row, evidence, extra_claims).lower():
            problems.append(f"use American spelling: {hit[0]!r} in {value[:70]!r}")
        if value != value.strip() or "  " in value or "\n" in value:
            problems.append(f"stray spacing in {value[:70]!r}")
    return problems


def linked_note(note):
    parts = []
    cursor = 0
    for match in re.finditer(r"""https?://[^\s<>"']+""", note):
        url = match[0].rstrip(".,;)]")
        parts.append(escape(note[cursor:match.start()]))
        target = web_url(url)
        parts.append(f'<a href="{target}">{target}</a>')
        cursor = match.start() + len(url)
    parts.append(escape(note[cursor:]))
    return "".join(parts)


def research(facts, evidence, written):
    """The research record: the notes list (folded away when there is written text above it) and the sources."""
    note = facts.get("sourceNote", "")
    if not evidence:
        return f"""<section class="ia-sources"><h2>Archive source notes</h2>
<p>{linked_note(note)}</p>
<p>This older entry does not yet have a source-by-source research record.</p></section>"""
    order = {item["id"]: index for index, item in enumerate(evidence["sources"], start=1)}
    claims = []
    for claim in evidence["claims"]:
        refs = " ".join(f'<a href="#source-{order[key]}">[{order[key]}]</a>' for key in claim["sourceIds"])
        claims.append(f'<li>{escape(claim["claim"])} {refs}</li>')
    citations = []
    for item in evidence["sources"]:
        citations.append(f'<li id="source-{order[item["id"]]}"><a href="{web_url(item["url"])}">'
                         f'{escape(item["title"])}</a> — {escape(item["publisher"])}</li>')
    heading = "Research behind the infographic" if facts.get("evidence") else "Research added after publication"
    notes = "<ul>" + "".join(claims) + "</ul>"
    if written:
        notes = (f'<details class="ia-notes"><summary>{heading}: the working notes</summary>'
                 f'<p class="ia-small">These are the notes the picture was checked against. Some are written as '
                 f'instructions to the illustrator.</p>{notes}</details>')
    else:
        notes = f'<section class="ia-notes"><h2>{heading}</h2>{notes}</section>'
    checked = evidence.get("checkedAt")
    checked = f'<p class="ia-small">Sources checked {long_date(checked)}.</p>' if checked else ""
    archive = f'<p class="ia-small">Archive note: {linked_note(note)}</p>' if note else ""
    return (f'{notes}<section class="ia-sources"><h2>Sources</h2>{checked}<ol>' + "".join(citations)
            + f'</ol>{archive}</section>')


def written_text(text, evidence):
    if not text:
        return ""
    order = {item["id"]: index for index, item in enumerate(evidence["sources"], start=1)}
    glance = "".join(f"<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>" for label, value in text["glance"])
    parts = [f'<section class="ia-glance" aria-labelledby="glance-title"><h2 id="glance-title">At a glance</h2>'
             f'<dl>{glance}</dl></section>']
    for section in text["sections"]:
        refs = " ".join(f'<a href="#source-{order[key]}">[{order[key]}]</a>'
                        for key in sorted(section["sources"], key=order.get))
        body = "".join(f"<p>{escape(paragraph)}</p>" for paragraph in section["body"])
        parts.append(f'<section><h2>{escape(section["heading"])}</h2>{body}'
                     f'<p class="ia-refs">Sources: {refs}</p></section>')
    return "".join(parts)


def media(path, folder):
    if not re.fullmatch(folder + r"/[a-zA-Z0-9_.-]+", path or ""):
        raise ValueError(f"Invalid archived {folder} path: {path}")
    return MEDIA + path


def related(row, neighbours):
    cards = []
    for other in neighbours:
        thumb = other.get("thumb")
        picture = f'<img src="{escape(media(thumb, "thumbs"))}" alt="" loading="lazy">' if thumb else ""
        cards.append(f'<li><a href="../{escape(other["id"])}/">{picture}<span>{escape(plain_title(other))}</span></a></li>')
    return "".join(cards)


def article(row, url, evidence, text, neighbours):
    facts = row["factualInfographic"]
    title = plain_title(row)
    description = facts["description"]
    image = media(row["image"], "images")
    group = facts.get("group") if facts.get("group") in GROUPS else "nature-science"
    label, page = GROUPS[group]
    cat_category = tag(row.get("tests", ""), "cat_category").replace("-", " ")
    eyebrow = escape(label) + (" / " + escape(cat_category.capitalize()) if cat_category else "")
    size = re.fullmatch(r"(\d+)x(\d+)", row.get("size", ""))
    dimensions = f' width="{size[1]}" height="{size[2]}"' if size else ""
    shape = "wide" if size and int(size[1]) > int(size[2]) else "tall"
    summary = text["dek"] if text else description
    health = f'<p class="ia-small ia-care">{HEALTH_NOTE}</p>' if group in {"health", "phobias"} else ""
    more = related(row, neighbours)
    more = f'<ul class="ia-cards">{more}</ul>' if more else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>(function(){{try{{if(localStorage.getItem("theme")==="light")document.documentElement.setAttribute("data-theme","light");}}catch(e){{}}}})();</script>
<title>{escape(title)} | Jez237 Factual Infographics</title>
<meta name="description" content="{escape(description)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(description)}">
<meta property="og:image" content="{escape(image)}">
<link rel="icon" type="image/svg+xml" href="../../../../assets/brand.svg">
<link rel="stylesheet" href="../../../../assets/styles.css">
<link rel="stylesheet" href="../../../../assets/design.css">
<link rel="stylesheet" href="../../museum-theme.css?v=6">
<link rel="stylesheet" href="../../infographic-article.css?v={STYLE_VERSION}">
</head>
<body class="ia-page">
<header id="site-nav"></header>
<main class="ia ia-{shape}">
<nav class="ia-crumbs" aria-label="Breadcrumb"><a href="../../factual-infographics">← Factual infographics</a><span aria-hidden="true">/</span><a href="../../{page}">{escape(label)}</a></nav>
<div class="ia-spread">
<div class="ia-heading"><p class="ia-eyebrow">{eyebrow} · <time datetime="{escape(row["date"])}">{long_date(row["date"])}</time></p>
<h1>{escape(title)}</h1><p class="ia-dek">{escape(summary)}</p></div>
<figure class="ia-figure"><a href="{escape(image)}" aria-label="Open the full-size {escape(title)} infographic"><img src="{escape(image)}" alt="{escape(title)} infographic; its facts are given as text on this page"{dimensions} fetchpriority="high"></a>
<figcaption>{escape(description) if text else "The infographic."} <a href="{escape(image)}">Open the picture full size</a></figcaption></figure>
<article class="ia-text">
{written_text(text, evidence)}{health}
{research(facts, evidence, bool(text))}
<section class="ia-about"><h2>About the picture</h2>
<p>This infographic is an AI-generated illustration, made with {escape(row.get("model", "an image model"))} on {long_date(row["date"])} for the Jez237 AI Images archive. It is not a photograph, and small details in the artwork may be imperfect; where the picture and the text differ, go by the text and the sources. The prompt that made it is on its card in <a href="../../{page}">{escape(label)}</a>.</p></section>
</article>
</div>
<section class="ia-more" aria-labelledby="more-title"><h2 id="more-title">Keep exploring</h2>
<p>More from <a href="../../{page}">{escape(label)}</a>, or see <a href="../../factual-infographics">all factual infographics</a>.</p>
{more}</section>
</main>
<footer class="ia-footer">Part of the <a href="../../">AI Images</a> archive on Jez237.</footer>
<script src="../../../../assets/nav.js?v=ai-images-20260930" defer></script>
</body>
</html>
"""


def neighbours_for(rows):
    """Up to four other entries from the same group for each entry: the ones published just before it, or just
    after it for a group's first entries. Entries are added at the end, so a page's list never changes later."""
    groups = defaultdict(list)
    for row in sorted(rows, key=lambda item: (item["date"], item["id"])):
        groups[row["factualInfographic"].get("group")].append(row)
    result = {}
    for members in groups.values():
        for index, row in enumerate(members):
            before = members[max(0, index - 4):index][::-1]
            after = members[index + 1:index + 1 + 4 - len(before)]
            result[row["id"]] = before + after
    return result


def write_if_changed(path, value):
    if not path.exists() or path.read_text(encoding="utf-8") != value:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value, encoding="utf-8", newline="\n")


def load(name):
    return json.loads((ARCHIVE / name).read_text(encoding="utf-8"))


def check_file(path):
    """Check a text file, or a draft batch of the form {"text": {...}, "claims": {id: [added claims]}}."""
    rows = {row["id"]: row for row in load("factual-infographics-data.json")}
    supplements = load("infographic-research-supplements.json")
    draft = json.loads(Path(path).read_text(encoding="utf-8"))
    texts, added = (draft["text"], draft.get("claims", {})) if "text" in draft else (draft, {})
    bad = 0
    for key, text in texts.items():
        if key not in rows:
            problems = ["no infographic has this id"]
        else:
            evidence = evidence_for(rows[key], supplements.get(key))
            problems = check_text(key, text, rows[key], evidence, added.get(key, ()))
        for problem in problems:
            print(f"{key}: {problem}")
        bad += bool(problems)
    print(f"{len(texts)} entries checked, {bad} with problems.")
    return 1 if bad else 0


def main():
    rows = load("factual-infographics-data.json")
    supplements = load("infographic-research-supplements.json")
    texts = load("infographic-article-text.json")
    nearby = neighbours_for(rows)
    pages = {}
    for row in rows:
        key = row["id"]
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", key) or key in pages:
            raise ValueError(f"Invalid or duplicate infographic ID: {key}")
        evidence = evidence_for(row, supplements.get(key))
        text = texts.get(key)
        if text:
            problems = check_text(key, text, row, evidence)
            if problems:
                raise ValueError(f"Written text for {key}: " + "; ".join(problems))
        url = BASE + f"infographics/{key}/"
        pages[key] = (url, row["date"], article(row, url, evidence, text, nearby[key]))

    if set(supplements) - pages.keys():
        raise ValueError("Research supplement has no matching infographic")
    if set(texts) - pages.keys():
        raise ValueError("Written text has no matching infographic")
    sitemap = ARCHIVE.parents[1] / "sitemap.xml"
    original = sitemap.read_text(encoding="utf-8")
    original = re.sub(r"(?ms)^" + re.escape(BEGIN) + r"\n.*?^" + re.escape(END) + r"\n", "", original)
    if original.count("</urlset>") != 1:
        raise ValueError("Unexpected sitemap structure")
    entries = [f"  <url><loc>{url}</loc><lastmod>{escape(date)}</lastmod></url>"
               for url, date, _ in sorted(pages.values())]
    packs = defaultdict(dict)
    for key, (_, date, page) in sorted(pages.items()):
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date) or not key.startswith(date + "-"):
            raise ValueError(f"Invalid dated article ID: {key}")
        packs[date[:7]][key] = page
    for month, pack in packs.items():
        write_if_changed(ARCHIVE / f"infographic-articles-{month}.json",
                         json.dumps(pack, ensure_ascii=False, separators=(",", ":")) + "\n")
    write_if_changed(sitemap, original.replace("</urlset>", "\n".join([BEGIN, *entries, END, "</urlset>"])))
    print(f"Built {len(pages)} infographic articles ({len(texts)} with written text) and sitemap URLs.")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--check":
        sys.exit(check_file(sys.argv[2]))
    main()
