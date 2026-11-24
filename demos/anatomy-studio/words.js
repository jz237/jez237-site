/**
 * Where the names come from, and how they sound.
 *
 * Anatomical names are mostly plain Latin and Greek descriptions: a little mouse, a boat, a wedge, a sieve. Knowing
 * the picture behind a word makes it easier to remember, so the inspector shows it for the piece in hand.
 * wordOrigins(name) returns up to two notes for a piece's name. Only well-attested origins are listed.
 *
 * sayName(name) reads a name aloud with the browser's own voice (no audio is downloaded). How well it pronounces
 * anatomical Latin depends on the voice installed on the device.
 */
const ROOTS = [
  // heart and vessels
  [/\bcardi|cardiac/i, 'Cardiac', 'Greek kardia, heart.'],
  [/coronary/i, 'Coronary', 'Latin corona, crown: these vessels circle the heart like one.'],
  [/\batri(um|al|a)\b/i, 'Atrium', 'Latin atrium, the entrance hall of a Roman house.'],
  [/ventric/i, 'Ventricle', 'Latin ventriculus, little belly.'],
  [/\baort/i, 'Aorta', 'Greek aorte, from aeirein, to lift up: what the heart hangs from.'],
  [/carotid/i, 'Carotid', 'Greek karoun, to stupefy: pressing on these arteries causes a faint.'],
  [/jugular/i, 'Jugular', 'Latin jugulum, the throat.'],
  [/vena cava/i, 'Vena cava', 'Latin for hollow vein.'],
  [/\barter(y|ies|ial)\b/i, 'Artery', 'Greek arteria, air-carrier: found empty after death, arteries were once thought to hold air.'],
  [/mitral|left atrioventricular valve/i, 'Mitral', 'Named for a bishop’s mitre, which its two leaflets resemble.'],
  [/pulmon/i, 'Pulmonary', 'Latin pulmo, lung.'],
  // chest and airway
  [/trachea/i, 'Trachea', 'Greek tracheia arteria, the rough air-pipe, for its rings of cartilage.'],
  [/bronch/i, 'Bronchus', 'Greek bronchos, windpipe.'],
  [/diaphragm/i, 'Diaphragm', 'Greek diaphragma, a partition.'],
  [/thyroid/i, 'Thyroid', 'Greek thyreos, a tall shield.'],
  [/epiglott/i, 'Epiglottis', 'Greek epi and glotta: upon the tongue.'],
  [/hyoid/i, 'Hyoid', 'Greek hyoeides, shaped like the letter upsilon.'],
  // gut
  [/oesophag|esophag/i, 'Oesophagus', 'Greek oisophagos: what carries the food eaten.'],
  [/gastr(ic|o)(?!cnem)/i, 'Gastric', 'Greek gaster, belly.'],
  [/duoden/i, 'Duodenum', 'Latin duodeni, twelve each: it is about twelve finger-widths long.'],
  [/jejun/i, 'Jejunum', 'Latin jejunus, fasting: it was usually found empty at dissection.'],
  [/\bcolon\b|colic\b/i, 'Colon', 'Greek kolon, the large intestine.'],
  [/pancrea/i, 'Pancreas', 'Greek pan and kreas: all flesh.'],
  [/hepat/i, 'Hepatic', 'Greek hepar, liver.'],
  [/\brenal|\bren\b/i, 'Renal', 'Latin ren, kidney.'],
  [/ureter/i, 'Ureter', 'Greek oureter, from ourein, to pass water.'],
  // skull and spine
  [/mandib/i, 'Mandible', 'Latin mandere, to chew.'],
  [/maxill/i, 'Maxilla', 'Latin maxilla, jaw.'],
  [/zygomat/i, 'Zygomatic', 'Greek zygon, a yoke: it joins the face to the side of the skull.'],
  [/sphenoid/i, 'Sphenoid', 'Greek sphen, a wedge.'],
  [/ethmoid/i, 'Ethmoid', 'Greek ethmos, a sieve, for the holes the nerves of smell pass through.'],
  [/occipit/i, 'Occipital', 'Latin occiput, the back of the head.'],
  [/pariet/i, 'Parietal', 'Latin paries, a wall.'],
  [/frontal/i, 'Frontal', 'Latin frons, forehead.'],
  [/^atlas/i, 'Atlas', 'The Titan who held up the sky; this vertebra holds up the skull.'],
  [/^axis/i, 'Axis', 'Latin axis, an axle: the atlas and the head turn on it.'],
  [/vertebr/i, 'Vertebra', 'Latin vertere, to turn.'],
  [/sacr(um|al)/i, 'Sacrum', 'Latin os sacrum, the sacred bone.'],
  [/coccy/i, 'Coccyx', 'Greek kokkyx, cuckoo: it is shaped like the bird’s beak.'],
  // trunk and limbs
  [/clavic/i, 'Clavicle', 'Latin clavicula, little key.'],
  [/scapul/i, 'Scapula', 'Latin scapulae, the shoulder blades.'],
  [/stern(um|al|o)/i, 'Sternum', 'Greek sternon, chest.'],
  [/\brib\b|costal/i, 'Costal', 'Latin costa, rib.'],
  [/pelvi/i, 'Pelvis', 'Latin pelvis, a basin.'],
  [/acetabul/i, 'Acetabulum', 'Latin for a small vinegar cup.'],
  [/humer/i, 'Humerus', 'Latin umerus, shoulder.'],
  [/\bradi(us|al)\b/i, 'Radius', 'Latin radius, the spoke of a wheel.'],
  [/\bulna/i, 'Ulna', 'Latin ulna, elbow.'],
  [/scaphoid/i, 'Scaphoid', 'Greek skaphe, a boat.'],
  [/lunate/i, 'Lunate', 'Latin luna, moon.'],
  [/pisiform/i, 'Pisiform', 'Latin pisum, a pea.'],
  [/hamate/i, 'Hamate', 'Latin hamus, a hook.'],
  [/capitate/i, 'Capitate', 'Latin caput, head: it is the largest wrist bone.'],
  [/triquetr/i, 'Triquetrum', 'Latin triquetrus, three-cornered.'],
  [/phalan/i, 'Phalanx', 'Greek phalanx, a line of soldiers.'],
  [/femur|femoral/i, 'Femur', 'Latin femur, thigh.'],
  [/patell/i, 'Patella', 'Latin patella, a small dish.'],
  [/tibia/i, 'Tibia', 'Latin tibia, the shin bone, and also a flute made from one.'],
  [/fibul/i, 'Fibula', 'Latin fibula, a brooch: with the tibia it looks like a clasp and its pin.'],
  [/\btalus|talar/i, 'Talus', 'Latin talus, the ankle bone, also used as a die.'],
  [/calcane/i, 'Calcaneus', 'Latin calx, heel.'],
  [/navicular/i, 'Navicular', 'Latin navicula, a little ship.'],
  [/cuneiform/i, 'Cuneiform', 'Latin cuneus, a wedge.'],
  [/cuboid/i, 'Cuboid', 'Greek kybos, a cube.'],
  [/hallu[xc]/i, 'Hallux', 'Latin hallux, the big toe.'],
  [/pollic|pollex/i, 'Pollex', 'Latin pollex, the thumb.'],
  // muscles
  [/biceps/i, 'Biceps', 'Latin for two heads.'],
  [/triceps/i, 'Triceps', 'Latin for three heads.'],
  [/quadriceps/i, 'Quadriceps', 'Latin for four heads.'],
  [/deltoid/i, 'Deltoid', 'Shaped like the Greek letter delta, a triangle.'],
  [/trapezius/i, 'Trapezius', 'Greek trapezion, a little table: the pair make a four-sided shape.'],
  [/glute/i, 'Gluteus', 'Greek gloutos, buttock.'],
  [/gastrocnem/i, 'Gastrocnemius', 'Greek gaster and kneme: the belly of the leg.'],
  [/soleus/i, 'Soleus', 'Latin solea, a sandal, and the flatfish named after it.'],
  [/sartori/i, 'Sartorius', 'Latin sartor, tailor: it crosses the legs the way tailors sat.'],
  [/masseter/i, 'Masseter', 'Greek maseter, a chewer.'],
  [/pectoral/i, 'Pectoralis', 'Latin pectus, breast.'],
  [/latissimus/i, 'Latissimus', 'Latin for broadest.'],
  [/\brectus/i, 'Rectus', 'Latin for straight.'],
  [/serratus/i, 'Serratus', 'Latin serra, a saw, for its toothed edge.'],
  [/piriform/i, 'Piriformis', 'Latin pirum, a pear.'],
  [/muscle/i, 'Muscle', 'Latin musculus, little mouse: a muscle moving under the skin looked like one.'],
  // joints and soft tissue
  [/menisc/i, 'Meniscus', 'Greek meniskos, a crescent, literally a little moon.'],
  [/ligament/i, 'Ligament', 'Latin ligare, to bind.'],
  [/tendon/i, 'Tendon', 'Latin tendere, to stretch.'],
  [/cartilag/i, 'Cartilage', 'Latin cartilago, gristle.'],
  [/fasci/i, 'Fascia', 'Latin fascia, a band.'],
  [/lymph/i, 'Lymph', 'Latin lympha, clear water.'],
  // brain, nerves and senses
  [/cerebell/i, 'Cerebellum', 'Latin for little brain.'],
  [/cerebr/i, 'Cerebrum', 'Latin cerebrum, brain.'],
  [/hippocamp/i, 'Hippocampus', 'Greek for seahorse, which it resembles in section.'],
  [/amygdal/i, 'Amygdala', 'Greek amygdale, an almond.'],
  [/thalam/i, 'Thalamus', 'Greek thalamos, an inner room.'],
  [/\bpons\b|pontine/i, 'Pons', 'Latin for bridge.'],
  [/medulla/i, 'Medulla', 'Latin for marrow or pith.'],
  [/gyrus/i, 'Gyrus', 'Greek gyros, a ring.'],
  [/sulcus/i, 'Sulcus', 'Latin for a furrow.'],
  [/cortex|cortical/i, 'Cortex', 'Latin for bark.'],
  [/vagus/i, 'Vagus', 'Latin vagus, wandering: it runs from the brain to the abdomen.'],
  [/sciatic/i, 'Sciatic', 'Greek ischion, the hip.'],
  [/trigemin/i, 'Trigeminal', 'Latin trigeminus, born three together, for its three branches.'],
  [/nerve/i, 'Nerve', 'Latin nervus, a sinew: nerves and tendons were once not told apart.'],
  [/cornea/i, 'Cornea', 'Latin cornu, horn: the horny coat of the eye.'],
  [/retina/i, 'Retina', 'Latin rete, a net.'],
  [/\biris\b/i, 'Iris', 'Greek iris, the rainbow.'],
  [/sclera/i, 'Sclera', 'Greek skleros, hard.'],
  [/cochlea/i, 'Cochlea', 'Greek kochlias, a snail.']
];

/** Up to two notes on where the words in a piece's name come from, most specific first. */
export function wordOrigins(name) {
  const found = [];
  for (const [test, word, origin] of ROOTS) { if (test.test(name)) found.push(`${word}: ${origin}`); if (found.length === 2) break; }
  return found;
}

export const canSay = () => typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';
/** Read a name aloud. Returns false where the browser has no speech. */
export function sayName(name) {
  if (!canSay()) return false;
  const u = new SpeechSynthesisUtterance(name.replace(/\s*\([^)]*\)/g, '').trim());
  u.rate = 0.85; u.lang = 'en-GB';
  speechSynthesis.cancel(); speechSynthesis.speak(u);
  return true;
}
