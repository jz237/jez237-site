import {readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const name of ['hidden-reef','hidden-reef-header-preview']){let bytes=0;const scan=p=>{for(const e of readdirSync(p,{withFileTypes:true})){const f=resolve(p,e.name);if(e.isDirectory())scan(f);else bytes+=statSync(f).size;}};scan(resolve(root,'prototypes',name));if(bytes>100000)throw Error('Hidden Reef duplicate site detected; keep links only.');}console.log('Hidden Reef pointer-only guard passed.');
