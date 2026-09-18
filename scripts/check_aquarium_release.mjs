import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
export function aquariumBuildHash(root=resolve(import.meta.dirname,'..')){
 const base=resolve(root,'demos/rotatable-aquascape'),manifest=JSON.parse(readFileSync(resolve(base,'build-manifest.json'),'utf8'));
 const hash=createHash('sha256');
 for(const file of [...manifest].sort())hash.update(file).update(readFileSync(resolve(base,file),'utf8').replaceAll('\r\n','\n'));
 const publicRoot=resolve(root,'scripts/rotatable-aquascape/public');
 const files=(directory,prefix='')=>readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(resolve(directory,e.name),prefix+e.name+'/'):[prefix+e.name]);
 for(const file of files(publicRoot).sort()){
  const bytes=readFileSync(resolve(base,file));hash.update(file).update(/\.(md|txt|json|gltf|svg)$/.test(file)?bytes.toString().replaceAll('\r\n','\n'):bytes);
 }
 return hash.digest('hex');
}
export function checkAquariumRelease(root=resolve(import.meta.dirname,'..')){
 const path=resolve(root,'scripts/rotatable-aquascape/qa/approved-build.json');
 if(!existsSync(path))throw Error('Aquarium release checks missing. Run npm run check:release in scripts/rotatable-aquascape.');
 const receipt=JSON.parse(readFileSync(path,'utf8'));
 if(receipt.buildHash!==aquariumBuildHash(root)||!['behavior','browser','visual','performance','sync'].every(k=>receipt.checks?.[k]===true))throw Error('Aquarium build has not passed release checks. Run npm run check:release.');
 return receipt;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{checkAquariumRelease();console.log('Aquarium tested-build release gate passed.');}catch(e){console.error(e.message);process.exitCode=1;}}
