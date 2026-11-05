"""Export the owned Overload installation's original enemy meshes for a lazy gallery.
Usage: python enemy_gallery.py <Overload_Data> [output-game-directory]
Dependencies: UnityPy, NumPy, SciPy, Pillow. No existing flight packs are changed.
"""
from pathlib import Path
from collections import defaultdict
from io import BytesIO
import base64,gzip,json,re,struct,sys
import numpy as np
from scipy.spatial.transform import Rotation
from PIL import Image
import UnityPy
from UnityPy.helpers.MeshHelper import MeshHandler
src=Path(__file__).resolve().parent
ov=Path(sys.argv[1]);out=Path(sys.argv[2]) if len(sys.argv)>2 else src.parent
dest=out/'enemy-assets';dest.mkdir(exist_ok=True,parents=True)
env=UnityPy.load(str(ov/'resources.assets'))
prefabs={o.peek_name():o for o in env.objects if o.type.name=='GameObject' and (o.peek_name() or '').startswith('entity_enemy_')}
texts={o.peek_name():o.read().m_Script for o in env.objects if o.type.name=='TextAsset' and o.peek_name() in ['robot_data','desc_robots_EN']}
materials={};files={};report={}
def get_components(go):return {a.component.type.name:a.component for a in go.m_Component}
def vec(v):return np.array([v.x,v.y,v.z],dtype=float)
def matrix(t):
    q=t.m_LocalRotation;out=np.eye(4)
    out[:3,:3]=Rotation.from_quat([q.x,q.y,q.z,q.w]).as_matrix()@np.diag(vec(t.m_LocalScale))
    out[:3,3]=vec(t.m_LocalPosition);return out
def png(img):
    f=BytesIO();img.save(f,"PNG",compress_level=5);return f.getvalue()
def image(ref):
    return np.array(ref.read().image.convert("RGBA").resize((1024,1024),Image.Resampling.LANCZOS),dtype=float)/255
def mat_id(mat):
    key=mat.m_Name
    if key in materials:return materials[key]
    i=len(materials); props={k:v.m_Texture for k,v in mat.m_SavedProperties.m_TexEnvs if v.m_Texture.path_id}
    if '_MainTex' in props: albedo=image(props['_MainTex'])
    else:
        colors=dict(mat.m_SavedProperties.m_Colors); tint=colors.get('_Color'); rgb=([tint.r,tint.g,tint.b] if tint else [.26,.38,.45]);albedo=np.empty((1024,1024,4));albedo[:]=[*rgb,1.]
    # Preserve the authored UV layout, emission pattern and metal/roughness masks.
    albedo[:,:,3]=0
    e=next((props[k] for k in ('_Emission','_EmissionMap','_Emissive','_emission') if k in props),None)
    if e:albedo[:,:,3]=np.max(image(e)[:,:,:3],axis=2)
    detail=np.zeros_like(albedo);detail[:,:,:2]=.5;detail[:,:,2]=.48;detail[:,:,3]=.54
    normal=props.get('_BumpMap') or props.get('_normal')
    if normal:
        n=image(normal)
        detail[:,:,0]=n[:,:,3] if n[:,:,3].std()>.035 and n[:,:,0].std()<.04 else n[:,:,0]
        detail[:,:,1]=n[:,:,1]
    if '_Metallic' in props:
        m=image(props['_Metallic']);detail[:,:,2]=m[:,:,0]
        detail[:,:,3]=np.clip(1-(m[:,:,3] if m[:,:,3].std()>.025 else m[:,:,0]*.6),.20,.91)
    files[f"coat{i}.png"]=png(Image.fromarray(np.uint8(albedo*255)))
    files[f"relief{i}.png"]=png(Image.fromarray(np.uint8(detail*255)))
    materials[key]=i;return i
def normalize(a): return a/np.maximum(1e-8,np.linalg.norm(a,axis=1))[:,None]
def octa(a):
    p=a/np.maximum(1e-8,np.abs(a).sum(axis=1))[:,None]
    uv=p[:,:2].copy(); m=p[:,2]<0
    uv[m]=(1-np.abs(uv[m,::-1]))*np.where(uv[m]>=0,1,-1)
    return uv*.5+.5
def collect(t,world,groups,path="",root=False):
    go=t.m_GameObject.read();name=go.m_Name;comp=get_components(go)
    if not go.m_IsActive:return
    if not root:world=world@matrix(t)
    path=path+"/"+name
    render=comp.get('MeshRenderer') or comp.get('SkinnedMeshRenderer')
    if ('MeshFilter' in comp or 'SkinnedMeshRenderer' in comp) and render and not re.search(r'/(fx_|_?collider|_?level_collider|beautyCam)',path,re.I):
        renderer=render.read();ref=comp['MeshFilter'].read().m_Mesh if 'MeshFilter' in comp else renderer.m_Mesh
        if renderer.m_Enabled and ref.path_id and renderer.m_Materials:
            mesh=MeshHandler(ref.read());mesh.process()
            pos=np.asarray(mesh.m_Vertices)@world[:3,:3].T+world[:3,3]
            if mesh.m_Normals:
                normals=normalize(np.asarray(mesh.m_Normals)@np.linalg.inv(world[:3,:3]))
            else:
                normals=np.zeros_like(pos)
                for sub in mesh.get_triangles():
                    ids=np.asarray(sub,dtype=int).reshape(-1,3);face=np.cross(pos[ids[:,1]]-pos[ids[:,0]],pos[ids[:,2]]-pos[ids[:,0]])
                    for k in range(3):np.add.at(normals,ids[:,k],face)
                normals=normalize(normals)
            uv=np.asarray(mesh.m_UV0).copy() if mesh.m_UV0 else np.zeros((len(pos),2));uv[:,1]=1-uv[:,1]
            if mesh.m_Tangents:
                ts=np.asarray(mesh.m_Tangents);tan=normalize(ts[:,:3]@world[:3,:3].T)
                sign=ts[:,3]*np.sign(np.linalg.det(world[:3,:3]))
            else:
                tan=normalize(np.cross(normals,np.where((abs(normals[:,1])<.85)[:,None],[0,1,0],[1,0,0])));sign=np.ones(len(pos))
            vert=np.column_stack((pos,normals*.5+.5,sign*.5+.5,uv,octa(tan)))
            # Attach donor weapon assemblies to the native left/right D2 gun joints.
            joint=0
            if re.search(r'gun|arm|claw|shoulder|barrel|cannon',path.rsplit('entity_enemy_',1)[-1].split('/',1)[-1],re.I):
                joint=1 if pos.mean(axis=0)[0]<0 else 2
            for j,tris in enumerate(mesh.get_triangles()):
                mat=renderer.m_Materials[min(j,len(renderer.m_Materials)-1)]
                if not mat.path_id:continue
                mid=mat_id(mat.read())
                if mid>=0:groups[(mid,joint)].append(vert[np.asarray(tris,dtype=int).reshape(-1)])
    for child in t.m_Children:collect(child.read(),world,groups,path)

def lines(name):return [s.strip() for s in texts[name].splitlines() if s.strip()]
stats={};current=None
for line in lines('robot_data')[2:]:
    if line=='END_ENTRY':current=None
    elif ';' not in line:current=line;stats[current]={}
    elif current:
        k,v=line.split(';',1);stats[current][k]=v
dossiers={};ls=lines('desc_robots_EN')
for i,line in enumerate(ls):
    if line in stats and i+1<len(ls) and ';' in ls[i+1]:dossiers[line]=ls[i+1].split(';')[:4]
# EnemyType and EnemyNamesType.Refresh in the installed Assembly-CSharp.dll.
roster=[('GruntA','Goblin'),('GruntB','Ogre'),('RecoilA','Gorgon'),('RecoilB','Kraken'),('ClawbotA','Scorpion'),('ClawbotB','Phantom'),('HulkA','Triton'),('HulkB','Guardian'),('DetonatorA','Golem'),('DetonatorB','Reaver'),('BladesA','Shredder'),('DroneA','Harpy'),('DroneB','Scourge'),('CannonA','Wyvern'),('CannonB','Hydra'),('ViperA','Valkyrie'),('ViperB','Inviculus'),('TeleporterA','Spectralus'),('TeleporterB','Thumuncular'),('Boss1','Goliath'),('Boss2','Taurus'),('Boss3','Stratalustar'),('Boss1B','Goliath Core'),('Boss2B','Taurus · alternate form'),('Boss3B','Sperion'),('Guidebot','Hologuide')]
archive=[('pBladesB','Blade prototype'),('pMiniSpiderA','Mini-spider prototype'),('pReactorA','Reactor prototype'),('pSpiderA','Spider prototype A'),('pSpiderB','Spider prototype B')]
descriptions={
'GruntA':'A compact mining machine with paired smelting blasters. The Goblin formed the backbone of Juno Offworld mining operations.',
'GruntB':'A Goblin-derived mining chassis fitted with flak cannons to break up rubble.',
'RecoilA':'A security robot later adapted for mining, retaining a pair of plasma-core weapons.',
'RecoilB':'An upgraded security machine with four impulse cannons and a heavier combat role.',
'ClawbotA':'Four diamond-tipped claws make this dense-rock excavator dangerous at close range.',
'ClawbotB':'An enigmatic Scorpion variant. The surviving project records describe a shipment to Enceladus and transponder interference.',
'HulkA':'A sturdy material-displacement machine carrying two Falcon missile launchers.',
'HulkB':'A military development of the Triton frame with two Driller weapon clusters.',
'DetonatorA':'An inexpensive explosive-delivery robot built around an internal payload.',
'DetonatorB':'A more dangerous Golem derivative with an M-class Driller as well as internal explosives.',
'BladesA':'A mining chassis equipped with two large cutting blades.',
'DroneA':'A light security drone armed with two Reflex cannons.',
'DroneB':'A hybrid security drone carrying a Creeper launcher.',
'CannonA':'An exploratory mining machine fitted with a missile-pod launcher.',
'CannonB':'An exploratory hybrid built around a Cyclone cannon.',
'ViperA':'A military robot with paired Vulcan cannons and a very high threat rating.',
'Boss1':'The heavy defender of the Phoebe reactor, combining Cyclone and Devastator weapons.',
'Boss2':'A large reactor defender with very little information in the surviving dossier.',
'Guidebot':'The Hologuide is a friendly navigation companion, included here alongside the complete enemy collection.'}
catalog=[]
def parcel(key,data):
    (dest/(key+'.js')).write_text('window.astraEnemyParcel('+json.dumps(key)+','+json.dumps(data,separators=(',',':'))+');',encoding='utf8')
for donor,name in roster+archive:
    root=prefabs['entity_enemy_'+donor].read();groups=defaultdict(list)
    collect(get_components(root)['Transform'].read(),np.eye(4),groups,root=True)
    batches=[(m,j,np.vstack(v)) for (m,j),v in sorted(groups.items())]
    if not batches:
        if (donor,name) not in archive:raise ValueError(donor+' has no visible mesh')
        report[donor]={'emptyPrefab':True};print(donor,'is an empty archive placeholder, excluded',flush=True);continue
    pos=np.vstack([v[:,:3] for _,_,v in batches]);lo=pos.min(0);hi=pos.max(0);center=(lo+hi)/2
    radius=np.linalg.norm(pos-center,axis=1).max();assert radius>.01
    stream=BytesIO();stream.write(struct.pack('<I',len(batches)))
    for m,j,v in batches:
        v[:,:3]=(v[:,:3]-center)/radius
        assert np.isfinite(v).all()
        stream.write(struct.pack('<III',m,j,len(v)));stream.write(v.astype('<f4').tobytes())
    mats=sorted(set(m for m,j,v in batches))
    parcel(donor,{'mesh':base64.b64encode(gzip.compress(stream.getvalue(),mtime=0)).decode(),'materials':mats})
    data=stats.get(donor.upper(),{});dossier=dossiers.get(donor.upper());isarchive=(donor,name) in archive
    traits=[]
    for field,label in [('AI_robot_sniper','Ranged ambusher'),('AI_robot_detonator','Explosive payload'),('AI_robot_claw','Close-quarters attacker'),('AI_robot_teleport','Teleportation'),('AI_robot_approach_weave','Weaving approach'),('AI_robot_no_move','Stationary'),('AI_robot_coward','Retreats under pressure')]:
        if data.get(field,'').lower()=='true':traits.append(label)
    category='Archive prototype' if isarchive else 'Companion' if donor=='Guidebot' else 'Boss form' if donor.startswith('Boss') else 'Combat robot'
    info={'id':donor,'name':name,'category':category,'model':dossier[0].title() if dossier else 'Not recorded','role':dossier[1].title() if dossier else category,'weapons':dossier[2].title() if dossier else 'Not recorded','threat':dossier[3].title() if dossier else 'Unrated','armor':float(data['m_hp']) if 'm_hp' in data else None,'traits':traits,'description':descriptions.get(donor,'An archived design from the Overload installation. It has no entry in the active combat roster.' if isarchive else 'An advanced form from the Overload combat roster. No detailed manufacturer dossier is available.'),'triangles':len(pos)//3}
    if dossier:info['model']=dossier[0]
    if not dossier and data:
        projectile=data.get('m_fire_projectile','none')
        info['weapons']={'proj_beam':'Beam weapon','proj_thunderbolt':'Thunderbolt','proj_alien_blaster':'Alien blaster','missile_alien_pod':'Alien missile pod','proj_vortex':'Cyclone','none':'No ranged weapon recorded'}.get(projectile,projectile.removeprefix('proj_').replace('_',' ').title())
    if donor=='Guidebot':info['weapons']='Navigation support';info['role']='Companion'
    catalog.append(info);report[donor]={'triangles':len(pos)//3,'materials':mats,'bounds':(hi-lo).tolist(),'radius':float(radius)}
    print(donor,len(pos)//3,'triangles',flush=True)
for name,index in materials.items():
    parcel('material-'+str(index),{'coat':base64.b64encode(files['coat'+str(index)+'.png']).decode(),'detail':base64.b64encode(files['relief'+str(index)+'.png']).decode()})
(out/'enemy-catalog.js').write_text('window.astraEnemyCatalog='+json.dumps(catalog,separators=(',',':'))+';',encoding='utf8')
(src/'enemy-sources.json').write_text(json.dumps({'source':'Overload_Data/resources.assets','names':'Assembly-CSharp.dll / EnemyType and EnemyNamesType.Refresh','dossiers':'desc_robots_EN','stats':'robot_data; base values before difficulty scaling','models':report,'materials':materials},indent=2))
print('Exported',len(catalog),'models and',len(materials),'materials')
