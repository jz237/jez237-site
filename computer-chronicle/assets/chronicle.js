(function () {
  const state = {
    issue: null,
    issues: [],
    lightboxReturnFocus: null,
  };

  const els = {
    historicDate: document.querySelector("[data-historic-date]"),
    currentDate: document.querySelector("[data-current-date]"),
    edition: document.querySelector("[data-edition]"),
    editionFlag: document.querySelector("[data-edition-flag]"),
    issueNo: document.querySelector("[data-issue-no]"),
    morningLine: document.querySelector("[data-morning-line]"),
    mastheadKicker: document.querySelector("[data-masthead-kicker]"),
    mastheadTitle: document.querySelector("[data-masthead-title]"),
    mastheadDeck: document.querySelector("[data-masthead-deck]"),
    heroImage: document.querySelector("[data-hero-image]"),
    heroCaption: document.querySelector("[data-hero-caption]"),
    openHeroImage: document.querySelector("[data-open-hero-image]"),
    viewFrontPage: document.querySelector("[data-view-front-page]"),
    closeHeroImage: document.querySelector("[data-close-hero-image]"),
    heroLightbox: document.querySelector("[data-hero-lightbox]"),
    lightboxImage: document.querySelector("[data-lightbox-image]"),
    lead: document.querySelector("[data-lead]"),
    storiesPanel: document.querySelector("[data-stories-panel]"),
    storiesLabel: document.querySelector("[data-stories-label]"),
    storiesTitle: document.querySelector("[data-stories-title]"),
    stories: document.querySelector("[data-stories]"),
    pictureDeskPanel: document.querySelector("[data-picture-desk-panel]"),
    pictureDeskLabel: document.querySelector("[data-picture-desk-label]"),
    pictureDeskTitle: document.querySelector("[data-picture-desk-title]"),
    pictureDesk: document.querySelector("[data-picture-desk]"),
    computerItems: document.querySelector("[data-computer-items]"),
    softwarePanel: document.querySelector("[data-software-panel]"),
    softwareSectionCard: document.querySelector("[data-software-section-card]"),
    softwareLabel: document.querySelector("[data-software-label]"),
    softwareTitle: document.querySelector("[data-software-title]"),
    softwareList: document.querySelector("[data-software-list]"),
    marketPanel: document.querySelector("[data-market-panel]"),
    marketLabel: document.querySelector("[data-market-label]"),
    market: document.querySelector("[data-market]"),
    storeShelvesPanel: document.querySelector("[data-store-shelves-panel]"),
    storeShelvesLabel: document.querySelector("[data-store-shelves-label]"),
    storeShelvesTitle: document.querySelector("[data-store-shelves-title]"),
    storeShelvesImage: document.querySelector("[data-store-shelves-image]"),
    storeShelves: document.querySelector("[data-store-shelves]"),
    priceWatchLabel: document.querySelector("[data-price-watch-label]"),
    priceWatch: document.querySelector("[data-price-watch]"),
    priceFoot: document.querySelector("[data-price-foot]"),
    budgetPanel: document.querySelector("[data-budget-panel]"),
    budgetLabel: document.querySelector("[data-budget-label]"),
    issueBudget: document.querySelector("[data-issue-budget]"),
    bbsPanel: document.querySelector("[data-bbs-panel]"),
    bbsLabel: document.querySelector("[data-bbs-label]"),
    bbs: document.querySelector("[data-bbs]"),
    curiosityPanel: document.querySelector("[data-curiosity-panel]"),
    curiosityLabel: document.querySelector("[data-curiosity-label]"),
    curiosity: document.querySelector("[data-curiosity]"),
    briefsLabel: document.querySelector("[data-briefs-label]"),
    briefs: document.querySelector("[data-briefs]"),
    briefsFoot: document.querySelector("[data-briefs-foot]"),
    musicLabel: document.querySelector("[data-music-label]"),
    musicChartImage: document.querySelector("[data-music-chart-image]"),
    musicChart: document.querySelector("[data-music-chart]"),
    musicFoot: document.querySelector("[data-music-foot]"),
    musicFootLink: document.querySelector("[data-music-foot-link]"),
    ad: document.querySelector("[data-period-ad]"),
    classifiedsPanel: document.querySelector("[data-classifieds-panel]"),
    classifiedsLabel: document.querySelector("[data-classifieds-label]"),
    classifiedsTitle: document.querySelector("[data-classifieds-title]"),
    classifieds: document.querySelector("[data-classifieds]"),
    worldPanel: document.querySelector("[data-world-panel]"),
    worldHeadline: document.querySelector("[data-world-headline]"),
    worldSummary: document.querySelector("[data-world-summary]"),
    fallbackPanel: document.querySelector("[data-fallback-panel]"),
    fallbackLabel: document.querySelector("[data-fallback-label]"),
    fallback: document.querySelector("[data-fallback]"),
    status: document.querySelector("[data-status]"),
    editorNote: document.querySelector("[data-editor-note]"),
    weekScan: document.querySelector("[data-week-scan]"),
    issuePicker: document.querySelector("[data-issue-picker]"),
    latestIssue: document.querySelector("[data-latest-issue]"),
    printIssue: document.querySelector("[data-print-issue]"),
    previousIssue: document.querySelector("[data-previous-issue]"),
    nextIssue: document.querySelector("[data-next-issue]"),
    frontPageIndex: document.querySelector("[data-front-page-index]"),
    searchForm: document.querySelector("[data-search-form]"),
    searchInput: document.querySelector("[data-search-input]"),
  };

  /* ===== 12x12 pixel icons ===== */
  const ICONS = {
    computer: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 1h10v7H1z"/><path class="cc-i-bg" d="M2 2h8v5H2z"/><path fill="currentColor" d="M3 3h4v1H3zM3 5h3v1H3zM4 9h4v1H4zM3 10h6v1H3z"/></svg>',
    floppy: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 1h8v1h1v1h1v8H1z"/><path class="cc-i-bg" d="M4 2h4v3H4zM3 7h6v3H3z"/><path fill="currentColor" d="M6 2h1v2H6zM4 8h4v1H4z"/></svg>',
    note: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M4 1h6v2H4zM4 3h1v6H4zM9 3h1v5H9zM2 9h3v2H2zM7 8h3v2H7z"/></svg>',
    box: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 3h10v8H1z"/><path class="cc-i-bg" d="M2 5h8v5H2z"/><path fill="currentColor" d="M5 3h2v4H5zM1 1h10v2H1z"/><path class="cc-i-bg" d="M2 1h8v1H2z"/></svg>',
    joystick: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M4 1h4v3H4zM5 4h2v4H5zM2 8h8v1H2zM1 9h10v2H1z"/><path class="cc-i-bg" d="M5 2h1v1H5z"/></svg>',
    film: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 2h10v8H1z"/><path class="cc-i-bg" d="M3 4h6v4H3z"/><path class="cc-i-bg" d="M2 3h1v1H2zM2 5h1v1H2zM2 7h1v1H2zM2 9h1v1H2zM9 3h1v1H9zM9 5h1v1H9zM9 7h1v1H9zM9 9h1v1H9z" transform="translate(0 -0.5)"/></svg>',
    doc: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M2 1h6l2 2v8H2z"/><path class="cc-i-bg" d="M3 2h4v8h-4zM8 4h1v6H8z"/><path fill="currentColor" d="M4 4h4v1H4zM4 6h4v1H4zM4 8h3v1H4z"/></svg>',
    wave: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 5h10v4H1z"/><path class="cc-i-bg" d="M2 6h5v2H2z"/><path fill="currentColor" d="M8 6h1v1H8zM10 6h1v1h-1zM3 2h1v1H3zM5 1h1v1H5zM7 2h1v1H7zM4 3h1v1H4zM6 3h1v1H6zM5 4h1v1H5z"/></svg>',
    news: '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 2h8v8H1zM10 4h1v6h-1zM9 10h1v1H9z"/><path class="cc-i-bg" d="M2 3h6v2H2zM2 6h3v1H2zM6 6h2v1H6zM2 8h3v1H2zM6 8h2v1H6z"/></svg>',
  };

  const SCAN_KINDS = {
    games: { label: "Games", accent: "cc-accent-amber", icon: "joystick" },
    computers: { label: "Computers", accent: "cc-accent-cyan", icon: "computer" },
    software: { label: "Software", accent: "cc-accent-violet", icon: "floppy" },
    movies: { label: "Movies", accent: "cc-accent-orange", icon: "film" },
    rock: { label: "Rock", accent: "cc-accent-magenta", icon: "note" },
    shelf: { label: "Shelf Watch", accent: "cc-accent-green", icon: "box" },
    modems: { label: "Modems", accent: "cc-accent-cyan", icon: "wave" },
  };

  function isoDate(date) {
    const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return copy.toISOString().slice(0, 10);
  }

  function minusYears(date, years) {
    const copy = new Date(date);
    copy.setFullYear(copy.getFullYear() - years);
    return copy;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Sources and confidence stay in the structured data; the public page keeps copy immersive.
  function confidenceBadge() { return ""; }
  function sourceLinks() { return ""; }

  function cleanPublicCopy(value) {
    return String(value || "")
      .replace(/\bGenerated art direction cue\s*\d+\s*:\s*/gi, "")
      .replace(/\s*with confidence labels so [^.]+\.?/gi, ".")
      .replace(/\s*with confidence labels\.?/gi, ".")
      .replace(/\s*and confidence labels\.?/gi, ".")
      .replace(/\s*where exact [^;]+;?/gi, "")
      .replace(/\s*where exact [^.]+\.?/gi, ".")
      .replace(/\s*where [^.]*sources are thin;?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function chip(iconName, accentClass) {
    const icon = ICONS[iconName] || ICONS.doc;
    return `<span class="cc-chip ${accentClass || ""}" aria-hidden="true">${icon}</span>`;
  }

  function objectSection(value) {
    if (!value) return null;
    if (typeof value === "string") return { summary: value };
    return typeof value === "object" ? value : null;
  }

  function chrome(issue, key, field, fallback) {
    return (issue && issue.sectionChrome && !Array.isArray(issue.sectionChrome)
      && issue.sectionChrome[key] && issue.sectionChrome[key][field]) || fallback;
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function itemTitle(item) {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.title || item.name || item.item || item.headline || "";
  }

  function itemLabel(item, fallback) {
    return (item && (item.label || item.kicker || item.category || item.slot || item.priority)) || fallback || "";
  }

  function itemSummary(item) {
    return (item && (item.summary || item.text || item.detail || item.note || item.copy)) || "";
  }

  /* ===== article bodies: string OR array of paragraph strings/objects ===== */
  function bodyParagraphs(value) {
    const parts = Array.isArray(value) ? value : [value];
    return parts
      .map((part) => (typeof part === "string" ? part : itemSummary(part)))
      .map((part) => cleanPublicCopy(part))
      .filter(Boolean);
  }

  /* ===== store shelves: grouped ({label, items:[]}) vs flat entries ===== */
  function shelfGroups(issue) {
    const shelves = Array.isArray(issue && issue.storeShelves) ? issue.storeShelves : [];
    const groups = shelves.filter((entry) => entry && Array.isArray(entry.items));
    return groups.length ? groups : null;
  }

  function topGame(issue) {
    const groups = shelfGroups(issue);
    if (groups) {
      const gameGroup = groups.find((group) => /game/i.test(group.label || "")) || groups[0];
      const first = gameGroup && gameGroup.items && gameGroup.items[0];
      if (!first) return null;
      return { title: itemTitle(first), sub: gameGroup.label || "" };
    }
    const first = (issue.storeShelves || [])[0];
    if (!first) return null;
    return { title: itemTitle(first), sub: first.platform || first.price || "" };
  }

  function firstBrief(issue, pattern) {
    return (issue.briefs || []).find((item) => {
      const haystack = `${item.label || ""} ${item.kicker || ""} ${item.headline || ""} ${item.summary || ""} ${item.text || ""}`.toLowerCase();
      return pattern.test(haystack);
    });
  }

  /* ===== masthead / hero ===== */
  function applyMasthead(issue) {
    const masthead = (issue && typeof issue.masthead === "object" && issue.masthead) || {};
    setText(els.mastheadKicker, masthead.kicker || "Daily Historical Tech Desk");
    setText(els.mastheadTitle, masthead.title || "Computer Chronicle");
    const deck = masthead.deck || "A morning-paper style computer section rebuilt week by week from the early 1980s, with games, software, prices, charts, and culture from the historical week.";
    setText(els.mastheadDeck, cleanPublicCopy(deck));
  }

  function applyHeroImage(issue) {
    const image = (issue && issue.heroImage) || {};
    if (els.heroImage && image.src) {
      els.heroImage.src = image.src;
      els.heroImage.alt = image.alt || image.caption || "Computer Chronicle issue-front visual";
    }
    if (els.heroCaption) {
      els.heroCaption.textContent = cleanPublicCopy(image.caption || "Issue-front visual");
    }
  }

  /* ===== lightbox ===== */
  async function openImageLightbox(src, alt, returnFocus) {
    if (!els.heroLightbox || !els.lightboxImage || !src) return;
    state.lightboxReturnFocus = returnFocus || null;
    els.lightboxImage.src = src;
    els.lightboxImage.alt = alt || "Computer Chronicle newspaper visual";
    els.heroLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (els.closeHeroImage) els.closeHeroImage.focus({ preventScroll: true });

    if (els.heroLightbox.requestFullscreen && !document.fullscreenElement) {
      try {
        await els.heroLightbox.requestFullscreen();
      } catch (_error) {
        // Browsers can refuse fullscreen; the fixed overlay still gives a full-window view.
      }
    }
  }

  async function openHeroLightbox(returnFocus) {
    if (!els.heroImage || !els.heroImage.src) return;
    await openImageLightbox(
      els.heroImage.src,
      els.heroImage.alt || "Computer Chronicle newspaper visual",
      returnFocus || els.openHeroImage
    );
  }

  async function closeHeroLightbox() {
    if (!els.heroLightbox) return;
    els.heroLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (document.fullscreenElement === els.heroLightbox && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (_error) {
        // Ignore fullscreen exit failures; hiding the overlay is enough.
      }
    }
    if (state.lightboxReturnFocus) state.lightboxReturnFocus.focus({ preventScroll: true });
    state.lightboxReturnFocus = null;
  }

  /* ===== shared visuals ===== */
  function articleVisual(image) {
    if (!image || !image.src) return "";
    return `
      <figure class="cc-visual">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || image.caption || "Period-style article image")}" loading="lazy">
        ${image.caption ? `<figcaption>${escapeHtml(cleanPublicCopy(image.caption))}</figcaption>` : ""}
      </figure>
    `;
  }

  function pictureDeskVisual(image) {
    if (!image || !image.src) return "";
    const alt = image.alt || image.caption || "Computer Chronicle newspaper visual";
    return `
      <figure class="cc-visual">
        <button class="cc-visual-button" type="button" data-open-picture-desk-image data-image-src="${escapeHtml(image.src)}" data-image-alt="${escapeHtml(alt)}" aria-label="Open picture desk visual full screen">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" loading="lazy">
        </button>
      </figure>
    `;
  }

  function visiblePictureDeskItems(issue) {
    const items = Array.isArray(issue && issue.pictureDesk) ? issue.pictureDesk : [];
    const heroSrc = issue && issue.heroImage && issue.heroImage.src ? String(issue.heroImage.src).trim() : "";
    const seenSources = new Set();

    return items.filter((item) => {
      const image = item.image || item;
      const src = image && image.src ? String(image.src).trim() : "";
      if (!src) return true;
      if (src === heroSrc) return false;
      if (seenSources.has(src)) return false;
      seenSources.add(src);
      return true;
    });
  }

  /* ===== issue number: days since 2026-01-01 ===== */
  function issueNumber(issue, currentIso) {
    const baseDate = new Date("2026-01-01T00:00:00");
    const issueDate = new Date(`${(issue && issue.currentDate) || currentIso}T00:00:00`);
    const days = Math.max(0, Math.round((issueDate - baseDate) / 86400000));
    return String(days + 1).padStart(3, "0");
  }

  /* ===== on this week ===== */
  function scanCard(kind, title, sub) {
    if (!title) return "";
    const meta = SCAN_KINDS[kind] || SCAN_KINDS.computers;
    return `
      <li class="cc-card">
        <div class="cc-card-head">
          ${chip(meta.icon, meta.accent)}
          <span class="cc-card-label ${meta.accent}">${escapeHtml(meta.label)}</span>
        </div>
        <strong>${escapeHtml(title)}</strong>
        ${sub ? `<em>${escapeHtml(sub)}</em>` : ""}
      </li>
    `;
  }

  function renderWeekScan(issue) {
    if (!els.weekScan) return;
    if (!issue) {
      els.weekScan.innerHTML = "";
      return;
    }

    const game = topGame(issue);
    const software = (issue.softwareList || [])[0];
    const movieBrief = firstBrief(issue, /movie|cinema|box office|marquee|theater|theatre/);
    const movieChartTop = (issue.movieChart || [])[0];
    const rock = (issue.musicChart || [])[0];
    const price = (issue.priceWatch || [])[0];
    const bbs = objectSection(issue.bbsNote);

    els.weekScan.innerHTML = [
      scanCard("computers", issue.lead && issue.lead.headline, ""),
      scanCard("games", game && game.title, game && game.sub),
      scanCard("software", software && software.name, software && software.platform),
      scanCard("rock", rock && rock.title, rock && rock.artist),
      scanCard("movies",
        (movieBrief && movieBrief.headline) || (movieChartTop && movieChartTop.title),
        movieBrief ? (movieBrief.kicker || "") : (movieChartTop ? "Top of the marquee" : "")),
      scanCard("shelf", price && price.item, price && (price.note || price.price)),
      scanCard("modems", bbs && bbs.headline, ""),
    ].filter(Boolean).join("");
  }

  /* ===== glance row ===== */
  function frontPageItems(issue) {
    if (!issue) return [];

    const game = topGame(issue);
    const rockPick = (issue.musicChart || [])[0];
    const bbs = objectSection(issue.bbsNote);

    return [
      {
        kicker: "Games",
        icon: "joystick",
        accent: "cc-accent-magenta",
        text: game && game.title,
      },
      {
        kicker: chrome(issue, "lead", "label", "Top Story"),
        icon: "news",
        accent: "cc-accent-cyan",
        text: issue.lead && issue.lead.headline,
      },
      {
        kicker: chrome(issue, "bbs", "label", "Modem Desk"),
        icon: "wave",
        accent: "cc-accent-green",
        text: bbs && bbs.headline,
      },
      {
        kicker: chrome(issue, "music", "label", "Rock Radio"),
        icon: "doc",
        accent: "cc-accent-cyan",
        text: rockPick && `${rockPick.title} - ${rockPick.artist}`,
      },
    ].filter((item) => item.text);
  }

  function renderGlance(issue) {
    if (!els.frontPageIndex) return;
    els.frontPageIndex.innerHTML = frontPageItems(issue).map((item) => `
      <li>
        ${chip(item.icon, item.accent)}
        <div class="cc-glance-copy">
          <span class="cc-glance-kicker ${item.accent}">${escapeHtml(item.kicker || "Desk")}</span>
          <strong>${escapeHtml(item.text)}</strong>
        </div>
      </li>
    `).join("");
  }

  /* ===== front page banner line ===== */
  function editorStandfirst(issue) {
    const game = topGame(issue);
    const movie = firstBrief(issue, /movie|cinema|box office|marquee|theater|theatre/);
    const rock = (issue.musicChart || [])[0];
    const pieces = [];
    if (game && game.title) pieces.push(`gaming leads with ${game.title}`);
    if (issue.lead && issue.lead.headline) pieces.push(issue.lead.headline);
    if (movie && movie.headline) pieces.push(movie.headline);
    if (rock && rock.title && rock.artist) pieces.push(`${rock.title} by ${rock.artist}`);
    if (!pieces.length) return cleanPublicCopy(typeof issue.editorNote === "string" ? issue.editorNote : "");
    return `This week's front page follows ${pieces.join(", ")}.`;
  }

  /* ===== issue status ===== */
  function applyIssueStatus(issue, currentIso, historicIso) {
    if (!els.status) return;
    const requested = new URLSearchParams(window.location.search).get("date");
    const matchesToday = issue && (issue.currentDate === currentIso || issue.historicDate === historicIso);

    let flag = "First Edition ///";
    if (requested) {
      els.status.textContent = "Archive issue loaded. Use Latest Issue to return to the newest Chronicle.";
      els.status.dataset.statusState = "archive";
      flag = "Archive Edition ///";
    } else if (matchesToday) {
      els.status.textContent = "Today's issue is on the stand.";
      els.status.dataset.statusState = "current";
    } else {
      els.status.textContent = "Latest researched issue shown. Today's exact issue has not been loaded yet.";
      els.status.dataset.statusState = "stale";
      flag = "Awaiting Edition ///";
    }
    setText(els.editionFlag, flag.toUpperCase());
  }

  /* ===== sidebar: rock radio ===== */
  function renderMusic(issue) {
    if (!els.musicChart) return;
    setText(els.musicLabel, chrome(issue, "music", "label", "Rock Radio Top 10"));
    if (els.musicChartImage) els.musicChartImage.innerHTML = articleVisual(issue && issue.musicChartImage);
    const entries = Array.isArray(issue && issue.musicChart) ? issue.musicChart : [];
    els.musicChart.innerHTML = entries.map((item, index) => `
      <li${index >= 5 ? ' class="cc-extra"' : ""}>
        <span class="cc-rank">${escapeHtml(String(item.rank || index + 1))}</span>
        <div>
          <strong>${escapeHtml(item.title || "")}</strong>
          <span class="cc-note">${escapeHtml(item.artist || "")}</span>
        </div>
      </li>
    `).join("");

    const hasExtra = entries.length > 5;
    if (els.musicFoot) {
      els.musicFoot.hidden = !hasExtra;
      els.musicFoot.setAttribute("aria-expanded", "false");
      els.musicFoot.textContent = "View Full Chart";
    }
    if (els.musicFootLink) els.musicFootLink.hidden = hasExtra || !entries.length;
    const panel = els.musicChart.closest(".cc-side-panel");
    if (panel) delete panel.dataset.expanded;
  }

  /* ===== sidebar: this week in 19xx (briefs) ===== */
  function renderBriefs(issue) {
    if (!els.briefs) return;
    const year = issue && issue.historicDate ? String(issue.historicDate).slice(0, 4) : "";
    setText(els.briefsLabel, year ? `This Week in ${year}` : "This Week");
    const entries = Array.isArray(issue && issue.briefs) ? issue.briefs : [];
    els.briefs.innerHTML = entries.map((item) => `
      <li>
        <div>
          ${escapeHtml(item.headline || itemSummary(item))}
          ${item.headline && itemSummary(item) ? `<span class="cc-note">${escapeHtml(itemSummary(item))}</span>` : ""}
        </div>
      </li>
    `).join("");
    const panel = els.briefs.closest(".cc-side-panel");
    if (panel) delete panel.dataset.expanded;
    if (els.briefsFoot) {
      els.briefsFoot.hidden = !entries.length;
      els.briefsFoot.setAttribute("aria-expanded", "false");
      els.briefsFoot.textContent = "View More";
    }
  }

  /* ===== sidebar: price watch ===== */
  function compactPrice(price) {
    const text = String(price || "");
    const match = text.match(/\$\s?[\d,.]+(?:\s?-\s?\$?\s?[\d,.]+)?(?:\s?[kK]\b)?/);
    return match ? match[0].replace(/\s+/g, "") : text;
  }

  function renderPriceWatch(issue) {
    if (!els.priceWatch) return;
    setText(els.priceWatchLabel, chrome(issue, "priceWatch", "label", "Computer Price Watch"));
    const entries = Array.isArray(issue && issue.priceWatch) ? issue.priceWatch : [];
    els.priceWatch.innerHTML = entries.map((item) => {
      const full = String(item.price || "");
      const hasMoney = /\$/.test(full);
      // Keep the right-hand cell compact: dollar figures or short phrases only.
      const compact = hasMoney ? compactPrice(full) : (full.length <= 12 ? full : "");
      const noteParts = [];
      if (full && full !== compact) noteParts.push(full);
      if (item.note) noteParts.push(item.note);
      return `
        <li>
          <div class="cc-price-row">
            <strong>${escapeHtml(item.item || "")}</strong>
            ${compact ? `<span>${escapeHtml(compact)}</span>` : ""}
          </div>
          ${noteParts.length ? `<span class="cc-note">${escapeHtml(noteParts.join(" — "))}</span>` : ""}
        </li>
      `;
    }).join("");
    const panel = els.priceWatch.closest(".cc-side-panel");
    if (panel) delete panel.dataset.expanded;
    if (els.priceFoot) {
      els.priceFoot.hidden = !entries.length;
      els.priceFoot.setAttribute("aria-expanded", "false");
      els.priceFoot.textContent = "View Full Price List";
    }
  }

  /* ===== sidebar: market / bbs / curiosity / fallback ===== */
  function renderMarket(issue) {
    if (!els.market || !els.marketPanel) return;
    const market = objectSection(issue && issue.market);
    if (!market || (!market.headline && !market.summary)) {
      els.marketPanel.hidden = true;
      els.market.innerHTML = "";
      return;
    }
    setText(els.marketLabel, chrome(issue, "market", "label", "Market Desk"));
    const dow = market.dow || "";
    const nasdaq = market.nasdaq || "";
    els.marketPanel.hidden = false;
    els.market.innerHTML = `
      ${market.headline ? `<h3>${escapeHtml(market.headline)}</h3>` : ""}
      ${(dow || nasdaq) ? `
        <div class="cc-tickers">
          ${dow ? `<span>Dow <strong>${escapeHtml(dow)}</strong></span>` : ""}
          ${nasdaq ? `<span>Nasdaq <strong>${escapeHtml(nasdaq)}</strong></span>` : ""}
        </div>
      ` : ""}
      ${articleVisual(market.image)}
      ${market.summary ? `<p>${escapeHtml(market.summary)}</p>` : ""}
    `;
  }

  function renderBudget(issue) {
    if (!els.issueBudget || !els.budgetPanel) return;
    const entries = Array.isArray(issue && issue.issueBudget) ? issue.issueBudget : [];
    els.budgetPanel.hidden = entries.length === 0;
    els.issueBudget.innerHTML = entries.map((item) => `
      <li>
        <strong>${escapeHtml(item.slot || item.priority || "Story")}</strong>
        ${item.title ? `<span class="cc-note">${escapeHtml(item.title)}</span>` : ""}
      </li>
    `).join("");
  }

  function renderBbs(issue) {
    if (!els.bbs || !els.bbsPanel) return;
    const bbsNote = objectSection(issue && issue.bbsNote);
    if (!bbsNote || (!bbsNote.headline && !bbsNote.summary)) {
      els.bbsPanel.hidden = true;
      els.bbs.innerHTML = "";
      return;
    }
    setText(els.bbsLabel, chrome(issue, "bbs", "label", "Modem Desk"));
    els.bbsPanel.hidden = false;
    els.bbs.innerHTML = `
      ${bbsNote.headline ? `<h3>${escapeHtml(bbsNote.headline)}</h3>` : ""}
      ${articleVisual(bbsNote.image)}
      ${bbsNote.summary ? `<p>${escapeHtml(bbsNote.summary)}</p>` : ""}
      ${Array.isArray(bbsNote.posts) ? `
        <ul class="cc-kv">
          ${bbsNote.posts.map((post) => `
            <li>
              <strong>${escapeHtml(post.topic || "")}</strong>
              ${post.platform ? `<span class="cc-tag">${escapeHtml(post.platform)}</span>` : ""}
              ${post.text ? `<span class="cc-note">${escapeHtml(post.text)}</span>` : ""}
            </li>
          `).join("")}
        </ul>
      ` : ""}
    `;
  }

  function renderCuriosity(issue) {
    if (!els.curiosity || !els.curiosityPanel) return;
    const curiosity = objectSection(issue && issue.curiosity);
    if (!curiosity || (!curiosity.headline && !curiosity.summary)) {
      els.curiosityPanel.hidden = true;
      els.curiosity.innerHTML = "";
      return;
    }
    setText(els.curiosityLabel, chrome(issue, "curiosity", "label", "Today's Curiosity"));
    els.curiosityPanel.hidden = false;
    els.curiosity.innerHTML = `
      ${curiosity.headline ? `<h3>${escapeHtml(curiosity.headline)}</h3>` : ""}
      ${curiosity.summary ? `<p>${escapeHtml(curiosity.summary)}</p>` : ""}
      ${curiosity.detail ? `<p style="color:var(--cc-amber)">${escapeHtml(curiosity.detail)}</p>` : ""}
    `;
  }

  function renderWorldAnchor(issue) {
    if (!els.worldPanel) return;
    const anchor = objectSection(issue && issue.worldAnchor);
    const headline = anchor && anchor.headline;
    const summary = anchor && (anchor.summary || "");
    if (!headline && !summary) {
      els.worldPanel.hidden = true;
      setText(els.worldHeadline, "");
      setText(els.worldSummary, "");
      return;
    }
    els.worldPanel.hidden = false;
    setText(els.worldHeadline, headline || "");
    setText(els.worldSummary, summary);
    if (els.worldSummary) els.worldSummary.hidden = !summary;
  }

  function renderFallback(issue) {
    if (!els.fallback || !els.fallbackPanel) return;
    const fallback = objectSection(issue && issue.worldFallback);
    if (!fallback || (!fallback.headline && !fallback.summary)) {
      els.fallbackPanel.hidden = true;
      els.fallback.innerHTML = "";
      return;
    }
    setText(els.fallbackLabel, chrome(issue, "fallback", "label", "Other News"));
    els.fallbackPanel.hidden = false;
    els.fallback.innerHTML = `
      ${fallback.headline ? `<h3>${escapeHtml(fallback.headline)}</h3>` : ""}
      ${articleVisual(fallback.image)}
      ${fallback.summary ? `<p>${escapeHtml(fallback.summary)}</p>` : ""}
    `;
  }

  /* ===== main column panels ===== */
  function renderLead(issue) {
    if (!els.lead) return;
    const lead = issue.lead || {};
    const paragraphs = bodyParagraphs(lead.body || lead.summary || "");
    els.lead.innerHTML = `
      <div class="cc-panel-head">
        <span class="cc-panel-label">${escapeHtml(lead.label || chrome(issue, "lead", "label", "Top Story"))}</span>
      </div>
      <h2>${escapeHtml(lead.headline || "")}</h2>
      ${lead.dek ? `<p class="cc-dek">${escapeHtml(lead.dek)}</p>` : ""}
      ${articleVisual(lead.image)}
      ${paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
      ${confidenceBadge(lead.confidence)}
      ${sourceLinks(issue, lead.sourceRefs)}
    `;
  }

  function renderStories(issue) {
    if (!els.stories || !els.storiesPanel) return;
    const stories = Array.isArray(issue && issue.stories) ? issue.stories : [];
    els.storiesPanel.hidden = stories.length === 0;
    setText(els.storiesLabel, chrome(issue, "stories", "label", "Feature Desk"));
    setText(els.storiesTitle, chrome(issue, "stories", "title", "The Week's Stories"));
    els.stories.innerHTML = stories.map((story) => {
      const paragraphs = bodyParagraphs(story.body || story.summary || story.text || "");
      const kicker = itemLabel(story, "");
      return `
        <article class="cc-story">
          ${kicker ? `<span class="cc-panel-label cc-label-cyan">${escapeHtml(kicker)}</span>` : ""}
          <h3>${escapeHtml(story.headline || itemTitle(story) || "Story")}</h3>
          ${story.dek ? `<p class="cc-dek">${escapeHtml(cleanPublicCopy(story.dek))}</p>` : ""}
          ${articleVisual(story.image)}
          ${paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
          ${story.pullQuote ? `<blockquote class="cc-pullquote">${escapeHtml(cleanPublicCopy(story.pullQuote))}</blockquote>` : ""}
        </article>
      `;
    }).join("");
  }

  function renderComputerItems(issue) {
    if (!els.computerItems) return;
    els.computerItems.innerHTML = (issue.computerItems || []).map((item) => {
      const label = itemLabel(item, "");
      return `
        <article>
          ${label ? `<span class="cc-panel-label cc-label-cyan">${escapeHtml(label)}</span>` : ""}
          <h3>${escapeHtml(item.headline || itemTitle(item) || "Computer story")}</h3>
          ${articleVisual(item.image)}
          <p>${escapeHtml(itemSummary(item))}</p>
        </article>
      `;
    }).join("");
  }

  function renderSoftware(issue) {
    const softwareItems = Array.isArray(issue.softwareList) ? issue.softwareList : [];
    if (els.softwarePanel) els.softwarePanel.hidden = softwareItems.length === 0;
    if (els.softwareSectionCard) els.softwareSectionCard.hidden = softwareItems.length === 0;
    setText(els.softwareLabel, chrome(issue, "software", "label", "Software Top 5"));
    setText(els.softwareTitle, chrome(issue, "software", "title", "New & Notable Software"));
    if (els.softwareList) {
      els.softwareList.innerHTML = softwareItems.map((item) => `
        <li>
          <strong>${escapeHtml(item.name || "")}</strong>
          ${item.platform ? `<span class="cc-tag">${escapeHtml(item.platform)}</span>` : ""}
          ${item.detail ? `<span class="cc-note">${escapeHtml(item.detail)}</span>` : ""}
        </li>
      `).join("");
    }
  }

  function renderStoreShelves(issue) {
    if (!els.storeShelves) return;
    setText(els.storeShelvesLabel, chrome(issue, "storeShelves", "label", "On Store Shelves"));
    setText(els.storeShelvesTitle, chrome(issue, "storeShelves", "title", "Games, Software & Platforms People Could Talk About"));
    if (els.storeShelvesImage) els.storeShelvesImage.innerHTML = articleVisual(issue.storeShelvesImage);

    const groups = shelfGroups(issue);
    if (groups) {
      els.storeShelves.innerHTML = `
        <div class="cc-shelf-groups">
          ${groups.map((group) => `
            <div class="cc-shelf-group">
              <span class="cc-shelf-label">${escapeHtml(group.label || "Shelf")}</span>
              <ol>
                ${(group.items || []).map((entry) => `<li>${escapeHtml(itemTitle(entry))}</li>`).join("")}
              </ol>
            </div>
          `).join("")}
        </div>
      `;
      return;
    }

    els.storeShelves.innerHTML = `
      <ul class="cc-list">
        ${(issue.storeShelves || []).map((item) => `
          <li>
            <strong>${escapeHtml(itemTitle(item))}</strong>
            ${item.platform ? `<span class="cc-tag">${escapeHtml(item.platform)}</span>` : ""}
            ${(itemSummary(item) || item.price) ? `<span class="cc-note">${escapeHtml(itemSummary(item) || item.price)}</span>` : ""}
          </li>
        `).join("")}
      </ul>
    `;
  }

  function renderPictureDesk(issue) {
    const pictureDeskItems = visiblePictureDeskItems(issue);
    if (els.pictureDeskPanel) els.pictureDeskPanel.hidden = pictureDeskItems.length === 0;
    setText(els.pictureDeskLabel, chrome(issue, "pictureDesk", "label", "Picture Desk"));
    setText(els.pictureDeskTitle, chrome(issue, "pictureDesk", "title", "Scenes From the Week"));
    if (els.pictureDesk) {
      els.pictureDesk.innerHTML = pictureDeskItems.map((item) => `
        <article class="cc-picture-item">
          ${pictureDeskVisual(item.image || item)}
          <div>
            <h3>${escapeHtml(cleanPublicCopy(item.title || item.caption || "Picture"))}</h3>
            ${item.note ? `<p>${escapeHtml(cleanPublicCopy(item.note))}</p>` : ""}
          </div>
        </article>
      `).join("");
    }
  }

  function renderPeriodAd(issue) {
    if (!els.ad) return;
    const periodAd = objectSection(issue.periodAd);
    els.ad.hidden = !periodAd;
    els.ad.innerHTML = periodAd ? `
      <p class="cc-ad-kicker">Advertisement</p>
      <h2>${escapeHtml(periodAd.headline || "Computer Store Notice")}</h2>
      <p>${escapeHtml(periodAd.summary || "")}</p>
      ${periodAd.tagline ? `<small>${escapeHtml(periodAd.tagline)}</small>` : ""}
    ` : "";
  }

  function renderClassifieds(issue) {
    const classifiedItems = Array.isArray(issue.classifieds) ? issue.classifieds : [];
    if (els.classifiedsPanel) els.classifiedsPanel.hidden = classifiedItems.length === 0;
    setText(els.classifiedsLabel, chrome(issue, "classifieds", "label", "Classifieds"));
    setText(els.classifiedsTitle, chrome(issue, "classifieds", "title", "Small Ads"));
    if (els.classifieds) {
      els.classifieds.innerHTML = classifiedItems.map((item) => `
        <li>
          <strong>${escapeHtml(item.headline || item.item || "For Sale")}</strong>
          <span>${escapeHtml(item.copy || item.detail || "")}</span>
          ${item.price ? `<em>${escapeHtml(item.price)}</em>` : ""}
        </li>
      `).join("");
    }
  }

  /* ===== master render ===== */
  function renderIssue(issue, currentIso, historicIso) {
    setText(els.currentDate, currentIso);
    setText(els.historicDate, issue ? issue.displayDate : historicIso);
    setText(els.edition, issue ? issue.edition : "Computer & Culture Chronicle");
    if (els.issueNo) els.issueNo.textContent = issueNumber(issue, currentIso);
    if (els.morningLine) {
      els.morningLine.textContent = issue
        ? issue.morningLine || "Morning Edition: a quick skim of the historical week."
        : "Morning Edition: awaiting a researched issue.";
    }
    applyMasthead(issue);
    applyHeroImage(issue);

    if (!issue) {
      if (els.status) {
        els.status.textContent = "No researched issue has been loaded for this date yet.";
        els.status.dataset.statusState = "missing";
      }
      setText(els.editionFlag, "AWAITING EDITION ///");
      if (els.lead) {
        els.lead.innerHTML = `
          <div class="cc-panel-head"><span class="cc-panel-label">Research Queue</span></div>
          <h2>Research Queue</h2>
          <p>This date needs a verified computer-news pass before a newspaper image is generated.</p>
        `;
      }
      if (els.storiesPanel) els.storiesPanel.hidden = true;
      if (els.stories) els.stories.innerHTML = "";
      if (els.computerItems) els.computerItems.innerHTML = "";
      if (els.pictureDeskPanel) els.pictureDeskPanel.hidden = true;
      if (els.pictureDesk) els.pictureDesk.innerHTML = "";
      if (els.softwarePanel) els.softwarePanel.hidden = true;
      if (els.softwareList) els.softwareList.innerHTML = "";
      if (els.marketPanel) els.marketPanel.hidden = true;
      if (els.budgetPanel) els.budgetPanel.hidden = true;
      if (els.storeShelvesImage) els.storeShelvesImage.innerHTML = "";
      if (els.storeShelves) els.storeShelves.innerHTML = "";
      if (els.priceWatch) els.priceWatch.innerHTML = "";
      if (els.priceFoot) els.priceFoot.hidden = true;
      if (els.bbsPanel) els.bbsPanel.hidden = true;
      if (els.curiosityPanel) els.curiosityPanel.hidden = true;
      if (els.briefs) els.briefs.innerHTML = "";
      if (els.briefsFoot) els.briefsFoot.hidden = true;
      if (els.musicChart) els.musicChart.innerHTML = "";
      if (els.musicFoot) els.musicFoot.hidden = true;
      if (els.musicFootLink) els.musicFootLink.hidden = true;
      if (els.ad) { els.ad.hidden = true; els.ad.innerHTML = ""; }
      if (els.classifiedsPanel) els.classifiedsPanel.hidden = true;
      if (els.fallbackPanel) els.fallbackPanel.hidden = true;
      if (els.worldPanel) els.worldPanel.hidden = true;
      renderWeekScan(null);
      if (els.frontPageIndex) els.frontPageIndex.innerHTML = "";
      setText(els.editorNote, "Personal computers and personal computer gaming are the editorial priority when source choices compete.");
      return;
    }

    applyIssueStatus(issue, currentIso, historicIso);
    setText(els.editorNote, cleanPublicCopy(editorStandfirst(issue)
      || "Personal computers and personal computer gaming are the editorial priority when source choices compete."));

    renderWeekScan(issue);
    renderGlance(issue);
    renderWorldAnchor(issue);
    renderLead(issue);
    renderStories(issue);
    renderComputerItems(issue);
    renderSoftware(issue);
    renderStoreShelves(issue);
    renderPictureDesk(issue);
    renderPeriodAd(issue);
    renderClassifieds(issue);
    renderMusic(issue);
    renderBriefs(issue);
    renderPriceWatch(issue);
    renderMarket(issue);
    renderBudget(issue);
    renderBbs(issue);
    renderCuriosity(issue);
    renderFallback(issue);
  }

  /* ===== issue selection / navigation ===== */
  function pickIssue(issues, currentIso, historicIso) {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("date");
    if (requested) {
      return issues.find((item) => item.currentDate === requested || item.historicDate === requested) || null;
    }
    return issues.find((item) => item.currentDate === currentIso)
      || issues.find((item) => item.historicDate === historicIso)
      || issues[0]
      || null;
  }

  function renderIssuePicker(issues, selectedIssue) {
    if (!els.issuePicker) return;
    els.issuePicker.innerHTML = "";

    if (!issues.length) {
      const option = document.createElement("option");
      option.textContent = "No issues loaded";
      els.issuePicker.append(option);
      els.issuePicker.disabled = true;
      return;
    }

    els.issuePicker.disabled = false;
    issues.forEach((issue, index) => {
      const label = index === 0 ? "Latest" : "Archive";
      const headline = issue.lead && issue.lead.headline ? issue.lead.headline : issue.morningLine || "";
      const option = document.createElement("option");
      option.value = issue.currentDate;
      option.textContent = `${label}: ${issue.currentDate} / ${issue.displayDate || issue.historicDate}${headline ? ` - ${headline}` : ""}`;
      option.selected = selectedIssue && selectedIssue.currentDate === issue.currentDate;
      els.issuePicker.append(option);
    });
  }

  function renderIssueStepNav(issues, selectedIssue) {
    if (issues.length < 2) {
      if (els.previousIssue) els.previousIssue.hidden = true;
      if (els.nextIssue) els.nextIssue.hidden = true;
      return;
    }

    const selectedIndex = issues.findIndex((issue) => selectedIssue && issue.currentDate === selectedIssue.currentDate);
    if (els.previousIssue) {
      const previous = selectedIndex >= 0 ? issues[selectedIndex + 1] : null;
      els.previousIssue.hidden = !previous;
      if (previous) {
        els.previousIssue.href = `?date=${encodeURIComponent(previous.currentDate)}`;
        els.previousIssue.querySelector("strong").textContent = previous.displayDate || previous.historicDate || previous.currentDate;
      }
    }
    if (els.nextIssue) {
      const next = selectedIndex > 0 ? issues[selectedIndex - 1] : null;
      els.nextIssue.hidden = !next;
      if (next) {
        els.nextIssue.href = `?date=${encodeURIComponent(next.currentDate)}`;
        els.nextIssue.querySelector("strong").textContent = next.displayDate || next.historicDate || next.currentDate;
      }
    }
  }

  async function loadIssues() {
    const today = new Date();
    const currentIso = isoDate(today);
    const historicIso = isoDate(minusYears(today, 40));

    try {
      const response = await fetch("data/issues.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state.issues = Array.isArray(data) ? data : (data.issues || []);
      state.issue = pickIssue(state.issues, currentIso, historicIso);
      renderIssuePicker(state.issues, state.issue);
      renderIssueStepNav(state.issues, state.issue);
      renderIssue(state.issue, currentIso, historicIso);
    } catch (error) {
      if (els.status) els.status.textContent = `Could not load issue data: ${error.message}`;
      renderIssue(null, currentIso, historicIso);
    }
  }

  /* ===== interactions ===== */
  if (els.issuePicker) {
    els.issuePicker.addEventListener("change", () => {
      const selected = els.issuePicker.value;
      if (!selected) return;
      const url = new URL(window.location.href);
      if (state.issues[0] && selected === state.issues[0].currentDate) {
        url.searchParams.delete("date");
      } else {
        url.searchParams.set("date", selected);
      }
      window.location.href = url.toString();
    });
  }

  if (els.printIssue) {
    els.printIssue.addEventListener("click", () => {
      window.print();
    });
  }

  if (els.openHeroImage) {
    els.openHeroImage.addEventListener("click", () => openHeroLightbox(els.openHeroImage));
  }

  if (els.viewFrontPage) {
    els.viewFrontPage.addEventListener("click", () => openHeroLightbox(els.viewFrontPage));
  }

  if (els.pictureDesk) {
    els.pictureDesk.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-open-picture-desk-image]");
      if (!opener) return;
      openImageLightbox(opener.dataset.imageSrc, opener.dataset.imageAlt, opener);
    });
  }

  if (els.closeHeroImage) {
    els.closeHeroImage.addEventListener("click", closeHeroLightbox);
  }

  if (els.heroLightbox) {
    els.heroLightbox.addEventListener("click", (event) => {
      if (event.target === els.heroLightbox) closeHeroLightbox();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.heroLightbox && els.heroLightbox.getAttribute("aria-hidden") === "false") {
      closeHeroLightbox();
    }
  });

  function wireSideToggle(button, expandedLabel, collapsedLabel) {
    if (!button) return;
    button.addEventListener("click", () => {
      const panel = button.closest(".cc-side-panel");
      if (!panel) return;
      const expanded = panel.dataset.expanded === "true";
      if (expanded) {
        delete panel.dataset.expanded;
      } else {
        panel.dataset.expanded = "true";
      }
      button.setAttribute("aria-expanded", String(!expanded));
      button.textContent = expanded ? collapsedLabel : expandedLabel;
    });
  }

  wireSideToggle(els.musicFoot, "Collapse Chart", "View Full Chart");
  wireSideToggle(els.briefsFoot, "View Less", "View More");
  wireSideToggle(els.priceFoot, "Hide Price Notes", "View Full Price List");

  if (els.searchForm && els.searchInput) {
    els.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = els.searchInput.value.trim().toLowerCase();
      if (!query || !state.issues.length) return;
      const match = state.issues.find((issue) => {
        const haystack = [
          issue.currentDate,
          issue.historicDate,
          issue.displayDate,
          issue.edition,
          issue.morningLine,
          issue.lead && issue.lead.headline,
          ...(Array.isArray(issue.stories) ? issue.stories : []).map((story) => story && story.headline),
        ].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(query);
      });
      if (!match) {
        els.searchInput.value = "";
        els.searchInput.placeholder = "No match in archive";
        return;
      }
      const url = new URL(window.location.href);
      if (state.issues[0] && match.currentDate === state.issues[0].currentDate) {
        url.searchParams.delete("date");
      } else {
        url.searchParams.set("date", match.currentDate);
      }
      window.location.href = url.toString();
    });
  }

  loadIssues();
})();
