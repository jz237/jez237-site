"""Blender-authored adult watercraft rider with articulated anatomical parts.
Uses the original jet-ski builder's modeling utilities; exports an editable scene,
GLB and material-batched bone-local geometry for the browser pose rig.
"""
from pathlib import Path
exec((Path(__file__).parent/'build_jetski.py').read_text(encoding='utf-8').split('# Hull:')[0])
material('Skin','bf8967',0,.56,.02)
material('Skin shadow','965e48',0,.67)
material('Lips','99665a',0,.58)
material('Eye white','cbc6bb',0,.34)
material('Iris','35443e',0,.31)
material('Pupil','101619',0,.23)
material('Neoprene','172029',0,.74)
material('Stretch panels','303840',0,.82)
material('Vest livery','b9542d',0,.75)
material('Vest seam','56616b',0,.83)
material('Impact foam','26313b',0,.67)
material('Webbing','151d23',0,.94)
material('Reflective tape','bfcac2',.12,.51)
material('Helmet shell','162027',.22,.23,.9)
material('Helmet graphic','b9542d',.12,.3,.6)
material('Helmet lining','253239',0,.85)
material('Goggle lens','526772',.15,.15,.7)
specs['Goggle lens'].update(metalness=.42,roughness=.12,clearcoat=1)

# Rest pose: adult dimensions fitted to the actual saddle, footwells and grips.
hip=Vector((0,.865,-.34));shoulder=Vector((0,1.405,.02))
neck=Vector((0,1.475,.085));crown=Vector((0,1.79,.115))
bones={'torso':(hip,shoulder),'head':(neck,crown),'pelvis':(hip,hip+Vector((0,.15,.015)))}
for side,label in [(-1,'L'),(1,'R')]:
 sh=Vector((side*.225,1.392,.02));el=Vector((side*.335,1.155,.355));wr=Vector((side*.445,1.132,.704))
 thigh=Vector((side*.14,.845,-.34));knee=Vector((side*.395,.635,.12));ankle=Vector((side*.50,.44,-.34))
 bones.update({f'upperArm{label}':(sh,el),f'forearm{label}':(el,wr),f'hand{label}':(wr,wr+Vector((0,0,.095))),
  f'thigh{label}':(thigh,knee),f'shin{label}':(knee,ankle),f'foot{label}':(ankle,ankle+Vector((0,-.025,.17)))})
def part(o,bone):o['game_group']=bone;return o
def anatomy(name,bone,sections,mat):
 a,b=bones[bone];direction=(b-a).normalized();q=Vector((0,1,0)).rotation_difference(direction);vs=[];n=20
 for t,rx,rz in sections:
  for j in range(n):
   angle=2*math.pi*j/n;p=q@Vector((rx*math.cos(angle),(b-a).length*t,rz*math.sin(angle)))+a;vs.append(tuple(p))
 faces=[]
 for i in range(len(sections)-1):
  for j in range(n):faces.append((i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n))
 faces.extend([tuple(range(n)),tuple(reversed([(len(sections)-1)*n+j for j in range(n)]))])
 return mesh(name,vs,faces,mat,bone,sub=1)
def vertical(name,sections,mat,bone,sub=2):
 vs=[];n=32
 for y,rx,rz,z in sections:
  for j in range(n):
   a=j*2*math.pi/n;vs.append((math.cos(a)*rx,y,z+math.sin(a)*rz))
 faces=[]
 for i in range(len(sections)-1):
  for j in range(n):faces.append((i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n))
 faces.extend([tuple(range(n)),tuple(reversed([(len(sections)-1)*n+j for j in range(n)]))])
 return mesh(name,vs,faces,mat,bone,sub=sub)

def ribbon(name,points,r,mat,bone):
 vs=[]
 for i,p in enumerate(points):
  tangent=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])
  across=tangent.cross(Vector((0,0,-1))).normalized()*r
  vs.extend([tuple(Vector(p)-across),tuple(Vector(p)+across)])
 o=mesh(name,vs,[(i*2,i*2+1,i*2+3,i*2+2) for i in range(len(points)-1)],mat,bone)
 m=o.modifiers.new('Woven strap thickness','SOLIDIFY');m.thickness=.0015
 return o

# Sculpted torso: tapered waist, rib cage, shoulders and collar rather than a ball.
vertical('01 / Anatomical wetsuit torso',[(.86,.145,.09,-.34),(.92,.16,.105,-.30),(1.04,.17,.105,-.215),
 (1.20,.206,.119,-.12),(1.34,.218,.111,-.025),(1.40,.202,.088,.012),(1.45,.105,.07,.06)],'Neoprene','torso')
vertical('02 / Fitted flotation vest',[(.975,.174,.118,-.26),(1.01,.187,.139,-.237),(1.16,.227,.145,-.142),
 (1.30,.245,.134,-.06),(1.365,.225,.12,-.02),(1.414,.148,.087,.025)],'Webbing','torso')
vertical('03 / Hip and seat fabric',[(.78,.14,.135,-.37),(.83,.20,.152,-.35),(.9,.194,.12,-.32),(.955,.158,.09,-.28)],'Neoprene','pelvis')
rod('Exposed neck',(0,1.419,.061),(0,1.545,.10),.059,'Skin','head',r2=.057)
rod('Wetsuit neck sleeve',(0,1.402,.035),(0,1.445,.078),.067,'Neoprene','torso',r2=.064)
for side in [-1,1]:
 # Independent shaped flotation blocks sit on a close-fitting textile carrier.
 # Their gaps and bound edges read as actual equipment at chase distance.
 for k,(y,z,w) in enumerate([(1.045,-.351,.143),(1.157,-.285,.178),(1.276,-.203,.172)]):
  o=part(box('Segmented rear flotation pad',(side*(w*.5+.007),y,z-.012),(w,.103,.045),'Impact foam',.018),'torso');o.rotation_euler.x=.59
 for y,z,w in [(1.12,-.014,.142),(1.27,.068,.15)]:
  o=part(box('Contoured chest flotation',(side*.091,y,z-.021),(w,.132,.035),'Impact foam',.02),'torso');o.rotation_euler.x=.62
 ribbon('Colour-coded side panel',[(side*.182,1.035,-.246),(side*.221,1.18,-.144),(side*.23,1.305,-.052)],.026,'Vest livery','torso')
 ribbon('Racing shoulder tab',[(side*.165,1.34,-.118),(side*.174,1.398,-.045),(side*.147,1.405,.037)],.025,'Vest livery','torso')
 ribbon('Rear harness shoulder webbing',[(side*.127,1.04,-.394),(side*.14,1.20,-.3),(side*.124,1.345,-.18)],.011,'Webbing','torso')
 for y,z in [(1.07,-.377),(1.245,-.252)]:
  part(box('Harness adjustment loop',(side*.135,y,z),(.039,.036,.015),'Dark anodized metal',.004),'torso')
 # Flat-lock seams and fabric folds replace unbroken mannequin-like surfaces.
 for j in range(4):
  tube('Waist compression fold',[(side*.075,.92+j*.016,-.42+j*.018),(side*.14,.925+j*.016,-.4+j*.018),(side*.179,.939+j*.015,-.362+j*.018)],.0035,'Stretch panels','pelvis')
 # Sewn channels contour the back of the vest; shallow panels read as cloth.
 tube('Shoulder binding',[(side*.174,1.37,-.086),(side*.18,1.409,-.01),(side*.157,1.37,.08)],.012,'Webbing','torso')
 ribbon('Reflective back shoulder',[(side*.162,1.20,-.262),(side*.163,1.27,-.205),(side*.148,1.333,-.143)],.012,'Reflective tape','torso')
 ribbon('Reflective chest shoulder',[(side*.145,1.26,.066),(side*.15,1.327,.091),(side*.133,1.37,.09)],.010,'Reflective tape','torso')
 for y,z in [(1.065,-.35),(1.16,-.287)]:
  ribbon('Rear webbing band',[(-.163,y+.01,z+.028),(0,y,z),(.163,y+.01,z+.028)],.009,'Webbing','torso')
for y,z in [(1.06,-.092),(1.16,.002)]:
 part(box('Front quick release',(0,y,z+.019),(.044,.025,.017),'Graphite composite',.005),'torso')
 ribbon('Front strap',[(-.18,y+.009,z-.02),(0,y,z),(.18,y+.009,z-.02)],.009,'Webbing','torso')
tube('Vest front zipper',[(0,1.02,-.12),(0,1.16,.012),(0,1.30,.078),(0,1.365,.082)],.0035,'Brushed titanium','torso')
part(box('Zipper pull',(0,1.29,.084),(.012,.028,.008),'Brushed titanium',.003),'torso')
label=part(text('Rear vest label','R / 01',(0,1.29,-.237),.028,'Reflective tape'),'torso');label.rotation_euler.rotate_axis('Y',math.pi)

# Tapered limbs carry muscle volume and neoprene reinforcement. Joint overlaps
# sit inside the clothing, avoiding the old visible ball-and-stick silhouette.
for side,label in [(-1,'L'),(1,'R')]:
 anatomy('Sculpted deltoid biceps and triceps',f'upperArm{label}',[(-.14,.032,.035),(-.04,.077,.073),(.10,.091,.084),(.27,.097,.084),(.48,.082,.078),(.67,.077,.064),(.88,.057,.051),(1.08,.051,.048)],'Skin')
 anatomy('Anatomical forearm and wrist',f'forearm{label}',[(-.11,.047,.045),(0,.056,.051),(.17,.076,.065),(.34,.069,.057),(.58,.054,.047),(.82,.042,.037),(1.07,.035,.032)],'Skin')
 anatomy('Short glove cuff',f'forearm{label}',[(.88,.041,.037),(.91,.043,.038),(1.04,.039,.036)],'Webbing')
 anatomy('Contoured thigh',f'thigh{label}',[(-.15,.105,.098),(0,.116,.108),(.25,.116,.102),(.6,.092,.086),(.88,.076,.07),(1.04,.068,.062)],'Neoprene')
 anatomy('Shin and calf',f'shin{label}',[(-.08,.064,.06),(.1,.071,.066),(.32,.08,.07),(.62,.059,.053),(.95,.044,.043),(1.05,.044,.04)],'Neoprene')
 for bone in [f'thigh{label}',f'shin{label}']:
  a,b=bones[bone];r=.052 if 'Arm' in bone or 'fore' in bone else .061
  direction=(b-a).normalized();points=[]
  for t in [.15,.38,.66,.87]:
   p=a.lerp(b,t)+Vector((side*r,0,-.018));points.append(tuple(p))
  tube('Flatlock sleeve seam',points,.0022,'Stretch panels',bone)
 knee=bones[f'thigh{label}'][1]
 part(ellipsoid('Knee abrasion pad',tuple(knee+Vector((0,.022,.025))),(.078,.066,.047),'Stretch panels'),f'thigh{label}')
 a,b=bones[f'forearm{label}'];part(ellipsoid('Elbow olecranon',tuple(a+Vector((0,-.012,-.014))),(.049,.036,.041),'Skin'),f'forearm{label}')
 a,b=bones[f'thigh{label}']
 for j in range(4):
  p=a.lerp(b,.57+j*.065)
  tube('Flexed neoprene thigh folds',[tuple(p+Vector((-side*.045,.045,-.052))),tuple(p+Vector((0,.065,-.059))),tuple(p+Vector((side*.065,.047,-.041)))],.003,'Stretch panels',f'thigh{label}')
 wrist=bones[f'hand{label}'][0]
 part(ellipsoid('Gloved palm',tuple(wrist+Vector((0,-.005,.026))),(.048,.036,.056),'Webbing'),f'hand{label}')
 part(ellipsoid('Glove knuckle padding',tuple(wrist+Vector((0,.022,.018))),(.044,.012,.028),'Stretch panels'),f'hand{label}')
 for finger in range(4):
  x=wrist.x+(finger-1.5)*.021
  tube('Individual gripping finger',[(x,1.145,.73),(x,1.12,.76),(x,1.088,.747),(x,1.084,.723)],.0095,'Webbing',f'hand{label}')
 tube('Opposing glove thumb',[(wrist.x-side*.039,1.13,.705),(wrist.x-side*.063,1.10,.72),(wrist.x-side*.042,1.087,.739)],.012,'Webbing',f'hand{label}')
 ankle=bones[f'foot{label}'][0]
 part(ellipsoid('Boot ankle',tuple(ankle+Vector((0,.024,0))),(.059,.093,.078),'Webbing'),f'foot{label}')
 part(ellipsoid('Molded watersport boot',tuple(ankle+Vector((0,-.022,.069))),(.079,.047,.148),'Webbing'),f'foot{label}')
 part(box('Non-slip boot sole',tuple(ankle+Vector((0,-.051,.067))),(.158,.022,.27),'Traction rubber',.027),f'foot{label}')
 for j in range(3):
  tube('Boot instep flex seam',[(ankle.x-.058,.455,-.32+j*.034),(ankle.x,.48,-.32+j*.034),(ankle.x+.058,.455,-.32+j*.034)],.003,'Stretch panels',f'foot{label}')

# Adult face: shaped jaw, cheeks, brow and forehead, with visible nose and lips.
vertical('04 / Sculpted head',[(1.531,.032,.039,.111),(1.553,.065,.07,.115),(1.584,.08,.084,.117),
 (1.63,.094,.09,.106),(1.68,.101,.094,.103),(1.72,.102,.093,.099),(1.76,.095,.09,.092),
 (1.80,.068,.063,.086),(1.824,.015,.017,.079)],'Skin','head')
# Jaw is continuous with the head mesh; no separate protruding chin primitive.
part(ellipsoid('Nasal bridge',(0,1.68,.195),(.014,.037,.021),'Skin'),'head')
part(ellipsoid('Nose tip',(0,1.654,.222),(.019,.016,.02),'Skin'),'head')
for side in [-1,1]:
 part(ellipsoid('Nose wing',(side*.016,1.648,.211),(.013,.011,.014),'Skin'),'head')
 part(ellipsoid('Nostril',(side*.012,1.643,.222),(.005,.003,.004),'Skin shadow'),'head')
 part(ellipsoid('Ear',(side*.098,1.659,.081),(.019,.039,.022),'Skin'),'head')
 part(ellipsoid('Ear inner fold',(side*.111,1.66,.088),(.007,.023,.012),'Skin shadow'),'head')
 part(ellipsoid('Eye socket',(side*.039,1.7,.184),(.027,.015,.012),'Skin shadow'),'head')
 part(ellipsoid('Eye',(side*.039,1.7,.192),(.023,.009,.011),'Eye white'),'head')
 part(ellipsoid('Iris',(side*.039,1.70,.201),(.008,.008,.003),'Iris'),'head')
 part(ellipsoid('Pupil',(side*.039,1.70,.204),(.0038,.0045,.0015),'Pupil'),'head')
 tube('Upper eyelid',[(side*.018,1.702,.194),(side*.038,1.71,.201),(side*.061,1.702,.191)],.003,'Skin','head')
 tube('Brow',[(side*.016,1.723,.188),(side*.04,1.727,.192),(side*.065,1.719,.179)],.004,'Skin shadow','head')
tube('Upper lip',[(-.027,1.62,.197),(-.01,1.623,.207),(0,1.62,.21),(.01,1.623,.207),(.027,1.62,.197)],.0038,'Lips','head')
tube('Lower lip',[(-.024,1.615,.198),(0,1.613,.209),(.024,1.615,.198)],.0035,'Lips','head')

# Full-face race helmet: shell, projecting chin guard, visor opening, padded
# neck roll, intake vents and original graphic panels (no licensed logos).
vs=[];faces=[];rows=14;cols=48
for i in range(rows+1):
 for j in range(cols):
  phi=2*math.pi*j/cols;front=max(0,math.cos(phi));theta=(.02+i/rows)*(1.92-front*.45)
  vs.append((.119*math.sin(theta)*math.sin(phi),1.718+.13*math.cos(theta),.085+.118*math.sin(theta)*math.cos(phi)))
for i in range(rows):
 for j in range(cols):faces.append((i*cols+j,(i+1)*cols+j,(i+1)*cols+(j+1)%cols,i*cols+(j+1)%cols))
helmet=mesh('05 / Composite race helmet shell',vs,faces,'Helmet shell','head',sub=1)
mod=helmet.modifiers.new('Helmet shell thickness','SOLIDIFY');mod.thickness=.008
tube('Helmet lower edge',[vs[rows*cols+j] for j in range(0,cols,3)]+[vs[rows*cols]],.006,'Helmet lining','head')
for side in [-1,1]:
 tube('Helmet brow vent',[(side*.033,1.839,.075),(side*.038,1.834,.12),(side*.042,1.819,.153)],.007,'Helmet lining','head')
 tube('Temple chin strap',[(side*.099,1.691,.034),(side*.091,1.606,.094),(side*.035,1.551,.15)],.007,'Webbing','head')
 part(ellipsoid('Strap rivet',(side*.115,1.7,.035),(.005,.009,.009),'Brushed titanium'),'head')
tube('Chin strap',[(-.035,1.551,.15),(0,1.548,.162),(.035,1.551,.15)],.007,'Webbing','head')
vs=[];faces=[];n=48
for y,rx,back,front in [(1.556,.064,.027,.207),(1.574,.106,-.014,.257),(1.606,.124,-.022,.269),(1.637,.123,-.021,.258),(1.654,.115,-.019,.238)]:
 for j in range(n):
  a=j*2*math.pi/n;c=math.cos(a);vs.append((rx*math.sin(a),y+max(0,-c)*.025,.086+c*((front-.086) if c>0 else (.086-back))))
for i in range(4):
 for j in range(n):faces.append((i*n+j,i*n+(j+1)%n,(i+1)*n+(j+1)%n,(i+1)*n+j))
guard=mesh('06 / Protective sculpted chin bar',vs,faces,'Helmet shell','head',sub=1)
mod=guard.modifiers.new('Chin bar thickness','SOLIDIFY');mod.thickness=.012
tube('Padded lower neck roll',[(-.093,1.569,.147),(-.075,1.558,.024),(0,1.555,.009),(.075,1.558,.024),(.093,1.569,.147)],.012,'Helmet lining','head')
for side in [-1,1]:
 tube('Reinforced visor pillar',[(side*.112,1.623,.135),(side*.118,1.687,.127),(side*.103,1.735,.14)],.015,'Helmet shell','head')
 ribbon('Rear helmet graphic',[(side*.049,1.665,-.021),(side*.055,1.717,-.02),(side*.042,1.78,-.008)],.012,'Helmet graphic','head')
 ribbon('Crown racing stripe',[(side*.034,1.838,.057),(side*.04,1.841,.10),(side*.038,1.818,.167)],.01,'Reflective tape','head')
 for j in range(3):
  tube('Chin vent inlet',[(side*.027+j*side*.015,1.605,.266-j*.007),(side*.029+j*side*.015,1.634,.257-j*.007)],.004,'Helmet lining','head')
 part(ellipsoid('Visor pivot screw',(side*.119,1.697,.127),(.005,.013,.013),'Brushed titanium'),'head')
vs=[];faces=[];n=24
for i in range(5):
 for j in range(n+1):
  a=(j/n-.5)*2.18;y=1.666+i*.013
  vs.append((.12*math.sin(a),y,.106+.131*math.cos(a)))
for i in range(4):
 for j in range(n):a=i*(n+1)+j;faces.append((a,a+1,a+n+2,a+n+1))
mesh('07 / Curved smoked optical visor',vs,faces,'Goggle lens','head',sub=1)
for row in [0,4]:tube('Visor rubber seal',vs[row*(n+1):(row+1)*(n+1)],.004,'Helmet lining','head')
tube('Aerodynamic brow edge',[(-.102,1.733,.16),(-.055,1.75,.227),(0,1.752,.245),(.055,1.75,.227),(.102,1.733,.16)],.009,'Helmet shell','head')

# Settle the pelvis onto the saddle, shorten exposed neck and lean into the grips.
# Bone-space affine transforms preserve editable primitives and curve details.
from mathutils import Matrix
old_bones={k:(a.copy(),b.copy()) for k,(a,b) in bones.items()}
bones['pelvis']=tuple(p+Vector((0,-.10,0)) for p in old_bones['pelvis'])
bones['torso']=(old_bones['torso'][0]+Vector((0,-.10,0)),old_bones['torso'][1]+Vector((0,0,.055)))
bones['head']=tuple(p+Vector((0,-.045,.055)) for p in old_bones['head'])
for label in ['L','R']:
 a,b=old_bones['upperArm'+label];bones['upperArm'+label]=(a+Vector((0,0,.055)),b)
 a,b=old_bones['thigh'+label];bones['thigh'+label]=(a+Vector((0,-.10,0)),b)
C=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))
def frame(pair):
 a,b=pair;d=b-a;q=Vector((0,1,0)).rotation_difference(d.normalized())
 return Matrix.Translation(a)@q.to_matrix().to_4x4()@Matrix.Diagonal((1,d.length,1,1))
bpy.context.view_layer.update()
for obj in list(bpy.context.scene.objects):
 if 'game_group' in obj:
  bone=obj['game_group'];obj.matrix_world=C@frame(bones[bone])@frame(old_bones[bone]).inverted()@C.inverted()@obj.matrix_world

# Skin and textile microstructure for Blender renders. Browser materials add
# matching subtle repeating normal maps without downloading external textures.
for name,scale,strength in [('Skin',160,.1),('Neoprene',220,.17),('Vest livery',150,.14),('Stretch panels',240,.2)]:
 m=materials[name];nodes=m.node_tree.nodes;noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=scale
 bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=strength;bump.inputs['Distance'].default_value=.001
 m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])

# Export each articulated mesh in its bone frame (Y along the limb).
bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();batches={}
objects=[o for o in bpy.context.scene.objects if 'game_group' in o]
for obj in objects:
 bone=obj['game_group'];a,b=bones[bone];q=Vector((0,1,0)).rotation_difference((b-a).normalized());inv=q.inverted()
 ev=obj.evaluated_get(deps);m=ev.to_mesh();m.calc_loop_triangles();nm=obj.matrix_world.to_3x3().inverted().transposed()
 for tri in m.loop_triangles:
  mat=m.materials[tri.material_index].name;out=batches.setdefault((bone,mat),[])
  for vi,li in zip(tri.vertices,tri.loops):
   p=inv@(Vector(game(obj.matrix_world@m.vertices[vi].co))-a);n=inv@Vector(game((nm@m.corner_normals[li].vector).normalized()))
   out.extend((*p,*n))
 ev.to_mesh_clear()
used={mat for bone,mat in batches};meta={'version':1,'materials':{k:specs[k] for k in used},'bones':{k:{'start':list(a),'end':list(b),'length':(b-a).length} for k,(a,b) in bones.items()},'meshes':[]};offset=0
with (ASSETS/'coastal-rider.bin').open('wb') as f:
 for (bone,mat),values in batches.items():
  f.write(struct.pack('<'+'f'*len(values),*values));meta['meshes'].append({'bone':bone,'material':mat,'offset':offset,'vertices':len(values)//6});offset+=len(values)*4
(ASSETS/'coastal-rider.json').write_text(json.dumps(meta,separators=(',',':')),encoding='utf-8')
print('RIDER EXPORT',sum(x['vertices'] for x in meta['meshes'])//3,'triangles',len(batches),'batches',flush=True)
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0];bpy.ops.export_scene.gltf(filepath=str(ASSETS/'Coastal Rider.glb'),use_selection=True,export_apply=True)

# A visible armature organizes the editable parts and supplies pose handles.
bpy.ops.object.armature_add();arm=bpy.context.object;arm.name='Rider / articulation rig';bpy.ops.object.mode_set(mode='EDIT');arm.data.edit_bones.remove(arm.data.edit_bones[0])
for name,(a,b) in bones.items():bone=arm.data.edit_bones.new(name);bone.head=xyz(a);bone.tail=xyz(b)
bpy.ops.object.mode_set(mode='OBJECT');arm.show_in_front=True
for obj in objects:
 world=obj.matrix_world.copy();obj.parent=arm;obj.parent_type='BONE';obj.parent_bone=obj['game_group'];obj.matrix_world=world

# Bring in the approved watercraft as presentation context, not part of rider export.
with bpy.data.libraries.load(str(ROOT/'source/blender/Tideline R-01.blend'),link=False) as (data_from,data_to):
 data_to.objects=[name for name in data_from.objects if not name.startswith('Studio /')]
for o in data_to.objects:
 if o:bpy.context.collection.objects.link(o)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.55));bpy.context.object.data.materials.append(material('Studio rider floor','253b46',0,.52))
world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.22,.29,.34,1);world.node_tree.nodes['Background'].inputs[1].default_value=.45
def area(name,p,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector((0,0,.9))-o.location).to_track_quat('-Z','Y').to_euler()
area('Studio / key',(3,-4,5),1100,4,(.9,.96,1));area('Studio / rim',(-3,1,4),1400,3,(.68,.85,1));area('Studio / fill',(3,3,3),750,3,(1,.82,.65))
bpy.ops.object.camera_add(location=(3,-5,3));cam=bpy.context.object;cam.name='Studio / rider camera';cam.data.type='ORTHO';cam.data.ortho_scale=3.2;cam.rotation_euler=(xyz((0,1,.1))-cam.location).to_track_quat('-Z','Y').to_euler()
scene=bpy.context.scene;scene.camera=cam;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True;scene.render.resolution_x=1200;scene.render.resolution_y=1200;scene.render.resolution_percentage=100;scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'source/blender/Coastal Rider.blend'))
scene.render.filepath=str(ROOT/'source/blender/Coastal Rider front.png');bpy.ops.render.render(write_still=True)
cam.location=(3,5,3);cam.rotation_euler=(xyz((0,1,-.1))-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(ROOT/'source/blender/Coastal Rider rear.png');bpy.ops.render.render(write_still=True)
