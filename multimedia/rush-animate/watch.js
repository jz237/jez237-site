const film = document.getElementById('film');
const cues = Array.from(document.querySelectorAll('#cues a'), link => ({
  link, start: Number(link.hash.slice(3)), end: Number(link.dataset.end),
}));
const slow = document.getElementById('slow');
const loop = document.getElementById('loop');
let selected;
let repeating = false;

function select(cue) {
  selected = cue;
  for (const item of cues) {
    if (item === cue) item.link.setAttribute('aria-current', 'true');
    else item.link.removeAttribute('aria-current');
  }
}
function jump(seconds, play) {
  if (!film.readyState) {
    film.addEventListener('loadedmetadata', () => jump(seconds, play), { once: true });
    return;
  }
  film.currentTime = Math.min(seconds, film.duration);
  if (play) film.play().catch(() => {});
}
function followFragment() {
  const match = /^#t=(\d+(?:\.\d+)?)$/.exec(location.hash);
  if (!match) return;
  const t = Number(match[1]);
  select(cues.find(c => t >= c.start && t < c.end));
  jump(t, false);
}
for (const cue of cues) {
  cue.link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(cue);
    history.replaceState(null, '', cue.link.hash);
    jump(cue.start, true);
  });
}
slow.addEventListener('click', () => { film.playbackRate = film.playbackRate === .5 ? 1 : .5; });
film.addEventListener('ratechange', () => slow.setAttribute('aria-pressed', String(film.playbackRate === .5)));
loop.addEventListener('click', () => {
  repeating = !repeating;
  loop.setAttribute('aria-pressed', String(repeating));
  if (repeating) {
    if (!selected) select(cues.find(c => film.currentTime >= c.start && film.currentTime < c.end) ||
      cues.find(c => c.start >= film.currentTime) || cues[cues.length - 1]);
    jump(selected.start, true);
  }
});
film.addEventListener('timeupdate', () => {
  if (repeating && selected && !film.seeking && !film.paused && film.currentTime >= selected.end) jump(selected.start, true);
});
film.addEventListener('error', () => { document.getElementById('play-error').hidden = false; });
film.querySelector('source').addEventListener('error', () => { document.getElementById('play-error').hidden = false; });
window.addEventListener('hashchange', followFragment);
followFragment();
