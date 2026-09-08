import test from "node:test";
import assert from "node:assert/strict";
import { paintedFlowPose, PAINTED_FLOW_FIGHTERS } from "../engine/painted-flow.mjs";
import { clippedCell } from "../engine/clipped-cells.mjs";
const fighter = (id, limb, frame) => ({def:{id}, grounded:true, attackFrame:frame, attacking:{kind:"heavy",limb,activeStartFrame:8,activeEndFrame:12,totalFrames:24}});
test("standing strikes reach contact on the real active window and retract during recovery",()=>{
 for(const id of PAINTED_FLOW_FIGHTERS) for(const limb of ["punch","kick"]){
  const cells=Array.from({length:24},(_,f)=>paintedFlowPose(fighter(id,limb,f)).frame);
  const active=limb==="kick"?12:4;
  assert.ok(cells.slice(8,12).every(c=>c===active));
  assert.equal(cells.at(-1),limb==="kick"?15:7);
  assert.ok(new Set(cells).size>=7);
 }
});
test("specials, crouching and airborne attacks retain their own artwork",()=>{
 const f=fighter("jez","punch",5);
 for(const patch of [{grounded:false},{crouch:true},{hitstunFrames:5},{def:{id:"unknown"}},{attacking:{...f.attacking,kind:"special"}}]) assert.equal(paintedFlowPose({...f,...patch}),null);
});
test("known chopped raised-hand and head cells are rejected without blocking complete punches",()=>{
 for(const id of ["jez","benny"]){for(const frame of [3,9,14])assert.ok(clippedCell(id,"unified-ext3",frame));assert.equal(clippedCell(id,"unified-ext3",0),false);}
});
