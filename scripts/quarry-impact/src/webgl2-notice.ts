/** WebGL 2 notice: the game draws everything through WebGL 2 (Three.js has no other path). Where the browser cannot start it —
 * hardware acceleration off, a blocklisted graphics driver, a remote desktop or virtual machine without 3D, an old browser —
 * the player is told so plainly, with what to try, instead of the game failing silently behind its loading screen. */
type ContextSource={getContext(id:string,options?:object):unknown};
/** Can this browser start WebGL 2? Asked of a fresh canvas (never the game's), whose context is let go again at once. */
export function hasWebGL2(make:()=>ContextSource=()=>document.createElement('canvas')){
  try{
    const gl=make().getContext('webgl2',{powerPreference:'high-performance'}) as {getExtension?(name:string):{loseContext?():void}|null}|null;
    if(!gl)return false;gl.getExtension?.('WEBGL_lose_context')?.loseContext?.();return true;
  }catch{return false;}
}
/** What the player is told, in the loading screen's colours. */
export function webgl2NoticeHtml(){
  return `<div role="alert" style="position:fixed;inset:0;background:#141a18;color:#e8e2cf;display:grid;place-items:center;padding:24px;font:15px/1.55 system-ui,sans-serif;overflow:auto">
<div style="max-width:560px">
<div style="color:#d9c486;font-weight:700;letter-spacing:3px;font-size:13px">QUARRY IMPACT</div>
<h1 style="margin:10px 0 12px;font-size:24px;line-height:1.25;color:#f3edd9">This game needs WebGL 2</h1>
<p style="margin:0 0 14px">Your browser couldn't start WebGL 2, which the game uses to draw its 3D world. It usually comes down to one of these:</p>
<ul style="margin:0 0 16px;padding-left:20px">
<li style="margin-bottom:8px"><b>Hardware acceleration is off.</b> Chrome or Edge: Settings &rsaquo; System &rsaquo; <i>Use graphics acceleration when available</i>, then restart the browser. Firefox: Settings &rsaquo; General &rsaquo; Performance.</li>
<li style="margin-bottom:8px"><b>An old browser or graphics driver.</b> Update them, or open the game in a current Chrome, Edge, Firefox or Safari (15 or later).</li>
<li><b>A remote desktop or virtual machine.</b> These often have no 3D graphics; play on the computer itself.</li>
</ul>
<button type="button" data-webgl2-retry style="font:600 14px system-ui,sans-serif;letter-spacing:1px;padding:10px 18px;border:1px solid #d9c486;background:transparent;color:#d9c486;border-radius:4px;cursor:pointer">TRY AGAIN</button>
</div></div>`;
}
/** Puts the notice up over the loading screen (once), with a button that reloads the page to try again. */
export function showWebGL2Notice(root:HTMLElement|null=document.getElementById('ui')){
  const host=root??document.body;if(host.querySelector('[data-webgl2-retry]'))return;
  host.innerHTML=webgl2NoticeHtml();host.querySelector('[data-webgl2-retry]')?.addEventListener('click',()=>location.reload());
}
