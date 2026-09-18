# Aquarium release checks

Run `npm run check:release` before publishing. It runs the animal behavior and
collision tests, builds/synchronizes the three site copies, then runs desktop and
phone-size Chrome checks. Install dependencies with `npm ci`; Chrome must be
installed (`QA_BROWSER_CHANNEL` can select another installed Playwright channel).

Screenshots and browser/performance reports are saved in `.qa-results/`.
Checks include failed asset requests, JavaScript errors, missing model textures,
inhabitant counts, coarse image differences, observation controls, and CPU/render/
frame-time p95 regressions. The motion tests exercise feeding and full-body
collisions in the planted habitat. No picture-quality reduction is applied.

`npm run check:release -- --record-baseline` deliberately replaces the reference
images' coarse signatures and performance measurements. Review both screenshots
before accepting a new baseline; do not use this flag to hide a regression.
Performance comparisons require the same reported GPU and viewport. The threshold
is 40% plus 5 ms to tolerate background noise; it is a regression alarm, not a
guarantee of FPS on all hardware. Phone viewport testing does not emulate a phone
GPU. The coarse visual check tolerates moving fish and is supplemented by asset
and texture checks; small rendering defects still need human screenshot review.

Successful checks write `qa/approved-build.json`, tied to the shipped JS/CSS and
public model/texture assets. Existing Cloudflare deployment guards and GitHub
Pages refuse an aquarium build whose receipt is missing or stale. Commit the
receipt with the source and synchronized build. Unrelated site changes do not
require rerunning the aquarium tests.

After both deployments, run `npm run check:live` to compare both production
entries, every active JS/CSS chunk and the angelfish model against the local build.
