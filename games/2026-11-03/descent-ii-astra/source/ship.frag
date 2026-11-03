precision highp float;
varying mediump vec2 uv;
varying highp vec3 normal,position;
varying mediump float material;
uniform sampler2D skin;
uniform vec3 keyLight,fillLight;
uniform float exposure;
void main(){
  vec3 n=normalize(normal),v=normalize(-position),l=normalize(keyLight);
  float m=floor(material+.5);
  vec3 c=vec3(.28,.34,.37);
  if(m==1.)c=vec3(.025,.09,.13);
  if(m==2.)c=vec3(.11,.15,.17);
  if(m==3.)c=vec3(.70,.286,.078);
  if(m==4.)c=vec3(.39,.42,.42);
  if(m==5.)c=vec3(.075,.09,.093);
  if(m==6.)c=vec3(.12,.83,1.);
  if(m==7.)c=vec3(1.,.56,.15);
  float fres=pow(1.-abs(dot(n,v)),3.);
  vec2 st=uv*1.67;vec3 plate=texture2D(skin,st).rgb;
  float relief=dot(plate,vec3(.27,.58,.15));
  if(m!=1. && m<6.){
    float bumpX=texture2D(skin,st+vec2(.003,0.)).g-plate.g;
    float bumpY=texture2D(skin,st+vec2(0.,.003)).g-plate.g;
    n=normalize(n+vec3(bumpX,bumpY,.0)*1.35);c*=clamp(.13+relief*2.8,.24,1.35);c=mix(c,plate*c*1.8,.26);
  }
  float grain=sin(uv.x*230.+sin(uv.y*65.))*.015+sin(uv.y*508.)*.012;
  float seam=1.-smoothstep(.006,.021,min(fract(uv.x*2.),1.-fract(uv.x*2.)));
  if(m!=1. && m<6.)c*=1.+grain-.17*seam;
  vec3 color=c*(.37+.80*max(dot(n,l),0.)+.30*max(dot(n,normalize(fillLight)),0.));
  float spec=pow(max(0.,dot(n,normalize(l+v))),m==1.?95.:35.);
  color+=(.22+.42*float(m==1.))*spec*vec3(1.,.89,.74);
  color+=vec3(.12,.23,.27)*fres;
  if(m==1.)color+=vec3(.22,.48,.57)*smoothstep(.40,.94,reflect(-v,n).y)+vec3(.10,.20,.22)*exp(-22.*abs(reflect(-v,n).y-.46));
  if(m>=6.)color=c*(1.05+.18*abs(n.z));
  gl_FragColor=vec4(color*exposure,1.);
}

