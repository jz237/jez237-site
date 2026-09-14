// Cache-busting importmap generator (forked from After the Storm). Run after every module change:
//   node source/version-assets.mjs
// Every ./*.js module gets a ?v=<sha256 prefix> entry; index.html's importmap, module script and stylesheet
// links are rewritten in place. The "three" and "three/addons/" specifiers point at the vendored r185 tree.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),hash=name=>createHash('sha256').update(readFileSync(join(root,name),'utf8').replaceAll('\r\n','\n')).digest('hex').slice(0,12);
const modules=readdirSync(root).filter(n=>n.endsWith('.js')).sort();
const imports=Object.fromEntries(modules.map(n=>['./'+n,'./'+n+'?v='+hash(n)]));
imports['three']='./vendor/three.module.js?v='+hash('vendor/three.module.js');
imports['three/addons/']='./vendor/jsm/';
for(const [name,entry] of [['index.html','main.js']]){
 let html=readFileSync(join(root,name),'utf8').replace(/<script type="importmap">[\s\S]*?<\/script>\s*/g,'');
 html=html.replace('<script type="module"','<script type="importmap">'+JSON.stringify({imports})+'</script>\n<script type="module"');
 html=html.replace(new RegExp('src="\\./'+entry.replaceAll('.','\\.')+'(?:\\?[^" ]*)?"'),'src="'+imports['./'+entry]+'"');
 html=html.replace(/href="\.\/([^"?]+\.css)(?:\?[^" ]*)?"/g,(_,css)=>'href="./'+css+'?v='+hash(css)+'"');
 writeFileSync(join(root,name),html);
}
console.log('Versioned '+modules.length+' modules.');
