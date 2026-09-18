import {execFileSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';
import {aquariumBuildHash} from '../../check_aquarium_release.mjs';
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'../..');
const npm=process.platform==='win32'?'npm.cmd':'npm';
function run(command,args,cwd=root){execFileSync(command,args,{cwd,stdio:'inherit',shell:process.platform==='win32'&&command===npm});}
const receipt=path.join(import.meta.dirname,'approved-build.json');if(fs.existsSync(receipt))fs.unlinkSync(receipt);
run(npm,['test']);run(npm,['run','build:sites']);
run(process.execPath,['qa/browser-check.mjs',...process.argv.slice(2)]);
run(process.execPath,['scripts/check_aquarium_sync.mjs'],repo);
fs.writeFileSync(receipt,JSON.stringify({buildHash:aquariumBuildHash(repo),checkedAt:new Date().toISOString(),checks:{behavior:true,browser:true,visual:true,performance:true,sync:true}},null,2)+'\n');
console.log('Aquarium release checks passed. Review screenshots in .qa-results before publishing.');
