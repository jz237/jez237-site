export const plantMotion = `
vec2 plant(vec2 p,vec2 base,vec2 extent,float phase,float flexibility){
 float h=(p.y-base.y)/extent.y;
 float width=1.0-smoothstep(.55,1.0,abs(p.x-base.x)/extent.x);
 float tip=smoothstep(0.0,.85,h)*(1.0-smoothstep(.9,1.12,h));
 float current=sin(time*.95+phase-h*1.15)*.72+sin(time*1.63+phase*2.1-h*.7)*.28;
 // The outlet pushes upper leaves left; elastic stems recoil, with fixed bases.
 float bend=flow*flexibility*width*tip;
 return vec2(bend*(.30+current)*.0065,bend*sin(time*1.15+phase-h)*.0009);
}

vec2 plantingOffset(vec2 p){
 vec2 drift=vec2(0.0);
 drift+=plant(p,vec2(.203,.555),vec2(.034,.19),.3,.85);
 drift+=plant(p,vec2(.272,.552),vec2(.054,.205),1.2,1.05);
 drift+=plant(p,vec2(.478,.660),vec2(.051,.135),2.6,1.0);
 drift+=plant(p,vec2(.554,.538),vec2(.038,.157),3.4,1.15);
 drift+=plant(p,vec2(.602,.486),vec2(.048,.159),4.1,1.05);
 drift+=plant(p,vec2(.656,.450),vec2(.037,.126),5.5,.95);
 drift+=plant(p,vec2(.727,.410),vec2(.048,.222),.9,1.3);
 drift+=plant(p,vec2(.786,.430),vec2(.016,.300),2.1,1.35);
 drift+=plant(p,vec2(.372,.443),vec2(.024,.089),4.9,.55);
 // Carpet remains nearly still; taller, supple plants carry the movement.
 drift+=plant(p,vec2(.430,.325),vec2(.22,.076),3.7,.12);

 return drift;
}
`;
// Hand-authored depth silhouettes for this fixed photographic viewpoint.
export const depthOcclusion = `
float capsule(vec2 p,vec2 a,vec2 b,float radius){
 vec2 pa=p-a,ba=b-a;
 float d=length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0));
 return 1.0-smoothstep(radius-1.5,radius+1.5,d);
}
float sceneOcclusion(vec2 uv,float depth){
 vec2 p=vec2(uv.x*1672.0,(1.0-uv.y)*941.0);
 vec3 c=texture2D(photograph,uv).rgb;
 float wood=max(capsule(p,vec2(553,368),vec2(667,225),25.0),capsule(p,vec2(558,377),vec2(738,493),21.0));
 wood=max(wood,capsule(p,vec2(738,493),vec2(1046,574),13.0));
 wood=max(wood,capsule(p,vec2(669,370),vec2(891,282),10.0));
 float rock=1.0-smoothstep(.92,1.0,length((p-vec2(462,501))/vec2(107,66)));
 float planted=1.0-smoothstep(935.0,1040.0,p.x);
 planted=max(planted,smoothstep(1120.0,1190.0,p.x));
 planted*=smoothstep(225.0,280.0,p.y)*(1.0-smoothstep(610.0,660.0,p.y));
 float green=smoothstep(.018,.075,c.g-max(c.r,c.b));
 float red=smoothstep(.025,.10,c.r-c.b)*smoothstep(.025,.10,c.r-c.g);
 float foliage=max(green,red)*planted;
 float foreground=smoothstep(510.0,570.0,p.y)*green;
 return clamp(max(max(wood,rock)*(1.0-smoothstep(.76,.82,depth)),max(foliage*(1.0-smoothstep(.46,.52,depth)),foreground*(1.0-smoothstep(.90,.95,depth)))),0.0,1.0);
}
`;
