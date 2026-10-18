import {createSourceSouthernCourse} from './source-southern-course.js?v=44ffcceb5a94';
import {createGlacierCourse} from './glacier-course.js?v=44ffcceb5a94';
import {cityStuntLayout} from './city-stunts.js?v=44ffcceb5a94';
import {portStuntLayout} from './port-stunts.js?v=44ffcceb5a94';
import {fortStuntLayout} from './fort-stunts.js?v=44ffcceb5a94';
import {drakeStuntLayout} from './drake-stunts.js?v=44ffcceb5a94';
import {createSourceSunsetCourse} from './source-sunset-course.js?v=44ffcceb5a94';
import {sunsetAnchors,sunsetPilotAnchors,sunsetNativeDrivingAnchors,sunsetNavigation,sunsetStuntNavigation} from './source-sunset-navigation.js?v=44ffcceb5a94';
import {createSourceSunnyCourse} from './source-sunny-course.js?v=44ffcceb5a94';
import {sunnyAnchors,sunnyPilotAnchors,sunnyStuntNavigation,sunnyNavigation} from './source-sunny-navigation.js?v=44ffcceb5a94';
import {createDolphinCourse} from './dolphin-course.js?v=44ffcceb5a94';
// Authored reconstruction from course observations, in metres. Map coordinates
// describe geography, not a texture or mesh extracted from the Nintendo game.
// Source/remaining fidelity checks: COURSE-MATCH.md.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function fromMap(points,cx,cy,scale=.75){return points.map(([x,z])=>[(x-cx)*scale,(z-cy)*scale]);}
export function polygonDistance(points,x,z){let inside=false,d=Infinity;for(let i=0,j=points.length-1;i<points.length;j=i++){
 const a=points[j],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);
 d=Math.min(d,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t));if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }return inside?-d:d;
}
const sunny=createSourceSunnyCourse(polygonDistance,{anchorsByClass:sunnyAnchors,pilotAnchorsByClass:sunnyPilotAnchors,stuntNavigation:sunnyStuntNavigation,navigation:sunnyNavigation});
// Validation covers the authored helm paths at seed17/60Hz. The high-resolution
// scene shares the finite source geometry; native water/rigid-body equivalence
// and the native course-out envelope remain separate, unresolved work.
sunny.integrationReady=true;
sunny.navigation.controlBySeaState={surf:{straightSpeed:40,gateSpeed:26}};
Object.assign(sunny.navigation,{validated:true,status:'ordinary-input-paths-checked',reason:sunnyNavigation.validation.status});
Object.assign(sunny.stuntLayout.navigation,{validated:true,status:'ordinary-input-stunt-path-checked',validation:{...sunnyStuntNavigation.validation}});
Object.assign(sunny.boundaryMetadata,{status:'authored-browser-envelope-checked',provisional:true});
const sunset=createSourceSunsetCourse(polygonDistance,{anchorsByClass:sunsetAnchors,pilotAnchorsByClass:sunsetPilotAnchors,navigation:sunsetNavigation,stuntNavigation:sunsetStuntNavigation});
// The ordinary menu retains the modern craft; the opt-in native preview also
// selects Sunset's recovered physical contacts, regions and roller owners.
sunset.nativePilotAnchorsByClass=sunsetNativeDrivingAnchors;
sunset.integrationReady=true;
sunset.description='An L-shaped island, two piers and a fixed jump surround rolling evening water. Harder classes add metal buoys; Reverse keeps the jump facing its original direction.';
Object.assign(sunset.navigation,{validated:true,status:'default-rider-ordinary-input-checked',reason:'All four classes complete three source-judged laps at seed17/60Hz with the modern craft.'});
Object.assign(sunset.stuntLayout.navigation,{validated:true,status:'default-rider-stunt-input-checked',validation:{...sunsetStuntNavigation.validation}});
Object.assign(sunset.sourceWaterMetadata,{rollerLatticeIntegrated:true});
sunset.pendingSourceMechanics=['native-handling-and-race-host-admission','source-ai','native-course-out-host-integration','broader-rider-and-wave-navigation'];
const lakeLand=fromMap([[67,108],[104,98],[174,116],[229,109],[320,76],[334,107],[329,194],[345,246],[326,295],[294,329],[273,348],[228,351],[173,343],[126,368],[77,350],[70,293],[63,254],[72,215],[62,174]],200,240);
const lakeIsland=fromMap([[127,72],[166,63],[207,66],[252,85],[224,96],[193,99],[153,88]],200,240);
const lakeOuter=fromMap([[40,73],[87,38],[170,38],[247,34],[326,18],[377,37],[399,100],[395,215],[399,295],[372,343],[342,398],[274,419],[218,450],[153,458],[92,418],[38,354],[9,272],[16,204],[6,151]],200,240);
const lakeMap=points=>fromMap(points,200,240);
const lakeBuoys=rows=>rows.map(([x,z,side])=>({x:(x-200)*.75,z:(z-240)*.75,side}));
const lakeNormalBuoys=lakeBuoys([[371,146,-1],[357,88,1],[279,58,-1],[116,65,-1],[36,118,-1],[45,168,1],[36,228,-1],[46,282,1],[51,343,-1],[120,393,1],[212,390,1],[333,365,-1]]);
const lakeHardBuoys=lakeBuoys([[371,146,-1],[357,88,1],[279,58,-1],[116,65,-1],[35,140,-1],[45,170,1],[35,206,-1],[46,244,1],[37,284,-1],[120,393,1],[212,390,1],[250,393,-1],[325,368,1]]);
const lakeExpertBuoys=lakeBuoys([[371,146,-1],[357,88,1],[279,58,-1],[116,65,-1],[35,140,-1],[45,170,1],[35,206,-1],[46,244,1],[37,284,-1],[103,407,-1],[152,388,1],[190,398,-1],[229,367,1],[258,393,-1],[299,368,1],[360,358,-1]]);
const lakeReverseBuoys=lakeBuoys([[70,129,-1],[103,101,1],[161,105,-1],[182,67,1],[221,99,-1],[270,84,1],[316,102,-1],[367,195,-1],[378,239,1],[373,269,-1],[380,314,1],[374,341,-1],[297,405,-1],[134,405,-1],[53,387,1],[63,335,-1]].map(([x,z,side])=>[420-x,478-z,side]));
lakeNormalBuoys[11].approach={x:(293-200)*.75,z:(395-240)*.75,throttle:.4,radius:3};
lakeHardBuoys[11].approach={x:(228-200)*.75,z:(382-240)*.75,throttle:.4,radius:3};
lakeReverseBuoys[3].approach={x:(254-200)*.75,z:(398-240)*.75,throttle:.4,radius:3};
lakeReverseBuoys[2].approach={x:(277-200)*.75,z:(383-240)*.75,throttle:.4,radius:3};
const lakePosts=[[253.5,358.5],[264.5,369.5],[239.5,374.5],[283.5,375.5],[182.5,380.5],[224.5,380.5],[252.5,381.5],[290.5,385.5],[268.5,387.5],[200.5,388.5],[238.5,389.5],[222.5,399.5],[249.5,402.5]];
const lakePostObstacles=(dx=0,dz=0)=>lakeMap(lakePosts.map(([x,z])=>[x+dx,z+dz])).map(([x,z])=>({x,z,r:.45,type:'post'}));
const lakeWeedMarkers=[[200.5,49.5,7,6],[132.5,87,6,4.5],[192,107.5,5.5,4]];
const lakeExpertWeeds=[...lakeWeedMarkers,[20.5,175,8,6.5],[54.5,218.5,5,5],[24.5,249.5,7,6]];
const lakeWeeds=(rows,dx=0,dz=0)=>rows.map(([x,z,rx,rz])=>({x:(x+dx-200)*.75,z:(z+dz-240)*.75,rx:rx*.75,rz:rz*.75,drag:.65}));
const lakeNorth=[[374,274],[366,188],[366,91],[341,60],[306,63],[246,54],[178,54],[122,61],[84,67],[59,86],[31,160],[40,212],[31,269],[52,325],[74,372],[123,404]];
const lake={
 name:'Drake Lake',theme:'lake',tag:'03 / DRAKE LAKE',layoutRevision:4,boundary:lakeOuter,stuntLayout:{...drakeStuntLayout(),rocks:lakePostObstacles(),resistance:lakeWeeds(lakeWeedMarkers)},
 finishLinesByClass:[lakeMap([[357,267],[408,267]]),lakeMap([[357,267],[408,267]]),lakeMap([[357,267],[408,267]]),lakeMap([[361,269],[412,269]])],
 buoysByClass:[lakeNormalBuoys,lakeHardBuoys,lakeExpertBuoys,lakeReverseBuoys],
 anchorsByClass:{1:lakeMap([...lakeNorth,[180,409],[225,396],[258,361],[289,367],[326,381],[353,362],[369,317]]),2:lakeMap([...lakeNorth.slice(0,-1),[109,397],[142,380],[166,386],[201,389],[231,381],[268,377],[306,378],[343,365],[370,333]])},
 description:'A misty freshwater circuit with irregular wooded banks, a small island, timber posts and weed beds that slow a wet hull.',
 anchors:fromMap([[374,274],[366,188],[366,91],[341,60],[306,63],[246,54],[178,54],[122,61],[84,67],[59,86],[31,160],[40,212],[31,269],[52,325],[74,372],[123,404],[186,416],[243,407],[307,376],[356,336]],200,240),
 ground(x,z){return clamp(Math.max(-polygonDistance(lakeLand,x,z),-polygonDistance(lakeIsland,x,z),polygonDistance(lakeOuter,x,z))*.4,-8,13);},
 obstacles:lakePostObstacles(),obstaclesByClass:[lakePostObstacles(),lakePostObstacles(),lakePostObstacles(),lakePostObstacles(4,3)],
 resistance:lakeWeeds(lakeWeedMarkers),resistanceByClass:[lakeWeeds(lakeWeedMarkers),lakeWeeds(lakeWeedMarkers),lakeWeeds(lakeExpertWeeds),lakeWeeds(lakeExpertWeeds,4,3)],raceRamps:[]
};
const fortMap=points=>fromMap(points,210,300,.8);
const fortLand=fortMap([[110,135],[111,84],[117,74],[123,83],[127,121],[139,153],[159,176],[203,189],[293,200],[360,215],[370,225],[319,228],[267,228],[267,264],[259,292],[268,430],[249,467],[216,491],[132,507],[104,500],[108,360],[125,351],[136,290],[151,274],[159,277],[180,277],[194,261],[207,263],[207,244],[181,250],[153,264],[130,286],[119,330],[110,339],[106,325],[107,166],[107,143],[72,143],[61,156],[47,157],[41,153],[41,144],[48,140],[59,138],[60,133],[110,132]]);
const fortObstacles=rows=>rows.map(([x,z,type='crate'])=>({x:(x-210)*.8,z:(z-300)*.8,r:type==='timber'?.82:1,type}));
const fortNormalObjects=[[261,171],[295,195],[334,198]];
const fortHardObjects=[[263,173],[326,179,'timber'],[287,190],[270,190,'timber'],[310,192],[334,198],[323,205,'timber']];
const fortExpertObjects=[[263,173],[326,179,'timber'],[245,181,'timber'],[273,181,'timber'],[287,190],[337,192],[310,192],[352,205],[323,205,'timber'],[178,266],[126,329]];

const fortBuoys=rows=>rows.map(([x,z,side])=>({x:(x-210)*.8,z:(z-300)*.8,side}));
const fortNormalBuoys=fortBuoys([[69,203,1],[160,64,1],[170,94,1],[155,138,-1],[201,156,1],[350,174,1],[360,269,1],[306,267,1]]);
// The original Hard/Expert tables retain Normal's eastern return red marker.
const fortHardBuoys=fortBuoys([[69,203,1],[158,90,1],[155,138,-1],[192,157,1],[350,174,1],[360,269,1],[295,260,1]]);
const fortExpertBuoys=fortBuoys([[69,203,1],[158,90,1],[155,138,-1],[192,157,1],[350,168,1],[360,269,1],[295,260,1]]);
const fortReverseBuoys=fortBuoys([[176,320,1],[118,382,1],[274,394,1],[311,425,-1],[309,463,1],[399,362,1]].map(([x,z,side])=>[465-x,564-z,side]));
fortReverseBuoys[3].approach={x:(169-210)*.8,z:(160-300)*.8,throttle:.4,radius:3};
fortReverseBuoys[5].approach={x:(58-210)*.8,z:(183-300)*.8,throttle:.4,radius:3,range:30};
const fortArchSpans=[[[120,494],[120,560],25],[[159,493],[170,553],26],[[192,484],[213,533],25],[[224,476],[253,506],25]];
const fortArches=fortArchSpans.flatMap(([a,b,width],arch)=>{const [[ax,az],[bx,bz]]=fortMap([a,b]),length=Math.hypot(bx-ax,bz-az),tx=(bx-ax)/length,tz=(bz-az)/length,n=16;return Array.from({length:n},(_,i)=>{const f=(i+.5)/n,u=2*f-1;return {kind:'stone-arch',arch,x:ax+(bx-ax)*f,z:az+(bz-az)*f,tx,tz,length:length/n+.02,depth:width*.8,bottom:i===0||i===n-1?-10:7.5*Math.sqrt(1-u*u)-.7,top:11,material:'stone'};});});
for(const b of fortArches){const parts=fortArches.filter(p=>p.arch===b.arch),i=parts.indexOf(b);b.soffitBefore=parts[Math.max(0,i-1)].bottom;b.soffitAfter=parts[Math.min(parts.length-1,i+1)].bottom;}
const fort={
 name:'Marine Fortress',theme:'fortress',tag:'04 / MARINE FORTRESS',layoutRevision:7,stuntLayout:fortStuntLayout(),
 finishLine:fortMap([[9,272],[108,272]]),crossbars:fortArches,
 boundary:fortMap([[39,42],[173,42],[182,45],[188,62],[189,117],[192,126],[200,133],[218,142],[228,144],[302,149],[322,153],[341,161],[352,163],[389,181],[397,187],[402,196],[405,206],[405,252],[312,340],[312,429],[310,440],[291,468],[270,493],[231,523],[188,544],[150,554],[40,554],[20,549],[12,543],[8,534],[9,265],[13,213],[13,163],[18,70],[22,51],[29,43]]),
 // Only the southern outer route needs neutral checks; the north permits a ridge jump.
 buoysByClass:[fortNormalBuoys,fortHardBuoys,fortExpertBuoys,fortReverseBuoys],retainRouteControls:true,routeControlMinZ:(270-300)*.8,
 description:'Rough grey water around a stone fort. Floating crates crowd the eastern arm; Hard and above open a curved inner route after the first lap.',
 anchors:fortMap([[81,273],[81,192],[53,178],[37,156],[38,128],[54,89],[79,68],[104,60],[125,63],[148,94],[176,144],[201,160],[264,179],[337,185],[374,204],[384,227],[373,247],[307,251],[290,270],[283,345],[279,423],[260,466],[225,493],[168,510],[105,516],[81,499],[76,461],[80,360]]),
 // The northern opening ridge is low enough for a wave-assisted crossing.
 // Its footprint follows the map; the .75 m crest is a reconstruction estimate.
 ground(x,z){
  const h=clamp(-polygonDistance(fortLand,x,z)*.7,-11,6.5);
  const northernRidge=x<(108-210)*.8&&z>(130-300)*.8&&z<(169-300)*.8;
  return northernRidge?Math.min(h,.75):h;
 },
 obstacles:fortObstacles(fortNormalObjects),
 obstaclesByClass:[fortObstacles(fortNormalObjects),fortObstacles(fortHardObjects),fortObstacles(fortExpertObjects),fortObstacles(fortExpertObjects)],
 resistance:[],raceRamps:[],
 shortcut:{kind:'gate',from:fortMap([[307,251]])[0],to:fortMap([[81,310]])[0],width:7,clearance:5.5,
  via:fortMap([[258,246],[207,253],[173,268],[153,293],[134,327],[117,343],[99,338],[83,326]]),
  structure:fortMap([[179,263],[143,310]])},
 fortWalls:fortMap([[117,100],[140,172],[227,202],[337,218],[249,263],[249,420],[228,467],[143,490],[123,384]])
};
const portMap=points=>fromMap(points,220,285,.8);
const portShip=portMap([[119,103],[145,103],[163,132],[165,276],[160,409],[145,461],[124,492],[103,466],[89,426],[89,158],[104,117]]);
const portDock=portMap([[200,95],[330,96],[331,124],[371,164],[373,223],[331,266],[331,283],[295,283],[282,271],[280,230],[260,204],[231,205],[231,189],[260,161],[261,136],[239,111],[204,111]]);
const portNorth=portMap([[90,-120],[600,-120],[600,120],[400,99],[369,66],[333,67],[330,77],[199,77],[174,40],[162,35],[110,35],[91,17]]);
const portRamp=(id,x,z,width,length=12)=>({id,name:'BOW JUMP',x:(x-220)*.8,z:(z-285)*.8,tx:-.36,tz:Math.sqrt(1-.36*.36),width,length,height:2.1,floating:false});
const portSmallRamps=[[165,476],[188,461],[202,442]].map(([x,z],i)=>portRamp(110+i,x,z,10));
const portBuoys=rows=>rows.map(([x,z,side])=>({x:(x-220)*.8,z:(z-285)*.8,side}));
const portNormalBuoys=portBuoys([[51,240,1],[69,176,-1],[84,130,-1],[122,94,-1],[194,307,1],[186,335,1],[190,362,1],[49,461,1]]);
const portHigherBuoys=portBuoys([[51,240,1],[69,176,-1],[84,130,-1],[122,94,-1],[194,307,1],[186,335,1],[190,362,1],[78,439,-1],[49,461,1]]);
// Reverse reference coordinates normalize by (438-x,569-y).
const portReverseBuoys=portBuoys([[82,466,1],[168,354,1],[169,322,1],[181,292,1],[106,85,-1],[73,137,-1],[52,187,-1],[51,267,1],[49,428,-1]]);
portReverseBuoys[7].approach={x:(38-220)*.8,z:(240-285)*.8,throttle:.4,radius:3,range:35};
const portReverseAnchors=portMap([[60,384],[60,260],[60,184],[69,140],[87,103],[123,84],[162,101],[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[254,290],[223,289],[195,291],[175,325],[167,417],[148,471],[124,500],[96,480],[79,438],[65,410]]);
const port={
 boundary:portMap([[10,80],[30,22],[65,7],[89,7],[90,36],[164,36],[199,77],[330,77],[333,66],[368,66],[430,127],[430,259],[369,320],[235,320],[235,532],[210,563],[35,563],[9,543]]),
 name:'Port Blue',theme:'port',tag:'05 / PORT BLUE',layoutRevision:4,stuntLayout:portStuntLayout(),
 buoysByClass:[portNormalBuoys,portHigherBuoys,portHigherBuoys,portReverseBuoys],retainRouteControls:true,
 anchorsByClass:[null,null,null,portReverseAnchors],
 finishLinesByClass:[portMap([[31,267],[89,267]]),portMap([[31,267],[89,267]]),portMap([[31,267],[89,267]]),portMap([[34,384],[86,384]])],
 description:'A long tanker divides the harbor. Normal uses the outer dock basin. Hard offers both routes; Expert and Reverse require the winding inner channel.',
 anchors:portMap([[60,260],[60,184],[69,140],[87,103],[123,84],[200,82],[315,86],[348,105],[386,157],[391,214],[366,260],[337,292],[290,300],[244,294],[195,291],[175,325],[167,417],[148,471],[124,500],[96,480],[79,438],[65,355]]),
 expertAnchors:portMap([[60,260],[60,184],[69,140],[87,103],[123,84],[162,101],[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[254,290],[223,289],[195,291],[175,325],[167,417],[148,471],[124,500],[96,480],[79,438],[65,355]]),
 expertClosedAreas:[portMap([[194,76],[336,76],[336,96],[194,96]]),portMap([[280,283],[439,283],[439,328],[280,328]])],
 ground(x,z){return Math.max(port.renderGround(x,z),clamp(-polygonDistance(portShip,x,z)*.8,-10,6),clamp(-polygonDistance(portDock,x,z)*.8,-10,6));},
 renderGround(x,z){return clamp(Math.max(-polygonDistance(portNorth,x,z)*.8,(x-(430-220)*.8)*.8),-10,6);},
 obstacles:[],resistance:[],raceRamps:[],raceRampsByClass:[portSmallRamps,[portRamp(110,184,463,64,18)],[portRamp(110,187,463,84,18)],portSmallRamps],shipOutline:portShip,dockOutline:portDock,
 shortcut:{kind:'tunnel',from:portMap([[123,84]])[0],to:portMap([[175,325]])[0],width:6,clearance:4.3,continuous:true,
 via:portMap([[162,101],[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[254,290],[223,289]]),
 structure:portMap([[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[263,279]])}
};
const cityMap=points=>fromMap(points,200,275,.8);
const cityWater=cityMap([[154,20],[337,20],[385,67],[372,100],[373,141],[390,152],[377,187],[359,195],[348,211],[358,232],[306,370],[306,524],[249,524],[249,498],[241,499],[229,524],[16,524],[14,334],[123,225],[140,225],[149,234],[176,234],[200,215],[200,198],[177,177],[177,141],[167,130],[167,86],[154,70]]);
const cityCenter=cityMap([[206,65],[224,51],[257,58],[258,174],[248,180],[248,226],[253,231],[253,466],[241,472],[56,470],[52,454],[52,387],[139,310],[186,278],[186,258],[223,221],[223,177],[206,165]]);
const cityEast=cityMap([[277,37],[295,37],[329,70],[329,160],[315,175],[289,232],[277,231],[277,177]]);
const citySand=cityMap([[184,36],[223,51],[206,65]]);
const cityBalls=cityMap([[179,134],[192,134],[186,141],[180,150],[192,150],[108,485],[108,496],[108,507],[108,518]]).map(([x,z])=>({x,z,r:.7,type:'ball'}));
const cityExpertBalls=[...cityBalls,...cityMap([[186,135],[186,157],[119,487],[119,498],[119,509]]).map(([x,z])=>({x,z,r:.7,type:'ball'}))];
const cityRamp=(id,x,z,tx,tz,width,length=14)=>({id,name:'CITY JUMP',x:(x-200)*.8,z:(z-275)*.8,tx,tz,width,length,height:id===120?2.7:2.1,floating:false});
const cityLateRamps=[cityRamp(121,185,113,0,1,9),cityRamp(122,84,488,1,0,14),cityRamp(123,189,489,1,0,13)];
// Forward markers border the sand point and quays; keep helm targets close
// to those buoys. Reverse has its own line and retains the wider approach.
const cityBuoys=(rows,offset=3.5)=>rows.map(([x,z,side])=>({x:(x-200)*.8,z:(z-275)*.8,side,offset}));
const cityForwardBuoys=cityBuoys([[325,308,-1],[352,236,-1],[360,176,-1],[358,114,-1],[312,26,-1],[235,26,-1],[170,27,-1],[150,290,1],[95,333,-1],[59,378,1],[31,453,1],[25,508,-1],[66,498,-1],[171,499,-1],[293,480,-1]]);
const cityReverseBuoys=cityBuoys([[238,103,-1],[352,85,-1],[457,87,-1],[491,72,-1],[494,130,1],[476,207,1],[418,244,-1],[387,308,1],[345,460,1],[338,544,-1],[281,554,1],[206,538,-1],[155,478,1],[166,411,-1],[199,336,-1],[210,273,-1]].map(([x,z,side])=>[517-x,581-z,side]),7);
// The two western red markers run beside a projecting quay corner.
cityReverseBuoys[4].approach={x:(30-200)*.8,z:(475-275)*.8,throttle:.38,radius:2,range:35};
cityReverseBuoys[5].approach={x:(31-200)*.8,z:(405-275)*.8,throttle:.4,radius:2,range:30};
const cityReversePath=[[230,153],[225,204],[203,262],[193,305],[187,340],[174,378],[154,404],[152,425],[161,454],[158,487],[175,531],[197,548],[213,549],[248,548],[278,554],[311,558],[339,557],[354,548],[355,536],[343,517],[328,496],[324,479],[325,458],[334,436],[331,416],[316,392],[309,374],[311,358],[339,328],[361,304],[398,269],[431,238],[450,217],[466,181],[480,151],[492,113],[500,89],[499,69],[475,65],[439,68],[385,68],[331,68],[306,69],[289,80],[269,98],[257,100],[244,86],[237,82],[229,86],[225,96],[230,136]];
const cityReverseAnchors=cityMap(cityReversePath.map(([x,z])=>[517-x,581-z]));
const city={
 shortcut:{kind:'jump-dive',from:cityMap([[269,390]])[0],to:cityMap([[229,30]])[0],width:8,via:cityMap([[269,360],[269,315],[269,285],[269,260],[269,236],[269,200],[269,160],[269,75],[260,45]]),structure:cityMap([[269,390],[269,70]])},
 crossbars:[{x:(269-200)*.8,z:(234-275)*.8,tx:1,tz:0,length:32.8,depth:.9,bottom:.45,top:1.35}],
 name:'Twilight City',theme:'city',tag:'06 / TWILIGHT CITY',layoutRevision:4,boundary:cityWater,stuntLayout:cityStuntLayout(),
 buoysByClass:[cityForwardBuoys,cityForwardBuoys,cityForwardBuoys,cityReverseBuoys],retainRouteControls:true,
 finishLine:cityMap([[240,428],[319,428]]),anchorsByClass:[null,null,null,cityReverseAnchors],
 description:'Floodlit waterways and metal buoys. The inner wall offers a jump shortcut; Expert moves the ramp back, requiring F during descent to dive beneath it. The outer route stays open.',
 anchors:cityMap([[269,420],[288,341],[322,281],[342,239],[336,212],[352,181],[368,160],[358,139],[358,114],[374,68],[333,31],[277,29],[229,29],[182,27],[173,55],[174,96],[178,133],[190,169],[207,200],[204,218],[174,244],[141,278],[116,321],[87,349],[48,383],[24,429],[23,458],[38,472],[77,478],[131,486],[179,501],[212,513],[244,483],[266,456]]),
 ground(x,z){return Math.max(city.renderGround(x,z),clamp(-polygonDistance(cityCenter,x,z)*.8,-10,6),clamp(-polygonDistance(cityEast,x,z)*.8,-10,6));},
 renderGround(x,z){return clamp(Math.max(polygonDistance(cityWater,x,z)*.8,Math.min(1.1,1.1-polygonDistance(citySand,x,z)*.6)),-10,8);},
 quayOutlines:[cityCenter,cityEast],obstaclesByClass:[cityBalls,cityBalls,cityExpertBalls,cityBalls],
 raceRampsByClass:[[cityRamp(120,270,260,0,-1,12,22),...cityLateRamps],[cityRamp(120,270,260,0,-1,12,22),...cityLateRamps],[cityRamp(120,270,285,0,-1,12,22),...cityLateRamps],[cityRamp(120,270,285,0,-1,12,22),...cityLateRamps]],resistance:[]
};
const glacier=createGlacierCourse(polygonDistance);
const southern=createSourceSouthernCourse(polygonDistance);
export const CLASSIC_COURSES={greyhaven:sunny,amber:sunset,reed:lake,citadel:fort,port,neon:city,glacier,tempest:southern,practice:createDolphinCourse(polygonDistance)};
export function courseResistance(course,x,z,wet=1){let drag=0;for(const p of course.resistance||[]){const q=((x-p.x)/p.rx)**2+((z-p.z)/p.rz)**2;drag=Math.max(drag,p.drag*clamp((1-q)*3,0,1));}return drag*clamp(wet,0,1);}
