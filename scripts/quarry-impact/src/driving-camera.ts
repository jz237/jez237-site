import * as T from 'three';
import type {CarKind} from './rules';
export type DrivingCamera='chase'|'hood'|'dashboard';
export const nextDrivingCamera=(view:DrivingCamera):DrivingCamera=>view==='chase'?'hood':view==='hood'?'dashboard':'chase';
export const DRIVING_CAMERA_LABELS:Record<DrivingCamera,string>={chase:'CHASE',hood:'HOOD',dashboard:'DASHBOARD'};
/** Eye positions in the authored model's coordinate system, before its chassis
 * offset. The three original cars have center-mounted steering assemblies. */
export const DASHBOARD_EYES:Record<CarKind,readonly[number,number,number]>={
 fernleigh:[-.40,1.42,.04],ravenhill:[-.42,1.26,.15],pipit:[-.27,1.12,-.14],linnet:[-.30,1.10,-.42],tordal:[-.38,1.30,-.10],starfin:[-.42,1.24,-.15],saber:[-.36,1.17,-.20],alder:[-.40,1.31,-.12],morrow:[-.40,1.29,-.10],kite:[-.36,1.30,-.07],coupe:[0,1.19,.43],sedan:[0,1.30,.48],hatch:[0,1.32,.32],
 muscle:[-.36,1.25,-.05],wagon:[-.36,1.25,-.05],utility:[-.36,1.25,.06],
 compact:[-.324,1.21,-.12],van:[-.405,1.51,.36],tern:[-.343,1.26,-.08],
 marten:[-.343,1.26,-.08],buggy:[-.325,1.34,-.12],shuttle:[-.52,1.96,2.06],
 regent:[-.52,1.37,.12],trail:[-.47,1.56,.10],
};
/** Rigid attachment prevents camera lag from carrying the eye through pillars
 * during turns. Follow body attitude so bumps/rolls cannot expose the roof skin. */
export function dashboardComposition(kind:CarKind,model:T.Object3D){
 model.updateWorldMatrix(true,false);
 const position=new T.Vector3(...DASHBOARD_EYES[kind]).applyMatrix4(model.matrixWorld);
 const rotation=model.getWorldQuaternion(new T.Quaternion());
 return {position,target:position.clone().add(new T.Vector3(0,-.035,1).applyQuaternion(rotation).multiplyScalar(25)),up:new T.Vector3(0,1,0).applyQuaternion(rotation),fov:66,near:.035};
}
