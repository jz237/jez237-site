const definitions=[['schooner','Schooner','52 m · Three masts · Crew of 20–30'],['imperial','Imperial Star','122 m · Five masts · 5,800 tonnes']];
export function chooseShip(current='schooner'){
  return new Promise(resolve=>{
    const dialog=document.createElement('dialog');dialog.id='ship-choice';
    dialog.innerHTML='<form><small>OPEN SEA</small><h1>Choose your ship</h1><div class="ship-options"></div><p>A slow cinematic tour, then free exploration.</p><button class="ship-start" type="submit">Set sail</button></form>';
    const options=dialog.querySelector('.ship-options');let selected=current;
    for(const[id,title,spec]of definitions){
      const button=document.createElement('button');button.type='button';button.className='ship-option';button.dataset.ship=id;
      button.setAttribute('aria-pressed',String(id===selected));button.innerHTML=`<img src="assets/${id==='imperial'?'imperial-star-choice':'schooner-choice'}.webp" alt=""><strong>${title}</strong><span>${spec}</span>`;
      button.onclick=()=>{selected=id;for(const b of options.children)b.setAttribute('aria-pressed',String(b.dataset.ship===id));};options.append(button);
    }
    dialog.addEventListener('cancel',e=>e.preventDefault());
    dialog.querySelector('form').onsubmit=e=>{e.preventDefault();dialog.close();dialog.remove();resolve(selected);};
    document.body.append(dialog);dialog.showModal();
  });
}
export function installShipChoice(id){
  const button=document.createElement('button');button.id='change-ship';button.type='button';button.textContent='Ship';button.title='Choose another ship';
  button.onclick=async()=>{const next=await chooseShip(id);if(next!==id){const url=new URL(location);url.searchParams.set('ship',next);url.searchParams.delete('mode');location.assign(url);}};
  document.body.append(button);
}
