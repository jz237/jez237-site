import {copyOnlineEventRules,validOnlineEventRules,type OnlineEventRules} from './online-events';
export function onlineEventControls(r:OnlineEventRules){return `<fieldset id="online-event-rules"><legend>EVENT RULES</legend><p>Race and derby rules also apply to voted cup rounds.</p><label for="online-race-format">Race format</label><select id="online-race-format">${[['laps','Circuit laps'],['ordered','Waypoint tour'],['free','Free-order waypoints'],['random','Random waypoints']].map(([v,n])=>`<option value="${v}" ${r.race===v?'selected':''}>${n}</option>`).join('')}</select><label for="online-laps">Laps / waypoint rounds</label><input id="online-laps" type="number" min="1" max="20" step="1" value="${r.laps}"><label for="online-direction">Circuit direction</label><select id="online-direction" ${r.race==='laps'?'':'disabled'}>${[['forward','Forward'],['reverse','Reverse'],['opposing','Opposing directions']].map(([v,n])=>`<option value="${v}" ${r.direction===v?'selected':''}>${n}</option>`).join('')}</select><label for="online-derby-format">Derby format</label><select id="online-derby-format"><option value="survival" ${r.derby==='survival'?'selected':''}>Last car standing</option><option value="score" ${r.derby==='score'?'selected':''}>Score derby · automatic respawns</option></select><label for="online-duration">Derby time limit · seconds</label><input id="online-duration" type="number" min="60" max="1200" step="1" value="${r.duration}"></fieldset>`;}
export function readOnlineEventControls(root:ParentNode):OnlineEventRules|null{
 const value=(id:string)=>root.querySelector<HTMLInputElement|HTMLSelectElement>('#'+id)?.value;
 const rules={version:1,laps:Number(value('online-laps')),direction:value('online-direction'),race:value('online-race-format'),derby:value('online-derby-format'),duration:Number(value('online-duration'))};
 return validOnlineEventRules(rules)?copyOnlineEventRules(rules):null;
}
export function bindOnlineEventControls(root:ParentNode,changed:(r:OnlineEventRules)=>void){
 for(const field of Array.from(root.querySelectorAll<HTMLInputElement|HTMLSelectElement>('#online-event-rules input,#online-event-rules select')))field.onchange=()=>{
  const direction=root.querySelector<HTMLSelectElement>('#online-direction');if(direction)direction.disabled=root.querySelector<HTMLSelectElement>('#online-race-format')!.value!=='laps';
  const rules=readOnlineEventControls(root);if(rules)changed(rules);
 };
}
