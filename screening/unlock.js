const statusLine = document.getElementById('status');
const retry = document.getElementById('retry');
const base = '/screening/01/';

async function unlock() {
  retry.hidden = true;
  const ticket = location.hash.slice(1);
  if (!/^[A-Za-z0-9_-]{43}$/.test(ticket)) {
    statusLine.textContent = 'Open the complete private link you received to watch this film.';
    return;
  }
  statusLine.textContent = 'Opening your film…';
  try {
    const access = await fetch(base + 'unlock', {
      method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { Authorization: 'Bearer ' + ticket },
    });
    if (access.status === 403) {
      statusLine.textContent = 'This link cannot open the screening. Use the complete link you received.';
      return;
    }
    if (!access.ok) throw new Error('Checking access');
    const session = await fetch(base + 'film.mp4', {method: 'HEAD', credentials: 'same-origin', cache: 'no-store'});
    if (session.status === 404) {
      statusLine.textContent = 'Allow cookies for jez237.com, then tap Try again.';
      retry.hidden = false;
      return;
    }
    if (!session.ok) throw new Error('Checking the video');
    location.reload();
  } catch {
    statusLine.textContent = 'The film could not open. Check your connection and try again.';
    retry.hidden = false;
  }
}
retry.addEventListener('click', unlock);
unlock();
