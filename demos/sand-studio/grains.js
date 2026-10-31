// Continuous, bounded teaching trajectories. Individual grains are not a DEM solver.
export function sampleGrain(s, phase, mobility, height, size, out){
 const cycle=s.h*Math.PI*2+phase*s.speed*.53;
 const lift=.5+Math.asin(.97*Math.sin(cycle))/(2*Math.asin(.97));
 const angle=s.a+Math.sin(cycle*.5+s.phase)*.19*mobility+Math.sin(phase*.13+s.phase)*.09*mobility;
 const radial=Math.min(.91,s.r*(1+Math.sin(cycle+s.phase)*.055*mobility));
 const grainSize=s.s*(.8+size*.004);
 const ripple=(Math.sin(angle*3+phase*.9)+Math.sin(angle*5-phase*.6))*.009*mobility;
 out[0]=Math.cos(angle)*radial;out[1]=1.14+grainSize+lift*Math.max(0,height*(1+ripple)-grainSize*2);out[2]=Math.sin(angle)*radial;
 out[3]=grainSize;out[4]=cycle;return out;
}
