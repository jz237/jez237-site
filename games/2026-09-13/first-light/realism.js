// The realism dial: one setting that scales how willing the fish are, how long you have to react
// to an overload before the line goes, and how much slack a shaking fish forgives. Sim is the
// honest lake, Standard is the default, Relaxed is for a first evening or a phone on the porch.
// Shared boards (sessions, Big Bass) always run Standard so scores compare.
export const REALISM={
 sim:{id:'sim',label:'Sim',activity:.75,reaction:.7,slack:.75,blurb:'The honest lake: fewer bites, a short window on an overload, little forgiveness for slack.'},
 standard:{id:'standard',label:'Standard',activity:1,reaction:1,slack:1,blurb:'The default. Sessions and Big Bass always run here.'},
 relaxed:{id:'relaxed',label:'Relaxed',activity:1.4,reaction:1.6,slack:1.5,blurb:'More bites, more time to react, a forgiving hook.'}
};
export function realismOf(id){return REALISM[id]||REALISM.standard;}
export function realismForMode({setting='standard',shared=false}={}){return shared?REALISM.standard:realismOf(setting);}
