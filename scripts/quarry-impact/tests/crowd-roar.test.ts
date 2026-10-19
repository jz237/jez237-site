import test from 'node:test';
import assert from 'node:assert/strict';
import {CrowdRoar,ROAR_COOLDOWN} from '../src/crowd-roar';
function fakeContext(){
 const log:string[]=[];const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},setTargetAtTime(){}});
 const node=(kind:string)=>({kind,connect(){},start(){log.push(kind+':start');},stop(){},gain:param(),frequency:param(),Q:param(),playbackRate:param(),type:'',buffer:null as unknown,loop:false});
 const ctx={currentTime:10,sampleRate:8000,createBuffer:(_c:number,n:number)=>({getChannelData:()=>new Float32Array(n)}),createBufferSource:()=>node('noise'),createBiquadFilter:()=>node('band'),createGain:()=>node('gain'),createOscillator:()=>node('whistle')};
 return{ctx,log};
}
test('the crowd roars in three bands, whistles only for big moments and respects its cooldown',()=>{
 const {ctx,log}=fakeContext(),roar=new CrowdRoar(ctx as any,{} as AudioNode);
 assert.equal(roar.roar(.5),true);assert.equal(log.filter(l=>l==='noise:start').length,3);assert.ok(!log.includes('whistle:start'));
 assert.equal(roar.roar(1),false,'cooldown');ctx.currentTime+=ROAR_COOLDOWN+.01;
 assert.equal(roar.roar(1),true);assert.ok(log.includes('whistle:start'));
 ctx.currentTime+=5;assert.equal(roar.roar(.01),false,'too quiet to bother');
});
