(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Bh="181",Sp=0,zd=1,Tp=2,y0=1,b0=2,Qi=3,Es=0,In=1,wt=2,zi=0,Ia=1,ai=2,Nd=3,kd=4,Ep=5,Gs=100,Ap=101,Cp=102,Rp=103,Pp=104,Lp=200,Dp=201,Ip=202,Fp=203,Pc=204,Lc=205,Up=206,zp=207,Np=208,kp=209,Op=210,Bp=211,Vp=212,Gp=213,Hp=214,Dc=0,Ic=1,Fc=2,Oa=3,Uc=4,zc=5,Nc=6,kc=7,Vh=0,Wp=1,Xp=2,ws=0,w0=1,S0=2,T0=3,Gh=4,E0=5,A0=6,C0=7,R0=300,Ba=301,Va=302,Oc=303,Bc=304,yl=306,zn=1e3,ns=1001,Vc=1002,Jn=1003,qp=1004,ao=1005,ri=1006,zl=1007,Ws=1008,Hi=1009,P0=1010,L0=1011,Lr=1012,Hh=1013,Qs=1014,Ii=1015,Ni=1016,Wh=1017,Xh=1018,Dr=1020,D0=35902,I0=35899,F0=1021,U0=1022,Mi=1023,Ir=1026,Fr=1027,qh=1028,Yh=1029,$h=1030,Zh=1031,Kh=1033,Yo=33776,$o=33777,Zo=33778,Ko=33779,Gc=35840,Hc=35841,Wc=35842,Xc=35843,qc=36196,Yc=37492,$c=37496,Zc=37808,Kc=37809,Jc=37810,jc=37811,Qc=37812,eh=37813,th=37814,nh=37815,ih=37816,sh=37817,ah=37818,rh=37819,oh=37820,lh=37821,ch=36492,hh=36494,dh=36495,uh=36283,fh=36284,ph=36285,mh=36286,Yp=3200,$p=3201,Jh=0,Zp=1,Ms="",Lt="srgb",Ga="srgb-linear",nl="linear",$t="srgb",ra=7680,Od=519,Kp=512,Jp=513,jp=514,z0=515,Qp=516,em=517,tm=518,nm=519,xh=35044,Bd="300 es",Fi=2e3,il=2001;function N0(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function sl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function im(){const n=sl("canvas");return n.style.display="block",n}const Vd={};function al(...n){const e="THREE."+n.shift();console.log(e,...n)}function vt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function ln(...n){const e="THREE."+n.shift();console.error(e,...n)}function Ur(...n){const e=n.join(" ");e in Vd||(Vd[e]=!0,vt(...n))}function sm(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}class Ya{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Gd=1234567;const Mr=Math.PI/180,zr=180/Math.PI;function ki(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rn[n&255]+Rn[n>>8&255]+Rn[n>>16&255]+Rn[n>>24&255]+"-"+Rn[e&255]+Rn[e>>8&255]+"-"+Rn[e>>16&15|64]+Rn[e>>24&255]+"-"+Rn[t&63|128]+Rn[t>>8&255]+"-"+Rn[t>>16&255]+Rn[t>>24&255]+Rn[i&255]+Rn[i>>8&255]+Rn[i>>16&255]+Rn[i>>24&255]).toLowerCase()}function Dt(n,e,t){return Math.max(e,Math.min(t,n))}function jh(n,e){return(n%e+e)%e}function am(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function rm(n,e,t){return n!==e?(t-n)/(e-n):0}function _r(n,e,t){return(1-t)*n+t*e}function om(n,e,t,i){return _r(n,e,1-Math.exp(-t*i))}function lm(n,e=1){return e-Math.abs(jh(n,e*2)-e)}function cm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function hm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function dm(n,e){return n+Math.floor(Math.random()*(e-n+1))}function um(n,e){return n+Math.random()*(e-n)}function fm(n){return n*(.5-Math.random())}function pm(n){n!==void 0&&(Gd=n);let e=Gd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function mm(n){return n*Mr}function xm(n){return n*zr}function gm(n){return(n&n-1)===0&&n!==0}function vm(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Mm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function _m(n,e,t,i,s){const a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),h=a((e+i)/2),d=r((e+i)/2),u=a((e-i)/2),m=r((e-i)/2),p=a((i-e)/2),x=r((i-e)/2);switch(s){case"XYX":n.set(o*d,c*u,c*m,o*h);break;case"YZY":n.set(c*m,o*d,c*u,o*h);break;case"ZXZ":n.set(c*u,c*m,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*p,o*h);break;case"YXY":n.set(c*p,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*p,o*d,o*h);break;default:vt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function xi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Zt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const xe={DEG2RAD:Mr,RAD2DEG:zr,generateUUID:ki,clamp:Dt,euclideanModulo:jh,mapLinear:am,inverseLerp:rm,lerp:_r,damp:om,pingpong:lm,smoothstep:cm,smootherstep:hm,randInt:dm,randFloat:um,randFloatSpread:fm,seededRandom:pm,degToRad:mm,radToDeg:xm,isPowerOfTwo:gm,ceilPowerOfTwo:vm,floorPowerOfTwo:Mm,setQuaternionFromProperEuler:_m,normalize:Zt,denormalize:xi};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Dt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Dt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ss{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let c=i[s+0],h=i[s+1],d=i[s+2],u=i[s+3],m=a[r+0],p=a[r+1],x=a[r+2],M=a[r+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=m,e[t+1]=p,e[t+2]=x,e[t+3]=M;return}if(u!==M||c!==m||h!==p||d!==x){let g=c*m+h*p+d*x+u*M;g<0&&(m=-m,p=-p,x=-x,M=-M,g=-g);let f=1-o;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);f=Math.sin(f*y)/v,o=Math.sin(o*y)/v,c=c*f+m*o,h=h*f+p*o,d=d*f+x*o,u=u*f+M*o}else{c=c*f+m*o,h=h*f+p*o,d=d*f+x*o,u=u*f+M*o;const y=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=y,h*=y,d*=y,u*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],u=a[r],m=a[r+1],p=a[r+2],x=a[r+3];return e[t]=o*x+d*u+c*p-h*m,e[t+1]=c*x+d*m+h*u-o*p,e[t+2]=h*x+d*p+o*m-c*u,e[t+3]=d*x-o*u-c*m-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),u=o(a/2),m=c(i/2),p=c(s/2),x=c(a/2);switch(r){case"XYZ":this._x=m*d*u+h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u-m*p*x;break;case"YXZ":this._x=m*d*u+h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u+m*p*x;break;case"ZXY":this._x=m*d*u-h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u-m*p*x;break;case"ZYX":this._x=m*d*u-h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u+m*p*x;break;case"YZX":this._x=m*d*u+h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u-m*p*x;break;case"XZY":this._x=m*d*u-h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u+m*p*x;break;default:vt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],h=t[2],d=t[6],u=t[10],m=i+o+u;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(d-c)*p,this._y=(a-h)*p,this._z=(r-s)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+r)/p,this._z=(a+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(a-h)/p,this._x=(s+r)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(r-s)/p,this._x=(a+h)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Dt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+r*o+s*h-a*c,this._y=s*d+r*c+a*o-i*h,this._z=a*d+r*h+i*c-s*o,this._w=r*d-i*o-s*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Hd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Hd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,h=2*(r*s-o*i),d=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+c*h+r*u-o*d,this.y=i+c*d+o*h-a*u,this.z=s+c*u+a*d-r*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this.z=Dt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this.z=Dt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Dt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Nl.copy(this).projectOnVector(e),this.sub(Nl)}reflect(e){return this.sub(Nl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Dt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Nl=new P,Hd=new ss;class Ct{constructor(e,t,i,s,a,r,o,c,h){Ct.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h)}set(e,t,i,s,a,r,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],c=i[6],h=i[1],d=i[4],u=i[7],m=i[2],p=i[5],x=i[8],M=s[0],g=s[3],f=s[6],y=s[1],v=s[4],_=s[7],E=s[2],T=s[5],A=s[8];return a[0]=r*M+o*y+c*E,a[3]=r*g+o*v+c*T,a[6]=r*f+o*_+c*A,a[1]=h*M+d*y+u*E,a[4]=h*g+d*v+u*T,a[7]=h*f+d*_+u*A,a[2]=m*M+p*y+x*E,a[5]=m*g+p*v+x*T,a[8]=m*f+p*_+x*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*r*d-t*o*h-i*a*d+i*o*c+s*a*h-s*r*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=d*r-o*h,m=o*c-d*a,p=h*a-r*c,x=t*u+i*m+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=u*M,e[1]=(s*h-d*i)*M,e[2]=(o*i-s*r)*M,e[3]=m*M,e[4]=(d*t-s*c)*M,e[5]=(s*a-o*t)*M,e[6]=p*M,e[7]=(i*c-h*t)*M,e[8]=(r*t-i*a)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const c=Math.cos(a),h=Math.sin(a);return this.set(i*c,i*h,-i*(c*r+h*o)+r+e,-s*h,s*c,-s*(-h*r+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(kl.makeScale(e,t)),this}rotate(e){return this.premultiply(kl.makeRotation(-e)),this}translate(e,t){return this.premultiply(kl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const kl=new Ct,Wd=new Ct().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xd=new Ct().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ym(){const n={enabled:!0,workingColorSpace:Ga,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===$t&&(s.r=is(s.r),s.g=is(s.g),s.b=is(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===$t&&(s.r=Fa(s.r),s.g=Fa(s.g),s.b=Fa(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ms?nl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Ur("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Ur("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ga]:{primaries:e,whitePoint:i,transfer:nl,toXYZ:Wd,fromXYZ:Xd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:i,transfer:$t,toXYZ:Wd,fromXYZ:Xd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),n}const kt=ym();function is(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Fa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let oa;class bm{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{oa===void 0&&(oa=sl("canvas")),oa.width=e.width,oa.height=e.height;const s=oa.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=oa}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=sl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=is(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(is(t[i]/255)*255):t[i]=is(t[i]);return{data:t,width:e.width,height:e.height}}else return vt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let wm=0;class Qh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=ki(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Ol(s[r].image)):a.push(Ol(s[r]))}else a=Ol(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Ol(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?bm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(vt("Texture: Unable to serialize Texture."),{})}let Sm=0;const Bl=new P;class Fn extends Ya{constructor(e=Fn.DEFAULT_IMAGE,t=Fn.DEFAULT_MAPPING,i=ns,s=ns,a=ri,r=Ws,o=Mi,c=Hi,h=Fn.DEFAULT_ANISOTROPY,d=Ms){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=ki(),this.name="",this.source=new Qh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Bl).x}get height(){return this.source.getSize(Bl).y}get depth(){return this.source.getSize(Bl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){vt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){vt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==R0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zn:e.x=e.x-Math.floor(e.x);break;case ns:e.x=e.x<0?0:1;break;case Vc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zn:e.y=e.y-Math.floor(e.y);break;case ns:e.y=e.y<0?0:1;break;case Vc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Fn.DEFAULT_IMAGE=null;Fn.DEFAULT_MAPPING=R0;Fn.DEFAULT_ANISOTROPY=1;class Kt{constructor(e=0,t=0,i=0,s=1){Kt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const c=e.elements,h=c[0],d=c[4],u=c[8],m=c[1],p=c[5],x=c[9],M=c[2],g=c[6],f=c[10];if(Math.abs(d-m)<.01&&Math.abs(u-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+m)<.1&&Math.abs(u+M)<.1&&Math.abs(x+g)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,_=(p+1)/2,E=(f+1)/2,T=(d+m)/4,A=(u+M)/4,C=(x+g)/4;return v>_&&v>E?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=T/i,a=A/i):_>E?_<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(_),i=T/s,a=C/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=A/a,s=C/a),this.set(i,s,a,t),this}let y=Math.sqrt((g-x)*(g-x)+(u-M)*(u-M)+(m-d)*(m-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(u-M)/y,this.z=(m-d)/y,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this.z=Dt(this.z,e.z,t.z),this.w=Dt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this.z=Dt(this.z,e,t),this.w=Dt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Dt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tm extends Ya{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ri,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Kt(0,0,e,t),this.scissorTest=!1,this.viewport=new Kt(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Fn(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ri,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Qh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yi extends Tm{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class k0 extends Fn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Em extends Fn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ia{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(hi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(hi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=hi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,hi):hi.fromBufferAttribute(a,r),hi.applyMatrix4(e.matrixWorld),this.expandByPoint(hi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ro.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ro.copy(i.boundingBox)),ro.applyMatrix4(e.matrixWorld),this.union(ro)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hi),hi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(nr),oo.subVectors(this.max,nr),la.subVectors(e.a,nr),ca.subVectors(e.b,nr),ha.subVectors(e.c,nr),rs.subVectors(ca,la),os.subVectors(ha,ca),Ds.subVectors(la,ha);let t=[0,-rs.z,rs.y,0,-os.z,os.y,0,-Ds.z,Ds.y,rs.z,0,-rs.x,os.z,0,-os.x,Ds.z,0,-Ds.x,-rs.y,rs.x,0,-os.y,os.x,0,-Ds.y,Ds.x,0];return!Vl(t,la,ca,ha,oo)||(t=[1,0,0,0,1,0,0,0,1],!Vl(t,la,ca,ha,oo))?!1:(lo.crossVectors(rs,os),t=[lo.x,lo.y,lo.z],Vl(t,la,ca,ha,oo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Yi=[new P,new P,new P,new P,new P,new P,new P,new P],hi=new P,ro=new ia,la=new P,ca=new P,ha=new P,rs=new P,os=new P,Ds=new P,nr=new P,oo=new P,lo=new P,Is=new P;function Vl(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Is.fromArray(n,a);const o=s.x*Math.abs(Is.x)+s.y*Math.abs(Is.y)+s.z*Math.abs(Is.z),c=e.dot(Is),h=t.dot(Is),d=i.dot(Is);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const Am=new ia,ir=new P,Gl=new P;class $a{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Am.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ir.subVectors(e,this.center);const t=ir.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ir,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ir.copy(e.center).add(Gl)),this.expandByPoint(ir.copy(e.center).sub(Gl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const $i=new P,Hl=new P,co=new P,ls=new P,Wl=new P,ho=new P,Xl=new P;class ed{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$i)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=$i.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($i.copy(this.origin).addScaledVector(this.direction,t),$i.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Hl.copy(e).add(t).multiplyScalar(.5),co.copy(t).sub(e).normalize(),ls.copy(this.origin).sub(Hl);const a=e.distanceTo(t)*.5,r=-this.direction.dot(co),o=ls.dot(this.direction),c=-ls.dot(co),h=ls.lengthSq(),d=Math.abs(1-r*r);let u,m,p,x;if(d>0)if(u=r*c-o,m=r*o-c,x=a*d,u>=0)if(m>=-x)if(m<=x){const M=1/d;u*=M,m*=M,p=u*(u+r*m+2*o)+m*(r*u+m+2*c)+h}else m=a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;else m=-a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;else m<=-x?(u=Math.max(0,-(-r*a+o)),m=u>0?-a:Math.min(Math.max(-a,-c),a),p=-u*u+m*(m+2*c)+h):m<=x?(u=0,m=Math.min(Math.max(-a,-c),a),p=m*(m+2*c)+h):(u=Math.max(0,-(r*a+o)),m=u>0?a:Math.min(Math.max(-a,-c),a),p=-u*u+m*(m+2*c)+h);else m=r>0?-a:a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Hl).addScaledVector(co,m),p}intersectSphere(e,t){$i.subVectors(e.center,this.origin);const i=$i.dot(this.direction),s=$i.dot($i)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,m=this.origin;return h>=0?(i=(e.min.x-m.x)*h,s=(e.max.x-m.x)*h):(i=(e.max.x-m.x)*h,s=(e.min.x-m.x)*h),d>=0?(a=(e.min.y-m.y)*d,r=(e.max.y-m.y)*d):(a=(e.max.y-m.y)*d,r=(e.min.y-m.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-m.z)*u,c=(e.max.z-m.z)*u):(o=(e.max.z-m.z)*u,c=(e.min.z-m.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,$i)!==null}intersectTriangle(e,t,i,s,a){Wl.subVectors(t,e),ho.subVectors(i,e),Xl.crossVectors(Wl,ho);let r=this.direction.dot(Xl),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;ls.subVectors(this.origin,e);const c=o*this.direction.dot(ho.crossVectors(ls,ho));if(c<0)return null;const h=o*this.direction.dot(Wl.cross(ls));if(h<0||c+h>r)return null;const d=-o*ls.dot(Xl);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,i,s,a,r,o,c,h,d,u,m,p,x,M,g){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h,d,u,m,p,x,M,g)}set(e,t,i,s,a,r,o,c,h,d,u,m,p,x,M,g){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=c,f[2]=h,f[6]=d,f[10]=u,f[14]=m,f[3]=p,f[7]=x,f[11]=M,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/da.setFromMatrixColumn(e,0).length(),a=1/da.setFromMatrixColumn(e,1).length(),r=1/da.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const m=r*d,p=r*u,x=o*d,M=o*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=p+x*h,t[5]=m-M*h,t[9]=-o*c,t[2]=M-m*h,t[6]=x+p*h,t[10]=r*c}else if(e.order==="YXZ"){const m=c*d,p=c*u,x=h*d,M=h*u;t[0]=m+M*o,t[4]=x*o-p,t[8]=r*h,t[1]=r*u,t[5]=r*d,t[9]=-o,t[2]=p*o-x,t[6]=M+m*o,t[10]=r*c}else if(e.order==="ZXY"){const m=c*d,p=c*u,x=h*d,M=h*u;t[0]=m-M*o,t[4]=-r*u,t[8]=x+p*o,t[1]=p+x*o,t[5]=r*d,t[9]=M-m*o,t[2]=-r*h,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const m=r*d,p=r*u,x=o*d,M=o*u;t[0]=c*d,t[4]=x*h-p,t[8]=m*h+M,t[1]=c*u,t[5]=M*h+m,t[9]=p*h-x,t[2]=-h,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const m=r*c,p=r*h,x=o*c,M=o*h;t[0]=c*d,t[4]=M-m*u,t[8]=x*u+p,t[1]=u,t[5]=r*d,t[9]=-o*d,t[2]=-h*d,t[6]=p*u+x,t[10]=m-M*u}else if(e.order==="XZY"){const m=r*c,p=r*h,x=o*c,M=o*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=m*u+M,t[5]=r*d,t[9]=p*u-x,t[2]=x*u-p,t[6]=o*d,t[10]=M*u+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Cm,e,Rm)}lookAt(e,t,i){const s=this.elements;return Yn.subVectors(e,t),Yn.lengthSq()===0&&(Yn.z=1),Yn.normalize(),cs.crossVectors(i,Yn),cs.lengthSq()===0&&(Math.abs(i.z)===1?Yn.x+=1e-4:Yn.z+=1e-4,Yn.normalize(),cs.crossVectors(i,Yn)),cs.normalize(),uo.crossVectors(Yn,cs),s[0]=cs.x,s[4]=uo.x,s[8]=Yn.x,s[1]=cs.y,s[5]=uo.y,s[9]=Yn.y,s[2]=cs.z,s[6]=uo.z,s[10]=Yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],c=i[8],h=i[12],d=i[1],u=i[5],m=i[9],p=i[13],x=i[2],M=i[6],g=i[10],f=i[14],y=i[3],v=i[7],_=i[11],E=i[15],T=s[0],A=s[4],C=s[8],w=s[12],b=s[1],L=s[5],D=s[9],V=s[13],j=s[2],te=s[6],q=s[10],K=s[14],ne=s[3],pe=s[7],ve=s[11],$e=s[15];return a[0]=r*T+o*b+c*j+h*ne,a[4]=r*A+o*L+c*te+h*pe,a[8]=r*C+o*D+c*q+h*ve,a[12]=r*w+o*V+c*K+h*$e,a[1]=d*T+u*b+m*j+p*ne,a[5]=d*A+u*L+m*te+p*pe,a[9]=d*C+u*D+m*q+p*ve,a[13]=d*w+u*V+m*K+p*$e,a[2]=x*T+M*b+g*j+f*ne,a[6]=x*A+M*L+g*te+f*pe,a[10]=x*C+M*D+g*q+f*ve,a[14]=x*w+M*V+g*K+f*$e,a[3]=y*T+v*b+_*j+E*ne,a[7]=y*A+v*L+_*te+E*pe,a[11]=y*C+v*D+_*q+E*ve,a[15]=y*w+v*V+_*K+E*$e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],h=e[13],d=e[2],u=e[6],m=e[10],p=e[14],x=e[3],M=e[7],g=e[11],f=e[15];return x*(+a*c*u-s*h*u-a*o*m+i*h*m+s*o*p-i*c*p)+M*(+t*c*p-t*h*m+a*r*m-s*r*p+s*h*d-a*c*d)+g*(+t*h*u-t*o*p-a*r*u+i*r*p+a*o*d-i*h*d)+f*(-s*o*d-t*c*u+t*o*m+s*r*u-i*r*m+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=e[9],m=e[10],p=e[11],x=e[12],M=e[13],g=e[14],f=e[15],y=u*g*h-M*m*h+M*c*p-o*g*p-u*c*f+o*m*f,v=x*m*h-d*g*h-x*c*p+r*g*p+d*c*f-r*m*f,_=d*M*h-x*u*h+x*o*p-r*M*p-d*o*f+r*u*f,E=x*u*c-d*M*c-x*o*m+r*M*m+d*o*g-r*u*g,T=t*y+i*v+s*_+a*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=y*A,e[1]=(M*m*a-u*g*a-M*s*p+i*g*p+u*s*f-i*m*f)*A,e[2]=(o*g*a-M*c*a+M*s*h-i*g*h-o*s*f+i*c*f)*A,e[3]=(u*c*a-o*m*a-u*s*h+i*m*h+o*s*p-i*c*p)*A,e[4]=v*A,e[5]=(d*g*a-x*m*a+x*s*p-t*g*p-d*s*f+t*m*f)*A,e[6]=(x*c*a-r*g*a-x*s*h+t*g*h+r*s*f-t*c*f)*A,e[7]=(r*m*a-d*c*a+d*s*h-t*m*h-r*s*p+t*c*p)*A,e[8]=_*A,e[9]=(x*u*a-d*M*a-x*i*p+t*M*p+d*i*f-t*u*f)*A,e[10]=(r*M*a-x*o*a+x*i*h-t*M*h-r*i*f+t*o*f)*A,e[11]=(d*o*a-r*u*a-d*i*h+t*u*h+r*i*p-t*o*p)*A,e[12]=E*A,e[13]=(d*M*s-x*u*s+x*i*m-t*M*m-d*i*g+t*u*g)*A,e[14]=(x*o*s-r*M*s-x*i*c+t*M*c+r*i*g-t*o*g)*A,e[15]=(r*u*s-d*o*s+d*i*c-t*u*c-r*i*m+t*o*m)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,c=e.z,h=a*r,d=a*o;return this.set(h*r+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*r,0,h*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,h=a+a,d=r+r,u=o+o,m=a*h,p=a*d,x=a*u,M=r*d,g=r*u,f=o*u,y=c*h,v=c*d,_=c*u,E=i.x,T=i.y,A=i.z;return s[0]=(1-(M+f))*E,s[1]=(p+_)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(p-_)*T,s[5]=(1-(m+f))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(x+v)*A,s[9]=(g-y)*A,s[10]=(1-(m+M))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=da.set(s[0],s[1],s[2]).length();const r=da.set(s[4],s[5],s[6]).length(),o=da.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],di.copy(this);const h=1/a,d=1/r,u=1/o;return di.elements[0]*=h,di.elements[1]*=h,di.elements[2]*=h,di.elements[4]*=d,di.elements[5]*=d,di.elements[6]*=d,di.elements[8]*=u,di.elements[9]*=u,di.elements[10]*=u,t.setFromRotationMatrix(di),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=Fi,c=!1){const h=this.elements,d=2*a/(t-e),u=2*a/(i-s),m=(t+e)/(t-e),p=(i+s)/(i-s);let x,M;if(c)x=a/(r-a),M=r*a/(r-a);else if(o===Fi)x=-(r+a)/(r-a),M=-2*r*a/(r-a);else if(o===il)x=-r/(r-a),M=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=m,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Fi,c=!1){const h=this.elements,d=2/(t-e),u=2/(i-s),m=-(t+e)/(t-e),p=-(i+s)/(i-s);let x,M;if(c)x=1/(r-a),M=r/(r-a);else if(o===Fi)x=-2/(r-a),M=-(r+a)/(r-a);else if(o===il)x=-1/(r-a),M=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=m,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const da=new P,di=new yt,Cm=new P(0,0,0),Rm=new P(1,1,1),cs=new P,uo=new P,Yn=new P,qd=new yt,Yd=new ss;class bi{constructor(e=0,t=0,i=0,s=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],h=s[5],d=s[9],u=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Dt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(Dt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Dt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,p),this._y=0);break;default:vt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return qd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(qd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yd.setFromEuler(this),this.setFromQuaternion(Yd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class td{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Pm=0;const $d=new P,ua=new ss,Zi=new yt,fo=new P,sr=new P,Lm=new P,Dm=new ss,Zd=new P(1,0,0),Kd=new P(0,1,0),Jd=new P(0,0,1),jd={type:"added"},Im={type:"removed"},fa={type:"childadded",child:null},ql={type:"childremoved",child:null};class Ut extends Ya{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ut.DEFAULT_UP.clone();const e=new P,t=new bi,i=new ss,s=new P(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new Ct}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new td,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ua.setFromAxisAngle(e,t),this.quaternion.multiply(ua),this}rotateOnWorldAxis(e,t){return ua.setFromAxisAngle(e,t),this.quaternion.premultiply(ua),this}rotateX(e){return this.rotateOnAxis(Zd,e)}rotateY(e){return this.rotateOnAxis(Kd,e)}rotateZ(e){return this.rotateOnAxis(Jd,e)}translateOnAxis(e,t){return $d.copy(e).applyQuaternion(this.quaternion),this.position.add($d.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zd,e)}translateY(e){return this.translateOnAxis(Kd,e)}translateZ(e){return this.translateOnAxis(Jd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?fo.copy(e):fo.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zi.lookAt(sr,fo,this.up):Zi.lookAt(fo,sr,this.up),this.quaternion.setFromRotationMatrix(Zi),s&&(Zi.extractRotation(s.matrixWorld),ua.setFromRotationMatrix(Zi),this.quaternion.premultiply(ua.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ln("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(jd),fa.child=e,this.dispatchEvent(fa),fa.child=null):ln("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Im),ql.child=e,this.dispatchEvent(ql),ql.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(jd),fa.child=e,this.dispatchEvent(fa),fa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,e,Lm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,Dm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),h=r(e.textures),d=r(e.images),u=r(e.shapes),m=r(e.skeletons),p=r(e.animations),x=r(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=s,i;function r(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ut.DEFAULT_UP=new P(0,1,0);Ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ui=new P,Ki=new P,Yl=new P,Ji=new P,pa=new P,ma=new P,Qd=new P,$l=new P,Zl=new P,Kl=new P,Jl=new Kt,jl=new Kt,Ql=new Kt;class si{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),ui.subVectors(e,t),s.cross(ui);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){ui.subVectors(s,t),Ki.subVectors(i,t),Yl.subVectors(e,t);const r=ui.dot(ui),o=ui.dot(Ki),c=ui.dot(Yl),h=Ki.dot(Ki),d=Ki.dot(Yl),u=r*h-o*o;if(u===0)return a.set(0,0,0),null;const m=1/u,p=(h*c-o*d)*m,x=(r*d-o*c)*m;return a.set(1-p-x,x,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ji)===null?!1:Ji.x>=0&&Ji.y>=0&&Ji.x+Ji.y<=1}static getInterpolation(e,t,i,s,a,r,o,c){return this.getBarycoord(e,t,i,s,Ji)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Ji.x),c.addScaledVector(r,Ji.y),c.addScaledVector(o,Ji.z),c)}static getInterpolatedAttribute(e,t,i,s,a,r){return Jl.setScalar(0),jl.setScalar(0),Ql.setScalar(0),Jl.fromBufferAttribute(e,t),jl.fromBufferAttribute(e,i),Ql.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Jl,a.x),r.addScaledVector(jl,a.y),r.addScaledVector(Ql,a.z),r}static isFrontFacing(e,t,i,s){return ui.subVectors(i,t),Ki.subVectors(e,t),ui.cross(Ki).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ui.subVectors(this.c,this.b),Ki.subVectors(this.a,this.b),ui.cross(Ki).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return si.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return si.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return si.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return si.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return si.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;pa.subVectors(s,i),ma.subVectors(a,i),$l.subVectors(e,i);const c=pa.dot($l),h=ma.dot($l);if(c<=0&&h<=0)return t.copy(i);Zl.subVectors(e,s);const d=pa.dot(Zl),u=ma.dot(Zl);if(d>=0&&u<=d)return t.copy(s);const m=c*u-d*h;if(m<=0&&c>=0&&d<=0)return r=c/(c-d),t.copy(i).addScaledVector(pa,r);Kl.subVectors(e,a);const p=pa.dot(Kl),x=ma.dot(Kl);if(x>=0&&p<=x)return t.copy(a);const M=p*h-c*x;if(M<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(ma,o);const g=d*x-p*u;if(g<=0&&u-d>=0&&p-x>=0)return Qd.subVectors(a,s),o=(u-d)/(u-d+(p-x)),t.copy(s).addScaledVector(Qd,o);const f=1/(g+M+m);return r=M*f,o=m*f,t.copy(i).addScaledVector(pa,r).addScaledVector(ma,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const O0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hs={h:0,s:0,l:0},po={h:0,s:0,l:0};function ec(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,kt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=kt.workingColorSpace){return this.r=e,this.g=t,this.b=i,kt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=kt.workingColorSpace){if(e=jh(e,1),t=Dt(t,0,1),i=Dt(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=ec(r,a,e+1/3),this.g=ec(r,a,e),this.b=ec(r,a,e-1/3)}return kt.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function i(a){a!==void 0&&parseFloat(a)<1&&vt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:vt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);vt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const i=O0[e.toLowerCase()];return i!==void 0?this.setHex(i,t):vt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=is(e.r),this.g=is(e.g),this.b=is(e.b),this}copyLinearToSRGB(e){return this.r=Fa(e.r),this.g=Fa(e.g),this.b=Fa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return kt.workingToColorSpace(Pn.copy(this),e),Math.round(Dt(Pn.r*255,0,255))*65536+Math.round(Dt(Pn.g*255,0,255))*256+Math.round(Dt(Pn.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=kt.workingColorSpace){kt.workingToColorSpace(Pn.copy(this),t);const i=Pn.r,s=Pn.g,a=Pn.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,h;const d=(o+r)/2;if(o===r)c=0,h=0;else{const u=r-o;switch(h=d<=.5?u/(r+o):u/(2-r-o),r){case i:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-i)/u+2;break;case a:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=kt.workingColorSpace){return kt.workingToColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=Lt){kt.workingToColorSpace(Pn.copy(this),e);const t=Pn.r,i=Pn.g,s=Pn.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(hs),this.setHSL(hs.h+e,hs.s+t,hs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(hs),e.getHSL(po);const i=_r(hs.h,po.h,t),s=_r(hs.s,po.s,t),a=_r(hs.l,po.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pn=new rt;rt.NAMES=O0;let Fm=0;class Ps extends Ya{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fm++}),this.uuid=ki(),this.name="",this.type="Material",this.blending=Ia,this.side=Es,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pc,this.blendDst=Lc,this.blendEquation=Gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=Oa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Od,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ra,this.stencilZFail=ra,this.stencilZPass=ra,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){vt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){vt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ia&&(i.blending=this.blending),this.side!==Es&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Pc&&(i.blendSrc=this.blendSrc),this.blendDst!==Lc&&(i.blendDst=this.blendDst),this.blendEquation!==Gs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Oa&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Od&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ra&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ra&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ra&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Rt extends Ps{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Vh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fn=new P,mo=new Ue;let Um=0;class jn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Um++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xh,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)mo.fromBufferAttribute(this,t),mo.applyMatrix3(e),this.setXY(t,mo.x,mo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix3(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix4(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyNormalMatrix(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.transformDirection(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Zt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array),a=Zt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xh&&(e.usage=this.usage),e}}class B0 extends jn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class V0 extends jn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class St extends jn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let zm=0;const ni=new yt,tc=new Ut,xa=new P,$n=new ia,ar=new ia,wn=new P;class jt extends Ya{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zm++}),this.uuid=ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(N0(e)?V0:B0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ct().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ni.makeRotationFromQuaternion(e),this.applyMatrix4(ni),this}rotateX(e){return ni.makeRotationX(e),this.applyMatrix4(ni),this}rotateY(e){return ni.makeRotationY(e),this.applyMatrix4(ni),this}rotateZ(e){return ni.makeRotationZ(e),this.applyMatrix4(ni),this}translate(e,t,i){return ni.makeTranslation(e,t,i),this.applyMatrix4(ni),this}scale(e,t,i){return ni.makeScale(e,t,i),this.applyMatrix4(ni),this}lookAt(e){return tc.lookAt(e),tc.updateMatrix(),this.applyMatrix4(tc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xa).negate(),this.translate(xa.x,xa.y,xa.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new St(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&vt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ia);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ln("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];$n.setFromBufferAttribute(a),this.morphTargetsRelative?(wn.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(wn),wn.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(wn)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ln('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $a);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ln("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if($n.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];ar.setFromBufferAttribute(o),this.morphTargetsRelative?(wn.addVectors($n.min,ar.min),$n.expandByPoint(wn),wn.addVectors($n.max,ar.max),$n.expandByPoint(wn)):($n.expandByPoint(ar.min),$n.expandByPoint(ar.max))}$n.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)wn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(wn));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)wn.fromBufferAttribute(o,h),c&&(xa.fromBufferAttribute(e,h),wn.add(xa)),s=Math.max(s,i.distanceToSquared(wn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ln('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ln("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new jn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<i.count;C++)o[C]=new P,c[C]=new P;const h=new P,d=new P,u=new P,m=new Ue,p=new Ue,x=new Ue,M=new P,g=new P;function f(C,w,b){h.fromBufferAttribute(i,C),d.fromBufferAttribute(i,w),u.fromBufferAttribute(i,b),m.fromBufferAttribute(a,C),p.fromBufferAttribute(a,w),x.fromBufferAttribute(a,b),d.sub(h),u.sub(h),p.sub(m),x.sub(m);const L=1/(p.x*x.y-x.x*p.y);isFinite(L)&&(M.copy(d).multiplyScalar(x.y).addScaledVector(u,-p.y).multiplyScalar(L),g.copy(u).multiplyScalar(p.x).addScaledVector(d,-x.x).multiplyScalar(L),o[C].add(M),o[w].add(M),o[b].add(M),c[C].add(g),c[w].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let C=0,w=y.length;C<w;++C){const b=y[C],L=b.start,D=b.count;for(let V=L,j=L+D;V<j;V+=3)f(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const v=new P,_=new P,E=new P,T=new P;function A(C){E.fromBufferAttribute(s,C),T.copy(E);const w=o[C];v.copy(w),v.sub(E.multiplyScalar(E.dot(w))).normalize(),_.crossVectors(T,w);const L=_.dot(c[C])<0?-1:1;r.setXYZW(C,v.x,v.y,v.z,L)}for(let C=0,w=y.length;C<w;++C){const b=y[C],L=b.start,D=b.count;for(let V=L,j=L+D;V<j;V+=3)A(e.getX(V+0)),A(e.getX(V+1)),A(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new jn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);const s=new P,a=new P,r=new P,o=new P,c=new P,h=new P,d=new P,u=new P;if(e)for(let m=0,p=e.count;m<p;m+=3){const x=e.getX(m+0),M=e.getX(m+1),g=e.getX(m+2);s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,M),r.fromBufferAttribute(t,g),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,M),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),a.fromBufferAttribute(t,m+1),r.fromBufferAttribute(t,m+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(m+0,d.x,d.y,d.z),i.setXYZ(m+1,d.x,d.y,d.z),i.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wn.fromBufferAttribute(e,t),wn.normalize(),e.setXYZ(t,wn.x,wn.y,wn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,u=o.normalized,m=new h.constructor(c.length*d);let p=0,x=0;for(let M=0,g=c.length;M<g;M++){o.isInterleavedBufferAttribute?p=c[M]*o.data.stride+o.offset:p=c[M]*d;for(let f=0;f<d;f++)m[x++]=h[p++]}return new jn(m,d,u)}if(this.index===null)return vt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new jt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const a=this.morphAttributes;for(const o in a){const c=[],h=a[o];for(let d=0,u=h.length;d<u;d++){const m=h[d],p=e(m,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const h=r[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,m=h.length;u<m;u++){const p=h[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],u=a[h];for(let m=0,p=u.length;m<p;m++)d.push(u[m].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let h=0,d=r.length;h<d;h++){const u=r[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const eu=new yt,Fs=new ed,xo=new $a,tu=new P,go=new P,vo=new P,Mo=new P,nc=new P,_o=new P,nu=new P,yo=new P;class z extends Ut{constructor(e=new jt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){_o.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=o[c],u=a[c];d!==0&&(nc.fromBufferAttribute(u,e),r?_o.addScaledVector(nc,d):_o.addScaledVector(nc.sub(t),d))}t.add(_o)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),xo.copy(i.boundingSphere),xo.applyMatrix4(a),Fs.copy(e.ray).recast(e.near),!(xo.containsPoint(Fs.origin)===!1&&(Fs.intersectSphere(xo,tu)===null||Fs.origin.distanceToSquared(tu)>(e.far-e.near)**2))&&(eu.copy(a).invert(),Fs.copy(e.ray).applyMatrix4(eu),!(i.boundingBox!==null&&Fs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Fs)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,m=a.groups,p=a.drawRange;if(o!==null)if(Array.isArray(r))for(let x=0,M=m.length;x<M;x++){const g=m[x],f=r[g.materialIndex],y=Math.max(g.start,p.start),v=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let _=y,E=v;_<E;_+=3){const T=o.getX(_),A=o.getX(_+1),C=o.getX(_+2);s=bo(this,f,e,i,h,d,u,T,A,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),M=Math.min(o.count,p.start+p.count);for(let g=x,f=M;g<f;g+=3){const y=o.getX(g),v=o.getX(g+1),_=o.getX(g+2);s=bo(this,r,e,i,h,d,u,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let x=0,M=m.length;x<M;x++){const g=m[x],f=r[g.materialIndex],y=Math.max(g.start,p.start),v=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let _=y,E=v;_<E;_+=3){const T=_,A=_+1,C=_+2;s=bo(this,f,e,i,h,d,u,T,A,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),M=Math.min(c.count,p.start+p.count);for(let g=x,f=M;g<f;g+=3){const y=g,v=g+1,_=g+2;s=bo(this,r,e,i,h,d,u,y,v,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Nm(n,e,t,i,s,a,r,o){let c;if(e.side===In?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,e.side===Es,o),c===null)return null;yo.copy(o),yo.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(yo);return h<t.near||h>t.far?null:{distance:h,point:yo.clone(),object:n}}function bo(n,e,t,i,s,a,r,o,c,h){n.getVertexPosition(o,go),n.getVertexPosition(c,vo),n.getVertexPosition(h,Mo);const d=Nm(n,e,t,i,go,vo,Mo,nu);if(d){const u=new P;si.getBarycoord(nu,go,vo,Mo,u),s&&(d.uv=si.getInterpolatedAttribute(s,o,c,h,u,new Ue)),a&&(d.uv1=si.getInterpolatedAttribute(a,o,c,h,u,new Ue)),r&&(d.normal=si.getInterpolatedAttribute(r,o,c,h,u,new P),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const m={a:o,b:c,c:h,normal:new P,materialIndex:0};si.getNormal(go,vo,Mo,m.normal),d.face=m,d.barycoord=u}return d}class le extends jt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],h=[],d=[],u=[];let m=0,p=0;x("z","y","x",-1,-1,i,t,e,r,a,0),x("z","y","x",1,-1,i,t,-e,r,a,1),x("x","z","y",1,1,e,i,t,s,r,2),x("x","z","y",1,-1,e,i,-t,s,r,3),x("x","y","z",1,-1,e,t,i,s,a,4),x("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new St(h,3)),this.setAttribute("normal",new St(d,3)),this.setAttribute("uv",new St(u,2));function x(M,g,f,y,v,_,E,T,A,C,w){const b=_/A,L=E/C,D=_/2,V=E/2,j=T/2,te=A+1,q=C+1;let K=0,ne=0;const pe=new P;for(let ve=0;ve<q;ve++){const $e=ve*L-V;for(let I=0;I<te;I++){const Ce=I*b-D;pe[M]=Ce*y,pe[g]=$e*v,pe[f]=j,h.push(pe.x,pe.y,pe.z),pe[M]=0,pe[g]=0,pe[f]=T>0?1:-1,d.push(pe.x,pe.y,pe.z),u.push(I/A),u.push(1-ve/C),K+=1}}for(let ve=0;ve<C;ve++)for(let $e=0;$e<A;$e++){const I=m+$e+te*ve,Ce=m+$e+te*(ve+1),be=m+($e+1)+te*(ve+1),Re=m+($e+1)+te*ve;c.push(I,Ce,Re),c.push(Ce,be,Re),ne+=6}o.addGroup(p,ne,w),p+=ne,m+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new le(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ha(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(vt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Vn(n){const e={};for(let t=0;t<n.length;t++){const i=Ha(n[t]);for(const s in i)e[s]=i[s]}return e}function km(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function G0(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:kt.workingColorSpace}const Nr={clone:Ha,merge:Vn};var Om=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sn extends Ps{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Om,this.fragmentShader=Bm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ha(e.uniforms),this.uniformsGroups=km(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class H0 extends Ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Fi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ds=new P,iu=new Ue,su=new Ue;class Zn extends H0{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=zr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Mr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zr*2*Math.atan(Math.tan(Mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ds.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ds.x,ds.y).multiplyScalar(-e/ds.z),ds.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ds.x,ds.y).multiplyScalar(-e/ds.z)}getViewSize(e,t){return this.getViewBounds(e,iu,su),t.subVectors(su,iu)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Mr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,h=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*i/h,s*=r.width/c,i*=r.height/h}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ga=-90,va=1;class Vm extends Ut{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zn(ga,va,e,t);s.layers=this.layers,this.add(s);const a=new Zn(ga,va,e,t);a.layers=this.layers,this.add(a);const r=new Zn(ga,va,e,t);r.layers=this.layers,this.add(r);const o=new Zn(ga,va,e,t);o.layers=this.layers,this.add(o);const c=new Zn(ga,va,e,t);c.layers=this.layers,this.add(c);const h=new Zn(ga,va,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,c]=t;for(const h of t)this.remove(h);if(e===Fi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===il)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,h,d]=this.children,u=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,m,p),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class W0 extends Fn{constructor(e=[],t=Ba,i,s,a,r,o,c,h,d){super(e,t,i,s,a,r,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gm extends yi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new W0(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new le(5,5,5),a=new Sn({name:"CubemapFromEquirect",uniforms:Ha(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:In,blending:zi});a.uniforms.tEquirect.value=t;const r=new z(s,a),o=t.minFilter;return t.minFilter===Ws&&(t.minFilter=ri),new Vm(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class tt extends Ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hm={type:"move"};class ic{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){r=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),f=this._getHandJoint(h,M);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],m=d.position.distanceTo(u.position),p=.02,x=.005;h.inputState.pinching&&m>p+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=p-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hm)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new tt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class nd{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new rt(e),this.near=t,this.far=i}clone(){return new nd(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class X0 extends Ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Wm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=xh,this.updateRanges=[],this.version=0,this.uuid=ki()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ki()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ki()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const On=new P;class rl{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)On.fromBufferAttribute(this,t),On.applyMatrix4(e),this.setXYZ(t,On.x,On.y,On.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)On.fromBufferAttribute(this,t),On.applyNormalMatrix(e),this.setXYZ(t,On.x,On.y,On.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)On.fromBufferAttribute(this,t),On.transformDirection(e),this.setXYZ(t,On.x,On.y,On.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Zt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=xi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=xi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=xi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=xi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array),a=Zt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){al("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new jn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new rl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){al("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class bl extends Ps{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ma;const rr=new P,_a=new P,ya=new P,ba=new Ue,or=new Ue,q0=new yt,wo=new P,lr=new P,So=new P,au=new Ue,sc=new Ue,ru=new Ue;class ol extends Ut{constructor(e=new bl){if(super(),this.isSprite=!0,this.type="Sprite",Ma===void 0){Ma=new jt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Wm(t,5);Ma.setIndex([0,1,2,0,2,3]),Ma.setAttribute("position",new rl(i,3,0,!1)),Ma.setAttribute("uv",new rl(i,2,3,!1))}this.geometry=Ma,this.material=e,this.center=new Ue(.5,.5),this.count=1}raycast(e,t){e.camera===null&&ln('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_a.setFromMatrixScale(this.matrixWorld),q0.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ya.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_a.multiplyScalar(-ya.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;To(wo.set(-.5,-.5,0),ya,r,_a,s,a),To(lr.set(.5,-.5,0),ya,r,_a,s,a),To(So.set(.5,.5,0),ya,r,_a,s,a),au.set(0,0),sc.set(1,0),ru.set(1,1);let o=e.ray.intersectTriangle(wo,lr,So,!1,rr);if(o===null&&(To(lr.set(-.5,.5,0),ya,r,_a,s,a),sc.set(0,1),o=e.ray.intersectTriangle(wo,So,lr,!1,rr),o===null))return;const c=e.ray.origin.distanceTo(rr);c<e.near||c>e.far||t.push({distance:c,point:rr.clone(),uv:si.getInterpolation(rr,wo,lr,So,au,sc,ru,new Ue),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function To(n,e,t,i,s,a){ba.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(or.x=a*ba.x-s*ba.y,or.y=s*ba.x+a*ba.y):or.copy(ba),n.copy(e),n.x+=or.x,n.y+=or.y,n.applyMatrix4(q0)}class Y0 extends Fn{constructor(e=null,t=1,i=1,s,a,r,o,c,h=Jn,d=Jn,u,m){super(null,r,o,c,h,d,s,a,u,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gh extends jn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const wa=new yt,ou=new yt,Eo=[],lu=new ia,Xm=new yt,cr=new z,hr=new $a;class rn extends z{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new gh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Xm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ia),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,wa),lu.copy(e.boundingBox).applyMatrix4(wa),this.boundingBox.union(lu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $a),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,wa),hr.copy(e.boundingSphere).applyMatrix4(wa),this.boundingSphere.union(hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=e*a+1;for(let o=0;o<i.length;o++)i[o]=s[r+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(cr.geometry=this.geometry,cr.material=this.material,cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hr.copy(this.boundingSphere),hr.applyMatrix4(i),e.ray.intersectsSphere(hr)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,wa),ou.multiplyMatrices(i,wa),cr.matrixWorld=ou,cr.raycast(e,Eo);for(let r=0,o=Eo.length;r<o;r++){const c=Eo[r];c.instanceId=a,c.object=this,t.push(c)}Eo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new gh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Y0(new Float32Array(s*this.count),s,this.count,qh,Ii));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const o=this.geometry.morphTargetsRelative?1:1-r,c=s*e;a[c]=o,a.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ac=new P,qm=new P,Ym=new Ct;class Os{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ac.subVectors(i,t).cross(qm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(ac),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Ym.getNormalMatrix(e),s=this.coplanarPoint(ac).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Us=new $a,$m=new Ue(.5,.5),Ao=new P;class id{constructor(e=new Os,t=new Os,i=new Os,s=new Os,a=new Os,r=new Os){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Fi,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],h=a[3],d=a[4],u=a[5],m=a[6],p=a[7],x=a[8],M=a[9],g=a[10],f=a[11],y=a[12],v=a[13],_=a[14],E=a[15];if(s[0].setComponents(h-r,p-d,f-x,E-y).normalize(),s[1].setComponents(h+r,p+d,f+x,E+y).normalize(),s[2].setComponents(h+o,p+u,f+M,E+v).normalize(),s[3].setComponents(h-o,p-u,f-M,E-v).normalize(),i)s[4].setComponents(c,m,g,_).normalize(),s[5].setComponents(h-c,p-m,f-g,E-_).normalize();else if(s[4].setComponents(h-c,p-m,f-g,E-_).normalize(),t===Fi)s[5].setComponents(h+c,p+m,f+g,E+_).normalize();else if(t===il)s[5].setComponents(c,m,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Us.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Us.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Us)}intersectsSprite(e){Us.center.set(0,0,0);const t=$m.distanceTo(e.center);return Us.radius=.7071067811865476+t,Us.applyMatrix4(e.matrixWorld),this.intersectsSphere(Us)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Ao.x=s.normal.x>0?e.max.x:e.min.x,Ao.y=s.normal.y>0?e.max.y:e.min.y,Ao.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ao)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ll extends Ps{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const cl=new P,hl=new P,cu=new yt,dr=new ed,Co=new $a,rc=new P,hu=new P;class vh extends Ut{constructor(e=new jt,t=new ll){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)cl.fromBufferAttribute(t,s-1),hl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=cl.distanceTo(hl);e.setAttribute("lineDistance",new St(i,1))}else vt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Co.copy(i.boundingSphere),Co.applyMatrix4(s),Co.radius+=a,e.ray.intersectsSphere(Co)===!1)return;cu.copy(s).invert(),dr.copy(e.ray).applyMatrix4(cu);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,m=i.attributes.position;if(d!==null){const p=Math.max(0,r.start),x=Math.min(d.count,r.start+r.count);for(let M=p,g=x-1;M<g;M+=h){const f=d.getX(M),y=d.getX(M+1),v=Ro(this,e,dr,c,f,y,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(x-1),g=d.getX(p),f=Ro(this,e,dr,c,M,g,x-1);f&&t.push(f)}}else{const p=Math.max(0,r.start),x=Math.min(m.count,r.start+r.count);for(let M=p,g=x-1;M<g;M+=h){const f=Ro(this,e,dr,c,M,M+1,M);f&&t.push(f)}if(this.isLineLoop){const M=Ro(this,e,dr,c,x-1,p,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Ro(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(cl.fromBufferAttribute(o,s),hl.fromBufferAttribute(o,a),t.distanceSqToSegment(cl,hl,rc,hu)>i)return;rc.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(rc);if(!(h<e.near||h>e.far))return{distance:h,point:hu.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const du=new P,uu=new P;class Zm extends vh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)du.fromBufferAttribute(t,s),uu.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+du.distanceTo(uu);e.setAttribute("lineDistance",new St(i,1))}else vt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class en extends Fn{constructor(e,t,i,s,a,r,o,c,h){super(e,t,i,s,a,r,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class $0 extends Fn{constructor(e,t,i=Qs,s,a,r,o=Jn,c=Jn,h,d=Ir,u=1){if(d!==Ir&&d!==Fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:u};super(m,s,a,r,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Qh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Z0 extends Fn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class _n extends jt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],c=[],h=new P,d=new Ue;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,m=3;u<=t;u++,m+=3){const p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),r.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(r[m]/e+1)/2,d.y=(r[m+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new St(r,3)),this.setAttribute("normal",new St(o,3)),this.setAttribute("uv",new St(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _n(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class qe extends jt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],m=[],p=[];let x=0;const M=[],g=i/2;let f=0;y(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new St(u,3)),this.setAttribute("normal",new St(m,3)),this.setAttribute("uv",new St(p,2));function y(){const _=new P,E=new P;let T=0;const A=(t-e)/i;for(let C=0;C<=a;C++){const w=[],b=C/a,L=b*(t-e)+e;for(let D=0;D<=s;D++){const V=D/s,j=V*c+o,te=Math.sin(j),q=Math.cos(j);E.x=L*te,E.y=-b*i+g,E.z=L*q,u.push(E.x,E.y,E.z),_.set(te,A,q).normalize(),m.push(_.x,_.y,_.z),p.push(V,1-b),w.push(x++)}M.push(w)}for(let C=0;C<s;C++)for(let w=0;w<a;w++){const b=M[w][C],L=M[w+1][C],D=M[w+1][C+1],V=M[w][C+1];(e>0||w!==0)&&(d.push(b,L,V),T+=3),(t>0||w!==a-1)&&(d.push(L,D,V),T+=3)}h.addGroup(f,T,0),f+=T}function v(_){const E=x,T=new Ue,A=new P;let C=0;const w=_===!0?e:t,b=_===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*b,0),m.push(0,b,0),p.push(.5,.5),x++;const L=x;for(let D=0;D<=s;D++){const j=D/s*c+o,te=Math.cos(j),q=Math.sin(j);A.x=w*q,A.y=g*b,A.z=w*te,u.push(A.x,A.y,A.z),m.push(0,b,0),T.x=te*.5+.5,T.y=q*.5*b+.5,p.push(T.x,T.y),x++}for(let D=0;D<s;D++){const V=E+D,j=L+D;_===!0?d.push(j,j+1,V):d.push(j+1,j,V),C+=3}h.addGroup(f,C,_===!0?1:2),f+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Li extends qe{constructor(e=1,t=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new Li(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class wl extends jt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),h(i),d(),this.setAttribute("position",new St(a,3)),this.setAttribute("normal",new St(a.slice(),3)),this.setAttribute("uv",new St(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new P,_=new P,E=new P;for(let T=0;T<t.length;T+=3)p(t[T+0],v),p(t[T+1],_),p(t[T+2],E),c(v,_,E,y)}function c(y,v,_,E){const T=E+1,A=[];for(let C=0;C<=T;C++){A[C]=[];const w=y.clone().lerp(_,C/T),b=v.clone().lerp(_,C/T),L=T-C;for(let D=0;D<=L;D++)D===0&&C===T?A[C][D]=w:A[C][D]=w.clone().lerp(b,D/L)}for(let C=0;C<T;C++)for(let w=0;w<2*(T-C)-1;w++){const b=Math.floor(w/2);w%2===0?(m(A[C][b+1]),m(A[C+1][b]),m(A[C][b])):(m(A[C][b+1]),m(A[C+1][b+1]),m(A[C+1][b]))}}function h(y){const v=new P;for(let _=0;_<a.length;_+=3)v.x=a[_+0],v.y=a[_+1],v.z=a[_+2],v.normalize().multiplyScalar(y),a[_+0]=v.x,a[_+1]=v.y,a[_+2]=v.z}function d(){const y=new P;for(let v=0;v<a.length;v+=3){y.x=a[v+0],y.y=a[v+1],y.z=a[v+2];const _=g(y)/2/Math.PI+.5,E=f(y)/Math.PI+.5;r.push(_,1-E)}x(),u()}function u(){for(let y=0;y<r.length;y+=6){const v=r[y+0],_=r[y+2],E=r[y+4],T=Math.max(v,_,E),A=Math.min(v,_,E);T>.9&&A<.1&&(v<.2&&(r[y+0]+=1),_<.2&&(r[y+2]+=1),E<.2&&(r[y+4]+=1))}}function m(y){a.push(y.x,y.y,y.z)}function p(y,v){const _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function x(){const y=new P,v=new P,_=new P,E=new P,T=new Ue,A=new Ue,C=new Ue;for(let w=0,b=0;w<a.length;w+=9,b+=6){y.set(a[w+0],a[w+1],a[w+2]),v.set(a[w+3],a[w+4],a[w+5]),_.set(a[w+6],a[w+7],a[w+8]),T.set(r[b+0],r[b+1]),A.set(r[b+2],r[b+3]),C.set(r[b+4],r[b+5]),E.copy(y).add(v).add(_).divideScalar(3);const L=g(E);M(T,b+0,y,L),M(A,b+2,v,L),M(C,b+4,_,L)}}function M(y,v,_,E){E<0&&y.x===1&&(r[v]=y.x-1),_.x===0&&_.z===0&&(r[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wl(e.vertices,e.indices,e.radius,e.details)}}class sd extends wl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new sd(e.radius,e.detail)}}class Wi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){vt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,c=a-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-r,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const d=i[s],m=i[s+1]-d,p=(r-d)/m;return(s+p)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=t||(r.isVector2?new Ue:new P);return c.copy(o).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],a=[],r=[],o=new P,c=new yt;for(let p=0;p<=e;p++){const x=p/e;s[p]=this.getTangentAt(x,new P)}a[0]=new P,r[0]=new P;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),m=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),m<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let p=1;p<=e;p++){if(a[p]=a[p-1].clone(),r[p]=r[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(Dt(s[p-1].dot(s[p]),-1,1));a[p].applyMatrix4(c.makeRotationAxis(o,x))}r[p].crossVectors(s[p],a[p])}if(t===!0){let p=Math.acos(Dt(a[0].dot(a[e]),-1,1));p/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(p=-p);for(let x=1;x<=e;x++)a[x].applyMatrix4(c.makeRotationAxis(s[x],p*x)),r[x].crossVectors(s[x],a[x])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ad extends Wi{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ue){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),m=c-this.aX,p=h-this.aY;c=m*d-p*u+this.aX,h=m*u+p*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Km extends ad{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function rd(){let n=0,e=0,t=0,i=0;function s(a,r,o,c){n=a,e=o,t=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,h){s(r,o,h*(o-a),h*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,h,d,u){let m=(r-a)/h-(o-a)/(h+d)+(o-r)/d,p=(o-r)/d-(c-r)/(d+u)+(c-o)/u;m*=d,p*=d,s(r,o,m,p)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const Po=new P,oc=new rd,lc=new rd,cc=new rd;class Jm extends Wi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%a]:(Po.subVectors(s[0],s[1]).add(s[0]),h=Po);const u=s[o%a],m=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(Po.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=Po),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(u),p),M=Math.pow(u.distanceToSquared(m),p),g=Math.pow(m.distanceToSquared(d),p);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),oc.initNonuniformCatmullRom(h.x,u.x,m.x,d.x,x,M,g),lc.initNonuniformCatmullRom(h.y,u.y,m.y,d.y,x,M,g),cc.initNonuniformCatmullRom(h.z,u.z,m.z,d.z,x,M,g)}else this.curveType==="catmullrom"&&(oc.initCatmullRom(h.x,u.x,m.x,d.x,this.tension),lc.initCatmullRom(h.y,u.y,m.y,d.y,this.tension),cc.initCatmullRom(h.z,u.z,m.z,d.z,this.tension));return i.set(oc.calc(c),lc.calc(c),cc.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function fu(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+a+r)*c+(-3*t+3*i-2*a-r)*o+a*n+t}function jm(n,e){const t=1-n;return t*t*e}function Qm(n,e){return 2*(1-n)*n*e}function ex(n,e){return n*n*e}function yr(n,e,t,i){return jm(n,e)+Qm(n,t)+ex(n,i)}function tx(n,e){const t=1-n;return t*t*t*e}function nx(n,e){const t=1-n;return 3*t*t*n*e}function ix(n,e){return 3*(1-n)*n*n*e}function sx(n,e){return n*n*n*e}function br(n,e,t,i,s){return tx(n,e)+nx(n,t)+ix(n,i)+sx(n,s)}class K0 extends Wi{constructor(e=new Ue,t=new Ue,i=new Ue,s=new Ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ue){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(br(e,s.x,a.x,r.x,o.x),br(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ax extends Wi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(br(e,s.x,a.x,r.x,o.x),br(e,s.y,a.y,r.y,o.y),br(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class J0 extends Wi{constructor(e=new Ue,t=new Ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ue){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class rx extends Wi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class j0 extends Wi{constructor(e=new Ue,t=new Ue,i=new Ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ue){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(yr(e,s.x,a.x,r.x),yr(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ox extends Wi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(yr(e,s.x,a.x,r.x),yr(e,s.y,a.y,r.y),yr(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Q0 extends Wi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ue){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],h=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(fu(o,c.x,h.x,d.x,u.x),fu(o,c.y,h.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Ue().fromArray(s))}return this}}var pu=Object.freeze({__proto__:null,ArcCurve:Km,CatmullRomCurve3:Jm,CubicBezierCurve:K0,CubicBezierCurve3:ax,EllipseCurve:ad,LineCurve:J0,LineCurve3:rx,QuadraticBezierCurve:j0,QuadraticBezierCurve3:ox,SplineCurve:Q0});class lx extends Wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pu[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),h=c===0?0:1-r/c;return o.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new pu[s.type]().fromJSON(s))}return this}}class mu extends lx{constructor(e){super(),this.type="Path",this.currentPoint=new Ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new J0(this.currentPoint.clone(),new Ue(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new j0(this.currentPoint.clone(),new Ue(e,t),new Ue(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new K0(this.currentPoint.clone(),new Ue(e,t),new Ue(i,s),new Ue(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Q0(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,a,r,o,c),this}absellipse(e,t,i,s,a,r,o,c){const h=new ad(e,t,i,s,a,r,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class od extends mu{constructor(e){super(e),this.uuid=ki(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new mu().fromJSON(s))}return this}}function cx(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=ef(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,h;if(i&&(a=px(n,e,a,t)),n.length>80*t){o=n[0],c=n[1];let d=o,u=c;for(let m=t;m<s;m+=t){const p=n[m],x=n[m+1];p<o&&(o=p),x<c&&(c=x),p>d&&(d=p),x>u&&(u=x)}h=Math.max(d-o,u-c),h=h!==0?32767/h:0}return kr(a,r,t,o,c,h,0),r}function ef(n,e,t,i,s){let a;if(s===Tx(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=xu(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=xu(r/i|0,n[r],n[r+1],a);return a&&Wa(a,a.next)&&(Br(a),a=a.next),a}function ea(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Wa(t,t.next)||cn(t.prev,t,t.next)===0)){if(Br(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function kr(n,e,t,i,s,a,r){if(!n)return;!r&&a&&Mx(n,i,s,a);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(a?dx(n,i,s,a):hx(n)){e.push(c.i,n.i,h.i),Br(n),n=h.next,o=h.next;continue}if(n=h,n===o){r?r===1?(n=ux(ea(n),e),kr(n,e,t,i,s,a,2)):r===2&&fx(n,e,t,i,s,a):kr(ea(n),e,t,i,s,a,1);break}}}function hx(n){const e=n.prev,t=n,i=n.next;if(cn(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,a,r),u=Math.min(o,c,h),m=Math.max(s,a,r),p=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=m&&x.y>=u&&x.y<=p&&xr(s,o,a,c,r,h,x.x,x.y)&&cn(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function dx(n,e,t,i){const s=n.prev,a=n,r=n.next;if(cn(s,a,r)>=0)return!1;const o=s.x,c=a.x,h=r.x,d=s.y,u=a.y,m=r.y,p=Math.min(o,c,h),x=Math.min(d,u,m),M=Math.max(o,c,h),g=Math.max(d,u,m),f=Mh(p,x,e,t,i),y=Mh(M,g,e,t,i);let v=n.prevZ,_=n.nextZ;for(;v&&v.z>=f&&_&&_.z<=y;){if(v.x>=p&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&xr(o,d,c,u,h,m,v.x,v.y)&&cn(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=p&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&xr(o,d,c,u,h,m,_.x,_.y)&&cn(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&xr(o,d,c,u,h,m,v.x,v.y)&&cn(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=y;){if(_.x>=p&&_.x<=M&&_.y>=x&&_.y<=g&&_!==s&&_!==r&&xr(o,d,c,u,h,m,_.x,_.y)&&cn(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function ux(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Wa(i,s)&&nf(i,t,t.next,s)&&Or(i,s)&&Or(s,i)&&(e.push(i.i,t.i,s.i),Br(t),Br(t.next),t=n=s),t=t.next}while(t!==n);return ea(t)}function fx(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&bx(r,o)){let c=sf(r,o);r=ea(r,r.next),c=ea(c,c.next),kr(r,e,t,i,s,a,0),kr(c,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function px(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,c=a<r-1?e[a+1]*i:n.length,h=ef(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(yx(h))}s.sort(mx);for(let a=0;a<s.length;a++)t=xx(s[a],t);return t}function mx(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function xx(n,e){const t=gx(n,e);if(!t)return e;const i=sf(t,n);return ea(i,i.next),ea(t,t.next)}function gx(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(Wa(n,t))return t;do{if(Wa(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,c=r.x,h=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=c&&i!==t.x&&tf(s<h?i:a,s,c,h,s<h?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Or(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&vx(r,t)))&&(r=t,d=u)}t=t.next}while(t!==o);return r}function vx(n,e){return cn(n.prev,n,e.prev)<0&&cn(e.next,n,n.next)<0}function Mx(n,e,t,i){let s=n;do s.z===0&&(s.z=Mh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,_x(s)}function _x(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let h=0;h<t&&(o++,r=r.nextZ,!!r);h++);let c=t;for(;o>0||c>0&&r;)o!==0&&(c===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function Mh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function yx(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function tf(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function xr(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&tf(n,e,t,i,s,a,r,o)}function bx(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!wx(n,e)&&(Or(n,e)&&Or(e,n)&&Sx(n,e)&&(cn(n.prev,n,e.prev)||cn(n,e.prev,e))||Wa(n,e)&&cn(n.prev,n,n.next)>0&&cn(e.prev,e,e.next)>0)}function cn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Wa(n,e){return n.x===e.x&&n.y===e.y}function nf(n,e,t,i){const s=Do(cn(n,e,t)),a=Do(cn(n,e,i)),r=Do(cn(t,i,n)),o=Do(cn(t,i,e));return!!(s!==a&&r!==o||s===0&&Lo(n,t,e)||a===0&&Lo(n,i,e)||r===0&&Lo(t,n,i)||o===0&&Lo(t,e,i))}function Lo(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Do(n){return n>0?1:n<0?-1:0}function wx(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&nf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Or(n,e){return cn(n.prev,n,n.next)<0?cn(n,e,n.next)>=0&&cn(n,n.prev,e)>=0:cn(n,e,n.prev)<0||cn(n,n.next,e)<0}function Sx(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function sf(n,e){const t=_h(n.i,n.x,n.y),i=_h(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function xu(n,e,t,i){const s=_h(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Br(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function _h(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Tx(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class Ex{static triangulate(e,t,i=2){return cx(e,t,i)}}class wr{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return wr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];gu(e),vu(i,e);let r=e.length;t.forEach(gu);for(let c=0;c<t.length;c++)s.push(r),r+=t[c].length,vu(i,t[c]);const o=Ex.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function gu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function vu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class ld extends wl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ld(e.radius,e.detail)}}class zt extends jt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,u=e/o,m=t/c,p=[],x=[],M=[],g=[];for(let f=0;f<d;f++){const y=f*m-r;for(let v=0;v<h;v++){const _=v*u-a;x.push(_,-y,0),M.push(0,0,1),g.push(v/o),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<o;y++){const v=y+h*f,_=y+h*(f+1),E=y+1+h*(f+1),T=y+1+h*f;p.push(v,_,T),p.push(_,E,T)}this.setIndex(p),this.setAttribute("position",new St(x,3)),this.setAttribute("normal",new St(M,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Sl extends jt{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let u=e;const m=(t-e)/s,p=new P,x=new Ue;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const f=a+g/i*r;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),h.push(0,0,1),x.x=(p.x/t+1)/2,x.y=(p.y/t+1)/2,d.push(x.x,x.y)}u+=m}for(let M=0;M<s;M++){const g=M*(i+1);for(let f=0;f<i;f++){const y=f+g,v=y,_=y+i+1,E=y+i+2,T=y+1;o.push(v,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(h,3)),this.setAttribute("uv",new St(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Tl extends jt{constructor(e=new od([new Ue(0,.5),new Ue(-.5,-.5),new Ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new St(s,3)),this.setAttribute("normal",new St(a,3)),this.setAttribute("uv",new St(r,2));function h(d){const u=s.length/3,m=d.extractPoints(t);let p=m.shape;const x=m.holes;wr.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,f=x.length;g<f;g++){const y=x[g];wr.isClockWise(y)===!0&&(x[g]=y.reverse())}const M=wr.triangulateShape(p,x);for(let g=0,f=x.length;g<f;g++){const y=x[g];p=p.concat(y)}for(let g=0,f=p.length;g<f;g++){const y=p[g];s.push(y.x,y.y,0),a.push(0,0,1),r.push(y.x,y.y)}for(let g=0,f=M.length;g<f;g++){const y=M[g],v=y[0]+u,_=y[1]+u,E=y[2]+u;i.push(v,_,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Ax(t,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const r=t[e.shapes[s]];i.push(r)}return new Tl(i,e.curveSegments)}}function Ax(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Ot extends jt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+o,Math.PI);let h=0;const d=[],u=new P,m=new P,p=[],x=[],M=[],g=[];for(let f=0;f<=i;f++){const y=[],v=f/i;let _=0;f===0&&r===0?_=.5/t:f===i&&c===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*a)*Math.sin(r+v*o),u.y=e*Math.cos(r+v*o),u.z=e*Math.sin(s+T*a)*Math.sin(r+v*o),x.push(u.x,u.y,u.z),m.copy(u).normalize(),M.push(m.x,m.y,m.z),g.push(T+_,1-v),y.push(h++)}d.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){const v=d[f][y+1],_=d[f][y],E=d[f+1][y],T=d[f+1][y+1];(f!==0||r>0)&&p.push(v,_,T),(f!==i-1||c<Math.PI)&&p.push(_,E,T)}this.setIndex(p),this.setAttribute("position",new St(x,3)),this.setAttribute("normal",new St(M,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class As extends jt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],h=[],d=new P,u=new P,m=new P;for(let p=0;p<=i;p++)for(let x=0;x<=s;x++){const M=x/s*a,g=p/i*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(M),u.y=(e+t*Math.cos(g))*Math.sin(M),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),m.subVectors(u,d).normalize(),c.push(m.x,m.y,m.z),h.push(x/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let x=1;x<=s;x++){const M=(s+1)*p+x-1,g=(s+1)*(p-1)+x-1,f=(s+1)*(p-1)+x,y=(s+1)*p+x;r.push(M,g,y),r.push(g,f,y)}this.setIndex(r),this.setAttribute("position",new St(o,3)),this.setAttribute("normal",new St(c,3)),this.setAttribute("uv",new St(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new As(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Cx extends Sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends Ps{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jh,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Rx extends Ps{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jh,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Vh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Px extends Ps{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Lx extends Ps{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class cd extends Ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Dx extends cd{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const hc=new yt,Mu=new P,_u=new P;class af{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=Hi,this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new id,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new Kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Mu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Mu),_u.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_u),t.updateMatrixWorld(),hc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(hc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const yu=new yt,ur=new P,dc=new P;class Ix extends af{constructor(){super(new Zn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ue(4,2),this._viewportCount=6,this._viewports=[new Kt(2,1,1,1),new Kt(0,1,1,1),new Kt(3,1,1,1),new Kt(1,1,1,1),new Kt(3,0,1,1),new Kt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),ur.setFromMatrixPosition(e.matrixWorld),i.position.copy(ur),dc.copy(i.position),dc.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(dc),i.updateMatrixWorld(),s.makeTranslation(-ur.x,-ur.y,-ur.z),yu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yu,i.coordinateSystem,i.reversedDepth)}}class hd extends cd{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ix}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class dd extends H0{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Fx extends af{constructor(){super(new dd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class uc extends cd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.target=new Ut,this.shadow=new Fx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ux extends Zn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class rf{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const bu=new yt;class zx{constructor(e,t,i=0,s=1/0){this.ray=new ed(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new td,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ln("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return bu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bu),this}intersectObject(e,t=!0,i=[]){return yh(e,this,i,t),i.sort(wu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)yh(e[s],this,i,t);return i.sort(wu),i}}function wu(n,e){return n.distance-e.distance}function yh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)yh(a[r],e,t,!0)}}function Su(n,e,t,i){const s=Nx(i);switch(t){case F0:return n*e;case qh:return n*e/s.components*s.byteLength;case Yh:return n*e/s.components*s.byteLength;case $h:return n*e*2/s.components*s.byteLength;case Zh:return n*e*2/s.components*s.byteLength;case U0:return n*e*3/s.components*s.byteLength;case Mi:return n*e*4/s.components*s.byteLength;case Kh:return n*e*4/s.components*s.byteLength;case Yo:case $o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zo:case Ko:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Hc:case Xc:return Math.max(n,16)*Math.max(e,8)/4;case Gc:case Wc:return Math.max(n,8)*Math.max(e,8)/2;case qc:case Yc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $c:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Kc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case jc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Qc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case eh:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case th:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case nh:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ih:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case sh:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ah:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case rh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case oh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case lh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ch:case hh:case dh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case uh:case fh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ph:case mh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Nx(n){switch(n){case Hi:case P0:return{byteLength:1,components:1};case Lr:case L0:case Ni:return{byteLength:2,components:1};case Wh:case Xh:return{byteLength:2,components:4};case Qs:case Hh:case Ii:return{byteLength:4,components:1};case D0:case I0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bh}}));typeof window<"u"&&(window.__THREE__?vt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bh);function of(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function kx(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,u=h.byteLength,m=n.createBuffer();n.bindBuffer(c,m),n.bufferData(c,h,d),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){const d=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,d);else{u.sort((p,x)=>p.start-x.start);let m=0;for(let p=1;p<u.length;p++){const x=u[m],M=u[p];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++m,u[m]=M)}u.length=m+1;for(let p=0,x=u.length;p<x;p++){const M=u[p];n.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:a,update:r}}var Ox=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bx=`#ifdef USE_ALPHAHASH
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
#endif`,Vx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xx=`#ifdef USE_AOMAP
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
#endif`,qx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yx=`#ifdef USE_BATCHING
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
#endif`,$x=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Kx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,jx=`#ifdef USE_IRIDESCENCE
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
#endif`,Qx=`#ifdef USE_BUMPMAP
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
#endif`,eg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ng=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ag=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,rg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,og=`#if defined( USE_COLOR_ALPHA )
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
#endif`,lg=`#define PI 3.141592653589793
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
} // validated`,cg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,hg=`vec3 transformedNormal = objectNormal;
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
#endif`,dg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ug=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mg="gl_FragColor = linearToOutputTexel( gl_FragColor );",xg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,gg=`#ifdef USE_ENVMAP
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
#endif`,vg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Mg=`#ifdef USE_ENVMAP
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
#endif`,_g=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,yg=`#ifdef USE_ENVMAP
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
#endif`,bg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Sg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Tg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Eg=`#ifdef USE_GRADIENTMAP
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
}`,Ag=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pg=`uniform bool receiveShadow;
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
#endif`,Lg=`#ifdef USE_ENVMAP
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
#endif`,Dg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ig=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ug=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zg=`PhysicalMaterial material;
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
#endif`,Ng=`uniform sampler2D dfgLUT;
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
}`,kg=`
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
#endif`,Og=`#if defined( RE_IndirectDiffuse )
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
#endif`,Bg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Xg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Yg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$g=`#if defined( USE_POINTS_UV )
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
#endif`,Zg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,jg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e1=`#ifdef USE_MORPHTARGETS
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
#endif`,t1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,n1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,i1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,s1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,r1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,o1=`#ifdef USE_NORMALMAP
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
#endif`,l1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,c1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,h1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,d1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,u1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,f1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,p1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,m1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,x1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,g1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,v1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,M1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,y1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,b1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,w1=`float getShadowMask() {
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
}`,S1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,T1=`#ifdef USE_SKINNING
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
#endif`,E1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,A1=`#ifdef USE_SKINNING
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
#endif`,C1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,R1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,P1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,L1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,D1=`#ifdef USE_TRANSMISSION
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
#endif`,I1=`#ifdef USE_TRANSMISSION
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
#endif`,F1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,z1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,N1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const k1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,O1=`uniform sampler2D t2D;
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
}`,B1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,G1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W1=`#include <common>
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
}`,X1=`#if DEPTH_PACKING == 3200
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
}`,q1=`#define DISTANCE
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
}`,Y1=`#define DISTANCE
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
}`,$1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Z1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K1=`uniform float scale;
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
}`,J1=`uniform vec3 diffuse;
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
}`,j1=`#include <common>
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
}`,Q1=`uniform vec3 diffuse;
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
}`,e2=`#define LAMBERT
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
}`,t2=`#define LAMBERT
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
}`,n2=`#define MATCAP
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
}`,i2=`#define MATCAP
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
}`,s2=`#define NORMAL
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
}`,a2=`#define NORMAL
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
}`,r2=`#define PHONG
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
}`,o2=`#define PHONG
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
}`,l2=`#define STANDARD
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
}`,c2=`#define STANDARD
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
}`,h2=`#define TOON
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
}`,d2=`#define TOON
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
}`,u2=`uniform float size;
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
}`,f2=`uniform vec3 diffuse;
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
}`,p2=`#include <common>
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
}`,m2=`uniform vec3 color;
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
}`,x2=`uniform float rotation;
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
}`,g2=`uniform vec3 diffuse;
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
}`,Pt={alphahash_fragment:Ox,alphahash_pars_fragment:Bx,alphamap_fragment:Vx,alphamap_pars_fragment:Gx,alphatest_fragment:Hx,alphatest_pars_fragment:Wx,aomap_fragment:Xx,aomap_pars_fragment:qx,batching_pars_vertex:Yx,batching_vertex:$x,begin_vertex:Zx,beginnormal_vertex:Kx,bsdfs:Jx,iridescence_fragment:jx,bumpmap_pars_fragment:Qx,clipping_planes_fragment:eg,clipping_planes_pars_fragment:tg,clipping_planes_pars_vertex:ng,clipping_planes_vertex:ig,color_fragment:sg,color_pars_fragment:ag,color_pars_vertex:rg,color_vertex:og,common:lg,cube_uv_reflection_fragment:cg,defaultnormal_vertex:hg,displacementmap_pars_vertex:dg,displacementmap_vertex:ug,emissivemap_fragment:fg,emissivemap_pars_fragment:pg,colorspace_fragment:mg,colorspace_pars_fragment:xg,envmap_fragment:gg,envmap_common_pars_fragment:vg,envmap_pars_fragment:Mg,envmap_pars_vertex:_g,envmap_physical_pars_fragment:Lg,envmap_vertex:yg,fog_vertex:bg,fog_pars_vertex:wg,fog_fragment:Sg,fog_pars_fragment:Tg,gradientmap_pars_fragment:Eg,lightmap_pars_fragment:Ag,lights_lambert_fragment:Cg,lights_lambert_pars_fragment:Rg,lights_pars_begin:Pg,lights_toon_fragment:Dg,lights_toon_pars_fragment:Ig,lights_phong_fragment:Fg,lights_phong_pars_fragment:Ug,lights_physical_fragment:zg,lights_physical_pars_fragment:Ng,lights_fragment_begin:kg,lights_fragment_maps:Og,lights_fragment_end:Bg,logdepthbuf_fragment:Vg,logdepthbuf_pars_fragment:Gg,logdepthbuf_pars_vertex:Hg,logdepthbuf_vertex:Wg,map_fragment:Xg,map_pars_fragment:qg,map_particle_fragment:Yg,map_particle_pars_fragment:$g,metalnessmap_fragment:Zg,metalnessmap_pars_fragment:Kg,morphinstance_vertex:Jg,morphcolor_vertex:jg,morphnormal_vertex:Qg,morphtarget_pars_vertex:e1,morphtarget_vertex:t1,normal_fragment_begin:n1,normal_fragment_maps:i1,normal_pars_fragment:s1,normal_pars_vertex:a1,normal_vertex:r1,normalmap_pars_fragment:o1,clearcoat_normal_fragment_begin:l1,clearcoat_normal_fragment_maps:c1,clearcoat_pars_fragment:h1,iridescence_pars_fragment:d1,opaque_fragment:u1,packing:f1,premultiplied_alpha_fragment:p1,project_vertex:m1,dithering_fragment:x1,dithering_pars_fragment:g1,roughnessmap_fragment:v1,roughnessmap_pars_fragment:M1,shadowmap_pars_fragment:_1,shadowmap_pars_vertex:y1,shadowmap_vertex:b1,shadowmask_pars_fragment:w1,skinbase_vertex:S1,skinning_pars_vertex:T1,skinning_vertex:E1,skinnormal_vertex:A1,specularmap_fragment:C1,specularmap_pars_fragment:R1,tonemapping_fragment:P1,tonemapping_pars_fragment:L1,transmission_fragment:D1,transmission_pars_fragment:I1,uv_pars_fragment:F1,uv_pars_vertex:U1,uv_vertex:z1,worldpos_vertex:N1,background_vert:k1,background_frag:O1,backgroundCube_vert:B1,backgroundCube_frag:V1,cube_vert:G1,cube_frag:H1,depth_vert:W1,depth_frag:X1,distanceRGBA_vert:q1,distanceRGBA_frag:Y1,equirect_vert:$1,equirect_frag:Z1,linedashed_vert:K1,linedashed_frag:J1,meshbasic_vert:j1,meshbasic_frag:Q1,meshlambert_vert:e2,meshlambert_frag:t2,meshmatcap_vert:n2,meshmatcap_frag:i2,meshnormal_vert:s2,meshnormal_frag:a2,meshphong_vert:r2,meshphong_frag:o2,meshphysical_vert:l2,meshphysical_frag:c2,meshtoon_vert:h2,meshtoon_frag:d2,points_vert:u2,points_frag:f2,shadow_vert:p2,shadow_frag:m2,sprite_vert:x2,sprite_frag:g2},He={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ct},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ct}},envmap:{envMap:{value:null},envMapRotation:{value:new Ct},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ct},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0},uvTransform:{value:new Ct}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ct},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0}}},Ri={basic:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.fog]),vertexShader:Pt.meshbasic_vert,fragmentShader:Pt.meshbasic_frag},lambert:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:Pt.meshlambert_vert,fragmentShader:Pt.meshlambert_frag},phong:{uniforms:Vn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:Pt.meshphong_vert,fragmentShader:Pt.meshphong_frag},standard:{uniforms:Vn([He.common,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.roughnessmap,He.metalnessmap,He.fog,He.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Pt.meshphysical_vert,fragmentShader:Pt.meshphysical_frag},toon:{uniforms:Vn([He.common,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.gradientmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:Pt.meshtoon_vert,fragmentShader:Pt.meshtoon_frag},matcap:{uniforms:Vn([He.common,He.bumpmap,He.normalmap,He.displacementmap,He.fog,{matcap:{value:null}}]),vertexShader:Pt.meshmatcap_vert,fragmentShader:Pt.meshmatcap_frag},points:{uniforms:Vn([He.points,He.fog]),vertexShader:Pt.points_vert,fragmentShader:Pt.points_frag},dashed:{uniforms:Vn([He.common,He.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Pt.linedashed_vert,fragmentShader:Pt.linedashed_frag},depth:{uniforms:Vn([He.common,He.displacementmap]),vertexShader:Pt.depth_vert,fragmentShader:Pt.depth_frag},normal:{uniforms:Vn([He.common,He.bumpmap,He.normalmap,He.displacementmap,{opacity:{value:1}}]),vertexShader:Pt.meshnormal_vert,fragmentShader:Pt.meshnormal_frag},sprite:{uniforms:Vn([He.sprite,He.fog]),vertexShader:Pt.sprite_vert,fragmentShader:Pt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Pt.background_vert,fragmentShader:Pt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ct}},vertexShader:Pt.backgroundCube_vert,fragmentShader:Pt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Pt.cube_vert,fragmentShader:Pt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Pt.equirect_vert,fragmentShader:Pt.equirect_frag},distanceRGBA:{uniforms:Vn([He.common,He.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Pt.distanceRGBA_vert,fragmentShader:Pt.distanceRGBA_frag},shadow:{uniforms:Vn([He.lights,He.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:Pt.shadow_vert,fragmentShader:Pt.shadow_frag}};Ri.physical={uniforms:Vn([Ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ct},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ct},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ct},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ct},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ct},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ct}}]),vertexShader:Pt.meshphysical_vert,fragmentShader:Pt.meshphysical_frag};const Io={r:0,b:0,g:0},zs=new bi,v2=new yt;function M2(n,e,t,i,s,a,r){const o=new rt(0);let c=a===!0?0:1,h,d,u=null,m=0,p=null;function x(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function M(v){let _=!1;const E=x(v);E===null?f(o,c):E&&E.isColor&&(f(E,1),_=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,_){const E=x(_);E&&(E.isCubeTexture||E.mapping===yl)?(d===void 0&&(d=new z(new le(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:Ha(Ri.backgroundCube.uniforms),vertexShader:Ri.backgroundCube.vertexShader,fragmentShader:Ri.backgroundCube.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),zs.copy(_.backgroundRotation),zs.x*=-1,zs.y*=-1,zs.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(zs.y*=-1,zs.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(v2.makeRotationFromEuler(zs)),d.material.toneMapped=kt.getTransfer(E.colorSpace)!==$t,(u!==E||m!==E.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,m=E.version,p=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new z(new zt(2,2),new Sn({name:"BackgroundMaterial",uniforms:Ha(Ri.background.uniforms),vertexShader:Ri.background.vertexShader,fragmentShader:Ri.background.fragmentShader,side:Es,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=kt.getTransfer(E.colorSpace)!==$t,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||m!==E.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=E,m=E.version,p=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function f(v,_){v.getRGB(Io,G0(n)),i.buffers.color.setClear(Io.r,Io.g,Io.b,_,r)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,_=1){o.set(v),c=_,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,f(o,c)},render:M,addToRenderList:g,dispose:y}}function _2(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=m(null);let a=s,r=!1;function o(b,L,D,V,j){let te=!1;const q=u(V,D,L);a!==q&&(a=q,h(a.object)),te=p(b,V,D,j),te&&x(b,V,D,j),j!==null&&e.update(j,n.ELEMENT_ARRAY_BUFFER),(te||r)&&(r=!1,_(b,L,D,V),j!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,L,D){const V=D.wireframe===!0;let j=i[b.id];j===void 0&&(j={},i[b.id]=j);let te=j[L.id];te===void 0&&(te={},j[L.id]=te);let q=te[V];return q===void 0&&(q=m(c()),te[V]=q),q}function m(b){const L=[],D=[],V=[];for(let j=0;j<t;j++)L[j]=0,D[j]=0,V[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:D,attributeDivisors:V,object:b,attributes:{},index:null}}function p(b,L,D,V){const j=a.attributes,te=L.attributes;let q=0;const K=D.getAttributes();for(const ne in K)if(K[ne].location>=0){const ve=j[ne];let $e=te[ne];if($e===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&($e=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&($e=b.instanceColor)),ve===void 0||ve.attribute!==$e||$e&&ve.data!==$e.data)return!0;q++}return a.attributesNum!==q||a.index!==V}function x(b,L,D,V){const j={},te=L.attributes;let q=0;const K=D.getAttributes();for(const ne in K)if(K[ne].location>=0){let ve=te[ne];ve===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor));const $e={};$e.attribute=ve,ve&&ve.data&&($e.data=ve.data),j[ne]=$e,q++}a.attributes=j,a.attributesNum=q,a.index=V}function M(){const b=a.newAttributes;for(let L=0,D=b.length;L<D;L++)b[L]=0}function g(b){f(b,0)}function f(b,L){const D=a.newAttributes,V=a.enabledAttributes,j=a.attributeDivisors;D[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),j[b]!==L&&(n.vertexAttribDivisor(b,L),j[b]=L)}function y(){const b=a.newAttributes,L=a.enabledAttributes;for(let D=0,V=L.length;D<V;D++)L[D]!==b[D]&&(n.disableVertexAttribArray(D),L[D]=0)}function v(b,L,D,V,j,te,q){q===!0?n.vertexAttribIPointer(b,L,D,j,te):n.vertexAttribPointer(b,L,D,V,j,te)}function _(b,L,D,V){M();const j=V.attributes,te=D.getAttributes(),q=L.defaultAttributeValues;for(const K in te){const ne=te[K];if(ne.location>=0){let pe=j[K];if(pe===void 0&&(K==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),K==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor)),pe!==void 0){const ve=pe.normalized,$e=pe.itemSize,I=e.get(pe);if(I===void 0)continue;const Ce=I.buffer,be=I.type,Re=I.bytesPerElement,$=be===n.INT||be===n.UNSIGNED_INT||pe.gpuType===Hh;if(pe.isInterleavedBufferAttribute){const Z=pe.data,we=Z.stride,Pe=pe.offset;if(Z.isInstancedInterleavedBuffer){for(let Oe=0;Oe<ne.locationSize;Oe++)f(ne.location+Oe,Z.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let Oe=0;Oe<ne.locationSize;Oe++)g(ne.location+Oe);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let Oe=0;Oe<ne.locationSize;Oe++)v(ne.location+Oe,$e/ne.locationSize,be,ve,we*Re,(Pe+$e/ne.locationSize*Oe)*Re,$)}else{if(pe.isInstancedBufferAttribute){for(let Z=0;Z<ne.locationSize;Z++)f(ne.location+Z,pe.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Z=0;Z<ne.locationSize;Z++)g(ne.location+Z);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let Z=0;Z<ne.locationSize;Z++)v(ne.location+Z,$e/ne.locationSize,be,ve,$e*Re,$e/ne.locationSize*Z*Re,$)}}else if(q!==void 0){const ve=q[K];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ne.location,ve);break;case 3:n.vertexAttrib3fv(ne.location,ve);break;case 4:n.vertexAttrib4fv(ne.location,ve);break;default:n.vertexAttrib1fv(ne.location,ve)}}}}y()}function E(){C();for(const b in i){const L=i[b];for(const D in L){const V=L[D];for(const j in V)d(V[j].object),delete V[j];delete L[D]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const D in L){const V=L[D];for(const j in V)d(V[j].object),delete V[j];delete L[D]}delete i[b.id]}function A(b){for(const L in i){const D=i[L];if(D[b.id]===void 0)continue;const V=D[b.id];for(const j in V)d(V[j].object),delete V[j];delete D[b.id]}}function C(){w(),r=!0,a!==s&&(a=s,h(a.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:M,enableAttribute:g,disableUnusedAttributes:y}}function y2(n,e,t){let i;function s(h){i=h}function a(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function r(h,d,u){u!==0&&(n.drawArraysInstanced(i,h,d,u),t.update(d,i,u))}function o(h,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,u);let p=0;for(let x=0;x<u;x++)p+=d[x];t.update(p,i,1)}function c(h,d,u,m){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<h.length;x++)r(h[x],d[x],m[x]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,d,0,m,0,u);let x=0;for(let M=0;M<u;M++)x+=d[M]*m[M];t.update(x,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function b2(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==Mi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===Ni&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Hi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ii&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(vt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:m,maxTextures:p,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function w2(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Os,o=new Ct,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,m){const p=u.length!==0||m||i!==0||s;return s=m,i=u.length,p},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,m){t=d(u,m,0)},this.setState=function(u,m,p){const x=u.clippingPlanes,M=u.clipIntersection,g=u.clipShadows,f=n.get(u);if(!s||x===null||x.length===0||a&&!g)a?d(null):h();else{const y=a?0:i,v=y*4;let _=f.clippingState||null;c.value=_,_=d(x,m,v,p);for(let E=0;E!==v;++E)_[E]=t[E];f.clippingState=_,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,m,p,x){const M=u!==null?u.length:0;let g=null;if(M!==0){if(g=c.value,x!==!0||g===null){const f=p+M*4,y=m.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,_=p;v!==M;++v,_+=4)r.copy(u[v]).applyMatrix4(y,o),r.normal.toArray(g,_),g[_+3]=r.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function S2(n){let e=new WeakMap;function t(r,o){return o===Oc?r.mapping=Ba:o===Bc&&(r.mapping=Va),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Oc||o===Bc)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const h=new Gm(c.height);return h.fromEquirectangularTexture(n,r),e.set(r,h),r.addEventListener("dispose",s),t(h.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const _s=4,Tu=[.125,.215,.35,.446,.526,.582],Hs=20,T2=512,fr=new dd,Eu=new rt;let fc=null,pc=0,mc=0,xc=!1;const E2=new P;class bh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=E2}=a;fc=this._renderer.getRenderTarget(),pc=this._renderer.getActiveCubeFace(),mc=this._renderer.getActiveMipmapLevel(),xc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ru(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(fc,pc,mc),this._renderer.xr.enabled=xc,e.scissorTest=!1,Sa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ba||e.mapping===Va?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fc=this._renderer.getRenderTarget(),pc=this._renderer.getActiveCubeFace(),mc=this._renderer.getActiveMipmapLevel(),xc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ri,minFilter:ri,generateMipmaps:!1,type:Ni,format:Mi,colorSpace:Ga,depthBuffer:!1},s=Au(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Au(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=A2(a)),this._blurMaterial=R2(a,e,t)}return s}_compileMaterial(e){const t=new z(new jt,e);this._renderer.compile(t,fr)}_sceneToCubeUV(e,t,i,s,a){const c=new Zn(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,m=u.autoClear,p=u.toneMapping;u.getClearColor(Eu),u.toneMapping=ws,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new z(new le,new Rt({name:"PMREM.Background",side:In,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let f=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,f=!0):(g.color.copy(Eu),f=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+d[v],a.y,a.z)):_===1?(c.up.set(0,0,h[v]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+d[v],a.z)):(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+d[v]));const E=this._cubeSize;Sa(s,_*E,v>2?E:0,E,E),u.setRenderTarget(s),f&&u.render(M,c),u.render(e,c)}u.toneMapping=p,u.autoClear=m,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Ba||e.mapping===Va;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ru()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cu());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;Sa(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,fr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=C2(this._lodMax,y,v)}const r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const c=r.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-d*d),m=.05+h*.95,p=u*m,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-_s?i-x+_s:0),f=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=x-t,Sa(a,g,f,3*M,2*M),s.setRenderTarget(a),s.render(o,fr),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-i,Sa(e,g,f,3*M,2*M),s.setRenderTarget(e),s.render(o,fr)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const c=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&ln("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=h;const m=h.uniforms,p=this._sizeLods[i]-1,x=isFinite(a)?Math.PI/(2*p):2*Math.PI/(2*Hs-1),M=a/x,g=isFinite(a)?1+Math.floor(d*M):Hs;g>Hs&&vt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Hs}`);const f=[];let y=0;for(let A=0;A<Hs;++A){const C=A/M,w=Math.exp(-C*C/2);f.push(w),A===0?y+=w:A<g&&(y+=2*w)}for(let A=0;A<f.length;A++)f[A]=f[A]/y;m.envMap.value=e.texture,m.samples.value=g,m.weights.value=f,m.latitudinal.value=r==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:v}=this;m.dTheta.value=x,m.mipInt.value=v-i;const _=this._sizeLods[s],E=3*_*(s>v-_s?s-v+_s:0),T=4*(this._cubeSize-_);Sa(t,E,T,3*_,2*_),c.setRenderTarget(t),c.render(u,fr)}}function A2(n){const e=[],t=[],i=[];let s=n;const a=n-_s+1+Tu.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-_s?c=Tu[r-n+_s-1]:r===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,u=1+h,m=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,x=6,M=3,g=2,f=1,y=new Float32Array(M*x*p),v=new Float32Array(g*x*p),_=new Float32Array(f*x*p);for(let T=0;T<p;T++){const A=T%3*2/3-1,C=T>2?0:-1,w=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];y.set(w,M*x*T),v.set(m,g*x*T);const b=[T,T,T,T,T,T];_.set(b,f*x*T)}const E=new jt;E.setAttribute("position",new jn(y,M)),E.setAttribute("uv",new jn(v,g)),E.setAttribute("faceIndex",new jn(_,f)),i.push(new z(E,null)),s>_s&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Au(n,e,t){const i=new yi(n,e,t);return i.texture.mapping=yl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Sa(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function C2(n,e,t){return new Sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:T2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:El(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function R2(n,e,t){const i=new Float32Array(Hs),s=new P(0,1,0);return new Sn({name:"SphericalGaussianBlur",defines:{n:Hs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:El(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Cu(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:El(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Ru(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:El(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function El(){return`

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
	`}function P2(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===Oc||c===Bc,d=c===Ba||c===Va;if(h||d){let u=e.get(o);const m=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new bh(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return h&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new bh(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function a(o){const c=o.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function L2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ur("WebGLRenderer: "+i+" extension not supported."),s}}}function D2(n,e,t,i){const s={},a=new WeakMap;function r(u){const m=u.target;m.index!==null&&e.remove(m.index);for(const x in m.attributes)e.remove(m.attributes[x]);m.removeEventListener("dispose",r),delete s[m.id];const p=a.get(m);p&&(e.remove(p),a.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(u,m){return s[m.id]===!0||(m.addEventListener("dispose",r),s[m.id]=!0,t.memory.geometries++),m}function c(u){const m=u.attributes;for(const p in m)e.update(m[p],n.ARRAY_BUFFER)}function h(u){const m=[],p=u.index,x=u.attributes.position;let M=0;if(p!==null){const y=p.array;M=p.version;for(let v=0,_=y.length;v<_;v+=3){const E=y[v+0],T=y[v+1],A=y[v+2];m.push(E,T,T,A,A,E)}}else if(x!==void 0){const y=x.array;M=x.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const E=v+0,T=v+1,A=v+2;m.push(E,T,T,A,A,E)}}else return;const g=new(N0(m)?V0:B0)(m,1);g.version=M;const f=a.get(u);f&&e.remove(f),a.set(u,g)}function d(u){const m=a.get(u);if(m){const p=u.index;p!==null&&m.version<p.version&&h(u)}else h(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function I2(n,e,t){let i;function s(m){i=m}let a,r;function o(m){a=m.type,r=m.bytesPerElement}function c(m,p){n.drawElements(i,p,a,m*r),t.update(p,i,1)}function h(m,p,x){x!==0&&(n.drawElementsInstanced(i,p,a,m*r,x),t.update(p,i,x))}function d(m,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,a,m,0,x);let g=0;for(let f=0;f<x;f++)g+=p[f];t.update(g,i,1)}function u(m,p,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<m.length;f++)h(m[f]/r,p[f],M[f]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,a,m,0,M,0,x);let f=0;for(let y=0;y<x;y++)f+=p[y]*M[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function F2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:ln("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function U2(n,e,t){const i=new WeakMap,s=new Kt;function a(r,o,c){const h=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let m=i.get(o);if(m===void 0||m.count!==u){let b=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var p=b;m!==void 0&&m.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let _=0;x===!0&&(_=1),M===!0&&(_=2),g===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*u),C=new k0(A,E,T,u);C.type=Ii,C.needsUpdate=!0;const w=_*4;for(let L=0;L<u;L++){const D=f[L],V=y[L],j=v[L],te=E*T*4*L;for(let q=0;q<D.count;q++){const K=q*w;x===!0&&(s.fromBufferAttribute(D,q),A[te+K+0]=s.x,A[te+K+1]=s.y,A[te+K+2]=s.z,A[te+K+3]=0),M===!0&&(s.fromBufferAttribute(V,q),A[te+K+4]=s.x,A[te+K+5]=s.y,A[te+K+6]=s.z,A[te+K+7]=0),g===!0&&(s.fromBufferAttribute(j,q),A[te+K+8]=s.x,A[te+K+9]=s.y,A[te+K+10]=s.z,A[te+K+11]=j.itemSize===4?s.w:1)}}m={count:u,texture:C,size:new Ue(E,T)},i.set(o,m),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const M=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:a}}function z2(n,e,t,i){let s=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return u}function r(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:r}}const lf=new Fn,Pu=new $0(1,1),cf=new k0,hf=new Em,df=new W0,Lu=[],Du=[],Iu=new Float32Array(16),Fu=new Float32Array(9),Uu=new Float32Array(4);function Za(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Lu[s];if(a===void 0&&(a=new Float32Array(s),Lu[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function yn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function bn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Al(n,e){let t=Du[e];t===void 0&&(t=new Int32Array(e),Du[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function N2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function k2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2fv(this.addr,e),bn(t,e)}}function O2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;n.uniform3fv(this.addr,e),bn(t,e)}}function B2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4fv(this.addr,e),bn(t,e)}}function V2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Uu.set(i),n.uniformMatrix2fv(this.addr,!1,Uu),bn(t,i)}}function G2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Fu.set(i),n.uniformMatrix3fv(this.addr,!1,Fu),bn(t,i)}}function H2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Iu.set(i),n.uniformMatrix4fv(this.addr,!1,Iu),bn(t,i)}}function W2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function X2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2iv(this.addr,e),bn(t,e)}}function q2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3iv(this.addr,e),bn(t,e)}}function Y2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4iv(this.addr,e),bn(t,e)}}function $2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Z2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2uiv(this.addr,e),bn(t,e)}}function K2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3uiv(this.addr,e),bn(t,e)}}function J2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4uiv(this.addr,e),bn(t,e)}}function j2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Pu.compareFunction=z0,a=Pu):a=lf,t.setTexture2D(e||a,s)}function Q2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||hf,s)}function ev(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||df,s)}function tv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||cf,s)}function nv(n){switch(n){case 5126:return N2;case 35664:return k2;case 35665:return O2;case 35666:return B2;case 35674:return V2;case 35675:return G2;case 35676:return H2;case 5124:case 35670:return W2;case 35667:case 35671:return X2;case 35668:case 35672:return q2;case 35669:case 35673:return Y2;case 5125:return $2;case 36294:return Z2;case 36295:return K2;case 36296:return J2;case 35678:case 36198:case 36298:case 36306:case 35682:return j2;case 35679:case 36299:case 36307:return Q2;case 35680:case 36300:case 36308:case 36293:return ev;case 36289:case 36303:case 36311:case 36292:return tv}}function iv(n,e){n.uniform1fv(this.addr,e)}function sv(n,e){const t=Za(e,this.size,2);n.uniform2fv(this.addr,t)}function av(n,e){const t=Za(e,this.size,3);n.uniform3fv(this.addr,t)}function rv(n,e){const t=Za(e,this.size,4);n.uniform4fv(this.addr,t)}function ov(n,e){const t=Za(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function lv(n,e){const t=Za(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function cv(n,e){const t=Za(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function hv(n,e){n.uniform1iv(this.addr,e)}function dv(n,e){n.uniform2iv(this.addr,e)}function uv(n,e){n.uniform3iv(this.addr,e)}function fv(n,e){n.uniform4iv(this.addr,e)}function pv(n,e){n.uniform1uiv(this.addr,e)}function mv(n,e){n.uniform2uiv(this.addr,e)}function xv(n,e){n.uniform3uiv(this.addr,e)}function gv(n,e){n.uniform4uiv(this.addr,e)}function vv(n,e,t){const i=this.cache,s=e.length,a=Al(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||lf,a[r])}function Mv(n,e,t){const i=this.cache,s=e.length,a=Al(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||hf,a[r])}function _v(n,e,t){const i=this.cache,s=e.length,a=Al(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||df,a[r])}function yv(n,e,t){const i=this.cache,s=e.length,a=Al(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||cf,a[r])}function bv(n){switch(n){case 5126:return iv;case 35664:return sv;case 35665:return av;case 35666:return rv;case 35674:return ov;case 35675:return lv;case 35676:return cv;case 5124:case 35670:return hv;case 35667:case 35671:return dv;case 35668:case 35672:return uv;case 35669:case 35673:return fv;case 5125:return pv;case 36294:return mv;case 36295:return xv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return vv;case 35679:case 36299:case 36307:return Mv;case 35680:case 36300:case 36308:case 36293:return _v;case 36289:case 36303:case 36311:case 36292:return yv}}class wv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=nv(t.type)}}class Sv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bv(t.type)}}class Tv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const gc=/(\w+)(\])?(\[|\.)?/g;function zu(n,e){n.seq.push(e),n.map[e.id]=e}function Ev(n,e,t){const i=n.name,s=i.length;for(gc.lastIndex=0;;){const a=gc.exec(i),r=gc.lastIndex;let o=a[1];const c=a[2]==="]",h=a[3];if(c&&(o=o|0),h===void 0||h==="["&&r+2===s){zu(t,h===void 0?new wv(o,n,e):new Sv(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Tv(o),zu(t,u)),t=u}}}class Jo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);Ev(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Nu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Av=37297;let Cv=0;function Rv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const ku=new Ct;function Pv(n){kt._getMatrix(ku,kt.workingColorSpace,n);const e=`mat3( ${ku.elements.map(t=>t.toFixed(4))} )`;switch(kt.getTransfer(n)){case nl:return[e,"LinearTransferOETF"];case $t:return[e,"sRGBTransferOETF"];default:return vt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ou(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Rv(n.getShaderSource(e),o)}else return a}function Lv(n,e){const t=Pv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Dv(n,e){let t;switch(e){case w0:t="Linear";break;case S0:t="Reinhard";break;case T0:t="Cineon";break;case Gh:t="ACESFilmic";break;case A0:t="AgX";break;case C0:t="Neutral";break;case E0:t="Custom";break;default:vt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Fo=new P;function Iv(){kt.getLuminanceCoefficients(Fo);const n=Fo.x.toFixed(4),e=Fo.y.toFixed(4),t=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Fv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(gr).join(`
`)}function Uv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function zv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function gr(n){return n!==""}function Bu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Vu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Nv=/^[ \t]*#include +<([\w\d./]+)>/gm;function wh(n){return n.replace(Nv,Ov)}const kv=new Map;function Ov(n,e){let t=Pt[e];if(t===void 0){const i=kv.get(e);if(i!==void 0)t=Pt[i],vt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return wh(t)}const Bv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gu(n){return n.replace(Bv,Vv)}function Vv(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Hu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function Gv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===y0?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===b0?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Qi&&(e="SHADOWMAP_TYPE_VSM"),e}function Hv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ba:case Va:e="ENVMAP_TYPE_CUBE";break;case yl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Wv(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Va&&(e="ENVMAP_MODE_REFRACTION"),e}function Xv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Vh:e="ENVMAP_BLENDING_MULTIPLY";break;case Wp:e="ENVMAP_BLENDING_MIX";break;case Xp:e="ENVMAP_BLENDING_ADD";break}return e}function qv(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Yv(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=Gv(t),h=Hv(t),d=Wv(t),u=Xv(t),m=qv(t),p=Fv(t),x=Uv(a),M=s.createProgram();let g,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(gr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(gr).join(`
`),f.length>0&&(f+=`
`)):(g=[Hu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(gr).join(`
`),f=[Hu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ws?"#define TONE_MAPPING":"",t.toneMapping!==ws?Pt.tonemapping_pars_fragment:"",t.toneMapping!==ws?Dv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Pt.colorspace_pars_fragment,Lv("linearToOutputTexel",t.outputColorSpace),Iv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(gr).join(`
`)),r=wh(r),r=Bu(r,t),r=Vu(r,t),o=wh(o),o=Bu(o,t),o=Vu(o,t),r=Gu(r),o=Gu(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Bd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Bd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=y+g+r,_=y+f+o,E=Nu(s,s.VERTEX_SHADER,v),T=Nu(s,s.FRAGMENT_SHADER,_);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function A(L){if(n.debug.checkShaderErrors){const D=s.getProgramInfoLog(M)||"",V=s.getShaderInfoLog(E)||"",j=s.getShaderInfoLog(T)||"",te=D.trim(),q=V.trim(),K=j.trim();let ne=!0,pe=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const ve=Ou(s,E,"vertex"),$e=Ou(s,T,"fragment");ln("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+ve+`
`+$e)}else te!==""?vt("WebGLProgram: Program Info Log:",te):(q===""||K==="")&&(pe=!1);pe&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:K,prefix:f}})}s.deleteShader(E),s.deleteShader(T),C=new Jo(s,M),w=zv(s,M)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(M,Av)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Cv++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let $v=0;class Zv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Kv(e),t.set(e,i)),i}}class Kv{constructor(e){this.id=$v++,this.code=e,this.usedTimes=0}}function Jv(n,e,t,i,s,a,r){const o=new td,c=new Zv,h=new Set,d=[],u=s.logarithmicDepthBuffer,m=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(w){return h.add(w),w===0?"uv":`uv${w}`}function g(w,b,L,D,V){const j=D.fog,te=V.geometry,q=w.isMeshStandardMaterial?D.environment:null,K=(w.isMeshStandardMaterial?t:e).get(w.envMap||q),ne=K&&K.mapping===yl?K.image.height:null,pe=x[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&vt("WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const ve=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,$e=ve!==void 0?ve.length:0;let I=0;te.morphAttributes.position!==void 0&&(I=1),te.morphAttributes.normal!==void 0&&(I=2),te.morphAttributes.color!==void 0&&(I=3);let Ce,be,Re,$;if(pe){const Nt=Ri[pe];Ce=Nt.vertexShader,be=Nt.fragmentShader}else Ce=w.vertexShader,be=w.fragmentShader,c.update(w),Re=c.getVertexShaderID(w),$=c.getFragmentShaderID(w);const Z=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Pe=V.isInstancedMesh===!0,Oe=V.isBatchedMesh===!0,nt=!!w.map,Ht=!!w.matcap,at=!!K,Bt=!!w.aoMap,O=!!w.lightMap,Tt=!!w.bumpMap,_t=!!w.normalMap,Vt=!!w.displacementMap,Qe=!!w.emissiveMap,qt=!!w.metalnessMap,ot=!!w.roughnessMap,Mt=w.anisotropy>0,F=w.clearcoat>0,R=w.dispersion>0,J=w.iridescence>0,ue=w.sheen>0,ge=w.transmission>0,re=Mt&&!!w.anisotropyMap,et=F&&!!w.clearcoatMap,Fe=F&&!!w.clearcoatNormalMap,it=F&&!!w.clearcoatRoughnessMap,Ye=J&&!!w.iridescenceMap,_e=J&&!!w.iridescenceThicknessMap,Le=ue&&!!w.sheenColorMap,ht=ue&&!!w.sheenRoughnessMap,ct=!!w.specularMap,We=!!w.specularColorMap,dt=!!w.specularIntensityMap,H=ge&&!!w.transmissionMap,Ge=ge&&!!w.thicknessMap,ke=!!w.gradientMap,ze=!!w.alphaMap,Te=w.alphaTest>0,me=!!w.alphaHash,Je=!!w.extensions;let ft=ws;w.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ft=n.toneMapping);const Wt={shaderID:pe,shaderType:w.type,shaderName:w.name,vertexShader:Ce,fragmentShader:be,defines:w.defines,customVertexShaderID:Re,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Oe,batchingColor:Oe&&V._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&V.instanceColor!==null,instancingMorph:Pe&&V.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Ga,alphaToCoverage:!!w.alphaToCoverage,map:nt,matcap:Ht,envMap:at,envMapMode:at&&K.mapping,envMapCubeUVHeight:ne,aoMap:Bt,lightMap:O,bumpMap:Tt,normalMap:_t,displacementMap:m&&Vt,emissiveMap:Qe,normalMapObjectSpace:_t&&w.normalMapType===Zp,normalMapTangentSpace:_t&&w.normalMapType===Jh,metalnessMap:qt,roughnessMap:ot,anisotropy:Mt,anisotropyMap:re,clearcoat:F,clearcoatMap:et,clearcoatNormalMap:Fe,clearcoatRoughnessMap:it,dispersion:R,iridescence:J,iridescenceMap:Ye,iridescenceThicknessMap:_e,sheen:ue,sheenColorMap:Le,sheenRoughnessMap:ht,specularMap:ct,specularColorMap:We,specularIntensityMap:dt,transmission:ge,transmissionMap:H,thicknessMap:Ge,gradientMap:ke,opaque:w.transparent===!1&&w.blending===Ia&&w.alphaToCoverage===!1,alphaMap:ze,alphaTest:Te,alphaHash:me,combine:w.combine,mapUv:nt&&M(w.map.channel),aoMapUv:Bt&&M(w.aoMap.channel),lightMapUv:O&&M(w.lightMap.channel),bumpMapUv:Tt&&M(w.bumpMap.channel),normalMapUv:_t&&M(w.normalMap.channel),displacementMapUv:Vt&&M(w.displacementMap.channel),emissiveMapUv:Qe&&M(w.emissiveMap.channel),metalnessMapUv:qt&&M(w.metalnessMap.channel),roughnessMapUv:ot&&M(w.roughnessMap.channel),anisotropyMapUv:re&&M(w.anisotropyMap.channel),clearcoatMapUv:et&&M(w.clearcoatMap.channel),clearcoatNormalMapUv:Fe&&M(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&M(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ye&&M(w.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&M(w.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&M(w.sheenColorMap.channel),sheenRoughnessMapUv:ht&&M(w.sheenRoughnessMap.channel),specularMapUv:ct&&M(w.specularMap.channel),specularColorMapUv:We&&M(w.specularColorMap.channel),specularIntensityMapUv:dt&&M(w.specularIntensityMap.channel),transmissionMapUv:H&&M(w.transmissionMap.channel),thicknessMapUv:Ge&&M(w.thicknessMap.channel),alphaMapUv:ze&&M(w.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(_t||Mt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!te.attributes.uv&&(nt||ze),fog:!!j,useFog:w.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:V.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:$e,morphTextureStride:I,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:ft,decodeVideoTexture:nt&&w.map.isVideoTexture===!0&&kt.getTransfer(w.map.colorSpace)===$t,decodeVideoTextureEmissive:Qe&&w.emissiveMap.isVideoTexture===!0&&kt.getTransfer(w.emissiveMap.colorSpace)===$t,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===wt,flipSided:w.side===In,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Je&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&w.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Wt.vertexUv1s=h.has(1),Wt.vertexUv2s=h.has(2),Wt.vertexUv3s=h.has(3),h.clear(),Wt}function f(w){const b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(const L in w.defines)b.push(L),b.push(w.defines[L]);return w.isRawShaderMaterial===!1&&(y(b,w),v(b,w),b.push(n.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function y(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function v(w,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),w.push(o.mask)}function _(w){const b=x[w.type];let L;if(b){const D=Ri[b];L=Nr.clone(D.uniforms)}else L=w.uniforms;return L}function E(w,b){let L;for(let D=0,V=d.length;D<V;D++){const j=d[D];if(j.cacheKey===b){L=j,++L.usedTimes;break}}return L===void 0&&(L=new Yv(n,b,w,a),d.push(L)),L}function T(w){if(--w.usedTimes===0){const b=d.indexOf(w);d[b]=d[d.length-1],d.pop(),w.destroy()}}function A(w){c.remove(w)}function C(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:C}}function jv(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function Qv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Wu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Xu(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,m,p,x,M,g){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:m,material:p,groupOrder:x,renderOrder:u.renderOrder,z:M,group:g},n[e]=f):(f.id=u.id,f.object=u,f.geometry=m,f.material=p,f.groupOrder=x,f.renderOrder=u.renderOrder,f.z=M,f.group=g),e++,f}function o(u,m,p,x,M,g){const f=r(u,m,p,x,M,g);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function c(u,m,p,x,M,g){const f=r(u,m,p,x,M,g);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,m){t.length>1&&t.sort(u||Qv),i.length>1&&i.sort(m||Wu),s.length>1&&s.sort(m||Wu)}function d(){for(let u=e,m=n.length;u<m;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:h}}function eM(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new Xu,n.set(i,[r])):s>=a.length?(r=new Xu,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function tM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new rt};break;case"SpotLight":t={position:new P,direction:new P,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function nM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let iM=0;function sM(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function aM(n){const e=new tM,t=nM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new P);const s=new P,a=new yt,r=new yt;function o(h){let d=0,u=0,m=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,x=0,M=0,g=0,f=0,y=0,v=0,_=0,E=0,T=0,A=0;h.sort(sM);for(let w=0,b=h.length;w<b;w++){const L=h[w],D=L.color,V=L.intensity,j=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=D.r*V,u+=D.g*V,m+=D.b*V;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],V);A++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const K=L.shadow,ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,i.directionalShadow[p]=ne,i.directionalShadowMap[p]=te,i.directionalShadowMatrix[p]=L.shadow.matrix,y++}i.directional[p]=q,p++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(D).multiplyScalar(V),q.distance=j,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const K=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,K.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[M]=K.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,_++}M++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(D).multiplyScalar(V),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=q,g++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const K=L.shadow,ne=t.get(L);ne.shadowIntensity=K.intensity,ne.shadowBias=K.bias,ne.shadowNormalBias=K.normalBias,ne.shadowRadius=K.radius,ne.shadowMapSize=K.mapSize,ne.shadowCameraNear=K.camera.near,ne.shadowCameraFar=K.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=L.shadow.matrix,v++}i.point[x]=q,x++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(V),q.groundColor.copy(L.groundColor).multiplyScalar(V),i.hemi[f]=q,f++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=He.LTC_FLOAT_1,i.rectAreaLTC2=He.LTC_FLOAT_2):(i.rectAreaLTC1=He.LTC_HALF_1,i.rectAreaLTC2=He.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=m;const C=i.hash;(C.directionalLength!==p||C.pointLength!==x||C.spotLength!==M||C.rectAreaLength!==g||C.hemiLength!==f||C.numDirectionalShadows!==y||C.numPointShadows!==v||C.numSpotShadows!==_||C.numSpotMaps!==E||C.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,C.directionalLength=p,C.pointLength=x,C.spotLength=M,C.rectAreaLength=g,C.hemiLength=f,C.numDirectionalShadows=y,C.numPointShadows=v,C.numSpotShadows=_,C.numSpotMaps=E,C.numLightProbes=A,i.version=iM++)}function c(h,d){let u=0,m=0,p=0,x=0,M=0;const g=d.matrixWorldInverse;for(let f=0,y=h.length;f<y;f++){const v=h[f];if(v.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(v.isSpotLight){const _=i.spot[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),p++}else if(v.isRectAreaLight){const _=i.rectArea[x];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){const _=i.point[m];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(g),m++}else if(v.isHemisphereLight){const _=i.hemi[M];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(g),M++}}}return{setup:o,setupView:c,state:i}}function qu(n){const e=new aM(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function rM(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new qu(n),e.set(s,[o])):a>=r.length?(o=new qu(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const oM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lM=`uniform sampler2D shadow_pass;
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
}`;function cM(n,e,t){let i=new id;const s=new Ue,a=new Ue,r=new Kt,o=new Px({depthPacking:$p}),c=new Lx,h={},d=t.maxTextureSize,u={[Es]:In,[In]:Es,[wt]:wt},m=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:oM,fragmentShader:lM}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const x=new jt;x.setAttribute("position",new jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new z(x,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=y0;let f=this.type;this.render=function(T,A,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const w=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),D=n.state;D.setBlending(zi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const V=f!==Qi&&this.type===Qi,j=f===Qi&&this.type!==Qi;for(let te=0,q=T.length;te<q;te++){const K=T[te],ne=K.shadow;if(ne===void 0){vt("WebGLShadowMap:",K,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const pe=ne.getFrameExtents();if(s.multiply(pe),a.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/pe.x),s.x=a.x*pe.x,ne.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/pe.y),s.y=a.y*pe.y,ne.mapSize.y=a.y)),ne.map===null||V===!0||j===!0){const $e=this.type!==Qi?{minFilter:Jn,magFilter:Jn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new yi(s.x,s.y,$e),ne.map.texture.name=K.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const ve=ne.getViewportCount();for(let $e=0;$e<ve;$e++){const I=ne.getViewport($e);r.set(a.x*I.x,a.y*I.y,a.x*I.z,a.y*I.w),D.viewport(r),ne.updateMatrices(K,$e),i=ne.getFrustum(),_(A,C,ne.camera,K,this.type)}ne.isPointLightShadow!==!0&&this.type===Qi&&y(ne,C),ne.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(w,b,L)};function y(T,A){const C=e.update(M);m.defines.VSM_SAMPLES!==T.blurSamples&&(m.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new yi(s.x,s.y)),m.uniforms.shadow_pass.value=T.map.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,C,m,M,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,C,p,M,null)}function v(T,A,C,w){let b=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)b=L;else if(b=C.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const D=b.uuid,V=A.uuid;let j=h[D];j===void 0&&(j={},h[D]=j);let te=j[V];te===void 0&&(te=b.clone(),j[V]=te,A.addEventListener("dispose",E)),b=te}if(b.visible=A.visible,b.wireframe=A.wireframe,w===Qi?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const D=n.properties.get(b);D.light=C}return b}function _(T,A,C,w,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Qi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const V=e.update(T),j=T.material;if(Array.isArray(j)){const te=V.groups;for(let q=0,K=te.length;q<K;q++){const ne=te[q],pe=j[ne.materialIndex];if(pe&&pe.visible){const ve=v(T,pe,w,b);T.onBeforeShadow(n,T,A,C,V,ve,ne),n.renderBufferDirect(C,null,V,ve,T,ne),T.onAfterShadow(n,T,A,C,V,ve,ne)}}}else if(j.visible){const te=v(T,j,w,b);T.onBeforeShadow(n,T,A,C,V,te,null),n.renderBufferDirect(C,null,V,te,T,null),T.onAfterShadow(n,T,A,C,V,te,null)}}const D=T.children;for(let V=0,j=D.length;V<j;V++)_(D[V],A,C,w,b)}function E(T){T.target.removeEventListener("dispose",E);for(const C in h){const w=h[C],b=T.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}const hM={[Dc]:Ic,[Fc]:Nc,[Uc]:kc,[Oa]:zc,[Ic]:Dc,[Nc]:Fc,[kc]:Uc,[zc]:Oa};function dM(n,e){function t(){let H=!1;const Ge=new Kt;let ke=null;const ze=new Kt(0,0,0,0);return{setMask:function(Te){ke!==Te&&!H&&(n.colorMask(Te,Te,Te,Te),ke=Te)},setLocked:function(Te){H=Te},setClear:function(Te,me,Je,ft,Wt){Wt===!0&&(Te*=ft,me*=ft,Je*=ft),Ge.set(Te,me,Je,ft),ze.equals(Ge)===!1&&(n.clearColor(Te,me,Je,ft),ze.copy(Ge))},reset:function(){H=!1,ke=null,ze.set(-1,0,0,0)}}}function i(){let H=!1,Ge=!1,ke=null,ze=null,Te=null;return{setReversed:function(me){if(Ge!==me){const Je=e.get("EXT_clip_control");me?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Ge=me;const ft=Te;Te=null,this.setClear(ft)}},getReversed:function(){return Ge},setTest:function(me){me?Z(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(me){ke!==me&&!H&&(n.depthMask(me),ke=me)},setFunc:function(me){if(Ge&&(me=hM[me]),ze!==me){switch(me){case Dc:n.depthFunc(n.NEVER);break;case Ic:n.depthFunc(n.ALWAYS);break;case Fc:n.depthFunc(n.LESS);break;case Oa:n.depthFunc(n.LEQUAL);break;case Uc:n.depthFunc(n.EQUAL);break;case zc:n.depthFunc(n.GEQUAL);break;case Nc:n.depthFunc(n.GREATER);break;case kc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ze=me}},setLocked:function(me){H=me},setClear:function(me){Te!==me&&(Ge&&(me=1-me),n.clearDepth(me),Te=me)},reset:function(){H=!1,ke=null,ze=null,Te=null,Ge=!1}}}function s(){let H=!1,Ge=null,ke=null,ze=null,Te=null,me=null,Je=null,ft=null,Wt=null;return{setTest:function(Nt){H||(Nt?Z(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(Nt){Ge!==Nt&&!H&&(n.stencilMask(Nt),Ge=Nt)},setFunc:function(Nt,Nn,Cn){(ke!==Nt||ze!==Nn||Te!==Cn)&&(n.stencilFunc(Nt,Nn,Cn),ke=Nt,ze=Nn,Te=Cn)},setOp:function(Nt,Nn,Cn){(me!==Nt||Je!==Nn||ft!==Cn)&&(n.stencilOp(Nt,Nn,Cn),me=Nt,Je=Nn,ft=Cn)},setLocked:function(Nt){H=Nt},setClear:function(Nt){Wt!==Nt&&(n.clearStencil(Nt),Wt=Nt)},reset:function(){H=!1,Ge=null,ke=null,ze=null,Te=null,me=null,Je=null,ft=null,Wt=null}}}const a=new t,r=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},u={},m=new WeakMap,p=[],x=null,M=!1,g=null,f=null,y=null,v=null,_=null,E=null,T=null,A=new rt(0,0,0),C=0,w=!1,b=null,L=null,D=null,V=null,j=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,K=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=K>=1):ne.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=K>=2);let pe=null,ve={};const $e=n.getParameter(n.SCISSOR_BOX),I=n.getParameter(n.VIEWPORT),Ce=new Kt().fromArray($e),be=new Kt().fromArray(I);function Re(H,Ge,ke,ze){const Te=new Uint8Array(4),me=n.createTexture();n.bindTexture(H,me),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Je=0;Je<ke;Je++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ge,0,n.RGBA,1,1,ze,0,n.RGBA,n.UNSIGNED_BYTE,Te):n.texImage2D(Ge+Je,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Te);return me}const $={};$[n.TEXTURE_2D]=Re(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Z(n.DEPTH_TEST),r.setFunc(Oa),Tt(!1),_t(zd),Z(n.CULL_FACE),Bt(zi);function Z(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function we(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Pe(H,Ge){return u[H]!==Ge?(n.bindFramebuffer(H,Ge),u[H]=Ge,H===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Ge),H===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Ge),!0):!1}function Oe(H,Ge){let ke=p,ze=!1;if(H){ke=m.get(Ge),ke===void 0&&(ke=[],m.set(Ge,ke));const Te=H.textures;if(ke.length!==Te.length||ke[0]!==n.COLOR_ATTACHMENT0){for(let me=0,Je=Te.length;me<Je;me++)ke[me]=n.COLOR_ATTACHMENT0+me;ke.length=Te.length,ze=!0}}else ke[0]!==n.BACK&&(ke[0]=n.BACK,ze=!0);ze&&n.drawBuffers(ke)}function nt(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const Ht={[Gs]:n.FUNC_ADD,[Ap]:n.FUNC_SUBTRACT,[Cp]:n.FUNC_REVERSE_SUBTRACT};Ht[Rp]=n.MIN,Ht[Pp]=n.MAX;const at={[Lp]:n.ZERO,[Dp]:n.ONE,[Ip]:n.SRC_COLOR,[Pc]:n.SRC_ALPHA,[Op]:n.SRC_ALPHA_SATURATE,[Np]:n.DST_COLOR,[Up]:n.DST_ALPHA,[Fp]:n.ONE_MINUS_SRC_COLOR,[Lc]:n.ONE_MINUS_SRC_ALPHA,[kp]:n.ONE_MINUS_DST_COLOR,[zp]:n.ONE_MINUS_DST_ALPHA,[Bp]:n.CONSTANT_COLOR,[Vp]:n.ONE_MINUS_CONSTANT_COLOR,[Gp]:n.CONSTANT_ALPHA,[Hp]:n.ONE_MINUS_CONSTANT_ALPHA};function Bt(H,Ge,ke,ze,Te,me,Je,ft,Wt,Nt){if(H===zi){M===!0&&(we(n.BLEND),M=!1);return}if(M===!1&&(Z(n.BLEND),M=!0),H!==Ep){if(H!==g||Nt!==w){if((f!==Gs||_!==Gs)&&(n.blendEquation(n.FUNC_ADD),f=Gs,_=Gs),Nt)switch(H){case Ia:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ai:n.blendFunc(n.ONE,n.ONE);break;case Nd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case kd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:ln("WebGLState: Invalid blending: ",H);break}else switch(H){case Ia:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ai:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Nd:ln("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case kd:ln("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ln("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,T=null,A.set(0,0,0),C=0,g=H,w=Nt}return}Te=Te||Ge,me=me||ke,Je=Je||ze,(Ge!==f||Te!==_)&&(n.blendEquationSeparate(Ht[Ge],Ht[Te]),f=Ge,_=Te),(ke!==y||ze!==v||me!==E||Je!==T)&&(n.blendFuncSeparate(at[ke],at[ze],at[me],at[Je]),y=ke,v=ze,E=me,T=Je),(ft.equals(A)===!1||Wt!==C)&&(n.blendColor(ft.r,ft.g,ft.b,Wt),A.copy(ft),C=Wt),g=H,w=!1}function O(H,Ge){H.side===wt?we(n.CULL_FACE):Z(n.CULL_FACE);let ke=H.side===In;Ge&&(ke=!ke),Tt(ke),H.blending===Ia&&H.transparent===!1?Bt(zi):Bt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),r.setFunc(H.depthFunc),r.setTest(H.depthTest),r.setMask(H.depthWrite),a.setMask(H.colorWrite);const ze=H.stencilWrite;o.setTest(ze),ze&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Qe(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function Tt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function _t(H){H!==Sp?(Z(n.CULL_FACE),H!==L&&(H===zd?n.cullFace(n.BACK):H===Tp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),L=H}function Vt(H){H!==D&&(q&&n.lineWidth(H),D=H)}function Qe(H,Ge,ke){H?(Z(n.POLYGON_OFFSET_FILL),(V!==Ge||j!==ke)&&(n.polygonOffset(Ge,ke),V=Ge,j=ke)):we(n.POLYGON_OFFSET_FILL)}function qt(H){H?Z(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function ot(H){H===void 0&&(H=n.TEXTURE0+te-1),pe!==H&&(n.activeTexture(H),pe=H)}function Mt(H,Ge,ke){ke===void 0&&(pe===null?ke=n.TEXTURE0+te-1:ke=pe);let ze=ve[ke];ze===void 0&&(ze={type:void 0,texture:void 0},ve[ke]=ze),(ze.type!==H||ze.texture!==Ge)&&(pe!==ke&&(n.activeTexture(ke),pe=ke),n.bindTexture(H,Ge||$[H]),ze.type=H,ze.texture=Ge)}function F(){const H=ve[pe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function R(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ue(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ge(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function et(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Fe(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function it(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ye(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function _e(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Le(H){Ce.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),Ce.copy(H))}function ht(H){be.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),be.copy(H))}function ct(H,Ge){let ke=h.get(Ge);ke===void 0&&(ke=new WeakMap,h.set(Ge,ke));let ze=ke.get(H);ze===void 0&&(ze=n.getUniformBlockIndex(Ge,H.name),ke.set(H,ze))}function We(H,Ge){const ze=h.get(Ge).get(H);c.get(Ge)!==ze&&(n.uniformBlockBinding(Ge,ze,H.__bindingPointIndex),c.set(Ge,ze))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},pe=null,ve={},u={},m=new WeakMap,p=[],x=null,M=!1,g=null,f=null,y=null,v=null,_=null,E=null,T=null,A=new rt(0,0,0),C=0,w=!1,b=null,L=null,D=null,V=null,j=null,Ce.set(0,0,n.canvas.width,n.canvas.height),be.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:Z,disable:we,bindFramebuffer:Pe,drawBuffers:Oe,useProgram:nt,setBlending:Bt,setMaterial:O,setFlipSided:Tt,setCullFace:_t,setLineWidth:Vt,setPolygonOffset:Qe,setScissorTest:qt,activeTexture:ot,bindTexture:Mt,unbindTexture:F,compressedTexImage2D:R,compressedTexImage3D:J,texImage2D:Ye,texImage3D:_e,updateUBOMapping:ct,uniformBlockBinding:We,texStorage2D:Fe,texStorage3D:it,texSubImage2D:ue,texSubImage3D:ge,compressedTexSubImage2D:re,compressedTexSubImage3D:et,scissor:Le,viewport:ht,reset:dt}}function uM(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ue,d=new WeakMap;let u;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(F,R){return p?new OffscreenCanvas(F,R):sl("canvas")}function M(F,R,J){let ue=1;const ge=Mt(F);if((ge.width>J||ge.height>J)&&(ue=J/Math.max(ge.width,ge.height)),ue<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const re=Math.floor(ue*ge.width),et=Math.floor(ue*ge.height);u===void 0&&(u=x(re,et));const Fe=R?x(re,et):u;return Fe.width=re,Fe.height=et,Fe.getContext("2d").drawImage(F,0,0,re,et),vt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+re+"x"+et+")."),Fe}else return"data"in F&&vt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),F;return F}function g(F){return F.generateMipmaps}function f(F){n.generateMipmap(F)}function y(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(F,R,J,ue,ge=!1){if(F!==null){if(n[F]!==void 0)return n[F];vt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let re=R;if(R===n.RED&&(J===n.FLOAT&&(re=n.R32F),J===n.HALF_FLOAT&&(re=n.R16F),J===n.UNSIGNED_BYTE&&(re=n.R8)),R===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.R8UI),J===n.UNSIGNED_SHORT&&(re=n.R16UI),J===n.UNSIGNED_INT&&(re=n.R32UI),J===n.BYTE&&(re=n.R8I),J===n.SHORT&&(re=n.R16I),J===n.INT&&(re=n.R32I)),R===n.RG&&(J===n.FLOAT&&(re=n.RG32F),J===n.HALF_FLOAT&&(re=n.RG16F),J===n.UNSIGNED_BYTE&&(re=n.RG8)),R===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RG8UI),J===n.UNSIGNED_SHORT&&(re=n.RG16UI),J===n.UNSIGNED_INT&&(re=n.RG32UI),J===n.BYTE&&(re=n.RG8I),J===n.SHORT&&(re=n.RG16I),J===n.INT&&(re=n.RG32I)),R===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGB8UI),J===n.UNSIGNED_SHORT&&(re=n.RGB16UI),J===n.UNSIGNED_INT&&(re=n.RGB32UI),J===n.BYTE&&(re=n.RGB8I),J===n.SHORT&&(re=n.RGB16I),J===n.INT&&(re=n.RGB32I)),R===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),J===n.UNSIGNED_INT&&(re=n.RGBA32UI),J===n.BYTE&&(re=n.RGBA8I),J===n.SHORT&&(re=n.RGBA16I),J===n.INT&&(re=n.RGBA32I)),R===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),R===n.RGBA){const et=ge?nl:kt.getTransfer(ue);J===n.FLOAT&&(re=n.RGBA32F),J===n.HALF_FLOAT&&(re=n.RGBA16F),J===n.UNSIGNED_BYTE&&(re=et===$t?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function _(F,R){let J;return F?R===null||R===Qs||R===Dr?J=n.DEPTH24_STENCIL8:R===Ii?J=n.DEPTH32F_STENCIL8:R===Lr&&(J=n.DEPTH24_STENCIL8,vt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Qs||R===Dr?J=n.DEPTH_COMPONENT24:R===Ii?J=n.DEPTH_COMPONENT32F:R===Lr&&(J=n.DEPTH_COMPONENT16),J}function E(F,R){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==Jn&&F.minFilter!==ri?Math.log2(Math.max(R.width,R.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?R.mipmaps.length:1}function T(F){const R=F.target;R.removeEventListener("dispose",T),C(R),R.isVideoTexture&&d.delete(R)}function A(F){const R=F.target;R.removeEventListener("dispose",A),b(R)}function C(F){const R=i.get(F);if(R.__webglInit===void 0)return;const J=F.source,ue=m.get(J);if(ue){const ge=ue[R.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&w(F),Object.keys(ue).length===0&&m.delete(J)}i.remove(F)}function w(F){const R=i.get(F);n.deleteTexture(R.__webglTexture);const J=F.source,ue=m.get(J);delete ue[R.__cacheKey],r.memory.textures--}function b(F){const R=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++){if(Array.isArray(R.__webglFramebuffer[ue]))for(let ge=0;ge<R.__webglFramebuffer[ue].length;ge++)n.deleteFramebuffer(R.__webglFramebuffer[ue][ge]);else n.deleteFramebuffer(R.__webglFramebuffer[ue]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[ue])}else{if(Array.isArray(R.__webglFramebuffer))for(let ue=0;ue<R.__webglFramebuffer.length;ue++)n.deleteFramebuffer(R.__webglFramebuffer[ue]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ue=0;ue<R.__webglColorRenderbuffer.length;ue++)R.__webglColorRenderbuffer[ue]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[ue]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const J=F.textures;for(let ue=0,ge=J.length;ue<ge;ue++){const re=i.get(J[ue]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),r.memory.textures--),i.remove(J[ue])}i.remove(F)}let L=0;function D(){L=0}function V(){const F=L;return F>=s.maxTextures&&vt("WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+s.maxTextures),L+=1,F}function j(F){const R=[];return R.push(F.wrapS),R.push(F.wrapT),R.push(F.wrapR||0),R.push(F.magFilter),R.push(F.minFilter),R.push(F.anisotropy),R.push(F.internalFormat),R.push(F.format),R.push(F.type),R.push(F.generateMipmaps),R.push(F.premultiplyAlpha),R.push(F.flipY),R.push(F.unpackAlignment),R.push(F.colorSpace),R.join()}function te(F,R){const J=i.get(F);if(F.isVideoTexture&&qt(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&J.__version!==F.version){const ue=F.image;if(ue===null)vt("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)vt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,F,R);return}}else F.isExternalTexture&&(J.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+R)}function q(F,R){const J=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&J.__version!==F.version){$(J,F,R);return}else F.isExternalTexture&&(J.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+R)}function K(F,R){const J=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&J.__version!==F.version){$(J,F,R);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+R)}function ne(F,R){const J=i.get(F);if(F.version>0&&J.__version!==F.version){Z(J,F,R);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+R)}const pe={[zn]:n.REPEAT,[ns]:n.CLAMP_TO_EDGE,[Vc]:n.MIRRORED_REPEAT},ve={[Jn]:n.NEAREST,[qp]:n.NEAREST_MIPMAP_NEAREST,[ao]:n.NEAREST_MIPMAP_LINEAR,[ri]:n.LINEAR,[zl]:n.LINEAR_MIPMAP_NEAREST,[Ws]:n.LINEAR_MIPMAP_LINEAR},$e={[Kp]:n.NEVER,[nm]:n.ALWAYS,[Jp]:n.LESS,[z0]:n.LEQUAL,[jp]:n.EQUAL,[tm]:n.GEQUAL,[Qp]:n.GREATER,[em]:n.NOTEQUAL};function I(F,R){if(R.type===Ii&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===ri||R.magFilter===zl||R.magFilter===ao||R.magFilter===Ws||R.minFilter===ri||R.minFilter===zl||R.minFilter===ao||R.minFilter===Ws)&&vt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,pe[R.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,pe[R.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,pe[R.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,ve[R.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,ve[R.minFilter]),R.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,$e[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Jn||R.minFilter!==ao&&R.minFilter!==Ws||R.type===Ii&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(F,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,s.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function Ce(F,R){let J=!1;F.__webglInit===void 0&&(F.__webglInit=!0,R.addEventListener("dispose",T));const ue=R.source;let ge=m.get(ue);ge===void 0&&(ge={},m.set(ue,ge));const re=j(R);if(re!==F.__cacheKey){ge[re]===void 0&&(ge[re]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,J=!0),ge[re].usedTimes++;const et=ge[F.__cacheKey];et!==void 0&&(ge[F.__cacheKey].usedTimes--,et.usedTimes===0&&w(R)),F.__cacheKey=re,F.__webglTexture=ge[re].texture}return J}function be(F,R,J){return Math.floor(Math.floor(F/J)/R)}function Re(F,R,J,ue){const re=F.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,R.width,R.height,J,ue,R.data);else{re.sort((_e,Le)=>_e.start-Le.start);let et=0;for(let _e=1;_e<re.length;_e++){const Le=re[et],ht=re[_e],ct=Le.start+Le.count,We=be(ht.start,R.width,4),dt=be(Le.start,R.width,4);ht.start<=ct+1&&We===dt&&be(ht.start+ht.count-1,R.width,4)===We?Le.count=Math.max(Le.count,ht.start+ht.count-Le.start):(++et,re[et]=ht)}re.length=et+1;const Fe=n.getParameter(n.UNPACK_ROW_LENGTH),it=n.getParameter(n.UNPACK_SKIP_PIXELS),Ye=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,R.width);for(let _e=0,Le=re.length;_e<Le;_e++){const ht=re[_e],ct=Math.floor(ht.start/4),We=Math.ceil(ht.count/4),dt=ct%R.width,H=Math.floor(ct/R.width),Ge=We,ke=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,dt),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,dt,H,Ge,ke,J,ue,R.data)}F.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Fe),n.pixelStorei(n.UNPACK_SKIP_PIXELS,it),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ye)}}function $(F,R,J){let ue=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ue=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ue=n.TEXTURE_3D);const ge=Ce(F,R),re=R.source;t.bindTexture(ue,F.__webglTexture,n.TEXTURE0+J);const et=i.get(re);if(re.version!==et.__version||ge===!0){t.activeTexture(n.TEXTURE0+J);const Fe=kt.getPrimaries(kt.workingColorSpace),it=R.colorSpace===Ms?null:kt.getPrimaries(R.colorSpace),Ye=R.colorSpace===Ms||Fe===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let _e=M(R.image,!1,s.maxTextureSize);_e=ot(R,_e);const Le=a.convert(R.format,R.colorSpace),ht=a.convert(R.type);let ct=v(R.internalFormat,Le,ht,R.colorSpace,R.isVideoTexture);I(ue,R);let We;const dt=R.mipmaps,H=R.isVideoTexture!==!0,Ge=et.__version===void 0||ge===!0,ke=re.dataReady,ze=E(R,_e);if(R.isDepthTexture)ct=_(R.format===Fr,R.type),Ge&&(H?t.texStorage2D(n.TEXTURE_2D,1,ct,_e.width,_e.height):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Le,ht,null));else if(R.isDataTexture)if(dt.length>0){H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,dt[0].width,dt[0].height);for(let Te=0,me=dt.length;Te<me;Te++)We=dt[Te],H?ke&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,We.width,We.height,Le,ht,We.data):t.texImage2D(n.TEXTURE_2D,Te,ct,We.width,We.height,0,Le,ht,We.data);R.generateMipmaps=!1}else H?(Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height),ke&&Re(R,_e,Le,ht)):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Le,ht,_e.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){H&&Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,dt[0].width,dt[0].height,_e.depth);for(let Te=0,me=dt.length;Te<me;Te++)if(We=dt[Te],R.format!==Mi)if(Le!==null)if(H){if(ke)if(R.layerUpdates.size>0){const Je=Su(We.width,We.height,R.format,R.type);for(const ft of R.layerUpdates){const Wt=We.data.subarray(ft*Je/We.data.BYTES_PER_ELEMENT,(ft+1)*Je/We.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,ft,We.width,We.height,1,Le,Wt)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,0,We.width,We.height,_e.depth,Le,We.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Te,ct,We.width,We.height,_e.depth,0,We.data,0,0);else vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?ke&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,0,We.width,We.height,_e.depth,Le,ht,We.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Te,ct,We.width,We.height,_e.depth,0,Le,ht,We.data)}else{H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,dt[0].width,dt[0].height);for(let Te=0,me=dt.length;Te<me;Te++)We=dt[Te],R.format!==Mi?Le!==null?H?ke&&t.compressedTexSubImage2D(n.TEXTURE_2D,Te,0,0,We.width,We.height,Le,We.data):t.compressedTexImage2D(n.TEXTURE_2D,Te,ct,We.width,We.height,0,We.data):vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?ke&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,We.width,We.height,Le,ht,We.data):t.texImage2D(n.TEXTURE_2D,Te,ct,We.width,We.height,0,Le,ht,We.data)}else if(R.isDataArrayTexture)if(H){if(Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,_e.width,_e.height,_e.depth),ke)if(R.layerUpdates.size>0){const Te=Su(_e.width,_e.height,R.format,R.type);for(const me of R.layerUpdates){const Je=_e.data.subarray(me*Te/_e.data.BYTES_PER_ELEMENT,(me+1)*Te/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,me,_e.width,_e.height,1,Le,ht,Je)}R.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Le,ht,_e.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,_e.width,_e.height,_e.depth,0,Le,ht,_e.data);else if(R.isData3DTexture)H?(Ge&&t.texStorage3D(n.TEXTURE_3D,ze,ct,_e.width,_e.height,_e.depth),ke&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Le,ht,_e.data)):t.texImage3D(n.TEXTURE_3D,0,ct,_e.width,_e.height,_e.depth,0,Le,ht,_e.data);else if(R.isFramebufferTexture){if(Ge)if(H)t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height);else{let Te=_e.width,me=_e.height;for(let Je=0;Je<ze;Je++)t.texImage2D(n.TEXTURE_2D,Je,ct,Te,me,0,Le,ht,null),Te>>=1,me>>=1}}else if(dt.length>0){if(H&&Ge){const Te=Mt(dt[0]);t.texStorage2D(n.TEXTURE_2D,ze,ct,Te.width,Te.height)}for(let Te=0,me=dt.length;Te<me;Te++)We=dt[Te],H?ke&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Le,ht,We):t.texImage2D(n.TEXTURE_2D,Te,ct,Le,ht,We);R.generateMipmaps=!1}else if(H){if(Ge){const Te=Mt(_e);t.texStorage2D(n.TEXTURE_2D,ze,ct,Te.width,Te.height)}ke&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Le,ht,_e)}else t.texImage2D(n.TEXTURE_2D,0,ct,Le,ht,_e);g(R)&&f(ue),et.__version=re.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function Z(F,R,J){if(R.image.length!==6)return;const ue=Ce(F,R),ge=R.source;t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+J);const re=i.get(ge);if(ge.version!==re.__version||ue===!0){t.activeTexture(n.TEXTURE0+J);const et=kt.getPrimaries(kt.workingColorSpace),Fe=R.colorSpace===Ms?null:kt.getPrimaries(R.colorSpace),it=R.colorSpace===Ms||et===Fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);const Ye=R.isCompressedTexture||R.image[0].isCompressedTexture,_e=R.image[0]&&R.image[0].isDataTexture,Le=[];for(let me=0;me<6;me++)!Ye&&!_e?Le[me]=M(R.image[me],!0,s.maxCubemapSize):Le[me]=_e?R.image[me].image:R.image[me],Le[me]=ot(R,Le[me]);const ht=Le[0],ct=a.convert(R.format,R.colorSpace),We=a.convert(R.type),dt=v(R.internalFormat,ct,We,R.colorSpace),H=R.isVideoTexture!==!0,Ge=re.__version===void 0||ue===!0,ke=ge.dataReady;let ze=E(R,ht);I(n.TEXTURE_CUBE_MAP,R);let Te;if(Ye){H&&Ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,dt,ht.width,ht.height);for(let me=0;me<6;me++){Te=Le[me].mipmaps;for(let Je=0;Je<Te.length;Je++){const ft=Te[Je];R.format!==Mi?ct!==null?H?ke&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,0,0,ft.width,ft.height,ct,ft.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,dt,ft.width,ft.height,0,ft.data):vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,0,0,ft.width,ft.height,ct,We,ft.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,dt,ft.width,ft.height,0,ct,We,ft.data)}}}else{if(Te=R.mipmaps,H&&Ge){Te.length>0&&ze++;const me=Mt(Le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,dt,me.width,me.height)}for(let me=0;me<6;me++)if(_e){H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Le[me].width,Le[me].height,ct,We,Le[me].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,dt,Le[me].width,Le[me].height,0,ct,We,Le[me].data);for(let Je=0;Je<Te.length;Je++){const Wt=Te[Je].image[me].image;H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,0,0,Wt.width,Wt.height,ct,We,Wt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,dt,Wt.width,Wt.height,0,ct,We,Wt.data)}}else{H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,ct,We,Le[me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,dt,ct,We,Le[me]);for(let Je=0;Je<Te.length;Je++){const ft=Te[Je];H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,0,0,ct,We,ft.image[me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,dt,ct,We,ft.image[me])}}}g(R)&&f(n.TEXTURE_CUBE_MAP),re.__version=ge.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function we(F,R,J,ue,ge,re){const et=a.convert(J.format,J.colorSpace),Fe=a.convert(J.type),it=v(J.internalFormat,et,Fe,J.colorSpace),Ye=i.get(R),_e=i.get(J);if(_e.__renderTarget=R,!Ye.__hasExternalTextures){const Le=Math.max(1,R.width>>re),ht=Math.max(1,R.height>>re);ge===n.TEXTURE_3D||ge===n.TEXTURE_2D_ARRAY?t.texImage3D(ge,re,it,Le,ht,R.depth,0,et,Fe,null):t.texImage2D(ge,re,it,Le,ht,0,et,Fe,null)}t.bindFramebuffer(n.FRAMEBUFFER,F),Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,ge,_e.__webglTexture,0,Vt(R)):(ge===n.TEXTURE_2D||ge>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ue,ge,_e.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(F,R,J){if(n.bindRenderbuffer(n.RENDERBUFFER,F),R.depthBuffer){const ue=R.depthTexture,ge=ue&&ue.isDepthTexture?ue.type:null,re=_(R.stencilBuffer,ge),et=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Fe=Vt(R);Qe(R)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Fe,re,R.width,R.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,re,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,re,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,F)}else{const ue=R.textures;for(let ge=0;ge<ue.length;ge++){const re=ue[ge],et=a.convert(re.format,re.colorSpace),Fe=a.convert(re.type),it=v(re.internalFormat,et,Fe,re.colorSpace),Ye=Vt(R);J&&Qe(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ye,it,R.width,R.height):Qe(R)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ye,it,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,it,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(F,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,F),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ue=i.get(R.depthTexture);ue.__renderTarget=R,(!ue.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),te(R.depthTexture,0);const ge=ue.__webglTexture,re=Vt(R);if(R.depthTexture.format===Ir)Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0);else if(R.depthTexture.format===Fr)Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function nt(F){const R=i.get(F),J=F.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==F.depthTexture){const ue=F.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),ue){const ge=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,ue.removeEventListener("dispose",ge)};ue.addEventListener("dispose",ge),R.__depthDisposeCallback=ge}R.__boundDepthTexture=ue}if(F.depthTexture&&!R.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ue=F.texture.mipmaps;ue&&ue.length>0?Oe(R.__webglFramebuffer[0],F):Oe(R.__webglFramebuffer,F)}else if(J){R.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[ue]),R.__webglDepthbuffer[ue]===void 0)R.__webglDepthbuffer[ue]=n.createRenderbuffer(),Pe(R.__webglDepthbuffer[ue],F,!1);else{const ge=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=R.__webglDepthbuffer[ue];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,re)}}else{const ue=F.texture.mipmaps;if(ue&&ue.length>0?t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),Pe(R.__webglDepthbuffer,F,!1);else{const ge=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ht(F,R,J){const ue=i.get(F);R!==void 0&&we(ue.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&nt(F)}function at(F){const R=F.texture,J=i.get(F),ue=i.get(R);F.addEventListener("dispose",A);const ge=F.textures,re=F.isWebGLCubeRenderTarget===!0,et=ge.length>1;if(et||(ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture()),ue.__version=R.version,r.memory.textures++),re){J.__webglFramebuffer=[];for(let Fe=0;Fe<6;Fe++)if(R.mipmaps&&R.mipmaps.length>0){J.__webglFramebuffer[Fe]=[];for(let it=0;it<R.mipmaps.length;it++)J.__webglFramebuffer[Fe][it]=n.createFramebuffer()}else J.__webglFramebuffer[Fe]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){J.__webglFramebuffer=[];for(let Fe=0;Fe<R.mipmaps.length;Fe++)J.__webglFramebuffer[Fe]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(et)for(let Fe=0,it=ge.length;Fe<it;Fe++){const Ye=i.get(ge[Fe]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=n.createTexture(),r.memory.textures++)}if(F.samples>0&&Qe(F)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Fe=0;Fe<ge.length;Fe++){const it=ge[Fe];J.__webglColorRenderbuffer[Fe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Fe]);const Ye=a.convert(it.format,it.colorSpace),_e=a.convert(it.type),Le=v(it.internalFormat,Ye,_e,it.colorSpace,F.isXRRenderTarget===!0),ht=Vt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,ht,Le,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Fe,n.RENDERBUFFER,J.__webglColorRenderbuffer[Fe])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(J.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ue.__webglTexture),I(n.TEXTURE_CUBE_MAP,R);for(let Fe=0;Fe<6;Fe++)if(R.mipmaps&&R.mipmaps.length>0)for(let it=0;it<R.mipmaps.length;it++)we(J.__webglFramebuffer[Fe][it],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Fe,it);else we(J.__webglFramebuffer[Fe],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Fe,0);g(R)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(et){for(let Fe=0,it=ge.length;Fe<it;Fe++){const Ye=ge[Fe],_e=i.get(Ye);let Le=n.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Le=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Le,_e.__webglTexture),I(Le,Ye),we(J.__webglFramebuffer,F,Ye,n.COLOR_ATTACHMENT0+Fe,Le,0),g(Ye)&&f(Le)}t.unbindTexture()}else{let Fe=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Fe=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Fe,ue.__webglTexture),I(Fe,R),R.mipmaps&&R.mipmaps.length>0)for(let it=0;it<R.mipmaps.length;it++)we(J.__webglFramebuffer[it],F,R,n.COLOR_ATTACHMENT0,Fe,it);else we(J.__webglFramebuffer,F,R,n.COLOR_ATTACHMENT0,Fe,0);g(R)&&f(Fe),t.unbindTexture()}F.depthBuffer&&nt(F)}function Bt(F){const R=F.textures;for(let J=0,ue=R.length;J<ue;J++){const ge=R[J];if(g(ge)){const re=y(F),et=i.get(ge).__webglTexture;t.bindTexture(re,et),f(re),t.unbindTexture()}}}const O=[],Tt=[];function _t(F){if(F.samples>0){if(Qe(F)===!1){const R=F.textures,J=F.width,ue=F.height;let ge=n.COLOR_BUFFER_BIT;const re=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=i.get(F),Fe=R.length>1;if(Fe)for(let Ye=0;Ye<R.length;Ye++)t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,et.__webglMultisampledFramebuffer);const it=F.texture.mipmaps;it&&it.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let Ye=0;Ye<R.length;Ye++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(ge|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(ge|=n.STENCIL_BUFFER_BIT)),Fe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,et.__webglColorRenderbuffer[Ye]);const _e=i.get(R[Ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_e,0)}n.blitFramebuffer(0,0,J,ue,0,0,J,ue,ge,n.NEAREST),c===!0&&(O.length=0,Tt.length=0,O.push(n.COLOR_ATTACHMENT0+Ye),F.depthBuffer&&F.resolveDepthBuffer===!1&&(O.push(re),Tt.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Tt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,O))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Fe)for(let Ye=0;Ye<R.length;Ye++){t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.RENDERBUFFER,et.__webglColorRenderbuffer[Ye]);const _e=i.get(R[Ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.TEXTURE_2D,_e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&c){const R=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Vt(F){return Math.min(s.maxSamples,F.samples)}function Qe(F){const R=i.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function qt(F){const R=r.render.frame;d.get(F)!==R&&(d.set(F,R),F.update())}function ot(F,R){const J=F.colorSpace,ue=F.format,ge=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||J!==Ga&&J!==Ms&&(kt.getTransfer(J)===$t?(ue!==Mi||ge!==Hi)&&vt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ln("WebGLTextures: Unsupported texture color space:",J)),R}function Mt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(h.width=F.naturalWidth||F.width,h.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(h.width=F.displayWidth,h.height=F.displayHeight):(h.width=F.width,h.height=F.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=D,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=ne,this.rebindTextures=Ht,this.setupRenderTarget=at,this.updateRenderTargetMipmap=Bt,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=we,this.useMultisampledRTT=Qe}function fM(n,e){function t(i,s=Ms){let a;const r=kt.getTransfer(s);if(i===Hi)return n.UNSIGNED_BYTE;if(i===Wh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Xh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===D0)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===I0)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===P0)return n.BYTE;if(i===L0)return n.SHORT;if(i===Lr)return n.UNSIGNED_SHORT;if(i===Hh)return n.INT;if(i===Qs)return n.UNSIGNED_INT;if(i===Ii)return n.FLOAT;if(i===Ni)return n.HALF_FLOAT;if(i===F0)return n.ALPHA;if(i===U0)return n.RGB;if(i===Mi)return n.RGBA;if(i===Ir)return n.DEPTH_COMPONENT;if(i===Fr)return n.DEPTH_STENCIL;if(i===qh)return n.RED;if(i===Yh)return n.RED_INTEGER;if(i===$h)return n.RG;if(i===Zh)return n.RG_INTEGER;if(i===Kh)return n.RGBA_INTEGER;if(i===Yo||i===$o||i===Zo||i===Ko)if(r===$t)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Yo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===$o)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ko)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Yo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===$o)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ko)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Gc||i===Hc||i===Wc||i===Xc)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Gc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Hc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Wc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Xc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===qc||i===Yc||i===$c)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===qc||i===Yc)return r===$t?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===$c)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Zc||i===Kc||i===Jc||i===jc||i===Qc||i===eh||i===th||i===nh||i===ih||i===sh||i===ah||i===rh||i===oh||i===lh)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Zc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Kc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Jc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===jc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Qc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===eh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===th)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===nh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ih)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===sh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ah)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===rh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===oh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===lh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ch||i===hh||i===dh)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===ch)return r===$t?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===hh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===dh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===uh||i===fh||i===ph||i===mh)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===uh)return a.COMPRESSED_RED_RGTC1_EXT;if(i===fh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ph)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===mh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Dr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const pM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,mM=`
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

}`;class xM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Z0(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Sn({vertexShader:pM,fragmentShader:mM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new z(new zt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gM extends Ya{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,h=null,d=null,u=null,m=null,p=null,x=null;const M=typeof XRWebGLBinding<"u",g=new xM,f={},y=t.getContextAttributes();let v=null,_=null;const E=[],T=[],A=new Ue;let C=null;const w=new Zn;w.viewport=new Kt;const b=new Zn;b.viewport=new Kt;const L=[w,b],D=new Ux;let V=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=E[$];return Z===void 0&&(Z=new ic,E[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=E[$];return Z===void 0&&(Z=new ic,E[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=E[$];return Z===void 0&&(Z=new ic,E[$]=Z),Z.getHandSpace()};function te($){const Z=T.indexOf($.inputSource);if(Z===-1)return;const we=E[Z];we!==void 0&&(we.update($.inputSource,$.frame,h||r),we.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",K);for(let $=0;$<E.length;$++){const Z=T[$];Z!==null&&(T[$]=null,E[$].disconnect(Z))}V=null,j=null,g.reset();for(const $ in f)delete f[$];e.setRenderTarget(v),p=null,m=null,u=null,s=null,_=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&vt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&vt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",K),y.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(A),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,Pe=null,Oe=null;y.depth&&(Oe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=y.stencil?Fr:Ir,Pe=y.stencil?Dr:Qs);const nt={colorFormat:t.RGBA8,depthFormat:Oe,scaleFactor:a};u=this.getBinding(),m=u.createProjectionLayer(nt),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),_=new yi(m.textureWidth,m.textureHeight,{format:Mi,type:Hi,depthTexture:new $0(m.textureWidth,m.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const we={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new yi(p.framebufferWidth,p.framebufferHeight,{format:Mi,type:Hi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),h=null,r=await s.requestReferenceSpace(o),Re.setContext(s),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function K($){for(let Z=0;Z<$.removed.length;Z++){const we=$.removed[Z],Pe=T.indexOf(we);Pe>=0&&(T[Pe]=null,E[Pe].disconnect(we))}for(let Z=0;Z<$.added.length;Z++){const we=$.added[Z];let Pe=T.indexOf(we);if(Pe===-1){for(let nt=0;nt<E.length;nt++)if(nt>=T.length){T.push(we),Pe=nt;break}else if(T[nt]===null){T[nt]=we,Pe=nt;break}if(Pe===-1)break}const Oe=E[Pe];Oe&&Oe.connect(we)}}const ne=new P,pe=new P;function ve($,Z,we){ne.setFromMatrixPosition(Z.matrixWorld),pe.setFromMatrixPosition(we.matrixWorld);const Pe=ne.distanceTo(pe),Oe=Z.projectionMatrix.elements,nt=we.projectionMatrix.elements,Ht=Oe[14]/(Oe[10]-1),at=Oe[14]/(Oe[10]+1),Bt=(Oe[9]+1)/Oe[5],O=(Oe[9]-1)/Oe[5],Tt=(Oe[8]-1)/Oe[0],_t=(nt[8]+1)/nt[0],Vt=Ht*Tt,Qe=Ht*_t,qt=Pe/(-Tt+_t),ot=qt*-Tt;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(qt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Oe[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Mt=Ht+qt,F=at+qt,R=Vt-ot,J=Qe+(Pe-ot),ue=Bt*at/F*Mt,ge=O*at/F*Mt;$.projectionMatrix.makePerspective(R,J,ue,ge,Mt,F),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function $e($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let Z=$.near,we=$.far;g.texture!==null&&(g.depthNear>0&&(Z=g.depthNear),g.depthFar>0&&(we=g.depthFar)),D.near=b.near=w.near=Z,D.far=b.far=w.far=we,(V!==D.near||j!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),V=D.near,j=D.far),D.layers.mask=$.layers.mask|6,w.layers.mask=D.layers.mask&3,b.layers.mask=D.layers.mask&5;const Pe=$.parent,Oe=D.cameras;$e(D,Pe);for(let nt=0;nt<Oe.length;nt++)$e(Oe[nt],Pe);Oe.length===2?ve(D,w,b):D.projectionMatrix.copy(w.projectionMatrix),I($,D,Pe)};function I($,Z,we){we===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(we.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=zr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(m===null&&p===null))return c},this.setFoveation=function($){c=$,m!==null&&(m.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function($){return f[$]};let Ce=null;function be($,Z){if(d=Z.getViewerPose(h||r),x=Z,d!==null){const we=d.views;p!==null&&(e.setRenderTargetFramebuffer(_,p.framebuffer),e.setRenderTarget(_));let Pe=!1;we.length!==D.cameras.length&&(D.cameras.length=0,Pe=!0);for(let at=0;at<we.length;at++){const Bt=we[at];let O=null;if(p!==null)O=p.getViewport(Bt);else{const _t=u.getViewSubImage(m,Bt);O=_t.viewport,at===0&&(e.setRenderTargetTextures(_,_t.colorTexture,_t.depthStencilTexture),e.setRenderTarget(_))}let Tt=L[at];Tt===void 0&&(Tt=new Zn,Tt.layers.enable(at),Tt.viewport=new Kt,L[at]=Tt),Tt.matrix.fromArray(Bt.transform.matrix),Tt.matrix.decompose(Tt.position,Tt.quaternion,Tt.scale),Tt.projectionMatrix.fromArray(Bt.projectionMatrix),Tt.projectionMatrixInverse.copy(Tt.projectionMatrix).invert(),Tt.viewport.set(O.x,O.y,O.width,O.height),at===0&&(D.matrix.copy(Tt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Pe===!0&&D.cameras.push(Tt)}const Oe=s.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=i.getBinding();const at=u.getDepthInformation(we[0]);at&&at.isValid&&at.texture&&g.init(at,s.renderState)}if(Oe&&Oe.includes("camera-access")&&M){e.state.unbindTexture(),u=i.getBinding();for(let at=0;at<we.length;at++){const Bt=we[at].camera;if(Bt){let O=f[Bt];O||(O=new Z0,f[Bt]=O);const Tt=u.getCameraImage(Bt);O.sourceTexture=Tt}}}}for(let we=0;we<E.length;we++){const Pe=T[we],Oe=E[we];Pe!==null&&Oe!==void 0&&Oe.update(Pe,Z,h||r)}Ce&&Ce($,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),x=null}const Re=new of;Re.setAnimationLoop(be),this.setAnimationLoop=function($){Ce=$},this.dispose=function(){}}}const Ns=new bi,vM=new yt;function MM(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,G0(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,y,v,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(g,f):f.isMeshToonMaterial?(a(g,f),u(g,f)):f.isMeshPhongMaterial?(a(g,f),d(g,f)):f.isMeshStandardMaterial?(a(g,f),m(g,f),f.isMeshPhysicalMaterial&&p(g,f,_)):f.isMeshMatcapMaterial?(a(g,f),x(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),M(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?c(g,f,y,v):f.isSpriteMaterial?h(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===In&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===In&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const y=e.get(f),v=y.envMap,_=y.envMapRotation;v&&(g.envMap.value=v,Ns.copy(_),Ns.x*=-1,Ns.y*=-1,Ns.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ns.y*=-1,Ns.z*=-1),g.envMapRotation.value.setFromMatrix4(vM.makeRotationFromEuler(Ns)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,y,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*y,g.scale.value=v*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function m(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,y){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===In&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,f){f.matcap&&(g.matcap.value=f.matcap)}function M(g,f){const y=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function _M(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const _=v.program;i.uniformBlockBinding(y,_)}function h(y,v){let _=s[y.id];_===void 0&&(x(y),_=d(y),s[y.id]=_,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;a[y.id]!==T&&(m(y),a[y.id]=T)}function d(y){const v=u();y.__bindingPointIndex=v;const _=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,_),_}function u(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return ln("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(y){const v=s[y.id],_=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=_.length;T<A;T++){const C=Array.isArray(_[T])?_[T]:[_[T]];for(let w=0,b=C.length;w<b;w++){const L=C[w];if(p(L,T,w,E)===!0){const D=L.__offset,V=Array.isArray(L.value)?L.value:[L.value];let j=0;for(let te=0;te<V.length;te++){const q=V[te],K=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,D+j,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,j),j+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,D,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,v,_,E){const T=y.value,A=v+"_"+_;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const C=E[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function x(y){const v=y.uniforms;let _=0;const E=16;for(let A=0,C=v.length;A<C;A++){const w=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,L=w.length;b<L;b++){const D=w[b],V=Array.isArray(D.value)?D.value:[D.value];for(let j=0,te=V.length;j<te;j++){const q=V[j],K=M(q),ne=_%E,pe=ne%K.boundary,ve=ne+pe;_+=pe,ve!==0&&E-ve<K.storage&&(_+=E-ve),D.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=_,_+=K.storage}}}const T=_%E;return T>0&&(_+=E-T),y.__size=_,y.__cache={},this}function M(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?vt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):vt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const _=r.indexOf(v.__bindingPointIndex);r.splice(_,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:h,dispose:f}}const yM=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let ji=null;function bM(){return ji===null&&(ji=new Y0(yM,32,32,$h,Ni),ji.minFilter=ri,ji.magFilter=ri,ji.wrapS=ns,ji.wrapT=ns,ji.generateMipmaps=!1,ji.needsUpdate=!0),ji}class wM{constructor(e={}){const{canvas:t=im(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;const x=new Set([Kh,Zh,Yh]),M=new Set([Hi,Qs,Lr,Dr,Wh,Xh]),g=new Uint32Array(4),f=new Int32Array(4);let y=null,v=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ws,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let A=!1;this._outputColorSpace=Lt;let C=0,w=0,b=null,L=-1,D=null;const V=new Kt,j=new Kt;let te=null;const q=new rt(0);let K=0,ne=t.width,pe=t.height,ve=1,$e=null,I=null;const Ce=new Kt(0,0,ne,pe),be=new Kt(0,0,ne,pe);let Re=!1;const $=new id;let Z=!1,we=!1;const Pe=new yt,Oe=new P,nt=new Kt,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function Bt(){return b===null?ve:1}let O=i;function Tt(S,U){return t.getContext(S,U)}try{const S={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Bh}`),t.addEventListener("webglcontextlost",Te,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",Je,!1),O===null){const U="webgl2";if(O=Tt(U,S),O===null)throw Tt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw S("WebGLRenderer: "+S.message),S}let _t,Vt,Qe,qt,ot,Mt,F,R,J,ue,ge,re,et,Fe,it,Ye,_e,Le,ht,ct,We,dt,H,Ge;function ke(){_t=new L2(O),_t.init(),dt=new fM(O,_t),Vt=new b2(O,_t,e,dt),Qe=new dM(O,_t),Vt.reversedDepthBuffer&&m&&Qe.buffers.depth.setReversed(!0),qt=new F2(O),ot=new jv,Mt=new uM(O,_t,Qe,ot,Vt,dt,qt),F=new S2(T),R=new P2(T),J=new kx(O),H=new _2(O,J),ue=new D2(O,J,qt,H),ge=new z2(O,ue,J,qt),ht=new U2(O,Vt,Mt),Ye=new w2(ot),re=new Jv(T,F,R,_t,Vt,H,Ye),et=new MM(T,ot),Fe=new eM,it=new rM(_t),Le=new M2(T,F,R,Qe,ge,p,c),_e=new cM(T,ge,Vt),Ge=new _M(O,qt,Vt,Qe),ct=new y2(O,_t,qt),We=new I2(O,_t,qt),qt.programs=re.programs,T.capabilities=Vt,T.extensions=_t,T.properties=ot,T.renderLists=Fe,T.shadowMap=_e,T.state=Qe,T.info=qt}ke();const ze=new gM(T,O);this.xr=ze,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const S=_t.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=_t.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(S){S!==void 0&&(ve=S,this.setSize(ne,pe,!1))},this.getSize=function(S){return S.set(ne,pe)},this.setSize=function(S,U,G=!0){if(ze.isPresenting){vt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=S,pe=U,t.width=Math.floor(S*ve),t.height=Math.floor(U*ve),G===!0&&(t.style.width=S+"px",t.style.height=U+"px"),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(ne*ve,pe*ve).floor()},this.setDrawingBufferSize=function(S,U,G){ne=S,pe=U,ve=G,t.width=Math.floor(S*G),t.height=Math.floor(U*G),this.setViewport(0,0,S,U)},this.getCurrentViewport=function(S){return S.copy(V)},this.getViewport=function(S){return S.copy(Ce)},this.setViewport=function(S,U,G,X){S.isVector4?Ce.set(S.x,S.y,S.z,S.w):Ce.set(S,U,G,X),Qe.viewport(V.copy(Ce).multiplyScalar(ve).round())},this.getScissor=function(S){return S.copy(be)},this.setScissor=function(S,U,G,X){S.isVector4?be.set(S.x,S.y,S.z,S.w):be.set(S,U,G,X),Qe.scissor(j.copy(be).multiplyScalar(ve).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(S){Qe.setScissorTest(Re=S)},this.setOpaqueSort=function(S){$e=S},this.setTransparentSort=function(S){I=S},this.getClearColor=function(S){return S.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,G=!0){let X=0;if(S){let B=!1;if(b!==null){const oe=b.texture.format;B=x.has(oe)}if(B){const oe=b.texture.type,ae=M.has(oe),Q=Le.getClearColor(),fe=Le.getClearAlpha(),De=Q.r,Ve=Q.g,Ie=Q.b;ae?(g[0]=De,g[1]=Ve,g[2]=Ie,g[3]=fe,O.clearBufferuiv(O.COLOR,0,g)):(f[0]=De,f[1]=Ve,f[2]=Ie,f[3]=fe,O.clearBufferiv(O.COLOR,0,f))}else X|=O.COLOR_BUFFER_BIT}U&&(X|=O.DEPTH_BUFFER_BIT),G&&(X|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Te,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",Je,!1),Le.dispose(),Fe.dispose(),it.dispose(),ot.dispose(),F.dispose(),R.dispose(),ge.dispose(),H.dispose(),Ge.dispose(),re.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",no),ze.removeEventListener("sessionend",Qa),wi.stop()};function Te(S){S.preventDefault(),al("WebGLRenderer: Context Lost."),A=!0}function me(){al("WebGLRenderer: Context Restored."),A=!1;const S=qt.autoReset,U=_e.enabled,G=_e.autoUpdate,X=_e.needsUpdate,B=_e.type;ke(),qt.autoReset=S,_e.enabled=U,_e.autoUpdate=G,_e.needsUpdate=X,_e.type=B}function Je(S){ln("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ft(S){const U=S.target;U.removeEventListener("dispose",ft),Wt(U)}function Wt(S){Nt(S),ot.remove(S)}function Nt(S){const U=ot.get(S).programs;U!==void 0&&(U.forEach(function(G){re.releaseProgram(G)}),S.isShaderMaterial&&re.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,G,X,B,oe){U===null&&(U=Ht);const ae=B.isMesh&&B.matrixWorld.determinant()<0,Q=N(S,U,G,X,B);Qe.setMaterial(X,ae);let fe=G.index,De=1;if(X.wireframe===!0){if(fe=ue.getWireframeAttribute(G),fe===void 0)return;De=2}const Ve=G.drawRange,Ie=G.attributes.position;let Ne=Ve.start*De,pt=(Ve.start+Ve.count)*De;oe!==null&&(Ne=Math.max(Ne,oe.start*De),pt=Math.min(pt,(oe.start+oe.count)*De)),fe!==null?(Ne=Math.max(Ne,0),pt=Math.min(pt,fe.count)):Ie!=null&&(Ne=Math.max(Ne,0),pt=Math.min(pt,Ie.count));const Et=pt-Ne;if(Et<0||Et===1/0)return;H.setup(B,X,Q,G,fe);let It,At=ct;if(fe!==null&&(It=J.get(fe),At=We,At.setIndex(It)),B.isMesh)X.wireframe===!0?(Qe.setLineWidth(X.wireframeLinewidth*Bt()),At.setMode(O.LINES)):At.setMode(O.TRIANGLES);else if(B.isLine){let Ze=X.linewidth;Ze===void 0&&(Ze=1),Qe.setLineWidth(Ze*Bt()),B.isLineSegments?At.setMode(O.LINES):B.isLineLoop?At.setMode(O.LINE_LOOP):At.setMode(O.LINE_STRIP)}else B.isPoints?At.setMode(O.POINTS):B.isSprite&&At.setMode(O.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Ur("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),At.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(_t.get("WEBGL_multi_draw"))At.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ze=B._multiDrawStarts,Ft=B._multiDrawCounts,xt=B._multiDrawCount,tn=fe?J.get(fe).bytesPerElement:1,qi=ot.get(X).currentProgram.getUniforms();for(let sn=0;sn<xt;sn++)qi.setValue(O,"_gl_DrawID",sn),At.render(Ze[sn]/tn,Ft[sn])}else if(B.isInstancedMesh)At.renderInstances(Ne,Et,B.count);else if(G.isInstancedBufferGeometry){const Ze=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ft=Math.min(G.instanceCount,Ze);At.renderInstances(Ne,Et,Ft)}else At.render(Ne,Et)};function Nn(S,U,G){S.transparent===!0&&S.side===wt&&S.forceSinglePass===!1?(S.side=In,S.needsUpdate=!0,xn(S,U,G),S.side=Es,S.needsUpdate=!0,xn(S,U,G),S.side=wt):xn(S,U,G)}this.compile=function(S,U,G=null){G===null&&(G=S),v=it.get(G),v.init(U),E.push(v),G.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),S!==G&&S.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),v.setupLights();const X=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const oe=B.material;if(oe)if(Array.isArray(oe))for(let ae=0;ae<oe.length;ae++){const Q=oe[ae];Nn(Q,G,B),X.add(Q)}else Nn(oe,G,B),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(S,U,G=null){const X=this.compile(S,U,G);return new Promise(B=>{function oe(){if(X.forEach(function(ae){ot.get(ae).currentProgram.isReady()&&X.delete(ae)}),X.size===0){B(S);return}setTimeout(oe,10)}_t.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Cn=null;function ci(S){Cn&&Cn(S)}function no(){wi.stop()}function Qa(){wi.start()}const wi=new of;wi.setAnimationLoop(ci),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(S){Cn=S,ze.setAnimationLoop(S),S===null?wi.stop():wi.start()},ze.addEventListener("sessionstart",no),ze.addEventListener("sessionend",Qa),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){ln("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(U),U=ze.getCamera()),S.isScene===!0&&S.onBeforeRender(T,S,U,b),v=it.get(S,E.length),v.init(U),E.push(v),Pe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),$.setFromProjectionMatrix(Pe,Fi,U.reversedDepth),we=this.localClippingEnabled,Z=Ye.init(this.clippingPlanes,we),y=Fe.get(S,_.length),y.init(),_.push(y),ze.enabled===!0&&ze.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&Si(oe,U,-1/0,T.sortObjects)}Si(S,U,0,T.sortObjects),y.finish(),T.sortObjects===!0&&y.sort($e,I),at=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,at&&Le.addToRenderList(y,S),this.info.render.frame++,Z===!0&&Ye.beginShadows();const G=v.state.shadowsArray;_e.render(G,S,U),Z===!0&&Ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,B=y.transmissive;if(v.setupLights(),U.isArrayCamera){const oe=U.cameras;if(B.length>0)for(let ae=0,Q=oe.length;ae<Q;ae++){const fe=oe[ae];er(X,B,S,fe)}at&&Le.render(S);for(let ae=0,Q=oe.length;ae<Q;ae++){const fe=oe[ae];Ti(y,S,fe,fe.viewport)}}else B.length>0&&er(X,B,S,U),at&&Le.render(S),Ti(y,S,U);b!==null&&w===0&&(Mt.updateMultisampleRenderTarget(b),Mt.updateRenderTargetMipmap(b)),S.isScene===!0&&S.onAfterRender(T,S,U),H.resetDefaultState(),L=-1,D=null,E.pop(),E.length>0?(v=E[E.length-1],Z===!0&&Ye.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?y=_[_.length-1]:y=null};function Si(S,U,G,X){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)v.pushLight(S),S.castShadow&&v.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||$.intersectsSprite(S)){X&&nt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Pe);const ae=ge.update(S),Q=S.material;Q.visible&&y.push(S,ae,Q,G,nt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||$.intersectsObject(S))){const ae=ge.update(S),Q=S.material;if(X&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),nt.copy(S.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),nt.copy(ae.boundingSphere.center)),nt.applyMatrix4(S.matrixWorld).applyMatrix4(Pe)),Array.isArray(Q)){const fe=ae.groups;for(let De=0,Ve=fe.length;De<Ve;De++){const Ie=fe[De],Ne=Q[Ie.materialIndex];Ne&&Ne.visible&&y.push(S,ae,Ne,G,nt.z,Ie)}}else Q.visible&&y.push(S,ae,Q,G,nt.z,null)}}const oe=S.children;for(let ae=0,Q=oe.length;ae<Q;ae++)Si(oe[ae],U,G,X)}function Ti(S,U,G,X){const{opaque:B,transmissive:oe,transparent:ae}=S;v.setupLightsView(G),Z===!0&&Ye.setGlobalState(T.clippingPlanes,G),X&&Qe.viewport(V.copy(X)),B.length>0&&aa(B,U,G),oe.length>0&&aa(oe,U,G),ae.length>0&&aa(ae,U,G),Qe.buffers.depth.setTest(!0),Qe.buffers.depth.setMask(!0),Qe.buffers.color.setMask(!0),Qe.setPolygonOffset(!1)}function er(S,U,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new yi(1,1,{generateMipmaps:!0,type:_t.has("EXT_color_buffer_half_float")||_t.has("EXT_color_buffer_float")?Ni:Hi,minFilter:Ws,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:kt.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],ae=X.viewport||V;oe.setSize(ae.z*T.transmissionResolutionScale,ae.w*T.transmissionResolutionScale);const Q=T.getRenderTarget(),fe=T.getActiveCubeFace(),De=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),K=T.getClearAlpha(),K<1&&T.setClearColor(16777215,.5),T.clear(),at&&Le.render(G);const Ve=T.toneMapping;T.toneMapping=ws;const Ie=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),Z===!0&&Ye.setGlobalState(T.clippingPlanes,X),aa(S,G,X),Mt.updateMultisampleRenderTarget(oe),Mt.updateRenderTargetMipmap(oe),_t.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let pt=0,Et=U.length;pt<Et;pt++){const It=U[pt],{object:At,geometry:Ze,material:Ft,group:xt}=It;if(Ft.side===wt&&At.layers.test(X.layers)){const tn=Ft.side;Ft.side=In,Ft.needsUpdate=!0,io(At,G,X,Ze,Ft,xt),Ft.side=tn,Ft.needsUpdate=!0,Ne=!0}}Ne===!0&&(Mt.updateMultisampleRenderTarget(oe),Mt.updateRenderTargetMipmap(oe))}T.setRenderTarget(Q,fe,De),T.setClearColor(q,K),Ie!==void 0&&(X.viewport=Ie),T.toneMapping=Ve}function aa(S,U,G){const X=U.isScene===!0?U.overrideMaterial:null;for(let B=0,oe=S.length;B<oe;B++){const ae=S[B],{object:Q,geometry:fe,group:De}=ae;let Ve=ae.material;Ve.allowOverride===!0&&X!==null&&(Ve=X),Q.layers.test(G.layers)&&io(Q,U,G,fe,Ve,De)}}function io(S,U,G,X,B,oe){S.onBeforeRender(T,U,G,X,B,oe),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(T,U,G,X,S,oe),B.transparent===!0&&B.side===wt&&B.forceSinglePass===!1?(B.side=In,B.needsUpdate=!0,T.renderBufferDirect(G,U,X,B,S,oe),B.side=Es,B.needsUpdate=!0,T.renderBufferDirect(G,U,X,B,S,oe),B.side=wt):T.renderBufferDirect(G,U,X,B,S,oe),S.onAfterRender(T,U,G,X,B,oe)}function xn(S,U,G){U.isScene!==!0&&(U=Ht);const X=ot.get(S),B=v.state.lights,oe=v.state.shadowsArray,ae=B.state.version,Q=re.getParameters(S,B.state,oe,U,G),fe=re.getProgramCacheKey(Q);let De=X.programs;X.environment=S.isMeshStandardMaterial?U.environment:null,X.fog=U.fog,X.envMap=(S.isMeshStandardMaterial?R:F).get(S.envMap||X.environment),X.envMapRotation=X.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,De===void 0&&(S.addEventListener("dispose",ft),De=new Map,X.programs=De);let Ve=De.get(fe);if(Ve!==void 0){if(X.currentProgram===Ve&&X.lightsStateVersion===ae)return tr(S,Q),Ve}else Q.uniforms=re.getUniforms(S),S.onBeforeCompile(Q,T),Ve=re.acquireProgram(Q,fe),De.set(fe,Ve),X.uniforms=Q.uniforms;const Ie=X.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ie.clippingPlanes=Ye.uniform),tr(S,Q),X.needsLights=Y(S),X.lightsStateVersion=ae,X.needsLights&&(Ie.ambientLightColor.value=B.state.ambient,Ie.lightProbe.value=B.state.probe,Ie.directionalLights.value=B.state.directional,Ie.directionalLightShadows.value=B.state.directionalShadow,Ie.spotLights.value=B.state.spot,Ie.spotLightShadows.value=B.state.spotShadow,Ie.rectAreaLights.value=B.state.rectArea,Ie.ltc_1.value=B.state.rectAreaLTC1,Ie.ltc_2.value=B.state.rectAreaLTC2,Ie.pointLights.value=B.state.point,Ie.pointLightShadows.value=B.state.pointShadow,Ie.hemisphereLights.value=B.state.hemi,Ie.directionalShadowMap.value=B.state.directionalShadowMap,Ie.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Ie.spotShadowMap.value=B.state.spotShadowMap,Ie.spotLightMatrix.value=B.state.spotLightMatrix,Ie.spotLightMap.value=B.state.spotLightMap,Ie.pointShadowMap.value=B.state.pointShadowMap,Ie.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=Ve,X.uniformsList=null,Ve}function so(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=Jo.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function tr(S,U){const G=ot.get(S);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function N(S,U,G,X,B){U.isScene!==!0&&(U=Ht),Mt.resetTextureUnits();const oe=U.fog,ae=X.isMeshStandardMaterial?U.environment:null,Q=b===null?T.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Ga,fe=(X.isMeshStandardMaterial?R:F).get(X.envMap||ae),De=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ie=!!G.morphAttributes.position,Ne=!!G.morphAttributes.normal,pt=!!G.morphAttributes.color;let Et=ws;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(Et=T.toneMapping);const It=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,At=It!==void 0?It.length:0,Ze=ot.get(X),Ft=v.state.lights;if(Z===!0&&(we===!0||S!==D)){const kn=S===D&&X.id===L;Ye.setState(X,S,kn)}let xt=!1;X.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==Ft.state.version||Ze.outputColorSpace!==Q||B.isBatchedMesh&&Ze.batching===!1||!B.isBatchedMesh&&Ze.batching===!0||B.isBatchedMesh&&Ze.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ze.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ze.instancing===!1||!B.isInstancedMesh&&Ze.instancing===!0||B.isSkinnedMesh&&Ze.skinning===!1||!B.isSkinnedMesh&&Ze.skinning===!0||B.isInstancedMesh&&Ze.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ze.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ze.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ze.instancingMorph===!1&&B.morphTexture!==null||Ze.envMap!==fe||X.fog===!0&&Ze.fog!==oe||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==Ye.numPlanes||Ze.numIntersection!==Ye.numIntersection)||Ze.vertexAlphas!==De||Ze.vertexTangents!==Ve||Ze.morphTargets!==Ie||Ze.morphNormals!==Ne||Ze.morphColors!==pt||Ze.toneMapping!==Et||Ze.morphTargetsCount!==At)&&(xt=!0):(xt=!0,Ze.__version=X.version);let tn=Ze.currentProgram;xt===!0&&(tn=xn(X,U,B));let qi=!1,sn=!1,ei=!1;const Yt=tn.getUniforms(),gn=Ze.uniforms;if(Qe.useProgram(tn.program)&&(qi=!0,sn=!0,ei=!0),X.id!==L&&(L=X.id,sn=!0),qi||D!==S){Qe.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Yt.setValue(O,"projectionMatrix",S.projectionMatrix),Yt.setValue(O,"viewMatrix",S.matrixWorldInverse);const Wn=Yt.map.cameraPosition;Wn!==void 0&&Wn.setValue(O,Oe.setFromMatrixPosition(S.matrixWorld)),Vt.logarithmicDepthBuffer&&Yt.setValue(O,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Yt.setValue(O,"isOrthographic",S.isOrthographicCamera===!0),D!==S&&(D=S,sn=!0,ei=!0)}if(B.isSkinnedMesh){Yt.setOptional(O,B,"bindMatrix"),Yt.setOptional(O,B,"bindMatrixInverse");const kn=B.skeleton;kn&&(kn.boneTexture===null&&kn.computeBoneTexture(),Yt.setValue(O,"boneTexture",kn.boneTexture,Mt))}B.isBatchedMesh&&(Yt.setOptional(O,B,"batchingTexture"),Yt.setValue(O,"batchingTexture",B._matricesTexture,Mt),Yt.setOptional(O,B,"batchingIdTexture"),Yt.setValue(O,"batchingIdTexture",B._indirectTexture,Mt),Yt.setOptional(O,B,"batchingColorTexture"),B._colorsTexture!==null&&Yt.setValue(O,"batchingColorTexture",B._colorsTexture,Mt));const ti=G.morphAttributes;if((ti.position!==void 0||ti.normal!==void 0||ti.color!==void 0)&&ht.update(B,G,tn),(sn||Ze.receiveShadow!==B.receiveShadow)&&(Ze.receiveShadow=B.receiveShadow,Yt.setValue(O,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(gn.envMap.value=fe,gn.flipEnvMap.value=fe.isCubeTexture&&fe.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&U.environment!==null&&(gn.envMapIntensity.value=U.environmentIntensity),gn.dfgLUT!==void 0&&(gn.dfgLUT.value=bM()),sn&&(Yt.setValue(O,"toneMappingExposure",T.toneMappingExposure),Ze.needsLights&&k(gn,ei),oe&&X.fog===!0&&et.refreshFogUniforms(gn,oe),et.refreshMaterialUniforms(gn,X,ve,pe,v.state.transmissionRenderTarget[S.id]),Jo.upload(O,so(Ze),gn,Mt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Jo.upload(O,so(Ze),gn,Mt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Yt.setValue(O,"center",B.center),Yt.setValue(O,"modelViewMatrix",B.modelViewMatrix),Yt.setValue(O,"normalMatrix",B.normalMatrix),Yt.setValue(O,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const kn=X.uniformsGroups;for(let Wn=0,Ul=kn.length;Wn<Ul;Wn++){const Ls=kn[Wn];Ge.update(Ls,tn),Ge.bind(Ls,tn)}}return tn}function k(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function Y(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(S,U,G){const X=ot.get(S);X.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ot.get(S.texture).__webglTexture=U,ot.get(S.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const G=ot.get(S);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0};const ee=O.createFramebuffer();this.setRenderTarget=function(S,U=0,G=0){b=S,C=U,w=G;let X=!0,B=null,oe=!1,ae=!1;if(S){const fe=ot.get(S);if(fe.__useDefaultFramebuffer!==void 0)Qe.bindFramebuffer(O.FRAMEBUFFER,null),X=!1;else if(fe.__webglFramebuffer===void 0)Mt.setupRenderTarget(S);else if(fe.__hasExternalTextures)Mt.rebindTextures(S,ot.get(S.texture).__webglTexture,ot.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ie=S.depthTexture;if(fe.__boundDepthTexture!==Ie){if(Ie!==null&&ot.has(Ie)&&(S.width!==Ie.image.width||S.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Mt.setupDepthRenderbuffer(S)}}const De=S.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(ae=!0);const Ve=ot.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ve[U])?B=Ve[U][G]:B=Ve[U],oe=!0):S.samples>0&&Mt.useMultisampledRTT(S)===!1?B=ot.get(S).__webglMultisampledFramebuffer:Array.isArray(Ve)?B=Ve[G]:B=Ve,V.copy(S.viewport),j.copy(S.scissor),te=S.scissorTest}else V.copy(Ce).multiplyScalar(ve).floor(),j.copy(be).multiplyScalar(ve).floor(),te=Re;if(G!==0&&(B=ee),Qe.bindFramebuffer(O.FRAMEBUFFER,B)&&X&&Qe.drawBuffers(S,B),Qe.viewport(V),Qe.scissor(j),Qe.setScissorTest(te),oe){const fe=ot.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,G)}else if(ae){const fe=U;for(let De=0;De<S.textures.length;De++){const Ve=ot.get(S.textures[De]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+De,Ve.__webglTexture,G,fe)}}else if(S!==null&&G!==0){const fe=ot.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,fe.__webglTexture,G)}L=-1},this.readRenderTargetPixels=function(S,U,G,X,B,oe,ae,Q=0){if(!(S&&S.isWebGLRenderTarget)){ln("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ot.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe){Qe.bindFramebuffer(O.FRAMEBUFFER,fe);try{const De=S.textures[Q],Ve=De.format,Ie=De.type;if(!Vt.textureFormatReadable(Ve)){ln("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Vt.textureTypeReadable(Ie)){ln("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-X&&G>=0&&G<=S.height-B&&(S.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Q),O.readPixels(U,G,X,B,dt.convert(Ve),dt.convert(Ie),oe))}finally{const De=b!==null?ot.get(b).__webglFramebuffer:null;Qe.bindFramebuffer(O.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(S,U,G,X,B,oe,ae,Q=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ot.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe)if(U>=0&&U<=S.width-X&&G>=0&&G<=S.height-B){Qe.bindFramebuffer(O.FRAMEBUFFER,fe);const De=S.textures[Q],Ve=De.format,Ie=De.type;if(!Vt.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Vt.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ne),O.bufferData(O.PIXEL_PACK_BUFFER,oe.byteLength,O.STREAM_READ),S.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Q),O.readPixels(U,G,X,B,dt.convert(Ve),dt.convert(Ie),0);const pt=b!==null?ot.get(b).__webglFramebuffer:null;Qe.bindFramebuffer(O.FRAMEBUFFER,pt);const Et=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await sm(O,Et,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ne),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,oe),O.deleteBuffer(Ne),O.deleteSync(Et),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,G=0){const X=Math.pow(2,-G),B=Math.floor(S.image.width*X),oe=Math.floor(S.image.height*X),ae=U!==null?U.x:0,Q=U!==null?U.y:0;Mt.setTexture2D(S,0),O.copyTexSubImage2D(O.TEXTURE_2D,G,0,0,ae,Q,B,oe),Qe.unbindTexture()};const ie=O.createFramebuffer(),he=O.createFramebuffer();this.copyTextureToTexture=function(S,U,G=null,X=null,B=0,oe=null){oe===null&&(B!==0?(Ur("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=B,B=0):oe=0);let ae,Q,fe,De,Ve,Ie,Ne,pt,Et;const It=S.isCompressedTexture?S.mipmaps[oe]:S.image;if(G!==null)ae=G.max.x-G.min.x,Q=G.max.y-G.min.y,fe=G.isBox3?G.max.z-G.min.z:1,De=G.min.x,Ve=G.min.y,Ie=G.isBox3?G.min.z:0;else{const ti=Math.pow(2,-B);ae=Math.floor(It.width*ti),Q=Math.floor(It.height*ti),S.isDataArrayTexture?fe=It.depth:S.isData3DTexture?fe=Math.floor(It.depth*ti):fe=1,De=0,Ve=0,Ie=0}X!==null?(Ne=X.x,pt=X.y,Et=X.z):(Ne=0,pt=0,Et=0);const At=dt.convert(U.format),Ze=dt.convert(U.type);let Ft;U.isData3DTexture?(Mt.setTexture3D(U,0),Ft=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Mt.setTexture2DArray(U,0),Ft=O.TEXTURE_2D_ARRAY):(Mt.setTexture2D(U,0),Ft=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const xt=O.getParameter(O.UNPACK_ROW_LENGTH),tn=O.getParameter(O.UNPACK_IMAGE_HEIGHT),qi=O.getParameter(O.UNPACK_SKIP_PIXELS),sn=O.getParameter(O.UNPACK_SKIP_ROWS),ei=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,It.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,It.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,De),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ve),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ie);const Yt=S.isDataArrayTexture||S.isData3DTexture,gn=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const ti=ot.get(S),kn=ot.get(U),Wn=ot.get(ti.__renderTarget),Ul=ot.get(kn.__renderTarget);Qe.bindFramebuffer(O.READ_FRAMEBUFFER,Wn.__webglFramebuffer),Qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ul.__webglFramebuffer);for(let Ls=0;Ls<fe;Ls++)Yt&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ot.get(S).__webglTexture,B,Ie+Ls),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ot.get(U).__webglTexture,oe,Et+Ls)),O.blitFramebuffer(De,Ve,ae,Q,Ne,pt,ae,Q,O.DEPTH_BUFFER_BIT,O.NEAREST);Qe.bindFramebuffer(O.READ_FRAMEBUFFER,null),Qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||ot.has(S)){const ti=ot.get(S),kn=ot.get(U);Qe.bindFramebuffer(O.READ_FRAMEBUFFER,ie),Qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,he);for(let Wn=0;Wn<fe;Wn++)Yt?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ti.__webglTexture,B,Ie+Wn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ti.__webglTexture,B),gn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,kn.__webglTexture,oe,Et+Wn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,kn.__webglTexture,oe),B!==0?O.blitFramebuffer(De,Ve,ae,Q,Ne,pt,ae,Q,O.COLOR_BUFFER_BIT,O.NEAREST):gn?O.copyTexSubImage3D(Ft,oe,Ne,pt,Et+Wn,De,Ve,ae,Q):O.copyTexSubImage2D(Ft,oe,Ne,pt,De,Ve,ae,Q);Qe.bindFramebuffer(O.READ_FRAMEBUFFER,null),Qe.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else gn?S.isDataTexture||S.isData3DTexture?O.texSubImage3D(Ft,oe,Ne,pt,Et,ae,Q,fe,At,Ze,It.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Ft,oe,Ne,pt,Et,ae,Q,fe,At,It.data):O.texSubImage3D(Ft,oe,Ne,pt,Et,ae,Q,fe,At,Ze,It):S.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,oe,Ne,pt,ae,Q,At,Ze,It.data):S.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,oe,Ne,pt,It.width,It.height,At,It.data):O.texSubImage2D(O.TEXTURE_2D,oe,Ne,pt,ae,Q,At,Ze,It);O.pixelStorei(O.UNPACK_ROW_LENGTH,xt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,tn),O.pixelStorei(O.UNPACK_SKIP_PIXELS,qi),O.pixelStorei(O.UNPACK_SKIP_ROWS,sn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ei),oe===0&&U.generateMipmaps&&O.generateMipmap(Ft),Qe.unbindTexture()},this.initRenderTarget=function(S){ot.get(S).__webglFramebuffer===void 0&&Mt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Mt.setTextureCube(S,0):S.isData3DTexture?Mt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Mt.setTexture2DArray(S,0):Mt.setTexture2D(S,0),Qe.unbindTexture()},this.resetState=function(){C=0,w=0,b=null,Qe.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=kt._getDrawingBufferColorSpace(e),t.unpackColorSpace=kt._getUnpackColorSpace()}}function Xn(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),a={},r={},o=n[0].morphTargetsRelative,c=new jt;let h=0;for(let d=0;d<n.length;++d){const u=n[d];let m=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.attributes[p]),m++}if(m!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,d),h+=p}}if(t){let d=0;const u=[];for(let m=0;m<n.length;++m){const p=n[m].index;for(let x=0;x<p.count;++x)u.push(p.getX(x)+d);d+=n[m].attributes.position.count}c.setIndex(u)}for(const d in a){const u=Yu(a[d]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,u)}for(const d in r){const u=r[d][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let m=0;m<u;++m){const p=[];for(let M=0;M<r[d].length;++M)p.push(r[d][M][m]);const x=Yu(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function Yu(n){let e,t,i,s=-1,a=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=d.count*t}const r=new e(a),o=new jn(r,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const u=c/t;for(let m=0,p=d.count;m<p;m++)for(let x=0;x<t;x++){const M=d.getComponent(m,x);o.setComponent(m+u,x,M)}}else r.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class SM extends X0{constructor(){super();const e=new le;e.deleteAttribute("uv");const t=new W({side:In}),i=new W,s=new hd(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new z(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new rn(e,i,6),o=new Ut;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const c=new z(e,Ta(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new z(e,Ta(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new z(e,Ta(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new z(e,Ta(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const m=new z(e,Ta(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new z(e,Ta(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ta(n){return new Rx({color:0,emissive:16777215,emissiveIntensity:n})}const jo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ka{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const TM=new dd(-1,1,1,-1,0,1);class EM extends jt{constructor(){super(),this.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new St([0,2,0,0,2,0],2))}}const AM=new EM;class ud{constructor(e){this._mesh=new z(AM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,TM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class uf extends Ka{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Sn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Nr.clone(e.uniforms),this.material=new Sn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ud(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class $u extends Ka{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class CM extends Ka{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class RM{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Ue);this._width=i.width,this._height=i.height,t=new yi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ni}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new uf(jo),this.copyPass.material.blending=zi,this.clock=new rf}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,a=this.passes.length;s<a;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}$u!==void 0&&(r instanceof $u?i=!0:r instanceof CM&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class PM extends Ka{constructor(e,t,i=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new rt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const Uo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class LM extends Ka{constructor(){super(),this.uniforms=Nr.clone(Uo.uniforms),this.material=new Cx({name:Uo.name,uniforms:this.uniforms,vertexShader:Uo.vertexShader,fragmentShader:Uo.fragmentShader}),this._fsQuad=new ud(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},kt.getTransfer(this._outputColorSpace)===$t&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===w0?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===S0?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===T0?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Gh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===A0?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===C0?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===E0&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const DM={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new rt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Xa extends Ka{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ue(e.x,e.y):new Ue(256,256),this.clearColor=new rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new yi(a,r,{type:Ni}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new yi(a,r,{type:Ni});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const m=new yi(a,r,{type:Ni});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),a=Math.round(a/2),r=Math.round(r/2)}const o=DM;this.highPassUniforms=Nr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Sn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ue(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Nr.clone(jo.uniforms),this.blendMaterial=new Sn({uniforms:this.copyUniforms,vertexShader:jo.vertexShader,fragmentShader:jo.fragmentShader,blending:ai,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new rt,this._oldClearAlpha=1,this._basic=new Rt,this._fsQuad=new ud(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new Ue(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Xa.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Xa.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new Sn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ue(.5,.5)},direction:{value:new Ue(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new Sn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Xa.BlurDirectionX=new Ue(1,0);Xa.BlurDirectionY=new Ue(0,1);const Kr=document.querySelector("#game"),an=new wM({canvas:Kr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),Ja=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;an.setPixelRatio(Math.min(window.devicePixelRatio,Ja?1.5:2));an.setSize(window.innerWidth,window.innerHeight);an.shadowMap.enabled=!Ja;an.info.autoReset=!1;an.shadowMap.type=b0;an.outputColorSpace=Lt;an.toneMapping=Gh;an.toneMappingExposure=1.12;const Se=new X0;window.__steelRibbonScene=Se;Se.background=new rt(16764588);Se.fog=new nd(14719602,360,2150);const ff=new bh(an);ff.compileEquirectangularShader();Se.environment=ff.fromScene(new SM,.04).texture;Se.environmentIntensity=.58;const ye=new Zn(69,window.innerWidth/window.innerHeight,.08,1800);Se.add(ye);const Xe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const je=new Set,Ee={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},IM=new rf,nn=new P(0,1,0),fd=new P,pd=new P,Cl=new P,on=new Ut,pf=.86,Sh=1.2,FM=.78,Un=.55,Be={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ta=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],mf=Math.max(...ta.map(n=>n.width));let Ss=0,se=ta[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Xe.best.textContent=`Best score ${l.best}`;let _i=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Xi(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&_i==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}Xi();function UM(){_i=_i==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",_i),Xi(),l.message=_i==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const zo=[];function Oi(n,e=!1){let t=zo.find(s=>!s.busy);t||(zo.length>=4?t=zo[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),zo.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Tn(n=880,e=.16,t="triangle",i=.16){if(!Ae)return;const{ctx:s}=Ae,a=s.createOscillator(),r=s.createGain();a.type=t,a.frequency.setValueAtTime(n,s.currentTime),a.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),r.gain.setValueAtTime(i,s.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),a.connect(r).connect(Ae.master||s.destination),a.start(),a.stop(s.currentTime+e+.06)}let Zu=0;function zM(){if(!Ae||Ae.ctx.currentTime-Zu<.45)return;Zu=Ae.ctx.currentTime;const{ctx:n}=Ae,e=[352,396,440][Math.random()*3|0];for(const[t,i]of[[0,.14],[.2,.22]]){const s=n.createOscillator(),a=n.createOscillator(),r=n.createGain(),o=n.currentTime+t;s.type="square",a.type="square",s.frequency.value=e,a.frequency.value=e*1.26,r.gain.setValueAtTime(1e-4,o),r.gain.linearRampToValueAtTime(.05,o+.015),r.gain.setValueAtTime(.05,o+i),r.gain.exponentialRampToValueAtTime(1e-4,o+i+.04),s.connect(r),a.connect(r),r.connect(Ae.master),s.start(o),a.start(o),s.stop(o+i+.05),a.stop(o+i+.05)}}function NM(n){const e=xe.clamp(n,0,1);return e*e*(3-2*e)}function kM(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,a=i.start+i.carry,r=i.end+i.settle;e>=s&&e<=a?t+=i.rise*xe.clamp((e-s)/(i.approach+i.carry),0,1):e>a&&e<=i.end?t+=i.rise:e>i.end&&e<=r&&(t+=i.rise*(1-NM((e-i.end)/i.settle)))}return t}function md(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,a=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,r=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:a,z:r,t:i,n:t}}function xf(n,e){const{t,n:i}=md(n,e),s=n.shape;let a=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const r of n.ramps){let o=i-r.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),a+=r.amp*Math.exp(-(o*o)/(r.width*r.width))}return a+=kM(n,i),a}function No(n){const{x:e,z:t,n:i}=md(se,n),s=xf(se,i);return new P(e,s,t)}function mt(n){const e=(n%se.length+se.length)%se.length,t=No(e),i=No(e+2).sub(t).normalize(),s=fd.crossVectors(nn,i).normalize(),a=No(e-2).y,r=No(e+2).y,o=Math.atan2(r-a,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function Bi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Ku(n){return xe.clamp(n/(se.length*se.laps),0,1)}function vc(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let a=i;a<=s;a++){const r=a*se.length+t;if(n<r&&e>=r)return!0}return!1}function OM(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let r=0;r<e;r++)for(let o=0;o<e;o++)i.fillStyle=(o+r)%2?"#101318":"#f5f1df",i.fillRect(o*s,r*s,s,s);const a=new en(t);return a.colorSpace=Lt,a.wrapS=zn,a.wrapT=zn,a.repeat.set(3,1),a}function BM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let a=0;a<n;a+=64)t.beginPath(),t.moveTo(0,a+2),t.lineTo(n,a+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const a of[48,464])t.beginPath(),t.moveTo(a,0),t.lineTo(a,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let a=0;a<42;a++){const r=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(r,o),t.bezierCurveTo(r+Math.random()*22-11,o+36,r+Math.random()*22-11,o+82,r+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let a=0;a<36;a++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let a=0;a<2200;a++){const r=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${r}, ${r}, ${r-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function VM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<120;a++){const r=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(r,o,0,r,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(r,o,c,0,Math.PI*2),t.fill()}for(let a=0;a<9e3;a++){const r=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${r})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let a=-n;a<n*1.5;a+=76)t.beginPath(),t.moveTo(a,0),t.lineTo(a+n*.65,n),t.stroke();const s=new en(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(18,18),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function GM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<26e3;a++){const r=Math.random()<.48;t.fillStyle=r?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let a=0;a<24;a++){let r=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(r,o);for(let c=0;c<7;c++)r+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(r,o);t.stroke()}const s=new en(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(9,16),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function HM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new en(e);return s.colorSpace=Lt,s}function Aa(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let r=10;r<e-8;r+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,r,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let r=0;r<n;r+=15)s.beginPath(),s.moveTo(r+3,0),s.lineTo(r+3,e),s.stroke();const a=new en(i);return a.colorSpace=Lt,a}function WM(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.58,"#f0e5d2"),a.addColorStop(1,"#b9b0a1"),s.fillStyle=a,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const r=(c,h,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+u-2),s.moveTo(c+2,h+u*.52),s.lineTo(c+d-2,h+u*.52),s.stroke()};r(n*.12,e*.24,n*.19,e*.2),r(n*.68,e*.25,n*.2,e*.2),r(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new en(i);return o.colorSpace=Lt,o.wrapS=zn,o.wrapT=zn,o.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),o}function XM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let a=-20;a<n+20;a+=26){t.beginPath();for(let r=-10;r<n+10;r+=12){const o=a+Math.sin((r+a)*.045)*3;r===-10?t.moveTo(r,o):t.lineTo(r,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let a=0;a<n;a+=20)t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+8,n*.24,a-8,n*.58,a+7,n),t.stroke();for(let a=0;a<1400;a++){const r=112+Math.random()*110;t.fillStyle=`rgba(${r}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Lt,s.wrapS=zn,s.wrapT=zn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function qM(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let r=18;r<e;r+=24)i.beginPath(),i.moveTo(8,r),i.lineTo(n-8,r),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const a=new en(t);return a.colorSpace=Lt,a}function Ju(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const a=s.getContext("2d"),{width:r,height:o}=s;a.fillStyle=t,a.fillRect(0,0,r,o),a.strokeStyle=e,a.lineWidth=i?5:6,a.strokeRect(8,8,r-16,o-16),a.save(),a.translate(r/2,o/2),i&&a.rotate(-Math.PI/2),a.font=`900 ${i?54:48}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=e,a.shadowBlur=18,a.fillStyle=e,a.fillText(n,0,0),a.restore();const c=new en(s);return c.colorSpace=Lt,c}const gs=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],dl=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],vs=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function gf(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,640,256);a.addColorStop(0,"#111722"),a.addColorStop(.55,"#20344a"),a.addColorStop(1,"#171024"),s.fillStyle=a,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const r=new en(i);return r.colorSpace=Lt,r.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),r}function Mc(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new en(t);return s.colorSpace=Lt,s}function _c(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const a=s.getContext("2d"),r=a.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.55,"#b96a55"),r.addColorStop(1,"#633428"),a.fillStyle=r,a.fillRect(0,0,n,e),a.strokeStyle="rgba(50, 24, 18, 0.42)",a.lineWidth=2;for(let c=18;c<e;c+=22){a.beginPath(),a.moveTo(0,c),a.lineTo(n,c),a.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)a.beginPath(),a.moveTo(h,c-18),a.lineTo(h,c),a.stroke()}a.fillStyle="rgba(17, 24, 31, 0.92)",a.fillRect(34,e*.58,n-68,e*.28),a.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)a.fillRect(c,e*.62,52,e*.19);a.fillStyle=i,a.fillRect(22,e*.49,n-44,34),a.fillStyle="#f7f4df",a.font="900 42px Arial Black, Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.shadowColor=i,a.shadowBlur=12,a.fillText("OPEN",n/2,e*.28,n*.76),a.shadowBlur=0;const o=new en(s);return o.colorSpace=Lt,o.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),o}function YM(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let a=18;a<e;a+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,a,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,a+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let a=0;a<n;a+=64)i.beginPath(),i.moveTo(a,0),i.lineTo(a,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new en(t);return s.colorSpace=Lt,s.anisotropy=Math.min(16,an.capabilities.getMaxAnisotropy()),s}function $M(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,a=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*a,d=s+Math.sin(c)*a;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const r=new en(e);return r.colorSpace=Lt,r}function ce(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function Ca(n,e,t,i){const s=t*.5,a=i*.5;let r=ce(n,e);for(const o of[-s,0,s])for(const c of[-a,0,a])r=Math.min(r,ce(n+o,e+c));return r}function Rl(n,e,t=10){const{x0:i,x1:s,zNear:a,zFar:r,pitch:o,streetW:c}=Be;if(n<i-c||n>s+c||e<r-c||e>a+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((a-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const ys={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Ln(n,e,t,i,s=8){const{x0:a,x1:r,zNear:o,zFar:c,pitch:h,streetW:d}=Be,u=t*.5,m=i*.5,p=d*.5+s;let x=null;const M=(g,f,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:f,overlap:y})};for(let g=a;g<=r+1;g+=h){if(e+m<c-p||e-m>o+p)continue;const f=u+p-Math.abs(n-g);f>0&&M("x",Math.round(g),f)}for(let g=o;g>=c-1;g-=h){if(n+u<a-p||n-u>r+p)continue;const f=m+p-Math.abs(e-g);f>0&&M("z",Math.round(g),f)}return x}const na=[],vf=[],Mn={spots:[],im:null,imW:null};function Mf(n=1){const e=new Sn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return vf.push(e),e}function _f(n,e,t,i=t,s=null){na.push({x:n,z:e,rx:t,rz:i,waterY:s})}function Ks(n,e){let t=0,i=null;for(const s of na){const a=(n-s.x)/s.rx,r=(e-s.z)/s.rz,o=a*a+r*r;if(o<1){let c=Math.pow(1-o,1.35);s.waterY!=null&&(c*=xe.clamp((s.waterY-ce(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const Ua=[],yc=[],xd=[];let ul=0;function pn(n,e){return xd.push({obj:n,update:e}),n}function yf(n){ul+=n;for(const e of xd)e.update(ul,n)}function Pl(){if(yc.length===0)for(let n=0;n<ta.length;n++){const e=ta[n];for(let t=0;t<e.length;t+=14){const i=md(e,t);yc.push({x:i.x,y:xf(e,t),z:i.z,s:t,courseIndex:n})}}return yc}function En(n,e,t=0){let i=null,s=1/0;for(const a of Pl()){const r=n-a.x,o=e-a.z,c=Math.hypot(r,o);c<s&&(s=c,i=a)}return{clearance:s-t-mf*.58,distance:s,nearestS:i?.s??0}}function Bs(n,e,t,i,s,a=9){const r=t*.5,o=i*.5,c=mf*.62+a;let h=null;for(const d of Pl()){const u=Math.max(Math.abs(d.x-n)-r,0),m=Math.max(Math.abs(d.z-e)-o,0),p=Math.hypot(u,m)-c;if(p>0)continue;const x=d.y-2.8,M=s-x;M<=0||(!h||M-p>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:p,verticalIntrusion:M,score:M-p})}return h}function fi(n,e,t,i=96){for(let s=0;s<i;s++){const a=n(s);if(En(a.x,a.z,e).clearance>=t&&!Ln(a.x,a.z,e*2,e*2,3.5))return a}return null}function pi(n,e,t,i,s){const a=En(e,t,i);Ua.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(a.clearance),nearestS:Math.round(a.nearestS)})}function ZM(){const n=[...Ua].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:Ua.length,unsafe:Ua.filter(e=>e.clearance<e.margin),closest:n}}function Gn(n,e,t,i,s){const a=e.clone().add(t).multiplyScalar(.5),r=t.clone().sub(e),o=new z(new qe(i,i,r.length(),8),s);return o.position.copy(a),o.quaternion.setFromUnitVectors(nn,r.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}const mn={cloudMats:[],glowMats:[]};function KM(){const n=new Dx(16757626,3097190,.66);Se.add(n);const e=new uc(7179775,.6);e.position.set(260,145,-260),Se.add(e);const t=new uc(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Se.add(t);const i=new uc(16742973,.5);i.position.set(-180,35,280),Se.add(i);const s=new hd(5556479,90,900,2);s.position.set(0,88,-920),Se.add(s),mn.hemi=n,mn.fill=e,mn.key=t,mn.rim=i}let mi=null;function JM(){const n=new P(-310,150,230).normalize();mi=new z(new Ot(1200,48,32),new Sn({side:In,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0},uRain:{value:0}},vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,fragmentShader:`
        varying vec3 vDir;
        uniform vec3 uSunDir;
        uniform float uDay;
        uniform float uNight;
        uniform float uRain;
        vec3 pal(vec3 dusk, vec3 day, vec3 night) {
          return mix(mix(dusk, day, uDay), night, uNight);
        }
        void main() {
          float h = clamp(vDir.y, -0.08, 1.0);
          // vertical gradient blended across dusk / day / night palettes
          vec3 zenith  = pal(vec3(0.06, 0.09, 0.24),  vec3(0.16, 0.38, 0.72), vec3(0.012, 0.015, 0.05));
          vec3 upper   = pal(vec3(0.2, 0.24, 0.47),   vec3(0.35, 0.56, 0.86), vec3(0.02, 0.03, 0.09));
          vec3 band    = pal(vec3(0.56, 0.36, 0.47),  vec3(0.56, 0.72, 0.9),  vec3(0.045, 0.055, 0.13));
          vec3 horizon = pal(vec3(0.95, 0.66, 0.44),  vec3(0.8, 0.88, 0.96),  vec3(0.09, 0.09, 0.17));
          vec3 col = mix(horizon, band, smoothstep(0.0, 0.09, h));
          col = mix(col, upper, smoothstep(0.06, 0.26, h));
          col = mix(col, zenith, smoothstep(0.2, 0.62, h));
          // scattering lobe around the sun (a cool moon halo at night)
          float sunAmt = max(dot(vDir, uSunDir), 0.0);
          col += pal(vec3(1.0, 0.58, 0.28), vec3(1.0, 0.95, 0.85), vec3(0.5, 0.6, 0.8)) * pow(sunAmt, 5.0) * pal(vec3(0.5), vec3(0.25), vec3(0.1)).x;
          col += pal(vec3(1.0, 0.78, 0.5), vec3(1.0, 1.0, 0.95), vec3(0.7, 0.8, 1.0)) * pow(sunAmt, 26.0) * pal(vec3(0.8), vec3(0.5), vec3(0.3)).x;
          // opposite-side cool deepening keeps the far sky moody
          float away = max(dot(vDir, -uSunDir), 0.0);
          float awayAmt = pal(vec3(0.42), vec3(0.15), vec3(0.5)).x;
          col = mix(col, pal(vec3(0.14, 0.15, 0.32), vec3(0.3, 0.42, 0.62), vec3(0.02, 0.025, 0.06)), awayAmt * pow(away, 1.6) * (1.0 - h * 0.4));
          // storm overcast: flatten toward gray, darker at night
          col = mix(col, vec3(0.42, 0.45, 0.5) * (0.28 + 0.62 * (1.0 - uNight)), uRain * 0.72);
          gl_FragColor = vec4(col, 1.0);
        }`})),mi.renderOrder=-100,mi.frustumCulled=!1,Se.add(mi);const e=n,t=new Rt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new z(new _n(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),mi.add(i);const s=new Rt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:ai});for(const[a,r]of[[120,.2],[250,.085],[520,.035]]){const o=new z(new _n(a,48),s.clone());o.material.opacity=r,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),mi.add(o),mn.glowMats.push({mat:o.material,dusk:r})}mn.skyU=mi.material.uniforms,mn.sunMat=t}function jM(){const n=new W({map:VM(),color:8231526,roughness:.98,metalness:.02}),e=new z(new zt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let m=0;m<t.count;m++){const p=t.getX(m),x=t.getY(m);t.setZ(m,ce(p,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Se.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:wt});for(let m=0;m<3;m++){const p=150-m*190,x=-760-m*420,M=980,g=64+m*18,f=new z(new zt(980,64+m*18,1,1),i.clone());f.rotation.x=-Math.PI/2,f.rotation.z=-.34+m*.03,f.position.set(p,Ca(p,x,M,g)-.55,x),f.renderOrder=-4,Se.add(f)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let m=0;m<46;m++){const p=28+Math.random()*90,x=-900+Math.random()*1800,M=-260-Math.random()*1780,g=[ce(x,M)];for(let y=0;y<6;y++)g.push(ce(x+Math.cos(y)*p*.9,M+Math.sin(y*1.9)*p*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const f=new z(new _n(p,9),s[m%s.length]);f.rotation.x=-Math.PI/2,f.rotation.z=Math.random()*Math.PI,f.position.set(x,Math.max(...g)+.07,M),f.scale.y=.32+Math.random()*.5,f.receiveShadow=!0,Se.add(f)}const a=new Rt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let m=0;m<32;m++){const p=new z(new _n(70+Math.random()*150,22),a.clone());p.material.opacity=.008+Math.random()*.014,p.rotation.x=-Math.PI/2,p.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),p.position.y<8&&ys.lowFogDisks++,p.scale.y=.22+Math.random()*.26,p.renderOrder=-6,Se.add(p)}const r=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],o=new W({color:15068905,roughness:.95});for(let m=0;m<52;m++){const p=78+Math.random()*180,x=52+Math.random()*115,M=fi(f=>{const y=m/52*Math.PI*2+f*1.77,v=1380+Math.random()*820+f*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!M)continue;const g=new z(new Li(x,p,5+Math.floor(Math.random()*2)),r[m%r.length]);if(g.position.set(M.x,-9,M.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Se.add(g),pi("mountain",M.x,M.z,x,480),p>160){const f=new z(new Li(x*.34,p*.22,5),o);f.position.copy(g.position).add(new P(0,p*.39,0)),f.rotation.y=g.rotation.y,Se.add(f)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const m=new qe(.28,.42,1,6).translate(0,.5,0),p=Xn([new Li(2.7,5.4,7).translate(0,1.9,0),new Li(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Li(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new rt(v)),M=new rn(m,c,185),g=new rn(p,new W({roughness:.92}),185),f=new Ut;let y=0;for(let v=0;v<185;v++){const _=.58+Math.random()*1.05,E=8*_,T=fi(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!T)continue;const{x:A,z:C}=T;if(Rl(A,C,18))continue;const w=ce(A,C)+.8,b=2.2+Math.random()*3.8;f.position.set(A,w,C),f.rotation.y=Math.random()*Math.PI,f.scale.set(_,b,_),f.updateMatrix(),M.setMatrixAt(y,f.matrix),f.position.set(A,w+b,C),f.scale.set(_,_,_),f.updateMatrix(),g.setMatrixAt(y,f.matrix),g.setColorAt(y,x[v%3]),y++,pi("tree",A,C,E,145)}M.count=y,g.count=y,M.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Se.add(M),Se.add(g)}{const m=x=>{const M=document.createElement("canvas");M.width=256,M.height=128;const g=M.getContext("2d"),f=(v,_)=>Math.sin(x*_+v*37.7)*.5+.5;for(let v=0;v<16;v++){const _=v/15,E=Math.sin(_*Math.PI),T=24+_*208,A=66+(f(v,53)-.5)*22*E,C=(18+f(v,29)*22)*(.45+E*.75),w=g.createRadialGradient(T,A-C*.18,0,T,A,C);w.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),w.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),w.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=w,g.beginPath(),g.arc(T,A,C,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const _=.12+v/9*.76,E=_*256,T=20+f(v,71)*16,A=g.createRadialGradient(E,92,0,E,92,T);A.addColorStop(0,"rgba(255, 176, 128, 0.22)"),A.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=A,g.beginPath(),g.arc(E,92,T,0,Math.PI*2),g.fill()}const y=new en(M);return y.colorSpace=Lt,y},p=[m(1),m(2),m(3)];Me.cloudSprites=0;for(let x=0;x<44;x++){const M=new bl({map:p[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new ol(M),f=170+Math.random()*280;g.scale.set(f,f*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Se.add(g),Me.cloudSprites++,pn(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let m=0;m<44;m++){const p=new tt,x=20+Math.random()*95,M=8+Math.random()*18,g=8+Math.random()*18,f=new z(new le(M,x,g),h[m%h.length]);f.position.y=x/2,f.castShadow=!0,f.receiveShadow=!0,p.add(f);const y=Aa(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const A of[-1,1]){const C=new z(new zt(M*.82,x*.74),v);C.position.set(0,x*.53,A*(g/2+.08)),C.rotation.y=A<0?Math.PI:0,p.add(C)}const _=new z(new le(M*1.08,1.2,g*1.08),d);if(_.position.y=x+.7,p.add(_),Math.random()<.32){const A=new z(new qe(.18,.3,10+Math.random()*12,8),d);A.position.y=x+6.5,p.add(A)}const E=Math.hypot(M,g)*.65,T=fi(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);T&&(p.position.set(T.x,Ca(T.x,T.z,M,g)-.7,T.z),p.rotation.y=Math.random()*Math.PI,Se.add(p),pi("building",T.x,T.z,E,240))}const u=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let m=0;m<18;m++){const p=new tt,x=gs[m%gs.length],M=dl[(m*3+1)%dl.length],g=vs[m%vs.length],f=new W({map:gf(x,M,g),color:16777215,roughness:.22,metalness:.04,emissive:new rt(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,_=new z(new le(y,v,.5),f);_.position.y=10,p.add(_);const E=new z(new le(y+1.2,.32,.75),u);E.position.y=10+v*.5+.25,p.add(E);for(const A of[-7,7]){const C=new z(new qe(.24,.32,10,8),u);C.position.set(A,5,-.2),p.add(C)}const T=fi(()=>({x:-780+Math.random()*1560,z:-450-m*135+Math.random()*80-40}),22,175,50);T&&(p.position.set(T.x,ce(T.x,T.z)+.5,T.z),p.rotation.y=-.35+Math.random()*.7,Se.add(p),pi("billboard",T.x,T.z,22,175),Vs("roadside-billboard",T.x,p.position.y+10,T.z))}}function QM(){for(let f=0;f<3;f++){const y=[4012638,5326704,7035525][f],v=new Rt({color:y,transparent:!0,opacity:.6-f*.14,depthWrite:!1,fog:!1}),_=60,E=5200,T=new zt(E,360,_,1),A=T.attributes.position;for(let w=0;w<=_;w++){const b=w/_,L=(Math.sin(b*22+f*3)*.5+Math.sin(b*9+f)*.5)*70+120;A.setY(w,L),A.setY(w+_+1,-180)}A.needsUpdate=!0;const C=new z(T,v);C.position.set(0,40,-2300-f*360),Se.add(C)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let f=0;f<48;f++){const y=.7+Math.random()*1.2,v=9*y,_=fi(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!_)continue;const{x:E,z:T}=_;if(Rl(E,T,18))continue;const A=ce(E,T)+.6,C=new tt,w=2.6+Math.random()*3.4,b=new z(new qe(.34,.5,w,6),n);b.position.y=w/2,C.add(b);const L=e[Math.floor(Math.random()*e.length)],D=3+Math.floor(Math.random()*3);for(let V=0;V<D;V++){const j=2.4+Math.random()*1.8,te=new z(new Ot(j,9,7),L);te.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,C.add(te)}C.position.set(E,A,T),C.scale.setScalar(y),Se.add(C),pi("tree",E,T,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:wt}),new W({color:9077368,roughness:1,flatShading:!0,side:wt}),new W({color:6249043,roughness:1,flatShading:!0,side:wt})];for(let f=0;f<70;f++){const y=2+Math.random()*7,v=fi(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:_,z:E}=v,T=new z(new ld(y,0),t[f%t.length]),A=T.geometry.attributes.position;for(let C=0;C<A.count;C++)A.setXYZ(C,A.getX(C)*(.8+Math.random()*.4),A.getY(C)*(.6+Math.random()*.4),A.getZ(C)*(.8+Math.random()*.4));A.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(_,ce(_,E)+y*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Se.add(T),gi.push({kind:"rock",x:_,z:E,radius:y*1.12}),pi("rock",_,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let f=0;f<14;f++){const y=130+Math.random()*200,v=130+Math.random()*200,_=fi(()=>{for(let L=0;L<6;L++){const D=-1500+Math.random()*3e3,V=-700-Math.random()*1700,j=[ce(D,V),ce(D+y*.45,V+v*.45),ce(D-y*.45,V+v*.45),ce(D+y*.45,V-v*.45),ce(D-y*.45,V-v*.45)];if(Math.max(...j)-Math.min(...j)<1)return{x:D,z:V}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!_||_.x>9e4)continue;const{x:E,z:T}=_,A=new tt,C=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let L=0;L<C;L++){const D=new W({color:L%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),V=new z(new zt(y,v/C),D);V.rotation.x=-Math.PI/2,V.position.set(0,.05,-v/2+(L+.5)*(v/C)),A.add(V)}const b=Math.max(ce(E,T),ce(E+y*.45,T+v*.45),ce(E-y*.45,T+v*.45),ce(E+y*.45,T-v*.45),ce(E-y*.45,T-v*.45));A.position.set(E,b+.06,T),A.rotation.y=Math.random()*Math.PI,Se.add(A),pi("field",E,T,Math.max(y,v)*.5,40)}{const f=fi(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(f){const y=[ce(f.x,f.z)];for(let E=0;E<8;E++)y.push(ce(f.x+Math.cos(E/8*Math.PI*2)*110,f.z+Math.sin(E/8*Math.PI*2)*74),ce(f.x+Math.cos(E/8*Math.PI*2)*200,f.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,T)=>E-T);const v=y[4]+.4,_=new z(new _n(150,48),Mf(9));_.rotation.x=-Math.PI/2,_.position.set(f.x,v,f.z),_.scale.set(1.5,1,1),_.renderOrder=-4,Se.add(_),_f(f.x,f.z,222,148,v),ys.waterBlockers++,pi("lake",f.x,f.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let f=0;f<9;f++){const y=f/9*Math.PI*2+.6,v=1500+Math.random()*700,_=Math.cos(y)*v,E=Math.sin(y)*v-1150,T=60+Math.random()*40,A=new tt,C=new z(new qe(1.1,2.2,T,10),s);C.position.y=T/2,A.add(C);const w=new tt;w.position.set(0,T,3);const b=new z(new le(3,3,7),s);w.add(b);const L=new tt;L.position.z=3.5;for(let V=0;V<3;V++){const j=new z(new le(1.1,26,.5),s);j.position.y=13;const te=new tt;te.add(j),te.rotation.z=V/3*Math.PI*2,L.add(te)}w.add(L),A.add(w),A.position.set(_,-8,E),A.rotation.y=Math.random()*Math.PI,Se.add(A);const D=.5+Math.random()*.5;pn(L,V=>{L.rotation.z=V*D})}const a=new W({color:7041398,roughness:.6,metalness:.4}),r=new ll({color:2764595,transparent:!0,opacity:.5});let o=null;for(let f=0;f<7;f++){const y=-1100+f*360,v=-1650-Math.sin(f*.7)*120,_=48,E=new tt,T=6;for(const C of[-1,1])for(const w of[-1,1]){const b=new z(new qe(.4,.7,_,5),a);b.position.set(C*T,_/2,w*T),b.rotation.z=-C*.08,b.rotation.x=w*.08,E.add(b)}for(const C of[_*.6,_*.82,_]){const w=new z(new le(T*4,.8,.8),a);w.position.y=C,E.add(w)}E.position.set(y,ce(y,v)-2,v),Se.add(E);const A=ce(y,v)-2+_;if(o)for(const C of[-T*2,0,T*2]){const w=o.x+C,b=o.z,L=y+C,D=v,V=[],j=12;for(let q=0;q<=j;q++){const K=q/j,ne=Math.sin(K*Math.PI)*6;V.push(new P(w+(L-w)*K,o.y-ne+(A-o.y)*K,b+(D-b)*K))}const te=new vh(new jt().setFromPoints(V),r);Se.add(te)}o={x:y,y:A,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let f=0;f<5;f++){const y=fi(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:_}=y,E=70+Math.random()*50,T=new tt,A=8;for(let L=0;L<A;L++){const D=new z(new qe(.5,.7,E/A,4),L%2?h:c);D.position.y=(L+.5)*(E/A),D.rotation.y=Math.PI/4,T.add(D)}const C=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new z(new Ot(1.1,10,8),C);w.position.y=E+1,T.add(w),T.position.set(v,ce(v,_),_),Se.add(T),pi("mast",v,_,8,120);const b=Math.random()*Math.PI*2;pn(w,L=>{C.emissiveIntensity=Math.sin(L*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let f=0;f<6;f++){const y=new tt,v=d[f%d.length],_=new W({map:f_(v[0],v[1]),roughness:.5,metalness:.05,emissive:new rt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new z(new Ot(11,20,16),_);E.scale.y=1.25,y.add(E);const T=new z(new le(3.4,3,3.4),new W({color:8014371,roughness:.9}));T.position.y=-17,y.add(T);const A=new ll({color:3811866});for(const D of[-1,1])for(const V of[-1,1]){const j=new vh(new jt().setFromPoints([new P(D*1.6,-15.5,V*1.6),new P(D*7,-3,V*7)]),A);y.add(j)}const C=-700+Math.random()*1400,w=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(C,b,w),Se.add(y);const L=Math.random()*Math.PI*2;pn(y,D=>{y.position.y=b+Math.sin(D*.5+L)*6,y.position.x=C+Math.sin(D*.08+L)*90,y.rotation.z=Math.sin(D*.4+L)*.04})}const u=new Rt({color:2829104,side:wt,fog:!1});function m(){const f=new od;return f.moveTo(0,0),f.lineTo(-2.6,1.1),f.lineTo(-2.2,.2),f.lineTo(0,.5),f.lineTo(2.2,.2),f.lineTo(2.6,1.1),f.lineTo(0,0),new z(new Tl(f),u)}for(let f=0;f<5;f++){const y=new tt,v=5+Math.floor(Math.random()*5),_=[];for(let L=0;L<v;L++){const D=m(),V=L%2?1:-1,j=Math.ceil(L/2);D.position.set(V*j*5,-j*2.4,0),D.rotation.x=-Math.PI/2,y.add(D),_.push(D)}const E=150+Math.random()*120,T=-500-Math.random()*1400,A=18+Math.random()*14,C=1400,w=-700+Math.random()*1400;y.position.set(w,E,T),Se.add(y);const b=Math.random()*Math.PI*2;pn(y,(L,D)=>{y.position.x+=A*D,y.position.x>C&&(y.position.x=-C);const V=Math.sin(L*6+b);for(const j of _)j.rotation.x=-Math.PI/2+V*.4})}{const f=new tt,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new z(new Ot(20,20,16),y);v.scale.set(2.6,1,1),f.add(v);const _=new W({color:13781835,roughness:.6});for(let w=0;w<3;w++){const b=new z(new le(10,9,.6),_);b.position.x=-46,b.rotation.x=w/3*Math.PI*2,f.add(b)}const E=new z(new le(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,f.add(E);const T=new z(new zt(40,10),new Rt({map:vd("STEEL RIBBON"),transparent:!0,side:wt}));T.position.set(60,0,0),f.add(T);const A=900,C=240;f.position.set(0,C,-1200),Se.add(f),pn(f,w=>{const b=w*.05;f.position.x=Math.cos(b)*A,f.position.z=-1200+Math.sin(b)*A*.5,f.position.y=C+Math.sin(w*.3)*8,f.rotation.y=-b+Math.PI/2})}const p=new Rt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let f=0;f<14;f++){const y=new z(new zt(220+Math.random()*360,16+Math.random()*22),p.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Se.add(y);const v=2+Math.random()*3;pn(y,(_,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),M=new Rt({map:p_(),side:wt});for(let f=0;f<4;f++){const y=fi(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:_}=y,E=new tt,T=60+Math.random()*40,A=new z(new le(T,1.4,26),x);A.position.set(0,26,-4),A.rotation.x=-.32,E.add(A);const C=new z(new zt(T*.94,24),M);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const w of[-T/2,T/2]){const b=new z(new le(1.4,26,1.4),x);b.position.set(w,13,-8),E.add(b)}E.position.set(v,ce(v,_),_),E.rotation.y=Math.atan2(-v,-_)+(Math.random()-.5)*.5,Se.add(E),pi("grandstand",v,_,40,30)}const g=[16731486,16765503,16777215,11824127];for(let f=0;f<90;f++){const y=fi(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:_}=y,E=new tt,T=g[Math.floor(Math.random()*g.length)],A=new Rt({color:T,side:wt}),C=5+Math.floor(Math.random()*6);for(let w=0;w<C;w++){const b=new z(new _n(.5+Math.random()*.4,5),A);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,ce(v,_),_),Se.add(E),pi("flowers",v,_,3,20)}}const un=[],ii=[];let Th=0;const gi=[],sa=[],An=[],Ra=[],Ts=[],za=[],Me={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},fl=[];function Vs(n,e,t,i){Me.signs++,fl.length<160&&fl.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function us(n,e,t=1){Me[n][e]=(Me[n][e]||0)+t}let ko=null,ju=null;function Ll(){return ko||(ko=new W({vertexColors:!0,roughness:.42,metalness:.22}),ko.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},ju=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:ko,glass:ju}}const fs=new rt;function ut(n,e,t,i=0,s=1){const a=n.clone();e&&a.applyMatrix4(e);const r=a.attributes.position.count,o=new Float32Array(r*3),c=new Float32Array(r*3);fs.set(t??16777215);for(let h=0;h<r;h++)o[h*3]=fs.r,o[h*3+1]=fs.g,o[h*3+2]=fs.b;if(i){fs.set(i).multiplyScalar(s);for(let h=0;h<r;h++)c[h*3]=fs.r,c[h*3+1]=fs.g,c[h*3+2]=fs.b}return a.setAttribute("color",new St(o,3)),a.setAttribute("aEmissive",new St(c,3)),a}function bt(n,e,t,i=0){return(i?new yt().makeRotationZ(i):new yt).setPosition(n,e,t)}function Jr(n,e){const t=new tt,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:a,glass:r}=Ll(),o=n==="taxi"?16767293:e,c=new rt(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(ut(new le(s.w,s.h,s.l),bt(0,.95,0),o)),(s.bus?d:h).push(ut(new le(s.cabin[0],s.cabin[1],s.cabin[2]),bt(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(ut(new le(s.cabin[0]*.78,s.cabin[1]*.55,.08),bt(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(ut(new le(.08,s.cabin[1]*.5,s.cabin[2]*.48),bt(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(ut(new le(s.w*.94,.58,s.l*.38),bt(0,1.2,1.35),c)),s.box&&h.push(ut(new le(s.box[0],s.box[1],s.box[2]),bt(0,1.55,1.25),15130833)),s.bus){h.push(ut(new le(s.w+.06,.28,s.l*.86),bt(0,1.38,0),c));const y=new le(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const _ of[-1,1])d.push(ut(y,bt(_*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(ut(new le(1,.24,.46),bt(0,2.2,-.35),16774310,16765773,.9));const u=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],m=[],p=Xn([ut(new qe(.42,.42,.36,14),bt(0,0,0,Math.PI/2),395016),ut(new qe(.18,.18,.38,10),bt(0,0,0,Math.PI/2),14147041)],!1),x=new le(.3,.34,1.12);for(const y of u)for(const v of[-s.w*.54,s.w*.54]){const _=new z(p,a);_.position.set(v,.45,y),t.add(_),m.push(_),h.push(ut(x,bt(v*1.02,.72,y),1250072))}const M=new le(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(ut(M,bt(0,.62,y),1250072));const g=new le(.42,.2,.1),f=new le(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(ut(g,bt(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(ut(f,bt(y,.98,s.l*.52+.04),16725033,16717325,1.45));if(s.bus){const y=[11893070,9657655,13018202,8541761][(e>>>4)%4],v=-s.cabin[0]*.27,_=s.cabinZ-s.cabin[2]/2+.55;h.push(ut(new Ot(.155,8,6),bt(v,2.06,_),y));const E=new Ot(.145,8,5);E.scale(1,.55,1),h.push(ut(E,bt(v,2.18,_),1119001))}return t.add(new z(Xn(h,!1),a)),d.length&&t.add(new z(Xn(d,!1),r)),t.userData={wheels:m,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55,plateHalfL:s.l/2,hasDriver:!!s.bus},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function gd(n,e){const t=new tt,{opaque:i}=Ll(),s=new Ot(.25,8,5);s.scale(1,.5,1),t.add(new z(Xn([ut(new qe(.28,.34,.95,8),bt(0,1.35,0),n),ut(new Ot(.24,10,8),bt(0,2.02,0),12947299),ut(s,bt(0,2.17,0),1119001)],!1),i));const a=[],r=ut(new qe(.075,.09,.78,6),null,e),o=ut(new qe(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new z(r,i);h.position.set(c,.58,0),t.add(h),a.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new z(o,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),a.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=a,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}const Qu="BCDFGHJKLMNPRSTVWXZ",e_=["FCK","SHT","DCK","CNT","KKK","WTF","FML","NGR","FGT","SLT","DMN","BTC","JZZ"],Oo=340;function bf(n){let e=n>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}let Bo=null;function t_(){if(Bo)return Bo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<64;s++){const a=bf(335585+s*2654435761);let r="";do{r="";for(let d=0;d<3;d++)r+=Qu[a()*Qu.length|0]}while(e_.includes(r));r+=" ";for(let d=0;d<3;d++)r+=a()*10|0;t.push(r);const o=s%8*128,c=(s/8|0)*64,h=s%9===3;e.fillStyle=h?"#f3d268":"#ece9dc",e.fillRect(o+6,c+8,116,48),e.strokeStyle="#25304d",e.lineWidth=3,e.strokeRect(o+7.5,c+9.5,113,45),e.fillStyle="#1c2848",e.textAlign="center",e.textBaseline="middle",e.font="bold 30px 'Courier New', monospace",e.fillText(r,o+64,c+38),e.font="bold 10px sans-serif",e.fillText("STEEL STATE",o+64,c+17)}const i=new en(n);return i.colorSpace=Lt,i.anisotropy=4,Bo={texture:i,texts:t},Bo}const n_=new P(1,1,1),bc=new yt,Vo=new yt,Di={mesh:null,texts:null,statics:[],dynamics:[],_zero:new yt().makeScale(0,0,0),ensure(){if(this.mesh)return;const{texture:n,texts:e}=t_();this.texts=e;const t=new zt(.55,.17);t.setAttribute("aPlateSlot",new gh(new Float32Array(Oo*2),2));const i=new Rt({map:n});i.customProgramCacheKey=()=>"plate-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aPlateSlot;
varying vec2 vPlateUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vPlateUv = uv * 0.125 + aPlateSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vPlateUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vPlateUv );")},this.mesh=new rn(t,i,Oo),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!1;for(let s=0;s<Oo;s++)this.mesh.setMatrixAt(s,this._zero);Se.add(this.mesh)},_slot(n){const e=n%64;return{u:e%8*.125,v:(7-(e/8|0))*.125,s:e}},_offsets(n,e=.03){return{offF:new yt().makeRotationY(Math.PI).setPosition(0,.62,-(n+e)),offR:new yt().setPosition(0,.62,n+e)}},resetStatic(){this.ensure(),this.statics.length=0;for(let n=0;n<260;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},resetDynamic(){this.ensure(),this.dynamics.length=0;for(let n=260;n<Oo;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},addStatic(n,e,t,i){if(this.ensure(),this.statics.length>=130)return;const s=this.statics.length*2,{u:a,v:r,s:o}=this._slot(t*13+29),c={matrix:n.clone(),spot:i,wasTaken:null,iF:s,iR:s+1,slot:o,...this._offsets(e)},h=this.mesh.geometry.getAttribute("aPlateSlot");h.setXY(c.iF,a,r),h.setXY(c.iR,a,r),h.needsUpdate=!0,this.statics.push(c),this._applyStatic(c)},_applyStatic(n){n.wasTaken=!!(n.spot&&n.spot.taken),n.wasTaken?(this.mesh.setMatrixAt(n.iF,this._zero),this.mesh.setMatrixAt(n.iR,this._zero)):(this.mesh.setMatrixAt(n.iF,Vo.multiplyMatrices(n.matrix,n.offF)),this.mesh.setMatrixAt(n.iR,Vo.multiplyMatrices(n.matrix,n.offR))),this.mesh.instanceMatrix.needsUpdate=!0},addDynamic(n,e){if(this.ensure(),this.dynamics.length>=40)return;const t=260+this.dynamics.length*2,{u:i,v:s,s:a}=this._slot(e*37+11),r=this.mesh.geometry.getAttribute("aPlateSlot");r.setXY(t,i,s),r.setXY(t+1,i,s),r.needsUpdate=!0,this.dynamics.push({carMesh:n,iF:t,iR:t+1,slot:a,...this._offsets(n.userData.plateHalfL||2.2,.155)})},update(){if(!(!this.mesh||!this.dynamics.length)){for(const n of this.dynamics)bc.compose(n.carMesh.position,n.carMesh.quaternion,n_),this.mesh.setMatrixAt(n.iF,Vo.multiplyMatrices(bc,n.offF)),this.mesh.setMatrixAt(n.iR,Vo.multiplyMatrices(bc,n.offR));for(const n of this.statics)!!(n.spot&&n.spot.taken)!==n.wasTaken&&this._applyStatic(n);this.mesh.instanceMatrix.needsUpdate=!0}}},Eh=40,e0=[[["running late again","me"],["the ribbon jam??","them"],["every. time.","me"]],[["pizza tonight?","them"],["obviously","me"],["extra olives","them"]],[["did u see that stunt","me"],["the triple flip?!","them"],["unreal","me"]],[["buy milk pls","them"],["on it","me"],["and cookies","them"]],[["gate 8 is glowing","me"],["on my way!!","them"]],[["new high score","me"],["screenshot or it","them"],["didn't happen","them"]],[["taxi 27 honked at me","me"],["classic 27","them"]],[["lost my parking spot","me"],["someone STOLE it??","them"],["drove right off","me"]]];let Go=null;function i_(){if(Go)return Go;const n=document.createElement("canvas");n.width=512,n.height=512;const e=n.getContext("2d");for(let i=0;i<8;i++){const s=i%4*128,a=(i/4|0)*256,r=e0[i%e0.length];e.fillStyle="#101823",e.fillRect(s,a,128,256),e.fillStyle="#1c2a3a",e.fillRect(s,a,128,26),e.fillStyle="#9fd6ff",e.font="bold 14px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("chat",s+64,a+14),e.font="bold 16px sans-serif",e.textAlign="left";let o=a+42;for(const[c,h]of r){const d=h==="me",u=Math.min(116,e.measureText(c).width+14),m=d?s+124-u:s+4;e.fillStyle=d?"#2f7fd4":"#2a3546",e.beginPath(),e.roundRect(m,o,u,34,10),e.fill(),e.fillStyle="#eaf4ff",e.fillText(c,m+7,o+18),o+=42}}const t=new en(n);return t.colorSpace=Lt,t.anisotropy=4,Go={texture:t,mat:new Rt({map:t})},Go}const Pa={kits:null,pool:0,_timer:0,ensure(){if(this.kits)return;this.pool=Ja?4:8;const{opaque:n}=Ll(),e=[1976625,3153952,5985575,2503224,4400680,1710618,5124895,3355970],t=[9067082,7952701,10707786,8341813,9067082,7952701,10707786,8341813],i=[3087378,1975326,4022546,3087378,1975326,4022546,3087378,1975326];this.kits=[];for(let s=0;s<this.pool;s++){const a=[],r=new Ot(.038,6,5),o=new le(.078,.02,.02),c=new Ot(.03,6,5),h=new le(.09,.022,.02);for(const b of[-.085,.085])a.push(ut(r,bt(b,2.06,-.198),1842476)),a.push(ut(o,bt(b,2.118,-.207),i[s%i.length]));a.push(ut(c,bt(0,2,-.229),11893070)),a.push(ut(h,bt(0,1.935,-.216),t[s%t.length]));const d=new z(Xn(a,!1),n),u=ut(new Ot(.056,6,5),null,12947299),m=ut(new le(.13,.07,.24),null,e[s%e.length]),p=new z(u,n),x=new z(u,n),M=new z(m,n),g=new z(m,n);p.position.set(0,-.38,0),x.position.set(0,-.38,0),M.position.set(0,-.42,-.045),g.position.set(0,-.42,-.045);const f=i_(),y=new tt,v=new z(ut(new le(.075,.15,.014),null,1315356),n),_=new zt(.062,.128),E=s%4*.25,T=1-((s/4|0)+1)*.5,A=_.attributes.uv;for(let b=0;b<A.count;b++)A.setXY(b,E+A.getX(b)*.25,T+A.getY(b)*.5);const C=new z(_,f.mat);C.position.z=.0095,y.add(v),y.add(C),y.position.set(.34,1.47,-.36),y.quaternion.setFromUnitVectors(new P(0,0,1),new P(-.34,.55,.36).normalize());const w={face:d,handL:p,handR:x,shoeL:M,shoeR:g,phone:y,texting:!1,ped:null};for(const b of[d,p,x,M,g,y,v,C])b.userData.kitPart=!0,b.castShadow=!1,b.receiveShadow=!0;this.kits.push(w)}},attach(n,e,t){const i=e.mesh,s=i.userData.limbs||[];i.add(n.face),s[0]?.mesh.add(n.shoeL),s[1]?.mesh.add(n.shoeR),s[2]?.mesh.add(n.handL),s[3]?.mesh.add(n.handR),n.texting=!!t,n.texting&&i.add(n.phone),n.ped=e},detach(n){for(const e of[n.face,n.handL,n.handR,n.shoeL,n.shoeR,n.phone])e.removeFromParent();n.ped=null,n.texting=!1},reset(){if(this.kits)for(const n of this.kits)n.ped&&this.detach(n)},promotedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.ped?1:0),0):0},update(n){if(!Ts.length){this.reset();return}if(this.kits){for(const o of this.kits)if(o.ped&&o.texting){const c=o.ped.mesh.userData.limbs?.[3]?.mesh;c&&(c.rotation.x=-2.05,c.position.y=1.33)}}if(this._timer-=n,this._timer>0)return;this._timer=.35,this.ensure();const e=ye.position.x,t=ye.position.z,i=Eh*Eh,s=[];for(let o=0;o<Ts.length;o++){const c=Ts[o];if(!c.active||!c.mesh.visible)continue;const h=c.x-e,d=c.z-t,u=h*h+d*d;u<i&&s.push({a:c,idx:o,d2:u})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool),r=new Set(a.map(o=>o.a));for(const o of this.kits)o.ped&&(!r.has(o.ped)||!o.ped.active||!o.ped.mesh.visible)&&this.detach(o);for(const o of a){const c=this.kits[o.idx%this.pool];c.ped!==o.a&&(c.ped&&r.has(c.ped)||(c.ped&&this.detach(c),this.attach(c,o.a,o.idx%3===0)))}}};let Ho=null;function s_(){if(Ho)return Ho;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<8;s++){const a=s%4*256,r=(s/4|0)*256,o=(s*97+13)%90+10;t.push(o),e.fillStyle="#14203a",e.textAlign="center",e.textBaseline="middle",e.font="bold 88px sans-serif",e.fillText(`TAXI ${o}`,a+128,r+96),e.font="bold 34px sans-serif",e.fillText("STEEL CITY CAB",a+128,r+178)}const i=new en(n);return i.colorSpace=Lt,i.anisotropy=4,Ho={texture:i,nums:t,mat:new Rt({map:i,transparent:!0,alphaTest:.25})},Ho}const Ah={pool:null,used:0,ensure(){if(this.pool)return;const n=s_();this.pool=[];for(let e=0;e<8;e++){const t=e%4*.25,i=1-((e/4|0)+1)*.5,s=[];for(const[r,o]of[[-.585,Math.PI],[-.115,0]]){const c=new zt(.94,.2),h=c.attributes.uv;for(let d=0;d<h.count;d++)h.setXY(d,t+h.getX(d)*.25,i+.25+h.getY(d)*.25);o&&c.rotateY(o),c.translate(0,2.2,r),s.push(c)}for(const[r,o]of[[1.13,Math.PI/2],[-1.13,-Math.PI/2]]){const c=new zt(.62,.3),h=c.attributes.uv;for(let d=0;d<h.count;d++)h.setXY(d,t+h.getX(d)*.25,i+h.getY(d)*.5);c.rotateY(o),c.translate(r,1.05,-.2),s.push(c)}const a=new z(Xn(s,!1),n.mat);a.castShadow=!1,a.receiveShadow=!1,a.userData.taxiSign=e,this.pool.push(a)}},reset(){if(this.pool)for(const n of this.pool)n.removeFromParent();this.used=0},attach(n){this.ensure(),!(this.used>=this.pool.length)&&n.add(this.pool[this.used++])},count(){return this.pool?this.pool.reduce((n,e)=>n+(e.parent?1:0),0):0}};let Wo=null;function a_(){if(Wo)return Wo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=(a,r,o)=>{const d=["#e8a45c","#7fb8d8","#e8c087","#c77bd8"][o],u=["#ffdba4","#c8ecff","#ffe9c4","#ffb3ec"][o],m=e.createLinearGradient(a,r,a,r+224);m.addColorStop(0,u),m.addColorStop(.55,d),m.addColorStop(1,["#8a5a2c","#3f6c86","#8a6a3c","#6c3f86"][o]),e.fillStyle=m,e.fillRect(a,r,512,224),e.strokeStyle="#221a14",e.lineWidth=10,e.strokeRect(a+5,r+5,502,214),e.lineWidth=4,e.beginPath(),e.moveTo(a+512/2,r),e.lineTo(a+512/2,r+224),e.moveTo(a,r+224/2),e.lineTo(a+512,r+224/2),e.stroke(),e.fillStyle="rgba(255, 230, 180, 0.85)";for(let p=a+60;p<a+512-40;p+=110)e.fillRect(p,r+8,3,26),e.beginPath(),e.moveTo(p-12,r+34),e.lineTo(p+15,r+34),e.lineTo(p+1.5,r+48),e.fill();if(e.fillStyle="rgba(10, 8, 12, 0.88)",o===0)for(let p=a+70;p<a+512-60;p+=150)e.fillRect(p,r+150,74,8),e.fillRect(p+33,r+158,8,52),e.fillRect(p-18,r+168,26,42),e.fillRect(p+66,r+168,26,42);else if(o===1)for(let p=a+50;p<a+512-60;p+=90)e.fillRect(p,r+60,12,60),e.fillRect(p-14,r+76,40,10),e.beginPath(),e.arc(p+6,r+180,26,0,7),e.fill();else if(o===2){for(const p of[80,130,180])e.fillRect(a+40,r+p,432,8);e.fillStyle="rgba(30, 22, 16, 0.9)";for(const p of[56,106,156])for(let x=a+56;x<a+512-70;x+=44)e.fillRect(x,r+p,26,22)}else for(let p=a+60;p<a+512-80;p+=120)e.fillRect(p,r+90,62,120),e.fillStyle=["#4ff3ff","#ff4fb7","#68ff8f"][(p/120|0)%3],e.fillRect(p+10,r+104,42,34),e.fillStyle="rgba(10, 8, 12, 0.88)"};t(0,0,0),t(512,0,1),t(0,224,2),t(512,224,3);const i=(a,r,o,c,h)=>{e.fillStyle=c,e.fillRect(a+4,452,r-8,56),e.strokeStyle=h,e.lineWidth=3,e.strokeRect(a+7,455,r-14,50),e.fillStyle=h,e.font="900 26px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(o,a+r/2,481,r-24)};i(0,150,"OPEN","#1d3a24","#7dffa5"),i(150,150,"CLOSED","#3a1d1d","#ff8d7d"),i(300,190,"BACK IN 5","#33301d","#ffe27d");const s=new en(n);return s.colorSpace=Lt,s.anisotropy=4,Wo={texture:s,mat:new Rt({map:s})},Wo}const Xs={spots:[],kits:null,pool:0,_timer:0,resetSpots(){if(this.spots.length=0,this.kits)for(const n of this.kits)n.group.visible=!1,n.spot=null},addSpot(n,e,t,i,s){this.spots.push({x:n,y:e,z:t,yaw:i,w:s})},ensure(){if(this.kits)return;this.pool=Ja?2:4;const n=a_();this.kits=[];for(let e=0;e<this.pool;e++){const t=new tt,i=e%2*.5,s=e<2?.5625:.125,a=new zt(5.6,1.9),r=a.attributes.uv;for(let y=0;y<r.count;y++)r.setXY(y,i+r.getX(y)*.5,s+r.getY(y)*.4375);const o=new z(a,n.mat);o.position.set(-.7,1.55,.06),t.add(o);const c=new z(new le(1.3,2.3,.03),new W({color:15326941,roughness:.7,metalness:.05}));c.position.set(2.75,1.15,.03),t.add(c);const h=new z(new le(1.02,2.14,.05),new W({color:5910302,roughness:.55,metalness:.15}));h.position.set(2.75,1.07,.05),t.add(h);const d=new z(new zt(.6,.8),new W({color:10217727,roughness:.1,metalness:.1,emissive:2963258,emissiveIntensity:.5}));d.position.set(2.75,1.5,.081),t.add(d);const u=new z(new le(.035,.17,.045),new W({color:13092431,roughness:.3,metalness:.85}));u.position.set(3.14,1.02,.09),t.add(u);const m=[150,150,190][e%3]/150,p=new zt(.34*m,.14),x=p.attributes.uv,M=[0,150/1024,300/1024][e%3],g=[150/1024,150/1024,190/1024][e%3];for(let y=0;y<x.count;y++)x.setXY(y,M+x.getX(y)*g,(4+x.getY(y)*56)/512);const f=new z(p,n.mat);f.position.set(2.75,.62,.085),t.add(f),t.traverse(y=>(y.castShadow=!1,y.receiveShadow=!1,y.userData.dressKit=!0)),t.visible=!1,Se.add(t),this.kits.push({group:t,spot:null})}},dressedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.spot?1:0),0):0},update(n){if(!this.spots.length||(this._timer-=n,this._timer>0))return;this._timer=.4,this.ensure();const e=ye.position.x,t=ye.position.z,i=2025,s=[];for(const o of this.spots){const c=o.x-e,h=o.z-t,d=c*c+h*h;d<i&&s.push({s:o,d2:d})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool).map(o=>o.s),r=new Set(a);for(const o of this.kits)o.spot&&!r.has(o.spot)&&(o.spot=null,o.group.visible=!1);for(const o of a){if(this.kits.some(h=>h.spot===o))continue;const c=this.kits.find(h=>!h.spot);if(!c)break;c.spot=o,c.group.position.set(o.x,o.y,o.z),c.group.rotation.y=o.yaw,c.group.scale.setScalar(Math.min(1,o.w*.72/7)),c.group.visible=!0}}},Ai={meshes:null,counts:{hydrants:0,meters:0,benches:0,cans:0},sample:[]};function r_(n,e,t,i,s,a,r,o){const{opaque:c}=Ll(),h=Xn([ut(new qe(.11,.13,.1,6),bt(0,.05,0),2894892),ut(new qe(.09,.1,.34,6),bt(0,.27,0),15021620),ut(new Ot(.095,6,4),bt(0,.47,0),15021620),ut(new qe(.035,.035,.3,6),bt(0,.33,0,Math.PI/2),13840175),ut(new qe(.03,.03,.08,6),bt(0,.56,0),16765778)],!1),d=Xn([ut(new qe(.024,.03,1.04,6),bt(0,.52,0),3092306),ut(new le(.15,.22,.09),bt(0,1.13,0),5395032),ut(new le(.11,.1,.02),bt(0,1.16,-.047),13036239)],!1),u=Xn([ut(new le(.14,.42,.42),bt(-.62,.21,0),2432796),ut(new le(.14,.42,.42),bt(.62,.21,0),2432796),ut(new le(.12,.62,.06),bt(-.62,.7,.21),2432796),ut(new le(.12,.62,.06),bt(.62,.7,.21),2432796),ut(new le(1.55,.05,.16),bt(0,.44,-.12),9130315),ut(new le(1.55,.05,.16),bt(0,.44,.08),9130315),ut(new le(1.55,.16,.05),bt(0,.68,.2),9130315),ut(new le(1.55,.16,.05),bt(0,.9,.22),9130315)],!1),m=Xn([ut(new qe(.19,.16,.52,8),bt(0,.26,0),3225437),ut(new qe(.2,.2,.05,8),bt(0,.55,0),4936027),ut(new qe(.13,.13,.03,8),bt(0,.57,0),1118996)],!1),p=[{key:"hydrants",geo:h,cap:46},{key:"meters",geo:d,cap:60},{key:"benches",geo:u,cap:33},{key:"cans",geo:m,cap:46}];if(Ai.meshes)for(const v of Ai.meshes)v.removeFromParent(),v.geometry.dispose();Ai.meshes=[],Ai.sample=[];const x={},M=new Ut,g=bf(61453);for(const v of p){const _=new rn(v.geo,c,v.cap);_.frustumCulled=!1,_.castShadow=!1,_.receiveShadow=!0,_.userData.furniture=v.key,_.userData.used=0,x[v.key]=_,Ai.meshes.push(_),n.add(_)}const f=(v,_,E,T)=>{const A=x[v];A.userData.used>=A.count||(M.position.set(_,ce(_,E)+.02,E),M.rotation.y=T,M.updateMatrix(),A.setMatrixAt(A.userData.used++,M.matrix),Ai.sample.length<8&&Ai.sample.push({key:v,x:+_.toFixed(1),z:+E.toFixed(1)}))},y=(v,_)=>{const E=v?i+9:e+9,T=v?s-9:t-9;for(let A=E;A<=T;A+=15+g()*10){const C=v?Math.abs((A-s)%a+a)%a:Math.abs((A-e)%a+a)%a;if(C<13||C>a-13)continue;const w=g()<.5?-1:1,b=w*(r*.66+1.35),L=v?_+b:A,D=v?A:_+b;if(o(L,D,.6).clearance<.8)continue;const V=g();V<.27?f("hydrants",L,D,g()*6.28):V<.58?f("meters",L,D,v?w*Math.PI*.5:w>0?Math.PI:0):V<.76?f("benches",L,D,v?w*Math.PI*.5:w>0?Math.PI:0):f("cans",L,D,g()*6.28)}};for(let v=e;v<=t+1;v+=a)y(!0,Math.round(v));for(let v=s;v>=i-1;v-=a)y(!1,Math.round(v));for(const v of p){const _=x[v.key];_.count=_.userData.used,_.instanceMatrix.needsUpdate=!0,Ai.counts[v.key]=_.userData.used}}function o_(n,e,t){const{X0:i,X1:s,ZN:a,ZF:r,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],m=[],p=30,x=[],M=[];for(let I=i;I<=s+1;I+=o)x.push(Math.round(I));for(let I=a;I>=r-1;I-=o)M.push(Math.round(I));M.sort((I,Ce)=>I-Ce);const g=x[0],f=x[x.length-1],y=M[0],v=M[M.length-1];An.length=0,Ra.length=0,Ts.length=0,za.length=0,Me.traffic=0,Me.pedestrians=0,Me.types={},Me.turns=0,Me.splats=0,Me.trafficCrashes=0,Me.streetLights=0,Me.trafficLights=0,Me.stopSigns=0,Di.resetDynamic(),Pa.reset(),Ah.reset();const _=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*c*.23,T=(I,Ce)=>{let be=0,Re=1/0;for(let $=0;$<I.length;$++){const Z=Math.abs(I[$]-Ce);Z<Re&&(Re=Z,be=$)}return be},A=(I,Ce,be)=>{const Re=I==="ns"?M:x;if(be>0){for(const $ of Re)if($>Ce+.05)return $;return Re[Re.length-1]}for(let $=Re.length-1;$>=0;$--)if(Re[$]<Ce-.05)return Re[$];return Re[0]},C=I=>{const Ce=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+Ce,z:I.along}:{x:I.along,z:I.road+Ce}},w=I=>{if(l.mode!=="roam")return null;const Ce=C(I);if(Math.abs(l.roamPos.y-(ce(Ce.x,Ce.z)+Un))>4.2)return null;const be=I.axis==="ns"?0:I.dir,Re=I.axis==="ns"?I.dir:0,$=l.roamPos.x-Ce.x,Z=l.roamPos.z-Ce.z,we=$*be+Z*Re,Pe=I.axis==="ns"?$:Z,Oe=Math.abs(Pe),nt=Math.hypot($,Z),Ht=I.mesh?.userData?.colliderHalfW||2,at=I.mesh?.userData?.colliderHalfD||3;return nt<Dn+Math.max(Ht,at)*.55||we>-1.5&&we<at+4.2&&Oe<Dn+Ht*.85?{crash:!0}:we>0&&we<30&&Oe<c*.36?{avoidOffset:(Pe>=0?-1:1)*I.maxAvoidOffset,stop:we<13&&Oe<Dn+Ht*.95}:null},b=(I,Ce)=>`${Math.round(I)},${Math.round(Ce)}`,L=(I,Ce)=>{const be=((Ce+I.phase)%15.5+15.5)%15.5;return be<6.2?"ns":be<7.4?"yellow-ns":be<13.6?"ew":"yellow-ew"},D=(I,Ce)=>{const be=I.axis==="ns"?I.road:I.next,Re=I.axis==="ns"?I.next:I.road,$=b(be,Re),Z=h.get($);if(!Z)return null;if(Z.type==="signal"){const we=L(Z,Ce),Pe=we===`yellow-${I.axis}`;return we===I.axis&&!Pe?null:{control:Z,key:$,kind:"signal"}}return Z.type==="stop"&&I.lastControlKey!==$?{control:Z,key:$,kind:"stop"}:null},V=(I,Ce=!1)=>{const be=I.axis,Re=I.along,$=be==="ns"?x:M,Z=I.road,we=T($,Z),Pe=[],Oe=be==="ns"?y:g,nt=be==="ns"?v:f;!Ce&&Re+I.dir*o>=Oe&&Re+I.dir*o<=nt&&Pe.push({axis:be,road:I.road,along:Re,dir:I.dir,turn:!1}),we>0&&Pe.push({axis:be==="ns"?"ew":"ns",road:Re,along:Z,dir:-1,turn:!0}),we<$.length-1&&Pe.push({axis:be==="ns"?"ew":"ns",road:Re,along:Z,dir:1,turn:!0}),Pe.length||Pe.push({axis:be,road:I.road,along:Re,dir:-I.dir,turn:!0});const Ht=Pe.filter(Bt=>Bt.turn),at=!Ce&&Ht.length&&Math.random()<.42?_(Ht):_(Pe);(at.turn||at.axis!==be)&&Me.turns++,I.axis=at.axis,I.road=at.road,I.along=at.along,I.dir=at.dir,I.laneOffset=E(I.dir),I.next=A(I.axis,I.along,I.dir),I.turnBlend=at.turn?1:0,I.lastControlKey=null};for(let I=0;I<p;I++){const Ce=Math.random()<.56?"ns":"ew",be=u[I%u.length],Re=Math.random()<.5?-1:1,$=(be==="bus"||be==="boxTruck"?10:13)+Math.random()*9,Z={axis:Ce,dir:Re,type:be,road:_(Ce==="ns"?x:M),laneOffset:E(Re),along:_(Ce==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Jr(be,d[I*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};Z.collider.actor=Z,I<8&&(Z.axis="ns",Z.dir=-1,Z.laneOffset=E(Z.dir),Z.road=[210,-50,210,-50][I%4],Z.along=318-I*54,Z.speed+=3),Z.next=A(Z.axis,Z.along,Z.dir),An.push(Z.collider),m.push(Z),Ra.push(Z),n.add(Z.mesh),Di.addDynamic(Z.mesh,I),be==="taxi"&&Ah.attach(Z.mesh),Me.types[be]=(Me.types[be]||0)+1}function j(I,Ce=0,be=0){if(I.stolen)return;let Re=Math.max(0,I.speed*be);I.panicT>0?(I.panicT-=be,Re*=.32,I.brakePulse=1,I.avoidOffset+=(Math.sign(I.laneOffset||1)*2.1-I.avoidOffset)*Math.min(1,be*3),I.honked||(I.honked=!0,zM())):I.honked=!1;const $=w(I);for($?.crash?(Qf(I,l.roamPos),Re=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,be*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Re=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,be*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-be),Re=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-be),Re=0);Re>0;){const O=D(I,Ce);if(O){const _t=I.next-I.dir*(O.kind==="signal"?12:8),Vt=(_t-I.along)*I.dir;if(Vt>=-.35&&Vt<=Re+.25){I.along=_t,I.brakePulse=1,Re=0,O.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=O.key);break}}const Tt=Math.abs(I.next-I.along);if(Re<Tt)I.along+=I.dir*Re,Re=0;else{I.along=I.next,Re-=Tt;const _t=I.next<=(I.axis==="ns"?y:g)+.05||I.next>=(I.axis==="ns"?v:f)-.05;V(I,_t)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-be*3.2),I.turnBlend=Math.max(0,I.turnBlend-be*3.2);const{x:Z,z:we}=C(I),Pe=I.axis==="ns"?0:I.dir,Oe=I.axis==="ns"?I.dir:0;I.mesh.position.set(Z,ce(Z,we)+.28+Math.sin(Ce*3.2+I.bob)*.035,we);const nt=Math.atan2(-Pe,-Oe),Ht=Math.atan2(Math.sin(nt-I.mesh.rotation.y),Math.cos(nt-I.mesh.rotation.y));I.mesh.rotation.y+=Ht*Math.min(1,be*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(Ce*22+I.bob)*.02);for(const O of I.mesh.userData.wheels||[])O.rotation.x-=I.dir*I.speed*be*1.7;const at=I.mesh.userData.colliderHalfD,Bt=I.mesh.userData.colliderHalfW;I.collider.x=Z,I.collider.z=we,I.collider.hw=I.axis==="ns"?Bt:at,I.collider.hd=I.axis==="ns"?at:Bt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of m)j(I,0,0);Me.traffic=m.length,pn(n,(I,Ce)=>{for(const be of m)j(be,I,Ce);Di.update()});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],K=[],ne=45;for(let I=0;I<ne;I++){const Ce=Math.random()<.56?"ns":"ew",be=e[Math.random()*e.length|0],Re=Math.abs(be.z1-be.z0)>Math.abs(be.x1-be.x0),$=Ce==="ns"?Re?"ns":"ew":Re?"ew":"ns",Z=Math.random()<.5?-1:1,we=Math.random()<.5?-1:1,Pe={axis:$,dir:Z,sideSign:we,coord:_($==="ns"?x:M),along:$==="ns"?r+Math.random()*(a-r):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:gd(te[I%te.length],q[I*2%q.length])};I<14&&(Pe.axis="ns",Pe.coord=80,Pe.sideSign=I%2?-1:1,Pe.dir=I%3===0?1:-1,Pe.along=350-I*24,Pe.speed=1.5+I%4*.35),K.push(Pe),Ts.push(Pe),Pe.mesh.traverse(Oe=>Oe.castShadow=!1),n.add(Pe.mesh)}const pe=new Rt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:wt}),ve=new Rt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:wt});for(let I=0;I<18;I++){const Ce=new tt,be=new z(new _n(1,12),pe.clone());be.rotation.x=-Math.PI/2,Ce.add(be);for(let Re=0;Re<7;Re++){const $=new z(new _n(.25+Math.random()*.25,8),ve.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Re)*(.6+Math.random()*1.2),.01,Math.sin(Re*1.7)*(.5+Math.random()*1.1)),Ce.add($)}Ce.visible=!1,Ce.userData.life=0,Ce.userData.maxLife=2.8,Ce.position.y=-99,n.add(Ce),za.push(Ce)}function $e(I,Ce=0,be=0){if(!I.active)if(I.respawn-=be,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*be,I.axis==="ns"?(I.along<r-28&&(I.along=a+28),I.along>a+28&&(I.along=r-28)):(I.along<i-28&&(I.along=s+28),I.along>s+28&&(I.along=i-28));const Re=I.sideSign*(c*.66+1.2),$=I.axis==="ns"?I.coord+Re:I.along,Z=I.axis==="ns"?I.along:I.coord+Re,we=I.axis==="ns"?0:I.dir,Pe=I.axis==="ns"?I.dir:0;I.x=$,I.z=Z,I.mesh.position.set($,ce($,Z)+.08,Z),I.mesh.rotation.y=Math.atan2(-we,-Pe);const Oe=Math.sin(Ce*7+I.phase);for(const nt of I.mesh.userData.limbs||[])nt.mesh.rotation.x=Oe*nt.amp*nt.side,nt.mesh.position.y=nt.baseY+Math.abs(Oe)*.025}for(const I of K)$e(I,0,0);Me.pedestrians=K.length,pn(n,(I,Ce)=>{for(const be of K)$e(be,I,Ce);Pa.update(Ce),Xs.update(Ce);for(const be of za){if(!be.visible)continue;be.userData.life-=Ce;const Re=be.userData.life,$=xe.clamp(Re/be.userData.maxLife,0,1);be.scale.setScalar(1+(1-$)*.35),be.traverse(Z=>{Z.material&&(Z.material.opacity=Math.min(.78,$*1.2))}),Re<=0&&(be.visible=!1)}})}function l_(){const n=new tt,e=new Ut;new ss().setFromAxisAngle(new P(1,0,0),-Math.PI/2),Me.roadDetails={},Me.buildingArchetypes={},Me.zones={},Me.openerProps=0;const t=Be.x0,i=Be.x1,s=Be.zNear,a=Be.zFar,r=Be.pitch,o=Be.streetW,c=r-o,h=[],d=[];for(let N=t;N<=i+1;N+=r)h.push(Math.round(N));for(let N=s;N>=a-1;N-=r)d.push(Math.round(N));const u=[];for(const N of h)u.push({x0:N,z0:s,x1:N,z1:a});for(const N of d)u.push({x0:t,z0:N,x1:i,z1:N});function m(N,k){const Y=N.x1-N.x0,ee=N.z1-N.z0,ie=Math.hypot(Y,ee)||1,he=-ee/ie,S=Y/ie;return{x0:N.x0+he*k,z0:N.z0+S*k,x1:N.x1+he*k,z1:N.z1+S*k}}function p(N,k,Y){const ee=[],ie=[];for(const S of N){const U=S.x1-S.x0,G=S.z1-S.z0,X=Math.hypot(U,G),B=Math.max(1,Math.round(X/14)),oe=U/X,ae=-(G/X),Q=oe;let fe=null,De=null;for(let Ve=0;Ve<=B;Ve++){const Ie=Ve/B,Ne=Ie*X/68,pt=S.x0+U*Ie,Et=S.z0+G*Ie,It=pt+ae*k,At=Et+Q*k,Ze=pt-ae*k,Ft=Et-Q*k,xt=[It,ce(It,At)+Y,At,Ne],tn=[Ze,ce(Ze,Ft)+Y,Ft,Ne];fe&&(ee.push(fe[0],fe[1],fe[2],De[0],De[1],De[2],tn[0],tn[1],tn[2]),ee.push(fe[0],fe[1],fe[2],tn[0],tn[1],tn[2],xt[0],xt[1],xt[2]),ie.push(0,fe[3],1,De[3],1,tn[3]),ie.push(0,fe[3],1,tn[3],0,xt[3])),fe=xt,De=tn}}const he=new jt;return he.setAttribute("position",new St(ee,3)),he.setAttribute("uv",new St(ie,2)),he.computeVertexNormals(),he}const x=(mn.roadMat=new W({map:GM(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:wt}),mn.roadMat),M=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),f=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),_=[],E=[];for(const N of u)_.push(m(N,o*.5+3.3),m(N,-13.3)),E.push(m(N,o*.5+.42),m(N,-10.42));const T=new z(p(_,2.9,.66),M);T.receiveShadow=!0,n.add(T);const A=new z(p(E,.28,.78),g);A.receiveShadow=!0,n.add(A),us("roadDetails","sidewalkRuns",_.length),us("roadDetails","curbRuns",E.length);const C=new z(p(u,o/2,.55),x);C.receiveShadow=!0,n.add(C);const w=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:wt});n.add(new z(p(u,.4,.62),w));let b=0,L=0,D=0;for(let N=1;N<h.length-1;N++)for(let k=1;k<d.length-1;k++){const Y=h[N],ee=d[k];if(!(En(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const he=new z(new le(o*.92,.07,1.15),f);he.position.set(Y,ce(Y,ee+ie*13)+.83,ee+ie*13),he.receiveShadow=!0,n.add(he);const S=new z(new le(1.15,.07,o*.92),f);S.position.set(Y+ie*13,ce(Y+ie*13,ee)+.83,ee),S.receiveShadow=!0,n.add(S),b+=2}}const V=new od;V.moveTo(0,5.8),V.lineTo(2.5,1.6),V.lineTo(.72,1.6),V.lineTo(.72,-5.2),V.lineTo(-.72,-5.2),V.lineTo(-.72,1.6),V.lineTo(-2.5,1.6),V.closePath();const j=new Tl(V);j.rotateX(-Math.PI/2);for(const N of u){const k=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const he=(ie+.5)/ee,S=N.x0+(N.x1-N.x0)*he,U=N.z0+(N.z1-N.z0)*he;if(En(S,U,4).clearance<2)continue;const G=new z(j,y);if(G.position.set(S,ce(S,U)+.86,U),G.rotation.y=k?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),L++,ie%2===0){const X=new z(new qe(1.05,1.05,.08,24),v);X.position.set(S+(k?3.8:0),ce(S,U)+.84,U+(k?0:3.8)),n.add(X),D++}}}us("roadDetails","crosswalks",b),us("roadDetails","laneArrows",L),us("roadDetails","manholes",D);const te=new Rt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:wt,blending:ai}),q=new Rt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:wt,blending:ai});for(let N=0;N<120;N++){const k=u[Math.random()*u.length|0],Y=Math.random(),ee=k.x0+(k.x1-k.x0)*Y,ie=k.z0+(k.z1-k.z0)*Y;if(En(ee,ie,4).clearance<2)continue;const he=new z(new _n(1,18),(N%4===0?q:te).clone());he.rotation.x=-Math.PI/2,he.rotation.z=Math.atan2(k.x1-k.x0,k.z1-k.z0)+(Math.random()-.5)*.35,he.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),he.position.set(ee+(Math.random()-.5)*o*.7,ce(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(he)}const K=[Aa(160,320,.5),Aa(160,320,.62),Aa(160,320,.42)],ne=[new W({map:K[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:K[0],emissiveIntensity:.34}),new W({map:K[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:K[1],emissiveIntensity:.32}),new W({map:K[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:K[2],emissiveIntensity:.36})],pe=new le(1,1,1),ve=[[],[],[]],$e=[],I=[],Ce=[],be=[],Re=[],$=[],Z=[],we=[],Pe=[],Oe=[],nt=[],Ht=[],at=[],Bt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],O=WM(256,256,"#dbcdb8"),Tt=XM(),_t=qM(),Vt=[_c(512,384,"#944737","#2e95bf"),_c(512,384,"#7e4d3e","#d04d65"),_c(512,384,"#a65a35","#4fba6d")],Qe=YM();function qt(N,k){us("zones",N),us("buildingArchetypes",k)}function ot(N,k,Y,ee,ie,he="downtown"){if(Ln(N,k,Y,ee))return!1;const S=Ca(N,k,Y,ee)-1.1;if(Bs(N,k,Y,ee,S+ie+2))return!1;if(e.position.set(N,S+ie/2,k),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),ve[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,S+ie+.6,k),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),$e.push(e.matrix.clone()),ie>26){const U=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(N,S+ie+1.35,k+G*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),Ce.push(U);Math.random()<.34&&be.push({px:N,pz:k,w:Y,d:ee,h:ie,gy:S,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const U=Math.random()<.5?"x":"z";Re.push({px:N,pz:k,w:Y,d:ee,h:ie,gy:S,axis:U,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const U=Math.random()<.5?"x":"z";$.push({px:N,pz:k,w:Y,d:ee,h:ie,gy:S,axis:U,side:Math.random()<.5?-1:1})}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:S+ie+2}),qt(he,ie>64?"glassTower":"midrise"),!0}function Mt(N,k,Y,ee,ie,he="residential"){if(Ln(N,k,Y,ee))return!1;const S=Ca(N,k,Y,ee)-.55,U=2+Math.random()*2.4;if(Bs(N,k,Y,ee,S+ie+U+1.5,6))return!1;e.position.set(N,S+ie/2,k),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),Z.push(e.matrix.clone()),un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:S+ie+U+1.5}),we.push(Bt[Math.random()*Bt.length|0]),e.position.set(N,S+ie+U/2,k),e.scale.set(Y*.82,U,ee*.82),e.updateMatrix(),Pe.push(e.matrix.clone());const G=t+Math.round((N-t)/r)*r,X=s-Math.round((s-k)/r)*r,B=Math.abs(N-G)<Math.abs(k-X),oe=B?G>N?1:-1:X>k?1:-1,ae=Math.min(B?ee*.46:Y*.46,8.5),Q=Math.min(ie*.58,4.6),fe=Math.min(24,Math.max(8,B?Math.abs(G-N)-Y*.5-o*.35:Math.abs(X-k)-ee*.5-o*.35));e.quaternion.identity(),B?(e.position.set(N+oe*(Y*.5+.1),S+Q*.5+.1,k-ee*.16),e.scale.set(.24,Q,ae),e.updateMatrix(),Oe.push(e.matrix.clone()),e.position.set(N+oe*(Y*.5+fe*.5),ce(N+oe*(Y*.5+fe*.5),k)+.08,k-ee*.16),e.scale.set(fe,.08,ae*1.18)):(e.position.set(N-Y*.16,S+Q*.5+.1,k+oe*(ee*.5+.1)),e.scale.set(ae,Q,.24),e.updateMatrix(),Oe.push(e.matrix.clone()),e.position.set(N-Y*.16,ce(N,k+oe*(ee*.5+fe*.5))+.08,k+oe*(ee*.5+fe*.5)),e.scale.set(ae*1.18,.08,fe)),e.updateMatrix(),nt.push(e.matrix.clone()),e.position.set(N,S+.02,k),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),Ht.push(e.matrix.clone());for(let De=0;De<3;De++){const Ve=B?N+oe*(Y*.55):N+(De-1)*Y*.25,Ie=B?k+(De-1)*ee*.28:k+oe*(ee*.55);e.position.set(Ve,ce(Ve,Ie)+.55,Ie);const Ne=.85+Math.random()*.75;e.scale.set(Ne*1.35,Ne,Ne*1.35),e.updateMatrix(),at.push(e.matrix.clone())}return qt(he,"residentialHouse"),!0}function F(N,k,Y,ee,ie,he="commercial"){if(Ln(N,k,Y,ee))return!1;const S=Ca(N,k,Y,ee)-.8;if(Bs(N,k,Y,ee,S+ie+2,7))return!1;const U=new W({map:Qe,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new z(new le(Y,ie,ee),U);G.position.set(N,S+ie/2,k),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),B=new z(new le(Y*.72,.32,ee*.18),X);B.position.set(N,S+ie*.38,k+ee*.18),B.rotation.z=.13,n.add(B);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let ae=5;ae<ie;ae+=9){const Q=new z(new le(Y*1.02,.24,.22),oe);Q.position.set(N,S+ae,k+ee*.5+.14),n.add(Q)}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:S+ie+2}),qt(he,"parkingGarage"),!0}function R(N,k,Y,ee,ie,he="commercial"){if(Ln(N,k,Y,ee))return!1;const S=Ca(N,k,Y,ee)-.65;if(Bs(N,k,Y,ee,S+ie+2,7))return!1;const U=new W({map:Vt[Math.random()*Vt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new z(new le(Y,ie,ee),U);G.position.set(N,S+ie/2,k),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new z(new le(Y*1.06,.9,ee*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(N,S+ie+.45,k),n.add(X);const B=t+Math.round((N-t)/r)*r,oe=s-Math.round((s-k)/r)*r,ae=Math.abs(N-B)<Math.abs(k-oe),Q=ae?B>N?1:-1:oe>k?1:-1,fe=vs[(N+k|0)%vs.length]||"#ffd45b",De=new Rt({map:Mc(gs[(Math.abs(N)+Math.abs(k)|0)%gs.length],fe),transparent:!0,side:wt,depthWrite:!1}),Ve=new z(new zt(Math.min(16,ae?ee*.82:Y*.82),4.2),De);return ae?(Ve.position.set(N+Q*(Y*.5+.2),S+ie*.66,k),Ve.rotation.y=Q>0?Math.PI/2:-Math.PI/2):(Ve.position.set(N,S+ie*.66,k+Q*(ee*.5+.2)),Ve.rotation.y=Q<0?Math.PI:0),n.add(Ve),Vs("storefront-sign",Ve.position.x,Ve.position.y,Ve.position.z),Xs.addSpot(ae?N+Q*(Y*.5):N,S,ae?k:k+Q*(ee*.5),ae?Q>0?Math.PI/2:-Math.PI/2:Q<0?Math.PI:0,ae?ee:Y),un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:S+ie+2}),qt(he,"brickStorefront"),!0}Xs.resetSpots();for(let N=t+r/2;N<=i-r/2;N+=r)for(let k=s-r/2;k>=a+r/2;k-=r){const Y=En(N,k,c*.5).clearance;if(Y<2)continue;const ee=k>40&&k<380&&N>-360&&N<360,ie=ee?"showcase":k<-920?"industrial":Y>230||k<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const he=c/3;for(let S=0;S<3;S++)for(let U=0;U<3;U++){if(Math.random()<.08)continue;const G=N-c/2+he*(S+.5)+(Math.random()-.5)*he*.3,X=k-c/2+he*(U+.5)+(Math.random()-.5)*he*.3;if(En(G,X,8).clearance<1)continue;const B=he*(.54+Math.random()*.24),oe=he*(.54+Math.random()*.24);!ee&&Math.random()<.16?ot(G,X,B*.9,oe*.9,12+Math.random()*12,ie):Mt(G,X,B,oe,5+Math.random()*4.5,ie)}}else{const he=Y>230,S=he?xe.clamp(58+Y*1.15,68,205):xe.clamp(22+Y*.3,22,66),U=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<U;G++){const X=15+Math.random()*Math.min(30,c*.46),B=15+Math.random()*Math.min(30,c*.46),oe=N+(Math.random()-.5)*(c-X),ae=k+(Math.random()-.5)*(c-B);if(En(oe,ae,Math.hypot(X,B)*.5).clearance<2)continue;const Q=(18+Math.random()*(S-18))*(he&&Math.random()<.24?1.35:1);!he&&(Math.random()<.38&&R(oe,ae,Math.max(18,X*1.12),Math.max(18,B*1.08),12+Math.random()*14,ie)||Math.random()<.18&&F(oe,ae,Math.max(24,X*1.35),Math.max(24,B*1.28),24+Math.random()*24,ie))||ot(oe,ae,X,B,Q,ie)}}}r_(n,t,i,a,s,r,o,En);for(let N=0;N<3;N++){if(!ve[N].length)continue;const k=new rn(pe,ne[N],ve[N].length);for(let Y=0;Y<ve[N].length;Y++)k.setMatrixAt(Y,ve[N][Y]);k.instanceMatrix.needsUpdate=!0,k.castShadow=!0,k.receiveShadow=!0,n.add(k)}if($e.length){const N=new W({color:2896696,roughness:.62,metalness:.34}),k=new rn(pe,N,$e.length);for(let Y=0;Y<$e.length;Y++)k.setMatrixAt(Y,$e[Y]);k.instanceMatrix.needsUpdate=!0,n.add(k)}if(I.length){const N=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),k=new rn(pe,N,I.length);for(let Y=0;Y<I.length;Y++)k.setMatrixAt(Y,I[Y]),k.setColorAt(Y,new rt(Ce[Y]));k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),n.add(k)}if(Z.length){const N=new W({color:4891451,roughness:.88,metalness:.02}),k=new rn(pe,N,Ht.length);for(let Q=0;Q<Ht.length;Q++)k.setMatrixAt(Q,Ht[Q]);k.instanceMatrix.needsUpdate=!0,k.receiveShadow=!0,n.add(k);const Y=new W({color:12040883,roughness:.48,metalness:.05}),ee=new rn(pe,Y,nt.length);for(let Q=0;Q<nt.length;Q++)ee.setMatrixAt(Q,nt[Q]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new W({map:O,roughness:.78,metalness:.03}),he=new rn(pe,ie,Z.length);for(let Q=0;Q<Z.length;Q++)he.setMatrixAt(Q,Z[Q]),he.setColorAt(Q,new rt(we[Q]));he.instanceMatrix.needsUpdate=!0,he.instanceColor&&(he.instanceColor.needsUpdate=!0),he.castShadow=!0,he.receiveShadow=!0,n.add(he);const S=new Li(.72,1,4);S.rotateY(Math.PI/4);const U=new W({map:Tt,color:14314033,roughness:.72}),G=new rn(S,U,Pe.length);for(let Q=0;Q<Pe.length;Q++)G.setMatrixAt(Q,Pe[Q]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:_t,roughness:.38,metalness:.18}),B=new rn(pe,X,Oe.length);for(let Q=0;Q<Oe.length;Q++)B.setMatrixAt(Q,Oe[Q]);B.instanceMatrix.needsUpdate=!0,n.add(B);const oe=new W({color:3112239,roughness:.88,metalness:.02}),ae=new rn(new Ot(1,8,6),oe,at.length);for(let Q=0;Q<at.length;Q++)ae.setMatrixAt(Q,at[Q]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(be.length,34);N++){const k=be[N],Y=J[N%J.length],ee=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new Rt({map:Ju(Y,ee),transparent:!0,side:wt,depthWrite:!1}),he=new z(new zt(8,24),ie);he.position.set(k.px,k.gy+Math.max(14,k.h*.58),k.pz+k.zSide*(k.d*.5+.25)),he.rotation.y=k.zSide<0?Math.PI:0,n.add(he),Vs("vertical-neon",he.position.x,he.position.y,he.position.z)}for(let N=0;N<Math.min(Re.length,48);N++){const k=Re[N],Y=gs[(N*5+2)%gs.length],ee=vs[(N*2+1)%vs.length],ie=new Rt({map:Mc(Y,ee),transparent:!0,side:wt,depthWrite:!1}),he=Math.min(17,(k.axis==="x"?k.d:k.w)*.82),S=new z(new zt(he,4.7),ie),U=k.gy+Math.max(6.2,Math.min(k.h-3.5,k.h*(.28+N%3*.12)));k.axis==="x"?(S.position.set(k.px+k.side*(k.w*.5+.22),U,k.pz),S.rotation.y=k.side>0?Math.PI/2:-Math.PI/2):(S.position.set(k.px,U,k.pz+k.side*(k.d*.5+.22)),S.rotation.y=k.side<0?Math.PI:0),n.add(S),Vs("wall-sign",S.position.x,S.position.y,S.position.z)}for(let N=0;N<Math.min($.length,18);N++){const k=$[N],Y=gs[(N*7+4)%gs.length],ee=dl[(N*5+3)%dl.length],ie=vs[(N+3)%vs.length],he=new tt,S=new W({map:gf(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new rt(ie),emissiveIntensity:.34}),U=Math.min(18,(k.axis==="x"?k.d:k.w)*.86),G=new z(new le(U,5.2,.42),S);G.position.y=4.8,he.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const B of[-U*.34,U*.34]){const oe=new z(new qe(.13,.17,5,8),X);oe.position.set(B,2.25,-.2),he.add(oe)}he.position.set(k.px,k.gy+k.h+.7,k.pz),he.rotation.y=k.axis==="x"?k.side>0?Math.PI/2:-Math.PI/2:k.side<0?Math.PI:0,n.add(he),Vs("roof-billboard",he.position.x,he.position.y+4.8,he.position.z)}const ue=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ge=Xn([new le(2.2,.72,4.6).translate(0,.78,0),new le(1.7,.56,2.15).translate(0,1.42,-.22)]),re=Xn([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,k])=>new qe(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,k))),et=130,Fe=new rn(ge,new W({roughness:.42,metalness:.36}),et),it=new rn(re,new W({color:1512727,roughness:.9}),et);Di.resetStatic();let Ye=0,_e=0;for(;Ye<et&&_e<et*6;){_e++;const N=Math.random()<.5,k=N?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=N?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.26);if(En(k,Y,4).clearance<2)continue;const ee=ce(k,Y)+.06;e.position.set(k,ee,Y),e.quaternion.setFromAxisAngle(nn,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Fe.setMatrixAt(Ye,e.matrix),it.setMatrixAt(Ye,e.matrix),Fe.setColorAt(Ye,new rt(ue[Math.random()*ue.length|0])),Mn.spots.push({x:k,z:Y,yaw:N?0:-Math.PI/2,idx:Ye,taken:!1}),Di.addStatic(e.matrix,2.3,Ye,Mn.spots[Mn.spots.length-1]),Ye++}Fe.count=Ye,it.count=Ye,Fe.instanceMatrix.needsUpdate=!0,it.instanceMatrix.needsUpdate=!0,Fe.instanceColor&&(Fe.instanceColor.needsUpdate=!0),Fe.castShadow=!0,Mn.im=Fe,Mn.imW=it,n.add(Fe),n.add(it);const Le=new Map,ht=(N,k)=>`${Math.round(N)},${Math.round(k)}`;function ct(N,k){const Y=((k+N.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function We(){const N=[],k=new W({color:1120028,roughness:.38,metalness:.62}),Y=new W({color:1382685,roughness:.34,metalness:.38}),ee=$M(),ie=new Rt({map:ee,transparent:!0,side:wt}),he=new W({color:5050642,roughness:.48,metalness:.12}),S=(ae,Q)=>new W({color:ae,roughness:.16,metalness:.02,emissive:Q,emissiveIntensity:.2}),U=(ae,Q,fe,De,Ve,Ie)=>{const Ne=new tt,pt=new z(new le(1.15,2.85,.75),Y);Ne.add(pt);const Et=S(16724008,16717836),It=S(16767053,16757276),At=S(4521842,1693789),Ze=[Et,It,At];for(let Ft=0;Ft<3;Ft++){const xt=new z(new Ot(.28,12,8),Ze[Ft]);xt.position.set(0,.78-Ft*.78,-.42),Ne.add(xt)}Ne.position.set(fe,De,Ve),Ne.rotation.y=Ie,ae.add(Ne),N.push({axis:Q,red:Et,yellow:It,green:At,control:ae.userData.control})},G=(ae,Q,fe)=>{const De=ht(ae,Q),Ve={type:"signal",x:ae,z:Q,phase:fe%4*2.1};Le.set(De,Ve);const Ie=ce(ae,Q),Ne=new tt;Ne.userData.control=Ve;const pt=o*.72,Et=o*.72,It=new z(new qe(.18,.24,8.2,8),k);It.position.set(pt,4.1,Et),Ne.add(It);const At=new z(new le(o*1.65,.2,.2),k);At.position.set(pt-o*.72,8,Et),Ne.add(At);const Ze=new z(new le(.2,.2,o*1.65),k);Ze.position.set(pt,7.55,Et-o*.72),Ne.add(Ze),U(Ne,"ns",pt-o*1.24,7.52,Et,0),U(Ne,"ns",pt-o*.18,7.52,-Et,Math.PI),U(Ne,"ew",pt,7.05,Et-o*1.24,Math.PI/2),U(Ne,"ew",-pt,7.05,Et-o*.18,-Math.PI/2),Ne.position.set(ae,Ie,Q),Ne.traverse(Ft=>{Ft.castShadow=!0,Ft.receiveShadow=!0}),n.add(Ne)},X=(ae,Q,fe)=>{const De=ht(ae,Q);Le.set(De,{type:"stop",x:ae,z:Q,phase:0});const Ve=ce(ae,Q),Ie=new tt,Ne=fe%2?-1:1,pt=fe%3?1:-1,Et=new z(new qe(.12,.16,4.2,7),k);Et.position.y=2.1,Ie.add(Et);const It=new z(new _n(1.04,8),he);It.position.y=4.55,It.rotation.y=Math.PI,Ie.add(It);const At=new z(new zt(2.05,2.05),ie);At.position.set(0,4.55,-.04),Ie.add(At),Ie.position.set(ae+Ne*o*.74,Ve,Q+pt*o*.74),Ie.rotation.y=Math.atan2(Ne,pt),Ie.traverse(Ze=>{Ze.castShadow=!0,Ze.receiveShadow=!0}),n.add(Ie)};let B=0,oe=0;for(let ae=1;ae<h.length-1;ae++)for(let Q=1;Q<d.length-1;Q++){const fe=h[ae],De=d[Q];if(En(fe,De,o*.9).clearance<2)continue;const Ve=Math.abs(fe-80)<=r*1.05&&De<=s&&De>=-560,Ie=De<-260&&De>-1180&&(ae+Q)%4===0,Ne=De>-360&&(ae+Q)%2===0;Ve&&Q%2===0||Ie?G(fe,De,B++):(Ne||(ae+Q)%5===0&&De>-820)&&X(fe,De,oe++)}return pn(n,ae=>{for(const Q of N){const fe=ct(Q.control,ae);Q.red.emissiveIntensity=fe.green===Q.axis||fe.yellow===Q.axis?.12:2.3,Q.yellow.emissiveIntensity=fe.yellow===Q.axis?2.6:.12,Q.green.emissiveIntensity=fe.green===Q.axis?2.6:.1}}),{trafficLights:B,stopSigns:oe}}const dt=We();o_(n,u,{X0:t,X1:i,ZN:s,ZF:a,pitch:r,streetW:o,trafficControls:Le}),Me.trafficLights=dt.trafficLights,Me.stopSigns=dt.stopSigns;const H=new qe(.12,.16,7.2,7),Ge=new Ot(.46,10,8),ke=new zt(2.8,13),ze=new W({color:1581353,roughness:.42,metalness:.68}),Te=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),me=new Rt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:wt,blending:ai}),Je=HM(),ft=new bl({map:Je,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:ai}),Wt=132,Nt=new rn(H,ze,Wt),Nn=new rn(Ge,Te,Wt),Cn=new rn(ke,me,Wt);let ci=0;for(let N=0;N<Wt*2&&ci<Wt;N++){const k=Math.random()<.5,Y=k?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=k?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.58);if(En(Y,ee,3).clearance<2)continue;const ie=ce(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Nt.setMatrixAt(ci,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),Nn.setMatrixAt(ci,e.matrix);const he=new ol(ft);he.position.set(Y,ie+7.5,ee);const S=6.2+Math.random()*2.4;he.scale.set(S,S,1),n.add(he),ys.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(k?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Cn.setMatrixAt(ci,e.matrix),ci++}Nt.count=ci,Nn.count=ci,Cn.count=ci,Nt.instanceMatrix.needsUpdate=!0,Nn.instanceMatrix.needsUpdate=!0,Cn.instanceMatrix.needsUpdate=!0,n.add(Nt,Nn,Cn),Me.streetLights=ci,n.add(new z(p([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new z(p([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new z(p([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new z(p([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const no=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const k=new z(new le(1.15,.09,13.5),no);k.position.set(80,ce(80,N)+.9,N),k.receiveShadow=!0,n.add(k)}for(const N of[286,156,26,-104])for(let k=0;k<7;k++){const Y=new z(new le(2,.08,11.8),f),ee=71.2+k*2.95;Y.position.set(ee,ce(ee,N)+.91,N),Y.receiveShadow=!0,n.add(Y),us("roadDetails","openerCrosswalkStripes")}function Qa(N,k,Y,ee=!1){const ie=ce(N,k),he=new tt,S=new z(new qe(.16,.22,9.5,8),ze);S.position.y=4.75,he.add(S);const U=new z(new le(3.8,.22,.22),ze);U.position.set(Y*1.75,8.95,0),he.add(U);const G=new z(new Ot(.62,12,8),Te);G.position.set(Y*3.6,8.82,0),he.add(G);const X=new ol(ft.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),he.add(X),ys.streetGlowSprites++;const B=new z(new zt(3.2,15),me.clone());if(B.position.set(Y*2.8,.72,0),B.rotation.x=-Math.PI/2,B.scale.y=.7+Math.random()*.35,he.add(B),ee){const oe=new hd(16762474,4.4,66,2);oe.position.copy(G.position),he.add(oe)}he.position.set(N,ie,k),n.add(he),Me.streetLights++}let wi=0;for(let N=340;N>=-700;N-=118)Qa(63,N,1,wi++%3===0),Qa(97,N-42,-1,wi++%3===0);function Si(N,k,Y,ee,ie=6010942){const he=new W({color:ie,roughness:.92,metalness:.01}),S=new z(new le(Y,.08,ee),he);return S.position.set(N,ce(N,k)+.06,k),S.receiveShadow=!0,n.add(S),Me.openerProps++,S}function Ti(N,k,Y=1){const ee=ce(N,k),ie=new tt,he=new z(new qe(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));he.position.y=2.75,ie.add(he);const S=new W({color:6065982,roughness:.86}),U=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[B,oe,ae,Q]=G[X],fe=new z(new Ot(Q,12,8),X%2?U:S);fe.position.set(B,oe,ae),fe.scale.y=.78,fe.castShadow=!0,ie.add(fe)}return ie.position.set(N,ee,k),ie.scale.setScalar(Y),n.add(ie),gi.push({kind:"tree",x:N,z:k,radius:3.4*Y,maxY:ee+11*Y}),Me.openerProps++,ie}function er(N,k,Y=0){const ee=new tt,ie=new W({color:10970418,roughness:.64,metalness:.04}),he=new W({color:1910317,roughness:.46,metalness:.5});for(const S of[1.05,1.55]){const U=new z(new le(6.8,.22,.44),ie);U.position.y=S,ee.add(U)}for(const S of[-2.7,2.7]){const U=new z(new le(.22,1.2,.35),he);U.position.set(S,.62,0),ee.add(U)}ee.position.set(N,ce(N,k),k),ee.rotation.y=Y,n.add(ee),Me.openerProps++}function aa(N,k){const Y=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new tt,ie=new z(new qe(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const he=new z(new Ot(.42,12,8),Y);he.position.y=1.32,ee.add(he);const S=new z(new qe(.16,.16,1.1,10),Y);S.rotation.z=Math.PI/2,S.position.y=.9,ee.add(S),ee.position.set(N,ce(N,k),k),n.add(ee),Me.openerProps++}function io(N,k,Y=0){const ee=new tt,ie=new W({color:1185821,roughness:.36,metalness:.68}),he=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),S=new W({color:2370611,roughness:.42,metalness:.32}),U=new z(new le(8.5,.35,3.2),S);U.position.y=4.2,ee.add(U);for(const B of[-3.8,3.8]){const oe=new z(new qe(.09,.11,4.1,7),ie);oe.position.set(B,2.05,-1.25),ee.add(oe)}const G=new z(new le(8,2.8,.08),he);G.position.set(0,2.2,1.35),ee.add(G);const X=new z(new zt(2.3,2.8),new Rt({map:Mc("BUS","#4ff3ff"),transparent:!0,side:wt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(N,ce(N,k),k),ee.rotation.y=Y,n.add(ee),Vs("bus-shelter-ad",N,ce(N,k)+2.2,k),Me.openerProps++}function xn(N,k,Y,ee,ie,he,S,U=null,G=0){if(Ln(N,k,Y,ee,12))return!1;const X=ce(N,k)-.45;if(Bs(N,k,Y,ee,X+ie+2))return!1;const B=N<80?1:-1,oe=new W({map:Aa(192,512,S),color:he,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),ae=new z(new le(Y,ie,ee),oe);ae.position.set(N,X+ie/2,k),ae.castShadow=!1,ae.receiveShadow=!0,n.add(ae);const Q=new W({map:Aa(220,620,Math.min(.86,S+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:wt}),fe=new z(new zt(ee*.78,ie*.74),Q);fe.position.set(N+B*(Y/2+.09),X+ie*.54,k),fe.rotation.y=B>0?Math.PI/2:-Math.PI/2,n.add(fe);for(const Ie of[-1,1]){const Ne=new z(new zt(Y*.82,ie*.72),Q.clone());Ne.position.set(N,X+ie*.55,k+Ie*(ee/2+.1)),Ne.rotation.y=Ie>0?0:Math.PI,n.add(Ne)}const De=new z(new le(Y*1.04,1.2,ee*1.04),new W({color:1778733,roughness:.34,metalness:.38}));De.position.set(N,X+ie+.7,k),n.add(De);const Ve=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ie of[-1,1]){const Ne=new z(new le(Y*1.1,.22,.18),Ve);Ne.position.set(N,X+ie+1.4,k+Ie*(ee/2+.18)),n.add(Ne)}if(U&&G){const Ie=new Rt({map:Ju(U,U==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:wt,depthWrite:!1}),Ne=new z(new zt(7.5,24),Ie);Ne.position.set(N+G*(Y/2+.3),X+Math.min(ie-8,ie*.58),k),Ne.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(Ne),Vs("showcase-neon",Ne.position.x,Ne.position.y,Ne.position.z)}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),qt("showcase","glassTower"),!0}function so(N,k,Y,ee=3.2){const ie=N*.5+ee,he=k*.5+ee,S=Math.max(2,Math.abs(ie-he)*.72),U=N>=k?[-ie,0,-he,ie,0,-he,S,Y,0,-ie,0,-he,S,Y,0,-S,Y,0,ie,0,-he,ie,0,he,S,Y,0,ie,0,he,-ie,0,he,-S,Y,0,ie,0,he,S,Y,0,-S,Y,0,-ie,0,he,-ie,0,-he,-S,Y,0]:[-ie,0,-he,ie,0,-he,0,Y,-S,ie,0,-he,ie,0,he,0,Y,S,ie,0,-he,0,Y,S,0,Y,-S,ie,0,he,-ie,0,he,0,Y,S,-ie,0,he,-ie,0,-he,0,Y,-S,-ie,0,he,0,Y,-S,0,Y,S],G=new jt;return G.setAttribute("position",new St(U,3)),G.computeVertexNormals(),G}function tr(N,k,Y,ee,ie,he,S={}){if(Ln(N,k,Y,ee,12))return!1;const U=ce(N,k)-.3;if(Bs(N,k,Y,ee,U+ie+(S.roofH??8.2)+1,6))return!1;const G=S.frontZ??-1,X=new W({map:O,color:S.wallColor??14734788,roughness:.68,metalness:.03}),B=new z(new le(Y,ie,ee),X);B.position.set(N,U+ie/2,k),B.castShadow=!0,B.receiveShadow=!0,n.add(B);const oe=new W({map:Tt,color:he,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ae=S.roofH??8.2,Q=new z(so(Y,ee,ae),oe);Q.position.set(N,U+ie,k),Q.castShadow=!0,Q.receiveShadow=!0,n.add(Q);const fe=new W({color:15985112,roughness:.42,metalness:.05}),De=new z(new le(Y+7,.42,1.2),fe);De.position.set(N,U+ie+.12,k+G*(ee*.5+1.4)),n.add(De);const Ve=De.clone();Ve.position.z=k-G*(ee*.5+1.4),n.add(Ve);const Ie=Math.min(18,Y*.38),Ne=new z(new le(Ie,ie*.55,.32),new W({map:_t,roughness:.34,metalness:.2}));Ne.position.set(N+Y*.18,U+ie*.33,k+G*(ee*.5+.22)),n.add(Ne);const pt=new z(new le(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));pt.position.set(N-Y*.25,U+3.7,k+G*(ee/2+.24)),n.add(pt);const Et=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),It=new W({color:3353638,roughness:.38});for(const sn of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(sn-Y*.18)<Ie*.45)continue;const ei=new z(new le(6.2,4.8,.26),It);ei.position.set(N+sn,U+ie*.58,k+G*(ee*.5+.28)),n.add(ei);const Yt=new z(new le(4.8,3.4,.3),Et);Yt.position.copy(ei.position),Yt.position.z+=G*.04,n.add(Yt)}const At=new W({color:12370619,roughness:.44,metalness:.04}),Ze=new z(new le(Ie*1.18,.12,34),At);Ze.position.set(N+Y*.18,ce(N+Y*.18,k+G*(ee*.5+17))+.11,k+G*(ee*.5+17)),n.add(Ze);const Ft=new W({color:5679925,roughness:.86,metalness:.01}),xt=new z(new le(Y+10,.08,ee+12),Ft);xt.position.set(N,ce(N,k)-.18,k),xt.receiveShadow=!0,n.add(xt),xt.renderOrder=-1;const tn=new W({color:3042609,roughness:.84}),qi=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let sn=0;sn<9;sn++){const ei=N-Y*.44+sn*(Y*.11),Yt=k+G*(ee*.5+2.2+sn%2*1.5),gn=new z(new Ot(1.35+sn%3*.22,10,7),sn%4===0?qi[sn%qi.length]:tn);gn.position.set(ei,ce(ei,Yt)+.95,Yt),gn.scale.y=.72,gn.castShadow=!0,n.add(gn)}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:U+ie+5}),qt("showcase","lowStorefront"),!0}return Si(45,318,36,84,6404169),Si(116,318,36,84,6074179),Si(44,188,34,84,6798662),Si(118,188,36,84,5941822),Si(43,60,34,82,5679164),Si(118,60,36,82,6864197),xn(18,315,70,54,154,2311775,.72,"HOTEL",1),xn(17,185,72,58,188,1522779,.78,null,0),xn(31,55,44,56,138,2840688,.66,"OPEN",1),xn(24,-75,52,64,182,1913933,.7,null,0),xn(145,315,68,54,116,2776440,.72,null,0),xn(146,185,70,58,146,2314602,.76,null,0),xn(142,55,42,56,156,1590364,.68,"CAFE",-1),xn(134,-75,48,64,114,3688540,.62,null,0),xn(-70,315,52,52,146,2112085,.68,null,0),xn(228,185,48,58,148,3235186,.66,null,0),xn(-78,185,48,56,134,2181730,.68,null,0),xn(236,315,44,54,104,3104884,.66,null,0),tr(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),tr(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),xn(-48,-360,54,56,148,2439765,.58,null,0),xn(172,-430,50,56,132,3817032,.66,"OPEN",-1),Ti(112,227,1.35),Ti(104,221,1.05),Ti(121,233,1.15),er(112,217,0),Ti(50,292,1.2),Ti(111,316,.95),Ti(48,137,.9),Ti(116,102,1.05),er(47,248,Math.PI/2),aa(57,226),io(111,260,-Math.PI/2),Se.add(n),n}function wf(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:a=52,label:r="ON RAMP"}={}){const o=mt(i),c=new P(o.tangent.x,0,o.tangent.z).normalize(),h=new P().crossVectors(nn,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*se.width*.5),u=t==="off"?1:-1,m=d.x+c.x*s*u+h.x*e*a,p=d.z+c.z*s*u+h.z*e*a,x=new P(m,ce(m,p)+.4,p),M=t==="off"?d:x,g=t==="off"?x:d,f=26,y=[];for(let q=0;q<=f;q++){const K=q/f,ne=K*K*(3-2*K),pe=t==="off"?1-(1-K)*(1-K):ne;y.push(new P(xe.lerp(M.x,g.x,K),xe.lerp(M.y,g.y,pe),xe.lerp(M.z,g.z,K)))}const v=7.4,_=new P,E=new P,T=[],A=[];for(let q=0;q<=f;q++)E.subVectors(y[Math.min(f,q+1)],y[Math.max(0,q-1)]),E.y=0,E.normalize(),_.crossVectors(nn,E).normalize(),T.push(y[q].clone().addScaledVector(_,-v)),A.push(y[q].clone().addScaledVector(_,v));const C={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(q=>q.clone()),segments:[]};for(let q=0;q<f;q++){const K=y[q],ne=y[q+1],pe=ne.x-K.x,ve=ne.z-K.z,$e=Math.max(1e-4,pe*pe+ve*ve);C.segments.push({a:K.clone(),b:ne.clone(),abx:pe,abz:ve,lenSq:$e,u0:q/f,u1:(q+1)/f})}sa.push(C);const w=[];for(let q=0;q<f;q++){const K=T[q],ne=A[q],pe=T[q+1],ve=A[q+1];w.push(K.x,K.y,K.z,ne.x,ne.y,ne.z,ve.x,ve.y,ve.z),w.push(K.x,K.y,K.z,ve.x,ve.y,ve.z,pe.x,pe.y,pe.z)}const b=new jt;b.setAttribute("position",new St(w,3)),b.computeVertexNormals();const L=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:wt});n.add(new z(b,L));const D=new W({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<f;q++)Gn(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,D),Gn(n,A[q].clone().setY(A[q].y+1),A[q+1].clone().setY(A[q+1].y+1),.16,D);const V=new W({color:7173241,roughness:.82});for(let q=3;q<f;q+=3){const K=y[q],ne=ce(K.x,K.z),pe=K.y-ne;if(pe<3||Ln(K.x,K.z,3.2,3.2,1.2))continue;const ve=new z(new qe(.9,1.15,pe,8),V);ve.position.set(K.x,ne+pe/2,K.z),n.add(ve),ii.push({x:K.x,z:K.z,hw:1.3,hd:1.3,maxY:K.y-.9})}const j=new Rt({map:vd(r),transparent:!0,side:wt}),te=new z(new zt(12,3),j);te.position.copy(t==="off"?d:x).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const K=new z(new qe(.2,.26,6,6),V),ne=t==="off"?d:x;K.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(K)}}function c_(n,e=1){wf(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function h_(n,e=-1){wf(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function d_(){const n=new tt,e=[],t=new rt(14170671),i=new rt(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),a=new Rt({map:u_(),transparent:!0,side:wt}),r=new W({color:4926748,roughness:.9}),o=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:wt}),h=12,d=[],u=[];let m=0;for(let x=0;x<se.length;x+=h){if(Bi(x+h*.5)){m++;continue}const M=mt(x),g=mt(x+h),f=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:_}=ts(M,g);for(const E of[-1,1]){const T=f.clone().addScaledVector(y,E*se.width*.5).addScaledVector(v,.5);d.push(T),u.push(_),e.push(m%2===0?t:i)}if(m%16===8){const E=(m>>4)%2?1:-1,T=f.clone().addScaledVector(y,E*se.width*.52).addScaledVector(v,.4),A=new tt,C=new z(new zt(4.4,2.6),a);C.position.y=3.4,C.rotation.y=Math.PI,A.add(C);const w=new qe(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const L=new z(w,s);L.position.set(b,1.7,0),A.add(L)}A.position.copy(T),A.quaternion.copy(_),n.add(A)}m++}for(let x=0;x<se.length;x+=16){const M=mt(x),g=1+(Math.random()<.5?1:0);for(let f=0;f<g;f++){const y=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,_=M.p.x+M.side.x*v*y+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*y+(Math.random()-.5)*16;if(Rl(_,E,18)||Ln(_,E,12,12,3.5))continue;const T=ce(_,E);if(Math.random()<.78){const A=.7+Math.random()*1.5,C=new tt,w=2.4+Math.random()*4.2,b=new z(new qe(.26,.42,w,6),r);b.position.y=w/2,C.add(b);const L=2+Math.floor(Math.random()*3);for(let D=0;D<L;D++){const V=new z(new Li(2.4+Math.random()*1.6-D*.2,4.6+Math.random()*2.4,7),o[(f+D+x)%o.length]);V.position.y=w+D*1.4+1.5,V.rotation.y=Math.random()*Math.PI,C.add(V)}C.position.set(_,T+.6,E),C.scale.setScalar(A),n.add(C)}else{const A=1.4+Math.random()*3.6,C=new z(new sd(A,0),c);C.position.set(_,T+A*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),n.add(C),ii.push({kind:"rock",x:_,z:E,radius:A*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(Bi(M))continue;const g=mt(M),f=mt(M+h),y=g.p.clone().add(f.p).multiplyScalar(.5),{q:v}=ts(g,f),_=se.width*.5+1.2,E=9,T=new tt,A=new qe(.4,.55,E,7);for(const D of[-1,1]){const V=new z(A,s);V.position.set(D*_,E/2,0),T.add(V)}const C=_*2,w=new z(new le(C,1.1,1.1),s);w.position.y=E,T.add(w);const b=new Rt({map:vd(p[x]),transparent:!0,side:wt}),L=new z(new zt(C*.82,3),b);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(y),T.quaternion.copy(v),n.add(T)}if(d.length){const x=new qe(.18,.24,3,6);x.translate(0,1.5,0);const M=new Ot(.34,8,6);M.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),f=new W({roughness:.55}),y=new rn(x,g,d.length),v=new rn(M,f,d.length),_=new Ut;for(let E=0;E<d.length;E++)_.position.copy(d[E]),_.quaternion.copy(u[E]),_.updateMatrix(),y.setMatrixAt(E,_.matrix),v.setMatrixAt(E,_.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return c_(n),h_(n),Se.add(n),n}function u_(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new en(n);return t.colorSpace=Lt,t}function vd(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new en(e);return i.colorSpace=Lt,i}function f_(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),a="#"+e.toString(16).padStart(6,"0"),r=8;for(let c=0;c<r;c++)i.fillStyle=c%2?s:a,i.fillRect(c/r*t.width,0,t.width/r+1,t.height);const o=new en(t);return o.colorSpace=Lt,o}function p_(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const a=Math.random()*n.width,r=Math.random()*n.height;e.fillRect(a,r,2.4,2.4)}const i=new en(n);return i.colorSpace=Lt,i.wrapS=zn,i.repeat.set(3,1),i}function Qt(n,e,t,i,s){const a=new z(new le(e.x,e.y,e.z),s);return a.position.copy(t),a.quaternion.copy(i),a.castShadow=!1,a.receiveShadow=!0,n.add(a),a}function ts(n,e){const t=e.p.clone().sub(n.p).normalize(),i=fd.crossVectors(nn,t).normalize();let s=t.clone().cross(i).normalize();const a=(n.bank+e.bank)*.5;if(Math.abs(a)>.001){const c=new ss().setFromAxisAngle(t,a);i.applyQuaternion(c),s.applyQuaternion(c)}const r=new yt().makeBasis(i,s,t),o=new ss().setFromRotationMatrix(r);return{tangent:t,sideways:i,normal:s,q:o}}function t0(n,e,t,i){const s=[],a=[],r=[],o=se.width*.47;let c=0;for(let u=e;u<=t;u+=8){const m=mt(Math.min(u,t)),p=ts(m,mt(m.s+2)),x=Math.sin(u*.018)*.04,M=m.p.clone().addScaledVector(p.sideways,-o).addScaledVector(p.normal,.46+x),g=m.p.clone().addScaledVector(p.sideways,o).addScaledVector(p.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const f=(u-e)/64;if(a.push(0,f,1,f),c>0){const y=(c-1)*2,v=c*2;r.push(y,y+1,v,y+1,v+1,v)}c++}const h=new jt;h.setAttribute("position",new St(s,3)),h.setAttribute("uv",new St(a,2)),h.setIndex(r),h.computeVertexNormals();const d=new z(h,i);d.receiveShadow=!0,n.add(d)}function m_(n,e){let t=0;for(const i of se.gaps)t0(n,t,Math.max(t,i.start-4),e),t=i.end+4;t0(n,t,se.length,e)}function x_(n,e,t){const i=mt(e.s+2),{normal:s,q:a}=ts(e,i),r=new tt;r.position.copy(e.p).addScaledVector(s,.73),r.quaternion.copy(a);const o=new z(new le(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,r.add(o);const c=new z(new le(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,r.add(c);const h=new z(new le(.42,.1,3.8),t);h.position.set(0,.01,-1.9),r.add(h),n.add(r)}function g_(){const n=new tt;Se.add(n),Th=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),a=new W({color:6120040,roughness:.5,metalness:.6}),r=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new W({color:4935486,roughness:.92,metalness:.04}),m=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const f=new W({map:BM(),roughness:.74,metalness:.08}),y=new Rt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;m_(n,f);function _(E,T=!1){if(Bi(E))return!1;const A=mt(E),C=mt(E+3),{sideways:w,normal:b,q:L}=ts(A,C),D=A.p,V=ce(D.x,D.z),j=D.y-.95;if(j-V<10)return!1;const te=se.width*(T?.43:.35),q=j,K=V+.25,ne=T?.56:.42,pe=T?2.4:1.75,ve=T?.52:.36,$e=[],I=[];for(const we of[-1,1])if(Ln(D.x+w.x*we*te,D.z+w.z*we*te,pe*2.2,pe*2.2,1.2))return!1;for(const we of[-1,1]){const Pe=D.clone().addScaledVector(w,we*te).addScaledVector(b,-.85);Pe.y=q;const Oe=new P(Pe.x,K,Pe.z);Gn(n,Oe,Pe,ne,a);const nt=new z(new qe(pe,pe*1.12,ve,12),a);nt.position.set(Oe.x,V+ve*.5,Oe.z),nt.receiveShadow=!0,n.add(nt),$e.push(Pe),I.push(Oe),ii.push({x:Oe.x,z:Oe.z,hw:pe*.92,hd:pe*.92,maxY:q-.7})}const Ce=D.clone().addScaledVector(b,-1.05);Ce.y=q,Qt(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),Ce,L,r);const be=I[0].clone();be.y+=(q-K)*.28;const Re=I[1].clone();Re.y+=(q-K)*.28;const $=$e[0].clone();$.y-=1;const Z=$e[1].clone();if(Z.y-=1,Gn(n,be,Z,T?.18:.14,c),Gn(n,Re,$,T?.18:.14,c),T){const we=I[0].clone();we.y+=(q-K)*.58;const Pe=I[1].clone();Pe.y+=(q-K)*.58,Gn(n,I[0].clone().setY(K+1.2),Pe,.16,c),Gn(n,I[1].clone().setY(K+1.2),we,.16,c),Gn(n,we,Z,.16,c),Gn(n,Pe,$,.16,c)}return Th++,!0}for(let E=0;E<se.length;E+=v){if(Bi(E+v*.5))continue;const T=mt(E),A=mt(E+v),C=T.p.clone().add(A.p).multiplyScalar(.5),{sideways:w,normal:b,q:L}=ts(T,A),D=T.p.distanceTo(A.p)+.45,V=Math.floor(E/(v*2))%2?e:t;Qt(n,new P(se.width,.62,D),C.clone().addScaledVector(b,-.05),L,V),Qt(n,new P(se.width-2.8,.08,D*.86),C.clone().addScaledVector(b,.36),L,u),Qt(n,new P(.2,.1,D*.76),C.clone().addScaledVector(w,-se.width*.19).addScaledVector(b,.43),L,u),Qt(n,new P(.2,.1,D*.76),C.clone().addScaledVector(w,se.width*.19).addScaledVector(b,.43),L,u),E%48===0&&(Qt(n,new P(.14,.08,D*.62),C.clone().addScaledVector(w,-se.width*.08).addScaledVector(b,.51),L,M),Qt(n,new P(.14,.08,D*.62),C.clone().addScaledVector(w,se.width*.08).addScaledVector(b,.51),L,M)),E%120===0&&Qt(n,new P(se.width*.42,.07,.72),C.clone().addScaledVector(b,.55),L,g),Qt(n,new P(se.width+1.2,.35,D*.94),C.clone().addScaledVector(b,-.56),L,r),Qt(n,new P(.42,.42,D*.9),C.clone().addScaledVector(w,-se.width*.36).addScaledVector(b,-.78),L,x),Qt(n,new P(.42,.42,D*.9),C.clone().addScaledVector(w,se.width*.36).addScaledVector(b,-.78),L,x);const j=C.clone().addScaledVector(w,-se.width*.51),te=C.clone().addScaledVector(w,se.width*.51);if(Qt(n,new P(.32,.46,D),j.clone().addScaledVector(b,.28),L,i),Qt(n,new P(.32,.46,D),te.clone().addScaledVector(b,.28),L,i),Qt(n,new P(.26,.72,D*.94),j.clone().addScaledVector(b,-.22),L,r),Qt(n,new P(.26,.72,D*.94),te.clone().addScaledVector(b,-.22),L,r),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const K=new z(new qe(.16,.2,.12,10),o);K.position.copy(C).addScaledVector(w,q).addScaledVector(b,.46),K.quaternion.copy(L),K.castShadow=!1,n.add(K)}if(E%72===0&&(Qt(n,new P(.34,1.56,3.4),C.clone().addScaledVector(w,-se.width*.66).addScaledVector(b,1.16),L,s),Qt(n,new P(.34,1.56,3.4),C.clone().addScaledVector(w,se.width*.66).addScaledVector(b,1.16),L,s),Qt(n,new P(.18,.18,4.4),C.clone().addScaledVector(w,-se.width*.62).addScaledVector(b,1.94),L,s),Qt(n,new P(.18,.18,4.4),C.clone().addScaledVector(w,se.width*.62).addScaledVector(b,1.94),L,s),Qt(n,new P(.12,.12,4),C.clone().addScaledVector(w,-se.width*.62).addScaledVector(b,1.38),L,i),Qt(n,new P(.12,.12,4),C.clone().addScaledVector(w,se.width*.62).addScaledVector(b,1.38),L,i),Gn(n,C.clone().addScaledVector(w,-se.width*.58).addScaledVector(b,-1.08),C.clone().addScaledVector(w,se.width*.58).addScaledVector(b,-1.08),.11,c),Gn(n,C.clone().addScaledVector(w,-se.width*.48).addScaledVector(b,-1),C.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c),Gn(n,C.clone().addScaledVector(w,se.width*.48).addScaledVector(b,-1),C.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const q=new z(new _n(1,28),y);q.rotation.x=-Math.PI/2,q.position.set(C.x,-4.72,C.z),q.scale.set(se.width*.9,Math.max(10,D*2.2),1),q.rotation.z=Math.atan2(ts(T,A).tangent.x,ts(T,A).tangent.z),n.add(q)}if(E%144===0){const q=C.clone().addScaledVector(w,-se.width*.74).addScaledVector(b,2),K=C.clone().addScaledVector(w,se.width*.74).addScaledVector(b,2);Gn(n,q.clone().addScaledVector(b,-1.2),q.clone().addScaledVector(b,1.1),.12,s),Gn(n,K.clone().addScaledVector(b,-1.2),K.clone().addScaledVector(b,1.1),.12,s),Qt(n,new P(.46,.72,.46),q.clone().addScaledVector(b,1.15),L,h),Qt(n,new P(.46,.72,.46),K.clone().addScaledVector(b,1.15),L,h)}if(E%288===0){const q=C.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(b,5.2);Qt(n,new P(.44,.44,.44),q.clone(),L,m),Gn(n,q.clone().addScaledVector(b,-.2),C.clone().addScaledVector(b,1),.05,c)}E%48===0&&_(E+v*.5,!1),E%168===0&&!Bi(E+16)&&x_(n,mt(E+5),d)}for(const E of se.gaps){const T=mt(E.start-3),A=mt(E.end+3);for(const C of[T,A]){const w=mt(C.s+2),{normal:b,q:L}=ts(C,w);Qt(n,new P(se.width-1.2,.08,4.6),C.p.clone().addScaledVector(b,.54),L,h),Qt(n,new P(se.width*.62,.09,1.3),C.p.clone().addScaledVector(b,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),L,g);for(const D of[-se.width*.42,0,se.width*.42]){const V=C.p.clone().addScaledVector(C.side,D).addScaledVector(b,2.35);Qt(n,new P(.46,.46,.46),V,L,D===0?p:h)}_(C.s+(C===T?-9:9),!0),_(C.s+(C===T?-24:24),!0)}}return n}function Sf(n=13710372,e=7740696){const t=new tt,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),a=new W({color:329225,roughness:.52,metalness:.12}),r=new W({color:1053463,roughness:.38,metalness:.34}),o=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),u=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),m=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),p=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),M=new z(new _n(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(_,E,T,A,C=null,w=null)=>{const b=new z(E,T);return b.name=_,b.position.copy(A),C&&b.rotation.set(C.x||0,C.y||0,C.z||0),w&&b.scale.copy(w),t.add(b),b},f=(_,E,T,A,C,w,b=0,L=0,D=0)=>g(_,new le(E.x,E.y,E.z),T,new P(A,C,w),new P(b,L,D));f("low black undertray",new P(5.25,.28,8.45),a,0,.45,-.08),f("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),f("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),f("front black splitter",new P(5.25,.13,.78),a,0,.35,-5.6),f("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),f("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),f("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),f("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),f("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),f("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),f("black rear fascia",new P(4.72,.66,.2),r,0,1.02,4.04),f("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),f("front windshield",new P(2.8,.13,1.15),h,0,1.78,-1.25,-.48),f("roof glass",new P(2.34,.18,1.55),h,0,2.08,-.2,-.13),f("left side window",new P(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),f("right side window",new P(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),f("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),f("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),f("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let _=0;_<7;_++)f("black rear deck louver",new P(3.35,.12,.18),r,0,1.83+_*.015,1.1+_*.28,-.21);f("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const _ of[-2.28,2.28])f("spoiler side endplate",new P(.24,.78,1.04),s,_,1.43,3.72,0,0,_<0?-.08:.08);for(const _ of[-1.78,1.78])f("thin hood crease",new P(.08,.04,2.55),x,_*.36,1.27,-3.45,-.15),f("door seam",new P(.035,.68,1.75),x,_,1.16,-.2),f("side intake",new P(.09,.34,.9),r,Math.sign(_)*2.68,.86,1.42);for(const _ of[-1.04,1.04])f("pop up headlight glass",new P(.62,.12,.18),m,_,1.02,-5.28,-.16);f("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const _ of[-1.42,-.62,.62,1.42])f("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(_)>1?d:u,_,1.08,4.24);f("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),f("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),f("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),f("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const _ of[-2.86,2.86])f("angular side mirror arm",new P(.42,.08,.08),x,_,1.62,-1.55,0,0,_<0?-.14:.14),f("blue tinted side mirror",new P(.12,.34,.46),h,_*1.03,1.62,-1.65,0,_<0?.24:-.24),f("flush door handle",new P(.08,.11,.46),o,_*.94,1.28,.52);for(const _ of[-2.65,2.42])f("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,_),f("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,_);f("black license recess",new P(.9,.24,.08),r,0,.76,4.31);const y=[],v=(_,E,T=!1)=>{const A=new tt;A.name=T?"steering front wheel assembly":"rear wheel assembly",A.position.set(_,.54,E);const C=new z(new qe(.88,.88,.62,28),a);C.name="wide performance tire",C.rotation.z=Math.PI/2,A.add(C);const w=new z(new As(.88,.06,10,32),a);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,A.add(w);const b=new z(new qe(.42,.42,.66,24),o);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,A.add(b);const L=new z(new qe(.56,.56,.08,24),p);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=_>0?-.05:.05,A.add(L);for(let j=0;j<8;j++){const te=new z(new le(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=j/8*Math.PI*2,te.position.set(_>0?.035:-.035,0,.22),A.add(te)}const D=new z(new le(.1,.22,.18),u);D.name="small brake caliper",D.position.set(_>0?-.39:.39,.18,-.38),A.add(D);const V=new z(new qe(.17,.17,.72,18),c);V.name="dark center cap",V.rotation.z=Math.PI/2,A.add(V),t.add(A),T&&y.push(A)};for(const _ of[-2.4,2.4])v(_,-2.65,!0),v(_,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const _ of[-.92,-.52,.52,.92]){const E=new z(new qe(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(_,.43,4.52),t.add(E)}return t.traverse(_=>{_.castShadow=!0,_.receiveShadow=!0}),Se.add(t),t}function v_(){const n=new tt,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),a=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),r=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new W({color:1118995,roughness:.7,metalness:.05}),c=new z(new le(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new z(new le(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new z(new le(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const u=new z(new zt(2.8,.82,1,1),r);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,n.add(u);const m=new z(new As(.36,.035,12,48),o);m.position.set(0,-.46,-1.02),m.rotation.x=Math.PI/2.75,n.add(m);for(let p=0;p<3;p++){const x=new z(new le(.34,.025,.035),i);x.position.copy(m.position),x.rotation.copy(m.rotation),x.rotation.z+=p/3*Math.PI*2,n.add(x)}for(let p=0;p<6;p++){const x=new z(new qe(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),n.add(x)}for(const p of[-1.08,1.08]){const x=new z(new qe(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(p,-.68,-1.58),n.add(x);const M=new z(new As(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(p*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const p of[-1.14,-.84,.84,1.14]){const x=new z(new qe(.035,.04,.028,8),i);x.position.set(p,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const p of[-.52,.52]){const x=new z(new Ot(.045,12,8),a);x.position.set(p,-.34,-1.22),n.add(x)}n.position.set(0,0,0),ye.add(n),dn=n}function M_(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:OM(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=mt(0),a=new yt().makeBasis(s.side,nn,s.tangent),r=new ss().setFromRotationMatrix(a),o=new tt;for(const d of[-se.width*.58,se.width*.58]){const u=new z(new le(.8,11,.8),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(nn,5.4),u.quaternion.copy(r),o.add(u)}const c=new z(new le(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(nn,11.2),c.quaternion.copy(r),o.add(c);const h=new z(new le(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(nn,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(r),o.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const u=new z(new Ot(.32,16,10),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(nn,10.25),o.add(u)}return Se.add(o),o}function Md(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new z(new _n(3.65,36),new Rt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const a=(h,d,u,m,p=null,x=null)=>{const M=new z(d,u);return M.name=h,M.position.copy(m),p&&M.rotation.set(p.x||0,p.y||0,p.z||0),x&&M.scale.copy(x),n.add(M),M},r=(h,d,u,m,p,x,M,g,f=0,y=0,v=0)=>a(h,new le(d,u,m),p,new P(x,M,g),{x:f,y,z:v}),o=[];function c(h,d,u,m=.88,p=.62){const x=new tt;x.name=u?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,m*.62+.18,d);const M=new z(new qe(m,m,p,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new z(new As(m,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const f=new z(new qe(m*.48,m*.48,p+.04,24),i.chrome);f.name="chrome rim",f.rotation.z=Math.PI/2,x.add(f);const y=new z(new qe(m*.62,m*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let _=0;_<8;_++){const E=new z(new le(.08,.055,p),i.chrome);E.name="wheel spoke",E.rotation.x=_/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,m*.25),x.add(E)}const v=new z(new qe(.17,.17,p+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),u&&o.push(x),x}return{mats:i,part:a,box:r,wheel:c,frontWheels:o}}function __(n=15616818,e=2434871){const t=new tt,i=Md(t,n,e),{mats:s,box:a}=i;a("low undertray",4.6,.26,9.2,s.black,0,.42,0),a("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),a("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),a("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),a("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),a("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),a("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),a("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),a("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),a("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),a("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),a("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),a("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),a("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),a("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let r=0;r<6;r++)a("engine deck vent",2.9,.1,.16,s.dark,0,1.47+r*.008,1.3+r*.42,-.05);a("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),a("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),a("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const r of[-.72,.72])a("slit headlight",.85,.09,.14,s.headLamp,r,.92,-6.1,-.1);for(const r of[-1.5,1.5])a("beltline chrome strip",.05,.06,5.4,s.chrome,r*1.36,1.3,-.4);for(const r of[-.4,.4]){const o=new z(new qe(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(r,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Se.add(t),t}function y_(n=4165830,e=15908108){const t=new tt,i=Md(t,n,e),{mats:s,box:a}=i;a("undertray",5,.3,7.6,s.black,0,.48,0),a("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),a("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),a("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),a("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),a("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),a("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),a("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),a("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),a("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),a("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),a("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),a("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),a("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const r of[-2.05,-.85,.85,2.05]){const o=new z(new qe(.21,.21,.1,18),Math.abs(r)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(r,1.28,3.78),t.add(o)}for(const r of[-1.7,1.7])a("square headlamp",.7,.3,.12,s.headLamp,r,1.22,-4.62);a("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const r of[-1,1]){const o=new z(new qe(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(r*2.62,.55,.4),t.add(o),a("side pipe heat shield",.16,.28,2.4,s.dark,r*2.62,.72,.4),a("fender flare front",.5,.6,1.6,s.body,r*2.6,1,-2.5,-.03),a("fender flare rear",.55,.68,1.9,s.body,r*2.62,1.05,2.3,-.03),a("racing stripe",.8,.02,6.8,s.trim,r*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Se.add(t),t}function b_(n=16764159,e=526344){const t=new tt,i=Md(t,n,e),{mats:s,box:a}=i;a("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),a("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),a("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),a("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),a("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),a("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),a("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),a("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),a("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),a("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),a("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),a("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),a("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),a("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),a("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const r of[-1,1]){const o=new z(new qe(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=r*.42,o.position.set(r*.75,1.85,.35),t.add(o),a("front fender pod",.62,.4,1.5,s.body,r*1.85,.95,-2.15,-.05),a("rear fender pod",.68,.46,1.7,s.body,r*1.9,1,2.15,-.05),a("pod brace arm",.5,.1,.12,s.steel,r*1.45,.98,-2.15),a("number roundel",.04,.5,.5,s.trim,r*1.79,1.05,.2)}for(const r of[-.85,.85])a("bug eye headlamp",.34,.26,.14,s.headLamp,r,1.08,-3.66),a("tail lamp block",.4,.22,.1,Math.abs(r)>.5?s.tailHot:s.tailWarm,r*1.6,1.14,3.14);{const r=new z(new qe(.15,.15,.5,14),s.chrome);r.name="single stinger exhaust",r.rotation.x=Math.PI/2,r.position.set(.65,.78,3.28),t.add(r)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Se.add(t),t}const Cs=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>Sf(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>__()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>y_()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>b_()}];let Vi=xe.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function bs(){return l.drivingStolen&&st?d0[st.type]||d0.compact:Cs[Vi].stats}const Tf=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],qn=Tf.map((n,e)=>({...n,idx:e,mesh:Sf(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),w_=qn[0].mesh;let Gt=Cs[Vi].build();function S_(n){Vi=xe.clamp(n,0,Cs.length-1),localStorage.setItem("steel-ribbon-carmodel",String(Vi));const e=Gt.visible;La(Gt),Gt=Cs[Vi].build(),Gt.visible=e,typeof Nh=="function"&&Nh()}for(const n of qn)n.mesh.visible=!1,Se.add(n.mesh);function jr(n){for(const e of qn)e.mesh.visible=n}const T_=[10,6,4,2];let Xt=null;try{Xt=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function Qr(){return Xt?.active?Xt.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function Ef(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Xt))}function E_(){Xt={division:Qr(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},Ef()}function Af(n){return["One","Two","Three","Four"][xe.clamp(n,1,4)-1]}function Cf(){return[{key:"you",label:"You",pts:Xt?.points.you??0},...Tf.map(e=>({key:e.key,label:e.label,pts:Xt?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Gt.visible=!1;JM();KM();Me.signs=0;fl.length=0;jM();QM();l_();let n0=null,i0=null,s0=null,dn=null,wc=null;const Jt=[];v_();function Rs(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Se.remove(n))}function La(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Se.remove(n))}const Na=[],Vr=[];let a0=null;function A_(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new en(n);return t.colorSpace=Lt,t}function C_(n,e){if(Bi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of sa)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function R_(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:wt}),t=new qe(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let a=0,r=0;const o=new rn(t,i,Math.ceil(se.length/12*2)+8),c=new Ut;for(const h of[-1,1]){const d=h*(se.width*.5+.55),u=[],m=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],f=x[M+1];u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.12,f.z,f.x,f.y+1.5,f.z),u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.5,f.z,g.x,g.y+1.5,g.z)}a++}};let p=[];for(let x=0;x<=se.length;x+=s){if(C_(x%se.length,h)){m(p),p=[];continue}const M=mt(x%se.length);if(p.push(M.p.clone().addScaledVector(M.side,d).addScaledVector(nn,.58)),x%12===0){const g=p[p.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(r++,c.matrix)}}if(m(p),u.length){const x=new jt;x.setAttribute("position",new St(u,3)),x.computeVertexNormals(),n.add(new z(x,e))}}o.count=r,o.instanceMatrix.needsUpdate=!0,n.add(o),Me.railRuns=a,Me.railPosts=r}function P_(){Na.length=0,Vr.length=0;const n=new tt,e=new Rt({map:A_(),transparent:!0,depthWrite:!1,side:wt,blending:ai,opacity:.9}),t=new zt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][Na.length%3]*se.width,d=mt(c),u=new z(t,e),m=new P().crossVectors(d.side,d.tangent).normalize();m.y<0&&m.multiplyScalar(-1);const p=new yt().makeBasis(d.side,m,new P().crossVectors(d.side,m).normalize());u.quaternion.setFromRotationMatrix(p),u.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(m,.84),n.add(u),Na.push({s:c,lat:h})}const i=new Ot(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),a=Math.max(60,Math.round(se.length/24));{const c=new rn(i,s,a*2),h=new Ut;let d=0;for(let u=0;u<a;u++){const m=u/a*se.length;if(Bi(m))continue;const p=mt(m);for(const x of[-1,1])h.position.copy(p.p).addScaledVector(p.side,x*(se.width*.5+.22)).addScaledVector(nn,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const r=new qe(.09,.12,1.5,8),o=new W({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=mt(Math.max(6,c.start-22));for(const d of[-1,1]){const u=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),m=new tt,p=new z(r,o),x=new z(new Ot(.3,10,8),u);p.position.y=.75,x.position.y=1.65,m.add(p),m.add(x),m.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector(nn,.55),n.add(m),Vr.push(u)}}return R_(n),Se.add(n),n}pn(new Ut,n=>{if(!Vr.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of Vr)t.emissiveIntensity=e});function eo(n){return Ss=xe.clamp(n,0,ta.length-1),se=ta[Ss],ii.length=0,sa.length=0,La(n0),La(i0),La(s0),La(a0),n0=g_(),i0=M_(),s0=d_(),a0=P_(),bd(),Xe.trackName.textContent=se.name,Xe.courseName&&(Xe.courseName.textContent=se.name),Xe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Ss)}),se.name}eo(0);function L_(){wc&&Se.remove(wc),Jt.length=0;const n=new tt,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Rt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:wt,blending:ai}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const a=i[s],r=ce(a.x,a.z)+4.2,o=new tt,c=new z(new As(5.6,.22,12,52),e.clone());c.rotation.y=a.yaw,o.add(c);const h=new z(new _n(4.7,32),t.clone());h.rotation.y=a.yaw,o.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const m of[-5.1,5.1]){const p=new z(new qe(.11,.16,6.2,8),d);p.position.set(Math.cos(a.yaw)*m,-1.1,Math.sin(a.yaw)*m),o.add(p)}const u=new z(new Ot(.45,16,10),e.clone());u.position.y=4.1,o.add(u),o.position.set(a.x,r,a.z),o.userData.index=s,o.userData.baseY=r,o.userData.label=a.label,n.add(o),Jt.push({...a,y:r,radius:8.5,marker:o,collected:!1})}pn(n,s=>{for(let a=0;a<Jt.length;a++){const r=Jt[a],o=a===l.objectiveIndex;r.marker.visible=!r.collected||o,r.marker.position.y=r.y+Math.sin(s*2.2+a)*.35,r.marker.rotation.z=Math.sin(s*1.3+a)*.035,r.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),r.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),Se.add(n),wc=n}L_();function D_(){const n=new tt,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,a=-1330+Math.random()*1620,r=15+Math.random()*12;if(Ln(s,a,r*2+14,r*2+14,10)||En(s,a,r).clearance<-6||Jt.some(d=>Math.hypot(d.x-s,d.z-a)<r+26)||na.some(d=>Math.hypot(d.x-s,d.z-a)<d.rx+r+60)||un.some(d=>Math.abs(d.x-s)<d.hw+r+2&&Math.abs(d.z-a)<d.hd+r+2)||gi.some(d=>{const u=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-a)<u+r+2})||Ua.some(d=>Math.hypot(d.x-s,d.z-a)<(d.radius||4)+r+2))continue;const o=ce(s,a);if(Math.max(Math.abs(ce(s+r,a)-o),Math.abs(ce(s-r,a)-o),Math.abs(ce(s,a+r)-o),Math.abs(ce(s,a-r)-o))>1.7)continue;const c=new z(new Sl(r*.96,r*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,a),c.renderOrder=-4,n.add(c);const h=new z(new _n(r,36),Mf(Math.max(1.2,r/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,a),h.renderOrder=-3,n.add(h),_f(s,a,r*.98),t++}Me.ponds=t,Se.add(n),bd()}D_();const hn=gd(3375807,15905331);hn.visible=!1,hn.scale.setScalar(1.06),Se.add(hn);const Gi=new P(0,0,0);let Ch=0,de=null;function I_(){const n=new tt,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),a=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),r=(h,d,u,m,p,x,M=0,g=0,f=0)=>{const y=new z(d,u);return y.name=h,y.position.set(m,p,x),y.rotation.set(M,g,f),n.add(y),y};r("cabin hull",new le(2.5,2,4.4),e,0,2.1,-.4),r("cabin floor pan",new le(2.6,.4,4.8),t,0,1.05,-.3),r("nose glass",new le(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),r("left door glass",new le(.1,1.1,2),i,-1.28,2.3,-.7),r("right door glass",new le(.1,1.1,2),i,1.28,2.3,-.7),r("roof turbine housing",new le(1.5,.8,2.4),t,0,3.4,-.2),r("exhaust stub",new qe(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),r("tail boom",new le(.55,.6,4.6),e,0,2.7,3.4,.02),r("tail fin",new le(.14,1.5,1),e,0,3.4,5.5,0,0,0),r("tail plane",new le(1.5,.12,.6),e,0,3,4.6),r("nose lamp",new le(.5,.2,.12),a,0,1.6,-2.95);for(const h of[-1,1])r("skid rail",new le(.16,.16,4.4),s,h*1.15,.32,-.4),r("skid strut front",new le(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),r("skid strut rear",new le(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);r("rotor hub",new qe(.22,.28,.5,10),s,0,3.95,-.2);const o=new tt;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new z(new le(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new tt;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new z(new le(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function F_(){let n=null;for(let d=0;d<700&&!n;d++){const u=-520+Math.random()*1040,m=-1200+Math.random()*1500;if(Math.hypot(u-80,m-300)>(d<350?420:1200)||Ln(u,m,26,26,6))continue;const p=ce(u,m);Math.max(Math.abs(ce(u+11,m)-p),Math.abs(ce(u-11,m)-p),Math.abs(ce(u,m+11)-p),Math.abs(ce(u,m-11)-p))>.8||un.some(x=>Math.abs(x.x-u)<x.hw+13&&Math.abs(x.z-m)<x.hd+13)||Ua.some(x=>Math.hypot(x.x-u,x.z-m)<(x.radius||4)+13)||na.some(x=>Math.hypot(x.x-u,x.z-m)<x.rx+16)||Jt.some(x=>Math.hypot(x.x-u,x.z-m)<24)||En(u,m,12).clearance<2||(n={x:u,z:m,y:p})}n||(n={x:150,z:330,y:ce(150,330)});const e=new tt,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new z(new qe(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const a=s.getContext("2d");a.strokeStyle="#ffd45b",a.lineWidth=12,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke(),a.fillStyle="#ffd45b",a.font="900 150px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("H",128,136);const r=new en(s);r.colorSpace=Lt;const o=new z(new _n(9.6,36),new Rt({map:r,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const u=d/8*Math.PI*2,m=new z(new Ot(.22,8,6),c);m.position.set(n.x+Math.cos(u)*10.2,n.y+.34,n.z+Math.sin(u)*10.2),e.add(m)}Se.add(e);const h=I_();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Se.add(h.mesh),de={pad:n,pos:new P(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new P,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},de.mesh.quaternion.setFromAxisAngle(nn,-de.yaw),Me.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}F_();var Pi=[],Rf=null;function U_(n,e){if(!Pi)return 0;for(const t of Pi){const i=n-t.x,s=e-t.z,a=i*t.fx+s*t.fz,r=-i*t.fz+s*t.fx;if(!(a<0||a>t.len||Math.abs(r)>t.w*.5))return Rf=t,a/t.len*t.h}return 0}function z_(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),a=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let r=0;r<700&&Pi.length<6;r++){const o=n[Pi.length%n.length],{len:c,h}=o,d=Math.random()<.5,u=Math.round((Be.x1-Be.x0)/Be.pitch),m=(d?Be.x0:Be.zFar)+(Math.random()*(d?u:Math.round((Be.zNear-Be.zFar)/Be.pitch))|0)*Be.pitch,p=(Math.random()<.5?-1:1)*(Be.streetW*.5+10+Math.random()*9),x=d?Be.zFar+120+Math.random()*(Be.zNear-Be.zFar-240):Be.x0+120+Math.random()*(Be.x1-Be.x0-240),M=d?m+p:x,g=d?x:m+p,f=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(f),v=-Math.cos(f),_=M+y*c,E=g+v*c;if(Ln(M,g,e+4,e+4,2)||Ln(_,E,e+4,e+4,2)||En(M,g,8).clearance<11||En(_,E,8).clearance<11||Ks(M,g).depth>0||Ks(_,E).depth>0||Ks(_+y*40,E+v*40).depth>0||Math.abs(ce(M,g)-ce(_,E))>1.1||Pi.some(w=>Math.hypot(w.x-M,w.z-g)<150))continue;const T=(w,b,L,D)=>w.some(V=>Math.abs(b-V.x)<(V.hw??V.radius??0)+D&&Math.abs(L-V.z)<(V.hd??V.radius??0)+D);let A=!1;for(const[w,b,L]of[[M-y*45,g-v*45,6],[M-y*22,g-v*22,6],[M,g,7],[_,E,7],[_+y*45,E+v*45,9],[_+y*95,E+v*95,9]])if(T(un,w,b,L)||T(gi,w,b,L)){A=!0;break}if(A)continue;const C={x:M,z:g,yaw:f,fx:y,fz:v,len:c,w:e,h,type:o.type,rail:o.rail};if(o.type==="hoop"){const w=ce(M,g)+h+13;C.hoop={x:_+y*28,y:w,z:E+v*28,r:7}}Pi.push(C)}for(const r of Pi){const o=new W({color:r.rail,roughness:.4,emissive:r.rail,emissiveIntensity:1.6});if(r.hoop){const C=new z(new As(r.hoop.r,.5,10,30),a);C.position.set(r.hoop.x,r.hoop.y,r.hoop.z),C.lookAt(r.hoop.x+r.fx,r.hoop.y,r.hoop.z+r.fz),Se.add(C)}const c=ce(r.x,r.z)+.05,h=-r.fz,d=r.fx,u=r.w*.5,m=[r.x-h*u,c,r.z-d*u],p=[r.x+h*u,c,r.z+d*u],x=[r.x+r.fx*r.len-h*u,c,r.z+r.fz*r.len-d*u],M=[r.x+r.fx*r.len+h*u,c,r.z+r.fz*r.len+d*u],g=[x[0],c+r.h,x[2]],f=[M[0],c+r.h,M[2]],y=[...m,...p,...f,...m,...f,...g,...x,...M,...f,...x,...f,...g,...m,...g,...x,...p,...M,...f],v=new jt;v.setAttribute("position",new St(y,3)),v.computeVertexNormals();const _=new z(v,i);_.castShadow=!1,_.receiveShadow=!0,Se.add(_);const E=Math.hypot(r.len,r.h),T=new le(.26,.24,E),A=new z(new le(1.1,.1,E*.94),s);A.position.set(r.x+r.fx*r.len/2,c+r.h/2+.08,r.z+r.fz*r.len/2),A.lookAt(r.x+r.fx*r.len,c+r.h+.08,r.z+r.fz*r.len),Se.add(A);for(const C of[-1,1]){const w=new z(T,o),b=r.x+h*u*C,L=r.z+d*u*C,D=r.x+r.fx*r.len+h*u*C,V=r.z+r.fz*r.len+d*u*C;w.position.set((b+D)/2,c+r.h/2+.12,(L+V)/2),w.lookAt(D,c+r.h+.12,V),Se.add(w);const j=new z(new Ot(.34,10,8),t);j.position.set(D,c+r.h+.55,V),Se.add(j)}}Me.stuntRamps=Pi.length}z_();function N_(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];Me.propPlanes=0;for(const e of n){const t=new tt,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),a=new z(new qe(.85,1.15,7.2,10),i);a.rotation.x=Math.PI/2,t.add(a);const r=new z(new Li(1.16,2.1,10),i);r.rotation.x=-Math.PI/2,r.position.z=-4.6,t.add(r);const o=new z(new Ot(.85,10,8),s);o.scale.set(1,.7,1.5),o.position.set(0,.75,-.9),t.add(o);const c=new z(new le(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new z(new le(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new z(new le(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const u=new tt,m=new le(.26,5.4,.12),p=new z(m,s),x=new z(m,s);x.rotation.z=Math.PI/2,u.add(p),u.add(x),u.position.z=-5.75,t.add(u),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Se.add(t);const M=Math.random()*Math.PI*2;pn(t,(g,f)=>{t.position.x+=e.dir*e.speed*f,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+M)*5,t.rotation.z=Math.sin(g*.22+M)*.14,u.rotation.z+=f*38}),Me.propPlanes++}}N_();const lt={cars:[],evadeT:0,nearest:1/0,blocks:[],blockCd:6,bustT:0,panicTick:0},Pf=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),Lf=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function to(n){if(l.mode!=="roam")return;const e=Math.ceil(l.heat||0);l.heat=Math.min(5,(l.heat||0)+n),lt.evadeT=0,Math.ceil(l.heat)>e&&(l.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`,l.messageTimer=1.2)}function Df(){const n=Jr("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new z(new le(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new z(new le(.62,.24,.46),Pf),s=new z(new le(.62,.24,.46),Lf);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(a=>(a.castShadow=!1,a.receiveShadow=!0)),n}function r0(n,e){return un.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||Ks(n,e).depth>.35}function k_(){const n=Math.random()*Math.PI*2,e=xe.clamp(l.roamPos.x+Math.cos(n)*320,-780,780),t=xe.clamp(l.roamPos.z+Math.sin(n)*320,-1580,440),i=Df();Se.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return lt.cars.push(s),li("whoosh",.2,.8,.1),s}function If(n){Rs(n.mesh),lt.cars=lt.cars.filter(e=>e!==n)}function Ff(n){for(const e of n.meshes)Rs(e);lt.blocks=lt.blocks.filter(e=>e!==n)}function _d(){for(const n of[...lt.cars])If(n);for(const n of[...lt.blocks])Ff(n);lt.evadeT=0,lt.nearest=1/0,lt.bustT=0,lt.blockCd=6,l.heat=0}function O_(){const n=Math.sin(l.roamYaw),e=-Math.cos(l.roamYaw),t=l.roamPos.x+n*215,i=l.roamPos.z+e*215,s=Be.x0+Math.round((t-Be.x0)/Be.pitch)*Be.pitch,a=Be.zNear-Math.round((Be.zNear-i)/Be.pitch)*Be.pitch,r=Math.abs(t-s),o=Math.abs(i-a);let c,h,d,u,m,p;if(r<=o&&r<Be.streetW*.6)c=s,h=i,d=1,u=0,m=0,p=1;else if(o<Be.streetW*.6)c=t,h=a,d=0,u=1,m=1,p=0;else return!1;if(c<Be.x0||c>Be.x1||h>Be.zNear||h<Be.zFar||lt.blocks.some(v=>Math.hypot(v.x-c,v.z-h)<140))return!1;const x=ce(c,h),M=Be.streetW+3,g=new W({color:1907997,roughness:.6,emissive:11674146,emissiveIntensity:.5}),f=new z(new le(.9,.16,M),g);f.position.set(c,x+.1,h),f.lookAt(c+d,x+.1,h+u),Se.add(f);const y=[f];for(const v of[-1,1]){const _=Df();_.position.set(c+d*v*(M*.32),x+.06,h+u*v*(M*.32)),_.rotation.y=Math.atan2(d,u)+v*.7,Se.add(_),y.push(_)}return lt.blocks.push({x:c,z:h,latX:d,latZ:u,fwX:m,fwZ:p,w:M,meshes:y,age:0,hitT:0}),l.message="ROADBLOCK AHEAD!",l.messageTimer=1.3,Tn(500,.2,"square",.1),!0}function B_(){const n=Math.min(600,Math.round(l.score*.12)+150);l.score=Math.max(0,l.score-n),Me.busts=(Me.busts||0)+1,l.message=`BUSTED! -${n}`,l.messageTimer=2,l.cameraShake=.5,Tn(220,.5,"sawtooth",.14),Ke.state==="active"&&Gr("busted"),l.drivingStolen&&st&&(Dl(),l.vehicle="foot",l.speed=0,hn.visible=!0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.message="BUSTED! Ride confiscated"),_d()}function V_(n,e){const t=l.roamPos.x-n.x,i=l.roamPos.z-n.z,s=Math.hypot(t,i),a=l.heat||0;let r=Math.atan2(t,-i);const o=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(r0(n.x+o*17,n.z+c*17)){const u=n.yaw-.7,m=n.yaw+.7;r=!r0(n.x+Math.sin(u)*17,n.z-Math.cos(u)*17)?u:m}const h=Math.atan2(Math.sin(r-n.yaw),Math.cos(r-n.yaw));n.yaw+=xe.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+a*6,Math.abs(l.speed)+30):Math.max(42,Math.abs(l.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=xe.clamp(n.x,-800,800),n.z=xe.clamp(n.z,-1600,460),n.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const u of n.mesh.userData.wheels||[])u.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,l.vehicle==="car"?(Xf(new P(n.x,l.roamPos.y+.8,n.z),Math.abs(l.speed-n.speed)+24,"PIT MANEUVER!"),l.speed*=.78,n.speed*=.4,to(.3)):(l.cameraShake=Math.max(l.cameraShake,.3),l.message="Get out of there!",l.messageTimer=.9)),s}pn(new Ut,(n,e)=>{const t=Math.floor(n*3.4)%2;if(Pf.emissiveIntensity=t?2.6:.35,Lf.emissiveIntensity=t?.35:2.6,l.mode!=="roam"){lt.cars.length&&_d();return}const i=l.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;lt.cars.length<s;)k_();for(;lt.cars.length>s;)If(lt.cars[lt.cars.length-1]);let a=1/0;for(const r of[...lt.cars])a=Math.min(a,V_(r,e));lt.nearest=a,i>0&&a<12&&Math.abs(l.speed)<8?(lt.bustT+=e,lt.bustT>2.2&&(lt.bustT=0,B_())):lt.bustT=Math.max(0,lt.bustT-e*1.5),i>=4&&(lt.blockCd-=e,lt.blockCd<=0&&Math.abs(l.speed)>30&&(O_(),lt.blockCd=12));for(const r of[...lt.blocks]){r.age+=e,r.hitT>0&&(r.hitT-=e),(r.age>40||i<4)&&Ff(r);const o=l.roamPos.x-r.x,c=l.roamPos.z-r.z,h=o*r.latX+c*r.latZ,d=o*r.fwX+c*r.fwZ;Math.abs(h)<r.w*.5&&Math.abs(d)<1.5&&!l.roamAir&&l.vehicle==="car"&&r.hitT<=0&&(r.hitT=2.5,l.spikedT=3.5,l.speed*=.5,l.damage=xe.clamp(l.damage+6,0,100),l.message="SPIKE STRIP!",l.messageTimer=1.2,l.cameraShake=Math.max(l.cameraShake,.4),li("skid",.55,1.25,.1),to(.15))}if(lt.panicTick-=e,lt.panicTick<=0&&i>0){lt.panicTick=.4;for(const r of An){const o=r.actor;if(!o||!o.type||o.stolen||o.panicT>0)continue;let c=Math.hypot(l.roamPos.x-r.x,l.roamPos.z-r.z)<45;if(!c){for(const h of lt.cars)if(Math.hypot(h.x-r.x,h.z-r.z)<65){c=!0;break}}c&&(o.panicT=1.6)}}i>0&&(a>240?(lt.evadeT+=e,lt.evadeT>9&&(l.heat=Math.max(0,i-1),lt.evadeT=l.heat>0?4:0,l.heat===0&&(l.score+=500,Oi("+500 ESCAPED THE LAW"),Tn(980,.22),l.message="You lost them",l.messageTimer=1.4))):lt.evadeT=Math.max(0,lt.evadeT-e*.6)),Me.police=lt.cars.length});const Ke={state:"idle",type:null,mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:5,beacons:[]},o0=["van","boxTruck","taxi","pickup"];function Uf(n){const e=new z(new qe(3.4,3.4,340,12,1,!0),new Rt({color:n,transparent:!0,opacity:.15,depthWrite:!1,side:wt,blending:ai}));return e.frustumCulled=!1,Se.add(e),e}function zf(){for(const n of Ke.beacons)n.geometry.dispose(),n.material.dispose(),Se.remove(n);Ke.beacons=[]}function Rh(n,e){for(let t=0;t<220;t++){const i=Math.random()<.5,s=i?Be.x0+(Math.random()*Math.round((Be.x1-Be.x0)/Be.pitch)|0)*Be.pitch:Be.zNear-(Math.random()*Math.round((Be.zNear-Be.zFar)/Be.pitch)|0)*Be.pitch,a=(Math.random()<.5?-1:1)*(Be.streetW*.5+6),r=i?Be.zFar+100+Math.random()*(Be.zNear-Be.zFar-200):Be.x0+100+Math.random()*(Be.x1-Be.x0-200),o=i?s+a:r,c=i?r:s+a,h=Math.hypot(o-l.roamPos.x,c-l.roamPos.z);if(!(h<n||h>e)&&!Ln(o,c,8,8,1)&&!(Ks(o,c).depth>0)&&!un.some(d=>Math.abs(o-d.x)<(d.hw??d.radius??0)+5&&Math.abs(c-d.z)<(d.hd??d.radius??0)+5))return{x:o,z:c,yaw:i?0:Math.PI/2}}return null}function Nf(){const n=Rh(200,700);if(!n){Ke.cooldown=4;return}const e=o0[Math.random()*o0.length|0];Ke.type=e,Ke.mesh=Jr(e,[16770048,5814783,16752762,9498256][Math.random()*4|0]),Ke.mesh.userData.stolenYOff=.57,Ke.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),Ke.mesh.rotation.y=-n.yaw,Se.add(Ke.mesh),Ke.pickup=n;const t=Uf(3531007);t.position.set(n.x,ce(n.x,n.z)+150,n.z),Ke.beacons.push(t),Ke.state="available",l.message=`Delivery job: grab the ${e.toUpperCase()} at the cyan beacon`,l.messageTimer=2}function G_(){if(Ke.state!=="available"||!Ke.mesh||l.roamPos.distanceTo(Ke.mesh.position)>6)return!1;Td();const n=Ke.mesh;return st={mesh:n,type:Ke.type,actor:null,parked:null,parkedYaw:0,job:!0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.position.x,ce(n.position.x,n.position.z)+Un,n.position.z),l.roamYaw=Ke.pickup.yaw,l.camYaw=l.roamYaw,l.speed=0,hn.visible=!1,li("jack",.5,1,.08)||Tn(340,.18,"square",.1),Qn(),H_(),!0}function H_(){const n=Rh(420,900)||Rh(250,1100);if(!n){Gr("no route");return}Ke.dest=n,Ke.timeLeft=Math.round(14+Math.hypot(n.x-l.roamPos.x,n.z-l.roamPos.z)*.062),zf();const e=Uf(16766720);e.position.set(n.x,ce(n.x,n.z)+150,n.z),Ke.beacons.push(e),Ke.state="active",l.message=`Deliver the ${Ke.type.toUpperCase()} to the gold beacon — ${Ke.timeLeft}s`,l.messageTimer=2.2}function yd(n){zf(),Object.assign(Ke,{state:"idle",mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:n})}function Gr(n){Ke.state!=="idle"&&(st?.job?(Dl(),l.vehicle==="car"&&(l.vehicle="foot",hn.visible=!0,l.speed=0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05)):Ke.mesh&&Rs(Ke.mesh),yd(9),n!=="silent"&&(l.message=`Delivery failed — ${n}`,l.messageTimer=1.6,Tn(240,.3,"sawtooth",.1)),Me.deliveryFails=(Me.deliveryFails||0)+1)}function W_(n){Rs(n),yd(9),l.message="Delivery failed — vehicle abandoned",l.messageTimer=1.5,Me.deliveryFails=(Me.deliveryFails||0)+1}function X_(){const n=1200+Math.ceil(Ke.timeLeft)*10;l.score+=n,Me.deliveries=(Me.deliveries||0)+1,Oi(`+${n} DELIVERED`,!0),Tn(980,.18),setTimeout(()=>Tn(1320,.22),100);const e=st?.mesh;st=null,l.drivingStolen=!1,e&&Rs(e),l.vehicle="foot",l.speed=0,hn.visible=!0,l.roamPos.x-=Math.cos(l.roamYaw)*3.4,l.roamPos.z-=Math.sin(l.roamYaw)*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,yd(8),l.message="Delivered! Another job will turn up",l.messageTimer=1.8}pn(new Ut,(n,e)=>{if(l.mode!=="roam"){Ke.state!=="idle"&&Gr("silent");return}Ke.state==="idle"?(Ke.cooldown-=e,Ke.cooldown<=0&&Nf()):Ke.state==="active"&&(Ke.timeLeft-=e,Ke.timeLeft<=0?Gr("time's up"):l.drivingStolen&&st?.job&&Math.hypot(l.roamPos.x-Ke.dest.x,l.roamPos.z-Ke.dest.z)<15&&Math.abs(l.speed)<26&&X_())});pn(new Ut,(n,e)=>{if(!de)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;de.rpm+=(t-de.rpm)*Math.min(1,e*(t?1.4:.5)),de.rotor.rotation.y+=de.rpm*26*e,de.tailRotor.rotation.x+=de.rpm*42*e});const q_=new Rt({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),Qo=Array.from({length:42},()=>{const n=new z(new Ot(.14,6,5),q_);return n.visible=!1,Se.add(n),{mesh:n,life:0,velocity:new P}}),Y_=new Rt({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:wt}),Ph=Array.from({length:14},()=>{const n=new z(new Sl(.82,1,28),Y_.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Se.add(n),{mesh:n,life:0,maxLife:1}});function kf(n,e,t=1){const i=Ph.find(s=>s.life<=0)||Ph[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,ce(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function $_(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=Qo.find(a=>a.life<=0)||Qo[i%Qo.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}kf(n.x,n.z,1.6)}pn(new Ut,(n,e)=>{for(const t of Qo)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of Ph)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const ja=new RM(an);ja.addPass(new PM(Se,ye));const Of=new Xa(new Ue(window.innerWidth,window.innerHeight),.4,.72,.86);ja.addPass(Of);ja.addPass(new LM);const Z_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},vr=new uf(Z_);ja.addPass(vr);const K_=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Sr=Array.from({length:72},()=>{const n=new z(new Ot(.1,8,5),K_);return n.visible=!1,Se.add(n),{mesh:n,life:0,velocity:new P}}),J_=new Rt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:wt}),Tr=Array.from({length:90},()=>{const n=new z(new _n(1,18),J_.clone());return n.visible=!1,Se.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),j_=new W({color:2962232,roughness:.58,metalness:.34}),Er=Array.from({length:48},()=>{const n=new z(new le(.18,.08,.26),j_);return n.visible=!1,Se.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Ae=null;function Bf(){if(Ae)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),a=new Float32Array(1024);for(let C=0;C<1024;C++){const w=(C/511.5-1)*1.6;a[C]=4*w/(1+3*Math.abs(w))}s.curve=a,s.oversample="2x",s.connect(t);const r=n.createGain();r.gain.value=1,r.connect(s);const o=(C,w,b)=>{const L=n.createOscillator(),D=n.createGain();return L.type=C,D.gain.value=w,L.connect(D),D.connect(b),L.start(),{o:L,g:D}},c=o("sine",.5,t),h=o("sawtooth",.3,r),d=o("sawtooth",.3,r),u=o("triangle",.03,t),m=n.createOscillator(),p=n.createGain();m.type="sine",m.frequency.value=12,p.gain.value=0,m.connect(p),p.connect(r.gain),m.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),M=x.getChannelData(0);for(let C=0;C<M.length;C++)M[C]=Math.random()*2-1;const g=(C,w,b,L)=>{const D=n.createBufferSource(),V=n.createBiquadFilter(),j=n.createGain();return D.buffer=x,D.loop=!0,D.playbackRate.value=L,V.type=C,V.frequency.value=w,V.Q.value=b,j.gain.value=1e-4,D.connect(V),V.connect(j),j.connect(e),D.start(),{filter:V,gain:j}},f=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),_=g("bandpass",5200,.3,1),E=n.createGain();E.gain.value=1e-4,E.connect(e);const T=n.createOscillator(),A=n.createGain();T.type="triangle",T.frequency.value=660,A.gain.value=1e-4,T.connect(A),A.connect(e),T.start(),Ae={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:u,burble:{o:m,depth:p},siren:{o:T,g:A},rain:_,wind:f,skid:y,boost:v,musicGain:E,nextNote:0,beat:0,prevBoost:!1}}const Vf={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},Q_=["interceptor","bullet","brawler","zephyr"];function Gf(){return l.mode==="roam"&&l.drivingStolen&&st?Vf[st.type]?st.type:"compact":Q_[Vi]||"interceptor"}function as(){Ae||Bf(),Ae?.ctx.state==="suspended"&&Ae.ctx.resume().catch(()=>{}),sy()}function ka(n){if(!Ae)return;const{ctx:e}=Ae,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Ae.master),t.start(),t.stop(e.currentTime+.24)}function ey(){if(!Ae||li("whoosh",.4,1,.1))return;const{ctx:n}=Ae,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Ae.master),e.start(),e.stop(n.currentTime+.6)}function ty(){if(!Ae||li("splat",.6,1,.14))return;const n=Ae.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=Hf(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Ae.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),a=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),a.gain.setValueAtTime(.22,n.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(a).connect(Ae.master),s.start(),s.stop(n.currentTime+.26)}let Sc=null;function Hf(){if(Sc)return Sc;const n=Ae.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return Sc=e}function ny(n=1){if(!Ae||li("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=Ae,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=Hf(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Ae.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Kn={buffers:{},loops:{},loading:!1},iy=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function sy(){if(!(Kn.loading||!Ae)){Kn.loading=!0;for(const n of iy)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>Ae.ctx.decodeAudioData(e)).then(e=>Kn.buffers[n]=e).catch(()=>{})}}function li(n,e=.5,t=1,i=.06){const s=Ae&&Kn.buffers[n];if(!s)return!1;const a=Ae.ctx,r=a.createBufferSource(),o=a.createGain();return r.buffer=s,r.playbackRate.value=t*(1-i/2+Math.random()*i),o.gain.value=e,r.connect(o).connect(Ae.master),r.start(),!0}function Tc(n,e,t=1e-4){if(Kn.loops[n])return Kn.loops[n];if(!Ae||!Kn.buffers[n])return null;const i=Ae.ctx,s=i.createBufferSource(),a=i.createGain();return s.buffer=Kn.buffers[n],s.loop=!0,a.gain.value=t,s.connect(a),a.connect(e||Ae.master),s.start(),Kn.loops[n]={src:s,gain:a}}const l0={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function c0(n,e,t,i,s,a){const{ctx:r}=Ae,o=r.createOscillator(),c=r.createBiquadFilter(),h=r.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=a,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(Ae.musicGain),o.start(e),o.stop(e+t+.05)}function ay(){const{ctx:n}=Ae,e=60/92/2;for(Ae.nextNote<n.currentTime-1&&(Ae.nextNote=n.currentTime+.08);Ae.nextNote<n.currentTime+.35;){const t=Ae.beat%32,i=t/8|0;t%4===0&&c0(l0.bass[i],Ae.nextNote,.5,"triangle",.5,420),c0(l0.arps[i][t%4],Ae.nextNote,.19,"sawtooth",.16,1300),Ae.nextNote+=e,Ae.beat++}}function Js(n,e=18){const t=Math.min(e,Sr.length);for(let i=0;i<t;i++){const s=Sr.find(a=>a.life<=0)||Sr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Wf(n,e=10,t=1){const i=Math.min(e,Tr.length);for(let s=0;s<i;s++){const a=Tr.find(r=>r.life<=0)||Tr[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),a.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),a.mesh.material.opacity=.18+Math.random()*.12,a.mesh.scale.setScalar(.8+Math.random()*1.2*t),a.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),a.life=a.maxLife=.55+Math.random()*.55,a.spin=(Math.random()-.5)*2.2}}function ry(n,e=8,t=1){const i=Math.min(e,Er.length);for(let s=0;s<i;s++){const a=Er.find(r=>r.life<=0)||Er[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),a.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),a.mesh.scale.setScalar(.8+Math.random()*1.8*t),a.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),a.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),a.life=.65+Math.random()*.55}}function Xf(n,e=Math.abs(l.speed),t="CRASH"){const i=xe.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=xe.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),Js(n,Math.round(10+i*24)),Wf(n,Math.round(5+i*12),i),ry(n,Math.round(3+i*8),i),li("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||ka(18+i*34)}function oy(n){for(const e of Sr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of Tr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(ye.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of Er)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function ly(){if(!Ae)return;const{ctx:n}=Ae,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,a=xe.clamp((s-900)/6600,0,1),r=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=Vf[Gf()],h=i?26+(de?.rpm||0)*14:(38+a*124)*c.fMul;Ae.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),Ae.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),Ae.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),Ae.whine.o.frequency.setTargetAtTime(i?620+r*4:h*c.whineMul,e,.03),Ae.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),Ae.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),Ae.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),Ae.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+a*a*a*.85)*2,e,.08),Ae.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),Ae.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-a*.8),e,.1),Ae.filter.frequency.setTargetAtTime((380+a*2300+r*5)*c.cutoff*(1-.6*o),e,.06),Ae.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.055+a*.055:1e-4)*(1-.42*o),e,.07),Ae.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Ae.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const d=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0,u=Tc("skid");Ae.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(u?.05:.15):1e-4,e,.09),u&&u.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const m=Tc("rotor");m&&(m.gain.gain.setTargetAtTime(i?.06+(de?.rpm||0)*.3:1e-4,e,i?.3:.15),m.src.playbackRate.setTargetAtTime(.65+(i&&de?.rpm||0)*.5,e,.4)),l.boosting&&!Ae.prevBoost&&ey(),Ae.prevBoost=!!l.boosting,Ae.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),Ae.boost.filter.frequency.setTargetAtTime(l.boosting?420+r*3:260,e,.1),Ae.rain&&Ae.rain.gain.gain.setTargetAtTime(qa()>.02&&l.mode!=="menu"?qa()*.045:1e-4,e,.4);const p=l.mode==="roam"&&(l.heat||0)>0&&lt.nearest<460,x=p?Math.min(.06,(460-lt.nearest)/460*.075):1e-4;Ae.siren.g.gain.setTargetAtTime(x,e,.25),Ae.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const M=localStorage.getItem("steel-ribbon-music")!=="0",g=M?Tc("music",Ae.musicGain,1):Kn.loops.music||null;Ae.musicGain.gain.setTargetAtTime(M?l.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),M&&!g&&ay()}function Hr(n=!1,e=!1,t=!1){Bf(),as(),je.clear(),qr(),Dl();const i=n||e;l.seasonRace=t&&!i;for(let a=0;a<qn.length;a++){const r=qn[a];r.distance=i?-900:-26-a*7,r.finished=0,r.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=mt(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],Fy(),Uy(),Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.resultStats.innerHTML="",Xe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",Xe.trackName.textContent=se.name,Gt.visible=!1,dn&&(dn.visible=!0),document.body.classList.remove("roam-mode"),Xi(),window.__freeCam=!1}function pl(){as(),l.mode="roam",l.practice=!0,l.freeRun=!1,je.clear(),qr();let n=80,e=338;En(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,ce(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ee.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.driftCombo=0,l.driftComboT=0,l.stuntActive=!1,l.stuntPrime=0,l.sloMoT=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",hn.visible=!1,Gr("silent"),Dl(),_d(),de&&(de.pos.set(de.pad.x,de.pad.y+.24,de.pad.z),de.vel.set(0,0,0),de.mesh.position.copy(de.pos));for(const s of Jt)s.collected=!1;l.message="",l.messageTimer=0,jr(!1),Gt.visible=!0,dn&&(dn.visible=!1),document.body.classList.add("roam-mode"),Xi(),window.__freeCam=!1,Xe.menu.classList.add("hidden"),Xe.result.classList.add("hidden"),Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",Qn();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);ye.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),Uh(),ye.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),ye.fov=69,ye.updateProjectionMatrix()}function Qn(){const n=Sd();n.position.set(l.roamPos.x,l.roamPos.y+.3-(n.userData.stolenYOff||0)-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),n.quaternion.setFromAxisAngle(nn,-l.roamYaw),n.rotateZ(-l.wheelSteer*xe.clamp(Math.abs(l.speed)/90,0,1)*.1+(l.roamAir&&l.stuntActive&&l.airRoll||0)),n.rotateX(l.roamAir?l.stuntActive&&l.stuntRamp?.type==="flip"?-(l.flipT||0)*Math.PI*2:xe.clamp(-l.roamVy*.014,-.3,.34):xe.clamp(l.roamSuspension,-.16,.22))}function qf(n,e){let t=null;for(const s of sa)for(const a of s.segments){const r=n-a.a.x,o=e-a.a.z,c=xe.clamp((r*a.abx+o*a.abz)/a.lenSq,0,1),h=a.a.x+a.abx*c,d=a.a.z+a.abz*c,u=Math.hypot(n-h,e-d);if(u>s.halfW+Dn*1.15)continue;const m=xe.lerp(a.a.y,a.b.y,c),p=xe.lerp(a.u0,a.u1,c),x=u+Math.max(0,ce(n,e)-m)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:m,u:p,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:a.abx,tangentZ:a.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function Yf(n,e,t=ce(n,e),i=!1){let s=null;const a=10;for(let o=0;o<se.length;o+=a){if(Bi(o+a*.5))continue;const c=mt(o),h=mt(o+a),d=h.p.x-c.p.x,u=h.p.z-c.p.z,m=Math.max(1e-4,d*d+u*u),p=xe.clamp(((n-c.p.x)*d+(e-c.p.z)*u)/m,0,1),x=c.p.x+d*p,M=c.p.z+u*p,g=n-x,f=e-M,y=Math.hypot(g,f);if(y>se.width*.5+Dn*.45)continue;const v=xe.lerp(c.p.y,h.p.y,p)+.58;if(!i&&t<v-5)continue;const _=new P(u,0,-d).normalize(),E=xe.clamp(g*_.x+f*_.z,-se.width*.44,se.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:o+a*p,lateral:E,tangentX:d,tangentZ:u,dist:y})}if(!s)return null;const r=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=r,s.tangentZ/=r,s}function qs(n,e,t=l.roamPos.y){const i=ce(n,e),s=U_(n,e);let a=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const r=qf(n,e);r&&r.y>=i-1.2&&(a=r);const o=Yf(n,e,Math.max(t,a.y));return!(a.kind==="ramp"&&a.rampType==="off")&&o&&o.y>=a.y-.8&&(a=o),a}function h0(n){if(n.rampType==="off"||l.drivingStolen)return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=mt(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=xe.clamp(n.lateral??0,-se.width*.32,se.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=xe.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),jr(!1),Gt.visible=!1,dn&&(dn.visible=!0),document.body.classList.remove("roam-mode"),Xi(),Xe.position.textContent="FREE RUN",Xe.trackName.textContent=se.name,Qn(),!0}function cy(n,e,t){if(l.mode!=="race")return!1;const i=t.tangent.x,s=t.tangent.z,a=Math.max(1e-4,Math.hypot(i,s));l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(n,ce(n,e)+Un,e),l.roamYaw=Math.atan2(i/a,-s/a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=xe.clamp(Math.abs(l.speed)*.6,12,70),l.grounded=!0,l.yVel=0,l.airtime=0,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.damage=xe.clamp(l.damage+10,0,100),l.cameraShake=Math.max(l.cameraShake,.8),l.message="Off the ribbon — welcome to the streets",l.messageTimer=1.8,li("land",.6,.92,.08)||ka(30),Js(new P(n,l.roamPos.y+.4,e),20),jr(!1),Gt.visible=!0,dn&&(dn.visible=!1),document.body.classList.add("roam-mode"),Xi(),l.vehicle="car",hn.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",Qn();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),ye.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),ye.fov=69,ye.updateProjectionMatrix(),!0}function hy(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,a=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+Un,t.z+a*3.5),l.roamYaw=Math.atan2(s,-a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=xe.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),jr(!1),Gt.visible=!0,dn&&(dn.visible=!1),document.body.classList.add("roam-mode"),Xi(),l.vehicle="car",hn.visible=!1,Xe.position.textContent="FREE ROAM",Xe.trackName.textContent="City Streets",Qn();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),ye.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),ye.fov=69,ye.updateProjectionMatrix(),Js(l.roamPos.clone().add(new P(0,.6,0)),10),!0}function dy(){const n=Cl.set(0,0,-1).applyQuaternion(ye.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),driftCombo:l.driftCombo||0,driftComboT:+(l.driftComboT||0).toFixed(2),driftT:+(l.driftT||0).toFixed(2),driftAcc:+(l.driftAcc||0).toFixed(1),roamView:Da,heat:+(l.heat||0).toFixed(2),police:lt.cars.length,policeNearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),roadblocks:lt.blocks.length,spikedT:+(l.spikedT||0).toFixed(2),rain:+qa().toFixed(2),job:{state:Ke.state,type:Ke.type,timeLeft:+Ke.timeLeft.toFixed(1)},stuntActive:!!l.stuntActive,stuntType:l.stuntActive&&l.stuntRamp?.type||null,flipT:+(l.flipT||0).toFixed(2),bullseye:!!l.stuntBullseye,sloMoT:+(l.sloMoT||0).toFixed(2),stunts:Me.stunts||0,airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",drivingStolen:!!l.drivingStolen,stolenType:l.drivingStolen&&st?.type||null,altitude:+(l.roamPos.y-ce(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var js=document.createElement("canvas");js.id="minimap",js.width=256,js.height=256;document.querySelector("#app")?.appendChild(js);var Lh=null,uy=0,Ys={cx:0,cz:-570,span:2180};function vn(n,e,t){return[((n-Ys.cx)/Ys.span+.5)*t,((e-Ys.cz)/Ys.span+.5)*t]}function bd(){if(!Ys)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Be.x0;s<=Be.x1+1;s+=Be.pitch){const[a,r]=vn(s,Be.zNear,n),[o,c]=vn(s,Be.zFar,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}for(let s=Be.zNear;s>=Be.zFar-1;s-=Be.pitch){const[a,r]=vn(Be.x0,s,n),[o,c]=vn(Be.x1,s,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Pl())if(s.courseIndex===Ss){const[a,r]=vn(s.x,s.z,n);i?t.moveTo(a,r):t.lineTo(a,r),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of na){const[a,r]=vn(s.x,s.z,n);t.beginPath(),t.ellipse(a,r,Math.max(3,s.rx/Ys.span*n),Math.max(3,s.rz/Ys.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of Pi||[]){const[a,r]=vn(s.x,s.z,n);t.save(),t.translate(a,r),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}Lh=e}function fy(){const n=l.mode==="roam";if((js.style.display=n?"block":"none")&&!n||!n||!Lh||uy++%2)return;const e=js.width,t=js.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(Lh,0,0,e,e);for(const a of sa)if(a.rampType==="on"&&a.points?.length){const r=a.points[0],[o,c]=vn(r.x,r.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let a=0;a<Jt.length;a++){const r=Jt[a],[o,c]=vn(r.x,r.z,e),h=a===l.objectiveIndex%Jt.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(ul*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const a of An){const[r,o]=vn(a.x,a.z,e);t.fillRect(r-1.4,o-1.4,2.8,2.8)}if(de){const[a,r]=vn(de.pad.x,de.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",a,r+4),l.vehicle!=="heli"){const[o,c]=vn(de.pos.x,de.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"||l.drivingStolen){const[a,r]=vn(Gi.x,Gi.z,e);t.fillStyle="#7dc4ff",t.fillRect(a-2.4,r-2.4,4.8,4.8)}if(st?.parked){const[a,r]=vn(st.parked.x,st.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(a-2.2,r-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const a of lt.cars){const[r,o]=vn(a.x,a.z,e);t.beginPath(),t.arc(r,o,3.2,0,Math.PI*2),t.fill()}for(const a of lt.blocks){const[r,o]=vn(a.x,a.z,e);t.fillStyle="#ff8080",t.fillRect(r-4,o-1.4,8,2.8)}if(Ke.state==="available"&&Ke.pickup){const[a,r]=vn(Ke.pickup.x,Ke.pickup.z,e);t.fillStyle="#35e0ff",t.fillRect(a-2.6,r-2.6,5.2,5.2)}if(Ke.state==="active"&&Ke.dest){const[a,r]=vn(Ke.dest.x,Ke.dest.z,e);t.save(),t.translate(a,r),t.rotate(Math.PI/4),t.fillStyle="#ffd700",t.fillRect(-3,-3,6,6),t.restore()}const[i,s]=vn(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}bd();let Ci=null;function py(){Ci||(Ci=new z(new qe(2.4,3.2,620,12,1,!0),new Rt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:ai,side:wt,fog:!1})),Ci.renderOrder=5,Se.add(Ci));const n=l.mode==="roam"&&Jt.length>0;if(Ci.visible=n,!n)return;const e=Jt[l.objectiveIndex%Jt.length];Ci.position.set(e.x,e.y+296,e.z),Ci.material.opacity=.1+Math.sin(ul*3.1)*.04}let ps=null;function wd(){if(l.mode!=="roam"||Jt.length===0){ps=null;return}const n=Jt[l.objectiveIndex%Jt.length];if(!n)return;const e=ps?.x??l.roamPos.x,t=ps?.z??l.roamPos.z,i=ps?.y??l.roamPos.y,s=l.roamPos.x-e,a=l.roamPos.z-t,r=s*s+a*a;if(ps??={x:0,y:0,z:0},ps.x=l.roamPos.x,ps.y=l.roamPos.y,ps.z=l.roamPos.z,r>4e4)return;const o=r>1e-6?xe.clamp(((n.x-e)*s+(n.z-t)*a)/r,0,1):0,c=e+s*o-n.x,h=t+a*o-n.z,d=Math.abs(i+(l.roamPos.y-i)*o-n.y),u=n.radius+1.2;c*c+h*h>u*u||d>10||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%Jt.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,Oi(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),Tn(880,.16),setTimeout(()=>Tn(1245,.2),90),Js(new P(n.x,n.y,n.z),18))}function $f(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),s=xe.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*pf,a=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const _=l.speed<0?38:0;l.speed+=((a?70:42)*bs().accel+_)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=xe.clamp(l.speed,-24,135*bs().top*(l.spikedT>0?.62:1)),l.boosting=a,a?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*bs().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n)),l.spikedT>0&&(l.spikedT-=n);const r=-l.wheelSteer*.55,o=Sd().userData.frontWheels;if(o&&(o[0].rotation.y=r,o[1].rotation.y=r),l.drivingStolen&&st)for(const _ of st.mesh.userData.wheels||[])_.rotation.x-=l.speed*n*1.7;const c=Math.abs(l.speed),h=je.has("Space")&&!l.roamAir;if(c>Sh){const _=xe.clamp((c-Sh)/5,0,1),E=1-.36*xe.clamp((c-34)/85,0,1),T=FM*1.08*_*E*(h?1.85:1)*bs().grip*(l.spikedT>0?.55:1)*(1-.26*qa());l.roamYaw+=l.wheelSteer*T*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=xe.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),u=Math.sin(d),m=-Math.cos(d),p=(l.speed-e)/Math.max(.001,n),x=xe.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-p-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(p)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const _=new P(l.roamPos.x-u*3.2,l.roamPos.y+.2,l.roamPos.z-m*3.2);Wf(_,2,l.roamSlip)}const M=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let f=!1,y=!1,v=qs(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let _=0;_<g;_++)l.roamPos.x+=u*l.speed*n/g,l.roamPos.z+=m*l.speed*n/g,v=qs(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Un),Ey(l.roamPos,v)&&(y=!0),ep(l.roamPos,v)&&(f=!0),v=qs(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Un);l.roamPos.x=xe.clamp(l.roamPos.x,-820,820),l.roamPos.z=xe.clamp(l.roamPos.z,-1620,480),f&&(l.collisionCooldown<=0&&(Xf(new P(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),y&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9,to(.6)),jf(n,e),_y(n,h,f),by(n,f),v=qs(l.roamPos.x,l.roamPos.z,l.roamPos.y),yy(n,v),!(v.kind==="ramp"&&v.u>.72&&h0(v))&&(v.kind==="track"&&h0(v)||(wd(),Qn(),je.has("KeyR")&&(pl(),je.delete("KeyR"))))}const d0={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let st=null;const Zf=[];function Sd(){return l.drivingStolen&&st?st.mesh:Gt}function Td(){if(st){if(st.job){const n=st.mesh;st=null,W_(n);return}if(st.actor){const n=st.actor.collider,e=st.mesh.position;n.x=e.x,n.z=e.z}Zf.push(st),st=null}}function my(n){Td(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Se.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return st={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.mesh.position.x,ce(n.mesh.position.x,n.mesh.position.z)+Un,n.mesh.position.z),l.roamYaw=Math.atan2(e,-t),l.camYaw=l.roamYaw,l.speed=n.speed,hn.visible=!1,l.message=`${(n.type||"car").toUpperCase()} jacked!`,l.messageTimer=1.2,to(1),li("jack",.5,1,.08)||Tn(340,.18,"square",.1),Qn(),!0}function xy(n){if(Td(),n.taken=!0,n.savedM=new yt,Mn.im){const t=new yt().makeScale(1e-4,1e-4,1e-4);Mn.im.getMatrixAt(n.idx,n.savedM),Mn.im.setMatrixAt(n.idx,t),Mn.imW.setMatrixAt(n.idx,t),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0}const e=Jr("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Se.add(e),st={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.x,ce(n.x,n.z)+Un,n.z),l.roamYaw=n.yaw,l.camYaw=n.yaw,l.speed=0,hn.visible=!1,l.message="Borrowed a parked car",l.messageTimer=1.1,to(.7),li("jack",.45,1.05,.08)||Tn(300,.16,"square",.09),Qn(),!0}function gy(){st.mesh.visible=!0,st.parked=l.roamPos.clone(),st.parkedYaw=l.roamYaw,l.vehicle="foot",l.drivingStolen=!1,l.speed=0,l.driftAngle=0;const n=Math.cos(l.roamYaw),e=Math.sin(l.roamYaw);return l.roamPos.x-=n*3.4,l.roamPos.z-=e*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,hn.visible=!0,!0}function u0(){return!st?.parked||l.roamPos.distanceTo(st.parked)>7?!1:(l.vehicle="car",l.drivingStolen=!0,l.roamPos.copy(st.parked),l.roamYaw=st.parkedYaw,l.camYaw=l.roamYaw,l.speed=0,st.parked=null,hn.visible=!1,Qn(),!0)}function Kf(){for(const n of An){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)>6))return my(e)}for(const n of Mn.spots)if(!n.taken&&Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)<5.5)return xy(n);return!1}function f0(n){if(n.actor)n.actor.stolen=!1;else{Rs(n.mesh);const e=n.spotRef;e?.savedM&&Mn.im&&(Mn.im.setMatrixAt(e.idx,e.savedM),Mn.imW.setMatrixAt(e.idx,e.savedM),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function Dl(){st&&(f0(st),st=null),Zf.splice(0).forEach(f0),l.drivingStolen=!1}function Dh(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;if(l.drivingStolen&&st)return l.roamAir=!1,l.roamVy=0,gy(),l.message="On foot — your car is marked on the map",l.messageTimer=1.6,!0;Gi.copy(l.roamPos),Ch=l.roamYaw,Gt.visible=!0,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,hn.visible=!0,l.message="On foot — E enters your car, the heli, or steals a ride",l.messageTimer=1.6,!0}function Ih(){return l.vehicle!=="foot"||l.roamPos.distanceTo(Gi)>7?!1:(l.vehicle="car",l.roamPos.copy(Gi),l.roamYaw=Ch,l.camYaw=Ch,l.speed=0,hn.visible=!1,Qn(),!0)}function Jf(){return l.vehicle!=="foot"||!de||l.roamPos.distanceTo(de.pos)>10.5?!1:(l.vehicle="heli",l.roamPos.copy(de.pos),l.roamYaw=de.yaw,l.camYaw=de.yaw,l.speed=0,de.vel.set(0,0,0),hn.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function Fh(){if(l.vehicle!=="heli"||!de)return!1;const n=ce(de.pos.x,de.pos.z);return de.pos.y-n>5.2||de.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",de.mesh.visible=!0,l.roamPos.x=de.pos.x+Math.cos(de.yaw)*-5.6,l.roamPos.z=de.pos.z+Math.sin(de.yaw)*-5.6,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,hn.visible=!0,!0)}function Ed(){l.mode==="roam"&&(l.vehicle==="car"?Dh()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?(l.roamPos.distanceTo(Gi)<=(st?.parked?l.roamPos.distanceTo(st.parked):1/0)?Ih()||u0():u0()||Ih())||Jf()||G_()||Kf():Fh())}function vy(n){const e=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle),t=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),i=xe.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Ee.steer,-1,1),s=je.has("ShiftLeft")||je.has("ShiftRight"),a=l.speed,r=(e-t)*(s?14.5:6.4);l.speed+=(r-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,ep(l.roamPos,{kind:"ground"}),l.roamPos.x=xe.clamp(l.roamPos.x,-820,820),l.roamPos.z=xe.clamp(l.roamPos.z,-1620,480),l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,jf(n,a),wd(),hn.position.copy(l.roamPos),hn.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*xe.clamp(Math.abs(l.speed)/5,0,1);for(const m of hn.userData.limbs||[])m.mesh.rotation.x=h*m.amp*m.side*2.2,m.mesh.position.y=m.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(Gi)<7,u=de&&l.roamPos.distanceTo(de.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):u&&(l.message="E — enter helicopter",l.messageTimer=.2))}function My(n){if(!de)return;const e=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle)-Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),t=xe.clamp((je.has("KeyA")||je.has("ArrowLeft")?1:0)-(je.has("KeyD")||je.has("ArrowRight")?1:0)-Ee.steer,-1,1),i=de.rpm>.55,s=je.has("ShiftLeft")||je.has("ShiftRight"),a=Ja?s?1:de.pos.y-ce(de.pos.x,de.pos.z)>6?-.45:0:je.has("Space")?1:s?-1:0;de.yaw-=t*1.5*n*(i?1:.2);const r=Math.sin(de.yaw),o=-Math.cos(de.yaw);i&&(de.vel.x+=r*e*30*n,de.vel.z+=o*e*30*n,de.vel.y+=a*24*n,a===0&&(de.vel.y-=de.vel.y*1.6*n)),de.vel.x-=de.vel.x*.85*n,de.vel.z-=de.vel.z*.85*n,de.vel.y-=de.vel.y*1.1*n,de.pos.addScaledVector(de.vel,n);const c=ce(de.pos.x,de.pos.z);de.pos.x=xe.clamp(de.pos.x,-1500,1500),de.pos.z=xe.clamp(de.pos.z,-1900,700),de.pos.y=Math.min(de.pos.y,300),de.pos.y<c+1.1&&(de.pos.y=c+1.1,de.vel.y=Math.max(0,de.vel.y)),(Ar(de.pos,un)||Ar(de.pos,gi))&&(de.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=de.pos.x,l.roamPos.y=de.pos.y,l.roamPos.z=de.pos.z,l.roamYaw=de.yaw,l.speed=Math.hypot(de.vel.x,de.vel.z),de.mesh.position.copy(de.pos),de.mesh.quaternion.setFromAxisAngle(nn,-de.yaw),de.mesh.rotateX(xe.clamp((de.vel.x*r+de.vel.z*o)*.008,-.24,.24)),de.mesh.rotateZ(xe.clamp(t*.14,-.2,.2)),wd()}function _y(n,e,t){const i=e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24;if(l.driftComboT>0&&(l.driftComboT-=n,l.driftComboT<=0)&&(l.driftCombo=0),t&&(l.driftCombo||l.driftComboT>0)&&(l.driftCombo=0,l.driftComboT=0),i&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.min(5,(l.driftCombo||0)+1),a=Math.round(l.driftAcc*s);l.score+=a,Oi(s>1?`+${a} DRIFT ×${s}`:`+${a} DRIFT`),Tn(600+s*90,.16,"square",.1),l.driftCombo=s,l.driftComboT=4}l.driftT=0,l.driftAcc=0}}function yy(n,e){const t=e.y+Un,i=l.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(l.speed)>30&&(l.stuntPrime=.3,l.stuntRamp=Rf),l.stuntPrime>0&&(l.stuntPrime-=n),!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0,l.stuntPrime>0&&(l.stuntActive=!0,l.stuntPrime=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.sloMoT=l.stuntRamp?.type==="flip"?1.4:1.15,l.message=l.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",l.messageTimer=1,li("whoosh",.38,1.2,.08))):(l.roamVy=xe.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir){if(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.stuntActive){l.stuntRamp?.type==="flip"&&(l.flipT=Math.min(1,(l.flipT||0)+n/1.05));const s=(je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0);l.airRoll=(l.airRoll||0)+s*n*4.4;const a=l.stuntRamp?.hoop;a&&!l.stuntBullseye&&Math.hypot(l.roamPos.x-a.x,l.roamPos.y-a.y,l.roamPos.z-a.z)<a.r-.4&&(l.stuntBullseye=!0,l.message="BULLSEYE!",l.messageTimer=1,Tn(1240,.2,"square",.14))}if(l.roamPos.y<=t){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),li("land",Math.min(.62,s/42),1,.1)||ka(Math.min(24,s*.85)),l.roamSuspension+=.16),l.stuntActive){const a=Math.floor(Math.abs(l.airRoll||0)/(Math.PI*2)),r=l.stuntRamp?.type==="flip"&&(l.flipT||0)>=.96;let o=160+l.roamAirT*240+Math.abs(l.speed)*1.4+a*140;r&&(o*=1.6),l.stuntBullseye&&(o*=2),o=Math.round(o);const c=[r&&"BACKFLIP",a>0&&`ROLL ×${a}`,l.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");l.score+=o,Me.stunts=(Me.stunts||0)+1,Oi(`STUNT +${o}`),c&&(l.message=c,l.messageTimer=1.4),Tn(880,.2,"square",.12),l.stuntActive=!1,l.flipT=0,l.airRoll=0}else if(l.roamAirT>.45){const a=Math.round(40+l.roamAirT*70);l.score+=a,Oi(`+${a} AIR`),Tn(760,.14)}}}l.roamPrevY=l.roamPos.y}const Dn=2.6;function jf(n,e){const t=l.waterDepth||0;if(l.roamPos.y>ce(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=Ks(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&($_(l.roamPos.clone(),Math.abs(e)),ny(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,kf(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function by(n,e){for(const t of An)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of An){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,a=l.roamPos.z-t.z,r=(t.hw+t.hd)*.5+Dn+2.4;if(s*s+a*a<r*r&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,Oi("+45 NEAR MISS"),Tn(520,.12,"square",.07);break}}}function Ar(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Un+.45)continue;if(s.radius){const u=s.radius+Dn,m=n.x-s.x,p=n.z-s.z,x=m*m+p*p;if(x>=u*u)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+m/M*u,n.z=s.z+p/M*u;continue}const a=s.hw+Dn,r=s.hd+Dn,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=a||Math.abs(c)>=r)continue;t=!0;const h=a-Math.abs(o),d=r-Math.abs(c);h<d?n.x=s.x+(o<0?-a:a):n.z=s.z+(c<0?-r:r)}return t}function Qf(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Be.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,a=n.mesh?.position?.z??n.collider?.z??n.along,r=n.axis==="ns"?e.x-s>=0?-1:1:e.z-a>=0?-1:1;n.avoidOffset=xe.clamp((n.avoidOffset||0)+r*i*.9,-i,i),t&&(Me.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=r*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function wy(n){let e=!1;for(let t=0;t<An.length;t++){const i=An[t];if(i.maxY!=null&&n.y>i.maxY+Un+.45)continue;const s=i.hw+Dn,a=i.hd+Dn,r=n.x-i.x,o=n.z-i.z;if(Math.abs(r)>=s||Math.abs(o)>=a)continue;e=!0,Qf(i.actor,n);const c=s-Math.abs(r),h=a-Math.abs(o);c<h?n.x=i.x+(r<0?-s:s):n.z=i.z+(o<0?-a:a)}return e}function Sy(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Un+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function Ty(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,Me.splats++,ty();const e=za.find(t=>!t.visible)||za[Me.splats%Math.max(1,za.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,ce(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function Ey(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of Ts){if(!i.active)continue;const s=n.x-i.x,a=n.z-i.z,r=Dn+i.hitRadius;s*s+a*a>r*r||Math.abs(n.y-(ce(i.x,i.z)+Un))>3.2||(Ty(i),t=!0)}return t}function ep(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=Ar(n,un),a=e?.kind==="ground"?Ar(n,ii):!1,r=Ar(n,gi),o=e?.kind==="ground"?wy(n):!1;if(!s&&!a&&!r&&!o)break;t=!0}return t}function tp(n){const e=Ee.lookX*1.18,t=Ee.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Ee.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function Ad(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const a=s/10,r=xe.lerp(n.x,e.x,a),o=xe.lerp(n.z,e.z,a),c=xe.lerp(n.y,e.y,a),h=ce(r,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,a)))}return i}function Ay(n,e){const t=ce(n,e);let i=null;const s=qf(n,e);s&&s.y>t+4&&(i=s);const a=Yf(n,e,1e3,!0);return a&&a.y>t+4&&(!i||a.y>i.y)&&(i=a),i}function ml(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const a=s/14,r=xe.lerp(n.x,e.x,a),o=xe.lerp(n.z,e.z,a),c=xe.lerp(n.y,e.y,a),h=Ay(r,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,a)))}return Math.min(54,i)}function Uh(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=xe.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,a={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};ye.position.y+=Ad(a,ye.position,3.4),ye.position.y+=ml(a,ye.position,4.2)}let Da=localStorage.getItem("steel-ribbon-roam-view")==="hood"?"hood":"chase";function Cy(){Da=Da==="chase"?"hood":"chase",localStorage.setItem("steel-ribbon-roam-view",Da),l.message=Da==="hood"?"First person":"Third person",l.messageTimer=.9}function np(){return l.vehicle==="heli"&&de?de.mesh:Sd()}function Ry(n){const e=np(),t=l.roamYaw+l.camLookYaw*.8,i=Math.sin(t),s=-Math.cos(t),a=l.vehicle==="heli",r=a?2.6:1.42,o=a?1.2:.85;if(e.visible=!1,ye.position.set(l.roamPos.x+i*o,l.roamPos.y+r-l.roamSuspension*.4,l.roamPos.z+s*o),l.cameraShake>.01){const h=l.cameraShake*.5;ye.position.x+=(Math.random()-.5)*h,ye.position.y+=(Math.random()-.5)*h*.6}on.position.copy(ye.position),on.lookAt(l.roamPos.x+i*30,l.roamPos.y+r+l.camLookPitch*16+(l.roamAir?l.roamVy*.06:0),l.roamPos.z+s*30),on.rotateY(Math.PI),on.rotateZ((l.roamAir&&l.stuntActive&&l.airRoll||0)-l.wheelSteer*.05),ye.quaternion.slerp(on.quaternion,1-Math.pow(.001,n));const c=76+Math.min(14,Math.abs(l.speed)*.08);Math.abs(ye.fov-c)>.02&&(ye.fov+=(c-ye.fov)*(1-Math.pow(.01,n)),ye.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function ip(n){if(window.__freeCam)return;if(tp(n),Math.abs(l.speed)>Sh){let M=l.roamYaw-l.camYaw;M=Math.atan2(Math.sin(M),Math.cos(M)),l.camYaw+=M*(1-Math.pow(.08,n))}if(Da==="hood"&&l.vehicle!=="foot"){Ry(n);return}const e=np();e.visible||(e.visible=!0);const t=l.camYaw+l.camLookYaw,i=Math.sin(t),s=-Math.cos(t),a=l.roamPos,r=xe.clamp(l.cameraZoom,-.42,.9),o=xe.clamp(Math.abs(l.speed)/135,0,1),c=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},h=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+r*.72)*c.d,d=(7.2+o*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+l.camLookPitch*5.8)*c.h,u=pd.set(a.x-i*h,a.y+d,a.z-s*h);if(l.cameraShake>.01||l.collisionDrama>.01){const M=l.cameraShake+l.collisionDrama*.42;u.x+=(Math.random()-.5)*M*1.2,u.y+=(Math.random()-.5)*M*.75,u.z+=(Math.random()-.5)*M*1.2}const m=Cl.set(a.x+i*(13+o*8-Math.min(r,0)*6),a.y+2.45+l.camLookPitch*13.5,a.z+s*(13+o*8-Math.min(r,0)*6));u.y=Math.max(u.y,ce(u.x,u.z)+3.5),u.y+=Ad(m,u,3.4),u.y+=ml(m,u,4.2);const p=l.roamSlip>.35?.006:.0026;ye.position.lerp(u,1-Math.pow(p,n)),ye.position.y+=ml(m,ye.position,3.8)*.72,on.position.copy(ye.position),on.lookAt(m),on.rotateY(Math.PI),on.rotateZ(-l.wheelSteer*o*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),ye.quaternion.slerp(on.quaternion,1-Math.pow(.05,n));const x=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+r*10;Math.abs(ye.fov-x)>.02&&(ye.fov+=(x-ye.fov)*(1-Math.pow(.01,n)),ye.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function Py(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Xe.best.textContent=`Best score ${l.best}`,Xe.resultText.textContent=`${n} Score ${t}. Time ${xl(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?xl(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&Xt?.active&&e){[{key:"you",metric:l.totalDistance+.001},...qn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Xt.points[c.key]+=T_[h]??0),Xt.raceIndex++;const r=Xt.raceIndex>=4,o=Cf();if(r){Xt.active=!1;const c=o[0].key==="you";c&&Xt.division>1?(localStorage.setItem("steel-ribbon-division",String(Xt.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Af(Xt.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}Ef(),s=`<span>Season — after race ${Xt.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,Xe.againBtn.textContent=Xt.active?"Next Race":"Back to Menu"}else Xe.againBtn.textContent="Race Again";Xe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,Fl(),Number.isFinite(l.bestLap)&&l.bestLap>3&&Mp("lap",Math.round(1e6/l.bestLap),{time:+l.bestLap.toFixed(2),course:se.name,car:Cs[Vi]?.label||""}),Xe.result.classList.remove("hidden")}function Ec(n="Craned back to the ribbon"){const e=mt(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function Cd(n,e){return xe.clamp(e*n.tangent.y,-48,48)}function Ly(n=94){return se.gaps.map(e=>{const t=mt(e.start),i=mt(e.end+3),s=(e.end-e.start)/Math.max(1,n),a=Cd(t,n),r=t.p.y+2.1+a*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(xe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(a*10)/10,projectedClearance:Math.round((r-o)*10)/10}})}function p0(n,e){l.grounded=!1,l.yVel=Cd(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return Cd(mt(n),e)},gapJumpReport(n){return Ly(n)},sceneryClearanceReport(){return ZM()},setSpeed(n){return l.speed=xe.clamp(n,-14,156-l.damage*.42),Cr(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=mt(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=xe.clamp(t,-se.width*.48,se.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=xe.clamp(e,-14,156-l.damage*.42),Cr(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=xe.clamp(n,0,99),Cr(),l.damage},setCourse(n){return eo(n)},flyCam(n,e,t,i,s,a){return window.__freeCam=!0,ye.position.set(n,e,t),ye.lookAt(i,s,a),ye.fov=62,ye.updateProjectionMatrix(),"freecam"},listBoostPads(){return Na.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return na.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+Ks(n,e).depth.toFixed(3),ground:+ce(n,e).toFixed(2)}},activeGate(){const n=Jt[l.objectiveIndex%Jt.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:Xt,division:Qr(),position:Rd(),seasonRace:!!l.seasonRace,rivals:qn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Xt=null,Fl(),"reset"},renderInfo(){return{calls:Me.renderCalls||0,triangles:Me.renderTris||0,geometries:an.info.memory.geometries,textures:an.info.memory.textures,mobilePerf:Ja,staticMerge:Me.staticMerge||null}},drawAudit(n=20){const e=new Map;return Se.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(r=>typeof r=="number").map(r=>+r.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,a=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(a,(e.get(a)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=An[0]?.actor?.mesh;return{colliders:An.length,wheels:n?.userData?.wheels?.length??0,pedestrians:Me.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of An){const s=i.actor;if(!s||!s.type||s.stolen)continue;const a=Math.hypot(n-i.x,e-i.z);(!t||a<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+a.toFixed(1)})}return t},audioInfo(){return Ae?{state:Ae.ctx.state,master:+Ae.master.gain.value.toFixed(2),engine:!!Ae.rumble&&!!Ae.growl&&!!Ae.whine,fx:!!Ae.wind&&!!Ae.skid&&!!Ae.boost,music:!!Ae.musicGain,beat:Ae.beat,samples:Object.keys(Kn.buffers).length,sampleLoops:Object.keys(Kn.loops),musicSample:!!Kn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:Gf(),engineV2:!!Ae.growlB&&!!Ae.burble}:null},colliderAudit(){const n=[],e=[],t=Be.streetW*.5;for(let a=Be.x0;a<=Be.x1+1;a+=Be.pitch)n.push(Math.round(a));for(let a=Be.zNear;a>=Be.zFar-1;a-=Be.pitch)e.push(Math.round(a));const i=[],s=(a,r,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=ce(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const u of n)Math.abs(o.x-u)<t+c+Dn&&o.z<Be.zNear+h&&o.z>Be.zFar-h&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${u}`,overlap:+(t+c+Dn-Math.abs(o.x-u)).toFixed(1)});for(const u of e)Math.abs(o.z-u)<t+h+Dn&&o.x<Be.x1+c&&o.x>Be.x0-c&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${u}`,overlap:+(t+h+Dn-Math.abs(o.z-u)).toFixed(1)})}};return un.forEach((a,r)=>s("Mn",r,a)),gi.forEach((a,r)=>s("Di",r,a)),ii.forEach((a,r)=>s("$n",r,a)),{total:un.length+gi.length+ii.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&pl(),n==="foot"?l.vehicle==="car"?Dh(!0):l.vehicle==="heli"&&Fh():n==="heli"&&de?(l.vehicle==="car"&&Dh(!0),l.roamPos.set(de.pos.x+3,ce(de.pos.x+3,de.pos.z),de.pos.z),Jf()):n==="car"&&(l.vehicle==="heli"&&(de.pos.y=ce(de.pos.x,de.pos.z)+1.1,de.vel.set(0,0,0),Fh()),l.vehicle==="foot"&&(l.roamPos.copy(Gi),Ih())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:hn.visible,heli:de?{x:+de.pos.x.toFixed(1),y:+de.pos.y.toFixed(1),z:+de.pos.z.toFixed(1),rpm:+de.rpm.toFixed(2),scale:+de.mesh.scale.x.toFixed(2),pad:de.pad?{x:+de.pad.x.toFixed(1),z:+de.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Gi.x.toFixed(1),z:+Gi.z.toFixed(1)},drivingStolen:!!l.drivingStolen,stolen:st?{type:st.type,fromTraffic:!!st.actor,pos:{x:+st.mesh.position.x.toFixed(1),y:+st.mesh.position.y.toFixed(2),z:+st.mesh.position.z.toFixed(1)},visible:st.mesh.visible,inScene:st.mesh.parent===Se,parked:st.parked?{x:+st.parked.x.toFixed(1),z:+st.parked.z.toFixed(1)}:null}:null,parkedSpots:Mn.spots.length}},stealNearest(){return l.mode==="roam"&&l.vehicle==="foot"?Kf():!1},setHeat(n){return l.mode==="roam"&&(l.heat=xe.clamp(n,0,5)),l.heat||0},policeInfo(){return{heat:+(l.heat||0).toFixed(2),cars:lt.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),evadeT:+lt.evadeT.toFixed(1),bustT:+lt.bustT.toFixed(2),blocks:lt.blocks.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),age:+n.age.toFixed(1)})),busts:Me.busts||0}},policeTeleportNearest(n,e){const t=lt.cars[0];return t?(t.x=n,t.z=e,!0):!1},jobInfo(){return{state:Ke.state,type:Ke.type,timeLeft:+Ke.timeLeft.toFixed(1),pickup:Ke.pickup?{x:+Ke.pickup.x.toFixed(1),z:+Ke.pickup.z.toFixed(1)}:null,dest:Ke.dest?{x:+Ke.dest.x.toFixed(1),z:+Ke.dest.z.toFixed(1)}:null,deliveries:Me.deliveries||0,fails:Me.deliveryFails||0}},jobSpawnNow(){return Ke.state==="idle"&&(Ke.cooldown=0,Nf()),Ke.state},setWeather(n){return(n==="rain"||n==="clear")&&n!==oi&&(Dd(),localStorage.setItem("steel-ribbon-weather",oi)),oi},weatherInfo(){return{mode:oi,amt:+qa().toFixed(2),roadRoughness:+(mn.roadMat?.roughness??-1).toFixed(2)}},panickedTraffic(){let n=0;for(const e of An)e.actor?.panicT>0&&n++;return n},mpInfo(){return{connected:gt.connected,room:gt.room,id:gt.id,peers:[...gt.peers.values()].map(n=>({name:n.name,has:n.has,x:+(n.tx||0).toFixed(1),z:+(n.tz||0).toFixed(1)}))}},mpJoin(n,e){const t=document.querySelector("#mpRoom"),i=document.querySelector("#mpName");return t&&(t.value=n),i&&(i.value=e),wp(),gt.room},mpLeave(){return _l(!0),!gt.connected},boardsInfo(){return vp(Zr).then(n=>({mode:Zr,rows:n?n.length:null,ok:n!==null}))},gamepadInfo(){return{active:Bn.active}},setTod(n){return Pr.includes(n)&&(Hn=n,localStorage.setItem("steel-ribbon-tod",n),Id()),Hn},todInfo(){return{mode:Hn,day:+el.toFixed(3),night:+tl.toFixed(3)}},listStuntRamps(){return(Pi||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of Mn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&pl(),l.roamPos.set(n,ce(n,e)+Un,e),l.roamYaw=t,l.camYaw=t,l.speed=i,Qn(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{...ys,boostPads:Na.length,gapBeacons:Vr.length,railRuns:Me.railRuns||0,railPosts:Me.railPosts||0,ponds:na.length,cityPonds:Me.ponds||0,cloudSprites:Me.cloudSprites||0,helipad:Me.helipad||null,stuntRamps:Me.stuntRamps||0,propPlanes:Me.propPlanes||0}},stats(){return{trafficCrashes:Me.trafficCrashes,splats:Me.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},detailReport(){return{plates:Di.mesh?{atlasSlots:64,traffic:Di.dynamics.length,parked:Di.statics.length,uniqueTexts:new Set(Di.texts).size,sample:Di.texts.slice(0,5)}:null,drivers:{cars:Ra.length,withDriver:Ra.reduce((n,e)=>n+(e.mesh?.userData?.hasDriver?1:0),0)},taxis:{count:Ra.reduce((n,e)=>n+(e.type==="taxi"?1:0),0),signed:Ah.count()},storefronts:{spots:Xs.spots.length,dressed:Xs.dressedCount(),pool:Xs.pool,sample:Xs.spots.slice(0,2).map(n=>({x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),w:+n.w.toFixed(1)}))},furniture:{...Ai.counts,sample:Ai.sample.slice(0,4)},peds:{pool:Pa.pool,promoted:Pa.promotedCount(),texting:(Pa.kits||[]).reduce((n,e)=>n+(e.ped&&e.texting?1:0),0),radius:Eh,sample:(Pa.kits||[]).filter(n=>n.ped).slice(0,3).map(n=>{const e={x:+n.ped.x.toFixed(1),y:+n.ped.mesh.position.y.toFixed(2),z:+n.ped.z.toFixed(1),axis:n.ped.axis,dir:n.ped.dir,t:n.texting?1:0};if(n.texting){const t=n.phone.getWorldPosition(new P);e.phone={x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)}}return e})}}},viewInfo(){const n=mt(l.s),e=l.y-2.1;return{trackView:_i,mode:l.mode,carVisible:Gt.visible,cockpitVisible:!!(dn&&dn.visible),camY:+ye.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!Ui,overheadY:+zh(ye.position.x,ye.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return _i=n==="cockpit"?"cockpit":"chase",Xi(),_i},listCourses(){return ta.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:Ss,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new zx(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=ye;const i=t.intersectObjects(Se.children,!0).map(a=>({y:+a.point.y.toFixed(2),name:a.object.material?.color?"#"+a.object.material.color.getHexString():"?"})),s=qs(n,e,400);return{x:n,z:e,ground:+ce(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return sa.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],a=n.segments[0],r=n.segments[n.segments.length-1],o=Math.atan2(a.abx,-a.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(r.abx,-r.abz).toFixed(4)}})},colliderSample(n=8){return un.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return ii.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=ii.filter(e=>e.hw);return{supports:Th,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of un){const i=Bs(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:un.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of un){const i=Ln(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:un.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return gi.concat(ii.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:Me.traffic,pedestrians:Me.pedestrians,pedestriansActive:Ts.filter(e=>e.active).length,turns:Me.turns,splats:Me.splats,trafficCrashes:Me.trafficCrashes,streetLights:Me.streetLights,trafficLights:Me.trafficLights,stopSigns:Me.stopSigns,signs:Me.signs,roadDetails:{...Me.roadDetails},buildingArchetypes:{...Me.buildingArchetypes},zones:{...Me.zones},openerProps:Me.openerProps,signSamples:fl.slice(0,n),types:{...Me.types},offRoadTraffic:An.filter(e=>!Rl(e.x,e.z,2)).length,trafficRoutes:Ra.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:An.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Ts.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...Me.roadDetails},e={...Me.buildingArchetypes},t={...Me.zones},i=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,Me.signs/7)+Math.min(14,Me.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:Me.openerProps,signs:Me.signs,streetLights:Me.streetLights,streetGlowSprites:ys.streetGlowSprites,waterBlockers:ys.waterBlockers,lowFogDisks:ys.lowFogDisks}},objectiveReport(){const n=Jt[l.objectiveIndex%Math.max(1,Jt.length)];return{total:Jt.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:Jt.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:Tr.filter(n=>n.life>0).length,debrisActive:Er.filter(n=>n.life>0).length,sparksActive:Sr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Gt.userData.detailReport},racer:{...w_.userData.detailReport},namedParts:Gt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);yf(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=mt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,a=Math.atan2(t.tangent.x,-t.tangent.z),r=ce(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,r+Un,s),l.roamYaw=a,l.camYaw=a,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,l.wheelSteer=0,l.speed=0,Qn();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),Uh(),ye.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),ye.fov=69,ye.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=qs(n,e,l.roamPos.y);l.roamPos.set(n,i.y+Un,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,Qn();const s=Math.sin(l.roamYaw),a=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-a*17),Uh(),ye.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+a*13),ye.fov=69,ye.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Ee.zoom,i=30){Ee.lookX=xe.clamp(n,-1,1),Ee.lookY=xe.clamp(e,-1,1),Ee.zoom=xe.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?ip(1/60):Pd(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake};Ee.steer=xe.clamp(e,-1,1),Ee.throttle=xe.clamp(t,0,1),Ee.brake=xe.clamp(i,0,1);const a=1/60;let r=Math.max(0,Math.min(n,8));for(;r>0;){const o=Math.min(a,r);if($f(o),l.mode!=="roam")break;r-=o}return Ee.steer=s.steer,Ee.throttle=s.throttle,Ee.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(sp(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=pd.set(0,0,-1).applyQuaternion(Gt.quaternion).normalize(),t=Cl.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=qs(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+ce(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+ye.position.x.toFixed(2),camY:+ye.position.y.toFixed(2),camZ:+ye.position.z.toFixed(2),fov:+ye.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+Ad({x:n.x,y:n.y+2.6,z:n.z},{x:ye.position.x,y:ye.position.y,z:ye.position.z},2.4).toFixed(3),elevatedCameraLift:+ml({x:n.x,y:n.y+2.6,z:n.z},{x:ye.position.x,y:ye.position.y,z:ye.position.z},3.8).toFixed(3),colliders:un.length+ii.length+gi.length+An.length,insideBuilding:un.concat(ii,gi,An).some(s=>Sy(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Gt.userData.frontWheels?+Gt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function sp(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),s=xe.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*pf,a=t>.03&&!e,r=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&a&&l.grounded,o=mt(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(a){const v=l.speed<0?40:0;l.speed+=((r?68:40)*bs().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=xe.clamp(l.speed,-16,156*bs().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=r,r?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*bs().boostRegen);const u=je.has("Space")&&l.grounded,m=(16+h*.13)*(u?1.45:1)*bs().grip;l.lateralVel-=s*m*n,l.lateralVel-=l.lateralVel*(l.grounded?u?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const p=Bi(l.s),x=Math.abs(l.lateral)<se.width*.52,M=!p&&x;if(l.grounded&&(!M||Math.abs(l.lateral)>se.width*.5)&&p0(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=xe.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>se.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&Js(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*se.width*.55).addScaledVector(nn,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=mt(l.s),_=v.p.y+2.1;if(!Bi(l.s)&&Math.abs(l.lateral)<se.width*.55&&l.y<=_&&l.yVel<0){const E=-l.yVel,T=Math.abs(l.lateral)<se.width*.34&&E<30,A=Math.round(T?260+l.airtime*85:Math.max(30,120-E));l.y=_,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-se.width*.36)*1.8,l.score+=A,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=T?"Clean landing":"Hard landing",l.messageTimer=.9,T?l.cleanLandings+=1:l.hardLandings+=1,Oi(`+${A} ${T?"CLEAN AIR":"LANDED"}`,T),T&&Tn(990,.14),ka(E),Js(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector(nn,.7),T?7:24),l.airtime=0}if(l.practice||l.freeRun){if(!l.grounded&&l.yVel<-6){const E=mt(l.s),T=E.p.x+E.side.x*l.lateral,A=E.p.z+E.side.z*l.lateral,C=ce(T,A);l.y<=C+1.3&&cy(T,A,E)}l.y<-55&&(l.damage+=28,Ec("Track crew recovery"))}else l.y<-55&&(l.damage+=28,Ec("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%se.length+se.length)%se.length,Ny();const f=sa.find(v=>v.rampType==="off");if(l.freeRun&&f&&vc(g,l.totalDistance,f.exitS)&&l.lateral*f.dirSel>se.width*.2&&hy(f))return;const y=Math.floor(l.totalDistance/se.length)+1;if(y>l.lap){const v=l.time-l.lapStartTime;zy(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=y,l.score+=1200,Oi("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=se.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>se.laps&&(()=>{const _=Rd();Py(_===1?"You took the chequered gantry.":`You finished P${_}.`,_)})()}for(const v of se.gaps)vc(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&p0(mt(v.start),v.name));if(l.grounded){for(const v of Na)if(vc(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const _=mt(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,Oi("+90 BOOST"),Tn(640,.22,"sawtooth",.1),Js(_.p.clone().addScaledVector(_.side,v.lat).addScaledVector(nn,1),10),ka(14);break}}l.damage=xe.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),ka(40),l.damage=90),je.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),Ec("Manual reset"),je.delete("KeyR"))}function m0(n){const e=se.length*se.laps,t=1+.07*(4-Qr());for(const i of qn){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=xe.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let u=i.base+d+h;i.key==="bishop"&&(u+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(u+=10*xe.clamp(i.distance/Math.max(1,e),0,1)),i.speed=xe.clamp(u*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=mt(i.s),a=Math.abs(i.distance-l.totalDistance);let r=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(a<14){const c=(l.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);r=xe.lerp(c,r,a/14)}i.mesh.position.copy(s.p).addScaledVector(nn,1.4).addScaledVector(s.side,r),i.mesh.quaternion.setFromRotationMatrix(new yt().makeBasis(s.side,nn,s.tangent));const o=a<26&&_i==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...qn.map(i=>i.distance)),l.rivalS=(l.rivalDistance%se.length+se.length)%se.length}function Rd(){return l.practice?1:1+qn.filter(n=>n.distance>l.totalDistance).length}function Dy(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),ye.position.copy(i);const a=Math.abs(l.speed),r=68+Math.min(10,a*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(ye.fov-r)>.02&&(ye.fov+=(r-ye.fov)*(1-Math.pow(.004,n)),ye.updateProjectionMatrix());const o=mt(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,a/680),on.position.copy(ye.position),on.lookAt(c),on.rotateY(Math.PI),on.rotateY(-l.camLookYaw),on.rotateZ(-e.bank*.72-l.lateralVel*.006),on.rotateX(e.grade*.18+(l.grounded?0:xe.clamp(l.yVel,-30,30)*-.006)),ye.quaternion.slerp(on.quaternion,1-Math.pow(8e-4,n))}function zh(n,e,t,i){let s=1/0;const a=se.width*.5+2.2;for(const r of Pl()){if(r.courseIndex!==Ss||r.y<t||r.y>i||r.y>=s)continue;const o=n-r.x,c=e-r.z;o*o+c*c<a*a&&(s=r.y)}return s}function Iy(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+xe.clamp(l.cameraZoom,-.42,.9)*8,a=4.6+t*.014+l.camLookPitch*10,r=mt(l.s-s),o=zh(r.p.x,r.p.z,i+5,i+64);o-1.5<r.p.y+2&&(s=6.4,a=2.7,r=mt(l.s-s),o=zh(r.p.x,r.p.z,i+5,i+64));let c=xe.lerp(r.p.y,i,.62)+a;const h=fd.set(r.p.x+r.side.x*l.lateral*.72,0,r.p.z+r.side.z*l.lateral*.72);if(c=Math.max(c,r.p.y+2.35,ce(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const p=l.cameraShake;h.x+=(Math.random()-.5)*p*1.1,h.y+=(Math.random()-.5)*p*.6,h.z+=(Math.random()-.5)*p*1.1}ye.position.distanceTo(h)>70&&ye.position.copy(h),ye.position.lerp(h,1-Math.pow(2e-4,n)),ye.position.y=Math.max(ye.position.y,r.p.y+2.05),o<1/0&&(ye.position.y=Math.min(ye.position.y,o-1.4));const d=mt(l.s+17+t*.09),u=d.p.clone().addScaledVector(d.side,l.lateral*.55);u.y+=2.1+l.camLookPitch*12,l.grounded||(u.y=xe.lerp(u.y,l.y+1.2,.5)),on.position.copy(ye.position),on.lookAt(u),on.rotateY(Math.PI),on.rotateY(-l.camLookYaw),on.rotateZ(-e.bank*.42-l.lateralVel*.0034),ye.quaternion.slerp(on.quaternion,1-Math.pow(4e-4,n));const m=66+Math.min(11,t*.055)+(l.boosting?5:0)+xe.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(ye.fov-m)>.02&&(ye.fov+=(m-ye.fov)*(1-Math.pow(.004,n)),ye.updateProjectionMatrix())}let vi=null,Ui=null,es=0;function Fy(){try{Ui=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+Ss)||"null")}catch{Ui=null}es=0}function Uy(){vi&&La(vi),vi=Cs[Vi].build(),vi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),vi.visible=!1}function zy(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||Ui&&n>=Ui.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);Ui={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+Ss,JSON.stringify(Ui))}catch{}l.message=`Ghost saved — ${xl(n)}`,l.messageTimer=1.3,es=0}function Ny(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function ky(){if(!vi)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&Ui?.samples?.length>2&&!window.__freeCam;if(vi.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,Ui.time),t=Ui.samples;for(e<(t[es]?.[0]??0)&&(es=0);es<t.length-2&&t[es+1][0]<e;)es++;const i=t[es],s=t[Math.min(es+1,t.length-1)],a=xe.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),r=xe.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:a),o=xe.lerp(i[2],s[2],a),c=xe.lerp(i[3],s[3],a),h=mt((r%se.length+se.length)%se.length);vi.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),vi.quaternion.setFromRotationMatrix(new yt().makeBasis(h.side,nn,h.tangent))}function Oy(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&_i==="chase"&&!window.__freeCam;if(dn&&(dn.visible=!e),Gt.visible!==e&&(Gt.visible=e),!e)return;const t=mt(l.s);Gt.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new yt().makeBasis(t.side,nn,t.tangent);Gt.quaternion.setFromRotationMatrix(i),l.grounded?(Gt.rotateX(-t.grade*.5),Gt.rotateZ(t.bank*.6+xe.clamp(l.lateralVel*.012,-.16,.16))):Gt.rotateX(xe.clamp(-l.yVel*.011,-.34,.4));const s=Gt.userData.frontWheels,a=xe.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=a,s[1].rotation.y=a)}let Xo=.6;function By(n){if(window.__freeCam)return;Xo+=n*.13;const e=80,t=300,i=ce(e,t);Gt.visible=!0,dn&&(dn.visible=!1),Gt.position.set(e,i+.85,t),Gt.quaternion.setFromAxisAngle(nn,Math.PI*.24);const s=16.5;ye.position.set(e+Math.cos(Xo)*s,i+5.3+Math.sin(Xo*.57)*1.1,t+Math.sin(Xo)*s),ye.lookAt(e,i+1.5,t),ye.rotateY(.3),Math.abs(ye.fov-58)>.1&&(ye.fov=58,ye.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function Pd(n){if(window.__freeCam)return;tp(n);const e=mt(l.s);_i==="chase"&&l.mode!=="menu"?Iy(n,e):Dy(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=Cl.set(0,0,-1).applyQuaternion(ye.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const $s={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},pr=[28,54,82,110,134,156];function Vy(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<pr.length;o++)n>pr[o]&&(e=o+2);e=Math.min(e,pr.length);const t=e===1?0:pr[e-2],i=pr[e-1],s=i>t?xe.clamp((n-t)/(i-t),0,1):0,a=e===1?$s.idle:$s.postShift;let r=a+s*($s.shift-a);return n<.4&&(r=$s.idle),{gear:e,rpm:r}}let x0=performance.now(),Ac=0,Cc=0;function ap(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const a=i/2,r=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:a,cy:r,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[a+Math.cos(c)*h,r-Math.sin(c)*h]}}function Gy(n,e){const t=Xe.speedo;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=ap(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const M=x/h,g=o(M),f=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=f?Math.max(1.4,r*.035):Math.max(1,r*.02);const y=c(g,r-r*.02),v=c(g,r-r*(f?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),f){const _=c(g,r-r*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),_[0],_[1])}}const d=xe.clamp(n/h,0,1),u=o(d),m=c(u,r-r*.06),p=c(u+Math.PI,r*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=r*.18,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(p[0],p[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,a-r*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,r*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,a+r*.02)}function Hy(n,e){const t=Xe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=ap(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke();const d=xe.clamp(n,0,1),u=n<.25;i.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?r*.25:r*.1,i.lineWidth=Math.max(2,r*.07),i.beginPath(),i.arc(s,a,r,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=h;M+=3){const g=M/h,f=o(g),y=M%6===0;i.strokeStyle=M>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,r*.03):Math.max(1,r*.018);const v=c(f,r-r*.02),_=c(f,r-r*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(_[0],_[1]),i.stroke(),y){const E=c(f,r-r*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const m=o(d),p=c(m,r-r*.06),x=c(m+Math.PI,r*.14);i.strokeStyle=u?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=r*.16,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,a-r*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=r*.3,i.beginPath(),i.arc(s,a+r*.02,r*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function Wy(n,e){const t=Xe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),a=t.clientWidth||160,r=t.clientHeight||70;(t.width!==Math.round(a*s)||t.height!==Math.round(r*s))&&(t.width=Math.round(a*s),t.height=Math.round(r*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,a,r);const o=a/2,c=r-r*.14,h=Math.min(a*.46,r*.9),d=$s.max,u=v=>Math.PI-v*Math.PI,m=(v,_)=>[o+Math.cos(v)*_,c-Math.sin(v)*_];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,u(1),u(0)),i.stroke();const p=$s.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,u(1),u(p)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const _=v/9,E=u(_),T=v*1e3>=$s.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const A=m(E,h-h*.02),C=m(E,h-h*.18);i.beginPath(),i.moveTo(A[0],A[1]),i.lineTo(C[0],C[1]),i.stroke();const w=m(E,h-h*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),w[0],w[1]),v<9){const b=u((v+.5)/9),L=m(b,h-h*.02),D=m(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(D[0],D[1]),i.stroke()}}const x=xe.clamp(n/d,0,1),M=u(x),g=m(M,h-h*.06),f=m(M+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(f[0],f[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const y=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,o,c+h*.02)}function Cr(){se.length*se.laps;const n=Ku(l.practice?l.totalDistance%se.length:l.totalDistance),e=l.practice?"SOLO":`P${Rd()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),Xe.damage.style.width=`${Math.round(l.damage)}%`,Xe.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,se.laps)}/${se.laps}`,Xe.timer.textContent=xl(l.time);const t=l.mode==="roam",i=t&&l.driftCombo>0&&l.driftComboT>0?`  ·  DRIFT ×${Math.min(5,l.driftCombo+1)}`:"";Xe.score.textContent=t?`Gates ${l.objectiveHits}/${Jt.length}  Score ${Math.round(l.score)}${i}`:`Score ${Math.round(l.score)}`;const s=l.mode==="race"||l.mode==="paused"||t;if(Xe.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":l.drivingStolen&&st?`${st.type.toUpperCase()} · STOLEN`:"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${Qr()}`,t&&Jt.length){const d=Jt[l.objectiveIndex%Jt.length];Xe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(l.heat||0)>=1&&(Xe.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`),t&&Ke.state==="active"&&(Xe.trackName.textContent=`Deliver the ${Ke.type.toUpperCase()} · ${Math.max(0,Math.ceil(Ke.timeLeft))}s`),Xe.hud.style.display=s?"flex":"none",Xe.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",Xe.touchControls.style.display=s?"":"none",Xe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of qn)d.progEl&&(d.progEl.style.width=`${Math.round((l.practice?0:Ku(d.distance))*100)}%`);const a=Vy();l.gear=a.gear;const r=performance.now(),o=Math.min(.05,(r-x0)/1e3);x0=r;const c=1-Math.exp(-o*(a.rpm>l.tachRpm?10:6));l.tachRpm+=(a.rpm-l.tachRpm)*c,Wy(l.tachRpm,a.gear);const h=Math.abs(l.speed)*2.25;Ac+=(h-Ac)*(1-Math.exp(-o*8)),Cc+=(l.boost-Cc)*(1-Math.exp(-o*9)),Gy(Ac,l.speed<-.5),Hy(Cc,l.boosting),Xe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),Xe.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(Xe.centerMessage.textContent="Paused",Xe.centerMessage.classList.remove("hidden")):l.messageTimer>0?(Xe.centerMessage.textContent=l.message,Xe.centerMessage.classList.remove("hidden")):Xe.centerMessage.classList.add("hidden")}function xl(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}const Bn={active:!1,prev:{}};function Xy(){let n=null;if(navigator.getGamepads){for(const d of navigator.getGamepads())if(d&&d.connected){n=d;break}}if(!n){if(Bn.active){Bn.active=!1,Ee.steer=0,Ee.throttle=0,Ee.brake=0;for(const d of["Space","ShiftLeft"])Bn.prev[d]&&(je.delete(d),Bn.prev[d]=!1)}return}const e=d=>Math.abs(d)<.14?0:d,t=e(n.axes[0]||0),i=Math.max(n.buttons[7]?.value||0,n.buttons[0]?.pressed?1:0),s=Math.max(n.buttons[6]?.value||0,n.buttons[1]?.pressed?1:0),a=!!n.buttons[2]?.pressed,r=!!n.buttons[3]?.pressed,o=!!n.buttons[5]?.pressed,c=!!n.buttons[9]?.pressed;if(!Bn.active&&!t&&!i&&!s&&!a&&!r&&!o&&!c)return;Bn.active||as(),Bn.active=!0,Ee.steer=t,Ee.throttle=i,Ee.brake=s;const h=(d,u)=>{u&&!Bn.prev[d]?je.add(d):!u&&Bn.prev[d]&&je.delete(d),Bn.prev[d]=u};h("Space",a),h("ShiftLeft",o),r&&!Bn.prev.actB&&l.mode==="roam"&&Ed(),Bn.prev.actB=r,c&&!Bn.prev.startB&&window.dispatchEvent(new KeyboardEvent("keydown",{code:l.mode==="race"||l.mode==="paused"?"KeyP":"Escape"})),Bn.prev.startB=c}function rp(){an.info.reset(),Xy();const n=IM.getDelta();let e=Math.min(.033,n);l.sloMoT>0&&(l.sloMoT=Math.max(0,l.sloMoT-e),e*=.42),l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?vy(e):l.vehicle==="heli"?My(e):$f(e),ip(e),dy()):l.mode==="menu"?(m0(e),By(e)):(sp(e),m0(e),Oy(),ky(),Pd(e)),py(),fy(),mi&&mi.position.copy(ye.position),oy(e),yf(e),Cr(),ly(),vr.uniforms.uTime.value+=e,vf.forEach(i=>i.uniforms.uTime.value+=e),vr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);vr.uniforms.uBoost.value+=(t-vr.uniforms.uBoost.value)*Math.min(1,e*6),ja.render(),Me.renderCalls=an.info.render.calls,Me.renderTris=an.info.render.triangles,requestAnimationFrame(rp)}window.addEventListener("keydown",n=>{je.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused"?UM():l.mode==="roam"&&l.vehicle!=="foot"&&Cy()),n.code==="KeyE"&&Ed(),n.code==="KeyN"&&xp(),n.code==="KeyV"&&Dd(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",je.clear(),qr()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",qr(),Gt.visible=!1,dn&&(dn.visible=!0),document.body.classList.remove("roam-mode"),Xi(),Xe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>je.delete(n.code));window.addEventListener("resize",()=>{ye.aspect=window.innerWidth/window.innerHeight,ye.updateProjectionMatrix(),an.setSize(window.innerWidth,window.innerHeight),ja.setSize(window.innerWidth,window.innerHeight),Of.setSize(window.innerWidth,window.innerHeight)});const gl=()=>{as(),window.removeEventListener("pointerdown",gl),window.removeEventListener("keydown",gl)};window.addEventListener("pointerdown",gl);window.addEventListener("keydown",gl);const Wr=document.createElement("button");Wr.id="volBtn",Wr.type="button";function op(){Wr.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}op();Wr.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Ae&&Ae.master.gain.setTargetAtTime(e,Ae.ctx.currentTime,.05),op()});const lp=document.querySelector("#menuToggles")||Xe.menu;lp.appendChild(Wr);const Xr=document.createElement("button");Xr.id="musicBtn",Xr.type="button";function cp(){Xr.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}cp();Xr.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),as(),cp()});lp.appendChild(Xr);const Rr=document.createElement("button");Rr.id="actionBtn",Rr.type="button",Rr.textContent="E";Rr.addEventListener("pointerdown",n=>{n.preventDefault(),as(),Ed()});Xe.touchControls.appendChild(Rr);const Il=document.createElement("div");Il.className="course-select";Il.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';Xe.freeRunBtn.parentNode.insertBefore(Il,Xe.freeRunBtn);const hp=[];Cs.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>S_(e)),Il.querySelector("#carButtons").appendChild(t),hp.push(t)});function Nh(){const n=Cs[Vi],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),hp.forEach((t,i)=>t.classList.toggle("active",i===Vi))}Nh();Xe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+qn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");Xe.playerProgress=document.querySelector("#playerProgress");qn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function Fl(){const n=Qr();Xe.startBtn.textContent=Xt?.active?`Continue Season — Race ${Xt.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=Cf();e.innerHTML=`<span>Division ${Af(n)}${Xt?.active?` — after race ${Xt.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Xt?` — ${i.pts} pts`:""}</b>`).join("")}}function qy(){l.mode==="roam"&&l.score>800&&Mp("roam",l.score,{deliveries:Me.deliveries||0,stunts:Me.stunts||0,busts:Me.busts||0}),l.mode="menu",qr(),Gt.visible=!1,dn&&(dn.visible=!0),jr(!1),document.body.classList.remove("roam-mode"),Xi(),Fl(),Xe.result.classList.add("hidden"),Xe.menu.classList.remove("hidden")}Fl();Xe.startBtn.addEventListener("click",()=>{Xt&&Xt.active||E_(),eo(xe.clamp(Xt.raceIndex,0,3)),Hr(!1,!1,!0)});Xe.practiceBtn.addEventListener("click",()=>Hr(!0));Xe.freeRunBtn.addEventListener("click",()=>Hr(!0,!0));Xe.roamBtn.addEventListener("click",()=>pl());Xe.againBtn.addEventListener("click",()=>{l.seasonRace&&Xt?Xt.active&&Xt.raceIndex<4?(eo(Xt.raceIndex),Hr(!1,!1,!0)):qy():Hr(!1)});Xe.courseButtons.forEach(n=>{n.addEventListener("click",()=>eo(Number(n.dataset.course)))});function dp(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function qr(){Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,Ee.lookPointer=null,Ee.drivePointer=null,Ee.pinchStartDistance=0,Ee.pinchStartZoom=0;for(const n of Xe.touchControls.querySelectorAll(".touch-stick"))dp(n)}function qo(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=xe.clamp(e.clientX-(t.left+t.width/2),-i,i),a=xe.clamp(e.clientY-(t.top+t.height/2),-i,i),r=n.dataset.stick;if(n.classList.add("active"),r==="look")Ee.lookX=xe.clamp(s/i,-1,1),Ee.lookY=xe.clamp(-a/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Ee.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Ee.lookY*i)}px`);else{const o=xe.clamp(s/i,-1,1),c=xe.clamp(-a/i,-1,1);Ee.steer=o,Ee.throttle=Math.max(0,c),Ee.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function g0(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function v0(n,e){e==="look"?(Ee.lookX=0,Ee.lookY=0,Ee.lookPointer=null):(Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.drivePointer=null),dp(n)}function Yy(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function up(n,e=!1){if(n.touches.length<2){Ee.pinchStartDistance=0;return}const t=Yy(n.touches[0],n.touches[1]);if(e||!(Ee.pinchStartDistance>0)){Ee.pinchStartDistance=t,Ee.pinchStartZoom=Ee.zoom;return}const i=Math.max(.2,t/Ee.pinchStartDistance);Ee.zoom=xe.clamp(Ee.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of Xe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),as(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Ee.lookPointer=s.pointerId),e==="drive"&&(Ee.drivePointer=s.pointerId),qo(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&(s.preventDefault(),qo(n,s))},{passive:!1});const t=s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&v0(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),as(),l.mode==="paused"&&(l.mode="race");const a=s.changedTouches[0];a&&(e==="look"&&(Ee.lookPointer=a.identifier),e==="drive"&&(Ee.drivePointer=a.identifier),qo(n,a))},{passive:!1}),n.addEventListener("touchmove",s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer,r=g0(s,a);r&&(s.preventDefault(),qo(n,r))},{passive:!1});const i=s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer;g0(s,a)&&(s.preventDefault(),v0(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of Xe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),as(),je.add(e),n.setPointerCapture(i.pointerId)});const t=()=>je.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}Kr.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),up(n,!0))},{passive:!1});Kr.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),up(n))},{passive:!1});Kr.addEventListener("touchend",n=>{n.touches.length<2&&(Ee.pinchStartDistance=0)},{passive:!1});Kr.addEventListener("touchcancel",()=>{Ee.pinchStartDistance=0},{passive:!1});var Ei=0;function qa(){return Ei}let oi=localStorage.getItem("steel-ribbon-weather")||"clear";oi==="rain"||(oi="clear");const Ld=420,fp=[];for(let n=0;n<Ld;n++)fp.push({x:(Math.random()-.5)*130,y:Math.random()*90,z:(Math.random()-.5)*130});const vl=new jt;vl.setAttribute("position",new St(new Float32Array(Ld*6),3));const pp=new ll({color:10203340,transparent:!0,opacity:0,depthWrite:!1}),Zs=new Zm(vl,pp);Zs.frustumCulled=!1,Zs.renderOrder=40,Zs.visible=!1,Se.add(Zs);pn(new Ut,(n,e)=>{const t=oi==="rain"?1:0;if(Ei+=(t-Ei)*Math.min(1,e*1.3),t===0&&Ei<.01&&(Ei=0),Zs.visible=Ei>.02,pp.opacity=.34*Ei,Zs.visible){Zs.position.copy(ye.position);const i=vl.attributes.position.array;for(let s=0;s<Ld;s++){const a=fp[s];a.y-=96*e,a.y<-8&&(a.y+=98);const r=s*6;i[r]=a.x,i[r+1]=a.y,i[r+2]=a.z,i[r+3]=a.x+.3,i[r+4]=a.y-1.7,i[r+5]=a.z}vl.attributes.position.needsUpdate=!0}mn.roadMat&&(mn.roadMat.roughness=.62-.37*Ei,mn.roadMat.metalness=.1+.26*Ei,mn.roadMat.envMapIntensity=.8+.9*Ei)});function Dd(){oi=oi==="rain"?"clear":"rain",localStorage.setItem("steel-ribbon-weather",oi),mp(),l.message=oi==="rain"?"Rain rolling in":"Skies clearing",l.messageTimer=1.2}const Yr=document.createElement("button");Yr.id="weatherBtn",Yr.type="button";function mp(){Yr.textContent=oi==="rain"?"🌧 Rain":"☀ Clear"}mp();Yr.addEventListener("click",n=>{n.stopPropagation(),Dd()});(document.querySelector("#menuToggles")||Xe.menu).appendChild(Yr);const Pr=["dusk","night","day","cycle"],$y={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let Hn=localStorage.getItem("steel-ribbon-tod")||"dusk";Pr.includes(Hn)||(Hn="dusk");let el=0,tl=0,Rc=95;const Zy=new rt,kh=new rt,Ky=new rt;function ks(n,e,t,i,s){return Ky.set(n).lerp(Zy.set(e),i).lerp(kh.set(t),s)}const ms=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Se.traverse(n=>{n.isSprite&&n.renderOrder===-50&&mn.cloudMats.push(n.material)});function Jy(n,e){if(!mn.skyU)return;const t=qa();mn.skyU.uDay.value=n,mn.skyU.uNight.value=e,mn.skyU.uRain.value=t;const i=mn;i.hemi.color.copy(ks(16757626,12573183,2371663,n,e)),i.hemi.groundColor.copy(ks(3097190,5925464,789534,n,e)),i.hemi.intensity=ms(.66,.95,.22,n,e)*(1-.38*t),i.fill.color.copy(ks(7179775,13096432,2240591,n,e)),i.fill.intensity=ms(.6,.5,.16,n,e)*(1-.3*t),i.key.color.copy(ks(16752724,16774880,10336511,n,e)),i.key.intensity=ms(2.3,2.6,.45,n,e)*(1-.5*t),i.rim.intensity=ms(.5,.3,.1,n,e)*(1-.4*t),Se.fog.color.copy(ks(14719602,12834794,723741,n,e).lerp(kh.set(5923950),.6*t)),Se.fog.near=ms(360,430,300,n,e)*(1-.45*t),Se.fog.far=ms(2150,2600,1650,n,e)*(1-.35*t),i.sunMat.color.copy(ks(16764250,16777198,14542591,n,e)),i.sunMat.opacity=ms(.92,.95,.5,n,e)*(1-.85*t);for(const a of i.glowMats)a.mat.opacity=ms(a.dusk,a.dusk*.55,a.dusk*.18,n,e)*(1-.7*t);const s=ks(16777215,16777215,3687001,n,e).lerp(kh.set(4147533),.65*t);for(const a of i.cloudMats)a.color.copy(s)}pn(new Ut,(n,e)=>{let t=0,i=0;if(Hn==="day")t=1;else if(Hn==="night")i=1;else if(Hn==="cycle"){Rc=(Rc+e)%270;const a=Rc;a<60?t=1:a<90?t=1-(a-60)/30:a<120||(a<150?i=(a-120)/30:a<210?i=1:a<240?i=1-(a-210)/30:t=(a-240)/30)}const s=Math.min(1,e*1.4);el+=(t-el)*s,tl+=(i-tl)*s,Jy(el,tl)});function xp(){Hn=Pr[(Pr.indexOf(Hn)+1)%Pr.length],localStorage.setItem("steel-ribbon-tod",Hn),Id(),l.message=`Time of day: ${Hn.toUpperCase()}`,l.messageTimer=1.2}const $r=document.createElement("button");$r.id="todBtn",$r.type="button";function Id(){$r.textContent=`${$y[Hn]} ${Hn[0].toUpperCase()}${Hn.slice(1)}`}Id();$r.addEventListener("click",n=>{n.stopPropagation(),xp()});(document.querySelector("#menuToggles")||Xe.menu).appendChild($r);const M0=document.querySelector("#menuMain"),jy=document.querySelector("#onlinePanel"),Qy=document.querySelector("#scoresPanel");function Ml(n){M0&&(M0.classList.toggle("hidden",!!n),jy.classList.toggle("hidden",n!=="online"),Qy.classList.toggle("hidden",n!=="scores"))}const gp={lap:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-laps-v1",roam:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-roam-v1"},Oh="steel-ribbon-initials",Ea=document.querySelector("#initials");Ea&&(Ea.value=localStorage.getItem(Oh)||"",Ea.addEventListener("input",()=>{Ea.value=Ea.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,3),localStorage.setItem(Oh,Ea.value)}));function eb(){return(localStorage.getItem(Oh)||"").slice(0,3)}let Zr="lap";async function vp(n){try{const e=new AbortController,t=setTimeout(()=>e.abort(),7e3),i=await fetch(gp[n],{signal:e.signal,cache:"no-store"});clearTimeout(t);const s=await i.json();return(Array.isArray(s)?s:s.scores||[]).filter(r=>Number(r.score)>0).sort((r,o)=>o.score-r.score).slice(0,12)}catch{return null}}async function Mp(n,e,t={}){const i=eb();if(!i||!(e>0))return!1;try{const s=new AbortController,a=setTimeout(()=>s.abort(),7e3);return await fetch(gp[n],{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initials:i,score:Math.max(0,Math.floor(e)),extra:t}),signal:s.signal}),clearTimeout(a),Me.scoresPosted=(Me.scoresPosted||0)+1,!0}catch{return!1}}async function _p(){const n=document.querySelector("#scoreBoard");if(!n)return;n.textContent="Loading…";const e=await vp(Zr);if(!e){n.textContent="Leaderboard unreachable — try again later.";return}if(!e.length){n.textContent="No entries yet — set your initials and claim the first spot.";return}n.innerHTML=e.map((t,i)=>{const s=String(t.initials||t.name||"???").slice(0,3),a=Zr==="lap"?t.extra?.time?`${Number(t.extra.time).toFixed(2)}s — ${t.extra.course||"?"}`:Math.round(t.score):Math.round(t.score).toLocaleString();return`<div class="score-row"><i>${i+1}</i><b>${s}</b><span>${a}</span></div>`}).join("")}for(const[n,e]of[["#lapBoardBtn","lap"],["#roamBoardBtn","roam"]]){const t=document.querySelector(n);t&&t.addEventListener("click",()=>{Zr=e,document.querySelector("#lapBoardBtn")?.classList.toggle("active-board",e==="lap"),document.querySelector("#roamBoardBtn")?.classList.toggle("active-board",e==="roam"),_p()})}document.querySelector("#scoresBtn")?.addEventListener("click",()=>(Ml("scores"),_p()));document.querySelector("#scoresBackBtn")?.addEventListener("click",()=>Ml(null));const tb="wss://iron-ridge-online.jez237.workers.dev/ws",yp="steel-ribbon-mp-room",bp="steel-ribbon-mp-name",gt={ws:null,connected:!1,id:null,room:"",name:"",peers:new Map,lastState:0,lastPing:0,manual:!1},mr=(n,e,t)=>String(n||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,t)||e;function nb(){const n="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let e="";const t=new Uint8Array(5);crypto.getRandomValues(t);for(const i of t)e+=n[i%n.length];return e}function xs(n){const e=document.querySelector("#mpStatus");e&&(e.textContent=n)}function ib(n){const e=document.createElement("canvas");e.width=256,e.height=64;const t=e.getContext("2d");t.clearRect(0,0,256,64),t.fillStyle="rgba(10, 16, 26, 0.78)",t.fillRect(14,10,228,42),t.strokeStyle="rgba(140, 200, 255, 0.9)",t.lineWidth=3,t.strokeRect(14,10,228,42),t.fillStyle="#d8ecff",t.font="800 24px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,128,32,208);const i=new en(e);i.colorSpace=Lt;const s=new ol(new bl({map:i,transparent:!0,depthTest:!1}));return s.scale.set(7.4,1.85,1),s}function _0(n,e){let t=gt.peers.get(n);return t||(t={id:n,name:e||"DRIVER",hue:[...n].reduce((i,s)=>i+s.charCodeAt(0),0),tx:0,ty:0,tz:0,tyaw:0,v:"car",has:!1,lastSeen:performance.now()},gt.peers.set(n,t)),e&&(t.name=e),t}function sb(n){n.car||(n.car=Jr("compact",[16739693,5163247,16770048,9498256,3531007][n.hue%5]),n.car.userData.stolenYOff=.57,Se.add(n.car),n.walker=gd(9464783,4149685),n.walker.visible=!1,Se.add(n.walker),n.label=ib(n.name),Se.add(n.label))}function Fd(n){n.car&&Rs(n.car),n.walker&&Rs(n.walker),n.label&&(n.label.material.map?.dispose(),n.label.material.dispose(),Se.remove(n.label)),gt.peers.delete(n.id)}function _l(n=!0){if(gt.manual=n,gt.ws)try{gt.ws.close(1e3,"leave")}catch{}gt.ws=null,gt.connected=!1,gt.id=null;for(const e of[...gt.peers.values()])Fd(e);xs("Not connected."),Ud()}function wp(){_l(!0);const n=mr(document.querySelector("#mpName")?.value,"DRIVER",12),e=mr(document.querySelector("#mpRoom")?.value,"",10)||nb(),t=document.querySelector("#mpRoom");t&&(t.value=e),localStorage.setItem(yp,e),localStorage.setItem(bp,n),gt.room=e,gt.name=n,gt.manual=!1,xs(`Connecting to ${e}…`);let i;try{i=new WebSocket(`${tb}/${encodeURIComponent(`SRR-${e}`)}`)}catch{xs("Connection failed.");return}gt.ws=i,i.onopen=()=>{gt.connected=!0,i.send(JSON.stringify({type:"hello",name:n})),xs(`Room ${e} — connected`),Ud()},i.onclose=()=>{gt.ws===i&&(_l(!0),xs(gt.manual?"Not connected.":"Connection dropped."))},i.onerror=()=>xs("Connection failed — try again."),i.onmessage=s=>{let a;try{a=JSON.parse(s.data)}catch{return}if(a.type==="welcome"){gt.id=a.id,xs(`Room ${gt.room} — ${Math.max(1,Number(a.count)||1)} cruising`);return}if(a.type==="peers"){const r=new Set((a.peers||[]).filter(o=>o.id!==gt.id).map(o=>o.id));for(const o of[...gt.peers.values()])r.has(o.id)||Fd(o);for(const o of a.peers||[]){if(!o.id||o.id===gt.id)continue;const c=gt.peers.has(o.id);_0(o.id,mr(o.name,"DRIVER",12)),c||l.mode==="roam"&&(l.message=`${mr(o.name,"DRIVER",12)} joined the cruise`,l.messageTimer=1.6)}xs(`Room ${gt.room} — ${gt.peers.size+1} cruising`);return}if(!(!a.from||a.from===gt.id)&&a.type==="state"&&a.state){const r=_0(a.from,a.name&&mr(a.name,"DRIVER",12));r.tx=Number(a.state.x)||0,r.ty=Number(a.state.y)||0,r.tz=Number(a.state.z)||0,r.tyaw=Number(a.state.yaw)||0,r.v=a.state.v==="foot"?"foot":"car",r.lastSeen=performance.now(),r.has||(sb(r),r.car.position.set(r.tx,r.ty,r.tz),r.has=!0)}}}function Ud(){const n=document.querySelector("#mpJoinBtn"),e=document.querySelector("#mpLeaveBtn");n&&(n.textContent=gt.connected?"Switch Room":"Join Room"),e&&e.classList.toggle("hidden",!gt.connected)}{const n=document.querySelector("#mpName"),e=document.querySelector("#mpRoom");n&&(n.value=localStorage.getItem(bp)||""),e&&(e.value=localStorage.getItem(yp)||""),document.querySelector("#onlineBtn")?.addEventListener("click",()=>Ml("online")),document.querySelector("#onlineBackBtn")?.addEventListener("click",()=>Ml(null)),document.querySelector("#mpJoinBtn")?.addEventListener("click",wp),document.querySelector("#mpLeaveBtn")?.addEventListener("click",()=>_l(!0)),Ud()}pn(new Ut,(n,e)=>{if(!gt.connected)return;const t=performance.now();for(const i of[...gt.peers.values()]){if(!i.has)continue;if(t-i.lastSeen>12e3){Fd(i);continue}const s=1-Math.exp(-10*e),a=i.v!=="foot";i.car.visible=a,i.walker.visible=!a;const r=a?i.car:i.walker;if(r.position.lerp(pd.set(i.tx,i.ty-(a?.25:.5),i.tz),s),r.rotation.y=-i.tyaw,i.label.position.set(r.position.x,r.position.y+(a?3.4:3),r.position.z),a)for(const o of i.car.userData.wheels||[])o.rotation.x-=20*e}t-gt.lastPing>5e3&&(gt.lastPing=t,gt.ws?.readyState===1&&gt.ws.send(JSON.stringify({type:"ping",t}))),l.mode==="roam"&&t-gt.lastState>95&&gt.ws?.readyState===1&&(gt.lastState=t,gt.ws.send(JSON.stringify({type:"state",name:gt.name,state:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1),yaw:+l.roamYaw.toFixed(2),v:l.vehicle==="foot"?"foot":"car"}}))),Me.mpPeers=gt.peers.size});function ab(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of xd)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of Jt)e(c.marker);e(Gt),e(hn),typeof dn<"u"&&e(dn),typeof vi<"u"&&e(vi),de&&e(de.mesh),typeof mi<"u"&&e(mi),typeof Ci<"u"&&Ci&&e(Ci);for(const c of qn)e(c.mesh);const i=new Map;Se.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let p=c;p&&p!==Se;p=p.parent){if(n.has(p)||!p.visible)return;const x=p.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const u=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let m=i.get(u);m||i.set(u,m=[]),m.push(c)});let s=0,a=0;const r=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(p=>{p.updateWorldMatrix(!0,!1);const x=p.geometry.clone().applyMatrix4(p.matrixWorld);for(const M of Object.keys(x.attributes))M==="position"||M==="normal"||M==="uv"||x.deleteAttribute(M);return x}),d=Xn(h,!1);if(!d)continue;const u=c[0],m=new z(d,u.material);m.castShadow=u.castShadow,m.receiveShadow=u.receiveShadow,m.matrixAutoUpdate=!1,Se.add(m);for(const p of c)r.set(p.geometry.uuid,p.geometry),p.removeFromParent(),a++;s++}catch{}const o=new Set;Se.traverse(c=>c.geometry&&o.add(c.geometry.uuid));for(const[c,h]of r)o.has(c)||h.dispose();Me.staticMerge={groups:s,meshesRemoved:a}}ab();const rb=mt(l.s);l.y=rb.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;Pd(.016);Cr();rp();
