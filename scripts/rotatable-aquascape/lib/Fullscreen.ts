/** Keep the aquarium and its controls together in fullscreen, including touch devices. */
export function installFullscreen(main:HTMLElement,button:HTMLButtonElement){
 const doc=document as Document&{webkitFullscreenElement?:Element;webkitExitFullscreen?:()=>Promise<void>};
 const element=main as HTMLElement&{webkitRequestFullscreen?:()=>Promise<void>};let fallback=false;
 const active=()=>document.fullscreenElement===main||doc.webkitFullscreenElement===main||fallback;
 const sync=()=>{const on=active();main.classList.toggle('aquarium-fullscreen',on);button.textContent=on?'Exit full screen':'Full screen';button.setAttribute('aria-pressed',String(on));button.title=on?'Exit full screen (Esc)':'Fill the screen with the aquarium';};
 button.onclick=async()=>{try{if(active()){fallback=false;if(document.fullscreenElement)await document.exitFullscreen();else if(doc.webkitFullscreenElement)await doc.webkitExitFullscreen?.();}else if(element.requestFullscreen)await element.requestFullscreen();else if(element.webkitRequestFullscreen)await element.webkitRequestFullscreen();else fallback=true;}catch{fallback=!active();}sync();};
 document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&fallback){fallback=false;sync();button.focus();}});sync();
}
