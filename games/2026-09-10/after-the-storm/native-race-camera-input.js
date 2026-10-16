// Original1DE3CC numeric camera-input consumer. Camera and auxiliary records
// share the retained HUD owner; controller ports and body slots are distinct.
// Drawing, camera transforms and the following5DF4 status call are external.
const F=Math.fround,MIN=-2147483648,MAX=2147483647,BASE=0x7788;
const bits=new DataView(new ArrayBuffer(4));
function integer(v,name,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function record(v,name){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${name}`);return v;}
function words(v,name,n){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`${name} requires${n} unsigned words`);return Array.from(v,w=>integer(w,name,0,0xffffffff));}
function number(w){bits.setUint32(0,w);return bits.getFloat32(0);}
function finite(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${name} must fit finite float32`);return F(v);}
function floatWord(v){bits.setFloat32(0,finite(v,'camera arithmetic'));return bits.getUint32(0);}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Camera records7C80+i*10C and auxiliary records7E98+i*E0 remain in
 * hudWords7788. Modes/flags are raw signed words, not browser preferences.
 * controllerPortsByView selects the pressed halfword at4308+port*10+2;
 * bodyStatesBySlot is indexed by VIEW ORDINAL, not that controller mapping.
 * Only actor7 reads animationFrameC58. The16 mode words cover3940..3980;
 * the4 blend words cover6018..6028: wrap, change, unchanged and actor23/24.
 * These are explicit retained readonly source views.
 * Negative/zero player counts have no effect; more than2 is outside this
 * bounded camera view. All writes/sounds prepare atomically without callbacks.
 */
export function prepareNativeRaceCameraInput(value){
 record(value,'camera input');const players=integer(value.players,'players'),operations=[],views=[];
 if(players<=0)return freeze({operations,diagnostic:{views}});
 if(players>2)throw new RangeError('Camera input supports at most two source views');
 const hud=words(value.hudWords7788,'hudWords7788',1442),presets=words(value.cameraModeWords3940,'cameraModeWords3940',16),
  rates=words(value.cameraBlendWords6018,'cameraBlendWords6018',4);
 const scalar=(a)=>finite(number(hud[(a-BASE)/4]),'camera retained float'),rate=i=>finite(number(rates[i]),'camera blend rate'),
  preset=i=>finite(number(presets[i]),'camera mode value');
 function write(address,value){const word=value>>>0;hud[(address-BASE)/4]=word;operations.push({kind:'hudWrite',byteOffset:address-BASE,width:4,value:word});}
 const audio=(sound,view)=>operations.push({kind:'audioEntry',consumer:'800c37f4',arguments:[sound,view]});
 const wrapRate=rate(0);
 for(let view=0;view<players;view++){
  const port=integer(value.controllerPortsByView?.[view],`controller port for view${view}`,0,3),
   pressed=integer(value.pressedButtonsByController?.[port],`pressed buttons for controller${port}`,0,65535),
   camera=0x7c80+view*0x10c,aux=0x7e98+view*0xe0,oldMode=hud[(camera+0xec-BASE)/4]|0;
  let mode=oldMode,changeRate=rate(1),flag=hud[(camera+0xf8-BASE)/4];
  if(pressed&3){flag=(flag^1)>>>0;write(camera+0xf8,flag);audio(flag!==0?0x11:0x16,view);}
  write(aux+0xdc,flag);
  if(pressed&8)mode=(mode+1)|0;
  if(pressed&4)mode=(mode-1)|0;
  if(mode<0){mode=3;changeRate=wrapRate;}else if(mode>=4){mode=0;changeRate=wrapRate;}
  if(oldMode<mode)audio(0x1d,view);else if(mode<oldMode)audio(0x1e,view);
  for(const offset of [0xc4,0xac,0x40])write(aux+offset,floatWord(changeRate));
  write(aux+0x3c,floatWord(preset(mode)));write(aux+0xa8,floatWord(preset(4+mode)));write(aux+0xc0,floatWord(preset(8+mode)));
  let blend=mode===oldMode?rate(2):changeRate,target;
  const body=record(value.bodyStatesBySlot?.[view],`body slot${view}`),actor=integer(body.actorStateC54,`actor for slot${view}`);
  if(actor===23||actor===24){blend=rate(3);target=mode<2?0:10;}
  else if(actor===25)target=mode<2?0:10;
  else if(actor===7&&integer(body.animationFrameC58,`animation frame for slot${view}`)<56)target=0;
  else target=preset(12+mode);
  const before=scalar(camera+0xfc),delta=finite(F(target-before),'camera delta'),
   movement=finite(F(delta*blend),'camera blend'),next=finite(F(before+movement),'camera result');
  write(camera+0xec,mode);write(camera+0xfc,floatWord(next));
  views.push({view,controllerPort:port,oldMode,mode,flag,actorStateC54:actor,changeRate,blend,target,before,after:next});
 }
 return freeze({operations,diagnostic:{views}});
}
