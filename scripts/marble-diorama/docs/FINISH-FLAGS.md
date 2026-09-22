# Recovered finish flags

## Identity and source evidence

The original kind-0/subtype-5 actors are the paired checkered finish flags.
Earlier private audit notes tentatively called the Aerial pair steelies; that
identification was incorrect. Decoding the original Aerial image bank resolves
the identity: hardware images 0+1 combine into one four-bit flag pose, and 2+3
combine into the other. Each flag has two large checks in each direction.
The actor catalog is not evidence that all enemies have been recovered;
enemy placement and AI require their own audit.

Aerial scripts at 0x2758 and 0x2770 select table 0x2744 and repeat indefinitely
with divider 5. The second script waits eight updates first. The source actor
update at 0xfab2–0xfc88 draws before advancing the table. Loading enters the
animation state without incrementing its divider, and the initial graphic is
empty. Thus the first flag appears five updates after loading; the second
appears thirteen updates after loading. Ultimate uses a six-update delay.

| Course | First pole (column, row, source height) | Second pole | Camera band | Second delay |
|---|---|---|---|---|
| Practice | 72, 64, 16348 | 72, 68, 16348 | 16–29 | 8 |
| Beginner | 110, 109, 16116 | 114, 109, 16116 | 53–61 | 8 |
| Intermediate | 92, 101, 16124 | 96, 101, 16124 | 44–61 | 8 |
| Aerial | 113, 104, 16228 | 117, 104, 16228 | 43–64 | 8 |
| Silly | 19, 18, 16368 | 23, 18, 16368 | 0–6 | 8 |
| Ultimate | 88, 88, 16352 | 88, 90, 16352 | 25–48 | 6 |

Original images and extracted course fixtures remain private reference data.
The implementation contains newly modeled cloth and poles, not copied images.

## Implementation

Optional `finishFlags` definitions share the native camera's original-update
clock and load/unload boundaries. Pending transitions survive fractional
updates. Both flags retain separate wait, divider and frame state in simulation
snapshots. Rendering interpolates the two cloth poses while holding each pole
and cloth attachment fixed. The flags remain nonblocking finish scenery.

The cloth silhouette, pole dimensions and 3D orientation are interpretations,
not pixel-exact source geometry. The native fixtures' 20 Hz update rate remains
provisional. Courses without this optional definition retain their existing
goal markers; this change alone does not update the public campaign.

## Validation

- Independent interpretation of all six original scripts matches 12,000 actor
  observations, including unload/reload and Ultimate's different delay.
- Five automated tests cover cadence, startup delay, latched camera transitions,
  validation, moving cloth with fixed attachments, snapshot continuation and
  identical physical outcomes/collider counts with and without flags.
- On the recovered Aerial board, a local finish-area start with the **unaltered
  43–64 camera band** loads the flags at simulation tick 1074, band 43. Subsequent
  frames occur at +5/+10/+15… and +13/+18/+23… original updates, with zero falls.
  This is a local activation check, not a complete course traversal.
- Browser inspection shows the separate cream/black cloth poses and stable
  poles with no captured warnings/errors. The visual preview starts near the
  finish and overrides its band to 0–64 for immediate inspection; that override
  is absent from the recovered full-course fixture and activation check.

Full native-course acceptance and publication remain pending.
