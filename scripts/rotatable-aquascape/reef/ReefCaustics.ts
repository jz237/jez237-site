/** Local focusing approximation from the six reef surface waves.
 * It solves neither a full inverse ray mapping
 * nor multiple scattering. A finite light footprint bounds the concentration. */
export const reefCausticsShader=`
float reefCausticFocus(vec2 p,float depth,float time){
 vec2 q=p+vec2(sin(p.y*1.9+p.x*.7-time*.29),sin(p.x*1.3-p.y*.8+time*.23))*.09;
 vec3 phase=vec3(q.x*2.7+q.y*3.6-time*1.8,
  q.x*8.3-q.y*6.8-time*3.2+sin(q.y*1.7)*.65,
  q.x*12.1+q.y*9.7-time*4.8+sin(q.x*.8-time*.23)*.7);
 // Leading curvature terms of the matching .018/.020/.011 surface waves.
 // Slow coordinate-warp derivatives are omitted from this local lens model.
 vec3 bend=-sin(phase)*vec3(.018,.020,.011);
 float hxx=dot(bend,vec3(7.29,68.89,146.41));
 float hzz=dot(bend,vec3(12.96,46.24,94.09));
 float hxz=dot(bend,vec3(9.72,-56.44,117.37));
 float footprint=max(length(dFdx(p)),length(dFdy(p)));
 vec3 finePhase=vec3(q.x*23.2-q.y*17.8-time*7.1,
  q.x*31.7+q.y*11.9-time*8.6+sin(q.y*2.3)*.25,
  -q.x*15.3+q.y*37.4-time*10.3);
 // Finite emitter size suppresses the finest focusing bands as they travel.
 float fineFilter=exp(-depth*.16)*(1.-smoothstep(.025,.075,footprint));
 vec3 fineBend=-sin(finePhase)*vec3(.002,.0014,.0011)*fineFilter;
 hxx+=dot(fineBend,vec3(538.24,1004.89,234.09));
 hzz+=dot(fineBend,vec3(316.84,141.61,1398.76));
 hxz+=dot(fineBend,vec3(-412.96,377.23,-572.22));
 float agitation=.65+.35*exp(-length(p-vec2(4.25,-1.6))*.32);
 hxx*=agitation;hzz*=agitation;hxz*=agitation;
 float travel=min(depth,5.3)*(1.-1./1.333);
 float determinant=(1.-travel*hxx)*(1.-travel*hzz)-travel*travel*hxz*hxz;
 // Leading temporal curvature derivative gives a short exposure footprint.
 // Without it, a narrow moving focus can flash from black to white even after
 // spatial filtering. Use the same wave frequencies as the visible surface.
 vec3 rate=cos(phase)*vec3(.018*1.8,.020*3.2,.011*4.8);
 vec3 fineRate=cos(finePhase)*vec3(.002*7.1,.0014*8.6,.0011*10.3)*fineFilter;
 float rxx=(dot(rate,vec3(7.29,68.89,146.41))+dot(fineRate,vec3(538.24,1004.89,234.09)))*agitation;
 float rzz=(dot(rate,vec3(12.96,46.24,94.09))+dot(fineRate,vec3(316.84,141.61,1398.76)))*agitation;
 float rxz=(dot(rate,vec3(9.72,-56.44,117.37))+dot(fineRate,vec3(-412.96,377.23,-572.22)))*agitation;
 float detRate=-travel*(rxx*(1.-travel*hzz)+rzz*(1.-travel*hxx))-2.*travel*travel*hxz*rxz;
 // Wider finite-source footprint at depth. Filter across a whole pixel rather
 // than letting a focal singularity flash between subpixel light/dark values.
 float width=.24+depth*.07+fwidth(determinant)*.8+abs(detRate)/60.;
 float concentration=(width*width)/(width*width+determinant*determinant);
 concentration*=smoothstep(.05,.4,depth);
 float resolved=1.-smoothstep(.11,.28,footprint);
 return concentration*resolved;
}
`;
