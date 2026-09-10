import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;document.body.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color(0x080f12);
const camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.set(0,11,18);camera.lookAt(0,.5,0);camera.updateMatrixWorld();
scene.add(new T.HemisphereLight(0xd9f1ea,0x2c3126,1));const key=new T.DirectionalLight(0xf2f9e6,3);key.position.set(-3,8,5);scene.add(key);
const file=await new GLTFLoader().loadAsync('./models/rock_moss_set_01/rock_moss_set_01_2k.gltf');
const meshes=file.scene.children.filter(o=>o instanceof T.Mesh) as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>[];
meshes.forEach((source,i)=>{
 const g=source.geometry.clone();g.computeBoundingBox();const bounds=g.boundingBox!,extent=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());g.translate(-center.x,-bounds.min.y,-center.z);
 const material=source.material.clone();material.color.set(0xa1b0a1);const rock=new T.Mesh(g,material);rock.scale.setScalar(2.8/Math.max(extent.x,extent.z));rock.position.set((i%3-1)*4.2,0,(Math.floor(i/3)-.5)*5);rock.rotation.y=.55;scene.add(rock);
 const position=rock.position.clone().add(new T.Vector3(0,-.2,1.55)).project(camera),label=document.createElement('span');label.textContent=`Scan ${i}`;label.style.left=`${(position.x*.5+.5)*innerWidth}px`;label.style.top=`${(-position.y*.5+.5)*innerHeight}px`;document.querySelector('#labels')!.append(label);
});renderer.render(scene,camera);
