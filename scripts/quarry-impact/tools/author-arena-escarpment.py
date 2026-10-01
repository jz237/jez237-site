"""Original fracture relief over five retained quarry wall assets.

Blender 5.2. Preserve authored benches and original model/physics bytes. The
added relief is restricted to exposed upper rock, <=0.72 m inward decoration;
the existing coarse rock proxies retain their clearance. No road/apron edits.
Imported assets and shared runtime photographic maps retain their license.
"""
import bpy, bmesh, math, random, pathlib, hashlib, json
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
sources=['quarry-cut','quarry-headwall','quarry-east-bay','quarry-west-wall','quarry-extension']
protected={s:hashlib.sha256((ROOT/'public/models'/f'{s}.glb').read_bytes()).hexdigest() for s in sources}
mat=bpy.data.materials.new('Arena fractured photographic bedrock');mat.diffuse_color=(.66,.64,.59,1)
created=[];stats=[];replacement=[]
def hash2(a,b):return (math.sin(a*127.1+b*311.7)*43758.5453)%1
for si,name in enumerate(sources):
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models'/f'{name}.glb'))
    imported=set(bpy.data.objects)-before
    # Only rock faces. The road, fan apron, vegetation and scanned fragments stay.
    for o in list(imported):
        if o.type!='MESH' or 'Rock' not in o.name or 'far' in o.name.lower():continue
        o.data=o.data.copy();matrix=o.matrix_world.copy()
        for v in o.data.vertices:v.co=matrix@v.co
        o.matrix_world.identity()
        original_name=o.name
        # glTF import coordinates are Blender Z-up. Thin relief is radial inward.
        for v in o.data.vertices:
            x,y,z=v.co; radius=math.hypot(x,y)
            if radius<1:continue
            edge=min(1,max(0,(z-5.)/3.5))*min(1,max(0,(radius-118)/8))
            a=math.atan2(-y,x)*radius
            layer=math.floor((z+math.sin(a*.038)*.9)/1.65)
            tilt=(hash2(layer,si)-.5)*.28
            course=(z+math.sin(a*.038)*.9)/1.65-layer
            block=(a+course*1.3+hash2(layer,si)*5.)/3.3
            cell=math.floor(block); f=block-cell
            joint=min(f,1-f)
            shoulder=min(1,max(0,joint/.065))
            rise=min(1,max(0,min(course,1-course)/.045))
            relief=(.09+(.18+hash2(cell,layer)*.14)*shoulder*rise+tilt*(f-.5)*.3)*edge
            relief=min(.72,max(.003,relief))
            v.co.x-=x/radius*relief;v.co.y-=y/radius*relief
            # Slightly chipped horizons never continue around the whole ring.
            v.co.z+=math.sin(f*math.pi)*math.sin(course*math.pi)*(hash2(cell,layer)-.5)*.10*edge
        o.data.materials.clear();o.data.materials.append(mat)
        # Weld the portable GLB's UV-seam duplicates before normal calculation.
        # Otherwise tiny independent triangles read as sharp plastic shards.
        bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.001)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free()
        for p in o.data.polygons:p.use_smooth=True
        o.data.set_sharp_from_angle(angle=math.radians(38))
        surface=BVHTree.FromPolygons([v.co for v in o.data.vertices],[tuple(p.vertices)for p in o.data.polygons])
        # Large bedding plates and spalled corners, separate from fine scan
        # relief. Group only steep exposed faces by staggered geological course.
        bins={}
        for p in o.data.polygons:
            c=p.center;r=math.hypot(c.x,c.y)
            if c.z<8 or r<123:continue
            inward=Vector((-c.x/r,-c.y/r,0))
            if abs(p.normal.dot(inward))<.64:continue
            arc=math.atan2(c.y,c.x)*155
            layer=math.floor(c.z/2.7);cell=math.floor((arc+hash2(layer,si)*3.)/4.6)
            bins.setdefault((cell,layer),[]).append(c.copy())
        verts=[];faces=[]
        for (cell,layer),samples in bins.items():
            if hash2(cell,layer)<.43:continue
            c=sum(samples,Vector())/len(samples);r=math.hypot(c.x,c.y)
            # Seat the fracture plate against the exposed envelope, not the
            # mean inside a jagged face; buried plates cannot read as geology.
            inward=Vector((-c.x/r,-c.y/r,0));along=Vector((-inward.y,inward.x,0))
            hit,normal,_,_=surface.ray_cast(c+inward*6.,-inward,12.)
            if hit is None:continue
            c=hit+along*((hash2(cell+8,layer)-.5)*2.0)+Vector((0,0,(hash2(cell+3,layer)-.5)*1.7))
            w=1.3+hash2(cell+2,layer)*2.1;h=.72+hash2(cell,layer+4)*1.8
            corners=4+int(hash2(cell+19,layer)*4);twist=(hash2(cell+11,layer)-.5)*1.25
            outline=[]
            for j in range(corners):
                a=-j/corners*math.tau+twist+(hash2(cell+j+40,layer)-.5)*.22
                reach=.7+hash2(cell+j+60,layer)*.3
                outline.append((math.cos(a)*w*reach,math.sin(a)*h*reach))
            n=len(verts);depth=.10+hash2(cell+5,layer)*.18
            for shrink,d in [(1.,.006),(.975,depth)]:
                for j,(u,v) in enumerate(outline):
                    base=c+along*(u*shrink)+Vector((0,0,v*shrink))
                    # Follow the actual visible envelope at each chipped corner.
                    edge_hit,_,_,_=surface.ray_cast(base+inward*6.,-inward,12.)
                    if edge_hit is not None:base=edge_hit
                    co=base+inward*(d+(hash2(cell+j,layer)-.5)*.045)
                    verts.append(tuple(co))
            # UV outline is clockwise; reverse it to face into the quarry.
            faces.append(tuple(n+corners+j for j in reversed(range(corners))))
            faces.extend([(n+corners+j,n+corners+(j+1)%corners,n+(j+1)%corners,n+j)for j in range(corners)])
        chunks=bpy.data.meshes.new('Spalled bedding plates');chunks.from_pydata(verts,[],faces);chunks.update()
        plate=bpy.data.objects.new('Fractured bedding',chunks);bpy.context.collection.objects.link(plate);plate.data.materials.append(mat)
        bpy.ops.object.select_all(action='DESELECT');o.select_set(True);plate.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.join()
        o.data.set_sharp_from_angle(angle=math.radians(38))
        for attr in o.data.color_attributes:
            for entry in attr.data:
                if max(entry.color[:3])<.001:entry.color=(.66,.65,.61,1)
        o.name=f'ArenaRock_{len(created)}_near';created.append(o)
        replacement.append({'mesh':o.name,'source':original_name})
        stats.append({'mesh':o.name,'vertices':len(o.data.vertices),'triangles':sum(len(p.vertices)-2 for p in o.data.polygons),'fractureVertices':len(verts),'fractureFaces':len(faces)})
        far=o.copy();far.data=o.data.copy();bpy.context.collection.objects.link(far);far.name=o.name.replace('near','far')
        bpy.context.view_layer.objects.active=far
        mod=far.modifiers.new('Distant fracture relief','DECIMATE');mod.ratio=.38
        bpy.ops.object.modifier_apply(modifier=mod.name);created.append(far)
    for o in imported:
        if o not in created:bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.object.select_all(action='DESELECT')
for o in created:o.select_set(True)
blend=ROOT/'source/models/arena-escarpment.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
glb=ROOT/'public/models/arena-escarpment.glb'
bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_texcoords=True,export_normals=True,export_materials='EXPORT',export_yup=True)
assert all(hashlib.sha256((ROOT/'public/models'/f'{s}.glb').read_bytes()).hexdigest()==h for s,h in protected.items())
manifest={'method':'Original Blender authored upper face fracture relief and correctly oriented, ray-seated spalled plates over protected quarry derivatives; existing roads, talus and collision files untouched. No downloaded assets.','license':'Original relief CC0; source asset licenses retained in CREDITS.md','generator':'tools/author-arena-escarpment.py','sourceHashes':protected,'maxInwardReliefMeters':.72,'plateSeating':'Radial BVH ray hits on the copied rock envelope; upper decoration only','meshes':stats,'assetSha256':hashlib.sha256(glb.read_bytes()).hexdigest(),'blendSha256':hashlib.sha256(blend.read_bytes()).hexdigest()}
(ROOT/'source/models/arena-escarpment-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(ROOT/'src/arena-escarpment-replacements.json').write_text(json.dumps(replacement,indent=2)+'\n')
print(json.dumps({'assetBytes':glb.stat().st_size,'nearTriangles':sum(s['triangles']for s in stats),'sections':len(stats)}))
