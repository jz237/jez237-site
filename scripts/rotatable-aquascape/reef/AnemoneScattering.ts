/** Thin-tissue lighting approximation. Redistribute a bounded portion of the
 * diffuse lobe around/through the tissue; retain the standard surface specular.
 * IncidentLight already contains light intensity, attenuation and cast shadows.
 * There is no emissive rim or extra transmission capture. */
export const anemoneScatteringGLSL=`
void RE_Direct_Anemone(const in IncidentLight directLight, const in vec3 geometryPosition,
 const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal,
 const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
 RE_Direct_Physical(directLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight);
 float strand=step(.5,anemoneSkin.w);
 float nl=dot(geometryNormal,directLight.direction),surface=max(0.,nl);
 // Width is measured from each strand profile, including its inflated lobe.
 float thickness=max(.08,tissueThickness);
 float amount=strand*.76*exp(-thickness*.45);
 float wrap=max(0.,nl+.6)/2.56;
 // A wider opposite-side lobe and wavelength-dependent pigment absorption
 // distinguish thin olive tissue from an opaque pale plastic tube.
 float through=max(0.,-nl);
 vec3 absorption=exp(-thickness*vec3(2.9,1.35,2.1));
 vec3 diffuseLobe=mix(vec3(wrap),through*absorption,.48);
 reflectedLight.directDiffuse+=directLight.color*BRDF_Lambert(material.diffuseContribution)*amount*(diffuseLobe-surface);
}
#undef RE_Direct
#define RE_Direct RE_Direct_Anemone
`;
