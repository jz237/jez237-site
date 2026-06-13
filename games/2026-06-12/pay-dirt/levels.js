/* Pay Dirt — levels.js
   Campaign maps (28x16 ASCII), seeded generator + solvability checker.
   Phase 0/1: one test level. Campaign + generator land in Phase 6. */
'use strict';
const LEVELS = (() => {

  // 28 cols x 16 rows. See design.md for the legend.
  // Test claim: three platform tiers, ladders, a bar, 6 gold, 1 guard.
  const test = [
    'E...........................',
    'E...........................',
    'E..$................M....$..',
    '####H#####T#########H#######',
    '....H...............H.......',
    '....H...............H.......',
    '....H..12.$....----.H.......',
    '#>>>#####HC#B###############',
    '.........H..................',
    '.........H................S.',
    '.........H...$..............',
    '################H###########',
    '................H...........',
    '................H...........',
    '..$...P....]....H.......$...',
    'XXXX######XXXXXXXXXXXXXXXXXX',
  ];

  return { campaign: [test] };
})();
