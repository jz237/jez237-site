import * as T from 'three';
/** Derby roof sign (offline events): an upright board on the roof carrying the car number on both faces, so a rival can be
 * read from any side, as at a real demolition derby. ROOF_SIGN sizes it (metres) and lifts it ROOF_SIGN.lift above the roof. */
export const ROOF_SIGN={width:.62,height:.3,thick:.03,lift:.17,post:.12} as const;
/** The sign as a group (board, number on both faces, two posts), standing on y=0 along the car's length. */
export function roofSign(number:number){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#f4f2ea';ctx.fillRect(0,0,256,128);ctx.strokeStyle='#111';ctx.lineWidth=10;ctx.strokeRect(5,5,246,118);
  ctx.fillStyle='#111';ctx.font='900 104px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(number),128,70);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const face=new T.MeshStandardMaterial({map:texture,roughness:.7}),edge=new T.MeshStandardMaterial({color:0x2a2a2a,roughness:.6,metalness:.4});
  // Box faces: +x/−x are the two faces seen from the car's sides.
  const board=new T.Mesh(new T.BoxGeometry(ROOF_SIGN.thick,ROOF_SIGN.height,ROOF_SIGN.width),[face,face,edge,edge,edge,edge]);
  board.position.y=ROOF_SIGN.post+ROOF_SIGN.height/2;board.castShadow=true;board.name='roof_sign_board';
  const group=new T.Group();group.name='roof_sign';group.add(board);
  for(const z of [-.2,.2]){const post=new T.Mesh(new T.BoxGeometry(.03,ROOF_SIGN.post,.03),edge);post.position.set(0,ROOF_SIGN.post/2,z);group.add(post);}
  return group;
}
/** Free the sign's geometry, materials and texture. */
export function disposeRoofSign(sign:T.Object3D){sign.traverse(o=>{if(!(o instanceof T.Mesh))return;o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){(m as T.MeshStandardMaterial).map?.dispose();m.dispose();}});sign.removeFromParent();}
/** The sign takes the knocks a real one does: folded flat on its posts once the car goes past ROOF_KNOCK.side (its up vector's
 * height) onto a side or its roof, rolls, or the roof has taken flatRoof damage; torn off whole by tearRolls rolls, tearRoof roof
 * damage or a blow-up. flat is the folded angle (radians) and fold the rate it eases there. */
export const ROOF_KNOCK={side:.3,flat:1.35,flatRoof:14,tearRoof:34,tearRolls:2,fold:30} as const;
export type RoofSignFate='up'|'flat'|'torn';
/** What becomes of the sign this frame; it never stands back up. */
export function roofSignFate(fate:RoofSignFate,up:number,rolls:number,roofDamage:number,blownUp:boolean):RoofSignFate{
  if(fate==='torn'||blownUp||rolls>=ROOF_KNOCK.tearRolls||roofDamage>=ROOF_KNOCK.tearRoof)return 'torn';
  return fate==='flat'||up<ROOF_KNOCK.side||rolls>=1||roofDamage>=ROOF_KNOCK.flatRoof?'flat':'up';
}
/** Eases a knocked sign flat towards side (+1 folds its top towards the car's -x, -1 towards +x). */
export function foldRoofSign(sign:T.Object3D,side:number,dt:number){if(dt>0)sign.rotation.z+=(side*ROOF_KNOCK.flat-sign.rotation.z)*Math.min(1,dt*ROOF_KNOCK.fold);}
/** The torn sign's box (metres) and the point in the sign's own frame it tumbles about (the board's centre). */
export const roofSignBox=()=>({size:new T.Vector3(.1,ROOF_SIGN.height+ROOF_SIGN.post,ROOF_SIGN.width),centre:new T.Vector3(0,(ROOF_SIGN.post+ROOF_SIGN.height)/2,0)});
