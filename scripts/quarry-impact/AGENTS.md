# Quarry deployment storage (user instruction, 2026-10-08)

Do not create new full-site copies of jez237.com, on D: or elsewhere. Reuse the newest existing `quarry-*-public-*` staging directory under `D:/Projects/hidden reef header/work`, synchronizing changed public files and deleting stale files. Rebuild the Pages Functions bundle through the mandatory website deployment wrapper.

Use `node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --deploy` after the normal source/runtime checks and committed, pushed website update. `--check` only compares files. The helper calls the existing preview/production verification wrapper and, only after success, cleans old stages and `quarry-backup-before-*` folders, retaining the newest one of each. Preserve the current recovery backup during failed deployments. Do not reuse historical `*-public.mjs` snapshot helpers or generate new ones from the old release templates.

Source checkouts and the private Philadelphia aircraft relay are not staging folders and must be preserved.
