import { build } from 'esbuild';
await build({entryPoints:['src.js'],bundle:true,format:'iife',outfile:'skynet-live.js',minify:true,legalComments:'eof'});
console.log('Built offline-capable skynet-live.js');
