"""Fit Overload's authored render meshes and PBR materials to D2 robot rigs."""
from pathlib import Path
from collections import defaultdict
from io import BytesIO
import json,re,struct,sys,zlib
import numpy as np
from scipy.spatial.transform import Rotation
from PIL import Image
import UnityPy
from UnityPy.helpers.MeshHelper import MeshHandler
from package import pack

src=Path(__file__).resolve().parent
ov,stock=map(Path,sys.argv[1:3])
env=UnityPy.load(str(ov/"resources.assets"))
prefabs={o.peek_name():o for o in env.objects if o.type.name=="GameObject" and (o.peek_name() or "").startswith("entity_enemy_")}
donors=["DroneA","DroneB","GruntA","RecoilA","ViperA","ClawbotA","HulkA","CannonA","RecoilB","Guidebot","BladesA","TeleporterA","CannonB","DetonatorA","HulkB"]
materials={}; files={}; report={}
def get_components(go):return {a.component.type.name:a.component for a in go.m_Component}
def vec(v):return np.array([v.x,v.y,v.z],dtype=float)
def matrix(t):
    q=t.m_LocalRotation;out=np.eye(4)
    out[:3,:3]=Rotation.from_quat([q.x,q.y,q.z,q.w]).as_matrix()@np.diag(vec(t.m_LocalScale))
    out[:3,3]=vec(t.m_LocalPosition);return out
def png(img):
    f=BytesIO();img.save(f,"PNG",compress_level=5);return f.getvalue()
def image(ref):
    return np.array(ref.read().image.convert("RGBA").resize((512,512),Image.Resampling.LANCZOS),dtype=float)/255
def mat_id(mat):
    key=mat.m_Name
    if key in materials:return materials[key]
    i=len(materials); props={k:v.m_Texture for k,v in mat.m_SavedProperties.m_TexEnvs if v.m_Texture.path_id}
    if '_MainTex' in props: albedo=image(props['_MainTex'])
    else:
        colors=dict(mat.m_SavedProperties.m_Colors); tint=colors.get('_Color'); rgb=([tint.r,tint.g,tint.b] if tint else [.26,.38,.45]);albedo=np.empty((512,512,4));albedo[:]=[*rgb,1.]
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
    if ('MeshFilter' in comp or 'SkinnedMeshRenderer' in comp) and render and not re.search(r'/(_|fx_|collider|beautyCam)',path,re.I):
        renderer=render.read();ref=comp['MeshFilter'].read().m_Mesh if 'MeshFilter' in comp else renderer.m_Mesh
        if renderer.m_Enabled and ref.path_id and renderer.m_Materials:
            mesh=MeshHandler(ref.read());mesh.process()
            pos=np.asarray(mesh.m_Vertices)@world[:3,:3].T+world[:3,3]
            normals=normalize(np.asarray(mesh.m_Normals)@np.linalg.inv(world[:3,:3]))
            uv=np.asarray(mesh.m_UV0).copy();uv[:,1]=1-uv[:,1]
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
for i,donor in enumerate(donors):
    root=prefabs["entity_enemy_"+donor].read()
    groups=defaultdict(list);collect(get_components(root)["Transform"].read(),np.eye(4),groups,root=True)
    batches=[(m,j,np.vstack(v)) for (m,j),v in sorted(groups.items())]
    if not batches:raise ValueError(donor+" has no renderable body")
    pos=np.vstack([v[:,:3] for _,_,v in batches]);lo=pos.min(0);hi=pos.max(0)
    assert min(hi-lo)>.02
    stream=BytesIO();stream.write(struct.pack('<I',len(batches)))
    for m,j,v in batches:
        v[:,:3]=(2*v[:,:3]-hi-lo)/(hi-lo)
        stream.write(struct.pack('<III',m,j,len(v)));stream.write(v.astype('<f4').tobytes())
    files[f"fleet{i}.mesh"]=stream.getvalue()
    report[donor]={"triangles":len(pos)//3,"materials":len(set(m for m,j,v in batches))};print(donor,report[donor],flush=True)
# D2's published model-name table identifies the root as well as all LOD variants.
text=(stock/"d2/xmodel/xmodelnames.h").read_text()
names=re.search(r'short xmodel_polyobj_xlate\[\]\s*=\s*\{(.*?)\};',text,re.S)[1]
names=re.sub(r'//[^\n]*|/\*.*?\*/','',names,flags=re.S)
names=[s.strip().removeprefix('model_') for s in names.split(',') if s.strip()]
rules=[('guidebot','Guidebot'),('boss|defense','CannonB'),('claw|lifter','ClawbotA'),('spider','RecoilB'),('hulk|fatty|destroyer|pigbot|boar','HulkA'),
       ('heavy|guard|bper','HulkB'),('driller|smelter|sidearm','RecoilA'),('racer|hornet|fox','ViperA'),('bandit|thief|seeker','TeleporterA'),
       ('platform|supervisor','CannonA'),('itsc|pest|drone','DroneA'),('itdbot|spindle','BladesA'),('gopher|splitter','DetonatorA'),('canary','DroneB')]
table=[]
for name in names:
    d=next((v for pattern,v in rules if re.search(pattern,name)), 'GruntA')
    table.append(donors.index(d))
(src/"fleet_types.inc").write_text("static const unsigned char astra_fleet_type[]={"+",".join(map(str,table))+"};\n",encoding="utf8")
(src/"fleet-sources.json").write_text(json.dumps({"chassis":report,"materials":materials,"d2Bindings":dict(zip(names,[donors[v] for v in table]))},indent=2))
pack("fleet",files.items())




