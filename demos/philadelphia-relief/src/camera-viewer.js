import { regionalCameras } from './camera-data.js?v=philly-2026092114';
import { mountCameraMedia } from './camera-media.js?v=philly-2026092114';

const host = document.getElementById('cameraMedia');
const status = document.getElementById('cameraStatus');
const retry = document.getElementById('cameraRetry');
const full = document.getElementById('cameraFull');
let camera, cleanup;
function stop() { cleanup?.(); cleanup = undefined; }
function play() {
  stop();
  if (!camera?.stream || document.hidden) return;
  cleanup = mountCameraMedia(host, camera, { controls: true,
    onStatus: text => { status.textContent = text; } });
}
retry.onclick = play;
full.onclick = () => {
  const video = host.querySelector('video');
  if (video?.requestFullscreen) void video.requestFullscreen().catch(() => {});
  else video?.webkitEnterFullscreen?.();
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stop(); status.textContent = 'Paused while away. Press Play to reconnect.'; }
});
window.addEventListener('pagehide', stop);
try {
  const response = await fetch('data/regional-cameras.json?v=20260920-1');
  if (!response.ok) throw new Error('Camera catalog unavailable');
  const id = new URL(location.href).searchParams.get('id');
  camera = regionalCameras(await response.json()).find(p => p.id === id);
  if (!camera?.stream) throw new Error('This camera is unavailable or is not in the regional catalog.');
  document.getElementById('cameraTitle').textContent = camera.name;
  document.title = `${camera.name} · Philadelphia Relief`;
  document.getElementById('cameraSource').textContent = `${camera.provider} · ${camera.location}`;
  document.getElementById('cameraProvider').href = camera.providerUrl;
  retry.disabled = false; full.disabled = false; play();
} catch (error) {
  document.getElementById('cameraTitle').textContent = 'Camera unavailable';
  status.textContent = `${error.message} Return to the map to choose another view.`;
}
