import './club-cup.css';
import {DEFINITIONS, type CarKind} from './rules';
import {CLUB_KINDS, CLUB_SERIES, clubSeries, CLUB_POINTS, type ClubSeriesId, clubStandings, currentClubRound, type ClubCupState, type ClubResultRow} from './club-cup';

import {AI_DIFFICULTIES,readAIDifficulty,type AIDifficulty} from './ai-difficulty';
import {type ClubRecords} from './club-records';

export type ClubCupCallbacks = {
  create: (series:ClubSeriesId,difficulty:AIDifficulty) => void;
  start: () => void;
  close: () => void;
  abandon: () => void;
};

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]!));
const statusNames: Record<ClubResultRow['status'], string> = {
  finished: 'FINISHED', survived: 'SURVIVED', wrecked: 'WRECKED', dnf: 'DNF', retired: 'RETIRED',
};
const finishTime = (row: ClubResultRow) => {
  if (row.status !== 'finished' || row.finishTime === null || !Number.isFinite(row.finishTime)) return '—';
  const milliseconds = Math.max(0, Math.round(row.finishTime * 1000));
  return `${Math.floor(milliseconds / 60000)}:${Math.floor(milliseconds % 60000 / 1000).toString().padStart(2, '0')}.${(milliseconds % 1000).toString().padStart(3, '0')}`;
};
const trophy = '<svg class="club-trophy" viewBox="0 0 64 64" aria-hidden="true"><path d="M21 10h22v14c0 9-5 15-11 15s-11-6-11-15V10Z M21 14H12v8c0 9 7 13 13 13 M43 14h9v8c0 9-7 13-13 13 M32 39v12 M23 54h18 M26 51h12"/></svg>';

/** A saved-series board only; event creation and persistence belong to the caller. */
export function showClubCup(ui: HTMLElement, cup: ClubCupState | null, selectedKind: CarKind, callbacks: ClubCupCallbacks, warning = '', records:ClubRecords={version:1,best:[]}, selection:ClubSeriesId='club', selectedDifficulty:AIDifficulty='amateur') {
  const complete = cup?.phase === 'complete';
  const series=clubSeries(cup??{series:selection}),rounds=series.rounds,difficulty=readAIDifficulty(cup?.difficulty??selectedDifficulty);
  const choosing=!cup;
  const recordsMarkup=CLUB_SERIES.map(s=>`<article><h3>${escape(s.name)}</h3>${(Object.keys(AI_DIFFICULTIES) as AIDifficulty[]).map(d=>{const best=records.best.find(r=>r.series===s.id&&r.difficulty===d);return `<p>${AI_DIFFICULTIES[d].label}: <strong>${best?`${best.points===0?'COMPLETED · NO POINTS':best.place===1?'GOLD':best.place===2?'SILVER':best.place===3?'BRONZE':'FINISHED · #'+best.place} · ${best.points} PTS`:'Not completed'}</strong></p>`;}).join('')}</article>`).join('');
  const round = cup ? currentClubRound(cup) : null;
  const selectedOffset = CLUB_KINDS.indexOf(selectedKind);
  const roster = cup?.roster ?? CLUB_KINDS.map((_, slot) => ({kind: CLUB_KINDS[(selectedOffset + slot) % CLUB_KINDS.length], slot}));
  const player = roster.find(entry => entry.slot === 0)!;
  const standings = cup ? clubStandings(cup) : roster.map(entry => ({...entry, points: 0, wins: 0, place: entry.slot + 1}));
  const playerStanding = standings.find(entry => entry.slot === 0)!;
  let resultIndex = (cup?.results.length ?? 0) - 1;

  const resultsMarkup = () => {
    const result = cup?.results[resultIndex];
    if (!result) return `<div class="club-empty"><span class="club-empty-number">01</span><h3>${cup?.phase === 'running' ? 'ROUND INTERRUPTED' : 'THE START IS AHEAD.'}</h3><p>${cup?.phase === 'running' ? 'This round has no saved result. Restart it from the grid; your earlier round results are retained.' : 'Results appear here after a round ends. Race times are shown only for cars that cross the finish line.'}</p></div>`;
    return `<div class="club-table-scroll" tabindex="0" aria-label="Round ${result.index + 1} results"><table class="club-results-table"><caption class="club-sr-only">${escape(rounds[result.index].name)} results</caption><thead><tr><th scope="col">Place / car</th><th scope="col">Outcome</th><th scope="col">Finish time</th><th scope="col">Pts</th></tr></thead><tbody>${[...result.rows].sort((a, b) => a.place - b.place || a.slot - b.slot).map(row => {
      const car = roster.find(entry => entry.slot === row.slot)!;
      return `<tr class="${row.slot === 0 ? 'club-player' : ''}"><th scope="row"><span class="club-place">${row.place}</span><span>${escape(DEFINITIONS[car.kind].name)}${row.slot === 0 ? '<small>YOU</small>' : '<small>AI</small>'}</span></th><td><span class="club-outcome club-outcome-${row.status}">${statusNames[row.status]}</span></td><td class="club-time">${finishTime(row)}</td><td>${row.points}</td></tr>`;
    }).join('')}</tbody></table></div><p class="club-table-note">${rounds[result.index].mode === 'race' ? 'DNF, wrecked and retired racers score zero. Only finishers receive a race time.' : 'Surviving and wrecked cars score by final position. Retiring scores zero. Survival has no race finish time.'}</p>`;
  };

  ui.innerHTML = `<section class="club-board" aria-labelledby="club-title">
    <div class="club-content">
      <header class="club-header"><div class="eyebrow">BLACKRIDGE MOTOR CLUB / OFFLINE SERIES</div><button id="club-close" class="club-secondary">BACK TO QUARRY ↗</button></header>
      <div class="club-intro"><div><div class="club-kicker">${cup ? `${cup.results.length} OF ${rounds.length} ROUNDS RECORDED` : `${rounds.length} ROUNDS · ${AI_DIFFICULTIES[difficulty].label.toUpperCase()}`}</div><h1 id="club-title">${escape(series.name.toUpperCase())}<span>.</span></h1><p>${escape(series.description)}</p></div><aside class="club-entry" aria-label="Your cup entry"><div class="eyebrow">${cup ? 'YOUR SERIES CAR' : 'YOUR SELECTED CAR'}</div><strong>${escape(DEFINITIONS[player.kind].name)}</strong><span>FACTORY STOCK · ${roster.length}-CAR FIELD · ${AI_DIFFICULTIES[difficulty].label.toUpperCase()}</span><p>${cup ? 'Your car and opponents stay fixed for this cup. Every car is repaired before each round.' : 'This menu selection becomes your cup car. One of every model joins the field, with factory stock setups and repairs between rounds.'}</p></aside></div>
      ${choosing?`<div class="club-selection"><label>CHAMPIONSHIP<select id="club-series">${CLUB_SERIES.map(s=>`<option value="${s.id}"${s.id===series.id?' selected':''}>${escape(s.name)} · ${s.rounds.length} rounds</option>`).join('')}</select></label><label>AI DIFFICULTY<select id="club-difficulty">${(Object.keys(AI_DIFFICULTIES) as AIDifficulty[]).map(d=>`<option value="${d}"${d===difficulty?' selected':''}>${AI_DIFFICULTIES[d].label}</option>`).join('')}</select></label><p>${AI_DIFFICULTIES[difficulty].description} Your car, series and difficulty stay fixed once the cup starts.</p></div>`:''}
      ${warning ? `<p class="club-warning" role="alert">${escape(warning)}</p>` : ''}
      ${complete ? `<section class="club-finale" aria-label="Final cup podium"><div class="club-final-summary">${trophy}<div><div class="eyebrow">SERIES COMPLETE</div><h2>YOU PLACED ${playerStanding.place} OF ${roster.length}</h2><p>${playerStanding.points} points · ${playerStanding.wins} round ${playerStanding.wins === 1 ? 'win' : 'wins'}</p></div></div><div class="club-podium">${standings.slice(0, 3).map(entry => `<article class="club-podium-place club-podium-${entry.place}"><span>${entry.place === 1 ? '1ST / CUP WINNER' : entry.place === 2 ? '2ND PLACE' : '3RD PLACE'}</span><strong>${escape(DEFINITIONS[entry.kind].name)}</strong><small>${entry.slot === 0 ? 'YOU · ' : ''}${entry.points} PTS · ${entry.wins} ${entry.wins === 1 ? 'WIN' : 'WINS'}</small></article>`).join('')}</div></section>` : ''}
      <ol class="club-rounds" aria-label="Cup schedule">${rounds.map(spec => {
        const result = cup?.results.find(item => item.index === spec.index);
        const outcome = result?.rows.find(row => row.slot === 0);
        const current = !!cup && round?.index === spec.index;
        return `<li class="${result ? 'club-round-recorded' : current ? 'club-round-current' : ''}"${current ? ' aria-current="step"' : ''}><div class="club-round-top"><span>ROUND 0${spec.index + 1}</span><b>${result ? 'RECORDED' : current ? cup?.phase === 'running' ? 'INTERRUPTED' : 'UP NEXT' : 'UPCOMING'}</b></div><h2>${escape(spec.name)}</h2><p>${spec.mode === 'race' ? `${spec.laps} ${spec.laps===1?'lap':'laps'} · ${spec.direction==='reverse'?'Reverse':spec.direction==='opposing'?'Opposing directions':'Forward'} circuit race` : `${spec.duration} seconds · Survival derby`}</p><div class="club-round-outcome">${outcome ? `${statusNames[outcome.status]} <span>+${outcome.points} PTS</span>` : spec.mode === 'race' ? 'CROSS THE LINE. BANK THE POINTS.' : 'NO RESPAWNS. MAKE IT COUNT.'}</div></li>`;
      }).join('')}</ol>
      <div class="club-action-row club-actions"><div><div class="eyebrow">${complete ? 'FINAL STANDINGS' : cup?.phase === 'running' ? 'RESTART THIS ROUND FROM THE GRID' : cup ? 'READY FOR THE NEXT ROUND' : 'YOUR FIRST CUP STARTS HERE'}</div><p>${complete ? `Choose your next championship with ${escape(DEFINITIONS[selectedKind].name)}. Your best result stays in the championship records below.` : cup?.phase === 'running' ? 'Only the interrupted round restarts. Earlier results and points are kept.' : cup ? 'Factory repairs are applied before the grid forms.' : 'Create the cup to lock in this field. You can start the first round when ready.'}</p></div><button id="${!cup || complete ? 'club-create' : 'club-start'}" class="club-primary">${!cup ? 'CREATE CUP' : complete ? 'CHOOSE NEXT SERIES' : cup.phase === 'running' ? 'RESTART INTERRUPTED ROUND' : `RACE ROUND ${(round?.index ?? 0) + 1}`} ↗</button></div>
      <div class="club-data-grid"><section class="club-data-panel" aria-labelledby="club-standings-title"><div class="club-panel-heading"><div><div class="eyebrow">ONE OF EVERY MODEL</div><h2 id="club-standings-title">${cup ? complete ? 'FINAL STANDINGS' : 'CUP STANDINGS' : 'THE STARTING FIELD'}</h2></div><span>${roster.length} CARS</span></div><div class="club-table-scroll" tabindex="0" aria-label="${cup ? 'Cup standings' : 'Cup starting field'}"><table class="club-standings-table"><caption class="club-sr-only">${cup ? 'Cumulative cup points' : 'One car of every model; points begin after the first round'}</caption><thead><tr><th scope="col">${cup ? 'Rank / car' : 'Entry / car'}</th>${rounds.map(spec => `<th scope="col"><abbr title="Round ${spec.index + 1}">R${spec.index + 1}</abbr></th>`).join('')}<th scope="col">Total</th></tr></thead><tbody>${standings.map(entry => `<tr class="${entry.slot === 0 ? 'club-player' : ''}"><th scope="row"><span class="club-place">${cup && cup.results.length ? entry.place : '—'}</span><span>${escape(DEFINITIONS[entry.kind].name)}<small>${entry.slot === 0 ? 'YOU' : 'AI'}${entry.wins ? ` · ${entry.wins} ${entry.wins === 1 ? 'WIN' : 'WINS'}` : ''}</small></span></th>${rounds.map(spec => {const result = cup?.results.find(item => item.index === spec.index)?.rows.find(row => row.slot === entry.slot);return `<td>${result ? result.points : '—'}</td>`;}).join('')}<td class="club-total">${cup ? entry.points : '—'}</td></tr>`).join('')}</tbody></table></div><p class="club-table-note">Points: ${CLUB_POINTS.join(' / ')}. Equal totals use round wins, then original entry order.</p></section>
      <section class="club-data-panel" aria-labelledby="club-results-title"><div class="club-panel-heading"><div><div class="eyebrow">THE RECORDED OUTCOME</div><h2 id="club-results-title">ROUND RESULTS</h2></div></div><nav class="club-result-tabs" aria-label="Choose a recorded round">${rounds.map(spec => `<button id="club-result-${spec.index}" data-club-result="${spec.index}" aria-pressed="${resultIndex === spec.index}"${cup?.results.some(result => result.index === spec.index) ? '' : ' disabled'}>ROUND ${spec.index + 1}</button>`).join('')}</nav><div id="club-round-result">${resultsMarkup()}</div></section></div>
      <section class="club-records" aria-label="Championship records"><h2>CHAMPIONSHIP RECORDS</h2><p>Best placing for each series and difficulty. Gold, silver and bronze are earned by finishing in the top three.</p><div>${recordsMarkup}</div></section>
      <footer class="club-footer"><div><strong>FACTORY STOCK · REPAIRS BETWEEN ROUNDS · AUTOMATIC SAVING</strong><p>Saved in this browser after each round. An interrupted round restarts from its grid; earlier results stay saved. Clearing browser data removes the saved cup.</p></div>${cup && !complete ? '<button id="club-restart" class="club-secondary" aria-expanded="false" aria-controls="club-restart-confirmation">RESTART CUP</button>' : ''}</footer>
      ${cup && !complete ? '<section id="club-restart-confirmation" class="club-confirm" hidden aria-labelledby="club-confirm-title"><h2 id="club-confirm-title">START OVER?</h2><p>This removes the current cup and its saved round results. You will return to cup creation before racing again.</p><div><button id="club-cancel-restart" class="club-secondary">KEEP THIS CUP</button><button id="club-confirm-restart" class="club-primary">CONFIRM RESTART</button></div></section>' : ''}
    </div>
  </section>`;

  ui.querySelector<HTMLButtonElement>('#club-close')!.onclick = callbacks.close;
  const create = ui.querySelector<HTMLButtonElement>('#club-create');
  if (create) create.onclick = () => {
    if(complete){showClubCup(ui,null,selectedKind,callbacks,warning,records,series.id,difficulty);return;}
    callbacks.create(series.id,difficulty);
  };
  const seriesSelect=ui.querySelector<HTMLSelectElement>('#club-series'),difficultySelect=ui.querySelector<HTMLSelectElement>('#club-difficulty');
  const change=()=>{const focus=ui.ownerDocument.activeElement?.id;showClubCup(ui,null,selectedKind,callbacks,warning,records,seriesSelect!.value as ClubSeriesId,difficultySelect!.value as AIDifficulty);if(focus)ui.querySelector<HTMLElement>('#'+focus)?.focus();};
  if(seriesSelect)seriesSelect.onchange=change;
  if(difficultySelect)difficultySelect.onchange=change;
  const start = ui.querySelector<HTMLButtonElement>('#club-start');
  if (start) start.onclick = callbacks.start;
  ui.querySelectorAll<HTMLButtonElement>('[data-club-result]').forEach(button => {
    button.onclick = () => {
      resultIndex = Number(button.dataset.clubResult);
      ui.querySelectorAll<HTMLButtonElement>('[data-club-result]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
      ui.querySelector('#club-round-result')!.innerHTML = resultsMarkup();
    };
  });
  const restart = ui.querySelector<HTMLButtonElement>('#club-restart');
  if (restart) {
    const confirmation = ui.querySelector<HTMLElement>('#club-restart-confirmation')!;
    const cancel = ui.querySelector<HTMLButtonElement>('#club-cancel-restart')!;
    restart.onclick = () => {
      confirmation.hidden = false;
      restart.setAttribute('aria-expanded', 'true');
      cancel.focus();
      confirmation.scrollIntoView({block: 'nearest'});
    };
    cancel.onclick = () => {
      confirmation.hidden = true;
      restart.setAttribute('aria-expanded', 'false');
      restart.focus();
    };
    ui.querySelector<HTMLButtonElement>('#club-confirm-restart')!.onclick = callbacks.abandon;
  }
}
