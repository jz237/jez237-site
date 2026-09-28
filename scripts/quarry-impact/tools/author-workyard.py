"""Detailed original industrial props. Blender 5.2 --background --python this file.

Metres; helper inputs use game Y-up coordinates. Exported mesh positions match
the existing static proxies. Runtime applies the photographic material bundle.
The editable Blender scene also links those same CC0 images with relative paths.
"""
import bpy, math, json, hashlib, pathlib, random
from mathutils import Vector, Matrix
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'source/models'; OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
random.seed(190782)
GROUP=''; ITEMS={}; MATERIALS={}
def world(p): return Vector((p[0],-p[2],p[1]))
def mat(name,color,rough=.65,metal=.05):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
    MATERIALS[name]=m;return m
paint=mat('yard_paint',(.31,.38,.30));yellow=mat('yard_yellow',(.64,.40,.095));steel=mat('yard_steel',(.20,.23,.23),.53,.7)
rust=mat('yard_rust',(.25,.12,.065),.86,.08);rubber=mat('yard_rubber',(.027,.032,.031),.92)
glass=mat('yard_glass',(.035,.06,.068),.13,.12);chrome=mat('yard_chrome',(.47,.50,.51),.25,.85)
concrete=mat('yard_concrete',(.50,.48,.41),.96);letter=mat('yard_letter',(.72,.71,.59),.82)
black=mat('yard_black',(.045,.055,.05),.74);clad=mat('yard_cladding',(.51,.54,.51),.69,.3)
def register(o,material):
    o.name=GROUP+'_'+material.name;o.data.materials.append(material);ITEMS.setdefault(GROUP,[]).append(o);return o
def mesh(v,f,m,bevel=0):
    data=bpy.data.meshes.new(GROUP);data.from_pydata([world(p) for p in v],[],f);data.update()
    o=bpy.data.objects.new(GROUP,data);bpy.context.collection.objects.link(o);register(o,m)
    if bevel:
        bpy.context.view_layer.objects.active=o;o.select_set(True)
        mod=o.modifiers.new('Rounded fabrication edges','BEVEL');mod.width=bevel;mod.segments=2
        mod.limit_method='ANGLE';bpy.ops.object.modifier_apply(modifier=mod.name)
        o.select_set(False)
    return o
def box(p,s,m,bevel=.008,rotation=None):
    corners=[(-1,-1,-1),(-1,-1,1),(-1,1,-1),(-1,1,1),(1,-1,-1),(1,-1,1),(1,1,-1),(1,1,1)]
    vertices=[]
    for c in corners:
        v=Vector(tuple(c[i]*s[i]/2 for i in range(3)))
        if rotation:v=rotation@v
        vertices.append(Vector(p)+v)
    return mesh(vertices,[(2,6,4,0),(5,7,3,1),(4,5,1,0),(3,7,6,2),(1,3,2,0),(6,7,5,4)],m,bevel)
def rod(a,b,r,m,sides=10,r2=None):
    a,b=Vector(a),Vector(b);axis=(b-a).normalized();u=axis.cross(Vector((0,1,0)))
    if u.length<.1:u=axis.cross(Vector((1,0,0)))
    u.normalize();v=axis.cross(u).normalized();r2=r if r2 is None else r2
    verts=[p+(u*math.cos(i*math.tau/sides)+v*math.sin(i*math.tau/sides))*rr for p,rr in [(a,r),(b,r2)] for i in range(sides)]
    faces=[tuple(range(sides-1,-1,-1)),tuple(range(sides,sides*2))]
    faces += [(i,(i+1)%sides,(i+1)%sides+sides,i+sides) for i in range(sides)]
    o=mesh(verts,faces,m)
    for poly in o.data.polygons:poly.use_smooth=len(poly.vertices)==4
    return o
def beam(a,b,w,d,m,bevel=.015):
    a,b=Vector(a),Vector(b);axis=(b-a).normalized();q=Vector((0,1,0)).rotation_difference(axis)
    return box((a+b)/2,(w,(b-a).length,d),m,bevel,q.to_matrix())
def hose(points,r=.028,m=rubber):
    for a,b in zip(points,points[1:]):rod(a,b,r,m,8)
def ring(p,axis,r,t,m,segments=28):
    n=Vector(axis).normalized();u=n.cross(Vector((0,1,0)))
    if u.length<.1:u=n.cross(Vector((1,0,0)))
    u.normalize();v=n.cross(u);points=[Vector(p)+(u*math.cos(i*math.tau/segments)+v*math.sin(i*math.tau/segments))*r for i in range(segments+1)]
    for a,b in zip(points,points[1:]):rod(a,b,t,m,6)
def text(body,p,right=(1,0,0),up=(0,1,0),size=.16):
    c=bpy.data.curves.new('Original quarry stencil','FONT');c.body=body;c.size=size;c.space_character=1.05;c.extrude=0;c.resolution_u=2
    o=bpy.data.objects.new('stencil',c);bpy.context.collection.objects.link(o)
    r,u=world(right),world(up);n=r.cross(u);o.matrix_world=Matrix(((r.x,u.x,n.x,0),(r.y,u.y,n.y,0),(r.z,u.z,n.z,0),(0,0,0,1)));o.location=world(p)
    bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False);register(o,letter)
def sheet(x0,x1,y0,y1,z,m,period=.27,depth=.045):
    # Continuous folded sheet, not ribs stuck onto a cube. Subtle panel dents.
    n=max(4,round((x1-x0)/period)*4);verts=[]
    for j,y in enumerate([y0,y0+(y1-y0)*.24,y0+(y1-y0)*.73,y1]):
        for i in range(n+1):
            x=x0+(x1-x0)*i/n; wave=[-.5,-.5,.5,.5][i%4]*depth
            dent=math.sin((x-x0)*2.4)*math.sin((y-y0)/(y1-y0)*math.pi)*.0025
            verts.append((x,y,z+wave+dent))
    faces=[(j*(n+1)+i,j*(n+1)+i+1,(j+1)*(n+1)+i+1,(j+1)*(n+1)+i) for j in range(3) for i in range(n)]
    return mesh(verts,faces,m)

def container():
    global GROUP;GROUP='container'
    for z in [-1.20,1.20]:
        sheet(-2.74,2.74,.18,2.40,z,paint)
        for y in [.10,2.50]:box((0,y,z),(5.73,.16,.11),paint,.023)
    for x in [-2.79,2.79]:
        for z in [-1.19,1.19]:
            box((x,1.3,z),(.18,2.58,.18),paint,.026)
            for y in [.09,2.51]:
                box((x,y,z),(.22,.18,.21),steel,.025)
                # Black inset lifting/coupling socket, bounded by the casting.
                box((x,y,z+(.109 if z>0 else -.109)),(.1,.07,.003),black,0)
    for x in [-2.79,2.79]:
        box((x,.13,0),(.15,.19,2.4),paint,.017);box((x,2.49,0),(.15,.17,2.4),paint,.017)
    box((0,.13,0),(5.52,.16,2.3),black,.015)
    for i in range(24):box((-2.68+i*.233,2.46,0),(.19,.035,2.34),paint,.012)
    # Fixed end plus two inset doors, gaskets, stiles and four lock bars.
    box((2.795,1.30,0),(.07,2.3,2.22),paint,.02)
    for z in [-.57,.57]:
        box((-2.807,1.3,z),(.045,2.25,1.10),black,.006)
        box((-2.837,1.3,z),(.045,2.19,1.055),paint,.016)
        for zz in [-.33,0,.33]:box((-2.869,1.3,z+zz),(.035,2.07,.052),paint,.009)
        for zz in [-.34,.34]:
            rod((-2.913,.23,z+zz),(-2.913,2.38,z+zz),.021,steel)
            for y in [.31,.92,1.80,2.32]:box((-2.912,y,z+zz),(.045,.075,.09),steel,.007)
            beam((-2.937,1.1,z+zz),(-2.937,1.1,z+zz+.21),.035,.027,chrome,.002)
        for y in [.45,1.3,2.17]:box((-2.873,y,z+(-.515 if z<0 else .515)),(.065,.065,.18),steel,.007)
    text('BQ 4086',(-2.88,1.89,-1.02),(0,0,1),size=.19)
    text('MAX GROSS  30 480 KG',(-2.884,.61,-1.04),(0,0,1),size=.075)
    text('BLACKRIDGE', (2.40,1.95,-1.238),(-1,0,0),size=.29)
    text('QUARRY  /  STORES',(2.39,1.66,-1.238),(-1,0,0),size=.115)
    for side in [-1,1]:
        for i in range(12):
            x=-2.6+i*.45;y=.25+random.random()*.38
            box((x,y,side*1.228),(.024+random.random()*.035,.10+random.random()*.25,.002),rust,0)

def excavator():
    global GROUP;GROUP='excavator'
    box((0,.58,0),(2.1,.37,3.9),steel,.10)
    # Closed track loops with individual shoes, pins and internal wheels.
    for x in [-1.6,1.6]:
        for z in [-1.99,-1.14,-.37,.40,1.18,1.99]:
            radius=.44 if abs(z)>1.9 else .31
            rod((x-.39,.59,z),(x+.39,.59,z),radius,black,22)
            rod((x-.43,.59,z),(x+.43,.59,z),radius*.69,steel,20)
            for side in [-1,1]:rod((x+side*.425,.59,z),(x+side*.45,.59,z),.105,chrome,12)
        # Stadium path: 4m straight runs joined by half circles, 0.49m radius.
        path=[]
        for i in range(18):path.append((1.99-i*3.98/18,1.08,0))
        for i in range(9):
            a=math.pi/2+i*math.pi/9;path.append((-1.99+.49*math.cos(a),.59+.49*math.sin(a),a-math.pi/2))
        for i in range(18):path.append((-1.99+i*3.98/18,.10,math.pi))
        for i in range(9):
            a=-math.pi/2+i*math.pi/9;path.append((1.99+.49*math.cos(a),.59+.49*math.sin(a),a-math.pi/2))
        for z,y,a in path:
            rotation=Matrix.Rotation(-a,3,'X');box((x,y,z),(.98,.075,.205),steel,.006,rotation)
            box((x,y+.038*math.cos(a),z-.038*math.sin(a)),(1.01,.035,.034),rust,.003,rotation)
        box((x,1.20,0),(1.06,.12,4.40),yellow,.025)
    rod((0,1.04,-.1),(0,1.36,-.1),1.1,steel,40)
    box((0,1.75,-.18),(3.22,1.02,3.57),yellow,.18)
    box((.76,2.26,-.6),(1.27,.10,2.45),black,.022)
    for i in range(14):box((1.616,1.85,-1.46+i*.18),(.014,.40,.065),black,.003)
    for z in [-1.45,-.75,-.05]:box((1.625,1.74,z),(.009,.012,.44),steel,.002)
    for z in [-1.57,1.45]:
        box((0,1.58,z),(2.98,.19,.06),black,.022)
        for x in [-1.32,1.32]:box((x,1.73,z+(.045 if z>0 else -.045)),(.20,.16,.06),letter,.012)
    # Cab frames enclose separate windows, visible seat and operator controls.
    box((-.8,2.12,-.30),(1.56,.12,1.96),black,.035)
    box((-.8,3.90,-.30),(1.65,.12,2.02),yellow,.055)
    for x in [-1.55,-.05]:
        for z in [-1.25,.66]:beam((x,2.18,z),(x,3.86,z),.068,.065,steel,.012)
        box((x,3.03,-.3),(.035,1.58,1.78),glass,.003)
        box((x,2.40,-.3),(.047,.042,1.91),steel,.005)
        beam((x,2.23,-.78),(x,3.81,-.78),.04,.04,steel,.004)
    for z in [-1.26,.67]:
        box((-.8,3.04,z),(1.40,1.56,.027),glass,.003)
        box((-.8,2.45,z),(1.50,.037,.037),steel,.004)
    box((-.8,2.35,-.52),(.68,.21,.67),black,.10);box((-.8,2.80,-.82),(.68,.82,.19),black,.09)
    for x in [-1.17,-.40]:rod((x,2.45,-.25),(x,2.71,-.13),.03,steel);rod((x,2.71,-.13),(x,2.78,-.10),.05,black)
    for y in [.48,.83,1.2]:box((-1.73,y,.88),(.32,.065,.45),steel,.012)
    hose([(-1.70,1.35,.70),(-1.70,2.80,.70),(-1.60,3.02,.70)],.025,chrome)
    rod((1.1,2.25,-1.10),(1.1,3.06,-1.10),.08,steel);rod((1.1,3.06,-1.10),(1.32,3.13,-1.10),.08,steel)
    # Paired plate booms sit within the original rotated beam proxies.
    segments=[((.5,2,1),(.5,7,4),.65),((.5,7,4),(.5,3,8),.50)]
    for a,b,width in segments:
        beam(a,b,width,.48,yellow,.06)
        for side in [-1,1]:
            aa=Vector(a)+Vector((side*width*.36,0,0));bb=Vector(b)+Vector((side*width*.36,0,0))
            beam(aa,bb,.085,.51,yellow,.015)
        for p in [a,b]:rod((p[0]-width*.59,p[1],p[2]),(p[0]+width*.59,p[1],p[2]),width*.33,steel,22)
    for a,b in [((.86,2.3,1.6),(.86,5.5,3.7)),((.83,6.64,4.18),(.83,4.32,6.70))]:
        mid=Vector(a).lerp(Vector(b),.61);rod(a,mid,.095,steel,16);rod(mid,b,.056,chrome,16)
    for side in [-.17,.17]:
        hose([(.5+side,2.2,1),(.5+side,3.2,1.47),(.5+side,6.7,3.56),(.5+side,7.20,4.15),(.5+side,6.35,4.70),(.5+side,3.4,7.82)])
    # Open curved bucket with side cheek plates, wear ribs and teeth.
    profile=[(1.94,8.68),(1.98,7.82),(2.18,7.45),(2.65,7.31),(3.02,7.60),(3.07,8.08)]
    for x in [-.31,1.31]:mesh([(x,y,z)for y,z in profile],[tuple(range(len(profile)))],steel,.018)
    for (y,z),(yy,zz) in zip(profile,profile[1:]):mesh([(-.31,y,z),(1.31,y,z),(1.31,yy,zz),(-.31,yy,zz)],[(0,1,2,3)],steel)
    for x in [-.15,.18,.51,.84,1.17]:
        beam((x,1.97,8.37),(x,1.90,8.76),.18,.11,chrome,.02)
        beam((x,2.03,7.65),(x,2.58,7.30),.10,.05,rust,.008)
    beam((.5,3.5,7.60),(.5,2.90,8.05),.15,.16,yellow)
    text('BQ 24',(.89,1.8,-2.001),(-1,0,0),size=.25)
    text('BLACKRIDGE',(1.657,1.35,1.20),(0,0,-1),size=.115)

def conveyor():
    global GROUP;GROUP='conveyor'
    # Local origin follows the old 24m, -0.18rad conveyor deck.
    box((0,.04,0),(23.9,.10,1.67),rubber,.016)
    for z in [-.79,.79]:
        for y in [-.56,.19]:beam((-11.96,y,z),(11.96,y,z),.085,.085,steel,.008)
        for i in range(16):
            x=-11.70+i*1.5
            beam((x,-.56,z),(x+1.25,.19,z),.055,.065,steel,.005)
            beam((x,.19,z),(x+1.25,-.56,z),.055,.065,steel,.005)
    for x in range(-11,12):
        rod((x,-.11,-.69),(x,-.11,.69),.105,steel,12)
        for z in [-.85,.85]:box((x,-.12,z),(.21,.21,.19),yellow,.02)
    for x in [-11.72,11.72]:rod((x,-.02,-.75),(x,-.02,.75),.25,black,24)
    for i in range(39):box((-11.5+i*.6,.103,0),(.045,.035,1.57),rubber,.005)
    for z in [-1.02,1.02]:
        beam((-11.1,.85,z),(11.1,.85,z),.04,.04,yellow,.005)
        for x in [-11,-7,-3,1,5,9,11]:beam((x,.08,z),(x,.85,z),.04,.04,yellow,.005)
    box((10.80,-.12,1.09),(1.12,.65,.64),yellow,.06)
    rod((10.7,-.11,.7),(10.7,-.11,1.20),.13,steel,16)
    for x in [10.45,10.65,10.85,11.05]:box((x,-.1,1.42),(.075,.40,.015),black,.003)
    # Separate supports use original unrotated world positions; runtime adds.

def workshop():
    global GROUP;GROUP='workshop'
    for x in [-10.41,10.41]:box((x,4,0),(.15,7.94,12.88),clad,.008)
    sheet(-10.40,10.40,.15,7.92,-6.43,clad,.25,.04)
    # Front cladding broken around closed roller door and windows.
    sheet(-10.40,-3.1,.15,7.92,6.43,clad,.25,.04);sheet(3.1,10.40,.15,7.92,6.43,clad,.25,.04)
    sheet(-3.1,3.1,4.05,7.92,6.43,clad,.25,.04)
    box((0,2,6.48),(6.06,3.98,.05),black,.005)
    for i in range(28):box((0,.12+i*.14,6.53),(5.96,.108,.10),steel,.008)
    for x in [-3.08,3.08]:box((x,2.07,6.6),(.13,4.14,.13),yellow,.02)
    box((0,4.19,6.59),(6.38,.20,.22),steel,.028)
    for x in [-7.5,-4.5,4.5,7.5]:
        box((x,5.8,6.49),(2.2,1.35,.055),black,.008)
        box((x,5.8,6.53),(1.99,1.14,.032),glass,.008)
        for dx in [-1.05,0,1.05]:box((x+dx,5.8,6.56),(.055,1.27,.048),steel,.006)
        for yy in [5.16,6.45]:box((x,yy,6.57),(2.15,.06,.08),steel,.008)
    for x in [-10.6,10.6]:
        rod((x,.18,6.62),(x,8.15,6.62),.075,steel,12)
        hose([(x,.18,6.62),(x,.12,6.98),(x,.12,7.2)],.075,steel)
    rod((-10.80,8.14,6.69),(10.80,8.14,6.69),.12,steel,12)
    for z in [-3.35,3.35]:box((0,8.70,z),(22.4,.13,7.08),clad,.015,Matrix.Rotation(.15 if z>0 else -.15,3,'X'))
    box((0,9.24,0),(22.5,.12,.24),steel,.013)
    for x in [-10.54,10.54]:
        beam((x,8.18,-7),(x,9.24,0),.13,.13,steel)
        beam((x,9.24,0),(x,8.18,7),.13,.13,steel)
    for x in [-10,10]:box((x,.10,0),(.55,.20,13),concrete,.04)
    for z in [-6.48,6.48]:box((0,.10,z),(20.5,.20,.45),concrete,.04)
    box((4.25,2.6,6.60),(.75,1.1,.15),steel,.023)
    rod((4.70,.12,6.61),(4.70,7.40,6.61),.026,chrome)
    box((0,7.10,6.60),(8.6,.9,.06),black,.014)
    text('BLACKRIDGE WORKS',(-3.85,6.86,6.642),size=.46)

def silo():
    global GROUP;GROUP='silo'
    rod((0,2.5,0),(0,3.0,0),.57,steel,32)
    rod((0,3,0),(0,5.5,0),.58,steel,40,2.66)
    rod((0,5.5,0),(0,14.5,0),2.66,steel,48)
    rod((0,14.5,0),(0,15.5,0),2.66,steel,48,.48)
    for y in [5.5,8.5,11.5,14.5]:ring((0,y,0),(0,1,0),2.662,.03,chrome,40)
    for x in [-1.72,1.72]:
        for z in [-1.72,1.72]:
            box((x,2.8,z),(.20,5.6,.20),steel,.016);box((x,.12,z),(.58,.24,.58),concrete,.055)
    for x in [-.32,.32]:rod((x,3.05,2.72),(x,14.80,2.72),.026,steel,8)
    for i in range(38):rod((-.32,3.15+i*.30,2.74),(.32,3.15+i*.30,2.74),.018,chrome,8)
    for y in [5.5,7.5,9.5,11.5,13.5]:
        points=[(.41*math.cos(a),y,2.72+.52*math.sin(a))for a in [i*math.pi/12 for i in range(13)]]
        hose(points,.018,steel)
    rod((1.1,.2,1.8),(1.1,13.7,1.8),.095,steel,12)
    text('AGGREGATE',(-1.48,10.4,2.669),size=.32)

def barrier():
    global GROUP;GROUP='barrier'
    o=box((0,.58,0),(4.22,1.16,.75),concrete,.047)
    # Nonuniform small battered edges with exact broad original dimensions.
    for v in o.data.vertices:
        x,y,z=v.co
        if z>.97 and abs(x)>1.72:v.co.z-=.014+abs(math.sin(x*57+y*93))*.024
    for x in [-1.42,1.42]:
        box((x,1.161,0),(.17,.002,.08),black,.018)
        ring((x,1.18,0),(0,0,1),.065,.012,steel,12)
    box((0,.86,-.379),(3.8,.23,.006),yellow,.006)
    for x in [-1.7,-1.25,-.8,-.35,.1,.55,1.,1.45]:
        mesh([(x-.10,.745,-.383),(x+.04,.745,-.383),(x+.20,.975,-.383),(x+.06,.975,-.383)],[(0,1,2,3)],black)

container();excavator();conveyor();workshop();silo();barrier()

# UVs at physical metre scale; vertex tint adds limited base grime and variation.
for group,items in ITEMS.items():
    for o in items:
        bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);o.select_set(False)
        me=o.data;uv=me.uv_layers.new(name='UVMap') if not me.uv_layers else me.uv_layers[0]
        m=o.data.materials[0];scale=1.94 if m==paint else 2.2 if m in [yellow,rust] else 2.7 if m==clad else 2.0
        for poly in me.polygons:
            normal=poly.normal;dominant=max(range(3),key=lambda a:abs(normal[a]))
            for li in poly.loop_indices:
                p=me.vertices[me.loops[li].vertex_index].co
                u,v=(p.y,p.z) if dominant==0 else (p.x,p.z) if dominant==1 else (p.x,p.y)
                uv.data[li].uv=(u/scale,v/scale)
        color=me.color_attributes.new(name='COLOR_0',type='FLOAT_COLOR',domain='CORNER')
        for i,loop in enumerate(me.loops):
            p=me.vertices[loop.vertex_index].co;low=max(0,1-p.z/.55)
            grime=1-low*.28;shade=.99+.01*math.sin(p.x*3.17+p.y*2.43)
            color.data[i].color=(grime*shade,grime*shade*.99,grime*shade*.96,1)

records=[]
for group,items in ITEMS.items():
    partitions={m:[o for o in items if o.data.materials[0]==m] for m in MATERIALS.values()}
    for material,objects in partitions.items():
        if not objects:continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects:o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();near=bpy.context.object;near.name=f'{group}_LOD0_{material.name}'
        far=near.copy();far.data=near.data.copy();bpy.context.collection.objects.link(far);far.name=f'{group}_LOD1_{material.name}'
        bpy.context.view_layer.objects.active=far;mod=far.modifiers.new('Distant detail','DECIMATE');mod.ratio=.38
        bpy.ops.object.modifier_apply(modifier=mod.name)
        for o in [near,far]:
            tri=o.modifiers.new('Runtime triangles','TRIANGULATE');bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=tri.name)
            records.append({'name':o.name,'triangles':len(o.data.polygons)})

# Assign real material maps in editable source. Export geometry/material names
# separately so all instances share the same nine externally bundled maps.
for name,m in MATERIALS.items():
    asset='container_side' if m==paint else 'rusty_painted_metal' if m in [yellow,rust] else 'concrete_layers_02' if m==concrete else None
    if not asset:continue
    nodes=m.node_tree.nodes;links=m.node_tree.links;p=nodes.get('Principled BSDF')
    for suffix,input_name in [('diff','Base Color'),('normal','Normal'),('arm','Roughness')]:
        image=bpy.data.images.load(str(ROOT/f'public/assets/workyard/{asset}-{suffix}.jpg'),check_existing=True)
        image.filepath=bpy.path.relpath(image.filepath,start=str(OUT))
        tex=nodes.new('ShaderNodeTexImage');tex.image=image
        if suffix=='normal':
            image.colorspace_settings.name='Non-Color';normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.4;links.new(tex.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],p.inputs['Normal'])
        elif suffix=='arm':
            image.colorspace_settings.name='Non-Color';separate=nodes.new('ShaderNodeSeparateColor');links.new(tex.outputs['Color'],separate.inputs['Color']);links.new(separate.outputs['Green'],p.inputs['Roughness'])
        else:links.new(tex.outputs['Color'],p.inputs['Base Color'])
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'quarry-workyard.blend'))
for m in MATERIALS.values():
    for node in list(m.node_tree.nodes):
        if node.type not in ['BSDF_PRINCIPLED','OUTPUT_MATERIAL']:m.node_tree.nodes.remove(node)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/quarry-workyard.glb'),export_format='GLB',use_selection=True,export_yup=True,export_extras=True,export_vertex_color='NAME',export_vertex_color_name='COLOR_0')
manifest={'generator':'tools/author-workyard.py','geometryLicense':'Original Quarry Impact work','materials':'public/assets/workyard/manifest.json',
    'parts':records,'files':[],'note':'Near and far meshes are alternatives; prototypes placed by scenery-workyard.ts. Existing collision shapes retained.'}
for file in ['public/models/quarry-workyard.glb','source/models/quarry-workyard.blend']:
    b=(ROOT/file).read_bytes();manifest['files'].append({'path':file,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
(OUT/'quarry-workyard-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('WORKYARD_EXPORT_COMPLETE',json.dumps({'triangles':sum(r['triangles']for r in records),'parts':len(records),'files':manifest['files']}))
