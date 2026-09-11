import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {harnessCurve} from './Mechanics';

const routes=[['control_harness_plug','cabinet_control_socket'],['coin_harness_plug','cabinet_coin_socket']];
export function ServiceHarness({scene,isolated}:{scene:T.Group;isolated:boolean}){
 const group=useRef<T.Group>(null),stamp=useRef('');
 const wires=useMemo(()=>routes.flatMap((_,route)=>Array.from({length:4},(_,wire)=>({route,wire}))),[]);
 useFrame(()=>{
  if(!group.current)return;group.current.visible=!isolated;
  const endpoints=routes.map(([from,to])=>[scene.getObjectByName(from)?.getWorldPosition(new T.Vector3()),scene.getObjectByName(to)?.getWorldPosition(new T.Vector3())]);
  if(endpoints.some(pair=>pair.some(v=>!v)))return;
  const next=endpoints.flat().map(v=>v!.toArray().map(n=>n.toFixed(3)).join()).join('|');if(next===stamp.current)return;stamp.current=next;
  wires.forEach(({route,wire},i)=>{const [a,b]=endpoints[route] as T.Vector3[];const shift=(wire-1.5)*.008;const curve=harnessCurve(a.clone().add(new T.Vector3(shift,-.008,0)),b.clone().add(new T.Vector3(shift,-.008,0)),wire);const mesh=group.current!.children[i] as T.Mesh;mesh.geometry.dispose();mesh.geometry=new T.TubeGeometry(curve,24,.0024,5,false);});
 });
 return <group ref={group}>{wires.map(({route,wire})=><mesh key={route+'-'+wire} raycast={()=>null}><bufferGeometry/><meshStandardMaterial color={['#ae533d','#bca96a','#657e8b','#9b9d85'][wire]} roughness={.72}/></mesh>)}</group>;
}
