"""Original explanatory vector art. Analogy diagrams, never experimental data."""
from pathlib import Path
from html import escape
out=Path(__file__).parent/'illustrations'
def save(name,title,body):
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">An original conceptual illustration, not a measurement or literal molecular structure.</desc><defs><radialGradient id="bg"><stop stop-color="#103259"/><stop offset="1" stop-color="#041024"/></radialGradient><linearGradient id="beam"><stop stop-color="#27dcff"/><stop offset="1" stop-color="#7c85ff"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#78caff" stroke-opacity=".07"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="8"/></filter><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#57dcff" stroke-width="1.5"/></marker></defs><rect width="800" height="440" fill="url(#bg)"/><rect width="800" height="440" fill="url(#grid)"/><g font-family="system-ui,sans-serif" fill="#d8ecff">{body}</g><text x="32" y="412" font-family="system-ui,sans-serif" font-size="12" fill="#87a6c8" letter-spacing="2">THE IDEA, ILLUSTRATED · NOT TO SCALE</text></svg>'''
 (out/(name+'.svg')).write_text(svg+'\n')
def label(x,y,text,size=17):return f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}">{escape(text)}</text>'
save('research-loop','AI proposes a test, tools run it, evidence shapes the next question', '<circle cx="400" cy="210" r="128" fill="none" stroke="#4780be" stroke-width="1" stroke-dasharray="3 9"/><path d="M300 110Q440 10 555 125M604 200Q635 315 488 340M335 335Q185 300 218 180" fill="none" stroke="#57dcff" stroke-width="3" marker-end="url(#arrow)"/><g fill="#092a46" stroke="#57dcff" stroke-width="2"><rect x="179" y="89" width="170" height="80" rx="18"/><rect x="480" y="156" width="170" height="80" rx="18"/><rect x="310" y="293" width="170" height="65" rx="18"/></g>'+label(264,125,'Ask a question')+label(264,150,'AI + human goal',12)+label(565,192,'Run a test')+label(565,217,'In a lab or simulator',12)+label(395,321,'Check the answer')+label(395,344,'Then choose the next test',12)+label(405,209,'Evidence',26)+label(405,239,'changes the plan',14))
save('allergy-latch','A possible allergy drug component helps detach a trigger from a cell', '<path d="M50 290Q400 225 750 290V390H50Z" fill="#143553" stroke="#5b9bbd" stroke-width="2"/><path d="M380 280V215H420V280" fill="#597a9d" stroke="#9ac6df" stroke-width="3"/><path d="M355 177L380 201H420L445 177L422 143H380Z" fill="#ba82e8" stroke="#dfb3ff" stroke-width="3"/><path d="M455 150Q525 116 576 150L555 176L501 173L476 190" fill="none" stroke="#53eff4" stroke-width="16" stroke-linecap="round"/><path d="M430 116Q440 76 482 63" fill="none" stroke="#57dcff" stroke-width="3" marker-end="url(#arrow)"/>'+label(220,130,'Allergy trigger')+'<path d="M230 143L353 164" stroke="#b6cfe6"/>'+label(620,112,'Designed helper')+label(400,335,'Immune-cell surface',22)+label(400,365,'The goal: unhook the trigger',15))
save('molecular-grip','Designing a protein piece to fit its target more tightly', '<path d="M95 180Q125 106 197 145L224 113L266 160L296 163V238L270 238L236 282L197 248Q125 276 95 218Z" fill="#256f9a" stroke="#64d9ff" stroke-width="3"/><path d="M434 164H466L500 121L537 158Q606 121 644 182V220Q608 279 540 246L502 282L466 237H434Z" fill="#5d3e93" stroke="#c4a2ff" stroke-width="3"/><path d="M326 198H400" stroke="#57dcff" stroke-width="3" marker-end="url(#arrow)"/><circle cx="427" cy="202" r="110" fill="none" stroke="#73d7fc" stroke-opacity=".2" stroke-dasharray="5 9"/>'+label(192,327,'A target')+label(540,327,'A designed protein grip')+label(400,75,'Shape matters',27)+label(400,365,'A better fit is a starting point—not a finished medicine.',15))
save('cell-switch','A smaller instruction switch inside an engineered immune cell', '<circle cx="575" cy="210" r="120" fill="#102f4a" stroke="#66a9d0" stroke-width="3"/><path d="M573 90V154M553 71L573 92L595 71" fill="none" stroke="#73e9fb" stroke-width="9" stroke-linecap="round"/><rect x="560" y="154" width="27" height="48" rx="6" fill="#b79aff"/><rect x="163" y="148" width="45" height="136" rx="9" fill="#7e85b4"/><rect x="270" y="148" width="45" height="46" rx="9" fill="#b79aff"/><path d="M225 170H254" stroke="#57dcff" stroke-width="3" marker-end="url(#arrow)"/><path d="M338 170H400" stroke="#57dcff" stroke-width="3" marker-end="url(#arrow)"/>'+label(185,322,'Usual switch')+label(292,322,'Smaller design')+label(575,253,'Immune cell',22)+label(575,285,'An internal control switch',14)+label(400,49,'Less genetic space. More room for other instructions.',19))
import math
sym=''
for center,angle,col in [(235,0,'#52d9ff'),(570,60,'#b5a0ff')]:
 points=[]
 for k in range(6):
  a=math.radians(k*60+angle);points.append((center+90*math.cos(a),200+90*math.sin(a)))
 sym+='<polygon points="'+' '.join(f'{x:.1f},{y:.1f}' for x,y in points)+f'" fill="none" stroke="{col}" stroke-width="3"/>'
 for x,y in points:sym+=f'<path d="M{center} 200L{x:.1f} {y:.1f}" stroke="{col}" stroke-opacity=".5"/><circle cx="{x:.1f}" cy="{y:.1f}" r="9" fill="{col}"/>'
 sym+=label(center,336,'Before a turn' if center==235 else 'After a turn')
save('symmetry','A simple pattern illustrates the idea of symmetry, not the actual theorem',sym+'<path d="M362 174Q400 128 440 174" fill="none" stroke="#57dcff" stroke-width="3" marker-end="url(#arrow)"/>'+label(400,63,'Different move. Same pattern.',25)+label(400,377,'A familiar doorway into a much more abstract question.',14))
waves=''
for phase,col in [(0,'#57dcff'),(2.1,'#ad9aff')]:
 pts=' '.join(f'{x},{245+52*math.sin(x/28+phase):.2f}' for x in range(42,760,3));waves+=f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="2" opacity=".6"/>'
pts=' '.join(f'{x},{245-155*math.exp(-((x-400)/48)**2):.2f}' for x in range(42,760,3));waves+=f'<polyline points="{pts}" fill="none" stroke="#e6f6ff" stroke-width="4"/>'
save('waves','An illustrative wave peak concentrates briefly, without plotting real data',waves+'<circle cx="400" cy="110" r="67" fill="none" stroke="#60daff" stroke-opacity=".3"/>'+label(400,47,'A concentrated peak can be brief',24)+label(400,346,'The proof claim is about ideal mathematical waves.',16))
branches=''
for level in range(5):
 n=2**level;y=95+level*54
 for j in range(n):
  x=50+(j+.5)*700/n
  if level:
   parent=50+(j//2+.5)*700/(n//2);branches+=f'<path d="M{parent} {y-54}L{x} {y}" stroke="#437bad" stroke-width="1.7"/>'
  branches+=f'<circle cx="{x}" cy="{y}" r="5" fill="#75caff"/>'
save('branching','A branching search illustrates how choices multiply as a problem grows',branches+'<path d="M400 95Q255 185 444 310" fill="none" stroke="#c09aff" stroke-width="5" stroke-dasharray="6 6"/>'+label(400,45,'More choices. A much bigger search.',24)+label(400,365,'The claim challenges a theoretical limit—not all hard problems.',15))
print('Created',len(list(out.glob('*.svg'))),'original SVG explanations')
