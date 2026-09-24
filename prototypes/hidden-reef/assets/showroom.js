(() => {
  'use strict';
  const mount = document.querySelector('#tank-mount');
  const cover = document.querySelector('#tank-cover');
  const status = document.querySelector('#tank-status');
  const close = document.querySelector('#close-tank');
  let frame = null, ready = false, pending = null, visible = true, loadingTimer;
  let habitat=new URLSearchParams(location.search).get('habitat')==='reef'?'reef':'freshwater';
  const entryLesson=new URLSearchParams(location.search).get('lesson');
  if(['water','nitrogen','underground','day','challenges','layers','experiments','organisms'].includes(entryLesson))pending={type:'lesson',value:entryLesson};
  const send = (type, value) => {
    if (ready && frame) frame.contentWindow.postMessage({channel:'hidden-reef-showroom', type, value}, location.origin);
  };
  function visibility() { send('visibility', visible && !document.hidden && !document.body.classList.contains('cart-open') && !document.body.classList.contains('link-modal-open')); }
  function launch(action) {
    pending = action || pending;
    if (frame) { if (ready && pending) { send(pending.type,pending.value); pending=null; } return; }
    cover.hidden = true;
    frame = document.createElement('iframe');
    frame.title = habitat==='reef'?'The Hidden Reef interactive coral reef':'The Hidden Reef interactive planted aquarium';
    frame.src = habitat==='reef'?'./reef/?showroom=hidden-reef':'./aquarium/?showroom=hidden-reef';
    frame.allow = 'fullscreen';
    frame.setAttribute('allowfullscreen','');
    mount.append(frame);
    close.hidden = false;
    status.textContent = habitat==='reef'?'Building your coral reef…':'Growing your planted aquarium…';
    loadingTimer=setTimeout(()=>{if(!ready)status.textContent='Still loading? Close and reopen the aquarium to retry, or explore the guides and planner below.';},60000);
  }
  function closeTank(focus=true) {
    clearTimeout(loadingTimer);
    frame?.remove(); frame = null; ready = false; pending = null;
    cover.hidden = false; close.hidden = true;
    status.textContent = 'Aquarium closed · ready to explore again';
    if(focus)document.querySelector('#launch').focus();
  }
  document.querySelector('#launch').addEventListener('click',()=>{launch();mount.scrollIntoView({block:'start',behavior:'instant'});});
  close.addEventListener('click',closeTank);
  const contexts = {
    reef:['A reef full of relationships.','Meet the reef inhabitants and explore their shelter. Plan equipment and livestock with the store team; this illustrative aquarium does not show current availability.','first-tank','saltwater','Browse saltwater essentials'],
    fish:['A school with individual personalities.','Watch browsing, bursts and regrouping. Use the feeding guide to plan a varied diet and a sensible feeding routine.','feeding-basics','food','Browse fish foods'],
    invertebrate:['Small grazers, a closer look.','Watch shrimp pick at surfaces and snails graze. Review their care needs before choosing companions for your tank.','snails-shrimp-dying','freshwater','Explore freshwater care'],
    plant:['Plants are part of the system.','Look at the leaf and root zones, then explore planted-tank care and discuss plant choices with the store team.','first-tank','additives&sub=planted','Explore planted-tank care'],
    water:['Inside the filter. Back into the tank.','Explore the illustrative filter cutaway, then compare filter types and media for your own aquarium.','which-filter','filtration&sub=canister-filters','Browse canister filters'],
    nitrogen:['Follow food through the ecosystem.','The animation connects feeding, waste, biological filtration and plant growth. Learn what ammonia and nitrite tests tell you.','ammonia-nitrite','testing&sub=test-kits','Browse water tests'],
    underground:['A living world below the gravel.','Explore roots, substrate and microbial surfaces. Plan planting and maintenance together.','weekly-maintenance','additives&sub=planted','Explore planted-tank care'],
    day:['Light changes the rhythm.','Explore the day and night lesson and browse lighting options for a planted setup.','first-tank','lighting&sub=led-fixtures','Browse aquarium lighting'],
    challenges:['Make a prediction. See the comparison.','Try a change in the teaching model, then connect it to real aquarium care. These illustrative experiments are not live tank measurements.','prevent-crash','testing&sub=test-kits','Browse water tests']
  };
  function context(key,name) {
    if(key==='layers')key='plant'; if(key==='experiments')key='challenges';
    const c=contexts[key]; if(!c)return;
    document.querySelector('#context-title').textContent = name || c[0];
    document.querySelector('#context-copy').textContent = c[1];
    document.querySelector('#context-care').href='../learn/'+c[2]+'/';
    document.querySelector('#context-care').textContent='Read the related care guide →';
    document.querySelector('#context-shop').href='../category/?cat='+c[3];
    document.querySelector('#context-shop').textContent=c[4]+' →';
  }
  document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    const type=button.dataset.action,value=button.dataset.value;
    launch({type,value});
    context(habitat==='reef'?'reef':type==='lesson'||type==='cutaway'?value:value==='plants'?'plant':['shrimp','snail'].includes(value)?'invertebrate':'fish');
    document.querySelectorAll('.showroom-chips button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    mount.scrollIntoView({block:'start',behavior:'instant'});
  }));
  addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame?.contentWindow||event.data?.channel!=='hidden-reef-aquarium')return;
    if(event.data.type==='ready'){
      ready=true;clearTimeout(loadingTimer);status.textContent='Drag to rotate · pinch to zoom · tap inhabitants to identify';visibility();
      if(pending){send(pending.type,pending.value);pending=null;}
    }
    if(event.data.type==='context')context(event.data.lesson||event.data.kind,event.data.name);
  });
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visibility();},{threshold:0}).observe(mount);
  document.addEventListener('visibilitychange',visibility);
  new MutationObserver(visibility).observe(document.body,{attributes:true,attributeFilter:['class']});
  function showHabitat(){
    document.body.dataset.selectedHabitat=habitat;
    document.querySelectorAll('[data-habitat]').forEach(node=>{node.hidden=node.dataset.habitat!==habitat;});
    document.querySelectorAll('[data-habitat-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.habitatChoice===habitat)));
    const poster=cover.querySelector('img');
    poster.src=habitat==='reef'?'../assets/site/reef-showroom-preview.webp':'../assets/site/showroom-preview.jpg';
    poster.alt=habitat==='reef'?'The Living Reef, with colorful coral islands, anemones and marine fish':'The Living Aquascape, with dense plants and schooling fish';
    cover.querySelector('h2').textContent=habitat==='reef'?'A world beneath blue.':'A world worth slowing down for.';
    context(habitat==='reef'?'reef':'plant');
  }
  document.querySelectorAll('[data-habitat-choice]').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.habitatChoice===habitat)return;
    const running=!!frame;closeTank(false);habitat=button.dataset.habitatChoice;showHabitat();
    const url=new URL(location.href);url.searchParams.set('habitat',habitat);url.searchParams.delete('lesson');history.replaceState(null,'',url);
    status.textContent='Ready when you are · sound-free exploration';
    if(running)launch();
  }));
  showHabitat();
  // Deep-linked lessons are an explicit entry request; ordinary visits stay light.
  if(pending){habitat='freshwater';showHabitat();launch();}
  // The aquarium starts independently of the optional store planner. Use the
  // same catalog URL as shopping pages so moving between them reuses cache.
  const planner=document.querySelector('#planner-grid');
  let catalogPending=null,plannerBuilt=false;
  function preparePlanner(){
    if(plannerBuilt)return Promise.resolve();
    if(catalogPending)return catalogPending;
    planner.setAttribute('aria-busy','true');
    catalogPending=new Promise((resolve,reject)=>{
      if(window.THR_PRODUCTS){resolve();return;}
      const script=document.createElement('script');script.src='../assets/product-data.js?v=20260530-sitemap-complete';
      script.onload=()=>resolve();script.onerror=()=>{script.remove();reject(new Error('Catalog unavailable'));};document.head.append(script);
    }).then(()=>{planner.replaceChildren();buildPlanner();plannerBuilt=true;planner.setAttribute('aria-busy','false');
      const product=new URLSearchParams(location.search).get('product');if(product)window.THR?.openProductModal?.(product);
    }).catch(()=>{catalogPending=null;planner.setAttribute('aria-busy','false');planner.replaceChildren();
      const retry=document.createElement('button');retry.type='button';retry.textContent='Catalog could not load. Try again';retry.onclick=preparePlanner;planner.append(retry);
    });
    return catalogPending;
  }
  const plannerObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){plannerObserver.disconnect();preparePlanner();}},{rootMargin:'0px'});
  plannerObserver.observe(planner);
  if(new URLSearchParams(location.search).has('product'))preparePlanner();
  function buildPlanner(){
  const plans=[
    ['01','Aquarium & stand','Start with room, footprint and a stand designed for the filled aquarium.','showroom-consult','aquariums',/./],
    ['02','Filtration','Explore external canisters, then match capacity and media to your setup.','canister-filters','filtration&sub=canister-filters',/canister|cansiter|filtosmart|ultramax|hypermax/i],
    ['03','Plant lighting','Choose a fixture to suit the tank dimensions and plants you intend to grow.','led-fixtures','lighting&sub=led-fixtures',/plant|fresh|6500|65k/i],
    ['04','Growing plants','Explore planted-tank care. Ask the team about live plants, substrate and layout.','planted','additives&sub=planted',/./],
    ['05','Feeding the community','Browse food options and plan for both open-water fish and bottom feeders.','flake-tropical','food',/./],
    ['06','Water care & testing','Make monitoring water quality part of the setup from the beginning.','test-kits','testing&sub=test-kits',/^(API|Advatec).*?(FRESHWATER|FW|AMMONIA|NITRITE|NITRATE)/i]
  ];
  const grid=document.querySelector('#planner-grid');
  for(const [number,title,copy,bucket,category,match] of plans){
    const choices=(window.THR_PRODUCTS?.[bucket]||[]).filter(p=>match.test(p.name)).filter((p,i,a)=>a.findIndex(q=>q.productUrl===p.productUrl)===i);
    const article=document.createElement('article');article.className='planner-card';
    const numberEl=document.createElement('span');numberEl.textContent=number+' / THE ESSENTIALS';
    const heading=document.createElement('h3');heading.textContent=title;
    const description=document.createElement('p');description.textContent=copy;
    const label=document.createElement('label');label.textContent='Explore catalog options';label.htmlFor='plan-'+number;
    const select=document.createElement('select');select.id=label.htmlFor;
    select.append(new Option('Choose a product to explore',''));
    choices.forEach((p,i)=>select.append(new Option(p.name+' · '+p.price,String(i))));
    const detail=document.createElement('div');detail.className='product-detail';
    const add=document.createElement('button');add.type='button';add.textContent='Add to my preview list';add.disabled=true;
    const feedback=document.createElement('div');feedback.className='selection-status';feedback.setAttribute('role','status');
    const browse=document.createElement('a');browse.href='../category/?cat='+category;browse.textContent='Browse the full department →';
    select.addEventListener('change',()=>{
      detail.replaceChildren();feedback.textContent='';add.disabled=select.value==='';if(add.disabled)return;
      const p=choices[Number(select.value)],img=document.createElement('img'),link=document.createElement('a'),price=document.createElement('strong');
      img.src=p.imageUrl;img.alt='';img.loading='lazy';
      link.href=p.productUrl;link.target='_blank';link.rel='noopener';link.textContent=p.name+' ↗';
      price.textContent=p.price||'See catalog';link.append(price);detail.append(img,link);
    });
    add.addEventListener('click',()=>{
      const p=choices[Number(select.value)];if(select.value===''||!p)return;
      try{window.THR.addToPreviewList({name:p.name,price:p.price,url:p.productUrl,image:p.imageUrl});feedback.textContent='Added. Your list is saved on this device.';}
      catch{feedback.textContent='Your browser could not save the list. Open the product link to continue.';}
    });
    if(choices.length){article.append(numberEl,heading,description,label,select,detail,add,feedback,browse);}else{
      const note=document.createElement('p');note.textContent='Plan the tank and stand with our team. The online catalog does not currently provide a matching freshwater setup for this aquascape.';
      const visit=document.createElement('a');visit.href='../contact/';visit.textContent='Choose your setup with the team →';article.append(numberEl,heading,description,note,visit,browse);
    }grid.append(article);
  }
  }
})();
