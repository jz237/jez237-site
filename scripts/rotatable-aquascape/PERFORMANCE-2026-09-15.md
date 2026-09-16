# Detail-preserving load and rendering pass

The user no longer has access to the slow Radeon R9 200 desktop. These are local
measurements and data checks, not a claim about FPS on that computer.

## Loading (b315c9631, a086137c3 and this pass)

- 27 content-addressed model, texture and lighting assets preload from the HTML.
- Lossless WebP copies of two PNG atlases save 1,124,933 bytes. Decoded pixel bytes
  are verified; JPEG scans, masks, geometry and baked lighting retain their data.
- React and the complete filter exhibit load only on explicit filter opening.
- Initial entry bundle: 1,856.55 KB / 520.40 KB gzip before this loading work;
  1,607.27 KB / 437.31 KB gzip after this pass. Filter remains a separate chunk.
- Immutable caching applies only to content-addressed assets; HTML revalidates.
- Local ready times remain approximately 2-3 seconds. Earlier requests and smaller
  payloads are verified; a total-load speedup on the inaccessible desktop is not.

## Hardscape startup and GPU reuse

Hidden Reef's CSP rejected the former WebAssembly encoder, so it fell back to the
original index order. A licensed JavaScript port of meshoptimizer's face ordering
now works without loosening CSP or downloading another asset. Identical branch
and rock topologies are ordered once, with a full equality check after hashing.
It runs after deterministic moss sampling. Attributes and oriented faces remain
unchanged, including normals and UV seams.

Local five-run startup comparison, 12 branches and 10 placed rocks:
previous encoder/repeated work 166-176 ms; new cached topology pass 56-67 ms.
This measures that step, not total page readiness. Across the seven source scans,
a simulated 16-entry vertex cache misses 97,811 times versus 248,973 originally.
Cache simulation is not GPU time or FPS.

## Corydoras

Exact indexing retains the order and all 27,974 triangles, including transparent
fins. Every expanded position, normal, color, UV, part and pivot attribute matches
the previous model bit for bit (golden SHA-256 tests). No tolerance-based merging.
Stored vertices fall from 83,922 to 17,468. Simulated 16-entry cache misses total
21,855 versus 83,922 previous unindexed invocations; actual GPU reuse varies.
The center body pose is computed once instead of three times; both finite-
difference normal samples and depth/shadow deformation retain their expressions.

## Validation

191 tests pass, including exact model data, degenerate/disconnected/32-bit index
cases, disabled-WebAssembly operation, shader hooks, animal behavior, collisions,
chemistry, adaptive quality and loading. Production build, three-copy sync and
38-page Hidden Reef link checks pass. Local browser renders full effects at 60 FPS
on an RTX 5090 with no shader errors; this is a correctness/smoke check, not a
before/after performance result for the user's slower computer.
