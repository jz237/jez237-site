import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkPondFilterLinks} from './check_pond_filter_links.mjs';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'..');
function servedCopy(failure='',hiddenReef=false){return async input=>{
 const url=new URL(input),relative=(hiddenReef?'prototypes/hidden-reef':'')+url.pathname;
 let path=resolve(repo,relative.replace(/^\//,''));
 if(url.pathname.endsWith('/'))path=resolve(path,'index.html');
 else if(!existsSync(path))path+='.html';
 let body=readFileSync(path,'utf8');
 if(failure==='stale'&&url.pathname.includes('koi-pond'))body=body.replace(/<a class="filter-link"[\s\S]*?<\/a>/,'');
 if(failure==='styles'&&url.pathname.endsWith('reef.css'))body='/* old navigation stylesheet */';
 if(failure==='destination'&&url.pathname.includes('filtoclear'))return new Response('Not found',{status:404});
 return new Response(body);
};}
test('all demo and storefront pond links match the current release',async()=>{
 await checkPondFilterLinks('https://example.test',servedCopy());
});
test('Hidden Reef uses its own pond and filter mounts',async()=>{
 await checkPondFilterLinks('https://hidden-reef.test',servedCopy('',true),{hiddenReef:true});
});
for(const [failure,message] of [['stale',/navigation/],['styles',/styles/],['destination',/destination/]]){
 test(`blocks a release with ${failure} pond content`,async()=>{
  await assert.rejects(checkPondFilterLinks('https://example.test',servedCopy(failure)),message);
 });
}
