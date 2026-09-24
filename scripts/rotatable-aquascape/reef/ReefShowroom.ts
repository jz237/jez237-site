/** Same-origin store bridge. Suspension is independent of the visitor's pause. */
export function installReefShowroom(actions:{visibility:(visible:boolean)=>void;explore:(subject:string)=>void}){
 const embedded=new URLSearchParams(location.search).get('showroom')==='hidden-reef'||/\/showroom\/reef\/?$/.test(location.pathname);
 const send=(data:object)=>{if(embedded&&parent!==window)parent.postMessage({channel:'hidden-reef-aquarium',...data},location.origin);};
 if(embedded){
  document.body.classList.add('store-showroom');
  const brand=document.querySelector<HTMLAnchorElement>('header .eyebrow')!;
  brand.textContent='THE HIDDEN REEF';brand.href='../../';brand.target='_top';
  document.querySelector('h1')!.textContent='Living Reef';
  const nav=document.querySelector('header nav')!;
  nav.setAttribute('aria-label','Aquarium and store navigation');
  nav.innerHTML='<a href="../aquarium/?showroom=hidden-reef" target="_top">&#8592; Freshwater aquarium</a><a href="../../" target="_top">Hidden Reef home</a>';
  document.querySelector('.intro')!.textContent='Explore the coral reef';
  addEventListener('message',event=>{
   if(event.origin!==location.origin||event.source!==parent||event.data?.channel!=='hidden-reef-showroom')return;
   if(event.data.type==='visibility'&&typeof event.data.value==='boolean')actions.visibility(event.data.value);
   if(event.data.type==='explore'&&typeof event.data.value==='string')actions.explore(event.data.value);
  });
 }
 return {ready:()=>send({type:'ready'}),context:(name:string)=>send({type:'context',kind:'reef',name})};
}
