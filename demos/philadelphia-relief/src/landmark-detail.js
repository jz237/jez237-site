// Original low-polygon architectural studies. Small ornaments are illustrative,
// not measured masonry. Main heights and footprints retain the existing sources.
export const DETAIL_NOTES = {
  'independence-hall': { size: 280,
    text: 'Window surrounds, chimneys and a stepped belfry. Steeple about 51 m; details schematic.',
    url: 'https://www.nps.gov/places/steeple-of-independence-hall.htm' },
  'museum-of-art': { size: 450,
    text: 'Columned porticos, capitals, terraces and roof cornices. Architectural study; dimensions rounded.',
    url: 'https://press.philamuseum.org/new-master-plan-designed-by-frank-gehry-2014/' },
  'city-hall': { size: 440,
    text: 'Pavilion dormers, stone pilasters, slate roofs and a simplified bronze Penn silhouette. '
      + '548 ft overall.',
    url: 'https://www.asce.org/about-civil-engineering/history-and-heritage/'
      + 'historic-landmarks/philadelphia-city-hall/' },
};

export function detailedLandmarks(doc, id) {
  return { ...doc, models: doc.models.map(model => {
    if (model.id !== id || !DETAIL_NOTES[id]) return model;
    const parts = model.parts.map(p => ({ ...p }));
    const box = (x, z, w, d, h, base, rot = 0) => parts.push({ type: 'box', x, z, w, d, h, base, rot });
    if (id === 'independence-hall') {
      // Narrow protruding surrounds stay outside the existing wall faces.
      for (const z of [-8.15, 8.15]) for (const x of [-12, -6, 0, 6, 12]) {
        for (const y of [2.5, 8.2]) {
          box(x - 1.15, z, .24, .35, 3.5, y); box(x + 1.15, z, .24, .35, 3.5, y);
          box(x, z, 2.55, .42, .3, y + 3.5); box(x, z, 2.55, .5, .3, y);
        }
      }
      for (const x of [-13, 13]) box(x, 0, 2, 2.8, 7, 16);
      for (const base of [20, 25, 30, 33]) box(0, 4, 9.6, 9.6, .6, base);
      for (const x of [-3.8, 3.8]) for (const z of [.2, 7.8]) box(x, z, .55, .55, 8, 25);
    } else if (id === 'museum-of-art') {
      const angle = 40 * Math.PI / 180;
      const rotate = (x, z) => [x * Math.cos(angle) - z * Math.sin(angle),
        x * Math.sin(angle) + z * Math.cos(angle)];
      for (const z of [-28, 28]) for (const x of [-26, -18.5, -11, -3.5, 3.5, 11, 18.5, 26]) {
        const [cx, cz] = rotate(x, z);
        parts.push({ type: 'cylinder', x: cx, z: cz, r: 1.05, h: 19, base: 9, segs: 10 });
        box(cx, cz, 2.8, 2.8, .8, 8.4, 40); box(cx, cz, 2.8, 2.8, 1.1, 28, 40);
      }
      for (const z of [-29, 29]) {
        const [x, cz] = rotate(0, z); box(x, cz, 66, 5, 2, 29, 40);
      }
      for (let i = 0; i < 8; i++) {
        const [x, z] = rotate(0, 35 + i * 1.4); box(x, z, 72, 1.5, 8 - i * .85, 0, 40);
      }
    } else {
      const statue=parts.findIndex(p=>p.type==='cylinder'&&p.base===150);
      if(statue>=0){
        // The 37 ft bronze figure is a small architectural silhouette: coat,
        // legs, an extended arm and broad hat, with the original 167 m summit.
        const bronze=[.19,.23,.20,2],stone=[.62,.62,.55,2];
        const figure=[
          {type:'box',x:0,z:-45,w:3.8,d:3.8,h:5.7,base:150,finish:stone},
          ...[-1,1].map(side=>({type:'box',x:side*.75,z:-45,w:.8,d:1.2,h:4,
            base:155.7,finish:bronze})),
          {type:'box',x:0,z:-45,w:3.5,d:2.1,h:5.1,base:158.7,finish:bronze},
          {type:'box',x:2,z:-45,w:.8,d:.9,h:3.6,base:159.2,finish:bronze},
          {type:'box',x:-2.3,z:-45,w:2.4,d:.9,h:1,base:162,finish:bronze},
          {type:'cylinder',x:0,z:-45,r:.9,h:1.4,base:163.8,segs:10,finish:bronze},
          {type:'cylinder',x:0,z:-45,r:2,h:.35,base:165.2,segs:12,finish:bronze},
          {type:'cylinder',x:0,z:-45,r:1.05,h:1.45,base:165.55,segs:12,finish:bronze},
        ];
        parts.splice(statue,1,...figure);
      }
      for (const side of [-1, 1]) for (const x of [-52, -40, -28, -16, 16, 28, 40, 52]) {
        box(x, side * 60.3, 1, .75, 24, 3);
        box(side * 60.3, x, .75, 1, 24, 3);
        for (const y of [6, 14, 22]) {
          box(x + 3.5, side * 60.4, 3.8, .8, .7, y + 3.8);
          box(side * 60.4, x + 3.5, .8, 3.8, .7, y + 3.8);
        }
        parts.push({ type: 'gable', x, z: side * 47, w: 4, d: 5, h: 3, ridge: 2, base: 30 });
      }
    }
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];if(p.finish)continue;
      const ornament=i>=model.parts.length||p.type==='pyramid'||p.h<=3;
      if(p.type==='gable'||id==='city-hall'&&p.type==='pyramid'){
        p.finish=[.18,.23,.25,2];continue;
      }
      p.finish = id === 'independence-hall' && !ornament && (p.base || 0) < 14
        ? [.42, .16, .10, 1] : id === 'museum-of-art'
          ? [.67, .57, .39, ornament ? 2 : 1] : [.70, .68, .60, ornament ? 2 : 1];
    }
    return { ...model, parts, source: model.source + ' ' + DETAIL_NOTES[id].text };
  }) };
}
