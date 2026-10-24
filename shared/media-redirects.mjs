// Cloudflare bundles this JSON import, including its older Pages compiler.
import manifest from "../media-r2-manifest.json";
import { createMediaRedirectHandler } from "./media-redirect-handler.mjs";

export const migratedMediaResponse = createMediaRedirectHandler(manifest);
