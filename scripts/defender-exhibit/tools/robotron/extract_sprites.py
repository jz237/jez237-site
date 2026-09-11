"""Usage: python extract_sprites.py PATH_TO_historicalsource_robotron_CHECKOUT"""
from pathlib import Path
import re,json,sys
# Extract original packed-nibble row-major sprite frames from the published source.
sprites={}
for path in Path(sys.argv[1]).glob('*.ASM'):
 lines=path.read_text().splitlines();data={};label=None
 for line in lines:
  m=re.match(r'^(\w+)\s+(?:FCB|FDB|EQU)',line)
  if m:label=m[1];data[label]=[]
  m=re.search(r'\b(FCB|FDB)\s+((?:\$[\dA-F]+|\d+)(?:,(?:\$[\dA-F]+|\d+))*)',line)
  if m and label:
   for v in m[2].split(','):
    n=int(v[1:],16) if v.startswith('$') else int(v)
    data[label]+=list(n.to_bytes(2 if m[1]=='FDB' else 1,'big'))
 for i,line in enumerate(lines[:-1]):
  m=re.match(r'^(\w+)\s+FCB\s+(\d+),(\d+)\s*$',line)
  ptr=re.search(r'\bFDB\s+(\w+)',lines[i+1])
  if m and ptr:
   name,w,h=m[1],int(m[2]),int(m[3]);raw=data.get(ptr[1],[])
   if 1<=w<=20 and 2<=h<=24 and len(raw)>=w*h:
    sprites[name]=[''.join(f'{x:02x}' for x in raw[y*w:(y+1)*w]) for y in range(h)]
out=Path(__file__).resolve().parents[2]/'src/RobotronSprites.ts'
out.write_text('/** Original Williams Robotron pixel data. Source: github.com/historicalsource/robotron. Row-major packed nibbles; no game program is bundled. */\nexport const robotronSprites:Record<string,string[]>='+json.dumps(sprites,separators=(',',':'))+';\n',encoding='utf-8')
print('sprites',len(sprites),list(sprites))
