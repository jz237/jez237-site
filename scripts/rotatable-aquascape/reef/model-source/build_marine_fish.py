import bpy, math, json, os
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent/'assets'/'fish';OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'profiles.json').read_text(encoding='utf-8'))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=20
scene.render.resolution_x=1100;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.world.color=(.06,.07,.09);scene.view_settings.view_transform='AgX'

def xyz(p):return (p[0],-p[2],p[1])
def interp(points,x):
 for i in range(1,len(points)):
  if x<=points[i][0]:
   a,ya=points[i-1];b,yb=points[i];left=points[max(0,i-2)];right=points[min(len(points)-1,i+1)]
   t=max(0,min(1,(x-a)/(b-a)));m0=(yb-left[1])/(b-left[0]);m1=(right[1]-ya)/(right[0]-a)
   return (2*t**3-3*t*t+1)*ya+(t**3-2*t*t+t)*m0*(b-a)+(-2*t**3+3*t*t)*yb+(t**3-t*t)*m1*(b-a)
 return points[-1][1]

def make_material(name,image=None,rough=.43,alpha=1):
 mat=bpy.data.materials.new(name);mat.use_nodes=True;n=mat.node_tree.nodes;p=n.get('Principled BSDF')
 p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=.035;p.inputs['Coat Weight'].default_value=.12
 p.inputs['Alpha'].default_value=alpha
 if alpha<1:mat.surface_render_method='DITHERED';mat.use_transparency_overlap=False
 if image:
  tex=n.new('ShaderNodeTexImage');tex.image=image;mat.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
 return mat

def make_mesh(name,vertices,faces,uvs,material):
 name=species+'__'+name;mesh=bpy.data.meshes.new(name);mesh.from_pydata([xyz(v) for v in vertices],[],faces);mesh.update()
 obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj);obj.data.materials.append(material)
 layer=mesh.uv_layers.new(name='Reference projection')
 for face in mesh.polygons:
  face.use_smooth=True
  for li in face.loop_indices:layer.data[li].uv=uvs[mesh.loops[li].vertex_index]
 return obj

metadata={}
for species,s in DATA.items():
 # Every species has its own traced silhouette, rather than scaling one oval.
 original=bpy.data.images.load(str(ROOT/'references'/(species+'.png')),check_existing=True)
 iw,ih=original.size;original.file_format='JPEG';original.filepath_raw=str(OUT/(species+'-reference.jpg'));original.save()
 original=bpy.data.images.load(str(OUT/(species+'-reference.jpg')),check_existing=False)
 clean=ROOT/'references'/(species+'-skin.png')
 if not clean.exists():raise RuntimeError('Missing clean-flank image: '+str(clean))
 skinimg=bpy.data.images.load(str(clean),check_existing=True)
 skinimg.file_format='JPEG';skinimg.filepath_raw=str(OUT/(species+'-skin.jpg'));skinimg.save()
 skinimg=bpy.data.images.load(str(OUT/(species+'-skin.jpg')),check_existing=False)
 skin=make_material(species+' skin',skinimg,.44);fin=make_material(species+' fin membrane',skinimg,.48,.9);pectoralFin=make_material(species+' pectoral membrane',original,.48,.9);eyeMat=make_material(species+' cornea',original,.23)
 begin,end=s['range'];length=end-begin;cy=s['cy'];width=s['width'];objects=[]
 def pos(px,py,depth=0):return ((px-begin)/length-.5,(cy-py)/length,depth)
 def uv(px,py):return (px/iw,1-py/ih)
 def trunk_thickness(t):
  # A narrow continuous peduncle meets the thin tail membrane. Keep the
  # head and full trunk dimensions; remove only the abrupt rear end-cap lip.
  u=max(0,min(1,t/.12));u=u*u*(3-2*u)
  return width*(.004+.096*u+.90*math.sin(math.pi*t)**.62)
 def surface(px,py):
  top=interp(s['top'],px);bottom=interp(s['bottom'],px);mid=(top+bottom)/2;radius=max(1,(bottom-top)/2)
  t=max(0,min(1,(px-begin)/length));thickness=trunk_thickness(t)
  return thickness*math.sqrt(max(0,1-((py-mid)/radius)**2))
 vertices=[];uvs=[];faces=[];rings=88;sides=48
 for i in range(rings+1):
  px=begin+length*i/rings;top=interp(s['top'],px);bottom=interp(s['bottom'],px);mid=(top+bottom)/2;radius=(bottom-top)/2
  for j in range(sides):
   a=2*math.pi*j/sides;py=mid-radius*math.sin(a);t=i/rings;depth=math.cos(a)*trunk_thickness(t)
   vertices.append(pos(px,py,depth));uvs.append(uv(px,py))
   if i<rings:
    n=i*sides+j;nn=i*sides+(j+1)%sides;faces.append((n,n+sides,nn+sides,nn))
 # Close the tail; the head instead folds into a real recessed oral cavity.
 px=begin;py=(interp(s['top'],px)+interp(s['bottom'],px))/2;center=len(vertices);vertices.append(pos(px,py));uvs.append(uv(px,py))
 for j in range(sides):faces.append((center,j,(j+1)%sides))
 colors=[(1,1,1,1)]*len(vertices)
 top=interp(s['top'],end);bottom=interp(s['bottom'],end);mid=(top+bottom)/2;radius=(bottom-top)/2
 previous=rings*sides
 for offset,ratio,shade in [( .005,.88,1),(.002,.59,.55),(-.023,.28,.065)]:
  start=len(vertices)
  for j in range(sides):
   a=2*math.pi*j/sides;py=mid-radius*ratio*math.sin(a)
   vertices.append(pos(end+offset*length,py,math.cos(a)*trunk_thickness(1)*ratio));uvs.append(uv(end-7,mid-radius*.85*math.sin(a)));colors.append((shade,shade,shade,1))
   faces.append((previous+j,start+j,start+(j+1)%sides,previous+(j+1)%sides))
  previous=start
 center=len(vertices);vertices.append(pos(end-.03*length,mid));uvs.append(uv(end-7,mid));colors.append((.035,.035,.035,1))
 for j in range(sides):faces.append((center,previous+(j+1)%sides,previous+j))
 bodySkin=skin.copy();bodySkin.name=species+' lip and cavity tissue';nodes=bodySkin.node_tree.nodes
 vertex=nodes.new('ShaderNodeVertexColor');vertex.layer_name='Oral depth'
 texture=next(n for n in nodes if n.type=='TEX_IMAGE');mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1
 bodySkin.node_tree.links.new(texture.outputs['Color'],mix.inputs[1]);bodySkin.node_tree.links.new(vertex.outputs['Color'],mix.inputs[2]);bodySkin.node_tree.links.new(mix.outputs[0],nodes.get('Principled BSDF').inputs['Base Color'])
 body=make_mesh('body',vertices,faces,uvs,bodySkin)
 colorLayer=body.data.color_attributes.new(name='Oral depth',type='FLOAT_COLOR',domain='POINT')
 for i,color in enumerate(colors):colorLayer.data[i].color=color
 objects.append(body)
 def fin_mesh(name,polygon,side=0,pivot=None):
  # Concave fins are tessellated without a fan crossing the fork/edge.
  control=[Vector((float(x),float(y),0)) for x,y in polygon];p=[]
  # Rounded free margins retain the traced locations without angular cardboard corners.
  for i in range(len(control)):
   a,b,c,d=[control[q%len(control)] for q in [i-1,i,i+1,i+2]]
   for k in range(5):
    t=k/5;p.append((2*b+(c-a)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)*.5)
  triangles=tessellate_polygon([p]);v=[];f=[];tex=[]
  def tri(a,b,c,level):
   if level:
    ab=(a+b)*.5;bc=(b+c)*.5;ca=(c+a)*.5
    for three in [(a,ab,ca),(ab,b,bc),(ca,bc,c),(ab,bc,ca)]:tri(*three,level-1)
   else:
    n=len(v)
    for q in [a,b,c]:
     px,py=q.x,q.y;depth=.001
     if side:
      depth=side*max(surface(px,py)+.0005,surface(pivot[0],pivot[1])+.0005+max(0,pivot[0]-px)/length*.15)
     p3=pos(px,py,depth)
     if pivot:
      anchor=pos(pivot[0],pivot[1],side*(surface(pivot[0],pivot[1])+.0005));p3=tuple(p3[k]-anchor[k] for k in range(3))
     v.append(p3);tex.append(uv(px,py))
    f.append((n,n+1,n+2))
  for t in triangles:tri(*[p[q] if isinstance(q,int) else q for q in t],2 if not side else 1)
  ob=make_mesh(name,v,f,tex,pectoralFin if side else fin)
  # All thin fins intentionally double-sided, with GPU flex at runtime.
  if pivot:ob.location=xyz(pos(pivot[0],pivot[1],side*(surface(pivot[0],pivot[1])+.0005)))
  return ob
 # Dorsal ribbon is rooted continuously into the upper trunk. Every column
 # touches the body surface, including low valleys between the dorsal spines.
 dorsal=s['dorsal'];v=[];tex=[];f=[];cols=220;rows=9
 for i in range(cols+1):
  px=dorsal[0][0]+(dorsal[-1][0]-dorsal[0][0])*i/cols
  lower=interp(s['top'],px)+3
  upper=float(np.interp(px,[p[0] for p in dorsal],[p[1] for p in dorsal]))
  fade=min(1,i/cols/.045,(1-i/cols)/.045);fade=fade*fade*(3-2*fade);upper=lower+(upper-lower)*fade
  for j in range(rows+1):
   t=j/rows;py=lower+(upper-lower)*t;v.append(pos(px,py,math.sin(t*math.pi)*.002));tex.append(uv(px,py))
   if i<cols and j<rows:
    a=i*(rows+1)+j;f.append((a,a+1,a+rows+2,a+rows+1))
 objects.append(make_mesh('fin_1',v,f,tex,fin))
 for i,polygon in enumerate(s['fins']):
  if i!=1:objects.append(fin_mesh('fin_'+str(i),polygon))
 for side in [-1,1]:
  objects.append(fin_mesh('pectoral_'+str(side),s['pec'],side,s['pec'][0]))
  # Thin conformed operculum over the same UV detail; opens subtly at runtime.
  gx,gy0,gy1=s['gill'];v=[];tex=[];f=[]
  for row in range(19):
   py=gy0+(gy1-gy0)*row/18
   for col in range(7):
    px=gx+(col/6-.5)*length*.072+math.sin(row/18*math.pi)*length*.025
    v.append(pos(px,py,side*(surface(px,py)+.0002+.0011*math.sin(row/18*math.pi)*math.sin(col/6*math.pi))));tex.append(uv(px,py))
    if row<18 and col<6:
     a=row*7+col;ids=(a,a+1,a+8,a+7);f.append(tuple(reversed(ids)) if side>0 else ids)
  objects.append(make_mesh('gill_'+str(side),v,f,tex,skin))
  # A shallow, UV-matched corneal dome retains the reference iris instead of
  # bulging generic spheres. Both sides are fully modeled.
  ex,ey,er=s['eye'];v=[];tex=[];f=[]
  for row in range(9):
   rr=row/8
   for col in range(33):
    a=col/32*2*math.pi;px=ex+er*rr*math.cos(a);py=ey+er*rr*math.sin(a)
    v.append(pos(px,py,side*(surface(px,py)+.001+.0025*(1-rr*rr))));tex.append(uv(px,py))
    if row<8 and col<32:
     a0=row*33+col;ids=(a0,a0+1,a0+34,a0+33);f.append(ids if side>0 else tuple(reversed(ids)))
  objects.append(make_mesh('eye_'+str(side),v,f,tex,eyeMat))
 # Export each species at origin; one editable master stores all six collections.
 bpy.ops.object.select_all(action='DESELECT')
 for obj in objects:obj.select_set(True)
 bpy.context.view_layer.objects.active=objects[0]
 bpy.ops.export_scene.gltf(filepath=str(OUT/(species+'.glb')),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False,export_cameras=False,export_lights=False,export_image_format='JPEG',export_jpeg_quality=95,export_vertex_color='ACTIVE')
 triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
 metadata[species]={'mouth':pos(*s['mouth']),'triangles':triangles,'meshes':len(objects),'reference':species+'.png','authoring':'Blender '+bpy.app.version_string,'bodyLength':1,'width':width,'upper':[pos(x,y)[:2] for x,y in s['top']],'lower':[pos(x,y)[:2] for x,y in s['bottom']]}
 collection=bpy.data.collections.new(species);scene.collection.children.link(collection)
 for obj in objects:
  for coll in list(obj.users_collection):coll.objects.unlink(obj)
  collection.objects.link(obj)
 collection.hide_render=True

# Neutral three-quarter proofs test depth, fins and the opposite flank.
def light(name,p,power,size):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=xyz(p);o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
light('Broad key',(0,2,3),150,3);light('Rim',(-2,1,-2),120,2);light('Fill',(2,0,2),65,2)
d=bpy.data.cameras.new('Model proof');camera=bpy.data.objects.new('Model proof',d);scene.collection.objects.link(camera);camera.location=xyz((1.1,.35,3.7));camera.rotation_euler=(Vector(xyz((-.15,0,0)))-camera.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=1.85;scene.camera=camera
scene.render.image_settings.file_format='PNG'
for species in DATA:
 coll=bpy.data.collections[species];coll.hide_render=False;scene.render.filepath=str(ROOT/'proofs'/(species+'-blender.png'));bpy.ops.render.render(write_still=True);coll.hide_render=True
for coll in scene.collection.children:coll.hide_render=False
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'marine-fish.blend'),compress=True)
(OUT/'model-info.json').write_text(json.dumps(metadata,indent=2)+'\n',encoding='utf-8',newline='\n')
print('MARINE_MODELS',json.dumps(metadata))
