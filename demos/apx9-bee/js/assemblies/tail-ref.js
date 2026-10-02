// DEV ONLY stand-in for the abdomen shell so the tail can be judged alone (?only=tail&demo=tail-ref). Deleted before hand-off.
import { K, M, revolve } from '../kit.js';

export async function build(ctx) {
  const { bee } = ctx;
  const p = bee.part('tail-ref-shell', {
    name: 'Tail reference shell', group: 'abdomen-shell', matrix: K.abdomen.frame, explode: [0, 0, 0],
    info: 'Development stand-in for the abdomen shell, used only to check the tail fit.',
  });
  // lathe about +Y with y = a (distance behind the petiole): rotate +90 deg about Z so that y -> -x
  const pts = [[0.001, 5.6]];
  for (let a = 5.6; a <= 9.0001; a += 0.2) pts.push([K.abdomen.R(a), a]);
  pts.push([K.abdomen.R(9) - 0.25, 9.0]);
  pts.push([K.abdomen.R(9) - 0.25, 8.7]);
  const g = revolve(pts, { segments: 64, steps: 1 });
  g.scale(1, 1, K.abdomen.aspect);
  g.rotateZ(Math.PI / 2);
  p.add(g, M.yellow);
}
