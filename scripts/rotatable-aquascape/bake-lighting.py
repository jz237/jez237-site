"""Offline single-bounce diffuse probe study, run with Blender --background.

Uses the exported browser geometry. This is a low-order irradiance approximation,
not a Cycles render or a simulation of glass/refraction. No network/service calls.
"""
import base64, hashlib, json, math, pathlib, sys, time
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

folder=pathlib.Path(__file__).resolve().parent
source=json.loads((folder/'.bake/scene.json').read_text())
decode=lambda value,dtype:np.frombuffer(base64.b64decode(value),dtype=dtype)
positions=[]; polygons=[]; albedos=[]; doubles=[]; offset=0
started=time.time()
for mesh in source['meshes']:
    p=decode(mesh['positions'],'<f4').reshape(-1,3)
    tri=decode(mesh['indices'],'<u4').reshape(-1,3)
    rgb=decode(mesh['colors'],'<f4').reshape(-1,3)[tri].mean(axis=1)
    matrices=decode(mesh['matrices'],'<f4').reshape(-1,4,4).transpose(0,2,1)
    colors=decode(mesh['instanceColors'],'<f4').reshape(-1,3)
    for matrix,color in zip(matrices,colors):
        positions.append(p@matrix[:3,:3].T+matrix[:3,3])
        polygons.append(tri+offset); offset+=len(p)
        albedos.append(rgb*color); doubles.append(np.full(len(tri),mesh['doubleSided'],dtype=bool))
vertices=np.concatenate(positions); faces=np.concatenate(polygons)
albedo=np.concatenate(albedos); double=np.concatenate(doubles)
del positions,polygons,albedos,doubles
print(f'Building BVH: {len(vertices):,} vertices, {len(faces):,} triangles',flush=True)
tree=BVHTree.FromPolygons(vertices.tolist(),faces.tolist(),all_triangles=True)
print(f'BVH ready in {time.time()-started:.1f}s',flush=True)

# Match the scene's three shadowed canopy samples. The continuous strip and
# studio fill remain runtime lighting; they are not counted twice in this bake.
lamps=[Vector((x,6.29,-.15)) for x in (-2.8,0,2.8)]
targets=[Vector((x*.8,.6,-.15)) for x in (-2.8,0,2.8)]
lamp_axes=[(target-lamp).normalized() for target,lamp in zip(targets,lamps)]
lamp_color=np.array((.9,1.,.81))
cache={}
def radiance(face,normal,ray):
    flip=normal.dot(ray)>0
    if flip and not double[face]:return np.zeros(3)
    key=(face,flip)
    if key in cache:return cache[key]
    n=-normal if flip else normal
    center=Vector(vertices[faces[face]].mean(axis=0))
    result=np.zeros(3)
    for lamp,axis in zip(lamps,lamp_axes):
        delta=lamp-center; distance=delta.length; direction=delta/distance
        incidence=n.dot(direction)
        cosine=max(0.,incidence)+(max(0.,-incidence)*.35 if double[face] else 0.)
        cone=(-direction).dot(axis)
        low=math.cos(.94); high=math.cos(.94*(1.-.72))
        falloff=max(0.,min(1.,(cone-low)/(high-low)));falloff=falloff*falloff*(3.-2.*falloff)
        if cosine<.001 or falloff<.001:continue
        hit=tree.ray_cast(center+direction*.008,direction,max(0.,distance-.016))
        if hit[2] is not None and hit[2]!=face:continue
        result+=lamp_color*(36./max(distance**1.1,.01))*cosine*falloff
    value=result*albedo[face]/math.pi
    cache[key]=value
    return value

nx,ny,nz=15,9,7
minimum=np.array((-4.85,.35,-2.15));maximum=np.array((4.85,5.2,2.15))
samples=1536
directions=[]
for i in range(samples):
    y=1.-2.*(i+.5)/samples;radius=math.sqrt(1-y*y);angle=i*2.399963229728653
    directions.append(Vector((radius*math.cos(angle),y,radius*math.sin(angle))))
coefficients=np.zeros((nz,ny,nx,4,3),dtype='<f4')
hits=0
for z in range(nz):
    for y in range(ny):
        for x in range(nx):
            point=Vector(minimum+(maximum-minimum)*np.array((x/(nx-1),y/(ny-1),z/(nz-1))))
            values=np.zeros((4,3))
            # Deterministically rotate the sphere samples per probe to avoid
            # coherent sampling stripes without introducing non-repeatable noise.
            angle=(x*17+y*31+z*13)*.618;cs=math.cos(angle);sn=math.sin(angle)
            for base in directions:
                ray=Vector((base.x*cs-base.z*sn,base.y,base.x*sn+base.z*cs))
                hit=tree.ray_cast(point,ray,12.)
                if hit[2] is None:continue
                hits+=1;rgb=radiance(hit[2],hit[1],ray)
                values[0]+=rgb*math.pi/samples
                for axis in range(3):values[axis+1]+=rgb*(2.*math.pi/samples)*ray[axis]
            coefficients[z,y,x]=values
    print(f'Probe slice {z+1}/{nz}; {time.time()-started:.1f}s',flush=True)

# Four RGB coefficient volumes, packed along X with no interpolation across
# volume boundaries. Runtime remaps each coefficient to its own texel centers.
packed=np.zeros((nz,ny,nx*4,4),dtype='<f4')
for i in range(4):packed[:,:,i*nx:(i+1)*nx,:3]=coefficients[:,:,:,i,:]
output=folder/'public/lighting';output.mkdir(exist_ok=True)
(output/'diffuse-probes.bin').write_bytes(packed.tobytes())
inputs=['lib/BotanicalPlants.ts','lib/ScannedBranch.ts','lib/ScannedRock.ts','lib/ScannedHardscape.ts','lib/EpiphyteMoss.ts','lib/TankSpace.ts','lib/Substrate.ts','lib/SubstrateVolume.ts','lib/LeafSurface.ts']
metadata={'version':1,'dimensions':[nx,ny,nz],'minimum':minimum.tolist(),'maximum':maximum.tolist(),'samples':samples,'triangles':int(len(faces)),'bytes':int(packed.nbytes),'coefficientRange':[float(coefficients.min()),float(coefficients.max())],'hits':hits,'seconds':round(time.time()-started,2),'model':'single-bounce L1 diffuse irradiance; static geometry; three canopy samples; glass and alpha-cut fronds/moss excluded','sourceHashes':{p:hashlib.sha256((folder/p).read_bytes().replace(b'\r\n',b'\n')).hexdigest() for p in inputs},'binarySHA256':hashlib.sha256(packed.tobytes()).hexdigest()}
(output/'diffuse-probes.json').write_text(json.dumps(metadata,indent=2))
print(json.dumps(metadata),flush=True)
