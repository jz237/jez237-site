// Selected Blender-built vessel. +x bow, +y up, +z starboard.
export const MAT={HULL:0,DECK:1,CABIN:2,GLASS:3,TEAK:4,ALU:5,SAIL:6,STEEL:7,ROPE:8,KEEL:9,TRIM:10,BRASS:11,RUBBER:12,SCREEN:13,CANVAS:14,WOOD:15,SAFETY:16,COMPASS:17,LAMP:18,PORTLIGHT:19,STARBOARDLIGHT:20};
import {vessel,SX,SY,SZ,sheer,halfBeam} from './vessels.js';
export {sheer,halfBeam} from './vessels.js';
export const DIM={LOA:vessel.length,HULL_LEN:vessel.hullLength,BEAM:vessel.beam,DECK_H:2.6*SY,DRAFT:vessel.draft,MAST_X:-12.7*SX,MAST_H:vessel.id==='imperial'?57:36.5};
export const SAILS=[];
export const waterlineHalfBeam=x=>halfBeam(x)*.91;
let geometry;
export async function loadYachtGeometry(){
 const root=new URL('../assets/',import.meta.url);
 const [mr,br]=await Promise.all([fetch(new URL(vessel.asset+'.json?v=imperial-star-20260930',root)),fetch(new URL(vessel.asset+'.bin.gz?v=imperial-star-20260930',root))]);
 if(!mr.ok||!br.ok)throw new Error(`${vessel.name} could not be loaded. Refresh to try again.`);
 const metadata=await mr.json();
 if(metadata.version!==2||metadata.vertexStride!==44||metadata.masts!==vessel.masts)throw new Error(`Unsupported ${vessel.name} asset.`);
 const buffer=await new Response(br.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(),groups={};
 for(const [name,g] of Object.entries(metadata.groups)){
  if(g.vertexOffset+g.vertexCount*44>buffer.byteLength||g.indexOffset+g.indexCount*4>buffer.byteLength)throw new Error(`Incomplete ${vessel.name} geometry.`);
  groups[name]={verts:new Float32Array(buffer,g.vertexOffset,g.vertexCount*11),idx:new Uint32Array(buffer,g.indexOffset,g.indexCount)};
 }
 SAILS.splice(0,SAILS.length,...metadata.sails);
 geometry={hull:groups.hull,rig:groups.rig,sails:SAILS.map(S=>({S,mesh:groups[S.id],boom:S.boom?groups[S.boom]:null})),metadata};
 return metadata;
}
export function buildYacht(){if(!geometry)throw new Error('Load the selected ship first.');return geometry;}
export function buildRigging(){return new Float32Array(geometry.metadata.rigLines.flat());}
