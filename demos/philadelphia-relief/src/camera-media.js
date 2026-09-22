// One media session per open card. Closing the card cancels both pending loads and playback.
let hlsModule;
const loadHls = () => hlsModule ||= import('https://cdn.jsdelivr.net/npm/hls.js@1.7.3/dist/hls.mjs')
  .catch(error => { hlsModule = undefined; throw error; });

export function mountCameraMedia(host, item, {
  onStatus = () => {}, controls = false, loadRuntime = loadHls,
} = {}) {
  let disposed = false, failed = false, player, frame, video, image, timer, refresh, limit;
  const status = message => { if (!disposed) onStatus(message); };
  const ready = message => { if (failed) return; clearTimeout(timer); status(message); };
  const stopVideo = () => {
    player?.destroy(); player = undefined;
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
  };
  const fail = () => {
    if (disposed || failed) return;
    failed = true;
    clearTimeout(timer); clearTimeout(limit); clearInterval(refresh); stopVideo();
    status('Preview unavailable from the provider. Retry or open the camera page.');
  };
  status(item.stream ? 'Connecting to DelDOT video…' : 'Loading provider image…');
  timer = setTimeout(fail, 18000);
  if (item.snapshot) {
    image = document.createElement('img'); image.alt = `${item.name} · provider snapshot`;
    image.referrerPolicy = 'strict-origin-when-cross-origin';
    image.onload = () => ready(item.previewNote
      || 'Provider snapshot · capture time not supplied; it may be delayed.');
    image.onerror = fail; image.src = item.snapshot; host.append(image);
    // Provider owns the snapshot cadence. Never present the fetch time as its capture time.
    if (item.previewKind !== 'thumbnail') refresh = setInterval(() => { image.src = item.snapshot; }, 60000);
  } else if (item.preview) {
    frame = document.createElement('iframe'); frame.title = `${item.name} · provider image`;
    frame.tabIndex = -1; frame.setAttribute('aria-hidden', 'true'); frame.setAttribute('sandbox', '');
    frame.referrerPolicy = 'strict-origin-when-cross-origin'; frame.src = item.preview;
    frame.style.transform = `scale(${host.clientWidth / 656})`;
    frame.onload = () => ready('Latest provider image · may be delayed. Open the viewer if blank.');
    host.append(frame); refresh = setInterval(() => { frame.src = item.preview; }, 60000);
  } else if (item.stream) {
    video = document.createElement('video'); video.muted = true; video.playsInline = true;
    video.controls = controls; video.setAttribute('aria-label', `${item.name} · DelDOT video`);
    video.addEventListener('playing', () => ready('DelDOT video · near-live, subject to provider delay.'));
    video.addEventListener('error', fail); host.append(video);
    const play = () => video.play().catch(() => {
      if (disposed) return;
      video.controls = true; ready('Press Play to start the camera video.');
    });
    const connect = async () => {
      try {
        const { default: Hls } = await loadRuntime();
        if (disposed || failed) return;
        if (Hls.isSupported()) {
          player = new Hls({ maxBufferLength: 10, backBufferLength: 0, capLevelToPlayerSize: true });
          player.on(Hls.Events.MANIFEST_PARSED, play);
          player.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) { console.warn('Camera preview:', data.details); fail(); }
          });
          player.loadSource(item.stream); player.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = item.stream; play();
        } else fail();
      } catch (error) {
        if (!disposed) { console.warn('Camera preview:', error.message); fail(); }
      }
    };
    void connect();
    // Match DelDOT's short viewing sessions; avoid an unattended stream running indefinitely.
    limit = setTimeout(() => {
      stopVideo(); clearTimeout(timer); status('Preview paused after one minute. Retry to watch again.');
    }, 60000);
  } else { clearTimeout(timer); status('Open the provider page to view this camera.'); }
  return () => {
    disposed = true; clearTimeout(timer); clearTimeout(limit); clearInterval(refresh);
    if (image) { image.onload = image.onerror = null; image.removeAttribute('src'); }
    if (frame) { frame.onload = null; frame.removeAttribute('src'); }
    if (video) video.removeEventListener('error', fail);
    stopVideo(); host.replaceChildren();
  };
}

// Explicit playback only; one bounded iframe session, also disposed on close/tab hide.
export function mountCameraPlayer(host, item, { onExpired = () => {} } = {}) {
  const frame = document.createElement('iframe'); frame.className = 'camera-provider-player';
  frame.title = `${item.name} · ${item.provider} player`; frame.src = item.player;
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
  frame.allow = 'autoplay; fullscreen; picture-in-picture'; frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin'; host.replaceChildren(frame);
  let disposed = false;
  const timer = setTimeout(() => { if (!disposed) { host.replaceChildren(); onExpired(); } }, 60000);
  return () => { disposed = true; clearTimeout(timer); host.replaceChildren(); };
}
