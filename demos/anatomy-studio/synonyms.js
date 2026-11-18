/**
 * Everyday names for anatomical ones, so a search for "thigh bone" finds the femur. The model's pieces carry
 * Terminologia Anatomica names in British spelling; this maps common words and American spellings onto the words
 * that actually appear in those names. Keys and values are lower case; a value is matched as part of a piece's name.
 */
const COMMON = {
  // bones
  'thigh bone': ['femur'], 'thighbone': ['femur'], 'shin bone': ['tibia'], 'shinbone': ['tibia'], 'calf bone': ['fibula'], 'kneecap': ['patella'], 'knee cap': ['patella'],
  'collarbone': ['clavicle'], 'collar bone': ['clavicle'], 'shoulder blade': ['scapula'], 'breastbone': ['sternum'], 'breast bone': ['sternum'], 'upper arm bone': ['humerus'], 'funny bone': ['ulnar nerve'],
  'forearm': ['radius', 'ulna'], 'wrist': ['carpal', 'scaphoid', 'lunate'], 'finger bone': ['phalanx of'], 'toe bone': ['phalanx of'], 'knuckle': ['metacarpal'],
  'jaw': ['mandible', 'maxilla'], 'jawbone': ['mandible'], 'lower jaw': ['mandible'], 'upper jaw': ['maxilla'], 'cheekbone': ['zygomatic'], 'cheek bone': ['zygomatic'], 'skull': ['frontal bone', 'parietal bone', 'occipital bone', 'temporal bone'],
  'backbone': ['vertebra'], 'spine': ['vertebra', 'sacrum'], 'tailbone': ['coccyx'], 'tail bone': ['coccyx'], 'hip bone': ['hip bone'], 'hipbone': ['hip bone'], 'heel bone': ['calcaneus'], 'heel': ['calcaneus'], 'ankle bone': ['talus'],
  'rib cage': [' rib'], 'ribcage': [' rib'], 'ear bones': ['malleus', 'incus', 'stapes'], 'hammer': ['malleus'], 'anvil': ['incus'], 'stirrup': ['stapes'],
  // organs
  'windpipe': ['trachea'], 'gullet': ['oesophagus'], 'food pipe': ['oesophagus'], 'esophagus': ['oesophagus'], 'voice box': ['thyroid cartilage', 'cricoid', 'arytenoid'], 'adam\'s apple': ['thyroid cartilage'], 'adams apple': ['thyroid cartilage'],
  'small intestine': ['duodenum', 'jejunum'], 'large intestine': ['colon'], 'bowel': ['colon', 'jejunum'], 'gut': ['stomach', 'jejunum', 'colon'], 'belly': ['stomach', 'abdom'], 'tummy': ['stomach'],
  'cecum': ['caecum'], 'adrenal': ['suprarenal'], 'bladder': ['urinary bladder'], 'gall bladder': ['gallbladder'], 'tonsil': ['tonsil'], 'pituitary': ['hypophysis'],
  'eyeball': ['sclera', 'cornea', 'retina'], 'white of the eye': ['sclera'], 'pupil': ['iris'], 'eardrum': ['tympanic'], 'ear drum': ['tympanic'], 'spinal cord': ['spinal cord'], 'brain stem': ['pons', 'medulla', 'midbrain'],
  // heart and vessels
  'main artery': ['aorta'], 'heart chamber': ['atrium', 'ventricle'], 'mitral valve': ['left atrioventricular valve'], 'tricuspid valve': ['right atrioventricular valve'], 'aortic valve': ['coronary leaflet'],
  'jugular': ['jugular vein'], 'carotid': ['carotid artery'], 'windpipe branches': ['bronchus'],
  // muscles
  'calf': ['gastrocnemius', 'soleus'], 'calf muscle': ['gastrocnemius', 'soleus'], 'hamstring': ['biceps femoris', 'semitendinosus', 'semimembranosus'], 'hamstrings': ['biceps femoris', 'semitendinosus', 'semimembranosus'],
  'quad': ['rectus femoris', 'vastus'], 'quads': ['rectus femoris', 'vastus'], 'quadriceps': ['rectus femoris', 'vastus'], 'abs': ['rectus abdominis'], 'six pack': ['rectus abdominis'], 'glute': ['gluteus'], 'glutes': ['gluteus'], 'buttock': ['gluteus'],
  'pec': ['pectoralis'], 'pecs': ['pectoralis'], 'chest muscle': ['pectoralis'], 'lat': ['latissimus'], 'lats': ['latissimus'], 'trap': ['trapezius'], 'traps': ['trapezius'], 'delt': ['deltoid'], 'delts': ['deltoid'],
  'bicep': ['biceps brachii'], 'biceps': ['biceps brachii'], 'tricep': ['triceps brachii'], 'triceps': ['triceps brachii'], 'achilles': ['calcaneal tendon', 'gastrocnemius'], 'rotator cuff': ['supraspinatus', 'infraspinatus', 'subscapularis', 'teres minor'],
  // nerves
  'sciatic': ['sciatic nerve'], 'vagus': ['vagus nerve']
};
const KEYS = Object.keys(COMMON).sort((a, b) => b.length - a.length);

/**
 * What to search for, given what was typed: the text itself, plus the anatomical words for any everyday name in
 * it. American "e" for British "ae"/"oe" is covered where it starts a word used here (esophagus, cecum).
 */
export function searchTerms(typed) {
  const term = typed.trim().toLowerCase();
  if (!term) return [];
  const out = new Set([term]);
  for (const key of KEYS) if (term === key || (term.length >= 4 && key.startsWith(term)) || term.includes(key)) for (const word of COMMON[key]) out.add(word);
  return [...out];
}
