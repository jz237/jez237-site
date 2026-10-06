# Hosted Elderwood demo

Original project: https://github.com/vibegameengine/web-starter-kit-webgpu-pipline
Upstream snapshot: ca576b6 (main, copied 2026-10-06).

## Reproducible build

Use Node.js 22 or later, npm and git:

```
npm ci --ignore-scripts
npm run setup:hosted
npm run build:hosted
```

The setup script checks out the original author's Three.js and React Three Fiber forks at pinned commits, then builds Fiber's reconciler. Those dependencies were referenced by upstream's config but omitted from its repository. The corrected package lock includes the missing React/build dependencies.

Serve `dist/` over HTTPS (localhost is allowed for development). All URLs are relative, for both a domain subdirectory and GitHub Pages. WebGPU-capable desktop hardware is required; there is no WebGL substitute. Start with the Lighting studio, then explore the heavier scenes. First launch bakes lighting; large scenes can take minutes.

## Hosting adaptations

- Added a scene-selection homepage and a return link; the original renderer entry is `scene.html`.
- Production settings use localStorage; production lightmap/probe caches use CacheStorage. No authoring-server endpoints or credentials are needed. Development mode retains the upstream server workflow.
- The vendor GUI icon font is emitted as a local WOFF file to respect the existing site security policy.
- Original scene/shader design is retained. Inspector is off in launch links to avoid unnecessary overhead; the lighting controls remain available.
- Third-party notices are distributed with the static copy. The upstream project does not declare a project-wide licence; this fork does not add a licence to its code or claim authorship.
- Extra development scenes are retained in source but not advertised as verified hosted scenes.

The beach check used the upstream `van=0` option because `public/models/nomad/nomad-van.glb` was not published in the source repository. No replacement model or shader downgrade is used.

Browser verification also exposed an upstream beach lightmap-chart error after omitting the absent van. The beach is therefore not offered in the hosted launcher; its original code remains in the fork. The hosted launcher offers the verified lighting studio, village study and sky lab. This port does not weaken the renderer’s validation or substitute a different rendering pipeline.
