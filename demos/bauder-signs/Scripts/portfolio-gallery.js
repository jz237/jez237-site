(function () {
  function createEl(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function getInlineImages() {
    var node = document.getElementById("portfolio-gallery-data");
    if (!node) return [];
    try {
      var data = JSON.parse(node.textContent || "[]");
      if (!Array.isArray(data)) return [];
      return data.filter(function (x) { return typeof x === "string" && x.length > 0; });
    } catch (_) {
      return [];
    }
  }

  function uniqueStrings(arr) {
    var out = [];
    var seen = {};
    for (var i = 0; i < arr.length; i++) {
      var s = arr[i];
      if (typeof s !== "string" || !s) continue;
      if (seen[s]) continue;
      seen[s] = true;
      out.push(s);
    }
    return out;
  }

  function getImageList() {
    return Promise.resolve(uniqueStrings(getInlineImages()));
  }

  function createThumbUrl(src) {
    return src.replace(/^photos\//, "thumbs/") + ".webp";
  }

  function randomRange(min, max) {
    return min + (Math.random() * (max - min));
  }

  function applyThumbPulseTiming(el) {
    if (!el || !el.style) return;
    var duration = randomRange(2.2, 4.8).toFixed(2) + "s";
    var delay = "-" + randomRange(0, 4.8).toFixed(2) + "s";
    el.style.setProperty("--thumb-pulse-duration", duration);
    el.style.setProperty("--thumb-pulse-delay", delay);
  }

  function decodePathSegment(value) {
    try {
      return decodeURIComponent(value);
    } catch (_) {
      return value;
    }
  }

  function getImageDescription(src) {
    if (typeof src !== "string" || !src) return "";

    var fileName = src.split("/").pop() || src;
    fileName = decodePathSegment(fileName);
    var baseName = fileName.replace(/\.[^.]+$/, "").trim();
    if (!baseName) return "";
    if (/^photo\d+[a-z]?$/i.test(baseName)) return "";

    return baseName
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function getImageLabel(index, images) {
    var total = images.length;
    var description = getImageDescription(images[index]);
    var label = "Image " + (index + 1) + " of " + total;
    if (description) {
      label += " - " + description;
    }
    return label;
  }

  function getLightboxCaptionLabel(index, images) {
    var description = getImageDescription(images[index]);
    if (description) {
      return description;
    }
    return "Image " + (index + 1);
  }

  function getImageAlt(index, images) {
    var description = getImageDescription(images[index]);
    if (description) return description;
    return "Portfolio image " + (index + 1);
  }

  function normalizeImagePath(src) {
    if (typeof src !== "string") return "";
    return decodePathSegment(src).replace(/\\/g, "/");
  }

  function getRequestedImageState(images) {
    if (!window.location || !window.location.search) {
      return null;
    }

    var params = new URLSearchParams(window.location.search);
    var requestedImage = params.get("image");
    if (!requestedImage) {
      return null;
    }

    var requestedPath = normalizeImagePath(requestedImage);
    var requestedLower = requestedPath.toLowerCase();
    var index = -1;

    for (var i = 0; i < images.length; i++) {
      var currentPath = normalizeImagePath(images[i]);
      if (!currentPath) continue;
      if (currentPath === requestedPath || currentPath.toLowerCase() === requestedLower) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      return null;
    }

    return {
      index: index,
      openLightbox: params.get("lightbox") !== "0"
    };
  }

  function preloadAround(images, index) {
    if (!images.length) return;
    var prev = (index - 1 + images.length) % images.length;
    var next = (index + 1) % images.length;
    var a = new Image();
    var b = new Image();
    a.src = images[prev];
    b.src = images[next];
  }

  function attachSwipe(el, onLeft, onRight) {
    var startX = 0;
    var startY = 0;

    el.addEventListener("touchstart", function (e) {
      if (!e.touches || !e.touches.length) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    el.addEventListener("touchend", function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onLeft();
      else onRight();
    }, { passive: true });
  }

  function renderError(container, message) {
    container.innerHTML = "";
    var msg = createEl("div", "portfolio-gallery-error");
    msg.textContent = message;
    container.appendChild(msg);
  }

  function renderGallery(container, images) {
    container.innerHTML = "";

    var state = {
      index: 0,
      images: images,
      lightboxOpen: false,
      isSliding: false,
      isStageSliding: false,
      lightboxFitMode: "contain",
      thumbsHovered: false,
      wheelNavLocked: false,
      stageHovered: false,
      gridHovered: false,
      stageWheelLocked: false,
      panX: 0,
      panY: 0,
      panMaxX: 0,
      panMaxY: 0,
      isPanning: false,
      panStartClientX: 0,
      panStartClientY: 0,
      panStartX: 0,
      panStartY: 0,
      suppressNextClick: false
    };

    var wrap = createEl("div", "portfolio-gallery");
    var stage = createEl("div", "portfolio-gallery-stage");
    stage.setAttribute("aria-label", "Open full screen image");
    stage.setAttribute("role", "button");
    stage.setAttribute("tabindex", "0");

    var stageViewport = createEl("div", "portfolio-gallery-stage-viewport");
    var stageTrack = createEl("div", "portfolio-gallery-stage-track");
    var stagePrevImg = createEl("img", "portfolio-gallery-stage-image");
    var stageCurrImg = createEl("img", "portfolio-gallery-stage-image");
    var stageNextImg = createEl("img", "portfolio-gallery-stage-image");
    var pendingStageHandler = null;
    stageTrack.appendChild(stagePrevImg);
    stageTrack.appendChild(stageCurrImg);
    stageTrack.appendChild(stageNextImg);
    var caption = createEl("div", "portfolio-gallery-caption");
    stageViewport.appendChild(stageTrack);
    stageViewport.appendChild(caption);
    stage.appendChild(stageViewport);

    // --- Social interaction bar (Instagram-style) ---

    var socialZone = createEl("div", "portfolio-social-zone");
    var socialActions = createEl("div", "portfolio-social-actions");

    var heartBtn = createEl("button", "portfolio-social-heart");
    heartBtn.type = "button";
    heartBtn.setAttribute("aria-label", "Like this image");
    heartBtn.innerHTML =
      '<svg class="heart-outline" viewBox="0 0 24 24" width="21" height="21"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' +
      '<svg class="heart-filled" viewBox="0 0 24 24" width="21" height="21"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ed4956" stroke="#ed4956" stroke-width="1.5"/></svg>';

    var commentBtn = createEl("button", "portfolio-social-comment-btn");
    commentBtn.type = "button";
    commentBtn.setAttribute("aria-label", "Comment on this image");
    commentBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="21" height="21"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h2v4l4-4h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

    var socialLikeCount = createEl("span", "portfolio-social-like-count");
    var socialCommentLink = createEl("button", "portfolio-social-comment-link");
    socialCommentLink.type = "button";

    socialActions.appendChild(heartBtn);
    socialActions.appendChild(commentBtn);
    socialActions.appendChild(socialCommentLink);
    socialActions.appendChild(socialLikeCount);

    socialZone.appendChild(socialActions);


    // --- Comment overlay panel ---
    var commentOverlay = createEl("div", "portfolio-comment-overlay");
    var commentPanel = createEl("div", "portfolio-comment-panel");

    var commentHeader = createEl("div", "portfolio-comment-header");
    var commentTitle = createEl("div", "portfolio-comment-title");
    commentTitle.textContent = "Comments";
    var commentCloseBtn = createEl("button", "portfolio-comment-close");
    commentCloseBtn.type = "button";
    commentCloseBtn.setAttribute("aria-label", "Close comments");
    commentCloseBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    commentHeader.appendChild(commentTitle);
    commentHeader.appendChild(commentCloseBtn);

    var commentList = createEl("div", "portfolio-comment-list");
    var commentEmpty = createEl("div", "portfolio-comment-empty");
    commentEmpty.textContent = "No comments yet.";

    var commentInputBar = createEl("div", "portfolio-comment-input-bar");
    var commentNameInput = createEl("input", "portfolio-comment-name-input");
    commentNameInput.type = "text";
    commentNameInput.placeholder = "Name (optional)";
    commentNameInput.maxLength = 50;
    var commentTextInput = createEl("input", "portfolio-comment-text-input");
    commentTextInput.type = "text";
    commentTextInput.placeholder = "Add a comment...";
    commentTextInput.maxLength = 500;
    var commentPostBtn = createEl("button", "portfolio-comment-post-btn");
    commentPostBtn.type = "button";
    commentPostBtn.textContent = "Post";

    commentInputBar.appendChild(commentNameInput);
    commentInputBar.appendChild(commentTextInput);
    commentInputBar.appendChild(commentPostBtn);

    commentPanel.appendChild(commentHeader);
    commentPanel.appendChild(commentList);
    commentPanel.appendChild(commentInputBar);
    commentOverlay.appendChild(commentPanel);

    // Restore saved commenter name
    try { var cName = localStorage.getItem("bauder-comment-name") || ""; if (cName) commentNameInput.value = cName; } catch (_) {}

    wrap.appendChild(stage);
    wrap.appendChild(socialZone);

    var gridWrap = createEl("div", "portfolio-gallery-grid-wrap");
    var grid = createEl("div", "portfolio-gallery-grid");
    gridWrap.appendChild(grid);
    gridWrap.appendChild(commentOverlay);
    wrap.appendChild(gridWrap);

    var lightbox = createEl("div", "portfolio-lightbox");
    var lightboxShell = createEl("div", "portfolio-lightbox-shell");
    var lightboxTop = createEl("div", "portfolio-lightbox-top");
    var lightboxMeta = createEl("div", "portfolio-lightbox-meta");
    var lightboxEyebrow = createEl("div", "portfolio-lightbox-eyebrow");
    var lightboxTitle = createEl("div", "portfolio-lightbox-title");
    var lightboxActions = createEl("div", "portfolio-lightbox-actions");
    var lightboxCountChip = createEl("div", "portfolio-lightbox-chip");
    var lightboxStageZone = createEl("div", "portfolio-lightbox-stage-zone");
    var lightboxStageWrap = createEl("div", "portfolio-lightbox-stage-wrap");
    var lightboxViewport = createEl("div", "portfolio-lightbox-viewport");
    var lightboxCurrentImg = createEl("img", "portfolio-lightbox-image");
    var lightboxIncomingImg = createEl("img", "portfolio-lightbox-image is-hidden");
    var lightboxCaption = createEl("div", "portfolio-lightbox-caption");
    var lightboxThumbStrip = createEl("div", "portfolio-lightbox-thumb-strip");
    var lightboxThumbs = createEl("div", "portfolio-lightbox-thumbs");
    var lightboxBottom = createEl("div", "portfolio-lightbox-bottom");
    var lightboxHint = createEl("div", "portfolio-lightbox-hint");
    var lightboxMode = createEl("button", "portfolio-lightbox-mode");
    var btnClose = createEl("button", "portfolio-lightbox-close");
    var btnPrev = createEl("button", "portfolio-lightbox-prev");
    var btnNext = createEl("button", "portfolio-lightbox-next");
    var pendingLightboxAnimHandler = null;
    var galleryThumbButtons = [];
    var lightboxThumbButtons = [];

    btnClose.type = "button";
    btnPrev.type = "button";
    btnNext.type = "button";
    lightboxMode.type = "button";

    btnClose.textContent = "x";
    btnPrev.textContent = "<";
    btnNext.textContent = ">";

    btnClose.setAttribute("aria-label", "Close image viewer");
    btnPrev.setAttribute("aria-label", "Previous image");
    btnNext.setAttribute("aria-label", "Next image");

    var pageTitle = (document.title || "Portfolio Image Viewer")
      .replace(/\s*\/\s*Bauder Graphics.*$/i, "")
      .trim();
    lightboxEyebrow.textContent = "Bauder Graphics Portfolio";
    lightboxTitle.textContent = pageTitle || "Portfolio Image Viewer";
    lightboxHint.textContent = "Swipe, arrow keys, or thumbnails";
    lightboxMode.textContent = "Fill Frame";
    lightboxMode.setAttribute("aria-label", "Toggle image fit mode");

    lightboxCurrentImg.alt = "Portfolio image";
    lightboxCurrentImg.decoding = "async";
    lightboxCurrentImg.loading = "eager";
    lightboxIncomingImg.alt = "Incoming portfolio image";
    lightboxIncomingImg.decoding = "async";
    lightboxIncomingImg.loading = "eager";
    lightboxViewport.appendChild(lightboxCurrentImg);
    lightboxViewport.appendChild(lightboxIncomingImg);
    lightboxStageWrap.appendChild(lightboxViewport);
    lightboxStageWrap.appendChild(btnPrev);
    lightboxStageWrap.appendChild(btnNext);
    lightboxStageWrap.appendChild(lightboxCaption);

    lightboxStageZone.appendChild(lightboxStageWrap);
    lightboxThumbStrip.appendChild(lightboxThumbs);

    lightboxMeta.appendChild(lightboxEyebrow);
    lightboxMeta.appendChild(lightboxTitle);
    lightboxActions.appendChild(btnClose);
    lightboxTop.appendChild(lightboxMeta);
    lightboxTop.appendChild(lightboxActions);

    // --- Lightbox social buttons (like & comment) ---
    var lbSocialActions = createEl("div", "portfolio-social-actions portfolio-lightbox-social");

    var lbHeartBtn = createEl("button", "portfolio-social-heart");
    lbHeartBtn.type = "button";
    lbHeartBtn.setAttribute("aria-label", "Like this image");
    lbHeartBtn.innerHTML = heartBtn.innerHTML;

    var lbCommentBtn = createEl("button", "portfolio-social-comment-btn");
    lbCommentBtn.type = "button";
    lbCommentBtn.setAttribute("aria-label", "Comment on this image");
    lbCommentBtn.innerHTML = commentBtn.innerHTML;

    var lbLikeCount = createEl("span", "portfolio-social-like-count");

    var lbCommentLink = createEl("button", "portfolio-social-comment-link");
    lbCommentLink.type = "button";

    lbSocialActions.appendChild(lbHeartBtn);
    lbSocialActions.appendChild(lbCommentBtn);
    lbSocialActions.appendChild(lbCommentLink);
    lbSocialActions.appendChild(lbLikeCount);


    lightboxStageWrap.appendChild(lbSocialActions);

    lightboxBottom.appendChild(lightboxHint);
    lightboxBottom.appendChild(lightboxMode);

    lightboxShell.appendChild(lightboxTop);
    lightboxShell.appendChild(lightboxStageZone);
    lightboxShell.appendChild(lightboxThumbStrip);
    lightboxShell.appendChild(lightboxBottom);
    lightbox.appendChild(lightboxShell);
    document.body.appendChild(lightbox);

    function wrapIndex(index) {
      var len = state.images.length;
      return ((index % len) + len) % len;
    }

    function resetStageTrack() {
      stageTrack.style.transition = "none";
      stageTrack.style.transform = "translateX(-100%)";
      stageTrack.offsetWidth;
      stageTrack.style.transition = "";
    }

    function syncStageSlides() {
      var prevIndex = wrapIndex(state.index - 1);
      var nextIndex = wrapIndex(state.index + 1);

      stagePrevImg.src = state.images[prevIndex];
      stagePrevImg.alt = getImageAlt(prevIndex, state.images);

      stageCurrImg.src = state.images[state.index];
      stageCurrImg.alt = getImageAlt(state.index, state.images);

      stageNextImg.src = state.images[nextIndex];
      stageNextImg.alt = getImageAlt(nextIndex, state.images);

      resetStageTrack();
    }

    function syncLightboxImage(direction, immediate) {
      var shouldAnimate = !immediate && state.lightboxOpen && (direction === "next" || direction === "prev");
      stopPanning();

      if (pendingLightboxAnimHandler) {
        lightboxIncomingImg.removeEventListener("transitionend", pendingLightboxAnimHandler);
        pendingLightboxAnimHandler = null;
      }

      lightboxCurrentImg.classList.remove("is-animating");
      lightboxIncomingImg.classList.remove("is-animating");
      lightboxCurrentImg.style.transition = "none";
      lightboxIncomingImg.style.transition = "none";
      lightboxCurrentImg.style.transform = "translateX(0)";
      lightboxIncomingImg.style.transform = "translateX(0)";
      lightboxCurrentImg.style.objectFit = state.lightboxFitMode;
      lightboxIncomingImg.style.objectFit = state.lightboxFitMode;
      lightboxMode.textContent = state.lightboxFitMode === "contain" ? "Fill Frame" : "Fit to Screen";
      resetPanPosition();
      applyPanToImage(lightboxCurrentImg);
      applyPanToImage(lightboxIncomingImg);
      updatePanAvailability();

      if (!shouldAnimate) {
        lightboxCurrentImg.src = state.images[state.index];
        lightboxCurrentImg.alt = getImageAlt(state.index, state.images);
        lightboxIncomingImg.classList.add("is-hidden");
        state.isSliding = false;
        updatePanBoundsFromCurrentImage();
        return;
      }

      lightboxIncomingImg.src = state.images[state.index];
      lightboxIncomingImg.alt = getImageAlt(state.index, state.images);
      lightboxIncomingImg.classList.remove("is-hidden");

      var incomingStart = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
      var outgoingEnd = direction === "next" ? "translateX(-100%)" : "translateX(100%)";

      lightboxCurrentImg.style.transform = "translateX(0)";
      lightboxIncomingImg.style.transform = incomingStart;

      lightboxIncomingImg.offsetWidth;

      lightboxCurrentImg.classList.add("is-animating");
      lightboxIncomingImg.classList.add("is-animating");
      lightboxCurrentImg.style.transition = "";
      lightboxIncomingImg.style.transition = "";
      lightboxCurrentImg.style.transform = outgoingEnd;
      lightboxIncomingImg.style.transform = "translateX(0)";

      function finishAnim(e) {
        if (e && e.target !== lightboxIncomingImg) return;
        lightboxIncomingImg.removeEventListener("transitionend", finishAnim);
        pendingLightboxAnimHandler = null;

        lightboxCurrentImg.classList.remove("is-animating");
        lightboxIncomingImg.classList.remove("is-animating");
        lightboxCurrentImg.style.transition = "none";
        lightboxIncomingImg.style.transition = "none";
        lightboxCurrentImg.style.transform = "translateX(0)";
        lightboxIncomingImg.style.transform = "translateX(0)";

        lightboxCurrentImg.src = lightboxIncomingImg.src;
        lightboxCurrentImg.alt = lightboxIncomingImg.alt;
        lightboxIncomingImg.classList.add("is-hidden");
        state.isSliding = false;
        updatePanBoundsFromCurrentImage();
      }

      pendingLightboxAnimHandler = finishAnim;
      lightboxIncomingImg.addEventListener("transitionend", finishAnim);
    }

    lightboxCurrentImg.addEventListener("error", function () {
      lightboxCurrentImg.src = state.images[state.index];
    });
    lightboxCurrentImg.addEventListener("load", function () {
      updatePanBoundsFromCurrentImage();
    });
    lightboxCurrentImg.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
    lightboxIncomingImg.addEventListener("error", function () {
      lightboxIncomingImg.src = state.images[state.index];
    });
    lightboxIncomingImg.addEventListener("load", function () {
      applyPanToImage(lightboxIncomingImg);
    });
    lightboxIncomingImg.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    function cancelStageSlide() {
      if (pendingStageHandler) {
        stageTrack.removeEventListener("transitionend", pendingStageHandler);
        pendingStageHandler = null;
      }
      state.isStageSliding = false;
      resetStageTrack();
    }

    function cancelLightboxSlide() {
      state.isSliding = false;
    }

    function resetPanPosition() {
      state.panX = 0;
      state.panY = 0;
    }

    function stopPanning() {
      state.isPanning = false;
      lightboxViewport.classList.remove("is-panning");
    }

    function clampPan() {
      if (state.panX > state.panMaxX) state.panX = state.panMaxX;
      if (state.panX < -state.panMaxX) state.panX = -state.panMaxX;
      if (state.panY > state.panMaxY) state.panY = state.panMaxY;
      if (state.panY < -state.panMaxY) state.panY = -state.panMaxY;
    }

    function applyPanToImage(img) {
      if (!img) return;
      if (state.lightboxFitMode !== "cover") {
        img.style.objectPosition = "50% 50%";
        return;
      }
      img.style.objectPosition = "calc(50% + " + state.panX + "px) calc(50% + " + state.panY + "px)";
    }

    function updatePanAvailability() {
      var canPan = state.lightboxFitMode === "cover" && (state.panMaxX > 0 || state.panMaxY > 0);
      lightboxViewport.classList.toggle("is-pan-enabled", canPan);
      if (!canPan) {
        stopPanning();
      }
    }

    function updatePanBoundsFromCurrentImage() {
      if (state.lightboxFitMode !== "cover") {
        state.panMaxX = 0;
        state.panMaxY = 0;
        resetPanPosition();
        applyPanToImage(lightboxCurrentImg);
        applyPanToImage(lightboxIncomingImg);
        updatePanAvailability();
        return;
      }

      var vw = lightboxViewport.clientWidth;
      var vh = lightboxViewport.clientHeight;
      var nw = lightboxCurrentImg.naturalWidth || 0;
      var nh = lightboxCurrentImg.naturalHeight || 0;
      if (!vw || !vh || !nw || !nh) {
        state.panMaxX = 0;
        state.panMaxY = 0;
        resetPanPosition();
        applyPanToImage(lightboxCurrentImg);
        applyPanToImage(lightboxIncomingImg);
        updatePanAvailability();
        return;
      }

      var scale = Math.max(vw / nw, vh / nh);
      var renderedW = nw * scale;
      var renderedH = nh * scale;
      state.panMaxX = Math.max(0, (renderedW - vw) / 2);
      state.panMaxY = Math.max(0, (renderedH - vh) / 2);
      clampPan();
      applyPanToImage(lightboxCurrentImg);
      applyPanToImage(lightboxIncomingImg);
      updatePanAvailability();
    }

    function syncUI(direction, immediate) {
      syncStageSlides();
      caption.textContent = getImageDescription(state.images[state.index]);
      lightboxCaption.textContent = getLightboxCaptionLabel(state.index, state.images);

      syncLightboxImage(direction, immediate);
      for (var i = 0; i < galleryThumbButtons.length; i++) {
        galleryThumbButtons[i].classList.remove("is-active");
      }
      if (galleryThumbButtons[state.index]) {
        galleryThumbButtons[state.index].classList.add("is-active");
        var thumbEl = galleryThumbButtons[state.index];
        var thumbParent = thumbEl.parentElement;
        if (thumbParent) {
          var tLeft = thumbEl.offsetLeft - thumbParent.offsetLeft;
          var tRight = tLeft + thumbEl.offsetWidth;
          var pScroll = thumbParent.scrollLeft;
          var pWidth = thumbParent.clientWidth;
          if (tLeft < pScroll) {
            thumbParent.scrollTo({ left: tLeft, behavior: immediate ? "auto" : "smooth" });
          } else if (tRight > pScroll + pWidth) {
            thumbParent.scrollTo({ left: tRight - pWidth, behavior: immediate ? "auto" : "smooth" });
          }
        }
      }

      for (var j = 0; j < lightboxThumbButtons.length; j++) {
        lightboxThumbButtons[j].classList.remove("is-active");
      }
      if (lightboxThumbButtons[state.index]) {
        lightboxThumbButtons[state.index].classList.add("is-active");
        lightboxThumbButtons[state.index].scrollIntoView({
          behavior: immediate ? "auto" : "smooth",
          block: "nearest",
          inline: "center"
        });
      }

      preloadAround(state.images, state.index);
      fetchSocialData();
    }

    function showAt(index) {
      cancelStageSlide();
      cancelLightboxSlide();
      state.index = wrapIndex(index);
      syncUI(null, true);
    }

    function openLightbox() {
      state.lightboxOpen = true;
      lightbox.classList.add("is-open");
      document.body.classList.add("portfolio-lightbox-open");
      syncUI(null, true);
    }

    function isMobileTouchDevice() {
      var hasTouchPoints = (navigator.maxTouchPoints || 0) > 0;
      var hasTouchEvent = ("ontouchstart" in window);
      var coarsePointer = window.matchMedia
        ? window.matchMedia("(hover: none) and (pointer: coarse)").matches
        : false;
      var narrowViewport = window.innerWidth <= 1024;
      return hasTouchPoints || hasTouchEvent || coarsePointer || narrowViewport;
    }

    function closeLightbox() {
      state.lightboxOpen = false;
      cancelLightboxSlide();
      stopPanning();
      lightbox.classList.remove("is-open");
      document.body.classList.remove("portfolio-lightbox-open");
    }

    function slideStage(direction) {
      if (state.isStageSliding || state.images.length < 2) return;

      state.isStageSliding = true;
      stageTrack.style.transform = direction === "next" ? "translateX(-200%)" : "translateX(0%)";

      function finishSlide(e) {
        if (e && e.target !== stageTrack) return;
        stageTrack.removeEventListener("transitionend", finishSlide);
        pendingStageHandler = null;
        state.index = wrapIndex(state.index + (direction === "next" ? 1 : -1));
        state.isStageSliding = false;
        syncUI();
      }

      pendingStageHandler = finishSlide;
      stageTrack.addEventListener("transitionend", finishSlide);
    }

    function slideLightbox(direction) {
      if (!state.lightboxOpen) {
        slideStage(direction);
        return;
      }

      if (state.images.length < 2) return;
      state.isSliding = true;
      state.index = wrapIndex(state.index + (direction === "next" ? 1 : -1));
      syncUI(direction, false);
    }

    function nextImage() {
      slideLightbox("next");
    }

    function prevImage() {
      slideLightbox("prev");
    }

    function scrollThumbStrip(delta) {
      if (!lightboxThumbs) return;
      lightboxThumbs.scrollBy({
        left: delta,
        top: 0,
        behavior: "smooth"
      });
    }

    function scrollMainThumbStrip(delta) {
      if (!grid) return;
      grid.scrollBy({
        left: 0,
        top: delta,
        behavior: "smooth"
      });
    }

    function toggleFitMode() {
      state.lightboxFitMode = state.lightboxFitMode === "contain" ? "cover" : "contain";
      lightboxCurrentImg.style.objectFit = state.lightboxFitMode;
      lightboxIncomingImg.style.objectFit = state.lightboxFitMode;
      lightboxMode.textContent = state.lightboxFitMode === "contain" ? "Fill Frame" : "Fit to Screen";
      resetPanPosition();
      updatePanBoundsFromCurrentImage();
    }

    for (var i = 0; i < state.images.length; i++) {
      (function (idx) {
        var description = getImageDescription(state.images[idx]);
        var thumbLabel = description
          ? "Show image " + (idx + 1) + ": " + description
          : "Show image " + (idx + 1);
        var btn = createEl("button", "portfolio-gallery-thumb");
        btn.type = "button";
        btn.setAttribute("aria-label", thumbLabel);
        applyThumbPulseTiming(btn);

        var thumbImg = createEl("img", "portfolio-gallery-thumb-image");
        thumbImg.src = createThumbUrl(state.images[idx]);
        thumbImg.alt = description || "Thumbnail " + (idx + 1);
        thumbImg.loading = "lazy";
        thumbImg.decoding = "async";
        thumbImg.addEventListener("error", function () {
          thumbImg.src = state.images[idx];
        });

        btn.appendChild(thumbImg);
        btn.addEventListener("click", function () {
          showAt(idx);
        });

        galleryThumbButtons.push(btn);
        grid.appendChild(btn);

        var lightboxBtn = createEl("button", "portfolio-lightbox-thumb");
        lightboxBtn.type = "button";
        lightboxBtn.setAttribute("aria-label", thumbLabel + " in viewer");

        var lightboxThumbImg = createEl("img", "portfolio-lightbox-thumb-image");
        lightboxThumbImg.src = createThumbUrl(state.images[idx]);
        lightboxThumbImg.alt = description || "Viewer thumbnail " + (idx + 1);
        lightboxThumbImg.loading = "lazy";
        lightboxThumbImg.decoding = "async";
        lightboxThumbImg.addEventListener("error", function () {
          lightboxThumbImg.src = state.images[idx];
        });

        lightboxBtn.appendChild(lightboxThumbImg);
        lightboxBtn.addEventListener("click", function () {
          showAt(idx);
        });

        lightboxThumbButtons.push(lightboxBtn);
        lightboxThumbs.appendChild(lightboxBtn);
      })(i);
    }

    // --- Social interaction logic ---
    var socialCache = {};

    function getSocialKey() {
      var dir = window.location.pathname.replace(/\/[^\/]*$/, "");
      return dir + "/" + state.images[state.index];
    }

    function socialTimeAgo(dateStr) {
      var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diff < 60) return "now";
      if (diff < 3600) return Math.floor(diff / 60) + "m";
      if (diff < 86400) return Math.floor(diff / 3600) + "h";
      if (diff < 604800) return Math.floor(diff / 86400) + "d";
      return Math.floor(diff / 604800) + "w";
    }

    function updateSocialUI(data) {
      var key = getSocialKey();
      var likes = (data && data.likes) || 0;
      var comments = (data && data.comments) || [];
      var liked = likes > 0;

      heartBtn.classList.toggle("is-liked", liked);
      lbHeartBtn.classList.toggle("is-liked", liked);

      if (likes > 0) {
        var likeText = likes + (likes === 1 ? " like" : " likes");
        socialLikeCount.textContent = likeText;
        socialLikeCount.style.visibility = "";
        lbLikeCount.textContent = likeText;
        lbLikeCount.style.visibility = "";
      } else {
        socialLikeCount.textContent = "";
        socialLikeCount.style.visibility = "hidden";
        lbLikeCount.textContent = "";
        lbLikeCount.style.visibility = "hidden";
      }

      if (comments.length > 0) {
        var commentText = "View " + comments.length + " comment" + (comments.length === 1 ? "" : "s");
        socialCommentLink.textContent = commentText;
        lbCommentLink.textContent = commentText;
      } else {
        socialCommentLink.textContent = "Add a comment...";
        lbCommentLink.textContent = "Add a comment...";
      }
    }

    // Preview reactions stay in this tab and clear on navigation.
    function currentReactions() {
      var key = getSocialKey();
      if (!socialCache[key]) socialCache[key] = { likes: 0, comments: [] };
      return socialCache[key];
    }

    function fetchSocialData() {
      updateSocialUI(currentReactions());
    }

    function renderCommentList() {
      commentList.innerHTML = "";
      var key = getSocialKey();
      var data = socialCache[key];
      var comments = (data && data.comments) || [];

      if (!comments.length) {
        commentList.appendChild(commentEmpty);
        return;
      }

      for (var i = 0; i < comments.length; i++) {
        var c = comments[i];
        var item = createEl("div", "portfolio-comment-item");
        var nameEl = createEl("span", "portfolio-comment-item-name");
        nameEl.textContent = c.name + ", ";
        nameEl.style.color = "#999";
        if (c.name === "Guest") nameEl.classList.add("is-guest");
        var textEl = createEl("span", "portfolio-comment-item-text");
        textEl.textContent = " " + c.text;
        var timeEl = createEl("span", "portfolio-comment-item-time");
        timeEl.textContent = socialTimeAgo(c.date);
        item.appendChild(nameEl);
        item.appendChild(textEl);
        item.appendChild(timeEl);
        commentList.appendChild(item);
      }

      commentList.scrollTop = commentList.scrollHeight;
    }

    function isMobileLandscape() {
      return window.matchMedia("(max-width: 820px) and (orientation: landscape)").matches;
    }

    function openCommentPanel() {
      renderCommentList();
      if (state.lightboxOpen) {
        lightboxStageWrap.appendChild(commentOverlay);
        commentOverlay.classList.add("is-lightbox");
      } else if (isMobileLandscape()) {
        stage.appendChild(commentOverlay);
        commentOverlay.classList.add("is-landscape");
      } else {
        gridWrap.appendChild(commentOverlay);
        commentOverlay.classList.remove("is-lightbox");
        commentOverlay.classList.remove("is-landscape");
      }
      commentOverlay.classList.add("is-open");
      commentTextInput.focus();
    }

    function closeCommentPanel() {
      commentOverlay.classList.remove("is-open");
      commentOverlay.classList.remove("is-lightbox");
      commentOverlay.classList.remove("is-landscape");
      gridWrap.appendChild(commentOverlay);
    }

    // Heart button (shared handler for both gallery and lightbox)
    function handleHeartClick() {
      var data = currentReactions();
      data.likes = data.likes ? 0 : 1;
      updateSocialUI(data);
    }

    heartBtn.addEventListener("click", handleHeartClick);
    lbHeartBtn.addEventListener("click", handleHeartClick);

    // Open comment panel from icon or link
    commentBtn.addEventListener("click", openCommentPanel);
    lbCommentBtn.addEventListener("click", openCommentPanel);
    lbCommentLink.addEventListener("click", openCommentPanel);
    socialCommentLink.addEventListener("click", openCommentPanel);

    // Close comment panel
    commentCloseBtn.addEventListener("click", closeCommentPanel);
    commentOverlay.addEventListener("click", function (e) {
      if (e.target === commentOverlay) closeCommentPanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && commentOverlay.classList.contains("is-open")) {
        closeCommentPanel();
      }
    });

    // Post comment
    commentPostBtn.addEventListener("click", function () {
      var text = commentTextInput.value.trim();
      if (!text) return;
      var data = currentReactions();
      data.comments.push({ name: commentNameInput.value.trim() || "Guest", text: text, date: new Date().toISOString() });
      commentTextInput.value = "";
      renderCommentList();
      updateSocialUI(data);
    });

    // Allow Enter key to post from comment text input
    commentTextInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        commentPostBtn.click();
      }
    });

    stage.addEventListener("click", function () {
      if (state.isStageSliding) {
        return;
      }

      if (isMobileTouchDevice()) {
        return;
      }

      openLightbox();
    });

    stage.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isMobileTouchDevice()) openLightbox();
      }
    });

    btnClose.addEventListener("click", closeLightbox);
    btnPrev.addEventListener("click", prevImage);
    btnNext.addEventListener("click", nextImage);
    lightboxMode.addEventListener("click", toggleFitMode);
    lightboxMode.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFitMode();
      }
    });

    // Click on the image itself toggles fill/fit, same as the Fill Frame button
    // (suppressed if the click followed a drag/pan gesture)
    lightboxViewport.addEventListener("click", function (e) {
      if (state.suppressNextClick) {
        state.suppressNextClick = false;
        return;
      }
      if (e.target === lightboxCurrentImg || e.target === lightboxIncomingImg || e.target === lightboxViewport) {
        toggleFitMode();
      }
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    stageViewport.addEventListener("mouseenter", function () {
      state.stageHovered = true;
    });
    stageViewport.addEventListener("mouseleave", function () {
      state.stageHovered = false;
    });
    grid.addEventListener("mouseenter", function () {
      state.gridHovered = true;
    });
    grid.addEventListener("mouseleave", function () {
      state.gridHovered = false;
    });
    grid.addEventListener("wheel", function (e) {
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      scrollMainThumbStrip(delta);
    }, { passive: false });
    stageViewport.addEventListener("wheel", function (e) {
      if (state.lightboxOpen) return;
      e.preventDefault();
      if (state.stageWheelLocked) return;
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      state.stageWheelLocked = true;
      if (delta > 0) nextImage();
      else prevImage();
      setTimeout(function () {
        state.stageWheelLocked = false;
      }, 340);
    }, { passive: false });

    lightboxThumbs.addEventListener("mouseenter", function () {
      state.thumbsHovered = true;
    });
    lightboxThumbs.addEventListener("mouseleave", function () {
      state.thumbsHovered = false;
    });
    lightboxThumbs.addEventListener("wheel", function (e) {
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      scrollThumbStrip(delta);
    }, { passive: false });
    lightboxViewport.addEventListener("wheel", function (e) {
      if (!state.lightboxOpen || state.wheelNavLocked) return;
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      state.wheelNavLocked = true;
      if (delta > 0) nextImage();
      else prevImage();
      setTimeout(function () {
        state.wheelNavLocked = false;
      }, 160);
    }, { passive: false });

    lightboxViewport.addEventListener("mousedown", function (e) {
      if (!state.lightboxOpen || state.lightboxFitMode !== "cover") return;
      if (e.button !== 0) return;
      if (state.panMaxX <= 0 && state.panMaxY <= 0) return;
      state.isPanning = true;
      state.panStartClientX = e.clientX;
      state.panStartClientY = e.clientY;
      state.panStartX = state.panX;
      state.panStartY = state.panY;
      lightboxViewport.classList.add("is-panning");
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!state.isPanning) return;
      var dx = e.clientX - state.panStartClientX;
      var dy = e.clientY - state.panStartClientY;
      state.panX = state.panStartX + dx;
      state.panY = state.panStartY + dy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        state.suppressNextClick = true;
      }
      clampPan();
      applyPanToImage(lightboxCurrentImg);
      applyPanToImage(lightboxIncomingImg);
    });

    document.addEventListener("mouseup", function () {
      if (!state.isPanning) return;
      stopPanning();
    });

    window.addEventListener("resize", function () {
      if (!state.lightboxOpen) return;
      updatePanBoundsFromCurrentImage();
    });

    document.addEventListener("keydown", function (e) {
      if (!state.lightboxOpen) {
        if (e.key === "ArrowRight") {
          if (state.gridHovered) {
            e.preventDefault();
            scrollMainThumbStrip(160);
          } else if (state.stageHovered) {
            e.preventDefault();
            nextImage();
          }
        }
        if (e.key === "ArrowLeft") {
          if (state.gridHovered) {
            e.preventDefault();
            scrollMainThumbStrip(-160);
          } else if (state.stageHovered) {
            e.preventDefault();
            prevImage();
          }
        }
        return;
      }
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        if (state.thumbsHovered) {
          e.preventDefault();
          scrollThumbStrip(160);
        } else {
          nextImage();
        }
      }
      if (e.key === "ArrowLeft") {
        if (state.thumbsHovered) {
          e.preventDefault();
          scrollThumbStrip(-160);
        } else {
          prevImage();
        }
      }
    });

    // Modified stage swipe: skip when zoomed
    (function () {
      var sx = 0, sy = 0;
      stageViewport.addEventListener("touchstart", function (e) {
        if (!e.touches || !e.touches.length) return;
        sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      }, { passive: true });
      stageViewport.addEventListener("touchend", function (e) {
        if (stageViewport._pzScale > 1) return;
        if (window.visualViewport && window.visualViewport.scale > 1.05) return;
        if (!e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) nextImage(); else prevImage();
      }, { passive: true });
    })();
    attachSwipe(lightboxViewport, nextImage, prevImage);

    // --- Pinch-to-zoom on main stage (mobile) ---
    (function () {
      var zs = 1, zx = 0, zy = 0;
      var pDist = 0, pScale = 1, pinching = false, wasPinch = false;
      var tpx = 0, tpy = 0, tpzx = 0, tpzy = 0, tpan = false;
      function td(a, b) { var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY; return Math.sqrt(dx*dx+dy*dy); }
      function apply() {
        if (zs <= 1) { zs = 1; zx = 0; zy = 0; }
        stageViewport._pzScale = zs;
        stageCurrImg.style.transform = zs > 1 ? "scale("+zs+") translate("+(zx/zs)+"px,"+(zy/zs)+"px)" : "";
        stageCurrImg.style.transformOrigin = "center center";
      }
      function reset() {
        zs = 1; zx = 0; zy = 0; pinching = false; wasPinch = false; tpan = false;
        stageViewport._pzScale = 1;
        stageCurrImg.style.transform = "";
        stageCurrImg.style.transformOrigin = "";
        stageViewport.style.touchAction = "";
      }
      stageViewport._pzScale = 1;

      stageViewport.addEventListener("touchstart", function (e) {
        if (state.lightboxOpen) return;
        if (e.touches.length === 2) {
          pinching = true; wasPinch = true; tpan = false;
          pDist = td(e.touches[0], e.touches[1]); pScale = zs;
          stageViewport.style.touchAction = "none";
          e.preventDefault();
        } else if (e.touches.length === 1 && zs > 1) {
          tpan = true;
          tpx = e.touches[0].clientX; tpy = e.touches[0].clientY;
          tpzx = zx; tpzy = zy;
          e.preventDefault();
        }
      }, { passive: false });

      stageViewport.addEventListener("touchmove", function (e) {
        if (state.lightboxOpen) return;
        if (pinching && e.touches.length === 2) {
          zs = Math.min(5, Math.max(1, pScale * (td(e.touches[0], e.touches[1]) / pDist)));
          apply(); e.preventDefault();
        } else if (tpan && e.touches.length === 1 && zs > 1) {
          zx = tpzx + (e.touches[0].clientX - tpx);
          zy = tpzy + (e.touches[0].clientY - tpy);
          apply(); e.preventDefault();
        }
      }, { passive: false });

      stageViewport.addEventListener("touchend", function (e) {
        if (pinching && e.touches.length < 2) {
          pinching = false;
          if (zs <= 1.05) reset();
        }
        if (tpan && e.touches.length === 0) tpan = false;
      }, { passive: true });

      // Double-tap to zoom/unzoom
      var lastTap = 0;
      stageViewport.addEventListener("touchend", function (e) {
        if (state.lightboxOpen || e.touches.length > 0 || wasPinch) { wasPinch = false; return; }
        var now = Date.now();
        if (now - lastTap < 300) {
          if (zs > 1) reset(); else { zs = 2.5; stageViewport.style.touchAction = "none"; apply(); }
          e.preventDefault(); lastTap = 0;
        } else { lastTap = now; }
      }, { passive: false });

      // Reset on orientation change
      window.addEventListener("orientationchange", reset);

      // Reset when navigating
      var _showAt = showAt;
      showAt = function (i) {
        reset(); _showAt(i);
        if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
          stage.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    })();
    // --- End pinch-to-zoom ---

    var requestedImageState = getRequestedImageState(state.images);

    if (requestedImageState) {
      showAt(requestedImageState.index);
      if (requestedImageState.openLightbox) {
        openLightbox();
      }
    } else {
      showAt(0);
    }

    container.appendChild(wrap);
  }

  function initPortfolioGallery() {
    var container = document.getElementById("ContainerPortfolio");
    if (!container) return;

    getImageList()
      .then(function (images) {
        if (!images.length) {
          renderError(container, "Portfolio images are currently unavailable.");
          return;
        }
        renderGallery(container, images);
      })
      .catch(function () {
        renderError(container, "Unable to load portfolio gallery.");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortfolioGallery);
  } else {
    initPortfolioGallery();
  }
})();
