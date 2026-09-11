import {closeups,type Panels,type Demonstration} from './Mechanics';
type Props={credits:number;open:boolean;setOpen:(v:boolean)=>void;panels:Panels;setPanels:(v:Panels)=>void;focus:string;setFocus:(v:string)=>void;demo:Demonstration;run:(kind:'coin'|'button'|'joystick')=>void;reduced:boolean;unavailable:boolean};
export function Workshop(p:Props){return <section className={'workshop '+(p.open?'expanded':'')} aria-label="Explore mechanisms">
 <button className="workshop-toggle" aria-expanded={p.open} onClick={()=>p.setOpen(!p.open)}>{p.open?'CLOSE MECHANISMS':'EXPLORE MECHANISMS'} <span>{p.open?'−':'+'}</span></button>
 {p.focus&&<button className="return-view" onClick={()=>p.setFocus('')}>← RETURN TO PREVIOUS VIEW</button>}
 {p.open&&<div className="workshop-body">
 <p>Open the cabinet, follow a moving contact, or look closer.</p>
 <fieldset disabled={p.unavailable}><legend>Service access</legend><div className="workshop-panels">{(['coin','controls','rear'] as const).map(id=><button key={id} aria-pressed={p.panels[id]} onClick={()=>p.setPanels({...p.panels,[id]:!p.panels[id]})}>{p.panels[id]?'Close':'Open'} {id==='coin'?'coin door':id==='controls'?'control panel':'rear panel'}</button>)}</div>
 <button className="text-button" onClick={()=>p.setPanels({coin:false,controls:false,rear:false})}>CLOSE ALL PANELS</button></fieldset>
 <fieldset disabled={p.unavailable||p.reduced}><legend>Mechanical demonstrations</legend><div className="workshop-panels"><button onClick={()=>p.run('coin')}>Follow a coin</button><button onClick={()=>p.run('button')}>Press fire button</button><button onClick={()=>p.run('joystick')}>Move joystick</button></div></fieldset>
 <p>Credits registered: {p.credits}</p>
 <p role="status">{p.demo?(p.demo.kind==='coin'?'Coin → acceptor → credit contact → chute':p.demo.kind==='button'?'Button travel → leaf contact closes → release':'Lever travel → upper/lower contact → neutral'):''}</p>
 {p.reduced&&<p>Motion is reduced. You can still open panels and inspect close-ups.</p>}
 <label>Look closer<select aria-label="Mechanism close-up" value={p.focus.startsWith('chip:')?'':p.focus} disabled={p.unavailable} onChange={e=>p.setFocus(e.target.value)}><option value="">Choose a detail</option>{closeups.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
 <p className="mechanism-note">Select a chip on an inspected board for its close-up. Sound follows the speaker as you orbit.</p>
 </div>}
 </section>}
