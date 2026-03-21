#!/usr/bin/env python3
import json
import math
import os
import re
import urllib.request
import urllib.parse
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
import xml.etree.ElementTree as ET

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "data")
PUBLIC_DIR = os.path.join(BASE, "public")
FEEDS_PATH = os.path.join(BASE, "feeds.json")
STORE_PATH = os.path.join(DATA_DIR, "items.json")
IMAGE_CACHE_PATH = os.path.join(DATA_DIR, "image_cache.json")

USER_AGENT = "Mozilla/5.0 (compatible; AI-News-Bot/1.0; +https://openclaw.ai)"
MAX_STORE_ITEMS = 1500
MAX_ITEM_AGE_DAYS = 14
TOP_DAILY_COUNT = 12
TOP_LATEST_COUNT = 50
MAX_OG_FETCH_PER_RUN = 20
IMAGE_CACHE_TTL_DAYS = 7

KEYWORDS = {
    "major": ["release", "launch", "announces", "introduces", "debut", "new model", "api", "open source"],
    "research": ["paper", "benchmark", "sota", "state-of-the-art", "evaluation", "arxiv"],
    "infra": ["inference", "training", "gpu", "optimization", "agent", "tool use", "reasoning"],
}

# Editorial preference layer: prioritize the kinds of stories Jez actually wants to see.
EDITORIAL_PRIORITY = {
    "big_names": [
        "claude", "anthropic", "chatgpt", "openai", "gpt-5", "gpt 5",
        "gemini", "google deepmind", "deepmind", "grok", "xai", "alexa+", "alexa plus",
        "copilot", "mistral", "deepseek", "llama", "meta ai"
    ],
    "capabilities": [
        "can now", "now creates", "now generate", "create visuals", "charts and diagrams",
        "interactive visuals", "image generation", "generate images", "video generation",
        "voice mode", "vision", "multimodal", "agent", "tool use", "coding",
        "code generation", "reasoning", "memory", "search", "browser"
    ],
    "product_impact": [
        "available now", "available today", "rolling out", "launches", "announces",
        "for everyone", "public beta", "generally available", "in chatgpt", "in claude",
        "in gemini", "for alexa+", "assistant", "app"
    ],
    "hard_boost": [
        "claude can now", "chatgpt can now", "gemini can now", "grok can now",
        "alexa+", "alexa plus", "chatgpt", "claude", "gemini", "grok",
        "openai announces", "anthropic announces", "google announces", "xai announces"
    ],
    "hard_downrank": [
        "framework", "toolkit", "sdk", "library", "engineering blog", "how we built",
        "vector search", "rag", "retrieval", "agent toolkit", "developer toolkit"
    ],
    "fluff_downrank": [
        "i asked chatgpt", "chatgpt helped", "helped feds", "where can i retire",
        "better results", "life hack", "prompt rule", "staffer says", "lawmakers",
        "faced serious questions", "privacy nightmare"
    ],
    "downrank": [
        "framework", "library", "toolkit", "sdk", "how we built", "engineering blog",
        "vector search", "rag", "retrieval", "inference optimization",
        "training optimization", "gpu optimization", "survey"
    ],
}

# Strong signals that an item is specifically about a NEW AI model release.
# Must be specific enough to avoid false positives (e.g. generic "release notes").
MODEL_RELEASE_SIGNALS = [
    # Explicit release phrases
    "new model", "model release", "model launch", "foundation model",
    "releases its", "launches its", "releases new", "launches new",
    # Company + action
    "openai releases", "openai launches", "openai announces",
    "anthropic releases", "anthropic launches", "anthropic announces",
    "google releases", "google launches", "google deepmind releases",
    "meta releases", "meta launches", "meta ai releases",
    "mistral releases", "mistral launches", "mistral ai releases",
    "deepseek releases", "deepseek launches",
    "xai releases", "xai launches", "grok releases",
    "cohere releases", "cohere launches",
    "nvidia releases", "nvidia launches",
    "amazon releases", "amazon launches",
    # Specific well-known model families
    "gpt-5", "gpt-4o", "gpt-4.5", "gpt-5.4", "gpt-5.3",
    "claude 3", "claude 4", "claude opus", "claude sonnet", "claude haiku",
    "gemini 2", "gemini 3", "gemini ultra", "gemini flash",
    "llama 4", "llama 3", "llama 3.1", "llama 3.2", "llama 3.3",
    "deepseek-v", "deepseek-r",
    "grok-3", "grok-2", "grok-4",
    "phi-4", "phi-5", "mistral large", "mistral small", "mixtral",
    "qwen 3", "qwen2", "qwen-max",
    # Release status phrases
    "now available", "generally available", "publicly available",
    "available today", "available now", "open sourced", "open-sourced",
]


def now_utc():
    return datetime.now(timezone.utc)


def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)


def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)


def canonicalize_url(url):
    try:
        p = urllib.parse.urlparse(url.strip())
        q = urllib.parse.parse_qsl(p.query, keep_blank_values=False)
        q = [(k, v) for (k, v) in q if not k.lower().startswith("utm_") and k.lower() not in {"ref", "source"}]
        new_query = urllib.parse.urlencode(q)
        clean = urllib.parse.urlunparse((p.scheme, p.netloc.lower(), p.path.rstrip("/"), "", new_query, ""))
        return clean
    except Exception:
        return url.strip()


def try_parse_date(value):
    if not value:
        return None
    value = value.strip()
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        pass
    # ISO fallback
    try:
        value = value.replace("Z", "+00:00")
        dt = datetime.fromisoformat(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def text(el):
    if el is None:
        return ""
    return (el.text or "").strip()


def find_child(el, name):
    for c in el:
        if c.tag.lower().endswith(name.lower()):
            return c
    return None


def strip_html(value):
    value = value or ""
    return re.sub("<[^>]+>", "", value).strip()


def extract_first_img_from_html(value):
    value = value or ""
    m = re.search(r"<img[^>]+src=[\"']([^\"']+)[\"']", value, flags=re.IGNORECASE)
    return m.group(1).strip() if m else ""


def looks_like_image_url(url):
    if not url:
        return False
    url_l = url.lower()
    return any(ext in url_l for ext in [".jpg", ".jpeg", ".png", ".webp", ".gif", "format=jpg", "format=png"]) or "image" in url_l


def extract_og_image_from_html(html, page_url):
    if not html:
        return ""

    patterns = [
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image["\']',
    ]

    for pat in patterns:
        m = re.search(pat, html, flags=re.IGNORECASE)
        if m:
            candidate = m.group(1).strip()
            if candidate.startswith("//"):
                candidate = "https:" + candidate
            candidate = urllib.parse.urljoin(page_url, candidate)
            if candidate.startswith("http://") or candidate.startswith("https://"):
                return candidate
    return ""


def fetch_og_image(page_url):
    try:
        req = urllib.request.Request(page_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=12) as r:
            content_type = r.headers.get("Content-Type", "")
            if "text/html" not in content_type:
                return ""
            html = r.read(350000).decode("utf-8", errors="ignore")
            return extract_og_image_from_html(html, page_url)
    except Exception:
        return ""


def parse_feed_xml(xml_bytes, source_name, source_url, source_weight):
    items = []
    root = ET.fromstring(xml_bytes)

    tag = root.tag.lower()

    # RSS
    if tag.endswith("rss") or tag.endswith("rdf"):
        channel = find_child(root, "channel")
        if channel is None:
            channel = root
        for it in channel:
            if not it.tag.lower().endswith("item"):
                continue
            title = text(find_child(it, "title"))
            link = text(find_child(it, "link"))
            pub = text(find_child(it, "pubDate")) or text(find_child(it, "date"))

            desc_el = find_child(it, "description")
            content_el = find_child(it, "encoded")
            summary_html = text(desc_el) or text(content_el)

            image = ""
            # media:thumbnail / media:content / enclosure url
            for c in it:
                tag_l = c.tag.lower()
                if tag_l.endswith("thumbnail") or tag_l.endswith("content"):
                    u = c.attrib.get("url", "").strip()
                    if u and (tag_l.endswith("thumbnail") or looks_like_image_url(u)):
                        image = u
                        break
                if tag_l.endswith("enclosure"):
                    u = c.attrib.get("url", "").strip()
                    t = c.attrib.get("type", "").lower()
                    if u and (t.startswith("image/") or looks_like_image_url(u)):
                        image = u
                        break

            if not image:
                image = extract_first_img_from_html(summary_html)

            if title and link:
                items.append({
                    "title": title,
                    "url": link,
                    "published": try_parse_date(pub),
                    "summary": strip_html(summary_html)[:600],
                    "image": image,
                    "source": source_name,
                    "sourceUrl": source_url,
                    "sourceWeight": source_weight,
                })

    # Atom
    elif tag.endswith("feed"):
        for ent in root:
            if not ent.tag.lower().endswith("entry"):
                continue
            title = text(find_child(ent, "title"))
            link = ""
            image = ""
            for c in ent:
                if c.tag.lower().endswith("link"):
                    href = c.attrib.get("href")
                    rel = c.attrib.get("rel", "alternate")
                    if href and rel in ("alternate", "") and not link:
                        link = href
                    if href and rel == "enclosure":
                        t = c.attrib.get("type", "").lower()
                        if t.startswith("image/") or looks_like_image_url(href):
                            image = href
            pub = text(find_child(ent, "published")) or text(find_child(ent, "updated"))
            summary_html = text(find_child(ent, "summary")) or text(find_child(ent, "content"))

            if not image:
                image = extract_first_img_from_html(summary_html)

            if title and link:
                items.append({
                    "title": title,
                    "url": link,
                    "published": try_parse_date(pub),
                    "summary": strip_html(summary_html)[:600],
                    "image": image,
                    "source": source_name,
                    "sourceUrl": source_url,
                    "sourceWeight": source_weight,
                })

    return items


def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


def flag_model_release(item):
    """Detect if an item is specifically about a new AI model release.
    Sets item["model_release"] = True if matched. Returns True/False."""
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    text_blob = f"{title} {summary}"
    matched = any(sig in text_blob for sig in MODEL_RELEASE_SIGNALS)
    if matched:
        item["model_release"] = True
    return matched


def editorial_gate(item):
    """Lightweight editorial classifier for what belongs in #news.
    Returns (allow: bool, reason: str)."""
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    text_blob = f"{title} {summary}"

    # Always keep real model releases in the mix.
    if item.get("model_release"):
        return True, "model_release"



    big_name_hits = sum(1 for w in EDITORIAL_PRIORITY["big_names"] if w in text_blob)
    capability_hits = sum(1 for w in EDITORIAL_PRIORITY["capabilities"] if w in text_blob)
    impact_hits = sum(1 for w in EDITORIAL_PRIORITY["product_impact"] if w in text_blob)
    hard_boost_hits = sum(1 for w in EDITORIAL_PRIORITY["hard_boost"] if w in text_blob)
    hard_downrank_hits = sum(1 for w in EDITORIAL_PRIORITY["hard_downrank"] if w in text_blob)
    fluff_hits = sum(1 for w in EDITORIAL_PRIORITY["fluff_downrank"] if w in text_blob)

    # Strong product/platform/capability news should pass.
    if hard_boost_hits >= 1 and (capability_hits >= 1 or impact_hits >= 1 or big_name_hits >= 2):
        return True, "major_product_news"

    # Important big-company AI platform stories.
    if big_name_hits >= 2 and (capability_hits >= 1 or impact_hits >= 1):
        return True, "big_name_with_impact"

    # Commentary we still want sometimes.
    if "coding after coders" in text_blob:
        return True, "editorial_commentary"

    # Obvious framework/toolkit/plumbing posts should stay out unless they are model releases.
    if hard_downrank_hits >= 1 and hard_boost_hits == 0:
        return False, "framework_or_plumbing"

    # Generic fluff stays out.
    if fluff_hits >= 1 and hard_boost_hits == 0:
        return False, "fluff"

    # Narrow consumer/enterprise AI feature stories need stronger signals.
    if big_name_hits == 0 and capability_hits == 0 and impact_hits < 2:
        return False, "low_editorial_priority"

    # Otherwise allow if it has enough real-news shape.
    if (big_name_hits + capability_hits + impact_hits) >= 3:
        return True, "editorial_score_pass"

    return False, "did_not_clear_gate"


def score_item(item, now):
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    text_blob = f"{title} {summary}"

    keyword_score = 0.0
    for group, words in KEYWORDS.items():
        hits = sum(1 for w in words if w in text_blob)
        if group == "major":
            keyword_score += hits * 0.7
        elif group == "research":
            keyword_score += hits * 0.35
        else:
            keyword_score += hits * 0.3

    editorial_score = 0.0

    # Strongly prefer major AI products / brands Jez cares about.
    big_name_hits = sum(1 for w in EDITORIAL_PRIORITY["big_names"] if w in text_blob)
    editorial_score += min(big_name_hits, 3) * 2.0

    # Prefer real capability jumps and end-user visible improvements.
    capability_hits = sum(1 for w in EDITORIAL_PRIORITY["capabilities"] if w in text_blob)
    editorial_score += min(capability_hits, 3) * 1.4

    # Prefer launches / rollouts / broadly relevant product impact.
    impact_hits = sum(1 for w in EDITORIAL_PRIORITY["product_impact"] if w in text_blob)
    editorial_score += min(impact_hits, 3) * 1.1

    # Hard boost for the exact kind of major assistant/product stories Jez prefers.
    hard_boost_hits = sum(1 for w in EDITORIAL_PRIORITY["hard_boost"] if w in text_blob)
    editorial_score += min(hard_boost_hits, 2) * 2.0

    # Downrank generic framework/plumbing posts more aggressively.
    hard_downrank_hits = sum(1 for w in EDITORIAL_PRIORITY["hard_downrank"] if w in text_blob)
    editorial_score -= min(hard_downrank_hits, 2) * 2.2

    # Downrank generic consumer/political fluff that merely mentions big AI names.
    fluff_hits = sum(1 for w in EDITORIAL_PRIORITY["fluff_downrank"] if w in text_blob)
    editorial_score -= min(fluff_hits, 2) * 2.6

    # Downrank generic research/infra filler unless something else makes it important.
    downrank_hits = sum(1 for w in EDITORIAL_PRIORITY["downrank"] if w in text_blob)
    editorial_score -= min(downrank_hits, 3) * 0.9

    # Strong boost for confirmed AI model releases — preserve these in the mix.
    if item.get("model_release"):
        keyword_score += 6.0
        editorial_score += 2.3

    # Extra title bias: if a major product/capability signal is in the title, that's usually what Jez wants.
    title_priority_hits = sum(1 for w in (EDITORIAL_PRIORITY["big_names"] + EDITORIAL_PRIORITY["capabilities"] + EDITORIAL_PRIORITY["hard_boost"]) if w in title)
    editorial_score += min(title_priority_hits, 4) * 1.0

    published = item.get("published_dt") or now
    hours_old = max(0.0, (now - published).total_seconds() / 3600.0)
    recency = math.exp(-hours_old / 36.0)  # half-ish life ~25h

    return round((item.get("sourceWeight", 0.7) * 1.4) + keyword_score + editorial_score + (recency * 1.1), 4)


def scrape_llm_stats_news(page_url, source_name, weight):
    """Scrape AI news items from llm-stats.com/ai-news (Next.js SSR page)."""
    import re
    items = []
    try:
        html = fetch_url(page_url).decode("utf-8", errors="ignore")
        # Extract headlines from SSR text content (between > and <, 30+ chars, starts uppercase)
        headlines = re.findall(r'(?<=>)([A-Z][^<]{30,300})(?=<)', html)
        seen_titles = set()
        skip_phrases = ["your daily source", "subscribe", "join our newsletter",
                        "no spam", "privacy policy", "terms of service",
                        "the ai benchmarking", "toggle theme", "llm stats"]
        for headline in headlines:
            h = headline.strip()
            h = h.replace("&quot;", '"').replace("&#x27;", "'").replace("&amp;", "&")
            h_lower = h.lower()
            if any(skip in h_lower for skip in skip_phrases):
                continue
            if h in seen_titles:
                continue
            if len(h) < 35:
                continue
            seen_titles.add(h)
            # Use the llm-stats page as URL since individual items may not have stable links
            items.append({
                "title": h,
                "url": f"{page_url}#{hash(h) & 0xffffffff:08x}",
                "published": now_utc(),
                "summary": "",
                "image": "",
                "source": source_name,
                "sourceUrl": page_url,
                "sourceWeight": weight,
            })
    except Exception as e:
        print(f"[scrape_llm_stats_news] Error: {e}")
    return items[:30]


def main():
    ensure_dirs()
    now = now_utc()

    feeds = load_json(FEEDS_PATH, [])
    store = load_json(STORE_PATH, {"items": []})
    image_cache = load_json(IMAGE_CACHE_PATH, {"items": {}})
    cache_items = image_cache.get("items", {})

    existing = {}
    for it in store.get("items", []):
        u = canonicalize_url(it.get("url", ""))
        if u:
            existing[u] = it

    fetched = []
    errors = []

    for feed in feeds:
        name = feed.get("name")
        url = feed.get("url")
        weight = float(feed.get("weight", 0.7))
        category = feed.get("category", "AI")
        scrape_type = feed.get("type", "rss")
        if not name or not url:
            continue
        try:
            if scrape_type == "llm-stats-news":
                items = scrape_llm_stats_news(url, name, weight)
            else:
                body = fetch_url(url)
                items = parse_feed_xml(body, name, url, weight)
            for item in items:
                item["category"] = category
            fetched.extend(items)
        except Exception as e:
            errors.append({"source": name, "url": url, "error": str(e)})

    # Merge + normalize
    cutoff = now - timedelta(days=MAX_ITEM_AGE_DAYS)
    for item in fetched:
        item["url"] = canonicalize_url(item.get("url", ""))
        if not item["url"]:
            continue
        dt = item.get("published") or now
        if dt < cutoff:
            continue

        existing_item = existing.get(item["url"], {})
        merged = {
            "title": item.get("title") or existing_item.get("title", ""),
            "url": item["url"],
            "source": item.get("source") or existing_item.get("source", "Unknown"),
            "sourceUrl": item.get("sourceUrl") or existing_item.get("sourceUrl", ""),
            "sourceWeight": item.get("sourceWeight", existing_item.get("sourceWeight", 0.7)),
            "category": item.get("category") or existing_item.get("category", "AI"),
            "summary": item.get("summary") or existing_item.get("summary", ""),
            "image": canonicalize_url(item.get("image", "")) if item.get("image") else existing_item.get("image", ""),
            "published": (dt or now).isoformat(),
            "firstSeen": existing_item.get("firstSeen") or now.isoformat(),
            "lastSeen": now.isoformat(),
        }
        existing[item["url"]] = merged

    allowed_sources = {f.get("name") for f in feeds if f.get("name")}
    all_items = [it for it in existing.values() if it.get("source") in allowed_sources]

    # Parse dates first
    for it in all_items:
        it["published_dt"] = try_parse_date(it.get("published")) or now

    # Enrich missing images using page og:image/twitter:image (cached)
    cache_cutoff = now - timedelta(days=IMAGE_CACHE_TTL_DAYS)
    recent_first = sorted(all_items, key=lambda x: x["published_dt"], reverse=True)
    candidates = [it for it in recent_first if not it.get("image") and it.get("url")][:MAX_OG_FETCH_PER_RUN]

    og_fetched = 0
    for it in candidates:
        url = it.get("url")
        cached = cache_items.get(url, {})
        checked_at = try_parse_date(cached.get("checkedAt", "")) if isinstance(cached, dict) else None

        if checked_at and checked_at > cache_cutoff:
            cached_image = cached.get("image", "") if isinstance(cached, dict) else ""
            if cached_image:
                it["image"] = canonicalize_url(cached_image)
            continue

        img = fetch_og_image(url)
        if img:
            it["image"] = canonicalize_url(img)
            og_fetched += 1

        cache_items[url] = {
            "image": img,
            "checkedAt": now.isoformat(),
        }

    # Flag model releases (must run before scoring so boost is applied)
    for it in all_items:
        flag_model_release(it)
        allow, reason = editorial_gate(it)
        it["editorial_allow"] = allow
        it["editorial_reason"] = reason

    # Score and sort
    for it in all_items:
        it["score"] = score_item(it, now)

    # Override editorial gate for high-scoring items
    for it in all_items:
        if it["score"] >= 5.5 and not it.get("editorial_allow"):
            it["editorial_allow"] = True
            it["editorial_reason"] = "high_score_override"

    all_items.sort(key=lambda x: (x["published_dt"], x["score"]), reverse=True)
    all_items = all_items[:MAX_STORE_ITEMS]

    # Build outputs
    today = now.date()
    today_items = [it for it in all_items if it["published_dt"].date() == today]
    today_items.sort(key=lambda x: x["score"], reverse=True)
    daily_top = today_items[:TOP_DAILY_COUNT]

    ai_items = sorted([i for i in all_items if i.get("category","AI") == "AI"],
                      key=lambda x: (x["published_dt"], x["score"]), reverse=True)[:40]
    sci_items = sorted([i for i in all_items if i.get("category") == "Science"],
                       key=lambda x: (x["published_dt"], x["score"]), reverse=True)[:20]
    latest = ai_items + sci_items

    # Strip helper key
    for coll in (all_items, daily_top, latest):
        for it in coll:
            it.pop("published_dt", None)

    save_json(STORE_PATH, {"updatedAt": now.isoformat(), "items": all_items})
    save_json(IMAGE_CACHE_PATH, {"updatedAt": now.isoformat(), "items": cache_items})
    save_json(os.path.join(PUBLIC_DIR, "ai-news-latest.json"), {"updatedAt": now.isoformat(), "items": latest, "errors": errors})
    save_json(os.path.join(PUBLIC_DIR, f"ai-news-daily-{today.isoformat()}.json"), {"date": today.isoformat(), "updatedAt": now.isoformat(), "items": daily_top, "errors": errors})

    # Minimal static page
    html_items = "\n".join(
        f'<li><a href="{it["url"]}" target="_blank" rel="noopener">{it["title"]}</a> '
        f'<small>({it["source"]} · score {it["score"]})</small></li>'
        for it in daily_top
    ) or "<li>No items yet.</li>"

    html = f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>AI News Feed</title>
  <style>
    body {{ font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 900px; padding: 0 1rem; }}
    h1 {{ margin-bottom: .2rem; }}
    .muted {{ color: #666; margin-bottom: 1rem; }}
    li {{ margin: .5rem 0; line-height: 1.35; }}
    small {{ color: #666; }}
  </style>
</head>
<body>
  <h1>AI News Feed</h1>
  <div class=\"muted\">Updated: {now.isoformat()} · Top {len(daily_top)} for {today.isoformat()}</div>
  <ol>
    {html_items}
  </ol>
</body>
</html>
"""
    with open(os.path.join(PUBLIC_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Fetched feeds: {len(feeds)}")
    print(f"Stored items: {len(all_items)}")
    print(f"Today's top: {len(daily_top)}")
    print(f"OG images fetched this run: {og_fetched}")
    if errors:
        print(f"Feed errors: {len(errors)}")


if __name__ == "__main__":
    main()
