# Hosted Coastal Village / Beach Diorama

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

Serve `dist/` over HTTPS (localhost is allowed for development). All URLs are relative, for both a domain subdirectory and GitHub Pages. WebGPU-capable desktop hardware is required; there is no WebGL substitute. Only the full coastal village diorama from Pavel’s October 5 video is hosted. First launch bakes lighting and can take minutes. Drag to orbit, scroll to zoom, and open Controls to adjust the scene.

## Hosting adaptations

- A single entry opens `midsee-village`, matching https://x.com/PashaIGooD/status/2107201960239595943. No scene gallery or other demos are offered.
- Production settings use localStorage; production lightmap/probe caches use CacheStorage. No authoring-server endpoints or credentials are needed. Development mode retains the upstream server workflow.
- The vendor GUI icon font is emitted as a local WOFF file to respect the existing site security policy.
- Original scene/shader design is retained. Inspector is off in launch links to avoid unnecessary overhead; the lighting controls remain available.
- Third-party notices are distributed with the static copy. The upstream project does not declare a project-wide licence; this fork does not add a licence to its code or claim authorship.
- Other upstream development scenes remain in source, but the hosted entry always selects the full coastal village.
