import * as T from 'three';
import type {CarKind} from './rules';
export type DrivingCamera='chase'|'hood'|'dashboard';
export const nextDrivingCamera=(view:DrivingCamera):DrivingCamera=>view==='chase'?'hood':view==='hood'?'dashboard':'chase';
export const DRIVING_CAMERA_LABELS:Record<DrivingCamera,string>={chase:'CHASE',hood:'HOOD',dashboard:'DASHBOARD'};
/** Eye positions in the authored model's coordinate system, before its chassis
 * offset. The three original cars have center-mounted steering assemblies. */
export const DASHBOARD_EYES:Record<CarKind,readonly[number,number,number]>={
 hollins:[-.42,1.50,.02],cornet:[-.42,1.60,.90],fernleigh:[-.40,1.42,.04],ravenhill:[-.42,1.26,.15],pipit:[-.27,1.12,-.14],linnet:[-.30,1.10,-.42],tordal:[-.38,1.30,-.10],starfin:[-.42,1.24,-.15],saber:[-.36,1.17,-.20],alder:[-.40,1.31,-.12],morrow:[-.40,1.29,-.10],kite:[-.36,1.30,-.07],coupe:[0,1.19,.43],sedan:[0,1.30,.48],hatch:[0,1.32,.32],
 muscle:[-.36,1.25,-.05],wagon:[-.36,1.25,-.05],utility:[-.36,1.25,.06],
 compact:[-.324,1.21,-.12],van:[-.405,1.51,.36],tern:[-.343,1.26,-.08],
 marten:[-.343,1.26,-.08],buggy:[-.325,1.34,-.12],shuttle:[-.52,1.96,2.06],
 regent:[-.52,1.37,.12],trail:[-.47,1.56,.10],
};
/** Rigid attachment prevents camera lag from carrying the eye through pillars
 * during turns. Follow body attitude so bumps/rolls cannot expose the roof skin. */
/** A crushed roof comes down on the driver: the eye ducks just under the dented roof so the cab view never ends up above
 * it. The drop is measured from the actual crushed body: a ray cast up from below the eye finds the roof's underside. */
export const ROOF_DUCK={probe:.45,skip:.2,margin:.07,max:.4} as const;
export function dashboardEye(kind:CarKind,drop=0):[number,number,number]{
 const [x,y,z]=DASHBOARD_EYES[kind],d=Math.max(0,Math.min(ROOF_DUCK.max,Number.isFinite(drop)?drop:0));
 return d>0?[x,y-d,z]:[x,y,z];
}
/** How far the eye must duck (model units) to stay ROOF_DUCK.margin under the roof skin and glass as they are now. */
export function roofDuckDrop(kind:CarKind,model:T.Object3D,body:readonly T.Mesh[]){
 model.updateWorldMatrix(true,true);
 const up=new T.Vector3(0,1,0).applyQuaternion(model.getWorldQuaternion(new T.Quaternion())),eye=new T.Vector3(...DASHBOARD_EYES[kind]).applyMatrix4(model.matrixWorld);
 const hits=new T.Raycaster(eye.clone().addScaledVector(up,-ROOF_DUCK.probe),up,ROOF_DUCK.skip,ROOF_DUCK.probe+1).intersectObjects(body.filter(m=>m.visible),false);
 if(!hits.length)return 0;
 return Math.min(ROOF_DUCK.max,Math.max(0,ROOF_DUCK.margin-(hits[0].distance-ROOF_DUCK.probe)));
}
export function dashboardComposition(kind:CarKind,model:T.Object3D,drop=0){
 model.updateWorldMatrix(true,false);
 const position=new T.Vector3(...dashboardEye(kind,drop)).applyMatrix4(model.matrixWorld);
 const rotation=model.getWorldQuaternion(new T.Quaternion());
 return {position,target:position.clone().add(new T.Vector3(0,-.035,1).applyQuaternion(rotation).multiplyScalar(25)),up:new T.Vector3(0,1,0).applyQuaternion(rotation),fov:66,near:.035};
}
