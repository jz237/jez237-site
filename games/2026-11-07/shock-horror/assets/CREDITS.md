# Gold Digger: character credits

## `digger.glb`

- **Body, face, clothes and idle motion**: avatar `Wood_Male_01` and its `idle_breathe_01` and
  `idle_look_around_01` motion captures from the [Microsoft Rocketbox Avatar Library](https://github.com/microsoft/Microsoft-Rocketbox)
  (© Microsoft Corporation, MIT licence, included as `LICENSE-Rocketbox.md`). The same avatar ships with this site's
  Tidewater as `joe.glb`. Paper: M. Gonzalez-Franco et al., "The Rocketbox Library and the Utility of Freely
  Available Rigged Avatars", Frontiers in Virtual Reality, 2020.
- **Walk, run, jump, hit, knockdown, KO, get-up and victory motion**: the humanoid clip bank made with Meshy for
  this site's Final Blow (`games/2026-08-20/final-blow/3d/fighters/`), retargeted onto the Rocketbox skeleton by
  `scripts/gold-digger/build_digger.mjs`.
- **Helmet and lamp, pickaxe, pack**: built in code (`js/models.js`, `minerGear()`).

Climbing, swimming, the two-handed pickaxe swings, throwing, gripping hands and landing dips are procedural layers
in `js/digger.js` (two-bone IK on top of the motion capture).
