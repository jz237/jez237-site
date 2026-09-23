"""Build a compact SEPTA rail map from the official GTFS release and public OSM structure tags.
Usage: python tools/build_transit.py GTFS.zip tunnels.json bridges.json
OSM inputs: Overpass ways railway=rail|subway|light_rail|tram with tunnel/bridge tags,
within the relief bounds; out geom. All depths remain illustrative.
"""
import csv,io,zipfile,json,sys,math,collections
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]
WEST,SOUTH,EAST,NORTH=-75.8,39.7,-74.7,40.55

def xy(p):return (p[0]*85300,p[1]*111320)
def near(p,a,b):
 dx=b[0]-a[0];dy=b[1]-a[1];d=dx*dx+dy*dy
 t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)) if d else 0
 return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
def simplify(p):
 if len(p)<3:return p
 a,b=xy(p[0]),xy(p[-1]);dist=[near(xy(v),a,b) for v in p[1:-1]]
 best=max(dist,default=0)
 if best<=3:return [p[0],p[-1]]
 i=dist.index(best)+1;return simplify(p[:i+1])[:-1]+simplify(p[i:])
def inside(p):return WEST<=p[0]<=EAST and SOUTH<=p[1]<=NORTH

grid=collections.defaultdict(list)
for filename,kind,tag in [(sys.argv[2],1,'tunnel'),(sys.argv[3],2,'bridge')]:
 doc=json.loads(Path(filename).read_text())
 if doc.get('remark'):raise RuntimeError(doc['remark'])
 for way in doc['elements']:
  if way.get('tags',{}).get(tag) in (None,'no'):continue
  ps=[xy((p['lon'],p['lat'])) for p in way.get('geometry',[])]
  for a,b in zip(ps,ps[1:]):
   if a==b:continue
   for gx in range(math.floor((min(a[0],b[0])-25)/100),math.floor((max(a[0],b[0])+25)/100)+1):
    for gy in range(math.floor((min(a[1],b[1])-25)/100),math.floor((max(a[1],b[1])+25)/100)+1):
     grid[gx,gy].append((a,b,kind))
def classify(a,b):
 a,b=xy(a),xy(b);mid=((a[0]+b[0])/2,(a[1]+b[1])/2);dx,dy=b[0]-a[0],b[1]-a[1]
 found=(25,0)
 for c,d,kind in grid.get((math.floor(mid[0]/100),math.floor(mid[1]/100)),[]):
  vx,vy=d[0]-c[0],d[1]-c[1]
  norm=math.hypot(dx,dy)*math.hypot(vx,vy)
  if norm and abs(dx*vx+dy*vy)/norm<.8:continue
  distance=near(mid,c,d)
  if distance<found[0]:found=(distance,kind)
 return found[1]

outer=zipfile.ZipFile(sys.argv[1]);routes=[];segments={};stops={};infos=[]
for feed in ['google_bus.zip','google_rail.zip']:
 z=zipfile.ZipFile(io.BytesIO(outer.read(feed)))
 def rows(name):return csv.DictReader(io.TextIOWrapper(z.open(name),encoding='utf-8-sig'))
 infos.append(next(rows('feed_info.txt')))
 route_bits={}
 for r in rows('routes.txt'):
  if r['route_type'] not in ('0','1','2'):continue
  route_bits[r['route_id']]=1<<len(routes)
  routes.append({'id':r['route_id'],'name':r['route_long_name'],'color':'#'+r['route_color'],
   'mode':'regional' if r['route_type']=='2' else 'metro'})
 trips={};shape_bits=collections.defaultdict(int)
 for t in rows('trips.txt'):
  bit=route_bits.get(t['route_id'])
  if bit:trips[t['trip_id']]=bit;shape_bits[t['shape_id']]|=bit
 shapes=collections.defaultdict(list)
 for p in rows('shapes.txt'):
  if p['shape_id'] in shape_bits:shapes[p['shape_id']].append((int(p['shape_pt_sequence']),
   (float(p['shape_pt_lon']),float(p['shape_pt_lat']))))
 for sid,points in shapes.items():
  path=simplify([p for _,p in sorted(points)])
  for a,b in zip(path,path[1:]):
   length=math.dist(xy(a),xy(b));steps=max(1,math.ceil(length/80))
   for i in range(steps):
    p=tuple(round(a[j]+(b[j]-a[j])*i/steps,6) for j in range(2))
    q=tuple(round(a[j]+(b[j]-a[j])*(i+1)/steps,6) for j in range(2))
    if p==q:continue
    # Keep crossing segments too; runtime clips exactly at the selected exhibit.
    if max(p[0],q[0])<WEST or min(p[0],q[0])>EAST or max(p[1],q[1])<SOUTH or min(p[1],q[1])>NORTH:continue
    p,q=sorted((p,q));key=(*p,*q)
    if key not in segments:segments[key]=[classify(p,q),0]
    segments[key][1]|=shape_bits[sid]
 stop_bits=collections.defaultdict(int)
 for t in rows('stop_times.txt'):
  bit=trips.get(t['trip_id'])
  if bit:stop_bits[t['stop_id']]|=bit
 for s in rows('stops.txt'):
  bit=stop_bits.get(s['stop_id'])
  if not bit:continue
  p=(float(s['stop_lon']),float(s['stop_lat']))
  if not inside(p):continue
  key=(s['stop_name'],round(p[0],5),round(p[1],5))
  if key not in stops:stops[key]=0
  stops[key]|=bit
out={'source':'SEPTA official GTFS v202609061; OpenStreetMap contributors (ODbL)',
 'sourceUrl':'https://github.com/septadev/GTFS/releases/tag/v202609061','retrieved':'2026-09-23',
 'feeds':[{'version':i['feed_version'],'start':i['feed_start_date'],'end':i['feed_end_date']} for i in infos],
 'routes':routes,'segments':[[*p,*v] for p,v in segments.items()],
 'stops':[[*p,v,classify((p[1],p[2]),(p[1],p[2]))] for p,v in stops.items()]}
p=BASE/'data/underground/septa-rail.json';p.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
print(len(routes),'routes',len(segments),'segments',len(stops),'stops',p.stat().st_size,'bytes')
print(collections.Counter(v[0] for v in segments.values()))
