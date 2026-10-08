import {benchmarkKey,benchmarkSetup,benchmarkStock,type BenchmarkSurface,type SetupBenchmark} from './setup-benchmark';
import type {Setup} from './garage';
import type {CarKind} from './rules';

/** Mounted per garage render; disposal cancels a running simulation. */
export function mountSetupBenchmark(root:HTMLElement,kind:CarKind,current:()=>Setup){
 root.innerHTML=`<h3>TEST YOUR SETUP</h3><p class="garage-help">Compare an intact car with factory stock on a flat straight. Uses race physics; hills, corners and collision damage change the result.</p><label>Test surface <select id="garage-test-surface"><option value="asphalt">Asphalt</option><option value="gravel">Gravel</option></select></label><div class="garage-actions"><button id="garage-test">RUN COMPARISON</button><button id="garage-test-cancel" hidden>CANCEL TEST</button></div><p id="garage-test-status" role="status" aria-live="polite">Ready to test your current setup.</p><div id="garage-test-results"></div>`;
 const start=root.querySelector<HTMLButtonElement>('#garage-test')!,cancel=root.querySelector<HTMLButtonElement>('#garage-test-cancel')!,surface=root.querySelector<HTMLSelectElement>('#garage-test-surface')!,status=root.querySelector<HTMLElement>('#garage-test-status')!,results=root.querySelector<HTMLElement>('#garage-test-results')!;
 let controller:AbortController|null=null,revision=0,disposed=false,key=benchmarkKey(kind,current(),surface.value as BenchmarkSurface);
 const stop=()=>{revision++;controller?.abort();controller=null;start.disabled=false;cancel.hidden=true;};
 const changed=()=>{
  const next=benchmarkKey(kind,current(),surface.value as BenchmarkSurface);if(next===key)return;
  key=next;stop();results.replaceChildren();status.textContent='Setup changed. Run a new comparison.';
 };
 surface.onchange=changed;
 cancel.onclick=()=>{stop();status.textContent='Test cancelled. Your setup is unchanged.';};
 start.onclick=async()=>{
  stop();const token=revision,abort=new AbortController();controller=abort;start.disabled=true;cancel.hidden=false;results.replaceChildren();
  const setup=current(),ground=surface.value as BenchmarkSurface;
  status.textContent='Testing factory stock…';
  try{
   const stock=await benchmarkStock(kind,ground,abort.signal);if(disposed||token!==revision)return;
   status.textContent='Testing your setup…';
   const draft=await benchmarkSetup(kind,setup,ground,abort.signal);if(disposed||token!==revision)return;
   const row=(label:string,k:keyof SetupBenchmark,unit:string,lower:boolean)=>{
    const a=stock[k],b=draft[k],value=(n:number|null)=>n===null?'Not reached':`${n.toFixed(1)} ${unit}`;
    const difference=a===null||b===null?'—':Math.abs(b-a)<.05?'Same':`${Math.abs(b-a).toFixed(1)} ${unit} ${(b<a)===lower?'better':'worse'}`;
    return `<tr><th scope="row">${label}</th><td>${value(a)}</td><td>${value(b)}</td><td>${difference}</td></tr>`;
   };
   results.innerHTML=`<table aria-label="Simulated setup comparison"><thead><tr><th>Measurement</th><th>Factory stock</th><th>Your setup</th><th>Change</th></tr></thead><tbody>${row('0–100 km/h','acceleration','s',true)}${row('Speed after 40 s','speed','km/h',false)}${row('100–0 km/h braking','braking','m',true)}</tbody></table><p class="garage-help">Full throttle from rest for 40 seconds; full brakes from 100 km/h to below 0.4 km/h. Speed after 40 seconds is not a guaranteed top speed. Steering and differential changes need a test drive through corners.</p>`;
   status.textContent=`Comparison complete · ${ground==='asphalt'?'Asphalt':'Gravel'} · Current setup`;
  }catch(error){if(!disposed&&token===revision)status.textContent=error instanceof DOMException&&error.name==='AbortError'?'Test cancelled.':'Test unavailable. Your setup is safe; try again.';}
  finally{if(!disposed&&token===revision){controller=null;start.disabled=false;cancel.hidden=true;}}
 };
 return{changed,dispose(){disposed=true;stop();}};
}
