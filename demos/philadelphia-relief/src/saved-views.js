import { coercePatch } from './schema.js?v=philly-2026090907';
import { cleanViewName } from './urlstate.js?v=philly-2026090907';
const KEY='philadelphia-relief.saved-views.v1';
export function savedViews(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(v => v && typeof v==='object' && typeof v.name==='string'
    && Number.isFinite(v.state?.camLon) && Number.isFinite(v.state?.camLat))
    .slice(0,6).map(v => ({name:cleanViewName(v.name)||'My view',state:coercePatch(v.state)}));
}

export function wireSavedViews(host, store, restore, getName) {
  if (!host) return () => {};
  const input=host.querySelector('input'), list=host.querySelector('.saved-list');
  const status=host.querySelector('[role="status"]');
  let items=[];
  try { items=savedViews(JSON.parse(localStorage.getItem(KEY)||'[]')); } catch { /* Session fallback. */ }
  const persist=() => {
    try { localStorage.setItem(KEY,JSON.stringify(items)); return true; } catch { return false; }
  };
  const render=() => {
    list.replaceChildren();
    items.forEach((item,i) => {
      const row=document.createElement('div'), button=document.createElement('button');
      row.className='saved-row'; button.type='button'; button.textContent=item.name;
      button.addEventListener('click',() => {
        const {quality,animationSpeed,...state}=item.state;
        restore(state,item.name); status.textContent=`Restored ${item.name}`;
      });
      const remove=document.createElement('button'); remove.type='button'; remove.textContent='×';
      remove.setAttribute('aria-label',`Remove saved view ${item.name}`);
      remove.addEventListener('click',() => {
        items.splice(i,1); persist(); render(); status.textContent=`Removed ${item.name}`;
      });
      row.append(button,remove); list.append(row);
    });
  };
  const save=() => {
    if (items.length>=6) { status.textContent='Six views saved. Remove one to make room.'; return; }
    const name=cleanViewName(input.value)||getName()||'My view';
    items.unshift({name,state:coercePatch(store.get())});
    const durable=persist(); render(); input.value='';
    status.textContent=durable ? `Saved ${name} on this device` : `Saved ${name} for this session`;
  };
  const button=host.querySelector('[data-save-view]'); button.addEventListener('click',save);
  render();
  return () => button.removeEventListener('click',save);
}
