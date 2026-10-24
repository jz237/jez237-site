import {MathUtils} from 'three';
export type ConstructionRole='skin'|'engine'|'rail'|'radiator';

/** Keep a few mechanical batches separate, rather than hundreds of draw calls. */
export function constructionRole(name:string):ConstructionRole{
  name=name.replace(/[_-]+/g,' ');
  if(/Structure engine (block|sump|cover|valve cover|casting rib|air cleaner)|Structure (valve cover|air cleaner|intake runner)/i.test(name))return 'engine';
  // The hand-built classics name their engines after the car: Structure Tordal inline four, Structure Hollins V8 block ...
  if(/^Structure [A-Za-z]+ (?:(?:longitudinal|transverse) )?(?:inline (?:four|six)|V8(?: bank| block| cover)?|four|engine|rear twin|twin cam inline four|air cleaner)\s*$/i.test(name))return 'engine';
  if(/Structure .*rail|Structure .*beam|Structure .*crash mount|Structure strut brace/i.test(name))return 'rail';
  if(/Structure radiator|Structure .*radiator support/i.test(name))return 'radiator';
  return 'skin';
}

/** Continuous occupant-cell protection also applies to glazing and seals. */
export function constructionResponse(x:number,y:number,z:number,verticalImpact:number,role:ConstructionRole='skin'){
  const cage=(1-MathUtils.smoothstep(Math.abs(z),.3,1.05))*MathUtils.smoothstep(y,.55,1.15)*(1-Math.abs(verticalImpact));
  const rail=role==='rail',radiator=role==='radiator';
  return {strength:(1-cage*.52)*(rail?.46:radiator?.73:1),
    fold:rail?.48:radiator?1.2:1,
    budget:.9-cage*.42};
}
