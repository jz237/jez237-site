// Bakes the arctic heightfield into a float texture. World spans [-4096,4096]^2.
// +z = north (mountains), -z = south (sea). Stations sit on the line z=0.
uniform float uSize;
out vec4 fragColor;
float terrain(vec2 p){
    float warp=fbm(p*0.0015+3.1,4);
    float coast=smoothstep(-700.,-330., p.y+420.*(warp-0.5));
    float plain=9.+34.*fbm(p*0.0021+11.,5)+13.*fbm(p*0.0085+3.,4)+5.*ridged(p*vec2(0.012,0.02)+7.,4)+0.8*ridged(p*0.07+4.,3);
    float mz=smoothstep(420.,2300., p.y+700.*(fbm(p*0.0007+2.,3)-0.5));
    float mnt=pow(ridged(p*0.00105+5.,9),1.55)*1050.*mz;
    float land=plain+mnt;
    float h=mix(-45.,land,coast);
    float sx=p.x-640.*clamp(floor(p.x/640.+.5),-4.,4.);
    float m=exp(-(sx*sx+p.y*p.y)/(85.*85.));
    h=mix(h,14.,m);
    return h;
}
void main(){
    vec2 p=(gl_FragCoord.xy/uSize-.5)*8192.;
    fragColor=vec4(terrain(p),0,0,1);
}
