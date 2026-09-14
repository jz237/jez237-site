const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function rideSoundMix(memory,r,depth,time){const h=r.hydro,dt=memory.time===undefined?0:clamp(time-memory.time,0,.2);if(memory.time!==undefined&&time<memory.time){memory.slap=memory.drain=0;memory.landing=h.landingId;}memory.time=time;
 if(memory.landing!==undefined&&h.landingId!==memory.landing)memory.drain=clamp(h.impact/10);memory.landing=h.landingId;
 const attack=Math.max(0,(h.load||1)-(memory.load??1)-.5)*h.wet;memory.load=h.load||1;memory.slap=Math.max((memory.slap||0)*Math.exp(-dt*14),clamp(attack*.11));memory.drain=(memory.drain||0)*Math.exp(-dt*.85);
 const rattle=clamp((Math.abs(h.rollVelocity||0)*.16+Math.abs(h.pitchVelocity||0)*.14+Math.max(0,(h.load||1)-1)*.06)*h.wet)*(.55+.45*Math.sin(time*93)**2);
 return {slap:memory.slap*.30,rattle:rattle*.065,drain:memory.drain*.085,cutoff:18000-(18000-620)*clamp(depth/.45),rattlePitch:120+clamp(r.speed/30)*110};
}
export class RideSound{
 constructor(ctx,bus,noise){this.ctx=ctx;this.memory={};this.nodes=[];const make=(kind,type,freq)=>{const source=kind==='tone'?ctx.createOscillator():ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();if(kind==='tone'){source.type='triangle';source.frequency.value=170;}else{source.buffer=noise;source.loop=true;}filter.type=type;filter.frequency.value=freq;filter.Q.value=.8;gain.gain.value=0;source.connect(filter).connect(gain).connect(bus);source.start();this.nodes.push({source,filter,gain});return {source,filter,gain};};this.slap=make('noise','bandpass',360);this.rattle=make('tone','highpass',90);this.drain=make('noise','bandpass',1900);}
 update(r,depth,time,paused=false){const mix=rideSoundMix(this.memory,r,depth,time),t=this.ctx.currentTime;for(const key of ['slap','rattle','drain'])this[key].gain.gain.setTargetAtTime(paused?0:mix[key],t,key==='slap'?.012:.045);this.rattle.source.frequency.setTargetAtTime(mix.rattlePitch,t,.05);return mix;}
 dispose(){for(const n of this.nodes){n.source.stop();n.source.disconnect();n.filter.disconnect();n.gain.disconnect();}}
}
