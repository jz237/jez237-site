const fs=require('fs'),vm=require('vm');
require('esbuild').buildSync({entryPoints:['src/modern-renderer.mjs'],bundle:true,format:'iife',outfile:'assets/modern3d.js',minify:true,legalComments:'eof'});
for(const name of fs.readdirSync('assets').filter(n=>n.endsWith('.js')))new vm.Script(fs.readFileSync('assets/'+name,'utf8'),{filename:name});
fs.mkdirSync('dist',{recursive:true});fs.copyFileSync('index.html','dist/index.html');fs.cpSync('assets','dist/assets',{recursive:true});
console.log('Built static game. All scripts passed syntax validation.');
