// The fleet's shared scores worker: one board per namespace, rows of {initials, score}. The
// worker keeps initials, score and a timestamp only, so the session's date lives in the namespace.
export const SCORES_BASE='https://game-scores.jez237.workers.dev/scores/';
export function parseBoard(d){const arr=Array.isArray(d)?d:(d&&d.scores)||[];return arr.map(s=>({name:String(s.initials||s.name||'???').slice(0,3).toUpperCase(),score:s.score|0})).sort((a,b)=>b.score-a.score).slice(0,10);}
export async function fetchBoard(ns,fetchFn=globalThis.fetch){try{const r=await fetchFn(SCORES_BASE+ns,{cache:'no-store'});return parseBoard(await r.json());}catch{return 'offline';}}
export async function submitScore(ns,initials,score,fetchFn=globalThis.fetch){try{const r=await fetchFn(SCORES_BASE+ns,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initials,score})});return r.ok;}catch{return false;}}
export function boardRows(board,me){if(board==='offline')return '<li class="note">the board is unreachable · score kept here</li>';if(!board)return '<li class="note">reading the board…</li>';if(!board.length)return '<li class="note">no one has fished this one yet</li>';return board.map((s,i)=>`<li${me&&s.name===me.name&&s.score===me.score?' class="me"':''}><span>${String(i+1).padStart(2,' ')}  ${s.name}</span><span>${s.score}</span></li>`).join('');}
