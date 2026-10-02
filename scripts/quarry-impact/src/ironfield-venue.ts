/** One model-space record drives each reachable solid's rendering and OBB.
 * Half extents are local X/Y/Z; yaw rotates about vertical world Y. */
export type IronfieldSolid={
 id:string;x:number;y:number;z:number;half:readonly[number,number,number];yaw:number;
 material:'concrete'|'steel'|'ochre';collision:boolean;
};
export function createIronfieldSolids(barriers:readonly{x:number;z:number;yaw:number;length:number}[],finish:{x:number;z:number;yaw:number}):IronfieldSolid[]{
 const solids:IronfieldSolid[]=barriers.map((b,i)=>({id:'course_barrier_'+i,x:b.x,y:.65,z:b.z,half:[.35,.65,b.length/2],yaw:b.yaw,material:i%12<8?'concrete':'ochre',collision:true}));
 for(const side of [-1,1]){
  solids.push({id:'perimeter_x_'+side,x:side*145,y:.65,z:0,half:[.35,.65,100.35],yaw:0,material:'concrete',collision:true});
  solids.push({id:'perimeter_z_'+side,x:0,y:.65,z:side*100,half:[145,.65,.35],yaw:0,material:'concrete',collision:true});
  solids.push({id:'finish_pillar_'+side,x:finish.x+Math.cos(finish.yaw)*13*side,y:4,z:finish.z-Math.sin(finish.yaw)*13*side,half:[.22,4,.22],yaw:finish.yaw,material:'steel',collision:true});
 }
 solids.push({id:'finish_bridge',x:finish.x,y:8.5,z:finish.z,half:[13.22,.35,.3],yaw:finish.yaw,material:'steel',collision:true});
 return solids;
}
