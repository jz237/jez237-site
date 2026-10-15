import {SCORE_MODES,SCORE_SEAS,scoreInitials,globalBoard,captureGlobalRun,completeGlobalRun,createGlobalScoresClient,createGlobalSubmission,formatGlobalScore} from './global-scores.js';

export function createGlobalScoresView({courses,getCourse,difficulties,getSelection,storage,client=createGlobalScoresClient()}){
 const $=id=>document.getElementById(id);
 const panel=document.createElement('dialog');panel.id='globalScoresPanel';panel.setAttribute('aria-labelledby','globalScoresTitle');
 panel.innerHTML=`<div class="options-heading"><h2 id="globalScoresTitle">Global leaderboard</h2><button id="closeGlobalScores" type="button" autofocus>Close</button></div>
  <p>Worldwide top 10 · fastest times and highest stunt scores.</p>
  <div class="global-filters"><label>Event<select id="globalMode"></select></label><label>Course<select id="globalCourse"></select></label>
  <label>Class<select id="globalDifficulty"></select></label><label id="globalLapsLabel">Laps<select id="globalLaps"></select></label>
  <label>Sea state<select id="globalSea"></select></label><label>Craft<select id="globalTuning"></select></label></div>
  <p id="globalBoardNote"></p><p id="globalBoardStatus" role="status" aria-live="polite"></p>
  <table><caption class="sr-only" id="globalCaption"></caption><thead><tr><th scope="col">Rank</th><th scope="col">Initials</th><th scope="col" id="globalMetric">Time</th></tr></thead><tbody id="globalRows"></tbody></table>
  <button type="button" id="refreshGlobalScores">Refresh rankings</button><p class="global-small">Each course, class, lap count, sea state and tuning category has its own board. These are community submitted records.</p>`;
 document.body.append(panel);
 const result=document.createElement('section');result.id='globalResult';result.hidden=true;
 result.innerHTML=`<p id="globalRunSummary"></p><form id="globalScoreForm"><label>Initials <input id="globalInitials" maxlength="3" pattern="[A-Za-z0-9]{1,3}" required value="YOU" autocomplete="off" autocapitalize="characters" spellcheck="false"></label><button type="submit" id="postGlobalScore">Post worldwide</button></form><p id="globalPostStatus" role="status" aria-live="polite">Share your initials and result on the global leaderboard.</p><button type="button" id="viewGlobalResult">View this leaderboard</button>`;
 $('recordForm').before(result);
 const menuButton=document.createElement('button');menuButton.id='globalScoresButton';menuButton.type='button';menuButton.textContent='Global leaderboard';$('recordsButton').after(menuButton);
 function options(id,values){for(const [value,label] of values){const o=document.createElement('option');o.value=value;o.textContent=label;$(id).append(o);}}
 options('globalMode',Object.entries(SCORE_MODES));options('globalCourse',courses.map(c=>[c.id,c.name]));
 options('globalDifficulty',difficulties.map((d,i)=>[i,d]));options('globalLaps',[3,4,5,6,9].map(n=>[n,n]));
 options('globalSea',Object.entries(SCORE_SEAS));options('globalTuning',[['standard','Standard tuning'],['custom','Custom tuning']]);
 let context=null,run=null,submission=null,generation=0;
 try{$('globalInitials').value=scoreInitials(storage.getItem('after-the-storm-global-initials'));}catch{}
 const describe=b=>`${getCourse(b.course).name} · ${difficulties[b.difficulty]} · ${SCORE_MODES[b.mode]}${b.mode==='stunt'?'':' · '+b.laps+' laps'} · ${SCORE_SEAS[b.seaState]} · ${b.tuning==='custom'?'Custom':'Standard'} tuning`;
 function selection(){
  const mode=$('globalMode').value,courseSelect=$('globalCourse');
  for(const option of courseSelect.options)option.disabled=option.value==='practice'&&mode!=='stunt';
  if(mode!=='stunt'&&courseSelect.value==='practice')courseSelect.value='greyhaven';
  $('globalLapsLabel').hidden=mode==='stunt';
  const course=courseSelect.value,difficulty=Number($('globalDifficulty').value);
  return globalBoard({mode,course,difficulty,laps:Number($('globalLaps').value),seaState:$('globalSea').value,
   tuning:$('globalTuning').value,layoutRevision:getCourse(course,difficulty).layoutRevision??0});
 }
 async function refresh(){
  const token=++generation,board=selection();
  $('globalRows').replaceChildren();$('globalBoardStatus').textContent='Loading worldwide rankings…';
  $('globalBoardNote').textContent=describe(board);$('globalCaption').textContent=describe(board);
  $('globalMetric').textContent=board.mode==='stunt'?'Points':'Time';panel.setAttribute('aria-busy','true');
  try{
   const rows=await client.load(board);if(token!==generation)return;
   rows.forEach((row,i)=>{const tr=document.createElement('tr');for(const value of [i+1,row.initials,formatGlobalScore(board,row.value)]){const td=document.createElement('td');td.textContent=value;tr.append(td);}$('globalRows').append(tr);});
   $('globalBoardStatus').textContent=rows.length?'Live rankings · '+rows.length+' record'+(rows.length===1?'':'s'):'No global records yet. Complete a run and be the first.';
  }catch{if(token===generation)$('globalBoardStatus').textContent='Global leaderboard is offline. Your local records are available in Course records. Try Refresh rankings.';}
  finally{if(token===generation)panel.setAttribute('aria-busy','false');}
 }
 function open(board){
  const b=board??getSelection();
  $('globalMode').value=Object.hasOwn(SCORE_MODES,b.mode)?b.mode:'race';$('globalCourse').value=b.course??'greyhaven';
  $('globalDifficulty').value=b.difficulty??0;$('globalLaps').value=b.laps===1?3:b.laps??3;
  $('globalSea').value=b.seaState??'course';$('globalTuning').value=b.tuning??'standard';
  panel.showModal();refresh();
 }
 menuButton.onclick=()=>open();$('viewGlobalResult').onclick=()=>open(run.board);
 $('closeGlobalScores').onclick=()=>panel.close();$('refreshGlobalScores').onclick=refresh;
 for(const id of ['globalMode','globalCourse','globalDifficulty','globalLaps','globalSea','globalTuning'])$(id).onchange=refresh;
 panel.addEventListener('close',()=>{generation++;panel.setAttribute('aria-busy','false');});
 // Escape closes the native dialog without reaching the game's pause key handler.
 panel.addEventListener('keydown',e=>e.stopPropagation());
 $('globalScoreForm').onsubmit=async e=>{
  e.preventDefault();if(!submission||submission.posted)return;
  const ticket=submission,initials=scoreInitials($('globalInitials').value);$('globalInitials').value=initials;
  $('postGlobalScore').disabled=true;$('globalInitials').disabled=true;$('globalPostStatus').textContent='Posting worldwide…';
  try{
   await ticket.submit(initials);if(submission!==ticket)return;
   try{storage.setItem('after-the-storm-global-initials',initials);}catch{}
   $('globalPostStatus').textContent='Posted worldwide · '+initials+'. View this leaderboard to see the latest top 10.';
   $('postGlobalScore').textContent='Posted worldwide';
  }catch{
   if(submission!==ticket)return;$('globalPostStatus').textContent='Could not confirm your global score. Check your connection, then retry. Your result is still here.';
   $('postGlobalScore').disabled=false;$('globalInitials').disabled=false;$('postGlobalScore').textContent='Retry worldwide post';
  }
 };
 return {
  begin(state,options){context=captureGlobalRun(state,options);run=null;submission=null;result.hidden=true;$('postGlobalScore').disabled=false;$('globalInitials').disabled=false;$('postGlobalScore').textContent='Post worldwide';$('globalPostStatus').textContent='Share your initials and result on the global leaderboard.';},
  hide(){result.hidden=true;},
  finish(state){run=completeGlobalRun(context,state);result.hidden=!run;if(run){submission=createGlobalSubmission(run,client);$('globalRunSummary').textContent='Global result: '+formatGlobalScore(run.board,run.value)+' · '+describe(run.board);}}
 };
}
