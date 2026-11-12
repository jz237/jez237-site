import {defineConfig} from 'vite';
import {resolve} from 'node:path';
// assetsInlineLimit 0: the shared filter runtime links its stylesheet with new URL('./runtime.css',import.meta.url). Vite inlined that
// small file as a data: URL, which the site's Content-Security-Policy (style-src 'self' 'unsafe-inline') refuses, so the Graphics
// selector lost its styling on jez237.com. Emitted as a file, it loads from the site itself.
export default defineConfig({root:import.meta.dirname,base:'./',publicDir:false,server:{host:'127.0.0.1',port:5246,strictPort:true},build:{outDir:resolve(import.meta.dirname,'../filtration-dist'),emptyOutDir:true,assetsInlineLimit:0}});
