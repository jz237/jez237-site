# Ocean Water Lab

Self-hosted from https://github.com/rahulbhola877/ocean-water-lab
by Rahul Bhola, MIT license. Upstream v1.4.0, commit 0b5325111e635eaa2418bd104a240d2c2fff2af6.

Original ocean engine and tools preserved. Site additions: gallery/creator links and pointer-operated helm buttons for phones.

Rebuild from repository root:
```sh
node scripts/ocean-water-lab/demo/build.mjs
cp scripts/ocean-water-lab/demo/dist/index.html demos/ocean-water-lab/index.html
node scripts/build-demos.mjs
```

Requires WebGL2; complex scenes are GPU-intensive. Original source and engine exports are retained under scripts/ocean-water-lab.
