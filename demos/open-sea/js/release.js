// An open simulation keeps its camera and settings when a release changes.
// Offer a refresh on returning to it, instead of leaving an old version invisible.
export function watchRelease(){
 const loaded=document.querySelector('meta[name="ocean-release"]')?.content;
 if(!loaded)return;
 let busy=false,lastCheck=0;
 const check=async()=>{
  if(busy||document.hidden||Date.now()-lastCheck<30000)return;
  busy=true;lastCheck=Date.now();
  try{
   const response=await fetch(new URL('../index.html',import.meta.url),{cache:'no-store',signal:AbortSignal.timeout(6000)});
   if(!response.ok)return;
   const html=new DOMParser().parseFromString(await response.text(),'text/html');
   const next=html.querySelector('meta[name="ocean-release"]')?.content;
   if(!next||next===loaded||document.getElementById('ocean-update'))return;
   const button=document.createElement('button');button.id='ocean-update';button.type='button';
   button.textContent='Ocean updated · Reload';button.addEventListener('click',()=>location.reload());
   document.body.appendChild(button);
  }catch{/* Stay in the simulation if offline or the release check times out. */}
  finally{busy=false;}
 };
 addEventListener('focus',check);document.addEventListener('visibilitychange',check);
 setInterval(check,60000);
}
