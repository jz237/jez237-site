import {prepareLoading} from './prepare-loading.mjs';
import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';import {join,posix} from 'node:path';
const packageRoot=fileURLToPath(new URL('../',import.meta.url)),root=existsSync(join(packageRoot,'dist'))?join(packageRoot,'dist'):packageRoot,hash=name=>createHash('sha256').update(readFileSync(join(root,name),'utf8').replaceAll('\r\n','\n')).digest('hex').slice(0,12);
prepareLoading(root);
const modules=readdirSync(root).filter(n=>n.endsWith('.js')).sort(),imports=Object.fromEntries(modules.map(n=>['./'+n,'./'+n+'?v='+hash(n)]));
// Start the entry's entire static module graph from the HTML parser. This
// removes the request-per-import-depth waterfall without fetching salvage-only
// modules on the racing page (or breaking the readable source files).
function moduleGraph(entry){
 const seen=new Set();
 function visit(name){if(seen.has(name))return;seen.add(name);
  const source=readFileSync(join(root,name),'utf8');
  for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+\.js)['"]/g))visit(posix.normalize(posix.join(posix.dirname(name),match[1])));
 }
 visit(entry);return [...seen];
}
for(const [name,entry] of [['race.html','race-view.js'],['index.html','main.js']]){let html=readFileSync(join(root,name),'utf8').replace(/<script type="importmap">[\s\S]*?<\/script>\s*/g,'').replace(/<link rel="modulepreload"[^>]*>\s*/g,'');const preload=moduleGraph(entry).map(n=>'<link rel="modulepreload" href="'+(imports['./'+n]||'./'+n)+'">').join('\n');html=html.replace('</head>','<script type="importmap">'+JSON.stringify({imports})+'</script>\n'+preload+'\n</head>');html=html.replace(new RegExp('src="\\./'+entry.replaceAll('.','\\.')+'(?:\\?[^" ]*)?"'),'src="'+imports['./'+entry]+'"');html=html.replace(/href="\.\/([^"?]+\.css)(?:\?[^" ]*)?"/g,(_,css)=>'href="./'+css+'?v='+hash(css)+'"');writeFileSync(join(root,name),html);}
console.log('Versioned '+modules.length+' modules and both page styles.');
