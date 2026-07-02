(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const vc="181",af=0,nh=1,of=2,Dd=1,Id=2,Si=3,Zi=0,gn=1,pt=2,ci=0,Zs=1,Kn=2,ih=3,sh=4,lf=5,ls=100,cf=101,hf=102,df=103,uf=104,ff=200,pf=201,mf=202,xf=203,xl=204,gl=205,gf=206,vf=207,_f=208,Mf=209,yf=210,Sf=211,bf=212,wf=213,Tf=214,vl=0,_l=1,Ml=2,er=3,yl=4,Sl=5,bl=6,wl=7,_c=0,Ef=1,Af=2,qi=0,Ud=1,Fd=2,Nd=3,Mc=4,zd=5,Od=6,Bd=7,kd=300,tr=301,nr=302,Tl=303,El=304,uo=306,_n=1e3,Ci=1001,Al=1002,Ln=1003,Cf=1004,da=1005,Vn=1006,To=1007,hs=1008,fi=1009,Vd=1010,Gd=1011,Wr=1012,yc=1013,vs=1014,ai=1015,hi=1016,Sc=1017,bc=1018,Xr=1020,Hd=35902,Wd=35899,Xd=1021,qd=1022,Jn=1023,qr=1026,Yr=1027,wc=1028,Tc=1029,Ec=1030,Ac=1031,Cc=1033,Xa=33776,qa=33777,Ya=33778,$a=33779,Cl=35840,Rl=35841,Pl=35842,Ll=35843,Dl=36196,Il=37492,Ul=37496,Fl=37808,Nl=37809,zl=37810,Ol=37811,Bl=37812,kl=37813,Vl=37814,Gl=37815,Hl=37816,Wl=37817,Xl=37818,ql=37819,Yl=37820,$l=37821,Zl=36492,Kl=36494,Jl=36495,jl=36283,Ql=36284,ec=36285,tc=36286,Rf=3200,Pf=3201,Rc=0,Lf=1,Gi="",Et="srgb",ir="srgb-linear",ja="linear",Ot="srgb",As=7680,rh=519,Df=512,If=513,Uf=514,Yd=515,Ff=516,Nf=517,zf=518,Of=519,nc=35044,ah="300 es",oi=2e3,Qa=2001;function $d(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function eo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Bf(){const n=eo("canvas");return n.style.display="block",n}const oh={};function to(...n){const e="THREE."+n.shift();console.log(e,...n)}function dt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function Kt(...n){const e="THREE."+n.shift();console.error(e,...n)}function $r(...n){const e=n.join(" ");e in oh||(oh[e]=!0,dt(...n))}function kf(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class cr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let lh=1234567;const Ir=Math.PI/180,Zr=180/Math.PI;function di(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(pn[n&255]+pn[n>>8&255]+pn[n>>16&255]+pn[n>>24&255]+"-"+pn[e&255]+pn[e>>8&255]+"-"+pn[e>>16&15|64]+pn[e>>24&255]+"-"+pn[t&63|128]+pn[t>>8&255]+"-"+pn[t>>16&255]+pn[t>>24&255]+pn[i&255]+pn[i>>8&255]+pn[i>>16&255]+pn[i>>24&255]).toLowerCase()}function _t(n,e,t){return Math.max(e,Math.min(t,n))}function Pc(n,e){return(n%e+e)%e}function Vf(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Gf(n,e,t){return n!==e?(t-n)/(e-n):0}function Ur(n,e,t){return(1-t)*n+t*e}function Hf(n,e,t,i){return Ur(n,e,1-Math.exp(-t*i))}function Wf(n,e=1){return e-Math.abs(Pc(n,e*2)-e)}function Xf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function qf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Yf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function $f(n,e){return n+Math.random()*(e-n)}function Zf(n){return n*(.5-Math.random())}function Kf(n){n!==void 0&&(lh=n);let e=lh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Jf(n){return n*Ir}function jf(n){return n*Zr}function Qf(n){return(n&n-1)===0&&n!==0}function e0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function t0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function n0(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),u=a((e+i)/2),f=r((e-i)/2),m=a((e-i)/2),p=r((i-e)/2),x=a((i-e)/2);switch(s){case"XYX":n.set(o*u,l*f,l*m,o*c);break;case"YZY":n.set(l*m,o*u,l*f,o*c);break;case"ZXZ":n.set(l*f,l*m,o*u,o*c);break;case"XZX":n.set(o*u,l*x,l*p,o*c);break;case"YXY":n.set(l*p,o*u,l*x,o*c);break;case"ZYZ":n.set(l*x,l*p,o*u,o*c);break;default:dt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Bt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const _e={DEG2RAD:Ir,RAD2DEG:Zr,generateUUID:di,clamp:_t,euclideanModulo:Pc,mapLinear:Vf,inverseLerp:Gf,lerp:Ur,damp:Hf,pingpong:Wf,smoothstep:Xf,smootherstep:qf,randInt:Yf,randFloat:$f,randFloatSpread:Zf,seededRandom:Kf,degToRad:Jf,radToDeg:jf,isPowerOfTwo:Qf,ceilPowerOfTwo:e0,floorPowerOfTwo:t0,setQuaternionFromProperEuler:n0,normalize:Bt,denormalize:Zn};class Ee{constructor(e=0,t=0){Ee.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(_t(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(_t(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3],m=r[a+0],p=r[a+1],x=r[a+2],M=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o>=1){e[t+0]=m,e[t+1]=p,e[t+2]=x,e[t+3]=M;return}if(f!==M||l!==m||c!==p||u!==x){let g=l*m+c*p+u*x+f*M;g<0&&(m=-m,p=-p,x=-x,M=-M,g=-g);let d=1-o;if(g<.9995){const _=Math.acos(g),v=Math.sin(_);d=Math.sin(d*_)/v,o=Math.sin(o*_)/v,l=l*d+m*o,c=c*d+p*o,u=u*d+x*o,f=f*d+M*o}else{l=l*d+m*o,c=c*d+p*o,u=u*d+x*o,f=f*d+M*o;const _=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=_,c*=_,u*=_,f*=_}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=r[a],m=r[a+1],p=r[a+2],x=r[a+3];return e[t]=o*x+u*f+l*p-c*m,e[t+1]=l*x+u*m+c*f-o*p,e[t+2]=c*x+u*p+o*m-l*f,e[t+3]=u*x-o*f-l*m-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),f=o(r/2),m=l(i/2),p=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=m*u*f+c*p*x,this._y=c*p*f-m*u*x,this._z=c*u*x+m*p*f,this._w=c*u*f-m*p*x;break;case"YXZ":this._x=m*u*f+c*p*x,this._y=c*p*f-m*u*x,this._z=c*u*x-m*p*f,this._w=c*u*f+m*p*x;break;case"ZXY":this._x=m*u*f-c*p*x,this._y=c*p*f+m*u*x,this._z=c*u*x+m*p*f,this._w=c*u*f-m*p*x;break;case"ZYX":this._x=m*u*f-c*p*x,this._y=c*p*f+m*u*x,this._z=c*u*x-m*p*f,this._w=c*u*f+m*p*x;break;case"YZX":this._x=m*u*f+c*p*x,this._y=c*p*f+m*u*x,this._z=c*u*x-m*p*f,this._w=c*u*f-m*p*x;break;case"XZY":this._x=m*u*f-c*p*x,this._y=c*p*f-m*u*x,this._z=c*u*x+m*p*f,this._w=c*u*f+m*p*x;break;default:dt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],m=i+o+f;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>f){const p=2*Math.sqrt(1+i-o-f);this._w=(u-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>f){const p=2*Math.sqrt(1+o-i-f);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(_t(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ch.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ch.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*u,this.y=i+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(_t(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Eo.copy(this).projectOnVector(e),this.sub(Eo)}reflect(e){return this.sub(Eo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(_t(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Eo=new P,ch=new Pi;class gt{constructor(e,t,i,s,r,a,o,l,c){gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],m=i[2],p=i[5],x=i[8],M=s[0],g=s[3],d=s[6],_=s[1],v=s[4],y=s[7],E=s[2],T=s[5],C=s[8];return r[0]=a*M+o*_+l*E,r[3]=a*g+o*v+l*T,r[6]=a*d+o*y+l*C,r[1]=c*M+u*_+f*E,r[4]=c*g+u*v+f*T,r[7]=c*d+u*y+f*C,r[2]=m*M+p*_+x*E,r[5]=m*g+p*v+x*T,r[8]=m*d+p*y+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,m=o*l-u*r,p=c*r-a*l,x=t*f+i*m+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=f*M,e[1]=(s*c-u*i)*M,e[2]=(o*i-s*a)*M,e[3]=m*M,e[4]=(u*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=p*M,e[7]=(i*l-c*t)*M,e[8]=(a*t-i*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ao.makeScale(e,t)),this}rotate(e){return this.premultiply(Ao.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ao.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ao=new gt,hh=new gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dh=new gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function i0(){const n={enabled:!0,workingColorSpace:ir,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ot&&(s.r=Ri(s.r),s.g=Ri(s.g),s.b=Ri(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ot&&(s.r=Ks(s.r),s.g=Ks(s.g),s.b=Ks(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gi?ja:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return $r("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return $r("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ir]:{primaries:e,whitePoint:i,transfer:ja,toXYZ:hh,fromXYZ:dh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:i,transfer:Ot,toXYZ:hh,fromXYZ:dh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),n}const Ct=i0();function Ri(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ks(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Cs;class s0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Cs===void 0&&(Cs=eo("canvas")),Cs.width=e.width,Cs.height=e.height;const s=Cs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Cs}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=eo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ri(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ri(t[i]/255)*255):t[i]=Ri(t[i]);return{data:t,width:e.width,height:e.height}}else return dt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let r0=0;class Lc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:r0++}),this.uuid=di(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Co(s[a].image)):r.push(Co(s[a]))}else r=Co(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Co(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?s0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(dt("Texture: Unable to serialize Texture."),{})}let a0=0;const Ro=new P;class vn extends cr{constructor(e=vn.DEFAULT_IMAGE,t=vn.DEFAULT_MAPPING,i=Ci,s=Ci,r=Vn,a=hs,o=Jn,l=fi,c=vn.DEFAULT_ANISOTROPY,u=Gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=di(),this.name="",this.source=new Lc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ro).x}get height(){return this.source.getSize(Ro).y}get depth(){return this.source.getSize(Ro).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){dt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){dt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==kd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _n:e.x=e.x-Math.floor(e.x);break;case Ci:e.x=e.x<0?0:1;break;case Al:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _n:e.y=e.y-Math.floor(e.y);break;case Ci:e.y=e.y<0?0:1;break;case Al:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=kd;vn.DEFAULT_ANISOTROPY=1;class kt{constructor(e=0,t=0,i=0,s=1){kt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],f=l[8],m=l[1],p=l[5],x=l[9],M=l[2],g=l[6],d=l[10];if(Math.abs(u-m)<.01&&Math.abs(f-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(u+m)<.1&&Math.abs(f+M)<.1&&Math.abs(x+g)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,y=(p+1)/2,E=(d+1)/2,T=(u+m)/4,C=(f+M)/4,R=(x+g)/4;return v>y&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=C/i):y>E?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=R/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=C/r,s=R/r),this.set(i,s,r,t),this}let _=Math.sqrt((g-x)*(g-x)+(f-M)*(f-M)+(m-u)*(m-u));return Math.abs(_)<.001&&(_=1),this.x=(g-x)/_,this.y=(f-M)/_,this.z=(m-u)/_,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this.w=_t(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this.w=_t(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(_t(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class o0 extends cr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new kt(0,0,e,t),this.scissorTest=!1,this.viewport=new kt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new vn(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Vn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Lc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qn extends o0{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Zd extends vn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class l0 extends vn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ws{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Wn):Wn.fromBufferAttribute(r,a),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ua.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ua.copy(i.boundingBox)),ua.applyMatrix4(e.matrixWorld),this.union(ua)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gr),fa.subVectors(this.max,gr),Rs.subVectors(e.a,gr),Ps.subVectors(e.b,gr),Ls.subVectors(e.c,gr),Di.subVectors(Ps,Rs),Ii.subVectors(Ls,Ps),ji.subVectors(Rs,Ls);let t=[0,-Di.z,Di.y,0,-Ii.z,Ii.y,0,-ji.z,ji.y,Di.z,0,-Di.x,Ii.z,0,-Ii.x,ji.z,0,-ji.x,-Di.y,Di.x,0,-Ii.y,Ii.x,0,-ji.y,ji.x,0];return!Po(t,Rs,Ps,Ls,fa)||(t=[1,0,0,0,1,0,0,0,1],!Po(t,Rs,Ps,Ls,fa))?!1:(pa.crossVectors(Di,Ii),t=[pa.x,pa.y,pa.z],Po(t,Rs,Ps,Ls,fa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const xi=[new P,new P,new P,new P,new P,new P,new P,new P],Wn=new P,ua=new ws,Rs=new P,Ps=new P,Ls=new P,Di=new P,Ii=new P,ji=new P,gr=new P,fa=new P,pa=new P,Qi=new P;function Po(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Qi.fromArray(n,r);const o=s.x*Math.abs(Qi.x)+s.y*Math.abs(Qi.y)+s.z*Math.abs(Qi.z),l=e.dot(Qi),c=t.dot(Qi),u=i.dot(Qi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const c0=new ws,vr=new P,Lo=new P;class hr{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):c0.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;vr.subVectors(e,this.center);const t=vr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(vr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Lo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(vr.copy(e.center).add(Lo)),this.expandByPoint(vr.copy(e.center).sub(Lo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const gi=new P,Do=new P,ma=new P,Ui=new P,Io=new P,xa=new P,Uo=new P;class Dc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gi.copy(this.origin).addScaledVector(this.direction,t),gi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Do.copy(e).add(t).multiplyScalar(.5),ma.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(Do);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ma),o=Ui.dot(this.direction),l=-Ui.dot(ma),c=Ui.lengthSq(),u=Math.abs(1-a*a);let f,m,p,x;if(u>0)if(f=a*l-o,m=a*o-l,x=r*u,f>=0)if(m>=-x)if(m<=x){const M=1/u;f*=M,m*=M,p=f*(f+a*m+2*o)+m*(a*f+m+2*l)+c}else m=r,f=Math.max(0,-(a*m+o)),p=-f*f+m*(m+2*l)+c;else m=-r,f=Math.max(0,-(a*m+o)),p=-f*f+m*(m+2*l)+c;else m<=-x?(f=Math.max(0,-(-a*r+o)),m=f>0?-r:Math.min(Math.max(-r,-l),r),p=-f*f+m*(m+2*l)+c):m<=x?(f=0,m=Math.min(Math.max(-r,-l),r),p=m*(m+2*l)+c):(f=Math.max(0,-(a*r+o)),m=f>0?r:Math.min(Math.max(-r,-l),r),p=-f*f+m*(m+2*l)+c);else m=a>0?-r:r,f=Math.max(0,-(a*m+o)),p=-f*f+m*(m+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Do).addScaledVector(ma,m),p}intersectSphere(e,t){gi.subVectors(e.center,this.origin);const i=gi.dot(this.direction),s=gi.dot(gi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,m=this.origin;return c>=0?(i=(e.min.x-m.x)*c,s=(e.max.x-m.x)*c):(i=(e.max.x-m.x)*c,s=(e.min.x-m.x)*c),u>=0?(r=(e.min.y-m.y)*u,a=(e.max.y-m.y)*u):(r=(e.max.y-m.y)*u,a=(e.min.y-m.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-m.z)*f,l=(e.max.z-m.z)*f):(o=(e.max.z-m.z)*f,l=(e.min.z-m.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,gi)!==null}intersectTriangle(e,t,i,s,r){Io.subVectors(t,e),xa.subVectors(i,e),Uo.crossVectors(Io,xa);let a=this.direction.dot(Uo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ui.subVectors(this.origin,e);const l=o*this.direction.dot(xa.crossVectors(Ui,xa));if(l<0)return null;const c=o*this.direction.dot(Io.cross(Ui));if(c<0||l+c>a)return null;const u=-o*Ui.dot(Uo);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tt{constructor(e,t,i,s,r,a,o,l,c,u,f,m,p,x,M,g){Tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,f,m,p,x,M,g)}set(e,t,i,s,r,a,o,l,c,u,f,m,p,x,M,g){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=m,d[3]=p,d[7]=x,d[11]=M,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Tt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Ds.setFromMatrixColumn(e,0).length(),r=1/Ds.setFromMatrixColumn(e,1).length(),a=1/Ds.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const m=a*u,p=a*f,x=o*u,M=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=p+x*c,t[5]=m-M*c,t[9]=-o*l,t[2]=M-m*c,t[6]=x+p*c,t[10]=a*l}else if(e.order==="YXZ"){const m=l*u,p=l*f,x=c*u,M=c*f;t[0]=m+M*o,t[4]=x*o-p,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=p*o-x,t[6]=M+m*o,t[10]=a*l}else if(e.order==="ZXY"){const m=l*u,p=l*f,x=c*u,M=c*f;t[0]=m-M*o,t[4]=-a*f,t[8]=x+p*o,t[1]=p+x*o,t[5]=a*u,t[9]=M-m*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const m=a*u,p=a*f,x=o*u,M=o*f;t[0]=l*u,t[4]=x*c-p,t[8]=m*c+M,t[1]=l*f,t[5]=M*c+m,t[9]=p*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const m=a*l,p=a*c,x=o*l,M=o*c;t[0]=l*u,t[4]=M-m*f,t[8]=x*f+p,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*f+x,t[10]=m-M*f}else if(e.order==="XZY"){const m=a*l,p=a*c,x=o*l,M=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=m*f+M,t[5]=a*u,t[9]=p*f-x,t[2]=x*f-p,t[6]=o*u,t[10]=M*f+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(h0,e,d0)}lookAt(e,t,i){const s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),Fi.crossVectors(i,En),Fi.lengthSq()===0&&(Math.abs(i.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Fi.crossVectors(i,En)),Fi.normalize(),ga.crossVectors(En,Fi),s[0]=Fi.x,s[4]=ga.x,s[8]=En.x,s[1]=Fi.y,s[5]=ga.y,s[9]=En.y,s[2]=Fi.z,s[6]=ga.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],m=i[9],p=i[13],x=i[2],M=i[6],g=i[10],d=i[14],_=i[3],v=i[7],y=i[11],E=i[15],T=s[0],C=s[4],R=s[8],w=s[12],S=s[1],L=s[5],F=s[9],H=s[13],Q=s[2],te=s[6],q=s[10],Z=s[14],ne=s[3],de=s[7],pe=s[11],Ve=s[15];return r[0]=a*T+o*S+l*Q+c*ne,r[4]=a*C+o*L+l*te+c*de,r[8]=a*R+o*F+l*q+c*pe,r[12]=a*w+o*H+l*Z+c*Ve,r[1]=u*T+f*S+m*Q+p*ne,r[5]=u*C+f*L+m*te+p*de,r[9]=u*R+f*F+m*q+p*pe,r[13]=u*w+f*H+m*Z+p*Ve,r[2]=x*T+M*S+g*Q+d*ne,r[6]=x*C+M*L+g*te+d*de,r[10]=x*R+M*F+g*q+d*pe,r[14]=x*w+M*H+g*Z+d*Ve,r[3]=_*T+v*S+y*Q+E*ne,r[7]=_*C+v*L+y*te+E*de,r[11]=_*R+v*F+y*q+E*pe,r[15]=_*w+v*H+y*Z+E*Ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],m=e[10],p=e[14],x=e[3],M=e[7],g=e[11],d=e[15];return x*(+r*l*f-s*c*f-r*o*m+i*c*m+s*o*p-i*l*p)+M*(+t*l*p-t*c*m+r*a*m-s*a*p+s*c*u-r*l*u)+g*(+t*c*f-t*o*p-r*a*f+i*a*p+r*o*u-i*c*u)+d*(-s*o*u-t*l*f+t*o*m+s*a*f-i*a*m+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],m=e[10],p=e[11],x=e[12],M=e[13],g=e[14],d=e[15],_=f*g*c-M*m*c+M*l*p-o*g*p-f*l*d+o*m*d,v=x*m*c-u*g*c-x*l*p+a*g*p+u*l*d-a*m*d,y=u*M*c-x*f*c+x*o*p-a*M*p-u*o*d+a*f*d,E=x*f*l-u*M*l-x*o*m+a*M*m+u*o*g-a*f*g,T=t*_+i*v+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/T;return e[0]=_*C,e[1]=(M*m*r-f*g*r-M*s*p+i*g*p+f*s*d-i*m*d)*C,e[2]=(o*g*r-M*l*r+M*s*c-i*g*c-o*s*d+i*l*d)*C,e[3]=(f*l*r-o*m*r-f*s*c+i*m*c+o*s*p-i*l*p)*C,e[4]=v*C,e[5]=(u*g*r-x*m*r+x*s*p-t*g*p-u*s*d+t*m*d)*C,e[6]=(x*l*r-a*g*r-x*s*c+t*g*c+a*s*d-t*l*d)*C,e[7]=(a*m*r-u*l*r+u*s*c-t*m*c-a*s*p+t*l*p)*C,e[8]=y*C,e[9]=(x*f*r-u*M*r-x*i*p+t*M*p+u*i*d-t*f*d)*C,e[10]=(a*M*r-x*o*r+x*i*c-t*M*c-a*i*d+t*o*d)*C,e[11]=(u*o*r-a*f*r-u*i*c+t*f*c+a*i*p-t*o*p)*C,e[12]=E*C,e[13]=(u*M*s-x*f*s+x*i*m-t*M*m-u*i*g+t*f*g)*C,e[14]=(x*o*s-a*M*s-x*i*l+t*M*l+a*i*g-t*o*g)*C,e[15]=(a*f*s-u*o*s+u*i*l-t*f*l-a*i*m+t*o*m)*C,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,m=r*c,p=r*u,x=r*f,M=a*u,g=a*f,d=o*f,_=l*c,v=l*u,y=l*f,E=i.x,T=i.y,C=i.z;return s[0]=(1-(M+d))*E,s[1]=(p+y)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(m+d))*T,s[6]=(g+_)*T,s[7]=0,s[8]=(x+v)*C,s[9]=(g-_)*C,s[10]=(1-(m+M))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=Ds.set(s[0],s[1],s[2]).length();const a=Ds.set(s[4],s[5],s[6]).length(),o=Ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Xn.copy(this);const c=1/r,u=1/a,f=1/o;return Xn.elements[0]*=c,Xn.elements[1]*=c,Xn.elements[2]*=c,Xn.elements[4]*=u,Xn.elements[5]*=u,Xn.elements[6]*=u,Xn.elements[8]*=f,Xn.elements[9]*=f,Xn.elements[10]*=f,t.setFromRotationMatrix(Xn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=oi,l=!1){const c=this.elements,u=2*r/(t-e),f=2*r/(i-s),m=(t+e)/(t-e),p=(i+s)/(i-s);let x,M;if(l)x=r/(a-r),M=a*r/(a-r);else if(o===oi)x=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===Qa)x=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=f,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=oi,l=!1){const c=this.elements,u=2/(t-e),f=2/(i-s),m=-(t+e)/(t-e),p=-(i+s)/(i-s);let x,M;if(l)x=1/(a-r),M=a/(a-r);else if(o===oi)x=-2/(a-r),M=-(a+r)/(a-r);else if(o===Qa)x=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=f,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=x,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ds=new P,Xn=new Tt,h0=new P(0,0,0),d0=new P(1,1,1),Fi=new P,ga=new P,En=new P,uh=new Tt,fh=new Pi;class ei{constructor(e=0,t=0,i=0,s=ei.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(_t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-_t(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(_t(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-_t(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(_t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-_t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:dt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return uh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(uh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fh.setFromEuler(this),this.setFromQuaternion(fh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ei.DEFAULT_ORDER="XYZ";class Ic{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let u0=0;const ph=new P,Is=new Pi,vi=new Tt,va=new P,_r=new P,f0=new P,p0=new Pi,mh=new P(1,0,0),xh=new P(0,1,0),gh=new P(0,0,1),vh={type:"added"},m0={type:"removed"},Us={type:"childadded",child:null},Fo={type:"childremoved",child:null};class Vt extends cr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:u0++}),this.uuid=di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vt.DEFAULT_UP.clone();const e=new P,t=new ei,i=new Pi,s=new P(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new gt}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=Vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ic,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(mh,e)}rotateY(e){return this.rotateOnAxis(xh,e)}rotateZ(e){return this.rotateOnAxis(gh,e)}translateOnAxis(e,t){return ph.copy(e).applyQuaternion(this.quaternion),this.position.add(ph.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(mh,e)}translateY(e){return this.translateOnAxis(xh,e)}translateZ(e){return this.translateOnAxis(gh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?va.copy(e):va.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),_r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(_r,va,this.up):vi.lookAt(va,_r,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),Is.setFromRotationMatrix(vi),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Kt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(vh),Us.child=e,this.dispatchEvent(Us),Us.child=null):Kt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(m0),Fo.child=e,this.dispatchEvent(Fo),Fo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vi.multiply(e.parent.matrixWorld)),e.applyMatrix4(vi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(vh),Us.child=e,this.dispatchEvent(Us),Us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,e,f0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,p0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),m=a(e.skeletons),p=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Vt.DEFAULT_UP=new P(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qn=new P,_i=new P,No=new P,Mi=new P,Fs=new P,Ns=new P,_h=new P,zo=new P,Oo=new P,Bo=new P,ko=new kt,Vo=new kt,Go=new kt;class kn{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),qn.subVectors(e,t),s.cross(qn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){qn.subVectors(s,t),_i.subVectors(i,t),No.subVectors(e,t);const a=qn.dot(qn),o=qn.dot(_i),l=qn.dot(No),c=_i.dot(_i),u=_i.dot(No),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const m=1/f,p=(c*l-o*u)*m,x=(a*u-o*l)*m;return r.set(1-p-x,x,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mi.x),l.addScaledVector(a,Mi.y),l.addScaledVector(o,Mi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ko.setScalar(0),Vo.setScalar(0),Go.setScalar(0),ko.fromBufferAttribute(e,t),Vo.fromBufferAttribute(e,i),Go.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ko,r.x),a.addScaledVector(Vo,r.y),a.addScaledVector(Go,r.z),a}static isFrontFacing(e,t,i,s){return qn.subVectors(i,t),_i.subVectors(e,t),qn.cross(_i).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return qn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),qn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return kn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return kn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Fs.subVectors(s,i),Ns.subVectors(r,i),zo.subVectors(e,i);const l=Fs.dot(zo),c=Ns.dot(zo);if(l<=0&&c<=0)return t.copy(i);Oo.subVectors(e,s);const u=Fs.dot(Oo),f=Ns.dot(Oo);if(u>=0&&f<=u)return t.copy(s);const m=l*f-u*c;if(m<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(Fs,a);Bo.subVectors(e,r);const p=Fs.dot(Bo),x=Ns.dot(Bo);if(x>=0&&p<=x)return t.copy(r);const M=p*c-l*x;if(M<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(i).addScaledVector(Ns,o);const g=u*x-p*f;if(g<=0&&f-u>=0&&p-x>=0)return _h.subVectors(r,s),o=(f-u)/(f-u+(p-x)),t.copy(s).addScaledVector(_h,o);const d=1/(g+M+m);return a=M*d,o=m*d,t.copy(i).addScaledVector(Fs,a).addScaledVector(Ns,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Kd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ni={h:0,s:0,l:0},_a={h:0,s:0,l:0};function Ho(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class it{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ct.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ct.workingColorSpace){if(e=Pc(e,1),t=_t(t,0,1),i=_t(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Ho(a,r,e+1/3),this.g=Ho(a,r,e),this.b=Ho(a,r,e-1/3)}return Ct.colorSpaceToWorking(this,s),this}setStyle(e,t=Et){function i(r){r!==void 0&&parseFloat(r)<1&&dt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:dt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);dt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const i=Kd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):dt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ri(e.r),this.g=Ri(e.g),this.b=Ri(e.b),this}copyLinearToSRGB(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return Ct.workingToColorSpace(mn.copy(this),e),Math.round(_t(mn.r*255,0,255))*65536+Math.round(_t(mn.g*255,0,255))*256+Math.round(_t(mn.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.workingToColorSpace(mn.copy(this),t);const i=mn.r,s=mn.g,r=mn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ct.workingColorSpace){return Ct.workingToColorSpace(mn.copy(this),t),e.r=mn.r,e.g=mn.g,e.b=mn.b,e}getStyle(e=Et){Ct.workingToColorSpace(mn.copy(this),e);const t=mn.r,i=mn.g,s=mn.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Ni),this.setHSL(Ni.h+e,Ni.s+t,Ni.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ni),e.getHSL(_a);const i=Ur(Ni.h,_a.h,t),s=Ur(Ni.s,_a.s,t),r=Ur(Ni.l,_a.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const mn=new it;it.NAMES=Kd;let x0=0;class Ki extends cr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:x0++}),this.uuid=di(),this.name="",this.type="Material",this.blending=Zs,this.side=Zi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xl,this.blendDst=gl,this.blendEquation=ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=er,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=As,this.stencilZFail=As,this.stencilZPass=As,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){dt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){dt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Zs&&(i.blending=this.blending),this.side!==Zi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==xl&&(i.blendSrc=this.blendSrc),this.blendDst!==gl&&(i.blendDst=this.blendDst),this.blendEquation!==ls&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==er&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==rh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==As&&(i.stencilFail=this.stencilFail),this.stencilZFail!==As&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==As&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class bt extends Ki{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=_c,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const tn=new P,Ma=new Ee;let g0=0;class Dn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:g0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=nc,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ma.fromBufferAttribute(this,t),Ma.applyMatrix3(e),this.setXY(t,Ma.x,Ma.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix3(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Zn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Bt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array),s=Bt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array),s=Bt(s,this.array),r=Bt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==nc&&(e.usage=this.usage),e}}class Jd extends Dn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class jd extends Dn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Mt extends Dn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let v0=0;const Nn=new Tt,Wo=new Vt,zs=new P,An=new ws,Mr=new ws,ln=new P;class Wt extends cr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:v0++}),this.uuid=di(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($d(e)?jd:Jd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new gt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,i){return Nn.makeTranslation(e,t,i),this.applyMatrix4(Nn),this}scale(e,t,i){return Nn.makeScale(e,t,i),this.applyMatrix4(Nn),this}lookAt(e){return Wo.lookAt(e),Wo.updateMatrix(),this.applyMatrix4(Wo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Mt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&dt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ws);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Kt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];An.setFromBufferAttribute(r),this.morphTargetsRelative?(ln.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(ln),ln.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(ln)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Kt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Kt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Mr.setFromBufferAttribute(o),this.morphTargetsRelative?(ln.addVectors(An.min,Mr.min),An.expandByPoint(ln),ln.addVectors(An.max,Mr.max),An.expandByPoint(ln)):(An.expandByPoint(Mr.min),An.expandByPoint(Mr.max))}An.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)ln.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(ln));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ln.fromBufferAttribute(o,c),l&&(zs.fromBufferAttribute(e,c),ln.add(zs)),s=Math.max(s,i.distanceToSquared(ln))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Kt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Kt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new P,l[R]=new P;const c=new P,u=new P,f=new P,m=new Ee,p=new Ee,x=new Ee,M=new P,g=new P;function d(R,w,S){c.fromBufferAttribute(i,R),u.fromBufferAttribute(i,w),f.fromBufferAttribute(i,S),m.fromBufferAttribute(r,R),p.fromBufferAttribute(r,w),x.fromBufferAttribute(r,S),u.sub(c),f.sub(c),p.sub(m),x.sub(m);const L=1/(p.x*x.y-x.x*p.y);isFinite(L)&&(M.copy(u).multiplyScalar(x.y).addScaledVector(f,-p.y).multiplyScalar(L),g.copy(f).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(L),o[R].add(M),o[w].add(M),o[S].add(M),l[R].add(g),l[w].add(g),l[S].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let R=0,w=_.length;R<w;++R){const S=_[R],L=S.start,F=S.count;for(let H=L,Q=L+F;H<Q;H+=3)d(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const v=new P,y=new P,E=new P,T=new P;function C(R){E.fromBufferAttribute(s,R),T.copy(E);const w=o[R];v.copy(w),v.sub(E.multiplyScalar(E.dot(w))).normalize(),y.crossVectors(T,w);const L=y.dot(l[R])<0?-1:1;a.setXYZW(R,v.x,v.y,v.z,L)}for(let R=0,w=_.length;R<w;++R){const S=_[R],L=S.start,F=S.count;for(let H=L,Q=L+F;H<Q;H+=3)C(e.getX(H+0)),C(e.getX(H+1)),C(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let m=0,p=e.count;m<p;m+=3){const x=e.getX(m+0),M=e.getX(m+1),g=e.getX(m+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,g),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,M),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),a.fromBufferAttribute(t,m+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),i.setXYZ(m+0,u.x,u.y,u.z),i.setXYZ(m+1,u.x,u.y,u.z),i.setXYZ(m+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)ln.fromBufferAttribute(e,t),ln.normalize(),e.setXYZ(t,ln.x,ln.y,ln.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,m=new c.constructor(l.length*u);let p=0,x=0;for(let M=0,g=l.length;M<g;M++){o.isInterleavedBufferAttribute?p=l[M]*o.data.stride+o.offset:p=l[M]*u;for(let d=0;d<u;d++)m[x++]=c[p++]}return new Dn(m,u,f)}if(this.index===null)return dt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){const m=c[u],p=e(m,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,m=c.length;f<m;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],f=r[c];for(let m=0,p=f.length;m<p;m++)u.push(f[m].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Mh=new Tt,es=new Dc,ya=new hr,yh=new P,Sa=new P,ba=new P,wa=new P,Xo=new P,Ta=new P,Sh=new P,Ea=new P;class O extends Vt{constructor(e=new Wt,t=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ta.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],f=r[l];u!==0&&(Xo.fromBufferAttribute(f,e),a?Ta.addScaledVector(Xo,u):Ta.addScaledVector(Xo.sub(t),u))}t.add(Ta)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ya.copy(i.boundingSphere),ya.applyMatrix4(r),es.copy(e.ray).recast(e.near),!(ya.containsPoint(es.origin)===!1&&(es.intersectSphere(ya,yh)===null||es.origin.distanceToSquared(yh)>(e.far-e.near)**2))&&(Mh.copy(r).invert(),es.copy(e.ray).applyMatrix4(Mh),!(i.boundingBox!==null&&es.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,m=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,M=m.length;x<M;x++){const g=m[x],d=a[g.materialIndex],_=Math.max(g.start,p.start),v=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let y=_,E=v;y<E;y+=3){const T=o.getX(y),C=o.getX(y+1),R=o.getX(y+2);s=Aa(this,d,e,i,c,u,f,T,C,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),M=Math.min(o.count,p.start+p.count);for(let g=x,d=M;g<d;g+=3){const _=o.getX(g),v=o.getX(g+1),y=o.getX(g+2);s=Aa(this,a,e,i,c,u,f,_,v,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,M=m.length;x<M;x++){const g=m[x],d=a[g.materialIndex],_=Math.max(g.start,p.start),v=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let y=_,E=v;y<E;y+=3){const T=y,C=y+1,R=y+2;s=Aa(this,d,e,i,c,u,f,T,C,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),M=Math.min(l.count,p.start+p.count);for(let g=x,d=M;g<d;g+=3){const _=g,v=g+1,y=g+2;s=Aa(this,a,e,i,c,u,f,_,v,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function _0(n,e,t,i,s,r,a,o){let l;if(e.side===gn?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Zi,o),l===null)return null;Ea.copy(o),Ea.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ea);return c<t.near||c>t.far?null:{distance:c,point:Ea.clone(),object:n}}function Aa(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Sa),n.getVertexPosition(l,ba),n.getVertexPosition(c,wa);const u=_0(n,e,t,i,Sa,ba,wa,Sh);if(u){const f=new P;kn.getBarycoord(Sh,Sa,ba,wa,f),s&&(u.uv=kn.getInterpolatedAttribute(s,o,l,c,f,new Ee)),r&&(u.uv1=kn.getInterpolatedAttribute(r,o,l,c,f,new Ee)),a&&(u.normal=kn.getInterpolatedAttribute(a,o,l,c,f,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const m={a:o,b:l,c,normal:new P,materialIndex:0};kn.getNormal(Sa,ba,wa,m.normal),u.face=m,u.barycoord=f}return u}class Le extends Wt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],f=[];let m=0,p=0;x("z","y","x",-1,-1,i,t,e,a,r,0),x("z","y","x",1,-1,i,t,-e,a,r,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Mt(c,3)),this.setAttribute("normal",new Mt(u,3)),this.setAttribute("uv",new Mt(f,2));function x(M,g,d,_,v,y,E,T,C,R,w){const S=y/C,L=E/R,F=y/2,H=E/2,Q=T/2,te=C+1,q=R+1;let Z=0,ne=0;const de=new P;for(let pe=0;pe<q;pe++){const Ve=pe*L-H;for(let I=0;I<te;I++){const we=I*S-F;de[M]=we*_,de[g]=Ve*v,de[d]=Q,c.push(de.x,de.y,de.z),de[M]=0,de[g]=0,de[d]=T>0?1:-1,u.push(de.x,de.y,de.z),f.push(I/C),f.push(1-pe/R),Z+=1}}for(let pe=0;pe<R;pe++)for(let Ve=0;Ve<C;Ve++){const I=m+Ve+te*pe,we=m+Ve+te*(pe+1),ge=m+(Ve+1)+te*(pe+1),Te=m+(Ve+1)+te*pe;l.push(I,we,Te),l.push(we,ge,Te),ne+=6}o.addGroup(p,ne,w),p+=ne,m+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Le(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function sr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(dt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function bn(n){const e={};for(let t=0;t<n.length;t++){const i=sr(n[t]);for(const s in i)e[s]=i[s]}return e}function M0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Qd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const Kr={clone:sr,merge:bn};var y0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,S0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class un extends Ki{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=y0,this.fragmentShader=S0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=sr(e.uniforms),this.uniformsGroups=M0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class eu extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=oi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zi=new P,bh=new Ee,wh=new Ee;class Rn extends eu{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Zr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ir*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zr*2*Math.atan(Math.tan(Ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zi.x,zi.y).multiplyScalar(-e/zi.z),zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(zi.x,zi.y).multiplyScalar(-e/zi.z)}getViewSize(e,t){return this.getViewBounds(e,bh,wh),t.subVectors(wh,bh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ir*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Os=-90,Bs=1;class b0 extends Vt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Rn(Os,Bs,e,t);s.layers=this.layers,this.add(s);const r=new Rn(Os,Bs,e,t);r.layers=this.layers,this.add(r);const a=new Rn(Os,Bs,e,t);a.layers=this.layers,this.add(a);const o=new Rn(Os,Bs,e,t);o.layers=this.layers,this.add(o);const l=new Rn(Os,Bs,e,t);l.layers=this.layers,this.add(l);const c=new Rn(Os,Bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===oi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Qa)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(f,m,p),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class tu extends vn{constructor(e=[],t=tr,i,s,r,a,o,l,c,u){super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class w0 extends Qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new tu(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Le(5,5,5),r=new un({name:"CubemapFromEquirect",uniforms:sr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:gn,blending:ci});r.uniforms.tEquirect.value=t;const a=new O(s,r),o=t.minFilter;return t.minFilter===hs&&(t.minFilter=Vn),new b0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class nt extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const T0={type:"move"};class qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),d=this._getHandJoint(c,M);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],m=u.position.distanceTo(f.position),p=.02,x=.005;c.inputState.pinching&&m>p+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=p-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(T0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new nt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Uc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new it(e),this.near=t,this.far=i}clone(){return new Uc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class nu extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class E0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=nc,this.updateRanges=[],this.version=0,this.uuid=di()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Sn=new P;class no{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.applyMatrix4(e),this.setXYZ(t,Sn.x,Sn.y,Sn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.applyNormalMatrix(e),this.setXYZ(t,Sn.x,Sn.y,Sn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.transformDirection(e),this.setXYZ(t,Sn.x,Sn.y,Sn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Zn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Bt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Zn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Zn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Zn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Zn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array),s=Bt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array),s=Bt(s,this.array),r=Bt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){to("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Dn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new no(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){to("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class iu extends Ki{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new it(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ks;const yr=new P,Vs=new P,Gs=new P,Hs=new Ee,Sr=new Ee,su=new Tt,Ca=new P,br=new P,Ra=new P,Th=new Ee,Yo=new Ee,Eh=new Ee;class Ah extends Vt{constructor(e=new iu){if(super(),this.isSprite=!0,this.type="Sprite",ks===void 0){ks=new Wt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new E0(t,5);ks.setIndex([0,1,2,0,2,3]),ks.setAttribute("position",new no(i,3,0,!1)),ks.setAttribute("uv",new no(i,2,3,!1))}this.geometry=ks,this.material=e,this.center=new Ee(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Kt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Vs.setFromMatrixScale(this.matrixWorld),su.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Gs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Vs.multiplyScalar(-Gs.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Pa(Ca.set(-.5,-.5,0),Gs,a,Vs,s,r),Pa(br.set(.5,-.5,0),Gs,a,Vs,s,r),Pa(Ra.set(.5,.5,0),Gs,a,Vs,s,r),Th.set(0,0),Yo.set(1,0),Eh.set(1,1);let o=e.ray.intersectTriangle(Ca,br,Ra,!1,yr);if(o===null&&(Pa(br.set(-.5,.5,0),Gs,a,Vs,s,r),Yo.set(0,1),o=e.ray.intersectTriangle(Ca,Ra,br,!1,yr),o===null))return;const l=e.ray.origin.distanceTo(yr);l<e.near||l>e.far||t.push({distance:l,point:yr.clone(),uv:kn.getInterpolation(yr,Ca,br,Ra,Th,Yo,Eh,new Ee),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Pa(n,e,t,i,s,r){Hs.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(Sr.x=r*Hs.x-s*Hs.y,Sr.y=s*Hs.x+r*Hs.y):Sr.copy(Hs),n.copy(e),n.x+=Sr.x,n.y+=Sr.y,n.applyMatrix4(su)}class ru extends vn{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Ln,u=Ln,f,m){super(null,a,o,l,c,u,s,r,f,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ch extends Dn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ws=new Tt,Rh=new Tt,La=[],Ph=new ws,A0=new Tt,wr=new O,Tr=new hr;class Qt extends O{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ch(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,A0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ws),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ws),Ph.copy(e.boundingBox).applyMatrix4(Ws),this.boundingBox.union(Ph)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new hr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ws),Tr.copy(e.boundingSphere).applyMatrix4(Ws),this.boundingSphere.union(Tr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(wr.geometry=this.geometry,wr.material=this.material,wr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Tr.copy(this.boundingSphere),Tr.applyMatrix4(i),e.ray.intersectsSphere(Tr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ws),Rh.multiplyMatrices(i,Ws),wr.matrixWorld=Rh,wr.raycast(e,La);for(let a=0,o=La.length;a<o;a++){const l=La[a];l.instanceId=r,l.object=this,t.push(l)}La.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ch(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new ru(new Float32Array(s*this.count),s,this.count,wc,ai));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const $o=new P,C0=new P,R0=new gt;class rs{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=$o.subVectors(i,t).cross(C0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta($o),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||R0.getNormalMatrix(e),s=this.coplanarPoint($o).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new hr,P0=new Ee(.5,.5),Da=new P;class Fc{constructor(e=new rs,t=new rs,i=new rs,s=new rs,r=new rs,a=new rs){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=oi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],m=r[6],p=r[7],x=r[8],M=r[9],g=r[10],d=r[11],_=r[12],v=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,p-u,d-x,E-_).normalize(),s[1].setComponents(c+a,p+u,d+x,E+_).normalize(),s[2].setComponents(c+o,p+f,d+M,E+v).normalize(),s[3].setComponents(c-o,p-f,d-M,E-v).normalize(),i)s[4].setComponents(l,m,g,y).normalize(),s[5].setComponents(c-l,p-m,d-g,E-y).normalize();else if(s[4].setComponents(c-l,p-m,d-g,E-y).normalize(),t===oi)s[5].setComponents(c+l,p+m,d+g,E+y).normalize();else if(t===Qa)s[5].setComponents(l,m,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){ts.center.set(0,0,0);const t=P0.distanceTo(e.center);return ts.radius=.7071067811865476+t,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Da.x=s.normal.x>0?e.max.x:e.min.x,Da.y=s.normal.y>0?e.max.y:e.min.y,Da.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Da)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ic extends Ki{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new it(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const io=new P,so=new P,Lh=new Tt,Er=new Dc,Ia=new hr,Zo=new P,Dh=new P;class Ih extends Vt{constructor(e=new Wt,t=new ic){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)io.fromBufferAttribute(t,s-1),so.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=io.distanceTo(so);e.setAttribute("lineDistance",new Mt(i,1))}else dt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ia.copy(i.boundingSphere),Ia.applyMatrix4(s),Ia.radius+=r,e.ray.intersectsSphere(Ia)===!1)return;Lh.copy(s).invert(),Er.copy(e.ray).applyMatrix4(Lh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,m=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let M=p,g=x-1;M<g;M+=c){const d=u.getX(M),_=u.getX(M+1),v=Ua(this,e,Er,l,d,_,M);v&&t.push(v)}if(this.isLineLoop){const M=u.getX(x-1),g=u.getX(p),d=Ua(this,e,Er,l,M,g,x-1);d&&t.push(d)}}else{const p=Math.max(0,a.start),x=Math.min(m.count,a.start+a.count);for(let M=p,g=x-1;M<g;M+=c){const d=Ua(this,e,Er,l,M,M+1,M);d&&t.push(d)}if(this.isLineLoop){const M=Ua(this,e,Er,l,x-1,p,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ua(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(io.fromBufferAttribute(o,s),so.fromBufferAttribute(o,r),t.distanceSqToSegment(io,so,Zo,Dh)>i)return;Zo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Zo);if(!(c<e.near||c>e.far))return{distance:c,point:Dh.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}class en extends vn{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class au extends vn{constructor(e,t,i=vs,s,r,a,o=Ln,l=Ln,c,u=qr,f=1){if(u!==qr&&u!==Yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:f};super(m,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Lc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ou extends vn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class hn extends Wt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new P,u=new Ee;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,m=3;f<=t;f++,m+=3){const p=i+f/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[m]/e+1)/2,u.y=(a[m+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Mt(a,3)),this.setAttribute("normal",new Mt(o,3)),this.setAttribute("uv",new Mt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Qe extends Wt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],f=[],m=[],p=[];let x=0;const M=[],g=i/2;let d=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new Mt(f,3)),this.setAttribute("normal",new Mt(m,3)),this.setAttribute("uv",new Mt(p,2));function _(){const y=new P,E=new P;let T=0;const C=(t-e)/i;for(let R=0;R<=r;R++){const w=[],S=R/r,L=S*(t-e)+e;for(let F=0;F<=s;F++){const H=F/s,Q=H*l+o,te=Math.sin(Q),q=Math.cos(Q);E.x=L*te,E.y=-S*i+g,E.z=L*q,f.push(E.x,E.y,E.z),y.set(te,C,q).normalize(),m.push(y.x,y.y,y.z),p.push(H,1-S),w.push(x++)}M.push(w)}for(let R=0;R<s;R++)for(let w=0;w<r;w++){const S=M[w][R],L=M[w+1][R],F=M[w+1][R+1],H=M[w][R+1];(e>0||w!==0)&&(u.push(S,L,H),T+=3),(t>0||w!==r-1)&&(u.push(L,F,H),T+=3)}c.addGroup(d,T,0),d+=T}function v(y){const E=x,T=new Ee,C=new P;let R=0;const w=y===!0?e:t,S=y===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,g*S,0),m.push(0,S,0),p.push(.5,.5),x++;const L=x;for(let F=0;F<=s;F++){const Q=F/s*l+o,te=Math.cos(Q),q=Math.sin(Q);C.x=w*q,C.y=g*S,C.z=w*te,f.push(C.x,C.y,C.z),m.push(0,S,0),T.x=te*.5+.5,T.y=q*.5*S+.5,p.push(T.x,T.y),x++}for(let F=0;F<s;F++){const H=E+F,Q=L+F;y===!0?u.push(Q,Q+1,H):u.push(Q+1,Q,H),R+=3}c.addGroup(d,R,y===!0?1:2),d+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class wi extends Qe{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new wi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class fo extends Wt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),c(i),u(),this.setAttribute("position",new Mt(r,3)),this.setAttribute("normal",new Mt(r.slice(),3)),this.setAttribute("uv",new Mt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const v=new P,y=new P,E=new P;for(let T=0;T<t.length;T+=3)p(t[T+0],v),p(t[T+1],y),p(t[T+2],E),l(v,y,E,_)}function l(_,v,y,E){const T=E+1,C=[];for(let R=0;R<=T;R++){C[R]=[];const w=_.clone().lerp(y,R/T),S=v.clone().lerp(y,R/T),L=T-R;for(let F=0;F<=L;F++)F===0&&R===T?C[R][F]=w:C[R][F]=w.clone().lerp(S,F/L)}for(let R=0;R<T;R++)for(let w=0;w<2*(T-R)-1;w++){const S=Math.floor(w/2);w%2===0?(m(C[R][S+1]),m(C[R+1][S]),m(C[R][S])):(m(C[R][S+1]),m(C[R+1][S+1]),m(C[R+1][S]))}}function c(_){const v=new P;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(_),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function u(){const _=new P;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const y=g(_)/2/Math.PI+.5,E=d(_)/Math.PI+.5;a.push(y,1-E)}x(),f()}function f(){for(let _=0;_<a.length;_+=6){const v=a[_+0],y=a[_+2],E=a[_+4],T=Math.max(v,y,E),C=Math.min(v,y,E);T>.9&&C<.1&&(v<.2&&(a[_+0]+=1),y<.2&&(a[_+2]+=1),E<.2&&(a[_+4]+=1))}}function m(_){r.push(_.x,_.y,_.z)}function p(_,v){const y=_*3;v.x=e[y+0],v.y=e[y+1],v.z=e[y+2]}function x(){const _=new P,v=new P,y=new P,E=new P,T=new Ee,C=new Ee,R=new Ee;for(let w=0,S=0;w<r.length;w+=9,S+=6){_.set(r[w+0],r[w+1],r[w+2]),v.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),T.set(a[S+0],a[S+1]),C.set(a[S+2],a[S+3]),R.set(a[S+4],a[S+5]),E.copy(_).add(v).add(y).divideScalar(3);const L=g(E);M(T,S+0,_,L),M(C,S+2,v,L),M(R,S+4,y,L)}}function M(_,v,y,E){E<0&&_.x===1&&(a[v]=_.x-1),y.x===0&&y.z===0&&(a[v]=E/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function d(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fo(e.vertices,e.indices,e.radius,e.details)}}class Nc extends fo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Nc(e.radius,e.detail)}}class pi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){dt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const u=i[s],m=i[s+1]-u,p=(a-u)/m;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new Ee:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],r=[],a=[],o=new P,l=new Tt;for(let p=0;p<=e;p++){const x=p/e;s[p]=this.getTangentAt(x,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),f=Math.abs(s[0].y),m=Math.abs(s[0].z);u<=c&&(c=u,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),m<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(_t(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,x))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(_t(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let x=1;x<=e;x++)r[x].applyMatrix4(l.makeRotationAxis(s[x],p*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class zc extends pi{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Ee){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),m=l-this.aX,p=c-this.aY;l=m*u-p*f+this.aX,c=m*f+p*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class L0 extends zc{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Oc(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let m=(a-r)/c-(o-r)/(c+u)+(o-a)/u,p=(o-a)/u-(l-a)/(u+f)+(l-o)/f;m*=u,p*=u,s(a,o,m,p)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const Fa=new P,Ko=new Oc,Jo=new Oc,jo=new Oc;class D0 extends pi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(Fa.subVectors(s[0],s[1]).add(s[0]),c=Fa);const f=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Fa.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Fa),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(c.distanceToSquared(f),p),M=Math.pow(f.distanceToSquared(m),p),g=Math.pow(m.distanceToSquared(u),p);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),Ko.initNonuniformCatmullRom(c.x,f.x,m.x,u.x,x,M,g),Jo.initNonuniformCatmullRom(c.y,f.y,m.y,u.y,x,M,g),jo.initNonuniformCatmullRom(c.z,f.z,m.z,u.z,x,M,g)}else this.curveType==="catmullrom"&&(Ko.initCatmullRom(c.x,f.x,m.x,u.x,this.tension),Jo.initCatmullRom(c.y,f.y,m.y,u.y,this.tension),jo.initCatmullRom(c.z,f.z,m.z,u.z,this.tension));return i.set(Ko.calc(l),Jo.calc(l),jo.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Uh(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function I0(n,e){const t=1-n;return t*t*e}function U0(n,e){return 2*(1-n)*n*e}function F0(n,e){return n*n*e}function Fr(n,e,t,i){return I0(n,e)+U0(n,t)+F0(n,i)}function N0(n,e){const t=1-n;return t*t*t*e}function z0(n,e){const t=1-n;return 3*t*t*n*e}function O0(n,e){return 3*(1-n)*n*n*e}function B0(n,e){return n*n*n*e}function Nr(n,e,t,i,s){return N0(n,e)+z0(n,t)+O0(n,i)+B0(n,s)}class lu extends pi{constructor(e=new Ee,t=new Ee,i=new Ee,s=new Ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ee){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Nr(e,s.x,r.x,a.x,o.x),Nr(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class k0 extends pi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Nr(e,s.x,r.x,a.x,o.x),Nr(e,s.y,r.y,a.y,o.y),Nr(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class cu extends pi{constructor(e=new Ee,t=new Ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ee){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class V0 extends pi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hu extends pi{constructor(e=new Ee,t=new Ee,i=new Ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ee){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Fr(e,s.x,r.x,a.x),Fr(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class G0 extends pi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Fr(e,s.x,r.x,a.x),Fr(e,s.y,r.y,a.y),Fr(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class du extends pi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ee){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return i.set(Uh(o,l.x,c.x,u.x,f.x),Uh(o,l.y,c.y,u.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Ee().fromArray(s))}return this}}var Fh=Object.freeze({__proto__:null,ArcCurve:L0,CatmullRomCurve3:D0,CubicBezierCurve:lu,CubicBezierCurve3:k0,EllipseCurve:zc,LineCurve:cu,LineCurve3:V0,QuadraticBezierCurve:hu,QuadraticBezierCurve3:G0,SplineCurve:du});class H0 extends pi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fh[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new Fh[s.type]().fromJSON(s))}return this}}class Nh extends H0{constructor(e){super(),this.type="Path",this.currentPoint=new Ee,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new cu(this.currentPoint.clone(),new Ee(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new hu(this.currentPoint.clone(),new Ee(e,t),new Ee(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new lu(this.currentPoint.clone(),new Ee(e,t),new Ee(i,s),new Ee(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new du(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){const c=new zc(e,t,i,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Bc extends Nh{constructor(e){super(e),this.uuid=di(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Nh().fromJSON(s))}return this}}function W0(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=uu(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=Z0(n,e,r,t)),n.length>80*t){o=n[0],l=n[1];let u=o,f=l;for(let m=t;m<s;m+=t){const p=n[m],x=n[m+1];p<o&&(o=p),x<l&&(l=x),p>u&&(u=p),x>f&&(f=x)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return Jr(r,a,t,o,l,c,0),a}function uu(n,e,t,i,s){let r;if(s===ap(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=zh(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=zh(a/i|0,n[a],n[a+1],r);return r&&rr(r,r.next)&&(Qr(r),r=r.next),r}function _s(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(rr(t,t.next)||Jt(t.prev,t,t.next)===0)){if(Qr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Jr(n,e,t,i,s,r,a){if(!n)return;!a&&r&&ep(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?q0(n,i,s,r):X0(n)){e.push(l.i,n.i,c.i),Qr(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Y0(_s(n),e),Jr(n,e,t,i,s,r,2)):a===2&&$0(n,e,t,i,s,r):Jr(_s(n),e,t,i,s,r,1);break}}}function X0(n){const e=n.prev,t=n,i=n.next;if(Jt(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,u=Math.min(s,r,a),f=Math.min(o,l,c),m=Math.max(s,r,a),p=Math.max(o,l,c);let x=i.next;for(;x!==e;){if(x.x>=u&&x.x<=m&&x.y>=f&&x.y<=p&&Pr(s,o,r,l,a,c,x.x,x.y)&&Jt(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function q0(n,e,t,i){const s=n.prev,r=n,a=n.next;if(Jt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,f=r.y,m=a.y,p=Math.min(o,l,c),x=Math.min(u,f,m),M=Math.max(o,l,c),g=Math.max(u,f,m),d=sc(p,x,e,t,i),_=sc(M,g,e,t,i);let v=n.prevZ,y=n.nextZ;for(;v&&v.z>=d&&y&&y.z<=_;){if(v.x>=p&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Pr(o,u,l,f,c,m,v.x,v.y)&&Jt(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=p&&y.x<=M&&y.y>=x&&y.y<=g&&y!==s&&y!==a&&Pr(o,u,l,f,c,m,y.x,y.y)&&Jt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=d;){if(v.x>=p&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Pr(o,u,l,f,c,m,v.x,v.y)&&Jt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=p&&y.x<=M&&y.y>=x&&y.y<=g&&y!==s&&y!==a&&Pr(o,u,l,f,c,m,y.x,y.y)&&Jt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Y0(n,e){let t=n;do{const i=t.prev,s=t.next.next;!rr(i,s)&&pu(i,t,t.next,s)&&jr(i,s)&&jr(s,i)&&(e.push(i.i,t.i,s.i),Qr(t),Qr(t.next),t=n=s),t=t.next}while(t!==n);return _s(t)}function $0(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&ip(a,o)){let l=mu(a,o);a=_s(a,a.next),l=_s(l,l.next),Jr(a,e,t,i,s,r,0),Jr(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Z0(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=uu(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(np(c))}s.sort(K0);for(let r=0;r<s.length;r++)t=J0(s[r],t);return t}function K0(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function J0(n,e){const t=j0(n,e);if(!t)return e;const i=mu(t,n);return _s(i,i.next),_s(t,t.next)}function j0(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(rr(n,t))return t;do{if(rr(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=i&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&fu(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const f=Math.abs(s-t.y)/(i-t.x);jr(t,n)&&(f<u||f===u&&(t.x>a.x||t.x===a.x&&Q0(a,t)))&&(a=t,u=f)}t=t.next}while(t!==o);return a}function Q0(n,e){return Jt(n.prev,n,e.prev)<0&&Jt(e.next,n,n.next)<0}function ep(n,e,t,i){let s=n;do s.z===0&&(s.z=sc(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,tp(s)}function tp(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function sc(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function np(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function fu(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function Pr(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&fu(n,e,t,i,s,r,a,o)}function ip(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!sp(n,e)&&(jr(n,e)&&jr(e,n)&&rp(n,e)&&(Jt(n.prev,n,e.prev)||Jt(n,e.prev,e))||rr(n,e)&&Jt(n.prev,n,n.next)>0&&Jt(e.prev,e,e.next)>0)}function Jt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function rr(n,e){return n.x===e.x&&n.y===e.y}function pu(n,e,t,i){const s=za(Jt(n,e,t)),r=za(Jt(n,e,i)),a=za(Jt(t,i,n)),o=za(Jt(t,i,e));return!!(s!==r&&a!==o||s===0&&Na(n,t,e)||r===0&&Na(n,i,e)||a===0&&Na(t,n,i)||o===0&&Na(t,e,i))}function Na(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function za(n){return n>0?1:n<0?-1:0}function sp(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&pu(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function jr(n,e){return Jt(n.prev,n,n.next)<0?Jt(n,e,n.next)>=0&&Jt(n,n.prev,e)>=0:Jt(n,e,n.prev)<0||Jt(n,n.next,e)<0}function rp(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function mu(n,e){const t=rc(n.i,n.x,n.y),i=rc(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function zh(n,e,t,i){const s=rc(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Qr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function rc(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ap(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class op{static triangulate(e,t,i=2){return W0(e,t,i)}}class zr{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return zr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Oh(e),Bh(i,e);let a=e.length;t.forEach(Oh);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Bh(i,t[l]);const o=op.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Oh(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Bh(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class kc extends fo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new kc(e.radius,e.detail)}}class Ht extends Wt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,f=e/o,m=t/l,p=[],x=[],M=[],g=[];for(let d=0;d<u;d++){const _=d*m-a;for(let v=0;v<c;v++){const y=v*f-r;x.push(y,-_,0),M.push(0,0,1),g.push(v/o),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let _=0;_<o;_++){const v=_+c*d,y=_+c*(d+1),E=_+1+c*(d+1),T=_+1+c*d;p.push(v,y,T),p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new Mt(x,3)),this.setAttribute("normal",new Mt(M,3)),this.setAttribute("uv",new Mt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ht(e.width,e.height,e.widthSegments,e.heightSegments)}}class po extends Wt{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],l=[],c=[],u=[];let f=e;const m=(t-e)/s,p=new P,x=new Ee;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const d=r+g/i*a;p.x=f*Math.cos(d),p.y=f*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),x.x=(p.x/t+1)/2,x.y=(p.y/t+1)/2,u.push(x.x,x.y)}f+=m}for(let M=0;M<s;M++){const g=M*(i+1);for(let d=0;d<i;d++){const _=d+g,v=_,y=_+i+1,E=_+i+2,T=_+1;o.push(v,y,T),o.push(y,E,T)}}this.setIndex(o),this.setAttribute("position",new Mt(l,3)),this.setAttribute("normal",new Mt(c,3)),this.setAttribute("uv",new Mt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new po(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class mo extends Wt{constructor(e=new Bc([new Ee(0,.5),new Ee(-.5,-.5),new Ee(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new Mt(s,3)),this.setAttribute("normal",new Mt(r,3)),this.setAttribute("uv",new Mt(a,2));function c(u){const f=s.length/3,m=u.extractPoints(t);let p=m.shape;const x=m.holes;zr.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,d=x.length;g<d;g++){const _=x[g];zr.isClockWise(_)===!0&&(x[g]=_.reverse())}const M=zr.triangulateShape(p,x);for(let g=0,d=x.length;g<d;g++){const _=x[g];p=p.concat(_)}for(let g=0,d=p.length;g<d;g++){const _=p[g];s.push(_.x,_.y,0),r.push(0,0,1),a.push(_.x,_.y)}for(let g=0,d=M.length;g<d;g++){const _=M[g],v=_[0]+f,y=_[1]+f,E=_[2]+f;i.push(v,y,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return lp(t,e)}static fromJSON(e,t){const i=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];i.push(a)}return new mo(i,e.curveSegments)}}function lp(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class qt extends Wt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new P,m=new P,p=[],x=[],M=[],g=[];for(let d=0;d<=i;d++){const _=[],v=d/i;let y=0;d===0&&a===0?y=.5/t:d===i&&l===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),f.y=e*Math.cos(a+v*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),x.push(f.x,f.y,f.z),m.copy(f).normalize(),M.push(m.x,m.y,m.z),g.push(T+y,1-v),_.push(c++)}u.push(_)}for(let d=0;d<i;d++)for(let _=0;_<t;_++){const v=u[d][_+1],y=u[d][_],E=u[d+1][_],T=u[d+1][_+1];(d!==0||a>0)&&p.push(v,y,T),(d!==i-1||l<Math.PI)&&p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new Mt(x,3)),this.setAttribute("normal",new Mt(M,3)),this.setAttribute("uv",new Mt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ms extends Wt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],l=[],c=[],u=new P,f=new P,m=new P;for(let p=0;p<=i;p++)for(let x=0;x<=s;x++){const M=x/s*r,g=p/i*Math.PI*2;f.x=(e+t*Math.cos(g))*Math.cos(M),f.y=(e+t*Math.cos(g))*Math.sin(M),f.z=t*Math.sin(g),o.push(f.x,f.y,f.z),u.x=e*Math.cos(M),u.y=e*Math.sin(M),m.subVectors(f,u).normalize(),l.push(m.x,m.y,m.z),c.push(x/s),c.push(p/i)}for(let p=1;p<=i;p++)for(let x=1;x<=s;x++){const M=(s+1)*p+x-1,g=(s+1)*(p-1)+x-1,d=(s+1)*(p-1)+x,_=(s+1)*p+x;a.push(M,g,_),a.push(g,d,_)}this.setIndex(a),this.setAttribute("position",new Mt(o,3)),this.setAttribute("normal",new Mt(l,3)),this.setAttribute("uv",new Mt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ms(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class cp extends un{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class X extends Ki{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new it(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rc,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class hp extends Ki{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rc,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=_c,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class dp extends Ki{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Rf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class up extends Ki{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Vc extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new it(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class fp extends Vc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new it(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Qo=new Tt,kh=new P,Vh=new P;class xu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.mapType=fi,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Fc,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;kh.setFromMatrixPosition(e.matrixWorld),t.position.copy(kh),Vh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vh),t.updateMatrixWorld(),Qo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Qo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Gh=new Tt,Ar=new P,el=new P;class pp extends xu{constructor(){super(new Rn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ee(4,2),this._viewportCount=6,this._viewports=[new kt(2,1,1,1),new kt(0,1,1,1),new kt(3,1,1,1),new kt(1,1,1,1),new kt(3,0,1,1),new kt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Ar.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ar),el.copy(i.position),el.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(el),i.updateMatrixWorld(),s.makeTranslation(-Ar.x,-Ar.y,-Ar.z),Gh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gh,i.coordinateSystem,i.reversedDepth)}}class Gc extends Vc{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new pp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Hc extends eu{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class mp extends xu{constructor(){super(new Hc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class tl extends Vc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new mp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class xp extends Rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class gu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Hh=new Tt;class gp{constructor(e,t,i=0,s=1/0){this.ray=new Dc(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Ic,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Kt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Hh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Hh),this}intersectObject(e,t=!0,i=[]){return ac(e,this,i,t),i.sort(Wh),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)ac(e[s],this,i,t);return i.sort(Wh),i}}function Wh(n,e){return n.distance-e.distance}function ac(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)ac(r[a],e,t,!0)}}function Xh(n,e,t,i){const s=vp(i);switch(t){case Xd:return n*e;case wc:return n*e/s.components*s.byteLength;case Tc:return n*e/s.components*s.byteLength;case Ec:return n*e*2/s.components*s.byteLength;case Ac:return n*e*2/s.components*s.byteLength;case qd:return n*e*3/s.components*s.byteLength;case Jn:return n*e*4/s.components*s.byteLength;case Cc:return n*e*4/s.components*s.byteLength;case Xa:case qa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ya:case $a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Rl:case Ll:return Math.max(n,16)*Math.max(e,8)/4;case Cl:case Pl:return Math.max(n,8)*Math.max(e,8)/2;case Dl:case Il:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ul:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Nl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case zl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ol:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case kl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Gl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Hl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Xl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ql:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Yl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case $l:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Zl:case Kl:case Jl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case jl:case Ql:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ec:case tc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vp(n){switch(n){case fi:case Vd:return{byteLength:1,components:1};case Wr:case Gd:case hi:return{byteLength:2,components:1};case Sc:case bc:return{byteLength:2,components:4};case vs:case yc:case ai:return{byteLength:4,components:1};case Hd:case Wd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vc}}));typeof window<"u"&&(window.__THREE__?dt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vc);function vu(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function _p(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,m=n.createBuffer();n.bindBuffer(l,m),n.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,u);else{f.sort((p,x)=>p.start-x.start);let m=0;for(let p=1;p<f.length;p++){const x=f[m],M=f[p];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++m,f[m]=M)}f.length=m+1;for(let p=0,x=f.length;p<x;p++){const M=f[p];n.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Mp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yp=`#ifdef USE_ALPHAHASH
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
#endif`,Sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ep=`#ifdef USE_AOMAP
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
#endif`,Ap=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cp=`#ifdef USE_BATCHING
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
#endif`,Rp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ip=`#ifdef USE_IRIDESCENCE
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
#endif`,Up=`#ifdef USE_BUMPMAP
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
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Hp=`#define PI 3.141592653589793
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
} // validated`,Wp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xp=`vec3 transformedNormal = objectNormal;
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
#endif`,qp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
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
#endif`,im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,om=`#ifdef USE_GRADIENTMAP
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
}`,lm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dm=`uniform bool receiveShadow;
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
#endif`,um=`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
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
#endif`,fm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gm=`PhysicalMaterial material;
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
#endif`,vm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
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
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
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
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
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
}`,_m=`
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
#endif`,Mm=`#if defined( RE_IndirectDiffuse )
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
#endif`,ym=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Em=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rm=`#if defined( USE_POINTS_UV )
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
#endif`,Pm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Im=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Um=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fm=`#ifdef USE_MORPHTARGETS
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
#endif`,Nm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Om=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gm=`#ifdef USE_NORMALMAP
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
#endif`,Hm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ym=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$m=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Zm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Km=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ex=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ix=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sx=`float getShadowMask() {
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
}`,rx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ax=`#ifdef USE_SKINNING
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
#endif`,ox=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lx=`#ifdef USE_SKINNING
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
#endif`,cx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ux=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fx=`#ifdef USE_TRANSMISSION
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
#endif`,px=`#ifdef USE_TRANSMISSION
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
#endif`,mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _x=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mx=`uniform sampler2D t2D;
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
}`,yx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tx=`#include <common>
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
}`,Ex=`#if DEPTH_PACKING == 3200
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
}`,Ax=`#define DISTANCE
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
}`,Cx=`#define DISTANCE
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
}`,Rx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Px=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lx=`uniform float scale;
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
}`,Dx=`uniform vec3 diffuse;
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
}`,Ix=`#include <common>
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
}`,Ux=`uniform vec3 diffuse;
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
}`,Fx=`#define LAMBERT
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
}`,Nx=`#define LAMBERT
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
}`,zx=`#define MATCAP
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
}`,Ox=`#define MATCAP
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
}`,Bx=`#define NORMAL
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
}`,kx=`#define NORMAL
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
}`,Vx=`#define PHONG
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
}`,Gx=`#define PHONG
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
}`,Hx=`#define STANDARD
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
}`,Wx=`#define STANDARD
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
}`,Xx=`#define TOON
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
}`,qx=`#define TOON
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
}`,Yx=`uniform float size;
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
}`,$x=`uniform vec3 diffuse;
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
}`,Zx=`#include <common>
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
}`,Kx=`uniform vec3 color;
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
}`,Jx=`uniform float rotation;
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
}`,jx=`uniform vec3 diffuse;
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
}`,vt={alphahash_fragment:Mp,alphahash_pars_fragment:yp,alphamap_fragment:Sp,alphamap_pars_fragment:bp,alphatest_fragment:wp,alphatest_pars_fragment:Tp,aomap_fragment:Ep,aomap_pars_fragment:Ap,batching_pars_vertex:Cp,batching_vertex:Rp,begin_vertex:Pp,beginnormal_vertex:Lp,bsdfs:Dp,iridescence_fragment:Ip,bumpmap_pars_fragment:Up,clipping_planes_fragment:Fp,clipping_planes_pars_fragment:Np,clipping_planes_pars_vertex:zp,clipping_planes_vertex:Op,color_fragment:Bp,color_pars_fragment:kp,color_pars_vertex:Vp,color_vertex:Gp,common:Hp,cube_uv_reflection_fragment:Wp,defaultnormal_vertex:Xp,displacementmap_pars_vertex:qp,displacementmap_vertex:Yp,emissivemap_fragment:$p,emissivemap_pars_fragment:Zp,colorspace_fragment:Kp,colorspace_pars_fragment:Jp,envmap_fragment:jp,envmap_common_pars_fragment:Qp,envmap_pars_fragment:em,envmap_pars_vertex:tm,envmap_physical_pars_fragment:um,envmap_vertex:nm,fog_vertex:im,fog_pars_vertex:sm,fog_fragment:rm,fog_pars_fragment:am,gradientmap_pars_fragment:om,lightmap_pars_fragment:lm,lights_lambert_fragment:cm,lights_lambert_pars_fragment:hm,lights_pars_begin:dm,lights_toon_fragment:fm,lights_toon_pars_fragment:pm,lights_phong_fragment:mm,lights_phong_pars_fragment:xm,lights_physical_fragment:gm,lights_physical_pars_fragment:vm,lights_fragment_begin:_m,lights_fragment_maps:Mm,lights_fragment_end:ym,logdepthbuf_fragment:Sm,logdepthbuf_pars_fragment:bm,logdepthbuf_pars_vertex:wm,logdepthbuf_vertex:Tm,map_fragment:Em,map_pars_fragment:Am,map_particle_fragment:Cm,map_particle_pars_fragment:Rm,metalnessmap_fragment:Pm,metalnessmap_pars_fragment:Lm,morphinstance_vertex:Dm,morphcolor_vertex:Im,morphnormal_vertex:Um,morphtarget_pars_vertex:Fm,morphtarget_vertex:Nm,normal_fragment_begin:zm,normal_fragment_maps:Om,normal_pars_fragment:Bm,normal_pars_vertex:km,normal_vertex:Vm,normalmap_pars_fragment:Gm,clearcoat_normal_fragment_begin:Hm,clearcoat_normal_fragment_maps:Wm,clearcoat_pars_fragment:Xm,iridescence_pars_fragment:qm,opaque_fragment:Ym,packing:$m,premultiplied_alpha_fragment:Zm,project_vertex:Km,dithering_fragment:Jm,dithering_pars_fragment:jm,roughnessmap_fragment:Qm,roughnessmap_pars_fragment:ex,shadowmap_pars_fragment:tx,shadowmap_pars_vertex:nx,shadowmap_vertex:ix,shadowmask_pars_fragment:sx,skinbase_vertex:rx,skinning_pars_vertex:ax,skinning_vertex:ox,skinnormal_vertex:lx,specularmap_fragment:cx,specularmap_pars_fragment:hx,tonemapping_fragment:dx,tonemapping_pars_fragment:ux,transmission_fragment:fx,transmission_pars_fragment:px,uv_pars_fragment:mx,uv_pars_vertex:xx,uv_vertex:gx,worldpos_vertex:vx,background_vert:_x,background_frag:Mx,backgroundCube_vert:yx,backgroundCube_frag:Sx,cube_vert:bx,cube_frag:wx,depth_vert:Tx,depth_frag:Ex,distanceRGBA_vert:Ax,distanceRGBA_frag:Cx,equirect_vert:Rx,equirect_frag:Px,linedashed_vert:Lx,linedashed_frag:Dx,meshbasic_vert:Ix,meshbasic_frag:Ux,meshlambert_vert:Fx,meshlambert_frag:Nx,meshmatcap_vert:zx,meshmatcap_frag:Ox,meshnormal_vert:Bx,meshnormal_frag:kx,meshphong_vert:Vx,meshphong_frag:Gx,meshphysical_vert:Hx,meshphysical_frag:Wx,meshtoon_vert:Xx,meshtoon_frag:qx,points_vert:Yx,points_frag:$x,shadow_vert:Zx,shadow_frag:Kx,sprite_vert:Jx,sprite_frag:jx},Oe={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new gt}},envmap:{envMap:{value:null},envMapRotation:{value:new gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new gt},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0},uvTransform:{value:new gt}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}}},si={basic:{uniforms:bn([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:bn([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,Oe.lights,{emissive:{value:new it(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:bn([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,Oe.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:bn([Oe.common,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.roughnessmap,Oe.metalnessmap,Oe.fog,Oe.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:bn([Oe.common,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.gradientmap,Oe.fog,Oe.lights,{emissive:{value:new it(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:bn([Oe.common,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:bn([Oe.points,Oe.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:bn([Oe.common,Oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:bn([Oe.common,Oe.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:bn([Oe.common,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:bn([Oe.sprite,Oe.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new gt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:bn([Oe.common,Oe.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:bn([Oe.lights,Oe.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};si.physical={uniforms:bn([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new gt},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new gt},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new gt},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new gt},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new gt},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new gt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const Oa={r:0,b:0,g:0},ns=new ei,Qx=new Tt;function eg(n,e,t,i,s,r,a){const o=new it(0);let l=r===!0?0:1,c,u,f=null,m=0,p=null;function x(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y)),y}function M(v){let y=!1;const E=x(v);E===null?d(o,l):E&&E.isColor&&(d(E,1),y=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,y){const E=x(y);E&&(E.isCubeTexture||E.mapping===uo)?(u===void 0&&(u=new O(new Le(1,1,1),new un({name:"BackgroundCubeMaterial",uniforms:sr(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ns.copy(y.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Qx.makeRotationFromEuler(ns)),u.material.toneMapped=Ct.getTransfer(E.colorSpace)!==Ot,(f!==E||m!==E.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,f=E,m=E.version,p=n.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new O(new Ht(2,2),new un({name:"BackgroundMaterial",uniforms:sr(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:Zi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Ct.getTransfer(E.colorSpace)!==Ot,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||m!==E.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,f=E,m=E.version,p=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function d(v,y){v.getRGB(Oa,Qd(n)),i.buffers.color.setClear(Oa.r,Oa.g,Oa.b,y,a)}function _(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,d(o,l)},render:M,addToRenderList:g,dispose:_}}function tg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=m(null);let r=s,a=!1;function o(S,L,F,H,Q){let te=!1;const q=f(H,F,L);r!==q&&(r=q,c(r.object)),te=p(S,H,F,Q),te&&x(S,H,F,Q),Q!==null&&e.update(Q,n.ELEMENT_ARRAY_BUFFER),(te||a)&&(a=!1,y(S,L,F,H),Q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Q).buffer))}function l(){return n.createVertexArray()}function c(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function f(S,L,F){const H=F.wireframe===!0;let Q=i[S.id];Q===void 0&&(Q={},i[S.id]=Q);let te=Q[L.id];te===void 0&&(te={},Q[L.id]=te);let q=te[H];return q===void 0&&(q=m(l()),te[H]=q),q}function m(S){const L=[],F=[],H=[];for(let Q=0;Q<t;Q++)L[Q]=0,F[Q]=0,H[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:H,object:S,attributes:{},index:null}}function p(S,L,F,H){const Q=r.attributes,te=L.attributes;let q=0;const Z=F.getAttributes();for(const ne in Z)if(Z[ne].location>=0){const pe=Q[ne];let Ve=te[ne];if(Ve===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(Ve=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(Ve=S.instanceColor)),pe===void 0||pe.attribute!==Ve||Ve&&pe.data!==Ve.data)return!0;q++}return r.attributesNum!==q||r.index!==H}function x(S,L,F,H){const Q={},te=L.attributes;let q=0;const Z=F.getAttributes();for(const ne in Z)if(Z[ne].location>=0){let pe=te[ne];pe===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(pe=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(pe=S.instanceColor));const Ve={};Ve.attribute=pe,pe&&pe.data&&(Ve.data=pe.data),Q[ne]=Ve,q++}r.attributes=Q,r.attributesNum=q,r.index=H}function M(){const S=r.newAttributes;for(let L=0,F=S.length;L<F;L++)S[L]=0}function g(S){d(S,0)}function d(S,L){const F=r.newAttributes,H=r.enabledAttributes,Q=r.attributeDivisors;F[S]=1,H[S]===0&&(n.enableVertexAttribArray(S),H[S]=1),Q[S]!==L&&(n.vertexAttribDivisor(S,L),Q[S]=L)}function _(){const S=r.newAttributes,L=r.enabledAttributes;for(let F=0,H=L.length;F<H;F++)L[F]!==S[F]&&(n.disableVertexAttribArray(F),L[F]=0)}function v(S,L,F,H,Q,te,q){q===!0?n.vertexAttribIPointer(S,L,F,Q,te):n.vertexAttribPointer(S,L,F,H,Q,te)}function y(S,L,F,H){M();const Q=H.attributes,te=F.getAttributes(),q=L.defaultAttributeValues;for(const Z in te){const ne=te[Z];if(ne.location>=0){let de=Q[Z];if(de===void 0&&(Z==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),Z==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const pe=de.normalized,Ve=de.itemSize,I=e.get(de);if(I===void 0)continue;const we=I.buffer,ge=I.type,Te=I.bytesPerElement,$=ge===n.INT||ge===n.UNSIGNED_INT||de.gpuType===yc;if(de.isInterleavedBufferAttribute){const K=de.data,xe=K.stride,Me=de.offset;if(K.isInstancedInterleavedBuffer){for(let Ue=0;Ue<ne.locationSize;Ue++)d(ne.location+Ue,K.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ue=0;Ue<ne.locationSize;Ue++)g(ne.location+Ue);n.bindBuffer(n.ARRAY_BUFFER,we);for(let Ue=0;Ue<ne.locationSize;Ue++)v(ne.location+Ue,Ve/ne.locationSize,ge,pe,xe*Te,(Me+Ve/ne.locationSize*Ue)*Te,$)}else{if(de.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)d(ne.location+K,de.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let K=0;K<ne.locationSize;K++)g(ne.location+K);n.bindBuffer(n.ARRAY_BUFFER,we);for(let K=0;K<ne.locationSize;K++)v(ne.location+K,Ve/ne.locationSize,ge,pe,Ve*Te,Ve/ne.locationSize*K*Te,$)}}else if(q!==void 0){const pe=q[Z];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv(ne.location,pe);break;case 3:n.vertexAttrib3fv(ne.location,pe);break;case 4:n.vertexAttrib4fv(ne.location,pe);break;default:n.vertexAttrib1fv(ne.location,pe)}}}}_()}function E(){R();for(const S in i){const L=i[S];for(const F in L){const H=L[F];for(const Q in H)u(H[Q].object),delete H[Q];delete L[F]}delete i[S]}}function T(S){if(i[S.id]===void 0)return;const L=i[S.id];for(const F in L){const H=L[F];for(const Q in H)u(H[Q].object),delete H[Q];delete L[F]}delete i[S.id]}function C(S){for(const L in i){const F=i[L];if(F[S.id]===void 0)continue;const H=F[S.id];for(const Q in H)u(H[Q].object),delete H[Q];delete F[S.id]}}function R(){w(),a=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:g,disableUnusedAttributes:_}}function ng(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,f){f!==0&&(n.drawArraysInstanced(i,c,u,f),t.update(u,i,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let p=0;for(let x=0;x<f;x++)p+=u[x];t.update(p,i,1)}function l(c,u,f,m){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<c.length;x++)a(c[x],u[x],m[x]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,m,0,f);let x=0;for(let M=0;M<f;M++)x+=u[M]*m[M];t.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function ig(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Jn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const R=C===hi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==fi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ai&&!R)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(dt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:m,maxTextures:p,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function sg(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new rs,o=new gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,m){const p=f.length!==0||m||i!==0||s;return s=m,i=f.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,m){t=u(f,m,0)},this.setState=function(f,m,p){const x=f.clippingPlanes,M=f.clipIntersection,g=f.clipShadows,d=n.get(f);if(!s||x===null||x.length===0||r&&!g)r?u(null):c();else{const _=r?0:i,v=_*4;let y=d.clippingState||null;l.value=y,y=u(x,m,v,p);for(let E=0;E!==v;++E)y[E]=t[E];d.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,m,p,x){const M=f!==null?f.length:0;let g=null;if(M!==0){if(g=l.value,x!==!0||g===null){const d=p+M*4,_=m.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<d)&&(g=new Float32Array(d));for(let v=0,y=p;v!==M;++v,y+=4)a.copy(f[v]).applyMatrix4(_,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function rg(n){let e=new WeakMap;function t(a,o){return o===Tl?a.mapping=tr:o===El&&(a.mapping=nr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Tl||o===El)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new w0(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Hi=4,qh=[.125,.215,.35,.446,.526,.582],cs=20,ag=512,Cr=new Hc,Yh=new it;let nl=null,il=0,sl=0,rl=!1;const og=new P;class oc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=og}=r;nl=this._renderer.getRenderTarget(),il=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(nl,il,sl),this._renderer.xr.enabled=rl,e.scissorTest=!1,Xs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===tr||e.mapping===nr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),nl=this._renderer.getRenderTarget(),il=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:hi,format:Jn,colorSpace:ir,depthBuffer:!1},s=$h(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$h(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=lg(r)),this._blurMaterial=hg(r,e,t)}return s}_compileMaterial(e){const t=new O(new Wt,e);this._renderer.compile(t,Cr)}_sceneToCubeUV(e,t,i,s,r){const l=new Rn(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,m=f.autoClear,p=f.toneMapping;f.getClearColor(Yh),f.toneMapping=qi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new O(new Le,new bt({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let d=!1;const _=e.background;_?_.isColor&&(g.color.copy(_),e.background=null,d=!0):(g.color.copy(Yh),d=!0);for(let v=0;v<6;v++){const y=v%3;y===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[v],r.y,r.z)):y===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[v]));const E=this._cubeSize;Xs(s,y*E,v>2?E:0,E,E),f.setRenderTarget(s),d&&f.render(M,l),f.render(e,l)}f.toneMapping=p,f.autoClear=m,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===tr||e.mapping===nr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Xs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Cr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget;if(this._ggxMaterial===null){const _=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=cg(this._lodMax,_,v)}const a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),m=.05+c*.95,p=f*m,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-Hi?i-x+Hi:0),d=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=x-t,Xs(r,g,d,3*M,2*M),s.setRenderTarget(r),s.render(o,Cr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-i,Xs(e,g,d,3*M,2*M),s.setRenderTarget(e),s.render(o,Cr)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Kt("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[s];f.material=c;const m=c.uniforms,p=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*cs-1),M=r/x,g=isFinite(r)?1+Math.floor(u*M):cs;g>cs&&dt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${cs}`);const d=[];let _=0;for(let C=0;C<cs;++C){const R=C/M,w=Math.exp(-R*R/2);d.push(w),C===0?_+=w:C<g&&(_+=2*w)}for(let C=0;C<d.length;C++)d[C]=d[C]/_;m.envMap.value=e.texture,m.samples.value=g,m.weights.value=d,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:v}=this;m.dTheta.value=x,m.mipInt.value=v-i;const y=this._sizeLods[s],E=3*y*(s>v-Hi?s-v+Hi:0),T=4*(this._cubeSize-y);Xs(t,E,T,3*y,2*y),l.setRenderTarget(t),l.render(f,Cr)}}function lg(n){const e=[],t=[],i=[];let s=n;const r=n-Hi+1+qh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Hi?l=qh[a-n+Hi-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,f=1+c,m=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,x=6,M=3,g=2,d=1,_=new Float32Array(M*x*p),v=new Float32Array(g*x*p),y=new Float32Array(d*x*p);for(let T=0;T<p;T++){const C=T%3*2/3-1,R=T>2?0:-1,w=[C,R,0,C+2/3,R,0,C+2/3,R+1,0,C,R,0,C+2/3,R+1,0,C,R+1,0];_.set(w,M*x*T),v.set(m,g*x*T);const S=[T,T,T,T,T,T];y.set(S,d*x*T)}const E=new Wt;E.setAttribute("position",new Dn(_,M)),E.setAttribute("uv",new Dn(v,g)),E.setAttribute("faceIndex",new Dn(y,d)),i.push(new O(E,null)),s>Hi&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function $h(n,e,t){const i=new Qn(n,e,t);return i.texture.mapping=uo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Xs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function cg(n,e,t){return new un({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ag,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function hg(n,e,t){const i=new Float32Array(cs),s=new P(0,1,0);return new un({name:"SphericalGaussianBlur",defines:{n:cs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:xo(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Zh(){return new un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xo(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Kh(){return new un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function xo(){return`

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
	`}function dg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Tl||l===El,u=l===tr||l===nr;if(c||u){let f=e.get(o);const m=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new oc(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new oc(n)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function ug(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&$r("WebGLRenderer: "+i+" extension not supported."),s}}}function fg(n,e,t,i){const s={},r=new WeakMap;function a(f){const m=f.target;m.index!==null&&e.remove(m.index);for(const x in m.attributes)e.remove(m.attributes[x]);m.removeEventListener("dispose",a),delete s[m.id];const p=r.get(m);p&&(e.remove(p),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(f,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,t.memory.geometries++),m}function l(f){const m=f.attributes;for(const p in m)e.update(m[p],n.ARRAY_BUFFER)}function c(f){const m=[],p=f.index,x=f.attributes.position;let M=0;if(p!==null){const _=p.array;M=p.version;for(let v=0,y=_.length;v<y;v+=3){const E=_[v+0],T=_[v+1],C=_[v+2];m.push(E,T,T,C,C,E)}}else if(x!==void 0){const _=x.array;M=x.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const E=v+0,T=v+1,C=v+2;m.push(E,T,T,C,C,E)}}else return;const g=new($d(m)?jd:Jd)(m,1);g.version=M;const d=r.get(f);d&&e.remove(d),r.set(f,g)}function u(f){const m=r.get(f);if(m){const p=f.index;p!==null&&m.version<p.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function pg(n,e,t){let i;function s(m){i=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function l(m,p){n.drawElements(i,p,r,m*a),t.update(p,i,1)}function c(m,p,x){x!==0&&(n.drawElementsInstanced(i,p,r,m*a,x),t.update(p,i,x))}function u(m,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,m,0,x);let g=0;for(let d=0;d<x;d++)g+=p[d];t.update(g,i,1)}function f(m,p,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<m.length;d++)c(m[d]/a,p[d],M[d]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,r,m,0,M,0,x);let d=0;for(let _=0;_<x;_++)d+=p[_]*M[_];t.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function mg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Kt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function xg(n,e,t){const i=new WeakMap,s=new kt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let m=i.get(o);if(m===void 0||m.count!==f){let S=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var p=S;m!==void 0&&m.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),g===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const C=new Float32Array(E*T*4*f),R=new Zd(C,E,T,f);R.type=ai,R.needsUpdate=!0;const w=y*4;for(let L=0;L<f;L++){const F=d[L],H=_[L],Q=v[L],te=E*T*4*L;for(let q=0;q<F.count;q++){const Z=q*w;x===!0&&(s.fromBufferAttribute(F,q),C[te+Z+0]=s.x,C[te+Z+1]=s.y,C[te+Z+2]=s.z,C[te+Z+3]=0),M===!0&&(s.fromBufferAttribute(H,q),C[te+Z+4]=s.x,C[te+Z+5]=s.y,C[te+Z+6]=s.z,C[te+Z+7]=0),g===!0&&(s.fromBufferAttribute(Q,q),C[te+Z+8]=s.x,C[te+Z+9]=s.y,C[te+Z+10]=s.z,C[te+Z+11]=Q.itemSize===4?s.w:1)}}m={count:f,texture:R,size:new Ee(E,T)},i.set(o,m),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let x=0;for(let g=0;g<c.length;g++)x+=c[g];const M=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(n,"morphTargetBaseInfluence",M),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:r}}function gg(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const m=l.skeleton;s.get(m)!==c&&(m.update(),s.set(m,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const _u=new vn,Jh=new au(1,1),Mu=new Zd,yu=new l0,Su=new tu,jh=[],Qh=[],ed=new Float32Array(16),td=new Float32Array(9),nd=new Float32Array(4);function dr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=jh[s];if(r===void 0&&(r=new Float32Array(s),jh[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function rn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function an(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function go(n,e){let t=Qh[e];t===void 0&&(t=new Int32Array(e),Qh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function vg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function _g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;n.uniform2fv(this.addr,e),an(t,e)}}function Mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rn(t,e))return;n.uniform3fv(this.addr,e),an(t,e)}}function yg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;n.uniform4fv(this.addr,e),an(t,e)}}function Sg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(rn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),an(t,e)}else{if(rn(t,i))return;nd.set(i),n.uniformMatrix2fv(this.addr,!1,nd),an(t,i)}}function bg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(rn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),an(t,e)}else{if(rn(t,i))return;td.set(i),n.uniformMatrix3fv(this.addr,!1,td),an(t,i)}}function wg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(rn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),an(t,e)}else{if(rn(t,i))return;ed.set(i),n.uniformMatrix4fv(this.addr,!1,ed),an(t,i)}}function Tg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Eg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;n.uniform2iv(this.addr,e),an(t,e)}}function Ag(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;n.uniform3iv(this.addr,e),an(t,e)}}function Cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;n.uniform4iv(this.addr,e),an(t,e)}}function Rg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Pg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;n.uniform2uiv(this.addr,e),an(t,e)}}function Lg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;n.uniform3uiv(this.addr,e),an(t,e)}}function Dg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;n.uniform4uiv(this.addr,e),an(t,e)}}function Ig(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Jh.compareFunction=Yd,r=Jh):r=_u,t.setTexture2D(e||r,s)}function Ug(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||yu,s)}function Fg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Su,s)}function Ng(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Mu,s)}function zg(n){switch(n){case 5126:return vg;case 35664:return _g;case 35665:return Mg;case 35666:return yg;case 35674:return Sg;case 35675:return bg;case 35676:return wg;case 5124:case 35670:return Tg;case 35667:case 35671:return Eg;case 35668:case 35672:return Ag;case 35669:case 35673:return Cg;case 5125:return Rg;case 36294:return Pg;case 36295:return Lg;case 36296:return Dg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ig;case 35679:case 36299:case 36307:return Ug;case 35680:case 36300:case 36308:case 36293:return Fg;case 36289:case 36303:case 36311:case 36292:return Ng}}function Og(n,e){n.uniform1fv(this.addr,e)}function Bg(n,e){const t=dr(e,this.size,2);n.uniform2fv(this.addr,t)}function kg(n,e){const t=dr(e,this.size,3);n.uniform3fv(this.addr,t)}function Vg(n,e){const t=dr(e,this.size,4);n.uniform4fv(this.addr,t)}function Gg(n,e){const t=dr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Hg(n,e){const t=dr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Wg(n,e){const t=dr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Xg(n,e){n.uniform1iv(this.addr,e)}function qg(n,e){n.uniform2iv(this.addr,e)}function Yg(n,e){n.uniform3iv(this.addr,e)}function $g(n,e){n.uniform4iv(this.addr,e)}function Zg(n,e){n.uniform1uiv(this.addr,e)}function Kg(n,e){n.uniform2uiv(this.addr,e)}function Jg(n,e){n.uniform3uiv(this.addr,e)}function jg(n,e){n.uniform4uiv(this.addr,e)}function Qg(n,e,t){const i=this.cache,s=e.length,r=go(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||_u,r[a])}function e1(n,e,t){const i=this.cache,s=e.length,r=go(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||yu,r[a])}function t1(n,e,t){const i=this.cache,s=e.length,r=go(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Su,r[a])}function n1(n,e,t){const i=this.cache,s=e.length,r=go(t,s);rn(i,r)||(n.uniform1iv(this.addr,r),an(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Mu,r[a])}function i1(n){switch(n){case 5126:return Og;case 35664:return Bg;case 35665:return kg;case 35666:return Vg;case 35674:return Gg;case 35675:return Hg;case 35676:return Wg;case 5124:case 35670:return Xg;case 35667:case 35671:return qg;case 35668:case 35672:return Yg;case 35669:case 35673:return $g;case 5125:return Zg;case 36294:return Kg;case 36295:return Jg;case 36296:return jg;case 35678:case 36198:case 36298:case 36306:case 35682:return Qg;case 35679:case 36299:case 36307:return e1;case 35680:case 36300:case 36308:case 36293:return t1;case 36289:case 36303:case 36311:case 36292:return n1}}class s1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=zg(t.type)}}class r1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=i1(t.type)}}class a1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const al=/(\w+)(\])?(\[|\.)?/g;function id(n,e){n.seq.push(e),n.map[e.id]=e}function o1(n,e,t){const i=n.name,s=i.length;for(al.lastIndex=0;;){const r=al.exec(i),a=al.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){id(t,c===void 0?new s1(o,n,e):new r1(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new a1(o),id(t,f)),t=f}}}class Za{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);o1(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function sd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const l1=37297;let c1=0;function h1(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const rd=new gt;function d1(n){Ct._getMatrix(rd,Ct.workingColorSpace,n);const e=`mat3( ${rd.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(n)){case ja:return[e,"LinearTransferOETF"];case Ot:return[e,"sRGBTransferOETF"];default:return dt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function ad(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+h1(n.getShaderSource(e),o)}else return r}function u1(n,e){const t=d1(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function f1(n,e){let t;switch(e){case Ud:t="Linear";break;case Fd:t="Reinhard";break;case Nd:t="Cineon";break;case Mc:t="ACESFilmic";break;case Od:t="AgX";break;case Bd:t="Neutral";break;case zd:t="Custom";break;default:dt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ba=new P;function p1(){Ct.getLuminanceCoefficients(Ba);const n=Ba.x.toFixed(4),e=Ba.y.toFixed(4),t=Ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function m1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Lr).join(`
`)}function x1(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function g1(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Lr(n){return n!==""}function od(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ld(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const v1=/^[ \t]*#include +<([\w\d./]+)>/gm;function lc(n){return n.replace(v1,M1)}const _1=new Map;function M1(n,e){let t=vt[e];if(t===void 0){const i=_1.get(e);if(i!==void 0)t=vt[i],dt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return lc(t)}const y1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cd(n){return n.replace(y1,S1)}function S1(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function hd(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function b1(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Dd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Id?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Si&&(e="SHADOWMAP_TYPE_VSM"),e}function w1(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case tr:case nr:e="ENVMAP_TYPE_CUBE";break;case uo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function T1(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===nr&&(e="ENVMAP_MODE_REFRACTION"),e}function E1(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case _c:e="ENVMAP_BLENDING_MULTIPLY";break;case Ef:e="ENVMAP_BLENDING_MIX";break;case Af:e="ENVMAP_BLENDING_ADD";break}return e}function A1(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function C1(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=b1(t),c=w1(t),u=T1(t),f=E1(t),m=A1(t),p=m1(t),x=x1(r),M=s.createProgram();let g,d,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Lr).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Lr).join(`
`),d.length>0&&(d+=`
`)):(g=[hd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Lr).join(`
`),d=[hd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qi?"#define TONE_MAPPING":"",t.toneMapping!==qi?vt.tonemapping_pars_fragment:"",t.toneMapping!==qi?f1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,u1("linearToOutputTexel",t.outputColorSpace),p1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Lr).join(`
`)),a=lc(a),a=od(a,t),a=ld(a,t),o=lc(o),o=od(o,t),o=ld(o,t),a=cd(a),o=cd(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",t.glslVersion===ah?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ah?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const v=_+g+a,y=_+d+o,E=sd(s,s.VERTEX_SHADER,v),T=sd(s,s.FRAGMENT_SHADER,y);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function C(L){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(M)||"",H=s.getShaderInfoLog(E)||"",Q=s.getShaderInfoLog(T)||"",te=F.trim(),q=H.trim(),Z=Q.trim();let ne=!0,de=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const pe=ad(s,E,"vertex"),Ve=ad(s,T,"fragment");Kt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+pe+`
`+Ve)}else te!==""?dt("WebGLProgram: Program Info Log:",te):(q===""||Z==="")&&(de=!1);de&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:Z,prefix:d}})}s.deleteShader(E),s.deleteShader(T),R=new Za(s,M),w=g1(s,M)}let R;this.getUniforms=function(){return R===void 0&&C(this),R};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(M,l1)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=c1++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let R1=0;class P1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new L1(e),t.set(e,i)),i}}class L1{constructor(e){this.id=R1++,this.code=e,this.usedTimes=0}}function D1(n,e,t,i,s,r,a){const o=new Ic,l=new P1,c=new Set,u=[],f=s.logarithmicDepthBuffer,m=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(w){return c.add(w),w===0?"uv":`uv${w}`}function g(w,S,L,F,H){const Q=F.fog,te=H.geometry,q=w.isMeshStandardMaterial?F.environment:null,Z=(w.isMeshStandardMaterial?t:e).get(w.envMap||q),ne=Z&&Z.mapping===uo?Z.image.height:null,de=x[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&dt("WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const pe=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Ve=pe!==void 0?pe.length:0;let I=0;te.morphAttributes.position!==void 0&&(I=1),te.morphAttributes.normal!==void 0&&(I=2),te.morphAttributes.color!==void 0&&(I=3);let we,ge,Te,$;if(de){const At=si[de];we=At.vertexShader,ge=At.fragmentShader}else we=w.vertexShader,ge=w.fragmentShader,l.update(w),Te=l.getVertexShaderID(w),$=l.getFragmentShaderID(w);const K=n.getRenderTarget(),xe=n.state.buffers.depth.getReversed(),Me=H.isInstancedMesh===!0,Ue=H.isBatchedMesh===!0,Ke=!!w.map,Dt=!!w.matcap,Je=!!Z,Pt=!!w.aoMap,B=!!w.lightMap,ft=!!w.bumpMap,ut=!!w.normalMap,Lt=!!w.displacementMap,qe=!!w.emissiveMap,Ft=!!w.metalnessMap,et=!!w.roughnessMap,ht=w.anisotropy>0,D=w.clearcoat>0,A=w.dispersion>0,J=w.iridescence>0,ce=w.sheen>0,fe=w.transmission>0,re=ht&&!!w.anisotropyMap,$e=D&&!!w.clearcoatMap,Ae=D&&!!w.clearcoatNormalMap,je=D&&!!w.clearcoatRoughnessMap,Ge=J&&!!w.iridescenceMap,me=J&&!!w.iridescenceThicknessMap,ye=ce&&!!w.sheenColorMap,st=ce&&!!w.sheenRoughnessMap,tt=!!w.specularMap,Be=!!w.specularColorMap,rt=!!w.specularIntensityMap,G=fe&&!!w.transmissionMap,ze=fe&&!!w.thicknessMap,Ie=!!w.gradientMap,Ce=!!w.alphaMap,ve=w.alphaTest>0,ue=!!w.alphaHash,We=!!w.extensions;let at=qi;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(at=n.toneMapping);const It={shaderID:de,shaderType:w.type,shaderName:w.name,vertexShader:we,fragmentShader:ge,defines:w.defines,customVertexShaderID:Te,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ue,batchingColor:Ue&&H._colorsTexture!==null,instancing:Me,instancingColor:Me&&H.instanceColor!==null,instancingMorph:Me&&H.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ir,alphaToCoverage:!!w.alphaToCoverage,map:Ke,matcap:Dt,envMap:Je,envMapMode:Je&&Z.mapping,envMapCubeUVHeight:ne,aoMap:Pt,lightMap:B,bumpMap:ft,normalMap:ut,displacementMap:m&&Lt,emissiveMap:qe,normalMapObjectSpace:ut&&w.normalMapType===Lf,normalMapTangentSpace:ut&&w.normalMapType===Rc,metalnessMap:Ft,roughnessMap:et,anisotropy:ht,anisotropyMap:re,clearcoat:D,clearcoatMap:$e,clearcoatNormalMap:Ae,clearcoatRoughnessMap:je,dispersion:A,iridescence:J,iridescenceMap:Ge,iridescenceThicknessMap:me,sheen:ce,sheenColorMap:ye,sheenRoughnessMap:st,specularMap:tt,specularColorMap:Be,specularIntensityMap:rt,transmission:fe,transmissionMap:G,thicknessMap:ze,gradientMap:Ie,opaque:w.transparent===!1&&w.blending===Zs&&w.alphaToCoverage===!1,alphaMap:Ce,alphaTest:ve,alphaHash:ue,combine:w.combine,mapUv:Ke&&M(w.map.channel),aoMapUv:Pt&&M(w.aoMap.channel),lightMapUv:B&&M(w.lightMap.channel),bumpMapUv:ft&&M(w.bumpMap.channel),normalMapUv:ut&&M(w.normalMap.channel),displacementMapUv:Lt&&M(w.displacementMap.channel),emissiveMapUv:qe&&M(w.emissiveMap.channel),metalnessMapUv:Ft&&M(w.metalnessMap.channel),roughnessMapUv:et&&M(w.roughnessMap.channel),anisotropyMapUv:re&&M(w.anisotropyMap.channel),clearcoatMapUv:$e&&M(w.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&M(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:je&&M(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ge&&M(w.iridescenceMap.channel),iridescenceThicknessMapUv:me&&M(w.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&M(w.sheenColorMap.channel),sheenRoughnessMapUv:st&&M(w.sheenRoughnessMap.channel),specularMapUv:tt&&M(w.specularMap.channel),specularColorMapUv:Be&&M(w.specularColorMap.channel),specularIntensityMapUv:rt&&M(w.specularIntensityMap.channel),transmissionMapUv:G&&M(w.transmissionMap.channel),thicknessMapUv:ze&&M(w.thicknessMap.channel),alphaMapUv:Ce&&M(w.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(ut||ht),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!te.attributes.uv&&(Ke||Ce),fog:!!Q,useFog:w.fog===!0,fogExp2:!!Q&&Q.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:xe,skinning:H.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:I,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:at,decodeVideoTexture:Ke&&w.map.isVideoTexture===!0&&Ct.getTransfer(w.map.colorSpace)===Ot,decodeVideoTextureEmissive:qe&&w.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(w.emissiveMap.colorSpace)===Ot,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===pt,flipSided:w.side===gn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:We&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&w.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return It.vertexUv1s=c.has(1),It.vertexUv2s=c.has(2),It.vertexUv3s=c.has(3),c.clear(),It}function d(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const L in w.defines)S.push(L),S.push(w.defines[L]);return w.isRawShaderMaterial===!1&&(_(S,w),v(S,w),S.push(n.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function _(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function v(w,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),w.push(o.mask)}function y(w){const S=x[w.type];let L;if(S){const F=si[S];L=Kr.clone(F.uniforms)}else L=w.uniforms;return L}function E(w,S){let L;for(let F=0,H=u.length;F<H;F++){const Q=u[F];if(Q.cacheKey===S){L=Q,++L.usedTimes;break}}return L===void 0&&(L=new C1(n,S,w,r),u.push(L)),L}function T(w){if(--w.usedTimes===0){const S=u.indexOf(w);u[S]=u[u.length-1],u.pop(),w.destroy()}}function C(w){l.remove(w)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:C,programs:u,dispose:R}}function I1(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function U1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function dd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ud(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f,m,p,x,M,g){let d=n[e];return d===void 0?(d={id:f.id,object:f,geometry:m,material:p,groupOrder:x,renderOrder:f.renderOrder,z:M,group:g},n[e]=d):(d.id=f.id,d.object=f,d.geometry=m,d.material=p,d.groupOrder=x,d.renderOrder=f.renderOrder,d.z=M,d.group=g),e++,d}function o(f,m,p,x,M,g){const d=a(f,m,p,x,M,g);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):t.push(d)}function l(f,m,p,x,M,g){const d=a(f,m,p,x,M,g);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function c(f,m){t.length>1&&t.sort(f||U1),i.length>1&&i.sort(m||dd),s.length>1&&s.sort(m||dd)}function u(){for(let f=e,m=n.length;f<m;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function F1(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new ud,n.set(i,[a])):s>=r.length?(a=new ud,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function N1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new it};break;case"SpotLight":t={position:new P,direction:new P,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new it,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new it,groundColor:new it};break;case"RectAreaLight":t={color:new it,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function z1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let O1=0;function B1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function k1(n){const e=new N1,t=z1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const s=new P,r=new Tt,a=new Tt;function o(c){let u=0,f=0,m=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,x=0,M=0,g=0,d=0,_=0,v=0,y=0,E=0,T=0,C=0;c.sort(B1);for(let w=0,S=c.length;w<S;w++){const L=c[w],F=L.color,H=L.intensity,Q=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=F.r*H,f+=F.g*H,m+=F.b*H;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],H);C++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.directionalShadow[p]=ne,i.directionalShadowMap[p]=te,i.directionalShadowMatrix[p]=L.shadow.matrix,_++}i.directional[p]=q,p++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(F).multiplyScalar(H),q.distance=Q,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const Z=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,Z.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[M]=Z.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,y++}M++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(F).multiplyScalar(H),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=q,g++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,ne.shadowCameraNear=Z.camera.near,ne.shadowCameraFar=Z.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=L.shadow.matrix,v++}i.point[x]=q,x++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(H),q.groundColor.copy(L.groundColor).multiplyScalar(H),i.hemi[d]=q,d++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Oe.LTC_FLOAT_1,i.rectAreaLTC2=Oe.LTC_FLOAT_2):(i.rectAreaLTC1=Oe.LTC_HALF_1,i.rectAreaLTC2=Oe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=m;const R=i.hash;(R.directionalLength!==p||R.pointLength!==x||R.spotLength!==M||R.rectAreaLength!==g||R.hemiLength!==d||R.numDirectionalShadows!==_||R.numPointShadows!==v||R.numSpotShadows!==y||R.numSpotMaps!==E||R.numLightProbes!==C)&&(i.directional.length=p,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=d,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=y+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,R.directionalLength=p,R.pointLength=x,R.spotLength=M,R.rectAreaLength=g,R.hemiLength=d,R.numDirectionalShadows=_,R.numPointShadows=v,R.numSpotShadows=y,R.numSpotMaps=E,R.numLightProbes=C,i.version=O1++)}function l(c,u){let f=0,m=0,p=0,x=0,M=0;const g=u.matrixWorldInverse;for(let d=0,_=c.length;d<_;d++){const v=c[d];if(v.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(v.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),p++}else if(v.isRectAreaLight){const y=i.rectArea[x];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(v.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){const y=i.point[m];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),m++}else if(v.isHemisphereLight){const y=i.hemi[M];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(g),M++}}}return{setup:o,setupView:l,state:i}}function fd(n){const e=new k1(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function V1(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new fd(n),e.set(s,[o])):r>=a.length?(o=new fd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const G1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,H1=`uniform sampler2D shadow_pass;
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
}`;function W1(n,e,t){let i=new Fc;const s=new Ee,r=new Ee,a=new kt,o=new dp({depthPacking:Pf}),l=new up,c={},u=t.maxTextureSize,f={[Zi]:gn,[gn]:Zi,[pt]:pt},m=new un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:G1,fragmentShader:H1}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const x=new Wt;x.setAttribute("position",new Dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new O(x,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Dd;let d=this.type;this.render=function(T,C,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const w=n.getRenderTarget(),S=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),F=n.state;F.setBlending(ci),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const H=d!==Si&&this.type===Si,Q=d===Si&&this.type!==Si;for(let te=0,q=T.length;te<q;te++){const Z=T[te],ne=Z.shadow;if(ne===void 0){dt("WebGLShadowMap:",Z,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const de=ne.getFrameExtents();if(s.multiply(de),r.copy(ne.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/de.x),s.x=r.x*de.x,ne.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/de.y),s.y=r.y*de.y,ne.mapSize.y=r.y)),ne.map===null||H===!0||Q===!0){const Ve=this.type!==Si?{minFilter:Ln,magFilter:Ln}:{};ne.map!==null&&ne.map.dispose(),ne.map=new Qn(s.x,s.y,Ve),ne.map.texture.name=Z.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const pe=ne.getViewportCount();for(let Ve=0;Ve<pe;Ve++){const I=ne.getViewport(Ve);a.set(r.x*I.x,r.y*I.y,r.x*I.z,r.y*I.w),F.viewport(a),ne.updateMatrices(Z,Ve),i=ne.getFrustum(),y(C,R,ne.camera,Z,this.type)}ne.isPointLightShadow!==!0&&this.type===Si&&_(ne,R),ne.needsUpdate=!1}d=this.type,g.needsUpdate=!1,n.setRenderTarget(w,S,L)};function _(T,C){const R=e.update(M);m.defines.VSM_SAMPLES!==T.blurSamples&&(m.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Qn(s.x,s.y)),m.uniforms.shadow_pass.value=T.map.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,R,m,M,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,R,p,M,null)}function v(T,C,R,w){let S=null;const L=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)S=L;else if(S=R.isPointLight===!0?l:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=S.uuid,H=C.uuid;let Q=c[F];Q===void 0&&(Q={},c[F]=Q);let te=Q[H];te===void 0&&(te=S.clone(),Q[H]=te,C.addEventListener("dispose",E)),S=te}if(S.visible=C.visible,S.wireframe=C.wireframe,w===Si?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:f[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,R.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=n.properties.get(S);F.light=R}return S}function y(T,C,R,w,S){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Si)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const H=e.update(T),Q=T.material;if(Array.isArray(Q)){const te=H.groups;for(let q=0,Z=te.length;q<Z;q++){const ne=te[q],de=Q[ne.materialIndex];if(de&&de.visible){const pe=v(T,de,w,S);T.onBeforeShadow(n,T,C,R,H,pe,ne),n.renderBufferDirect(R,null,H,pe,T,ne),T.onAfterShadow(n,T,C,R,H,pe,ne)}}}else if(Q.visible){const te=v(T,Q,w,S);T.onBeforeShadow(n,T,C,R,H,te,null),n.renderBufferDirect(R,null,H,te,T,null),T.onAfterShadow(n,T,C,R,H,te,null)}}const F=T.children;for(let H=0,Q=F.length;H<Q;H++)y(F[H],C,R,w,S)}function E(T){T.target.removeEventListener("dispose",E);for(const R in c){const w=c[R],S=T.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const X1={[vl]:_l,[Ml]:bl,[yl]:wl,[er]:Sl,[_l]:vl,[bl]:Ml,[wl]:yl,[Sl]:er};function q1(n,e){function t(){let G=!1;const ze=new kt;let Ie=null;const Ce=new kt(0,0,0,0);return{setMask:function(ve){Ie!==ve&&!G&&(n.colorMask(ve,ve,ve,ve),Ie=ve)},setLocked:function(ve){G=ve},setClear:function(ve,ue,We,at,It){It===!0&&(ve*=at,ue*=at,We*=at),ze.set(ve,ue,We,at),Ce.equals(ze)===!1&&(n.clearColor(ve,ue,We,at),Ce.copy(ze))},reset:function(){G=!1,Ie=null,Ce.set(-1,0,0,0)}}}function i(){let G=!1,ze=!1,Ie=null,Ce=null,ve=null;return{setReversed:function(ue){if(ze!==ue){const We=e.get("EXT_clip_control");ue?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),ze=ue;const at=ve;ve=null,this.setClear(at)}},getReversed:function(){return ze},setTest:function(ue){ue?K(n.DEPTH_TEST):xe(n.DEPTH_TEST)},setMask:function(ue){Ie!==ue&&!G&&(n.depthMask(ue),Ie=ue)},setFunc:function(ue){if(ze&&(ue=X1[ue]),Ce!==ue){switch(ue){case vl:n.depthFunc(n.NEVER);break;case _l:n.depthFunc(n.ALWAYS);break;case Ml:n.depthFunc(n.LESS);break;case er:n.depthFunc(n.LEQUAL);break;case yl:n.depthFunc(n.EQUAL);break;case Sl:n.depthFunc(n.GEQUAL);break;case bl:n.depthFunc(n.GREATER);break;case wl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ce=ue}},setLocked:function(ue){G=ue},setClear:function(ue){ve!==ue&&(ze&&(ue=1-ue),n.clearDepth(ue),ve=ue)},reset:function(){G=!1,Ie=null,Ce=null,ve=null,ze=!1}}}function s(){let G=!1,ze=null,Ie=null,Ce=null,ve=null,ue=null,We=null,at=null,It=null;return{setTest:function(At){G||(At?K(n.STENCIL_TEST):xe(n.STENCIL_TEST))},setMask:function(At){ze!==At&&!G&&(n.stencilMask(At),ze=At)},setFunc:function(At,Mn,fn){(Ie!==At||Ce!==Mn||ve!==fn)&&(n.stencilFunc(At,Mn,fn),Ie=At,Ce=Mn,ve=fn)},setOp:function(At,Mn,fn){(ue!==At||We!==Mn||at!==fn)&&(n.stencilOp(At,Mn,fn),ue=At,We=Mn,at=fn)},setLocked:function(At){G=At},setClear:function(At){It!==At&&(n.clearStencil(At),It=At)},reset:function(){G=!1,ze=null,Ie=null,Ce=null,ve=null,ue=null,We=null,at=null,It=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},f={},m=new WeakMap,p=[],x=null,M=!1,g=null,d=null,_=null,v=null,y=null,E=null,T=null,C=new it(0,0,0),R=0,w=!1,S=null,L=null,F=null,H=null,Q=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Z=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=Z>=1):ne.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=Z>=2);let de=null,pe={};const Ve=n.getParameter(n.SCISSOR_BOX),I=n.getParameter(n.VIEWPORT),we=new kt().fromArray(Ve),ge=new kt().fromArray(I);function Te(G,ze,Ie,Ce){const ve=new Uint8Array(4),ue=n.createTexture();n.bindTexture(G,ue),n.texParameteri(G,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(G,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let We=0;We<Ie;We++)G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?n.texImage3D(ze,0,n.RGBA,1,1,Ce,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(ze+We,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return ue}const $={};$[n.TEXTURE_2D]=Te(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Te(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Te(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Te(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(n.DEPTH_TEST),a.setFunc(er),ft(!1),ut(nh),K(n.CULL_FACE),Pt(ci);function K(G){u[G]!==!0&&(n.enable(G),u[G]=!0)}function xe(G){u[G]!==!1&&(n.disable(G),u[G]=!1)}function Me(G,ze){return f[G]!==ze?(n.bindFramebuffer(G,ze),f[G]=ze,G===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ze),G===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ze),!0):!1}function Ue(G,ze){let Ie=p,Ce=!1;if(G){Ie=m.get(ze),Ie===void 0&&(Ie=[],m.set(ze,Ie));const ve=G.textures;if(Ie.length!==ve.length||Ie[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,We=ve.length;ue<We;ue++)Ie[ue]=n.COLOR_ATTACHMENT0+ue;Ie.length=ve.length,Ce=!0}}else Ie[0]!==n.BACK&&(Ie[0]=n.BACK,Ce=!0);Ce&&n.drawBuffers(Ie)}function Ke(G){return x!==G?(n.useProgram(G),x=G,!0):!1}const Dt={[ls]:n.FUNC_ADD,[cf]:n.FUNC_SUBTRACT,[hf]:n.FUNC_REVERSE_SUBTRACT};Dt[df]=n.MIN,Dt[uf]=n.MAX;const Je={[ff]:n.ZERO,[pf]:n.ONE,[mf]:n.SRC_COLOR,[xl]:n.SRC_ALPHA,[yf]:n.SRC_ALPHA_SATURATE,[_f]:n.DST_COLOR,[gf]:n.DST_ALPHA,[xf]:n.ONE_MINUS_SRC_COLOR,[gl]:n.ONE_MINUS_SRC_ALPHA,[Mf]:n.ONE_MINUS_DST_COLOR,[vf]:n.ONE_MINUS_DST_ALPHA,[Sf]:n.CONSTANT_COLOR,[bf]:n.ONE_MINUS_CONSTANT_COLOR,[wf]:n.CONSTANT_ALPHA,[Tf]:n.ONE_MINUS_CONSTANT_ALPHA};function Pt(G,ze,Ie,Ce,ve,ue,We,at,It,At){if(G===ci){M===!0&&(xe(n.BLEND),M=!1);return}if(M===!1&&(K(n.BLEND),M=!0),G!==lf){if(G!==g||At!==w){if((d!==ls||y!==ls)&&(n.blendEquation(n.FUNC_ADD),d=ls,y=ls),At)switch(G){case Zs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kn:n.blendFunc(n.ONE,n.ONE);break;case ih:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case sh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Kt("WebGLState: Invalid blending: ",G);break}else switch(G){case Zs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ih:Kt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sh:Kt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Kt("WebGLState: Invalid blending: ",G);break}_=null,v=null,E=null,T=null,C.set(0,0,0),R=0,g=G,w=At}return}ve=ve||ze,ue=ue||Ie,We=We||Ce,(ze!==d||ve!==y)&&(n.blendEquationSeparate(Dt[ze],Dt[ve]),d=ze,y=ve),(Ie!==_||Ce!==v||ue!==E||We!==T)&&(n.blendFuncSeparate(Je[Ie],Je[Ce],Je[ue],Je[We]),_=Ie,v=Ce,E=ue,T=We),(at.equals(C)===!1||It!==R)&&(n.blendColor(at.r,at.g,at.b,It),C.copy(at),R=It),g=G,w=!1}function B(G,ze){G.side===pt?xe(n.CULL_FACE):K(n.CULL_FACE);let Ie=G.side===gn;ze&&(Ie=!Ie),ft(Ie),G.blending===Zs&&G.transparent===!1?Pt(ci):Pt(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),r.setMask(G.colorWrite);const Ce=G.stencilWrite;o.setTest(Ce),Ce&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),qe(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):xe(n.SAMPLE_ALPHA_TO_COVERAGE)}function ft(G){S!==G&&(G?n.frontFace(n.CW):n.frontFace(n.CCW),S=G)}function ut(G){G!==af?(K(n.CULL_FACE),G!==L&&(G===nh?n.cullFace(n.BACK):G===of?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):xe(n.CULL_FACE),L=G}function Lt(G){G!==F&&(q&&n.lineWidth(G),F=G)}function qe(G,ze,Ie){G?(K(n.POLYGON_OFFSET_FILL),(H!==ze||Q!==Ie)&&(n.polygonOffset(ze,Ie),H=ze,Q=Ie)):xe(n.POLYGON_OFFSET_FILL)}function Ft(G){G?K(n.SCISSOR_TEST):xe(n.SCISSOR_TEST)}function et(G){G===void 0&&(G=n.TEXTURE0+te-1),de!==G&&(n.activeTexture(G),de=G)}function ht(G,ze,Ie){Ie===void 0&&(de===null?Ie=n.TEXTURE0+te-1:Ie=de);let Ce=pe[Ie];Ce===void 0&&(Ce={type:void 0,texture:void 0},pe[Ie]=Ce),(Ce.type!==G||Ce.texture!==ze)&&(de!==Ie&&(n.activeTexture(Ie),de=Ie),n.bindTexture(G,ze||$[G]),Ce.type=G,Ce.texture=ze)}function D(){const G=pe[de];G!==void 0&&G.type!==void 0&&(n.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function A(){try{n.compressedTexImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function ce(){try{n.texSubImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function fe(){try{n.texSubImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function $e(){try{n.compressedTexSubImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function Ae(){try{n.texStorage2D(...arguments)}catch(G){G("WebGLState:",G)}}function je(){try{n.texStorage3D(...arguments)}catch(G){G("WebGLState:",G)}}function Ge(){try{n.texImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function me(){try{n.texImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function ye(G){we.equals(G)===!1&&(n.scissor(G.x,G.y,G.z,G.w),we.copy(G))}function st(G){ge.equals(G)===!1&&(n.viewport(G.x,G.y,G.z,G.w),ge.copy(G))}function tt(G,ze){let Ie=c.get(ze);Ie===void 0&&(Ie=new WeakMap,c.set(ze,Ie));let Ce=Ie.get(G);Ce===void 0&&(Ce=n.getUniformBlockIndex(ze,G.name),Ie.set(G,Ce))}function Be(G,ze){const Ce=c.get(ze).get(G);l.get(ze)!==Ce&&(n.uniformBlockBinding(ze,Ce,G.__bindingPointIndex),l.set(ze,Ce))}function rt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},de=null,pe={},f={},m=new WeakMap,p=[],x=null,M=!1,g=null,d=null,_=null,v=null,y=null,E=null,T=null,C=new it(0,0,0),R=0,w=!1,S=null,L=null,F=null,H=null,Q=null,we.set(0,0,n.canvas.width,n.canvas.height),ge.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:xe,bindFramebuffer:Me,drawBuffers:Ue,useProgram:Ke,setBlending:Pt,setMaterial:B,setFlipSided:ft,setCullFace:ut,setLineWidth:Lt,setPolygonOffset:qe,setScissorTest:Ft,activeTexture:et,bindTexture:ht,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:Ge,texImage3D:me,updateUBOMapping:tt,uniformBlockBinding:Be,texStorage2D:Ae,texStorage3D:je,texSubImage2D:ce,texSubImage3D:fe,compressedTexSubImage2D:re,compressedTexSubImage3D:$e,scissor:ye,viewport:st,reset:rt}}function Y1(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ee,u=new WeakMap;let f;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(D,A){return p?new OffscreenCanvas(D,A):eo("canvas")}function M(D,A,J){let ce=1;const fe=ht(D);if((fe.width>J||fe.height>J)&&(ce=J/Math.max(fe.width,fe.height)),ce<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const re=Math.floor(ce*fe.width),$e=Math.floor(ce*fe.height);f===void 0&&(f=x(re,$e));const Ae=A?x(re,$e):f;return Ae.width=re,Ae.height=$e,Ae.getContext("2d").drawImage(D,0,0,re,$e),dt("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+re+"x"+$e+")."),Ae}else return"data"in D&&dt("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),D;return D}function g(D){return D.generateMipmaps}function d(D){n.generateMipmap(D)}function _(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(D,A,J,ce,fe=!1){if(D!==null){if(n[D]!==void 0)return n[D];dt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let re=A;if(A===n.RED&&(J===n.FLOAT&&(re=n.R32F),J===n.HALF_FLOAT&&(re=n.R16F),J===n.UNSIGNED_BYTE&&(re=n.R8)),A===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.R8UI),J===n.UNSIGNED_SHORT&&(re=n.R16UI),J===n.UNSIGNED_INT&&(re=n.R32UI),J===n.BYTE&&(re=n.R8I),J===n.SHORT&&(re=n.R16I),J===n.INT&&(re=n.R32I)),A===n.RG&&(J===n.FLOAT&&(re=n.RG32F),J===n.HALF_FLOAT&&(re=n.RG16F),J===n.UNSIGNED_BYTE&&(re=n.RG8)),A===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RG8UI),J===n.UNSIGNED_SHORT&&(re=n.RG16UI),J===n.UNSIGNED_INT&&(re=n.RG32UI),J===n.BYTE&&(re=n.RG8I),J===n.SHORT&&(re=n.RG16I),J===n.INT&&(re=n.RG32I)),A===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGB8UI),J===n.UNSIGNED_SHORT&&(re=n.RGB16UI),J===n.UNSIGNED_INT&&(re=n.RGB32UI),J===n.BYTE&&(re=n.RGB8I),J===n.SHORT&&(re=n.RGB16I),J===n.INT&&(re=n.RGB32I)),A===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),J===n.UNSIGNED_INT&&(re=n.RGBA32UI),J===n.BYTE&&(re=n.RGBA8I),J===n.SHORT&&(re=n.RGBA16I),J===n.INT&&(re=n.RGBA32I)),A===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),A===n.RGBA){const $e=fe?ja:Ct.getTransfer(ce);J===n.FLOAT&&(re=n.RGBA32F),J===n.HALF_FLOAT&&(re=n.RGBA16F),J===n.UNSIGNED_BYTE&&(re=$e===Ot?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function y(D,A){let J;return D?A===null||A===vs||A===Xr?J=n.DEPTH24_STENCIL8:A===ai?J=n.DEPTH32F_STENCIL8:A===Wr&&(J=n.DEPTH24_STENCIL8,dt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===vs||A===Xr?J=n.DEPTH_COMPONENT24:A===ai?J=n.DEPTH_COMPONENT32F:A===Wr&&(J=n.DEPTH_COMPONENT16),J}function E(D,A){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==Ln&&D.minFilter!==Vn?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function T(D){const A=D.target;A.removeEventListener("dispose",T),R(A),A.isVideoTexture&&u.delete(A)}function C(D){const A=D.target;A.removeEventListener("dispose",C),S(A)}function R(D){const A=i.get(D);if(A.__webglInit===void 0)return;const J=D.source,ce=m.get(J);if(ce){const fe=ce[A.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&w(D),Object.keys(ce).length===0&&m.delete(J)}i.remove(D)}function w(D){const A=i.get(D);n.deleteTexture(A.__webglTexture);const J=D.source,ce=m.get(J);delete ce[A.__cacheKey],a.memory.textures--}function S(D){const A=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(A.__webglFramebuffer[ce]))for(let fe=0;fe<A.__webglFramebuffer[ce].length;fe++)n.deleteFramebuffer(A.__webglFramebuffer[ce][fe]);else n.deleteFramebuffer(A.__webglFramebuffer[ce]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ce])}else{if(Array.isArray(A.__webglFramebuffer))for(let ce=0;ce<A.__webglFramebuffer.length;ce++)n.deleteFramebuffer(A.__webglFramebuffer[ce]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ce=0;ce<A.__webglColorRenderbuffer.length;ce++)A.__webglColorRenderbuffer[ce]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ce]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=D.textures;for(let ce=0,fe=J.length;ce<fe;ce++){const re=i.get(J[ce]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),a.memory.textures--),i.remove(J[ce])}i.remove(D)}let L=0;function F(){L=0}function H(){const D=L;return D>=s.maxTextures&&dt("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function Q(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function te(D,A){const J=i.get(D);if(D.isVideoTexture&&Ft(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const ce=D.image;if(ce===null)dt("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)dt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,D,A);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+A)}function q(D,A){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+A)}function Z(D,A){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+A)}function ne(D,A){const J=i.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+A)}const de={[_n]:n.REPEAT,[Ci]:n.CLAMP_TO_EDGE,[Al]:n.MIRRORED_REPEAT},pe={[Ln]:n.NEAREST,[Cf]:n.NEAREST_MIPMAP_NEAREST,[da]:n.NEAREST_MIPMAP_LINEAR,[Vn]:n.LINEAR,[To]:n.LINEAR_MIPMAP_NEAREST,[hs]:n.LINEAR_MIPMAP_LINEAR},Ve={[Df]:n.NEVER,[Of]:n.ALWAYS,[If]:n.LESS,[Yd]:n.LEQUAL,[Uf]:n.EQUAL,[zf]:n.GEQUAL,[Ff]:n.GREATER,[Nf]:n.NOTEQUAL};function I(D,A){if(A.type===ai&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Vn||A.magFilter===To||A.magFilter===da||A.magFilter===hs||A.minFilter===Vn||A.minFilter===To||A.minFilter===da||A.minFilter===hs)&&dt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,de[A.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,de[A.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,de[A.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,pe[A.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,pe[A.minFilter]),A.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Ve[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Ln||A.minFilter!==da&&A.minFilter!==hs||A.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function we(D,A){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",T));const ce=A.source;let fe=m.get(ce);fe===void 0&&(fe={},m.set(ce,fe));const re=Q(A);if(re!==D.__cacheKey){fe[re]===void 0&&(fe[re]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,J=!0),fe[re].usedTimes++;const $e=fe[D.__cacheKey];$e!==void 0&&(fe[D.__cacheKey].usedTimes--,$e.usedTimes===0&&w(A)),D.__cacheKey=re,D.__webglTexture=fe[re].texture}return J}function ge(D,A,J){return Math.floor(Math.floor(D/J)/A)}function Te(D,A,J,ce){const re=D.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,J,ce,A.data);else{re.sort((me,ye)=>me.start-ye.start);let $e=0;for(let me=1;me<re.length;me++){const ye=re[$e],st=re[me],tt=ye.start+ye.count,Be=ge(st.start,A.width,4),rt=ge(ye.start,A.width,4);st.start<=tt+1&&Be===rt&&ge(st.start+st.count-1,A.width,4)===Be?ye.count=Math.max(ye.count,st.start+st.count-ye.start):(++$e,re[$e]=st)}re.length=$e+1;const Ae=n.getParameter(n.UNPACK_ROW_LENGTH),je=n.getParameter(n.UNPACK_SKIP_PIXELS),Ge=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let me=0,ye=re.length;me<ye;me++){const st=re[me],tt=Math.floor(st.start/4),Be=Math.ceil(st.count/4),rt=tt%A.width,G=Math.floor(tt/A.width),ze=Be,Ie=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,rt),n.pixelStorei(n.UNPACK_SKIP_ROWS,G),t.texSubImage2D(n.TEXTURE_2D,0,rt,G,ze,Ie,J,ce,A.data)}D.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Ae),n.pixelStorei(n.UNPACK_SKIP_PIXELS,je),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ge)}}function $(D,A,J){let ce=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ce=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ce=n.TEXTURE_3D);const fe=we(D,A),re=A.source;t.bindTexture(ce,D.__webglTexture,n.TEXTURE0+J);const $e=i.get(re);if(re.version!==$e.__version||fe===!0){t.activeTexture(n.TEXTURE0+J);const Ae=Ct.getPrimaries(Ct.workingColorSpace),je=A.colorSpace===Gi?null:Ct.getPrimaries(A.colorSpace),Ge=A.colorSpace===Gi||Ae===je?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);let me=M(A.image,!1,s.maxTextureSize);me=et(A,me);const ye=r.convert(A.format,A.colorSpace),st=r.convert(A.type);let tt=v(A.internalFormat,ye,st,A.colorSpace,A.isVideoTexture);I(ce,A);let Be;const rt=A.mipmaps,G=A.isVideoTexture!==!0,ze=$e.__version===void 0||fe===!0,Ie=re.dataReady,Ce=E(A,me);if(A.isDepthTexture)tt=y(A.format===Yr,A.type),ze&&(G?t.texStorage2D(n.TEXTURE_2D,1,tt,me.width,me.height):t.texImage2D(n.TEXTURE_2D,0,tt,me.width,me.height,0,ye,st,null));else if(A.isDataTexture)if(rt.length>0){G&&ze&&t.texStorage2D(n.TEXTURE_2D,Ce,tt,rt[0].width,rt[0].height);for(let ve=0,ue=rt.length;ve<ue;ve++)Be=rt[ve],G?Ie&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Be.width,Be.height,ye,st,Be.data):t.texImage2D(n.TEXTURE_2D,ve,tt,Be.width,Be.height,0,ye,st,Be.data);A.generateMipmaps=!1}else G?(ze&&t.texStorage2D(n.TEXTURE_2D,Ce,tt,me.width,me.height),Ie&&Te(A,me,ye,st)):t.texImage2D(n.TEXTURE_2D,0,tt,me.width,me.height,0,ye,st,me.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){G&&ze&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ce,tt,rt[0].width,rt[0].height,me.depth);for(let ve=0,ue=rt.length;ve<ue;ve++)if(Be=rt[ve],A.format!==Jn)if(ye!==null)if(G){if(Ie)if(A.layerUpdates.size>0){const We=Xh(Be.width,Be.height,A.format,A.type);for(const at of A.layerUpdates){const It=Be.data.subarray(at*We/Be.data.BYTES_PER_ELEMENT,(at+1)*We/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,at,Be.width,Be.height,1,ye,It)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Be.width,Be.height,me.depth,ye,Be.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ve,tt,Be.width,Be.height,me.depth,0,Be.data,0,0);else dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Ie&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Be.width,Be.height,me.depth,ye,st,Be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ve,tt,Be.width,Be.height,me.depth,0,ye,st,Be.data)}else{G&&ze&&t.texStorage2D(n.TEXTURE_2D,Ce,tt,rt[0].width,rt[0].height);for(let ve=0,ue=rt.length;ve<ue;ve++)Be=rt[ve],A.format!==Jn?ye!==null?G?Ie&&t.compressedTexSubImage2D(n.TEXTURE_2D,ve,0,0,Be.width,Be.height,ye,Be.data):t.compressedTexImage2D(n.TEXTURE_2D,ve,tt,Be.width,Be.height,0,Be.data):dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Ie&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Be.width,Be.height,ye,st,Be.data):t.texImage2D(n.TEXTURE_2D,ve,tt,Be.width,Be.height,0,ye,st,Be.data)}else if(A.isDataArrayTexture)if(G){if(ze&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ce,tt,me.width,me.height,me.depth),Ie)if(A.layerUpdates.size>0){const ve=Xh(me.width,me.height,A.format,A.type);for(const ue of A.layerUpdates){const We=me.data.subarray(ue*ve/me.data.BYTES_PER_ELEMENT,(ue+1)*ve/me.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ue,me.width,me.height,1,ye,st,We)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,ye,st,me.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,tt,me.width,me.height,me.depth,0,ye,st,me.data);else if(A.isData3DTexture)G?(ze&&t.texStorage3D(n.TEXTURE_3D,Ce,tt,me.width,me.height,me.depth),Ie&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,ye,st,me.data)):t.texImage3D(n.TEXTURE_3D,0,tt,me.width,me.height,me.depth,0,ye,st,me.data);else if(A.isFramebufferTexture){if(ze)if(G)t.texStorage2D(n.TEXTURE_2D,Ce,tt,me.width,me.height);else{let ve=me.width,ue=me.height;for(let We=0;We<Ce;We++)t.texImage2D(n.TEXTURE_2D,We,tt,ve,ue,0,ye,st,null),ve>>=1,ue>>=1}}else if(rt.length>0){if(G&&ze){const ve=ht(rt[0]);t.texStorage2D(n.TEXTURE_2D,Ce,tt,ve.width,ve.height)}for(let ve=0,ue=rt.length;ve<ue;ve++)Be=rt[ve],G?Ie&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,ye,st,Be):t.texImage2D(n.TEXTURE_2D,ve,tt,ye,st,Be);A.generateMipmaps=!1}else if(G){if(ze){const ve=ht(me);t.texStorage2D(n.TEXTURE_2D,Ce,tt,ve.width,ve.height)}Ie&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ye,st,me)}else t.texImage2D(n.TEXTURE_2D,0,tt,ye,st,me);g(A)&&d(ce),$e.__version=re.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function K(D,A,J){if(A.image.length!==6)return;const ce=we(D,A),fe=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+J);const re=i.get(fe);if(fe.version!==re.__version||ce===!0){t.activeTexture(n.TEXTURE0+J);const $e=Ct.getPrimaries(Ct.workingColorSpace),Ae=A.colorSpace===Gi?null:Ct.getPrimaries(A.colorSpace),je=A.colorSpace===Gi||$e===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);const Ge=A.isCompressedTexture||A.image[0].isCompressedTexture,me=A.image[0]&&A.image[0].isDataTexture,ye=[];for(let ue=0;ue<6;ue++)!Ge&&!me?ye[ue]=M(A.image[ue],!0,s.maxCubemapSize):ye[ue]=me?A.image[ue].image:A.image[ue],ye[ue]=et(A,ye[ue]);const st=ye[0],tt=r.convert(A.format,A.colorSpace),Be=r.convert(A.type),rt=v(A.internalFormat,tt,Be,A.colorSpace),G=A.isVideoTexture!==!0,ze=re.__version===void 0||ce===!0,Ie=fe.dataReady;let Ce=E(A,st);I(n.TEXTURE_CUBE_MAP,A);let ve;if(Ge){G&&ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ce,rt,st.width,st.height);for(let ue=0;ue<6;ue++){ve=ye[ue].mipmaps;for(let We=0;We<ve.length;We++){const at=ve[We];A.format!==Jn?tt!==null?G?Ie&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,0,0,at.width,at.height,tt,at.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,rt,at.width,at.height,0,at.data):dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,0,0,at.width,at.height,tt,Be,at.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,rt,at.width,at.height,0,tt,Be,at.data)}}}else{if(ve=A.mipmaps,G&&ze){ve.length>0&&Ce++;const ue=ht(ye[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ce,rt,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(me){G?Ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,ye[ue].width,ye[ue].height,tt,Be,ye[ue].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,rt,ye[ue].width,ye[ue].height,0,tt,Be,ye[ue].data);for(let We=0;We<ve.length;We++){const It=ve[We].image[ue].image;G?Ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,0,0,It.width,It.height,tt,Be,It.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,rt,It.width,It.height,0,tt,Be,It.data)}}else{G?Ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,tt,Be,ye[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,rt,tt,Be,ye[ue]);for(let We=0;We<ve.length;We++){const at=ve[We];G?Ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,0,0,tt,Be,at.image[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,rt,tt,Be,at.image[ue])}}}g(A)&&d(n.TEXTURE_CUBE_MAP),re.__version=fe.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function xe(D,A,J,ce,fe,re){const $e=r.convert(J.format,J.colorSpace),Ae=r.convert(J.type),je=v(J.internalFormat,$e,Ae,J.colorSpace),Ge=i.get(A),me=i.get(J);if(me.__renderTarget=A,!Ge.__hasExternalTextures){const ye=Math.max(1,A.width>>re),st=Math.max(1,A.height>>re);fe===n.TEXTURE_3D||fe===n.TEXTURE_2D_ARRAY?t.texImage3D(fe,re,je,ye,st,A.depth,0,$e,Ae,null):t.texImage2D(fe,re,je,ye,st,0,$e,Ae,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),qe(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ce,fe,me.__webglTexture,0,Lt(A)):(fe===n.TEXTURE_2D||fe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ce,fe,me.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Me(D,A,J){if(n.bindRenderbuffer(n.RENDERBUFFER,D),A.depthBuffer){const ce=A.depthTexture,fe=ce&&ce.isDepthTexture?ce.type:null,re=y(A.stencilBuffer,fe),$e=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ae=Lt(A);qe(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ae,re,A.width,A.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae,re,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,re,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,$e,n.RENDERBUFFER,D)}else{const ce=A.textures;for(let fe=0;fe<ce.length;fe++){const re=ce[fe],$e=r.convert(re.format,re.colorSpace),Ae=r.convert(re.type),je=v(re.internalFormat,$e,Ae,re.colorSpace),Ge=Lt(A);J&&qe(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ge,je,A.width,A.height):qe(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ge,je,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,je,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ue(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=i.get(A.depthTexture);ce.__renderTarget=A,(!ce.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),te(A.depthTexture,0);const fe=ce.__webglTexture,re=Lt(A);if(A.depthTexture.format===qr)qe(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,fe,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,fe,0);else if(A.depthTexture.format===Yr)qe(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,fe,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,fe,0);else throw new Error("Unknown depthTexture format")}function Ke(D){const A=i.get(D),J=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const ce=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ce){const fe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ce.removeEventListener("dispose",fe)};ce.addEventListener("dispose",fe),A.__depthDisposeCallback=fe}A.__boundDepthTexture=ce}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ce=D.texture.mipmaps;ce&&ce.length>0?Ue(A.__webglFramebuffer[0],D):Ue(A.__webglFramebuffer,D)}else if(J){A.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ce]),A.__webglDepthbuffer[ce]===void 0)A.__webglDepthbuffer[ce]=n.createRenderbuffer(),Me(A.__webglDepthbuffer[ce],D,!1);else{const fe=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer[ce];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,re)}}else{const ce=D.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),Me(A.__webglDepthbuffer,D,!1);else{const fe=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Dt(D,A,J){const ce=i.get(D);A!==void 0&&xe(ce.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&Ke(D)}function Je(D){const A=D.texture,J=i.get(D),ce=i.get(A);D.addEventListener("dispose",C);const fe=D.textures,re=D.isWebGLCubeRenderTarget===!0,$e=fe.length>1;if($e||(ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture()),ce.__version=A.version,a.memory.textures++),re){J.__webglFramebuffer=[];for(let Ae=0;Ae<6;Ae++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Ae]=[];for(let je=0;je<A.mipmaps.length;je++)J.__webglFramebuffer[Ae][je]=n.createFramebuffer()}else J.__webglFramebuffer[Ae]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Ae=0;Ae<A.mipmaps.length;Ae++)J.__webglFramebuffer[Ae]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if($e)for(let Ae=0,je=fe.length;Ae<je;Ae++){const Ge=i.get(fe[Ae]);Ge.__webglTexture===void 0&&(Ge.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&qe(D)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Ae=0;Ae<fe.length;Ae++){const je=fe[Ae];J.__webglColorRenderbuffer[Ae]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Ae]);const Ge=r.convert(je.format,je.colorSpace),me=r.convert(je.type),ye=v(je.internalFormat,Ge,me,je.colorSpace,D.isXRRenderTarget===!0),st=Lt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,st,ye,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,J.__webglColorRenderbuffer[Ae])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),Me(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ce.__webglTexture),I(n.TEXTURE_CUBE_MAP,A);for(let Ae=0;Ae<6;Ae++)if(A.mipmaps&&A.mipmaps.length>0)for(let je=0;je<A.mipmaps.length;je++)xe(J.__webglFramebuffer[Ae][je],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,je);else xe(J.__webglFramebuffer[Ae],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0);g(A)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if($e){for(let Ae=0,je=fe.length;Ae<je;Ae++){const Ge=fe[Ae],me=i.get(Ge);let ye=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ye=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ye,me.__webglTexture),I(ye,Ge),xe(J.__webglFramebuffer,D,Ge,n.COLOR_ATTACHMENT0+Ae,ye,0),g(Ge)&&d(ye)}t.unbindTexture()}else{let Ae=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ae=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ae,ce.__webglTexture),I(Ae,A),A.mipmaps&&A.mipmaps.length>0)for(let je=0;je<A.mipmaps.length;je++)xe(J.__webglFramebuffer[je],D,A,n.COLOR_ATTACHMENT0,Ae,je);else xe(J.__webglFramebuffer,D,A,n.COLOR_ATTACHMENT0,Ae,0);g(A)&&d(Ae),t.unbindTexture()}D.depthBuffer&&Ke(D)}function Pt(D){const A=D.textures;for(let J=0,ce=A.length;J<ce;J++){const fe=A[J];if(g(fe)){const re=_(D),$e=i.get(fe).__webglTexture;t.bindTexture(re,$e),d(re),t.unbindTexture()}}}const B=[],ft=[];function ut(D){if(D.samples>0){if(qe(D)===!1){const A=D.textures,J=D.width,ce=D.height;let fe=n.COLOR_BUFFER_BIT;const re=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$e=i.get(D),Ae=A.length>1;if(Ae)for(let Ge=0;Ge<A.length;Ge++)t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,$e.__webglMultisampledFramebuffer);const je=D.texture.mipmaps;je&&je.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Ge=0;Ge<A.length;Ge++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(fe|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(fe|=n.STENCIL_BUFFER_BIT)),Ae){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,$e.__webglColorRenderbuffer[Ge]);const me=i.get(A[Ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,me,0)}n.blitFramebuffer(0,0,J,ce,0,0,J,ce,fe,n.NEAREST),l===!0&&(B.length=0,ft.length=0,B.push(n.COLOR_ATTACHMENT0+Ge),D.depthBuffer&&D.resolveDepthBuffer===!1&&(B.push(re),ft.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ft)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ae)for(let Ge=0;Ge<A.length;Ge++){t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.RENDERBUFFER,$e.__webglColorRenderbuffer[Ge]);const me=i.get(A[Ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ge,n.TEXTURE_2D,me,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const A=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Lt(D){return Math.min(s.maxSamples,D.samples)}function qe(D){const A=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ft(D){const A=a.render.frame;u.get(D)!==A&&(u.set(D,A),D.update())}function et(D,A){const J=D.colorSpace,ce=D.format,fe=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==ir&&J!==Gi&&(Ct.getTransfer(J)===Ot?(ce!==Jn||fe!==fi)&&dt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Kt("WebGLTextures: Unsupported texture color space:",J)),A}function ht(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=F,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=Z,this.setTextureCube=ne,this.rebindTextures=Dt,this.setupRenderTarget=Je,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=ut,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=qe}function $1(n,e){function t(i,s=Gi){let r;const a=Ct.getTransfer(s);if(i===fi)return n.UNSIGNED_BYTE;if(i===Sc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Hd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Wd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Vd)return n.BYTE;if(i===Gd)return n.SHORT;if(i===Wr)return n.UNSIGNED_SHORT;if(i===yc)return n.INT;if(i===vs)return n.UNSIGNED_INT;if(i===ai)return n.FLOAT;if(i===hi)return n.HALF_FLOAT;if(i===Xd)return n.ALPHA;if(i===qd)return n.RGB;if(i===Jn)return n.RGBA;if(i===qr)return n.DEPTH_COMPONENT;if(i===Yr)return n.DEPTH_STENCIL;if(i===wc)return n.RED;if(i===Tc)return n.RED_INTEGER;if(i===Ec)return n.RG;if(i===Ac)return n.RG_INTEGER;if(i===Cc)return n.RGBA_INTEGER;if(i===Xa||i===qa||i===Ya||i===$a)if(a===Ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Xa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Xa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===qa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ya)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===$a)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Cl||i===Rl||i===Pl||i===Ll)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Pl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ll)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Dl||i===Il||i===Ul)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Dl||i===Il)return a===Ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ul)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Fl||i===Nl||i===zl||i===Ol||i===Bl||i===kl||i===Vl||i===Gl||i===Hl||i===Wl||i===Xl||i===ql||i===Yl||i===$l)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Fl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Nl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===zl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ol)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Bl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===kl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Vl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Gl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Hl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Wl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Xl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ql)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Yl)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===$l)return a===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Zl||i===Kl||i===Jl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Zl)return a===Ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Jl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===jl||i===Ql||i===ec||i===tc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===jl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ql)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ec)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===tc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Z1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,K1=`
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

}`;class J1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new ou(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new un({vertexShader:Z1,fragmentShader:K1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new O(new Ht(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class j1 extends cr{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,m=null,p=null,x=null;const M=typeof XRWebGLBinding<"u",g=new J1,d={},_=t.getContextAttributes();let v=null,y=null;const E=[],T=[],C=new Ee;let R=null;const w=new Rn;w.viewport=new kt;const S=new Rn;S.viewport=new kt;const L=[w,S],F=new xp;let H=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new qo,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new qo,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new qo,E[$]=K),K.getHandSpace()};function te($){const K=T.indexOf($.inputSource);if(K===-1)return;const xe=E[K];xe!==void 0&&(xe.update($.inputSource,$.frame,c||a),xe.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}H=null,Q=null,g.reset();for(const $ in d)delete d[$];e.setRenderTarget(v),p=null,m=null,f=null,s=null,y=null,Te.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&dt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&dt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),_.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,Me=null,Ue=null;_.depth&&(Ue=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=_.stencil?Yr:qr,Me=_.stencil?Xr:vs);const Ke={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};f=this.getBinding(),m=f.createProjectionLayer(Ke),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),y=new Qn(m.textureWidth,m.textureHeight,{format:Jn,type:fi,depthTexture:new au(m.textureWidth,m.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const xe={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,xe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Qn(p.framebufferWidth,p.framebufferHeight,{format:Jn,type:fi,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Te.setContext(s),Te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z($){for(let K=0;K<$.removed.length;K++){const xe=$.removed[K],Me=T.indexOf(xe);Me>=0&&(T[Me]=null,E[Me].disconnect(xe))}for(let K=0;K<$.added.length;K++){const xe=$.added[K];let Me=T.indexOf(xe);if(Me===-1){for(let Ke=0;Ke<E.length;Ke++)if(Ke>=T.length){T.push(xe),Me=Ke;break}else if(T[Ke]===null){T[Ke]=xe,Me=Ke;break}if(Me===-1)break}const Ue=E[Me];Ue&&Ue.connect(xe)}}const ne=new P,de=new P;function pe($,K,xe){ne.setFromMatrixPosition(K.matrixWorld),de.setFromMatrixPosition(xe.matrixWorld);const Me=ne.distanceTo(de),Ue=K.projectionMatrix.elements,Ke=xe.projectionMatrix.elements,Dt=Ue[14]/(Ue[10]-1),Je=Ue[14]/(Ue[10]+1),Pt=(Ue[9]+1)/Ue[5],B=(Ue[9]-1)/Ue[5],ft=(Ue[8]-1)/Ue[0],ut=(Ke[8]+1)/Ke[0],Lt=Dt*ft,qe=Dt*ut,Ft=Me/(-ft+ut),et=Ft*-ft;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(et),$.translateZ(Ft),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ue[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ht=Dt+Ft,D=Je+Ft,A=Lt-et,J=qe+(Me-et),ce=Pt*Je/D*ht,fe=B*Je/D*ht;$.projectionMatrix.makePerspective(A,J,ce,fe,ht,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ve($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,xe=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(xe=g.depthFar)),F.near=S.near=w.near=K,F.far=S.far=w.far=xe,(H!==F.near||Q!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),H=F.near,Q=F.far),F.layers.mask=$.layers.mask|6,w.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const Me=$.parent,Ue=F.cameras;Ve(F,Me);for(let Ke=0;Ke<Ue.length;Ke++)Ve(Ue[Ke],Me);Ue.length===2?pe(F,w,S):F.projectionMatrix.copy(w.projectionMatrix),I($,F,Me)};function I($,K,xe){xe===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(xe.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Zr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(m===null&&p===null))return l},this.setFoveation=function($){l=$,m!==null&&(m.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function($){return d[$]};let we=null;function ge($,K){if(u=K.getViewerPose(c||a),x=K,u!==null){const xe=u.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let Me=!1;xe.length!==F.cameras.length&&(F.cameras.length=0,Me=!0);for(let Je=0;Je<xe.length;Je++){const Pt=xe[Je];let B=null;if(p!==null)B=p.getViewport(Pt);else{const ut=f.getViewSubImage(m,Pt);B=ut.viewport,Je===0&&(e.setRenderTargetTextures(y,ut.colorTexture,ut.depthStencilTexture),e.setRenderTarget(y))}let ft=L[Je];ft===void 0&&(ft=new Rn,ft.layers.enable(Je),ft.viewport=new kt,L[Je]=ft),ft.matrix.fromArray(Pt.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(Pt.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(B.x,B.y,B.width,B.height),Je===0&&(F.matrix.copy(ft.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Me===!0&&F.cameras.push(ft)}const Ue=s.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=i.getBinding();const Je=f.getDepthInformation(xe[0]);Je&&Je.isValid&&Je.texture&&g.init(Je,s.renderState)}if(Ue&&Ue.includes("camera-access")&&M){e.state.unbindTexture(),f=i.getBinding();for(let Je=0;Je<xe.length;Je++){const Pt=xe[Je].camera;if(Pt){let B=d[Pt];B||(B=new ou,d[Pt]=B);const ft=f.getCameraImage(Pt);B.sourceTexture=ft}}}}for(let xe=0;xe<E.length;xe++){const Me=T[xe],Ue=E[xe];Me!==null&&Ue!==void 0&&Ue.update(Me,K,c||a)}we&&we($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Te=new vu;Te.setAnimationLoop(ge),this.setAnimationLoop=function($){we=$},this.dispose=function(){}}}const is=new ei,Q1=new Tt;function ev(n,e){function t(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function i(g,d){d.color.getRGB(g.fogColor.value,Qd(n)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function s(g,d,_,v,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(g,d):d.isMeshToonMaterial?(r(g,d),f(g,d)):d.isMeshPhongMaterial?(r(g,d),u(g,d)):d.isMeshStandardMaterial?(r(g,d),m(g,d),d.isMeshPhysicalMaterial&&p(g,d,y)):d.isMeshMatcapMaterial?(r(g,d),x(g,d)):d.isMeshDepthMaterial?r(g,d):d.isMeshDistanceMaterial?(r(g,d),M(g,d)):d.isMeshNormalMaterial?r(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?l(g,d,_,v):d.isSpriteMaterial?c(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,t(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,t(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===gn&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,t(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===gn&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,t(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,t(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const _=e.get(d),v=_.envMap,y=_.envMapRotation;v&&(g.envMap.value=v,is.copy(y),is.x*=-1,is.y*=-1,is.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),g.envMapRotation.value.setFromMatrix4(Q1.makeRotationFromEuler(is)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,t(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,_,v){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*_,g.scale.value=v*.5,d.map&&(g.map.value=d.map,t(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function c(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,t(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function u(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function f(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function m(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function p(g,d,_){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===gn&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,d){d.matcap&&(g.matcap.value=d.matcap)}function M(g,d){const _=e.get(d).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function tv(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,v){const y=v.program;i.uniformBlockBinding(_,y)}function c(_,v){let y=s[_.id];y===void 0&&(x(_),y=u(_),s[_.id]=y,_.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(_,E);const T=e.render.frame;r[_.id]!==T&&(m(_),r[_.id]=T)}function u(_){const v=f();_.__bindingPointIndex=v;const y=n.createBuffer(),E=_.__size,T=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,y),y}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Kt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(_){const v=s[_.id],y=_.uniforms,E=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,C=y.length;T<C;T++){const R=Array.isArray(y[T])?y[T]:[y[T]];for(let w=0,S=R.length;w<S;w++){const L=R[w];if(p(L,T,w,E)===!0){const F=L.__offset,H=Array.isArray(L.value)?L.value:[L.value];let Q=0;for(let te=0;te<H.length;te++){const q=H[te],Z=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,F+Q,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,Q),Q+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(_,v,y,E){const T=_.value,C=v+"_"+y;if(E[C]===void 0)return typeof T=="number"||typeof T=="boolean"?E[C]=T:E[C]=T.clone(),!0;{const R=E[C];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[C]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function x(_){const v=_.uniforms;let y=0;const E=16;for(let C=0,R=v.length;C<R;C++){const w=Array.isArray(v[C])?v[C]:[v[C]];for(let S=0,L=w.length;S<L;S++){const F=w[S],H=Array.isArray(F.value)?F.value:[F.value];for(let Q=0,te=H.length;Q<te;Q++){const q=H[Q],Z=M(q),ne=y%E,de=ne%Z.boundary,pe=ne+de;y+=de,pe!==0&&E-pe<Z.storage&&(y+=E-pe),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Z.storage}}}const T=y%E;return T>0&&(y+=E-T),_.__size=y,_.__cache={},this}function M(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?dt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):dt("WebGLRenderer: Unsupported uniform value type.",_),v}function g(_){const v=_.target;v.removeEventListener("dispose",g);const y=a.indexOf(v.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(const _ in s)n.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}const nv=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let yi=null;function iv(){return yi===null&&(yi=new ru(nv,32,32,Ec,hi),yi.minFilter=Vn,yi.magFilter=Vn,yi.wrapS=Ci,yi.wrapT=Ci,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}class sv{constructor(e={}){const{canvas:t=Bf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const x=new Set([Cc,Ac,Tc]),M=new Set([fi,vs,Wr,Xr,Sc,bc]),g=new Uint32Array(4),d=new Int32Array(4);let _=null,v=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let C=!1;this._outputColorSpace=Et;let R=0,w=0,S=null,L=-1,F=null;const H=new kt,Q=new kt;let te=null;const q=new it(0);let Z=0,ne=t.width,de=t.height,pe=1,Ve=null,I=null;const we=new kt(0,0,ne,de),ge=new kt(0,0,ne,de);let Te=!1;const $=new Fc;let K=!1,xe=!1;const Me=new Tt,Ue=new P,Ke=new kt,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Je=!1;function Pt(){return S===null?pe:1}let B=i;function ft(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vc}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",We,!1),B===null){const U="webgl2";if(B=ft(U,b),B===null)throw ft(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw b("WebGLRenderer: "+b.message),b}let ut,Lt,qe,Ft,et,ht,D,A,J,ce,fe,re,$e,Ae,je,Ge,me,ye,st,tt,Be,rt,G,ze;function Ie(){ut=new ug(B),ut.init(),rt=new $1(B,ut),Lt=new ig(B,ut,e,rt),qe=new q1(B,ut),Lt.reversedDepthBuffer&&m&&qe.buffers.depth.setReversed(!0),Ft=new mg(B),et=new I1,ht=new Y1(B,ut,qe,et,Lt,rt,Ft),D=new rg(T),A=new dg(T),J=new _p(B),G=new tg(B,J),ce=new fg(B,J,Ft,G),fe=new gg(B,ce,J,Ft),st=new xg(B,Lt,ht),Ge=new sg(et),re=new D1(T,D,A,ut,Lt,G,Ge),$e=new ev(T,et),Ae=new F1,je=new V1(ut),ye=new eg(T,D,A,qe,fe,p,l),me=new W1(T,fe,Lt),ze=new tv(B,Ft,Lt,qe),tt=new ng(B,ut,Ft),Be=new pg(B,ut,Ft),Ft.programs=re.programs,T.capabilities=Lt,T.extensions=ut,T.properties=et,T.renderLists=Ae,T.shadowMap=me,T.state=qe,T.info=Ft}Ie();const Ce=new j1(T,B);this.xr=Ce,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const b=ut.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ut.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return pe},this.setPixelRatio=function(b){b!==void 0&&(pe=b,this.setSize(ne,de,!1))},this.getSize=function(b){return b.set(ne,de)},this.setSize=function(b,U,V=!0){if(Ce.isPresenting){dt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=b,de=U,t.width=Math.floor(b*pe),t.height=Math.floor(U*pe),V===!0&&(t.style.width=b+"px",t.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(ne*pe,de*pe).floor()},this.setDrawingBufferSize=function(b,U,V){ne=b,de=U,pe=V,t.width=Math.floor(b*V),t.height=Math.floor(U*V),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(H)},this.getViewport=function(b){return b.copy(we)},this.setViewport=function(b,U,V,W){b.isVector4?we.set(b.x,b.y,b.z,b.w):we.set(b,U,V,W),qe.viewport(H.copy(we).multiplyScalar(pe).round())},this.getScissor=function(b){return b.copy(ge)},this.setScissor=function(b,U,V,W){b.isVector4?ge.set(b.x,b.y,b.z,b.w):ge.set(b,U,V,W),qe.scissor(Q.copy(ge).multiplyScalar(pe).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(b){qe.setScissorTest(Te=b)},this.setOpaqueSort=function(b){Ve=b},this.setTransparentSort=function(b){I=b},this.getClearColor=function(b){return b.copy(ye.getClearColor())},this.setClearColor=function(){ye.setClearColor(...arguments)},this.getClearAlpha=function(){return ye.getClearAlpha()},this.setClearAlpha=function(){ye.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,V=!0){let W=0;if(b){let k=!1;if(S!==null){const oe=S.texture.format;k=x.has(oe)}if(k){const oe=S.texture.type,ae=M.has(oe),j=ye.getClearColor(),he=ye.getClearAlpha(),Se=j.r,Ne=j.g,be=j.b;ae?(g[0]=Se,g[1]=Ne,g[2]=be,g[3]=he,B.clearBufferuiv(B.COLOR,0,g)):(d[0]=Se,d[1]=Ne,d[2]=be,d[3]=he,B.clearBufferiv(B.COLOR,0,d))}else W|=B.COLOR_BUFFER_BIT}U&&(W|=B.DEPTH_BUFFER_BIT),V&&(W|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",We,!1),ye.dispose(),Ae.dispose(),je.dispose(),et.dispose(),D.dispose(),A.dispose(),fe.dispose(),G.dispose(),ze.dispose(),re.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",la),Ce.removeEventListener("sessionend",pr),ti.stop()};function ve(b){b.preventDefault(),to("WebGLRenderer: Context Lost."),C=!0}function ue(){to("WebGLRenderer: Context Restored."),C=!1;const b=Ft.autoReset,U=me.enabled,V=me.autoUpdate,W=me.needsUpdate,k=me.type;Ie(),Ft.autoReset=b,me.enabled=U,me.autoUpdate=V,me.needsUpdate=W,me.type=k}function We(b){Kt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function at(b){const U=b.target;U.removeEventListener("dispose",at),It(U)}function It(b){At(b),et.remove(b)}function At(b){const U=et.get(b).programs;U!==void 0&&(U.forEach(function(V){re.releaseProgram(V)}),b.isShaderMaterial&&re.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,V,W,k,oe){U===null&&(U=Dt);const ae=k.isMesh&&k.matrixWorld.determinant()<0,j=N(b,U,V,W,k);qe.setMaterial(W,ae);let he=V.index,Se=1;if(W.wireframe===!0){if(he=ce.getWireframeAttribute(V),he===void 0)return;Se=2}const Ne=V.drawRange,be=V.attributes.position;let Re=Ne.start*Se,ot=(Ne.start+Ne.count)*Se;oe!==null&&(Re=Math.max(Re,oe.start*Se),ot=Math.min(ot,(oe.start+oe.count)*Se)),he!==null?(Re=Math.max(Re,0),ot=Math.min(ot,he.count)):be!=null&&(Re=Math.max(Re,0),ot=Math.min(ot,be.count));const mt=ot-Re;if(mt<0||mt===1/0)return;G.setup(k,W,j,V,he);let yt,xt=tt;if(he!==null&&(yt=J.get(he),xt=Be,xt.setIndex(yt)),k.isMesh)W.wireframe===!0?(qe.setLineWidth(W.wireframeLinewidth*Pt()),xt.setMode(B.LINES)):xt.setMode(B.TRIANGLES);else if(k.isLine){let He=W.linewidth;He===void 0&&(He=1),qe.setLineWidth(He*Pt()),k.isLineSegments?xt.setMode(B.LINES):k.isLineLoop?xt.setMode(B.LINE_LOOP):xt.setMode(B.LINE_STRIP)}else k.isPoints?xt.setMode(B.POINTS):k.isSprite&&xt.setMode(B.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)$r("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(ut.get("WEBGL_multi_draw"))xt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const He=k._multiDrawStarts,St=k._multiDrawCounts,lt=k._multiDrawCount,Xt=he?J.get(he).bytesPerElement:1,mi=et.get(W).currentProgram.getUniforms();for(let Yt=0;Yt<lt;Yt++)mi.setValue(B,"_gl_DrawID",Yt),xt.render(He[Yt]/Xt,St[Yt])}else if(k.isInstancedMesh)xt.renderInstances(Re,mt,k.count);else if(V.isInstancedBufferGeometry){const He=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,St=Math.min(V.instanceCount,He);xt.renderInstances(Re,mt,St)}else xt.render(Re,mt)};function Mn(b,U,V){b.transparent===!0&&b.side===pt&&b.forceSinglePass===!1?(b.side=gn,b.needsUpdate=!0,nn(b,U,V),b.side=Zi,b.needsUpdate=!0,nn(b,U,V),b.side=pt):nn(b,U,V)}this.compile=function(b,U,V=null){V===null&&(V=b),v=je.get(V),v.init(U),E.push(v),V.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),b!==V&&b.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),v.setupLights();const W=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const oe=k.material;if(oe)if(Array.isArray(oe))for(let ae=0;ae<oe.length;ae++){const j=oe[ae];Mn(j,V,k),W.add(j)}else Mn(oe,V,k),W.add(oe)}),v=E.pop(),W},this.compileAsync=function(b,U,V=null){const W=this.compile(b,U,V);return new Promise(k=>{function oe(){if(W.forEach(function(ae){et.get(ae).currentProgram.isReady()&&W.delete(ae)}),W.size===0){k(b);return}setTimeout(oe,10)}ut.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let fn=null;function Hn(b){fn&&fn(b)}function la(){ti.stop()}function pr(){ti.start()}const ti=new vu;ti.setAnimationLoop(Hn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(b){fn=b,Ce.setAnimationLoop(b),b===null?ti.stop():ti.start()},Ce.addEventListener("sessionstart",la),Ce.addEventListener("sessionend",pr),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Kt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(U),U=Ce.getCamera()),b.isScene===!0&&b.onBeforeRender(T,b,U,S),v=je.get(b,E.length),v.init(U),E.push(v),Me.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),$.setFromProjectionMatrix(Me,oi,U.reversedDepth),xe=this.localClippingEnabled,K=Ge.init(this.clippingPlanes,xe),_=Ae.get(b,y.length),_.init(),y.push(_),Ce.enabled===!0&&Ce.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&ni(oe,U,-1/0,T.sortObjects)}ni(b,U,0,T.sortObjects),_.finish(),T.sortObjects===!0&&_.sort(Ve,I),Je=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,Je&&ye.addToRenderList(_,b),this.info.render.frame++,K===!0&&Ge.beginShadows();const V=v.state.shadowsArray;me.render(V,b,U),K===!0&&Ge.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=_.opaque,k=_.transmissive;if(v.setupLights(),U.isArrayCamera){const oe=U.cameras;if(k.length>0)for(let ae=0,j=oe.length;ae<j;ae++){const he=oe[ae];mr(W,k,b,he)}Je&&ye.render(b);for(let ae=0,j=oe.length;ae<j;ae++){const he=oe[ae];ii(_,b,he,he.viewport)}}else k.length>0&&mr(W,k,b,U),Je&&ye.render(b),ii(_,b,U);S!==null&&w===0&&(ht.updateMultisampleRenderTarget(S),ht.updateRenderTargetMipmap(S)),b.isScene===!0&&b.onAfterRender(T,b,U),G.resetDefaultState(),L=-1,F=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&Ge.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,y.pop(),y.length>0?_=y[y.length-1]:_=null};function ni(b,U,V,W){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)V=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)v.pushLight(b),b.castShadow&&v.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||$.intersectsSprite(b)){W&&Ke.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Me);const ae=fe.update(b),j=b.material;j.visible&&_.push(b,ae,j,V,Ke.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||$.intersectsObject(b))){const ae=fe.update(b),j=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ke.copy(b.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),Ke.copy(ae.boundingSphere.center)),Ke.applyMatrix4(b.matrixWorld).applyMatrix4(Me)),Array.isArray(j)){const he=ae.groups;for(let Se=0,Ne=he.length;Se<Ne;Se++){const be=he[Se],Re=j[be.materialIndex];Re&&Re.visible&&_.push(b,ae,Re,V,Ke.z,be)}}else j.visible&&_.push(b,ae,j,V,Ke.z,null)}}const oe=b.children;for(let ae=0,j=oe.length;ae<j;ae++)ni(oe[ae],U,V,W)}function ii(b,U,V,W){const{opaque:k,transmissive:oe,transparent:ae}=b;v.setupLightsView(V),K===!0&&Ge.setGlobalState(T.clippingPlanes,V),W&&qe.viewport(H.copy(W)),k.length>0&&Es(k,U,V),oe.length>0&&Es(oe,U,V),ae.length>0&&Es(ae,U,V),qe.buffers.depth.setTest(!0),qe.buffers.depth.setMask(!0),qe.buffers.color.setMask(!0),qe.setPolygonOffset(!1)}function mr(b,U,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[W.id]===void 0&&(v.state.transmissionRenderTarget[W.id]=new Qn(1,1,{generateMipmaps:!0,type:ut.has("EXT_color_buffer_half_float")||ut.has("EXT_color_buffer_float")?hi:fi,minFilter:hs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace}));const oe=v.state.transmissionRenderTarget[W.id],ae=W.viewport||H;oe.setSize(ae.z*T.transmissionResolutionScale,ae.w*T.transmissionResolutionScale);const j=T.getRenderTarget(),he=T.getActiveCubeFace(),Se=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),Z=T.getClearAlpha(),Z<1&&T.setClearColor(16777215,.5),T.clear(),Je&&ye.render(V);const Ne=T.toneMapping;T.toneMapping=qi;const be=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),v.setupLightsView(W),K===!0&&Ge.setGlobalState(T.clippingPlanes,W),Es(b,V,W),ht.updateMultisampleRenderTarget(oe),ht.updateRenderTargetMipmap(oe),ut.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let ot=0,mt=U.length;ot<mt;ot++){const yt=U[ot],{object:xt,geometry:He,material:St,group:lt}=yt;if(St.side===pt&&xt.layers.test(W.layers)){const Xt=St.side;St.side=gn,St.needsUpdate=!0,ca(xt,V,W,He,St,lt),St.side=Xt,St.needsUpdate=!0,Re=!0}}Re===!0&&(ht.updateMultisampleRenderTarget(oe),ht.updateRenderTargetMipmap(oe))}T.setRenderTarget(j,he,Se),T.setClearColor(q,Z),be!==void 0&&(W.viewport=be),T.toneMapping=Ne}function Es(b,U,V){const W=U.isScene===!0?U.overrideMaterial:null;for(let k=0,oe=b.length;k<oe;k++){const ae=b[k],{object:j,geometry:he,group:Se}=ae;let Ne=ae.material;Ne.allowOverride===!0&&W!==null&&(Ne=W),j.layers.test(V.layers)&&ca(j,U,V,he,Ne,Se)}}function ca(b,U,V,W,k,oe){b.onBeforeRender(T,U,V,W,k,oe),b.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(T,U,V,W,b,oe),k.transparent===!0&&k.side===pt&&k.forceSinglePass===!1?(k.side=gn,k.needsUpdate=!0,T.renderBufferDirect(V,U,W,k,b,oe),k.side=Zi,k.needsUpdate=!0,T.renderBufferDirect(V,U,W,k,b,oe),k.side=pt):T.renderBufferDirect(V,U,W,k,b,oe),b.onAfterRender(T,U,V,W,k,oe)}function nn(b,U,V){U.isScene!==!0&&(U=Dt);const W=et.get(b),k=v.state.lights,oe=v.state.shadowsArray,ae=k.state.version,j=re.getParameters(b,k.state,oe,U,V),he=re.getProgramCacheKey(j);let Se=W.programs;W.environment=b.isMeshStandardMaterial?U.environment:null,W.fog=U.fog,W.envMap=(b.isMeshStandardMaterial?A:D).get(b.envMap||W.environment),W.envMapRotation=W.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Se===void 0&&(b.addEventListener("dispose",at),Se=new Map,W.programs=Se);let Ne=Se.get(he);if(Ne!==void 0){if(W.currentProgram===Ne&&W.lightsStateVersion===ae)return xr(b,j),Ne}else j.uniforms=re.getUniforms(b),b.onBeforeCompile(j,T),Ne=re.acquireProgram(j,he),Se.set(he,Ne),W.uniforms=j.uniforms;const be=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(be.clippingPlanes=Ge.uniform),xr(b,j),W.needsLights=Y(b),W.lightsStateVersion=ae,W.needsLights&&(be.ambientLightColor.value=k.state.ambient,be.lightProbe.value=k.state.probe,be.directionalLights.value=k.state.directional,be.directionalLightShadows.value=k.state.directionalShadow,be.spotLights.value=k.state.spot,be.spotLightShadows.value=k.state.spotShadow,be.rectAreaLights.value=k.state.rectArea,be.ltc_1.value=k.state.rectAreaLTC1,be.ltc_2.value=k.state.rectAreaLTC2,be.pointLights.value=k.state.point,be.pointLightShadows.value=k.state.pointShadow,be.hemisphereLights.value=k.state.hemi,be.directionalShadowMap.value=k.state.directionalShadowMap,be.directionalShadowMatrix.value=k.state.directionalShadowMatrix,be.spotShadowMap.value=k.state.spotShadowMap,be.spotLightMatrix.value=k.state.spotLightMatrix,be.spotLightMap.value=k.state.spotLightMap,be.pointShadowMap.value=k.state.pointShadowMap,be.pointShadowMatrix.value=k.state.pointShadowMatrix),W.currentProgram=Ne,W.uniformsList=null,Ne}function ha(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=Za.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function xr(b,U){const V=et.get(b);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function N(b,U,V,W,k){U.isScene!==!0&&(U=Dt),ht.resetTextureUnits();const oe=U.fog,ae=W.isMeshStandardMaterial?U.environment:null,j=S===null?T.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:ir,he=(W.isMeshStandardMaterial?A:D).get(W.envMap||ae),Se=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ne=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),be=!!V.morphAttributes.position,Re=!!V.morphAttributes.normal,ot=!!V.morphAttributes.color;let mt=qi;W.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(mt=T.toneMapping);const yt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,xt=yt!==void 0?yt.length:0,He=et.get(W),St=v.state.lights;if(K===!0&&(xe===!0||b!==F)){const yn=b===F&&W.id===L;Ge.setState(W,b,yn)}let lt=!1;W.version===He.__version?(He.needsLights&&He.lightsStateVersion!==St.state.version||He.outputColorSpace!==j||k.isBatchedMesh&&He.batching===!1||!k.isBatchedMesh&&He.batching===!0||k.isBatchedMesh&&He.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&He.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&He.instancing===!1||!k.isInstancedMesh&&He.instancing===!0||k.isSkinnedMesh&&He.skinning===!1||!k.isSkinnedMesh&&He.skinning===!0||k.isInstancedMesh&&He.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&He.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&He.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&He.instancingMorph===!1&&k.morphTexture!==null||He.envMap!==he||W.fog===!0&&He.fog!==oe||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==Ge.numPlanes||He.numIntersection!==Ge.numIntersection)||He.vertexAlphas!==Se||He.vertexTangents!==Ne||He.morphTargets!==be||He.morphNormals!==Re||He.morphColors!==ot||He.toneMapping!==mt||He.morphTargetsCount!==xt)&&(lt=!0):(lt=!0,He.__version=W.version);let Xt=He.currentProgram;lt===!0&&(Xt=nn(W,U,k));let mi=!1,Yt=!1,Un=!1;const Nt=Xt.getUniforms(),sn=He.uniforms;if(qe.useProgram(Xt.program)&&(mi=!0,Yt=!0,Un=!0),W.id!==L&&(L=W.id,Yt=!0),mi||F!==b){qe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Nt.setValue(B,"projectionMatrix",b.projectionMatrix),Nt.setValue(B,"viewMatrix",b.matrixWorldInverse);const Tn=Nt.map.cameraPosition;Tn!==void 0&&Tn.setValue(B,Ue.setFromMatrixPosition(b.matrixWorld)),Lt.logarithmicDepthBuffer&&Nt.setValue(B,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Nt.setValue(B,"isOrthographic",b.isOrthographicCamera===!0),F!==b&&(F=b,Yt=!0,Un=!0)}if(k.isSkinnedMesh){Nt.setOptional(B,k,"bindMatrix"),Nt.setOptional(B,k,"bindMatrixInverse");const yn=k.skeleton;yn&&(yn.boneTexture===null&&yn.computeBoneTexture(),Nt.setValue(B,"boneTexture",yn.boneTexture,ht))}k.isBatchedMesh&&(Nt.setOptional(B,k,"batchingTexture"),Nt.setValue(B,"batchingTexture",k._matricesTexture,ht),Nt.setOptional(B,k,"batchingIdTexture"),Nt.setValue(B,"batchingIdTexture",k._indirectTexture,ht),Nt.setOptional(B,k,"batchingColorTexture"),k._colorsTexture!==null&&Nt.setValue(B,"batchingColorTexture",k._colorsTexture,ht));const Fn=V.morphAttributes;if((Fn.position!==void 0||Fn.normal!==void 0||Fn.color!==void 0)&&st.update(k,V,Xt),(Yt||He.receiveShadow!==k.receiveShadow)&&(He.receiveShadow=k.receiveShadow,Nt.setValue(B,"receiveShadow",k.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(sn.envMap.value=he,sn.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&U.environment!==null&&(sn.envMapIntensity.value=U.environmentIntensity),sn.dfgLUT!==void 0&&(sn.dfgLUT.value=iv()),Yt&&(Nt.setValue(B,"toneMappingExposure",T.toneMappingExposure),He.needsLights&&z(sn,Un),oe&&W.fog===!0&&$e.refreshFogUniforms(sn,oe),$e.refreshMaterialUniforms(sn,W,pe,de,v.state.transmissionRenderTarget[b.id]),Za.upload(B,ha(He),sn,ht)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Za.upload(B,ha(He),sn,ht),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Nt.setValue(B,"center",k.center),Nt.setValue(B,"modelViewMatrix",k.modelViewMatrix),Nt.setValue(B,"normalMatrix",k.normalMatrix),Nt.setValue(B,"modelMatrix",k.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const yn=W.uniformsGroups;for(let Tn=0,wo=yn.length;Tn<wo;Tn++){const Ji=yn[Tn];ze.update(Ji,Xt),ze.bind(Ji,Xt)}}return Xt}function z(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Y(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(b,U,V){const W=et.get(b);W.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),et.get(b.texture).__webglTexture=U,et.get(b.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:V,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const V=et.get(b);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0};const ee=B.createFramebuffer();this.setRenderTarget=function(b,U=0,V=0){S=b,R=U,w=V;let W=!0,k=null,oe=!1,ae=!1;if(b){const he=et.get(b);if(he.__useDefaultFramebuffer!==void 0)qe.bindFramebuffer(B.FRAMEBUFFER,null),W=!1;else if(he.__webglFramebuffer===void 0)ht.setupRenderTarget(b);else if(he.__hasExternalTextures)ht.rebindTextures(b,et.get(b.texture).__webglTexture,et.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const be=b.depthTexture;if(he.__boundDepthTexture!==be){if(be!==null&&et.has(be)&&(b.width!==be.image.width||b.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ht.setupDepthRenderbuffer(b)}}const Se=b.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(ae=!0);const Ne=et.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ne[U])?k=Ne[U][V]:k=Ne[U],oe=!0):b.samples>0&&ht.useMultisampledRTT(b)===!1?k=et.get(b).__webglMultisampledFramebuffer:Array.isArray(Ne)?k=Ne[V]:k=Ne,H.copy(b.viewport),Q.copy(b.scissor),te=b.scissorTest}else H.copy(we).multiplyScalar(pe).floor(),Q.copy(ge).multiplyScalar(pe).floor(),te=Te;if(V!==0&&(k=ee),qe.bindFramebuffer(B.FRAMEBUFFER,k)&&W&&qe.drawBuffers(b,k),qe.viewport(H),qe.scissor(Q),qe.setScissorTest(te),oe){const he=et.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,he.__webglTexture,V)}else if(ae){const he=U;for(let Se=0;Se<b.textures.length;Se++){const Ne=et.get(b.textures[Se]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Se,Ne.__webglTexture,V,he)}}else if(b!==null&&V!==0){const he=et.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,he.__webglTexture,V)}L=-1},this.readRenderTargetPixels=function(b,U,V,W,k,oe,ae,j=0){if(!(b&&b.isWebGLRenderTarget)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=et.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he){qe.bindFramebuffer(B.FRAMEBUFFER,he);try{const Se=b.textures[j],Ne=Se.format,be=Se.type;if(!Lt.textureFormatReadable(Ne)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Lt.textureTypeReadable(be)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-W&&V>=0&&V<=b.height-k&&(b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+j),B.readPixels(U,V,W,k,rt.convert(Ne),rt.convert(be),oe))}finally{const Se=S!==null?et.get(S).__webglFramebuffer:null;qe.bindFramebuffer(B.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(b,U,V,W,k,oe,ae,j=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=et.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he)if(U>=0&&U<=b.width-W&&V>=0&&V<=b.height-k){qe.bindFramebuffer(B.FRAMEBUFFER,he);const Se=b.textures[j],Ne=Se.format,be=Se.type;if(!Lt.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Lt.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Re=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Re),B.bufferData(B.PIXEL_PACK_BUFFER,oe.byteLength,B.STREAM_READ),b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+j),B.readPixels(U,V,W,k,rt.convert(Ne),rt.convert(be),0);const ot=S!==null?et.get(S).__webglFramebuffer:null;qe.bindFramebuffer(B.FRAMEBUFFER,ot);const mt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await kf(B,mt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Re),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,oe),B.deleteBuffer(Re),B.deleteSync(mt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,V=0){const W=Math.pow(2,-V),k=Math.floor(b.image.width*W),oe=Math.floor(b.image.height*W),ae=U!==null?U.x:0,j=U!==null?U.y:0;ht.setTexture2D(b,0),B.copyTexSubImage2D(B.TEXTURE_2D,V,0,0,ae,j,k,oe),qe.unbindTexture()};const ie=B.createFramebuffer(),le=B.createFramebuffer();this.copyTextureToTexture=function(b,U,V=null,W=null,k=0,oe=null){oe===null&&(k!==0?($r("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=k,k=0):oe=0);let ae,j,he,Se,Ne,be,Re,ot,mt;const yt=b.isCompressedTexture?b.mipmaps[oe]:b.image;if(V!==null)ae=V.max.x-V.min.x,j=V.max.y-V.min.y,he=V.isBox3?V.max.z-V.min.z:1,Se=V.min.x,Ne=V.min.y,be=V.isBox3?V.min.z:0;else{const Fn=Math.pow(2,-k);ae=Math.floor(yt.width*Fn),j=Math.floor(yt.height*Fn),b.isDataArrayTexture?he=yt.depth:b.isData3DTexture?he=Math.floor(yt.depth*Fn):he=1,Se=0,Ne=0,be=0}W!==null?(Re=W.x,ot=W.y,mt=W.z):(Re=0,ot=0,mt=0);const xt=rt.convert(U.format),He=rt.convert(U.type);let St;U.isData3DTexture?(ht.setTexture3D(U,0),St=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ht.setTexture2DArray(U,0),St=B.TEXTURE_2D_ARRAY):(ht.setTexture2D(U,0),St=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);const lt=B.getParameter(B.UNPACK_ROW_LENGTH),Xt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),mi=B.getParameter(B.UNPACK_SKIP_PIXELS),Yt=B.getParameter(B.UNPACK_SKIP_ROWS),Un=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,yt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,yt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Se),B.pixelStorei(B.UNPACK_SKIP_ROWS,Ne),B.pixelStorei(B.UNPACK_SKIP_IMAGES,be);const Nt=b.isDataArrayTexture||b.isData3DTexture,sn=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const Fn=et.get(b),yn=et.get(U),Tn=et.get(Fn.__renderTarget),wo=et.get(yn.__renderTarget);qe.bindFramebuffer(B.READ_FRAMEBUFFER,Tn.__webglFramebuffer),qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,wo.__webglFramebuffer);for(let Ji=0;Ji<he;Ji++)Nt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,et.get(b).__webglTexture,k,be+Ji),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,et.get(U).__webglTexture,oe,mt+Ji)),B.blitFramebuffer(Se,Ne,ae,j,Re,ot,ae,j,B.DEPTH_BUFFER_BIT,B.NEAREST);qe.bindFramebuffer(B.READ_FRAMEBUFFER,null),qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(k!==0||b.isRenderTargetTexture||et.has(b)){const Fn=et.get(b),yn=et.get(U);qe.bindFramebuffer(B.READ_FRAMEBUFFER,ie),qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,le);for(let Tn=0;Tn<he;Tn++)Nt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Fn.__webglTexture,k,be+Tn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Fn.__webglTexture,k),sn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,yn.__webglTexture,oe,mt+Tn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,yn.__webglTexture,oe),k!==0?B.blitFramebuffer(Se,Ne,ae,j,Re,ot,ae,j,B.COLOR_BUFFER_BIT,B.NEAREST):sn?B.copyTexSubImage3D(St,oe,Re,ot,mt+Tn,Se,Ne,ae,j):B.copyTexSubImage2D(St,oe,Re,ot,Se,Ne,ae,j);qe.bindFramebuffer(B.READ_FRAMEBUFFER,null),qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else sn?b.isDataTexture||b.isData3DTexture?B.texSubImage3D(St,oe,Re,ot,mt,ae,j,he,xt,He,yt.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(St,oe,Re,ot,mt,ae,j,he,xt,yt.data):B.texSubImage3D(St,oe,Re,ot,mt,ae,j,he,xt,He,yt):b.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,oe,Re,ot,ae,j,xt,He,yt.data):b.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,oe,Re,ot,yt.width,yt.height,xt,yt.data):B.texSubImage2D(B.TEXTURE_2D,oe,Re,ot,ae,j,xt,He,yt);B.pixelStorei(B.UNPACK_ROW_LENGTH,lt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Xt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,mi),B.pixelStorei(B.UNPACK_SKIP_ROWS,Yt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Un),oe===0&&U.generateMipmaps&&B.generateMipmap(St),qe.unbindTexture()},this.initRenderTarget=function(b){et.get(b).__webglFramebuffer===void 0&&ht.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?ht.setTextureCube(b,0):b.isData3DTexture?ht.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?ht.setTexture2DArray(b,0):ht.setTexture2D(b,0),qe.unbindTexture()},this.resetState=function(){R=0,w=0,S=null,qe.reset(),G.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}function cc(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,l=new Wt;let c=0;for(let u=0;u<n.length;++u){const f=n[u];let m=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in f.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(f.attributes[p]),m++}if(m!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in f.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(f.morphAttributes[p])}if(e){let p;if(t)p=f.index.count;else if(f.attributes.position!==void 0)p=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,u),c+=p}}if(t){let u=0;const f=[];for(let m=0;m<n.length;++m){const p=n[m].index;for(let x=0;x<p.count;++x)f.push(p.getX(x)+u);u+=n[m].attributes.position.count}l.setIndex(f)}for(const u in r){const f=pd(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(const u in a){const f=a[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let m=0;m<f;++m){const p=[];for(let M=0;M<a[u].length;++M)p.push(a[u][M][m]);const x=pd(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(x)}}return l}function pd(n){let e,t,i,s=-1,r=0;for(let c=0;c<n.length;++c){const u=n[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const a=new e(r),o=new Dn(a,t,i);let l=0;for(let c=0;c<n.length;++c){const u=n[c];if(u.isInterleavedBufferAttribute){const f=l/t;for(let m=0,p=u.count;m<p;m++)for(let x=0;x<t;x++){const M=u.getComponent(m,x);o.setComponent(m+f,x,M)}}else a.set(u.array,l);l+=u.count*t}return s!==void 0&&(o.gpuType=s),o}class rv extends nu{constructor(){super();const e=new Le;e.deleteAttribute("uv");const t=new X({side:gn}),i=new X,s=new Gc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new O(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new Qt(e,i,6),o=new Vt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new O(e,qs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new O(e,qs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const u=new O(e,qs(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);const f=new O(e,qs(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const m=new O(e,qs(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new O(e,qs(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function qs(n){return new hp({color:0,emissive:16777215,emissiveIntensity:n})}const Ka={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ur{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const av=new Hc(-1,1,1,-1,0,1);class ov extends Wt{constructor(){super(),this.setAttribute("position",new Mt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Mt([0,2,0,0,2,0],2))}}const lv=new ov;class Wc{constructor(e){this._mesh=new O(lv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,av)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class bu extends ur{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof un?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Kr.clone(e.uniforms),this.material=new un({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Wc(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class md extends ur{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class cv extends ur{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class hv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Ee);this._width=i.width,this._height=i.height,t=new Qn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new bu(Ka),this.copyPass.material.blending=ci,this.clock=new gu}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}md!==void 0&&(a instanceof md?i=!0:a instanceof cv&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class dv extends ur{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new it}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const ka={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class uv extends ur{constructor(){super(),this.uniforms=Kr.clone(ka.uniforms),this.material=new cp({name:ka.name,uniforms:this.uniforms,vertexShader:ka.vertexShader,fragmentShader:ka.fragmentShader}),this._fsQuad=new Wc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ct.getTransfer(this._outputColorSpace)===Ot&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ud?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Fd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Nd?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Mc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Od?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Bd?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===zd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const fv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new it(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ar extends ur{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ee(e.x,e.y):new Ee(256,256),this.clearColor=new it(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Qn(r,a,{type:hi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new Qn(r,a,{type:hi});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const m=new Qn(r,a,{type:hi});m.texture.name="UnrealBloomPass.v"+u,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),a=Math.round(a/2)}const o=fv;this.highPassUniforms=Kr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new un({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Ee(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Kr.clone(Ka.uniforms),this.blendMaterial=new un({uniforms:this.copyUniforms,vertexShader:Ka.vertexShader,fragmentShader:Ka.fragmentShader,blending:Kn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new it,this._oldClearAlpha=1,this._basic=new bt,this._fsQuad=new Wc(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ee(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=ar.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ar.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new un({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ee(.5,.5)},direction:{value:new Ee(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
						diffuseSum += ( sample1 + sample2 ) * w;
					}
					gl_FragColor = vec4( diffuseSum, 1.0 );
				}`})}_getCompositeMaterial(e){return new un({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ar.BlurDirectionX=new Ee(1,0);ar.BlurDirectionY=new Ee(0,1);const ra=document.querySelector("#game"),Zt=new sv({canvas:ra,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),Xc=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;Zt.setPixelRatio(Math.min(window.devicePixelRatio,Xc?1.5:2));Zt.setSize(window.innerWidth,window.innerHeight);Zt.shadowMap.enabled=!Xc;Zt.info.autoReset=!1;Zt.shadowMap.type=Id;Zt.outputColorSpace=Et;Zt.toneMapping=Mc;Zt.toneMappingExposure=1.12;const Ze=new nu;window.__steelRibbonScene=Ze;Ze.background=new it(16764588);Ze.fog=new Uc(14719602,360,2150);const wu=new oc(Zt);wu.compileEquirectangularShader();Ze.environment=wu.fromScene(new rv,.04).texture;Ze.environmentIntensity=.58;const De=new Rn(69,window.innerWidth/window.innerHeight,.08,1800);Ze.add(De);const Ye={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const wt=new Set,Fe={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},pv=new gu,jt=new P(0,1,0),qc=new P,Tu=new P,vo=new P,cn=new Vt,Eu=.86,hc=1.2,mv=.78,Gn=.55,zt={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ys=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],Au=Math.max(...ys.map(n=>n.width));let Yi=0,se=ys[0];const h={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Ye.best.textContent=`Best score ${h.best}`;let jn=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Li(){const n=h.mode==="race"||h.mode==="paused"||h.mode==="result";document.body.classList.toggle("chase-mode",n&&jn==="chase"),document.body.classList.toggle("menu-mode",h.mode==="menu")}Li();function xv(){jn=jn==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",jn),Li(),h.message=jn==="chase"?"Chase camera":"Cockpit camera",h.messageTimer=.9}const Va=[];function ms(n,e=!1){let t=Va.find(s=>!s.busy);t||(Va.length>=4?t=Va[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),Va.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Ss(n=880,e=.16,t="triangle",i=.16){if(!Xe)return;const{ctx:s}=Xe,r=s.createOscillator(),a=s.createGain();r.type=t,r.frequency.setValueAtTime(n,s.currentTime),r.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),a.gain.setValueAtTime(i,s.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),r.connect(a).connect(Xe.master||s.destination),r.start(),r.stop(s.currentTime+e+.06)}function gv(n){const e=_e.clamp(n,0,1);return e*e*(3-2*e)}function vv(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,r=i.start+i.carry,a=i.end+i.settle;e>=s&&e<=r?t+=i.rise*_e.clamp((e-s)/(i.approach+i.carry),0,1):e>r&&e<=i.end?t+=i.rise:e>i.end&&e<=a&&(t+=i.rise*(1-gv((e-i.end)/i.settle)))}return t}function Yc(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,r=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,a=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:r,z:a,t:i,n:t}}function Cu(n,e){const{t,n:i}=Yc(n,e),s=n.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of n.ramps){let o=i-a.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=vv(n,i),r}function Ga(n){const{x:e,z:t,n:i}=Yc(se,n),s=Cu(se,i);return new P(e,s,t)}function ct(n){const e=(n%se.length+se.length)%se.length,t=Ga(e),i=Ga(e+2).sub(t).normalize(),s=qc.crossVectors(jt,i).normalize(),r=Ga(e-2).y,a=Ga(e+2).y,o=Math.atan2(a-r,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,c=se.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:l,gap:c}}function ui(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function xd(n){return _e.clamp(n/(se.length*se.laps),0,1)}function ol(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let r=i;r<=s;r++){const a=r*se.length+t;if(n<a&&e>=a)return!0}return!1}function _v(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)i.fillStyle=(o+a)%2?"#101318":"#f5f1df",i.fillRect(o*s,a*s,s,s);const r=new en(t);return r.colorSpace=Et,r.wrapS=_n,r.wrapT=_n,r.repeat.set(3,1),r}function Mv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<n;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(n,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Et,s.wrapS=_n,s.wrapT=_n,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function yv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-n;r<n*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+n*.65,n),t.stroke();const s=new en(e);return s.colorSpace=Et,s.wrapS=_n,s.wrapT=_n,s.repeat.set(18,18),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function Sv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#263139"),i.addColorStop(.45,"#3a444a"),i.addColorStop(1,"#1b242c"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-n;r<n*2;r+=78)t.beginPath(),t.moveTo(r,0),t.lineTo(r+n*.32,n),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*n,o=Math.random()*n,l=10+Math.random()*56,c=t.createRadialGradient(a,o,0,a,o,l);c.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),c.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),c.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=c,t.beginPath(),t.ellipse(a,o,l,l*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*n,o=Math.random()*n;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<9200;r++){const a=36+Math.floor(Math.random()*110),o=.035+Math.random()*.075,l=Math.random()<.18?2:1;t.fillStyle=`rgba(${a}, ${a+3}, ${a+7}, ${o})`,t.fillRect(Math.random()*n,Math.random()*n,l,l)}const s=new en(e);return s.colorSpace=Et,s.wrapS=_n,s.wrapT=_n,s.repeat.set(9,16),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function bv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new en(e);return s.colorSpace=Et,s}function Ys(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<n;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new en(i);return r.colorSpace=Et,r}function wv(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let l=0;l<1700;l++){const c=180+Math.random()*60;s.fillStyle=`rgba(${c}, ${c}, ${c-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const a=(l,c,u,f)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(l,c,u,f),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(l,c,u,f),s.lineWidth=2,s.beginPath(),s.moveTo(l+u*.5,c+2),s.lineTo(l+u*.5,c+f-2),s.moveTo(l+2,c+f*.52),s.lineTo(l+u-2,c+f*.52),s.stroke()};a(n*.12,e*.24,n*.19,e*.2),a(n*.68,e*.25,n*.2,e*.2),a(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new en(i);return o.colorSpace=Et,o.wrapS=_n,o.wrapT=_n,o.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),o}function Tv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<n+20;r+=26){t.beginPath();for(let a=-10;a<n+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<n;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,n*.24,r-8,n*.58,r+7,n),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Et,s.wrapS=_n,s.wrapT=_n,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function Ev(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let a=18;a<e;a+=24)i.beginPath(),i.moveTo(8,a),i.lineTo(n-8,a),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const r=new en(t);return r.colorSpace=Et,r}function gd(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=i?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),i&&r.rotate(-Math.PI/2),r.font=`900 ${i?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(n,0,0),r.restore();const l=new en(s);return l.colorSpace=Et,l}const Bi=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],ro=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],ki=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function Ru(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new en(i);return a.colorSpace=Et,a.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),a}function ll(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new en(t);return s.colorSpace=Et,s}function cl(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,n,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let l=18;l<e;l+=22){r.beginPath(),r.moveTo(0,l),r.lineTo(n,l),r.stroke();for(let c=Math.floor(l/22)%2*28;c<n;c+=56)r.beginPath(),r.moveTo(c,l-18),r.lineTo(c,l),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,n-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let l=58;l<n-48;l+=78)r.fillRect(l,e*.62,52,e*.19);r.fillStyle=i,r.fillRect(22,e*.49,n-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=i,r.shadowBlur=12,r.fillText("OPEN",n/2,e*.28,n*.76),r.shadowBlur=0;const o=new en(s);return o.colorSpace=Et,o.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),o}function Av(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let r=18;r<e;r+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,r,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,r+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let r=0;r<n;r+=64)i.beginPath(),i.moveTo(r,0),i.lineTo(r,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new en(t);return s.colorSpace=Et,s.anisotropy=Math.min(16,Zt.capabilities.getMaxAnisotropy()),s}function Cv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,r=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const l=-Math.PI/8+o*Math.PI/4,c=i+Math.cos(l)*r,u=s+Math.sin(l)*r;o===0?t.moveTo(c,u):t.lineTo(c,u)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const a=new en(e);return a.colorSpace=Et,a}function Pe(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function ds(n,e,t,i){const s=t*.5,r=i*.5;let a=Pe(n,e);for(const o of[-s,0,s])for(const l of[-r,0,r])a=Math.min(a,Pe(n+o,e+l));return a}function _o(n,e,t=10){const{x0:i,x1:s,zNear:r,zFar:a,pitch:o,streetW:l}=zt;if(n<i-l||n>s+l||e<a-l||e>r+l)return!1;const c=Math.abs((n-i+o/2)%o-o/2),u=Math.abs((r-e+o/2)%o-o/2);return Math.min(c,u)<l*.5+t}const Wi={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function On(n,e,t,i,s=8){const{x0:r,x1:a,zNear:o,zFar:l,pitch:c,streetW:u}=zt,f=t*.5,m=i*.5,p=u*.5+s;let x=null;const M=(g,d,_)=>{(!x||_>x.overlap)&&(x={axis:g,road:d,overlap:_})};for(let g=r;g<=a+1;g+=c){if(e+m<l-p||e-m>o+p)continue;const d=f+p-Math.abs(n-g);d>0&&M("x",Math.round(g),d)}for(let g=o;g>=l-1;g-=c){if(n+f<r-p||n-f>a+p)continue;const d=m+p-Math.abs(e-g);d>0&&M("z",Math.round(g),d)}return x}const or=[],Pu=[];function Lu(n=1){const e=new un({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScale;
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r2 = dot(p, p);
        vec2 q = p * uScale;
        float w = sin(q.x * 21.0 + uTime * 1.5) * 0.5
                + sin(q.y * 17.0 - uTime * 1.15) * 0.5
                + sin((q.x + q.y) * 13.0 + uTime * 2.1) * 0.35
                + sin(length(q) * 30.0 - uTime * 2.6) * 0.25;
        vec3 deep = vec3(0.035, 0.1, 0.19);
        vec3 sky = vec3(0.62, 0.42, 0.36);
        vec3 col = mix(deep, sky, clamp(0.1 + 0.09 * w + 0.16 * r2, 0.0, 1.0));
        float sparkle = pow(max(0.0, sin(q.x * 29.0 + q.y * 23.0 + uTime * 3.0) * w), 8.0);
        col += vec3(1.0, 0.72, 0.45) * sparkle * 0.14;
        float alpha = 0.94 * smoothstep(1.0, 0.84, r2);
        gl_FragColor = vec4(col, alpha);
      }`});return Pu.push(e),e}function Du(n,e,t,i=t){or.push({x:n,z:e,rx:t,rz:i})}function Rv(n,e){let t=0,i=null;for(const s of or){const r=(n-s.x)/s.rx,a=(e-s.z)/s.rz,o=r*r+a*a;if(o<1){const l=Math.pow(1-o,1.35);l>t&&(t=l,i=s)}}return{depth:t,pond:i}}const Or=[],hl=[],Iu=[];let ao=0;function Bn(n,e){return Iu.push({obj:n,update:e}),n}function Uu(n){ao+=n;for(const e of Iu)e.update(ao,n)}function Mo(){if(hl.length===0)for(let n=0;n<ys.length;n++){const e=ys[n];for(let t=0;t<e.length;t+=14){const i=Yc(e,t);hl.push({x:i.x,y:Cu(e,t),z:i.z,s:t,courseIndex:n})}}return hl}function Cn(n,e,t=0){let i=null,s=1/0;for(const r of Mo()){const a=n-r.x,o=e-r.z,l=Math.hypot(a,o);l<s&&(s=l,i=r)}return{clearance:s-t-Au*.58,distance:s,nearestS:i?.s??0}}function as(n,e,t,i,s,r=9){const a=t*.5,o=i*.5,l=Au*.62+r;let c=null;for(const u of Mo()){const f=Math.max(Math.abs(u.x-n)-a,0),m=Math.max(Math.abs(u.z-e)-o,0),p=Math.hypot(f,m)-l;if(p>0)continue;const x=u.y-2.8,M=s-x;M<=0||(!c||M-p>c.score)&&(c={courseIndex:u.courseIndex,s:u.s,x:u.x,z:u.z,trackY:u.y,horizontalClearance:p,verticalIntrusion:M,score:M-p})}return c}function Yn(n,e,t,i=96){for(let s=0;s<i;s++){const r=n(s);if(Cn(r.x,r.z,e).clearance>=t&&!On(r.x,r.z,e*2,e*2,3.5))return r}return null}function $n(n,e,t,i,s){const r=Cn(e,t,i);Or.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function Pv(){const n=[...Or].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Or.length,unsafe:Or.filter(e=>e.clearance<e.margin),closest:n}}function wn(n,e,t,i,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new O(new Qe(i,i,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(jt,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}function Lv(){const n=new fp(16757626,3097190,.66);Ze.add(n);const e=new tl(7179775,.6);e.position.set(260,145,-260),Ze.add(e);const t=new tl(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Ze.add(t);const i=new tl(16742973,.5);i.position.set(-180,35,280),Ze.add(i);const s=new Gc(5556479,90,900,2);s.position.set(0,88,-920),Ze.add(s)}let Vi=null;function Dv(){const n=document.createElement("canvas");n.width=32,n.height=512;const e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,n.height);t.addColorStop(0,"#141c3f"),t.addColorStop(.3,"#31437c"),t.addColorStop(.52,"#75689a"),t.addColorStop(.72,"#d1755a"),t.addColorStop(.86,"#f7ac68"),t.addColorStop(1,"#ffd9a4"),e.fillStyle=t,e.fillRect(0,0,n.width,n.height);const i=new en(n);i.colorSpace=Et,Vi=new O(new qt(1200,40,24),new bt({map:i,side:gn,depthWrite:!1,fog:!1})),Vi.renderOrder=-100,Vi.frustumCulled=!1,Ze.add(Vi);const s=new P(-310,150,230).normalize(),r=new bt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),a=new O(new hn(46,48),r);a.position.copy(s).multiplyScalar(1085),a.lookAt(0,0,0),Vi.add(a);const o=new bt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:Kn});for(const[l,c]of[[120,.2],[250,.085],[520,.035]]){const u=new O(new hn(l,48),o.clone());u.material.opacity=c,u.position.copy(s).multiplyScalar(1060),u.lookAt(0,0,0),Vi.add(u)}}function Iv(){const n=new X({map:yv(),color:8231526,roughness:.98,metalness:.02}),e=new O(new Ht(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let p=0;p<t.count;p++){const x=t.getX(p),M=t.getY(p);t.setZ(p,Pe(x,-M)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Ze.add(e);const i=new X({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:pt});for(let p=0;p<3;p++){const x=150-p*190,M=-760-p*420,g=980,d=64+p*18,_=new O(new Ht(980,64+p*18,1,1),i.clone());_.rotation.x=-Math.PI/2,_.rotation.z=-.34+p*.03,_.position.set(x,ds(x,M,g,d)-.55,M),_.renderOrder=-4,Ze.add(_)}const s=[new X({color:4352578,roughness:1}),new X({color:6910014,roughness:1}),new X({color:3562320,roughness:1})];for(let p=0;p<46;p++){const x=28+Math.random()*90,M=-900+Math.random()*1800,g=-260-Math.random()*1780,d=[Pe(M,g)];for(let v=0;v<6;v++)d.push(Pe(M+Math.cos(v)*x*.9,g+Math.sin(v*1.9)*x*.9));if(Math.max(...d)-Math.min(...d)>.9)continue;const _=new O(new hn(x,9),s[p%s.length]);_.rotation.x=-Math.PI/2,_.rotation.z=Math.random()*Math.PI,_.position.set(M,Math.max(...d)+.07,g),_.scale.y=.32+Math.random()*.5,_.receiveShadow=!0,Ze.add(_)}const r=new bt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let p=0;p<32;p++){const x=new O(new hn(70+Math.random()*150,22),r.clone());x.material.opacity=.008+Math.random()*.014,x.rotation.x=-Math.PI/2,x.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),x.position.y<8&&Wi.lowFogDisks++,x.scale.y=.22+Math.random()*.26,x.renderOrder=-6,Ze.add(x)}const a=[new X({color:5991785,roughness:1}),new X({color:7633254,roughness:1}),new X({color:4874865,roughness:1})],o=new X({color:15068905,roughness:.95});for(let p=0;p<52;p++){const x=78+Math.random()*180,M=52+Math.random()*115,g=Yn(_=>{const v=p/52*Math.PI*2+_*1.77,y=1380+Math.random()*820+_*18;return{x:Math.cos(v)*y,z:Math.sin(v)*y-1180}},M,480);if(!g)continue;const d=new O(new wi(M,x,5+Math.floor(Math.random()*2)),a[p%a.length]);if(d.position.set(g.x,-9,g.z),d.rotation.y=Math.random()*Math.PI,d.castShadow=!0,d.receiveShadow=!0,Ze.add(d),$n("mountain",g.x,g.z,M,480),x>160){const _=new O(new wi(M*.34,x*.22,5),o);_.position.copy(d.position).add(new P(0,x*.39,0)),_.rotation.y=d.rotation.y,Ze.add(_)}}const l=new X({color:4926748,roughness:.9});new X({color:2055221,roughness:.92}),new X({color:3109954,roughness:.95}),new X({color:1589042,roughness:.9});{const p=new Qe(.28,.42,1,6).translate(0,.5,0),x=cc([new wi(2.7,5.4,7).translate(0,1.9,0),new wi(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new wi(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),M=[2055221,3109954,1589042].map(y=>new it(y)),g=new Qt(p,l,185),d=new Qt(x,new X({roughness:.92}),185),_=new Vt;let v=0;for(let y=0;y<185;y++){const E=.58+Math.random()*1.05,T=8*E,C=Yn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),T,145,40);if(!C)continue;const{x:R,z:w}=C;if(_o(R,w,18))continue;const S=Pe(R,w)+.8,L=2.2+Math.random()*3.8;_.position.set(R,S,w),_.rotation.y=Math.random()*Math.PI,_.scale.set(E,L,E),_.updateMatrix(),g.setMatrixAt(v,_.matrix),_.position.set(R,S+L,w),_.scale.set(E,E,E),_.updateMatrix(),d.setMatrixAt(v,_.matrix),d.setColorAt(v,M[y%3]),v++,$n("tree",R,w,T,145)}g.count=v,d.count=v,g.instanceMatrix.needsUpdate=!0,d.instanceMatrix.needsUpdate=!0,d.instanceColor&&(d.instanceColor.needsUpdate=!0),d.castShadow=!0,Ze.add(g),Ze.add(d)}const c=new X({color:16767433,roughness:.75,transparent:!0,opacity:.88,emissive:16747088,emissiveIntensity:.16});for(let p=0;p<38;p++){const x=new nt,M=4+Math.floor(Math.random()*5);for(let g=0;g<M;g++){const d=new O(new qt(12+Math.random()*18,14,8),c);d.position.set(g*18-M*9,Math.random()*8,Math.random()*12),d.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),x.add(d)}x.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),Ze.add(x)}const u=[new X({color:6186600,roughness:.68,metalness:.2}),new X({color:7829101,roughness:.72,metalness:.18}),new X({color:4544612,roughness:.62,metalness:.24})],f=new X({color:2962232,roughness:.65,metalness:.35});for(let p=0;p<44;p++){const x=new nt,M=20+Math.random()*95,g=8+Math.random()*18,d=8+Math.random()*18,_=new O(new Le(g,M,d),u[p%u.length]);_.position.y=M/2,_.castShadow=!0,_.receiveShadow=!0,x.add(_);const v=Ys(160,320,.28+Math.random()*.36),y=new X({map:v,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:v,emissiveIntensity:.3});for(const R of[-1,1]){const w=new O(new Ht(g*.82,M*.74),y);w.position.set(0,M*.53,R*(d/2+.08)),w.rotation.y=R<0?Math.PI:0,x.add(w)}const E=new O(new Le(g*1.08,1.2,d*1.08),f);if(E.position.y=M+.7,x.add(E),Math.random()<.32){const R=new O(new Qe(.18,.3,10+Math.random()*12,8),f);R.position.y=M+6.5,x.add(R)}const T=Math.hypot(g,d)*.65,C=Yn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),T,240,60);C&&(x.position.set(C.x,ds(C.x,C.z,g,d)-.7,C.z),x.rotation.y=Math.random()*Math.PI,Ze.add(x),$n("building",C.x,C.z,T,240))}const m=new X({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let p=0;p<18;p++){const x=new nt,M=Bi[p%Bi.length],g=ro[(p*3+1)%ro.length],d=ki[p%ki.length],_=new X({map:Ru(M,g,d),color:16777215,roughness:.22,metalness:.04,emissive:new it(d),emissiveIntensity:.28}),v=22+Math.random()*18,y=8+Math.random()*4,E=new O(new Le(v,y,.5),_);E.position.y=10,x.add(E);const T=new O(new Le(v+1.2,.32,.75),m);T.position.y=10+y*.5+.25,x.add(T);for(const R of[-7,7]){const w=new O(new Qe(.24,.32,10,8),m);w.position.set(R,5,-.2),x.add(w)}const C=Yn(()=>({x:-780+Math.random()*1560,z:-450-p*135+Math.random()*80-40}),22,175,50);C&&(x.position.set(C.x,Pe(C.x,C.z)+.5,C.z),x.rotation.y=-.35+Math.random()*.7,Ze.add(x),$n("billboard",C.x,C.z,22,175),os("roadside-billboard",C.x,x.position.y+10,C.z))}}function Uv(){for(let d=0;d<3;d++){const _=[4012638,5326704,7035525][d],v=new bt({color:_,transparent:!0,opacity:.6-d*.14,depthWrite:!1,fog:!1}),y=60,E=5200,T=new Ht(E,360,y,1),C=T.attributes.position;for(let w=0;w<=y;w++){const S=w/y,L=(Math.sin(S*22+d*3)*.5+Math.sin(S*9+d)*.5)*70+120;C.setY(w,L),C.setY(w+y+1,-180)}C.needsUpdate=!0;const R=new O(T,v);R.position.set(0,40,-2300-d*360),Ze.add(R)}const n=new X({color:5583649,roughness:.9}),e=[new X({color:3837754,roughness:.9}),new X({color:7319100,roughness:.92}),new X({color:13075258,roughness:.9}),new X({color:15182276,roughness:.88})];for(let d=0;d<48;d++){const _=.7+Math.random()*1.2,v=9*_,y=Yn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!y)continue;const{x:E,z:T}=y;if(_o(E,T,18))continue;const C=Pe(E,T)+.6,R=new nt,w=2.6+Math.random()*3.4,S=new O(new Qe(.34,.5,w,6),n);S.position.y=w/2,R.add(S);const L=e[Math.floor(Math.random()*e.length)],F=3+Math.floor(Math.random()*3);for(let H=0;H<F;H++){const Q=2.4+Math.random()*1.8,te=new O(new qt(Q,9,7),L);te.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,R.add(te)}R.position.set(E,C,T),R.scale.setScalar(_),Ze.add(R),$n("tree",E,T,v,150)}const t=[new X({color:7762025,roughness:1,flatShading:!0,side:pt}),new X({color:9077368,roughness:1,flatShading:!0,side:pt}),new X({color:6249043,roughness:1,flatShading:!0,side:pt})];for(let d=0;d<70;d++){const _=2+Math.random()*7,v=Yn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),_,70,30);if(!v)continue;const{x:y,z:E}=v,T=new O(new kc(_,0),t[d%t.length]),C=T.geometry.attributes.position;for(let R=0;R<C.count;R++)C.setXYZ(R,C.getX(R)*(.8+Math.random()*.4),C.getY(R)*(.6+Math.random()*.4),C.getZ(R)*(.8+Math.random()*.4));C.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,Pe(y,E)+_*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Ze.add(T),Ti.push({kind:"rock",x:y,z:E,radius:_*1.12}),$n("rock",y,E,_,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let d=0;d<14;d++){const _=130+Math.random()*200,v=130+Math.random()*200,y=Yn(()=>{for(let L=0;L<6;L++){const F=-1500+Math.random()*3e3,H=-700-Math.random()*1700,Q=[Pe(F,H),Pe(F+_*.45,H+v*.45),Pe(F-_*.45,H+v*.45),Pe(F+_*.45,H-v*.45),Pe(F-_*.45,H-v*.45)];if(Math.max(...Q)-Math.min(...Q)<1)return{x:F,z:H}}return{x:1e5,z:1e5}},Math.max(_,v)*.5,40,24);if(!y||y.x>9e4)continue;const{x:E,z:T}=y,C=new nt,R=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let L=0;L<R;L++){const F=new X({color:L%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),H=new O(new Ht(_,v/R),F);H.rotation.x=-Math.PI/2,H.position.set(0,.05,-v/2+(L+.5)*(v/R)),C.add(H)}const S=Math.max(Pe(E,T),Pe(E+_*.45,T+v*.45),Pe(E-_*.45,T+v*.45),Pe(E+_*.45,T-v*.45),Pe(E-_*.45,T-v*.45));C.position.set(E,S+.06,T),C.rotation.y=Math.random()*Math.PI,Ze.add(C),$n("field",E,T,Math.max(_,v)*.5,40)}{const d=Yn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(d){const _=new O(new hn(150,48),Lu(9));_.rotation.x=-Math.PI/2,_.position.set(d.x,ds(d.x,d.z,450,300)+.08,d.z),_.scale.set(1.5,1,1),_.renderOrder=-4,Ze.add(_),Du(d.x,d.z,222,148),Wi.waterBlockers++,$n("lake",d.x,d.z,170,60)}}const s=new X({color:15922422,roughness:.5,metalness:.2});for(let d=0;d<9;d++){const _=d/9*Math.PI*2+.6,v=1500+Math.random()*700,y=Math.cos(_)*v,E=Math.sin(_)*v-1150,T=60+Math.random()*40,C=new nt,R=new O(new Qe(1.1,2.2,T,10),s);R.position.y=T/2,C.add(R);const w=new nt;w.position.set(0,T,3);const S=new O(new Le(3,3,7),s);w.add(S);const L=new nt;L.position.z=3.5;for(let H=0;H<3;H++){const Q=new O(new Le(1.1,26,.5),s);Q.position.y=13;const te=new nt;te.add(Q),te.rotation.z=H/3*Math.PI*2,L.add(te)}w.add(L),C.add(w),C.position.set(y,-8,E),C.rotation.y=Math.random()*Math.PI,Ze.add(C);const F=.5+Math.random()*.5;Bn(L,H=>{L.rotation.z=H*F})}const r=new X({color:7041398,roughness:.6,metalness:.4}),a=new ic({color:2764595,transparent:!0,opacity:.5});let o=null;for(let d=0;d<7;d++){const _=-1100+d*360,v=-1650-Math.sin(d*.7)*120,y=48,E=new nt,T=6;for(const R of[-1,1])for(const w of[-1,1]){const S=new O(new Qe(.4,.7,y,5),r);S.position.set(R*T,y/2,w*T),S.rotation.z=-R*.08,S.rotation.x=w*.08,E.add(S)}for(const R of[y*.6,y*.82,y]){const w=new O(new Le(T*4,.8,.8),r);w.position.y=R,E.add(w)}E.position.set(_,Pe(_,v)-2,v),Ze.add(E);const C=Pe(_,v)-2+y;if(o)for(const R of[-T*2,0,T*2]){const w=o.x+R,S=o.z,L=_+R,F=v,H=[],Q=12;for(let q=0;q<=Q;q++){const Z=q/Q,ne=Math.sin(Z*Math.PI)*6;H.push(new P(w+(L-w)*Z,o.y-ne+(C-o.y)*Z,S+(F-S)*Z))}const te=new Ih(new Wt().setFromPoints(H),a);Ze.add(te)}o={x:_,y:C,z:v}}const l=new X({color:11680302,roughness:.6,metalness:.3}),c=new X({color:15263976,roughness:.6,metalness:.3});for(let d=0;d<5;d++){const _=Yn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!_)continue;const{x:v,z:y}=_,E=70+Math.random()*50,T=new nt,C=8;for(let L=0;L<C;L++){const F=new O(new Qe(.5,.7,E/C,4),L%2?c:l);F.position.y=(L+.5)*(E/C),F.rotation.y=Math.PI/4,T.add(F)}const R=new X({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new O(new qt(1.1,10,8),R);w.position.y=E+1,T.add(w),T.position.set(v,Pe(v,y),y),Ze.add(T),$n("mast",v,y,8,120);const S=Math.random()*Math.PI*2;Bn(w,L=>{R.emissiveIntensity=Math.sin(L*2.4+S)>.4?2.4:.15})}const u=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let d=0;d<6;d++){const _=new nt,v=u[d%u.length],y=new X({map:Hv(v[0],v[1]),roughness:.5,metalness:.05,emissive:new it(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new O(new qt(11,20,16),y);E.scale.y=1.25,_.add(E);const T=new O(new Le(3.4,3,3.4),new X({color:8014371,roughness:.9}));T.position.y=-17,_.add(T);const C=new ic({color:3811866});for(const F of[-1,1])for(const H of[-1,1]){const Q=new Ih(new Wt().setFromPoints([new P(F*1.6,-15.5,H*1.6),new P(F*7,-3,H*7)]),C);_.add(Q)}const R=-700+Math.random()*1400,w=-700-Math.random()*1200,S=280+Math.random()*100;_.position.set(R,S,w),Ze.add(_);const L=Math.random()*Math.PI*2;Bn(_,F=>{_.position.y=S+Math.sin(F*.5+L)*6,_.position.x=R+Math.sin(F*.08+L)*90,_.rotation.z=Math.sin(F*.4+L)*.04})}const f=new bt({color:2829104,side:pt,fog:!1});function m(){const d=new Bc;return d.moveTo(0,0),d.lineTo(-2.6,1.1),d.lineTo(-2.2,.2),d.lineTo(0,.5),d.lineTo(2.2,.2),d.lineTo(2.6,1.1),d.lineTo(0,0),new O(new mo(d),f)}for(let d=0;d<5;d++){const _=new nt,v=5+Math.floor(Math.random()*5),y=[];for(let L=0;L<v;L++){const F=m(),H=L%2?1:-1,Q=Math.ceil(L/2);F.position.set(H*Q*5,-Q*2.4,0),F.rotation.x=-Math.PI/2,_.add(F),y.push(F)}const E=150+Math.random()*120,T=-500-Math.random()*1400,C=18+Math.random()*14,R=1400,w=-700+Math.random()*1400;_.position.set(w,E,T),Ze.add(_);const S=Math.random()*Math.PI*2;Bn(_,(L,F)=>{_.position.x+=C*F,_.position.x>R&&(_.position.x=-R);const H=Math.sin(L*6+S);for(const Q of y)Q.rotation.x=-Math.PI/2+H*.4})}{const d=new nt,_=new X({color:14673644,roughness:.4,metalness:.2}),v=new O(new qt(20,20,16),_);v.scale.set(2.6,1,1),d.add(v);const y=new X({color:13781835,roughness:.6});for(let w=0;w<3;w++){const S=new O(new Le(10,9,.6),y);S.position.x=-46,S.rotation.x=w/3*Math.PI*2,d.add(S)}const E=new O(new Le(10,4,4),new X({color:3356475,roughness:.7}));E.position.y=-19,d.add(E);const T=new O(new Ht(40,10),new bt({map:$c("STEEL RIBBON"),transparent:!0,side:pt}));T.position.set(60,0,0),d.add(T);const C=900,R=240;d.position.set(0,R,-1200),Ze.add(d),Bn(d,w=>{const S=w*.05;d.position.x=Math.cos(S)*C,d.position.z=-1200+Math.sin(S)*C*.5,d.position.y=R+Math.sin(w*.3)*8,d.rotation.y=-S+Math.PI/2})}const p=new bt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let d=0;d<14;d++){const _=new O(new Ht(220+Math.random()*360,16+Math.random()*22),p.clone());_.material.opacity=.12+Math.random()*.18,_.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),_.rotation.x=-Math.PI/2.1,_.rotation.z=Math.random()*Math.PI,_.scale.y=.3,Ze.add(_);const v=2+Math.random()*3;Bn(_,(y,E)=>{_.position.x+=v*E,_.position.x>1400&&(_.position.x=-1400)})}const x=new X({color:13620954,roughness:.6,metalness:.2}),M=new bt({map:Wv(),side:pt});for(let d=0;d<4;d++){const _=Yn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!_)continue;const{x:v,z:y}=_,E=new nt,T=60+Math.random()*40,C=new O(new Le(T,1.4,26),x);C.position.set(0,26,-4),C.rotation.x=-.32,E.add(C);const R=new O(new Ht(T*.94,24),M);R.position.set(0,12,6),R.rotation.x=-.85,E.add(R);for(const w of[-T/2,T/2]){const S=new O(new Le(1.4,26,1.4),x);S.position.set(w,13,-8),E.add(S)}E.position.set(v,Pe(v,y),y),E.rotation.y=Math.atan2(-v,-y)+(Math.random()-.5)*.5,Ze.add(E),$n("grandstand",v,y,40,30)}const g=[16731486,16765503,16777215,11824127];for(let d=0;d<90;d++){const _=Yn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!_)continue;const{x:v,z:y}=_,E=new nt,T=g[Math.floor(Math.random()*g.length)],C=new bt({color:T,side:pt}),R=5+Math.floor(Math.random()*6);for(let w=0;w<R;w++){const S=new O(new hn(.5+Math.random()*.4,5),C);S.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),S.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,S.rotation.z=Math.random()*Math.PI,E.add(S)}E.position.set(v,Pe(v,y),y),Ze.add(E),$n("flowers",v,y,3,20)}}const dn=[],zn=[];let dc=0;const Ti=[],Ts=[],Pn=[],uc=[],ea=[],Js=[],ke={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},oo=[];function os(n,e,t,i){ke.signs++,oo.length<160&&oo.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function Oi(n,e,t=1){ke[n][e]=(ke[n][e]||0)+t}function Fv(n,e){const t=new nt,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,r=new X({color:e,roughness:.34,metalness:.28}),a=new X({color:new it(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new X({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),l=new X({color:395016,roughness:.72,metalness:.02}),c=new X({color:14147041,roughness:.2,metalness:.68}),u=new X({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:1.7}),f=new X({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:1.45}),m=new O(new Le(s.w,s.h,s.l),n==="taxi"?new X({color:16767293,roughness:.36,metalness:.24}):r);m.position.y=.95,t.add(m);const p=new O(new Le(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(p.position.set(0,1.65,s.cabinZ),t.add(p),!s.bus){const d=new O(new Le(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);d.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(d);for(const _ of[-1,1]){const v=new O(new Le(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);v.position.set(_*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(v)}}if(s.bed){const d=new O(new Le(s.w*.94,.58,s.l*.38),a);d.position.set(0,1.2,1.35),t.add(d)}if(s.box){const d=new O(new Le(s.box[0],s.box[1],s.box[2]),new X({color:15130833,roughness:.62,metalness:.05}));d.position.set(0,1.55,1.25),t.add(d)}if(s.bus){const d=new O(new Le(s.w+.06,.28,s.l*.86),a);d.position.set(0,1.38,0),t.add(d);for(let _=-2.8;_<=3.1;_+=1.2)for(const v of[-1,1]){const y=new O(new Le(.08,.64,.72),o);y.position.set(v*(s.w*.5+.05),2.08,_),t.add(y)}}if(s.sign){const d=new O(new Le(1,.24,.46),new X({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));d.position.set(0,2.2,-.35),t.add(d)}const x=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],M=[],g=new X({color:1250072,roughness:.86,metalness:.04});for(const d of x)for(const _ of[-s.w*.54,s.w*.54]){const v=new O(new Qe(.42,.42,.36,14),l);v.rotation.z=Math.PI/2,v.position.set(_,.45,d),t.add(v),M.push(v);const y=new O(new Qe(.18,.18,.38,10),c);y.rotation.z=Math.PI/2,y.position.set(_,.45,d),t.add(y);const E=new O(new Le(.3,.34,1.12),g);E.position.set(_*1.02,.72,d),t.add(E)}for(const d of[-s.l*.5-.06,s.l*.5+.06]){const _=new O(new Le(s.w*1.02,.24,.16),g);_.position.set(0,.62,d),t.add(_)}for(const d of[-s.w*.28,s.w*.28]){const _=new O(new Le(.42,.2,.1),u);_.position.set(d,.95,-s.l*.52-.04),t.add(_);const v=new O(new Le(.36,.22,.1),f);v.position.set(d,.98,s.l*.52+.04),t.add(v)}return t.userData={wheels:M,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(d=>{d.castShadow=!1,d.receiveShadow=!0}),t}function Nv(n,e){const t=new nt,i=new X({color:12947299,roughness:.72}),s=new X({color:n,roughness:.68}),r=new X({color:e,roughness:.76}),a=new X({color:1119001,roughness:.82}),o=new O(new Qe(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const l=new O(new qt(.24,10,8),i);l.position.y=2.02,t.add(l);const c=new O(new qt(.25,8,5),a);c.scale.y=.5,c.position.y=2.17,t.add(c);const u=[];for(const f of[-.16,.16]){const m=new O(new Qe(.075,.09,.78,6),r);m.position.set(f,.58,0),t.add(m),u.push({mesh:m,side:Math.sign(f),baseY:.58,amp:.28})}for(const f of[-.38,.38]){const m=new O(new Qe(.055,.065,.72,6),i);m.position.set(f,1.33,0),m.rotation.z=f<0?-.18:.18,t.add(m),u.push({mesh:m,side:-Math.sign(f),baseY:1.33,amp:.34})}return t.userData.limbs=u,t.traverse(f=>{f.castShadow=!0,f.receiveShadow=!0}),t}function zv(n,e,t){const{X0:i,X1:s,ZN:r,ZF:a,pitch:o,streetW:l,trafficControls:c=new Map}=t,u=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],f=["compact","taxi","pickup","van","boxTruck","bus"],m=[],p=30,x=[],M=[];for(let I=i;I<=s+1;I+=o)x.push(Math.round(I));for(let I=r;I>=a-1;I-=o)M.push(Math.round(I));M.sort((I,we)=>I-we);const g=x[0],d=x[x.length-1],_=M[0],v=M[M.length-1];Pn.length=0,uc.length=0,ea.length=0,Js.length=0,ke.traffic=0,ke.pedestrians=0,ke.types={},ke.turns=0,ke.splats=0,ke.trafficCrashes=0,ke.streetLights=0,ke.trafficLights=0,ke.stopSigns=0;const y=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*l*.23,T=(I,we)=>{let ge=0,Te=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-we);K<Te&&(Te=K,ge=$)}return ge},C=(I,we,ge)=>{const Te=I==="ns"?M:x;if(ge>0){for(const $ of Te)if($>we+.05)return $;return Te[Te.length-1]}for(let $=Te.length-1;$>=0;$--)if(Te[$]<we-.05)return Te[$];return Te[0]},R=I=>{const we=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+we,z:I.along}:{x:I.along,z:I.road+we}},w=I=>{if(h.mode!=="roam")return null;const we=R(I);if(Math.abs(h.roamPos.y-(Pe(we.x,we.z)+Gn))>4.2)return null;const ge=I.axis==="ns"?0:I.dir,Te=I.axis==="ns"?I.dir:0,$=h.roamPos.x-we.x,K=h.roamPos.z-we.z,xe=$*ge+K*Te,Me=I.axis==="ns"?$:K,Ue=Math.abs(Me),Ke=Math.hypot($,K),Dt=I.mesh?.userData?.colliderHalfW||2,Je=I.mesh?.userData?.colliderHalfD||3;return Ke<xn+Math.max(Dt,Je)*.55||xe>-1.5&&xe<Je+4.2&&Ue<xn+Dt*.85?{crash:!0}:xe>0&&xe<30&&Ue<l*.36?{avoidOffset:(Me>=0?-1:1)*I.maxAvoidOffset,stop:xe<13&&Ue<xn+Dt*.95}:null},S=(I,we)=>`${Math.round(I)},${Math.round(we)}`,L=(I,we)=>{const ge=((we+I.phase)%15.5+15.5)%15.5;return ge<6.2?"ns":ge<7.4?"yellow-ns":ge<13.6?"ew":"yellow-ew"},F=(I,we)=>{const ge=I.axis==="ns"?I.road:I.next,Te=I.axis==="ns"?I.next:I.road,$=S(ge,Te),K=c.get($);if(!K)return null;if(K.type==="signal"){const xe=L(K,we),Me=xe===`yellow-${I.axis}`;return xe===I.axis&&!Me?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},H=(I,we=!1)=>{const ge=I.axis,Te=I.along,$=ge==="ns"?x:M,K=I.road,xe=T($,K),Me=[],Ue=ge==="ns"?_:g,Ke=ge==="ns"?v:d;!we&&Te+I.dir*o>=Ue&&Te+I.dir*o<=Ke&&Me.push({axis:ge,road:I.road,along:Te,dir:I.dir,turn:!1}),xe>0&&Me.push({axis:ge==="ns"?"ew":"ns",road:Te,along:K,dir:-1,turn:!0}),xe<$.length-1&&Me.push({axis:ge==="ns"?"ew":"ns",road:Te,along:K,dir:1,turn:!0}),Me.length||Me.push({axis:ge,road:I.road,along:Te,dir:-I.dir,turn:!0});const Dt=Me.filter(Pt=>Pt.turn),Je=!we&&Dt.length&&Math.random()<.42?y(Dt):y(Me);(Je.turn||Je.axis!==ge)&&ke.turns++,I.axis=Je.axis,I.road=Je.road,I.along=Je.along,I.dir=Je.dir,I.laneOffset=E(I.dir),I.next=C(I.axis,I.along,I.dir),I.turnBlend=Je.turn?1:0,I.lastControlKey=null};for(let I=0;I<p;I++){const we=Math.random()<.56?"ns":"ew",ge=f[I%f.length],Te=Math.random()<.5?-1:1,$=(ge==="bus"||ge==="boxTruck"?10:13)+Math.random()*9,K={axis:we,dir:Te,road:y(we==="ns"?x:M),laneOffset:E(Te),along:y(we==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:l*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Fv(ge,u[I*3%u.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=C(K.axis,K.along,K.dir),Pn.push(K.collider),m.push(K),uc.push(K),n.add(K.mesh),ke.types[ge]=(ke.types[ge]||0)+1}function Q(I,we=0,ge=0){let Te=Math.max(0,I.speed*ge);const $=w(I);for($?.crash?(Zu(I,h.roamPos),Te=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,ge*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Te=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,ge*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-ge),Te=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-ge),Te=0);Te>0;){const B=F(I,we);if(B){const ut=I.next-I.dir*(B.kind==="signal"?12:8),Lt=(ut-I.along)*I.dir;if(Lt>=-.35&&Lt<=Te+.25){I.along=ut,I.brakePulse=1,Te=0,B.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=B.key);break}}const ft=Math.abs(I.next-I.along);if(Te<ft)I.along+=I.dir*Te,Te=0;else{I.along=I.next,Te-=ft;const ut=I.next<=(I.axis==="ns"?_:g)+.05||I.next>=(I.axis==="ns"?v:d)-.05;H(I,ut)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-ge*3.2),I.turnBlend=Math.max(0,I.turnBlend-ge*3.2);const{x:K,z:xe}=R(I),Me=I.axis==="ns"?0:I.dir,Ue=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,Pe(K,xe)+.28+Math.sin(we*3.2+I.bob)*.035,xe);const Ke=Math.atan2(-Me,-Ue),Dt=Math.atan2(Math.sin(Ke-I.mesh.rotation.y),Math.cos(Ke-I.mesh.rotation.y));I.mesh.rotation.y+=Dt*Math.min(1,ge*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(we*22+I.bob)*.02);for(const B of I.mesh.userData.wheels||[])B.rotation.x-=I.dir*I.speed*ge*1.7;const Je=I.mesh.userData.colliderHalfD,Pt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=xe,I.collider.hw=I.axis==="ns"?Pt:Je,I.collider.hd=I.axis==="ns"?Je:Pt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of m)Q(I,0,0);ke.traffic=m.length,Bn(n,(I,we)=>{for(const ge of m)Q(ge,I,we)});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],Z=[],ne=45;for(let I=0;I<ne;I++){const we=Math.random()<.56?"ns":"ew",ge=e[Math.random()*e.length|0],Te=Math.abs(ge.z1-ge.z0)>Math.abs(ge.x1-ge.x0),$=we==="ns"?Te?"ns":"ew":Te?"ew":"ns",K=Math.random()<.5?-1:1,xe=Math.random()<.5?-1:1,Me={axis:$,dir:K,sideSign:xe,coord:y($==="ns"?x:M),along:$==="ns"?a+Math.random()*(r-a):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Nv(te[I%te.length],q[I*2%q.length])};I<14&&(Me.axis="ns",Me.coord=80,Me.sideSign=I%2?-1:1,Me.dir=I%3===0?1:-1,Me.along=350-I*24,Me.speed=1.5+I%4*.35),Z.push(Me),ea.push(Me),Me.mesh.traverse(Ue=>Ue.castShadow=!1),n.add(Me.mesh)}const de=new bt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:pt}),pe=new bt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:pt});for(let I=0;I<18;I++){const we=new nt,ge=new O(new hn(1,12),de.clone());ge.rotation.x=-Math.PI/2,we.add(ge);for(let Te=0;Te<7;Te++){const $=new O(new hn(.25+Math.random()*.25,8),pe.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Te)*(.6+Math.random()*1.2),.01,Math.sin(Te*1.7)*(.5+Math.random()*1.1)),we.add($)}we.visible=!1,we.userData.life=0,we.userData.maxLife=2.8,we.position.y=-99,n.add(we),Js.push(we)}function Ve(I,we=0,ge=0){if(!I.active)if(I.respawn-=ge,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*ge,I.axis==="ns"?(I.along<a-28&&(I.along=r+28),I.along>r+28&&(I.along=a-28)):(I.along<i-28&&(I.along=s+28),I.along>s+28&&(I.along=i-28));const Te=I.sideSign*(l*.66+1.2),$=I.axis==="ns"?I.coord+Te:I.along,K=I.axis==="ns"?I.along:I.coord+Te,xe=I.axis==="ns"?0:I.dir,Me=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,Pe($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-xe,-Me);const Ue=Math.sin(we*7+I.phase);for(const Ke of I.mesh.userData.limbs||[])Ke.mesh.rotation.x=Ue*Ke.amp*Ke.side,Ke.mesh.position.y=Ke.baseY+Math.abs(Ue)*.025}for(const I of Z)Ve(I,0,0);ke.pedestrians=Z.length,Bn(n,(I,we)=>{for(const ge of Z)Ve(ge,I,we);for(const ge of Js){if(!ge.visible)continue;ge.userData.life-=we;const Te=ge.userData.life,$=_e.clamp(Te/ge.userData.maxLife,0,1);ge.scale.setScalar(1+(1-$)*.35),ge.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Te<=0&&(ge.visible=!1)}})}function Ov(){const n=new nt,e=new Vt;new Pi().setFromAxisAngle(new P(1,0,0),-Math.PI/2),ke.roadDetails={},ke.buildingArchetypes={},ke.zones={},ke.openerProps=0;const t=zt.x0,i=zt.x1,s=zt.zNear,r=zt.zFar,a=zt.pitch,o=zt.streetW,l=a-o,c=[],u=[];for(let N=t;N<=i+1;N+=a)c.push(Math.round(N));for(let N=s;N>=r-1;N-=a)u.push(Math.round(N));const f=[];for(const N of c)f.push({x0:N,z0:s,x1:N,z1:r});for(const N of u)f.push({x0:t,z0:N,x1:i,z1:N});function m(N,z){const Y=N.x1-N.x0,ee=N.z1-N.z0,ie=Math.hypot(Y,ee)||1,le=-ee/ie,b=Y/ie;return{x0:N.x0+le*z,z0:N.z0+b*z,x1:N.x1+le*z,z1:N.z1+b*z}}function p(N,z,Y){const ee=[],ie=[];for(const b of N){const U=b.x1-b.x0,V=b.z1-b.z0,W=Math.hypot(U,V),k=Math.max(1,Math.round(W/14)),oe=U/W,ae=-(V/W),j=oe;let he=null,Se=null;for(let Ne=0;Ne<=k;Ne++){const be=Ne/k,Re=be*W/68,ot=b.x0+U*be,mt=b.z0+V*be,yt=ot+ae*z,xt=mt+j*z,He=ot-ae*z,St=mt-j*z,lt=[yt,Pe(yt,xt)+Y,xt,Re],Xt=[He,Pe(He,St)+Y,St,Re];he&&(ee.push(he[0],he[1],he[2],Se[0],Se[1],Se[2],Xt[0],Xt[1],Xt[2]),ee.push(he[0],he[1],he[2],Xt[0],Xt[1],Xt[2],lt[0],lt[1],lt[2]),ie.push(0,he[3],1,Se[3],1,Xt[3]),ie.push(0,he[3],1,Xt[3],0,lt[3])),he=lt,Se=Xt}}const le=new Wt;return le.setAttribute("position",new Mt(ee,3)),le.setAttribute("uv",new Mt(ie,2)),le.computeVertexNormals(),le}const x=new X({map:Sv(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:pt}),M=new X({color:11054244,roughness:.62,metalness:.04}),g=new X({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),d=new X({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),_=new X({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new X({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const N of f)y.push(m(N,o*.5+3.3),m(N,-13.3)),E.push(m(N,o*.5+.42),m(N,-10.42));const T=new O(p(y,2.9,.66),M);T.receiveShadow=!0,n.add(T);const C=new O(p(E,.28,.78),g);C.receiveShadow=!0,n.add(C),Oi("roadDetails","sidewalkRuns",y.length),Oi("roadDetails","curbRuns",E.length);const R=new O(p(f,o/2,.55),x);R.receiveShadow=!0,n.add(R);const w=new X({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:pt});n.add(new O(p(f,.4,.62),w));let S=0,L=0,F=0;for(let N=1;N<c.length-1;N++)for(let z=1;z<u.length-1;z++){const Y=c[N],ee=u[z];if(!(Cn(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const le=new O(new Le(o*.92,.07,1.15),d);le.position.set(Y,Pe(Y,ee+ie*13)+.83,ee+ie*13),le.receiveShadow=!0,n.add(le);const b=new O(new Le(1.15,.07,o*.92),d);b.position.set(Y+ie*13,Pe(Y+ie*13,ee)+.83,ee),b.receiveShadow=!0,n.add(b),S+=2}}const H=new Bc;H.moveTo(0,5.8),H.lineTo(2.5,1.6),H.lineTo(.72,1.6),H.lineTo(.72,-5.2),H.lineTo(-.72,-5.2),H.lineTo(-.72,1.6),H.lineTo(-2.5,1.6),H.closePath();const Q=new mo(H);Q.rotateX(-Math.PI/2);for(const N of f){const z=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const le=(ie+.5)/ee,b=N.x0+(N.x1-N.x0)*le,U=N.z0+(N.z1-N.z0)*le;if(Cn(b,U,4).clearance<2)continue;const V=new O(Q,_);if(V.position.set(b,Pe(b,U)+.86,U),V.rotation.y=z?0:Math.PI/2,V.scale.setScalar(.9),n.add(V),L++,ie%2===0){const W=new O(new Qe(1.05,1.05,.08,24),v);W.position.set(b+(z?3.8:0),Pe(b,U)+.84,U+(z?0:3.8)),n.add(W),F++}}}Oi("roadDetails","crosswalks",S),Oi("roadDetails","laneArrows",L),Oi("roadDetails","manholes",F);const te=new bt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:pt,blending:Kn}),q=new bt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:pt,blending:Kn});for(let N=0;N<120;N++){const z=f[Math.random()*f.length|0],Y=Math.random(),ee=z.x0+(z.x1-z.x0)*Y,ie=z.z0+(z.z1-z.z0)*Y;if(Cn(ee,ie,4).clearance<2)continue;const le=new O(new hn(1,18),(N%4===0?q:te).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(z.x1-z.x0,z.z1-z.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(ee+(Math.random()-.5)*o*.7,Pe(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(le)}const Z=[Ys(160,320,.5),Ys(160,320,.62),Ys(160,320,.42)],ne=[new X({map:Z[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:Z[0],emissiveIntensity:.34}),new X({map:Z[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:Z[1],emissiveIntensity:.32}),new X({map:Z[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:Z[2],emissiveIntensity:.36})],de=new Le(1,1,1),pe=[[],[],[]],Ve=[],I=[],we=[],ge=[],Te=[],$=[],K=[],xe=[],Me=[],Ue=[],Ke=[],Dt=[],Je=[],Pt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=wv(256,256,"#dbcdb8"),ft=Tv(),ut=Ev(),Lt=[cl(512,384,"#944737","#2e95bf"),cl(512,384,"#7e4d3e","#d04d65"),cl(512,384,"#a65a35","#4fba6d")],qe=Av();function Ft(N,z){Oi("zones",N),Oi("buildingArchetypes",z)}function et(N,z,Y,ee,ie,le="downtown"){if(On(N,z,Y,ee))return!1;const b=ds(N,z,Y,ee)-1.1;if(as(N,z,Y,ee,b+ie+2))return!1;if(e.position.set(N,b+ie/2,z),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),pe[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,b+ie+.6,z),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),Ve.push(e.matrix.clone()),ie>26){const U=Math.random()<.72?3790847:16730294;for(const V of[-1,1])e.position.set(N,b+ie+1.35,z+V*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),we.push(U);Math.random()<.34&&ge.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:b,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const U=Math.random()<.5?"x":"z";Te.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:b,axis:U,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const U=Math.random()<.5?"x":"z";$.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:b,axis:U,side:Math.random()<.5?-1:1})}return dn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+2}),Ft(le,ie>64?"glassTower":"midrise"),!0}function ht(N,z,Y,ee,ie,le="residential"){if(On(N,z,Y,ee))return!1;const b=ds(N,z,Y,ee)-.55,U=2+Math.random()*2.4;if(as(N,z,Y,ee,b+ie+U+1.5,6))return!1;e.position.set(N,b+ie/2,z),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),K.push(e.matrix.clone()),dn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+U+1.5}),xe.push(Pt[Math.random()*Pt.length|0]),e.position.set(N,b+ie+U/2,z),e.scale.set(Y*.82,U,ee*.82),e.updateMatrix(),Me.push(e.matrix.clone());const V=t+Math.round((N-t)/a)*a,W=s-Math.round((s-z)/a)*a,k=Math.abs(N-V)<Math.abs(z-W),oe=k?V>N?1:-1:W>z?1:-1,ae=Math.min(k?ee*.46:Y*.46,8.5),j=Math.min(ie*.58,4.6),he=Math.min(24,Math.max(8,k?Math.abs(V-N)-Y*.5-o*.35:Math.abs(W-z)-ee*.5-o*.35));e.quaternion.identity(),k?(e.position.set(N+oe*(Y*.5+.1),b+j*.5+.1,z-ee*.16),e.scale.set(.24,j,ae),e.updateMatrix(),Ue.push(e.matrix.clone()),e.position.set(N+oe*(Y*.5+he*.5),Pe(N+oe*(Y*.5+he*.5),z)+.08,z-ee*.16),e.scale.set(he,.08,ae*1.18)):(e.position.set(N-Y*.16,b+j*.5+.1,z+oe*(ee*.5+.1)),e.scale.set(ae,j,.24),e.updateMatrix(),Ue.push(e.matrix.clone()),e.position.set(N-Y*.16,Pe(N,z+oe*(ee*.5+he*.5))+.08,z+oe*(ee*.5+he*.5)),e.scale.set(ae*1.18,.08,he)),e.updateMatrix(),Ke.push(e.matrix.clone()),e.position.set(N,b+.02,z),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),Dt.push(e.matrix.clone());for(let Se=0;Se<3;Se++){const Ne=k?N+oe*(Y*.55):N+(Se-1)*Y*.25,be=k?z+(Se-1)*ee*.28:z+oe*(ee*.55);e.position.set(Ne,Pe(Ne,be)+.55,be);const Re=.85+Math.random()*.75;e.scale.set(Re*1.35,Re,Re*1.35),e.updateMatrix(),Je.push(e.matrix.clone())}return Ft(le,"residentialHouse"),!0}function D(N,z,Y,ee,ie,le="commercial"){if(On(N,z,Y,ee))return!1;const b=ds(N,z,Y,ee)-.8;if(as(N,z,Y,ee,b+ie+2,7))return!1;const U=new X({map:qe,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),V=new O(new Le(Y,ie,ee),U);V.position.set(N,b+ie/2,z),V.castShadow=!0,V.receiveShadow=!0,n.add(V);const W=new X({color:7502722,roughness:.52,metalness:.15}),k=new O(new Le(Y*.72,.32,ee*.18),W);k.position.set(N,b+ie*.38,z+ee*.18),k.rotation.z=.13,n.add(k);const oe=new X({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let ae=5;ae<ie;ae+=9){const j=new O(new Le(Y*1.02,.24,.22),oe);j.position.set(N,b+ae,z+ee*.5+.14),n.add(j)}return dn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+2}),Ft(le,"parkingGarage"),!0}function A(N,z,Y,ee,ie,le="commercial"){if(On(N,z,Y,ee))return!1;const b=ds(N,z,Y,ee)-.65;if(as(N,z,Y,ee,b+ie+2,7))return!1;const U=new X({map:Lt[Math.random()*Lt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),V=new O(new Le(Y,ie,ee),U);V.position.set(N,b+ie/2,z),V.castShadow=!0,V.receiveShadow=!0,n.add(V);const W=new O(new Le(Y*1.06,.9,ee*1.06),new X({color:2237478,roughness:.56,metalness:.18}));W.position.set(N,b+ie+.45,z),n.add(W);const k=t+Math.round((N-t)/a)*a,oe=s-Math.round((s-z)/a)*a,ae=Math.abs(N-k)<Math.abs(z-oe),j=ae?k>N?1:-1:oe>z?1:-1,he=ki[(N+z|0)%ki.length]||"#ffd45b",Se=new bt({map:ll(Bi[(Math.abs(N)+Math.abs(z)|0)%Bi.length],he),transparent:!0,side:pt,depthWrite:!1}),Ne=new O(new Ht(Math.min(16,ae?ee*.82:Y*.82),4.2),Se);return ae?(Ne.position.set(N+j*(Y*.5+.2),b+ie*.66,z),Ne.rotation.y=j>0?Math.PI/2:-Math.PI/2):(Ne.position.set(N,b+ie*.66,z+j*(ee*.5+.2)),Ne.rotation.y=j<0?Math.PI:0),n.add(Ne),os("storefront-sign",Ne.position.x,Ne.position.y,Ne.position.z),dn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+2}),Ft(le,"brickStorefront"),!0}for(let N=t+a/2;N<=i-a/2;N+=a)for(let z=s-a/2;z>=r+a/2;z-=a){const Y=Cn(N,z,l*.5).clearance;if(Y<2)continue;const ee=z>40&&z<380&&N>-360&&N<360,ie=ee?"showcase":z<-920?"industrial":Y>230||z<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const le=l/3;for(let b=0;b<3;b++)for(let U=0;U<3;U++){if(Math.random()<.08)continue;const V=N-l/2+le*(b+.5)+(Math.random()-.5)*le*.3,W=z-l/2+le*(U+.5)+(Math.random()-.5)*le*.3;if(Cn(V,W,8).clearance<1)continue;const k=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!ee&&Math.random()<.16?et(V,W,k*.9,oe*.9,12+Math.random()*12,ie):ht(V,W,k,oe,5+Math.random()*4.5,ie)}}else{const le=Y>230,b=le?_e.clamp(58+Y*1.15,68,205):_e.clamp(22+Y*.3,22,66),U=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let V=0;V<U;V++){const W=15+Math.random()*Math.min(30,l*.46),k=15+Math.random()*Math.min(30,l*.46),oe=N+(Math.random()-.5)*(l-W),ae=z+(Math.random()-.5)*(l-k);if(Cn(oe,ae,Math.hypot(W,k)*.5).clearance<2)continue;const j=(18+Math.random()*(b-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&A(oe,ae,Math.max(18,W*1.12),Math.max(18,k*1.08),12+Math.random()*14,ie)||Math.random()<.18&&D(oe,ae,Math.max(24,W*1.35),Math.max(24,k*1.28),24+Math.random()*24,ie))||et(oe,ae,W,k,j,ie)}}}for(let N=0;N<3;N++){if(!pe[N].length)continue;const z=new Qt(de,ne[N],pe[N].length);for(let Y=0;Y<pe[N].length;Y++)z.setMatrixAt(Y,pe[N][Y]);z.instanceMatrix.needsUpdate=!0,z.castShadow=!0,z.receiveShadow=!0,n.add(z)}if(Ve.length){const N=new X({color:2896696,roughness:.62,metalness:.34}),z=new Qt(de,N,Ve.length);for(let Y=0;Y<Ve.length;Y++)z.setMatrixAt(Y,Ve[Y]);z.instanceMatrix.needsUpdate=!0,n.add(z)}if(I.length){const N=new X({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),z=new Qt(de,N,I.length);for(let Y=0;Y<I.length;Y++)z.setMatrixAt(Y,I[Y]),z.setColorAt(Y,new it(we[Y]));z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),n.add(z)}if(K.length){const N=new X({color:4891451,roughness:.88,metalness:.02}),z=new Qt(de,N,Dt.length);for(let j=0;j<Dt.length;j++)z.setMatrixAt(j,Dt[j]);z.instanceMatrix.needsUpdate=!0,z.receiveShadow=!0,n.add(z);const Y=new X({color:12040883,roughness:.48,metalness:.05}),ee=new Qt(de,Y,Ke.length);for(let j=0;j<Ke.length;j++)ee.setMatrixAt(j,Ke[j]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new X({map:B,roughness:.78,metalness:.03}),le=new Qt(de,ie,K.length);for(let j=0;j<K.length;j++)le.setMatrixAt(j,K[j]),le.setColorAt(j,new it(xe[j]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const b=new wi(.72,1,4);b.rotateY(Math.PI/4);const U=new X({map:ft,color:14314033,roughness:.72}),V=new Qt(b,U,Me.length);for(let j=0;j<Me.length;j++)V.setMatrixAt(j,Me[j]);V.instanceMatrix.needsUpdate=!0,V.castShadow=!0,n.add(V);const W=new X({map:ut,roughness:.38,metalness:.18}),k=new Qt(de,W,Ue.length);for(let j=0;j<Ue.length;j++)k.setMatrixAt(j,Ue[j]);k.instanceMatrix.needsUpdate=!0,n.add(k);const oe=new X({color:3112239,roughness:.88,metalness:.02}),ae=new Qt(new qt(1,8,6),oe,Je.length);for(let j=0;j<Je.length;j++)ae.setMatrixAt(j,Je[j]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(ge.length,34);N++){const z=ge[N],Y=J[N%J.length],ee=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new bt({map:gd(Y,ee),transparent:!0,side:pt,depthWrite:!1}),le=new O(new Ht(8,24),ie);le.position.set(z.px,z.gy+Math.max(14,z.h*.58),z.pz+z.zSide*(z.d*.5+.25)),le.rotation.y=z.zSide<0?Math.PI:0,n.add(le),os("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let N=0;N<Math.min(Te.length,48);N++){const z=Te[N],Y=Bi[(N*5+2)%Bi.length],ee=ki[(N*2+1)%ki.length],ie=new bt({map:ll(Y,ee),transparent:!0,side:pt,depthWrite:!1}),le=Math.min(17,(z.axis==="x"?z.d:z.w)*.82),b=new O(new Ht(le,4.7),ie),U=z.gy+Math.max(6.2,Math.min(z.h-3.5,z.h*(.28+N%3*.12)));z.axis==="x"?(b.position.set(z.px+z.side*(z.w*.5+.22),U,z.pz),b.rotation.y=z.side>0?Math.PI/2:-Math.PI/2):(b.position.set(z.px,U,z.pz+z.side*(z.d*.5+.22)),b.rotation.y=z.side<0?Math.PI:0),n.add(b),os("wall-sign",b.position.x,b.position.y,b.position.z)}for(let N=0;N<Math.min($.length,18);N++){const z=$[N],Y=Bi[(N*7+4)%Bi.length],ee=ro[(N*5+3)%ro.length],ie=ki[(N+3)%ki.length],le=new nt,b=new X({map:Ru(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new it(ie),emissiveIntensity:.34}),U=Math.min(18,(z.axis==="x"?z.d:z.w)*.86),V=new O(new Le(U,5.2,.42),b);V.position.y=4.8,le.add(V);const W=new X({color:1053978,roughness:.44,metalness:.28});for(const k of[-U*.34,U*.34]){const oe=new O(new Qe(.13,.17,5,8),W);oe.position.set(k,2.25,-.2),le.add(oe)}le.position.set(z.px,z.gy+z.h+.7,z.pz),le.rotation.y=z.axis==="x"?z.side>0?Math.PI/2:-Math.PI/2:z.side<0?Math.PI:0,n.add(le),os("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const ce=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],fe=cc([new Le(2.2,.72,4.6).translate(0,.78,0),new Le(1.7,.56,2.15).translate(0,1.42,-.22)]),re=cc([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,z])=>new Qe(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,z))),$e=130,Ae=new Qt(fe,new X({roughness:.42,metalness:.36}),$e),je=new Qt(re,new X({color:1512727,roughness:.9}),$e);let Ge=0,me=0;for(;Ge<$e&&me<$e*6;){me++;const N=Math.random()<.5,z=N?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Cn(z,Y,4).clearance<2)continue;const ee=Pe(z,Y)+.06;e.position.set(z,ee,Y),e.quaternion.setFromAxisAngle(jt,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Ae.setMatrixAt(Ge,e.matrix),je.setMatrixAt(Ge,e.matrix),Ae.setColorAt(Ge,new it(ce[Math.random()*ce.length|0])),Ge++}Ae.count=Ge,je.count=Ge,Ae.instanceMatrix.needsUpdate=!0,je.instanceMatrix.needsUpdate=!0,Ae.instanceColor&&(Ae.instanceColor.needsUpdate=!0),Ae.castShadow=!0,n.add(Ae),n.add(je);const ye=new Map,st=(N,z)=>`${Math.round(N)},${Math.round(z)}`;function tt(N,z){const Y=((z+N.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Be(){const N=[],z=new X({color:1120028,roughness:.38,metalness:.62}),Y=new X({color:1382685,roughness:.34,metalness:.38}),ee=Cv(),ie=new bt({map:ee,transparent:!0,side:pt}),le=new X({color:5050642,roughness:.48,metalness:.12}),b=(ae,j)=>new X({color:ae,roughness:.16,metalness:.02,emissive:j,emissiveIntensity:.2}),U=(ae,j,he,Se,Ne,be)=>{const Re=new nt,ot=new O(new Le(1.15,2.85,.75),Y);Re.add(ot);const mt=b(16724008,16717836),yt=b(16767053,16757276),xt=b(4521842,1693789),He=[mt,yt,xt];for(let St=0;St<3;St++){const lt=new O(new qt(.28,12,8),He[St]);lt.position.set(0,.78-St*.78,-.42),Re.add(lt)}Re.position.set(he,Se,Ne),Re.rotation.y=be,ae.add(Re),N.push({axis:j,red:mt,yellow:yt,green:xt,control:ae.userData.control})},V=(ae,j,he)=>{const Se=st(ae,j),Ne={type:"signal",x:ae,z:j,phase:he%4*2.1};ye.set(Se,Ne);const be=Pe(ae,j),Re=new nt;Re.userData.control=Ne;const ot=o*.72,mt=o*.72,yt=new O(new Qe(.18,.24,8.2,8),z);yt.position.set(ot,4.1,mt),Re.add(yt);const xt=new O(new Le(o*1.65,.2,.2),z);xt.position.set(ot-o*.72,8,mt),Re.add(xt);const He=new O(new Le(.2,.2,o*1.65),z);He.position.set(ot,7.55,mt-o*.72),Re.add(He),U(Re,"ns",ot-o*1.24,7.52,mt,0),U(Re,"ns",ot-o*.18,7.52,-mt,Math.PI),U(Re,"ew",ot,7.05,mt-o*1.24,Math.PI/2),U(Re,"ew",-ot,7.05,mt-o*.18,-Math.PI/2),Re.position.set(ae,be,j),Re.traverse(St=>{St.castShadow=!0,St.receiveShadow=!0}),n.add(Re)},W=(ae,j,he)=>{const Se=st(ae,j);ye.set(Se,{type:"stop",x:ae,z:j,phase:0});const Ne=Pe(ae,j),be=new nt,Re=he%2?-1:1,ot=he%3?1:-1,mt=new O(new Qe(.12,.16,4.2,7),z);mt.position.y=2.1,be.add(mt);const yt=new O(new hn(1.04,8),le);yt.position.y=4.55,yt.rotation.y=Math.PI,be.add(yt);const xt=new O(new Ht(2.05,2.05),ie);xt.position.set(0,4.55,-.04),be.add(xt),be.position.set(ae+Re*o*.74,Ne,j+ot*o*.74),be.rotation.y=Math.atan2(Re,ot),be.traverse(He=>{He.castShadow=!0,He.receiveShadow=!0}),n.add(be)};let k=0,oe=0;for(let ae=1;ae<c.length-1;ae++)for(let j=1;j<u.length-1;j++){const he=c[ae],Se=u[j];if(Cn(he,Se,o*.9).clearance<2)continue;const Ne=Math.abs(he-80)<=a*1.05&&Se<=s&&Se>=-560,be=Se<-260&&Se>-1180&&(ae+j)%4===0,Re=Se>-360&&(ae+j)%2===0;Ne&&j%2===0||be?V(he,Se,k++):(Re||(ae+j)%5===0&&Se>-820)&&W(he,Se,oe++)}return Bn(n,ae=>{for(const j of N){const he=tt(j.control,ae);j.red.emissiveIntensity=he.green===j.axis||he.yellow===j.axis?.12:2.3,j.yellow.emissiveIntensity=he.yellow===j.axis?2.6:.12,j.green.emissiveIntensity=he.green===j.axis?2.6:.1}}),{trafficLights:k,stopSigns:oe}}const rt=Be();zv(n,f,{X0:t,X1:i,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:ye}),ke.trafficLights=rt.trafficLights,ke.stopSigns=rt.stopSigns;const G=new Qe(.12,.16,7.2,7),ze=new qt(.46,10,8),Ie=new Ht(2.8,13),Ce=new X({color:1581353,roughness:.42,metalness:.68}),ve=new X({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),ue=new bt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:pt,blending:Kn}),We=bv(),at=new iu({map:We,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:Kn}),It=132,At=new Qt(G,Ce,It),Mn=new Qt(ze,ve,It),fn=new Qt(Ie,ue,It);let Hn=0;for(let N=0;N<It*2&&Hn<It;N++){const z=Math.random()<.5,Y=z?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Cn(Y,ee,3).clearance<2)continue;const ie=Pe(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),At.setMatrixAt(Hn,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),Mn.setMatrixAt(Hn,e.matrix);const le=new Ah(at);le.position.set(Y,ie+7.5,ee);const b=6.2+Math.random()*2.4;le.scale.set(b,b,1),n.add(le),Wi.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),fn.setMatrixAt(Hn,e.matrix),Hn++}At.count=Hn,Mn.count=Hn,fn.count=Hn,At.instanceMatrix.needsUpdate=!0,Mn.instanceMatrix.needsUpdate=!0,fn.instanceMatrix.needsUpdate=!0,n.add(At,Mn,fn),ke.streetLights=Hn,n.add(new O(p([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new O(p([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new O(p([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new O(p([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const la=new X({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const z=new O(new Le(1.15,.09,13.5),la);z.position.set(80,Pe(80,N)+.9,N),z.receiveShadow=!0,n.add(z)}for(const N of[286,156,26,-104])for(let z=0;z<7;z++){const Y=new O(new Le(2,.08,11.8),d),ee=71.2+z*2.95;Y.position.set(ee,Pe(ee,N)+.91,N),Y.receiveShadow=!0,n.add(Y),Oi("roadDetails","openerCrosswalkStripes")}function pr(N,z,Y,ee=!1){const ie=Pe(N,z),le=new nt,b=new O(new Qe(.16,.22,9.5,8),Ce);b.position.y=4.75,le.add(b);const U=new O(new Le(3.8,.22,.22),Ce);U.position.set(Y*1.75,8.95,0),le.add(U);const V=new O(new qt(.62,12,8),ve);V.position.set(Y*3.6,8.82,0),le.add(V);const W=new Ah(at.clone());W.position.copy(V.position),W.material.opacity=.78+Math.random()*.12,W.scale.set(8.8,8.8,1),le.add(W),Wi.streetGlowSprites++;const k=new O(new Ht(3.2,15),ue.clone());if(k.position.set(Y*2.8,.72,0),k.rotation.x=-Math.PI/2,k.scale.y=.7+Math.random()*.35,le.add(k),ee){const oe=new Gc(16762474,4.4,66,2);oe.position.copy(V.position),le.add(oe)}le.position.set(N,ie,z),n.add(le),ke.streetLights++}let ti=0;for(let N=340;N>=-700;N-=118)pr(63,N,1,ti++%3===0),pr(97,N-42,-1,ti++%3===0);function ni(N,z,Y,ee,ie=6010942){const le=new X({color:ie,roughness:.92,metalness:.01}),b=new O(new Le(Y,.08,ee),le);return b.position.set(N,Pe(N,z)+.06,z),b.receiveShadow=!0,n.add(b),ke.openerProps++,b}function ii(N,z,Y=1){const ee=Pe(N,z),ie=new nt,le=new O(new Qe(.35,.55,5.5,8),new X({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const b=new X({color:6065982,roughness:.86}),U=new X({color:3959601,roughness:.9}),V=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let W=0;W<V.length;W++){const[k,oe,ae,j]=V[W],he=new O(new qt(j,12,8),W%2?U:b);he.position.set(k,oe,ae),he.scale.y=.78,he.castShadow=!0,ie.add(he)}return ie.position.set(N,ee,z),ie.scale.setScalar(Y),n.add(ie),Ti.push({kind:"tree",x:N,z,radius:3.4*Y,maxY:ee+11*Y}),ke.openerProps++,ie}function mr(N,z,Y=0){const ee=new nt,ie=new X({color:10970418,roughness:.64,metalness:.04}),le=new X({color:1910317,roughness:.46,metalness:.5});for(const b of[1.05,1.55]){const U=new O(new Le(6.8,.22,.44),ie);U.position.y=b,ee.add(U)}for(const b of[-2.7,2.7]){const U=new O(new Le(.22,1.2,.35),le);U.position.set(b,.62,0),ee.add(U)}ee.position.set(N,Pe(N,z),z),ee.rotation.y=Y,n.add(ee),ke.openerProps++}function Es(N,z){const Y=new X({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new nt,ie=new O(new Qe(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const le=new O(new qt(.42,12,8),Y);le.position.y=1.32,ee.add(le);const b=new O(new Qe(.16,.16,1.1,10),Y);b.rotation.z=Math.PI/2,b.position.y=.9,ee.add(b),ee.position.set(N,Pe(N,z),z),n.add(ee),ke.openerProps++}function ca(N,z,Y=0){const ee=new nt,ie=new X({color:1185821,roughness:.36,metalness:.68}),le=new X({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),b=new X({color:2370611,roughness:.42,metalness:.32}),U=new O(new Le(8.5,.35,3.2),b);U.position.y=4.2,ee.add(U);for(const k of[-3.8,3.8]){const oe=new O(new Qe(.09,.11,4.1,7),ie);oe.position.set(k,2.05,-1.25),ee.add(oe)}const V=new O(new Le(8,2.8,.08),le);V.position.set(0,2.2,1.35),ee.add(V);const W=new O(new Ht(2.3,2.8),new bt({map:ll("BUS","#4ff3ff"),transparent:!0,side:pt}));W.position.set(-2.4,2.2,1.42),ee.add(W),ee.position.set(N,Pe(N,z),z),ee.rotation.y=Y,n.add(ee),os("bus-shelter-ad",N,Pe(N,z)+2.2,z),ke.openerProps++}function nn(N,z,Y,ee,ie,le,b,U=null,V=0){if(On(N,z,Y,ee,12))return!1;const W=Pe(N,z)-.45;if(as(N,z,Y,ee,W+ie+2))return!1;const k=N<80?1:-1,oe=new X({map:Ys(192,512,b),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),ae=new O(new Le(Y,ie,ee),oe);ae.position.set(N,W+ie/2,z),ae.castShadow=!1,ae.receiveShadow=!0,n.add(ae);const j=new X({map:Ys(220,620,Math.min(.86,b+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:pt}),he=new O(new Ht(ee*.78,ie*.74),j);he.position.set(N+k*(Y/2+.09),W+ie*.54,z),he.rotation.y=k>0?Math.PI/2:-Math.PI/2,n.add(he);for(const be of[-1,1]){const Re=new O(new Ht(Y*.82,ie*.72),j.clone());Re.position.set(N,W+ie*.55,z+be*(ee/2+.1)),Re.rotation.y=be>0?0:Math.PI,n.add(Re)}const Se=new O(new Le(Y*1.04,1.2,ee*1.04),new X({color:1778733,roughness:.34,metalness:.38}));Se.position.set(N,W+ie+.7,z),n.add(Se);const Ne=new X({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const be of[-1,1]){const Re=new O(new Le(Y*1.1,.22,.18),Ne);Re.position.set(N,W+ie+1.4,z+be*(ee/2+.18)),n.add(Re)}if(U&&V){const be=new bt({map:gd(U,U==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:pt,depthWrite:!1}),Re=new O(new Ht(7.5,24),be);Re.position.set(N+V*(Y/2+.3),W+Math.min(ie-8,ie*.58),z),Re.rotation.y=V>0?Math.PI/2:-Math.PI/2,n.add(Re),os("showcase-neon",Re.position.x,Re.position.y,Re.position.z)}return dn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:W+ie+2}),Ft("showcase","glassTower"),!0}function ha(N,z,Y,ee=3.2){const ie=N*.5+ee,le=z*.5+ee,b=Math.max(2,Math.abs(ie-le)*.72),U=N>=z?[-ie,0,-le,ie,0,-le,b,Y,0,-ie,0,-le,b,Y,0,-b,Y,0,ie,0,-le,ie,0,le,b,Y,0,ie,0,le,-ie,0,le,-b,Y,0,ie,0,le,b,Y,0,-b,Y,0,-ie,0,le,-ie,0,-le,-b,Y,0]:[-ie,0,-le,ie,0,-le,0,Y,-b,ie,0,-le,ie,0,le,0,Y,b,ie,0,-le,0,Y,b,0,Y,-b,ie,0,le,-ie,0,le,0,Y,b,-ie,0,le,-ie,0,-le,0,Y,-b,-ie,0,le,0,Y,-b,0,Y,b],V=new Wt;return V.setAttribute("position",new Mt(U,3)),V.computeVertexNormals(),V}function xr(N,z,Y,ee,ie,le,b={}){if(On(N,z,Y,ee,12))return!1;const U=Pe(N,z)-.3;if(as(N,z,Y,ee,U+ie+(b.roofH??8.2)+1,6))return!1;const V=b.frontZ??-1,W=new X({map:B,color:b.wallColor??14734788,roughness:.68,metalness:.03}),k=new O(new Le(Y,ie,ee),W);k.position.set(N,U+ie/2,z),k.castShadow=!0,k.receiveShadow=!0,n.add(k);const oe=new X({map:ft,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ae=b.roofH??8.2,j=new O(ha(Y,ee,ae),oe);j.position.set(N,U+ie,z),j.castShadow=!0,j.receiveShadow=!0,n.add(j);const he=new X({color:15985112,roughness:.42,metalness:.05}),Se=new O(new Le(Y+7,.42,1.2),he);Se.position.set(N,U+ie+.12,z+V*(ee*.5+1.4)),n.add(Se);const Ne=Se.clone();Ne.position.z=z-V*(ee*.5+1.4),n.add(Ne);const be=Math.min(18,Y*.38),Re=new O(new Le(be,ie*.55,.32),new X({map:ut,roughness:.34,metalness:.2}));Re.position.set(N+Y*.18,U+ie*.33,z+V*(ee*.5+.22)),n.add(Re);const ot=new O(new Le(5.2,7.2,.28),new X({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ot.position.set(N-Y*.25,U+3.7,z+V*(ee/2+.24)),n.add(ot);const mt=new X({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),yt=new X({color:3353638,roughness:.38});for(const Yt of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(Yt-Y*.18)<be*.45)continue;const Un=new O(new Le(6.2,4.8,.26),yt);Un.position.set(N+Yt,U+ie*.58,z+V*(ee*.5+.28)),n.add(Un);const Nt=new O(new Le(4.8,3.4,.3),mt);Nt.position.copy(Un.position),Nt.position.z+=V*.04,n.add(Nt)}const xt=new X({color:12370619,roughness:.44,metalness:.04}),He=new O(new Le(be*1.18,.12,34),xt);He.position.set(N+Y*.18,Pe(N+Y*.18,z+V*(ee*.5+17))+.11,z+V*(ee*.5+17)),n.add(He);const St=new X({color:5679925,roughness:.86,metalness:.01}),lt=new O(new Le(Y+10,.08,ee+12),St);lt.position.set(N,Pe(N,z)-.18,z),lt.receiveShadow=!0,n.add(lt),lt.renderOrder=-1;const Xt=new X({color:3042609,roughness:.84}),mi=[new X({color:16766544,roughness:.58}),new X({color:16738974,roughness:.58}),new X({color:16314584,roughness:.58})];for(let Yt=0;Yt<9;Yt++){const Un=N-Y*.44+Yt*(Y*.11),Nt=z+V*(ee*.5+2.2+Yt%2*1.5),sn=new O(new qt(1.35+Yt%3*.22,10,7),Yt%4===0?mi[Yt%mi.length]:Xt);sn.position.set(Un,Pe(Un,Nt)+.95,Nt),sn.scale.y=.72,sn.castShadow=!0,n.add(sn)}return dn.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:U+ie+5}),Ft("showcase","lowStorefront"),!0}return ni(45,318,36,84,6404169),ni(116,318,36,84,6074179),ni(44,188,34,84,6798662),ni(118,188,36,84,5941822),ni(43,60,34,82,5679164),ni(118,60,36,82,6864197),nn(18,315,70,54,154,2311775,.72,"HOTEL",1),nn(17,185,72,58,188,1522779,.78,null,0),nn(31,55,44,56,138,2840688,.66,"OPEN",1),nn(24,-75,52,64,182,1913933,.7,null,0),nn(145,315,68,54,116,2776440,.72,null,0),nn(146,185,70,58,146,2314602,.76,null,0),nn(142,55,42,56,156,1590364,.68,"CAFE",-1),nn(134,-75,48,64,114,3688540,.62,null,0),nn(-70,315,52,52,146,2112085,.68,null,0),nn(228,185,48,58,148,3235186,.66,null,0),nn(-78,185,48,56,134,2181730,.68,null,0),nn(236,315,44,54,104,3104884,.66,null,0),xr(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),xr(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),nn(-48,-360,54,56,148,2439765,.58,null,0),nn(172,-430,50,56,132,3817032,.66,"OPEN",-1),ii(112,227,1.35),ii(104,221,1.05),ii(121,233,1.15),mr(112,217,0),ii(50,292,1.2),ii(111,316,.95),ii(48,137,.9),ii(116,102,1.05),mr(47,248,Math.PI/2),Es(57,226),ca(111,260,-Math.PI/2),Ze.add(n),n}function Fu(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=ct(i),l=new P(o.tangent.x,0,o.tangent.z).normalize(),c=new P().crossVectors(jt,l).normalize(),u=o.p.clone().addScaledVector(o.side,e*se.width*.5),f=t==="off"?1:-1,m=u.x+l.x*s*f+c.x*e*r,p=u.z+l.z*s*f+c.z*e*r,x=new P(m,Pe(m,p)+.4,p),M=t==="off"?u:x,g=t==="off"?x:u,d=26,_=[];for(let q=0;q<=d;q++){const Z=q/d,ne=Z*Z*(3-2*Z),de=t==="off"?1-(1-Z)*(1-Z):ne;_.push(new P(_e.lerp(M.x,g.x,Z),_e.lerp(M.y,g.y,de),_e.lerp(M.z,g.z,Z)))}const v=7.4,y=new P,E=new P,T=[],C=[];for(let q=0;q<=d;q++)E.subVectors(_[Math.min(d,q+1)],_[Math.max(0,q-1)]),E.y=0,E.normalize(),y.crossVectors(jt,E).normalize(),T.push(_[q].clone().addScaledVector(y,-v)),C.push(_[q].clone().addScaledVector(y,v));const R={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:_.map(q=>q.clone()),segments:[]};for(let q=0;q<d;q++){const Z=_[q],ne=_[q+1],de=ne.x-Z.x,pe=ne.z-Z.z,Ve=Math.max(1e-4,de*de+pe*pe);R.segments.push({a:Z.clone(),b:ne.clone(),abx:de,abz:pe,lenSq:Ve,u0:q/d,u1:(q+1)/d})}Ts.push(R);const w=[];for(let q=0;q<d;q++){const Z=T[q],ne=C[q],de=T[q+1],pe=C[q+1];w.push(Z.x,Z.y,Z.z,ne.x,ne.y,ne.z,pe.x,pe.y,pe.z),w.push(Z.x,Z.y,Z.z,pe.x,pe.y,pe.z,de.x,de.y,de.z)}const S=new Wt;S.setAttribute("position",new Mt(w,3)),S.computeVertexNormals();const L=new X({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:pt});n.add(new O(S,L));const F=new X({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<d;q++)wn(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,F),wn(n,C[q].clone().setY(C[q].y+1),C[q+1].clone().setY(C[q+1].y+1),.16,F);const H=new X({color:7173241,roughness:.82});for(let q=3;q<d;q+=3){const Z=_[q],ne=Pe(Z.x,Z.z),de=Z.y-ne;if(de<3||On(Z.x,Z.z,3.2,3.2,1.2))continue;const pe=new O(new Qe(.9,1.15,de,8),H);pe.position.set(Z.x,ne+de/2,Z.z),n.add(pe),zn.push({x:Z.x,z:Z.z,hw:1.3,hd:1.3,maxY:Z.y-.9})}const Q=new bt({map:$c(a),transparent:!0,side:pt}),te=new O(new Ht(12,3),Q);te.position.copy(t==="off"?u:x).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-l.x,-l.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const Z=new O(new Qe(.2,.26,6,6),H),ne=t==="off"?u:x;Z.position.set(ne.x+c.x*q*5.4,ne.y+3,ne.z+c.z*q*5.4),n.add(Z)}}function Bv(n,e=1){Fu(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function kv(n,e=-1){Fu(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function Vv(){const n=new nt,e=[],t=new it(14170671),i=new it(15922680),s=new X({color:3883336,roughness:.6,metalness:.3}),r=new bt({map:Gv(),transparent:!0,side:pt}),a=new X({color:4926748,roughness:.9}),o=[new X({color:2055221,roughness:.92}),new X({color:3109954,roughness:.95}),new X({color:2583370,roughness:.9})],l=new X({color:7040883,roughness:.95,side:pt}),c=12,u=[],f=[];let m=0;for(let x=0;x<se.length;x+=c){if(ui(x+c*.5)){m++;continue}const M=ct(x),g=ct(x+c),d=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:_,normal:v,q:y}=Ei(M,g);for(const E of[-1,1]){const T=d.clone().addScaledVector(_,E*se.width*.5).addScaledVector(v,.5);u.push(T),f.push(y),e.push(m%2===0?t:i)}if(m%16===8){const E=(m>>4)%2?1:-1,T=d.clone().addScaledVector(_,E*se.width*.52).addScaledVector(v,.4),C=new nt,R=new O(new Ht(4.4,2.6),r);R.position.y=3.4,R.rotation.y=Math.PI,C.add(R);const w=new Qe(.12,.16,3.4,5);for(const S of[-1.5,1.5]){const L=new O(w,s);L.position.set(S,1.7,0),C.add(L)}C.position.copy(T),C.quaternion.copy(y),n.add(C)}m++}for(let x=0;x<se.length;x+=16){const M=ct(x),g=1+(Math.random()<.5?1:0);for(let d=0;d<g;d++){const _=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,y=M.p.x+M.side.x*v*_+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*_+(Math.random()-.5)*16;if(_o(y,E,18)||On(y,E,12,12,3.5))continue;const T=Pe(y,E);if(Math.random()<.78){const C=.7+Math.random()*1.5,R=new nt,w=2.4+Math.random()*4.2,S=new O(new Qe(.26,.42,w,6),a);S.position.y=w/2,R.add(S);const L=2+Math.floor(Math.random()*3);for(let F=0;F<L;F++){const H=new O(new wi(2.4+Math.random()*1.6-F*.2,4.6+Math.random()*2.4,7),o[(d+F+x)%o.length]);H.position.y=w+F*1.4+1.5,H.rotation.y=Math.random()*Math.PI,R.add(H)}R.position.set(y,T+.6,E),R.scale.setScalar(C),n.add(R)}else{const C=1.4+Math.random()*3.6,R=new O(new Nc(C,0),l);R.position.set(y,T+C*.35,E),R.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),R.scale.set(1,.7+Math.random()*.4,1),n.add(R),zn.push({kind:"rock",x:y,z:E,radius:C*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(ui(M))continue;const g=ct(M),d=ct(M+c),_=g.p.clone().add(d.p).multiplyScalar(.5),{q:v}=Ei(g,d),y=se.width*.5+1.2,E=9,T=new nt,C=new Qe(.4,.55,E,7);for(const F of[-1,1]){const H=new O(C,s);H.position.set(F*y,E/2,0),T.add(H)}const R=y*2,w=new O(new Le(R,1.1,1.1),s);w.position.y=E,T.add(w);const S=new bt({map:$c(p[x]),transparent:!0,side:pt}),L=new O(new Ht(R*.82,3),S);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(_),T.quaternion.copy(v),n.add(T)}if(u.length){const x=new Qe(.18,.24,3,6);x.translate(0,1.5,0);const M=new qt(.34,8,6);M.translate(0,3.2,0);const g=new X({color:10134440,roughness:.7,metalness:.2}),d=new X({roughness:.55}),_=new Qt(x,g,u.length),v=new Qt(M,d,u.length),y=new Vt;for(let E=0;E<u.length;E++)y.position.copy(u[E]),y.quaternion.copy(f[E]),y.updateMatrix(),_.setMatrixAt(E,y.matrix),v.setMatrixAt(E,y.matrix),v.setColorAt(E,e[E]);_.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(_),n.add(v)}return Bv(n),kv(n),Ze.add(n),n}function Gv(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new en(n);return t.colorSpace=Et,t}function $c(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new en(e);return i.colorSpace=Et,i}function Hv(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let l=0;l<a;l++)i.fillStyle=l%2?s:r,i.fillRect(l/a*t.width,0,t.width/a+1,t.height);const o=new en(t);return o.colorSpace=Et,o}function Wv(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*n.width,a=Math.random()*n.height;e.fillRect(r,a,2.4,2.4)}const i=new en(n);return i.colorSpace=Et,i.wrapS=_n,i.repeat.set(3,1),i}function Gt(n,e,t,i,s){const r=new O(new Le(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(i),r.castShadow=!1,r.receiveShadow=!0,n.add(r),r}function Ei(n,e){const t=e.p.clone().sub(n.p).normalize(),i=qc.crossVectors(jt,t).normalize();let s=t.clone().cross(i).normalize();const r=(n.bank+e.bank)*.5;if(Math.abs(r)>.001){const l=new Pi().setFromAxisAngle(t,r);i.applyQuaternion(l),s.applyQuaternion(l)}const a=new Tt().makeBasis(i,s,t),o=new Pi().setFromRotationMatrix(a);return{tangent:t,sideways:i,normal:s,q:o}}function vd(n,e,t,i){const s=[],r=[],a=[],o=se.width*.47;let l=0;for(let f=e;f<=t;f+=8){const m=ct(Math.min(f,t)),p=Ei(m,ct(m.s+2)),x=Math.sin(f*.018)*.04,M=m.p.clone().addScaledVector(p.sideways,-o).addScaledVector(p.normal,.46+x),g=m.p.clone().addScaledVector(p.sideways,o).addScaledVector(p.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const d=(f-e)/64;if(r.push(0,d,1,d),l>0){const _=(l-1)*2,v=l*2;a.push(_,_+1,v,_+1,v+1,v)}l++}const c=new Wt;c.setAttribute("position",new Mt(s,3)),c.setAttribute("uv",new Mt(r,2)),c.setIndex(a),c.computeVertexNormals();const u=new O(c,i);u.receiveShadow=!0,n.add(u)}function Xv(n,e){let t=0;for(const i of se.gaps)vd(n,t,Math.max(t,i.start-4),e),t=i.end+4;vd(n,t,se.length,e)}function qv(n,e,t){const i=ct(e.s+2),{normal:s,q:r}=Ei(e,i),a=new nt;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new O(new Le(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const l=new O(new Le(.55,.12,5.2),t);l.position.set(1.25,0,0),l.rotation.y=.62,a.add(l);const c=new O(new Le(.42,.1,3.8),t);c.position.set(0,.01,-1.9),a.add(c),n.add(a)}function Yv(){const n=new nt;Ze.add(n),dc=0;const e=new X({color:12171149,roughness:.72,metalness:.08}),t=new X({color:9869942,roughness:.78,metalness:.05}),i=new X({color:15255629,roughness:.28,metalness:.72}),s=new X({color:8204328,roughness:.3,metalness:.85}),r=new X({color:6120040,roughness:.5,metalness:.6}),a=new X({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new X({color:14270570,roughness:.35,metalness:.65}),l=new X({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),c=new X({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),u=new X({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),f=new X({color:4935486,roughness:.92,metalness:.04}),m=new X({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new X({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new X({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new X({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new X({color:15919561,roughness:.82,metalness:.02});new X({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const d=new X({map:Mv(),roughness:.74,metalness:.08}),_=new bt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;Xv(n,d);function y(E,T=!1){if(ui(E))return!1;const C=ct(E),R=ct(E+3),{sideways:w,normal:S,q:L}=Ei(C,R),F=C.p,H=Pe(F.x,F.z),Q=F.y-.95;if(Q-H<10)return!1;const te=se.width*(T?.43:.35),q=Q,Z=H+.25,ne=T?.56:.42,de=T?2.4:1.75,pe=T?.52:.36,Ve=[],I=[];for(const xe of[-1,1])if(On(F.x+w.x*xe*te,F.z+w.z*xe*te,de*2.2,de*2.2,1.2))return!1;for(const xe of[-1,1]){const Me=F.clone().addScaledVector(w,xe*te).addScaledVector(S,-.85);Me.y=q;const Ue=new P(Me.x,Z,Me.z);wn(n,Ue,Me,ne,r);const Ke=new O(new Qe(de,de*1.12,pe,12),r);Ke.position.set(Ue.x,H+pe*.5,Ue.z),Ke.receiveShadow=!0,n.add(Ke),Ve.push(Me),I.push(Ue),zn.push({x:Ue.x,z:Ue.z,hw:de*.92,hd:de*.92,maxY:q-.7})}const we=F.clone().addScaledVector(S,-1.05);we.y=q,Gt(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),we,L,a);const ge=I[0].clone();ge.y+=(q-Z)*.28;const Te=I[1].clone();Te.y+=(q-Z)*.28;const $=Ve[0].clone();$.y-=1;const K=Ve[1].clone();if(K.y-=1,wn(n,ge,K,T?.18:.14,l),wn(n,Te,$,T?.18:.14,l),T){const xe=I[0].clone();xe.y+=(q-Z)*.58;const Me=I[1].clone();Me.y+=(q-Z)*.58,wn(n,I[0].clone().setY(Z+1.2),Me,.16,l),wn(n,I[1].clone().setY(Z+1.2),xe,.16,l),wn(n,xe,K,.16,l),wn(n,Me,$,.16,l)}return dc++,!0}for(let E=0;E<se.length;E+=v){if(ui(E+v*.5))continue;const T=ct(E),C=ct(E+v),R=T.p.clone().add(C.p).multiplyScalar(.5),{sideways:w,normal:S,q:L}=Ei(T,C),F=T.p.distanceTo(C.p)+.45,H=Math.floor(E/(v*2))%2?e:t;Gt(n,new P(se.width,.62,F),R.clone().addScaledVector(S,-.05),L,H),Gt(n,new P(se.width-2.8,.08,F*.86),R.clone().addScaledVector(S,.36),L,f),Gt(n,new P(.2,.1,F*.76),R.clone().addScaledVector(w,-se.width*.19).addScaledVector(S,.43),L,f),Gt(n,new P(.2,.1,F*.76),R.clone().addScaledVector(w,se.width*.19).addScaledVector(S,.43),L,f),E%48===0&&(Gt(n,new P(.14,.08,F*.62),R.clone().addScaledVector(w,-se.width*.08).addScaledVector(S,.51),L,M),Gt(n,new P(.14,.08,F*.62),R.clone().addScaledVector(w,se.width*.08).addScaledVector(S,.51),L,M)),E%120===0&&Gt(n,new P(se.width*.42,.07,.72),R.clone().addScaledVector(S,.55),L,g),Gt(n,new P(se.width+1.2,.35,F*.94),R.clone().addScaledVector(S,-.56),L,a),Gt(n,new P(.42,.42,F*.9),R.clone().addScaledVector(w,-se.width*.36).addScaledVector(S,-.78),L,x),Gt(n,new P(.42,.42,F*.9),R.clone().addScaledVector(w,se.width*.36).addScaledVector(S,-.78),L,x);const Q=R.clone().addScaledVector(w,-se.width*.51),te=R.clone().addScaledVector(w,se.width*.51);if(Gt(n,new P(.32,.46,F),Q.clone().addScaledVector(S,.28),L,i),Gt(n,new P(.32,.46,F),te.clone().addScaledVector(S,.28),L,i),Gt(n,new P(.26,.72,F*.94),Q.clone().addScaledVector(S,-.22),L,a),Gt(n,new P(.26,.72,F*.94),te.clone().addScaledVector(S,-.22),L,a),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const Z=new O(new Qe(.16,.2,.12,10),o);Z.position.copy(R).addScaledVector(w,q).addScaledVector(S,.46),Z.quaternion.copy(L),Z.castShadow=!1,n.add(Z)}if(E%72===0&&(Gt(n,new P(.34,1.56,3.4),R.clone().addScaledVector(w,-se.width*.66).addScaledVector(S,1.16),L,s),Gt(n,new P(.34,1.56,3.4),R.clone().addScaledVector(w,se.width*.66).addScaledVector(S,1.16),L,s),Gt(n,new P(.18,.18,4.4),R.clone().addScaledVector(w,-se.width*.62).addScaledVector(S,1.94),L,s),Gt(n,new P(.18,.18,4.4),R.clone().addScaledVector(w,se.width*.62).addScaledVector(S,1.94),L,s),Gt(n,new P(.12,.12,4),R.clone().addScaledVector(w,-se.width*.62).addScaledVector(S,1.38),L,i),Gt(n,new P(.12,.12,4),R.clone().addScaledVector(w,se.width*.62).addScaledVector(S,1.38),L,i),wn(n,R.clone().addScaledVector(w,-se.width*.58).addScaledVector(S,-1.08),R.clone().addScaledVector(w,se.width*.58).addScaledVector(S,-1.08),.11,l),wn(n,R.clone().addScaledVector(w,-se.width*.48).addScaledVector(S,-1),R.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,l),wn(n,R.clone().addScaledVector(w,se.width*.48).addScaledVector(S,-1),R.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,l)),E%96===0){const q=new O(new hn(1,28),_);q.rotation.x=-Math.PI/2,q.position.set(R.x,-4.72,R.z),q.scale.set(se.width*.9,Math.max(10,F*2.2),1),q.rotation.z=Math.atan2(Ei(T,C).tangent.x,Ei(T,C).tangent.z),n.add(q)}if(E%144===0){const q=R.clone().addScaledVector(w,-se.width*.74).addScaledVector(S,2),Z=R.clone().addScaledVector(w,se.width*.74).addScaledVector(S,2);wn(n,q.clone().addScaledVector(S,-1.2),q.clone().addScaledVector(S,1.1),.12,s),wn(n,Z.clone().addScaledVector(S,-1.2),Z.clone().addScaledVector(S,1.1),.12,s),Gt(n,new P(.46,.72,.46),q.clone().addScaledVector(S,1.15),L,c),Gt(n,new P(.46,.72,.46),Z.clone().addScaledVector(S,1.15),L,c)}if(E%288===0){const q=R.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(S,5.2);Gt(n,new P(.44,.44,.44),q.clone(),L,m),wn(n,q.clone().addScaledVector(S,-.2),R.clone().addScaledVector(S,1),.05,l)}E%48===0&&y(E+v*.5,!1),E%168===0&&!ui(E+16)&&qv(n,ct(E+5),u)}for(const E of se.gaps){const T=ct(E.start-3),C=ct(E.end+3);for(const R of[T,C]){const w=ct(R.s+2),{normal:S,q:L}=Ei(R,w);Gt(n,new P(se.width-1.2,.08,4.6),R.p.clone().addScaledVector(S,.54),L,c),Gt(n,new P(se.width*.62,.09,1.3),R.p.clone().addScaledVector(S,.62).addScaledVector(R.tangent,R===T?-6.3:6.3),L,g);for(const F of[-se.width*.42,0,se.width*.42]){const H=R.p.clone().addScaledVector(R.side,F).addScaledVector(S,2.35);Gt(n,new P(.46,.46,.46),H,L,F===0?p:c)}y(R.s+(R===T?-9:9),!0),y(R.s+(R===T?-24:24),!0)}}return n}function Nu(n=13710372,e=7740696){const t=new nt,i=new X({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new X({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new X({color:329225,roughness:.52,metalness:.12}),a=new X({color:1053463,roughness:.38,metalness:.34}),o=new X({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),l=new X({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),c=new X({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),u=new X({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),f=new X({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),m=new X({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),p=new X({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new X({color:329225,roughness:.44,metalness:.22}),M=new O(new hn(3.65,36),new bt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(y,E,T,C,R=null,w=null)=>{const S=new O(E,T);return S.name=y,S.position.copy(C),R&&S.rotation.set(R.x||0,R.y||0,R.z||0),w&&S.scale.copy(w),t.add(S),S},d=(y,E,T,C,R,w,S=0,L=0,F=0)=>g(y,new Le(E.x,E.y,E.z),T,new P(C,R,w),new P(S,L,F));d("low black undertray",new P(5.25,.28,8.45),r,0,.45,-.08),d("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),d("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),d("front black splitter",new P(5.25,.13,.78),r,0,.35,-5.6),d("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),d("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),d("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),d("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),d("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),d("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),d("black rear fascia",new P(4.72,.66,.2),a,0,1.02,4.04),d("deep rear bumper",new P(5.32,.38,.48),l,0,.58,4.23),d("front windshield",new P(2.8,.13,1.15),c,0,1.78,-1.25,-.48),d("roof glass",new P(2.34,.18,1.55),c,0,2.08,-.2,-.13),d("left side window",new P(.12,.78,1.9),c,-1.28,1.76,-.15,-.08,.04),d("right side window",new P(.12,.78,1.9),c,1.28,1.76,-.15,-.08,-.04),d("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),d("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),d("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let y=0;y<7;y++)d("black rear deck louver",new P(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);d("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])d("spoiler side endplate",new P(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])d("thin hood crease",new P(.08,.04,2.55),x,y*.36,1.27,-3.45,-.15),d("door seam",new P(.035,.68,1.75),x,y,1.16,-.2),d("side intake",new P(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])d("pop up headlight glass",new P(.62,.12,.18),m,y,1.02,-5.28,-.16);d("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])d("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(y)>1?u:f,y,1.08,4.24);d("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),d("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),d("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),d("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])d("angular side mirror arm",new P(.42,.08,.08),x,y,1.62,-1.55,0,0,y<0?-.14:.14),d("blue tinted side mirror",new P(.12,.34,.46),c,y*1.03,1.62,-1.65,0,y<0?.24:-.24),d("flush door handle",new P(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])d("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,y),d("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,y);d("black license recess",new P(.9,.24,.08),a,0,.76,4.31);const _=[],v=(y,E,T=!1)=>{const C=new nt;C.name=T?"steering front wheel assembly":"rear wheel assembly",C.position.set(y,.54,E);const R=new O(new Qe(.88,.88,.62,28),r);R.name="wide performance tire",R.rotation.z=Math.PI/2,C.add(R);const w=new O(new Ms(.88,.06,10,32),r);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,C.add(w);const S=new O(new Qe(.42,.42,.66,24),o);S.name="chrome wheel rim",S.rotation.z=Math.PI/2,C.add(S);const L=new O(new Qe(.56,.56,.08,24),p);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=y>0?-.05:.05,C.add(L);for(let Q=0;Q<8;Q++){const te=new O(new Le(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=Q/8*Math.PI*2,te.position.set(y>0?.035:-.035,0,.22),C.add(te)}const F=new O(new Le(.1,.22,.18),f);F.name="small brake caliper",F.position.set(y>0?-.39:.39,.18,-.38),C.add(F);const H=new O(new Qe(.17,.17,.72,18),l);H.name="dark center cap",H.rotation.z=Math.PI/2,C.add(H),t.add(C),T&&_.push(C)};for(const y of[-2.4,2.4])v(y,-2.65,!0),v(y,2.42,!1);t.userData.frontWheels=_,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new O(new Qe(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),Ze.add(t),t}function $v(){const n=new nt,e=new X({color:3949112,roughness:.62,metalness:.3}),t=new X({color:460551,roughness:.55}),i=new X({color:3162419,roughness:.5,metalness:.42}),s=new X({color:16767297,roughness:.38,metalness:.25}),r=new X({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new X({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new X({color:1118995,roughness:.7,metalness:.05}),l=new O(new Le(2.2,.24,2.2),e);l.position.set(0,-.78,-2.2),n.add(l);const c=new O(new Le(.16,.028,1.92),i);c.position.set(0,-.64,-2.28),n.add(c);const u=new O(new Le(2.55,.18,.52),t);u.position.set(0,-.48,-1.25),u.rotation.x=-.08,n.add(u);const f=new O(new Ht(2.8,.82,1,1),a);f.position.set(0,-.17,-1.08),f.rotation.x=-.36,n.add(f);const m=new O(new Ms(.36,.035,12,48),o);m.position.set(0,-.46,-1.02),m.rotation.x=Math.PI/2.75,n.add(m);for(let p=0;p<3;p++){const x=new O(new Le(.34,.025,.035),i);x.position.copy(m.position),x.rotation.copy(m.rotation),x.rotation.z+=p/3*Math.PI*2,n.add(x)}for(let p=0;p<6;p++){const x=new O(new Qe(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),n.add(x)}for(const p of[-1.08,1.08]){const x=new O(new Qe(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(p,-.68,-1.58),n.add(x);const M=new O(new Ms(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(p*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const p of[-1.14,-.84,.84,1.14]){const x=new O(new Qe(.035,.04,.028,8),i);x.position.set(p,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const p of[-.52,.52]){const x=new O(new qt(.045,12,8),r);x.position.set(p,-.34,-1.22),n.add(x)}n.position.set(0,0,0),De.add(n),on=n}function Zv(){const n=new X({color:16119285,roughness:.35,metalness:.25}),e=new X({color:1184274,roughness:.45}),t=new X({map:_v(),roughness:.42,metalness:.05}),i=new X({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=ct(0),r=new Tt().makeBasis(s.side,jt,s.tangent),a=new Pi().setFromRotationMatrix(r),o=new nt;for(const u of[-se.width*.58,se.width*.58]){const f=new O(new Le(.8,11,.8),n);f.position.copy(s.p).addScaledVector(s.side,u).addScaledVector(jt,5.4),f.quaternion.copy(a),o.add(f)}const l=new O(new Le(se.width+3,.8,1),t);l.position.copy(s.p).addScaledVector(jt,11.2),l.quaternion.copy(a),o.add(l);const c=new O(new Le(se.width+1.2,1.4,.18),e);c.position.copy(s.p).addScaledVector(jt,12.5).addScaledVector(s.tangent,-.55),c.quaternion.copy(a),o.add(c);for(const u of[-se.width*.38,0,se.width*.38]){const f=new O(new qt(.32,16,10),i);f.position.copy(s.p).addScaledVector(s.side,u).addScaledVector(jt,10.25),o.add(f)}return Ze.add(o),o}function Zc(n,e,t){const i={body:new X({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new X({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new X({color:329225,roughness:.52,metalness:.12}),dark:new X({color:1053463,roughness:.38,metalness:.34}),chrome:new X({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new X({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new X({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new X({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new X({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new X({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new X({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new X({color:329225,roughness:.44,metalness:.22})},s=new O(new hn(3.65,36),new bt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const r=(c,u,f,m,p=null,x=null)=>{const M=new O(u,f);return M.name=c,M.position.copy(m),p&&M.rotation.set(p.x||0,p.y||0,p.z||0),x&&M.scale.copy(x),n.add(M),M},a=(c,u,f,m,p,x,M,g,d=0,_=0,v=0)=>r(c,new Le(u,f,m),p,new P(x,M,g),{x:d,y:_,z:v}),o=[];function l(c,u,f,m=.88,p=.62){const x=new nt;x.name=f?"steering front wheel assembly":"rear wheel assembly",x.position.set(c,m*.62+.18,u);const M=new O(new Qe(m,m,p,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new O(new Ms(m,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const d=new O(new Qe(m*.48,m*.48,p+.04,24),i.chrome);d.name="chrome rim",d.rotation.z=Math.PI/2,x.add(d);const _=new O(new Qe(m*.62,m*.62,.08,24),i.disc);_.name="brake disc",_.rotation.z=Math.PI/2,_.position.x=c>0?-.05:.05,x.add(_);for(let y=0;y<8;y++){const E=new O(new Le(.08,.055,p),i.chrome);E.name="wheel spoke",E.rotation.x=y/8*Math.PI*2,E.position.set(c>0?.035:-.035,0,m*.25),x.add(E)}const v=new O(new Qe(.17,.17,p+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),f&&o.push(x),x}return{mats:i,part:r,box:a,wheel:l,frontWheels:o}}function Kv(n=15616818,e=2434871){const t=new nt,i=Zc(t,n,e),{mats:s,box:r}=i;r("low undertray",4.6,.26,9.2,s.black,0,.42,0),r("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),r("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),r("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),r("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),r("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),r("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),r("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),r("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),r("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),r("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),r("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),r("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),r("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),r("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let a=0;a<6;a++)r("engine deck vent",2.9,.1,.16,s.dark,0,1.47+a*.008,1.3+a*.42,-.05);r("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),r("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),r("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const a of[-.72,.72])r("slit headlight",.85,.09,.14,s.headLamp,a,.92,-6.1,-.1);for(const a of[-1.5,1.5])r("beltline chrome strip",.05,.06,5.4,s.chrome,a*1.36,1.3,-.4);for(const a of[-.4,.4]){const o=new O(new Qe(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(a,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),Ze.add(t),t}function Jv(n=4165830,e=15908108){const t=new nt,i=Zc(t,n,e),{mats:s,box:r}=i;r("undertray",5,.3,7.6,s.black,0,.48,0),r("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),r("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),r("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),r("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),r("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),r("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),r("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),r("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),r("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),r("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),r("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),r("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),r("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const a of[-2.05,-.85,.85,2.05]){const o=new O(new Qe(.21,.21,.1,18),Math.abs(a)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(a,1.28,3.78),t.add(o)}for(const a of[-1.7,1.7])r("square headlamp",.7,.3,.12,s.headLamp,a,1.22,-4.62);r("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const a of[-1,1]){const o=new O(new Qe(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(a*2.62,.55,.4),t.add(o),r("side pipe heat shield",.16,.28,2.4,s.dark,a*2.62,.72,.4),r("fender flare front",.5,.6,1.6,s.body,a*2.6,1,-2.5,-.03),r("fender flare rear",.55,.68,1.9,s.body,a*2.62,1.05,2.3,-.03),r("racing stripe",.8,.02,6.8,s.trim,a*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),Ze.add(t),t}function jv(n=16764159,e=526344){const t=new nt,i=Zc(t,n,e),{mats:s,box:r}=i;r("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),r("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),r("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),r("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),r("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),r("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),r("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),r("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),r("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),r("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),r("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),r("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),r("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),r("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),r("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const a of[-1,1]){const o=new O(new Qe(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=a*.42,o.position.set(a*.75,1.85,.35),t.add(o),r("front fender pod",.62,.4,1.5,s.body,a*1.85,.95,-2.15,-.05),r("rear fender pod",.68,.46,1.7,s.body,a*1.9,1,2.15,-.05),r("pod brace arm",.5,.1,.12,s.steel,a*1.45,.98,-2.15),r("number roundel",.04,.5,.5,s.trim,a*1.79,1.05,.2)}for(const a of[-.85,.85])r("bug eye headlamp",.34,.26,.14,s.headLamp,a,1.08,-3.66),r("tail lamp block",.4,.22,.1,Math.abs(a)>.5?s.tailHot:s.tailWarm,a*1.6,1.14,3.14);{const a=new O(new Qe(.15,.15,.5,14),s.chrome);a.name="single stinger exhaust",a.rotation.x=Math.PI/2,a.position.set(.65,.78,3.28),t.add(a)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),Ze.add(t),t}const bs=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>Nu(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>Kv()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>Jv()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>jv()}];let $i=_e.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function Xi(){return bs[$i].stats}const zu=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],In=zu.map((n,e)=>({...n,idx:e,mesh:Nu(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),Qv=In[0].mesh;let Rt=bs[$i].build();function e2(n){$i=_e.clamp(n,0,bs.length-1),localStorage.setItem("steel-ribbon-carmodel",String($i));const e=Rt.visible;$s(Rt),Rt=bs[$i].build(),Rt.visible=e,typeof gc=="function"&&gc()}for(const n of In)n.mesh.visible=!1,Ze.add(n.mesh);function yo(n){for(const e of In)e.mesh.visible=n}const t2=[10,6,4,2];let Ut=null;try{Ut=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function aa(){return Ut?.active?Ut.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function Ou(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Ut))}function n2(){Ut={division:aa(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},Ou()}function Bu(n){return["One","Two","Three","Four"][_e.clamp(n,1,4)-1]}function ku(){return[{key:"you",label:"You",pts:Ut?.points.you??0},...zu.map(e=>({key:e.key,label:e.label,pts:Ut?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Rt.visible=!1;Dv();Lv();ke.signs=0;oo.length=0;Iv();Uv();Ov();let _d=null,Md=null,yd=null,on=null,dl=null;const $t=[];$v();function $s(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Ze.remove(n))}const js=[],ta=[];let Sd=null;function i2(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new en(n);return t.colorSpace=Et,t}function s2(n,e){if(ui(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of Ts)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function r2(n){const e=new X({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:pt}),t=new Qe(.09,.12,1.05,6),i=new X({color:4210757,roughness:.55,metalness:.5}),s=6;let r=0,a=0;const o=new Qt(t,i,Math.ceil(se.length/12*2)+8),l=new Vt;for(const c of[-1,1]){const u=c*(se.width*.5+.55),f=[],m=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],d=x[M+1];f.push(g.x,g.y+1.12,g.z,d.x,d.y+1.12,d.z,d.x,d.y+1.5,d.z),f.push(g.x,g.y+1.12,g.z,d.x,d.y+1.5,d.z,g.x,g.y+1.5,g.z)}r++}};let p=[];for(let x=0;x<=se.length;x+=s){if(s2(x%se.length,c)){m(p),p=[];continue}const M=ct(x%se.length);if(p.push(M.p.clone().addScaledVector(M.side,u).addScaledVector(jt,.58)),x%12===0){const g=p[p.length-1];l.position.set(g.x,g.y+.95,g.z),l.updateMatrix(),o.setMatrixAt(a++,l.matrix)}}if(m(p),f.length){const x=new Wt;x.setAttribute("position",new Mt(f,3)),x.computeVertexNormals(),n.add(new O(x,e))}}o.count=a,o.instanceMatrix.needsUpdate=!0,n.add(o),ke.railRuns=r,ke.railPosts=a}function a2(){js.length=0,ta.length=0;const n=new nt,e=new bt({map:i2(),transparent:!0,depthWrite:!1,side:pt,blending:Kn,opacity:.9}),t=new Ht(3.6,5.4);t.rotateX(-Math.PI/2);for(let l=170;l<se.length-60;l+=290){if(se.gaps.some(x=>l>x.start-70&&x.end+70>l))continue;const c=[-.24,0,.24][js.length%3]*se.width,u=ct(l),f=new O(t,e),m=new P().crossVectors(u.side,u.tangent).normalize();m.y<0&&m.multiplyScalar(-1);const p=new Tt().makeBasis(u.side,m,new P().crossVectors(u.side,m).normalize());f.quaternion.setFromRotationMatrix(p),f.position.copy(u.p).addScaledVector(u.side,c).addScaledVector(m,.84),n.add(f),js.push({s:l,lat:c})}const i=new qt(.17,8,6),s=new X({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),r=Math.max(60,Math.round(se.length/24));{const l=new Qt(i,s,r*2),c=new Vt;let u=0;for(let f=0;f<r;f++){const m=f/r*se.length;if(ui(m))continue;const p=ct(m);for(const x of[-1,1])c.position.copy(p.p).addScaledVector(p.side,x*(se.width*.5+.22)).addScaledVector(jt,.78),c.updateMatrix(),l.setMatrixAt(u++,c.matrix)}l.count=u,l.instanceMatrix.needsUpdate=!0,n.add(l)}const a=new Qe(.09,.12,1.5,8),o=new X({color:2500134,roughness:.6,metalness:.4});for(const l of se.gaps){const c=ct(Math.max(6,l.start-22));for(const u of[-1,1]){const f=new X({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),m=new nt,p=new O(a,o),x=new O(new qt(.3,10,8),f);p.position.y=.75,x.position.y=1.65,m.add(p),m.add(x),m.position.copy(c.p).addScaledVector(c.side,u*(se.width*.5+.55)).addScaledVector(jt,.55),n.add(m),ta.push(f)}}return r2(n),Ze.add(n),n}Bn(new Vt,n=>{if(!ta.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of ta)t.emissiveIntensity=e});function oa(n){return Yi=_e.clamp(n,0,ys.length-1),se=ys[Yi],zn.length=0,Ts.length=0,$s(_d),$s(Md),$s(yd),$s(Sd),_d=Yv(),Md=Zv(),yd=Vv(),Sd=a2(),Jc(),Ye.trackName.textContent=se.name,Ye.courseName&&(Ye.courseName.textContent=se.name),Ye.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Yi)}),se.name}oa(0);function o2(){dl&&Ze.remove(dl),$t.length=0;const n=new nt,e=new X({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new bt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:pt,blending:Kn}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const r=i[s],a=Pe(r.x,r.z)+4.2,o=new nt,l=new O(new Ms(5.6,.22,12,52),e.clone());l.rotation.y=r.yaw,o.add(l);const c=new O(new hn(4.7,32),t.clone());c.rotation.y=r.yaw,o.add(c);const u=new X({color:1120288,roughness:.42,metalness:.55});for(const m of[-5.1,5.1]){const p=new O(new Qe(.11,.16,6.2,8),u);p.position.set(Math.cos(r.yaw)*m,-1.1,Math.sin(r.yaw)*m),o.add(p)}const f=new O(new qt(.45,16,10),e.clone());f.position.y=4.1,o.add(f),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,n.add(o),$t.push({...r,y:a,radius:8.5,marker:o,collected:!1})}Bn(n,s=>{for(let r=0;r<$t.length;r++){const a=$t[r],o=r===h.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(l=>{l.material?.emissive&&(l.material.emissiveIntensity=o?2.4:.65)})}}),Ze.add(n),dl=n}o2();function l2(){const n=new nt,e=new X({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,r=-1330+Math.random()*1620,a=15+Math.random()*12;if(On(s,r,a*2+14,a*2+14,10)||Cn(s,r,a).clearance<-6||$t.some(u=>Math.hypot(u.x-s,u.z-r)<a+26)||or.some(u=>Math.hypot(u.x-s,u.z-r)<u.rx+a+60)||dn.some(u=>Math.abs(u.x-s)<u.hw+a+2&&Math.abs(u.z-r)<u.hd+a+2)||Ti.some(u=>{const f=u.radius!=null?u.radius:Math.max(u.hw??0,u.hd??0);return Math.hypot(u.x-s,u.z-r)<f+a+2})||Or.some(u=>Math.hypot(u.x-s,u.z-r)<(u.radius||4)+a+2))continue;const o=Pe(s,r);if(Math.max(Math.abs(Pe(s+a,r)-o),Math.abs(Pe(s-a,r)-o),Math.abs(Pe(s,r+a)-o),Math.abs(Pe(s,r-a)-o))>1.7)continue;const l=new O(new po(a*.96,a*1.18,36),e);l.rotation.x=-Math.PI/2,l.position.set(s,o+.09,r),l.renderOrder=-4,n.add(l);const c=new O(new hn(a,36),Lu(Math.max(1.2,a/13)));c.rotation.x=-Math.PI/2,c.position.set(s,o+.15,r),c.renderOrder=-3,n.add(c),Du(s,r,a*.98),t++}ke.ponds=t,Ze.add(n),Jc()}l2();const c2=new bt({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),Ja=Array.from({length:42},()=>{const n=new O(new qt(.14,6,5),c2);return n.visible=!1,Ze.add(n),{mesh:n,life:0,velocity:new P}}),h2=new bt({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:pt}),fc=Array.from({length:14},()=>{const n=new O(new po(.82,1,28),h2.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Ze.add(n),{mesh:n,life:0,maxLife:1}});function Vu(n,e,t=1){const i=fc.find(s=>s.life<=0)||fc[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,Pe(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function d2(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=Ja.find(r=>r.life<=0)||Ja[i%Ja.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}Vu(n.x,n.z,1.6)}Bn(new Vt,(n,e)=>{for(const t of Ja)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of fc)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const fr=new hv(Zt);fr.addPass(new dv(Ze,De));const Gu=new ar(new Ee(window.innerWidth,window.innerHeight),.4,.72,.86);fr.addPass(Gu);fr.addPass(new uv);const u2={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uBoost;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 toCenter = uv - 0.5;
      float dist = length(toCenter);

      // Chromatic aberration: split the channels outward, scaled by speed and lens distance.
      float aberration = (0.0006 + uSpeed * 0.0018 + uBoost * 0.0024) * dist;
      vec2 dir = normalize(toCenter + 1e-5);
      float r = texture2D(tDiffuse, uv - dir * aberration).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv + dir * aberration).b;
      vec3 color = vec3(r, g, b);

      // Contrast + saturation lift for a richer, punchier image.
      color = (color - 0.5) * 1.07 + 0.5;
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luma), color, 1.1);

      // Speed-reactive vignette that closes in as you go faster, selling the rush.
      float vig = smoothstep(0.98, 0.34, dist * (1.0 + uSpeed * 0.42 + uBoost * 0.3));
      color *= mix(1.0, vig, 0.4);

      // Fine animated film grain, strongest in the shadows.
      float grain = hash(uv * vec2(1920.0, 1080.0) + uTime * 60.0) - 0.5;
      color += grain * 0.02 * (1.0 - luma * 0.7);

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `},Dr=new bu(u2);fr.addPass(Dr);const f2=new X({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Br=Array.from({length:72},()=>{const n=new O(new qt(.1,8,5),f2);return n.visible=!1,Ze.add(n),{mesh:n,life:0,velocity:new P}}),p2=new bt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:pt}),kr=Array.from({length:90},()=>{const n=new O(new hn(1,18),p2.clone());return n.visible=!1,Ze.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),m2=new X({color:2962232,roughness:.58,metalness:.34}),Vr=Array.from({length:48},()=>{const n=new O(new Le(.18,.08,.26),m2);return n.visible=!1,Ze.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Xe=null;function Hu(){if(Xe)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=(M,g)=>{const d=n.createOscillator(),_=n.createGain();return d.type=M,_.gain.value=g,d.connect(_),_.connect(t),d.start(),{o:d,g:_}},r=s("sawtooth",.5),a=s("square",.26),o=s("triangle",.1),l=n.createBuffer(1,n.sampleRate*2,n.sampleRate),c=l.getChannelData(0);for(let M=0;M<c.length;M++)c[M]=Math.random()*2-1;const u=(M,g,d,_)=>{const v=n.createBufferSource(),y=n.createBiquadFilter(),E=n.createGain();return v.buffer=l,v.loop=!0,v.playbackRate.value=_,y.type=M,y.frequency.value=g,y.Q.value=d,E.gain.value=1e-4,v.connect(y),y.connect(E),E.connect(e),v.start(),{filter:y,gain:E}},f=u("bandpass",900,.6,1),m=u("highpass",1800,.8,.82),p=u("bandpass",300,1.4,.5),x=n.createGain();x.gain.value=1e-4,x.connect(e),Xe={ctx:n,master:e,engine:r.o,engineGain:i,filter:t,rumble:r,growl:a,whine:o,wind:f,skid:m,boost:p,musicGain:x,nextNote:0,beat:0,prevBoost:!1}}function lr(){Xe||Hu(),Xe?.ctx.state==="suspended"&&Xe.ctx.resume().catch(()=>{})}function Gr(n){if(!Xe)return;const{ctx:e}=Xe,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Xe.master),t.start(),t.stop(e.currentTime+.24)}function x2(){if(!Xe)return;const{ctx:n}=Xe,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Xe.master),e.start(),e.stop(n.currentTime+.6)}function g2(){if(!Xe)return;const n=Xe.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=Wu(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Xe.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),r=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),r.gain.setValueAtTime(.22,n.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(r).connect(Xe.master),s.start(),s.stop(n.currentTime+.26)}let ul=null;function Wu(){if(ul)return ul;const n=Xe.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return ul=e}function v2(n=1){if(!Xe)return;const{ctx:e}=Xe,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=Wu(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Xe.master),t.start(e.currentTime,Math.random()*1.2,.36)}const bd={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function wd(n,e,t,i,s,r){const{ctx:a}=Xe,o=a.createOscillator(),l=a.createBiquadFilter(),c=a.createGain();o.type=i,o.frequency.value=n,l.type="lowpass",l.frequency.value=r,c.gain.setValueAtTime(1e-4,e),c.gain.linearRampToValueAtTime(s,e+.02),c.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(l),l.connect(c),c.connect(Xe.musicGain),o.start(e),o.stop(e+t+.05)}function _2(){const{ctx:n}=Xe,e=60/92/2;for(Xe.nextNote<n.currentTime-1&&(Xe.nextNote=n.currentTime+.08);Xe.nextNote<n.currentTime+.35;){const t=Xe.beat%32,i=t/8|0;t%4===0&&wd(bd.bass[i],Xe.nextNote,.5,"triangle",.5,420),wd(bd.arps[i][t%4],Xe.nextNote,.19,"sawtooth",.16,1300),Xe.nextNote+=e,Xe.beat++}}function Qs(n,e=18){const t=Math.min(e,Br.length);for(let i=0;i<t;i++){const s=Br.find(r=>r.life<=0)||Br[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Xu(n,e=10,t=1){const i=Math.min(e,kr.length);for(let s=0;s<i;s++){const r=kr.find(a=>a.life<=0)||kr[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function M2(n,e=8,t=1){const i=Math.min(e,Vr.length);for(let s=0;s<i;s++){const r=Vr.find(a=>a.life<=0)||Vr[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function y2(n,e=Math.abs(h.speed),t="CRASH"){const i=_e.clamp(Math.abs(e)/70,.18,1.45);h.collisionHits++,h.collisionDrama=Math.max(h.collisionDrama,i),h.cameraShake=Math.max(h.cameraShake,.25+i*.45),h.damage=_e.clamp(h.damage+i*3.6,0,100),h.message=t,h.messageTimer=Math.max(h.messageTimer,.7),Qs(n,Math.round(10+i*24)),Xu(n,Math.round(5+i*12),i),M2(n,Math.round(3+i*8),i),Gr(18+i*34)}function S2(n){for(const e of Br){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of kr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(De.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of Vr)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function b2(){if(!Xe)return;const{ctx:n}=Xe,e=n.currentTime,t=h.mode==="race"||h.mode==="roam"||h.mode==="paused",i=h.tachRpm||900,s=_e.clamp((i-900)/6600,0,1),r=Math.abs(h.speed),a=h.mode==="roam"&&h.waterDepth||0,o=46+s*142;Xe.rumble.o.frequency.setTargetAtTime(o,e,.03),Xe.growl.o.frequency.setTargetAtTime(o*1.5+3.2,e,.03),Xe.whine.o.frequency.setTargetAtTime(o*4.03,e,.03),Xe.whine.g.gain.setTargetAtTime(.04+s*.17,e,.08),Xe.filter.frequency.setTargetAtTime((420+s*2400+r*5)*(1-.6*a),e,.06),Xe.engineGain.gain.setTargetAtTime((t&&h.mode!=="paused"?.05+s*.052:1e-4)*(1-.42*a),e,.07),Xe.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Xe.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const l=h.mode==="roam"?h.roamSlip:h.grounded?Math.min(1,Math.abs(h.lateralVel)/15):0;Xe.skid.gain.gain.setTargetAtTime(t&&l>.32?(l-.32)*.15:1e-4,e,.09),h.boosting&&!Xe.prevBoost&&x2(),Xe.prevBoost=!!h.boosting,Xe.boost.gain.gain.setTargetAtTime(t&&h.boosting?.15:1e-4,e,h.boosting?.05:.22),Xe.boost.filter.frequency.setTargetAtTime(h.boosting?420+r*3:260,e,.1),Xe.musicGain.gain.setTargetAtTime(h.mode==="menu"?.16:.028,e,.5),_2()}function na(n=!1,e=!1,t=!1){Hu(),lr(),wt.clear(),sa();const i=n||e;h.seasonRace=t&&!i;for(let r=0;r<In.length;r++){const a=In[r];a.distance=i?-900:-26-r*7,a.finished=0,a.mesh.visible=!i}Object.assign(h,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=ct(h.s);h.y=s.p.y+2.1,h.yVel=0,h.ghostRec=[],W2(),X2(),Ye.menu.classList.add("hidden"),Ye.result.classList.add("hidden"),Ye.resultStats.innerHTML="",Ye.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",Ye.trackName.textContent=se.name,Rt.visible=!1,on&&(on.visible=!0),document.body.classList.remove("roam-mode"),Li(),window.__freeCam=!1}function Kc(){lr(),h.mode="roam",h.practice=!0,h.freeRun=!1,wt.clear(),sa();let n=80,e=338;Cn(n,e,6).clearance<6&&(n=80,e=320),h.roamPos.set(n,Pe(n,e),e),h.roamYaw=0,h.camYaw=h.roamYaw,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,Fe.zoom=0,h.wheelSteer=0,h.speed=0,h.boost=1,h.damage=0,h.cameraShake=0,h.collisionDrama=0,h.collisionHits=0,h.collisionCooldown=0,h.objectiveIndex=0,h.objectiveHits=0,h.objectiveLap=1,h.roamAir=!1,h.roamVy=0,h.roamPrevY=null,h.roamAirT=0;for(const s of $t)s.collected=!1;h.message="",h.messageTimer=0,yo(!1),Rt.visible=!0,on&&(on.visible=!1),document.body.classList.add("roam-mode"),Li(),window.__freeCam=!1,Ye.menu.classList.add("hidden"),Ye.result.classList.add("hidden"),Ye.position.textContent="FREE ROAM",Ye.trackName.textContent="City Streets",xs();const t=Math.sin(h.roamYaw),i=-Math.cos(h.roamYaw);De.position.set(h.roamPos.x-t*17,h.roamPos.y+7.2,h.roamPos.z-i*17),mc(),De.lookAt(h.roamPos.x+t*13,h.roamPos.y+2.45,h.roamPos.z+i*13),De.fov=69,De.updateProjectionMatrix()}function xs(){Rt.position.set(h.roamPos.x,h.roamPos.y+.3-h.roamSuspension*.45-(h.waterDepth||0)*.38,h.roamPos.z),Rt.quaternion.setFromAxisAngle(jt,-h.roamYaw),Rt.rotateZ(-h.wheelSteer*_e.clamp(Math.abs(h.speed)/90,0,1)*.1),Rt.rotateX(h.roamAir?_e.clamp(-h.roamVy*.014,-.3,.34):_e.clamp(h.roamSuspension,-.16,.22))}function qu(n,e){let t=null;for(const s of Ts)for(const r of s.segments){const a=n-r.a.x,o=e-r.a.z,l=_e.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),c=r.a.x+r.abx*l,u=r.a.z+r.abz*l,f=Math.hypot(n-c,e-u);if(f>s.halfW+xn*1.15)continue;const m=_e.lerp(r.a.y,r.b.y,l),p=_e.lerp(r.u0,r.u1,l),x=f+Math.max(0,Pe(n,e)-m)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:m,u:p,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function Yu(n,e,t=Pe(n,e),i=!1){let s=null;const r=10;for(let o=0;o<se.length;o+=r){if(ui(o+r*.5))continue;const l=ct(o),c=ct(o+r),u=c.p.x-l.p.x,f=c.p.z-l.p.z,m=Math.max(1e-4,u*u+f*f),p=_e.clamp(((n-l.p.x)*u+(e-l.p.z)*f)/m,0,1),x=l.p.x+u*p,M=l.p.z+f*p,g=n-x,d=e-M,_=Math.hypot(g,d);if(_>se.width*.5+xn*.45)continue;const v=_e.lerp(l.p.y,c.p.y,p)+.58;if(!i&&t<v-5)continue;const y=new P(f,0,-u).normalize(),E=_e.clamp(g*y.x+d*y.z,-se.width*.44,se.width*.44);(!s||_<s.dist)&&(s={kind:"track",y:v,s:o+r*p,lateral:E,tangentX:u,tangentZ:f,dist:_})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function us(n,e,t=h.roamPos.y){const i=Pe(n,e);let s={kind:"ground",y:i};const r=qu(n,e);r&&r.y>=i-1.2&&(s=r);const a=Yu(n,e,Math.max(t,s.y));return!(s.kind==="ramp"&&s.rampType==="off")&&a&&a.y>=s.y-.8&&(s=a),s}function Td(n){if(n.rampType==="off")return!1;const e=Math.sin(h.roamYaw)*n.tangentX+-Math.cos(h.roamYaw)*n.tangentZ;if(h.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=ct(t);return h.mode="race",h.practice=!0,h.freeRun=!0,h.breakdownTimer=0,h.s=i.s,h.totalDistance=i.s,h.lastSafeS=i.s,h.lastSafeDistance=i.s,h.lateral=_e.clamp(n.lateral??0,-se.width*.32,se.width*.32),h.lateralVel=-Math.sign(h.lateral)*Math.min(4,Math.abs(h.speed)*.04),h.speed=_e.clamp(Math.max(28,h.speed),18,112),h.grounded=!0,h.y=i.p.y+2.1,h.yVel=0,h.airtime=0,h.rivalS=-900,h.rivalDistance=-900,h.leadState="SOLO",h.message="Merged onto the ribbon",h.messageTimer=1.6,h.cameraShake=Math.max(h.cameraShake,.35),yo(!1),Rt.visible=!1,on&&(on.visible=!0),document.body.classList.remove("roam-mode"),Li(),Ye.position.textContent="FREE RUN",Ye.trackName.textContent=se.name,xs(),!0}function w2(n){if(!n||h.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,r=e.abz/i;h.mode="roam",h.practice=!0,h.freeRun=!1,h.roamPos.set(t.x+s*3.5,t.y+Gn,t.z+r*3.5),h.roamYaw=Math.atan2(s,-r),h.camYaw=h.roamYaw,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,h.wheelSteer=0,h.speed=_e.clamp(Math.max(24,Math.abs(h.speed)*.82),20,78),h.grounded=!0,h.yVel=0,h.airtime=0,h.message="Exited to city streets",h.messageTimer=1.25,h.cameraShake=Math.max(h.cameraShake,.22),yo(!1),Rt.visible=!0,on&&(on.visible=!1),document.body.classList.add("roam-mode"),Li(),Ye.position.textContent="FREE ROAM",Ye.trackName.textContent="City Streets",xs();const a=Math.sin(h.roamYaw),o=-Math.cos(h.roamYaw);return De.position.set(h.roamPos.x-a*17,h.roamPos.y+7.2,h.roamPos.z-o*17),De.lookAt(h.roamPos.x+a*13,h.roamPos.y+2.45,h.roamPos.z+o*13),De.fov=69,De.updateProjectionMatrix(),Qs(h.roamPos.clone().add(new P(0,.6,0)),10),!0}function T2(){const n=vo.set(0,0,-1).applyQuaternion(De.quaternion).normalize();window.__steelRibbonTelemetry={mode:h.mode,s:h.s,totalDistance:h.totalDistance,rivalDistance:h.rivalDistance,speed:h.speed,lap:h.lap,score:h.score,damage:h.damage,y:h.roamPos.y,yVel:h.yVel,grounded:!h.roamAir,objectiveHits:h.objectiveHits,waterDepth:+(h.waterDepth||0).toFixed(3),driftAngle:+(h.driftAngle||0).toFixed(3),airTime:+(h.roamAirT||0).toFixed(2),roamPos:{x:h.roamPos.x,y:h.roamPos.y,z:h.roamPos.z},input:{steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake},forwardWorld:{x:Math.sin(h.roamYaw),y:0,z:-Math.cos(h.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var gs=document.createElement("canvas");gs.id="minimap",gs.width=256,gs.height=256;document.querySelector("#app")?.appendChild(gs);var pc=null,E2=0,fs={cx:0,cz:-570,span:2180};function ri(n,e,t){return[((n-fs.cx)/fs.span+.5)*t,((e-fs.cz)/fs.span+.5)*t]}function Jc(){if(!fs)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=zt.x0;s<=zt.x1+1;s+=zt.pitch){const[r,a]=ri(s,zt.zNear,n),[o,l]=ri(s,zt.zFar,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,l),t.stroke()}for(let s=zt.zNear;s>=zt.zFar-1;s-=zt.pitch){const[r,a]=ri(zt.x0,s,n),[o,l]=ri(zt.x1,s,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,l),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Mo())if(s.courseIndex===Yi){const[r,a]=ri(s.x,s.z,n);i?t.moveTo(r,a):t.lineTo(r,a),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of or){const[r,a]=ri(s.x,s.z,n);t.beginPath(),t.ellipse(r,a,Math.max(3,s.rx/fs.span*n),Math.max(3,s.rz/fs.span*n),0,0,Math.PI*2),t.fill()}pc=e}function A2(){const n=h.mode==="roam";if((gs.style.display=n?"block":"none")&&!n||!n||!pc||E2++%2)return;const e=gs.width,t=gs.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(pc,0,0,e,e);for(const r of Ts)if(r.rampType==="on"&&r.points?.length){const a=r.points[0],[o,l]=ri(a.x,a.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,l,4,0,Math.PI*2),t.fill()}for(let r=0;r<$t.length;r++){const a=$t[r],[o,l]=ri(a.x,a.z,e),c=r===h.objectiveIndex%$t.length;t.fillStyle=c?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,l,c?5.5+Math.sin(ao*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const r of Pn){const[a,o]=ri(r.x,r.z,e);t.fillRect(a-1.4,o-1.4,2.8,2.8)}const[i,s]=ri(h.roamPos.x,h.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(h.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}Jc();let ss=null;function C2(){ss||(ss=new O(new Qe(2.4,3.2,620,12,1,!0),new bt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:Kn,side:pt,fog:!1})),ss.renderOrder=5,Ze.add(ss));const n=h.mode==="roam"&&$t.length>0;if(ss.visible=n,!n)return;const e=$t[h.objectiveIndex%$t.length];ss.position.set(e.x,e.y+296,e.z),ss.material.opacity=.1+Math.sin(ao*3.1)*.04}function R2(){if(h.mode!=="roam"||$t.length===0)return;const n=$t[h.objectiveIndex%$t.length];if(!n)return;const e=h.roamPos.x-n.x,t=h.roamPos.z-n.z,i=Math.abs(h.roamPos.y-n.y);e*e+t*t>n.radius*n.radius||i>8.5||(n.collected=!0,h.objectiveHits++,h.objectiveIndex=(h.objectiveIndex+1)%$t.length,h.objectiveIndex===0&&h.objectiveLap++,h.score+=420+Math.round(Math.abs(h.speed)*5),h.boost=Math.min(1,h.boost+.32),h.cameraShake=Math.max(h.cameraShake,.18),h.message=n.label,h.messageTimer=1.05,ms(`+${420+Math.round(Math.abs(h.speed)*5)} GATE`,!0),Ss(880,.16),setTimeout(()=>Ss(1245,.2),90),Qs(new P(n.x,n.y,n.z),18))}function $u(n){const e=h.speed;h.collisionCooldown=Math.max(0,h.collisionCooldown-n);const t=Math.max(wt.has("KeyW")||wt.has("ArrowUp")?1:0,Fe.throttle),i=Math.max(wt.has("KeyS")||wt.has("ArrowDown")?1:0,Fe.brake),s=_e.clamp((wt.has("KeyD")||wt.has("ArrowRight")?1:0)-(wt.has("KeyA")||wt.has("ArrowLeft")?1:0)+Fe.steer,-1,1)*Eu,r=(wt.has("ShiftLeft")||wt.has("ShiftRight"))&&h.boost>.02&&t>.03;if(t>.03){const y=h.speed<0?38:0;h.speed+=((r?70:42)*Xi().accel+y)*t*n}i>.03&&(h.speed-=(h.speed>1.2?78:32)*i*n),h.speed-=.00235*h.speed*Math.abs(h.speed)*n,Math.abs(h.speed)>.08?h.speed-=Math.sign(h.speed)*3.6*n:t<=.03&&i<=.03&&(h.speed=0),h.speed=_e.clamp(h.speed,-24,135*Xi().top),h.boosting=r,r?h.boost=Math.max(0,h.boost-n*.22):h.boost=Math.min(1,h.boost+n*.05*Xi().boostRegen),h.wheelSteer+=(s-h.wheelSteer)*(1-Math.pow(1e-5,n));const a=-h.wheelSteer*.55,o=Rt.userData.frontWheels;o&&(o[0].rotation.y=a,o[1].rotation.y=a);const l=Math.abs(h.speed),c=wt.has("Space")&&!h.roamAir;if(l>hc){const y=_e.clamp((l-hc)/5,0,1),E=1-.36*_e.clamp((l-34)/85,0,1),T=mv*1.08*y*E*(c?1.85:1)*Xi().grip;h.roamYaw+=h.wheelSteer*T*n*Math.sign(h.speed)}c&&l>8?(h.driftAngle=_e.clamp((h.driftAngle||0)+h.wheelSteer*n*2.5*Math.sign(h.speed),-.62,.62),h.speed-=h.speed*(.12+Math.abs(h.driftAngle)*.45)*n):h.driftAngle=(h.driftAngle||0)*Math.pow(.004,n);const u=h.roamYaw-(h.driftAngle||0),f=Math.sin(u),m=-Math.cos(u),p=(h.speed-e)/Math.max(.001,n),x=_e.clamp(Math.abs(h.wheelSteer)*Math.max(0,l-18)/68+Math.max(0,-p-34)/90+Math.abs(h.driftAngle||0)*1.5,0,1);if(h.roamSlip+=(x-h.roamSlip)*(1-Math.pow(.01,n)),h.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,l/540)+Math.abs(p)*.0018-h.roamSuspension)*(1-Math.pow(.018,n)),h.roamSlip>.38&&Math.random()<n*(3+h.roamSlip*7)){const y=new P(h.roamPos.x-f*3.2,h.roamPos.y+.2,h.roamPos.z-m*3.2);Xu(y,2,h.roamSlip)}const M=Math.abs(h.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let d=!1,_=!1,v=us(h.roamPos.x,h.roamPos.z,h.roamPos.y);for(let y=0;y<g;y++)h.roamPos.x+=f*h.speed*n/g,h.roamPos.z+=m*h.speed*n/g,v=us(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamAir||(h.roamPos.y=v.y+Gn),z2(h.roamPos,v)&&(_=!0),O2(h.roamPos,v)&&(d=!0),v=us(h.roamPos.x,h.roamPos.z,h.roamPos.y),h.roamAir||(h.roamPos.y=v.y+Gn);h.roamPos.x=_e.clamp(h.roamPos.x,-820,820),h.roamPos.z=_e.clamp(h.roamPos.z,-1620,480),d&&(h.collisionCooldown<=0&&(y2(new P(h.roamPos.x,h.roamPos.y+.8,h.roamPos.z),e,"IMPACT"),h.collisionCooldown=.38),h.speed*=.28),_&&(h.speed*=.62,h.cameraShake=Math.max(h.cameraShake,.22),h.message="SPLAT!",h.messageTimer=.9),D2(n,e),P2(n,c,d),I2(n,d),v=us(h.roamPos.x,h.roamPos.z,h.roamPos.y),L2(n,v),!(v.kind==="ramp"&&v.u>.72&&Td(v))&&(v.kind==="track"&&Td(v)||(R2(),xs(),wt.has("KeyR")&&(Kc(),wt.delete("KeyR"))))}function P2(n,e,t){if(e&&Math.abs(h.driftAngle||0)>.16&&Math.abs(h.speed)>24&&!t)h.driftT=(h.driftT||0)+n,h.driftAcc=(h.driftAcc||0)+n*Math.abs(h.speed)*(.7+Math.abs(h.driftAngle));else if(h.driftT){if(!t&&h.driftT>.55){const s=Math.round(h.driftAcc);h.score+=s,ms(`+${s} DRIFT`),Ss(600,.16,"square",.1)}h.driftT=0,h.driftAcc=0}}function L2(n,e){const t=e.y+Gn,i=h.roamPrevY??t;if(!h.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(h.speed)>26&&s<(h.roamVy||0)-40*n-3.4?(h.roamAir=!0,h.roamAirT=0):(h.roamVy=_e.clamp(s,-70,70),h.roamPos.y=t)}if(h.roamAir&&(h.roamVy-=34*n,h.roamAirT+=n,h.roamPos.y=h.roamPos.y+h.roamVy*n,h.roamPos.y<=t)){h.roamPos.y=t,h.roamAir=!1;const s=-h.roamVy;if(h.roamVy=0,s>9&&(h.cameraShake=Math.max(h.cameraShake,Math.min(.5,s/40)),Gr(Math.min(24,s*.85)),h.roamSuspension+=.16),h.roamAirT>.45){const r=Math.round(40+h.roamAirT*70);h.score+=r,ms(`+${r} AIR`),Ss(760,.14)}}h.roamPrevY=h.roamPos.y}const xn=2.6;function D2(n,e){const t=h.waterDepth||0;if(h.roamPos.y>Pe(h.roamPos.x,h.roamPos.z)+2.5){h.waterDepth=0;return}const i=Rv(h.roamPos.x,h.roamPos.z);h.waterDepth=i.depth,!(i.depth<=.02)&&(h.speed-=h.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(d2(h.roamPos.clone(),Math.abs(e)),v2(Math.abs(e)/60),h.cameraShake=Math.max(h.cameraShake,.16),h.message="SPLASH",h.messageTimer=.7),h.wakeT=(h.wakeT??0)-n,Math.abs(h.speed)>5&&h.wakeT<=0&&(h.wakeT=.15,Vu(h.roamPos.x-Math.sin(h.roamYaw)*1.5,h.roamPos.z+Math.cos(h.roamYaw)*1.5,.8+Math.abs(h.speed)*.012)))}function I2(n,e){for(const t of Pn)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(h.speed)<32||h.collisionCooldown>0))for(const t of Pn){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=h.roamPos.x-t.x,r=h.roamPos.z-t.z,a=(t.hw+t.hd)*.5+xn+2.4;if(s*s+r*r<a*a&&Math.abs(h.roamPos.y-(t.maxY??h.roamPos.y))<7){i.nearMissT=1.8,h.score+=45,h.nearMisses+=1,ms("+45 NEAR MISS"),Ss(520,.12,"square",.07);break}}}function fl(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Gn+.45)continue;if(s.radius){const f=s.radius+xn,m=n.x-s.x,p=n.z-s.z,x=m*m+p*p;if(x>=f*f)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+m/M*f,n.z=s.z+p/M*f;continue}const r=s.hw+xn,a=s.hd+xn,o=n.x-s.x,l=n.z-s.z;if(Math.abs(o)>=r||Math.abs(l)>=a)continue;t=!0;const c=r-Math.abs(o),u=a-Math.abs(l);c<u?n.x=s.x+(o<0?-r:r):n.z=s.z+(l<0?-a:a)}return t}function Zu(n,e=h.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||zt.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,r=n.mesh?.position?.z??n.collider?.z??n.along,a=n.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;n.avoidOffset=_e.clamp((n.avoidOffset||0)+a*i*.9,-i,i),t&&(ke.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=a*.08),h.mode==="roam"&&(h.cameraShake=Math.max(h.cameraShake,.32),h.message="TRAFFIC CRASH",h.messageTimer=.85))}function U2(n){let e=!1;for(let t=0;t<Pn.length;t++){const i=Pn[t];if(i.maxY!=null&&n.y>i.maxY+Gn+.45)continue;const s=i.hw+xn,r=i.hd+xn,a=n.x-i.x,o=n.z-i.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,Zu(i.actor,n);const l=s-Math.abs(a),c=r-Math.abs(o);l<c?n.x=i.x+(a<0?-s:s):n.z=i.z+(o<0?-r:r)}return e}function F2(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Gn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function N2(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,ke.splats++,g2();const e=Js.find(t=>!t.visible)||Js[ke.splats%Math.max(1,Js.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,Pe(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function z2(n,e=null){if(e?.kind!=="ground"||Math.abs(h.speed)<5)return!1;let t=!1;for(const i of ea){if(!i.active)continue;const s=n.x-i.x,r=n.z-i.z,a=xn+i.hitRadius;s*s+r*r>a*a||Math.abs(n.y-(Pe(i.x,i.z)+Gn))>3.2||(N2(i),t=!0)}return t}function O2(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=fl(n,dn),r=e?.kind==="ground"?fl(n,zn):!1,a=fl(n,Ti),o=e?.kind==="ground"?U2(n):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function Ku(n){const e=Fe.lookX*1.18,t=Fe.lookY*.58;h.camLookYaw+=(e-h.camLookYaw)*(1-Math.pow(.002,n)),h.camLookPitch+=(t-h.camLookPitch)*(1-Math.pow(.002,n)),h.cameraZoom+=(Fe.zoom-h.cameraZoom)*(1-Math.pow(.018,n))}function jc(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const r=s/10,a=_e.lerp(n.x,e.x,r),o=_e.lerp(n.z,e.z,r),l=_e.lerp(n.y,e.y,r),c=Pe(a,o)+t;c>l&&(i=Math.max(i,(c-l)/Math.max(.08,r)))}return i}function B2(n,e){const t=Pe(n,e);let i=null;const s=qu(n,e);s&&s.y>t+4&&(i=s);const r=Yu(n,e,1e3,!0);return r&&r.y>t+4&&(!i||r.y>i.y)&&(i=r),i}function lo(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const r=s/14,a=_e.lerp(n.x,e.x,r),o=_e.lerp(n.z,e.z,r),l=_e.lerp(n.y,e.y,r),c=B2(a,o);if(!c||n.y<c.y-10)continue;const u=c.y+t-l;u>0&&(i=Math.max(i,u/Math.max(.16,r)))}return Math.min(54,i)}function mc(){const n=h.camYaw+h.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=_e.clamp(h.cameraZoom,-.42,.9),s=h.roamPos,r={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+h.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};De.position.y+=jc(r,De.position,3.4),De.position.y+=lo(r,De.position,4.2)}function Ju(n){if(window.__freeCam)return;if(Ku(n),Math.abs(h.speed)>hc){let p=h.roamYaw-h.camYaw;p=Math.atan2(Math.sin(p),Math.cos(p)),h.camYaw+=p*(1-Math.pow(.08,n))}const e=h.camYaw+h.camLookYaw,t=Math.sin(e),i=-Math.cos(e),s=h.roamPos,r=_e.clamp(h.cameraZoom,-.42,.9),a=_e.clamp(Math.abs(h.speed)/135,0,1),o=(17+Math.abs(h.speed)*.11+h.roamSlip*3)*(1+r*.72),l=7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+h.camLookPitch*5.8,c=Tu.set(s.x-t*o,s.y+l,s.z-i*o);if(h.cameraShake>.01||h.collisionDrama>.01){const p=h.cameraShake+h.collisionDrama*.42;c.x+=(Math.random()-.5)*p*1.2,c.y+=(Math.random()-.5)*p*.75,c.z+=(Math.random()-.5)*p*1.2}const u=vo.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+h.camLookPitch*13.5,s.z+i*(13+a*8-Math.min(r,0)*6));c.y=Math.max(c.y,Pe(c.x,c.z)+3.5),c.y+=jc(u,c,3.4),c.y+=lo(u,c,4.2);const f=h.roamSlip>.35?.006:.0026;De.position.lerp(c,1-Math.pow(f,n)),De.position.y+=lo(u,De.position,3.8)*.72,cn.position.copy(De.position),cn.lookAt(u),cn.rotateY(Math.PI),cn.rotateZ(-h.wheelSteer*a*.18+h.roamSlip*Math.sign(h.wheelSteer||1)*.05),De.quaternion.slerp(cn.quaternion,1-Math.pow(.05,n));const m=69+Math.min(13,Math.abs(h.speed)*.075)+h.roamSlip*2.5+r*10;Math.abs(De.fov-m)>.02&&(De.fov+=(m-De.fov)*(1-Math.pow(.01,n)),De.updateProjectionMatrix()),h.cameraShake=Math.max(0,h.cameraShake-n*2.4),h.collisionDrama=Math.max(0,h.collisionDrama-n*1.8)}function k2(n,e=null){if(h.mode==="result")return;h.mode="result";const t=Math.max(0,Math.round(h.score-h.damage*9+Math.max(0,220-h.time)*45));t>h.best&&(h.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Ye.best.textContent=`Best score ${h.best}`,Ye.resultText.textContent=`${n} Score ${t}. Time ${co(h.time)}. Damage ${Math.round(h.damage)}%.`;const i=Number.isFinite(h.bestLap)?co(h.bestLap):"--:--.-";let s="";if(h.seasonRace&&Ut?.active&&e){[{key:"you",metric:h.totalDistance+.001},...In.map(l=>({key:l.key,metric:l.distance}))].sort((l,c)=>c.metric-l.metric).forEach((l,c)=>Ut.points[l.key]+=t2[c]??0),Ut.raceIndex++;const a=Ut.raceIndex>=4,o=ku();if(a){Ut.active=!1;const l=o[0].key==="you";l&&Ut.division>1?(localStorage.setItem("steel-ribbon-division",String(Ut.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Bu(Ut.division-1)}!</b>`):s+=l?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}Ou(),s=`<span>Season — after race ${Ut.raceIndex}/4</span>`+o.map((l,c)=>`<b>${c+1}. ${l.label} — ${l.pts} pts</b>`).join("")+s,Ye.againBtn.textContent=Ut.active?"Next Race":"Back to Menu"}else Ye.againBtn.textContent="Race Again";Ye.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${h.cleanLandings}</b>
    <b>Hard landings: ${h.hardLandings}</b>
    <b>Recoveries: ${h.recoveries}</b>
    <b>Near edges: ${Math.round(h.nearMisses)}</b>
    ${s}
  `,bo(),Ye.result.classList.remove("hidden")}function Ed(n="Craned back to the ribbon"){const e=ct(h.lastSafeS);h.s=h.lastSafeS,h.totalDistance=h.lastSafeDistance,h.lateral=0,h.lateralVel=0,h.y=e.p.y+2.1,h.yVel=0,h.speed=Math.max(16,h.speed*.32),h.grounded=!0,h.cameraShake=1.2,h.message=n,h.messageTimer=1.4,h.recoveries+=1}function Qc(n,e){return _e.clamp(e*n.tangent.y,-48,48)}function V2(n=94){return se.gaps.map(e=>{const t=ct(e.start),i=ct(e.end+3),s=(e.end-e.start)/Math.max(1,n),r=Qc(t,n),a=t.p.y+2.1+r*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(_e.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Ad(n,e){h.grounded=!1,h.yVel=Qc(n,h.speed),h.airtime=0,e&&(h.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return Qc(ct(n),e)},gapJumpReport(n){return V2(n)},sceneryClearanceReport(){return Pv()},setSpeed(n){return h.speed=_e.clamp(n,-14,156-h.damage*.42),Hr(),h.speed},setTrackPosition(n,e=h.speed,t=0){const i=ct(n);return h.totalDistance=n,h.s=i.s,h.lastSafeS=i.s,h.lastSafeDistance=n,h.lateral=_e.clamp(t,-se.width*.48,se.width*.48),h.lateralVel=0,h.y=i.p.y+2.1,h.yVel=0,h.grounded=!0,h.speed=_e.clamp(e,-14,156-h.damage*.42),Hr(),{s:h.s,totalDistance:h.totalDistance,speed:h.speed,lateral:h.lateral,y:h.y}},setDamage(n){return h.damage=_e.clamp(n,0,99),Hr(),h.damage},setCourse(n){return oa(n)},flyCam(n,e,t,i,s,r){return window.__freeCam=!0,De.position.set(n,e,t),De.lookAt(i,s,r),De.fov=62,De.updateProjectionMatrix(),"freecam"},listBoostPads(){return js.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return or.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1)}))},seasonInfo(){return{season:Ut,division:aa(),position:eh(),seasonRace:!!h.seasonRace,rivals:In.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Ut=null,bo(),"reset"},renderInfo(){return{calls:ke.renderCalls||0,triangles:ke.renderTris||0,geometries:Zt.info.memory.geometries,textures:Zt.info.memory.textures,mobilePerf:Xc}},trafficInfo(){const n=Pn[0]?.actor?.mesh;return{colliders:Pn.length,wheels:n?.userData?.wheels?.length??0,pedestrians:ke.pedestrians||0}},audioInfo(){return Xe?{state:Xe.ctx.state,master:+Xe.master.gain.value.toFixed(2),engine:!!Xe.rumble&&!!Xe.growl&&!!Xe.whine,fx:!!Xe.wind&&!!Xe.skid&&!!Xe.boost,music:!!Xe.musicGain,beat:Xe.beat}:null},colliderAudit(){const n=[],e=[],t=zt.streetW*.5;for(let r=zt.x0;r<=zt.x1+1;r+=zt.pitch)n.push(Math.round(r));for(let r=zt.zNear;r>=zt.zFar-1;r-=zt.pitch)e.push(Math.round(r));const i=[],s=(r,a,o)=>{const l=o.radius!=null?o.radius:o.hw??0,c=o.radius!=null?o.radius:o.hd??0,u=Pe(o.x,o.z);if(!(o.maxY!=null&&o.maxY<u+1.05)){for(const f of n)Math.abs(o.x-f)<t+l+xn&&o.z<zt.zNear+c&&o.z>zt.zFar-c&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(l,c).toFixed(1),road:`x=${f}`,overlap:+(t+l+xn-Math.abs(o.x-f)).toFixed(1)});for(const f of e)Math.abs(o.z-f)<t+c+xn&&o.x<zt.x1+l&&o.x>zt.x0-l&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(l,c).toFixed(1),road:`z=${f}`,overlap:+(t+c+xn-Math.abs(o.z-f)).toFixed(1)})}};return dn.forEach((r,a)=>s("Mn",a,r)),Ti.forEach((r,a)=>s("Di",a,r)),zn.forEach((r,a)=>s("$n",a,r)),{total:dn.length+Ti.length+zn.length,blockers:i}},setRoamPos(n,e,t=0,i=0){return h.mode!=="roam"&&Kc(),h.roamPos.set(n,Pe(n,e)+Gn,e),h.roamYaw=t,h.camYaw=t,h.speed=i,xs(),{x:h.roamPos.x,y:+h.roamPos.y.toFixed(2),z:h.roamPos.z}},sceneryCounters(){return{...Wi,boostPads:js.length,gapBeacons:ta.length,railRuns:ke.railRuns||0,railPosts:ke.railPosts||0,ponds:or.length,cityPonds:ke.ponds||0}},stats(){return{trafficCrashes:ke.trafficCrashes,splats:ke.splats,roamPos:{x:+h.roamPos.x.toFixed(1),y:+h.roamPos.y.toFixed(1),z:+h.roamPos.z.toFixed(1)},speed:+h.speed.toFixed(2),cooldown:+h.collisionCooldown.toFixed(2)}},viewInfo(){const n=ct(h.s),e=h.y-2.1;return{trackView:jn,mode:h.mode,carVisible:Rt.visible,cockpitVisible:!!(on&&on.visible),camY:+De.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+h.y.toFixed(2),ghostRecLen:h.ghostRec?.length??-1,ghostLoaded:!!li,overheadY:+xc(De.position.x,De.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return jn=n==="cockpit"?"cockpit":"chase",Li(),jn},listCourses(){return ys.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:Yi,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new gp(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=De;const i=t.intersectObjects(Ze.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=us(n,e,400);return{x:n,z:e,ground:+Pe(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return Ts.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],r=n.segments[0],a=n.segments[n.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(n=8){return dn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return zn.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=zn.filter(e=>e.hw);return{supports:dc,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of dn){const i=as(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:dn.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of dn){const i=On(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:dn.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return Ti.concat(zn.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:ke.traffic,pedestrians:ke.pedestrians,pedestriansActive:ea.filter(e=>e.active).length,turns:ke.turns,splats:ke.splats,trafficCrashes:ke.trafficCrashes,streetLights:ke.streetLights,trafficLights:ke.trafficLights,stopSigns:ke.stopSigns,signs:ke.signs,roadDetails:{...ke.roadDetails},buildingArchetypes:{...ke.buildingArchetypes},zones:{...ke.zones},openerProps:ke.openerProps,signSamples:oo.slice(0,n),types:{...ke.types},offRoadTraffic:Pn.filter(e=>!_o(e.x,e.z,2)).length,trafficRoutes:uc.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Pn.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:ea.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...ke.roadDetails},e={...ke.buildingArchetypes},t={...ke.zones},i=Object.values(e).filter(r=>r>0).length,s=Object.values(t).filter(r=>r>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,ke.signs/7)+Math.min(14,ke.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:ke.openerProps,signs:ke.signs,streetLights:ke.streetLights,streetGlowSprites:Wi.streetGlowSprites,waterBlockers:Wi.waterBlockers,lowFogDisks:Wi.lowFogDisks}},objectiveReport(){const n=$t[h.objectiveIndex%Math.max(1,$t.length)];return{total:$t.length,hits:h.objectiveHits,index:h.objectiveIndex,lap:h.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:$t.filter(e=>e.collected).length,score:Math.round(h.score),boost:+h.boost.toFixed(2)}},drivingFeelReport(){return{speed:+h.speed.toFixed(2),wheelSteer:+(h.wheelSteer||0).toFixed(3),slip:+(h.roamSlip||0).toFixed(3),suspension:+(h.roamSuspension||0).toFixed(3),cameraShake:+(h.cameraShake||0).toFixed(3),collisionDrama:+(h.collisionDrama||0).toFixed(3),collisionHits:h.collisionHits,smokeActive:kr.filter(n=>n.life>0).length,debrisActive:Vr.filter(n=>n.life>0).length,sparksActive:Br.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Rt.userData.detailReport},racer:{...Qv.userData.detailReport},namedParts:Rt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);Uu(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=ct(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,r=Math.atan2(t.tangent.x,-t.tangent.z),a=Pe(i,s);h.mode="roam",h.practice=!0,h.freeRun=!1,h.roamPos.set(i,a+Gn,s),h.roamYaw=r,h.camYaw=r,h.camLookYaw=0,h.camLookPitch=0,h.cameraZoom=0,Fe.lookX=0,Fe.lookY=0,Fe.zoom=0,h.wheelSteer=0,h.speed=0,xs();const o=Math.sin(h.roamYaw),l=-Math.cos(h.roamYaw);return De.position.set(h.roamPos.x-o*17,h.roamPos.y+7.2,h.roamPos.z-l*17),mc(),De.lookAt(h.roamPos.x+o*13,h.roamPos.y+2.45,h.roamPos.z+l*13),De.fov=69,De.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-h.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=us(n,e,h.roamPos.y);h.roamPos.set(n,i.y+Gn,e),h.roamYaw=t,h.camYaw=t,h.camLookYaw=0,h.camLookPitch=0,h.wheelSteer=0,h.speed=0,xs();const s=Math.sin(h.roamYaw),r=-Math.cos(h.roamYaw);return De.position.set(h.roamPos.x-s*17,h.roamPos.y+7.2,h.roamPos.z-r*17),mc(),De.lookAt(h.roamPos.x+s*13,h.roamPos.y+2.45,h.roamPos.z+r*13),De.fov=69,De.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Fe.zoom,i=30){Fe.lookX=_e.clamp(n,-1,1),Fe.lookY=_e.clamp(e,-1,1),Fe.zoom=_e.clamp(t,-.42,.9);for(let s=0;s<i;s++)h.mode==="roam"?Ju(1/60):th(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(h.mode!=="roam")return this.roamReport();const s={steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake};Fe.steer=_e.clamp(e,-1,1),Fe.throttle=_e.clamp(t,0,1),Fe.brake=_e.clamp(i,0,1);const r=1/60;let a=Math.max(0,Math.min(n,8));for(;a>0;){const o=Math.min(r,a);if($u(o),h.mode!=="roam")break;a-=o}return Fe.steer=s.steer,Fe.throttle=s.throttle,Fe.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(h.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(ju(i),h.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=h.roamPos,e=Tu.set(0,0,-1).applyQuaternion(Rt.quaternion).normalize(),t=vo.set(Math.sin(h.roamYaw),0,-Math.cos(h.roamYaw)).normalize(),i=us(n.x,n.z,n.y);return{mode:h.mode,s:+h.s.toFixed(2),totalDistance:+h.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+h.roamYaw.toFixed(3),camYaw:+h.camYaw.toFixed(3),speed:+h.speed.toFixed(2),groundXZ:+Pe(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+De.position.x.toFixed(2),camY:+De.position.y.toFixed(2),camZ:+De.position.z.toFixed(2),fov:+De.fov.toFixed(2),lookYaw:+h.camLookYaw.toFixed(3),lookPitch:+h.camLookPitch.toFixed(3),cameraZoom:+h.cameraZoom.toFixed(3),cameraSightLift:+jc({x:n.x,y:n.y+2.6,z:n.z},{x:De.position.x,y:De.position.y,z:De.position.z},2.4).toFixed(3),elevatedCameraLift:+lo({x:n.x,y:n.y+2.6,z:n.z},{x:De.position.x,y:De.position.y,z:De.position.z},3.8).toFixed(3),colliders:dn.length+zn.length+Ti.length+Pn.length,insideBuilding:dn.concat(zn,Ti,Pn).some(s=>F2(n,s)),objectiveHits:h.objectiveHits,objectiveIndex:h.objectiveIndex,collisionHits:h.collisionHits,slip:+(h.roamSlip||0).toFixed(3),suspension:+(h.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Rt.userData.frontWheels?+Rt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function ju(n){if(h.mode!=="race")return;h.time+=n,h.freeRun&&(h.damage=0);const e=h.breakdownTimer>0;e&&(h.breakdownTimer-=n,h.breakdownTimer<=0&&(h.damage=55,h.message="Patched up — back on it",h.messageTimer=1.2));const t=Math.max(wt.has("KeyW")||wt.has("ArrowUp")?1:0,Fe.throttle),i=Math.max(wt.has("KeyS")||wt.has("ArrowDown")?1:0,Fe.brake),s=_e.clamp((wt.has("KeyD")||wt.has("ArrowRight")?1:0)-(wt.has("KeyA")||wt.has("ArrowLeft")?1:0)+Fe.steer,-1,1)*Eu,r=t>.03&&!e,a=(wt.has("ShiftLeft")||wt.has("ShiftRight"))&&h.boost>.02&&r&&h.grounded,o=ct(h.s),l=o.p.y+2.1,c=Math.abs(h.speed);if(r){const v=h.speed<0?40:0;h.speed+=((a?68:40)*Xi().accel+v)*t*n}if(i>.03){const v=h.speed>1.2?70:26;h.speed-=v*i*n}const u=h.grounded?.0024:.0011;h.speed-=u*h.speed*c*n,c>.08?h.speed-=Math.sign(h.speed)*(h.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(h.speed=0),h.speed=_e.clamp(h.speed,-16,156*Xi().top-h.damage*.8),e&&(h.speed=Math.min(h.speed,14)),h.boosting=a,a?(h.boost=Math.max(0,h.boost-n*.21),h.score+=28*n):h.boost=Math.min(1,h.boost+n*(h.grounded?.045:.018)*Xi().boostRegen);const f=wt.has("Space")&&h.grounded,m=(16+c*.13)*(f?1.45:1)*Xi().grip;h.lateralVel-=s*m*n,h.lateralVel-=h.lateralVel*(h.grounded?f?2.2:4.1:.7)*n,h.lateral+=h.lateralVel*n;const p=ui(h.s),x=Math.abs(h.lateral)<se.width*.52,M=!p&&x;if(h.grounded&&(!M||Math.abs(h.lateral)>se.width*.5)&&Ad(o,x?"":"Edge slip"),h.grounded){const v=Math.sin(h.time*18)*Math.min(.22,Math.abs(h.speed)/700);h.y=_e.lerp(h.y,l+v,.5),h.yVel=0,h.lastSafeS=h.s,h.lastSafeDistance=h.totalDistance,h.score+=Math.max(0,h.speed)*n*.34,Math.abs(h.lateral)>se.width*.42&&(h.damage+=n*(1.2+Math.abs(h.speed)*.035),h.cameraShake=Math.max(h.cameraShake,.24),h.nearMisses+=n*.8,Math.random()<n*5&&Qs(o.p.clone().addScaledVector(o.side,Math.sign(h.lateral)*se.width*.55).addScaledVector(jt,1.2),4))}else{h.yVel-=31*n,h.y+=h.yVel*n,h.airtime+=n,h.score+=n*11;const v=ct(h.s),y=v.p.y+2.1;if(!ui(h.s)&&Math.abs(h.lateral)<se.width*.55&&h.y<=y&&h.yVel<0){const E=-h.yVel,T=Math.abs(h.lateral)<se.width*.34&&E<30,C=Math.round(T?260+h.airtime*85:Math.max(30,120-E));h.y=y,h.grounded=!0,h.yVel=0,h.lastSafeS=h.s,h.lastSafeDistance=h.totalDistance,h.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(h.lateral)-se.width*.36)*1.8,h.score+=C,h.cameraShake=Math.max(h.cameraShake,E/34),h.message=T?"Clean landing":"Hard landing",h.messageTimer=.9,T?h.cleanLandings+=1:h.hardLandings+=1,ms(`+${C} ${T?"CLEAN AIR":"LANDED"}`,T),T&&Ss(990,.14),Gr(E),Qs(v.p.clone().addScaledVector(v.side,h.lateral).addScaledVector(jt,.7),T?7:24),h.airtime=0}h.y<-55&&(h.damage+=28,Ed("Track crew recovery"))}const g=h.totalDistance;h.totalDistance+=h.speed*n,h.s=(h.totalDistance%se.length+se.length)%se.length,Y2();const d=Ts.find(v=>v.rampType==="off");if(h.freeRun&&d&&ol(g,h.totalDistance,d.exitS)&&h.lateral*d.dirSel>se.width*.2&&w2(d))return;const _=Math.floor(h.totalDistance/se.length)+1;if(_>h.lap){const v=h.time-h.lapStartTime;q2(v),h.ghostRec=[],h.splitTimes.push(v),h.bestLap=Math.min(h.bestLap,v),h.lapStartTime=h.time,h.lap=_,h.score+=1200,ms("+1200 LAP",!0),h.message=h.practice?`Lap ${h.lap}`:h.lap<=se.laps?`Lap ${h.lap}`:"Season race complete",h.messageTimer=1.4,!h.practice&&h.lap>se.laps&&(()=>{const y=eh();k2(y===1?"You took the chequered gantry.":`You finished P${y}.`,y)})()}for(const v of se.gaps)ol(g,h.totalDistance,v.start)&&(h.message=v.name,h.messageTimer=1.1,h.grounded&&Ad(ct(v.start),v.name));if(h.grounded){for(const v of js)if(ol(g,h.totalDistance,v.s)&&Math.abs(h.lateral-v.lat)<3.4){const y=ct(v.s);h.boost=Math.min(1,h.boost+.45),h.speed=Math.min(h.speed+9,156-h.damage*.8),h.score+=90,h.cameraShake=Math.max(h.cameraShake,.16),h.message="BOOST PAD",h.messageTimer=.8,ms("+90 BOOST"),Ss(640,.22,"sawtooth",.1),Qs(y.p.clone().addScaledVector(y.side,v.lat).addScaledVector(jt,1),10),Gr(14);break}}h.damage=_e.clamp(h.damage,0,100),!h.freeRun&&h.damage>=90&&h.breakdownTimer<=0&&(h.breakdownTimer=2.6,h.message="Chassis cracked — limping to repair",h.messageTimer=1.6,h.cameraShake=Math.max(h.cameraShake,.8),Gr(40),h.damage=90),wt.has("KeyR")&&(h.damage=Math.min(99,h.damage+8),Ed("Manual reset"),wt.delete("KeyR"))}function Cd(n){const e=se.length*se.laps,t=1+.07*(4-aa());for(const i of In){if(h.mode==="race"&&!h.practice){const l=h.totalDistance-i.distance,c=_e.clamp(l*.055,-11,15),u=Math.sin(h.time*i.waveFreq+i.phase)*i.wave;let f=i.base+u+c;i.key==="bishop"&&(f+=11*Math.exp(-h.time/22)),i.key==="maddock"&&(f+=10*_e.clamp(i.distance/Math.max(1,e),0,1)),i.speed=_e.clamp(f*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=h.time,h.message=`${i.label} takes the flag`,h.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=ct(i.s),r=Math.abs(i.distance-h.totalDistance);let a=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(r<14){const l=(h.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);a=_e.lerp(l,a,r/14)}i.mesh.position.copy(s.p).addScaledVector(jt,1.4).addScaledVector(s.side,a),i.mesh.quaternion.setFromRotationMatrix(new Tt().makeBasis(s.side,jt,s.tangent));const o=r<26&&jn==="cockpit";i.mesh.visible=(h.mode==="race"||h.mode==="paused"||h.mode==="result")&&!h.practice&&!o}h.rivalDistance=Math.max(...In.map(i=>i.distance)),h.rivalS=(h.rivalDistance%se.length+se.length)%se.length}function eh(){return h.practice?1:1+In.filter(n=>n.distance>h.totalDistance).length}function G2(n,e){const t=e.side.clone().multiplyScalar(h.lateral),i=e.p.clone().add(t);i.y=h.y;const s=h.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),De.position.copy(i);const r=Math.abs(h.speed),a=68+Math.min(10,r*.055)+(h.boosting?3:0)+h.cameraZoom*12;Math.abs(De.fov-a)>.02&&(De.fov+=(a-De.fov)*(1-Math.pow(.004,n)),De.updateProjectionMatrix());const o=ct(h.s+34+h.speed*.16),l=o.p.clone().addScaledVector(o.side,h.lateral*.45);l.y+=1.7+h.camLookPitch*12+Math.sin(h.time*8)*Math.min(.2,r/680),cn.position.copy(De.position),cn.lookAt(l),cn.rotateY(Math.PI),cn.rotateY(-h.camLookYaw),cn.rotateZ(-e.bank*.72-h.lateralVel*.006),cn.rotateX(e.grade*.18+(h.grounded?0:_e.clamp(h.yVel,-30,30)*-.006)),De.quaternion.slerp(cn.quaternion,1-Math.pow(8e-4,n))}function xc(n,e,t,i){let s=1/0;const r=se.width*.5+2.2;for(const a of Mo()){if(a.courseIndex!==Yi||a.y<t||a.y>i||a.y>=s)continue;const o=n-a.x,l=e-a.z;o*o+l*l<r*r&&(s=a.y)}return s}function H2(n,e){const t=Math.abs(h.speed),i=h.y-2.1;let s=12.8+t*.05+_e.clamp(h.cameraZoom,-.42,.9)*8,r=4.6+t*.014+h.camLookPitch*10,a=ct(h.s-s),o=xc(a.p.x,a.p.z,i+5,i+64);o-1.5<a.p.y+2&&(s=6.4,r=2.7,a=ct(h.s-s),o=xc(a.p.x,a.p.z,i+5,i+64));let l=_e.lerp(a.p.y,i,.62)+r;const c=qc.set(a.p.x+a.side.x*h.lateral*.72,0,a.p.z+a.side.z*h.lateral*.72);if(l=Math.max(l,a.p.y+2.35,Pe(c.x,c.z)+2.8),o<1/0&&(l=Math.min(l,o-1.5)),c.y=l,h.cameraShake>.01){const p=h.cameraShake;c.x+=(Math.random()-.5)*p*1.1,c.y+=(Math.random()-.5)*p*.6,c.z+=(Math.random()-.5)*p*1.1}De.position.distanceTo(c)>70&&De.position.copy(c),De.position.lerp(c,1-Math.pow(2e-4,n)),De.position.y=Math.max(De.position.y,a.p.y+2.05),o<1/0&&(De.position.y=Math.min(De.position.y,o-1.4));const u=ct(h.s+17+t*.09),f=u.p.clone().addScaledVector(u.side,h.lateral*.55);f.y+=2.1+h.camLookPitch*12,h.grounded||(f.y=_e.lerp(f.y,h.y+1.2,.5)),cn.position.copy(De.position),cn.lookAt(f),cn.rotateY(Math.PI),cn.rotateY(-h.camLookYaw),cn.rotateZ(-e.bank*.42-h.lateralVel*.0034),De.quaternion.slerp(cn.quaternion,1-Math.pow(4e-4,n));const m=66+Math.min(11,t*.055)+(h.boosting?5:0)+_e.clamp(h.cameraZoom,-.42,.9)*10;Math.abs(De.fov-m)>.02&&(De.fov+=(m-De.fov)*(1-Math.pow(.004,n)),De.updateProjectionMatrix())}let Ai=null,li=null,bi=0;function W2(){try{li=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+Yi)||"null")}catch{li=null}bi=0}function X2(){Ai&&$s(Ai),Ai=bs[$i].build(),Ai.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),Ai.visible=!1}function q2(n){if(!(h.practice||h.freeRun)||!h.ghostRec||h.ghostRec.length<12||li&&n>=li.time)return;const e=Math.max(1,Math.floor(h.ghostRec.length/700)),t=h.ghostRec.filter((i,s)=>s%e===0);li={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+Yi,JSON.stringify(li))}catch{}h.message=`Ghost saved — ${co(n)}`,h.messageTimer=1.3,bi=0}function Y2(){if(h.mode!=="race")return;h.ghostRec||(h.ghostRec=[]);const n=h.time-h.lapStartTime,e=h.ghostRec[h.ghostRec.length-1];(!e||n-e[0]>.08)&&h.ghostRec.length<4e3&&h.ghostRec.push([+n.toFixed(2),+h.s.toFixed(1),+h.lateral.toFixed(2),+h.y.toFixed(2)])}function $2(){if(!Ai)return;const n=h.mode==="race"&&(h.practice||h.freeRun)&&li?.samples?.length>2&&!window.__freeCam;if(Ai.visible=n,!n)return;const e=(h.time-h.lapStartTime)%Math.max(.01,li.time),t=li.samples;for(e<(t[bi]?.[0]??0)&&(bi=0);bi<t.length-2&&t[bi+1][0]<e;)bi++;const i=t[bi],s=t[Math.min(bi+1,t.length-1)],r=_e.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),a=_e.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:r),o=_e.lerp(i[2],s[2],r),l=_e.lerp(i[3],s[3],r),c=ct((a%se.length+se.length)%se.length);Ai.position.set(c.p.x+c.side.x*o,l-.72,c.p.z+c.side.z*o),Ai.quaternion.setFromRotationMatrix(new Tt().makeBasis(c.side,jt,c.tangent))}function Z2(){const n=h.mode==="race"||h.mode==="paused"||h.mode==="result",e=n&&jn==="chase"&&!window.__freeCam;if(on&&(on.visible=!e),Rt.visible!==e&&(Rt.visible=e),!e)return;const t=ct(h.s);Rt.position.set(t.p.x+t.side.x*h.lateral,h.y-.72,t.p.z+t.side.z*h.lateral);const i=new Tt().makeBasis(t.side,jt,t.tangent);Rt.quaternion.setFromRotationMatrix(i),h.grounded?(Rt.rotateX(-t.grade*.5),Rt.rotateZ(t.bank*.6+_e.clamp(h.lateralVel*.012,-.16,.16))):Rt.rotateX(_e.clamp(-h.yVel*.011,-.34,.4));const s=Rt.userData.frontWheels,r=_e.clamp(-h.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=r,s[1].rotation.y=r)}let Ha=.6;function K2(n){if(window.__freeCam)return;Ha+=n*.13;const e=80,t=300,i=Pe(e,t);Rt.visible=!0,on&&(on.visible=!1),Rt.position.set(e,i+.85,t),Rt.quaternion.setFromAxisAngle(jt,Math.PI*.24);const s=16.5;De.position.set(e+Math.cos(Ha)*s,i+5.3+Math.sin(Ha*.57)*1.1,t+Math.sin(Ha)*s),De.lookAt(e,i+1.5,t),De.rotateY(.3),Math.abs(De.fov-58)>.1&&(De.fov=58,De.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=h.mode)}function th(n){if(window.__freeCam)return;Ku(n);const e=ct(h.s);jn==="chase"&&h.mode!=="menu"?H2(n,e):G2(n,e),h.cameraShake=Math.max(0,h.cameraShake-n*1.9);const t=vo.set(0,0,-1).applyQuaternion(De.quaternion).normalize();window.__steelRibbonTelemetry={mode:h.mode,s:h.s,totalDistance:h.totalDistance,rivalDistance:h.rivalDistance,speed:h.speed,lap:h.lap,score:h.score,damage:h.damage,y:h.y,yVel:h.yVel,grounded:h.grounded,input:{steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const ps={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Rr=[28,54,82,110,134,156];function J2(){const n=Math.abs(h.speed);let e=1;for(let o=0;o<Rr.length;o++)n>Rr[o]&&(e=o+2);e=Math.min(e,Rr.length);const t=e===1?0:Rr[e-2],i=Rr[e-1],s=i>t?_e.clamp((n-t)/(i-t),0,1):0,r=e===1?ps.idle:ps.postShift;let a=r+s*(ps.shift-r);return n<.4&&(a=ps.idle),{gear:e,rpm:a}}let Rd=performance.now(),pl=0,ml=0;function Qu(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const r=i/2,a=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:r,cy:a,R:o,aFor:l=>Math.PI-l*Math.PI,at:(l,c)=>[r+Math.cos(l)*c,a-Math.sin(l)*c]}}function j2(n,e){const t=Ye.speedo;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:l}=Qu(t),c=360;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=c;x+=20){const M=x/c,g=o(M),d=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=d?Math.max(1.4,a*.035):Math.max(1,a*.02);const _=l(g,a-a*.02),v=l(g,a-a*(d?.18:.1));if(i.beginPath(),i.moveTo(_[0],_[1]),i.lineTo(v[0],v[1]),i.stroke(),d){const y=l(g,a-a*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),y[0],y[1])}}const u=_e.clamp(n/c,0,1),f=o(u),m=l(f,a-a*.06),p=l(f+Math.PI,a*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=a*.18,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(p[0],p[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,r-a*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,r+a*.02)}function Q2(n,e){const t=Ye.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:l}=Qu(t),c=18;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke();const u=_e.clamp(n,0,1),f=n<.25;i.strokeStyle=f?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?a*.25:a*.1,i.lineWidth=Math.max(2,a*.07),i.beginPath(),i.arc(s,r,a,o(u),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=c;M+=3){const g=M/c,d=o(g),_=M%6===0;i.strokeStyle=M>=c*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=_?Math.max(1.3,a*.03):Math.max(1,a*.018);const v=l(d,a-a*.02),y=l(d,a-a*(_?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(y[0],y[1]),i.stroke(),_){const E=l(d,a-a*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const m=o(u),p=l(m,a-a*.06),x=l(m+Math.PI,a*.14);i.strokeStyle=f?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=a*.16,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,r-a*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=a*.3,i.beginPath(),i.arc(s,r+a*.02,a*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function e_(n,e){const t=Ye.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,r,a);const o=r/2,l=a-a*.14,c=Math.min(r*.46,a*.9),u=ps.max,f=v=>Math.PI-v*Math.PI,m=(v,y)=>[o+Math.cos(v)*y,l-Math.sin(v)*y];i.lineCap="round",i.lineWidth=Math.max(2,c*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,l,c,f(1),f(0)),i.stroke();const p=ps.redline/u;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,l,c,f(1),f(p)),i.stroke(),i.font=`700 ${Math.max(7,c*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const y=v/9,E=f(y),T=v*1e3>=ps.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,c*.035);const C=m(E,c-c*.02),R=m(E,c-c*.18);i.beginPath(),i.moveTo(C[0],C[1]),i.lineTo(R[0],R[1]),i.stroke();const w=m(E,c-c*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),w[0],w[1]),v<9){const S=f((v+.5)/9),L=m(S,c-c*.02),F=m(S,c-c*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,c*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(F[0],F[1]),i.stroke()}}const x=_e.clamp(n/u,0,1),M=f(x),g=m(M,c-c*.06),d=m(M+Math.PI,c*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=c*.18,i.lineWidth=Math.max(1.8,c*.05),i.beginPath(),i.moveTo(d[0],d[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,c*.03),i.beginPath(),i.arc(o,l,c*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,c*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,l-c*.26);const _=h.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,c*.22)}px "Courier New", monospace`,i.fillText(_,o,l+c*.02)}function Hr(){se.length*se.laps;const n=xd(h.practice?h.totalDistance%se.length:h.totalDistance),e=h.practice?"SOLO":`P${eh()}`;e!==h.leadState&&h.mode==="race"&&(h.leadState=e,h.practice||(h.message=e==="P1"?"You took the lead":`Now ${e}`,h.messageTimer=.95)),Ye.damage.style.width=`${Math.round(h.damage)}%`,Ye.lap.textContent=h.practice?`LAP ${h.lap}`:`${Math.min(h.lap,se.laps)}/${se.laps}`,Ye.timer.textContent=co(h.time);const t=h.mode==="roam";Ye.score.textContent=t?`Gates ${h.objectiveHits}/${$t.length}  Score ${Math.round(h.score)}`:`Score ${Math.round(h.score)}`;const i=h.mode==="race"||h.mode==="paused"||t;if(Ye.position.textContent=t?"FREE ROAM":h.freeRun?"FREE RUN":h.practice?"PRACTICE":`${e} DIV ${aa()}`,t&&$t.length){const c=$t[h.objectiveIndex%$t.length];Ye.trackName.textContent=c?`Next: ${c.label}`:"City Streets"}Ye.hud.style.display=i?"flex":"none",Ye.raceStrip.style.display=h.mode==="race"||h.mode==="paused"?"grid":"none",Ye.touchControls.style.display=i?"":"none",Ye.playerProgress.style.width=`${Math.round(n*100)}%`;for(const c of In)c.progEl&&(c.progEl.style.width=`${Math.round((h.practice?0:xd(c.distance))*100)}%`);const s=J2();h.gear=s.gear;const r=performance.now(),a=Math.min(.05,(r-Rd)/1e3);Rd=r;const o=1-Math.exp(-a*(s.rpm>h.tachRpm?10:6));h.tachRpm+=(s.rpm-h.tachRpm)*o,e_(h.tachRpm,s.gear);const l=Math.abs(h.speed)*2.25;pl+=(l-pl)*(1-Math.exp(-a*8)),ml+=(h.boost-ml)*(1-Math.exp(-a*9)),j2(pl,h.speed<-.5),Q2(ml,h.boosting),Ye.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(h.speed)-44)/150)),Ye.damageFx.style.opacity=h.damage<18?0:Math.min(.72,(h.damage-18)/82),h.mode==="paused"?(Ye.centerMessage.textContent="Paused",Ye.centerMessage.classList.remove("hidden")):h.messageTimer>0?(Ye.centerMessage.textContent=h.message,Ye.centerMessage.classList.remove("hidden")):Ye.centerMessage.classList.add("hidden")}function co(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function ef(){Zt.info.reset();const n=pv.getDelta(),e=Math.min(.033,n);h.messageTimer>0&&(h.messageTimer-=e),h.mode==="roam"?($u(e),Ju(e),T2()):h.mode==="menu"?(Cd(e),K2(e)):(ju(e),Cd(e),Z2(),$2(),th(e)),C2(),A2(),Vi&&Vi.position.copy(De.position),S2(e),Uu(e),Hr(),b2(),Dr.uniforms.uTime.value+=e,Pu.forEach(i=>i.uniforms.uTime.value+=e),Dr.uniforms.uSpeed.value=Math.min(1,Math.abs(h.speed)/150);const t=(wt.has("ShiftLeft")||wt.has("ShiftRight"))&&h.boost>.02&&(h.mode==="race"||h.mode==="roam")?1:Math.min(.75,h.roamSlip*.55+h.collisionDrama*.6);Dr.uniforms.uBoost.value+=(t-Dr.uniforms.uBoost.value)*Math.min(1,e*6),fr.render(),ke.renderCalls=Zt.info.render.calls,ke.renderTris=Zt.info.render.triangles,requestAnimationFrame(ef)}window.addEventListener("keydown",n=>{wt.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(h.mode==="race"||h.mode==="paused")&&xv(),n.code==="KeyP"&&h.mode==="race"?(h.mode="paused",wt.clear(),sa()):n.code==="KeyP"&&h.mode==="paused"?h.mode="race":n.code==="Escape"&&(h.mode==="race"||h.mode==="paused"||h.mode==="roam")&&(h.mode="menu",sa(),Rt.visible=!1,on&&(on.visible=!0),document.body.classList.remove("roam-mode"),Li(),Ye.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>wt.delete(n.code));window.addEventListener("resize",()=>{De.aspect=window.innerWidth/window.innerHeight,De.updateProjectionMatrix(),Zt.setSize(window.innerWidth,window.innerHeight),fr.setSize(window.innerWidth,window.innerHeight),Gu.setSize(window.innerWidth,window.innerHeight)});const ho=()=>{lr(),window.removeEventListener("pointerdown",ho),window.removeEventListener("keydown",ho)};window.addEventListener("pointerdown",ho);window.addEventListener("keydown",ho);const ia=document.createElement("button");ia.id="volBtn",ia.type="button";function tf(){ia.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}tf();ia.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Xe&&Xe.master.gain.setTargetAtTime(e,Xe.ctx.currentTime,.05),tf()});Ye.menu.appendChild(ia);const So=document.createElement("div");So.className="course-select";So.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';Ye.freeRunBtn.parentNode.insertBefore(So,Ye.freeRunBtn);const nf=[];bs.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>e2(e)),So.querySelector("#carButtons").appendChild(t),nf.push(t)});function gc(){const n=bs[$i],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),nf.forEach((t,i)=>t.classList.toggle("active",i===$i))}gc();Ye.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+In.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");Ye.playerProgress=document.querySelector("#playerProgress");In.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function bo(){const n=aa();Ye.startBtn.textContent=Ut?.active?`Continue Season — Race ${Ut.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=ku();e.innerHTML=`<span>Division ${Bu(n)}${Ut?.active?` — after race ${Ut.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Ut?` — ${i.pts} pts`:""}</b>`).join("")}}function t_(){h.mode="menu",sa(),Rt.visible=!1,on&&(on.visible=!0),yo(!1),document.body.classList.remove("roam-mode"),Li(),bo(),Ye.result.classList.add("hidden"),Ye.menu.classList.remove("hidden")}bo();Ye.startBtn.addEventListener("click",()=>{Ut&&Ut.active||n2(),oa(_e.clamp(Ut.raceIndex,0,3)),na(!1,!1,!0)});Ye.practiceBtn.addEventListener("click",()=>na(!0));Ye.freeRunBtn.addEventListener("click",()=>na(!0,!0));Ye.roamBtn.addEventListener("click",()=>Kc());Ye.againBtn.addEventListener("click",()=>{h.seasonRace&&Ut?Ut.active&&Ut.raceIndex<4?(oa(Ut.raceIndex),na(!1,!1,!0)):t_():na(!1)});Ye.courseButtons.forEach(n=>{n.addEventListener("click",()=>oa(Number(n.dataset.course)))});function sf(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function sa(){Fe.steer=0,Fe.throttle=0,Fe.brake=0,Fe.lookX=0,Fe.lookY=0,Fe.zoom=0,Fe.lookPointer=null,Fe.drivePointer=null,Fe.pinchStartDistance=0,Fe.pinchStartZoom=0;for(const n of Ye.touchControls.querySelectorAll(".touch-stick"))sf(n)}function Wa(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=_e.clamp(e.clientX-(t.left+t.width/2),-i,i),r=_e.clamp(e.clientY-(t.top+t.height/2),-i,i),a=n.dataset.stick;if(n.classList.add("active"),a==="look")Fe.lookX=_e.clamp(s/i,-1,1),Fe.lookY=_e.clamp(-r/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Fe.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Fe.lookY*i)}px`);else{const o=_e.clamp(s/i,-1,1),l=_e.clamp(-r/i,-1,1);Fe.steer=o,Fe.throttle=Math.max(0,l),Fe.brake=Math.max(0,-l),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-l*i)}px`)}}function Pd(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function Ld(n,e){e==="look"?(Fe.lookX=0,Fe.lookY=0,Fe.lookPointer=null):(Fe.steer=0,Fe.throttle=0,Fe.brake=0,Fe.drivePointer=null),sf(n)}function n_(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function rf(n,e=!1){if(n.touches.length<2){Fe.pinchStartDistance=0;return}const t=n_(n.touches[0],n.touches[1]);if(e||!(Fe.pinchStartDistance>0)){Fe.pinchStartDistance=t,Fe.pinchStartZoom=Fe.zoom;return}const i=Math.max(.2,t/Fe.pinchStartDistance);Fe.zoom=_e.clamp(Fe.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of Ye.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),lr(),h.mode==="paused"&&(h.mode="race"),e==="look"&&(Fe.lookPointer=s.pointerId),e==="drive"&&(Fe.drivePointer=s.pointerId),Wa(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Fe.lookPointer:Fe.drivePointer)===s.pointerId&&(s.preventDefault(),Wa(n,s))},{passive:!1});const t=s=>{(e==="look"?Fe.lookPointer:Fe.drivePointer)===s.pointerId&&Ld(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),lr(),h.mode==="paused"&&(h.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Fe.lookPointer=r.identifier),e==="drive"&&(Fe.drivePointer=r.identifier),Wa(n,r))},{passive:!1}),n.addEventListener("touchmove",s=>{const r=e==="look"?Fe.lookPointer:Fe.drivePointer,a=Pd(s,r);a&&(s.preventDefault(),Wa(n,a))},{passive:!1});const i=s=>{const r=e==="look"?Fe.lookPointer:Fe.drivePointer;Pd(s,r)&&(s.preventDefault(),Ld(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of Ye.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),lr(),wt.add(e),n.setPointerCapture(i.pointerId)});const t=()=>wt.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}ra.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),rf(n,!0))},{passive:!1});ra.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),rf(n))},{passive:!1});ra.addEventListener("touchend",n=>{n.touches.length<2&&(Fe.pinchStartDistance=0)},{passive:!1});ra.addEventListener("touchcancel",()=>{Fe.pinchStartDistance=0},{passive:!1});const i_=ct(h.s);h.y=i_.p.y+2.1;h.lastSafeS=h.s;h.lastSafeDistance=h.totalDistance;th(.016);Hr();ef();
