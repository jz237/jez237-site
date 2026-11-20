(function () {
  function normalizeText(value) {
    return (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getSiteBaseUrl() {
    return new URL("https://baudersigns.com/");
  }

  function shouldAutoOpenLightbox() {
    var hasTouchPoints = (navigator.maxTouchPoints || 0) > 0;
    var hasTouchEvent = ("ontouchstart" in window);
    var coarsePointer = window.matchMedia
      ? window.matchMedia("(hover: none) and (pointer: coarse)").matches
      : false;
    var narrowViewport = window.innerWidth <= 1024;

    return !(hasTouchPoints || hasTouchEvent || coarsePointer || narrowViewport);
  }

  function buildTargetUrl(entry) {
    var targetUrl = new URL(entry.href, getSiteBaseUrl());
    targetUrl.search = "?image=" + encodeURIComponent(entry.image) + "&lightbox=" + (shouldAutoOpenLightbox() ? "1" : "0");
    return targetUrl.href;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initPortfolioSearch() {
    var form = document.getElementById("portfolio-search-form");
    var input = document.getElementById("portfolio-search-input");
    var results = document.getElementById("portfolio-search-results");
    var searchIndex = window.BAUDER_PORTFOLIO_SEARCH_INDEX || [];
    var activeIndex = -1;
    var currentResults = [];

    if (!form || !input || !results) return;

    if (!searchIndex.length) {
      input.disabled = true;
      input.placeholder = "Search unavailable";
      return;
    }

    function scoreEntry(entry, query, words) {
      if (!entry._searchText) return -1;
      if (entry._searchText === query) return 400;
      if (entry._searchText.indexOf(query) === 0) return 320;
      if (entry.titleKey && entry.titleKey.indexOf(query) === 0) return 280;

      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (!word) continue;
        var token = " " + word;
        if (entry.titleKey.indexOf(word) >= 0) score += 70;
        else if (entry._searchText.indexOf(word) >= 0) score += 35;
        else return -1;

        if (entry.titleKey.indexOf(token) >= 0) score += 6;
      }

      return score;
    }

    function hideResults() {
      results.hidden = true;
      results.innerHTML = "";
      activeIndex = -1;
      currentResults = [];
    }

    function navigateToLink(link) {
      if (!link || !link.href) return;
      window.location.href = link.href;
    }

    function setActiveResult(nextIndex) {
      var links = results.querySelectorAll(".portfolio-search-result");
      if (!links.length) {
        activeIndex = -1;
        return;
      }

      if (nextIndex < 0) nextIndex = links.length - 1;
      if (nextIndex >= links.length) nextIndex = 0;
      activeIndex = nextIndex;

      for (var i = 0; i < links.length; i++) {
        links[i].classList.toggle("is-active", i === activeIndex);
      }

      if (links[activeIndex] && links[activeIndex].scrollIntoView) {
        links[activeIndex].scrollIntoView({ block: "nearest" });
      }
    }

    function renderResults(matches, query) {
      if (!query) {
        hideResults();
        return;
      }

      if (!matches.length) {
        results.innerHTML = '<div class="portfolio-search-status">No matches found</div>';
        results.hidden = false;
        activeIndex = -1;
        currentResults = [];
        return;
      }

      var html = ['<div class="portfolio-search-status">' + matches.length + ' result' + (matches.length === 1 ? '' : 's') + '</div>'];
      for (var i = 0; i < matches.length; i++) {
        var entry = matches[i];
        html.push(
          '<a class="portfolio-search-result" href="' + buildTargetUrl(entry) + '" data-index="' + i + '">' +
            '<span class="portfolio-search-result-title">' + escapeHtml(entry.title) + '</span>' +
            '<span class="portfolio-search-result-meta">' + escapeHtml(entry.section) + '</span>' +
          '</a>'
        );
      }

      results.innerHTML = html.join("");
      results.hidden = false;
      currentResults = matches;
      setActiveResult(0);
    }

    function updateResults() {
      var query = normalizeText(input.value);
      if (query.length < 2) {
        hideResults();
        return;
      }

      var words = query.split(" ");
      var ranked = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var entry = searchIndex[i];
        var score = scoreEntry(entry, query, words);
        if (score < 0) continue;
        ranked.push({ entry: entry, score: score });
      }

      ranked.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.entry.title.localeCompare(b.entry.title);
      });

      var matches = [];
      for (var j = 0; j < ranked.length; j++) {
        matches.push(ranked[j].entry);
      }

      renderResults(matches, query);
    }

    for (var i = 0; i < searchIndex.length; i++) {
      searchIndex[i].titleKey = normalizeText(searchIndex[i].title);
      searchIndex[i]._searchText = normalizeText(searchIndex[i].title + " " + searchIndex[i].section);
    }

    input.addEventListener("input", updateResults);
    input.addEventListener("focus", updateResults);

    input.addEventListener("keydown", function (e) {
      if (results.hidden) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveResult(activeIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveResult(activeIndex - 1);
      } else if (e.key === "Enter") {
        if (activeIndex < 0 || !currentResults[activeIndex]) return;
        e.preventDefault();
        window.location.href = buildTargetUrl(currentResults[activeIndex]);
      } else if (e.key === "Escape") {
        hideResults();
      }
    });

    form.addEventListener("submit", function (e) {
      updateResults();
      if (!currentResults.length) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      var selected = activeIndex >= 0 ? currentResults[activeIndex] : currentResults[0];
      window.location.href = buildTargetUrl(selected);
    });

    results.addEventListener("mousemove", function (e) {
      var link = e.target.closest(".portfolio-search-result");
      if (!link) return;
      setActiveResult(parseInt(link.getAttribute("data-index"), 10) || 0);
    });

    results.addEventListener("click", function (e) {
      var link = e.target.closest(".portfolio-search-result");
      if (!link) return;
      e.preventDefault();
      navigateToLink(link);
    });

    /* Track touch start position so we can distinguish taps from scrolls */
    var touchStartY = null;
    results.addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    results.addEventListener("touchend", function (e) {
      var link = e.target.closest(".portfolio-search-result");
      if (!link) return;
      /* If finger moved more than 10px, treat as scroll not tap */
      if (touchStartY !== null && Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) {
        touchStartY = null;
        return;
      }
      touchStartY = null;
      e.preventDefault();
      navigateToLink(link);
    });

    document.addEventListener("click", function (e) {
      if (form.contains(e.target) || results.contains(e.target)) return;
      hideResults();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortfolioSearch);
  } else {
    initPortfolioSearch();
  }
})();
