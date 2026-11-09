# SKYHOLD 2026 audio

`gen_audio.py` (in this folder) makes every sampled clip with ElevenLabs, and `process_audio.py` finishes them. All
of it is our own audio: nothing imitates the arcade classic the genre comes from. The one exception is the separate,
switchable cabinet layer described below, which plays that cabinet's own sound effects. The carriers (bosses) never speak.
Their roar and drone are machines, with no voice. The settlers make no human sounds: their distress call is an
electronic radio beacon, and the husk fusion is grinding metal.

Game folder: `games/2026-11-09/skyhold/` holds `audio/` (SFX and loops), `music/` and `voice/`.
Raw clips, candidate takes, `picks.json` and `manifest.json` (loop points, loudness and peak of every file) are in
`D:/Projects/.tmp/skyhold-work/audio-raw/`.

A live-synthesised retro layer sits on top of the samples: `js/chip.js` (see the last section).
The original arcade cabinet's sound effects sit on top as a third layer (see "Cabinet layer").

## Voice

One low, ominous colony-command voice reads every line (since 1.6.1, at the owner's request): **Brian** (ElevenLabs
premade voice "Deep, Resonant and Comforting", American male, voice id `nPczCjzI2devNBz1zQrb`), chosen because it measured
the lowest of the deep male voices (Brian ~90-114 Hz, Adam ~124-180 Hz, Bill ~122-148 Hz on the same two lines). The model
is `eleven_multilingual_v2` with stability 0.5, similarity 0.85, style 0.35, speed 0.88 and speaker boost on (slower and
darker); the fallback is Adam. process_audio.py then lowers it about 1.8 semitones with the formants (rubberband), adds a
dark low shelf, softens the highs and lays a faint short echo under it (`VOICE_AF`). Every line still transcribes word for
word (Scribe). Until 1.6.0 the voice was Alice (`Xb7hH8MSUJpSbSDYk0k2`, calm British female).

All 18 lines were checked with one ElevenLabs Scribe transcription of the lines joined together (`gen_audio.py stt`).
Every line came back word for word. The one difference, "Frostvale", is just how Scribe spells the invented name
Frostveil, which is pronounced the same way.

## Loudness and format

| Group | Format | Target |
| --- | --- | --- |
| One-shot SFX | mono 112 kbps | loudest 100 ms = -12 LUFS (K-weighted), true peak -1 dBTP |
| Frequent one-shots | mono 112 kbps | lower targets (`QUIET`): beam and beamhit -15, pop -13.5, uimove -15, minebeep -17, tally -18 |
| Engine loops (thrust, liftloop, bossloop) | mono 112 kbps | -18 LUFS integrated, -1 dBTP |
| Ambient beds (amb_*) | mono 112 kbps | -22 LUFS integrated, -1 dBTP (quiet beds) |
| Voice | mono 96 kbps | -16 LUFS integrated, -1 dBTP |
| Music loops and stings | stereo 128 kbps | -16 LUFS integrated, -1 dBTP |

This is the Sini 2026 table plus two lines: the frequent-sound targets and the ambient beds. Peak limiting is capped
at 6 dB, so a few very spiky clicks stay a little under their target: tally (-20.9), uimove (-17.2), pop (-15.8),
uiback, uiok, catch and hivepop. That suits frequent and UI sounds, which should be soft anyway. amb_frost ends at
-23.9 for the same reason.

## Loops

Each loop file is a seamless loop as decoded PCM. Engine loops get a 0.5 s crossfade seam and ambient beds a 1.5 s
one, cut inside the clip, so each file starts mid-flow. Fade it in on first start if you want. The seam check
(wrap step over the 99th percentile of nearby steps, where 1 or less is clean) is 0.0 to 0.61 for all eight loops.

Play loops with Web Audio (`AudioBufferSourceNode.loop = true`), not `<audio loop>`.

## SFX: `audio/`

The frequent sounds are beam, beamhit, pop, tally, uimove and minebeep. Each is high-passed (110-200 Hz, so a phone
speaker plays its body) and low-passed (4-6.5 kHz, so there are no bright chirps), using `SOFT` in
`process_audio.py`. Each is also capped in length (`CUT`). Their measured spectral centroids are 0.66-1.25 kHz, and a
200 Hz high-pass costs them at most 1.2 dB, so phones hear them. Any narrow lines left above the low-pass are 30 dB
or more under each clip's main energy.

`process_audio.py stats <dir|file>` prints the screening numbers: centroid, 85 % roll-off, energy above 4 kHz and
below 150 Hz, the phone loss and the strongest tonal peak.

| File | Duration (s) | Notes |
| --- | --- | --- |
| `audio/beam.mp3` | 0.28 | player beam cannon, re-rolled take 1, centroid 0.87 kHz |
| `audio/beamhit.mp3` | 0.30 | re-rolled take 2 |
| `audio/pop.mp3` | 0.47 | small machine destroyed |
| `audio/boomS.mp3` | 1.20 | |
| `audio/boomM.mp3` | 2.00 | |
| `audio/boomL.mp3` | 3.48 | |
| `audio/debris.mp3` | 1.36 | wreckage landing on the ground |
| `audio/warpin.mp3` | 1.00 | alien machine materialising, re-rolled take 2 |
| `audio/grab.mp3` | 0.80 | tractor beam locks on, re-rolled take 1 |
| `audio/distress.mp3` | 0.87 | settler's radio beacon, two electronic alert pulses |
| `audio/fuse.mp3` | 1.60 | lifter fusing into a husk, grinding metal, re-rolled take 1 |
| `audio/fall.mp3` | 0.92 | falling whoosh |
| `audio/catch.mp3` | 0.80 | magnetic clamp and chime, re-rolled take 1 |
| `audio/land.mp3` | 1.00 | warm success chime |
| `audio/lost.mp3` | 1.20 | soft sad falling tone |
| `audio/mine.mp3` | 0.79 | mine dropped and arming |
| `audio/minebeep.mp3` | 0.14 | re-rolled take 3 (0.66 kHz beep) |
| `audio/hivepop.mp3` | 0.84 | |
| `audio/swarm.mp3` | 1.20 | |
| `audio/prowler.mp3` | 1.23 | |
| `audio/bolt.mp3` | 0.55 | |
| `audio/tell.mp3` | 0.80 | charge-up warning |
| `audio/nova.mp3` | 2.56 | smart-bomb shockwave |
| `audio/blink.mp3` | 0.60 | |
| `audio/blinkin.mp3` | 0.52 | |
| `audio/shieldhit.mp3` | 0.80 | re-rolled take 2, high-passed 100 Hz |
| `audio/death.mp3` | 2.20 | |
| `audio/spawn.mp3` | 1.60 | re-rolled take 2 |
| `audio/pickup.mp3` | 1.00 | |
| `audio/pwend.mp3` | 0.80 | |
| `audio/life.mp3` | 1.36 | |
| `audio/alarm.mp3` | 1.36 | colony siren |
| `audio/bossroar.mp3` | 2.56 | machine roar, no voice |
| `audio/bosshit.mp3` | 0.55 | |
| `audio/nodebreak.mp3` | 1.36 | |
| `audio/bossbeam.mp3` | 1.79 | |
| `audio/colonyfall.mp3` | 2.94 | re-rolled take 1 |
| `audio/waveclear.mp3` | 1.60 | |
| `audio/tally.mp3` | 0.08 | one soft wooden tick, re-rolled take 5 (round 2) |
| `audio/upgrade.mp3` | 1.20 | |
| `audio/medal.mp3` | 1.36 | re-rolled take 2 |
| `audio/uimove.mp3` | 0.16 | re-rolled take 1 |
| `audio/uiok.mp3` | 0.43 | re-rolled take 2 |
| `audio/uiback.mp3` | 0.35 | re-rolled take 1 |
| `audio/rewind.mp3` | 1.20 | |
| `audio/thrust.mp3` | 4.83 | loop, gunship turbine (low-passed 6.5 kHz before looping) |
| `audio/liftloop.mp3` | 4.30 | loop, lifter tractor hum (round 2 prompt) |
| `audio/bossloop.mp3` | 4.87 | loop, carrier engine drone |
| `audio/amb_verdant.mp3` | 10.44 | loop, sea breeze, surf and seabirds (round 2 prompt) |
| `audio/amb_dune.mp3` | 10.48 | loop, desert wind and sand hiss (round 2 prompt) |
| `audio/amb_frost.mp3` | 10.36 | loop, thin icy wind and creaking ice |
| `audio/amb_cinder.mp3` | 10.03 | loop, bubbling lava and embers (round 3 prompt) |
| `audio/amb_umbra.mp3` | 9.59 | loop, dark drone and faint crystal chimes (round 2 prompt) |

## Music: `music/`

Everything is instrumental (`force_instrumental`): cinematic electronic space action with an arcade drive. It is
original and imitates no existing game. Each looped track was generated longer than its loop. The loop points are
chosen so that the 8 s after the seam sounds like the 8 s after the loop start (timbre distance, lower is better) and
the drum onsets around the seam fall on the same beat (beat correlation, higher is better). The two are joined with
a 2.5 s crossfade.

| File | Duration (s) | Notes |
| --- | --- | --- |
| `music/title.mp3` | 100.44 | loop, raw 32.9-133.4 s of 150 s (second take), timbre 0.30, beat 0.93 |
| `music/s1.mp3` | 112.50 | Verdant Reach, 112 BPM, loop, raw 21.2-133.7 s of 150 s, timbre 0.24, beat 0.91 |
| `music/s2.mp3` | 112.62 | Red Dune Belt, 118 BPM, loop, raw 21.7-134.4 s of 150 s, timbre 0.46, beat 0.81 |
| `music/s3.mp3` | 112.26 | Frostveil, 124 BPM, loop, raw 17.3-129.6 s of 150 s, timbre 0.39, beat 0.93 |
| `music/s4.mp3` | 114.47 | Cinderfall, 130 BPM, loop, raw 22.2-136.7 s of 150 s, timbre 0.30, beat 0.90 |
| `music/s5.mp3` | 112.94 | Umbra Prime, 136 BPM, loop, raw 38.6-151.5 s of 170 s (second take), timbre 0.42, beat 0.82 |
| `music/boss.mp3` | 114.94 | 142 BPM, loop, raw 13.2-128.1 s of 150 s (second take), timbre 0.08, beat 0.96 |
| `music/clear.mp3` | 7.51 | triumphant sting, not looped |
| `music/over.mp3` | 8.20 | game-over sting, not looped, cut to 8.2 s with a 1.5 s fade |

## Voice: `voice/`

| File | Duration (s) | Line |
| --- | --- | --- |
| `voice/v_begin.mp3` | 4.18 | Skyhold, you are clear to launch. Keep the colonists on the ground. |
| `voice/v_s2.mp3` | 2.10 | Next world: the Red Dune Belt. |
| `voice/v_s3.mp3` | 1.74 | Frostveil. Watch the ice. |
| `voice/v_s4.mp3` | 1.80 | Cinderfall. Stay above the fire. |
| `voice/v_s5.mp3` | 2.19 | Umbra Prime. The last colony. |
| `voice/v_boss.mp3` | 2.66 | Carrier inbound. Hit its weak points. |
| `voice/v_bossdown.mp3` | 2.01 | Carrier down. The sky is clear. |
| `voice/v_clear.mp3` | 2.14 | Sector secure. Well flown. |
| `voice/v_lastlife.mp3` | 1.71 | Last ship. Make it count. |
| `voice/v_gameover.mp3` | 1.30 | We have lost the sky. |
| `voice/v_newrecord.mp3` | 2.09 | A new record for the colonies. |
| `voice/v_champion.mp3` | 2.78 | Every world is safe. Outstanding, pilot. |
| `voice/v_colonyfall.mp3` | 2.27 | The colony has fallen. Hold what's left. |
| `voice/v_saved.mp3` | 2.09 | Every colonist made it home. |
| `voice/v_endless.mp3` | 2.44 | Endless orbit. Hold as long as you can. |
| `voice/v_partner.mp3` | 1.51 | Wingmate on station. |
| `voice/v_replay.mp3` | 1.28 | Let's see that again. |
| `voice/v_lifted.mp3` | 1.75 | They've got one. Get after it! |

## Regenerations and why

The first takes were screened by spectrum (`process_audio.py stats`). Clips that failed got new takes
(`gen_audio.py takes`, with prompts in `RETRY`), and the best take was installed with `pick`. Every take's prompt is
in `audio-raw/takes/prompts.json`, the chosen takes are in `audio-raw/picks.json`, and the replaced raws are in
`audio-raw/_old/`.

- **beam**: the first take was a muddy sub thump (65 % of its energy below 150 Hz, centroid 250 Hz). The chosen take
  is a mid-range zap (centroid 0.87 kHz after processing).
- **beamhit**: 91 % sub, with a 1 kHz ring. Now a dull crackling thunk (1.25 kHz, no ring).
- **tally**: the first take and all four round 1 re-rolls ("muted click / counter tick") came out as bright
  6-9 kHz clicks. A round 2 prompt asking for a wooden knock gave a soft 0.7 kHz tick.
- **minebeep**: 12.9 kHz. **uimove**: 8 kHz. **uiok**: 5.2 kHz. **catch**: 8 kHz. **medal**: 5.4 kHz, cymbal-heavy.
  **fuse**: 6 kHz shriek. Each was replaced with a darker take.
- **uiback, shieldhit, colonyfall, grab, warpin, spawn**: almost all sub-bass. A phone would have lost 9-20 dB of
  them. Replaced with takes that carry more mid range: grab, warpin and uiback now lose at most 0.6 dB; spawn,
  shieldhit and colonyfall, which are meant to be deep, lose 4-8 dB.
- **liftloop, amb_verdant, amb_dune, amb_umbra**: the first takes were 84-98 % sub-bass rumble. They were
  regenerated with round 2 loop prompts (the first prompts are kept in `LOOPS_R1`). **amb_cinder** needed a third
  round ("close-up bubbling lava, no deep rumble"). All five now lose 0.2-5 dB on a phone, down from 10-18 dB.
- **thrust**: very hissy (3 kHz centroid). It plays all the time, so it is low-passed at 6.5 kHz before looping.
- **title, s5, boss music**: the first takes (120, 150 and 130 s) gave no good loop of the wanted length. Title had
  timbre distance 1.73, boss scored 1.33 at only 91 s, and s5 had beat correlation 0.50 at any length. They were
  regenerated longer (150, 170 and 150 s) and asked for a steady kick on every beat with no tempo change. The new
  loops score timbre 0.08-0.42 and beat 0.82-0.96. The first takes are kept in `audio-raw/_old/music/`.

Nothing is missing: 53 SFX (45 one-shots and 8 loops), 9 music files and 18 voice lines.

## Credits

| Point | Remaining | Used of limit |
| --- | --- | --- |
| Before | 171,824 | 191,176 / 363,000 (47.3 % left) |
| After | 148,634 | 214,366 / 363,000 (40.9 % left) |

The difference is about 23,200 credits. Most of it is music: about 9,150 for the first music set and about 5,000 for
the three regenerated tracks. Part of the difference was billed while none of these scripts was running (about
6,000 between two runs), so it is likely other sessions sharing the account.

## Retro synth layer: `js/chip.js`

`new Chip(ctx, dest)` makes the synth, and `chip.play(name, { vol = 1, pan = 0, rate = 1 } = {})` plays a sound. It
returns true when a sound starts. Every effect is synthesised live with WebAudio from our own designs: square and
triangle oscillators, stepped sample-and-hold noise buffers whose playback rate sweeps the step rate, stair-stepped
pitch sweeps and short envelopes. It contains no samples and no classic game's sounds.

The names (also in `Chip.NAMES`) are: beam, pop, boom, bigboom, warp, grab, catch, land, lost, nova, blink, death,
life, tell, mine, swarm and alarm.

Safety and cost:

- With a null ctx every call is a silent no-op. Bad options (NaN, strings) are clamped, unknown names return false,
  and `play` never throws.
- The noise buffers (4 stepped noises and a short repeating "metal" pattern) are made once, on the first play.
- Each name has a minimum gap and a cap on overlapping copies, and there is a global cap of 40 voices. Calls over a
  limit are dropped.
- The bus is a gentle 9 kHz low-pass with no resonance, then a stateless soft clipper: linear up to -4.4 dBFS, then
  bending smoothly toward -1 dBFS.

Measured in Edge, with each sound rendered in an OfflineAudioContext at vol 1 (`skyhold-work/chiptest.html`):

- Single sounds peak at -8.2 dBFS (death) to -18.9 dBFS (tell), with beam at -18.4.
- Lengths are 0.09 s (beam) to 1.9 s (death); nova and bigboom are 1.7 s.
- Nothing is NaN or silent.
- Beam fired 30 times a second for 2 s, with pop and boom every 100 ms, played every call. That render took 77 ms and
  peaked at -6.8 dBFS.
- All 17 sounds started at once peak at -1.26 dBFS.

## Re-running

```
python -I scripts/skyhold/gen_audio.py credits|voices
python -I scripts/skyhold/gen_audio.py sfx|music|voice [--only a,b] [--force]   # --force keeps the old raw in _old/
python -I scripts/skyhold/gen_audio.py takes --only beam,tally --n 4 [--start 5]  # candidates -> audio-raw/takes/
python -I scripts/skyhold/gen_audio.py pick beam 1
python -I scripts/skyhold/gen_audio.py stt                                      # transcribe all voice lines once
python scripts/skyhold/process_audio.py games/2026-11-09/skyhold [names]        # plain python (numpy + scipy)
python scripts/skyhold/process_audio.py stats games/2026-11-09/skyhold/audio    # spectral screen
```

## Cabinet layer: `audio/cabinet/`

Options → CABINET SOUNDS (on by default) plays the original 1980 arcade cabinet's sound effects alongside our own.
The 18 WAVs and `manifest.json` (ROM hashes, how they were rendered, each file's sha256) are copied unchanged from
the site's arcade cabinet exhibit, `demos/defender-exhibit/audio/`. They were rendered from the cabinet's sound ROM by
emulating its 6800 sound CPU and DAC, so they are the cabinet's sounds, not re-creations.

`Audio.cab(name, o)` in `js/audio.js` plays them through their own bus (`CAB_GAIN` 0.2: the square waves are about
14 dB louder than our samples). Like the cabinet's sound board there is one channel: a new sound cuts off the one
playing unless that one ranks higher (`CAB` in `js/audio.js`), in which case the new one is dropped. The cabinet
thrust is a separate loop (`cabthrust`) heard only while you push.

| Cabinet sound | Plays on |
|---|---|
| fire | your shots (pitched up for the Hornet, down for the Breaker) |
| explosion | lifter, prowler, skimmer, meteor and mine wrecks near you; a partner's ship lost; meteor impacts |
| mutant | husk wrecks; a lifter fusing into a husk |
| bomber | sower wrecks; a carrier weak point destroyed |
| pod | hive wrecks and hive bursts |
| swarmer | stinger wrecks |
| abduct | a lifter grabbing a settler |
| fall | a settler falling from too high |
| catch | catching a settler |
| delivery | setting a settler down |
| hyperspace | blink |
| bomb | nova; a carrier shedding its armour and its final explosion |
| death | your ship lost |
| planet | the colony falling |
| extra | +1 ship; HYPER |
| credit | starting a game, power-ups, medals |
| start | each world beginning |
| thrust | while you push the stick |
