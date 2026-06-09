(function () {
  const state = {
    issue: null,
    issues: [],
  };

  const els = {
    historicDate: document.querySelector("[data-historic-date]"),
    currentDate: document.querySelector("[data-current-date]"),
    edition: document.querySelector("[data-edition]"),
    issueNo: document.querySelector("[data-issue-no]"),
    morningLine: document.querySelector("[data-morning-line]"),
    strapline: document.querySelector("[data-strapline]"),
    mastheadKicker: document.querySelector("[data-masthead-kicker]"),
    mastheadTitle: document.querySelector("[data-masthead-title]"),
    mastheadDeck: document.querySelector("[data-masthead-deck]"),
    heroImage: document.querySelector("[data-hero-image]"),
    heroCaption: document.querySelector("[data-hero-caption]"),
    openHeroImage: document.querySelector("[data-open-hero-image]"),
    closeHeroImage: document.querySelector("[data-close-hero-image]"),
    heroLightbox: document.querySelector("[data-hero-lightbox]"),
    lightboxImage: document.querySelector("[data-lightbox-image]"),
    lead: document.querySelector("[data-lead]"),
    pictureDeskPanel: document.querySelector("[data-picture-desk-panel]"),
    pictureDeskLabel: document.querySelector("[data-picture-desk-label]"),
    pictureDeskTitle: document.querySelector("[data-picture-desk-title]"),
    pictureDesk: document.querySelector("[data-picture-desk]"),
    computerItems: document.querySelector("[data-computer-items]"),
    softwarePanel: document.querySelector("[data-software-panel]"),
    softwareLabel: document.querySelector("[data-software-label]"),
    softwareTitle: document.querySelector("[data-software-title]"),
    softwareList: document.querySelector("[data-software-list]"),
    market: document.querySelector("[data-market]"),
    issueBudgetLabel: document.querySelector("[data-issue-budget-label]"),
    issueBudgetTitle: document.querySelector("[data-issue-budget-title]"),
    issueBudget: document.querySelector("[data-issue-budget]"),
    storeShelvesLabel: document.querySelector("[data-store-shelves-label]"),
    storeShelvesTitle: document.querySelector("[data-store-shelves-title]"),
    storeShelvesImage: document.querySelector("[data-store-shelves-image]"),
    storeShelves: document.querySelector("[data-store-shelves]"),
    priceWatchLabel: document.querySelector("[data-price-watch-label]"),
    priceWatchTitle: document.querySelector("[data-price-watch-title]"),
    priceWatch: document.querySelector("[data-price-watch]"),
    bbs: document.querySelector("[data-bbs]"),
    curiosity: document.querySelector("[data-curiosity]"),
    briefsLabel: document.querySelector("[data-briefs-label]"),
    briefsTitle: document.querySelector("[data-briefs-title]"),
    briefs: document.querySelector("[data-briefs]"),
    musicLabel: document.querySelector("[data-music-label]"),
    musicTitle: document.querySelector("[data-music-title]"),
    musicChartImage: document.querySelector("[data-music-chart-image]"),
    musicChart: document.querySelector("[data-music-chart]"),
    ad: document.querySelector("[data-period-ad]"),
    classifiedsPanel: document.querySelector("[data-classifieds-panel]"),
    classifiedsLabel: document.querySelector("[data-classifieds-label]"),
    classifiedsTitle: document.querySelector("[data-classifieds-title]"),
    classifieds: document.querySelector("[data-classifieds]"),
    fallback: document.querySelector("[data-fallback]"),
    status: document.querySelector("[data-status]"),
    editorNote: document.querySelector("[data-editor-note]"),
    weekScan: document.querySelector("[data-week-scan]"),
    issuePicker: document.querySelector("[data-issue-picker]"),
    printIssue: document.querySelector("[data-print-issue]"),
    previousIssue: document.querySelector("[data-previous-issue]"),
    nextIssue: document.querySelector("[data-next-issue]"),
    archiveNav: document.querySelector("[data-archive-nav]"),
    archiveList: document.querySelector("[data-archive-list]"),
    frontPageIndex: document.querySelector("[data-front-page-index]"),
    nextCurrentDate: document.querySelector("[data-next-current-date]"),
    nextHistoricDate: document.querySelector("[data-next-historic-date]"),
    nextAssignmentList: document.querySelector("[data-next-assignment-list]"),
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

  function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function confidenceBadge(text) {
    return "";
  }

  function sourceName(source) {
    if (!source || !source.name) return "Source";
    return source.name.replace(/^(InfoWorld|MobyGames|FRED|CountryEconomy|Arcade History|Vintage Paper Ads|Tunecaster|UPI Archives)[:,]?\s*/i, "").trim();
  }

  function sourceLinks(issue, refs) {
    return "";
  }

  function articleVisual(image) {
    if (!image || !image.src) return "";
    return `
      <figure class="article-visual">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || image.caption || "Period-style article image")}" loading="lazy">
        <figcaption>
          <span>${escapeHtml(image.caption || "")}</span>
          ${confidenceBadge(image.confidence || "Visual context")}
        </figcaption>
      </figure>
    `;
  }

  function chrome(issue, key, field, fallback) {
    return (issue && issue.sectionChrome && issue.sectionChrome[key] && issue.sectionChrome[key][field]) || fallback;
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function applySectionChrome(issue) {
    setText(els.storeShelvesLabel, chrome(issue, "storeShelves", "label", "On Store Shelves"));
    setText(els.storeShelvesTitle, chrome(issue, "storeShelves", "title", "Games, Software & Platforms People Could Talk About"));
    setText(els.pictureDeskLabel, chrome(issue, "pictureDesk", "label", "Picture Desk"));
    setText(els.pictureDeskTitle, chrome(issue, "pictureDesk", "title", "Scenes From the Week"));
    setText(els.softwareLabel, chrome(issue, "software", "label", "Software Top 5"));
    setText(els.softwareTitle, chrome(issue, "software", "title", "New & Notable Software"));
    setText(els.priceWatchLabel, chrome(issue, "priceWatch", "label", "Price Watch"));
    setText(els.priceWatchTitle, chrome(issue, "priceWatch", "title", "What It Cost"));
    setText(els.issueBudgetLabel, "Shelf Watch");
    setText(els.issueBudgetTitle, "Games, Gear & Culture Mix");
    setText(els.briefsLabel, chrome(issue, "briefs", "label", "Small Notices"));
    setText(els.briefsTitle, chrome(issue, "briefs", "title", "Other Things on the Desk"));
    setText(els.musicLabel, chrome(issue, "music", "label", "Rock Radio Top 10"));
    setText(els.musicTitle, chrome(issue, "music", "title", "Album-Rock Airwaves"));
    setText(els.classifiedsLabel, chrome(issue, "classifieds", "label", "Classifieds"));
    setText(els.classifiedsTitle, chrome(issue, "classifieds", "title", "Small Ads"));
  }

  function applyMasthead(issue) {
    const masthead = (issue && issue.masthead) || {};
    setText(els.mastheadKicker, masthead.kicker || "Daily historical tech desk");
    setText(els.mastheadTitle, masthead.title || "Computer Chronicle");
    const deck = masthead.deck || "A morning-paper style computer section built from the date 40 years ago today, with games, software, prices, charts, and culture from the historical week.";
    setText(els.mastheadDeck, cleanPublicCopy(deck));
  }

  function applyVisualProfile(issue) {
    const profile = (issue && issue.visualProfile) || {};
    const layout = profile.layout || "standard";
    const accent = profile.accent || "amber-blue";
    const paper = profile.paper || "cream";
    document.body.dataset.issueLayout = layout;
    document.body.dataset.issueAccent = accent;
    document.body.dataset.issuePaper = paper;
    if (els.strapline) {
      els.strapline.textContent = profile.strapline || "COMPUTERS • GAMES • SOFTWARE • MARKETS";
    }
  }

  function applyHeroImage(issue) {
    const image = (issue && issue.heroImage) || {};
    if (els.heroImage && image.src) {
      els.heroImage.src = image.src;
      els.heroImage.alt = image.alt || image.caption || "Computer Chronicle issue-front visual";
    }
    if (els.heroCaption) {
      const caption = image.caption || "Issue-front visual";
      els.heroCaption.textContent = cleanPublicCopy(caption);
    }
  }

  async function openHeroLightbox() {
    if (!els.heroLightbox || !els.heroImage || !els.lightboxImage || !els.heroImage.src) return;
    els.lightboxImage.src = els.heroImage.src;
    els.lightboxImage.alt = els.heroImage.alt || "Computer Chronicle newspaper visual";
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
    if (els.openHeroImage) els.openHeroImage.focus({ preventScroll: true });
  }

  function applyLayoutPlan(issue) {
    const defaults = {
      main: ["editor-note", "lead", "picture-desk", "computer-items", "software", "store-shelves"],
      sidebar: ["music", "price-watch", "market", "bbs", "curiosity", "briefs", "period-ad", "classifieds", "fallback"],
    };
    const plan = (issue && issue.layoutPlan) || {};

    ["main", "sidebar"].forEach((region) => {
      const order = Array.isArray(plan[region]) ? plan[region] : defaults[region];
      const nodes = document.querySelectorAll(`[data-${region}-module]`);
      nodes.forEach((node, index) => {
        const name = node.getAttribute(`data-${region}-module`);
        const plannedIndex = order.indexOf(name);
        node.style.order = String(plannedIndex === -1 ? order.length + index : plannedIndex);
      });
    });
  }

  function issueNumber(issue, currentIso) {
    const baseDate = new Date("2026-01-01T00:00:00");
    const issueDate = new Date(`${(issue && issue.currentDate) || currentIso}T00:00:00`);
    const days = Math.max(0, Math.round((issueDate - baseDate) / 86400000));
    return String(days + 1).padStart(3, "0");
  }

  function applyNextAssignment(currentIso, issue) {
    const currentDate = new Date(`${currentIso}T00:00:00`);
    const nextCurrent = addDays(currentDate, 1);
    const issueHistoric = issue && issue.historicDate ? new Date(`${issue.historicDate}T00:00:00`) : minusYears(nextCurrent, 40);
    const nextHistoric = issue && issue.historicDate ? addDays(issueHistoric, 7) : minusYears(nextCurrent, 40);
    setText(els.nextCurrentDate, isoDate(nextCurrent));
    setText(els.nextHistoricDate, issue && issue.historicDate ? `Week of ${isoDate(nextHistoric)}` : isoDate(nextHistoric));
    if (!els.nextAssignmentList) return;
    els.nextAssignmentList.innerHTML = [
      "Archive the current weekly issue before replacing the front page.",
      "Lead with gaming when there is credible gaming news for the week.",
      "Include release dates for games and keep same-week context honest in the data.",
      "Refresh the GPT Image 2 newspaper front image, hero caption, chart lists, and retail-ad flavor.",
      "Update the accuracy ledger before the web page and Discord image are posted.",
    ].map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function frontPageItems(issue) {
    if (issue && Array.isArray(issue.frontPageIndex)) return issue.frontPageIndex;
    if (!issue) return [];

    const gameItem = (issue.computerItems || []).find((item) => /game/i.test(item.label || ""))
      || (issue.storeShelves || [])[0];
    const shelfNames = (issue.storeShelves || []).slice(0, 2).map((item) => item.name).filter(Boolean).join(" / ");
    const rockPick = (issue.musicChart || [])[0];

    return [
      {
        kicker: "Games",
        text: gameItem && (gameItem.headline || `${gameItem.name}${shelfNames ? ` leads a shelf with ${shelfNames}` : ""}`),
      },
      {
        kicker: chrome(issue, "lead", "label", "Top Story"),
        text: issue.lead && issue.lead.headline,
      },
      {
        kicker: chrome(issue, "bbs", "label", "Modem Desk"),
        text: issue.bbsNote && issue.bbsNote.headline,
      },
      {
        kicker: chrome(issue, "music", "label", "Rock Radio"),
        text: rockPick && `${rockPick.title} - ${rockPick.artist}`,
      },
    ].filter((item) => item.text);
  }

  function cleanPublicCopy(value) {
    return String(value || "")
      .replace(/\s*with confidence labels so [^.]+\.?/gi, ".")
      .replace(/\s*with confidence labels\.?/gi, ".")
      .replace(/\s*and confidence labels\.?/gi, ".")
      .replace(/\s*where exact [^;]+;?/gi, "")
      .replace(/\s*where exact [^.]+\.?/gi, ".")
      .replace(/\s*where [^.]*sources are thin;?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function firstBrief(issue, pattern) {
    return (issue.briefs || []).find((item) => {
      const haystack = `${item.label || ""} ${item.kicker || ""} ${item.headline || ""} ${item.summary || ""}`.toLowerCase();
      return pattern.test(haystack);
    });
  }

  function topGame(issue) {
    return (issue.storeShelves || [])[0] || null;
  }

  function gameLead(issue) {
    const game = topGame(issue);
    if (!game) return null;
    const title = game.headline || `${game.name} Moves Onto the Front Page`;
    return {
      label: "Games Lead",
      headline: title,
      summary: game.detail || "",
      confidence: game.confidence || "",
      sourceRefs: game.sourceRefs || [],
      image: game.image || issue.storeShelvesImage || null,
    };
  }

  function editorStandfirst(issue) {
    const game = topGame(issue);
    const movie = firstBrief(issue, /movie|cinema|box office|marquee|top gun|cobra/);
    const rock = (issue.musicChart || [])[0];
    const pieces = [];
    if (game && game.name) pieces.push(`gaming leads with ${game.name}`);
    if (issue.lead && issue.lead.headline) pieces.push(issue.lead.headline);
    if (movie && movie.headline) pieces.push(movie.headline);
    if (rock && rock.title && rock.artist) pieces.push(`${rock.title} by ${rock.artist}`);
    if (!pieces.length) return cleanPublicCopy(issue.editorNote || "");
    return `This week's front page follows ${pieces.join(", ")}.`;
  }

  function scanItem(label, title, detail) {
    if (!title) return "";
    return `
      <li>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(title)}</strong>
        ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
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
    const movie = firstBrief(issue, /movie|cinema|box office|marquee|top gun|cobra/);
    const rock = (issue.musicChart || [])[0];
    const price = (issue.priceWatch || [])[0];
    const bbs = issue.bbsNote;

    els.weekScan.innerHTML = [
      scanItem("Games", game && game.name, game && game.platform),
      scanItem("Computers", issue.lead && issue.lead.headline, ""),
      scanItem("Software", software && software.name, software && software.platform),
      scanItem("Movies", movie && movie.headline, movie && movie.label),
      scanItem("Rock", rock && rock.title, rock && rock.artist),
      scanItem("Shelf Watch", price && price.item, price && price.price),
      scanItem("Modems", bbs && bbs.headline, ""),
    ].filter(Boolean).join("");
  }

  function applyIssueStatus(issue, currentIso, historicIso) {
    if (!els.status) return;
    const requested = new URLSearchParams(window.location.search).get("date");
    const matchesToday = issue && (issue.currentDate === currentIso || issue.historicDate === historicIso);

    if (requested) {
      els.status.textContent = "Archive issue loaded.";
      els.status.dataset.statusState = "archive";
    } else if (matchesToday) {
      els.status.textContent = "Today’s issue is on the stand.";
      els.status.dataset.statusState = "current";
    } else {
      els.status.textContent = "Latest researched issue shown. Today's exact issue has not been loaded yet.";
      els.status.dataset.statusState = "stale";
    }
  }

  function renderIssue(issue, currentIso, historicIso) {
    els.currentDate.textContent = currentIso;
    els.historicDate.textContent = issue ? issue.displayDate : historicIso;
    els.edition.textContent = issue ? issue.edition : "Computer & Business Section";
    if (els.issueNo) els.issueNo.textContent = issueNumber(issue, currentIso);
    if (els.morningLine) els.morningLine.textContent = issue ? issue.morningLine || "Morning Edition: a quick daily skim from forty years ago." : "Morning Edition: awaiting a researched issue.";
    applyMasthead(issue);
    applyVisualProfile(issue);
    applyHeroImage(issue);
    applyLayoutPlan(issue);
    applySectionChrome(issue);
    applyNextAssignment(currentIso, issue);

    if (!issue) {
      els.status.textContent = "No researched issue has been loaded for this date yet.";
      if (els.status) els.status.dataset.statusState = "missing";
      els.lead.innerHTML = `
        <h2>Research Queue</h2>
        <p>This date needs a verified computer-news pass before a newspaper image is generated.</p>
        ${confidenceBadge("Not researched yet")}
      `;
      els.computerItems.innerHTML = "";
      if (els.pictureDeskPanel) els.pictureDeskPanel.hidden = true;
      if (els.pictureDesk) els.pictureDesk.innerHTML = "";
      if (els.softwarePanel) els.softwarePanel.hidden = true;
      if (els.softwareList) els.softwareList.innerHTML = "";
      els.market.innerHTML = "";
      if (els.issueBudget) els.issueBudget.innerHTML = "";
      if (els.storeShelvesImage) els.storeShelvesImage.innerHTML = "";
      els.storeShelves.innerHTML = "";
      els.priceWatch.innerHTML = "";
      els.bbs.innerHTML = "";
      if (els.curiosity) els.curiosity.innerHTML = "";
      if (els.briefs) els.briefs.innerHTML = "";
      if (els.musicChartImage) els.musicChartImage.innerHTML = "";
      if (els.musicChart) els.musicChart.innerHTML = "";
      if (els.musicSources) els.musicSources.innerHTML = "";
      els.ad.innerHTML = "";
      if (els.classifiedsPanel) els.classifiedsPanel.hidden = true;
      if (els.classifieds) els.classifieds.innerHTML = "";
      els.fallback.innerHTML = "";
      renderWeekScan(null);
      if (els.frontPageIndex) els.frontPageIndex.innerHTML = "";
      els.editorNote.textContent = "Personal computers and personal computer gaming are the editorial priority when source choices compete.";
      return;
    }

    applyIssueStatus(issue, currentIso, historicIso);
    els.editorNote.textContent = editorStandfirst(issue) || "Personal computers and personal computer gaming are the editorial priority when source choices compete.";
    els.editorNote.textContent = cleanPublicCopy(els.editorNote.textContent);
    renderWeekScan(issue);
    if (els.frontPageIndex) {
      els.frontPageIndex.innerHTML = frontPageItems(issue).map((item) => `
        <li>
          <span>${escapeHtml(item.kicker || "Desk")}</span>
          <strong>${escapeHtml(item.text)}</strong>
        </li>
      `).join("");
    }
    const lead = gameLead(issue) || issue.lead;
    els.lead.innerHTML = `
      <p class="section-label">${escapeHtml(lead.label || chrome(issue, "lead", "label", "Top Story"))}</p>
      <h2>${escapeHtml(lead.headline)}</h2>
      ${articleVisual(lead.image)}
      <p>${escapeHtml(lead.summary)}</p>
      ${confidenceBadge(lead.confidence)}
      ${sourceLinks(issue, lead.sourceRefs)}
    `;

    const pictureDeskItems = Array.isArray(issue.pictureDesk) ? issue.pictureDesk : [];
    if (els.pictureDeskPanel) els.pictureDeskPanel.hidden = pictureDeskItems.length === 0;
    if (els.pictureDesk) {
      els.pictureDesk.innerHTML = pictureDeskItems.map((item) => `
        <article class="picture-desk-item">
          <h3>${escapeHtml(item.title || item.caption || "Picture")}</h3>
          ${articleVisual(item.image || item)}
          ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
          ${sourceLinks(issue, item.sourceRefs)}
        </article>
      `).join("");
    }

    els.computerItems.innerHTML = issue.computerItems.map((item) => `
      <article class="chronicle-card">
        <p class="section-label">${escapeHtml(item.label)}</p>
        <h3>${escapeHtml(item.headline)}</h3>
        ${articleVisual(item.image)}
        <p>${escapeHtml(item.summary)}</p>
        ${confidenceBadge(item.confidence)}
        ${sourceLinks(issue, item.sourceRefs)}
      </article>
    `).join("");

    const softwareItems = Array.isArray(issue.softwareList) ? issue.softwareList : [];
    if (els.softwarePanel) els.softwarePanel.hidden = softwareItems.length === 0;
    if (els.softwareList) {
      els.softwareList.innerHTML = softwareItems.map((item) => `
        <li>
          <strong>${escapeHtml(item.name)}</strong>
          ${item.platform ? `<span class="platform-tag">${escapeHtml(item.platform)}</span>` : ""}
          <span>${escapeHtml(item.detail)}</span>
          ${confidenceBadge(item.confidence)}
          ${sourceLinks(issue, item.sourceRefs)}
        </li>
      `).join("");
    }

    const dow = issue.market.dow || "pending";
    const nasdaq = issue.market.nasdaq || "pending";
    els.market.innerHTML = `
      <p class="section-label">${escapeHtml(chrome(issue, "market", "label", "Business / Stock Market"))}</p>
      <h2>${escapeHtml(issue.market.headline)}</h2>
      <div class="ticker-row">
        <span>Dow <strong>${escapeHtml(dow)}</strong></span>
        <span>Nasdaq <strong>${escapeHtml(nasdaq)}</strong></span>
      </div>
      ${articleVisual(issue.market.image)}
      <p>${escapeHtml(issue.market.summary)}</p>
      ${confidenceBadge(issue.market.confidence)}
      ${sourceLinks(issue, issue.market.sourceRefs)}
    `;

    if (els.issueBudget) {
      els.issueBudget.innerHTML = (issue.issueBudget || []).map((item) => `
        <li>
          <span>${escapeHtml(item.priority || item.slot || "Desk")}</span>
          <p>
            <strong>${escapeHtml(item.slot || "Story")}</strong>
            <em>${escapeHtml(item.title || "")}</em>
          </p>
        </li>
      `).join("");
    }

    if (els.storeShelvesImage) els.storeShelvesImage.innerHTML = articleVisual(issue.storeShelvesImage);

    els.storeShelves.innerHTML = (issue.storeShelves || []).map((item) => `
      <li>
        <strong>${escapeHtml(item.name)}</strong>
        ${item.platform ? `<span class="platform-tag">${escapeHtml(item.platform)}</span>` : ""}
        <span>${escapeHtml(item.detail)}</span>
        ${confidenceBadge(item.confidence)}
        ${sourceLinks(issue, item.sourceRefs)}
      </li>
    `).join("");

    els.priceWatch.innerHTML = (issue.priceWatch || []).map((item) => `
      <li>
        <strong>${escapeHtml(item.item)}</strong>
        <span>${escapeHtml(item.price)}</span>
        <em>${escapeHtml(item.note)}</em>
      </li>
    `).join("");

    els.bbs.innerHTML = `
      <p class="section-label">${escapeHtml(chrome(issue, "bbs", "label", "Modem Desk"))}</p>
      <h2>${escapeHtml(issue.bbsNote && issue.bbsNote.headline)}</h2>
      ${articleVisual(issue.bbsNote && issue.bbsNote.image)}
      <p>${escapeHtml(issue.bbsNote && issue.bbsNote.summary)}</p>
      ${issue.bbsNote && Array.isArray(issue.bbsNote.posts) ? `
        <ul class="bbs-list">
          ${issue.bbsNote.posts.map((post) => `
            <li>
              <strong>${escapeHtml(post.topic)}</strong>
              ${post.platform ? `<span class="platform-tag">${escapeHtml(post.platform)}</span>` : ""}
              <p>${escapeHtml(post.text)}</p>
            </li>
          `).join("")}
        </ul>
      ` : ""}
      ${confidenceBadge(issue.bbsNote && issue.bbsNote.confidence)}
      ${sourceLinks(issue, issue.bbsNote && issue.bbsNote.sourceRefs)}
    `;

    if (els.musicChart) {
      if (els.musicChartImage) els.musicChartImage.innerHTML = articleVisual(issue.musicChartImage);
      els.musicChart.innerHTML = (issue.musicChart || []).map((item) => `
        <li>
          <p>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.artist)}</span>
          </p>
        </li>
      `).join("");
    }

    if (els.curiosity) {
      els.curiosity.innerHTML = `
        <p class="section-label">${escapeHtml(chrome(issue, "curiosity", "label", "Today's Curiosity"))}</p>
        <h2>${escapeHtml(issue.curiosity && issue.curiosity.headline)}</h2>
        <p>${escapeHtml(issue.curiosity && issue.curiosity.summary)}</p>
        ${(issue.curiosity && issue.curiosity.detail) ? `<p class="curiosity-detail">${escapeHtml(issue.curiosity.detail)}</p>` : ""}
        ${confidenceBadge(issue.curiosity && issue.curiosity.confidence)}
        ${sourceLinks(issue, issue.curiosity && issue.curiosity.sourceRefs)}
      `;
    }

    if (els.briefs) {
      els.briefs.innerHTML = (issue.briefs || []).map((item) => `
        <li>
          <span class="brief-kicker">${escapeHtml(item.kicker || "Brief")}</span>
          <strong>${escapeHtml(item.headline)}</strong>
          <p>${escapeHtml(item.summary)}</p>
          ${confidenceBadge(item.confidence)}
          ${sourceLinks(issue, item.sourceRefs)}
        </li>
      `).join("");
    }

    els.ad.innerHTML = `
      <p class="ad-kicker">Advertisement</p>
      <h2>${escapeHtml(issue.periodAd && issue.periodAd.headline)}</h2>
      <p>${escapeHtml(issue.periodAd && issue.periodAd.summary)}</p>
    `;

    const classifiedItems = Array.isArray(issue.classifieds) ? issue.classifieds : [];
    if (els.classifiedsPanel) els.classifiedsPanel.hidden = classifiedItems.length === 0;
    if (els.classifieds) {
      els.classifieds.innerHTML = classifiedItems.map((item) => `
        <li>
          <strong>${escapeHtml(item.headline || item.item || "For Sale")}</strong>
          <span>${escapeHtml(item.copy || item.detail || "")}</span>
          ${item.price ? `<em>${escapeHtml(item.price)}</em>` : ""}
        </li>
      `).join("");
    }

    els.fallback.innerHTML = `
      <p class="section-label">${escapeHtml(chrome(issue, "fallback", "label", "Fallback Lead"))}</p>
      <h2>${escapeHtml(issue.worldFallback.headline)}</h2>
      ${articleVisual(issue.worldFallback.image)}
      <p>${escapeHtml(issue.worldFallback.summary)}</p>
      ${confidenceBadge(issue.worldFallback.confidence)}
      ${sourceLinks(issue, issue.worldFallback.sourceRefs)}
    `;

  }

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
    issues.forEach((issue) => {
      const option = document.createElement("option");
      option.value = issue.currentDate;
      option.textContent = `${issue.currentDate} -> ${issue.displayDate}`;
      option.selected = selectedIssue && selectedIssue.currentDate === issue.currentDate;
      els.issuePicker.append(option);
    });
  }

  function renderArchiveList(issues, selectedIssue) {
    if (!els.archiveList) return;
    if (els.archiveNav) els.archiveNav.hidden = issues.length < 2;
    if (issues.length < 2) {
      els.archiveList.innerHTML = "";
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

    els.archiveList.innerHTML = issues.map((issue, index) => {
      const active = selectedIssue && selectedIssue.currentDate === issue.currentDate;
      const label = index === 0 ? "Latest" : "Archive";
      const headline = issue.lead && issue.lead.headline ? issue.lead.headline : issue.morningLine || "";
      return `
        <li>
          <a href="?date=${encodeURIComponent(issue.currentDate)}" ${active ? "aria-current=\"page\"" : ""}>
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(issue.currentDate)}</strong>
            <em>${escapeHtml(issue.displayDate || issue.historicDate)}</em>
            <b>${escapeHtml(headline)}</b>
          </a>
        </li>
      `;
    }).join("");
  }

  async function loadIssues() {
    const today = new Date();
    const currentIso = isoDate(today);
    const historicIso = isoDate(minusYears(today, 40));

    try {
      const response = await fetch("data/issues.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state.issues = data.issues || [];
      state.issue = pickIssue(state.issues, currentIso, historicIso);
      renderIssuePicker(state.issues, state.issue);
      renderArchiveList(state.issues, state.issue);
      renderIssue(state.issue, currentIso, historicIso);
    } catch (error) {
      els.status.textContent = `Could not load issue data: ${error.message}`;
      renderIssue(null, currentIso, historicIso);
    }
  }

  if (els.issuePicker) {
    els.issuePicker.addEventListener("change", () => {
      const selected = els.issuePicker.value;
      if (!selected) return;
      const url = new URL(window.location.href);
      url.searchParams.set("date", selected);
      window.location.href = url.toString();
    });
  }

  if (els.printIssue) {
    els.printIssue.addEventListener("click", () => {
      window.print();
    });
  }

  if (els.openHeroImage) {
    els.openHeroImage.addEventListener("click", openHeroLightbox);
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

  loadIssues();
})();
