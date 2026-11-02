(()=>{var Fd=0,eu=1,kd=2;var tu=1,Ul=2,Oi=3,Ti=0,gn=1,jt=2,fn=0,Ki=1,An=2,nu=3,iu=4,Fl=5,si=100,Od=101,zd=102,Bd=103,Hd=104,$s=200,Vd=201,Gd=202,Wd=203,ll=204,cl=205,ra=206,Xd=207,oa=208,qd=209,Yd=210,Zd=211,$d=212,Jd=213,Kd=214,kl=0,Ol=1,zl=2,ks=3,Bl=4,Hl=5,Vl=6,Gl=7,su=0,jd=1,Qd=2,is=0,Wl=1,Xl=2,ql=3,Hr=4,Yl=5,Zl=6,$l=7,Vh="attached",ef="detached",ru=300,Js=301,Ks=302,Jl=303,Kl=304,aa=306,kn=1e3,Ui=1001,hl=1002,mn=1003,tf=1004;var la=1005;var Cn=1006,jl=1007;var pi=1008;var qn=1009,ou=1010,au=1011,Vr=1012,Ql=1013,zi=1014,mi=1015,xn=1016,ec=1017,tc=1018,xs=1020,lu=35902,cu=35899,hu=1021,uu=1022,vn=1023,Tr=1026,vs=1027,ys=1028,nc=1029,du=1030,ic=1031;var sc=1033,ca=33776,ha=33777,ua=33778,da=33779,rc=35840,oc=35841,ac=35842,lc=35843,cc=36196,hc=37492,uc=37496,dc=37808,fc=37809,pc=37810,mc=37811,gc=37812,xc=37813,vc=37814,yc=37815,_c=37816,Mc=37817,bc=37818,Sc=37819,wc=37820,Ec=37821,Tc=36492,Ac=36494,Rc=36495,Cc=36283,Pc=36284,Ic=36285,Dc=36286;var Eo=2300,ul=2301,al=2302,Gh=2400,Wh=2401,Xh=2402;var nf=3200,sf=3201;var Lc=0,rf=1,gi="",pn="srgb",Os="srgb-linear",To="linear",Ot="srgb";var Fs=7680;var qh=519,of=512,af=513,lf=514,fu=515,cf=516,hf=517,uf=518,df=519,Yh=35044,Gr=35048;var pu="300 es",Ei=2e3,Ao=2001;var ji=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],id=1234567,Mo=Math.PI/180,Ar=180/Math.PI;function _s(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Un[n&255]+Un[n>>8&255]+Un[n>>16&255]+Un[n>>24&255]+"-"+Un[e&255]+Un[e>>8&255]+"-"+Un[e>>16&15|64]+Un[e>>24&255]+"-"+Un[t&63|128]+Un[t>>8&255]+"-"+Un[t>>16&255]+Un[t>>24&255]+Un[i&255]+Un[i>>8&255]+Un[i>>16&255]+Un[i>>24&255]).toLowerCase()}function bt(n,e,t){return Math.max(e,Math.min(t,n))}function mu(n,e){return(n%e+e)%e}function Kp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function jp(n,e,t){return n!==e?(t-n)/(e-n):0}function bo(n,e,t){return(1-t)*n+t*e}function Qp(n,e,t,i){return bo(n,e,1-Math.exp(-t*i))}function e0(n,e=1){return e-Math.abs(mu(n,e*2)-e)}function t0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function n0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function i0(n,e){return n+Math.floor(Math.random()*(e-n+1))}function s0(n,e){return n+Math.random()*(e-n)}function r0(n){return n*(.5-Math.random())}function o0(n){n!==void 0&&(id=n);let e=id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function a0(n){return n*Mo}function l0(n){return n*Ar}function c0(n){return(n&n-1)===0&&n!==0}function h0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function u0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function d0(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+i)/2),h=o((e+i)/2),u=r((e-i)/2),f=o((e-i)/2),d=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*h,l*u,l*f,a*c);break;case"YZY":n.set(l*f,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*f,a*h,a*c);break;case"XZX":n.set(a*h,l*g,l*d,a*c);break;case"YXY":n.set(l*d,a*h,l*g,a*c);break;case"ZYZ":n.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function wr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Wn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var fa={DEG2RAD:Mo,RAD2DEG:Ar,generateUUID:_s,clamp:bt,euclideanModulo:mu,mapLinear:Kp,inverseLerp:jp,lerp:bo,damp:Qp,pingpong:e0,smoothstep:t0,smootherstep:n0,randInt:i0,randFloat:s0,randFloatSpread:r0,seededRandom:o0,degToRad:a0,radToDeg:l0,isPowerOfTwo:c0,ceilPowerOfTwo:h0,floorPowerOfTwo:u0,setQuaternionFromProperEuler:d0,normalize:Wn,denormalize:wr},xe=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=bt(this.x,e.x,t.x),this.y=bt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=bt(this.x,e,t),this.y=bt(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$n=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=x;return}if(u!==x||l!==f||c!==d||h!==g){let m=1-a,p=l*f+c*d+h*g+u*x,M=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let T=Math.sqrt(y),A=Math.atan2(T,p*M);m=Math.sin(m*A)/T,a=Math.sin(a*A)/T}let v=a*M;if(l=l*m+f*v,c=c*m+d*v,h=h*m+g*v,u=u*m+x*v,m===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-a*d,e[t+2]=c*g+h*d+a*f-l*u,e[t+3]=h*g-a*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),f=l(i/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=i+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(i>a&&i>u){let d=2*Math.sqrt(1+i-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-i-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-i-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*i+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},F=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),h=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=bt(this.x,e.x,t.x),this.y=bt(this.y,e.y,t.y),this.z=bt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=bt(this.x,e,t),this.y=bt(this.y,e,t),this.z=bt(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ph.copy(this).projectOnVector(e),this.sub(ph)}reflect(e){return this.sub(ph.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ph=new F,sd=new $n,_t=class n{constructor(e,t,i,s,r,o,a,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],g=i[8],x=s[0],m=s[3],p=s[6],M=s[1],y=s[4],v=s[7],T=s[2],A=s[5],P=s[8];return r[0]=o*x+a*M+l*T,r[3]=o*m+a*y+l*A,r[6]=o*p+a*v+l*P,r[1]=c*x+h*M+u*T,r[4]=c*m+h*y+u*A,r[7]=c*p+h*v+u*P,r[2]=f*x+d*M+g*T,r[5]=f*m+d*y+g*A,r[8]=f*p+d*v+g*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,g=t*u+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(s*c-h*i)*x,e[2]=(a*i-s*o)*x,e[3]=f*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=d*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(mh.makeScale(e,t)),this}rotate(e){return this.premultiply(mh.makeRotation(-e)),this}translate(e,t){return this.premultiply(mh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},mh=new _t;function gu(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ro(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function ff(){let n=Ro("canvas");return n.style.display="block",n}var rd={};function Rr(n){n in rd||(rd[n]=!0,console.warn(n))}function pf(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var od=new _t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ad=new _t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function f0(){let n={enabled:!0,workingColorSpace:Os,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Ot&&(s.r=Ji(s.r),s.g=Ji(s.g),s.b=Ji(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ot&&(s.r=Er(s.r),s.g=Er(s.g),s.b=Er(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===gi?To:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Rr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Rr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Os]:{primaries:e,whitePoint:i,transfer:To,toXYZ:od,fromXYZ:ad,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:pn},outputColorSpaceConfig:{drawingBufferColorSpace:pn}},[pn]:{primaries:e,whitePoint:i,transfer:Ot,toXYZ:od,fromXYZ:ad,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:pn}}}),n}var Pt=f0();function Ji(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Er(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var ur,dl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ur===void 0&&(ur=Ro("canvas")),ur.width=e.width,ur.height=e.height;let s=ur.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ur}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ro("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ji(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ji(t[i]/255)*255):t[i]=Ji(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},p0=0,Cr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=_s(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(gh(s[o].image)):r.push(gh(s[o]))}else r=gh(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function gh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?dl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var m0=0,xh=new F,Xn=class n extends ji{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Ui,s=Ui,r=Cn,o=pi,a=vn,l=qn,c=n.DEFAULT_ANISOTROPY,h=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:m0++}),this.uuid=_s(),this.name="",this.source=new Cr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new _t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(xh).x}get height(){return this.source.getSize(xh).y}get depth(){return this.source.getSize(xh).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ru)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case kn:e.x=e.x-Math.floor(e.x);break;case Ui:e.x=e.x<0?0:1;break;case hl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case kn:e.y=e.y-Math.floor(e.y);break;case Ui:e.y=e.y<0?0:1;break;case hl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Xn.DEFAULT_IMAGE=null;Xn.DEFAULT_MAPPING=ru;Xn.DEFAULT_ANISOTROPY=1;var Ft=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,v=(d+1)/2,T=(p+1)/2,A=(h+f)/4,P=(u+x)/4,C=(g+m)/4;return y>v&&y>T?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=A/i,r=P/i):v>T?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=A/s,r=C/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=P/r,s=C/r),this.set(i,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-x)/M,this.z=(f-h)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=bt(this.x,e.x,t.x),this.y=bt(this.y,e.y,t.y),this.z=bt(this.z,e.z,t.z),this.w=bt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=bt(this.x,e,t),this.y=bt(this.y,e,t),this.z=bt(this.z,e,t),this.w=bt(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},fl=class extends ji{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ft(0,0,e,t),this.scissorTest=!1,this.viewport=new Ft(0,0,e,t);let s={width:e,height:t,depth:i.depth},r=new Xn(s);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Cr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},hn=class extends fl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Co=class extends Xn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var pl=class extends Xn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ai=class{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(bi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(bi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=bi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,bi):bi.fromBufferAttribute(r,o),bi.applyMatrix4(e.matrixWorld),this.expandByPoint(bi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Oa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Oa.copy(i.boundingBox)),Oa.applyMatrix4(e.matrixWorld),this.union(Oa)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,bi),bi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fo),za.subVectors(this.max,fo),dr.subVectors(e.a,fo),fr.subVectors(e.b,fo),pr.subVectors(e.c,fo),os.subVectors(fr,dr),as.subVectors(pr,fr),Ds.subVectors(dr,pr);let t=[0,-os.z,os.y,0,-as.z,as.y,0,-Ds.z,Ds.y,os.z,0,-os.x,as.z,0,-as.x,Ds.z,0,-Ds.x,-os.y,os.x,0,-as.y,as.x,0,-Ds.y,Ds.x,0];return!vh(t,dr,fr,pr,za)||(t=[1,0,0,0,1,0,0,0,1],!vh(t,dr,fr,pr,za))?!1:(Ba.crossVectors(os,as),t=[Ba.x,Ba.y,Ba.z],vh(t,dr,fr,pr,za))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,bi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(bi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Wi=[new F,new F,new F,new F,new F,new F,new F,new F],bi=new F,Oa=new Ai,dr=new F,fr=new F,pr=new F,os=new F,as=new F,Ds=new F,fo=new F,za=new F,Ba=new F,Ls=new F;function vh(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ls.fromArray(n,r);let a=s.x*Math.abs(Ls.x)+s.y*Math.abs(Ls.y)+s.z*Math.abs(Ls.z),l=e.dot(Ls),c=t.dot(Ls),h=i.dot(Ls);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var g0=new Ai,po=new F,yh=new F,ki=class{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):g0.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;po.subVectors(e,this.center);let t=po.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(po,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(po.copy(e.center).add(yh)),this.expandByPoint(po.copy(e.center).sub(yh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Xi=new F,_h=new F,Ha=new F,ls=new F,Mh=new F,Va=new F,bh=new F,Po=class{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Xi.copy(this.origin).addScaledVector(this.direction,t),Xi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){_h.copy(e).add(t).multiplyScalar(.5),Ha.copy(t).sub(e).normalize(),ls.copy(this.origin).sub(_h);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Ha),a=ls.dot(this.direction),l=-ls.dot(Ha),c=ls.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let x=1/h;u*=x,f*=x,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(_h).addScaledVector(Ha,f),d}intersectSphere(e,t){Xi.subVectors(e.center,this.origin);let i=Xi.dot(this.direction),s=Xi.dot(Xi)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Xi)!==null}intersectTriangle(e,t,i,s,r){Mh.subVectors(t,e),Va.subVectors(i,e),bh.crossVectors(Mh,Va);let o=this.direction.dot(bh),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ls.subVectors(this.origin,e);let l=a*this.direction.dot(Va.crossVectors(ls,Va));if(l<0)return null;let c=a*this.direction.dot(Mh.cross(ls));if(c<0||l+c>o)return null;let h=-a*ls.dot(bh);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},it=class n{constructor(e,t,i,s,r,o,a,l,c,h,u,f,d,g,x,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,h,u,f,d,g,x,m)}set(e,t,i,s,r,o,a,l,c,h,u,f,d,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/mr.setFromMatrixColumn(e,0).length(),r=1/mr.setFromMatrixColumn(e,1).length(),o=1/mr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,d=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=g+d*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,d=l*u,g=c*h,x=c*u;t[0]=f+x*a,t[4]=g*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,d=l*u,g=c*h,x=c*u;t[0]=f-x*a,t[4]=-o*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,d=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=d*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=x-f*u,t[8]=g*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-x*u}else if(e.order==="XZY"){let f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+x,t[5]=o*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(x0,e,v0)}lookAt(e,t,i){let s=this.elements;return ni.subVectors(e,t),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),cs.crossVectors(i,ni),cs.lengthSq()===0&&(Math.abs(i.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),cs.crossVectors(i,ni)),cs.normalize(),Ga.crossVectors(ni,cs),s[0]=cs.x,s[4]=Ga.x,s[8]=ni.x,s[1]=cs.y,s[5]=Ga.y,s[9]=ni.y,s[2]=cs.z,s[6]=Ga.z,s[10]=ni.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],g=i[2],x=i[6],m=i[10],p=i[14],M=i[3],y=i[7],v=i[11],T=i[15],A=s[0],P=s[4],C=s[8],w=s[12],b=s[1],I=s[5],L=s[9],U=s[13],V=s[2],Y=s[6],O=s[10],W=s[14],X=s[3],j=s[7],oe=s[11],pe=s[15];return r[0]=o*A+a*b+l*V+c*X,r[4]=o*P+a*I+l*Y+c*j,r[8]=o*C+a*L+l*O+c*oe,r[12]=o*w+a*U+l*W+c*pe,r[1]=h*A+u*b+f*V+d*X,r[5]=h*P+u*I+f*Y+d*j,r[9]=h*C+u*L+f*O+d*oe,r[13]=h*w+u*U+f*W+d*pe,r[2]=g*A+x*b+m*V+p*X,r[6]=g*P+x*I+m*Y+p*j,r[10]=g*C+x*L+m*O+p*oe,r[14]=g*w+x*U+m*W+p*pe,r[3]=M*A+y*b+v*V+T*X,r[7]=M*P+y*I+v*Y+T*j,r[11]=M*C+y*L+v*O+T*oe,r[15]=M*w+y*U+v*W+T*pe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*u-s*c*u-r*a*f+i*c*f+s*a*d-i*l*d)+x*(+t*l*d-t*c*f+r*o*f-s*o*d+s*c*h-r*l*h)+m*(+t*c*u-t*a*d-r*o*u+i*o*d+r*a*h-i*c*h)+p*(-s*a*h-t*l*u+t*a*f+s*o*u-i*o*f+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],x=e[13],m=e[14],p=e[15],M=u*m*c-x*f*c+x*l*d-a*m*d-u*l*p+a*f*p,y=g*f*c-h*m*c-g*l*d+o*m*d+h*l*p-o*f*p,v=h*x*c-g*u*c+g*a*d-o*x*d-h*a*p+o*u*p,T=g*u*l-h*x*l-g*a*f+o*x*f+h*a*m-o*u*m,A=t*M+i*y+s*v+r*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/A;return e[0]=M*P,e[1]=(x*f*r-u*m*r-x*s*d+i*m*d+u*s*p-i*f*p)*P,e[2]=(a*m*r-x*l*r+x*s*c-i*m*c-a*s*p+i*l*p)*P,e[3]=(u*l*r-a*f*r-u*s*c+i*f*c+a*s*d-i*l*d)*P,e[4]=y*P,e[5]=(h*m*r-g*f*r+g*s*d-t*m*d-h*s*p+t*f*p)*P,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*P,e[7]=(o*f*r-h*l*r+h*s*c-t*f*c-o*s*d+t*l*d)*P,e[8]=v*P,e[9]=(g*u*r-h*x*r-g*i*d+t*x*d+h*i*p-t*u*p)*P,e[10]=(o*x*r-g*a*r+g*i*c-t*x*c-o*i*p+t*a*p)*P,e[11]=(h*a*r-o*u*r-h*i*c+t*u*c+o*i*d-t*a*d)*P,e[12]=T*P,e[13]=(h*x*s-g*u*s+g*i*f-t*x*f-h*i*m+t*u*m)*P,e[14]=(g*a*s-o*x*s-g*i*l+t*x*l+o*i*m-t*a*m)*P,e[15]=(o*u*s-h*a*s+h*i*l-t*u*l-o*i*f+t*a*f)*P,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,g=r*u,x=o*h,m=o*u,p=a*u,M=l*c,y=l*h,v=l*u,T=i.x,A=i.y,P=i.z;return s[0]=(1-(x+p))*T,s[1]=(d+v)*T,s[2]=(g-y)*T,s[3]=0,s[4]=(d-v)*A,s[5]=(1-(f+p))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(g+y)*P,s[9]=(m-M)*P,s[10]=(1-(f+x))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=mr.set(s[0],s[1],s[2]).length(),o=mr.set(s[4],s[5],s[6]).length(),a=mr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Si.copy(this);let c=1/r,h=1/o,u=1/a;return Si.elements[0]*=c,Si.elements[1]*=c,Si.elements[2]*=c,Si.elements[4]*=h,Si.elements[5]*=h,Si.elements[6]*=h,Si.elements[8]*=u,Si.elements[9]*=u,Si.elements[10]*=u,t.setFromRotationMatrix(Si),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=Ei,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s),g,x;if(l)g=r/(o-r),x=o*r/(o-r);else if(a===Ei)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Ao)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Ei,l=!1){let c=this.elements,h=2/(t-e),u=2/(i-s),f=-(t+e)/(t-e),d=-(i+s)/(i-s),g,x;if(l)g=1/(o-r),x=o/(o-r);else if(a===Ei)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Ao)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},mr=new F,Si=new it,x0=new F(0,0,0),v0=new F(1,1,1),cs=new F,Ga=new F,ni=new F,ld=new it,cd=new $n,ri=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-bt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(bt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-bt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ld.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ld,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cd.setFromEuler(this),this.setFromQuaternion(cd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ri.DEFAULT_ORDER="XYZ";var Io=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},y0=0,hd=new F,gr=new $n,qi=new it,Wa=new F,mo=new F,_0=new F,M0=new $n,ud=new F(1,0,0),dd=new F(0,1,0),fd=new F(0,0,1),pd={type:"added"},b0={type:"removed"},xr={type:"childadded",child:null},Sh={type:"childremoved",child:null},Ht=class n extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:y0++}),this.uuid=_s(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new F,t=new ri,i=new $n,s=new F(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new it},normalMatrix:{value:new _t}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Io,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gr.setFromAxisAngle(e,t),this.quaternion.multiply(gr),this}rotateOnWorldAxis(e,t){return gr.setFromAxisAngle(e,t),this.quaternion.premultiply(gr),this}rotateX(e){return this.rotateOnAxis(ud,e)}rotateY(e){return this.rotateOnAxis(dd,e)}rotateZ(e){return this.rotateOnAxis(fd,e)}translateOnAxis(e,t){return hd.copy(e).applyQuaternion(this.quaternion),this.position.add(hd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ud,e)}translateY(e){return this.translateOnAxis(dd,e)}translateZ(e){return this.translateOnAxis(fd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(qi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Wa.copy(e):Wa.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qi.lookAt(mo,Wa,this.up):qi.lookAt(Wa,mo,this.up),this.quaternion.setFromRotationMatrix(qi),s&&(qi.extractRotation(s.matrixWorld),gr.setFromRotationMatrix(qi),this.quaternion.premultiply(gr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(pd),xr.child=e,this.dispatchEvent(xr),xr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(b0),Sh.child=e,this.dispatchEvent(Sh),Sh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),qi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),qi.multiply(e.parent.matrixWorld)),e.applyMatrix4(qi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(pd),xr.child=e,this.dispatchEvent(xr),xr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,e,_0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,M0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Ht.DEFAULT_UP=new F(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wi=new F,Yi=new F,wh=new F,Zi=new F,vr=new F,yr=new F,md=new F,Eh=new F,Th=new F,Ah=new F,Rh=new Ft,Ch=new Ft,Ph=new Ft,ds=class n{constructor(e=new F,t=new F,i=new F){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),wi.subVectors(e,t),s.cross(wi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){wi.subVectors(s,t),Yi.subVectors(i,t),wh.subVectors(e,t);let o=wi.dot(wi),a=wi.dot(Yi),l=wi.dot(wh),c=Yi.dot(Yi),h=Yi.dot(wh),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,Zi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Zi.x),l.addScaledVector(o,Zi.y),l.addScaledVector(a,Zi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return Rh.setScalar(0),Ch.setScalar(0),Ph.setScalar(0),Rh.fromBufferAttribute(e,t),Ch.fromBufferAttribute(e,i),Ph.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Rh,r.x),o.addScaledVector(Ch,r.y),o.addScaledVector(Ph,r.z),o}static isFrontFacing(e,t,i,s){return wi.subVectors(i,t),Yi.subVectors(e,t),wi.cross(Yi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return wi.subVectors(this.c,this.b),Yi.subVectors(this.a,this.b),wi.cross(Yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;vr.subVectors(s,i),yr.subVectors(r,i),Eh.subVectors(e,i);let l=vr.dot(Eh),c=yr.dot(Eh);if(l<=0&&c<=0)return t.copy(i);Th.subVectors(e,s);let h=vr.dot(Th),u=yr.dot(Th);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(i).addScaledVector(vr,o);Ah.subVectors(e,r);let d=vr.dot(Ah),g=yr.dot(Ah);if(g>=0&&d<=g)return t.copy(r);let x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(yr,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return md.subVectors(r,s),a=(u-h)/(u-h+(d-g)),t.copy(s).addScaledVector(md,a);let p=1/(m+x+f);return o=x*p,a=f*p,t.copy(i).addScaledVector(vr,o).addScaledVector(yr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},mf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hs={h:0,s:0,l:0},Xa={h:0,s:0,l:0};function Ih(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Pe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Pt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Pt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Pt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Pt.workingColorSpace){if(e=mu(e,1),t=bt(t,0,1),i=bt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Ih(o,r,e+1/3),this.g=Ih(o,r,e),this.b=Ih(o,r,e-1/3)}return Pt.colorSpaceToWorking(this,s),this}setStyle(e,t=pn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pn){let i=mf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}copyLinearToSRGB(e){return this.r=Er(e.r),this.g=Er(e.g),this.b=Er(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pn){return Pt.workingToColorSpace(Fn.copy(this),e),Math.round(bt(Fn.r*255,0,255))*65536+Math.round(bt(Fn.g*255,0,255))*256+Math.round(bt(Fn.b*255,0,255))}getHexString(e=pn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Pt.workingColorSpace){Pt.workingToColorSpace(Fn.copy(this),t);let i=Fn.r,s=Fn.g,r=Fn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Pt.workingColorSpace){return Pt.workingToColorSpace(Fn.copy(this),t),e.r=Fn.r,e.g=Fn.g,e.b=Fn.b,e}getStyle(e=pn){Pt.workingToColorSpace(Fn.copy(this),e);let t=Fn.r,i=Fn.g,s=Fn.b;return e!==pn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(hs),this.setHSL(hs.h+e,hs.s+t,hs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(hs),e.getHSL(Xa);let i=bo(hs.h,Xa.h,t),s=bo(hs.s,Xa.s,t),r=bo(hs.l,Xa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fn=new Pe;Pe.NAMES=mf;var S0=0,Qi=class extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:S0++}),this.uuid=_s(),this.name="",this.type="Material",this.blending=Ki,this.side=Ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=cl,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fs,this.stencilZFail=Fs,this.stencilZPass=Fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(i.blending=this.blending),this.side!==Ti&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ll&&(i.blendSrc=this.blendSrc),this.blendDst!==cl&&(i.blendDst=this.blendDst),this.blendEquation!==si&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ks&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Fs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Fs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},on=class extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=su,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$i=w0();function w0(){let n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function E0(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=bt(n,-65504,65504),$i.floatView[0]=n;let e=$i.uint32View[0],t=e>>23&511;return $i.baseTable[t]+((e&8388607)>>$i.shiftTable[t])}function T0(n){let e=n>>10;return $i.uint32View[0]=$i.mantissaTable[$i.offsetTable[e]+(n&1023)]+$i.exponentTable[e],$i.floatView[0]}var Do=class{static toHalfFloat(e){return E0(e)}static fromHalfFloat(e){return T0(e)}},un=new F,qa=new xe,A0=0,It=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:A0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Yh,this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)qa.fromBufferAttribute(this,t),qa.applyMatrix3(e),this.setXY(t,qa.x,qa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)un.fromBufferAttribute(this,t),un.applyMatrix3(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)un.fromBufferAttribute(this,t),un.applyMatrix4(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)un.fromBufferAttribute(this,t),un.applyNormalMatrix(e),this.setXYZ(t,un.x,un.y,un.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)un.fromBufferAttribute(this,t),un.transformDirection(e),this.setXYZ(t,un.x,un.y,un.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=wr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=wr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=wr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=wr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=wr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Wn(t,this.array),i=Wn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Wn(t,this.array),i=Wn(i,this.array),s=Wn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Wn(t,this.array),i=Wn(i,this.array),s=Wn(s,this.array),r=Wn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Yh&&(e.usage=this.usage),e}};var zs=class extends It{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Lo=class extends It{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var $e=class extends It{constructor(e,t,i){super(new Float32Array(e),t,i)}},R0=0,fi=new it,Dh=new Ht,_r=new F,ii=new Ai,go=new Ai,Tn=new F,wt=class n extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:R0++}),this.uuid=_s(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gu(e)?Lo:zs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new _t().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fi.makeRotationFromQuaternion(e),this.applyMatrix4(fi),this}rotateX(e){return fi.makeRotationX(e),this.applyMatrix4(fi),this}rotateY(e){return fi.makeRotationY(e),this.applyMatrix4(fi),this}rotateZ(e){return fi.makeRotationZ(e),this.applyMatrix4(fi),this}translate(e,t,i){return fi.makeTranslation(e,t,i),this.applyMatrix4(fi),this}scale(e,t,i){return fi.makeScale(e,t,i),this.applyMatrix4(fi),this}lookAt(e){return Dh.lookAt(e),Dh.updateMatrix(),this.applyMatrix4(Dh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_r).negate(),this.translate(_r.x,_r.y,_r.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new $e(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];ii.setFromBufferAttribute(r),this.morphTargetsRelative?(Tn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(Tn),Tn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(Tn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ki);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){let i=this.boundingSphere.center;if(ii.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];go.setFromBufferAttribute(a),this.morphTargetsRelative?(Tn.addVectors(ii.min,go.min),ii.expandByPoint(Tn),Tn.addVectors(ii.max,go.max),ii.expandByPoint(Tn)):(ii.expandByPoint(go.min),ii.expandByPoint(go.max))}ii.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Tn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Tn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Tn.fromBufferAttribute(a,c),l&&(_r.fromBufferAttribute(e,c),Tn.add(_r)),s=Math.max(s,i.distanceToSquared(Tn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new It(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<i.count;C++)a[C]=new F,l[C]=new F;let c=new F,h=new F,u=new F,f=new xe,d=new xe,g=new xe,x=new F,m=new F;function p(C,w,b){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,w),u.fromBufferAttribute(i,b),f.fromBufferAttribute(r,C),d.fromBufferAttribute(r,w),g.fromBufferAttribute(r,b),h.sub(c),u.sub(c),d.sub(f),g.sub(f);let I=1/(d.x*g.y-g.x*d.y);isFinite(I)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(I),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(I),a[C].add(x),a[w].add(x),a[b].add(x),l[C].add(m),l[w].add(m),l[b].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let C=0,w=M.length;C<w;++C){let b=M[C],I=b.start,L=b.count;for(let U=I,V=I+L;U<V;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let y=new F,v=new F,T=new F,A=new F;function P(C){T.fromBufferAttribute(s,C),A.copy(T);let w=a[C];y.copy(w),y.sub(T.multiplyScalar(T.dot(w))).normalize(),v.crossVectors(A,w);let I=v.dot(l[C])<0?-1:1;o.setXYZW(C,y.x,y.y,y.z,I)}for(let C=0,w=M.length;C<w;++C){let b=M[C],I=b.start,L=b.count;for(let U=I,V=I+L;U<V;U+=3)P(e.getX(U+0)),P(e.getX(U+1)),P(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new It(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);let s=new F,r=new F,o=new F,a=new F,l=new F,c=new F,h=new F,u=new F;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Tn.fromBufferAttribute(e,t),Tn.normalize(),e.setXYZ(t,Tn.x,Tn.y,Tn.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new It(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,i);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=e(f,i);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gd=new it,Ns=new Po,Ya=new ki,xd=new F,Za=new F,$a=new F,Ja=new F,Lh=new F,Ka=new F,vd=new F,ja=new F,tt=class extends Ht{constructor(e=new wt,t=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ka.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Lh.fromBufferAttribute(u,e),o?Ka.addScaledVector(Lh,h):Ka.addScaledVector(Lh.sub(t),h))}t.add(Ka)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ya.copy(i.boundingSphere),Ya.applyMatrix4(r),Ns.copy(e.ray).recast(e.near),!(Ya.containsPoint(Ns.origin)===!1&&(Ns.intersectSphere(Ya,xd)===null||Ns.origin.distanceToSquared(xd)>(e.far-e.near)**2))&&(gd.copy(r).invert(),Ns.copy(e.ray).applyMatrix4(gd),!(i.boundingBox!==null&&Ns.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ns)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),y=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=M,T=y;v<T;v+=3){let A=a.getX(v),P=a.getX(v+1),C=a.getX(v+2);s=Qa(this,p,e,i,c,h,u,A,P,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let M=a.getX(m),y=a.getX(m+1),v=a.getX(m+2);s=Qa(this,o,e,i,c,h,u,M,y,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),y=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let v=M,T=y;v<T;v+=3){let A=v,P=v+1,C=v+2;s=Qa(this,p,e,i,c,h,u,A,P,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let M=m,y=m+1,v=m+2;s=Qa(this,o,e,i,c,h,u,M,y,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function C0(n,e,t,i,s,r,o,a){let l;if(e.side===gn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Ti,a),l===null)return null;ja.copy(a),ja.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(ja);return c<t.near||c>t.far?null:{distance:c,point:ja.clone(),object:n}}function Qa(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,Za),n.getVertexPosition(l,$a),n.getVertexPosition(c,Ja);let h=C0(n,e,t,i,Za,$a,Ja,vd);if(h){let u=new F;ds.getBarycoord(vd,Za,$a,Ja,u),s&&(h.uv=ds.getInterpolatedAttribute(s,a,l,c,u,new xe)),r&&(h.uv1=ds.getInterpolatedAttribute(r,a,l,c,u,new xe)),o&&(h.normal=ds.getInterpolatedAttribute(o,a,l,c,u,new F),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new F,materialIndex:0};ds.getNormal(Za,$a,Ja,f.normal),h.face=f,h.barycoord=u}return h}var Vt=class n extends wt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(h,3)),this.setAttribute("uv",new $e(u,2));function g(x,m,p,M,y,v,T,A,P,C,w){let b=v/P,I=T/C,L=v/2,U=T/2,V=A/2,Y=P+1,O=C+1,W=0,X=0,j=new F;for(let oe=0;oe<O;oe++){let pe=oe*I-U;for(let Se=0;Se<Y;Se++){let Ne=Se*b-L;j[x]=Ne*M,j[m]=pe*y,j[p]=V,c.push(j.x,j.y,j.z),j[x]=0,j[m]=0,j[p]=A>0?1:-1,h.push(j.x,j.y,j.z),u.push(Se/P),u.push(1-oe/C),W+=1}}for(let oe=0;oe<C;oe++)for(let pe=0;pe<P;pe++){let Se=f+pe+Y*oe,Ne=f+pe+Y*(oe+1),ke=f+(pe+1)+Y*(oe+1),De=f+(pe+1)+Y*oe;l.push(Se,Ne,De),l.push(Ne,ke,De),X+=6}a.addGroup(d,X,w),d+=X,f+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function js(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function zn(n){let e={};for(let t=0;t<n.length;t++){let i=js(n[t]);for(let s in i)e[s]=i[s]}return e}function P0(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function xu(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Pt.workingColorSpace}var In={clone:js,merge:zn},I0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,D0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,gt=class extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=I0,this.fragmentShader=D0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=P0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},No=class extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=Ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},us=new F,yd=new xe,_d=new xe,Rn=class extends No{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ar*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Mo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ar*2*Math.atan(Math.tan(Mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){us.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(us.x,us.y).multiplyScalar(-e/us.z),us.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(us.x,us.y).multiplyScalar(-e/us.z)}getViewSize(e,t){return this.getViewBounds(e,yd,_d),t.subVectors(_d,yd)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Mo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Mr=-90,br=1,ml=class extends Ht{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Rn(Mr,br,e,t);s.layers=this.layers,this.add(s);let r=new Rn(Mr,br,e,t);r.layers=this.layers,this.add(r);let o=new Rn(Mr,br,e,t);o.layers=this.layers,this.add(o);let a=new Rn(Mr,br,e,t);a.layers=this.layers,this.add(a);let l=new Rn(Mr,br,e,t);l.layers=this.layers,this.add(l);let c=new Rn(Mr,br,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Ei)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ao)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Uo=class extends Xn{constructor(e=[],t=Js,i,s,r,o,a,l,c,h){super(e,t,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},gl=class extends hn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Uo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Vt(5,5,5),r=new gt({name:"CubemapFromEquirect",uniforms:js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:gn,blending:fn});r.uniforms.tEquirect.value=t;let o=new tt(s,r),a=t.minFilter;return t.minFilter===pi&&(t.minFilter=Cn),new ml(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},Yt=class extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}},L0={type:"move"},Pr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,i),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(L0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Yt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}};var Fo=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Pe(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ir=class extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Md=new F,bd=new Ft,Sd=new Ft,N0=new F,wd=new it,el=new F,Nh=new ki,Ed=new it,Uh=new Po,ko=class extends tt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Vh,this.bindMatrix=new it,this.bindMatrixInverse=new it,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ai),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,el),this.boundingBox.expandByPoint(el)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ki),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,el),this.boundingSphere.expandByPoint(el)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Nh.copy(this.boundingSphere),Nh.applyMatrix4(s),e.ray.intersectsSphere(Nh)!==!1&&(Ed.copy(s).invert(),Uh.copy(e.ray).applyMatrix4(Ed),!(this.boundingBox!==null&&Uh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Uh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ft,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Vh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===ef?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,s=this.geometry;bd.fromBufferAttribute(s.attributes.skinIndex,e),Sd.fromBufferAttribute(s.attributes.skinWeight,e),Md.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Sd.getComponent(r);if(o!==0){let a=bd.getComponent(r);wd.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(N0.copy(Md).applyMatrix4(wd),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},Dr=class extends Ht{constructor(){super(),this.isBone=!0,this.type="Bone"}},Pn=class extends Xn{constructor(e=null,t=1,i=1,s,r,o,a,l,c=mn,h=mn,u,f){super(null,o,a,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Td=new it,U0=new it,Oo=class n{constructor(e=[],t=[]){this.uuid=_s(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new it)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new it;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:U0;Td.multiplyMatrices(a,t[r]),Td.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new Pn(t,e,e,vn,mi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){let r=e.bones[i],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Dr),this.bones.push(o),this.boneInverses.push(new it().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=i[s];e.boneInverses.push(a.toArray())}return e}},fs=class extends It{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Sr=new it,Ad=new it,tl=[],Rd=new Ai,F0=new it,xo=new tt,vo=new ki,an=class extends tt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new fs(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,F0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ai),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Sr),Rd.copy(e.boundingBox).applyMatrix4(Sr),this.boundingBox.union(Rd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ki),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Sr),vo.copy(e.boundingSphere).applyMatrix4(Sr),this.boundingSphere.union(vo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(xo.geometry=this.geometry,xo.material=this.material,xo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vo.copy(this.boundingSphere),vo.applyMatrix4(i),e.ray.intersectsSphere(vo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Sr),Ad.multiplyMatrices(i,Sr),xo.matrixWorld=Ad,xo.raycast(e,tl);for(let o=0,a=tl.length;o<a;o++){let l=tl[o];l.instanceId=r,l.object=this,t.push(l)}tl.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new fs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Pn(new Float32Array(s*this.count),s,this.count,ys,mi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fh=new F,k0=new F,O0=new _t,Ni=class{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Fh.subVectors(i,t).cross(k0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Fh),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||O0.getNormalMatrix(e),s=this.coplanarPoint(Fh).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Us=new ki,z0=new xe(.5,.5),nl=new F,Lr=class{constructor(e=new Ni,t=new Ni,i=new Ni,s=new Ni,r=new Ni,o=new Ni){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ei,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],x=r[9],m=r[10],p=r[11],M=r[12],y=r[13],v=r[14],T=r[15];if(s[0].setComponents(c-o,d-h,p-g,T-M).normalize(),s[1].setComponents(c+o,d+h,p+g,T+M).normalize(),s[2].setComponents(c+a,d+u,p+x,T+y).normalize(),s[3].setComponents(c-a,d-u,p-x,T-y).normalize(),i)s[4].setComponents(l,f,m,v).normalize(),s[5].setComponents(c-l,d-f,p-m,T-v).normalize();else if(s[4].setComponents(c-l,d-f,p-m,T-v).normalize(),t===Ei)s[5].setComponents(c+l,d+f,p+m,T+v).normalize();else if(t===Ao)s[5].setComponents(l,f,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Us.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Us.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Us)}intersectsSprite(e){Us.center.set(0,0,0);let t=z0.distanceTo(e.center);return Us.radius=.7071067811865476+t,Us.applyMatrix4(e.matrixWorld),this.intersectsSphere(Us)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(nl.x=s.normal.x>0?e.max.x:e.min.x,nl.y=s.normal.y>0?e.max.y:e.min.y,nl.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(nl)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Nr=class extends Xn{constructor(e,t,i,s,r,o,a,l,c){super(e,t,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},es=class extends Xn{constructor(e,t,i=zi,s,r,o,a=mn,l=mn,c,h=Tr,u=1){if(h!==Tr&&h!==vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Cr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},zo=class extends Xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Bs=class n extends wt{constructor(e=1,t=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:s,heightSegments:r},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,f=t,d=2*u+f,g=i*2+r,x=s+1,m=new F,p=new F;for(let M=0;M<=g;M++){let y=0,v=0,T=0,A=0;if(M<=i){let w=M/i,b=w*Math.PI/2;v=-h-e*Math.cos(b),T=e*Math.sin(b),A=-e*Math.cos(b),y=w*u}else if(M<=i+r){let w=(M-i)/r;v=-h+w*t,T=e,A=0,y=u+w*f}else{let w=(M-i-r)/i,b=w*Math.PI/2;v=h+e*Math.sin(b),T=e*Math.cos(b),A=e*Math.sin(b),y=u+f+w*u}let P=Math.max(0,Math.min(1,y/d)),C=0;M===0?C=.5/s:M===g&&(C=-.5/s);for(let w=0;w<=s;w++){let b=w/s,I=b*Math.PI*2,L=Math.sin(I),U=Math.cos(I);p.x=-T*U,p.y=v,p.z=T*L,a.push(p.x,p.y,p.z),m.set(-T*U,A,T*L),m.normalize(),l.push(m.x,m.y,m.z),c.push(b+C,P)}if(M>0){let w=(M-1)*x;for(let b=0;b<s;b++){let I=w+b,L=w+b+1,U=M*x+b,V=M*x+b+1;o.push(I,L,U),o.push(L,V,U)}}}this.setIndex(o),this.setAttribute("position",new $e(a,3)),this.setAttribute("normal",new $e(l,3)),this.setAttribute("uv",new $e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}};var On=class n extends wt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,x=[],m=i/2,p=0;M(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new $e(u,3)),this.setAttribute("normal",new $e(f,3)),this.setAttribute("uv",new $e(d,2));function M(){let v=new F,T=new F,A=0,P=(t-e)/i;for(let C=0;C<=r;C++){let w=[],b=C/r,I=b*(t-e)+e;for(let L=0;L<=s;L++){let U=L/s,V=U*l+a,Y=Math.sin(V),O=Math.cos(V);T.x=I*Y,T.y=-b*i+m,T.z=I*O,u.push(T.x,T.y,T.z),v.set(Y,P,O).normalize(),f.push(v.x,v.y,v.z),d.push(U,1-b),w.push(g++)}x.push(w)}for(let C=0;C<s;C++)for(let w=0;w<r;w++){let b=x[w][C],I=x[w+1][C],L=x[w+1][C+1],U=x[w][C+1];(e>0||w!==0)&&(h.push(b,I,U),A+=3),(t>0||w!==r-1)&&(h.push(I,L,U),A+=3)}c.addGroup(p,A,0),p+=A}function y(v){let T=g,A=new xe,P=new F,C=0,w=v===!0?e:t,b=v===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,m*b,0),f.push(0,b,0),d.push(.5,.5),g++;let I=g;for(let L=0;L<=s;L++){let V=L/s*l+a,Y=Math.cos(V),O=Math.sin(V);P.x=w*O,P.y=m*b,P.z=w*Y,u.push(P.x,P.y,P.z),f.push(0,b,0),A.x=Y*.5+.5,A.y=O*.5*b+.5,d.push(A.x,A.y),g++}for(let L=0;L<s;L++){let U=T+L,V=I+L;v===!0?h.push(V,V+1,U):h.push(V+1,V,U),C+=3}c.addGroup(p,C,v===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ts=class n extends On{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ur=class n extends wt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new $e(r,3)),this.setAttribute("normal",new $e(r.slice(),3)),this.setAttribute("uv",new $e(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let y=new F,v=new F,T=new F;for(let A=0;A<t.length;A+=3)d(t[A+0],y),d(t[A+1],v),d(t[A+2],T),l(y,v,T,M)}function l(M,y,v,T){let A=T+1,P=[];for(let C=0;C<=A;C++){P[C]=[];let w=M.clone().lerp(v,C/A),b=y.clone().lerp(v,C/A),I=A-C;for(let L=0;L<=I;L++)L===0&&C===A?P[C][L]=w:P[C][L]=w.clone().lerp(b,L/I)}for(let C=0;C<A;C++)for(let w=0;w<2*(A-C)-1;w++){let b=Math.floor(w/2);w%2===0?(f(P[C][b+1]),f(P[C+1][b]),f(P[C][b])):(f(P[C][b+1]),f(P[C+1][b+1]),f(P[C+1][b]))}}function c(M){let y=new F;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(M),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){let M=new F;for(let y=0;y<r.length;y+=3){M.x=r[y+0],M.y=r[y+1],M.z=r[y+2];let v=m(M)/2/Math.PI+.5,T=p(M)/Math.PI+.5;o.push(v,1-T)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){let y=o[M+0],v=o[M+2],T=o[M+4],A=Math.max(y,v,T),P=Math.min(y,v,T);A>.9&&P<.1&&(y<.2&&(o[M+0]+=1),v<.2&&(o[M+2]+=1),T<.2&&(o[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function d(M,y){let v=M*3;y.x=e[v+0],y.y=e[v+1],y.z=e[v+2]}function g(){let M=new F,y=new F,v=new F,T=new F,A=new xe,P=new xe,C=new xe;for(let w=0,b=0;w<r.length;w+=9,b+=6){M.set(r[w+0],r[w+1],r[w+2]),y.set(r[w+3],r[w+4],r[w+5]),v.set(r[w+6],r[w+7],r[w+8]),A.set(o[b+0],o[b+1]),P.set(o[b+2],o[b+3]),C.set(o[b+4],o[b+5]),T.copy(M).add(y).add(v).divideScalar(3);let I=m(T);x(A,b+0,M,I),x(P,b+2,y,I),x(C,b+4,v,I)}}function x(M,y,v,T){T<0&&M.x===1&&(o[y]=M.x-1),v.x===0&&v.z===0&&(o[y]=T/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}},Bo=class n extends Ur{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var oi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(r-1);let h=i[s],f=i[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new xe:new F);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new F,s=[],r=[],o=[],a=new F,l=new it;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new F)}r[0]=new F,o[0]=new F;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(bt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(bt(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Fr=class extends oi{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new xe){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},xl=class extends Fr{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function vu(){let n=0,e=0,t=0,i=0;function s(r,o,a,l){n=r,e=a,t=-3*r+3*o-2*a-l,i=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var il=new F,kh=new vu,Oh=new vu,zh=new vu,Hs=class extends oi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new F){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(il.subVectors(s[0],s[1]).add(s[0]),c=il);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(il.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=il),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),kh.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,x,m),Oh.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,x,m),zh.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(kh.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Oh.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),zh.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(kh.calc(l),Oh.calc(l),zh.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new F().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Cd(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,l=n*a;return(2*t-2*i+r+o)*l+(-3*t+3*i-2*r-o)*a+r*n+t}function B0(n,e){let t=1-n;return t*t*e}function H0(n,e){return 2*(1-n)*n*e}function V0(n,e){return n*n*e}function So(n,e,t,i){return B0(n,e)+H0(n,t)+V0(n,i)}function G0(n,e){let t=1-n;return t*t*t*e}function W0(n,e){let t=1-n;return 3*t*t*n*e}function X0(n,e){return 3*(1-n)*n*n*e}function q0(n,e){return n*n*n*e}function wo(n,e,t,i,s){return G0(n,e)+W0(n,t)+X0(n,i)+q0(n,s)}var Ho=class extends oi{constructor(e=new xe,t=new xe,i=new xe,s=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new xe){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(wo(e,s.x,r.x,o.x,a.x),wo(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},vl=class extends oi{constructor(e=new F,t=new F,i=new F,s=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new F){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(wo(e,s.x,r.x,o.x,a.x),wo(e,s.y,r.y,o.y,a.y),wo(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Vo=class extends oi{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yl=class extends oi{constructor(e=new F,t=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new F){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new F){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Go=class extends oi{constructor(e=new xe,t=new xe,i=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new xe){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(So(e,s.x,r.x,o.x),So(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wo=class extends oi{constructor(e=new F,t=new F,i=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new F){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(So(e,s.x,r.x,o.x),So(e,s.y,r.y,o.y),So(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Xo=class extends oi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(Cd(a,l.x,c.x,h.x,u.x),Cd(a,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new xe().fromArray(s))}return this}},_l=Object.freeze({__proto__:null,ArcCurve:xl,CatmullRomCurve3:Hs,CubicBezierCurve:Ho,CubicBezierCurve3:vl,EllipseCurve:Fr,LineCurve:Vo,LineCurve3:yl,QuadraticBezierCurve:Go,QuadraticBezierCurve3:Wo,SplineCurve:Xo}),Ml=class extends oi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _l[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new _l[s.type]().fromJSON(s))}return this}},Vs=class extends Ml{constructor(e){super(),this.type="Path",this.currentPoint=new xe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new Vo(this.currentPoint.clone(),new xe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let r=new Go(this.currentPoint.clone(),new xe(e,t),new xe(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,o){let a=new Ho(this.currentPoint.clone(),new xe(e,t),new xe(i,s),new xe(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Xo(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,s,r,o),this}absarc(e,t,i,s,r,o){return this.absellipse(e,t,i,i,s,r,o),this}ellipse(e,t,i,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,s,r,o,a,l),this}absellipse(e,t,i,s,r,o,a,l){let c=new Fr(e,t,i,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ps=class extends Vs{constructor(e){super(e),this.uuid=_s(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(new Vs().fromJSON(s))}return this}};function Y0(n,e,t=2){let i=e&&e.length,s=i?e[0]*t:n.length,r=gf(n,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(i&&(r=j0(n,e,r,t)),n.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){let d=n[f],g=n[f+1];d<a&&(a=d),g<l&&(l=g),d>h&&(h=d),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return qo(r,o,t,a,l,c,0),o}function gf(n,e,t,i,s){let r;if(s===cm(n,e,t,i)>0)for(let o=e;o<t;o+=i)r=Pd(o/i|0,n[o],n[o+1],r);else for(let o=t-i;o>=e;o-=i)r=Pd(o/i|0,n[o],n[o+1],r);return r&&kr(r,r.next)&&(Zo(r),r=r.next),r}function Gs(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(kr(t,t.next)||rn(t.prev,t,t.next)===0)){if(Zo(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function qo(n,e,t,i,s,r,o){if(!n)return;!o&&r&&im(n,i,s,r);let a=n;for(;n.prev!==n.next;){let l=n.prev,c=n.next;if(r?$0(n,i,s,r):Z0(n)){e.push(l.i,n.i,c.i),Zo(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=J0(Gs(n),e),qo(n,e,t,i,s,r,2)):o===2&&K0(n,e,t,i,s,r):qo(Gs(n),e,t,i,s,r,1);break}}}function Z0(n){let e=n.prev,t=n,i=n.next;if(rn(e,t,i)>=0)return!1;let s=e.x,r=t.x,o=i.x,a=e.y,l=t.y,c=i.y,h=Math.min(s,r,o),u=Math.min(a,l,c),f=Math.max(s,r,o),d=Math.max(a,l,c),g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&_o(s,a,r,l,o,c,g.x,g.y)&&rn(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function $0(n,e,t,i){let s=n.prev,r=n,o=n.next;if(rn(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,d=Math.min(a,l,c),g=Math.min(h,u,f),x=Math.max(a,l,c),m=Math.max(h,u,f),p=Zh(d,g,e,t,i),M=Zh(x,m,e,t,i),y=n.prevZ,v=n.nextZ;for(;y&&y.z>=p&&v&&v.z<=M;){if(y.x>=d&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&_o(a,h,l,u,c,f,y.x,y.y)&&rn(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&_o(a,h,l,u,c,f,v.x,v.y)&&rn(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=p;){if(y.x>=d&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&_o(a,h,l,u,c,f,y.x,y.y)&&rn(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=M;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&_o(a,h,l,u,c,f,v.x,v.y)&&rn(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function J0(n,e){let t=n;do{let i=t.prev,s=t.next.next;!kr(i,s)&&vf(i,t,t.next,s)&&Yo(i,s)&&Yo(s,i)&&(e.push(i.i,t.i,s.i),Zo(t),Zo(t.next),t=n=s),t=t.next}while(t!==n);return Gs(t)}function K0(n,e,t,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&om(o,a)){let l=yf(o,a);o=Gs(o,o.next),l=Gs(l,l.next),qo(o,e,t,i,s,r,0),qo(l,e,t,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function j0(n,e,t,i){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*i,l=r<o-1?e[r+1]*i:n.length,c=gf(n,a,l,i,!1);c===c.next&&(c.steiner=!0),s.push(rm(c))}s.sort(Q0);for(let r=0;r<s.length;r++)t=em(s[r],t);return t}function Q0(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function em(n,e){let t=tm(n,e);if(!t)return e;let i=yf(t,n);return Gs(i,i.next),Gs(t,t.next)}function tm(n,e){let t=e,i=n.x,s=n.y,r=-1/0,o;if(kr(n,t))return t;do{if(kr(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===i))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&xf(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){let u=Math.abs(s-t.y)/(i-t.x);Yo(t,n)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&nm(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function nm(n,e){return rn(n.prev,n,e.prev)<0&&rn(e.next,n,n.next)<0}function im(n,e,t,i){let s=n;do s.z===0&&(s.z=Zh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,sm(s)}function sm(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=o}r.nextZ=null,t*=2}while(e>1);return n}function Zh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function rm(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function xf(n,e,t,i,s,r,o,a){return(s-o)*(e-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(i-a)}function _o(n,e,t,i,s,r,o,a){return!(n===o&&e===a)&&xf(n,e,t,i,s,r,o,a)}function om(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!am(n,e)&&(Yo(n,e)&&Yo(e,n)&&lm(n,e)&&(rn(n.prev,n,e.prev)||rn(n,e.prev,e))||kr(n,e)&&rn(n.prev,n,n.next)>0&&rn(e.prev,e,e.next)>0)}function rn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function kr(n,e){return n.x===e.x&&n.y===e.y}function vf(n,e,t,i){let s=rl(rn(n,e,t)),r=rl(rn(n,e,i)),o=rl(rn(t,i,n)),a=rl(rn(t,i,e));return!!(s!==r&&o!==a||s===0&&sl(n,t,e)||r===0&&sl(n,i,e)||o===0&&sl(t,n,i)||a===0&&sl(t,e,i))}function sl(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function rl(n){return n>0?1:n<0?-1:0}function am(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&vf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Yo(n,e){return rn(n.prev,n,n.next)<0?rn(n,e,n.next)>=0&&rn(n,n.prev,e)>=0:rn(n,e,n.prev)<0||rn(n,n.next,e)<0}function lm(n,e){let t=n,i=!1,s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function yf(n,e){let t=$h(n.i,n.x,n.y),i=$h(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function Pd(n,e,t,i){let s=$h(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Zo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function $h(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function cm(n,e,t,i){let s=0;for(let r=e,o=t-i;r<t;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Jh=class{static triangulate(e,t,i=2){return Y0(e,t,i)}},Fi=class n{static area(e){let t=e.length,i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],s=[],r=[];Id(e),Dd(i,e);let o=e.length;t.forEach(Id);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Dd(i,t[l]);let a=Jh.triangulate(i,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Id(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Dd(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}var $o=class n extends wt{constructor(e=new ps([new xe(.5,.5),new xe(-.5,.5),new xe(-.5,-.5),new xe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new $e(s,3)),this.setAttribute("uv",new $e(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:hm,y,v=!1,T,A,P,C;p&&(y=p.getSpacedPoints(h),v=!0,f=!1,T=p.computeFrenetFrames(h,!1),A=new F,P=new F,C=new F),f||(m=0,d=0,g=0,x=0);let w=a.extractPoints(c),b=w.shape,I=w.holes;if(!Fi.isClockWise(b)){b=b.reverse();for(let B=0,H=I.length;B<H;B++){let K=I[B];Fi.isClockWise(K)&&(I[B]=K.reverse())}}function U(B){let K=10000000000000001e-36,Z=B[0];for(let J=1;J<=B.length;J++){let re=J%B.length,ce=B[re],ie=ce.x-Z.x,ae=ce.y-Z.y,R=ie*ie+ae*ae,S=Math.max(Math.abs(ce.x),Math.abs(ce.y),Math.abs(Z.x),Math.abs(Z.y)),N=K*S*S;if(R<=N){B.splice(re,1),J--;continue}Z=ce}}U(b),I.forEach(U);let V=I.length,Y=b;for(let B=0;B<V;B++){let H=I[B];b=b.concat(H)}function O(B,H,K){return H||console.error("THREE.ExtrudeGeometry: vec does not exist"),B.clone().addScaledVector(H,K)}let W=b.length;function X(B,H,K){let Z,J,re,ce=B.x-H.x,ie=B.y-H.y,ae=K.x-B.x,R=K.y-B.y,S=ce*ce+ie*ie,N=ce*R-ie*ae;if(Math.abs(N)>Number.EPSILON){let $=Math.sqrt(S),z=Math.sqrt(ae*ae+R*R),G=H.x-ie/$,be=H.y+ce/$,ve=K.x-R/z,we=K.y+ae/z,Me=((ve-G)*R-(we-be)*ae)/(ce*R-ie*ae);Z=G+ce*Me-B.x,J=be+ie*Me-B.y;let ye=Z*Z+J*J;if(ye<=2)return new xe(Z,J);re=Math.sqrt(ye/2)}else{let $=!1;ce>Number.EPSILON?ae>Number.EPSILON&&($=!0):ce<-Number.EPSILON?ae<-Number.EPSILON&&($=!0):Math.sign(ie)===Math.sign(R)&&($=!0),$?(Z=-ie,J=ce,re=Math.sqrt(S)):(Z=ce,J=ie,re=Math.sqrt(S/2))}return new xe(Z/re,J/re)}let j=[];for(let B=0,H=Y.length,K=H-1,Z=B+1;B<H;B++,K++,Z++)K===H&&(K=0),Z===H&&(Z=0),j[B]=X(Y[B],Y[K],Y[Z]);let oe=[],pe,Se=j.concat();for(let B=0,H=V;B<H;B++){let K=I[B];pe=[];for(let Z=0,J=K.length,re=J-1,ce=Z+1;Z<J;Z++,re++,ce++)re===J&&(re=0),ce===J&&(ce=0),pe[Z]=X(K[Z],K[re],K[ce]);oe.push(pe),Se=Se.concat(pe)}let Ne;if(m===0)Ne=Fi.triangulateShape(Y,I);else{let B=[],H=[];for(let K=0;K<m;K++){let Z=K/m,J=d*Math.cos(Z*Math.PI/2),re=g*Math.sin(Z*Math.PI/2)+x;for(let ce=0,ie=Y.length;ce<ie;ce++){let ae=O(Y[ce],j[ce],re);fe(ae.x,ae.y,-J),Z===0&&B.push(ae)}for(let ce=0,ie=V;ce<ie;ce++){let ae=I[ce];pe=oe[ce];let R=[];for(let S=0,N=ae.length;S<N;S++){let $=O(ae[S],pe[S],re);fe($.x,$.y,-J),Z===0&&R.push($)}Z===0&&H.push(R)}}Ne=Fi.triangulateShape(B,H)}let ke=Ne.length,De=g+x;for(let B=0;B<W;B++){let H=f?O(b[B],Se[B],De):b[B];v?(P.copy(T.normals[0]).multiplyScalar(H.x),A.copy(T.binormals[0]).multiplyScalar(H.y),C.copy(y[0]).add(P).add(A),fe(C.x,C.y,C.z)):fe(H.x,H.y,0)}for(let B=1;B<=h;B++)for(let H=0;H<W;H++){let K=f?O(b[H],Se[H],De):b[H];v?(P.copy(T.normals[B]).multiplyScalar(K.x),A.copy(T.binormals[B]).multiplyScalar(K.y),C.copy(y[B]).add(P).add(A),fe(C.x,C.y,C.z)):fe(K.x,K.y,u/h*B)}for(let B=m-1;B>=0;B--){let H=B/m,K=d*Math.cos(H*Math.PI/2),Z=g*Math.sin(H*Math.PI/2)+x;for(let J=0,re=Y.length;J<re;J++){let ce=O(Y[J],j[J],Z);fe(ce.x,ce.y,u+K)}for(let J=0,re=I.length;J<re;J++){let ce=I[J];pe=oe[J];for(let ie=0,ae=ce.length;ie<ae;ie++){let R=O(ce[ie],pe[ie],Z);v?fe(R.x,R.y+y[h-1].y,y[h-1].x+K):fe(R.x,R.y,u+K)}}}ee(),ne();function ee(){let B=s.length/3;if(f){let H=0,K=W*H;for(let Z=0;Z<ke;Z++){let J=Ne[Z];ge(J[2]+K,J[1]+K,J[0]+K)}H=h+m*2,K=W*H;for(let Z=0;Z<ke;Z++){let J=Ne[Z];ge(J[0]+K,J[1]+K,J[2]+K)}}else{for(let H=0;H<ke;H++){let K=Ne[H];ge(K[2],K[1],K[0])}for(let H=0;H<ke;H++){let K=Ne[H];ge(K[0]+W*h,K[1]+W*h,K[2]+W*h)}}i.addGroup(B,s.length/3-B,0)}function ne(){let B=s.length/3,H=0;me(Y,H),H+=Y.length;for(let K=0,Z=I.length;K<Z;K++){let J=I[K];me(J,H),H+=J.length}i.addGroup(B,s.length/3-B,1)}function me(B,H){let K=B.length;for(;--K>=0;){let Z=K,J=K-1;J<0&&(J=B.length-1);for(let re=0,ce=h+m*2;re<ce;re++){let ie=W*re,ae=W*(re+1),R=H+Z+ie,S=H+J+ie,N=H+J+ae,$=H+Z+ae;Ye(R,S,N,$)}}}function fe(B,H,K){l.push(B),l.push(H),l.push(K)}function ge(B,H,K){ft(B),ft(H),ft(K);let Z=s.length/3,J=M.generateTopUV(i,s,Z-3,Z-2,Z-1);k(J[0]),k(J[1]),k(J[2])}function Ye(B,H,K,Z){ft(B),ft(H),ft(Z),ft(H),ft(K),ft(Z);let J=s.length/3,re=M.generateSideWallUV(i,s,J-6,J-3,J-2,J-1);k(re[0]),k(re[1]),k(re[3]),k(re[1]),k(re[2]),k(re[3])}function ft(B){s.push(l[B*3+0]),s.push(l[B*3+1]),s.push(l[B*3+2])}function k(B){r.push(B.x),r.push(B.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return um(t,i,e)}static fromJSON(e,t){let i=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];i.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new _l[s.type]().fromJSON(s)),new n(i,e.options)}},hm={generateTopUV:function(n,e,t,i,s){let r=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[s*3],h=e[s*3+1];return[new xe(r,o),new xe(a,l),new xe(c,h)]},generateSideWallUV:function(n,e,t,i,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],u=e[i*3+2],f=e[s*3],d=e[s*3+1],g=e[s*3+2],x=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new xe(o,1-l),new xe(c,1-u),new xe(f,1-g),new xe(x,1-p)]:[new xe(a,1-l),new xe(h,1-u),new xe(d,1-g),new xe(m,1-p)]}};function um(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Ri=class n extends Ur{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},Jo=class n extends wt{constructor(e=[new xe(0,-.5),new xe(.5,0),new xe(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=bt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new F,f=new xe,d=new F,g=new F,x=new F,m=0,p=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,d.x=p*1,d.y=-m,d.z=p*0,x.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=x.x,d.y+=x.y,d.z+=x.z,d.normalize(),l.push(d.x,d.y,d.z),x.copy(g)}for(let M=0;M<=t;M++){let y=i+M*h*s,v=Math.sin(y),T=Math.cos(y);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*v,u.y=e[A].y,u.z=e[A].x*T,o.push(u.x,u.y,u.z),f.x=M/t,f.y=A/(e.length-1),a.push(f.x,f.y);let P=l[3*A+0]*v,C=l[3*A+1],w=l[3*A+0]*T;c.push(P,C,w)}}for(let M=0;M<t;M++)for(let y=0;y<e.length-1;y++){let v=y+M*e.length,T=v,A=v+e.length,P=v+e.length+1,C=v+1;r.push(T,A,C),r.push(P,C,A)}this.setIndex(r),this.setAttribute("position",new $e(o,3)),this.setAttribute("uv",new $e(a,2)),this.setAttribute("normal",new $e(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}},ns=class n extends Ur{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},dn=class n extends wt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=e/a,f=t/l,d=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let M=p*f-o;for(let y=0;y<c;y++){let v=y*u-r;g.push(v,-M,0),x.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let y=M+c*p,v=M+c*(p+1),T=M+1+c*(p+1),A=M+1+c*p;d.push(y,v,A),d.push(v,T,A)}this.setIndex(d),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(x,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Ws=class n extends wt{constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=e,f=(t-e)/s,d=new F,g=new xe;for(let x=0;x<=s;x++){for(let m=0;m<=i;m++){let p=r+m/i*o;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/t+1)/2,g.y=(d.y/t+1)/2,h.push(g.x,g.y)}u+=f}for(let x=0;x<s;x++){let m=x*(i+1);for(let p=0;p<i;p++){let M=p+m,y=M,v=M+i+1,T=M+i+2,A=M+1;a.push(y,v,A),a.push(v,T,A)}}this.setIndex(a),this.setAttribute("position",new $e(l,3)),this.setAttribute("normal",new $e(c,3)),this.setAttribute("uv",new $e(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Ko=class n extends wt{constructor(e=new ps([new xe(0,.5),new xe(-.5,-.5),new xe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(i),this.setAttribute("position",new $e(s,3)),this.setAttribute("normal",new $e(r,3)),this.setAttribute("uv",new $e(o,2));function c(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,g=f.holes;Fi.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,p=g.length;m<p;m++){let M=g[m];Fi.isClockWise(M)===!0&&(g[m]=M.reverse())}let x=Fi.triangulateShape(d,g);for(let m=0,p=g.length;m<p;m++){let M=g[m];d=d.concat(M)}for(let m=0,p=d.length;m<p;m++){let M=d[m];s.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=x.length;m<p;m++){let M=x[m],y=M[0]+u,v=M[1]+u,T=M[2]+u;i.push(y,v,T),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return dm(t,e)}static fromJSON(e,t){let i=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];i.push(o)}return new n(i,e.curveSegments)}};function dm(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){let s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}var Jn=class n extends wt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new F,f=new F,d=[],g=[],x=[],m=[];for(let p=0;p<=i;p++){let M=[],y=p/i,v=0;p===0&&o===0?v=.5/t:p===i&&l===Math.PI&&(v=-.5/t);for(let T=0;T<=t;T++){let A=T/t;u.x=-e*Math.cos(s+A*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(s+A*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(A+v,1-y),M.push(c++)}h.push(M)}for(let p=0;p<i;p++)for(let M=0;M<t;M++){let y=h[p][M+1],v=h[p][M],T=h[p+1][M],A=h[p+1][M+1];(p!==0||o>0)&&d.push(y,v,A),(p!==i-1||l<Math.PI)&&d.push(v,T,A)}this.setIndex(d),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(x,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Xs=class n extends wt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new F,u=new F,f=new F;for(let d=0;d<=i;d++)for(let g=0;g<=s;g++){let x=g/s*r,m=d/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(x),u.y=(e+t*Math.cos(m))*Math.sin(x),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(d/i)}for(let d=1;d<=i;d++)for(let g=1;g<=s;g++){let x=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,M=(s+1)*d+g;o.push(x,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new $e(a,3)),this.setAttribute("normal",new $e(l,3)),this.setAttribute("uv",new $e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Or=class n extends wt{constructor(e=new Wo(new F(-1,-1,0),new F(-1,1,0),new F(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new F,l=new F,c=new xe,h=new F,u=[],f=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new $e(u,3)),this.setAttribute("normal",new $e(f,3)),this.setAttribute("uv",new $e(d,2));function x(){for(let y=0;y<t;y++)m(y);m(r===!1?t:0),M(),p()}function m(y){h=e.getPointAt(y/t,h);let v=o.normals[y],T=o.binormals[y];for(let A=0;A<=s;A++){let P=A/s*Math.PI*2,C=Math.sin(P),w=-Math.cos(P);l.x=w*v.x+C*T.x,l.y=w*v.y+C*T.y,l.z=w*v.z+C*T.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+i*l.x,a.y=h.y+i*l.y,a.z=h.z+i*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let y=1;y<=t;y++)for(let v=1;v<=s;v++){let T=(s+1)*(y-1)+(v-1),A=(s+1)*y+(v-1),P=(s+1)*y+v,C=(s+1)*(y-1)+v;g.push(T,A,C),g.push(A,P,C)}}function M(){for(let y=0;y<=t;y++)for(let v=0;v<=s;v++)c.x=y/t,c.y=v/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new _l[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var jo=class extends gt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Kt=class extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lc,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},qs=class extends Kt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return bt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Pe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Pe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Pe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Qo=class extends Qi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lc,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};var bl=class extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sl=class extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ol(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function fm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var Ys=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},wl=class extends Ys{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Gh,endingEnd:Gh}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Wh:r=e,a=2*t-i;break;case Xh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Wh:o=e,l=2*i-t;break;case Xh:o=1,l=i+s[1]-s[0];break;default:o=e-1,l=t}let c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(i-t)/(s-t),x=g*g,m=x*g,p=-f*m+2*f*x-f*g,M=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*g+1,y=(-1-d)*m+(1.5+d)*x+.5*g,v=d*m-d*x;for(let T=0;T!==a;++T)r[T]=p*o[h+T]+M*o[c+T]+y*o[l+T]+v*o[u+T];return r}},El=class extends Ys{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(i-t)/(s-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},Tl=class extends Ys{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ai=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ol(t,this.TimeBufferType),this.values=ol(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ol(e.times,Array),values:ol(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Tl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new El(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new wl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Eo:t=this.InterpolantFactoryMethodDiscrete;break;case ul:t=this.InterpolantFactoryMethodLinear;break;case al:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Eo;case this.InterpolantFactoryMethodLinear:return ul;case this.InterpolantFactoryMethodSmooth:return al}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&fm(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===al,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*i,f=u-i,d=u+i;for(let g=0;g!==i;++g){let x=t[u+g];if(x!==t[f+g]||x!==t[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*i,f=o*i;for(let d=0;d!==i;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ai.prototype.ValueTypeName="";ai.prototype.TimeBufferType=Float32Array;ai.prototype.ValueBufferType=Float32Array;ai.prototype.DefaultInterpolation=ul;var ms=class extends ai{constructor(e,t,i){super(e,t,i)}};ms.prototype.ValueTypeName="bool";ms.prototype.ValueBufferType=Array;ms.prototype.DefaultInterpolation=Eo;ms.prototype.InterpolantFactoryMethodLinear=void 0;ms.prototype.InterpolantFactoryMethodSmooth=void 0;var Al=class extends ai{constructor(e,t,i,s){super(e,t,i,s)}};Al.prototype.ValueTypeName="color";var Rl=class extends ai{constructor(e,t,i,s){super(e,t,i,s)}};Rl.prototype.ValueTypeName="number";var Cl=class extends Ys{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)$n.slerpFlat(r,0,o,c-a,o,c,l);return r}},ea=class extends ai{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Cl(this.times,this.values,this.getValueSize(),e)}};ea.prototype.ValueTypeName="quaternion";ea.prototype.InterpolantFactoryMethodSmooth=void 0;var gs=class extends ai{constructor(e,t,i){super(e,t,i)}};gs.prototype.ValueTypeName="string";gs.prototype.ValueBufferType=Array;gs.prototype.DefaultInterpolation=Eo;gs.prototype.InterpolantFactoryMethodLinear=void 0;gs.prototype.InterpolantFactoryMethodSmooth=void 0;var Pl=class extends ai{constructor(e,t,i,s){super(e,t,i,s)}};Pl.prototype.ValueTypeName="vector";var Il=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},_f=new Il,Dl=class{constructor(e){this.manager=e!==void 0?e:_f,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Dl.DEFAULT_MATERIAL_NAME="__DEFAULT";var zr=class extends Ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ta=class extends zr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Bh=new it,Ld=new F,Nd=new F,Ll=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=qn,this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lr,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new Ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Ld.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ld),Nd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nd),t.updateMatrixWorld(),Bh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Bh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Ud=new it,yo=new F,Hh=new F,Kh=class extends Ll{constructor(){super(new Rn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new xe(4,2),this._viewportCount=6,this._viewports=[new Ft(2,1,1,1),new Ft(0,1,1,1),new Ft(3,1,1,1),new Ft(1,1,1,1),new Ft(3,0,1,1),new Ft(1,0,1,1)],this._cubeDirections=[new F(1,0,0),new F(-1,0,0),new F(0,0,1),new F(0,0,-1),new F(0,1,0),new F(0,-1,0)],this._cubeUps=[new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,0,1),new F(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),yo.setFromMatrixPosition(e.matrixWorld),i.position.copy(yo),Hh.copy(i.position),Hh.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Hh),i.updateMatrixWorld(),s.makeTranslation(-yo.x,-yo.y,-yo.z),Ud.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ud,i.coordinateSystem,i.reversedDepth)}},na=class extends zr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Kh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Zs=class extends No{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},jh=class extends Ll{constructor(){super(new Zs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Br=class extends zr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.target=new Ht,this.shadow=new jh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ia=class extends wt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var Nl=class extends Rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},sa=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var yu="\\[\\]\\.:\\/",pm=new RegExp("["+yu+"]","g"),_u="[^"+yu+"]",mm="[^"+yu.replace("\\.","")+"]",gm=/((?:WC+[\/:])*)/.source.replace("WC",_u),xm=/(WCOD+)?/.source.replace("WCOD",mm),vm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_u),ym=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_u),_m=new RegExp("^"+gm+xm+vm+ym+"$"),Mm=["material","materials","bones","map"],Qh=class{constructor(e,t,i){let s=i||Qt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Qt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(pm,"")}static parseTrackName(e){let t=_m.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Mm.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Qt.Composite=Qh;Qt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Qt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Qt.prototype.GetterByBindingType=[Qt.prototype._getValue_direct,Qt.prototype._getValue_array,Qt.prototype._getValue_arrayElement,Qt.prototype._getValue_toArray];Qt.prototype.SetterByBindingTypeAndVersioning=[[Qt.prototype._setValue_direct,Qt.prototype._setValue_direct_setNeedsUpdate,Qt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Qt.prototype._setValue_array,Qt.prototype._setValue_array_setNeedsUpdate,Qt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Qt.prototype._setValue_arrayElement,Qt.prototype._setValue_arrayElement_setNeedsUpdate,Qt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Qt.prototype._setValue_fromArray,Qt.prototype._setValue_fromArray_setNeedsUpdate,Qt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var h_=new Float32Array(1);function Mu(n,e,t,i){let s=bm(i);switch(t){case hu:return n*e;case ys:return n*e/s.components*s.byteLength;case nc:return n*e/s.components*s.byteLength;case du:return n*e*2/s.components*s.byteLength;case ic:return n*e*2/s.components*s.byteLength;case uu:return n*e*3/s.components*s.byteLength;case vn:return n*e*4/s.components*s.byteLength;case sc:return n*e*4/s.components*s.byteLength;case ca:case ha:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ua:case da:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case oc:case lc:return Math.max(n,16)*Math.max(e,8)/4;case rc:case ac:return Math.max(n,8)*Math.max(e,8)/2;case cc:case hc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case uc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case dc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case fc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case pc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case mc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case gc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case xc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case vc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case yc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case _c:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Mc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case bc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Sc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case wc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ec:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Tc:case Ac:case Rc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Cc:case Pc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ic:case Dc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function bm(n){switch(n){case qn:case ou:return{byteLength:1,components:1};case Vr:case au:case xn:return{byteLength:2,components:1};case ec:case tc:return{byteLength:2,components:4};case zi:case Ql:case mi:return{byteLength:4,components:1};case lu:case cu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Wf(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Cm(n){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){let g=u[f],x=u[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){let x=u[d];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Pm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Im=`#ifdef USE_ALPHAHASH
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
#endif`,Dm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Um=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fm=`#ifdef USE_AOMAP
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
#endif`,km=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Om=`#ifdef USE_BATCHING
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
#endif`,zm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gm=`#ifdef USE_IRIDESCENCE
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
#endif`,Wm=`#ifdef USE_BUMPMAP
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
#endif`,Xm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,qm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ym=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Km=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,jm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Qm=`#define PI 3.141592653589793
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
} // validated`,eg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tg=`vec3 transformedNormal = objectNormal;
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
#endif`,ng=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ig=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,og="gl_FragColor = linearToOutputTexel( gl_FragColor );",ag=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lg=`#ifdef USE_ENVMAP
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
#endif`,cg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hg=`#ifdef USE_ENVMAP
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
#endif`,ug=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dg=`#ifdef USE_ENVMAP
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
#endif`,fg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xg=`#ifdef USE_GRADIENTMAP
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
}`,vg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_g=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mg=`uniform bool receiveShadow;
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
#endif`,bg=`#ifdef USE_ENVMAP
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
#endif`,Sg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Eg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ag=`PhysicalMaterial material;
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
#endif`,Rg=`struct PhysicalMaterial {
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
}`,Cg=`
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
#endif`,Pg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ig=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ng=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ug=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,kg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Og=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zg=`#if defined( USE_POINTS_UV )
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
#endif`,Bg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xg=`#ifdef USE_MORPHTARGETS
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
#endif`,qg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Zg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jg=`#ifdef USE_NORMALMAP
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
#endif`,Qg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,e1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,t1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,n1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,i1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,s1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,r1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,o1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,a1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,l1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,c1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,h1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,u1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,d1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,f1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,p1=`float getShadowMask() {
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
}`,m1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,g1=`#ifdef USE_SKINNING
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
#endif`,x1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,v1=`#ifdef USE_SKINNING
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
#endif`,y1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,M1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,b1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,S1=`#ifdef USE_TRANSMISSION
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
#endif`,w1=`#ifdef USE_TRANSMISSION
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
#endif`,E1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,R1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,C1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,P1=`uniform sampler2D t2D;
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
}`,I1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,L1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U1=`#include <common>
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
}`,F1=`#if DEPTH_PACKING == 3200
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
}`,k1=`#define DISTANCE
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
}`,O1=`#define DISTANCE
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
}`,z1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,B1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H1=`uniform float scale;
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
}`,V1=`uniform vec3 diffuse;
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
}`,G1=`#include <common>
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
}`,W1=`uniform vec3 diffuse;
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
}`,X1=`#define LAMBERT
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
}`,q1=`#define LAMBERT
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
}`,Y1=`#define MATCAP
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
}`,Z1=`#define MATCAP
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
}`,$1=`#define NORMAL
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
}`,J1=`#define NORMAL
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
}`,K1=`#define PHONG
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
}`,j1=`#define PHONG
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
}`,Q1=`#define STANDARD
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
}`,ex=`#define STANDARD
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
}`,tx=`#define TOON
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
}`,nx=`#define TOON
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
}`,ix=`uniform float size;
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
}`,sx=`uniform vec3 diffuse;
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
}`,rx=`#include <common>
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
}`,ox=`uniform vec3 color;
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
}`,ax=`uniform float rotation;
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
}`,lx=`uniform vec3 diffuse;
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
}`,Et={alphahash_fragment:Pm,alphahash_pars_fragment:Im,alphamap_fragment:Dm,alphamap_pars_fragment:Lm,alphatest_fragment:Nm,alphatest_pars_fragment:Um,aomap_fragment:Fm,aomap_pars_fragment:km,batching_pars_vertex:Om,batching_vertex:zm,begin_vertex:Bm,beginnormal_vertex:Hm,bsdfs:Vm,iridescence_fragment:Gm,bumpmap_pars_fragment:Wm,clipping_planes_fragment:Xm,clipping_planes_pars_fragment:qm,clipping_planes_pars_vertex:Ym,clipping_planes_vertex:Zm,color_fragment:$m,color_pars_fragment:Jm,color_pars_vertex:Km,color_vertex:jm,common:Qm,cube_uv_reflection_fragment:eg,defaultnormal_vertex:tg,displacementmap_pars_vertex:ng,displacementmap_vertex:ig,emissivemap_fragment:sg,emissivemap_pars_fragment:rg,colorspace_fragment:og,colorspace_pars_fragment:ag,envmap_fragment:lg,envmap_common_pars_fragment:cg,envmap_pars_fragment:hg,envmap_pars_vertex:ug,envmap_physical_pars_fragment:bg,envmap_vertex:dg,fog_vertex:fg,fog_pars_vertex:pg,fog_fragment:mg,fog_pars_fragment:gg,gradientmap_pars_fragment:xg,lightmap_pars_fragment:vg,lights_lambert_fragment:yg,lights_lambert_pars_fragment:_g,lights_pars_begin:Mg,lights_toon_fragment:Sg,lights_toon_pars_fragment:wg,lights_phong_fragment:Eg,lights_phong_pars_fragment:Tg,lights_physical_fragment:Ag,lights_physical_pars_fragment:Rg,lights_fragment_begin:Cg,lights_fragment_maps:Pg,lights_fragment_end:Ig,logdepthbuf_fragment:Dg,logdepthbuf_pars_fragment:Lg,logdepthbuf_pars_vertex:Ng,logdepthbuf_vertex:Ug,map_fragment:Fg,map_pars_fragment:kg,map_particle_fragment:Og,map_particle_pars_fragment:zg,metalnessmap_fragment:Bg,metalnessmap_pars_fragment:Hg,morphinstance_vertex:Vg,morphcolor_vertex:Gg,morphnormal_vertex:Wg,morphtarget_pars_vertex:Xg,morphtarget_vertex:qg,normal_fragment_begin:Yg,normal_fragment_maps:Zg,normal_pars_fragment:$g,normal_pars_vertex:Jg,normal_vertex:Kg,normalmap_pars_fragment:jg,clearcoat_normal_fragment_begin:Qg,clearcoat_normal_fragment_maps:e1,clearcoat_pars_fragment:t1,iridescence_pars_fragment:n1,opaque_fragment:i1,packing:s1,premultiplied_alpha_fragment:r1,project_vertex:o1,dithering_fragment:a1,dithering_pars_fragment:l1,roughnessmap_fragment:c1,roughnessmap_pars_fragment:h1,shadowmap_pars_fragment:u1,shadowmap_pars_vertex:d1,shadowmap_vertex:f1,shadowmask_pars_fragment:p1,skinbase_vertex:m1,skinning_pars_vertex:g1,skinning_vertex:x1,skinnormal_vertex:v1,specularmap_fragment:y1,specularmap_pars_fragment:_1,tonemapping_fragment:M1,tonemapping_pars_fragment:b1,transmission_fragment:S1,transmission_pars_fragment:w1,uv_pars_fragment:E1,uv_pars_vertex:T1,uv_vertex:A1,worldpos_vertex:R1,background_vert:C1,background_frag:P1,backgroundCube_vert:I1,backgroundCube_frag:D1,cube_vert:L1,cube_frag:N1,depth_vert:U1,depth_frag:F1,distanceRGBA_vert:k1,distanceRGBA_frag:O1,equirect_vert:z1,equirect_frag:B1,linedashed_vert:H1,linedashed_frag:V1,meshbasic_vert:G1,meshbasic_frag:W1,meshlambert_vert:X1,meshlambert_frag:q1,meshmatcap_vert:Y1,meshmatcap_frag:Z1,meshnormal_vert:$1,meshnormal_frag:J1,meshphong_vert:K1,meshphong_frag:j1,meshphysical_vert:Q1,meshphysical_frag:ex,meshtoon_vert:tx,meshtoon_frag:nx,points_vert:ix,points_frag:sx,shadow_vert:rx,shadow_frag:ox,sprite_vert:ax,sprite_frag:lx},Ge={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new _t}},envmap:{envMap:{value:null},envMapRotation:{value:new _t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new _t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new _t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new _t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new _t},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new _t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new _t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new _t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new _t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0},uvTransform:{value:new _t}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}}},Bi={basic:{uniforms:zn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:Et.meshbasic_vert,fragmentShader:Et.meshbasic_frag},lambert:{uniforms:zn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Et.meshlambert_vert,fragmentShader:Et.meshlambert_frag},phong:{uniforms:zn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Et.meshphong_vert,fragmentShader:Et.meshphong_frag},standard:{uniforms:zn([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Et.meshphysical_vert,fragmentShader:Et.meshphysical_frag},toon:{uniforms:zn([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Et.meshtoon_vert,fragmentShader:Et.meshtoon_frag},matcap:{uniforms:zn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:Et.meshmatcap_vert,fragmentShader:Et.meshmatcap_frag},points:{uniforms:zn([Ge.points,Ge.fog]),vertexShader:Et.points_vert,fragmentShader:Et.points_frag},dashed:{uniforms:zn([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Et.linedashed_vert,fragmentShader:Et.linedashed_frag},depth:{uniforms:zn([Ge.common,Ge.displacementmap]),vertexShader:Et.depth_vert,fragmentShader:Et.depth_frag},normal:{uniforms:zn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:Et.meshnormal_vert,fragmentShader:Et.meshnormal_frag},sprite:{uniforms:zn([Ge.sprite,Ge.fog]),vertexShader:Et.sprite_vert,fragmentShader:Et.sprite_frag},background:{uniforms:{uvTransform:{value:new _t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Et.background_vert,fragmentShader:Et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new _t}},vertexShader:Et.backgroundCube_vert,fragmentShader:Et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Et.cube_vert,fragmentShader:Et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Et.equirect_vert,fragmentShader:Et.equirect_frag},distanceRGBA:{uniforms:zn([Ge.common,Ge.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Et.distanceRGBA_vert,fragmentShader:Et.distanceRGBA_frag},shadow:{uniforms:zn([Ge.lights,Ge.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Et.shadow_vert,fragmentShader:Et.shadow_frag}};Bi.physical={uniforms:zn([Bi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new _t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new _t},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new _t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new _t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new _t},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new _t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new _t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new _t},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new _t},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new _t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new _t},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new _t}}]),vertexShader:Et.meshphysical_vert,fragmentShader:Et.meshphysical_frag};var Nc={r:0,b:0,g:0},Qs=new ri,cx=new it;function hx(n,e,t,i,s,r,o){let a=new Pe(0),l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function x(y){let v=!1,T=g(y);T===null?p(a,l):T&&T.isColor&&(p(T,1),v=!0);let A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,v){let T=g(v);T&&(T.isCubeTexture||T.mapping===aa)?(h===void 0&&(h=new tt(new Vt(1,1,1),new gt({name:"BackgroundCubeMaterial",uniforms:js(Bi.backgroundCube.uniforms),vertexShader:Bi.backgroundCube.vertexShader,fragmentShader:Bi.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Qs.copy(v.backgroundRotation),Qs.x*=-1,Qs.y*=-1,Qs.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Qs.y*=-1,Qs.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(cx.makeRotationFromEuler(Qs)),h.material.toneMapped=Pt.getTransfer(T.colorSpace)!==Ot,(u!==T||f!==T.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,f=T.version,d=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new tt(new dn(2,2),new gt({name:"BackgroundMaterial",uniforms:js(Bi.background.uniforms),vertexShader:Bi.background.vertexShader,fragmentShader:Bi.background.fragmentShader,side:Ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Pt.getTransfer(T.colorSpace)!==Ot,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=T,f=T.version,d=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,v){y.getRGB(Nc,xu(n)),i.buffers.color.setClear(Nc.r,Nc.g,Nc.b,v,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:x,addToRenderList:m,dispose:M}}function ux(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(b,I,L,U,V){let Y=!1,O=u(U,L,I);r!==O&&(r=O,c(r.object)),Y=d(b,U,L,V),Y&&g(b,U,L,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,v(b,I,L,U),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function u(b,I,L){let U=L.wireframe===!0,V=i[b.id];V===void 0&&(V={},i[b.id]=V);let Y=V[I.id];Y===void 0&&(Y={},V[I.id]=Y);let O=Y[U];return O===void 0&&(O=f(l()),Y[U]=O),O}function f(b){let I=[],L=[],U=[];for(let V=0;V<t;V++)I[V]=0,L[V]=0,U[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:L,attributeDivisors:U,object:b,attributes:{},index:null}}function d(b,I,L,U){let V=r.attributes,Y=I.attributes,O=0,W=L.getAttributes();for(let X in W)if(W[X].location>=0){let oe=V[X],pe=Y[X];if(pe===void 0&&(X==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),X==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor)),oe===void 0||oe.attribute!==pe||pe&&oe.data!==pe.data)return!0;O++}return r.attributesNum!==O||r.index!==U}function g(b,I,L,U){let V={},Y=I.attributes,O=0,W=L.getAttributes();for(let X in W)if(W[X].location>=0){let oe=Y[X];oe===void 0&&(X==="instanceMatrix"&&b.instanceMatrix&&(oe=b.instanceMatrix),X==="instanceColor"&&b.instanceColor&&(oe=b.instanceColor));let pe={};pe.attribute=oe,oe&&oe.data&&(pe.data=oe.data),V[X]=pe,O++}r.attributes=V,r.attributesNum=O,r.index=U}function x(){let b=r.newAttributes;for(let I=0,L=b.length;I<L;I++)b[I]=0}function m(b){p(b,0)}function p(b,I){let L=r.newAttributes,U=r.enabledAttributes,V=r.attributeDivisors;L[b]=1,U[b]===0&&(n.enableVertexAttribArray(b),U[b]=1),V[b]!==I&&(n.vertexAttribDivisor(b,I),V[b]=I)}function M(){let b=r.newAttributes,I=r.enabledAttributes;for(let L=0,U=I.length;L<U;L++)I[L]!==b[L]&&(n.disableVertexAttribArray(L),I[L]=0)}function y(b,I,L,U,V,Y,O){O===!0?n.vertexAttribIPointer(b,I,L,V,Y):n.vertexAttribPointer(b,I,L,U,V,Y)}function v(b,I,L,U){x();let V=U.attributes,Y=L.getAttributes(),O=I.defaultAttributeValues;for(let W in Y){let X=Y[W];if(X.location>=0){let j=V[W];if(j===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(j=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(j=b.instanceColor)),j!==void 0){let oe=j.normalized,pe=j.itemSize,Se=e.get(j);if(Se===void 0)continue;let Ne=Se.buffer,ke=Se.type,De=Se.bytesPerElement,ee=ke===n.INT||ke===n.UNSIGNED_INT||j.gpuType===Ql;if(j.isInterleavedBufferAttribute){let ne=j.data,me=ne.stride,fe=j.offset;if(ne.isInstancedInterleavedBuffer){for(let ge=0;ge<X.locationSize;ge++)p(X.location+ge,ne.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ge=0;ge<X.locationSize;ge++)m(X.location+ge);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let ge=0;ge<X.locationSize;ge++)y(X.location+ge,pe/X.locationSize,ke,oe,me*De,(fe+pe/X.locationSize*ge)*De,ee)}else{if(j.isInstancedBufferAttribute){for(let ne=0;ne<X.locationSize;ne++)p(X.location+ne,j.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ne=0;ne<X.locationSize;ne++)m(X.location+ne);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let ne=0;ne<X.locationSize;ne++)y(X.location+ne,pe/X.locationSize,ke,oe,pe*De,pe/X.locationSize*ne*De,ee)}}else if(O!==void 0){let oe=O[W];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(X.location,oe);break;case 3:n.vertexAttrib3fv(X.location,oe);break;case 4:n.vertexAttrib4fv(X.location,oe);break;default:n.vertexAttrib1fv(X.location,oe)}}}}M()}function T(){C();for(let b in i){let I=i[b];for(let L in I){let U=I[L];for(let V in U)h(U[V].object),delete U[V];delete I[L]}delete i[b]}}function A(b){if(i[b.id]===void 0)return;let I=i[b.id];for(let L in I){let U=I[L];for(let V in U)h(U[V].object),delete U[V];delete I[L]}delete i[b.id]}function P(b){for(let I in i){let L=i[I];if(L[b.id]===void 0)continue;let U=L[b.id];for(let V in U)h(U[V].object),delete U[V];delete L[b.id]}}function C(){w(),o=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:w,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function dx(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];t.update(d,i,1)}function l(c,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*f[x];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function fx(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==vn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let C=P===xn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==qn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==mi&&!C)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,A=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:T,maxSamples:A}}function px(n){let e=this,t=null,i=0,s=!1,r=!1,o=new Ni,a=new _t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:i,y=M*4,v=p.clippingState||null;l.value=v,v=h(g,f,y,d);for(let T=0;T!==y;++T)v[T]=t[T];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,d,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=d+x*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,v=d;y!==x;++y,v+=4)o.copy(u[y]).applyMatrix4(M,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function mx(n){let e=new WeakMap;function t(o,a){return a===Jl?o.mapping=Js:a===Kl&&(o.mapping=Ks),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Jl||a===Kl)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new gl(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var Xr=4,Mf=[.125,.215,.35,.446,.526,.582],nr=20,bu=new Zs,bf=new Pe,Su=null,wu=0,Eu=0,Tu=!1,tr=(1+Math.sqrt(5))/2,Wr=1/tr,Sf=[new F(-tr,Wr,0),new F(tr,Wr,0),new F(-Wr,0,tr),new F(Wr,0,tr),new F(0,tr,-Wr),new F(0,tr,Wr),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)],gx=new F,Yr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=gx}=r;Su=this._renderer.getRenderTarget(),wu=this._renderer.getActiveCubeFace(),Eu=this._renderer.getActiveMipmapLevel(),Tu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ef(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Su,wu,Eu),this._renderer.xr.enabled=Tu,e.scissorTest=!1,Uc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Js||e.mapping===Ks?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Su=this._renderer.getRenderTarget(),wu=this._renderer.getActiveCubeFace(),Eu=this._renderer.getActiveMipmapLevel(),Tu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:xn,format:vn,colorSpace:Os,depthBuffer:!1},s=wf(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wf(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xx(r)),this._blurMaterial=vx(r,e,t)}return s}_compileMaterial(e){let t=new tt(this._lodPlanes[0],e);this._renderer.compile(t,bu)}_sceneToCubeUV(e,t,i,s,r){let l=new Rn(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(bf),u.toneMapping=is,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new on({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1}),m=new tt(new Vt,x),p=!1,M=e.background;M?M.isColor&&(x.color.copy(M),e.background=null,p=!0):(x.color.copy(bf),p=!0);for(let y=0;y<6;y++){let v=y%3;v===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):v===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));let T=this._cubeSize;Uc(s,v*T,y>2?T:0,T,T),u.setRenderTarget(s),p&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=M}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Js||e.mapping===Ks;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ef());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new tt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Uc(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,bu)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Sf[(s-r-1)%Sf.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new tt(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*nr-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):nr;m>nr&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${nr}`);let p=[],M=0;for(let P=0;P<nr;++P){let C=P/x,w=Math.exp(-C*C/2);p.push(w),P===0?M+=w:P<m&&(M+=2*w)}for(let P=0;P<p.length;P++)p[P]=p[P]/M;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-i;let v=this._sizeLods[s],T=3*v*(s>y-Xr?s-y+Xr:0),A=4*(this._cubeSize-v);Uc(t,T,A,3*v,2*v),l.setRenderTarget(t),l.render(u,bu)}};function xx(n){let e=[],t=[],i=[],s=n,r=n-Xr+1+Mf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>n-Xr?l=Mf[o-n+Xr-1]:o===0&&(l=0),i.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,m=2,p=1,M=new Float32Array(x*g*d),y=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let A=0;A<d;A++){let P=A%3*2/3-1,C=A>2?0:-1,w=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];M.set(w,x*g*A),y.set(f,m*g*A);let b=[A,A,A,A,A,A];v.set(b,p*g*A)}let T=new wt;T.setAttribute("position",new It(M,x)),T.setAttribute("uv",new It(y,m)),T.setAttribute("faceIndex",new It(v,p)),e.push(T),s>Xr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function wf(n,e,t){let i=new hn(n,e,t);return i.texture.mapping=aa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Uc(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function vx(n,e,t){let i=new Float32Array(nr),s=new F(0,1,0);return new gt({name:"SphericalGaussianBlur",defines:{n:nr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fu(),fragmentShader:`

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
		`,blending:fn,depthTest:!1,depthWrite:!1})}function Ef(){return new gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fu(),fragmentShader:`

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
		`,blending:fn,depthTest:!1,depthWrite:!1})}function Tf(){return new gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fn,depthTest:!1,depthWrite:!1})}function Fu(){return`

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
	`}function yx(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let l=a.mapping,c=l===Jl||l===Kl,h=l===Js||l===Ks;if(c||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Yr(n)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new Yr(n)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function _x(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Rr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Mx(n,e,t,i){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let d in f)e.update(f[d],n.ARRAY_BUFFER)}function c(u){let f=[],d=u.index,g=u.attributes.position,x=0;if(d!==null){let M=d.array;x=d.version;for(let y=0,v=M.length;y<v;y+=3){let T=M[y+0],A=M[y+1],P=M[y+2];f.push(T,A,A,P,P,T)}}else if(g!==void 0){let M=g.array;x=g.version;for(let y=0,v=M.length/3-1;y<v;y+=3){let T=y+0,A=y+1,P=y+2;f.push(T,A,A,P,P,T)}}else return;let m=new(gu(f)?Lo:zs)(f,1);m.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function bx(n,e,t){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){n.drawElements(i,d,r,f*o),t.update(d,i,1)}function c(f,d,g){g!==0&&(n.drawElementsInstanced(i,d,r,f*o,g),t.update(d,i,g))}function h(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,i,1)}function u(f,d,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/o,d[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,r,f,0,x,0,g);let p=0;for(let M=0;M<g;M++)p+=d[M]*x[M];t.update(p,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Sx(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function wx(n,e,t){let i=new WeakMap,s=new Ft;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=i.get(a);if(f===void 0||f.count!==u){let w=function(){P.dispose(),i.delete(a),a.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],y=0;d===!0&&(y=1),g===!0&&(y=2),x===!0&&(y=3);let v=a.attributes.position.count*y,T=1;v>e.maxTextureSize&&(T=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let A=new Float32Array(v*T*4*u),P=new Co(A,v,T,u);P.type=mi,P.needsUpdate=!0;let C=y*4;for(let b=0;b<u;b++){let I=m[b],L=p[b],U=M[b],V=v*T*4*b;for(let Y=0;Y<I.count;Y++){let O=Y*C;d===!0&&(s.fromBufferAttribute(I,Y),A[V+O+0]=s.x,A[V+O+1]=s.y,A[V+O+2]=s.z,A[V+O+3]=0),g===!0&&(s.fromBufferAttribute(L,Y),A[V+O+4]=s.x,A[V+O+5]=s.y,A[V+O+6]=s.z,A[V+O+7]=0),x===!0&&(s.fromBufferAttribute(U,Y),A[V+O+8]=s.x,A[V+O+9]=s.y,A[V+O+10]=s.z,A[V+O+11]=U.itemSize===4?s.w:1)}}f={count:u,texture:P,size:new xe(v,T)},i.set(a,f),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Ex(n,e,t,i){let s=new WeakMap;function r(l){let c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Xf=new Xn,Af=new es(1,1),qf=new Co,Yf=new pl,Zf=new Uo,Rf=[],Cf=[],Pf=new Float32Array(16),If=new Float32Array(9),Df=new Float32Array(4);function Zr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Rf[s];if(r===void 0&&(r=new Float32Array(s),Rf[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function yn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function _n(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Oc(n,e){let t=Cf[e];t===void 0&&(t=new Int32Array(e),Cf[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Tx(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Ax(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2fv(this.addr,e),_n(t,e)}}function Rx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;n.uniform3fv(this.addr,e),_n(t,e)}}function Cx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4fv(this.addr,e),_n(t,e)}}function Px(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),_n(t,e)}else{if(yn(t,i))return;Df.set(i),n.uniformMatrix2fv(this.addr,!1,Df),_n(t,i)}}function Ix(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),_n(t,e)}else{if(yn(t,i))return;If.set(i),n.uniformMatrix3fv(this.addr,!1,If),_n(t,i)}}function Dx(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),_n(t,e)}else{if(yn(t,i))return;Pf.set(i),n.uniformMatrix4fv(this.addr,!1,Pf),_n(t,i)}}function Lx(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Nx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2iv(this.addr,e),_n(t,e)}}function Ux(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3iv(this.addr,e),_n(t,e)}}function Fx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4iv(this.addr,e),_n(t,e)}}function kx(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Ox(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2uiv(this.addr,e),_n(t,e)}}function zx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3uiv(this.addr,e),_n(t,e)}}function Bx(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4uiv(this.addr,e),_n(t,e)}}function Hx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Af.compareFunction=fu,r=Af):r=Xf,t.setTexture2D(e||r,s)}function Vx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Yf,s)}function Gx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Zf,s)}function Wx(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||qf,s)}function Xx(n){switch(n){case 5126:return Tx;case 35664:return Ax;case 35665:return Rx;case 35666:return Cx;case 35674:return Px;case 35675:return Ix;case 35676:return Dx;case 5124:case 35670:return Lx;case 35667:case 35671:return Nx;case 35668:case 35672:return Ux;case 35669:case 35673:return Fx;case 5125:return kx;case 36294:return Ox;case 36295:return zx;case 36296:return Bx;case 35678:case 36198:case 36298:case 36306:case 35682:return Hx;case 35679:case 36299:case 36307:return Vx;case 35680:case 36300:case 36308:case 36293:return Gx;case 36289:case 36303:case 36311:case 36292:return Wx}}function qx(n,e){n.uniform1fv(this.addr,e)}function Yx(n,e){let t=Zr(e,this.size,2);n.uniform2fv(this.addr,t)}function Zx(n,e){let t=Zr(e,this.size,3);n.uniform3fv(this.addr,t)}function $x(n,e){let t=Zr(e,this.size,4);n.uniform4fv(this.addr,t)}function Jx(n,e){let t=Zr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Kx(n,e){let t=Zr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function jx(n,e){let t=Zr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Qx(n,e){n.uniform1iv(this.addr,e)}function ev(n,e){n.uniform2iv(this.addr,e)}function tv(n,e){n.uniform3iv(this.addr,e)}function nv(n,e){n.uniform4iv(this.addr,e)}function iv(n,e){n.uniform1uiv(this.addr,e)}function sv(n,e){n.uniform2uiv(this.addr,e)}function rv(n,e){n.uniform3uiv(this.addr,e)}function ov(n,e){n.uniform4uiv(this.addr,e)}function av(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);yn(i,r)||(n.uniform1iv(this.addr,r),_n(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Xf,r[o])}function lv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);yn(i,r)||(n.uniform1iv(this.addr,r),_n(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Yf,r[o])}function cv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);yn(i,r)||(n.uniform1iv(this.addr,r),_n(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Zf,r[o])}function hv(n,e,t){let i=this.cache,s=e.length,r=Oc(t,s);yn(i,r)||(n.uniform1iv(this.addr,r),_n(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||qf,r[o])}function uv(n){switch(n){case 5126:return qx;case 35664:return Yx;case 35665:return Zx;case 35666:return $x;case 35674:return Jx;case 35675:return Kx;case 35676:return jx;case 5124:case 35670:return Qx;case 35667:case 35671:return ev;case 35668:case 35672:return tv;case 35669:case 35673:return nv;case 5125:return iv;case 36294:return sv;case 36295:return rv;case 36296:return ov;case 35678:case 36198:case 36298:case 36306:case 35682:return av;case 35679:case 36299:case 36307:return lv;case 35680:case 36300:case 36308:case 36293:return cv;case 36289:case 36303:case 36311:case 36292:return hv}}var Ru=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Xx(t.type)}},Cu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uv(t.type)}},Pu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},Au=/(\w+)(\])?(\[|\.)?/g;function Lf(n,e){n.seq.push(e),n.map[e.id]=e}function dv(n,e,t){let i=n.name,s=i.length;for(Au.lastIndex=0;;){let r=Au.exec(i),o=Au.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Lf(t,c===void 0?new Ru(a,n,e):new Cu(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new Pu(a),Lf(t,u)),t=u}}}var qr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);dv(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Nf(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var fv=37297,pv=0;function mv(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Uf=new _t;function gv(n){Pt._getMatrix(Uf,Pt.workingColorSpace,n);let e=`mat3( ${Uf.elements.map(t=>t.toFixed(4))} )`;switch(Pt.getTransfer(n)){case To:return[e,"LinearTransferOETF"];case Ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ff(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+mv(n.getShaderSource(e),a)}else return r}function xv(n,e){let t=gv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function vv(n,e){let t;switch(e){case Wl:t="Linear";break;case Xl:t="Reinhard";break;case ql:t="Cineon";break;case Hr:t="ACESFilmic";break;case Zl:t="AgX";break;case $l:t="Neutral";break;case Yl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fc=new F;function yv(){Pt.getLuminanceCoefficients(Fc);let n=Fc.x.toFixed(4),e=Fc.y.toFixed(4),t=Fc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _v(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(pa).join(`
`)}function Mv(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function bv(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function pa(n){return n!==""}function kf(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Of(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Sv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Iu(n){return n.replace(Sv,Ev)}var wv=new Map;function Ev(n,e){let t=Et[e];if(t===void 0){let i=wv.get(e);if(i!==void 0)t=Et[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Iu(t)}var Tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zf(n){return n.replace(Tv,Av)}function Av(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bf(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function Rv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===tu?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ul?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Oi&&(e="SHADOWMAP_TYPE_VSM"),e}function Cv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Js:case Ks:e="ENVMAP_TYPE_CUBE";break;case aa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Pv(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ks:e="ENVMAP_MODE_REFRACTION";break}return e}function Iv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case su:e="ENVMAP_BLENDING_MULTIPLY";break;case jd:e="ENVMAP_BLENDING_MIX";break;case Qd:e="ENVMAP_BLENDING_ADD";break}return e}function Dv(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Lv(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Rv(t),c=Cv(t),h=Pv(t),u=Iv(t),f=Dv(t),d=_v(t),g=Mv(r),x=s.createProgram(),m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(pa).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(pa).join(`
`),p.length>0&&(p+=`
`)):(m=[Bf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(pa).join(`
`),p=[Bf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==is?"#define TONE_MAPPING":"",t.toneMapping!==is?Et.tonemapping_pars_fragment:"",t.toneMapping!==is?vv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Et.colorspace_pars_fragment,xv("linearToOutputTexel",t.outputColorSpace),yv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(pa).join(`
`)),o=Iu(o),o=kf(o,t),o=Of(o,t),a=Iu(a),a=kf(a,t),a=Of(a,t),o=zf(o),a=zf(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===pu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===pu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=M+m+o,v=M+p+a,T=Nf(s,s.VERTEX_SHADER,y),A=Nf(s,s.FRAGMENT_SHADER,v);s.attachShader(x,T),s.attachShader(x,A),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function P(I){if(n.debug.checkShaderErrors){let L=s.getProgramInfoLog(x)||"",U=s.getShaderInfoLog(T)||"",V=s.getShaderInfoLog(A)||"",Y=L.trim(),O=U.trim(),W=V.trim(),X=!0,j=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,T,A);else{let oe=Ff(s,T,"vertex"),pe=Ff(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+Y+`
`+oe+`
`+pe)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(O===""||W==="")&&(j=!1);j&&(I.diagnostics={runnable:X,programLog:Y,vertexShader:{log:O,prefix:m},fragmentShader:{log:W,prefix:p}})}s.deleteShader(T),s.deleteShader(A),C=new qr(s,x),w=bv(s,x)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,fv)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pv++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=A,this}var Nv=0,Du=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Lu(e),t.set(e,i)),i}},Lu=class{constructor(e){this.id=Nv++,this.code=e,this.usedTimes=0}};function Uv(n,e,t,i,s,r,o){let a=new Io,l=new Du,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,d=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,b,I,L,U){let V=L.fog,Y=U.geometry,O=w.isMeshStandardMaterial?L.environment:null,W=(w.isMeshStandardMaterial?t:e).get(w.envMap||O),X=W&&W.mapping===aa?W.image.height:null,j=g[w.type];w.precision!==null&&(d=s.getMaxPrecision(w.precision),d!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",d,"instead."));let oe=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,pe=oe!==void 0?oe.length:0,Se=0;Y.morphAttributes.position!==void 0&&(Se=1),Y.morphAttributes.normal!==void 0&&(Se=2),Y.morphAttributes.color!==void 0&&(Se=3);let Ne,ke,De,ee;if(j){let yt=Bi[j];Ne=yt.vertexShader,ke=yt.fragmentShader}else Ne=w.vertexShader,ke=w.fragmentShader,l.update(w),De=l.getVertexShaderID(w),ee=l.getFragmentShaderID(w);let ne=n.getRenderTarget(),me=n.state.buffers.depth.getReversed(),fe=U.isInstancedMesh===!0,ge=U.isBatchedMesh===!0,Ye=!!w.map,ft=!!w.matcap,k=!!W,B=!!w.aoMap,H=!!w.lightMap,K=!!w.bumpMap,Z=!!w.normalMap,J=!!w.displacementMap,re=!!w.emissiveMap,ce=!!w.metalnessMap,ie=!!w.roughnessMap,ae=w.anisotropy>0,R=w.clearcoat>0,S=w.dispersion>0,N=w.iridescence>0,$=w.sheen>0,z=w.transmission>0,G=ae&&!!w.anisotropyMap,be=R&&!!w.clearcoatMap,ve=R&&!!w.clearcoatNormalMap,we=R&&!!w.clearcoatRoughnessMap,Me=N&&!!w.iridescenceMap,ye=N&&!!w.iridescenceThicknessMap,Fe=$&&!!w.sheenColorMap,at=$&&!!w.sheenRoughnessMap,Je=!!w.specularMap,Le=!!w.specularColorMap,ot=!!w.specularIntensityMap,q=z&&!!w.transmissionMap,Ee=z&&!!w.thicknessMap,Ue=!!w.gradientMap,qe=!!w.alphaMap,Te=w.alphaTest>0,_e=!!w.alphaHash,Xe=!!w.extensions,nt=is;w.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(nt=n.toneMapping);let Bt={shaderID:j,shaderType:w.type,shaderName:w.name,vertexShader:Ne,fragmentShader:ke,defines:w.defines,customVertexShaderID:De,customFragmentShaderID:ee,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:d,batching:ge,batchingColor:ge&&U._colorsTexture!==null,instancing:fe,instancingColor:fe&&U.instanceColor!==null,instancingMorph:fe&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Os,alphaToCoverage:!!w.alphaToCoverage,map:Ye,matcap:ft,envMap:k,envMapMode:k&&W.mapping,envMapCubeUVHeight:X,aoMap:B,lightMap:H,bumpMap:K,normalMap:Z,displacementMap:f&&J,emissiveMap:re,normalMapObjectSpace:Z&&w.normalMapType===rf,normalMapTangentSpace:Z&&w.normalMapType===Lc,metalnessMap:ce,roughnessMap:ie,anisotropy:ae,anisotropyMap:G,clearcoat:R,clearcoatMap:be,clearcoatNormalMap:ve,clearcoatRoughnessMap:we,dispersion:S,iridescence:N,iridescenceMap:Me,iridescenceThicknessMap:ye,sheen:$,sheenColorMap:Fe,sheenRoughnessMap:at,specularMap:Je,specularColorMap:Le,specularIntensityMap:ot,transmission:z,transmissionMap:q,thicknessMap:Ee,gradientMap:Ue,opaque:w.transparent===!1&&w.blending===Ki&&w.alphaToCoverage===!1,alphaMap:qe,alphaTest:Te,alphaHash:_e,combine:w.combine,mapUv:Ye&&x(w.map.channel),aoMapUv:B&&x(w.aoMap.channel),lightMapUv:H&&x(w.lightMap.channel),bumpMapUv:K&&x(w.bumpMap.channel),normalMapUv:Z&&x(w.normalMap.channel),displacementMapUv:J&&x(w.displacementMap.channel),emissiveMapUv:re&&x(w.emissiveMap.channel),metalnessMapUv:ce&&x(w.metalnessMap.channel),roughnessMapUv:ie&&x(w.roughnessMap.channel),anisotropyMapUv:G&&x(w.anisotropyMap.channel),clearcoatMapUv:be&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:ve&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:at&&x(w.sheenRoughnessMap.channel),specularMapUv:Je&&x(w.specularMap.channel),specularColorMapUv:Le&&x(w.specularColorMap.channel),specularIntensityMapUv:ot&&x(w.specularIntensityMap.channel),transmissionMapUv:q&&x(w.transmissionMap.channel),thicknessMapUv:Ee&&x(w.thicknessMap.channel),alphaMapUv:qe&&x(w.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(Z||ae),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!Y.attributes.uv&&(Ye||qe),fog:!!V,useFog:w.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:me,skinning:U.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:Se,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:nt,decodeVideoTexture:Ye&&w.map.isVideoTexture===!0&&Pt.getTransfer(w.map.colorSpace)===Ot,decodeVideoTextureEmissive:re&&w.emissiveMap.isVideoTexture===!0&&Pt.getTransfer(w.emissiveMap.colorSpace)===Ot,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===jt,flipSided:w.side===gn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Xe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&w.extensions.multiDraw===!0||ge)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Bt.vertexUv1s=c.has(1),Bt.vertexUv2s=c.has(2),Bt.vertexUv3s=c.has(3),c.clear(),Bt}function p(w){let b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(let I in w.defines)b.push(I),b.push(w.defines[I]);return w.isRawShaderMaterial===!1&&(M(b,w),y(b,w),b.push(n.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function M(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function y(w,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),w.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),w.push(a.mask)}function v(w){let b=g[w.type],I;if(b){let L=Bi[b];I=In.clone(L.uniforms)}else I=w.uniforms;return I}function T(w,b){let I;for(let L=0,U=h.length;L<U;L++){let V=h[L];if(V.cacheKey===b){I=V,++I.usedTimes;break}}return I===void 0&&(I=new Lv(n,b,w,r),h.push(I)),I}function A(w){if(--w.usedTimes===0){let b=h.indexOf(w);h[b]=h[h.length-1],h.pop(),w.destroy()}}function P(w){l.remove(w)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:T,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:C}}function Fv(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function kv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Hf(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Vf(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u,f,d,g,x,m){let p=n[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},n[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),e++,p}function a(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?i.push(p):d.transparent===!0?s.push(p):t.push(p)}function l(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?i.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||kv),i.length>1&&i.sort(f||Hf),s.length>1&&s.sort(f||Hf)}function h(){for(let u=e,f=n.length;u<f;u++){let d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Ov(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Vf,n.set(i,[o])):s>=r.length?(o=new Vf,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function zv(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Pe};break;case"SpotLight":t={position:new F,direction:new F,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new F,halfWidth:new F,halfHeight:new F};break}return n[e.id]=t,t}}}function Bv(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var Hv=0;function Vv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Gv(n){let e=new zv,t=Bv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);let s=new F,r=new it,o=new it;function a(c){let h=0,u=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let d=0,g=0,x=0,m=0,p=0,M=0,y=0,v=0,T=0,A=0,P=0;c.sort(Vv);for(let w=0,b=c.length;w<b;w++){let I=c[w],L=I.color,U=I.intensity,V=I.distance,Y=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=L.r*U,u+=L.g*U,f+=L.b*U;else if(I.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(I.sh.coefficients[O],U);P++}else if(I.isDirectionalLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let W=I.shadow,X=t.get(I);X.shadowIntensity=W.intensity,X.shadowBias=W.bias,X.shadowNormalBias=W.normalBias,X.shadowRadius=W.radius,X.shadowMapSize=W.mapSize,i.directionalShadow[d]=X,i.directionalShadowMap[d]=Y,i.directionalShadowMatrix[d]=I.shadow.matrix,M++}i.directional[d]=O,d++}else if(I.isSpotLight){let O=e.get(I);O.position.setFromMatrixPosition(I.matrixWorld),O.color.copy(L).multiplyScalar(U),O.distance=V,O.coneCos=Math.cos(I.angle),O.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),O.decay=I.decay,i.spot[x]=O;let W=I.shadow;if(I.map&&(i.spotLightMap[T]=I.map,T++,W.updateMatrices(I),I.castShadow&&A++),i.spotLightMatrix[x]=W.matrix,I.castShadow){let X=t.get(I);X.shadowIntensity=W.intensity,X.shadowBias=W.bias,X.shadowNormalBias=W.normalBias,X.shadowRadius=W.radius,X.shadowMapSize=W.mapSize,i.spotShadow[x]=X,i.spotShadowMap[x]=Y,v++}x++}else if(I.isRectAreaLight){let O=e.get(I);O.color.copy(L).multiplyScalar(U),O.halfWidth.set(I.width*.5,0,0),O.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=O,m++}else if(I.isPointLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),O.distance=I.distance,O.decay=I.decay,I.castShadow){let W=I.shadow,X=t.get(I);X.shadowIntensity=W.intensity,X.shadowBias=W.bias,X.shadowNormalBias=W.normalBias,X.shadowRadius=W.radius,X.shadowMapSize=W.mapSize,X.shadowCameraNear=W.camera.near,X.shadowCameraFar=W.camera.far,i.pointShadow[g]=X,i.pointShadowMap[g]=Y,i.pointShadowMatrix[g]=I.shadow.matrix,y++}i.point[g]=O,g++}else if(I.isHemisphereLight){let O=e.get(I);O.skyColor.copy(I.color).multiplyScalar(U),O.groundColor.copy(I.groundColor).multiplyScalar(U),i.hemi[p]=O,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ge.LTC_FLOAT_1,i.rectAreaLTC2=Ge.LTC_FLOAT_2):(i.rectAreaLTC1=Ge.LTC_HALF_1,i.rectAreaLTC2=Ge.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;let C=i.hash;(C.directionalLength!==d||C.pointLength!==g||C.spotLength!==x||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==M||C.numPointShadows!==y||C.numSpotShadows!==v||C.numSpotMaps!==T||C.numLightProbes!==P)&&(i.directional.length=d,i.spot.length=x,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=v+T-A,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=P,C.directionalLength=d,C.pointLength=g,C.spotLength=x,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=M,C.numPointShadows=y,C.numSpotShadows=v,C.numSpotMaps=T,C.numLightProbes=P,i.version=Hv++)}function l(c,h){let u=0,f=0,d=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){let y=c[p];if(y.isDirectionalLight){let v=i.directional[u];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(y.isSpotLight){let v=i.spot[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(y.isRectAreaLight){let v=i.rectArea[g];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){let v=i.point[f];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let v=i.hemi[x];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function Gf(n){let e=new Gv(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function o(h){i.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Wv(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Gf(n),e.set(s,[a])):r>=o.length?(a=new Gf(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var Xv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qv=`uniform sampler2D shadow_pass;
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
}`;function Yv(n,e,t){let i=new Lr,s=new xe,r=new xe,o=new Ft,a=new bl({depthPacking:sf}),l=new Sl,c={},h=t.maxTextureSize,u={[Ti]:gn,[gn]:Ti,[jt]:jt},f=new gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:Xv,fragmentShader:qv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new wt;g.setAttribute("position",new It(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new tt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tu;let p=this.type;this.render=function(A,P,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let w=n.getRenderTarget(),b=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),L=n.state;L.setBlending(fn),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let U=p!==Oi&&this.type===Oi,V=p===Oi&&this.type!==Oi;for(let Y=0,O=A.length;Y<O;Y++){let W=A[Y],X=W.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let j=X.getFrameExtents();if(s.multiply(j),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/j.x),s.x=r.x*j.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/j.y),s.y=r.y*j.y,X.mapSize.y=r.y)),X.map===null||U===!0||V===!0){let pe=this.type!==Oi?{minFilter:mn,magFilter:mn}:{};X.map!==null&&X.map.dispose(),X.map=new hn(s.x,s.y,pe),X.map.texture.name=W.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();let oe=X.getViewportCount();for(let pe=0;pe<oe;pe++){let Se=X.getViewport(pe);o.set(r.x*Se.x,r.y*Se.y,r.x*Se.z,r.y*Se.w),L.viewport(o),X.updateMatrices(W,pe),i=X.getFrustum(),v(P,C,X.camera,W,this.type)}X.isPointLightShadow!==!0&&this.type===Oi&&M(X,C),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,b,I)};function M(A,P){let C=e.update(x);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new hn(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(P,null,C,f,x,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(P,null,C,d,x,null)}function y(A,P,C,w){let b=null,I=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)b=I;else if(b=C.isPointLight===!0?l:a,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let L=b.uuid,U=P.uuid,V=c[L];V===void 0&&(V={},c[L]=V);let Y=V[U];Y===void 0&&(Y=b.clone(),V[U]=Y,P.addEventListener("dispose",T)),b=Y}if(b.visible=P.visible,b.wireframe=P.wireframe,w===Oi?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:u[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let L=n.properties.get(b);L.light=C}return b}function v(A,P,C,w,b){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===Oi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);let U=e.update(A),V=A.material;if(Array.isArray(V)){let Y=U.groups;for(let O=0,W=Y.length;O<W;O++){let X=Y[O],j=V[X.materialIndex];if(j&&j.visible){let oe=y(A,j,w,b);A.onBeforeShadow(n,A,P,C,U,oe,X),n.renderBufferDirect(C,null,U,oe,A,X),A.onAfterShadow(n,A,P,C,U,oe,X)}}}else if(V.visible){let Y=y(A,V,w,b);A.onBeforeShadow(n,A,P,C,U,Y,null),n.renderBufferDirect(C,null,U,Y,A,null),A.onAfterShadow(n,A,P,C,U,Y,null)}}let L=A.children;for(let U=0,V=L.length;U<V;U++)v(L[U],P,C,w,b)}function T(A){A.target.removeEventListener("dispose",T);for(let C in c){let w=c[C],b=A.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}var Zv={[kl]:Ol,[zl]:Vl,[Bl]:Gl,[ks]:Hl,[Ol]:kl,[Vl]:zl,[Gl]:Bl,[Hl]:ks};function $v(n,e){function t(){let q=!1,Ee=new Ft,Ue=null,qe=new Ft(0,0,0,0);return{setMask:function(Te){Ue!==Te&&!q&&(n.colorMask(Te,Te,Te,Te),Ue=Te)},setLocked:function(Te){q=Te},setClear:function(Te,_e,Xe,nt,Bt){Bt===!0&&(Te*=nt,_e*=nt,Xe*=nt),Ee.set(Te,_e,Xe,nt),qe.equals(Ee)===!1&&(n.clearColor(Te,_e,Xe,nt),qe.copy(Ee))},reset:function(){q=!1,Ue=null,qe.set(-1,0,0,0)}}}function i(){let q=!1,Ee=!1,Ue=null,qe=null,Te=null;return{setReversed:function(_e){if(Ee!==_e){let Xe=e.get("EXT_clip_control");_e?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT),Ee=_e;let nt=Te;Te=null,this.setClear(nt)}},getReversed:function(){return Ee},setTest:function(_e){_e?ne(n.DEPTH_TEST):me(n.DEPTH_TEST)},setMask:function(_e){Ue!==_e&&!q&&(n.depthMask(_e),Ue=_e)},setFunc:function(_e){if(Ee&&(_e=Zv[_e]),qe!==_e){switch(_e){case kl:n.depthFunc(n.NEVER);break;case Ol:n.depthFunc(n.ALWAYS);break;case zl:n.depthFunc(n.LESS);break;case ks:n.depthFunc(n.LEQUAL);break;case Bl:n.depthFunc(n.EQUAL);break;case Hl:n.depthFunc(n.GEQUAL);break;case Vl:n.depthFunc(n.GREATER);break;case Gl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}qe=_e}},setLocked:function(_e){q=_e},setClear:function(_e){Te!==_e&&(Ee&&(_e=1-_e),n.clearDepth(_e),Te=_e)},reset:function(){q=!1,Ue=null,qe=null,Te=null,Ee=!1}}}function s(){let q=!1,Ee=null,Ue=null,qe=null,Te=null,_e=null,Xe=null,nt=null,Bt=null;return{setTest:function(yt){q||(yt?ne(n.STENCIL_TEST):me(n.STENCIL_TEST))},setMask:function(yt){Ee!==yt&&!q&&(n.stencilMask(yt),Ee=yt)},setFunc:function(yt,Mi,hi){(Ue!==yt||qe!==Mi||Te!==hi)&&(n.stencilFunc(yt,Mi,hi),Ue=yt,qe=Mi,Te=hi)},setOp:function(yt,Mi,hi){(_e!==yt||Xe!==Mi||nt!==hi)&&(n.stencilOp(yt,Mi,hi),_e=yt,Xe=Mi,nt=hi)},setLocked:function(yt){q=yt},setClear:function(yt){Bt!==yt&&(n.clearStencil(yt),Bt=yt)},reset:function(){q=!1,Ee=null,Ue=null,qe=null,Te=null,_e=null,Xe=null,nt=null,Bt=null}}}let r=new t,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,M=null,y=null,v=null,T=null,A=null,P=new Pe(0,0,0),C=0,w=!1,b=null,I=null,L=null,U=null,V=null,Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,W=0,X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(X)[1]),O=W>=1):X.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),O=W>=2);let j=null,oe={},pe=n.getParameter(n.SCISSOR_BOX),Se=n.getParameter(n.VIEWPORT),Ne=new Ft().fromArray(pe),ke=new Ft().fromArray(Se);function De(q,Ee,Ue,qe){let Te=new Uint8Array(4),_e=n.createTexture();n.bindTexture(q,_e),n.texParameteri(q,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(q,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Xe=0;Xe<Ue;Xe++)q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?n.texImage3D(Ee,0,n.RGBA,1,1,qe,0,n.RGBA,n.UNSIGNED_BYTE,Te):n.texImage2D(Ee+Xe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Te);return _e}let ee={};ee[n.TEXTURE_2D]=De(n.TEXTURE_2D,n.TEXTURE_2D,1),ee[n.TEXTURE_CUBE_MAP]=De(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[n.TEXTURE_2D_ARRAY]=De(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ee[n.TEXTURE_3D]=De(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(n.DEPTH_TEST),o.setFunc(ks),K(!1),Z(eu),ne(n.CULL_FACE),B(fn);function ne(q){h[q]!==!0&&(n.enable(q),h[q]=!0)}function me(q){h[q]!==!1&&(n.disable(q),h[q]=!1)}function fe(q,Ee){return u[q]!==Ee?(n.bindFramebuffer(q,Ee),u[q]=Ee,q===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Ee),q===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Ee),!0):!1}function ge(q,Ee){let Ue=d,qe=!1;if(q){Ue=f.get(Ee),Ue===void 0&&(Ue=[],f.set(Ee,Ue));let Te=q.textures;if(Ue.length!==Te.length||Ue[0]!==n.COLOR_ATTACHMENT0){for(let _e=0,Xe=Te.length;_e<Xe;_e++)Ue[_e]=n.COLOR_ATTACHMENT0+_e;Ue.length=Te.length,qe=!0}}else Ue[0]!==n.BACK&&(Ue[0]=n.BACK,qe=!0);qe&&n.drawBuffers(Ue)}function Ye(q){return g!==q?(n.useProgram(q),g=q,!0):!1}let ft={[si]:n.FUNC_ADD,[Od]:n.FUNC_SUBTRACT,[zd]:n.FUNC_REVERSE_SUBTRACT};ft[Bd]=n.MIN,ft[Hd]=n.MAX;let k={[$s]:n.ZERO,[Vd]:n.ONE,[Gd]:n.SRC_COLOR,[ll]:n.SRC_ALPHA,[Yd]:n.SRC_ALPHA_SATURATE,[oa]:n.DST_COLOR,[ra]:n.DST_ALPHA,[Wd]:n.ONE_MINUS_SRC_COLOR,[cl]:n.ONE_MINUS_SRC_ALPHA,[qd]:n.ONE_MINUS_DST_COLOR,[Xd]:n.ONE_MINUS_DST_ALPHA,[Zd]:n.CONSTANT_COLOR,[$d]:n.ONE_MINUS_CONSTANT_COLOR,[Jd]:n.CONSTANT_ALPHA,[Kd]:n.ONE_MINUS_CONSTANT_ALPHA};function B(q,Ee,Ue,qe,Te,_e,Xe,nt,Bt,yt){if(q===fn){x===!0&&(me(n.BLEND),x=!1);return}if(x===!1&&(ne(n.BLEND),x=!0),q!==Fl){if(q!==m||yt!==w){if((p!==si||v!==si)&&(n.blendEquation(n.FUNC_ADD),p=si,v=si),yt)switch(q){case Ki:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case An:n.blendFunc(n.ONE,n.ONE);break;case nu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case iu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}else switch(q){case Ki:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case An:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case nu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case iu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}M=null,y=null,T=null,A=null,P.set(0,0,0),C=0,m=q,w=yt}return}Te=Te||Ee,_e=_e||Ue,Xe=Xe||qe,(Ee!==p||Te!==v)&&(n.blendEquationSeparate(ft[Ee],ft[Te]),p=Ee,v=Te),(Ue!==M||qe!==y||_e!==T||Xe!==A)&&(n.blendFuncSeparate(k[Ue],k[qe],k[_e],k[Xe]),M=Ue,y=qe,T=_e,A=Xe),(nt.equals(P)===!1||Bt!==C)&&(n.blendColor(nt.r,nt.g,nt.b,Bt),P.copy(nt),C=Bt),m=q,w=!1}function H(q,Ee){q.side===jt?me(n.CULL_FACE):ne(n.CULL_FACE);let Ue=q.side===gn;Ee&&(Ue=!Ue),K(Ue),q.blending===Ki&&q.transparent===!1?B(fn):B(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),o.setFunc(q.depthFunc),o.setTest(q.depthTest),o.setMask(q.depthWrite),r.setMask(q.colorWrite);let qe=q.stencilWrite;a.setTest(qe),qe&&(a.setMask(q.stencilWriteMask),a.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),a.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),re(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):me(n.SAMPLE_ALPHA_TO_COVERAGE)}function K(q){b!==q&&(q?n.frontFace(n.CW):n.frontFace(n.CCW),b=q)}function Z(q){q!==Fd?(ne(n.CULL_FACE),q!==I&&(q===eu?n.cullFace(n.BACK):q===kd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):me(n.CULL_FACE),I=q}function J(q){q!==L&&(O&&n.lineWidth(q),L=q)}function re(q,Ee,Ue){q?(ne(n.POLYGON_OFFSET_FILL),(U!==Ee||V!==Ue)&&(n.polygonOffset(Ee,Ue),U=Ee,V=Ue)):me(n.POLYGON_OFFSET_FILL)}function ce(q){q?ne(n.SCISSOR_TEST):me(n.SCISSOR_TEST)}function ie(q){q===void 0&&(q=n.TEXTURE0+Y-1),j!==q&&(n.activeTexture(q),j=q)}function ae(q,Ee,Ue){Ue===void 0&&(j===null?Ue=n.TEXTURE0+Y-1:Ue=j);let qe=oe[Ue];qe===void 0&&(qe={type:void 0,texture:void 0},oe[Ue]=qe),(qe.type!==q||qe.texture!==Ee)&&(j!==Ue&&(n.activeTexture(Ue),j=Ue),n.bindTexture(q,Ee||ee[q]),qe.type=q,qe.texture=Ee)}function R(){let q=oe[j];q!==void 0&&q.type!==void 0&&(n.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function S(){try{n.compressedTexImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function N(){try{n.compressedTexImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function $(){try{n.texSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function z(){try{n.texSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function G(){try{n.compressedTexSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function be(){try{n.compressedTexSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ve(){try{n.texStorage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function we(){try{n.texStorage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Me(){try{n.texImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ye(){try{n.texImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Fe(q){Ne.equals(q)===!1&&(n.scissor(q.x,q.y,q.z,q.w),Ne.copy(q))}function at(q){ke.equals(q)===!1&&(n.viewport(q.x,q.y,q.z,q.w),ke.copy(q))}function Je(q,Ee){let Ue=c.get(Ee);Ue===void 0&&(Ue=new WeakMap,c.set(Ee,Ue));let qe=Ue.get(q);qe===void 0&&(qe=n.getUniformBlockIndex(Ee,q.name),Ue.set(q,qe))}function Le(q,Ee){let qe=c.get(Ee).get(q);l.get(Ee)!==qe&&(n.uniformBlockBinding(Ee,qe,q.__bindingPointIndex),l.set(Ee,qe))}function ot(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},j=null,oe={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,M=null,y=null,v=null,T=null,A=null,P=new Pe(0,0,0),C=0,w=!1,b=null,I=null,L=null,U=null,V=null,Ne.set(0,0,n.canvas.width,n.canvas.height),ke.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ne,disable:me,bindFramebuffer:fe,drawBuffers:ge,useProgram:Ye,setBlending:B,setMaterial:H,setFlipSided:K,setCullFace:Z,setLineWidth:J,setPolygonOffset:re,setScissorTest:ce,activeTexture:ie,bindTexture:ae,unbindTexture:R,compressedTexImage2D:S,compressedTexImage3D:N,texImage2D:Me,texImage3D:ye,updateUBOMapping:Je,uniformBlockBinding:Le,texStorage2D:ve,texStorage3D:we,texSubImage2D:$,texSubImage3D:z,compressedTexSubImage2D:G,compressedTexSubImage3D:be,scissor:Fe,viewport:at,reset:ot}}function Jv(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return d?new OffscreenCanvas(R,S):Ro("canvas")}function x(R,S,N){let $=1,z=ae(R);if((z.width>N||z.height>N)&&($=N/Math.max(z.width,z.height)),$<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let G=Math.floor($*z.width),be=Math.floor($*z.height);u===void 0&&(u=g(G,be));let ve=S?g(G,be):u;return ve.width=G,ve.height=be,ve.getContext("2d").drawImage(R,0,0,G,be),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+z.width+"x"+z.height+") to ("+G+"x"+be+")."),ve}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+z.width+"x"+z.height+")."),R;return R}function m(R){return R.generateMipmaps}function p(R){n.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(R,S,N,$,z=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let G=S;if(S===n.RED&&(N===n.FLOAT&&(G=n.R32F),N===n.HALF_FLOAT&&(G=n.R16F),N===n.UNSIGNED_BYTE&&(G=n.R8)),S===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.R8UI),N===n.UNSIGNED_SHORT&&(G=n.R16UI),N===n.UNSIGNED_INT&&(G=n.R32UI),N===n.BYTE&&(G=n.R8I),N===n.SHORT&&(G=n.R16I),N===n.INT&&(G=n.R32I)),S===n.RG&&(N===n.FLOAT&&(G=n.RG32F),N===n.HALF_FLOAT&&(G=n.RG16F),N===n.UNSIGNED_BYTE&&(G=n.RG8)),S===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.RG8UI),N===n.UNSIGNED_SHORT&&(G=n.RG16UI),N===n.UNSIGNED_INT&&(G=n.RG32UI),N===n.BYTE&&(G=n.RG8I),N===n.SHORT&&(G=n.RG16I),N===n.INT&&(G=n.RG32I)),S===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.RGB8UI),N===n.UNSIGNED_SHORT&&(G=n.RGB16UI),N===n.UNSIGNED_INT&&(G=n.RGB32UI),N===n.BYTE&&(G=n.RGB8I),N===n.SHORT&&(G=n.RGB16I),N===n.INT&&(G=n.RGB32I)),S===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(G=n.RGBA16UI),N===n.UNSIGNED_INT&&(G=n.RGBA32UI),N===n.BYTE&&(G=n.RGBA8I),N===n.SHORT&&(G=n.RGBA16I),N===n.INT&&(G=n.RGBA32I)),S===n.RGB&&(N===n.UNSIGNED_INT_5_9_9_9_REV&&(G=n.RGB9_E5),N===n.UNSIGNED_INT_10F_11F_11F_REV&&(G=n.R11F_G11F_B10F)),S===n.RGBA){let be=z?To:Pt.getTransfer($);N===n.FLOAT&&(G=n.RGBA32F),N===n.HALF_FLOAT&&(G=n.RGBA16F),N===n.UNSIGNED_BYTE&&(G=be===Ot?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(G=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(G=n.RGB5_A1)}return(G===n.R16F||G===n.R32F||G===n.RG16F||G===n.RG32F||G===n.RGBA16F||G===n.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function v(R,S){let N;return R?S===null||S===zi||S===xs?N=n.DEPTH24_STENCIL8:S===mi?N=n.DEPTH32F_STENCIL8:S===Vr&&(N=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===zi||S===xs?N=n.DEPTH_COMPONENT24:S===mi?N=n.DEPTH_COMPONENT32F:S===Vr&&(N=n.DEPTH_COMPONENT16),N}function T(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==mn&&R.minFilter!==Cn?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function A(R){let S=R.target;S.removeEventListener("dispose",A),C(S),S.isVideoTexture&&h.delete(S)}function P(R){let S=R.target;S.removeEventListener("dispose",P),b(S)}function C(R){let S=i.get(R);if(S.__webglInit===void 0)return;let N=R.source,$=f.get(N);if($){let z=$[S.__cacheKey];z.usedTimes--,z.usedTimes===0&&w(R),Object.keys($).length===0&&f.delete(N)}i.remove(R)}function w(R){let S=i.get(R);n.deleteTexture(S.__webglTexture);let N=R.source,$=f.get(N);delete $[S.__cacheKey],o.memory.textures--}function b(R){let S=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let z=0;z<S.__webglFramebuffer[$].length;z++)n.deleteFramebuffer(S.__webglFramebuffer[$][z]);else n.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)n.deleteFramebuffer(S.__webglFramebuffer[$]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let N=R.textures;for(let $=0,z=N.length;$<z;$++){let G=i.get(N[$]);G.__webglTexture&&(n.deleteTexture(G.__webglTexture),o.memory.textures--),i.remove(N[$])}i.remove(R)}let I=0;function L(){I=0}function U(){let R=I;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function V(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function Y(R,S){let N=i.get(R);if(R.isVideoTexture&&ce(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&N.__version!==R.version){let $=R.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(N,R,S);return}}else R.isExternalTexture&&(N.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+S)}function O(R,S){let N=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&N.__version!==R.version){ee(N,R,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+S)}function W(R,S){let N=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&N.__version!==R.version){ee(N,R,S);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+S)}function X(R,S){let N=i.get(R);if(R.version>0&&N.__version!==R.version){ne(N,R,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+S)}let j={[kn]:n.REPEAT,[Ui]:n.CLAMP_TO_EDGE,[hl]:n.MIRRORED_REPEAT},oe={[mn]:n.NEAREST,[tf]:n.NEAREST_MIPMAP_NEAREST,[la]:n.NEAREST_MIPMAP_LINEAR,[Cn]:n.LINEAR,[jl]:n.LINEAR_MIPMAP_NEAREST,[pi]:n.LINEAR_MIPMAP_LINEAR},pe={[of]:n.NEVER,[df]:n.ALWAYS,[af]:n.LESS,[fu]:n.LEQUAL,[lf]:n.EQUAL,[uf]:n.GEQUAL,[cf]:n.GREATER,[hf]:n.NOTEQUAL};function Se(R,S){if(S.type===mi&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Cn||S.magFilter===jl||S.magFilter===la||S.magFilter===pi||S.minFilter===Cn||S.minFilter===jl||S.minFilter===la||S.minFilter===pi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,j[S.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,j[S.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,j[S.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,oe[S.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,oe[S.minFilter]),S.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,pe[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===mn||S.minFilter!==la&&S.minFilter!==pi||S.type===mi&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ne(R,S){let N=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",A));let $=S.source,z=f.get($);z===void 0&&(z={},f.set($,z));let G=V(S);if(G!==R.__cacheKey){z[G]===void 0&&(z[G]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,N=!0),z[G].usedTimes++;let be=z[R.__cacheKey];be!==void 0&&(z[R.__cacheKey].usedTimes--,be.usedTimes===0&&w(S)),R.__cacheKey=G,R.__webglTexture=z[G].texture}return N}function ke(R,S,N){return Math.floor(Math.floor(R/N)/S)}function De(R,S,N,$){let G=R.updateRanges;if(G.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,S.width,S.height,N,$,S.data);else{G.sort((ye,Fe)=>ye.start-Fe.start);let be=0;for(let ye=1;ye<G.length;ye++){let Fe=G[be],at=G[ye],Je=Fe.start+Fe.count,Le=ke(at.start,S.width,4),ot=ke(Fe.start,S.width,4);at.start<=Je+1&&Le===ot&&ke(at.start+at.count-1,S.width,4)===Le?Fe.count=Math.max(Fe.count,at.start+at.count-Fe.start):(++be,G[be]=at)}G.length=be+1;let ve=n.getParameter(n.UNPACK_ROW_LENGTH),we=n.getParameter(n.UNPACK_SKIP_PIXELS),Me=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,S.width);for(let ye=0,Fe=G.length;ye<Fe;ye++){let at=G[ye],Je=Math.floor(at.start/4),Le=Math.ceil(at.count/4),ot=Je%S.width,q=Math.floor(Je/S.width),Ee=Le,Ue=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ot),n.pixelStorei(n.UNPACK_SKIP_ROWS,q),t.texSubImage2D(n.TEXTURE_2D,0,ot,q,Ee,Ue,N,$,S.data)}R.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ve),n.pixelStorei(n.UNPACK_SKIP_PIXELS,we),n.pixelStorei(n.UNPACK_SKIP_ROWS,Me)}}function ee(R,S,N){let $=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=n.TEXTURE_3D);let z=Ne(R,S),G=S.source;t.bindTexture($,R.__webglTexture,n.TEXTURE0+N);let be=i.get(G);if(G.version!==be.__version||z===!0){t.activeTexture(n.TEXTURE0+N);let ve=Pt.getPrimaries(Pt.workingColorSpace),we=S.colorSpace===gi?null:Pt.getPrimaries(S.colorSpace),Me=S.colorSpace===gi||ve===we?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let ye=x(S.image,!1,s.maxTextureSize);ye=ie(S,ye);let Fe=r.convert(S.format,S.colorSpace),at=r.convert(S.type),Je=y(S.internalFormat,Fe,at,S.colorSpace,S.isVideoTexture);Se($,S);let Le,ot=S.mipmaps,q=S.isVideoTexture!==!0,Ee=be.__version===void 0||z===!0,Ue=G.dataReady,qe=T(S,ye);if(S.isDepthTexture)Je=v(S.format===vs,S.type),Ee&&(q?t.texStorage2D(n.TEXTURE_2D,1,Je,ye.width,ye.height):t.texImage2D(n.TEXTURE_2D,0,Je,ye.width,ye.height,0,Fe,at,null));else if(S.isDataTexture)if(ot.length>0){q&&Ee&&t.texStorage2D(n.TEXTURE_2D,qe,Je,ot[0].width,ot[0].height);for(let Te=0,_e=ot.length;Te<_e;Te++)Le=ot[Te],q?Ue&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Le.width,Le.height,Fe,at,Le.data):t.texImage2D(n.TEXTURE_2D,Te,Je,Le.width,Le.height,0,Fe,at,Le.data);S.generateMipmaps=!1}else q?(Ee&&t.texStorage2D(n.TEXTURE_2D,qe,Je,ye.width,ye.height),Ue&&De(S,ye,Fe,at)):t.texImage2D(n.TEXTURE_2D,0,Je,ye.width,ye.height,0,Fe,at,ye.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){q&&Ee&&t.texStorage3D(n.TEXTURE_2D_ARRAY,qe,Je,ot[0].width,ot[0].height,ye.depth);for(let Te=0,_e=ot.length;Te<_e;Te++)if(Le=ot[Te],S.format!==vn)if(Fe!==null)if(q){if(Ue)if(S.layerUpdates.size>0){let Xe=Mu(Le.width,Le.height,S.format,S.type);for(let nt of S.layerUpdates){let Bt=Le.data.subarray(nt*Xe/Le.data.BYTES_PER_ELEMENT,(nt+1)*Xe/Le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,nt,Le.width,Le.height,1,Fe,Bt)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,0,Le.width,Le.height,ye.depth,Fe,Le.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Te,Je,Le.width,Le.height,ye.depth,0,Le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else q?Ue&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,0,Le.width,Le.height,ye.depth,Fe,at,Le.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Te,Je,Le.width,Le.height,ye.depth,0,Fe,at,Le.data)}else{q&&Ee&&t.texStorage2D(n.TEXTURE_2D,qe,Je,ot[0].width,ot[0].height);for(let Te=0,_e=ot.length;Te<_e;Te++)Le=ot[Te],S.format!==vn?Fe!==null?q?Ue&&t.compressedTexSubImage2D(n.TEXTURE_2D,Te,0,0,Le.width,Le.height,Fe,Le.data):t.compressedTexImage2D(n.TEXTURE_2D,Te,Je,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):q?Ue&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Le.width,Le.height,Fe,at,Le.data):t.texImage2D(n.TEXTURE_2D,Te,Je,Le.width,Le.height,0,Fe,at,Le.data)}else if(S.isDataArrayTexture)if(q){if(Ee&&t.texStorage3D(n.TEXTURE_2D_ARRAY,qe,Je,ye.width,ye.height,ye.depth),Ue)if(S.layerUpdates.size>0){let Te=Mu(ye.width,ye.height,S.format,S.type);for(let _e of S.layerUpdates){let Xe=ye.data.subarray(_e*Te/ye.data.BYTES_PER_ELEMENT,(_e+1)*Te/ye.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,_e,ye.width,ye.height,1,Fe,at,Xe)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ye.width,ye.height,ye.depth,Fe,at,ye.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Je,ye.width,ye.height,ye.depth,0,Fe,at,ye.data);else if(S.isData3DTexture)q?(Ee&&t.texStorage3D(n.TEXTURE_3D,qe,Je,ye.width,ye.height,ye.depth),Ue&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ye.width,ye.height,ye.depth,Fe,at,ye.data)):t.texImage3D(n.TEXTURE_3D,0,Je,ye.width,ye.height,ye.depth,0,Fe,at,ye.data);else if(S.isFramebufferTexture){if(Ee)if(q)t.texStorage2D(n.TEXTURE_2D,qe,Je,ye.width,ye.height);else{let Te=ye.width,_e=ye.height;for(let Xe=0;Xe<qe;Xe++)t.texImage2D(n.TEXTURE_2D,Xe,Je,Te,_e,0,Fe,at,null),Te>>=1,_e>>=1}}else if(ot.length>0){if(q&&Ee){let Te=ae(ot[0]);t.texStorage2D(n.TEXTURE_2D,qe,Je,Te.width,Te.height)}for(let Te=0,_e=ot.length;Te<_e;Te++)Le=ot[Te],q?Ue&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Fe,at,Le):t.texImage2D(n.TEXTURE_2D,Te,Je,Fe,at,Le);S.generateMipmaps=!1}else if(q){if(Ee){let Te=ae(ye);t.texStorage2D(n.TEXTURE_2D,qe,Je,Te.width,Te.height)}Ue&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Fe,at,ye)}else t.texImage2D(n.TEXTURE_2D,0,Je,Fe,at,ye);m(S)&&p($),be.__version=G.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function ne(R,S,N){if(S.image.length!==6)return;let $=Ne(R,S),z=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+N);let G=i.get(z);if(z.version!==G.__version||$===!0){t.activeTexture(n.TEXTURE0+N);let be=Pt.getPrimaries(Pt.workingColorSpace),ve=S.colorSpace===gi?null:Pt.getPrimaries(S.colorSpace),we=S.colorSpace===gi||be===ve?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let Me=S.isCompressedTexture||S.image[0].isCompressedTexture,ye=S.image[0]&&S.image[0].isDataTexture,Fe=[];for(let _e=0;_e<6;_e++)!Me&&!ye?Fe[_e]=x(S.image[_e],!0,s.maxCubemapSize):Fe[_e]=ye?S.image[_e].image:S.image[_e],Fe[_e]=ie(S,Fe[_e]);let at=Fe[0],Je=r.convert(S.format,S.colorSpace),Le=r.convert(S.type),ot=y(S.internalFormat,Je,Le,S.colorSpace),q=S.isVideoTexture!==!0,Ee=G.__version===void 0||$===!0,Ue=z.dataReady,qe=T(S,at);Se(n.TEXTURE_CUBE_MAP,S);let Te;if(Me){q&&Ee&&t.texStorage2D(n.TEXTURE_CUBE_MAP,qe,ot,at.width,at.height);for(let _e=0;_e<6;_e++){Te=Fe[_e].mipmaps;for(let Xe=0;Xe<Te.length;Xe++){let nt=Te[Xe];S.format!==vn?Je!==null?q?Ue&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe,0,0,nt.width,nt.height,Je,nt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe,ot,nt.width,nt.height,0,nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?Ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe,0,0,nt.width,nt.height,Je,Le,nt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe,ot,nt.width,nt.height,0,Je,Le,nt.data)}}}else{if(Te=S.mipmaps,q&&Ee){Te.length>0&&qe++;let _e=ae(Fe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,qe,ot,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(ye){q?Ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Fe[_e].width,Fe[_e].height,Je,Le,Fe[_e].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,ot,Fe[_e].width,Fe[_e].height,0,Je,Le,Fe[_e].data);for(let Xe=0;Xe<Te.length;Xe++){let Bt=Te[Xe].image[_e].image;q?Ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe+1,0,0,Bt.width,Bt.height,Je,Le,Bt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe+1,ot,Bt.width,Bt.height,0,Je,Le,Bt.data)}}else{q?Ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Je,Le,Fe[_e]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,ot,Je,Le,Fe[_e]);for(let Xe=0;Xe<Te.length;Xe++){let nt=Te[Xe];q?Ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe+1,0,0,Je,Le,nt.image[_e]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Xe+1,ot,Je,Le,nt.image[_e])}}}m(S)&&p(n.TEXTURE_CUBE_MAP),G.__version=z.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function me(R,S,N,$,z,G){let be=r.convert(N.format,N.colorSpace),ve=r.convert(N.type),we=y(N.internalFormat,be,ve,N.colorSpace),Me=i.get(S),ye=i.get(N);if(ye.__renderTarget=S,!Me.__hasExternalTextures){let Fe=Math.max(1,S.width>>G),at=Math.max(1,S.height>>G);z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?t.texImage3D(z,G,we,Fe,at,S.depth,0,be,ve,null):t.texImage2D(z,G,we,Fe,at,0,be,ve,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),re(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,z,ye.__webglTexture,0,J(S)):(z===n.TEXTURE_2D||z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,$,z,ye.__webglTexture,G),t.bindFramebuffer(n.FRAMEBUFFER,null)}function fe(R,S,N){if(n.bindRenderbuffer(n.RENDERBUFFER,R),S.depthBuffer){let $=S.depthTexture,z=$&&$.isDepthTexture?$.type:null,G=v(S.stencilBuffer,z),be=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=J(S);re(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ve,G,S.width,S.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,ve,G,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,G,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,be,n.RENDERBUFFER,R)}else{let $=S.textures;for(let z=0;z<$.length;z++){let G=$[z],be=r.convert(G.format,G.colorSpace),ve=r.convert(G.type),we=y(G.internalFormat,be,ve,G.colorSpace),Me=J(S);N&&re(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Me,we,S.width,S.height):re(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Me,we,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,we,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ge(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let $=i.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Y(S.depthTexture,0);let z=$.__webglTexture,G=J(S);if(S.depthTexture.format===Tr)re(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,z,0,G):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,z,0);else if(S.depthTexture.format===vs)re(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,z,0,G):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,z,0);else throw new Error("Unknown depthTexture format")}function Ye(R){let S=i.get(R),N=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let $=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){let z=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",z)};$.addEventListener("dispose",z),S.__depthDisposeCallback=z}S.__boundDepthTexture=$}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");let $=R.texture.mipmaps;$&&$.length>0?ge(S.__webglFramebuffer[0],R):ge(S.__webglFramebuffer,R)}else if(N){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=n.createRenderbuffer(),fe(S.__webglDepthbuffer[$],R,!1);else{let z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,G=S.__webglDepthbuffer[$];n.bindRenderbuffer(n.RENDERBUFFER,G),n.framebufferRenderbuffer(n.FRAMEBUFFER,z,n.RENDERBUFFER,G)}}else{let $=R.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),fe(S.__webglDepthbuffer,R,!1);else{let z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,G=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,G),n.framebufferRenderbuffer(n.FRAMEBUFFER,z,n.RENDERBUFFER,G)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ft(R,S,N){let $=i.get(R);S!==void 0&&me($.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Ye(R)}function k(R){let S=R.texture,N=i.get(R),$=i.get(S);R.addEventListener("dispose",P);let z=R.textures,G=R.isWebGLCubeRenderTarget===!0,be=z.length>1;if(be||($.__webglTexture===void 0&&($.__webglTexture=n.createTexture()),$.__version=S.version,o.memory.textures++),G){N.__webglFramebuffer=[];for(let ve=0;ve<6;ve++)if(S.mipmaps&&S.mipmaps.length>0){N.__webglFramebuffer[ve]=[];for(let we=0;we<S.mipmaps.length;we++)N.__webglFramebuffer[ve][we]=n.createFramebuffer()}else N.__webglFramebuffer[ve]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){N.__webglFramebuffer=[];for(let ve=0;ve<S.mipmaps.length;ve++)N.__webglFramebuffer[ve]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(be)for(let ve=0,we=z.length;ve<we;ve++){let Me=i.get(z[ve]);Me.__webglTexture===void 0&&(Me.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&re(R)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ve=0;ve<z.length;ve++){let we=z[ve];N.__webglColorRenderbuffer[ve]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[ve]);let Me=r.convert(we.format,we.colorSpace),ye=r.convert(we.type),Fe=y(we.internalFormat,Me,ye,we.colorSpace,R.isXRRenderTarget===!0),at=J(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,at,Fe,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,N.__webglColorRenderbuffer[ve])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),fe(N.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(G){t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),Se(n.TEXTURE_CUBE_MAP,S);for(let ve=0;ve<6;ve++)if(S.mipmaps&&S.mipmaps.length>0)for(let we=0;we<S.mipmaps.length;we++)me(N.__webglFramebuffer[ve][we],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ve,we);else me(N.__webglFramebuffer[ve],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0);m(S)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(be){for(let ve=0,we=z.length;ve<we;ve++){let Me=z[ve],ye=i.get(Me),Fe=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Fe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Fe,ye.__webglTexture),Se(Fe,Me),me(N.__webglFramebuffer,R,Me,n.COLOR_ATTACHMENT0+ve,Fe,0),m(Me)&&p(Fe)}t.unbindTexture()}else{let ve=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ve=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ve,$.__webglTexture),Se(ve,S),S.mipmaps&&S.mipmaps.length>0)for(let we=0;we<S.mipmaps.length;we++)me(N.__webglFramebuffer[we],R,S,n.COLOR_ATTACHMENT0,ve,we);else me(N.__webglFramebuffer,R,S,n.COLOR_ATTACHMENT0,ve,0);m(S)&&p(ve),t.unbindTexture()}R.depthBuffer&&Ye(R)}function B(R){let S=R.textures;for(let N=0,$=S.length;N<$;N++){let z=S[N];if(m(z)){let G=M(R),be=i.get(z).__webglTexture;t.bindTexture(G,be),p(G),t.unbindTexture()}}}let H=[],K=[];function Z(R){if(R.samples>0){if(re(R)===!1){let S=R.textures,N=R.width,$=R.height,z=n.COLOR_BUFFER_BIT,G=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,be=i.get(R),ve=S.length>1;if(ve)for(let Me=0;Me<S.length;Me++)t.bindFramebuffer(n.FRAMEBUFFER,be.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,be.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer);let we=R.texture.mipmaps;we&&we.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,be.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let Me=0;Me<S.length;Me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(z|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(z|=n.STENCIL_BUFFER_BIT)),ve){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,be.__webglColorRenderbuffer[Me]);let ye=i.get(S[Me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ye,0)}n.blitFramebuffer(0,0,N,$,0,0,N,$,z,n.NEAREST),l===!0&&(H.length=0,K.length=0,H.push(n.COLOR_ATTACHMENT0+Me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(H.push(G),K.push(G),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,K)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,H))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ve)for(let Me=0;Me<S.length;Me++){t.bindFramebuffer(n.FRAMEBUFFER,be.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,be.__webglColorRenderbuffer[Me]);let ye=i.get(S[Me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,be.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,ye,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let S=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function J(R){return Math.min(s.maxSamples,R.samples)}function re(R){let S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ce(R){let S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function ie(R,S){let N=R.colorSpace,$=R.format,z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||N!==Os&&N!==gi&&(Pt.getTransfer(N)===Ot?($!==vn||z!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),S}function ae(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=L,this.setTexture2D=Y,this.setTexture2DArray=O,this.setTexture3D=W,this.setTextureCube=X,this.rebindTextures=ft,this.setupRenderTarget=k,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=me,this.useMultisampledRTT=re}function Kv(n,e){function t(i,s=gi){let r,o=Pt.getTransfer(s);if(i===qn)return n.UNSIGNED_BYTE;if(i===ec)return n.UNSIGNED_SHORT_4_4_4_4;if(i===tc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===lu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===cu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ou)return n.BYTE;if(i===au)return n.SHORT;if(i===Vr)return n.UNSIGNED_SHORT;if(i===Ql)return n.INT;if(i===zi)return n.UNSIGNED_INT;if(i===mi)return n.FLOAT;if(i===xn)return n.HALF_FLOAT;if(i===hu)return n.ALPHA;if(i===uu)return n.RGB;if(i===vn)return n.RGBA;if(i===Tr)return n.DEPTH_COMPONENT;if(i===vs)return n.DEPTH_STENCIL;if(i===ys)return n.RED;if(i===nc)return n.RED_INTEGER;if(i===du)return n.RG;if(i===ic)return n.RG_INTEGER;if(i===sc)return n.RGBA_INTEGER;if(i===ca||i===ha||i===ua||i===da)if(o===Ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ca)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ha)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ca)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ha)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ua)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===da)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===rc||i===oc||i===ac||i===lc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===rc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===oc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ac)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cc||i===hc||i===uc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===cc||i===hc)return o===Ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===uc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===dc||i===fc||i===pc||i===mc||i===gc||i===xc||i===vc||i===yc||i===_c||i===Mc||i===bc||i===Sc||i===wc||i===Ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===dc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===fc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===pc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===mc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===gc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===xc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===vc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===yc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===_c)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===wc)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ec)return o===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Tc||i===Ac||i===Rc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Tc)return o===Ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ac)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Rc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Cc||i===Pc||i===Ic||i===Dc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Cc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Pc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ic)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Dc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===xs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var jv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qv=`
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

}`,Nu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new zo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new gt({vertexShader:jv,fragmentShader:Qv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new tt(new dn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Uu=class extends ji{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null,x=typeof XRWebGLBinding<"u",m=new Nu,p={},M=t.getContextAttributes(),y=null,v=null,T=[],A=[],P=new xe,C=null,w=new Rn;w.viewport=new Ft;let b=new Rn;b.viewport=new Ft;let I=[w,b],L=new Nl,U=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ne=T[ee];return ne===void 0&&(ne=new Pr,T[ee]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(ee){let ne=T[ee];return ne===void 0&&(ne=new Pr,T[ee]=ne),ne.getGripSpace()},this.getHand=function(ee){let ne=T[ee];return ne===void 0&&(ne=new Pr,T[ee]=ne),ne.getHandSpace()};function Y(ee){let ne=A.indexOf(ee.inputSource);if(ne===-1)return;let me=T[ne];me!==void 0&&(me.update(ee.inputSource,ee.frame,c||o),me.dispatchEvent({type:ee.type,data:ee.inputSource}))}function O(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",W);for(let ee=0;ee<T.length;ee++){let ne=A[ee];ne!==null&&(A[ee]=null,T[ee].disconnect(ne))}U=null,V=null,m.reset();for(let ee in p)delete p[ee];e.setRenderTarget(y),d=null,f=null,u=null,s=null,v=null,De.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){r=ee,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){a=ee,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ee){c=ee},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",O),s.addEventListener("inputsourceschange",W),M.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(P),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let me=null,fe=null,ge=null;M.depth&&(ge=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,me=M.stencil?vs:Tr,fe=M.stencil?xs:zi);let Ye={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ye),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new hn(f.textureWidth,f.textureHeight,{format:vn,type:qn,depthTexture:new es(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,me),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let me={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,me),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new hn(d.framebufferWidth,d.framebufferHeight,{format:vn,type:qn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),De.setContext(s),De.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(ee){for(let ne=0;ne<ee.removed.length;ne++){let me=ee.removed[ne],fe=A.indexOf(me);fe>=0&&(A[fe]=null,T[fe].disconnect(me))}for(let ne=0;ne<ee.added.length;ne++){let me=ee.added[ne],fe=A.indexOf(me);if(fe===-1){for(let Ye=0;Ye<T.length;Ye++)if(Ye>=A.length){A.push(me),fe=Ye;break}else if(A[Ye]===null){A[Ye]=me,fe=Ye;break}if(fe===-1)break}let ge=T[fe];ge&&ge.connect(me)}}let X=new F,j=new F;function oe(ee,ne,me){X.setFromMatrixPosition(ne.matrixWorld),j.setFromMatrixPosition(me.matrixWorld);let fe=X.distanceTo(j),ge=ne.projectionMatrix.elements,Ye=me.projectionMatrix.elements,ft=ge[14]/(ge[10]-1),k=ge[14]/(ge[10]+1),B=(ge[9]+1)/ge[5],H=(ge[9]-1)/ge[5],K=(ge[8]-1)/ge[0],Z=(Ye[8]+1)/Ye[0],J=ft*K,re=ft*Z,ce=fe/(-K+Z),ie=ce*-K;if(ne.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(ie),ee.translateZ(ce),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),ge[10]===-1)ee.projectionMatrix.copy(ne.projectionMatrix),ee.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let ae=ft+ce,R=k+ce,S=J-ie,N=re+(fe-ie),$=B*k/R*ae,z=H*k/R*ae;ee.projectionMatrix.makePerspective(S,N,$,z,ae,R),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function pe(ee,ne){ne===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ne.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let ne=ee.near,me=ee.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(me=m.depthFar)),L.near=b.near=w.near=ne,L.far=b.far=w.far=me,(U!==L.near||V!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),U=L.near,V=L.far),L.layers.mask=ee.layers.mask|6,w.layers.mask=L.layers.mask&3,b.layers.mask=L.layers.mask&5;let fe=ee.parent,ge=L.cameras;pe(L,fe);for(let Ye=0;Ye<ge.length;Ye++)pe(ge[Ye],fe);ge.length===2?oe(L,w,b):L.projectionMatrix.copy(w.projectionMatrix),Se(ee,L,fe)};function Se(ee,ne,me){me===null?ee.matrix.copy(ne.matrixWorld):(ee.matrix.copy(me.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ne.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ne.projectionMatrix),ee.projectionMatrixInverse.copy(ne.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Ar*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(ee){l=ee,f!==null&&(f.fixedFoveation=ee),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ee)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(ee){return p[ee]};let Ne=null;function ke(ee,ne){if(h=ne.getViewerPose(c||o),g=ne,h!==null){let me=h.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let fe=!1;me.length!==L.cameras.length&&(L.cameras.length=0,fe=!0);for(let k=0;k<me.length;k++){let B=me[k],H=null;if(d!==null)H=d.getViewport(B);else{let Z=u.getViewSubImage(f,B);H=Z.viewport,k===0&&(e.setRenderTargetTextures(v,Z.colorTexture,Z.depthStencilTexture),e.setRenderTarget(v))}let K=I[k];K===void 0&&(K=new Rn,K.layers.enable(k),K.viewport=new Ft,I[k]=K),K.matrix.fromArray(B.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(B.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(H.x,H.y,H.width,H.height),k===0&&(L.matrix.copy(K.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),fe===!0&&L.cameras.push(K)}let ge=s.enabledFeatures;if(ge&&ge.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();let k=u.getDepthInformation(me[0]);k&&k.isValid&&k.texture&&m.init(k,s.renderState)}if(ge&&ge.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let k=0;k<me.length;k++){let B=me[k].camera;if(B){let H=p[B];H||(H=new zo,p[B]=H);let K=u.getCameraImage(B);H.sourceTexture=K}}}}for(let me=0;me<T.length;me++){let fe=A[me],ge=T[me];fe!==null&&ge!==void 0&&ge.update(fe,ne,c||o)}Ne&&Ne(ee,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),g=null}let De=new Wf;De.setAnimationLoop(ke),this.setAnimationLoop=function(ee){Ne=ee},this.dispose=function(){}}},er=new ri,ey=new it;function ty(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,xu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===gn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===gn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),y=M.envMap,v=M.envMapRotation;y&&(m.envMap.value=y,er.copy(v),er.x*=-1,er.y*=-1,er.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),m.envMapRotation.value.setFromMatrix4(ey.makeRotationFromEuler(er)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===gn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ny(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){let v=y.program;i.uniformBlockBinding(M,v)}function c(M,y){let v=s[M.id];v===void 0&&(g(M),v=h(M),s[M.id]=v,M.addEventListener("dispose",m));let T=y.program;i.updateUBOMapping(M,T);let A=e.render.frame;r[M.id]!==A&&(f(M),r[M.id]=A)}function h(M){let y=u();M.__bindingPointIndex=y;let v=n.createBuffer(),T=M.__size,A=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,T,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,v),v}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){let y=s[M.id],v=M.uniforms,T=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let A=0,P=v.length;A<P;A++){let C=Array.isArray(v[A])?v[A]:[v[A]];for(let w=0,b=C.length;w<b;w++){let I=C[w];if(d(I,A,w,T)===!0){let L=I.__offset,U=Array.isArray(I.value)?I.value:[I.value],V=0;for(let Y=0;Y<U.length;Y++){let O=U[Y],W=x(O);typeof O=="number"||typeof O=="boolean"?(I.__data[0]=O,n.bufferSubData(n.UNIFORM_BUFFER,L+V,I.__data)):O.isMatrix3?(I.__data[0]=O.elements[0],I.__data[1]=O.elements[1],I.__data[2]=O.elements[2],I.__data[3]=0,I.__data[4]=O.elements[3],I.__data[5]=O.elements[4],I.__data[6]=O.elements[5],I.__data[7]=0,I.__data[8]=O.elements[6],I.__data[9]=O.elements[7],I.__data[10]=O.elements[8],I.__data[11]=0):(O.toArray(I.__data,V),V+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,L,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(M,y,v,T){let A=M.value,P=y+"_"+v;if(T[P]===void 0)return typeof A=="number"||typeof A=="boolean"?T[P]=A:T[P]=A.clone(),!0;{let C=T[P];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return T[P]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(M){let y=M.uniforms,v=0,T=16;for(let P=0,C=y.length;P<C;P++){let w=Array.isArray(y[P])?y[P]:[y[P]];for(let b=0,I=w.length;b<I;b++){let L=w[b],U=Array.isArray(L.value)?L.value:[L.value];for(let V=0,Y=U.length;V<Y;V++){let O=U[V],W=x(O),X=v%T,j=X%W.boundary,oe=X+j;v+=j,oe!==0&&T-oe<W.storage&&(v+=T-oe),L.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=W.storage}}}let A=v%T;return A>0&&(v+=T-A),M.__size=v,M.__cache={},this}function x(M){let y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),y}function m(M){let y=M.target;y.removeEventListener("dispose",m);let v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(let M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var kc=class{constructor(e={}){let{canvas:t=ff(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,p=null,M=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=is,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=pn;let A=0,P=0,C=null,w=-1,b=null,I=new Ft,L=new Ft,U=null,V=new Pe(0),Y=0,O=t.width,W=t.height,X=1,j=null,oe=null,pe=new Ft(0,0,O,W),Se=new Ft(0,0,O,W),Ne=!1,ke=new Lr,De=!1,ee=!1,ne=new it,me=new F,fe=new Ft,ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ye=!1;function ft(){return C===null?X:1}let k=i;function B(D,Q){return t.getContext(D,Q)}try{let D={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",Ue,!1),t.addEventListener("webglcontextrestored",qe,!1),t.addEventListener("webglcontextcreationerror",Te,!1),k===null){let Q="webgl2";if(k=B(Q,D),k===null)throw B(Q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let H,K,Z,J,re,ce,ie,ae,R,S,N,$,z,G,be,ve,we,Me,ye,Fe,at,Je,Le,ot;function q(){H=new _x(k),H.init(),Je=new Kv(k,H),K=new fx(k,H,e,Je),Z=new $v(k,H),K.reversedDepthBuffer&&f&&Z.buffers.depth.setReversed(!0),J=new Sx(k),re=new Fv,ce=new Jv(k,H,Z,re,K,Je,J),ie=new mx(v),ae=new yx(v),R=new Cm(k),Le=new ux(k,R),S=new Mx(k,R,J,Le),N=new Ex(k,S,R,J),ye=new wx(k,K,ce),ve=new px(re),$=new Uv(v,ie,ae,H,K,Le,ve),z=new ty(v,re),G=new Ov,be=new Wv(H),Me=new hx(v,ie,ae,Z,N,d,l),we=new Yv(v,N,K),ot=new ny(k,J,K,Z),Fe=new dx(k,H,J),at=new bx(k,H,J),J.programs=$.programs,v.capabilities=K,v.extensions=H,v.properties=re,v.renderLists=G,v.shadowMap=we,v.state=Z,v.info=J}q();let Ee=new Uu(v,k);this.xr=Ee,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let D=H.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){let D=H.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(D){D!==void 0&&(X=D,this.setSize(O,W,!1))},this.getSize=function(D){return D.set(O,W)},this.setSize=function(D,Q,he=!0){if(Ee.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=D,W=Q,t.width=Math.floor(D*X),t.height=Math.floor(Q*X),he===!0&&(t.style.width=D+"px",t.style.height=Q+"px"),this.setViewport(0,0,D,Q)},this.getDrawingBufferSize=function(D){return D.set(O*X,W*X).floor()},this.setDrawingBufferSize=function(D,Q,he){O=D,W=Q,X=he,t.width=Math.floor(D*he),t.height=Math.floor(Q*he),this.setViewport(0,0,D,Q)},this.getCurrentViewport=function(D){return D.copy(I)},this.getViewport=function(D){return D.copy(pe)},this.setViewport=function(D,Q,he,ue){D.isVector4?pe.set(D.x,D.y,D.z,D.w):pe.set(D,Q,he,ue),Z.viewport(I.copy(pe).multiplyScalar(X).round())},this.getScissor=function(D){return D.copy(Se)},this.setScissor=function(D,Q,he,ue){D.isVector4?Se.set(D.x,D.y,D.z,D.w):Se.set(D,Q,he,ue),Z.scissor(L.copy(Se).multiplyScalar(X).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(D){Z.setScissorTest(Ne=D)},this.setOpaqueSort=function(D){j=D},this.setTransparentSort=function(D){oe=D},this.getClearColor=function(D){return D.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(D=!0,Q=!0,he=!0){let ue=0;if(D){let te=!1;if(C!==null){let Ie=C.texture.format;te=Ie===sc||Ie===ic||Ie===nc}if(te){let Ie=C.texture.type,Ve=Ie===qn||Ie===zi||Ie===Vr||Ie===xs||Ie===ec||Ie===tc,Ke=Me.getClearColor(),Ze=Me.getClearAlpha(),pt=Ke.r,et=Ke.g,rt=Ke.b;Ve?(g[0]=pt,g[1]=et,g[2]=rt,g[3]=Ze,k.clearBufferuiv(k.COLOR,0,g)):(x[0]=pt,x[1]=et,x[2]=rt,x[3]=Ze,k.clearBufferiv(k.COLOR,0,x))}else ue|=k.COLOR_BUFFER_BIT}Q&&(ue|=k.DEPTH_BUFFER_BIT),he&&(ue|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(ue)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ue,!1),t.removeEventListener("webglcontextrestored",qe,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),Me.dispose(),G.dispose(),be.dispose(),re.dispose(),ie.dispose(),ae.dispose(),N.dispose(),Le.dispose(),ot.dispose(),$.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",hi),Ee.removeEventListener("sessionend",ka),Gi.stop()};function Ue(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function qe(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let D=J.autoReset,Q=we.enabled,he=we.autoUpdate,ue=we.needsUpdate,te=we.type;q(),J.autoReset=D,we.enabled=Q,we.autoUpdate=he,we.needsUpdate=ue,we.type=te}function Te(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function _e(D){let Q=D.target;Q.removeEventListener("dispose",_e),Xe(Q)}function Xe(D){nt(D),re.remove(D)}function nt(D){let Q=re.get(D).programs;Q!==void 0&&(Q.forEach(function(he){$.releaseProgram(he)}),D.isShaderMaterial&&$.releaseShaderCache(D))}this.renderBufferDirect=function(D,Q,he,ue,te,Ie){Q===null&&(Q=ge);let Ve=te.isMesh&&te.matrixWorld.determinant()<0,Ke=ht(D,Q,he,ue,te);Z.setMaterial(ue,Ve);let Ze=he.index,pt=1;if(ue.wireframe===!0){if(Ze=S.getWireframeAttribute(he),Ze===void 0)return;pt=2}let et=he.drawRange,rt=he.attributes.position,Tt=et.start*pt,Nt=(et.start+et.count)*pt;Ie!==null&&(Tt=Math.max(Tt,Ie.start*pt),Nt=Math.min(Nt,(Ie.start+Ie.count)*pt)),Ze!==null?(Tt=Math.max(Tt,0),Nt=Math.min(Nt,Ze.count)):rt!=null&&(Tt=Math.max(Tt,0),Nt=Math.min(Nt,rt.count));let Xt=Nt-Tt;if(Xt<0||Xt===1/0)return;Le.setup(te,ue,Ke,he,Ze);let Dt,Ut=Fe;if(Ze!==null&&(Dt=R.get(Ze),Ut=at,Ut.setIndex(Dt)),te.isMesh)ue.wireframe===!0?(Z.setLineWidth(ue.wireframeLinewidth*ft()),Ut.setMode(k.LINES)):Ut.setMode(k.TRIANGLES);else if(te.isLine){let ct=ue.linewidth;ct===void 0&&(ct=1),Z.setLineWidth(ct*ft()),te.isLineSegments?Ut.setMode(k.LINES):te.isLineLoop?Ut.setMode(k.LINE_LOOP):Ut.setMode(k.LINE_STRIP)}else te.isPoints?Ut.setMode(k.POINTS):te.isSprite&&Ut.setMode(k.TRIANGLES);if(te.isBatchedMesh)if(te._multiDrawInstances!==null)Rr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ut.renderMultiDrawInstances(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount,te._multiDrawInstances);else if(H.get("WEBGL_multi_draw"))Ut.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{let ct=te._multiDrawStarts,Jt=te._multiDrawCounts,At=te._multiDrawCount,Nn=Ze?R.get(Ze).bytesPerElement:1,hr=re.get(ue).currentProgram.getUniforms();for(let ti=0;ti<At;ti++)hr.setValue(k,"_gl_DrawID",ti),Ut.render(ct[ti]/Nn,Jt[ti])}else if(te.isInstancedMesh)Ut.renderInstances(Tt,Xt,te.count);else if(he.isInstancedBufferGeometry){let ct=he._maxInstanceCount!==void 0?he._maxInstanceCount:1/0,Jt=Math.min(he.instanceCount,ct);Ut.renderInstances(Tt,Xt,Jt)}else Ut.render(Tt,Xt)};function Bt(D,Q,he){D.transparent===!0&&D.side===jt&&D.forceSinglePass===!1?(D.side=gn,D.needsUpdate=!0,je(D,Q,he),D.side=Ti,D.needsUpdate=!0,je(D,Q,he),D.side=jt):je(D,Q,he)}this.compile=function(D,Q,he=null){he===null&&(he=D),p=be.get(he),p.init(Q),y.push(p),he.traverseVisible(function(te){te.isLight&&te.layers.test(Q.layers)&&(p.pushLight(te),te.castShadow&&p.pushShadow(te))}),D!==he&&D.traverseVisible(function(te){te.isLight&&te.layers.test(Q.layers)&&(p.pushLight(te),te.castShadow&&p.pushShadow(te))}),p.setupLights();let ue=new Set;return D.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;let Ie=te.material;if(Ie)if(Array.isArray(Ie))for(let Ve=0;Ve<Ie.length;Ve++){let Ke=Ie[Ve];Bt(Ke,he,te),ue.add(Ke)}else Bt(Ie,he,te),ue.add(Ie)}),p=y.pop(),ue},this.compileAsync=function(D,Q,he=null){let ue=this.compile(D,Q,he);return new Promise(te=>{function Ie(){if(ue.forEach(function(Ve){re.get(Ve).currentProgram.isReady()&&ue.delete(Ve)}),ue.size===0){te(D);return}setTimeout(Ie,10)}H.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let yt=null;function Mi(D){yt&&yt(D)}function hi(){Gi.stop()}function ka(){Gi.start()}let Gi=new Wf;Gi.setAnimationLoop(Mi),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(D){yt=D,Ee.setAnimationLoop(D),D===null?Gi.stop():Gi.start()},Ee.addEventListener("sessionstart",hi),Ee.addEventListener("sessionend",ka),this.render=function(D,Q){if(Q!==void 0&&Q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Q.parent===null&&Q.matrixWorldAutoUpdate===!0&&Q.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(Q),Q=Ee.getCamera()),D.isScene===!0&&D.onBeforeRender(v,D,Q,C),p=be.get(D,y.length),p.init(Q),y.push(p),ne.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),ke.setFromProjectionMatrix(ne,Ei,Q.reversedDepth),ee=this.localClippingEnabled,De=ve.init(this.clippingPlanes,ee),m=G.get(D,M.length),m.init(),M.push(m),Ee.enabled===!0&&Ee.isPresenting===!0){let Ie=v.xr.getDepthSensingMesh();Ie!==null&&le(Ie,Q,-1/0,v.sortObjects)}le(D,Q,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(j,oe),Ye=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,Ye&&Me.addToRenderList(m,D),this.info.render.frame++,De===!0&&ve.beginShadows();let he=p.state.shadowsArray;we.render(he,D,Q),De===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset();let ue=m.opaque,te=m.transmissive;if(p.setupLights(),Q.isArrayCamera){let Ie=Q.cameras;if(te.length>0)for(let Ve=0,Ke=Ie.length;Ve<Ke;Ve++){let Ze=Ie[Ve];se(ue,te,D,Ze)}Ye&&Me.render(D);for(let Ve=0,Ke=Ie.length;Ve<Ke;Ve++){let Ze=Ie[Ve];de(m,D,Ze,Ze.viewport)}}else te.length>0&&se(ue,te,D,Q),Ye&&Me.render(D),de(m,D,Q);C!==null&&P===0&&(ce.updateMultisampleRenderTarget(C),ce.updateRenderTargetMipmap(C)),D.isScene===!0&&D.onAfterRender(v,D,Q),Le.resetDefaultState(),w=-1,b=null,y.pop(),y.length>0?(p=y[y.length-1],De===!0&&ve.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function le(D,Q,he,ue){if(D.visible===!1)return;if(D.layers.test(Q.layers)){if(D.isGroup)he=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(Q);else if(D.isLight)p.pushLight(D),D.castShadow&&p.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||ke.intersectsSprite(D)){ue&&fe.setFromMatrixPosition(D.matrixWorld).applyMatrix4(ne);let Ve=N.update(D),Ke=D.material;Ke.visible&&m.push(D,Ve,Ke,he,fe.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||ke.intersectsObject(D))){let Ve=N.update(D),Ke=D.material;if(ue&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),fe.copy(D.boundingSphere.center)):(Ve.boundingSphere===null&&Ve.computeBoundingSphere(),fe.copy(Ve.boundingSphere.center)),fe.applyMatrix4(D.matrixWorld).applyMatrix4(ne)),Array.isArray(Ke)){let Ze=Ve.groups;for(let pt=0,et=Ze.length;pt<et;pt++){let rt=Ze[pt],Tt=Ke[rt.materialIndex];Tt&&Tt.visible&&m.push(D,Ve,Tt,he,fe.z,rt)}}else Ke.visible&&m.push(D,Ve,Ke,he,fe.z,null)}}let Ie=D.children;for(let Ve=0,Ke=Ie.length;Ve<Ke;Ve++)le(Ie[Ve],Q,he,ue)}function de(D,Q,he,ue){let te=D.opaque,Ie=D.transmissive,Ve=D.transparent;p.setupLightsView(he),De===!0&&ve.setGlobalState(v.clippingPlanes,he),ue&&Z.viewport(I.copy(ue)),te.length>0&&Be(te,Q,he),Ie.length>0&&Be(Ie,Q,he),Ve.length>0&&Be(Ve,Q,he),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function se(D,Q,he,ue){if((he.isScene===!0?he.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ue.id]===void 0&&(p.state.transmissionRenderTarget[ue.id]=new hn(1,1,{generateMipmaps:!0,type:H.has("EXT_color_buffer_half_float")||H.has("EXT_color_buffer_float")?xn:qn,minFilter:pi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Pt.workingColorSpace}));let Ie=p.state.transmissionRenderTarget[ue.id],Ve=ue.viewport||I;Ie.setSize(Ve.z*v.transmissionResolutionScale,Ve.w*v.transmissionResolutionScale);let Ke=v.getRenderTarget(),Ze=v.getActiveCubeFace(),pt=v.getActiveMipmapLevel();v.setRenderTarget(Ie),v.getClearColor(V),Y=v.getClearAlpha(),Y<1&&v.setClearColor(16777215,.5),v.clear(),Ye&&Me.render(he);let et=v.toneMapping;v.toneMapping=is;let rt=ue.viewport;if(ue.viewport!==void 0&&(ue.viewport=void 0),p.setupLightsView(ue),De===!0&&ve.setGlobalState(v.clippingPlanes,ue),Be(D,he,ue),ce.updateMultisampleRenderTarget(Ie),ce.updateRenderTargetMipmap(Ie),H.has("WEBGL_multisampled_render_to_texture")===!1){let Tt=!1;for(let Nt=0,Xt=Q.length;Nt<Xt;Nt++){let Dt=Q[Nt],Ut=Dt.object,ct=Dt.geometry,Jt=Dt.material,At=Dt.group;if(Jt.side===jt&&Ut.layers.test(ue.layers)){let Nn=Jt.side;Jt.side=gn,Jt.needsUpdate=!0,Qe(Ut,he,ue,ct,Jt,At),Jt.side=Nn,Jt.needsUpdate=!0,Tt=!0}}Tt===!0&&(ce.updateMultisampleRenderTarget(Ie),ce.updateRenderTargetMipmap(Ie))}v.setRenderTarget(Ke,Ze,pt),v.setClearColor(V,Y),rt!==void 0&&(ue.viewport=rt),v.toneMapping=et}function Be(D,Q,he){let ue=Q.isScene===!0?Q.overrideMaterial:null;for(let te=0,Ie=D.length;te<Ie;te++){let Ve=D[te],Ke=Ve.object,Ze=Ve.geometry,pt=Ve.group,et=Ve.material;et.allowOverride===!0&&ue!==null&&(et=ue),Ke.layers.test(he.layers)&&Qe(Ke,Q,he,Ze,et,pt)}}function Qe(D,Q,he,ue,te,Ie){D.onBeforeRender(v,Q,he,ue,te,Ie),D.modelViewMatrix.multiplyMatrices(he.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),te.onBeforeRender(v,Q,he,ue,D,Ie),te.transparent===!0&&te.side===jt&&te.forceSinglePass===!1?(te.side=gn,te.needsUpdate=!0,v.renderBufferDirect(he,Q,ue,te,D,Ie),te.side=Ti,te.needsUpdate=!0,v.renderBufferDirect(he,Q,ue,te,D,Ie),te.side=jt):v.renderBufferDirect(he,Q,ue,te,D,Ie),D.onAfterRender(v,Q,he,ue,te,Ie)}function je(D,Q,he){Q.isScene!==!0&&(Q=ge);let ue=re.get(D),te=p.state.lights,Ie=p.state.shadowsArray,Ve=te.state.version,Ke=$.getParameters(D,te.state,Ie,Q,he),Ze=$.getProgramCacheKey(Ke),pt=ue.programs;ue.environment=D.isMeshStandardMaterial?Q.environment:null,ue.fog=Q.fog,ue.envMap=(D.isMeshStandardMaterial?ae:ie).get(D.envMap||ue.environment),ue.envMapRotation=ue.environment!==null&&D.envMap===null?Q.environmentRotation:D.envMapRotation,pt===void 0&&(D.addEventListener("dispose",_e),pt=new Map,ue.programs=pt);let et=pt.get(Ze);if(et!==void 0){if(ue.currentProgram===et&&ue.lightsStateVersion===Ve)return St(D,Ke),et}else Ke.uniforms=$.getUniforms(D),D.onBeforeCompile(Ke,v),et=$.acquireProgram(Ke,Ze),pt.set(Ze,et),ue.uniforms=Ke.uniforms;let rt=ue.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(rt.clippingPlanes=ve.uniform),St(D,Ke),ue.needsLights=Re(D),ue.lightsStateVersion=Ve,ue.needsLights&&(rt.ambientLightColor.value=te.state.ambient,rt.lightProbe.value=te.state.probe,rt.directionalLights.value=te.state.directional,rt.directionalLightShadows.value=te.state.directionalShadow,rt.spotLights.value=te.state.spot,rt.spotLightShadows.value=te.state.spotShadow,rt.rectAreaLights.value=te.state.rectArea,rt.ltc_1.value=te.state.rectAreaLTC1,rt.ltc_2.value=te.state.rectAreaLTC2,rt.pointLights.value=te.state.point,rt.pointLightShadows.value=te.state.pointShadow,rt.hemisphereLights.value=te.state.hemi,rt.directionalShadowMap.value=te.state.directionalShadowMap,rt.directionalShadowMatrix.value=te.state.directionalShadowMatrix,rt.spotShadowMap.value=te.state.spotShadowMap,rt.spotLightMatrix.value=te.state.spotLightMatrix,rt.spotLightMap.value=te.state.spotLightMap,rt.pointShadowMap.value=te.state.pointShadowMap,rt.pointShadowMatrix.value=te.state.pointShadowMatrix),ue.currentProgram=et,ue.uniformsList=null,et}function Oe(D){if(D.uniformsList===null){let Q=D.currentProgram.getUniforms();D.uniformsList=qr.seqWithValue(Q.seq,D.uniforms)}return D.uniformsList}function St(D,Q){let he=re.get(D);he.outputColorSpace=Q.outputColorSpace,he.batching=Q.batching,he.batchingColor=Q.batchingColor,he.instancing=Q.instancing,he.instancingColor=Q.instancingColor,he.instancingMorph=Q.instancingMorph,he.skinning=Q.skinning,he.morphTargets=Q.morphTargets,he.morphNormals=Q.morphNormals,he.morphColors=Q.morphColors,he.morphTargetsCount=Q.morphTargetsCount,he.numClippingPlanes=Q.numClippingPlanes,he.numIntersection=Q.numClipIntersection,he.vertexAlphas=Q.vertexAlphas,he.vertexTangents=Q.vertexTangents,he.toneMapping=Q.toneMapping}function ht(D,Q,he,ue,te){Q.isScene!==!0&&(Q=ge),ce.resetTextureUnits();let Ie=Q.fog,Ve=ue.isMeshStandardMaterial?Q.environment:null,Ke=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Os,Ze=(ue.isMeshStandardMaterial?ae:ie).get(ue.envMap||Ve),pt=ue.vertexColors===!0&&!!he.attributes.color&&he.attributes.color.itemSize===4,et=!!he.attributes.tangent&&(!!ue.normalMap||ue.anisotropy>0),rt=!!he.morphAttributes.position,Tt=!!he.morphAttributes.normal,Nt=!!he.morphAttributes.color,Xt=is;ue.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Xt=v.toneMapping);let Dt=he.morphAttributes.position||he.morphAttributes.normal||he.morphAttributes.color,Ut=Dt!==void 0?Dt.length:0,ct=re.get(ue),Jt=p.state.lights;if(De===!0&&(ee===!0||D!==b)){let Gn=D===b&&ue.id===w;ve.setState(ue,D,Gn)}let At=!1;ue.version===ct.__version?(ct.needsLights&&ct.lightsStateVersion!==Jt.state.version||ct.outputColorSpace!==Ke||te.isBatchedMesh&&ct.batching===!1||!te.isBatchedMesh&&ct.batching===!0||te.isBatchedMesh&&ct.batchingColor===!0&&te.colorTexture===null||te.isBatchedMesh&&ct.batchingColor===!1&&te.colorTexture!==null||te.isInstancedMesh&&ct.instancing===!1||!te.isInstancedMesh&&ct.instancing===!0||te.isSkinnedMesh&&ct.skinning===!1||!te.isSkinnedMesh&&ct.skinning===!0||te.isInstancedMesh&&ct.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&ct.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&ct.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&ct.instancingMorph===!1&&te.morphTexture!==null||ct.envMap!==Ze||ue.fog===!0&&ct.fog!==Ie||ct.numClippingPlanes!==void 0&&(ct.numClippingPlanes!==ve.numPlanes||ct.numIntersection!==ve.numIntersection)||ct.vertexAlphas!==pt||ct.vertexTangents!==et||ct.morphTargets!==rt||ct.morphNormals!==Tt||ct.morphColors!==Nt||ct.toneMapping!==Xt||ct.morphTargetsCount!==Ut)&&(At=!0):(At=!0,ct.__version=ue.version);let Nn=ct.currentProgram;At===!0&&(Nn=je(ue,Q,te));let hr=!1,ti=!1,uo=!1,sn=Nn.getUniforms(),ui=ct.uniforms;if(Z.useProgram(Nn.program)&&(hr=!0,ti=!0,uo=!0),ue.id!==w&&(w=ue.id,ti=!0),hr||b!==D){Z.buffers.depth.getReversed()&&D.reversedDepth!==!0&&(D._reversedDepth=!0,D.updateProjectionMatrix()),sn.setValue(k,"projectionMatrix",D.projectionMatrix),sn.setValue(k,"viewMatrix",D.matrixWorldInverse);let Zn=sn.map.cameraPosition;Zn!==void 0&&Zn.setValue(k,me.setFromMatrixPosition(D.matrixWorld)),K.logarithmicDepthBuffer&&sn.setValue(k,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(ue.isMeshPhongMaterial||ue.isMeshToonMaterial||ue.isMeshLambertMaterial||ue.isMeshBasicMaterial||ue.isMeshStandardMaterial||ue.isShaderMaterial)&&sn.setValue(k,"isOrthographic",D.isOrthographicCamera===!0),b!==D&&(b=D,ti=!0,uo=!0)}if(te.isSkinnedMesh){sn.setOptional(k,te,"bindMatrix"),sn.setOptional(k,te,"bindMatrixInverse");let Gn=te.skeleton;Gn&&(Gn.boneTexture===null&&Gn.computeBoneTexture(),sn.setValue(k,"boneTexture",Gn.boneTexture,ce))}te.isBatchedMesh&&(sn.setOptional(k,te,"batchingTexture"),sn.setValue(k,"batchingTexture",te._matricesTexture,ce),sn.setOptional(k,te,"batchingIdTexture"),sn.setValue(k,"batchingIdTexture",te._indirectTexture,ce),sn.setOptional(k,te,"batchingColorTexture"),te._colorsTexture!==null&&sn.setValue(k,"batchingColorTexture",te._colorsTexture,ce));let di=he.morphAttributes;if((di.position!==void 0||di.normal!==void 0||di.color!==void 0)&&ye.update(te,he,Nn),(ti||ct.receiveShadow!==te.receiveShadow)&&(ct.receiveShadow=te.receiveShadow,sn.setValue(k,"receiveShadow",te.receiveShadow)),ue.isMeshGouraudMaterial&&ue.envMap!==null&&(ui.envMap.value=Ze,ui.flipEnvMap.value=Ze.isCubeTexture&&Ze.isRenderTargetTexture===!1?-1:1),ue.isMeshStandardMaterial&&ue.envMap===null&&Q.environment!==null&&(ui.envMapIntensity.value=Q.environmentIntensity),ti&&(sn.setValue(k,"toneMappingExposure",v.toneMappingExposure),ct.needsLights&&He(ui,uo),Ie&&ue.fog===!0&&z.refreshFogUniforms(ui,Ie),z.refreshMaterialUniforms(ui,ue,X,W,p.state.transmissionRenderTarget[D.id]),qr.upload(k,Oe(ct),ui,ce)),ue.isShaderMaterial&&ue.uniformsNeedUpdate===!0&&(qr.upload(k,Oe(ct),ui,ce),ue.uniformsNeedUpdate=!1),ue.isSpriteMaterial&&sn.setValue(k,"center",te.center),sn.setValue(k,"modelViewMatrix",te.modelViewMatrix),sn.setValue(k,"normalMatrix",te.normalMatrix),sn.setValue(k,"modelMatrix",te.matrixWorld),ue.isShaderMaterial||ue.isRawShaderMaterial){let Gn=ue.uniformsGroups;for(let Zn=0,fh=Gn.length;Zn<fh;Zn++){let Is=Gn[Zn];ot.update(Is,Nn),ot.bind(Is,Nn)}}return Nn}function He(D,Q){D.ambientLightColor.needsUpdate=Q,D.lightProbe.needsUpdate=Q,D.directionalLights.needsUpdate=Q,D.directionalLightShadows.needsUpdate=Q,D.pointLights.needsUpdate=Q,D.pointLightShadows.needsUpdate=Q,D.spotLights.needsUpdate=Q,D.spotLightShadows.needsUpdate=Q,D.rectAreaLights.needsUpdate=Q,D.hemisphereLights.needsUpdate=Q}function Re(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(D,Q,he){let ue=re.get(D);ue.__autoAllocateDepthBuffer=D.resolveDepthBuffer===!1,ue.__autoAllocateDepthBuffer===!1&&(ue.__useRenderToTexture=!1),re.get(D.texture).__webglTexture=Q,re.get(D.depthTexture).__webglTexture=ue.__autoAllocateDepthBuffer?void 0:he,ue.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(D,Q){let he=re.get(D);he.__webglFramebuffer=Q,he.__useDefaultFramebuffer=Q===void 0};let ut=k.createFramebuffer();this.setRenderTarget=function(D,Q=0,he=0){C=D,A=Q,P=he;let ue=!0,te=null,Ie=!1,Ve=!1;if(D){let Ze=re.get(D);if(Ze.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(k.FRAMEBUFFER,null),ue=!1;else if(Ze.__webglFramebuffer===void 0)ce.setupRenderTarget(D);else if(Ze.__hasExternalTextures)ce.rebindTextures(D,re.get(D.texture).__webglTexture,re.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){let rt=D.depthTexture;if(Ze.__boundDepthTexture!==rt){if(rt!==null&&re.has(rt)&&(D.width!==rt.image.width||D.height!==rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ce.setupDepthRenderbuffer(D)}}let pt=D.texture;(pt.isData3DTexture||pt.isDataArrayTexture||pt.isCompressedArrayTexture)&&(Ve=!0);let et=re.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(et[Q])?te=et[Q][he]:te=et[Q],Ie=!0):D.samples>0&&ce.useMultisampledRTT(D)===!1?te=re.get(D).__webglMultisampledFramebuffer:Array.isArray(et)?te=et[he]:te=et,I.copy(D.viewport),L.copy(D.scissor),U=D.scissorTest}else I.copy(pe).multiplyScalar(X).floor(),L.copy(Se).multiplyScalar(X).floor(),U=Ne;if(he!==0&&(te=ut),Z.bindFramebuffer(k.FRAMEBUFFER,te)&&ue&&Z.drawBuffers(D,te),Z.viewport(I),Z.scissor(L),Z.setScissorTest(U),Ie){let Ze=re.get(D.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ze.__webglTexture,he)}else if(Ve){let Ze=Q;for(let pt=0;pt<D.textures.length;pt++){let et=re.get(D.textures[pt]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+pt,et.__webglTexture,he,Ze)}}else if(D!==null&&he!==0){let Ze=re.get(D.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Ze.__webglTexture,he)}w=-1},this.readRenderTargetPixels=function(D,Q,he,ue,te,Ie,Ve,Ke=0){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ze=re.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ve!==void 0&&(Ze=Ze[Ve]),Ze){Z.bindFramebuffer(k.FRAMEBUFFER,Ze);try{let pt=D.textures[Ke],et=pt.format,rt=pt.type;if(!K.textureFormatReadable(et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!K.textureTypeReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q>=0&&Q<=D.width-ue&&he>=0&&he<=D.height-te&&(D.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Ke),k.readPixels(Q,he,ue,te,Je.convert(et),Je.convert(rt),Ie))}finally{let pt=C!==null?re.get(C).__webglFramebuffer:null;Z.bindFramebuffer(k.FRAMEBUFFER,pt)}}},this.readRenderTargetPixelsAsync=async function(D,Q,he,ue,te,Ie,Ve,Ke=0){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ze=re.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ve!==void 0&&(Ze=Ze[Ve]),Ze)if(Q>=0&&Q<=D.width-ue&&he>=0&&he<=D.height-te){Z.bindFramebuffer(k.FRAMEBUFFER,Ze);let pt=D.textures[Ke],et=pt.format,rt=pt.type;if(!K.textureFormatReadable(et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!K.textureTypeReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Tt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Tt),k.bufferData(k.PIXEL_PACK_BUFFER,Ie.byteLength,k.STREAM_READ),D.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Ke),k.readPixels(Q,he,ue,te,Je.convert(et),Je.convert(rt),0);let Nt=C!==null?re.get(C).__webglFramebuffer:null;Z.bindFramebuffer(k.FRAMEBUFFER,Nt);let Xt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await pf(k,Xt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Tt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,Ie),k.deleteBuffer(Tt),k.deleteSync(Xt),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(D,Q=null,he=0){let ue=Math.pow(2,-he),te=Math.floor(D.image.width*ue),Ie=Math.floor(D.image.height*ue),Ve=Q!==null?Q.x:0,Ke=Q!==null?Q.y:0;ce.setTexture2D(D,0),k.copyTexSubImage2D(k.TEXTURE_2D,he,0,0,Ve,Ke,te,Ie),Z.unbindTexture()};let nn=k.createFramebuffer(),$t=k.createFramebuffer();this.copyTextureToTexture=function(D,Q,he=null,ue=null,te=0,Ie=null){Ie===null&&(te!==0?(Rr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ie=te,te=0):Ie=0);let Ve,Ke,Ze,pt,et,rt,Tt,Nt,Xt,Dt=D.isCompressedTexture?D.mipmaps[Ie]:D.image;if(he!==null)Ve=he.max.x-he.min.x,Ke=he.max.y-he.min.y,Ze=he.isBox3?he.max.z-he.min.z:1,pt=he.min.x,et=he.min.y,rt=he.isBox3?he.min.z:0;else{let di=Math.pow(2,-te);Ve=Math.floor(Dt.width*di),Ke=Math.floor(Dt.height*di),D.isDataArrayTexture?Ze=Dt.depth:D.isData3DTexture?Ze=Math.floor(Dt.depth*di):Ze=1,pt=0,et=0,rt=0}ue!==null?(Tt=ue.x,Nt=ue.y,Xt=ue.z):(Tt=0,Nt=0,Xt=0);let Ut=Je.convert(Q.format),ct=Je.convert(Q.type),Jt;Q.isData3DTexture?(ce.setTexture3D(Q,0),Jt=k.TEXTURE_3D):Q.isDataArrayTexture||Q.isCompressedArrayTexture?(ce.setTexture2DArray(Q,0),Jt=k.TEXTURE_2D_ARRAY):(ce.setTexture2D(Q,0),Jt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,Q.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,Q.unpackAlignment);let At=k.getParameter(k.UNPACK_ROW_LENGTH),Nn=k.getParameter(k.UNPACK_IMAGE_HEIGHT),hr=k.getParameter(k.UNPACK_SKIP_PIXELS),ti=k.getParameter(k.UNPACK_SKIP_ROWS),uo=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Dt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Dt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,pt),k.pixelStorei(k.UNPACK_SKIP_ROWS,et),k.pixelStorei(k.UNPACK_SKIP_IMAGES,rt);let sn=D.isDataArrayTexture||D.isData3DTexture,ui=Q.isDataArrayTexture||Q.isData3DTexture;if(D.isDepthTexture){let di=re.get(D),Gn=re.get(Q),Zn=re.get(di.__renderTarget),fh=re.get(Gn.__renderTarget);Z.bindFramebuffer(k.READ_FRAMEBUFFER,Zn.__webglFramebuffer),Z.bindFramebuffer(k.DRAW_FRAMEBUFFER,fh.__webglFramebuffer);for(let Is=0;Is<Ze;Is++)sn&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,re.get(D).__webglTexture,te,rt+Is),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,re.get(Q).__webglTexture,Ie,Xt+Is)),k.blitFramebuffer(pt,et,Ve,Ke,Tt,Nt,Ve,Ke,k.DEPTH_BUFFER_BIT,k.NEAREST);Z.bindFramebuffer(k.READ_FRAMEBUFFER,null),Z.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(te!==0||D.isRenderTargetTexture||re.has(D)){let di=re.get(D),Gn=re.get(Q);Z.bindFramebuffer(k.READ_FRAMEBUFFER,nn),Z.bindFramebuffer(k.DRAW_FRAMEBUFFER,$t);for(let Zn=0;Zn<Ze;Zn++)sn?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,di.__webglTexture,te,rt+Zn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,di.__webglTexture,te),ui?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Gn.__webglTexture,Ie,Xt+Zn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Gn.__webglTexture,Ie),te!==0?k.blitFramebuffer(pt,et,Ve,Ke,Tt,Nt,Ve,Ke,k.COLOR_BUFFER_BIT,k.NEAREST):ui?k.copyTexSubImage3D(Jt,Ie,Tt,Nt,Xt+Zn,pt,et,Ve,Ke):k.copyTexSubImage2D(Jt,Ie,Tt,Nt,pt,et,Ve,Ke);Z.bindFramebuffer(k.READ_FRAMEBUFFER,null),Z.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ui?D.isDataTexture||D.isData3DTexture?k.texSubImage3D(Jt,Ie,Tt,Nt,Xt,Ve,Ke,Ze,Ut,ct,Dt.data):Q.isCompressedArrayTexture?k.compressedTexSubImage3D(Jt,Ie,Tt,Nt,Xt,Ve,Ke,Ze,Ut,Dt.data):k.texSubImage3D(Jt,Ie,Tt,Nt,Xt,Ve,Ke,Ze,Ut,ct,Dt):D.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Ie,Tt,Nt,Ve,Ke,Ut,ct,Dt.data):D.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Ie,Tt,Nt,Dt.width,Dt.height,Ut,Dt.data):k.texSubImage2D(k.TEXTURE_2D,Ie,Tt,Nt,Ve,Ke,Ut,ct,Dt);k.pixelStorei(k.UNPACK_ROW_LENGTH,At),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Nn),k.pixelStorei(k.UNPACK_SKIP_PIXELS,hr),k.pixelStorei(k.UNPACK_SKIP_ROWS,ti),k.pixelStorei(k.UNPACK_SKIP_IMAGES,uo),Ie===0&&Q.generateMipmaps&&k.generateMipmap(Jt),Z.unbindTexture()},this.initRenderTarget=function(D){re.get(D).__webglFramebuffer===void 0&&ce.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?ce.setTextureCube(D,0):D.isData3DTexture?ce.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?ce.setTexture2DArray(D,0):ce.setTexture2D(D,0),Z.unbindTexture()},this.resetState=function(){A=0,P=0,C=null,Z.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Pt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Pt._getUnpackColorSpace()}};var zc={1:{key:"mesa",name:"SHATTERED MESA",kind:"organic",enclosed:!1,sky:{zenith:"#141c48",mid:"#5a4c86",horizon:"#ffb07a",glow:"#ffd29a",stars:.25},sun:{color:"#ffcf9e",intensity:3.6,dir:[-.7,.55,.42]},hemi:{sky:"#a9b8ff",ground:"#5b2a1c",intensity:.85},fog:{color:"#d39a82",near:700,far:5600},exposure:1.05,rock:{base:"#a2573a",dark:"#4a1f14",light:"#e09a6a",strata:1,wet:0},top:{color:"#c99364",rough:.95},crystal:"#58d8ff",accent:"#63eeff",spike:"#7fe6ff",bloom:.55,backdrop:"mesa",ambient:"dust",grade:{lift:[.02,0,.01],gain:[1.05,.98,.92],sat:1.08},planet:{color:"#d9a88a",band:"#8f5b4a",ring:"#f0d4b8",pos:[-900,560,-5200],r:900}},2:{key:"vaults",name:"DROWNED VAULTS",kind:"organic",enclosed:!0,sky:{zenith:"#03121a",mid:"#06303a",horizon:"#0d5a62",glow:"#2fd0c0",stars:0},sun:{color:"#9fe8ff",intensity:1.7,dir:[.3,.42,.86]},hemi:{sky:"#3fb6c4",ground:"#071b1e",intensity:.75},fog:{color:"#0b3a40",near:250,far:1500},exposure:1.15,rock:{base:"#3e5a5e",dark:"#0e1d22",light:"#7fa6a0",strata:0,wet:1},top:{color:"#2c6a52",rough:.45},crystal:"#3cffd2",accent:"#88ffe5",spike:"#4dffe0",bloom:.75,backdrop:"cavern",ambient:"motes",grade:{lift:[0,.015,.02],gain:[.92,1.02,1.05],sat:1.05}},3:{key:"rift",name:"RIFT RUN",kind:"organic",enclosed:!1,sky:{zenith:"#05061a",mid:"#1c1a4a",horizon:"#6a5cc8",glow:"#b8a2ff",stars:1},sun:{color:"#ffd9c0",intensity:3.2,dir:[.45,.65,.5]},hemi:{sky:"#9c9cff",ground:"#1c1426",intensity:.95},fog:{color:"#3a2f6a",near:700,far:5200},exposure:1.25,rock:{base:"#6a6488",dark:"#1d1a30",light:"#b4aed0",strata:.8,wet:0},top:{color:"#7a7090",rough:.85},crystal:"#b296ff",accent:"#ba96ff",spike:"#c8b0ff",bloom:.7,backdrop:"rift",ambient:"speed",grade:{lift:[.01,.01,.03],gain:[.96,.97,1.06],sat:1.05},planet:{color:"#7b8ad8",band:"#3a3f80",ring:null,pos:[1800,1100,-6e3],r:1300}},4:{key:"foundry",name:"CINDER FOUNDRY",kind:"industrial",enclosed:!0,sky:{zenith:"#0a0808",mid:"#1e1612",horizon:"#3a2016",glow:"#ff7a32",stars:0},sun:{color:"#ffd2a8",intensity:3,dir:[-.35,.4,.85]},hemi:{sky:"#ffbe8a",ground:"#2a1c16",intensity:1.05},fog:{color:"#33201a",near:340,far:2e3},exposure:1.32,rock:{base:"#746e72",dark:"#1a1719",light:"#a49aa0",strata:0,wet:0},top:{color:"#6b6466",rough:.55},crystal:"#ffb35a",accent:"#ff8a3c",spike:"#ff6a2a",bloom:.8,backdrop:"foundry",ambient:"embers",grade:{lift:[.02,.01,0],gain:[1.06,.98,.9],sat:1.06}},5:{key:"spire",name:"THE HOLLOW SPIRE",kind:"organic",enclosed:!0,sky:{zenith:"#0c0414",mid:"#2a0c36",horizon:"#5a1c5c",glow:"#d06bff",stars:.4},sun:{color:"#e0b8ff",intensity:1.9,dir:[.32,.42,.85]},hemi:{sky:"#b070ff",ground:"#180a12",intensity:.7},fog:{color:"#2a0f34",near:260,far:1600},exposure:1.15,rock:{base:"#4a3550",dark:"#140a18",light:"#8a6a96",strata:0,wet:.6},top:{color:"#5a2a4a",rough:.5},crystal:"#c88cff",accent:"#b7ff68",spike:"#b7ff68",bloom:.85,backdrop:"spire",ambient:"spores",grade:{lift:[.02,0,.03],gain:[1.02,.95,1.06],sat:1.1}}};function $f(n){return zc[n&&n.world]||zc[1]}function Bn(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new wt,c=0;for(let h=0;h<n.length;++h){let u=n[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0,u=[];for(let f=0;f<n.length;++f){let d=n[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=n[f].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Jf(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<o[h].length;++x)d.push(o[h][x][f]);let g=Jf(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Jf(n){let e,t,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new It(o,t,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<t;g++){let x=h.getComponent(f,g);a.setComponent(f+u,g,x)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function Bc(n,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},i=n.getIndex(),s=n.getAttribute("position"),r=i?i.count:s.count,o=0,a=Object.keys(n.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let M=0,y=a.length;M<y;M++){let v=a[M],T=n.attributes[v];l[v]=new T.constructor(new T.array.constructor(T.count*T.itemSize),T.itemSize,T.normalized);let A=n.morphAttributes[v];A&&(c[v]||(c[v]=[]),A.forEach((P,C)=>{let w=new P.array.constructor(P.count*P.itemSize);c[v][C]=new P.constructor(w,P.itemSize,P.normalized)}))}let d=e*.5,g=Math.log10(1/e),x=Math.pow(10,g),m=d*x;for(let M=0;M<r;M++){let y=i?i.getX(M):M,v="";for(let T=0,A=a.length;T<A;T++){let P=a[T],C=n.getAttribute(P),w=C.itemSize;for(let b=0;b<w;b++)v+=`${~~(C[u[b]](y)*x+m)},`}if(v in t)h.push(t[v]);else{for(let T=0,A=a.length;T<A;T++){let P=a[T],C=n.getAttribute(P),w=n.morphAttributes[P],b=C.itemSize,I=l[P],L=c[P];for(let U=0;U<b;U++){let V=u[U],Y=f[U];if(I[Y](o,C[V](y)),w)for(let O=0,W=w.length;O<W;O++)L[O][Y](o,w[O][V](y))}}t[v]=o,h.push(o),o++}}let p=n.clone();for(let M in n.attributes){let y=l[M];if(p.setAttribute(M,new y.constructor(y.array.slice(0,o*y.itemSize),y.itemSize,y.normalized)),M in c)for(let v=0;v<c[M].length;v++){let T=c[M][v];p.morphAttributes[M][v]=new T.constructor(T.array.slice(0,o*T.itemSize),T.itemSize,T.normalized)}}return p.setIndex(h),p}function Vc(n){let e=n>>>0||1;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Ci(n,e,t){let i=Math.imul(n,374761393)+Math.imul(e,668265263)+Math.imul(t,2147483647);return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}var ma=n=>n*n*(3-2*n);function ga(n,e,t){let i=Math.floor(n),s=Math.floor(e),r=Math.floor(t),o=ma(n-i),a=ma(e-s),l=ma(t-r),c=(h,u,f)=>h+(u-h)*f;return c(c(c(Ci(i,s,r),Ci(i+1,s,r),o),c(Ci(i,s+1,r),Ci(i+1,s+1,r),o),a),c(c(Ci(i,s,r+1),Ci(i+1,s,r+1),o),c(Ci(i,s+1,r+1),Ci(i+1,s+1,r+1),o),a),l)*2-1}function Mn(n,e,t,i=3){let s=0,r=.5,o=1;for(let a=0;a<i;a++)s+=r*ga(n*o,e*o,t*o),o*=2.03,r*=.5;return s}function ku(n,e,t,i=3){let s=0,r=.5,o=1;for(let a=0;a<i;a++)s+=r*(1-Math.abs(ga(n*o,e*o,t*o))),o*=2.1,r*=.5;return s}function Hc(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=ma(n-s),a=ma(e-r),l=(d,g)=>Ci((d%t+t)%t,(g%t+t)%t,i),c=l(s,r),h=l(s+1,r),u=l(s,r+1),f=l(s+1,r+1);return c+(h-c)*o+(u-c)*a+(c-h-u+f)*o*a}function iy(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=9,a=9;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let h=s+c,u=r+l,f=(h%t+t)%t,d=(u%t+t)%t,g=h+Ci(f,d,i),x=u+Ci(f,d,i+7),m=Math.hypot(g-n,x-e);m<o?(a=o,o=m):m<a&&(a=m)}return[o,a]}var Hi=null;function Kf(){if(Hi)return Hi;let n=256,e=new Uint8Array(n*n*4);for(let t=0;t<n;t++)for(let i=0;i<n;i++){let s=i/n,r=t/n,o=0,a=.5,l=8;for(let x=0;x<5;x++)o+=a*Hc(s*l,r*l,l,11+x),a*=.5,l*=2;let[c,h]=iy(s*10,r*10,10,3),u=Math.max(0,1-(h-c)*7),f=Hc(s*128,r*128,128,5)*.6+Hc(s*64,r*64,64,6)*.4,d=0;a=.5,l=2;for(let x=0;x<3;x++)d+=a*Hc(s*l,r*l,l,21+x),a*=.5,l*=2;let g=(t*n+i)*4;e[g]=o*255,e[g+1]=u*255,e[g+2]=f*255,e[g+3]=d/.875*255}return Hi=new Pn(e,n,n,vn),Hi.wrapS=Hi.wrapT=kn,Hi.magFilter=Cn,Hi.minFilter=pi,Hi.generateMipmaps=!0,Hi.needsUpdate=!0,Hi}var Pi=`
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
`;var $r=n=>new Pe(n);function ir(n,e={}){let t=n.kind==="industrial"||e.industrial,i=new Kt({color:16777215,roughness:.9,metalness:t?.55:0,vertexColors:!0,flatShading:!1}),s={uDetail:{value:Kf()},uTime:{value:0},uRockBase:{value:$r(e.base||n.rock.base)},uRockDark:{value:$r(n.rock.dark)},uRockLight:{value:$r(n.rock.light)},uTop:{value:$r(e.top||n.top.color)},uTopRough:{value:n.top.rough},uStrata:{value:e.strata??n.rock.strata},uWet:{value:n.rock.wet},uCrystal:{value:$r(n.crystal)},uVein:{value:e.vein??(t?0:1)},uIndustrial:{value:t?1:0},uBump:{value:e.bump??(t?1.2:2.2)},uWaterMask:{value:e.waterMask||null},uHasWater:{value:e.waterMask?1:0},uWaterTop:{value:e.waterTop??-1e4},uLevelSize:{value:new xe(e.cols||1,e.rows||1)},uHeat:{value:e.heat??(n.key==="foundry"?1:0)},uPulse:{value:n.key==="spire"?1:0},uAccent:{value:$r(n.accent)}};return i.userData.uniforms=s,i.onBeforeCompile=r=>{Object.assign(r.uniforms,s),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
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
if(uHeat>.5){float glow=smoothstep(-150.,-430.,vWPos.y)*0.;totalEmissiveRadiance+=vec3(1.,.35,.08)*glow;}`)},i.customProgramCacheKey=()=>"terrain-"+(t?"i":"o")+(e.waterMask?"w":""),i}function Ii(n,e=2.2,t={}){let i=new Pe(n),s=new qs({color:i.clone().multiplyScalar(.32),emissive:i,emissiveIntensity:e*.55,roughness:.1,metalness:.1,clearcoat:1,clearcoatRoughness:.06,transparent:!!t.transparent,opacity:t.opacity??1,flatShading:!0,envMapIntensity:1.1,iridescence:.5,iridescenceIOR:1.4});return s.onBeforeCompile=r=>{r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying float vLy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLy=position.y;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
varying float vLy;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      float fres=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),2.2);float tip=smoothstep(.5,1.,vLy);
      totalEmissiveRadiance*=.14+fres*1.35+tip*.85;`)},s.customProgramCacheKey=()=>"crystal",s}var Jr=5,zt=256,Dn=48,ss=4,xa=6;function sy(n){let e=new Float32Array(zt*Dn),t=new Float32Array(zt*Dn),i=new Uint16Array(zt*Dn),s=new Pn(i,zt,Dn,ys,xn);s.magFilter=s.minFilter=Cn,s.wrapS=s.wrapT=Ui,s.needsUpdate=!0;let r=n-Dn*xa,o=0,a=0,l=.12,c=.991,h=new Float32Array(zt*Dn);for(let f=0;f<Dn;f++)for(let d=0;d<zt;d++){let g=Math.min(1,Math.min(d,zt-1-d)/14)*Math.min(1,f/10);h[f*zt+d]=.92+.08*g}function u(f){let d=new Float32Array(zt*Dn),g=new Float32Array(zt*Dn);for(let x=0;x<Dn;x++)for(let m=0;m<zt;m++){let p=m+f;p<0||p>=zt||(d[x*zt+m]=e[x*zt+p],g[x*zt+m]=t[x*zt+p])}e=d,t=g,o+=f*ss}return{tex:s,get x0(){return o},z0:r,width:zt*ss,depth:Dn*xa,follow(f){let d=Math.round((f-zt*ss/2)/ss),g=d-Math.round(o/ss);Math.abs(g)>zt/2?(e.fill(0),t.fill(0),o=d*ss):Math.abs(g)>=8&&u(g)},drop(f,d,g,x){let m=(f-o)/ss,p=(d-r)/xa,M=x/ss,y=x/xa;for(let v=Math.max(1,Math.floor(p-y));v<=Math.min(Dn-2,Math.ceil(p+y));v++)for(let T=Math.max(1,Math.floor(m-M));T<=Math.min(zt-2,Math.ceil(m+M));T++){let A=Math.hypot((T-m)/M,(v-p)/y);A>=1||(e[v*zt+T]-=g*(.5+.5*Math.cos(A*Math.PI)))}},height(f,d){let g=Math.round((f-o)/ss),x=Math.round((d-r)/xa);return g<0||x<0||g>=zt||x>=Dn?0:e[x*zt+g]},step(f){a=Math.min(a+f,3/60);let d=0;for(;a>=1/60;){a-=1/60,d++;for(let x=1;x<Dn-1;x++){let m=x*zt;for(let p=1;p<zt-1;p++){let M=m+p,y=(2-4*l)*e[M]+l*(e[M-1]+e[M+1]+e[M-zt]+e[M+zt])-t[M];t[M]=y*c*h[M]}}for(let x=0;x<zt;x++)t[(Dn-1)*zt+x]=t[(Dn-2)*zt+x];let g=e;e=t,t=g}if(d){for(let g=0;g<zt*Dn;g++)i[g]=Do.toHalfFloat(e[g]);s.needsUpdate=!0}},clear(){e.fill(0),t.fill(0)},dispose(){s.dispose()}}}var Gc=`
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
`,ry=`
${Gc}
varying vec3 vW;
void main(){vec4 w=modelMatrix*vec4(position,1.);w.y+=surfH(w.xz,uTime);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,oy=`
${Gc}
attribute float aSurf;attribute float aTop;
varying vec3 vW;varying float vTop;
void main(){vec4 w=modelMatrix*vec4(position,1.);float h=surfH(vec2(w.x,w.z-2.),uTime);
  if(aSurf>.5)w.y+=h;vTop=aTop+h;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,jf=`
vec3 fogIt(vec3 c,float d){return mix(c,uFogColor,smoothstep(uFogNear,uFogFar,d));}
`,ay=`
${Gc}${jf}
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
  float F=.02+.98*pow(1.-max(dot(n,V),0.),5.);vec3 H=normalize(uSunDir+V);
  vec3 c=mix(uScatter*.8,sky(reflect(-V,n)),F)+uSunCol*pow(max(dot(n,H),0.),300.)*4.;
  gl_FragColor=vec4(fogIt(c,dMe),.72+F*.25);return;
#else
  vec2 suv=gl_FragCoord.xy/uRes;float zMe=lin(gl_FragCoord.z),zS=lin(texture2D(tDepth,suv).r);
  if(zS<zMe-.3)discard;
  float NdV=max(dot(n,V),0.);float F=.02+.98*pow(1.-NdV,5.);
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
  gl_FragColor=vec4(fogIt(c,dMe),1.);
#endif
}`,ly=`
${Gc}${jf}
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
  gl_FragColor=vec4(fogIt(c,dMe),1.);
#endif
}`;function Qf(n,e,t,i,s,r,o){let a=n.cols,l=n.rows,c=new Yt,h=o+1.5,u=(O,W)=>{for(;W>0&&t(O,W-1)===Jr;)W--;return W},f=O=>-O*r-3,d=e.key==="vaults",g=new F(...e.sun.dir).normalize(),x=sy(h),m={uTime:{value:0},uNear:{value:8},uFar:{value:14e3},uLite:{value:0},uWave:{value:d?.55:.9},tScene:{value:null},tDepth:{value:null},tRip:{value:x.tex},uRes:{value:new xe(1,1)},uRipO:{value:new xe(0,x.z0)},uRipS:{value:new xe(x.width,x.depth)},uAbsorb:{value:d?new F(.026,.0068,.0082):new F(.022,.0055,.0035)},uScatter:{value:new Pe(d?"#0d5b5a":"#1d5f86").multiplyScalar(d?.55:.7)},uScatK:{value:.016},uSkyTop:{value:new Pe(d?"#0a1c22":e.sky.zenith)},uSkyHor:{value:new Pe(d?"#2a6a6c":e.sky.horizon)},uSunDir:{value:g},uSunCol:{value:new Pe(e.sun.color).multiplyScalar(d?1.6:2.4)},uFoam:{value:new Pe(d?"#bff4ec":"#eef8ff")},uFogColor:{value:new Pe(e.fog.color)},uFogNear:{value:e.fog.near},uFogFar:{value:e.fog.far},uCamFwd:{value:new F(0,0,-1)},uProj:{value:new it}},p={SSR_STEPS:s==="low"?10:22,SHAFT_STEPS:s==="low"?3:s==="high"?5:7},M=(O,W)=>new gt({uniforms:m,defines:{...p},vertexShader:O,fragmentShader:W,side:jt}),y=M(ry,ay),v=M(oy,ly);v.side=Ti;let T=[],A=[],P=[],C=[h,24,20,15,9,2,-6,-16,-30,-48,-72,-105,-150,-210,-280].filter(O=>O>i);C.push(i);for(let O=0;O<l;O++){let W=0;for(;W<a;){if(t(W,O)!==Jr){W++;continue}let X=W;for(;X<a&&t(X,O)===Jr;)X++;let j=W*r,oe=X*r,pe=Math.max(1,Math.round((oe-j)/4)),Se=[],Ne=[],ke=[],De=[],ee=fe=>t(Math.min(X-1,Math.max(W,Math.floor((fe-.01)/r))),O-1)!==Jr;for(let fe=0;fe<=pe;fe++){let ge=j+(oe-j)*fe/pe,Ye=Math.min(X-1,Math.max(W,Math.floor((ge-.01)/r))),ft=f(u(Ye,O)),k=ee(ge),B=k?f(O):-O*r,H=-(O+1)*r;if(Se.push(ge,B,h,ge,H,h),Ne.push(k?1:0,0),ke.push(ft,ft),fe<pe){let K=fe*2;De.push(K,K+1,K+2,K+2,K+1,K+3)}}let ne=new wt;ne.setAttribute("position",new $e(Se,3)),ne.setAttribute("aSurf",new $e(Ne,1)),ne.setAttribute("aTop",new $e(ke,1)),ne.setIndex(De),A.push(ne);let me=W;for(;me<X;){if(t(me,O-1)===Jr){me++;continue}let fe=me;for(;fe<X&&t(fe,O-1)!==Jr;)fe++;let ge=f(O),Ye=me*r,ft=fe*r,k=Math.max(1,Math.round((ft-Ye)/(s==="low"?8:5))),B=[],H=[];for(let Z=0;Z<C.length;Z++)for(let J=0;J<=k;J++)B.push(Ye+(ft-Ye)*J/k,ge,C[Z]);for(let Z=0;Z<C.length-1;Z++)for(let J=0;J<k;J++){let re=Z*(k+1)+J,ce=re+k+1;H.push(re,ce,re+1,re+1,ce,ce+1)}let K=new wt;K.setAttribute("position",new $e(B,3)),K.setIndex(H),T.push(K),P.push({x0:Ye,x1:ft,y:ge}),me=fe}W=X}}if(!T.length&&!A.length)return x.dispose(),y.dispose(),v.dispose(),null;let w=[];if(A.length){let O=new tt(Bn(A),v);O.renderOrder=3,w.push(O)}if(T.length){let O=new tt(Bn(T),y);O.renderOrder=2,w.push(O)}A.concat(T).forEach(O=>O.dispose());for(let O of w)O.layers.set(1),O.frustumCulled=!1,c.add(O);let b=O=>{for(let W of P)if(O>=W.x0&&O<=W.x1)return W;return null},I=new WeakMap,L=.5,U=0,V=!1,Y={group:c,uniforms:m,ripples:x,surfaces:P,surfaceAt:b,onEvent:null,splash(O,W,X=1){let j=b(O);return!j||Math.abs(-W-j.y)>40?!1:(x.drop(O,0,2.2*X,9+7*X),x.drop(O,-10,1.2*X,12*X),!0)},update(O,W,X,j,oe,pe){if(m.uTime.value=O,m.uNear.value=j.near,m.uFar.value=j.far,m.uProj.value.copy(j.projectionMatrix),j.getWorldDirection(m.uCamFwd.value),x.follow(oe+pe/2),m.uRipO.value.set(x.x0,x.z0),W>0&&X){let Se=X.player,Ne=(ne,me,fe,ge)=>Y.onEvent&&Y.onEvent(ne,me,fe,ge),ke=Se.x+Se.w/2,De=b(ke);if(De&&Se.inWater&&!Se.dead&&Math.abs(-Se.y-De.y)<16){U-=W;let ne=Math.abs(Se.vx)+Math.abs(Se.vy)*.5;U<=0&&ne>25&&(x.drop(ke-Math.sign(Se.vx)*6,0,.55,7),U=.11,Math.random()<.35&&Ne("stroke",ke,-De.y,.5))}let ee=(ne,me,fe,ge,Ye)=>{let ft=I.get(ne);if(I.set(ne,fe),ft==null)return;let k=b(me);if(!k)return;let B=-k.y;(ft-B)*(fe-B)<0&&(x.drop(me,0,ge,6+ge*4),Ne(Ye,me,B,ge))};for(let ne of X.pshots)ee(ne,ne.x,ne.y,.7,"plip");for(let ne of X.eshots)ee(ne,ne.x,ne.y,.6,"plip");for(let ne of X.enemies)ne.alive&&ee(ne,ne.x+ne.w/2,ne.y+ne.h/2,1.1,"splash");if(d&&(L-=W,L<=0)){L=.35+Math.random()*1.2;let ne=P.filter(me=>me.x1>oe&&me.x0<oe+pe);if(ne.length){let me=ne[Math.random()*ne.length|0],fe=Math.max(me.x0,Math.min(me.x1,oe+Math.random()*pe)),ge=-10-Math.random()*150;fe>=me.x0&&fe<=me.x1&&(x.drop(fe,ge,.9,5),ge>-60&&Ne("drip",fe,-me.y,.4+(ge+60)/120))}}}x.step(W)},setSize(O,W){m.uRes.value.set(O,W)},setLite(O){if(O!==V){V=O;for(let W of[y,v])O?W.defines.LITE=1:delete W.defines.LITE,W.transparent=O,W.depthWrite=!O,W.needsUpdate=!0}},dispose(){y.dispose(),v.dispose(),x.dispose()}};return Y}function ep(n,e,t){let i=n.tx*t+t/2,s=-n.topTy*t+6,r=-(n.botTy+1)*t-90,o=s-r,a={uTime:{value:0},uColor:{value:new Pe(e.key==="mesa"?"#cfeeff":"#aff")},uH:{value:o}},l=new gt({uniforms:a,transparent:!0,depthWrite:!1,blending:An,vertexShader:"varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.x+=sin(uv.y*9.+uTime*3.)*.6*(1.-uv.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uH;uniform vec3 uColor;
      float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
      void main(){float fall=1.-vUv.y;float sp=uH/60.;
        vec2 p1=vec2(vUv.x*9.,vUv.y*sp*.9+uTime*3.2),p2=vec2(vUv.x*17.+3.,vUv.y*sp*1.6+uTime*5.1);
        float streak=n(p1)*.55+n(p2)*.45;streak=smoothstep(.35,.95,streak);
        float edge=smoothstep(0.,.18+.1*n(vec2(vUv.y*sp*3.+uTime*4.,1.)),vUv.x)*smoothstep(1.,.82-.1*n(vec2(vUv.y*sp*3.+uTime*4.,7.)),vUv.x);
        float sheet=.28+.35*(1.-fall)+streak*.9;
        float lip=smoothstep(.93,1.,vUv.y)*.8;float foam=smoothstep(.16,0.,vUv.y)*(.7+.5*n(vec2(vUv.x*12.,uTime*6.)));
        float a=edge*(sheet*.42+foam*.6+lip*.4);
        gl_FragColor=vec4(uColor*(sheet+foam*1.4+lip),1.)*a;}`}),c=new tt(new dn(28,o,6,24),l);return c.position.set(i,r+o/2,-40),{mesh:c,mat:l,x:i,top:s,bot:r}}var rs=20,xi=26,jn=-72,Ms={EMPTY:0,SOLID:1,SPIKE:2,PLATFORM:3,DECO:4,WATER:5,CRATE:6};function tp(n,e,t){let i=rs,s=n.cols,r=n.rows,o=n.tiles,a=(()=>{let B=0;for(let H=0;H<s;H++)o[H]===Ms.SOLID&&B++;return B>s*.6})(),l=!!e.enclosed,c=e.kind==="industrial",h=t==="low"?2:4,u=t==="low"?4:8,f=(B,H)=>(B=Math.max(0,Math.min(s-1,B)),H>=r?Ms.SOLID:(H<0&&(H=a?0:-1),H<0?Ms.EMPTY:o[H*s+B])),d=(B,H)=>f(B,H)===Ms.SOLID,g=new Yt;g.name="terrain";let x=Vc(n.world*1e3+n.stageIndex*17+7),m=null;if(n.hasWater){let B=new Uint8Array(s*r);for(let H=0;H<s*r;H++)B[H]=o[H]===Ms.WATER?255:0;m=new Pn(B,s,r,ys,qn),m.flipY=!1,m.magFilter=m.minFilter=mn,m.needsUpdate=!0}let p=-1e4;if(n.hasWater){for(let B=0;B<s*r;B++)if(o[B]===Ms.WATER){p=-Math.floor(B/s)*i-3;break}}let M=ir(e,{waterMask:m,cols:s,rows:r,waterTop:p}),y=[M],v=new Float32Array(s),T=new Float32Array(s);for(let B=0;B<s;B++){let H=r-1;if(!d(B,H))v[B]=-(r*i+90);else{for(;H>0&&d(B,H-1);)H--;v[B]=-H*i}let K=0;if(a&&d(B,0)){for(;K<r-1&&d(B,K+1);)K++;T[B]=-(K+1)*i}else T[B]=200}let A=(B,H)=>{let K=H/i-.5,Z=Math.floor(K),J=K-Z,re=B[Math.max(0,Math.min(s-1,Z))],ce=B[Math.max(0,Math.min(s-1,Z+1))];return re+(ce-re)*J},P=(B,H,K)=>{let Z=0,J=0;for(let re=-K;re<=K;re+=i/2)Z+=A(B,H+re),J++;return Z/J},C=c?0:e.key==="spire"?7:e.key==="vaults"?6:5.5,w=new Map;function b(B,H,K,Z){if(!C){Z[0]=B,Z[1]=H,Z[2]=K,Z[3]=0;return}let J=(B*4|0)+","+(H*4|0)+","+(K*4|0),re=w.get(J);if(!re){let ce=e.key==="spire"?.022:.034,ie=B*ce,ae=H*ce,R=K*ce,S=K>-40&&K<xi-5?.12:1,N=Mn(ie,ae+57,R,3)*C*1.7;e.rock.strata&&(N+=Math.sin(H*.42+Mn(ie*.5,ae*.5,0,2)*3)*2.6*e.rock.strata),re=[Mn(ie,ae,R,3)*C,Mn(ie+31,ae,R,3)*C*S,N],w.set(J,re)}Z[0]=B+re[0],Z[1]=H+re[1],Z[2]=K+re[2],Z[3]=re[2]/(C*2.2)}function I(B,H,K){let Z=A(v,B),J=Math.max(0,(Z-H)/i),re=1-Math.min(.5,J*.07);return K<jn+12&&(re*=.86),re*(.9+.1*ga(B*.05,H*.05,K*.05))}let L=16,U=26,V=[],Y=[0,0,0,0];for(let B=-U;B<s+U;B+=L){let H=[],K=[],Z=(ce,ie,ae,R,S)=>{for(let N=0;N<S;N++)for(let $=0;$<R;$++){let z=(Me,ye)=>[ce[0]+ie[0]*Me+ae[0]*ye,ce[1]+ie[1]*Me+ae[1]*ye,ce[2]+ie[2]*Me+ae[2]*ye],G=z($/R,N/S),be=z(($+1)/R,N/S),ve=z(($+1)/R,(N+1)/S),we=z($/R,(N+1)/S);for(let Me of[G,ve,be,G,we,ve]){b(Me[0],Me[1],Me[2],Y),H.push(Y[0],Y[1],Y[2]);let ye=I(Me[0],Me[1],Me[2])*(.8+.2*Math.max(-1,Math.min(1,Y[3]*2)));K.push(ye,ye,ye)}}};for(let ce=B;ce<B+L;ce++)for(let ie=0;ie<r+3;ie++){if(!d(ce,ie))continue;let ae=ce*i,R=ae+i,S=-ie*i,N=S-i;Z([ae,S,xi],[i,0,0],[0,-i,0],h,h),d(ce,ie-1)||Z([ae,S,jn],[i,0,0],[0,0,xi-jn],h,u),!d(ce,ie+1)&&ie<r+2&&Z([ae,N,xi],[i,0,0],[0,0,jn-xi],h,u),d(ce-1,ie)||Z([ae,S,jn],[0,0,xi-jn],[0,-i,0],u,h),d(ce+1,ie)||Z([R,S,xi],[0,0,jn-xi],[0,-i,0],u,h)}if(!H.length)continue;let J=new wt;J.setAttribute("position",new $e(H,3)),J.setAttribute("color",new $e(K,3)),c||(J=Bc(J,.01)),J.computeVertexNormals(),J.computeBoundingSphere();let re=new tt(J,M);re.castShadow=!0,re.receiveShadow=!0,g.add(re),V.push(re)}let O=l?[jn+10,jn-6,-95,-120,-150,-190,-240,-300]:[jn+10,jn-6,-95,-120,-150,-190,-240,-300,-380,-480,-600,-760,-950],W=t==="low"?20:10,X=-U*i,j=(s+U)*i,oe=(B,H,K)=>{let Z=Math.max(0,(jn-H)/(jn-O[O.length-1])),J=A(K?v:T,B),re=P(K?v:T,B,90),ce=J+(re-J)*Math.min(1,Z*3.2),ie=.006,ae=ku(B*ie,H*ie,K?3.1:7.7,4)*1.4-.5;e.key==="mesa"&&(ae=Math.floor(ae*4.5)/4.5*.8+ae*.25);let R=(l?110:230)*Math.pow(Math.max(0,Z),1.25)+(Z>0?8:0);return c&&(R=Z>0?3:0,ae=Math.round(ae*2)/2),e.key==="rift"?ce+=(K?-1.7:2.4)*(Math.abs(ae)+.3)*R+Mn(B*.03,H*.03,1,2)*6*Math.min(1,Z*4):ce+=(K?1:-1)*(ae*R+Mn(B*.03,H*.03,1,2)*(c?0:6)*Math.min(1,Z*4)),K&&J<-r*i&&(ce=Math.min(ce,J+R*.4)),H>jn-4&&(ce+=K?-4:4),ce};function pe(B){let H=Math.ceil((j-X)/W)+1,K=O.length,Z=new Float32Array(H*K*3),J=new Float32Array(H*K*3),re=[];for(let ie=0;ie<K;ie++)for(let ae=0;ae<H;ae++){let R=X+ae*W,S=O[ie],N=oe(R,S,B),$=(ie*H+ae)*3;Z[$]=R+Mn(R*.02,S*.02,5,2)*4,Z[$+1]=N,Z[$+2]=S;let z=ie<2?.82:.9+.1*ga(R*.01,S*.01,2);J[$]=J[$+1]=J[$+2]=z}for(let ie=0;ie<K-1;ie++)for(let ae=0;ae<H-1;ae++){let R=ie*H+ae,S=R+1,N=R+H,$=N+1;B?re.push(R,S,N,S,$,N):re.push(R,N,S,S,N,$)}let ce=new wt;return ce.setAttribute("position",new It(Z,3)),ce.setAttribute("color",new It(J,3)),ce.setIndex(re),ce.computeVertexNormals(),ce}function Se(B){let H=cy(B,L*i*2);for(let K of H){let Z=new tt(K,M);Z.receiveShadow=!0,Z.castShadow=!l,g.add(Z)}}if(Se(pe(!0)),a&&Se(pe(!1)),l){let B=O[O.length-1],H=Math.ceil((j-X)/W)+1,K=24,Z=new Float32Array(H*K*3),J=new Float32Array(H*K*3),re=[];for(let ie=0;ie<K;ie++)for(let ae=0;ae<H;ae++){let R=X+ae*W,S=oe(R,B,!0)-30,N=oe(R,B,!1)+30,$=ie/(K-1),z=S+(N-S)*$,G=(ie*H+ae)*3,be=Mn(R*.012,z*.012,3,3)*70+ku(R*.03,z*.03,1,2)*25;Z[G]=R,Z[G+1]=z,Z[G+2]=B-20-be*(c?.2:1);let ve=.72+.28*Math.sin($*Math.PI);J[G]=J[G+1]=J[G+2]=ve}for(let ie=0;ie<K-1;ie++)for(let ae=0;ae<H-1;ae++){let R=ie*H+ae,S=R+1,N=R+H,$=N+1;re.push(R,S,N,S,$,N)}let ce=new wt;ce.setAttribute("position",new It(Z,3)),ce.setAttribute("color",new It(J,3)),ce.setIndex(re),ce.computeVertexNormals(),Se(ce)}let Ne=[];for(let B=0;B<r;B++)for(let H=0;H<s;H++)o[B*s+H]===Ms.SPIKE&&Ne.push([H,B]);if(Ne.length){let B=sr(),H=5,K=Ne.length*H,Z=c?new Kt({color:"#2a2426",metalness:.9,roughness:.35,emissive:new Pe(e.spike),emissiveIntensity:0}):Ii(e.spike,1.6);c&&(Z.onBeforeCompile=ie=>{ie.vertexShader=ie.vertexShader.replace("#include <common>",`#include <common>
varying float vHy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vHy=position.y;`),ie.fragmentShader=ie.fragmentShader.replace("#include <common>",`#include <common>
varying float vHy;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance=emissive*smoothstep(.45,1.,vHy)*3.5;`)});let J=new an(B,Z,K),re=new Ht,ce=0;for(let[ie,ae]of Ne)for(let R=0;R<H;R++){let S=.75+x()*.5;re.position.set(ie*i+3+x()*14,-(ae+1)*i+2,-34+R*13+x()*6),re.rotation.set((x()-.5)*.35,x()*6.28,(x()-.5)*.35),re.scale.set(4*S,(13+x()*7)*S,4*S),re.updateMatrix(),J.setMatrixAt(ce++,re.matrix)}J.castShadow=!0,g.add(J),y.push(Z)}let ke=[];for(let B=0;B<r;B++)for(let H=0;H<s;H++)o[B*s+H]===Ms.CRATE&&ke.push(B*s+H);let De=null,ee=new Map;if(ke.length){let B=uy(n.type==="shmup"),H=new Kt({color:n.type==="shmup"?"#3a3f52":"#6a5a44",metalness:.7,roughness:.42,emissive:new Pe(e.accent),emissiveIntensity:0,vertexColors:!0});H.onBeforeCompile=Z=>{Z.fragmentShader=Z.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance=emissive*step(1.5,vColor.r+vColor.g+vColor.b)*2.5;`).replace("#include <color_fragment>",`#include <color_fragment>
if(vColor.r+vColor.g+vColor.b>1.5)diffuseColor.rgb=vec3(.1);`)},De=new an(B,H,ke.length);let K=new Ht;ke.forEach((Z,J)=>{let re=Z%s,ce=Z/s|0;K.position.set(re*i+i/2,-ce*i-i/2,0),K.rotation.set(0,(x()-.5)*.06,0),K.scale.set(1,1,1),K.updateMatrix(),De.setMatrixAt(J,K.matrix),ee.set(Z,J)}),De.castShadow=De.receiveShadow=!0,g.add(De),y.push(H)}let ne=[];if(n.platforms&&n.platforms.length)for(let B of n.platforms){let H=B.w*i,K=dy(H,c,x),Z=new tt(K,c?fy(e):M);if(Z.position.set(B.x*i,-B.y*i,0),Z.castShadow=Z.receiveShadow=!0,g.add(Z),ne.push({mesh:Z,pl:B,w:H}),!c){let J=new tt(new ns(3.2,0),Ii(e.crystal,3.2));J.scale.set(1,2.2,1),J.position.set(B.x*i+H/2,-B.y*i-16,0),g.add(J),ne[ne.length-1].glow=J}if(B.belt){let J=py(H,B.belt);J.position.set(B.x*i,-B.y*i,0),g.add(J),ne[ne.length-1].belt=J}}let me=null;n.hasWater&&(me=Qf(n,e,f,l?-330:-700,t,i,xi)),me&&g.add(me.group);let fe=my(n,e,v,T,l,x,t);g.add(fe.group);let ge=[];for(let B of n.decors||[])if(B.type==="waterfall"){let H=ep(B,e,i);g.add(H.mesh),ge.push(H)}function Ye(B,H,K){for(let Z of y)Z.userData.uniforms&&(Z.userData.uniforms.uTime.value=B);for(let Z of ge)Z.mat.uniforms.uTime.value=B;fe.update(B);for(let Z of ne)Z.glow&&(Z.glow.rotation.y=B*1.5),Z.belt&&(Z.belt.material.map.offset.x=-B*Z.pl.belt*.9)}function ft(B){let H=ee.get(B);if(H==null)return null;let K=new it;De.getMatrixAt(H,K);let Z=new F().setFromMatrixPosition(K);return K.makeScale(0,0,0),De.setMatrixAt(H,K),De.instanceMatrix.needsUpdate=!0,ee.delete(B),Z}function k(){g.traverse(B=>{B.geometry&&B.geometry.dispose()});for(let B of y)B.dispose();m&&m.dispose(),me&&me.dispose(),fe.dispose()}return{group:g,update:Ye,removeCrate:ft,crateIndex:ee,dispose:k,fg:fe.fg,falls:ge,water:me,ground:v,ceil:T,enclosed:l,hasCeiling:a,sample:B=>A(v,B),floorAt:(B,H)=>oe(B,H,!0),material:M}}function cy(n,e){let t=n.attributes.position,i=n.attributes.color,s=n.index.array,r=new Map;for(let a=0;a<s.length;a+=3){let l=(t.getX(s[a])+t.getX(s[a+1])+t.getX(s[a+2]))/3,c=Math.floor(l/e);r.has(c)||r.set(c,[]),r.get(c).push(s[a],s[a+1],s[a+2])}let o=[];for(let a of r.values()){let l=new Map,c=[],h=[],u=[],f=[],d=n.attributes.normal;for(let x of a){let m=l.get(x);m==null&&(m=c.length/3,l.set(x,m),c.push(t.getX(x),t.getY(x),t.getZ(x)),h.push(i.getX(x),i.getY(x),i.getZ(x)),u.push(d.getX(x),d.getY(x),d.getZ(x))),f.push(m)}let g=new wt;g.setAttribute("position",new $e(c,3)),g.setAttribute("color",new $e(h,3)),g.setAttribute("normal",new $e(u,3)),g.setIndex(f),g.computeBoundingSphere(),o.push(g)}return n.dispose(),o}function hy(n){let e=[],t=n==="vaults"?3:5;for(let s=0;s<t;s++){let r=new dn(n==="vaults"?.5:.32,1,1,4),o=r.attributes.position;for(let a=0;a<o.count;a++){let l=o.getY(a)+.5;o.setXYZ(a,o.getX(a)*(1-l*.9),l,0)}r.rotateZ((s/(t-1)-.5)*(n==="vaults"?.4:.9)),r.rotateY(s*2.39),e.push(r)}let i=Bn(e);return e.forEach(s=>s.dispose()),i}function sr(){let n=new On(.55,1,.72,6,1,!1);n.translate(0,.36,0);let e=new ts(.55,.28,6,1);e.translate(0,.86,0);let t=Bn([n.toNonIndexed(),e.toNonIndexed()]);return t.computeVertexNormals(),t}function uy(n){let e=[],t=new Vt(n?20:18.5,n?20:18.5,n?60:22,1,1,1);e.push(t);let i=[.05,.05,.05];if(n)for(let r of[-6,6]){let o=new Vt(20.4,1.2,60.4);o.translate(0,r,0),e.push(o)}else{for(let[o,a,l,c,h]of[[19.5,2,23,0,8.5],[19.5,2,23,0,-8.5],[2,19.5,23,8.5,0],[2,19.5,23,-8.5,0]]){let u=new Vt(o,a,l);u.translate(c,h,0),e.push(u)}let r=new Vt(14,1.1,23.4);e.push(r)}let s=e.map((r,o)=>{let a=r.toNonIndexed(),l=new Float32Array(a.attributes.position.count*3),c=n&&o>0||!n&&o===e.length-1,h=o===0?[.9,.86,.8]:[.5,.5,.52];l.fill(0);for(let u=0;u<l.length;u+=3){let f=c?[1,1,1]:h;l[u]=f[0],l[u+1]=f[1],l[u+2]=f[2]}return a.setAttribute("color",new It(l,3)),a});return Bn(s)}function dy(n,e,t){if(e){let o=new Vt(n,7,44,Math.max(1,Math.round(n/10)),1,2);return o.translate(n/2,-3.5,-6),o}let i=new Vt(n,14,46,Math.max(2,Math.round(n/6)),4,6),s=i.attributes.position;for(let o=0;o<s.count;o++){let a=s.getX(o),l=s.getY(o),c=s.getZ(o),h=(7-l)/14,u=1-h*.35;a*=u,c*=u,l-=h*h*Mn(a*.08,c*.08,1,2)*10+h*4,l<6.5&&(a+=Mn(a*.1,l*.1,c*.1,2)*2.5,c+=Mn(a*.1+5,l*.1,c*.1,2)*2.5),s.setXYZ(o,a+n/2,l-7,c-6)}i.computeVertexNormals();let r=new Float32Array(s.count*3);for(let o=0;o<s.count;o++){let a=.65+.35*Math.min(1,Math.max(0,(s.getY(o)+14)/14));r[o*3]=r[o*3+1]=r[o*3+2]=a}return i.setAttribute("color",new It(r,3)),i}function fy(n){return new Kt({color:"#4a4648",metalness:.85,roughness:.38,emissive:new Pe(n.accent),emissiveIntensity:.05})}function py(n,e){let t=document.createElement("canvas");t.width=64,t.height=16;let i=t.getContext("2d");i.fillStyle="#1b1a1c",i.fillRect(0,0,64,16),i.fillStyle="#ff8a3c";for(let a=0;a<4;a++){let l=a*16+(e>0?2:12);i.beginPath(),i.moveTo(l,3),i.lineTo(l+(e>0?6:-6),8),i.lineTo(l,13),i.lineTo(l+(e>0?3:-3),8),i.fill()}let s=new Nr(t);s.wrapS=kn,s.repeat.set(n/16,1),s.colorSpace=pn;let r=new tt(new dn(n,30),new Kt({map:s,emissiveMap:s,emissive:new Pe("#ff7a2a"),emissiveIntensity:1.2,metalness:.3,roughness:.6}));r.rotation.x=-Math.PI/2,r.position.set(n/2,.3,-4);let o=new Yt;return o.add(r),o.material=r.material,o}function my(n,e,t,i,s,r,o){let a=rs,l=n.cols,c=new Yt,h=[],u=sr();h.push(u);let f=Ii(e.crystal,1.6);h.push(f);let d=Math.round(l*(o==="low"?.35:.7)),g=new an(u,f,d*4),x=new Ht,m=0,p=e.kind==="industrial";for(let v=0;v<d&&!p;v++){let T=r()*l*a,A=Math.floor(T/a),P=t[Math.max(0,Math.min(l-1,A))];if(P<-n.rows*a)continue;let C=-95-r()*260,w=P+0,b=2+Math.floor(r()*3),I=.5+r()*1.2*(1+(-C-80)/220);for(let L=0;L<b&&m<d*4;L++){let U=I*(.5+r()*.7);x.position.set(T+(r()-.5)*10*I,w-3,C+(r()-.5)*10*I),x.rotation.set((r()-.5)*.9,r()*6.28,(r()-.5)*.9),x.scale.set(3*U,(10+r()*14)*U,3*U),x.updateMatrix(),g.setMatrixAt(m++,x.matrix)}if(s&&r()<.45){let L=i[Math.max(0,Math.min(l-1,A))];if(L<100){x.position.set(T+7,L+2,C+20),x.rotation.set(Math.PI+(r()-.5)*.6,r()*6.28,0);let U=.8+r()*1.4;x.scale.set(3*U,(12+r()*16)*U,3*U),x.updateMatrix(),m<d*4&&g.setMatrixAt(m++,x.matrix)}}}g.count=m,g.castShadow=!1,m&&c.add(g);let M=null;if(e.key==="mesa"||e.key==="vaults"||e.key==="spire"){let v=hy(e.key);h.push(v);let T=e.key==="mesa"?"#b39a62":e.key==="vaults"?"#1f8a6a":"#6a2a5a",A=new Kt({color:T,roughness:.8,side:jt,emissive:new Pe(e.key==="mesa"?"#000":e.crystal),emissiveIntensity:e.key==="mesa"?0:.35}),P={uTime:{value:0}};A.onBeforeCompile=I=>{I.uniforms.uTime=P.uTime,I.vertexShader=I.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      vec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float w=sin(uTime*2.+ip.x*.05)*.35+sin(uTime*3.7+ip.x*.11)*.12;transformed.x+=w*position.y*position.y;`)},h.push(A);let C=Math.round(l*(o==="low"?2:6)),w=new an(v,A,C),b=0;for(let I=0;I<C;I++){let L=r()*l*a,U=Math.floor(L/a),V=t[Math.max(0,Math.min(l-1,U))];if(V<-n.rows*a)continue;let Y=r()<.5?-40-r()*30:-75-r()*90;x.position.set(L,V+.5,Y),x.rotation.set(0,r()*6.28,(r()-.5)*.4);let O=.7+r()*1.1;x.scale.set(O*3,(e.key==="vaults"?14:6)*O+r()*4,O*3),x.updateMatrix(),w.setMatrixAt(b++,x.matrix)}w.count=b,c.add(w),M=P}if(p){let v=new On(2.2,2.2,1,10);v.rotateZ(Math.PI/2),h.push(v);let T=new Kt({color:"#7a6e66",metalness:.9,roughness:.3});h.push(T);let A=new Vt(1,1.1,1.4);h.push(A);let P=new Kt({color:"#000",emissive:new Pe(e.accent),emissiveIntensity:1.5});h.push(P);let C=new an(v,T,l),w=new an(A,P,l*2),b=0,I=0;for(let L=0;L<l;){let U=L,V=t[L];for(;U<l&&t[U]===V;)U++;if(V>-n.rows*a){let Y=(U-L)*a;x.position.set(L*a+Y/2,V-14,xi+2.5),x.rotation.set(0,0,0),x.scale.set(Y,1,1),x.updateMatrix(),C.setMatrixAt(b++,x.matrix),x.position.set(L*a+Y/2,V-1.5,xi+.6),x.scale.set(Y-4,1,1),x.updateMatrix(),w.setMatrixAt(I++,x.matrix)}L=U}C.count=b,w.count=I,C.castShadow=!0,c.add(C,w)}{let v=new Ri(1,1),T=v.attributes.position;for(let I=0;I<T.count;I++){let L=1+Mn(T.getX(I)*2,T.getY(I)*2,T.getZ(I)*2,2)*.35;T.setXYZ(I,T.getX(I)*L,T.getY(I)*L*.6,T.getZ(I)*L)}v.computeVertexNormals();let A=new Float32Array(T.count*3).fill(.85);v.setAttribute("color",new It(A,3)),h.push(v);let P=p?new Kt({color:"#3a3638",metalness:.8,roughness:.45}):ir(e,{bump:1});h.push(P);let C=Math.round(l*(o==="low"?1.2:3.5)),w=new an(v,P,C),b=0;for(let I=0;I<C;I++){let L=r()*l*a,U=Math.floor(L/a),V=t[Math.max(0,Math.min(l-1,U))];if(V<-n.rows*a)continue;let Y=r()<.35?xi-6-r()*14:-30-r()*120,O=(Y>0?.8:1)*(.8+r()*r()*3.2)*(p?.8:1);x.position.set(L,V+O*.2,Y),x.rotation.set(r()*.4,r()*6.28,r()*.4),x.scale.set(O*1.3,O,O),x.updateMatrix(),w.setMatrixAt(b++,x.matrix)}w.count=b,w.castShadow=!0,w.receiveShadow=!0,c.add(w)}let y=[];{let v=sr();h.push(v);let T=p?new Kt({color:"#1c1a1c",metalness:.8,roughness:.5}):Ii(e.crystal,1.1);h.push(T);let A=new On(1,1,1,12);h.push(A);for(let P=180;P<l*a;P+=260+r()*420){let C=Math.floor(P/a),w=t[Math.max(0,Math.min(l-1,C))];if(w<-n.rows*a)continue;let b=new Yt,I=70+r()*90;if(p)for(let L=0;L<2;L++){let U=new tt(A,T);U.scale.set(7+r()*5,200,7+r()*5),U.position.set(L*22,w-130-r()*30,0),b.add(U)}else for(let L=0;L<3;L++){let U=new tt(v,T),V=.6+r()*.8;U.scale.set(7*V,(34+r()*36)*V,7*V),U.position.set((r()-.5)*34,w-125+r()*30,(r()-.5)*20),U.rotation.set((r()-.5)*.7,r()*6,(r()-.5)*.7),b.add(U)}b.position.set(P,0,I),c.add(b),y.push(b)}}return{group:c,fg:y,update(v){M&&(M.uTime.value=v)},dispose(){h.forEach(v=>v.dispose())}}}var li=n=>new Pe(n);function np(n,e,t,i){let r=n.cols*20,o=n.rows*20,a=new Yt,l=new Yt,c=[],h=[],u=Vc(n.world*77+n.stageIndex*5+3),f=new F(...e.sun.dir).normalize(),d={uZenith:{value:li(e.sky.zenith)},uMid:{value:li(e.sky.mid)},uHorizon:{value:li(e.sky.horizon)},uGlow:{value:li(e.sky.glow)},uSun:{value:f.clone().setZ(-Math.abs(f.z))},uStars:{value:e.sky.stars},uTime:{value:0},uNebula:{value:e.key==="rift"||e.key==="spire"?1:0}},g=new gt({uniforms:d,side:gn,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vD;void main(){vD=normalize(position);vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_Position.z=gl_Position.w;}",fragmentShader:`varying vec3 vD;uniform vec3 uZenith,uMid,uHorizon,uGlow,uSun;uniform float uStars,uTime,uNebula;${Pi}
      float star(vec3 d){vec3 p=d*260.;vec3 i=floor(p);float h=fract(sin(dot(i,vec3(127.1,311.7,74.7)))*43758.5);vec3 f=fract(p)-.5;float s=step(.985,h)*smoothstep(.12,0.,length(f));return s*(.5+.5*sin(uTime*2.+h*90.));}
      void main(){vec3 d=normalize(vD);float y=d.y;
        vec3 c=mix(uHorizon,uMid,smoothstep(-.02,.14,y));c=mix(c,uZenith,smoothstep(.12,.6,y));
        c=mix(c,uHorizon*.55,smoothstep(.0,-.25,y));
        float sd=max(dot(d,normalize(uSun)),0.);c+=uGlow*pow(sd,6.)*.55+uGlow*pow(sd,60.)*1.2+vec3(1.,.95,.85)*smoothstep(.9993,.9997,sd)*6.;
        if(uNebula>.5){vec2 q=d.xy/(abs(d.z)+.6)*2.3;float n=fbm(q+vec2(0.,uTime*.003))*fbm(q*2.1+7.);c+=uGlow*pow(n,2.2)*.9*smoothstep(-.1,.5,y);}
        c+=vec3(.9,.95,1.)*star(d)*uStars*smoothstep(.05,.4,y)*2.;
        gl_FragColor=vec4(c,1.);}`}),x=new tt(new Jn(9e3,48,24),g);if(x.renderOrder=-10,x.frustumCulled=!1,l.add(x),h.push(g,x.geometry),e.planet&&!e.enclosed){let y=e.planet,v={uColor:{value:li(y.color)},uBand:{value:li(y.band)},uSun:{value:f},uGlow:{value:li(e.sky.glow)}},T=new gt({uniforms:v,fog:!1,vertexShader:"varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vN;varying vec3 vP;uniform vec3 uColor,uBand,uSun,uGlow;${Pi}
        void main(){float lat=vP.y/length(vP);float b=fbm(vec2(lat*9.,lat*3.+fbm(vec2(vP.x*.002,lat*4.))*1.5));vec3 c=mix(uColor,uBand,smoothstep(.35,.7,b));
        vec3 L=normalize(vec3(-.6,.5,.6));float l=smoothstep(-.15,.6,dot(vN,L));float rim=pow(1.-max(vN.z,0.),3.);
        gl_FragColor=vec4(c*(l*1.05+.16)+uGlow*rim*.7*l+uGlow*rim*.22,1.);}`}),A=new tt(new Jn(y.r,64,32),T);if(A.position.set(...y.pos),l.add(A),h.push(T,A.geometry),y.ring){let C=new Ws(y.r*1.35,y.r*2.3,128,1),w={uColor:{value:li(y.ring)},uIn:{value:y.r*1.35},uOut:{value:y.r*2.3}},b=new gt({uniforms:w,transparent:!0,side:jt,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vP;uniform vec3 uColor;uniform float uIn,uOut;float h(float x){return fract(sin(x*91.7)*43758.5);}
          void main(){float t=(length(vP.xy)-uIn)/(uOut-uIn);float bands=.55+.45*sin(t*90.)*sin(t*23.+1.)+.25*(h(floor(t*140.))-.5);float a=smoothstep(0.,.05,t)*smoothstep(1.,.85,t)*clamp(bands,0.,1.);
          float shadow=vP.y<0.&&abs(vP.x)<uIn*.75?.25:1.;gl_FragColor=vec4(uColor*(.6+bands*.5)*shadow,a*.7);}`}),I=new tt(C,b);I.position.copy(A.position),I.rotation.set(-1.25,.3,.35),l.add(I),h.push(b,C)}let P=new tt(new Jn(y.r*.12,32,16),new on({color:li(y.color).multiplyScalar(.7),fog:!1}));P.position.set(y.pos[0]+y.r*2.8,y.pos[1]-y.r*.4,y.pos[2]+400),l.add(P),h.push(P.geometry,P.material)}if(!e.enclosed){let y=ir(e,{strata:e.key==="mesa"?1.4:.6,bump:1.2});h.push(y);let v=[],T=i==="low"?22:46;for(let U=0;U<T;U++){let V=-1100-u()*2800,Y=-1500+u()*(r+3e3),O=(e.key==="mesa"?260:420)+u()*(e.key==="mesa"?700:900),W=120+u()*360,X=new On(W*(.7+u()*.25),W,O,28,10,!1),j=X.attributes.position,oe=u()*100;for(let Se=0;Se<j.count;Se++){let Ne=j.getX(Se),ke=j.getY(Se),De=j.getZ(Se),ee=Math.atan2(De,Ne),ne=(ke+O/2)/O,me=Math.hypot(Ne,De);if(me>1){let fe=e.key==="mesa"?Math.floor(ne*6+Mn(ee,oe,0,2)*1.2)/6:ne;me*=1+Mn(Math.cos(ee)*2,Math.sin(ee)*2,ne*3+oe,3)*.35-fe*.18,Ne=Math.cos(ee)*me,De=Math.sin(ee)*me}ne>.99&&(ke+=Mn(Ne*.01,De*.01,oe,2)*14),j.setXYZ(Se,Ne+Y,ke+O/2-o-60+u()*0,De+V)}X.computeVertexNormals();let pe=new Float32Array(j.count*3).fill(1);X.setAttribute("color",new It(pe,3)),X.deleteAttribute("uv"),v.push(X)}let A=new tt(Bn(v),y);a.add(A),h.push(A.geometry);let P=sr(),C=Ii(e.crystal,1.4);h.push(P,C);let w=new an(P,C,40),b=new Ht;for(let U=0;U<40;U++){b.position.set(-800+u()*(r+1600),-o-40+u()*120,-500-u()*2500),b.rotation.set((u()-.5)*.5,u()*6,(u()-.5)*.5);let V=.5+u()*1.1;b.scale.set(16*V,(90+u()*200)*V,16*V),b.updateMatrix(),w.setMatrixAt(U,b.matrix)}a.add(w);let I={uTime:{value:0},uColor:{value:li(e.sky.horizon).lerp(li("#ffffff"),.25)},uShade:{value:li(e.sky.mid)}},L=new gt({uniforms:I,transparent:!0,depthWrite:!1,fog:!1,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;uniform vec3 uColor,uShade;${Pi}
        void main(){vec2 p=vUv*vec2(6.,1.6)+vec2(uTime*.01,0.);float n=fbm(p)*1.1+fbm(p*2.7+3.)*.35;float a=smoothstep(.55,.95,n)*smoothstep(0.,.3,vUv.y)*smoothstep(1.,.6,vUv.y)*smoothstep(0.,.1,vUv.x)*smoothstep(1.,.9,vUv.x);
        gl_FragColor=vec4(mix(uShade,uColor,smoothstep(.5,1.1,n+vUv.y*.3)),a*.8);}`});h.push(L);for(let U=0;U<4;U++){let V=new tt(new dn(9e3,1400),L);V.position.set(r/2,-o+500+U*380,-3800-U*500),l.add(V),h.push(V.geometry)}c.push(U=>I.uTime.value=U)}let m={uTime:{value:0},uColor:{value:li(e.key==="foundry"?"#ffb070":e.key==="spire"?"#d7a0ff":"#7ff0e0")}};if(e.enclosed){let y=new gt({uniforms:m,transparent:!0,depthWrite:!1,blending:An,side:jt,fog:!1,vertexShader:"varying vec2 vUv;varying float vF;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vF=clamp(-p.z/1600.,0.,1.);gl_Position=projectionMatrix*p;}",fragmentShader:`varying vec2 vUv;varying float vF;uniform float uTime;uniform vec3 uColor;${Pi}
        void main(){float n=fbm(vec2(vUv.x*5.+uTime*.05,vUv.y*1.5-uTime*.12));float a=smoothstep(0.,.35,vUv.x)*smoothstep(1.,.65,vUv.x)*pow(vUv.y,1.4)*(.45+n*.8);
        gl_FragColor=vec4(uColor*a*.16*(1.-vF*.5),1.);}`});h.push(y);let v=i==="low"?10:24;for(let T=0;T<v;T++){let A=u()*r,P=Math.min(n.cols-1,Math.max(0,Math.floor(A/20))),C=t.ceil[P]<100?t.ceil[P]:0,w=t.ground[P]>-o?t.ground[P]:-o,b=Math.max(80,C-w+40),I=30+u()*70,L=new tt(new dn(I,b,1,1),y);L.position.set(A,w+b/2-10,-120-u()*160),L.rotation.set(0,(u()-.5)*.6,(u()-.5)*.35),a.add(L),h.push(L.geometry)}c.push(T=>m.uTime.value=T)}if(e.key==="vaults"||e.key==="spire"){let y=new ts(1,1,7,3);y.translate(0,-.5,0);let v=y.attributes.position;for(let U=0;U<v.count;U++)v.setX(U,v.getX(U)+Mn(v.getY(U)*3,U*.1,0,2)*.12);y.computeVertexNormals();let T=ir(e,{bump:1.5});h.push(y,T);let A=Math.round(n.cols*.8),P=new an(y,T,A),C=new Ht,w=0;for(let U=0;U<A;U++){let V=u()*r,Y=Math.floor(V/20),O=t.ceil[Math.max(0,Math.min(n.cols-1,Y))];if(O>=100)continue;let W=-80-u()*240;C.position.set(V,O+6,W),C.rotation.set((u()-.5)*.2,u()*6,(u()-.5)*.2);let X=.6+u()*1.4;C.scale.set(7*X,(26+u()*50)*X,7*X),C.updateMatrix(),P.setMatrixAt(w++,C.matrix)}P.count=w,a.add(P);let b=sr(),I=Ii(e.crystal,1.5);h.push(b,I);let L=new an(b,I,60);w=0;for(let U=0;U<60;U++){let V=u()*r,Y=Math.floor(V/20),O=t.ground[Math.max(0,Math.min(n.cols-1,Y))];if(O<-o)continue;let W=-200-u()*120;C.position.set(V,O-8+u()*20,W),C.rotation.set((u()-.5)*.8,u()*6,(u()-.5)*.8);let X=.8+u()*2;C.scale.set(12*X,(40+u()*90)*X,12*X),C.updateMatrix(),L.setMatrixAt(w++,C.matrix)}L.count=w,a.add(L)}if(e.key==="foundry"){let y=new Kt({color:"#4a4446",metalness:.85,roughness:.42}),v=new Kt({color:"#221e20",metalness:.7,roughness:.55});h.push(y,v);let T=[],A=[],P=[];for(let j=-400;j<r+400;j+=140+u()*60){let oe=-150-u()*120,pe=-o+40,Se=o+300,Ne=new Vt(26+u()*18,Se,26+u()*18);if(Ne.translate(j,pe+Se/2-60,oe),T.push(Ne),u()<.6){let ke=new Vt(150,10,8);ke.translate(j+70,-60-u()*200,oe+10),A.push(ke);let De=new Vt(150,3,10);De.rotateZ(.5),De.translate(j+70,-120-u()*120,oe+12),A.push(De)}if(u()<.3){let ke=t.floorAt(j+65,oe+16)+18,De=new dn(36,22);De.translate(j+65,ke+13,oe+17.5),P.push(De);let ee=new Vt(64,46,14);ee.translate(j+65,ke+20,oe+10),T.push(ee)}}if(a.add(new tt(Bn(T),y),new tt(Bn(A),v)),h.push(...T,...A),P.length){let j={uTime:{value:0}},oe=new gt({uniforms:j,fog:!1,vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vP;varying vec3 vN;uniform float uTime;${Pi}void main(){float n=fbm(vec2(vP.x*.05,vP.y*.08-uTime*.8));float f=.75+.25*sin(uTime*7.+vP.x*.1);
          vec3 c=mix(vec3(.5,.06,0.),vec3(2.6,.9,.2),n*f);vec2 fp=fract(vP.xy/vec2(44.,30.));c*=mix(1.,.06,step(.78,fract(vP.x*.2)));c*=.35+.65*smoothstep(.9,.1,fp.y);gl_FragColor=vec4(c,1.);}`});h.push(oe),a.add(new tt(Bn(P),oe)),c.push(pe=>j.uTime.value=pe)}let C=new On(60,60,10,24,1);C.rotateX(Math.PI/2),h.push(C);for(let j=0;j<Math.ceil(r/700);j++){let oe=new Yt,pe=new tt(C,v);oe.add(pe);for(let Ne=0;Ne<12;Ne++){let ke=new tt(new Vt(14,18,10),v),De=Ne/12*Math.PI*2;ke.position.set(Math.cos(De)*64,Math.sin(De)*64,0),ke.rotation.z=De,oe.add(ke)}oe.position.set(300+j*700+u()*200,-80-u()*120,-260);let Se=(u()<.5?-1:1)*(.2+u()*.3);a.add(oe),c.push(Ne=>oe.rotation.z=Ne*Se)}let w={uTime:{value:0}},b=new gt({uniforms:w,fog:!1,vertexShader:"varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:`varying vec3 vW;uniform float uTime;${Pi}void main(){vec2 p=vW.xz*.012+vec2(uTime*.06,0.);float n=fbm(p+fbm(p*1.7+uTime*.03));
        vec3 c=mix(vec3(.25,.03,0.),vec3(4.,1.2,.25),smoothstep(.35,.85,n));c+=vec3(5.,2.,.6)*smoothstep(.82,.95,n);gl_FragColor=vec4(c,1.);}`});h.push(b);let I=[];for(let j=-400;j<=r+400;j+=20){let oe=t.floorAt(j,-225)+1.2;I.push(j,oe,-205,j,oe,-245)}let L=new wt;L.setAttribute("position",new $e(I,3));let U=[];for(let j=0;j<I.length/6-1;j++){let oe=j*2;U.push(oe,oe+1,oe+2,oe+1,oe+3,oe+2)}L.setIndex(U);let V=new tt(L,b);a.add(V),h.push(L),c.push(j=>w.uTime.value=j);let Y=new Vt(1,5,4);h.push(Y);let O=new an(Y,y,Math.ceil((r+800)/40)*2+4),W=new Ht,X=0;for(let j=-400;j<=r+400;j+=40){let oe=t.floorAt(j,-225);for(let pe of[-203,-247])W.position.set(j,oe+1,pe),W.scale.set(40,1,1),W.updateMatrix(),O.setMatrixAt(X++,W.matrix)}O.count=X,a.add(O)}if(e.key==="spire"){let y=sr(),v=Ii(e.crystal,1.2);h.push(y,v);let T=new an(y,v,26),A=new Ht;for(let P=0;P<26;P++){A.position.set(u()*r,-o-60,-190-u()*130),A.rotation.set((u()-.5)*.25,u()*6,(u()-.5)*.25);let C=1+u()*1.2;A.scale.set(13*C,(o+160)*C*.7,13*C),A.updateMatrix(),T.setMatrixAt(P,A.matrix)}a.add(T),c.push(P=>{v.emissiveIntensity=1.6+Math.sin(P*1.3)*.5})}if(e.key==="rift"){let y=Bc(new Ri(1,3)),v=y.attributes.position;for(let b=0;b<v.count;b++){let I=new F().fromBufferAttribute(v,b);I.multiplyScalar(1+Mn(I.x*2,I.y*2,I.z*2,3)*.45),I.y*=.6,v.setXYZ(b,I.x,I.y,I.z)}y.computeVertexNormals();let T=ir(e,{bump:1.2}),A=new Float32Array(v.count*3).fill(1);y.setAttribute("color",new It(A,3)),h.push(y,T);let P=new an(y,T,60),C=new Ht,w=[];for(let b=0;b<60;b++){let I=-320-u()*1600,L=(10+u()*28)*(1+(-I-320)/800);w.push({x:u()*r,y:-u()*o*1.2+60,z:I,s:L,sp:u()*6})}a.add(P),c.push(b=>{w.forEach((I,L)=>{C.position.set(I.x,I.y+Math.sin(b*.4+I.sp)*10,I.z),C.rotation.set(I.sp,b*.05+I.sp,0),C.scale.setScalar(I.s),C.updateMatrix(),P.setMatrixAt(L,C.matrix)}),P.instanceMatrix.needsUpdate=!0})}function p(y,v){l.position.copy(v.position),d.uTime.value=y;for(let T of c)T(y)}function M(){h.forEach(y=>y.dispose&&y.dispose())}return{group:a,sky:l,update:p,dispose:M}}var gy=new Pe,Wc=class{constructor(e,t){this.max=e,this.head=0,this.time=0,this.dirtyMin=1/0,this.dirtyMax=-1;let i=new ia;i.setAttribute("position",new $e([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);let s=o=>{let a=new fs(new Float32Array(e*o),o);return a.setUsage(Gr),a};this.aPos=s(3),this.aVel=s(3),this.aCol=s(4),this.aT=s(4),this.aPh=s(4),i.setAttribute("aPos",this.aPos),i.setAttribute("aVel",this.aVel),i.setAttribute("aCol",this.aCol),i.setAttribute("aT",this.aT),i.setAttribute("aPh",this.aPh),i.instanceCount=e;for(let o=0;o<e;o++)this.aT.array[o*4]=-1e6,this.aT.array[o*4+1]=.001;let r=t==="smoke";this.uniforms={uTime:{value:0},uLight:{value:new Pe(1,1,1)},uAmbient:{value:new Pe(.4,.4,.45)}},this.material=new gt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:r?Ki:An,vertexShader:`attribute vec3 aPos,aVel;attribute vec4 aCol,aT,aPh;uniform float uTime;varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;
        void main(){float age=uTime-aT.x;float life=aT.y;if(age<0.||age>life){gl_Position=vec4(2.,2.,2.,1.);return;}
          float k=max(aPh.y,.0001);float e=1.-exp(-k*age);vec3 p=aPos+aVel*e/k;p.y+=aPh.x*(age/k-e/(k*k));
          float t=age/life;float size=mix(aT.z,aT.w,t);
          vec4 mv=modelViewMatrix*vec4(p,1.);vec2 q=position.xy;
          if(aPh.z>0.){vec3 v=aVel*exp(-k*age);v.y+=aPh.x*e/k;vec3 vv=(modelViewMatrix*vec4(v,0.)).xyz;vec2 dir=length(vv.xy)>.001?normalize(vv.xy):vec2(1.,0.);
            float stretch=1.+length(vv.xy)*aPh.z;vec2 side=vec2(-dir.y,dir.x);mv.xy+=dir*q.x*size*stretch+side*q.y*size*.35;}
          else{float a=aPh.w*age+aT.x*7.;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));mv.xy+=R*q*size;}
          gl_Position=projectionMatrix*mv;vUv=q;vAge=t;vSeed=fract(aT.x*13.7);
          float fade=${r?"smoothstep(0.,.15,t)*(1.-smoothstep(.45,1.,t))":"pow(1.-t,1.4)"};vCol=vec4(aCol.rgb,aCol.a*fade);}`,fragmentShader:`varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;uniform vec3 uLight,uAmbient;${Pi}
        void main(){float d=length(vUv);if(d>1.)discard;
          ${r?"float n=fbm(vUv*1.7+vSeed*9.+vAge*.8);float a=smoothstep(1.,.25,d+n*.45-.2)*vCol.a;vec3 c=vCol.rgb*(uAmbient+uLight*clamp(.55-vUv.y*.5+n*.3,0.,1.));gl_FragColor=vec4(c,a);":"float a=pow(max(0.,1.-d),2.2);gl_FragColor=vec4(vCol.rgb*vCol.a*a,1.);"}}`}),this.mesh=new tt(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=r?4:5}emit(e,t,i,s,r,o,a,l,c,h,u,f,d,g=0,x=0,m=0,p=0,M=0){let y=this.head;this.head=(this.head+1)%this.max,this.aPos.array.set([e,t,i],y*3),this.aVel.array.set([s,r,o],y*3),this.aCol.array.set([a,l,c,h],y*4),this.aT.array.set([this.time+M,u,f,d],y*4),this.aPh.array.set([g,x,m,p],y*4),y<this.dirtyMin&&(this.dirtyMin=y),y>this.dirtyMax&&(this.dirtyMax=y)}update(e){if(this.time=e,this.uniforms.uTime.value=e,this.dirtyMax>=0){let t=this.dirtyMin,i=this.dirtyMax-t+1;for(let[s,r]of[[this.aPos,3],[this.aVel,3],[this.aCol,4],[this.aT,4],[this.aPh,4]])s.clearUpdateRanges(),s.addUpdateRange(t*r,i*r),s.needsUpdate=!0;this.dirtyMin=1/0,this.dirtyMax=-1}}clear(){for(let e=0;e<this.max;e++)this.aT.array[e*4]=-1e6;this.aT.needsUpdate=!0,this.aT.clearUpdateRanges()}};function ip(n,e){let t=e==="low",i=new Wc(t?2500:7e3,"add"),s=new Wc(t?500:1400,"smoke");n.add(i.mesh,s.mesh);let r=Math.random,o=new Ri(1,0);{let ie=o.attributes.position;for(let ae=0;ae<ie.count;ae++)ie.setXYZ(ae,ie.getX(ae)*(.7+ae*37%11/22),ie.getY(ae)*.7,ie.getZ(ae));o.computeVertexNormals()}let a=new Kt({roughness:.7,metalness:.25}),l=t?120:320,c=new an(o,a,l);c.instanceMatrix.setUsage(Gr),c.castShadow=!0,c.count=0,c.setColorAt(0,new Pe),n.add(c);let h=[],u=new Ht,f=new Kt({color:"#000",emissive:new Pe("#ff7a2a"),emissiveIntensity:4}),d=new an(o,f,t?40:120);d.count=0,d.instanceMatrix.setUsage(Gr),n.add(d);let g=[],x=new Bs(1,1,3,8),m=new on({color:16777215,toneMapped:!1}),p=320,M=new an(x,m,p);M.instanceMatrix.setUsage(Gr),M.setColorAt(0,new Pe),M.count=0,M.frustumCulled=!1,n.add(M);let y=new gt({uniforms:{uColor:{value:new Pe},uA:{value:1}},transparent:!0,depthWrite:!1,blending:An,side:jt,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec2 vUv;uniform vec3 uColor;uniform float uA;void main(){float d=abs(vUv.y-.5)*2.;float a=pow(1.-d,3.)*uA;gl_FragColor=vec4(uColor*a*2.,1.);}"}),v=new Ws(.82,1,64,1);{let ie=v.attributes.uv,ae=v.attributes.position;for(let R=0;R<ae.count;R++){let S=Math.hypot(ae.getX(R),ae.getY(R));ie.setXY(R,0,(S-.82)/.18)}}let T=[],A={uTime:{value:0},uColor:{value:new Pe("#6cf3ff")},uLen:{value:240}},P=new gt({uniforms:A,transparent:!0,depthWrite:!1,blending:An,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uLen;uniform vec3 uColor;${Pi}
      void main(){float x=vUv.x*uLen;float w=abs(vUv.y-.5)*2.;float n=fbm(vec2(x*.05-uTime*14.,vUv.y*3.+uTime*3.));
        float edge=.35+.45*n;float core=smoothstep(.22,0.,w);float body=smoothstep(edge,edge*.3,w);float flick=.85+.15*sin(uTime*90.+x*.3);
        float tip=smoothstep(0.,.04,vUv.x)*(1.-smoothstep(.96,1.,vUv.x)*.5);
        vec3 c=(uColor*body*1.15+vec3(1.)*core*1.7)*flick*tip;gl_FragColor=vec4(c,1.);}`}),C=new tt(new dn(1,1,1,1),P);C.geometry.translate(.5,0,0),C.visible=!1,C.renderOrder=6,n.add(C);let w=4,b=22,I=new wt;I.setAttribute("position",new It(new Float32Array(w*b*2*3*3),3));let L=new on({color:new Pe("#9ff8ff").multiplyScalar(2.2),transparent:!0,blending:An,depthWrite:!1,toneMapped:!1}),U=new tt(I,L);U.frustumCulled=!1,U.visible=!1,U.renderOrder=6,n.add(U);let V={uTime:{value:0}},Y=new gt({uniforms:V,transparent:!0,depthWrite:!1,blending:An,side:jt,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;${Pi}void main(){float x=abs(vUv.x-.5)*2.;float n=fbm(vec2(vUv.x*4.,vUv.y*9.-uTime*6.));
      float a=smoothstep(.55+n*.4,0.,x);float core=smoothstep(.12,0.,abs(x-n*.15));vec3 c=vec3(.4,1.,.85)*a*1.4+vec3(1.)*core*2.;gl_FragColor=vec4(c,1.);}`}),O=[],W=t?4:e==="ultra"?12:8,X=[];for(let ie=0;ie<W;ie++){let ae=new na(16777215,0,160,1.6);ae.castShadow=!1,n.add(ae),X.push(ae)}let j=[],oe=[];function pe(ie,ae,R,S,N,$){j.push({x:ie,y:ae,z:R,color:S,intensity:N,distance:$})}function Se(ie,ae,R,S,N,$){oe.push({x:ie,y:ae,color:new Pe(R),intensity:S,distance:N,life:$,age:0})}let Ne=0,ke=ie=>{Ne=Math.min(1.6,Ne+ie)};function De(ie){return gy.set(ie)}function ee(ie,ae,R,S=12,N=180,$={}){let z=De(R);for(let G=0;G<S;G++){let be=r()*Math.PI*2,ve=N*(.3+r()*.9),we=(r()-.5)*N*.8;i.emit(ie,-ae,$.z??4,Math.cos(be)*ve,Math.sin(be)*ve+($.up||0),we,z.r*1.6,z.g*1.6,z.b*1.6,1,.18+r()*.35*($.life||1),1.1+r()*.8,.2,$.grav??-420,3,.018,0)}}function ne(ie,ae,R,S=6,N=12,$={}){let z=De(R);for(let G=0;G<S;G++){let be=r()*Math.PI*2,ve=($.speed||30)*(.3+r());s.emit(ie+(r()-.5)*6,-ae+(r()-.5)*6,($.z??0)+(r()-.5)*14,Math.cos(be)*ve,Math.sin(be)*ve*.6+($.rise??22),(r()-.5)*20,z.r,z.g,z.b,$.alpha??.55,($.life||1.2)*(.7+r()*.6),N*(.6+r()*.4),N*(2+r()*1.4),$.grav??30,1.4,0,0)}}function me(ie,ae,R,S,N,$=6,z=1.5){let G=De(R);i.emit(ie,-ae,$,0,0,0,G.r*z,G.g*z,G.b*z,1,N,S,S*1.6,0,1,0,0)}function fe(ie,ae,R,S,N,$={}){let z=new tt(v,y.clone());z.material.uniforms.uColor.value.set(R),z.position.set(ie,-ae,$.z??8),$.flat&&(z.rotation.x=-Math.PI/2),n.add(z),T.push({m:z,radius:S,life:N,age:0,start:$.start||2})}function ge(ie,ae,R,S,N=160,$=2.2,z=0){let G=new Pe(R);for(let be=0;be<S;be++){let ve=r()*Math.PI*2,we=N*(.35+r()*.8),Me=r()<z,ye={x:ie,y:-ae,z:(r()-.5)*20,vx:Math.cos(ve)*we,vy:Math.abs(Math.sin(ve))*we*1.1+60,vz:(r()-.5)*we*.6,rx:r()*6,ry:r()*6,wr:(r()-.5)*14,s:$*(.5+r()),life:1.6+r()*1.4,age:0,c:G.clone().multiplyScalar(.6+r()*.5)};Me?g.length<d.instanceMatrix.count&&g.push(ye):h.length<l&&h.push(ye)}}function Ye(ie,ae,R=1,S){let N=R;me(ie,ae,"#ffd9a0",26*N,.22,10,2.4),me(ie,ae,"#ff8a3c",40*N,.4,8,1.4);for(let $=0;$<Math.round(14*N);$++){let z=r()*Math.PI*2,G=(60+r()*120)*N,be=De(r()<.5?"#ffb050":"#ff5a1e");i.emit(ie,-ae,(r()-.5)*20,Math.cos(z)*G,Math.sin(z)*G,(r()-.5)*G,be.r*2,be.g*2,be.b*2,1,.35+r()*.3,(7+r()*6)*N,(16+r()*10)*N,40,4,0,1.5)}ee(ie,ae,"#ffd08a",Math.round(26*N),260*N,{grav:-520}),ne(ie,ae,S&&S.key==="vaults"?"#3a5458":"#3a3230",Math.round(7*N),11*N,{life:1.6,speed:45*N,rise:30,alpha:.6}),ge(ie,ae,S?S.rock.base:"#6a5a50",Math.round(7*N),190*N,2.2*Math.sqrt(N),.25),N>=1.4&&fe(ie,ae,"#ffb070",70*N,.45),Se(ie,ae,"#ffa050",9*N,170*N,.32+.1*N),ke(.25*N)}function ft(ie,ae,R,S,N){i.update(ae),s.update(ae);let $=(z,G,be)=>{let ve=0;for(let we=z.length-1;we>=0;we--){let Me=z[we];if(Me.age+=ie,Me.age>Me.life){z.splice(we,1);continue}Me.vy-=640*ie;let ye=Me.x+Me.vx*ie,Fe=Me.y+Me.vy*ie;N(ye,-Fe)?N(Me.x,-Fe)?(Me.vy*=-.38,Me.vx*=.7,Me.wr*=.6):Me.vx*=-.5:(Me.x=ye,Me.y=Fe),Me.z+=Me.vz*ie,Me.vz*=.98,Me.rx+=Me.wr*ie,Me.ry+=Me.wr*.7*ie}z.forEach((we,Me)=>{let ye=1-Math.max(0,(we.age-we.life+.4)/.4);u.position.set(we.x,we.y,we.z),u.rotation.set(we.rx,we.ry,0),u.scale.setScalar(we.s*ye),u.updateMatrix(),G.setMatrixAt(Me,u.matrix),be&&G.setColorAt(Me,we.c)}),G.count=z.length,G.instanceMatrix.needsUpdate=!0,be&&G.instanceColor&&(G.instanceColor.needsUpdate=!0)};$(h,c,!0),$(g,d,!1);for(let z=g.length-1;z>=0;z--)r()<ie*20&&i.emit(g[z].x,g[z].y,g[z].z,0,10,0,1.6,.6,.2,1,.25,1.6,.4,0,1,0,0);for(let z=T.length-1;z>=0;z--){let G=T[z];G.age+=ie;let be=G.age/G.life;if(be>=1){n.remove(G.m),G.m.material.dispose(),T.splice(z,1);continue}G.m.scale.setScalar(G.start+be*G.radius),G.m.material.uniforms.uA.value=(1-be)*(1-be)}for(let z=O.length-1;z>=0;z--){let G=O[z];G.age+=ie,G.age>G.life&&(n.remove(G.m),G.m.geometry.dispose(),O.splice(z,1))}V.uTime.value=ae,A.uTime.value=ae;for(let z=oe.length-1;z>=0;z--){let G=oe[z];if(G.age+=ie,G.age>G.life){oe.splice(z,1);continue}let be=1-G.age/G.life;j.push({x:G.x,y:-G.y,z:30,color:G.color,intensity:G.intensity*be*be,distance:G.distance})}j.sort((z,G)=>G.intensity/(1+Math.abs(G.x-S.x)*.004)-z.intensity/(1+Math.abs(z.x-S.x)*.004));for(let z=0;z<W;z++){let G=X[z],be=j[z];be?(G.position.set(be.x,be.y,be.z),G.color.set(be.color),G.intensity=be.intensity*1500,G.distance=be.distance*2.2):G.intensity=0}j=[],Ne=Math.max(0,Ne-ie*2.2)}let k=new Ht,B=new F(0,1,0),H=new F;function K(ie,ae,R){let S=0,N=new Pe,$=(z,G,be,ve,we,Me,ye,Fe)=>{S>=p||(k.position.set(z,-G,4),H.set(be||1,-(ve||0),0).normalize(),k.quaternion.setFromUnitVectors(B,H),k.scale.set(Me,we,Me),k.updateMatrix(),M.setMatrixAt(S,k.matrix),N.set(ye).multiplyScalar(Fe),M.setColorAt(S,N),S++)};for(let z of ie.pshots)if(!(z.life<=0||z.x<ae-40||z.x>ae+R+40))if(z.kind==="bounce")$(z.x,z.y,z.vx,z.vy,2.6,2.6,"#ff7ad9",3.2),r()<.7&&i.emit(z.x,-z.y,4,0,0,0,1.6,.5,1.3,1,.25,4,1,0,1,0,0),pe(z.x,-z.y,14,"#ff6ad0",.5,70);else{let G=Math.hypot(z.vx,z.vy);$(z.x,z.y,z.vx,z.vy,Math.max(4,G*.016),1.05,"#ffd23f",2.2),r()<.3&&i.emit(z.x,-z.y,4,0,0,0,1.1,.8,.25,1,.1,2.4,.6,0,1,0,0)}for(let z of ie.eshots)if(!(z.life<=0||z.x<ae-40||z.x>ae+R+40))if(z.kind==="wave")$(z.x+z.w/2,z.y+z.h/2,z.vx,0,6,5,"#ffb070",3),i.emit(z.x+z.w/2,-(z.y+z.h),2,0,40,0,1.8,.9,.4,1,.3,7,2,0,1,0,0),pe(z.x,-z.y,10,"#ff9040",.8,70);else if(z.kind==="lob")$(z.x,z.y,z.vx,z.vy,4,4,"#b7ff68",2.4),r()<.6&&i.emit(z.x,-z.y,4,0,0,0,.8,1.6,.4,1,.3,5,1,0,1,0,0);else{let G=z.flame||z.kind==="flame";$(z.x,z.y,z.vx,z.vy,G?5:3.4,G?3.4:2.6,G?"#ff8a3c":"#ff4a6a",3),r()<.5&&i.emit(z.x,-z.y,4,0,0,0,1.8,.4,.5,1,.18,4.5,1,0,1,0,0)}M.count=S,M.instanceMatrix.needsUpdate=!0,M.instanceColor&&(M.instanceColor.needsUpdate=!0)}function Z(ie,ae,R,S){let N=ie.beamActive&&ie.beam;if(C.visible=U.visible=!!N,!N)return;if(S&&Math.hypot(S.x-N.ox,S.y-N.oy)<24){let Le=N.ox+N.dx*N.len,ot=N.oy+N.dy*N.len,q=Math.hypot(Le-S.x,ot-S.y)||1;N={...N,ox:S.x,oy:S.y,dx:(Le-S.x)/q,dy:(ot-S.y)/q,len:q}}let $=Math.max(4,N.len),z=(N.width||10)*1.6,G=Math.atan2(-N.dy,N.dx);C.position.set(N.ox,-N.oy,5),C.rotation.set(0,0,G),C.scale.set($,z*1.25,1),A.uLen.value=$;let be=I.attributes.position.array,ve=0,we=-Math.sin(G),Me=Math.cos(G),ye=Math.cos(G),Fe=Math.sin(G);for(let Le=0;Le<w;Le++){let ot=N.ox,q=-N.oy,Ee=0,Ue=Le?5+Le*2:2;for(let qe=1;qe<=b;qe++){let Te=qe/b;Ee=(r()-.5)*Ue*Math.sin(Te*Math.PI)*2+Ee*.35;let _e=N.ox+ye*$*Te+we*Ee,Xe=-N.oy+Fe*$*Te+Me*Ee,nt=Le?.35:.7;for(let[Bt,yt]of[[ot+we*nt,q+Me*nt],[ot-we*nt,q-Me*nt],[_e-we*nt,Xe-Me*nt],[ot+we*nt,q+Me*nt],[_e-we*nt,Xe-Me*nt],[_e+we*nt,Xe+Me*nt]])be[ve++]=Bt,be[ve++]=yt,be[ve++]=6;ot=_e,q=Xe}}I.attributes.position.needsUpdate=!0,I.computeBoundingSphere();let at=N.ox+N.dx*$,Je=N.oy+N.dy*$;r()<.8&&ee(at,Je,"#9ff8ff",2,160,{life:.6}),r()<.3&&me(at,Je,"#6cf3ff",10,.1,6,1.6),pe(N.ox+N.dx*$*.3,-(N.oy+N.dy*$*.3),18,"#5af6ff",2.2,110),pe(at,-Je,18,"#9ff8ff",2,90)}function J(ie,ae,R){let S=new tt(new dn(26,R+120),Y);S.position.set(ie,-(ae+R/2),10),n.add(S),O.push({m:S,age:0,life:.4});for(let N=0;N<30;N++)i.emit(ie+(r()-.5)*10,-(ae+r()*R),8,(r()-.5)*60,(r()-.5)*60,(r()-.5)*40,.6,1.6,1.3,1,.4,3,.5,0,2,.01,0);pe(ie,-(ae+R/2),20,"#67ffd4",4,260)}function re(ie){let ae=0;for(let R of ie)R.line&&O[ae]&&(O[ae].m.position.x=R.x,ae++)}function ce(){i.clear(),s.clear(),h.length=0,g.length=0,c.count=0,d.count=0;for(let ie of T)n.remove(ie.m),ie.m.material.dispose();T.length=0;for(let ie of O)n.remove(ie.m);O.length=0,oe.length=0}return{glow:i,smoke:s,sparks:ee,puff:ne,glowBall:me,ring:fe,chunks:ge,explosion:Ye,update:ft,drawShots:K,drawBeam:Z,shockwall:J,moveWalls:re,light:pe,flashLight:Se,shakeImpulse:ke,get shake(){return Ne},clear:ce,stats:()=>({debris:h.length,rings:T.length,lights:W})}}var Qn={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Ln=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},xy=new Zs(-1,1,1,-1,0,1),Ou=class extends wt{constructor(){super(),this.setAttribute("position",new $e([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new $e([0,2,0,0,2,0],2))}},vy=new Ou,vi=class{constructor(e){this._mesh=new tt(vy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,xy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Kr=class extends Ln{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof gt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=In.clone(e.uniforms),this.material=new gt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new vi(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var va=class extends Ln{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Xc=class extends Ln{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var qc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let i=e.getSize(new xe);this._width=i.width,this._height=i.height,t=new hn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:xn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Kr(Qn),this.copyPass.material.blending=fn,this.clock=new sa}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}va!==void 0&&(o instanceof va?i=!0:o instanceof Xc&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new xe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Yc=class extends Ln{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pe}render(e,t,i){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var sp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var jr=class n extends Ln{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new xe(e.x,e.y):new xe(256,256),this.clearColor=new Pe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new hn(r,o,{type:xn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new hn(r,o,{type:xn});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let f=new hn(r,o,{type:xn});f.texture.name="UnrealBloomPass.v"+h,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}let a=sp;this.highPassUniforms=In.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new gt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new xe(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=In.clone(Qn.uniforms),this.blendMaterial=new gt({uniforms:this.copyUniforms,vertexShader:Qn.vertexShader,fragmentShader:Qn.fragmentShader,blending:An,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Pe,this._oldClearAlpha=1,this._basic=new on,this._fsQuad=new vi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new xe(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new gt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new xe(.5,.5)},direction:{value:new xe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new gt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}};jr.BlurDirectionX=new xe(1,0);jr.BlurDirectionY=new xe(0,1);var ya={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var Zc=class extends Ln{constructor(){super(),this.uniforms=In.clone(ya.uniforms),this.material=new jo({name:ya.name,uniforms:this.uniforms,vertexShader:ya.vertexShader,fragmentShader:ya.fragmentShader}),this._fsQuad=new vi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Pt.getTransfer(this._outputColorSpace)===Ot&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Wl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Xl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ql?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Hr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Zl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$l?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Yl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var _a={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new xe},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new it},cameraProjectionMatrixInverse:{value:new it},cameraWorldMatrix:{value:new it},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new F(-1,-1,-1)},sceneBoxMax:{value:new F(1,1,1)}},vertexShader:`

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
		}`},Ma={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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
		}`};function rp(n=5){let e=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),t=yy(e),i=t.length,s=new Uint8Array(i*4);for(let o=0;o<i;++o){let a=t[o],l=2*Math.PI*a/i,c=new F(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new Pn(s,e,e);return r.wrapS=kn,r.wrapT=kn,r.needsUpdate=!0,r}function yy(n){let e=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),t=e*e,i=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let o=1;o<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),i[s*e+r]!==0){r-=2,s++;continue}else i[s*e+r]=o++;r++,s--}return i}var ba={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:zu(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new xe},cameraProjectionMatrixInverse:{value:new it},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function zu(n,e,t){let i=_y(n,e,t),s="vec3[SAMPLES](";for(let r=0;r<n;r++){let o=i[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<n-1?",":")"}`}return s}function _y(n,e,t){let i=[];for(let s=0;s<n;s++){let r=2*Math.PI*e*s/n,o=Math.pow(s/(n-1),t);i.push(new F(Math.cos(r),Math.sin(r),o))}return i}var Jc=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let i,s,r,o=.5*(Math.sqrt(3)-1),a=(e+t)*o,l=Math.floor(e+a),c=Math.floor(t+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,f=l-u,d=c-u,g=e-f,x=t-d,m,p;g>x?(m=1,p=0):(m=0,p=1);let M=g-m+h,y=x-p+h,v=g-1+2*h,T=x-1+2*h,A=l&255,P=c&255,C=this.perm[A+this.perm[P]]%12,w=this.perm[A+m+this.perm[P+p]]%12,b=this.perm[A+1+this.perm[P+1]]%12,I=.5-g*g-x*x;I<0?i=0:(I*=I,i=I*I*this._dot(this.grad3[C],g,x));let L=.5-M*M-y*y;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[w],M,y));let U=.5-v*v-T*T;return U<0?r=0:(U*=U,r=U*U*this._dot(this.grad3[b],v,T)),70*(i+s+r)}noise3d(e,t,i){let s,r,o,a,c=(e+t+i)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),f=Math.floor(i+c),d=1/6,g=(h+u+f)*d,x=h-g,m=u-g,p=f-g,M=e-x,y=t-m,v=i-p,T,A,P,C,w,b;M>=y?y>=v?(T=1,A=0,P=0,C=1,w=1,b=0):M>=v?(T=1,A=0,P=0,C=1,w=0,b=1):(T=0,A=0,P=1,C=1,w=0,b=1):y<v?(T=0,A=0,P=1,C=0,w=1,b=1):M<v?(T=0,A=1,P=0,C=0,w=1,b=1):(T=0,A=1,P=0,C=1,w=1,b=0);let I=M-T+d,L=y-A+d,U=v-P+d,V=M-C+2*d,Y=y-w+2*d,O=v-b+2*d,W=M-1+3*d,X=y-1+3*d,j=v-1+3*d,oe=h&255,pe=u&255,Se=f&255,Ne=this.perm[oe+this.perm[pe+this.perm[Se]]]%12,ke=this.perm[oe+T+this.perm[pe+A+this.perm[Se+P]]]%12,De=this.perm[oe+C+this.perm[pe+w+this.perm[Se+b]]]%12,ee=this.perm[oe+1+this.perm[pe+1+this.perm[Se+1]]]%12,ne=.6-M*M-y*y-v*v;ne<0?s=0:(ne*=ne,s=ne*ne*this._dot3(this.grad3[Ne],M,y,v));let me=.6-I*I-L*L-U*U;me<0?r=0:(me*=me,r=me*me*this._dot3(this.grad3[ke],I,L,U));let fe=.6-V*V-Y*Y-O*O;fe<0?o=0:(fe*=fe,o=fe*fe*this._dot3(this.grad3[De],V,Y,O));let ge=.6-W*W-X*X-j*j;return ge<0?a=0:(ge*=ge,a=ge*ge*this._dot3(this.grad3[ee],W,X,j)),32*(s+r+o+a)}noise4d(e,t,i,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,u,f,d,g,x=(e+t+i+s)*l,m=Math.floor(e+x),p=Math.floor(t+x),M=Math.floor(i+x),y=Math.floor(s+x),v=(m+p+M+y)*c,T=m-v,A=p-v,P=M-v,C=y-v,w=e-T,b=t-A,I=i-P,L=s-C,U=w>b?32:0,V=w>I?16:0,Y=b>I?8:0,O=w>L?4:0,W=b>L?2:0,X=I>L?1:0,j=U+V+Y+O+W+X,oe=o[j][0]>=3?1:0,pe=o[j][1]>=3?1:0,Se=o[j][2]>=3?1:0,Ne=o[j][3]>=3?1:0,ke=o[j][0]>=2?1:0,De=o[j][1]>=2?1:0,ee=o[j][2]>=2?1:0,ne=o[j][3]>=2?1:0,me=o[j][0]>=1?1:0,fe=o[j][1]>=1?1:0,ge=o[j][2]>=1?1:0,Ye=o[j][3]>=1?1:0,ft=w-oe+c,k=b-pe+c,B=I-Se+c,H=L-Ne+c,K=w-ke+2*c,Z=b-De+2*c,J=I-ee+2*c,re=L-ne+2*c,ce=w-me+3*c,ie=b-fe+3*c,ae=I-ge+3*c,R=L-Ye+3*c,S=w-1+4*c,N=b-1+4*c,$=I-1+4*c,z=L-1+4*c,G=m&255,be=p&255,ve=M&255,we=y&255,Me=a[G+a[be+a[ve+a[we]]]]%32,ye=a[G+oe+a[be+pe+a[ve+Se+a[we+Ne]]]]%32,Fe=a[G+ke+a[be+De+a[ve+ee+a[we+ne]]]]%32,at=a[G+me+a[be+fe+a[ve+ge+a[we+Ye]]]]%32,Je=a[G+1+a[be+1+a[ve+1+a[we+1]]]]%32,Le=.6-w*w-b*b-I*I-L*L;Le<0?h=0:(Le*=Le,h=Le*Le*this._dot4(r[Me],w,b,I,L));let ot=.6-ft*ft-k*k-B*B-H*H;ot<0?u=0:(ot*=ot,u=ot*ot*this._dot4(r[ye],ft,k,B,H));let q=.6-K*K-Z*Z-J*J-re*re;q<0?f=0:(q*=q,f=q*q*this._dot4(r[Fe],K,Z,J,re));let Ee=.6-ce*ce-ie*ie-ae*ae-R*R;Ee<0?d=0:(Ee*=Ee,d=Ee*Ee*this._dot4(r[at],ce,ie,ae,R));let Ue=.6-S*S-N*N-$*$-z*z;return Ue<0?g=0:(Ue*=Ue,g=Ue*Ue*this._dot4(r[Je],S,N,$,z)),27*(h+u+f+d+g)}_dot(e,t,i){return e[0]*t+e[1]*i}_dot3(e,t,i,s){return e[0]*t+e[1]*i+e[2]*s}_dot4(e,t,i,s,r){return e[0]*t+e[1]*i+e[2]*s+e[3]*r}};var Qr=class n extends Ln{constructor(e,t,i=512,s=512,r,o,a){super(),this.width=i,this.height=s,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=rp(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new hn(this.width,this.height,{type:xn}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new gt({defines:Object.assign({},_a.defines),uniforms:In.clone(_a.uniforms),vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader,blending:fn,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Qo,this.normalMaterial.blending=fn,this.pdMaterial=new gt({defines:Object.assign({},ba.defines),uniforms:In.clone(ba.uniforms),vertexShader:ba.vertexShader,fragmentShader:ba.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new gt({defines:Object.assign({},Ma.defines),uniforms:In.clone(Ma.uniforms),vertexShader:Ma.vertexShader,fragmentShader:Ma.fragmentShader,blending:fn}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new gt({uniforms:In.clone(Qn.uniforms),vertexShader:Qn.vertexShader,fragmentShader:Qn.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:oa,blendDst:$s,blendEquation:si,blendSrcAlpha:ra,blendDstAlpha:$s,blendEquationAlpha:si}),this.blendMaterial=new gt({uniforms:In.clone($c.uniforms),vertexShader:$c.vertexShader,fragmentShader:$c.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Fl,blendSrc:oa,blendDst:$s,blendEquation:si,blendSrcAlpha:ra,blendDstAlpha:$s,blendEquationAlpha:si}),this._fsQuad=new vi(null),this._originalClearColor=new Pe,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new es,this.depthTexture.format=vs,this.depthTexture.type=xs,this.normalRenderTarget=new hn(this.width,this.height,{minFilter:mn,magFilter:mn,type:xn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let i=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=zu(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,i){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case n.OUTPUT.Off:break;case n.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=fn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=fn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=fn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=fn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=fn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,i,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_renderOverride(e,t,i,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,t.push(i))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Jc,i=e*e*4,s=new Uint8Array(i);for(let o=0;o<e;o++)for(let a=0;a<e;a++){let l=o,c=a;s[(o*e+a)*4]=(t.noise(l,c)*.5+.5)*255,s[(o*e+a)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(o*e+a)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(o*e+a)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new Pn(s,e,e,vn,qn);return r.wrapS=kn,r.wrapT=kn,r.needsUpdate=!0,r}};Qr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Bu=class extends Ln{constructor(e,t){super(),this.scene=e,this.camera=t,this.water=null,this.enabled=!1,this.copy=new vi(new gt({uniforms:In.clone(Qn.uniforms),vertexShader:Qn.vertexShader,fragmentShader:Qn.fragmentShader,depthTest:!1,depthWrite:!1}))}render(e,t,i){e.setRenderTarget(this.renderToScreen?null:t),e.clear(!0,!0,!1),this.copy.material.uniforms.tDiffuse.value=i.texture,this.copy.render(e);let s=this.water.uniforms;s.tScene.value=i.texture,s.tDepth.value=i.depthTexture;let r=this.scene.background,o=e.autoClear,a=e.shadowMap.autoUpdate,l=this.camera.layers.mask;this.scene.background=null,e.autoClear=!1,e.shadowMap.autoUpdate=!1,this.camera.layers.set(1),e.render(this.scene,this.camera),this.camera.layers.mask=l,e.shadowMap.autoUpdate=a,e.autoClear=o,this.scene.background=r}dispose(){this.copy.dispose(),this.copy.material.dispose()}},Hu=class extends Qr{_overrideVisibility(){super._overrideVisibility(),this._hidden=[],this.scene.traverse(e=>{e.visible&&e.isMesh&&e.material&&(e.material.transparent||e.material.isShaderMaterial)&&(e.visible=!1,this._hidden.push(e))})}_restoreVisibility(){for(let e of this._hidden)e.visible=!0;this._hidden=[],super._restoreVisibility()}},My={uniforms:{tDiffuse:{value:null},uTime:{value:0},uVignette:{value:.32},uCA:{value:0},uGrain:{value:.035},uFrost:{value:0},uHurt:{value:0},uFlash:{value:0},uLift:{value:new F},uGain:{value:new F(1,1,1)},uSat:{value:1},uScan:{value:0},uRes:{value:new xe(1,1)},uFade:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVignette,uCA,uGrain,uFrost,uHurt,uFlash,uSat,uScan,uFade;uniform vec3 uLift,uGain;uniform vec2 uRes;varying vec2 vUv;
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
      gl_FragColor=vec4(col,1.);}`};function op(n,e,t,i){let s=n.getDrawingBufferSize(new xe),r=new hn(s.x,s.y,{type:xn,samples:i==="low"?0:4});r.depthTexture=new es(s.x,s.y),r.depthTexture.type=zi;let o=new qc(n,r),a=new Yc(e,t);o.addPass(a);let l=new Bu(e,t);o.addPass(l);let c=null;i==="ultra"&&(c=new Hu(e,t,s.x,s.y),c.output=Qr.OUTPUT.Default,c.blendIntensity=.85,c.updateGtaoMaterial({radius:16,distanceExponent:1.6,thickness:6,distanceFallOff:1,scale:1.15,samples:12}),c.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,rings:2,samples:12}),o.addPass(c));let h=new jr(new xe(s.x,s.y),.6,.55,.92);o.addPass(h),o.addPass(new Zc);let u=new Kr(My);o.addPass(u);let f=u.uniforms;return{composer:o,bloom:h,final:u,u:f,ao:c,setWater(d){l.water=d,l.enabled=!!d},setSize(d,g){o.setSize(d,g),f.uRes.value.set(d,g),h.resolution.set(d,g)},setGrade(d){f.uLift.value.set(...d.lift),f.uGain.value.set(...d.gain),f.uSat.value=d.sat},render(){o.render()}}}var by={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9"},Sy={spread:"SCATTER",beam:"ARC LANCE",bounce:"RICOCHET"};function ap(n){let e=null;function t(c,h){e={text:c,sub:h,t:0}}let i=540;function s(c,h){i=Math.max(400,Math.min(540,(h||540)*1.08));let u=i*c;return n.save(),n.scale(960/u,540/i),u}function r(c,h,u,f,d,g,x){n.fillStyle="rgba(8,16,26,.75)",n.fillRect(c-1,h-1,u+2,f+2);let m=x||1,p=m>1?2:0,M=(u-p*(m-1))/m;for(let y=0;y<m;y++){let v=Math.max(0,Math.min(1,d*m-y));v<=0||(n.fillStyle=g,n.fillRect(c+y*(M+p),h,M*v,f))}n.fillStyle="rgba(255,255,255,.18)",n.fillRect(c,h,u*Math.max(0,d),1)}function o(c,h,u,f){n.save(),n.translate(c,h),n.beginPath(),n.moveTo(0,-u),n.lineTo(u*.55,-u*.2),n.lineTo(u*.35,u),n.lineTo(-u*.35,u),n.lineTo(-u*.55,-u*.2),n.closePath(),n.shadowColor=f,n.shadowBlur=8,n.fillStyle=f,n.fill(),n.shadowBlur=0,n.fillStyle="rgba(255,255,255,.55)",n.beginPath(),n.moveTo(0,-u),n.lineTo(u*.2,-u*.1),n.lineTo(0,u*.6),n.closePath(),n.fill(),n.restore()}function a(c,h,u,f,d,g="left",x="600"){n.font=`${x} ${f}px "Rajdhani","Trebuchet MS",system-ui,sans-serif`,n.textAlign=g,n.textBaseline="alphabetic",n.fillStyle=d,n.fillText(c,h,u)}function l(c,h,u,f,d,g){let x=s(h,g),m=c.player,p=n.createLinearGradient(0,0,0,78);p.addColorStop(0,"rgba(2,8,16,.82)"),p.addColorStop(1,"rgba(2,8,16,0)"),n.fillStyle=p,n.fillRect(0,0,x,78);let M=Math.max(18,x*.025),y=x-M;a("ARMOR",M,22,11,"#8fb3c4");let T=m.energy<30?Math.sin(f*12)>0?"#ff5d6a":"#ff9aa2":"#73f0ea";r(M,28,170,7,m.energy/m.maxEnergy,T,10),a(String(Math.max(0,Math.ceil(m.energy))).padStart(3,"0"),M+180,36,16,"#eafcff","left","700");for(let L=0;L<Math.min(8,m.lives);L++)n.fillStyle="#bfe9f5",n.beginPath(),n.arc(M+5+L*13,50,4.2,Math.PI,0),n.lineTo(M+9.2+L*13,54),n.lineTo(M+.8+L*13,54),n.closePath(),n.fill(),n.fillStyle="#63eeff",n.fillRect(M+2.5+L*13,48.5,5,1.6);m.lives>8&&a("\xD7"+m.lives,M+108,55,11,"#bfe9f5");let A=x*.36,P=by[m.weapon]||"#fff",C=m.weapons[m.weapon]||1;n.save(),n.shadowColor=P,n.shadowBlur=10,a(m.morph?"ROLL CORE":Sy[m.weapon],A,26,15,P,"left","700"),n.restore();for(let L=0;L<3;L++)n.fillStyle=L<C?P:"rgba(255,255,255,.15)",n.beginPath(),n.moveTo(A+L*14,40),n.lineTo(A+L*14+10,40),n.lineTo(A+L*14+7,46),n.lineTo(A+L*14-3,46),n.closePath(),n.fill();a("CRYO",A+52,46,10,"#a9eeff");for(let L=0;L<m.bombs;L++)n.fillStyle="#a9eeff",n.fillRect(A+80+L*7,39,4,7);a("SHOCK",A+52+Math.max(48,m.bombs*7+34),46,10,"#67ffd4");for(let L=0;L<m.lines;L++)n.fillStyle="#67ffd4",n.fillRect(A+52+Math.max(48,m.bombs*7+34)+36+L*7,39,4,7);let w=Math.max(0,c.time),b=w<30?Math.sin(f*10)>0?"#ff6b78":"#ffb3ba":"#c9dbe5";a(`${Math.floor(w/60)}:${String(Math.floor(w%60)).padStart(2,"0")}`,x*.62,30,18,b,"center","700"),o(y-118,24,8,"#7fe6ff"),a(String(m.gems),y-104,31,20,"#dff9ff","left","700"),a(String(m.score).padStart(7,"0"),y,54,15,"#eaf4ff","right","700"),a("SCORE",y-74,54,9,"#7d97a6","right");let I=c.boss;if(I&&I.alive&&I.awake){let L=Math.min(420,x*.5),U=x/2-L/2,V=i-46;n.fillStyle="rgba(4,10,18,.7)",n.fillRect(U-12,V-24,L+24,40),n.save(),n.shadowColor="#ff3b5a",n.shadowBlur=8,a(I.name,x/2,V-8,13,"#ffc0c8","center","700"),n.restore(),r(U,V,L,6,Math.max(0,I.hp/I.maxHp),I.open?Math.sin(f*14)>0?"#fff27a":"#ffb347":"#ff4d6d",24),n.fillStyle="rgba(255,255,255,.5)";for(let Y of[1/3,2/3])n.fillRect(U+L*Y,V-2,1,10);I.open&&a("CORE EXPOSED",x/2,V+18,9,"#fff27a","center","700")}if(e){e.t+=d;let L=e.t;if(L>2.6)e=null;else{let U=Math.min(1,L*5)*Math.min(1,(2.6-L)*3);n.globalAlpha=U;let V=Math.min(x*.7,520),Y=150,O=n.createLinearGradient(x/2-V/2,0,x/2+V/2,0);O.addColorStop(0,"rgba(255,40,70,0)"),O.addColorStop(.5,e.text==="WARNING"?"rgba(255,40,70,.35)":"rgba(80,220,255,.28)"),O.addColorStop(1,"rgba(255,40,70,0)"),n.fillStyle=O,n.fillRect(x/2-V/2,Y-34,V,52),n.save(),n.shadowColor=e.text==="WARNING"?"#ff3b5a":"#6cf3ff",n.shadowBlur=14,a(e.text,x/2,Y,30,e.text==="WARNING"?"#ffd6dc":"#e6fdff","center","800"),n.restore(),e.sub&&a(e.sub,x/2,Y+16,12,"#b7cad6","center","600"),n.globalAlpha=1}}for(let L of c.floats){if(L.line||!L.text)continue;let U=u(L.x+6,L.y);if(!U)continue;let V=Math.min(1,L.life*2.5);n.globalAlpha=V,n.save(),n.shadowColor="#000",n.shadowBlur=4,a(L.text,U.x*x,U.y*i,L.text.length>5?12:11,L.text==="1UP"?"#ff9fb3":"#f2fbff","center","700"),n.restore(),n.globalAlpha=1}n.restore()}return{draw:l,setBanner:t}}var Sa=new F;function yi(n,e,t,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Sa.copy(e),Sa[i]=0,Sa.normalize();let c=.5*o/(o+a),h=1-Sa.angleTo(n)/l;return Math.sign(Sa[t])===1?h*c:a/(o+a)+c+c*(1-h)}var Kc=class n extends Vt{constructor(e=1,t=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(e/2,t/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new F,c=new F,h=new F(e,t,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,g=u.length/6,x=new F,m=.5/o;for(let p=0,M=0;p<u.length;p+=3,M+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,f[p+0]=c.x,f[p+1]=c.y,f[p+2]=c.z,Math.floor(p/g)){case 0:x.set(1,0,0),d[M+0]=yi(x,c,"z","y",r,i),d[M+1]=1-yi(x,c,"y","z",r,t);break;case 1:x.set(-1,0,0),d[M+0]=1-yi(x,c,"z","y",r,i),d[M+1]=1-yi(x,c,"y","z",r,t);break;case 2:x.set(0,1,0),d[M+0]=1-yi(x,c,"x","z",r,e),d[M+1]=yi(x,c,"z","x",r,i);break;case 3:x.set(0,-1,0),d[M+0]=1-yi(x,c,"x","z",r,e),d[M+1]=1-yi(x,c,"z","x",r,i);break;case 4:x.set(0,0,1),d[M+0]=1-yi(x,c,"x","y",r,e),d[M+1]=1-yi(x,c,"y","x",r,t);break;case 5:x.set(0,0,-1),d[M+0]=yi(x,c,"x","y",r,e),d[M+1]=1-yi(x,c,"y","x",r,t);break}}static fromJSON(e){return new n(e.width,e.height,e.depth,e.segments,e.radius)}};var Mt=F,Vu=new it,lp=new $n,cp=new ri,Di=new Mt,jc=new Mt,Rt=(n,e,t)=>n<e?e:n>t?t:n,Hn=(n,e,t)=>n+(e-n)*t,ei=n=>(n=Rt(n,0,1),n*n*(3-2*n)),xt=(n,e,t,i)=>n+(e-n)*(1-Math.exp(-t*i)),ze=Math.PI*2;function to(n){let e=n>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var wa=new Pe;function We(n,e=1){return wa.set(n),[wa.r*e,wa.g*e,wa.b*e]}function Sn(n){let e=n.userData||{};n.index&&(n=n.toNonIndexed(),n.userData=e);let t=n.userData||(n.userData={});if(t.uvm&&n.attributes.uv){let i=n.attributes.uv;for(let s=0;s<i.count;s++)i.setXY(s,i.getX(s)*t.uvm[0],i.getY(s)*t.uvm[1]);t.uvModel=!0,delete t.uvm}for(let i of Object.keys(n.attributes))i!=="position"&&i!=="normal"&&!(i==="uv"&&t.uvModel)&&n.deleteAttribute(i);return n.attributes.normal||n.computeVertexNormals(),n.morphAttributes={},n}var ci=(n,e,t)=>(n.userData.uvm=[e,t],n);function tn(n,e,t,i){return cp.set(t?t[0]:0,t?t[1]:0,t?t[2]:0),lp.setFromEuler(cp),i==null?jc.set(1,1,1):typeof i=="number"?jc.set(i,i,i):jc.set(i[0],i[1],i[2]),Di.set(e?e[0]:0,e?e[1]:0,e?e[2]:0),Vu.compose(Di,lp,jc),n.applyMatrix4(Vu),Vu.determinant()<0&&xp(n),n}function xp(n){if(n.index){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t+1];e[t+1]=e[t+2],e[t+2]=i}return n.index.needsUpdate=!0,n}for(let e of Object.keys(n.attributes)){let t=n.attributes[e],i=t.itemSize,s=t.array;for(let r=0;r<t.count;r+=3)for(let o=0;o<i;o++){let a=(r+1)*i+o,l=(r+2)*i+o,c=s[a];s[a]=s[l],s[l]=c}t.needsUpdate=!0}return n}function Ta(n){return tn(n.clone(),null,null,[1,1,-1])}function wn(n,e,t=!0){let i=n.attributes.position;for(let s=0;s<i.count;s++)Di.fromBufferAttribute(i,s),e(Di,s),i.setXYZ(s,Di.x,Di.y,Di.z);return i.needsUpdate=!0,t==="smooth"?wy(n):t&&n.computeVertexNormals(),n}function wy(n){let e=n.attributes.position,t=e.count,i=new Map,s=new Array(t),r=new Mt,o=new Mt,a=new Mt,l=new Mt,c=new Mt,h=f=>Math.round(e.getX(f)*200)+","+Math.round(e.getY(f)*200)+","+Math.round(e.getZ(f)*200);for(let f=0;f<t;f+=3){r.fromBufferAttribute(e,f),o.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),l.subVectors(a,o).cross(c.subVectors(r,o));for(let d=0;d<3;d++){let g=s[f+d]=h(f+d),x=i.get(g);x?x.add(l):i.set(g,l.clone())}}let u=new Float32Array(t*3);for(let f=0;f<t;f++){let d=i.get(s[f]);c.copy(d).normalize(),u[f*3]=c.x,u[f*3+1]=c.y,u[f*3+2]=c.z}return n.setAttribute("normal",new It(u,3)),n}function Ey(n){return n=n.index?n.toNonIndexed():n,n.computeVertexNormals(),n}var Ea=1;function vp(n){Ea=n}var bn=(n,e=3)=>n<=8&&Ea<1?n:Math.max(e,Math.round(n*Ea)),_={box(n,e,t,i=0,s=1){return i<=0?Sn(new Vt(n,e,t)):Sn(new Kc(n,e,t,Math.max(1,Math.round(s*Ea)),Math.min(i,Math.min(n,e,t)*.49)))},ext(n,e,t=.25,i={}){let s=new ps;s.moveTo(n[0][0],n[0][1]);for(let a=1;a<n.length;a++)s.lineTo(n[a][0],n[a][1]);if(s.closePath(),i.holes)for(let a of i.holes){let l=new Vs;l.moveTo(a[0][0],a[0][1]);for(let c=1;c<a.length;c++)l.lineTo(a[c][0],a[c][1]);l.closePath(),s.holes.push(l)}let r=Math.min(t,e*.45),o=new $o(s,{depth:Math.max(.01,e-2*r),bevelEnabled:r>0,bevelThickness:r,bevelSize:r,bevelOffset:-r,bevelSegments:i.bevelSeg!=null?i.bevelSeg:Ea<1?1:2,steps:i.steps||1,curveSegments:4});return o.translate(0,0,r-e/2),Sn(ci(Ey(o),1,1))},lathe(n,e=12,t=0,i=ze){let s=0,r=0;for(let o=0;o<n.length;o++)r=Math.max(r,n[o][0]),o&&(s+=Math.hypot(n[o][0]-n[o-1][0],n[o][1]-n[o-1][1]));return Sn(ci(new Jo(n.map(o=>new xe(o[0],o[1])),bn(e),t,i),r*i,s))},cyl(n,e,t,i=10,s=!1,r=1){return Sn(ci(new On(n,e,t,bn(i),r,s),ze*Math.max(n,e),t))},cone(n,e,t=8){return Sn(ci(new ts(n,e,bn(t)),ze*n,e))},sph(n,e=12,t=8){return Sn(ci(new Jn(n,bn(e),bn(t,2)),ze*n,Math.PI*n))},ell(n,e,t,i=12,s=8){return tn(Sn(ci(new Jn(1,bn(i),bn(s,2)),Math.PI*(n+t),Math.PI*e)),null,null,[n,e,t])},ico(n,e=0){return Sn(new Ri(n,e))},oct(n){return Sn(new ns(n,0))},dodec(n){return Sn(new Bo(n,0))},torus(n,e,t=6,i=16,s=ze){return Sn(ci(new Xs(n,e,bn(t),bn(i),s),n*s,ze*e))},capsule(n,e,t=3,i=8){return Sn(ci(new Bs(n,e,bn(t,2),bn(i)),ze*n,e+Math.PI*n))},tube(n,e,t=12,i=5,s=!1){let r=new Hs(n.map(o=>new Mt(o[0],o[1],o[2])),s);return Sn(ci(new Or(r,bn(t),e,bn(i),s),r.getLength(),ze*e))},taperTube(n,e,t=12,i=6){let s=new Hs(n.map(h=>new Mt(h[0],h[1],h[2]))),r=new Or(s,bn(t),1,bn(i),!1),o=r.attributes.position,a=bn(t),l=bn(i),c=s.computeFrenetFrames(a,!1);for(let h=0;h<=a;h++){let u=s.getPointAt(h/a),f=e(h/a);for(let d=0;d<=l;d++){let g=h*(l+1)+d;Di.fromBufferAttribute(o,g).sub(u).multiplyScalar(f).add(u),o.setXYZ(g,Di.x,Di.y,Di.z)}}return r.computeVertexNormals(),Sn(ci(r,s.getLength(),ze*e(.3)))},crystal(n,e,t=6,i=.35,s=1,r=.18){let o=to(s),a=[],l=[],c=[],h=t,u=e*(1-i);for(let x=0;x<h;x++){let m=x/h*ze+o()*.3,p=n*(1+(o()-.5)*r*2);l.push([Math.cos(m)*p*.82,-e*.04,Math.sin(m)*p*.82]),c.push([Math.cos(m)*p,u*(1+(o()-.5)*r),Math.sin(m)*p])}let f=[(o()-.5)*n*.3,e,(o()-.5)*n*.3],d=(x,m,p)=>a.push(...x,...m,...p);for(let x=0;x<h;x++){let m=(x+1)%h;d(l[x],c[m],c[x]),d(l[x],l[m],c[m]),d(c[x],c[m],f),d(l[m],l[x],[0,-e*.08,0])}let g=new wt;return g.setAttribute("position",new $e(a,3)),g.computeVertexNormals(),g},shard(n,e,t=6,i=3,s=.15){let r=to(i),o=[],a=[],l=[];for(let d=0;d<t;d++){let g=d/t*ze+(r()-.5)*.25,x=n*(1+(r()-.5)*s*2);a.push([Math.cos(g)*x,-e*.18*(1+(r()-.5)*s),Math.sin(g)*x]),l.push([Math.cos(g)*x*.96,e*.16*(1+(r()-.5)*s),Math.sin(g)*x*.96])}let c=[(r()-.5)*n*.2,e*.5,(r()-.5)*n*.2],h=[(r()-.5)*n*.2,-e*.5,(r()-.5)*n*.2],u=(d,g,x)=>o.push(...d,...g,...x);for(let d=0;d<t;d++){let g=(d+1)%t;u(a[d],l[g],l[d]),u(a[d],a[g],l[g]),u(l[d],l[g],c),u(a[g],a[d],h)}let f=new wt;return f.setAttribute("position",new $e(o,3)),f.computeVertexNormals(),f},shell(n,e,t,i,s,r,o,a,l=10,c=6,h=null){l=bn(l),c=bn(c,2);let u=[],f=[],d=[],g=(n+t)/2,x=(W,X,j)=>{let oe=h?h(W,X):1,pe=Math.sin(X)*Math.cos(W),Se=Math.cos(X),Ne=Math.sin(X)*Math.sin(W);return[pe*(n*oe-j),Se*(e*oe-j),Ne*(t*oe-j)]},m=(W,X)=>{let j=u.length/3;for(let oe=0;oe<=c;oe++)for(let pe=0;pe<=l;pe++){let Se=s+(r-s)*(pe/l),Ne=o+(a-o)*(oe/c);u.push(...x(Se,Ne,W)),f.push(Se*g,Ne*e)}for(let oe=0;oe<c;oe++)for(let pe=0;pe<l;pe++){let Se=j+oe*(l+1)+pe,Ne=Se+1,ke=Se+l+1,De=ke+1;X?d.push(Se,Ne,ke,Ne,De,ke):d.push(Se,ke,Ne,Ne,ke,De)}};m(0,!0),m(i,!1);let p=new wt;p.setAttribute("position",new $e(u,3)),p.setAttribute("uv",new $e(f,2)),p.setIndex(d),p.computeVertexNormals();let M=[],y=[],v=new Mt,T=new Mt,A=new Mt,P=new Mt,C=new Mt,w=new Mt,b=new Mt,I=(W,X)=>{let j=0;for(let oe=0;oe<W.length-1;oe++){let[pe,Se]=W[oe],[Ne,ke]=W[oe+1],De=x(pe,Se,0),ee=x(Ne,ke,0),ne=x(pe,Se,i),me=x(Ne,ke,i);v.fromArray(De),T.fromArray(ee),A.fromArray(ne),w.subVectors(A,v),b.subVectors(T,v),P.crossVectors(w,b),X((pe+Ne)/2,(Se+ke)/2,C);let fe=Math.hypot(ee[0]-De[0],ee[1]-De[1],ee[2]-De[2]);P.dot(C)>=0?(M.push(...De,...ne,...ee,...ee,...ne,...me),y.push(j,0,j,i,j+fe,0,j+fe,0,j,i,j+fe,i)):(M.push(...De,...ee,...ne,...ee,...me,...ne),y.push(j,0,j+fe,0,j,i,j+fe,0,j+fe,i,j,i)),j+=fe}},L=(W,X,j,oe)=>{j.set(-Math.sin(W)*n,0,Math.cos(W)*t).multiplyScalar(oe)},U=(W,X,j,oe)=>{j.set(Math.cos(X)*Math.cos(W)*n,-Math.sin(X)*e,Math.cos(X)*Math.sin(W)*t).multiplyScalar(oe)},V=[];if(o>.001){for(let W=0;W<=l;W++)V.push([s+(r-s)*W/l,o]);I(V,(W,X,j)=>U(W,X,j,-1)),V.length=0}if(a<Math.PI-.001){for(let W=0;W<=l;W++)V.push([s+(r-s)*W/l,a]);I(V,(W,X,j)=>U(W,X,j,1)),V.length=0}if(r-s<ze-.001){for(let W=0;W<=c;W++)V.push([s,o+(a-o)*W/c]);I(V,(W,X,j)=>L(W,X,j,-1)),V.length=0;for(let W=0;W<=c;W++)V.push([r,o+(a-o)*W/c]);I(V,(W,X,j)=>L(W,X,j,1)),V.length=0}let Y=[Sn(ci(p,1,1))];if(M.length){let W=new wt;W.setAttribute("position",new $e(M,3)),W.setAttribute("uv",new $e(y,2)),W.computeVertexNormals(),Y.push(Sn(ci(W,1,1)))}let O=Y.length>1?Bn(Y):Y[0];return O.userData.uvModel=!0,O},ribs(n,e,t,i=.15,s=10){let r=[];for(let o=0;o<=t*2;o++)r.push([n*(o%2?1-i:1),o/(t*2)*e-e/2]);return r.unshift([.001,-e/2]),r.push([.001,e/2]),_.lathe(r,s)},membrane(n){let e=new ps;e.moveTo(n[0][0],n[0][1]);for(let o=1;o<n.length;o++)e.lineTo(n[o][0],n[o][1]);let t=Sn(ci(new Ko(e),1,1)),i=xp(t.clone()),s=i.attributes.normal;for(let o=0;o<s.count;o++)s.setZ(o,-s.getZ(o));let r=Bn([t,i]);return r.userData.uvModel=!0,r}};function Ty(n,e,t,i){let s=n.attributes.position,r=s.count,o=new Float32Array(r*2),a=new Mt,l=new Mt,c=new Mt,h=new Mt,u=new Mt;for(let f=0;f<r;f+=3){a.fromBufferAttribute(s,f),l.fromBufferAttribute(s,f+1),c.fromBufferAttribute(s,f+2),h.subVectors(l,a),u.subVectors(c,a),h.cross(u);let d=Math.abs(h.x),g=Math.abs(h.y),x=Math.abs(h.z);for(let m=0;m<3;m++){let p=m===0?a:m===1?l:c,M,y;d>=g&&d>=x?(M=p.z,y=p.y):g>=x?(M=p.x,y=p.z):(M=p.x,y=p.y),o[(f+m)*2]=M*e+t,o[(f+m)*2+1]=y*e+i}}n.setAttribute("uv",new It(o,2))}function or(n,e,t=3.2,i=null){let s=We(n),r=We(e),o=i?We(i):null;return(a,l,c)=>{let h=Math.sin(l*ze/t+Math.sin(a*.21+c*.17)*1.6)*.5+.5,u=Math.sin(l*2.3+a*1.7)*.5+.5,f=h*h*(3-2*h),d=[s[0]+(r[0]-s[0])*f,s[1]+(r[1]-s[1])*f,s[2]+(r[2]-s[2])*f];if(o&&u>.82){let g=(u-.82)/.18;for(let x=0;x<3;x++)d[x]+=(o[x]-d[x])*g*.7}return d}}var vt=class{constructor(e=1/22){this.bones=[],this.names={},this.parts={},this.uvScale=e,this.R=to(7),this.post=null,this.bone("root",null,0,0,0)}bone(e,t,i,s,r){return this.names[e]=this.bones.length,this.bones.push({name:e,parent:t==null?-1:this.names[t],pos:new Mt(i,s,r)}),this}add(e,t,i,s="#808080",r=.04){if(Array.isArray(i)){for(let p of i)this.add(e,t,p,s,r);return this}let o=this.names[e];if(o==null)throw new Error("no bone "+e);let a=Sn(i),l=a.attributes.position.count,c=typeof s=="function"?s:null,h=c?[1,1,1]:typeof s=="string"?We(s):s,u=1+(this.R()-.5)*r*2,f=new Float32Array(l*3),d=new Uint16Array(l*4),g=new Float32Array(l*4),x=a.attributes.position;for(let p=0;p<l;p++)c&&(h=c(x.getX(p),x.getY(p),x.getZ(p))),f[p*3]=h[0]*u,f[p*3+1]=h[1]*u,f[p*3+2]=h[2]*u,d[p*4]=o,g[p*4]=1;a.setAttribute("color",new It(f,3)),a.setAttribute("skinIndex",new zs(d,4)),a.setAttribute("skinWeight",new It(g,4));let m=this.uvScale*(t==="suit"?2.2:t==="flesh"?1.3:1);if(a.userData.uvModel&&a.attributes.uv){let p=a.attributes.uv,M=this.R(),y=this.R();for(let v=0;v<p.count;v++)p.setXY(v,p.getX(v)*m+M,p.getY(v)*m+y)}else Ty(a,m,this.R(),this.R());return(this.parts[t]||(this.parts[t]=[])).push(a),this}scaleAll(e,t=0,i=0,s=0){return this.post={s:e,c:new Mt(t,i,s)},this}build(){let e=[],t=0;if(this.post){let{s:i,c:s}=this.post,r=new it().makeTranslation(s.x,s.y,s.z).multiply(new it().makeScale(i,i,i)).multiply(new it().makeTranslation(-s.x,-s.y,-s.z));for(let o of Object.keys(this.parts))for(let a of this.parts[o])a.applyMatrix4(r);for(let o of this.bones)o.pos.sub(s).multiplyScalar(i).add(s)}for(let i of Object.keys(this.parts)){let s=Bn(this.parts[i]);s.computeBoundingSphere(),t+=s.attributes.position.count/3,e.push({mat:i,geometry:s})}return{bones:this.bones,meshes:e,tris:t}}},Ay=new it;function ar(n,e,t={}){let i=new Yt,s=n.bones.map(u=>{let f=new Dr;return f.name=u.name,f});n.bones.forEach((u,f)=>{let d=s[f];u.parent<0?(i.add(d),d.position.copy(u.pos)):(s[u.parent].add(d),d.position.copy(u.pos).sub(n.bones[u.parent].pos)),d.userData.rest=d.position.clone()});let r=n.bones.map(u=>new it().makeTranslation(-u.pos.x,-u.pos.y,-u.pos.z)),o=new Oo(s,r),a={};s.forEach(u=>{a[u.name]=u});let l=[],c={},h=[];for(let u of n.meshes){let f=e.instance(u.mat),d=new ko(u.geometry,f);d.bind(o,Ay),d.frustumCulled=!1;let g=f.isMeshBasicMaterial||f.transparent;d.castShadow=t.shadow!==!1&&!g,d.receiveShadow=!g,d.name=u.mat,i.add(d),h.push(d),l.push(f),c[u.mat]=f}return{group:i,bones:a,boneList:s,skeleton:o,meshes:h,materials:l,byMat:c,fx:new Yu(l)}}function yp(n){n.skeleton.dispose();for(let e of n.materials)e.dispose()}var Ry=new Pe(.62,.8,1),Cy=new Pe(.18,.36,.6),hp=new Pe(1,1,1);function Gu(n,e,t){return n.r+=e.r*t,n.g+=e.g*t,n.b+=e.b*t,n}var Yu=class{constructor(e){this.list=e,this.flash=-1,this.frost=-1,this.dirty=!0;for(let t of e)t.userData.baseColor=t.color.clone(),t.userData.baseEmi=t.emissive?t.emissive.clone().multiplyScalar(t.emissiveIntensity):null,t.userData.pulse==null&&(t.userData.pulse=1)}pulse(e,t){e&&e.userData.pulse!==t&&(e.userData.pulse=t,this.dirty=!0)}apply(e,t){if(e=Rt(e,0,1),t=Rt(t,0,1),!(!this.dirty&&Math.abs(e-this.flash)<.001&&Math.abs(t-this.frost)<.001)){this.flash=e,this.frost=t,this.dirty=!1;for(let i of this.list){let s=i.userData;i.isMeshBasicMaterial?(i.color.copy(s.baseColor).multiplyScalar(s.pulse),t>0&&i.color.lerp(wa.setRGB(.7*2.2,.9*2.2,1*2.2),t*.5),e>0&&Gu(i.color,hp,e*2.5)):(i.color.copy(s.baseColor),t>0&&i.color.lerp(Ry,t*.55),i.emissive.copy(s.baseEmi).multiplyScalar(s.pulse),t>0&&Gu(i.emissive,Cy,t*.6),e>0&&Gu(i.emissive,hp,e*1.6),i.emissiveIntensity=1)}}}},up=new Mt(0,-1,0),rr=new Mt,dp=new Mt,Wu=new Mt,fp=new Mt,Xu=new Mt,pp=new Mt,mp=new $n;function Zu(n,e,t,i,s,r){let o=n.position;rr.subVectors(t,o);let a=rr.length();if(a<1e-4)return;rr.divideScalar(a),a=Rt(a,Math.abs(s-r)+.05,s+r-.02);let l=Rt((s*s+a*a-r*r)/(2*s*a),-1,1),c=Math.sqrt(1-l*l);dp.copy(i).addScaledVector(rr,-i.dot(rr)).normalize(),Wu.copy(o).addScaledVector(rr,s*l).addScaledVector(dp,s*c),fp.subVectors(Wu,o).normalize(),pp.copy(o).addScaledVector(rr,a),Xu.subVectors(pp,Wu).normalize(),n.quaternion.setFromUnitVectors(up,fp),mp.copy(n.quaternion).invert(),Xu.applyQuaternion(mp),e.quaternion.setFromUnitVectors(up,Xu)}function eo(n,e,t){let i=n*374761393+e*668265263+t*2147483647|0;return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}function _p(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=n-s,a=e-r,l=x=>(x%t+t)%t,c=o*o*(3-2*o),h=a*a*(3-2*a),u=eo(l(s),l(r),i),f=eo(l(s+1),l(r),i),d=eo(l(s),l(r+1),i),g=eo(l(s+1),l(r+1),i);return Hn(Hn(u,f,c),Hn(d,g,c),h)}function qu(n,e,t,i,s){let r=0,o=.5,a=1,l=0;for(let c=0;c<i;c++)r+=_p(n*a,e*a,t*a,s+c)*o,l+=o,o*=.5,a*=2;return r/l}function gp(n,e,t,i){let s=Math.floor(n),r=Math.floor(e),o=9,a=9;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let h=s+c,u=r+l,f=(h%t+t)%t,d=(u%t+t)%t,g=h+eo(f,d,i),x=u+eo(f,d,i+9),m=Math.hypot(g-n,x-e);m<o?(a=o,o=m):m<a&&(a=m)}return[o,a]}function Qc(n,e,t,i){let s=new Pn(n,e,e,vn);return s.wrapS=s.wrapT=kn,s.generateMipmaps=!0,s.minFilter=pi,s.magFilter=Cn,s.colorSpace=t?pn:gi,s.anisotropy=i,s.needsUpdate=!0,s}function Py(n,e){let t=n,i=new Uint8Array(t*t*4),s=new Uint8Array(t*t*4),r=to(1234),o=new Float32Array(t*t).fill(1),a=new Float32Array(t*t).fill(0),l=new Float32Array(t*t).fill(0),c=new Float32Array(t*t).fill(0),h=t/512,u=[];(function p(M,y,v,T,A){if(v<70*h&&T<70*h||A>5||A>1&&r()<.18){u.push([M,y,v,T]);return}if(v>T*(.7+r()*.6)){let P=Math.round(v*(.3+r()*.4));p(M,y,P,T,A+1),p(M+P,y,v-P,T,A+1)}else{let P=Math.round(T*(.3+r()*.4));p(M,y,v,P,A+1),p(M,y+P,v,T-P,A+1)}})(0,0,t,t,0);let f=(p,M)=>(M%t+t)%t*t+(p%t+t)%t,d=new Float32Array(t*t);for(let[p,M,y,v]of u){let T=(r()-.5)*.08;for(let C=0;C<v;C++)for(let w=0;w<y;w++)d[f(p+w,M+C)]=T;let A=Math.max(1,Math.round(1.6*h));for(let C=0;C<y;C++)for(let w=0;w<A;w++){let b=f(p+C,M+w);o[b]=.15,a[b]=.4}for(let C=0;C<v;C++)for(let w=0;w<A;w++){let b=f(p+w,M+C);o[b]=.15,a[b]=.4}for(let C=A;C<y;C++){let w=f(p+C,M+A);o[w]=Math.min(o[w],.75)}if(r()<.55&&y>30*h)for(let C=8*h;C<y-6*h;C+=9*h)for(let w of[M+5*h,M+v-5*h])for(let b=-2;b<=2;b++)for(let I=-2;I<=2;I++){let L=Math.hypot(I,b);if(L<2.2*h){let U=f(Math.round(p+C+I),Math.round(w+b));o[U]=1+(1-L/2.2)*.25,a[U]=L>1.4?.2:-.1}}let P=Math.floor(r()*5*h*h+1);for(let C=0;C<P;C++){let w=r()<.5,b=w?p+r()*y:p+(r()<.5?3:y-3),I=w?M+(r()<.5?3:v-3):M+r()*v,L=(1.5+r()*4)*h;for(let U=-6;U<=6;U++)for(let V=-6;V<=6;V++)if(Math.hypot(V,U*1.3)+_p(V*.6+C,U*.6,64,3)*2<L){let O=f(Math.round(b+V),Math.round(I+U));l[O]=1}}}for(let p=0;p<260*h*h;p++){let M=r()*t,y=r()*t,v=r()*ze,T=(6+r()*34)*h,A=.4+r()*.6;for(let P=0;P<T;P++)c[f(Math.round(M),Math.round(y))]=Math.max(c[f(Math.round(M),Math.round(y))],A),M+=Math.cos(v),y+=Math.sin(v)}for(let p=0;p<t;p++)for(let M=0;M<t;M++){let y=p*t+M,v=y*4,T=qu(M/(64*h),p/(64*h),8,4,11),A=qu(M/(18*h),p/(18*h),Math.round(t/(18*h)),3,5),P=ei((T-.42)*2.2),C=.9+d[y]-P*.22-a[y]*.55+(A-.5)*.06;C+=l[y]*.18+c[y]*.1,C=Rt(C,0,1)*255,i[v]=C,i[v+1]=C,i[v+2]=C*.985,i[v+3]=255,s[v]=Rt(o[y]*.9+(A-.5)*.08-l[y]*.12,0,1)*255,s[v+1]=Rt(.5+P*.35+(A-.5)*.12-c[y]*.25-l[y]*.15,.08,1)*255,s[v+2]=Rt(.1+l[y]*.85+c[y]*.5,0,1)*255,s[v+3]=255}let g=Math.max(128,t/2),x=new Uint8Array(g*g*4),m=new Uint8Array(g*g*4);for(let p=0;p<g;p++)for(let M=0;M<g;M++){let y=(p*g+M)*4,v=8/g*2,[T,A]=gp(M*v,p*v,16,21),P=ei(1-(A-T)*5),[C,w]=gp(M*v*3,p*v*3,48,33),b=ei(1-C*2.2),I=qu(M/(g/8),p/(g/8),8,4,7),L=Rt(.78-P*.38+(I-.5)*.25+b*.06,0,1)*255;x[y]=L,x[y+1]=L*.97,x[y+2]=L*.95,x[y+3]=255,m[y]=Rt(.55+T*.5-P*.35+b*.12+(I-.5)*.2,0,1)*255,m[y+1]=Rt(.32+(I-.5)*.4+P*.15,.05,1)*255,m[y+2]=0,m[y+3]=255}return{alb:Qc(i,t,!0,e),rmh:Qc(s,t,!1,e),oalb:Qc(x,g,!0,e),orh:Qc(m,g,!1,e),dispose(){this.alb.dispose(),this.rmh.dispose(),this.oalb.dispose(),this.orh.dispose()}}}function Mp(n,e){let t=e&&e.capabilities?Math.min(8,e.capabilities.getMaxAnisotropy()):4,i=Py(n==="low"?256:512,t),s={},r=l=>new Kt(Object.assign({vertexColors:!0},l)),o=l=>new qs(Object.assign({vertexColors:!0},l)),a=n==="low";s.paint=r({map:i.alb,roughnessMap:i.rmh,metalnessMap:i.rmh,bumpMap:a?null:i.rmh,bumpScale:1.4,roughness:1,metalness:1}),s.metal=r({map:i.alb,roughnessMap:i.rmh,bumpMap:a?null:i.rmh,bumpScale:.9,roughness:.78,metalness:.88}),s.suit=r({roughnessMap:i.orh,bumpMap:a?null:i.orh,bumpScale:.35,roughness:1.9,metalness:0}),s.flesh=a?r({map:i.oalb,roughnessMap:i.orh,roughness:1.2,metalness:0}):o({map:i.oalb,roughnessMap:i.orh,bumpMap:i.orh,bumpScale:2.2,roughness:1.3,metalness:0,clearcoat:.85,clearcoatRoughness:.22,sheen:.4,sheenRoughness:.5,sheenColor:new Pe(.6,.4,.5)}),s.crystal=a?r({roughness:.15,metalness:.1,emissive:new Pe(1,1,1),emissiveIntensity:.32,flatShading:!0}):o({roughness:.08,metalness:.05,clearcoat:1,clearcoatRoughness:.04,iridescence:.55,iridescenceIOR:1.6,emissive:new Pe(1,1,1),emissiveIntensity:.32,envMapIntensity:1.7,flatShading:!0,specularIntensity:1}),s.crystal.onBeforeCompile=l=>{l.fragmentShader=l.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
	totalEmissiveRadiance *= vColor.rgb;`)},s.crystal.customProgramCacheKey=()=>"shard-crystal",s.glow=new on({vertexColors:!0}),s.core=new on({vertexColors:!0}),s.accent=new on({vertexColors:!0}),s.membrane=r({transparent:!0,opacity:.42,side:jt,depthWrite:!1,roughness:.25,metalness:.1,emissive:new Pe(0,0,0)}),s.bubble=o({transparent:!0,opacity:.2,roughness:.02,metalness:0,clearcoat:1,iridescence:a?0:1,iridescenceIOR:1.3,envMapIntensity:2.6,depthWrite:!1,side:jt,emissive:new Pe(0,0,0)}),s.glass=o({transparent:!0,opacity:.5,roughness:.04,metalness:0,clearcoat:1,iridescence:a?0:.4,envMapIntensity:2.2,depthWrite:!1,emissive:new Pe(0,0,0)});for(let l of Object.keys(s))s[l].name="actor-"+l;return{base:s,tex:i,instance(l){let c=s[l];if(!c)throw new Error("mat "+l);let h=c.clone();return h.onBeforeCompile=c.onBeforeCompile,h.customProgramCacheKey=c.customProgramCacheKey,h},dispose(){for(let l of Object.keys(s))s[l].dispose();i.dispose()}}}function eh(n,e,t){if(!n||!n.tiles)return!1;let i=Math.floor(e/20),s=Math.floor(t/20);if(i<0||s<0||i>=n.cols||s>=n.rows)return!1;let r=n.tiles[s*n.cols+i];return r===1||r===6}function bp(n,e){let t=e&&e.level;if(!t)return"floor";let i=n.x+n.w/2,s=n.y+n.h/2;return eh(t,i,n.y+n.h+3)?"floor":eh(t,i,n.y-3)?"ceil":eh(t,n.x-3,s)?"wallL":eh(t,n.x+n.w+3,s)?"wallR":"floor"}var Ce={slate:"#56677a",slateD:"#3d4957",bone:"#a7a294",orange:"#c35f28",suit:"#2c2f34",suitD:"#1c1e22",pouch:"#434336",metal:"#767c86",gun:"#3a3e45",steel:"#9aa3ad"},$u=We("#6cf3ff",3.6),th=We("#6cf3ff",2.4),Ra=We("#86dcff",3.2),Tp=We("#ff4d3a",4),Iy=We("#5dff8a",4),Dy=[5,5,5],Sp={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9"},Ae=(n,e,t,i,s,r)=>tn(n,[e,t,i],s,r),no=(n,e=0,t=-1e9)=>i=>{let s=i.z-e;i.y>t&&(i.x-=n*s*s)},io=new Mt(2.3,21.3,1),Ly=new Mt(11,.25,0),Ny=new Mt(1.25,-2,.8),Uy=new Mt(4.7,-1.5,-.3),Ca=4.9,ih=4.7,Aa=4.1;function Ap(){let n=new vt(.05);n.bone("body","root",0,0,0).bone("pelvis","body",0,15.4,0).bone("spine","pelvis",0,17.2,0).bone("chest","spine",0,20.4,0).bone("head","chest",.5,25,0).bone("uaN","chest",-.4,23,Aa).bone("faN","uaN",-.4,23-Ca,Aa).bone("uaF","chest",-.4,23,-Aa).bone("faF","uaF",-.4,23-Ca,-Aa).bone("gun","chest",io.x,io.y,io.z).bone("pack","chest",-3.3,21.6,0).bone("thrN","pack",-5.5,17.4,1.9).bone("thrF","pack",-5.5,17.4,-1.9).bone("thN","pelvis",0,15,2.3).bone("shN","thN",0,8.2,2.3).bone("ftN","shN",0,1.6,2.35).bone("thF","pelvis",0,15,-2.3).bone("shF","thF",0,8.2,-2.3).bone("ftF","shF",0,1.6,-2.35).bone("ball","root",0,8,0);let e=l=>Ae(l,.5,25,0),t=_.ext([[-2.2,-.3],[-2.75,1],[-2.55,3.1],[-1.5,4.45],[.5,4.85],[2.2,4.25],[3.3,3.05],[2.9,2.75],[3,1.85],[3.25,1],[2.95,-.1],[1.6,-.85],[-.2,-.95],[-1.6,-.75]],4.4,.45,{steps:3});wn(t,l=>{l.x>0&&(l.x-=.05*l.z*l.z*(l.x/3)),l.y>3&&(l.y-=.06*l.z*l.z*(l.y-3)/2)}),n.add("head","paint",e(t),Ce.slate),n.add("head","paint",e(_.ext([[-2.3,3.35],[-1.4,4.6],[.5,5.2],[2.1,4.65],[3,3.6],[2,3.95],[.4,4.45],[-1.2,4]],1.6,.25)),Ce.bone),n.add("head","paint",e(_.ext([[-2.65,.7],[-1,.35],[-1.2,-1.15],[-2.45,-.75]],4,.25)),Ce.slateD),n.add("head","metal",e(_.ext([[2.75,1.7],[3.2,1.78],[3.12,2.88],[2.7,2.8]],3.6,.1)),Ce.suitD),n.add("head","glow",e(_.ext([[2.95,2.05],[3.28,2.1],[3.25,2.5],[2.92,2.46]],3.3,.06)),$u);for(let l of[1,-1]){let c=l*2.2;n.add("head","metal",e(Ae(_.ext([[.2,1.95],[3.15,1.72],[3.2,2.88],[.5,2.7]],.3,.08),0,0,c)),Ce.suitD),n.add("head","glow",e(Ae(_.ext([[.55,2.12],[3.2,2],[3.22,2.55],[.8,2.48]],.22,.05),0,0,c+l*.1)),$u),n.add("head","paint",e(Ae(_.ext([[.5,-.75],[2.95,-.05],[3.15,1.55],[1.6,1.68],[.2,.6]],.45,.14),0,0,c+l*.05)),Ce.slateD),n.add("head","paint",e(Ae(_.ext([[-2.4,3],[-.6,3.75],[1.8,3.55],[1.6,3.15],[-.5,3.3],[-2.2,2.6]],.3,.1),0,0,c+l*.06)),Ce.orange),n.add("head","metal",e(Ae(_.box(1.5,1.7,.5,.18),-1.25,1.55,c+l*.12)),Ce.metal),n.add("head","metal",e(Ae(_.box(.9,.25,.3,.06),-1.25,1,c+l*.4)),Ce.gun),n.add("head","metal",e(Ae(_.box(.9,.25,.3,.06),-1.25,1.55,c+l*.4)),Ce.gun),n.add("head","metal",e(Ae(_.cyl(.42,.48,.8,8),3,.35,l*.85,[0,0,-Math.PI/2+.25])),Ce.gun)}n.add("head","metal",e(Ae(_.cyl(.1,.13,4,5),-1.8,4.5,2.35,[0,0,.3])),Ce.metal),n.add("head","glow",e(Ae(_.sph(.2,6,4),-2.38,6.42,2.35)),Tp),n.add("head","suit",e(Ae(_.cyl(1.25,1.4,1.8,10),0,-1,0)),Ce.suit),n.add("chest","suit",Ae(_.box(5.6,6.4,7.2,1.6,1),0,22,0),Ce.suit);let i=_.ext([[-2.4,19.6],[2.5,19.8],[3.4,21.4],[3.35,23.2],[2.2,24.4],[-1,24.6],[-2.7,23.6],[-3,21]],8.2,.6,{steps:5});wn(i,no(.06)),n.add("chest","paint",i,Ce.slate);let s=_.ext([[1,20.2],[3.25,20.9],[3.65,22.6],[3,23.7],[1.4,23.5]],3.2,.35,{steps:3});wn(s,l=>{l.x-=.06*l.z*l.z-.12}),n.add("chest","paint",s,Ce.bone);for(let l of[1,-1])n.add("chest","paint",Ae(_.ext([[-1.8,23.9],[1.7,23.55],[1.9,23.1],[-1.8,23.45]],.4,.1),0,0,l*3.85),Ce.orange),n.add("chest","metal",Ae(_.box(.9,.9,.5,.2),2.3,21.2,l*3.7),Ce.metal);n.add("chest","metal",Ae(_.torus(1.9,.45,6,16),.3,24.6,0,[Math.PI/2,0,0]),Ce.gun);for(let l=0;l<3;l++)n.add("chest","metal",Ae(_.box(.25,2.8-l*.4,.25),3.25+.1*l,22.2,1.1-l*1.1),Ce.gun);n.add("spine","suit",Ae(_.box(4.6,4.2,6,1.2,1),.1,18.2,0),Ce.suit);for(let l=0;l<3;l++){let c=16.55+l*1.25,h=_.ext([[-2.2,c],[2.4-l*.1,c+.05],[2.6-l*.1,c+.6],[2.35-l*.1,c+1.1],[-2.1,c+1.1]],6.6-l*.2,.3,{steps:3});wn(h,no(.06)),n.add("spine","paint",h,Ce.slateD)}n.add("pelvis","suit",Ae(_.box(5,1.6,7,.5),.1,15.9,0),Ce.suitD),n.add("pelvis","metal",Ae(_.box(.7,1.2,1.8,.2),2.6,15.9,0),Ce.steel),n.add("pelvis","paint",Ae(_.ext([[1,15.2],[2.7,15.1],[2.4,13.4],[1.4,13]],2.6,.3),0,0,0),Ce.slateD);for(let l of[1,-1])n.add("pelvis","suit",Ae(_.box(1.6,1.8,1.2,.35),-1.5,15.5,l*3.45),Ce.pouch),n.add("pelvis","suit",Ae(_.box(1.4,1.6,1.1,.35),.8,15.6,l*3.5),Ce.pouch),n.add("pelvis","suit",Ae(_.sph(1.5,8,6),0,15,l*2.3),Ce.suit);n.add("pelvis","suit",Ae(_.box(1.2,2,4.4,.4),-2.6,15.4,0),Ce.pouch),n.add("pack","paint",Ae(_.box(3.4,6.6,6.2,.8,1),-5,21.3,0),Ce.slateD),n.add("pack","paint",Ae(_.ext([[-6.6,24.2],[-3.4,24.4],[-3.3,25],[-4.4,25.5],[-6.4,25.1]],5,.3),0,0,0),Ce.bone);for(let l=-1;l<=1;l++)n.add("pack","metal",Ae(_.box(.35,5.2,.6,.12),-6.75,21.3,l*1.8),Ce.gun);for(let l of[1,-1]){n.add("pack","metal",Ae(_.cyl(.85,.85,4.6,10),-5,21.4,l*3.45),Ce.metal),n.add("pack","metal",Ae(_.torus(.86,.14,4,12),-5,22.8,l*3.45,[Math.PI/2,0,0]),Ce.gun),n.add("pack","metal",Ae(_.torus(.86,.14,4,12),-5,20,l*3.45,[Math.PI/2,0,0]),Ce.gun),n.add("pack","glow",Ae(_.box(.2,1.4,.2),-4.15,21.4,l*3.9),Ra.map(u=>u*.6));let c=_.lathe([[.45,0],[.7,-.2],[.95,-1.1],[1.02,-1.6],[.86,-1.62],[.62,-.5],[.4,-.3]],12);n.add("pack","metal",Ae(c,-5.5,19,l*1.9,[0,0,-.25]),Ce.gun),n.add("pack","glow",Ae(_.cyl(.78,.78,.12,10),-5.85,17.5,l*1.9,[0,0,-.25]),Ra);let h=_.lathe([[.7,0],[.55,-1.2],[.3,-2.6],[.02,-3.6]],8);n.add(l>0?"thrN":"thrF","glow",Ae(h,-5.5,17.4,l*1.9,[0,0,-.25]),Ra.map(u=>u*.8))}for(let l of[1,-1]){let c=l>0?"uaN":"uaF",h=l>0?"faN":"faF",u=l*Aa,f=-.4,d=23;n.add(c,"suit",Ae(_.sph(1.35,8,6),f,d,u),Ce.suit),n.add(c,"suit",Ae(_.capsule(1.05,3,3,8),f,d-2.6,u),Ce.suit);let g=.68,x=y=>y.map(([v,T])=>[v*g,T*g+.35]),m=(y,v,T,A,P)=>n.add(c,"paint",Ae(_.ext(x(y),v,.16,{steps:2}),f,d,u+l*T,[l*-P,0,0]),A);m([[-2.9,.2],[-2.1,2.2],[.6,2.75],[2.6,1.8],[2.9,-.2],[.2,-.75],[-2.6,-.5]],.5,1.45,Ce.slate,.22),m([[-2.8,-.4],[2.7,-.4],[2.5,-1.75],[-2.4,-1.85]],.45,1.25,Ce.slateD,.12),m([[-2.5,-1.55],[2.4,-1.5],[2.1,-2.75],[-2.1,-2.85]],.4,1.08,Ce.slate,.05),n.add(c,"paint",Ae(_.ext(x([[-2.7,.9],[-1.8,2.45],[.8,2.85],[2.7,1.7],[1.8,1.2],[-1.5,1.4]]),3,.25),f,d,u*1.04+l*.15),Ce.bone),n.add(c,"paint",Ae(_.ext(x([[-1.6,2.15],[.7,2.55],[2.2,1.85],[2,1.55],[.6,2.15],[-1.5,1.85]]),.26,.07),f,d,u+l*1.72,[l*-.22,0,0]),Ce.orange),n.add(c,"metal",Ae(_.cyl(.26,.26,.26,8),f-1.15,d+.6,u+l*1.78,[Math.PI/2,0,0]),Ce.metal),n.add(c,"metal",Ae(_.cyl(.26,.26,.26,8),f+1.25,d+.6,u+l*1.78,[Math.PI/2,0,0]),Ce.metal);let p=_.shell(1.35,1.8,1.35,.3,-.6,Math.PI+.6,.6,2.4,8,4);l<0&&(p=Ta(p)),n.add(c,"paint",Ae(p,f,d-3.1,u),Ce.slateD);let M=d-Ca;n.add(h,"suit",Ae(_.sph(1.05,8,6),f,M,u),Ce.suit),n.add(h,"paint",Ae(_.sph(1,8,6),f-.35,M+.1,u,null,[.8,1,1]),Ce.slateD),n.add(h,"paint",Ae(_.box(2.1,3,2.1,.55,1),f,M-2,u),Ce.slate),n.add(h,"metal",Ae(_.box(.4,2,1,.1),f+1.05,M-2,u+l*.2),Ce.gun),n.add(h,"glow",Ae(_.box(.15,.8,.5),f+1.12,M-1.6,u+l*.6),$u.map(y=>y*.5)),n.add(h,"suit",Ae(_.box(1.6,1.7,1.5,.45,1),f,M-ih+.25,u),Ce.suitD),n.add(h,"metal",Ae(_.box(.5,1.2,1.3,.15),f+.75,M-ih+.3,u),Ce.gun)}for(let l of[1,-1]){let c=l>0?"thN":"thF",h=l>0?"shN":"shF",u=l>0?"ftN":"ftF",f=l*2.3;n.add(c,"suit",Ae(_.capsule(1.5,4.6,3,8),0,11.6,f),Ce.suit);let d=_.ext([[-1.2,14],[1.85,13.9],[2.05,11.2],[1.55,9.5],[-.4,9.55],[-1.5,11.8]],1.6,.4,{steps:2});wn(d,no(.25,0)),n.add(c,"paint",Ae(d,0,0,f+l*.75),Ce.slate),n.add(c,"paint",Ae(_.ext([[1.75,13.6],[2.2,13.5],[2.3,10.5],[1.8,10]],2.4,.2),0,0,f),Ce.slateD),n.add(c,"paint",Ae(_.ext([[-1.6,15.5],[1.9,15.35],[1.75,13],[-1.3,13.4]],.6,.18),0,0,f+l*1.6,[l*.12,0,0]),Ce.slateD),n.add(c,"paint",Ae(_.box(1.2,.3,.3,.1),.3,14.6,f+l*1.95),Ce.orange),n.add(h,"suit",Ae(_.capsule(1.15,4.4,3,8),0,4.9,f),Ce.suit);let g=Ae(_.ext([[.2,9.4],[1.5,9.2],[2.05,8.2],[1.75,6.9],[.6,7.1]],2.2,.4,{steps:2}),0,0,f);wn(g,no(.3,f)),n.add(h,"paint",g,Ce.bone);let x=Ae(_.ext([[.35,7.5],[1.55,7.3],[1.68,5],[1.38,2.8],[.35,2.6]],2.5,.3,{steps:3}),0,0,f);wn(x,no(.2,f)),n.add(h,"paint",x,Ce.slate),n.add(h,"paint",Ae(_.box(1.2,3.4,2,.45),-.95,5.4,f),Ce.slateD),n.add(h,"metal",Ae(_.box(.3,1.6,.4,.1),1.65,5.6,f),Ce.gun);let m=Ae(_.ext([[-1.5,.45],[3,.45],[3.55,.8],[3.25,1.2],[1.8,1.7],[1.3,2.8],[-1.2,3],[-1.75,1.7]],2.6,.42,{steps:2}),0,0,f);wn(m,no(.12,f)),n.add(u,"paint",m,Ce.slateD),n.add(u,"suit",Ae(_.ext([[-1.65,0],[3.3,0],[3.7,.55],[-1.8,.6]],2.75,.2),0,0,f),Ce.suitD),n.add(u,"metal",Ae(_.box(1.1,.8,2.2,.3),2.8,1,f),Ce.metal)}let r=l=>Ae(l,io.x,io.y,io.z);n.add("gun","paint",r(_.ext([[-1.6,-1.1],[4.6,-1.1],[4.95,-.4],[4.95,1],[4.2,1.45],[-.8,1.45],[-1.6,.9]],1.9,.3)),"#46505c"),n.add("gun","suit",r(_.ext([[-6,-1.7],[-4.9,-1.75],[-1.6,-.9],[-1.6,1],[-2.4,1.3],[-5.6,.95],[-6.2,.2]],1.5,.3)),Ce.suit),n.add("gun","suit",r(Ae(_.box(.6,2.8,1.6,.2),-6.15,-.4,0)),Ce.suitD),n.add("gun","suit",r(_.ext([[.6,-1],[1.95,-1],[1.65,-3.4],[.6,-3.65],[.3,-3.2]],1.2,.25)),Ce.suitD),n.add("gun","metal",r(_.ext([[2.4,-1],[3.7,-1],[3.95,-3.5],[2.85,-3.8]],1.3,.2)),Ce.gun),n.add("gun","paint",r(Ae(_.cyl(.8,.8,4.6,12),7.2,.25,0,[0,0,-Math.PI/2])),Ce.slate);for(let l of[5.9,6.9,7.9,8.9])n.add("gun","metal",r(Ae(_.torus(.8,.13,4,12),l,.25,0,[0,Math.PI/2,0])),Ce.gun);n.add("gun","metal",r(Ae(_.cyl(.38,.38,1.2,8),10,.25,0,[0,0,-Math.PI/2])),Ce.metal);let o=_.lathe([[.3,0],[.65,0],[.65,.3],[.5,.36],[.5,.6],[.65,.66],[.65,1.05],[.3,1.05]],10);n.add("gun","metal",r(Ae(o,10,.25,0,[0,0,-Math.PI/2])),Ce.steel),n.add("gun","metal",r(Ae(_.box(4.6,.3,.8,.1),1.6,1.6,0)),Ce.gun),n.add("gun","suit",r(Ae(_.cyl(.55,.6,2.7,10),1.8,2.35,0,[0,0,-Math.PI/2])),Ce.suitD),n.add("gun","metal",r(Ae(_.box(.8,.8,.9,.2),1.2,1.95,0)),Ce.gun),n.add("gun","accent",r(Ae(_.cyl(.42,.42,.1,10),3.2,2.35,0,[0,0,-Math.PI/2])),[1,1,1]),n.add("gun","accent",r(Ae(_.capsule(.42,2.4,2,8),6.6,-.95,0,[0,0,Math.PI/2])),[1,1,1]);for(let l of[5.4,7.8])n.add("gun","metal",r(Ae(_.torus(.48,.12,4,10),l,-.95,0,[0,Math.PI/2,0])),Ce.gun);for(let l of[1,-1])n.add("gun","accent",r(Ae(_.box(4.4,.22,.1),1.9,.5,l*.97)),[1,1,1]);n.add("gun","suit",r(_.ext([[5,-.8],[5.9,-.8],[5.75,-2.6],[5.15,-2.6]],1,.2)),Ce.suitD);let a=l=>Ae(l,0,8,0);n.add("ball","suit",a(_.sph(6.9,12,8)),Ce.suitD),n.add("ball","glow",a(_.torus(7.1,.3,4,28)),th),n.add("ball","glow",a(Ae(_.torus(7.1,.3,4,28),0,0,0,[Math.PI/2,0,0])),th),n.add("ball","glow",a(Ae(_.torus(7.1,.3,4,28),0,0,0,[0,Math.PI/2,0])),th);for(let l=0;l<4;l++)for(let c=0;c<2;c++){let h=l*Math.PI/2+.065,u=(l+1)*Math.PI/2-.065,f=c?Math.PI/2+.06:.07,d=c?Math.PI-.07:Math.PI/2-.06;n.add("ball","paint",a(_.shell(7.75,7.75,7.75,.7,h,u,f,d,5,4)),(l+c)%2?Ce.slate:Ce.bone)}for(let l of[1,-1])n.add("ball","metal",a(Ae(_.cyl(2.3,2.6,1.2,14),0,0,l*7.35,[Math.PI/2,0,0])),Ce.metal),n.add("ball","glow",a(Ae(_.torus(1.55,.2,4,18),0,0,l*7.98)),th),n.add("ball","metal",a(Ae(_.cyl(.7,.7,.5,6),0,0,l*8,[Math.PI/2,0,0])),Ce.gun);return n.build()}function wp(n,e){return 6.8*Math.cos(n)+6.6*Math.cos(n+e)+1.6}var sh=["thN","shN","ftN","thF","shF","ftF","spine","chest","head","pelvisY","pelvisX","twist","spreadN","spreadF"];function Ju(){let n={};for(let e of sh)n[e]=0;return n}function bs(n,e,t){if(!(t<=0))for(let i of sh)n[i]+=(e[i]||0)*t}var nh=new Mt,dw=new Mt,fw=new it,Ep=new Mt,Fy=new Mt(-.4,-1,1.2),ky=new Mt(-.2,-1,-1.1);function Rp(n,e){let t=n.bones,i={yaw:0,morph:0,crouch:0,air:0,water:0,phase:0,run:0,land:0,prevVy:0,wasGround:!0,aim:0,recoil:0,lastCd:0,time:0,pose:Ju(),roll:0,thrust:0,fireGlow:0,weapon:null,aimDown:0},s=n.byMat.accent,r=new Mt;function o(l){if(i.weapon===l)return;i.weapon=l;let c=new Pe(Sp[l]||Sp.spread);s.userData.baseColor.setRGB(c.r*4,c.g*4,c.b*4),n.fx.dirty=!0}function a(l,c,h,u){h=Math.min(h,.05),i.time+=h,o(l.weapon),i.water=xt(i.water,l.inWater?1:0,5,h);let f=1-.45*i.water;i.yaw=xt(i.yaw,l.facing>=0?0:-Math.PI,24,h);let d=l.morph?1:0;i.morph=d>i.morph?Math.min(1,i.morph+h/.15):Math.max(0,i.morph-h/.15),i.crouch=xt(i.crouch,l.crouch?1:0,28,h);let g=!!l.onGround;i.air=xt(i.air,g?0:1,g?30:14,h),g&&!i.wasGround&&i.prevVy>260&&(i.land=Rt(i.prevVy/650,.35,1)),i.land=Math.max(0,i.land-h*5.5),i.wasGround=g,i.prevVy=l.vy;let x=Math.abs(l.vx),m=Rt(x/205,0,1);if(g){let re=Hn(22,62,m);i.phase+=x*h/re*ze}i.run=xt(i.run,g&&!l.crouch&&x>8?ei(x/70):0,12,h);let p=0,M=!1;l.beamActive&&l.beam?(p=Math.atan2(-l.beam.dy,Math.abs(l.beam.dx)||.001),M=!0):l.weapon==="spread"&&l.aimDir&&(p=l.aimDir<0?Math.PI/2:-Math.PI/2),l.crouch&&(p=Math.min(p,0)-.04),i.aim=xt(i.aim,p,M?40:22,h),i.aimDown=xt(i.aimDown,!g&&p<-1?1:0,16,h),l.cooldown>i.lastCd+1e-4&&!M&&(i.recoil=1,i.fireGlow=1),i.lastCd=l.cooldown||0,M&&(i.recoil=Math.max(i.recoil,.25+.15*Math.sin(i.time*90)),i.fireGlow=1),i.recoil=Math.max(0,i.recoil-h*9),i.fireGlow=Math.max(0,i.fireGlow-h*5);let y=i.time*f,v=i.phase,T=Ju(),A={thN:.06,shN:-.14,ftN:.08,thF:-.1,shF:-.1,ftF:.2,spine:-.03,chest:.015*Math.sin(y*1.7),head:.02*Math.sin(y*.7)},P=Hn(.5,1,m),C=re=>({th:(.66*Math.sin(re)+.06)*P,sh:-(.18+1.3*Math.pow(Math.max(0,Math.cos(re+.5)),1.3))*P,ft:.35*Math.cos(re+.2)*P-.05}),w=C(v),b=C(v+Math.PI),I={thN:w.th,shN:w.sh,ftN:w.ft,thF:b.th,shF:b.sh,ftF:b.ft,spine:-.14*m,chest:-.03,head:.1*m,twist:.1*Math.sin(v)*m},L=ei((l.vy+120)/520),U={thN:1,shN:-1.55,ftN:.25,thF:-.3,shF:-.8,ftF:-.35,spine:-.06,head:.08},V={thN:.35,shN:-.45,ftN:-.1,thF:-.12,shF:-.35,ftF:-.3,spine:.04,head:-.05,spreadN:.08,spreadF:.08},Y={thN:1.35,shN:-2.1,ftN:.3,thF:1.15,shF:-1.95,ftF:.2,spine:-.15,head:-.1},O=Math.sin(y*2.4),W={thN:.25+.35*O,shN:-.55-.3*Math.sin(y*2.4+1),ftN:-.35,thF:.25-.35*O,shF:-.55-.3*Math.sin(y*2.4+1+Math.PI),ftF:-.35,spine:-.18,head:.15},X={thN:.28,shN:-1.88,ftN:-1.25,thF:1.55,shF:-1.75,ftF:.18,spine:-.42,chest:-.08,head:.38,pelvisX:-.6},j={thN:1.6,shN:-2.3,thF:1.6,shF:-2.3,spine:-.9,chest:-.4,head:-.4},oe=i.air*(1-i.crouch),pe=1-oe,Se=i.crouch*pe,Ne=i.run*(1-i.crouch)*pe,ke=Math.max(0,pe-Se-Ne);if(bs(T,A,ke),bs(T,I,Ne),bs(T,X,Se),oe>0){let re=i.water,ce=Ju();bs(ce,U,(1-L)*(1-i.aimDown)),bs(ce,V,L*(1-i.aimDown)),bs(ce,Y,i.aimDown),bs(T,ce,oe*(1-re)),bs(T,W,oe*re)}if(i.morph>0){let re=ei(i.morph);for(let ce of sh)T[ce]=Hn(T[ce],j[ce]||0,re)}let De=Hn(26,6,i.water);for(let re of sh)i.pose[re]=xt(i.pose[re],T[re],De,h);let ee=i.pose;t.body.rotation.set(0,i.yaw,0);let ne=Math.max(1e-4,1-ei(i.morph*1.7));t.body.scale.setScalar(ne),t.body.position.set(0,8*(1-ne),0);let me=Math.max(1e-4,ei((i.morph-.12)/.7));t.ball.scale.setScalar(me),i.roll-=l.vx*h/7.8,t.ball.rotation.set(0,0,i.roll+(1-me)*2.5),t.thN.rotation.set(ee.spreadN,0,ee.thN),t.shN.rotation.set(0,0,ee.shN),t.ftN.rotation.set(0,0,ee.ftN),t.thF.rotation.set(-ee.spreadF,0,ee.thF),t.shF.rotation.set(0,0,ee.shF),t.ftF.rotation.set(0,0,ee.ftF);let fe,ge=wp(ee.thN,ee.shN),Ye=wp(ee.thF,ee.shF),ft=Math.max(ge,Ye)-15,k=-1.2*(1-L)*(1-i.water);fe=Hn(ft,k,oe)-i.land*2.4+ke*.12*Math.sin(y*1.7),i.crouch>.01&&(fe=Hn(fe,-6.8,Se)),t.pelvis.position.set(ee.pelvisX,15.4+fe,0),t.pelvis.rotation.set(0,ee.twist*.5,0),t.spine.rotation.set(0,-ee.twist*.4,ee.spine-i.land*.25+i.aim*.08),t.chest.rotation.set(0,-ee.twist*.5,ee.chest+i.aim*.1),t.chest.scale.set(1,1+.012*Math.sin(y*1.7)*ke,1),t.head.rotation.set(0,0,ee.head+i.aim*.35-(ee.spine+ee.chest)*.5),t.pack.rotation.set(0,0,-i.land*.12+(l.vy||0)*12e-5*oe);let B=ee.spine-i.land*.25+i.aim*.08+ee.chest+i.aim*.1,H=i.aim-B;t.gun.rotation.set(0,0,H);let K=i.recoil*1.1;t.gun.position.set(t.gun.userData.rest.x-Math.cos(H)*K,t.gun.userData.rest.y-Math.sin(H)*K,t.gun.userData.rest.z),i.crouch>.01&&(t.gun.position.y-=.8*Se),t.gun.updateMatrix(),nh.copy(Ny).applyMatrix4(t.gun.matrix),Zu(t.uaN,t.faN,nh,Fy,Ca,ih),nh.copy(Uy).applyMatrix4(t.gun.matrix),Zu(t.uaF,t.faF,nh,ky,Ca,ih);let Z=oe*(l.vy<0?1:.25)*(1-i.water*.7)*(1-i.morph);i.thrust=xt(i.thrust,Z,14,h);let J=i.thrust*(.85+.15*Math.sin(i.time*47));t.thrN.scale.set(.6+.4*J,Math.max(1e-4,J*1.1),.6+.4*J),t.thrF.scale.copy(t.thrN.scale),n.fx.pulse(s,1+i.fireGlow*.9+(M?.4:0)),n.fx.apply(0,0),Ep.copy(Ly),t.gun.updateWorldMatrix(!0,!1),r.copy(Ep).applyMatrix4(t.gun.matrixWorld)}return{update:a,st:i,muzzle:r}}function Cp(){let n=new vt(.05);n.bone("body","root",0,0,0).bone("flA","body",-13.8,-.4,3).bone("flB","body",-13.8,-.4,-3).bone("strobe","body",-9.6,5.6,0).bone("tipN","body",-8.7,-.2,10.4).bone("tipF","body",-8.7,-.2,-10.4);let e=_.lathe([[.001,13.2],[.5,12.4],[1.2,10.4],[2,7],[2.55,3.5],[2.75,0],[2.6,-5],[2.3,-9],[1.9,-11.6],[1.4,-12.2],[.001,-12.3]],16);tn(e,null,[0,0,-Math.PI/2]),wn(e,t=>{t.y*=.72,t.y<0&&(t.y*=.8),t.z*=1.15},"smooth"),n.add("body","paint",e,Ce.bone),n.add("body","paint",_.ext([[-10.5,1],[2,1.3],[5.5,1.6],[3,2.4],[-6,2.6],[-10.8,2]],2.2,.35),Ce.slate);for(let t of[1,-1]){n.add("body","paint",Ae(_.ext([[-3.5,-1.6],[4.5,-1.2],[5.6,-.2],[4.2,.9],[-3.5,1]],1.6,.35),0,0,t*2.2),Ce.slate),n.add("body","metal",Ae(_.box(.4,2,1.2,.1),5.4,-.3,t*2.3),Ce.suitD),n.add("body","accent",Ae(_.box(3.5,.18,.12),1,-.4,t*3.06),We("#6cf3ff",3));let i=_.ext([[4,-1.8],[-5.5,-10.6],[-9.2,-10.6],[-8.6,-2.2]],.55,.2);tn(i,null,[Math.PI/2,0,0]),t<0&&(i=Ta(i)),n.add("body","paint",Ae(i,0,-.6,0,[t*-.05,0,0]),Ce.slate);let s=_.ext([[-6,-3],[-8.9,-9.8],[-9.9,-9.8],[-9.6,-3]],.4,.12);tn(s,null,[Math.PI/2,0,0]),t<0&&(s=Ta(s)),n.add("body","paint",Ae(s,0,-.55,0),Ce.orange),n.add("body","metal",Ae(_.cyl(1.55,1.7,8.4,14),-8.2,-.4,t*3,[0,0,Math.PI/2]),Ce.metal),n.add("body","paint",Ae(_.cyl(1.7,1.75,3.4,14),-6.5,-.4,t*3,[0,0,Math.PI/2]),Ce.slateD);let r=_.lathe([[1.5,0],[1.75,-.4],[1.55,-1.6],[1.25,-1.62],[1.3,-.4]],14);n.add("body","metal",Ae(r,-12.3,-.4,t*3,[0,0,-Math.PI/2]),Ce.gun),n.add("body","glow",Ae(_.cyl(1.25,1.25,.1,12),-13.8,-.4,t*3,[0,0,Math.PI/2]),Ra);let o=_.lathe([[1.15,0],[.9,-2],[.45,-4.2],[.02,-5.6]],10);n.add(t>0?"flA":"flB","glow",Ae(o,-13.8,-.4,t*3,[0,0,-Math.PI/2]),Ra.map(l=>l*.7)),n.add("body","paint",Ae(_.ext([[-11.2,1.4],[-8,1.6],[-9,6],[-10.6,6.2]],.5,.15),0,0,t*2,[t*.32,0,0]),Ce.slate);let a=_.ext([[8.6,-2],[6.4,-4.2],[5.4,-4.2],[6.2,-2]],.35,.1);tn(a,null,[Math.PI/2,0,0]),t<0&&(a=Ta(a)),n.add("body","paint",Ae(a,0,.2,0),Ce.slateD),n.add("body","metal",Ae(_.capsule(.55,4,2,8),-1,-1,t*6.4,[0,0,Math.PI/2]),Ce.gun),n.add("body","metal",Ae(_.cyl(.22,.22,2.5,6),2.2,-1,t*6.4,[0,0,Math.PI/2]),Ce.metal),n.add(t>0?"tipN":"tipF","glow",Ae(_.sph(.42,6,4),-8.7,-.2,t*10.4),t>0?Iy:Tp)}return n.add("body","crystal",Ae(_.ell(3.6,1.35,1.35,14,8),3.6,1.65,0),"#1c4658"),n.add("body","metal",Ae(_.torus(1.42,.16,4,14,Math.PI),3,1.6,0,[0,Math.PI/2,0]),Ce.gun),n.add("strobe","glow",Ae(_.sph(.32,6,4),-9.6,5.9,0),Dy),n.build()}function Pp(n){let e=n.bones,t={pitch:0,roll:0,thrust:.6,time:0};function i(s,r,o){o=Math.min(o,.05),t.time+=o;let a=s.vy||0,l=s.vx||0;t.pitch=xt(t.pitch,Rt(-a/240,-1,1)*.2,10,o),t.roll=xt(t.roll,Rt(a/240,-1,1)*.55,8,o),t.thrust=xt(t.thrust,Rt(.55+l/240*.5,.2,1.1),10,o),e.body.rotation.set(t.roll+Math.sin(t.time*1.3)*.03,0,t.pitch+Math.sin(t.time*1.7)*.015),e.body.position.y=Math.sin(t.time*2.1)*.25;let c=t.thrust*(.88+.12*Math.sin(t.time*53));e.flA.scale.set(Math.max(1e-4,c),.7+.3*c,.7+.3*c),e.flB.scale.copy(e.flA.scale);let h=t.time%1.1<.07?1:1e-4;e.strobe.scale.setScalar(h);let u=.75+.25*Math.sin(t.time*6);e.tipN.scale.setScalar(u),e.tipF.scale.setScalar(u),n.fx.apply(0,0)}return{update:i,st:t}}var E=(n,e,t,i,s,r)=>tn(n,[e,t,i],s,r),st=(n,e,t,i,s,r=6,o=6)=>_.taperTube([n,e,t],a=>Hn(i,s,a),r,o),Oy=(n,e,t,i)=>{let s=Math.sin(Math.round(n*97)*12.9898+Math.round(e*97)*78.233+Math.round(t*97)*37.719+i*11.1)*43758.5453;return s-Math.floor(s)};function Lt(n,e=1,t=.22,i=1,s=1,r=1,o=1){let a=_.ico(1,i);return wn(a,l=>{let c=Oy(l.x,l.y,l.z,e);l.multiplyScalar(n*(1+(c-.5)*t*2)),l.x*=s,l.y*=r,l.z*=o},!1),a.computeVertexNormals(),a}var Ip=(n,e,t,i)=>{let s=Math.floor(n),r=Math.floor(e),o=Math.floor(t),a=n-s,l=e-r,c=t-o,h=a*a*(3-2*a),u=l*l*(3-2*l),f=c*c*(3-2*c),d=(x,m,p)=>{let M=Math.sin(x*127.1+m*311.7+p*74.7+i*19.3)*43758.5453;return M-Math.floor(M)},g=(x,m,p)=>x+(m-x)*p;return g(g(g(d(s,r,o),d(s+1,r,o),h),g(d(s,r+1,o),d(s+1,r+1,o),h),u),g(g(d(s,r,o+1),d(s+1,r,o+1),h),g(d(s,r+1,o+1),d(s+1,r+1,o+1),h),u),f)};function ln(n,e,t,i=1,s=.12,r=14,o=10){let a=_.ell(1,1,1,r,o);return wn(a,l=>{let c=Ip(l.x*1.6+5,l.y*1.6,l.z*1.6,i)*.65+Ip(l.x*4+9,l.y*4,l.z*4,i+3)*.35;l.multiplyScalar(1+(c-.5)*s*2.4),l.x*=n,l.y*=e,l.z*=t},"smooth"),a}function Zt(n,e,t,i,s="crystal"){for(let[r,o,a,l,c,h,u,f]of t)n.add(e,s,E(_.crystal(l,c,6,.32,f||1),r,o,a,[h||0,(f||1)*.7,u||0]),i)}function so(n,e,t,i,s,r,o,a,l,c="#24221f"){n.bone(e,t,i[0],i[1],i[2]).bone(e+"k",e,s[0],s[1],s[2]);let h=[(i[0]+s[0])/2,(i[1]+s[1])/2+o*.6,(i[2]+s[2])/2],u=[(s[0]+r[0])/2+o*.3,(s[1]+r[1])/2+o*.3,(s[2]+r[2])/2];n.add(e,a,st(i,h,s,o,o*.8),l),n.add(e,"suit",E(_.sph(o*.85,7,5),s[0],s[1],s[2]),c),n.add(e+"k",a,st(s,u,r,o*.78,o*.22),l)}function Dp(n,e,t,i,s){let r=!!(i&&i.freeze>0),o=r?0:Math.min(s,.05);n.time+=o;let a=t&&t.hitFlash>0?Math.min(1,t.hitFlash*14):0,l=r?Math.min(1,i.freeze*2):0;return n.flash=a,n.frost=l,o}function Lp(n,e){e.fx.apply(n.flash,n.frost)}function Vn(n,e,t,i=10){return n.yaw=xt(n.yaw,e>=0?0:-Math.PI,i,t),n.yaw}function Yn(n,e){let t=e&&e.player;return t?Math.sign(t.x+t.w/2-(n.x+n.w/2))||n.facing||-1:n.facing||-1}function Ss(n,e,t=.5){let i=e&&e.player;return i?Math.atan2(-(i.y+i.h/2-(n.y+n.h*t)),i.x+i.w/2-(n.x+n.w/2)):Math.PI}function lr(n,e,t,i=1.6){let s=e.fireT!=null?e.fireT:1;n.lastFire!=null&&s>n.lastFire+.05&&(n.kick=1),n.lastFire=s,n.kick=Math.max(0,(n.kick||0)-t*5),n.charge=s<.45&&s>0?1-s/.45:0}function Pa(n,e){let t=!n.vy||Math.abs(n.vy)<.001,i=(n.t||0)%e,s=t?ei((i-(e-.3))/.3):0,r=t?0:Rt((n.vy||0)/400,-1,1);return{ground:t,crouch:s,air:r}}function rh(n,e,t,i,s){n.mount==null&&(n.mount=bp(t,i));let r=e.bones.root;return n.mount==="ceil"?(r.rotation.set(0,0,Math.PI),r.position.set(0,s,0)):n.mount==="wallL"?(r.rotation.set(0,0,-Math.PI/2),r.position.set(-s/2,s/2,0)):n.mount==="wallR"&&(r.rotation.set(0,0,Math.PI/2),r.position.set(s/2,s/2,0)),n.mount}function oh(n,e){return n==="ceil"?e-Math.PI:n==="wallL"?e+Math.PI/2:n==="wallR"?e-Math.PI/2:e}function ah(n,e,t,i=-.35,s=1.45){let r=Math.cos(e)>=0;Vn(n,r?1:-1,t,8);let o=r?e:Math.PI-e;return o>Math.PI&&(o-=ze),n.pitch=xt(n.pitch||0,Rt(o,i,s),10,t),n.pitch}function Ia(n,e,t,i){n.rotation.set(-e*i,e*t,0)}var Ct={chitin:"#6e3320",chitinL:"#8e4628",chitinD:"#3e1d12",rock:or("#7c4a32","#5e3424",2.2,"#9a6a48"),rockL:or("#8e5a3c","#6e402a",2,"#b08060"),rockD:"#4a2a1c",crys:"#4f97ff",bronze:"#7a6040",bone:"#d2bc98"},lh=We("#ffad3a",3.2),Fp=We("#7fc4ff",3),qt={shell:"#3e555c",shellL:"#58747a",stone:"#4f5f66",stoneD:"#333f44",patina:"#4d6b5e",patinaD:"#344a42",flesh:"#6a4a5a",fleshL:"#86607a",crys:"#3fd6c8",eelD:"#24393f",eelL:"#5b7f86"},ro=We("#3fe6d4",3.2),Da=We("#45f0dc",3.6);function zy(){let n=new vt;n.bone("body","root",0,7,0).bone("head","body",7.2,7.6,0).bone("crys","body",-1,10.8,0),n.add("body","suit",E(_.ell(7,2.5,4.4,14,8),-.4,6.3,0),Ct.chitinD),n.add("body","paint",E(_.ell(4.4,3,4.2,12,8),-4.4,7.3,0),Ct.chitinD);for(let i of[1,-1]){n.add("body","paint",E(_.shell(8.2,5.4,5.7,.55,i>0?.06:Math.PI+.06,i>0?Math.PI-.06:ze-.06,0,1.64,12,6),-1.6,7.5,0),Ct.chitin);for(let[s,r,o,a]of[[-3.2,12,3.1,2],[.8,12.3,2.7,3],[-6,10.4,3.7,4],[3.6,10.6,3.6,5]])n.add("body","suit",E(Lt(1,a*7+(i>0?1:2),.35,0,1.6,.55,1.15),s,r,i*o,[i*.5,0,0]),Ct.rockL);n.add("body","glow",E(_.box(2.6,.22,.2),-1.8,9.2,i*5.55,[0,0,.05]),Fp.map(s=>s*.5))}n.add("body","paint",E(_.shell(3.8,3.3,4.5,.5,0,ze,0,1.75,12,5),4.2,7.6,0),Ct.chitinL),n.add("head","paint",E(_.ell(2.3,2.1,2.8,10,8),8,7.5,0),Ct.chitinD);for(let i of[1,-1])n.add("head","glow",E(_.ell(.7,.8,.5,8,6),9.5,8.4,i*1.7),lh),n.add("head","paint",st([9.8,6.8,i*1.3],[11.4,6.6,i*1.05],[11.7,5.5,i*.2],.55,.1),Ct.chitinD),n.add("head","suit",st([9.4,9.2,i*1],[11,11.4,i*1.8],[13.2,12.1,i*2.4],.17,.07,6,4),Ct.chitinD);Zt(n,"crys",[[-1.2,10.6,0,1.75,9.8,.05,.14,3],[-3.9,10.4,1.5,1.25,7,.32,.36,5],[1.6,11,-1.1,1.1,6.2,-.26,-.3,7],[-5.9,9.6,-1.7,.9,4.2,-.42,.6,9],[2.9,10.4,1.9,.8,3.6,.45,-.42,11],[-2.6,10.9,-2.4,.7,3,-.6,.2,13]],Ct.crys);let e=[4.2,.6,-3.2],t=[2.4,.3,-2.2];for(let i=0;i<6;i++){let s=i%2?-1:1,r=Math.floor(i/2),o=e[r],a=t[r];so(n,"l"+i,"body",[o,6.6,s*3.6],[o+a*.5,9.8,s*7.6],[o+a,.3,s*9.3],.8,"paint",Ct.chitinD)}return n.build()}function By(n,e,t,i,s){n.root.rotation.y=Vn(e,t.facing||-1,s,8),e.phase+=Math.abs(t.vx||0)*s/15*ze;for(let r=0;r<6;r++){let o=r%2?-1:1,a=r===0||r===3||r===4,l=e.phase+(a?0:Math.PI),c=.34*Math.max(0,Math.cos(l));Ia(n["l"+r],o,.36*Math.sin(l),c),n["l"+r+"k"].rotation.x=-o*c*.7}n.body.position.y=7+.35*Math.abs(Math.sin(e.phase*2))+.12*Math.sin(e.time*2),n.body.rotation.x=.04*Math.sin(e.phase),n.head.rotation.y=.18*Math.sin(e.time*1.3),n.crys.rotation.z=.025*Math.sin(e.time*2.2)}function Hy(){let n=new vt;n.bone("body","root",0,10,0).bone("head","body",6.6,9.6,0),n.add("body","suit",E(Lt(7,4,.22,1,1.18,.95,1),-.6,11.2,0),Ct.rock),n.add("body","suit",E(Lt(3.2,5,.3,0,1.6,.55,1.25),-2.2,17.4,.4,[0,0,.15]),Ct.rockL),n.add("body","suit",E(Lt(2.6,6,.3,0,1.5,.55,1.2),2.6,16.4,-1.6,[.2,0,-.25]),Ct.rockL),n.add("body","suit",E(Lt(2.4,7,.3,0,1.5,.6,1.1),-5.6,14.6,1.8,[-.2,0,.6]),Ct.rockL),n.add("body","suit",E(_.ell(5.6,2.4,4.6,12,6),0,6.6,0),Ct.rockD),Zt(n,"body",[[-3.2,15.2,3.6,.95,4.2,.55,.3,2],[1.4,16.8,-3,.85,3.6,-.6,-.2,4],[-6,12.8,-2.4,.7,3,-.45,.8,6],[4.6,14,2.6,.6,2.4,.5,-.6,8]],Ct.crys),n.add("head","paint",E(_.ell(2.7,2.2,3,10,8),7.4,9.1,0),Ct.rockD),n.add("head","suit",E(Lt(1.7,9,.3,0,1.3,.7,1.4),7.2,10.8,0),Ct.rock);for(let t of[1,-1])n.add("head","glow",E(_.sph(.55,6,4),9.6,9.8,t*1.3),lh),n.add("head","glow",E(_.sph(.38,6,4),9.1,10.7,t*2),lh),n.add("head","paint",st([9.4,8,t*1.4],[10.9,7.6,t*1.2],[11.2,6.7,t*.4],.5,.1),Ct.chitinD);let e=[3.6,3.6,-3.6,-3.6];for(let t=0;t<4;t++){let i=t%2?-1:1,s=e[t];so(n,"l"+t,"body",[s,8.2,i*4.4],[s*1.35,11.6,i*8.4],[s*1.55,.3,i*9.6],1.15,"paint",Ct.chitinD)}return n.build()}function Vy(n,e,t,i,s){let r=Pa(t,1.2),o=Math.abs(t.vx||0)>1?Math.sign(t.vx):Yn(t,i);n.root.rotation.y=Vn(e,o,s,9),e.cr=xt(e.cr||0,r.crouch,20,s),e.air=xt(e.air||0,r.air,14,s);let a=Math.max(0,-e.air),l=Math.max(0,e.air);n.body.position.y=10-3.4*e.cr+.15*Math.sin(e.time*2.5),n.body.rotation.z=-.22*e.air+.12*e.cr;for(let c=0;c<4;c++){let h=c%2?-1:1,u=c<2?1:-1,f=.45*e.cr-.35*a+.15*l;Ia(n["l"+c],h,u*(.1+.25*a-.2*l),f),n["l"+c+"k"].rotation.x=h*(.5*e.cr-.25*a)}n.head.rotation.z=.12*e.cr+.06*Math.sin(e.time*3)}function Gy(){let n=new vt;n.bone("yaw","root",0,9,0).bone("aim","yaw",0,10.2,0).bone("gun","aim",0,10.2,0),n.add("root","suit",E(Lt(6,11,.3,1,1.4,.55,1.1),0,2,0),Ct.rock),n.add("root","suit",E(Lt(3,12,.35,0,1.2,.8,1.2),-7.2,1.6,2.6),Ct.rockD),n.add("root","suit",E(Lt(2.4,13,.35,0,1.3,.7,1.1),6.8,1.2,-2.2),Ct.rockL),Zt(n,"root",[[-4.5,3.8,4.2,.8,3.6,.6,.4,3],[5.2,3.4,3.8,.7,3,.7,-.5,5]],Ct.crys),n.add("root","metal",E(_.torus(5,.85,6,20),0,6.8,0,[Math.PI/2,0,0]),Ct.bronze);for(let e=0;e<6;e++){let t=e/6*ze;n.add("root","metal",E(_.cyl(.4,.4,.8,6),Math.cos(t)*5,7.6,Math.sin(t)*5),"#4a4036")}n.add("yaw","metal",E(_.cyl(3.4,4.2,3,12),0,8.4,0),"#3e3a34"),n.add("aim","paint",E(_.sph(5.4,16,12),0,10.6,0),"#8a5636"),n.add("aim","paint",E(_.shell(5.9,5.9,5.9,.5,-1.2,1.2,.35,2.4,10,6),0,10.6,0),Ct.rockL);for(let e of[1,-1])n.add("aim","paint",E(_.ext([[-4,-1],[2,-.6],[3.5,1.6],[-3.2,2.2]],.6,.2),0,10.6,e*5.8),Ct.chitinD);n.add("aim","metal",E(_.torus(1.9,.45,6,16),5.1,11.2,0,[0,Math.PI/2,0]),"#2e2a26"),n.add("aim","core",E(_.sph(1.7,12,10),5.4,11.6,0,null,[.75,1,1]),We("#ff8a3a",2.6)),n.add("aim","metal",E(_.torus(1.75,.3,5,16),5.6,11.6,0,[0,Math.PI/2,0]),"#2e2a26");for(let e of[2.3,-2.3])n.add("gun","metal",E(_.cyl(.75,.85,7,10),7.6,8.9,e,[0,0,-Math.PI/2]),"#3a3632"),n.add("gun","metal",E(_.cyl(.95,.95,1.2,10),11,8.9,e,[0,0,-Math.PI/2]),"#6a5a44");return n.build()}function Wy(n,e,t,i,s,r){let o=rh(e,r,t,i,20),a=oh(o,t.aim!=null?-t.aim:Ss(t,i)),l=ah(e,a,s,-.5,1.5);n.yaw.rotation.y=e.yaw,n.aim.rotation.z=l,lr(e,t,s),n.gun.position.x=-e.kick*1.6,r.fx.pulse(r.byMat.core,.7+e.charge*1.6+.15*Math.sin(e.time*4))}function Xy(){let n=new vt;n.bone("body","root",0,8,0).bone("head","body",5.6,8.6,0).bone("ab0","body",-2.2,8,0).bone("ab1","ab0",-5.4,7.6,0).bone("ab2","ab1",-8.2,7,0).bone("wN","body",.6,10.2,1.5).bone("wF","body",.6,10.2,-1.5).bone("wN2","body",-1.2,10,1.3).bone("wF2","body",-1.2,10,-1.3),n.add("body","paint",E(_.ell(3.4,2.7,2.6,12,8),.6,8.4,0),Ct.chitin),n.add("body","paint",E(_.shell(3.6,3,2.8,.4,0,ze,0,1.2,12,4),.6,8.6,0),"#b8742e"),n.add("head","paint",E(_.ell(2,2,2.1,10,8),6,8.6,0),Ct.chitinD);for(let t of[1,-1]){n.add("head","glow",E(_.ell(1,1.35,.8,8,6),6.8,9.2,t*1.35),lh),n.add("head","paint",st([7.4,7.6,t*.8],[8.6,7,t*.7],[8.7,6.2,t*.15],.38,.08),Ct.chitinD),n.add("head","suit",st([6.8,10.2,t*.6],[8,12.4,t*1],[9.6,13,t*1.4],.14,.06,6,4),Ct.chitinD);for(let i=0;i<3;i++)n.add("body","suit",st([1.8-i*1.4,6.3,t*.9],[2.4-i*1.8,3.6,t*2.2],[1.6-i*2.4,1,t*2.6],.22,.07,6,4),Ct.chitinD)}n.add("ab0","paint",E(_.ell(2.4,2.3,2.3,10,8),-3,7.9,0),"#b8742e"),n.add("ab0","paint",E(_.torus(2.1,.32,4,14),-4.4,7.7,0,[0,Math.PI/2,.15]),Ct.chitinD),n.add("ab1","paint",E(_.ell(2.6,2.4,2.4,10,8),-6.2,7.3,0),Ct.chitinD),n.add("ab1","paint",E(_.torus(2.25,.34,4,14),-6.4,7.3,0,[0,Math.PI/2,.25]),"#b8742e"),n.add("ab2","paint",E(_.ell(2,1.8,1.8,10,8),-9,6.6,0),"#b8742e"),n.add("ab2","crystal",E(_.crystal(.7,4.2,6,.4,5),-10.4,6.2,0,[0,0,Math.PI/2+.35]),Ct.crys),n.add("ab2","glow",E(_.sph(.45,6,4),-10.6,6.2,0),Fp);let e=(t,i)=>_.membrane([[0,0],[-1.2,i*.6],[-t*.55,i],[-t,i*.85],[-t*.7,i*.35],[-t*.25,.2]]);for(let[t,i,s,r]of[["wN",1.5,9,8.5],["wF",-1.5,9,8.5],["wN2",1.3,6.5,6],["wF2",-1.3,6.5,6]]){let o=t.endsWith("2")?-1.2:.6,a=t.endsWith("2")?10:10.2;n.add(t,"membrane",E(e(s,r),o,a,i),"#d8b07a"),n.add(t,"paint",st([o,a,i],[o-s*.3,a+r*.85,i],[o-s,a+r*.85,i],.18,.06,8,4),Ct.chitinD)}return n.build()}function qy(n,e,t,i,s){let r=Yn(t,i);n.root.rotation.y=Vn(e,r,s,6);let o=e.py!=null&&s>0?(t.y-e.py)/s:0;e.py=t.y,e.bank=xt(e.bank||0,Rt(-o/120,-1,1),6,s),n.body.rotation.z=e.bank*.25;let a=Math.sin(e.time*ze*14),l=Math.sin(e.time*ze*14+1.2);n.wN.rotation.x=-.25-.9*a,n.wF.rotation.x=.25+.9*a,n.wN2.rotation.x=-.35-.8*l,n.wF2.rotation.x=.35+.8*l,n.ab0.rotation.z=.1*Math.sin(e.time*3),n.ab1.rotation.z=.14*Math.sin(e.time*3-.7)-.1,n.ab2.rotation.z=.2*Math.sin(e.time*3-1.4)-.15,n.head.rotation.y=.15*Math.sin(e.time*1.7)}function Yy(){let n=new vt;n.bone("body","root",0,8,0).bone("spin","body",0,8,0),n.add("body","flesh",E(ln(4.3,4.5,4.3,3,.1),0,8,0),"#8a5a3a"),n.add("body","core",E(_.torus(4.15,.34,6,24),0,8,0,[Math.PI/2,0,0]),We("#7fc4ff",2)),n.add("body","core",E(_.sph(1.1,8,6),0,12.4,0),We("#9fd4ff",1.6));let e=12;for(let t=0;t<e;t++){let i=1-(t+.5)/e*2,s=Math.sqrt(1-i*i),r=t*2.39996,o=[Math.cos(r)*s,i,Math.sin(r)*s];if(Math.abs(i)>.92)continue;let a=_.cone(.42,3.4,6);a.translate(0,1.7,0);let l=[o[0]*3.9,8+o[1]*4.1,o[2]*3.9];n.add("spin","paint",La(a,o,l),"#9a7a58"),n.add("spin","crystal",La(E(_.crystal(.32,1.4,5,.5,t+3),0,3.3,0),o,l),Ct.crys)}for(let t=0;t<3;t++){let i=t/3*ze,s=_.membrane([[0,-1.2],[5.8,-.4],[7.2,1.8],[4.2,2.6],[0,1.4]]);n.add("spin","membrane",E(s,Math.cos(i)*3.6,8,Math.sin(i)*3.6,[0,-i,0]),"#b08a5a"),n.add("spin","paint",E(st([0,0,0],[3.6,2,0],[7.2,1.8,0],.16,.08,6,4),Math.cos(i)*3.6,8,Math.sin(i)*3.6,[0,-i,0]),Ct.bone)}return n.build()}function Zy(n,e,t,i,s,r){n.spin.rotation.y+=s*1.7,n.body.rotation.set(.18*Math.sin(e.time*1.3),0,.22*Math.sin(e.time*1.7));let o=i.player,l=(o?Math.hypot(o.x-t.x,o.y-t.y):999)<90?9:3;r.fx.pulse(r.byMat.core,.5+.7*(.5+.5*Math.sin(e.time*l)))}function $y(){let n=new vt;n.bone("body","root",0,8.6,0).bone("clN","body",5,9,3.4).bone("clF","body",-5,9,3.4),n.add("body","flesh",E(_.shell(8.8,5.2,6.6,.6,0,ze,0,1.72,16,7),0,9.2,0),qt.shell),n.add("body","suit",E(_.ell(7,2.6,5.4,14,8),0,8.4,0),qt.stoneD);for(let t=0;t<7;t++){let i=(t/6-.5)*2.2;n.add("body","paint",E(_.cone(.55,1.6,5),Math.sin(i)*8.6,8.6,Math.cos(i)*6.4*.98,[Math.PI/2-.3,0,-i*.3]),qt.shellL)}Zt(n,"body",[[-2,12.8,-1.2,1.45,7.6,-.2,.15,3],[2.6,13,-2,1.1,6,-.3,-.3,5],[.2,13.4,-3.6,.9,4.6,-.5,0,7],[-4.6,11.8,-2.6,.8,3.6,-.4,.5,9],[4.8,11.6,.4,.6,2.6,.3,-.6,11]],qt.crys);for(let t=0;t<8;t++){let i=t/7*Math.PI;n.add("body","glow",E(_.sph(.35,6,4),Math.cos(i)*7.6,10.4+Math.sin(i)*1.2,Math.sin(i)*4.8+1.2),ro)}for(let t of[1,-1]){n.add("body","paint",st([t*1.6,12.2,4],[t*1.9,13.4,4.4],[t*2.1,14.4,4.7],.32,.22,6,4),qt.shellL),n.add("body","glow",E(_.sph(.62,8,6),t*2.1,14.7,4.8),Da);let i=t>0?"clN":"clF";n.add(i,"flesh",st([t*5,9,3.4],[t*6.9,10.6,5.8],[t*6.1,12.4,7.4],1.15,.9),qt.shell),n.add(i,"flesh",E(_.ell(2.1,1.6,1.4,10,8),t*5.5,13.3,8.1,[0,0,t*.4]),qt.shellL),n.add(i,"paint",E(_.cone(.75,3.2,6),t*4.1,15,8.4,[0,0,t*.75]),qt.shellL),n.add(i,"paint",E(_.cone(.6,2.6,6),t*5,15.3,7.6,[0,0,t*.2]),qt.stone),n.add(i,"glow",E(_.sph(.3,6,4),t*5.8,13.6,9.4),ro)}let e=[1.8,-.6,-3];for(let t=0;t<6;t++){let i=t%2?-1:1,s=e[Math.floor(t/2)];so(n,"l"+t,"body",[i*5.4,8,s],[i*8.8,11.2,s*1.3],[i*9.9,.3,s*1.5],.72,"paint",qt.stone)}return n.build()}function Jy(n,e,t,i,s){e.phase+=Math.abs(t.vx||0)*s/13*ze,n.root.rotation.y=xt(n.root.rotation.y,-(t.facing||-1)*.22,6,s);for(let o=0;o<6;o++){let a=o%2?-1:1,l=e.phase+Math.floor(o/2)*2.1+(a>0?0:Math.PI),c=.36*Math.max(0,Math.sin(l));n["l"+o].rotation.set(0,.16*Math.cos(l),a*(c+.08*Math.cos(l))),n["l"+o+"k"].rotation.z=-a*c*.5}n.body.position.set(.3*Math.sin(e.phase*2),8.6+.3*Math.abs(Math.sin(e.phase*2))+.1*Math.sin(e.time*1.6),0);let r=Math.max(0,Math.sin(e.time*1.4))**6;n.clN.rotation.set(-.15*r,0,.1*Math.sin(e.time*1.1)),n.clF.rotation.set(-.15*Math.max(0,Math.sin(e.time*1.4+2))**6,0,-.1*Math.sin(e.time*1.1+1))}function Ky(){let n=new vt,e=[9,5,1,-3,-7,-11];n.bone("s0","root",e[0],6,0);for(let i=1;i<6;i++)n.bone("s"+i,"s"+(i-1),e[i],6,0);n.bone("jaw","s0",9.6,5.3,0),n.add("s0","flesh",E(_.ell(4.3,2.6,2.4,14,10),11.4,6.3,0),qt.eelD),n.add("s0","flesh",E(_.ell(3,1.2,2,10,6),10.6,7.6,0),qt.eelL),n.add("jaw","flesh",E(_.ell(3.8,1,2,12,6),12,4.7,0),qt.eelL);for(let i=0;i<5;i++)for(let s of[1,-1])n.add("jaw","paint",E(_.cone(.22,.9,4),10.4+i*.85,5.6,s*(1.6-i*.22)),"#e8e0cc"),n.add("s0","paint",E(_.cone(.22,.9,4),10.6+i*.85,5.4,s*(1.7-i*.22),[Math.PI,0,0]),"#e8e0cc");for(let i of[1,-1]){n.add("s0","glow",E(_.sph(.6,8,6),13.2,7,i*1.55),Da);for(let s=0;s<3;s++)n.add("s0","glow",E(_.box(.18,1.5,.15),8.6-s*.7,6.1,i*2.25),ro.map(r=>r*.7));n.add("s0","suit",st([14.6,5.2,i*.8],[15.6,3.8,i*1.4],[15,2.4,i*1.6],.14,.05,6,3),qt.eelL)}n.add("s0","flesh",E(_.ell(3.4,2.75,2.35,12,8),7.4,6,0),qt.eelD);let t=[2.7,2.6,2.35,2,1.55,1];for(let i=1;i<6;i++){let s=e[i]-2,r=t[i];n.add("s"+i,"flesh",E(_.ell(3.6,r,r*.86,12,8),s+.4,6,0),i%2?qt.eelD:"#2b434a"),n.add("s"+i,"membrane",E(_.membrane([[2.6,0],[-2.4,0],[-2.4,r*.7+.8],[2.6,t[i-1]*.7+.8]]),s+.2,6+r*.62,0),"#5fd8c8");for(let o of[1,-1])n.add("s"+i,"glow",E(_.sph(.28,6,4),s+.8,6.2,o*r*.84),ro)}return n.add("s5","membrane",E(_.membrane([[-11,0],[-15.4,3.4],[-14.6,0],[-15.4,-3]]),0,6,0),"#5fd8c8"),n.build()}function jy(n,e,t,i,s){n.root.rotation.y=Vn(e,t.facing||1,s,7);let r=[.05,.2,.24,.26,.28,.3];for(let o=0;o<6;o++)n["s"+o].rotation.set(.12*Math.sin(e.time*6-o*.9),0,r[o]*Math.sin(e.time*6-o*.9));n.jaw.rotation.z=-.32*(.5+.5*Math.sin(e.time*2.1))**2}function Qy(){let n=new vt;n.bone("stalk","root",0,4.2,0).bone("head","stalk",0,11.2,0),n.add("root","suit",E(Lt(6.2,21,.3,1,1.45,.55,1.1),0,2,0),qt.stone),Zt(n,"root",[[-6,2.6,2.6,.75,3.2,.5,.6,3],[5.6,2.2,3.4,.6,2.6,.7,-.5,5]],qt.crys);for(let e=0;e<6;e++){let t=e*1.3;n.add("root","paint",E(_.cone(.7,1.2,6),Math.cos(t)*6,3.2,Math.sin(t)*4.5),"#c7c0b0")}n.add("stalk","flesh",_.taperTube([[0,3.6,0],[.6,7.6,0],[0,11.4,0]],e=>Hn(2.7,2,e),8,10),qt.flesh);for(let e of[6.2,8.4,10.4])n.add("stalk","flesh",E(_.torus(2.35-(e-6)*.08,.32,5,14),.3,e,0,[Math.PI/2,0,0]),qt.fleshL);n.add("head","flesh",E(_.ell(4.2,3.3,4.2,14,10),0,12.8,0),qt.fleshL),n.add("head","core",E(_.cyl(1.9,2.5,.6,14),0,15.7,0),We("#45f0dc",3.2)),n.add("head","flesh",E(_.torus(2.6,.55,6,16),0,15.8,0,[Math.PI/2,0,0]),qt.flesh);for(let e=0;e<6;e++){let t=e/6*ze,i=Math.cos(t)*3,s=Math.sin(t)*3;n.bone("t"+e,"head",i,15.6,s),n.add("t"+e,"flesh",st([i,15.6,s],[i*1.6,17.6,s*1.6],[i*2.1,18.4,s*2.1],.55,.14,8,5),"#9a7088"),n.add("t"+e,"glow",E(_.sph(.3,6,4),i*2.15,18.5,s*2.15),Da)}return n.build()}function e2(n,e,t,i,s,r){lr(e,t,s,2.1);let o=Yn(t,i);e.lean=xt(e.lean||0,o*.12,3,s),n.stalk.rotation.set(.05*Math.sin(e.time*1.2),0,-e.lean+.04*Math.sin(e.time*1.6));let a=e.charge*.18-e.kick*.22;n.head.scale.set(1+a*.6,1-a,1+a*.6);for(let l=0;l<6;l++){let c=Math.sin(e.time*2.2+l*1.1),h=l/6*ze,u=.3*e.kick-.35*e.charge;n["t"+l].rotation.set(Math.sin(h)*(.2*c+u),0,-Math.cos(h)*(.2*c+u))}r.fx.pulse(r.byMat.core,.7+e.charge*1.3+e.kick*1.5+.15*Math.sin(e.time*3))}function t2(){let n=new vt;n.bone("body","root",0,8.4,0).bone("eye","body",1.6,8.4,0).bone("vN","body",-1,8.4,4.4).bone("vF","body",-1,8.4,-4.4),n.add("body","paint",E(_.torus(4.3,1.55,8,22),.6,8.4,0,[0,Math.PI/2,0]),qt.patina);for(let e=0;e<6;e++){let t=e/6*ze;n.add("body","paint",E(_.box(1.2,1.6,2.2,.3),1.4,8.4+Math.cos(t)*4.3,Math.sin(t)*4.3,[t,0,0]),qt.patinaD)}for(let e=0;e<4;e++){let t=e/4*ze+.4;n.add("body","glow",E(_.box(.2,1.4,.3),2.2,8.4+Math.cos(t)*4.4,Math.sin(t)*4.4,[t,0,0]),ro)}n.add("body","paint",E(_.ell(3.6,4,4,12,10),-2.4,8.4,0),qt.patinaD),n.add("body","paint",E(_.cone(2,3,8),-6.2,8.4,0,[0,0,Math.PI/2]),qt.patina),n.add("eye","core",E(_.sph(2.6,14,10),1.8,8.4,0),We("#3fe6d4",2.6)),n.add("eye","metal",E(_.sph(1.05,10,8),4,8.4,0),"#0b1a1a"),n.add("eye","paint",E(_.torus(2.5,.35,5,18),2.6,8.4,0,[0,Math.PI/2,0]),"#2a3a34");for(let[e,t]of[["vN",1],["vF",-1]])n.add(e,"paint",E(_.ext([[0,-.4],[-4.8,2.4],[-8.2,2],[-6,.2],[-3.6,-1.2]],.5,.18),-1,8.4,t*4.6),qt.patina),n.add(e,"glow",E(_.box(3,.16,.14),-4.2,9.3,t*4.9,[0,0,-.3]),ro);for(let e of[1.2,-1.2,0])n.add("body","suit",st([-2.6,5,e],[-4.2,3.2,e*1.4],[-6.2,2.2,e*1.6],.28,.08,8,4),qt.patinaD);return n.scaleAll(1.3,0,8,0),n.build()}function n2(n,e,t,i,s){let r=Yn(t,i);n.root.rotation.y=Vn(e,r,s,5);let o=Ss(t,i),a=r>0?o:Math.PI-o,l=a>Math.PI?a-ze:a;e.look=xt(e.look||0,Rt(l,-.7,.7),6,s),n.eye.rotation.z=e.look,n.body.rotation.z=.06*Math.sin(e.time*1.4),n.body.position.y=8.4+.4*Math.sin(e.time*2.2),n.vN.rotation.x=-.15-.15*Math.sin(e.time*3),n.vF.rotation.x=.15+.15*Math.sin(e.time*3)}function i2(){let n=new vt;n.bone("body","root",0,8,0).bone("core","body",0,8,0),n.add("body","bubble",E(_.sph(7.4,20,14),0,8,0),"#bff4ff"),n.add("core","metal",E(_.ico(3,1),0,8,0),"#4f6466"),n.add("core","core",E(_.torus(3.05,.3,5,20),0,8,0,[Math.PI/2,0,0]),Da),n.add("core","core",E(_.torus(3.05,.3,5,20),0,8,0,[0,0,0]),Da);let e=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.7,.7,0],[-.7,-.7,0]];for(let t of e)n.add("core","paint",La(E(_.cone(.6,2.2,6),0,1.1,0),t,[t[0]*2.8,8+t[1]*2.8,t[2]*2.8]),"#8a7a50");return n.build()}function s2(n,e,t,i,s,r){n.core.rotation.set(e.time*.6,e.time*.9,0);let o=Math.sin(e.time*2.4);n.body.scale.set(1+.035*o,1-.035*o,1+.02*o);let a=i.player,l=a?Math.hypot(a.x-t.x,a.y-t.y):999;r.fx.pulse(r.byMat.core,.7+.6*(.5+.5*Math.sin(e.time*(l<90?10:3.5))))}var Np=new $n,Ku=new it,r2=new F(0,1,0),Up=new F;function La(n,e,t){return Up.set(e[0],e[1],e[2]).normalize(),Np.setFromUnitVectors(r2,Up),Ku.makeRotationFromQuaternion(Np),Ku.setPosition(t[0],t[1],t[2]),n.applyMatrix4(Ku),n}var kp={scarab:{type:"walker",build:zy,pose:By},rockmite:{type:"hopper",build:Hy,pose:Vy},cliffpod:{type:"turret",build:Gy,pose:Wy},wasp:{type:"flyer",build:Xy,pose:qy},windmine:{type:"drifter",build:Yy,pose:Zy},crab:{type:"walker",build:$y,pose:Jy},eel:{type:"eel",build:Ky,pose:jy},polyp:{type:"turret",build:Qy,pose:e2},sentry:{type:"flyer",build:t2,pose:n2},bubblemine:{type:"drifter",build:i2,pose:s2}};var en={hull:"#30353c",hullL:"#4a5059",hullD:"#1f2328",red:"#8a1c1c",stripe:"#b8862e",metal:"#5c6168"},ju=We("#ff3b2f",3.6),ch=We("#ff7a2a",3.4),lt={iron:"#302c2a",ironL:"#46403c",rust:"#7a3b1e",brass:"#a07a3a",hazard:"#d8a12a",steel:"#6a6e74",steelL:"#8a8e94"},cr=We("#ff6a14",3.6),hh=We("#ffcf3a",3.4),kt={crys:"#8a4dff",crysL:"#b98cff",flesh:"#5a2a4a",fleshL:"#7a3c5e",fleshD:"#3a1a30",bone:"#cdbba2",chitin:"#2a1a2e"},ws=We("#8fff3f",3.2),Na=We("#9cff4a",3.6);function o2(){let n=new vt;n.bone("yaw","root",0,6,0).bone("aim","yaw",0,10.4,0).bone("gun","aim",0,10.4,0),n.add("root","paint",E(_.cyl(9.4,10,2.2,6),0,1.1,0,[0,Math.PI/6,0]),en.hull),n.add("root","paint",E(_.torus(8.2,.3,4,6),0,2.3,0,[Math.PI/2,0,Math.PI/6]),en.stripe);for(let e=0;e<6;e++){let t=e/6*ze;n.add("root","metal",E(_.cyl(.55,.55,.6,6),Math.cos(t)*7.6,2.4,Math.sin(t)*7.6),en.metal)}n.add("root","metal",E(_.cyl(5,6.2,4.4,12),0,4.2,0),en.hullD);for(let e=0;e<8;e++){let t=e/8*ze;n.add("root","metal",E(_.box(.5,3.4,1,.1),Math.cos(t)*5.7,4.2,Math.sin(t)*5.7,[0,-t,0]),en.metal)}n.add("yaw","paint",E(_.shell(6.4,5.6,6.4,.6,0,ze,0,Math.PI/2+.3,16,6),0,8.6,0),en.hullL),n.add("yaw","paint",E(_.torus(6.3,.45,5,18),0,7.4,0,[Math.PI/2,0,0]),en.red),n.add("aim","paint",E(_.box(5,4.4,6.6,.9,2),3.2,10.4,0),en.hull),n.add("aim","core",E(_.box(.3,.8,2.6),5.75,11.9,0),ju);for(let e of[1.7,-1.7])n.add("gun","metal",E(_.cyl(.72,.8,8.6,10),9.2,10,e,[0,0,-Math.PI/2]),en.metal),n.add("gun","metal",E(_.cyl(1,1,1.4,8),13.2,10,e,[0,0,-Math.PI/2]),en.hullD),n.add("gun","core",E(_.torus(.78,.18,4,10),14,10,e,[0,Math.PI/2,0]),ch);return n.build()}function a2(n,e,t,i,s,r){let o=rh(e,r,t,i,20),a=oh(o,t.aim!=null?-t.aim:Ss(t,i)),l=ah(e,a,s,-.25,1.5);n.yaw.rotation.y=e.yaw,n.aim.rotation.z=l,lr(e,t,s),n.gun.position.x=-e.kick*1.8,r.fx.pulse(r.byMat.core,.6+e.charge*1.8+e.kick*1.2)}function l2(){let n=new vt;n.bone("body","root",0,8,0).bone("flame","body",-10,8,0);let e=_.lathe([[.001,11.4],[.6,10.4],[1.4,7.6],[2.1,3.6],[2.3,0],[2.2,-4],[1.9,-7.6],[1.5,-9.2],[.001,-9.3]],14);tn(e,[0,8,0],[0,0,-Math.PI/2]),wn(e,t=>{let i=t.y-8;t.y=8+i*(i>0?1.05:.9),t.z*=.9},"smooth"),n.add("body","paint",e,en.hull),n.add("body","crystal",E(_.ell(3,1.1,1.1,12,8),4.4,9.3,0),"#8a3a10"),n.add("body","paint",E(_.ext([[-6,6.2],[3,6],[5,5],[-5,3.6]],2.4,.4),0,0,0),en.hullD),n.add("body","glow",E(_.box(1.6,.6,2),4.2,5.4,0),ch.map(t=>t*.6));for(let t of[1,-1]){let i=_.ext([[-3.8,-1.4],[2.6,-9.6],[.6,-10.2],[-7.6,-2.6]],.5,.18);tn(i,null,[Math.PI/2,0,0]),t<0&&(i=tn(i,null,null,[1,1,-1])),n.add("body","paint",E(i,0,7.4,0,[t*-.42,0,0]),en.hullL),n.add("body","glow",E(_.box(.3,.25,7.2),-.8,7.4+2.4,t*5.5,[t*-.42,t*.62,0]),ju),n.add("body","paint",E(_.ext([[-9,8.4],[-6,8.8],[-7.6,13.6],[-9.4,14]],.45,.14),0,0,t*1.6,[t*.35,0,0]),en.hullL),n.add("body","paint",E(_.box(2.6,1,.5,.15),-8.4,13.2,t*2.9,[t*.35,0,0]),en.red),n.add("body","metal",E(_.cyl(.25,.25,3.2,6),9,6.6,t*1.2,[0,0,-Math.PI/2]),en.metal),n.add("body","metal",E(_.box(3.2,1.4,1.2,.3),3.2,7.2,t*2.1),en.hullD)}return n.add("body","metal",E(_.cyl(1.7,1.4,1.6,12),-9.2,8,0,[0,0,Math.PI/2]),en.hullD),n.add("body","glow",E(_.cyl(1.3,1.3,.1,12),-10.05,8,0,[0,0,Math.PI/2]),ch),n.add("flame","glow",E(_.lathe([[1.2,0],[.9,-2.2],[.4,-4],[.02,-5.2]],10),-10,8,0,[0,0,-Math.PI/2]),We("#ff6a3a",2.6)),n.build()}function c2(n,e,t,i,s){let r=Yn(t,i);n.root.rotation.y=Vn(e,r,s,4);let o=e.py!=null&&s>0?(t.y-e.py)/s:0;e.py=t.y,e.bank=xt(e.bank||0,Rt(o/100,-1,1),5,s),n.body.rotation.set(e.bank*.6,0,-e.bank*.12);let a=.85+.15*Math.sin(e.time*47);n.flame.scale.set(a,1,1)}function h2(){let n=new vt;n.bone("aim","root",0,8,0).bone("roll","aim",0,8,0).bone("flame","roll",-6.1,8,0),n.add("roll","paint",E(_.sph(4.5,16,12),0,8,0),en.hull),n.add("roll","paint",E(_.torus(4.55,.4,5,20),0,8,0,[0,Math.PI/2,0]),en.red),n.add("roll","paint",E(_.torus(4.2,.3,5,20),-2.2,8,0,[0,Math.PI/2,0]),en.stripe),n.add("roll","metal",E(_.cyl(1.7,2.6,1.8,12),4.6,8,0,[0,0,-Math.PI/2]),en.hullD),n.add("roll","core",E(_.sph(1.2,10,8),5.6,8,0),ju);for(let e=0;e<6;e++){let t=e/6*ze;n.add("roll","metal",La(E(_.cone(.5,2,6),0,1,0),[.35,Math.cos(t),Math.sin(t)],[.8,8+Math.cos(t)*4,Math.sin(t)*4]),en.metal)}for(let e=0;e<4;e++){let t=_.ext([[-3,0],[-7.4,3.6],[-7.8,3.6],[-6.4,0]],.4,.12);n.add("roll","paint",E(t,0,8,0,[e*Math.PI/2+Math.PI/4,0,0]),en.hullL)}return n.add("roll","metal",E(_.cyl(1.3,1.6,1.6,10),-5.2,8,0,[0,0,Math.PI/2]),en.metal),n.add("roll","glow",E(_.cyl(1.1,1.1,.1,10),-6.05,8,0,[0,0,Math.PI/2]),ch),n.add("flame","glow",E(_.lathe([[1,0],[.7,-1.8],[.02,-3.6]],8),-6.1,8,0,[0,0,-Math.PI/2]),We("#ff7a3a",2.4)),n.scaleAll(1.12,0,8,0),n.build()}function u2(n,e,t,i,s,r){let o=Ss(t,i),a=Math.cos(o)>=0;n.root.rotation.y=Vn(e,a?1:-1,s,6);let l=a?o:Math.PI-o;l>Math.PI&&(l-=ze),e.pitch=xt(e.pitch||0,l,7,s),n.aim.rotation.z=e.pitch,n.roll.rotation.x=e.time*3.2,n.flame.scale.set(.8+.2*Math.sin(e.time*41),1,1),r.fx.pulse(r.byMat.core,.6+.8*(e.time*4%1<.5?1:.2))}function d2(){let n=new vt;n.bone("body","root",0,3,0).bone("jaw","body",5.2,13.6,0),n.add("root","paint",E(_.box(18,3,12,.6,2),0,1.5,0),lt.ironL),n.add("root","paint",E(_.box(18.4,.6,12.4,.2),0,2.9,0),lt.brass);let e=_.ext([[-5.2,3],[4.2,3],[5.4,8],[4.8,12.2],[2.2,15.4],[-2.6,16],[-5.4,12]],9.6,.8,{steps:3});wn(e,t=>{t.x-=.03*t.z*t.z},!0),n.add("body","paint",e,lt.iron),n.add("body","paint",E(_.ext([[-1.2,12.8],[5.6,13],[6.6,16.4],[4.2,19.6],[-.4,19.9],[-2.6,17.2]],7.2,.6,{steps:2}),0,0,0),lt.ironL),n.add("body","paint",E(_.ext([[-3,17.6],[0,20.4],[3.4,20],[4.6,18.8],[.4,19]],4,.4),0,0,0),lt.rust),n.add("body","metal",E(_.box(.9,1.6,4.6,.2),6.3,15.4,0),"#1a1716");for(let t=0;t<3;t++)n.add("body","core",E(_.box(.3,.28,3.8),6.75,14.9+t*.5,0),cr);for(let t of[1,-1])n.add("body","core",E(_.box(.3,.4,.9),6.2,17.4,t*1.5,[0,0,-.2]),hh),n.add("body","paint",E(_.ext([[-4.6,9.5],[1.6,10.2],[3.6,13.6],[.6,16],[-4.2,14.6]],2.2,.5),0,0,t*5.4),lt.ironL),n.add("body","paint",E(_.ext([[-3.6,13.6],[.4,14.8],[-.2,15.4],[-3.8,14.6]],2.3,.2),0,0,t*5.4),lt.brass),n.add("body","paint",st([1,10.6,t*5.6],[4.8,7.8,t*5.8],[6.8,4.6,t*5],1.5,1.2),lt.iron),n.add("body","paint",E(_.box(3,2.2,2.6,.5),7.2,4.2,t*4.6),lt.ironL),n.add("body","core",E(_.box(1.8,.25,.2),-1,6+1.4,t*4.85),cr.map(i=>i*.6)),n.add("body","core",E(_.box(1.8,.25,.2),-1,6,t*4.85),cr.map(i=>i*.6));return n.add("body","paint",E(_.torus(3.6,.5,6,18),1.6,13.6,0,[Math.PI/2,0,.35]),lt.brass),n.add("jaw","paint",E(_.ext([[4,13.8],[6.8,14.1],[6.6,12.4],[4.6,12]],4.6,.3),0,0,0),lt.ironL),n.build()}function f2(n,e,t,i,s,r){n.root.rotation.y=Vn(e,Yn(t,i),s,3),lr(e,t,s);let o=i.player,l=(o?Math.abs(o.x-t.x):999)<190?1:0;e.heat=xt(e.heat||0,l?Math.max(e.charge,.35):.1,4,s),n.jaw.rotation.z=-.5*Math.max(e.kick,e.heat>.6?e.heat-.6:0),n.body.rotation.z=-.04*e.kick;let c=.85+.15*Math.sin(e.time*23)*Math.sin(e.time*7.1);r.fx.pulse(r.byMat.core,(.55+e.heat*1.6+e.kick*1.5)*c)}function p2(){let n=new vt;n.bone("body","root",0,13,0);for(let[e,t]of[["N",2.7],["F",-2.7]])n.bone("l"+e,"body",0,11.2,t).bone("l"+e+"k","l"+e,3,6.6,t).bone("l"+e+"f","l"+e+"k",-1.2,1.6,t);n.add("body","paint",E(_.box(12,7,8,1.2,2),.4,15,0),lt.steel);for(let e=0;e<5;e++)n.add("body","paint",E(_.box(1.1,2,.2),-4.2+e*2.2,13.2,4.05,[0,0,.55]),e%2?"#1a1716":lt.hazard);for(let e of[1,-1])n.add("body","paint",E(_.box(11.4,.5,.2),.4,14.5,e*4.08),lt.hazard);n.add("body","metal",E(_.cyl(.9,1,3.6,10),-3.4,19.6,-1.6),lt.ironL),n.add("body","core",E(_.cyl(.65,.65,.2,10),-3.4,21.45,-1.6),cr.map(e=>e*.7));for(let e of[12.6,14.6])n.add("body","metal",E(_.cyl(.8,.8,7.6,10),6.6,e,0,[Math.PI/2,0,0]),lt.steelL);n.add("body","paint",E(_.box(4.2,3.2,5,.6),6.4,17.2,0),lt.iron),n.add("body","metal",E(_.torus(1.2,.3,5,14),8.55,17.4,0,[0,Math.PI/2,0]),lt.brass),n.add("body","core",E(_.cyl(.95,.95,.3,12),8.6,17.4,0,[0,0,-Math.PI/2]),hh),n.add("body","suit",st([-5.6,16.6,2],[-7.6,15,3],[-6.2,12,3.6],.35,.3,8,4),"#1a1716"),n.add("body","metal",E(_.box(1.2,3.6,1.2,.2),3.4,10.6,0),lt.ironL),n.add("body","metal",st([3.4,9,0],[5.4,8,0],[6.4,9,0],.32,.2,6,4),lt.steelL);for(let[e,t]of[["N",2.7],["F",-2.7]])n.add("l"+e,"paint",E(_.sph(1.6,10,8),0,11.2,t),lt.ironL),n.add("l"+e,"paint",st([0,11.2,t],[1.8,9.2,t],[3,6.6,t],1.15,.9),lt.steel),n.add("l"+e,"metal",st([.6,11.6,t+Math.sign(t)*1],[2,9.4,t+Math.sign(t)*1],[3.3,7.2,t+Math.sign(t)*1],.28,.28,6,4),lt.steelL),n.add("l"+e+"k","paint",E(_.sph(1,8,6),3,6.6,t),lt.iron),n.add("l"+e+"k","paint",st([3,6.6,t],[1,4.2,t],[-1.2,1.6,t],.85,.6),lt.ironL),n.add("l"+e+"f","paint",E(_.ext([[-2.4,0],[3.2,0],[3.6,.7],[.4,1.7],[-1.8,1.6]],2.2,.3),0,0,t),lt.iron),n.add("l"+e+"f","paint",E(_.box(1,.5,2.3,.15),3,.45,t),lt.hazard);return n.build()}function m2(n,e,t,i,s){n.root.rotation.y=Vn(e,t.facing||-1,s,8),e.phase+=Math.abs(t.vx||0)*s/22*ze;let r=e.phase;for(let[o,a]of[["N",0],["F",Math.PI]]){let l=r+a;n["l"+o].rotation.z=.42*Math.sin(l),n["l"+o+"k"].rotation.z=-.35*Math.max(0,Math.cos(l))-.05,n["l"+o+"f"].rotation.z=-.42*Math.sin(l)+.35*Math.max(0,Math.cos(l))}n.body.position.y=13+.5*Math.abs(Math.cos(r))-.4+.08*Math.sin(e.time*9),n.body.rotation.z=.04*Math.sin(r*2)}function g2(){let n=new vt;n.bone("spin","root",0,9,0),n.add("spin","paint",E(_.cyl(6.6,6.6,4.6,6),0,9,0,[Math.PI/2,0,0]),lt.ironL),n.add("spin","metal",E(_.cyl(6,6.6,.6,6),0,9,2.6,[Math.PI/2,0,0]),lt.steel),n.add("spin","metal",E(_.cyl(6.6,6,.6,6),0,9,-2.6,[Math.PI/2,0,0]),lt.steel);for(let e=0;e<10;e++){let t=e/10*ze,i=_.ext([[0,-1.3],[2.6,-.2],[2.2,.9],[0,1.1]],2.2,.2);n.add("spin","metal",E(i,Math.cos(t)*6.3,9+Math.sin(t)*6.3,0,[0,0,t]),lt.steelL)}return n.add("spin","metal",E(_.cyl(2.4,2.4,9.6,12),0,9,0,[Math.PI/2,0,0]),lt.steelL),n.add("spin","metal",E(_.cyl(3.6,3.6,1.4,6),0,9,4.6,[Math.PI/2,0,0]),lt.steel),n.add("spin","core",E(_.torus(4.4,.42,5,6),0,9,2.95,[0,0,Math.PI/6]),cr),n.add("spin","core",E(_.torus(4.4,.42,5,6),0,9,-2.95,[0,0,Math.PI/6]),cr),n.build()}function x2(n,e,t,i,s,r){n.spin.rotation.set(.1*Math.sin(e.time*2),.12*Math.sin(e.time*1.3),-e.time*9),r.fx.pulse(r.byMat.core,.8+.25*Math.sin(e.time*13))}function v2(){let n=new vt;n.bone("body","root",0,9,0).bone("rN","body",-1,11.6,5.6).bone("rF","body",-1,11.6,-5.6).bone("arc0","body",4,5.4,1.5).bone("arc1","body",4,5.4,-1.5),n.add("body","paint",E(_.capsule(2.8,6.6,4,12),0,9.4,0,[0,0,Math.PI/2]),lt.steel),n.add("body","paint",E(_.cyl(2.9,2.9,1.2,12),-1,9.4,0,[0,0,Math.PI/2]),lt.hazard);for(let e=0;e<4;e++)n.add("body","paint",E(_.box(.4,1.3,6),-1.6+e*.4,9.4,0,[0,0,0]),e%2?"#1a1716":lt.hazard);n.add("body","core",E(_.sph(1.1,10,8),5.9,9.8,0),hh),n.add("body","metal",E(_.torus(1.2,.25,5,12),5.6,9.8,0,[0,Math.PI/2,0]),lt.iron);for(let[e,t]of[["rN",1],["rF",-1]])n.add("body","paint",st([-.5,10.6,t*2.4],[-.8,11.4,t*4],[-1,11.6,t*5],.5,.4,6,5),lt.ironL),n.add("body","paint",E(_.torus(3,.55,6,20),-1,11.6,t*5.6,[Math.PI/2,0,0]),lt.iron),n.add(e,"metal",E(_.box(5.6,.14,.7),-1,11.6,t*5.6),lt.steelL),n.add(e,"metal",E(_.box(.7,.14,5.6),-1,11.6,t*5.6),lt.steelL),n.add(e,"metal",E(_.cyl(.5,.5,.6,8),-1,11.6,t*5.6),lt.brass);for(let[e,t]of[["arc0",1.5],["arc1",-1.5]]){n.add("body","metal",st([3,7.6,t],[4.2,6,t],[5.6,4.6,t],.4,.28,6,4),lt.steelL);for(let s=0;s<3;s++)n.add("body","metal",E(_.torus(.5,.18,4,10),3.6+s*.6,6.8-s*.6,t,[0,0,.8]),"#b06a2a");let i=[[5.6,4.6,t],[6.6,3.6,t*.6],[5.9,2.6,t*.2],[6.9,1.6,-t*.2]];n.add(e,"glow",_.tube(i,.16,8,4),We("#bfe8ff",4.5))}return n.add("body","suit",st([-3,6.8,0],[-4.4,4.6,.6],[-3.6,3.2,1],.3,.2,8,4),"#1a1716"),n.scaleAll(1.25,0,8,0),n.build()}function y2(n,e,t,i,s){n.root.rotation.y=Vn(e,Yn(t,i),s,5),n.rN.rotation.y=e.time*40,n.rF.rotation.y=-e.time*40,n.body.rotation.set(.08*Math.sin(e.time*1.7),0,.08*Math.sin(e.time*2.3));let r=l=>{let c=Math.sin(Math.floor(e.time*24)*12.9898+l*78.2)*43758.5;return c-Math.floor(c)},o=r(1)>.35?1:1e-4,a=r(2)>.35?1:1e-4;n.arc0.scale.set(1,o*(.7+.3*r(3)),o),n.arc1.scale.set(1,a*(.7+.3*r(4)),a)}function _2(){let n=new vt;n.bone("drum","root",0,4,0).bone("hL","drum",-6,18.6,0).bone("hR","drum",6,18.6,0);let e=[[.6,1],[Math.PI-.6,1],[-Math.PI/2,1]];e.forEach(([t],i)=>{let s=Math.cos(t)*8.6,r=Math.sin(t)*8.6;n.bone("a"+i,"drum",s,14,r).bone("a"+i+"k","a"+i,s*1.45,20,r*1.45)}),n.add("root","paint",E(_.cyl(12.6,13.6,4,12),0,2,0),lt.ironL);for(let t=0;t<12;t++){let i=t/12*ze;n.add("root","paint",E(_.box(2.2,3.4,.3),Math.cos(i)*13.3,2,Math.sin(i)*13.3,[0,-i+Math.PI/2,.5]),t%2?"#1a1716":lt.hazard)}n.add("drum","paint",E(_.cyl(8.4,9.4,14,16),0,11,0),lt.steel);for(let t of[5.2,11,16.6])n.add("drum","metal",E(_.torus(9-(t-5)*.06,.4,5,24),0,t,0,[Math.PI/2,0,0]),lt.iron);for(let t=0;t<6;t++){let i=t/6*ze+.3;n.add("drum","core",E(_.box(.3,3.2,1.2),Math.cos(i)*9,8.2,Math.sin(i)*9,[0,-i,0]),cr)}n.add("drum","metal",E(_.cyl(7.6,8.4,1.4,16),0,18.6,0),lt.ironL),n.add("drum","core",E(_.cyl(5.6,5.6,.4,16),0,18.9,0),hh);for(let[t,i]of[["hL",-1],["hR",1]])n.add(t,"paint",E(_.box(6,1,11.6,.3),i*3,19.8,0),lt.ironL),n.add(t,"paint",E(_.box(5.4,.3,1),i*3,20.4,0),lt.hazard);return e.forEach(([t],i)=>{let s=Math.cos(t)*8.6,r=Math.sin(t)*8.6,o=s*1.45,a=r*1.45;n.add("a"+i,"paint",E(_.sph(1.6,10,8),s,14,r),lt.ironL),n.add("a"+i,"paint",st([s,14,r],[s*1.3,17.6,r*1.3],[o,20,a],1,.8),lt.hazard),n.add("a"+i+"k","paint",E(_.sph(1,8,6),o,20,a),lt.iron),n.add("a"+i+"k","metal",st([o,20,a],[o*.9,23.2,a*.9],[o*.7,25.4,a*.7],.7,.5),lt.steelL);for(let l of[-.8,.8])n.add("a"+i+"k","metal",st([o*.7,25.4,a*.7],[o*.65+l,26.8,a*.65],[o*.55+l*.4,27.6,a*.55],.32,.12,6,4),lt.iron)}),n.build()}function Op(n,e,t){let i=e.spawnT!=null?e.spawnT:t;n.lastSp!=null&&i>n.lastSp+.2&&(n.burst=1),n.lastSp=i,n.burst=Math.max(0,(n.burst||0)-1/60*1.6),n.antic=i<.6?1-i/.6:0}function M2(n,e,t,i,s,r){Op(e,t,2.4);let o=Math.max(e.antic,e.burst);e.open=xt(e.open||0,o,10,s),n.hL.rotation.z=e.open*1.2,n.hR.rotation.z=-e.open*1.2;for(let a=0;a<3;a++){let l=Math.sin(e.time*1.6+a*2.1);n["a"+a].rotation.set(.25*l*(a===2?1:0),.3*l,a===2?0:(a?-1:1)*(.15*l-.35*e.open)),n["a"+a+"k"].rotation.z=.4*Math.sin(e.time*2.2+a)*(a===2?0:1),n["a"+a+"k"].rotation.x=a===2?.4*Math.sin(e.time*2.2)-.4*e.open:0}n.drum.scale.set(1+e.burst*.04,1-e.burst*.03,1+e.burst*.04),r.fx.pulse(r.byMat.core,.6+e.open*1.6+.1*Math.sin(e.time*5))}function b2(){let n=new vt;n.bone("body","root",0,4.4,0),n.add("body","flesh",E(ln(5,2,3.8,7,.12),0,3.9,0),kt.flesh),n.add("body","crystal",E(_.shell(5.5,3.2,4.4,.4,0,ze,0,1.55,12,5),-.4,4.4,0),kt.crys),Zt(n,"body",[[-.4,6.8,0,.9,3.6,0,.35,3],[-2.8,6.4,.8,.7,2.8,.3,.6,5],[1.8,6.6,-.6,.6,2.4,-.3,-.2,7],[-4.4,5.6,-1,.5,2,-.3,.9,9]],kt.crysL);for(let t of[1,-1])n.add("body","glow",E(_.box(3.4,.25,.2),-.6,2.9,t*3.55),ws),n.add("body","glow",E(_.sph(.42,6,4),5.2,4.6,t*1),Na),n.add("body","glow",E(_.sph(.3,6,4),4.8,5.3,t*1.7),Na),n.add("body","paint",st([5,3.6,t*1],[6.6,3.4,t*1.1],[7,2.6,t*.3],.34,.08,6,4),kt.bone);let e=[2.6,0,-2.6];for(let t=0;t<6;t++){let i=t%2?-1:1,s=e[Math.floor(t/2)];so(n,"l"+t,"body",[s,3.8,i*2.8],[s+.6,6,i*5.6],[s+1.4,.2,i*6.6],.5,"paint",kt.chitin)}return n.build()}function S2(n,e,t,i,s){let r=Pa(t,.65),o=Math.abs(t.vx||0)>1?Math.sign(t.vx):Yn(t,i);n.root.rotation.y=Vn(e,o,s,14);let a=Math.abs(t.vx||0);e.phase+=(a*.12+(r.ground?0:6)+2)*s*2.5;for(let l=0;l<6;l++){let c=l%2?-1:1,h=l===0||l===3||l===4,u=e.phase+(h?0:Math.PI),f=r.ground?0:.35;Ia(n["l"+l],c,.4*Math.sin(u),.3*Math.max(0,Math.cos(u))+f-.3*r.crouch),n["l"+l+"k"].rotation.x=c*.4*r.crouch}n.body.position.y=4.4-1.6*r.crouch+.2*Math.abs(Math.sin(e.phase*2)),n.body.rotation.z=-.25*r.air}function w2(){let n=new vt;n.bone("body","root",0,10,0).bone("head","body",5.6,12,0);for(let[e,t]of[["N",1],["F",-1]])n.bone("h"+e,"body",-2.6,10.2,t*3).bone("h"+e+"k","h"+e,-6.4,15.4,t*4.4).bone("h"+e+"f","h"+e+"k",-4,2,t*5),n.bone("f"+e,"body",3.4,8.6,t*2.4).bone("f"+e+"k","f"+e,5,6,t*3.6);n.add("body","flesh",E(ln(6.2,3.6,3.7,11,.12),-.4,10.6,0,[0,0,.18]),kt.flesh),n.add("body","flesh",E(_.ell(4.6,2.2,2.8,12,8),.6,8.6,0),kt.fleshL),Zt(n,"body",[[-3.6,12.6,0,1,5,0,.7,3],[-.8,13.8,.4,.95,5.4,.1,.4,5],[2,14.2,-.3,.75,4,-.1,.15,7],[-5.8,11.4,-.6,.6,3,-.2,1,9]],kt.crys),n.add("body","glow",E(_.box(5,.22,.2),-.2,8.1,2.8,[0,0,.18]),ws.map(e=>e*.55)),n.add("body","glow",E(_.box(5,.22,.2),-.2,8.1,-2.8,[0,0,.18]),ws.map(e=>e*.55)),n.add("head","flesh",E(_.ell(2.9,2.4,2.4,12,8),6.6,12.4,0),"#6a3256"),n.add("head","crystal",E(_.crystal(.6,3.6,5,.45,13),6.4,14,0,[0,0,-.9]),kt.crysL);for(let e of[1,-1])n.add("head","glow",E(_.ell(.7,.55,.45,8,6),8.4,13.2,e*1.4),Na),n.add("head","paint",st([8.6,11.4,e*1],[10,10.6,e*.9],[10.2,9.6,e*.2],.42,.08,6,4),kt.bone);for(let[e,t]of[["N",1],["F",-1]])n.add("h"+e,"flesh",st([-2.6,10.2,t*3],[-3.6,13.6,t*3.9],[-6.4,15.4,t*4.4],1.9,1.1),kt.fleshL),n.add("h"+e+"k","suit",E(_.sph(1,8,6),-6.4,15.4,t*4.4),kt.chitin),n.add("h"+e+"k","paint",st([-6.4,15.4,t*4.4],[-5.8,8.6,t*4.8],[-4,2,t*5],.85,.45),kt.chitin),n.add("h"+e+"k","crystal",E(_.crystal(.35,2,5,.5,21),-6.6,15.8,t*4.4,[0,0,.6]),kt.crysL),n.add("h"+e+"f","paint",st([-4,2,t*5],[-2,.6,t*5],[.4,.3,t*5],.5,.15,6,4),kt.bone),n.add("f"+e,"paint",st([3.4,8.6,t*2.4],[4.6,7.6,t*3.2],[5,6,t*3.6],.5,.4,6,4),kt.chitin),n.add("f"+e+"k","paint",st([5,6,t*3.6],[5.6,3,t*3.8],[6,.3,t*3.9],.4,.12,6,4),kt.bone);return n.build()}function E2(n,e,t,i,s){let r=Pa(t,1.2),o=Math.abs(t.vx||0)>1?Math.sign(t.vx):Yn(t,i);n.root.rotation.y=Vn(e,o,s,9),e.cr=xt(e.cr||0,r.crouch,18,s),e.air=xt(e.air||0,r.air,12,s);let a=Math.max(0,-e.air),l=Math.max(0,e.air);n.body.position.y=10-3*e.cr+.15*Math.sin(e.time*3),n.body.rotation.z=.15*e.cr-.3*e.air;for(let c of["N","F"])n["h"+c].rotation.z=-.35*e.cr+.55*a-.2*l,n["h"+c+"k"].rotation.z=.5*e.cr-1.1*a+.3*l,n["h"+c+"f"].rotation.z=-.3*e.cr+.6*a,n["f"+c].rotation.z=.5*a-.3*l+.2*e.cr,n["f"+c+"k"].rotation.z=-.3*a;n.head.rotation.z=.1*Math.sin(e.time*2)-.15*e.cr}function T2(){let n=new vt;n.bone("sac","root",0,1,0).bone("core","sac",0,15,0);for(let t=0;t<5;t++){let i=t/5*ze+.3;n.bone("p"+t,"sac",Math.cos(i)*5.4,9.5,Math.sin(i)*5.4)}for(let t=0;t<6;t++){let i=t/6*ze;n.add("root","flesh",st([Math.cos(i)*3,2,Math.sin(i)*3],[Math.cos(i)*6,.8,Math.sin(i)*6],[Math.cos(i)*8.6,.3,Math.sin(i)*8],1,.25,6,5),kt.fleshD)}Zt(n,"root",[[-6.4,.4,3,.8,3.4,.4,.7,3],[6,.4,-2.6,.7,3,-.4,-.6,5],[3.6,.3,4.4,.5,2,.6,-.3,7]],kt.crys);let e=ln(6.4,7.6,6.4,17,.08);wn(e,t=>{if(t.y>0){let i=1-.28*(t.y/7.6);t.x*=i,t.z*=i}},"smooth"),n.add("sac","flesh",E(e,0,8.4,0),"#6a3a5a");for(let t=0;t<5;t++){let i=t/5*ze+.9,s=[];for(let r=0;r<=4;r++){let o=r/4,a=1.6+o*12.6,l=(Math.sin(o*Math.PI)*.35+.72)*6.4*(a>8.4?1-.28*((a-8.4)/7.6):1)+.15;s.push([Math.cos(i+o*.5)*l,a,Math.sin(i+o*.5)*l])}n.add("sac","core",_.tube(s,.16,10,4),ws.map(r=>r*.4))}n.add("core","core",E(_.sph(2.6,12,10),0,15.2,0),ws.map(t=>t*.9));for(let t=0;t<5;t++){let i=t/5*ze+.3,s=Math.cos(i)*5.4,r=Math.sin(i)*5.4,o=_.shard(2.7,13,5,30+t,.1);tn(o,null,[0,-i+Math.PI/2,0],[1,1,.5]),o.applyMatrix4(A2(s,r,i)),n.add("p"+t,"crystal",o,kt.crys)}return n.build()}function A2(n,e,t){let i=new it,s=new it().makeRotationAxis(new F(-Math.sin(t),0,Math.cos(t)),.5),r=new it().makeTranslation(0,6,0),o=new it().makeTranslation(n,9.5,e);return i.multiply(o).multiply(s).multiply(r),i}function R2(n,e,t,i,s,r){let o=i.player,a=t.cfg&&t.cfg.hatchDist||90,l=o?Math.abs(o.x+o.w/2-(t.x+t.w/2)):999,h=(o?Math.abs(o.y-t.y):999)<80?ei((a*2.3-l)/(a*1.3)):0;e.open=xt(e.open||0,h,5,s);let u=Math.pow(.5+.5*Math.sin(e.time*(2.6+e.open*6)),3);n.sac.scale.set(1+u*.04,1+u*.03,1+u*.04);for(let f=0;f<5;f++){let d=f/5*ze+.3,g=e.open*.05*Math.sin(e.time*30+f*2),x=-(e.open*.85+g);n["p"+f].quaternion.setFromAxisAngle(new F(-Math.sin(d),0,Math.cos(d)),x)}n.core.scale.setScalar(.85+.25*e.open+.1*u),r.fx.pulse(r.byMat.core,.45+.35*u+1.3*e.open)}function C2(){let n=new vt;n.bone("stalk","root",0,3.4,0).bone("maw","stalk",0,12,0);for(let e=0;e<3;e++){let t=e/3*ze+.5;n.bone("j"+e,"maw",Math.cos(t)*3.2,15.4,Math.sin(t)*3.2)}n.add("root","flesh",E(ln(7.2,3,6.2,23,.15),0,1.4,0),kt.fleshD),Zt(n,"root",[[-5.6,1.2,2.4,1.1,5,.35,.6,3],[5.2,1,-2.8,.9,4.2,-.4,-.6,5],[4,.8,3.6,.7,3,.6,-.4,7],[-3.4,.8,-4,.6,2.6,-.6,.4,9]],kt.crys),n.add("stalk","flesh",_.taperTube([[0,2.6,0],[.9,7.6,0],[0,12.2,0]],e=>Hn(3,2.2,e),8,10),"#6a3256");for(let e of[5.2,7.6,10])n.add("stalk","paint",E(_.torus(2.75-(e-5)*.08,.36,5,14),.5,e,0,[Math.PI/2,0,0]),kt.bone);n.add("stalk","core",_.tube([[1.8,3,2],[2.6,7,1.4],[1.6,11.6,1.6]],.2,8,4),ws.map(e=>e*.7)),n.add("maw","flesh",E(_.ell(4.2,3,4.2,14,10),0,13.6,0),kt.fleshL),n.add("maw","core",E(_.cyl(2.2,2.6,.4,14),0,16.3,0),Na);for(let e=0;e<8;e++){let t=e/8*ze;n.add("maw","crystal",E(_.crystal(.38,2,5,.5,40+e),Math.cos(t)*2.5,15.8,Math.sin(t)*2.5,[Math.sin(t)*-.5,0,Math.cos(t)*.5]),"#d8c0ff")}for(let e=0;e<3;e++){let t=e/3*ze+.5,i=_.shell(4.6,3.2,4.6,.6,t-.95,t+.95,.15,1.1,8,4);n.add("j"+e,"flesh",E(i,0,14.4,0),kt.flesh)}return n.build()}function P2(n,e,t,i,s,r){lr(e,t,s,2.1);let o=Yn(t,i);e.lean=xt(e.lean||0,o*.14,3,s),n.stalk.rotation.set(.04*Math.sin(e.time*1.3),0,-e.lean+.05*Math.sin(e.time*1.7)-e.kick*.1*o);let a=e.charge*.16-e.kick*.2;n.maw.scale.set(1+a*.5,1-a,1+a*.5);for(let l=0;l<3;l++){let c=l/3*ze+.5,h=.15+.6*e.kick-.25*e.charge+.06*Math.sin(e.time*2+l);n["j"+l].quaternion.setFromAxisAngle(new F(-Math.sin(c),0,Math.cos(c)),-h)}r.fx.pulse(r.byMat.core,.6+e.charge*1.2+e.kick*1.8+.12*Math.sin(e.time*4))}function I2(){let n=new vt;n.bone("mass","root",0,0,0);for(let e=0;e<3;e++)n.bone("o"+e,"mass",[-5,4.5,.5][e],[9,7,15][e],[6.4,6.6,7.4][e]);n.add("mass","flesh",E(ln(12.4,9.4,9.6,31,.16,18,12),0,8.4,0),"#4a2240"),n.add("mass","flesh",E(ln(6,4.6,5,32,.2),-8.4,4.4,3.6),kt.flesh),n.add("mass","flesh",E(ln(5.4,4,4.6,33,.2),8.6,4,-2.4),kt.flesh),Zt(n,"mass",[[-2,14,-2.6,2,12.6,-.15,.12,3],[4.6,13,-3.6,1.5,9,-.25,-.3,5],[-7,11.6,-1.6,1.2,6.4,-.1,.55,7],[8.6,9.6,1.6,1,5,.3,-.7,9],[1.6,15.4,2.6,.9,4.2,.4,-.2,11],[-10.6,6,-3,.8,3.6,-.4,.9,13]],kt.crys);for(let e=0;e<3;e++){let t=[-5,4.5,.5][e],i=[9,7,15][e],s=[6.4,6.6,7.4][e],r=[.35,.4,-.1][e];n.add("o"+e,"flesh",E(_.torus(1.9,.75,6,14),t,i,s,[r,0,t*.03]),kt.fleshL),n.add("o"+e,"core",E(_.cyl(1.5,1.5,.3,12),t,i,s-.3,[Math.PI/2+r,0,t*.03]),Na)}for(let e=0;e<4;e++){let t=-4+e*2.6;n.add("mass","paint",st([-11.4,2,t],[-6+e,18.6-Math.abs(e-1.5),t*1.1],[10.8,3,t*.9],.55,.45,12,5),kt.bone)}for(let e=0;e<5;e++){let t=e*1.25;n.add("mass","core",_.tube([[Math.cos(t)*11,3,Math.sin(t)*8.5],[Math.cos(t+.3)*9.6,9.6,Math.sin(t+.3)*8.6],[Math.cos(t+.5)*5.6,15.6,Math.sin(t+.5)*5.4]],.24,10,4),ws.map(i=>i*.6))}return n.build()}function D2(n,e,t,i,s,r){Op(e,t,2.4);let o=Math.sin(e.time*1.8),a=e.burst,l=e.antic;n.mass.scale.set(1+.025*o+.06*a+.03*l,1-.02*o+.05*a,1+.025*o+.06*a);for(let c=0;c<3;c++){let h=1+.25*l*Math.sin(e.time*20+c)+.35*a;n["o"+c].scale.set(h,h,1)}r.fx.pulse(r.byMat.core,.55+.25*(.5+.5*o)+1.2*l+1.8*a)}function L2(){let n=new vt;n.bone("body","root",0,8,0).bone("ring","body",0,8,0);let e=_.oct(3.4);tn(e,[0,8,0],null,[1,1.45,1]),n.add("body","crystal",e,kt.crysL),n.add("body","core",E(_.oct(1.5),0,8,0,null,[1,1.4,1]),We("#c8a0ff",3.4)),n.add("ring","paint",E(_.torus(5.6,.7,6,24),0,8,0),"#2a2430"),n.add("ring","glow",E(_.torus(5.6,.22,4,24),0,8,.66),ws.map(t=>t*.8));for(let t=0;t<3;t++){let i=t/3*ze;n.add("ring","crystal",E(_.shard(1,5.2,5,50+t),Math.cos(i)*7.8,8+Math.sin(i)*7.8,0,[0,0,i-Math.PI/2]),kt.crys)}return n.build()}function N2(n,e,t,i,s,r){n.root.rotation.y=Vn(e,Yn(t,i),s,4),n.ring.rotation.z=e.time*2.4,n.body.rotation.y=Math.sin(e.time*1.3)*.4,r.fx.pulse(r.byMat.core,.8+.3*Math.sin(e.time*6))}var zp={walltur:{type:"turret",build:o2,pose:a2},interceptor:{type:"flyer",build:l2,pose:c2},seeker:{type:"drifter",build:h2,pose:u2},statue:{type:"turret",build:d2,pose:f2},beltdrone:{type:"walker",build:p2,pose:m2},boltspin:{type:"spinner",build:g2,pose:x2},arcdrone:{type:"flyer",build:v2,pose:y2},armhub:{type:"spawner",build:_2,pose:M2},hugger:{type:"hugger",build:b2,pose:S2},leaper:{type:"hopper",build:w2,pose:E2},eggpod:{type:"egg",build:T2,pose:R2},acidmaw:{type:"turret",build:C2,pose:P2},hivenode:{type:"spawner",build:I2,pose:D2},shardling:{type:"flyer",build:L2,pose:N2}};var U2=Object.assign({},kp,zp),F2={turret:"walltur",walker:"beltdrone",flyer:"shardling",hopper:"rockmite",spawner:"armhub",drifter:"seeker",eel:"eel",spinner:"boltspin",egg:"eggpod",hugger:"hugger"};function k2(n){return(e,t)=>{let i={time:Math.random()*4,yaw:t&&t.facing>0?0:-Math.PI,phase:Math.random()*ze,pitch:0,flash:0,frost:0};return{st:i,update(s,r,o){s=s||{},r=r||{};let a=Dp(i,e,s,r,o||0);n.pose(e.bones,i,s,r,a,e),Lp(i,e)}}}}var oo={};for(let[n,e]of Object.entries(U2))oo[n]={type:e.type,build:e.build,animator:k2(e)};function Bp(n){return n&&n.skin&&oo[n.skin]?n.skin:F2[n&&n.type||"walker"]||"beltdrone"}var O2={shockwave:.5,lob:.6,volley:.6,dash:1.1,spawn:.7,barrage:1.4,beam:1.3};function z2(n){let e=n.cfg;return e?e.phases?e.phases[Math.min(n.phase||0,e.phases.length-1)].attacks:e.attacks:null}function Hp(n,e,t,i,s,r=3){i=Math.min(i||0,.05);let o=!!(t&&t.freeze>0),a=o?0:i;n.time+=a;let l=(e.state||"idle")+":"+(e.attack?e.attack.kind:"")+":"+(e.ai||0);l!==n.key&&(n.key=l,n.sT=0,e.state==="attack"&&(n.kick=1)),n.sT+=a;let c=z2(e);n.next=c&&c.length?c[(e.ai||0)%c.length].kind:n.defaultNext||"volley";let h=e.cfg&&e.cfg.tele||.7;n.tele=e.state==="tele"?Rt(e.stateT!=null&&e.cfg?1-e.stateT/h:n.sT/h,0,1):0,n.teleS=xt(n.teleS||0,n.tele,14,i),n.kind=e.state==="attack"&&e.attack?e.attack.kind:null;let u=n.kind?e.attack.dur||O2[n.kind]||.5:1;n.ap=n.kind?Rt(n.sT/u,0,1):0,n.kick=Math.max(0,(n.kick||0)-a*4),n.atk=xt(n.atk||0,n.kind?1:0,16,i),n.open=xt(n.open||0,e.open&&!e.dying?1:0,7,i),n.phaseS=xt(n.phaseS||0,e.phase||0,2.5,i),n.die=e.dying?Rt(1-(e.deathT!=null?e.deathT:0)/2.2,0,1):0,n.flash=e.hitFlash>0?Math.min(1,e.hitFlash*12)*.5:0,n.frost=o?Math.min(1,t.freeze*2):0;let f=n.px!=null&&i>0?(e.x-n.px)/i:0;n.px=e.x,n.vx=xt(n.vx||0,f,8,i),e.dying||(n.dir=Yn(e,t)),n.yaw=xt(n.yaw,(n.dir||-1)>=0?0:-Math.PI,r,a);let d=Ss(e,t,.42),g=(n.dir||-1)>0?d:Math.PI-d;return g>Math.PI&&(g-=ze),n.aim=xt(n.aim||0,Rt(g,-1.2,1.2),6,a),a}function Es(n,e,t){let i=t.phase||0;if(n.cracks1&&n.cracks1.scale.setScalar(i>=1||t.dying?1:1e-4),n.cracks2&&n.cracks2.scale.setScalar(i>=2||t.dying?1:1e-4),n.spark){let s=Math.sin(Math.floor(e.time*18)*91.7)*43758.5,r=s-Math.floor(s);n.spark.scale.setScalar(i>=1&&r>.45?.6+r:1e-4),n.spark.rotation.set(r*6,r*3,r*9)}}function Ts(n,e,t,i,s){(t.phase||0)>=2||t.dying?e.shedT=(e.shedT||0)+s:e.shedT=0;let r=e.shedT||0;i.forEach((o,a)=>{let l=n[o];if(!l)return;let c=l.userData.rest;if(r<=0){l.position.copy(c),l.rotation.set(0,0,0),l.scale.setScalar(1);return}let h=r*(1+a*.15);l.position.set(c.x-h*6*(a%2?1:-1),c.y-70*h*h,c.z+(c.z>=0?1:-1)*18*h),l.rotation.set(h*2.2*(a%2?1:-1),0,h*3.1),l.scale.setScalar(h>.75?1e-4:1)})}function As(n,e,t,i=1,s=46){let r=e.die;if(r<=0)return;if(!e.brk){let l=to(i);e.brk=t.map(()=>[l()*2-1,l()*.9+.2,l()*2-1,l()*6-3,l()*6-3,l()*6-3])}let o=Math.max(0,r-.25)/.75,a=o*o;t.forEach((l,c)=>{let h=n[l];if(!h)return;let u=e.brk[c],f=h.userData.rest;h.position.set(f.x+u[0]*s*a,f.y+u[1]*s*.8*a-60*a*a,f.z+u[2]*s*a*.6),h.rotation.set(u[3]*a,u[4]*a,u[5]*a)})}function Rs(n,e){let t=n.time;return[Math.sin(t*61)*e,Math.sin(t*53+1)*e*.7,Math.sin(t*47+2)*e*.5]}var Cs=(n,e,t,i,s,r,o,a)=>{let l=[];for(let c=0;c<=r;c++){let h=c/r,u=Math.sin(a*13.7+c*7.3)*o;l.push([n+(t-n)*h+u*.4,e+(i-e)*h+u,s])}return l},ao=We("#ff8a2a",3),dt={rock:or("#6e4030","#3a2218",2.4,"#8a6048"),rockD:or("#4e2c20","#2e1a12",2,"#6a4430"),rockL:or("#7e5038","#4a2c1e",2.6,"#9a7058"),frame:"#34302c",frameL:"#56504a",head:"#46403c",crys:"#4f97ff"};function B2(){let n=new vt(.038461538461538464);n.bone("pelvis","root",0,30,0).bone("torso","pelvis",0,36,0).bone("head","torso",12,58,0).bone("core","torso",9,46,0).bone("sN","torso",9,46,13.6).bone("sF","torso",9,46,-13.6).bone("pods","torso",-11,60,0).bone("armN","torso",2,55,16).bone("forN","armN",8,40,19).bone("armF","torso",2,55,-16).bone("forF","armF",8,40,-19).bone("plate0","torso",-6,53,11.8).bone("plate1","torso",-6,53,-11.8).bone("plate2","torso",0,64,0).bone("cracks1","torso",0,46,0).bone("cracks2","torso",0,46,0).bone("spark","torso",6,50,0);for(let[e,t]of[["N",1],["F",-1]])n.bone("th"+e,"pelvis",-1,30,t*9).bone("sh"+e,"th"+e,5,16,t*10).bone("ft"+e,"sh"+e,0,4,t*10);n.add("pelvis","metal",E(_.box(18,9,17,1.5,2),-1,30,0),dt.frame),n.add("pelvis","suit",E(Lt(5,3,.25,1,1.2,.8,1.1),7,28,0),dt.rockD);for(let e of[1,-1])n.add("pelvis","metal",E(_.cyl(4.2,4.2,4,14),-1,30,e*9.5,[Math.PI/2,0,0]),dt.frameL);n.add("torso","metal",_.ext([[-15,34],[13,36],[18,45],[16,57],[7,64],[-9,63],[-16,52]],22,2,{steps:2}),dt.frame),n.add("torso","suit",E(Lt(9,5,.16,2,1,1.15,1.2),13,45,0),dt.rock),n.add("torso","suit",E(Lt(7,6,.16,2,1.1,.7,1.25),9,37,0),dt.rockD),n.add("torso","suit",E(Lt(11,7,.16,2,1.1,.85,1),-8,54,0),dt.rock),n.add("torso","suit",E(Lt(6,8,.2,1,1.4,.7,1.6),-14,44,0),dt.rockD);for(let e of[1,-1])n.add("torso","suit",E(Lt(7,70+e,.18,1,1.9,.75,.32),-3,40.5,e*11.4),dt.rockD),n.add("torso","metal",E(_.torus(6.2,1.1,6,18),9,46,e*11.4),dt.frameL),n.add("core","core",E(_.cyl(5.2,5.2,.3,16),9,46,e*11.2,[Math.PI/2,0,0]),We("#5fb8ff",2.4)),n.add("torso","glow",_.tube([[-14,46,e*10.7],[-6,50,e*10.9],[2,47,e*10.9],[6,52,e*10.7]],.7,12,5),We("#6fc0ff",2.4)),n.add("torso","metal",E(_.cyl(1.1,1.1,9,8),-8,54,e*10.6,[0,0,.6]),dt.frameL),n.add("torso","metal",E(_.cyl(1.6,1.6,4,8),-11,50.5,e*10.6,[0,0,.6]),dt.frame),n.add("torso","suit",st([-6,58,e*8],[-2,61,e*13],[2,56,e*16],1,.9,10,6),"#1e1c1a");Zt(n,"torso",[[-10,61,4,2.6,12,.3,.4,3],[-4,62.5,-3,2.2,10,-.3,-.1,5],[-14,57,-5,1.8,8,-.5,.6,7],[-6,60,7,1.6,7,.6,.2,9],[16,52,6,1.2,5,.6,-.6,11]],dt.crys),n.add("torso","metal",E(_.box(6,5,9,1),9,57,0),dt.frameL),n.add("core","crystal",E(_.shard(5.4,31,6,11),9,46,0,[Math.PI/2,0,0]),dt.crys),n.add("core","core",E(_.shard(2.8,33,6,12),9,46,0,[Math.PI/2,0,0]),We("#8fd8ff",3.2)),n.add("sN","suit",E(Lt(6.8,21,.2,1,1.15,1.05,.42),9,46,14),dt.rockL),n.add("sF","suit",E(Lt(6.8,22,.2,1,1.15,1.05,.42),9,46,-14),dt.rockL);for(let[e,t]of[["plate0",1],["plate1",-1]])n.add(e,"suit",E(Lt(9,72+t,.16,2,1.25,1,.36),-6,54,t*12.4),dt.rockL),Zt(n,e,[[-8,60,t*14.5,1.1,5,t*.8,.3,25+t]],dt.crys);n.add("plate2","suit",E(Lt(8,31,.16,2,1.3,.5,1.1),0,64,0),dt.rockL),Zt(n,"plate2",[[2,66,2,1.4,6,.2,-.3,13]],dt.crys),n.add("head","metal",E(_.ext([[-6,-4.5],[6,-4.5],[9.5,-1],[8.5,3],[3,6],[-5,5.5],[-7.5,1]],10,1.2,{steps:2}),12,58,0),dt.head),n.add("head","suit",E(Lt(4.6,30,.25,0,1.3,.5,1.15),15,62.5,0),dt.rockD);for(let e of[1,-1])n.add("head","metal",E(_.ext([[14,57.8],[21.4,57.4],[21.6,60.2],[14.4,60.4]],.35,.1),0,0,e*5),"#151312"),n.add("head","glow",E(_.ext([[15,58.4],[21.3,58.1],[21.4,59.6],[15.4,59.8]],.3,.08),0,0,e*5.2),We("#ffad3a",3.4));n.add("head","glow",E(_.box(.4,1.4,8),21.3,58.9,0),We("#ffad3a",3.4)),n.add("head","metal",E(_.box(3,2.6,7,.4),19.5,55,0),dt.frameL),Zt(n,"head",[[10,63,0,1,4.5,0,.5,15]],dt.crys);for(let e of[1,-1]){n.add("pods","suit",E(Lt(4.4,40+e,.25,1,1.4,.9,1),-12,60,e*6.5),dt.rockD);for(let t=0;t<3;t++){let i=e*(4.2+t*2.4);n.add("pods","metal",E(_.cyl(1.4,1.6,9,10),-13+t*.4,65,i,[0,0,.55]),dt.frame),n.add("pods","accent",E(_.torus(1.25,.3,4,10),-15.4+t*.4,68.8,i,[Math.PI/2,0,.55]),We("#ffad3a",3))}}n.add("armN","metal",E(_.sph(5,12,10),2,55,16),dt.frameL),n.add("armN","metal",st([2,55,16],[4,48,18],[8,40,19],3.6,3,10,8),dt.frame),n.add("armN","suit",E(Lt(8.5,41,.17,2,1.15,.75,.95),1,60.5,18.5),dt.rock),Zt(n,"armN",[[0,64,19,1.4,6,.3,.3,17]],dt.crys),n.add("forN","metal",E(_.sph(3.4,10,8),8,40,19),dt.frameL),n.add("forN","metal",E(_.box(15,6.5,7.5,1.5,2),15.5,38,19),dt.frame),n.add("forN","suit",E(Lt(4.6,42,.25,0,1.6,.6,1),14,42,19),dt.rockD);for(let e of[-1.8,1.8])n.add("forN","metal",E(_.cyl(1.5,1.7,10,12),26,37.6,19+e,[0,0,-Math.PI/2]),dt.frameL),n.add("forN","accent",E(_.torus(1.55,.35,5,12),31,37.6,19+e,[0,Math.PI/2,0]),We("#7fd0ff",3.2));n.add("armF","metal",E(_.sph(5,12,10),2,55,-16),dt.frameL),n.add("armF","metal",st([2,55,-16],[4,48,-18],[8,40,-19],3.6,3,10,8),dt.frame),n.add("armF","suit",E(Lt(8.5,43,.17,2,1.15,.75,.95),1,60.5,-18.5),dt.rock),Zt(n,"armF",[[0,64,-19,1.4,6,-.3,.3,27]],dt.crys),n.add("forF","metal",E(_.sph(3.4,10,8),8,40,-19),dt.frameL),n.add("forF","metal",st([8,40,-19],[12,32,-20],[14,26,-20],3.8,3.4,10,8),dt.frame),n.add("forF","suit",E(Lt(5,44,.25,1,1,1.3,.8),12,32,-22),dt.rockD),n.add("forF","metal",E(_.box(11,11,10,2.2,2),16,20,-20),dt.frameL),n.add("forF","suit",E(Lt(5.6,45,.16,2,.9,1.1,1.1),21,21,-20),dt.rock),Zt(n,"forF",[[24,25,-17,1,5,.2,-1.2,19],[24,20,-21,1,5,0,-1.4,21],[24,24,-23,.8,4,-.2,-1.1,23]],dt.crys);for(let[e,t]of[["N",1],["F",-1]])n.add("th"+e,"metal",st([-1,30,t*9],[3,24,t*10],[5,16,t*10],4.6,3.6,10,8),dt.frame),n.add("th"+e,"suit",E(Lt(6.2,60+t,.22,1,.9,1.4,.6),3,24,t*13),dt.rock),n.add("sh"+e,"metal",E(_.sph(3.6,10,8),5,16,t*10),dt.frameL),n.add("sh"+e,"suit",E(Lt(3.8,62+t,.25,0,1,1,1.2),8.5,17,t*10),dt.rockL),n.add("sh"+e,"metal",st([5,16,t*10],[3,10,t*10],[0,4,t*10],3.6,3,10,8),dt.frame),n.add("sh"+e,"suit",E(Lt(4.8,64+t,.22,1,.9,1.4,.6),5,10,t*12.2),dt.rockD),n.add("ft"+e,"metal",E(_.ext([[-9,0],[11,0],[13,3],[7,6.5],[-6,6.5],[-10,3]],9,1.2),0,0,t*10),dt.frame),n.add("ft"+e,"suit",E(Lt(4.5,66+t,.22,1,1.2,.8,1.1),10,3.5,t*10),dt.rock);for(let e of[1,-1]){n.add("cracks1","glow",_.tube(Cs(12,38,19,52,e*10.9,5,1.2,1),.38,14,4),ao),n.add("cracks1","glow",_.tube(Cs(-14,56,-2,50,e*10.6,5,1.4,2),.38,14,4),ao),n.add("cracks2","glow",_.tube(Cs(-6,62,6,66,e*7,4,1,3),.4,10,4),ao),n.add("cracks2","glow",_.tube(Cs(4,34,14,40,e*11.6,4,1,4),.4,10,4),ao);for(let t=0;t<3;t++)n.add("spark","glow",E(_.box(.6,.6,.6),6+t*3,50+t*2,e*12),We("#ffd27a",5))}return n.build()}function H2(n,e,t,i,s,r){let o=Rs(e,e.die*2.4+(e.kind==="shockwave"?e.kick*1.4:0));n.root.rotation.y=e.yaw,n.root.position.set(o[0],-e.die*e.die*16+o[1],o[2]),e.phase=(e.phase||0)+Math.abs(e.vx)*s/44*ze;let a=Rt(Math.abs(e.vx)/40,0,1),l=Math.sin(e.time*1.6),c=e.teleS,h=e.next,u=0,f=0,d=0,g=0,x=0;if(t.state==="tele"&&(h==="shockwave"?(d=c,u=.5*c,f=-.12*c):h==="lob"?(x=c,f=.08*c,u=.3*c):g=c),e.kind==="shockwave"){let y=e.ap;d=y<.16?1-y/.16*1.25:-.25+(y-.16)*.4,u=.9-y*.7,f=.24*(1-y)}else e.kind==="lob"?(x=1-e.ap*.6,f=.12*(1-e.ap)):e.kind==="volley"&&(g=1);let m=e.open;f+=.1*m,u+=.3*m,n.pelvis.position.set(0,30-u*4.5+.35*l*(1-a)+a*.9*Math.abs(Math.sin(e.phase)),0),n.torso.rotation.set(0,.05*Math.sin(e.time*.7),-f+.012*l);for(let[y,v]of[["N",0],["F",Math.PI]]){let T=e.phase+v;n["th"+y].rotation.z=a*.32*Math.sin(T)+u*.42,n["sh"+y].rotation.z=-a*.42*Math.max(0,Math.cos(T))-u*.75,n["ft"+y].rotation.z=u*.33-a*.12*Math.sin(T)}n.armF.rotation.set(.45*m,0,1.9*d+.04*l-.75*m),n.forF.rotation.set(0,0,.7*Math.max(0,d)),n.armN.rotation.set(-.45*m,0,.3*g+.04*l-.75*m),n.forN.rotation.set(0,0,g*(e.aim-.3));let p=n.forN.userData.rest;n.forN.position.set(p.x-(e.kind==="volley"?2.4*e.kick:0),p.y,p.z),n.pods.rotation.z=.28*x;let M=n.pods.userData.rest;n.pods.position.set(M.x-(e.kind==="lob"?2.2*e.kick:0),M.y,M.z),n.head.rotation.set(0,.22*Math.sin(e.time*.5)*(1-c),-.12*m+.2*g*e.aim);for(let[y,v]of[["sN",1],["sF",-1]]){let T=n[y].userData.rest;n[y].position.set(T.x-1.5*m,T.y+12*m,T.z+v*3.5*m),n[y].rotation.set(-v*.55*m,0,.2*m)}r.fx.pulse(r.byMat.core,.45+.25*Math.sin(e.time*3)+m*(2+.4*Math.sin(e.time*14))+e.die*2*Math.abs(Math.sin(e.time*31))),r.fx.pulse(r.byMat.accent,.3+1.7*c+1.5*e.atk+e.kick),Es(n,e,t),Ts(n,e,t,["plate0","plate1","plate2"],s),As(n,e,["head","armN","armF","pods","sN","sF","core"],7,52)}var Gt={skin:"#2c4a50",skinD:"#1d3237",belly:"#6f8f86",plate:"#45606a",plateL:"#5f7e84",crys:"#3fd6c8",tooth:"#dfe8dc",fin:"#2a8f86"},Qu=We("#3fe6d4",3.2);function V2(){let n=new vt(.041666666666666664);n.bone("body","root",0,29,0).bone("head","body",6,30,0).bone("jaw","head",9,24,0).bone("core","head",17,27,0).bone("lure","head",14,46,0).bone("lure2","lure",24,54,0).bone("finN","body",-3,24,12).bone("finF","body",-3,24,-12).bone("t0","body",-12,30,0).bone("t1","t0",-22,30,0).bone("t2","t1",-30,30,0).bone("plate0","head",14,41,9).bone("plate1","head",14,41,-9).bone("plate2","head",22,40,0).bone("cracks1","head",14,34,0).bone("cracks2","body",0,30,0).bone("spark","head",16,36,0),n.add("head","flesh",E(ln(17,12.5,12.5,41,.08,22,14),15,32,0),Gt.skin),n.add("head","flesh",E(ln(12,6,10,42,.08),18,25,0),Gt.belly),n.add("head","flesh",E(_.ell(9,4,8,14,8),21,25.5,0),"#3a1c22");for(let e=0;e<9;e++){let t=16+e*2,i=9.2-Math.abs(e-4)*.25;for(let s of[1,-1])n.add("head","crystal",E(_.crystal(.75,3.6-Math.abs(e-5)*.2,5,.5,60+e),t,27.2,s*(i-2.8+e*.05),[Math.PI,0,0]),Gt.tooth)}for(let e of[1,-1]){for(let t=0;t<3;t++)n.add("head","glow",E(_.sph(.9-t*.15,8,6),25+t*2.2,36.5+t*.7,e*(10.2-t*.6)),Qu);for(let t=0;t<4;t++)n.add("head","accent",E(_.box(.5,6-t*.6,.4),4+t*2.2,31,e*12.1,[0,0,.12]),Qu);for(let t=0;t<5;t++)n.add("head","paint",E(_.shell(4.2,3.2,2.6,.5,-.9,.9,.4,2,6,4),4+t*4.6,39-Math.abs(t-2)*.8,e*(11-Math.abs(t-2)*.5),[0,e*-Math.PI/2,0]),t%2?Gt.plate:Gt.plateL)}Zt(n,"head",[[10,43,2,2.2,9,.2,.5,3],[5,42,-3,1.8,7,-.3,.7,5],[16,44,-1,1.6,6,-.1,-.2,7],[0,40,4,1.4,5,.4,1,9]],Gt.crys),n.add("jaw","flesh",E(ln(14,4.6,10.5,43,.08),19,20.5,0),Gt.belly),n.add("jaw","paint",E(_.ext([[8,18],[30,18.5],[33,21],[30,22],[10,21]],18,1),0,0,0),Gt.plate);for(let e=0;e<8;e++)for(let t of[1,-1])n.add("jaw","crystal",E(_.crystal(.7,3.2-Math.abs(e-4)*.2,5,.5,80+e),17+e*2,22.2,t*(8.4-e*.2)),Gt.tooth);n.add("core","core",E(_.sph(4.8,14,10),17,27,0),We("#9ffff0",3.4)),n.add("core","flesh",E(_.torus(5.2,1.2,6,16),17,27,0,[0,Math.PI/2,0]),"#5a2430"),n.add("lure","flesh",st([14,46,0],[18,54,0],[24,54,0],1,.6,12,6),Gt.skinD),n.add("lure2","flesh",st([24,54,0],[29,54,0],[31,50,0],.6,.35,10,5),Gt.skinD),n.add("lure2","core",E(_.sph(2,12,8),31,48.6,0),We("#b6fff4",3)),n.add("body","flesh",E(ln(14,11.5,11.5,44,.08),-5,30,0),Gt.skinD),n.add("body","flesh",E(_.ell(11,5,9,14,8),-4,22,0),Gt.belly);for(let e=0;e<7;e++)n.add("body","paint",E(_.cone(1,4.2-Math.abs(e-3)*.4,6),6-e*3.2,41-Math.abs(e-2)*.5,0,[0,0,.35]),Gt.plate);for(let e=0;e<6;e++)for(let t of[1,-1])n.add("body","paint",E(_.shell(3.4,2.8,2.2,.45,-.9,.9,.4,2,6,4),-14+e*3.6,35+Math.sin(e*1.3)*.6,t*10.2,[0,t*-Math.PI/2,0]),e%2?Gt.plate:Gt.plateL);for(let e=0;e<6;e++)for(let t of[1,-1])n.add("body","glow",E(_.sph(.55,6,4),-14+e*3.2,28+Math.sin(e)*1.5,t*11),Qu);Zt(n,"body",[[-6,40,3,1.4,5,.3,.4,11],[-12,38,-4,1.1,4,-.4,.6,13]],Gt.crys),n.add("t0","flesh",E(ln(9.5,8,8,45,.08),-17,30,0),Gt.skin);for(let e=0;e<3;e++)n.add("t0","paint",E(_.cone(.8,3,6),-12-e*3.2,37.5,0,[0,0,.4]),Gt.plate);n.add("t1","flesh",E(ln(7,5.5,5.5,46,.08),-26,30,0),Gt.skinD),n.add("t2","flesh",E(ln(4.5,3.6,3.6,47,.08),-32,30,0),Gt.skin),n.add("t2","membrane",E(_.membrane([[-31,0],[-36,12],[-38.5,11],[-35.5,0],[-38.5,-11],[-36,-12]]),0,30,0),Gt.fin);for(let e of[-.9,-.45,0,.45,.9])n.add("t2","paint",_.tube([[-31.5,30,0],[-34.5-Math.abs(e),30+e*6,0],[-37.6,30+e*12.4,0]],.22,6,4),Gt.skinD);for(let[e,t]of[["finN",1],["finF",-1]]){n.add(e,"membrane",E(_.membrane([[0,0],[-6,-8],[-14,-14],[-16,-10],[-10,-2]]),-3,24,t*12),Gt.fin);for(let i of[[-6,-8],[-11,-12],[-15,-12]])n.add(e,"paint",_.tube([[-3,24,t*12],[-3+i[0]*.55,24+i[1]*.5,t*12.1],[-3+i[0],24+i[1],t*12.1]],.2,6,4),Gt.skinD);n.add(e,"flesh",st([-3,24,t*12],[-9,17,t*12.5],[-17,12,t*12.2],.6,.25,10,4),Gt.skinD)}for(let[e,t]of[["plate0",1],["plate1",-1]])n.add(e,"paint",E(_.shell(11,8,7,1.2,t>0?.1:-1.5,t>0?1.5:-.1,.15,1.1,10,5),14,35,t*3.5),Gt.plate),Zt(n,e,[[12,43,t*8,1.2,5,t*.6,.3,21+t]],Gt.crys);n.add("plate2","paint",E(_.shell(9,7,9,1,-.8,.8,.3,1.3,8,5),18,34,0),Gt.plateL);for(let e of[1,-1]){n.add("cracks1","glow",_.tube(Cs(6,36,22,40,e*11.6,5,1,5),.32,14,4),We("#9ffff0",3)),n.add("cracks2","glow",_.tube(Cs(-14,26,2,34,e*11.2,5,1.2,6),.32,14,4),We("#9ffff0",3));for(let t=0;t<3;t++)n.add("spark","glow",E(_.box(.5,.5,.5),12+t*3,38-t,e*11),We("#d8fff8",5))}return n.build()}function G2(n,e,t,i,s,r){let o=Rs(e,e.die*2);n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*18,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time,u=.08+.05*Math.sin(h*1.3),f=0,d=0,g=0,x=1;t.state==="tele"&&(l==="dash"?(f=-.1*a,g=a,u=.02):l==="volley"?u=.25*a:(f=.25*a,u=.1+.1*a)),e.kind==="dash"?(d=1,u=.55,x=2.6,g=-.4):e.kind==="volley"?(u=.7*(1-e.ap*.6),f=.1):e.kind==="lob"&&(f=.35*(1-e.ap),u=.4),u=Math.max(u,.75*c),f+=.18*c,e.die>0&&(u=.6+.2*Math.sin(h*9),f=-.3*e.die,x=.3),e.jaw=xt(e.jaw||0,u,14,s),n.body.rotation.set(.04*Math.sin(h*1.1),0,-.05*d+.03*Math.sin(h*1.5)+e.die*-.25),n.body.position.set(d*3,29+Math.sin(h*2.2)*.8,0),n.head.rotation.set(0,0,f+.03*Math.sin(h*1.5+1)),n.jaw.rotation.z=-e.jaw;let m=h*3.2*x;n.t0.rotation.set(0,.12*Math.sin(m-.6),.12*Math.sin(m-.6)+.25*g),n.t1.rotation.set(0,.18*Math.sin(m-1.3),.18*Math.sin(m-1.3)+.35*g),n.t2.rotation.set(0,.25*Math.sin(m-2),.25*Math.sin(m-2)+.45*g),n.finN.rotation.x=-.25-.25*Math.sin(h*2.2*x),n.finF.rotation.x=.25+.25*Math.sin(h*2.2*x),n.lure.rotation.z=.12*Math.sin(h*1.4)-.1*f,n.lure2.rotation.z=.2*Math.sin(h*1.4-.8),n.core.scale.setScalar(.8+.3*c),r.fx.pulse(r.byMat.core,.4+.2*Math.sin(h*2.5)+c*2+e.die*Math.abs(Math.sin(h*27))*2),r.fx.pulse(r.byMat.accent,.4+1.6*a+1.2*e.atk),Es(n,e,t),Ts(n,e,t,["plate0","plate1","plate2"],s),As(n,e,["jaw","lure","finN","finF","t1","t2"],11,40)}var Wt={hull:"#30353c",hullL:"#4a5059",hullD:"#1e2227",red:"#8a1c1c",stripe:"#b8862e",metal:"#5c6168"},uh=We("#ff3b2f",3.4),dh=We("#ff7a2a",3.4);function W2(){let n=new vt(.038461538461538464);n.bone("hull","root",0,33,0).bone("chin","hull",26,22,0).bone("gat","chin",30,22,0).bone("tur","hull",8,47,0).bone("tgun","tur",10,50,0).bone("vls","hull",-16,46,0).bone("engN","hull",-14,30,22).bone("engF","hull",-14,30,-22).bone("flN","engN",-32.4,30,22).bone("flF","engF",-32.4,30,-22).bone("hTN","hull",2,34,14.2).bone("hBN","hull",2,34,14.2).bone("hTF","hull",2,34,-14.2).bone("hBF","hull",2,34,-14.2).bone("core","hull",2,34,0).bone("plate0","hull",-10,40,13.4).bone("plate1","hull",-10,40,-13.4).bone("cracks1","hull",0,34,0).bone("cracks2","hull",0,34,0).bone("spark","hull",10,38,0).bone("nav","hull",0,33,0);let e=_.ext([[-36,22],[20,20],[36,26],[41,32],[30,42],[6,48],[-26,46],[-38,36]],26,2.5,{steps:4});wn(e,t=>{t.y-=.012*t.z*t.z*(t.y>34?1:-.6)},!0),n.add("hull","paint",e,Wt.hull),n.add("hull","paint",E(_.ext([[-30,41],[18,40],[26,44],[4,50],[-24,48]],18,1.5),0,0,0),Wt.hullL);for(let t of[1,-1]){n.add("hull","paint",E(_.ext([[-34,26],[16,24],[30,29],[24,31],[-32,32]],1,.3),0,0,t*13.2),Wt.hullL),n.add("hull","paint",E(_.ext([[-30,31.5],[22,30.8],[24,32],[-30,33]],1.1,.2),0,0,t*13.3),Wt.red),n.add("hull","metal",E(_.torus(8.2,1.4,6,24),2,34,t*13.4),Wt.metal);for(let i=0;i<5;i++)n.add("hull","metal",E(_.box(2.4,.6,.6),-26+i*4.2,38.8,t*13.3),Wt.hullD);n.add("hull","glow",E(_.box(10,.5,.3),24,27,t*12.4,[0,0,.25]),uh),n.add("hull","paint",E(_.box(12,2.2,12,.6),-14,30,t*16),Wt.hullD),n.add("hull","paint",E(_.ext([[-24,40],[-12,40],[-16,54],[-24,56]],.9,.3),0,0,t*9,[t*.25,0,0]),Wt.hullL),n.add("hull","paint",E(_.box(5,1.6,.95),-21,53,t*9.6,[t*.25,0,0]),Wt.red)}n.add("core","core",E(_.cyl(7.2,7.2,27.4,20),2,34,0,[Math.PI/2,0,0]),We("#ffb066",3.2));for(let[t,i,s]of[["hTN","hBN",1],["hTF","hBF",-1]])n.add(t,"paint",E(_.ext([[-7.6,0],[7.6,0],[6.6,3.8],[3.8,6.6],[0,7.6],[-3.8,6.6],[-6.6,3.8]],1.4,.4),2,34,s*14),Wt.hullL),n.add(i,"paint",E(_.ext([[-7.6,0],[-6.6,-3.8],[-3.8,-6.6],[0,-7.6],[3.8,-6.6],[6.6,-3.8],[7.6,0]],1.4,.4),2,34,s*14),Wt.hull),n.add(t,"paint",E(_.box(12,.5,.3),2,34.6,s*14.8),Wt.stripe);n.add("chin","metal",E(_.sph(5,12,10),26,22,0),Wt.hullD),n.add("chin","paint",E(_.shell(5.4,5.4,5.4,.6,-1,1,.3,2.2,8,6),26,22,0),Wt.hullL);for(let t=0;t<6;t++){let i=t/6*ze;n.add("gat","metal",E(_.cyl(.6,.6,12,8),35,22+Math.cos(i)*1.6,Math.sin(i)*1.6,[0,0,-Math.PI/2]),Wt.metal)}n.add("gat","metal",E(_.cyl(2.4,2.4,1.2,12),32,22,0,[0,0,-Math.PI/2]),Wt.hullD),n.add("gat","metal",E(_.cyl(2.4,2.4,1,12),39,22,0,[0,0,-Math.PI/2]),Wt.hullD),n.add("gat","accent",E(_.torus(2,.3,4,12),41.2,22,0,[0,Math.PI/2,0]),dh),n.add("tur","paint",E(_.shell(7,5,7,.6,0,ze,0,Math.PI/2+.2,16,5),8,47,0),Wt.hullL),n.add("tur","paint",E(_.torus(6.9,.4,4,18),8,47.4,0,[Math.PI/2,0,0]),Wt.red),n.add("tgun","paint",E(_.box(6,4,6,1,2),11,50,0),Wt.hull);for(let t of[1.6,-1.6])n.add("tgun","metal",E(_.cyl(.85,.95,16,10),21,50.4,t,[0,0,-Math.PI/2]),Wt.metal),n.add("tgun","accent",E(_.torus(.95,.25,4,10),29.2,50.4,t,[0,Math.PI/2,0]),dh);n.add("tgun","core",E(_.box(.3,.8,2.6),14.1,51.2,0),uh),n.add("vls","paint",E(_.box(14,5,14,1,2),-16,48,0),Wt.hullD);for(let t=0;t<3;t++)for(let i=0;i<2;i++)n.add("vls","metal",E(_.box(3.4,.6,4.4,.2),-20.5+t*4.5,50.7,-3+i*6),Wt.metal),n.add("vls","accent",E(_.cone(1.2,2.4,8),-20.5+t*4.5,51.8,-3+i*6),uh);for(let[t,i,s]of[["engN","flN",1],["engF","flF",-1]])n.add(t,"paint",E(_.cyl(5.4,6,24,16),-16,30,s*22,[0,0,Math.PI/2]),Wt.hull),n.add(t,"metal",E(_.torus(5.7,.8,5,18),-4.5,30,s*22,[0,Math.PI/2,0]),Wt.metal),n.add(t,"metal",E(_.lathe([[5.6,0],[6.4,-.6],[5.6,-4],[4.6,-4.2],[4.8,-.6]],16),-28,30,s*22,[0,0,Math.PI/2]),Wt.hullD),n.add(t,"glow",E(_.cyl(4.6,4.6,.2,16),-32.2,30,s*22,[0,0,Math.PI/2]),dh),n.add(t,"paint",E(_.box(16,1.2,.6),-14,30,s*27.6),Wt.stripe),n.add(t,"paint",E(_.ext([[-26,35],[-10,35],[-14,42],[-24,43]],.8,.25),0,0,s*22),Wt.hullL),n.add(i,"glow",E(_.lathe([[4.4,0],[3.2,-4],[1.6,-8],[.05,-11]],12),-32.4,30,s*22,[0,0,Math.PI/2]),We("#ff8a4a",2.4));n.add("nav","glow",E(_.sph(.8,6,4),-36,37,0),uh),n.add("nav","glow",E(_.sph(.8,6,4),30,42,0),We("#ffffff",4));for(let[t,i]of[["plate0",1],["plate1",-1]])n.add(t,"paint",E(_.ext([[-28,35],[-6,35],[-4,44],[-26,45]],1.4,.5),0,0,i*13.6),Wt.hullL);for(let t of[1,-1]){n.add("hull","glow",_.tube([[-26,38,t*12.9],[-18,42,t*12.9],[-10,37,t*12.9],[-4,41,t*12.9]],.6,12,5),dh.map(i=>i*.7)),n.add("cracks1","glow",_.tube(Cs(14,28,30,36,t*13.6,5,1,7),.32,14,4),ao),n.add("cracks2","glow",_.tube(Cs(-34,30,-16,26,t*13.6,5,1,8),.32,14,4),ao);for(let i=0;i<3;i++)n.add("spark","glow",E(_.box(.6,.6,.6),8+i*4,40-i,t*14),We("#ffd27a",5))}return n.build()}function X2(n,e,t,i,s,r){let o=Rs(e,e.die*2.2+(e.kind==="barrage"?.35:0));n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*26,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time;n.hull.rotation.set(.04*Math.sin(h*.9)+e.die*.3,0,.03*Math.sin(h*1.3)-e.die*.35);let u=t.state==="tele"&&l==="volley"||e.kind==="volley"?1:0;e.tv=xt(e.tv||0,u,6,s),n.tur.rotation.y=0,n.tgun.rotation.z=e.tv*Rt(e.aim,-.5,.6);let f=n.tgun.userData.rest;n.tgun.position.set(f.x-(e.kind==="volley"?2.5*e.kick:0),f.y,f.z),e.gspin=(e.gspin||0)+s*(e.kind==="barrage"?30:t.state==="tele"&&l==="barrage"?12*a:.5),n.gat.rotation.x=e.gspin,n.chin.rotation.z=e.kind==="barrage"||t.state==="tele"&&l==="barrage"?Rt(e.aim,-.6,.3):0;let d=(e.kind==="lob"?1-e.ap:0)+(t.state==="tele"&&l==="lob"?a*.5:0);n.vls.position.y=n.vls.userData.rest.y+1.5*d;for(let[x,m]of[["hTN","hBN"],["hTF","hBF"]])n[x].position.y=n[x].userData.rest.y+8*c,n[m].position.y=n[m].userData.rest.y-8*c;let g=.85+.15*Math.sin(h*43)+.25*(e.kind?1:0);n.flN.scale.set(g,1,1),n.flF.scale.set(g*(.97+.03*Math.sin(h*37)),1,1),n.nav.scale.setScalar(h%1.2<.1?1:1e-4),r.fx.pulse(r.byMat.core,.35+.15*Math.sin(h*3)+c*2.4+e.die*2*Math.abs(Math.sin(h*29))),r.fx.pulse(r.byMat.accent,.3+1.8*a+1.6*e.atk),Es(n,e,t),Ts(n,e,t,["plate0","plate1"],s),As(n,e,["engN","engF","tur","vls","chin","hTN","hBF"],13,56)}var Vp={warden:{build:B2,pose:H2},maw:{build:V2,pose:G2},gunship:{build:W2,pose:X2}};var Fa=(n,e,t,i,s,r,o,a)=>{let l=[];for(let c=0;c<=r;c++){let h=c/r,u=Math.sin(a*13.7+c*7.3)*o;l.push([n+(t-n)*h+u*.4,e+(i-e)*h+u,s])}return l},Ua=We("#ff6a14",3.4),Gp=We("#ffcf3a",3.2),ed=We("#ff8a2a",3),mt={iron:"#302c2a",ironL:"#48423e",steel:"#5c6066",steelL:"#7c8086",brass:"#a07a3a",hazard:"#d8a12a",dark:"#1a1716",rust:"#6e3a20"};function q2(){let n=new vt(.038461538461538464);n.bone("pelvis","root",0,34,0).bone("torso","pelvis",0,40,0).bone("head","torso",9,70,0).bone("core","torso",6,49,0).bone("doorN","torso",14.5,49,13.4).bone("doorF","torso",14.5,49,-13.4).bone("stacks","torso",-10,70,0).bone("armN","torso",0,64,18).bone("forN","armN",4,47,21).bone("armF","torso",0,64,-18).bone("forF","armF",4,47,-21).bone("plate0","torso",-6,57,13).bone("plate1","torso",-6,57,-13).bone("plate2","torso",0,71,0).bone("cracks1","torso",0,50,0).bone("cracks2","torso",0,50,0).bone("spark","torso",0,56,0);for(let[e,t]of[["N",1],["F",-1]])n.bone("th"+e,"pelvis",-2,34,t*10).bone("sh"+e,"th"+e,4,19,t*11).bone("ft"+e,"sh"+e,-1,5,t*11);n.add("pelvis","paint",E(_.box(22,10,20,1.6,2),-1,34,0),mt.iron);for(let e=0;e<6;e++)n.add("pelvis","paint",E(_.box(2.4,3.2,20.4),-9+e*3.6,31.6,0,[0,0,.6]),e%2?mt.dark:mt.hazard);for(let e of[1,-1])n.add("pelvis","metal",E(_.cyl(5,5,4.4,16),-2,34,e*10.4,[Math.PI/2,0,0]),mt.steelL);n.add("torso","metal",_.ext([[-16,38],[14,38],[19,48],[18,62],[10,70],[-10,70],[-18,60]],24,2.4,{steps:2}),mt.steel);for(let e of[1,-1]){n.add("torso","paint",E(_.ext([[-16,39],[2,39],[2,47],[-17,47]],1.4,.5),0,0,e*12.4),mt.ironL),n.add("torso","metal",E(_.torus(8.6,1.3,6,22),6,49,e*12.4),mt.brass);for(let t=0;t<4;t++)n.add("torso","metal",E(_.box(16,.9,.6),6,44+t*3.2,e*12.6),mt.dark);for(let t=0;t<3;t++)n.add("torso","accent",E(_.box(6,.6,.4),12,62+t*1.6,e*12.2,[0,0,-.35]),Ua);n.add("torso","glow",_.tube([[-15,50,e*11.8],[-8,54,e*12],[-12,60,e*12],[-4,64,e*11.8]],.7,12,5),Ua.map(t=>t*.6)),n.add("torso","metal",E(_.torus(3.4,.9,6,14),-10,58,e*11.8),mt.steelL),n.add("torso","suit",st([-12,64,e*8],[-6,69,e*14],[0,64,e*18],1.1,1,10,6),mt.dark)}n.add("torso","paint",E(_.ext([[10,60],[19,52],[20,58],[14,67]],18,1.2),0,0,0),mt.ironL),n.add("core","core",E(_.cyl(8,8,25.2,20),6,49,0,[Math.PI/2,0,0]),We("#ff9a40",3.3));for(let e of[1,-1])for(let t=-2;t<=2;t++)n.add("torso","metal",E(_.box(.7,15,.7),6+t*3,49,e*12.8),mt.dark);for(let[e,t]of[["doorN",1],["doorF",-1]]){n.add(e,"paint",E(_.ext([[-2,-7.4],[14.5,-7.4],[15.8,-5],[15.8,5],[14.5,7.4],[-2,7.4],[-3.2,5],[-3.2,-5]],1.6,.5),-1.2,49,t*13.6),mt.ironL),n.add(e,"metal",E(_.box(14,1,.5),6,49,t*14.5),mt.brass);for(let i of[44,54])n.add(e,"metal",E(_.cyl(.8,.8,2.4,8),14.5,i,t*13.4),mt.steelL)}n.add("head","paint",E(_.ext([[-5,-4.5],[6,-4.5],[8.5,0],[6.5,5],[-4,5.2],[-6,1]],9.4,1),9,70,0),mt.ironL);for(let e of[1,-1])n.add("head","metal",E(_.ext([[11,70],[17.4,69.6],[17.4,71.6],[11.6,71.8]],.3,.08),0,0,e*4.75),mt.dark),n.add("head","glow",E(_.ext([[11.6,70.4],[17.2,70.1],[17.2,71.2],[12,71.4]],.3,.06),0,0,e*4.95),Gp);n.add("head","glow",E(_.box(.4,1,7),17.5,70.7,0),Gp),n.add("head","metal",E(_.cyl(.25,.25,6,5),4,77,3,[0,0,.3]),mt.steelL);for(let e of[1,-1]){n.add("stacks","paint",E(_.cyl(2.6,3,14,14),-12,76,e*6),mt.iron);for(let t of[72,79])n.add("stacks","metal",E(_.torus(2.9,.45,5,14),-12,t,e*6,[Math.PI/2,0,0]),mt.brass);n.add("stacks","accent",E(_.cyl(2.2,2.2,.3,12),-12,83.1,e*6),Ua)}n.add("armN","metal",E(_.cyl(5.4,5.4,6,16),0,64,18,[Math.PI/2,0,0]),mt.steelL),n.add("armN","paint",E(_.ext([[-8,64],[-4,71],[6,71],[9,64],[4,60],[-5,60]],4,1),0,0,20),mt.ironL);for(let e=0;e<4;e++)n.add("armN","paint",E(_.box(1.6,2.6,.4),-4+e*3,66,22.1,[0,0,.6]),e%2?mt.dark:mt.hazard);n.add("armN","metal",st([0,64,18.5],[2,56,20],[4,47,21],3.4,3,10,8),mt.steel),n.add("armN","metal",E(_.cyl(1,1,12,8),4,56,23.2,[0,0,.2]),mt.steelL),n.add("forN","metal",E(_.sph(3.6,12,8),4,47,21),mt.brass),n.add("forN","paint",st([4,47,21],[7,40,21],[9,34,21],3.6,3.2,10,8),mt.ironL),n.add("forN","paint",E(_.box(11,15,12,1.6,2),10,26,21),mt.iron);for(let e of[21,31])n.add("forN","metal",E(_.box(11.6,1.4,12.6,.3),10,e,21),mt.brass);n.add("forN","accent",E(_.box(.6,12,10),15.8,26,21),Ua),n.add("armF","metal",E(_.cyl(5.4,5.4,6,16),0,64,-18,[Math.PI/2,0,0]),mt.steelL),n.add("armF","paint",E(_.ext([[-8,64],[-4,71],[6,71],[9,64],[4,60],[-5,60]],4,1),0,0,-20),mt.ironL),n.add("armF","metal",st([0,64,-18.5],[2,56,-20],[4,47,-21],3.4,3,10,8),mt.steel),n.add("forF","metal",E(_.sph(3.6,12,8),4,47,-21),mt.brass),n.add("forF","paint",E(_.box(16,7.5,8,1.4,2),12,45,-21),mt.ironL),n.add("forF","metal",E(_.cyl(2.8,3.2,12,14),24,45,-21,[0,0,-Math.PI/2]),mt.steel);for(let e of[20,26])n.add("forF","metal",E(_.torus(3.2,.5,5,14),e,45,-21,[0,Math.PI/2,0]),mt.brass);n.add("forF","accent",E(_.cyl(2.2,2.2,.3,12),30.2,45,-21,[0,0,-Math.PI/2]),Ua);for(let[e,t]of[["N",1],["F",-1]]){n.add("th"+e,"metal",st([-2,34,t*10],[2,26,t*11],[4,19,t*11],4.6,3.8,10,8),mt.steel),n.add("th"+e,"paint",E(_.ext([[-4,31],[6,30],[7,21],[-1,22]],2,.6),0,0,t*15),mt.ironL),n.add("th"+e,"metal",E(_.cyl(.9,.9,12,8),-3,26,t*15.6,[0,0,-.25]),mt.steelL),n.add("sh"+e,"metal",E(_.cyl(4,4,7,14),4,19,t*11,[Math.PI/2,0,0]),mt.brass),n.add("sh"+e,"paint",E(_.box(7.5,14,8.5,1.4,2),1.6,12,t*11,[0,0,.2]),mt.iron);for(let i=0;i<3;i++)n.add("sh"+e,"paint",E(_.box(1.4,2.2,.4),0+i*2.4,14,t*15.4,[0,0,.6]),i%2?mt.dark:mt.hazard);n.add("ft"+e,"paint",E(_.ext([[-9,0],[12,0],[13.5,2.6],[8,6],[-6,6],[-10,3]],11,1.2),0,0,t*11),mt.ironL);for(let i of[-3.4,0,3.4])n.add("ft"+e,"metal",E(_.box(3.2,2.6,2.6,.6),13,1.6,t*11+i),mt.steelL)}for(let[e,t]of[["plate0",1],["plate1",-1]]){n.add(e,"paint",E(_.ext([[-17,50],[0,50],[2,63],[-8,67],[-17,62]],2.2,.7,{steps:2}),0,0,t*13.2),mt.ironL);for(let i=0;i<4;i++)n.add(e,"paint",E(_.box(1.8,3,.4),-14+i*3.4,53,t*14.4,[0,0,.6]),i%2?mt.dark:mt.hazard)}n.add("plate2","paint",E(_.ext([[-12,68],[10,68],[12,73],[-12,74]],30,1.2),0,0,0),mt.ironL);for(let e of[1,-1]){n.add("cracks1","glow",_.tube(Fa(-14,40,0,46,e*13.3,5,1,1),.36,14,4),ed),n.add("cracks1","glow",_.tube(Fa(12,58,18,66,e*9.2,4,.8,2),.36,10,4),ed),n.add("cracks2","glow",_.tube(Fa(-16,60,-4,68,e*12.6,5,1,3),.38,14,4),ed);for(let t=0;t<3;t++)n.add("spark","glow",E(_.box(.7,.7,.7),-6+t*4,56+t*2,e*13.4),We("#ffd27a",5))}return n.build()}function Y2(n,e,t,i,s,r){let o=Rs(e,e.die*2.6+(e.kind==="shockwave"?e.kick*1.6:0));n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*18,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time,u=e.kind==="dash";e.phase=(e.phase||0)+Math.abs(e.vx)*s/(u?60:46)*ze;let f=Rt(Math.abs(e.vx)/40,0,1),d=Math.sin(h*1.5),g=0,x=0,m=0,p=0;if(t.state==="tele"&&(l==="dash"?(g=.7*a,x=-.1*a):l==="shockwave"?(m=a,x=-.1*a):p=a),u)x=.28,g=.3;else if(e.kind==="shockwave"){let v=e.ap;m=v<.16?1-v/.16*1.3:-.3+(v-.16)*.4,g=.8-v*.6,x=.2*(1-v)}else e.kind==="volley"&&(p=1);x+=.08*c,g+=.25*c,n.pelvis.position.set(0,34-g*4.5+.3*d*(1-f)+f*1.1*Math.abs(Math.sin(e.phase)),0),n.torso.rotation.set(0,.04*Math.sin(h*.6),-x+.012*d);for(let[v,T]of[["N",0],["F",Math.PI]]){let A=e.phase+T,P=u?.55:.34;n["th"+v].rotation.z=f*P*Math.sin(A)+g*.42,n["sh"+v].rotation.z=-f*P*1.2*Math.max(0,Math.cos(A))-g*.75,n["ft"+v].rotation.z=g*.33-f*.12*Math.sin(A)}n.armN.rotation.set(0,0,2*m+.04*d+(u?-.4:0)),n.forN.rotation.set(0,0,.8*Math.max(0,m)),n.armF.rotation.set(0,0,.2*p+.04*d+(u?-.4:0)),n.forF.rotation.set(0,0,p*(e.aim-.2));let M=n.forF.userData.rest;n.forF.position.set(M.x-(e.kind==="volley"?2.4*e.kick:0),M.y,M.z),n.head.rotation.set(0,.25*Math.sin(h*.4)*(1-a),-.1*c+.15*p*e.aim),n.stacks.rotation.z=.03*Math.sin(h*2.3),n.doorN.rotation.y=-1.7*c,n.doorF.rotation.y=1.7*c;let y=.85+.15*Math.sin(h*19)*Math.sin(h*6.3);r.fx.pulse(r.byMat.core,(.5+c*2)*y+e.die*Math.abs(Math.sin(h*31))*2),r.fx.pulse(r.byMat.accent,(.45+1.6*a+1.4*e.atk)*y),Es(n,e,t),Ts(n,e,t,["plate0","plate1","plate2"],s),As(n,e,["head","armN","armF","stacks","doorN","doorF"],17,54)}var cn={crys:"#7a3ff0",crysD:"#5a2ab8",crysL:"#a57aff",flesh:"#4a2240",fleshL:"#6a3256",sac:"#6e3c5e",bone:"#cdbba2",chitin:"#24162a",wing:"#b48cff"},lo=We("#8fff3f",3.2);function Z2(){let n=new vt(.041666666666666664);n.bone("thorax","root",0,40,0).bone("head","thorax",15,46,0).bone("jaw","head",22,43,0).bone("abd","thorax",-10,37,0).bone("abd2","abd",-24,30,0).bone("wN","thorax",-2,51,6).bone("wF","thorax",-2,51,-6).bone("wN2","thorax",-5,50,5).bone("wF2","thorax",-5,50,-5).bone("cpN","thorax",3,41,8.5).bone("cpF","thorax",3,41,-8.5).bone("core","thorax",3,40,0).bone("plate0","thorax",-2,48,6).bone("plate1","thorax",-2,48,-6).bone("cracks1","thorax",0,40,0).bone("cracks2","thorax",0,40,0).bone("spark","thorax",4,44,0);for(let[i,s]of[["N",1],["F",-1]])n.bone("sc"+i,"thorax",10,36,s*8).bone("sc"+i+"k","sc"+i,18,24,s*11);let e=[6,2,-2,-6];e.forEach((i,s)=>{let r=s%2?-1:1;n.bone("l"+s,"thorax",i,32,r*5.5).bone("l"+s+"k","l"+s,i+2,22,r*9)}),n.add("thorax","flesh",E(ln(12.5,9.5,8.6,51,.08),2,40,0),cn.flesh),n.add("thorax","flesh",E(_.ell(8,4,6.4,12,8),4,33.6,0),cn.fleshL),n.add("thorax","core",E(_.sph(5.2,14,10),3,40,0),We("#a6ff5a",3.2)),Zt(n,"thorax",[[-4,48,0,1.8,9,0,.6,3],[2,49,0,1.6,8,0,.3,5],[8,48,0,1.3,6,0,-.1,7],[-9,45,0,1.2,5,0,1,9]],cn.crys),n.add("thorax","crystal",E(_.shell(12.6,9.6,8.8,.6,0,ze,0,.9,16,4),2,40.4,0),cn.crys);for(let[i,s]of[["cpN",1],["cpF",-1]])n.add(i,"crystal",E(_.shell(10.5,8.5,9.2,.7,s>0?.35:-2.8,s>0?2.8:-.35,.8,2.1,10,5),3,40,0),cn.crysD);for(let[i,s]of[["plate0",1],["plate1",-1]])n.add(i,"crystal",E(_.shell(12.8,9.8,9,.7,s>0?1.7:-3,s>0?3:-1.7,.3,1.4,8,4),2,40.2,0),cn.crys);n.add("head","flesh",E(ln(9,6.4,6,52,.08),21,47,0,[0,0,-.2]),cn.fleshL),n.add("head","crystal",E(_.shell(9.4,6.8,6.4,.5,-.6,3.74,0,1.2,12,4),20,47.4,0,[0,0,-.2]),cn.crysD),Zt(n,"head",[[15,52,0,1.6,10,0,1,11],[16,53,2.6,1.2,8,.4,1.1,13],[16,53,-2.6,1.2,8,-.4,1.1,15],[21,53,0,1,5,0,.4,17]],cn.crys);for(let i of[1,-1])for(let s=0;s<3;s++)n.add("head","glow",E(_.sph(1-s*.15,8,6),25.5+s*1.8,48.8-s*.7,i*(4.6-s*.6)),lo);for(let i of[1,-1])n.add("jaw","paint",st([22,43,i*1.8],[26,41,i*2.2],[27.5,38,i*.8],.8,.15,8,5),cn.bone),n.add("jaw","paint",st([23,44,i*2.4],[26.5,43.6,i*2.8],[28.4,41.6,i*1.6],.6,.12,8,5),cn.bone);n.add("jaw","glow",E(_.sph(1.2,8,6),25.5,42.4,0),lo),n.add("abd","flesh",E(ln(14,11.5,10.5,53,.07),-17,31,0,[0,0,.25]),cn.sac);for(let i=0;i<4;i++)n.add("abd","paint",E(_.torus(9.6-Math.abs(i-1.2)*1.4,.6,6,22),-9-i*5,34-i*1.6,0,[0,Math.PI/2,.25]),cn.bone);for(let i=0;i<5;i++){let s=i*1.25;n.add("abd","accent",_.tube([[-6,34+Math.cos(s)*6,Math.sin(s)*6],[-16,31+Math.cos(s+.4)*10.5,Math.sin(s+.4)*9.6],[-26,28+Math.cos(s+.8)*6,Math.sin(s+.8)*5.6]],.3,12,4),lo.map(r=>r*.6))}n.add("abd2","flesh",E(_.ell(4.5,3.6,3.6,10,8),-30,27,0,[0,0,.5]),cn.fleshL),n.add("abd2","accent",E(_.sph(1.8,10,8),-33.4,24.6,0),lo);let t=(i,s)=>_.membrane([[0,0],[-i*.2,s*.7],[-i*.6,s],[-i,s*.8],[-i*.75,s*.25],[-i*.3,-.5]]);for(let[i,s,r,o]of[["wN",6,26,18],["wF",-6,26,18],["wN2",5,20,13],["wF2",-5,20,13]]){let a=i.endsWith("2")?-5:-2,l=i.endsWith("2")?50:51;n.add(i,"membrane",E(t(r,o),a,l,s),cn.wing),n.add(i,"crystal",_.tube([[a,l,s],[a-r*.3,l+o*.85,s],[a-r,l+o*.8,s]],.35,10,4),cn.crysL),n.add(i,"crystal",_.tube([[a-r*.2,l+o*.4,s],[a-r*.55,l+o*.55,s],[a-r*.8,l+o*.4,s]],.22,8,4),cn.crysL)}for(let[i,s]of[["N",1],["F",-1]]){n.add("sc"+i,"paint",st([10,36,s*8],[15,31,s*10],[18,24,s*11],1.6,1.2,10,6),cn.chitin),n.add("sc"+i+"k","paint",E(_.sph(1.4,8,6),18,24,s*11),cn.bone);let r=_.shard(1.6,22,5,70+s,.1);tn(r,null,null,[1,1,.45]),n.add("sc"+i+"k","crystal",E(r,22,31,s*11,[0,0,-.55]),cn.crysL)}e.forEach((i,s)=>{let r=s%2?-1:1;n.add("l"+s,"paint",st([i,32,r*5.5],[i+1.5,27,r*7.8],[i+2,22,r*9],.9,.6,8,5),cn.chitin),n.add("l"+s+"k","paint",st([i+2,22,r*9],[i+.6,15,r*9.5],[i-1.4,8,r*9],.6,.12,8,5),cn.bone)});for(let i of[1,-1]){n.add("cracks1","glow",_.tube(Fa(-8,44,10,48,i*9.4,5,.8,1),.3,14,4),lo),n.add("cracks2","glow",_.tube(Fa(-6,34,10,36,i*8.6,5,.8,2),.3,14,4),lo);for(let s=0;s<3;s++)n.add("spark","glow",E(_.box(.5,.5,.5),2+s*3,44+s,i*9.6),We("#e6ffb0",5))}return n.build()}var $2=new F;function J2(n,e,t,i,s,r){let o=Rs(e,e.die*2);n.root.rotation.y=e.yaw,n.root.position.set(o[0],o[1]-e.die*e.die*20,o[2]);let a=e.teleS,l=e.next,c=e.open,h=e.time,u=0,f=0,d=0,g=0,x=1;t.state==="tele"&&(l==="spawn"?u=a:l==="dash"?(f=a,x=1.6):d=a),e.kind==="spawn"?u=1-e.ap*.8:e.kind==="dash"?(f=-.8,g=1,x=2.2):e.kind==="lob"&&(d=1-e.ap*1.6),n.thorax.rotation.set(.04*Math.sin(h*1.2),0,-.18*g+.04*Math.sin(h*1.6)+.1*d*.5-e.die*.4),n.thorax.position.set(3*g,40+Math.sin(h*2.2)*.8,0),n.head.rotation.set(0,.12*Math.sin(h*.8),.3*d-.1*g),n.jaw.rotation.z=-.25*Math.max(d,c*.5)-.06*Math.sin(h*3);let m=Math.sin(h*2+u*6);n.abd.rotation.z=.06*Math.sin(h*1.1)-.15*u,n.abd.scale.set(1-.1*u+.03*m,1-.12*u+.03*m,1-.08*u+.03*m),n.abd2.rotation.z=.12*Math.sin(h*1.4-.7)-.3*u;let p=Math.sin(h*ze*9*x);n.wN.rotation.x=-.3-.55*p,n.wF.rotation.x=.3+.55*p,n.wN2.rotation.x=-.4-.5*Math.sin(h*ze*9*x+1),n.wF2.rotation.x=.4+.5*Math.sin(h*ze*9*x+1);for(let M of["N","F"])n["sc"+M].rotation.z=.15*Math.sin(h*1.3)+.9*f,n["sc"+M+"k"].rotation.z=.2*Math.sin(h*1.3+.6)+.6*Math.max(0,f)-.5*Math.max(0,-f);for(let M=0;M<4;M++)n["l"+M].rotation.z=.15*Math.sin(h*1.7+M)-.3*g,n["l"+M+"k"].rotation.z=.2*Math.sin(h*1.7+M+.8)-.2;for(let[M,y]of[["cpN",1],["cpF",-1]]){let v=n[M].userData.rest;n[M].position.set(v.x,v.y+3*c,v.z+y*4*c),n[M].quaternion.setFromAxisAngle($2.set(1,0,0),-y*.9*c)}r.fx.pulse(r.byMat.core,.4+.25*Math.sin(h*3)+c*2+e.die*Math.abs(Math.sin(h*29))*2),r.fx.pulse(r.byMat.accent,.45+1.6*Math.max(a,u)+1.2*e.atk),Es(n,e,t),Ts(n,e,t,["plate0","plate1"],s),As(n,e,["head","wN","wF","wN2","wF2","scN","scF","abd","cpN","cpF"],19,44)}var En={metal:"#2a2430",metalL:"#433a4c",crys:"#8a4dff",crysL:"#c09aff",flesh:"#3a1a30",bone:"#cdbba2"},td=We("#c58aff",3.2),Ps=We("#8fff3f",3.2);function K2(){let n=new vt(.03571428571428571),e=[0,52,0];n.bone("body","root",0,52,0).bone("core","body",0,52,0).bone("pupil","core",0,52,8).bone("crown","body",0,74,0).bone("r0","body",0,52,0).bone("r1","body",0,52,0).bone("r2","body",0,52,0).bone("orbit","body",0,52,0).bone("plate0","body",30,52,0).bone("plate1","body",-30,52,0).bone("cracks1","core",0,52,0).bone("cracks2","core",0,52,0).bone("spark","body",0,52,0);for(let t=0;t<6;t++){let i=t/6*ze+Math.PI/2;n.bone("p"+t,"body",Math.cos(i)*11,52+Math.sin(i)*11,13.5)}for(let t=0;t<4;t++){let i=-12+t*8;n.bone("td"+t,"body",i,30,(t%2?-1:1)*3).bone("td"+t+"b","td"+t,i*1.1,16,(t%2?-1:1)*3)}n.add("core","crystal",E(_.shard(12,40,8,91,.1),...e),En.crys),n.add("core","core",E(_.shard(5.6,34,8,92,.1),...e),We("#d6a8ff",3)),n.add("core","core",E(_.torus(5.2,.9,6,24),0,52,8.4),Ps),n.add("pupil","metal",E(_.cyl(2.6,2.6,.8,16),0,52,9.6,[Math.PI/2,0,0]),"#0c0a10"),n.add("pupil","glow",E(_.torus(2.7,.3,4,16),0,52,10),Ps),n.add("body","metal",E(_.lathe([[.001,0],[14,2],[17,8],[15,14],[10,18],[.001,19]],14),0,26,-6,[0,0,0]),En.metal),n.add("body","paint",E(_.torus(16,2.2,8,28),0,52,-7),En.metalL),n.add("body","paint",E(_.cyl(15,15,4,24),0,52,-10,[Math.PI/2,0,0]),En.metal);for(let t=0;t<12;t++){let i=t/12*ze;n.add("body","glow",E(_.box(.5,3.2,.5),Math.cos(i)*16.4,52+Math.sin(i)*16.4,-4.6,[0,0,i+Math.PI/2]),td.map(s=>s*.7))}for(let t=0;t<6;t++){let i=t/6*ze+Math.PI/2,s=Math.cos(i)*11,r=52+Math.sin(i)*11,o=_.ext([[0,-4.2],[22,-2.2],[30,0],[22,2.2],[0,4.2],[-1.6,0]],2.2,.6,{steps:2}),a=_.ext([[2,-4.6],[22,-2.6],[31,0],[22,-1.6],[2,-3.6]],2.4,.2);n.add("p"+t,"paint",E(o,s,r,13.5+t*.05,[0,0,i]),En.metalL),n.add("p"+t,"glow",E(a,s,r,13.6+t*.05,[0,0,i]),td),n.add("p"+t,"metal",E(_.cyl(1.6,1.6,3.2,10),s,r,13.5,[Math.PI/2,0,0]),En.metal),n.add("p"+t,"crystal",E(_.crystal(1.1,4.4,5,.5,100+t),s+Math.cos(i)*16,r+Math.sin(i)*16,15,[Math.PI/2,0,0]),En.crysL)}n.add("r0","paint",E(_.torus(36,1.8,6,56),0,52,0),En.metal),n.add("r0","glow",E(_.torus(36,.5,4,56),0,52,1.6),td.map(t=>t*.8)),n.add("r1","paint",E(_.torus(29,1.4,6,48),0,52,0,[1.1,0,0]),En.metalL),n.add("r1","glow",E(_.torus(29,.4,4,48),0,52,0,[1.1,0,0]),Ps.map(t=>t*.6)),n.add("r2","paint",E(_.torus(23,1.2,6,40),0,52,0,[0,1.2,0]),En.metalL);for(let t=0;t<8;t++){let i=t/8*ze;n.add("r0","metal",E(_.box(3.2,3.2,4.4,.6),Math.cos(i)*36,52+Math.sin(i)*36,0,[0,0,i]),En.metalL)}n.add("plate0","paint",E(_.torus(40,1.6,6,14,1.2),0,52,-2,[0,0,-.6]),En.metalL),n.add("plate1","paint",E(_.torus(40,1.6,6,14,1.2),0,52,-2,[0,0,Math.PI-.6]),En.metalL);for(let t=0;t<5;t++){let i=t/5*ze;n.add("orbit","crystal",E(_.shard(1.9,9,6,110+t),Math.cos(i)*41,52+Math.sin(i)*41,Math.sin(i*2)*4,[.3,0,i]),En.crysL)}Zt(n,"crown",[[0,68,-3,3,26,0,0,3],[-8,66,-4,2.2,18,-.1,.35,5],[8,66,-4,2.2,18,-.1,-.35,7],[-15,63,-5,1.6,11,0,.7,9],[15,63,-5,1.6,11,0,-.7,11]],En.crys),n.add("crown","metal",E(_.box(30,4,8,1.2),0,68,-4),En.metal);for(let t=0;t<4;t++){let i=-12+t*8,s=(t%2?-1:1)*3;n.add("td"+t,"flesh",st([i,31,s],[i*1.05,24,s],[i*1.1,16,s],1.5,1.1,10,6),En.flesh);for(let r of[27,21])n.add("td"+t,"metal",E(_.torus(1.55,.4,4,10),i*(1+(31-r)/300),r,s,[Math.PI/2,0,0]),En.metalL);n.add("td"+t+"b","flesh",st([i*1.1,16,s],[i*1.15,9,s],[i*1.25,3,s],1.1,.35,10,6),En.flesh),n.add("td"+t+"b","glow",E(_.sph(.9,8,6),i*1.25,2.4,s),Ps)}n.add("cracks1","glow",_.tube([[-6,66,7],[-2,58,9],[-5,50,10],[1,42,9]],.35,12,4),Ps),n.add("cracks1","glow",_.tube([[6,64,7],[3,56,9.5],[7,48,8]],.35,10,4),Ps),n.add("cracks2","glow",_.tube([[-8,54,8],[-1,52,10.5],[9,54,8]],.4,10,4),Ps),n.add("cracks2","glow",_.tube([[2,70,4],[-3,62,8],[3,60,9]],.4,10,4),Ps);for(let t=0;t<4;t++)n.add("spark","glow",E(_.box(.7,.7,.7),-12+t*8,40+t%2*20,9),We("#f0d8ff",5));return n.build()}var Xw=new F;function j2(n,e,t,i,s,r){let o=Rs(e,e.die*2.4+(e.kind==="barrage"?.4:0));n.root.rotation.y=0;let a=e.teleS,l=e.next,c=e.open,h=e.time,u=e.kind,f=0,d=0,g=1,x=0,m=0,p=1;t.state==="tele"&&(l==="volley"||l==="spawn"?f=.4*a:l==="shockwave"?d=-.5*a:l==="beam"?m=a:l==="barrage"?g=1+5*a:l==="dash"?x=-.3*a:l==="lob"&&(p=1+3*a)),u==="volley"?f=.6*(1-e.ap):u==="shockwave"?d=e.ap<.2?-.5+e.ap*7:.9*(1-e.ap):u==="beam"?m=1:u==="spawn"?f=.5:u==="barrage"?g=7:u==="dash"?x=1:u==="lob"&&(p=4*(1-e.ap)+1),n.root.position.set(o[0]+x*10*(e.dir||-1),o[1]-e.die*e.die*24,o[2]),n.body.position.set(0,52+1.2*Math.sin(h*1.1)-6*Math.max(0,d)*.3,0),n.body.rotation.set(.04*Math.sin(h*.7),.08*Math.sin(h*.5),.03*Math.sin(h*.9)+e.die*.3*Math.sin(h*7));let M=Rt(1-c-f-e.die,0,1);e.close=xt(e.close==null?1:e.close,M,8,s);for(let C=0;C<6;C++)n["p"+C].rotation.set(0,0,2.2*e.close+.03*Math.sin(h*2+C));e.r0=(e.r0||0)+s*.25*g,e.r1=(e.r1||0)+s*.6*g,e.r2=(e.r2||0)+s*-.9*g,e.orb=(e.orb||0)+s*.4*p,n.r0.rotation.set(0,0,e.r0),n.r0.position.y=d*10,n.r0.scale.setScalar(1+Math.max(0,d)*.12),n.r1.rotation.set(0,e.r1,0),n.r1.position.y=d*7,n.r2.rotation.set(e.r2,0,0),n.orbit.rotation.set(0,0,e.orb),n.crown.rotation.z=.02*Math.sin(h*1.3);let y=Math.cos(e.aim)*(e.dir||-1),v=Math.sin(e.aim),T=m>0&&u==="beam"?-.9+e.ap*1.5:null,A=T!=null?Math.cos(T)*(e.dir||-1):y,P=T!=null?-Math.sin(T):v;e.px2=xt(e.px2||0,A*2.4,8,s),e.py2=xt(e.py2||0,P*2.4,8,s),n.pupil.position.set(e.px2,e.py2,8),n.pupil.scale.setScalar(1-.35*m+.2*c);for(let C=0;C<4;C++)n["td"+C].rotation.set(.1*Math.sin(h*1.3+C),0,.12*Math.sin(h*1.1+C*1.7)-x*.3*(e.dir||-1)),n["td"+C+"b"].rotation.z=.2*Math.sin(h*1.1+C*1.7-.8);n.core.scale.setScalar(1+.03*Math.sin(h*2.4)+e.die*.15*Math.sin(h*23)),r.fx.pulse(r.byMat.core,.5+.25*Math.sin(h*2.2)+c*1.8+m*1.2+e.die*Math.abs(Math.sin(h*33))*2),Es(n,e,t),Ts(n,e,t,["plate0","plate1"],s),(t.phase||0)>=1&&!t.dying&&(n.r0.rotation.x=.15*Math.sin(h*3.1)),As(n,e,["p0","p1","p2","p3","p4","p5","r0","r1","r2","crown","orbit"],23,60)}var Wp={colossus:{build:q2,pose:Y2},queen:{build:Z2,pose:J2},machine:{build:K2,pose:j2}};var Q2=Object.assign({},Vp,Wp);function e_(n){return(e,t)=>{let i={time:0,yaw:-Math.PI,dir:-1,sT:0};return{st:i,update(s,r,o){s=s||{},r=r||{};let a=Hp(i,s,r,o||0,e);n.pose(e.bones,i,s,r,a,e),e.fx.apply(i.flash,i.frost)}}}}var co={};for(let[n,e]of Object.entries(Q2))co[n]={build:e.build,animator:e_(e)};var nd=["gem","pu_weapon","pu_energy","pu_life","pu_line","pu_bomb"],t_={pu_weapon:"#ffd23f",pu_energy:"#54e36b",pu_life:"#ff5d7a",pu_line:"#67ffd4",pu_bomb:"#a9eeff"},Vi=(n,e,t,i,s,r)=>tn(n,[e,t,i],s,r);function n_(n){let e=[],t=(i,s=1.1)=>_.ext(i,s,.18,{bevelSeg:1});if(n==="pu_energy")e.push(t([[.8,3.6],[-2,-.2],[-.2,-.2],[-1,-3.6],[2.1,.7],[.3,.7],[1.5,3.6]]));else if(n==="pu_life"){let i=[];for(let s=0;s<18;s++){let r=s/18*ze;i.push([.19*16*Math.pow(Math.sin(r),3),.19*(13*Math.cos(r)-5*Math.cos(2*r)-2*Math.cos(3*r)-Math.cos(4*r))+.4])}e.push(t(i))}else if(n==="pu_weapon")for(let i of[-2.2,.4])e.push(t([[-2.6,i],[0,i+2.4],[2.6,i],[2.6,i+1.2],[0,i+3.6],[-2.6,i+1.2]]));else if(n==="pu_line")e.push(_.box(1,5.2,1)),e.push(t([[-1.8,2.2],[1.8,2.2],[0,4.1]]),t([[-1.8,-2.2],[0,-4.1],[1.8,-2.2]]));else if(n==="pu_bomb")for(let i=0;i<3;i++){e.push(Vi(_.box(.8,7.2,.8),0,0,0,[0,0,i*Math.PI/3]));for(let s of[1,-1])for(let r of[2.1]){let o=i*Math.PI/3+Math.PI/2,a=Math.cos(o)*r*s,l=Math.sin(o)*r*s;e.push(Vi(_.box(.5,1.9,.6),a,l,0,[0,0,o+Math.PI/2+.7])),e.push(Vi(_.box(.5,1.9,.6),a,l,0,[0,0,o+Math.PI/2-.7]))}}return e}function Xp(n){let e=new vt(.07142857142857142);if(n==="gem"){e.bone("spin","root",0,0,0).bone("core","spin",0,0,0).bone("orbit","root",0,0,0),e.add("core","core",_.shard(2,10.5,7,11,.1),We("#2a7dff",3)),e.add("core","core",_.shard(1,12.5,5,12,.1),We("#8fd0ff",2.6)),e.add("spin","glass",_.shard(4.6,16,7,5,.12),"#2f6fe0"),e.add("spin","crystal",Vi(_.shard(1.6,4.2,5,9),0,6.6,0),"#4a8cf0"),e.add("spin","crystal",Vi(_.shard(1.4,3.6,5,13),0,-6.6,0),"#2a5ec8");for(let s=0;s<3;s++){let r=s/3*ze;e.add("orbit","crystal",Vi(_.shard(.7,2.6,5,20+s),Math.cos(r)*6.6,(s-1)*2.4,Math.sin(r)*6.6,[.3,r,.4]),"#8fd8ff")}return e.build()}let t=t_[n];e.bone("spin","root",0,0,0).bone("icon","spin",0,0,0);let i=[[.001,0],[4.9,0],[5.3,.4],[5.3,1.3],[4.7,1.8],[3.6,2],[1.4,2.5],[.001,2.6]];for(let s of[1,-1]){let r=_.lathe(i,12);e.add("spin","metal",Vi(r,0,s*5.2,0,s<0?[Math.PI,0,0]:null),"#8a919b"),e.add("spin","metal",Vi(_.torus(5.05,.42,4,16),0,s*5.55,0,[Math.PI/2,0,0]),t),e.add("spin","metal",Vi(_.cyl(1.1,1.3,.8,6),0,s*7.8,0),"#3a3e45")}for(let s=0;s<4;s++){let r=s*Math.PI/2+Math.PI/4;e.add("spin","metal",Vi(_.box(.7,10.6,.7),Math.cos(r)*4.75,0,Math.sin(r)*4.75),"#5a606a")}e.add("spin","glass",_.cyl(4.4,4.4,10.4,14,!0),t);for(let s of n_(n))e.add("icon","core",s,We(t,4.2));return e.build()}function qp(n,e){let t=n.bones,i={a:Math.random()*ze,time:Math.random()*3},s=n.byMat.core;function r(o,a,l){l=Math.min(l,.05),i.time+=l,e==="gem"?(i.a+=l*1.9,t.spin.rotation.set(.18*Math.sin(i.time*1.3),i.a,.12),t.orbit.rotation.set(0,-i.a*1.6,.25),t.core.scale.setScalar(1+.08*Math.sin(i.time*5)),n.fx.pulse(s,.85+.3*(.5+.5*Math.sin(i.time*5)))):(i.a+=l*1.4,t.spin.rotation.set(.1*Math.sin(i.time*1.1),i.a,.08*Math.sin(i.time*.9)),t.icon.rotation.set(0,-i.a,0),n.fx.pulse(s,.8+.35*(.5+.5*Math.sin(i.time*4)))),n.fx.apply(0,0)}return{update:r}}function Yp(){let n=new vt(.1);n.bone("disc","root",0,3.5,0).bone("led","disc",0,6.6,0),n.add("disc","metal",_.lathe([[.001,3.5],[3.3,3.5],[3.7,4],[3.6,4.7],[3,5],[.001,5]],16),"#3a3e45"),n.add("disc","paint",_.lathe([[.001,4.95],[2.9,4.95],[2.6,5.6],[1.6,6.1],[.001,6.2]],16),"#56677a"),n.add("disc","paint",tn(_.torus(3.45,.25,4,20),[0,4.4,0],[Math.PI/2,0,0]),"#c35f28");for(let e=0;e<4;e++){let t=e*Math.PI/2+.4;n.add("disc","metal",tn(_.box(1.1,.5,.6,.12),[Math.cos(t)*3.6,3.8,Math.sin(t)*3.6],[0,-t,0]),"#9aa3ad")}return n.add("disc","metal",tn(_.cyl(.65,.75,.5,8),[0,6.25,0]),"#1c1e22"),n.add("led","core",tn(_.sph(.55,8,6),[0,6.65,0]),We("#ff3b30",5)),n.build()}function Zp(n){let e=n.bones,t={time:0,spin:Math.random()*ze},i=n.byMat.core;function s(r,o,a){a=Math.min(a,.05),t.time+=a,r&&r.vy&&(t.spin+=a*4),e.disc.rotation.set(0,t.spin,0);let c=r&&r.life!=null&&r.life<1.2?9:3,h=t.time*c%1<.35;n.fx.pulse(i,h?1.3:.08),e.led.scale.setScalar(h?1.15:.9),n.fx.apply(0,0)}return{update:s}}var i_=Object.keys(oo),s_=Object.keys(co);function $p(n={}){let e=n.quality||"high",t=e==="low"?.6:e==="ultra"?1.25:1,i=Mp(e,n.renderer||null),s=new Map,r=(l,c)=>{let h=s.get(l);return h||(vp(t),h=c(),s.set(l,h)),h},o=(l,c,h={})=>{let u=new Yt;u.add(l.group);let f=!0;return Object.assign({root:u,update:c.update,dispose(){f&&(f=!1,u.remove(l.group),yp(l))},_inst:l,_anim:c},h)},a={quality:e,hero(){let l=ar(r("hero",Ap),i),c=Rp(l,i),h=o(l,c);return h.muzzle=c.muzzle,h.getMuzzle=(u=new F)=>(h.root.updateWorldMatrix(!0,!1),u.copy(c.muzzle).applyMatrix4(h.root.matrixWorld)),h},fighter(){let l=ar(r("fighter",Cp),i);return o(l,Pp(l))},enemy(l){let c=Bp(l),h=oo[c],u=ar(r("enemy:"+c,h.build),i),f=h.animator(u,l);return o(u,f,{skin:c})},boss(l){let c=co[l.key]||co.warden,h=ar(r("boss:"+(co[l.key]?l.key:"warden"),c.build),i);return o(h,c.animator(h,l))},pickup(l){let c=nd.includes(l)?l:"gem",h=ar(r("pickup:"+c,()=>Xp(c)),i,{shadow:!0});return o(h,qp(h,c))},mine(){let l=ar(r("mine",Yp),i);return o(l,Zp(l))},warm(l,c,h){let u=new Yt;u.name="actor-warm";let f=[a.hero(),a.fighter(),a.mine()];for(let d of i_)f.push(a.enemy({skin:d,type:oo[d].type}));for(let d of s_)f.push(a.boss({key:d}));for(let d of nd)f.push(a.pickup(d));if(f.forEach((d,g)=>{d.root.position.set(g%8*40,-Math.floor(g/8)*40,0),u.add(d.root)}),c&&l&&h){c.add(u);try{l.compile(c,h)}finally{c.remove(u)}}for(let d of f)d.dispose();return f.length},stats(){let l=0;for(let[c,h]of s)l+=h.tris;return{templates:s.size,tris:l}},dispose(){for(let l of s.values())for(let c of l.meshes)c.geometry.dispose();s.clear(),i.dispose()},_mats:i,_cache:s};return a}var r_=window.TData,o_=window.TRender,Jp=new URLSearchParams(location.search),_i=n=>new Pe(n),Li=fa.damp,ho=fa.clamp;function a_(n){let e=Jp.get("q");if(["ultra","high","low"].includes(e))return e;try{let i=localStorage.getItem("shard.quality");if(["ultra","high","low"].includes(i))return i}catch{}if(matchMedia("(pointer: coarse)").matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent))return"low";try{let i=n.getContext(),s=i.getExtension("WEBGL_debug_renderer_info"),r=s?i.getParameter(s.UNMASKED_RENDERER_WEBGL):"";if(/RTX|RX ?[67]\d{3}|RX ?9\d{3}|Radeon Pro W|Arc\(TM\) A7|Apple M\d (Pro|Max|Ultra)/i.test(r))return"ultra"}catch{}return"high"}function l_(n){let e=Math.max(640,Math.min(1100,360*n));return[e,e/n]}function c_(n){let e=n.parentElement,t=document.createElement("canvas");t.id="gl",t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block",e.insertBefore(t,n);let i;try{if(i=new kc({canvas:t,antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1}),!i.capabilities.isWebGL2)throw Error("WebGL2 required")}catch(le){return console.warn("WebGL2 unavailable, using the 2D renderer",le),t.remove(),o_.createRenderer(n)}let s=a_(i);i.setPixelRatio(1),i.outputColorSpace=pn,i.toneMapping=Hr,i.toneMappingExposure=1.05,i.shadowMap.enabled=!0,i.shadowMap.type=Ul,i.info.autoReset=!1;let r=n.getContext("2d"),o=new Ir,a=new Rn(30,16/9,8,14e3),l=new ta(16777215,2105376,.8);o.add(l);let c=new Br(16777215,3);c.castShadow=!0,o.add(c,c.target);let h=new Br(8965375,1.1);o.add(h,h.target);let u=new Yr(i),f=null,d=ip(o,s),g=op(i,o,a,s),x=ap(r),m=$p({quality:s,renderer:i}),p={backend:"Shard Assault 3D",quality:s,frames:0,drawCalls:0,triangles:0,frameMs:0,lights:0,resolution:1},M=null,y=zc[1],v=null,T=null,A=null,P=null,C=null,w=null,b=new Map,I=new Map,L=new Map,U=null,V=null,Y=0,O=0,W=-1,X=0,j=0,oe=0,pe=0,Se=0,Ne=0,ke=!1,De=0,ee=new WeakMap,ne=new F,me=16/9,fe=640,ge=360,Ye=0,ft=0,k=0,B=0,H=1,K=!0,Z=!1,J={x:0,y:0,yaw:0,pitch:.07,fov:30,lead:0,init:!1,zoom:1,panX:0,panY:0},re={z:1,x:0,y:0},ce=640,ie=null,ae=!1,R=0,S=null,N=0;window.__modernGraphics={stats:p,get scene(){return o},get camera(){return a},get renderer(){return i},get hero(){return P},kit:m,fx:d};function $(){let le=window.devicePixelRatio||1;return s==="ultra"?Math.min(le,2):s==="high"?Math.min(le,1.5):Math.min(le,2)}function z(){let le=t.getBoundingClientRect(),de=Math.max(2,le.width),se=Math.max(2,le.height);me=de/se;let Be=$()*H,Qe=Math.round(de*Be),je=Math.round(se*Be);(Qe!==k||je!==B)&&(k=Qe,B=je,i.setSize(k,B,!1),g.setSize(k,B),v&&v.water&&v.water.setSize(k,B)),[fe,ge]=l_(me),a.aspect=me,p.resolution=+Be.toFixed(2)}function G(le){let de=new Ir,se=new Jn(50,32,16),Be=[],Qe=se.attributes.position,je=_i(le.sky.zenith),Oe=_i(le.sky.mid),St=_i(le.sky.horizon),ht=_i(le.hemi.ground);for(let nn=0;nn<Qe.count;nn++){let $t=Qe.getY(nn)/50,D=$t>0?St.clone().lerp(Oe,Math.min(1,$t*3)).lerp(je,Math.max(0,$t*1.5-.5)):St.clone().lerp(ht,Math.min(1,-$t*4));Be.push(D.r,D.g,D.b)}se.setAttribute("color",new $e(Be,3)),de.add(new tt(se,new on({vertexColors:!0,side:gn})));let He=new F(...le.sun.dir).normalize().multiplyScalar(40),Re=new tt(new Jn(6,12,8),new on({color:_i(le.sun.color).multiplyScalar(18)}));Re.position.copy(He),de.add(Re);let ut=new tt(new dn(60,20),new on({color:_i(le.accent).multiplyScalar(1.4),side:jt}));ut.position.set(0,-10,-45),de.add(ut),f&&f.dispose(),f=u.fromScene(de,.03),o.environment=f.texture,o.environmentIntensity=le.enclosed?.45:.6,de.traverse(nn=>{nn.geometry&&nn.geometry.dispose(),nn.material&&nn.material.dispose()})}function be(){for(let le of b.values())o.remove(le.root),le.dispose&&le.dispose();b.clear();for(let le of I.values())o.remove(le.root),le.dispose&&le.dispose();I.clear();for(let le of L.values())o.remove(le.root),le.dispose&&le.dispose();L.clear(),U&&(o.remove(U.root),U.dispose&&U.dispose(),U=null,V=null)}function ve(le){let de=performance.now();v&&(o.remove(v.group),v.dispose()),T&&(o.remove(T.group,T.sky),T.dispose()),A&&(o.remove(A.group),A.dispose()),be(),d.clear(),M=le,y=$f(le),v=tp(le,y,s),o.add(v.group);let se=v.water;g.setWater(se),se&&(se.setSize(k,B),se.setLite(!K),se.onEvent=at),T=np(le,y,v,s),o.add(T.group,T.sky),A=we(le,y,v),o.add(A.group),P||(P=m.hero(),o.add(P.root),C=m.fighter(),o.add(C.root),w=Me(),o.add(w),P.root.traverse(Qe=>{Qe.isMesh&&(Qe.castShadow=!0)}),C.root.traverse(Qe=>{Qe.isMesh&&(Qe.castShadow=!0)})),l.color.set(y.hemi.sky),l.groundColor.set(y.hemi.ground),l.intensity=y.hemi.intensity,c.color.set(y.sun.color),c.intensity=y.sun.intensity,h.color.set(y.accent),h.intensity=y.enclosed?1.3:.9;let Be=s==="ultra"?4096:s==="high"?2048:1024;c.shadow.mapSize.set(Be,Be),c.shadow.map&&(c.shadow.map.dispose(),c.shadow.map=null),c.shadow.bias=-4e-4,c.shadow.normalBias=.6,c.shadow.radius=3,o.fog=new Fo(_i(y.fog.color),y.fog.near,y.fog.far),o.background=_i(y.fog.color),i.toneMappingExposure=y.exposure,g.setGrade(y.grade),g.bloom.strength=y.bloom,g.bloom.threshold=.92,g.bloom.radius=.55,G(y),J.init=!1,O=0,W=-1,p.levelBuildMs=Math.round(performance.now()-de),p.world=le.world;try{m.warm&&m.warm(i,o,a),i.compile(o,a)}catch{}}function we(le,de,se){let Be=new Yt,Qe=[],je=new Kt({color:"#6d7378",metalness:.85,roughness:.32});Qe.push(je);let Oe=null,St=null;if(le.checkpoint){let ht=le.checkpoint,He=se.sample(ht.x+10),Re=new Yt;Re.position.set(ht.x+10,He,-18);let ut=new tt(new On(1.4,2.2,46,10),je);ut.position.y=23,Re.add(ut);let nn=new tt(new On(7,9,5,12),je);nn.position.y=2.5,Re.add(nn);let $t=new tt(new ns(4.5,0),Ii("#ff5a6a",3));$t.position.y=50,Re.add($t);let D=new tt(new Xs(8,.6,6,32),new on({color:_i("#ff5a6a").multiplyScalar(3),toneMapped:!1}));D.position.y=50,D.rotation.x=Math.PI/2,Re.add(D),Re.traverse(Q=>{Q.isMesh&&(Q.castShadow=!0)}),Be.add(Re),Oe={g:Re,lamp:$t,ring:D,on:!1}}if(le.exit){let ht=le.exit,He=new Yt;He.position.set(ht.x+ht.w/2,-(ht.y+ht.h),-6);for(let $t of[-1,1]){let D=new tt(new Vt(6,ht.h+12,16),je);D.position.set($t*(ht.w/2+4),(ht.h+12)/2,0),He.add(D);let Q=new tt(new Vt(1.2,ht.h,1),new on({color:_i(de.accent).multiplyScalar(3),toneMapped:!1}));Q.position.set($t*(ht.w/2+1),ht.h/2+4,8.5),He.add(Q)}let Re=new tt(new Vt(ht.w+20,6,18),je);Re.position.y=ht.h+12,He.add(Re);let ut={uTime:{value:0},uOpen:{value:0},uColor:{value:_i(de.accent)}},nn=new tt(new dn(ht.w+2,ht.h+8),new gt({uniforms:ut,transparent:!0,depthWrite:!1,blending:An,side:jt,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uOpen;uniform vec3 uColor;void main(){vec2 c=vUv-.5;float r=length(c*vec2(1.,.7));float a=atan(c.y,c.x);
          float sw=sin(a*5.+r*30.-uTime*6.)*.5+.5;float lock=step(.5,fract(vUv.y*14.+uTime*.6))*.25;vec3 open=uColor*(sw*.9+.3)*smoothstep(.55,.1,r)*1.8;vec3 shut=vec3(1.,.15,.2)*(lock+.08)*(1.-smoothstep(.45,.5,abs(c.x)));
          gl_FragColor=vec4(mix(shut,open,uOpen),1.);}`}));nn.position.set(0,ht.h/2+4,2),He.add(nn),He.traverse($t=>{$t.isMesh&&$t.material===je&&($t.castShadow=!0)}),Be.add(He),St={g:He,fu:ut}}return{group:Be,beacon:Oe,gate:St,update(ht,He){if(Oe){if(!!ht.checkpoint&&!Oe.on){Oe.on=!0;let ut=_i(de.accent);Oe.lamp.material.emissive.copy(ut),Oe.ring.material.color.copy(ut).multiplyScalar(3),d.ring(le.checkpoint.x+10,-(Oe.g.position.y+50),de.accent,60,.6)}Oe.lamp.rotation.y=He*2,Oe.ring.scale.setScalar(1+Math.sin(He*4)*.12),d.light(Oe.g.position.x,Oe.g.position.y+50,-10,Oe.on?de.accent:"#ff5a6a",.9,90)}St&&(St.fu.uTime.value=He,St.fu.uOpen.value=Li(St.fu.uOpen.value,ht.bossDead?1:0,3,1/60),ht.bossDead&&d.light(St.g.position.x,St.g.position.y+30,10,de.accent,1.6,140))},dispose(){Be.traverse(ht=>{ht.geometry&&ht.geometry.dispose(),ht.material&&ht.material!==je&&ht.material.dispose()}),je.dispose()}}}function Me(){let le=new tt(new Jn(1,32,16),new gt({uniforms:{uTime:{value:0},uA:{value:0}},transparent:!0,depthWrite:!1,blending:An,vertexShader:"varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}",fragmentShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;uniform float uTime,uA;void main(){float f=pow(1.-abs(dot(vN,vV)),2.5);float hex=step(.82,fract((vP.x+vP.y*.58)*6.)+fract(vP.y*6.-uTime));
        gl_FragColor=vec4(vec3(.35,.85,1.)*(f*1.6+hex*.25)*uA,1.);}`}));return le.visible=!1,le}function ye(le,de){for(let se of le)switch(se.type){case"explosion":{let Be=1,Qe=de.boss;if(Qe&&(Qe.dying||!Qe.alive)&&se.x>=Qe.x-20&&se.x<=Qe.x+Qe.w+20)Be=Qe.alive?1.5:2.6;else{let je=de.enemies.find(Oe=>!Oe.alive&&Math.abs(Oe.x+Oe.w/2-se.x)<4&&Math.abs(Oe.y+Oe.h/2-se.y)<4);je&&(je.type==="drifter"||je.type==="hugger"||je.type==="egg")&&(Be=.75)}d.explosion(se.x,se.y,Be,y),v.water&&v.water.splash(se.x,se.y,Be*1.3)&&Fe(se.x,-v.water.surfaceAt(se.x).y,Be*.8);break}case"spark":d.sparks(se.x,se.y,"#ffe0a0",6,140,{life:.6}),d.glowBall(se.x,se.y,"#ffc070",6,.08);break;case"muzzle":{let Be=se.color||"#ffd23f";M.type!=="shmup"&&P&&P.getMuzzle&&P.root.visible&&(P.getMuzzle(ne),se={...se,x:ne.x,y:-ne.y}),d.glowBall(se.x,se.y,Be,9,.06,6,2.2),d.sparks(se.x,se.y,Be,3,120,{life:.4}),d.flashLight(se.x,se.y,Be,2.4,110,.07),Math.random()<.35&&d.puff(se.x,se.y,"#8a8a90",1,4,{life:.5,speed:20,alpha:.25});break}case"pickup":d.sparks(se.x+8,se.y+8,se.color||"#9be6ff",18,150,{grav:-60,life:1.4}),d.ring(se.x+8,se.y+8,se.color||"#9be6ff",22,.35),d.flashLight(se.x+8,se.y+8,se.color||"#9be6ff",2.5,90,.25);break;case"splash":{let Be=v.water,Qe=Be&&Be.surfaceAt(se.x),je=Qe?-Qe.y:se.y;Be&&Be.splash(se.x,je,1.4),Fe(se.x,je,1);break}case"land":d.puff(se.x,se.y,y.top.color,5,6,{life:.7,speed:55,rise:8,alpha:.45,grav:-10});break;case"bubble":d.glow.emit(se.x,-se.y,2,(Math.random()-.5)*10,30,0,.4,.8,.9,.7,1.6,1.4,1.8,40,.5,0,0);break;case"updraft":d.glow.emit(se.x+(Math.random()-.5)*20,-se.y,(Math.random()-.5)*30,0,160,0,.5,.8,1,.6,.6,1.2,.4,0,.5,.02,0);break;case"hurt":X=1,pe=Math.max(pe,.012),d.shakeImpulse(.35),d.sparks(de.player.x+7,de.player.y+15,"#ff8a8a",10,140);break;case"flash":j=1,d.ring(de.player.x+7,de.player.y+15,"#a9eeff",260,.9,{start:4}),d.ring(de.player.x+7,de.player.y+15,"#ffffff",140,.5,{start:2});for(let Be=0;Be<70;Be++){let Qe=Math.random()*6.28,je=80+Math.random()*260;d.glow.emit(de.player.x+7,-(de.player.y+15),(Math.random()-.5)*40,Math.cos(Qe)*je,Math.sin(Qe)*je,(Math.random()-.5)*90,.6,.9,1.2,1,1.2,2.2,.5,-80,1.8,.01,3)}break;case"line":d.shockwall(se.x,ft,ge);break;case"banner":x.setBanner(se.text,se.sub),se.text==="WARNING"&&(N=1.8);break}}function Fe(le,de,se){let Be=Math.random;for(let Qe=0;Qe<Math.round(34*se);Qe++){let je=Be()*Math.PI,Oe=(80+Be()*190)*se;d.glow.emit(le+(Be()-.5)*8,-de,(Be()-.5)*24,Math.cos(je)*Oe*.55,Math.sin(je)*Oe,(Be()-.5)*70,.7,.95,1.1,.95,.55+Be()*.5,1.1+Be()*1.2,.5,-760,.6,.016,0)}for(let Qe=0;Qe<Math.round(10*se);Qe++)d.glow.emit(le+(Be()-.5)*14,-de+2,(Be()-.5)*16,(Be()-.5)*30,40+Be()*70,0,.9,1,1.1,.6,.35,4+Be()*3,9,-200,2,0,0);d.puff(le,de-4,"#dff6f8",Math.round(4*se),9*se,{life:1.1,speed:26,rise:18,alpha:.28,z:4}),d.ring(le,de,"#bff4ff",30*se,.7,{flat:!0,z:0}),d.ring(le,de,"#ffffff",16*se,.4,{flat:!0,z:0})}function at(le,de,se,Be){le==="plip"?(d.sparks(de,se,"#cdf6ff",5,90,{life:.45,grav:-500}),d.ring(de,se,"#bff4ff",10,.45,{flat:!0,z:0})):le==="splash"?Fe(de,se,.7):le==="drip"&&d.ring(de,se,"#bff4ff",9,.6,{flat:!0,z:0}),ie&&ie(le,de,se,Be)}function Je(le,de){let se=le.player,Be=M.cols*rs,Qe=M.rows*rs,je=Math.max(0,Math.min(Math.max(0,Be-fe),le.cam.x-(fe-640)/2)),Oe=Math.max(0,Math.min(Math.max(0,Qe-ge),le.cam.y-(ge-360)/2)),St=je+fe/2,ht=Oe+ge/2,He=M.type==="shmup",Re=le.boss&&le.boss.alive&&le.boss.awake,ut=He?0:ho(se.vx*.12,-26,26)*(se.dead?0:1);J.lead=Li(J.lead,ut,1.6,de),St=ho(St+J.lead,fe/2,Math.max(fe/2,Be-fe/2));let nn=He?-.06:ho(-se.vx/205*.045,-.05,.05)+0,$t=He||Re?.05:.075;J.init||(J.x=St,J.y=ht,J.yaw=-.5,J.pitch=.22,J.fov=22,J.init=!0);let D=Math.max(0,1-O/2.4),Q=D*D*(3-2*D);J.x=Li(J.x,St,8,de),J.y=Li(J.y,ht,8,de),J.yaw=Li(J.yaw,nn,D>0?2.2:1.8,de),J.pitch=Li(J.pitch,$t,2.2,de),J.fov=Li(J.fov,Re?31.5:30,2,de);let he=J.yaw,ue=J.pitch,te=1+Q*-.35;if(N>0&&le.boss){N-=de;let At=Math.sin(Math.min(1,N/1.8)*Math.PI)*.5;St+=(le.boss.x+le.boss.w/2-St)*0,he+=-.08*At*Math.sign(le.boss.x+le.boss.w/2-J.x),ue-=.03*At,te*=1-.08*At}(le.won||le.gameOver)&&(he+=Math.sin(O*.25)*.12,te*=.92);let Ie=J.fov;a.fov=Ie,a.updateProjectionMatrix();let Ve=ge/2/Math.tan(fa.degToRad(Ie/2))*te/J.zoom,Ke=d.shake+Math.min(1.5,le.shake*.12),Ze=(Math.sin(Y*71)+Math.sin(Y*113)*.5)*Ke*2.2,pt=(Math.cos(Y*83)+Math.cos(Y*127)*.5)*Ke*2.2,et=new F(J.x+Ze,-J.y+pt,0);D>0&&(et.x=J.x*(1-Q)+(se.x+7)*Q,et.y=-(J.y*(1-Q)+(se.y+15)*Q)),J.zoom=Li(J.zoom,re.z,9,de),J.panX=Li(J.panX,re.x,9,de),J.panY=Li(J.panY,re.y,9,de);let rt=J.zoom,Tt=ho((rt-1)/.7,0,1)*.85;if(et.x+=(se.x+7-et.x)*Tt+J.panX*fe,et.y+=(-(se.y+15)-et.y)*Tt+J.panY*ge,rt<1){let At=fe/rt/2,Nn=ge/rt/2;et.x=ho(et.x,Math.min(At,Be/2),Math.max(Be-At,Be/2)),et.y=ho(et.y,-Math.max(Qe-Nn,Qe/2),-Math.min(Nn,Qe/2))}a.position.set(et.x+Math.sin(he)*Math.cos(ue)*Ve,et.y+Math.sin(ue)*Ve,Math.cos(he)*Math.cos(ue)*Ve),a.lookAt(et),a.rotateZ(Ke*.004*Math.sin(Y*57)),ce=fe/Math.min(1,rt),Ye=(rt<1?et.x:J.x)-ce/2,ft=J.y-ge/2;let Nt=new F(...y.sun.dir).normalize(),Xt=Math.max(fe,ge)*.75+120,Dt=c.shadow.camera;Dt.left=-Xt,Dt.right=Xt,Dt.top=Xt*.8,Dt.bottom=-Xt*.8,Dt.near=10,Dt.far=2400,Dt.updateProjectionMatrix();let Ut=Xt*2/c.shadow.mapSize.x,ct=Math.round(J.x/Ut)*Ut,Jt=Math.round(-J.y/Ut)*Ut;c.target.position.set(ct,Jt,-60),c.position.set(ct+Nt.x*1e3,Jt+Nt.y*1e3,-60+Nt.z*1e3),h.target.position.set(J.x,-J.y,0),h.position.set(J.x+200,-J.y+260,-400)}function Le(le,de){return le>Ye-de&&le<Ye+ce+de}function ot(le,de){let se=le.player,Be=M.type==="shmup",Qe=se.invuln>0&&!se.dead?Math.floor(Y*18)%3!==0:!0;P.root.visible=!Be&&!se.dead&&Qe,C.root.visible=Be&&!se.dead&&Qe,Be?(C.root.position.set(se.x+se.w/2,-(se.y+se.h/2),0),C.update(se,le,de,Y)):(P.root.position.set(se.x+se.w/2,-(se.y+se.h),0),P.update(se,le,de,Y)),w.visible=!se.dead&&se.invuln>0,w.visible&&(w.position.set(se.x+se.w/2,-(se.y+se.h/2),0),w.scale.setScalar(Be?20:se.morph?13:21),w.material.uniforms.uTime.value=Y,w.material.uniforms.uA.value=Math.min(1,se.invuln*2)*(.6+.4*Math.sin(Y*20))),se.dead&&!ke&&(d.explosion(se.x+se.w/2,se.y+se.h/2,1.6,y),d.ring(se.x+se.w/2,se.y+se.h/2,y.accent,90,.6),d.chunks(se.x+se.w/2,se.y+se.h/2,"#9aa6b0",12,220,1.8,.3),d.shakeImpulse(.6),pe=.02),ke=se.dead,se.dead||(d.light(se.x+se.w/2,-(se.y+10),26,Be?"#9fd8ff":y.accent,.35,90),!Be&&se.onGround&&Math.abs(se.vx)>120&&Math.random()<de*7&&d.puff(se.x+se.w/2-Math.sign(se.vx)*4,se.y+se.h,y.top.color,1,4,{life:.6,speed:20,rise:10,alpha:.35}),se.morph&&se.onGround&&Math.abs(se.vx)>60&&Math.random()<de*25&&d.sparks(se.x+se.w/2-Math.sign(se.vx)*7,se.y+se.h-1,"#ffcb78",2,60,{life:.6}),Be&&Math.random()<de*60&&d.glow.emit(se.x-2,-(se.y+se.h/2),0,-160-Math.random()*80,(Math.random()-.5)*20,0,.6,1,1.8,1,.18,3.2,.6,0,1,0,0)),se.inWater&&Math.random()<de*3&&d.glow.emit(se.x+se.w/2,-(se.y+6),3,(Math.random()-.5)*8,25,0,.4,.8,.9,.6,1.4,1.2,1.6,35,.5,0,0);let je=new Set;for(let Re of le.enemies){if(!Re.alive||!Le(Re.x,120))continue;je.add(Re);let ut=b.get(Re);ut||(ut=m.enemy(Re),ut.root.traverse(D=>{D.isMesh&&(D.castShadow=!0)}),o.add(ut.root),b.set(Re,ut)),ut.root.position.set(Re.x+Re.w/2,-(Re.y+Re.h),0),ut.update(Re,le,de,Y);let nn=Re.hitFlash||0,$t=ee.get(Re)||0;nn>$t+.01&&de>0&&(d.sparks(Re.x+Re.w/2,Re.y+Re.h/2,"#ffd8a0",5,150,{life:.5}),d.glowBall(Re.x+Re.w/2,Re.y+Re.h/2,"#ffe2b0",7,.06,8,1.6)),ee.set(Re,nn),le.freeze>0&&Math.random()<de*3&&d.glow.emit(Re.x+Math.random()*Re.w,-(Re.y+Math.random()*Re.h),6,0,8,0,.5,.8,1,.8,.8,1.6,.4,0,.5,0,0)}for(let[Re,ut]of b)je.has(Re)||(o.remove(ut.root),ut.dispose&&ut.dispose(),b.delete(Re));let Oe=new Set,St=0;for(let Re of le.pickups){if(Re.taken||!Le(Re.x,60))continue;Oe.add(Re);let ut=I.get(Re);ut||(ut=m.pickup(Re.type),o.add(ut.root),I.set(Re,ut)),ut.root.position.set(Re.x+Re.w/2,-(Re.y+Re.h/2),0),ut.update(Re,le,de,Y),St<(s==="low"?1:3)&&Math.abs(Re.x-se.x)<200&&(d.light(Re.x+8,-(Re.y+8),14,Re.type==="gem"?"#4ce4ff":"#ffd23f",.45,60),St++)}for(let[Re,ut]of I)Oe.has(Re)||(o.remove(ut.root),ut.dispose&&ut.dispose(),I.delete(Re));let ht=new Set(le.mines);for(let Re of le.mines){let ut=L.get(Re);ut||(ut=m.mine(),o.add(ut.root),L.set(Re,ut)),ut.root.position.set(Re.x,-Re.y,0),ut.update(Re,le,de,Y),Math.floor(Y*6)%2===0&&d.light(Re.x,-Re.y+3,8,"#ff3030",.25,30)}for(let[Re,ut]of L)ht.has(Re)||(o.remove(ut.root),ut.dispose&&ut.dispose(),L.delete(Re));let He=le.boss;if(He&&He.alive){if((!U||V!==He)&&(U&&(o.remove(U.root),U.dispose&&U.dispose()),U=m.boss(He),V=He,U.root.traverse(Re=>{Re.isMesh&&(Re.castShadow=!0)}),o.add(U.root)),U.root.visible=!0,U.root.position.set(He.x+He.w/2,-(He.y+He.h),0),U.update(He,le,de,Y),He.open&&d.light(He.x+He.w/2,-(He.y+He.h/2),40,"#ffd27a",2.2,180),(He.hitFlash||0)>De+.01&&de>0){let Re=He.x+He.w*(He.open?.5:.15+Math.random()*.7),ut=He.y+He.h*(He.open?.5:.2+Math.random()*.6);d.sparks(Re,ut,He.open?"#fff0a0":"#c8d8ff",He.open?8:5,He.open?220:170,{life:.5})}De=He.hitFlash||0,He.dying&&Math.random()<de*14&&d.sparks(He.x+Math.random()*He.w,He.y+Math.random()*He.h,"#ffc070",6,200)}else U&&(o.remove(U.root),U.dispose&&U.dispose(),U=null,V=null)}function q(le,de){let se=y.ambient,Be=ce*ge/230400,Qe=Ye-60,je=ft,Oe=Math.random,St=ce,ht=(M.windX||0)*(le.windPhase||0);if(se==="dust"){for(let He=0;He<Be*de*30;He++)d.smoke.emit(Qe+Oe()*(St+120),-(je+Oe()*ge),-60+Oe()*90,60+ht*.8+Oe()*40,(Oe()-.5)*14,0,.85,.68,.5,.18,3,1.4,2.4,0,.2,0,0);Math.abs(ht)>60&&Oe()<de*4&&d.smoke.emit(Qe+Oe()*St,-(je+ge*.6+Oe()*ge*.4),-40+Oe()*60,ht*1.6,10,0,.8,.6,.45,.12,2.2,18,46,0,.4,0,0)}else if(se==="motes")for(let He=0;He<Be*de*22;He++)d.glow.emit(Qe+Oe()*(St+120),-(je+Oe()*ge),-120+Oe()*150,(Oe()-.5)*8,6+Oe()*8,0,.25,.9,.75,.8,4,1.2,.4,0,.1,0,0);else if(se==="speed")for(let He=0;He<Be*de*40;He++)d.glow.emit(Ye+St+20,-(je+Oe()*ge),-200+Oe()*200,-900-Oe()*500,0,0,.35,.35,.6,.6,1.4,1.5,1.5,0,.05,.03,0);else if(se==="embers"){for(let He=0;He<Be*de*26;He++)d.glow.emit(Qe+Oe()*(St+120),-(je+ge+10),-150+Oe()*170,(Oe()-.5)*30,40+Oe()*60,0,1.8,.6,.15,1,3.5,1.1,.3,8,.3,.01,0);Oe()<de*8&&d.smoke.emit(Qe+Oe()*St,-(je+ge),-200+Oe()*80,10,30,0,.25,.22,.2,.4,6,40,120,4,.2,0,0)}else if(se==="spores")for(let He=0;He<Be*de*16;He++){let Re=Oe()<.4;d.glow.emit(Qe+Oe()*(St+120),-(je+Oe()*ge),-150+Oe()*180,(Oe()-.5)*14,(Oe()-.5)*14,0,Re?.7:.9,Re?1.6:.5,Re?.4:1.5,.9,5,1.6,.3,0,.1,0,0)}}function Ee(){if(v.crateIndex.size){for(let le of[...v.crateIndex.keys()])if(M.tiles[le]!==6){let de=v.removeCrate(le);de&&(d.chunks(de.x,-de.y,M.type==="shmup"?"#3a3f52":"#8a6a44",14,200,2.6,.2),d.sparks(de.x,-de.y,y.accent,14,200))}}}function Ue(le,de){let se=performance.now();ae=!1,z(),(!M||le.level!==M)&&ve(le.level),de=Math.min(.05,Math.max(0,de)),Y+=de,O+=de,le.frame!==W&&(ye(le.events,le),W=le.frame,le.events.length=0),Ee(),Je(le,de),ot(le,de);let Be=null;if(M.type!=="shmup"&&le.player.beamActive&&P.getMuzzle&&(P.getMuzzle(ne),Be={x:ne.x,y:-ne.y}),d.drawShots(le,Ye,ce),d.drawBeam(le.player,Y,y,Be),d.moveWalls(le.floats),de>0){q(le,de);for(let je of v.falls)je.x>Ye-60&&je.x<Ye+ce+60&&(Math.random()<de*14&&d.puff(je.x+(Math.random()-.5)*20,-(je.bot+40),"#e8f6ff",1,10,{life:1.6,speed:30,rise:26,alpha:.3,z:-40}),Math.random()<de*30&&d.glow.emit(je.x+(Math.random()-.5)*20,je.bot+40,-40,(Math.random()-.5)*60,40+Math.random()*60,(Math.random()-.5)*30,.5,.7,.8,.7,.7,1.2,.5,-300,.6,.01,0))}A.update(le,Y),v.update(Y,de,le),T.update(Y,a),v.water&&(a.updateMatrixWorld(),v.water.update(Y,de,le,a,Ye,ce));for(let je of v.fg){let Oe=Math.abs(je.position.x-(le.player.x+7));je.visible=Oe>60||je.position.x<Ye-200||je.position.x>Ye+fe+200}d.update(de,Y,M,{x:J.x},(je,Oe)=>{let St=Math.floor(je/rs),ht=Math.floor(Oe/rs);return St<0||St>=M.cols?!1:ht>=M.rows?!0:ht<0?!1:M.tiles[ht*M.cols+St]===1}),X=Math.max(0,X-de*2.2),j=Math.max(0,j-de*2.5),pe=Math.max(0,pe-de*.04),oe=Li(oe,le.freeze>0?1:0,4,de||.016);let Qe=g.u;Qe.uTime.value=Y,Qe.uHurt.value=X*.8,Qe.uFlash.value=j*.55,Qe.uFrost.value=oe,Qe.uCA.value=pe+d.shake*.004,Qe.uScan.value=Z?1:0,Qe.uFade.value=0,qe(),r.clearRect(0,0,960,540),x.draw(le,me,_e,Y,de,t.clientHeight),p.frames++,p.frameMs=p.frameMs*.94+(performance.now()-se)*.06,Bt(de)}function qe(){i.info.reset(),K?g.render():i.render(o,a),p.drawCalls=i.info.render.calls,p.triangles=i.info.render.triangles,p.lights=d.stats().lights}let Te=new F;function _e(le,de){return Te.set(le,-de,0).project(a),Te.z>1?null:{x:(Te.x+1)/2,y:(1-Te.y)/2}}let Xe=0,nt=0;function Bt(le){if(Jp.has("fixed")||le<=0)return;let de=le*1e3;de>19.5?(Xe+=le,nt=0):de<15.5&&(nt+=le,Xe=Math.max(0,Xe-le*.5)),Xe>.8&&H>.55?(H=Math.max(.55,H-.1),Xe=0):nt>4&&H<1&&(H=Math.min(1,H+.05),nt=0)}let yt=null;function Mi(le){if(z(),le=Math.min(.05,Math.max(0,le)),Y+=le,R+=le,!ae||!yt||M!==yt){yt||(yt=r_.buildLevel(0,0)),M!==yt&&ve(yt);let Re=null;for(let $t=12;$t<Math.min(yt.cols-10,90);$t++){let D=v.ground[$t];D>-yt.rows*rs&&(!Re||D>Re.gy+15)&&(Re={tx:$t,gy:D})}let ut=(Re?Re.tx:20)*rs+10,nn=Re?Re.gy:v.ground[20];S={x:ut-7,y:-nn-30,w:14,h:30,vx:0,vy:0,facing:-1,onGround:!0,crouch:!1,morph:!1,weapon:"beam",weapons:{spread:3,beam:3,bounce:3},beamActive:!1,beamAngle:0,cooldown:0,invuln:0,dead:!1,energy:100,maxEnergy:100,lives:3,inWater:!1},ae=!0,R=0}let de=S,se={player:de,level:yt,freeze:0,enemies:[],pickups:[],pshots:[],eshots:[],mines:[],floats:[],cam:{x:de.x-320,y:0},time:999,shake:0,boss:null,windPhase:Math.sin(R*.3),frame:-1};P.root.visible=!0,C.root.visible=!1,w.visible=!1,P.root.position.set(de.x+7,-(de.y+30),0),P.update(de,se,le,Y);let Be=.34+Math.sin(R*.11)*.1,Qe=-.05+Math.sin(R*.07)*.02,je=190+Math.sin(R*.09)*14,Oe=new F(de.x+7-62,-(de.y-6),0);a.fov=34,a.aspect=me,a.updateProjectionMatrix(),a.position.set(Oe.x+Math.sin(Be)*je,Oe.y+Math.sin(Qe)*je+6,Math.cos(Be)*je),a.lookAt(Oe),Ye=Oe.x-fe/2,ft=-Oe.y-ge/2,J.x=Oe.x,J.y=-Oe.y;let St=new F(...y.sun.dir).normalize(),ht=c.shadow.camera;ht.left=-300,ht.right=300,ht.top=220,ht.bottom=-220,ht.near=10,ht.far=2400,ht.updateProjectionMatrix(),c.target.position.set(Oe.x,Oe.y,-60),c.position.set(Oe.x+St.x*1e3,Oe.y+St.y*1e3,-60+St.z*1e3),le>0&&q(se,le),d.light(de.x+7,-(de.y+10),20,y.accent,.5,80),v.update(Y,le,se),T.update(Y,a),d.update(le,Y,M,{x:Oe.x},()=>!1);let He=g.u;He.uTime.value=Y,He.uHurt.value=0,He.uFlash.value=0,He.uFrost.value=0,He.uCA.value=0,He.uFade.value=Math.max(0,1-R*1.2),qe(),r.clearRect(0,0,960,540)}function hi(le){s=le>=6?"ultra":le>=3?"high":"low",p.quality=s,H=1,k=0,z();let de=s==="ultra"?4096:s==="high"?2048:1024;c.shadow.mapSize.x!==de&&(c.shadow.mapSize.set(de,de),c.shadow.map&&(c.shadow.map.dispose(),c.shadow.map=null))}function ka(le){K=le,le||(H=.7,k=0),le?a.layers.disable(1):a.layers.enable(1),v&&v.water&&v.water.setLite(!le)}function Gi(le,de,se){re.z=le,re.x=de||0,re.y=se||0}return{setLevel:ve,render:Ue,renderTitle:Mi,setCRT(le){Z=le},setFX:ka,setResolution:hi,setZoom:Gi,get zoom(){return J.zoom},set onWater(le){ie=le},get buffer(){return t},get quality(){return s},particles:[]}}window.TRender={createRenderer:c_};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
