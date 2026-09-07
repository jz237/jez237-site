# Remaining roster audit — 5.4.9

Reviewed 119 existing files containing 1,608 sprite cells and portraits for Alan, Ali, Commissioner, Cyraxx, Deathblow, Devil, Donald and Post. Repaired 374 cells across 95 standard, legacy and HD files. The exact file/cell/donor list is in `roster-atlas-audit.json`; the baseline originals remain in Git at `1a297c5e5c58979d0d12ce866182c6ab2d60a004`.

Added 47 companion atlases with 752 frame slots across basic movement, attack preparation/recovery, strikes, hit reactions, entrances/taunts and specials. Commissioner has five banks because he has no separate special atlas. Built-in image generation produced the painted drawings; `inbetween-sources.json` records each selected master filename and prompt. Nine reviewed cell substitutions/orientation corrections are recorded by `polish-roster-inbetweens.mjs`; two slots retain complete original drawings. These are additional presentation frames, with canonical gameplay poses, hitboxes and attack timing preserved.

Damaged old cells are physically replaced, including legacy fallback and HD copies. The former rejection gate is removed only for these repaired fighters. Repaired main-bank cells always use the reviewed drawing, while intact cells gain a short transition on pose entry. Roster fighters use these drawings without the old overlapping pose fade. Asset URLs and the service worker use 5.4.9 to retire cached old images.

## Reproduce

Set `SHARP_PACKAGE` to an installed Sharp package, then run from this game's directory:

```
node tools/painted-flow/pack-inbetweens.mjs <generated-master-directory>
node tools/painted-flow/polish-roster-inbetweens.mjs
node tools/painted-flow/repair-roster-atlases.mjs
node tools/painted-flow/verify-old-atlases.mjs roster-atlas-audit.json
```

Run polish once after packing: its orientation corrections operate on freshly packed drawings. Selected masters are preserved in the generated-image directory; the packed WebP files and metadata are committed in `assets/inbetweens/`.

## Validation

- All 374 repaired cells are nonempty and have transparent borders; every unaffected visible RGBA pixel matches the baseline.
- All 752 new packed slots are nonempty with transparent borders and the generated masters were visually reviewed. Cropped generated attacks were rejected and redrawn before packing.
- Unit coverage checks transition entry, late loading, long repaired holds, full roster selection, attack timing and worker cache registration.
- Browser checks cover every new bank for all eight fighters, existing Jez/Benny sequences, pose chains, CPU motion, the billboard renderer and console errors.

This audit fixes identified source-image defects. It is not a claim that every possible future animation or generated image is automatically free of visual defects.
