import {mountSetupBenchmark} from './setup-benchmark-ui';
import {mountLiveryEditor} from './livery-ui';
import {normalizeGroups,type LiveryFace} from './livery';
import { DEFINITIONS, type CarKind } from './rules';
import { TUNE_FIELDS, exportSetup, importSetup, normalizeSetup, setupPhysics, stockSetup, type GarageCar, type Setup } from './garage';

const hex = (value: number) => '#' + value.toString(16).padStart(6, '0');
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function showGarage(ui: HTMLElement, kind: CarKind, car: GarageCar, callbacks: {
  preview: (setup: Setup) => void; view:(face:LiveryFace)=>void; save: (car: GarageCar) => boolean; close: () => void;
}) {
  let benchmark:ReturnType<typeof mountSetupBenchmark>|undefined;
  const close=()=>{benchmark?.dispose();callbacks.close();};
  let groups=normalizeGroups(car.groups);
  let draft = normalizeSetup(car.setup, kind), presets = car.presets.map(p => ({name:p.name, setup:normalizeSetup(p.setup, kind)}));
  const feedback = (message: string) => { ui.querySelector('#garage-feedback')!.textContent = message; };
  const update = () => {
    const physics = setupPhysics(kind, draft), stock = setupPhysics(kind, stockSetup(kind));
    ui.querySelector('#garage-metrics')!.textContent = `${Math.round(physics.mass).toLocaleString()} kg · ${Math.round(physics.force).toLocaleString()} N wheel force · ${Math.round(physics.speedLimit * 3.6)} km/h gearing ceiling · ${Math.round((1-physics.damageScale)*100)}% impact protection`;
    ui.querySelector('#garage-tradeoff')!.textContent = `Wheel force per kilogram: ${((physics.force/physics.mass)/(stock.force/stock.mass)*100).toFixed(0)}% of stock. Speed ceiling is a gearing limit, not a measured top speed. Reinforcement adds weight and fitted steel parts; tire upgrades improve grip.`;
    for(const {key} of TUNE_FIELDS) ui.querySelector(`[data-value="${key}"]`)!.textContent = draft.tune[key].toFixed(2);
    ui.querySelector('#garage-reinforcement')!.textContent = ['Stock bodywork — no additional reinforcement.', 'Club: fitted front and rear impact beams.', 'Sport: impact beams plus side protection.', 'Competition: beams, side protection and additional bracing.'][draft.armor];
    benchmark?.changed();
    callbacks.preview(draft);
  };
  const render = () => {
    benchmark?.dispose();
    ui.innerHTML = `<div class="garage-screen"><aside class="garage-caption"><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h1>MAKE IT<br>YOUR OWN.</h1><p>Build for the race.<br>Brace for the impact.</p></aside><section class="garage-panel" aria-label="Garage"><header><div><div class="eyebrow">GARAGE / ${DEFINITIONS[kind].name}</div><h2>BUILT TO COMPETE</h2></div><button id="garage-close" aria-label="Close garage">✕</button></header><p class="garage-scope">Your solo car setup. Online events currently use the server’s stock specification.</p><section class="garage-section"><h3>PAINT SHOP</h3><div class="garage-paint"><label>Body paint<input id="garage-paint" type="color" value="${hex(draft.paint)}"></label><label>Trim paint<input id="garage-trim" type="color" value="${hex(draft.trim)}"></label></div></section><section class="garage-section" id="livery-editor"></section><section class="garage-section"><h3>PERFORMANCE & PROTECTION</h3><div class="garage-upgrades">${(['engine','tires','armor'] as const).map(key => `<label>${key === 'engine' ? 'Engine package' : key === 'tires' ? 'Tire compound' : 'Chassis reinforcement'}<select id="garage-${key}">${['Stock','Club','Sport','Competition'].map((name,i)=>`<option value="${i}" ${draft[key]===i?'selected':''}>${name}</option>`).join('')}</select></label>`).join('')}</div><p id="garage-reinforcement" class="garage-help"></p><p id="garage-metrics" class="garage-metrics"></p><p id="garage-tradeoff" class="garage-help"></p></section><section class="garage-section" id="garage-benchmark"></section><section class="garage-section"><h3>CHASSIS TUNING</h3>${TUNE_FIELDS.map(({key,label,low,high,help}) => `<div class="garage-tune"><label for="tune-${key}">${label}<output data-value="${key}">${draft.tune[key].toFixed(2)}</output></label><input id="tune-${key}" type="range" min="-1" max="1" step=".05" value="${draft.tune[key]}" aria-describedby="help-${key}"><div class="garage-range"><span>${low}</span><span>${high}</span></div><p id="help-${key}" class="garage-help">${help}</p></div>`).join('')}</section><section class="garage-section"><h3>SETUP BOOK</h3><div class="garage-preset-row"><label>Preset name<input id="preset-name" maxlength="32" placeholder="e.g. Gravel sprinter"></label><button id="preset-save">SAVE PRESET</button></div><div class="garage-preset-list">${presets.map((p,i) => `<div><button data-load="${i}">${escape(p.name)}</button><button data-remove="${i}" aria-label="Remove ${escape(p.name)} preset">✕</button></div>`).join('')}</div><p class="garage-help">Up to eight setups per car. A matching name replaces that preset. Presets are stored when you apply changes.</p><details><summary>Share a setup</summary><label class="garage-share">Setup data<textarea id="setup-data" rows="5" spellcheck="false" placeholder="Paste a Quarry Impact setup here"></textarea></label><div class="garage-actions"><button id="setup-export">GENERATE SHARE DATA</button><button id="setup-import">IMPORT DATA</button></div></details></section><p id="garage-feedback" role="status" aria-live="polite"></p><footer class="garage-actions"><button id="garage-reset">RESET TO STOCK</button><button id="garage-apply" class="primary">APPLY & RETURN ↗</button></footer></section></div>`;
    ui.querySelector<HTMLButtonElement>('#garage-close')!.onclick=close;
    for(const key of ['paint','trim'] as const) ui.querySelector<HTMLInputElement>(`#garage-${key}`)!.oninput=e=>{draft[key]=parseInt((e.target as HTMLInputElement).value.slice(1),16);update();};
    for(const key of ['engine','tires','armor'] as const) ui.querySelector<HTMLSelectElement>(`#garage-${key}`)!.onchange=e=>{draft[key]=+(e.target as HTMLSelectElement).value;update();};
    for(const {key} of TUNE_FIELDS) ui.querySelector<HTMLInputElement>(`#tune-${key}`)!.oninput=e=>{draft.tune[key]=+(e.target as HTMLInputElement).value;update();};
    ui.querySelector<HTMLButtonElement>('#preset-save')!.onclick=()=>{
      const name=ui.querySelector<HTMLInputElement>('#preset-name')!.value.trim().slice(0,32);
      if(!name){feedback('Name this preset first.');return;}
      const index=presets.findIndex(p=>p.name.toLowerCase()===name.toLowerCase());
      if(index<0&&presets.length===8){feedback('Eight presets saved. Remove one or replace a named preset.');return;}
      const preset={name,setup:normalizeSetup(draft,kind)};
      if(index<0)presets.push(preset);else presets[index]=preset;
      render();feedback('Preset ready. Apply changes to keep it.');
    };
    ui.querySelectorAll<HTMLButtonElement>('[data-load]').forEach(button=>button.onclick=()=>{draft=normalizeSetup(presets[+button.dataset.load!].setup,kind);render();feedback('Preset loaded.');});
    ui.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button=>button.onclick=()=>{presets.splice(+button.dataset.remove!,1);render();});
    ui.querySelector<HTMLButtonElement>('#setup-export')!.onclick=()=>{ui.querySelector<HTMLTextAreaElement>('#setup-data')!.value=exportSetup(kind,draft);feedback('Copy the setup data to share it.');};
    ui.querySelector<HTMLButtonElement>('#setup-import')!.onclick=()=>{try{draft=importSetup(ui.querySelector<HTMLTextAreaElement>('#setup-data')!.value,kind);render();feedback('Imported. Apply changes to keep this setup.');}catch(error){feedback((error as Error).message);}};
    ui.querySelector<HTMLButtonElement>('#garage-reset')!.onclick=()=>{draft=stockSetup(kind);render();feedback('Stock setup restored in preview. Apply changes to keep it.');};
    ui.querySelector<HTMLButtonElement>('#garage-apply')!.onclick=()=>{if(callbacks.save({setup:normalizeSetup(draft,kind),presets,groups})){close();}else feedback('Browser storage is unavailable. Your setup works for this session; free storage and try again to save it.');};
    mountLiveryEditor(ui.querySelector('#livery-editor')!,draft.livery,groups,(layers,savedGroups)=>{draft.livery=layers;groups=savedGroups;update();},callbacks.view);
    benchmark=mountSetupBenchmark(ui.querySelector('#garage-benchmark')!,kind,()=>normalizeSetup(draft,kind));
    update();
  };
  render();
}
