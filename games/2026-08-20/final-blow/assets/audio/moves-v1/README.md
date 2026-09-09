# Move Foley — 5.7.7

24 original non-vocal effects generated with `fal-ai/elevenlabs/sound-effects/v2` through the connected Fal tool. Exact prompts, durations, and request IDs are recorded in PROMPTS.json. Original outputs are retained in the local work/audio577/sources directory. Existing reviewed voice files and their routing remain intact.

Eight alternating punch/kick/guard impacts; two movement swishes; throw and body landing; ten fighter-specific special textures; metal and cable effects. The runtime reuses these physical materials across authored moves and stage objects, with small move-specific pitch differences and alternating takes. This is a layered sound bank, not a separate recording for every animation frame.

Processing: 44.1 kHz mono, high-pass at 35 Hz, trimmed leading silence, 8 ms tail fade, peak ceiling -4 dBFS before MP3 encoding, RMS ceiling -18 dBFS. Encoded libmp3lame quality 2. Decoded output peaks checked below full scale. Most impact onsets are within 1 ms; the longest intentional Foley lead is 36 ms.

Playback: decoded Web Audio buffers, maximum eight simultaneous effect voices, short voice-stealing fade, mild position panning, existing master limiter and volume/mute/attract controls. A missing or cold sample falls back immediately rather than replaying an out-of-date hit after download. Swing Foley fires two simulation ticks before the active window; contact sounds remain collision-driven. Existing voices are retained at 75% of their prior level when a new effect shares the cue.

Validation: live browser decoding of all 24 files; 140 fighter/cue routes; swing timing and whiff behavior; bounded voices; mute; existing reviewed audio routes; CPU supers and offline cache. Unit tests cover asset completeness, per-fighter special identity, alternating impacts, missing buffers and node limits.
