"""Export every original and Vertigo robot into the independent Astra showroom.
Usage: python descent_gallery.py <installed-Astra-folder> <Vertigo-d2x.hog>
                                <dxx-redux-checkout> <output-game-folder>
Reads the owned original HAM/POF records and Astra's existing refit parcels.
No engine, campaign, flight, or AI data is changed. Requires NumPy and Pillow.
"""
from pathlib import Path
from io import BytesIO
from collections import defaultdict
import base64,gzip,hashlib,json,re,struct,sys
import numpy as np
from PIL import Image

installed,vertigo,redux,out=map(Path,sys.argv[1:5]);assets=out/'descent-assets';assets.mkdir(exist_ok=True,parents=True)
def unpack(group):
    chunks,entries=json.loads((installed/'payload'/f'{group}.js').read_text().split('=',1)[1].rstrip(';\n'))
    raw=b''.join(gzip.decompress(base64.b64decode((installed/'payload'/f).read_bytes().split(b'"')[1])) for f in chunks);at=0;files={}
    for name,size in entries:files[name]=raw[at:at+size];at+=size
    assert at==len(raw);return files
def hog(data):
    assert data[:3]==b'DHF';at=3;files={}
    while at<len(data):
        name,size=struct.unpack_from('<13sI',data,at);at+=17;files[name.split(b'\0')[0].decode().lower()]=data[at:at+size];at+=size
    return files
game=unpack('game');art=unpack('art');fleet=unpack('fleet');extra=hog(vertigo.read_bytes());original=hog(game['descent2.hog'])
aliases=json.loads((installed/'payload/aliases.js').read_text().split('=',1)[1].rstrip(';\n'))
def u32(b,p):return struct.unpack_from('<I',b,p)[0]
def i32(b,p):return struct.unpack_from('<i',b,p)[0]
def u16(b,p):return struct.unpack_from('<H',b,p)[0]
def fx(b,p):return i32(b,p)/65536
def vector(b,p):return np.frombuffer(b,dtype='<i4',count=3,offset=p).astype(float)/65536
def block(b,p,size):n=u32(b,p);return [b[p+4+i*size:p+4+(i+1)*size] for i in range(n)],p+4+n*size
def models(b,p):
    headers,p=block(b,p,734);result=[]
    for h in headers:
        size=u32(h,4);result.append((h,b[p:p+size]));p+=size
    return result,p+len(headers)*8
b=game['descent2.ham'];p=8
for size in [22,2,82,130,126]:_,p=block(b,p,size)
robots,p=block(b,p,480);joints,p=block(b,p,8);weapons,p=block(b,p,125);_,p=block(b,p,16);polys,p=models(b,p)
_,p=block(b,p,4);n=u32(b,p);p+=4;bitmaps=list(struct.unpack_from('<'+'H'*n,b,p));p+=n*2;lookups=list(struct.unpack_from('<'+'H'*n,b,p))
assert len(robots)==66 and len(polys)==166
b=extra['d2x.ham'];assert b[:4]==b'MAHX';p=8
items,p=block(b,p,125);weapons=weapons[:62]+items
items,p=block(b,p,480);robots=robots[:66]+items
items,p=block(b,p,8);joints=joints[:1145]+items
items,p=models(b,p);polys=polys[:166]+items
items,p=block(b,p,2);bitmaps=bitmaps[:422]+[u16(v,0) for v in items]
items,p=block(b,p,2);lookups=lookups[:502]+[u16(v,0) for v in items]
# Vertigo retains a legacy 140-byte texture table after the fields consumed by
# DXX-Redux's bm_read_extra_robots. Match that reader, which ignores the trailer.
assert p<=len(b) and len(b)-p==140 and len(robots)==78

def decode(b):
    def rot(c):return ((c<<1)|(c>>7))&255
    return bytes(c if c==10 else rot(rot(c)^0xd3) for c in b).decode('cp437')
def briefings(text):
    result={}
    for m in re.finditer(r'^\$R([^\r\n])\s*\n(.*?)(?=\n\$[PSD]|\Z)',text,re.M|re.S):
        ls=[s.strip() for s in m[2].splitlines() if s.strip() and not s.startswith('$')]
        arm=next(i for i,s in enumerate(ls) if s.startswith('Est. Armament:'));threat=next(i for i,s in enumerate(ls) if s.startswith('Threat:'))
        result[m[1]]={'name':ls[0],'role':ls[1],'size':ls[2].split(':',1)[-1].strip(),'weapons':' '.join(ls[arm:threat]).split(':',1)[1].strip(),'threat':ls[threat].split(':',1)[1].strip()}
    return result
brief=briefings(decode(original['robot.txb']));vbrief=briefings(decode(extra['d2x.txb']))
brief_ids={24:'A',25:'B',26:'D',27:'E',28:'F',29:'G',30:'H',33:'J',36:'K',37:'M',38:'N',39:'P',40:'R',41:'Y',42:'T',43:'S',44:'U',47:'W',48:'X',49:'L',50:'O',51:'I',61:'Q'}
friendly=['Medium Hulk','Medium Lifter','Spider Processing Robot','Class 1 Drone','Class 2 Drone','Cloaked Class 1 Driller','Cloaked Medium Hulk','Class 2 Supervisor','Secondary Lifter','Class 1 Heavy Driller','Class 3 Gopher','Class 1 Platform','Class 2 Platform','Split Pod','Baby Spider','Fusion Hulk','Super Hulk','Descent I Boss 1','Cloaked Lifter','Class 1 Driller','Small Hulk','Advanced Lifter','PTMC Defense Robot','Descent I Boss 2',
 'BPER Bot','Smelter','Ice Spindle','Bulk Destroyer','TRN Racer','Fox Attack Bot','Sidearm','Zeta Aquilae Boss','Boss prototype','Guide-Bot','Mine Guard','Evil Twin','ITSC Robot','Internal Tactical Droid','PEST','PIG','Diamond Claw','Red Hornet','Thief Bot','Seeker','E-Bandit','Pyro-jaxis Boss','Quartzon Boss','Boarshead','Spider','Omega Defense Spawn','Sidearm Modula','LOU Guard','Limefrost Spiral Boss','Popcorn','Cloaked Diamond Claw','Cloaked Smelter','Guppy','Smelter variant','Omega Defense Spawn variant','BPER variant','Spider variant','Spawn','Brimspark Boss','Spawn variant','Tycho Brahe Boss','Mini Reactor',
 'Smelter II','Canary','Compact Lifter','Class 2 Heavy Driller','Logikill','MAX','Sniper NG','Fiddler','Fervid 99','S.P.I.K.E.','Vertigo Boss 1','Vertigo Boss 2']
# HAM robot order differs from briefing movie order. Boss flags 21..26
# identify the six Descent II systems; Vertigo's bosses are records 75/76.
friendly[45]='Brimspark Boss';friendly[52]='Baloris Prime Boss';friendly[62]='Limefrost Spiral Boss'
friendly[67]='Fervid 99';friendly[74]='Canary';friendly[75]='Vertigo Boss 1';friendly[76]='Vertigo Boss 2';friendly[77]='S.P.I.K.E.'
vertigo_brief_ids={66:'1',67:'9',68:'3',69:'4',70:'5',71:'6',72:'7',73:'8',74:'2',77:'$'}
weapon_names={0:'Laser',5:'Robot laser',6:'Concussion missile',10:'Robot laser',11:'Vulcan cannon',12:'Spreadfire cannon',14:'Plasma cannon',17:'Mega missile',20:'Spreadfire discharge',21:'Homing missile',22:'Concussion missile',23:'Spreadfire cannon',24:'Light laser',25:'Medium laser',26:'Smart missile',27:'Fireball cannon',28:'Mega missile',41:'Light Vulcan',42:'TI Stream rock cutter',43:'Xenon laser',44:'Repulsion smelter',45:'Phoenix cannon',46:'Helix borer',48:'Plasma core',50:'Flash missile',52:'Gauss cannon',53:'Smart mine',55:'Mercury missile',57:'Plasma cannon',58:'Earthshaker missile',60:'Flash missile',61:'Homing missile',62:'Homing flash missile',63:'Accelerated repulsion smelter',64:'Helix borer',65:'Heavy plasma cannon'}

weapon_names.update({60:'Homing energy balls',61:'Homing flash missile',63:'Homing energy balls'})

pig=game['groupa.pig'];pc=u32(pig,8);pstart=12+pc*18;palette=np.frombuffer(original['groupa.256'][:768],np.uint8).reshape(256,3).astype(float)*4
def bitmap_name(bi):
    assert 0<bi<=pc,bi
    h=pig[12+(bi-1)*18:12+bi*18];name=h[:8].split(b'\0')[0].decode().lower();frame=h[8]
    return name+(f'#{frame&63}' if frame&64 else '')
def bitmap_image(bi):
    h=pig[12+(bi-1)*18:12+bi*18];_,frame,x,y,extra,flags,avg,offset=struct.unpack('<8s6BI',h);w=x+((extra&15)<<8);height=y+((extra&240)<<4);at=pstart+offset
    if flags&8:
        sizes=np.frombuffer(pig,dtype='<u2' if flags&32 else 'u1',count=height,offset=at+4);at+=4+sizes.nbytes;rows=[]
        for size in sizes:
            end=at+int(size);row=[]
            while at<end and len(row)<w:
                c=pig[at];at+=1
                if c>=224:
                    run=c&31
                    if not run:break
                    row.extend([pig[at]]*run);at+=1
                else:row.append(c)
            assert len(row)==w;rows.append(row);at=end
        pixels=np.array(rows,dtype=np.uint8)
    else:pixels=np.frombuffer(pig,np.uint8,count=w*height,offset=at).reshape(height,w)
    return Image.fromarray(palette[pixels].astype(np.uint8)).convert('RGBA')
def png(im):b=BytesIO();im.save(b,'PNG',compress_level=6);return base64.b64encode(b.getvalue()).decode()
emitted=set()
def parcel(key,data):
    emitted.add(key+'.js');(assets/(key+'.js')).write_text('window.astraDescentParcel('+json.dumps(key)+','+json.dumps(data,separators=(',',':'))+');',encoding='utf8')
materials={};material_sources={};material_hashes={}
def material(key):
    if key in materials:return materials[key]
    mid=len(materials);materials[key]=mid;material_sources[mid]=str(key)
    if isinstance(key,str) and key.startswith('fleet:'):
        i=int(key.split(':')[1]);coat=Image.open(BytesIO(fleet[f'coat{i}.png']));detail=Image.open(BytesIO(fleet[f'relief{i}.png']))
    else:
        size=512;detail=np.zeros((size,size,4),dtype=np.uint8);detail[:]=[128,128,135,150]
        if isinstance(key,int):
            name=bitmap_name(key);alias=aliases.get(name)
            if alias and alias in art:
                coat=Image.open(BytesIO(art[alias])).convert('RGBA').resize((size,size));normal='n'+alias[1:]
                if normal in art:
                    nm=np.array(Image.open(BytesIO(art[normal])).convert('RGB').resize((size,size)));detail[:,:,:2]=nm[:,:,:2];detail[:,:,3]=nm[:,:,2]
            else:coat=bitmap_image(key).resize((size,size),Image.Resampling.LANCZOS)
            arr=np.array(coat);arr[:,:,3]=0
            if name.startswith(('glow','laser','rboteye')):arr[:,:,3]=np.max(arr[:,:,:3],axis=2)//2
            coat=Image.fromarray(arr)
        else:
            value=int(key.split(':')[1]);rgb=[((value>>shift)&31)*255//31 for shift in [10,5,0]];coat=Image.new('RGBA',(16,16),(*rgb,0));detail=detail[:16,:16]
        detail=Image.fromarray(detail)
    data={'coat':png(coat),'detail':png(detail)};digest=hashlib.sha256((data['coat']+data['detail']).encode()).hexdigest()
    if digest in material_hashes:
        materials[key]=material_hashes[digest];del material_sources[mid];return materials[key]
    material_hashes[digest]=mid;parcel('material-'+str(mid),data);return mid
def unit(v):return v/max(1e-8,np.linalg.norm(v))
def octa(v):
    p=v/max(1e-8,np.abs(v).sum());q=p[:2].copy()
    if p[2]<0:q=(1-np.abs(q[::-1]))*np.where(q>=0,1,-1)
    return q*.5+.5
def faces(h,raw):
    result=[];seen=set()
    def visit(pos,offset,limb,verts,depth=0):
        assert depth<40
        while (op:=u16(raw,pos)):
            n=u16(raw,pos+2)
            if op in [1,7]:
                base=u16(raw,pos+4) if op==7 else 0;pos+=8 if op==7 else 4
                for j in range(n):verts[base+j]=vector(raw,pos+j*12)
                pos+=n*12
            elif op in [2,3]:
                ids=struct.unpack_from('<'+'H'*n,raw,pos+30);v=np.array([verts[i] for i in ids]);normal=vector(raw,pos+16);m=u16(raw,pos+28);pos+=30+((n&~1)+1)*2
                if op==3:
                    uv=np.frombuffer(raw,dtype='<i4',count=n*3,offset=pos).reshape(n,3)[:,:2]/65536;pos+=12*n;key=bitmaps[lookups[u16(h,731)+m]]
                else:uv=np.zeros((n,2));key='flat:'+str(m)
                identity=(limb,tuple(sorted(tuple(p) for p in v)),key)
                if identity not in seen:result.append((v+offset,unit(normal),key,uv,limb,v));seen.add(identity)
            elif op==4:visit(pos+u16(raw,pos+28),offset,limb,verts,depth+1);visit(pos+u16(raw,pos+30),offset,limb,verts,depth+1);pos+=32
            elif op==6:visit(pos+u16(raw,pos+16),offset+vector(raw,pos+4),u16(raw,pos+2),dict(verts),depth+1);pos+=20
            elif op==8:pos+=4
            elif op==5:pos+=36 # Camera-facing rods are not body armor.
            else:raise ValueError((op,pos))
    visit(0,np.zeros(3),0,{})
    return result
def polygon(groups,points,normal,uv,mat):
    n=unit(normal);p=np.array(points);uv=np.array(uv)
    if len(p)<3:return
    du=uv[1]-uv[0];dv=uv[2]-uv[0];det=du[0]*dv[1]-du[1]*dv[0]
    if abs(det)>1e-7:
        t=unit(((p[1]-p[0])*dv[1]-(p[2]-p[0])*du[1])/det);bt=((p[2]-p[0])*du[0]-(p[1]-p[0])*dv[0])/det;hand=1 if np.dot(np.cross(n,t),bt)>=0 else 0
    else:t=unit(np.cross(n,[0,1,0] if abs(n[1])<.85 else [1,0,0]));hand=1
    for j in range(1,len(p)-1):
        for i in [0,j,j+1]:groups[mat].append([*p[i],*(n*.5+.5),hand,*uv[i],*octa(t)])
types=[int(x) for x in re.search(r'\{(.*?)\}',(installed/'source/fleet_types.inc').read_text(),re.S)[1].split(',') if x.strip()]
catalog=[];report={}
for rid,ri in enumerate(robots):
    model=u32(ri,0);h,raw=polys[model];geometry=faces(h,raw);lo=vector(h,702);hi=vector(h,714);center=(lo+hi)/2;extent=np.maximum((hi-lo)/2,.001);groups=defaultdict(list)
    # The same outer-panel retention and bevel proportions used by Astra.
    for verts,normal,key,uv,limb,localverts in geometry:
        c=(localverts.mean(0)-center)/extent;x,y,z=c
        if limb==0 and not (abs(x)>.70 or y>.69 or (y<-.64 and z>.12) or (z<-.79 and abs(x)>.24)):continue
        mat=material(key);middle=verts.mean(0);radius=np.linalg.norm(verts[0]-middle);lift=min(.1,radius/28);inner=verts+(middle-verts)/14+normal*lift;iuv=uv+(uv.mean(0)-uv)/14
        polygon(groups,inner,normal,iuv,mat)
        for j in range(len(verts)):
            k=(j+1)%len(verts);points=np.array([verts[j],verts[k],inner[k],inner[j]]);bevel=unit(np.cross(points[1]-points[0],points[2]-points[0]));polygon(groups,points,bevel,[uv[j],uv[k],iuv[k],iuv[j]],mat)
    donor=types[model] if model<len(types) else 6 if ri[280] else (rid*7+3)%12
    fb=fleet[f'fleet{donor}.mesh'];at=4
    for i in range(u32(fb,0)):
        m,j,n=struct.unpack_from('<III',fb,at);at+=12;v=np.frombuffer(fb,dtype='<f4',count=n*11,offset=at).reshape(n,11).copy();at+=n*44;v[:,:3]=v[:,:3]*extent*[.85,.86,.91]+center
        groups[material('fleet:'+str(m))].extend(v.tolist())
    allpos=np.vstack([np.array(v)[:,:3] for v in groups.values()]);origin=(allpos.max(0)+allpos.min(0))/2;radius=np.linalg.norm(allpos-origin,axis=1).max();assert radius>.01
    stream=BytesIO();stream.write(struct.pack('<I',len(groups)));triangles=0
    for m,vertices in sorted(groups.items()):
        v=np.array(vertices,dtype='<f4');v[:,:3]=(v[:,:3]-origin)/radius;assert np.isfinite(v).all();stream.write(struct.pack('<III',m,0,len(v)));stream.write(v.tobytes());triangles+=len(v)//3
    ident=f'robot-{rid:02d}';parcel(ident,{'mesh':base64.b64encode(gzip.compress(stream.getvalue(),mtime=0)).decode(),'materials':sorted(groups)})
    dossier=brief.get(brief_ids.get(rid,'')) if rid<66 else vbrief.get(vertigo_brief_ids.get(rid,''))
    group='Descent I' if rid<24 else 'Descent II' if rid<66 else 'Vertigo'
    weapons_used=struct.unpack_from('<bb',ri,116);attack=ri[275];companion=ri[281];boss=ri[280];thief=ri[284]
    weapon=' + '.join(weapon_names.get(w,'Robot weapon '+str(w)) for w in weapons_used if w>=0)
    if attack:weapon='Melee swingarms' if not ri[127] else 'Contact energy drain'
    if not ri[118] and not attack:weapon='Navigation support' if companion else 'Contact / explosive attack' if ri[123] else 'No mounted ranged weapon'
    traits=[]
    for yes,label in [(ri[274],'Cloaking'),(attack,'Contact attacker'),(thief,'Steals equipment'),(ri[127],'Energy drain'),(ri[123],'Kamikaze'),(ri[282],'Homing fragments on destruction'),(ri[283],'Retaliates to energy hits'),(boss,'Boss'),(companion,'Friendly companion')]:
        if yes:traits.append(label)
    if ri[120] and ri[122]==2:traits.append('Can release smaller robots')
    role=dossier['role'] if dossier else 'Boss' if boss else 'Companion' if companion else 'Contact attacker' if attack else 'Combat robot'
    description=('A friendly navigation robot that helps you locate objectives.' if companion else 'An equipment thief that can steal weapons and supplies on contact.' if thief else 'A contact attacker that drains the ship’s energy.' if ri[127] else 'A boss unit with heavy armor and a large weapon loadout.' if boss else f'A {group} robot with '+(str(ri[118])+' weapon positions.' if ri[118] else 'no mounted ranged weapons.'))
    if ri[120] and ri[122]==2:description+=' It can release smaller robots when destroyed.'
    if rid in [5,6,18,54,55]:description+=' Shown uncloaked for inspection.'
    info={'id':ident,'name':friendly[rid],'category':group+(' · Boss' if boss else ' · Companion' if companion else ''),'collection':group,'model':'Astra refit','role':role,'weapons':dossier['weapons'] if dossier else weapon,'threat':dossier['threat'] if dossier else 'Unrated','armor':fx(ri,132),'score':struct.unpack_from('<h',ri,124)[0],'traits':traits,'description':description,'triangles':triangles}
    catalog.append(info);report[ident]={'robotId':rid,'nativeModel':model,'donor':donor,'originalFaces':len(geometry),'triangles':triangles,'materials':sorted(groups)};print(rid,friendly[rid],triangles,flush=True)
(out/'descent-catalog.js').write_text('window.astraDescentCatalog='+json.dumps(catalog,separators=(',',':'))+';',encoding='utf8')
(out/'source/descent-enemy-sources.json').write_text(json.dumps({'sources':['descent2.ham','missions/d2x.hog / d2x.ham','robot.txb','d2x.txb','Astra fleet and armor parcels'],'records':len(robots),'collections':{g:sum(r['collection']==g for r in catalog) for g in ['Descent I','Descent II','Vertigo']},'models':report,'materials':material_sources},indent=2))
for stale in assets.glob('*.js'):
    if stale.name not in emitted and re.fullmatch(r'(robot-\d+|material-\d+)\.js',stale.name):stale.unlink()
print('Exported',len(catalog),'robot entries and',len(material_hashes),'shared materials')
