import {cp,rm,mkdir,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const target=path.resolve(root,'../../demos/bearded-dragon-terrarium');
if(path.basename(target)!=='bearded-dragon-terrarium'||!target.includes(`${path.sep}demos${path.sep}`))throw new Error(`Unexpected destination ${target}`);
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});await cp(path.join(root,'dist'),target,{recursive:true});await cp(path.join(root,'README.md'),path.join(target,'README.md'));
const files=[];async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())await walk(p);else files.push(path.relative(target,p).replaceAll('\\','/'));}}await walk(target);
await writeFile(path.join(target,'build-manifest.json'),JSON.stringify({built:new Date().toISOString(),files:files.sort()},null,2));console.log(`Published ${files.length} files to demos/bearded-dragon-terrarium/`);
