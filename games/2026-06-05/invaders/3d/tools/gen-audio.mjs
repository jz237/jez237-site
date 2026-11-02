// ElevenLabs generator for the Invaders 3D Edition sound set.
// usage: node gen-audio.mjs <outDir> [name ...]   (key from ELEVENLABS_API_KEY; never printed)
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY || '';
if (!KEY.startsWith('sk_')) { console.error('ELEVENLABS_API_KEY missing or wrong shape'); process.exit(1); }
const out = process.argv[2];
const only = new Set(process.argv.slice(3));
fs.mkdirSync(out, { recursive: true });

const STYLE = 'clean modern sci-fi arcade game sound effect, punchy, no music, no voice';
const SFX = {
  shoot:        [0.6, 'single short punchy plasma blaster shot from a small fighter ship, bright zap with a tight low thump, ' + STYLE],
  laser:        [0.6, 'twin laser beam fire, crisp high electric zing with fast decay, ' + STYLE],
  spread:       [0.7, 'five-way spread cannon volley, wide stereo burst of plasma bolts with a chunky whoomp, ' + STYLE],
  shatter:      [0.9, 'small alien robot made of glowing glass cubes shatters into pieces, crystalline crunch, tinkling debris, short sharp pop, ' + STYLE],
  shatterBig:   [1.4, 'diving alien fighter blown apart mid-air, glassy voxel shatter with a deep boom and sparkling debris raining down, ' + STYLE],
  hit:          [0.5, 'tiny metallic armor ping, bullet deflecting off an alien hull, very short, ' + STYLE],
  bunker:       [0.8, 'energy shield brick cracking and crumbling, gritty stone crunch with an electric fizz, ' + STYLE],
  hurt:         [0.8, 'player starship force field takes a hit, electric shield impact with a warbling buzz and a low thud, ' + STYLE],
  lifeLost:     [2.0, 'player starship destroyed, heavy explosion with a descending power-down whine and metallic debris, ' + STYLE],
  powerup:      [1.0, 'power-up collected, rising shimmering synth chime with sparkle, positive and bright, ' + STYLE],
  bomb:         [2.2, 'smart bomb detonation, huge sub-bass shockwave boom expanding outward with a bright whoosh and crackling energy, ' + STYLE],
  overdrive:    [1.4, 'weapon overdrive engaged, rising turbine power surge into an electric roar, ' + STYLE],
  warning:      [1.0, 'alien warship charging a beam cannon, rising ominous electric hum building tension, ' + STYLE],
  beam:         [1.0, 'massive red energy beam fires downward, searing plasma blast with a heavy crackle, ' + STYLE],
  bossArrive:   [3.0, 'colossal alien capital ship warps in, deep ominous horn blast with a rumbling sub-bass and metallic groan, ' + STYLE],
  turretDown:   [1.2, 'armored gun turret on a warship explodes, sharp metallic blast with sparks and a bassy pop, ' + STYLE],
  bossDown:     [3.5, 'giant alien warship explodes in a chain of blasts ending in a huge cinematic boom with long rumble tail, ' + STYLE],
  dive:         [1.2, 'alien fighter screeching into a dive attack, doppler whoosh with a shrill alien shriek, ' + STYLE],
  wave:         [1.4, 'new attack wave incoming, bright synth stinger with a rising arpeggio, ' + STYLE],
  perfect:      [1.6, 'perfect round bonus, triumphant sparkling synth fanfare, short, ' + STYLE],
  select:       [0.5, 'futuristic menu confirm click, soft bright blip, ' + STYLE],
  gameover:     [2.8, 'game over, slow descending synth tones with a fading low drone, sad but cool, ' + STYLE],
  extralife:    [1.2, 'smart bomb gained, bright double chime with a soft bass pulse, ' + STYLE],
  march:        [0.5, 'single deep low synth bass thump, like a giant alien footstep, short and dry, ' + STYLE],
  bossShot:     [0.7, 'alien warship heavy cannon shot, low growling plasma blast, ' + STYLE],
  enemyShot:    [0.5, 'small alien drops a sizzling plasma bomb, short downward zap, ' + STYLE]
};
const MUSIC = {
  musicMenu: [60000, 'Instrumental synthwave title theme for a 3D neon space invaders arcade game. Slow 95 bpm, lush analog pads, shimmering arpeggios, deep warm bass, gated reverb drums entering softly, mysterious and cinematic, steady loopable groove, no vocals.'],
  musicGame: [75000, 'Instrumental driving darksynth battle track for a 3D neon space shooter arcade game. 128 bpm, pulsing sequenced bass, punchy drums, bright lead synth hooks, rising energy, relentless and heroic, steady loopable groove with no ending, no vocals.'],
  musicBoss: [60000, 'Instrumental intense boss battle music for a 3D neon space shooter. 140 bpm, aggressive distorted synth bass, pounding drums, ominous brass-like synth stabs, alarm-like arpeggios, menacing and urgent, steady loopable groove with no ending, no vocals.']
};

async function call(url, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify(body) });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const text = (await res.text()).slice(0, 300);
    if (res.status === 429 || res.status >= 500) { await new Promise(r => setTimeout(r, 4000 * (attempt + 1))); continue; }
    throw new Error(res.status + ' ' + text);
  }
  throw new Error('gave up after retries');
}

const jobs = [];
for (const [name, [dur, text]] of Object.entries(SFX)) {
  jobs.push({ name, run: () => call('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', { text, duration_seconds: dur, prompt_influence: 0.55, model_id: 'eleven_text_to_sound_v2' }) });
}
for (const [name, [ms, prompt]] of Object.entries(MUSIC)) {
  jobs.push({ name, run: () => call('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', { prompt, music_length_ms: ms, model_id: 'music_v1', force_instrumental: true }) });
}
const todo = jobs.filter(j => (!only.size || only.has(j.name)) && !fs.existsSync(path.join(out, j.name + '.mp3')));
let next = 0;
async function worker() {
  while (next < todo.length) {
    const job = todo[next++];
    try {
      const buf = await job.run();
      fs.writeFileSync(path.join(out, job.name + '.mp3'), buf);
      console.log('ok', job.name, buf.length);
    } catch (error) {
      console.log('FAIL', job.name, error.message);
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
