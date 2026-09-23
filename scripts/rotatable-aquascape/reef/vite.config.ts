import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({root:resolve(import.meta.dirname),base:'./',publicDir:false,server:{host:'127.0.0.1',port:5240,strictPort:true,fs:{allow:[resolve(import.meta.dirname,'..')]}},build:{outDir:resolve(import.meta.dirname,'../reef-dist'),emptyOutDir:true}});
