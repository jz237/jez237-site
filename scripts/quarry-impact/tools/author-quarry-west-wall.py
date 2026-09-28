"""Author the western quarry extraction wall; Blender --background --python this file.

The frozen lower apron and perimeter close against the released quarry. Runtime
uses existing rock maps/scan atlas; the exact near wall supplies shared physics.
"""
import bpy,bmesh,math,json,pathlib,random,hashlib,runpy,struct,functools,bisect
from mathutils import Vector,Euler
from mathutils.geometry import tessellate_polygon
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=json.loads((ROOT/'source/models/quarry-west-wall-base.json').read_text())
CUT=runpy.run_path(str(ROOT/'tools/author-quarry-cut.py'),run_name='quarry_cut_helpers')
START,END=275,325
BREAKS=[275,292,309,325]
# The arena sees this wall from 120--200 m. Resolve actual metre-scale rock
# planes, while omitting the extension's quarter-row micro-triangle density.
# Both LODs retain every radial sample, so all mixed-LOD chunk edges coincide.
ROWS=sorted(set([float(i) for i in range(7)]+[6.12,9.25,11.8,20.2,22.25]
                +[i/2 for i in range(13,29)]+[15.,16.,17.,18.]
                +[i/2 for i in range(37,49)]+[25.,26.,27.,28.,29.,30.]))
SECTOR={'startCell':START,'endCellExclusive':END,'cellRanges':[[275,325]]}
GULLY=[296.8,304.2]
clamp=CUT['clamp'];lerp=CUT['lerp'];mix=CUT['mix'];smooth=CUT['smooth']
to_blender=CUT['xyz_to_blender'];to_world=CUT['blender_to_xyz']
f32=lambda x:struct.unpack('f',struct.pack('f',x))[0]
SURFACE=[];CELLS={};WALL_PARAMS={};WALL_COUNTS={};TOE_RANGES={}
APRON_NORMALS=BASE['apronNormals']
TERRAIN=json.loads((ROOT/'source/models/quarry-roadside-base.json').read_text())['terrain']
TERRAIN_POS=TERRAIN['positions'];TERRAIN_COLS=TERRAIN['columns']
TERRAIN_X=[TERRAIN_POS[i*3] for i in range(TERRAIN_COLS)]
TERRAIN_Z=[TERRAIN_POS[i*TERRAIN_COLS*3+2] for i in range(TERRAIN['rows'])]

def terrain_height(x,z):
    ix=max(0,min(TERRAIN_COLS-2,bisect.bisect_right(TERRAIN_X,x)-1))
    iz=max(0,min(TERRAIN['rows']-2,bisect.bisect_right(TERRAIN_Z,z)-1))
    fx=(x-TERRAIN_X[ix])/(TERRAIN_X[ix+1]-TERRAIN_X[ix])
    fz=(z-TERRAIN_Z[iz])/(TERRAIN_Z[iz+1]-TERRAIN_Z[iz])
    at=(iz*TERRAIN_COLS+ix)*3
    a=TERRAIN_POS[at+1];b=TERRAIN_POS[at+TERRAIN_COLS*3+1]
    c=TERRAIN_POS[at+4];d=TERRAIN_POS[at+TERRAIN_COLS*3+4]
    return a*(1-fx-fz)+c*fx+b*fz if fx+fz<=1 else c*(1-fz)+b*(1-fx)+d*(fx+fz-1)

def toe_ground_crossings(a,b):
    """Exact coarse terrain cell and diagonal crossings under one old toe edge."""
    ts={0.,1.};dx=b[0]-a[0];dz=b[2]-a[2]
    for grid,axis,delta in [(TERRAIN_X,0,dx),(TERRAIN_Z,2,dz)]:
        if abs(delta)<1e-10:continue
        for value in grid:
            t=(value-a[axis])/delta
            if 1e-8<t<1-1e-8:ts.add(t)
    ix0=max(0,bisect.bisect_right(TERRAIN_X,min(a[0],b[0]))-1)
    ix1=min(TERRAIN_COLS-2,bisect.bisect_right(TERRAIN_X,max(a[0],b[0]))-1)
    iz0=max(0,bisect.bisect_right(TERRAIN_Z,min(a[2],b[2]))-1)
    iz1=min(TERRAIN['rows']-2,bisect.bisect_right(TERRAIN_Z,max(a[2],b[2]))-1)
    for iz in range(iz0,iz1+1):
        for ix in range(ix0,ix1+1):
            x0,x1=TERRAIN_X[ix:ix+2];z0,z1=TERRAIN_Z[iz:iz+2]
            rate=dx/(x1-x0)+dz/(z1-z0)
            if abs(rate)<1e-12:continue
            t=(1-(a[0]-x0)/(x1-x0)-(a[2]-z0)/(z1-z0))/rate
            x=a[0]+dx*t;z=a[2]+dz*t
            if 1e-8<t<1-1e-8 and x0-1e-6<=x<=x1+1e-6 and z0-1e-6<=z<=z1+1e-6:ts.add(t)
    ordered=sorted(ts)
    # min(terrain, toe) can switch inside a terrain triangle. Retain that kink
    # too, so a buried toe never creates an inverted paper-thin skirt.
    for ta,tb in zip(ordered,ordered[1:]):
        pa=mix(a,b,ta);pb=mix(a,b,tb)
        da=pa[1]-terrain_height(pa[0],pa[2]);db=pb[1]-terrain_height(pb[0],pb[2])
        if da*db<0:ts.add(lerp(ta,tb,da/(da-db)))
    return sorted(ts)

def append_toe_closure(lo,hi,positions,uv,colors,params,faces):
    """Close the inherited air gap without replacing any frozen apron triangle.

    Each upper toe edge stays a single edge. A constrained concave-polygon
    tessellation follows terrain crossings below it; a simple triangle fan can
    invert where the coarse terrain rises sharply beneath the exposed toe.
    """
    first=len(faces);serial=0
    for degree in range(lo,hi):
        a,ua,ca=original(0,degree);b,ub,cb=original(0,degree+1)
        a=tuple(f32(v) for v in a);b=tuple(f32(v) for v in b)
        ts=toe_ground_crossings(a,b);loop=[(a,0.),(b,1.)]
        for t in reversed(ts):
            p=mix(a,b,t);bottom=min(terrain_height(p[0],p[2])-.02,p[1]-.02)
            loop.append(((f32(p[0]),f32(bottom),f32(p[2])),t))
        vectors=[Vector(p) for p,t in loop];mapping={}
        for (p,t),v in zip(loop,vectors):
            mapping[tuple(v)]=len(positions);positions.append(tuple(v))
            olduv=mix(ua,ub,t);top_y=lerp(a[1],b[1],t)
            uv.append((olduv[0],olduv[1]-(top_y-p[1])/3.6))
            colors.append((*mix(ca,cb,t),1));params.append((-1.-serial,degree+t));serial+=1
        for tri in tessellate_polygon([vectors]):
            tri=[vectors[v] if isinstance(v,int) else v for v in tri]
            if (tri[1]-tri[0]).cross(tri[2]-tri[0]).length_squared<=1e-16:continue
            faces.append(tuple(mapping[tuple(v)] for v in tri))
    return {'firstTriangle':first,'triangleCount':len(faces)-first}
def fracture_controls(seed):
    rng=random.Random(seed);angles=[float(START)]
    while angles[-1]<END:angles.append(min(END,angles[-1]+rng.uniform(1.5,3.1)))
    return [(a,[rng.uniform(-1,1) for _ in range(6)]) for a in angles]
LOWER=fracture_controls(835194);UPPER=fracture_controls(457216);RIDGE=fracture_controls(714395)

def fracture_plates(seed,lo,hi):
    """An irregular joint network in the unfolded face, with planar interiors.

    Unlike independent bumps, adjoining plates share a recessed bevel at their
    Voronoi border. Jittered cells and oblique per-cell planes avoid brick courses.
    """
    rng=random.Random(seed);plates=[];r=lo-.8
    while r<hi+1.5:
        a=START-1.1+rng.uniform(-.5,.5)
        while a<END+1.5:
            plates.append((a+rng.uniform(-.28,.28),r+rng.uniform(-.55,.55),
                           rng.uniform(-.45,.10),rng.uniform(-.065,.065),rng.uniform(-.07,.07),rng.uniform(.98,1.28)))
            a+=rng.uniform(1.35,2.25)
        r+=rng.uniform(1.8,3.1)
    return plates

FACE_PLATES=[(6,14,fracture_plates(718634,6,14)),(18,24,fracture_plates(963145,18,24))]
NOTCHES=[]
for ledge,seed in [(14,517328),(24,873162)]:
    rng=random.Random(seed);a=START+2.0
    while a<END-1.7:
        NOTCHES.append((ledge,a,rng.uniform(.9,1.45),rng.uniform(.4,.72),rng.uniform(.15,.3),rng.uniform(-.22,.22)))
        a+=rng.uniform(4.3,6.2)

def fracture_relief(row,degrees):
    radial=0.0;vertical=0.0
    for lo,hi,plates in FACE_PLATES:
        if not lo<row<hi:continue
        # World-scale unfolding: one angular degree is about3m at this wall,
        # while the local radial parameter corresponds to about1m of rise.
        closest=sorted((((degrees-a)*3.0)**2+((row-r)*1.18)**2,p) for p in plates for a,r,*_ in [p])[:2]
        (_,p),(d2,q)=closest;d1=closest[0][0]
        separation=math.hypot((p[0]-q[0])*3.0,(p[1]-q[1])*1.18)
        edge_distance=(d2-d1)/max(1e-6,2*separation)
        plane=clamp(p[2]+p[3]*(degrees-p[0])*3.0+p[4]*(row-p[1])*1.18,-.48,.14)
        bevel=clamp(edge_distance/p[5],0,1)
        envelope=min(1,(row-lo)/.72,(hi-row)/.60)
        radial+=lerp(.045,plane,bevel)*envelope
    for ledge,a,width,depth,drop,slant in NOTCHES:
        if not ledge-1.35<row<ledge+1.8:continue
        axis=a+slant*(row-ledge)
        # A broad broken lip has a finite floor rather than a sharp pyramid tip.
        angular=clamp((1-abs(degrees-axis)/width)*2.7,0,1)
        radial_envelope=clamp(min((row-(ledge-1.35))/1.35,((ledge+1.8)-row)/1.8),0,1)
        # Remove an angular wedge from the face lip, leaving a chipped shelf.
        radial+=depth*angular*radial_envelope
        vertical-=drop*angular*radial_envelope
    return radial,vertical

def control(points,degrees,channel):
    a,b=next((a,b) for a,b in zip(points,points[1:]) if a[0]<=degrees<=b[0])
    return lerp(a[1][channel],b[1][channel],(degrees-a[0])/(b[0]-a[0]))

def coarse_original(points,degrees,row):
    a,b=next((a,b) for a,b in zip(points,points[1:]) if a[0]<=degrees<=b[0])
    return mix(original(row,a[0])[0],original(row,b[0])[0],(degrees-a[0])/(b[0]-a[0]))

def original(row,degrees):
    row=clamp(row,0,30);col=clamp(degrees-START,0,END-START)
    r=min(29,int(row));c=min(END-START-1,int(col));fx=col-c;fy=row-r
    return tuple(mix(mix(BASE['rows'][r][c][key],BASE['rows'][r][c+1][key],fx),
                     mix(BASE['rows'][r+1][c][key],BASE['rows'][r+1][c+1][key],fx),fy)
                 for key in ['p','uv','color'])

def radius(p):return math.hypot(p[0]/1.08,p[2])

def gully_profile(row):
    # The collapse meanders between two offset extraction masses. Its head is
    # narrower than its foot and its banks terminate at separate broken beds.
    knots=[(6,300.2,.50),(10.5,300.0,.32),(14,300.65,.08),
           (18,300.25,-.16),(21,300.8,-.23),(24,301.25,-.35),
           (27,300.9,-.30),(30,301.1,-.36)]
    a,b=next((a,b) for a,b in zip(knots,knots[1:]) if a[0]<=row<=b[0])
    t=(row-a[0])/(b[0]-a[0])
    return lerp(a[1],b[1],t),lerp(a[2],b[2],t)

def target(row,degrees):
    old,_,_=original(row,degrees)
    if row<=6 or row==30 or degrees in [START,END]:return old
    foot=original(6,degrees)[0];top=original(30,degrees)[0]
    r0=radius(foot);crest=radius(top)
    # A tall western extraction face gives way to a collapsed channel, then a
    # lower forward abutment. All three streaming chunks share this one design.
    # The shelf terminates inside the collapse; it is not a concentric terrace.
    lower_base=radius(coarse_original(LOWER,degrees,6))
    bay_points=[(START,0),(279.0,1.3),(282.8,6.8),(288.4,7.5),
                (293.3,4.0),(296.8,1.0),(304.5,0.6),(310.8,3.5),
                (316.2,2.0),(321.4,.8),(END,0)]
    ba,bb=next((a,b) for a,b in zip(bay_points,bay_points[1:]) if a[0]<=degrees<=b[0])
    setback=lerp(ba[1],bb[1],(degrees-ba[0])/(bb[0]-ba[0]))
    rise=top[1]-foot[1]
    lower_mass=smooth(302.0,309.0,degrees)
    first_r=max(r0+.95,lower_base+2.5+setback+1.1*control(LOWER,degrees,0))
    first_y=foot[1]+rise*lerp(.67,.52,lower_mass)+1.35*control(LOWER,degrees,1)
    first_y=clamp(first_y,foot[1]+rise*.43,top[1]-max(2.8,rise*.19))
    shelf_width=lerp(8.0,11.0,lower_mass)+1.9*control(UPPER,degrees,0)
    middle_r=first_r+max(5.8,shelf_width)
    middle_y=first_y+.35+.30*control(UPPER,degrees,1)
    second_r=middle_r+2.0+.9*control(UPPER,degrees,2)
    ridge_y=max(middle_y+2.8,coarse_original(RIDGE,degrees,30)[1]-.55+1.15*control(RIDGE,degrees,0))
    first_hinge1=.28+.13*control(LOWER,degrees,2)
    first_hinge2=.64+.11*control(UPPER,degrees,3)
    second_hinge1=.26+.13*control(UPPER,degrees,4)
    second_hinge2=.68+.12*control(RIDGE,degrees,2)
    knots=[(6,r0,foot[1]),
           (9.25,lerp(r0,first_r,first_hinge1),lerp(foot[1],first_y,.40)+.3*control(LOWER,degrees,4)),
           (11.8,lerp(r0,first_r,first_hinge2),lerp(foot[1],first_y,.72)+.25*control(UPPER,degrees,5)),
           (14,first_r,first_y),(18,middle_r,middle_y),
           (20.2,lerp(middle_r,second_r,second_hinge1),lerp(middle_y,ridge_y,.37)+.25*control(UPPER,degrees,3)),
           (22.25,lerp(middle_r,second_r,second_hinge2),lerp(middle_y,ridge_y,.71)+.3*control(RIDGE,degrees,3)),
           (24,second_r,ridge_y),
           (27,max(second_r+4.0,min(crest-6,lower_base+37+2*control(RIDGE,degrees,4))),ridge_y-.65),
           (30,crest,top[1])]
    a,b=next((a,b) for a,b in zip(knots,knots[1:]) if a[0]<=row<=b[0])
    t=(row-a[0])/(b[0]-a[0]);r=lerp(a[1],b[1],t);y=lerp(a[2],b[2],t)
    edge=smooth(0,2.1,degrees-START)*smooth(0,2.1,END-degrees)
    # The chute changes direction at fractured bedding planes. Asymmetric,
    # piecewise banks replace the former smooth triangular/trapezoid ramps.
    axis,width_offset=gully_profile(row)
    side=degrees-axis;distance=abs(side)
    outer=2.65 if side<0 else 2.25
    outer+=width_offset
    cuts=[(0,1),(.68,.92),(outer*.69,.35),(outer,0)]
    if distance>=outer:collapse=0
    else:
        ca,cb=next((a,b) for a,b in zip(cuts,cuts[1:]) if a[0]<=distance<=b[0])
        collapse=lerp(ca[1],cb[1],(distance-ca[0])/(cb[0]-ca[0]))
    # Collapse has a real angular talus surface, not the old stacked terraces.
    # Its varying-slope channel rises between the protected apron and crest.
    talus_knots=[(6,0,0),(10.5,.15,.15),(14,.33,.31),(18,.48,.51),
                 (21,.61,.66),(24,.72,.78),(27,.85,.90),(30,1,1)]
    ta,tb=next((a,b) for a,b in zip(talus_knots,talus_knots[1:]) if a[0]<=row<=b[0])
    tt=(row-ta[0])/(tb[0]-ta[0]);tr=lerp(ta[1],tb[1],tt);ty=lerp(ta[2],tb[2],tt)
    collapsed_r=lerp(r0,crest,tr)
    collapsed_y=lerp(foot[1],top[1],ty)
    angle=math.radians(degrees)
    # The untouched backing terrain is itself stepped. Keep the channel above
    # that exact coarse plane while leaving its four protected edges untouched.
    collapsed_y=max(collapsed_y,terrain_height(math.sin(angle)*collapsed_r*1.08,math.cos(angle)*collapsed_r)+1.15)
    r=lerp(r,collapsed_r,collapse*.94);y=lerp(y,collapsed_y,collapse*.94)
    r=lerp(radius(old),r,edge);y=lerp(old[1],y,edge)
    dr,dy=fracture_relief(row,degrees)
    r+=dr*edge;y+=dy*edge
    a=math.radians(degrees)
    return (math.sin(a)*r*1.08,y,math.cos(a)*r)

@functools.lru_cache(maxsize=None)
def column(degrees):
    points=[]
    for row in ROWS:
        # Local overhangs are intentional fracture lips; the shared exact mesh
        # is collision geometry, rather than a height-field approximation.
        p=target(row,degrees)
        points.append(tuple(f32(v) for v in p))
    distances=[0.0]
    for a,b in zip(points,points[1:]):distances.append(distances[-1]+math.dist(a,b))
    six=ROWS.index(6.0);v6=original(6,degrees)[1][1]
    end_v=v6+(distances[-1]-distances[six])/3.6
    correction=original(30,degrees)[1][1]-end_v
    data=[]
    for i,row in enumerate(ROWS):
        _,uv,color=original(row,degrees)
        if row>6 and degrees not in [START,END]:
            v=v6+(distances[i]-distances[six])/3.6+correction*smooth(24,30,row)
            uv=(uv[0],v)
        shade=.74+.025*math.sin(degrees*.61+row*.44)
        blend=smooth(6,9,row)*smooth(0,2.1,degrees-START)*smooth(0,2.1,END-degrees)*smooth(0,2,30-row)
        tint=mix(color,(shade*.985,shade,shade*1.015),blend)
        data.append((points[i],uv,(*tint,1)))
    return data

def point_at(row,degrees):
    data=column(round(degrees,8));i=next(i for i in range(len(ROWS)-1) if ROWS[i]<=row<=ROWS[i+1])
    return mix(data[i][0],data[i+1][0],(row-ROWS[i])/(ROWS[i+1]-ROWS[i]))

def surface_height(x,z):
    heights=[]
    for ti in CELLS.get((math.floor(x/4),math.floor(z/4)),[]):
        a,b,c=SURFACE[ti]
        det=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2])
        if abs(det)<1e-12:continue
        u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/det
        v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/det
        if min(u,v,1-u-v)>=-1e-7:heights.append(u*a[1]+v*b[1]+(1-u-v)*c[1])
    if heights:return max(max(heights),terrain_height(x,z))
    # Fragment support outside the authored wall is the unchanged exact coarse
    # terrain, including the small inward foot of the connected collapse fan.
    return terrain_height(x,z)

def wall_mesh(section,level,material):
    lo,hi=BREAKS[section:section+2];div=4 if level=='near' else 2
    positions=[];uv=[];colors=[];params=[];strips=[];faces=[]
    for ri,row in enumerate(ROWS):
        step=1 if row<=6 else 1/div
        degrees=[lo+i*step for i in range(round((hi-lo)/step)+1)]
        if row>6:
            # Both LODs retain structural fracture corners exactly.
            degrees=sorted(set(degrees+[a for controls in [LOWER,UPPER,RIDGE] for a,_ in controls if lo<a<hi]))
        start=len(positions)
        for a in degrees:
            p,t,c=column(a)[ri];positions.append(p);uv.append(t);colors.append(c);params.append((row,a))
        strips.append((start,degrees))
    for (start,a),(nxt,b) in zip(strips,strips[1:]):
        i=j=0
        while i<len(a)-1 or j<len(b)-1:
            if i==len(a)-1:faces.append((start+i,nxt+j,nxt+j+1));j+=1
            elif j==len(b)-1:faces.append((start+i,nxt+j,start+i+1));i+=1
            elif abs(a[i+1]-b[j+1])<1e-7:
                # Keep the exact legacy diagonal, including the preserved apron.
                faces.extend([(start+i,nxt+j,start+i+1),(start+i+1,nxt+j,nxt+j+1)]);i+=1;j+=1
            elif a[i+1]<b[j+1]:faces.append((start+i,nxt+j,start+i+1));i+=1
            else:faces.append((start+i,nxt+j,nxt+j+1));j+=1
    name=f'WestWallRock_{section}_{level}';WALL_COUNTS[name]=len(faces)
    TOE_RANGES[name]=append_toe_closure(lo,hi,positions,uv,colors,params,faces)
    obj=CUT['make_mesh'](name,positions,faces,uv,colors,material,False)
    WALL_PARAMS[obj.name]=params
    custom=[];mesh=obj.data;averages={}
    for poly in mesh.polygons:
        row=sum(params[v][0] for v in poly.vertices)/3
        if not (6<row<14 or 18<row<24):
            for v in poly.vertices:averages[v]=averages.get(v,Vector())+poly.normal*poly.area
    for poly in mesh.polygons:
        row=sum(params[v][0] for v in poly.vertices)/3;band=min(29,int(row))
        for loop in poly.loop_indices:
            vi=mesh.loops[loop].vertex_index;r,a=params[vi]
            if poly.index>=WALL_COUNTS[name]:normal=poly.normal
            elif a in [START,END]:
                side='left' if a==START else 'right';pair=BASE['normalBands'][band][side]
                normal=Vector(to_blender(mix(pair[0],pair[1],clamp(r-band,0,1))))
            elif row<=6:
                # The old ring stores separate normals on the two sides of a
                # bench. Copy its actual per-band corner values, not a newly
                # flattened polygon normal or a cross-ledge vertex average.
                column_index=round(a-START);end_index=0 if r==band else 1
                normal=Vector(to_blender(APRON_NORMALS[band][column_index][end_index]))
            else:normal=averages.get(vi,poly.normal) if not (6<row<14 or 18<row<24) else poly.normal
            custom.append(tuple(normal.normalized()))
        poly.use_smooth=True
    mesh.normals_split_custom_set(custom)
    return obj

def apron_top_normal(degrees):
    col=clamp(degrees-START,0,END-START);i=min(END-START-1,int(col))
    return Vector(to_blender(mix(APRON_NORMALS[5][i][1],APRON_NORMALS[5][i+1][1],col-i))).normalized()

def finish_wall_shading(walls):
    """Remove grid-triangle shading while preserving real fracture corners.

    Neighbours span chunk boundaries. The 50-degree gate keeps the deep joints
    crisp, while area and corner-angle weighting rejects skinny bevel slivers.
    Protected apron/perimeter normals retain their exact imported values.
    """
    cosine=math.cos(math.radians(50))
    for level in ['near','far']:
        objects=[walls[(s,level)] for s in range(3)];neighbours={}
        for obj in objects:
            mesh=obj.data
            for poly in mesh.polygons:
                vertices=list(poly.vertices)
                for i,vi in enumerate(vertices):
                    p=mesh.vertices[vi].co
                    v1=mesh.vertices[vertices[i-1]].co-p;v2=mesh.vertices[vertices[(i+1)%len(vertices)]].co-p
                    angle=v1.angle(v2,0.0);key=tuple(round(v,6) for v in p)
                    neighbours.setdefault(key,[]).append((poly.normal.copy(),poly.area*angle))
        for obj in objects:
            mesh=obj.data;params=WALL_PARAMS[obj.name];old=[tuple(n.vector) for n in mesh.corner_normals];custom=[]
            for poly in mesh.polygons:
                for loop in poly.loop_indices:
                    vi=mesh.loops[loop].vertex_index;r,a=params[vi]
                    if a in [START,END] or r<6 or r==30:custom.append(old[loop]);continue
                    if r==6:
                        # Both sides of the frozen apron share its real top
                        # normal. The new face must not start with a separate
                        # polygon normal at the same geometric row.
                        custom.append(tuple(apron_top_normal(a)));continue
                    key=tuple(round(v,6) for v in mesh.vertices[vi].co)
                    normal=sum((n*w for n,w in neighbours[key] if n.dot(poly.normal)>=cosine),Vector())
                    normal=normal.normalized() if normal.length>1e-10 else poly.normal
                    if r<6.5:normal=apron_top_normal(a).lerp(normal,smooth(6,6.5,r)).normalized()
                    custom.append(tuple(normal))
            mesh.normals_split_custom_set(custom)

def finish_wall_uv(walls):
    """Relax UV shear on the bevels, with fixed authored and inter-chunk joins.

    The near mesh is the sole unwrap authority. Far vertices are an exact subset
    of its parameters and inherit those UVs, so LOD switching does not rephase
    the photograph. Every apron/perimeter loop stays pinned to the frozen data.
    """
    for section in range(3):
        near=walls[(section,'near')];mesh=near.data;params=WALL_PARAMS[near.name]
        lo,hi=BREAKS[section:section+2];layer=mesh.uv_layers.active
        protected={}
        for loop in mesh.loops:
            row,a=params[loop.vertex_index]
            fixed=row<=6 or row==30 or a in [lo,hi]
            layer.data[loop.index].pin_uv=fixed
            if fixed:protected[loop.index]=tuple(layer.data[loop.index].uv)
        # Edit-mode unwrap may reorder internal mesh arrays. Operate on a copy
        # and transfer only UV coordinates back by immutable vertex position.
        temporary=near.copy();temporary.data=mesh.copy();bpy.context.collection.objects.link(temporary)
        bpy.ops.object.select_all(action='DESELECT');temporary.select_set(True);bpy.context.view_layer.objects.active=temporary
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.unwrap(method='ANGLE_BASED',margin=0)
        bpy.ops.object.mode_set(mode='OBJECT')
        unwrapped=temporary.data;temp_layer=unwrapped.uv_layers.active
        by_position={tuple(round(v,6) for v in unwrapped.vertices[loop.vertex_index].co):tuple(temp_layer.data[loop.index].uv) for loop in unwrapped.loops}
        for loop in mesh.loops:
            key=tuple(round(v,6) for v in mesh.vertices[loop.vertex_index].co)
            layer.data[loop.index].uv=by_position[key]
        temp_mesh=temporary.data;bpy.data.objects.remove(temporary,do_unlink=True);bpy.data.meshes.remove(temp_mesh)
        for loop,value in protected.items():layer.data[loop].uv=value
        shared={}
        for loop in mesh.loops:
            row,a=params[loop.vertex_index];shared[(row,round(a,8))]=tuple(layer.data[loop.index].uv)
        far=walls[(section,'far')];layer=far.data.uv_layers.active
        for loop in far.data.loops:
            row,a=WALL_PARAMS[far.name][loop.vertex_index]
            layer.data[loop.index].uv=shared[(row,round(a,8))]

def rubble_specs():
    rng=random.Random(917243);specs=[]
    # Unequal deposits originate from the one collapse and two broken ledges.
    # The larger blocks remain physically solid; small chips are embedded in
    # high, inaccessible ledges instead of becoming decorative road obstacles.
    groups=[(282.7,15.6,18,4),(291.2,16.0,21,5),(300.0,8.6,38,10),
            (300.7,12.7,27,6),(312.6,25.0,14,3),(316.7,16.4,12,3)]
    for gi,(a,row,count,large_count) in enumerate(groups):
        for i in range(count):
            r=clamp(rng.gauss(row,1.05),7.2,27)
            large=i<large_count
            if gi in [2,3]:
                axis,_=gully_profile(r)
                degrees=clamp(rng.gauss(axis,.86),axis-1.50,axis+1.5)
            else:degrees=clamp(rng.gauss(a,.86),START+2.5,END-2.5)
            p=point_at(r,degrees);size=rng.uniform(2.0,4.2) if large else rng.uniform(.36,1.5)
            specs.append({'x':p[0],'z':p[2],'diameter':size,'height':rng.uniform(.55,.94),
                          'yaw':rng.random()*math.tau,'pitch':rng.uniform(-.35,.35),'roll':rng.uniform(-.3,.3),
                          'variant':rng.randrange(6),'large':large,'shade':rng.uniform(.82,1),'gully':gi in [2,3],
                          'section':next(i for i in range(3) if BREAKS[i]<=degrees<=BREAKS[i+1])})
    # One continuous asymmetric talus fan widens toward the unchanged ground.
    # Close interlocking fragments occupy the collapse apron; gaps remain on
    # either side instead of spreading a dotted row around the entire bay.
    for i in range(70):
        row=clamp(rng.gauss(2.7,2.6),0,7.5)
        spread=lerp(4.0,.9,row/7.5)
        degrees=clamp(300.0+rng.gauss(-.20,spread*.68),296.4,303.5)
        p=point_at(row,degrees);a=math.radians(degrees)
        inset=rng.uniform(.0,3.2)*(1-row/1.8) if row<1.8 else 0
        large=i<19
        size=rng.uniform(1.8,3.7) if large else rng.uniform(.38,1.30)
        specs.append({'x':p[0]-math.sin(a)*inset*1.08,'z':p[2]-math.cos(a)*inset,
                      'diameter':size,'height':rng.uniform(.55,.9),
                      'yaw':rng.random()*math.tau,'pitch':rng.uniform(-.24,.24),'roll':rng.uniform(-.25,.25),
                      'variant':rng.randrange(6),'large':large,'shade':rng.uniform(.84,1),
                      'gully':True,'talusFoot':True,'authoringRow':row,
                      'section':next(j for j in range(3) if BREAKS[j]<=degrees<=BREAKS[j+1])})
    return specs

def rubble_points(template,spec):
    rot=Euler((spec['pitch'],spec['roll'],spec['yaw']),'XYZ').to_matrix();points=[]
    for p in template['p']:
        q=to_world(rot@Vector(to_blender((p[0]*spec['diameter'],p[1]*spec['diameter']*spec['height'],p[2]*spec['diameter']))))
        points.append((q[0]+spec['x'],q[1],q[2]+spec['z']))
    low=min(p[1] for p in points);high=max(p[1] for p in points)
    support=sorted(surface_height(x,z)-y for x,y,z in points if y<low+(high-low)*.3)
    anchor=spec.setdefault('anchor',support[len(support)//3]-(.22 if spec['gully'] else .13)*spec['diameter'])
    return [(x,y+anchor,z) for x,y,z in points]

def hull_points(points):
    selected=[]
    for d in [(x,y,z) for x in [-1,0,1] for y in [-1,0,1] for z in [-1,0,1] if x or y or z]:
        p=max(points,key=lambda p:sum(p[k]*d[k] for k in range(3)))
        if p not in selected:selected.append(p)
    return [f32(v) for p in selected for v in p]

def main():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/rocks-lod.glb'))
    originals=sorted([o for o in bpy.context.scene.objects if o.type=='MESH'],key=lambda o:o.name)
    templates={name:[CUT['simplified_template'](o,budget) for o in originals] for name,budget in [('large_near',580),('small_near',320),('large_far',150),('small_far',70)]}
    for o in originals:bpy.data.objects.remove(o,do_unlink=True)
    materials=[]
    for name in ['EXISTING_QUARRY_ROCK','EXISTING_SCAN_ATLAS']:
        mat=bpy.data.materials.new(name);mat.use_nodes=True
        color=mat.node_tree.nodes.new('ShaderNodeVertexColor');color.layer_name='Color'
        mat.node_tree.links.new(color.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);materials.append(mat)
    output=[];specs=rubble_specs();solids=[];collision_positions=[];collision_indices=[];wall_sections=[];pending_closure=[];closure_sections=[]
    walls={(section,level):wall_mesh(section,level,materials[0]) for section in range(3) for level in ['near','far']}
    # World-space photographic projection needs no destructive UV relaxation.
    finish_wall_shading(walls)
    for (section,level),wall in walls.items():
        if level!='near':continue
        wall.data.calc_loop_triangles()
        for tri in wall.data.loop_triangles:
            points=[to_world(wall.data.vertices[i].co) for i in tri.vertices];ti=len(SURFACE);SURFACE.append(points)
            for ix in range(math.floor(min(p[0] for p in points)/4),math.floor(max(p[0] for p in points)/4)+1):
                for iz in range(math.floor(min(p[2] for p in points)/4),math.floor(max(p[2] for p in points)/4)+1):CELLS.setdefault((ix,iz),[]).append(ti)
    for section in range(3):
        for level in ['near','far']:
            wall=walls[(section,level)];output.append(wall)
            if level=='near':
                start=len(collision_positions)//3;first=len(collision_indices)//3
                wall.data.calc_loop_triangles();collision_positions.extend(f32(v) for p in wall.data.vertices for v in to_world(p.co))
                for tri in list(wall.data.loop_triangles)[:WALL_COUNTS[wall.name]]:collision_indices.extend(start+v for v in tri.vertices)
                wall_sections.append({'id':section,'startCell':BREAKS[section],'endCellExclusive':BREAKS[section+1],'firstTriangle':first,'triangleCount':len(collision_indices)//3-first})
                closure_sections.append({'id':section,'relativeFirstTriangle':len(pending_closure)//3,'triangleCount':TOE_RANGES[wall.name]['triangleCount']})
                for tri in list(wall.data.loop_triangles)[WALL_COUNTS[wall.name]:]:pending_closure.extend(start+v for v in tri.vertices)
            ps=[];uv=[];colors=[];faces=[]
            for i,spec in enumerate(specs):
                if spec['section']!=section:continue
                key=('large' if spec['large'] else 'small')+'_'+level;template=templates[key][spec['variant']]
                points=rubble_points(template,spec);offset=len(ps);ps.extend(points);uv.extend(template['uv'])
                shade=spec['shade'];colors.extend([(shade*.84,shade*.92,shade,1)]*len(points));faces.extend(tuple(offset+v for v in f) for f in template['faces'])
                if level=='near' and spec['large']:solids.append({'id':f'west-wall-fragment-{i}','points':hull_points(points)})
            rubble=CUT['make_mesh'](f'WestWallRubble_{section}_{level}',ps,faces,uv,colors,materials[1])
            bm=bmesh.new();bm.from_mesh(rubble.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bm.to_mesh(rubble.data);bm.free();rubble.data.update();output.append(rubble)
    toe_closure={'firstTriangle':len(collision_indices)//3,'triangleCount':len(pending_closure)//3,'sections':closure_sections}
    for item in closure_sections:item['firstTriangle']=toe_closure['firstTriangle']+item.pop('relativeFirstTriangle')
    collision_indices.extend(pending_closure)
    data={'version':1,'sector':SECTOR,'positions':collision_positions,'indices':collision_indices,
          'wallTriangleCount':len(collision_indices)//3,'wallSections':wall_sections,'toeClosure':toe_closure,'solids':solids}
    data_path=ROOT/'src/quarry-west-wall-collision.json';data_path.write_text(json.dumps(data,separators=(',',':')),encoding='utf-8',newline='\n')
    for obj in output:obj.select_set(True)
    blend=ROOT/'source/models/quarry-west-wall.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    glb=ROOT/'public/models/quarry-west-wall.glb';bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,export_materials='EXPORT',export_yup=True)
    report={'version':1,'generator':'tools/author-quarry-west-wall.py','base':'source/models/quarry-west-wall-base.json',
            'source':'Original authored quarry geometry and Poly Haven Rock Moss Set 01 CC0 fragments','source_url':'https://polyhaven.com/a/rock_moss_set_01',
            'runtime_maps':'Shared Rock Face03 2.7m world-space geology with Rock Boulder Dry 1.8m secondary, plus existing Rock Moss Set01 atlas; no embedded textures',
            'sector':data['sector'],'preservedLowerRows':[0,6],'gullyDegrees':GULLY,'wallTriangleCount':data['wallTriangleCount'],'solidCount':len(solids),
            'rubbleCount':len(specs),'rubbleSpecifications':specs,'toeClosure':toe_closure,
            'meshes':[{'name':o.name,'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in output],
            'assets':[{'file':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [glb,blend,data_path,ROOT/'source/models/quarry-west-wall-base.json']]}
    (ROOT/'source/models/quarry-west-wall-manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8',newline='\n')
    print('WEST_WALL_REPORT',json.dumps(report),flush=True)

if __name__=='__main__':main()
