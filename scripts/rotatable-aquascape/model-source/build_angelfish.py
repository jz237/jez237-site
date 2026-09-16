"""Author the silver Pterophyllum reference in Blender; no downloaded/paid assets.
Run: blender --background --python model-source/build_angelfish.py
Coordinates are authored X forward, Y up, Z lateral, converted to Blender Z up.
The GLB preserves these coordinates for shared GPU body/fin articulation.
"""
import bpy, math, os, json
import numpy as np
from mathutils import Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'models' / 'angelfish'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def xyz(p): return (p[0], -p[2], p[1])
def uv(p): return ((p[0]+1.5)/2.5, (p[1]+1.65)/3.1)

# Scale rows follow the flank rather than using random noise as anatomy.
# Both sides retain the eye band, two main vertical bands and caudal bar.
n=1536
y,x=np.mgrid[0:n,0:n].astype(np.float32)
x=x/(n-1)*2.5-1.5; y=y/(n-1)*3.1-1.65
rng=np.random.default_rng(237)
row=np.floor(y*59); sx=(x*54 + (row%2)*.5)%1; sy=(y*59)%1
rim=np.exp(-((np.sqrt(((sx-.5)*1.1)**2+((sy-.34)*.72)**2)-.43)/.047)**2)
shine=np.maximum(0,1-((sx-.37)**2+(sy-.65)**2)*6)
noise=rng.random((n,n)).astype(np.float32)
silver=.60+.11*shine-.11*rim+.04*noise
gold=np.clip((y+.07)*.8,0,.35)
bands=np.zeros_like(x)
for center,width in [(.49,.068),(.01,.067),(-.42,.089),(-.79,.042)]:
    axis=center+.035*np.sin(y*2.8+center*4)+.005*np.sin(y*80)
    bands=np.maximum(bands,np.clip((width-np.abs(x-axis))*90+.5,0,1))
pigment=1-bands*.91
rgb=np.stack([silver*(1+gold*.22)*pigment,silver*(1+gold*.08)*pigment,silver*(1-gold*.38)*pigment],axis=-1)
def image(name,rgb):
    im=bpy.data.images.new(name,width=n,height=n,alpha=True)
    rgba=np.ones((n,n,4),dtype=np.float32); rgba[:,:,:3]=np.clip(rgb,0,1)
    im.pixels.foreach_set(rgba.ravel()); im.filepath_raw=str(OUT/(name+'.png')); im.file_format='PNG'; im.save(); im.pack(); return im
color=image('angelfish-scales',rgb)
# Use the supplied photograph as a flank pigment reference on the actual curved
# Blender mesh. A hand-fitted UV cage keeps background pixels off the silhouette.
photo=bpy.data.images.load(str(ROOT/'model-source'/'angelfish-photo-reference.png'));photo.pack()
photo_pixels=np.empty(photo.size[0]*photo.size[1]*4,dtype=np.float32);photo.pixels.foreach_get(photo_pixels);photo_pixels=photo_pixels.reshape(photo.size[1],photo.size[0],4)
photo_profile=[(140,380,405),(185,344,471),(230,316,535),(280,283,580),(330,264,608),(380,244,628),(430,239,625),(480,264,608),(530,320,575),(580,410,535),(625,458,499)]
def photo_uv(p):
    xx,yy,zz=p;px=140+( .78-xx)/1.57*485;px=max(141,min(624,px))
    top=float(np.interp(px,[a[0] for a in photo_profile],[a[1] for a in photo_profile]));bottom=float(np.interp(px,[a[0] for a in photo_profile],[a[2] for a in photo_profile]))
    h,_=section(max(-.79,min(.78,xx)));t=max(.015,min(.985,(yy+.035)/max(.025,h)*.5+.5))
    return (px/photo.size[0],1-(bottom*(1-t)+top*t)/photo.size[1])
# Fin tissue has pigment and fine longitudinal striae, never the flank scale grid.
fin_rgb=np.stack([(.49+.07*np.sin(y*2))*(1-bands*.70),(.52+.055*np.sin(y*2))*(1-bands*.72),(.45+.035*np.sin(y*2))*(1-bands*.75)],axis=-1)
fin_color=image('angelfish-fin-tissue',fin_rgb)
height=.32*shine-.15*rim
dy,dx=np.gradient(height)
normal=np.stack([-dx*5, -dy*5, np.ones_like(x)],axis=-1); normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
normal=image('angelfish-scale-normal',normal*.5+.5); normal.colorspace_settings.name='Non-Color'

def mat(name,c,rough=.42,metal=0):
    m=bpy.data.materials.new(name); m.use_nodes=True; p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*c,1); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal; return m
skin=mat('Silver scales and vertical pigment',(.7,.72,.64),.46,.20)
nodes=skin.node_tree.nodes; links=skin.node_tree.links; bsdf=nodes.get('Principled BSDF')
tex=nodes.new('ShaderNodeTexImage'); tex.image=photo; coords=nodes.new('ShaderNodeUVMap');coords.uv_map='Photographic flank';links.new(coords.outputs['UV'],tex.inputs['Vector']);links.new(tex.outputs['Color'],bsdf.inputs['Base Color'])
texn=nodes.new('ShaderNodeTexImage'); texn.image=normal;normuv=nodes.new('ShaderNodeUVMap');normuv.uv_map='Flank projection';links.new(normuv.outputs['UV'],texn.inputs['Vector']);norm=nodes.new('ShaderNodeNormalMap');norm.inputs['Strength'].default_value=.08;links.new(texn.outputs['Color'],norm.inputs['Color']);links.new(norm.outputs['Normal'],bsdf.inputs['Normal'])
fin=mat('Translucent fin membranes',(.48,.54,.48),.5,.12)
fin.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value=.34
fin.surface_render_method='DITHERED'
ftex=fin.node_tree.nodes.new('ShaderNodeTexImage'); ftex.image=fin_color; fin.node_tree.links.new(ftex.outputs['Color'],fin.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
raymat=mat('Fine silver fin rays',(.24,.29,.23),.58,.16)
rtex=raymat.node_tree.nodes.new('ShaderNodeTexImage');rtex.image=fin_color;raymat.node_tree.links.new(rtex.outputs['Color'],raymat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
pupil=mat('Dark cornea',(.008,.012,.013),.14,.12)
# The median-fin pigment follows the same photograph as the body. Fine dark
# bars are mapped along the actual fin rays, rather than painted as broad slabs.
median_fin=fin.copy();median_fin.name='Photographic median fin tissue'
for node in median_fin.node_tree.nodes:
    if node.type=='TEX_IMAGE': node.image=photo
median_fin.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value=.82
median_ray=raymat.copy();median_ray.name='Photographic median fin rays'
for node in median_ray.node_tree.nodes:
    if node.type=='TEX_IMAGE':node.image=photo
edge_dark=mat('Charcoal leading fin spines',(.030,.036,.028),.46,.15)
edge_light=mat('Warm pearl leading edge',(.50,.40,.25),.45,.2)

pearl=mat('Pearl pelvic tissue',(.72,.77,.66),.4,.15)
gill=mat('Gill fold shadows',(.15,.17,.14),.5,.15)

def mesh(name,verts,faces,material,uvs=None):
    data=bpy.data.meshes.new(name); data.from_pydata([xyz(p) for p in verts],[],faces); data.update()
    obj=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(obj); obj.data.materials.append(material)
    layer=data.uv_layers.new(name='Flank projection')
    for poly in data.polygons:
        poly.use_smooth=True
        for li in poly.loop_indices: layer.data[li].uv=uvs[data.loops[li].vertex_index] if uvs is not None else uv(verts[data.loops[li].vertex_index])
    return obj
def tube(name,points,radius,material,sides=6,taper=True,uvs=None):
    verts=[]; faces=[]
    for i,p in enumerate(points):
        tangent=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])
        tangent.normalize(); axis=tangent.cross(Vector((0,0,1)))
        if axis.length<.01: axis=tangent.cross(Vector((0,1,0)))
        axis.normalize(); other=tangent.cross(axis); r=radius*(1-.8*i/(len(points)-1) if taper else 1)
        for j in range(sides): verts.append(Vector(p)+r*(axis*math.cos(j/sides*math.tau)+other*math.sin(j/sides*math.tau)))
        if i:
            for j in range(sides): a=(i-1)*sides+j; b=(i-1)*sides+(j+1)%sides; faces.append((a,b,b+sides,a+sides))
    faces.extend([tuple(reversed(range(sides))),tuple(range(len(verts)-sides,len(verts)))])
    return mesh(name,verts,faces,material,[v for v in uvs for _ in range(sides)] if uvs is not None else None)
def ellipsoid(name,p,scale,material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=28,ring_count=16,location=xyz(p))
    o=bpy.context.object; o.name=name; o.scale=(scale[0],scale[2],scale[1]); bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    o.data.materials.append(material)
    for poly in o.data.polygons: poly.use_smooth=True
    return o

profile=[(-.79,.048,.026),(-.66,.11,.044),(-.50,.32,.082),(-.29,.52,.125),(-.05,.61,.153),(.18,.54,.144),(.39,.38,.106),(.57,.21,.070),(.72,.064,.040),(.78,.026,.020)]
def section(x):
    for i in range(len(profile)-1):
        a,b=profile[i:i+2]
        if a[0]<=x<=b[0]:
            t=(x-a[0])/(b[0]-a[0]); before=profile[max(0,i-1)]; after=profile[min(len(profile)-1,i+2)]
            return tuple((2*t**3-3*t*t+1)*a[k]+(t**3-2*t*t+t)*(b[k]-before[k])/(b[0]-before[0])*(b[0]-a[0])+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*(after[k]-a[k])/(after[0]-a[0])*(b[0]-a[0]) for k in [1,2])
    return profile[-1][1:]
verts=[]; faces=[]; rings=85; sides=48
for i in range(rings):
    xx=-.79+1.57*i/(rings-1); h,w=section(xx)
    for j in range(sides):
        a=j/sides*math.tau; yy=h*math.cos(a)-.035; zz=w*math.sin(a)
        # A shallow orbital rise, integrated into the head instead of a protruding
        # eyeball. The photo supplies the iris and the stripe crossing its edge.
        eye=((xx-.505)/.10)**2+((yy-.055)/.095)**2
        zz+=math.copysign(.004*math.exp(-eye*3),zz)
        verts.append((xx,yy,zz))
        if i<rings-1: k=i*sides+j; faces.append((k,i*sides+(j+1)%sides,(i+1)*sides+(j+1)%sides,k+sides))
faces.extend([tuple(reversed(range(sides))),tuple(range((rings-1)*sides,rings*sides))])
mesh('Body',verts,faces,skin)

def curve(points,t):
    q=t*(len(points)-1); i=min(int(q),len(points)-2); f=q-i
    a=points[max(0,i-1)];b=points[i];c=points[i+1];d=points[min(len(points)-1,i+2)]
    return tuple(.5*((2*b[k])+(-a[k]+c[k])*f+(2*a[k]-5*b[k]+4*c[k]-d[k])*f*f+(-a[k]+3*b[k]-3*c[k]+d[k])*f*f*f) for k in range(3))
def fin_photo_uv(name,t,s):
    if name=='Median dorsal':
        root=[(0,380,282),(.5,474,285),(1,625,460)]
        edge=[(0,395,270),(.125,456,223),(.25,564,159),(.375,697,89),(.5,833,40),(.625,697,143),(.75,660,263),(1,638,423)]
    elif name=='Median anal':
        root=[(0,363,604),(.5,478,602),(1,618,532)]
        edge=[(0,386,653),(.125,414,722),(.25,456,803),(.375,556,929),(.5,675,1004),(.625,641,840),(.75,625,693),(1,639,544)]
    else:
        root=[(0,628,462),(.5,625,493),(1,616,531)]
        edge=[(0,880,398),(.25,815,464),(.5,802,531),(.75,815,615),(1,885,724)]
    # Sample just inside the tissue boundary, away from the photographed water.
    s=min(.98,s)*(.82 if name=='Median anal' else .94)
    a=[float(np.interp(t,[v[0] for v in root],[v[k] for v in root])) for k in [1,2]]
    b=[float(np.interp(t,[v[0] for v in edge],[v[k] for v in edge])) for k in [1,2]]
    px=a[0]*(1-s)+b[0]*s;py=a[1]*(1-s)+b[1]*s
    # Fit the UV cage inside the photographed tissue. Bright green background
    # samples are pulled inward; the supplied photo itself remains unchanged.
    center=(560,275) if name=='Median dorsal' else (555,715) if name=='Median anal' else (745,532)
    for _ in range(12):
        r,g,b=photo_pixels[max(0,min(photo.size[1]-1,int(photo.size[1]-1-py))),max(0,min(photo.size[0]-1,int(px))),:3]
        if g-max(r,b)<.065 or g<r*1.2:break
        px=px*.85+center[0]*.15;py=py*.85+center[1]*.15
    return (px/photo.size[0],1-py/photo.size[1])

def membrane(name,roots,edge,count=36,steps=12):
    verts=[]; faces=[]; uvs=[]; leading=[]; median=name.startswith('Median')
    for i in range(count+1):
        t=i/count; a=curve(roots,t); b=curve(edge,t); line=[]
        if name in ['Median dorsal','Median anal']:
            side=1 if name=='Median dorsal' else -1
            if t<=.5:
                f=t*2;v0=Vector((.30,side*.44,0));v1=Vector((.12,side*.98,0));v2=Vector((-.83,side*1.42,0));b=v0*(1-f)**2+v1*(2*f*(1-f))+v2*f*f
            else:
                f=(t-.5)*2;v0=Vector((-.83,side*1.42,0));v1=Vector((-.66,side*1.0,0));v2=Vector((-.56,side*.38,0));v3=Vector((-.73,side*.12,0));b=v0*(1-f)**3+v1*(3*f*(1-f)**2)+v2*(3*f*f*(1-f))+v3*f**3
        if name in ['Median dorsal','Median anal'] and t<=.5:leading.append(tuple(b))
        for j in range(steps+1):
            s=j/steps; p=tuple(a[k]*(1-s)+b[k]*s for k in range(3)); line.append(p); verts.append(p); uvs.append(fin_photo_uv(name,t,s) if median else uv(p))
            if i and j: v=i*(steps+1)+j; faces.append((v,v-1,v-steps-2,v-steps-1))
        tube(name+' ray',line,.0018,median_ray if median else raymat,5,uvs=[fin_photo_uv(name,t,j/steps) for j in range(steps+1)] if median else None)
    mesh(name,verts,faces,median_fin if median else fin,uvs)
    if leading:
        # A dark reinforced leading edge with a fine warm highlight and short
        # anterior spine tips, visible in the supplied photograph.
        tube(name+' dark leading edge',leading,.008,edge_dark,7)
        tube(name+' pale edge',[(p[0],p[1],.004) for p in leading],.0028,edge_light,6)
        for k in range(2,min(14,len(leading)-1)):
            p=Vector(leading[k]);side=1 if name=='Median dorsal' else -1
            end=p+Vector((.012,side*(.018+.005*math.sin(k)),0))
            tube(name+' spine',[p,end],.0035,edge_dark,5)
membrane('Median dorsal',[(.31,.37,0),(-.15,.52,0),(-.68,.11,0)],[(.30,.44,0),(-.15,1.02,0),(-.77,1.39,0),(-.61,.45,0),(-.71,.14,0)],42,16)
membrane('Median anal',[(.28,-.43,0),(-.15,-.54,0),(-.68,-.15,0)],[(.29,-.45,0),(-.12,-.94,0),(-.83,-1.38,0),(-.58,-.43,0),(-.72,-.16,0)],42,16)
membrane('Median tail',[(-.77,.045,0),(-.81,-.035,0),(-.77,-.11,0)],[(-1.31,.36,0),(-1.23,.24,0),(-1.16,-.035,0),(-1.23,-.32,0),(-1.31,-.44,0)],30,12)
for side in [-1,1]:
    name='Pectoral left' if side==1 else 'Pectoral right'
    membrane(name,[(.34,-.14,side*.096),(.29,-.17,side*.102)],[(.05,-.12,side*.30),(-.07,-.27,side*.32),(.03,-.40,side*.23)],16,9)
    points=[(.27-.86*(t:=i/42)**1.6,-.43-1.11*t,side*(.052+.03*math.sin(t*math.pi))) for i in range(43)]
    tube('Streamer',points,.008,pearl,7)
    # The shallow orbital surface retains the photographic iris and eye stripe.
    # Gill-cover arc, cheek ridge, nostril and lip folds remain real geometry.
    points=[]
    for i in range(25):
        t=i/24; px=.38-.12*math.sin(t*math.pi); py=.24-.57*t; h,w=section(px)
        points.append((px,py,side*(w*math.sqrt(max(0,1-((py+.035)/h)**2))+.006)))
    tube('Gill seam',points,.0018,gill,6,False)
    tube('Body gill rim',[(p[0]-.005,p[1],p[2]+side*.002) for p in points],.003,skin,6)
    ellipsoid('Nostril',(.710,.051,side*.033),(.011,.007,.004),pupil)
    tube('Body lip',[(.773+.007*math.sin(t*math.pi),-.058+.05*t,side*.021) for t in np.linspace(0,1,12)],.008,skin,7,False)

# Collapse static pieces by articulation region/material: geometry and textures
# are shared by both runtime fish; only a few small uniforms differ per fish.
groups={}
for o in list(bpy.context.scene.objects):
    if o.type!='MESH': continue
    region='PectoralLeft' if o.name.startswith('Pectoral left') else 'PectoralRight' if o.name.startswith('Pectoral right') else 'Streamers' if o.name.startswith('Streamer') else 'Median' if o.name.startswith('Median') else 'Body'
    key=(region,o.data.materials[0].name); groups.setdefault(key,[]).append(o)
for (region,material),objects in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:o.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]; bpy.ops.object.join(); objects[0].name=region+'__'+material
    # Preserve fin UV cages; skin uses a separate photographic flank projection.
    if objects[0].data.materials[0]==skin:
        data=objects[0].data; layer=data.uv_layers.active
        photographic=data.uv_layers.new(name='Photographic flank')
        for loop in data.loops:
            p=data.vertices[loop.vertex_index].co; local=(p.x,p.z,-p.y);layer.data[loop.index].uv=uv(local);photographic.data[loop.index].uv=photo_uv(local)

fish=[o for o in bpy.context.scene.objects if o.type=='MESH']
bpy.ops.object.select_all(action='DESELECT')
for o in fish:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'silver-angelfish.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False,export_cameras=False,export_lights=False)
triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in fish)
(OUT/'model-info.json').write_text(json.dumps({'species':'Pterophyllum scalare','authoring':'Blender '+bpy.app.version_string,'triangles':triangles,'drawMeshes':len(fish),'reference':'User supplied silver angelfish photograph','license':'Original project asset; no third-party model or paid assets','motion':'Runtime GPU deformation; source geometry remains shared'},indent=2)+'\n',encoding='utf-8')

# A fitted collision envelope for this unusually thin, deep-bodied fish.
# Build compact local spheres from authored vertices instead of tetra-like large
# balls that unnecessarily seal off narrow front-to-back passages.
cells={};cell=.28
for obj in fish:
    region=obj.name.split('__')[0]
    for vertex in obj.data.vertices:
        v=vertex.co;p=(float(v.x),float(v.z),float(-v.y))
        key=(region,*(math.floor(a/cell) for a in p));cells.setdefault(key,[]).append(p)
envelope=[]
for key,points in sorted(cells.items()):
    center=tuple(sum(p[k] for p in points)/len(points) for k in range(3))
    radius=max(math.dist(p,center) for p in points)
    # Include independent fin/streamer excursions, without thickening the trunk.
    pad=.035 if key[0]=='Body' else .085 if key[0]=='Median' else .12 if key[0]=='Streamers' else .16
    envelope.append([*[round(a,5) for a in center],round(radius+pad,5),4 if key[0]=='Streamers' else 0])
# Drop spheres fully contained in another sphere without losing any coverage.
kept=[]
for sphere in sorted(envelope,key=lambda s:-s[3]):
    if not any(sphere[4]==other[4] and math.dist(sphere[:3],other[:3])+sphere[3]<=other[3] for other in kept):kept.append(sphere)
envelope=kept
(ROOT/'lib'/'AngelfishEnvelope.json').write_text(json.dumps(envelope,separators=(',',':'))+'\n',encoding='utf-8')

# Keep a fully editable source and a studio proof, outside the site's public assets.
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=32
scene.world.color=(.07,.07,.07)
def light(name,p,power,size):
    d=bpy.data.lights.new(name,'AREA'); d.energy=power; d.shape='DISK'; d.size=size; o=bpy.data.objects.new(name,d); scene.collection.objects.link(o); o.location=xyz(p); o.rotation_euler=(Vector(xyz((-.2,0,0)))-o.location).to_track_quat('-Z','Y').to_euler()
light('Soft overhead',(1,4,3),260,4); light('Silver edge',(-2,1,-2),220,3); light('Frontal fill',(2,0,4),110,3)
d=bpy.data.cameras.new('Reference proof'); camera=bpy.data.objects.new('Reference proof',d); scene.collection.objects.link(camera); camera.location=xyz((2.2,.6,6.3)); camera.rotation_euler=(Vector(xyz((-.2,-.05,0)))-camera.location).to_track_quat('-Z','Y').to_euler(); d.type='ORTHO'; d.ortho_scale=3.45; scene.camera=camera
scene.render.resolution_x=1000; scene.render.resolution_y=1100; scene.render.resolution_percentage=100; scene.render.image_settings.file_format='PNG'; scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.render.filepath=str(ROOT/'model-source'/'angelfish-proof.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'model-source'/'silver-angelfish.blend'))
bpy.ops.render.render(write_still=True)
print('ANGELFISH_EXPORT',triangles,len(fish), (OUT/'silver-angelfish.glb').stat().st_size)
