import * as T from 'three';
import { url } from './assets';

/** Linear material weights; U increases world X and V increases world Z. */
export const ARENA_MASK_SIZE = 1024;
export const ARENA_MASK_BOUNDS = [-48, -48, 48, 48] as const;
export const ARENA_MASK_CHANNELS = ['compaction', 'fineSediment', 'looseAggregate', 'wetness'] as const;
export const ARENA_MASK_PATH = 'assets/arena-floor-mask.rgba.gz';

let pending: Promise<T.DataTexture> | undefined;

/** One shared, application-lifetime texture. Loading never touches world RNG. */
export function loadArenaFloorMask(): Promise<T.DataTexture> {
  if (!pending) pending = load().catch((error: unknown) => {
    // Allow a later explicit retry. A caller's neutral fallback remains valid.
    pending = undefined;
    throw error;
  });
  return pending;
}

async function load(): Promise<T.DataTexture> {
  const response = await fetch(url(ARENA_MASK_PATH));
  if (!response.ok) throw new Error(`Arena mask request failed: ${response.status}`);
  if (!response.body) throw new Error('Arena mask response has no body');
  const stream = response.body.pipeThrough(new DecompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  const expected = ARENA_MASK_SIZE * ARENA_MASK_SIZE * 4;
  if (bytes.length !== expected) throw new Error(`Arena mask byte count ${bytes.length}; expected ${expected}`);
  const texture = new T.DataTexture(bytes, ARENA_MASK_SIZE, ARENA_MASK_SIZE, T.RGBAFormat, T.UnsignedByteType);
  texture.name = 'AuthoredArenaMaterialMask';
  texture.colorSpace = T.NoColorSpace;
  texture.flipY = false;
  texture.wrapS = texture.wrapT = T.ClampToEdgeWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}
