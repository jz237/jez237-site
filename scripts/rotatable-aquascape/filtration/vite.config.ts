import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({root:import.meta.dirname,base:'./',publicDir:false,server:{host:'127.0.0.1',port:5246,strictPort:true},build:{outDir:resolve(import.meta.dirname,'../filtration-dist'),emptyOutDir:true}});
