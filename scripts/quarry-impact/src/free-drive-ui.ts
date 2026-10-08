import {COURSE_NAMES,resolveCourseId} from './course-id';
import type {EventOptions} from './event-rules';
export function showFreeDriveSetup(ui:HTMLElement,options:EventOptions,save:()=>boolean,close:()=>void){
 ui.innerHTML=`<section class="event-setup" aria-label="Free drive setup"><div class="event-panel"><div class="eyebrow">BLACKRIDGE MOTOR CLUB / FREE DRIVE</div><h1>LEARN THE GROUND.</h1><p>Explore any circuit without a timer or finish line. Bring your saved garage setup, practice corners, cross the open runways at Merefield, or try the loop and gap jump at Alderwick.</p><label>Free drive venue<select id="practice-course">${Object.entries(COURSE_NAMES).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>Traffic<select id="practice-traffic"><option value="on">On · four other cars</option><option value="off">Off · drive alone</option></select></label><p>Alderwick: the Ravine buggy is recommended for the loop; follow the painted approach arrows and build speed. Traffic follows the perimeter circuit. R repairs your car and recovers it to clear ground when needed. I inspects your car. T changes traffic and restarts the session.</p><p>Race, demo and fixed challenge choices stay separate.</p><p id="practice-save" role="status"></p><div class="event-actions"><button id="practice-close" class="primary">BACK TO QUARRY ↗</button></div></div></section>`;
 const course=ui.querySelector<HTMLSelectElement>('#practice-course')!,traffic=ui.querySelector<HTMLSelectElement>('#practice-traffic')!;
 course.value=resolveCourseId(options.playgroundCourse);traffic.value=options.playgroundTraffic===false?'off':'on';
 const persist=()=>{ui.querySelector('#practice-save')!.textContent=save()?'Free drive choices saved.':'Choices apply this session; browser storage could not save them.';};
 course.onchange=()=>{options.playgroundCourse=resolveCourseId(course.value);persist();};
 traffic.onchange=()=>{options.playgroundTraffic=traffic.value==='on';persist();};
 ui.querySelector<HTMLButtonElement>('#practice-close')!.onclick=close;
}
