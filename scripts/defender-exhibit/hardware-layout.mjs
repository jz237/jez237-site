// Component identities: Williams 16P-3001-101 R-T, April 1981, sheets 4, 7, 8, 16.
// Positions are normalized tracings of assembly drawings, not manufacturing CAD.
// Families only: deliberately no invented vendor logos or production date codes.
const cpu=[];
const col={A:.060,B:.082,C:.137,D:.147,E:.211,F:.250,G:.283,H:.306,I:.337,J:.365,K:.421,L:.439,M:.487,N:.52,O:.548,P:.592,R:.660,S:.704,T:.746,U:.790,W:.833,X:.876,Y:.919,Z:.962};
const row={1:.175,2:.307,3:.434,4:.565,5:.699,6:.827,7:.938};
function at(ref,family,pins=14,socket=false){const r=+ref[0],c=ref.slice(1);cpu.push({ref,family,pins,socket,u:col[c],v:row[r]});}
for(const [family,refs,pins] of [
 ['7400','4B',14],['7402','5M',14],['74LS04','7P',14],['7404','5B 6M',14],['7408','4J',14],['7410','6J 6P',14],['7411','3B 6O',14],['7420','5C',14],['7421','4C',14],['7432','4R 5P',14],['7474','4E 6R 7J 7L',14],['7486','3A 5R',14],['74LS107','7R',14],['74LS133','5K',16],['74LS139','4K',16],['74153','3G 3I 4F 4H',16],['74165','1O 2O 3O 4O 1P 2P 3P 4P',16],['74LS189','1C 2C',16],['74LS245','1K',20],['74LS257','2E 2M',16],['74LS367','1F 2F 2K 3D',16],['74LS374','1M 3M 4M',20],['74LS74','4S 5S',14],['74LS393','5O',14],['4071','6H',14],['9316','5E 5F 5H 5J',16],['7427','6K',14]])for(const ref of refs.split(' '))at(ref,family,pins);
at('2I','6809E',40,true);cpu.at(-1).v=.26;
at('1E','5101',22);at('3E','7641',24,true);at('3K','7641',24,true);
for(let r=1;r<=3;r++)for(const c of ['R','S','T','U','W','X','Y','Z'])at(r+c,'4116',16,true);
// Sheet 4 uses a staggered grid: these locations are between the edge legend columns.
for(const [ref,u]of [['2E',.193],['3E',.211],['3K',.410],['3D',.147],['7J',.389],['7L',.440]])cpu.find(c=>c.ref===ref).u=u;
const rom=[];
for(const [r,ids]of [[0,[7,8,9]],[1,[10,11,12]],[2,[4,5,6]],[3,[1,2,3]]])for(const [c,i]of ids.entries())rom.push({ref:'IC'+i,family:i===5?'UNUSED':'ROM '+i,pins:24,socket:true,empty:i===5,u:.233+c*.275,v:.499+r*.112,rotation:Math.PI/2,red:i!==5});
for(const [i,family,pins,u,v,rotation]of [[22,'6821',40,.399,.163,Math.PI/2],[23,'4.7K ARRAY',16,.497,.060,Math.PI/2],[24,'4069',14,.175,.271,0],[17,'74LS395',16,.307,.271,0],[14,'7432',14,.434,.271,0],[20,'7402',14,.559,.271,0],[26,'7432',14,.687,.271,0],[21,'7403',14,.815,.271,0],[16,'7432',14,.175,.384,0],[13,'7442',16,.307,.384,0],[25,'7432',14,.434,.384,0],[15,'74LS139',16,.559,.384,0],[19,'7404',14,.687,.384,0],[18,'7400',14,.815,.384,0]])rom.push({ref:'IC'+i,family,pins,u,v,rotation});
const input=[{ref:'IC1',family:'6821',pins:40,u:.778,v:.58},{ref:'IC5',family:'4.7K ARRAY',pins:16,u:.081,v:.386}];
for(const [i,u,v,family,rotation]of [[2,.51,.802,'4049',Math.PI/2],[3,.51,.582,'4049',Math.PI/2],[4,.51,.357,'4049',Math.PI/2],[6,.646,.79,'74LS257',0],[7,.646,.40,'74LS257',0]])input.push({ref:'IC'+i,family,pins:16,u,v,rotation});
const sound=[];
for(const [i,family,pins,u,v]of [[2,'7442',16,.135,.34],[3,'7400',14,.23,.34],[4,'7408',14,.315,.34],[5,'4050',16,.405,.34],[6,'4068',14,.495,.34],[7,'14069',14,.64,.34],[9,'6808 / 02',40,.155,.66],[10,'6821',40,.326,.66],[11,'6810',24,.495,.61],[12,'SOUND ROM',24,.667,.61],[13,'1408 DAC',16,.445,.81]])sound.push({ref:'IC'+i,family,pins,u,v,socket:[9,10,11,12].includes(i)});
export const boardLayouts={
 cpu:{title:'R8570 CPU / VIDEO',sheet:4,width:1.05,height:.84,chips:cpu,headers:[{ref:'1J1',u:.32,v:.024,n:40},{ref:'1J3',u:.60,v:.024,n:40},{ref:'1P4',u:.023,v:.40,n:20,rotation:Math.PI/2},{ref:'1P5',u:.023,v:.59,n:4,rotation:Math.PI/2},{ref:'1J2',u:.023,v:.88,n:7,rotation:Math.PI/2}]},
 rom:{title:'D8572 ROM / RED LABEL',sheet:8,width:.50,height:.655,chips:rom,headers:[{ref:'2J3',u:.236,v:.035,n:10},{ref:'2J4',u:.767,v:.035,n:10},{ref:'2J2',u:.037,v:.328,n:4,rotation:Math.PI/2},{ref:'2P1',u:.718,v:.947,n:40}]},
 interface:{title:'C8573 INPUT',sheet:7,width:.45,height:.29,chips:input,headers:[{ref:'3J2',u:.35,v:.070,n:10},{ref:'3J3',u:.66,v:.070,n:10},{ref:'3P1',u:.952,v:.58,n:20,rotation:Math.PI/2}]},
 sound:{title:'D8224 SOUND',sheet:16,width:.50,height:.474,chips:sound,headers:[{ref:'10J3',u:.31,v:.034,n:4},{ref:'10J4',u:.48,v:.034,n:4},{ref:'10J2',u:.63,v:.034,n:9},{ref:'10J1',u:.82,v:.034,n:9}]},
};
