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
    match: p => p.file === 'brain' && p.side === 'L' && /Eye/.test(p.path),
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
    match: p => p.side === 'L' && ((p.file === 'skeletal' && /free part of upper limb/i.test(p.path) && p.center[1] < 0.86) || (p.file === 'muscular' && /Muscles of hand/.test(p.path))),
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
    match: p => p.side === 'L' && (/Knee joint/.test(p.path) || (p.file === 'skeletal' && /^(Femur|Tibia|Fibula|Patella)$/.test(p.name))),
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
  }};

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
export function assemblyOffset(assembly, p, ctx) { const s = assembly.scale ?? 1; for (const layer of assembly.layers) if (layer.test(p)) return {offset: scale(layer.offset(p, ctx), s), opacity: layer.opacity}; return {offset: [0, 0, 0]}; }
