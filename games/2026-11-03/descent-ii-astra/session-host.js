/* The browser page stays open; at most one game runtime owns its resources. */
(()=>{
  'use strict';
  let frame,generation=0;
  function openTitle(invite=''){
    frame?.remove();
    frame=document.createElement('iframe');frame.id='astraSession';
    frame.title='Descent II Astra';frame.allow='autoplay; fullscreen; gamepad';
    frame.allowFullscreen=true;
    const url=new URL('play.html?v=pyre69',location.href);url.hash=invite;
    frame.src=url.href;document.body.append(frame);generation++;
  }
  window.addEventListener('message',event=>{
    if(event.source!==frame?.contentWindow||event.origin!==location.origin)return;
    if(event.data?.type==='astra:return-to-title'){
      history.replaceState(null,'',location.pathname+location.search);
      openTitle();
    }
  });
  window.astraShell={get generation(){return generation;}};
  openTitle(/^#room=[0-9A-V]{9}$/.test(location.hash)?location.hash:'');
})();
