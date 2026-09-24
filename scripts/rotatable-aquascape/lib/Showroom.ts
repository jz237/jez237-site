import type {Aquarium} from './Aquarium';
import {lessonNames,type Lesson} from './LearningContent';

/** Small, same-origin bridge for the Hidden Reef showroom. No simulation changes. */
export function installShowroom(aquarium:Aquarium){
 if(new URLSearchParams(location.search).get('showroom')!=='hidden-reef')return;
 aquarium.paused=false;
 document.body.classList.add('store-showroom');
 document.querySelector('.identity .eyebrow')!.textContent='THE HIDDEN REEF';
 document.querySelector('h1')!.textContent='Living Showroom';
 document.querySelector('header nav')!.innerHTML='<a class="saltwater-link" href="../reef/?showroom=hidden-reef" target="_top">&#8592; Saltwater aquarium</a><a href="../../" target="_top">Hidden Reef home</a>';
 document.querySelector('.bottom-note')!.textContent='Explore • Learn • Build a tank like this';
 const send=(data:object)=>{if(parent!==window)parent.postMessage({channel:'hidden-reef-aquarium',...data},location.origin);};
 document.addEventListener('aquascape-context',event=>send({type:'context',...(event as CustomEvent).detail}));
 addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==parent||event.data?.channel!=='hidden-reef-showroom')return;
  const {type,value}=event.data;
  if(type==='visibility'&&typeof value==='boolean'){aquarium.suspended=!value;return;}
  if(type==='cutaway'){aquarium.onFilterRequest();return;}
  if(type==='lesson'&&Object.hasOwn(lessonNames,value)){aquarium.onLessonRequest(value as Lesson);return;}
  if(type==='explore'){
   const learn=document.querySelector<HTMLButtonElement>('#learn')!;
   if(learn.getAttribute('aria-expanded')==='true')learn.click();
   const explore=document.querySelector<HTMLButtonElement>('#explore')!;
   if(explore.getAttribute('aria-expanded')!=='true')explore.click();
   if(value==='angel')aquarium.identifyAngel(0);
   if(value==='tetra')aquarium.identifyFish(0);
   if(value==='cory')aquarium.identifyCory(0);
   if(value==='shrimp')aquarium.identifyAnimal(0);
   if(value==='snail')aquarium.identifyAnimal(6);
   if(value==='plants')aquarium.identifyPlant('sword');
  }
 });
 send({type:'ready'});
 if(new URLSearchParams(location.search).has('poster')){
  const style=document.createElement('style');style.textContent='main > :not(#scene){display:none!important}';document.head.append(style);aquarium.view('front');
 }else{
  aquarium.identifyMode=true;
  const identify=aquarium.onIdentify;
  aquarium.onIdentify=info=>{if(info){const explore=document.querySelector<HTMLButtonElement>('#explore')!;if(explore.getAttribute('aria-expanded')!=='true')explore.click();}identify(info);};
 }
}
