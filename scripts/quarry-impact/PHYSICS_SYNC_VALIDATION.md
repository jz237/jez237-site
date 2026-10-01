# Shared vehicle physics — local development, 2026-10-01

Full Wreckfest 2 parity remains incomplete. This update is local only, not installed on VENGEANCE or deployed. Outgoing transfer remains pending explicit human approval following automatic review rejection.

## Change and reason

The browser and authoritative server had diverged in chassis inertia, center of mass, damping, restitution, suspension and driving calculations. Both now use a renderer-independent constructor and driving kernel. The server uses stock specifications; solo tuning and damaged-wheel response retain the preceding behavior. Pure specification and axle calculations are shared without importing browser livery/Canvas code into the Worker.

The room geometry audit now selects the actual online derby layout instead of the expanded solo layout. It still checks collider/prop geometry and transforms, corridor clearance, and every original cliff collider vertex. For the existing tessellated visible cliff relief, every reference vertex and triangle center must project onto the shared collider within 0.001 m, and visible displacement remains bounded at 0.28001 m. No world geometry was changed.

## Evidence

- All 15 backend room tests pass, including authoritative handling, pavement transitions, contacts, damage, reconnect, restoration and geometry.
- Three new checks pass: frozen pre-change solo physics across all three cars, stock/tuned setups, damaged wheels and 900 variable time steps; browser/server stock handling through 600 ticks for each car; exact historical source recovery.
- The frozen solo comparison checks position and quaternion components within 0.00001, gear equality and RPM within 0.0001. Browser/server position tolerance is 0.0001 m. The latter stays in clear terrain; it does not assert collision-damage parity.
- The final targeted regression run passes 65 checks. Two additional historical suites pass 12 checks and fail three asset audits on missing local files: source/coupe-realism-physics.json (two checks), and source/fx/manifest.json (one check). Total: **77 passing, 3 unable to complete due to missing fixtures**. No full-suite green claim.
- Frontend TypeScript/Vite and backend TypeScript checks pass. Bundle: index-Dib0K6-k.js / index-Cgmj3fND.css. Existing partial-copy font warning and large-bundle warning remain.
- Read-only downloads supplied circuit-surface-base.json and the reference/structural/drive-feel revision manifests from VENGEANCE; these baseline artifacts are not outgoing patch changes.

Logs: work/physics-final-regression.log, physics-drive-feel.log, physics-structural.log, physics-build.log and physics-backend-check.log. Test files run directly with node --import tsx to retain individual test diagnostics. The tsx CLI cannot create its IPC socket in the local sandbox; direct Node execution avoids that tooling limitation.

## Remaining scope

The subsequent local online-damage milestone replaces collision adjudication and adds per-corner mechanical damage; see ONLINE_DAMAGE_VALIDATION.md. Tuned online cars remain unsupported. Full-scene multiplayer rendering, sustained load, remote regression, Cloudflare deployment and real peripheral checks remain outstanding. Eight online seats, one quarry and three base cars remain far short of the full feature goal. Historical missing-asset audits must be completed on a full source copy before release.

## Package and installation boundary

The cumulative development package includes pending livery, controls, cups and this physics synchronization. Frozen physics snapshots extend the audit chain before cups and preserve the downloaded server simulation/test bytes. Existing remote files always have captured before hashes; they are never treated as new merely because they were untracked locally. The package excludes dependencies, assets, player state, credentials and scratch servers.

Installation requires destination hash comparison, backup, an isolated backend copy and full remote validation. The candidate multiplayer directory on VENGEANCE is a junction to the original; do not edit it as an isolated checkout. The previously rejected outgoing transfer has not been retried. Production and the public site remain at the installed route release.
