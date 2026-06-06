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
    lead: document.querySelector("[data-lead]"),
    computerItems: document.querySelector("[data-computer-items]"),
    market: document.querySelector("[data-market]"),
    storeShelves: document.querySelector("[data-store-shelves]"),
    priceWatch: document.querySelector("[data-price-watch]"),
    bbs: document.querySelector("[data-bbs]"),
    curiosity: document.querySelector("[data-curiosity]"),
    musicChart: document.querySelector("[data-music-chart]"),
    ad: document.querySelector("[data-period-ad]"),
    fallback: document.querySelector("[data-fallback]"),
    sources: document.querySelector("[data-sources]"),
    status: document.querySelector("[data-status]"),
    editorNote: document.querySelector("[data-editor-note]"),
    issuePicker: document.querySelector("[data-issue-picker]"),
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

  function issueNumber(issue, currentIso) {
    const baseDate = new Date("2026-01-01T00:00:00");
    const issueDate = new Date(`${(issue && issue.currentDate) || currentIso}T00:00:00`);
    const days = Math.max(0, Math.round((issueDate - baseDate) / 86400000));
    return String(days + 1).padStart(3, "0");
  }

  function renderIssue(issue, currentIso, historicIso) {
    els.currentDate.textContent = currentIso;
    els.historicDate.textContent = issue ? issue.displayDate : historicIso;
    els.edition.textContent = issue ? issue.edition : "Computer & Business Section";
    if (els.issueNo) els.issueNo.textContent = issueNumber(issue, currentIso);
    if (els.morningLine) els.morningLine.textContent = issue ? issue.morningLine || "Morning Edition: a quick daily skim from forty years ago." : "Morning Edition: awaiting a researched issue.";

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
      if (els.curiosity) els.curiosity.innerHTML = "";
      if (els.musicChart) els.musicChart.innerHTML = "";
      els.ad.innerHTML = "";
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

    if (els.musicChart) {
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
        <p class="section-label">Today's Curiosity</p>
        <h2>${escapeHtml(issue.curiosity && issue.curiosity.headline)}</h2>
        <p>${escapeHtml(issue.curiosity && issue.curiosity.summary)}</p>
        ${(issue.curiosity && issue.curiosity.detail) ? `<p class="curiosity-detail">${escapeHtml(issue.curiosity.detail)}</p>` : ""}
        ${confidenceBadge(issue.curiosity && issue.curiosity.confidence)}
      `;
    }

    els.ad.innerHTML = `
      <p class="ad-kicker">Advertisement</p>
      <h2>${escapeHtml(issue.periodAd && issue.periodAd.headline)}</h2>
      <p>${escapeHtml(issue.periodAd && issue.periodAd.summary)}</p>
      <small>${escapeHtml(issue.periodAd && issue.periodAd.finePrint)}</small>
      ${(issue.periodAd && issue.periodAd.sourceUrl) ? `<a class="ad-source" href="${escapeHtml(issue.periodAd.sourceUrl)}" target="_blank" rel="noopener">Source ad</a>` : ""}
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

  loadIssues();
})();
