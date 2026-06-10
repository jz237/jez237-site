# Glimmer Grotto

*A cozy mining idyll — dig slow, look closely, rest often.*

A 2D gem-mining game for desktop **and** mobile. No enemies, no death, no timer:
wander a sprawling hand-lit underground, crumble earth and stone with a satisfying
thunk, uncover glowing gem veins, geodes and fossils, soak in hot springs, and fill
an illustrated field journal. Energy refills at campfires; falling just knocks the
wind out of you.

**Play:** open `index.html` over any static file server (or the GitHub Pages URL).
Plain ES modules — **no build step, no dependencies, no CDN**.

```
python -m http.server   # then visit http://localhost:8000/
```

Append `?reset` to the URL to wipe your save and start over.

## Controls

| | Desktop | Mobile |
|---|---|---|
| Move | WASD / arrows | left-side virtual joystick |
| Dig | hold mouse toward a tile, or X / J | hold ⛏ button, or hold a finger on a wall |
| Jump | Space / W / ↑ | ⬆ button |
| Rest / shop | E | ✦ button |
| Journal | J or HUD button | HUD button |
| Sound | M or HUD button | HUD button |

## The loop

Dig → fill your satchel with gems → rest at a campfire or mine-cart to bank them as
**shards** → spend shards at Pemberley's tent (surface camp) on a sturdier pickaxe,
brighter lantern, bigger satchel → hardstone gates open into deeper, stranger biomes:
Amber Earth, Stone Depths, Crystal Caverns, Mushroom Hollows, Ember Hot Springs,
the Gilded Ruins, and the Still Lake at the very bottom.

## Art pipeline (painterly upgrade path)

Every visible object is a **loaded PNG** from `assets/` drawn with `drawImage` —
no vector shapes. The current sprites are procedurally generated, shaded pixel art
(see `tools/gen_assets.py` + `tools/sprites_data.py`, Python + PIL/numpy).

To upgrade to painterly art with **GPT Image 2**:

1. Open [`ASSET_PROMPTS.md`](ASSET_PROMPTS.md) — it lists every sprite with its exact
   filename, final pixel size, recommended generation size, transparency/tiling
   requirements, and a ready-to-paste prompt (prepend the shared style preamble).
2. Generate, downscale to the listed final size, cut out the background where marked.
3. Drop each PNG into `assets/` **with the same filename**. The loader hot-swaps
   whatever exists — zero code changes. Missing files fall back automatically.

`assets/manifest.json` is the machine-readable version of the same spec and is what
the game loads from.

## Engine notes (vanilla JS, ~13 modules)

- Fixed-step (60 Hz) physics accumulator decoupled from rendering; frame-rate independent.
- Destructible tile world (192×560) with chunk-canvas caching, dirty invalidation, culling.
- Lighting: low-res multiplicative lightmap + colored radial glows, additive bloom,
  god rays near the surface, baked vignette.
- Adaptive quality scaler (4 tiers) watches frame time and dials DPR, lightmap
  resolution, particle caps and effect passes **before** the 30fps floor is at risk.
- Pooled particles: dig chips, tumbling debris rocks (textured from the tile art),
  sparkles, dust motes, fireflies, drips, steam, smoke, splashes.
- Synthesized Web Audio: per-biome ambient pads, dig thunks, gem chimes, campfire
  crackle, drips — no audio files, mutable.
- localStorage saves (world edits, wallet, upgrades, journal, position).
