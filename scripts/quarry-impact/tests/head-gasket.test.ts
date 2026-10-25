import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HEAD_GASKET,gasketClock,gasketWarning} from '../src/damage-handling';
test('run hard with nothing cooling it, the head gasket clock runs to the blow; cooled again, it runs back down',()=>{
  let t=0;for(let i=0;i<Math.round(HEAD_GASKET.after*60);i++)t=gasketClock(t,true,1/60);assert.ok(t>=HEAD_GASKET.after-1e-6,'blows after its seconds');
  assert.ok(Math.abs(gasketClock(4,false,2)-(4-2*HEAD_GASKET.cool))<1e-12,'cools at its rate');assert.equal(gasketClock(.1,false,10),0);
  assert.equal(gasketClock(3,true,0),3);assert.equal(gasketClock(NaN,true,1),1);
  assert.equal(gasketWarning(true),'HEAD GASKET BLOWN');assert.equal(gasketWarning(false),'');
  assert.ok(HEAD_GASKET.power>0&&HEAD_GASKET.power<1&&HEAD_GASKET.burn>0&&HEAD_GASKET.smoke>0&&HEAD_GASKET.throttle>0);
});
test('a blown gasket costs power, burns the coolant and pours white smoke from the exhaust; a breakage moment with its toast',()=>{
  const v=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
  assert.ok(v.includes("this.gasketClock=gasketClock(this.gasketClock,running&&!cooling&&Math.abs(this.input.throttle)>=HEAD_GASKET.throttle,dt);"),'nothing cooling it, worked hard');
  assert.ok(v.includes("if(!this.gasketBlown&&this.health>0&&this.gasketClock>=HEAD_GASKET.after){this.gasketBlown=true;this.onBreak?.('gasket',0);}"),'blows once');
  assert.ok(v.includes("if(this.gasketBlown&&running)this.coolantLevel=Math.max(0,this.coolantLevel-HEAD_GASKET.burn*dt);")&&v.includes("if(this.gasketBlown&&running)this.misfireFactor*=HEAD_GASKET.power;"),'burns coolant, loses power');
  assert.ok(v.includes("this.gasketSmokeClock+=dt*HEAD_GASKET.smoke*(1/3+2/3*throttle);")&&v.includes("this.fx.emit(p,2,5,.45);}"),'white smoke from the tailpipe');
  assert.ok(v.includes('this.gasketClock=this.gasketSmoke=this.gasketSmokeClock=0;this.gasketBlown=false;'),'a fresh car has a sound gasket');
  assert.ok(main.includes("gasket:{label:'HEAD GASKET BLOWN',score:22}")&&main.includes("what==='gasket'?'HEAD GASKET BLOWN · WHITE SMOKE':")&&main.includes("player.extendedDamage?gasketWarning(player.gasketBlown):''"),'moment, toast, HUD warning');
  assert.ok(audio.includes("gasket:{id:'steam-hiss',volume:.7,rate:.85,duration:1.4}"),'a burst of steam');
});
