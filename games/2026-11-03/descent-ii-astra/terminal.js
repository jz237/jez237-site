/* Title navigation and a DOM presentation of the native D2 menu system.
 * Actions are queued with a menu generation ID; a second click can never
 * fall through to an item in a newly opened submenu. */
(() => {
  const q=id=>document.getElementById(id), all=s=>[...document.querySelectorAll(s)];
  const storage='astra-terminal-v9';
  let preferences={};try{preferences=JSON.parse(localStorage.getItem(storage)||'{}');}catch{}
  for(const id of ['look','res','difficulty','campaign']){
    const el=q(id),value=String(preferences[id]??'');
    if([...el.options].some(o=>o.value===value))el.value=value;
  }
  const mode=q('playMode');try{mode.value=localStorage.getItem('astra-play-mode-v77')==='solo'?'solo':'coop';}catch{}
  function syncPlayMode(){const online=mode.value==='coop';q('start').querySelector('span').innerHTML=online?'<small>ONLINE CO-OP / UP TO 4</small>Join co-op campaign':'<small>SOLO FLIGHT / LEVEL 01</small>Enter mine';q('playModeHint').textContent=online?'Join an open game in this campaign, or start one for others to join. Up to four pilots.':'Fly the selected campaign on your own. No connection required.';}
  mode.onchange=()=>{try{localStorage.setItem('astra-play-mode-v77',mode.value);}catch{}syncPlayMode();};syncPlayMode();
  q('intro').checked=!!preferences.intro;
  const remember=()=>{try{localStorage.setItem(storage,JSON.stringify(Object.fromEntries(['look','res','difficulty','campaign','intro'].map(id=>[id,q(id).type==='checkbox'?q(id).checked:q(id).value]))));}catch{}};
  for(const id of ['look','res','difficulty','campaign','intro'])q(id).addEventListener('change',remember);
  function tab(name){
    if(launchPending)return;
    all('[data-tab]').forEach(b=>{const active=b.dataset.tab===name;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
    all('.terminal-panel').forEach(p=>p.hidden=p.id!=='panel-'+name);
    q('terminal').dataset.tab=name;
    window.scrollTo({top:0,behavior:'instant'});
  }
  all('[data-tab]').forEach((b,i)=>{
    b.parentElement.setAttribute('role','tablist');b.setAttribute('role','tab');b.id='tab-'+b.dataset.tab;b.setAttribute('aria-controls','panel-'+b.dataset.tab);
    q('panel-'+b.dataset.tab).setAttribute('role','tabpanel');q('panel-'+b.dataset.tab).setAttribute('aria-labelledby',b.id);
    b.onclick=()=>tab(b.dataset.tab);
    b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const buttons=all('[data-tab]'),n=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;tab(buttons[n].dataset.tab);buttons[n].focus();};
  });
  all('[data-go]').forEach(b=>b.onclick=()=>{tab(b.dataset.go);q('terminal').scrollIntoView({block:'start'});});
  function syncCampaign(){
    all('[data-campaign]').forEach(b=>{const active=b.dataset.campaign===q('campaign').value;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});
    all('.selected-campaign').forEach(el=>el.textContent=q('campaign').value==='overload'?'OVERLOAD':q('campaign').value==='d2'?'COUNTERSTRIKE':'VERTIGO');
  }
  all('[data-campaign]').forEach(b=>{
    b.onclick=()=>{if(launchPending)return;q('campaign').value=b.dataset.campaign;q('campaign').dispatchEvent(new Event('change'));};
    b.ondblclick=()=>{if(!launchPending)q('start').click();};
  });
  q('campaign').addEventListener('change',syncCampaign);syncCampaign();populateDemoLevels();
  q('terminalFull').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen?.();else await document.documentElement.requestFullscreen?.();}catch{}};
  if(!document.documentElement.requestFullscreen)q('terminalFull').hidden=true;
  all('[data-view]').forEach(b=>b.onclick=()=>window.astraHangar?.view(b.dataset.view));
  q('shipReset').onclick=()=>window.astraHangar?.reset();
  q('shipSpin').onclick=()=>window.astraHangar?.spin();
  q('flightMenu').onclick=()=>{releaseFlightMouse();Module._astra_reset_flight_input?.();Module.menuCommand=1;};
  window.astraTerminal={
    tab,
    loading(active){
      q('loadingScreen').hidden=!active;q('terminal').inert=active;
      if(active){q('loadingScreen').classList.remove('failed');q('loadingScreen').focus();}
    },
    fail(){this.loading(true);q('loadingScreen').classList.add('failed');q('retry').hidden=false;q('retry').focus();}
  };
  new MutationObserver(()=>{q('terminalReady').textContent=q('status').textContent;}).observe(q('status'),{childList:true,subtree:true,characterData:true});
  tab('missions');

  const clean=t=>String(t||'').replace(/[\x00-\x08\x0b-\x1f]/g,'').replace(/\t/g,'  ').trim();
  const menu=window.astraMenus={
    active:false,token:0,queue:[],state:null,pending:null,rows:[],
    begin(token,title,subtitle,selected,kind,allowBack,reorder){this.pending={token,title:clean(title),subtitle:clean(subtitle),selected,kind,allowBack,reorder,items:[]};},
    item(index,type,text,value,min,max,group,length){this.pending.items.push({index,type,text:clean(text),value,min,max,group,length});},
    commit(){
      const s=this.pending;if(!s)return;
      const changed=this.token!==s.token;
      const moved=s.reorder && !changed && this.state.selected!==s.selected;
      if(changed){this.queue=[];this.rows=[];q('nativeItems').replaceChildren();q('nativeItems').scrollTop=0;}
      this.active=true;this.token=s.token;this.state=s;
      releaseFlightMouse();q('nativeScreen').hidden=false;document.body.classList.add('native-open');window.ensureAstraHangar?.();
      if(q('hangarDock').parentElement!==q('nativeHangar'))q('nativeHangar').append(q('hangarDock'));
      q('nativeTitle').textContent=s.title||s.subtitle||'Campaign menu';
      q('nativeSubtitle').textContent=s.title?s.subtitle:'';q('nativeSubtitle').hidden=!q('nativeSubtitle').textContent;
      q('nativeContext').textContent=s.kind?'FLIGHT ARCHIVE':'FLIGHT COMPUTER';
      q('nativeBack').hidden=!s.allowBack;q('nativeReorder').hidden=!s.reorder;
      q('nativeOpen').hidden=!s.items.some(x=>[0,1,6].includes(x.type));
      q('nativeOpen').textContent=s.reorder?'Done':s.kind?'Open selection ↗':s.items.some(x=>x.type===6)?'Confirm selection ↗':'Open selection ↗';
      q('nativeHint').textContent=s.reorder?'Select a weapon or the divider. Use ↑ and ↓ or Shift + an arrow key to move it.':q('nativeOpen').hidden?'Adjust the controls with your mouse · Back or Esc to return':'Click to select · Double-click or Enter to open';
      s.items.forEach((item,i)=>{
        let row=this.rows[i];
        if(!row||row.dataset.type!==String(item.type)){
          const replacement=this.makeRow(item);if(row)row.replaceWith(replacement);else q('nativeItems').append(replacement);this.rows[i]=row=replacement;
        }
        row.classList.toggle('selected',item.index===s.selected);
        if(item.type===4){row.textContent=item.text;return;}
        row.setAttribute('aria-current',item.index===s.selected?'true':'false');
        const label=row.querySelector('.row-label'),input=row.querySelector('input');
        if(label)label.textContent=item.text;
        if(input){
          input.setAttribute('aria-label',[1,6].includes(item.type)?'Name for slot '+(i+1):item.text);
          if([2,3].includes(item.type))input.checked=!!item.value;
          else if(document.activeElement!==input)input.value=[1,6].includes(item.type)?item.text:item.value;
          if([5,7].includes(item.type)){input.min=item.min;input.max=item.max;row.querySelector('output').textContent=item.value;}
        }
      });
      while(this.rows.length>s.items.length)this.rows.pop().remove();
      if(moved){
        const selected=this.rows[s.selected];
        if(q('nativeItems').contains(document.activeElement))selected?.focus({preventScroll:true});
        selected?.scrollIntoView({block:'nearest'});
      }
      if(changed){q('nativeItems').tabIndex=-1;q('nativeItems').focus({preventScroll:true});}
    },
    makeRow(item){
      const row=document.createElement(item.type===4?'p':'div');row.className=item.type===4?'native-text':'native-row';row.dataset.type=item.type;row.dataset.index=item.index;
      if(item.type===4)return row;
      row.tabIndex=0;row.setAttribute('role',[0,1,6].includes(item.type)?'button':'group');
      const ordinal=document.createElement('span');ordinal.className='row-number';ordinal.textContent=String(item.index+1).padStart(2,'0');row.append(ordinal);
      if(![1,6].includes(item.type)){const label=document.createElement('span');label.className='row-label';row.append(label);}
      if([1,2,3,5,6,7].includes(item.type)){
        const input=document.createElement('input');input.type=({1:'text',2:'checkbox',3:'radio',5:'number',6:'text',7:'range'})[item.type];
        if([1,6].includes(item.type)){input.maxLength=Math.max(1,item.length);input.autocomplete='off';input.spellcheck=false;input.oninput=()=>this.send(4,item.index,0,input.value);}
        else input.oninput=()=>this.send(3,item.index,[2,3].includes(item.type)?+input.checked:Number(input.value));
        input.onfocus=()=>this.send(1,item.index);input.onclick=e=>e.stopPropagation();row.append(input);
        if([5,7].includes(item.type))row.append(document.createElement('output'));
      }
      row.onclick=()=>{
        if([2,3].includes(item.type)){const input=row.querySelector('input');input.checked=item.type===3?true:!input.checked;this.send(3,item.index,+input.checked);}
        else {this.send(1,item.index);if([1,6].includes(item.type))row.querySelector('input').focus();}
      };
      row.ondblclick=e=>{if(e.target.tagName!=='INPUT'&&[0,1,6].includes(item.type))this.send(2,item.index);};
      return row;
    },
    send(op,index=-1,value=0,text=''){
      if(!this.active)return;
      const command={token:this.token,op,index,value,text};
      const prev=this.queue[this.queue.length-1];if(prev?.token===command.token&&prev.index===index&&prev.op===op&&[1,3,4].includes(op))this.queue[this.queue.length-1]=command;else this.queue.push(command);
      if(index>=0){this.state.selected=index;this.rows.forEach(r=>r.classList.toggle('selected',+r.dataset.index===index));}
    },
    poll(token){while(this.queue.length){const c=this.queue.shift();if(c.token===token){this.current=c;return c.op;}}return 0;},
    hide(token){
      if(token&&token!==this.token)return;
      this.active=false;this.token=0;this.queue=[];q('nativeScreen').hidden=true;document.body.classList.remove('native-open');
      q('hangarHome').append(q('hangarDock'));window.astraHangar?.render();
    }
  };
  let lastBackMenu=0;
  q('nativeBack').onclick=e=>{
    if(e.detail>1 && lastBackMenu===menu.token)return;
    lastBackMenu=menu.token;menu.send(5);
  };
  q('nativeOpen').onclick=e=>{if(e.detail<=1)menu.send(2,menu.state.selected);};
  q('nativeUp').onclick=()=>menu.send(6,menu.state.selected,-1);
  q('nativeDown').onclick=()=>menu.send(6,menu.state.selected,1);
  const oldFocus=window.astraFlightFocus;
  window.astraFlightFocus=active=>{if(active)menu.hide();oldFocus(active);};
  window.addEventListener('keydown',e=>{
    if(!menu.active||document.querySelector("dialog[open]"))return;
    e.stopImmediatePropagation();
    if(e.repeat&&['Enter','Escape',' '].includes(e.key)){e.preventDefault();return;}
    if(e.key==='Escape'){e.preventDefault();menu.send(5);return;}
    if(e.key==='Tab')return;
    const input=e.target.tagName==='INPUT';
    if(input){if(e.key==='Enter'){e.preventDefault();menu.send(2,menu.state.selected);}return;}
    if(e.target.tagName==='BUTTON'&&['Enter',' '].includes(e.key))return;
    if(menu.state.reorder && e.shiftKey && ['ArrowUp','ArrowDown'].includes(e.key)){
      e.preventDefault();menu.send(6,menu.state.selected,e.key==='ArrowUp'?-1:1);return;
    }
    if(['ArrowUp','ArrowDown','Home','End'].includes(e.key)){
      e.preventDefault();const items=menu.state.items.filter(x=>x.type!==4),index=items.findIndex(x=>x.index===menu.state.selected);
      const n=e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
      if(items[n]){menu.send(1,items[n].index);menu.rows[items[n].index]?.scrollIntoView({block:'nearest'});}return;
    }
    if(e.key==='Enter'){e.preventDefault();menu.send(2,menu.state.selected);}
    if(e.key===' '){e.preventDefault();menu.rows[menu.state.selected]?.click();}
  },true);
})();
