import assert from 'node:assert/strict';
import {marineBody,gillCover,bodyRadius} from '../MarineAnatomy.ts';
for(const shape of [{h:.32,w:.095},{h:.35,w:.09},{h:.21,w:.12},{h:.16,w:.075}]){
 const g=marineBody(shape),p=g.getAttribute('position'),n=g.getAttribute('normal');
 for(let i=0;i<p.count;i++)assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)+n.getX(i)+n.getY(i)+n.getZ(i)));
 for(let ring=0;ring<=64;ring++){const a=ring*41,b=a+40;for(const component of ['getX','getY','getZ'])assert.ok(Math.abs(n[component](a)-n[component](b))<1e-6,'smooth normals across the cheek seam');}
 for(const side of [-1,1]){const cover=gillCover(shape,side),norm=cover.getAttribute('normal');for(let i=0;i<norm.count;i++)assert.ok(norm.getZ(i)*side>0,'gill cover must face outward');cover.dispose();}
 g.dispose();
}
for(let t=0;t<=1;t+=.001)assert.ok(bodyRadius(t)>0&&bodyRadius(t)<1.04,'smooth positive body profile');
console.log('Marine fish geometry passed: closed body, smooth cheek seam and outward gills.');
