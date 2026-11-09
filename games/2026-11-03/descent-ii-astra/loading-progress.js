/* Progress describes the current operation, never an invented whole-load ETA. */
(()=>{
  const q=id=>document.getElementById(id), screen=q('loadingScreen');
  const names={download:'Downloading',textures:'Preparing textures',effects:'Preparing effects'};
  const block=document.createElement('div');block.className='loading-progress';
  block.innerHTML='<div class="loading-phases" aria-hidden="true"><span data-load-phase="download">Download</span><span data-load-phase="textures">Textures</span><span data-load-phase="effects">Effects</span></div><div class="loading-operation"><strong id="loadingPhase">Preparing flight</strong><span id="loadingCount"></span></div><div id="loadingProgress" role="progressbar" aria-label="Current loading operation" aria-valuemin="0"><span></span></div>';
  q('status').before(block);screen.classList.add('has-progress');
  let phase='',serial=0;
  window.astraLoad={
    begin(title='Preparing your ship.'){
      serial++;phase='';screen.querySelector('h2').textContent=title;this.progress('', 'Preparing flight');window.astraTerminal?.loading(true);
    },
    progress(next,label,done,total){
      phase=next;const known=Number.isFinite(done)&&Number.isFinite(total)&&total>0;
      q('loadingPhase').textContent=names[next]||'Preparing flight';q('loadingCount').textContent=known?`${Math.min(total,Math.max(0,done))} / ${total}`:'';
      const bar=q('loadingProgress');bar.classList.toggle('indeterminate',!known);
      if(known){const value=Math.min(total,Math.max(0,done));bar.setAttribute('aria-valuemax',total);bar.setAttribute('aria-valuenow',value);bar.setAttribute('aria-valuetext',`${q('loadingPhase').textContent}: ${q('loadingCount').textContent}`);bar.firstElementChild.style.width=(100*value/total)+'%';}else{bar.removeAttribute('aria-valuenow');bar.removeAttribute('aria-valuetext');bar.removeAttribute('aria-valuemax');bar.firstElementChild.style.width='38%';}
      screen.querySelectorAll('[data-load-phase]').forEach(el=>el.classList.toggle('active',el.dataset.loadPhase===phase));
      q('status').textContent=label||names[next]||'Preparing flight';
      if(window.Module)Module.loadingProgress={phase,label,done:known?done:null,total:known?total:null,serial};
    },
    finish(){window.astraTerminal?.loading(false);}
  };
})();
