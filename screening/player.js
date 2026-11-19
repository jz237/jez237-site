const film = document.querySelector('video');
const play = document.getElementById('start-film');
const message = document.getElementById('play-status');
let bufferedURL;
let loadingCopy = false;
let requested = false;
const hlsUrl = film.dataset.hls;
const scriptedStream = hlsUrl && window.Hls?.isSupported();
const compatible = !hlsUrl || scriptedStream || film.canPlayType('application/vnd.apple.mpegurl');
if (scriptedStream) {
  const player = new window.Hls({enableWorker:false, maxBufferLength:24, backBufferLength:12});
  player.loadSource(hlsUrl);
  player.attachMedia(film);
  player.on(window.Hls.Events.ERROR, (_event, data) => {
    if (data.fatal) {
      play.hidden = false;
      status('Reload this screening link to reconnect.');
    }
  });
  window.addEventListener('pagehide', event => { if (!event.persisted) player.destroy(); });
}

function status(text) {
  message.textContent = text;
  message.hidden = !text;
}
function start() {
  film.play().catch(error => {
    if (error.name === 'AbortError') return;
    if (error.name === 'NotAllowedError') {
      play.hidden = false;
      status('The film is ready. Tap Play.');
    } else if (!bufferedURL) {
      bufferedCopy();
    } else {
      play.hidden = false;
      status('Tap Open video below to use your phone’s video player.');
    }
  });
}
async function bufferedCopy() {
  if (hlsUrl) {
    if (requested && film.error) status('Reload this screening link to reconnect.');
    return;
  }
  if (loadingCopy || bufferedURL) return;
  loadingCopy = true;
  if (requested) status('Loading the film…');
  try {
    // Some native media stacks use a separate network session. A first-party fetch
    // carries the screening cookie and hands this short movie to the same controls.
    const response = await fetch(film.querySelector('source').src, {credentials:'same-origin', cache:'no-store'});
    if (!response.ok || response.headers.get('Content-Type') !== 'video/mp4') throw new Error('Unavailable');
    const file = await response.blob();
    bufferedURL = URL.createObjectURL(file);
    film.src = bufferedURL;
    film.load();
    status('');
    if (requested) start();
  } catch {
    play.hidden = false;
    status('Check your connection, then tap Play to try again.');
  } finally {
    loadingCopy = false;
  }
}

play.hidden = !compatible;
if (!compatible) status('Open the screening link in Safari or Chrome to play this film.');
play.addEventListener('click', () => {
  requested = true;
  status('');
  if (film.ended) film.currentTime = 0;
  start();
  if (!hlsUrl && !bufferedURL) setTimeout(() => { if (requested && film.readyState < 1) bufferedCopy(); }, 5500);
});
for (const cue of document.querySelectorAll('[data-jump]')) {
  cue.addEventListener('click', () => {
    requested = true;
    const jump = () => { film.currentTime = Number(cue.dataset.jump); };
    if (film.readyState) jump();
    else film.addEventListener('loadedmetadata',jump,{once:true});
    start();
  });
}
film.querySelector('source').addEventListener('error', bufferedCopy);
film.addEventListener('error', () => { if (!bufferedURL) bufferedCopy(); });
film.addEventListener('playing', () => { play.hidden = true; status(''); });
film.addEventListener('ended', () => {
  requested = false;
  play.setAttribute('aria-label', 'Replay film');
  play.hidden = false;
});
window.addEventListener('pagehide', event => {
  if (!event.persisted && bufferedURL) URL.revokeObjectURL(bufferedURL);
});
