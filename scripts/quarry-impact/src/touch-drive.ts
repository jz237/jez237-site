/** On-screen driving for phones and tablets. A floating steering pad on the left (put a thumb down anywhere there and slide
 * sideways: the further, the more lock) and pedals on the right — GAS, BRAKE (held at a stop it reverses, as on a pad) and
 * HANDBRAKE — plus CAM / RESET / FIRE, which send the same keys as the keyboard (C, R, G) so every rule stays in one place.
 * It shows only while the player drives, and only on a touch screen: from the start on a phone-like device, otherwise once
 * the screen is first touched, so keyboard and controller players never see it. Plain DOM, no per-frame work unless a
 * thumb moves. */
export const TOUCH={reach:.11,maxReach:120,dead:.06} as const;
export type TouchPedals={steer:number;gas:number;reverse:number;handbrake:boolean};
/** Steering from a thumb's sideways slide (px) on a screen this wide: −1 full left … 1 full right, with a small dead zone. */
export function touchSteer(dx:number,width:number){
  const reach=Math.min(TOUCH.maxReach,Math.max(40,width*TOUCH.reach)),v=Math.max(-1,Math.min(1,(Number.isFinite(dx)?dx:0)/reach));
  return Math.abs(v)<TOUCH.dead?0:Math.sign(v)*(Math.abs(v)-TOUCH.dead)/(1-TOUCH.dead);
}
export class TouchDrive {
  readonly pedals:TouchPedals={steer:0,gas:0,reverse:0,handbrake:false};
  private root:HTMLDivElement;private knob:HTMLElement;private pad:HTMLElement;private steerId:number|null=null;private x0=0;
  private wanted=false;private shown=false;private touched:boolean;
  constructor(parent:HTMLElement,coarse=matchMedia?.('(pointer: coarse)').matches??false){
    this.touched=coarse;
    const root=this.root=document.createElement('div');root.className='touch-drive';root.hidden=true;
    root.innerHTML='<div class="touch-steer" aria-label="Steering: slide left or right"><div class="touch-pad"><i></i></div></div>'
      +'<div class="touch-utility"><button data-key="KeyC">CAM</button><button data-key="KeyR">RESET</button><button data-key="KeyG">FIRE</button></div>'
      +'<div class="touch-pedals"><button class="touch-handbrake" data-pedal="handbrake">HAND<br>BRAKE</button><button class="touch-brake" data-pedal="reverse">BRAKE</button><button class="touch-gas" data-pedal="gas">GAS</button></div>'
      +'<div class="touch-rotate">Turn your device sideways to drive</div>';
    parent.append(root);
    const steer=root.querySelector<HTMLElement>('.touch-steer')!;this.pad=root.querySelector<HTMLElement>('.touch-pad')!;this.knob=this.pad.querySelector('i')!;
    steer.addEventListener('pointerdown',e=>{if(this.steerId!==null)return;this.steerId=e.pointerId;this.x0=e.clientX;steer.setPointerCapture?.(e.pointerId);
      this.pad.style.left=e.clientX-steer.getBoundingClientRect().left+'px';this.pad.style.top=e.clientY-steer.getBoundingClientRect().top+'px';this.pad.classList.add('live');e.preventDefault();});
    steer.addEventListener('pointermove',e=>{if(e.pointerId!==this.steerId)return;this.pedals.steer=touchSteer(e.clientX-this.x0,innerWidth);
      this.knob.style.transform=`translateX(${(this.pedals.steer*36).toFixed(1)}px)`;});
    const release=(e:PointerEvent)=>{if(e.pointerId!==this.steerId)return;this.steerId=null;this.pedals.steer=0;this.knob.style.transform='';this.pad.classList.remove('live');};
    steer.addEventListener('pointerup',release);steer.addEventListener('pointercancel',release);
    for(const b of Array.from(root.querySelectorAll<HTMLButtonElement>('[data-pedal]'))){
      const pedal=b.dataset.pedal as 'gas'|'reverse'|'handbrake',set=(on:boolean)=>{b.classList.toggle('held',on);if(pedal==='handbrake')this.pedals.handbrake=on;else this.pedals[pedal]=on?1:0;};
      b.addEventListener('pointerdown',(e:PointerEvent)=>{b.setPointerCapture?.(e.pointerId);set(true);e.preventDefault();});
      for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>set(false));
      b.addEventListener('contextmenu',(e:Event)=>e.preventDefault());
    }
    for(const b of Array.from(root.querySelectorAll<HTMLButtonElement>('[data-key]')))b.addEventListener('pointerdown',(e:PointerEvent)=>{e.preventDefault();
      for(const type of ['keydown','keyup'])dispatchEvent(new KeyboardEvent(type,{code:b.dataset.key,bubbles:true}));});
    addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!this.touched){this.touched=true;this.sync();}},{capture:true});
  }
  /** Whether the player is driving now (called every frame; touches the DOM only when this changes). */
  show(driving:boolean){if(driving===this.wanted)return;this.wanted=driving;this.sync();}
  /** True while the touch controls are on screen. */
  get active(){return this.shown;}
  private sync(){const on=this.wanted&&this.touched;if(on===this.shown)return;this.shown=on;this.root.hidden=!on;document.body.classList.toggle('touch-driving',on);if(!on)this.reset();}
  private reset(){this.pedals.steer=0;this.pedals.gas=0;this.pedals.reverse=0;this.pedals.handbrake=false;this.steerId=null;this.knob.style.transform='';this.pad.classList.remove('live');
    this.root.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
}
