import * as THREE from 'three';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';

/** Educational pack layers. Dimensions and internal arrangement are schematic. */
export function createBatteryParts(){
 const meshes=[];
 const metal=new THREE.MeshStandardMaterial({color:'#7c8892',metalness:.82,roughness:.38});
 const add=(name,geometry,material,position,layer,description)=>{const m=new THREE.Mesh(geometry,material.clone());m.name=name;m.material.name='Schematic_Battery';m.position.set(...position);m.userData.battery={name,description,offset:[4.3,.3+layer*.35,-.5]};meshes.push(m);return m;};
 const box=(x,y,z,px=0,py=0,pz=0)=>new THREE.BoxGeometry(x,y,z).translate(px,py,pz);
 const tray=mergeGeometries([box(1.46,.022,2.75),box(.035,.12,2.75,-.712,.055),box(.035,.12,2.75,.712,.055),box(1.46,.12,.035,0,.055,-1.357),box(1.46,.12,.035,0,.055,1.357)]);
 add('Battery · protective lower tray',tray,metal,[0,.16,-.03],0,'Schematic structural enclosure underneath the passenger floor. The outer tray supports and protects the internal pack layers; this shape is not a Tesla repair drawing.');
 const cooling=new THREE.MeshStandardMaterial({color:'#588f9e',metalness:.7,roughness:.3});
 add('Battery · liquid cooling plate',box(1.37,.018,2.61),cooling,[0,.203,-.03],1,'Illustrative heat-transfer layer. Tesla documents a liquid-cooled lithium-ion battery; the channels and internal geometry shown here are conceptual.');
 const bankMat=new THREE.MeshStandardMaterial({color:'#536e69',metalness:.58,roughness:.43});
 for(let i=0;i<5;i++){
  const pieces=[box(1.31,.075,.47)];
  for(let x=0;x<24;x++)for(let z=0;z<7;z++){const cap=new THREE.CylinderGeometry(.018,.018,.008,8).translate((x-11.5)*.052,.043,(z-3)*.059);pieces.push(cap);}
  add(`Battery · illustrative cell bank ${i+1}`,mergeGeometries(pieces),bankMat,[0,.257,-1.07+i*.52],2,`Illustrative cell bank ${i+1} of five drawn in this teaching model. The visible caps suggest cylindrical cell packaging; bank count, cell count, spacing and electrical connections are not an exact pack specification.`);
 }
 const busMat=new THREE.MeshStandardMaterial({color:'#b77735',metalness:.82,roughness:.28});
 add('Battery · insulated connection rail',box(.026,.018,2.58),busMat,[.66,.307,-.03],3,'Schematic interconnection rail between the illustrated cell banks. It indicates an electrical path, not the real routing or connection sequence.');
 const cover=add('Battery · sealed upper cover',box(1.46,.024,2.75),metal,[0,.335,-.03],5,'Schematic pack lid. In the assembled car it sits beneath the cabin floor. Select Battery anatomy to reveal the enclosure, cooling layer, cell banks and connection hardware.');
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');c.fillStyle='#485561';c.fillRect(0,0,512,512);c.strokeStyle='#72818c';c.lineWidth=3;for(let y=32;y<512;y+=32){c.beginPath();c.moveTo(20,y);c.lineTo(492,y);c.stroke();}c.fillStyle='#dcc67a';c.fillRect(124,202,264,108);c.fillStyle='#172029';c.font='bold 26px sans-serif';c.fillText('HV BATTERY',174,248);c.font='17px sans-serif';c.fillText('SCHEMATIC ASSEMBLY',156,280);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;cover.material.map=texture;
 const orange=new THREE.MeshStandardMaterial({color:'#c66b22',roughness:.58,metalness:.12});
 add('Battery · high-voltage connector',mergeGeometries([box(.22,.10,.11),new THREE.CylinderGeometry(.037,.037,.2,16).rotateX(Math.PI/2).translate(.045,0,.12)]),orange,[.45,.27,1.38],3,'Illustrative high-voltage connector. Orange identifies the high-voltage circuit in this visualization. The model is for inspection and learning, not physical service.');
 add('Battery · control electronics housing',box(.34,.10,.15),metal,[-.4,.26,1.3],3,'A schematic housing representing battery monitoring and control electronics. Exact circuit boards, contactors and service connectors are not reproduced.');
 return meshes;
}
