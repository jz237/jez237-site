(()=>{var kf=0,eu=1,Of=2;var tu=1,Nl=2,Hi=3,Ci=0,_n=1,Qt=2,xn=0,Qi=1,Mn=2,nu=3,iu=4,Fl=5,li=100,zf=101,Bf=102,Hf=103,Vf=104,js=200,Gf=201,Wf=202,Xf=203,ll=204,cl=205,oa=206,qf=207,aa=208,Yf=209,Zf=210,$f=211,Jf=212,Kf=213,jf=214,kl=0,Ol=1,zl=2,Bs=3,Bl=4,Hl=5,Vl=6,Gl=7,su=0,Qf=1,ed=2,rs=0,Wl=1,Xl=2,ql=3,Xr=4,Yl=5,Zl=6,$l=7,Vh="attached",td="detached",ru=300,Qs=301,er=302,Jl=303,Kl=304,la=306,Hn=1e3,Oi=1001,hl=1002,yn=1003,nd=1004;var ca=1005;var Un=1006,jl=1007;var gi=1008;var Jn=1009,ou=1010,au=1011,qr=1012,Ql=1013,Vi=1014,xi=1015,bn=1016,ec=1017,tc=1018,_s=1020,lu=35902,cu=35899,hu=1021,uu=1022,Sn=1023,Pr=1026,Ms=1027,bs=1028,nc=1029,fu=1030,ic=1031;var sc=1033,ha=33776,ua=33777,fa=33778,da=33779,rc=35840,oc=35841,ac=35842,lc=35843,cc=36196,hc=37492,uc=37496,fc=37808,dc=37809,pc=37810,mc=37811,gc=37812,xc=37813,vc=37814,yc=37815,_c=37816,Mc=37817,bc=37818,Sc=37819,wc=37820,Ec=37821,Tc=36492,Ac=36494,Rc=36495,Cc=36283,Pc=36284,Ic=36285,Dc=36286;var To=2300,ul=2301,al=2302,Gh=2400,Wh=2401,Xh=2402;var id=3200,sd=3201;var Lc=0,rd=1,vi="",vn="srgb",Hs="srgb-linear",Ao="linear",zt="srgb";var zs=7680;var qh=519,od=512,ad=513,ld=514,du=515,cd=516,hd=517,ud=518,fd=519,Yh=35044,tr=35048;var pu="300 es",Ri=2e3,Ro=2001;var es=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},zn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sf=1234567,bo=Math.PI/180,Ir=180/Math.PI;function Ss(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(zn[n&255]+zn[n>>8&255]+zn[n>>16&255]+zn[n>>24&255]+"-"+zn[e&255]+zn[e>>8&255]+"-"+zn[e>>16&15|64]+zn[e>>24&255]+"-"+zn[t&63|128]+zn[t>>8&255]+"-"+zn[t>>16&255]+zn[t>>24&255]+zn[i&255]+zn[i>>8&255]+zn[i>>16&255]+zn[i>>24&255]).toLowerCase()}function St(n,e,t){return Math.max(e,Math.min(t,n))}function mu(n,e){return(n%e+e)%e}function Qp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function e0(n,e,t){return n!==e?(t-n)/(e-n):0}function So(n,e,t){return(1-t)*n+t*e}function t0(n,e,t,i){return So(n,e,1-Math.exp(-t*i))}function n0(n,e=1){return e-Math.abs(mu(n,e*2)-e)}function i0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function s0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function r0(n,e){return n+Math.floor(Math.random()*(e-n+1))}function o0(n,e){return n+Math.random()*(e-n)}function a0(n){return n*(.5-Math.random())}function l0(n){n!==void 0&&(sf=n);let e=sf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function c0(n){return n*bo}function h0(n){return n*Ir}function u0(n){return(n&n-1)===0&&n!==0}function f0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function d0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function p0(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+i)/2),h=o((e+i)/2),u=r((e-i)/2),d=o((e-i)/2),f=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*h,l*u,l*d,a*c);break;case"YZY":n.set(l*d,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*d,a*h,a*c);break;case"XZX":n.set(a*h,l*g,l*f,a*c);break;case"YXY":n.set(l*f,a*h,l*g,a*c);break;case"ZYZ":n.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Zn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var pa={DEG2RAD:bo,RAD2DEG:Ir,generateUUID:Ss,clamp:St,euclideanModulo:mu,mapLinear:Qp,inverseLerp:e0,lerp:So,damp:t0,pingpong:n0,smoothstep:i0,smootherstep:s0,randInt:r0,randFloat:o0,randFloatSpread:a0,seededRandom:l0,degToRad:c0,radToDeg:h0,isPowerOfTwo:u0,ceilPowerOfTwo:f0,floorPowerOfTwo:d0,setQuaternionFromProperEuler:p0,normalize:Zn,denormalize:Rr},we=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=St(this.x,e.x,t.x),this.y=St(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=St(this.x,e,t),this.y=St(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(St(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(St(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ei=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[o+0],f=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=x;return}if(u!==x||l!==d||c!==f||h!==g){let m=1-a,p=l*d+c*f+h*g+u*x,M=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let E=Math.sqrt(y),R=Math.atan2(E,p*M);m=Math.sin(m*R)/E,a=Math.sin(a*R)/E}let v=a*M;if(l=l*m+d*v,c=c*m+f*v,h=h*m+g*v,u=u*m+x*v,m===1-a){let E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-a*f,e[t+2]=c*g+h*f+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),d=l(i/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>u){let f=2*Math.sqrt(1+i-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-i-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(St(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},k=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),h=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=St(this.x,e.x,t.x),this.y=St(this.y,e.y,t.y),this.z=St(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=St(this.x,e,t),this.y=St(this.y,e,t),this.z=St(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(St(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ph.copy(this).projectOnVector(e),this.sub(ph)}reflect(e){return this.sub(ph.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(St(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ph=new k,rf=new ei,Mt=class n{constructor(e,t,i,s,r,o,a,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],x=s[0],m=s[3],p=s[6],M=s[1],y=s[4],v=s[7],E=s[2],R=s[5],C=s[8];return r[0]=o*x+a*M+l*E,r[3]=o*m+a*y+l*R,r[6]=o*p+a*v+l*C,r[1]=c*x+h*M+u*E,r[4]=c*m+h*y+u*R,r[7]=c*p+h*v+u*C,r[2]=d*x+f*M+g*E,r[5]=d*m+f*y+g*R,r[8]=d*p+f*v+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=t*u+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(s*c-h*i)*x,e[2]=(a*i-s*o)*x,e[3]=d*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=f*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(mh.makeScale(e,t)),this}rotate(e){return this.premultiply(mh.makeRotation(-e)),this}translate(e,t){return this.premultiply(mh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},mh=new Mt;function gu(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Co(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function dd(){let n=Co("canvas");return n.style.display="block",n}var of={};function Dr(n){n in of||(of[n]=!0,console.warn(n))}function pd(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var af=new Mt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lf=new Mt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function m0(){let n={enabled:!0,workingColorSpace:Hs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===zt&&(s.r=ji(s.r),s.g=ji(s.g),s.b=ji(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===zt&&(s.r=Cr(s.r),s.g=Cr(s.g),s.b=Cr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===vi?Ao:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Dr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Dr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Hs]:{primaries:e,whitePoint:i,transfer:Ao,toXYZ:af,fromXYZ:lf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:vn},outputColorSpaceConfig:{drawingBufferColorSpace:vn}},[vn]:{primaries:e,whitePoint:i,transfer:zt,toXYZ:af,fromXYZ:lf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:vn}}}),n}var Dt=m0();function ji(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Cr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var mr,fl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{mr===void 0&&(mr=Co("canvas")),mr.width=e.width,mr.height=e.height;let s=mr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=mr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Co("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ji(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ji(t[i]/255)*255):t[i]=ji(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},g0=0,Lr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=Ss(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(gh(s[o].image)):r.push(gh(s[o]))}else r=gh(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function gh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?fl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var x0=0,xh=new k,$n=class n extends es{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Oi,s=Oi,r=Un,o=gi,a=Sn,l=Jn,c=n.DEFAULT_ANISOTROPY,h=vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:x0++}),this.uuid=Ss(),this.name="",this.source=new Lr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new we(0,0),this.repeat=new we(1,1),this.center=new we(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(xh).x}get height(){return this.source.getSize(xh).y}get depth(){return this.source.getSize(xh).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ru)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hn:e.x=e.x-Math.floor(e.x);break;case Oi:e.x=e.x<0?0:1;break;case hl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hn:e.y=e.y-Math.floor(e.y);break;case Oi:e.y=e.y<0?0:1;break;case hl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};$n.DEFAULT_IMAGE=null;$n.DEFAULT_MAPPING=ru;$n.DEFAULT_ANISOTROPY=1;var Lt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,v=(f+1)/2,E=(p+1)/2,R=(h+d)/4,C=(u+x)/4,P=(g+m)/4;return y>v&&y>E?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=R/i,r=C/i):v>E?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=R/s,r=P/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=C/r,s=P/r),this.set(i,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-x)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=St(this.x,e.x,t.x),this.y=St(this.y,e.y,t.y),this.z=St(this.z,e.z,t.z),this.w=St(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=St(this.x,e,t),this.y=St(this.y,e,t),this.z=St(this.z,e,t),this.w=St(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(St(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},dl=class extends es{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Lt(0,0,e,t),this.scissorTest=!1,this.viewport=new Lt(0,0,e,t);let s={width:e,height:t,depth:i.depth},r=new $n(s);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Un,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Lr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},pn=class extends dl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Po=class extends $n{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var pl=class extends $n{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Pi=class{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Ei):Ei.fromBufferAttribute(r,o),Ei.applyMatrix4(e.matrixWorld),this.expandByPoint(Ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Oa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Oa.copy(i.boundingBox)),Oa.applyMatrix4(e.matrixWorld),this.union(Oa)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ei),Ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(po),za.subVectors(this.max,po),gr.subVectors(e.a,po),xr.subVectors(e.b,po),vr.subVectors(e.c,po),cs.subVectors(xr,gr),hs.subVectors(vr,xr),Ns.subVectors(gr,vr);let t=[0,-cs.z,cs.y,0,-hs.z,hs.y,0,-Ns.z,Ns.y,cs.z,0,-cs.x,hs.z,0,-hs.x,Ns.z,0,-Ns.x,-cs.y,cs.x,0,-hs.y,hs.x,0,-Ns.y,Ns.x,0];return!vh(t,gr,xr,vr,za)||(t=[1,0,0,0,1,0,0,0,1],!vh(t,gr,xr,vr,za))?!1:(Ba.crossVectors(cs,hs),t=[Ba.x,Ba.y,Ba.z],vh(t,gr,xr,vr,za))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},qi=[new k,new k,new k,new k,new k,new k,new k,new k],Ei=new k,Oa=new Pi,gr=new k,xr=new k,vr=new k,cs=new k,hs=new k,Ns=new k,po=new k,za=new k,Ba=new k,Fs=new k;function vh(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Fs.fromArray(n,r);let a=s.x*Math.abs(Fs.x)+s.y*Math.abs(Fs.y)+s.z*Math.abs(Fs.z),l=e.dot(Fs),c=t.dot(Fs),h=i.dot(Fs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var v0=new Pi,mo=new k,yh=new k,Bi=class{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):v0.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mo.subVectors(e,this.center);let t=mo.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(mo,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mo.copy(e.center).add(yh)),this.expandByPoint(mo.copy(e.center).sub(yh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Yi=new k,_h=new k,Ha=new k,us=new k,Mh=new k,Va=new k,bh=new k,Io=class{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Yi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yi.copy(this.origin).addScaledVector(this.direction,t),Yi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){_h.copy(e).add(t).multiplyScalar(.5),Ha.copy(t).sub(e).normalize(),us.copy(this.origin).sub(_h);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Ha),a=us.dot(this.direction),l=-us.dot(Ha),c=us.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let x=1/h;u*=x,d*=x,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(_h).addScaledVector(Ha,d),f}intersectSphere(e,t){Yi.subVectors(e.center,this.origin);let i=Yi.dot(this.direction),s=Yi.dot(Yi)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Yi)!==null}intersectTriangle(e,t,i,s,r){Mh.subVectors(t,e),Va.subVectors(i,e),bh.crossVectors(Mh,Va);let o=this.direction.dot(bh),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;us.subVectors(this.origin,e);let l=a*this.direction.dot(Va.crossVectors(us,Va));if(l<0)return null;let c=a*this.direction.dot(Mh.cross(us));if(c<0||l+c>o)return null;let h=-a*us.dot(bh);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ot=class n{constructor(e,t,i,s,r,o,a,l,c,h,u,d,f,g,x,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,h,u,d,f,g,x,m)}set(e,t,i,s,r,o,a,l,c,h,u,d,f,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/yr.setFromMatrixColumn(e,0).length(),r=1/yr.setFromMatrixColumn(e,1).length(),o=1/yr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-x*c,t[9]=-a*l,t[2]=x-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,g=c*h,x=c*u;t[0]=d+x*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=x+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,g=c*h,x=c*u;t[0]=d-x*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=x-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=x-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-x*u}else if(e.order==="XZY"){let d=o*l,f=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(y0,e,_0)}lookAt(e,t,i){let s=this.elements;return oi.subVectors(e,t),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),fs.crossVectors(i,oi),fs.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),fs.crossVectors(i,oi)),fs.normalize(),Ga.crossVectors(oi,fs),s[0]=fs.x,s[4]=Ga.x,s[8]=oi.x,s[1]=fs.y,s[5]=Ga.y,s[9]=oi.y,s[2]=fs.z,s[6]=Ga.z,s[10]=oi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],x=i[6],m=i[10],p=i[14],M=i[3],y=i[7],v=i[11],E=i[15],R=s[0],C=s[4],P=s[8],b=s[12],S=s[1],I=s[5],L=s[9],N=s[13],W=s[2],V=s[6],z=s[10],X=s[14],q=s[3],ee=s[7],ce=s[11],be=s[15];return r[0]=o*R+a*S+l*W+c*q,r[4]=o*C+a*I+l*V+c*ee,r[8]=o*P+a*L+l*z+c*ce,r[12]=o*b+a*N+l*X+c*be,r[1]=h*R+u*S+d*W+f*q,r[5]=h*C+u*I+d*V+f*ee,r[9]=h*P+u*L+d*z+f*ce,r[13]=h*b+u*N+d*X+f*be,r[2]=g*R+x*S+m*W+p*q,r[6]=g*C+x*I+m*V+p*ee,r[10]=g*P+x*L+m*z+p*ce,r[14]=g*b+x*N+m*X+p*be,r[3]=M*R+y*S+v*W+E*q,r[7]=M*C+y*I+v*V+E*ee,r[11]=M*P+y*L+v*z+E*ce,r[15]=M*b+y*N+v*X+E*be,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*u-s*c*u-r*a*d+i*c*d+s*a*f-i*l*f)+x*(+t*l*f-t*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+t*c*u-t*a*f-r*o*u+i*o*f+r*a*h-i*c*h)+p*(-s*a*h-t*l*u+t*a*d+s*o*u-i*o*d+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],M=u*m*c-x*d*c+x*l*f-a*m*f-u*l*p+a*d*p,y=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,v=h*x*c-g*u*c+g*a*f-o*x*f-h*a*p+o*u*p,E=g*u*l-h*x*l-g*a*d+o*x*d+h*a*m-o*u*m,R=t*M+i*y+s*v+r*E;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/R;return e[0]=M*C,e[1]=(x*d*r-u*m*r-x*s*f+i*m*f+u*s*p-i*d*p)*C,e[2]=(a*m*r-x*l*r+x*s*c-i*m*c-a*s*p+i*l*p)*C,e[3]=(u*l*r-a*d*r-u*s*c+i*d*c+a*s*f-i*l*f)*C,e[4]=y*C,e[5]=(h*m*r-g*d*r+g*s*f-t*m*f-h*s*p+t*d*p)*C,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*C,e[7]=(o*d*r-h*l*r+h*s*c-t*d*c-o*s*f+t*l*f)*C,e[8]=v*C,e[9]=(g*u*r-h*x*r-g*i*f+t*x*f+h*i*p-t*u*p)*C,e[10]=(o*x*r-g*a*r+g*i*c-t*x*c-o*i*p+t*a*p)*C,e[11]=(h*a*r-o*u*r-h*i*c+t*u*c+o*i*f-t*a*f)*C,e[12]=E*C,e[13]=(h*x*s-g*u*s+g*i*d-t*x*d-h*i*m+t*u*m)*C,e[14]=(g*a*s-o*x*s-g*i*l+t*x*l+o*i*m-t*a*m)*C,e[15]=(o*u*s-h*a*s+h*i*l-t*u*l-o*i*d+t*a*d)*C,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,x=o*h,m=o*u,p=a*u,M=l*c,y=l*h,v=l*u,E=i.x,R=i.y,C=i.z;return s[0]=(1-(x+p))*E,s[1]=(f+v)*E,s[2]=(g-y)*E,s[3]=0,s[4]=(f-v)*R,s[5]=(1-(d+p))*R,s[6]=(m+M)*R,s[7]=0,s[8]=(g+y)*C,s[9]=(m-M)*C,s[10]=(1-(d+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=yr.set(s[0],s[1],s[2]).length(),o=yr.set(s[4],s[5],s[6]).length(),a=yr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Ti.copy(this);let c=1/r,h=1/o,u=1/a;return Ti.elements[0]*=c,Ti.elements[1]*=c,Ti.elements[2]*=c,Ti.elements[4]*=h,Ti.elements[5]*=h,Ti.elements[6]*=h,Ti.elements[8]*=u,Ti.elements[9]*=u,Ti.elements[10]*=u,t.setFromRotationMatrix(Ti),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=Ri,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s),g,x;if(l)g=r/(o-r),x=o*r/(o-r);else if(a===Ri)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Ro)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Ri,l=!1){let c=this.elements,h=2/(t-e),u=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s),g,x;if(l)g=1/(o-r),x=o/(o-r);else if(a===Ri)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Ro)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},yr=new k,Ti=new ot,y0=new k(0,0,0),_0=new k(1,1,1),fs=new k,Ga=new k,oi=new k,cf=new ot,hf=new ei,ci=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(St(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-St(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(St(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-St(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(St(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-St(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return cf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cf,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return hf.setFromEuler(this),this.setFromQuaternion(hf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ci.DEFAULT_ORDER="XYZ";var Do=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},M0=0,uf=new k,_r=new ei,Zi=new ot,Wa=new k,go=new k,b0=new k,S0=new ei,ff=new k(1,0,0),df=new k(0,1,0),pf=new k(0,0,1),mf={type:"added"},w0={type:"removed"},Mr={type:"childadded",child:null},Sh={type:"childremoved",child:null},Gt=class n extends es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:M0++}),this.uuid=Ss(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new k,t=new ci,i=new ei,s=new k(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ot},normalMatrix:{value:new Mt}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Do,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _r.setFromAxisAngle(e,t),this.quaternion.multiply(_r),this}rotateOnWorldAxis(e,t){return _r.setFromAxisAngle(e,t),this.quaternion.premultiply(_r),this}rotateX(e){return this.rotateOnAxis(ff,e)}rotateY(e){return this.rotateOnAxis(df,e)}rotateZ(e){return this.rotateOnAxis(pf,e)}translateOnAxis(e,t){return uf.copy(e).applyQuaternion(this.quaternion),this.position.add(uf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ff,e)}translateY(e){return this.translateOnAxis(df,e)}translateZ(e){return this.translateOnAxis(pf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Wa.copy(e):Wa.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),go.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zi.lookAt(go,Wa,this.up):Zi.lookAt(Wa,go,this.up),this.quaternion.setFromRotationMatrix(Zi),s&&(Zi.extractRotation(s.matrixWorld),_r.setFromRotationMatrix(Zi),this.quaternion.premultiply(_r.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(mf),Mr.child=e,this.dispatchEvent(Mr),Mr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(w0),Sh.child=e,this.dispatchEvent(Sh),Sh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(mf),Mr.child=e,this.dispatchEvent(Mr),Mr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,e,b0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,S0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Gt.DEFAULT_UP=new k(0,1,0);Gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ai=new k,$i=new k,wh=new k,Ji=new k,br=new k,Sr=new k,gf=new k,Eh=new k,Th=new k,Ah=new k,Rh=new Lt,Ch=new Lt,Ph=new Lt,ms=class n{constructor(e=new k,t=new k,i=new k){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Ai.subVectors(e,t),s.cross(Ai);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Ai.subVectors(s,t),$i.subVectors(i,t),wh.subVectors(e,t);let o=Ai.dot(Ai),a=Ai.dot($i),l=Ai.dot(wh),c=$i.dot($i),h=$i.dot(wh),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ji)===null?!1:Ji.x>=0&&Ji.y>=0&&Ji.x+Ji.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,Ji)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ji.x),l.addScaledVector(o,Ji.y),l.addScaledVector(a,Ji.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return Rh.setScalar(0),Ch.setScalar(0),Ph.setScalar(0),Rh.fromBufferAttribute(e,t),Ch.fromBufferAttribute(e,i),Ph.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Rh,r.x),o.addScaledVector(Ch,r.y),o.addScaledVector(Ph,r.z),o}static isFrontFacing(e,t,i,s){return Ai.subVectors(i,t),$i.subVectors(e,t),Ai.cross($i).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ai.subVectors(this.c,this.b),$i.subVectors(this.a,this.b),Ai.cross($i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;br.subVectors(s,i),Sr.subVectors(r,i),Eh.subVectors(e,i);let l=br.dot(Eh),c=Sr.dot(Eh);if(l<=0&&c<=0)return t.copy(i);Th.subVectors(e,s);let h=br.dot(Th),u=Sr.dot(Th);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(i).addScaledVector(br,o);Ah.subVectors(e,r);let f=br.dot(Ah),g=Sr.dot(Ah);if(g>=0&&f<=g)return t.copy(r);let x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Sr,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return gf.subVectors(r,s),a=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(gf,a);let p=1/(m+x+d);return o=x*p,a=d*p,t.copy(i).addScaledVector(br,o).addScaledVector(Sr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},md={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ds={h:0,s:0,l:0},Xa={h:0,s:0,l:0};function Ih(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ue=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=vn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Dt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Dt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Dt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Dt.workingColorSpace){if(e=mu(e,1),t=St(t,0,1),i=St(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Ih(o,r,e+1/3),this.g=Ih(o,r,e),this.b=Ih(o,r,e-1/3)}return Dt.colorSpaceToWorking(this,s),this}setStyle(e,t=vn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=vn){let i=md[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}copyLinearToSRGB(e){return this.r=Cr(e.r),this.g=Cr(e.g),this.b=Cr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=vn){return Dt.workingToColorSpace(Bn.copy(this),e),Math.round(St(Bn.r*255,0,255))*65536+Math.round(St(Bn.g*255,0,255))*256+Math.round(St(Bn.b*255,0,255))}getHexString(e=vn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Dt.workingColorSpace){Dt.workingToColorSpace(Bn.copy(this),t);let i=Bn.r,s=Bn.g,r=Bn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Dt.workingColorSpace){return Dt.workingToColorSpace(Bn.copy(this),t),e.r=Bn.r,e.g=Bn.g,e.b=Bn.b,e}getStyle(e=vn){Dt.workingToColorSpace(Bn.copy(this),e);let t=Bn.r,i=Bn.g,s=Bn.b;return e!==vn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ds),this.setHSL(ds.h+e,ds.s+t,ds.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ds),e.getHSL(Xa);let i=So(ds.h,Xa.h,t),s=So(ds.s,Xa.s,t),r=So(ds.l,Xa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Bn=new Ue;Ue.NAMES=md;var E0=0,ts=class extends es{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=Ss(),this.name="",this.type="Material",this.blending=Qi,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=cl,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zs,this.stencilZFail=zs,this.stencilZPass=zs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Qi&&(i.blending=this.blending),this.side!==Ci&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ll&&(i.blendSrc=this.blendSrc),this.blendDst!==cl&&(i.blendDst=this.blendDst),this.blendEquation!==li&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Bs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==zs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==zs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==zs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},cn=class extends ts{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ci,this.combine=su,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ki=T0();function T0(){let n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function A0(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=St(n,-65504,65504),Ki.floatView[0]=n;let e=Ki.uint32View[0],t=e>>23&511;return Ki.baseTable[t]+((e&8388607)>>Ki.shiftTable[t])}function R0(n){let e=n>>10;return Ki.uint32View[0]=Ki.mantissaTable[Ki.offsetTable[e]+(n&1023)]+Ki.exponentTable[e],Ki.floatView[0]}var Lo=class{static toHalfFloat(e){return A0(e)}static fromHalfFloat(e){return R0(e)}},gn=new k,qa=new we,C0=0,Nt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:C0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Yh,this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)qa.fromBufferAttribute(this,t),qa.applyMatrix3(e),this.setXY(t,qa.x,qa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyMatrix3(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyMatrix4(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyNormalMatrix(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.transformDirection(e),this.setXYZ(t,gn.x,gn.y,gn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Rr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Rr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Zn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Rr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Zn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Rr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Zn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Rr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Zn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Zn(t,this.array),i=Zn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Zn(t,this.array),i=Zn(i,this.array),s=Zn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Zn(t,this.array),i=Zn(i,this.array),s=Zn(s,this.array),r=Zn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Yh&&(e.usage=this.usage),e}};var Vs=class extends Nt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Uo=class extends Nt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var tt=class extends Nt{constructor(e,t,i){super(new Float32Array(e),t,i)}},P0=0,mi=new ot,Dh=new Gt,wr=new k,ai=new Pi,xo=new Pi,In=new k,Tt=class n extends es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:P0++}),this.uuid=Ss(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gu(e)?Uo:Vs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Mt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return mi.makeRotationFromQuaternion(e),this.applyMatrix4(mi),this}rotateX(e){return mi.makeRotationX(e),this.applyMatrix4(mi),this}rotateY(e){return mi.makeRotationY(e),this.applyMatrix4(mi),this}rotateZ(e){return mi.makeRotationZ(e),this.applyMatrix4(mi),this}translate(e,t,i){return mi.makeTranslation(e,t,i),this.applyMatrix4(mi),this}scale(e,t,i){return mi.makeScale(e,t,i),this.applyMatrix4(mi),this}lookAt(e){return Dh.lookAt(e),Dh.updateMatrix(),this.applyMatrix4(Dh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wr).negate(),this.translate(wr.x,wr.y,wr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new tt(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];ai.setFromBufferAttribute(r),this.morphTargetsRelative?(In.addVectors(this.boundingBox.min,ai.min),this.boundingBox.expandByPoint(In),In.addVectors(this.boundingBox.max,ai.max),this.boundingBox.expandByPoint(In)):(this.boundingBox.expandByPoint(ai.min),this.boundingBox.expandByPoint(ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){let i=this.boundingSphere.center;if(ai.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];xo.setFromBufferAttribute(a),this.morphTargetsRelative?(In.addVectors(ai.min,xo.min),ai.expandByPoint(In),In.addVectors(ai.max,xo.max),ai.expandByPoint(In)):(ai.expandByPoint(xo.min),ai.expandByPoint(xo.max))}ai.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)In.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(In));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)In.fromBufferAttribute(a,c),l&&(wr.fromBufferAttribute(e,c),In.add(wr)),s=Math.max(s,i.distanceToSquared(In))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<i.count;P++)a[P]=new k,l[P]=new k;let c=new k,h=new k,u=new k,d=new we,f=new we,g=new we,x=new k,m=new k;function p(P,b,S){c.fromBufferAttribute(i,P),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,S),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,S),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),a[P].add(x),a[b].add(x),a[S].add(x),l[P].add(m),l[b].add(m),l[S].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let P=0,b=M.length;P<b;++P){let S=M[P],I=S.start,L=S.count;for(let N=I,W=I+L;N<W;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let y=new k,v=new k,E=new k,R=new k;function C(P){E.fromBufferAttribute(s,P),R.copy(E);let b=a[P];y.copy(b),y.sub(E.multiplyScalar(E.dot(b))).normalize(),v.crossVectors(R,b);let I=v.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,I)}for(let P=0,b=M.length;P<b;++P){let S=M[P],I=S.start,L=S.count;for(let N=I,W=I+L;N<W;N+=3)C(e.getX(N+0)),C(e.getX(N+1)),C(e.getX(N+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new k,r=new k,o=new k,a=new k,l=new k,c=new k,h=new k,u=new k;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)In.fromBufferAttribute(e,t),In.normalize(),e.setXYZ(t,In.x,In.y,In.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Nt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,i);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},xf=new ot,ks=new Io,Ya=new Bi,vf=new k,Za=new k,$a=new k,Ja=new k,Lh=new k,Ka=new k,yf=new k,ja=new k,rt=class extends Gt{constructor(e=new Tt,t=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ka.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Lh.fromBufferAttribute(u,e),o?Ka.addScaledVector(Lh,h):Ka.addScaledVector(Lh.sub(t),h))}t.add(Ka)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ya.copy(i.boundingSphere),Ya.applyMatrix4(r),ks.copy(e.ray).recast(e.near),!(Ya.containsPoint(ks.origin)===!1&&(ks.intersectSphere(Ya,vf)===null||ks.origin.distanceToSquared(vf)>(e.far-e.near)**2))&&(xf.copy(r).invert(),ks.copy(e.ray).applyMatrix4(xf),!(i.boundingBox!==null&&ks.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ks)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=M,E=y;v<E;v+=3){let R=a.getX(v),C=a.getX(v+1),P=a.getX(v+2);s=Qa(this,p,e,i,c,h,u,R,C,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let M=a.getX(m),y=a.getX(m+1),v=a.getX(m+2);s=Qa(this,o,e,i,c,h,u,M,y,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=M,E=y;v<E;v+=3){let R=v,C=v+1,P=v+2;s=Qa(this,p,e,i,c,h,u,R,C,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let M=m,y=m+1,v=m+2;s=Qa(this,o,e,i,c,h,u,M,y,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function I0(n,e,t,i,s,r,o,a){let l;if(e.side===_n?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Ci,a),l===null)return null;ja.copy(a),ja.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(ja);return c<t.near||c>t.far?null:{distance:c,point:ja.clone(),object:n}}function Qa(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,Za),n.getVertexPosition(l,$a),n.getVertexPosition(c,Ja);let h=I0(n,e,t,i,Za,$a,Ja,yf);if(h){let u=new k;ms.getBarycoord(yf,Za,$a,Ja,u),s&&(h.uv=ms.getInterpolatedAttribute(s,a,l,c,u,new we)),r&&(h.uv1=ms.getInterpolatedAttribute(r,a,l,c,u,new we)),o&&(h.normal=ms.getInterpolatedAttribute(o,a,l,c,u,new k),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new k,materialIndex:0};ms.getNormal(Za,$a,Ja,d.normal),h.face=d,h.barycoord=u}return h}var Wt=class n extends Tt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new tt(c,3)),this.setAttribute("normal",new tt(h,3)),this.setAttribute("uv",new tt(u,2));function g(x,m,p,M,y,v,E,R,C,P,b){let S=v/C,I=E/P,L=v/2,N=E/2,W=R/2,V=C+1,z=P+1,X=0,q=0,ee=new k;for(let ce=0;ce<z;ce++){let be=ce*I-N;for(let Ce=0;Ce<V;Ce++){let Fe=Ce*S-L;ee[x]=Fe*M,ee[m]=be*y,ee[p]=W,c.push(ee.x,ee.y,ee.z),ee[x]=0,ee[m]=0,ee[p]=R>0?1:-1,h.push(ee.x,ee.y,ee.z),u.push(Ce/C),u.push(1-ce/P),X+=1}}for(let ce=0;ce<P;ce++)for(let be=0;be<C;be++){let Ce=d+be+V*ce,Fe=d+be+V*(ce+1),Be=d+(be+1)+V*(ce+1),ke=d+(be+1)+V*ce;l.push(Ce,Fe,ke),l.push(Fe,Be,ke),q+=6}a.addGroup(f,q,b),f+=q,d+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function nr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Vn(n){let e={};for(let t=0;t<n.length;t++){let i=nr(n[t]);for(let s in i)e[s]=i[s]}return e}function D0(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function xu(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Dt.workingColorSpace}var Kn={clone:nr,merge:Vn},L0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,U0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vt=class extends ts{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=L0,this.fragmentShader=U0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=nr(e.uniforms),this.uniformsGroups=D0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},No=class extends Gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=Ri,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ps=new k,_f=new we,Mf=new we,Ln=class extends No{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ir*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(bo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ir*2*Math.atan(Math.tan(bo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ps.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ps.x,ps.y).multiplyScalar(-e/ps.z),ps.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ps.x,ps.y).multiplyScalar(-e/ps.z)}getViewSize(e,t){return this.getViewBounds(e,_f,Mf),t.subVectors(Mf,_f)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(bo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Er=-90,Tr=1,ml=class extends Gt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ln(Er,Tr,e,t);s.layers=this.layers,this.add(s);let r=new Ln(Er,Tr,e,t);r.layers=this.layers,this.add(r);let o=new Ln(Er,Tr,e,t);o.layers=this.layers,this.add(o);let a=new Ln(Er,Tr,e,t);a.layers=this.layers,this.add(a);let l=new Ln(Er,Tr,e,t);l.layers=this.layers,this.add(l);let c=new Ln(Er,Tr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Ri)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ro)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Fo=class extends $n{constructor(e=[],t=Qs,i,s,r,o,a,l,c,h){super(e,t,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},gl=class extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Fo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Wt(5,5,5),r=new vt({name:"CubemapFromEquirect",uniforms:nr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:_n,blending:xn});r.uniforms.tEquirect.value=t;let o=new rt(s,r),a=t.minFilter;return t.minFilter===gi&&(t.minFilter=Un),new ml(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},Jt=class extends Gt{constructor(){super(),this.isGroup=!0,this.type="Group"}},N0={type:"move"},Ur=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,i),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Jt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}};var ko=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Ue(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Nr=class extends Gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ci,this.environmentIntensity=1,this.environmentRotation=new ci,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var bf=new k,Sf=new Lt,wf=new Lt,F0=new k,Ef=new ot,el=new k,Uh=new Bi,Tf=new ot,Nh=new Io,Oo=class extends rt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Vh,this.bindMatrix=new ot,this.bindMatrixInverse=new ot,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Pi),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,el),this.boundingBox.expandByPoint(el)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Bi),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,el),this.boundingSphere.expandByPoint(el)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Uh.copy(this.boundingSphere),Uh.applyMatrix4(s),e.ray.intersectsSphere(Uh)!==!1&&(Tf.copy(s).invert(),Nh.copy(e.ray).applyMatrix4(Tf),!(this.boundingBox!==null&&Nh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Nh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Lt,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Vh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===td?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,s=this.geometry;Sf.fromBufferAttribute(s.attributes.skinIndex,e),wf.fromBufferAttribute(s.attributes.skinWeight,e),bf.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=wf.getComponent(r);if(o!==0){let a=Sf.getComponent(r);Ef.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(F0.copy(bf).applyMatrix4(Ef),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},Fr=class extends Gt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Nn=class extends $n{constructor(e=null,t=1,i=1,s,r,o,a,l,c=yn,h=yn,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Af=new ot,k0=new ot,zo=class n{constructor(e=[],t=[]){this.uuid=Ss(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new ot)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new ot;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:k0;Af.multiplyMatrices(a,t[r]),Af.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new Nn(t,e,e,Sn,xi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){let r=e.bones[i],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Fr),this.bones.push(o),this.boneInverses.push(new ot().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=i[s];e.boneInverses.push(a.toArray())}return e}},gs=class extends Nt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ar=new ot,Rf=new ot,tl=[],Cf=new Pi,O0=new ot,vo=new rt,yo=new Bi,an=class extends rt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new gs(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,O0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Pi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ar),Cf.copy(e.boundingBox).applyMatrix4(Ar),this.boundingBox.union(Cf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Bi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ar),yo.copy(e.boundingSphere).applyMatrix4(Ar),this.boundingSphere.union(yo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(vo.geometry=this.geometry,vo.material=this.material,vo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(i),e.ray.intersectsSphere(yo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ar),Rf.multiplyMatrices(i,Ar),vo.matrixWorld=Rf,vo.raycast(e,tl);for(let o=0,a=tl.length;o<a;o++){let l=tl[o];l.instanceId=r,l.object=this,t.push(l)}tl.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new gs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Nn(new Float32Array(s*this.count),s,this.count,bs,xi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fh=new k,z0=new k,B0=new Mt,ki=class{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Fh.subVectors(i,t).cross(z0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Fh),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||B0.getNormalMatrix(e),s=this.coplanarPoint(Fh).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Os=new Bi,H0=new we(.5,.5),nl=new k,kr=class{constructor(e=new ki,t=new ki,i=new ki,s=new ki,r=new ki,o=new ki){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ri,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],x=r[9],m=r[10],p=r[11],M=r[12],y=r[13],v=r[14],E=r[15];if(s[0].setComponents(c-o,f-h,p-g,E-M).normalize(),s[1].setComponents(c+o,f+h,p+g,E+M).normalize(),s[2].setComponents(c+a,f+u,p+x,E+y).normalize(),s[3].setComponents(c-a,f-u,p-x,E-y).normalize(),i)s[4].setComponents(l,d,m,v).normalize(),s[5].setComponents(c-l,f-d,p-m,E-v).normalize();else if(s[4].setComponents(c-l,f-d,p-m,E-v).normalize(),t===Ri)s[5].setComponents(c+l,f+d,p+m,E+v).normalize();else if(t===Ro)s[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Os.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Os.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Os)}intersectsSprite(e){Os.center.set(0,0,0);let t=H0.distanceTo(e.center);return Os.radius=.7071067811865476+t,Os.applyMatrix4(e.matrixWorld),this.intersectsSphere(Os)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(nl.x=s.normal.x>0?e.max.x:e.min.x,nl.y=s.normal.y>0?e.max.y:e.min.y,nl.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(nl)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Or=class extends $n{constructor(e,t,i,s,r,o,a,l,c){super(e,t,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ns=class extends $n{constructor(e,t,i=Vi,s,r,o,a=yn,l=yn,c,h=Pr,u=1){if(h!==Pr&&h!==Ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Lr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Bo=class extends $n{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Gs=class n extends Tt{constructor(e=1,t=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:s,heightSegments:r},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,g=i*2+r,x=s+1,m=new k,p=new k;for(let M=0;M<=g;M++){let y=0,v=0,E=0,R=0;if(M<=i){let b=M/i,S=b*Math.PI/2;v=-h-e*Math.cos(S),E=e*Math.sin(S),R=-e*Math.cos(S),y=b*u}else if(M<=i+r){let b=(M-i)/r;v=-h+b*t,E=e,R=0,y=u+b*d}else{let b=(M-i-r)/i,S=b*Math.PI/2;v=h+e*Math.sin(S),E=e*Math.cos(S),R=e*Math.sin(S),y=u+d+b*u}let C=Math.max(0,Math.min(1,y/f)),P=0;M===0?P=.5/s:M===g&&(P=-.5/s);for(let b=0;b<=s;b++){let S=b/s,I=S*Math.PI*2,L=Math.sin(I),N=Math.cos(I);p.x=-E*N,p.y=v,p.z=E*L,a.push(p.x,p.y,p.z),m.set(-E*N,R,E*L),m.normalize(),l.push(m.x,m.y,m.z),c.push(S+P,C)}if(M>0){let b=(M-1)*x;for(let S=0;S<s;S++){let I=b+S,L=b+S+1,N=M*x+S,W=M*x+S+1;o.push(I,L,N),o.push(L,W,N)}}}this.setIndex(o),this.setAttribute("position",new tt(a,3)),this.setAttribute("normal",new tt(l,3)),this.setAttribute("uv",new tt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}};var Dn=class n extends Tt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,x=[],m=i/2,p=0;M(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new tt(u,3)),this.setAttribute("normal",new tt(d,3)),this.setAttribute("uv",new tt(f,2));function M(){let v=new k,E=new k,R=0,C=(t-e)/i;for(let P=0;P<=r;P++){let b=[],S=P/r,I=S*(t-e)+e;for(let L=0;L<=s;L++){let N=L/s,W=N*l+a,V=Math.sin(W),z=Math.cos(W);E.x=I*V,E.y=-S*i+m,E.z=I*z,u.push(E.x,E.y,E.z),v.set(V,C,z).normalize(),d.push(v.x,v.y,v.z),f.push(N,1-S),b.push(g++)}x.push(b)}for(let P=0;P<s;P++)for(let b=0;b<r;b++){let S=x[b][P],I=x[b+1][P],L=x[b+1][P+1],N=x[b][P+1];(e>0||b!==0)&&(h.push(S,I,N),R+=3),(t>0||b!==r-1)&&(h.push(I,L,N),R+=3)}c.addGroup(p,R,0),p+=R}function y(v){let E=g,R=new we,C=new k,P=0,b=v===!0?e:t,S=v===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,m*S,0),d.push(0,S,0),f.push(.5,.5),g++;let I=g;for(let L=0;L<=s;L++){let W=L/s*l+a,V=Math.cos(W),z=Math.sin(W);C.x=b*z,C.y=m*S,C.z=b*V,u.push(C.x,C.y,C.z),d.push(0,S,0),R.x=V*.5+.5,R.y=z*.5*S+.5,f.push(R.x,R.y),g++}for(let L=0;L<s;L++){let N=E+L,W=I+L;v===!0?h.push(W,W+1,N):h.push(W+1,W,N),P+=3}c.addGroup(p,P,v===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},is=class n extends Dn{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},zr=class n extends Tt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new tt(r,3)),this.setAttribute("normal",new tt(r.slice(),3)),this.setAttribute("uv",new tt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let y=new k,v=new k,E=new k;for(let R=0;R<t.length;R+=3)f(t[R+0],y),f(t[R+1],v),f(t[R+2],E),l(y,v,E,M)}function l(M,y,v,E){let R=E+1,C=[];for(let P=0;P<=R;P++){C[P]=[];let b=M.clone().lerp(v,P/R),S=y.clone().lerp(v,P/R),I=R-P;for(let L=0;L<=I;L++)L===0&&P===R?C[P][L]=b:C[P][L]=b.clone().lerp(S,L/I)}for(let P=0;P<R;P++)for(let b=0;b<2*(R-P)-1;b++){let S=Math.floor(b/2);b%2===0?(d(C[P][S+1]),d(C[P+1][S]),d(C[P][S])):(d(C[P][S+1]),d(C[P+1][S+1]),d(C[P+1][S]))}}function c(M){let y=new k;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(M),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){let M=new k;for(let y=0;y<r.length;y+=3){M.x=r[y+0],M.y=r[y+1],M.z=r[y+2];let v=m(M)/2/Math.PI+.5,E=p(M)/Math.PI+.5;o.push(v,1-E)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){let y=o[M+0],v=o[M+2],E=o[M+4],R=Math.max(y,v,E),C=Math.min(y,v,E);R>.9&&C<.1&&(y<.2&&(o[M+0]+=1),v<.2&&(o[M+2]+=1),E<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,y){let v=M*3;y.x=e[v+0],y.y=e[v+1],y.z=e[v+2]}function g(){let M=new k,y=new k,v=new k,E=new k,R=new we,C=new we,P=new we;for(let b=0,S=0;b<r.length;b+=9,S+=6){M.set(r[b+0],r[b+1],r[b+2]),y.set(r[b+3],r[b+4],r[b+5]),v.set(r[b+6],r[b+7],r[b+8]),R.set(o[S+0],o[S+1]),C.set(o[S+2],o[S+3]),P.set(o[S+4],o[S+5]),E.copy(M).add(y).add(v).divideScalar(3);let I=m(E);x(R,S+0,M,I),x(C,S+2,y,I),x(P,S+4,v,I)}}function x(M,y,v,E){E<0&&M.x===1&&(o[y]=M.x-1),v.x===0&&v.z===0&&(o[y]=E/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}},Ho=class n extends zr{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var hi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(r-1);let h=i[s],d=i[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new we:new k);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new k,s=[],r=[],o=[],a=new k,l=new ot;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new k)}r[0]=new k,o[0]=new k;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(St(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(St(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Br=class extends hi{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new we){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},xl=class extends Br{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function vu(){let n=0,e=0,t=0,i=0;function s(r,o,a,l){n=r,e=a,t=-3*r+3*o-2*a-l,i=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var il=new k,kh=new vu,Oh=new vu,zh=new vu,Ws=class extends hi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new k){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(il.subVectors(s[0],s[1]).add(s[0]),c=il);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(il.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=il),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),kh.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,x,m),Oh.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,x,m),zh.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(kh.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Oh.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),zh.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(kh.calc(l),Oh.calc(l),zh.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new k().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Pf(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,l=n*a;return(2*t-2*i+r+o)*l+(-3*t+3*i-2*r-o)*a+r*n+t}function V0(n,e){let t=1-n;return t*t*e}function G0(n,e){return 2*(1-n)*n*e}function W0(n,e){return n*n*e}function wo(n,e,t,i){return V0(n,e)+G0(n,t)+W0(n,i)}function X0(n,e){let t=1-n;return t*t*t*e}function q0(n,e){let t=1-n;return 3*t*t*n*e}function Y0(n,e){return 3*(1-n)*n*n*e}function Z0(n,e){return n*n*n*e}function Eo(n,e,t,i,s){return X0(n,e)+q0(n,t)+Y0(n,i)+Z0(n,s)}var Vo=class extends hi{constructor(e=new we,t=new we,i=new we,s=new we){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new we){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Eo(e,s.x,r.x,o.x,a.x),Eo(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},vl=class extends hi{constructor(e=new k,t=new k,i=new k,s=new k){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new k){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Eo(e,s.x,r.x,o.x,a.x),Eo(e,s.y,r.y,o.y,a.y),Eo(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Go=class extends hi{constructor(e=new we,t=new we){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new we){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new we){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yl=class extends hi{constructor(e=new k,t=new k){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new k){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new k){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wo=class extends hi{constructor(e=new we,t=new we,i=new we){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new we){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(wo(e,s.x,r.x,o.x),wo(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Xo=class extends hi{constructor(e=new k,t=new k,i=new k){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new k){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(wo(e,s.x,r.x,o.x),wo(e,s.y,r.y,o.y),wo(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qo=class extends hi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new we){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(Pf(a,l.x,c.x,h.x,u.x),Pf(a,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new we().fromArray(s))}return this}},_l=Object.freeze({__proto__:null,ArcCurve:xl,CatmullRomCurve3:Ws,CubicBezierCurve:Vo,CubicBezierCurve3:vl,EllipseCurve:Br,LineCurve:Go,LineCurve3:yl,QuadraticBezierCurve:Wo,QuadraticBezierCurve3:Xo,SplineCurve:qo}),Ml=class extends hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _l[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new _l[s.type]().fromJSON(s))}return this}},Xs=class extends Ml{constructor(e){super(),this.type="Path",this.currentPoint=new we,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new Go(this.currentPoint.clone(),new we(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let r=new Wo(this.currentPoint.clone(),new we(e,t),new we(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,o){let a=new Vo(this.currentPoint.clone(),new we(e,t),new we(i,s),new we(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new qo(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,s,r,o),this}absarc(e,t,i,s,r,o){return this.absellipse(e,t,i,i,s,r,o),this}ellipse(e,t,i,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,s,r,o,a,l),this}absellipse(e,t,i,s,r,o,a,l){let c=new Br(e,t,i,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},xs=class extends Xs{constructor(e){super(e),this.uuid=Ss(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(new Xs().fromJSON(s))}return this}};function $0(n,e,t=2){let i=e&&e.length,s=i?e[0]*t:n.length,r=gd(n,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(i&&(r=em(n,e,r,t)),n.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=t;d<s;d+=t){let f=n[d],g=n[d+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Yo(r,o,t,a,l,c,0),o}function gd(n,e,t,i,s){let r;if(s===um(n,e,t,i)>0)for(let o=e;o<t;o+=i)r=If(o/i|0,n[o],n[o+1],r);else for(let o=t-i;o>=e;o-=i)r=If(o/i|0,n[o],n[o+1],r);return r&&Hr(r,r.next)&&($o(r),r=r.next),r}function qs(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Hr(t,t.next)||on(t.prev,t,t.next)===0)){if($o(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Yo(n,e,t,i,s,r,o){if(!n)return;!o&&r&&rm(n,i,s,r);let a=n;for(;n.prev!==n.next;){let l=n.prev,c=n.next;if(r?K0(n,i,s,r):J0(n)){e.push(l.i,n.i,c.i),$o(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=j0(qs(n),e),Yo(n,e,t,i,s,r,2)):o===2&&Q0(n,e,t,i,s,r):Yo(qs(n),e,t,i,s,r,1);break}}}function J0(n){let e=n.prev,t=n,i=n.next;if(on(e,t,i)>=0)return!1;let s=e.x,r=t.x,o=i.x,a=e.y,l=t.y,c=i.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c),g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Mo(s,a,r,l,o,c,g.x,g.y)&&on(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function K0(n,e,t,i){let s=n.prev,r=n,o=n.next;if(on(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,l,c),g=Math.min(h,u,d),x=Math.max(a,l,c),m=Math.max(h,u,d),p=Zh(f,g,e,t,i),M=Zh(x,m,e,t,i),y=n.prevZ,v=n.nextZ;for(;y&&y.z>=p&&v&&v.z<=M;){if(y.x>=f&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Mo(a,h,l,u,c,d,y.x,y.y)&&on(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=f&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Mo(a,h,l,u,c,d,v.x,v.y)&&on(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Mo(a,h,l,u,c,d,y.x,y.y)&&on(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=M;){if(v.x>=f&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Mo(a,h,l,u,c,d,v.x,v.y)&&on(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function j0(n,e){let t=n;do{let i=t.prev,s=t.next.next;!Hr(i,s)&&vd(i,t,t.next,s)&&Zo(i,s)&&Zo(s,i)&&(e.push(i.i,t.i,s.i),$o(t),$o(t.next),t=n=s),t=t.next}while(t!==n);return qs(t)}function Q0(n,e,t,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&lm(o,a)){let l=yd(o,a);o=qs(o,o.next),l=qs(l,l.next),Yo(o,e,t,i,s,r,0),Yo(l,e,t,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function em(n,e,t,i){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*i,l=r<o-1?e[r+1]*i:n.length,c=gd(n,a,l,i,!1);c===c.next&&(c.steiner=!0),s.push(am(c))}s.sort(tm);for(let r=0;r<s.length;r++)t=nm(s[r],t);return t}function tm(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function nm(n,e){let t=im(n,e);if(!t)return e;let i=yd(t,n);return qs(i,i.next),qs(t,t.next)}function im(n,e){let t=e,i=n.x,s=n.y,r=-1/0,o;if(Hr(n,t))return t;do{if(Hr(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===i))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&xd(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){let u=Math.abs(s-t.y)/(i-t.x);Zo(t,n)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&sm(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function sm(n,e){return on(n.prev,n,e.prev)<0&&on(e.next,n,n.next)<0}function rm(n,e,t,i){let s=n;do s.z===0&&(s.z=Zh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,om(s)}function om(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=o}r.nextZ=null,t*=2}while(e>1);return n}function Zh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function am(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function xd(n,e,t,i,s,r,o,a){return(s-o)*(e-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(i-a)}function Mo(n,e,t,i,s,r,o,a){return!(n===o&&e===a)&&xd(n,e,t,i,s,r,o,a)}function lm(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!cm(n,e)&&(Zo(n,e)&&Zo(e,n)&&hm(n,e)&&(on(n.prev,n,e.prev)||on(n,e.prev,e))||Hr(n,e)&&on(n.prev,n,n.next)>0&&on(e.prev,e,e.next)>0)}function on(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Hr(n,e){return n.x===e.x&&n.y===e.y}function vd(n,e,t,i){let s=rl(on(n,e,t)),r=rl(on(n,e,i)),o=rl(on(t,i,n)),a=rl(on(t,i,e));return!!(s!==r&&o!==a||s===0&&sl(n,t,e)||r===0&&sl(n,i,e)||o===0&&sl(t,n,i)||a===0&&sl(t,e,i))}function sl(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function rl(n){return n>0?1:n<0?-1:0}function cm(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&vd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Zo(n,e){return on(n.prev,n,n.next)<0?on(n,e,n.next)>=0&&on(n,n.prev,e)>=0:on(n,e,n.prev)<0||on(n,n.next,e)<0}function hm(n,e){let t=n,i=!1,s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function yd(n,e){let t=$h(n.i,n.x,n.y),i=$h(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function If(n,e,t,i){let s=$h(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function $o(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function $h(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function um(n,e,t,i){let s=0;for(let r=e,o=t-i;r<t;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Jh=class{static triangulate(e,t,i=2){return $0(e,t,i)}},zi=class n{static area(e){let t=e.length,i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],s=[],r=[];Df(e),Lf(i,e);let o=e.length;t.forEach(Df);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Lf(i,t[l]);let a=Jh.triangulate(i,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Df(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Lf(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}var Jo=class n extends Tt{constructor(e=new xs([new we(.5,.5),new we(-.5,.5),new we(-.5,-.5),new we(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new tt(s,3)),this.setAttribute("uv",new tt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:fm,y,v=!1,E,R,C,P;p&&(y=p.getSpacedPoints(h),v=!0,d=!1,E=p.computeFrenetFrames(h,!1),R=new k,C=new k,P=new k),d||(m=0,f=0,g=0,x=0);let b=a.extractPoints(c),S=b.shape,I=b.holes;if(!zi.isClockWise(S)){S=S.reverse();for(let H=0,B=I.length;H<B;H++){let $=I[H];zi.isClockWise($)&&(I[H]=$.reverse())}}function N(H){let $=10000000000000001e-36,Y=H[0];for(let K=1;K<=H.length;K++){let se=K%H.length,fe=H[se],Ae=fe.x-Y.x,Ie=fe.y-Y.y,D=Ae*Ae+Ie*Ie,T=Math.max(Math.abs(fe.x),Math.abs(fe.y),Math.abs(Y.x),Math.abs(Y.y)),j=$*T*T;if(D<=j){H.splice(se,1),K--;continue}Y=fe}}N(S),I.forEach(N);let W=I.length,V=S;for(let H=0;H<W;H++){let B=I[H];S=S.concat(B)}function z(H,B,$){return B||console.error("THREE.ExtrudeGeometry: vec does not exist"),H.clone().addScaledVector(B,$)}let X=S.length;function q(H,B,$){let Y,K,se,fe=H.x-B.x,Ae=H.y-B.y,Ie=$.x-H.x,D=$.y-H.y,T=fe*fe+Ae*Ae,j=fe*D-Ae*Ie;if(Math.abs(j)>Number.EPSILON){let he=Math.sqrt(T),Me=Math.sqrt(Ie*Ie+D*D),de=B.x-Ae/he,$e=B.y+fe/he,Re=$.x-D/Me,qe=$.y+Ie/Me,Ge=((Re-de)*D-(qe-$e)*Ie)/(fe*D-Ae*Ie);Y=de+fe*Ge-H.x,K=$e+Ae*Ge-H.y;let Te=Y*Y+K*K;if(Te<=2)return new we(Y,K);se=Math.sqrt(Te/2)}else{let he=!1;fe>Number.EPSILON?Ie>Number.EPSILON&&(he=!0):fe<-Number.EPSILON?Ie<-Number.EPSILON&&(he=!0):Math.sign(Ae)===Math.sign(D)&&(he=!0),he?(Y=-Ae,K=fe,se=Math.sqrt(T)):(Y=fe,K=Ae,se=Math.sqrt(T/2))}return new we(Y/se,K/se)}let ee=[];for(let H=0,B=V.length,$=B-1,Y=H+1;H<B;H++,$++,Y++)$===B&&($=0),Y===B&&(Y=0),ee[H]=q(V[H],V[$],V[Y]);let ce=[],be,Ce=ee.concat();for(let H=0,B=W;H<B;H++){let $=I[H];be=[];for(let Y=0,K=$.length,se=K-1,fe=Y+1;Y<K;Y++,se++,fe++)se===K&&(se=0),fe===K&&(fe=0),be[Y]=q($[Y],$[se],$[fe]);ce.push(be),Ce=Ce.concat(be)}let Fe;if(m===0)Fe=zi.triangulateShape(V,I);else{let H=[],B=[];for(let $=0;$<m;$++){let Y=$/m,K=f*Math.cos(Y*Math.PI/2),se=g*Math.sin(Y*Math.PI/2)+x;for(let fe=0,Ae=V.length;fe<Ae;fe++){let Ie=z(V[fe],ee[fe],se);ve(Ie.x,Ie.y,-K),Y===0&&H.push(Ie)}for(let fe=0,Ae=W;fe<Ae;fe++){let Ie=I[fe];be=ce[fe];let D=[];for(let T=0,j=Ie.length;T<j;T++){let he=z(Ie[T],be[T],se);ve(he.x,he.y,-K),Y===0&&D.push(he)}Y===0&&B.push(D)}}Fe=zi.triangulateShape(H,B)}let Be=Fe.length,ke=g+x;for(let H=0;H<X;H++){let B=d?z(S[H],Ce[H],ke):S[H];v?(C.copy(E.normals[0]).multiplyScalar(B.x),R.copy(E.binormals[0]).multiplyScalar(B.y),P.copy(y[0]).add(C).add(R),ve(P.x,P.y,P.z)):ve(B.x,B.y,0)}for(let H=1;H<=h;H++)for(let B=0;B<X;B++){let $=d?z(S[B],Ce[B],ke):S[B];v?(C.copy(E.normals[H]).multiplyScalar($.x),R.copy(E.binormals[H]).multiplyScalar($.y),P.copy(y[H]).add(C).add(R),ve(P.x,P.y,P.z)):ve($.x,$.y,u/h*H)}for(let H=m-1;H>=0;H--){let B=H/m,$=f*Math.cos(B*Math.PI/2),Y=g*Math.sin(B*Math.PI/2)+x;for(let K=0,se=V.length;K<se;K++){let fe=z(V[K],ee[K],Y);ve(fe.x,fe.y,u+$)}for(let K=0,se=I.length;K<se;K++){let fe=I[K];be=ce[K];for(let Ae=0,Ie=fe.length;Ae<Ie;Ae++){let D=z(fe[Ae],be[Ae],Y);v?ve(D.x,D.y+y[h-1].y,y[h-1].x+$):ve(D.x,D.y,u+$)}}}ne(),ie();function ne(){let H=s.length/3;if(d){let B=0,$=X*B;for(let Y=0;Y<Be;Y++){let K=Fe[Y];Se(K[2]+$,K[1]+$,K[0]+$)}B=h+m*2,$=X*B;for(let Y=0;Y<Be;Y++){let K=Fe[Y];Se(K[0]+$,K[1]+$,K[2]+$)}}else{for(let B=0;B<Be;B++){let $=Fe[B];Se($[2],$[1],$[0])}for(let B=0;B<Be;B++){let $=Fe[B];Se($[0]+X*h,$[1]+X*h,$[2]+X*h)}}i.addGroup(H,s.length/3-H,0)}function ie(){let H=s.length/3,B=0;ge(V,B),B+=V.length;for(let $=0,Y=I.length;$<Y;$++){let K=I[$];ge(K,B),B+=K.length}i.addGroup(H,s.length/3-H,1)}function ge(H,B){let $=H.length;for(;--$>=0;){let Y=$,K=$-1;K<0&&(K=H.length-1);for(let se=0,fe=h+m*2;se<fe;se++){let Ae=X*se,Ie=X*(se+1),D=B+Y+Ae,T=B+K+Ae,j=B+K+Ie,he=B+Y+Ie;Ze(D,T,j,he)}}}function ve(H,B,$){l.push(H),l.push(B),l.push($)}function Se(H,B,$){ht(H),ht(B),ht($);let Y=s.length/3,K=M.generateTopUV(i,s,Y-3,Y-2,Y-1);O(K[0]),O(K[1]),O(K[2])}function Ze(H,B,$,Y){ht(H),ht(B),ht(Y),ht(B),ht($),ht(Y);let K=s.length/3,se=M.generateSideWallUV(i,s,K-6,K-3,K-2,K-1);O(se[0]),O(se[1]),O(se[3]),O(se[1]),O(se[2]),O(se[3])}function ht(H){s.push(l[H*3+0]),s.push(l[H*3+1]),s.push(l[H*3+2])}function O(H){r.push(H.x),r.push(H.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return dm(t,i,e)}static fromJSON(e,t){let i=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];i.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new _l[s.type]().fromJSON(s)),new n(i,e.options)}},fm={generateTopUV:function(n,e,t,i,s){let r=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[s*3],h=e[s*3+1];return[new we(r,o),new we(a,l),new we(c,h)]},generateSideWallUV:function(n,e,t,i,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],u=e[i*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],x=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new we(o,1-l),new we(c,1-u),new we(d,1-g),new we(x,1-p)]:[new we(a,1-l),new we(h,1-u),new we(f,1-g),new we(m,1-p)]}};function dm(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Ii=class n extends zr{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},Ko=class n extends Tt{constructor(e=[new we(0,-.5),new we(.5,0),new we(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=St(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new k,d=new we,f=new k,g=new k,x=new k,m=0,p=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-m,f.z=p*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(g)}for(let M=0;M<=t;M++){let y=i+M*h*s,v=Math.sin(y),E=Math.cos(y);for(let R=0;R<=e.length-1;R++){u.x=e[R].x*v,u.y=e[R].y,u.z=e[R].x*E,o.push(u.x,u.y,u.z),d.x=M/t,d.y=R/(e.length-1),a.push(d.x,d.y);let C=l[3*R+0]*v,P=l[3*R+1],b=l[3*R+0]*E;c.push(C,P,b)}}for(let M=0;M<t;M++)for(let y=0;y<e.length-1;y++){let v=y+M*e.length,E=v,R=v+e.length,C=v+e.length+1,P=v+1;r.push(E,R,P),r.push(C,P,R)}this.setIndex(r),this.setAttribute("position",new tt(o,3)),this.setAttribute("uv",new tt(a,2)),this.setAttribute("normal",new tt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}},ss=class n extends zr{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},mn=class n extends Tt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let M=p*d-o;for(let y=0;y<c;y++){let v=y*u-r;g.push(v,-M,0),x.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let y=M+c*p,v=M+c*(p+1),E=M+1+c*(p+1),R=M+1+c*p;f.push(y,v,R),f.push(v,E,R)}this.setIndex(f),this.setAttribute("position",new tt(g,3)),this.setAttribute("normal",new tt(x,3)),this.setAttribute("uv",new tt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Ys=class n extends Tt{constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=e,d=(t-e)/s,f=new k,g=new we;for(let x=0;x<=s;x++){for(let m=0;m<=i;m++){let p=r+m/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let x=0;x<s;x++){let m=x*(i+1);for(let p=0;p<i;p++){let M=p+m,y=M,v=M+i+1,E=M+i+2,R=M+1;a.push(y,v,R),a.push(v,E,R)}}this.setIndex(a),this.setAttribute("position",new tt(l,3)),this.setAttribute("normal",new tt(c,3)),this.setAttribute("uv",new tt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},jo=class n extends Tt{constructor(e=new xs([new we(0,.5),new we(-.5,-.5),new we(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(i),this.setAttribute("position",new tt(s,3)),this.setAttribute("normal",new tt(r,3)),this.setAttribute("uv",new tt(o,2));function c(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,g=d.holes;zi.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let M=g[m];zi.isClockWise(M)===!0&&(g[m]=M.reverse())}let x=zi.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let M=g[m];f=f.concat(M)}for(let m=0,p=f.length;m<p;m++){let M=f[m];s.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=x.length;m<p;m++){let M=x[m],y=M[0]+u,v=M[1]+u,E=M[2]+u;i.push(y,v,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return pm(t,e)}static fromJSON(e,t){let i=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];i.push(o)}return new n(i,e.curveSegments)}};function pm(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){let s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}var ti=class n extends Tt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new k,d=new k,f=[],g=[],x=[],m=[];for(let p=0;p<=i;p++){let M=[],y=p/i,v=0;p===0&&o===0?v=.5/t:p===i&&l===Math.PI&&(v=-.5/t);for(let E=0;E<=t;E++){let R=E/t;u.x=-e*Math.cos(s+R*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(s+R*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(R+v,1-y),M.push(c++)}h.push(M)}for(let p=0;p<i;p++)for(let M=0;M<t;M++){let y=h[p][M+1],v=h[p][M],E=h[p+1][M],R=h[p+1][M+1];(p!==0||o>0)&&f.push(y,v,R),(p!==i-1||l<Math.PI)&&f.push(v,E,R)}this.setIndex(f),this.setAttribute("position",new tt(g,3)),this.setAttribute("normal",new tt(x,3)),this.setAttribute("uv",new tt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Zs=class n extends Tt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new k,u=new k,d=new k;for(let f=0;f<=i;f++)for(let g=0;g<=s;g++){let x=g/s*r,m=f/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(x),u.y=(e+t*Math.cos(m))*Math.sin(x),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=s;g++){let x=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,M=(s+1)*f+g;o.push(x,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new tt(a,3)),this.setAttribute("normal",new tt(l,3)),this.setAttribute("uv",new tt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Vr=class n extends Tt{constructor(e=new Xo(new k(-1,-1,0),new k(-1,1,0),new k(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new k,l=new k,c=new we,h=new k,u=[],d=[],f=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new tt(u,3)),this.setAttribute("normal",new tt(d,3)),this.setAttribute("uv",new tt(f,2));function x(){for(let y=0;y<t;y++)m(y);m(r===!1?t:0),M(),p()}function m(y){h=e.getPointAt(y/t,h);let v=o.normals[y],E=o.binormals[y];for(let R=0;R<=s;R++){let C=R/s*Math.PI*2,P=Math.sin(C),b=-Math.cos(C);l.x=b*v.x+P*E.x,l.y=b*v.y+P*E.y,l.z=b*v.z+P*E.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+i*l.x,a.y=h.y+i*l.y,a.z=h.z+i*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let y=1;y<=t;y++)for(let v=1;v<=s;v++){let E=(s+1)*(y-1)+(v-1),R=(s+1)*y+(v-1),C=(s+1)*y+v,P=(s+1)*(y-1)+v;g.push(E,R,P),g.push(R,C,P)}}function M(){for(let y=0;y<=t;y++)for(let v=0;v<=s;v++)c.x=y/t,c.y=v/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new _l[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var Qo=class extends vt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Kt=class extends ts{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lc,this.normalScale=new we(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ci,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$s=class extends Kt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new we(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return St(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ea=class extends ts{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lc,this.normalScale=new we(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};var bl=class extends ts{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=id,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sl=class extends ts{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ol(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function mm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var Js=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},wl=class extends Js{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Gh,endingEnd:Gh}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Wh:r=e,a=2*t-i;break;case Xh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Wh:o=e,l=2*i-t;break;case Xh:o=1,l=i+s[1]-s[0];break;default:o=e-1,l=t}let c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(i-t)/(s-t),x=g*g,m=x*g,p=-d*m+2*d*x-d*g,M=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,y=(-1-f)*m+(1.5+f)*x+.5*g,v=f*m-f*x;for(let E=0;E!==a;++E)r[E]=p*o[h+E]+M*o[c+E]+y*o[l+E]+v*o[u+E];return r}},El=class extends Js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(i-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Tl=class extends Js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ui=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ol(t,this.TimeBufferType),this.values=ol(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ol(e.times,Array),values:ol(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Tl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new El(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new wl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case To:t=this.InterpolantFactoryMethodDiscrete;break;case ul:t=this.InterpolantFactoryMethodLinear;break;case al:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return To;case this.InterpolantFactoryMethodLinear:return ul;case this.InterpolantFactoryMethodSmooth:return al}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&mm(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===al,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*i,d=u-i,f=u+i;for(let g=0;g!==i;++g){let x=t[u+g];if(x!==t[d+g]||x!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*i,d=o*i;for(let f=0;f!==i;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ui.prototype.ValueTypeName="";ui.prototype.TimeBufferType=Float32Array;ui.prototype.ValueBufferType=Float32Array;ui.prototype.DefaultInterpolation=ul;var vs=class extends ui{constructor(e,t,i){super(e,t,i)}};vs.prototype.ValueTypeName="bool";vs.prototype.ValueBufferType=Array;vs.prototype.DefaultInterpolation=To;vs.prototype.InterpolantFactoryMethodLinear=void 0;vs.prototype.InterpolantFactoryMethodSmooth=void 0;var Al=class extends ui{constructor(e,t,i,s){super(e,t,i,s)}};Al.prototype.ValueTypeName="color";var Rl=class extends ui{constructor(e,t,i,s){super(e,t,i,s)}};Rl.prototype.ValueTypeName="number";var Cl=class extends Js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)ei.slerpFlat(r,0,o,c-a,o,c,l);return r}},ta=class extends ui{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Cl(this.times,this.values,this.getValueSize(),e)}};ta.prototype.ValueTypeName="quaternion";ta.prototype.InterpolantFactoryMethodSmooth=void 0;var ys=class extends ui{constructor(e,t,i){super(e,t,i)}};ys.prototype.ValueTypeName="string";ys.prototype.ValueBufferType=Array;ys.prototype.DefaultInterpolation=To;ys.prototype.InterpolantFactoryMethodLinear=void 0;ys.prototype.InterpolantFactoryMethodSmooth=void 0;var Pl=class extends ui{constructor(e,t,i,s){super(e,t,i,s)}};Pl.prototype.ValueTypeName="vector";var Il=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},_d=new Il,Dl=class{constructor(e){this.manager=e!==void 0?e:_d,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Dl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Gr=class extends Gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},na=class extends Gr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Bh=new ot,Uf=new k,Nf=new k,Ll=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new we(512,512),this.mapType=Jn,this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kr,this._frameExtents=new we(1,1),this._viewportCount=1,this._viewports=[new Lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Uf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Uf),Nf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nf),t.updateMatrixWorld(),Bh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Bh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Ff=new ot,_o=new k,Hh=new k,Kh=class extends Ll{constructor(){super(new Ln(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new we(4,2),this._viewportCount=6,this._viewports=[new Lt(2,1,1,1),new Lt(0,1,1,1),new Lt(3,1,1,1),new Lt(1,1,1,1),new Lt(3,0,1,1),new Lt(1,0,1,1)],this._cubeDirections=[new k(1,0,0),new k(-1,0,0),new k(0,0,1),new k(0,0,-1),new k(0,1,0),new k(0,-1,0)],this._cubeUps=[new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,0,1),new k(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),_o.setFromMatrixPosition(e.matrixWorld),i.position.copy(_o),Hh.copy(i.position),Hh.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Hh),i.updateMatrixWorld(),s.makeTranslation(-_o.x,-_o.y,-_o.z),Ff.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ff,i.coordinateSystem,i.reversedDepth)}},ia=class extends Gr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Kh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Ks=class extends No{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},jh=class extends Ll{constructor(){super(new Ks(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Wr=class extends Gr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.target=new Gt,this.shadow=new jh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var sa=class extends Tt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var Ul=class extends Ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ra=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var yu="\\[\\]\\.:\\/",gm=new RegExp("["+yu+"]","g"),_u="[^"+yu+"]",xm="[^"+yu.replace("\\.","")+"]",vm=/((?:WC+[\/:])*)/.source.replace("WC",_u),ym=/(WCOD+)?/.source.replace("WCOD",xm),_m=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_u),Mm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_u),bm=new RegExp("^"+vm+ym+_m+Mm+"$"),Sm=["material","materials","bones","map"],Qh=class{constructor(e,t,i){let s=i||en.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},en=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(gm,"")}static parseTrackName(e){let t=bm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Sm.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};en.Composite=Qh;en.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};en.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};en.prototype.GetterByBindingType=[en.prototype._getValue_direct,en.prototype._getValue_array,en.prototype._getValue_arrayElement,en.prototype._getValue_toArray];en.prototype.SetterByBindingTypeAndVersioning=[[en.prototype._setValue_direct,en.prototype._setValue_direct_setNeedsUpdate,en.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[en.prototype._setValue_array,en.prototype._setValue_array_setNeedsUpdate,en.prototype._setValue_array_setMatrixWorldNeedsUpdate],[en.prototype._setValue_arrayElement,en.prototype._setValue_arrayElement_setNeedsUpdate,en.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[en.prototype._setValue_fromArray,en.prototype._setValue_fromArray_setNeedsUpdate,en.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var f_=new Float32Array(1);function Mu(n,e,t,i){let s=wm(i);switch(t){case hu:return n*e;case bs:return n*e/s.components*s.byteLength;case nc:return n*e/s.components*s.byteLength;case fu:return n*e*2/s.components*s.byteLength;case ic:return n*e*2/s.components*s.byteLength;case uu:return n*e*3/s.components*s.byteLength;case Sn:return n*e*4/s.components*s.byteLength;case sc:return n*e*4/s.components*s.byteLength;case ha:case ua:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case fa:case da:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case oc:case lc:return Math.max(n,16)*Math.max(e,8)/4;case rc:case ac:return Math.max(n,8)*Math.max(e,8)/2;case cc:case hc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case uc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case fc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case dc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case pc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case mc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case gc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case xc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case vc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case yc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case _c:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Mc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case bc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Sc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case wc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ec:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Tc:case Ac:case Rc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Cc:case Pc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ic:case Dc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function wm(n){switch(n){case Jn:case ou:return{byteLength:1,components:1};case qr:case au:case bn:return{byteLength:2,components:1};case ec:case tc:return{byteLength:2,components:4};case Vi:case Ql:case xi:return{byteLength:4,components:1};case lu:case cu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Wd(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Im(n){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],x=u[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let x=u[f];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Dm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Um=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Nm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,km=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Om=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,zm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Hm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Gm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Xm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,qm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ym=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$m=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Km=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,tg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ng=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ig=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,sg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,og=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ag=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lg="gl_FragColor = linearToOutputTexel( gl_FragColor );",cg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ug=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,yg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,_g=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,bg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,wg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Eg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ag=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Rg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Pg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ig=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Dg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Lg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ug=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ng=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Og=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Hg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Zg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$g=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Jg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,e1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,t1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,n1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,i1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,s1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,r1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,o1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,a1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,l1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,c1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,h1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,u1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,f1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,d1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,p1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,m1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,g1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,x1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,v1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,y1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,M1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,b1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,S1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,w1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,E1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,T1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,A1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,R1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,C1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,P1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,I1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,D1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,L1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,F1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,O1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,z1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,B1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,H1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,V1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,G1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,W1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,X1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,q1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Y1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Z1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,J1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,j1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Q1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ex=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ix=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ox=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ax=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,cx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,At={alphahash_fragment:Dm,alphahash_pars_fragment:Lm,alphamap_fragment:Um,alphamap_pars_fragment:Nm,alphatest_fragment:Fm,alphatest_pars_fragment:km,aomap_fragment:Om,aomap_pars_fragment:zm,batching_pars_vertex:Bm,batching_vertex:Hm,begin_vertex:Vm,beginnormal_vertex:Gm,bsdfs:Wm,iridescence_fragment:Xm,bumpmap_pars_fragment:qm,clipping_planes_fragment:Ym,clipping_planes_pars_fragment:Zm,clipping_planes_pars_vertex:$m,clipping_planes_vertex:Jm,color_fragment:Km,color_pars_fragment:jm,color_pars_vertex:Qm,color_vertex:eg,common:tg,cube_uv_reflection_fragment:ng,defaultnormal_vertex:ig,displacementmap_pars_vertex:sg,displacementmap_vertex:rg,emissivemap_fragment:og,emissivemap_pars_fragment:ag,colorspace_fragment:lg,colorspace_pars_fragment:cg,envmap_fragment:hg,envmap_common_pars_fragment:ug,envmap_pars_fragment:fg,envmap_pars_vertex:dg,envmap_physical_pars_fragment:wg,envmap_vertex:pg,fog_vertex:mg,fog_pars_vertex:gg,fog_fragment:xg,fog_pars_fragment:vg,gradientmap_pars_fragment:yg,lightmap_pars_fragment:_g,lights_lambert_fragment:Mg,lights_lambert_pars_fragment:bg,lights_pars_begin:Sg,lights_toon_fragment:Eg,lights_toon_pars_fragment:Tg,lights_phong_fragment:Ag,lights_phong_pars_fragment:Rg,lights_physical_fragment:Cg,lights_physical_pars_fragment:Pg,lights_fragment_begin:Ig,lights_fragment_maps:Dg,lights_fragment_end:Lg,logdepthbuf_fragment:Ug,logdepthbuf_pars_fragment:Ng,logdepthbuf_pars_vertex:Fg,logdepthbuf_vertex:kg,map_fragment:Og,map_pars_fragment:zg,map_particle_fragment:Bg,map_particle_pars_fragment:Hg,metalnessmap_fragment:Vg,metalnessmap_pars_fragment:Gg,morphinstance_vertex:Wg,morphcolor_vertex:Xg,morphnormal_vertex:qg,morphtarget_pars_vertex:Yg,morphtarget_vertex:Zg,normal_fragment_begin:$g,normal_fragment_maps:Jg,normal_pars_fragment:Kg,normal_pars_vertex:jg,normal_vertex:Qg,normalmap_pars_fragment:e1,clearcoat_normal_fragment_begin:t1,clearcoat_normal_fragment_maps:n1,clearcoat_pars_fragment:i1,iridescence_pars_fragment:s1,opaque_fragment:r1,packing:o1,premultiplied_alpha_fragment:a1,project_vertex:l1,dithering_fragment:c1,dithering_pars_fragment:h1,roughnessmap_fragment:u1,roughnessmap_pars_fragment:f1,shadowmap_pars_fragment:d1,shadowmap_pars_vertex:p1,shadowmap_vertex:m1,shadowmask_pars_fragment:g1,skinbase_vertex:x1,skinning_pars_vertex:v1,skinning_vertex:y1,skinnormal_vertex:_1,specularmap_fragment:M1,specularmap_pars_fragment:b1,tonemapping_fragment:S1,tonemapping_pars_fragment:w1,transmission_fragment:E1,transmission_pars_fragment:T1,uv_pars_fragment:A1,uv_pars_vertex:R1,uv_vertex:C1,worldpos_vertex:P1,background_vert:I1,background_frag:D1,backgroundCube_vert:L1,backgroundCube_frag:U1,cube_vert:N1,cube_frag:F1,depth_vert:k1,depth_frag:O1,distanceRGBA_vert:z1,distanceRGBA_frag:B1,equirect_vert:H1,equirect_frag:V1,linedashed_vert:G1,linedashed_frag:W1,meshbasic_vert:X1,meshbasic_frag:q1,meshlambert_vert:Y1,meshlambert_frag:Z1,meshmatcap_vert:$1,meshmatcap_frag:J1,meshnormal_vert:K1,meshnormal_frag:j1,meshphong_vert:Q1,meshphong_frag:ex,meshphysical_vert:tx,meshphysical_frag:nx,meshtoon_vert:ix,meshtoon_frag:sx,points_vert:rx,points_frag:ox,shadow_vert:ax,shadow_frag:lx,sprite_vert:cx,sprite_frag:hx},Ye={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Mt},alphaMap:{value:null},alphaMapTransform:{value:new Mt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Mt}},envmap:{envMap:{value:null},envMapRotation:{value:new Mt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Mt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Mt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Mt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Mt},normalScale:{value:new we(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Mt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Mt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Mt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Mt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Mt},alphaTest:{value:0},uvTransform:{value:new Mt}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new we(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Mt},alphaMap:{value:null},alphaMapTransform:{value:new Mt},alphaTest:{value:0}}},Gi={basic:{uniforms:Vn([Ye.common,Ye.specularmap,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.fog]),vertexShader:At.meshbasic_vert,fragmentShader:At.meshbasic_frag},lambert:{uniforms:Vn([Ye.common,Ye.specularmap,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.fog,Ye.lights,{emissive:{value:new Ue(0)}}]),vertexShader:At.meshlambert_vert,fragmentShader:At.meshlambert_frag},phong:{uniforms:Vn([Ye.common,Ye.specularmap,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.fog,Ye.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:At.meshphong_vert,fragmentShader:At.meshphong_frag},standard:{uniforms:Vn([Ye.common,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.roughnessmap,Ye.metalnessmap,Ye.fog,Ye.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag},toon:{uniforms:Vn([Ye.common,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.gradientmap,Ye.fog,Ye.lights,{emissive:{value:new Ue(0)}}]),vertexShader:At.meshtoon_vert,fragmentShader:At.meshtoon_frag},matcap:{uniforms:Vn([Ye.common,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.fog,{matcap:{value:null}}]),vertexShader:At.meshmatcap_vert,fragmentShader:At.meshmatcap_frag},points:{uniforms:Vn([Ye.points,Ye.fog]),vertexShader:At.points_vert,fragmentShader:At.points_frag},dashed:{uniforms:Vn([Ye.common,Ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:At.linedashed_vert,fragmentShader:At.linedashed_frag},depth:{uniforms:Vn([Ye.common,Ye.displacementmap]),vertexShader:At.depth_vert,fragmentShader:At.depth_frag},normal:{uniforms:Vn([Ye.common,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,{opacity:{value:1}}]),vertexShader:At.meshnormal_vert,fragmentShader:At.meshnormal_frag},sprite:{uniforms:Vn([Ye.sprite,Ye.fog]),vertexShader:At.sprite_vert,fragmentShader:At.sprite_frag},background:{uniforms:{uvTransform:{value:new Mt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:At.background_vert,fragmentShader:At.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Mt}},vertexShader:At.backgroundCube_vert,fragmentShader:At.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:At.cube_vert,fragmentShader:At.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:At.equirect_vert,fragmentShader:At.equirect_frag},distanceRGBA:{uniforms:Vn([Ye.common,Ye.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:At.distanceRGBA_vert,fragmentShader:At.distanceRGBA_frag},shadow:{uniforms:Vn([Ye.lights,Ye.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:At.shadow_vert,fragmentShader:At.shadow_frag}};Gi.physical={uniforms:Vn([Gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Mt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Mt},clearcoatNormalScale:{value:new we(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Mt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Mt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Mt},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Mt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Mt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Mt},transmissionSamplerSize:{value:new we},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Mt},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Mt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Mt},anisotropyVector:{value:new we},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Mt}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag};var Uc={r:0,b:0,g:0},ir=new ci,ux=new ot;function fx(n,e,t,i,s,r,o){let a=new Ue(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function x(y){let v=!1,E=g(y);E===null?p(a,l):E&&E.isColor&&(p(E,1),v=!0);let R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,v){let E=g(v);E&&(E.isCubeTexture||E.mapping===la)?(h===void 0&&(h=new rt(new Wt(1,1,1),new vt({name:"BackgroundCubeMaterial",uniforms:nr(Gi.backgroundCube.uniforms),vertexShader:Gi.backgroundCube.vertexShader,fragmentShader:Gi.backgroundCube.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,C,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ir.copy(v.backgroundRotation),ir.x*=-1,ir.y*=-1,ir.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ir.y*=-1,ir.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(ux.makeRotationFromEuler(ir)),h.material.toneMapped=Dt.getTransfer(E.colorSpace)!==zt,(u!==E||d!==E.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=E,d=E.version,f=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new rt(new mn(2,2),new vt({name:"BackgroundMaterial",uniforms:nr(Gi.background.uniforms),vertexShader:Gi.background.vertexShader,fragmentShader:Gi.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Dt.getTransfer(E.colorSpace)!==zt,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||d!==E.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=E,d=E.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,v){y.getRGB(Uc,xu(n)),i.buffers.color.setClear(Uc.r,Uc.g,Uc.b,v,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:x,addToRenderList:m,dispose:M}}function dx(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,o=!1;function a(S,I,L,N,W){let V=!1,z=u(N,L,I);r!==z&&(r=z,c(r.object)),V=f(S,N,L,W),V&&g(S,N,L,W),W!==null&&e.update(W,n.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,v(S,I,L,N),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return n.createVertexArray()}function c(S){return n.bindVertexArray(S)}function h(S){return n.deleteVertexArray(S)}function u(S,I,L){let N=L.wireframe===!0,W=i[S.id];W===void 0&&(W={},i[S.id]=W);let V=W[I.id];V===void 0&&(V={},W[I.id]=V);let z=V[N];return z===void 0&&(z=d(l()),V[N]=z),z}function d(S){let I=[],L=[],N=[];for(let W=0;W<t;W++)I[W]=0,L[W]=0,N[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:L,attributeDivisors:N,object:S,attributes:{},index:null}}function f(S,I,L,N){let W=r.attributes,V=I.attributes,z=0,X=L.getAttributes();for(let q in X)if(X[q].location>=0){let ce=W[q],be=V[q];if(be===void 0&&(q==="instanceMatrix"&&S.instanceMatrix&&(be=S.instanceMatrix),q==="instanceColor"&&S.instanceColor&&(be=S.instanceColor)),ce===void 0||ce.attribute!==be||be&&ce.data!==be.data)return!0;z++}return r.attributesNum!==z||r.index!==N}function g(S,I,L,N){let W={},V=I.attributes,z=0,X=L.getAttributes();for(let q in X)if(X[q].location>=0){let ce=V[q];ce===void 0&&(q==="instanceMatrix"&&S.instanceMatrix&&(ce=S.instanceMatrix),q==="instanceColor"&&S.instanceColor&&(ce=S.instanceColor));let be={};be.attribute=ce,ce&&ce.data&&(be.data=ce.data),W[q]=be,z++}r.attributes=W,r.attributesNum=z,r.index=N}function x(){let S=r.newAttributes;for(let I=0,L=S.length;I<L;I++)S[I]=0}function m(S){p(S,0)}function p(S,I){let L=r.newAttributes,N=r.enabledAttributes,W=r.attributeDivisors;L[S]=1,N[S]===0&&(n.enableVertexAttribArray(S),N[S]=1),W[S]!==I&&(n.vertexAttribDivisor(S,I),W[S]=I)}function M(){let S=r.newAttributes,I=r.enabledAttributes;for(let L=0,N=I.length;L<N;L++)I[L]!==S[L]&&(n.disableVertexAttribArray(L),I[L]=0)}function y(S,I,L,N,W,V,z){z===!0?n.vertexAttribIPointer(S,I,L,W,V):n.vertexAttribPointer(S,I,L,N,W,V)}function v(S,I,L,N){x();let W=N.attributes,V=L.getAttributes(),z=I.defaultAttributeValues;for(let X in V){let q=V[X];if(q.location>=0){let ee=W[X];if(ee===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(ee=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(ee=S.instanceColor)),ee!==void 0){let ce=ee.normalized,be=ee.itemSize,Ce=e.get(ee);if(Ce===void 0)continue;let Fe=Ce.buffer,Be=Ce.type,ke=Ce.bytesPerElement,ne=Be===n.INT||Be===n.UNSIGNED_INT||ee.gpuType===Ql;if(ee.isInterleavedBufferAttribute){let ie=ee.data,ge=ie.stride,ve=ee.offset;if(ie.isInstancedInterleavedBuffer){for(let Se=0;Se<q.locationSize;Se++)p(q.location+Se,ie.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Se=0;Se<q.locationSize;Se++)m(q.location+Se);n.bindBuffer(n.ARRAY_BUFFER,Fe);for(let Se=0;Se<q.locationSize;Se++)y(q.location+Se,be/q.locationSize,Be,ce,ge*ke,(ve+be/q.locationSize*Se)*ke,ne)}else{if(ee.isInstancedBufferAttribute){for(let ie=0;ie<q.locationSize;ie++)p(q.location+ie,ee.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ie=0;ie<q.locationSize;ie++)m(q.location+ie);n.bindBuffer(n.ARRAY_BUFFER,Fe);for(let ie=0;ie<q.locationSize;ie++)y(q.location+ie,be/q.locationSize,Be,ce,be*ke,be/q.locationSize*ie*ke,ne)}}else if(z!==void 0){let ce=z[X];if(ce!==void 0)switch(ce.length){case 2:n.vertexAttrib2fv(q.location,ce);break;case 3:n.vertexAttrib3fv(q.location,ce);break;case 4:n.vertexAttrib4fv(q.location,ce);break;default:n.vertexAttrib1fv(q.location,ce)}}}}M()}function E(){P();for(let S in i){let I=i[S];for(let L in I){let N=I[L];for(let W in N)h(N[W].object),delete N[W];delete I[L]}delete i[S]}}function R(S){if(i[S.id]===void 0)return;let I=i[S.id];for(let L in I){let N=I[L];for(let W in N)h(N[W].object),delete N[W];delete I[L]}delete i[S.id]}function C(S){for(let I in i){let L=i[I];if(L[S.id]===void 0)continue;let N=L[S.id];for(let W in N)h(N[W].object),delete N[W];delete L[S.id]}}function P(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:R,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function px(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,i,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*d[x];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function mx(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Sn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let P=C===bn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Jn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==xi&&!P)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:E,maxSamples:R}}function gx(n){let e=this,t=null,i=0,s=!1,r=!1,o=new ki,a=new Mt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:i,y=M*4,v=p.clippingState||null;l.value=v,v=h(g,d,y,f);for(let E=0;E!==y;++E)v[E]=t[E];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=f+x*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,v=f;y!==x;++y,v+=4)o.copy(u[y]).applyMatrix4(M,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function xx(n){let e=new WeakMap;function t(o,a){return a===Jl?o.mapping=Qs:a===Kl&&(o.mapping=er),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Jl||a===Kl)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new gl(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var Zr=4,Md=[.125,.215,.35,.446,.526,.582],or=20,bu=new Ks,bd=new Ue,Su=null,wu=0,Eu=0,Tu=!1,rr=(1+Math.sqrt(5))/2,Yr=1/rr,Sd=[new k(-rr,Yr,0),new k(rr,Yr,0),new k(-Yr,0,rr),new k(Yr,0,rr),new k(0,rr,-Yr),new k(0,rr,Yr),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)],vx=new k,Jr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=vx}=r;Su=this._renderer.getRenderTarget(),wu=this._renderer.getActiveCubeFace(),Eu=this._renderer.getActiveMipmapLevel(),Tu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Td(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Su,wu,Eu),this._renderer.xr.enabled=Tu,e.scissorTest=!1,Nc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qs||e.mapping===er?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Su=this._renderer.getRenderTarget(),wu=this._renderer.getActiveCubeFace(),Eu=this._renderer.getActiveMipmapLevel(),Tu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Un,minFilter:Un,generateMipmaps:!1,type:bn,format:Sn,colorSpace:Hs,depthBuffer:!1},s=wd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wd(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yx(r)),this._blurMaterial=_x(r,e,t)}return s}_compileMaterial(e){let t=new rt(this._lodPlanes[0],e);this._renderer.compile(t,bu)}_sceneToCubeUV(e,t,i,s,r){let l=new Ln(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(bd),u.toneMapping=rs,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new cn({name:"PMREM.Background",side:_n,depthWrite:!1,depthTest:!1}),m=new rt(new Wt,x),p=!1,M=e.background;M?M.isColor&&(x.color.copy(M),e.background=null,p=!0):(x.color.copy(bd),p=!0);for(let y=0;y<6;y++){let v=y%3;v===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):v===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));let E=this._cubeSize;Nc(s,v*E,y>2?E:0,E,E),u.setRenderTarget(s),p&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Qs||e.mapping===er;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Td()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ed());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new rt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Nc(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,bu)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Sd[(s-r-1)%Sd.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new rt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*or-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):or;m>or&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${or}`);let p=[],M=0;for(let C=0;C<or;++C){let P=C/x,b=Math.exp(-P*P/2);p.push(b),C===0?M+=b:C<m&&(M+=2*b)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-i;let v=this._sizeLods[s],E=3*v*(s>y-Zr?s-y+Zr:0),R=4*(this._cubeSize-v);Nc(t,E,R,3*v,2*v),l.setRenderTarget(t),l.render(u,bu)}};function yx(n){let e=[],t=[],i=[],s=n,r=n-Zr+1+Md.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>n-Zr?l=Md[o-n+Zr-1]:o===0&&(l=0),i.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,x=3,m=2,p=1,M=new Float32Array(x*g*f),y=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let R=0;R<f;R++){let C=R%3*2/3-1,P=R>2?0:-1,b=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];M.set(b,x*g*R),y.set(d,m*g*R);let S=[R,R,R,R,R,R];v.set(S,p*g*R)}let E=new Tt;E.setAttribute("position",new Nt(M,x)),E.setAttribute("uv",new Nt(y,m)),E.setAttribute("faceIndex",new Nt(v,p)),e.push(E),s>Zr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function wd(n,e,t){let i=new pn(n,e,t);return i.texture.mapping=la,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Nc(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function _x(n,e,t){let i=new Float32Array(or),s=new k(0,1,0);return new vt({name:"SphericalGaussianBlur",defines:{n:or,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:xn,depthTest:!1,depthWrite:!1})}function Ed(){return new vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:xn,depthTest:!1,depthWrite:!1})}function Td(){return new vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xn,depthTest:!1,depthWrite:!1})}function Fu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Mx(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let l=a.mapping,c=l===Jl||l===Kl,h=l===Qs||l===er;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Jr(n)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Jr(n)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function bx(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Dr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Sx(n,e,t,i){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,g=u.attributes.position,x=0;if(f!==null){let M=f.array;x=f.version;for(let y=0,v=M.length;y<v;y+=3){let E=M[y+0],R=M[y+1],C=M[y+2];d.push(E,R,R,C,C,E)}}else if(g!==void 0){let M=g.array;x=g.version;for(let y=0,v=M.length/3-1;y<v;y+=3){let E=y+0,R=y+1,C=y+2;d.push(E,R,R,C,C,E)}}else return;let m=new(gu(d)?Uo:Vs)(d,1);m.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function wx(n,e,t){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,r,d*o),t.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,r,d*o,g),t.update(f,i,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function u(d,f,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,x,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M]*x[M];t.update(p,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Ex(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Tx(n,e,t){let i=new WeakMap,s=new Lt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(a);if(d===void 0||d.count!==u){let b=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],y=0;f===!0&&(y=1),g===!0&&(y=2),x===!0&&(y=3);let v=a.attributes.position.count*y,E=1;v>e.maxTextureSize&&(E=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let R=new Float32Array(v*E*4*u),C=new Po(R,v,E,u);C.type=xi,C.needsUpdate=!0;let P=y*4;for(let S=0;S<u;S++){let I=m[S],L=p[S],N=M[S],W=v*E*4*S;for(let V=0;V<I.count;V++){let z=V*P;f===!0&&(s.fromBufferAttribute(I,V),R[W+z+0]=s.x,R[W+z+1]=s.y,R[W+z+2]=s.z,R[W+z+3]=0),g===!0&&(s.fromBufferAttribute(L,V),R[W+z+4]=s.x,R[W+z+5]=s.y,R[W+z+6]=s.z,R[W+z+7]=0),x===!0&&(s.fromBufferAttribute(N,V),R[W+z+8]=s.x,R[W+z+9]=s.y,R[W+z+10]=s.z,R[W+z+11]=N.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new we(v,E)},i.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Ax(n,e,t,i){let s=new WeakMap;function r(l){let c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Xd=new $n,Ad=new ns(1,1),qd=new Po,Yd=new pl,Zd=new Fo,Rd=[],Cd=[],Pd=new Float32Array(16),Id=new Float32Array(9),Dd=new Float32Array(4);function Kr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Rd[s];if(r===void 0&&(r=new Float32Array(s),Rd[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function wn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function En(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Oc(n,e){let t=Cd[e];t===void 0&&(t=new Int32Array(e),Cd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Rx(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Cx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wn(t,e))return;n.uniform2fv(this.addr,e),En(t,e)}}function Px(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wn(t,e))return;n.uniform3fv(this.addr,e),En(t,e)}}function Ix(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wn(t,e))return;n.uniform4fv(this.addr,e),En(t,e)}}function Dx(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(wn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),En(t,e)}else{if(wn(t,i))return;Dd.set(i),n.uniformMatrix2fv(this.addr,!1,Dd),En(t,i)}}function Lx(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(wn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),En(t,e)}else{if(wn(t,i))return;Id.set(i),n.uniformMatrix3fv(this.addr,!1,Id),En(t,i)}}function Ux(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(wn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),En(t,e)}else{if(wn(t,i))return;Pd.set(i),n.uniformMatrix4fv(this.addr,!1,Pd),En(t,i)}}function Nx(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Fx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wn(t,e))return;n.uniform2iv(this.addr,e),En(t,e)}}function kx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wn(t,e))return;n.uniform3iv(this.addr,e),En(t,e)}}function Ox(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wn(t,e))return;n.uniform4iv(this.addr,e),En(t,e)}}function zx(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Bx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wn(t,e))return;n.uniform2uiv(this.addr,e),En(t,e)}}function Hx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wn(t,e))return;n.uniform3uiv(this.addr,e),En(t,e)}}function Vx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wn(t,e))return;n.uniform4uiv(this.addr,e),En(t,e)}}function Gx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Ad.compareFunction=du,r=Ad):r=Xd,t.setTexture2D(e||r,s)}function Wx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Yd,s)}function Xx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Zd,s)}function qx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||qd,s)}function Yx(n){switch(n){case 5126:return Rx;case 35664:return Cx;case 35665:return Px;case 35666:return Ix;case 35674:return Dx;case 35675:return Lx;case 35676:return Ux;case 5124:case 35670:return Nx;case 35667:case 35671:return Fx;case 35668:case 35672:return kx;case 35669:case 35673:return Ox;case 5125:return zx;case 36294:return Bx;case 36295:return Hx;case 36296:return Vx;case 35678:case 36198:case 36298:case 36306:case 35682:return Gx;case 35679:case 36299:case 36307:return Wx;case 35680:case 36300:case 36308:case 36293:return Xx;case 36289:case 36303:case 36311:case 36292:return qx}}function Zx(n,e){n.uniform1fv(this.addr,e)}function $x(n,e){let t=Kr(e,this.size,2);n.uniform2fv(this.addr,t)}function Jx(n,e){let t=Kr(e,this.size,3);n.uniform3fv(this.addr,t)}function Kx(n,e){let t=Kr(e,this.size,4);n.uniform4fv(this.addr,t)}function jx(n,e){let t=Kr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Qx(n,e){let t=Kr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function ev(n,e){let t=Kr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function tv(n,e){n.uniform1iv(this.addr,e)}function nv(n,e){n.uniform2iv(this.addr,e)}function iv(n,e){n.uniform3iv(this.addr,e)}function sv(n,e){n.uniform4iv(this.addr,e)}function rv(n,e){n.uniform1uiv(this.addr,e)}function ov(n,e){n.uniform2uiv(this.addr,e)}function av(n,e){n.uniform3uiv(this.addr,e)}function lv(n,e){n.uniform4uiv(this.addr,e)}function cv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);wn(i,r)||(n.uniform1iv(this.addr,r),En(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Xd,r[o])}function hv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);wn(i,r)||(n.uniform1iv(this.addr,r),En(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Yd,r[o])}function uv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);wn(i,r)||(n.uniform1iv(this.addr,r),En(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Zd,r[o])}function fv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);wn(i,r)||(n.uniform1iv(this.addr,r),En(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||qd,r[o])}function dv(n){switch(n){case 5126:return Zx;case 35664:return $x;case 35665:return Jx;case 35666:return Kx;case 35674:return jx;case 35675:return Qx;case 35676:return ev;case 5124:case 35670:return tv;case 35667:case 35671:return nv;case 35668:case 35672:return iv;case 35669:case 35673:return sv;case 5125:return rv;case 36294:return ov;case 36295:return av;case 36296:return lv;case 35678:case 36198:case 36298:case 36306:case 35682:return cv;case 35679:case 36299:case 36307:return hv;case 35680:case 36300:case 36308:case 36293:return uv;case 36289:case 36303:case 36311:case 36292:return fv}}var Ru=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Yx(t.type)}},Cu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dv(t.type)}},Pu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},Au=/(\w+)(\])?(\[|\.)?/g;function Ld(n,e){n.seq.push(e),n.map[e.id]=e}function pv(n,e,t){let i=n.name,s=i.length;for(Au.lastIndex=0;;){let r=Au.exec(i),o=Au.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ld(t,c===void 0?new Ru(a,n,e):new Cu(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new Pu(a),Ld(t,u)),t=u}}}var $r=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);pv(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Ud(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var mv=37297,gv=0;function xv(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Nd=new Mt;function vv(n){Dt._getMatrix(Nd,Dt.workingColorSpace,n);let e=`mat3( ${Nd.elements.map(t=>t.toFixed(4))} )`;switch(Dt.getTransfer(n)){case Ao:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Fd(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+xv(n.getShaderSource(e),a)}else return r}function yv(n,e){let t=vv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function _v(n,e){let t;switch(e){case Wl:t="Linear";break;case Xl:t="Reinhard";break;case ql:t="Cineon";break;case Xr:t="ACESFilmic";break;case Zl:t="AgX";break;case $l:t="Neutral";break;case Yl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fc=new k;function Mv(){Dt.getLuminanceCoefficients(Fc);let n=Fc.x.toFixed(4),e=Fc.y.toFixed(4),t=Fc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ma).join(`
`)}function Sv(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function wv(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function ma(n){return n!==""}function kd(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Od(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ev=/^[ \t]*#include +<([\w\d./]+)>/gm;function Iu(n){return n.replace(Ev,Av)}var Tv=new Map;function Av(n,e){let t=At[e];if(t===void 0){let i=Tv.get(e);if(i!==void 0)t=At[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Iu(t)}var Rv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zd(n){return n.replace(Rv,Cv)}function Cv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bd(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Pv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===tu?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Nl?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Hi&&(e="SHADOWMAP_TYPE_VSM"),e}function Iv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Qs:case er:e="ENVMAP_TYPE_CUBE";break;case la:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Dv(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case er:e="ENVMAP_MODE_REFRACTION";break}return e}function Lv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case su:e="ENVMAP_BLENDING_MULTIPLY";break;case Qf:e="ENVMAP_BLENDING_MIX";break;case ed:e="ENVMAP_BLENDING_ADD";break}return e}function Uv(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Nv(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Pv(t),c=Iv(t),h=Dv(t),u=Lv(t),d=Uv(t),f=bv(t),g=Sv(r),x=s.createProgram(),m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ma).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ma).join(`
`),p.length>0&&(p+=`
`)):(m=[Bd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ma).join(`
`),p=[Bd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==rs?"#define TONE_MAPPING":"",t.toneMapping!==rs?At.tonemapping_pars_fragment:"",t.toneMapping!==rs?_v("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",At.colorspace_pars_fragment,yv("linearToOutputTexel",t.outputColorSpace),Mv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ma).join(`
`)),o=Iu(o),o=kd(o,t),o=Od(o,t),a=Iu(a),a=kd(a,t),a=Od(a,t),o=zd(o),a=zd(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===pu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===pu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=M+m+o,v=M+p+a,E=Ud(s,s.VERTEX_SHADER,y),R=Ud(s,s.FRAGMENT_SHADER,v);s.attachShader(x,E),s.attachShader(x,R),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(I){if(n.debug.checkShaderErrors){let L=s.getProgramInfoLog(x)||"",N=s.getShaderInfoLog(E)||"",W=s.getShaderInfoLog(R)||"",V=L.trim(),z=N.trim(),X=W.trim(),q=!0,ee=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(q=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,E,R);else{let ce=Fd(s,E,"vertex"),be=Fd(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+V+`
`+ce+`
`+be)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(z===""||X==="")&&(ee=!1);ee&&(I.diagnostics={runnable:q,programLog:V,vertexShader:{log:z,prefix:m},fragmentShader:{log:X,prefix:p}})}s.deleteShader(E),s.deleteShader(R),P=new $r(s,x),b=wv(s,x)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(x,mv)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gv++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=R,this}var Fv=0,Du=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Lu(e),t.set(e,i)),i}},Lu=class{constructor(e){this.id=Fv++,this.code=e,this.usedTimes=0}};function kv(n,e,t,i,s,r,o){let a=new Do,l=new Du,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,S,I,L,N){let W=L.fog,V=N.geometry,z=b.isMeshStandardMaterial?L.environment:null,X=(b.isMeshStandardMaterial?t:e).get(b.envMap||z),q=X&&X.mapping===la?X.image.height:null,ee=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));let ce=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,be=ce!==void 0?ce.length:0,Ce=0;V.morphAttributes.position!==void 0&&(Ce=1),V.morphAttributes.normal!==void 0&&(Ce=2),V.morphAttributes.color!==void 0&&(Ce=3);let Fe,Be,ke,ne;if(ee){let je=Gi[ee];Fe=je.vertexShader,Be=je.fragmentShader}else Fe=b.vertexShader,Be=b.fragmentShader,l.update(b),ke=l.getVertexShaderID(b),ne=l.getFragmentShaderID(b);let ie=n.getRenderTarget(),ge=n.state.buffers.depth.getReversed(),ve=N.isInstancedMesh===!0,Se=N.isBatchedMesh===!0,Ze=!!b.map,ht=!!b.matcap,O=!!X,H=!!b.aoMap,B=!!b.lightMap,$=!!b.bumpMap,Y=!!b.normalMap,K=!!b.displacementMap,se=!!b.emissiveMap,fe=!!b.metalnessMap,Ae=!!b.roughnessMap,Ie=b.anisotropy>0,D=b.clearcoat>0,T=b.dispersion>0,j=b.iridescence>0,he=b.sheen>0,Me=b.transmission>0,de=Ie&&!!b.anisotropyMap,$e=D&&!!b.clearcoatMap,Re=D&&!!b.clearcoatNormalMap,qe=D&&!!b.clearcoatRoughnessMap,Ge=j&&!!b.iridescenceMap,Te=j&&!!b.iridescenceThicknessMap,We=he&&!!b.sheenColorMap,it=he&&!!b.sheenRoughnessMap,Qe=!!b.specularMap,Oe=!!b.specularColorMap,pt=!!b.specularIntensityMap,U=Me&&!!b.transmissionMap,Z=Me&&!!b.thicknessMap,ae=!!b.gradientMap,xe=!!b.alphaMap,J=b.alphaTest>0,re=!!b.alphaHash,me=!!b.extensions,ye=rs;b.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ye=n.toneMapping);let Xe={shaderID:ee,shaderType:b.type,shaderName:b.name,vertexShader:Fe,fragmentShader:Be,defines:b.defines,customVertexShaderID:ke,customFragmentShaderID:ne,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Se,batchingColor:Se&&N._colorsTexture!==null,instancing:ve,instancingColor:ve&&N.instanceColor!==null,instancingMorph:ve&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Hs,alphaToCoverage:!!b.alphaToCoverage,map:Ze,matcap:ht,envMap:O,envMapMode:O&&X.mapping,envMapCubeUVHeight:q,aoMap:H,lightMap:B,bumpMap:$,normalMap:Y,displacementMap:d&&K,emissiveMap:se,normalMapObjectSpace:Y&&b.normalMapType===rd,normalMapTangentSpace:Y&&b.normalMapType===Lc,metalnessMap:fe,roughnessMap:Ae,anisotropy:Ie,anisotropyMap:de,clearcoat:D,clearcoatMap:$e,clearcoatNormalMap:Re,clearcoatRoughnessMap:qe,dispersion:T,iridescence:j,iridescenceMap:Ge,iridescenceThicknessMap:Te,sheen:he,sheenColorMap:We,sheenRoughnessMap:it,specularMap:Qe,specularColorMap:Oe,specularIntensityMap:pt,transmission:Me,transmissionMap:U,thicknessMap:Z,gradientMap:ae,opaque:b.transparent===!1&&b.blending===Qi&&b.alphaToCoverage===!1,alphaMap:xe,alphaTest:J,alphaHash:re,combine:b.combine,mapUv:Ze&&x(b.map.channel),aoMapUv:H&&x(b.aoMap.channel),lightMapUv:B&&x(b.lightMap.channel),bumpMapUv:$&&x(b.bumpMap.channel),normalMapUv:Y&&x(b.normalMap.channel),displacementMapUv:K&&x(b.displacementMap.channel),emissiveMapUv:se&&x(b.emissiveMap.channel),metalnessMapUv:fe&&x(b.metalnessMap.channel),roughnessMapUv:Ae&&x(b.roughnessMap.channel),anisotropyMapUv:de&&x(b.anisotropyMap.channel),clearcoatMapUv:$e&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:Re&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:qe&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ge&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:We&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:it&&x(b.sheenRoughnessMap.channel),specularMapUv:Qe&&x(b.specularMap.channel),specularColorMapUv:Oe&&x(b.specularColorMap.channel),specularIntensityMapUv:pt&&x(b.specularIntensityMap.channel),transmissionMapUv:U&&x(b.transmissionMap.channel),thicknessMapUv:Z&&x(b.thicknessMap.channel),alphaMapUv:xe&&x(b.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Y||Ie),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!V.attributes.uv&&(Ze||xe),fog:!!W,useFog:b.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ge,skinning:N.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Ce,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:ye,decodeVideoTexture:Ze&&b.map.isVideoTexture===!0&&Dt.getTransfer(b.map.colorSpace)===zt,decodeVideoTextureEmissive:se&&b.emissiveMap.isVideoTexture===!0&&Dt.getTransfer(b.emissiveMap.colorSpace)===zt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Qt,flipSided:b.side===_n,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:me&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&b.extensions.multiDraw===!0||Se)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Xe.vertexUv1s=c.has(1),Xe.vertexUv2s=c.has(2),Xe.vertexUv3s=c.has(3),c.clear(),Xe}function p(b){let S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(let I in b.defines)S.push(I),S.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(M(S,b),y(S,b),S.push(n.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function M(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function y(b,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),b.push(a.mask)}function v(b){let S=g[b.type],I;if(S){let L=Gi[S];I=Kn.clone(L.uniforms)}else I=b.uniforms;return I}function E(b,S){let I;for(let L=0,N=h.length;L<N;L++){let W=h[L];if(W.cacheKey===S){I=W,++I.usedTimes;break}}return I===void 0&&(I=new Nv(n,S,b,r),h.push(I)),I}function R(b){if(--b.usedTimes===0){let S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function C(b){l.remove(b)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:E,releaseProgram:R,releaseShaderCache:C,programs:h,dispose:P}}function Ov(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function zv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Hd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Vd(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u,d,f,g,x,m){let p=n[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},n[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),e++,p}function a(u,d,f,g,x,m){let p=o(u,d,f,g,x,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(u,d,f,g,x,m){let p=o(u,d,f,g,x,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||zv),i.length>1&&i.sort(d||Hd),s.length>1&&s.sort(d||Hd)}function h(){for(let u=e,d=n.length;u<d;u++){let f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Bv(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Vd,n.set(i,[o])):s>=r.length?(o=new Vd,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Hv(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Ue};break;case"SpotLight":t={position:new k,direction:new k,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new k,halfWidth:new k,halfHeight:new k};break}return n[e.id]=t,t}}}function Vv(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var Gv=0;function Wv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Xv(n){let e=new Hv,t=Vv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new k);let s=new k,r=new ot,o=new ot;function a(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,M=0,y=0,v=0,E=0,R=0,C=0;c.sort(Wv);for(let b=0,S=c.length;b<S;b++){let I=c[b],L=I.color,N=I.intensity,W=I.distance,V=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=L.r*N,u+=L.g*N,d+=L.b*N;else if(I.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(I.sh.coefficients[z],N);C++}else if(I.isDirectionalLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let X=I.shadow,q=t.get(I);q.shadowIntensity=X.intensity,q.shadowBias=X.bias,q.shadowNormalBias=X.normalBias,q.shadowRadius=X.radius,q.shadowMapSize=X.mapSize,i.directionalShadow[f]=q,i.directionalShadowMap[f]=V,i.directionalShadowMatrix[f]=I.shadow.matrix,M++}i.directional[f]=z,f++}else if(I.isSpotLight){let z=e.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(L).multiplyScalar(N),z.distance=W,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,i.spot[x]=z;let X=I.shadow;if(I.map&&(i.spotLightMap[E]=I.map,E++,X.updateMatrices(I),I.castShadow&&R++),i.spotLightMatrix[x]=X.matrix,I.castShadow){let q=t.get(I);q.shadowIntensity=X.intensity,q.shadowBias=X.bias,q.shadowNormalBias=X.normalBias,q.shadowRadius=X.radius,q.shadowMapSize=X.mapSize,i.spotShadow[x]=q,i.spotShadowMap[x]=V,v++}x++}else if(I.isRectAreaLight){let z=e.get(I);z.color.copy(L).multiplyScalar(N),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=z,m++}else if(I.isPointLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),z.distance=I.distance,z.decay=I.decay,I.castShadow){let X=I.shadow,q=t.get(I);q.shadowIntensity=X.intensity,q.shadowBias=X.bias,q.shadowNormalBias=X.normalBias,q.shadowRadius=X.radius,q.shadowMapSize=X.mapSize,q.shadowCameraNear=X.camera.near,q.shadowCameraFar=X.camera.far,i.pointShadow[g]=q,i.pointShadowMap[g]=V,i.pointShadowMatrix[g]=I.shadow.matrix,y++}i.point[g]=z,g++}else if(I.isHemisphereLight){let z=e.get(I);z.skyColor.copy(I.color).multiplyScalar(N),z.groundColor.copy(I.groundColor).multiplyScalar(N),i.hemi[p]=z,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ye.LTC_FLOAT_1,i.rectAreaLTC2=Ye.LTC_FLOAT_2):(i.rectAreaLTC1=Ye.LTC_HALF_1,i.rectAreaLTC2=Ye.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let P=i.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==x||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==M||P.numPointShadows!==y||P.numSpotShadows!==v||P.numSpotMaps!==E||P.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=x,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=v+E-R,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=C,P.directionalLength=f,P.pointLength=g,P.spotLength=x,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=M,P.numPointShadows=y,P.numSpotShadows=v,P.numSpotMaps=E,P.numLightProbes=C,i.version=Gv++)}function l(c,h){let u=0,d=0,f=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){let y=c[p];if(y.isDirectionalLight){let v=i.directional[u];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(y.isSpotLight){let v=i.spot[f];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(y.isRectAreaLight){let v=i.rectArea[g];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){let v=i.point[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){let v=i.hemi[x];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function Gd(n){let e=new Xv(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function o(h){i.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function qv(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Gd(n),e.set(s,[a])):r>=o.length?(a=new Gd(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var Yv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function $v(n,e,t){let i=new kr,s=new we,r=new we,o=new Lt,a=new bl({depthPacking:sd}),l=new Sl,c={},h=t.maxTextureSize,u={[Ci]:_n,[_n]:Ci,[Qt]:Qt},d=new vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new we},radius:{value:4}},vertexShader:Yv,fragmentShader:Zv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new Tt;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new rt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tu;let p=this.type;this.render=function(R,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;let b=n.getRenderTarget(),S=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),L=n.state;L.setBlending(xn),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let N=p!==Hi&&this.type===Hi,W=p===Hi&&this.type!==Hi;for(let V=0,z=R.length;V<z;V++){let X=R[V],q=X.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let ee=q.getFrameExtents();if(s.multiply(ee),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ee.x),s.x=r.x*ee.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ee.y),s.y=r.y*ee.y,q.mapSize.y=r.y)),q.map===null||N===!0||W===!0){let be=this.type!==Hi?{minFilter:yn,magFilter:yn}:{};q.map!==null&&q.map.dispose(),q.map=new pn(s.x,s.y,be),q.map.texture.name=X.name+".shadowMap",q.camera.updateProjectionMatrix()}n.setRenderTarget(q.map),n.clear();let ce=q.getViewportCount();for(let be=0;be<ce;be++){let Ce=q.getViewport(be);o.set(r.x*Ce.x,r.y*Ce.y,r.x*Ce.z,r.y*Ce.w),L.viewport(o),q.updateMatrices(X,be),i=q.getFrustum(),v(C,P,q.camera,X,this.type)}q.isPointLightShadow!==!0&&this.type===Hi&&M(q,P),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,S,I)};function M(R,C){let P=e.update(x);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,f.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new pn(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(C,null,P,d,x,null),f.uniforms.shadow_pass.value=R.mapPass.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(C,null,P,f,x,null)}function y(R,C,P,b){let S=null,I=P.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(I!==void 0)S=I;else if(S=P.isPointLight===!0?l:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let L=S.uuid,N=C.uuid,W=c[L];W===void 0&&(W={},c[L]=W);let V=W[N];V===void 0&&(V=S.clone(),W[N]=V,C.addEventListener("dispose",E)),S=V}if(S.visible=C.visible,S.wireframe=C.wireframe,b===Hi?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:u[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){let L=n.properties.get(S);L.light=P}return S}function v(R,C,P,b,S){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&S===Hi)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,R.matrixWorld);let N=e.update(R),W=R.material;if(Array.isArray(W)){let V=N.groups;for(let z=0,X=V.length;z<X;z++){let q=V[z],ee=W[q.materialIndex];if(ee&&ee.visible){let ce=y(R,ee,b,S);R.onBeforeShadow(n,R,C,P,N,ce,q),n.renderBufferDirect(P,null,N,ce,R,q),R.onAfterShadow(n,R,C,P,N,ce,q)}}}else if(W.visible){let V=y(R,W,b,S);R.onBeforeShadow(n,R,C,P,N,V,null),n.renderBufferDirect(P,null,N,V,R,null),R.onAfterShadow(n,R,C,P,N,V,null)}}let L=R.children;for(let N=0,W=L.length;N<W;N++)v(L[N],C,P,b,S)}function E(R){R.target.removeEventListener("dispose",E);for(let P in c){let b=c[P],S=R.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}var Jv={[kl]:Ol,[zl]:Vl,[Bl]:Gl,[Bs]:Hl,[Ol]:kl,[Vl]:zl,[Gl]:Bl,[Hl]:Bs};function Kv(n,e){function t(){let U=!1,Z=new Lt,ae=null,xe=new Lt(0,0,0,0);return{setMask:function(J){ae!==J&&!U&&(n.colorMask(J,J,J,J),ae=J)},setLocked:function(J){U=J},setClear:function(J,re,me,ye,Xe){Xe===!0&&(J*=ye,re*=ye,me*=ye),Z.set(J,re,me,ye),xe.equals(Z)===!1&&(n.clearColor(J,re,me,ye),xe.copy(Z))},reset:function(){U=!1,ae=null,xe.set(-1,0,0,0)}}}function i(){let U=!1,Z=!1,ae=null,xe=null,J=null;return{setReversed:function(re){if(Z!==re){let me=e.get("EXT_clip_control");re?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),Z=re;let ye=J;J=null,this.setClear(ye)}},getReversed:function(){return Z},setTest:function(re){re?ie(n.DEPTH_TEST):ge(n.DEPTH_TEST)},setMask:function(re){ae!==re&&!U&&(n.depthMask(re),ae=re)},setFunc:function(re){if(Z&&(re=Jv[re]),xe!==re){switch(re){case kl:n.depthFunc(n.NEVER);break;case Ol:n.depthFunc(n.ALWAYS);break;case zl:n.depthFunc(n.LESS);break;case Bs:n.depthFunc(n.LEQUAL);break;case Bl:n.depthFunc(n.EQUAL);break;case Hl:n.depthFunc(n.GEQUAL);break;case Vl:n.depthFunc(n.GREATER);break;case Gl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}xe=re}},setLocked:function(re){U=re},setClear:function(re){J!==re&&(Z&&(re=1-re),n.clearDepth(re),J=re)},reset:function(){U=!1,ae=null,xe=null,J=null,Z=!1}}}function s(){let U=!1,Z=null,ae=null,xe=null,J=null,re=null,me=null,ye=null,Xe=null;return{setTest:function(je){U||(je?ie(n.STENCIL_TEST):ge(n.STENCIL_TEST))},setMask:function(je){Z!==je&&!U&&(n.stencilMask(je),Z=je)},setFunc:function(je,le,De){(ae!==je||xe!==le||J!==De)&&(n.stencilFunc(je,le,De),ae=je,xe=le,J=De)},setOp:function(je,le,De){(re!==je||me!==le||ye!==De)&&(n.stencilOp(je,le,De),re=je,me=le,ye=De)},setLocked:function(je){U=je},setClear:function(je){Xe!==je&&(n.clearStencil(je),Xe=je)},reset:function(){U=!1,Z=null,ae=null,xe=null,J=null,re=null,me=null,ye=null,Xe=null}}}let r=new t,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,x=!1,m=null,p=null,M=null,y=null,v=null,E=null,R=null,C=new Ue(0,0,0),P=0,b=!1,S=null,I=null,L=null,N=null,W=null,V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,X=0,q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(q)[1]),z=X>=1):q.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),z=X>=2);let ee=null,ce={},be=n.getParameter(n.SCISSOR_BOX),Ce=n.getParameter(n.VIEWPORT),Fe=new Lt().fromArray(be),Be=new Lt().fromArray(Ce);function ke(U,Z,ae,xe){let J=new Uint8Array(4),re=n.createTexture();n.bindTexture(U,re),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let me=0;me<ae;me++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(Z,0,n.RGBA,1,1,xe,0,n.RGBA,n.UNSIGNED_BYTE,J):n.texImage2D(Z+me,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,J);return re}let ne={};ne[n.TEXTURE_2D]=ke(n.TEXTURE_2D,n.TEXTURE_2D,1),ne[n.TEXTURE_CUBE_MAP]=ke(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[n.TEXTURE_2D_ARRAY]=ke(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ne[n.TEXTURE_3D]=ke(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ie(n.DEPTH_TEST),o.setFunc(Bs),$(!1),Y(eu),ie(n.CULL_FACE),H(xn);function ie(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function ge(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function ve(U,Z){return u[U]!==Z?(n.bindFramebuffer(U,Z),u[U]=Z,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Z),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Z),!0):!1}function Se(U,Z){let ae=f,xe=!1;if(U){ae=d.get(Z),ae===void 0&&(ae=[],d.set(Z,ae));let J=U.textures;if(ae.length!==J.length||ae[0]!==n.COLOR_ATTACHMENT0){for(let re=0,me=J.length;re<me;re++)ae[re]=n.COLOR_ATTACHMENT0+re;ae.length=J.length,xe=!0}}else ae[0]!==n.BACK&&(ae[0]=n.BACK,xe=!0);xe&&n.drawBuffers(ae)}function Ze(U){return g!==U?(n.useProgram(U),g=U,!0):!1}let ht={[li]:n.FUNC_ADD,[zf]:n.FUNC_SUBTRACT,[Bf]:n.FUNC_REVERSE_SUBTRACT};ht[Hf]=n.MIN,ht[Vf]=n.MAX;let O={[js]:n.ZERO,[Gf]:n.ONE,[Wf]:n.SRC_COLOR,[ll]:n.SRC_ALPHA,[Zf]:n.SRC_ALPHA_SATURATE,[aa]:n.DST_COLOR,[oa]:n.DST_ALPHA,[Xf]:n.ONE_MINUS_SRC_COLOR,[cl]:n.ONE_MINUS_SRC_ALPHA,[Yf]:n.ONE_MINUS_DST_COLOR,[qf]:n.ONE_MINUS_DST_ALPHA,[$f]:n.CONSTANT_COLOR,[Jf]:n.ONE_MINUS_CONSTANT_COLOR,[Kf]:n.CONSTANT_ALPHA,[jf]:n.ONE_MINUS_CONSTANT_ALPHA};function H(U,Z,ae,xe,J,re,me,ye,Xe,je){if(U===xn){x===!0&&(ge(n.BLEND),x=!1);return}if(x===!1&&(ie(n.BLEND),x=!0),U!==Fl){if(U!==m||je!==b){if((p!==li||v!==li)&&(n.blendEquation(n.FUNC_ADD),p=li,v=li),je)switch(U){case Qi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Mn:n.blendFunc(n.ONE,n.ONE);break;case nu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case iu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Qi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Mn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case nu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case iu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}M=null,y=null,E=null,R=null,C.set(0,0,0),P=0,m=U,b=je}return}J=J||Z,re=re||ae,me=me||xe,(Z!==p||J!==v)&&(n.blendEquationSeparate(ht[Z],ht[J]),p=Z,v=J),(ae!==M||xe!==y||re!==E||me!==R)&&(n.blendFuncSeparate(O[ae],O[xe],O[re],O[me]),M=ae,y=xe,E=re,R=me),(ye.equals(C)===!1||Xe!==P)&&(n.blendColor(ye.r,ye.g,ye.b,Xe),C.copy(ye),P=Xe),m=U,b=!1}function B(U,Z){U.side===Qt?ge(n.CULL_FACE):ie(n.CULL_FACE);let ae=U.side===_n;Z&&(ae=!ae),$(ae),U.blending===Qi&&U.transparent===!1?H(xn):H(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let xe=U.stencilWrite;a.setTest(xe),xe&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),se(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):ge(n.SAMPLE_ALPHA_TO_COVERAGE)}function $(U){S!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),S=U)}function Y(U){U!==kf?(ie(n.CULL_FACE),U!==I&&(U===eu?n.cullFace(n.BACK):U===Of?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ge(n.CULL_FACE),I=U}function K(U){U!==L&&(z&&n.lineWidth(U),L=U)}function se(U,Z,ae){U?(ie(n.POLYGON_OFFSET_FILL),(N!==Z||W!==ae)&&(n.polygonOffset(Z,ae),N=Z,W=ae)):ge(n.POLYGON_OFFSET_FILL)}function fe(U){U?ie(n.SCISSOR_TEST):ge(n.SCISSOR_TEST)}function Ae(U){U===void 0&&(U=n.TEXTURE0+V-1),ee!==U&&(n.activeTexture(U),ee=U)}function Ie(U,Z,ae){ae===void 0&&(ee===null?ae=n.TEXTURE0+V-1:ae=ee);let xe=ce[ae];xe===void 0&&(xe={type:void 0,texture:void 0},ce[ae]=xe),(xe.type!==U||xe.texture!==Z)&&(ee!==ae&&(n.activeTexture(ae),ee=ae),n.bindTexture(U,Z||ne[U]),xe.type=U,xe.texture=Z)}function D(){let U=ce[ee];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function he(){try{n.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(){try{n.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function de(){try{n.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $e(){try{n.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Re(){try{n.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function qe(){try{n.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ge(){try{n.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{n.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function We(U){Fe.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Fe.copy(U))}function it(U){Be.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),Be.copy(U))}function Qe(U,Z){let ae=c.get(Z);ae===void 0&&(ae=new WeakMap,c.set(Z,ae));let xe=ae.get(U);xe===void 0&&(xe=n.getUniformBlockIndex(Z,U.name),ae.set(U,xe))}function Oe(U,Z){let xe=c.get(Z).get(U);l.get(Z)!==xe&&(n.uniformBlockBinding(Z,xe,U.__bindingPointIndex),l.set(Z,xe))}function pt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ee=null,ce={},u={},d=new WeakMap,f=[],g=null,x=!1,m=null,p=null,M=null,y=null,v=null,E=null,R=null,C=new Ue(0,0,0),P=0,b=!1,S=null,I=null,L=null,N=null,W=null,Fe.set(0,0,n.canvas.width,n.canvas.height),Be.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ie,disable:ge,bindFramebuffer:ve,drawBuffers:Se,useProgram:Ze,setBlending:H,setMaterial:B,setFlipSided:$,setCullFace:Y,setLineWidth:K,setPolygonOffset:se,setScissorTest:fe,activeTexture:Ae,bindTexture:Ie,unbindTexture:D,compressedTexImage2D:T,compressedTexImage3D:j,texImage2D:Ge,texImage3D:Te,updateUBOMapping:Qe,uniformBlockBinding:Oe,texStorage2D:Re,texStorage3D:qe,texSubImage2D:he,texSubImage3D:Me,compressedTexSubImage2D:de,compressedTexSubImage3D:$e,scissor:We,viewport:it,reset:pt}}function jv(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new we,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,T){return f?new OffscreenCanvas(D,T):Co("canvas")}function x(D,T,j){let he=1,Me=Ie(D);if((Me.width>j||Me.height>j)&&(he=j/Math.max(Me.width,Me.height)),he<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){let de=Math.floor(he*Me.width),$e=Math.floor(he*Me.height);u===void 0&&(u=g(de,$e));let Re=T?g(de,$e):u;return Re.width=de,Re.height=$e,Re.getContext("2d").drawImage(D,0,0,de,$e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Me.width+"x"+Me.height+") to ("+de+"x"+$e+")."),Re}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Me.width+"x"+Me.height+")."),D;return D}function m(D){return D.generateMipmaps}function p(D){n.generateMipmap(D)}function M(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(D,T,j,he,Me=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let de=T;if(T===n.RED&&(j===n.FLOAT&&(de=n.R32F),j===n.HALF_FLOAT&&(de=n.R16F),j===n.UNSIGNED_BYTE&&(de=n.R8)),T===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(de=n.R8UI),j===n.UNSIGNED_SHORT&&(de=n.R16UI),j===n.UNSIGNED_INT&&(de=n.R32UI),j===n.BYTE&&(de=n.R8I),j===n.SHORT&&(de=n.R16I),j===n.INT&&(de=n.R32I)),T===n.RG&&(j===n.FLOAT&&(de=n.RG32F),j===n.HALF_FLOAT&&(de=n.RG16F),j===n.UNSIGNED_BYTE&&(de=n.RG8)),T===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(de=n.RG8UI),j===n.UNSIGNED_SHORT&&(de=n.RG16UI),j===n.UNSIGNED_INT&&(de=n.RG32UI),j===n.BYTE&&(de=n.RG8I),j===n.SHORT&&(de=n.RG16I),j===n.INT&&(de=n.RG32I)),T===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(de=n.RGB8UI),j===n.UNSIGNED_SHORT&&(de=n.RGB16UI),j===n.UNSIGNED_INT&&(de=n.RGB32UI),j===n.BYTE&&(de=n.RGB8I),j===n.SHORT&&(de=n.RGB16I),j===n.INT&&(de=n.RGB32I)),T===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(de=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(de=n.RGBA16UI),j===n.UNSIGNED_INT&&(de=n.RGBA32UI),j===n.BYTE&&(de=n.RGBA8I),j===n.SHORT&&(de=n.RGBA16I),j===n.INT&&(de=n.RGBA32I)),T===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(de=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(de=n.R11F_G11F_B10F)),T===n.RGBA){let $e=Me?Ao:Dt.getTransfer(he);j===n.FLOAT&&(de=n.RGBA32F),j===n.HALF_FLOAT&&(de=n.RGBA16F),j===n.UNSIGNED_BYTE&&(de=$e===zt?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(de=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(de=n.RGB5_A1)}return(de===n.R16F||de===n.R32F||de===n.RG16F||de===n.RG32F||de===n.RGBA16F||de===n.RGBA32F)&&e.get("EXT_color_buffer_float"),de}function v(D,T){let j;return D?T===null||T===Vi||T===_s?j=n.DEPTH24_STENCIL8:T===xi?j=n.DEPTH32F_STENCIL8:T===qr&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Vi||T===_s?j=n.DEPTH_COMPONENT24:T===xi?j=n.DEPTH_COMPONENT32F:T===qr&&(j=n.DEPTH_COMPONENT16),j}function E(D,T){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==yn&&D.minFilter!==Un?Math.log2(Math.max(T.width,T.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?T.mipmaps.length:1}function R(D){let T=D.target;T.removeEventListener("dispose",R),P(T),T.isVideoTexture&&h.delete(T)}function C(D){let T=D.target;T.removeEventListener("dispose",C),S(T)}function P(D){let T=i.get(D);if(T.__webglInit===void 0)return;let j=D.source,he=d.get(j);if(he){let Me=he[T.__cacheKey];Me.usedTimes--,Me.usedTimes===0&&b(D),Object.keys(he).length===0&&d.delete(j)}i.remove(D)}function b(D){let T=i.get(D);n.deleteTexture(T.__webglTexture);let j=D.source,he=d.get(j);delete he[T.__cacheKey],o.memory.textures--}function S(D){let T=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let he=0;he<6;he++){if(Array.isArray(T.__webglFramebuffer[he]))for(let Me=0;Me<T.__webglFramebuffer[he].length;Me++)n.deleteFramebuffer(T.__webglFramebuffer[he][Me]);else n.deleteFramebuffer(T.__webglFramebuffer[he]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[he])}else{if(Array.isArray(T.__webglFramebuffer))for(let he=0;he<T.__webglFramebuffer.length;he++)n.deleteFramebuffer(T.__webglFramebuffer[he]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let he=0;he<T.__webglColorRenderbuffer.length;he++)T.__webglColorRenderbuffer[he]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[he]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let j=D.textures;for(let he=0,Me=j.length;he<Me;he++){let de=i.get(j[he]);de.__webglTexture&&(n.deleteTexture(de.__webglTexture),o.memory.textures--),i.remove(j[he])}i.remove(D)}let I=0;function L(){I=0}function N(){let D=I;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),I+=1,D}function W(D){let T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function V(D,T){let j=i.get(D);if(D.isVideoTexture&&fe(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&j.__version!==D.version){let he=D.image;if(he===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(he.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(j,D,T);return}}else D.isExternalTexture&&(j.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+T)}function z(D,T){let j=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&j.__version!==D.version){ne(j,D,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+T)}function X(D,T){let j=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&j.__version!==D.version){ne(j,D,T);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+T)}function q(D,T){let j=i.get(D);if(D.version>0&&j.__version!==D.version){ie(j,D,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+T)}let ee={[Hn]:n.REPEAT,[Oi]:n.CLAMP_TO_EDGE,[hl]:n.MIRRORED_REPEAT},ce={[yn]:n.NEAREST,[nd]:n.NEAREST_MIPMAP_NEAREST,[ca]:n.NEAREST_MIPMAP_LINEAR,[Un]:n.LINEAR,[jl]:n.LINEAR_MIPMAP_NEAREST,[gi]:n.LINEAR_MIPMAP_LINEAR},be={[od]:n.NEVER,[fd]:n.ALWAYS,[ad]:n.LESS,[du]:n.LEQUAL,[ld]:n.EQUAL,[ud]:n.GEQUAL,[cd]:n.GREATER,[hd]:n.NOTEQUAL};function Ce(D,T){if(T.type===xi&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Un||T.magFilter===jl||T.magFilter===ca||T.magFilter===gi||T.minFilter===Un||T.minFilter===jl||T.minFilter===ca||T.minFilter===gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,ee[T.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,ee[T.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,ee[T.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,ce[T.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,ce[T.minFilter]),T.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,be[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===yn||T.minFilter!==ca&&T.minFilter!==gi||T.type===xi&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){let j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function Fe(D,T){let j=!1;D.__webglInit===void 0&&(D.__webglInit=!0,T.addEventListener("dispose",R));let he=T.source,Me=d.get(he);Me===void 0&&(Me={},d.set(he,Me));let de=W(T);if(de!==D.__cacheKey){Me[de]===void 0&&(Me[de]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),Me[de].usedTimes++;let $e=Me[D.__cacheKey];$e!==void 0&&(Me[D.__cacheKey].usedTimes--,$e.usedTimes===0&&b(T)),D.__cacheKey=de,D.__webglTexture=Me[de].texture}return j}function Be(D,T,j){return Math.floor(Math.floor(D/j)/T)}function ke(D,T,j,he){let de=D.updateRanges;if(de.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,j,he,T.data);else{de.sort((Te,We)=>Te.start-We.start);let $e=0;for(let Te=1;Te<de.length;Te++){let We=de[$e],it=de[Te],Qe=We.start+We.count,Oe=Be(it.start,T.width,4),pt=Be(We.start,T.width,4);it.start<=Qe+1&&Oe===pt&&Be(it.start+it.count-1,T.width,4)===Oe?We.count=Math.max(We.count,it.start+it.count-We.start):(++$e,de[$e]=it)}de.length=$e+1;let Re=n.getParameter(n.UNPACK_ROW_LENGTH),qe=n.getParameter(n.UNPACK_SKIP_PIXELS),Ge=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let Te=0,We=de.length;Te<We;Te++){let it=de[Te],Qe=Math.floor(it.start/4),Oe=Math.ceil(it.count/4),pt=Qe%T.width,U=Math.floor(Qe/T.width),Z=Oe,ae=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,pt),n.pixelStorei(n.UNPACK_SKIP_ROWS,U),t.texSubImage2D(n.TEXTURE_2D,0,pt,U,Z,ae,j,he,T.data)}D.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Re),n.pixelStorei(n.UNPACK_SKIP_PIXELS,qe),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ge)}}function ne(D,T,j){let he=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(he=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(he=n.TEXTURE_3D);let Me=Fe(D,T),de=T.source;t.bindTexture(he,D.__webglTexture,n.TEXTURE0+j);let $e=i.get(de);if(de.version!==$e.__version||Me===!0){t.activeTexture(n.TEXTURE0+j);let Re=Dt.getPrimaries(Dt.workingColorSpace),qe=T.colorSpace===vi?null:Dt.getPrimaries(T.colorSpace),Ge=T.colorSpace===vi||Re===qe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);let Te=x(T.image,!1,s.maxTextureSize);Te=Ae(T,Te);let We=r.convert(T.format,T.colorSpace),it=r.convert(T.type),Qe=y(T.internalFormat,We,it,T.colorSpace,T.isVideoTexture);Ce(he,T);let Oe,pt=T.mipmaps,U=T.isVideoTexture!==!0,Z=$e.__version===void 0||Me===!0,ae=de.dataReady,xe=E(T,Te);if(T.isDepthTexture)Qe=v(T.format===Ms,T.type),Z&&(U?t.texStorage2D(n.TEXTURE_2D,1,Qe,Te.width,Te.height):t.texImage2D(n.TEXTURE_2D,0,Qe,Te.width,Te.height,0,We,it,null));else if(T.isDataTexture)if(pt.length>0){U&&Z&&t.texStorage2D(n.TEXTURE_2D,xe,Qe,pt[0].width,pt[0].height);for(let J=0,re=pt.length;J<re;J++)Oe=pt[J],U?ae&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,Oe.width,Oe.height,We,it,Oe.data):t.texImage2D(n.TEXTURE_2D,J,Qe,Oe.width,Oe.height,0,We,it,Oe.data);T.generateMipmaps=!1}else U?(Z&&t.texStorage2D(n.TEXTURE_2D,xe,Qe,Te.width,Te.height),ae&&ke(T,Te,We,it)):t.texImage2D(n.TEXTURE_2D,0,Qe,Te.width,Te.height,0,We,it,Te.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){U&&Z&&t.texStorage3D(n.TEXTURE_2D_ARRAY,xe,Qe,pt[0].width,pt[0].height,Te.depth);for(let J=0,re=pt.length;J<re;J++)if(Oe=pt[J],T.format!==Sn)if(We!==null)if(U){if(ae)if(T.layerUpdates.size>0){let me=Mu(Oe.width,Oe.height,T.format,T.type);for(let ye of T.layerUpdates){let Xe=Oe.data.subarray(ye*me/Oe.data.BYTES_PER_ELEMENT,(ye+1)*me/Oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,ye,Oe.width,Oe.height,1,We,Xe)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,Oe.width,Oe.height,Te.depth,We,Oe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,Qe,Oe.width,Oe.height,Te.depth,0,Oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ae&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,Oe.width,Oe.height,Te.depth,We,it,Oe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,J,Qe,Oe.width,Oe.height,Te.depth,0,We,it,Oe.data)}else{U&&Z&&t.texStorage2D(n.TEXTURE_2D,xe,Qe,pt[0].width,pt[0].height);for(let J=0,re=pt.length;J<re;J++)Oe=pt[J],T.format!==Sn?We!==null?U?ae&&t.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,Oe.width,Oe.height,We,Oe.data):t.compressedTexImage2D(n.TEXTURE_2D,J,Qe,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ae&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,Oe.width,Oe.height,We,it,Oe.data):t.texImage2D(n.TEXTURE_2D,J,Qe,Oe.width,Oe.height,0,We,it,Oe.data)}else if(T.isDataArrayTexture)if(U){if(Z&&t.texStorage3D(n.TEXTURE_2D_ARRAY,xe,Qe,Te.width,Te.height,Te.depth),ae)if(T.layerUpdates.size>0){let J=Mu(Te.width,Te.height,T.format,T.type);for(let re of T.layerUpdates){let me=Te.data.subarray(re*J/Te.data.BYTES_PER_ELEMENT,(re+1)*J/Te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,re,Te.width,Te.height,1,We,it,me)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Te.width,Te.height,Te.depth,We,it,Te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Qe,Te.width,Te.height,Te.depth,0,We,it,Te.data);else if(T.isData3DTexture)U?(Z&&t.texStorage3D(n.TEXTURE_3D,xe,Qe,Te.width,Te.height,Te.depth),ae&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Te.width,Te.height,Te.depth,We,it,Te.data)):t.texImage3D(n.TEXTURE_3D,0,Qe,Te.width,Te.height,Te.depth,0,We,it,Te.data);else if(T.isFramebufferTexture){if(Z)if(U)t.texStorage2D(n.TEXTURE_2D,xe,Qe,Te.width,Te.height);else{let J=Te.width,re=Te.height;for(let me=0;me<xe;me++)t.texImage2D(n.TEXTURE_2D,me,Qe,J,re,0,We,it,null),J>>=1,re>>=1}}else if(pt.length>0){if(U&&Z){let J=Ie(pt[0]);t.texStorage2D(n.TEXTURE_2D,xe,Qe,J.width,J.height)}for(let J=0,re=pt.length;J<re;J++)Oe=pt[J],U?ae&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,We,it,Oe):t.texImage2D(n.TEXTURE_2D,J,Qe,We,it,Oe);T.generateMipmaps=!1}else if(U){if(Z){let J=Ie(Te);t.texStorage2D(n.TEXTURE_2D,xe,Qe,J.width,J.height)}ae&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,We,it,Te)}else t.texImage2D(n.TEXTURE_2D,0,Qe,We,it,Te);m(T)&&p(he),$e.__version=de.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function ie(D,T,j){if(T.image.length!==6)return;let he=Fe(D,T),Me=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+j);let de=i.get(Me);if(Me.version!==de.__version||he===!0){t.activeTexture(n.TEXTURE0+j);let $e=Dt.getPrimaries(Dt.workingColorSpace),Re=T.colorSpace===vi?null:Dt.getPrimaries(T.colorSpace),qe=T.colorSpace===vi||$e===Re?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let Ge=T.isCompressedTexture||T.image[0].isCompressedTexture,Te=T.image[0]&&T.image[0].isDataTexture,We=[];for(let re=0;re<6;re++)!Ge&&!Te?We[re]=x(T.image[re],!0,s.maxCubemapSize):We[re]=Te?T.image[re].image:T.image[re],We[re]=Ae(T,We[re]);let it=We[0],Qe=r.convert(T.format,T.colorSpace),Oe=r.convert(T.type),pt=y(T.internalFormat,Qe,Oe,T.colorSpace),U=T.isVideoTexture!==!0,Z=de.__version===void 0||he===!0,ae=Me.dataReady,xe=E(T,it);Ce(n.TEXTURE_CUBE_MAP,T);let J;if(Ge){U&&Z&&t.texStorage2D(n.TEXTURE_CUBE_MAP,xe,pt,it.width,it.height);for(let re=0;re<6;re++){J=We[re].mipmaps;for(let me=0;me<J.length;me++){let ye=J[me];T.format!==Sn?Qe!==null?U?ae&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me,0,0,ye.width,ye.height,Qe,ye.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me,pt,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me,0,0,ye.width,ye.height,Qe,Oe,ye.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me,pt,ye.width,ye.height,0,Qe,Oe,ye.data)}}}else{if(J=T.mipmaps,U&&Z){J.length>0&&xe++;let re=Ie(We[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,xe,pt,re.width,re.height)}for(let re=0;re<6;re++)if(Te){U?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,We[re].width,We[re].height,Qe,Oe,We[re].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,pt,We[re].width,We[re].height,0,Qe,Oe,We[re].data);for(let me=0;me<J.length;me++){let Xe=J[me].image[re].image;U?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me+1,0,0,Xe.width,Xe.height,Qe,Oe,Xe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me+1,pt,Xe.width,Xe.height,0,Qe,Oe,Xe.data)}}else{U?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Qe,Oe,We[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,pt,Qe,Oe,We[re]);for(let me=0;me<J.length;me++){let ye=J[me];U?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me+1,0,0,Qe,Oe,ye.image[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,me+1,pt,Qe,Oe,ye.image[re])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),de.__version=Me.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function ge(D,T,j,he,Me,de){let $e=r.convert(j.format,j.colorSpace),Re=r.convert(j.type),qe=y(j.internalFormat,$e,Re,j.colorSpace),Ge=i.get(T),Te=i.get(j);if(Te.__renderTarget=T,!Ge.__hasExternalTextures){let We=Math.max(1,T.width>>de),it=Math.max(1,T.height>>de);Me===n.TEXTURE_3D||Me===n.TEXTURE_2D_ARRAY?t.texImage3D(Me,de,qe,We,it,T.depth,0,$e,Re,null):t.texImage2D(Me,de,qe,We,it,0,$e,Re,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),se(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,Me,Te.__webglTexture,0,K(T)):(Me===n.TEXTURE_2D||Me>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Me<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,he,Me,Te.__webglTexture,de),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ve(D,T,j){if(n.bindRenderbuffer(n.RENDERBUFFER,D),T.depthBuffer){let he=T.depthTexture,Me=he&&he.isDepthTexture?he.type:null,de=v(T.stencilBuffer,Me),$e=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Re=K(T);se(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Re,de,T.width,T.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,Re,de,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,de,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,$e,n.RENDERBUFFER,D)}else{let he=T.textures;for(let Me=0;Me<he.length;Me++){let de=he[Me],$e=r.convert(de.format,de.colorSpace),Re=r.convert(de.type),qe=y(de.internalFormat,$e,Re,de.colorSpace),Ge=K(T);j&&se(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ge,qe,T.width,T.height):se(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ge,qe,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,qe,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Se(D,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let he=i.get(T.depthTexture);he.__renderTarget=T,(!he.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),V(T.depthTexture,0);let Me=he.__webglTexture,de=K(T);if(T.depthTexture.format===Pr)se(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Me,0,de):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Me,0);else if(T.depthTexture.format===Ms)se(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Me,0,de):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Me,0);else throw new Error("Unknown depthTexture format")}function Ze(D){let T=i.get(D),j=D.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==D.depthTexture){let he=D.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),he){let Me=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,he.removeEventListener("dispose",Me)};he.addEventListener("dispose",Me),T.__depthDisposeCallback=Me}T.__boundDepthTexture=he}if(D.depthTexture&&!T.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");let he=D.texture.mipmaps;he&&he.length>0?Se(T.__webglFramebuffer[0],D):Se(T.__webglFramebuffer,D)}else if(j){T.__webglDepthbuffer=[];for(let he=0;he<6;he++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[he]),T.__webglDepthbuffer[he]===void 0)T.__webglDepthbuffer[he]=n.createRenderbuffer(),ve(T.__webglDepthbuffer[he],D,!1);else{let Me=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=T.__webglDepthbuffer[he];n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,Me,n.RENDERBUFFER,de)}}else{let he=D.texture.mipmaps;if(he&&he.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),ve(T.__webglDepthbuffer,D,!1);else{let Me=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,Me,n.RENDERBUFFER,de)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ht(D,T,j){let he=i.get(D);T!==void 0&&ge(he.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&Ze(D)}function O(D){let T=D.texture,j=i.get(D),he=i.get(T);D.addEventListener("dispose",C);let Me=D.textures,de=D.isWebGLCubeRenderTarget===!0,$e=Me.length>1;if($e||(he.__webglTexture===void 0&&(he.__webglTexture=n.createTexture()),he.__version=T.version,o.memory.textures++),de){j.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer[Re]=[];for(let qe=0;qe<T.mipmaps.length;qe++)j.__webglFramebuffer[Re][qe]=n.createFramebuffer()}else j.__webglFramebuffer[Re]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer=[];for(let Re=0;Re<T.mipmaps.length;Re++)j.__webglFramebuffer[Re]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if($e)for(let Re=0,qe=Me.length;Re<qe;Re++){let Ge=i.get(Me[Re]);Ge.__webglTexture===void 0&&(Ge.__webglTexture=n.createTexture(),o.memory.textures++)}if(D.samples>0&&se(D)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Re=0;Re<Me.length;Re++){let qe=Me[Re];j.__webglColorRenderbuffer[Re]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[Re]);let Ge=r.convert(qe.format,qe.colorSpace),Te=r.convert(qe.type),We=y(qe.internalFormat,Ge,Te,qe.colorSpace,D.isXRRenderTarget===!0),it=K(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,it,We,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Re,n.RENDERBUFFER,j.__webglColorRenderbuffer[Re])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),ve(j.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(de){t.bindTexture(n.TEXTURE_CUBE_MAP,he.__webglTexture),Ce(n.TEXTURE_CUBE_MAP,T);for(let Re=0;Re<6;Re++)if(T.mipmaps&&T.mipmaps.length>0)for(let qe=0;qe<T.mipmaps.length;qe++)ge(j.__webglFramebuffer[Re][qe],D,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Re,qe);else ge(j.__webglFramebuffer[Re],D,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);m(T)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if($e){for(let Re=0,qe=Me.length;Re<qe;Re++){let Ge=Me[Re],Te=i.get(Ge),We=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(We=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(We,Te.__webglTexture),Ce(We,Ge),ge(j.__webglFramebuffer,D,Ge,n.COLOR_ATTACHMENT0+Re,We,0),m(Ge)&&p(We)}t.unbindTexture()}else{let Re=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Re=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Re,he.__webglTexture),Ce(Re,T),T.mipmaps&&T.mipmaps.length>0)for(let qe=0;qe<T.mipmaps.length;qe++)ge(j.__webglFramebuffer[qe],D,T,n.COLOR_ATTACHMENT0,Re,qe);else ge(j.__webglFramebuffer,D,T,n.COLOR_ATTACHMENT0,Re,0);m(T)&&p(Re),t.unbindTexture()}D.depthBuffer&&Ze(D)}function H(D){let T=D.textures;for(let j=0,he=T.length;j<he;j++){let Me=T[j];if(m(Me)){let de=M(D),$e=i.get(Me).__webglTexture;t.bindTexture(de,$e),p(de),t.unbindTexture()}}}let B=[],$=[];function Y(D){if(D.samples>0){if(se(D)===!1){let T=D.textures,j=D.width,he=D.height,Me=n.COLOR_BUFFER_BIT,de=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$e=i.get(D),Re=T.length>1;if(Re)for(let Ge=0;Ge<T.length;Ge++)t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,$e.__webglMultisampledFramebuffer);let qe=D.texture.mipmaps;qe&&qe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Ge=0;Ge<T.length;Ge++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(Me|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(Me|=n.STENCIL_BUFFER_BIT)),Re){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,$e.__webglColorRenderbuffer[Ge]);let Te=i.get(T[Ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Te,0)}n.blitFramebuffer(0,0,j,he,0,0,j,he,Me,n.NEAREST),l===!0&&(B.length=0,$.length=0,B.push(n.COLOR_ATTACHMENT0+Ge),D.depthBuffer&&D.resolveDepthBuffer===!1&&(B.push(de),$.push(de),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,$)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Re)for(let Ge=0;Ge<T.length;Ge++){t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.RENDERBUFFER,$e.__webglColorRenderbuffer[Ge]);let Te=i.get(T[Ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.TEXTURE_2D,Te,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){let T=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function K(D){return Math.min(s.maxSamples,D.samples)}function se(D){let T=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function fe(D){let T=o.render.frame;h.get(D)!==T&&(h.set(D,T),D.update())}function Ae(D,T){let j=D.colorSpace,he=D.format,Me=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||j!==Hs&&j!==vi&&(Dt.getTransfer(j)===zt?(he!==Sn||Me!==Jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),T}function Ie(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=L,this.setTexture2D=V,this.setTexture2DArray=z,this.setTexture3D=X,this.setTextureCube=q,this.rebindTextures=ht,this.setupRenderTarget=O,this.updateRenderTargetMipmap=H,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=se}function Qv(n,e){function t(i,s=vi){let r,o=Dt.getTransfer(s);if(i===Jn)return n.UNSIGNED_BYTE;if(i===ec)return n.UNSIGNED_SHORT_4_4_4_4;if(i===tc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===lu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===cu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ou)return n.BYTE;if(i===au)return n.SHORT;if(i===qr)return n.UNSIGNED_SHORT;if(i===Ql)return n.INT;if(i===Vi)return n.UNSIGNED_INT;if(i===xi)return n.FLOAT;if(i===bn)return n.HALF_FLOAT;if(i===hu)return n.ALPHA;if(i===uu)return n.RGB;if(i===Sn)return n.RGBA;if(i===Pr)return n.DEPTH_COMPONENT;if(i===Ms)return n.DEPTH_STENCIL;if(i===bs)return n.RED;if(i===nc)return n.RED_INTEGER;if(i===fu)return n.RG;if(i===ic)return n.RG_INTEGER;if(i===sc)return n.RGBA_INTEGER;if(i===ha||i===ua||i===fa||i===da)if(o===zt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ha)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ha)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ua)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===fa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===da)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===rc||i===oc||i===ac||i===lc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===rc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===oc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ac)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cc||i===hc||i===uc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===cc||i===hc)return o===zt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===uc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===fc||i===dc||i===pc||i===mc||i===gc||i===xc||i===vc||i===yc||i===_c||i===Mc||i===bc||i===Sc||i===wc||i===Ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===fc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===dc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===pc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===mc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===gc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===xc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===vc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===yc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===_c)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===wc)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ec)return o===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Tc||i===Ac||i===Rc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Tc)return o===zt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ac)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Rc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Cc||i===Pc||i===Ic||i===Dc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Cc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Pc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ic)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Dc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===_s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var ey=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ty=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Uu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Bo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new vt({vertexShader:ey,fragmentShader:ty,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new mn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nu=class extends es{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,x=typeof XRWebGLBinding<"u",m=new Uu,p={},M=t.getContextAttributes(),y=null,v=null,E=[],R=[],C=new we,P=null,b=new Ln;b.viewport=new Lt;let S=new Ln;S.viewport=new Lt;let I=[b,S],L=new Ul,N=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let ie=E[ne];return ie===void 0&&(ie=new Ur,E[ne]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(ne){let ie=E[ne];return ie===void 0&&(ie=new Ur,E[ne]=ie),ie.getGripSpace()},this.getHand=function(ne){let ie=E[ne];return ie===void 0&&(ie=new Ur,E[ne]=ie),ie.getHandSpace()};function V(ne){let ie=R.indexOf(ne.inputSource);if(ie===-1)return;let ge=E[ie];ge!==void 0&&(ge.update(ne.inputSource,ne.frame,c||o),ge.dispatchEvent({type:ne.type,data:ne.inputSource}))}function z(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",X);for(let ne=0;ne<E.length;ne++){let ie=R[ne];ie!==null&&(R[ne]=null,E[ne].disconnect(ie))}N=null,W=null,m.reset();for(let ne in p)delete p[ne];e.setRenderTarget(y),f=null,d=null,u=null,s=null,v=null,ke.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){r=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){a=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ne){c=ne},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ne){if(s=ne,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",z),s.addEventListener("inputsourceschange",X),M.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,ve=null,Se=null;M.depth&&(Se=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=M.stencil?Ms:Pr,ve=M.stencil?_s:Vi);let Ze={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ze),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new pn(d.textureWidth,d.textureHeight,{format:Sn,type:Jn,depthTexture:new ns(d.textureWidth,d.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let ge={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new pn(f.framebufferWidth,f.framebufferHeight,{format:Sn,type:Jn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ke.setContext(s),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(ne){for(let ie=0;ie<ne.removed.length;ie++){let ge=ne.removed[ie],ve=R.indexOf(ge);ve>=0&&(R[ve]=null,E[ve].disconnect(ge))}for(let ie=0;ie<ne.added.length;ie++){let ge=ne.added[ie],ve=R.indexOf(ge);if(ve===-1){for(let Ze=0;Ze<E.length;Ze++)if(Ze>=R.length){R.push(ge),ve=Ze;break}else if(R[Ze]===null){R[Ze]=ge,ve=Ze;break}if(ve===-1)break}let Se=E[ve];Se&&Se.connect(ge)}}let q=new k,ee=new k;function ce(ne,ie,ge){q.setFromMatrixPosition(ie.matrixWorld),ee.setFromMatrixPosition(ge.matrixWorld);let ve=q.distanceTo(ee),Se=ie.projectionMatrix.elements,Ze=ge.projectionMatrix.elements,ht=Se[14]/(Se[10]-1),O=Se[14]/(Se[10]+1),H=(Se[9]+1)/Se[5],B=(Se[9]-1)/Se[5],$=(Se[8]-1)/Se[0],Y=(Ze[8]+1)/Ze[0],K=ht*$,se=ht*Y,fe=ve/(-$+Y),Ae=fe*-$;if(ie.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(Ae),ne.translateZ(fe),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert(),Se[10]===-1)ne.projectionMatrix.copy(ie.projectionMatrix),ne.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let Ie=ht+fe,D=O+fe,T=K-Ae,j=se+(ve-Ae),he=H*O/D*Ie,Me=B*O/D*Ie;ne.projectionMatrix.makePerspective(T,j,he,Me,Ie,D),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}}function be(ne,ie){ie===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(ie.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(s===null)return;let ie=ne.near,ge=ne.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(ge=m.depthFar)),L.near=S.near=b.near=ie,L.far=S.far=b.far=ge,(N!==L.near||W!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),N=L.near,W=L.far),L.layers.mask=ne.layers.mask|6,b.layers.mask=L.layers.mask&3,S.layers.mask=L.layers.mask&5;let ve=ne.parent,Se=L.cameras;be(L,ve);for(let Ze=0;Ze<Se.length;Ze++)be(Se[Ze],ve);Se.length===2?ce(L,b,S):L.projectionMatrix.copy(b.projectionMatrix),Ce(ne,L,ve)};function Ce(ne,ie,ge){ge===null?ne.matrix.copy(ie.matrixWorld):(ne.matrix.copy(ge.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(ie.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(ie.projectionMatrix),ne.projectionMatrixInverse.copy(ie.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=Ir*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(ne){l=ne,d!==null&&(d.fixedFoveation=ne),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ne)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(ne){return p[ne]};let Fe=null;function Be(ne,ie){if(h=ie.getViewerPose(c||o),g=ie,h!==null){let ge=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let ve=!1;ge.length!==L.cameras.length&&(L.cameras.length=0,ve=!0);for(let O=0;O<ge.length;O++){let H=ge[O],B=null;if(f!==null)B=f.getViewport(H);else{let Y=u.getViewSubImage(d,H);B=Y.viewport,O===0&&(e.setRenderTargetTextures(v,Y.colorTexture,Y.depthStencilTexture),e.setRenderTarget(v))}let $=I[O];$===void 0&&($=new Ln,$.layers.enable(O),$.viewport=new Lt,I[O]=$),$.matrix.fromArray(H.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(H.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(B.x,B.y,B.width,B.height),O===0&&(L.matrix.copy($.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),ve===!0&&L.cameras.push($)}let Se=s.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();let O=u.getDepthInformation(ge[0]);O&&O.isValid&&O.texture&&m.init(O,s.renderState)}if(Se&&Se.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let O=0;O<ge.length;O++){let H=ge[O].camera;if(H){let B=p[H];B||(B=new Bo,p[H]=B);let $=u.getCameraImage(H);B.sourceTexture=$}}}}for(let ge=0;ge<E.length;ge++){let ve=R[ge],Se=E[ge];ve!==null&&Se!==void 0&&Se.update(ve,ie,c||o)}Fe&&Fe(ne,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}let ke=new Wd;ke.setAnimationLoop(Be),this.setAnimationLoop=function(ne){Fe=ne},this.dispose=function(){}}},sr=new ci,ny=new ot;function iy(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,xu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===_n&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===_n&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),y=M.envMap,v=M.envMapRotation;y&&(m.envMap.value=y,sr.copy(v),sr.x*=-1,sr.y*=-1,sr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(sr.y*=-1,sr.z*=-1),m.envMapRotation.value.setFromMatrix4(ny.makeRotationFromEuler(sr)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===_n&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function sy(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){let v=y.program;i.uniformBlockBinding(M,v)}function c(M,y){let v=s[M.id];v===void 0&&(g(M),v=h(M),s[M.id]=v,M.addEventListener("dispose",m));let E=y.program;i.updateUBOMapping(M,E);let R=e.render.frame;r[M.id]!==R&&(d(M),r[M.id]=R)}function h(M){let y=u();M.__bindingPointIndex=y;let v=n.createBuffer(),E=M.__size,R=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,E,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,v),v}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let y=s[M.id],v=M.uniforms,E=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let R=0,C=v.length;R<C;R++){let P=Array.isArray(v[R])?v[R]:[v[R]];for(let b=0,S=P.length;b<S;b++){let I=P[b];if(f(I,R,b,E)===!0){let L=I.__offset,N=Array.isArray(I.value)?I.value:[I.value],W=0;for(let V=0;V<N.length;V++){let z=N[V],X=x(z);typeof z=="number"||typeof z=="boolean"?(I.__data[0]=z,n.bufferSubData(n.UNIFORM_BUFFER,L+W,I.__data)):z.isMatrix3?(I.__data[0]=z.elements[0],I.__data[1]=z.elements[1],I.__data[2]=z.elements[2],I.__data[3]=0,I.__data[4]=z.elements[3],I.__data[5]=z.elements[4],I.__data[6]=z.elements[5],I.__data[7]=0,I.__data[8]=z.elements[6],I.__data[9]=z.elements[7],I.__data[10]=z.elements[8],I.__data[11]=0):(z.toArray(I.__data,W),W+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,L,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,y,v,E){let R=M.value,C=y+"_"+v;if(E[C]===void 0)return typeof R=="number"||typeof R=="boolean"?E[C]=R:E[C]=R.clone(),!0;{let P=E[C];if(typeof R=="number"||typeof R=="boolean"){if(P!==R)return E[C]=R,!0}else if(P.equals(R)===!1)return P.copy(R),!0}return!1}function g(M){let y=M.uniforms,v=0,E=16;for(let C=0,P=y.length;C<P;C++){let b=Array.isArray(y[C])?y[C]:[y[C]];for(let S=0,I=b.length;S<I;S++){let L=b[S],N=Array.isArray(L.value)?L.value:[L.value];for(let W=0,V=N.length;W<V;W++){let z=N[W],X=x(z),q=v%E,ee=q%X.boundary,ce=q+ee;v+=ee,ce!==0&&E-ce<X.storage&&(v+=E-ce),L.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=X.storage}}}let R=v%E;return R>0&&(v+=E-R),M.__size=v,M.__cache={},this}function x(M){let y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),y}function m(M){let y=M.target;y.removeEventListener("dispose",m);let v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(let M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var kc=class{constructor(e={}){let{canvas:t=dd(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,p=null,M=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=rs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,E=!1;this._outputColorSpace=vn;let R=0,C=0,P=null,b=-1,S=null,I=new Lt,L=new Lt,N=null,W=new Ue(0),V=0,z=t.width,X=t.height,q=1,ee=null,ce=null,be=new Lt(0,0,z,X),Ce=new Lt(0,0,z,X),Fe=!1,Be=new kr,ke=!1,ne=!1,ie=new ot,ge=new k,ve=new Lt,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ze=!1;function ht(){return P===null?q:1}let O=i;function H(A,F){return t.getContext(A,F)}try{let A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",J,!1),O===null){let F="webgl2";if(O=H(F,A),O===null)throw H(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let B,$,Y,K,se,fe,Ae,Ie,D,T,j,he,Me,de,$e,Re,qe,Ge,Te,We,it,Qe,Oe,pt;function U(){B=new bx(O),B.init(),Qe=new Qv(O,B),$=new mx(O,B,e,Qe),Y=new Kv(O,B),$.reversedDepthBuffer&&d&&Y.buffers.depth.setReversed(!0),K=new Ex(O),se=new Ov,fe=new jv(O,B,Y,se,$,Qe,K),Ae=new xx(v),Ie=new Mx(v),D=new Im(O),Oe=new dx(O,D),T=new Sx(O,D,K,Oe),j=new Ax(O,T,D,K),Te=new Tx(O,$,fe),Re=new gx(se),he=new kv(v,Ae,Ie,B,$,Oe,Re),Me=new iy(v,se),de=new Bv,$e=new qv(B),Ge=new fx(v,Ae,Ie,Y,j,f,l),qe=new $v(v,j,$),pt=new sy(O,K,$,Y),We=new px(O,B,K),it=new wx(O,B,K),K.programs=he.programs,v.capabilities=$,v.extensions=B,v.properties=se,v.renderLists=de,v.shadowMap=qe,v.state=Y,v.info=K}U();let Z=new Nu(v,O);this.xr=Z,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let A=B.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=B.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(A){A!==void 0&&(q=A,this.setSize(z,X,!1))},this.getSize=function(A){return A.set(z,X)},this.setSize=function(A,F,te=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=A,X=F,t.width=Math.floor(A*q),t.height=Math.floor(F*q),te===!0&&(t.style.width=A+"px",t.style.height=F+"px"),this.setViewport(0,0,A,F)},this.getDrawingBufferSize=function(A){return A.set(z*q,X*q).floor()},this.setDrawingBufferSize=function(A,F,te){z=A,X=F,q=te,t.width=Math.floor(A*te),t.height=Math.floor(F*te),this.setViewport(0,0,A,F)},this.getCurrentViewport=function(A){return A.copy(I)},this.getViewport=function(A){return A.copy(be)},this.setViewport=function(A,F,te,ue){A.isVector4?be.set(A.x,A.y,A.z,A.w):be.set(A,F,te,ue),Y.viewport(I.copy(be).multiplyScalar(q).round())},this.getScissor=function(A){return A.copy(Ce)},this.setScissor=function(A,F,te,ue){A.isVector4?Ce.set(A.x,A.y,A.z,A.w):Ce.set(A,F,te,ue),Y.scissor(L.copy(Ce).multiplyScalar(q).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(A){Y.setScissorTest(Fe=A)},this.setOpaqueSort=function(A){ee=A},this.setTransparentSort=function(A){ce=A},this.getClearColor=function(A){return A.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(A=!0,F=!0,te=!0){let ue=0;if(A){let Q=!1;if(P!==null){let Ee=P.texture.format;Q=Ee===sc||Ee===ic||Ee===nc}if(Q){let Ee=P.texture.type,ze=Ee===Jn||Ee===Vi||Ee===qr||Ee===_s||Ee===ec||Ee===tc,nt=Ge.getClearColor(),Ke=Ge.getClearAlpha(),ft=nt.r,mt=nt.g,lt=nt.b;ze?(g[0]=ft,g[1]=mt,g[2]=lt,g[3]=Ke,O.clearBufferuiv(O.COLOR,0,g)):(x[0]=ft,x[1]=mt,x[2]=lt,x[3]=Ke,O.clearBufferiv(O.COLOR,0,x))}else ue|=O.COLOR_BUFFER_BIT}F&&(ue|=O.DEPTH_BUFFER_BIT),te&&(ue|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(ue)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",J,!1),Ge.dispose(),de.dispose(),$e.dispose(),se.dispose(),Ae.dispose(),Ie.dispose(),j.dispose(),Oe.dispose(),pt.dispose(),he.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",De),Z.removeEventListener("sessionend",It),Ft.stop()};function ae(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let A=K.autoReset,F=qe.enabled,te=qe.autoUpdate,ue=qe.needsUpdate,Q=qe.type;U(),K.autoReset=A,qe.enabled=F,qe.autoUpdate=te,qe.needsUpdate=ue,qe.type=Q}function J(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function re(A){let F=A.target;F.removeEventListener("dispose",re),me(F)}function me(A){ye(A),se.remove(A)}function ye(A){let F=se.get(A).programs;F!==void 0&&(F.forEach(function(te){he.releaseProgram(te)}),A.isShaderMaterial&&he.releaseShaderCache(A))}this.renderBufferDirect=function(A,F,te,ue,Q,Ee){F===null&&(F=Se);let ze=Q.isMesh&&Q.matrixWorld.determinant()<0,nt=Le(A,F,te,ue,Q);Y.setMaterial(ue,ze);let Ke=te.index,ft=1;if(ue.wireframe===!0){if(Ke=T.getWireframeAttribute(te),Ke===void 0)return;ft=2}let mt=te.drawRange,lt=te.attributes.position,wt=mt.start*ft,Ht=(mt.start+mt.count)*ft;Ee!==null&&(wt=Math.max(wt,Ee.start*ft),Ht=Math.min(Ht,(Ee.start+Ee.count)*ft)),Ke!==null?(wt=Math.max(wt,0),Ht=Math.min(Ht,Ke.count)):lt!=null&&(wt=Math.max(wt,0),Ht=Math.min(Ht,lt.count));let nn=Ht-wt;if(nn<0||nn===1/0)return;Oe.setup(Q,ue,nt,te,Ke);let Et,Ut=We;if(Ke!==null&&(Et=D.get(Ke),Ut=it,Ut.setIndex(Et)),Q.isMesh)ue.wireframe===!0?(Y.setLineWidth(ue.wireframeLinewidth*ht()),Ut.setMode(O.LINES)):Ut.setMode(O.TRIANGLES);else if(Q.isLine){let ut=ue.linewidth;ut===void 0&&(ut=1),Y.setLineWidth(ut*ht()),Q.isLineSegments?Ut.setMode(O.LINES):Q.isLineLoop?Ut.setMode(O.LINE_LOOP):Ut.setMode(O.LINE_STRIP)}else Q.isPoints?Ut.setMode(O.POINTS):Q.isSprite&&Ut.setMode(O.TRIANGLES);if(Q.isBatchedMesh)if(Q._multiDrawInstances!==null)Dr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ut.renderMultiDrawInstances(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount,Q._multiDrawInstances);else if(B.get("WEBGL_multi_draw"))Ut.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{let ut=Q._multiDrawStarts,$t=Q._multiDrawCounts,Rt=Q._multiDrawCount,dn=Ke?D.get(Ke).bytesPerElement:1,wi=se.get(ue).currentProgram.getUniforms();for(let On=0;On<Rt;On++)wi.setValue(O,"_gl_DrawID",On),Ut.render(ut[On]/dn,$t[On])}else if(Q.isInstancedMesh)Ut.renderInstances(wt,nn,Q.count);else if(te.isInstancedBufferGeometry){let ut=te._maxInstanceCount!==void 0?te._maxInstanceCount:1/0,$t=Math.min(te.instanceCount,ut);Ut.renderInstances(wt,nn,$t)}else Ut.render(wt,nn)};function Xe(A,F,te){A.transparent===!0&&A.side===Qt&&A.forceSinglePass===!1?(A.side=_n,A.needsUpdate=!0,oe(A,F,te),A.side=Ci,A.needsUpdate=!0,oe(A,F,te),A.side=Qt):oe(A,F,te)}this.compile=function(A,F,te=null){te===null&&(te=A),p=$e.get(te),p.init(F),y.push(p),te.traverseVisible(function(Q){Q.isLight&&Q.layers.test(F.layers)&&(p.pushLight(Q),Q.castShadow&&p.pushShadow(Q))}),A!==te&&A.traverseVisible(function(Q){Q.isLight&&Q.layers.test(F.layers)&&(p.pushLight(Q),Q.castShadow&&p.pushShadow(Q))}),p.setupLights();let ue=new Set;return A.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;let Ee=Q.material;if(Ee)if(Array.isArray(Ee))for(let ze=0;ze<Ee.length;ze++){let nt=Ee[ze];Xe(nt,te,Q),ue.add(nt)}else Xe(Ee,te,Q),ue.add(Ee)}),p=y.pop(),ue},this.compileAsync=function(A,F,te=null){let ue=this.compile(A,F,te);return new Promise(Q=>{function Ee(){if(ue.forEach(function(ze){se.get(ze).currentProgram.isReady()&&ue.delete(ze)}),ue.size===0){Q(A);return}setTimeout(Ee,10)}B.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let je=null;function le(A){je&&je(A)}function De(){Ft.stop()}function It(){Ft.start()}let Ft=new Wd;Ft.setAnimationLoop(le),typeof self<"u"&&Ft.setContext(self),this.setAnimationLoop=function(A){je=A,Z.setAnimationLoop(A),A===null?Ft.stop():Ft.start()},Z.addEventListener("sessionstart",De),Z.addEventListener("sessionend",It),this.render=function(A,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(F),F=Z.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,F,P),p=$e.get(A,y.length),p.init(F),y.push(p),ie.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Be.setFromProjectionMatrix(ie,Ri,F.reversedDepth),ne=this.localClippingEnabled,ke=Re.init(this.clippingPlanes,ne),m=de.get(A,M.length),m.init(),M.push(m),Z.enabled===!0&&Z.isPresenting===!0){let Ee=v.xr.getDepthSensingMesh();Ee!==null&&Yt(Ee,F,-1/0,v.sortObjects)}Yt(A,F,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ee,ce),Ze=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,Ze&&Ge.addToRenderList(m,A),this.info.render.frame++,ke===!0&&Re.beginShadows();let te=p.state.shadowsArray;qe.render(te,A,F),ke===!0&&Re.endShadows(),this.info.autoReset===!0&&this.info.reset();let ue=m.opaque,Q=m.transmissive;if(p.setupLights(),F.isArrayCamera){let Ee=F.cameras;if(Q.length>0)for(let ze=0,nt=Ee.length;ze<nt;ze++){let Ke=Ee[ze];rn(ue,Q,A,Ke)}Ze&&Ge.render(A);for(let ze=0,nt=Ee.length;ze<nt;ze++){let Ke=Ee[ze];fn(m,A,Ke,Ke.viewport)}}else Q.length>0&&rn(ue,Q,A,F),Ze&&Ge.render(A),fn(m,A,F);P!==null&&C===0&&(fe.updateMultisampleRenderTarget(P),fe.updateRenderTargetMipmap(P)),A.isScene===!0&&A.onAfterRender(v,A,F),Oe.resetDefaultState(),b=-1,S=null,y.pop(),y.length>0?(p=y[y.length-1],ke===!0&&Re.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function Yt(A,F,te,ue){if(A.visible===!1)return;if(A.layers.test(F.layers)){if(A.isGroup)te=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(F);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Be.intersectsSprite(A)){ue&&ve.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ie);let ze=j.update(A),nt=A.material;nt.visible&&m.push(A,ze,nt,te,ve.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Be.intersectsObject(A))){let ze=j.update(A),nt=A.material;if(ue&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ve.copy(A.boundingSphere.center)):(ze.boundingSphere===null&&ze.computeBoundingSphere(),ve.copy(ze.boundingSphere.center)),ve.applyMatrix4(A.matrixWorld).applyMatrix4(ie)),Array.isArray(nt)){let Ke=ze.groups;for(let ft=0,mt=Ke.length;ft<mt;ft++){let lt=Ke[ft],wt=nt[lt.materialIndex];wt&&wt.visible&&m.push(A,ze,wt,te,ve.z,lt)}}else nt.visible&&m.push(A,ze,nt,te,ve.z,null)}}let Ee=A.children;for(let ze=0,nt=Ee.length;ze<nt;ze++)Yt(Ee[ze],F,te,ue)}function fn(A,F,te,ue){let Q=A.opaque,Ee=A.transmissive,ze=A.transparent;p.setupLightsView(te),ke===!0&&Re.setGlobalState(v.clippingPlanes,te),ue&&Y.viewport(I.copy(ue)),Q.length>0&&ln(Q,F,te),Ee.length>0&&ln(Ee,F,te),ze.length>0&&ln(ze,F,te),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function rn(A,F,te,ue){if((te.isScene===!0?te.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ue.id]===void 0&&(p.state.transmissionRenderTarget[ue.id]=new pn(1,1,{generateMipmaps:!0,type:B.has("EXT_color_buffer_half_float")||B.has("EXT_color_buffer_float")?bn:Jn,minFilter:gi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Dt.workingColorSpace}));let Ee=p.state.transmissionRenderTarget[ue.id],ze=ue.viewport||I;Ee.setSize(ze.z*v.transmissionResolutionScale,ze.w*v.transmissionResolutionScale);let nt=v.getRenderTarget(),Ke=v.getActiveCubeFace(),ft=v.getActiveMipmapLevel();v.setRenderTarget(Ee),v.getClearColor(W),V=v.getClearAlpha(),V<1&&v.setClearColor(16777215,.5),v.clear(),Ze&&Ge.render(te);let mt=v.toneMapping;v.toneMapping=rs;let lt=ue.viewport;if(ue.viewport!==void 0&&(ue.viewport=void 0),p.setupLightsView(ue),ke===!0&&Re.setGlobalState(v.clippingPlanes,ue),ln(A,te,ue),fe.updateMultisampleRenderTarget(Ee),fe.updateRenderTargetMipmap(Ee),B.has("WEBGL_multisampled_render_to_texture")===!1){let wt=!1;for(let Ht=0,nn=F.length;Ht<nn;Ht++){let Et=F[Ht],Ut=Et.object,ut=Et.geometry,$t=Et.material,Rt=Et.group;if($t.side===Qt&&Ut.layers.test(ue.layers)){let dn=$t.side;$t.side=_n,$t.needsUpdate=!0,ri(Ut,te,ue,ut,$t,Rt),$t.side=dn,$t.needsUpdate=!0,wt=!0}}wt===!0&&(fe.updateMultisampleRenderTarget(Ee),fe.updateRenderTargetMipmap(Ee))}v.setRenderTarget(nt,Ke,ft),v.setClearColor(W,V),lt!==void 0&&(ue.viewport=lt),v.toneMapping=mt}function ln(A,F,te){let ue=F.isScene===!0?F.overrideMaterial:null;for(let Q=0,Ee=A.length;Q<Ee;Q++){let ze=A[Q],nt=ze.object,Ke=ze.geometry,ft=ze.group,mt=ze.material;mt.allowOverride===!0&&ue!==null&&(mt=ue),nt.layers.test(te.layers)&&ri(nt,F,te,Ke,mt,ft)}}function ri(A,F,te,ue,Q,Ee){A.onBeforeRender(v,F,te,ue,Q,Ee),A.modelViewMatrix.multiplyMatrices(te.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Q.onBeforeRender(v,F,te,ue,A,Ee),Q.transparent===!0&&Q.side===Qt&&Q.forceSinglePass===!1?(Q.side=_n,Q.needsUpdate=!0,v.renderBufferDirect(te,F,ue,Q,A,Ee),Q.side=Ci,Q.needsUpdate=!0,v.renderBufferDirect(te,F,ue,Q,A,Ee),Q.side=Qt):v.renderBufferDirect(te,F,ue,Q,A,Ee),A.onAfterRender(v,F,te,ue,Q,Ee)}function oe(A,F,te){F.isScene!==!0&&(F=Se);let ue=se.get(A),Q=p.state.lights,Ee=p.state.shadowsArray,ze=Q.state.version,nt=he.getParameters(A,Q.state,Ee,F,te),Ke=he.getProgramCacheKey(nt),ft=ue.programs;ue.environment=A.isMeshStandardMaterial?F.environment:null,ue.fog=F.fog,ue.envMap=(A.isMeshStandardMaterial?Ie:Ae).get(A.envMap||ue.environment),ue.envMapRotation=ue.environment!==null&&A.envMap===null?F.environmentRotation:A.envMapRotation,ft===void 0&&(A.addEventListener("dispose",re),ft=new Map,ue.programs=ft);let mt=ft.get(Ke);if(mt!==void 0){if(ue.currentProgram===mt&&ue.lightsStateVersion===ze)return G(A,nt),mt}else nt.uniforms=he.getUniforms(A),A.onBeforeCompile(nt,v),mt=he.acquireProgram(nt,Ke),ft.set(Ke,mt),ue.uniforms=nt.uniforms;let lt=ue.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(lt.clippingPlanes=Re.uniform),G(A,nt),ue.needsLights=et(A),ue.lightsStateVersion=ze,ue.needsLights&&(lt.ambientLightColor.value=Q.state.ambient,lt.lightProbe.value=Q.state.probe,lt.directionalLights.value=Q.state.directional,lt.directionalLightShadows.value=Q.state.directionalShadow,lt.spotLights.value=Q.state.spot,lt.spotLightShadows.value=Q.state.spotShadow,lt.rectAreaLights.value=Q.state.rectArea,lt.ltc_1.value=Q.state.rectAreaLTC1,lt.ltc_2.value=Q.state.rectAreaLTC2,lt.pointLights.value=Q.state.point,lt.pointLightShadows.value=Q.state.pointShadow,lt.hemisphereLights.value=Q.state.hemi,lt.directionalShadowMap.value=Q.state.directionalShadowMap,lt.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,lt.spotShadowMap.value=Q.state.spotShadowMap,lt.spotLightMatrix.value=Q.state.spotLightMatrix,lt.spotLightMap.value=Q.state.spotLightMap,lt.pointShadowMap.value=Q.state.pointShadowMap,lt.pointShadowMatrix.value=Q.state.pointShadowMatrix),ue.currentProgram=mt,ue.uniformsList=null,mt}function pe(A){if(A.uniformsList===null){let F=A.currentProgram.getUniforms();A.uniformsList=$r.seqWithValue(F.seq,A.uniforms)}return A.uniformsList}function G(A,F){let te=se.get(A);te.outputColorSpace=F.outputColorSpace,te.batching=F.batching,te.batchingColor=F.batchingColor,te.instancing=F.instancing,te.instancingColor=F.instancingColor,te.instancingMorph=F.instancingMorph,te.skinning=F.skinning,te.morphTargets=F.morphTargets,te.morphNormals=F.morphNormals,te.morphColors=F.morphColors,te.morphTargetsCount=F.morphTargetsCount,te.numClippingPlanes=F.numClippingPlanes,te.numIntersection=F.numClipIntersection,te.vertexAlphas=F.vertexAlphas,te.vertexTangents=F.vertexTangents,te.toneMapping=F.toneMapping}function Le(A,F,te,ue,Q){F.isScene!==!0&&(F=Se),fe.resetTextureUnits();let Ee=F.fog,ze=ue.isMeshStandardMaterial?F.environment:null,nt=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Hs,Ke=(ue.isMeshStandardMaterial?Ie:Ae).get(ue.envMap||ze),ft=ue.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,mt=!!te.attributes.tangent&&(!!ue.normalMap||ue.anisotropy>0),lt=!!te.morphAttributes.position,wt=!!te.morphAttributes.normal,Ht=!!te.morphAttributes.color,nn=rs;ue.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(nn=v.toneMapping);let Et=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Ut=Et!==void 0?Et.length:0,ut=se.get(ue),$t=p.state.lights;if(ke===!0&&(ne===!0||A!==S)){let Yn=A===S&&ue.id===b;Re.setState(ue,A,Yn)}let Rt=!1;ue.version===ut.__version?(ut.needsLights&&ut.lightsStateVersion!==$t.state.version||ut.outputColorSpace!==nt||Q.isBatchedMesh&&ut.batching===!1||!Q.isBatchedMesh&&ut.batching===!0||Q.isBatchedMesh&&ut.batchingColor===!0&&Q.colorTexture===null||Q.isBatchedMesh&&ut.batchingColor===!1&&Q.colorTexture!==null||Q.isInstancedMesh&&ut.instancing===!1||!Q.isInstancedMesh&&ut.instancing===!0||Q.isSkinnedMesh&&ut.skinning===!1||!Q.isSkinnedMesh&&ut.skinning===!0||Q.isInstancedMesh&&ut.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&ut.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&ut.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&ut.instancingMorph===!1&&Q.morphTexture!==null||ut.envMap!==Ke||ue.fog===!0&&ut.fog!==Ee||ut.numClippingPlanes!==void 0&&(ut.numClippingPlanes!==Re.numPlanes||ut.numIntersection!==Re.numIntersection)||ut.vertexAlphas!==ft||ut.vertexTangents!==mt||ut.morphTargets!==lt||ut.morphNormals!==wt||ut.morphColors!==Ht||ut.toneMapping!==nn||ut.morphTargetsCount!==Ut)&&(Rt=!0):(Rt=!0,ut.__version=ue.version);let dn=ut.currentProgram;Rt===!0&&(dn=oe(ue,F,Q));let wi=!1,On=!1,ls=!1,Vt=dn.getUniforms(),qn=ut.uniforms;if(Y.useProgram(dn.program)&&(wi=!0,On=!0,ls=!0),ue.id!==b&&(b=ue.id,On=!0),wi||S!==A){Y.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Vt.setValue(O,"projectionMatrix",A.projectionMatrix),Vt.setValue(O,"viewMatrix",A.matrixWorldInverse);let Qn=Vt.map.cameraPosition;Qn!==void 0&&Qn.setValue(O,ge.setFromMatrixPosition(A.matrixWorld)),$.logarithmicDepthBuffer&&Vt.setValue(O,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(ue.isMeshPhongMaterial||ue.isMeshToonMaterial||ue.isMeshLambertMaterial||ue.isMeshBasicMaterial||ue.isMeshStandardMaterial||ue.isShaderMaterial)&&Vt.setValue(O,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,On=!0,ls=!0)}if(Q.isSkinnedMesh){Vt.setOptional(O,Q,"bindMatrix"),Vt.setOptional(O,Q,"bindMatrixInverse");let Yn=Q.skeleton;Yn&&(Yn.boneTexture===null&&Yn.computeBoneTexture(),Vt.setValue(O,"boneTexture",Yn.boneTexture,fe))}Q.isBatchedMesh&&(Vt.setOptional(O,Q,"batchingTexture"),Vt.setValue(O,"batchingTexture",Q._matricesTexture,fe),Vt.setOptional(O,Q,"batchingIdTexture"),Vt.setValue(O,"batchingIdTexture",Q._indirectTexture,fe),Vt.setOptional(O,Q,"batchingColorTexture"),Q._colorsTexture!==null&&Vt.setValue(O,"batchingColorTexture",Q._colorsTexture,fe));let pi=te.morphAttributes;if((pi.position!==void 0||pi.normal!==void 0||pi.color!==void 0)&&Te.update(Q,te,dn),(On||ut.receiveShadow!==Q.receiveShadow)&&(ut.receiveShadow=Q.receiveShadow,Vt.setValue(O,"receiveShadow",Q.receiveShadow)),ue.isMeshGouraudMaterial&&ue.envMap!==null&&(qn.envMap.value=Ke,qn.flipEnvMap.value=Ke.isCubeTexture&&Ke.isRenderTargetTexture===!1?-1:1),ue.isMeshStandardMaterial&&ue.envMap===null&&F.environment!==null&&(qn.envMapIntensity.value=F.environmentIntensity),On&&(Vt.setValue(O,"toneMappingExposure",v.toneMappingExposure),ut.needsLights&&He(qn,ls),Ee&&ue.fog===!0&&Me.refreshFogUniforms(qn,Ee),Me.refreshMaterialUniforms(qn,ue,q,X,p.state.transmissionRenderTarget[A.id]),$r.upload(O,pe(ut),qn,fe)),ue.isShaderMaterial&&ue.uniformsNeedUpdate===!0&&($r.upload(O,pe(ut),qn,fe),ue.uniformsNeedUpdate=!1),ue.isSpriteMaterial&&Vt.setValue(O,"center",Q.center),Vt.setValue(O,"modelViewMatrix",Q.modelViewMatrix),Vt.setValue(O,"normalMatrix",Q.normalMatrix),Vt.setValue(O,"modelMatrix",Q.matrixWorld),ue.isShaderMaterial||ue.isRawShaderMaterial){let Yn=ue.uniformsGroups;for(let Qn=0,dh=Yn.length;Qn<dh;Qn++){let Us=Yn[Qn];pt.update(Us,dn),pt.bind(Us,dn)}}return dn}function He(A,F){A.ambientLightColor.needsUpdate=F,A.lightProbe.needsUpdate=F,A.directionalLights.needsUpdate=F,A.directionalLightShadows.needsUpdate=F,A.pointLights.needsUpdate=F,A.pointLightShadows.needsUpdate=F,A.spotLights.needsUpdate=F,A.spotLightShadows.needsUpdate=F,A.rectAreaLights.needsUpdate=F,A.hemisphereLights.needsUpdate=F}function et(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,F,te){let ue=se.get(A);ue.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,ue.__autoAllocateDepthBuffer===!1&&(ue.__useRenderToTexture=!1),se.get(A.texture).__webglTexture=F,se.get(A.depthTexture).__webglTexture=ue.__autoAllocateDepthBuffer?void 0:te,ue.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,F){let te=se.get(A);te.__webglFramebuffer=F,te.__useDefaultFramebuffer=F===void 0};let _e=O.createFramebuffer();this.setRenderTarget=function(A,F=0,te=0){P=A,R=F,C=te;let ue=!0,Q=null,Ee=!1,ze=!1;if(A){let Ke=se.get(A);if(Ke.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(O.FRAMEBUFFER,null),ue=!1;else if(Ke.__webglFramebuffer===void 0)fe.setupRenderTarget(A);else if(Ke.__hasExternalTextures)fe.rebindTextures(A,se.get(A.texture).__webglTexture,se.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let lt=A.depthTexture;if(Ke.__boundDepthTexture!==lt){if(lt!==null&&se.has(lt)&&(A.width!==lt.image.width||A.height!==lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(A)}}let ft=A.texture;(ft.isData3DTexture||ft.isDataArrayTexture||ft.isCompressedArrayTexture)&&(ze=!0);let mt=se.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(mt[F])?Q=mt[F][te]:Q=mt[F],Ee=!0):A.samples>0&&fe.useMultisampledRTT(A)===!1?Q=se.get(A).__webglMultisampledFramebuffer:Array.isArray(mt)?Q=mt[te]:Q=mt,I.copy(A.viewport),L.copy(A.scissor),N=A.scissorTest}else I.copy(be).multiplyScalar(q).floor(),L.copy(Ce).multiplyScalar(q).floor(),N=Fe;if(te!==0&&(Q=_e),Y.bindFramebuffer(O.FRAMEBUFFER,Q)&&ue&&Y.drawBuffers(A,Q),Y.viewport(I),Y.scissor(L),Y.setScissorTest(N),Ee){let Ke=se.get(A.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ke.__webglTexture,te)}else if(ze){let Ke=F;for(let ft=0;ft<A.textures.length;ft++){let mt=se.get(A.textures[ft]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+ft,mt.__webglTexture,te,Ke)}}else if(A!==null&&te!==0){let Ke=se.get(A.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ke.__webglTexture,te)}b=-1},this.readRenderTargetPixels=function(A,F,te,ue,Q,Ee,ze,nt=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ke=se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ze!==void 0&&(Ke=Ke[ze]),Ke){Y.bindFramebuffer(O.FRAMEBUFFER,Ke);try{let ft=A.textures[nt],mt=ft.format,lt=ft.type;if(!$.textureFormatReadable(mt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$.textureTypeReadable(lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=A.width-ue&&te>=0&&te<=A.height-Q&&(A.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+nt),O.readPixels(F,te,ue,Q,Qe.convert(mt),Qe.convert(lt),Ee))}finally{let ft=P!==null?se.get(P).__webglFramebuffer:null;Y.bindFramebuffer(O.FRAMEBUFFER,ft)}}},this.readRenderTargetPixelsAsync=async function(A,F,te,ue,Q,Ee,ze,nt=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ke=se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ze!==void 0&&(Ke=Ke[ze]),Ke)if(F>=0&&F<=A.width-ue&&te>=0&&te<=A.height-Q){Y.bindFramebuffer(O.FRAMEBUFFER,Ke);let ft=A.textures[nt],mt=ft.format,lt=ft.type;if(!$.textureFormatReadable(mt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$.textureTypeReadable(lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let wt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,wt),O.bufferData(O.PIXEL_PACK_BUFFER,Ee.byteLength,O.STREAM_READ),A.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+nt),O.readPixels(F,te,ue,Q,Qe.convert(mt),Qe.convert(lt),0);let Ht=P!==null?se.get(P).__webglFramebuffer:null;Y.bindFramebuffer(O.FRAMEBUFFER,Ht);let nn=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await pd(O,nn,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,wt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Ee),O.deleteBuffer(wt),O.deleteSync(nn),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,F=null,te=0){let ue=Math.pow(2,-te),Q=Math.floor(A.image.width*ue),Ee=Math.floor(A.image.height*ue),ze=F!==null?F.x:0,nt=F!==null?F.y:0;fe.setTexture2D(A,0),O.copyTexSubImage2D(O.TEXTURE_2D,te,0,0,ze,nt,Q,Ee),Y.unbindTexture()};let xt=O.createFramebuffer(),st=O.createFramebuffer();this.copyTextureToTexture=function(A,F,te=null,ue=null,Q=0,Ee=null){Ee===null&&(Q!==0?(Dr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ee=Q,Q=0):Ee=0);let ze,nt,Ke,ft,mt,lt,wt,Ht,nn,Et=A.isCompressedTexture?A.mipmaps[Ee]:A.image;if(te!==null)ze=te.max.x-te.min.x,nt=te.max.y-te.min.y,Ke=te.isBox3?te.max.z-te.min.z:1,ft=te.min.x,mt=te.min.y,lt=te.isBox3?te.min.z:0;else{let pi=Math.pow(2,-Q);ze=Math.floor(Et.width*pi),nt=Math.floor(Et.height*pi),A.isDataArrayTexture?Ke=Et.depth:A.isData3DTexture?Ke=Math.floor(Et.depth*pi):Ke=1,ft=0,mt=0,lt=0}ue!==null?(wt=ue.x,Ht=ue.y,nn=ue.z):(wt=0,Ht=0,nn=0);let Ut=Qe.convert(F.format),ut=Qe.convert(F.type),$t;F.isData3DTexture?(fe.setTexture3D(F,0),$t=O.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(fe.setTexture2DArray(F,0),$t=O.TEXTURE_2D_ARRAY):(fe.setTexture2D(F,0),$t=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,F.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,F.unpackAlignment);let Rt=O.getParameter(O.UNPACK_ROW_LENGTH),dn=O.getParameter(O.UNPACK_IMAGE_HEIGHT),wi=O.getParameter(O.UNPACK_SKIP_PIXELS),On=O.getParameter(O.UNPACK_SKIP_ROWS),ls=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Et.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Et.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ft),O.pixelStorei(O.UNPACK_SKIP_ROWS,mt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,lt);let Vt=A.isDataArrayTexture||A.isData3DTexture,qn=F.isDataArrayTexture||F.isData3DTexture;if(A.isDepthTexture){let pi=se.get(A),Yn=se.get(F),Qn=se.get(pi.__renderTarget),dh=se.get(Yn.__renderTarget);Y.bindFramebuffer(O.READ_FRAMEBUFFER,Qn.__webglFramebuffer),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,dh.__webglFramebuffer);for(let Us=0;Us<Ke;Us++)Vt&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,se.get(A).__webglTexture,Q,lt+Us),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,se.get(F).__webglTexture,Ee,nn+Us)),O.blitFramebuffer(ft,mt,ze,nt,wt,Ht,ze,nt,O.DEPTH_BUFFER_BIT,O.NEAREST);Y.bindFramebuffer(O.READ_FRAMEBUFFER,null),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(Q!==0||A.isRenderTargetTexture||se.has(A)){let pi=se.get(A),Yn=se.get(F);Y.bindFramebuffer(O.READ_FRAMEBUFFER,xt),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,st);for(let Qn=0;Qn<Ke;Qn++)Vt?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,pi.__webglTexture,Q,lt+Qn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,pi.__webglTexture,Q),qn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Yn.__webglTexture,Ee,nn+Qn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Yn.__webglTexture,Ee),Q!==0?O.blitFramebuffer(ft,mt,ze,nt,wt,Ht,ze,nt,O.COLOR_BUFFER_BIT,O.NEAREST):qn?O.copyTexSubImage3D($t,Ee,wt,Ht,nn+Qn,ft,mt,ze,nt):O.copyTexSubImage2D($t,Ee,wt,Ht,ft,mt,ze,nt);Y.bindFramebuffer(O.READ_FRAMEBUFFER,null),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else qn?A.isDataTexture||A.isData3DTexture?O.texSubImage3D($t,Ee,wt,Ht,nn,ze,nt,Ke,Ut,ut,Et.data):F.isCompressedArrayTexture?O.compressedTexSubImage3D($t,Ee,wt,Ht,nn,ze,nt,Ke,Ut,Et.data):O.texSubImage3D($t,Ee,wt,Ht,nn,ze,nt,Ke,Ut,ut,Et):A.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Ee,wt,Ht,ze,nt,Ut,ut,Et.data):A.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Ee,wt,Ht,Et.width,Et.height,Ut,Et.data):O.texSubImage2D(O.TEXTURE_2D,Ee,wt,Ht,ze,nt,Ut,ut,Et);O.pixelStorei(O.UNPACK_ROW_LENGTH,Rt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,dn),O.pixelStorei(O.UNPACK_SKIP_PIXELS,wi),O.pixelStorei(O.UNPACK_SKIP_ROWS,On),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ls),Ee===0&&F.generateMipmaps&&O.generateMipmap($t),Y.unbindTexture()},this.initRenderTarget=function(A){se.get(A).__webglFramebuffer===void 0&&fe.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?fe.setTextureCube(A,0):A.isData3DTexture?fe.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?fe.setTexture2DArray(A,0):fe.setTexture2D(A,0),Y.unbindTexture()},this.resetState=function(){R=0,C=0,P=null,Y.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Dt._getUnpackColorSpace()}};var zc={1:{key:"mesa",name:"SHATTERED MESA",kind:"organic",enclosed:!1,sky:{zenith:"#141c48",mid:"#5a4c86",horizon:"#ffb07a",glow:"#ffd29a",stars:.25},sun:{color:"#ffcf9e",intensity:3.6,dir:[-.7,.55,.42]},hemi:{sky:"#a9b8ff",ground:"#5b2a1c",intensity:.85},fog:{color:"#d39a82",near:700,far:5600},exposure:1.05,rock:{base:"#a2573a",dark:"#4a1f14",light:"#e09a6a",strata:1,wet:0},top:{color:"#c99364",rough:.95},crystal:"#58d8ff",accent:"#63eeff",spike:"#7fe6ff",bloom:.55,backdrop:"mesa",ambient:"dust",grade:{lift:[.02,0,.01],gain:[1.05,.98,.92],sat:1.08},planet:{color:"#d9a88a",band:"#8f5b4a",ring:"#f0d4b8",pos:[-900,560,-5200],r:900}},2:{key:"vaults",name:"DROWNED VAULTS",kind:"organic",enclosed:!0,sky:{zenith:"#03121a",mid:"#06303a",horizon:"#0d5a62",glow:"#2fd0c0",stars:0},sun:{color:"#9fe8ff",intensity:1.7,dir:[.3,.42,.86]},hemi:{sky:"#3fb6c4",ground:"#071b1e",intensity:.75},fog:{color:"#0b3a40",near:250,far:1500},exposure:1.15,rock:{base:"#3e5a5e",dark:"#0e1d22",light:"#7fa6a0",strata:0,wet:1},top:{color:"#2c6a52",rough:.45},crystal:"#3cffd2",accent:"#88ffe5",spike:"#4dffe0",bloom:.75,backdrop:"cavern",ambient:"motes",grade:{lift:[0,.015,.02],gain:[.92,1.02,1.05],sat:1.05}},3:{key:"rift",name:"RIFT RUN",kind:"organic",enclosed:!1,sky:{zenith:"#05061a",mid:"#1c1a4a",horizon:"#6a5cc8",glow:"#b8a2ff",stars:1},sun:{color:"#ffd9c0",intensity:3.2,dir:[.45,.65,.5]},hemi:{sky:"#9c9cff",ground:"#1c1426",intensity:.95},fog:{color:"#3a2f6a",near:700,far:5200},exposure:1.25,rock:{base:"#6a6488",dark:"#1d1a30",light:"#b4aed0",strata:.8,wet:0},top:{color:"#7a7090",rough:.85},crystal:"#b296ff",accent:"#ba96ff",spike:"#c8b0ff",bloom:.7,backdrop:"rift",ambient:"speed",grade:{lift:[.01,.01,.03],gain:[.96,.97,1.06],sat:1.05},planet:{color:"#7b8ad8",band:"#3a3f80",ring:null,pos:[1800,1100,-6e3],r:1300}},4:{key:"foundry",name:"CINDER FOUNDRY",kind:"industrial",enclosed:!0,sky:{zenith:"#0a0808",mid:"#1e1612",horizon:"#3a2016",glow:"#ff7a32",stars:0},sun:{color:"#ffd2a8",intensity:3,dir:[-.35,.4,.85]},hemi:{sky:"#ffbe8a",ground:"#2a1c16",intensity:1.05},fog:{color:"#33201a",near:340,far:2e3},exposure:1.32,rock:{base:"#746e72",dark:"#1a1719",light:"#a49aa0",strata:0,wet:0},top:{color:"#6b6466",rough:.55},crystal:"#ffb35a",accent:"#ff8a3c",spike:"#ff6a2a",bloom:.8,backdrop:"foundry",ambient:"embers",grade:{lift:[.02,.01,0],gain:[1.06,.98,.9],sat:1.06}},5:{key:"spire",name:"THE HOLLOW SPIRE",kind:"organic",enclosed:!0,sky:{zenith:"#0c0414",mid:"#2a0c36",horizon:"#5a1c5c",glow:"#d06bff",stars:.4},sun:{color:"#e0b8ff",intensity:1.9,dir:[.32,.42,.85]},hemi:{sky:"#b070ff",ground:"#180a12",intensity:.7},fog:{color:"#2a0f34",near:260,far:1600},exposure:1.15,rock:{base:"#4a3550",dark:"#140a18",light:"#8a6a96",strata:0,wet:.6},top:{color:"#5a2a4a",rough:.5},crystal:"#c88cff",accent:"#b7ff68",spike:"#b7ff68",bloom:.85,backdrop:"spire",ambient:"spores",grade:{lift:[.02,0,.03],gain:[1.02,.95,1.06],sat:1.1}}};function $d(n){return zc[n&&n.world]||zc[1]}function Gn(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new Tt,c=0;for(let h=0;h<n.length;++h){let u=n[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<n.length;++d){let f=n[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=n[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Jd(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<o[h].length;++x)f.push(o[h][x][d]);let g=Jd(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Jd(n){let e,t,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Nt(o,t,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<t;g++){let x=h.getComponent(d,g);a.setComponent(d+u,g,x)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function Bc(n,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},i=n.getIndex(),s=n.getAttribute("position"),r=i?i.count:s.count,o=0,a=Object.keys(n.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],d=["setX","setY","setZ","setW"];for(let M=0,y=a.length;M<y;M++){let v=a[M],E=n.attributes[v];l[v]=new E.constructor(new E.array.constructor(E.count*E.itemSize),E.itemSize,E.normalized);let R=n.morphAttributes[v];R&&(c[v]||(c[v]=[]),R.forEach((C,P)=>{let b=new C.array.constructor(C.count*C.itemSize);c[v][P]=new C.constructor(b,C.itemSize,C.normalized)}))}let f=e*.5,g=Math.log10(1/e),x=Math.pow(10,g),m=f*x;for(let M=0;M<r;M++){let y=i?i.getX(M):M,v="";for(let E=0,R=a.length;E<R;E++){let C=a[E],P=n.getAttribute(C),b=P.itemSize;for(let S=0;S<b;S++)v+=`${~~(P[u[S]](y)*x+m)},`}if(v in t)h.push(t[v]);else{for(let E=0,R=a.length;E<R;E++){let C=a[E],P=n.getAttribute(C),b=n.morphAttributes[C],S=P.itemSize,I=l[C],L=c[C];for(let N=0;N<S;N++){let W=u[N],V=d[N];if(I[V](o,P[W](y)),b)for(let z=0,X=b.length;z<X;z++)L[z][V](o,b[z][W](y))}}t[v]=o,h.push(o),o++}}let p=n.clone();for(let M in n.attributes){let y=l[M];if(p.setAttribute(M,new y.constructor(y.array.slice(0,o*y.itemSize),y.itemSize,y.normalized)),M in c)for(let v=0;v<c[M].length;v++){let E=c[M][v];p.morphAttributes[M][v]=new E.constructor(E.array.slice(0,o*E.itemSize),E.itemSize,E.normalized)}}return p.setIndex(h),p}function Vc(n){let e=n>>>0||1;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Di(n,e,t){let i=Math.imul(n,374761393)+Math.imul(e,668265263)+Math.imul(t,2147483647);return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}var ga=n=>n*n*(3-2*n);function xa(n,e,t){let i=Math.floor(n),s=Math.floor(e),r=Math.floor(t),o=ga(n-i),a=ga(e-s),l=ga(t-r),c=(h,u,d)=>h+(u-h)*d;return c(c(c(Di(i,s,r),Di(i+1,s,r),o),c(Di(i,s+1,r),Di(i+1,s+1,r),o),a),c(c(Di(i,s,r+1),Di(i+1,s,r+1),o),c(Di(i,s+1,r+1),Di(i+1,s+1,r+1),o),a),l)*2-1}function Tn(n,e,t,i=3){let s=0,r=.5,o=1;for(let a=0;a<i;a++)s+=r*xa(n*o,e*o,t*o),o*=2.03,r*=.5;return s}function ku(n,e,t,i=3){let s=0,r=.5,o=1;for(let a=0;a<i;a++)s+=r*(1-Math.abs(xa(n*o,e*o,t*o))),o*=2.1,r*=.5;return s}function Hc(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=ga(n-s),a=ga(e-r),l=(f,g)=>Di((f%t+t)%t,(g%t+t)%t,i),c=l(s,r),h=l(s+1,r),u=l(s,r+1),d=l(s+1,r+1);return c+(h-c)*o+(u-c)*a+(c-h-u+d)*o*a}function ry(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=9,a=9;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let h=s+c,u=r+l,d=(h%t+t)%t,f=(u%t+t)%t,g=h+Di(d,f,i),x=u+Di(d,f,i+7),m=Math.hypot(g-n,x-e);m<o?(a=o,o=m):m<a&&(a=m)}return[o,a]}var Wi=null;function Kd(){if(Wi)return Wi;let n=256,e=new Uint8Array(n*n*4);for(let t=0;t<n;t++)for(let i=0;i<n;i++){let s=i/n,r=t/n,o=0,a=.5,l=8;for(let x=0;x<5;x++)o+=a*Hc(s*l,r*l,l,11+x),a*=.5,l*=2;let[c,h]=ry(s*10,r*10,10,3),u=Math.max(0,1-(h-c)*7),d=Hc(s*128,r*128,128,5)*.6+Hc(s*64,r*64,64,6)*.4,f=0;a=.5,l=2;for(let x=0;x<3;x++)f+=a*Hc(s*l,r*l,l,21+x),a*=.5,l*=2;let g=(t*n+i)*4;e[g]=o*255,e[g+1]=u*255,e[g+2]=d*255,e[g+3]=f/.875*255}return Wi=new Nn(e,n,n,Sn),Wi.wrapS=Wi.wrapT=Hn,Wi.magFilter=Un,Wi.minFilter=gi,Wi.generateMipmaps=!0,Wi.needsUpdate=!0,Wi}var Li=`
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
`;var jr=n=>new Ue(n);function ar(n,e={}){let t=n.kind==="industrial"||e.industrial,i=new Kt({color:16777215,roughness:.9,metalness:t?.55:0,vertexColors:!0,flatShading:!1}),s={uDetail:{value:Kd()},uTime:{value:0},uRockBase:{value:jr(e.base||n.rock.base)},uRockDark:{value:jr(n.rock.dark)},uRockLight:{value:jr(n.rock.light)},uTop:{value:jr(e.top||n.top.color)},uTopRough:{value:n.top.rough},uStrata:{value:e.strata??n.rock.strata},uWet:{value:n.rock.wet},uCrystal:{value:jr(n.crystal)},uVein:{value:e.vein??(t?0:1)},uIndustrial:{value:t?1:0},uBump:{value:e.bump??(t?1.2:2.2)},uWaterMask:{value:e.waterMask||null},uHasWater:{value:e.waterMask?1:0},uWaterTop:{value:e.waterTop??-1e4},uLevelSize:{value:new we(e.cols||1,e.rows||1)},uHeat:{value:e.heat??(n.key==="foundry"?1:0)},uPulse:{value:n.key==="spire"?1:0},uAccent:{value:jr(n.accent)}};return i.userData.uniforms=s,i.onBeforeCompile=r=>{Object.assign(r.uniforms,s),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;varying vec3 vWNormal;`).replace("#include <project_vertex>",`#include <project_vertex>
vWPos=(modelMatrix*vec4(transformed,1.)).xyz;vWNormal=normalize(mat3(modelMatrix)*objectNormal);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;varying vec3 vWNormal;
uniform sampler2D uDetail;uniform float uTime,uTopRough,uStrata,uWet,uVein,uIndustrial,uBump,uHasWater,uHeat,uPulse,uWaterTop;
uniform vec3 uRockBase,uRockDark,uRockLight,uTop,uCrystal,uAccent;uniform sampler2D uWaterMask;uniform vec2 uLevelSize;
float gH,gGrain,gWet,gVein,gUnder,gSeam,gLit;vec3 gCaus;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec4 tri4(vec3 p,vec3 w,float s){return texture2D(uDetail,p.zy*s)*w.x+texture2D(uDetail,p.xz*s)*w.y+texture2D(uDetail,p.xy*s)*w.z;}
// sharp caustic web (iterated warp), one sample per colour so the bright lines split into a faint spectrum
float caustic(vec2 p,float t){p=mod(p,6.2832)-250.;vec2 i=p;float c=1.;for(int n=0;n<4;n++){float tt=t*(1.-3.5/float(n+1));
  i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/.005),p.y/(cos(i.y+tt)/.005)));}
  c/=4.;c=1.17-pow(c,1.4);return pow(abs(c),8.);}
vec3 causticRGB(vec2 p,float t){return vec3(caustic(p+vec2(.035,0.),t),caustic(p,t),caustic(p-vec2(.035,0.),t));}
vec3 perturbN(vec3 sp,vec3 sn,vec2 dH,float fd){vec3 sx=normalize(dFdx(sp)),sy=normalize(dFdy(sp));vec3 r1=cross(sy,sn),r2=cross(sn,sx);float det=dot(sx,r1)*fd;vec3 g=sign(det)*(dH.x*r1+dH.y*r2);return normalize(abs(det)*sn-g);}
`).replace("#include <map_fragment>",`
vec3 wn=normalize(vWNormal);vec3 tw=pow(abs(wn),vec3(4.));tw/=dot(tw,vec3(1.));
vec4 d=tri4(vWPos,tw,1./96.);vec4 d2=tri4(vWPos,tw,1./410.);vec4 d3=tri4(vWPos,tw,1./23.);
float n=d.r,crack=d.g,grain=d3.b,broad=d2.a;gGrain=grain;
vec3 rock=mix(uRockDark,uRockBase,smoothstep(.12,.78,n*.75+broad*.55));
rock=mix(rock,uRockLight,smoothstep(.62,.98,n*.8+d3.r*.35)*.45);
// sedimentary strata: warped bands with their own tint, thin dark partings between them
float sy=(vWPos.y+broad*46.+d.r*6.)/17.;float bid=floor(sy);float bf=fract(sy);float fw=min(.5,fwidth(sy)*1.5);
vec3 bandA=mix(uRockBase,uRockLight,h21(vec2(bid,3.7))*.75)*(.78+.34*h21(vec2(bid,8.1)));
vec3 bandB=mix(uRockBase,uRockLight,h21(vec2(bid+1.,3.7))*.75)*(.78+.34*h21(vec2(bid+1.,8.1)));
vec3 bandCol=mix(bandA,bandB,smoothstep(1.-fw-.12,1.,bf));
float parting=(1.-smoothstep(0.,.07+fw,min(bf,1.-bf)))*(1.-smoothstep(.3,.5,fw));
rock=mix(rock,bandCol*(.8+n*.4),uStrata*.7);rock*=1.-uStrata*parting*.28;
rock*=1.-smoothstep(.86,.98,crack)*.3*(1.-uIndustrial);
rock*=.86+.28*smoothstep(.2,.8,broad);
float up=smoothstep(.5,.86,wn.y+(n-.5)*.4+(grain-.5)*.15);
vec3 topc=uTop*(.72+grain*.5)*(.85+broad*.3);
vec3 col=mix(rock,topc,up*(1.-uIndustrial*.55));
gH=n*.7+d3.r*.35-smoothstep(.8,1.,crack)*.4*(1.-uIndustrial)+grain*.12-uStrata*parting*.5;
gSeam=0.;gLit=0.;
if(uIndustrial>.5){
  vec2 pp=abs(wn.x)>.6?vWPos.zy:(abs(wn.y)>.6?vWPos.xz:vWPos.xy);
  vec2 cs=vec2(40.,20.);vec2 f=fract(pp/cs);vec2 e=min(f,1.-f)*cs;float seam=1.-smoothstep(.4,1.6,min(e.x,e.y));
  vec2 rv=fract(pp/cs+.5);float rivet=1.-smoothstep(1.,1.8,length((rv-.5)*cs-vec2(cs.x*.42,cs.y*.36)));
  float panel=h21(floor(pp/cs));col*=.82+panel*.3;col*=1.-seam*.6;col+=rivet*.08;
  gH=gH*.25-seam*1.2+rivet*.6;gSeam=seam;
  if(vWPos.z<-240.){vec2 cid=floor(pp/cs);gLit=step(.975,h21(cid+7.3))*(1.-seam)*smoothstep(.0,.35,min(min(f.x,1.-f.x),min(f.y,1.-f.y)))*(.7+.3*sin(uTime*(2.+h21(cid)*5.)+cid.x));}
  float grime=smoothstep(.3,.9,broad+d.r*.4);col=mix(col,col*.55,grime*.5);
}
gVein=uVein*smoothstep(.9,.985,crack)*smoothstep(.68,.9,broad)*(1.-up);
gWet=uWet*(.35+.65*up);
gUnder=0.;gCaus=vec3(0.);
if(uHasWater>.5){vec3 sp=vWPos+wn*3.;vec2 tc=vec2(sp.x/20.,-sp.y/20.);float wm=texture2D(uWaterMask,(floor(tc)+.5)/uLevelSize).r;
  float wa=texture2D(uWaterMask,(floor(tc-vec2(0.,1.))+.5)/uLevelSize).r;gUnder=max(wm,wa*smoothstep(4.,0.,fract(tc.y)*20.));
  if(gUnder>.01){float dep=max(0.,uWaterTop-vWPos.y);gCaus=causticRGB(vWPos.xz*.028+vec2(vWPos.y*.009,0.),uTime*.55)*gUnder*exp(-dep*.009)*(.35+.65*max(0.,wn.y));}col*=mix(vec3(1.),vec3(.82,.93,.95),gUnder);gWet=max(gWet,gUnder);}
diffuseColor.rgb*=col;
`).replace("#include <roughnessmap_fragment>","float roughnessFactor=roughness*(.75+gGrain*.45);roughnessFactor=mix(roughnessFactor,uTopRough,0.);roughnessFactor=mix(roughnessFactor,.42,gWet);roughnessFactor=mix(roughnessFactor,.35,gSeam*uIndustrial);").replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal=perturbN(-vViewPosition,normal,vec2(dFdx(gH),dFdy(gH))*uBump*(1.-.75*smoothstep(350.,1100.,length(vViewPosition))),faceDirection);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float pulse=.75+.25*sin(uTime*2.2+vWPos.x*.031+vWPos.y*.05);
totalEmissiveRadiance+=uCrystal*gVein*1.1*pulse;
totalEmissiveRadiance+=vec3(.55,1.,1.)*gCaus*1.1;
totalEmissiveRadiance+=uAccent*gLit*.7;
if(uPulse>.5){float vv=smoothstep(.9,.985,d.g)*smoothstep(.6,.85,d2.a);totalEmissiveRadiance+=uAccent*vv*(.6+.6*sin(uTime*3.+vWPos.x*.02))*1.4;}
if(uHeat>.5){float glow=smoothstep(-150.,-430.,vWPos.y)*0.;totalEmissiveRadiance+=vec3(1.,.35,.08)*glow;}`)},i.customProgramCacheKey=()=>"terrain-"+(t?"i":"o")+(e.waterMask?"w":""),i}function Ui(n,e=2.2,t={}){let i=new Ue(n),s=new $s({color:i.clone().multiplyScalar(.32),emissive:i,emissiveIntensity:e*.55,roughness:.1,metalness:.1,clearcoat:1,clearcoatRoughness:.06,transparent:!!t.transparent,opacity:t.opacity??1,flatShading:!0,envMapIntensity:1.1,iridescence:.5,iridescenceIOR:1.4});return s.onBeforeCompile=r=>{r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying float vLy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLy=position.y;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
varying float vLy;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      float fres=pow(max(1.-abs(dot(normalize(normal),normalize(vViewPosition))),0.),2.2);float tip=smoothstep(.5,1.,vLy);
      totalEmissiveRadiance*=.14+fres*1.35+tip*.85;`)},s.customProgramCacheKey=()=>"crystal",s}var Qr=5,Bt=256,Fn=48,os=4,va=6;function oy(n){let e=new Float32Array(Bt*Fn),t=new Float32Array(Bt*Fn),i=new Uint16Array(Bt*Fn),s=new Nn(i,Bt,Fn,bs,bn);s.magFilter=s.minFilter=Un,s.wrapS=s.wrapT=Oi,s.needsUpdate=!0;let r=n-Fn*va,o=0,a=0,l=.12,c=.991,h=new Float32Array(Bt*Fn);for(let d=0;d<Fn;d++)for(let f=0;f<Bt;f++){let g=Math.min(1,Math.min(f,Bt-1-f)/14)*Math.min(1,d/10);h[d*Bt+f]=.92+.08*g}function u(d){let f=new Float32Array(Bt*Fn),g=new Float32Array(Bt*Fn);for(let x=0;x<Fn;x++)for(let m=0;m<Bt;m++){let p=m+d;p<0||p>=Bt||(f[x*Bt+m]=e[x*Bt+p],g[x*Bt+m]=t[x*Bt+p])}e=f,t=g,o+=d*os}return{tex:s,get x0(){return o},z0:r,width:Bt*os,depth:Fn*va,follow(d){let f=Math.round((d-Bt*os/2)/os),g=f-Math.round(o/os);Math.abs(g)>Bt/2?(e.fill(0),t.fill(0),o=f*os):Math.abs(g)>=8&&u(g)},drop(d,f,g,x){let m=(d-o)/os,p=(f-r)/va,M=x/os,y=x/va;for(let v=Math.max(1,Math.floor(p-y));v<=Math.min(Fn-2,Math.ceil(p+y));v++)for(let E=Math.max(1,Math.floor(m-M));E<=Math.min(Bt-2,Math.ceil(m+M));E++){let R=Math.hypot((E-m)/M,(v-p)/y);R>=1||(e[v*Bt+E]-=g*(.5+.5*Math.cos(R*Math.PI)))}},height(d,f){let g=Math.round((d-o)/os),x=Math.round((f-r)/va);return g<0||x<0||g>=Bt||x>=Fn?0:e[x*Bt+g]},step(d){a=Math.min(a+d,3/60);let f=0;for(;a>=1/60;){a-=1/60,f++;for(let x=1;x<Fn-1;x++){let m=x*Bt;for(let p=1;p<Bt-1;p++){let M=m+p,y=(2-4*l)*e[M]+l*(e[M-1]+e[M+1]+e[M-Bt]+e[M+Bt])-t[M];t[M]=y*c*h[M]}}for(let x=0;x<Bt;x++)t[(Fn-1)*Bt+x]=t[(Fn-2)*Bt+x];let g=e;e=t,t=g}if(f){for(let g=0;g<Bt*Fn;g++)i[g]=Lo.toHalfFloat(e[g]);s.needsUpdate=!0}},clear(){e.fill(0),t.fill(0)},dispose(){s.dispose()}}}var Gc=`
uniform float uTime,uNear,uFar,uLite,uWave;
uniform sampler2D tScene,tDepth,tRip;
uniform vec2 uRes,uRipO,uRipS;
uniform vec3 uAbsorb,uScatter,uSkyTop,uSkyHor,uSunDir,uSunCol,uFogColor,uFoam,uCamFwd;
uniform float uFogNear,uFogFar,uScatK;
uniform mat4 uProj;
float lin(float d){return (uNear*uFar)/((uFar-uNear)*d-uFar)*-1.;}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float rip(vec2 xz){vec2 uv=(xz-uRipO)/uRipS;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return 0.;
  return texture2D(tRip,uv).r*smoothstep(0.,.04,min(min(uv.x,1.-uv.x),uv.y*.5));}
// slow swell: a few long Gerstner-like trains, calm enough for cave water
float swell(vec2 p,float t){return (sin(dot(p,vec2(.061,.027))+t*1.31)*.55+sin(dot(p,vec2(-.037,.052))+t*.97)*.42
  +sin(dot(p,vec2(.13,-.071))+t*2.07)*.16+sin(dot(p,vec2(.021,.11))-t*1.63)*.12)*uWave;}
float surfH(vec2 p,float t){return swell(p,t)+rip(p)*1.1;}
`,ay=`
${Gc}
varying vec3 vW;
void main(){vec4 w=modelMatrix*vec4(position,1.);w.y+=surfH(w.xz,uTime);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,ly=`
${Gc}
attribute float aSurf;attribute float aTop;
varying vec3 vW;varying float vTop;
void main(){vec4 w=modelMatrix*vec4(position,1.);float h=surfH(vec2(w.x,w.z-2.),uTime);
  if(aSurf>.5)w.y+=h;vTop=aTop+h;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,jd=`
vec3 fogIt(vec3 c,float d){return mix(c,uFogColor,smoothstep(uFogNear,uFogFar,d));}
vec3 clean(vec3 c){return any(isnan(c))||any(isinf(c))?vec3(0.):clamp(c,0.,4e3);}
`,cy=`
${Gc}${jd}
varying vec3 vW;
vec3 nrm(vec2 p){float e=1.5,t=uTime;
  float hx=surfH(p+vec2(e,0.),t)-surfH(p-vec2(e,0.),t)+(rip(p+vec2(e,0.))-rip(p-vec2(e,0.)))*1.6;
  float hz=surfH(p+vec2(0.,e),t)-surfH(p-vec2(0.,e),t)+(rip(p+vec2(0.,e))-rip(p-vec2(0.,e)))*1.6;
  // two scrolling detail layers (capillary chop)
  vec2 q=p*.09;float d1=vnoise(q+vec2(t*.21,t*.13)),d2=vnoise(q*2.3-vec2(t*.17,-t*.29));
  vec2 g=vec2(vnoise(q+vec2(.05,0.)+vec2(t*.21,t*.13))-d1,vnoise(q+vec2(0.,.05)+vec2(t*.21,t*.13))-d1)*7.
        +vec2(vnoise(q*2.3+vec2(.05,0.)-vec2(t*.17,-t*.29))-d2,vnoise(q*2.3+vec2(0.,.05)-vec2(t*.17,-t*.29))-d2)*4.;
  return normalize(vec3(-hx/(2.*e)-g.x*.35,1.,-hz/(2.*e)-g.y*.35));}
vec3 sky(vec3 r){return mix(uSkyHor,uSkyTop,smoothstep(-.05,.6,r.y));}
vec4 ssr(vec3 Pw,vec3 Nw){
  vec3 P=(viewMatrix*vec4(Pw,1.)).xyz,N=normalize((viewMatrix*vec4(Nw,0.)).xyz);
  vec3 R=normalize(reflect(normalize(P),N));
  float s=3.,prevD=0.;vec3 q=P;
  for(int i=0;i<SSR_STEPS;i++){
    q+=R*s;s*=1.22;
    vec4 c=uProj*vec4(q,1.);vec2 uv=c.xy/c.w*.5+.5;
    if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.||c.w<0.)break;
    float sd=lin(texture2D(tDepth,uv).r),qd=-q.z;
    if(qd>sd+.4&&qd<sd+s*1.6+12.){
      // refine between the last two samples
      vec3 lo=q-R*s/1.22,hi=q;
      for(int k=0;k<4;k++){vec3 m=(lo+hi)*.5;vec4 cm=uProj*vec4(m,1.);vec2 um=cm.xy/cm.w*.5+.5;
        if(-m.z>lin(texture2D(tDepth,um).r))hi=m;else lo=m;}
      vec4 ch=uProj*vec4(hi,1.);vec2 uh=ch.xy/ch.w*.5+.5;
      vec2 ed=min(uh,1.-uh);float fade=smoothstep(0.,.08,min(ed.x,ed.y))*(1.-float(i)/float(SSR_STEPS));
      return vec4(texture2D(tScene,uh).rgb,fade);}
  }
  return vec4(0.);}
void main(){
  vec3 n=nrm(vW.xz);vec3 V=normalize(cameraPosition-vW);float dMe=length(cameraPosition-vW);
#ifdef LITE
  float F=.02+.98*pow(clamp(1.-dot(n,V),0.,1.),5.);vec3 H=normalize(uSunDir+V);
  vec3 c=mix(uScatter*.8,sky(reflect(-V,n)),F)+uSunCol*pow(max(dot(n,H),0.),300.)*4.;
  gl_FragColor=vec4(fogIt(c,dMe),.72+F*.25);return;
#else
  vec2 suv=gl_FragCoord.xy/uRes;float zMe=lin(gl_FragCoord.z),zS=lin(texture2D(tDepth,suv).r);
  if(zS<zMe-.3)discard;
  float NdV=clamp(dot(n,V),0.,1.);float F=.02+.98*pow(1.-NdV,5.);
  // refraction: bend by the slope, more where the water is deep, never pull in what's in front
  vec2 off=vec2(n.x,-n.z)*.045*clamp((zS-zMe)/50.,0.,1.);
  vec2 ruv=suv+off;float zR=lin(texture2D(tDepth,ruv).r);if(zR<zMe){ruv=suv;zR=zS;}
  vec3 refr=texture2D(tScene,ruv).rgb;
  float thick=max(0.,zR-zMe)/max(.2,dot(normalize(vW-cameraPosition),uCamFwd));
  vec3 below=refr*exp(-uAbsorb*thick*1.6)+uScatter*(1.-exp(-thick*uScatK));
  vec4 r=ssr(vW,n);vec3 refl=mix(sky(reflect(-V,n)),r.rgb,r.a);
  vec3 H=normalize(uSunDir+V);float spec=pow(max(dot(n,H),0.),520.)*14.+pow(max(dot(n,H),0.),60.)*.25;
  // foam: where the surface meets something (shore, a wading trooper) and on fresh ripple crests
  float shore=1.-smoothstep(0.,7.,thick);float crest=smoothstep(.55,1.3,abs(rip(vW.xz)));
  float lace=smoothstep(.45,.75,vnoise(vW.xz*.22+vec2(uTime*.4,-uTime*.25))*.6+vnoise(vW.xz*.6-uTime*.3)*.4);
  float foam=clamp(shore*(.35+lace*.9)+crest*lace,0.,1.);
  vec3 c=mix(below,refl,F)+uSunCol*spec*(1.-foam);
  c=mix(c,uFoam,foam*.75);
  gl_FragColor=vec4(clean(fogIt(c,dMe)),1.);
#endif
}`,hy=`
${Gc}${jd}
varying vec3 vW;varying float vTop;
// light shafts falling from the surface: slanted bands that drift and shimmer
float shaft(vec2 p,float t){float x=p.x+p.y*.42;
  float a=vnoise(vec2(x*.022+t*.05,t*.07))*.6+vnoise(vec2(x*.061-t*.09,t*.11))*.4;return smoothstep(.38,.85,a)*.8;}
void main(){
  float below=max(0.,vTop-vW.y);float dMe=length(cameraPosition-vW);
  vec3 Ld=exp(-uAbsorb*below*1.5)*exp(-below*.005);    // daylight left after sinking this far
#ifdef LITE
  float rays=shaft(vW.xy,uTime)*exp(-below*.012);
  vec3 c=uScatter*(.55+.45*Ld)+uSunCol*rays*.06;
  float a=.5+.35*(1.-exp(-below*.02));
  float men=smoothstep(2.,0.,below);c+=uFoam*men*.6;
  gl_FragColor=vec4(fogIt(c,dMe),a+men*.3);return;
#else
  vec2 suv=gl_FragCoord.xy/uRes;float zMe=lin(gl_FragCoord.z),zS=lin(texture2D(tDepth,suv).r);
  if(zS<zMe-.3)discard;
  float t=uTime;
  // gentle shimmer everywhere, stronger right under the moving surface
  float near=exp(-below*.08);
  vec2 off=(vec2(vnoise(vW.xy*.045+vec2(t*.35,0.)),vnoise(vW.yx*.05-vec2(0.,t*.3)))-.5)*(.004+.01*near);
  off.x+=(rip(vec2(vW.x,vW.z-6.))-rip(vec2(vW.x-6.,vW.z-6.)))*.02*near;
  vec2 ruv=suv+off;float zR=lin(texture2D(tDepth,ruv).r);if(zR<zMe){ruv=suv;zR=zS;}
  vec3 bg=texture2D(tScene,ruv).rgb;
  vec3 dir=normalize(vW-cameraPosition);float cosA=max(.2,dot(dir,uCamFwd));
  float thick=max(0.,zR-zMe)/cosA;
  vec3 Tr=exp(-uAbsorb*thick);
  vec3 c=bg*Tr*mix(vec3(1.),Ld,.7)+uScatter*Ld*(1.-exp(-thick*uScatK));
  // ray-marched shafts and silt: fixed depth slices behind the glass, so motes keep their place and parallax
  float acc=0.,silt=0.,dz=max(.25,-dir.z);
  for(int i=0;i<SHAFT_STEPS;i++){
    float L=(float(i)+1.)*(260./float(SHAFT_STEPS))/dz;   // path length to slice i
    if(L>thick)break;
    vec3 p=vW+dir*L;float bl=max(0.,vTop-p.y);
    float att=exp(-uAbsorb.g*(L+bl)*1.1);
    acc+=shaft(p.xy,t)*exp(-bl*.018)*att;
    vec2 g=p.xy*.12+vec2(t*.06,t*.035)+float(i)*7.31;vec2 cell=floor(g),fr=fract(g)-.5;
    float h=hash(cell);vec2 at=vec2(h-.5,fract(h*13.)-.5)*.6+vec2(sin(t*.7+h*20.),cos(t*.5+h*9.))*.08;
    silt+=step(.86,h)*smoothstep(.11,.02,length(fr-at))*(.25+.75*fract(h*71.3))*att*exp(-bl*.008);
  }
  c+=uSunCol*vec3(.32,.78,.72)*acc*(1.5/float(SHAFT_STEPS))+uFoam*silt*.75;
  // the waterline: a bright meniscus, then a silvery band of total internal reflection just under it
  float men=smoothstep(1.6,0.,below);float tir=smoothstep(0.,2.,below)*smoothstep(9.,3.,below);
  c=mix(c,uSkyHor*.9+uFoam*.15,tir*.35)+uFoam*men*.7;
  gl_FragColor=vec4(clean(fogIt(c,dMe)),1.);
#endif
}`;function Qd(n,e,t,i,s,r,o){let a=n.cols,l=n.rows,c=new Jt,h=o+1.5,u=(z,X)=>{for(;X>0&&t(z,X-1)===Qr;)X--;return X},d=z=>-z*r-3,f=e.key==="vaults",g=new k(...e.sun.dir).normalize(),x=oy(h),m={uTime:{value:0},uNear:{value:8},uFar:{value:14e3},uLite:{value:0},uWave:{value:f?.55:.9},tScene:{value:null},tDepth:{value:null},tRip:{value:x.tex},uRes:{value:new we(1,1)},uRipO:{value:new we(0,x.z0)},uRipS:{value:new we(x.width,x.depth)},uAbsorb:{value:f?new k(.026,.0068,.0082):new k(.022,.0055,.0035)},uScatter:{value:new Ue(f?"#0d5b5a":"#1d5f86").multiplyScalar(f?.55:.7)},uScatK:{value:.016},uSkyTop:{value:new Ue(f?"#0a1c22":e.sky.zenith)},uSkyHor:{value:new Ue(f?"#2a6a6c":e.sky.horizon)},uSunDir:{value:g},uSunCol:{value:new Ue(e.sun.color).multiplyScalar(f?1.6:2.4)},uFoam:{value:new Ue(f?"#bff4ec":"#eef8ff")},uFogColor:{value:new Ue(e.fog.color)},uFogNear:{value:e.fog.near},uFogFar:{value:e.fog.far},uCamFwd:{value:new k(0,0,-1)},uProj:{value:new ot}},p={SSR_STEPS:s==="low"?10:22,SHAFT_STEPS:s==="low"?3:s==="high"?5:7},M=(z,X)=>new vt({uniforms:m,defines:{...p},vertexShader:z,fragmentShader:X,side:Qt}),y=M(ay,cy),v=M(ly,hy);v.side=Ci;let E=[],R=[],C=[],P=[h,24,20,15,9,2,-6,-16,-30,-48,-72,-105,-150,-210,-280].filter(z=>z>i);P.push(i);for(let z=0;z<l;z++){let X=0;for(;X<a;){if(t(X,z)!==Qr){X++;continue}let q=X;for(;q<a&&t(q,z)===Qr;)q++;let ee=X*r,ce=q*r,be=Math.max(1,Math.round((ce-ee)/4)),Ce=[],Fe=[],Be=[],ke=[],ne=ve=>t(Math.min(q-1,Math.max(X,Math.floor((ve-.01)/r))),z-1)!==Qr;for(let ve=0;ve<=be;ve++){let Se=ee+(ce-ee)*ve/be,Ze=Math.min(q-1,Math.max(X,Math.floor((Se-.01)/r))),ht=d(u(Ze,z)),O=ne(Se),H=O?d(z):-z*r,B=-(z+1)*r;if(Ce.push(Se,H,h,Se,B,h),Fe.push(O?1:0,0),Be.push(ht,ht),ve<be){let $=ve*2;ke.push($,$+1,$+2,$+2,$+1,$+3)}}let ie=new Tt;ie.setAttribute("position",new tt(Ce,3)),ie.setAttribute("aSurf",new tt(Fe,1)),ie.setAttribute("aTop",new tt(Be,1)),ie.setIndex(ke),R.push(ie);let ge=X;for(;ge<q;){if(t(ge,z-1)===Qr){ge++;continue}let ve=ge;for(;ve<q&&t(ve,z-1)!==Qr;)ve++;let Se=d(z),Ze=ge*r,ht=ve*r,O=Math.max(1,Math.round((ht-Ze)/(s==="low"?8:5))),H=[],B=[];for(let Y=0;Y<P.length;Y++)for(let K=0;K<=O;K++)H.push(Ze+(ht-Ze)*K/O,Se,P[Y]);for(let Y=0;Y<P.length-1;Y++)for(let K=0;K<O;K++){let se=Y*(O+1)+K,fe=se+O+1;B.push(se,fe,se+1,se+1,fe,fe+1)}let $=new Tt;$.setAttribute("position",new tt(H,3)),$.setIndex(B),E.push($),C.push({x0:Ze,x1:ht,y:Se}),ge=ve}X=q}}if(!E.length&&!R.length)return x.dispose(),y.dispose(),v.dispose(),null;let b=[];if(R.length){let z=new rt(Gn(R),v);z.renderOrder=3,b.push(z)}if(E.length){let z=new rt(Gn(E),y);z.renderOrder=2,b.push(z)}R.concat(E).forEach(z=>z.dispose());for(let z of b)z.layers.set(1),z.frustumCulled=!1,c.add(z);let S=z=>{for(let X of C)if(z>=X.x0&&z<=X.x1)return X;return null},I=new WeakMap,L=.5,N=0,W=!1,V={group:c,uniforms:m,ripples:x,surfaces:C,surfaceAt:S,onEvent:null,splash(z,X,q=1){let ee=S(z);return!ee||Math.abs(-X-ee.y)>40?!1:(x.drop(z,0,2.2*q,9+7*q),x.drop(z,-10,1.2*q,12*q),!0)},update(z,X,q,ee,ce,be){if(m.uTime.value=z,m.uNear.value=ee.near,m.uFar.value=ee.far,m.uProj.value.copy(ee.projectionMatrix),ee.getWorldDirection(m.uCamFwd.value),x.follow(ce+be/2),m.uRipO.value.set(x.x0,x.z0),X>0&&q){let Ce=q.player,Fe=(ie,ge,ve,Se)=>V.onEvent&&V.onEvent(ie,ge,ve,Se),Be=Ce.x+Ce.w/2,ke=S(Be);if(ke&&Ce.inWater&&!Ce.dead&&Math.abs(-Ce.y-ke.y)<16){N-=X;let ie=Math.abs(Ce.vx)+Math.abs(Ce.vy)*.5;N<=0&&ie>25&&(x.drop(Be-Math.sign(Ce.vx)*6,0,.55,7),N=.11,Math.random()<.35&&Fe("stroke",Be,-ke.y,.5))}let ne=(ie,ge,ve,Se,Ze)=>{let ht=I.get(ie);if(I.set(ie,ve),ht==null)return;let O=S(ge);if(!O)return;let H=-O.y;(ht-H)*(ve-H)<0&&(x.drop(ge,0,Se,6+Se*4),Fe(Ze,ge,H,Se))};for(let ie of q.pshots)ne(ie,ie.x,ie.y,.7,"plip");for(let ie of q.eshots)ne(ie,ie.x,ie.y,.6,"plip");for(let ie of q.enemies)ie.alive&&ne(ie,ie.x+ie.w/2,ie.y+ie.h/2,1.1,"splash");if(f&&(L-=X,L<=0)){L=.35+Math.random()*1.2;let ie=C.filter(ge=>ge.x1>ce&&ge.x0<ce+be);if(ie.length){let ge=ie[Math.random()*ie.length|0],ve=Math.max(ge.x0,Math.min(ge.x1,ce+Math.random()*be)),Se=-10-Math.random()*150;ve>=ge.x0&&ve<=ge.x1&&(x.drop(ve,Se,.9,5),Se>-60&&Fe("drip",ve,-ge.y,.4+(Se+60)/120))}}}x.step(X)},setSize(z,X){m.uRes.value.set(z,X)},setLite(z){if(z!==W){W=z;for(let X of[y,v])z?X.defines.LITE=1:delete X.defines.LITE,X.transparent=z,X.depthWrite=!z,X.needsUpdate=!0}},dispose(){y.dispose(),v.dispose(),x.dispose()}};return V}function ep(n,e,t){let i=n.tx*t+t/2,s=-n.topTy*t+6,r=-(n.botTy+1)*t-90,o=s-r,a={uTime:{value:0},uColor:{value:new Ue(e.key==="mesa"?"#cfeeff":"#aff")},uH:{value:o}},l=new vt({uniforms:a,transparent:!0,depthWrite:!1,blending:Mn,vertexShader:"varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.x+=sin(uv.y*9.+uTime*3.)*.6*(1.-uv.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uH;uniform vec3 uColor;
      float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
      void main(){float fall=1.-vUv.y;float sp=uH/60.;
        vec2 p1=vec2(vUv.x*9.,vUv.y*sp*.9+uTime*3.2),p2=vec2(vUv.x*17.+3.,vUv.y*sp*1.6+uTime*5.1);
        float streak=n(p1)*.55+n(p2)*.45;streak=smoothstep(.35,.95,streak);
        float edge=smoothstep(0.,.18+.1*n(vec2(vUv.y*sp*3.+uTime*4.,1.)),vUv.x)*smoothstep(1.,.82-.1*n(vec2(vUv.y*sp*3.+uTime*4.,7.)),vUv.x);
        float sheet=.28+.35*(1.-fall)+streak*.9;
        float lip=smoothstep(.93,1.,vUv.y)*.8;float foam=smoothstep(.16,0.,vUv.y)*(.7+.5*n(vec2(vUv.x*12.,uTime*6.)));
        float a=edge*(sheet*.42+foam*.6+lip*.4);
        gl_FragColor=vec4(uColor*(sheet+foam*1.4+lip),1.)*a;}`}),c=new rt(new mn(28,o,6,24),l);return c.position.set(i,r+o/2,-40),{mesh:c,mat:l,x:i,top:s,bot:r}}var as=20,yi=26,ii=-72,ws={EMPTY:0,SOLID:1,SPIKE:2,PLATFORM:3,DECO:4,WATER:5,CRATE:6};function tp(n,e,t){let i=as,s=n.cols,r=n.rows,o=n.tiles,a=(()=>{let H=0;for(let B=0;B<s;B++)o[B]===ws.SOLID&&H++;return H>s*.6})(),l=!!e.enclosed,c=e.kind==="industrial",h=t==="low"?2:4,u=t==="low"?4:8,d=(H,B)=>(H=Math.max(0,Math.min(s-1,H)),B>=r?ws.SOLID:(B<0&&(B=a?0:-1),B<0?ws.EMPTY:o[B*s+H])),f=(H,B)=>d(H,B)===ws.SOLID,g=new Jt;g.name="terrain";let x=Vc(n.world*1e3+n.stageIndex*17+7),m=null;if(n.hasWater){let H=new Uint8Array(s*r);for(let B=0;B<s*r;B++)H[B]=o[B]===ws.WATER?255:0;m=new Nn(H,s,r,bs,Jn),m.flipY=!1,m.magFilter=m.minFilter=yn,m.needsUpdate=!0}let p=-1e4;if(n.hasWater){for(let H=0;H<s*r;H++)if(o[H]===ws.WATER){p=-Math.floor(H/s)*i-3;break}}let M=ar(e,{waterMask:m,cols:s,rows:r,waterTop:p}),y=[M],v=new Float32Array(s),E=new Float32Array(s);for(let H=0;H<s;H++){let B=r-1;if(!f(H,B))v[H]=-(r*i+90);else{for(;B>0&&f(H,B-1);)B--;v[H]=-B*i}let $=0;if(a&&f(H,0)){for(;$<r-1&&f(H,$+1);)$++;E[H]=-($+1)*i}else E[H]=200}let R=(H,B)=>{let $=B/i-.5,Y=Math.floor($),K=$-Y,se=H[Math.max(0,Math.min(s-1,Y))],fe=H[Math.max(0,Math.min(s-1,Y+1))];return se+(fe-se)*K},C=(H,B,$)=>{let Y=0,K=0;for(let se=-$;se<=$;se+=i/2)Y+=R(H,B+se),K++;return Y/K},P=c?0:e.key==="spire"?7:e.key==="vaults"?6:5.5,b=new Map;function S(H,B,$,Y){if(!P){Y[0]=H,Y[1]=B,Y[2]=$,Y[3]=0;return}let K=(H*4|0)+","+(B*4|0)+","+($*4|0),se=b.get(K);if(!se){let fe=e.key==="spire"?.022:.034,Ae=H*fe,Ie=B*fe,D=$*fe,T=$>-40&&$<yi-5?.12:1,j=Tn(Ae,Ie+57,D,3)*P*1.7;e.rock.strata&&(j+=Math.sin(B*.42+Tn(Ae*.5,Ie*.5,0,2)*3)*2.6*e.rock.strata),se=[Tn(Ae,Ie,D,3)*P,Tn(Ae+31,Ie,D,3)*P*T,j],b.set(K,se)}Y[0]=H+se[0],Y[1]=B+se[1],Y[2]=$+se[2],Y[3]=se[2]/(P*2.2)}function I(H,B,$){let Y=R(v,H),K=Math.max(0,(Y-B)/i),se=1-Math.min(.5,K*.07);return $<ii+12&&(se*=.86),se*(.9+.1*xa(H*.05,B*.05,$*.05))}let L=16,N=26,W=[],V=[0,0,0,0];for(let H=-N;H<s+N;H+=L){let B=[],$=[],Y=(fe,Ae,Ie,D,T)=>{for(let j=0;j<T;j++)for(let he=0;he<D;he++){let Me=(Ge,Te)=>[fe[0]+Ae[0]*Ge+Ie[0]*Te,fe[1]+Ae[1]*Ge+Ie[1]*Te,fe[2]+Ae[2]*Ge+Ie[2]*Te],de=Me(he/D,j/T),$e=Me((he+1)/D,j/T),Re=Me((he+1)/D,(j+1)/T),qe=Me(he/D,(j+1)/T);for(let Ge of[de,Re,$e,de,qe,Re]){S(Ge[0],Ge[1],Ge[2],V),B.push(V[0],V[1],V[2]);let Te=I(Ge[0],Ge[1],Ge[2])*(.8+.2*Math.max(-1,Math.min(1,V[3]*2)));$.push(Te,Te,Te)}}};for(let fe=H;fe<H+L;fe++)for(let Ae=0;Ae<r+3;Ae++){if(!f(fe,Ae))continue;let Ie=fe*i,D=Ie+i,T=-Ae*i,j=T-i;Y([Ie,T,yi],[i,0,0],[0,-i,0],h,h),f(fe,Ae-1)||Y([Ie,T,ii],[i,0,0],[0,0,yi-ii],h,u),!f(fe,Ae+1)&&Ae<r+2&&Y([Ie,j,yi],[i,0,0],[0,0,ii-yi],h,u),f(fe-1,Ae)||Y([Ie,T,ii],[0,0,yi-ii],[0,-i,0],u,h),f(fe+1,Ae)||Y([D,T,yi],[0,0,ii-yi],[0,-i,0],u,h)}if(!B.length)continue;let K=new Tt;K.setAttribute("position",new tt(B,3)),K.setAttribute("color",new tt($,3)),c||(K=Bc(K,.01)),K.computeVertexNormals(),K.computeBoundingSphere();let se=new rt(K,M);se.castShadow=!0,se.receiveShadow=!0,g.add(se),W.push(se)}let z=l?[ii+10,ii-6,-95,-120,-150,-190,-240,-300]:[ii+10,ii-6,-95,-120,-150,-190,-240,-300,-380,-480,-600,-760,-950],X=t==="low"?20:10,q=-N*i,ee=(s+N)*i,ce=(H,B,$)=>{let Y=Math.max(0,(ii-B)/(ii-z[z.length-1])),K=R($?v:E,H),se=C($?v:E,H,90),fe=K+(se-K)*Math.min(1,Y*3.2),Ae=.006,Ie=ku(H*Ae,B*Ae,$?3.1:7.7,4)*1.4-.5;e.key==="mesa"&&(Ie=Math.floor(Ie*4.5)/4.5*.8+Ie*.25);let D=(l?110:230)*Math.pow(Math.max(0,Y),1.25)+(Y>0?8:0);return c&&(D=Y>0?3:0,Ie=Math.round(Ie*2)/2),e.key==="rift"?fe+=($?-1.7:2.4)*(Math.abs(Ie)+.3)*D+Tn(H*.03,B*.03,1,2)*6*Math.min(1,Y*4):fe+=($?1:-1)*(Ie*D+Tn(H*.03,B*.03,1,2)*(c?0:6)*Math.min(1,Y*4)),$&&K<-r*i&&(fe=Math.min(fe,K+D*.4)),B>ii-4&&(fe+=$?-4:4),fe};function be(H){let B=Math.ceil((ee-q)/X)+1,$=z.length,Y=new Float32Array(B*$*3),K=new Float32Array(B*$*3),se=[];for(let Ae=0;Ae<$;Ae++)for(let Ie=0;Ie<B;Ie++){let D=q+Ie*X,T=z[Ae],j=ce(D,T,H),he=(Ae*B+Ie)*3;Y[he]=D+Tn(D*.02,T*.02,5,2)*4,Y[he+1]=j,Y[he+2]=T;let Me=Ae<2?.82:.9+.1*xa(D*.01,T*.01,2);K[he]=K[he+1]=K[he+2]=Me}for(let Ae=0;Ae<$-1;Ae++)for(let Ie=0;Ie<B-1;Ie++){let D=Ae*B+Ie,T=D+1,j=D+B,he=j+1;H?se.push(D,T,j,T,he,j):se.push(D,j,T,T,j,he)}let fe=new Tt;return fe.setAttribute("position",new Nt(Y,3)),fe.setAttribute("color",new Nt(K,3)),fe.setIndex(se),fe.computeVertexNormals(),fe}function Ce(H){let B=uy(H,L*i*2);for(let $ of B){let Y=new rt($,M);Y.receiveShadow=!0,Y.castShadow=!l,g.add(Y)}}if(Ce(be(!0)),a&&Ce(be(!1)),l){let H=z[z.length-1],B=Math.ceil((ee-q)/X)+1,$=24,Y=new Float32Array(B*$*3),K=new Float32Array(B*$*3),se=[];for(let Ae=0;Ae<$;Ae++)for(let Ie=0;Ie<B;Ie++){let D=q+Ie*X,T=ce(D,H,!0)-30,j=ce(D,H,!1)+30,he=Ae/($-1),Me=T+(j-T)*he,de=(Ae*B+Ie)*3,$e=Tn(D*.012,Me*.012,3,3)*70+ku(D*.03,Me*.03,1,2)*25;Y[de]=D,Y[de+1]=Me,Y[de+2]=H-20-$e*(c?.2:1);let Re=.72+.28*Math.sin(he*Math.PI);K[de]=K[de+1]=K[de+2]=Re}for(let Ae=0;Ae<$-1;Ae++)for(let Ie=0;Ie<B-1;Ie++){let D=Ae*B+Ie,T=D+1,j=D+B,he=j+1;se.push(D,T,j,T,he,j)}let fe=new Tt;fe.setAttribute("position",new Nt(Y,3)),fe.setAttribute("color",new Nt(K,3)),fe.setIndex(se),fe.computeVertexNormals(),Ce(fe)}let Fe=[];for(let H=0;H<r;H++)for(let B=0;B<s;B++)o[H*s+B]===ws.SPIKE&&Fe.push([B,H]);if(Fe.length){let H=lr(),B=5,$=Fe.length*B,Y=c?new Kt({color:"#2a2426",metalness:.9,roughness:.35,emissive:new Ue(e.spike),emissiveIntensity:0}):Ui(e.spike,1.6);c&&(Y.onBeforeCompile=Ae=>{Ae.vertexShader=Ae.vertexShader.replace("#include <common>",`#include <common>
varying float vHy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vHy=position.y;`),Ae.fragmentShader=Ae.fragmentShader.replace("#include <common>",`#include <common>
varying float vHy;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance=emissive*smoothstep(.45,1.,vHy)*3.5;`)});let K=new an(H,Y,$),se=new Gt,fe=0;for(let[Ae,Ie]of Fe)for(let D=0;D<B;D++){let T=.75+x()*.5;se.position.set(Ae*i+3+x()*14,-(Ie+1)*i+2,-34+D*13+x()*6),se.rotation.set((x()-.5)*.35,x()*6.28,(x()-.5)*.35),se.scale.set(4*T,(13+x()*7)*T,4*T),se.updateMatrix(),K.setMatrixAt(fe++,se.matrix)}K.castShadow=!0,g.add(K),y.push(Y)}let Be=[];for(let H=0;H<r;H++)for(let B=0;B<s;B++)o[H*s+B]===ws.CRATE&&Be.push(H*s+B);let ke=null,ne=new Map;if(Be.length){let H=dy(n.type==="shmup"),B=new Kt({color:n.type==="shmup"?"#3a3f52":"#6a5a44",metalness:.7,roughness:.42,emissive:new Ue(e.accent),emissiveIntensity:0,vertexColors:!0});B.onBeforeCompile=Y=>{Y.fragmentShader=Y.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance=emissive*step(1.5,vColor.r+vColor.g+vColor.b)*2.5;`).replace("#include <color_fragment>",`#include <color_fragment>
if(vColor.r+vColor.g+vColor.b>1.5)diffuseColor.rgb=vec3(.1);`)},ke=new an(H,B,Be.length);let $=new Gt;Be.forEach((Y,K)=>{let se=Y%s,fe=Y/s|0;$.position.set(se*i+i/2,-fe*i-i/2,0),$.rotation.set(0,(x()-.5)*.06,0),$.scale.set(1,1,1),$.updateMatrix(),ke.setMatrixAt(K,$.matrix),ne.set(Y,K)}),ke.castShadow=ke.receiveShadow=!0,g.add(ke),y.push(B)}let ie=[];if(n.platforms&&n.platforms.length)for(let H of n.platforms){let B=H.w*i,$=py(B,c,x),Y=new rt($,c?my(e):M);if(Y.position.set(H.x*i,-H.y*i,0),Y.castShadow=Y.receiveShadow=!0,g.add(Y),ie.push({mesh:Y,pl:H,w:B}),!c){let K=new rt(new ss(3.2,0),Ui(e.crystal,3.2));K.scale.set(1,2.2,1),K.position.set(H.x*i+B/2,-H.y*i-16,0),g.add(K),ie[ie.length-1].glow=K}if(H.belt){let K=gy(B,H.belt);K.position.set(H.x*i,-H.y*i,0),g.add(K),ie[ie.length-1].belt=K}}let ge=null;n.hasWater&&(ge=Qd(n,e,d,l?-330:-700,t,i,yi)),ge&&g.add(ge.group);let ve=xy(n,e,v,E,l,x,t);g.add(ve.group);let Se=[];for(let H of n.decors||[])if(H.type==="waterfall"){let B=ep(H,e,i);g.add(B.mesh),Se.push(B)}function Ze(H,B,$){for(let Y of y)Y.userData.uniforms&&(Y.userData.uniforms.uTime.value=H);for(let Y of Se)Y.mat.uniforms.uTime.value=H;ve.update(H);for(let Y of ie)Y.glow&&(Y.glow.rotation.y=H*1.5),Y.belt&&(Y.belt.material.map.offset.x=-H*Y.pl.belt*.9)}function ht(H){let B=ne.get(H);if(B==null)return null;let $=new ot;ke.getMatrixAt(B,$);let Y=new k().setFromMatrixPosition($);return $.makeScale(0,0,0),ke.setMatrixAt(B,$),ke.instanceMatrix.needsUpdate=!0,ne.delete(H),Y}function O(){g.traverse(H=>{H.geometry&&H.geometry.dispose()});for(let H of y)H.dispose();m&&m.dispose(),ge&&ge.dispose(),ve.dispose()}return{group:g,update:Ze,removeCrate:ht,crateIndex:ne,dispose:O,fg:ve.fg,falls:Se,water:ge,ground:v,ceil:E,enclosed:l,hasCeiling:a,sample:H=>R(v,H),floorAt:(H,B)=>ce(H,B,!0),material:M}}function uy(n,e){let t=n.attributes.position,i=n.attributes.color,s=n.index.array,r=new Map;for(let a=0;a<s.length;a+=3){let l=(t.getX(s[a])+t.getX(s[a+1])+t.getX(s[a+2]))/3,c=Math.floor(l/e);r.has(c)||r.set(c,[]),r.get(c).push(s[a],s[a+1],s[a+2])}let o=[];for(let a of r.values()){let l=new Map,c=[],h=[],u=[],d=[],f=n.attributes.normal;for(let x of a){let m=l.get(x);m==null&&(m=c.length/3,l.set(x,m),c.push(t.getX(x),t.getY(x),t.getZ(x)),h.push(i.getX(x),i.getY(x),i.getZ(x)),u.push(f.getX(x),f.getY(x),f.getZ(x))),d.push(m)}let g=new Tt;g.setAttribute("position",new tt(c,3)),g.setAttribute("color",new tt(h,3)),g.setAttribute("normal",new tt(u,3)),g.setIndex(d),g.computeBoundingSphere(),o.push(g)}return n.dispose(),o}function fy(n){let e=[],t=n==="vaults"?3:5;for(let s=0;s<t;s++){let r=new mn(n==="vaults"?.5:.32,1,1,4),o=r.attributes.position;for(let a=0;a<o.count;a++){let l=o.getY(a)+.5;o.setXYZ(a,o.getX(a)*(1-l*.9),l,0)}r.rotateZ((s/(t-1)-.5)*(n==="vaults"?.4:.9)),r.rotateY(s*2.39),e.push(r)}let i=Gn(e);return e.forEach(s=>s.dispose()),i}function lr(){let n=new Dn(.55,1,.72,6,1,!1);n.translate(0,.36,0);let e=new is(.55,.28,6,1);e.translate(0,.86,0);let t=Gn([n.toNonIndexed(),e.toNonIndexed()]);return t.computeVertexNormals(),t}function dy(n){let e=[],t=new Wt(n?20:18.5,n?20:18.5,n?60:22,1,1,1);e.push(t);let i=[.05,.05,.05];if(n)for(let r of[-6,6]){let o=new Wt(20.4,1.2,60.4);o.translate(0,r,0),e.push(o)}else{for(let[o,a,l,c,h]of[[19.5,2,23,0,8.5],[19.5,2,23,0,-8.5],[2,19.5,23,8.5,0],[2,19.5,23,-8.5,0]]){let u=new Wt(o,a,l);u.translate(c,h,0),e.push(u)}let r=new Wt(14,1.1,23.4);e.push(r)}let s=e.map((r,o)=>{let a=r.toNonIndexed(),l=new Float32Array(a.attributes.position.count*3),c=n&&o>0||!n&&o===e.length-1,h=o===0?[.9,.86,.8]:[.5,.5,.52];l.fill(0);for(let u=0;u<l.length;u+=3){let d=c?[1,1,1]:h;l[u]=d[0],l[u+1]=d[1],l[u+2]=d[2]}return a.setAttribute("color",new Nt(l,3)),a});return Gn(s)}function py(n,e,t){if(e){let o=new Wt(n,7,44,Math.max(1,Math.round(n/10)),1,2);return o.translate(n/2,-3.5,-6),o}let i=new Wt(n,14,46,Math.max(2,Math.round(n/6)),4,6),s=i.attributes.position;for(let o=0;o<s.count;o++){let a=s.getX(o),l=s.getY(o),c=s.getZ(o),h=(7-l)/14,u=1-h*.35;a*=u,c*=u,l-=h*h*Tn(a*.08,c*.08,1,2)*10+h*4,l<6.5&&(a+=Tn(a*.1,l*.1,c*.1,2)*2.5,c+=Tn(a*.1+5,l*.1,c*.1,2)*2.5),s.setXYZ(o,a+n/2,l-7,c-6)}i.computeVertexNormals();let r=new Float32Array(s.count*3);for(let o=0;o<s.count;o++){let a=.65+.35*Math.min(1,Math.max(0,(s.getY(o)+14)/14));r[o*3]=r[o*3+1]=r[o*3+2]=a}return i.setAttribute("color",new Nt(r,3)),i}function my(n){return new Kt({color:"#4a4648",metalness:.85,roughness:.38,emissive:new Ue(n.accent),emissiveIntensity:.05})}function gy(n,e){let t=document.createElement("canvas");t.width=64,t.height=16;let i=t.getContext("2d");i.fillStyle="#1b1a1c",i.fillRect(0,0,64,16),i.fillStyle="#ff8a3c";for(let a=0;a<4;a++){let l=a*16+(e>0?2:12);i.beginPath(),i.moveTo(l,3),i.lineTo(l+(e>0?6:-6),8),i.lineTo(l,13),i.lineTo(l+(e>0?3:-3),8),i.fill()}let s=new Or(t);s.wrapS=Hn,s.repeat.set(n/16,1),s.colorSpace=vn;let r=new rt(new mn(n,30),new Kt({map:s,emissiveMap:s,emissive:new Ue("#ff7a2a"),emissiveIntensity:1.2,metalness:.3,roughness:.6}));r.rotation.x=-Math.PI/2,r.position.set(n/2,.3,-4);let o=new Jt;return o.add(r),o.material=r.material,o}function xy(n,e,t,i,s,r,o){let a=as,l=n.cols,c=new Jt,h=[],u=lr();h.push(u);let d=Ui(e.crystal,1.6);h.push(d);let f=Math.round(l*(o==="low"?.35:.7)),g=new an(u,d,f*4),x=new Gt,m=0,p=e.kind==="industrial";for(let v=0;v<f&&!p;v++){let E=r()*l*a,R=Math.floor(E/a),C=t[Math.max(0,Math.min(l-1,R))];if(C<-n.rows*a)continue;let P=-95-r()*260,b=C+0,S=2+Math.floor(r()*3),I=.5+r()*1.2*(1+(-P-80)/220);for(let L=0;L<S&&m<f*4;L++){let N=I*(.5+r()*.7);x.position.set(E+(r()-.5)*10*I,b-3,P+(r()-.5)*10*I),x.rotation.set((r()-.5)*.9,r()*6.28,(r()-.5)*.9),x.scale.set(3*N,(10+r()*14)*N,3*N),x.updateMatrix(),g.setMatrixAt(m++,x.matrix)}if(s&&r()<.45){let L=i[Math.max(0,Math.min(l-1,R))];if(L<100){x.position.set(E+7,L+2,P+20),x.rotation.set(Math.PI+(r()-.5)*.6,r()*6.28,0);let N=.8+r()*1.4;x.scale.set(3*N,(12+r()*16)*N,3*N),x.updateMatrix(),m<f*4&&g.setMatrixAt(m++,x.matrix)}}}g.count=m,g.castShadow=!1,m&&c.add(g);let M=null;if(e.key==="mesa"||e.key==="vaults"||e.key==="spire"){let v=fy(e.key);h.push(v);let E=e.key==="mesa"?"#b39a62":e.key==="vaults"?"#1f8a6a":"#6a2a5a",R=new Kt({color:E,roughness:.8,side:Qt,emissive:new Ue(e.key==="mesa"?"#000":e.crystal),emissiveIntensity:e.key==="mesa"?0:.35}),C={uTime:{value:0}};R.onBeforeCompile=I=>{I.uniforms.uTime=C.uTime,I.vertexShader=I.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      vec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float w=sin(uTime*2.+ip.x*.05)*.35+sin(uTime*3.7+ip.x*.11)*.12;transformed.x+=w*position.y*position.y;`)},h.push(R);let P=Math.round(l*(o==="low"?2:6)),b=new an(v,R,P),S=0;for(let I=0;I<P;I++){let L=r()*l*a,N=Math.floor(L/a),W=t[Math.max(0,Math.min(l-1,N))];if(W<-n.rows*a)continue;let V=r()<.5?-40-r()*30:-75-r()*90;x.position.set(L,W+.5,V),x.rotation.set(0,r()*6.28,(r()-.5)*.4);let z=.7+r()*1.1;x.scale.set(z*3,(e.key==="vaults"?14:6)*z+r()*4,z*3),x.updateMatrix(),b.setMatrixAt(S++,x.matrix)}b.count=S,c.add(b),M=C}if(p){let v=new Dn(2.2,2.2,1,10);v.rotateZ(Math.PI/2),h.push(v);let E=new Kt({color:"#7a6e66",metalness:.9,roughness:.3});h.push(E);let R=new Wt(1,1.1,1.4);h.push(R);let C=new Kt({color:"#000",emissive:new Ue(e.accent),emissiveIntensity:1.5});h.push(C);let P=new an(v,E,l),b=new an(R,C,l*2),S=0,I=0;for(let L=0;L<l;){let N=L,W=t[L];for(;N<l&&t[N]===W;)N++;if(W>-n.rows*a){let V=(N-L)*a;x.position.set(L*a+V/2,W-14,yi+2.5),x.rotation.set(0,0,0),x.scale.set(V,1,1),x.updateMatrix(),P.setMatrixAt(S++,x.matrix),x.position.set(L*a+V/2,W-1.5,yi+.6),x.scale.set(V-4,1,1),x.updateMatrix(),b.setMatrixAt(I++,x.matrix)}L=N}P.count=S,b.count=I,P.castShadow=!0,c.add(P,b)}{let v=new Ii(1,1),E=v.attributes.position;for(let I=0;I<E.count;I++){let L=1+Tn(E.getX(I)*2,E.getY(I)*2,E.getZ(I)*2,2)*.35;E.setXYZ(I,E.getX(I)*L,E.getY(I)*L*.6,E.getZ(I)*L)}v.computeVertexNormals();let R=new Float32Array(E.count*3).fill(.85);v.setAttribute("color",new Nt(R,3)),h.push(v);let C=p?new Kt({color:"#3a3638",metalness:.8,roughness:.45}):ar(e,{bump:1});h.push(C);let P=Math.round(l*(o==="low"?1.2:3.5)),b=new an(v,C,P),S=0;for(let I=0;I<P;I++){let L=r()*l*a,N=Math.floor(L/a),W=t[Math.max(0,Math.min(l-1,N))];if(W<-n.rows*a)continue;let V=r()<.35?yi-6-r()*14:-30-r()*120,z=(V>0?.8:1)*(.8+r()*r()*3.2)*(p?.8:1);x.position.set(L,W+z*.2,V),x.rotation.set(r()*.4,r()*6.28,r()*.4),x.scale.set(z*1.3,z,z),x.updateMatrix(),b.setMatrixAt(S++,x.matrix)}b.count=S,b.castShadow=!0,b.receiveShadow=!0,c.add(b)}let y=[];{let v=lr();h.push(v);let E=p?new Kt({color:"#1c1a1c",metalness:.8,roughness:.5}):Ui(e.crystal,1.1);h.push(E);let R=new Dn(1,1,1,12);h.push(R);for(let C=180;C<l*a;C+=260+r()*420){let P=Math.floor(C/a),b=t[Math.max(0,Math.min(l-1,P))];if(b<-n.rows*a)continue;let S=new Jt,I=70+r()*90;if(p)for(let L=0;L<2;L++){let N=new rt(R,E);N.scale.set(7+r()*5,200,7+r()*5),N.position.set(L*22,b-130-r()*30,0),S.add(N)}else for(let L=0;L<3;L++){let N=new rt(v,E),W=.6+r()*.8;N.scale.set(7*W,(34+r()*36)*W,7*W),N.position.set((r()-.5)*34,b-125+r()*30,(r()-.5)*20),N.rotation.set((r()-.5)*.7,r()*6,(r()-.5)*.7),S.add(N)}S.position.set(C,0,I),c.add(S),y.push(S)}}return{group:c,fg:y,update(v){M&&(M.uTime.value=v)},dispose(){h.forEach(v=>v.dispose())}}}var fi=n=>new Ue(n);function np(n,e,t,i){let r=n.cols*20,o=n.rows*20,a=new Jt,l=new Jt,c=[],h=[],u=Vc(n.world*77+n.stageIndex*5+3),d=new k(...e.sun.dir).normalize(),f={uZenith:{value:fi(e.sky.zenith)},uMid:{value:fi(e.sky.mid)},uHorizon:{value:fi(e.sky.horizon)},uGlow:{value:fi(e.sky.glow)},uSun:{value:d.clone().setZ(-Math.abs(d.z))},uStars:{value:e.sky.stars},uTime:{value:0},uNebula:{value:e.key==="rift"||e.key==="spire"?1:0}},g=new vt({uniforms:f,side:_n,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vD;void main(){vD=normalize(position);vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_Position.z=gl_Position.w;}",fragmentShader:`varying vec3 vD;uniform vec3 uZenith,uMid,uHorizon,uGlow,uSun;uniform float uStars,uTime,uNebula;${Li}
      float star(vec3 d){vec3 p=d*260.;vec3 i=floor(p);float h=fract(sin(dot(i,vec3(127.1,311.7,74.7)))*43758.5);vec3 f=fract(p)-.5;float s=step(.985,h)*smoothstep(.12,0.,length(f));return s*(.5+.5*sin(uTime*2.+h*90.));}
      void main(){vec3 d=normalize(vD);float y=d.y;
        vec3 c=mix(uHorizon,uMid,smoothstep(-.02,.14,y));c=mix(c,uZenith,smoothstep(.12,.6,y));
        c=mix(c,uHorizon*.55,smoothstep(.0,-.25,y));
        float sd=max(dot(d,normalize(uSun)),0.);c+=uGlow*pow(sd,6.)*.55+uGlow*pow(sd,60.)*1.2+vec3(1.,.95,.85)*smoothstep(.9993,.9997,sd)*6.;
        if(uNebula>.5){vec2 q=d.xy/(abs(d.z)+.6)*2.3;float n=fbm(q+vec2(0.,uTime*.003))*fbm(q*2.1+7.);c+=uGlow*pow(max(n,0.),2.2)*.9*smoothstep(-.1,.5,y);}
        c+=vec3(.9,.95,1.)*star(d)*uStars*smoothstep(.05,.4,y)*2.;
        gl_FragColor=vec4(c,1.);}`}),x=new rt(new ti(9e3,48,24),g);if(x.renderOrder=-10,x.frustumCulled=!1,l.add(x),h.push(g,x.geometry),e.planet&&!e.enclosed){let y=e.planet,v={uColor:{value:fi(y.color)},uBand:{value:fi(y.band)},uSun:{value:d},uGlow:{value:fi(e.sky.glow)}},E=new vt({uniforms:v,fog:!1,vertexShader:"varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vN;varying vec3 vP;uniform vec3 uColor,uBand,uSun,uGlow;${Li}
        void main(){float lat=vP.y/length(vP);float b=fbm(vec2(lat*9.,lat*3.+fbm(vec2(vP.x*.002,lat*4.))*1.5));vec3 c=mix(uColor,uBand,smoothstep(.35,.7,b));
        vec3 L=normalize(vec3(-.6,.5,.6));float l=smoothstep(-.15,.6,dot(vN,L));float rim=pow(clamp(1.-vN.z,0.,1.),3.);
        gl_FragColor=vec4(c*(l*1.05+.16)+uGlow*rim*.7*l+uGlow*rim*.22,1.);}`}),R=new rt(new ti(y.r,64,32),E);if(R.position.set(...y.pos),l.add(R),h.push(E,R.geometry),y.ring){let P=new Ys(y.r*1.35,y.r*2.3,128,1),b={uColor:{value:fi(y.ring)},uIn:{value:y.r*1.35},uOut:{value:y.r*2.3}},S=new vt({uniforms:b,transparent:!0,side:Qt,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vP;uniform vec3 uColor;uniform float uIn,uOut;float h(float x){return fract(sin(x*91.7)*43758.5);}
          void main(){float t=(length(vP.xy)-uIn)/(uOut-uIn);float bands=.55+.45*sin(t*90.)*sin(t*23.+1.)+.25*(h(floor(t*140.))-.5);float a=smoothstep(0.,.05,t)*smoothstep(1.,.85,t)*clamp(bands,0.,1.);
          float shadow=vP.y<0.&&abs(vP.x)<uIn*.75?.25:1.;gl_FragColor=vec4(uColor*(.6+bands*.5)*shadow,a*.7);}`}),I=new rt(P,S);I.position.copy(R.position),I.rotation.set(-1.25,.3,.35),l.add(I),h.push(S,P)}let C=new rt(new ti(y.r*.12,32,16),new cn({color:fi(y.color).multiplyScalar(.7),fog:!1}));C.position.set(y.pos[0]+y.r*2.8,y.pos[1]-y.r*.4,y.pos[2]+400),l.add(C),h.push(C.geometry,C.material)}if(!e.enclosed){let y=ar(e,{strata:e.key==="mesa"?1.4:.6,bump:1.2});h.push(y);let v=[],E=i==="low"?22:46;for(let N=0;N<E;N++){let W=-1100-u()*2800,V=-1500+u()*(r+3e3),z=(e.key==="mesa"?260:420)+u()*(e.key==="mesa"?700:900),X=120+u()*360,q=new Dn(X*(.7+u()*.25),X,z,28,10,!1),ee=q.attributes.position,ce=u()*100;for(let Ce=0;Ce<ee.count;Ce++){let Fe=ee.getX(Ce),Be=ee.getY(Ce),ke=ee.getZ(Ce),ne=Math.atan2(ke,Fe),ie=(Be+z/2)/z,ge=Math.hypot(Fe,ke);if(ge>1){let ve=e.key==="mesa"?Math.floor(ie*6+Tn(ne,ce,0,2)*1.2)/6:ie;ge*=1+Tn(Math.cos(ne)*2,Math.sin(ne)*2,ie*3+ce,3)*.35-ve*.18,Fe=Math.cos(ne)*ge,ke=Math.sin(ne)*ge}ie>.99&&(Be+=Tn(Fe*.01,ke*.01,ce,2)*14),ee.setXYZ(Ce,Fe+V,Be+z/2-o-60+u()*0,ke+W)}q.computeVertexNormals();let be=new Float32Array(ee.count*3).fill(1);q.setAttribute("color",new Nt(be,3)),q.deleteAttribute("uv"),v.push(q)}let R=new rt(Gn(v),y);a.add(R),h.push(R.geometry);let C=lr(),P=Ui(e.crystal,1.4);h.push(C,P);let b=new an(C,P,40),S=new Gt;for(let N=0;N<40;N++){S.position.set(-800+u()*(r+1600),-o-40+u()*120,-500-u()*2500),S.rotation.set((u()-.5)*.5,u()*6,(u()-.5)*.5);let W=.5+u()*1.1;S.scale.set(16*W,(90+u()*200)*W,16*W),S.updateMatrix(),b.setMatrixAt(N,S.matrix)}a.add(b);let I={uTime:{value:0},uColor:{value:fi(e.sky.horizon).lerp(fi("#ffffff"),.25)},uShade:{value:fi(e.sky.mid)}},L=new vt({uniforms:I,transparent:!0,depthWrite:!1,fog:!1,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;uniform vec3 uColor,uShade;${Li}
        void main(){vec2 p=vUv*vec2(6.,1.6)+vec2(uTime*.01,0.);float n=fbm(p)*1.1+fbm(p*2.7+3.)*.35;float a=smoothstep(.55,.95,n)*smoothstep(0.,.3,vUv.y)*smoothstep(1.,.6,vUv.y)*smoothstep(0.,.1,vUv.x)*smoothstep(1.,.9,vUv.x);
        gl_FragColor=vec4(mix(uShade,uColor,smoothstep(.5,1.1,n+vUv.y*.3)),a*.8);}`});h.push(L);for(let N=0;N<4;N++){let W=new rt(new mn(9e3,1400),L);W.position.set(r/2,-o+500+N*380,-3800-N*500),l.add(W),h.push(W.geometry)}c.push(N=>I.uTime.value=N)}let m={uTime:{value:0},uColor:{value:fi(e.key==="foundry"?"#ffb070":e.key==="spire"?"#d7a0ff":"#7ff0e0")}};if(e.enclosed){let y=new vt({uniforms:m,transparent:!0,depthWrite:!1,blending:Mn,side:Qt,fog:!1,vertexShader:"varying vec2 vUv;varying float vF;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vF=clamp(-p.z/1600.,0.,1.);gl_Position=projectionMatrix*p;}",fragmentShader:`varying vec2 vUv;varying float vF;uniform float uTime;uniform vec3 uColor;${Li}
        void main(){float n=fbm(vec2(vUv.x*5.+uTime*.05,vUv.y*1.5-uTime*.12));float a=smoothstep(0.,.35,vUv.x)*smoothstep(1.,.65,vUv.x)*pow(clamp(vUv.y,0.,1.),1.4)*(.45+n*.8);
        gl_FragColor=vec4(uColor*a*.16*(1.-vF*.5),1.);}`});h.push(y);let v=i==="low"?10:24;for(let E=0;E<v;E++){let R=u()*r,C=Math.min(n.cols-1,Math.max(0,Math.floor(R/20))),P=t.ceil[C]<100?t.ceil[C]:0,b=t.ground[C]>-o?t.ground[C]:-o,S=Math.max(80,P-b+40),I=30+u()*70,L=new rt(new mn(I,S,1,1),y);L.position.set(R,b+S/2-10,-120-u()*160),L.rotation.set(0,(u()-.5)*.6,(u()-.5)*.35),a.add(L),h.push(L.geometry)}c.push(E=>m.uTime.value=E)}if(e.key==="vaults"||e.key==="spire"){let y=new is(1,1,7,3);y.translate(0,-.5,0);let v=y.attributes.position;for(let N=0;N<v.count;N++)v.setX(N,v.getX(N)+Tn(v.getY(N)*3,N*.1,0,2)*.12);y.computeVertexNormals();let E=ar(e,{bump:1.5});h.push(y,E);let R=Math.round(n.cols*.8),C=new an(y,E,R),P=new Gt,b=0;for(let N=0;N<R;N++){let W=u()*r,V=Math.floor(W/20),z=t.ceil[Math.max(0,Math.min(n.cols-1,V))];if(z>=100)continue;let X=-80-u()*240;P.position.set(W,z+6,X),P.rotation.set((u()-.5)*.2,u()*6,(u()-.5)*.2);let q=.6+u()*1.4;P.scale.set(7*q,(26+u()*50)*q,7*q),P.updateMatrix(),C.setMatrixAt(b++,P.matrix)}C.count=b,a.add(C);let S=lr(),I=Ui(e.crystal,1.5);h.push(S,I);let L=new an(S,I,60);b=0;for(let N=0;N<60;N++){let W=u()*r,V=Math.floor(W/20),z=t.ground[Math.max(0,Math.min(n.cols-1,V))];if(z<-o)continue;let X=-200-u()*120;P.position.set(W,z-8+u()*20,X),P.rotation.set((u()-.5)*.8,u()*6,(u()-.5)*.8);let q=.8+u()*2;P.scale.set(12*q,(40+u()*90)*q,12*q),P.updateMatrix(),L.setMatrixAt(b++,P.matrix)}L.count=b,a.add(L)}if(e.key==="foundry"){let y=new Kt({color:"#4a4446",metalness:.85,roughness:.42}),v=new Kt({color:"#221e20",metalness:.7,roughness:.55});h.push(y,v);let E=[],R=[],C=[];for(let ee=-400;ee<r+400;ee+=140+u()*60){let ce=-150-u()*120,be=-o+40,Ce=o+300,Fe=new Wt(26+u()*18,Ce,26+u()*18);if(Fe.translate(ee,be+Ce/2-60,ce),E.push(Fe),u()<.6){let Be=new Wt(150,10,8);Be.translate(ee+70,-60-u()*200,ce+10),R.push(Be);let ke=new Wt(150,3,10);ke.rotateZ(.5),ke.translate(ee+70,-120-u()*120,ce+12),R.push(ke)}if(u()<.3){let Be=t.floorAt(ee+65,ce+16)+18,ke=new mn(36,22);ke.translate(ee+65,Be+13,ce+17.5),C.push(ke);let ne=new Wt(64,46,14);ne.translate(ee+65,Be+20,ce+10),E.push(ne)}}if(a.add(new rt(Gn(E),y),new rt(Gn(R),v)),h.push(...E,...R),C.length){let ee={uTime:{value:0}},ce=new vt({uniforms:ee,fog:!1,vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vP;varying vec3 vN;uniform float uTime;${Li}void main(){float n=fbm(vec2(vP.x*.05,vP.y*.08-uTime*.8));float f=.75+.25*sin(uTime*7.+vP.x*.1);
          vec3 c=mix(vec3(.5,.06,0.),vec3(2.6,.9,.2),n*f);vec2 fp=fract(vP.xy/vec2(44.,30.));c*=mix(1.,.06,step(.78,fract(vP.x*.2)));c*=.35+.65*smoothstep(.9,.1,fp.y);gl_FragColor=vec4(c,1.);}`});h.push(ce),a.add(new rt(Gn(C),ce)),c.push(be=>ee.uTime.value=be)}let P=new Dn(60,60,10,24,1);P.rotateX(Math.PI/2),h.push(P);for(let ee=0;ee<Math.ceil(r/700);ee++){let ce=new Jt,be=new rt(P,v);ce.add(be);for(let Fe=0;Fe<12;Fe++){let Be=new rt(new Wt(14,18,10),v),ke=Fe/12*Math.PI*2;Be.position.set(Math.cos(ke)*64,Math.sin(ke)*64,0),Be.rotation.z=ke,ce.add(Be)}ce.position.set(300+ee*700+u()*200,-80-u()*120,-260);let Ce=(u()<.5?-1:1)*(.2+u()*.3);a.add(ce),c.push(Fe=>ce.rotation.z=Fe*Ce)}let b={uTime:{value:0}},S=new vt({uniforms:b,fog:!1,vertexShader:"varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:`varying vec3 vW;uniform float uTime;${Li}void main(){vec2 p=vW.xz*.012+vec2(uTime*.06,0.);float n=fbm(p+fbm(p*1.7+uTime*.03));
        vec3 c=mix(vec3(.25,.03,0.),vec3(4.,1.2,.25),smoothstep(.35,.85,n));c+=vec3(5.,2.,.6)*smoothstep(.82,.95,n);gl_FragColor=vec4(c,1.);}`});h.push(S);let I=[];for(let ee=-400;ee<=r+400;ee+=20){let ce=t.floorAt(ee,-225)+1.2;I.push(ee,ce,-205,ee,ce,-245)}let L=new Tt;L.setAttribute("position",new tt(I,3));let N=[];for(let ee=0;ee<I.length/6-1;ee++){let ce=ee*2;N.push(ce,ce+1,ce+2,ce+1,ce+3,ce+2)}L.setIndex(N);let W=new rt(L,S);a.add(W),h.push(L),c.push(ee=>b.uTime.value=ee);let V=new Wt(1,5,4);h.push(V);let z=new an(V,y,Math.ceil((r+800)/40)*2+4),X=new Gt,q=0;for(let ee=-400;ee<=r+400;ee+=40){let ce=t.floorAt(ee,-225);for(let be of[-203,-247])X.position.set(ee,ce+1,be),X.scale.set(40,1,1),X.updateMatrix(),z.setMatrixAt(q++,X.matrix)}z.count=q,a.add(z)}if(e.key==="spire"){let y=lr(),v=Ui(e.crystal,1.2);h.push(y,v);let E=new an(y,v,26),R=new Gt;for(let C=0;C<26;C++){R.position.set(u()*r,-o-60,-190-u()*130),R.rotation.set((u()-.5)*.25,u()*6,(u()-.5)*.25);let P=1+u()*1.2;R.scale.set(13*P,(o+160)*P*.7,13*P),R.updateMatrix(),E.setMatrixAt(C,R.matrix)}a.add(E),c.push(C=>{v.emissiveIntensity=1.6+Math.sin(C*1.3)*.5})}if(e.key==="rift"){let y=Bc(new Ii(1,3)),v=y.attributes.position;for(let S=0;S<v.count;S++){let I=new k().fromBufferAttribute(v,S);I.multiplyScalar(1+Tn(I.x*2,I.y*2,I.z*2,3)*.45),I.y*=.6,v.setXYZ(S,I.x,I.y,I.z)}y.computeVertexNormals();let E=ar(e,{bump:1.2}),R=new Float32Array(v.count*3).fill(1);y.setAttribute("color",new Nt(R,3)),h.push(y,E);let C=new an(y,E,60),P=new Gt,b=[];for(let S=0;S<60;S++){let I=-320-u()*1600,L=(10+u()*28)*(1+(-I-320)/800);b.push({x:u()*r,y:-u()*o*1.2+60,z:I,s:L,sp:u()*6})}a.add(C),c.push(S=>{b.forEach((I,L)=>{P.position.set(I.x,I.y+Math.sin(S*.4+I.sp)*10,I.z),P.rotation.set(I.sp,S*.05+I.sp,0),P.scale.setScalar(I.s),P.updateMatrix(),C.setMatrixAt(L,P.matrix)}),C.instanceMatrix.needsUpdate=!0})}function p(y,v){l.position.copy(v.position),f.uTime.value=y;for(let E of c)E(y)}function M(){h.forEach(y=>y.dispose&&y.dispose())}return{group:a,sky:l,update:p,dispose:M}}var ip=new Ue,Wc=class{constructor(e,t){this.max=e,this.head=0,this.time=0,this.dirtyMin=1/0,this.dirtyMax=-1;let i=new sa;i.setAttribute("position",new tt([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);let s=o=>{let a=new gs(new Float32Array(e*o),o);return a.setUsage(tr),a};this.aPos=s(3),this.aVel=s(3),this.aCol=s(4),this.aT=s(4),this.aPh=s(4),i.setAttribute("aPos",this.aPos),i.setAttribute("aVel",this.aVel),i.setAttribute("aCol",this.aCol),i.setAttribute("aT",this.aT),i.setAttribute("aPh",this.aPh),i.instanceCount=e;for(let o=0;o<e;o++)this.aT.array[o*4]=-1e6,this.aT.array[o*4+1]=.001;let r=t==="smoke";this.uniforms={uTime:{value:0},uLight:{value:new Ue(1,1,1)},uAmbient:{value:new Ue(.4,.4,.45)}},this.material=new vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:r?Qi:Mn,vertexShader:`attribute vec3 aPos,aVel;attribute vec4 aCol,aT,aPh;uniform float uTime;varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;
        void main(){float age=uTime-aT.x;float life=aT.y;if(age<0.||age>life){gl_Position=vec4(2.,2.,2.,1.);return;}
          float k=max(aPh.y,.0001);float e=1.-exp(-k*age);vec3 p=aPos+aVel*e/k;p.y+=aPh.x*(age/k-e/(k*k));
          float t=age/life;float size=mix(aT.z,aT.w,t);
          vec4 mv=modelViewMatrix*vec4(p,1.);vec2 q=position.xy;
          if(aPh.z>0.){vec3 v=aVel*exp(-k*age);v.y+=aPh.x*e/k;vec3 vv=(modelViewMatrix*vec4(v,0.)).xyz;vec2 dir=length(vv.xy)>.001?normalize(vv.xy):vec2(1.,0.);
            float stretch=1.+length(vv.xy)*aPh.z;vec2 side=vec2(-dir.y,dir.x);mv.xy+=dir*q.x*size*stretch+side*q.y*size*.35;}
          else{float a=aPh.w*age+aT.x*7.;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));mv.xy+=R*q*size;}
          gl_Position=projectionMatrix*mv;vUv=q;vAge=t;vSeed=fract(aT.x*13.7);
          float fade=${r?"smoothstep(0.,.15,t)*(1.-smoothstep(.45,1.,t))":"pow(1.-t,1.4)"};vCol=vec4(aCol.rgb,aCol.a*fade);}`,fragmentShader:`varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;uniform vec3 uLight,uAmbient;${Li}
        void main(){float d=length(vUv);if(d>1.)discard;
          ${r?"float n=fbm(vUv*1.7+vSeed*9.+vAge*.8);float a=smoothstep(1.,.25,d+n*.45-.2)*vCol.a;vec3 c=vCol.rgb*(uAmbient+uLight*clamp(.55-vUv.y*.5+n*.3,0.,1.));gl_FragColor=vec4(c,a);":"float a=pow(max(0.,1.-d),2.2);gl_FragColor=vec4(vCol.rgb*vCol.a*a,1.);"}}`}),this.mesh=new rt(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=r?4:5}emit(e,t,i,s,r,o,a,l,c,h,u,d,f,g=0,x=0,m=0,p=0,M=0){let y=this.head;this.head=(this.head+1)%this.max,this.aPos.array.set([e,t,i],y*3),this.aVel.array.set([s,r,o],y*3),this.aCol.array.set([a,l,c,h],y*4),this.aT.array.set([this.time+M,u,d,f],y*4),this.aPh.array.set([g,x,m,p],y*4),y<this.dirtyMin&&(this.dirtyMin=y),y>this.dirtyMax&&(this.dirtyMax=y)}update(e){if(this.time=e,this.uniforms.uTime.value=e,this.dirtyMax>=0){let t=this.dirtyMin,i=this.dirtyMax-t+1;for(let[s,r]of[[this.aPos,3],[this.aVel,3],[this.aCol,4],[this.aT,4],[this.aPh,4]])s.clearUpdateRanges(),s.addUpdateRange(t*r,i*r),s.needsUpdate=!0;this.dirtyMin=1/0,this.dirtyMax=-1}}clear(){for(let e=0;e<this.max;e++)this.aT.array[e*4]=-1e6;this.aT.needsUpdate=!0,this.aT.clearUpdateRanges()}};function sp(n,e){let t=e==="low",i=new Wc(t?2500:7e3,"add"),s=new Wc(t?500:1400,"smoke");n.add(i.mesh,s.mesh);let r=Math.random,o=new Ii(1,0);{let U=o.attributes.position;for(let Z=0;Z<U.count;Z++)U.setXYZ(Z,U.getX(Z)*(.7+Z*37%11/22),U.getY(Z)*.7,U.getZ(Z));o.computeVertexNormals()}let a=new Kt({roughness:.7,metalness:.25}),l=t?120:320,c=new an(o,a,l);c.instanceMatrix.setUsage(tr),c.castShadow=!0,c.count=0,c.setColorAt(0,new Ue),n.add(c);let h=[],u=new Gt,d=new Kt({color:"#000",emissive:new Ue("#ff7a2a"),emissiveIntensity:4}),f=new an(o,d,t?40:120);f.count=0,f.instanceMatrix.setUsage(tr),n.add(f);let g=[],x=new Dn(.55,.55,2.4,7,1),m=new Kt({color:"#d8a548",roughness:.32,metalness:.95,emissive:new Ue("#3a2408"),emissiveIntensity:.4}),p=new an(x,m,t?24:60);p.instanceMatrix.setUsage(tr),p.count=0,p.castShadow=!t,n.add(p);let M=[],y={uTime:{value:0},uC:{value:0}},v=new vt({uniforms:y,transparent:!0,depthWrite:!1,blending:Mn,vertexShader:"varying vec2 vUv;void main(){vUv=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uC;
      vec3 hue(float h){return clamp(abs(mod(h*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);}
      void main(){float r=length(vUv);if(r>1.)discard;float a=atan(vUv.y,vUv.x);
        float core=exp(-r*r*(34.-14.*uC));float halo=exp(-r*5.)*.5;
        float rays=pow(max(0.,cos(a*6.+uTime*3.)),24.)*exp(-r*3.)*uC;float rays2=pow(max(0.,cos(a*4.-uTime*5.)),40.)*exp(-r*2.4)*uC*uC;
        float fringe=smoothstep(.12,0.,abs(r-.42-.08*sin(uTime*9.)))*uC;
        vec3 c=vec3(1.)*core*1.5+vec3(.62,.4,1.)*halo+vec3(.8,.62,1.)*(rays+rays2)*1.2+hue(a/6.2832+uTime*.4)*fringe*2.2;
        gl_FragColor=vec4(c*(.35+.65*uC),1.);}`}),E=new rt(new mn(1,1),v);E.visible=!1,E.renderOrder=7,E.frustumCulled=!1,n.add(E);let R=new Gs(1,1,3,8),C=new cn({color:16777215,toneMapped:!1}),P=320,b=new an(R,C,P);b.instanceMatrix.setUsage(tr),b.setColorAt(0,new Ue),b.count=0,b.frustumCulled=!1,n.add(b);let S=new vt({uniforms:{uColor:{value:new Ue},uA:{value:1}},transparent:!0,depthWrite:!1,blending:Mn,side:Qt,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec2 vUv;uniform vec3 uColor;uniform float uA;void main(){float d=abs(vUv.y-.5)*2.;float a=pow(max(1.-d,0.),3.)*uA;gl_FragColor=vec4(uColor*a*2.,1.);}"}),I=new Ys(.82,1,64,1);{let U=I.attributes.uv,Z=I.attributes.position;for(let ae=0;ae<Z.count;ae++){let xe=Math.hypot(Z.getX(ae),Z.getY(ae));U.setXY(ae,0,(xe-.82)/.18)}}let L=[],N={uTime:{value:0},uColor:{value:new Ue("#6cf3ff")},uLen:{value:240}},W=new vt({uniforms:N,transparent:!0,depthWrite:!1,blending:Mn,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uLen;uniform vec3 uColor;${Li}
      void main(){float x=vUv.x*uLen;float w=abs(vUv.y-.5)*2.;float n=fbm(vec2(x*.05-uTime*14.,vUv.y*3.+uTime*3.));
        float edge=.35+.45*n;float core=smoothstep(.22,0.,w);float body=smoothstep(edge,edge*.3,w);float flick=.85+.15*sin(uTime*90.+x*.3);
        float tip=smoothstep(0.,.04,vUv.x)*(1.-smoothstep(.96,1.,vUv.x)*.5);
        vec3 c=(uColor*body*1.15+vec3(1.)*core*1.7)*flick*tip;gl_FragColor=vec4(c,1.);}`}),V=new rt(new mn(1,1,1,1),W);V.geometry.translate(.5,0,0),V.visible=!1,V.renderOrder=6,n.add(V);let z=4,X=22,q=new Tt;q.setAttribute("position",new Nt(new Float32Array(z*X*2*3*3),3));let ee=new cn({color:new Ue("#9ff8ff").multiplyScalar(2.2),transparent:!0,blending:Mn,depthWrite:!1,toneMapped:!1}),ce=new rt(q,ee);ce.frustumCulled=!1,ce.visible=!1,ce.renderOrder=6,n.add(ce);let be={uTime:{value:0}},Ce=new vt({uniforms:be,transparent:!0,depthWrite:!1,blending:Mn,side:Qt,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;${Li}void main(){float x=abs(vUv.x-.5)*2.;float n=fbm(vec2(vUv.x*4.,vUv.y*9.-uTime*6.));
      float a=smoothstep(.55+n*.4,0.,x);float core=smoothstep(.12,0.,abs(x-n*.15));vec3 c=vec3(.4,1.,.85)*a*1.4+vec3(1.)*core*2.;gl_FragColor=vec4(c,1.);}`}),Fe=[],Be=t?4:e==="ultra"?12:8,ke=[];for(let U=0;U<Be;U++){let Z=new ia(16777215,0,160,1.6);Z.castShadow=!1,n.add(Z),ke.push(Z)}let ne=[],ie=[];function ge(U,Z,ae,xe,J,re){ne.push({x:U,y:Z,z:ae,color:xe,intensity:J,distance:re})}function ve(U,Z,ae,xe,J,re){ie.push({x:U,y:Z,color:new Ue(ae),intensity:xe,distance:J,life:re,age:0})}let Se=0,Ze=U=>{Se=Math.min(1.6,Se+U)};function ht(U){return ip.set(U)}function O(U,Z,ae,xe=12,J=180,re={}){let me=ht(ae);for(let ye=0;ye<xe;ye++){let Xe=r()*Math.PI*2,je=J*(.3+r()*.9),le=(r()-.5)*J*.8;i.emit(U,-Z,re.z??4,Math.cos(Xe)*je,Math.sin(Xe)*je+(re.up||0),le,me.r*1.6,me.g*1.6,me.b*1.6,1,.18+r()*.35*(re.life||1),1.1+r()*.8,.2,re.grav??-420,3,.018,0)}}function H(U,Z,ae,xe=6,J=12,re={}){let me=ht(ae);for(let ye=0;ye<xe;ye++){let Xe=r()*Math.PI*2,je=(re.speed||30)*(.3+r());s.emit(U+(r()-.5)*6,-Z+(r()-.5)*6,(re.z??0)+(r()-.5)*14,Math.cos(Xe)*je,Math.sin(Xe)*je*.6+(re.rise??22),(r()-.5)*20,me.r,me.g,me.b,re.alpha??.55,(re.life||1.2)*(.7+r()*.6),J*(.6+r()*.4),J*(2+r()*1.4),re.grav??30,1.4,0,0)}}function B(U,Z,ae,xe,J,re=6,me=1.5){let ye=ht(ae);i.emit(U,-Z,re,0,0,0,ye.r*me,ye.g*me,ye.b*me,1,J,xe,xe*1.6,0,1,0,0)}function $(U,Z,ae,xe,J,re={}){let me=new rt(I,S.clone());me.material.uniforms.uColor.value.set(ae),me.position.set(U,-Z,re.z??8),re.flat&&(me.rotation.x=-Math.PI/2),n.add(me),L.push({m:me,radius:xe,life:J,age:0,start:re.start||2})}function Y(U,Z,ae,xe,J=160,re=2.2,me=0){let ye=new Ue(ae);for(let Xe=0;Xe<xe;Xe++){let je=r()*Math.PI*2,le=J*(.35+r()*.8),De=r()<me,It={x:U,y:-Z,z:(r()-.5)*20,vx:Math.cos(je)*le,vy:Math.abs(Math.sin(je))*le*1.1+60,vz:(r()-.5)*le*.6,rx:r()*6,ry:r()*6,wr:(r()-.5)*14,s:re*(.5+r()),life:1.6+r()*1.4,age:0,c:ye.clone().multiplyScalar(.6+r()*.5)};De?g.length<f.instanceMatrix.count&&g.push(It):h.length<l&&h.push(It)}}function K(U,Z,ae=1,xe){let J=ae;B(U,Z,"#ffd9a0",26*J,.22,10,2.4),B(U,Z,"#ff8a3c",40*J,.4,8,1.4);for(let re=0;re<Math.round(14*J);re++){let me=r()*Math.PI*2,ye=(60+r()*120)*J,Xe=ht(r()<.5?"#ffb050":"#ff5a1e");i.emit(U,-Z,(r()-.5)*20,Math.cos(me)*ye,Math.sin(me)*ye,(r()-.5)*ye,Xe.r*2,Xe.g*2,Xe.b*2,1,.35+r()*.3,(7+r()*6)*J,(16+r()*10)*J,40,4,0,1.5)}O(U,Z,"#ffd08a",Math.round(26*J),260*J,{grav:-520}),H(U,Z,xe&&xe.key==="vaults"?"#3a5458":"#3a3230",Math.round(7*J),11*J,{life:1.6,speed:45*J,rise:30,alpha:.6}),Y(U,Z,xe?xe.rock.base:"#6a5a50",Math.round(7*J),190*J,2.2*Math.sqrt(J),.25),J>=1.4&&$(U,Z,"#ffb070",70*J,.45),ve(U,Z,"#ffa050",9*J,170*J,.32+.1*J),Ze(.25*J)}function se(U,Z=.62){return ip.setHSL((U%1+1)%1,1,Z)}function fe(U,Z,ae){B(U,Z,"#fff0d0",16,.12,10,2.6),B(U,Z,"#ff9a3c",26,.28,8,1.6);for(let xe=0;xe<9;xe++){let J=r()*Math.PI*2,re=40+r()*90;i.emit(U,-Z,(r()-.5)*14,Math.cos(J)*re,Math.sin(J)*re,(r()-.5)*re,2.2,1,.35,1,.28+r()*.2,5+r()*4,11+r()*6,40,4,0,1.5)}O(U,Z,"#ffd08a",16,230,{grav:-520}),H(U,Z,ae&&ae.key==="vaults"?"#3a5458":"#3a3230",4,8,{life:1.2,speed:35,rise:26,alpha:.5}),$(U,Z,"#ffb070",30,.28),ve(U,Z,"#ff9a50",6,120,.22),Ze(.12)}function Ae(U,Z,ae){K(U,Z,.7,ae);for(let xe=0;xe<26;xe++){let J=r()*Math.PI*2,re=20+r()*70;i.emit(U+(r()-.5)*14,-Z+(r()-.5)*10,(r()-.5)*12,Math.cos(J)*re*.6,Math.abs(Math.sin(J))*re+40,(r()-.5)*20,2.2,.75,.18,1,.4+r()*.5,4+r()*4,9+r()*6,90,2.5,0,2)}for(let xe=0;xe<14;xe++)i.emit(U+(r()-.5)*16,-Z,(r()-.5)*10,(r()-.5)*60,60+r()*120,(r()-.5)*30,2,.7,.15,1,1+r()*1.2,1.4,.4,-30,1.2,.02,0);H(U,Z,"#16110e",8,10,{life:2.2,speed:30,rise:44,alpha:.7}),Y(U,Z,"#241c18",6,150,1.8,.7)}function Ie(U,Z){B(U,Z,"#e8fbff",22,.18,10,2.2),B(U,Z,"#7fd8ff",34,.35,8,1.1),Y(U,Z,"#cdeeff",14,230,2.1,0);for(let ae=0;ae<34;ae++){let xe=r()*Math.PI*2,J=80+r()*220;i.emit(U,-Z,(r()-.5)*20,Math.cos(xe)*J,Math.sin(xe)*J,(r()-.5)*J*.6,1.4,1.9,2.3,1,.35+r()*.45,1.6+r(),.4,-380,2.4,.02,0)}H(U,Z,"#d8f0ff",4,6,{life:.9,speed:45,rise:14,alpha:.2,grav:-6}),$(U,Z,"#bdf2ff",40,.35),ve(U,Z,"#a8ecff",5,130,.3),Ze(.15)}function D(U,Z,ae=.5){B(U,Z,"#ffffff",16+10*ae,.14,10,2.6);for(let J=0;J<30+30*ae;J++){let re=r()*Math.PI*2,me=90+r()*240,ye=se(r());i.emit(U,-Z,(r()-.5)*20,Math.cos(re)*me,Math.sin(re)*me,(r()-.5)*me*.5,ye.r*2.2,ye.g*2.2,ye.b*2.2,1,.3+r()*.4,1.8+r(),.4,-200,2.6,.025,0)}let xe=Math.round(6+8*ae);for(let J=0;J<xe;J++)Y(U,Z,"#"+se(J/xe,.7).getHexString(),1,200+120*ae,1.7,0);$(U,Z,"#e6c8ff",30+30*ae,.32),$(U,Z,"#9ff4ff",18+20*ae,.24,{start:1}),ve(U,Z,"#d7a8ff",4+5*ae,140,.25),Ze(.08+.15*ae)}function T(U,Z,ae,xe,J){B(U,Z,"#ffffff",10+18*ae,.1+.08*ae,10,2.8),B(U,Z,"#d9a8ff",18+26*ae,.22,8,1.4);for(let re=0;re<10+30*ae;re++){let me=(r()-.5)*1.2,ye=Math.atan2(-J,xe)+me,Xe=120+r()*260*ae,je=se(r());i.emit(U,-Z,(r()-.5)*10,Math.cos(ye)*Xe,Math.sin(ye)*Xe,(r()-.5)*40,je.r*2,je.g*2,je.b*2,1,.18+r()*.25,1.6,.4,0,3,.03,0)}ae>.6&&$(U,Z,"#f0dcff",26+30*ae,.3),ve(U,Z,"#e6c4ff",4+8*ae,150,.18),Ze(.1+.25*ae)}function j(U,Z,ae){M.length>=p.instanceMatrix.count&&M.shift(),M.push({x:U,y:-Z,z:4+r()*3,vx:-ae*(50+r()*50),vy:90+r()*70,vz:(r()-.5)*30,rx:r()*6,ry:r()*6,wr:(r()-.5)*30,s:1,life:2.2+r(),age:0})}function he(U,Z,ae,xe,J){let re=Math.min(3,J*60);for(let me=0;me<re*1.6;me++){let ye=U+r()*ae,Xe=Z+xe*(.2+r()*.8);i.emit(ye,-Xe,6+(r()-.5)*8,(r()-.5)*14,30+r()*40,0,2.2,.8+r()*.3,.2,1,.25+r()*.25,2.5+r()*2.5,5+r()*3,60,2,0,2)}r()<J*10&&s.emit(U+r()*ae,-Z,2,(r()-.5)*8,24,0,.12,.1,.09,.45,1.4,4,12,14,1,0,0),ge(U+ae/2,-(Z+xe/2),14,"#ff7a2a",1.1,80)}function Me(U,Z,ae,xe){let J=Math.min(3,xe*60);B(U,Z,"#ffe7b0",5,.035,6,1.4*J),r()<J*.5&&i.emit(U,-Z,6,ae*(80+r()*120),(r()-.3)*60,(r()-.5)*30,2.2,1.2,.4,1,.2,1.2,.3,-260,2,.02,0),ge(U+ae*30,-Z,16,"#ff8a3a",2.4,120)}let de=0;function $e(U,Z,ae,xe,J){if(E.visible=ae>.02,!E.visible){de=0;return}E.position.set(U,-Z,7);let re=8+22*ae+(ae>=1?2*Math.sin(J*30):0);E.scale.set(re,re,1),y.uC.value=Math.min(1,ae),y.uTime.value=J;let me=Math.min(3,xe*60);for(let ye=0;ye<me*(1+3*ae);ye++){let Xe=r()*Math.PI*2,je=16+10*ae,le=.22,De=6,It=(1-Math.exp(-De*le))/De,Ft=se(r(),.7);i.emit(U+Math.cos(Xe)*je,-Z+Math.sin(Xe)*je,7,-Math.cos(Xe)*je/It,-Math.sin(Xe)*je/It,0,Ft.r*1.8,Ft.g*1.8,Ft.b*1.8,1,le,1.4,.5,0,De,.02,0)}ge(U,-Z,16,"#e0b8ff",.8+2.6*ae,90+60*ae),ae>=1&&de<1&&($(U,Z,"#ffffff",18,.25,{start:1}),$(U,Z,"#d9a8ff",30,.35,{start:1}),ve(U,Z,"#f0d8ff",4,110,.15)),de=ae}function Re(U,Z,ae,xe,J){i.update(Z),s.update(Z);let re=(me,ye,Xe)=>{let je=0;for(let le=me.length-1;le>=0;le--){let De=me[le];if(De.age+=U,De.age>De.life){me.splice(le,1);continue}De.vy-=640*U;let It=De.x+De.vx*U,Ft=De.y+De.vy*U;J(It,-Ft)?J(De.x,-Ft)?(De.vy*=-.38,De.vx*=.7,De.wr*=.6):De.vx*=-.5:(De.x=It,De.y=Ft),De.z+=De.vz*U,De.vz*=.98,De.rx+=De.wr*U,De.ry+=De.wr*.7*U}me.forEach((le,De)=>{let It=1-Math.max(0,(le.age-le.life+.4)/.4);u.position.set(le.x,le.y,le.z),u.rotation.set(le.rx,le.ry,0),u.scale.setScalar(le.s*It),u.updateMatrix(),ye.setMatrixAt(De,u.matrix),Xe&&ye.setColorAt(De,le.c)}),ye.count=me.length,ye.instanceMatrix.needsUpdate=!0,Xe&&ye.instanceColor&&(ye.instanceColor.needsUpdate=!0)};re(h,c,!0),re(g,f,!1),re(M,p,!1);for(let me=g.length-1;me>=0;me--)r()<U*20&&i.emit(g[me].x,g[me].y,g[me].z,0,10,0,1.6,.6,.2,1,.25,1.6,.4,0,1,0,0);for(let me=L.length-1;me>=0;me--){let ye=L[me];ye.age+=U;let Xe=ye.age/ye.life;if(Xe>=1){n.remove(ye.m),ye.m.material.dispose(),L.splice(me,1);continue}ye.m.scale.setScalar(ye.start+Xe*ye.radius),ye.m.material.uniforms.uA.value=(1-Xe)*(1-Xe)}for(let me=Fe.length-1;me>=0;me--){let ye=Fe[me];ye.age+=U,ye.age>ye.life&&(n.remove(ye.m),ye.m.geometry.dispose(),Fe.splice(me,1))}be.uTime.value=Z,N.uTime.value=Z;for(let me=ie.length-1;me>=0;me--){let ye=ie[me];if(ye.age+=U,ye.age>ye.life){ie.splice(me,1);continue}let Xe=1-ye.age/ye.life;ne.push({x:ye.x,y:-ye.y,z:30,color:ye.color,intensity:ye.intensity*Xe*Xe,distance:ye.distance})}ne.sort((me,ye)=>ye.intensity/(1+Math.abs(ye.x-xe.x)*.004)-me.intensity/(1+Math.abs(me.x-xe.x)*.004));for(let me=0;me<Be;me++){let ye=ke[me],Xe=ne[me];Xe?(ye.position.set(Xe.x,Xe.y,Xe.z),ye.color.set(Xe.color),ye.intensity=Xe.intensity*1500,ye.distance=Xe.distance*2.2):ye.intensity=0}ne=[],Se=Math.max(0,Se-U*2.2)}let qe=new Gt,Ge=new k(0,1,0),Te=new k;function We(U,Z,ae,xe=.016){let J=0,re=new Ue,me=Math.min(3,xe*60),ye=U.frame/60,Xe=0,je=(le,De,It,Ft,Yt,fn,rn,ln)=>{J>=P||(qe.position.set(le,-De,4),Te.set(It||1,-(Ft||0),0).normalize(),qe.quaternion.setFromUnitVectors(Ge,Te),qe.scale.set(fn,Yt,fn),qe.updateMatrix(),b.setMatrixAt(J,qe.matrix),re.set(rn).multiplyScalar(ln),b.setColorAt(J,re),J++)};for(let le of U.pshots)if(!(le.life<=0||le.x<Z-40||le.x>Z+ae+40))if(le.kind==="bounce")je(le.x,le.y,le.vx,le.vy,2.6,2.6,"#ff7ad9",3.2),r()<.7&&i.emit(le.x,-le.y,4,0,0,0,1.6,.5,1.3,1,.25,4,1,0,1,0,0),ge(le.x,-le.y,14,"#ff6ad0",.5,70);else if(le.kind==="seeker"){let De=Math.hypot(le.vx,le.vy)||1,It=le.vx/De,Ft=le.vy/De,Yt=le.x-It*5,fn=le.y-Ft*5;je(le.x,le.y,le.vx,le.vy,3.4,1.45,"#ffe6c8",2.2),je(Yt,fn,le.vx,le.vy,2.2,1.1,"#ff9a3c",4);for(let rn=0;rn<me;rn++)i.emit(Yt,-fn,4,-It*70+(r()-.5)*24,Ft*70+(r()-.5)*24,(r()-.5)*10,2.4,1.2,.4,1,.08+r()*.05,3,1,0,2,0,0);for(let rn=0;rn<me*2;rn++){let ln=r()*De*.016;s.emit(Yt-It*ln+(r()-.5)*1.5,-(fn-Ft*ln)+(r()-.5)*1.5,(r()-.5)*4,(r()-.5)*6,(r()-.5)*6+5,0,.62,.6,.58,.2,.55+r()*.45,3,9,7,1.5,0,0)}ge(le.x,-le.y,12,"#ff9a3c",.7,70)}else if(le.kind==="flame"){let De=1-le.life/(le.life0||.35),It=le.x+le.w/2,Ft=le.y+le.h/2,Yt=De<.2?2:De<.55?1.8:.9,fn=De<.2?1.15:De<.55?.55:.2,rn=De<.2?.35:De<.55?.1:.04;for(let ln=0;ln<me*1.4;ln++)i.emit(It+(r()-.5)*le.w*.5,-Ft+(r()-.5)*le.h*.5,4+(r()-.5)*le.w*.4,le.vx*.25+(r()-.5)*20,-le.vy*.25+20+r()*20,(r()-.5)*20,Yt,fn,rn,1,.1+r()*.07,3+De*8,5+De*13,40,2,0,2);De>.3&&r()<me*.45&&s.emit(It+(r()-.5)*le.w*.4,-Ft+(r()-.5)*le.h*.4,(r()-.5)*8,le.vx*.2,24,0,1,.42,.12,.32,.35,3+De*5,7+De*8,30,2,0,0),De>.6&&r()<me*.35&&s.emit(It,-Ft,(r()-.5)*8,le.vx*.2,30,0,.14,.12,.1,.4,1.2,4+De*6,13+De*10,16,1,0,0),Xe++%4===0&&ge(It,-Ft,14,"#ff7a2a",1.3,90)}else if(le.kind==="prism"){if(je(le.x,le.y,le.vx,le.vy,4.2,1.2,"#f6ecff",2.8),r()<me*.6){let De=se(r());i.emit(le.x,-le.y,4,(r()-.5)*30,(r()-.5)*30,0,De.r*1.6,De.g*1.6,De.b*1.6,1,.18,1.8,.4,0,2,0,0)}ge(le.x,-le.y,12,"#e2c4ff",.5,60)}else if(le.kind==="prismBig"){let De=le.x+le.w/2,It=le.y+le.h/2,Ft=le.charge||.5;je(De,It,le.vx,le.vy,le.w*.6,le.w*.18,"#f6eeff",2.4),B(De,It,"#"+se(ye*1.7,.55).getHexString(),le.w*1.1,.04,6,.9*me);for(let Yt=0;Yt<me*(2+4*Ft);Yt++){let fn=se(r()*.85+ye,.55);i.emit(De+(r()-.5)*le.w*.6,-It+(r()-.5)*le.h*.6,4+(r()-.5)*8,-le.vx*.1+(r()-.5)*60,(r()-.5)*60,(r()-.5)*30,fn.r*1.5,fn.g*1.5,fn.b*1.5,1,.35+r()*.3,3+r()*2.5,.6,0,2.4,.012,0)}ge(De,-It,16,"#e0b0ff",2+2*Ft,130)}else if(le.kind==="shard"){let De=se(le.hue||0,.66);je(le.x,le.y,le.vx,le.vy,3.2,.95,"#"+De.getHexString(),3.2),r()<me*.7&&i.emit(le.x,-le.y,4,0,0,0,De.r*1.4,De.g*1.4,De.b*1.4,1,.15,2.2,.5,0,1,0,0)}else{let De=Math.hypot(le.vx,le.vy);je(le.x,le.y,le.vx,le.vy,Math.max(4,De*.016),1.05,"#ffd23f",2.2),r()<.3&&i.emit(le.x,-le.y,4,0,0,0,1.1,.8,.25,1,.1,2.4,.6,0,1,0,0)}for(let le of U.eshots)if(!(le.life<=0||le.x<Z-40||le.x>Z+ae+40))if(le.kind==="wave")je(le.x+le.w/2,le.y+le.h/2,le.vx,0,6,5,"#ffb070",3),i.emit(le.x+le.w/2,-(le.y+le.h),2,0,40,0,1.8,.9,.4,1,.3,7,2,0,1,0,0),ge(le.x,-le.y,10,"#ff9040",.8,70);else if(le.kind==="lob")je(le.x,le.y,le.vx,le.vy,4,4,"#b7ff68",2.4),r()<.6&&i.emit(le.x,-le.y,4,0,0,0,.8,1.6,.4,1,.3,5,1,0,1,0,0);else{let De=le.flame||le.kind==="flame";je(le.x,le.y,le.vx,le.vy,De?5:3.4,De?3.4:2.6,De?"#ff8a3c":"#ff4a6a",3),r()<.5&&i.emit(le.x,-le.y,4,0,0,0,1.8,.4,.5,1,.18,4.5,1,0,1,0,0)}b.count=J,b.instanceMatrix.needsUpdate=!0,b.instanceColor&&(b.instanceColor.needsUpdate=!0)}function it(U,Z,ae,xe){let J=U.beamActive&&U.beam;if(V.visible=ce.visible=!!J,!J)return;if(xe&&Math.hypot(xe.x-J.ox,xe.y-J.oy)<24){let rn=J.ox+J.dx*J.len,ln=J.oy+J.dy*J.len,ri=Math.hypot(rn-xe.x,ln-xe.y)||1;J={...J,ox:xe.x,oy:xe.y,dx:(rn-xe.x)/ri,dy:(ln-xe.y)/ri,len:ri}}let re=Math.max(4,J.len),me=(J.width||10)*1.6,ye=Math.atan2(-J.dy,J.dx);V.position.set(J.ox,-J.oy,5),V.rotation.set(0,0,ye),V.scale.set(re,me*1.25,1),N.uLen.value=re;let Xe=q.attributes.position.array,je=0,le=-Math.sin(ye),De=Math.cos(ye),It=Math.cos(ye),Ft=Math.sin(ye);for(let rn=0;rn<z;rn++){let ln=J.ox,ri=-J.oy,oe=0,pe=rn?5+rn*2:2;for(let G=1;G<=X;G++){let Le=G/X;oe=(r()-.5)*pe*Math.sin(Le*Math.PI)*2+oe*.35;let He=J.ox+It*re*Le+le*oe,et=-J.oy+Ft*re*Le+De*oe,_e=rn?.35:.7;for(let[xt,st]of[[ln+le*_e,ri+De*_e],[ln-le*_e,ri-De*_e],[He-le*_e,et-De*_e],[ln+le*_e,ri+De*_e],[He-le*_e,et-De*_e],[He+le*_e,et+De*_e]])Xe[je++]=xt,Xe[je++]=st,Xe[je++]=6;ln=He,ri=et}}q.attributes.position.needsUpdate=!0,q.computeBoundingSphere();let Yt=J.ox+J.dx*re,fn=J.oy+J.dy*re;r()<.8&&O(Yt,fn,"#9ff8ff",2,160,{life:.6}),r()<.3&&B(Yt,fn,"#6cf3ff",10,.1,6,1.6),ge(J.ox+J.dx*re*.3,-(J.oy+J.dy*re*.3),18,"#5af6ff",2.2,110),ge(Yt,-fn,18,"#9ff8ff",2,90)}function Qe(U,Z,ae){let xe=new rt(new mn(26,ae+120),Ce);xe.position.set(U,-(Z+ae/2),10),n.add(xe),Fe.push({m:xe,age:0,life:.4});for(let J=0;J<30;J++)i.emit(U+(r()-.5)*10,-(Z+r()*ae),8,(r()-.5)*60,(r()-.5)*60,(r()-.5)*40,.6,1.6,1.3,1,.4,3,.5,0,2,.01,0);ge(U,-(Z+ae/2),20,"#67ffd4",4,260)}function Oe(U){let Z=0;for(let ae of U)ae.line&&Fe[Z]&&(Fe[Z].m.position.x=ae.x,Z++)}function pt(){i.clear(),s.clear(),h.length=0,g.length=0,M.length=0,c.count=0,f.count=0,p.count=0,E.visible=!1;for(let U of L)n.remove(U.m),U.m.material.dispose();L.length=0;for(let U of Fe)n.remove(U.m);Fe.length=0,ie.length=0}return{glow:i,smoke:s,sparks:O,puff:H,glowBall:B,ring:$,chunks:Y,explosion:K,blast:fe,burnUp:Ae,iceShatter:Ie,crystalBurst:D,prismFire:T,casing:j,burning:he,nozzle:Me,charge:$e,update:Re,drawShots:We,drawBeam:it,shockwall:Qe,moveWalls:Oe,light:ge,flashLight:ve,shakeImpulse:Ze,get shake(){return Se},clear:pt,stats:()=>({debris:h.length,rings:L.length,lights:Be})}}var _i={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var kn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},vy=new Ks(-1,1,1,-1,0,1),Ou=class extends Tt{constructor(){super(),this.setAttribute("position",new tt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new tt([0,2,0,0,2,0],2))}},yy=new Ou,Mi=class{constructor(e){this._mesh=new rt(yy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,vy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var cr=class extends kn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof vt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Kn.clone(e.uniforms),this.material=new vt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Mi(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ya=class extends kn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Xc=class extends kn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var qc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let i=e.getSize(new we);this._width=i.width,this._height=i.height,t=new pn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:bn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new cr(_i),this.copyPass.material.blending=xn,this.clock=new ra}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ya!==void 0&&(o instanceof ya?i=!0:o instanceof Xc&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new we);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Yc=class extends kn{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ue}render(e,t,i){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var rp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ue(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var eo=class n extends kn{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new we(e.x,e.y):new we(256,256),this.clearColor=new Ue(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new pn(r,o,{type:bn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new pn(r,o,{type:bn});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new pn(r,o,{type:bn});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=rp;this.highPassUniforms=Kn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new vt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new we(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Kn.clone(_i.uniforms),this.blendMaterial=new vt({uniforms:this.copyUniforms,vertexShader:_i.vertexShader,fragmentShader:_i.fragmentShader,blending:Mn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ue,this._oldClearAlpha=1,this._basic=new cn,this._fsQuad=new Mi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new we(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new vt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new we(.5,.5)},direction:{value:new we(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new vt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};eo.BlurDirectionX=new we(1,0);eo.BlurDirectionY=new we(0,1);var _a={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Zc=class extends kn{constructor(){super(),this.uniforms=Kn.clone(_a.uniforms),this.material=new Qo({name:_a.name,uniforms:this.uniforms,vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader}),this._fsQuad=new Mi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Dt.getTransfer(this._outputColorSpace)===zt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Wl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Xl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ql?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Xr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Zl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$l?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Yl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ma={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new we},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new ot},cameraProjectionMatrixInverse:{value:new ot},cameraWorldMatrix:{value:new ot},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new k(-1,-1,-1)},sceneBoxMax:{value:new k(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},ba={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},$c={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function op(n=5){let e=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),t=_y(e),i=t.length,s=new Uint8Array(i*4);for(let o=0;o<i;++o){let a=t[o],l=2*Math.PI*a/i,c=new k(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new Nn(s,e,e);return r.wrapS=Hn,r.wrapT=Hn,r.needsUpdate=!0,r}function _y(n){let e=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),t=e*e,i=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let o=1;o<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),i[s*e+r]!==0){r-=2,s++;continue}else i[s*e+r]=o++;r++,s--}return i}var Sa={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:zu(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new we},cameraProjectionMatrixInverse:{value:new ot},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function zu(n,e,t){let i=My(n,e,t),s="vec3[SAMPLES](";for(let r=0;r<n;r++){let o=i[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<n-1?",":")"}`}return s}function My(n,e,t){let i=[];for(let s=0;s<n;s++){let r=2*Math.PI*e*s/n,o=Math.pow(s/(n-1),t);i.push(new k(Math.cos(r),Math.sin(r),o))}return i}var Jc=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let i,s,r,o=.5*(Math.sqrt(3)-1),a=(e+t)*o,l=Math.floor(e+a),c=Math.floor(t+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,g=e-d,x=t-f,m,p;g>x?(m=1,p=0):(m=0,p=1);let M=g-m+h,y=x-p+h,v=g-1+2*h,E=x-1+2*h,R=l&255,C=c&255,P=this.perm[R+this.perm[C]]%12,b=this.perm[R+m+this.perm[C+p]]%12,S=this.perm[R+1+this.perm[C+1]]%12,I=.5-g*g-x*x;I<0?i=0:(I*=I,i=I*I*this._dot(this.grad3[P],g,x));let L=.5-M*M-y*y;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[b],M,y));let N=.5-v*v-E*E;return N<0?r=0:(N*=N,r=N*N*this._dot(this.grad3[S],v,E)),70*(i+s+r)}noise3d(e,t,i){let s,r,o,a,c=(e+t+i)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),d=Math.floor(i+c),f=1/6,g=(h+u+d)*f,x=h-g,m=u-g,p=d-g,M=e-x,y=t-m,v=i-p,E,R,C,P,b,S;M>=y?y>=v?(E=1,R=0,C=0,P=1,b=1,S=0):M>=v?(E=1,R=0,C=0,P=1,b=0,S=1):(E=0,R=0,C=1,P=1,b=0,S=1):y<v?(E=0,R=0,C=1,P=0,b=1,S=1):M<v?(E=0,R=1,C=0,P=0,b=1,S=1):(E=0,R=1,C=0,P=1,b=1,S=0);let I=M-E+f,L=y-R+f,N=v-C+f,W=M-P+2*f,V=y-b+2*f,z=v-S+2*f,X=M-1+3*f,q=y-1+3*f,ee=v-1+3*f,ce=h&255,be=u&255,Ce=d&255,Fe=this.perm[ce+this.perm[be+this.perm[Ce]]]%12,Be=this.perm[ce+E+this.perm[be+R+this.perm[Ce+C]]]%12,ke=this.perm[ce+P+this.perm[be+b+this.perm[Ce+S]]]%12,ne=this.perm[ce+1+this.perm[be+1+this.perm[Ce+1]]]%12,ie=.6-M*M-y*y-v*v;ie<0?s=0:(ie*=ie,s=ie*ie*this._dot3(this.grad3[Fe],M,y,v));let ge=.6-I*I-L*L-N*N;ge<0?r=0:(ge*=ge,r=ge*ge*this._dot3(this.grad3[Be],I,L,N));let ve=.6-W*W-V*V-z*z;ve<0?o=0:(ve*=ve,o=ve*ve*this._dot3(this.grad3[ke],W,V,z));let Se=.6-X*X-q*q-ee*ee;return Se<0?a=0:(Se*=Se,a=Se*Se*this._dot3(this.grad3[ne],X,q,ee)),32*(s+r+o+a)}noise4d(e,t,i,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,u,d,f,g,x=(e+t+i+s)*l,m=Math.floor(e+x),p=Math.floor(t+x),M=Math.floor(i+x),y=Math.floor(s+x),v=(m+p+M+y)*c,E=m-v,R=p-v,C=M-v,P=y-v,b=e-E,S=t-R,I=i-C,L=s-P,N=b>S?32:0,W=b>I?16:0,V=S>I?8:0,z=b>L?4:0,X=S>L?2:0,q=I>L?1:0,ee=N+W+V+z+X+q,ce=o[ee][0]>=3?1:0,be=o[ee][1]>=3?1:0,Ce=o[ee][2]>=3?1:0,Fe=o[ee][3]>=3?1:0,Be=o[ee][0]>=2?1:0,ke=o[ee][1]>=2?1:0,ne=o[ee][2]>=2?1:0,ie=o[ee][3]>=2?1:0,ge=o[ee][0]>=1?1:0,ve=o[ee][1]>=1?1:0,Se=o[ee][2]>=1?1:0,Ze=o[ee][3]>=1?1:0,ht=b-ce+c,O=S-be+c,H=I-Ce+c,B=L-Fe+c,$=b-Be+2*c,Y=S-ke+2*c,K=I-ne+2*c,se=L-ie+2*c,fe=b-ge+3*c,Ae=S-ve+3*c,Ie=I-Se+3*c,D=L-Ze+3*c,T=b-1+4*c,j=S-1+4*c,he=I-1+4*c,Me=L-1+4*c,de=m&255,$e=p&255,Re=M&255,qe=y&255,Ge=a[de+a[$e+a[Re+a[qe]]]]%32,Te=a[de+ce+a[$e+be+a[Re+Ce+a[qe+Fe]]]]%32,We=a[de+Be+a[$e+ke+a[Re+ne+a[qe+ie]]]]%32,it=a[de+ge+a[$e+ve+a[Re+Se+a[qe+Ze]]]]%32,Qe=a[de+1+a[$e+1+a[Re+1+a[qe+1]]]]%32,Oe=.6-b*b-S*S-I*I-L*L;Oe<0?h=0:(Oe*=Oe,h=Oe*Oe*this._dot4(r[Ge],b,S,I,L));let pt=.6-ht*ht-O*O-H*H-B*B;pt<0?u=0:(pt*=pt,u=pt*pt*this._dot4(r[Te],ht,O,H,B));let U=.6-$*$-Y*Y-K*K-se*se;U<0?d=0:(U*=U,d=U*U*this._dot4(r[We],$,Y,K,se));let Z=.6-fe*fe-Ae*Ae-Ie*Ie-D*D;Z<0?f=0:(Z*=Z,f=Z*Z*this._dot4(r[it],fe,Ae,Ie,D));let ae=.6-T*T-j*j-he*he-Me*Me;return ae<0?g=0:(ae*=ae,g=ae*ae*this._dot4(r[Qe],T,j,he,Me)),27*(h+u+d+f+g)}_dot(e,t,i){return e[0]*t+e[1]*i}_dot3(e,t,i,s){return e[0]*t+e[1]*i+e[2]*s}_dot4(e,t,i,s,r){return e[0]*t+e[1]*i+e[2]*s+e[3]*r}};var to=class n extends kn{constructor(e,t,i=512,s=512,r,o,a){super(),this.width=i,this.height=s,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=op(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new pn(this.width,this.height,{type:bn}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new vt({defines:Object.assign({},Ma.defines),uniforms:Kn.clone(Ma.uniforms),vertexShader:Ma.vertexShader,fragmentShader:Ma.fragmentShader,blending:xn,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new ea,this.normalMaterial.blending=xn,this.pdMaterial=new vt({defines:Object.assign({},Sa.defines),uniforms:Kn.clone(Sa.uniforms),vertexShader:Sa.vertexShader,fragmentShader:Sa.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new vt({defines:Object.assign({},ba.defines),uniforms:Kn.clone(ba.uniforms),vertexShader:ba.vertexShader,fragmentShader:ba.fragmentShader,blending:xn}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new vt({uniforms:Kn.clone(_i.uniforms),vertexShader:_i.vertexShader,fragmentShader:_i.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:aa,blendDst:js,blendEquation:li,blendSrcAlpha:oa,blendDstAlpha:js,blendEquationAlpha:li}),this.blendMaterial=new vt({uniforms:Kn.clone($c.uniforms),vertexShader:$c.vertexShader,fragmentShader:$c.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Fl,blendSrc:aa,blendDst:js,blendEquation:li,blendSrcAlpha:oa,blendDstAlpha:js,blendEquationAlpha:li}),this._fsQuad=new Mi(null),this._originalClearColor=new Ue,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new ns,this.depthTexture.format=Ms,this.depthTexture.type=_s,this.normalRenderTarget=new pn(this.width,this.height,{minFilter:yn,magFilter:yn,type:bn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let i=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=zu(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,i){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case n.OUTPUT.Off:break;case n.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=xn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=xn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=xn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=xn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=xn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,i,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_renderOverride(e,t,i,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,t.push(i))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Jc,i=e*e*4,s=new Uint8Array(i);for(let o=0;o<e;o++)for(let a=0;a<e;a++){let l=o,c=a;s[(o*e+a)*4]=(t.noise(l,c)*.5+.5)*255,s[(o*e+a)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(o*e+a)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(o*e+a)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new Nn(s,e,e,Sn,Jn);return r.wrapS=Hn,r.wrapT=Hn,r.needsUpdate=!0,r}};to.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Bu=class extends kn{constructor(e,t){super(),this.scene=e,this.camera=t,this.water=null,this.enabled=!1,this.copy=new Mi(new vt({uniforms:{tDiffuse:{value:null}},vertexShader:_i.vertexShader,depthTest:!1,depthWrite:!1,fragmentShader:"uniform sampler2D tDiffuse;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);gl_FragColor=any(isnan(c))||any(isinf(c))?vec4(0.,0.,0.,1.):c;}"}))}render(e,t,i){e.setRenderTarget(this.renderToScreen?null:t),e.clear(!0,!0,!1),this.copy.material.uniforms.tDiffuse.value=i.texture,this.copy.render(e);let s=this.water.uniforms;s.tScene.value=i.texture,s.tDepth.value=i.depthTexture;let r=this.scene.background,o=e.autoClear,a=e.shadowMap.autoUpdate,l=this.camera.layers.mask;this.scene.background=null,e.autoClear=!1,e.shadowMap.autoUpdate=!1,this.camera.layers.set(1),e.render(this.scene,this.camera),this.camera.layers.mask=l,e.shadowMap.autoUpdate=a,e.autoClear=o,this.scene.background=r}dispose(){this.copy.dispose(),this.copy.material.dispose()}},Hu=class extends to{_overrideVisibility(){super._overrideVisibility(),this._hidden=[],this.scene.traverse(e=>{e.visible&&e.isMesh&&e.material&&(e.material.transparent||e.material.isShaderMaterial)&&(e.visible=!1,this._hidden.push(e))})}_restoreVisibility(){for(let e of this._hidden)e.visible=!0;this._hidden=[],super._restoreVisibility()}},by={uniforms:{tDiffuse:{value:null},uRip:{value:[0,1,2,3,4,5].map(()=>new Lt)},uHaze:{value:new Lt},uAspect:{value:1},uTime:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`uniform sampler2D tDiffuse;uniform vec4 uRip[6];uniform vec4 uHaze;uniform float uAspect,uTime;varying vec2 vUv;
    void main(){vec2 uv=vUv,off=vec2(0.);float crest=0.;vec2 asp=vec2(uAspect,1.);
      for(int i=0;i<6;i++){vec4 r=uRip[i];if(r.w<=0.)continue;vec2 d=(uv-r.xy)*asp;float L=length(d);
        float x=(L-r.z)/(.012+r.z*.22);float ring=exp(-x*x)*r.w;crest+=ring;off+=(L>1e-4?d/L:vec2(0.))*ring*.022/asp*sign(-x+.0001);}
      if(uHaze.w>0.){vec2 d=(uv-uHaze.xy)*asp;float m=smoothstep(uHaze.z,uHaze.z*.15,length(d))*uHaze.w;
        off+=vec2(sin(uv.y*150.+uTime*23.)*sin(uv.x*70.-uTime*13.),sin((uv.x+uv.y)*190.+uTime*31.))*m*.0032;}
      vec2 q=clamp(uv+off,0.,1.);vec2 ca=off*.6;
      vec3 c=vec3(texture2D(tDiffuse,q+ca).r,texture2D(tDiffuse,q).g,texture2D(tDiffuse,q-ca).b);
      gl_FragColor=vec4(c*(1.+crest*.08),1.);}`},Sy={uniforms:{tDiffuse:{value:null},uTime:{value:0},uVignette:{value:.32},uCA:{value:0},uGrain:{value:.035},uFrost:{value:0},uHurt:{value:0},uFlash:{value:0},uLift:{value:new k},uGain:{value:new k(1,1,1)},uSat:{value:1},uScan:{value:0},uRes:{value:new we(1,1)},uFade:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVignette,uCA,uGrain,uFrost,uHurt,uFlash,uSat,uScan,uFade;uniform vec3 uLift,uGain;uniform vec2 uRes;varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    void main(){vec2 uv=vUv;vec2 c=uv-.5;float r2=dot(c,c);
      vec3 col;if(uCA>.0005){vec2 o=c*uCA*r2*4.;col=vec3(texture2D(tDiffuse,uv+o).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-o).b);}else col=texture2D(tDiffuse,uv).rgb;
      col=col*uGain+uLift*(1.-col);float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,uSat);
      if(uFrost>0.){vec2 q=uv*vec2(uRes.x/uRes.y,1.);float n=vn(q*7.)*.55+vn(q*23.)*.3+vn(q*61.)*.15;
        float edge=smoothstep(.1,.3,r2+(n-.5)*.14);
        col=mix(col,vec3(.82,.95,1.)*(l*.45+.6),edge*uFrost*.62);
        col=mix(col,vec3(dot(col,vec3(.33)))*vec3(.84,.97,1.14),uFrost*.3);}
      if(uHurt>0.){col=mix(col,vec3(1.,.08,.12),smoothstep(.1,.5,r2)*uHurt*.6);}
      col*=1.-uVignette*smoothstep(.12,.62,r2);
      col+=uFlash*vec3(.85,.95,1.);
      col+=(h(uv*uRes+fract(uTime*7.1)*91.)-.5)*uGrain;
      if(uScan>0.)col*=1.-uScan*.18*(.5+.5*sin(uv.y*uRes.y*3.14159));
      col*=1.-uFade;
      gl_FragColor=vec4(col,1.);}`};function ap(n,e,t,i){let s=n.getDrawingBufferSize(new we),r=new pn(s.x,s.y,{type:bn,samples:i==="low"?0:4});r.depthTexture=new ns(s.x,s.y),r.depthTexture.type=Vi;let o=new qc(n,r),a=new Yc(e,t);o.addPass(a);let l=new Bu(e,t);o.addPass(l);let c=null;i==="ultra"&&(c=new Hu(e,t,s.x,s.y),c.output=to.OUTPUT.Default,c.blendIntensity=.85,c.updateGtaoMaterial({radius:16,distanceExponent:1.6,thickness:6,distanceFallOff:1,scale:1.15,samples:12}),c.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,rings:2,samples:12}),o.addPass(c));let h=new cr(by);h.enabled=!1,o.addPass(h);let u=new eo(new we(s.x,s.y),.6,.55,.92);o.addPass(u),o.addPass(new Zc);let d=new cr(Sy);o.addPass(d);let f=d.uniforms;return{composer:o,bloom:u,final:d,u:f,ao:c,setWater(g){l.water=g,l.enabled=!!g},setShock(g,x,m,p){let M=h.uniforms;for(let y=0;y<6;y++){let v=g[y];M.uRip.value[y].set(v?v.x:0,v?v.y:0,v?v.r:0,v?v.a:0)}x?M.uHaze.value.set(x.x,x.y,x.r,x.a):M.uHaze.value.w=0,M.uAspect.value=m,M.uTime.value=p,h.enabled=g.length>0||!!x},setSize(g,x){o.setSize(g,x),f.uRes.value.set(g,x),u.resolution.set(g,x)},setGrade(g){f.uLift.value.set(...g.lift),f.uGain.value.set(...g.gain),f.uSat.value=g.sat},render(){o.render()}}}var lp={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9",seeker:"#ff9a3c",flare:"#ff6a2a",prism:"#d9a8ff"},wy={spread:"SCATTER",beam:"ARC LANCE",bounce:"RICOCHET",seeker:"SEEKER SWARM",flare:"SOLAR FLARE",prism:"PRISM CANNON"},Ey=["spread","beam","bounce","seeker","flare","prism"];function cp(n){let e=null;function t(c,h){e={text:c,sub:h,t:0}}let i=540;function s(c,h){i=Math.max(400,Math.min(540,(h||540)*1.08));let u=i*c;return n.save(),n.scale(960/u,540/i),u}function r(c,h,u,d,f,g,x){n.fillStyle="rgba(8,16,26,.75)",n.fillRect(c-1,h-1,u+2,d+2);let m=x||1,p=m>1?2:0,M=(u-p*(m-1))/m;for(let y=0;y<m;y++){let v=Math.max(0,Math.min(1,f*m-y));v<=0||(n.fillStyle=g,n.fillRect(c+y*(M+p),h,M*v,d))}n.fillStyle="rgba(255,255,255,.18)",n.fillRect(c,h,u*Math.max(0,f),1)}function o(c,h,u,d){n.save(),n.translate(c,h),n.beginPath(),n.moveTo(0,-u),n.lineTo(u*.55,-u*.2),n.lineTo(u*.35,u),n.lineTo(-u*.35,u),n.lineTo(-u*.55,-u*.2),n.closePath(),n.shadowColor=d,n.shadowBlur=8,n.fillStyle=d,n.fill(),n.shadowBlur=0,n.fillStyle="rgba(255,255,255,.55)",n.beginPath(),n.moveTo(0,-u),n.lineTo(u*.2,-u*.1),n.lineTo(0,u*.6),n.closePath(),n.fill(),n.restore()}function a(c,h,u,d,f,g="left",x="600"){n.font=`${x} ${d}px "Rajdhani","Trebuchet MS",system-ui,sans-serif`,n.textAlign=g,n.textBaseline="alphabetic",n.fillStyle=f,n.fillText(c,h,u)}function l(c,h,u,d,f,g){let x=s(h,g),m=c.player,p=n.createLinearGradient(0,0,0,78);p.addColorStop(0,"rgba(2,8,16,.82)"),p.addColorStop(1,"rgba(2,8,16,0)"),n.fillStyle=p,n.fillRect(0,0,x,78);let M=Math.max(18,x*.025),y=x-M;a("ARMOR",M,22,11,"#8fb3c4");let E=m.energy<30?Math.sin(d*12)>0?"#ff5d6a":"#ff9aa2":"#73f0ea";r(M,28,170,7,m.energy/m.maxEnergy,E,10),a(String(Math.max(0,Math.ceil(m.energy))).padStart(3,"0"),M+180,36,16,"#eafcff","left","700");for(let L=0;L<Math.min(8,m.lives);L++)n.fillStyle="#bfe9f5",n.beginPath(),n.arc(M+5+L*13,50,4.2,Math.PI,0),n.lineTo(M+9.2+L*13,54),n.lineTo(M+.8+L*13,54),n.closePath(),n.fill(),n.fillStyle="#63eeff",n.fillRect(M+2.5+L*13,48.5,5,1.6);m.lives>8&&a("\xD7"+m.lives,M+108,55,11,"#bfe9f5");let R=x*.36,C=lp[m.weapon]||"#fff",P=m.weapons[m.weapon]||1;n.save(),n.shadowColor=C,n.shadowBlur=10,a(m.morph?"ROLL CORE":wy[m.weapon],R,26,15,C,"left","700"),n.restore();for(let L=0;L<3;L++)n.fillStyle=L<P?C:"rgba(255,255,255,.15)",n.beginPath(),n.moveTo(R+L*14,40),n.lineTo(R+L*14+10,40),n.lineTo(R+L*14+7,46),n.lineTo(R+L*14-3,46),n.closePath(),n.fill();if(Ey.forEach((L,N)=>{let W=(m.weapons[L]||0)>0,V=R+3+N*9,z=55;n.fillStyle=W?lp[L]:"rgba(255,255,255,.12)",n.globalAlpha=W?L===m.weapon?1:.55:1,n.beginPath(),n.moveTo(V,z-3.4),n.lineTo(V+3.4,z),n.lineTo(V,z+3.4),n.lineTo(V-3.4,z),n.closePath(),n.fill(),n.globalAlpha=1,L===m.weapon&&(n.strokeStyle="rgba(255,255,255,.85)",n.lineWidth=1,n.strokeRect(V-4.5,z-4.5,9,9))}),m.weapon==="prism"&&m.charging&&m.charge>.02){let L=Math.min(1,m.charge),N=L>=1,W=64,V=R+60,z=55;n.fillStyle="rgba(8,16,26,.75)",n.fillRect(V-1,z-3,W+2,6);let X=n.createLinearGradient(V,0,V+W,0);X.addColorStop(0,"#7fe6ff"),X.addColorStop(.5,"#d9a8ff"),X.addColorStop(1,"#ffb3e6"),n.fillStyle=N?Math.sin(d*24)>0?"#ffffff":"#ffe9ff":X,n.fillRect(V,z-2,W*L,4),a(N?"READY":"CHARGE",V+W+5,z+3,9,N?"#ffffff":"#d9a8ff","left","700")}a("CRYO",R+52,46,10,"#a9eeff");for(let L=0;L<m.bombs;L++)n.fillStyle="#a9eeff",n.fillRect(R+80+L*7,39,4,7);a("SHOCK",R+52+Math.max(48,m.bombs*7+34),46,10,"#67ffd4");for(let L=0;L<m.lines;L++)n.fillStyle="#67ffd4",n.fillRect(R+52+Math.max(48,m.bombs*7+34)+36+L*7,39,4,7);let b=Math.max(0,c.time),S=b<30?Math.sin(d*10)>0?"#ff6b78":"#ffb3ba":"#c9dbe5";a(`${Math.floor(b/60)}:${String(Math.floor(b%60)).padStart(2,"0")}`,x*.62,30,18,S,"center","700"),o(y-118,24,8,"#7fe6ff"),a(String(m.gems),y-104,31,20,"#dff9ff","left","700"),a(String(m.score).padStart(7,"0"),y,54,15,"#eaf4ff","right","700"),a("SCORE",y-74,54,9,"#7d97a6","right");let I=c.boss;if(I&&I.alive&&I.awake){let L=Math.min(420,x*.5),N=x/2-L/2,W=i-46;n.fillStyle="rgba(4,10,18,.7)",n.fillRect(N-12,W-24,L+24,40),n.save(),n.shadowColor="#ff3b5a",n.shadowBlur=8,a(I.name,x/2,W-8,13,"#ffc0c8","center","700"),n.restore(),r(N,W,L,6,Math.max(0,I.hp/I.maxHp),I.open?Math.sin(d*14)>0?"#fff27a":"#ffb347":"#ff4d6d",24),n.fillStyle="rgba(255,255,255,.5)";for(let V of[1/3,2/3])n.fillRect(N+L*V,W-2,1,10);I.open&&a("CORE EXPOSED",x/2,W+18,9,"#fff27a","center","700")}if(e){e.t+=f;let L=e.t;if(L>2.6)e=null;else{let N=Math.min(1,L*5)*Math.min(1,(2.6-L)*3);n.globalAlpha=N;let W=Math.min(x*.7,520),V=150,z=n.createLinearGradient(x/2-W/2,0,x/2+W/2,0);z.addColorStop(0,"rgba(255,40,70,0)"),z.addColorStop(.5,e.text==="WARNING"?"rgba(255,40,70,.35)":"rgba(80,220,255,.28)"),z.addColorStop(1,"rgba(255,40,70,0)"),n.fillStyle=z,n.fillRect(x/2-W/2,V-34,W,52),n.save(),n.shadowColor=e.text==="WARNING"?"#ff3b5a":"#6cf3ff",n.shadowBlur=14,a(e.text,x/2,V,30,e.text==="WARNING"?"#ffd6dc":"#e6fdff","center","800"),n.restore(),e.sub&&a(e.sub,x/2,V+16,12,"#b7cad6","center","600"),n.globalAlpha=1}}for(let L of c.floats){if(L.line||!L.text)continue;let N=u(L.x+6,L.y);if(!N)continue;let W=Math.min(1,L.life*2.5);n.globalAlpha=W,n.save(),n.shadowColor="#000",n.shadowBlur=4,a(L.text,N.x*x,N.y*i,L.text.length>5?12:11,L.text==="1UP"?"#ff9fb3":"#f2fbff","center","700"),n.restore(),n.globalAlpha=1}n.restore()}return{draw:l,setBanner:t}}var wa=new k;function bi(n,e,t,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;wa.copy(e),wa[i]=0,wa.normalize();let c=.5*o/(o+a),h=1-wa.angleTo(n)/l;return Math.sign(wa[t])===1?h*c:a/(o+a)+c+c*(1-h)}var Kc=class n extends Wt{constructor(e=1,t=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(e/2,t/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new k,c=new k,h=new k(e,t,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=u.length/6,x=new k,m=.5/o;for(let p=0,M=0;p<u.length;p+=3,M+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/g)){case 0:x.set(1,0,0),f[M+0]=bi(x,c,"z","y",r,i),f[M+1]=1-bi(x,c,"y","z",r,t);break;case 1:x.set(-1,0,0),f[M+0]=1-bi(x,c,"z","y",r,i),f[M+1]=1-bi(x,c,"y","z",r,t);break;case 2:x.set(0,1,0),f[M+0]=1-bi(x,c,"x","z",r,e),f[M+1]=bi(x,c,"z","x",r,i);break;case 3:x.set(0,-1,0),f[M+0]=1-bi(x,c,"x","z",r,e),f[M+1]=1-bi(x,c,"z","x",r,i);break;case 4:x.set(0,0,1),f[M+0]=1-bi(x,c,"x","y",r,e),f[M+1]=1-bi(x,c,"y","x",r,t);break;case 5:x.set(0,0,-1),f[M+0]=bi(x,c,"x","y",r,e),f[M+1]=1-bi(x,c,"y","x",r,t);break}}static fromJSON(e){return new n(e.width,e.height,e.depth,e.segments,e.radius)}};var bt=k,Vu=new ot,hp=new ei,up=new ci,Ni=new bt,jc=new bt,Ct=(n,e,t)=>n<e?e:n>t?t:n,Wn=(n,e,t)=>n+(e-n)*t,si=n=>(n=Ct(n,0,1),n*n*(3-2*n)),yt=(n,e,t,i)=>n+(e-n)*(1-Math.exp(-t*i)),Ve=Math.PI*2;function io(n){let e=n>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Ea=new Ue;function Je(n,e=1){return Ea.set(n),[Ea.r*e,Ea.g*e,Ea.b*e]}function Rn(n){let e=n.userData||{};n.index&&(n=n.toNonIndexed(),n.userData=e);let t=n.userData||(n.userData={});if(t.uvm&&n.attributes.uv){let i=n.attributes.uv;for(let s=0;s<i.count;s++)i.setXY(s,i.getX(s)*t.uvm[0],i.getY(s)*t.uvm[1]);t.uvModel=!0,delete t.uvm}for(let i of Object.keys(n.attributes))i!=="position"&&i!=="normal"&&!(i==="uv"&&t.uvModel)&&n.deleteAttribute(i);return n.attributes.normal||n.computeVertexNormals(),n.morphAttributes={},n}var di=(n,e,t)=>(n.userData.uvm=[e,t],n);function sn(n,e,t,i){return up.set(t?t[0]:0,t?t[1]:0,t?t[2]:0),hp.setFromEuler(up),i==null?jc.set(1,1,1):typeof i=="number"?jc.set(i,i,i):jc.set(i[0],i[1],i[2]),Ni.set(e?e[0]:0,e?e[1]:0,e?e[2]:0),Vu.compose(Ni,hp,jc),n.applyMatrix4(Vu),Vu.determinant()<0&&yp(n),n}function yp(n){if(n.index){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t+1];e[t+1]=e[t+2],e[t+2]=i}return n.index.needsUpdate=!0,n}for(let e of Object.keys(n.attributes)){let t=n.attributes[e],i=t.itemSize,s=t.array;for(let r=0;r<t.count;r+=3)for(let o=0;o<i;o++){let a=(r+1)*i+o,l=(r+2)*i+o,c=s[a];s[a]=s[l],s[l]=c}t.needsUpdate=!0}return n}function Aa(n){return sn(n.clone(),null,null,[1,1,-1])}function Cn(n,e,t=!0){let i=n.attributes.position;for(let s=0;s<i.count;s++)Ni.fromBufferAttribute(i,s),e(Ni,s),i.setXYZ(s,Ni.x,Ni.y,Ni.z);return i.needsUpdate=!0,t==="smooth"?Ty(n):t&&n.computeVertexNormals(),n}function Ty(n){let e=n.attributes.position,t=e.count,i=new Map,s=new Array(t),r=new bt,o=new bt,a=new bt,l=new bt,c=new bt,h=d=>Math.round(e.getX(d)*200)+","+Math.round(e.getY(d)*200)+","+Math.round(e.getZ(d)*200);for(let d=0;d<t;d+=3){r.fromBufferAttribute(e,d),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),l.subVectors(a,o).cross(c.subVectors(r,o));for(let f=0;f<3;f++){let g=s[d+f]=h(d+f),x=i.get(g);x?x.add(l):i.set(g,l.clone())}}let u=new Float32Array(t*3);for(let d=0;d<t;d++){let f=i.get(s[d]);c.copy(f).normalize(),u[d*3]=c.x,u[d*3+1]=c.y,u[d*3+2]=c.z}return n.setAttribute("normal",new Nt(u,3)),n}function Ay(n){return n=n.index?n.toNonIndexed():n,n.computeVertexNormals(),n}var Ta=1;function _p(n){Ta=n}var An=(n,e=3)=>n<=8&&Ta<1?n:Math.max(e,Math.round(n*Ta)),_={box(n,e,t,i=0,s=1){return i<=0?Rn(new Wt(n,e,t)):Rn(new Kc(n,e,t,Math.max(1,Math.round(s*Ta)),Math.min(i,Math.min(n,e,t)*.49)))},ext(n,e,t=.25,i={}){let s=new xs;s.moveTo(n[0][0],n[0][1]);for(let a=1;a<n.length;a++)s.lineTo(n[a][0],n[a][1]);if(s.closePath(),i.holes)for(let a of i.holes){let l=new Xs;l.moveTo(a[0][0],a[0][1]);for(let c=1;c<a.length;c++)l.lineTo(a[c][0],a[c][1]);l.closePath(),s.holes.push(l)}let r=Math.min(t,e*.45),o=new Jo(s,{depth:Math.max(.01,e-2*r),bevelEnabled:r>0,bevelThickness:r,bevelSize:r,bevelOffset:-r,bevelSegments:i.bevelSeg!=null?i.bevelSeg:Ta<1?1:2,steps:i.steps||1,curveSegments:4});return o.translate(0,0,r-e/2),Rn(di(Ay(o),1,1))},lathe(n,e=12,t=0,i=Ve){let s=0,r=0;for(let o=0;o<n.length;o++)r=Math.max(r,n[o][0]),o&&(s+=Math.hypot(n[o][0]-n[o-1][0],n[o][1]-n[o-1][1]));return Rn(di(new Ko(n.map(o=>new we(o[0],o[1])),An(e),t,i),r*i,s))},cyl(n,e,t,i=10,s=!1,r=1){return Rn(di(new Dn(n,e,t,An(i),r,s),Ve*Math.max(n,e),t))},cone(n,e,t=8){return Rn(di(new is(n,e,An(t)),Ve*n,e))},sph(n,e=12,t=8){return Rn(di(new ti(n,An(e),An(t,2)),Ve*n,Math.PI*n))},ell(n,e,t,i=12,s=8){return sn(Rn(di(new ti(1,An(i),An(s,2)),Math.PI*(n+t),Math.PI*e)),null,null,[n,e,t])},ico(n,e=0){return Rn(new Ii(n,e))},oct(n){return Rn(new ss(n,0))},dodec(n){return Rn(new Ho(n,0))},torus(n,e,t=6,i=16,s=Ve){return Rn(di(new Zs(n,e,An(t),An(i),s),n*s,Ve*e))},capsule(n,e,t=3,i=8){return Rn(di(new Gs(n,e,An(t,2),An(i)),Ve*n,e+Math.PI*n))},tube(n,e,t=12,i=5,s=!1){let r=new Ws(n.map(o=>new bt(o[0],o[1],o[2])),s);return Rn(di(new Vr(r,An(t),e,An(i),s),r.getLength(),Ve*e))},taperTube(n,e,t=12,i=6){let s=new Ws(n.map(h=>new bt(h[0],h[1],h[2]))),r=new Vr(s,An(t),1,An(i),!1),o=r.attributes.position,a=An(t),l=An(i),c=s.computeFrenetFrames(a,!1);for(let h=0;h<=a;h++){let u=s.getPointAt(h/a),d=e(h/a);for(let f=0;f<=l;f++){let g=h*(l+1)+f;Ni.fromBufferAttribute(o,g).sub(u).multiplyScalar(d).add(u),o.setXYZ(g,Ni.x,Ni.y,Ni.z)}}return r.computeVertexNormals(),Rn(di(r,s.getLength(),Ve*e(.3)))},crystal(n,e,t=6,i=.35,s=1,r=.18){let o=io(s),a=[],l=[],c=[],h=t,u=e*(1-i);for(let x=0;x<h;x++){let m=x/h*Ve+o()*.3,p=n*(1+(o()-.5)*r*2);l.push([Math.cos(m)*p*.82,-e*.04,Math.sin(m)*p*.82]),c.push([Math.cos(m)*p,u*(1+(o()-.5)*r),Math.sin(m)*p])}let d=[(o()-.5)*n*.3,e,(o()-.5)*n*.3],f=(x,m,p)=>a.push(...x,...m,...p);for(let x=0;x<h;x++){let m=(x+1)%h;f(l[x],c[m],c[x]),f(l[x],l[m],c[m]),f(c[x],c[m],d),f(l[m],l[x],[0,-e*.08,0])}let g=new Tt;return g.setAttribute("position",new tt(a,3)),g.computeVertexNormals(),g},shard(n,e,t=6,i=3,s=.15){let r=io(i),o=[],a=[],l=[];for(let f=0;f<t;f++){let g=f/t*Ve+(r()-.5)*.25,x=n*(1+(r()-.5)*s*2);a.push([Math.cos(g)*x,-e*.18*(1+(r()-.5)*s),Math.sin(g)*x]),l.push([Math.cos(g)*x*.96,e*.16*(1+(r()-.5)*s),Math.sin(g)*x*.96])}let c=[(r()-.5)*n*.2,e*.5,(r()-.5)*n*.2],h=[(r()-.5)*n*.2,-e*.5,(r()-.5)*n*.2],u=(f,g,x)=>o.push(...f,...g,...x);for(let f=0;f<t;f++){let g=(f+1)%t;u(a[f],l[g],l[f]),u(a[f],a[g],l[g]),u(l[f],l[g],c),u(a[g],a[f],h)}let d=new Tt;return d.setAttribute("position",new tt(o,3)),d.computeVertexNormals(),d},shell(n,e,t,i,s,r,o,a,l=10,c=6,h=null){l=An(l),c=An(c,2);let u=[],d=[],f=[],g=(n+t)/2,x=(X,q,ee)=>{let ce=h?h(X,q):1,be=Math.sin(q)*Math.cos(X),Ce=Math.cos(q),Fe=Math.sin(q)*Math.sin(X);return[be*(n*ce-ee),Ce*(e*ce-ee),Fe*(t*ce-ee)]},m=(X,q)=>{let ee=u.length/3;for(let ce=0;ce<=c;ce++)for(let be=0;be<=l;be++){let Ce=s+(r-s)*(be/l),Fe=o+(a-o)*(ce/c);u.push(...x(Ce,Fe,X)),d.push(Ce*g,Fe*e)}for(let ce=0;ce<c;ce++)for(let be=0;be<l;be++){let Ce=ee+ce*(l+1)+be,Fe=Ce+1,Be=Ce+l+1,ke=Be+1;q?f.push(Ce,Fe,Be,Fe,ke,Be):f.push(Ce,Be,Fe,Fe,Be,ke)}};m(0,!0),m(i,!1);let p=new Tt;p.setAttribute("position",new tt(u,3)),p.setAttribute("uv",new tt(d,2)),p.setIndex(f),p.computeVertexNormals();let M=[],y=[],v=new bt,E=new bt,R=new bt,C=new bt,P=new bt,b=new bt,S=new bt,I=(X,q)=>{let ee=0;for(let ce=0;ce<X.length-1;ce++){let[be,Ce]=X[ce],[Fe,Be]=X[ce+1],ke=x(be,Ce,0),ne=x(Fe,Be,0),ie=x(be,Ce,i),ge=x(Fe,Be,i);v.fromArray(ke),E.fromArray(ne),R.fromArray(ie),b.subVectors(R,v),S.subVectors(E,v),C.crossVectors(b,S),q((be+Fe)/2,(Ce+Be)/2,P);let ve=Math.hypot(ne[0]-ke[0],ne[1]-ke[1],ne[2]-ke[2]);C.dot(P)>=0?(M.push(...ke,...ie,...ne,...ne,...ie,...ge),y.push(ee,0,ee,i,ee+ve,0,ee+ve,0,ee,i,ee+ve,i)):(M.push(...ke,...ne,...ie,...ne,...ge,...ie),y.push(ee,0,ee+ve,0,ee,i,ee+ve,0,ee+ve,i,ee,i)),ee+=ve}},L=(X,q,ee,ce)=>{ee.set(-Math.sin(X)*n,0,Math.cos(X)*t).multiplyScalar(ce)},N=(X,q,ee,ce)=>{ee.set(Math.cos(q)*Math.cos(X)*n,-Math.sin(q)*e,Math.cos(q)*Math.sin(X)*t).multiplyScalar(ce)},W=[];if(o>.001){for(let X=0;X<=l;X++)W.push([s+(r-s)*X/l,o]);I(W,(X,q,ee)=>N(X,q,ee,-1)),W.length=0}if(a<Math.PI-.001){for(let X=0;X<=l;X++)W.push([s+(r-s)*X/l,a]);I(W,(X,q,ee)=>N(X,q,ee,1)),W.length=0}if(r-s<Ve-.001){for(let X=0;X<=c;X++)W.push([s,o+(a-o)*X/c]);I(W,(X,q,ee)=>L(X,q,ee,-1)),W.length=0;for(let X=0;X<=c;X++)W.push([r,o+(a-o)*X/c]);I(W,(X,q,ee)=>L(X,q,ee,1)),W.length=0}let V=[Rn(di(p,1,1))];if(M.length){let X=new Tt;X.setAttribute("position",new tt(M,3)),X.setAttribute("uv",new tt(y,2)),X.computeVertexNormals(),V.push(Rn(di(X,1,1)))}let z=V.length>1?Gn(V):V[0];return z.userData.uvModel=!0,z},ribs(n,e,t,i=.15,s=10){let r=[];for(let o=0;o<=t*2;o++)r.push([n*(o%2?1-i:1),o/(t*2)*e-e/2]);return r.unshift([.001,-e/2]),r.push([.001,e/2]),_.lathe(r,s)},membrane(n){let e=new xs;e.moveTo(n[0][0],n[0][1]);for(let o=1;o<n.length;o++)e.lineTo(n[o][0],n[o][1]);let t=Rn(di(new jo(e),1,1)),i=yp(t.clone()),s=i.attributes.normal;for(let o=0;o<s.count;o++)s.setZ(o,-s.getZ(o));let r=Gn([t,i]);return r.userData.uvModel=!0,r}};function Ry(n,e,t,i){let s=n.attributes.position,r=s.count,o=new Float32Array(r*2),a=new bt,l=new bt,c=new bt,h=new bt,u=new bt;for(let d=0;d<r;d+=3){a.fromBufferAttribute(s,d),l.fromBufferAttribute(s,d+1),c.fromBufferAttribute(s,d+2),h.subVectors(l,a),u.subVectors(c,a),h.cross(u);let f=Math.abs(h.x),g=Math.abs(h.y),x=Math.abs(h.z);for(let m=0;m<3;m++){let p=m===0?a:m===1?l:c,M,y;f>=g&&f>=x?(M=p.z,y=p.y):g>=x?(M=p.x,y=p.z):(M=p.x,y=p.y),o[(d+m)*2]=M*e+t,o[(d+m)*2+1]=y*e+i}}n.setAttribute("uv",new Nt(o,2))}function ur(n,e,t=3.2,i=null){let s=Je(n),r=Je(e),o=i?Je(i):null;return(a,l,c)=>{let h=Math.sin(l*Ve/t+Math.sin(a*.21+c*.17)*1.6)*.5+.5,u=Math.sin(l*2.3+a*1.7)*.5+.5,d=h*h*(3-2*h),f=[s[0]+(r[0]-s[0])*d,s[1]+(r[1]-s[1])*d,s[2]+(r[2]-s[2])*d];if(o&&u>.82){let g=(u-.82)/.18;for(let x=0;x<3;x++)f[x]+=(o[x]-f[x])*g*.7}return f}}var _t=class{constructor(e=1/22){this.bones=[],this.names={},this.parts={},this.uvScale=e,this.R=io(7),this.post=null,this.bone("root",null,0,0,0)}bone(e,t,i,s,r){return this.names[e]=this.bones.length,this.bones.push({name:e,parent:t==null?-1:this.names[t],pos:new bt(i,s,r)}),this}add(e,t,i,s="#808080",r=.04){if(Array.isArray(i)){for(let p of i)this.add(e,t,p,s,r);return this}let o=this.names[e];if(o==null)throw new Error("no bone "+e);let a=Rn(i),l=a.attributes.position.count,c=typeof s=="function"?s:null,h=c?[1,1,1]:typeof s=="string"?Je(s):s,u=1+(this.R()-.5)*r*2,d=new Float32Array(l*3),f=new Uint16Array(l*4),g=new Float32Array(l*4),x=a.attributes.position;for(let p=0;p<l;p++)c&&(h=c(x.getX(p),x.getY(p),x.getZ(p))),d[p*3]=h[0]*u,d[p*3+1]=h[1]*u,d[p*3+2]=h[2]*u,f[p*4]=o,g[p*4]=1;a.setAttribute("color",new Nt(d,3)),a.setAttribute("skinIndex",new Vs(f,4)),a.setAttribute("skinWeight",new Nt(g,4));let m=this.uvScale*(t==="suit"?2.2:t==="flesh"?1.3:1);if(a.userData.uvModel&&a.attributes.uv){let p=a.attributes.uv,M=this.R(),y=this.R();for(let v=0;v<p.count;v++)p.setXY(v,p.getX(v)*m+M,p.getY(v)*m+y)}else Ry(a,m,this.R(),this.R());return(this.parts[t]||(this.parts[t]=[])).push(a),this}scaleAll(e,t=0,i=0,s=0){return this.post={s:e,c:new bt(t,i,s)},this}build(){let e=[],t=0;if(this.post){let{s:i,c:s}=this.post,r=new ot().makeTranslation(s.x,s.y,s.z).multiply(new ot().makeScale(i,i,i)).multiply(new ot().makeTranslation(-s.x,-s.y,-s.z));for(let o of Object.keys(this.parts))for(let a of this.parts[o])a.applyMatrix4(r);for(let o of this.bones)o.pos.sub(s).multiplyScalar(i).add(s)}for(let i of Object.keys(this.parts)){let s=Gn(this.parts[i]);s.computeBoundingSphere(),t+=s.attributes.position.count/3,e.push({mat:i,geometry:s})}return{bones:this.bones,meshes:e,tris:t}}},Cy=new ot;function fr(n,e,t={}){let i=new Jt,s=n.bones.map(u=>{let d=new Fr;return d.name=u.name,d});n.bones.forEach((u,d)=>{let f=s[d];u.parent<0?(i.add(f),f.position.copy(u.pos)):(s[u.parent].add(f),f.position.copy(u.pos).sub(n.bones[u.parent].pos)),f.userData.rest=f.position.clone()});let r=n.bones.map(u=>new ot().makeTranslation(-u.pos.x,-u.pos.y,-u.pos.z)),o=new zo(s,r),a={};s.forEach(u=>{a[u.name]=u});let l=[],c={},h=[];for(let u of n.meshes){let d=e.instance(u.mat),f=new Oo(u.geometry,d);f.bind(o,Cy),f.frustumCulled=!1;let g=d.isMeshBasicMaterial||d.transparent;f.castShadow=t.shadow!==!1&&!g,f.receiveShadow=!g,f.name=u.mat,i.add(f),h.push(f),l.push(d),c[u.mat]=d}return{group:i,bones:a,boneList:s,skeleton:o,meshes:h,materials:l,byMat:c,fx:new Yu(l)}}function Mp(n){n.skeleton.dispose();for(let e of n.materials)e.dispose()}var Py=new Ue(.62,.8,1),Iy=new Ue(.18,.36,.6),fp=new Ue(1,1,1);function Gu(n,e,t){return n.r+=e.r*t,n.g+=e.g*t,n.b+=e.b*t,n}var Yu=class{constructor(e){this.list=e,this.flash=-1,this.frost=-1,this.dirty=!0;for(let t of e)t.userData.baseColor=t.color.clone(),t.userData.baseEmi=t.emissive?t.emissive.clone().multiplyScalar(t.emissiveIntensity):null,t.userData.pulse==null&&(t.userData.pulse=1)}pulse(e,t){e&&e.userData.pulse!==t&&(e.userData.pulse=t,this.dirty=!0)}apply(e,t){if(e=Ct(e,0,1),t=Ct(t,0,1),!(!this.dirty&&Math.abs(e-this.flash)<.001&&Math.abs(t-this.frost)<.001)){this.flash=e,this.frost=t,this.dirty=!1;for(let i of this.list){let s=i.userData;i.isMeshBasicMaterial?(i.color.copy(s.baseColor).multiplyScalar(s.pulse),t>0&&i.color.lerp(Ea.setRGB(.7*2.2,.9*2.2,1*2.2),t*.5),e>0&&Gu(i.color,fp,e*2.5)):(i.color.copy(s.baseColor),t>0&&i.color.lerp(Py,t*.55),i.emissive.copy(s.baseEmi).multiplyScalar(s.pulse),t>0&&Gu(i.emissive,Iy,t*.6),e>0&&Gu(i.emissive,fp,e*1.6),i.emissiveIntensity=1)}}}},dp=new bt(0,-1,0),hr=new bt,pp=new bt,Wu=new bt,mp=new bt,Xu=new bt,gp=new bt,xp=new ei;function Zu(n,e,t,i,s,r){let o=n.position;hr.subVectors(t,o);let a=hr.length();if(a<1e-4)return;hr.divideScalar(a),a=Ct(a,Math.abs(s-r)+.05,s+r-.02);let l=Ct((s*s+a*a-r*r)/(2*s*a),-1,1),c=Math.sqrt(1-l*l);pp.copy(i).addScaledVector(hr,-i.dot(hr)).normalize(),Wu.copy(o).addScaledVector(hr,s*l).addScaledVector(pp,s*c),mp.subVectors(Wu,o).normalize(),gp.copy(o).addScaledVector(hr,a),Xu.subVectors(gp,Wu).normalize(),n.quaternion.setFromUnitVectors(dp,mp),xp.copy(n.quaternion).invert(),Xu.applyQuaternion(xp),e.quaternion.setFromUnitVectors(dp,Xu)}function no(n,e,t){let i=n*374761393+e*668265263+t*2147483647|0;return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}function bp(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=n-s,a=e-r,l=x=>(x%t+t)%t,c=o*o*(3-2*o),h=a*a*(3-2*a),u=no(l(s),l(r),i),d=no(l(s+1),l(r),i),f=no(l(s),l(r+1),i),g=no(l(s+1),l(r+1),i);return Wn(Wn(u,d,c),Wn(f,g,c),h)}function qu(n,e,t,i,s){let r=0,o=.5,a=1,l=0;for(let c=0;c<i;c++)r+=bp(n*a,e*a,t*a,s+c)*o,l+=o,o*=.5,a*=2;return r/l}function vp(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=9,a=9;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let h=s+c,u=r+l,d=(h%t+t)%t,f=(u%t+t)%t,g=h+no(d,f,i),x=u+no(d,f,i+9),m=Math.hypot(g-n,x-e);m<o?(a=o,o=m):m<a&&(a=m)}return[o,a]}function Qc(n,e,t,i){let s=new Nn(n,e,e,Sn);return s.wrapS=s.wrapT=Hn,s.generateMipmaps=!0,s.minFilter=gi,s.magFilter=Un,s.colorSpace=t?vn:vi,s.anisotropy=i,s.needsUpdate=!0,s}function Dy(n,e){let t=n,i=new Uint8Array(t*t*4),s=new Uint8Array(t*t*4),r=io(1234),o=new Float32Array(t*t).fill(1),a=new Float32Array(t*t).fill(0),l=new Float32Array(t*t).fill(0),c=new Float32Array(t*t).fill(0),h=t/512,u=[];(function p(M,y,v,E,R){if(v<70*h&&E<70*h||R>5||R>1&&r()<.18){u.push([M,y,v,E]);return}if(v>E*(.7+r()*.6)){let C=Math.round(v*(.3+r()*.4));p(M,y,C,E,R+1),p(M+C,y,v-C,E,R+1)}else{let C=Math.round(E*(.3+r()*.4));p(M,y,v,C,R+1),p(M,y+C,v,E-C,R+1)}})(0,0,t,t,0);let d=(p,M)=>(M%t+t)%t*t+(p%t+t)%t,f=new Float32Array(t*t);for(let[p,M,y,v]of u){let E=(r()-.5)*.08;for(let P=0;P<v;P++)for(let b=0;b<y;b++)f[d(p+b,M+P)]=E;let R=Math.max(1,Math.round(1.6*h));for(let P=0;P<y;P++)for(let b=0;b<R;b++){let S=d(p+P,M+b);o[S]=.15,a[S]=.4}for(let P=0;P<v;P++)for(let b=0;b<R;b++){let S=d(p+b,M+P);o[S]=.15,a[S]=.4}for(let P=R;P<y;P++){let b=d(p+P,M+R);o[b]=Math.min(o[b],.75)}if(r()<.55&&y>30*h)for(let P=8*h;P<y-6*h;P+=9*h)for(let b of[M+5*h,M+v-5*h])for(let S=-2;S<=2;S++)for(let I=-2;I<=2;I++){let L=Math.hypot(I,S);if(L<2.2*h){let N=d(Math.round(p+P+I),Math.round(b+S));o[N]=1+(1-L/2.2)*.25,a[N]=L>1.4?.2:-.1}}let C=Math.floor(r()*5*h*h+1);for(let P=0;P<C;P++){let b=r()<.5,S=b?p+r()*y:p+(r()<.5?3:y-3),I=b?M+(r()<.5?3:v-3):M+r()*v,L=(1.5+r()*4)*h;for(let N=-6;N<=6;N++)for(let W=-6;W<=6;W++)if(Math.hypot(W,N*1.3)+bp(W*.6+P,N*.6,64,3)*2<L){let z=d(Math.round(S+W),Math.round(I+N));l[z]=1}}}for(let p=0;p<260*h*h;p++){let M=r()*t,y=r()*t,v=r()*Ve,E=(6+r()*34)*h,R=.4+r()*.6;for(let C=0;C<E;C++)c[d(Math.round(M),Math.round(y))]=Math.max(c[d(Math.round(M),Math.round(y))],R),M+=Math.cos(v),y+=Math.sin(v)}for(let p=0;p<t;p++)for(let M=0;M<t;M++){let y=p*t+M,v=y*4,E=qu(M/(64*h),p/(64*h),8,4,11),R=qu(M/(18*h),p/(18*h),Math.round(t/(18*h)),3,5),C=si((E-.42)*2.2),P=.9+f[y]-C*.22-a[y]*.55+(R-.5)*.06;P+=l[y]*.18+c[y]*.1,P=Ct(P,0,1)*255,i[v]=P,i[v+1]=P,i[v+2]=P*.985,i[v+3]=255,s[v]=Ct(o[y]*.9+(R-.5)*.08-l[y]*.12,0,1)*255,s[v+1]=Ct(.5+C*.35+(R-.5)*.12-c[y]*.25-l[y]*.15,.08,1)*255,s[v+2]=Ct(.1+l[y]*.85+c[y]*.5,0,1)*255,s[v+3]=255}let g=Math.max(128,t/2),x=new Uint8Array(g*g*4),m=new Uint8Array(g*g*4);for(let p=0;p<g;p++)for(let M=0;M<g;M++){let y=(p*g+M)*4,v=8/g*2,[E,R]=vp(M*v,p*v,16,21),C=si(1-(R-E)*5),[P,b]=vp(M*v*3,p*v*3,48,33),S=si(1-P*2.2),I=qu(M/(g/8),p/(g/8),8,4,7),L=Ct(.78-C*.38+(I-.5)*.25+S*.06,0,1)*255;x[y]=L,x[y+1]=L*.97,x[y+2]=L*.95,x[y+3]=255,m[y]=Ct(.55+E*.5-C*.35+S*.12+(I-.5)*.2,0,1)*255,m[y+1]=Ct(.32+(I-.5)*.4+C*.15,.05,1)*255,m[y+2]=0,m[y+3]=255}return{alb:Qc(i,t,!0,e),rmh:Qc(s,t,!1,e),oalb:Qc(x,g,!0,e),orh:Qc(m,g,!1,e),dispose(){this.alb.dispose(),this.rmh.dispose(),this.oalb.dispose(),this.orh.dispose()}}}function Sp(n,e){let t=e&&e.capabilities?Math.min(8,e.capabilities.getMaxAnisotropy()):4,i=Dy(n==="low"?256:512,t),s={},r=l=>new Kt(Object.assign({vertexColors:!0},l)),o=l=>new $s(Object.assign({vertexColors:!0},l)),a=n==="low";s.paint=r({map:i.alb,roughnessMap:i.rmh,metalnessMap:i.rmh,bumpMap:a?null:i.rmh,bumpScale:1.4,roughness:1,metalness:1}),s.metal=r({map:i.alb,roughnessMap:i.rmh,bumpMap:a?null:i.rmh,bumpScale:.9,roughness:.78,metalness:.88}),s.suit=r({roughnessMap:i.orh,bumpMap:a?null:i.orh,bumpScale:.35,roughness:1.9,metalness:0}),s.flesh=a?r({map:i.oalb,roughnessMap:i.orh,roughness:1.2,metalness:0}):o({map:i.oalb,roughnessMap:i.orh,bumpMap:i.orh,bumpScale:2.2,roughness:1.3,metalness:0,clearcoat:.85,clearcoatRoughness:.22,sheen:.4,sheenRoughness:.5,sheenColor:new Ue(.6,.4,.5)}),s.crystal=a?r({roughness:.15,metalness:.1,emissive:new Ue(1,1,1),emissiveIntensity:.32,flatShading:!0}):o({roughness:.08,metalness:.05,clearcoat:1,clearcoatRoughness:.04,iridescence:.55,iridescenceIOR:1.6,emissive:new Ue(1,1,1),emissiveIntensity:.32,envMapIntensity:1.7,flatShading:!0,specularIntensity:1}),s.crystal.onBeforeCompile=l=>{l.fragmentShader=l.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
	totalEmissiveRadiance *= vColor.rgb;`)},s.crystal.customProgramCacheKey=()=>"shard-crystal",s.glow=new cn({vertexColors:!0}),s.core=new cn({vertexColors:!0}),s.accent=new cn({vertexColors:!0}),s.membrane=r({transparent:!0,opacity:.42,side:Qt,depthWrite:!1,roughness:.25,metalness:.1,emissive:new Ue(0,0,0)}),s.bubble=o({transparent:!0,opacity:.2,roughness:.02,metalness:0,clearcoat:1,iridescence:a?0:1,iridescenceIOR:1.3,envMapIntensity:2.6,depthWrite:!1,side:Qt,emissive:new Ue(0,0,0)}),s.glass=o({transparent:!0,opacity:.5,roughness:.04,metalness:0,clearcoat:1,iridescence:a?0:.4,envMapIntensity:2.2,depthWrite:!1,emissive:new Ue(0,0,0)});for(let l of Object.keys(s))s[l].name="actor-"+l;return{base:s,tex:i,instance(l){let c=s[l];if(!c)throw new Error("mat "+l);let h=c.clone();return h.onBeforeCompile=c.onBeforeCompile,h.customProgramCacheKey=c.customProgramCacheKey,h},dispose(){for(let l of Object.keys(s))s[l].dispose();i.dispose()}}}function eh(n,e,t){if(!n||!n.tiles)return!1;let i=Math.floor(e/20),s=Math.floor(t/20);if(i<0||s<0||i>=n.cols||s>=n.rows)return!1;let r=n.tiles[s*n.cols+i];return r===1||r===6}function wp(n,e){let t=e&&e.level;if(!t)return"floor";let i=n.x+n.w/2,s=n.y+n.h/2;return eh(t,i,n.y+n.h+3)?"floor":eh(t,i,n.y-3)?"ceil":eh(t,n.x-3,s)?"wallL":eh(t,n.x+n.w+3,s)?"wallR":"floor"}var Ne={slate:"#56677a",slateD:"#3d4957",bone:"#a7a294",orange:"#c35f28",suit:"#2c2f34",suitD:"#1c1e22",pouch:"#434336",metal:"#767c86",gun:"#3a3e45",steel:"#9aa3ad"},$u=Je("#6cf3ff",3.6),th=Je("#6cf3ff",2.4),Ca=Je("#86dcff",3.2),Rp=Je("#ff4d3a",4),Ly=Je("#5dff8a",4),Uy=[5,5,5],Ep={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9",seeker:"#ff9a3c",flare:"#ff6a2a",prism:"#d9a8ff"},Pe=(n,e,t,i,s,r)=>sn(n,[e,t,i],s,r),so=(n,e=0,t=-1e9)=>i=>{let s=i.z-e;i.y>t&&(i.x-=n*s*s)},ro=new bt(2.3,21.3,1),Ny=new bt(11,.25,0),Fy=new bt(1.25,-2,.8),ky=new bt(4.7,-1.5,-.3),Pa=4.9,ih=4.7,Ra=4.1;function Cp(){let n=new _t(.05);n.bone("body","root",0,0,0).bone("pelvis","body",0,15.4,0).bone("spine","pelvis",0,17.2,0).bone("chest","spine",0,20.4,0).bone("head","chest",.5,25,0).bone("uaN","chest",-.4,23,Ra).bone("faN","uaN",-.4,23-Pa,Ra).bone("uaF","chest",-.4,23,-Ra).bone("faF","uaF",-.4,23-Pa,-Ra).bone("gun","chest",ro.x,ro.y,ro.z).bone("pack","chest",-3.3,21.6,0).bone("thrN","pack",-5.5,17.4,1.9).bone("thrF","pack",-5.5,17.4,-1.9).bone("thN","pelvis",0,15,2.3).bone("shN","thN",0,8.2,2.3).bone("ftN","shN",0,1.6,2.35).bone("thF","pelvis",0,15,-2.3).bone("shF","thF",0,8.2,-2.3).bone("ftF","shF",0,1.6,-2.35).bone("ball","root",0,8,0);let e=l=>Pe(l,.5,25,0),t=_.ext([[-2.2,-.3],[-2.75,1],[-2.55,3.1],[-1.5,4.45],[.5,4.85],[2.2,4.25],[3.3,3.05],[2.9,2.75],[3,1.85],[3.25,1],[2.95,-.1],[1.6,-.85],[-.2,-.95],[-1.6,-.75]],4.4,.45,{steps:3});Cn(t,l=>{l.x>0&&(l.x-=.05*l.z*l.z*(l.x/3)),l.y>3&&(l.y-=.06*l.z*l.z*(l.y-3)/2)}),n.add("head","paint",e(t),Ne.slate),n.add("head","paint",e(_.ext([[-2.3,3.35],[-1.4,4.6],[.5,5.2],[2.1,4.65],[3,3.6],[2,3.95],[.4,4.45],[-1.2,4]],1.6,.25)),Ne.bone),n.add("head","paint",e(_.ext([[-2.65,.7],[-1,.35],[-1.2,-1.15],[-2.45,-.75]],4,.25)),Ne.slateD),n.add("head","metal",e(_.ext([[2.75,1.7],[3.2,1.78],[3.12,2.88],[2.7,2.8]],3.6,.1)),Ne.suitD),n.add("head","glow",e(_.ext([[2.95,2.05],[3.28,2.1],[3.25,2.5],[2.92,2.46]],3.3,.06)),$u);for(let l of[1,-1]){let c=l*2.2;n.add("head","metal",e(Pe(_.ext([[.2,1.95],[3.15,1.72],[3.2,2.88],[.5,2.7]],.3,.08),0,0,c)),Ne.suitD),n.add("head","glow",e(Pe(_.ext([[.55,2.12],[3.2,2],[3.22,2.55],[.8,2.48]],.22,.05),0,0,c+l*.1)),$u),n.add("head","paint",e(Pe(_.ext([[.5,-.75],[2.95,-.05],[3.15,1.55],[1.6,1.68],[.2,.6]],.45,.14),0,0,c+l*.05)),Ne.slateD),n.add("head","paint",e(Pe(_.ext([[-2.4,3],[-.6,3.75],[1.8,3.55],[1.6,3.15],[-.5,3.3],[-2.2,2.6]],.3,.1),0,0,c+l*.06)),Ne.orange),n.add("head","metal",e(Pe(_.box(1.5,1.7,.5,.18),-1.25,1.55,c+l*.12)),Ne.metal),n.add("head","metal",e(Pe(_.box(.9,.25,.3,.06),-1.25,1,c+l*.4)),Ne.gun),n.add("head","metal",e(Pe(_.box(.9,.25,.3,.06),-1.25,1.55,c+l*.4)),Ne.gun),n.add("head","metal",e(Pe(_.cyl(.42,.48,.8,8),3,.35,l*.85,[0,0,-Math.PI/2+.25])),Ne.gun)}n.add("head","metal",e(Pe(_.cyl(.1,.13,4,5),-1.8,4.5,2.35,[0,0,.3])),Ne.metal),n.add("head","glow",e(Pe(_.sph(.2,6,4),-2.38,6.42,2.35)),Rp),n.add("head","suit",e(Pe(_.cyl(1.25,1.4,1.8,10),0,-1,0)),Ne.suit),n.add("chest","suit",Pe(_.box(5.6,6.4,7.2,1.6,1),0,22,0),Ne.suit);let i=_.ext([[-2.4,19.6],[2.5,19.8],[3.4,21.4],[3.35,23.2],[2.2,24.4],[-1,24.6],[-2.7,23.6],[-3,21]],8.2,.6,{steps:5});Cn(i,so(.06)),n.add("chest","paint",i,Ne.slate);let s=_.ext([[1,20.2],[3.25,20.9],[3.65,22.6],[3,23.7],[1.4,23.5]],3.2,.35,{steps:3});Cn(s,l=>{l.x-=.06*l.z*l.z-.12}),n.add("chest","paint",s,Ne.bone);for(let l of[1,-1])n.add("chest","paint",Pe(_.ext([[-1.8,23.9],[1.7,23.55],[1.9,23.1],[-1.8,23.45]],.4,.1),0,0,l*3.85),Ne.orange),n.add("chest","metal",Pe(_.box(.9,.9,.5,.2),2.3,21.2,l*3.7),Ne.metal);n.add("chest","metal",Pe(_.torus(1.9,.45,6,16),.3,24.6,0,[Math.PI/2,0,0]),Ne.gun);for(let l=0;l<3;l++)n.add("chest","metal",Pe(_.box(.25,2.8-l*.4,.25),3.25+.1*l,22.2,1.1-l*1.1),Ne.gun);n.add("spine","suit",Pe(_.box(4.6,4.2,6,1.2,1),.1,18.2,0),Ne.suit);for(let l=0;l<3;l++){let c=16.55+l*1.25,h=_.ext([[-2.2,c],[2.4-l*.1,c+.05],[2.6-l*.1,c+.6],[2.35-l*.1,c+1.1],[-2.1,c+1.1]],6.6-l*.2,.3,{steps:3});Cn(h,so(.06)),n.add("spine","paint",h,Ne.slateD)}n.add("pelvis","suit",Pe(_.box(5,1.6,7,.5),.1,15.9,0),Ne.suitD),n.add("pelvis","metal",Pe(_.box(.7,1.2,1.8,.2),2.6,15.9,0),Ne.steel),n.add("pelvis","paint",Pe(_.ext([[1,15.2],[2.7,15.1],[2.4,13.4],[1.4,13]],2.6,.3),0,0,0),Ne.slateD);for(let l of[1,-1])n.add("pelvis","suit",Pe(_.box(1.6,1.8,1.2,.35),-1.5,15.5,l*3.45),Ne.pouch),n.add("pelvis","suit",Pe(_.box(1.4,1.6,1.1,.35),.8,15.6,l*3.5),Ne.pouch),n.add("pelvis","suit",Pe(_.sph(1.5,8,6),0,15,l*2.3),Ne.suit);n.add("pelvis","suit",Pe(_.box(1.2,2,4.4,.4),-2.6,15.4,0),Ne.pouch),n.add("pack","paint",Pe(_.box(3.4,6.6,6.2,.8,1),-5,21.3,0),Ne.slateD),n.add("pack","paint",Pe(_.ext([[-6.6,24.2],[-3.4,24.4],[-3.3,25],[-4.4,25.5],[-6.4,25.1]],5,.3),0,0,0),Ne.bone);for(let l=-1;l<=1;l++)n.add("pack","metal",Pe(_.box(.35,5.2,.6,.12),-6.75,21.3,l*1.8),Ne.gun);for(let l of[1,-1]){n.add("pack","metal",Pe(_.cyl(.85,.85,4.6,10),-5,21.4,l*3.45),Ne.metal),n.add("pack","metal",Pe(_.torus(.86,.14,4,12),-5,22.8,l*3.45,[Math.PI/2,0,0]),Ne.gun),n.add("pack","metal",Pe(_.torus(.86,.14,4,12),-5,20,l*3.45,[Math.PI/2,0,0]),Ne.gun),n.add("pack","glow",Pe(_.box(.2,1.4,.2),-4.15,21.4,l*3.9),Ca.map(u=>u*.6));let c=_.lathe([[.45,0],[.7,-.2],[.95,-1.1],[1.02,-1.6],[.86,-1.62],[.62,-.5],[.4,-.3]],12);n.add("pack","metal",Pe(c,-5.5,19,l*1.9,[0,0,-.25]),Ne.gun),n.add("pack","glow",Pe(_.cyl(.78,.78,.12,10),-5.85,17.5,l*1.9,[0,0,-.25]),Ca);let h=_.lathe([[.7,0],[.55,-1.2],[.3,-2.6],[.02,-3.6]],8);n.add(l>0?"thrN":"thrF","glow",Pe(h,-5.5,17.4,l*1.9,[0,0,-.25]),Ca.map(u=>u*.8))}for(let l of[1,-1]){let c=l>0?"uaN":"uaF",h=l>0?"faN":"faF",u=l*Ra,d=-.4,f=23;n.add(c,"suit",Pe(_.sph(1.35,8,6),d,f,u),Ne.suit),n.add(c,"suit",Pe(_.capsule(1.05,3,3,8),d,f-2.6,u),Ne.suit);let g=.68,x=y=>y.map(([v,E])=>[v*g,E*g+.35]),m=(y,v,E,R,C)=>n.add(c,"paint",Pe(_.ext(x(y),v,.16,{steps:2}),d,f,u+l*E,[l*-C,0,0]),R);m([[-2.9,.2],[-2.1,2.2],[.6,2.75],[2.6,1.8],[2.9,-.2],[.2,-.75],[-2.6,-.5]],.5,1.45,Ne.slate,.22),m([[-2.8,-.4],[2.7,-.4],[2.5,-1.75],[-2.4,-1.85]],.45,1.25,Ne.slateD,.12),m([[-2.5,-1.55],[2.4,-1.5],[2.1,-2.75],[-2.1,-2.85]],.4,1.08,Ne.slate,.05),n.add(c,"paint",Pe(_.ext(x([[-2.7,.9],[-1.8,2.45],[.8,2.85],[2.7,1.7],[1.8,1.2],[-1.5,1.4]]),3,.25),d,f,u*1.04+l*.15),Ne.bone),n.add(c,"paint",Pe(_.ext(x([[-1.6,2.15],[.7,2.55],[2.2,1.85],[2,1.55],[.6,2.15],[-1.5,1.85]]),.26,.07),d,f,u+l*1.72,[l*-.22,0,0]),Ne.orange),n.add(c,"metal",Pe(_.cyl(.26,.26,.26,8),d-1.15,f+.6,u+l*1.78,[Math.PI/2,0,0]),Ne.metal),n.add(c,"metal",Pe(_.cyl(.26,.26,.26,8),d+1.25,f+.6,u+l*1.78,[Math.PI/2,0,0]),Ne.metal);let p=_.shell(1.35,1.8,1.35,.3,-.6,Math.PI+.6,.6,2.4,8,4);l<0&&(p=Aa(p)),n.add(c,"paint",Pe(p,d,f-3.1,u),Ne.slateD);let M=f-Pa;n.add(h,"suit",Pe(_.sph(1.05,8,6),d,M,u),Ne.suit),n.add(h,"paint",Pe(_.sph(1,8,6),d-.35,M+.1,u,null,[.8,1,1]),Ne.slateD),n.add(h,"paint",Pe(_.box(2.1,3,2.1,.55,1),d,M-2,u),Ne.slate),n.add(h,"metal",Pe(_.box(.4,2,1,.1),d+1.05,M-2,u+l*.2),Ne.gun),n.add(h,"glow",Pe(_.box(.15,.8,.5),d+1.12,M-1.6,u+l*.6),$u.map(y=>y*.5)),n.add(h,"suit",Pe(_.box(1.6,1.7,1.5,.45,1),d,M-ih+.25,u),Ne.suitD),n.add(h,"metal",Pe(_.box(.5,1.2,1.3,.15),d+.75,M-ih+.3,u),Ne.gun)}for(let l of[1,-1]){let c=l>0?"thN":"thF",h=l>0?"shN":"shF",u=l>0?"ftN":"ftF",d=l*2.3;n.add(c,"suit",Pe(_.capsule(1.5,4.6,3,8),0,11.6,d),Ne.suit);let f=_.ext([[-1.2,14],[1.85,13.9],[2.05,11.2],[1.55,9.5],[-.4,9.55],[-1.5,11.8]],1.6,.4,{steps:2});Cn(f,so(.25,0)),n.add(c,"paint",Pe(f,0,0,d+l*.75),Ne.slate),n.add(c,"paint",Pe(_.ext([[1.75,13.6],[2.2,13.5],[2.3,10.5],[1.8,10]],2.4,.2),0,0,d),Ne.slateD),n.add(c,"paint",Pe(_.ext([[-1.6,15.5],[1.9,15.35],[1.75,13],[-1.3,13.4]],.6,.18),0,0,d+l*1.6,[l*.12,0,0]),Ne.slateD),n.add(c,"paint",Pe(_.box(1.2,.3,.3,.1),.3,14.6,d+l*1.95),Ne.orange),n.add(h,"suit",Pe(_.capsule(1.15,4.4,3,8),0,4.9,d),Ne.suit);let g=Pe(_.ext([[.2,9.4],[1.5,9.2],[2.05,8.2],[1.75,6.9],[.6,7.1]],2.2,.4,{steps:2}),0,0,d);Cn(g,so(.3,d)),n.add(h,"paint",g,Ne.bone);let x=Pe(_.ext([[.35,7.5],[1.55,7.3],[1.68,5],[1.38,2.8],[.35,2.6]],2.5,.3,{steps:3}),0,0,d);Cn(x,so(.2,d)),n.add(h,"paint",x,Ne.slate),n.add(h,"paint",Pe(_.box(1.2,3.4,2,.45),-.95,5.4,d),Ne.slateD),n.add(h,"metal",Pe(_.box(.3,1.6,.4,.1),1.65,5.6,d),Ne.gun);let m=Pe(_.ext([[-1.5,.45],[3,.45],[3.55,.8],[3.25,1.2],[1.8,1.7],[1.3,2.8],[-1.2,3],[-1.75,1.7]],2.6,.42,{steps:2}),0,0,d);Cn(m,so(.12,d)),n.add(u,"paint",m,Ne.slateD),n.add(u,"suit",Pe(_.ext([[-1.65,0],[3.3,0],[3.7,.55],[-1.8,.6]],2.75,.2),0,0,d),Ne.suitD),n.add(u,"metal",Pe(_.box(1.1,.8,2.2,.3),2.8,1,d),Ne.metal)}let r=l=>Pe(l,ro.x,ro.y,ro.z);n.add("gun","paint",r(_.ext([[-1.6,-1.1],[4.6,-1.1],[4.95,-.4],[4.95,1],[4.2,1.45],[-.8,1.45],[-1.6,.9]],1.9,.3)),"#46505c"),n.add("gun","suit",r(_.ext([[-6,-1.7],[-4.9,-1.75],[-1.6,-.9],[-1.6,1],[-2.4,1.3],[-5.6,.95],[-6.2,.2]],1.5,.3)),Ne.suit),n.add("gun","suit",r(Pe(_.box(.6,2.8,1.6,.2),-6.15,-.4,0)),Ne.suitD),n.add("gun","suit",r(_.ext([[.6,-1],[1.95,-1],[1.65,-3.4],[.6,-3.65],[.3,-3.2]],1.2,.25)),Ne.suitD),n.add("gun","metal",r(_.ext([[2.4,-1],[3.7,-1],[3.95,-3.5],[2.85,-3.8]],1.3,.2)),Ne.gun),n.add("gun","paint",r(Pe(_.cyl(.8,.8,4.6,12),7.2,.25,0,[0,0,-Math.PI/2])),Ne.slate);for(let l of[5.9,6.9,7.9,8.9])n.add("gun","metal",r(Pe(_.torus(.8,.13,4,12),l,.25,0,[0,Math.PI/2,0])),Ne.gun);n.add("gun","metal",r(Pe(_.cyl(.38,.38,1.2,8),10,.25,0,[0,0,-Math.PI/2])),Ne.metal);let o=_.lathe([[.3,0],[.65,0],[.65,.3],[.5,.36],[.5,.6],[.65,.66],[.65,1.05],[.3,1.05]],10);n.add("gun","metal",r(Pe(o,10,.25,0,[0,0,-Math.PI/2])),Ne.steel),n.add("gun","metal",r(Pe(_.box(4.6,.3,.8,.1),1.6,1.6,0)),Ne.gun),n.add("gun","suit",r(Pe(_.cyl(.55,.6,2.7,10),1.8,2.35,0,[0,0,-Math.PI/2])),Ne.suitD),n.add("gun","metal",r(Pe(_.box(.8,.8,.9,.2),1.2,1.95,0)),Ne.gun),n.add("gun","accent",r(Pe(_.cyl(.42,.42,.1,10),3.2,2.35,0,[0,0,-Math.PI/2])),[1,1,1]),n.add("gun","accent",r(Pe(_.capsule(.42,2.4,2,8),6.6,-.95,0,[0,0,Math.PI/2])),[1,1,1]);for(let l of[5.4,7.8])n.add("gun","metal",r(Pe(_.torus(.48,.12,4,10),l,-.95,0,[0,Math.PI/2,0])),Ne.gun);for(let l of[1,-1])n.add("gun","accent",r(Pe(_.box(4.4,.22,.1),1.9,.5,l*.97)),[1,1,1]);n.add("gun","suit",r(_.ext([[5,-.8],[5.9,-.8],[5.75,-2.6],[5.15,-2.6]],1,.2)),Ne.suitD);let a=l=>Pe(l,0,8,0);n.add("ball","suit",a(_.sph(6.9,12,8)),Ne.suitD),n.add("ball","glow",a(_.torus(7.1,.3,4,28)),th),n.add("ball","glow",a(Pe(_.torus(7.1,.3,4,28),0,0,0,[Math.PI/2,0,0])),th),n.add("ball","glow",a(Pe(_.torus(7.1,.3,4,28),0,0,0,[0,Math.PI/2,0])),th);for(let l=0;l<4;l++)for(let c=0;c<2;c++){let h=l*Math.PI/2+.065,u=(l+1)*Math.PI/2-.065,d=c?Math.PI/2+.06:.07,f=c?Math.PI-.07:Math.PI/2-.06;n.add("ball","paint",a(_.shell(7.75,7.75,7.75,.7,h,u,d,f,5,4)),(l+c)%2?Ne.slate:Ne.bone)}for(let l of[1,-1])n.add("ball","metal",a(Pe(_.cyl(2.3,2.6,1.2,14),0,0,l*7.35,[Math.PI/2,0,0])),Ne.metal),n.add("ball","glow",a(Pe(_.torus(1.55,.2,4,18),0,0,l*7.98)),th),n.add("ball","metal",a(Pe(_.cyl(.7,.7,.5,6),0,0,l*8,[Math.PI/2,0,0])),Ne.gun);return n.build()}function Tp(n,e){return 6.8*Math.cos(n)+6.6*Math.cos(n+e)+1.6}var sh=["thN","shN","ftN","thF","shF","ftF","spine","chest","head","pelvisY","pelvisX","twist","spreadN","spreadF"];function Ju(){let n={};for(let e of sh)n[e]=0;return n}function Es(n,e,t){if(!(t<=0))for(let i of sh)n[i]+=(e[i]||0)*t}var nh=new bt,pw=new bt,mw=new ot,Ap=new bt,Oy=new bt(-.4,-1,1.2),zy=new bt(-.2,-1,-1.1);function Pp(n,e){let t=n.bones,i={yaw:0,morph:0,crouch:0,air:0,water:0,phase:0,run:0,land:0,prevVy:0,wasGround:!0,aim:0,recoil:0,lastCd:0,time:0,pose:Ju(),roll:0,thrust:0,fireGlow:0,weapon:null,aimDown:0},s=n.byMat.accent,r=new bt;function o(l){if(i.weapon===l)return;i.weapon=l;let c=new Ue(Ep[l]||Ep.spread);s.userData.baseColor.setRGB(c.r*4,c.g*4,c.b*4),n.fx.dirty=!0}function a(l,c,h,u){h=Math.min(h,.05),i.time+=h,o(l.weapon),i.water=yt(i.water,l.inWater?1:0,5,h);let d=1-.45*i.water;i.yaw=yt(i.yaw,l.facing>=0?0:-Math.PI,24,h);let f=l.morph?1:0;i.morph=f>i.morph?Math.min(1,i.morph+h/.15):Math.max(0,i.morph-h/.15),i.crouch=yt(i.crouch,l.crouch?1:0,28,h);let g=!!l.onGround;i.air=yt(i.air,g?0:1,g?30:14,h),g&&!i.wasGround&&i.prevVy>260&&(i.land=Ct(i.prevVy/650,.35,1)),i.land=Math.max(0,i.land-h*5.5),i.wasGround=g,i.prevVy=l.vy;let x=Math.abs(l.vx),m=Ct(x/205,0,1);if(g){let se=Wn(22,62,m);i.phase+=x*h/se*Ve}i.run=yt(i.run,g&&!l.crouch&&x>8?si(x/70):0,12,h);let p=0,M=!1;l.beamActive&&l.beam?(p=Math.atan2(-l.beam.dy,Math.abs(l.beam.dx)||.001),M=!0):l.weapon==="spread"&&l.aimDir?p=l.aimDir<0?Math.PI/2:-Math.PI/2:l.flaring&&l.flareAim&&(p=-l.flareAim),l.crouch&&(p=Math.min(p,0)-.04),i.aim=yt(i.aim,p,M?40:22,h),i.aimDown=yt(i.aimDown,!g&&p<-1?1:0,16,h),l.cooldown>i.lastCd+1e-4&&!M&&(i.recoil=1,i.fireGlow=1),i.lastCd=l.cooldown||0,M&&(i.recoil=Math.max(i.recoil,.25+.15*Math.sin(i.time*90)),i.fireGlow=1),l.flaring&&(i.recoil=Math.max(i.recoil,.18+.1*Math.sin(i.time*70)),i.fireGlow=1),l.charging&&(i.fireGlow=Math.max(i.fireGlow,.3+.7*(l.charge||0)*(.8+.2*Math.sin(i.time*30)))),i.recoil=Math.max(0,i.recoil-h*9),i.fireGlow=Math.max(0,i.fireGlow-h*5);let y=i.time*d,v=i.phase,E=Ju(),R={thN:.06,shN:-.14,ftN:.08,thF:-.1,shF:-.1,ftF:.2,spine:-.03,chest:.015*Math.sin(y*1.7),head:.02*Math.sin(y*.7)},C=Wn(.5,1,m),P=se=>({th:(.66*Math.sin(se)+.06)*C,sh:-(.18+1.3*Math.pow(Math.max(0,Math.cos(se+.5)),1.3))*C,ft:.35*Math.cos(se+.2)*C-.05}),b=P(v),S=P(v+Math.PI),I={thN:b.th,shN:b.sh,ftN:b.ft,thF:S.th,shF:S.sh,ftF:S.ft,spine:-.14*m,chest:-.03,head:.1*m,twist:.1*Math.sin(v)*m},L=si((l.vy+120)/520),N={thN:1,shN:-1.55,ftN:.25,thF:-.3,shF:-.8,ftF:-.35,spine:-.06,head:.08},W={thN:.35,shN:-.45,ftN:-.1,thF:-.12,shF:-.35,ftF:-.3,spine:.04,head:-.05,spreadN:.08,spreadF:.08},V={thN:1.35,shN:-2.1,ftN:.3,thF:1.15,shF:-1.95,ftF:.2,spine:-.15,head:-.1},z=Math.sin(y*2.4),X={thN:.25+.35*z,shN:-.55-.3*Math.sin(y*2.4+1),ftN:-.35,thF:.25-.35*z,shF:-.55-.3*Math.sin(y*2.4+1+Math.PI),ftF:-.35,spine:-.18,head:.15},q={thN:.28,shN:-1.88,ftN:-1.25,thF:1.55,shF:-1.75,ftF:.18,spine:-.42,chest:-.08,head:.38,pelvisX:-.6},ee={thN:1.6,shN:-2.3,thF:1.6,shF:-2.3,spine:-.9,chest:-.4,head:-.4},ce=i.air*(1-i.crouch),be=1-ce,Ce=i.crouch*be,Fe=i.run*(1-i.crouch)*be,Be=Math.max(0,be-Ce-Fe);if(Es(E,R,Be),Es(E,I,Fe),Es(E,q,Ce),ce>0){let se=i.water,fe=Ju();Es(fe,N,(1-L)*(1-i.aimDown)),Es(fe,W,L*(1-i.aimDown)),Es(fe,V,i.aimDown),Es(E,fe,ce*(1-se)),Es(E,X,ce*se)}if(i.morph>0){let se=si(i.morph);for(let fe of sh)E[fe]=Wn(E[fe],ee[fe]||0,se)}let ke=Wn(26,6,i.water);for(let se of sh)i.pose[se]=yt(i.pose[se],E[se],ke,h);let ne=i.pose;t.body.rotation.set(0,i.yaw,0);let ie=Math.max(1e-4,1-si(i.morph*1.7));t.body.scale.setScalar(ie),t.body.position.set(0,8*(1-ie),0);let ge=Math.max(1e-4,si((i.morph-.12)/.7));t.ball.scale.setScalar(ge),i.roll-=l.vx*h/7.8,t.ball.rotation.set(0,0,i.roll+(1-ge)*2.5),t.thN.rotation.set(ne.spreadN,0,ne.thN),t.shN.rotation.set(0,0,ne.shN),t.ftN.rotation.set(0,0,ne.ftN),t.thF.rotation.set(-ne.spreadF,0,ne.thF),t.shF.rotation.set(0,0,ne.shF),t.ftF.rotation.set(0,0,ne.ftF);let ve,Se=Tp(ne.thN,ne.shN),Ze=Tp(ne.thF,ne.shF),ht=Math.max(Se,Ze)-15,O=-1.2*(1-L)*(1-i.water);ve=Wn(ht,O,ce)-i.land*2.4+Be*.12*Math.sin(y*1.7),i.crouch>.01&&(ve=Wn(ve,-6.8,Ce)),t.pelvis.position.set(ne.pelvisX,15.4+ve,0),t.pelvis.rotation.set(0,ne.twist*.5,0),t.spine.rotation.set(0,-ne.twist*.4,ne.spine-i.land*.25+i.aim*.08),t.chest.rotation.set(0,-ne.twist*.5,ne.chest+i.aim*.1),t.chest.scale.set(1,1+.012*Math.sin(y*1.7)*Be,1),t.head.rotation.set(0,0,ne.head+i.aim*.35-(ne.spine+ne.chest)*.5),t.pack.rotation.set(0,0,-i.land*.12+(l.vy||0)*12e-5*ce);let H=ne.spine-i.land*.25+i.aim*.08+ne.chest+i.aim*.1,B=i.aim-H;t.gun.rotation.set(0,0,B);let $=i.recoil*1.1;t.gun.position.set(t.gun.userData.rest.x-Math.cos(B)*$,t.gun.userData.rest.y-Math.sin(B)*$,t.gun.userData.rest.z),i.crouch>.01&&(t.gun.position.y-=.8*Ce),t.gun.updateMatrix(),nh.copy(Fy).applyMatrix4(t.gun.matrix),Zu(t.uaN,t.faN,nh,Oy,Pa,ih),nh.copy(ky).applyMatrix4(t.gun.matrix),Zu(t.uaF,t.faF,nh,zy,Pa,ih);let Y=ce*(l.vy<0?1:.25)*(1-i.water*.7)*(1-i.morph);i.thrust=yt(i.thrust,Y,14,h);let K=i.thrust*(.85+.15*Math.sin(i.time*47));t.thrN.scale.set(.6+.4*K,Math.max(1e-4,K*1.1),.6+.4*K),t.thrF.scale.copy(t.thrN.scale),n.fx.pulse(s,1+i.fireGlow*.9+(M?.4:0)),n.fx.apply(0,0),Ap.copy(Ny),t.gun.updateWorldMatrix(!0,!1),r.copy(Ap).applyMatrix4(t.gun.matrixWorld)}return{update:a,st:i,muzzle:r}}function Ip(){let n=new _t(.05);n.bone("body","root",0,0,0).bone("flA","body",-13.8,-.4,3).bone("flB","body",-13.8,-.4,-3).bone("strobe","body",-9.6,5.6,0).bone("tipN","body",-8.7,-.2,10.4).bone("tipF","body",-8.7,-.2,-10.4);let e=_.lathe([[.001,13.2],[.5,12.4],[1.2,10.4],[2,7],[2.55,3.5],[2.75,0],[2.6,-5],[2.3,-9],[1.9,-11.6],[1.4,-12.2],[.001,-12.3]],16);sn(e,null,[0,0,-Math.PI/2]),Cn(e,t=>{t.y*=.72,t.y<0&&(t.y*=.8),t.z*=1.15},"smooth"),n.add("body","paint",e,Ne.bone),n.add("body","paint",_.ext([[-10.5,1],[2,1.3],[5.5,1.6],[3,2.4],[-6,2.6],[-10.8,2]],2.2,.35),Ne.slate);for(let t of[1,-1]){n.add("body","paint",Pe(_.ext([[-3.5,-1.6],[4.5,-1.2],[5.6,-.2],[4.2,.9],[-3.5,1]],1.6,.35),0,0,t*2.2),Ne.slate),n.add("body","metal",Pe(_.box(.4,2,1.2,.1),5.4,-.3,t*2.3),Ne.suitD),n.add("body","accent",Pe(_.box(3.5,.18,.12),1,-.4,t*3.06),Je("#6cf3ff",3));let i=_.ext([[4,-1.8],[-5.5,-10.6],[-9.2,-10.6],[-8.6,-2.2]],.55,.2);sn(i,null,[Math.PI/2,0,0]),t<0&&(i=Aa(i)),n.add("body","paint",Pe(i,0,-.6,0,[t*-.05,0,0]),Ne.slate);let s=_.ext([[-6,-3],[-8.9,-9.8],[-9.9,-9.8],[-9.6,-3]],.4,.12);sn(s,null,[Math.PI/2,0,0]),t<0&&(s=Aa(s)),n.add("body","paint",Pe(s,0,-.55,0),Ne.orange),n.add("body","metal",Pe(_.cyl(1.55,1.7,8.4,14),-8.2,-.4,t*3,[0,0,Math.PI/2]),Ne.metal),n.add("body","paint",Pe(_.cyl(1.7,1.75,3.4,14),-6.5,-.4,t*3,[0,0,Math.PI/2]),Ne.slateD);let r=_.lathe([[1.5,0],[1.75,-.4],[1.55,-1.6],[1.25,-1.62],[1.3,-.4]],14);n.add("body","metal",Pe(r,-12.3,-.4,t*3,[0,0,-Math.PI/2]),Ne.gun),n.add("body","glow",Pe(_.cyl(1.25,1.25,.1,12),-13.8,-.4,t*3,[0,0,Math.PI/2]),Ca);let o=_.lathe([[1.15,0],[.9,-2],[.45,-4.2],[.02,-5.6]],10);n.add(t>0?"flA":"flB","glow",Pe(o,-13.8,-.4,t*3,[0,0,-Math.PI/2]),Ca.map(l=>l*.7)),n.add("body","paint",Pe(_.ext([[-11.2,1.4],[-8,1.6],[-9,6],[-10.6,6.2]],.5,.15),0,0,t*2,[t*.32,0,0]),Ne.slate);let a=_.ext([[8.6,-2],[6.4,-4.2],[5.4,-4.2],[6.2,-2]],.35,.1);sn(a,null,[Math.PI/2,0,0]),t<0&&(a=Aa(a)),n.add("body","paint",Pe(a,0,.2,0),Ne.slateD),n.add("body","metal",Pe(_.capsule(.55,4,2,8),-1,-1,t*6.4,[0,0,Math.PI/2]),Ne.gun),n.add("body","metal",Pe(_.cyl(.22,.22,2.5,6),2.2,-1,t*6.4,[0,0,Math.PI/2]),Ne.metal),n.add(t>0?"tipN":"tipF","glow",Pe(_.sph(.42,6,4),-8.7,-.2,t*10.4),t>0?Ly:Rp)}return n.add("body","crystal",Pe(_.ell(3.6,1.35,1.35,14,8),3.6,1.65,0),"#1c4658"),n.add("body","metal",Pe(_.torus(1.42,.16,4,14,Math.PI),3,1.6,0,[0,Math.PI/2,0]),Ne.gun),n.add("strobe","glow",Pe(_.sph(.32,6,4),-9.6,5.9,0),Uy),n.build()}function Dp(n){let e=n.bones,t={pitch:0,roll:0,thrust:.6,time:0};function i(s,r,o){o=Math.min(o,.05),t.time+=o;let a=s.vy||0,l=s.vx||0;t.pitch=yt(t.pitch,Ct(-a/240,-1,1)*.2,10,o),t.roll=yt(t.roll,Ct(a/240,-1,1)*.55,8,o),t.thrust=yt(t.thrust,Ct(.55+l/240*.5,.2,1.1),10,o),e.body.rotation.set(t.roll+Math.sin(t.time*1.3)*.03,0,t.pitch+Math.sin(t.time*1.7)*.015),e.body.position.y=Math.sin(t.time*2.1)*.25;let c=t.thrust*(.88+.12*Math.sin(t.time*53));e.flA.scale.set(Math.max(1e-4,c),.7+.3*c,.7+.3*c),e.flB.scale.copy(e.flA.scale);let h=t.time%1.1<.07?1:1e-4;e.strobe.scale.setScalar(h);let u=.75+.25*Math.sin(t.time*6);e.tipN.scale.setScalar(u),e.tipF.scale.setScalar(u),n.fx.apply(0,0)}return{update:i,st:t}}var w=(n,e,t,i,s,r)=>sn(n,[e,t,i],s,r),at=(n,e,t,i,s,r=6,o=6)=>_.taperTube([n,e,t],a=>Wn(i,s,a),r,o),By=(n,e,t,i)=>{let s=Math.sin(Math.round(n*97)*12.9898+Math.round(e*97)*78.233+Math.round(t*97)*37.719+i*11.1)*43758.5453;return s-Math.floor(s)};function kt(n,e=1,t=.22,i=1,s=1,r=1,o=1){let a=_.ico(1,i);return Cn(a,l=>{let c=By(l.x,l.y,l.z,e);l.multiplyScalar(n*(1+(c-.5)*t*2)),l.x*=s,l.y*=r,l.z*=o},!1),a.computeVertexNormals(),a}var Lp=(n,e,t,i)=>{let s=Math.floor(n),r=Math.floor(e),o=Math.floor(t),a=n-s,l=e-r,c=t-o,h=a*a*(3-2*a),u=l*l*(3-2*l),d=c*c*(3-2*c),f=(x,m,p)=>{let M=Math.sin(x*127.1+m*311.7+p*74.7+i*19.3)*43758.5453;return M-Math.floor(M)},g=(x,m,p)=>x+(m-x)*p;return g(g(g(f(s,r,o),f(s+1,r,o),h),g(f(s,r+1,o),f(s+1,r+1,o),h),u),g(g(f(s,r,o+1),f(s+1,r,o+1),h),g(f(s,r+1,o+1),f(s+1,r+1,o+1),h),u),d)};function hn(n,e,t,i=1,s=.12,r=14,o=10){let a=_.ell(1,1,1,r,o);return Cn(a,l=>{let c=Lp(l.x*1.6+5,l.y*1.6,l.z*1.6,i)*.65+Lp(l.x*4+9,l.y*4,l.z*4,i+3)*.35;l.multiplyScalar(1+(c-.5)*s*2.4),l.x*=n,l.y*=e,l.z*=t},"smooth"),a}function jt(n,e,t,i,s="crystal"){for(let[r,o,a,l,c,h,u,d]of t)n.add(e,s,w(_.crystal(l,c,6,.32,d||1),r,o,a,[h||0,(d||1)*.7,u||0]),i)}function oo(n,e,t,i,s,r,o,a,l,c="#24221f"){n.bone(e,t,i[0],i[1],i[2]).bone(e+"k",e,s[0],s[1],s[2]);let h=[(i[0]+s[0])/2,(i[1]+s[1])/2+o*.6,(i[2]+s[2])/2],u=[(s[0]+r[0])/2+o*.3,(s[1]+r[1])/2+o*.3,(s[2]+r[2])/2];n.add(e,a,at(i,h,s,o,o*.8),l),n.add(e,"suit",w(_.sph(o*.85,7,5),s[0],s[1],s[2]),c),n.add(e+"k",a,at(s,u,r,o*.78,o*.22),l)}function Up(n,e,t,i,s){let r=!!(i&&i.freeze>0),o=r?0:Math.min(s,.05);n.time+=o;let a=t&&t.hitFlash>0?Math.min(1,t.hitFlash*14):0,l=r?Math.min(1,i.freeze*2):0;return n.flash=a,n.frost=l,o}function Np(n,e){e.fx.apply(n.flash,n.frost)}function Xn(n,e,t,i=10){return n.yaw=yt(n.yaw,e>=0?0:-Math.PI,i,t),n.yaw}function jn(n,e){let t=e&&e.player;return t?Math.sign(t.x+t.w/2-(n.x+n.w/2))||n.facing||-1:n.facing||-1}function Ts(n,e,t=.5){let i=e&&e.player;return i?Math.atan2(-(i.y+i.h/2-(n.y+n.h*t)),i.x+i.w/2-(n.x+n.w/2)):Math.PI}function dr(n,e,t,i=1.6){let s=e.fireT!=null?e.fireT:1;n.lastFire!=null&&s>n.lastFire+.05&&(n.kick=1),n.lastFire=s,n.kick=Math.max(0,(n.kick||0)-t*5),n.charge=s<.45&&s>0?1-s/.45:0}function Ia(n,e){let t=!n.vy||Math.abs(n.vy)<.001,i=(n.t||0)%e,s=t?si((i-(e-.3))/.3):0,r=t?0:Ct((n.vy||0)/400,-1,1);return{ground:t,crouch:s,air:r}}function rh(n,e,t,i,s){n.mount==null&&(n.mount=wp(t,i));let r=e.bones.root;return n.mount==="ceil"?(r.rotation.set(0,0,Math.PI),r.position.set(0,s,0)):n.mount==="wallL"?(r.rotation.set(0,0,-Math.PI/2),r.position.set(-s/2,s/2,0)):n.mount==="wallR"&&(r.rotation.set(0,0,Math.PI/2),r.position.set(s/2,s/2,0)),n.mount}function oh(n,e){return n==="ceil"?e-Math.PI:n==="wallL"?e+Math.PI/2:n==="wallR"?e-Math.PI/2:e}function ah(n,e,t,i=-.35,s=1.45){let r=Math.cos(e)>=0;Xn(n,r?1:-1,t,8);let o=r?e:Math.PI-e;return o>Math.PI&&(o-=Ve),n.pitch=yt(n.pitch||0,Ct(o,i,s),10,t),n.pitch}function Da(n,e,t,i){n.rotation.set(-e*i,e*t,0)}var Pt={chitin:"#6e3320",chitinL:"#8e4628",chitinD:"#3e1d12",rock:ur("#7c4a32","#5e3424",2.2,"#9a6a48"),rockL:ur("#8e5a3c","#6e402a",2,"#b08060"),rockD:"#4a2a1c",crys:"#4f97ff",bronze:"#7a6040",bone:"#d2bc98"},lh=Je("#ffad3a",3.2),Op=Je("#7fc4ff",3),Zt={shell:"#3e555c",shellL:"#58747a",stone:"#4f5f66",stoneD:"#333f44",patina:"#4d6b5e",patinaD:"#344a42",flesh:"#6a4a5a",fleshL:"#86607a",crys:"#3fd6c8",eelD:"#24393f",eelL:"#5b7f86"},ao=Je("#3fe6d4",3.2),La=Je("#45f0dc",3.6);function Hy(){let n=new _t;n.bone("body","root",0,7,0).bone("head","body",7.2,7.6,0).bone("crys","body",-1,10.8,0),n.add("body","suit",w(_.ell(7,2.5,4.4,14,8),-.4,6.3,0),Pt.chitinD),n.add("body","paint",w(_.ell(4.4,3,4.2,12,8),-4.4,7.3,0),Pt.chitinD);for(let i of[1,-1]){n.add("body","paint",w(_.shell(8.2,5.4,5.7,.55,i>0?.06:Math.PI+.06,i>0?Math.PI-.06:Ve-.06,0,1.64,12,6),-1.6,7.5,0),Pt.chitin);for(let[s,r,o,a]of[[-3.2,12,3.1,2],[.8,12.3,2.7,3],[-6,10.4,3.7,4],[3.6,10.6,3.6,5]])n.add("body","suit",w(kt(1,a*7+(i>0?1:2),.35,0,1.6,.55,1.15),s,r,i*o,[i*.5,0,0]),Pt.rockL);n.add("body","glow",w(_.box(2.6,.22,.2),-1.8,9.2,i*5.55,[0,0,.05]),Op.map(s=>s*.5))}n.add("body","paint",w(_.shell(3.8,3.3,4.5,.5,0,Ve,0,1.75,12,5),4.2,7.6,0),Pt.chitinL),n.add("head","paint",w(_.ell(2.3,2.1,2.8,10,8),8,7.5,0),Pt.chitinD);for(let i of[1,-1])n.add("head","glow",w(_.ell(.7,.8,.5,8,6),9.5,8.4,i*1.7),lh),n.add("head","paint",at([9.8,6.8,i*1.3],[11.4,6.6,i*1.05],[11.7,5.5,i*.2],.55,.1),Pt.chitinD),n.add("head","suit",at([9.4,9.2,i*1],[11,11.4,i*1.8],[13.2,12.1,i*2.4],.17,.07,6,4),Pt.chitinD);jt(n,"crys",[[-1.2,10.6,0,1.75,9.8,.05,.14,3],[-3.9,10.4,1.5,1.25,7,.32,.36,5],[1.6,11,-1.1,1.1,6.2,-.26,-.3,7],[-5.9,9.6,-1.7,.9,4.2,-.42,.6,9],[2.9,10.4,1.9,.8,3.6,.45,-.42,11],[-2.6,10.9,-2.4,.7,3,-.6,.2,13]],Pt.crys);let e=[4.2,.6,-3.2],t=[2.4,.3,-2.2];for(let i=0;i<6;i++){let s=i%2?-1:1,r=Math.floor(i/2),o=e[r],a=t[r];oo(n,"l"+i,"body",[o,6.6,s*3.6],[o+a*.5,9.8,s*7.6],[o+a,.3,s*9.3],.8,"paint",Pt.chitinD)}return n.build()}function Vy(n,e,t,i,s){n.root.rotation.y=Xn(e,t.facing||-1,s,8),e.phase+=Math.abs(t.vx||0)*s/15*Ve;for(let r=0;r<6;r++){let o=r%2?-1:1,a=r===0||r===3||r===4,l=e.phase+(a?0:Math.PI),c=.34*Math.max(0,Math.cos(l));Da(n["l"+r],o,.36*Math.sin(l),c),n["l"+r+"k"].rotation.x=-o*c*.7}n.body.position.y=7+.35*Math.abs(Math.sin(e.phase*2))+.12*Math.sin(e.time*2),n.body.rotation.x=.04*Math.sin(e.phase),n.head.rotation.y=.18*Math.sin(e.time*1.3),n.crys.rotation.z=.025*Math.sin(e.time*2.2)}function Gy(){let n=new _t;n.bone("body","root",0,10,0).bone("head","body",6.6,9.6,0),n.add("body","suit",w(kt(7,4,.22,1,1.18,.95,1),-.6,11.2,0),Pt.rock),n.add("body","suit",w(kt(3.2,5,.3,0,1.6,.55,1.25),-2.2,17.4,.4,[0,0,.15]),Pt.rockL),n.add("body","suit",w(kt(2.6,6,.3,0,1.5,.55,1.2),2.6,16.4,-1.6,[.2,0,-.25]),Pt.rockL),n.add("body","suit",w(kt(2.4,7,.3,0,1.5,.6,1.1),-5.6,14.6,1.8,[-.2,0,.6]),Pt.rockL),n.add("body","suit",w(_.ell(5.6,2.4,4.6,12,6),0,6.6,0),Pt.rockD),jt(n,"body",[[-3.2,15.2,3.6,.95,4.2,.55,.3,2],[1.4,16.8,-3,.85,3.6,-.6,-.2,4],[-6,12.8,-2.4,.7,3,-.45,.8,6],[4.6,14,2.6,.6,2.4,.5,-.6,8]],Pt.crys),n.add("head","paint",w(_.ell(2.7,2.2,3,10,8),7.4,9.1,0),Pt.rockD),n.add("head","suit",w(kt(1.7,9,.3,0,1.3,.7,1.4),7.2,10.8,0),Pt.rock);for(let t of[1,-1])n.add("head","glow",w(_.sph(.55,6,4),9.6,9.8,t*1.3),lh),n.add("head","glow",w(_.sph(.38,6,4),9.1,10.7,t*2),lh),n.add("head","paint",at([9.4,8,t*1.4],[10.9,7.6,t*1.2],[11.2,6.7,t*.4],.5,.1),Pt.chitinD);let e=[3.6,3.6,-3.6,-3.6];for(let t=0;t<4;t++){let i=t%2?-1:1,s=e[t];oo(n,"l"+t,"body",[s,8.2,i*4.4],[s*1.35,11.6,i*8.4],[s*1.55,.3,i*9.6],1.15,"paint",Pt.chitinD)}return n.build()}function Wy(n,e,t,i,s){let r=Ia(t,1.2),o=Math.abs(t.vx||0)>1?Math.sign(t.vx):jn(t,i);n.root.rotation.y=Xn(e,o,s,9),e.cr=yt(e.cr||0,r.crouch,20,s),e.air=yt(e.air||0,r.air,14,s);let a=Math.max(0,-e.air),l=Math.max(0,e.air);n.body.position.y=10-3.4*e.cr+.15*Math.sin(e.time*2.5),n.body.rotation.z=-.22*e.air+.12*e.cr;for(let c=0;c<4;c++){let h=c%2?-1:1,u=c<2?1:-1,d=.45*e.cr-.35*a+.15*l;Da(n["l"+c],h,u*(.1+.25*a-.2*l),d),n["l"+c+"k"].rotation.x=h*(.5*e.cr-.25*a)}n.head.rotation.z=.12*e.cr+.06*Math.sin(e.time*3)}function Xy(){let n=new _t;n.bone("yaw","root",0,9,0).bone("aim","yaw",0,10.2,0).bone("gun","aim",0,10.2,0),n.add("root","suit",w(kt(6,11,.3,1,1.4,.55,1.1),0,2,0),Pt.rock),n.add("root","suit",w(kt(3,12,.35,0,1.2,.8,1.2),-7.2,1.6,2.6),Pt.rockD),n.add("root","suit",w(kt(2.4,13,.35,0,1.3,.7,1.1),6.8,1.2,-2.2),Pt.rockL),jt(n,"root",[[-4.5,3.8,4.2,.8,3.6,.6,.4,3],[5.2,3.4,3.8,.7,3,.7,-.5,5]],Pt.crys),n.add("root","metal",w(_.torus(5,.85,6,20),0,6.8,0,[Math.PI/2,0,0]),Pt.bronze);for(let e=0;e<6;e++){let t=e/6*Ve;n.add("root","metal",w(_.cyl(.4,.4,.8,6),Math.cos(t)*5,7.6,Math.sin(t)*5),"#4a4036")}n.add("yaw","metal",w(_.cyl(3.4,4.2,3,12),0,8.4,0),"#3e3a34"),n.add("aim","paint",w(_.sph(5.4,16,12),0,10.6,0),"#8a5636"),n.add("aim","paint",w(_.shell(5.9,5.9,5.9,.5,-1.2,1.2,.35,2.4,10,6),0,10.6,0),Pt.rockL);for(let e of[1,-1])n.add("aim","paint",w(_.ext([[-4,-1],[2,-.6],[3.5,1.6],[-3.2,2.2]],.6,.2),0,10.6,e*5.8),Pt.chitinD);n.add("aim","metal",w(_.torus(1.9,.45,6,16),5.1,11.2,0,[0,Math.PI/2,0]),"#2e2a26"),n.add("aim","core",w(_.sph(1.7,12,10),5.4,11.6,0,null,[.75,1,1]),Je("#ff8a3a",2.6)),n.add("aim","metal",w(_.torus(1.75,.3,5,16),5.6,11.6,0,[0,Math.PI/2,0]),"#2e2a26");for(let e of[2.3,-2.3])n.add("gun","metal",w(_.cyl(.75,.85,7,10),7.6,8.9,e,[0,0,-Math.PI/2]),"#3a3632"),n.add("gun","metal",w(_.cyl(.95,.95,1.2,10),11,8.9,e,[0,0,-Math.PI/2]),"#6a5a44");return n.build()}function qy(n,e,t,i,s,r){let o=rh(e,r,t,i,20),a=oh(o,t.aim!=null?-t.aim:Ts(t,i)),l=ah(e,a,s,-.5,1.5);n.yaw.rotation.y=e.yaw,n.aim.rotation.z=l,dr(e,t,s),n.gun.position.x=-e.kick*1.6,r.fx.pulse(r.byMat.core,.7+e.charge*1.6+.15*Math.sin(e.time*4))}function Yy(){let n=new _t;n.bone("body","root",0,8,0).bone("head","body",5.6,8.6,0).bone("ab0","body",-2.2,8,0).bone("ab1","ab0",-5.4,7.6,0).bone("ab2","ab1",-8.2,7,0).bone("wN","body",.6,10.2,1.5).bone("wF","body",.6,10.2,-1.5).bone("wN2","body",-1.2,10,1.3).bone("wF2","body",-1.2,10,-1.3),n.add("body","paint",w(_.ell(3.4,2.7,2.6,12,8),.6,8.4,0),Pt.chitin),n.add("body","paint",w(_.shell(3.6,3,2.8,.4,0,Ve,0,1.2,12,4),.6,8.6,0),"#b8742e"),n.add("head","paint",w(_.ell(2,2,2.1,10,8),6,8.6,0),Pt.chitinD);for(let t of[1,-1]){n.add("head","glow",w(_.ell(1,1.35,.8,8,6),6.8,9.2,t*1.35),lh),n.add("head","paint",at([7.4,7.6,t*.8],[8.6,7,t*.7],[8.7,6.2,t*.15],.38,.08),Pt.chitinD),n.add("head","suit",at([6.8,10.2,t*.6],[8,12.4,t*1],[9.6,13,t*1.4],.14,.06,6,4),Pt.chitinD);for(let i=0;i<3;i++)n.add("body","suit",at([1.8-i*1.4,6.3,t*.9],[2.4-i*1.8,3.6,t*2.2],[1.6-i*2.4,1,t*2.6],.22,.07,6,4),Pt.chitinD)}n.add("ab0","paint",w(_.ell(2.4,2.3,2.3,10,8),-3,7.9,0),"#b8742e"),n.add("ab0","paint",w(_.torus(2.1,.32,4,14),-4.4,7.7,0,[0,Math.PI/2,.15]),Pt.chitinD),n.add("ab1","paint",w(_.ell(2.6,2.4,2.4,10,8),-6.2,7.3,0),Pt.chitinD),n.add("ab1","paint",w(_.torus(2.25,.34,4,14),-6.4,7.3,0,[0,Math.PI/2,.25]),"#b8742e"),n.add("ab2","paint",w(_.ell(2,1.8,1.8,10,8),-9,6.6,0),"#b8742e"),n.add("ab2","crystal",w(_.crystal(.7,4.2,6,.4,5),-10.4,6.2,0,[0,0,Math.PI/2+.35]),Pt.crys),n.add("ab2","glow",w(_.sph(.45,6,4),-10.6,6.2,0),Op);let e=(t,i)=>_.membrane([[0,0],[-1.2,i*.6],[-t*.55,i],[-t,i*.85],[-t*.7,i*.35],[-t*.25,.2]]);for(let[t,i,s,r]of[["wN",1.5,9,8.5],["wF",-1.5,9,8.5],["wN2",1.3,6.5,6],["wF2",-1.3,6.5,6]]){let o=t.endsWith("2")?-1.2:.6,a=t.endsWith("2")?10:10.2;n.add(t,"membrane",w(e(s,r),o,a,i),"#d8b07a"),n.add(t,"paint",at([o,a,i],[o-s*.3,a+r*.85,i],[o-s,a+r*.85,i],.18,.06,8,4),Pt.chitinD)}return n.build()}function Zy(n,e,t,i,s){let r=jn(t,i);n.root.rotation.y=Xn(e,r,s,6);let o=e.py!=null&&s>0?(t.y-e.py)/s:0;e.py=t.y,e.bank=yt(e.bank||0,Ct(-o/120,-1,1),6,s),n.body.rotation.z=e.bank*.25;let a=Math.sin(e.time*Ve*14),l=Math.sin(e.time*Ve*14+1.2);n.wN.rotation.x=-.25-.9*a,n.wF.rotation.x=.25+.9*a,n.wN2.rotation.x=-.35-.8*l,n.wF2.rotation.x=.35+.8*l,n.ab0.rotation.z=.1*Math.sin(e.time*3),n.ab1.rotation.z=.14*Math.sin(e.time*3-.7)-.1,n.ab2.rotation.z=.2*Math.sin(e.time*3-1.4)-.15,n.head.rotation.y=.15*Math.sin(e.time*1.7)}function $y(){let n=new _t;n.bone("body","root",0,8,0).bone("spin","body",0,8,0),n.add("body","flesh",w(hn(4.3,4.5,4.3,3,.1),0,8,0),"#8a5a3a"),n.add("body","core",w(_.torus(4.15,.34,6,24),0,8,0,[Math.PI/2,0,0]),Je("#7fc4ff",2)),n.add("body","core",w(_.sph(1.1,8,6),0,12.4,0),Je("#9fd4ff",1.6));let e=12;for(let t=0;t<e;t++){let i=1-(t+.5)/e*2,s=Math.sqrt(1-i*i),r=t*2.39996,o=[Math.cos(r)*s,i,Math.sin(r)*s];if(Math.abs(i)>.92)continue;let a=_.cone(.42,3.4,6);a.translate(0,1.7,0);let l=[o[0]*3.9,8+o[1]*4.1,o[2]*3.9];n.add("spin","paint",Ua(a,o,l),"#9a7a58"),n.add("spin","crystal",Ua(w(_.crystal(.32,1.4,5,.5,t+3),0,3.3,0),o,l),Pt.crys)}for(let t=0;t<3;t++){let i=t/3*Ve,s=_.membrane([[0,-1.2],[5.8,-.4],[7.2,1.8],[4.2,2.6],[0,1.4]]);n.add("spin","membrane",w(s,Math.cos(i)*3.6,8,Math.sin(i)*3.6,[0,-i,0]),"#b08a5a"),n.add("spin","paint",w(at([0,0,0],[3.6,2,0],[7.2,1.8,0],.16,.08,6,4),Math.cos(i)*3.6,8,Math.sin(i)*3.6,[0,-i,0]),Pt.bone)}return n.build()}function Jy(n,e,t,i,s,r){n.spin.rotation.y+=s*1.7,n.body.rotation.set(.18*Math.sin(e.time*1.3),0,.22*Math.sin(e.time*1.7));let o=i.player,l=(o?Math.hypot(o.x-t.x,o.y-t.y):999)<90?9:3;r.fx.pulse(r.byMat.core,.5+.7*(.5+.5*Math.sin(e.time*l)))}function Ky(){let n=new _t;n.bone("body","root",0,8.6,0).bone("clN","body",5,9,3.4).bone("clF","body",-5,9,3.4),n.add("body","flesh",w(_.shell(8.8,5.2,6.6,.6,0,Ve,0,1.72,16,7),0,9.2,0),Zt.shell),n.add("body","suit",w(_.ell(7,2.6,5.4,14,8),0,8.4,0),Zt.stoneD);for(let t=0;t<7;t++){let i=(t/6-.5)*2.2;n.add("body","paint",w(_.cone(.55,1.6,5),Math.sin(i)*8.6,8.6,Math.cos(i)*6.4*.98,[Math.PI/2-.3,0,-i*.3]),Zt.shellL)}jt(n,"body",[[-2,12.8,-1.2,1.45,7.6,-.2,.15,3],[2.6,13,-2,1.1,6,-.3,-.3,5],[.2,13.4,-3.6,.9,4.6,-.5,0,7],[-4.6,11.8,-2.6,.8,3.6,-.4,.5,9],[4.8,11.6,.4,.6,2.6,.3,-.6,11]],Zt.crys);for(let t=0;t<8;t++){let i=t/7*Math.PI;n.add("body","glow",w(_.sph(.35,6,4),Math.cos(i)*7.6,10.4+Math.sin(i)*1.2,Math.sin(i)*4.8+1.2),ao)}for(let t of[1,-1]){n.add("body","paint",at([t*1.6,12.2,4],[t*1.9,13.4,4.4],[t*2.1,14.4,4.7],.32,.22,6,4),Zt.shellL),n.add("body","glow",w(_.sph(.62,8,6),t*2.1,14.7,4.8),La);let i=t>0?"clN":"clF";n.add(i,"flesh",at([t*5,9,3.4],[t*6.9,10.6,5.8],[t*6.1,12.4,7.4],1.15,.9),Zt.shell),n.add(i,"flesh",w(_.ell(2.1,1.6,1.4,10,8),t*5.5,13.3,8.1,[0,0,t*.4]),Zt.shellL),n.add(i,"paint",w(_.cone(.75,3.2,6),t*4.1,15,8.4,[0,0,t*.75]),Zt.shellL),n.add(i,"paint",w(_.cone(.6,2.6,6),t*5,15.3,7.6,[0,0,t*.2]),Zt.stone),n.add(i,"glow",w(_.sph(.3,6,4),t*5.8,13.6,9.4),ao)}let e=[1.8,-.6,-3];for(let t=0;t<6;t++){let i=t%2?-1:1,s=e[Math.floor(t/2)];oo(n,"l"+t,"body",[i*5.4,8,s],[i*8.8,11.2,s*1.3],[i*9.9,.3,s*1.5],.72,"paint",Zt.stone)}return n.build()}function jy(n,e,t,i,s){e.phase+=Math.abs(t.vx||0)*s/13*Ve,n.root.rotation.y=yt(n.root.rotation.y,-(t.facing||-1)*.22,6,s);for(let o=0;o<6;o++){let a=o%2?-1:1,l=e.phase+Math.floor(o/2)*2.1+(a>0?0:Math.PI),c=.36*Math.max(0,Math.sin(l));n["l"+o].rotation.set(0,.16*Math.cos(l),a*(c+.08*Math.cos(l))),n["l"+o+"k"].rotation.z=-a*c*.5}n.body.position.set(.3*Math.sin(e.phase*2),8.6+.3*Math.abs(Math.sin(e.phase*2))+.1*Math.sin(e.time*1.6),0);let r=Math.max(0,Math.sin(e.time*1.4))**6;n.clN.rotation.set(-.15*r,0,.1*Math.sin(e.time*1.1)),n.clF.rotation.set(-.15*Math.max(0,Math.sin(e.time*1.4+2))**6,0,-.1*Math.sin(e.time*1.1+1))}function Qy(){let n=new _t,e=[9,5,1,-3,-7,-11];n.bone("s0","root",e[0],6,0);for(let i=1;i<6;i++)n.bone("s"+i,"s"+(i-1),e[i],6,0);n.bone("jaw","s0",9.6,5.3,0),n.add("s0","flesh",w(_.ell(4.3,2.6,2.4,14,10),11.4,6.3,0),Zt.eelD),n.add("s0","flesh",w(_.ell(3,1.2,2,10,6),10.6,7.6,0),Zt.eelL),n.add("jaw","flesh",w(_.ell(3.8,1,2,12,6),12,4.7,0),Zt.eelL);for(let i=0;i<5;i++)for(let s of[1,-1])n.add("jaw","paint",w(_.cone(.22,.9,4),10.4+i*.85,5.6,s*(1.6-i*.22)),"#e8e0cc"),n.add("s0","paint",w(_.cone(.22,.9,4),10.6+i*.85,5.4,s*(1.7-i*.22),[Math.PI,0,0]),"#e8e0cc");for(let i of[1,-1]){n.add("s0","glow",w(_.sph(.6,8,6),13.2,7,i*1.55),La);for(let s=0;s<3;s++)n.add("s0","glow",w(_.box(.18,1.5,.15),8.6-s*.7,6.1,i*2.25),ao.map(r=>r*.7));n.add("s0","suit",at([14.6,5.2,i*.8],[15.6,3.8,i*1.4],[15,2.4,i*1.6],.14,.05,6,3),Zt.eelL)}n.add("s0","flesh",w(_.ell(3.4,2.75,2.35,12,8),7.4,6,0),Zt.eelD);let t=[2.7,2.6,2.35,2,1.55,1];for(let i=1;i<6;i++){let s=e[i]-2,r=t[i];n.add("s"+i,"flesh",w(_.ell(3.6,r,r*.86,12,8),s+.4,6,0),i%2?Zt.eelD:"#2b434a"),n.add("s"+i,"membrane",w(_.membrane([[2.6,0],[-2.4,0],[-2.4,r*.7+.8],[2.6,t[i-1]*.7+.8]]),s+.2,6+r*.62,0),"#5fd8c8");for(let o of[1,-1])n.add("s"+i,"glow",w(_.sph(.28,6,4),s+.8,6.2,o*r*.84),ao)}return n.add("s5","membrane",w(_.membrane([[-11,0],[-15.4,3.4],[-14.6,0],[-15.4,-3]]),0,6,0),"#5fd8c8"),n.build()}function e2(n,e,t,i,s){n.root.rotation.y=Xn(e,t.facing||1,s,7);let r=[.05,.2,.24,.26,.28,.3];for(let o=0;o<6;o++)n["s"+o].rotation.set(.12*Math.sin(e.time*6-o*.9),0,r[o]*Math.sin(e.time*6-o*.9));n.jaw.rotation.z=-.32*(.5+.5*Math.sin(e.time*2.1))**2}function t2(){let n=new _t;n.bone("stalk","root",0,4.2,0).bone("head","stalk",0,11.2,0),n.add("root","suit",w(kt(6.2,21,.3,1,1.45,.55,1.1),0,2,0),Zt.stone),jt(n,"root",[[-6,2.6,2.6,.75,3.2,.5,.6,3],[5.6,2.2,3.4,.6,2.6,.7,-.5,5]],Zt.crys);for(let e=0;e<6;e++){let t=e*1.3;n.add("root","paint",w(_.cone(.7,1.2,6),Math.cos(t)*6,3.2,Math.sin(t)*4.5),"#c7c0b0")}n.add("stalk","flesh",_.taperTube([[0,3.6,0],[.6,7.6,0],[0,11.4,0]],e=>Wn(2.7,2,e),8,10),Zt.flesh);for(let e of[6.2,8.4,10.4])n.add("stalk","flesh",w(_.torus(2.35-(e-6)*.08,.32,5,14),.3,e,0,[Math.PI/2,0,0]),Zt.fleshL);n.add("head","flesh",w(_.ell(4.2,3.3,4.2,14,10),0,12.8,0),Zt.fleshL),n.add("head","core",w(_.cyl(1.9,2.5,.6,14),0,15.7,0),Je("#45f0dc",3.2)),n.add("head","flesh",w(_.torus(2.6,.55,6,16),0,15.8,0,[Math.PI/2,0,0]),Zt.flesh);for(let e=0;e<6;e++){let t=e/6*Ve,i=Math.cos(t)*3,s=Math.sin(t)*3;n.bone("t"+e,"head",i,15.6,s),n.add("t"+e,"flesh",at([i,15.6,s],[i*1.6,17.6,s*1.6],[i*2.1,18.4,s*2.1],.55,.14,8,5),"#9a7088"),n.add("t"+e,"glow",w(_.sph(.3,6,4),i*2.15,18.5,s*2.15),La)}return n.build()}function n2(n,e,t,i,s,r){dr(e,t,s,2.1);let o=jn(t,i);e.lean=yt(e.lean||0,o*.12,3,s),n.stalk.rotation.set(.05*Math.sin(e.time*1.2),0,-e.lean+.04*Math.sin(e.time*1.6));let a=e.charge*.18-e.kick*.22;n.head.scale.set(1+a*.6,1-a,1+a*.6);for(let l=0;l<6;l++){let c=Math.sin(e.time*2.2+l*1.1),h=l/6*Ve,u=.3*e.kick-.35*e.charge;n["t"+l].rotation.set(Math.sin(h)*(.2*c+u),0,-Math.cos(h)*(.2*c+u))}r.fx.pulse(r.byMat.core,.7+e.charge*1.3+e.kick*1.5+.15*Math.sin(e.time*3))}function i2(){let n=new _t;n.bone("body","root",0,8.4,0).bone("eye","body",1.6,8.4,0).bone("vN","body",-1,8.4,4.4).bone("vF","body",-1,8.4,-4.4),n.add("body","paint",w(_.torus(4.3,1.55,8,22),.6,8.4,0,[0,Math.PI/2,0]),Zt.patina);for(let e=0;e<6;e++){let t=e/6*Ve;n.add("body","paint",w(_.box(1.2,1.6,2.2,.3),1.4,8.4+Math.cos(t)*4.3,Math.sin(t)*4.3,[t,0,0]),Zt.patinaD)}for(let e=0;e<4;e++){let t=e/4*Ve+.4;n.add("body","glow",w(_.box(.2,1.4,.3),2.2,8.4+Math.cos(t)*4.4,Math.sin(t)*4.4,[t,0,0]),ao)}n.add("body","paint",w(_.ell(3.6,4,4,12,10),-2.4,8.4,0),Zt.patinaD),n.add("body","paint",w(_.cone(2,3,8),-6.2,8.4,0,[0,0,Math.PI/2]),Zt.patina),n.add("eye","core",w(_.sph(2.6,14,10),1.8,8.4,0),Je("#3fe6d4",2.6)),n.add("eye","metal",w(_.sph(1.05,10,8),4,8.4,0),"#0b1a1a"),n.add("eye","paint",w(_.torus(2.5,.35,5,18),2.6,8.4,0,[0,Math.PI/2,0]),"#2a3a34");for(let[e,t]of[["vN",1],["vF",-1]])n.add(e,"paint",w(_.ext([[0,-.4],[-4.8,2.4],[-8.2,2],[-6,.2],[-3.6,-1.2]],.5,.18),-1,8.4,t*4.6),Zt.patina),n.add(e,"glow",w(_.box(3,.16,.14),-4.2,9.3,t*4.9,[0,0,-.3]),ao);for(let e of[1.2,-1.2,0])n.add("body","suit",at([-2.6,5,e],[-4.2,3.2,e*1.4],[-6.2,2.2,e*1.6],.28,.08,8,4),Zt.patinaD);return n.scaleAll(1.3,0,8,0),n.build()}function s2(n,e,t,i,s){let r=jn(t,i);n.root.rotation.y=Xn(e,r,s,5);let o=Ts(t,i),a=r>0?o:Math.PI-o,l=a>Math.PI?a-Ve:a;e.look=yt(e.look||0,Ct(l,-.7,.7),6,s),n.eye.rotation.z=e.look,n.body.rotation.z=.06*Math.sin(e.time*1.4),n.body.position.y=8.4+.4*Math.sin(e.time*2.2),n.vN.rotation.x=-.15-.15*Math.sin(e.time*3),n.vF.rotation.x=.15+.15*Math.sin(e.time*3)}function r2(){let n=new _t;n.bone("body","root",0,8,0).bone("core","body",0,8,0),n.add("body","bubble",w(_.sph(7.4,20,14),0,8,0),"#bff4ff"),n.add("core","metal",w(_.ico(3,1),0,8,0),"#4f6466"),n.add("core","core",w(_.torus(3.05,.3,5,20),0,8,0,[Math.PI/2,0,0]),La),n.add("core","core",w(_.torus(3.05,.3,5,20),0,8,0,[0,0,0]),La);let e=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.7,.7,0],[-.7,-.7,0]];for(let t of e)n.add("core","paint",Ua(w(_.cone(.6,2.2,6),0,1.1,0),t,[t[0]*2.8,8+t[1]*2.8,t[2]*2.8]),"#8a7a50");return n.build()}function o2(n,e,t,i,s,r){n.core.rotation.set(e.time*.6,e.time*.9,0);let o=Math.sin(e.time*2.4);n.body.scale.set(1+.035*o,1-.035*o,1+.02*o);let a=i.player,l=a?Math.hypot(a.x-t.x,a.y-t.y):999;r.fx.pulse(r.byMat.core,.7+.6*(.5+.5*Math.sin(e.time*(l<90?10:3.5))))}var Fp=new ei,Ku=new ot,a2=new k(0,1,0),kp=new k;function Ua(n,e,t){return kp.set(e[0],e[1],e[2]).normalize(),Fp.setFromUnitVectors(a2,kp),Ku.makeRotationFromQuaternion(Fp),Ku.setPosition(t[0],t[1],t[2]),n.applyMatrix4(Ku),n}var zp={scarab:{type:"walker",build:Hy,pose:Vy},rockmite:{type:"hopper",build:Gy,pose:Wy},cliffpod:{type:"turret",build:Xy,pose:qy},wasp:{type:"flyer",build:Yy,pose:Zy},windmine:{type:"drifter",build:$y,pose:Jy},crab:{type:"walker",build:Ky,pose:jy},eel:{type:"eel",build:Qy,pose:e2},polyp:{type:"turret",build:t2,pose:n2},sentry:{type:"flyer",build:i2,pose:s2},bubblemine:{type:"drifter",build:r2,pose:o2}};var tn={hull:"#30353c",hullL:"#4a5059",hullD:"#1f2328",red:"#8a1c1c",stripe:"#b8862e",metal:"#5c6168"},ju=Je("#ff3b2f",3.6),ch=Je("#ff7a2a",3.4),ct={iron:"#302c2a",ironL:"#46403c",rust:"#7a3b1e",brass:"#a07a3a",hazard:"#d8a12a",steel:"#6a6e74",steelL:"#8a8e94"},pr=Je("#ff6a14",3.6),hh=Je("#ffcf3a",3.4),Ot={crys:"#8a4dff",crysL:"#b98cff",flesh:"#5a2a4a",fleshL:"#7a3c5e",fleshD:"#3a1a30",bone:"#cdbba2",chitin:"#2a1a2e"},As=Je("#8fff3f",3.2),Na=Je("#9cff4a",3.6);function l2(){let n=new _t;n.bone("yaw","root",0,6,0).bone("aim","yaw",0,10.4,0).bone("gun","aim",0,10.4,0),n.add("root","paint",w(_.cyl(9.4,10,2.2,6),0,1.1,0,[0,Math.PI/6,0]),tn.hull),n.add("root","paint",w(_.torus(8.2,.3,4,6),0,2.3,0,[Math.PI/2,0,Math.PI/6]),tn.stripe);for(let e=0;e<6;e++){let t=e/6*Ve;n.add("root","metal",w(_.cyl(.55,.55,.6,6),Math.cos(t)*7.6,2.4,Math.sin(t)*7.6),tn.metal)}n.add("root","metal",w(_.cyl(5,6.2,4.4,12),0,4.2,0),tn.hullD);for(let e=0;e<8;e++){let t=e/8*Ve;n.add("root","metal",w(_.box(.5,3.4,1,.1),Math.cos(t)*5.7,4.2,Math.sin(t)*5.7,[0,-t,0]),tn.metal)}n.add("yaw","paint",w(_.shell(6.4,5.6,6.4,.6,0,Ve,0,Math.PI/2+.3,16,6),0,8.6,0),tn.hullL),n.add("yaw","paint",w(_.torus(6.3,.45,5,18),0,7.4,0,[Math.PI/2,0,0]),tn.red),n.add("aim","paint",w(_.box(5,4.4,6.6,.9,2),3.2,10.4,0),tn.hull),n.add("aim","core",w(_.box(.3,.8,2.6),5.75,11.9,0),ju);for(let e of[1.7,-1.7])n.add("gun","metal",w(_.cyl(.72,.8,8.6,10),9.2,10,e,[0,0,-Math.PI/2]),tn.metal),n.add("gun","metal",w(_.cyl(1,1,1.4,8),13.2,10,e,[0,0,-Math.PI/2]),tn.hullD),n.add("gun","core",w(_.torus(.78,.18,4,10),14,10,e,[0,Math.PI/2,0]),ch);return n.build()}function c2(n,e,t,i,s,r){let o=rh(e,r,t,i,20),a=oh(o,t.aim!=null?-t.aim:Ts(t,i)),l=ah(e,a,s,-.25,1.5);n.yaw.rotation.y=e.yaw,n.aim.rotation.z=l,dr(e,t,s),n.gun.position.x=-e.kick*1.8,r.fx.pulse(r.byMat.core,.6+e.charge*1.8+e.kick*1.2)}function h2(){let n=new _t;n.bone("body","root",0,8,0).bone("flame","body",-10,8,0);let e=_.lathe([[.001,11.4],[.6,10.4],[1.4,7.6],[2.1,3.6],[2.3,0],[2.2,-4],[1.9,-7.6],[1.5,-9.2],[.001,-9.3]],14);sn(e,[0,8,0],[0,0,-Math.PI/2]),Cn(e,t=>{let i=t.y-8;t.y=8+i*(i>0?1.05:.9),t.z*=.9},"smooth"),n.add("body","paint",e,tn.hull),n.add("body","crystal",w(_.ell(3,1.1,1.1,12,8),4.4,9.3,0),"#8a3a10"),n.add("body","paint",w(_.ext([[-6,6.2],[3,6],[5,5],[-5,3.6]],2.4,.4),0,0,0),tn.hullD),n.add("body","glow",w(_.box(1.6,.6,2),4.2,5.4,0),ch.map(t=>t*.6));for(let t of[1,-1]){let i=_.ext([[-3.8,-1.4],[2.6,-9.6],[.6,-10.2],[-7.6,-2.6]],.5,.18);sn(i,null,[Math.PI/2,0,0]),t<0&&(i=sn(i,null,null,[1,1,-1])),n.add("body","paint",w(i,0,7.4,0,[t*-.42,0,0]),tn.hullL),n.add("body","glow",w(_.box(.3,.25,7.2),-.8,7.4+2.4,t*5.5,[t*-.42,t*.62,0]),ju),n.add("body","paint",w(_.ext([[-9,8.4],[-6,8.8],[-7.6,13.6],[-9.4,14]],.45,.14),0,0,t*1.6,[t*.35,0,0]),tn.hullL),n.add("body","paint",w(_.box(2.6,1,.5,.15),-8.4,13.2,t*2.9,[t*.35,0,0]),tn.red),n.add("body","metal",w(_.cyl(.25,.25,3.2,6),9,6.6,t*1.2,[0,0,-Math.PI/2]),tn.metal),n.add("body","metal",w(_.box(3.2,1.4,1.2,.3),3.2,7.2,t*2.1),tn.hullD)}return n.add("body","metal",w(_.cyl(1.7,1.4,1.6,12),-9.2,8,0,[0,0,Math.PI/2]),tn.hullD),n.add("body","glow",w(_.cyl(1.3,1.3,.1,12),-10.05,8,0,[0,0,Math.PI/2]),ch),n.add("flame","glow",w(_.lathe([[1.2,0],[.9,-2.2],[.4,-4],[.02,-5.2]],10),-10,8,0,[0,0,-Math.PI/2]),Je("#ff6a3a",2.6)),n.build()}function u2(n,e,t,i,s){let r=jn(t,i);n.root.rotation.y=Xn(e,r,s,4);let o=e.py!=null&&s>0?(t.y-e.py)/s:0;e.py=t.y,e.bank=yt(e.bank||0,Ct(o/100,-1,1),5,s),n.body.rotation.set(e.bank*.6,0,-e.bank*.12);let a=.85+.15*Math.sin(e.time*47);n.flame.scale.set(a,1,1)}function f2(){let n=new _t;n.bone("aim","root",0,8,0).bone("roll","aim",0,8,0).bone("flame","roll",-6.1,8,0),n.add("roll","paint",w(_.sph(4.5,16,12),0,8,0),tn.hull),n.add("roll","paint",w(_.torus(4.55,.4,5,20),0,8,0,[0,Math.PI/2,0]),tn.red),n.add("roll","paint",w(_.torus(4.2,.3,5,20),-2.2,8,0,[0,Math.PI/2,0]),tn.stripe),n.add("roll","metal",w(_.cyl(1.7,2.6,1.8,12),4.6,8,0,[0,0,-Math.PI/2]),tn.hullD),n.add("roll","core",w(_.sph(1.2,10,8),5.6,8,0),ju);for(let e=0;e<6;e++){let t=e/6*Ve;n.add("roll","metal",Ua(w(_.cone(.5,2,6),0,1,0),[.35,Math.cos(t),Math.sin(t)],[.8,8+Math.cos(t)*4,Math.sin(t)*4]),tn.metal)}for(let e=0;e<4;e++){let t=_.ext([[-3,0],[-7.4,3.6],[-7.8,3.6],[-6.4,0]],.4,.12);n.add("roll","paint",w(t,0,8,0,[e*Math.PI/2+Math.PI/4,0,0]),tn.hullL)}return n.add("roll","metal",w(_.cyl(1.3,1.6,1.6,10),-5.2,8,0,[0,0,Math.PI/2]),tn.metal),n.add("roll","glow",w(_.cyl(1.1,1.1,.1,10),-6.05,8,0,[0,0,Math.PI/2]),ch),n.add("flame","glow",w(_.lathe([[1,0],[.7,-1.8],[.02,-3.6]],8),-6.1,8,0,[0,0,-Math.PI/2]),Je("#ff7a3a",2.4)),n.scaleAll(1.12,0,8,0),n.build()}function d2(n,e,t,i,s,r){let o=Ts(t,i),a=Math.cos(o)>=0;n.root.rotation.y=Xn(e,a?1:-1,s,6);let l=a?o:Math.PI-o;l>Math.PI&&(l-=Ve),e.pitch=yt(e.pitch||0,l,7,s),n.aim.rotation.z=e.pitch,n.roll.rotation.x=e.time*3.2,n.flame.scale.set(.8+.2*Math.sin(e.time*41),1,1),r.fx.pulse(r.byMat.core,.6+.8*(e.time*4%1<.5?1:.2))}function p2(){let n=new _t;n.bone("body","root",0,3,0).bone("jaw","body",5.2,13.6,0),n.add("root","paint",w(_.box(18,3,12,.6,2),0,1.5,0),ct.ironL),n.add("root","paint",w(_.box(18.4,.6,12.4,.2),0,2.9,0),ct.brass);let e=_.ext([[-5.2,3],[4.2,3],[5.4,8],[4.8,12.2],[2.2,15.4],[-2.6,16],[-5.4,12]],9.6,.8,{steps:3});Cn(e,t=>{t.x-=.03*t.z*t.z},!0),n.add("body","paint",e,ct.iron),n.add("body","paint",w(_.ext([[-1.2,12.8],[5.6,13],[6.6,16.4],[4.2,19.6],[-.4,19.9],[-2.6,17.2]],7.2,.6,{steps:2}),0,0,0),ct.ironL),n.add("body","paint",w(_.ext([[-3,17.6],[0,20.4],[3.4,20],[4.6,18.8],[.4,19]],4,.4),0,0,0),ct.rust),n.add("body","metal",w(_.box(.9,1.6,4.6,.2),6.3,15.4,0),"#1a1716");for(let t=0;t<3;t++)n.add("body","core",w(_.box(.3,.28,3.8),6.75,14.9+t*.5,0),pr);for(let t of[1,-1])n.add("body","core",w(_.box(.3,.4,.9),6.2,17.4,t*1.5,[0,0,-.2]),hh),n.add("body","paint",w(_.ext([[-4.6,9.5],[1.6,10.2],[3.6,13.6],[.6,16],[-4.2,14.6]],2.2,.5),0,0,t*5.4),ct.ironL),n.add("body","paint",w(_.ext([[-3.6,13.6],[.4,14.8],[-.2,15.4],[-3.8,14.6]],2.3,.2),0,0,t*5.4),ct.brass),n.add("body","paint",at([1,10.6,t*5.6],[4.8,7.8,t*5.8],[6.8,4.6,t*5],1.5,1.2),ct.iron),n.add("body","paint",w(_.box(3,2.2,2.6,.5),7.2,4.2,t*4.6),ct.ironL),n.add("body","core",w(_.box(1.8,.25,.2),-1,6+1.4,t*4.85),pr.map(i=>i*.6)),n.add("body","core",w(_.box(1.8,.25,.2),-1,6,t*4.85),pr.map(i=>i*.6));return n.add("body","paint",w(_.torus(3.6,.5,6,18),1.6,13.6,0,[Math.PI/2,0,.35]),ct.brass),n.add("jaw","paint",w(_.ext([[4,13.8],[6.8,14.1],[6.6,12.4],[4.6,12]],4.6,.3),0,0,0),ct.ironL),n.build()}function m2(n,e,t,i,s,r){n.root.rotation.y=Xn(e,jn(t,i),s,3),dr(e,t,s);let o=i.player,l=(o?Math.abs(o.x-t.x):999)<190?1:0;e.heat=yt(e.heat||0,l?Math.max(e.charge,.35):.1,4,s),n.jaw.rotation.z=-.5*Math.max(e.kick,e.heat>.6?e.heat-.6:0),n.body.rotation.z=-.04*e.kick;let c=.85+.15*Math.sin(e.time*23)*Math.sin(e.time*7.1);r.fx.pulse(r.byMat.core,(.55+e.heat*1.6+e.kick*1.5)*c)}function g2(){let n=new _t;n.bone("body","root",0,13,0);for(let[e,t]of[["N",2.7],["F",-2.7]])n.bone("l"+e,"body",0,11.2,t).bone("l"+e+"k","l"+e,3,6.6,t).bone("l"+e+"f","l"+e+"k",-1.2,1.6,t);n.add("body","paint",w(_.box(12,7,8,1.2,2),.4,15,0),ct.steel);for(let e=0;e<5;e++)n.add("body","paint",w(_.box(1.1,2,.2),-4.2+e*2.2,13.2,4.05,[0,0,.55]),e%2?"#1a1716":ct.hazard);for(let e of[1,-1])n.add("body","paint",w(_.box(11.4,.5,.2),.4,14.5,e*4.08),ct.hazard);n.add("body","metal",w(_.cyl(.9,1,3.6,10),-3.4,19.6,-1.6),ct.ironL),n.add("body","core",w(_.cyl(.65,.65,.2,10),-3.4,21.45,-1.6),pr.map(e=>e*.7));for(let e of[12.6,14.6])n.add("body","metal",w(_.cyl(.8,.8,7.6,10),6.6,e,0,[Math.PI/2,0,0]),ct.steelL);n.add("body","paint",w(_.box(4.2,3.2,5,.6),6.4,17.2,0),ct.iron),n.add("body","metal",w(_.torus(1.2,.3,5,14),8.55,17.4,0,[0,Math.PI/2,0]),ct.brass),n.add("body","core",w(_.cyl(.95,.95,.3,12),8.6,17.4,0,[0,0,-Math.PI/2]),hh),n.add("body","suit",at([-5.6,16.6,2],[-7.6,15,3],[-6.2,12,3.6],.35,.3,8,4),"#1a1716"),n.add("body","metal",w(_.box(1.2,3.6,1.2,.2),3.4,10.6,0),ct.ironL),n.add("body","metal",at([3.4,9,0],[5.4,8,0],[6.4,9,0],.32,.2,6,4),ct.steelL);for(let[e,t]of[["N",2.7],["F",-2.7]])n.add("l"+e,"paint",w(_.sph(1.6,10,8),0,11.2,t),ct.ironL),n.add("l"+e,"paint",at([0,11.2,t],[1.8,9.2,t],[3,6.6,t],1.15,.9),ct.steel),n.add("l"+e,"metal",at([.6,11.6,t+Math.sign(t)*1],[2,9.4,t+Math.sign(t)*1],[3.3,7.2,t+Math.sign(t)*1],.28,.28,6,4),ct.steelL),n.add("l"+e+"k","paint",w(_.sph(1,8,6),3,6.6,t),ct.iron),n.add("l"+e+"k","paint",at([3,6.6,t],[1,4.2,t],[-1.2,1.6,t],.85,.6),ct.ironL),n.add("l"+e+"f","paint",w(_.ext([[-2.4,0],[3.2,0],[3.6,.7],[.4,1.7],[-1.8,1.6]],2.2,.3),0,0,t),ct.iron),n.add("l"+e+"f","paint",w(_.box(1,.5,2.3,.15),3,.45,t),ct.hazard);return n.build()}function x2(n,e,t,i,s){n.root.rotation.y=Xn(e,t.facing||-1,s,8),e.phase+=Math.abs(t.vx||0)*s/22*Ve;let r=e.phase;for(let[o,a]of[["N",0],["F",Math.PI]]){let l=r+a;n["l"+o].rotation.z=.42*Math.sin(l),n["l"+o+"k"].rotation.z=-.35*Math.max(0,Math.cos(l))-.05,n["l"+o+"f"].rotation.z=-.42*Math.sin(l)+.35*Math.max(0,Math.cos(l))}n.body.position.y=13+.5*Math.abs(Math.cos(r))-.4+.08*Math.sin(e.time*9),n.body.rotation.z=.04*Math.sin(r*2)}function v2(){let n=new _t;n.bone("spin","root",0,9,0),n.add("spin","paint",w(_.cyl(6.6,6.6,4.6,6),0,9,0,[Math.PI/2,0,0]),ct.ironL),n.add("spin","metal",w(_.cyl(6,6.6,.6,6),0,9,2.6,[Math.PI/2,0,0]),ct.steel),n.add("spin","metal",w(_.cyl(6.6,6,.6,6),0,9,-2.6,[Math.PI/2,0,0]),ct.steel);for(let e=0;e<10;e++){let t=e/10*Ve,i=_.ext([[0,-1.3],[2.6,-.2],[2.2,.9],[0,1.1]],2.2,.2);n.add("spin","metal",w(i,Math.cos(t)*6.3,9+Math.sin(t)*6.3,0,[0,0,t]),ct.steelL)}return n.add("spin","metal",w(_.cyl(2.4,2.4,9.6,12),0,9,0,[Math.PI/2,0,0]),ct.steelL),n.add("spin","metal",w(_.cyl(3.6,3.6,1.4,6),0,9,4.6,[Math.PI/2,0,0]),ct.steel),n.add("spin","core",w(_.torus(4.4,.42,5,6),0,9,2.95,[0,0,Math.PI/6]),pr),n.add("spin","core",w(_.torus(4.4,.42,5,6),0,9,-2.95,[0,0,Math.PI/6]),pr),n.build()}function y2(n,e,t,i,s,r){n.spin.rotation.set(.1*Math.sin(e.time*2),.12*Math.sin(e.time*1.3),-e.time*9),r.fx.pulse(r.byMat.core,.8+.25*Math.sin(e.time*13))}function _2(){let n=new _t;n.bone("body","root",0,9,0).bone("rN","body",-1,11.6,5.6).bone("rF","body",-1,11.6,-5.6).bone("arc0","body",4,5.4,1.5).bone("arc1","body",4,5.4,-1.5),n.add("body","paint",w(_.capsule(2.8,6.6,4,12),0,9.4,0,[0,0,Math.PI/2]),ct.steel),n.add("body","paint",w(_.cyl(2.9,2.9,1.2,12),-1,9.4,0,[0,0,Math.PI/2]),ct.hazard);for(let e=0;e<4;e++)n.add("body","paint",w(_.box(.4,1.3,6),-1.6+e*.4,9.4,0,[0,0,0]),e%2?"#1a1716":ct.hazard);n.add("body","core",w(_.sph(1.1,10,8),5.9,9.8,0),hh),n.add("body","metal",w(_.torus(1.2,.25,5,12),5.6,9.8,0,[0,Math.PI/2,0]),ct.iron);for(let[e,t]of[["rN",1],["rF",-1]])n.add("body","paint",at([-.5,10.6,t*2.4],[-.8,11.4,t*4],[-1,11.6,t*5],.5,.4,6,5),ct.ironL),n.add("body","paint",w(_.torus(3,.55,6,20),-1,11.6,t*5.6,[Math.PI/2,0,0]),ct.iron),n.add(e,"metal",w(_.box(5.6,.14,.7),-1,11.6,t*5.6),ct.steelL),n.add(e,"metal",w(_.box(.7,.14,5.6),-1,11.6,t*5.6),ct.steelL),n.add(e,"metal",w(_.cyl(.5,.5,.6,8),-1,11.6,t*5.6),ct.brass);for(let[e,t]of[["arc0",1.5],["arc1",-1.5]]){n.add("body","metal",at([3,7.6,t],[4.2,6,t],[5.6,4.6,t],.4,.28,6,4),ct.steelL);for(let s=0;s<3;s++)n.add("body","metal",w(_.torus(.5,.18,4,10),3.6+s*.6,6.8-s*.6,t,[0,0,.8]),"#b06a2a");let i=[[5.6,4.6,t],[6.6,3.6,t*.6],[5.9,2.6,t*.2],[6.9,1.6,-t*.2]];n.add(e,"glow",_.tube(i,.16,8,4),Je("#bfe8ff",4.5))}return n.add("body","suit",at([-3,6.8,0],[-4.4,4.6,.6],[-3.6,3.2,1],.3,.2,8,4),"#1a1716"),n.scaleAll(1.25,0,8,0),n.build()}function M2(n,e,t,i,s){n.root.rotation.y=Xn(e,jn(t,i),s,5),n.rN.rotation.y=e.time*40,n.rF.rotation.y=-e.time*40,n.body.rotation.set(.08*Math.sin(e.time*1.7),0,.08*Math.sin(e.time*2.3));let r=l=>{let c=Math.sin(Math.floor(e.time*24)*12.9898+l*78.2)*43758.5;return c-Math.floor(c)},o=r(1)>.35?1:1e-4,a=r(2)>.35?1:1e-4;n.arc0.scale.set(1,o*(.7+.3*r(3)),o),n.arc1.scale.set(1,a*(.7+.3*r(4)),a)}function b2(){let n=new _t;n.bone("drum","root",0,4,0).bone("hL","drum",-6,18.6,0).bone("hR","drum",6,18.6,0);let e=[[.6,1],[Math.PI-.6,1],[-Math.PI/2,1]];e.forEach(([t],i)=>{let s=Math.cos(t)*8.6,r=Math.sin(t)*8.6;n.bone("a"+i,"drum",s,14,r).bone("a"+i+"k","a"+i,s*1.45,20,r*1.45)}),n.add("root","paint",w(_.cyl(12.6,13.6,4,12),0,2,0),ct.ironL);for(let t=0;t<12;t++){let i=t/12*Ve;n.add("root","paint",w(_.box(2.2,3.4,.3),Math.cos(i)*13.3,2,Math.sin(i)*13.3,[0,-i+Math.PI/2,.5]),t%2?"#1a1716":ct.hazard)}n.add("drum","paint",w(_.cyl(8.4,9.4,14,16),0,11,0),ct.steel);for(let t of[5.2,11,16.6])n.add("drum","metal",w(_.torus(9-(t-5)*.06,.4,5,24),0,t,0,[Math.PI/2,0,0]),ct.iron);for(let t=0;t<6;t++){let i=t/6*Ve+.3;n.add("drum","core",w(_.box(.3,3.2,1.2),Math.cos(i)*9,8.2,Math.sin(i)*9,[0,-i,0]),pr)}n.add("drum","metal",w(_.cyl(7.6,8.4,1.4,16),0,18.6,0),ct.ironL),n.add("drum","core",w(_.cyl(5.6,5.6,.4,16),0,18.9,0),hh);for(let[t,i]of[["hL",-1],["hR",1]])n.add(t,"paint",w(_.box(6,1,11.6,.3),i*3,19.8,0),ct.ironL),n.add(t,"paint",w(_.box(5.4,.3,1),i*3,20.4,0),ct.hazard);return e.forEach(([t],i)=>{let s=Math.cos(t)*8.6,r=Math.sin(t)*8.6,o=s*1.45,a=r*1.45;n.add("a"+i,"paint",w(_.sph(1.6,10,8),s,14,r),ct.ironL),n.add("a"+i,"paint",at([s,14,r],[s*1.3,17.6,r*1.3],[o,20,a],1,.8),ct.hazard),n.add("a"+i+"k","paint",w(_.sph(1,8,6),o,20,a),ct.iron),n.add("a"+i+"k","metal",at([o,20,a],[o*.9,23.2,a*.9],[o*.7,25.4,a*.7],.7,.5),ct.steelL);for(let l of[-.8,.8])n.add("a"+i+"k","metal",at([o*.7,25.4,a*.7],[o*.65+l,26.8,a*.65],[o*.55+l*.4,27.6,a*.55],.32,.12,6,4),ct.iron)}),n.build()}function Bp(n,e,t){let i=e.spawnT!=null?e.spawnT:t;n.lastSp!=null&&i>n.lastSp+.2&&(n.burst=1),n.lastSp=i,n.burst=Math.max(0,(n.burst||0)-1/60*1.6),n.antic=i<.6?1-i/.6:0}function S2(n,e,t,i,s,r){Bp(e,t,2.4);let o=Math.max(e.antic,e.burst);e.open=yt(e.open||0,o,10,s),n.hL.rotation.z=e.open*1.2,n.hR.rotation.z=-e.open*1.2;for(let a=0;a<3;a++){let l=Math.sin(e.time*1.6+a*2.1);n["a"+a].rotation.set(.25*l*(a===2?1:0),.3*l,a===2?0:(a?-1:1)*(.15*l-.35*e.open)),n["a"+a+"k"].rotation.z=.4*Math.sin(e.time*2.2+a)*(a===2?0:1),n["a"+a+"k"].rotation.x=a===2?.4*Math.sin(e.time*2.2)-.4*e.open:0}n.drum.scale.set(1+e.burst*.04,1-e.burst*.03,1+e.burst*.04),r.fx.pulse(r.byMat.core,.6+e.open*1.6+.1*Math.sin(e.time*5))}function w2(){let n=new _t;n.bone("body","root",0,4.4,0),n.add("body","flesh",w(hn(5,2,3.8,7,.12),0,3.9,0),Ot.flesh),n.add("body","crystal",w(_.shell(5.5,3.2,4.4,.4,0,Ve,0,1.55,12,5),-.4,4.4,0),Ot.crys),jt(n,"body",[[-.4,6.8,0,.9,3.6,0,.35,3],[-2.8,6.4,.8,.7,2.8,.3,.6,5],[1.8,6.6,-.6,.6,2.4,-.3,-.2,7],[-4.4,5.6,-1,.5,2,-.3,.9,9]],Ot.crysL);for(let t of[1,-1])n.add("body","glow",w(_.box(3.4,.25,.2),-.6,2.9,t*3.55),As),n.add("body","glow",w(_.sph(.42,6,4),5.2,4.6,t*1),Na),n.add("body","glow",w(_.sph(.3,6,4),4.8,5.3,t*1.7),Na),n.add("body","paint",at([5,3.6,t*1],[6.6,3.4,t*1.1],[7,2.6,t*.3],.34,.08,6,4),Ot.bone);let e=[2.6,0,-2.6];for(let t=0;t<6;t++){let i=t%2?-1:1,s=e[Math.floor(t/2)];oo(n,"l"+t,"body",[s,3.8,i*2.8],[s+.6,6,i*5.6],[s+1.4,.2,i*6.6],.5,"paint",Ot.chitin)}return n.build()}function E2(n,e,t,i,s){let r=Ia(t,.65),o=Math.abs(t.vx||0)>1?Math.sign(t.vx):jn(t,i);n.root.rotation.y=Xn(e,o,s,14);let a=Math.abs(t.vx||0);e.phase+=(a*.12+(r.ground?0:6)+2)*s*2.5;for(let l=0;l<6;l++){let c=l%2?-1:1,h=l===0||l===3||l===4,u=e.phase+(h?0:Math.PI),d=r.ground?0:.35;Da(n["l"+l],c,.4*Math.sin(u),.3*Math.max(0,Math.cos(u))+d-.3*r.crouch),n["l"+l+"k"].rotation.x=c*.4*r.crouch}n.body.position.y=4.4-1.6*r.crouch+.2*Math.abs(Math.sin(e.phase*2)),n.body.rotation.z=-.25*r.air}function T2(){let n=new _t;n.bone("body","root",0,10,0).bone("head","body",5.6,12,0);for(let[e,t]of[["N",1],["F",-1]])n.bone("h"+e,"body",-2.6,10.2,t*3).bone("h"+e+"k","h"+e,-6.4,15.4,t*4.4).bone("h"+e+"f","h"+e+"k",-4,2,t*5),n.bone("f"+e,"body",3.4,8.6,t*2.4).bone("f"+e+"k","f"+e,5,6,t*3.6);n.add("body","flesh",w(hn(6.2,3.6,3.7,11,.12),-.4,10.6,0,[0,0,.18]),Ot.flesh),n.add("body","flesh",w(_.ell(4.6,2.2,2.8,12,8),.6,8.6,0),Ot.fleshL),jt(n,"body",[[-3.6,12.6,0,1,5,0,.7,3],[-.8,13.8,.4,.95,5.4,.1,.4,5],[2,14.2,-.3,.75,4,-.1,.15,7],[-5.8,11.4,-.6,.6,3,-.2,1,9]],Ot.crys),n.add("body","glow",w(_.box(5,.22,.2),-.2,8.1,2.8,[0,0,.18]),As.map(e=>e*.55)),n.add("body","glow",w(_.box(5,.22,.2),-.2,8.1,-2.8,[0,0,.18]),As.map(e=>e*.55)),n.add("head","flesh",w(_.ell(2.9,2.4,2.4,12,8),6.6,12.4,0),"#6a3256"),n.add("head","crystal",w(_.crystal(.6,3.6,5,.45,13),6.4,14,0,[0,0,-.9]),Ot.crysL);for(let e of[1,-1])n.add("head","glow",w(_.ell(.7,.55,.45,8,6),8.4,13.2,e*1.4),Na),n.add("head","paint",at([8.6,11.4,e*1],[10,10.6,e*.9],[10.2,9.6,e*.2],.42,.08,6,4),Ot.bone);for(let[e,t]of[["N",1],["F",-1]])n.add("h"+e,"flesh",at([-2.6,10.2,t*3],[-3.6,13.6,t*3.9],[-6.4,15.4,t*4.4],1.9,1.1),Ot.fleshL),n.add("h"+e+"k","suit",w(_.sph(1,8,6),-6.4,15.4,t*4.4),Ot.chitin),n.add("h"+e+"k","paint",at([-6.4,15.4,t*4.4],[-5.8,8.6,t*4.8],[-4,2,t*5],.85,.45),Ot.chitin),n.add("h"+e+"k","crystal",w(_.crystal(.35,2,5,.5,21),-6.6,15.8,t*4.4,[0,0,.6]),Ot.crysL),n.add("h"+e+"f","paint",at([-4,2,t*5],[-2,.6,t*5],[.4,.3,t*5],.5,.15,6,4),Ot.bone),n.add("f"+e,"paint",at([3.4,8.6,t*2.4],[4.6,7.6,t*3.2],[5,6,t*3.6],.5,.4,6,4),Ot.chitin),n.add("f"+e+"k","paint",at([5,6,t*3.6],[5.6,3,t*3.8],[6,.3,t*3.9],.4,.12,6,4),Ot.bone);return n.build()}function A2(n,e,t,i,s){let r=Ia(t,1.2),o=Math.abs(t.vx||0)>1?Math.sign(t.vx):jn(t,i);n.root.rotation.y=Xn(e,o,s,9),e.cr=yt(e.cr||0,r.crouch,18,s),e.air=yt(e.air||0,r.air,12,s);let a=Math.max(0,-e.air),l=Math.max(0,e.air);n.body.position.y=10-3*e.cr+.15*Math.sin(e.time*3),n.body.rotation.z=.15*e.cr-.3*e.air;for(let c of["N","F"])n["h"+c].rotation.z=-.35*e.cr+.55*a-.2*l,n["h"+c+"k"].rotation.z=.5*e.cr-1.1*a+.3*l,n["h"+c+"f"].rotation.z=-.3*e.cr+.6*a,n["f"+c].rotation.z=.5*a-.3*l+.2*e.cr,n["f"+c+"k"].rotation.z=-.3*a;n.head.rotation.z=.1*Math.sin(e.time*2)-.15*e.cr}function R2(){let n=new _t;n.bone("sac","root",0,1,0).bone("core","sac",0,15,0);for(let t=0;t<5;t++){let i=t/5*Ve+.3;n.bone("p"+t,"sac",Math.cos(i)*5.4,9.5,Math.sin(i)*5.4)}for(let t=0;t<6;t++){let i=t/6*Ve;n.add("root","flesh",at([Math.cos(i)*3,2,Math.sin(i)*3],[Math.cos(i)*6,.8,Math.sin(i)*6],[Math.cos(i)*8.6,.3,Math.sin(i)*8],1,.25,6,5),Ot.fleshD)}jt(n,"root",[[-6.4,.4,3,.8,3.4,.4,.7,3],[6,.4,-2.6,.7,3,-.4,-.6,5],[3.6,.3,4.4,.5,2,.6,-.3,7]],Ot.crys);let e=hn(6.4,7.6,6.4,17,.08);Cn(e,t=>{if(t.y>0){let i=1-.28*(t.y/7.6);t.x*=i,t.z*=i}},"smooth"),n.add("sac","flesh",w(e,0,8.4,0),"#6a3a5a");for(let t=0;t<5;t++){let i=t/5*Ve+.9,s=[];for(let r=0;r<=4;r++){let o=r/4,a=1.6+o*12.6,l=(Math.sin(o*Math.PI)*.35+.72)*6.4*(a>8.4?1-.28*((a-8.4)/7.6):1)+.15;s.push([Math.cos(i+o*.5)*l,a,Math.sin(i+o*.5)*l])}n.add("sac","core",_.tube(s,.16,10,4),As.map(r=>r*.4))}n.add("core","core",w(_.sph(2.6,12,10),0,15.2,0),As.map(t=>t*.9));for(let t=0;t<5;t++){let i=t/5*Ve+.3,s=Math.cos(i)*5.4,r=Math.sin(i)*5.4,o=_.shard(2.7,13,5,30+t,.1);sn(o,null,[0,-i+Math.PI/2,0],[1,1,.5]),o.applyMatrix4(C2(s,r,i)),n.add("p"+t,"crystal",o,Ot.crys)}return n.build()}function C2(n,e,t){let i=new ot,s=new ot().makeRotationAxis(new k(-Math.sin(t),0,Math.cos(t)),.5),r=new ot().makeTranslation(0,6,0),o=new ot().makeTranslation(n,9.5,e);return i.multiply(o).multiply(s).multiply(r),i}function P2(n,e,t,i,s,r){let o=i.player,a=t.cfg&&t.cfg.hatchDist||90,l=o?Math.abs(o.x+o.w/2-(t.x+t.w/2)):999,h=(o?Math.abs(o.y-t.y):999)<80?si((a*2.3-l)/(a*1.3)):0;e.open=yt(e.open||0,h,5,s);let u=Math.pow(.5+.5*Math.sin(e.time*(2.6+e.open*6)),3);n.sac.scale.set(1+u*.04,1+u*.03,1+u*.04);for(let d=0;d<5;d++){let f=d/5*Ve+.3,g=e.open*.05*Math.sin(e.time*30+d*2),x=-(e.open*.85+g);n["p"+d].quaternion.setFromAxisAngle(new k(-Math.sin(f),0,Math.cos(f)),x)}n.core.scale.setScalar(.85+.25*e.open+.1*u),r.fx.pulse(r.byMat.core,.45+.35*u+1.3*e.open)}function I2(){let n=new _t;n.bone("stalk","root",0,3.4,0).bone("maw","stalk",0,12,0);for(let e=0;e<3;e++){let t=e/3*Ve+.5;n.bone("j"+e,"maw",Math.cos(t)*3.2,15.4,Math.sin(t)*3.2)}n.add("root","flesh",w(hn(7.2,3,6.2,23,.15),0,1.4,0),Ot.fleshD),jt(n,"root",[[-5.6,1.2,2.4,1.1,5,.35,.6,3],[5.2,1,-2.8,.9,4.2,-.4,-.6,5],[4,.8,3.6,.7,3,.6,-.4,7],[-3.4,.8,-4,.6,2.6,-.6,.4,9]],Ot.crys),n.add("stalk","flesh",_.taperTube([[0,2.6,0],[.9,7.6,0],[0,12.2,0]],e=>Wn(3,2.2,e),8,10),"#6a3256");for(let e of[5.2,7.6,10])n.add("stalk","paint",w(_.torus(2.75-(e-5)*.08,.36,5,14),.5,e,0,[Math.PI/2,0,0]),Ot.bone);n.add("stalk","core",_.tube([[1.8,3,2],[2.6,7,1.4],[1.6,11.6,1.6]],.2,8,4),As.map(e=>e*.7)),n.add("maw","flesh",w(_.ell(4.2,3,4.2,14,10),0,13.6,0),Ot.fleshL),n.add("maw","core",w(_.cyl(2.2,2.6,.4,14),0,16.3,0),Na);for(let e=0;e<8;e++){let t=e/8*Ve;n.add("maw","crystal",w(_.crystal(.38,2,5,.5,40+e),Math.cos(t)*2.5,15.8,Math.sin(t)*2.5,[Math.sin(t)*-.5,0,Math.cos(t)*.5]),"#d8c0ff")}for(let e=0;e<3;e++){let t=e/3*Ve+.5,i=_.shell(4.6,3.2,4.6,.6,t-.95,t+.95,.15,1.1,8,4);n.add("j"+e,"flesh",w(i,0,14.4,0),Ot.flesh)}return n.build()}function D2(n,e,t,i,s,r){dr(e,t,s,2.1);let o=jn(t,i);e.lean=yt(e.lean||0,o*.14,3,s),n.stalk.rotation.set(.04*Math.sin(e.time*1.3),0,-e.lean+.05*Math.sin(e.time*1.7)-e.kick*.1*o);let a=e.charge*.16-e.kick*.2;n.maw.scale.set(1+a*.5,1-a,1+a*.5);for(let l=0;l<3;l++){let c=l/3*Ve+.5,h=.15+.6*e.kick-.25*e.charge+.06*Math.sin(e.time*2+l);n["j"+l].quaternion.setFromAxisAngle(new k(-Math.sin(c),0,Math.cos(c)),-h)}r.fx.pulse(r.byMat.core,.6+e.charge*1.2+e.kick*1.8+.12*Math.sin(e.time*4))}function L2(){let n=new _t;n.bone("mass","root",0,0,0);for(let e=0;e<3;e++)n.bone("o"+e,"mass",[-5,4.5,.5][e],[9,7,15][e],[6.4,6.6,7.4][e]);n.add("mass","flesh",w(hn(12.4,9.4,9.6,31,.16,18,12),0,8.4,0),"#4a2240"),n.add("mass","flesh",w(hn(6,4.6,5,32,.2),-8.4,4.4,3.6),Ot.flesh),n.add("mass","flesh",w(hn(5.4,4,4.6,33,.2),8.6,4,-2.4),Ot.flesh),jt(n,"mass",[[-2,14,-2.6,2,12.6,-.15,.12,3],[4.6,13,-3.6,1.5,9,-.25,-.3,5],[-7,11.6,-1.6,1.2,6.4,-.1,.55,7],[8.6,9.6,1.6,1,5,.3,-.7,9],[1.6,15.4,2.6,.9,4.2,.4,-.2,11],[-10.6,6,-3,.8,3.6,-.4,.9,13]],Ot.crys);for(let e=0;e<3;e++){let t=[-5,4.5,.5][e],i=[9,7,15][e],s=[6.4,6.6,7.4][e],r=[.35,.4,-.1][e];n.add("o"+e,"flesh",w(_.torus(1.9,.75,6,14),t,i,s,[r,0,t*.03]),Ot.fleshL),n.add("o"+e,"core",w(_.cyl(1.5,1.5,.3,12),t,i,s-.3,[Math.PI/2+r,0,t*.03]),Na)}for(let e=0;e<4;e++){let t=-4+e*2.6;n.add("mass","paint",at([-11.4,2,t],[-6+e,18.6-Math.abs(e-1.5),t*1.1],[10.8,3,t*.9],.55,.45,12,5),Ot.bone)}for(let e=0;e<5;e++){let t=e*1.25;n.add("mass","core",_.tube([[Math.cos(t)*11,3,Math.sin(t)*8.5],[Math.cos(t+.3)*9.6,9.6,Math.sin(t+.3)*8.6],[Math.cos(t+.5)*5.6,15.6,Math.sin(t+.5)*5.4]],.24,10,4),As.map(i=>i*.6))}return n.build()}function U2(n,e,t,i,s,r){Bp(e,t,2.4);let o=Math.sin(e.time*1.8),a=e.burst,l=e.antic;n.mass.scale.set(1+.025*o+.06*a+.03*l,1-.02*o+.05*a,1+.025*o+.06*a);for(let c=0;c<3;c++){let h=1+.25*l*Math.sin(e.time*20+c)+.35*a;n["o"+c].scale.set(h,h,1)}r.fx.pulse(r.byMat.core,.55+.25*(.5+.5*o)+1.2*l+1.8*a)}function N2(){let n=new _t;n.bone("body","root",0,8,0).bone("ring","body",0,8,0);let e=_.oct(3.4);sn(e,[0,8,0],null,[1,1.45,1]),n.add("body","crystal",e,Ot.crysL),n.add("body","core",w(_.oct(1.5),0,8,0,null,[1,1.4,1]),Je("#c8a0ff",3.4)),n.add("ring","paint",w(_.torus(5.6,.7,6,24),0,8,0),"#2a2430"),n.add("ring","glow",w(_.torus(5.6,.22,4,24),0,8,.66),As.map(t=>t*.8));for(let t=0;t<3;t++){let i=t/3*Ve;n.add("ring","crystal",w(_.shard(1,5.2,5,50+t),Math.cos(i)*7.8,8+Math.sin(i)*7.8,0,[0,0,i-Math.PI/2]),Ot.crys)}return n.build()}function F2(n,e,t,i,s,r){n.root.rotation.y=Xn(e,jn(t,i),s,4),n.ring.rotation.z=e.time*2.4,n.body.rotation.y=Math.sin(e.time*1.3)*.4,r.fx.pulse(r.byMat.core,.8+.3*Math.sin(e.time*6))}var Hp={walltur:{type:"turret",build:l2,pose:c2},interceptor:{type:"flyer",build:h2,pose:u2},seeker:{type:"drifter",build:f2,pose:d2},statue:{type:"turret",build:p2,pose:m2},beltdrone:{type:"walker",build:g2,pose:x2},boltspin:{type:"spinner",build:v2,pose:y2},arcdrone:{type:"flyer",build:_2,pose:M2},armhub:{type:"spawner",build:b2,pose:S2},hugger:{type:"hugger",build:w2,pose:E2},leaper:{type:"hopper",build:T2,pose:A2},eggpod:{type:"egg",build:R2,pose:P2},acidmaw:{type:"turret",build:I2,pose:D2},hivenode:{type:"spawner",build:L2,pose:U2},shardling:{type:"flyer",build:N2,pose:F2}};var k2=Object.assign({},zp,Hp),O2={turret:"walltur",walker:"beltdrone",flyer:"shardling",hopper:"rockmite",spawner:"armhub",drifter:"seeker",eel:"eel",spinner:"boltspin",egg:"eggpod",hugger:"hugger"};function z2(n){return(e,t)=>{let i={time:Math.random()*4,yaw:t&&t.facing>0?0:-Math.PI,phase:Math.random()*Ve,pitch:0,flash:0,frost:0};return{st:i,update(s,r,o){s=s||{},r=r||{};let a=Up(i,e,s,r,o||0);n.pose(e.bones,i,s,r,a,e),Np(i,e)}}}}var lo={};for(let[n,e]of Object.entries(k2))lo[n]={type:e.type,build:e.build,animator:z2(e)};function Vp(n){return n&&n.skin&&lo[n.skin]?n.skin:O2[n&&n.type||"walker"]||"beltdrone"}var B2={shockwave:.5,lob:.6,volley:.6,dash:1.1,spawn:.7,barrage:1.4,beam:1.3};function H2(n){let e=n.cfg;return e?e.phases?e.phases[Math.min(n.phase||0,e.phases.length-1)].attacks:e.attacks:null}function Gp(n,e,t,i,s,r=3){i=Math.min(i||0,.05);let o=!!(t&&t.freeze>0),a=o?0:i;n.time+=a;let l=(e.state||"idle")+":"+(e.attack?e.attack.kind:"")+":"+(e.ai||0);l!==n.key&&(n.key=l,n.sT=0,e.state==="attack"&&(n.kick=1)),n.sT+=a;let c=H2(e);n.next=c&&c.length?c[(e.ai||0)%c.length].kind:n.defaultNext||"volley";let h=e.cfg&&e.cfg.tele||.7;n.tele=e.state==="tele"?Ct(e.stateT!=null&&e.cfg?1-e.stateT/h:n.sT/h,0,1):0,n.teleS=yt(n.teleS||0,n.tele,14,i),n.kind=e.state==="attack"&&e.attack?e.attack.kind:null;let u=n.kind?e.attack.dur||B2[n.kind]||.5:1;n.ap=n.kind?Ct(n.sT/u,0,1):0,n.kick=Math.max(0,(n.kick||0)-a*4),n.atk=yt(n.atk||0,n.kind?1:0,16,i),n.open=yt(n.open||0,e.open&&!e.dying?1:0,7,i),n.phaseS=yt(n.phaseS||0,e.phase||0,2.5,i),n.die=e.dying?Ct(1-(e.deathT!=null?e.deathT:0)/2.2,0,1):0,n.flash=e.hitFlash>0?Math.min(1,e.hitFlash*12)*.5:0,n.frost=o?Math.min(1,t.freeze*2):0;let d=n.px!=null&&i>0?(e.x-n.px)/i:0;n.px=e.x,n.vx=yt(n.vx||0,d,8,i),e.dying||(n.dir=jn(e,t)),n.yaw=yt(n.yaw,(n.dir||-1)>=0?0:-Math.PI,r,a);let f=Ts(e,t,.42),g=(n.dir||-1)>0?f:Math.PI-f;return g>Math.PI&&(g-=Ve),n.aim=yt(n.aim||0,Ct(g,-1.2,1.2),6,a),a}function Rs(n,e,t){let i=t.phase||0;if(n.cracks1&&n.cracks1.scale.setScalar(i>=1||t.dying?1:1e-4),n.cracks2&&n.cracks2.scale.setScalar(i>=2||t.dying?1:1e-4),n.spark){let s=Math.sin(Math.floor(e.time*18)*91.7)*43758.5,r=s-Math.floor(s);n.spark.scale.setScalar(i>=1&&r>.45?.6+r:1e-4),n.spark.rotation.set(r*6,r*3,r*9)}}function Cs(n,e,t,i,s){(t.phase||0)>=2||t.dying?e.shedT=(e.shedT||0)+s:e.shedT=0;let r=e.shedT||0;i.forEach((o,a)=>{let l=n[o];if(!l)return;let c=l.userData.rest;if(r<=0){l.position.copy(c),l.rotation.set(0,0,0),l.scale.setScalar(1);return}let h=r*(1+a*.15);l.position.set(c.x-h*6*(a%2?1:-1),c.y-70*h*h,c.z+(c.z>=0?1:-1)*18*h),l.rotation.set(h*2.2*(a%2?1:-1),0,h*3.1),l.scale.setScalar(h>.75?1e-4:1)})}function Ps(n,e,t,i=1,s=46){let r=e.die;if(r<=0)return;if(!e.brk){let l=io(i);e.brk=t.map(()=>[l()*2-1,l()*.9+.2,l()*2-1,l()*6-3,l()*6-3,l()*6-3])}let o=Math.max(0,r-.25)/.75,a=o*o;t.forEach((l,c)=>{let h=n[l];if(!h)return;let u=e.brk[c],d=h.userData.rest;h.position.set(d.x+u[0]*s*a,d.y+u[1]*s*.8*a-60*a*a,d.z+u[2]*s*a*.6),h.rotation.set(u[3]*a,u[4]*a,u[5]*a)})}function Is(n,e){let t=n.time;return[Math.sin(t*61)*e,Math.sin(t*53+1)*e*.7,Math.sin(t*47+2)*e*.5]}var Ds=(n,e,t,i,s,r,o,a)=>{let l=[];for(let c=0;c<=r;c++){let h=c/r,u=Math.sin(a*13.7+c*7.3)*o;l.push([n+(t-n)*h+u*.4,e+(i-e)*h+u,s])}return l},co=Je("#ff8a2a",3),dt={rock:ur("#6e4030","#3a2218",2.4,"#8a6048"),rockD:ur("#4e2c20","#2e1a12",2,"#6a4430"),rockL:ur("#7e5038","#4a2c1e",2.6,"#9a7058"),frame:"#34302c",frameL:"#56504a",head:"#46403c",crys:"#4f97ff"};function V2(){let n=new _t(.038461538461538464);n.bone("pelvis","root",0,30,0).bone("torso","pelvis",0,36,0).bone("head","torso",12,58,0).bone("core","torso",9,46,0).bone("sN","torso",9,46,13.6).bone("sF","torso",9,46,-13.6).bone("pods","torso",-11,60,0).bone("armN","torso",2,55,16).bone("forN","armN",8,40,19).bone("armF","torso",2,55,-16).bone("forF","armF",8,40,-19).bone("plate0","torso",-6,53,11.8).bone("plate1","torso",-6,53,-11.8).bone("plate2","torso",0,64,0).bone("cracks1","torso",0,46,0).bone("cracks2","torso",0,46,0).bone("spark","torso",6,50,0);for(let[e,t]of[["N",1],["F",-1]])n.bone("th"+e,"pelvis",-1,30,t*9).bone("sh"+e,"th"+e,5,16,t*10).bone("ft"+e,"sh"+e,0,4,t*10);n.add("pelvis","metal",w(_.box(18,9,17,1.5,2),-1,30,0),dt.frame),n.add("pelvis","suit",w(kt(5,3,.25,1,1.2,.8,1.1),7,28,0),dt.rockD);for(let e of[1,-1])n.add("pelvis","metal",w(_.cyl(4.2,4.2,4,14),-1,30,e*9.5,[Math.PI/2,0,0]),dt.frameL);n.add("torso","metal",_.ext([[-15,34],[13,36],[18,45],[16,57],[7,64],[-9,63],[-16,52]],22,2,{steps:2}),dt.frame),n.add("torso","suit",w(kt(9,5,.16,2,1,1.15,1.2),13,45,0),dt.rock),n.add("torso","suit",w(kt(7,6,.16,2,1.1,.7,1.25),9,37,0),dt.rockD),n.add("torso","suit",w(kt(11,7,.16,2,1.1,.85,1),-8,54,0),dt.rock),n.add("torso","suit",w(kt(6,8,.2,1,1.4,.7,1.6),-14,44,0),dt.rockD);for(let e of[1,-1])n.add("torso","suit",w(kt(7,70+e,.18,1,1.9,.75,.32),-3,40.5,e*11.4),dt.rockD),n.add("torso","metal",w(_.torus(6.2,1.1,6,18),9,46,e*11.4),dt.frameL),n.add("core","core",w(_.cyl(5.2,5.2,.3,16),9,46,e*11.2,[Math.PI/2,0,0]),Je("#5fb8ff",2.4)),n.add("torso","glow",_.tube([[-14,46,e*10.7],[-6,50,e*10.9],[2,47,e*10.9],[6,52,e*10.7]],.7,12,5),Je("#6fc0ff",2.4)),n.add("torso","metal",w(_.cyl(1.1,1.1,9,8),-8,54,e*10.6,[0,0,.6]),dt.frameL),n.add("torso","metal",w(_.cyl(1.6,1.6,4,8),-11,50.5,e*10.6,[0,0,.6]),dt.frame),n.add("torso","suit",at([-6,58,e*8],[-2,61,e*13],[2,56,e*16],1,.9,10,6),"#1e1c1a");jt(n,"torso",[[-10,61,4,2.6,12,.3,.4,3],[-4,62.5,-3,2.2,10,-.3,-.1,5],[-14,57,-5,1.8,8,-.5,.6,7],[-6,60,7,1.6,7,.6,.2,9],[16,52,6,1.2,5,.6,-.6,11]],dt.crys),n.add("torso","metal",w(_.box(6,5,9,1),9,57,0),dt.frameL),n.add("core","crystal",w(_.shard(5.4,31,6,11),9,46,0,[Math.PI/2,0,0]),dt.crys),n.add("core","core",w(_.shard(2.8,33,6,12),9,46,0,[Math.PI/2,0,0]),Je("#8fd8ff",3.2)),n.add("sN","suit",w(kt(6.8,21,.2,1,1.15,1.05,.42),9,46,14),dt.rockL),n.add("sF","suit",w(kt(6.8,22,.2,1,1.15,1.05,.42),9,46,-14),dt.rockL);for(let[e,t]of[["plate0",1],["plate1",-1]])n.add(e,"suit",w(kt(9,72+t,.16,2,1.25,1,.36),-6,54,t*12.4),dt.rockL),jt(n,e,[[-8,60,t*14.5,1.1,5,t*.8,.3,25+t]],dt.crys);n.add("plate2","suit",w(kt(8,31,.16,2,1.3,.5,1.1),0,64,0),dt.rockL),jt(n,"plate2",[[2,66,2,1.4,6,.2,-.3,13]],dt.crys),n.add("head","metal",w(_.ext([[-6,-4.5],[6,-4.5],[9.5,-1],[8.5,3],[3,6],[-5,5.5],[-7.5,1]],10,1.2,{steps:2}),12,58,0),dt.head),n.add("head","suit",w(kt(4.6,30,.25,0,1.3,.5,1.15),15,62.5,0),dt.rockD);for(let e of[1,-1])n.add("head","metal",w(_.ext([[14,57.8],[21.4,57.4],[21.6,60.2],[14.4,60.4]],.35,.1),0,0,e*5),"#151312"),n.add("head","glow",w(_.ext([[15,58.4],[21.3,58.1],[21.4,59.6],[15.4,59.8]],.3,.08),0,0,e*5.2),Je("#ffad3a",3.4));n.add("head","glow",w(_.box(.4,1.4,8),21.3,58.9,0),Je("#ffad3a",3.4)),n.add("head","metal",w(_.box(3,2.6,7,.4),19.5,55,0),dt.frameL),jt(n,"head",[[10,63,0,1,4.5,0,.5,15]],dt.crys);for(let e of[1,-1]){n.add("pods","suit",w(kt(4.4,40+e,.25,1,1.4,.9,1),-12,60,e*6.5),dt.rockD);for(let t=0;t<3;t++){let i=e*(4.2+t*2.4);n.add("pods","metal",w(_.cyl(1.4,1.6,9,10),-13+t*.4,65,i,[0,0,.55]),dt.frame),n.add("pods","accent",w(_.torus(1.25,.3,4,10),-15.4+t*.4,68.8,i,[Math.PI/2,0,.55]),Je("#ffad3a",3))}}n.add("armN","metal",w(_.sph(5,12,10),2,55,16),dt.frameL),n.add("armN","metal",at([2,55,16],[4,48,18],[8,40,19],3.6,3,10,8),dt.frame),n.add("armN","suit",w(kt(8.5,41,.17,2,1.15,.75,.95),1,60.5,18.5),dt.rock),jt(n,"armN",[[0,64,19,1.4,6,.3,.3,17]],dt.crys),n.add("forN","metal",w(_.sph(3.4,10,8),8,40,19),dt.frameL),n.add("forN","metal",w(_.box(15,6.5,7.5,1.5,2),15.5,38,19),dt.frame),n.add("forN","suit",w(kt(4.6,42,.25,0,1.6,.6,1),14,42,19),dt.rockD);for(let e of[-1.8,1.8])n.add("forN","metal",w(_.cyl(1.5,1.7,10,12),26,37.6,19+e,[0,0,-Math.PI/2]),dt.frameL),n.add("forN","accent",w(_.torus(1.55,.35,5,12),31,37.6,19+e,[0,Math.PI/2,0]),Je("#7fd0ff",3.2));n.add("armF","metal",w(_.sph(5,12,10),2,55,-16),dt.frameL),n.add("armF","metal",at([2,55,-16],[4,48,-18],[8,40,-19],3.6,3,10,8),dt.frame),n.add("armF","suit",w(kt(8.5,43,.17,2,1.15,.75,.95),1,60.5,-18.5),dt.rock),jt(n,"armF",[[0,64,-19,1.4,6,-.3,.3,27]],dt.crys),n.add("forF","metal",w(_.sph(3.4,10,8),8,40,-19),dt.frameL),n.add("forF","metal",at([8,40,-19],[12,32,-20],[14,26,-20],3.8,3.4,10,8),dt.frame),n.add("forF","suit",w(kt(5,44,.25,1,1,1.3,.8),12,32,-22),dt.rockD),n.add("forF","metal",w(_.box(11,11,10,2.2,2),16,20,-20),dt.frameL),n.add("forF","suit",w(kt(5.6,45,.16,2,.9,1.1,1.1),21,21,-20),dt.rock),jt(n,"forF",[[24,25,-17,1,5,.2,-1.2,19],[24,20,-21,1,5,0,-1.4,21],[24,24,-23,.8,4,-.2,-1.1,23]],dt.crys);for(let[e,t]of[["N",1],["F",-1]])n.add("th"+e,"metal",at([-1,30,t*9],[3,24,t*10],[5,16,t*10],4.6,3.6,10,8),dt.frame),n.add("th"+e,"suit",w(kt(6.2,60+t,.22,1,.9,1.4,.6),3,24,t*13),dt.rock),n.add("sh"+e,"metal",w(_.sph(3.6,10,8),5,16,t*10),dt.frameL),n.add("sh"+e,"suit",w(kt(3.8,62+t,.25,0,1,1,1.2),8.5,17,t*10),dt.rockL),n.add("sh"+e,"metal",at([5,16,t*10],[3,10,t*10],[0,4,t*10],3.6,3,10,8),dt.frame),n.add("sh"+e,"suit",w(kt(4.8,64+t,.22,1,.9,1.4,.6),5,10,t*12.2),dt.rockD),n.add("ft"+e,"metal",w(_.ext([[-9,0],[11,0],[13,3],[7,6.5],[-6,6.5],[-10,3]],9,1.2),0,0,t*10),dt.frame),n.add("ft"+e,"suit",w(kt(4.5,66+t,.22,1,1.2,.8,1.1),10,3.5,t*10),dt.rock);for(let e of[1,-1]){n.add("cracks1","glow",_.tube(Ds(12,38,19,52,e*10.9,5,1.2,1),.38,14,4),co),n.add("cracks1","glow",_.tube(Ds(-14,56,-2,50,e*10.6,5,1.4,2),.38,14,4),co),n.add("cracks2","glow",_.tube(Ds(-6,62,6,66,e*7,4,1,3),.4,10,4),co),n.add("cracks2","glow",_.tube(Ds(4,34,14,40,e*11.6,4,1,4),.4,10,4),co);for(let t=0;t<3;t++)n.add("spark","glow",w(_.box(.6,.6,.6),6+t*3,50+t*2,e*12),Je("#ffd27a",5))}return n.build()}function G2(n,e,t,i,s,r){let o=Is(e,e.die*2.4+(e.kind==="shockwave"?e.kick*1.4:0));n.root.rotation.y=e.yaw,n.root.position.set(o[0],-e.die*e.die*16+o[1],o[2]),e.phase=(e.phase||0)+Math.abs(e.vx)*s/44*Ve;let a=Ct(Math.abs(e.vx)/40,0,1),l=Math.sin(e.time*1.6),c=e.teleS,h=e.next,u=0,d=0,f=0,g=0,x=0;if(t.state==="tele"&&(h==="shockwave"?(f=c,u=.5*c,d=-.12*c):h==="lob"?(x=c,d=.08*c,u=.3*c):g=c),e.kind==="shockwave"){let y=e.ap;f=y<.16?1-y/.16*1.25:-.25+(y-.16)*.4,u=.9-y*.7,d=.24*(1-y)}else e.kind==="lob"?(x=1-e.ap*.6,d=.12*(1-e.ap)):e.kind==="volley"&&(g=1);let m=e.open;d+=.1*m,u+=.3*m,n.pelvis.position.set(0,30-u*4.5+.35*l*(1-a)+a*.9*Math.abs(Math.sin(e.phase)),0),n.torso.rotation.set(0,.05*Math.sin(e.time*.7),-d+.012*l);for(let[y,v]of[["N",0],["F",Math.PI]]){let E=e.phase+v;n["th"+y].rotation.z=a*.32*Math.sin(E)+u*.42,n["sh"+y].rotation.z=-a*.42*Math.max(0,Math.cos(E))-u*.75,n["ft"+y].rotation.z=u*.33-a*.12*Math.sin(E)}n.armF.rotation.set(.45*m,0,1.9*f+.04*l-.75*m),n.forF.rotation.set(0,0,.7*Math.max(0,f)),n.armN.rotation.set(-.45*m,0,.3*g+.04*l-.75*m),n.forN.rotation.set(0,0,g*(e.aim-.3));let p=n.forN.userData.rest;n.forN.position.set(p.x-(e.kind==="volley"?2.4*e.kick:0),p.y,p.z),n.pods.rotation.z=.28*x;let M=n.pods.userData.rest;n.pods.position.set(M.x-(e.kind==="lob"?2.2*e.kick:0),M.y,M.z),n.head.rotation.set(0,.22*Math.sin(e.time*.5)*(1-c),-.12*m+.2*g*e.aim);for(let[y,v]of[["sN",1],["sF",-1]]){let E=n[y].userData.rest;n[y].position.set(E.x-1.5*m,E.y+12*m,E.z+v*3.5*m),n[y].rotation.set(-v*.55*m,0,.2*m)}r.fx.pulse(r.byMat.core,.45+.25*Math.sin(e.time*3)+m*(2+.4*Math.sin(e.time*14))+e.die*2*Math.abs(Math.sin(e.time*31))),r.fx.pulse(r.byMat.accent,.3+1.7*c+1.5*e.atk+e.kick),Rs(n,e,t),Cs(n,e,t,["plate0","plate1","plate2"],s),Ps(n,e,["head","armN","armF","pods","sN","sF","core"],7,52)}var Xt={skin:"#2c4a50",skinD:"#1d3237",belly:"#6f8f86",plate:"#45606a",plateL:"#5f7e84",crys:"#3fd6c8",tooth:"#dfe8dc",fin:"#2a8f86"},Qu=Je("#3fe6d4",3.2);function W2(){let n=new _t(.041666666666666664);n.bone("body","root",0,29,0).bone("head","body",6,30,0).bone("jaw","head",9,24,0).bone("core","head",17,27,0).bone("lure","head",14,46,0).bone("lure2","lure",24,54,0).bone("finN","body",-3,24,12).bone("finF","body",-3,24,-12).bone("t0","body",-12,30,0).bone("t1","t0",-22,30,0).bone("t2","t1",-30,30,0).bone("plate0","head",14,41,9).bone("plate1","head",14,41,-9).bone("plate2","head",22,40,0).bone("cracks1","head",14,34,0).bone("cracks2","body",0,30,0).bone("spark","head",16,36,0),n.add("head","flesh",w(hn(17,12.5,12.5,41,.08,22,14),15,32,0),Xt.skin),n.add("head","flesh",w(hn(12,6,10,42,.08),18,25,0),Xt.belly),n.add("head","flesh",w(_.ell(9,4,8,14,8),21,25.5,0),"#3a1c22");for(let e=0;e<9;e++){let t=16+e*2,i=9.2-Math.abs(e-4)*.25;for(let s of[1,-1])n.add("head","crystal",w(_.crystal(.75,3.6-Math.abs(e-5)*.2,5,.5,60+e),t,27.2,s*(i-2.8+e*.05),[Math.PI,0,0]),Xt.tooth)}for(let e of[1,-1]){for(let t=0;t<3;t++)n.add("head","glow",w(_.sph(.9-t*.15,8,6),25+t*2.2,36.5+t*.7,e*(10.2-t*.6)),Qu);for(let t=0;t<4;t++)n.add("head","accent",w(_.box(.5,6-t*.6,.4),4+t*2.2,31,e*12.1,[0,0,.12]),Qu);for(let t=0;t<5;t++)n.add("head","paint",w(_.shell(4.2,3.2,2.6,.5,-.9,.9,.4,2,6,4),4+t*4.6,39-Math.abs(t-2)*.8,e*(11-Math.abs(t-2)*.5),[0,e*-Math.PI/2,0]),t%2?Xt.plate:Xt.plateL)}jt(n,"head",[[10,43,2,2.2,9,.2,.5,3],[5,42,-3,1.8,7,-.3,.7,5],[16,44,-1,1.6,6,-.1,-.2,7],[0,40,4,1.4,5,.4,1,9]],Xt.crys),n.add("jaw","flesh",w(hn(14,4.6,10.5,43,.08),19,20.5,0),Xt.belly),n.add("jaw","paint",w(_.ext([[8,18],[30,18.5],[33,21],[30,22],[10,21]],18,1),0,0,0),Xt.plate);for(let e=0;e<8;e++)for(let t of[1,-1])n.add("jaw","crystal",w(_.crystal(.7,3.2-Math.abs(e-4)*.2,5,.5,80+e),17+e*2,22.2,t*(8.4-e*.2)),Xt.tooth);n.add("core","core",w(_.sph(4.8,14,10),17,27,0),Je("#9ffff0",3.4)),n.add("core","flesh",w(_.torus(5.2,1.2,6,16),17,27,0,[0,Math.PI/2,0]),"#5a2430"),n.add("lure","flesh",at([14,46,0],[18,54,0],[24,54,0],1,.6,12,6),Xt.skinD),n.add("lure2","flesh",at([24,54,0],[29,54,0],[31,50,0],.6,.35,10,5),Xt.skinD),n.add("lure2","core",w(_.sph(2,12,8),31,48.6,0),Je("#b6fff4",3)),n.add("body","flesh",w(hn(14,11.5,11.5,44,.08),-5,30,0),Xt.skinD),n.add("body","flesh",w(_.ell(11,5,9,14,8),-4,22,0),Xt.belly);for(let e=0;e<7;e++)n.add("body","paint",w(_.cone(1,4.2-Math.abs(e-3)*.4,6),6-e*3.2,41-Math.abs(e-2)*.5,0,[0,0,.35]),Xt.plate);for(let e=0;e<6;e++)for(let t of[1,-1])n.add("body","paint",w(_.shell(3.4,2.8,2.2,.45,-.9,.9,.4,2,6,4),-14+e*3.6,35+Math.sin(e*1.3)*.6,t*10.2,[0,t*-Math.PI/2,0]),e%2?Xt.plate:Xt.plateL);for(let e=0;e<6;e++)for(let t of[1,-1])n.add("body","glow",w(_.sph(.55,6,4),-14+e*3.2,28+Math.sin(e)*1.5,t*11),Qu);jt(n,"body",[[-6,40,3,1.4,5,.3,.4,11],[-12,38,-4,1.1,4,-.4,.6,13]],Xt.crys),n.add("t0","flesh",w(hn(9.5,8,8,45,.08),-17,30,0),Xt.skin);for(let e=0;e<3;e++)n.add("t0","paint",w(_.cone(.8,3,6),-12-e*3.2,37.5,0,[0,0,.4]),Xt.plate);n.add("t1","flesh",w(hn(7,5.5,5.5,46,.08),-26,30,0),Xt.skinD),n.add("t2","flesh",w(hn(4.5,3.6,3.6,47,.08),-32,30,0),Xt.skin),n.add("t2","membrane",w(_.membrane([[-31,0],[-36,12],[-38.5,11],[-35.5,0],[-38.5,-11],[-36,-12]]),0,30,0),Xt.fin);for(let e of[-.9,-.45,0,.45,.9])n.add("t2","paint",_.tube([[-31.5,30,0],[-34.5-Math.abs(e),30+e*6,0],[-37.6,30+e*12.4,0]],.22,6,4),Xt.skinD);for(let[e,t]of[["finN",1],["finF",-1]]){n.add(e,"membrane",w(_.membrane([[0,0],[-6,-8],[-14,-14],[-16,-10],[-10,-2]]),-3,24,t*12),Xt.fin);for(let i of[[-6,-8],[-11,-12],[-15,-12]])n.add(e,"paint",_.tube([[-3,24,t*12],[-3+i[0]*.55,24+i[1]*.5,t*12.1],[-3+i[0],24+i[1],t*12.1]],.2,6,4),Xt.skinD);n.add(e,"flesh",at([-3,24,t*12],[-9,17,t*12.5],[-17,12,t*12.2],.6,.25,10,4),Xt.skinD)}for(let[e,t]of[["plate0",1],["plate1",-1]])n.add(e,"paint",w(_.shell(11,8,7,1.2,t>0?.1:-1.5,t>0?1.5:-.1,.15,1.1,10,5),14,35,t*3.5),Xt.plate),jt(n,e,[[12,43,t*8,1.2,5,t*.6,.3,21+t]],Xt.crys);n.add("plate2","paint",w(_.shell(9,7,9,1,-.8,.8,.3,1.3,8,5),18,34,0),Xt.plateL);for(let e of[1,-1]){n.add("cracks1","glow",_.tube(Ds(6,36,22,40,e*11.6,5,1,5),.32,14,4),Je("#9ffff0",3)),n.add("cracks2","glow",_.tube(Ds(-14,26,2,34,e*11.2,5,1.2,6),.32,14,4),Je("#9ffff0",3));for(let t=0;t<3;t++)n.add("spark","glow",w(_.box(.5,.5,.5),12+t*3,38-t,e*11),Je("#d8fff8",5))}return n.build()}function X2(n,e,t,i,s,r){let o=Is(e,e.die*2);n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*18,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time,u=.08+.05*Math.sin(h*1.3),d=0,f=0,g=0,x=1;t.state==="tele"&&(l==="dash"?(d=-.1*a,g=a,u=.02):l==="volley"?u=.25*a:(d=.25*a,u=.1+.1*a)),e.kind==="dash"?(f=1,u=.55,x=2.6,g=-.4):e.kind==="volley"?(u=.7*(1-e.ap*.6),d=.1):e.kind==="lob"&&(d=.35*(1-e.ap),u=.4),u=Math.max(u,.75*c),d+=.18*c,e.die>0&&(u=.6+.2*Math.sin(h*9),d=-.3*e.die,x=.3),e.jaw=yt(e.jaw||0,u,14,s),n.body.rotation.set(.04*Math.sin(h*1.1),0,-.05*f+.03*Math.sin(h*1.5)+e.die*-.25),n.body.position.set(f*3,29+Math.sin(h*2.2)*.8,0),n.head.rotation.set(0,0,d+.03*Math.sin(h*1.5+1)),n.jaw.rotation.z=-e.jaw;let m=h*3.2*x;n.t0.rotation.set(0,.12*Math.sin(m-.6),.12*Math.sin(m-.6)+.25*g),n.t1.rotation.set(0,.18*Math.sin(m-1.3),.18*Math.sin(m-1.3)+.35*g),n.t2.rotation.set(0,.25*Math.sin(m-2),.25*Math.sin(m-2)+.45*g),n.finN.rotation.x=-.25-.25*Math.sin(h*2.2*x),n.finF.rotation.x=.25+.25*Math.sin(h*2.2*x),n.lure.rotation.z=.12*Math.sin(h*1.4)-.1*d,n.lure2.rotation.z=.2*Math.sin(h*1.4-.8),n.core.scale.setScalar(.8+.3*c),r.fx.pulse(r.byMat.core,.4+.2*Math.sin(h*2.5)+c*2+e.die*Math.abs(Math.sin(h*27))*2),r.fx.pulse(r.byMat.accent,.4+1.6*a+1.2*e.atk),Rs(n,e,t),Cs(n,e,t,["plate0","plate1","plate2"],s),Ps(n,e,["jaw","lure","finN","finF","t1","t2"],11,40)}var qt={hull:"#30353c",hullL:"#4a5059",hullD:"#1e2227",red:"#8a1c1c",stripe:"#b8862e",metal:"#5c6168"},uh=Je("#ff3b2f",3.4),fh=Je("#ff7a2a",3.4);function q2(){let n=new _t(.038461538461538464);n.bone("hull","root",0,33,0).bone("chin","hull",26,22,0).bone("gat","chin",30,22,0).bone("tur","hull",8,47,0).bone("tgun","tur",10,50,0).bone("vls","hull",-16,46,0).bone("engN","hull",-14,30,22).bone("engF","hull",-14,30,-22).bone("flN","engN",-32.4,30,22).bone("flF","engF",-32.4,30,-22).bone("hTN","hull",2,34,14.2).bone("hBN","hull",2,34,14.2).bone("hTF","hull",2,34,-14.2).bone("hBF","hull",2,34,-14.2).bone("core","hull",2,34,0).bone("plate0","hull",-10,40,13.4).bone("plate1","hull",-10,40,-13.4).bone("cracks1","hull",0,34,0).bone("cracks2","hull",0,34,0).bone("spark","hull",10,38,0).bone("nav","hull",0,33,0);let e=_.ext([[-36,22],[20,20],[36,26],[41,32],[30,42],[6,48],[-26,46],[-38,36]],26,2.5,{steps:4});Cn(e,t=>{t.y-=.012*t.z*t.z*(t.y>34?1:-.6)},!0),n.add("hull","paint",e,qt.hull),n.add("hull","paint",w(_.ext([[-30,41],[18,40],[26,44],[4,50],[-24,48]],18,1.5),0,0,0),qt.hullL);for(let t of[1,-1]){n.add("hull","paint",w(_.ext([[-34,26],[16,24],[30,29],[24,31],[-32,32]],1,.3),0,0,t*13.2),qt.hullL),n.add("hull","paint",w(_.ext([[-30,31.5],[22,30.8],[24,32],[-30,33]],1.1,.2),0,0,t*13.3),qt.red),n.add("hull","metal",w(_.torus(8.2,1.4,6,24),2,34,t*13.4),qt.metal);for(let i=0;i<5;i++)n.add("hull","metal",w(_.box(2.4,.6,.6),-26+i*4.2,38.8,t*13.3),qt.hullD);n.add("hull","glow",w(_.box(10,.5,.3),24,27,t*12.4,[0,0,.25]),uh),n.add("hull","paint",w(_.box(12,2.2,12,.6),-14,30,t*16),qt.hullD),n.add("hull","paint",w(_.ext([[-24,40],[-12,40],[-16,54],[-24,56]],.9,.3),0,0,t*9,[t*.25,0,0]),qt.hullL),n.add("hull","paint",w(_.box(5,1.6,.95),-21,53,t*9.6,[t*.25,0,0]),qt.red)}n.add("core","core",w(_.cyl(7.2,7.2,27.4,20),2,34,0,[Math.PI/2,0,0]),Je("#ffb066",3.2));for(let[t,i,s]of[["hTN","hBN",1],["hTF","hBF",-1]])n.add(t,"paint",w(_.ext([[-7.6,0],[7.6,0],[6.6,3.8],[3.8,6.6],[0,7.6],[-3.8,6.6],[-6.6,3.8]],1.4,.4),2,34,s*14),qt.hullL),n.add(i,"paint",w(_.ext([[-7.6,0],[-6.6,-3.8],[-3.8,-6.6],[0,-7.6],[3.8,-6.6],[6.6,-3.8],[7.6,0]],1.4,.4),2,34,s*14),qt.hull),n.add(t,"paint",w(_.box(12,.5,.3),2,34.6,s*14.8),qt.stripe);n.add("chin","metal",w(_.sph(5,12,10),26,22,0),qt.hullD),n.add("chin","paint",w(_.shell(5.4,5.4,5.4,.6,-1,1,.3,2.2,8,6),26,22,0),qt.hullL);for(let t=0;t<6;t++){let i=t/6*Ve;n.add("gat","metal",w(_.cyl(.6,.6,12,8),35,22+Math.cos(i)*1.6,Math.sin(i)*1.6,[0,0,-Math.PI/2]),qt.metal)}n.add("gat","metal",w(_.cyl(2.4,2.4,1.2,12),32,22,0,[0,0,-Math.PI/2]),qt.hullD),n.add("gat","metal",w(_.cyl(2.4,2.4,1,12),39,22,0,[0,0,-Math.PI/2]),qt.hullD),n.add("gat","accent",w(_.torus(2,.3,4,12),41.2,22,0,[0,Math.PI/2,0]),fh),n.add("tur","paint",w(_.shell(7,5,7,.6,0,Ve,0,Math.PI/2+.2,16,5),8,47,0),qt.hullL),n.add("tur","paint",w(_.torus(6.9,.4,4,18),8,47.4,0,[Math.PI/2,0,0]),qt.red),n.add("tgun","paint",w(_.box(6,4,6,1,2),11,50,0),qt.hull);for(let t of[1.6,-1.6])n.add("tgun","metal",w(_.cyl(.85,.95,16,10),21,50.4,t,[0,0,-Math.PI/2]),qt.metal),n.add("tgun","accent",w(_.torus(.95,.25,4,10),29.2,50.4,t,[0,Math.PI/2,0]),fh);n.add("tgun","core",w(_.box(.3,.8,2.6),14.1,51.2,0),uh),n.add("vls","paint",w(_.box(14,5,14,1,2),-16,48,0),qt.hullD);for(let t=0;t<3;t++)for(let i=0;i<2;i++)n.add("vls","metal",w(_.box(3.4,.6,4.4,.2),-20.5+t*4.5,50.7,-3+i*6),qt.metal),n.add("vls","accent",w(_.cone(1.2,2.4,8),-20.5+t*4.5,51.8,-3+i*6),uh);for(let[t,i,s]of[["engN","flN",1],["engF","flF",-1]])n.add(t,"paint",w(_.cyl(5.4,6,24,16),-16,30,s*22,[0,0,Math.PI/2]),qt.hull),n.add(t,"metal",w(_.torus(5.7,.8,5,18),-4.5,30,s*22,[0,Math.PI/2,0]),qt.metal),n.add(t,"metal",w(_.lathe([[5.6,0],[6.4,-.6],[5.6,-4],[4.6,-4.2],[4.8,-.6]],16),-28,30,s*22,[0,0,Math.PI/2]),qt.hullD),n.add(t,"glow",w(_.cyl(4.6,4.6,.2,16),-32.2,30,s*22,[0,0,Math.PI/2]),fh),n.add(t,"paint",w(_.box(16,1.2,.6),-14,30,s*27.6),qt.stripe),n.add(t,"paint",w(_.ext([[-26,35],[-10,35],[-14,42],[-24,43]],.8,.25),0,0,s*22),qt.hullL),n.add(i,"glow",w(_.lathe([[4.4,0],[3.2,-4],[1.6,-8],[.05,-11]],12),-32.4,30,s*22,[0,0,Math.PI/2]),Je("#ff8a4a",2.4));n.add("nav","glow",w(_.sph(.8,6,4),-36,37,0),uh),n.add("nav","glow",w(_.sph(.8,6,4),30,42,0),Je("#ffffff",4));for(let[t,i]of[["plate0",1],["plate1",-1]])n.add(t,"paint",w(_.ext([[-28,35],[-6,35],[-4,44],[-26,45]],1.4,.5),0,0,i*13.6),qt.hullL);for(let t of[1,-1]){n.add("hull","glow",_.tube([[-26,38,t*12.9],[-18,42,t*12.9],[-10,37,t*12.9],[-4,41,t*12.9]],.6,12,5),fh.map(i=>i*.7)),n.add("cracks1","glow",_.tube(Ds(14,28,30,36,t*13.6,5,1,7),.32,14,4),co),n.add("cracks2","glow",_.tube(Ds(-34,30,-16,26,t*13.6,5,1,8),.32,14,4),co);for(let i=0;i<3;i++)n.add("spark","glow",w(_.box(.6,.6,.6),8+i*4,40-i,t*14),Je("#ffd27a",5))}return n.build()}function Y2(n,e,t,i,s,r){let o=Is(e,e.die*2.2+(e.kind==="barrage"?.35:0));n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*26,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time;n.hull.rotation.set(.04*Math.sin(h*.9)+e.die*.3,0,.03*Math.sin(h*1.3)-e.die*.35);let u=t.state==="tele"&&l==="volley"||e.kind==="volley"?1:0;e.tv=yt(e.tv||0,u,6,s),n.tur.rotation.y=0,n.tgun.rotation.z=e.tv*Ct(e.aim,-.5,.6);let d=n.tgun.userData.rest;n.tgun.position.set(d.x-(e.kind==="volley"?2.5*e.kick:0),d.y,d.z),e.gspin=(e.gspin||0)+s*(e.kind==="barrage"?30:t.state==="tele"&&l==="barrage"?12*a:.5),n.gat.rotation.x=e.gspin,n.chin.rotation.z=e.kind==="barrage"||t.state==="tele"&&l==="barrage"?Ct(e.aim,-.6,.3):0;let f=(e.kind==="lob"?1-e.ap:0)+(t.state==="tele"&&l==="lob"?a*.5:0);n.vls.position.y=n.vls.userData.rest.y+1.5*f;for(let[x,m]of[["hTN","hBN"],["hTF","hBF"]])n[x].position.y=n[x].userData.rest.y+8*c,n[m].position.y=n[m].userData.rest.y-8*c;let g=.85+.15*Math.sin(h*43)+.25*(e.kind?1:0);n.flN.scale.set(g,1,1),n.flF.scale.set(g*(.97+.03*Math.sin(h*37)),1,1),n.nav.scale.setScalar(h%1.2<.1?1:1e-4),r.fx.pulse(r.byMat.core,.35+.15*Math.sin(h*3)+c*2.4+e.die*2*Math.abs(Math.sin(h*29))),r.fx.pulse(r.byMat.accent,.3+1.8*a+1.6*e.atk),Rs(n,e,t),Cs(n,e,t,["plate0","plate1"],s),Ps(n,e,["engN","engF","tur","vls","chin","hTN","hBF"],13,56)}var Wp={warden:{build:V2,pose:G2},maw:{build:W2,pose:X2},gunship:{build:q2,pose:Y2}};var ka=(n,e,t,i,s,r,o,a)=>{let l=[];for(let c=0;c<=r;c++){let h=c/r,u=Math.sin(a*13.7+c*7.3)*o;l.push([n+(t-n)*h+u*.4,e+(i-e)*h+u,s])}return l},Fa=Je("#ff6a14",3.4),Xp=Je("#ffcf3a",3.2),ef=Je("#ff8a2a",3),gt={iron:"#302c2a",ironL:"#48423e",steel:"#5c6066",steelL:"#7c8086",brass:"#a07a3a",hazard:"#d8a12a",dark:"#1a1716",rust:"#6e3a20"};function Z2(){let n=new _t(.038461538461538464);n.bone("pelvis","root",0,34,0).bone("torso","pelvis",0,40,0).bone("head","torso",9,70,0).bone("core","torso",6,49,0).bone("doorN","torso",14.5,49,13.4).bone("doorF","torso",14.5,49,-13.4).bone("stacks","torso",-10,70,0).bone("armN","torso",0,64,18).bone("forN","armN",4,47,21).bone("armF","torso",0,64,-18).bone("forF","armF",4,47,-21).bone("plate0","torso",-6,57,13).bone("plate1","torso",-6,57,-13).bone("plate2","torso",0,71,0).bone("cracks1","torso",0,50,0).bone("cracks2","torso",0,50,0).bone("spark","torso",0,56,0);for(let[e,t]of[["N",1],["F",-1]])n.bone("th"+e,"pelvis",-2,34,t*10).bone("sh"+e,"th"+e,4,19,t*11).bone("ft"+e,"sh"+e,-1,5,t*11);n.add("pelvis","paint",w(_.box(22,10,20,1.6,2),-1,34,0),gt.iron);for(let e=0;e<6;e++)n.add("pelvis","paint",w(_.box(2.4,3.2,20.4),-9+e*3.6,31.6,0,[0,0,.6]),e%2?gt.dark:gt.hazard);for(let e of[1,-1])n.add("pelvis","metal",w(_.cyl(5,5,4.4,16),-2,34,e*10.4,[Math.PI/2,0,0]),gt.steelL);n.add("torso","metal",_.ext([[-16,38],[14,38],[19,48],[18,62],[10,70],[-10,70],[-18,60]],24,2.4,{steps:2}),gt.steel);for(let e of[1,-1]){n.add("torso","paint",w(_.ext([[-16,39],[2,39],[2,47],[-17,47]],1.4,.5),0,0,e*12.4),gt.ironL),n.add("torso","metal",w(_.torus(8.6,1.3,6,22),6,49,e*12.4),gt.brass);for(let t=0;t<4;t++)n.add("torso","metal",w(_.box(16,.9,.6),6,44+t*3.2,e*12.6),gt.dark);for(let t=0;t<3;t++)n.add("torso","accent",w(_.box(6,.6,.4),12,62+t*1.6,e*12.2,[0,0,-.35]),Fa);n.add("torso","glow",_.tube([[-15,50,e*11.8],[-8,54,e*12],[-12,60,e*12],[-4,64,e*11.8]],.7,12,5),Fa.map(t=>t*.6)),n.add("torso","metal",w(_.torus(3.4,.9,6,14),-10,58,e*11.8),gt.steelL),n.add("torso","suit",at([-12,64,e*8],[-6,69,e*14],[0,64,e*18],1.1,1,10,6),gt.dark)}n.add("torso","paint",w(_.ext([[10,60],[19,52],[20,58],[14,67]],18,1.2),0,0,0),gt.ironL),n.add("core","core",w(_.cyl(8,8,25.2,20),6,49,0,[Math.PI/2,0,0]),Je("#ff9a40",3.3));for(let e of[1,-1])for(let t=-2;t<=2;t++)n.add("torso","metal",w(_.box(.7,15,.7),6+t*3,49,e*12.8),gt.dark);for(let[e,t]of[["doorN",1],["doorF",-1]]){n.add(e,"paint",w(_.ext([[-2,-7.4],[14.5,-7.4],[15.8,-5],[15.8,5],[14.5,7.4],[-2,7.4],[-3.2,5],[-3.2,-5]],1.6,.5),-1.2,49,t*13.6),gt.ironL),n.add(e,"metal",w(_.box(14,1,.5),6,49,t*14.5),gt.brass);for(let i of[44,54])n.add(e,"metal",w(_.cyl(.8,.8,2.4,8),14.5,i,t*13.4),gt.steelL)}n.add("head","paint",w(_.ext([[-5,-4.5],[6,-4.5],[8.5,0],[6.5,5],[-4,5.2],[-6,1]],9.4,1),9,70,0),gt.ironL);for(let e of[1,-1])n.add("head","metal",w(_.ext([[11,70],[17.4,69.6],[17.4,71.6],[11.6,71.8]],.3,.08),0,0,e*4.75),gt.dark),n.add("head","glow",w(_.ext([[11.6,70.4],[17.2,70.1],[17.2,71.2],[12,71.4]],.3,.06),0,0,e*4.95),Xp);n.add("head","glow",w(_.box(.4,1,7),17.5,70.7,0),Xp),n.add("head","metal",w(_.cyl(.25,.25,6,5),4,77,3,[0,0,.3]),gt.steelL);for(let e of[1,-1]){n.add("stacks","paint",w(_.cyl(2.6,3,14,14),-12,76,e*6),gt.iron);for(let t of[72,79])n.add("stacks","metal",w(_.torus(2.9,.45,5,14),-12,t,e*6,[Math.PI/2,0,0]),gt.brass);n.add("stacks","accent",w(_.cyl(2.2,2.2,.3,12),-12,83.1,e*6),Fa)}n.add("armN","metal",w(_.cyl(5.4,5.4,6,16),0,64,18,[Math.PI/2,0,0]),gt.steelL),n.add("armN","paint",w(_.ext([[-8,64],[-4,71],[6,71],[9,64],[4,60],[-5,60]],4,1),0,0,20),gt.ironL);for(let e=0;e<4;e++)n.add("armN","paint",w(_.box(1.6,2.6,.4),-4+e*3,66,22.1,[0,0,.6]),e%2?gt.dark:gt.hazard);n.add("armN","metal",at([0,64,18.5],[2,56,20],[4,47,21],3.4,3,10,8),gt.steel),n.add("armN","metal",w(_.cyl(1,1,12,8),4,56,23.2,[0,0,.2]),gt.steelL),n.add("forN","metal",w(_.sph(3.6,12,8),4,47,21),gt.brass),n.add("forN","paint",at([4,47,21],[7,40,21],[9,34,21],3.6,3.2,10,8),gt.ironL),n.add("forN","paint",w(_.box(11,15,12,1.6,2),10,26,21),gt.iron);for(let e of[21,31])n.add("forN","metal",w(_.box(11.6,1.4,12.6,.3),10,e,21),gt.brass);n.add("forN","accent",w(_.box(.6,12,10),15.8,26,21),Fa),n.add("armF","metal",w(_.cyl(5.4,5.4,6,16),0,64,-18,[Math.PI/2,0,0]),gt.steelL),n.add("armF","paint",w(_.ext([[-8,64],[-4,71],[6,71],[9,64],[4,60],[-5,60]],4,1),0,0,-20),gt.ironL),n.add("armF","metal",at([0,64,-18.5],[2,56,-20],[4,47,-21],3.4,3,10,8),gt.steel),n.add("forF","metal",w(_.sph(3.6,12,8),4,47,-21),gt.brass),n.add("forF","paint",w(_.box(16,7.5,8,1.4,2),12,45,-21),gt.ironL),n.add("forF","metal",w(_.cyl(2.8,3.2,12,14),24,45,-21,[0,0,-Math.PI/2]),gt.steel);for(let e of[20,26])n.add("forF","metal",w(_.torus(3.2,.5,5,14),e,45,-21,[0,Math.PI/2,0]),gt.brass);n.add("forF","accent",w(_.cyl(2.2,2.2,.3,12),30.2,45,-21,[0,0,-Math.PI/2]),Fa);for(let[e,t]of[["N",1],["F",-1]]){n.add("th"+e,"metal",at([-2,34,t*10],[2,26,t*11],[4,19,t*11],4.6,3.8,10,8),gt.steel),n.add("th"+e,"paint",w(_.ext([[-4,31],[6,30],[7,21],[-1,22]],2,.6),0,0,t*15),gt.ironL),n.add("th"+e,"metal",w(_.cyl(.9,.9,12,8),-3,26,t*15.6,[0,0,-.25]),gt.steelL),n.add("sh"+e,"metal",w(_.cyl(4,4,7,14),4,19,t*11,[Math.PI/2,0,0]),gt.brass),n.add("sh"+e,"paint",w(_.box(7.5,14,8.5,1.4,2),1.6,12,t*11,[0,0,.2]),gt.iron);for(let i=0;i<3;i++)n.add("sh"+e,"paint",w(_.box(1.4,2.2,.4),0+i*2.4,14,t*15.4,[0,0,.6]),i%2?gt.dark:gt.hazard);n.add("ft"+e,"paint",w(_.ext([[-9,0],[12,0],[13.5,2.6],[8,6],[-6,6],[-10,3]],11,1.2),0,0,t*11),gt.ironL);for(let i of[-3.4,0,3.4])n.add("ft"+e,"metal",w(_.box(3.2,2.6,2.6,.6),13,1.6,t*11+i),gt.steelL)}for(let[e,t]of[["plate0",1],["plate1",-1]]){n.add(e,"paint",w(_.ext([[-17,50],[0,50],[2,63],[-8,67],[-17,62]],2.2,.7,{steps:2}),0,0,t*13.2),gt.ironL);for(let i=0;i<4;i++)n.add(e,"paint",w(_.box(1.8,3,.4),-14+i*3.4,53,t*14.4,[0,0,.6]),i%2?gt.dark:gt.hazard)}n.add("plate2","paint",w(_.ext([[-12,68],[10,68],[12,73],[-12,74]],30,1.2),0,0,0),gt.ironL);for(let e of[1,-1]){n.add("cracks1","glow",_.tube(ka(-14,40,0,46,e*13.3,5,1,1),.36,14,4),ef),n.add("cracks1","glow",_.tube(ka(12,58,18,66,e*9.2,4,.8,2),.36,10,4),ef),n.add("cracks2","glow",_.tube(ka(-16,60,-4,68,e*12.6,5,1,3),.38,14,4),ef);for(let t=0;t<3;t++)n.add("spark","glow",w(_.box(.7,.7,.7),-6+t*4,56+t*2,e*13.4),Je("#ffd27a",5))}return n.build()}function $2(n,e,t,i,s,r){let o=Is(e,e.die*2.6+(e.kind==="shockwave"?e.kick*1.6:0));n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*18,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time,u=e.kind==="dash";e.phase=(e.phase||0)+Math.abs(e.vx)*s/(u?60:46)*Ve;let d=Ct(Math.abs(e.vx)/40,0,1),f=Math.sin(h*1.5),g=0,x=0,m=0,p=0;if(t.state==="tele"&&(l==="dash"?(g=.7*a,x=-.1*a):l==="shockwave"?(m=a,x=-.1*a):p=a),u)x=.28,g=.3;else if(e.kind==="shockwave"){let v=e.ap;m=v<.16?1-v/.16*1.3:-.3+(v-.16)*.4,g=.8-v*.6,x=.2*(1-v)}else e.kind==="volley"&&(p=1);x+=.08*c,g+=.25*c,n.pelvis.position.set(0,34-g*4.5+.3*f*(1-d)+d*1.1*Math.abs(Math.sin(e.phase)),0),n.torso.rotation.set(0,.04*Math.sin(h*.6),-x+.012*f);for(let[v,E]of[["N",0],["F",Math.PI]]){let R=e.phase+E,C=u?.55:.34;n["th"+v].rotation.z=d*C*Math.sin(R)+g*.42,n["sh"+v].rotation.z=-d*C*1.2*Math.max(0,Math.cos(R))-g*.75,n["ft"+v].rotation.z=g*.33-d*.12*Math.sin(R)}n.armN.rotation.set(0,0,2*m+.04*f+(u?-.4:0)),n.forN.rotation.set(0,0,.8*Math.max(0,m)),n.armF.rotation.set(0,0,.2*p+.04*f+(u?-.4:0)),n.forF.rotation.set(0,0,p*(e.aim-.2));let M=n.forF.userData.rest;n.forF.position.set(M.x-(e.kind==="volley"?2.4*e.kick:0),M.y,M.z),n.head.rotation.set(0,.25*Math.sin(h*.4)*(1-a),-.1*c+.15*p*e.aim),n.stacks.rotation.z=.03*Math.sin(h*2.3),n.doorN.rotation.y=-1.7*c,n.doorF.rotation.y=1.7*c;let y=.85+.15*Math.sin(h*19)*Math.sin(h*6.3);r.fx.pulse(r.byMat.core,(.5+c*2)*y+e.die*Math.abs(Math.sin(h*31))*2),r.fx.pulse(r.byMat.accent,(.45+1.6*a+1.4*e.atk)*y),Rs(n,e,t),Cs(n,e,t,["plate0","plate1","plate2"],s),Ps(n,e,["head","armN","armF","stacks","doorN","doorF"],17,54)}var un={crys:"#7a3ff0",crysD:"#5a2ab8",crysL:"#a57aff",flesh:"#4a2240",fleshL:"#6a3256",sac:"#6e3c5e",bone:"#cdbba2",chitin:"#24162a",wing:"#b48cff"},ho=Je("#8fff3f",3.2);function J2(){let n=new _t(.041666666666666664);n.bone("thorax","root",0,40,0).bone("head","thorax",15,46,0).bone("jaw","head",22,43,0).bone("abd","thorax",-10,37,0).bone("abd2","abd",-24,30,0).bone("wN","thorax",-2,51,6).bone("wF","thorax",-2,51,-6).bone("wN2","thorax",-5,50,5).bone("wF2","thorax",-5,50,-5).bone("cpN","thorax",3,41,8.5).bone("cpF","thorax",3,41,-8.5).bone("core","thorax",3,40,0).bone("plate0","thorax",-2,48,6).bone("plate1","thorax",-2,48,-6).bone("cracks1","thorax",0,40,0).bone("cracks2","thorax",0,40,0).bone("spark","thorax",4,44,0);for(let[i,s]of[["N",1],["F",-1]])n.bone("sc"+i,"thorax",10,36,s*8).bone("sc"+i+"k","sc"+i,18,24,s*11);let e=[6,2,-2,-6];e.forEach((i,s)=>{let r=s%2?-1:1;n.bone("l"+s,"thorax",i,32,r*5.5).bone("l"+s+"k","l"+s,i+2,22,r*9)}),n.add("thorax","flesh",w(hn(12.5,9.5,8.6,51,.08),2,40,0),un.flesh),n.add("thorax","flesh",w(_.ell(8,4,6.4,12,8),4,33.6,0),un.fleshL),n.add("thorax","core",w(_.sph(5.2,14,10),3,40,0),Je("#a6ff5a",3.2)),jt(n,"thorax",[[-4,48,0,1.8,9,0,.6,3],[2,49,0,1.6,8,0,.3,5],[8,48,0,1.3,6,0,-.1,7],[-9,45,0,1.2,5,0,1,9]],un.crys),n.add("thorax","crystal",w(_.shell(12.6,9.6,8.8,.6,0,Ve,0,.9,16,4),2,40.4,0),un.crys);for(let[i,s]of[["cpN",1],["cpF",-1]])n.add(i,"crystal",w(_.shell(10.5,8.5,9.2,.7,s>0?.35:-2.8,s>0?2.8:-.35,.8,2.1,10,5),3,40,0),un.crysD);for(let[i,s]of[["plate0",1],["plate1",-1]])n.add(i,"crystal",w(_.shell(12.8,9.8,9,.7,s>0?1.7:-3,s>0?3:-1.7,.3,1.4,8,4),2,40.2,0),un.crys);n.add("head","flesh",w(hn(9,6.4,6,52,.08),21,47,0,[0,0,-.2]),un.fleshL),n.add("head","crystal",w(_.shell(9.4,6.8,6.4,.5,-.6,3.74,0,1.2,12,4),20,47.4,0,[0,0,-.2]),un.crysD),jt(n,"head",[[15,52,0,1.6,10,0,1,11],[16,53,2.6,1.2,8,.4,1.1,13],[16,53,-2.6,1.2,8,-.4,1.1,15],[21,53,0,1,5,0,.4,17]],un.crys);for(let i of[1,-1])for(let s=0;s<3;s++)n.add("head","glow",w(_.sph(1-s*.15,8,6),25.5+s*1.8,48.8-s*.7,i*(4.6-s*.6)),ho);for(let i of[1,-1])n.add("jaw","paint",at([22,43,i*1.8],[26,41,i*2.2],[27.5,38,i*.8],.8,.15,8,5),un.bone),n.add("jaw","paint",at([23,44,i*2.4],[26.5,43.6,i*2.8],[28.4,41.6,i*1.6],.6,.12,8,5),un.bone);n.add("jaw","glow",w(_.sph(1.2,8,6),25.5,42.4,0),ho),n.add("abd","flesh",w(hn(14,11.5,10.5,53,.07),-17,31,0,[0,0,.25]),un.sac);for(let i=0;i<4;i++)n.add("abd","paint",w(_.torus(9.6-Math.abs(i-1.2)*1.4,.6,6,22),-9-i*5,34-i*1.6,0,[0,Math.PI/2,.25]),un.bone);for(let i=0;i<5;i++){let s=i*1.25;n.add("abd","accent",_.tube([[-6,34+Math.cos(s)*6,Math.sin(s)*6],[-16,31+Math.cos(s+.4)*10.5,Math.sin(s+.4)*9.6],[-26,28+Math.cos(s+.8)*6,Math.sin(s+.8)*5.6]],.3,12,4),ho.map(r=>r*.6))}n.add("abd2","flesh",w(_.ell(4.5,3.6,3.6,10,8),-30,27,0,[0,0,.5]),un.fleshL),n.add("abd2","accent",w(_.sph(1.8,10,8),-33.4,24.6,0),ho);let t=(i,s)=>_.membrane([[0,0],[-i*.2,s*.7],[-i*.6,s],[-i,s*.8],[-i*.75,s*.25],[-i*.3,-.5]]);for(let[i,s,r,o]of[["wN",6,26,18],["wF",-6,26,18],["wN2",5,20,13],["wF2",-5,20,13]]){let a=i.endsWith("2")?-5:-2,l=i.endsWith("2")?50:51;n.add(i,"membrane",w(t(r,o),a,l,s),un.wing),n.add(i,"crystal",_.tube([[a,l,s],[a-r*.3,l+o*.85,s],[a-r,l+o*.8,s]],.35,10,4),un.crysL),n.add(i,"crystal",_.tube([[a-r*.2,l+o*.4,s],[a-r*.55,l+o*.55,s],[a-r*.8,l+o*.4,s]],.22,8,4),un.crysL)}for(let[i,s]of[["N",1],["F",-1]]){n.add("sc"+i,"paint",at([10,36,s*8],[15,31,s*10],[18,24,s*11],1.6,1.2,10,6),un.chitin),n.add("sc"+i+"k","paint",w(_.sph(1.4,8,6),18,24,s*11),un.bone);let r=_.shard(1.6,22,5,70+s,.1);sn(r,null,null,[1,1,.45]),n.add("sc"+i+"k","crystal",w(r,22,31,s*11,[0,0,-.55]),un.crysL)}e.forEach((i,s)=>{let r=s%2?-1:1;n.add("l"+s,"paint",at([i,32,r*5.5],[i+1.5,27,r*7.8],[i+2,22,r*9],.9,.6,8,5),un.chitin),n.add("l"+s+"k","paint",at([i+2,22,r*9],[i+.6,15,r*9.5],[i-1.4,8,r*9],.6,.12,8,5),un.bone)});for(let i of[1,-1]){n.add("cracks1","glow",_.tube(ka(-8,44,10,48,i*9.4,5,.8,1),.3,14,4),ho),n.add("cracks2","glow",_.tube(ka(-6,34,10,36,i*8.6,5,.8,2),.3,14,4),ho);for(let s=0;s<3;s++)n.add("spark","glow",w(_.box(.5,.5,.5),2+s*3,44+s,i*9.6),Je("#e6ffb0",5))}return n.build()}var K2=new k;function j2(n,e,t,i,s,r){let o=Is(e,e.die*2);n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*20,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time,u=0,d=0,f=0,g=0,x=1;t.state==="tele"&&(l==="spawn"?u=a:l==="dash"?(d=a,x=1.6):f=a),e.kind==="spawn"?u=1-e.ap*.8:e.kind==="dash"?(d=-.8,g=1,x=2.2):e.kind==="lob"&&(f=1-e.ap*1.6),n.thorax.rotation.set(.04*Math.sin(h*1.2),0,-.18*g+.04*Math.sin(h*1.6)+.1*f*.5-e.die*.4),n.thorax.position.set(3*g,40+Math.sin(h*2.2)*.8,0),n.head.rotation.set(0,.12*Math.sin(h*.8),.3*f-.1*g),n.jaw.rotation.z=-.25*Math.max(f,c*.5)-.06*Math.sin(h*3);let m=Math.sin(h*2+u*6);n.abd.rotation.z=.06*Math.sin(h*1.1)-.15*u,n.abd.scale.set(1-.1*u+.03*m,1-.12*u+.03*m,1-.08*u+.03*m),n.abd2.rotation.z=.12*Math.sin(h*1.4-.7)-.3*u;let p=Math.sin(h*Ve*9*x);n.wN.rotation.x=-.3-.55*p,n.wF.rotation.x=.3+.55*p,n.wN2.rotation.x=-.4-.5*Math.sin(h*Ve*9*x+1),n.wF2.rotation.x=.4+.5*Math.sin(h*Ve*9*x+1);for(let M of["N","F"])n["sc"+M].rotation.z=.15*Math.sin(h*1.3)+.9*d,n["sc"+M+"k"].rotation.z=.2*Math.sin(h*1.3+.6)+.6*Math.max(0,d)-.5*Math.max(0,-d);for(let M=0;M<4;M++)n["l"+M].rotation.z=.15*Math.sin(h*1.7+M)-.3*g,n["l"+M+"k"].rotation.z=.2*Math.sin(h*1.7+M+.8)-.2;for(let[M,y]of[["cpN",1],["cpF",-1]]){let v=n[M].userData.rest;n[M].position.set(v.x,v.y+3*c,v.z+y*4*c),n[M].quaternion.setFromAxisAngle(K2.set(1,0,0),-y*.9*c)}r.fx.pulse(r.byMat.core,.4+.25*Math.sin(h*3)+c*2+e.die*Math.abs(Math.sin(h*29))*2),r.fx.pulse(r.byMat.accent,.45+1.6*Math.max(a,u)+1.2*e.atk),Rs(n,e,t),Cs(n,e,t,["plate0","plate1"],s),Ps(n,e,["head","wN","wF","wN2","wF2","scN","scF","abd","cpN","cpF"],19,44)}var Pn={metal:"#2a2430",metalL:"#433a4c",crys:"#8a4dff",crysL:"#c09aff",flesh:"#3a1a30",bone:"#cdbba2"},tf=Je("#c58aff",3.2),Ls=Je("#8fff3f",3.2);function Q2(){let n=new _t(.03571428571428571),e=[0,52,0];n.bone("body","root",0,52,0).bone("core","body",0,52,0).bone("pupil","core",0,52,8).bone("crown","body",0,74,0).bone("r0","body",0,52,0).bone("r1","body",0,52,0).bone("r2","body",0,52,0).bone("orbit","body",0,52,0).bone("plate0","body",30,52,0).bone("plate1","body",-30,52,0).bone("cracks1","core",0,52,0).bone("cracks2","core",0,52,0).bone("spark","body",0,52,0);for(let t=0;t<6;t++){let i=t/6*Ve+Math.PI/2;n.bone("p"+t,"body",Math.cos(i)*11,52+Math.sin(i)*11,13.5)}for(let t=0;t<4;t++){let i=-12+t*8;n.bone("td"+t,"body",i,30,(t%2?-1:1)*3).bone("td"+t+"b","td"+t,i*1.1,16,(t%2?-1:1)*3)}n.add("core","crystal",w(_.shard(12,40,8,91,.1),...e),Pn.crys),n.add("core","core",w(_.shard(5.6,34,8,92,.1),...e),Je("#d6a8ff",3)),n.add("core","core",w(_.torus(5.2,.9,6,24),0,52,8.4),Ls),n.add("pupil","metal",w(_.cyl(2.6,2.6,.8,16),0,52,9.6,[Math.PI/2,0,0]),"#0c0a10"),n.add("pupil","glow",w(_.torus(2.7,.3,4,16),0,52,10),Ls),n.add("body","metal",w(_.lathe([[.001,0],[14,2],[17,8],[15,14],[10,18],[.001,19]],14),0,26,-6,[0,0,0]),Pn.metal),n.add("body","paint",w(_.torus(16,2.2,8,28),0,52,-7),Pn.metalL),n.add("body","paint",w(_.cyl(15,15,4,24),0,52,-10,[Math.PI/2,0,0]),Pn.metal);for(let t=0;t<12;t++){let i=t/12*Ve;n.add("body","glow",w(_.box(.5,3.2,.5),Math.cos(i)*16.4,52+Math.sin(i)*16.4,-4.6,[0,0,i+Math.PI/2]),tf.map(s=>s*.7))}for(let t=0;t<6;t++){let i=t/6*Ve+Math.PI/2,s=Math.cos(i)*11,r=52+Math.sin(i)*11,o=_.ext([[0,-4.2],[22,-2.2],[30,0],[22,2.2],[0,4.2],[-1.6,0]],2.2,.6,{steps:2}),a=_.ext([[2,-4.6],[22,-2.6],[31,0],[22,-1.6],[2,-3.6]],2.4,.2);n.add("p"+t,"paint",w(o,s,r,13.5+t*.05,[0,0,i]),Pn.metalL),n.add("p"+t,"glow",w(a,s,r,13.6+t*.05,[0,0,i]),tf),n.add("p"+t,"metal",w(_.cyl(1.6,1.6,3.2,10),s,r,13.5,[Math.PI/2,0,0]),Pn.metal),n.add("p"+t,"crystal",w(_.crystal(1.1,4.4,5,.5,100+t),s+Math.cos(i)*16,r+Math.sin(i)*16,15,[Math.PI/2,0,0]),Pn.crysL)}n.add("r0","paint",w(_.torus(36,1.8,6,56),0,52,0),Pn.metal),n.add("r0","glow",w(_.torus(36,.5,4,56),0,52,1.6),tf.map(t=>t*.8)),n.add("r1","paint",w(_.torus(29,1.4,6,48),0,52,0,[1.1,0,0]),Pn.metalL),n.add("r1","glow",w(_.torus(29,.4,4,48),0,52,0,[1.1,0,0]),Ls.map(t=>t*.6)),n.add("r2","paint",w(_.torus(23,1.2,6,40),0,52,0,[0,1.2,0]),Pn.metalL);for(let t=0;t<8;t++){let i=t/8*Ve;n.add("r0","metal",w(_.box(3.2,3.2,4.4,.6),Math.cos(i)*36,52+Math.sin(i)*36,0,[0,0,i]),Pn.metalL)}n.add("plate0","paint",w(_.torus(40,1.6,6,14,1.2),0,52,-2,[0,0,-.6]),Pn.metalL),n.add("plate1","paint",w(_.torus(40,1.6,6,14,1.2),0,52,-2,[0,0,Math.PI-.6]),Pn.metalL);for(let t=0;t<5;t++){let i=t/5*Ve;n.add("orbit","crystal",w(_.shard(1.9,9,6,110+t),Math.cos(i)*41,52+Math.sin(i)*41,Math.sin(i*2)*4,[.3,0,i]),Pn.crysL)}jt(n,"crown",[[0,68,-3,3,26,0,0,3],[-8,66,-4,2.2,18,-.1,.35,5],[8,66,-4,2.2,18,-.1,-.35,7],[-15,63,-5,1.6,11,0,.7,9],[15,63,-5,1.6,11,0,-.7,11]],Pn.crys),n.add("crown","metal",w(_.box(30,4,8,1.2),0,68,-4),Pn.metal);for(let t=0;t<4;t++){let i=-12+t*8,s=(t%2?-1:1)*3;n.add("td"+t,"flesh",at([i,31,s],[i*1.05,24,s],[i*1.1,16,s],1.5,1.1,10,6),Pn.flesh);for(let r of[27,21])n.add("td"+t,"metal",w(_.torus(1.55,.4,4,10),i*(1+(31-r)/300),r,s,[Math.PI/2,0,0]),Pn.metalL);n.add("td"+t+"b","flesh",at([i*1.1,16,s],[i*1.15,9,s],[i*1.25,3,s],1.1,.35,10,6),Pn.flesh),n.add("td"+t+"b","glow",w(_.sph(.9,8,6),i*1.25,2.4,s),Ls)}n.add("cracks1","glow",_.tube([[-6,66,7],[-2,58,9],[-5,50,10],[1,42,9]],.35,12,4),Ls),n.add("cracks1","glow",_.tube([[6,64,7],[3,56,9.5],[7,48,8]],.35,10,4),Ls),n.add("cracks2","glow",_.tube([[-8,54,8],[-1,52,10.5],[9,54,8]],.4,10,4),Ls),n.add("cracks2","glow",_.tube([[2,70,4],[-3,62,8],[3,60,9]],.4,10,4),Ls);for(let t=0;t<4;t++)n.add("spark","glow",w(_.box(.7,.7,.7),-12+t*8,40+t%2*20,9),Je("#f0d8ff",5));return n.build()}var Yw=new k;function e_(n,e,t,i,s,r){let o=Is(e,e.die*2.4+(e.kind==="barrage"?.4:0));n.root.rotation.y=0;let a=e.teleS,l=e.next,c=e.open,h=e.time,u=e.kind,d=0,f=0,g=1,x=0,m=0,p=1;t.state==="tele"&&(l==="volley"||l==="spawn"?d=.4*a:l==="shockwave"?f=-.5*a:l==="beam"?m=a:l==="barrage"?g=1+5*a:l==="dash"?x=-.3*a:l==="lob"&&(p=1+3*a)),u==="volley"?d=.6*(1-e.ap):u==="shockwave"?f=e.ap<.2?-.5+e.ap*7:.9*(1-e.ap):u==="beam"?m=1:u==="spawn"?d=.5:u==="barrage"?g=7:u==="dash"?x=1:u==="lob"&&(p=4*(1-e.ap)+1),n.root.position.set(o[0]+x*10*(e.dir||-1),o[1]-e.die*e.die*24,o[2]),n.body.position.set(0,52+1.2*Math.sin(h*1.1)-6*Math.max(0,f)*.3,0),n.body.rotation.set(.04*Math.sin(h*.7),.08*Math.sin(h*.5),.03*Math.sin(h*.9)+e.die*.3*Math.sin(h*7));let M=Ct(1-c-d-e.die,0,1);e.close=yt(e.close==null?1:e.close,M,8,s);for(let P=0;P<6;P++)n["p"+P].rotation.set(0,0,2.2*e.close+.03*Math.sin(h*2+P));e.r0=(e.r0||0)+s*.25*g,e.r1=(e.r1||0)+s*.6*g,e.r2=(e.r2||0)+s*-.9*g,e.orb=(e.orb||0)+s*.4*p,n.r0.rotation.set(0,0,e.r0),n.r0.position.y=f*10,n.r0.scale.setScalar(1+Math.max(0,f)*.12),n.r1.rotation.set(0,e.r1,0),n.r1.position.y=f*7,n.r2.rotation.set(e.r2,0,0),n.orbit.rotation.set(0,0,e.orb),n.crown.rotation.z=.02*Math.sin(h*1.3);let y=Math.cos(e.aim)*(e.dir||-1),v=Math.sin(e.aim),E=m>0&&u==="beam"?-.9+e.ap*1.5:null,R=E!=null?Math.cos(E)*(e.dir||-1):y,C=E!=null?-Math.sin(E):v;e.px2=yt(e.px2||0,R*2.4,8,s),e.py2=yt(e.py2||0,C*2.4,8,s),n.pupil.position.set(e.px2,e.py2,8),n.pupil.scale.setScalar(1-.35*m+.2*c);for(let P=0;P<4;P++)n["td"+P].rotation.set(.1*Math.sin(h*1.3+P),0,.12*Math.sin(h*1.1+P*1.7)-x*.3*(e.dir||-1)),n["td"+P+"b"].rotation.z=.2*Math.sin(h*1.1+P*1.7-.8);n.core.scale.setScalar(1+.03*Math.sin(h*2.4)+e.die*.15*Math.sin(h*23)),r.fx.pulse(r.byMat.core,.5+.25*Math.sin(h*2.2)+c*1.8+m*1.2+e.die*Math.abs(Math.sin(h*33))*2),Rs(n,e,t),Cs(n,e,t,["plate0","plate1"],s),(t.phase||0)>=1&&!t.dying&&(n.r0.rotation.x=.15*Math.sin(h*3.1)),Ps(n,e,["p0","p1","p2","p3","p4","p5","r0","r1","r2","crown","orbit"],23,60)}var qp={colossus:{build:Z2,pose:$2},queen:{build:J2,pose:j2},machine:{build:Q2,pose:e_}};var t_=Object.assign({},Wp,qp);function n_(n){return(e,t)=>{let i={time:0,yaw:-Math.PI,dir:-1,sT:0};return{st:i,update(s,r,o){s=s||{},r=r||{};let a=Gp(i,s,r,o||0,e);n.pose(e.bones,i,s,r,a,e),e.fx.apply(i.flash,i.frost)}}}}var uo={};for(let[n,e]of Object.entries(t_))uo[n]={build:e.build,animator:n_(e)};var nf=["gem","pu_weapon","pu_energy","pu_life","pu_line","pu_bomb"],i_={pu_weapon:"#ffd23f",pu_energy:"#54e36b",pu_life:"#ff5d7a",pu_line:"#67ffd4",pu_bomb:"#a9eeff"},Xi=(n,e,t,i,s,r)=>sn(n,[e,t,i],s,r);function s_(n){let e=[],t=(i,s=1.1)=>_.ext(i,s,.18,{bevelSeg:1});if(n==="pu_energy")e.push(t([[.8,3.6],[-2,-.2],[-.2,-.2],[-1,-3.6],[2.1,.7],[.3,.7],[1.5,3.6]]));else if(n==="pu_life"){let i=[];for(let s=0;s<18;s++){let r=s/18*Ve;i.push([.19*16*Math.pow(Math.sin(r),3),.19*(13*Math.cos(r)-5*Math.cos(2*r)-2*Math.cos(3*r)-Math.cos(4*r))+.4])}e.push(t(i))}else if(n==="pu_weapon")for(let i of[-2.2,.4])e.push(t([[-2.6,i],[0,i+2.4],[2.6,i],[2.6,i+1.2],[0,i+3.6],[-2.6,i+1.2]]));else if(n==="pu_line")e.push(_.box(1,5.2,1)),e.push(t([[-1.8,2.2],[1.8,2.2],[0,4.1]]),t([[-1.8,-2.2],[0,-4.1],[1.8,-2.2]]));else if(n==="pu_bomb")for(let i=0;i<3;i++){e.push(Xi(_.box(.8,7.2,.8),0,0,0,[0,0,i*Math.PI/3]));for(let s of[1,-1])for(let r of[2.1]){let o=i*Math.PI/3+Math.PI/2,a=Math.cos(o)*r*s,l=Math.sin(o)*r*s;e.push(Xi(_.box(.5,1.9,.6),a,l,0,[0,0,o+Math.PI/2+.7])),e.push(Xi(_.box(.5,1.9,.6),a,l,0,[0,0,o+Math.PI/2-.7]))}}return e}function Yp(n){let e=new _t(.07142857142857142);if(n==="gem"){e.bone("spin","root",0,0,0).bone("core","spin",0,0,0).bone("orbit","root",0,0,0),e.add("core","core",_.shard(2,10.5,7,11,.1),Je("#2a7dff",3)),e.add("core","core",_.shard(1,12.5,5,12,.1),Je("#8fd0ff",2.6)),e.add("spin","glass",_.shard(4.6,16,7,5,.12),"#2f6fe0"),e.add("spin","crystal",Xi(_.shard(1.6,4.2,5,9),0,6.6,0),"#4a8cf0"),e.add("spin","crystal",Xi(_.shard(1.4,3.6,5,13),0,-6.6,0),"#2a5ec8");for(let s=0;s<3;s++){let r=s/3*Ve;e.add("orbit","crystal",Xi(_.shard(.7,2.6,5,20+s),Math.cos(r)*6.6,(s-1)*2.4,Math.sin(r)*6.6,[.3,r,.4]),"#8fd8ff")}return e.build()}let t=i_[n];e.bone("spin","root",0,0,0).bone("icon","spin",0,0,0);let i=[[.001,0],[4.9,0],[5.3,.4],[5.3,1.3],[4.7,1.8],[3.6,2],[1.4,2.5],[.001,2.6]];for(let s of[1,-1]){let r=_.lathe(i,12);e.add("spin","metal",Xi(r,0,s*5.2,0,s<0?[Math.PI,0,0]:null),"#8a919b"),e.add("spin","metal",Xi(_.torus(5.05,.42,4,16),0,s*5.55,0,[Math.PI/2,0,0]),t),e.add("spin","metal",Xi(_.cyl(1.1,1.3,.8,6),0,s*7.8,0),"#3a3e45")}for(let s=0;s<4;s++){let r=s*Math.PI/2+Math.PI/4;e.add("spin","metal",Xi(_.box(.7,10.6,.7),Math.cos(r)*4.75,0,Math.sin(r)*4.75),"#5a606a")}e.add("spin","glass",_.cyl(4.4,4.4,10.4,14,!0),t);for(let s of s_(n))e.add("icon","core",s,Je(t,4.2));return e.build()}function Zp(n,e){let t=n.bones,i={a:Math.random()*Ve,time:Math.random()*3},s=n.byMat.core;function r(o,a,l){l=Math.min(l,.05),i.time+=l,e==="gem"?(i.a+=l*1.9,t.spin.rotation.set(.18*Math.sin(i.time*1.3),i.a,.12),t.orbit.rotation.set(0,-i.a*1.6,.25),t.core.scale.setScalar(1+.08*Math.sin(i.time*5)),n.fx.pulse(s,.85+.3*(.5+.5*Math.sin(i.time*5)))):(i.a+=l*1.4,t.spin.rotation.set(.1*Math.sin(i.time*1.1),i.a,.08*Math.sin(i.time*.9)),t.icon.rotation.set(0,-i.a,0),n.fx.pulse(s,.8+.35*(.5+.5*Math.sin(i.time*4)))),n.fx.apply(0,0)}return{update:r}}function $p(){let n=new _t(.1);n.bone("disc","root",0,3.5,0).bone("led","disc",0,6.6,0),n.add("disc","metal",_.lathe([[.001,3.5],[3.3,3.5],[3.7,4],[3.6,4.7],[3,5],[.001,5]],16),"#3a3e45"),n.add("disc","paint",_.lathe([[.001,4.95],[2.9,4.95],[2.6,5.6],[1.6,6.1],[.001,6.2]],16),"#56677a"),n.add("disc","paint",sn(_.torus(3.45,.25,4,20),[0,4.4,0],[Math.PI/2,0,0]),"#c35f28");for(let e=0;e<4;e++){let t=e*Math.PI/2+.4;n.add("disc","metal",sn(_.box(1.1,.5,.6,.12),[Math.cos(t)*3.6,3.8,Math.sin(t)*3.6],[0,-t,0]),"#9aa3ad")}return n.add("disc","metal",sn(_.cyl(.65,.75,.5,8),[0,6.25,0]),"#1c1e22"),n.add("led","core",sn(_.sph(.55,8,6),[0,6.65,0]),Je("#ff3b30",5)),n.build()}function Jp(n){let e=n.bones,t={time:0,spin:Math.random()*Ve},i=n.byMat.core;function s(r,o,a){a=Math.min(a,.05),t.time+=a,r&&r.vy&&(t.spin+=a*4),e.disc.rotation.set(0,t.spin,0);let c=r&&r.life!=null&&r.life<1.2?9:3,h=t.time*c%1<.35;n.fx.pulse(i,h?1.3:.08),e.led.scale.setScalar(h?1.15:.9),n.fx.apply(0,0)}return{update:s}}var r_=Object.keys(lo),o_=Object.keys(uo);function Kp(n={}){let e=n.quality||"high",t=e==="low"?.6:e==="ultra"?1.25:1,i=Sp(e,n.renderer||null),s=new Map,r=(l,c)=>{let h=s.get(l);return h||(_p(t),h=c(),s.set(l,h)),h},o=(l,c,h={})=>{let u=new Jt;u.add(l.group);let d=!0;return Object.assign({root:u,update:c.update,dispose(){d&&(d=!1,u.remove(l.group),Mp(l))},_inst:l,_anim:c},h)},a={quality:e,hero(){let l=fr(r("hero",Cp),i),c=Pp(l,i),h=o(l,c);return h.muzzle=c.muzzle,h.getMuzzle=(u=new k)=>(h.root.updateWorldMatrix(!0,!1),u.copy(c.muzzle).applyMatrix4(h.root.matrixWorld)),h},fighter(){let l=fr(r("fighter",Ip),i);return o(l,Dp(l))},enemy(l){let c=Vp(l),h=lo[c],u=fr(r("enemy:"+c,h.build),i),d=h.animator(u,l);return o(u,d,{skin:c})},boss(l){let c=uo[l.key]||uo.warden,h=fr(r("boss:"+(uo[l.key]?l.key:"warden"),c.build),i);return o(h,c.animator(h,l))},pickup(l){let c=nf.includes(l)?l:"gem",h=fr(r("pickup:"+c,()=>Yp(c)),i,{shadow:!0});return o(h,Zp(h,c))},mine(){let l=fr(r("mine",$p),i);return o(l,Jp(l))},warm(l,c,h){let u=new Jt;u.name="actor-warm";let d=[a.hero(),a.fighter(),a.mine()];for(let f of r_)d.push(a.enemy({skin:f,type:lo[f].type}));for(let f of o_)d.push(a.boss({key:f}));for(let f of nf)d.push(a.pickup(f));if(d.forEach((f,g)=>{f.root.position.set(g%8*40,-Math.floor(g/8)*40,0),u.add(f.root)}),c&&l&&h){c.add(u);try{l.compile(c,h)}finally{c.remove(u)}}for(let f of d)f.dispose();return d.length},stats(){let l=0;for(let[c,h]of s)l+=h.tris;return{templates:s.size,tris:l}},dispose(){for(let l of s.values())for(let c of l.meshes)c.geometry.dispose();s.clear(),i.dispose()},_mats:i,_cache:s};return a}var a_=window.TData,l_=window.TRender,jp=new URLSearchParams(location.search),Si=n=>new Ue(n),Fi=pa.damp,fo=pa.clamp;function c_(n){let e=jp.get("q");if(["ultra","high","low"].includes(e))return e;try{let i=localStorage.getItem("shard.quality");if(["ultra","high","low"].includes(i))return i}catch{}if(matchMedia("(pointer: coarse)").matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent))return"low";try{let i=n.getContext(),s=i.getExtension("WEBGL_debug_renderer_info"),r=s?i.getParameter(s.UNMASKED_RENDERER_WEBGL):"";if(/RTX|RX ?[67]\d{3}|RX ?9\d{3}|Radeon Pro W|Arc\(TM\) A7|Apple M\d (Pro|Max|Ultra)/i.test(r))return"ultra"}catch{}return"high"}function h_(n){let e=Math.max(640,Math.min(1100,360*n));return[e,e/n]}function u_(n){let e=n.parentElement,t=document.createElement("canvas");t.id="gl",t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block",e.insertBefore(t,n);let i;try{if(i=new kc({canvas:t,antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1}),!i.capabilities.isWebGL2)throw Error("WebGL2 required")}catch(oe){return console.warn("WebGL2 unavailable, using the 2D renderer",oe),t.remove(),l_.createRenderer(n)}let s=c_(i);i.setPixelRatio(1),i.outputColorSpace=vn,i.toneMapping=Xr,i.toneMappingExposure=1.05,i.shadowMap.enabled=!0,i.shadowMap.type=Nl,i.info.autoReset=!1;let r=n.getContext("2d"),o=new Nr,a=new Ln(30,16/9,8,14e3),l=new na(16777215,2105376,.8);o.add(l);let c=new Wr(16777215,3);c.castShadow=!0,o.add(c,c.target);let h=new Wr(8965375,1.1);o.add(h,h.target);let u=new Jr(i),d=null,f=sp(o,s),g=ap(i,o,a,s),x=cp(r),m=Kp({quality:s,renderer:i}),p={backend:"Shard Assault 3D",quality:s,frames:0,drawCalls:0,triangles:0,frameMs:0,lights:0,resolution:1},M=null,y=zc[1],v=null,E=null,R=null,C=null,P=null,b=null,S=new Map,I=new Map,L=new Map,N=null,W=null,V=0,z=0,X=-1,q=0,ee=0,ce=0,be=0,Ce=0,Fe=0,Be=!1,ke=0,ne=new WeakMap,ie=new k,ge=16/9,ve=640,Se=360,Ze=0,ht=0,O=0,H=0,B=1,$=!0,Y=!1,K={x:0,y:0,yaw:0,pitch:.07,fov:30,lead:0,init:!1,zoom:1,panX:0,panY:0},se={z:1,x:0,y:0},fe=640,Ae=null,Ie=!1,D=0,T=null,j=0;window.__modernGraphics={stats:p,get scene(){return o},get camera(){return a},get renderer(){return i},get hero(){return C},kit:m,fx:f};function he(){let oe=window.devicePixelRatio||1;return s==="ultra"?Math.min(oe,2):s==="high"?Math.min(oe,1.5):Math.min(oe,2)}function Me(){let oe=t.getBoundingClientRect(),pe=Math.max(2,oe.width),G=Math.max(2,oe.height);ge=pe/G;let Le=he()*B,He=Math.round(pe*Le),et=Math.round(G*Le);(He!==O||et!==H)&&(O=He,H=et,i.setSize(O,H,!1),g.setSize(O,H),v&&v.water&&v.water.setSize(O,H)),[ve,Se]=h_(ge),a.aspect=ge,p.resolution=+Le.toFixed(2)}function de(oe){let pe=new Nr,G=new ti(50,32,16),Le=[],He=G.attributes.position,et=Si(oe.sky.zenith),_e=Si(oe.sky.mid),xt=Si(oe.sky.horizon),st=Si(oe.hemi.ground);for(let ue=0;ue<He.count;ue++){let Q=He.getY(ue)/50,Ee=Q>0?xt.clone().lerp(_e,Math.min(1,Q*3)).lerp(et,Math.max(0,Q*1.5-.5)):xt.clone().lerp(st,Math.min(1,-Q*4));Le.push(Ee.r,Ee.g,Ee.b)}G.setAttribute("color",new tt(Le,3)),pe.add(new rt(G,new cn({vertexColors:!0,side:_n})));let A=new k(...oe.sun.dir).normalize().multiplyScalar(40),F=new rt(new ti(6,12,8),new cn({color:Si(oe.sun.color).multiplyScalar(18)}));F.position.copy(A),pe.add(F);let te=new rt(new mn(60,20),new cn({color:Si(oe.accent).multiplyScalar(1.4),side:Qt}));te.position.set(0,-10,-45),pe.add(te),d&&d.dispose(),d=u.fromScene(pe,.03),o.environment=d.texture,o.environmentIntensity=oe.enclosed?.45:.6,pe.traverse(ue=>{ue.geometry&&ue.geometry.dispose(),ue.material&&ue.material.dispose()})}function $e(){for(let oe of S.values())o.remove(oe.root),oe.dispose&&oe.dispose();S.clear();for(let oe of I.values())o.remove(oe.root),oe.dispose&&oe.dispose();I.clear();for(let oe of L.values())o.remove(oe.root),oe.dispose&&oe.dispose();L.clear(),N&&(o.remove(N.root),N.dispose&&N.dispose(),N=null,W=null)}function Re(oe){let pe=performance.now();v&&(o.remove(v.group),v.dispose()),E&&(o.remove(E.group,E.sky),E.dispose()),R&&(o.remove(R.group),R.dispose()),$e(),f.clear(),M=oe,y=$d(oe),v=tp(oe,y,s),o.add(v.group);let G=v.water;g.setWater(G),G&&(G.setSize(O,H),G.setLite(!$),G.onEvent=Z),E=np(oe,y,v,s),o.add(E.group,E.sky),R=qe(oe,y,v),o.add(R.group),C||(C=m.hero(),o.add(C.root),P=m.fighter(),o.add(P.root),b=Ge(),o.add(b),C.root.traverse(He=>{He.isMesh&&(He.castShadow=!0)}),P.root.traverse(He=>{He.isMesh&&(He.castShadow=!0)})),l.color.set(y.hemi.sky),l.groundColor.set(y.hemi.ground),l.intensity=y.hemi.intensity,c.color.set(y.sun.color),c.intensity=y.sun.intensity,h.color.set(y.accent),h.intensity=y.enclosed?1.3:.9;let Le=s==="ultra"?4096:s==="high"?2048:1024;c.shadow.mapSize.set(Le,Le),c.shadow.map&&(c.shadow.map.dispose(),c.shadow.map=null),c.shadow.bias=-4e-4,c.shadow.normalBias=.6,c.shadow.radius=3,o.fog=new ko(Si(y.fog.color),y.fog.near,y.fog.far),o.background=Si(y.fog.color),i.toneMappingExposure=y.exposure,g.setGrade(y.grade),g.bloom.strength=y.bloom,g.bloom.threshold=.92,g.bloom.radius=.55,de(y),K.init=!1,z=0,X=-1,p.levelBuildMs=Math.round(performance.now()-pe),p.world=oe.world;try{m.warm&&m.warm(i,o,a),i.compile(o,a)}catch{}}function qe(oe,pe,G){let Le=new Jt,He=[],et=new Kt({color:"#6d7378",metalness:.85,roughness:.32});He.push(et);let _e=null,xt=null;if(oe.checkpoint){let st=oe.checkpoint,A=G.sample(st.x+10),F=new Jt;F.position.set(st.x+10,A,-18);let te=new rt(new Dn(1.4,2.2,46,10),et);te.position.y=23,F.add(te);let ue=new rt(new Dn(7,9,5,12),et);ue.position.y=2.5,F.add(ue);let Q=new rt(new ss(4.5,0),Ui("#ff5a6a",3));Q.position.y=50,F.add(Q);let Ee=new rt(new Zs(8,.6,6,32),new cn({color:Si("#ff5a6a").multiplyScalar(3),toneMapped:!1}));Ee.position.y=50,Ee.rotation.x=Math.PI/2,F.add(Ee),F.traverse(ze=>{ze.isMesh&&(ze.castShadow=!0)}),Le.add(F),_e={g:F,lamp:Q,ring:Ee,on:!1}}if(oe.exit){let st=oe.exit,A=new Jt;A.position.set(st.x+st.w/2,-(st.y+st.h),-6);for(let Q of[-1,1]){let Ee=new rt(new Wt(6,st.h+12,16),et);Ee.position.set(Q*(st.w/2+4),(st.h+12)/2,0),A.add(Ee);let ze=new rt(new Wt(1.2,st.h,1),new cn({color:Si(pe.accent).multiplyScalar(3),toneMapped:!1}));ze.position.set(Q*(st.w/2+1),st.h/2+4,8.5),A.add(ze)}let F=new rt(new Wt(st.w+20,6,18),et);F.position.y=st.h+12,A.add(F);let te={uTime:{value:0},uOpen:{value:0},uColor:{value:Si(pe.accent)}},ue=new rt(new mn(st.w+2,st.h+8),new vt({uniforms:te,transparent:!0,depthWrite:!1,blending:Mn,side:Qt,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uOpen;uniform vec3 uColor;void main(){vec2 c=vUv-.5;float r=length(c*vec2(1.,.7));float a=atan(c.y,c.x);
          float sw=sin(a*5.+r*30.-uTime*6.)*.5+.5;float lock=step(.5,fract(vUv.y*14.+uTime*.6))*.25;vec3 open=uColor*(sw*.9+.3)*smoothstep(.55,.1,r)*1.8;vec3 shut=vec3(1.,.15,.2)*(lock+.08)*(1.-smoothstep(.45,.5,abs(c.x)));
          gl_FragColor=vec4(mix(shut,open,uOpen),1.);}`}));ue.position.set(0,st.h/2+4,2),A.add(ue),A.traverse(Q=>{Q.isMesh&&Q.material===et&&(Q.castShadow=!0)}),Le.add(A),xt={g:A,fu:te}}return{group:Le,beacon:_e,gate:xt,update(st,A){if(_e){if(!!st.checkpoint&&!_e.on){_e.on=!0;let te=Si(pe.accent);_e.lamp.material.emissive.copy(te),_e.ring.material.color.copy(te).multiplyScalar(3),f.ring(oe.checkpoint.x+10,-(_e.g.position.y+50),pe.accent,60,.6)}_e.lamp.rotation.y=A*2,_e.ring.scale.setScalar(1+Math.sin(A*4)*.12),f.light(_e.g.position.x,_e.g.position.y+50,-10,_e.on?pe.accent:"#ff5a6a",.9,90)}xt&&(xt.fu.uTime.value=A,xt.fu.uOpen.value=Fi(xt.fu.uOpen.value,st.bossDead?1:0,3,1/60),st.bossDead&&f.light(xt.g.position.x,xt.g.position.y+30,10,pe.accent,1.6,140))},dispose(){Le.traverse(st=>{st.geometry&&st.geometry.dispose(),st.material&&st.material!==et&&st.material.dispose()}),et.dispose()}}}function Ge(){let oe=new rt(new ti(1,32,16),new vt({uniforms:{uTime:{value:0},uA:{value:0}},transparent:!0,depthWrite:!1,blending:Mn,vertexShader:"varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}",fragmentShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;uniform float uTime,uA;void main(){float f=pow(max(1.-abs(dot(vN,vV)),0.),2.5);float hex=step(.82,fract((vP.x+vP.y*.58)*6.)+fract(vP.y*6.-uTime));
        gl_FragColor=vec4(vec3(.35,.85,1.)*(f*1.6+hex*.25)*uA,1.);}`}));return oe.visible=!1,oe}function Te(oe,pe){for(let G of oe)switch(G.type){case"explosion":{if(G.kind==="burn"){f.burnUp(G.x,G.y,y);break}if(G.kind==="ice"){f.iceShatter(G.x,G.y),Qe(G.x,G.y,30,.35,.35);break}if(G.kind==="crystal"){f.crystalBurst(G.x,G.y,.6);break}let Le=1,He=pe.boss;if(He&&(He.dying||!He.alive)&&G.x>=He.x-20&&G.x<=He.x+He.w+20)Le=He.alive?1.5:2.6;else{let et=pe.enemies.find(_e=>!_e.alive&&Math.abs(_e.x+_e.w/2-G.x)<4&&Math.abs(_e.y+_e.h/2-G.y)<4);et&&(et.type==="drifter"||et.type==="hugger"||et.type==="egg")&&(Le=.75)}f.explosion(G.x,G.y,Le,y),Le>=1.4&&Qe(G.x,G.y,55*Le,.55,.6),v.water&&v.water.splash(G.x,G.y,Le*1.3)&&U(G.x,-v.water.surfaceAt(G.x).y,Le*.8);break}case"blast":f.blast(G.x,G.y,y),Qe(G.x,G.y,38,.55,.38),v.water&&v.water.splash(G.x,G.y,.8)&&U(G.x,-v.water.surfaceAt(G.x).y,.5);break;case"steam":f.puff(G.x,G.y,"#e6f0f2",2,6,{life:1,speed:24,rise:46,alpha:.35,grav:10});break;case"shatter":f.crystalBurst(G.x,G.y,G.charge||0),Qe(G.x,G.y,30+40*(G.charge||0),.4+.5*(G.charge||0),.42);break;case"prismfire":{let Le=G.charge||0,He=(G.dy||0)===0?Oe(pe.player):G;f.prismFire(He.x,He.y,Le,G.dx||1,G.dy||0),Le>.5&&Qe(He.x,He.y,26+34*Le,.35+.45*Le,.34);break}case"shardhit":f.sparks(G.x,G.y,"#f2e2ff",10,200,{life:.6}),f.glowBall(G.x,G.y,"#e8c8ff",12,.1,6,2);break;case"swap":{let Le=Oe(pe.player),He=We[G.weapon]||"#ffffff";f.ring(Le.x,Le.y,He,14,.22,{start:1}),f.sparks(Le.x,Le.y,He,8,110,{life:.5}),f.flashLight(Le.x,Le.y,He,2,80,.15);break}case"spark":f.sparks(G.x,G.y,"#ffe0a0",6,140,{life:.6}),f.glowBall(G.x,G.y,"#ffc070",6,.08);break;case"muzzle":{let Le=G.color||"#ffd23f";M.type!=="shmup"&&C&&C.getMuzzle&&C.root.visible&&(C.getMuzzle(ie),G={...G,x:ie.x,y:-ie.y}),f.glowBall(G.x,G.y,Le,9,.06,6,2.2),f.sparks(G.x,G.y,Le,3,120,{life:.4}),f.flashLight(G.x,G.y,Le,2.4,110,.07),Math.random()<.35&&f.puff(G.x,G.y,"#8a8a90",1,4,{life:.5,speed:20,alpha:.25}),pe.player.weapon==="spread"&&M.type!=="shmup"&&f.casing(G.x-pe.player.facing*6,G.y,pe.player.facing);break}case"pickup":f.sparks(G.x+8,G.y+8,G.color||"#9be6ff",18,150,{grav:-60,life:1.4}),f.ring(G.x+8,G.y+8,G.color||"#9be6ff",22,.35),f.flashLight(G.x+8,G.y+8,G.color||"#9be6ff",2.5,90,.25);break;case"splash":{let Le=v.water,He=Le&&Le.surfaceAt(G.x),et=He?-He.y:G.y;Le&&Le.splash(G.x,et,1.4),U(G.x,et,1);break}case"land":f.puff(G.x,G.y,y.top.color,5,6,{life:.7,speed:55,rise:8,alpha:.45,grav:-10});break;case"bubble":f.glow.emit(G.x,-G.y,2,(Math.random()-.5)*10,30,0,.4,.8,.9,.7,1.6,1.4,1.8,40,.5,0,0);break;case"updraft":f.glow.emit(G.x+(Math.random()-.5)*20,-G.y,(Math.random()-.5)*30,0,160,0,.5,.8,1,.6,.6,1.2,.4,0,.5,.02,0);break;case"hurt":q=1,be=Math.max(be,.012),f.shakeImpulse(.35),f.sparks(pe.player.x+7,pe.player.y+15,"#ff8a8a",10,140);break;case"flash":ee=1,Qe(pe.player.x+7,pe.player.y+15,260,.9,.85),f.ring(pe.player.x+7,pe.player.y+15,"#a9eeff",260,.9,{start:4}),f.ring(pe.player.x+7,pe.player.y+15,"#ffffff",140,.5,{start:2});for(let Le=0;Le<70;Le++){let He=Math.random()*6.28,et=80+Math.random()*260;f.glow.emit(pe.player.x+7,-(pe.player.y+15),(Math.random()-.5)*40,Math.cos(He)*et,Math.sin(He)*et,(Math.random()-.5)*90,.6,.9,1.2,1,1.2,2.2,.5,-80,1.8,.01,3)}break;case"line":f.shockwall(G.x,ht,Se);break;case"banner":x.setBanner(G.text,G.sub),G.text==="WARNING"&&(j=1.8);break}}let We={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9",seeker:"#ff9a3c",flare:"#ff6a2a",prism:"#d9a8ff"},it=[];function Qe(oe,pe,G,Le,He=.5){it.length>=6&&it.shift(),it.push({x:oe,y:pe,size:G,str:Le,life:He,age:0})}function Oe(oe){return M.type!=="shmup"&&C&&C.getMuzzle&&C.root.visible?(C.getMuzzle(ie),{x:ie.x,y:-ie.y}):{x:oe.x+oe.w/2+oe.facing*(oe.w/2+4),y:oe.y+oe.h/2}}function pt(oe,pe){let G=oe.player,Le=!G.dead&&!G.morph,He=null;if(Le&&(G.flaring||G.charging)){let _e=Oe(G);if(G.flaring&&!G.inWater){f.nozzle(_e.x,_e.y,G.facing,pe);let xt=_e.x+G.facing*48,st=_e.y-8+(G.flareAim||0)*30,A=le(xt,st),F=le(xt+70,st);A&&F&&(He={x:A.x,y:1-A.y,r:Math.abs(F.x-A.x)*ge,a:.9})}f.charge(_e.x,_e.y,G.charging?G.charge:0,pe,V)}else f.charge(0,0,0,pe,V);if(pe>0)for(let _e of oe.enemies)_e.alive&&_e.burn>0&&_e.x>Ze-40&&_e.x<Ze+fe+40&&f.burning(_e.x,_e.y,_e.w,_e.h,pe);for(let _e=it.length-1;_e>=0;_e--)it[_e].age+=pe,it[_e].age>=it[_e].life&&it.splice(_e,1);let et=[];for(let _e of it){let xt=_e.age/_e.life,st=le(_e.x,_e.y),A=le(_e.x+_e.size,_e.y);!st||!A||et.push({x:st.x,y:1-st.y,r:Math.abs(A.x-st.x)*ge*(.1+.9*(1-Math.pow(1-xt,2.4))),a:_e.str*(1-xt)*(1-xt)})}g.setShock(et,He,ge,V)}function U(oe,pe,G){let Le=Math.random;for(let He=0;He<Math.round(34*G);He++){let et=Le()*Math.PI,_e=(80+Le()*190)*G;f.glow.emit(oe+(Le()-.5)*8,-pe,(Le()-.5)*24,Math.cos(et)*_e*.55,Math.sin(et)*_e,(Le()-.5)*70,.7,.95,1.1,.95,.55+Le()*.5,1.1+Le()*1.2,.5,-760,.6,.016,0)}for(let He=0;He<Math.round(10*G);He++)f.glow.emit(oe+(Le()-.5)*14,-pe+2,(Le()-.5)*16,(Le()-.5)*30,40+Le()*70,0,.9,1,1.1,.6,.35,4+Le()*3,9,-200,2,0,0);f.puff(oe,pe-4,"#dff6f8",Math.round(4*G),9*G,{life:1.1,speed:26,rise:18,alpha:.28,z:4}),f.ring(oe,pe,"#bff4ff",30*G,.7,{flat:!0,z:0}),f.ring(oe,pe,"#ffffff",16*G,.4,{flat:!0,z:0})}function Z(oe,pe,G,Le){oe==="plip"?(f.sparks(pe,G,"#cdf6ff",5,90,{life:.45,grav:-500}),f.ring(pe,G,"#bff4ff",10,.45,{flat:!0,z:0})):oe==="splash"?U(pe,G,.7):oe==="drip"&&f.ring(pe,G,"#bff4ff",9,.6,{flat:!0,z:0}),Ae&&Ae(oe,pe,G,Le)}function ae(oe,pe){let G=oe.player,Le=M.cols*as,He=M.rows*as,et=Math.max(0,Math.min(Math.max(0,Le-ve),oe.cam.x-(ve-640)/2)),_e=Math.max(0,Math.min(Math.max(0,He-Se),oe.cam.y-(Se-360)/2)),xt=et+ve/2,st=_e+Se/2,A=M.type==="shmup",F=oe.boss&&oe.boss.alive&&oe.boss.awake,te=A?0:fo(G.vx*.12,-26,26)*(G.dead?0:1);K.lead=Fi(K.lead,te,1.6,pe),xt=fo(xt+K.lead,ve/2,Math.max(ve/2,Le-ve/2));let ue=A?-.06:fo(-G.vx/205*.045,-.05,.05)+0,Q=A||F?.05:.075;K.init||(K.x=xt,K.y=st,K.yaw=-.5,K.pitch=.22,K.fov=22,K.init=!0);let Ee=Math.max(0,1-z/2.4),ze=Ee*Ee*(3-2*Ee);K.x=Fi(K.x,xt,8,pe),K.y=Fi(K.y,st,8,pe),K.yaw=Fi(K.yaw,ue,Ee>0?2.2:1.8,pe),K.pitch=Fi(K.pitch,Q,2.2,pe),K.fov=Fi(K.fov,F?31.5:30,2,pe);let nt=K.yaw,Ke=K.pitch,ft=1+ze*-.35;if(j>0&&oe.boss){j-=pe;let Vt=Math.sin(Math.min(1,j/1.8)*Math.PI)*.5;xt+=(oe.boss.x+oe.boss.w/2-xt)*0,nt+=-.08*Vt*Math.sign(oe.boss.x+oe.boss.w/2-K.x),Ke-=.03*Vt,ft*=1-.08*Vt}(oe.won||oe.gameOver)&&(nt+=Math.sin(z*.25)*.12,ft*=.92);let mt=K.fov;a.fov=mt,a.updateProjectionMatrix();let lt=Se/2/Math.tan(pa.degToRad(mt/2))*ft/K.zoom,wt=f.shake+Math.min(1.5,oe.shake*.12),Ht=(Math.sin(V*71)+Math.sin(V*113)*.5)*wt*2.2,nn=(Math.cos(V*83)+Math.cos(V*127)*.5)*wt*2.2,Et=new k(K.x+Ht,-K.y+nn,0);Ee>0&&(Et.x=K.x*(1-ze)+(G.x+7)*ze,Et.y=-(K.y*(1-ze)+(G.y+15)*ze)),K.zoom=Fi(K.zoom,se.z,9,pe),K.panX=Fi(K.panX,se.x,9,pe),K.panY=Fi(K.panY,se.y,9,pe);let Ut=K.zoom,ut=fo((Ut-1)/.7,0,1)*.85;if(Et.x+=(G.x+7-Et.x)*ut+K.panX*ve,Et.y+=(-(G.y+15)-Et.y)*ut+K.panY*Se,Ut<1){let Vt=ve/Ut/2,qn=Se/Ut/2;Et.x=fo(Et.x,Math.min(Vt,Le/2),Math.max(Le-Vt,Le/2)),Et.y=fo(Et.y,-Math.max(He-qn,He/2),-Math.min(qn,He/2))}a.position.set(Et.x+Math.sin(nt)*Math.cos(Ke)*lt,Et.y+Math.sin(Ke)*lt,Math.cos(nt)*Math.cos(Ke)*lt),a.lookAt(Et),a.rotateZ(wt*.004*Math.sin(V*57)),fe=ve/Math.min(1,Ut),Ze=(Ut<1?Et.x:K.x)-fe/2,ht=K.y-Se/2;let $t=new k(...y.sun.dir).normalize(),Rt=Math.max(ve,Se)*.75+120,dn=c.shadow.camera;dn.left=-Rt,dn.right=Rt,dn.top=Rt*.8,dn.bottom=-Rt*.8,dn.near=10,dn.far=2400,dn.updateProjectionMatrix();let wi=Rt*2/c.shadow.mapSize.x,On=Math.round(K.x/wi)*wi,ls=Math.round(-K.y/wi)*wi;c.target.position.set(On,ls,-60),c.position.set(On+$t.x*1e3,ls+$t.y*1e3,-60+$t.z*1e3),h.target.position.set(K.x,-K.y,0),h.position.set(K.x+200,-K.y+260,-400)}function xe(oe,pe){return oe>Ze-pe&&oe<Ze+fe+pe}function J(oe,pe){let G=oe.player,Le=M.type==="shmup",He=G.invuln>0&&!G.dead?Math.floor(V*18)%3!==0:!0;C.root.visible=!Le&&!G.dead&&He,P.root.visible=Le&&!G.dead&&He,Le?(P.root.position.set(G.x+G.w/2,-(G.y+G.h/2),0),P.update(G,oe,pe,V)):(C.root.position.set(G.x+G.w/2,-(G.y+G.h),0),C.update(G,oe,pe,V)),b.visible=!G.dead&&G.invuln>0,b.visible&&(b.position.set(G.x+G.w/2,-(G.y+G.h/2),0),b.scale.setScalar(Le?20:G.morph?13:21),b.material.uniforms.uTime.value=V,b.material.uniforms.uA.value=Math.min(1,G.invuln*2)*(.6+.4*Math.sin(V*20))),G.dead&&!Be&&(f.explosion(G.x+G.w/2,G.y+G.h/2,1.6,y),f.ring(G.x+G.w/2,G.y+G.h/2,y.accent,90,.6),f.chunks(G.x+G.w/2,G.y+G.h/2,"#9aa6b0",12,220,1.8,.3),f.shakeImpulse(.6),be=.02),Be=G.dead,G.dead||(f.light(G.x+G.w/2,-(G.y+10),26,Le?"#9fd8ff":y.accent,.35,90),!Le&&G.onGround&&Math.abs(G.vx)>120&&Math.random()<pe*7&&f.puff(G.x+G.w/2-Math.sign(G.vx)*4,G.y+G.h,y.top.color,1,4,{life:.6,speed:20,rise:10,alpha:.35}),G.morph&&G.onGround&&Math.abs(G.vx)>60&&Math.random()<pe*25&&f.sparks(G.x+G.w/2-Math.sign(G.vx)*7,G.y+G.h-1,"#ffcb78",2,60,{life:.6}),Le&&Math.random()<pe*60&&f.glow.emit(G.x-2,-(G.y+G.h/2),0,-160-Math.random()*80,(Math.random()-.5)*20,0,.6,1,1.8,1,.18,3.2,.6,0,1,0,0)),G.inWater&&Math.random()<pe*3&&f.glow.emit(G.x+G.w/2,-(G.y+6),3,(Math.random()-.5)*8,25,0,.4,.8,.9,.6,1.4,1.2,1.6,35,.5,0,0);let et=new Set;for(let F of oe.enemies){if(!F.alive||!xe(F.x,120))continue;et.add(F);let te=S.get(F);te||(te=m.enemy(F),te.root.traverse(Ee=>{Ee.isMesh&&(Ee.castShadow=!0)}),o.add(te.root),S.set(F,te)),te.root.position.set(F.x+F.w/2,-(F.y+F.h),0),te.update(F,oe,pe,V);let ue=F.hitFlash||0,Q=ne.get(F)||0;ue>Q+.01&&pe>0&&(f.sparks(F.x+F.w/2,F.y+F.h/2,"#ffd8a0",5,150,{life:.5}),f.glowBall(F.x+F.w/2,F.y+F.h/2,"#ffe2b0",7,.06,8,1.6)),ne.set(F,ue),oe.freeze>0&&Math.random()<pe*3&&f.glow.emit(F.x+Math.random()*F.w,-(F.y+Math.random()*F.h),6,0,8,0,.5,.8,1,.8,.8,1.6,.4,0,.5,0,0)}for(let[F,te]of S)et.has(F)||(o.remove(te.root),te.dispose&&te.dispose(),S.delete(F));let _e=new Set,xt=0;for(let F of oe.pickups){if(F.taken||!xe(F.x,60))continue;_e.add(F);let te=I.get(F);te||(te=m.pickup(F.type),o.add(te.root),I.set(F,te)),te.root.position.set(F.x+F.w/2,-(F.y+F.h/2),0),te.update(F,oe,pe,V),xt<(s==="low"?1:3)&&Math.abs(F.x-G.x)<200&&(f.light(F.x+8,-(F.y+8),14,F.type==="gem"?"#4ce4ff":"#ffd23f",.45,60),xt++)}for(let[F,te]of I)_e.has(F)||(o.remove(te.root),te.dispose&&te.dispose(),I.delete(F));let st=new Set(oe.mines);for(let F of oe.mines){let te=L.get(F);te||(te=m.mine(),o.add(te.root),L.set(F,te)),te.root.position.set(F.x,-F.y,0),te.update(F,oe,pe,V),Math.floor(V*6)%2===0&&f.light(F.x,-F.y+3,8,"#ff3030",.25,30)}for(let[F,te]of L)st.has(F)||(o.remove(te.root),te.dispose&&te.dispose(),L.delete(F));let A=oe.boss;if(A&&A.alive){if((!N||W!==A)&&(N&&(o.remove(N.root),N.dispose&&N.dispose()),N=m.boss(A),W=A,N.root.traverse(F=>{F.isMesh&&(F.castShadow=!0)}),o.add(N.root)),N.root.visible=!0,N.root.position.set(A.x+A.w/2,-(A.y+A.h),0),N.update(A,oe,pe,V),A.open&&f.light(A.x+A.w/2,-(A.y+A.h/2),40,"#ffd27a",2.2,180),(A.hitFlash||0)>ke+.01&&pe>0){let F=A.x+A.w*(A.open?.5:.15+Math.random()*.7),te=A.y+A.h*(A.open?.5:.2+Math.random()*.6);f.sparks(F,te,A.open?"#fff0a0":"#c8d8ff",A.open?8:5,A.open?220:170,{life:.5})}ke=A.hitFlash||0,A.dying&&Math.random()<pe*14&&f.sparks(A.x+Math.random()*A.w,A.y+Math.random()*A.h,"#ffc070",6,200)}else N&&(o.remove(N.root),N.dispose&&N.dispose(),N=null,W=null)}function re(oe,pe){let G=y.ambient,Le=fe*Se/230400,He=Ze-60,et=ht,_e=Math.random,xt=fe,st=(M.windX||0)*(oe.windPhase||0);if(G==="dust"){for(let A=0;A<Le*pe*30;A++)f.smoke.emit(He+_e()*(xt+120),-(et+_e()*Se),-60+_e()*90,60+st*.8+_e()*40,(_e()-.5)*14,0,.85,.68,.5,.18,3,1.4,2.4,0,.2,0,0);Math.abs(st)>60&&_e()<pe*4&&f.smoke.emit(He+_e()*xt,-(et+Se*.6+_e()*Se*.4),-40+_e()*60,st*1.6,10,0,.8,.6,.45,.12,2.2,18,46,0,.4,0,0)}else if(G==="motes")for(let A=0;A<Le*pe*22;A++)f.glow.emit(He+_e()*(xt+120),-(et+_e()*Se),-120+_e()*150,(_e()-.5)*8,6+_e()*8,0,.25,.9,.75,.8,4,1.2,.4,0,.1,0,0);else if(G==="speed")for(let A=0;A<Le*pe*40;A++)f.glow.emit(Ze+xt+20,-(et+_e()*Se),-200+_e()*200,-900-_e()*500,0,0,.35,.35,.6,.6,1.4,1.5,1.5,0,.05,.03,0);else if(G==="embers"){for(let A=0;A<Le*pe*26;A++)f.glow.emit(He+_e()*(xt+120),-(et+Se+10),-150+_e()*170,(_e()-.5)*30,40+_e()*60,0,1.8,.6,.15,1,3.5,1.1,.3,8,.3,.01,0);_e()<pe*8&&f.smoke.emit(He+_e()*xt,-(et+Se),-200+_e()*80,10,30,0,.25,.22,.2,.4,6,40,120,4,.2,0,0)}else if(G==="spores")for(let A=0;A<Le*pe*16;A++){let F=_e()<.4;f.glow.emit(He+_e()*(xt+120),-(et+_e()*Se),-150+_e()*180,(_e()-.5)*14,(_e()-.5)*14,0,F?.7:.9,F?1.6:.5,F?.4:1.5,.9,5,1.6,.3,0,.1,0,0)}}function me(){if(v.crateIndex.size){for(let oe of[...v.crateIndex.keys()])if(M.tiles[oe]!==6){let pe=v.removeCrate(oe);pe&&(f.chunks(pe.x,-pe.y,M.type==="shmup"?"#3a3f52":"#8a6a44",14,200,2.6,.2),f.sparks(pe.x,-pe.y,y.accent,14,200))}}}function ye(oe,pe){let G=performance.now();Ie=!1,Me(),(!M||oe.level!==M)&&Re(oe.level),pe=Math.min(.05,Math.max(0,pe)),V+=pe,z+=pe,oe.frame!==X&&(Te(oe.events,oe),X=oe.frame,oe.events.length=0),me(),ae(oe,pe),J(oe,pe);let Le=null;if(M.type!=="shmup"&&oe.player.beamActive&&C.getMuzzle&&(C.getMuzzle(ie),Le={x:ie.x,y:-ie.y}),f.drawShots(oe,Ze,fe,pe),f.drawBeam(oe.player,V,y,Le),f.moveWalls(oe.floats),pt(oe,pe),pe>0){re(oe,pe);for(let et of v.falls)et.x>Ze-60&&et.x<Ze+fe+60&&(Math.random()<pe*14&&f.puff(et.x+(Math.random()-.5)*20,-(et.bot+40),"#e8f6ff",1,10,{life:1.6,speed:30,rise:26,alpha:.3,z:-40}),Math.random()<pe*30&&f.glow.emit(et.x+(Math.random()-.5)*20,et.bot+40,-40,(Math.random()-.5)*60,40+Math.random()*60,(Math.random()-.5)*30,.5,.7,.8,.7,.7,1.2,.5,-300,.6,.01,0))}R.update(oe,V),v.update(V,pe,oe),E.update(V,a),v.water&&(a.updateMatrixWorld(),v.water.update(V,pe,oe,a,Ze,fe));for(let et of v.fg){let _e=Math.abs(et.position.x-(oe.player.x+7));et.visible=_e>60||et.position.x<Ze-200||et.position.x>Ze+ve+200}f.update(pe,V,M,{x:K.x},(et,_e)=>{let xt=Math.floor(et/as),st=Math.floor(_e/as);return xt<0||xt>=M.cols?!1:st>=M.rows?!0:st<0?!1:M.tiles[st*M.cols+xt]===1}),q=Math.max(0,q-pe*2.2),ee=Math.max(0,ee-pe*2.5),be=Math.max(0,be-pe*.04),ce=Fi(ce,oe.freeze>0?1:0,4,pe||.016);let He=g.u;He.uTime.value=V,He.uHurt.value=q*.8,He.uFlash.value=ee*.55,He.uFrost.value=ce,He.uCA.value=be+f.shake*.004,He.uScan.value=Y?1:0,He.uFade.value=0,Xe(),r.clearRect(0,0,960,540),x.draw(oe,ge,le,V,pe,t.clientHeight),p.frames++,p.frameMs=p.frameMs*.94+(performance.now()-G)*.06,Ft(pe)}function Xe(){i.info.reset(),$?g.render():i.render(o,a),p.drawCalls=i.info.render.calls,p.triangles=i.info.render.triangles,p.lights=f.stats().lights}let je=new k;function le(oe,pe){return je.set(oe,-pe,0).project(a),je.z>1?null:{x:(je.x+1)/2,y:(1-je.y)/2}}let De=0,It=0;function Ft(oe){if(jp.has("fixed")||oe<=0)return;let pe=oe*1e3;pe>19.5?(De+=oe,It=0):pe<15.5&&(It+=oe,De=Math.max(0,De-oe*.5)),De>.8&&B>.55?(B=Math.max(.55,B-.1),De=0):It>4&&B<1&&(B=Math.min(1,B+.05),It=0)}let Yt=null;function fn(oe){if(Me(),oe=Math.min(.05,Math.max(0,oe)),V+=oe,D+=oe,!Ie||!Yt||M!==Yt){Yt||(Yt=a_.buildLevel(0,0)),M!==Yt&&Re(Yt);let F=null;for(let Q=12;Q<Math.min(Yt.cols-10,90);Q++){let Ee=v.ground[Q];Ee>-Yt.rows*as&&(!F||Ee>F.gy+15)&&(F={tx:Q,gy:Ee})}let te=(F?F.tx:20)*as+10,ue=F?F.gy:v.ground[20];T={x:te-7,y:-ue-30,w:14,h:30,vx:0,vy:0,facing:-1,onGround:!0,crouch:!1,morph:!1,weapon:"beam",weapons:{spread:3,beam:3,bounce:3},beamActive:!1,beamAngle:0,cooldown:0,invuln:0,dead:!1,energy:100,maxEnergy:100,lives:3,inWater:!1},Ie=!0,D=0}let pe=T,G={player:pe,level:Yt,freeze:0,enemies:[],pickups:[],pshots:[],eshots:[],mines:[],floats:[],cam:{x:pe.x-320,y:0},time:999,shake:0,boss:null,windPhase:Math.sin(D*.3),frame:-1};C.root.visible=!0,P.root.visible=!1,b.visible=!1,C.root.position.set(pe.x+7,-(pe.y+30),0),C.update(pe,G,oe,V);let Le=.34+Math.sin(D*.11)*.1,He=-.05+Math.sin(D*.07)*.02,et=190+Math.sin(D*.09)*14,_e=new k(pe.x+7-62,-(pe.y-6),0);a.fov=34,a.aspect=ge,a.updateProjectionMatrix(),a.position.set(_e.x+Math.sin(Le)*et,_e.y+Math.sin(He)*et+6,Math.cos(Le)*et),a.lookAt(_e),Ze=_e.x-ve/2,ht=-_e.y-Se/2,K.x=_e.x,K.y=-_e.y;let xt=new k(...y.sun.dir).normalize(),st=c.shadow.camera;st.left=-300,st.right=300,st.top=220,st.bottom=-220,st.near=10,st.far=2400,st.updateProjectionMatrix(),c.target.position.set(_e.x,_e.y,-60),c.position.set(_e.x+xt.x*1e3,_e.y+xt.y*1e3,-60+xt.z*1e3),oe>0&&re(G,oe),f.light(pe.x+7,-(pe.y+10),20,y.accent,.5,80),v.update(V,oe,G),E.update(V,a),f.update(oe,V,M,{x:_e.x},()=>!1),it.length=0,g.setShock(it,null,ge,V),f.charge(0,0,0,oe,V);let A=g.u;A.uTime.value=V,A.uHurt.value=0,A.uFlash.value=0,A.uFrost.value=0,A.uCA.value=0,A.uFade.value=Math.max(0,1-D*1.2),Xe(),r.clearRect(0,0,960,540)}function rn(oe){s=oe>=6?"ultra":oe>=3?"high":"low",p.quality=s,B=1,O=0,Me();let pe=s==="ultra"?4096:s==="high"?2048:1024;c.shadow.mapSize.x!==pe&&(c.shadow.mapSize.set(pe,pe),c.shadow.map&&(c.shadow.map.dispose(),c.shadow.map=null))}function ln(oe){$=oe,oe||(B=.7,O=0),oe?a.layers.disable(1):a.layers.enable(1),v&&v.water&&v.water.setLite(!oe)}function ri(oe,pe,G){se.z=oe,se.x=pe||0,se.y=G||0}return{setLevel:Re,render:ye,renderTitle:fn,setCRT(oe){Y=oe},setFX:ln,setResolution:rn,setZoom:ri,get zoom(){return K.zoom},set onWater(oe){Ae=oe},get buffer(){return t},get quality(){return s},particles:[]}}window.TRender={createRenderer:u_};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
