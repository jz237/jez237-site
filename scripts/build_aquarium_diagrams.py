#!/usr/bin/env python3
"""Original AI-assisted vector illustrations; no third-party artwork."""
from pathlib import Path
from html import escape
import json

OUT = Path(__file__).resolve().parents[1] / 'newsletter'
INK, GREEN, BLUE, PAPER = '#183c35', '#39765e', '#4a8294', '#f6f5ee'

def text(x, y, value, size=36):
    return f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" font-weight="600" fill="{INK}">{escape(value)}</text>'

def plant(x, y, scale=1.0):
    return f'''<g transform="translate({x} {y}) scale({scale})" stroke="{GREEN}" stroke-width="8" fill="{GREEN}" stroke-linecap="round"><path d="M0 0V-105"/><path d="M0-35Q-60-90-55-40Q-40-10 0-35M0-65Q60-120 55-70Q40-40 0-65"/></g>'''

def svg(title, content):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 680" width="960" height="680" role="img" aria-labelledby="title"><title id="title">{escape(title)}</title><rect width="960" height="680" rx="20" fill="{PAPER}"/>{content}</svg>'''

panels = ''.join(f'<rect x="{x}" y="{y}" width="432" height="290" rx="18" fill="{color}"/>' for x,y,color in [(32,32,'#e2ebdf'),(496,32,'#e1edf0'),(32,354,'#eee5d6'),(496,354,'#e2ebdf')])
content = panels + text(60,88,'1 · OPEN') + text(524,88,'2 · RINSE') + text(60,410,'3 · DIVIDE') + text(524,410,'4 · PLANT')
content += f'<path d="M152 166L172 286H320L340 166Z" fill="#b3c7b1" stroke="{INK}" stroke-width="6"/><ellipse cx="246" cy="166" rx="94" ry="20" fill="#f8fbf6" stroke="{INK}" stroke-width="6"/>' + plant(245,214,.7)
content += f'<path d="M602 150h153v30" fill="none" stroke="{INK}" stroke-width="16" stroke-linecap="round"/><path d="M745 198v28m20-28v28m-10 12v22" stroke="{BLUE}" stroke-width="7" stroke-linecap="round"/>' + plant(755,270,.8)
content += ''.join(plant(x,578,.55) for x in [140,248,356]) + f'<path d="M194 492v90m108-90v90" stroke="{INK}" stroke-width="3" stroke-dasharray="8 10"/>'
content += '<path d="M528 580Q650 560 904 580V620H528Z" fill="#b7a28a"/>' + ''.join(plant(x,585,.5) for x in [594,716,838])
(OUT/'images/tissue-culture-steps.svg').write_text(svg('Open the cup, rinse away growing medium, divide, then plant. Substrate planting shown; rhizome plants need a different placement.',content))

content = text(44,70,'TOP-OFF ≠ WATER CHANGE',42)
content += '<rect x="32" y="106" width="432" height="540" rx="18" fill="#e1edf0"/><rect x="496" y="106" width="432" height="540" rx="18" fill="#e2ebdf"/>'
content += text(60,168,'Evaporation') + text(524,168,'Water removed')
for x in [80,544]:
    content += f'<path d="M{x} 310v200h330V310" fill="#bcd7dc" stroke="{INK}" stroke-width="7"/><path d="M{x+10} 358h310" stroke="{BLUE}" stroke-width="5" stroke-dasharray="12 9"/>'
    content += ''.join(f'<circle cx="{x+dx}" cy="{dy}" r="7" fill="{INK}"/>' for dx,dy in [(55,420),(130,465),(235,412),(280,475)])
content += f'<path d="M174 294v-60m-15 18 15-18 15 18M294 294v-60m-15 18 15-18 15 18" fill="none" stroke="{BLUE}" stroke-width="6"/>'
content += f'<path d="M680 294v-60h150v70m-15-18 15 18 15-18" fill="none" stroke="{BLUE}" stroke-width="6"/>'
content += text(60,558,'Add fresh water',32) + text(60,606,'Salt stays behind',28) + text(524,558,'Add mixed saltwater',30) + text(524,606,'Match the aquarium',28)
(OUT/'images/reef-top-off.svg').write_text(svg('For evaporation, replace fresh water; salt remains in the aquarium. For a saltwater water change, replace removed water with appropriately prepared saltwater.',content))

content = text(44,72,'FILTER MEDIA DO DIFFERENT JOBS',38)
for x,color in [(32,'#e1edf0'),(342,'#e2ebdf'),(652,'#eee5d6')]:
    content += f'<rect x="{x}" y="118" width="276" height="500" rx="18" fill="{color}"/>'
content += text(52,180,'Mechanical',30) + text(362,180,'Biological',30) + text(672,180,'Chemical',30)
content += f'<rect x="92" y="240" width="150" height="170" rx="16" fill="#829eaa" stroke="{INK}" stroke-width="6"/>'
for x in [115,150,185,220]:
    for y in [270,310,350,390]:
        content += f'<circle cx="{x}" cy="{y}" r="8" fill="#e1edf0"/>'
for x,y in [(424,280),(510,340),(424,400)]:
    content += f'<circle cx="{x}" cy="{y}" r="36" fill="#b2c5a1" stroke="{INK}" stroke-width="5"/><circle cx="{x}" cy="{y}" r="13" fill="#e2ebdf"/>'
for x,y in [(720,275),(775,290),(830,275),(742,340),(807,350),(720,400),(780,410),(840,400)]:
    content += f'<rect x="{x}" y="{y}" width="27" height="36" rx="10" fill="#485e59"/>'
for x,a,b in [(52,'Traps','particles'),(362,'Hosts','microbes'),(672,'Targets','substances')]:
    content += text(x,510,a,32) + text(x,552,b,32)
(OUT/'images/filter-media.svg').write_text(svg('Mechanical media trap particles, biological media host microbes, and chemical media target substances. Some media serve more than one role.',content))

content = text(44,72,'A NEW TANK BUILDS ITS BIOFILTER',38)
steps=[(40,'#e1edf0','Fish waste','& food'),(270,'#eee5d6','Ammonia','most toxic'),(500,'#e2ebdf','Nitrite','also toxic'),(730,'#e1edf0','Nitrate','less toxic')]
for x,color,a,b in steps:
    content += f'<rect x="{x}" y="130" width="190" height="230" rx="18" fill="{color}"/>' + text(x+18,300,a,30) + text(x+18,340,b,24)
content += f'<g fill="{INK}"><ellipse cx="135" cy="205" rx="52" ry="24"/><path d="M180 205l28-20v40z"/></g><circle cx="118" cy="200" r="5" fill="{PAPER}"/>'
content += f'<text x="320" y="230" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="{INK}">NH₃</text><text x="548" y="230" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="{INK}">NO₂</text><text x="778" y="230" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="{INK}">NO₃</text>'
for x in [236,466,696]:
    content += f'<path d="M{x} 245h24m-10-10 10 10-10 10" fill="none" stroke="{GREEN}" stroke-width="6" stroke-linecap="round"/>'
for x in [480,710]:
    content += f'<path d="M{x} 262v118" stroke="{GREEN}" stroke-width="3" stroke-dasharray="6 7"/><text x="{x}" y="408" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="600" fill="{GREEN}">bacteria</text>'
content += f'<path d="M825 366v44m-12-12 12 12 12-12" fill="none" stroke="{BLUE}" stroke-width="6" stroke-linecap="round"/><text x="900" y="446" text-anchor="end" font-family="Arial,sans-serif" font-size="24" font-weight="600" fill="{BLUE}">removed by water changes</text>'
content += f'<path d="M60 476h840" stroke="{INK}" stroke-width="3"/>'
content += text(60,520,'Weeks 1–6: stock lightly, test ammonia, nitrite and pH',28) + text(60,566,'Established: nitrite falls back down',28) + text(60,630,'Simplified; not to scale',22)
(OUT/'images/nitrogen-cycle.svg').write_text(svg('Fish waste and food produce ammonia; bacteria convert it to nitrite and then nitrate, which water changes remove. A new tank needs weeks for these bacteria to build up.',content))

content = text(44,72,'WRITE THE RESULT WITH ITS UNITS',38)
content += '<rect x="32" y="110" width="330" height="536" rx="18" fill="#e1edf0"/><rect x="392" y="110" width="536" height="536" rx="18" fill="#fffefa" stroke="#d4dbcf" stroke-width="3"/>'
for i,(x,fill) in enumerate([(88,'#d9e6a8'),(168,'#f2c58a'),(248,'#e79a8f')]):
    content += f'<rect x="{x}" y="190" width="46" height="250" rx="20" fill="#fffefa" stroke="{INK}" stroke-width="5"/><rect x="{x+5}" y="300" width="36" height="135" rx="16" fill="{fill}"/><rect x="{x-6}" y="172" width="58" height="26" rx="6" fill="{INK}"/>'
content += text(60,500,'Sample, reagent,',28) + text(60,540,'wait time, light',28) + text(60,600,'per the kit’s own steps',24)
rows=[('Tank','Living-room tank'),('Date / time','Nov 1 · 6 pm'),('Test · kit','Nitrate · drops'),('Result','10–20 ppm'),('Context','after water change'),('Next check','retest Nov 4')]
for i,(a,b) in enumerate(rows):
    y=180+i*72
    content += text(424,y,a,24) + f'<text x="640" y="{y}" font-family="Arial,sans-serif" font-size="26" fill="{BLUE}">{escape(b)}</text><path d="M424 {y+22}h476" stroke="#d4dbcf" stroke-width="2"/>'
content += text(424,630,'Example entry; not a target value',22)
(OUT/'images/test-log.svg').write_text(svg('Test vials beside a log card with one line per observation: tank, date and time, test and kit, result with units, context, and next check.',content))

records = [
 {'filename':'tissue-culture-steps.svg','title':'From cup to aquarium','alt':'Four illustrated steps: open a tissue-culture cup, rinse away growing medium, separate small portions, and plant. Substrate-planting example only.','width':960,'height':680,'caption':'Original schematic: substrate planting is shown. Keep Anubias rhizomes exposed; follow the species instructions.','sources':['https://tropica.com/en/plants/1-2-grow/','https://dennerleplants.com/en/support/faq/']},
 {'filename':'reef-top-off.svg','title':'Two different water replacements','alt':'Evaporation removes water but leaves salt behind: top off with appropriate fresh water. A saltwater water change removes both: replace with prepared saltwater.','width':960,'height':680,'caption':'Original schematic, not a dosing chart. Verify the cause of a water-level change and measure salinity.','sources':['https://edis.ifas.ufl.edu/publication/4H433/pdf','https://g1.redseafish.com/how-to-mix-salt/']},
 {'filename':'filter-media.svg','title':'The jobs inside a filter','alt':'Mechanical media trap particles; biological media host microbes; chemical media target substances. A medium can perform more than one job.','width':960,'height':680,'caption':'Original schematic. Identify each medium’s job and follow the filter manufacturer’s care instructions.','sources':['https://www.aqueon.com/articles/aquarium-filtration-basics','https://seachem.zendesk.com/hc/en-us/articles/360038209893-Guide-Caring-for-the-Freshwater-Tank']},
 {'filename':'nitrogen-cycle.svg','title':'How a new tank builds its biofilter','alt':'Schematic: fish waste and food become ammonia; bacteria turn ammonia into nitrite, then nitrate; water changes remove nitrate. Stock lightly for the first weeks and test until nitrite falls.','width':960,'height':680,'caption':'Original schematic of the nitrogen cycle in a new aquarium; simplified and not to scale.','sources':['https://journals.flvc.org/edis/article/download/109188/104367/152407','https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-siamese-fighting-fish-bettas/']},
 {'filename':'test-log.svg','title':'A water-test log entry','alt':'Three test vials beside a log card listing tank, date and time, test and kit, result with units, context and the next check. Example entry only, not a target value.','width':960,'height':680,'caption':'Original schematic of a test-log entry; the values are an example, not a recommended level.','sources':['https://www.apifishcare.com/products/api-freshwater-master-test-kit','https://www.jbl.de/en/blog/detail/171/inaccurate-water-tests-or-did-i-do-something-wrong-after-all?country=fi']}
]
(OUT/'illustrations.json').write_text(json.dumps(records,indent=2,ensure_ascii=False)+'\n')
print(f'Built {len(records)} original SVG illustrations and their manifest.')
