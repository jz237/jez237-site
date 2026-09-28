"""Reproducible authored quarry cut. Run with Blender --background --python.

The frozen base records the exact published cliff edges in Three.js Y-up space.
No textures are generated or embedded: runtime reuses the licensed quarry and
Rock Moss Set 01 maps. Detailed meshes and simple collision share one sampler.
"""
import bpy, math, json, pathlib, random, hashlib
from mathutils import Vector, Matrix, Euler

ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE=ROOT/'source/models/quarry-cut-base.json'
BASE=json.loads(SOURCE.read_text())
START,END=BASE['startCell'],BASE['endCellExclusive']
RNG=random.Random(981244)
TAU=math.pi*2

def lerp(a,b,t): return a+(b-a)*t
def clamp(n,a,b): return max(a,min(b,n))
def smooth(a,b,n):
    t=clamp((n-a)/(b-a),0,1);return t*t*(3-2*t)
def mix(a,b,t): return tuple(lerp(a[i],b[i],t) for i in range(len(a)))
def xyz_to_blender(p): return (p[0],-p[2],p[1])
def blender_to_xyz(p): return (p[0],p[2],-p[1])

# Independent bedding courses. No joint runs through the entire quarry face.
WALLS=[(3,6,9),(12,15,18),(21,24,27)]
COURSES=[]
for course in range(9):
    joints=[-2.0]
    while joints[-1]<23:joints.append(joints[-1]+RNG.uniform(.32,1.35))
    COURSES.append({'joints':joints,'shear':RNG.uniform(-.26,.26),
                    'blocks':[{'out':RNG.uniform(.04,.20),'lean':RNG.uniform(-.055,.055),
                               'step':RNG.uniform(-.4,.4),'shade':RNG.uniform(.72,.87)}
                              for _ in joints[:-1]]})

def course_at(row):
    for wall,(lo,hi,_) in enumerate(WALLS):
        if lo<=row<=hi:return wall*3+min(2,int(row-lo)),1 if row==hi else clamp((row-lo)%1,0,1)
    return None,0

def block_at(course,col,f):
    data=COURSES[course];q=col-data['shear']*(f-.5)
    i=min(len(data['blocks'])-1,next(i for i in range(len(data['blocks'])) if q<=data['joints'][i+1]))
    lo,hi=data['joints'][i:i+2]
    return data['blocks'][i],clamp((q-lo)/(hi-lo),0,1),min(q-lo,hi-q)

def original(row,col):
    row=clamp(row,0,30);col=clamp(col,0,21)
    r=min(29,int(row));c=min(20,int(col));fy=row-r;fx=col-c
    items=BASE['rows']
    p=mix(mix(items[r][c]['p'],items[r][c+1]['p'],fx),
          mix(items[r+1][c]['p'],items[r+1][c+1]['p'],fx),fy)
    uv=mix(mix(items[r][c]['uv'],items[r][c+1]['uv'],fx),
           mix(items[r+1][c]['uv'],items[r+1][c+1]['uv'],fx),fy)
    color=mix(mix(items[r][c]['color'],items[r][c+1]['color'],fx),
              mix(items[r+1][c]['color'],items[r+1][c+1]['color'],fx),fy)
    return p,uv,color

def authored(row,col):
    p,uv,basecolor=original(row,col)
    # About five metres of transition at cut ends; all four edges remain exact.
    edge=smooth(0,1.6,col)*smooth(0,1.6,21-col)
    radial=0;yshift=0;shade=.78
    radius=math.hypot(p[0]/1.08,p[2])
    # Real extraction risers: retain the published toe and crest, but bring each
    # face's upper edge inward to make a 3–5m rise in about one metre of run.
    # The following bench restores the original radius. Backing terrain remains
    # safely beneath the raised, inward-facing cut rather than poking through.
    for wall,(lo,hi,recover) in enumerate(WALLS):
        if lo<=row<=recover:
            lower=original(lo,col)[0];upper=original(hi,col)[0];back=original(recover,col)[0]
            low_r=math.hypot(lower[0]/1.08,lower[2]);back_r=math.hypot(back[0]/1.08,back[2])
            top_r=low_r+1.05
            target=lerp(low_r,top_r,(row-lo)/(hi-lo)) if row<=hi else lerp(top_r,back_r,(row-hi)/(recover-hi))
            radial=(target-radius)*edge
        # Staggered chipped bench edges move in height independently at each
        # extraction level, so they do not become continuous parallel ribbons.
        if lo-1<row<recover:
            topblock,_,distance=block_at(wall*3+2,col,1)
            # A chipped lip affects only the first ~1.5m of the bench behind it.
            # Extending the same offset to the next wall creates sawn-board ridges.
            weight=max(0,1-(hi-row)/3) if row<=hi else max(0,1-(row-hi)/.25)
            yshift+=topblock['step']*weight*smooth(0,.055,distance)*edge
    course,f=course_at(row)
    if course is not None:
        b,along,distance=block_at(course,col,f)
        lip=smooth(0,.032,distance)
        depth=(b['out']+b['lean']*(along-.5))*lip
        # Narrow, oblique joints belong to a single 1–2m bedding course.
        # Planar block fronts replace the former smooth full-height furrows.
        radial-=depth*edge
        shade=lerp(.69,b['shade'],lip)
    else:
        shade=.77+.035*math.sin(col*.63+row*.18)
    a=math.radians(START+col)
    point=(p[0]+math.sin(a)*radial*1.08,p[1]+yshift,p[2]+math.cos(a)*radial)
    tint=mix(basecolor,(shade*.985,shade,shade*1.015),edge*smooth(0,2,row)*smooth(0,2,30-row))
    return point,uv,(*tint,1)

def surface_at(a,radius):
    col=math.degrees(a)-START
    last=authored(0,col)[0];lr=math.hypot(last[0]/1.08,last[2])
    for row in range(1,31):
        p=authored(row,col)[0];rr=math.hypot(p[0]/1.08,p[2])
        if radius<=rr:return lerp(last[1],p[1],clamp((radius-lr)/max(.00001,rr-lr),0,1))
        last,lr=p,rr
    return last[1]

def make_mesh(name,positions,faces,uvs,colors,material,smooth_faces=True,params=None):
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata([xyz_to_blender(p) for p in positions],[],faces);mesh.update()
    uv=mesh.uv_layers.new(name='UVMap')
    color=mesh.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
    for i,c in enumerate(colors):color.data[i].color=c
    for poly in mesh.polygons:
        poly.use_smooth=smooth_faces
        for loop in poly.loop_indices:uv.data[loop].uv=uvs[mesh.loops[loop].vertex_index]
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    if name.startswith('CutRubble'):
        import bmesh
        bm=bmesh.new();bm.from_mesh(mesh)
        bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001)
        bm.to_mesh(mesh);bm.free();mesh.update()
    elif params is not None and 'normalBands' in BASE:
        custom=[];top_normals={};wall_faces=set()
        for poly in mesh.polygons:
            mean_row=sum(params[v][0] for v in poly.vertices)/len(poly.vertices)
            if any(lo<=mean_row<=hi for lo,hi,_ in WALLS):wall_faces.add(poly.index)
            else:
                for vi in poly.vertices:top_normals[vi]=top_normals.get(vi,Vector())+poly.normal*poly.area
        for poly in mesh.polygons:
            band=clamp(int(sum(params[v][0] for v in poly.vertices)/len(poly.vertices)),0,29)
            poly.use_smooth=True
            for loop in poly.loop_indices:
                row,col=params[mesh.loops[loop].vertex_index]
                if col==0 or col==21:
                    pair=BASE['normalBands'][band]['left' if col==0 else 'right']
                    n=Vector(xyz_to_blender(mix(pair[0],pair[1],clamp(row-band,0,1))))
                    custom.append(tuple(n.normalized()) if n.length>.1 else tuple(poly.normal))
                elif poly.index not in wall_faces:
                    normal=top_normals.get(mesh.loops[loop].vertex_index,poly.normal)
                    custom.append(tuple(normal.normalized()))
                else:custom.append(tuple(poly.normal))
        mesh.normals_split_custom_set(custom)
    return obj

def grid_payload(left,right,level):
    angular_div=4 if level=='near' else 1
    rows={float(i) for i in range(31)}
    for lo,hi,_ in WALLS:
        for i in range(lo,hi):rows.add(i+.5)
        # Both LODs retain staggered bedding changes, just fewer planar interior
        # samples in the far mesh. Horizontal lips are geometry, not dark paint.
        for i in range(lo+1,hi+1):
            rows.add(i-.025);rows.add(i+.025)
        rows.add(hi+.12);rows.add(hi+.25)
    rows=sorted(rows);pos=[];uv=[];colors=[];faces=[];strips=[];params=[]
    for row in rows:
        cols={left+i/angular_div for i in range(round((right-left)*angular_div)+1)}
        course,f=course_at(row)
        if course is not None:
            data=COURSES[course]
            for j in data['joints'][1:-1]:
                for d in [-.038,0,.038]:
                    x=j+data['shear']*(f-.5)+d
                    if left<x<right:cols.add(x)
        # Rows just above an extraction edge preserve its actual chipped outline.
        for wall,(_,hi,_) in enumerate(WALLS):
            if abs(row-hi)<.1 or hi<row<=hi+.25:
                data=COURSES[wall*3+2]
                for j in data['joints'][1:-1]:
                    x=j+data['shear']*.5
                    for d in [-.06,0,.06]:
                        if left<x+d<right:cols.add(x+d)
        cols=sorted(cols);start=len(pos)
        for col in cols:
            p,t,c=authored(row,col);pos.append(p);uv.append(t);colors.append(c);params.append((row,col))
        strips.append((start,cols))
    # Zipper adjacent variable-density rows. Joint samples stay local to their
    # own course instead of forcing straight seams through every higher ledge.
    for (start,a),(nxt,b) in zip(strips,strips[1:]):
        i=j=0
        while i<len(a)-1 or j<len(b)-1:
            if i==len(a)-1:faces.append((start+i,nxt+j,nxt+j+1));j+=1
            elif j==len(b)-1:faces.append((start+i,nxt+j,start+i+1));i+=1
            elif abs(a[i+1]-b[j+1])<1e-8:
                faces.append((start+i,nxt+j,nxt+j+1,start+i+1));i+=1;j+=1
            elif a[i+1]<b[j+1]:faces.append((start+i,nxt+j,start+i+1));i+=1
            else:faces.append((start+i,nxt+j,nxt+j+1));j+=1
    return pos,faces,uv,colors,params

def grid_mesh(section,level,angular_div,radial_div,material):
    data=grid_payload(section*7,(section+1)*7,level)
    return make_mesh(f'CutRock_{section}_{level}',*data[:4],material,smooth_faces=False,params=data[4])

def mesh_payload(obj):
    obj.data.calc_loop_triangles()
    uv=obj.data.uv_layers.active
    positions=[];tex=[];indices=[]
    # Preserve UV seams by emitting a vertex per corner. Only a small template
    # is repeated; it is merged into one material/draw per spatial section.
    for tri in obj.data.loop_triangles:
        face=[]
        for loop in tri.loops:
            vi=obj.data.loops[loop].vertex_index
            p=obj.matrix_world@obj.data.vertices[vi].co
            face.append(len(positions));positions.append(blender_to_xyz(p));tex.append(tuple(uv.data[loop].uv))
        indices.append(tuple(face))
    low=[min(p[k] for p in positions) for k in range(3)]
    high=[max(p[k] for p in positions) for k in range(3)]
    centre=[(low[k]+high[k])/2 for k in range(3)];size=max(high[0]-low[0],high[2]-low[2])
    return {'p':[tuple((p[k]-centre[k])/size for k in range(3)) for p in positions],'uv':tex,'faces':indices}

def simplified_template(obj,budget):
    copy=obj.copy();copy.data=obj.data.copy();bpy.context.collection.objects.link(copy)
    count=sum(len(p.vertices)-2 for p in copy.data.polygons)
    mod=copy.modifiers.new('Rubble silhouette LOD','DECIMATE');mod.ratio=min(1,budget/count)
    bpy.context.view_layer.objects.active=copy;bpy.ops.object.modifier_apply(modifier=mod.name)
    data=mesh_payload(copy);bpy.data.objects.remove(copy,do_unlink=True);return data

def rubble_specs():
    result=[];rng=random.Random(462127)
    # Six debris fans, individually graded from broken extraction ledges toward
    # the toe. Their overlap avoids a conspicuous evenly spaced boulder row.
    for fan,centre in enumerate([2.1,5.0,8.25,11.7,15.25,18.55]):
        for i in range(13):
            large=i<3;middle=3<=i<7
            col=clamp(centre+rng.uniform(-1.25,1.25),.85,20.15)
            row=(rng.uniform(5.5,11) if large else rng.uniform(2.7,8) if middle else rng.uniform(.7,4.5))
            anchor=authored(row,col)[0];a=math.radians(START+col)
            diameter=rng.uniform(2.2,4.3) if large else rng.uniform(.85,1.8) if middle else rng.uniform(.22,.7)
            result.append({'section':min(2,int(col/7)),'col':col,'a':a,'x':anchor[0],'z':anchor[2],
                           'diameter':diameter,'height':rng.uniform(.58,.9),'yaw':rng.random()*TAU,
                           'pitch':rng.uniform(-.28,.28),'roll':rng.uniform(-.35,.35),'variant':rng.randrange(6),
                           'shade':rng.uniform(.83,1),'solid':large or middle})
    return result

def transform_template(template,spec):
    # Convert through Blender for a proper rigid rotation, then support the
    # lowest transformed vertices against the actual local fractured surface.
    rot=Euler((spec['pitch'],spec['roll'],spec['yaw']),'XYZ').to_matrix()
    pts=[]
    for p in template['p']:
        v=rot@Vector(xyz_to_blender((p[0]*spec['diameter'],p[1]*spec['diameter']*spec['height'],p[2]*spec['diameter'])))
        q=blender_to_xyz(v);pts.append((q[0]+spec['x'],q[1],q[2]+spec['z']))
    bottom=min(p[1] for p in pts);top=max(p[1] for p in pts)
    supports=[]
    for x,y,z in pts:
        if y<bottom+(top-bottom)*.30:
            a=math.atan2(x/1.08,z);r=math.hypot(x/1.08,z)
            supports.append(surface_at(a,r)-y)
    # Partial burial makes these fallen blocks belong to the slope. The lower
    # quartile suppresses one high sample perching the whole rock on a cliff lip.
    supports.sort();height=spec.get('anchor_y',supports[len(supports)//4]-.10*spec['diameter'])
    spec['anchor_y']=height
    return [(x,y+height,z) for x,y,z in pts]

def collision_mesh(specs,templates,walls):
    # Exact visible near-wall triangulation avoids invisible bridges over chipped
    # bedding. Only loose-looking rubble is represented by simplified hulls.
    positions=[];indices=[];wall_components=[]
    for obj in walls:
        start=len(positions);first_triangle=len(indices)//3
        obj.data.calc_loop_triangles()
        positions.extend(blender_to_xyz(obj.matrix_world@v.co) for v in obj.data.vertices)
        for triangle in obj.data.loop_triangles:indices.extend(start+v for v in triangle.vertices)
        wall_components.append({'name':obj.name,'firstTriangle':first_triangle,'triangleCount':len(indices)//3-first_triangle})
    wall_triangles=len(indices)//3
    # Twelve-vertex angular proxies follow the same transformed/support-seated
    # scan, not a guessed sphere/cuboid that sticks out into the road.
    components=[]
    for spec in specs:
        if not spec['solid']:continue
        first_triangle=len(indices)//3
        points=transform_template(templates[spec['variant']],spec)
        lo=[min(p[k] for p in points) for k in range(3)];hi=[max(p[k] for p in points) for k in range(3)]
        centre=tuple((lo[k]+hi[k])/2 for k in range(3))
        selected=[]
        directions=[(1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1),
                    (1,1,1),(-1,1,1),(1,1,-1),(-1,1,-1),(1,-1,1),(-1,-1,-1)]
        for d in directions:
            p=max(points,key=lambda p:sum((p[k]-centre[k])*d[k] for k in range(3)))
            if p not in selected:selected.append(p)
        # Blender's bmesh hull gives a watertight proxy, triangulated afterward.
        import bmesh
        bm=bmesh.new();verts=[bm.verts.new(p) for p in selected]
        bmesh.ops.convex_hull(bm,input=verts,use_existing_faces=False)
        bmesh.ops.triangulate(bm,faces=list(bm.faces));bm.verts.ensure_lookup_table();bm.verts.index_update()
        start=len(positions);positions.extend([tuple(v.co) for v in bm.verts])
        for face in bm.faces:indices.extend(start+v.index for v in face.verts)
        bm.free()
        components.append({'firstTriangle':first_triangle,'triangleCount':len(indices)//3-first_triangle})
    return {'version':1,'sector':{'startCell':START,'endCellExclusive':END},'wallTriangles':wall_triangles,'wallTriangleCount':wall_triangles,'wallComponents':wall_components,'rubbleComponents':components,
            'positions':[v for p in positions for v in p],'indices':indices}

def main():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/rocks-lod.glb'))
    originals=[o for o in bpy.context.scene.objects if o.type=='MESH']
    originals.sort(key=lambda o:o.name)
    if len(originals)!=6:raise RuntimeError(f'Expected six scan variants, found {len(originals)}')
    templates={level:[simplified_template(o,budget) for o in originals] for level,budget in [('near',680),('far',150),('proxy',90)]}
    for o in originals:bpy.data.objects.remove(o,do_unlink=True)
    # Neutral placeholder materials carry semantic names only; root renderer
    # supplies the existing licensed GPU textures with no duplicate allocations.
    rock=bpy.data.materials.new('QUARRY_EXISTING_DRY_ROCK');rock.diffuse_color=(.43,.42,.39,1)
    rubble=bpy.data.materials.new('QUARRY_EXISTING_SCAN_ATLAS');rubble.diffuse_color=(.45,.43,.39,1)
    for mat in [rock,rubble]:
        mat.use_nodes=True
        vertex=mat.node_tree.nodes.new('ShaderNodeVertexColor');vertex.layer_name='Color'
        mat.node_tree.links.new(vertex.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
    specs=rubble_specs();output=[]
    for section in range(3):
        for level,ad,rd in [('near',6,2),('far',2,1)]:
            output.append(grid_mesh(section,level,ad,rd,rock))
            pos=[];uv=[];colors=[];faces=[]
            for spec in specs:
                if spec['section']!=section:continue
                template=templates[level][spec['variant']]
                # Tiny gravel chips need only the low mesh even at close range.
                if spec['diameter']<.7:template=templates['far'][spec['variant']]
                start=len(pos);points=transform_template(template,spec)
                pos.extend(points);uv.extend(template['uv'])
                shade=spec['shade'];colors.extend([(shade*.79,shade*.88,shade*.98,1)]*len(points))
                faces.extend(tuple(start+v for v in f) for f in template['faces'])
            output.append(make_mesh(f'CutRubble_{section}_{level}',pos,faces,uv,colors,rubble))
    collision=collision_mesh(specs,templates['proxy'],[o for o in output if o.name.startswith('CutRock_') and o.name.endswith('_near')])
    (ROOT/'src/quarry-cut-collision.json').write_text(json.dumps(collision,separators=(',',':')))
    blend=ROOT/'source/models/quarry-cut.blend'
    # Keep references/textures outside the GLB; source remains editable.
    for o in output:o.select_set(True)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    glb=ROOT/'public/models/quarry-cut.glb'
    bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,
                              export_materials='EXPORT',export_yup=True)
    report={'version':1,'source':'Original authored geometry with Poly Haven Rock Moss Set 01 fragments',
            'source_url':'https://polyhaven.com/a/rock_moss_set_01','license':'CC0-1.0 for scanned fragments; original authored cut',
            'generator':'tools/author-quarry-cut.py','base':'source/models/quarry-cut-base.json',
            'sector':collision['sector'],'sections':BASE['sections'],'uv_metres_per_tile':3.6,
            'runtime_maps':'Existing rock_* (repeat1, 3.6m UV scale) and Rock Moss Set 01 atlas; no embedded textures',
            'meshes':[{'name':o.name,'vertices':len(o.data.vertices),'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in output],
            'rubble_count':len(specs),'solid_rubble_count':sum(s['solid'] for s in specs),
            'collision_triangles':len(collision['indices'])//3,'collision_vertices':len(collision['positions'])//3,
            'assets':[{'file':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [SOURCE,glb,blend,ROOT/'src/quarry-cut-collision.json']]}
    (ROOT/'source/models/quarry-cut-manifest.json').write_text(json.dumps(report,indent=2),newline='\n')
    print('QUARRY_CUT_REPORT',json.dumps(report))

if __name__=='__main__':main()
