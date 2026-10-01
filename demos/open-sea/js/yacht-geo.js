// Blender-built 52 m schooner. +x bow, +y up, +z starboard.
export const MAT={HULL:0,DECK:1,CABIN:2,GLASS:3,TEAK:4,ALU:5,SAIL:6,STEEL:7,ROPE:8,KEEL:9,TRIM:10,BRASS:11,RUBBER:12,SCREEN:13,CANVAS:14,WOOD:15,SAFETY:16,COMPASS:17,LAMP:18,PORTLIGHT:19,STARBOARDLIGHT:20};
export const DIM={LOA:52,HULL_LEN:47,BEAM:9.3,DECK_H:2.6,DRAFT:6.65,MAST_X:-12.7,MAST_H:36.5};
export const SAILS=[];
export const sheer=x=>2.6+(x>0?.0018:.0007)*x*x;
export function halfBeam(x){return x>=-2?4.65*Math.pow(Math.max(0,1-Math.pow(Math.max(0,(x+2)/25.5),2.1)),.7):4.65*(1-.4*Math.pow(Math.min(1,(-2-x)/21.5),2.4));}
export const waterlineHalfBeam=x=>halfBeam(x)*.91;
let geometry;
export async function loadYachtGeometry(){
 const root=new URL('../assets/',import.meta.url);
 const [mr,br]=await Promise.all([fetch(new URL('schooner.json?v=deck-wash-20260930-r2',root)),fetch(new URL('schooner.bin.gz?v=deck-wash-20260930-r2',root))]);
 if(!mr.ok||!br.ok)throw new Error('The schooner model could not be loaded. Refresh to try again.');
 const metadata=await mr.json();
 if(metadata.version!==2||metadata.vertexStride!==44||metadata.masts!==3)throw new Error('Unsupported schooner asset.');
 const buffer=await new Response(br.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(),groups={};
 for(const [name,g] of Object.entries(metadata.groups)){
  if(g.vertexOffset+g.vertexCount*44>buffer.byteLength||g.indexOffset+g.indexCount*4>buffer.byteLength)throw new Error('Incomplete schooner geometry.');
  groups[name]={verts:new Float32Array(buffer,g.vertexOffset,g.vertexCount*11),idx:new Uint32Array(buffer,g.indexOffset,g.indexCount)};
 }
 SAILS.push(...metadata.sails);
 geometry={hull:groups.hull,rig:groups.rig,sails:SAILS.map(S=>({S,mesh:groups[S.id],boom:S.boom?groups[S.boom]:null})),metadata};
 return metadata;
}
export function buildYacht(){if(!geometry)throw new Error('Load the schooner first.');return geometry;}
export function buildRigging(){return new Float32Array(geometry.metadata.rigLines.flat());}
