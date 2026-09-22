import {build,transform,version} from 'esbuild';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const normalized=async file=>(await readFile(path.join(root,file),'utf8')).replaceAll('\r\n','\n');
const sources=['app.css','tools/build.mjs','package.json'];
for(const dir of ['src','vendor']){
  for(const name of (await readdir(path.join(root,dir))).sort()){
    if(name.endsWith('.js'))sources.push(`${dir}/${name}`);
  }
}
const sourceHash=hash((await Promise.all(sources.map(async file=>file+'\n'+await normalized(file)))).join('\n'));
const manifestPath=path.join(root,'load/manifest.json');
if(process.argv.includes('--check')){
  const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
  if(manifest.sourceHash!==sourceHash)throw Error('Browser build is stale. Run npm run build.');
  for(const [file,digest] of Object.entries(manifest.files)){
    if(hash(await normalized(file))!==digest)throw Error(`Browser output changed: ${file}`);
  }
  const html=await normalized('index.html');
  if(!html.includes(`src="${manifest.entry}"`)||!html.includes(`href="${manifest.css}"`)){
    throw Error('HTML is not using the tested browser build.');
  }
  console.log(`Browser build verified: ${manifest.startupRequests} startup scripts.`);
}else{
  const result=await build({absWorkingDir:root,entryPoints:{app:'src/main.js'},bundle:true,
    format:'esm',splitting:true,platform:'browser',target:'es2022',minify:true,metafile:true,
    outdir:'load',entryNames:'[name]-[hash]',chunkNames:'chunk-[hash]',legalComments:'inline',
    plugins:[{name:'one-local-module-version',setup(builder){
      builder.onResolve({filter:/^https?:/},args=>({path:args.path,external:true}));
      builder.onResolve({filter:/philadelphia-cesium\/config\.js/},()=>({
        path:'/demos/philadelphia-cesium/config.js?v=philly-2026092121',external:true}));
      builder.onResolve({filter:/\.js\?/},args=>({
        path:path.resolve(args.resolveDir,args.path.split('?')[0])}));
    }}]});
  const outputs=result.metafile.outputs;
  const entry=Object.keys(outputs).find(file=>outputs[file].entryPoint==='src/main.js');
  if(!entry)throw Error('Missing browser entry point');
  const startup=new Set();
  function visit(file){
    if(startup.has(file))return;startup.add(file);
    for(const dep of outputs[file].imports){
      if(!dep.external&&dep.kind==='import-statement')visit(dep.path);
    }
  }
  visit(entry);
  const cssResult=await transform(await normalized('app.css'),{loader:'css',minify:true,target:'es2022'});
  const css=`load/style-${hash(cssResult.code).slice(0,12)}.css`;
  await mkdir(path.join(root,'load'),{recursive:true});await writeFile(path.join(root,css),cssResult.code);
  let html=await normalized('index.html');
  html=html.replace(/<link rel="modulepreload"[^>]*>\s*/g,'');
  html=html.replace(/<link rel="stylesheet" href="(?:app\.css[^" ]*|load\/style-[^" ]*)" \/>/,
    `<link rel="stylesheet" href="${css}" />`);
  html=html.replace(/<script type="module" src="(?:src\/main\.js[^" ]*|load\/app-[^" ]*)"/,
    `<script type="module" src="${entry}"`);
  const preload=[...startup].map(file=>`<link rel="modulepreload" href="${file}" />`).join('\n');
  html=html.replace('</head>',preload+'\n</head>');await writeFile(path.join(root,'index.html'),html);
  const files={};
  for(const file of [...Object.keys(outputs),css])files[file]=hash(await normalized(file));
  const startupBytes=[...startup].reduce((sum,file)=>sum+outputs[file].bytes,0);
  await writeFile(manifestPath,JSON.stringify({version:1,esbuild:version,sourceHash,entry,css,
    startupRequests:startup.size,startupBytes,files},null,2)+'\n');
  console.log(`Browser build: ${startup.size} startup scripts, ${startupBytes} bytes; optional tools split.`);
}
