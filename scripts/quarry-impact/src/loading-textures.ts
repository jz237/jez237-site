import {DefaultLoadingManager} from 'three';
import manifest from './loading-textures.json';

/** Select only generated image variants. Data masks and authored model URLs are untouched. */
if (typeof location !== 'undefined') {
  const base = new URL(import.meta.env.BASE_URL, location.href);
  const profile = matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop';
  const variants = manifest as Record<string, {desktop?:string; mobile?:string}>;
  DefaultLoadingManager.setURLModifier(file => {
    const source = new URL(file, location.href);
    if (source.origin !== base.origin || !source.pathname.startsWith(base.pathname)) return file;
    const alternative = variants[source.pathname.slice(base.pathname.length)]?.[profile];
    return alternative ? new URL(alternative, base).href : file;
  });
}
