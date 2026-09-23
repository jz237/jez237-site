import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
/** This link belongs only to jez237. The shared freshwater bundle is unchanged. */
export function installReefNavigation(root){
 const path=resolve(root,'demos/rotatable-aquascape/index.html');
 if(!existsSync(resolve(root,'demos/reef-aquarium/index.html')))return;
 let html=readFileSync(path,'utf8').replace(/<!-- reef-preview-navigation -->[\s\S]*?<!-- end-reef-preview-navigation -->/g,'');
 const addition=`<!-- reef-preview-navigation -->
<style>.reef-preview-link{color:#b1e6ff!important;border:1px solid #46829e!important;background:#0c2940!important}.reef-preview-link small{margin-left:4px;font-size:9px;opacity:.75}@media(max-width:640px){.aquarium-header nav{max-width:175px;flex-wrap:wrap;justify-content:center}.aquarium-header nav a{padding:7px 8px;font-size:10px}.reef-preview-link{width:100%;text-align:center}.reef-preview-link small{display:none}}</style>
<script>(()=>{const mount=()=>{const nav=document.querySelector('header nav');if(!nav)return false;const link=document.createElement('a');link.href='../reef-aquarium/';link.className='reef-preview-link';link.innerHTML='Coral reef <small>PREVIEW</small>';nav.appendChild(link);return true;};if(!mount()){const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});observer.observe(document.getElementById('app'),{childList:true,subtree:true});}})();</script>
<!-- end-reef-preview-navigation -->`;
 html=html.replace('</body>',addition+'</body>');writeFileSync(path,html);
}
