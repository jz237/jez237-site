// Both sides of the unchanged cliff/terrain boundary use the same registered
// photograph, tint and material response. Coverage is authored in the floor mask.
export const northMineralGLSL = `
vec3 northMineralColor(vec3 photo) {
  float gray=dot(photo,vec3(.2126,.7152,.0722));
  return mix(photo,vec3(gray),.5)*vec3(.64,.62,.57);
}
`;
