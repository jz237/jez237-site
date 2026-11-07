# Sini 2026 audio

All clips are made with ElevenLabs by `gen_audio.py` and finished by `process_audio.py` (this folder). It is our own
audio: nothing imitates the arcade classic, and the construct (boss) never speaks. Its `awake` and `roar` sounds are
machines, with no voice.

Game folder: `games/2026-11-07/sini-2026/` holds `audio/` (SFX and engine loops), `music/` and `voice/`.
Raw clips, candidate takes and `manifest.json` (loop points, loudness and peak of every file) are in
`D:/Projects/.tmp/sini-2026-work/audio-raw/`.

## Voice

One flight controller reads every line: **Daniel** (ElevenLabs premade voice "Steady Broadcaster", British male,
voice id `onwK4e9ZLuTAKqWW03F9`). The model is `eleven_multilingual_v2` with stability 0.6, similarity 0.8, style 0.2
and speaker boost on. The fallback voice, Eric, was not needed. The lines are clean speech with no music.
They were checked with one ElevenLabs Scribe transcription of all 17 lines joined together, and every line came back
word for word.

## Loudness and format

| Group | Format | Target |
| --- | --- | --- |
| One-shot SFX | mono 112 kbps | loudest 100 ms = -12 LUFS (K-weighted), true peak -1 dBTP |
| Engine loops | mono 112 kbps | -18 LUFS integrated, -1 dBTP |
| Voice | mono 96 kbps | -16 LUFS integrated, -1 dBTP |
| Music loops and stings | stereo 128 kbps | -16 LUFS integrated, -1 dBTP |

For one-shots, peak limiting is capped at 6 dB. Very spiky clicks therefore stay a little under the target: chip,
uiback, uimove, bombarm, hitrock, pop and hit. That suits frequent or UI sounds, which should be soft anyway.

## Loops

Each loop file is a seamless loop as decoded PCM. The seam is a crossfade cut inside the clip, so the file starts
mid-flow; fade it in on first start if you want.

Play loops with Web Audio (`AudioBufferSourceNode.loop = true`), not `<audio loop>`. A check in the app's Chromium
(Chrome 152) showed that `decodeAudioData` returns exactly the sample counts listed here, with the MP3 encoder delay
and padding removed, so there is no gap at the wrap.

## SFX: `audio/`

The frequent sounds are low/mid, percussive and not tonal: gun, hitrock, chip, collect, hit, pop and uimove. Their
measured spectral centroids are 0.4-1.7 kHz, and none has a whistle peak. Each has a band-limit and a length cap in
`process_audio.py` (`SOFT`, `CUT`).

| File | Duration (s) | Notes |
| --- | --- | --- |
| `audio/gun.mp3` | 0.30 | twin cannon shot, re-rolled take 4 |
| `audio/hitrock.mp3` | 0.48 | re-rolled take 2 |
| `audio/chip.mp3` | 0.38 | re-rolled take 3 |
| `audio/collect.mp3` | 0.52 | soft rising swell into a muted low clunk, re-rolled take 5 |
| `audio/bombarm.mp3` | 0.60 | darkened (low-pass 5 kHz) |
| `audio/bomb.mp3` | 1.20 | |
| `audio/bombhit.mp3` | 3.00 | |
| `audio/bombpop.mp3` | 1.00 | re-rolled take 1 |
| `audio/hit.mp3` | 0.35 | re-rolled take 1 |
| `audio/pop.mp3` | 0.21 | re-rolled take 3 |
| `audio/boomS.mp3` | 1.20 | |
| `audio/boomM.mp3` | 2.00 | |
| `audio/boomL.mp3` | 3.03 | |
| `audio/debris.mp3` | 1.36 | re-rolled take 1 |
| `audio/bolt.mp3` | 0.60 | |
| `audio/tell.mp3` | 1.00 | |
| `audio/shieldhit.mp3` | 0.80 | |
| `audio/death.mp3` | 2.20 | |
| `audio/spawn.mp3` | 1.42 | |
| `audio/warpin.mp3` | 0.91 | |
| `audio/rockbreak.mp3` | 1.60 | |
| `audio/build.mp3` | 1.20 | |
| `audio/knock.mp3` | 1.20 | |
| `audio/awake.mp3` | 4.00 | machine power-up and grinding roar, no voice |
| `audio/roar.mp3` | 2.56 | machine growl, no voice |
| `audio/tractor.mp3` | 1.99 | re-rolled take 2 |
| `audio/eat.mp3` | 1.53 | |
| `audio/alarm.mp3` | 1.20 | |
| `audio/life.mp3` | 1.36 | |
| `audio/upgrade.mp3` | 1.20 | |
| `audio/medal.mp3` | 1.36 | re-rolled take 2 |
| `audio/pickup.mp3` | 1.00 | |
| `audio/pwend.mp3` | 0.80 | |
| `audio/uimove.mp3` | 0.18 | |
| `audio/uiok.mp3` | 0.46 | re-rolled take 4 |
| `audio/uiback.mp3` | 0.35 | re-rolled take 1 |
| `audio/rewind.mp3` | 1.19 | |
| `audio/thrust.mp3` | 4.94 | loop |
| `audio/gather.mp3` | 4.02 | loop |
| `audio/reaver.mp3` | 3.98 | loop |
| `audio/construct.mp3` | 5.31 | loop |
| `audio/hunt.mp3` | 5.13 | loop |

## Music: `music/`

Everything is instrumental (`force_instrumental`). Each stage track was generated longer than its loop. The loop
points are chosen so that the 8 s after the seam sounds like the 8 s after the loop start (timbre distance, lower is
better) and the drum onsets around the seam fall on the same beat (beat correlation, higher is better). The two are
joined with a 2.5 s crossfade.

| File | Duration (s) | Notes |
| --- | --- | --- |
| `music/title.mp3` | 86.06 | loop, raw 31.5-117.5 s of 150 s (the generated slow build is cut, so the loop is the steady majestic part), timbre 0.64, beat 0.69 |
| `music/s1.mp3` | 91.20 | Amber Drift, loop, raw 20.3-111.5 s of 130 s, timbre 1.16, beat 0.84 |
| `music/s2.mp3` | 85.44 | Frost Ring, loop, raw 21.2-106.7 s of 130 s, timbre 0.94, beat 0.78 |
| `music/s3.mp3` | 85.43 | Iron Shoals, loop, raw 24.7-110.1 s of 130 s, timbre 0.45, beat 0.77 |
| `music/s4.mp3` | 104.76 | Ember Veil, loop, raw 9.1-113.8 s of 130 s, timbre 0.16, beat 0.88 |
| `music/s5.mp3` | 100.46 | Void Crown, loop, raw 39.5-140.0 s of 170 s, timbre 0.45, beat 0.89 |
| `music/boss.mp3` | 133.71 | loop, raw 20.3-154.0 s of 170 s, timbre 0.28, beat 0.78 |
| `music/clear.mp3` | 7.17 | victory sting, not looped |
| `music/over.mp3` | 7.98 | game-over sting, not looped, quiet fade-in start |

## Voice: `voice/`

| File | Duration (s) | Line |
| --- | --- | --- |
| `voice/v_begin.mp3` | 5.14 | Prospector, you're clear to launch. Crack those rocks and stock up on charges. |
| `voice/v_s2.mp3` | 3.35 | Frost Ring ahead. The ice hides plenty of crystal. |
| `voice/v_s3.mp3` | 3.31 | Iron Shoals. Heavy rock, and heavier company. |
| `voice/v_s4.mp3` | 3.20 | Ember Veil. Watch the heat, and watch your back. |
| `voice/v_s5.mp3` | 3.27 | Void Crown. This is where they build the big ones. |
| `voice/v_deep.mp3` | 2.95 | Deep Field. There's no way home but forward. |
| `voice/v_half.mp3` | 3.47 | Their construct is half built. Start stocking charges. |
| `voice/v_boss.mp3` | 3.62 | It's awake! Keep moving and hit it with everything you've got. |
| `voice/v_bossdown.mp3` | 2.77 | Construct destroyed! Outstanding flying. |
| `voice/v_clear.mp3` | 2.73 | Sector clear. Refit and get ready. |
| `voice/v_lastlife.mp3` | 2.31 | Last ship, Prospector. Make it count. |
| `voice/v_gameover.mp3` | 1.50 | We've lost you, Prospector. |
| `voice/v_newrecord.mp3` | 1.30 | That's a new record. |
| `voice/v_champion.mp3` | 2.93 | All five constructs down. The belt is free. |
| `voice/v_replay.mp3` | 1.14 | Let's see that again. |
| `voice/v_partner.mp3` | 1.30 | Wingmate on the line. |
| `voice/v_empty.mp3` | 2.43 | You're out of charges. Mine some more! |

## Regenerations and why

The first takes were screened by spectrum: centroid, roll-off, energy above 2 kHz and narrow tonal peaks. Clips that
failed got new takes (`gen_audio.py takes`, with prompts in `RETRY`), and one take was installed with `pick`. Every
take's prompt is in `audio-raw/takes/prompts.json`, and the chosen takes are in `audio-raw/picks.json`.

- **gun**: first take was almost all sub-bass (centroid 107 Hz): a muddy thud, inaudible on phones. Now 604 Hz.
- **collect**: first take was a sustained sub hum. Round 1 re-rolls with the word "glassy" all came out as bright
  9-11 kHz shimmer, which is the "bird chirp" risk. Round 2 avoided the word, and the chosen take is a low-mid swell
  into a clunk (424 Hz).
- **hit**: first take had a strong metallic ring at 8.9 kHz (a whistle). Now a dull thud with crackle (1.0 kHz, no
  tonal peak).
- **hitrock**: first take was a thin single spike. **chip** and **pop**: too bright (3-4 kHz centroids). All three are
  now darker takes.
- **bombpop**: sub only. **debris**: very bright clatter (6 kHz). **medal**: thin, cymbal-heavy (5 kHz). Each was
  replaced with a fuller, darker take.
- **tractor**: pure sub throb. Now has a low-mid warble.
- **uiback**: bright hiss. **uiok**: a sub thump that went bright after filtering. Both replaced; the other uiok
  candidate was a 1.7 kHz beep.
- **spawn**: re-rolled, but the original was kept, because both new takes were no better and one started at full level.
- **title, s5, boss music**: the first takes (110, 130 and 120 s) changed sections so much that no beat-aligned loop
  of 85 s or more could be cut. Their beat correlation at the seam was only 0.33-0.43. They were regenerated longer
  (150, 170 and 170 s) and asked for "one steady groove from start to end". The new loops score 0.69-0.89.
  The first takes are kept in `audio-raw/_old/music/`.

Nothing is missing: 42 SFX (37 one-shots and 5 loops), 9 music files and 17 voice lines.

## Credits

| Point | Remaining | Used of limit |
| --- | --- | --- |
| Before | 193,253 | 169,747 / 363,000 (53.2 % left) |
| After | 172,610 | 190,390 / 363,000 (47.6 % left) |

The whole job used about 20,600 credits, most of it music.

## Re-running

```
python -I scripts/sini-2026/gen_audio.py credits
python -I scripts/sini-2026/gen_audio.py sfx|music|voice [--only a,b] [--force]   # --force keeps the old raw in _old/
python -I scripts/sini-2026/gen_audio.py takes --only gun,hit --n 4 [--start 5]   # candidates -> audio-raw/takes/
python -I scripts/sini-2026/gen_audio.py pick gun 4
python -I scripts/sini-2026/gen_audio.py stt                                      # transcribe all voice lines once
python scripts/sini-2026/process_audio.py games/2026-11-07/sini-2026 [names]      # plain python (numpy + scipy)
```
