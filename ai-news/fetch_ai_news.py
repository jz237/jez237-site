#!/usr/bin/env python3
import json
import math
import os
import re
import hashlib
import html
import urllib.request
import urllib.parse
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo
import xml.etree.ElementTree as ET

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "data")
PUBLIC_DIR = os.path.join(BASE, "public")
THUMBNAIL_DIR = os.path.join(PUBLIC_DIR, "thumbnails")
FEEDS_PATH = os.path.join(BASE, "feeds.json")
STORE_PATH = os.path.join(DATA_DIR, "items.json")
IMAGE_CACHE_PATH = os.path.join(DATA_DIR, "image_cache.json")
ARCHIVE_INDEX_PATH = os.path.join(PUBLIC_DIR, "archive-index.json")

USER_AGENT = "Mozilla/5.0 (compatible; AI-News-Bot/1.0; +https://openclaw.ai)"
LOCAL_TZ = ZoneInfo("America/New_York")
MAX_STORE_ITEMS = 1500
MAX_ITEM_AGE_DAYS = 14
TOP_DAILY_COUNT = 18
TOP_LATEST_COUNT = 50
HIGH_SCORE_EDITORIAL_OVERRIDE = 4.0
MAX_OG_FETCH_PER_RUN = 20
MAX_THUMBNAIL_FETCH_PER_RUN = 30
MAX_THUMBNAIL_BYTES = 4 * 1024 * 1024
IMAGE_CACHE_TTL_DAYS = 7
EXCLUDED_TOPIC_PATTERNS = [
    "llama.cpp",
    "ggml-org/llama.cpp",
    "github.com/ggml-org/llama.cpp",
]

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
    "gpt-5", "gpt-4o", "gpt-4.5", "gpt-5.5", "gpt-5.3",
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

CLUSTER_STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for", "with", "its",
    "is", "are", "was", "were", "as", "at", "by", "from", "this", "that", "new", "ai",
    "artificial", "intelligence", "says", "after", "about", "into", "over", "now"
}


def now_utc():
    return datetime.now(timezone.utc)


def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    os.makedirs(THUMBNAIL_DIR, exist_ok=True)


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


def sanitize_image_url(url):
    """Return a publishable image URL, or empty string for signed/private URLs."""
    if not url:
        return ""
    url = html.unescape(url)
    url = canonicalize_url(url)
    try:
        p = urllib.parse.urlparse(url)
    except Exception:
        return ""
    if p.netloc.lower() == "private-user-images.githubusercontent.com":
        return ""
    query_keys = {k.lower() for k, _ in urllib.parse.parse_qsl(p.query, keep_blank_values=True)}
    signed_keys = {
        "jwt",
        "x-amz-credential",
        "x-amz-signature",
        "x-amz-security-token",
        "x-amz-date",
        "x-amz-expires",
    }
    if query_keys & signed_keys:
        return ""
    return url


def source_role_bonus(role):
    if role == "primary":
        return 1.0
    if role == "watchlist":
        return -1.2
    return 0.0


def source_role_label(role):
    return {
        "primary": "Primary source",
        "secondary": "Reported source",
        "watchlist": "Watchlist source",
    }.get(role or "secondary", "Reported source")


def classify_signal_group(item):
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    text_blob = f"{title} {summary}"

    if item.get("model_release"):
        return "Model releases"
    if any(w in text_blob for w in ["agent", "computer use", "tool use", "mcp", "claude code", "codex", "browser"]):
        return "Agents & tooling"
    if any(w in text_blob for w in ["image generation", "video generation", "voice", "audio", "multimodal", "vision"]):
        return "Media generation"
    if any(w in text_blob for w in ["gpu", "chip", "nvidia", "cerebras", "micron", "memory", "compute", "data center", "datacentre"]):
        return "Infrastructure"
    if any(w in text_blob for w in ["policy", "lawsuit", "copyright", "regulation", "privacy", "security", "governance", "export control", "distillation"]):
        return "Policy & risk"
    if any(w in text_blob for w in ["research", "paper", "benchmark", "arxiv", "evaluation", "study"]):
        return "Research"
    if any(w in text_blob for w in ["funding", "valuation", "stock", "earnings", "acquires", "startup", "revenue"]):
        return "Business"
    return "Product updates"


def make_why_it_matters(item):
    group = item.get("signalGroup") or classify_signal_group(item)
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    text_blob = f"{title} {summary}"

    if item.get("model_release"):
        return "A model release changes the practical menu: capability, pricing, context, or deployment options may shift for real workflows."
    if group == "Agents & tooling":
        return "Agent tooling is moving from demos into everyday control surfaces, where reliability and permissions matter as much as raw model skill."
    if group == "Media generation":
        return "Media-model updates affect what can be made quickly, what still needs craft, and where creative pipelines may change next."
    if group == "Infrastructure":
        return "Infrastructure news is the supply side of AI: chips, memory, and hosting constraints quietly decide what tools can exist and what they cost."
    if group == "Policy & risk":
        return "Policy and risk stories often become product constraints later, especially around data access, safety claims, export rules, and copyright."
    if group == "Research":
        return "Research items are useful when they hint at future product behavior, benchmark movement, or techniques likely to show up in tools."
    if group == "Business":
        return "Business moves are a map of where the industry thinks the bottlenecks and durable demand will be."
    if any(w in text_blob for w in ["openai", "anthropic", "google", "gemini", "claude", "chatgpt", "grok"]):
        return "Big-lab product changes tend to become the new baseline fast, so they are worth tracking even when the launch sounds incremental."
    return "Worth a scan because it touches the practical AI stack: products, models, tooling, infrastructure, or adoption pressure."


def make_structured_brief(item):
    title = item.get("title") or "Untitled story"
    source = item.get("source") or "Unknown source"
    group = item.get("signalGroup") or classify_signal_group(item)

    what = title.rstrip(".")
    if group == "Model releases":
        who = "Builders, tool users, and anyone comparing model capability or cost."
        impact = "Check whether the release changes what is worth trying, routing, or paying for."
    elif group == "Agents & tooling":
        who = "People building or using agent workflows, automation, coding tools, and workplace assistants."
        impact = "Watch permissions, reliability, and integration details before treating it as production-ready."
    elif group == "Infrastructure":
        who = "Anyone affected by AI compute cost, speed, availability, or hardware supply."
        impact = "Infrastructure shifts often show up later as cheaper tools, higher limits, or new bottlenecks."
    elif group == "Policy & risk":
        who = "Product builders, platform users, and anyone depending on model access or data rights."
        impact = "Policy moves can become tomorrow's product limits, compliance burden, or availability issue."
    elif group == "Research":
        who = "People tracking where model behavior, evaluation, or training techniques may head next."
        impact = "Useful if the idea looks likely to move from paper into products or tooling."
    elif group == "Business":
        who = "People reading the industry map: capital, hiring, acquisitions, and market pressure."
        impact = "The money trail usually points at where companies think the durable demand is."
    else:
        who = "AI watchers looking for practical shifts in products, platforms, or adoption."
        impact = "Skim for whether this changes what to try, trust, buy, or ignore."

    return {
        "whatHappened": what,
        "whoItAffects": who,
        "practicalImpact": impact,
        "sourceFrame": f"Seen via {source}.",
    }


def try_worthy(item):
    text_blob = f"{item.get('title') or ''} {item.get('summary') or ''}".lower()
    if item.get("model_release"):
        return True
    return any(w in text_blob for w in [
        "available", "launch", "released", "api", "tool", "agent", "computer use",
        "coding", "plugin", "open source", "github", "cookbook", "sdk"
    ])


VERSION_TITLE_RE = re.compile(
    r"^(?:v?\d+(?:\.\d+){1,3}(?:[-+][a-z0-9_.-]+)?|release\s+v?\d+(?:\.\d+){1,3})$",
    re.IGNORECASE,
)


def source_tool_name(source):
    name = (source or "").strip()
    name = re.sub(r"\s+releases?$", "", name, flags=re.IGNORECASE)
    return {
        "Model Context Protocol Python SDK": "MCP Python SDK",
        "Model Context Protocol Spec": "MCP Specification",
        "Hugging Face Transformers": "Transformers",
    }.get(name, name)


def clean_tool_summary(item):
    summary = re.sub(r"\s+", " ", item.get("summary") or "").strip()
    summary = re.sub(r"\bDiscussion\s*\|\s*Link\b", "", summary).strip()
    summary = re.sub(r"\s+", " ", summary)
    if not summary:
        source_type = item.get("sourceType")
        if source_type == "tool-release":
            summary = "New release from a known AI/developer tool."
        elif source_type == "tool-directory":
            summary = "New AI product listing."
    if len(summary) > 150:
        summary = summary[:147].rstrip() + "..."
    return summary


def enrich_tool_metadata(item):
    source_type = item.get("sourceType") or ""
    title = (item.get("title") or "").strip()
    source = item.get("source") or ""
    is_release = source_type == "tool-release"
    is_directory = source_type == "tool-directory"

    if not (is_release or is_directory):
        item["toolCandidate"] = False
        return

    tool_name = source_tool_name(source) if is_release else re.sub(r"\s+-\s+.*$", "", title).strip()
    if not tool_name:
        tool_name = title or source

    if is_release and VERSION_TITLE_RE.match(title):
        label = f"{tool_name} {title}"
    else:
        label = title or tool_name

    item["toolCandidate"] = True
    item["toolName"] = tool_name
    item["toolLabel"] = label
    item["toolSummary"] = clean_tool_summary(item)


def tool_rank(item):
    source_type = item.get("sourceType")
    source_bonus = 25.0 if source_type == "tool-directory" else 6.0 if source_type == "tool-release" else 0
    recency = item.get("published", "")
    return (source_bonus + float(item.get("score", 0)), recency)


def story_cluster_key(item):
    title = (item.get("title") or "").lower()
    title = re.sub(r"[^a-z0-9\s+-]", " ", title)
    words = [w for w in title.split() if len(w) > 2 and w not in CLUSTER_STOPWORDS]

    brands = [
        "openai", "chatgpt", "anthropic", "claude", "google", "gemini", "deepmind",
        "mistral", "grok", "xai", "meta", "llama", "nvidia", "aws", "figma",
        "cerebras", "micron", "openrouter", "cursor", "windsurf", "mcp"
    ]
    brand_hits = [b for b in brands if b in title]
    if brand_hits:
        key_words = brand_hits + words[:5]
    else:
        key_words = words[:6]
    return "-".join(key_words)[:90] or hashlib.sha1((item.get("url") or title).encode("utf-8")).hexdigest()[:12]


def attach_cluster_metadata(items):
    clusters = {}
    for it in items:
        key = story_cluster_key(it)
        it["clusterKey"] = key
        clusters.setdefault(key, []).append(it)

    for key, members in clusters.items():
        sources = sorted({m.get("source") for m in members if m.get("source")})
        if len(members) > 1:
            members_sorted = sorted(members, key=lambda x: (x.get("score", 0), x.get("published", "")), reverse=True)
            title = members_sorted[0].get("title", "Related coverage")
            for m in members:
                m["clusterTitle"] = title
                m["clusterSize"] = len(members)
                m["relatedSources"] = sources


def build_archive_index(public_dir):
    entries = []
    for name in os.listdir(public_dir):
        m = re.match(r"ai-news-daily-(\d{4}-\d{2}-\d{2})\.json$", name)
        if not m:
            continue
        path = os.path.join(public_dir, name)
        try:
            data = load_json(path, {})
            count = len(data.get("items", []))
            if count == 0:
                continue
            entries.append({
                "date": m.group(1),
                "path": f"public/{name}",
                "count": count,
                "updatedAt": data.get("updatedAt", ""),
            })
        except Exception:
            continue
    entries.sort(key=lambda x: x["date"], reverse=True)
    return entries[:45]


def image_extension(content_type, url):
    content_type = (content_type or "").split(";")[0].strip().lower()
    by_type = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/avif": "avif",
    }
    if content_type in by_type:
        return by_type[content_type]

    path = urllib.parse.urlparse(url).path.lower()
    for ext in ("jpg", "jpeg", "png", "webp", "gif", "avif"):
        if path.endswith("." + ext):
            return "jpg" if ext == "jpeg" else ext
    return "jpg"


def cache_thumbnail(image_url, item_url, cache_items, now):
    image_url = sanitize_image_url(image_url)
    if not image_url or image_url.startswith("data:") or image_url.startswith("public/thumbnails/"):
        return image_url, False

    cache_key = "thumb:" + canonicalize_url(image_url)
    cached = cache_items.get(cache_key, {})
    local_path = cached.get("localPath", "") if isinstance(cached, dict) else ""
    if local_path and os.path.exists(os.path.join(BASE, local_path)):
        return local_path, False

    try:
        headers = {
            "User-Agent": USER_AGENT,
            "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
        }
        if item_url:
            parsed = urllib.parse.urlparse(item_url)
            if parsed.scheme and parsed.netloc:
                headers["Referer"] = f"{parsed.scheme}://{parsed.netloc}/"

        req = urllib.request.Request(image_url, headers=headers)
        with urllib.request.urlopen(req, timeout=16) as r:
            content_type = r.headers.get("Content-Type", "")
            if not content_type.lower().startswith("image/"):
                return image_url, False
            data = r.read(MAX_THUMBNAIL_BYTES + 1)
            if len(data) > MAX_THUMBNAIL_BYTES:
                return image_url, False

        ext = image_extension(content_type, image_url)
        digest = hashlib.sha1(image_url.encode("utf-8")).hexdigest()[:18]
        filename = f"news-{digest}.{ext}"
        disk_path = os.path.join(THUMBNAIL_DIR, filename)
        local_path = f"public/thumbnails/{filename}"

        with open(disk_path, "wb") as f:
            f.write(data)

        cache_items[cache_key] = {
            "sourceImage": image_url,
            "localPath": local_path,
            "checkedAt": now.isoformat(),
        }
        return local_path, True
    except Exception:
        return image_url, False


def is_local_thumbnail(path):
    return (path or "").startswith("public/thumbnails/")


def restore_non_public_thumbnails(all_items, public_thumbnail_paths):
    for it in all_items:
        image = it.get("image", "")
        if is_local_thumbnail(image) and image not in public_thumbnail_paths and it.get("imageOriginal"):
            it["image"] = it.get("imageOriginal")
            it.pop("imageOriginal", None)


def cleanup_thumbnail_dir(public_thumbnail_paths):
    removed = 0
    if not os.path.isdir(THUMBNAIL_DIR):
        return removed
    keep = {os.path.basename(path) for path in public_thumbnail_paths if is_local_thumbnail(path)}
    for name in os.listdir(THUMBNAIL_DIR):
        if not name.startswith("news-"):
            continue
        if name not in keep:
            try:
                os.remove(os.path.join(THUMBNAIL_DIR, name))
                removed += 1
            except OSError:
                pass
    return removed


def is_excluded_item(item):
    haystack = " ".join([
        item.get("title") or "",
        item.get("url") or "",
        item.get("source") or "",
        item.get("sourceUrl") or "",
        item.get("summary") or "",
    ]).lower()
    return any(pattern in haystack for pattern in EXCLUDED_TOPIC_PATTERNS)


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


def fetch_url(url, user_agent=None):
    req = urllib.request.Request(url, headers={"User-Agent": user_agent or USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


def flag_model_release(item):
    """Detect if an item is specifically about a new AI model release.
    Sets item["model_release"] = True if matched. Returns True/False."""
    item.pop("model_release", None)
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    text_blob = f"{title} {summary}"
    trusted_body_signals = {
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
    }
    matched = any(sig in title for sig in MODEL_RELEASE_SIGNALS) or any(
        sig in text_blob for sig in trusted_body_signals
    )
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

    if any(phrase in text_blob for phrase in ["does not use ai", "doesn't use ai", "without ai"]):
        return False, "not_ai_story"

    if re.match(r"^[a-z0-9_.-]+/[a-z0-9_.-]+$", title):
        return False, "repo_title_low_context"

    # Strong product/platform/capability news should pass.
    if hard_boost_hits >= 1 and (capability_hits >= 1 or impact_hits >= 1 or big_name_hits >= 2):
        return True, "major_product_news"

    # Noisy sources can still surface, but only when the story has a strong signal.
    if item.get("sourceRole") == "watchlist" and hard_boost_hits == 0 and not item.get("model_release"):
        return False, "watchlist_low_signal"

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

    return round((item.get("sourceWeight", 0.7) * 1.4) + source_role_bonus(item.get("sourceRole")) + keyword_score + editorial_score + (recency * 1.1), 4)


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
    feed_roles = {f.get("name"): f.get("role", "secondary") for f in feeds if f.get("name")}
    feed_source_types = {f.get("name"): f.get("sourceType", "") for f in feeds if f.get("name")}
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
    source_health = []

    for feed in feeds:
        name = feed.get("name")
        url = feed.get("url")
        weight = float(feed.get("weight", 0.7))
        category = feed.get("category", "AI")
        role = feed.get("role", "secondary")
        source_type = feed.get("sourceType", "")
        scrape_type = feed.get("type", "rss")
        user_agent = feed.get("userAgent") or feed.get("user_agent")
        if not name or not url:
            continue
        try:
            if scrape_type == "llm-stats-news":
                items = scrape_llm_stats_news(url, name, weight)
            else:
                body = fetch_url(url, user_agent=user_agent)
                items = parse_feed_xml(body, name, url, weight)
            for item in items:
                item["category"] = category
                item["sourceRole"] = role
                item["sourceType"] = source_type
            fetched.extend(items)
            source_health.append({
                "source": name,
                "url": url,
                "role": role,
                "category": category,
                "sourceType": source_type,
                "status": "ok",
                "items": len(items),
                "checkedAt": now.isoformat(),
            })
        except Exception as e:
            error = {"source": name, "url": url, "error": str(e)}
            errors.append(error)
            source_health.append({
                "source": name,
                "url": url,
                "role": role,
                "category": category,
                "sourceType": source_type,
                "status": "error",
                "items": 0,
                "error": str(e),
                "checkedAt": now.isoformat(),
            })

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
            "sourceRole": item.get("sourceRole") or existing_item.get("sourceRole", "secondary"),
            "sourceType": item.get("sourceType") or existing_item.get("sourceType", ""),
            "category": item.get("category") or existing_item.get("category", "AI"),
            "summary": item.get("summary") or existing_item.get("summary", ""),
            "image": sanitize_image_url(item.get("image", "")) if item.get("image") else sanitize_image_url(existing_item.get("image", "")),
            "published": (dt or now).isoformat(),
            "firstSeen": existing_item.get("firstSeen") or now.isoformat(),
            "lastSeen": now.isoformat(),
        }
        existing[item["url"]] = merged

    allowed_sources = {f.get("name") for f in feeds if f.get("name")}
    all_items = [
        it for it in existing.values()
        if it.get("source") in allowed_sources and not is_excluded_item(it)
    ]
    for it in all_items:
        if not it.get("sourceRole"):
            it["sourceRole"] = feed_roles.get(it.get("source"), "secondary")
        if not it.get("sourceType"):
            it["sourceType"] = feed_source_types.get(it.get("source"), "")

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
                it["image"] = sanitize_image_url(cached_image)
            continue

        img = fetch_og_image(url)
        if img:
            it["image"] = sanitize_image_url(img)
            og_fetched += 1

        cache_items[url] = {
            "image": sanitize_image_url(img),
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
        if (
            it["score"] >= HIGH_SCORE_EDITORIAL_OVERRIDE
            and not it.get("editorial_allow")
            and it.get("editorial_reason") not in {"fluff", "framework_or_plumbing", "not_ai_story", "watchlist_low_signal", "repo_title_low_context"}
        ):
            it["editorial_allow"] = True
            it["editorial_reason"] = "high_score_override"

    # Add structured editorial metadata for the frontend.
    for it in all_items:
        it["signalGroup"] = classify_signal_group(it)
        it["sourceTier"] = source_role_label(it.get("sourceRole"))
        it["whyItMatters"] = make_why_it_matters(it)
        it["brief"] = make_structured_brief(it)
        it["tryWorthy"] = try_worthy(it)
        enrich_tool_metadata(it)

    attach_cluster_metadata(all_items)

    # Cache thumbnails locally so the browser is not blocked by CSP or hotlink limits.
    thumb_fetched = 0
    thumb_candidates = sorted(
        [
            it for it in all_items
            if it.get("image") and (it.get("editorial_allow") or it.get("category") == "Science")
        ],
        key=lambda x: (x["published_dt"], x.get("editorial_allow") is True, x.get("score", 0)),
        reverse=True,
    )
    for it in thumb_candidates:
        if thumb_fetched >= MAX_THUMBNAIL_FETCH_PER_RUN:
            break
        local_image, fetched_thumb = cache_thumbnail(it.get("image", ""), it.get("url", ""), cache_items, now)
        if local_image:
            if local_image != it.get("image") and not it.get("imageOriginal"):
                it["imageOriginal"] = it.get("image")
            it["image"] = local_image
        if fetched_thumb:
            thumb_fetched += 1

    all_items.sort(key=lambda x: (x["published_dt"], x["score"]), reverse=True)
    all_items = all_items[:MAX_STORE_ITEMS]

    # Build outputs. Tool-source records belong in the tool strip, not the article grids.
    article_items = [i for i in all_items if not i.get("toolCandidate")]
    today = now.astimezone(LOCAL_TZ).date()
    today_items = [it for it in article_items if it["published_dt"].astimezone(LOCAL_TZ).date() == today]
    today_items.sort(key=lambda x: x["score"], reverse=True)
    daily_top = today_items[:TOP_DAILY_COUNT]

    ai_items = sorted([i for i in article_items if i.get("category","AI") == "AI"],
                      key=lambda x: (x["published_dt"], x["score"]), reverse=True)[:40]
    sci_items = sorted([i for i in article_items if i.get("category") == "Science"],
                       key=lambda x: (x["published_dt"], x["score"]), reverse=True)[:20]
    latest = ai_items + sci_items
    tool_items = sorted(
        [i for i in all_items if i.get("category") == "AI" and i.get("toolCandidate")],
        key=tool_rank,
        reverse=True,
    )[:8]
    try_worthy_items = tool_items
    public_thumbnail_paths = {
        it.get("image", "")
        for it in (latest + daily_top + tool_items)
        if is_local_thumbnail(it.get("image", ""))
    }
    restore_non_public_thumbnails(all_items, public_thumbnail_paths)
    thumbnails_removed = cleanup_thumbnail_dir(public_thumbnail_paths)

    # Strip helper key
    for coll in (all_items, daily_top, latest):
        for it in coll:
            it.pop("published_dt", None)

    save_json(STORE_PATH, {"updatedAt": now.isoformat(), "items": all_items})
    save_json(IMAGE_CACHE_PATH, {"updatedAt": now.isoformat(), "items": cache_items})
    save_json(os.path.join(PUBLIC_DIR, "ai-news-latest.json"), {
        "updatedAt": now.isoformat(),
        "items": latest,
        "tools": tool_items,
        "tryWorthy": try_worthy_items,
        "sourceHealth": source_health,
        "errors": errors,
    })
    save_json(os.path.join(PUBLIC_DIR, f"ai-news-daily-{today.isoformat()}.json"), {
        "date": today.isoformat(),
        "updatedAt": now.isoformat(),
        "items": daily_top,
        "tools": tool_items,
        "tryWorthy": try_worthy_items,
        "sourceHealth": source_health,
        "errors": errors,
    })
    save_json(ARCHIVE_INDEX_PATH, {"updatedAt": now.isoformat(), "archives": build_archive_index(PUBLIC_DIR)})

    # Minimal static page
    html_items = "\n".join(
        f'<li><a href="{html.escape(it["url"], quote=True)}" target="_blank" rel="noopener">{html.escape(it["title"])}</a> '
        f'<small>({html.escape(it["source"])} · score {it["score"]})</small></li>'
        for it in daily_top
    ) or "<li>No items yet.</li>"

    html_doc = f"""<!doctype html>
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
        f.write(html_doc)

    print(f"Fetched feeds: {len(feeds)}")
    print(f"Stored items: {len(all_items)}")
    print(f"Today's top: {len(daily_top)}")
    print(f"OG images fetched this run: {og_fetched}")
    print(f"Thumbnails cached this run: {thumb_fetched}")
    print(f"Unused thumbnails removed: {thumbnails_removed}")
    if errors:
        print(f"Feed errors: {len(errors)}")


if __name__ == "__main__":
    main()
