/** A synthesised crowd roar for big moments (takedowns, wrecks, heavy hits): band-passed
 * noise in three voice-like bands with a swelling envelope, plus a whistle on the biggest
 * moments. No audio files; routed through the ambience bus so the ambience level applies. */
export type RoarContext=Pick<AudioContext,'currentTime'|'sampleRate'|'createBuffer'|'createBufferSource'|'createBiquadFilter'|'createGain'|'createOscillator'>;
export const ROAR_COOLDOWN=.9;
export class CrowdRoar{
 private noise:AudioBuffer|null=null;
 private last=-10;
 constructor(private ctx:RoarContext,private destination:AudioNode){}
 private buffer(){
  if(this.noise)return this.noise;
  const length=Math.floor(this.ctx.sampleRate*2.5),buffer=this.ctx.createBuffer(1,length,this.ctx.sampleRate),data=buffer.getChannelData(0);
  // Pink-ish noise (Paul Kellet's economy filter) so the roar is warm rather than hissy.
  let b0=0,b1=0,b2=0;for(let i=0;i<length;i++){const w=Math.random()*2-1;b0=.99765*b0+w*.099046;b1=.963*b1+w*.2965164;b2=.57*b2+w*1.0526913;data[i]=(b0+b1+b2+w*.1848)*.2;}
  return this.noise=buffer;
 }
 /** intensity 0..1; returns false when rate-limited or too quiet to play. */
 roar(intensity:number){
  const c=this.ctx,now=c.currentTime,level=Math.max(0,Math.min(1,intensity));
  if(level<.05||now-this.last<ROAR_COOLDOWN)return false;
  this.last=now;
  const duration=1.4+level*1.6,peak=.22+level*.38;
  const out=c.createGain();out.gain.setValueAtTime(0,now);out.gain.linearRampToValueAtTime(peak,now+.22);out.gain.setTargetAtTime(peak*.55,now+.5,.35);out.gain.setTargetAtTime(0,now+duration*.6,duration*.25);out.connect(this.destination);
  for(const [frequency,q,gain] of [[320,.9,.9],[820,1.1,.75],[1750,1.4,.35]] as const){
   const source=c.createBufferSource();source.buffer=this.buffer();source.loop=true;source.playbackRate.value=.92+Math.random()*.16;
   const band=c.createBiquadFilter();band.type='bandpass';band.frequency.value=frequency*(0.95+Math.random()*.1);band.Q.value=q;
   const g=c.createGain();g.gain.value=gain;source.connect(band);band.connect(g);g.connect(out);
   source.start(now,Math.random()*2);source.stop(now+duration+.4);
  }
  if(level>.75){
   const whistle=c.createOscillator(),wg=c.createGain();whistle.type='sine';whistle.frequency.setValueAtTime(1900,now+.15);whistle.frequency.linearRampToValueAtTime(2500,now+.45);whistle.frequency.linearRampToValueAtTime(2100,now+.7);
   wg.gain.setValueAtTime(0,now+.15);wg.gain.linearRampToValueAtTime(.05,now+.25);wg.gain.linearRampToValueAtTime(0,now+.72);whistle.connect(wg);wg.connect(out);whistle.start(now+.15);whistle.stop(now+.75);
  }
  return true;
 }
}
