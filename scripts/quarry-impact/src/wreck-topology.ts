import * as T from 'three';

/** Split long exported triangles before bending. Flat doors and bonnets often
 * contain metre-long diagonals even when their curved trim is densely sampled.
 * Split edges are shared by both neighbours; UV/normal seams stay separate. */
export function wreckTopology(source: T.BufferGeometry, maximumEdge = .16) {
  const attributes = Object.entries(source.attributes).filter(([name]) => name !== 'tangent');
  const arrays = new Map(attributes.map(([name, a]) => [name, Array.from(a.array)]));
  let indices = source.index ? Array.from(source.index.array) : Array.from({length: source.attributes.position.count}, (_, i) => i);
  const positions = arrays.get('position')!;
  for (let pass = 0; pass < 6; pass++) {
    const edges = new Map<string, number>(), next: number[] = [];
    const midpoint = (a: number, b: number) => {
      const key = a < b ? a + ':' + b : b + ':' + a;
      if (edges.has(key)) return edges.get(key)!;
      let length = 0;
      for (let k=0;k<3;k++) length += (positions[a*3+k]-positions[b*3+k]) ** 2;
      if (length <= maximumEdge ** 2) { edges.set(key, -1); return -1; }
      const index = positions.length / 3;
      for (const [name, attr] of attributes) {
        const data = arrays.get(name)!;
        for (let k=0;k<attr.itemSize;k++) data.push((data[a*attr.itemSize+k]+data[b*attr.itemSize+k])*.5);
      }
      edges.set(key,index); return index;
    };
    let split = false;
    for (let i=0;i<indices.length;i+=3) {
      const a=indices[i],b=indices[i+1],c=indices[i+2],ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);
      const mask=(ab>=0?1:0)|(bc>=0?2:0)|(ca>=0?4:0);
      if(mask)split=true;
      switch(mask) {
        case 0: next.push(a,b,c); break;
        case 1: next.push(a,ab,c,ab,b,c); break;
        case 2: next.push(b,bc,a,bc,c,a); break;
        case 4: next.push(c,ca,b,ca,a,b); break;
        case 3: next.push(b,bc,ab,a,ab,c,ab,bc,c); break;
        case 6: next.push(c,ca,bc,b,bc,a,bc,ca,a); break;
        case 5: next.push(a,ab,ca,c,ca,b,ca,ab,b); break;
        case 7: next.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca); break;
      }
    }
    indices=next;
    if(!split)break;
  }
  const geometry = new T.BufferGeometry();
  for (const [name, attr] of attributes) geometry.setAttribute(name,new T.Float32BufferAttribute(arrays.get(name)!,attr.itemSize,attr.normalized));
  geometry.setIndex(indices); geometry.normalizeNormals();
  return geometry;
}
