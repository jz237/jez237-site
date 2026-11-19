const film = document.querySelector('video');
const play = document.getElementById('start-film');
const message = document.getElementById('play-status');
let bufferedURL;
let loadingCopy = false;
let requested = false;
const longFilm = film.dataset.stream === 'long';

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
  if (longFilm) {
    if (requested) status('Tap Open video below to use your phone’s video player.');
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

play.hidden = false;
play.addEventListener('click', () => {
  requested = true;
  status('');
  if (film.ended) film.currentTime = 0;
  start();
  if (!longFilm && !bufferedURL) setTimeout(() => { if (requested && film.readyState < 1) bufferedCopy(); }, 5500);
});
for (const cue of document.querySelectorAll('[data-jump]')) {
  cue.addEventListener('click', () => {
    requested = true;
    film.currentTime = Number(cue.dataset.jump);
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
