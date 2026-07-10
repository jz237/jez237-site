# audio-quarantine/ — DO NOT SOURCE AUDIO FROM THIS FOLDER

The `Project-X/`, `Apidya/`, and `Turrican_II/` folders were moved here from
`../audio/` on 2026-07-10. **Every file in them is malformed.** Despite their
track-like filenames and "KHInsider gamerip" provenance labels, the files do
not contain music: they are frequency sweeps layered over broadband noise and
sound like howling wind. Confirmed by reading full-length spectrograms of the
files (2026-07-10) — no harmonic lines, no rhythmic structure, only diagonal
sweep curves over a uniform wash.

## Why they are quarantined instead of deleted

They are kept as evidence and as a tombstone: automated file-pickers sourced
"music" from these folders three separate times while building the Shatter
Storm Amiga edition (v3.0.1 → v3.0.3, the recurring "wind noise" bug — see
`games/2026-03-11/shatter-storm/amiga/README.md` and
`games/2026-03-11/shatter-storm/amiga/audio/sfx-manifest.json`). Anything that
scans `experiments/amiga-mod-player/audio/` for soundtrack files must never
find these again, so they no longer live there.

Rules:

- **Never** pick music, SFX, or "reference audio" from this folder.
- **Never** move these files back into `../audio/`.
- The mod-player UI does not list them: the entries were removed from
  `../tracks.js`, and `../app.js` additionally refuses any track whose path
  points here (defense in depth in case tracks.js is ever regenerated).
- This folder is excluded from the Cloudflare Pages deploy
  (`workspace/scripts/deploy_cloudflare_pages_site.sh`), so the files are not
  served on jez237.com either.

## How to verify audio before trusting it (the lesson)

Spectral-flatness screening **does not catch this failure**: a swept sine tone
measures as "tonal", so flatness metrics scored these files like music. The
reliable gate is rendering a full-length spectrogram and reading it with your
eyes:

```sh
ffmpeg -i file.mp3 -lavfi showspectrumpic=s=1400x460:legend=1 spectro.png
```

Real music shows stable harmonic lines, vertical rhythmic structure, and
section changes. These files show smooth diagonal sweep curves over an even
broadband wash. If a file's spectrogram has no harmonic/rhythmic structure,
reject it regardless of what any metric says.

## Clean replacements

- **Project-X**: replaced 2026-07-10 with the real Allister Brimble ProTracker
  modules from Modland (`Protracker/Allister Brimble/project x *.mod`) — four
  spectrogram-verified files now live in `../mods/Allister_Brimble/`
  (`project_x_-_{1812sampled,bladswede_remix,loader,special_edition}.mod`) and
  play natively in the mod-player.
- **Apidya / Turrican II**: Chris Huelsbeck's originals are TFMX format
  (Modland `TFMX/Chris Huelsbeck/mdat.* + smpl.*`), which libopenmpt/ffmpeg
  cannot render — a TFMX-capable player (UADE) or a spectrogram-verified rip
  is required. Do not settle for anything that fails the eyeball test above.
- **Re-downloading from KHInsider does NOT help**: verified 2026-07-10 that the
  KHInsider "Turrican II: The Final Fight (gamerip)" download is byte-identical
  (same MD5) to the quarantined file and its spectrogram shows the same
  malformed wash — the album is broken at KHInsider itself. The 2026 mirror was
  a faithful copy of a bad source. Assume the Apidya and Project-X gamerip
  albums there are equally bad.
