(function () {
  const state = {
    issue: null,
    issues: [],
  };

  const els = {
    historicDate: document.querySelector("[data-historic-date]"),
    currentDate: document.querySelector("[data-current-date]"),
    edition: document.querySelector("[data-edition]"),
    lead: document.querySelector("[data-lead]"),
    computerItems: document.querySelector("[data-computer-items]"),
    market: document.querySelector("[data-market]"),
    storeShelves: document.querySelector("[data-store-shelves]"),
    priceWatch: document.querySelector("[data-price-watch]"),
    bbs: document.querySelector("[data-bbs]"),
    ad: document.querySelector("[data-period-ad]"),
    imageBrief: document.querySelector("[data-image-brief]"),
    fallback: document.querySelector("[data-fallback]"),
    sources: document.querySelector("[data-sources]"),
    status: document.querySelector("[data-status]"),
    editorNote: document.querySelector("[data-editor-note]"),
    issuePicker: document.querySelector("[data-issue-picker]"),
    copyPrompt: document.querySelector("[data-copy-prompt]"),
    promptStatus: document.querySelector("[data-prompt-status]"),
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

  function confidenceBadge(text) {
    const value = escapeHtml(text || "Unlabeled");
    return `<span class="confidence">${value}</span>`;
  }

  function renderIssue(issue, currentIso, historicIso) {
    els.currentDate.textContent = currentIso;
    els.historicDate.textContent = issue ? issue.displayDate : historicIso;
    els.edition.textContent = issue ? issue.edition : "Computer & Business Section";

    if (!issue) {
      els.status.textContent = "No researched issue has been loaded for this date yet.";
      els.lead.innerHTML = `
        <h2>Research Queue</h2>
        <p>This date needs a verified computer-news pass before a newspaper image is generated.</p>
        ${confidenceBadge("Not researched yet")}
      `;
      els.computerItems.innerHTML = "";
      els.market.innerHTML = "";
      els.storeShelves.innerHTML = "";
      els.priceWatch.innerHTML = "";
      els.bbs.innerHTML = "";
      els.ad.innerHTML = "";
      els.imageBrief.innerHTML = "";
      els.fallback.innerHTML = "";
      els.sources.innerHTML = "";
      els.editorNote.textContent = "Personal computers and personal computer gaming are the editorial priority when source choices compete.";
      return;
    }

    els.status.textContent = "Loaded from structured issue data.";
    els.editorNote.textContent = issue.editorNote || "Personal computers and personal computer gaming are the editorial priority when source choices compete.";
    els.lead.innerHTML = `
      <p class="section-label">Top Computer Story</p>
      <h2>${escapeHtml(issue.lead.headline)}</h2>
      <p>${escapeHtml(issue.lead.summary)}</p>
      ${confidenceBadge(issue.lead.confidence)}
    `;

    els.computerItems.innerHTML = issue.computerItems.map((item) => `
      <article class="chronicle-card">
        <p class="section-label">${escapeHtml(item.label)}</p>
        <h3>${escapeHtml(item.headline)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        ${confidenceBadge(item.confidence)}
      </article>
    `).join("");

    const dow = issue.market.dow || "pending";
    const nasdaq = issue.market.nasdaq || "pending";
    els.market.innerHTML = `
      <p class="section-label">Business / Stock Market</p>
      <h2>${escapeHtml(issue.market.headline)}</h2>
      <div class="ticker-row">
        <span>Dow <strong>${escapeHtml(dow)}</strong></span>
        <span>Nasdaq <strong>${escapeHtml(nasdaq)}</strong></span>
      </div>
      <p>${escapeHtml(issue.market.summary)}</p>
      ${confidenceBadge(issue.market.confidence)}
    `;

    els.storeShelves.innerHTML = (issue.storeShelves || []).map((item) => `
      <li>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.detail)}</span>
        ${confidenceBadge(item.confidence)}
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
      <p class="section-label">Modem Desk</p>
      <h2>${escapeHtml(issue.bbsNote && issue.bbsNote.headline)}</h2>
      <p>${escapeHtml(issue.bbsNote && issue.bbsNote.summary)}</p>
      ${confidenceBadge(issue.bbsNote && issue.bbsNote.confidence)}
    `;

    els.ad.innerHTML = `
      <p class="ad-kicker">Advertisement</p>
      <h2>${escapeHtml(issue.periodAd && issue.periodAd.headline)}</h2>
      <p>${escapeHtml(issue.periodAd && issue.periodAd.summary)}</p>
      <small>${escapeHtml(issue.periodAd && issue.periodAd.finePrint)}</small>
      ${(issue.periodAd && issue.periodAd.sourceUrl) ? `<a class="ad-source" href="${escapeHtml(issue.periodAd.sourceUrl)}" target="_blank" rel="noopener">Source ad</a>` : ""}
    `;

    const brief = issue.imageBrief || {};
    els.imageBrief.innerHTML = `
      <p class="section-label">Image Generator Brief</p>
      <h2>${escapeHtml(brief.title || "Daily Newspaper Image Brief")}</h2>
      <dl class="brief-list">
        <dt>Masthead</dt>
        <dd>${escapeHtml(brief.masthead)}</dd>
        <dt>Format</dt>
        <dd>${escapeHtml(brief.format)}</dd>
        <dt>Primary Visual</dt>
        <dd>${escapeHtml(brief.primaryVisual)}</dd>
      </dl>
      <div class="brief-columns">
        <div>
          <h3>Must include</h3>
          <ul>${(brief.mustInclude || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>Avoid</h3>
          <ul>${(brief.avoid || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </div>
    `;

    els.fallback.innerHTML = `
      <p class="section-label">Fallback Lead</p>
      <h2>${escapeHtml(issue.worldFallback.headline)}</h2>
      <p>${escapeHtml(issue.worldFallback.summary)}</p>
      ${confidenceBadge(issue.worldFallback.confidence)}
    `;

    els.sources.innerHTML = issue.sources.map((source) => `
      <li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a></li>
    `).join("");
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

  function buildImagePrompt(issue) {
    if (!issue) return "";
    const brief = issue.imageBrief || {};
    const items = (issue.computerItems || [])
      .map((item) => `- ${item.label}: ${item.headline} (${item.confidence})`)
      .join("\n");
    const shelves = (issue.storeShelves || [])
      .map((item) => `- ${item.name}: ${item.detail}`)
      .join("\n");
    const include = (brief.mustInclude || []).map((item) => `- ${item}`).join("\n");
    const avoid = (brief.avoid || []).map((item) => `- ${item}`).join("\n");

    return `Create a photorealistic 1980s newspaper computer section image.

Masthead: ${brief.masthead || "The Computer Chronicle"}
Date line: ${issue.displayDate}
Edition: ${issue.edition}
Format: ${brief.format || "One-page newspaper section, black ink on aged newsprint."}
Primary visual: ${brief.primaryVisual || "Period-correct personal computer setup."}

Lead headline: ${issue.lead.headline}
Lead summary: ${issue.lead.summary}

Computer desk:
${items}

On store shelves:
${shelves}

Markets: Dow ${issue.market.dow || "pending"}, Nasdaq ${issue.market.nasdaq || "pending"}.
Advertisement reference: ${issue.periodAd.headline}. ${issue.periodAd.summary}
BBS note: ${issue.bbsNote.headline}. ${issue.bbsNote.summary}

Must include:
${include}

Avoid:
${avoid}

Keep the page authentic to the period. Use dense serif newspaper columns, halftone images, ruled boxes, small market/sidebar modules, and no modern technology cues.`;
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

  if (els.copyPrompt) {
    els.copyPrompt.addEventListener("click", async () => {
      const prompt = buildImagePrompt(state.issue);
      if (!prompt) return;
      try {
        await navigator.clipboard.writeText(prompt);
        els.promptStatus.textContent = "Newspaper image prompt copied.";
      } catch (error) {
        els.promptStatus.textContent = "Clipboard blocked; use the image brief below.";
      }
    });
  }

  loadIssues();
})();
