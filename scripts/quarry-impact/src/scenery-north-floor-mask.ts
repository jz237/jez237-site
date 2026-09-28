import * as T from 'three';
import { url } from './assets';
import spec from '../source/north-forest-floor.json';

/** Data weights, not display colors. X increases with U, Z increases with V. */
export const NORTH_FLOOR_SIZE = spec.size;
export const NORTH_FLOOR_BOUNDS = spec.bounds;
export const NORTH_FLOOR_PATH = 'assets/north-forest-floor.rgba.gz';
let pending: Promise<T.DataTexture> | undefined;

export function loadNorthForestFloor(): Promise<T.DataTexture> {
  return pending ??= load().catch((error: unknown) => { pending = undefined; throw error; });
}

async function load(): Promise<T.DataTexture> {
  const response = await fetch(url(NORTH_FLOOR_PATH));
  if (!response.ok || !response.body) throw new Error(`Forest floor mask request failed: ${response.status}`);
  const bytes = new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  const [width, height] = NORTH_FLOOR_SIZE;
  if (bytes.length !== width * height * 4) throw new Error(`Forest floor mask has invalid byte count ${bytes.length}`);
  const mask = new T.DataTexture(bytes, width, height, T.RGBAFormat, T.UnsignedByteType);
  mask.name = 'NorthForestFloorWeights';
  mask.colorSpace = T.NoColorSpace;
  mask.flipY = false;
  mask.wrapS = mask.wrapT = T.ClampToEdgeWrapping;
  mask.magFilter = T.LinearFilter;
  mask.minFilter = T.LinearMipmapLinearFilter;
  mask.generateMipmaps = true;
  mask.needsUpdate = true;
  return mask;
}
