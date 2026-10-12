# Writing a species

Each animal is one Python file in `species/<id>.py` with a `build()` function returning an
`anatomy.Body`. `species/trex.py` is the worked example; read it first.

## Coordinates

- Animal space, metres, real size.
  - **+x** forward, towards the snout.
  - **+y** the animal's left.
  - **+z** up.
  - **Origin** on the ground below the hip joints.
- Feet rest on z ≈ 0.
- Write the left side once, collect those primitives in a list, then call `b.mirror_y(list)`.
  Mirroring renames bones `.L` → `.R`.

## Skeleton: bone names are a contract

The animation generators find bones by name, so use exactly these:

| Part | Bones |
|---|---|
| Root and pelvis | `root` (ground, pointing up), `pelvis` (hip-joint centre, pointing forward) |
| Spine (pelvis → shoulders) | `spine1` … `spineN`, each the child of the previous |
| Neck | `neck1` … `neckN` |
| Head and jaw | `head`; optional `jaw` (child of `head`, pivot at the jaw joint) |
| Tail | `tail1` … `tailN`, from the hips backwards, child of `pelvis` |
| Hind legs (`.L` and `.R`) | `thigh` (hip→knee), `shin` (knee→ankle), `meta` (ankle→ball of foot, the ground-contact point), `toe` (ball→tip of the middle toe) |
| Forelimbs (`.L` and `.R`) | `upperarm` (shoulder→elbow), `forearm` (elbow→wrist), `hand` (wrist→ground-contact point for quadrupeds; for bipeds, the fingers). Quadruped forearms hang from the last `spine` bone. |
| Pterosaur wings (`.L` and `.R`) | `upperarm`, `forearm`, `hand` (the wing metacarpal), `wingfinger1`, `wingfinger2`, `wingfinger3` |
| Extras | Other bones are allowed, e.g. a `frill`, a `crest` or a `throat`, but give them a parent from the list above. |

- Skin weights come from the bindings, so every flesh primitive must be bound.
  - `bind=S['bone']` binds rigidly.
  - `b.loft_chain(...)` blends along a chain of bones.
- Choose a rest pose that is mid-stance with joints slightly bent.
- Keep the jaw a few degrees open (see `JAW_OPEN` in trex.py) so the lips separate cleanly.

## Flesh: signed-distance primitives (sdf.py, anatomy.py)

- `Loft(sections, side=...)`
  - A tube along a smooth curve.
  - Each `sec(p, w, top, bot, nt, nb)` gives:
    - the centre point;
    - the half-width (along `side`);
    - the extent above and below the centre line;
    - super-ellipse exponents (2 = ellipse, 3–4 boxier, under 2 diamond-like).
  - For a vertical limb with `side=(0,1,0)`, "top" points forward and "bot" points back.
- `Ellipsoid(c, r, R=rot_euler(...))`, `RoundCone(a, b, ra, rb)`, `Box(c, half, R, round)`.
- `horn(base, tip, r0, bend, side)` and `claw(base, dir, length, radius, curl, side)` are tapering curved keratin shapes.
- `Xform(prim, R, pivot)` rotates a primitive rigidly. trex.py uses it to open the jaw.
- Every primitive takes:
  - `k`: smooth-union blend radius in metres. Big for muscle masses (0.1–0.3), small for claws.
  - `op`: `'union'` (default) or `'sub'`.
  - `tag`: `skin`, `keratin`, `claw`, `mouth`, `eye`, `osteo`, `tooth`, `feather`, `membrane`.
  - `bind`.
  - `detail`: how much fold and scale relief the region gets (0–2).
  - `accent`: 0–1, how much this part takes `palette['accent']`. Use it for frills, plates, crests and throat colour.
  - `region`: UV island. It defaults from the bound bone.
    - Set `region='foot.L'` on toes and pads.
    - Set `region='head'` on head parts bound to other bones.
- The primitive named `'axial'` (one loft from tail tip to head, bound to the whole spine chain) is required. Countershading and UV seams are measured around it.
- Order matters:
  1. Unions first.
  2. Then subtractions (mouth slit, nostrils, eye sockets).
  3. Then small unions that must not be cut.
- Eyes and teeth are **not** field shapes. Add them as `b.attachments`; see trex.py.
- Shapes should overlap generously and blend with `k`. A part that only touches the body leaves a crease.

## Meta (`b.meta`)

```python
b.meta = dict(
    name='Triceratops horridus', common='Triceratops', length=8.5, mass_t=8.0,
    voxel=0.012,            # grid voxel in metres; aim for ~length/700 (T. rex 12.3 m -> 0.016)
    faces=60000, tex=2048,  # game mesh triangles, texture size
    tail_split=-2.0,        # x below which the body's UV island becomes a separate tail island
    jaw_open=..., palette=dict(back=, flank=, belly=, pattern=, accent=, accent2=(optional), keratin=,
                     claw=, mouth=, eye=, osteo=(optional)),
    accent_grad=[z_lo, z_hi],   # optional: accent -> accent2 with height (plate rims, frill edge)
    pattern=dict(kind='bands'|'stripes'|'spots'|'mottle'|'none', count=, start=, end=, strength=,
                 mottle=, low=, high=),   # start/end: x range in metres; low/high: the dorsal mask
    scales=dict(base=0.03, feature=0.07, tubercle=0.0, tubercle_density=0.2, border=0.35, folds=0.6),
    gait=dict(kind='biped'|'quad'|'flyer', stride=, duty=, speed=, ...),
)
```

Colours are hex sRGB. Take palettes, proportions and gait numbers from the research spec at
`~/.cache/jurassic-terrarium/dino-research.md`.

## Iterating

```bash
cd scripts/jurassic-terrarium/blender
python3 grid.py <id> --voxel 0.03 --jobs 8      # coarse grid for a quick look (seconds)
blender -b -P preview.py -- <id> side three front top 2>&1 | grep -E 'MESH|Error|Traceback'
# renders ~/.cache/jurassic-terrarium/work/<id>/preview/<id>-{side,three,front,top}.png (clay)
```

- Compare `-side.png` with the reference plate `~/.cache/jurassic-terrarium/refs/<id>-side.png`.
  It is an orthographic side view, animal facing left.
- Check proportions numerically against the research spec too: total length, hip and shoulder
  heights, head size.
- Look for creases where parts meet, lumps, pits and missing parts.
- Full textured build, once the shape is right: `./make.sh <id> grid,mesh,bake`. Look at the
  results in `work/<id>/tex/`.
- Do not edit the shared files (`sdf.py`, `anatomy.py`, `build.py`, `material.py`, `anim.py`,
  `rig.py`, `blib.py`). Put helpers you need inside your species file.
- Use `--jobs 8` on `grid.py`: other sculptors share the machine.
- Delete scratch renders you no longer need.
