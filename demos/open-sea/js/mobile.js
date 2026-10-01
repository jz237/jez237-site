// Allocate the phone tier before creating FFT/reflection/render targets.
export function mobileProfile(){
  return matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<=900;
}
export function backingSize(width,height,dpr,res,mobile){
  let scale=Math.min(dpr,2)*res;
  // A high-DPR Android display need not shade four million fragments per pass.
  // Keep the same aspect and enough pixels for rigging and filtered glitter.
  if(mobile)scale=Math.min(scale,Math.sqrt(1050000/(width*height)));
  return [Math.max(64,Math.round(width*scale)),Math.max(64,Math.round(height*scale))];
}
