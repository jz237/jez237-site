const fs=require('fs'),vm=require('vm');
// Shard Assault 3D renderer: src3d/main.mjs (+ src3d/actors) -> assets/shard3d.js
require('esbuild').buildSync({entryPoints:['src3d/main.mjs'],bundle:true,format:'iife',outfile:'assets/shard3d.js',minify:true,legalComments:'eof',target:'es2020'});
for(const name of fs.readdirSync('assets').filter(n=>n.endsWith('.js')))new vm.Script(fs.readFileSync('assets/'+name,'utf8'),{filename:name});
console.log('Built assets/shard3d.js. All scripts passed syntax validation.');
