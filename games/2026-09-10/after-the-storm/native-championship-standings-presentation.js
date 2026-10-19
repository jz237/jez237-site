// Independent semantic layout of original i5 5DC0. Coordinates are layout
// units for a high-resolution consumer, never an emulated low-resolution raster.
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function word(a,n,i,key){if(!Array.isArray(a)||a.length!==n)throw new RangeError(`Expected ${key}[${n}]`);return integer(a[i],`${key}[${i}]`,0,0xffffffff);}

/** Uses the retained canonical round/total order and profile. Only reached
 * name/font/qualification data is required. This prepares a detached draw
 * snapshot; no scoring, input, scene state, original GPU or saves run here.
 */
export function prepareNativeChampionshipStandingsPresentation(state,sourceViews={}){
 const commands=[],menu=i=>word(state.championshipMenuWords7a00,68,i,'championshipMenuWords7a00');
 const profile=i=>{const p=state.profileWordsB330;if(!Array.isArray(p)||![50,52].includes(p.length))throw new RangeError('Expected retained profile');return integer(p[i],'profile word',0,0xffffffff)|0;};
 const race=a=>word(state.raceWords1f94,1693,(a-0x1f94)/4,'raceWords1f94');
 const phase=integer(state.scene?.field640,'standings phase'),total=phase>=4&&phase<=8;
 const xA=menu(0)>>16,xB=menu(65)>>16,outcome=menu(64)|0;
 const round=integer(profile(1),'championship round',0,7),primary=integer(state.scene?.primaryHumanIndex,'primary slot',0,3);
 const rowX=row=>row%2?xB:xA,add=(...v)=>v.reduce((a,b)=>(a+b)|0,0);
 const panel=(x,y,width,height)=>commands.push({kind:'panel',mode:total?2:0,x,y,width,height,alpha:255});
 const style=mode=>commands.push({kind:'style',mode,intensity:255});
 const label=(font,token,x,y)=>commands.push({kind:'label',font,token,x,y,variant:0});
 const text=(font,content,x,y,mode=0)=>commands.push({kind:'text',font,text:content,x,y,mode});
 const orderKey=total?'racerOrderA9dc':'roundOrderE718';
 const slotAt=row=>integer(word(state[orderKey],4,row,orderKey),'ranked slot',0,3);
 const avatarAt=slot=>integer(word(sourceViews.avatarsA9b0,4,slot,'avatarsA9b0'),'ranked avatar',0,3);
 panel(add(xA,total?21:44),25,total?244:191,24);panel(add(xB,8),52,265,16);panel(add(xA,8),199,265,16);
 for(let row=0;row<4;row++)panel(add(rowX(row),8),71+32*row,265,28);
 style(0);label(2,total?21:20,add(xA,total?41:53),28);label(1,total?6:79,add(xA,24),202);
 label(1,31,add(xB,13),55);label(1,32,add(xB,109),55);label(1,58,add(xB,215),55);
 commands.push({kind:'fillColor',rgba:[0,0,0,255]});
 for(let row=0;row<4;row++)commands.push({kind:'fill',x1:add(rowX(row),42),y1:74+32*row,x2:add(rowX(row),86),y2:95+32*row});
 commands.push({kind:'clip',x1:8,y1:20,x2:310,y2:218});
 let rank=1,previousPoints,rankOffset=0;
 for(let row=0;row<4;row++){
  const slot=slotAt(row),avatar=avatarAt(slot),x=rowX(row),y=75+32*row,subY=88+32*row;
  const points=profile(total?4+slot:8+round*4+slot),isPrimary=slot===primary;
  if(row>0&&points!==previousPoints)rank=row+1;previousPoints=points;
  const dq=!total&&race(0x2c24+slot*888)!==0;
  // The original retains this offset after the first retired row.
  if(dq)rankOffset=6;
  const names=sourceViews.riderNamesB298;
  if(!Array.isArray(names)||names.length!==4||typeof names[avatar]!=='string')throw new RangeError('Expected reached riderNamesB298[4]');
  const rankMode=isPrimary?6:0,pointsMode=total?(phase>=6&&isPrimary?(outcome===0?4:6):0):rankMode;
  const tens=Math.trunc(points/10)%10;
  const width=tens===0?0:integer(sourceViews.digitWidths6d70?.[integer(tens,'points tens glyph',1,9)],'points tens glyph width',0,255);
  text(0,dq?'R':String(total?rank:row+1),add(x,rankOffset,13),y,rankMode);
  text(2,names[avatar],add(x,92),y);text(0,String(points),add(x,236,-width),y,pointsMode);
  if(!total){
   if(dq){style(rankMode);label(0,27,add(x,92),subY);}
   else commands.push({kind:'time',font:1,value:race(0x2ad4+slot*888),x:add(x,92),y:subY,mode:isPrimary?(race(0x2650)===1?4:6):0});
  }else{
   style(pointsMode);label(0,24,add(x,92),subY);
   const start=profile(2)===0?1:0;
   for(let r=start;r<=round;r++)text(1,String(profile(8+r*4+slot))+(r<round?'-':''),add(x,132,12*(r-start)),subY,pointsMode);
  }
 }
 if(!total){
  style(outcome===0?4:0);const place=integer(state.scene?.field704,'required place',0,4);
  label(1,menu(6+place),add(xA,160),202);
 }else{
  style(phase<6?0:outcome===0?4:6);
  const difficulty=integer(profile(2),'difficulty',0,2),table=sourceViews.requiredPointsAbbc;
  if(!Array.isArray(table)||table.length!==3||!Array.isArray(table[difficulty])||table[difficulty].length!==8)throw new RangeError('Expected reached requiredPointsAbbc[3][8]');
  commands.push({kind:'number',font:2,value:integer(table[difficulty][round],'required points',-32768,32767),x:add(xA,242),y:201});
 }
 for(let row=0;row<4;row++)commands.push({kind:'riderPreview',avatarIndex:avatarAt(slotAt(row)),viewportIndex:row});
 return freeze({commands,panel:total?'total':'round',diagnostic:{consumer:'802c5dc0',graphicsExecuted:false,sourceLogicalSize:[320,240]}});
}
