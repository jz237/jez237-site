/**
 * Nested exploded views. Dependency-free: imported by the studio, by scripts/anatomy-studio/prepare.mjs (member resolution)
 * and by verify.mjs. Frame: metres, y up, +z anterior, +x subject's left. Offsets are metres at full separation.
 */
const sideSign = p => p.side === 'L' ? 1 : p.side === 'R' ? -1 : (p.center[0] > 0.005 ? 1 : p.center[0] < -0.005 ? -1 : 0);
const add = (...v) => v.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], [0, 0, 0]);
const scale = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const radial = (p, ctx, d, lift = 0) => { const c = Array.isArray(ctx) ? ctx : ctx.center; const dx = p.center[0] - c[0], dz = p.center[2] - c[2], l = Math.hypot(dx, dz) || 1; return [dx / l * d, lift, dz / l * d]; };
const has = (re, p) => re.test(p.name);
const RIB = {First: 1, Second: 2, Third: 3, Fourth: 4, Fifth: 5, Sixth: 6, Seventh: 7, Eighth: 8, Ninth: 9, Tenth: 10, Eleventh: 11, Twelfth: 12};
export const ribNumber = name => { const m = name.match(/(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth) rib/); return m ? RIB[m[1]] : 6; };
const toeSpread = name => { const i = ['first', 'second', 'third', 'fourth', 'fifth'].findIndex(k => name.includes(k + ' finger')); return i < 0 ? 0 : (i - 2) * 0.022; };
const centroid = list => { const n = Math.max(list.length, 1); return list.reduce((a, p) => [a[0] + p.center[0] / n, a[1] + p.center[1] / n, a[2] + p.center[2] / n], [0, 0, 0]); };

// vertebral levels: C1..C7 = 0..6, T1..T12 = 7..18, L1..L5 = 19..23, sacrum 24, coccyx 25
export function vertebraLevel(name) {
  if (/^Atlas/.test(name)) return 0; if (/^Axis/.test(name)) return 1;
  const m = name.match(/^Vertebra ([CTL])(\d+)$/); if (m) return {C: -1, T: 6, L: 18}[m[1]] + Number(m[2]);
  if (name === 'Sacrum') return 24; if (name === 'Coccyx') return 25; return null;
}
const levelOf = code => { const m = code.match(/^([CTLS])(\d+)$/); if (!m) return null; return m[1] === 'S' ? 24 : {C: -1, T: 6, L: 18}[m[1]] + Number(m[2]); };
const MID_LEVEL = 12;   // T6: the stack expands away from mid-thorax so the whole column stays framed
// positive = toward the head along the sacrum→atlas axis; the stack expands away from mid-thorax
export const stackGap = k => { let g = 0; const step = j => (j < 7 ? 0.034 : 0.026) + 0.0015 * Math.abs(j - MID_LEVEL); if (k > MID_LEVEL) for (let j = MID_LEVEL; j < k; j++) g -= step(j); else for (let j = k; j < MID_LEVEL; j++) g += step(j); return g; };

const lungLobe = p => {   // which lobe a bronchus / vessel belongs to
  const n = p.name, r = /right lung|^Right|\bof right\b/i.test(n) || /Right (main|superior lobar|inferior lobar)/.test(n) || /^(Middle lobar bronchus|Intermediate bronchus)$/.test(n) || p.side === 'R' && !/left/i.test(n);
  const code = (n.match(/\(B([IVX]+)(?:\+B[IVX]+)?\)/) || [])[1];
  let roman = {I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10}[code];
  if (!roman && /segmental (artery|vein)/i.test(n)) roman = /basal|^Superior segmental/i.test(n) ? 8 : /medial segmental|lateral segmental|lingular/i.test(n) ? 4 : 1;
  if (r) { if (/superior lobar/i.test(n) || (roman && roman <= 3)) return 'RS'; if (/Middle lobar/.test(n) || (roman && roman <= 5)) return 'RM'; if (/inferior lobar/i.test(n) || roman) return 'RI'; return 'R'; }
  if (/superior lobar/i.test(n) || (roman && roman <= 5)) return 'LS'; if (/inferior lobar/i.test(n) || roman) return 'LI'; return 'L';
};
const LOBE = {RS: [-0.30, 0.17, 0.02], RM: [-0.37, 0.00, 0.17], RI: [-0.32, -0.19, -0.06], LS: [0.30, 0.17, 0.02], LI: [0.32, -0.19, -0.06], R: [-0.12, 0, 0.02], L: [0.12, 0, 0.02]};

export const assemblies = {
  heart: {
    title: 'The heart', eyebrow: 'FOUR CHAMBERS · NINE LEAFLETS · CORONARY CAGE', files: ['heart'], color: '#ff6b7a',
    match: p => p.file === 'heart',
    view: [0.9, 0.45, 1.5], padding: 1.05, scale: 0.5,
    primary: p => /^(Right|Left) (atrium|ventricle)$/.test(p.name) || /^(Pulmonary trunk|Ascending aorta|Superior vena cava|Inferior vena cava)/.test(p.name),
    layers: [
      {test: p => p.name === 'Right atrium', offset: () => [-0.17, 0.11, 0.00]},
      {test: p => p.name === 'Right ventricle', offset: () => [-0.16, -0.13, 0.07]},
      {test: p => p.name === 'Left atrium', offset: () => [0.17, 0.11, -0.03]},
      {test: p => p.name === 'Left ventricle', offset: () => [0.16, -0.13, 0.00]},
      {test: p => /papillary muscle of right ventricle/.test(p.name), offset: () => [-0.16, -0.20, 0.07]},
      {test: p => /papillary muscle of left ventricle/.test(p.name), offset: () => [0.16, -0.20, 0.00]},
      {test: p => /leaflet of right atrioventricular valve/.test(p.name), offset: () => [-0.16, -0.01, 0.04]},
      {test: p => /leaflet of left atrioventricular valve/.test(p.name), offset: () => [0.16, -0.01, -0.02]},
      {test: p => /coronary leaflet|Non-coronary leaflet/.test(p.name), offset: () => [0.02, 0.19, 0.00]},
      {test: p => /leaflet of pulmonary valve/.test(p.name), offset: () => [-0.05, 0.19, 0.09]},
      {test: p => /^Ascending aorta$/.test(p.name), offset: () => [0.01, 0.30, 0.00]},
      {test: p => /^Aortic arch$/.test(p.name), offset: () => [0.01, 0.35, 0.00]},
      {test: p => /^Pulmonary trunk$/.test(p.name), offset: () => [-0.06, 0.27, 0.11]},
      {test: p => /^Bifurcation of pulmonary trunk$/.test(p.name), offset: () => [-0.06, 0.31, 0.09]},
      {test: p => /pulmonary artery$/.test(p.name), offset: p => [sideSign(p) * 0.30, 0.24, 0.02]},
      {test: p => /^Superior vena cava$/.test(p.name), offset: () => [-0.11, 0.30, -0.06]},
      {test: p => /^Inferior vena cava/.test(p.name), offset: () => [-0.07, -0.32, -0.04]},
      {test: p => /pulmonary vein$/.test(p.name), offset: p => [sideSign(p) * 0.33, /superior/.test(p.name) ? 0.07 : -0.03, -0.08]},
      {test: p => /coronary artery|interventricular artery|Circumflex|Septal branches|inferolateral branch/.test(p.name), offset: (p, c) => add(radial(p, c, 0.24), [0, 0, 0.14])},
      {test: p => /cardiac vein|Coronary sinus|vein of left ventricle/.test(p.name), offset: (p, c) => add(radial(p, c, 0.26), [0, -0.02, -0.14])},
      {test: () => true, offset: (p, c) => radial(p, c, 0.14)}],
    landmarks: [{label: 'APEX OF HEART', anchor: 'Apex of heart'}, {label: 'BASE OF HEART', anchor: 'Base of heart'}, {label: 'RIGHT ATRIUM', piece: 'Right atrium'}, {label: 'LEFT VENTRICLE', piece: 'Left ventricle'}, {label: 'AORTIC ARCH', piece: 'Aortic arch'}, {label: 'PULMONARY TRUNK', piece: 'Pulmonary trunk'}, {label: 'CORONARY ARTERIES', piece: 'Anterior interventricular artery'}],
    description: 'The four chambers part along the septa: atria lift, ventricles drop, and the nine valve leaflets hang in the gaps where they seal. The coronary arteries pull forward and the cardiac veins pull back as two cages around the muscle, while the great vessels extend along their own course.'
  },
  lungs: {
    title: 'The lungs', eyebrow: 'FIVE LOBES · THE BRONCHIAL TREE · PLEURA', files: ['visceral', 'vessels'], color: '#f2a8b8',
    match: p => (p.file === 'visceral' && (/lobe of (right|left) lung|bronchus|^Trachea$|^Pleura$/i.test(p.name))) || (p.file === 'vessels' && /lobar (artery|vein)|segmental (artery|vein)|pulmonary (artery|vein)/i.test(p.name)),
    view: [0.15, 0.35, 1.7], padding: 1.02, scale: 0.85,
    primary: p => /lobe of (right|left) lung|^Trachea$/.test(p.name),
    layers: [
      {test: p => p.name === 'Superior lobe of right lung', offset: () => LOBE.RS},
      {test: p => p.name === 'Middle lobe of right lung', offset: () => LOBE.RM},
      {test: p => p.name === 'Inferior lobe of right lung', offset: () => LOBE.RI},
      {test: p => p.name === 'Superior lobe of left lung', offset: () => LOBE.LS},
      {test: p => p.name === 'Inferior lobe of left lung', offset: () => LOBE.LI},
      {test: p => p.name === 'Pleura', offset: () => [0, 0.36, 0.26], opacity: 0.14},
      {test: p => p.name === 'Trachea', offset: () => [0, 0.16, 0]},
      {test: p => /main bronchus/.test(p.name), offset: p => [sideSign(p) * 0.06, 0.06, 0]},
      {test: p => /bronchus/i.test(p.name), offset: p => scale(LOBE[lungLobe(p)] || [0, 0, 0], 0.42)},
      {test: () => true, offset: p => scale(LOBE[lungLobe(p)] || [0, 0, 0], 0.30)}],
    landmarks: [{label: 'APEX OF LUNG', anchor: 'Apex of lung'}, {label: 'HILUM', anchor: 'Hilum of lung'}, {label: 'CARDIAC NOTCH', anchor: 'Cardiac notch of left lung'}, {label: 'TRACHEA', piece: 'Trachea'}, {label: 'MIDDLE LOBE', piece: 'Middle lobe of right lung'}, {label: 'PLEURA', piece: 'Pleura'}],
    description: 'The five lobes fan away from the mediastinum, two on the left and three on the right, while the trachea and bronchial tree stay behind to show how each lobar and segmental bronchus reaches its lobe. The pleura lifts clear as a translucent envelope.'
  },
  spine: {
    title: 'The spine', eyebrow: '24 VERTEBRAE · 23 DISCS · CORD AND LIGAMENTS', files: ['skeletal', 'joints', 'nerves', 'brain'], color: '#f0e6c8',
    match: p => (p.file === 'skeletal' && vertebraLevel(p.name) !== null) || (p.file === 'joints' && (/^Intervertebral disc [CTLS]\d+-[CTLS]\d+$/.test(p.name) || /^(Anterior longitudinal ligament|Posterior longitudinal ligament|Ligamenta flava|Supraspinous ligament|Interspinous ligaments|Nuchal ligament|Intertransverse ligaments|Sacrococcygeal symphysis)$/.test(p.name))) || (p.file === 'nerves' && /^(White matter of spinal cord|Grey matter of spinal cord|Central canal of spinal cord)$/.test(p.name)) || (p.file === 'brain' && p.name === 'Spinal dura'),
    view: [1.9, 0.35, 1.2], padding: 1.0, scale: 1,
    axis: 'spine',
    primary: p => vertebraLevel(p.name) !== null,
    layers: [
      {test: p => vertebraLevel(p.name) !== null, offset: (p, c) => scale(c.axis, stackGap(vertebraLevel(p.name)))},
      {test: p => /^Intervertebral disc/.test(p.name), offset: (p, c) => { const [a, b] = p.name.split(' ').pop().split('-'); return scale(c.axis, (stackGap(levelOf(a)) + stackGap(levelOf(b))) / 2); }},
      {test: p => p.name === 'Anterior longitudinal ligament', offset: () => [0, 0, 0.14]},
      {test: p => p.name === 'Posterior longitudinal ligament', offset: () => [0.10, 0, -0.16]},
      {test: p => /Ligamenta flava|Interspinous|Supraspinous|Nuchal|Sacrococcygeal/.test(p.name), offset: () => [0, 0, -0.26]},
      {test: p => /Intertransverse/.test(p.name), offset: p => [sideSign(p) * 0.14, 0, -0.04]},
      {test: p => p.name === 'White matter of spinal cord', offset: () => [-0.06, 0, -0.34]},
      {test: p => p.name === 'Grey matter of spinal cord', offset: () => [0.04, 0, -0.40]},
      {test: p => p.name === 'Central canal of spinal cord', offset: () => [0.12, 0, -0.44]},
      {test: p => p.name === 'Spinal dura', offset: () => [-0.18, 0, -0.30], opacity: 0.35},
      {test: () => true, offset: () => [0, 0, 0]}],
    landmarks: [{label: 'ATLAS · C1', piece: 'Atlas (C1)'}, {label: 'C7', piece: 'Vertebra C7'}, {label: 'T12', piece: 'Vertebra T12'}, {label: 'L5', piece: 'Vertebra L5'}, {label: 'SACRUM', piece: 'Sacrum'}, {label: 'SPINAL CORD', piece: 'White matter of spinal cord'}, {label: 'ANTERIOR LONGITUDINAL LIGAMENT', piece: 'Anterior longitudinal ligament'}],
    description: 'The column stacks apart along its own curve, from atlas to coccyx, with each intervertebral disc held in the gap it fills. The long ligaments peel forward and back, and the spinal cord, its grey matter and the dural sac slide out behind the canal.'
  },
  brain: {
    title: 'The brain', eyebrow: 'CORTEX · DEEP NUCLEI · CEREBELLUM · BRAINSTEM', files: ['brain'], color: '#f5c0c8',
    match: p => p.file === 'brain' && (p.path.startsWith('Central nervous system / Brain') || /^(Falx cerebri|Tentorium cerebelli)$/.test(p.name)),
    view: [1.4, 0.8, 1.15], padding: 1.02, scale: 0.5,
    primary: p => /^(White matter of telencephalon|Corpus callosum|Culmen|Fourth ventricle)$/.test(p.name) || (p.side === 'L' && /^(Pons|Medulla oblongata|Midbrain|Thalamus|Lateral ventricle)$/.test(p.name)),
    layers: [
      {test: p => /^(Falx cerebri|Tentorium cerebelli)$/.test(p.name), offset: () => [0, 0.34, 0], opacity: 0.18},
      {test: p => p.name === 'Midbrain', offset: () => [0, -0.13, 0.0]},
      {test: p => p.name === 'Pons', offset: () => [0, -0.30, 0.0]},
      {test: p => /^(Medulla oblongata|Pyramid of medulla oblongata|Olive)$/.test(p.name), offset: () => [0, -0.48, 0.0]},
      {test: p => p.name === 'Brainstem nuclei', offset: p => [sideSign(p) * 0.13, -0.30, 0.0]},
      {test: p => p.path.includes('/ Brainstem'), offset: () => [0, -0.26, 0.0]},
      {test: p => p.path.includes('/ Cerebellum'), offset: p => [sideSign(p) * 0.07, -0.16, -0.20]},
      {test: p => /ventricle$|Choroid plexus|Septum pellucidum/.test(p.name), offset: p => p.name === 'Fourth ventricle' ? [0, -0.10, -0.13] : [sideSign(p) * 0.10, 0.20, 0]},
      {test: p => /^(Corpus callosum|Anterior commissure|Posterior commissure|Hippocampal commissure)$/.test(p.name), offset: () => [0, 0.13, 0]},
      {test: p => p.path.includes('Diencephalon') || /Optic|Thalamus|Hypothalamus|Habenula|Mamillary|geniculate|Pineal/.test(p.name), offset: p => [sideSign(p) * 0.04, 0.02, 0.02]},
      {test: p => p.path.includes('Corpus striatum') || p.path.includes('Basal forebrain') || /Amygdaloid|Hippocampus|Fornix|Stria|Septal nuclei|Caudate|Putamen|Globus|Lentiform/.test(p.name), offset: p => [sideSign(p) * 0.15, 0.07, 0]},
      {test: p => /^White matter of telencephalon$/.test(p.name), offset: p => [sideSign(p) * 0.24, 0.03, 0]},
      {test: p => p.name === 'Cerebral sulci', offset: p => [sideSign(p) * 0.44, 0.05, 0], opacity: 0.55},
      {test: p => p.path.includes('Frontal lobe'), offset: p => [sideSign(p) * 0.42, 0.05, 0.09]},
      {test: p => p.path.includes('Occipital lobe'), offset: p => [sideSign(p) * 0.42, 0.05, -0.09]},
      {test: p => p.path.includes('Parietal lobe'), offset: p => [sideSign(p) * 0.42, 0.13, 0]},
      {test: p => p.path.includes('Temporal lobe'), offset: p => [sideSign(p) * 0.42, -0.04, 0]},
      {test: p => p.path.includes('Limbic lobe') || p.path.includes('Insula'), offset: p => [sideSign(p) * 0.33, 0.05, 0]},
      {test: () => true, offset: p => [sideSign(p) * 0.36, 0.05, 0]}],
    landmarks: [{label: 'FRONTAL LOBE', piece: 'Superior frontal gyrus', side: 'L'}, {label: 'OCCIPITAL LOBE', piece: 'Occipital pole', side: 'L'}, {label: 'CEREBELLUM', piece: 'Superior semilunar lobule', side: 'L'}, {label: 'PONS', piece: 'Pons', side: 'L'}, {label: 'CORPUS CALLOSUM', piece: 'Corpus callosum'}, {label: 'THALAMUS', piece: 'Thalamus', side: 'L'}, {label: 'LATERAL VENTRICLE', piece: 'Lateral ventricle', side: 'L'}],
    description: 'The cortex opens outward as a shell of named gyri, lobe by lobe, leaving the white matter, the deep nuclei and the ventricles in place at the centre. The corpus callosum lifts, the cerebellum drops back, and the brainstem descends in its three parts: midbrain, pons and medulla.'
  }
,
  skull: {
    title: 'The skull', eyebrow: '22 BONES · 28 TEETH · OSSICLES · CARTILAGES', files: ['skeletal'], color: '#f0e6c8',
    match: p => p.file === 'skeletal' && (/Cranium|Extracranial bones of head|Auditory ossicles|Nasal cartilages|Teeth/.test(p.path)),
    view: [1.1, 0.55, 1.25], padding: 1.08, scale: 1,
    primary: p => /^(Frontal bone|Occipital bone|Sphenoid bone|Mandible|Hyoid bone)$/.test(p.name) || (p.side === 'L' && /^(Parietal bone|Temporal bone|Maxilla|Zygomatic bone)$/.test(p.name)),
    layers: [
      {test: p => p.name === 'Frontal bone', offset: () => [0, 0.10, 0.05]},
      {test: p => p.name === 'Sinus of frontal bone', offset: () => [0, 0.10, 0.09]},
      {test: p => p.name === 'Parietal bone', offset: p => [sideSign(p) * 0.09, 0.12, -0.02]},
      {test: p => p.name === 'Occipital bone', offset: () => [0, 0.05, -0.13]},
      {test: p => p.name === 'Temporal bone', offset: p => [sideSign(p) * 0.13, 0.0, -0.02]},
      {test: p => /^(Incus|Malleus|Stapes)$/.test(p.name), offset: p => [sideSign(p) * 0.20, 0.02, -0.02]},
      {test: p => /Sphenoid/.test(p.name), offset: () => [0, 0, 0]},
      {test: p => /Ethmoid|cells of ethmoid/.test(p.name), offset: () => [0, 0.01, 0.04]},
      {test: p => p.name === 'Vomer', offset: () => [0, -0.03, 0.04]},
      {test: p => p.name === 'Palatine bone', offset: p => [sideSign(p) * 0.02, -0.05, 0.0]},
      {test: p => p.name === 'Inferior nasal concha bone', offset: p => [sideSign(p) * 0.02, -0.02, 0.09]},
      {test: p => p.name === 'Lacrimal bone', offset: p => [sideSign(p) * 0.04, 0.03, 0.09]},
      {test: p => p.name === 'Nasal bone', offset: p => [sideSign(p) * 0.01, 0.04, 0.14]},
      {test: p => /Nasal cartilages/.test(p.path), offset: p => [sideSign(p) * 0.02, -0.01, 0.20]},
      {test: p => p.name === 'Zygomatic bone', offset: p => [sideSign(p) * 0.10, 0.0, 0.07]},
      {test: p => p.name === 'Maxilla', offset: p => [sideSign(p) * 0.03, -0.03, 0.11]},
      {test: p => /^Upper /.test(p.name), offset: p => [sideSign(p) * 0.03, -0.08, 0.12]},
      {test: p => p.name === 'Mandible', offset: () => [0, -0.17, 0.06]},
      {test: p => /^Lower /.test(p.name), offset: p => [sideSign(p) * 0.02, -0.12, 0.08]},
      {test: p => p.name === 'Hyoid bone', offset: () => [0, -0.24, 0.04]},
      {test: () => true, offset: (p, c) => radial(p, c, 0.08)}],
    landmarks: [{label: 'FRONTAL BONE', piece: 'Frontal bone'}, {label: 'PARIETAL BONE', piece: 'Parietal bone', side: 'L'}, {label: 'TEMPORAL BONE', piece: 'Temporal bone', side: 'L'}, {label: 'MAXILLA', piece: 'Maxilla', side: 'L'}, {label: 'MANDIBLE', piece: 'Mandible'}, {label: 'SPHENOID', piece: 'Sphenoid bone'}, {label: 'OSSICLES', piece: 'Malleus', side: 'L'}],
    description: 'The vault lifts away bone by bone: frontal forward and up, parietals to the sides, occipital back. The sphenoid stays at the centre as the keystone. The facial bones and nasal cartilages come forward, the maxillae carry the upper teeth, the mandible drops with the lower teeth, and the three ossicles pull out of each temporal bone.'
  },
  eye: {
    title: 'The eye', eyebrow: 'CORNEA · IRIS · LENS · RETINA · SCLERA', files: ['brain'], color: '#cfe8f5',
    paired: true,
    match: (p, side = 'L') => p.file === 'brain' && p.side === side && /Eye/.test(p.path),
    view: [1.5, 0.45, 0.75], padding: 1.12, scale: 1,
    primary: p => /^(Cornea|Lens|Vitreous body|Sclera|Iris|Retina)$/.test(p.name),
    layers: [
      {test: p => p.name === 'Cornea', offset: () => [0, 0, 0.085]},
      {test: p => p.name === 'Anterior chamber of eyeball', offset: () => [0, 0, 0.068], opacity: 0.3},
      {test: p => p.name === 'Iris', offset: () => [0, 0, 0.052]},
      {test: p => p.name === 'Lens', offset: () => [0, 0, 0.036]},
      {test: p => p.name === 'Zonular fibres', offset: () => [0, 0, 0.030]},
      {test: p => p.name === 'Anterior segment of eyeball', offset: () => [0, 0, 0.018], opacity: 0.25},
      {test: p => p.name === 'Vitreous body', offset: () => [0, 0, -0.004], opacity: 0.35},
      {test: p => p.name === 'Retina', offset: () => [0, 0, -0.034]},
      {test: p => p.name === 'Sclera', offset: () => [0, 0, -0.068]},
      {test: p => p.name === 'Posterior segment of eyeball', offset: () => [0, 0, -0.095], opacity: 0.25},
      {test: p => p.name === 'Lacrimal apparatus', offset: () => [0.05, 0.03, 0.02]},
      {test: () => true, offset: () => [0, 0, 0]}],
    landmarks: [{label: 'CORNEA', piece: 'Cornea', side: 'L'}, {label: 'IRIS', piece: 'Iris', side: 'L'}, {label: 'LENS', piece: 'Lens', side: 'L'}, {label: 'VITREOUS BODY', piece: 'Vitreous body', side: 'L'}, {label: 'RETINA', piece: 'Retina', side: 'L'}, {label: 'SCLERA', piece: 'Sclera', side: 'L'}, {label: 'LACRIMAL APPARATUS', piece: 'Lacrimal apparatus', side: 'L'}],
    description: 'The left eye opens along its optic axis like a lens diagram: cornea, anterior chamber, iris and lens step forward in front of the vitreous, while the retina and sclera fall back behind it. The lacrimal gland, canaliculi and sac sit off to the side.'
  },
  hand: {
    title: 'The hand', eyebrow: '27 BONES · 12 INTRINSIC MUSCLES', files: ['skeletal', 'muscular'], color: '#f0e6c8',
    paired: true,
    match: (p, side = 'L') => p.side === side && ((p.file === 'skeletal' && /free part of upper limb/i.test(p.path) && p.center[1] < 0.86) || (p.file === 'muscular' && /Muscles of hand/.test(p.path))),
    view: [0.7, 0.45, 1.5], padding: 1.3, scale: 1,
    primary: p => /^(Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate) bone$/.test(p.name) || /^(First|Fifth) metacarpal bone$/.test(p.name) || /^Distal phalanx/.test(p.name),
    layers: [
      {test: p => /^(Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate) bone$/.test(p.name), offset: (p, c) => add(radial(p, c.carpal, 0.05), [0, 0.06, -0.02])},
      {test: p => /metacarpal bone/.test(p.name), offset: p => [/First/.test(p.name) ? 0.05 : 0, -0.03, -0.01]},
      {test: p => /^Proximal phalanx/.test(p.name), offset: p => [/first finger/.test(p.name) ? 0.08 : 0, -0.09, 0.0]},
      {test: p => /^Middle phalanx/.test(p.name), offset: () => [0, -0.15, 0.01]},
      {test: p => /^Distal phalanx/.test(p.name), offset: p => [/first finger/.test(p.name) ? 0.10 : 0, -0.21, 0.02]},
      {test: p => /pollicis|Opponens pollicis/.test(p.name), offset: () => [0.10, 0.0, 0.10]},
      {test: p => /digiti minimi/.test(p.name), offset: () => [-0.09, 0.0, 0.09]},
      {test: p => /interossei/.test(p.name), offset: p => [0, 0, /Dorsal/.test(p.name) ? -0.10 : 0.07]},
      {test: p => /Lumbrical/.test(p.name), offset: () => [0, -0.03, 0.13]},
      {test: () => true, offset: () => [0, 0, 0.08]}],
    landmarks: [{label: 'SCAPHOID', piece: 'Scaphoid bone', side: 'L'}, {label: 'CAPITATE', piece: 'Capitate bone', side: 'L'}, {label: 'FIRST METACARPAL', piece: 'First metacarpal bone', side: 'L'}, {label: 'DISTAL PHALANX', piece: 'Distal phalanx of third finger of hand', side: 'L'}, {label: 'THENAR MUSCLES', piece: 'Abductor pollicis brevis', side: 'L'}, {label: 'LUMBRICALS', piece: 'Lumbrical muscles of hand', side: 'L'}],
    description: 'The eight carpal bones fan out from the wrist, the five metacarpals and their phalanges stretch down each digit in three steps, and the thumb swings outward. The intrinsic muscles peel off the palm: thenar group toward the thumb, hypothenar toward the little finger, interossei back and forth, lumbricals out in front.'
  },
  knee: {
    title: 'The knee', eyebrow: 'FEMUR · TIBIA · PATELLA · MENISCI · LIGAMENTS', files: ['skeletal', 'joints'], color: '#d8d1c0',
    paired: true,
    match: (p, side = 'L') => p.side === side && (/Knee joint/.test(p.path) || (p.file === 'skeletal' && /^(Femur|Tibia|Fibula|Patella)$/.test(p.name))),
    view: [1.3, 0.35, 1.2], padding: 1.15, scale: 1,
    frame: p => !/^(Femur|Tibia|Fibula)$/.test(p.name),   // camera frames the joint; the long bones run out of view
    primary: p => /^(Femur|Tibia|Patella|Lateral meniscus|Medial meniscus|Anterior cruciate ligament|Posterior cruciate ligament|Fibular collateral ligament)$/.test(p.name),
    layers: [
      {test: p => p.name === 'Femur', offset: () => [0, 0.14, 0]},
      {test: p => p.name === 'Tibia', offset: () => [0, -0.15, 0]},
      {test: p => p.name === 'Fibula', offset: () => [0.03, -0.15, 0]},
      {test: p => p.name === 'Patella', offset: () => [0, 0.02, 0.11]},
      {test: p => p.name === 'Anterior cruciate ligament', offset: () => [0, 0.01, 0.035]},
      {test: p => p.name === 'Posterior cruciate ligament', offset: () => [0, 0.01, -0.045]},
      {test: p => /Lateral meniscus/.test(p.name), offset: () => [0.075, -0.02, 0]},
      {test: p => /Medial meniscus/.test(p.name), offset: () => [-0.075, -0.02, 0]},
      {test: p => p.name === 'Fibular collateral ligament', offset: () => [0.12, 0, -0.01]},
      {test: p => /tibial collateral ligament/.test(p.name), offset: p => [/Deep/.test(p.name) ? -0.10 : -0.14, 0, 0]},
      {test: p => /Meniscopatellar|fat pad/.test(p.name), offset: () => [0, -0.01, 0.07]},
      {test: p => p.name === 'Knee joint', offset: () => [0, 0, 0], opacity: 0.16},
      {test: () => true, offset: (p, c) => radial(p, c, 0.06)}],
    landmarks: [{label: 'FEMUR', piece: 'Femur', side: 'L'}, {label: 'PATELLA', piece: 'Patella', side: 'L'}, {label: 'ANTERIOR CRUCIATE', piece: 'Anterior cruciate ligament', side: 'L'}, {label: 'LATERAL MENISCUS', piece: 'Lateral meniscus', side: 'L'}, {label: 'MEDIAL MENISCUS', piece: 'Medial meniscus', side: 'L'}, {label: 'TIBIA', piece: 'Tibia', side: 'L'}, {label: 'FIBULAR COLLATERAL', piece: 'Fibular collateral ligament', side: 'L'}],
    description: 'The femur lifts and the tibia and fibula drop, leaving the joint open between them. The two menisci slide apart to either side, the cruciate ligaments separate front and back, the collateral ligaments swing outward, and the patella comes forward off the joint. The capsule stays as a translucent envelope.'
  },
  ribcage: {
    title: 'The rib cage', eyebrow: '24 RIBS · COSTAL CARTILAGES · STERNUM', files: ['skeletal'], color: '#f0e6c8',
    match: p => p.file === 'skeletal' && /Thoracic skeleton/.test(p.path),
    view: [1.2, 0.5, 1.5], padding: 1.05, scale: 1,
    primary: p => p.name === 'Body of sternum' || p.name === 'Manubrium of sternum' || (p.side === 'L' && /^(First|Fourth|Seventh|Tenth|Twelfth) rib$/.test(p.name)),
    layers: [
      {test: p => p.name === 'Manubrium of sternum', offset: () => [0, 0.05, 0.18]},
      {test: p => p.name === 'Body of sternum', offset: () => [0, 0, 0.22]},
      {test: p => p.name === 'Xiphoid process', offset: () => [0, -0.05, 0.20]},
      {test: p => /^Costal cartilage/.test(p.name), offset: p => [sideSign(p) * 0.05, -(ribNumber(p.name) - 6.5) * 0.02, 0.10]},
      {test: p => / rib$/.test(p.name), offset: p => [sideSign(p) * (0.10 + ribNumber(p.name) * 0.01), -(ribNumber(p.name) - 6.5) * 0.02, -0.02]},
      {test: () => true, offset: (p, c) => radial(p, c, 0.08)}],
    landmarks: [{label: 'MANUBRIUM', piece: 'Manubrium of sternum'}, {label: 'BODY OF STERNUM', piece: 'Body of sternum'}, {label: 'FIRST RIB', piece: 'First rib', side: 'L'}, {label: 'SEVENTH RIB', piece: 'Seventh rib', side: 'L'}, {label: 'TWELFTH RIB', piece: 'Twelfth rib', side: 'L'}, {label: 'COSTAL CARTILAGE', piece: 'Costal cartilage of fifth rib', side: 'L'}],
    description: 'The twelve pairs of ribs swing outward from the spine, upper ribs rising and lower ribs dropping so each pair has room, with the costal cartilages carried forward between them. The manubrium, body and xiphoid process of the sternum lift clear in front.'
  },
  digestive: {
    title: 'The digestive tract', eyebrow: 'MOUTH TO RECTUM · LIVER · PANCREAS · GLANDS', files: ['visceral'], color: '#cc8f7f',
    match: p => p.file === 'visceral' && /Digestive/.test(p.path) && p.name !== 'Liver',
    view: [1.1, 0.5, 1.6], padding: 1.05, scale: 1,
    primary: p => /^(Stomach|Oesophagus|Ascending colon|Descending colon|Sigmoid colon|Gallbladder|Pancreas|Tongue|Duodenum)$/.test(p.name),
    layers: [
      {test: p => /salivary/.test(p.path), offset: p => [sideSign(p) * 0.12, 0.12, 0.04]},
      {test: p => /Mouth/.test(p.path), offset: () => [0, 0.14, 0.10]},
      {test: p => /Pharynx/.test(p.path), offset: () => [0, 0.08, -0.06]},
      {test: p => p.name === 'Oesophagus', offset: () => [0, 0.04, -0.14]},
      {test: p => p.name === 'Stomach', offset: () => [0.18, 0.02, 0.10]},
      {test: p => p.name === 'Duodenum', offset: () => [-0.04, -0.02, 0.16]},
      {test: p => p.name === 'Jejunum', offset: () => [0.02, -0.08, 0.26]},
      {test: p => p.name === 'Ascending colon', offset: () => [-0.24, -0.02, 0.06]},
      {test: p => p.name === 'Vermiform appendix', offset: () => [-0.26, -0.10, 0.06]},
      {test: p => p.name === 'Transverse colon', offset: () => [0, 0.10, 0.30]},
      {test: p => p.name === 'Descending colon', offset: () => [0.26, -0.02, 0.06]},
      {test: p => p.name === 'Sigmoid colon', offset: () => [0.04, -0.18, 0.12]},
      {test: p => /Taeniae/.test(p.path), offset: () => [0, -0.04, -0.12], opacity: 0.3},
      {test: p => /segment of liver/.test(p.name), offset: (p, c) => add([-0.20, 0.14, 0.02], radial(p, c.liver, 0.07))},
      {test: p => p.name === 'Gallbladder', offset: () => [-0.18, 0.0, 0.16]},
      {test: p => p.name === 'Bile duct', offset: () => [-0.12, 0.02, 0.14]},
      {test: p => p.name === 'Pancreas', offset: () => [0.06, -0.03, -0.14]},
      {test: p => /Pancreas/.test(p.path), offset: () => [0.06, -0.03, -0.20]},
      {test: () => true, offset: (p, c) => radial(p, c, 0.12)}],
    landmarks: [{label: 'TONGUE', piece: 'Tongue'}, {label: 'OESOPHAGUS', piece: 'Oesophagus'}, {label: 'STOMACH', piece: 'Stomach'}, {label: 'LIVER · SEGMENT VIII', piece: 'Posterior medial segment of liver (VIII)'}, {label: 'PANCREAS', piece: 'Pancreas'}, {label: 'JEJUNUM', piece: 'Jejunum'}, {label: 'TRANSVERSE COLON', piece: 'Transverse colon'}, {label: 'SIGMOID COLON', piece: 'Sigmoid colon'}],
    description: 'The tract unwinds in order: mouth and salivary glands up, pharynx and oesophagus back, the stomach to the left, duodenum and jejunum forward, and the colon spread around the outside from the appendix to the sigmoid. The liver opens into its eight segments with the gallbladder and bile duct beside it, and the pancreas with its ducts drops back behind the stomach.'
  },
  urinary: {
    title: 'The urinary system', eyebrow: 'KIDNEYS · URETERS · BLADDER · ADRENALS', files: ['visceral'], color: '#7d3038',
    match: p => p.file === 'visceral' && (/Urinary/.test(p.path) || p.name === 'Suprarenal gland'),
    view: [1.0, 0.45, 1.6], padding: 1.08, scale: 1,
    primary: p => /^(Kidney|Urinary bladder|Urethra|Suprarenal gland)$/.test(p.name),
    layers: [
      {test: p => p.name === 'Suprarenal gland', offset: p => [sideSign(p) * 0.10, 0.12, 0.02]},
      {test: p => p.name === 'Kidney', offset: p => [sideSign(p) * 0.16, 0.02, 0.04]},
      {test: p => p.name === 'Renal pelvis', offset: p => [sideSign(p) * 0.16, 0.02, 0.13]},
      {test: p => p.name === 'Ureter', offset: p => [sideSign(p) * 0.08, -0.04, 0.10]},
      {test: p => p.name === 'Urinary bladder', offset: () => [0, -0.14, 0.12]},
      {test: p => p.name === 'Urethra', offset: () => [0, -0.26, 0.16]},
      {test: () => true, offset: (p, c) => radial(p, c, 0.10)}],
    landmarks: [{label: 'LEFT KIDNEY', piece: 'Kidney', side: 'L'}, {label: 'RENAL PELVIS', piece: 'Renal pelvis', side: 'L'}, {label: 'ADRENAL GLAND', piece: 'Suprarenal gland', side: 'R'}, {label: 'URETER', piece: 'Ureter', side: 'R'}, {label: 'BLADDER', piece: 'Urinary bladder'}, {label: 'URETHRA', piece: 'Urethra'}],
    description: 'The kidneys move apart to either side with the adrenal glands lifted off their upper poles, the renal pelvis drawn forward out of each hilum, the ureters running down to the bladder, and the bladder and urethra dropping forward out of the pelvis.'
  },
  face: {
    title: 'Muscles of the face', eyebrow: 'EXPRESSION · MASTICATION · EPICRANIUS', files: ['muscular', 'skeletal'], color: '#e07a7a',
    match: p => (p.file === 'muscular' && /Facial muscles|Masticatory muscles|Epicranius muscle/.test(p.path)) || (p.file === 'skeletal' && /^(Frontal bone|Maxilla|Zygomatic bone|Mandible|Nasal bone|Parietal bone|Temporal bone|Occipital bone|Sphenoid bone)$/.test(p.name)),
    view: [1.0, 0.35, 1.5], padding: 1.08, scale: 1,
    frame: p => p.file === 'muscular' || /^(Frontal bone|Maxilla|Mandible)$/.test(p.name),
    primary: p => p.side === 'L' && /^(Temporalis muscle|Superficial part of masseter|Frontalis muscle|Orbicularis oris muscle|Zygomaticus major muscle|Bucinator|Occipitalis muscle)$/.test(p.name),
    layers: [
      {test: p => p.file === 'skeletal', offset: () => [0, 0, -0.06]},
      {test: p => /Temporalis/.test(p.name), offset: p => [sideSign(p) * 0.14, 0.10, -0.02]},
      {test: p => /masseter/.test(p.name), offset: p => [sideSign(p) * 0.15, -0.03, /Deep/.test(p.name) ? 0.03 : 0.07]},
      {test: p => /pterygoid/.test(p.name), offset: p => [sideSign(p) * 0.10, -0.06, -0.02]},
      {test: p => /Frontalis|Epicranius|Temporoparietalis/.test(p.name), offset: p => [sideSign(p) * 0.06, 0.16, 0.06]},
      {test: p => /Occipitalis/.test(p.name), offset: p => [sideSign(p) * 0.06, 0.10, -0.12]},
      {test: p => /orbicularis oculi|Corrugator|Procerus/.test(p.name), offset: p => [sideSign(p) * 0.08, 0.08, 0.13]},
      {test: p => /Nasalis|septi nasi|nasolabialis/.test(p.name), offset: p => [sideSign(p) * 0.04, 0.02, 0.16]},
      {test: p => /Zygomaticus|Levator labii|Levator anguli|Risorius/.test(p.name), offset: p => [sideSign(p) * 0.11, 0.0, 0.13]},
      {test: p => /Orbicularis oris|Bucinator|Depressor|Mentalis/.test(p.name), offset: p => [sideSign(p) * 0.07, -0.08, 0.14]},
      {test: () => true, offset: (p, c) => add(radial(p, c, 0.10), [0, 0, 0.08])}],
    landmarks: [{label: 'TEMPORALIS', piece: 'Temporalis muscle', side: 'L'}, {label: 'MASSETER', piece: 'Superficial part of masseter', side: 'L'}, {label: 'FRONTALIS', piece: 'Frontalis muscle', side: 'L'}, {label: 'ORBICULARIS OCULI', piece: 'Orbital part of orbicularis oculi', side: 'L'}, {label: 'ZYGOMATICUS MAJOR', piece: 'Zygomaticus major muscle', side: 'L'}, {label: 'ORBICULARIS ORIS', piece: 'Orbicularis oris muscle'}, {label: 'BUCINATOR', piece: 'Bucinator', side: 'L'}],
    description: 'The muscles of expression lift off the face in the layers they occupy: the scalp muscles up, the muscles of the eye and nose forward, the cheek and mouth muscles forward and down. The chewing muscles, temporalis and masseter on the surface and the pterygoids beneath, swing out to the sides. The skull stays behind as a reference.'
  },
  aorta: {
    title: 'The aorta', eyebrow: 'ARCH · THORACIC · ABDOMINAL · BRANCHES', files: ['heart', 'vessels'], color: '#c8403f',
    match: p => (p.file === 'heart' && /^(Ascending aorta|Aortic arch)$/.test(p.name)) || (p.file === 'vessels' && /Aorta/.test(p.path)),
    view: [1.2, 0.35, 1.5], padding: 1.05, scale: 1,
    primary: p => /^(Ascending aorta|Aortic arch|Thoracic aorta|Abdominal aorta|Brachiocephalic trunk|Coeliac trunk|Superior mesenteric artery|Inferior mesenteric artery)$/.test(p.name) || (p.side === 'L' && /^(Common iliac artery|Left renal artery)$/.test(p.name)),
    layers: [
      {test: p => /^(Ascending aorta|Aortic arch|Thoracic aorta|Abdominal aorta)$/.test(p.name), offset: () => [0, 0, 0]},
      {test: p => p.name === 'Brachiocephalic trunk', offset: () => [-0.08, 0.08, 0.02]},
      {test: p => /^Common iliac artery$/.test(p.name), offset: p => [sideSign(p) * 0.06, -0.10, 0.02]},
      {test: p => /iliac|gluteal|pudendal|Obturator|Iliolumbar|epigastric|sacral/.test(p.name), offset: p => [sideSign(p) * 0.12, -0.14, 0.02]},
      {test: p => /Coeliac|gastric|hepatic|Splenic|Gastroduodenal/.test(p.name), offset: p => [(p.side === 'M' ? 0 : sideSign(p) * 0.06), 0.06, 0.16]},
      {test: p => /mesenteric|colic|Ileocolic|Marginal|Appendicular|Sigmoid|anorectal|pancreaticoduodenal|Ileal/.test(p.name), offset: p => [(p.side === 'M' ? 0 : sideSign(p) * 0.06), -0.02, 0.22]},
      {test: p => /renal|suprarenal|Intrarenal/.test(p.name), offset: p => [sideSign(p) * 0.14, 0.0, 0.0]},
      {test: p => /testicular|ovarian|Lumbar|Subcostal|intercostal|phrenic/.test(p.name), offset: p => [sideSign(p) * 0.10, 0, -0.06]},
      {test: () => true, offset: (p, c) => radial(p, c, 0.10)}],
    landmarks: [{label: 'ASCENDING AORTA', piece: 'Ascending aorta'}, {label: 'AORTIC ARCH', piece: 'Aortic arch'}, {label: 'THORACIC AORTA', piece: 'Thoracic aorta'}, {label: 'COELIAC TRUNK', piece: 'Coeliac trunk'}, {label: 'RENAL ARTERY', piece: 'Left renal artery', side: 'L'}, {label: 'ABDOMINAL AORTA', piece: 'Abdominal aorta'}, {label: 'COMMON ILIAC', piece: 'Common iliac artery', side: 'L'}],
    description: 'The aorta itself stays as the trunk from the heart to the pelvis while its branches pull away in the direction they serve: the brachiocephalic trunk up, the renal arteries out to the kidneys, the coeliac and mesenteric trees forward to the gut, the segmental arteries back to the body wall, and the iliac system down into the pelvis.'
  },
  pelvis: {
    title: 'The pelvis', eyebrow: 'HIP BONES · SACRUM · COCCYX · JOINTS', files: ['skeletal', 'joints'], color: '#f0e6c8',
    match: p => (p.file === 'skeletal' && (/pelvic girdle/i.test(p.path) || /^(Sacrum|Coccyx)$/.test(p.name))) || (p.file === 'joints' && /pelvic girdle|Pubic symphysis|Sacro-iliac/i.test(p.path)),
    view: [1.1, 0.5, 1.4], padding: 1.1, scale: 1,
    primary: p => /^(Hip bone|Sacrum|Coccyx|Interpubic disc)$/.test(p.name),
    layers: [
      {test: p => p.name === 'Hip bone', offset: p => [sideSign(p) * 0.16, 0, 0.02]},
      {test: p => p.name === 'Sacrum', offset: () => [0, 0.06, -0.10]},
      {test: p => p.name === 'Coccyx', offset: () => [0, -0.06, -0.14]},
      {test: p => p.name === 'Interpubic disc', offset: () => [0, -0.06, 0.12]},
      {test: p => /Sacro-iliac/.test(p.name), offset: p => [sideSign(p) * 0.06, 0.08, -0.06], opacity: 0.6},
      {test: p => /Fibrous joints/.test(p.name), offset: p => [sideSign(p) * 0.08, 0.10, -0.02], opacity: 0.6},
      {test: p => /Cartilaginous joints/.test(p.name), offset: p => [sideSign(p) * 0.06, -0.10, 0.06], opacity: 0.6},
      {test: () => true, offset: (p, c) => radial(p, c, 0.10)}],
    landmarks: [{label: 'LEFT HIP BONE', piece: 'Hip bone', side: 'L'}, {label: 'RIGHT HIP BONE', piece: 'Hip bone', side: 'R'}, {label: 'SACRUM', piece: 'Sacrum'}, {label: 'COCCYX', piece: 'Coccyx'}, {label: 'PUBIC SYMPHYSIS', piece: 'Interpubic disc'}, {label: 'SACRO-ILIAC JOINT', piece: 'Sacro-iliac joint', side: 'L'}],
    description: 'The two hip bones swing outward from the sacrum, which lifts back with the coccyx below it. The pubic symphysis drops forward between the hip bones and the sacro-iliac and pelvic ligaments lift clear as translucent bands.'
  },
  shoulder: {
    title: 'The shoulder', eyebrow: 'SCAPULA · CLAVICLE · HUMERUS · ROTATOR CUFF', files: ['skeletal', 'joints', 'muscular'], color: '#e07a7a', paired: true,
    match: (p, side = 'L') => p.side === side && ((p.file === 'skeletal' && /^(Scapula|Clavicle|Humerus)$/.test(p.name)) || (p.file === 'joints' && /pectoral girdle|Acromioclavicular|Sternoclavicular|Glenohumeral/i.test(p.path)) || (p.file === 'muscular' && /Rotator cuff|Deltoid muscle|Scapulohumeral/.test(p.path))),
    view: [1.4, 0.5, 1.2], padding: 1.15, scale: 1,
    frame: p => p.name !== 'Humerus',
    primary: p => /^(Scapula|Clavicle|Humerus|Supraspinatus muscle|Infraspinatus muscle|Subscapularis muscle|Acromial part of deltoid muscle)$/.test(p.name),
    layers: [
      {test: p => p.name === 'Scapula', offset: () => [-0.05, 0, -0.06]},
      {test: p => p.name === 'Clavicle', offset: () => [0, 0.10, 0.06]},
      {test: p => p.name === 'Humerus', offset: () => [0.18, -0.08, 0]},
      {test: p => /Supraspinatus/.test(p.name), offset: () => [0.02, 0.16, -0.04]},
      {test: p => /Infraspinatus/.test(p.name), offset: () => [0.02, -0.02, -0.18]},
      {test: p => /Teres minor/.test(p.name), offset: () => [0.08, -0.08, -0.16]},
      {test: p => /Teres major/.test(p.name), offset: () => [0.06, -0.16, -0.12]},
      {test: p => /Subscapularis/.test(p.name), offset: () => [0.0, -0.04, 0.16]},
      {test: p => /Acromial part of deltoid/.test(p.name), offset: () => [0.24, 0.04, 0]},
      {test: p => /Clavicular part of deltoid/.test(p.name), offset: () => [0.18, 0.06, 0.14]},
      {test: p => /spinal part of deltoid/.test(p.name), offset: () => [0.18, 0.04, -0.14]},
      {test: p => /Acromioclavicular/.test(p.name), offset: () => [0.04, 0.16, 0.0], opacity: 0.7},
      {test: p => /Sternoclavicular/.test(p.name), offset: () => [-0.06, 0.12, 0.10], opacity: 0.7},
      {test: p => p.file === 'joints', offset: () => [0.06, 0.08, 0.04], opacity: 0.6},
      {test: () => true, offset: (p, c) => radial(p, c, 0.10)}],
    landmarks: [{label: 'SCAPULA', piece: 'Scapula'}, {label: 'CLAVICLE', piece: 'Clavicle'}, {label: 'HUMERUS', piece: 'Humerus'}, {label: 'SUPRASPINATUS', piece: 'Supraspinatus muscle'}, {label: 'INFRASPINATUS', piece: 'Infraspinatus muscle'}, {label: 'SUBSCAPULARIS', piece: 'Subscapularis muscle'}, {label: 'DELTOID', piece: 'Acromial part of deltoid muscle'}],
    description: 'The humerus swings out of the glenoid, the clavicle lifts, and the four rotator-cuff muscles peel away in the directions they act: supraspinatus up, infraspinatus and teres minor back, subscapularis forward. The three parts of the deltoid open as a cap around the joint, with the capsule and ligaments translucent between them.'
  },
  larynx: {
    title: 'The larynx', eyebrow: 'CARTILAGES · MUSCLES · MEMBRANES · AIRWAY', files: ['skeletal', 'joints', 'muscular', 'visceral'], color: '#dfe7e3',
    match: p => /Laryngeal/.test(p.path) || /Thyrohyoid|Fibro-elastic membrane|Crico-arytenoid joint|Cricothyroid joint|Fibrous joints of larynx|Ligaments of epiglottis/.test(p.path) || /^(Epiglottis|Hyoid bone|Thyroid gland)$/.test(p.name),
    view: [1.2, 0.35, 1.4], padding: 1.12, scale: 1,
    primary: p => /^(Thyroid cartilage|Cricoid cartilage|Epiglottis|Hyoid bone|Thyroid gland)$/.test(p.name) || (p.side === 'L' && /^(Arytenoid cartilage)$/.test(p.name)),
    layers: [
      {test: p => p.name === 'Hyoid bone', offset: () => [0, 0.09, 0.02]},
      {test: p => p.name === 'Epiglottis', offset: () => [0, 0.07, 0.06]},
      {test: p => p.name === 'Thyroid cartilage', offset: () => [0, 0.01, 0.08]},
      {test: p => p.name === 'Cricoid cartilage', offset: () => [0, -0.06, 0.02]},
      {test: p => /Arytenoid cartilage|Corniculate/.test(p.name), offset: p => [sideSign(p) * 0.05, 0.02, -0.05]},
      {test: p => p.name === 'Thyroid gland', offset: () => [0, -0.10, 0.12]},
      {test: p => /Thyrohyoid membrane/.test(p.name), offset: p => [sideSign(p) * 0.07, 0.06, 0.03], opacity: 0.6},
      {test: p => /Fibro-elastic membrane|Fibrous joints of larynx/.test(p.name), offset: p => [sideSign(p) * 0.09, 0.0, 0.02], opacity: 0.6},
      {test: p => /cricothyroid muscle/.test(p.name), offset: p => [sideSign(p) * 0.08, -0.04, 0.06]},
      {test: p => /Posterior crico-arytenoid/.test(p.name), offset: p => [sideSign(p) * 0.06, -0.03, -0.09]},
      {test: p => /Lateral crico-arytenoid/.test(p.name), offset: p => [sideSign(p) * 0.09, -0.02, -0.03]},
      {test: p => /thyro-arytenoid|Thyro-epiglottic/.test(p.name), offset: p => [sideSign(p) * 0.08, 0.02, 0.0]},
      {test: p => /arytenoid muscle|Ary-epiglottic/.test(p.name), offset: p => [sideSign(p) * 0.04, 0.05, -0.08]},
      {test: p => /Crico-arytenoid joint/.test(p.name), offset: p => [sideSign(p) * 0.05, -0.02, -0.06], opacity: 0.6},
      {test: () => true, offset: (p, c) => radial(p, c, 0.08)}],
    landmarks: [{label: 'HYOID BONE', piece: 'Hyoid bone'}, {label: 'EPIGLOTTIS', piece: 'Epiglottis'}, {label: 'THYROID CARTILAGE', piece: 'Thyroid cartilage'}, {label: 'CRICOID CARTILAGE', piece: 'Cricoid cartilage'}, {label: 'ARYTENOID', piece: 'Arytenoid cartilage', side: 'L'}, {label: 'THYROID GLAND', piece: 'Thyroid gland'}, {label: 'CRICOTHYROID', piece: 'Straight part of cricothyroid muscle', side: 'L'}],
    description: 'The voice box opens top to bottom: hyoid bone and epiglottis up, thyroid cartilage forward, cricoid down, the paired arytenoids back. The intrinsic muscles that tension and open the vocal folds fan out to the sides with the membranes translucent between them, and the thyroid gland drops forward off the front of the airway.'
  },
  foot: {
    title: 'The foot', eyebrow: '26 BONES · SESAMOIDS · INTRINSIC MUSCLES', files: ['skeletal', 'muscular'], color: '#f0e6c8', paired: true,
    match: (p, side = 'L') => p.side === side && ((p.file === 'skeletal' && /free part of lower limb/i.test(p.path) && p.center[1] < 0.12) || (p.file === 'muscular' && /Muscles of foot|Adductor hallucis|Flexor hallucis brevis/.test(p.path))),
    view: [0.9, 0.7, 1.3], padding: 0.98, scale: 1,
    primary: p => /^(Talus|Calcaneus|Navicular bone|Cuboid bone|Medial cuneiform bone|Intermediate cuneiform bone|Lateral cuneiform bone)$/.test(p.name) || /^(First|Fifth) metatarsal bone$/.test(p.name) || /^Distal phalanx/.test(p.name),
    layers: [
      {test: p => p.name === 'Talus', offset: () => [0, 0.10, -0.02]},
      {test: p => p.name === 'Calcaneus', offset: () => [0, -0.02, -0.12]},
      {test: p => p.name === 'Navicular bone', offset: () => [-0.03, 0.08, 0.02]},
      {test: p => p.name === 'Cuboid bone', offset: () => [0.06, 0.04, -0.02]},
      {test: p => /cuneiform bone/.test(p.name), offset: p => [/Medial/.test(p.name) ? -0.05 : /Lateral/.test(p.name) ? 0.05 : 0, 0.07, 0.03]},
      {test: p => /metatarsal bone/.test(p.name), offset: p => [/First/.test(p.name) ? -0.05 : /Fifth/.test(p.name) ? 0.05 : 0, 0.02, 0.09]},
      {test: p => /^Proximal phalanx/.test(p.name), offset: p => [toeSpread(p.name) * 0.5, 0.0, 0.17]},
      {test: p => /^Middle phalanx/.test(p.name), offset: p => [toeSpread(p.name) * 0.8, 0.0, 0.23]},
      {test: p => /^Distal phalanx/.test(p.name), offset: p => [toeSpread(p.name), 0.0, /first finger/.test(p.name) ? 0.24 : 0.29]},
      {test: p => /Sesamoid/.test(p.name), offset: () => [-0.06, -0.05, 0.06]},
      {test: p => /Extensor/.test(p.name), offset: () => [0, 0.12, 0.08]},
      {test: p => /interossei/.test(p.name), offset: p => [0, /Dorsal/.test(p.name) ? 0.08 : -0.06, 0.10]},
      {test: p => /hallucis|Abductor hallucis/.test(p.name), offset: () => [-0.12, -0.06, 0.06]},
      {test: p => /digiti minimi/.test(p.name), offset: () => [0.12, -0.06, 0.04]},
      {test: p => /Quadratus plantae|Flexor digitorum brevis|Lumbrical/.test(p.name), offset: () => [0, -0.12, 0.04]},
      {test: () => true, offset: () => [0, -0.10, 0.06]}],
    landmarks: [{label: 'TALUS', piece: 'Talus'}, {label: 'CALCANEUS', piece: 'Calcaneus'}, {label: 'NAVICULAR', piece: 'Navicular bone'}, {label: 'FIRST METATARSAL', piece: 'First metatarsal bone'}, {label: 'DISTAL PHALANX', piece: 'Distal phalanx of first finger of foot'}, {label: 'ABDUCTOR HALLUCIS', piece: 'Abductor hallucis'}, {label: 'FLEXOR DIGITORUM BREVIS', piece: 'Flexor digitorum brevis'}],
    description: 'The talus lifts off the calcaneus, the midfoot bones spread apart in the arch, and the metatarsals and phalanges run forward along each toe in steps. The extensor muscles rise off the top of the foot and the plantar layers drop away beneath it, from the deep interossei to the superficial flexor digitorum brevis.'
  }
};

/** Whole-body labels shown with the Labels toggle: one landmark per loaded file, anchored on a representative piece. */
export const bodyLandmarks = [
  {label: 'SKELETON', file: 'skeletal', piece: 'Sternum'}, {label: 'SKELETON', file: 'skeletal', piece: 'Body of sternum'},
  {label: 'LIGAMENTS & DISCS', file: 'joints', piece: 'Anterior longitudinal ligament'},
  {label: 'VISCERA', file: 'visceral', piece: 'Liver'}, {label: 'THE HEART', file: 'heart', piece: 'Left ventricle'},
  {label: 'THE BRAIN', file: 'brain', piece: 'Corpus callosum'}, {label: 'MUSCLES', file: 'muscular', piece: 'Rectus abdominis', side: 'L'},
  {label: 'ARTERIES & VEINS', file: 'vessels', piece: 'Abdominal aorta'}, {label: 'NERVES', file: 'nerves', piece: 'Sciatic nerve', side: 'L'},
  {label: 'LYMPHATICS', file: 'lymphoid', piece: 'Spleen'}, {label: 'SURFACE REGIONS', file: 'regions', piece: 'Regions of abdomen', side: 'L'}
];

/** Resolve members and compute the assembly context (centre, axis) from piece records. */
export function assemblyContext(assembly, members) {
  const n = Math.max(members.length, 1);
  const center = members.reduce((a, p) => [a[0] + p.center[0] / n, a[1] + p.center[1] / n, a[2] + p.center[2] / n], [0, 0, 0]);
  let axis = [0, 1, 0];
  if (assembly.axis === 'spine') {
    const top = members.find(p => /^Atlas/.test(p.name)), bottom = members.find(p => p.name === 'Sacrum');
    if (top && bottom) { const v = [top.center[0] - bottom.center[0], top.center[1] - bottom.center[1], top.center[2] - bottom.center[2]], l = Math.hypot(...v) || 1; axis = v.map(x => x / l); }
  }
  const carpal = centroid(members.filter(p => /^(Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate) bone$/.test(p.name)));
  const liver = centroid(members.filter(p => /segment of liver/.test(p.name)));
  return {center, axis, carpal: members.some(p => /Capitate bone/.test(p.name)) ? carpal : center, liver: members.some(p => /segment of liver/.test(p.name)) ? liver : center};
}
/** Offsets are authored for the left side of a paired study; the right side mirrors x. */
export function assemblyOffset(assembly, p, ctx, side = 'L') { const s = assembly.scale ?? 1; const mirror = assembly.paired && side === 'R' ? -1 : 1; for (const layer of assembly.layers) if (layer.test(p)) { const o = scale(layer.offset(p, ctx), s); return {offset: [o[0] * mirror, o[1], o[2]], opacity: layer.opacity}; } return {offset: [0, 0, 0]}; }
