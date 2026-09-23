// Run against the reef Vite preview (default port5240).
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';import fs from 'node:fs';import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,channel:'chrome'});
try{
 const p=await b.newPage({viewport:{width:640,height:640}});await p.goto(process.env.REEF_PREVIEW_URL||'http://127.0.0.1:5240/');await p.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});await p.getByRole('button',{name:'Pause',exact:true}).click();
 const results=await p.evaluate(async(threeUrl)=>{
  const T=await import(threeUrl);
  const {reefBackGlass}=await import('/ReefBackGlass.ts'),{ReefReflections}=await import('/ReefReflections.ts');
  const scene=new T.Scene();scene.background=new T.Color(0);const pool=new ReefReflections(),pane=reefBackGlass(pool,{value:0},{value:1});scene.add(pane);
  const subject=new T.Mesh(new T.SphereGeometry(.22,24,16),new T.MeshBasicMaterial({color:0x00ff00}));scene.add(subject);
  const camera=new T.PerspectiveCamera(40,1,.1,50),renderer=new T.WebGLRenderer({antialias:false});renderer.setSize(512,512);renderer.toneMapping=T.NoToneMapping;
  const rt=new T.WebGLRenderTarget(512,512),pixels=new Uint8Array(512*512*4),results=[];
  for(const oblique of [false,true]){
   camera.position.set(oblique?4:0,2.8,7);camera.lookAt(0,2.8,-2.325);camera.updateMatrixWorld();
   for(const z of [-1.9,0,1.8]){
    subject.position.set(0,2.8,z);subject.visible=true;pane.forceUpdate=true;scene.updateMatrixWorld(true);
    renderer.setRenderTarget(null);pool.prepare(renderer,scene,camera);
    subject.visible=false;renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.readRenderTargetPixels(rt,0,0,512,512,pixels);
    let green=0;for(let i=0;i<pixels.length;i+=4)green=Math.max(green,pixels[i+1]-pixels[i+2]);
    results.push({oblique,z,green});
   }
  }
  const glError=renderer.getContext().getError();rt.dispose();renderer.dispose();return {results,glError};
 },'/@fs/'+fileURLToPath(import.meta.resolve('three')).replaceAll('\\','/'));
 assert.equal(results.glError,0);
 for(const oblique of [false,true]){const a=results.results.filter(x=>x.oblique===oblique);assert.ok(a[0].green>a[1].green&&a[1].green>a[2].green,'reflection fades continuously with rear-plane distance');assert.ok(a[0].green>a[2].green*2,'front fish reflection substantially fainter');}
 fs.writeFileSync('reef/qa/rear-depth-rendered.json',JSON.stringify(results,null,2));console.log(results);
}finally{await b.close();}
