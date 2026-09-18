/**
 * Nested exploded views. Dependency-free: imported by the studio, by scripts/anatomy-studio/prepare.mjs (member resolution)
 * and by verify.mjs. Frame: metres, y up, +z anterior, +x subject's left. Offsets are metres at full separation.
 */
const sideSign = p => p.side === 'L' ? 1 : p.side === 'R' ? -1 : (p.center[0] > 0.005 ? 1 : p.center[0] < -0.005 ? -1 : 0);
const add = (...v) => v.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], [0, 0, 0]);
const scale = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const radial = (p, ctx, d, lift = 0) => { const dx = p.center[0] - ctx.center[0], dz = p.center[2] - ctx.center[2], l = Math.hypot(dx, dz) || 1; return [dx / l * d, lift, dz / l * d]; };
const has = (re, p) => re.test(p.name);

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
  return {center, axis};
}
export function assemblyOffset(assembly, p, ctx) { const s = assembly.scale ?? 1; for (const layer of assembly.layers) if (layer.test(p)) return {offset: scale(layer.offset(p, ctx), s), opacity: layer.opacity}; return {offset: [0, 0, 0]}; }
