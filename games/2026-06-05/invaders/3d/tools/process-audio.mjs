// Trim, normalise and encode the raw ElevenLabs set for the 3D edition.
// usage: node process-audio.mjs <rawDir> <outDir>
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [raw, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const tmp = path.join(raw, '_tmp');
fs.mkdirSync(tmp, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
function maxVolume(f) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume:\s*(-?[\d.]+) dB/.exec(r.stderr || '');
  return m ? +m[1] : 0;
}

const MUSIC = { musicMenu: 'music-menu', musicGame: 'music-game', musicBoss: 'music-boss' };
const SFX_NAMES = {
  shoot: 'sfx-shoot', laser: 'sfx-laser', spread: 'sfx-spread', shatter: 'sfx-shatter', shatterBig: 'sfx-shatter-big',
  hit: 'sfx-hit', bunker: 'sfx-bunker', hurt: 'sfx-hurt', lifeLost: 'sfx-life-lost', powerup: 'sfx-powerup', bomb: 'sfx-bomb',
  overdrive: 'sfx-overdrive', warning: 'sfx-warning', beam: 'sfx-beam', bossArrive: 'sfx-boss-arrive', turretDown: 'sfx-turret-down',
  bossDown: 'sfx-boss-down', dive: 'sfx-dive', wave: 'sfx-wave', perfect: 'sfx-perfect', select: 'sfx-select', gameover: 'sfx-gameover',
  extralife: 'sfx-extralife', march: 'sfx-march', bossShot: 'sfx-boss-shot', enemyShot: 'sfx-enemy-shot'
};

for (const [src, dst] of Object.entries(SFX_NAMES)) {
  const inFile = path.join(raw, src + '.mp3');
  const trimmed = path.join(tmp, src + '.wav');
  ff(['-i', inFile, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.004,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.02,areverse', '-ac', '1', '-ar', '44100', trimmed]);
  const gain = -1 - maxVolume(trimmed);
  const d = dur(trimmed);
  const fade = Math.min(0.04, d * 0.2);
  ff(['-i', trimmed, '-af', `volume=${gain.toFixed(2)}dB,afade=t=out:st=${Math.max(0, d - fade).toFixed(3)}:d=${fade.toFixed(3)}`, '-ac', '1', '-ar', '44100', '-b:a', '96k', path.join(out, dst + '.mp3')]);
  console.log(dst, d.toFixed(2) + 's', 'gain', gain.toFixed(1));
}

for (const [src, dst] of Object.entries(MUSIC)) {
  const inFile = path.join(raw, src + '.mp3');
  const trimmed = path.join(tmp, src + '.wav');
  ff(['-i', inFile, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01,areverse', '-ar', '44100', trimmed]);
  const L = dur(trimmed) - 1.0; // drop the closing second, which is usually a fade
  const N = 3;
  const loop = path.join(tmp, src + '-loop.wav');
  const graph = [
    `[0]atrim=0:${N},asetpts=PTS-STARTPTS,afade=t=in:d=${N}:curve=qsin[head]`,
    `[0]atrim=${N}:${(L - N).toFixed(3)},asetpts=PTS-STARTPTS[body]`,
    `[0]atrim=${(L - N).toFixed(3)}:${L.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=out:d=${N}:curve=qsin[tail]`,
    `[tail][head]amix=inputs=2:normalize=0[seam]`,
    `[body][seam]concat=n=2:v=0:a=1[out]`
  ].join(';');
  ff(['-i', trimmed, '-filter_complex', graph, '-map', '[out]', loop]);
  ff(['-i', loop, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '2', '-b:a', '128k', path.join(out, dst + '.mp3')]);
  console.log(dst, dur(path.join(out, dst + '.mp3')).toFixed(2) + 's loop');
}
fs.rmSync(tmp, { recursive: true, force: true });
