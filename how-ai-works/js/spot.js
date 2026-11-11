/* Chapter 13, extra — Spot the Hallucination. A short source, then six fluent
   claims about it; the visitor ticks the ones the source does not back up, and
   each claim is then checked against the line it relies on. Three rounds.
   Everything here is hand-written: no model produced the notes or the claims. */
(function () {
  'use strict';
  const L = Lab, root = L.$('#spotGame');
  if (!root) return;
  const ui = {};
  for (const id of ['Title', 'Lines', 'Claims', 'Go', 'Round', 'Result']) {
    if (!(ui[id] = L.$('#spot' + id, root))) return;       // the block was changed: do nothing
  }
  const run = L.seq();
  const fill = (el, kids) => { el.textContent = ''; kids.forEach(k => { if (k != null) el.append(k); }); };

  // claims: [sentence, does the source support it?, the source line it rests on (or null), why it fails]
  const ROUNDS = [
    {
      title: 'Source: garden log',
      source: ['Apr 12: planted a redbud by the back fence.', 'May 3: Sun Gold and Cherokee Purple tomatoes into bed 2.', 'Jun 20: aphids on the roses. Sprayed soapy water.', 'Jul 8: drip irrigation on beds 1–2, 20 min at 6am.'],
      claims: [
        ['The redbud went in by the back fence in April.', true, 0],
        ['Two tomato varieties were planted in bed 2 in early May.', true, 1],
        ['The roses were treated with neem oil for aphids.', false, 2, 'Contradicted: line 3 says soapy water.'],
        ['Drip irrigation was set to run for 20 minutes at 6am.', true, 3],
        ['The garden won a local award in August.', false, null, 'No source mentions any award.'],
        ['Bed 3 gets hand-watered twice a week.', false, null, 'Bed 3 never appears in the log.']
      ]
    },
    {
      title: 'Source: deploy log',
      source: ['09:02 pushed commit 9a94919 to main', '09:04 Cloudflare Pages build started', '09:06 build succeeded, 214 files', '09:07 GET /how-ai-works/ → 200', '09:09 cache purge skipped (not needed)'],
      claims: [
        ['The build succeeded about four minutes after the push.', true, 2],
        ['The deploy published 214 files.', true, 2],
        ['The cache was purged after the deploy.', false, 4, 'Contradicted: line 5 says the purge was skipped.'],
        ['The How AI Works page was checked and returned 200.', true, 3],
        ['The build was slow because of large images.', false, null, 'Nothing in the log says why, or that it was slow.'],
        ['All tests passed before the push.', false, null, 'The log never mentions tests.']
      ]
    },
    {
      title: 'Source: club meeting notes',
      source: ['Attendees: Ana, Ben, Priya (Sam absent)', 'Decision: meetups move to Thursdays from Oct 2', 'Budget: $120 approved for snacks', 'Action: Ben books the library room'],
      claims: [
        ['Sam missed the meeting.', true, 0],
        ['Meetups move to Thursdays starting October 2.', true, 1],
        ['The snack budget is $200.', false, 2, 'Contradicted: line 3 says $120.'],
        ['Priya will book the library room.', false, 3, 'Contradicted: line 4 says Ben.'],
        ['Ben is responsible for booking the room.', true, 3],
        ['The group voted unanimously on the new day.', false, null, 'The notes record a decision, not a vote.']
      ]
    }
  ];

  let round = 0, total = 0, right = 0, shown = 0, phase = 'pick';   // 'pick' -> 'checking' -> 'done'
  let boxes = [], rows = [], lines = [];
  const R = () => ROUNDS[round];
  const last = () => round === ROUNDS.length - 1;
  // light up the source line a claim rests on (green) or clashes with (rose); null clears it
  const point = (i, ok) => lines.forEach((li, j) => { li.classList.remove('cite', 'clash'); if (j === i) li.classList.add(ok ? 'cite' : 'clash'); });

  function render() {
    const r = R();
    phase = 'pick'; right = 0; shown = 0;
    ui.Title.textContent = r.title;
    lines = r.source.map(text => L.h('li', { text }));
    fill(ui.Lines, lines);
    boxes = []; rows = [];
    fill(ui.Claims, r.claims.map(c => {
      const box = L.h('input', { type: 'checkbox' });
      const row = L.h('label', { class: 'spot-claim' }, [box, L.h('span', null, [L.h('span', { class: 't', text: c[0] }), L.h('span', { class: 'v' })])]);
      box.addEventListener('change', () => row.classList.toggle('flagged', box.checked));
      boxes.push(box); rows.push(row);
      return row;
    }));
    ui.Round.textContent = 'Round ' + (round + 1) + ' of ' + ROUNDS.length + (round ? ' · ' + total + ' right so far' : '');
    ui.Go.textContent = 'Check against the source';
    ui.Result.textContent = 'Fluent is not the same as supported. Tick every claim you think the source does not back up, then check.';
  }

  // show the verdict for the next claim
  function reveal(animated) {
    const i = shown, c = R().claims[i], ok = c[1], flagged = boxes[i].checked, good = flagged === !ok;
    if (animated) point(c[2], ok);
    if (good) right++;
    rows[i].classList.add('revealed', ok ? 'ok' : 'bad', good ? 'right' : 'wrong');
    fill(rows[i].querySelector('.v'), [
      L.h('b', { text: ok ? '✓ Supported by line ' + (c[2] + 1) + '.' : '✗ ' + c[3] }),
      ' ' + (ok ? (flagged ? 'You ticked it, but the source backs it up.' : 'You were right to leave it.') : (flagged ? 'You caught it.' : 'You let this one through.'))
    ]);
    shown++;
  }
  function finish() {
    while (shown < R().claims.length) reveal(false);
    point(null);
    const n = R().claims.length;
    total += right;
    phase = 'done';
    fill(ui.Result, [
      L.h('strong', { text: right + ' of ' + n + ' right this round.' }),
      ' ' + (right === n ? 'Perfect. You checked every sentence against the source instead of trusting how it sounded.'
        : 'The unsupported claims were just as fluent as the true ones. That is the whole problem.'),
      last() ? ' ' : null,
      last() ? L.h('strong', { text: 'Final score: ' + total + ' of ' + ROUNDS.length * n + '.' }) : null
    ]);
    ui.Round.textContent = 'Round ' + (round + 1) + ' of ' + ROUNDS.length + ' · ' + total + (last() ? ' right in total' : ' right so far');
    ui.Go.textContent = last() ? 'Play again' : 'Next round';
  }

  ui.Go.addEventListener('click', async () => {
    if (phase === 'pick') {
      const k = run.begin();
      phase = 'checking';
      boxes.forEach(b => { b.disabled = true; });
      ui.Go.textContent = 'Show all results now';
      ui.Result.textContent = 'Checking each claim against the source…';
      while (shown < R().claims.length) {
        reveal(true);
        if (!(await run.wait(520, k))) return;      // cancelled: the second press has already finished the job
      }
      finish();
    } else if (phase === 'checking') {
      run.stop();
      finish();
    } else {
      if (last()) { round = 0; total = 0; } else round++;
      render();
      // the new source is at the top of the block; bring it back if it has scrolled away
      if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior: L.reduce ? 'auto' : 'smooth', block: 'start' });
    }
  });
  render();
})();
