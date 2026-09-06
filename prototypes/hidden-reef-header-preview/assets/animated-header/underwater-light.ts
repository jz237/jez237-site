// Both water and lettering evaluate this field at the same screen position and time.
export const underwaterLight = `
float lightShafts(vec2 p, float t) {
 float light=0.;
 for(int i=0;i<7;i++) {
  float n=float(i);
  float origin=.20+n*.10+sin(t*.34+n*1.7)*.052;
  float bend=.15*sin(n*2.3+t*.38)+.035*sin(t*.67+n);
  float center=origin+p.y*bend;
  float width=.012+p.y*.026;
  float beam=exp(-pow((p.x-center)/width,2.));
  float pulse=.62+.38*sin(t*.85+n*1.8);
  float depthFade=exp(-p.y*2.6)*(1.-smoothstep(.60,1.,p.y));
  light+=beam*pulse*depthFade;
 }
 return light;
}
float waterCaustics(vec2 p,float t) {
 vec2 q=p*vec2(105.,58.);
 float a=sin(q.x+sin(q.y*.7+t*.57)*1.9+t*.38);
 float b=sin(q.y+sin(q.x*.53-t*.46)*1.8-t*.31);
 return pow(max(0.,a*b),7.);
}`;

/** Same ray field as the GPU, for lighting the canvas fish sprites. */
export function sampleUnderwaterLight(x: number, y: number, t: number) {
  const depth = Math.max(0, Math.min(1, (y - 0.6) / 0.4));
  const fade = Math.exp(-y * 2.6) * (1 - depth * depth * (3 - 2 * depth));
  let light = 0;
  for (let n = 0; n < 7; n++) {
    const origin = 0.2 + n * 0.1 + Math.sin(t * 0.34 + n * 1.7) * 0.052;
    const bend =
      0.15 * Math.sin(n * 2.3 + t * 0.38) + 0.035 * Math.sin(t * 0.67 + n);
    const beam = Math.exp(
      -Math.pow((x - origin - y * bend) / (0.012 + y * 0.026), 2),
    );
    light += beam * (0.62 + 0.38 * Math.sin(t * 0.85 + n * 1.8)) * fade;
  }
  return light;
}
