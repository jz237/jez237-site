export const LOOKS = [
  {id:'daylight', name:'Daylight', note:'Clear rooftops · crisp relief',
    patch:{timeMode:'manual',weather:'clear',sunAzimuth:225,sunAltitude:48,
      keyLight:1.08,ambient:.72,fogDensity:.16,glow:.08,waterIntensity:.65}},
  {id:'golden', name:'Golden hour', note:'Warm faces · long shadows',
    patch:{timeMode:'manual',weather:'clear',sunAzimuth:255,sunAltitude:16,
      keyLight:1.24,ambient:.62,fogDensity:.25,glow:.2,waterIntensity:.78}},
  {id:'overcast', name:'Soft overcast', note:'Even light · quiet colors',
    patch:{timeMode:'manual',weather:'overcast',sunAzimuth:225,sunAltitude:45,
      keyLight:.86,ambient:.84,fogDensity:.12,glow:.02,waterIntensity:.35}},
];

export function matchingLook(state) {
  return LOOKS.find(look => Object.entries(look.patch).every(([k,v]) => state[k] === v))?.id;
}

export function wireLooks(host, store, onChoose) {
  if (!host) return () => {};
  for (const look of LOOKS) {
    const button = document.createElement('button');
    button.type='button'; button.className=`look-card look-${look.id}`;
    button.dataset.look=look.id;
    const title=document.createElement('strong'), note=document.createElement('span');
    title.textContent=look.name; note.textContent=look.note;
    button.append(title,note); host.append(button);
  }
  let previous=null;
  const undo=document.createElement('button'); undo.type='button'; undo.className='look-undo';
  undo.textContent='Undo lighting change'; undo.disabled=true; host.append(undo);
  const restore=() => {
    if (!previous) return;
    onChoose(); const patch=previous; previous=null; undo.disabled=true;
    store.set(patch,{source:'look-undo'});
  };
  undo.addEventListener('click',restore);
  const update = state => {
    const selected=matchingLook(state);
    for (const button of host.querySelectorAll('button[data-look]')) {
      button.setAttribute('aria-pressed', String(button.dataset.look===selected));
    }
  };
  const click = event => {
    const id=event.target.closest('button[data-look]')?.dataset.look;
    const look=LOOKS.find(x => x.id===id);
    if (look) {
      previous=Object.fromEntries(Object.keys(look.patch).map(k => [k,store.get()[k]]));
      undo.disabled=false; onChoose(); store.set(look.patch, {source:'look'});
    }
  };
  host.addEventListener('click',click); update(store.get());
  const off=store.subscribe(update);
  return () => { off(); host.removeEventListener('click',click);
    undo.removeEventListener('click',restore); };
}
