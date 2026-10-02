import test from 'node:test';
import assert from 'node:assert/strict';
import {ControllerNavigation,type NavigationContext} from '../src/controller-navigation';

/** Small DOM boundary for the Node release suite, which has no DOM dependency.
 * Events use Node's Event/EventTarget; layout, focus and browser default actions
 * are explicit fixtures. Real-browser visibility/scroll and native step/default
 * action behavior remain browser acceptance checks, not claims of this fixture. */
class Element extends EventTarget {
  readonly attributes=new Map<string,string>();
  readonly classes=new Set<string>();
  readonly classList={add:(name:string)=>{this.setAttribute('class',[...this.classes,name].join(' '));},remove:(name:string)=>{this.setAttribute('class',[...this.classes].filter(item=>item!==name).join(' '));},contains:(name:string)=>this.classes.has(name)};
  readonly style:Record<string,string>=new Proxy({} as Record<string,string>,{set:(target,name,value)=>{target[String(name)]=value;this.setAttribute('style',JSON.stringify(target));return true;}});
  children:Element[]=[];parentElement:Element|null=null;textContent='';readOnly=false;checked=false;box=true;
  scrolls=0;focuses=0;clicks=0;queries=0;focusOptions:unknown;scrollOptions:unknown;
  onclick?:((event:Event)=>void);oninput?:((event:Event)=>void);onchange?:((event:Event)=>void);
  private storedValue='';selectedIndex=0;
  constructor(readonly ownerDocument:Document,readonly tagName:string){super();}
  get hidden(){return this.hasAttribute('hidden');}set hidden(value:boolean){this.booleanAttribute('hidden',value);}
  get disabled(){return this.hasAttribute('disabled');}set disabled(value:boolean){this.booleanAttribute('disabled',value);}
  get open(){return this.hasAttribute('open');}set open(value:boolean){this.booleanAttribute('open',value);}
  get id(){return this.getAttribute('id')??'';}set id(value:string){this.setAttribute('id',value);}
  get type(){return this.getAttribute('type')??(this.tagName==='INPUT'?'text':'');}set type(value:string){this.setAttribute('type',value);}
  get min(){return this.getAttribute('min')??'';}set min(value:string){this.setAttribute('min',value);}
  get max(){return this.getAttribute('max')??'';}set max(value:string){this.setAttribute('max',value);}
  get step(){return this.getAttribute('step')??'';}set step(value:string){this.setAttribute('step',value);}
  get value(){return this.tagName==='SELECT'?(this.options[this.selectedIndex]?.storedValue??''):this.storedValue;}
  set value(value:string){if(this.tagName==='SELECT')this.selectedIndex=this.options.findIndex(option=>option.storedValue===value);else this.storedValue=value;}
  get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
  get options(){return this.descendants().filter(child=>child.tagName==='OPTION');}
  get tabIndex(){return this.hasAttribute('tabindex')?Number(this.getAttribute('tabindex')):['BUTTON','INPUT','SELECT','TEXTAREA','SUMMARY'].includes(this.tagName)||this.tagName==='A'&&this.hasAttribute('href')?0:-1;}
  get isConnected():boolean{return this===this.ownerDocument.documentElement||!!this.parentElement?.isConnected;}
  private booleanAttribute(name:string,value:boolean){if(value)this.setAttribute(name,'');else this.removeAttribute(name);}
  setAttribute(name:string,value:string){const oldValue=this.getAttribute(name);this.attributes.set(name,value);if(name==='class'){this.classes.clear();for(const item of value.split(/\s+/).filter(Boolean))this.classes.add(item);}this.ownerDocument.mutate(this,'attributes',name,oldValue);}
  removeAttribute(name:string){const oldValue=this.getAttribute(name);this.attributes.delete(name);this.ownerDocument.mutate(this,'attributes',name,oldValue);}
  getAttribute(name:string){return this.attributes.get(name)??null;}hasAttribute(name:string){return this.attributes.has(name);}
  contains(node:unknown):boolean{return node===this||this.children.some(child=>child.contains(node));}
  append(...children:Element[]){for(const child of children){child.parentElement=this;this.children.push(child);}this.ownerDocument.mutate(this,'childList');}
  replaceChildren(...children:Element[]){if(this.children.some(child=>child.contains(this.ownerDocument.activeElement)))this.ownerDocument.activeElement=this.ownerDocument.body;for(const child of this.children)child.parentElement=null;this.children=[];this.append(...children);}
  descendants():Element[]{return this.children.flatMap(child=>[child,...child.descendants()]);}
  matches(selector:string):boolean{
    if(selector===':disabled')return this.disabled||!!this.ancestors().find(parent=>parent.tagName==='FIELDSET'&&parent.disabled);
    return selector.split(',').some(part=>{
      part=part.trim();if(part.startsWith('#'))return this.id===part.slice(1);if(part.startsWith('.'))return this.classes.has(part.slice(1));
      const match=/^([a-z]+)?(?:\[([^=\]]+)(?:="([^"]*)")?\])?$/i.exec(part);if(!match)return false;
      return (!match[1]||this.tagName===match[1].toUpperCase())&&(!match[2]||this.hasAttribute(match[2])&&(match[3]===undefined||this.getAttribute(match[2])===match[3]));
    });
  }
  private ancestors():Element[]{return this.parentElement?[this.parentElement,...this.parentElement.ancestors()]:[];}
  querySelectorAll(selector:string){this.queries++;return this.descendants().filter(child=>child.matches(selector));}
  getClientRects(){return this.box?[{}]:[];}
  focus(options?:unknown){this.focuses++;this.focusOptions=options;this.ownerDocument.activeElement=this;this.ownerDocument.dispatchEvent(new Event('focusin'));}
  scrollIntoView(options?:unknown){this.scrolls++;this.scrollOptions=options;}
  override dispatchEvent(event:Event):boolean{
    if(!Object.hasOwn(event,'target'))Object.defineProperty(event,'target',{value:this});
    const result=super.dispatchEvent(event);const handler=this['on'+event.type as 'onclick'|'oninput'|'onchange'];handler?.(event);
    if(event.bubbles)this.parentElement?.dispatchEvent(event);return result;
  }
  click(){
    this.clicks++;if(this.type==='checkbox')this.checked=!this.checked;
    if(this.tagName==='SUMMARY'&&this.parentElement?.tagName==='DETAILS')this.parentElement.open=!this.parentElement.open;
    this.dispatchEvent(new Event('click',{bubbles:true}));
    if(this.type==='checkbox'){this.dispatchEvent(new Event('input',{bubbles:true}));this.dispatchEvent(new Event('change',{bubbles:true}));}
  }
  stepUp(){this.nativeStep(1);}stepDown(){this.nativeStep(-1);}
  private nativeStep(direction:number){
    assert.notEqual(this.step,'any','The real browser throws for step=any');
    const min=this.min===''?-Infinity:Number(this.min),max=this.max===''?Infinity:Number(this.max),step=this.step===''?1:Number(this.step);
    this.value=String(Math.max(min,Math.min(max,Math.round((Number(this.value)+step*direction)*1e12)/1e12)));
  }
}
/** Queue only the browser's mutation boundary; the navigator must consume
 * pending records itself before a subsequent synchronous sync/command. */
class Observer {
  readonly observations=new Map<Element,MutationObserverInit>();records:MutationRecord[]=[];
  constructor(readonly callback:(records:MutationRecord[])=>void){}
  observe(target:Element,options:MutationObserverInit){this.observations.set(target,options);target.ownerDocument.observers.add(this);}
  disconnect(){for(const target of this.observations.keys())target.ownerDocument.observers.delete(this);this.observations.clear();this.records=[];}
  takeRecords(){const records=this.records;this.records=[];return records;}
}
class Document extends EventTarget {
  readonly observers=new Set<Observer>();computedReads=0;
  readonly documentElement=new Element(this,'HTML');readonly body=new Element(this,'BODY');activeElement=this.body;
  readonly defaultView=Object.assign(new EventTarget(),{Event,MutationObserver:Observer,getComputedStyle:(element:Element)=>{this.computedReads++;return{display:'block',visibility:'visible',opacity:'1',...element.style,...(element.classes.has('fixture-hidden')?{display:'none'}:{})};}});
  constructor(){super();this.documentElement.append(this.body);}
  mutate(target:Element,type:'attributes'|'childList',attributeName:string|null=null,oldValue:string|null=null){
    for(const observer of this.observers){
      if([...observer.observations].some(([root,options])=>(root===target||options.subtree&&root.contains(target))&&(type==='childList'?options.childList:options.attributes&&(!options.attributeFilter||options.attributeFilter.includes(attributeName!))))){
        observer.records.push({type,target,attributeName,oldValue} as unknown as MutationRecord);
      }
    }
  }
}
function element(document:Document,tag='button',attributes:Record<string,string>={}){const result=new Element(document,tag.toUpperCase());for(const [key,value]of Object.entries(attributes))result.setAttribute(key,value);return result;}
function fixture(){
  const document=new Document(),root=element(document,'section');document.body.append(root);
  const navigation=new ControllerNavigation();
  const context=(key='menu',initial?:string,back?:()=>void):NavigationContext=>({key,root:root as unknown as HTMLElement,initial,back});
  return{document,root,navigation,context,button:(id:string)=>element(document,'button',{id})};
}

test('controller focus starts on command, does not scroll every sync, and yields to pointer or keyboard ownership',()=>{
  const h=fixture(),start=h.button('start'),settings=h.button('settings');h.root.append(start,settings);const context=h.context('menu','#start');
  h.navigation.sync(context);assert.equal(h.document.activeElement,h.document.body);assert.equal(start.scrolls,0);
  h.navigation.handle('down');assert.equal(h.document.activeElement,start);assert.ok(start.classList.contains('controller-focus'));
  assert.deepEqual(start.focusOptions,{preventScroll:true});assert.deepEqual(start.scrollOptions,{block:'nearest',inline:'nearest'});
  for(let frame=0;frame<90;frame++)h.navigation.sync(context);
  assert.equal(start.focuses,1);assert.equal(start.scrolls,1);
  for(const input of ['pointerdown','pointermove','wheel','keydown']){
    h.document.dispatchEvent(new Event(input));assert.equal(start.classList.contains('controller-focus'),false);
    settings.focus();h.navigation.sync(context);assert.equal(h.document.activeElement,settings);assert.equal(settings.classList.contains('controller-focus'),false);
    start.focus();h.navigation.handle('accept');assert.ok(start.classList.contains('controller-focus'));
  }
  h.document.dispatchEvent(new Event('keydown'));h.navigation.clear();assert.equal(h.document.activeElement,start,'Clearing navigation must not blur native focus');
});

test('real activation callbacks can rebuild ID, data-car and data-mode controls without losing their focus identity',()=>{
  for(const attribute of ['id','data-car','data-mode']){
    const h=fixture();let rebuilds=0,current=element(h.document,'button',{[attribute]:'chosen'});
    const rebuild=()=>{rebuilds++;current=element(h.document,'button',{[attribute]:'chosen'});current.onclick=rebuild;h.root.replaceChildren(h.button('other'),current,h.button('start'));};
    current.onclick=rebuild;h.root.append(current,h.button('start'));const context=h.context('menu','#start');h.navigation.sync(context);
    current.focus();h.navigation.handle('accept');assert.equal(rebuilds,1);assert.equal(h.document.activeElement,h.document.body);
    h.navigation.sync(context);assert.equal(h.document.activeElement,current);assert.ok(current.classList.contains('controller-focus'));
    h.navigation.handle('accept');h.navigation.sync(context);assert.equal(rebuilds,2);assert.equal(h.document.activeElement,current);
    h.document.dispatchEvent(new Event('pointerdown'));rebuild();h.navigation.sync(context);
    assert.equal(h.document.activeElement,h.document.body,'A pointer-owned rebuild cannot trigger automatic focus restoration');
    h.navigation.clear();
  }
});

test('navigation skips hidden, disabled, inert and closed-details children while summary remains usable',()=>{
  const h=fixture(),first=h.button('first'),disabled=h.button('disabled'),hidden=element(h.document,'div'),inert=element(h.document,'div'),details=element(h.document,'details'),summary=element(h.document,'summary'),inside=h.button('inside'),last=h.button('last');
  disabled.disabled=true;hidden.hidden=true;hidden.append(h.button('hidden'));inert.setAttribute('inert','');inert.append(h.button('inert'));
  const collapsed=h.button('collapsed');collapsed.style.visibility='hidden';const noLayout=h.button('no-layout');noLayout.box=false;
  const excluded=h.button('negative-tab');excluded.setAttribute('tabindex','-1');const aria=h.button('aria');aria.setAttribute('aria-disabled','true');
  const fieldset=element(h.document,'fieldset');fieldset.disabled=true;fieldset.append(h.button('fieldset-button'));
  details.append(summary,inside);h.root.append(first,disabled,hidden,inert,collapsed,noLayout,excluded,aria,fieldset,details,last);
  const context=h.context('menu','#disabled');h.navigation.sync(context);h.navigation.handle('down');assert.equal(h.document.activeElement,first);
  h.navigation.handle('down');assert.equal(h.document.activeElement,summary);h.navigation.handle('accept');assert.equal(details.open,true);
  h.navigation.handle('down');assert.equal(h.document.activeElement,inside);h.navigation.handle('down');assert.equal(h.document.activeElement,last);
  h.navigation.handle('down');assert.equal(h.document.activeElement,first);h.navigation.handle('up');assert.equal(h.document.activeElement,last);
  details.open=false;h.navigation.handle('up');assert.equal(h.document.activeElement,summary);
  h.root.hidden=true;h.navigation.sync(context);assert.equal(summary.classList.contains('controller-focus'),false);h.navigation.handle('accept');assert.equal(summary.clicks,1);
  h.navigation.clear();
});

test('left/right uses real values, skips unavailable options, and emits input/change only for a change',()=>{
  const h=fixture(),select=element(h.document,'select',{id:'course'}),a=element(h.document,'option'),disabled=element(h.document,'option'),group=element(h.document,'optgroup'),groupOption=element(h.document,'option'),b=element(h.document,'option');
  a.value='quarry';disabled.value='disabled';disabled.disabled=true;groupOption.value='group-disabled';group.disabled=true;group.append(groupOption);b.value='ironfield';select.append(a,disabled,group,b);
  const range=element(h.document,'input',{id:'field',type:'range',min:'2',max:'4',step:'1'});range.value='3';
  const number=element(h.document,'input',{id:'exposure',type:'number',min:'0.3',max:'0.4',step:'0.05'});number.value='0.3';
  h.root.append(select,range,number);const changes:string[]=[],inputs:string[]=[],observed:string[]=[];let keys=0;
  h.root.addEventListener('input',event=>inputs.push((event.target as unknown as Element).id));h.root.addEventListener('change',event=>changes.push((event.target as unknown as Element).id));
  h.document.addEventListener('keydown',()=>keys++);select.onchange=()=>observed.push(select.value);range.oninput=()=>observed.push(range.value);number.onchange=()=>observed.push(number.value);
  h.navigation.sync(h.context('event','#course'));h.navigation.handle('right');assert.equal(select.value,'ironfield');h.navigation.handle('right');assert.equal(select.value,'ironfield');
  h.navigation.handle('left');assert.equal(select.value,'quarry');h.navigation.handle('left');assert.equal(select.value,'quarry');
  h.navigation.handle('down');h.navigation.handle('right');h.navigation.handle('right');assert.equal(range.value,'4');assert.equal(h.document.activeElement,range);
  h.navigation.handle('left');h.navigation.handle('left');h.navigation.handle('left');assert.equal(range.value,'2');
  h.navigation.handle('down');h.navigation.handle('right');h.navigation.handle('right');h.navigation.handle('right');assert.equal(number.value,'0.4');
  number.readOnly=true;h.navigation.handle('left');assert.equal(number.value,'0.4');
  assert.deepEqual(inputs,['course','course','field','field','field','exposure','exposure']);assert.deepEqual(changes,inputs);
  assert.deepEqual(observed,['ironfield','quarry','4','3','2','0.35','0.4']);assert.equal(keys,0,'No guessed synthetic keyboard actions');h.navigation.clear();
});

test('accept invokes native button/checkbox/summary behavior but leaves selects and sliders to directional changes',()=>{
  const h=fixture(),button=h.button('apply'),checkbox=element(h.document,'input',{id:'check',type:'checkbox'}),details=element(h.document,'details'),summary=element(h.document,'summary'),select=element(h.document,'select'),range=element(h.document,'input',{type:'range'});
  details.append(summary);h.root.append(button,checkbox,details,select,range);let actions=0,checked=false;button.onclick=()=>actions++;checkbox.onchange=()=>checked=checkbox.checked;
  h.navigation.sync(h.context('options','#apply'));h.navigation.handle('accept');assert.equal(actions,1);
  h.navigation.handle('down');h.navigation.handle('accept');assert.equal(checked,true);h.navigation.handle('accept');assert.equal(checked,false);
  h.navigation.handle('down');h.navigation.handle('accept');assert.equal(details.open,true);
  h.navigation.handle('down');h.navigation.handle('accept');assert.equal(select.clicks,0);
  h.navigation.handle('down');h.navigation.handle('accept');assert.equal(range.clicks,0);h.navigation.clear();
});

test('same-screen async focus choices and modal safe defaults take precedence over remembered controls',()=>{
  const h=fixture(),start=h.button('start'),other=h.button('other');h.root.append(start,other);const menu=h.context('menu','#start');h.navigation.sync(menu);h.navigation.handle('down');
  other.focus();h.navigation.sync(menu);assert.equal(h.document.activeElement,other,'An explicit focus choice is retained');
  const cancel=h.button('cancel'),confirm=h.button('confirm');h.root.replaceChildren(confirm,cancel);cancel.focus();
  let backs=0;const modal=h.context('confirmation','#cancel',()=>backs++);h.navigation.sync(modal);assert.equal(h.document.activeElement,cancel);
  h.navigation.handle('back');assert.equal(backs,1);assert.equal(confirm.clicks,0,'Back cannot guess a destructive action');
  const replacement=h.button('cancel');h.root.replaceChildren(h.button('confirm'),replacement);h.navigation.sync(modal);assert.equal(h.document.activeElement,replacement);
  const external=element(h.document,'input',{id:'unrelated'});h.document.body.append(external);external.focus();h.navigation.sync(modal);assert.equal(h.document.activeElement,external);assert.equal(replacement.classList.contains('controller-focus'),false);
  h.navigation.sync(null);h.navigation.handle('accept');h.navigation.handle('back');assert.equal(backs,1);assert.equal(external.clicks,0);
});

test('step-any numeric fields remain bounded, empty contexts permit explicit Back, and cleared roots are inert',()=>{
  const h=fixture(),number=element(h.document,'input',{id:'free',type:'number',min:'0',max:'2',step:'any'});number.value='1.5';h.root.append(number);
  h.navigation.sync(h.context('number','#free'));h.navigation.handle('right');assert.equal(number.value,'2');h.navigation.handle('right');assert.equal(number.value,'2');h.navigation.handle('left');assert.equal(number.value,'1');
  h.root.replaceChildren();let backs=0;h.navigation.sync(h.context('empty',undefined,()=>backs++));h.navigation.handle('accept');h.navigation.handle('down');h.navigation.handle('back');assert.equal(backs,1);
  h.navigation.clear();h.document.dispatchEvent(new Event('pointerdown'));h.navigation.handle('back');assert.equal(backs,1);
});

test('render-loop sync performs no repeated control/layout scans, while DOM visibility and topology invalidate the cache',()=>{
  const h=fixture(),buttons=Array.from({length:100},(_,index)=>h.button(`control-${index}`));h.root.append(...buttons);
  const context=h.context('garage','#control-0');h.navigation.sync(context);
  for(let frame=0;frame<180;frame++)h.navigation.sync(context);
  assert.equal(h.root.queries,0,'Native ownership must not enumerate garage controls');assert.equal(h.document.computedReads,0);
  h.navigation.handle('down');const queries=h.root.queries,reads=h.document.computedReads;
  for(let frame=0;frame<180;frame++)h.navigation.sync(context);
  assert.equal(h.root.queries,queries,'Own focus-class mutation must not invalidate the list');assert.equal(h.document.computedReads,reads);
  buttons[0].disabled=true;h.navigation.sync(context);assert.equal(h.document.activeElement,buttons[1]);assert.equal(h.root.queries,queries+1);
  buttons[1].classList.add('fixture-hidden');h.navigation.sync(context);assert.equal(h.document.activeElement,buttons[2],'Real class changes still invalidate');
  buttons[2].style.visibility='hidden';h.navigation.sync(context);assert.equal(h.document.activeElement,buttons[3]);
  h.document.body.hidden=true;h.navigation.sync(context);assert.equal(buttons[3].classList.contains('controller-focus'),false);
  h.document.body.hidden=false;h.navigation.sync(context);assert.equal(h.document.activeElement,buttons[3]);assert.ok(buttons[3].classList.contains('controller-focus'));
  const replacement=h.button('control-3');h.root.replaceChildren(replacement);h.navigation.sync(context);assert.equal(h.document.activeElement,replacement);
  const afterRebuild=h.root.queries;h.document.defaultView.dispatchEvent(new Event('resize'));h.navigation.sync(context);assert.equal(h.root.queries,afterRebuild+1);
  const newRoot=element(h.document,'section'),newButton=h.button('control-3');newRoot.append(newButton);h.document.body.append(newRoot);h.root.replaceChildren();
  const nextContext={...context,root:newRoot as unknown as HTMLElement};h.navigation.sync(nextContext);assert.equal(h.document.activeElement,newButton);
  const host=element(h.document,'div');h.document.body.replaceChildren(host);host.append(newRoot);h.navigation.sync(nextContext);assert.equal(h.document.activeElement,newButton);
  host.setAttribute('inert','');h.navigation.sync(nextContext);assert.equal(newButton.classList.contains('controller-focus'),false,'Reparented roots must watch the new host');
  h.document.dispatchEvent(new Event('pointerdown'));const beforeNative=newRoot.queries;host.removeAttribute('inert');newButton.hidden=true;
  for(let frame=0;frame<90;frame++)h.navigation.sync(nextContext);
  assert.equal(newRoot.queries,beforeNative,'Mutation does not make native-owned sync scan the controls');
  h.navigation.clear();assert.equal(h.document.observers.size,0,'Clear disconnects observers');
});

test('replay-row action identity survives reorder, but an explicit search focus wins an asynchronous rebuild',()=>{
  const h=fixture();
  const row=(id:string)=>{const root=element(h.document,'article',{'data-id':id}),rename=element(h.document,'button',{'data-action':'rename'});rename.textContent='RENAME';root.append(rename);return{root,rename};};
  const a=row('replay-a'),b=row('replay-b');h.root.append(a.root,b.root);const context=h.context('library');h.navigation.sync(context);
  b.rename.focus();h.navigation.handle('accept');
  const nextB=row('replay-b'),nextA=row('replay-a');h.root.replaceChildren(nextA.root,nextB.root);h.navigation.sync(context);
  assert.equal(h.document.activeElement,nextB.rename,'Repeated action/text must be scoped to its stable replay record');
  const search=element(h.document,'input',{id:'library-search'}),finalA=row('replay-a'),finalB=row('replay-b');h.root.replaceChildren(search,finalB.root,finalA.root);search.focus();h.navigation.sync(context);
  assert.equal(h.document.activeElement,search,'Application-selected focus must take precedence over remembered row identity');h.navigation.clear();
});
