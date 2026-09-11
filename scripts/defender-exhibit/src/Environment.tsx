import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useLoader,useThree} from '@react-three/fiber';
import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {makeRoom} from './room';

export function ArcadeEnvironment({wood,marquee,screen,quality,reduced}:{wood:T.Texture;marquee:T.Texture;screen:T.Texture;quality:string;reduced:boolean}){
 const {gl,scene,camera}=useThree();
 const [floor,normal,rough]=useLoader(T.TextureLoader,['./floor-albedo.webp','./floor-normal.webp','./floor-roughness.webp']);
 const room=useMemo(()=>makeRoom(wood,marquee,screen),[wood,marquee,screen]);
 // Cut away foreground scenery so orbiting outside a wall or through a
 // neighboring cabinet does not hide the exhibit being inspected.
 const roomCut=useMemo(()=>new T.Plane(),[]);
 const viewDirection=useMemo(()=>new T.Vector3(),[]);
 const cutPoint=useMemo(()=>new T.Vector3(),[]);
 const exhibitCenter=useMemo(()=>new T.Vector3(0,1.7,0),[]);
 useEffect(()=>{gl.localClippingEnabled=true;room.traverse(o=>{if(o instanceof T.Mesh){const materials=Array.isArray(o.material)?o.material:[o.material];for(const material of materials){material.clippingPlanes=[roomCut];material.needsUpdate=true;}}});},[gl,room,roomCut]);
 const points=useRef<T.Points>(null);
 const dust=useMemo(()=>{const g=new T.BufferGeometry();const n=quality==='low'?45:150,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=Math.sin(i*537)*5;a[i*3+1]=(i*13%45)/10;a[i*3+2]=Math.cos(i*273)*4;}g.setAttribute('position',new T.BufferAttribute(a,3));return g;},[quality]);
 useEffect(()=>{for(const t of [floor,normal,rough]){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(10,10);t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());}floor.colorSpace=T.SRGBColorSpace;for(const t of [floor,normal,rough])t.needsUpdate=true;const gen=new T.PMREMGenerator(gl);const envRoom=new RoomEnvironment();const env=gen.fromScene(envRoom,.06);scene.environment=env.texture;scene.environmentIntensity=.16;envRoom.dispose();gen.dispose();return()=>{scene.environment=null;env.dispose()};},[gl,scene]);
 const reflection=useMemo(()=>{const r=new Reflector(new T.PlaneGeometry(36,36),{clipBias:.003,textureWidth:768,textureHeight:512,color:0x39352e});r.rotation.x=-Math.PI/2;r.position.y=.021;return r},[]);
 useEffect(()=>()=>{reflection.dispose();reflection.geometry.dispose();},[reflection]);
 useEffect(()=>()=>dust.dispose(),[dust]);
 useEffect(()=>()=>{const materials=new Set<T.Material>(),textures=new Set<T.Texture>();room.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});for(const m of materials){for(const value of Object.values(m))if(value instanceof T.Texture&&![wood,marquee,screen].includes(value))textures.add(value);m.dispose();}textures.forEach(t=>t.dispose());},[room,wood,marquee,screen]);
 useFrame((_,dt)=>{camera.getWorldDirection(viewDirection);cutPoint.copy(camera.position).addScaledVector(viewDirection,Math.max(.25,camera.position.distanceTo(exhibitCenter)-3.5));roomCut.setFromNormalAndCoplanarPoint(viewDirection,cutPoint);if(points.current&&!reduced)points.current.rotation.y+=Math.min(dt,.05)*.007});
 return <><primitive object={room}/>{quality==='high'&&<primitive object={reflection}/>}<mesh rotation={[-Math.PI/2,0,0]} position={[0,.023,0]} receiveShadow><planeGeometry args={[36,36]}/><meshStandardMaterial map={floor} normalMap={normal} normalScale={new T.Vector2(.38,.38)} roughnessMap={rough} roughness={.88} metalness={.08} color="#aaa69c" transparent={quality==='high'} opacity={quality==='high'?.87:1} depthWrite={quality!=='high'}/></mesh><points ref={points} geometry={dust}><pointsMaterial color="#c0ae8d" size={.009} transparent opacity={.34} depthWrite={false}/></points><pointLight position={[2.43,1.58,-4.64]} intensity={2.6} distance={3.5} color="#ffcf91"/><pointLight position={[-3,3.4,-4.9]} intensity={14} color="#b0476c"/><pointLight position={[4,2.3,-2]} intensity={9} color="#3c8094"/><pointLight position={[-4,2.4,-1]} intensity={8} color="#517f95"/></>;
}

export function FilmFinish({quality,mode}:{quality:string;mode:string}){const {gl,scene,camera,size}=useThree();const composer=useMemo(()=>{const c=new EffectComposer(gl);c.addPass(new RenderPass(scene,camera));const ao=new SSAOPass(scene,camera,800,600,12);ao.kernelRadius=2;ao.minDistance=.003;ao.maxDistance=.025;
 // Foreground room cutaways and the floor reflection must not become false AO occluders.
 const renderAO=ao.render.bind(ao);ao.render=(...args)=>{const hidden:T.Object3D[]=[];scene.traverse(o=>{if(o.visible&&(o.name==='after_hours_arcade'||(o.name.startsWith('exhibit-')&&o.userData.active===false)||(o as T.Object3D&{isReflector?:boolean}).isReflector)){hidden.push(o);o.visible=false;}});try{renderAO(...args);}finally{hidden.forEach(o=>{o.visible=true;});}};c.addPass(ao);c.addPass(new UnrealBloomPass(new T.Vector2(800,600),.14,.35,1.15));c.addPass(new OutputPass());return c},[gl,scene,camera]);useEffect(()=>{const ao=composer.passes.find(pass=>pass instanceof SSAOPass);if(ao)ao.enabled=mode!=='X-Ray';},[composer,mode]);useEffect(()=>{composer.setSize(size.width,size.height);composer.setPixelRatio(Math.min(gl.getPixelRatio(),1.3));},[composer,size]);useEffect(()=>()=>{composer.passes.forEach(pass=>pass.dispose());composer.dispose();},[composer]);useFrame((_,dt)=>{gl.info.autoReset=false;gl.info.reset();const start=performance.now();if(quality==='high')composer.render(dt);else gl.render(scene,camera);if(location.hostname==='127.0.0.1')(window as unknown as {__arcadeRender:unknown}).__arcadeRender={drawCalls:gl.info.render.calls,triangles:gl.info.render.triangles,geometries:gl.info.memory.geometries,textures:gl.info.memory.textures,cpuRenderMs:performance.now()-start};gl.info.autoReset=true;},1);return null}
