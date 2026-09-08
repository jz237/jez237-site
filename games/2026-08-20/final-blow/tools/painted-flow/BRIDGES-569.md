# Painted transitions and CPU tactics — 5.6.9

50 new transition drawings, five per fighter across the ten-character roster. Each source sheet also includes one unused guard calibration drawing. The existing source atlases remain unchanged.

The standing jab now retracts through two newly painted poses before the existing settling poses. Heavy punches load, extend, follow through, retract, and settle; preparation/recovery no longer reinsert a full-extension approach picture. Linked heavy attacks begin from an extended arm and launcher startup has two additional coiling/rising poses. Uppercuts retain their own rising-strike drawing through late contact instead of inserting a horizontal-cross follow-through before landing. Attack duration, active windows, damage and collision boxes are unchanged.

Strike-effect origins are calibrated to visible fist/boot tips for painted standing normals, in both facing directions. These anchors affect presentation only.

CPU additions: committed 7-tick approach, 14-tick retreat, 9-tick watch feints, a 300-tick cooldown and defensive aborts; per-character preferred legal confirmed routes; throws, low attacks or spacing resets after blocked strings. Existing delayed observations, reach checks, meter reserve and legal cancel rules still apply.

## Asset production

Mode: built-in imagegen, referenced-image edits. Reference montages use each fighter's shipped guard, jab contact, heavy preparation/contact/recovery and launcher artwork. Benny's first result added glasses and was rejected; a follow-up edit removed them before packing. Character-specific prompts preserve the Commissioner's cane, Deathblow's gauntlets, Devil's horns/wings/tail, Donald's club, and Post's spray can.

New files: `assets/bridges/<fighter>-v1.webp`, 1280×1280, 4×4 cells of 320px. Cells 1–5 are runtime transitions, cell 0 is calibration. `audit-v1.json` records source image filenames, uniform per-character scale and cell bounds. Pure magenta was keyed to alpha; all poses use one anatomical scale per fighter, support-foot alignment and a common floor. Feet finish at 312px with a 4px renderer floor offset; no individual-pose height normalization. Padding accommodates all anatomy and props.

## Generation prompt

Create a production painted 2D fighting-game sprite sheet for the EXACT character in the reference, retaining the face, age, costume, colors, anatomy, accessories and richly painted texture. The reference is character/style guidance, not an image to copy as a collage. SIX full-body drawings in a strictly equal 3-column by 2-row grid, read left-to-right. EVERY character faces RIGHT. Each isolated full body uses the same anatomical scale and a common floor line in its cell, with generous clear padding around hair, fists, elbows, toes and all accessories; nothing crosses a cell boundary. No text, borders, labels, shadows, motion trails or effects. Solid flat pure magenta #ff00ff background for clean extraction (no magenta on the character).
Cells:
0 top-left: relaxed upright fighting guard, both hands tightly closed fists, used to calibrate consistent body size.
1 top-middle: jab starting to retract, punching elbow now slightly bent, closed fist still three quarters extended toward right, other fist guards cheek; hips remain forward, feet planted.
2 top-right: continuation of that retraction, fist nearer chest, elbow tucked, hips winding to load the rear-hand heavy cross; never return to an idle pose. Both fists closed.
3 bottom-left: recovery immediately after a heavy cross, torso still rotated toward target, punching elbow bent 90 degrees with closed fist in front of chest; weight begins returning from front leg, both feet planted.
4 bottom-middle: uppercut anticipation, small knee bend, rear closed fist at lower ribs, lead fist covers cheek, body coiled, head looking RIGHT, both feet on floor.
5 bottom-right: middle of uppercut startup, rear closed fist rising past chest toward shoulder height, elbow bent, torso and knees uncoiling, other fist covering face, feet still planted.
These must be distinct, anatomically credible IN-BETWEEN poses rather than six held guards or six full-extension contacts. Keep identical proportions and costume detail throughout. Do not crop anything. All six figures have substantial empty magenta margins.

