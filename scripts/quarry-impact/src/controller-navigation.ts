export interface NavigationContext {
  key:string;
  root:HTMLElement;
  initial?:string;
  back?:()=>void;
}
export type NavigationCommand='up'|'down'|'left'|'right'|'accept'|'back';

const controls='button, a[href], input, select, textarea, summary, [tabindex], [role="button"]';
const nativeInputs=['pointerdown','pointermove','wheel','keydown'] as const;
const identityAttributes=['id','data-car','data-mode','data-challenge','data-filter','data-round','data-load','data-remove','data-action','name','aria-label'];
const observedAttributes=['hidden','disabled','inert','aria-hidden','aria-disabled','open','style','class','tabindex','type','role','href','data-id',...identityAttributes];
type Identity=({tag:string;attribute:string;value:string}|{tag:string;text:string})&{scope?:string};

function visible(element:HTMLElement,root:HTMLElement):boolean {
  if(!element.isConnected||element.tabIndex<0||element.matches(':disabled')||element.getAttribute('aria-disabled')==='true')return false;
  if(element.tagName==='INPUT'&&(element as HTMLInputElement).type==='hidden')return false;
  const view=element.ownerDocument.defaultView;
  for(let node:HTMLElement|null=element;node;node=node.parentElement){
    if(node.hidden||node.hasAttribute('inert')||node.getAttribute('aria-hidden')==='true')return false;
    const style=view?.getComputedStyle(node);
    if(style&&(style.display==='none'||style.visibility==='hidden'||style.visibility==='collapse'||style.opacity==='0'))return false;
    if(node.tagName==='DETAILS'&&!(node as HTMLDetailsElement).open){
      const summary=Array.from(node.children).find(child=>child.tagName==='SUMMARY');
      if(!summary?.contains(element))return false;
    }
    // Continue above root: its host may itself be hidden or inert.
  }
  return root.contains(element)&&element.getClientRects().length>0;
}

function scope(element:HTMLElement):string|undefined {
  for(let node:HTMLElement|null=element.parentElement;node;node=node.parentElement){
    const id=node.getAttribute('data-id');if(id)return id;
  }
}
function identity(element:HTMLElement):Identity|undefined {
  const row=scope(element);
  for(const attribute of identityAttributes){
    const value=element.getAttribute(attribute);
    if(value)return {tag:element.tagName,attribute,value,scope:row};
  }
  if(['BUTTON','SUMMARY','A'].includes(element.tagName)){
    const text=element.textContent?.trim();if(text)return {tag:element.tagName,text,scope:row};
  }
}
function identifies(element:HTMLElement,key:Identity):boolean {
  return element.tagName===key.tag&&scope(element)===key.scope&&('attribute'in key?element.getAttribute(key.attribute)===key.value:element.textContent?.trim()===key.text);
}
function withoutFocusClass(value:string|null):string {
  return (value??'').split(/\s+/).filter(name=>name&&name!=='controller-focus').sort().join(' ');
}

/** The caller owns screen/modal selection. This class only operates inside the
 * supplied root and uses the controls' existing click/input/change handlers. */
export class ControllerNavigation {
  private context:NavigationContext|null=null;
  private document:Document|null=null;
  private controller=false;
  private marked:HTMLElement|null=null;
  private remembered:Identity|undefined;
  private cached:HTMLElement[]=[];
  private dirty=true;
  private topologyDirty=false;
  private observer:MutationObserver|null=null;
  private observedRoot:HTMLElement|null=null;
  private observedParent:HTMLElement|null=null;
  private resized=()=>{this.dirty=true;};
  private nativeInput=()=>{this.controller=false;this.mark(null);};
  private focusChanged=()=>{
    if(!this.controller){this.rememberNativeFocus();return;}
    const items=this.items(),active=this.active(items);
    if(active){this.remembered=identity(active);if(this.controller)this.mark(active);}
    else if(this.document?.activeElement!==this.document?.body){this.nativeInput();}
  };

  sync(context:NavigationContext|null):void {
    if(!context){this.clear();return;}
    const changed=this.context?.key!==context.key;
    if(changed)this.remembered=undefined;
    this.context=context;
    this.listen(context.root.ownerDocument);
    if(this.observedRoot!==context.root||this.observedParent!==context.root.parentElement)this.observe(context.root);
    this.readMutations();
    // sync runs in the render loop. Mouse/keyboard ownership must cost neither
    // a control-list scan nor layout reads, and never restores removed focus.
    if(!this.controller){this.rememberNativeFocus();return;}
    if(!changed&&this.observer&&!this.dirty&&this.marked===this.document!.activeElement&&this.marked?.isConnected)return;
    const items=this.items(),active=this.active(items);
    if(active){this.remembered=identity(active);this.mark(this.controller?active:null);return;}
    this.mark(null);
    const external=this.document!.activeElement;
    // An unrelated input/dialog taking focus is an explicit choice. Do not
    // reclaim it during a same-screen asynchronous refresh.
    if(!changed&&external&&external!==this.document!.body&&external!==this.document!.documentElement&&external.isConnected&&!context.root.contains(external)){
      this.controller=false;return;
    }
    const next=this.initial(items);if(next)this.focus(next);
  }

  handle(command:NavigationCommand):void {
    if(!this.context)return;
    const items=this.items(),active=this.active(items);
    this.controller=true;
    if(command==='back'){
      if(active)this.mark(active);
      this.context.back?.();return;
    }
    const current=active??this.initial(items);
    if(!current)return;
    if(!active)this.focus(current);else this.mark(current);
    if(command==='accept'){
      const type=current.tagName==='INPUT'?(current as HTMLInputElement).type:'';
      if(['BUTTON','A','SUMMARY'].includes(current.tagName)||current.getAttribute('role')==='button'||['checkbox','radio','button','submit','reset'].includes(type))current.click();
      return;
    }
    if((command==='left'||command==='right')&&this.adjust(current,command==='right'?1:-1))return;
    // The first directional press exposes the caller's safe initial choice.
    if(!active)return;
    const direction=command==='up'||command==='left'?-1:1,index=items.indexOf(current);
    const next=items[(index+direction+items.length)%items.length];if(next!==current)this.focus(next);
  }

  clear():void {
    this.mark(null);this.controller=false;this.remembered=undefined;this.context=null;this.listen(null);
    this.observer?.disconnect();this.observer=null;this.observedRoot=null;this.observedParent=null;this.cached=[];this.dirty=true;this.topologyDirty=false;
  }

  private listen(document:Document|null):void {
    if(document===this.document)return;
    for(const name of nativeInputs)this.document?.removeEventListener(name,this.nativeInput,true);
    this.document?.removeEventListener('focusin',this.focusChanged,true);
    this.document?.defaultView?.removeEventListener('resize',this.resized);
    this.document=document;
    for(const name of nativeInputs)document?.addEventListener(name,this.nativeInput,true);
    document?.addEventListener('focusin',this.focusChanged,true);
    document?.defaultView?.addEventListener('resize',this.resized);
  }
  private rememberNativeFocus():void {
    const active=this.document?.activeElement as HTMLElement|null;
    if(active&&this.context?.root.contains(active)&&active.matches(controls))this.remembered=identity(active);
  }
  private observe(root:HTMLElement):void {
    this.observer?.disconnect();this.observer=null;
    this.observedRoot=root;this.observedParent=root.parentElement;this.dirty=true;this.topologyDirty=false;
    const Observer=root.ownerDocument.defaultView?.MutationObserver;
    if(!Observer)return;
    this.observer=new Observer(records=>this.mutations(records));
    const attributes={attributes:true,attributeOldValue:true,attributeFilter:observedAttributes};
    this.observer.observe(root,{...attributes,childList:true,characterData:true,subtree:true});
    // A modal host can hide/inert this root, or an ancestor can move it. Only
    // watch those ancestors themselves, not unrelated page subtrees.
    for(let ancestor=root.parentElement;ancestor;ancestor=ancestor.parentElement)this.observer.observe(ancestor,{...attributes,childList:true});
  }
  private mutations(records:MutationRecord[]):void {
    for(const record of records){
      if(record.type==='attributes'&&record.attributeName==='class'&&withoutFocusClass(record.oldValue)===withoutFocusClass((record.target as Element).getAttribute('class')))continue;
      this.dirty=true;
      if(record.type==='childList')this.topologyDirty=true;
    }
  }
  private readMutations():void {
    // Button callbacks may rebuild synchronously before observer delivery.
    if(this.observer)this.mutations(this.observer.takeRecords());
    if(this.topologyDirty&&this.context)this.observe(this.context.root);
  }
  private items():HTMLElement[]{
    const root=this.context?.root;
    this.readMutations();
    if(root&&(this.dirty||!this.observer)){
      this.cached=Array.from(root.querySelectorAll<HTMLElement>(controls)).filter(element=>visible(element,root));this.dirty=false;
    }
    return root?this.cached:[];
  }
  private active(items:HTMLElement[]):HTMLElement|undefined {
    return items.find(element=>element===this.document?.activeElement);
  }
  private initial(items:HTMLElement[]):HTMLElement|undefined {
    const remembered=this.remembered&&items.find(element=>identifies(element,this.remembered!));
    return remembered||items.find(element=>!!this.context?.initial&&element.matches(this.context.initial))||items[0];
  }
  private mark(element:HTMLElement|null):void {
    if(this.marked===element)return;
    this.marked?.classList.remove('controller-focus');this.marked=element;element?.classList.add('controller-focus');
  }
  private focus(element:HTMLElement):void {
    this.remembered=identity(element);
    if(this.document?.activeElement!==element)element.focus({preventScroll:true});
    this.mark(element);element.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  /** Return true for an adjustable control even at its limit, so a held stick
   * cannot unexpectedly leave a slider when its value reaches the end. */
  private adjust(element:HTMLElement,direction:1|-1):boolean {
    const tag=element.tagName;
    if(tag!=='SELECT'&&!(tag==='INPUT'&&['range','number'].includes((element as HTMLInputElement).type)))return false;
    const input=element as HTMLInputElement|HTMLSelectElement,before=input.value;
    if(tag==='SELECT'){
      const select=element as HTMLSelectElement,options=Array.from(select.options);
      for(let index=select.selectedIndex+direction;index>=0&&index<options.length;index+=direction){
        const option=options[index],group=option.parentElement;
        if(option.disabled||option.hidden||group?.tagName==='OPTGROUP'&&((group as HTMLOptGroupElement).disabled||group.hidden))continue;
        select.selectedIndex=index;break;
      }
    }else{
      const number=element as HTMLInputElement;
      if(number.readOnly)return true;
      if(number.step==='any'){
        const min=number.min===''?-Infinity:Number(number.min),max=number.max===''?Infinity:Number(number.max);
        const value=Number.isFinite(number.valueAsNumber)?number.valueAsNumber:Math.max(Number.isFinite(min)?min:0,Math.min(0,max));
        number.value=String(Math.max(min,Math.min(max,Math.round((value+direction)*1e12)/1e12)));
      }else if(direction>0)number.stepUp();else number.stepDown();
    }
    if(input.value!==before){
      const NativeEvent=element.ownerDocument.defaultView?.Event??Event;
      element.dispatchEvent(new NativeEvent('input',{bubbles:true}));
      element.dispatchEvent(new NativeEvent('change',{bubbles:true}));
    }
    return true;
  }
}
