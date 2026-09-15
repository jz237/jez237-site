import {DataUtils} from 'three';

/** Store each RGB channel's four directional coefficients in one RGBA texel.
 * The original field has four RGBA slabs with unused alpha. Repacking keeps
 * every coefficient at the same half-float precision, with three fetches. */
export function packIrradiance(data:Float32Array,nx:number,ny:number,nz:number){
 if(data.length!==nx*ny*nz*16)throw Error('Invalid irradiance field size');
 const packed=new Uint16Array(nx*ny*nz*12);
 for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)
  for(let channel=0;channel<3;channel++)for(let coefficient=0;coefficient<4;coefficient++){
   const source=((z*ny+y)*nx*4+coefficient*nx+x)*4+channel;
   const target=((z*ny+y)*nx*3+channel*nx+x)*4+coefficient;
   packed[target]=DataUtils.toHalfFloat(data[source]);
  }
 return packed;
}
