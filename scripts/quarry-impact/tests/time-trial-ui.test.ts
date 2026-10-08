import test from 'node:test';
import assert from 'node:assert/strict';
import {showTimeTrialResult,showTimeTrialSetup} from '../src/time-trial-ui';
import {readTimeTrialRecords,timeTrialKey,type TimeTrialConfig,type TimeTrialResult} from '../src/time-trial';

/** Explicit DOM boundary for the dependency-free Node suite. It parses the
 * production markup and dispatches real Event objects to its handlers; native
 * layout, focus/controller traversal and rendering remain browser QA gates. */
const decode=(value:string)=>value.replace(/&(amp|lt|gt|quot|#39);/g,(_,entity:string)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[entity]!));
class Element extends EventTarget{
  children:(Element|string)[]=[];attributes:Record<string,string>={};disabled=false;
  onchange:((event:Event)=>unknown)|null=null;onclick:((event:Event)=>unknown)|null=null;
  private selection=0;private fieldValue='';
  constructor(readonly tagName='DIV'){super();}
  get id(){return this.attributes.id??'';}
  get options(){return this.querySelectorAll('option');}
  get value(){return this.tagName==='SELECT'?(this.options[this.selection]?.attributes.value??''):this.fieldValue;}
  set value(value:string){if(this.tagName==='SELECT')this.selection=this.options.findIndex(option=>option.attributes.value===value);else this.fieldValue=value;}
  get textContent():string{return this.children.map(child=>typeof child==='string'?child:child.textContent).join('');}
  set textContent(value:string){this.children=[value];}
  set innerHTML(markup:string){
    this.children=[];const stack:Element[]=[this];
    for(const token of markup.match(/<[^>]+>|[^<]+/g)??[]){
      if(token.startsWith('</')){stack.pop();continue;}
      if(token.startsWith('<')){
        const tag=/^<([\w-]+)/.exec(token);assert.ok(tag,`Unsupported fixture token ${token}`);
        const element=new Element(tag[1].toUpperCase());
        for(const attr of token.matchAll(/([\w-]+)="([^"]*)"/g))element.attributes[attr[1]]=decode(attr[2]);
        element.disabled=/\sdisabled(?:\s|>)/.test(token);stack.at(-1)!.children.push(element);
        if(!['INPUT','BR','HR','IMG'].includes(element.tagName))stack.push(element);
      }else stack.at(-1)!.children.push(decode(token));
    }
    assert.equal(stack.length,1,'Production panel markup must have balanced elements');
  }
  querySelectorAll(selector:string):Element[]{
    const matches=(node:Element)=>selector.startsWith('#')?node.id===selector.slice(1):node.tagName===selector.toUpperCase();
    return this.children.flatMap(child=>typeof child==='string'?[]:[...(matches(child)?[child]:[]),...child.querySelectorAll(selector)]);
  }
  querySelector(selector:string){return this.querySelectorAll(selector)[0]??null;}
  override dispatchEvent(event:Event){const result=super.dispatchEvent(event);if(event.type==='change')this.onchange?.(event);if(event.type==='click')this.onclick?.(event);return result;}
  click(){if(!this.disabled)this.dispatchEvent(new Event('click'));}
}
const config:TimeTrialConfig={kind:'tern',course:'ironfield-figure-eight-v1',direction:'forward'};
const result=(changes:Partial<TimeTrialResult>={}):TimeTrialResult=>({status:'finished',eligible:true,reason:'',time:31.123456,previousBest:null,best:31.123456,delta:null,newBest:true,...changes});
function fixture(){const root=new Element();return{root,ui:root as unknown as HTMLElement,get:(id:string)=>{const node=root.querySelector('#'+id);assert.ok(node,id);return node;}};}

test('setup exposes native eleven-car, four-course and two-direction controls and refreshes the exact selection PB without mutating settings',()=>{
  const h=fixture(),records=readTimeTrialRecords(),original=Object.freeze({...config});
  records.bests[timeTrialKey(config)]=31.123456;
  records.bests[timeTrialKey({...config,direction:'reverse'})]=32.987654;
  let starts=0;
  showTimeTrialSetup(h.ui,original,records,{start(){starts++;},close(){}});
  assert.equal(h.get('time-trial-kind').tagName,'SELECT');assert.equal(h.get('time-trial-kind').options.length,11);
  assert.equal(h.get('time-trial-course').options.length,4);assert.equal(h.get('time-trial-direction').options.length,2);
  assert.equal(h.get('time-trial-kind').value,'tern');assert.equal(h.get('time-trial-course').value,'ironfield-figure-eight-v1');
  assert.equal(h.get('time-trial-best').textContent,'0:31.12');
  const direction=h.get('time-trial-direction');direction.value='reverse';direction.dispatchEvent(new Event('change'));
  assert.equal(h.get('time-trial-best').textContent,'0:32.99');
  const course=h.get('time-trial-course');course.value='cinderbank-oval-v1';course.dispatchEvent(new Event('change'));
  assert.equal(h.get('time-trial-best').textContent,'—');
  const kind=h.get('time-trial-kind');kind.value='marten';kind.dispatchEvent(new Event('change'));
  assert.equal(h.get('time-trial-best').textContent,'—');assert.deepEqual(original,config);assert.equal(starts,0);
  assert.match(h.root.textContent,/One lap\. Factory stock/);assert.match(h.root.textContent,/Recovery makes the run practice only/);
});

test('Start passes a fresh valid selection and Back only closes; invalid native values cannot launch',()=>{
  const h=fixture();const starts:TimeTrialConfig[]=[];let closes=0;
  showTimeTrialSetup(h.ui,config,readTimeTrialRecords(),{start:value=>starts.push(value),close:()=>closes++});
  const kind=h.get('time-trial-kind'),course=h.get('time-trial-course'),direction=h.get('time-trial-direction');
  kind.value='buggy';course.value='cinderbank-oval-v1';direction.value='reverse';direction.dispatchEvent(new Event('change'));
  h.get('time-trial-start').click();assert.deepEqual(starts,[{kind:'buggy',course:'cinderbank-oval-v1',direction:'reverse'}]);
  kind.value='coupe';kind.dispatchEvent(new Event('change'));assert.equal(starts[0].kind,'buggy','The active run cannot follow later UI edits');
  direction.value='opposing';direction.dispatchEvent(new Event('change'));
  assert.equal(h.get('time-trial-start').disabled,true);h.get('time-trial-start').click();h.get('time-trial-start').onclick?.(new Event('click'));
  assert.equal(starts.length,1);h.get('time-trial-close').click();assert.equal(closes,1);
  assert.deepEqual(config,{kind:'tern',course:'ironfield-figure-eight-v1',direction:'forward'});
});

test('result uses precise times, honest first/slower/tied improvements and stable retry/setup/menu callbacks',()=>{
  const h=fixture();let retries=0,setups=0,closes=0;const callbacks={retry:()=>retries++,setup:()=>setups++,close:()=>closes++};
  showTimeTrialResult(h.ui,config,result(),callbacks);
  assert.equal(h.get('time-trial-status').textContent,'NEW PERSONAL BEST.');assert.equal(h.get('time-trial-time').textContent,'0:31.12');
  assert.match(h.get('time-trial-comparison').textContent,/first qualifying lap/);assert.match(h.root.textContent,/TERN/);
  assert.equal(retries+setups+closes,0);h.get('again').click();h.get('time-trial-setup-back').click();h.get('back').click();
  assert.deepEqual([retries,setups,closes],[1,1,1]);
  showTimeTrialResult(h.ui,config,result({newBest:false,time:32.123456,previousBest:31.123456,best:31.123456,delta:1}),callbacks);
  assert.equal(h.get('time-trial-status').textContent,'LAP COMPLETE.');assert.equal(h.get('time-trial-best').textContent,'0:31.12');
  assert.match(h.get('time-trial-comparison').textContent,/\+1\.00s/);
  showTimeTrialResult(h.ui,config,result({previousBest:31.123456001,delta:-.000000001}),callbacks);
  assert.match(h.get('time-trial-comparison').textContent,/<0\.01s FASTER/);
  showTimeTrialResult(h.ui,config,result({newBest:false,previousBest:31.123456,delta:0}),callbacks);
  assert.match(h.get('time-trial-comparison').textContent,/EVEN/);
});

test('practice and DNF results retain old bests without inventing a finish or claiming a record, and make Retry immediately available',()=>{
  const h=fixture(),callbacks={retry(){},setup(){},close(){}};
  showTimeTrialResult(h.ui,config,result({status:'invalid',eligible:false,newBest:false,previousBest:35,best:35,delta:-3.876544,reason:'Recovery was used. This practice finish cannot set a personal best.'}),callbacks);
  assert.equal(h.get('time-trial-status').textContent,'PRACTICE FINISH.');assert.equal(h.get('time-trial-time').textContent,'0:31.12');
  assert.equal(h.get('time-trial-best').textContent,'0:35.00');assert.match(h.get('time-trial-reason').textContent,/cannot set a personal best/);
  showTimeTrialResult(h.ui,config,result({status:'dnf',eligible:false,newBest:false,time:null,previousBest:35,best:35,delta:null,reason:'Finish the ordered lap with your car still running to set a personal best.'}),callbacks);
  assert.equal(h.get('time-trial-status').textContent,'LAP UNFINISHED.');assert.equal(h.get('time-trial-time').textContent,'—');
  assert.equal(h.get('time-trial-comparison').textContent,'Existing personal best retained.');assert.equal(h.get('again').disabled,false);
  assert.doesNotMatch(h.root.textContent,/No personal best recorded/);
});

test('setup and result present storage failures as text without claiming a durable save or permitting markup injection',()=>{
  const h=fixture(),warning='Personal best kept for this session only. <img src=x onerror="throw 1"> & storage unavailable.';
  showTimeTrialSetup(h.ui,config,readTimeTrialRecords(),{start(){},close(){}},warning);
  assert.equal(h.get('time-trial-notice').textContent,warning);assert.equal(h.root.querySelector('img'),null);
  assert.equal(h.get('time-trial-notice').attributes.role,'status');
  showTimeTrialResult(h.ui,config,result({reason:'<script>alert(1)</script>'}),{retry(){},setup(){},close(){}},warning);
  assert.equal(h.get('time-trial-notice').textContent,warning);assert.equal(h.root.querySelector('img'),null);assert.equal(h.root.querySelector('script'),null);
  assert.equal(h.get('time-trial-reason').textContent,'<script>alert(1)</script>');assert.doesNotMatch(h.root.textContent,/successfully saved|saved permanently/i);
});
