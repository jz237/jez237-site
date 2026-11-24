/**
 * Lessons: one cycle of the living body taken a stage at a time. Each stop runs its stretch of the cycle over and
 * over, slowed down, and points the camera at what to watch; the studio puts everything back when the lesson ends.
 *
 *   beat     one heartbeat, in its five mechanical stages
 *   breath   one breath: in, out, the pause
 *   swallow  one swallow: the larynx rises and drops, and the wave runs down the oesophagus
 *   trip     the blood's round trip: body, right heart, lungs, left heart, body
 *   digest   a meal's route through the gut
 *
 * lessonPlan(kind, studio) returns { name, flow, monitor, stops } for the tour card. `studio` supplies what a stop
 * may do: life (the engine), look(pieceId, distance, direction), view(name), speed(k), zone(name) to light one part
 * of the circulation.
 */
import { BEAT_PHASES } from './life.js?v=b85a6d00ce';

export const LESSONS = { beat: 'One heartbeat', breath: 'One breath', swallow: 'One swallow', trip: 'Blood’s round trip', digest: 'A meal’s route' };

const BEAT_NOTES = [
  'On the monitor this follows the small P wave. Most filling has already happened; this adds the last fifth.',
  'This starts at the tall QRS spike. It lasts about a twentieth of a second and makes the first heart sound, "lub", as the inflow valves shut.',
  'About 70 millilitres leave each ventricle. The aorta and pulmonary trunk swell with it, which is the pulse you can feel at the wrist a moment later.',
  'The second heart sound, "dub", is the outflow valves closing. On the monitor the T wave has just finished.',
  'The longest stage at rest, and the one that shortens most when the heart speeds up. Blood falls in passively until the next atrial contraction.'
];

export function lessonPlan(kind, { life, look, view, speed, zone }) {
  const still = () => { life.loopBeat(null); life.loopBreath(null); life.loopSwallow(null); zone(null); };
  if (kind === 'beat') {
    let from = 0;
    const stops = BEAT_PHASES.map((ph, i) => { const range = [from + .004, ph.until - .004]; from = ph.until; return { title: `${i + 1}. ${ph.name}`, text: `${ph.note} ${BEAT_NOTES[i]}`, run: async () => { life.loopBreath(null); life.loopBeat(range); if (i === 0) await look('heart/left-ventricle', .62, [.35, .12, 1]); } }; });
    stops.push({ title: 'The whole beat', text: 'All five stages run together in under a second, about seventy times a minute at rest. Watch the monitor: each QRS spike is one ejection, and the dots in the heart stop and go with the valves.', run: () => { life.loopBeat(null); speed(.5); } });
    return { name: 'ONE HEARTBEAT', flow: true, monitor: true, stops };
  }
  if (kind === 'breath') return { name: 'ONE BREATH', flow: true, monitor: true, stops: [
    { title: '1. Breathing in', text: 'The diaphragm contracts and flattens, moving down about a centimetre and a half; the muscles between the ribs lift them up and out, and the sternum swings forward. The chest gets bigger, pressure inside it falls, and air is drawn in. The lungs lengthen to follow the diaphragm.', run: async () => { life.loopBeat(null); life.loopBreath([.01, .38]); await look('skeletal/body-of-sternum', 1.55, [.75, .1, 1]); } },
    { title: '2. Breathing out', text: 'At rest nothing has to push: the diaphragm relaxes and domes back up, the ribs settle under their own weight and the stretched lungs recoil like elastic. It is quick at first and then eases. Forced breathing out (a cough, blowing) adds the abdominal muscles.', run: () => life.loopBreath([.38, .92]) },
    { title: '3. The pause', text: 'A short rest before the next breath. The lungs are not empty: about two and a half litres stay in them. The heart beats a little slower in this half of the cycle and quicker while breathing in.', run: () => life.loopBreath([.9, .999]) },
    { title: 'The whole breath', text: 'About fourteen of these a minute at rest. Follow the blue curve on the monitor: a quick rise, a slower fall, a flat pause.', run: () => life.loopBreath(null) }
  ] };
  if (kind === 'swallow') return { name: 'ONE SWALLOW', flow: false, monitor: false, stops: [
    { title: '1. The larynx rises', text: 'The tongue pushes the mouthful back and a reflex takes over. The hyoid bone and the larynx are pulled up and forward by about two centimetres; that tips the epiglottis over the airway and opens the top of the oesophagus. Breathing stops for the second it takes. (This model moves the hyoid, the larynx and the top of the trachea; the tongue and epiglottis stay still.)', run: async () => { still(); life.loopSwallow([.0, .3]); await look('skeletal/hyoid-bone', .5, [1, .08, .55]); } },
    { title: '2. And drops back', text: 'Once the mouthful is past, the muscles let go and the larynx settles to where it was, stretching the trachea back to its resting length. The airway reopens and the next breath is usually out, which clears anything left near it.', run: () => life.loopSwallow([.3, 1]) },
    { title: '3. Down the oesophagus', text: 'A ring of muscle tightens behind the mouthful and travels down the oesophagus at a few centimetres a second, so swallowing works lying down or upside down. It takes about eight seconds to reach the stomach. Watch the ripple running along the tube behind the heart.', run: async () => { life.loopSwallow(null); await look('visceral/oesophagus', .95, [1, .05, .5]); } },
    { title: 'The whole swallow', text: 'A person swallows about once a minute awake, mostly saliva, and far less often asleep. Here it repeats every few seconds.', run: async () => { life.loopSwallow([0, 1]); await look('skeletal/hyoid-bone', .62, [1, .08, .55]); } }
  ] };
  if (kind === 'trip') return { name: 'BLOOD’S ROUND TRIP', flow: true, monitor: false, stops: [
    { title: '1. Back from the body', text: 'Blue here means blood that has given up much of its oxygen. It drains from the legs and abdomen into the inferior vena cava and from the arms and head into the superior vena cava. Veins have no pulse to speak of: the flow is steady, helped along by breathing and by the muscles around them.', run: async () => { still(); zone('venous'); view('front'); } },
    { title: '2. Through the right heart', text: 'Both venae cavae empty into the right atrium. When the tricuspid valve opens the blood drops into the right ventricle, and the next beat sends it out through the pulmonary valve. The right ventricle works at about a sixth of the pressure of the left: it only has to reach the lungs.', run: async () => { zone('right'); await look('heart/right-ventricle', .6, [.2, .15, 1]); } },
    { title: '3. To the lungs and back', text: 'The pulmonary trunk divides to the two lungs. In the capillaries around the air sacs the blood picks up oxygen and lets go of carbon dioxide, in about three quarters of a second. It comes back red through four pulmonary veins. These are the only arteries that carry blue blood and the only veins that carry red.', run: async () => { zone('lungs'); await look('heart/pulmonary-trunk', .8, [.15, .2, 1]); } },
    { title: '4. Through the left heart', text: 'The pulmonary veins fill the left atrium; the mitral valve lets the blood into the left ventricle, whose thick wall drives it out through the aortic valve. This is the stroke you feel as a pulse.', run: async () => { zone('left'); await look('heart/left-ventricle', .6, [.5, .12, 1]); } },
    { title: '5. Out to the body', text: 'The aorta arches over the heart and runs down in front of the spine. Branches leave for the head and arms from the arch, and the aorta divides for the legs at about the level of the navel. Arterial flow surges with every beat, later the further from the heart.', run: async () => { zone('arterial'); view('front'); } },
    { title: 'The whole round trip', text: 'One red cell takes about a minute to go right round at rest, and passes through the heart twice on the way. The two sides beat together, so the same volume leaves each: about five litres a minute.', run: async () => { zone(null); view('front'); } }
  ] };
  if (kind === 'digest') return { name: 'A MEAL’S ROUTE', flow: false, monitor: false, stops: [
    { title: '1. Oesophagus', text: 'A muscular tube about 25 centimetres long, behind the windpipe and the heart. It adds nothing to digestion; it delivers. The wave you can see along it is the same one that carries each swallow down.', run: async () => { still(); await look('visceral/oesophagus', .95, [.9, .05, .6]); } },
    { title: '2. Stomach', text: 'The stomach holds a meal for two to four hours. Its wall churns three times a minute, mixing food with acid and the enzyme pepsin until it is a thick liquid, and lets it through to the intestine a spoonful at a time.', run: () => look('visceral/stomach', .7, [.5, .1, 1]) },
    { title: '3. Duodenum', text: 'The first 25 centimetres of the small intestine, curved round the head of the pancreas. Bile from the liver and gallbladder and enzymes from the pancreas join the food here; the acid from the stomach is neutralised.', run: () => look('visceral/duodenum', .6, [.2, .1, 1]) },
    { title: '4. Small intestine', text: 'About six metres of it, folded into the middle of the abdomen. Nearly all the absorbing is done here, across a lining folded so finely that its area is that of a small flat. Food takes three to five hours to pass through.', run: () => look('visceral/jejunum', .85, [.15, .05, 1]) },
    { title: '5. Large intestine', text: 'The colon runs up the right side, across under the stomach and down the left. It takes back most of the remaining water and salts, and its bacteria ferment what the small intestine could not digest. This is the slow part: a day or more.', run: () => look('visceral/transverse-colon', 1.05, [.1, .05, 1]) },
    { title: 'The whole route', text: 'From mouth to exit is about nine metres and usually one to three days. The ripples shown on the stomach, intestines and ureters are speeded up so they can be seen; the real ones are slower and come in bursts.', run: () => view('front') }
  ] };
  return null;
}
