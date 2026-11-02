const assert=require('node:assert/strict'),D=require('./assets/data.js'),E=require('./assets/engine.js'),B=require('./assets/demo.js');
const total={};let gems=0,clears=0,crawls=0,crawled=0;
// the stage results score against D.REACH: it must match the level builders
const reach=[];for(let w=0;w<5;w++)for(let stage=0;stage<D.STAGES_PER_WORLD[w];stage++)reach.push(B.reachable(E.createGame(D.buildLevel(w,stage),{},{difficulty:'normal'})));
assert.deepEqual(D.REACH,reach,'Update D.REACH in data.js to '+JSON.stringify(reach));
// game speed is live: the engine reads D.DT every tick
{const t=(v)=>{D.setSpeed(v);const s=E.createGame(D.buildLevel(0,0),{},{});const t0=s.time;for(let i=0;i<60;i++)E.step(s,{},D.VIEW_W,D.VIEW_H);return t0-s.time;};
 assert.ok(Math.abs(t(1)-1)<1e-6&&Math.abs(t(0.7)-0.7)<1e-6,'Game speed must scale the clock');D.setSpeed(D.DEFAULT_SPEED);}
for(let w=0;w<5;w++)for(let stage=0;stage<D.STAGES_PER_WORLD[w];stage++){
 Math.random=D.mulberry32(900+w*10+stage);
 const s=E.createGame(D.buildLevel(w,stage),{lives:3,score:0,gems:0,weapons:{spread:2,beam:2,bounce:2},weapon:'spread',bombs:3,lines:3},{difficulty:'normal'}),bot=B.createPilot();bot.reset();
 for(let n=0;n<60*420&&!s.won&&!s.gameOver;n++){
   const before=n%600===0?JSON.stringify(s):null;
   const i=bot.frame(s);
   if(before)assert.equal(JSON.stringify(s),before,'Pilot must not change engine state');
   for(const k of ['linePressed','bombPressed','morphPressed'])if(i[k])total[k]=(total[k]||0)+1;
   if(i.fire)total[s.player.morph?'mines':s.player.weapon]=(total[s.player.morph?'mines':s.player.weapon]||0)+1;
   E.step(s,i,D.VIEW_W,D.VIEW_H);s.events.length=0;
   assert.ok(Number.isFinite(s.player.x+s.player.y));
 }
 assert.ok(s.won,`World ${w+1}, stage ${stage+1} must finish`);
 const cs=(s.level.crawls||[]).length,cf=Object.keys(s.stats.found).filter(k=>k[0]==='c').length;crawls+=cs;crawled+=cf;
 assert.equal(cf,cs,`The pilot rolls through every crawlspace in ${w+1}.${stage+1}`);
 assert.ok(s.player.gems>0,'Collect crystals in every stage');
 assert.equal(bot.rescues,0);gems+=s.player.gems;clears++;
 console.log(`World ${w+1}.${stage+1}: cleared, ${s.player.gems} crystals, ${bot.deaths} deaths`);
}
for(const k of ['spread','beam','bounce','mines','linePressed','bombPressed','morphPressed'])assert.ok(total[k]>0,`Must use ${k}`);
assert.ok(crawls>=12,'Platform stages carry crawlspaces');
console.log(JSON.stringify({clears,gems,crawls:crawled+'/'+crawls,actions:total}));
