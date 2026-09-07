const assert=require('node:assert/strict'),D=require('./assets/data.js'),E=require('./assets/engine.js'),B=require('./assets/demo.js');
const total={};let gems=0,clears=0;
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
 assert.ok(s.player.gems>0,'Collect crystals in every stage');
 assert.equal(bot.rescues,0);gems+=s.player.gems;clears++;
 console.log(`World ${w+1}.${stage+1}: cleared, ${s.player.gems} crystals, ${bot.deaths} deaths`);
}
for(const k of ['spread','beam','bounce','mines','linePressed','bombPressed','morphPressed'])assert.ok(total[k]>0,`Must use ${k}`);
console.log(JSON.stringify({clears,gems,actions:total}));
