import * as T from 'three';

// Purpose-drawn, chamfered industrial lettering, including real counter holes.
const alphabet={
 C:{outer:[[.91,1],[.15,1],[0,.84],[0,.16],[.15,0],[.91,0],[.91,.16],[.23,.16],[.16,.23],[.16,.77],[.23,.84],[.91,.84]]},
 Y:{outer:[[0,1],[.2,1],[.46,.61],[.72,1],[.93,1],[.55,.44],[.55,0],[.37,0],[.37,.44]]},
 B:{outer:[[0,0],[.71,0],[.88,.16],[.88,.41],[.79,.51],[.88,.61],[.88,.84],[.72,1],[0,1]],holes:[[[.17,.16],[.65,.16],[.71,.22],[.71,.37],[.64,.43],[.17,.43]],[[.17,.59],[.65,.59],[.71,.65],[.71,.78],[.65,.84],[.17,.84]]]},
 E:{outer:[[0,0],[.89,0],[.89,.16],[.17,.16],[.17,.43],[.76,.43],[.76,.59],[.17,.59],[.17,.84],[.89,.84],[.89,1],[0,1]]},
 R:{outer:[[0,0],[.17,0],[.17,.4],[.47,.4],[.73,0],[.94,0],[.65,.42],[.88,.62],[.88,.84],[.72,1],[0,1]],holes:[[[.17,.57],[.64,.57],[.71,.64],[.71,.78],[.65,.84],[.17,.84]]]},
 D:{outer:[[0,0],[.67,0],[.91,.22],[.91,.78],[.68,1],[0,1]],holes:[[[.17,.16],[.61,.16],[.74,.29],[.74,.71],[.61,.84],[.17,.84]]]},
 N:{outer:[[0,0],[.17,0],[.17,.73],[.71,0],[.9,0],[.9,1],[.73,1],[.73,.27],[.2,1],[0,1]]},
 S:{outer:[[.9,1],[.16,1],[0,.84],[0,.61],[.15,.45],[.66,.45],[.74,.37],[.74,.23],[.67,.16],[0,.16],[0,0],[.74,0],[.91,.17],[.91,.44],[.75,.6],[.24,.6],[.17,.67],[.17,.78],[.23,.84],[.9,.84]]},
 T:{outer:[[0,1],[.95,1],[.95,.83],[.56,.83],[.56,0],[.39,0],[.39,.83],[0,.83]]},
 M:{outer:[[0,0],[.17,0],[.17,.75],[.48,.32],[.79,.75],[.79,0],[.96,0],[.96,1],[.77,1],[.48,.58],[.19,1],[0,1]]}
};
export function techText(text,material){
 const group=new T.Group();group.name='Custom angular subtitle';let cursor=0;
 for(const char of text){if(char===' '){cursor+=.32;continue}const def=alphabet[char];if(!def)throw new Error(`Missing technical glyph ${char}`);
   const points=def.outer.map(([x,y])=>new T.Vector2(x*.5+y*.014,y*.38));const shape=new T.Shape(points);
   for(const hole of def.holes||[])shape.holes.push(new T.Path(hole.map(([x,y])=>new T.Vector2(x*.5+y*.014,y*.38))));
   const geo=new T.ExtrudeGeometry(shape,{depth:.085,bevelEnabled:true,bevelSize:.007,bevelThickness:.009,bevelSegments:3,steps:1});
   const letter=new T.Mesh(geo,material);letter.name=`Subtitle ${char}`;letter.position.set(cursor,0,.16);letter.castShadow=letter.receiveShadow=true;group.add(letter);cursor+=Math.max(...points.map(p=>p.x))+.135;
 }
 group.scale.x=10.85/(cursor-.135);group.position.x=-5.425;return group;
}

// Power up only emissive elements. Armor and letter faces remain readable throughout.
export function createPowerUp({chassis,dais,crest,neural,word,subtitle,primaryCore,upperCore,coreLight}){
 const banks=[],stageMaps=new Map();let state={core:1,rings:1,neural:1,word:1};
 const groups=[[primaryCore,'core'],[upperCore,'core'],[chassis,'rings'],[dais,'rings'],[crest,'neural'],[neural,'neural'],[word,'word'],[subtitle,'word']];
 for(const [group,stage] of groups){
   if(!stageMaps.has(stage))stageMaps.set(stage,new Map());const map=stageMaps.get(stage);
   group.traverse(obj=>{const mat=obj.material;if(!mat?.userData?.glow)return;
     if(mat.isShaderMaterial){
       if(mat.uniforms.startupPower)return;
       mat.uniforms.startupPower={value:1};mat.fragmentShader='uniform float startupPower;\n'+mat.fragmentShader.replace(/}\s*$/,'gl_FragColor.rgb*=startupPower;}');mat.needsUpdate=true;banks.push({mat,stage});
     }else{
       if(!map.has(mat)){const clone=mat.clone();map.set(mat,clone);banks.push({mat:clone,base:clone.color.clone(),stage})}obj.material=map.get(mat);
     }
   });
 }
 const label=document.getElementById('power-status');
 return{
   update(reveal){const t=reveal.revealActive?reveal.revealProgress*7.5:7.5;
     state={core:T.MathUtils.smoothstep(t,.12,1.2),rings:T.MathUtils.smoothstep(t,1.1,2.9),neural:T.MathUtils.smoothstep(t,2.35,4.1),word:T.MathUtils.smoothstep(t,3.6,5.5)};
     for(const bank of banks){const power=.035+.965*state[bank.stage];if(bank.base)bank.mat.color.copy(bank.base).multiplyScalar(power);else bank.mat.uniforms.startupPower.value=power}
     coreLight.intensity*=.05+.95*state.core;
     const text=t<1.2?'CORE IGNITION':t<2.9?'RING BUS ENERGIZING':t<4.1?'NEURAL LINK SYNCHRONIZING':t<5.5?'SYSTEMS ACTIVATING':'NEURAL CORE ONLINE';if(label.textContent!==text)label.textContent=text;
   },
   stats(){return{powerStages:{...state},customSubtitle:true}}
 };
}
