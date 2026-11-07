// Shock Horror: the catalogue of scares. Every entry is one distinct scare the player can witness (the Fear Ledger
// counts them). An entry names an archetype (scares.js implements each one once) and the parameters that make this
// one different: the figure, where it appears, what it writes, what it whispers, how it ends.
// id = archetype:key and must never change (the ledger in localStorage stores ids).
// d: depth (0-4) the scare belongs to, or -1 for anywhere. big: a jump scare (rare, never in MILD mode).
export const CATS = [
  ['app', 'APPARITIONS', 'Figures at the edge of your light'],
  ['jump', 'JUMP SCARES', 'The ones that make you scream'],
  ['wall', 'THE WALLS', 'What the rock is trying to tell you'],
  ['voice', 'WHISPERS', 'Voices in the dark'],
  ['sound', 'SOUNDS', 'Noises that should not be there'],
  ['body', 'THE DEAD', 'The night shift, what is left of it'],
  ['crea', 'CRAWLING THINGS', 'Everything that skitters'],
  ['night', 'NIGHTMARES', 'When the pit gets into your head'],
  ['omen', 'OMENS', 'Signs that something is coming'],
];

const C = [];
const add = (cat, a, key, name, p = {}, o = {}) => C.push({ id: a + ':' + key, cat, a, name, p, d: o.d ?? -1, big: !!o.big, w: o.w ?? 1 });

// ------------------------------------------------------------------ apparitions
const FIG = [['woman', 'paleWoman', 'THE PALE WOMAN'], ['tall', 'tallMan', 'THE TALL MAN'], ['child', 'ghostChild', 'THE CHILD'], ['shadow', 'shadowFigure', 'THE SHADOW'], ['miner', 'MINER', 'THE LOST MINER']];
const WHERE = [['ahead', 'STANDS AHEAD'], ['behind', 'STANDS BEHIND YOU'], ['above', 'WATCHES FROM ABOVE'], ['across', 'WAITS ACROSS THE GAP'], ['rock', 'STANDS INSIDE THE ROCK']];
for (const [fk, model, fname] of FIG) for (const [wk, wname] of WHERE) add('app', 'stand', fk + '-' + wk, `${fname} ${wname}`, { model, where: wk });
for (const [fk, model, fname] of FIG) add('app', 'peek', fk, `${fname} PEEKS OUT`, { model });
add('app', 'walker', 'miner', 'THE LOST MINER WALKS PAST', { model: 'MINER', speed: 1.3 });
add('app', 'walker', 'woman', 'THE PALE WOMAN DRIFTS BY', { model: 'paleWoman', speed: 0.9, float: 1 });
add('app', 'walker', 'crawler', 'SOMETHING CRAWLS ACROSS THE BACK', { model: 'ghoulCrawler', speed: 2.2 });
add('app', 'walker', 'tall', 'THE TALL MAN STRIDES BY', { model: 'tallMan', speed: 1.6 });
add('app', 'walker', 'child', 'THE CHILD RUNS PAST', { model: 'ghostChild', speed: 3.4 });
add('app', 'walker', 'shadows', 'THE PROCESSION OF SHADOWS', { model: 'shadowFigure', speed: 1.1, n: 5 });
add('app', 'walker', 'miner-run', 'THE LOST MINER RUNS FROM SOMETHING', { model: 'MINER', speed: 4.2 });
for (const [fk, model, fname] of FIG) add('app', 'closer', fk, `${fname} GETS CLOSER`, { model });
for (const [fk, model, fname] of FIG) add('app', 'behind', fk, `${fname} AT YOUR BACK`, { model });
add('app', 'stand', 'hanged-ahead', 'THE HANGED MAN OPENS HIS EYES', { model: 'hangedMan', where: 'hang' });
add('app', 'ledge', 'woman', 'THE WOMAN ON THE LEDGE STEPS BACK', { model: 'paleWoman' });
add('app', 'ledge', 'tall', 'THE TALL MAN DUCKS OUT OF SIGHT', { model: 'tallMan' });
add('app', 'ledge', 'child', 'THE CHILD WAVES FROM ABOVE', { model: 'ghostChild', wave: 1 });
add('app', 'ledge', 'miner', 'THE MINER ON THE LEDGE', { model: 'MINER' });
add('app', 'water', 'face', 'A FACE UNDER THE WATER', { model: 'screamFace', v: 0 });
add('app', 'water', 'bride', 'THE BRIDE RISES FROM THE WATER', { model: 'paleWoman' });
add('app', 'water', 'drowned', 'THE DROWNED SURFACE', { model: 'corpse' });
add('app', 'doppel', 'ahead', 'YOUR DOUBLE STANDS AHEAD', { mode: 'stand' });
add('app', 'doppel', 'mirror', 'YOUR DOUBLE COPIES YOU', { mode: 'mirror' });
add('app', 'doppel', 'turn', 'YOUR DOUBLE TURNS ITS HEAD', { mode: 'turn' }, { big: true });

// ------------------------------------------------------------------ jump scares
const FACES = [['woman', 'THE SCREAMING WOMAN'], ['miner', 'THE DEAD MINER'], ['ghoul', 'THE GHOUL'], ['doll', 'THE DOLL'], ['drowned', 'THE DROWNED FACE'], ['skull', 'THE SKULL THAT SEES'],
  ['many', 'THE THING WITH MANY EYES'], ['stitch', 'THE STITCHED FOREMAN'], ['hollow', 'THE HOLLOW FACE'], ['burnt', 'THE BURNT MAN']];
const STINGS = ['st_violin', 'st_brass', 'st_piano', 'st_choir', 'st_metal'];
FACES.forEach(([k, n], i) => {
  add('jump', 'face', k, `${n} IN THE DARK`, { img: 'f_' + k, sting: STINGS[i % 5], scream: ['sc_woman', 'sc_man', 'sc_ghoul', 'laugh_child', 'gasp', 'sc_inhuman', 'sc_inhuman', 'sc_man', 'sc_ghoul', 'sc_man'][i] }, { big: true });
  add('jump', 'face', k + '-gold', `${n} GUARDS THE TREASURE`, { img: 'f_' + k, sting: STINGS[(i + 2) % 5], scream: 'sc_inhuman', trig: 'treasure' }, { big: true });
});
const SF = ['THE WOMAN', 'THE MINER', 'THE SKULL', 'THE GHOUL', 'THE DOLL', 'THE THING FROM BELOW'];
SF.forEach((n, v) => add('jump', 'lampout', 'v' + v, `LIGHTS OUT: ${n}`, { v, sting: STINGS[v % 5] }, { big: true }));
add('jump', 'drop', 'hanged', 'A HANGED MAN DROPS IN FRONT OF YOU', { model: 'hangedMan' }, { big: true });
add('jump', 'drop', 'cage', 'THE CAGE COMES DOWN', { model: 'cageHanging' }, { big: true });
add('jump', 'drop', 'spider', 'SOMETHING DROPS ON A THREAD', { model: 'spider', scale: 2.6 }, { big: true });
add('jump', 'drop', 'crawler', 'THE CRAWLER FALLS FROM THE ROOF', { model: 'ghoulCrawler', flip: 1 }, { big: true });
add('jump', 'drop', 'woman', 'THE WOMAN HANGS UPSIDE DOWN', { model: 'paleWoman', flip: 1 }, { big: true });
add('jump', 'rush', 'crawler', 'THE CRAWLER CHARGES', { model: 'ghoulCrawler' }, { big: true });
add('jump', 'rush', 'woman', 'THE PALE WOMAN LUNGES', { model: 'paleWoman' }, { big: true });
add('jump', 'rush', 'tall', 'THE TALL MAN RUNS AT YOU', { model: 'tallMan' }, { big: true });
add('jump', 'rush', 'wings', 'THE SHRIEKERS SWARM YOU', { model: 'bat', n: 9 }, { big: true });
add('jump', 'burst', 'arms3', 'ARMS FROM THE WALL', { n: 3 }, { big: true });
add('jump', 'burst', 'arms8', 'THE WALL OF ARMS', { n: 8 }, { big: true });
add('jump', 'burst', 'face', 'THE FACE BREAKS THROUGH', { n: 4, face: 1 }, { big: true });
add('jump', 'burst', 'roof', 'HANDS FROM THE ROOF', { n: 6, roof: 1 }, { big: true });
add('jump', 'hands', 'two', 'HANDS FROM THE FLOOR', { n: 2 }, { big: true });
add('jump', 'hands', 'six', 'THE GRASPING FLOOR', { n: 6 }, { big: true });
add('jump', 'hands', 'ring', 'THE RING OF HANDS', { n: 10, ring: 1 }, { big: true });
add('jump', 'lookup', 'crawler', 'LOOK UP: THE CRAWLER', { model: 'ghoulCrawler' }, { big: true });
add('jump', 'lookup', 'woman', 'LOOK UP: THE WOMAN ON THE ROOF', { model: 'paleWoman' }, { big: true });
add('jump', 'lookup', 'eyes', 'LOOK UP: THE ROOF IS WATCHING', { model: 'eyes' }, { big: true });

// ------------------------------------------------------------------ the walls
const WRITE = ['TURN BACK', 'HE IS BELOW', 'WE ARE STILL HERE', 'DON\'T LET THE LAMP GO OUT', 'IT KNOWS YOUR NAME', 'DIG DEEPER', 'NO GOLD. ONLY TEETH', '12 WENT DOWN', 'NONE CAME UP',
  'BEHIND YOU', 'LOOK UP', 'IT WEARS THEIR FACES', 'WE HEAR YOU BREATHING', 'DO NOT ANSWER', 'STOP DIGGING', '3:12', 'THE BELL RINGS FOR YOU', 'MOTHER IS HUNGRY', 'THE WALLS ARE WARM',
  'IT\'S IN THE WATER', 'FEED IT LIGHT', 'NOBODY LEAVES', 'WE TRIED', 'HELP US', 'WHY', 'HE LIED ABOUT THE GOLD', 'COUNT THE BONES', 'ONE OF US', 'KEEP MOVING', 'IT\'S CLOSER',
  'SAY YOUR PRAYERS', 'THE FOREMAN NEVER LEFT', 'DON\'T SLEEP', 'SHE SINGS AT NIGHT', 'THE DEAD DIG TOO', 'LET US OUT', 'YOU ARE THE 13TH', 'IT ATE TOM', 'RUN', 'SHHH',
  'IT CAN HEAR THE PICK', 'THEY ARE PATIENT', 'THE CHAPEL IS FULL', 'DON\'T TOUCH THE COCOONS', 'WE SEE YOUR LIGHT', 'HOLD YOUR BREATH', 'IT MOVES WHEN YOU DON\'T LOOK', 'THERE IS NO BOTTOM',
  'GOD ISN\'T DOWN HERE', 'YOUR LAMP IS DYING', 'STAY', 'JOIN THE SHIFT', 'FORGIVE US', 'IT WANTS OUT', 'IT WANTS IN', 'YOU WERE HERE BEFORE', 'WELCOME HOME', 'I\'M SORRY MARY', 'THE HEART IS AWAKE', 'NOT YET'];
const WDEPTH = { 'DON\'T TOUCH THE COCOONS': 1, 'MOTHER IS HUNGRY': 1, 'COUNT THE BONES': 2, 'SAY YOUR PRAYERS': 2, 'THE CHAPEL IS FULL': 3, 'IT\'S IN THE WATER': 3, 'SHE SINGS AT NIGHT': 3, 'THE WALLS ARE WARM': 4, 'THE HEART IS AWAKE': 4, 'IT WANTS OUT': 4 };
const STYLES = ['blood', 'scratch', 'blood', 'soot'];
WRITE.forEach((t, i) => add('wall', 'write', t.replace(/[^A-Z0-9]+/g, '-').toLowerCase(), `${['WRITTEN IN BLOOD', 'SCRATCHED IN THE ROCK', 'WRITTEN IN BLOOD', 'WRITTEN IN SOOT'][i % 4]}: "${t}"`, { text: t, style: STYLES[i % 4] }, { d: WDEPTH[t] ?? -1 }));
add('wall', 'wallface', 'one', 'A FACE IN THE ROCK', { n: 1 });
add('wall', 'wallface', 'three', 'THREE FACES IN THE ROCK', { n: 3 });
add('wall', 'wallface', 'follow', 'THE FACE THAT FOLLOWS YOU', { n: 1, follow: 1 });
add('wall', 'eyes', 'few', 'EYES IN THE DARK', { n: 6 });
add('wall', 'eyes', 'many', 'DOZENS OF EYES', { n: 26 });
add('wall', 'eyes', 'swarm', 'THE DARK IS FULL OF EYES', { n: 60 });
add('wall', 'eyes', 'huge', 'THE GREAT EYE', { n: 1, huge: 1 });
add('wall', 'bleed', 'walls', 'THE WALLS BLEED', { how: 'walls' });
add('wall', 'bleed', 'rain', 'IT RAINS BLOOD', { how: 'rain' });
add('wall', 'bleed', 'cracks', 'BLOOD FROM THE CRACKS', { how: 'cracks' });
add('wall', 'breathe', 'slow', 'THE ROCK BREATHES', { k: 0.6 });
add('wall', 'breathe', 'pant', 'THE ROCK PANTS LIKE A DOG', { k: 1.4, fast: 1 }, { d: 4 });
add('wall', 'prints', 'trail', 'A TRAIL OF BLOODY HANDS', { n: 7, trail: 1 });
add('wall', 'prints', 'around', 'HANDPRINTS ALL AROUND YOU', { n: 12 });
add('wall', 'prints', 'small', 'SMALL HANDS', { n: 9, small: 1 });
add('wall', 'photo', 'shift', 'THE NIGHT SHIFT PHOTOGRAPH', { img: 'p_shift', change: 0 });
add('wall', 'photo', 'shift2', 'THE PHOTOGRAPH HAS ONE MORE MAN IN IT', { img: 'p_shift', change: 1 });
add('wall', 'photo', 'family', 'THE FAMILY PORTRAIT', { img: 'p_family', change: 0 });
add('wall', 'photo', 'family2', 'THE MOTHER IN THE PORTRAIT TURNS', { img: 'p_family', change: 1 });
add('wall', 'photo', 'shaft', 'THE PHOTOGRAPH OF THE SHAFT', { img: 'p_shaft', change: 0 });
add('wall', 'photo', 'shaft2', 'THE FIGURE IN THE PHOTOGRAPH CLIMBS', { img: 'p_shaft', change: 1 });
add('wall', 'candles', 'row', 'THE CANDLES GO OUT', { n: 6 });
add('wall', 'candles', 'ring', 'THE CANDLE RING', { n: 9, ring: 1 }, { d: 2 });
add('wall', 'shadow', 'hand', 'A HAND OF SHADOW', { model: 'hand', s: 6 });
add('wall', 'shadow', 'man', 'A SHADOW WITHOUT A MAN', { model: 'shadowFigure', s: 2.2 });
add('wall', 'shadow', 'crawler', 'A SHADOW CRAWLS OVER THE WALL', { model: 'ghoulCrawler', s: 2.5 });
add('wall', 'shadow', 'wings', 'GREAT WINGS PASS OVERHEAD', { model: 'bat', s: 7 });

// ------------------------------------------------------------------ whispers (ElevenLabs lines, voice/w_*.mp3)
const WH = [['behind', 'behind you'], ['deeper', 'dig deeper'], ['light', 'we can see your light'], ['turn', 'do not turn around'], ['join', 'join us'], ['cold', 'it is so cold down here'],
  ['coming', 'he is coming'], ['help', 'help me'], ['back', 'turn back'], ['dying', 'your lamp is dying'], ['shift', 'we were the night shift'], ['took', 'it took all of us'], ['up', 'look up'],
  ['close', 'so close now'], ['stay', 'stay with us'], ['why', 'why did you leave us'], ['breath', 'i can hear you breathing'], ['oneof', 'one of us'], ['floor', 'it is under the floor'],
  ['name', 'digger...'], ['hungry', 'it is hungry'], ['see', 'i see you'], ['wake', 'do not wake it'], ['dark', 'let the dark in'], ['out', 'there is no way out'], ['mine', 'mine'],
  ['play', 'play with me'], ['hush', 'shhh'], ['found', 'found you'], ['soon', 'soon']];
for (const [k, t] of WH) add('voice', 'whisper', k, `A WHISPER: "${t.toUpperCase().replace(/\.+$/, '')}"`, { snd: 'w_' + k, text: t });

// ------------------------------------------------------------------ sounds in the dark (sfx + a small sign)
const SND = [['knock', 'knock', 'THREE KNOCKS IN THE ROCK', 'dust'], ['scratch', 'scratch', 'NAILS ON STONE', 'dust'], ['feet', 'feet_behind', 'FOOTSTEPS BEHIND YOU', 'stopwalk'], ['drag', 'drag', 'SOMETHING IS DRAGGED', ''],
  ['pick', 'pick_far', 'ANOTHER PICK IN THE DARK', ''], ['whistle', 'whistle', 'THE WHISTLER', ''], ['musicbox', 'musicbox', 'THE MUSIC BOX', ''], ['bell', 'bell_toll', 'THE BELL BELOW', 'rumble'],
  ['shiftbell', 'shift_bell', 'THE SHIFT BELL RINGS', ''], ['cry', 'cry_woman', 'THE WEEPING WIFE', ''], ['giggle', 'laugh_child', 'A CHILD LAUGHS', ''], ['chuckle', 'laugh_low', 'THE LOW LAUGH', 'close'],
  ['hello', 'name_call', 'SOMEONE CALLS HELLO', ''], ['moan', 'moan_walls', 'THE MOANING WALLS', 'dust'], ['screams', 'sc_many', 'THE SCREAMS BELOW', 'rumble'], ['cart', 'cart_roll', 'THE EMPTY CART', ''],
  ['chains', 'chains', 'CHAINS IN THE DARK', ''], ['rope', 'rope_creak', 'THE CREAKING ROPE', ''], ['roof', 'thump_above', 'SOMETHING ON THE ROOF', 'dustroof'], ['wind', 'wind_moan', 'THE WIND THAT TALKS', ''],
  ['hum', 'hum_girl', 'THE HUMMING GIRL', ''], ['teeth', 'teeth', 'TEETH IN THE DARK', 'close'], ['run', 'feet_run', 'RUNNING FEET', ''], ['gasp', 'gasp', 'THE DROWNED GASP', 'water'],
  ['breath', 'breath', 'BREATHING AT YOUR NECK', 'close'], ['scream', 'sc_man', 'A MAN SCREAMS FAR BELOW', ''], ['ghoul', 'sc_ghoul', 'A SHRIEK IN YOUR EAR', 'close'], ['skitter', 'skitter', 'SKITTERING OVERHEAD', 'dustroof']];
for (const [k, snd, n, sign] of SND) add('sound', 'sound', k, n, { snd, sign }, { d: k === 'gasp' ? 3 : -1 });
add('sound', 'silence', 'dead', 'DEAD SILENCE', { end: '' });
add('sound', 'silence', 'sting', 'SILENCE, THEN A SCREAM', { end: 'sc_woman' });
add('sound', 'silence', 'breath', 'SILENCE, THEN BREATHING', { end: 'breath' });
add('sound', 'heart', 'race', 'YOUR HEART RACES', {});
add('sound', 'heart', 'stop', 'YOUR HEART STOPS', { stop: 1 });

// ------------------------------------------------------------------ the dead
add('body', 'fall', 'corpse', 'A BODY FALLS FROM ABOVE', { model: 'corpse' }, { big: true });
add('body', 'fall', 'bag', 'A BODY BAG DROPS', { model: 'bodyBag' });
add('body', 'fall', 'skulls', 'A RAIN OF SKULLS', { model: 'skull', n: 7 }, { d: 2 });
add('body', 'hanging', 'one', 'THE HANGED MAN SWINGS', { n: 1 });
add('body', 'hanging', 'three', 'THREE ROPES, THREE MEN', { n: 3 });
add('body', 'hanging', 'turn', 'THE HANGED MAN TURNS TO FACE YOU', { n: 1, turn: 1 });
add('body', 'twitch', 'arm', 'THE CORPSE REACHES OUT', { mode: 'arm' });
add('body', 'twitch', 'sit', 'THE CORPSE SITS UP', { mode: 'sit' });
add('body', 'twitch', 'head', 'THE CORPSE TURNS ITS HEAD', { mode: 'head' });
add('body', 'cocoon', 'stir', 'THE COCOON STIRS', { mode: 'stir' }, { d: 1 });
add('body', 'cocoon', 'hand', 'A HAND FROM THE COCOON', { mode: 'hand' }, { d: 1 });
add('body', 'cocoon', 'row', 'THE COCOONS WAKE', { mode: 'row' }, { d: 1 });
add('body', 'skull', 'roll', 'A SKULL ROLLS TO YOUR FEET', { n: 1 });
add('body', 'skull', 'chatter', 'THE CHATTERING SKULLS', { n: 4 }, { d: 2 });
add('body', 'cage', 'rattle', 'THE PRISONER IN THE CAGE', {});
add('body', 'cage', 'empty', 'THE CAGE IS EMPTY NOW', { empty: 1 });

// ------------------------------------------------------------------ crawling things
add('crea', 'swarm', 'rats', 'THE RATS RUN', { model: 'rat', n: 22 });
add('crea', 'swarm', 'spiders', 'THE SPIDERS RUN', { model: 'spider', n: 18 });
add('crea', 'swarm', 'both', 'EVERYTHING RUNS FROM SOMETHING', { model: 'rat', n: 16, also: 'spider' });
add('crea', 'swarm', 'roof', 'SPIDERS RAIN FROM THE ROOF', { model: 'spider', n: 14, roof: 1 });
add('crea', 'ceiling', 'crawler', 'SOMETHING CRAWLS ON THE ROOF', { model: 'ghoulCrawler' });
add('crea', 'ceiling', 'woman', 'THE WOMAN WALKS ON THE ROOF', { model: 'paleWoman' });
add('crea', 'ceiling', 'spider', 'THE GREAT SPIDER', { model: 'spider', scale: 4 });
add('crea', 'wings', 'flock', 'THE FLOCK', { n: 14 });
add('crea', 'wings', 'one', 'ONE PALE WING', { n: 1, big: 1 });
add('crea', 'tallwatch', 'gap', 'THE TALL MAN IN THE FAR DARK', {});

// ------------------------------------------------------------------ nightmares (the screen itself)
add('night', 'glitch', 'crowd', 'FOR A MOMENT, A CROWD', { n: 14 });
add('night', 'glitch', 'face', 'THE FACE BETWEEN FRAMES', { img: 'f_hollow' });
add('night', 'glitch', 'tear', 'THE PICTURE TEARS', {});
add('night', 'glitch', 'many', 'THEY WERE ALWAYS STANDING THERE', { n: 30 });
add('night', 'invert', 'flesh', 'THE NEGATIVE: THE WALLS ARE MEAT', {});
add('night', 'invert', 'figure', 'THE NEGATIVE: SOMEONE BESIDE YOU', { fig: 1 });
add('night', 'fakedeath', 'dark', 'TAKEN BY THE DARK? NOT YET', { cause: 'THE DARK' });
add('night', 'fakedeath', 'shift', 'YOU JOINED THE NIGHT SHIFT? NOT YET', { cause: 'THE NIGHT SHIFT' });
add('night', 'fakehud', 'hearts', 'YOUR HEART GIVES OUT', { what: 'hearts' });
add('night', 'fakehud', 'oil', 'YOUR LAMP RUNS DRY', { what: 'oil' });
add('night', 'vertigo', 'pull', 'THE TUNNEL STRETCHES', { k: 1 });
add('night', 'vertigo', 'push', 'THE WALLS CLOSE IN', { k: -1 });
add('night', 'redlamp', 'red', 'YOUR LAMP BURNS RED', { col: 0xff1a0a });
add('night', 'redlamp', 'green', 'YOUR LAMP BURNS GREEN', { col: 0x6aff3a });
add('night', 'slow', 'wail', 'TIME SLOWS FOR THE WAILING', { snd: 'shade' });
add('night', 'slow', 'heart', 'TIME STOPS BETWEEN HEARTBEATS', { snd: 'heart' });

// ------------------------------------------------------------------ omens
add('omen', 'lantern', 'float', 'A LANTERN FLOATS AWAY', {});
add('omen', 'lantern', 'follow', 'A LANTERN FOLLOWS YOU', { follow: 1 });
add('omen', 'cart', 'empty', 'THE CART ROLLS BY ITSELF', {});
add('omen', 'cart', 'body', 'THE CART CARRIES SOMEONE', { body: 1 });
add('omen', 'helmet', 'on', 'A HELMET LAMP SWITCHES ON', {});
add('omen', 'doll', 'turn', 'THE DOLL TURNS ITS HEAD', {});
add('omen', 'doll', 'gone', 'THE DOLL IS GONE', { gone: 1 });
add('omen', 'ritual', 'lit', 'THE CIRCLE LIGHTS ITSELF', {});
add('omen', 'ritual', 'chant', 'THE CIRCLE CHANTS', { chant: 1 });

export const SCARES = C;
export const SCARE_BY_ID = new Map(C.map((s) => [s.id, s]));
export const SCARE_TOTAL = C.length;
