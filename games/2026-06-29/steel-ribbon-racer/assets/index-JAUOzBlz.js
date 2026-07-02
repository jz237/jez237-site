(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Cc="181",Mf=0,uh=1,yf=2,Vd=1,Gd=2,Ti=3,Qi=0,vn=1,xt=2,ui=0,er=1,Qn=2,fh=3,ph=4,Sf=5,us=100,bf=101,wf=102,Tf=103,Ef=104,Af=200,Cf=201,Rf=202,Pf=203,Sl=204,bl=205,Lf=206,Df=207,If=208,Uf=209,Ff=210,Nf=211,zf=212,Of=213,Bf=214,wl=0,Tl=1,El=2,ar=3,Al=4,Cl=5,Rl=6,Pl=7,Rc=0,kf=1,Vf=2,Zi=0,Hd=1,Wd=2,Xd=3,Pc=4,qd=5,Yd=6,$d=7,Zd=300,or=301,lr=302,Ll=303,Dl=304,vo=306,Mn=1e3,Pi=1001,Il=1002,Fn=1003,Gf=1004,xa=1005,Wn=1006,Do=1007,ps=1008,xi=1009,Kd=1010,Jd=1011,Zr=1012,Lc=1013,ys=1014,ci=1015,fi=1016,Dc=1017,Ic=1018,Kr=1020,jd=35902,Qd=35899,eu=1021,tu=1022,ei=1023,Jr=1026,jr=1027,Uc=1028,Fc=1029,Nc=1030,zc=1031,Oc=1033,Ka=33776,Ja=33777,ja=33778,Qa=33779,Ul=35840,Fl=35841,Nl=35842,zl=35843,Ol=36196,Bl=37492,kl=37496,Vl=37808,Gl=37809,Hl=37810,Wl=37811,Xl=37812,ql=37813,Yl=37814,$l=37815,Zl=37816,Kl=37817,Jl=37818,jl=37819,Ql=37820,ec=37821,tc=36492,nc=36494,ic=36495,sc=36283,rc=36284,ac=36285,oc=36286,Hf=3200,Wf=3201,Bc=0,Xf=1,Xi="",Et="srgb",cr="srgb-linear",io="linear",Bt="srgb",Ds=7680,mh=519,qf=512,Yf=513,$f=514,nu=515,Zf=516,Kf=517,Jf=518,jf=519,lc=35044,xh="300 es",hi=2e3,so=2001;function iu(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ro(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Qf(){const n=ro("canvas");return n.style.display="block",n}const gh={};function ao(...n){const e="THREE."+n.shift();console.log(e,...n)}function ft(...n){const e="THREE."+n.shift();console.warn(e,...n)}function jt(...n){const e="THREE."+n.shift();console.error(e,...n)}function Qr(...n){const e=n.join(" ");e in gh||(gh[e]=!0,ft(...n))}function e0(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class fr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vh=1234567;const zr=Math.PI/180,ea=180/Math.PI;function pi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(mn[n&255]+mn[n>>8&255]+mn[n>>16&255]+mn[n>>24&255]+"-"+mn[e&255]+mn[e>>8&255]+"-"+mn[e>>16&15|64]+mn[e>>24&255]+"-"+mn[t&63|128]+mn[t>>8&255]+"-"+mn[t>>16&255]+mn[t>>24&255]+mn[i&255]+mn[i>>8&255]+mn[i>>16&255]+mn[i>>24&255]).toLowerCase()}function yt(n,e,t){return Math.max(e,Math.min(t,n))}function kc(n,e){return(n%e+e)%e}function t0(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function n0(n,e,t){return n!==e?(t-n)/(e-n):0}function Or(n,e,t){return(1-t)*n+t*e}function i0(n,e,t,i){return Or(n,e,1-Math.exp(-t*i))}function s0(n,e=1){return e-Math.abs(kc(n,e*2)-e)}function r0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function a0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function o0(n,e){return n+Math.floor(Math.random()*(e-n+1))}function l0(n,e){return n+Math.random()*(e-n)}function c0(n){return n*(.5-Math.random())}function h0(n){n!==void 0&&(vh=n);let e=vh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function d0(n){return n*zr}function u0(n){return n*ea}function f0(n){return(n&n-1)===0&&n!==0}function p0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function m0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function x0(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),h=r((e+i)/2),d=a((e+i)/2),f=r((e-i)/2),p=a((e-i)/2),m=r((i-e)/2),x=a((i-e)/2);switch(s){case"XYX":n.set(o*d,c*f,c*p,o*h);break;case"YZY":n.set(c*p,o*d,c*f,o*h);break;case"ZXZ":n.set(c*f,c*p,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*m,o*h);break;case"YXY":n.set(c*m,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*m,o*d,o*h);break;default:ft("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function jn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function kt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ge={DEG2RAD:zr,RAD2DEG:ea,generateUUID:pi,clamp:yt,euclideanModulo:kc,mapLinear:t0,inverseLerp:n0,lerp:Or,damp:i0,pingpong:s0,smoothstep:r0,smootherstep:a0,randInt:o0,randFloat:l0,randFloatSpread:c0,seededRandom:h0,degToRad:d0,radToDeg:u0,isPowerOfTwo:f0,ceilPowerOfTwo:p0,floorPowerOfTwo:m0,setQuaternionFromProperEuler:x0,normalize:kt,denormalize:jn};class Pe{constructor(e=0,t=0){Pe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ii{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],h=i[s+1],d=i[s+2],f=i[s+3],p=r[a+0],m=r[a+1],x=r[a+2],M=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=f;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=M;return}if(f!==M||c!==p||h!==m||d!==x){let g=c*p+h*m+d*x+f*M;g<0&&(p=-p,m=-m,x=-x,M=-M,g=-g);let u=1-o;if(g<.9995){const _=Math.acos(g),v=Math.sin(_);u=Math.sin(u*_)/v,o=Math.sin(o*_)/v,c=c*u+p*o,h=h*u+m*o,d=d*u+x*o,f=f*u+M*o}else{c=c*u+p*o,h=h*u+m*o,d=d*u+x*o,f=f*u+M*o;const _=1/Math.sqrt(c*c+h*h+d*d+f*f);c*=_,h*=_,d*=_,f*=_}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],f=r[a],p=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+d*f+c*m-h*p,e[t+1]=c*x+d*p+h*f-o*m,e[t+2]=h*x+d*m+o*p-c*f,e[t+3]=d*x-o*f-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),f=o(r/2),p=c(i/2),m=c(s/2),x=c(r/2);switch(a){case"XYZ":this._x=p*d*f+h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f-p*m*x;break;case"YXZ":this._x=p*d*f+h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f+p*m*x;break;case"ZXY":this._x=p*d*f-h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f-p*m*x;break;case"ZYX":this._x=p*d*f-h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f+p*m*x;break;case"YZX":this._x=p*d*f+h*m*x,this._y=h*m*f+p*d*x,this._z=h*d*x-p*m*f,this._w=h*d*f-p*m*x;break;case"XZY":this._x=p*d*f-h*m*x,this._y=h*m*f-p*d*x,this._z=h*d*x+p*m*f,this._w=h*d*f+p*m*x;break;default:ft("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],d=t[6],f=t[10],p=i+o+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-h)*m,this._z=(a-s)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+h)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(r-h)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-s)/m,this._x=(r+h)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+a*o+s*h-r*c,this._y=s*d+a*c+r*o-i*h,this._z=r*d+a*h+i*c-s*o,this._w=a*d-i*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_h.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_h.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*i),d=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+c*h+a*f-o*d,this.y=i+c*d+o*h-r*f,this.z=s+c*f+r*d-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Io.copy(this).projectOnVector(e),this.sub(Io)}reflect(e){return this.sub(Io.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Io=new P,_h=new Ii;class _t{constructor(e,t,i,s,r,a,o,c,h){_t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h)}set(e,t,i,s,r,a,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=i,d[7]=a,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],d=i[4],f=i[7],p=i[2],m=i[5],x=i[8],M=s[0],g=s[3],u=s[6],_=s[1],v=s[4],y=s[7],E=s[2],T=s[5],C=s[8];return r[0]=a*M+o*_+c*E,r[3]=a*g+o*v+c*T,r[6]=a*u+o*y+c*C,r[1]=h*M+d*_+f*E,r[4]=h*g+d*v+f*T,r[7]=h*u+d*y+f*C,r[2]=p*M+m*_+x*E,r[5]=p*g+m*v+x*T,r[8]=p*u+m*y+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*a*d-t*o*h-i*r*d+i*o*c+s*r*h-s*a*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8],f=d*a-o*h,p=o*c-d*r,m=h*r-a*c,x=t*f+i*p+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=f*M,e[1]=(s*h-d*i)*M,e[2]=(o*i-s*a)*M,e[3]=p*M,e[4]=(d*t-s*c)*M,e[5]=(s*r-o*t)*M,e[6]=m*M,e[7]=(i*c-h*t)*M,e[8]=(a*t-i*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Uo.makeScale(e,t)),this}rotate(e){return this.premultiply(Uo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Uo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Uo=new _t,Mh=new _t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yh=new _t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function g0(){const n={enabled:!0,workingColorSpace:cr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Bt&&(s.r=Li(s.r),s.g=Li(s.g),s.b=Li(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Bt&&(s.r=tr(s.r),s.g=tr(s.g),s.b=tr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xi?io:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Qr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Qr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[cr]:{primaries:e,whitePoint:i,transfer:io,toXYZ:Mh,fromXYZ:yh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:i,transfer:Bt,toXYZ:Mh,fromXYZ:yh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),n}const Rt=g0();function Li(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function tr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Is;class v0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Is===void 0&&(Is=ro("canvas")),Is.width=e.width,Is.height=e.height;const s=Is.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Is}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ro("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Li(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Li(t[i]/255)*255):t[i]=Li(t[i]);return{data:t,width:e.width,height:e.height}}else return ft("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _0=0;class Vc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_0++}),this.uuid=pi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Fo(s[a].image)):r.push(Fo(s[a]))}else r=Fo(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Fo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?v0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ft("Texture: Unable to serialize Texture."),{})}let M0=0;const No=new P;class _n extends fr{constructor(e=_n.DEFAULT_IMAGE,t=_n.DEFAULT_MAPPING,i=Pi,s=Pi,r=Wn,a=ps,o=ei,c=xi,h=_n.DEFAULT_ANISOTROPY,d=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:M0++}),this.uuid=pi(),this.name="",this.source=new Vc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new _t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(No).x}get height(){return this.source.getSize(No).y}get depth(){return this.source.getSize(No).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){ft(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ft(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mn:e.x=e.x-Math.floor(e.x);break;case Pi:e.x=e.x<0?0:1;break;case Il:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mn:e.y=e.y-Math.floor(e.y);break;case Pi:e.y=e.y<0?0:1;break;case Il:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}_n.DEFAULT_IMAGE=null;_n.DEFAULT_MAPPING=Zd;_n.DEFAULT_ANISOTROPY=1;class Gt{constructor(e=0,t=0,i=0,s=1){Gt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,h=c[0],d=c[4],f=c[8],p=c[1],m=c[5],x=c[9],M=c[2],g=c[6],u=c[10];if(Math.abs(d-p)<.01&&Math.abs(f-M)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+p)<.1&&Math.abs(f+M)<.1&&Math.abs(x+g)<.1&&Math.abs(h+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,y=(m+1)/2,E=(u+1)/2,T=(d+p)/4,C=(f+M)/4,R=(x+g)/4;return v>y&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=C/i):y>E?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=R/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=C/r,s=R/r),this.set(i,s,r,t),this}let _=Math.sqrt((g-x)*(g-x)+(f-M)*(f-M)+(p-d)*(p-d));return Math.abs(_)<.001&&(_=1),this.x=(g-x)/_,this.y=(f-M)/_,this.z=(p-d)/_,this.w=Math.acos((h+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this.w=yt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this.w=yt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class y0 extends fr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Gt(0,0,e,t),this.scissorTest=!1,this.viewport=new Gt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new _n(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Wn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Vc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ni extends y0{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class su extends _n{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Fn,this.minFilter=Fn,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class S0 extends _n{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Fn,this.minFilter=Fn,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rs{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Yn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Yn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Yn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Yn):Yn.fromBufferAttribute(r,a),Yn.applyMatrix4(e.matrixWorld),this.expandByPoint(Yn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ga.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ga.copy(i.boundingBox)),ga.applyMatrix4(e.matrixWorld),this.union(ga)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Yn),Yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(yr),va.subVectors(this.max,yr),Us.subVectors(e.a,yr),Fs.subVectors(e.b,yr),Ns.subVectors(e.c,yr),Fi.subVectors(Fs,Us),Ni.subVectors(Ns,Fs),ns.subVectors(Us,Ns);let t=[0,-Fi.z,Fi.y,0,-Ni.z,Ni.y,0,-ns.z,ns.y,Fi.z,0,-Fi.x,Ni.z,0,-Ni.x,ns.z,0,-ns.x,-Fi.y,Fi.x,0,-Ni.y,Ni.x,0,-ns.y,ns.x,0];return!zo(t,Us,Fs,Ns,va)||(t=[1,0,0,0,1,0,0,0,1],!zo(t,Us,Fs,Ns,va))?!1:(_a.crossVectors(Fi,Ni),t=[_a.x,_a.y,_a.z],zo(t,Us,Fs,Ns,va))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const _i=[new P,new P,new P,new P,new P,new P,new P,new P],Yn=new P,ga=new Rs,Us=new P,Fs=new P,Ns=new P,Fi=new P,Ni=new P,ns=new P,yr=new P,va=new P,_a=new P,is=new P;function zo(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){is.fromArray(n,r);const o=s.x*Math.abs(is.x)+s.y*Math.abs(is.y)+s.z*Math.abs(is.z),c=e.dot(is),h=t.dot(is),d=i.dot(is);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const b0=new Rs,Sr=new P,Oo=new P;class pr{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):b0.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sr.subVectors(e,this.center);const t=Sr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Sr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sr.copy(e.center).add(Oo)),this.expandByPoint(Sr.copy(e.center).sub(Oo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Mi=new P,Bo=new P,Ma=new P,zi=new P,ko=new P,ya=new P,Vo=new P;class Gc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Bo.copy(e).add(t).multiplyScalar(.5),Ma.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(Bo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ma),o=zi.dot(this.direction),c=-zi.dot(Ma),h=zi.lengthSq(),d=Math.abs(1-a*a);let f,p,m,x;if(d>0)if(f=a*c-o,p=a*o-c,x=r*d,f>=0)if(p>=-x)if(p<=x){const M=1/d;f*=M,p*=M,m=f*(f+a*p+2*o)+p*(a*f+p+2*c)+h}else p=r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;else p=-r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;else p<=-x?(f=Math.max(0,-(-a*r+o)),p=f>0?-r:Math.min(Math.max(-r,-c),r),m=-f*f+p*(p+2*c)+h):p<=x?(f=0,p=Math.min(Math.max(-r,-c),r),m=p*(p+2*c)+h):(f=Math.max(0,-(a*r+o)),p=f>0?r:Math.min(Math.max(-r,-c),r),m=-f*f+p*(p+2*c)+h);else p=a>0?-r:r,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Bo).addScaledVector(Ma,p),m}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);const i=Mi.dot(this.direction),s=Mi.dot(Mi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c;const h=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,s=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,s=(e.min.x-p.x)*h),d>=0?(r=(e.min.y-p.y)*d,a=(e.max.y-p.y)*d):(r=(e.max.y-p.y)*d,a=(e.min.y-p.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-p.z)*f,c=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,c=(e.min.z-p.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,i,s,r){ko.subVectors(t,e),ya.subVectors(i,e),Vo.crossVectors(ko,ya);let a=this.direction.dot(Vo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,e);const c=o*this.direction.dot(ya.crossVectors(zi,ya));if(c<0)return null;const h=o*this.direction.dot(ko.cross(zi));if(h<0||c+h>a)return null;const d=-o*zi.dot(Vo);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class At{constructor(e,t,i,s,r,a,o,c,h,d,f,p,m,x,M,g){At.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h,d,f,p,m,x,M,g)}set(e,t,i,s,r,a,o,c,h,d,f,p,m,x,M,g){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=c,u[2]=h,u[6]=d,u[10]=f,u[14]=p,u[3]=m,u[7]=x,u[11]=M,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new At().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/zs.setFromMatrixColumn(e,0).length(),r=1/zs.setFromMatrixColumn(e,1).length(),a=1/zs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const p=a*d,m=a*f,x=o*d,M=o*f;t[0]=c*d,t[4]=-c*f,t[8]=h,t[1]=m+x*h,t[5]=p-M*h,t[9]=-o*c,t[2]=M-p*h,t[6]=x+m*h,t[10]=a*c}else if(e.order==="YXZ"){const p=c*d,m=c*f,x=h*d,M=h*f;t[0]=p+M*o,t[4]=x*o-m,t[8]=a*h,t[1]=a*f,t[5]=a*d,t[9]=-o,t[2]=m*o-x,t[6]=M+p*o,t[10]=a*c}else if(e.order==="ZXY"){const p=c*d,m=c*f,x=h*d,M=h*f;t[0]=p-M*o,t[4]=-a*f,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*d,t[9]=M-p*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const p=a*d,m=a*f,x=o*d,M=o*f;t[0]=c*d,t[4]=x*h-m,t[8]=p*h+M,t[1]=c*f,t[5]=M*h+p,t[9]=m*h-x,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const p=a*c,m=a*h,x=o*c,M=o*h;t[0]=c*d,t[4]=M-p*f,t[8]=x*f+m,t[1]=f,t[5]=a*d,t[9]=-o*d,t[2]=-h*d,t[6]=m*f+x,t[10]=p-M*f}else if(e.order==="XZY"){const p=a*c,m=a*h,x=o*c,M=o*h;t[0]=c*d,t[4]=-f,t[8]=h*d,t[1]=p*f+M,t[5]=a*d,t[9]=m*f-x,t[2]=x*f-m,t[6]=o*d,t[10]=M*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(w0,e,T0)}lookAt(e,t,i){const s=this.elements;return Rn.subVectors(e,t),Rn.lengthSq()===0&&(Rn.z=1),Rn.normalize(),Oi.crossVectors(i,Rn),Oi.lengthSq()===0&&(Math.abs(i.z)===1?Rn.x+=1e-4:Rn.z+=1e-4,Rn.normalize(),Oi.crossVectors(i,Rn)),Oi.normalize(),Sa.crossVectors(Rn,Oi),s[0]=Oi.x,s[4]=Sa.x,s[8]=Rn.x,s[1]=Oi.y,s[5]=Sa.y,s[9]=Rn.y,s[2]=Oi.z,s[6]=Sa.z,s[10]=Rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],d=i[1],f=i[5],p=i[9],m=i[13],x=i[2],M=i[6],g=i[10],u=i[14],_=i[3],v=i[7],y=i[11],E=i[15],T=s[0],C=s[4],R=s[8],w=s[12],S=s[1],L=s[5],F=s[9],W=s[13],Q=s[2],te=s[6],q=s[10],Z=s[14],ne=s[3],de=s[7],me=s[11],Ge=s[15];return r[0]=a*T+o*S+c*Q+h*ne,r[4]=a*C+o*L+c*te+h*de,r[8]=a*R+o*F+c*q+h*me,r[12]=a*w+o*W+c*Z+h*Ge,r[1]=d*T+f*S+p*Q+m*ne,r[5]=d*C+f*L+p*te+m*de,r[9]=d*R+f*F+p*q+m*me,r[13]=d*w+f*W+p*Z+m*Ge,r[2]=x*T+M*S+g*Q+u*ne,r[6]=x*C+M*L+g*te+u*de,r[10]=x*R+M*F+g*q+u*me,r[14]=x*w+M*W+g*Z+u*Ge,r[3]=_*T+v*S+y*Q+E*ne,r[7]=_*C+v*L+y*te+E*de,r[11]=_*R+v*F+y*q+E*me,r[15]=_*w+v*W+y*Z+E*Ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],d=e[2],f=e[6],p=e[10],m=e[14],x=e[3],M=e[7],g=e[11],u=e[15];return x*(+r*c*f-s*h*f-r*o*p+i*h*p+s*o*m-i*c*m)+M*(+t*c*m-t*h*p+r*a*p-s*a*m+s*h*d-r*c*d)+g*(+t*h*f-t*o*m-r*a*f+i*a*m+r*o*d-i*h*d)+u*(-s*o*d-t*c*f+t*o*p+s*a*f-i*a*p+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8],f=e[9],p=e[10],m=e[11],x=e[12],M=e[13],g=e[14],u=e[15],_=f*g*h-M*p*h+M*c*m-o*g*m-f*c*u+o*p*u,v=x*p*h-d*g*h-x*c*m+a*g*m+d*c*u-a*p*u,y=d*M*h-x*f*h+x*o*m-a*M*m-d*o*u+a*f*u,E=x*f*c-d*M*c-x*o*p+a*M*p+d*o*g-a*f*g,T=t*_+i*v+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/T;return e[0]=_*C,e[1]=(M*p*r-f*g*r-M*s*m+i*g*m+f*s*u-i*p*u)*C,e[2]=(o*g*r-M*c*r+M*s*h-i*g*h-o*s*u+i*c*u)*C,e[3]=(f*c*r-o*p*r-f*s*h+i*p*h+o*s*m-i*c*m)*C,e[4]=v*C,e[5]=(d*g*r-x*p*r+x*s*m-t*g*m-d*s*u+t*p*u)*C,e[6]=(x*c*r-a*g*r-x*s*h+t*g*h+a*s*u-t*c*u)*C,e[7]=(a*p*r-d*c*r+d*s*h-t*p*h-a*s*m+t*c*m)*C,e[8]=y*C,e[9]=(x*f*r-d*M*r-x*i*m+t*M*m+d*i*u-t*f*u)*C,e[10]=(a*M*r-x*o*r+x*i*h-t*M*h-a*i*u+t*o*u)*C,e[11]=(d*o*r-a*f*r-d*i*h+t*f*h+a*i*m-t*o*m)*C,e[12]=E*C,e[13]=(d*M*s-x*f*s+x*i*p-t*M*p-d*i*g+t*f*g)*C,e[14]=(x*o*s-a*M*s-x*i*c+t*M*c+a*i*g-t*o*g)*C,e[15]=(a*f*s-d*o*s+d*i*c-t*f*c-a*i*p+t*o*p)*C,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,h=r*a,d=r*o;return this.set(h*a+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*a,0,h*c-s*o,d*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,d=a+a,f=o+o,p=r*h,m=r*d,x=r*f,M=a*d,g=a*f,u=o*f,_=c*h,v=c*d,y=c*f,E=i.x,T=i.y,C=i.z;return s[0]=(1-(M+u))*E,s[1]=(m+y)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(m-y)*T,s[5]=(1-(p+u))*T,s[6]=(g+_)*T,s[7]=0,s[8]=(x+v)*C,s[9]=(g-_)*C,s[10]=(1-(p+M))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=zs.set(s[0],s[1],s[2]).length();const a=zs.set(s[4],s[5],s[6]).length(),o=zs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],$n.copy(this);const h=1/r,d=1/a,f=1/o;return $n.elements[0]*=h,$n.elements[1]*=h,$n.elements[2]*=h,$n.elements[4]*=d,$n.elements[5]*=d,$n.elements[6]*=d,$n.elements[8]*=f,$n.elements[9]*=f,$n.elements[10]*=f,t.setFromRotationMatrix($n),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=hi,c=!1){const h=this.elements,d=2*r/(t-e),f=2*r/(i-s),p=(t+e)/(t-e),m=(i+s)/(i-s);let x,M;if(c)x=r/(a-r),M=a*r/(a-r);else if(o===hi)x=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===so)x=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=p,h[12]=0,h[1]=0,h[5]=f,h[9]=m,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=hi,c=!1){const h=this.elements,d=2/(t-e),f=2/(i-s),p=-(t+e)/(t-e),m=-(i+s)/(i-s);let x,M;if(c)x=1/(a-r),M=a/(a-r);else if(o===hi)x=-2/(a-r),M=-(a+r)/(a-r);else if(o===so)x=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=p,h[1]=0,h[5]=f,h[9]=0,h[13]=m,h[2]=0,h[6]=0,h[10]=x,h[14]=M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const zs=new P,$n=new At,w0=new P(0,0,0),T0=new P(1,1,1),Oi=new P,Sa=new P,Rn=new P,Sh=new At,bh=new Ii;class ii{constructor(e=0,t=0,i=0,s=ii.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],d=s[9],f=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(yt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-yt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:ft("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Sh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bh.setFromEuler(this),this.setFromQuaternion(bh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ii.DEFAULT_ORDER="XYZ";class Hc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let E0=0;const wh=new P,Os=new Ii,yi=new At,ba=new P,br=new P,A0=new P,C0=new Ii,Th=new P(1,0,0),Eh=new P(0,1,0),Ah=new P(0,0,1),Ch={type:"added"},R0={type:"removed"},Bs={type:"childadded",child:null},Go={type:"childremoved",child:null};class Vt extends fr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vt.DEFAULT_UP.clone();const e=new P,t=new ii,i=new Ii,s=new P(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new At},normalMatrix:{value:new _t}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=Vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Hc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Os.setFromAxisAngle(e,t),this.quaternion.multiply(Os),this}rotateOnWorldAxis(e,t){return Os.setFromAxisAngle(e,t),this.quaternion.premultiply(Os),this}rotateX(e){return this.rotateOnAxis(Th,e)}rotateY(e){return this.rotateOnAxis(Eh,e)}rotateZ(e){return this.rotateOnAxis(Ah,e)}translateOnAxis(e,t){return wh.copy(e).applyQuaternion(this.quaternion),this.position.add(wh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Th,e)}translateY(e){return this.translateOnAxis(Eh,e)}translateZ(e){return this.translateOnAxis(Ah,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ba.copy(e):ba.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yi.lookAt(br,ba,this.up):yi.lookAt(ba,br,this.up),this.quaternion.setFromRotationMatrix(yi),s&&(yi.extractRotation(s.matrixWorld),Os.setFromRotationMatrix(yi),this.quaternion.premultiply(Os.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(jt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ch),Bs.child=e,this.dispatchEvent(Bs),Bs.child=null):jt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(R0),Go.child=e,this.dispatchEvent(Go),Go.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ch),Bs.child=e,this.dispatchEvent(Bs),Bs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,e,A0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,C0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const f=c[h];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),h=a(e.textures),d=a(e.images),f=a(e.shapes),p=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Vt.DEFAULT_UP=new P(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Zn=new P,Si=new P,Ho=new P,bi=new P,ks=new P,Vs=new P,Rh=new P,Wo=new P,Xo=new P,qo=new P,Yo=new Gt,$o=new Gt,Zo=new Gt;class Hn{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Zn.subVectors(e,t),s.cross(Zn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Zn.subVectors(s,t),Si.subVectors(i,t),Ho.subVectors(e,t);const a=Zn.dot(Zn),o=Zn.dot(Si),c=Zn.dot(Ho),h=Si.dot(Si),d=Si.dot(Ho),f=a*h-o*o;if(f===0)return r.set(0,0,0),null;const p=1/f,m=(h*c-o*d)*p,x=(a*d-o*c)*p;return r.set(1-m-x,x,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,bi)===null?!1:bi.x>=0&&bi.y>=0&&bi.x+bi.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,bi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,bi.x),c.addScaledVector(a,bi.y),c.addScaledVector(o,bi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return Yo.setScalar(0),$o.setScalar(0),Zo.setScalar(0),Yo.fromBufferAttribute(e,t),$o.fromBufferAttribute(e,i),Zo.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Yo,r.x),a.addScaledVector($o,r.y),a.addScaledVector(Zo,r.z),a}static isFrontFacing(e,t,i,s){return Zn.subVectors(i,t),Si.subVectors(e,t),Zn.cross(Si).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zn.subVectors(this.c,this.b),Si.subVectors(this.a,this.b),Zn.cross(Si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Hn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;ks.subVectors(s,i),Vs.subVectors(r,i),Wo.subVectors(e,i);const c=ks.dot(Wo),h=Vs.dot(Wo);if(c<=0&&h<=0)return t.copy(i);Xo.subVectors(e,s);const d=ks.dot(Xo),f=Vs.dot(Xo);if(d>=0&&f<=d)return t.copy(s);const p=c*f-d*h;if(p<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(i).addScaledVector(ks,a);qo.subVectors(e,r);const m=ks.dot(qo),x=Vs.dot(qo);if(x>=0&&m<=x)return t.copy(r);const M=m*h-c*x;if(M<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(Vs,o);const g=d*x-m*f;if(g<=0&&f-d>=0&&m-x>=0)return Rh.subVectors(r,s),o=(f-d)/(f-d+(m-x)),t.copy(s).addScaledVector(Rh,o);const u=1/(g+M+p);return a=M*u,o=p*u,t.copy(i).addScaledVector(ks,a).addScaledVector(Vs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ru={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},wa={h:0,s:0,l:0};function Ko(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Rt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Rt.workingColorSpace){if(e=kc(e,1),t=yt(t,0,1),i=yt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Ko(a,r,e+1/3),this.g=Ko(a,r,e),this.b=Ko(a,r,e-1/3)}return Rt.colorSpaceToWorking(this,s),this}setStyle(e,t=Et){function i(r){r!==void 0&&parseFloat(r)<1&&ft("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ft("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ft("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const i=ru[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ft("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}copyLinearToSRGB(e){return this.r=tr(e.r),this.g=tr(e.g),this.b=tr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return Rt.workingToColorSpace(xn.copy(this),e),Math.round(yt(xn.r*255,0,255))*65536+Math.round(yt(xn.g*255,0,255))*256+Math.round(yt(xn.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rt.workingColorSpace){Rt.workingToColorSpace(xn.copy(this),t);const i=xn.r,s=xn.g,r=xn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,h;const d=(o+a)/2;if(o===a)c=0,h=0;else{const f=a-o;switch(h=d<=.5?f/(a+o):f/(2-a-o),a){case i:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-i)/f+2;break;case r:c=(i-s)/f+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=Rt.workingColorSpace){return Rt.workingToColorSpace(xn.copy(this),t),e.r=xn.r,e.g=xn.g,e.b=xn.b,e}getStyle(e=Et){Rt.workingToColorSpace(xn.copy(this),e);const t=xn.r,i=xn.g,s=xn.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Bi),this.setHSL(Bi.h+e,Bi.s+t,Bi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Bi),e.getHSL(wa);const i=Or(Bi.h,wa.h,t),s=Or(Bi.s,wa.s,t),r=Or(Bi.l,wa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xn=new rt;rt.NAMES=ru;let P0=0;class es extends fr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:P0++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=er,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sl,this.blendDst=bl,this.blendEquation=us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ds,this.stencilZFail=Ds,this.stencilZPass=Ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){ft(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ft(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==er&&(i.blending=this.blending),this.side!==Qi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Sl&&(i.blendSrc=this.blendSrc),this.blendDst!==bl&&(i.blendDst=this.blendDst),this.blendEquation!==us&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ar&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ds&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ds&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ds&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Tt extends es{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=Rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const nn=new P,Ta=new Pe;let L0=0;class Nn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:L0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=lc,this.updateRanges=[],this.gpuType=ci,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ta.fromBufferAttribute(this,t),Ta.applyMatrix3(e),this.setXY(t,Ta.x,Ta.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix3(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=jn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=kt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jn(t,this.array)),t}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jn(t,this.array)),t}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jn(t,this.array)),t}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array),s=kt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array),s=kt(s,this.array),r=kt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lc&&(e.usage=this.usage),e}}class au extends Nn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class ou extends Nn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class St extends Nn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let D0=0;const Vn=new At,Jo=new Vt,Gs=new P,Pn=new Rs,wr=new Rs,dn=new P;class Xt extends fr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:D0++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(iu(e)?ou:au)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new _t().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Vn.makeRotationFromQuaternion(e),this.applyMatrix4(Vn),this}rotateX(e){return Vn.makeRotationX(e),this.applyMatrix4(Vn),this}rotateY(e){return Vn.makeRotationY(e),this.applyMatrix4(Vn),this}rotateZ(e){return Vn.makeRotationZ(e),this.applyMatrix4(Vn),this}translate(e,t,i){return Vn.makeTranslation(e,t,i),this.applyMatrix4(Vn),this}scale(e,t,i){return Vn.makeScale(e,t,i),this.applyMatrix4(Vn),this}lookAt(e){return Jo.lookAt(e),Jo.updateMatrix(),this.applyMatrix4(Jo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gs).negate(),this.translate(Gs.x,Gs.y,Gs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new St(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ft("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Pn.setFromBufferAttribute(r),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,Pn.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,Pn.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(Pn.min),this.boundingBox.expandByPoint(Pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Pn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];wr.setFromBufferAttribute(o),this.morphTargetsRelative?(dn.addVectors(Pn.min,wr.min),Pn.expandByPoint(dn),dn.addVectors(Pn.max,wr.max),Pn.expandByPoint(dn)):(Pn.expandByPoint(wr.min),Pn.expandByPoint(wr.max))}Pn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)dn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(dn));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)dn.fromBufferAttribute(o,h),c&&(Gs.fromBufferAttribute(e,h),dn.add(Gs)),s=Math.max(s,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<i.count;R++)o[R]=new P,c[R]=new P;const h=new P,d=new P,f=new P,p=new Pe,m=new Pe,x=new Pe,M=new P,g=new P;function u(R,w,S){h.fromBufferAttribute(i,R),d.fromBufferAttribute(i,w),f.fromBufferAttribute(i,S),p.fromBufferAttribute(r,R),m.fromBufferAttribute(r,w),x.fromBufferAttribute(r,S),d.sub(h),f.sub(h),m.sub(p),x.sub(p);const L=1/(m.x*x.y-x.x*m.y);isFinite(L)&&(M.copy(d).multiplyScalar(x.y).addScaledVector(f,-m.y).multiplyScalar(L),g.copy(f).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(L),o[R].add(M),o[w].add(M),o[S].add(M),c[R].add(g),c[w].add(g),c[S].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let R=0,w=_.length;R<w;++R){const S=_[R],L=S.start,F=S.count;for(let W=L,Q=L+F;W<Q;W+=3)u(e.getX(W+0),e.getX(W+1),e.getX(W+2))}const v=new P,y=new P,E=new P,T=new P;function C(R){E.fromBufferAttribute(s,R),T.copy(E);const w=o[R];v.copy(w),v.sub(E.multiplyScalar(E.dot(w))).normalize(),y.crossVectors(T,w);const L=y.dot(c[R])<0?-1:1;a.setXYZW(R,v.x,v.y,v.z,L)}for(let R=0,w=_.length;R<w;++R){const S=_[R],L=S.start,F=S.count;for(let W=L,Q=L+F;W<Q;W+=3)C(e.getX(W+0)),C(e.getX(W+1)),C(e.getX(W+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Nn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const s=new P,r=new P,a=new P,o=new P,c=new P,h=new P,d=new P,f=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),M=e.getX(p+1),g=e.getX(p+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,g),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,M),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),i.setXYZ(p+0,d.x,d.y,d.z),i.setXYZ(p+1,d.x,d.y,d.z),i.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)dn.fromBufferAttribute(e,t),dn.normalize(),e.setXYZ(t,dn.x,dn.y,dn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,f=o.normalized,p=new h.constructor(c.length*d);let m=0,x=0;for(let M=0,g=c.length;M<g;M++){o.isInterleavedBufferAttribute?m=c[M]*o.data.stride+o.offset:m=c[M]*d;for(let u=0;u<d;u++)p[x++]=h[m++]}return new Nn(p,d,f)}if(this.index===null)return ft("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Xt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const c=[],h=r[o];for(let d=0,f=h.length;d<f;d++){const p=h[d],m=e(p,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let f=0,p=h.length;f<p;f++){const m=h[f];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const r=e.morphAttributes;for(const h in r){const d=[],f=r[h];for(let p=0,m=f.length;p<m;p++)d.push(f[p].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,d=a.length;h<d;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ph=new At,ss=new Gc,Ea=new pr,Lh=new P,Aa=new P,Ca=new P,Ra=new P,jo=new P,Pa=new P,Dh=new P,La=new P;class O extends Vt{constructor(e=new Xt,t=new Tt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Pa.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const d=o[c],f=r[c];d!==0&&(jo.fromBufferAttribute(f,e),a?Pa.addScaledVector(jo,d):Pa.addScaledVector(jo.sub(t),d))}t.add(Pa)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ea.copy(i.boundingSphere),Ea.applyMatrix4(r),ss.copy(e.ray).recast(e.near),!(Ea.containsPoint(ss.origin)===!1&&(ss.intersectSphere(Ea,Lh)===null||ss.origin.distanceToSquared(Lh)>(e.far-e.near)**2))&&(Ph.copy(r).invert(),ss.copy(e.ray).applyMatrix4(Ph),!(i.boundingBox!==null&&ss.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ss)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,p=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,M=p.length;x<M;x++){const g=p[x],u=a[g.materialIndex],_=Math.max(g.start,m.start),v=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let y=_,E=v;y<E;y+=3){const T=o.getX(y),C=o.getX(y+1),R=o.getX(y+2);s=Da(this,u,e,i,h,d,f,T,C,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let g=x,u=M;g<u;g+=3){const _=o.getX(g),v=o.getX(g+1),y=o.getX(g+2);s=Da(this,a,e,i,h,d,f,_,v,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,M=p.length;x<M;x++){const g=p[x],u=a[g.materialIndex],_=Math.max(g.start,m.start),v=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let y=_,E=v;y<E;y+=3){const T=y,C=y+1,R=y+2;s=Da(this,u,e,i,h,d,f,T,C,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let g=x,u=M;g<u;g+=3){const _=g,v=g+1,y=g+2;s=Da(this,a,e,i,h,d,f,_,v,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function I0(n,e,t,i,s,r,a,o){let c;if(e.side===vn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===Qi,o),c===null)return null;La.copy(o),La.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(La);return h<t.near||h>t.far?null:{distance:h,point:La.clone(),object:n}}function Da(n,e,t,i,s,r,a,o,c,h){n.getVertexPosition(o,Aa),n.getVertexPosition(c,Ca),n.getVertexPosition(h,Ra);const d=I0(n,e,t,i,Aa,Ca,Ra,Dh);if(d){const f=new P;Hn.getBarycoord(Dh,Aa,Ca,Ra,f),s&&(d.uv=Hn.getInterpolatedAttribute(s,o,c,h,f,new Pe)),r&&(d.uv1=Hn.getInterpolatedAttribute(r,o,c,h,f,new Pe)),a&&(d.normal=Hn.getInterpolatedAttribute(a,o,c,h,f,new P),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new P,materialIndex:0};Hn.getNormal(Aa,Ca,Ra,p.normal),d.face=p,d.barycoord=f}return d}class _e extends Xt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],d=[],f=[];let p=0,m=0;x("z","y","x",-1,-1,i,t,e,a,r,0),x("z","y","x",1,-1,i,t,-e,a,r,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new St(h,3)),this.setAttribute("normal",new St(d,3)),this.setAttribute("uv",new St(f,2));function x(M,g,u,_,v,y,E,T,C,R,w){const S=y/C,L=E/R,F=y/2,W=E/2,Q=T/2,te=C+1,q=R+1;let Z=0,ne=0;const de=new P;for(let me=0;me<q;me++){const Ge=me*L-W;for(let I=0;I<te;I++){const Ae=I*S-F;de[M]=Ae*_,de[g]=Ge*v,de[u]=Q,h.push(de.x,de.y,de.z),de[M]=0,de[g]=0,de[u]=T>0?1:-1,d.push(de.x,de.y,de.z),f.push(I/C),f.push(1-me/R),Z+=1}}for(let me=0;me<R;me++)for(let Ge=0;Ge<C;Ge++){const I=p+Ge+te*me,Ae=p+Ge+te*(me+1),ye=p+(Ge+1)+te*(me+1),Ce=p+(Ge+1)+te*me;c.push(I,Ae,Ce),c.push(Ae,ye,Ce),ne+=6}o.addGroup(m,ne,w),m+=ne,p+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _e(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function hr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(ft("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function wn(n){const e={};for(let t=0;t<n.length;t++){const i=hr(n[t]);for(const s in i)e[s]=i[s]}return e}function U0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function lu(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Rt.workingColorSpace}const ta={clone:hr,merge:wn};var F0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,N0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class fn extends es{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=F0,this.fragmentShader=N0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hr(e.uniforms),this.uniformsGroups=U0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class cu extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ki=new P,Ih=new Pe,Uh=new Pe;class Dn extends cu{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ea*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ea*2*Math.atan(Math.tan(zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,t){return this.getViewBounds(e,Ih,Uh),t.subVectors(Uh,Ih)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(zr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/h,s*=a.width/c,i*=a.height/h}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Hs=-90,Ws=1;class z0 extends Vt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Dn(Hs,Ws,e,t);s.layers=this.layers,this.add(s);const r=new Dn(Hs,Ws,e,t);r.layers=this.layers,this.add(r);const a=new Dn(Hs,Ws,e,t);a.layers=this.layers,this.add(a);const o=new Dn(Hs,Ws,e,t);o.layers=this.layers,this.add(o);const c=new Dn(Hs,Ws,e,t);c.layers=this.layers,this.add(c);const h=new Dn(Hs,Ws,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(const h of t)this.remove(h);if(e===hi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===so)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,h,d]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(f,p,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class hu extends _n{constructor(e=[],t=or,i,s,r,a,o,c,h,d){super(e,t,i,s,r,a,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class O0 extends ni{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new hu(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new _e(5,5,5),r=new fn({name:"CubemapFromEquirect",uniforms:hr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:vn,blending:ui});r.uniforms.tEquirect.value=t;const a=new O(s,r),o=t.minFilter;return t.minFilter===ps&&(t.minFilter=Wn),new z0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class it extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const B0={type:"move"};class Qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new it,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new it,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new it,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const M of e.hand.values()){const g=t.getJointPose(M,i),u=this._getHandJoint(h,M);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const d=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],p=d.position.distanceTo(f.position),m=.02,x=.005;h.inputState.pinching&&p>m+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(B0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new it;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Wc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new rt(e),this.near=t,this.far=i}clone(){return new Wc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class du extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ii,this.environmentIntensity=1,this.environmentRotation=new ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class k0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=lc,this.updateRanges=[],this.version=0,this.uuid=pi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const bn=new P;class oo{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)bn.fromBufferAttribute(this,t),bn.applyMatrix4(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bn.fromBufferAttribute(this,t),bn.applyNormalMatrix(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bn.fromBufferAttribute(this,t),bn.transformDirection(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=jn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=kt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=jn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=jn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=jn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=jn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array),s=kt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array),s=kt(s,this.array),r=kt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ao("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new oo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ao("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Xc extends es{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Xs;const Tr=new P,qs=new P,Ys=new P,$s=new Pe,Er=new Pe,uu=new At,Ia=new P,Ar=new P,Ua=new P,Fh=new Pe,el=new Pe,Nh=new Pe;class cc extends Vt{constructor(e=new Xc){if(super(),this.isSprite=!0,this.type="Sprite",Xs===void 0){Xs=new Xt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new k0(t,5);Xs.setIndex([0,1,2,0,2,3]),Xs.setAttribute("position",new oo(i,3,0,!1)),Xs.setAttribute("uv",new oo(i,2,3,!1))}this.geometry=Xs,this.material=e,this.center=new Pe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&jt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qs.setFromMatrixScale(this.matrixWorld),uu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ys.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qs.multiplyScalar(-Ys.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Fa(Ia.set(-.5,-.5,0),Ys,a,qs,s,r),Fa(Ar.set(.5,-.5,0),Ys,a,qs,s,r),Fa(Ua.set(.5,.5,0),Ys,a,qs,s,r),Fh.set(0,0),el.set(1,0),Nh.set(1,1);let o=e.ray.intersectTriangle(Ia,Ar,Ua,!1,Tr);if(o===null&&(Fa(Ar.set(-.5,.5,0),Ys,a,qs,s,r),el.set(0,1),o=e.ray.intersectTriangle(Ia,Ua,Ar,!1,Tr),o===null))return;const c=e.ray.origin.distanceTo(Tr);c<e.near||c>e.far||t.push({distance:c,point:Tr.clone(),uv:Hn.getInterpolation(Tr,Ia,Ar,Ua,Fh,el,Nh,new Pe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Fa(n,e,t,i,s,r){$s.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(Er.x=r*$s.x-s*$s.y,Er.y=s*$s.x+r*$s.y):Er.copy($s),n.copy(e),n.x+=Er.x,n.y+=Er.y,n.applyMatrix4(uu)}class fu extends _n{constructor(e=null,t=1,i=1,s,r,a,o,c,h=Fn,d=Fn,f,p){super(null,a,o,c,h,d,s,r,f,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zh extends Nn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Zs=new At,Oh=new At,Na=[],Bh=new Rs,V0=new At,Cr=new O,Rr=new pr;class tn extends O{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new zh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,V0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Rs),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Zs),Bh.copy(e.boundingBox).applyMatrix4(Zs),this.boundingBox.union(Bh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new pr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Zs),Rr.copy(e.boundingSphere).applyMatrix4(Zs),this.boundingSphere.union(Rr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Cr.geometry=this.geometry,Cr.material=this.material,Cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Rr.copy(this.boundingSphere),Rr.applyMatrix4(i),e.ray.intersectsSphere(Rr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Zs),Oh.multiplyMatrices(i,Zs),Cr.matrixWorld=Oh,Cr.raycast(e,Na);for(let a=0,o=Na.length;a<o;a++){const c=Na[a];c.instanceId=r,c.object=this,t.push(c)}Na.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new zh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new fu(new Float32Array(s*this.count),s,this.count,Uc,ci));const r=this.morphTexture.source.data.data;let a=0;for(let h=0;h<i.length;h++)a+=i[h];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const tl=new P,G0=new P,H0=new _t;class cs{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=tl.subVectors(i,t).cross(G0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(tl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||H0.getNormalMatrix(e),s=this.coplanarPoint(tl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const rs=new pr,W0=new Pe(.5,.5),za=new P;class qc{constructor(e=new cs,t=new cs,i=new cs,s=new cs,r=new cs,a=new cs){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=hi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],h=r[3],d=r[4],f=r[5],p=r[6],m=r[7],x=r[8],M=r[9],g=r[10],u=r[11],_=r[12],v=r[13],y=r[14],E=r[15];if(s[0].setComponents(h-a,m-d,u-x,E-_).normalize(),s[1].setComponents(h+a,m+d,u+x,E+_).normalize(),s[2].setComponents(h+o,m+f,u+M,E+v).normalize(),s[3].setComponents(h-o,m-f,u-M,E-v).normalize(),i)s[4].setComponents(c,p,g,y).normalize(),s[5].setComponents(h-c,m-p,u-g,E-y).normalize();else if(s[4].setComponents(h-c,m-p,u-g,E-y).normalize(),t===hi)s[5].setComponents(h+c,m+p,u+g,E+y).normalize();else if(t===so)s[5].setComponents(c,p,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),rs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),rs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(rs)}intersectsSprite(e){rs.center.set(0,0,0);const t=W0.distanceTo(e.center);return rs.radius=.7071067811865476+t,rs.applyMatrix4(e.matrixWorld),this.intersectsSphere(rs)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(za.x=s.normal.x>0?e.max.x:e.min.x,za.y=s.normal.y>0?e.max.y:e.min.y,za.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(za)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class hc extends es{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const lo=new P,co=new P,kh=new At,Pr=new Gc,Oa=new pr,nl=new P,Vh=new P;class Gh extends Vt{constructor(e=new Xt,t=new hc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)lo.fromBufferAttribute(t,s-1),co.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=lo.distanceTo(co);e.setAttribute("lineDistance",new St(i,1))}else ft("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Oa.copy(i.boundingSphere),Oa.applyMatrix4(s),Oa.radius+=r,e.ray.intersectsSphere(Oa)===!1)return;kh.copy(s).invert(),Pr.copy(e.ray).applyMatrix4(kh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,p=i.attributes.position;if(d!==null){const m=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let M=m,g=x-1;M<g;M+=h){const u=d.getX(M),_=d.getX(M+1),v=Ba(this,e,Pr,c,u,_,M);v&&t.push(v)}if(this.isLineLoop){const M=d.getX(x-1),g=d.getX(m),u=Ba(this,e,Pr,c,M,g,x-1);u&&t.push(u)}}else{const m=Math.max(0,a.start),x=Math.min(p.count,a.start+a.count);for(let M=m,g=x-1;M<g;M+=h){const u=Ba(this,e,Pr,c,M,M+1,M);u&&t.push(u)}if(this.isLineLoop){const M=Ba(this,e,Pr,c,x-1,m,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ba(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(lo.fromBufferAttribute(o,s),co.fromBufferAttribute(o,r),t.distanceSqToSegment(lo,co,nl,Vh)>i)return;nl.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(nl);if(!(h<e.near||h>e.far))return{distance:h,point:Vh.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}class en extends _n{constructor(e,t,i,s,r,a,o,c,h){super(e,t,i,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class pu extends _n{constructor(e,t,i=ys,s,r,a,o=Fn,c=Fn,h,d=Jr,f=1){if(d!==Jr&&d!==jr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:f};super(p,s,r,a,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Vc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class mu extends _n{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class on extends Xt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],h=new P,d=new Pe;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,p=3;f<=t;f++,p+=3){const m=i+f/t*s;h.x=e*Math.cos(m),h.y=e*Math.sin(m),a.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(a[p]/e+1)/2,d.y=(a[p+1]/e+1)/2,c.push(d.x,d.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new St(a,3)),this.setAttribute("normal",new St(o,3)),this.setAttribute("uv",new St(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new on(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Je extends Xt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const d=[],f=[],p=[],m=[];let x=0;const M=[],g=i/2;let u=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new St(f,3)),this.setAttribute("normal",new St(p,3)),this.setAttribute("uv",new St(m,2));function _(){const y=new P,E=new P;let T=0;const C=(t-e)/i;for(let R=0;R<=r;R++){const w=[],S=R/r,L=S*(t-e)+e;for(let F=0;F<=s;F++){const W=F/s,Q=W*c+o,te=Math.sin(Q),q=Math.cos(Q);E.x=L*te,E.y=-S*i+g,E.z=L*q,f.push(E.x,E.y,E.z),y.set(te,C,q).normalize(),p.push(y.x,y.y,y.z),m.push(W,1-S),w.push(x++)}M.push(w)}for(let R=0;R<s;R++)for(let w=0;w<r;w++){const S=M[w][R],L=M[w+1][R],F=M[w+1][R+1],W=M[w][R+1];(e>0||w!==0)&&(d.push(S,L,W),T+=3),(t>0||w!==r-1)&&(d.push(L,F,W),T+=3)}h.addGroup(u,T,0),u+=T}function v(y){const E=x,T=new Pe,C=new P;let R=0;const w=y===!0?e:t,S=y===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,g*S,0),p.push(0,S,0),m.push(.5,.5),x++;const L=x;for(let F=0;F<=s;F++){const Q=F/s*c+o,te=Math.cos(Q),q=Math.sin(Q);C.x=w*q,C.y=g*S,C.z=w*te,f.push(C.x,C.y,C.z),p.push(0,S,0),T.x=te*.5+.5,T.y=q*.5*S+.5,m.push(T.x,T.y),x++}for(let F=0;F<s;F++){const W=E+F,Q=L+F;y===!0?d.push(Q,Q+1,W):d.push(Q+1,Q,W),R+=3}h.addGroup(u,R,y===!0?1:2),u+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Je(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ai extends Je{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Ai(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _o extends Xt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),h(i),d(),this.setAttribute("position",new St(r,3)),this.setAttribute("normal",new St(r.slice(),3)),this.setAttribute("uv",new St(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const v=new P,y=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],y),m(t[T+2],E),c(v,y,E,_)}function c(_,v,y,E){const T=E+1,C=[];for(let R=0;R<=T;R++){C[R]=[];const w=_.clone().lerp(y,R/T),S=v.clone().lerp(y,R/T),L=T-R;for(let F=0;F<=L;F++)F===0&&R===T?C[R][F]=w:C[R][F]=w.clone().lerp(S,F/L)}for(let R=0;R<T;R++)for(let w=0;w<2*(T-R)-1;w++){const S=Math.floor(w/2);w%2===0?(p(C[R][S+1]),p(C[R+1][S]),p(C[R][S])):(p(C[R][S+1]),p(C[R+1][S+1]),p(C[R+1][S]))}}function h(_){const v=new P;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(_),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function d(){const _=new P;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const y=g(_)/2/Math.PI+.5,E=u(_)/Math.PI+.5;a.push(y,1-E)}x(),f()}function f(){for(let _=0;_<a.length;_+=6){const v=a[_+0],y=a[_+2],E=a[_+4],T=Math.max(v,y,E),C=Math.min(v,y,E);T>.9&&C<.1&&(v<.2&&(a[_+0]+=1),y<.2&&(a[_+2]+=1),E<.2&&(a[_+4]+=1))}}function p(_){r.push(_.x,_.y,_.z)}function m(_,v){const y=_*3;v.x=e[y+0],v.y=e[y+1],v.z=e[y+2]}function x(){const _=new P,v=new P,y=new P,E=new P,T=new Pe,C=new Pe,R=new Pe;for(let w=0,S=0;w<r.length;w+=9,S+=6){_.set(r[w+0],r[w+1],r[w+2]),v.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),T.set(a[S+0],a[S+1]),C.set(a[S+2],a[S+3]),R.set(a[S+4],a[S+5]),E.copy(_).add(v).add(y).divideScalar(3);const L=g(E);M(T,S+0,_,L),M(C,S+2,v,L),M(R,S+4,y,L)}}function M(_,v,y,E){E<0&&_.x===1&&(a[v]=_.x-1),y.x===0&&y.z===0&&(a[v]=E/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function u(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _o(e.vertices,e.indices,e.radius,e.details)}}class Yc extends _o{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Yc(e.radius,e.detail)}}class gi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ft("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const d=i[s],p=i[s+1]-d,m=(a-d)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Pe:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,s=[],r=[],a=[],o=new P,c=new At;for(let m=0;m<=e;m++){const x=m/e;s[m]=this.getTangentAt(x,new P)}r[0]=new P,a[0]=new P;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),f<=h&&(h=f,i.set(0,1,0)),p<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(yt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(o,x))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(yt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let x=1;x<=e;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],m*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class $c extends gi{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Pe){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=c-this.aX,m=h-this.aY;c=p*d-m*f+this.aX,h=p*f+m*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class X0 extends $c{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Zc(){let n=0,e=0,t=0,i=0;function s(r,a,o,c){n=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,d,f){let p=(a-r)/h-(o-r)/(h+d)+(o-a)/d,m=(o-a)/d-(c-a)/(d+f)+(c-o)/f;p*=d,m*=d,s(a,o,p,m)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const ka=new P,il=new Zc,sl=new Zc,rl=new Zc;class q0 extends gi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new P){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%r]:(ka.subVectors(s[0],s[1]).add(s[0]),h=ka);const f=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(ka.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=ka),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(f),m),M=Math.pow(f.distanceToSquared(p),m),g=Math.pow(p.distanceToSquared(d),m);M<1e-4&&(M=1),x<1e-4&&(x=M),g<1e-4&&(g=M),il.initNonuniformCatmullRom(h.x,f.x,p.x,d.x,x,M,g),sl.initNonuniformCatmullRom(h.y,f.y,p.y,d.y,x,M,g),rl.initNonuniformCatmullRom(h.z,f.z,p.z,d.z,x,M,g)}else this.curveType==="catmullrom"&&(il.initCatmullRom(h.x,f.x,p.x,d.x,this.tension),sl.initCatmullRom(h.y,f.y,p.y,d.y,this.tension),rl.initCatmullRom(h.z,f.z,p.z,d.z,this.tension));return i.set(il.calc(c),sl.calc(c),rl.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Hh(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+r+a)*c+(-3*t+3*i-2*r-a)*o+r*n+t}function Y0(n,e){const t=1-n;return t*t*e}function $0(n,e){return 2*(1-n)*n*e}function Z0(n,e){return n*n*e}function Br(n,e,t,i){return Y0(n,e)+$0(n,t)+Z0(n,i)}function K0(n,e){const t=1-n;return t*t*t*e}function J0(n,e){const t=1-n;return 3*t*t*n*e}function j0(n,e){return 3*(1-n)*n*n*e}function Q0(n,e){return n*n*n*e}function kr(n,e,t,i,s){return K0(n,e)+J0(n,t)+j0(n,i)+Q0(n,s)}class xu extends gi{constructor(e=new Pe,t=new Pe,i=new Pe,s=new Pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Pe){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(kr(e,s.x,r.x,a.x,o.x),kr(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ep extends gi{constructor(e=new P,t=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new P){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(kr(e,s.x,r.x,a.x,o.x),kr(e,s.y,r.y,a.y,o.y),kr(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class gu extends gi{constructor(e=new Pe,t=new Pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Pe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class tp extends gi{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class vu extends gi{constructor(e=new Pe,t=new Pe,i=new Pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Pe){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Br(e,s.x,r.x,a.x),Br(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class np extends gi{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Br(e,s.x,r.x,a.x),Br(e,s.y,r.y,a.y),Br(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _u extends gi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Pe){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],d=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return i.set(Hh(o,c.x,h.x,d.x,f.x),Hh(o,c.y,h.y,d.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Pe().fromArray(s))}return this}}var Wh=Object.freeze({__proto__:null,ArcCurve:X0,CatmullRomCurve3:q0,CubicBezierCurve:xu,CubicBezierCurve3:ep,EllipseCurve:$c,LineCurve:gu,LineCurve3:tp,QuadraticBezierCurve:vu,QuadraticBezierCurve3:np,SplineCurve:_u});class ip extends gi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Wh[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new Wh[s.type]().fromJSON(s))}return this}}class Xh extends ip{constructor(e){super(),this.type="Path",this.currentPoint=new Pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new gu(this.currentPoint.clone(),new Pe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new vu(this.currentPoint.clone(),new Pe(e,t),new Pe(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new xu(this.currentPoint.clone(),new Pe(e,t),new Pe(i,s),new Pe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new _u(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,r,a,o,c),this}absellipse(e,t,i,s,r,a,o,c){const h=new $c(e,t,i,s,r,a,o,c);if(this.curves.length>0){const f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Kc extends Xh{constructor(e){super(e),this.uuid=pi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Xh().fromJSON(s))}return this}}function sp(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=Mu(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,h;if(i&&(r=cp(n,e,r,t)),n.length>80*t){o=n[0],c=n[1];let d=o,f=c;for(let p=t;p<s;p+=t){const m=n[p],x=n[p+1];m<o&&(o=m),x<c&&(c=x),m>d&&(d=m),x>f&&(f=x)}h=Math.max(d-o,f-c),h=h!==0?32767/h:0}return na(r,a,t,o,c,h,0),a}function Mu(n,e,t,i,s){let r;if(s===Mp(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=qh(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=qh(a/i|0,n[a],n[a+1],r);return r&&dr(r,r.next)&&(sa(r),r=r.next),r}function Ss(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(dr(t,t.next)||Qt(t.prev,t,t.next)===0)){if(sa(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function na(n,e,t,i,s,r,a){if(!n)return;!a&&r&&pp(n,i,s,r);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(r?ap(n,i,s,r):rp(n)){e.push(c.i,n.i,h.i),sa(n),n=h.next,o=h.next;continue}if(n=h,n===o){a?a===1?(n=op(Ss(n),e),na(n,e,t,i,s,r,2)):a===2&&lp(n,e,t,i,s,r):na(Ss(n),e,t,i,s,r,1);break}}}function rp(n){const e=n.prev,t=n,i=n.next;if(Qt(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,r,a),f=Math.min(o,c,h),p=Math.max(s,r,a),m=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=p&&x.y>=f&&x.y<=m&&Ur(s,o,r,c,a,h,x.x,x.y)&&Qt(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function ap(n,e,t,i){const s=n.prev,r=n,a=n.next;if(Qt(s,r,a)>=0)return!1;const o=s.x,c=r.x,h=a.x,d=s.y,f=r.y,p=a.y,m=Math.min(o,c,h),x=Math.min(d,f,p),M=Math.max(o,c,h),g=Math.max(d,f,p),u=dc(m,x,e,t,i),_=dc(M,g,e,t,i);let v=n.prevZ,y=n.nextZ;for(;v&&v.z>=u&&y&&y.z<=_;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Ur(o,d,c,f,h,p,v.x,v.y)&&Qt(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=m&&y.x<=M&&y.y>=x&&y.y<=g&&y!==s&&y!==a&&Ur(o,d,c,f,h,p,y.x,y.y)&&Qt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=u;){if(v.x>=m&&v.x<=M&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Ur(o,d,c,f,h,p,v.x,v.y)&&Qt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=m&&y.x<=M&&y.y>=x&&y.y<=g&&y!==s&&y!==a&&Ur(o,d,c,f,h,p,y.x,y.y)&&Qt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function op(n,e){let t=n;do{const i=t.prev,s=t.next.next;!dr(i,s)&&Su(i,t,t.next,s)&&ia(i,s)&&ia(s,i)&&(e.push(i.i,t.i,s.i),sa(t),sa(t.next),t=n=s),t=t.next}while(t!==n);return Ss(t)}function lp(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&gp(a,o)){let c=bu(a,o);a=Ss(a,a.next),c=Ss(c,c.next),na(a,e,t,i,s,r,0),na(c,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function cp(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:n.length,h=Mu(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(xp(h))}s.sort(hp);for(let r=0;r<s.length;r++)t=dp(s[r],t);return t}function hp(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function dp(n,e){const t=up(n,e);if(!t)return e;const i=bu(t,n);return Ss(i,i.next),Ss(t,t.next)}function up(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(dr(n,t))return t;do{if(dr(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=i&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,h=a.y;let d=1/0;t=a;do{if(i>=t.x&&t.x>=c&&i!==t.x&&yu(s<h?i:r,s,c,h,s<h?r:i,s,t.x,t.y)){const f=Math.abs(s-t.y)/(i-t.x);ia(t,n)&&(f<d||f===d&&(t.x>a.x||t.x===a.x&&fp(a,t)))&&(a=t,d=f)}t=t.next}while(t!==o);return a}function fp(n,e){return Qt(n.prev,n,e.prev)<0&&Qt(e.next,n,n.next)<0}function pp(n,e,t,i){let s=n;do s.z===0&&(s.z=dc(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,mp(s)}function mp(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let h=0;h<t&&(o++,a=a.nextZ,!!a);h++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function dc(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function xp(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function yu(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function Ur(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&yu(n,e,t,i,s,r,a,o)}function gp(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!vp(n,e)&&(ia(n,e)&&ia(e,n)&&_p(n,e)&&(Qt(n.prev,n,e.prev)||Qt(n,e.prev,e))||dr(n,e)&&Qt(n.prev,n,n.next)>0&&Qt(e.prev,e,e.next)>0)}function Qt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function dr(n,e){return n.x===e.x&&n.y===e.y}function Su(n,e,t,i){const s=Ga(Qt(n,e,t)),r=Ga(Qt(n,e,i)),a=Ga(Qt(t,i,n)),o=Ga(Qt(t,i,e));return!!(s!==r&&a!==o||s===0&&Va(n,t,e)||r===0&&Va(n,i,e)||a===0&&Va(t,n,i)||o===0&&Va(t,e,i))}function Va(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ga(n){return n>0?1:n<0?-1:0}function vp(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Su(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function ia(n,e){return Qt(n.prev,n,n.next)<0?Qt(n,e,n.next)>=0&&Qt(n,n.prev,e)>=0:Qt(n,e,n.prev)<0||Qt(n,n.next,e)<0}function _p(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function bu(n,e){const t=uc(n.i,n.x,n.y),i=uc(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function qh(n,e,t,i){const s=uc(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function sa(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function uc(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mp(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class yp{static triangulate(e,t,i=2){return sp(e,t,i)}}class Vr{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Vr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Yh(e),$h(i,e);let a=e.length;t.forEach(Yh);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,$h(i,t[c]);const o=yp.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Yh(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function $h(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Jc extends _o{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Jc(e.radius,e.detail)}}class Wt extends Xt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,f=e/o,p=t/c,m=[],x=[],M=[],g=[];for(let u=0;u<d;u++){const _=u*p-a;for(let v=0;v<h;v++){const y=v*f-r;x.push(y,-_,0),M.push(0,0,1),g.push(v/o),g.push(1-u/c)}}for(let u=0;u<c;u++)for(let _=0;_<o;_++){const v=_+h*u,y=_+h*(u+1),E=_+1+h*(u+1),T=_+1+h*u;m.push(v,y,T),m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new St(x,3)),this.setAttribute("normal",new St(M,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Mo extends Xt{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let f=e;const p=(t-e)/s,m=new P,x=new Pe;for(let M=0;M<=s;M++){for(let g=0;g<=i;g++){const u=r+g/i*a;m.x=f*Math.cos(u),m.y=f*Math.sin(u),c.push(m.x,m.y,m.z),h.push(0,0,1),x.x=(m.x/t+1)/2,x.y=(m.y/t+1)/2,d.push(x.x,x.y)}f+=p}for(let M=0;M<s;M++){const g=M*(i+1);for(let u=0;u<i;u++){const _=u+g,v=_,y=_+i+1,E=_+i+2,T=_+1;o.push(v,y,T),o.push(y,E,T)}}this.setIndex(o),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(h,3)),this.setAttribute("uv",new St(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mo(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class yo extends Xt{constructor(e=new Kc([new Pe(0,.5),new Pe(-.5,-.5),new Pe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new St(s,3)),this.setAttribute("normal",new St(r,3)),this.setAttribute("uv",new St(a,2));function h(d){const f=s.length/3,p=d.extractPoints(t);let m=p.shape;const x=p.holes;Vr.isClockWise(m)===!1&&(m=m.reverse());for(let g=0,u=x.length;g<u;g++){const _=x[g];Vr.isClockWise(_)===!0&&(x[g]=_.reverse())}const M=Vr.triangulateShape(m,x);for(let g=0,u=x.length;g<u;g++){const _=x[g];m=m.concat(_)}for(let g=0,u=m.length;g<u;g++){const _=m[g];s.push(_.x,_.y,0),r.push(0,0,1),a.push(_.x,_.y)}for(let g=0,u=M.length;g<u;g++){const _=M[g],v=_[0]+f,y=_[1]+f,E=_[2]+f;i.push(v,y,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Sp(t,e)}static fromJSON(e,t){const i=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];i.push(a)}return new yo(i,e.curveSegments)}}function Sp(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Yt extends Xt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let h=0;const d=[],f=new P,p=new P,m=[],x=[],M=[],g=[];for(let u=0;u<=i;u++){const _=[],v=u/i;let y=0;u===0&&a===0?y=.5/t:u===i&&c===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),f.y=e*Math.cos(a+v*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),x.push(f.x,f.y,f.z),p.copy(f).normalize(),M.push(p.x,p.y,p.z),g.push(T+y,1-v),_.push(h++)}d.push(_)}for(let u=0;u<i;u++)for(let _=0;_<t;_++){const v=d[u][_+1],y=d[u][_],E=d[u+1][_],T=d[u+1][_+1];(u!==0||a>0)&&m.push(v,y,T),(u!==i-1||c<Math.PI)&&m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new St(x,3)),this.setAttribute("normal",new St(M,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class bs extends Xt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],c=[],h=[],d=new P,f=new P,p=new P;for(let m=0;m<=i;m++)for(let x=0;x<=s;x++){const M=x/s*r,g=m/i*Math.PI*2;f.x=(e+t*Math.cos(g))*Math.cos(M),f.y=(e+t*Math.cos(g))*Math.sin(M),f.z=t*Math.sin(g),o.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(f,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/s),h.push(m/i)}for(let m=1;m<=i;m++)for(let x=1;x<=s;x++){const M=(s+1)*m+x-1,g=(s+1)*(m-1)+x-1,u=(s+1)*(m-1)+x,_=(s+1)*m+x;a.push(M,g,_),a.push(g,u,_)}this.setIndex(a),this.setAttribute("position",new St(o,3)),this.setAttribute("normal",new St(c,3)),this.setAttribute("uv",new St(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class bp extends fn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class H extends es{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bc,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wp extends es{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bc,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=Rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Tp extends es{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ep extends es{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class jc extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ap extends jc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const al=new At,Zh=new P,Kh=new P;class wu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pe(512,512),this.mapType=xi,this.map=null,this.mapPass=null,this.matrix=new At,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qc,this._frameExtents=new Pe(1,1),this._viewportCount=1,this._viewports=[new Gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Zh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zh),Kh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Kh),t.updateMatrixWorld(),al.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(al,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(al)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Jh=new At,Lr=new P,ol=new P;class Cp extends wu{constructor(){super(new Dn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Pe(4,2),this._viewportCount=6,this._viewports=[new Gt(2,1,1,1),new Gt(0,1,1,1),new Gt(3,1,1,1),new Gt(1,1,1,1),new Gt(3,0,1,1),new Gt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Lr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Lr),ol.copy(i.position),ol.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(ol),i.updateMatrixWorld(),s.makeTranslation(-Lr.x,-Lr.y,-Lr.z),Jh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jh,i.coordinateSystem,i.reversedDepth)}}class Qc extends jc{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Cp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class eh extends cu{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Rp extends wu{constructor(){super(new eh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ll extends jc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new Rp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Pp extends Dn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Tu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const jh=new At;class Lp{constructor(e,t,i=0,s=1/0){this.ray=new Gc(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Hc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):jt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return jh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(jh),this}intersectObject(e,t=!0,i=[]){return fc(e,this,i,t),i.sort(Qh),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)fc(e[s],this,i,t);return i.sort(Qh),i}}function Qh(n,e){return n.distance-e.distance}function fc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)fc(r[a],e,t,!0)}}function ed(n,e,t,i){const s=Dp(i);switch(t){case eu:return n*e;case Uc:return n*e/s.components*s.byteLength;case Fc:return n*e/s.components*s.byteLength;case Nc:return n*e*2/s.components*s.byteLength;case zc:return n*e*2/s.components*s.byteLength;case tu:return n*e*3/s.components*s.byteLength;case ei:return n*e*4/s.components*s.byteLength;case Oc:return n*e*4/s.components*s.byteLength;case Ka:case Ja:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ja:case Qa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fl:case zl:return Math.max(n,16)*Math.max(e,8)/4;case Ul:case Nl:return Math.max(n,8)*Math.max(e,8)/2;case Ol:case Bl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case kl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Gl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ql:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case $l:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Zl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Kl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Jl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case jl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ql:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ec:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case tc:case nc:case ic:return Math.ceil(n/4)*Math.ceil(e/4)*16;case sc:case rc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ac:case oc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Dp(n){switch(n){case xi:case Kd:return{byteLength:1,components:1};case Zr:case Jd:case fi:return{byteLength:2,components:1};case Dc:case Ic:return{byteLength:2,components:4};case ys:case Lc:case ci:return{byteLength:4,components:1};case jd:case Qd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cc}}));typeof window<"u"&&(window.__THREE__?ft("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cc);function Eu(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Ip(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,f=h.byteLength,p=n.createBuffer();n.bindBuffer(c,p),n.bufferData(c,h,d),o.onUploadCallback();let m;if(h instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)m=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=n.SHORT;else if(h instanceof Uint32Array)m=n.UNSIGNED_INT;else if(h instanceof Int32Array)m=n.INT;else if(h instanceof Int8Array)m=n.BYTE;else if(h instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,h){const d=c.array,f=c.updateRanges;if(n.bindBuffer(h,o),f.length===0)n.bufferSubData(h,0,d);else{f.sort((m,x)=>m.start-x.start);let p=0;for(let m=1;m<f.length;m++){const x=f[p],M=f[m];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++p,f[p]=M)}f.length=p+1;for(let m=0,x=f.length;m<x;m++){const M=f[m];n.bufferSubData(h,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Up=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fp=`#ifdef USE_ALPHAHASH
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
#endif`,Np=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Op=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kp=`#ifdef USE_AOMAP
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
#endif`,Vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Gp=`#ifdef USE_BATCHING
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
#endif`,Hp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,qp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Yp=`#ifdef USE_IRIDESCENCE
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
#endif`,$p=`#ifdef USE_BUMPMAP
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
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Qp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,nm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,im=`#define PI 3.141592653589793
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
} // validated`,sm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rm=`vec3 transformedNormal = objectNormal;
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
#endif`,am=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,om=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hm="gl_FragColor = linearToOutputTexel( gl_FragColor );",dm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,um=`#ifdef USE_ENVMAP
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
#endif`,fm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,pm=`#ifdef USE_ENVMAP
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
#endif`,mm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xm=`#ifdef USE_ENVMAP
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
#endif`,gm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_m=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ym=`#ifdef USE_GRADIENTMAP
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
}`,Sm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tm=`uniform bool receiveShadow;
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
#endif`,Em=`#ifdef USE_ENVMAP
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
#endif`,Am=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lm=`PhysicalMaterial material;
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
#endif`,Dm=`uniform sampler2D dfgLUT;
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
}`,Im=`
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
#endif`,Um=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Om=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,km=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Hm=`#if defined( USE_POINTS_UV )
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
#endif`,Wm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ym=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$m=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zm=`#ifdef USE_MORPHTARGETS
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
#endif`,Km=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,jm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,nx=`#ifdef USE_NORMALMAP
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
#endif`,ix=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ax=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ox=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ux=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,px=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vx=`float getShadowMask() {
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
}`,_x=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Mx=`#ifdef USE_SKINNING
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
#endif`,yx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sx=`#ifdef USE_SKINNING
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
#endif`,bx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Tx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ex=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ax=`#ifdef USE_TRANSMISSION
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
#endif`,Cx=`#ifdef USE_TRANSMISSION
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
#endif`,Rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ix=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ux=`uniform sampler2D t2D;
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
}`,Fx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,zx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ox=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bx=`#include <common>
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
}`,kx=`#if DEPTH_PACKING == 3200
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
}`,Vx=`#define DISTANCE
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
}`,Gx=`#define DISTANCE
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
}`,Hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xx=`uniform float scale;
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
}`,qx=`uniform vec3 diffuse;
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
}`,Yx=`#include <common>
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
}`,$x=`uniform vec3 diffuse;
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
}`,Zx=`#define LAMBERT
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
}`,Kx=`#define LAMBERT
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
}`,Jx=`#define MATCAP
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
}`,jx=`#define MATCAP
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
}`,Qx=`#define NORMAL
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
}`,eg=`#define NORMAL
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
}`,tg=`#define PHONG
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
}`,ng=`#define PHONG
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
}`,ig=`#define STANDARD
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
}`,sg=`#define STANDARD
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
}`,rg=`#define TOON
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
}`,ag=`#define TOON
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
}`,og=`uniform float size;
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
}`,lg=`uniform vec3 diffuse;
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
}`,cg=`#include <common>
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
}`,hg=`uniform vec3 color;
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
}`,dg=`uniform float rotation;
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
}`,ug=`uniform vec3 diffuse;
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
}`,Mt={alphahash_fragment:Up,alphahash_pars_fragment:Fp,alphamap_fragment:Np,alphamap_pars_fragment:zp,alphatest_fragment:Op,alphatest_pars_fragment:Bp,aomap_fragment:kp,aomap_pars_fragment:Vp,batching_pars_vertex:Gp,batching_vertex:Hp,begin_vertex:Wp,beginnormal_vertex:Xp,bsdfs:qp,iridescence_fragment:Yp,bumpmap_pars_fragment:$p,clipping_planes_fragment:Zp,clipping_planes_pars_fragment:Kp,clipping_planes_pars_vertex:Jp,clipping_planes_vertex:jp,color_fragment:Qp,color_pars_fragment:em,color_pars_vertex:tm,color_vertex:nm,common:im,cube_uv_reflection_fragment:sm,defaultnormal_vertex:rm,displacementmap_pars_vertex:am,displacementmap_vertex:om,emissivemap_fragment:lm,emissivemap_pars_fragment:cm,colorspace_fragment:hm,colorspace_pars_fragment:dm,envmap_fragment:um,envmap_common_pars_fragment:fm,envmap_pars_fragment:pm,envmap_pars_vertex:mm,envmap_physical_pars_fragment:Em,envmap_vertex:xm,fog_vertex:gm,fog_pars_vertex:vm,fog_fragment:_m,fog_pars_fragment:Mm,gradientmap_pars_fragment:ym,lightmap_pars_fragment:Sm,lights_lambert_fragment:bm,lights_lambert_pars_fragment:wm,lights_pars_begin:Tm,lights_toon_fragment:Am,lights_toon_pars_fragment:Cm,lights_phong_fragment:Rm,lights_phong_pars_fragment:Pm,lights_physical_fragment:Lm,lights_physical_pars_fragment:Dm,lights_fragment_begin:Im,lights_fragment_maps:Um,lights_fragment_end:Fm,logdepthbuf_fragment:Nm,logdepthbuf_pars_fragment:zm,logdepthbuf_pars_vertex:Om,logdepthbuf_vertex:Bm,map_fragment:km,map_pars_fragment:Vm,map_particle_fragment:Gm,map_particle_pars_fragment:Hm,metalnessmap_fragment:Wm,metalnessmap_pars_fragment:Xm,morphinstance_vertex:qm,morphcolor_vertex:Ym,morphnormal_vertex:$m,morphtarget_pars_vertex:Zm,morphtarget_vertex:Km,normal_fragment_begin:Jm,normal_fragment_maps:jm,normal_pars_fragment:Qm,normal_pars_vertex:ex,normal_vertex:tx,normalmap_pars_fragment:nx,clearcoat_normal_fragment_begin:ix,clearcoat_normal_fragment_maps:sx,clearcoat_pars_fragment:rx,iridescence_pars_fragment:ax,opaque_fragment:ox,packing:lx,premultiplied_alpha_fragment:cx,project_vertex:hx,dithering_fragment:dx,dithering_pars_fragment:ux,roughnessmap_fragment:fx,roughnessmap_pars_fragment:px,shadowmap_pars_fragment:mx,shadowmap_pars_vertex:xx,shadowmap_vertex:gx,shadowmask_pars_fragment:vx,skinbase_vertex:_x,skinning_pars_vertex:Mx,skinning_vertex:yx,skinnormal_vertex:Sx,specularmap_fragment:bx,specularmap_pars_fragment:wx,tonemapping_fragment:Tx,tonemapping_pars_fragment:Ex,transmission_fragment:Ax,transmission_pars_fragment:Cx,uv_pars_fragment:Rx,uv_pars_vertex:Px,uv_vertex:Lx,worldpos_vertex:Dx,background_vert:Ix,background_frag:Ux,backgroundCube_vert:Fx,backgroundCube_frag:Nx,cube_vert:zx,cube_frag:Ox,depth_vert:Bx,depth_frag:kx,distanceRGBA_vert:Vx,distanceRGBA_frag:Gx,equirect_vert:Hx,equirect_frag:Wx,linedashed_vert:Xx,linedashed_frag:qx,meshbasic_vert:Yx,meshbasic_frag:$x,meshlambert_vert:Zx,meshlambert_frag:Kx,meshmatcap_vert:Jx,meshmatcap_frag:jx,meshnormal_vert:Qx,meshnormal_frag:eg,meshphong_vert:tg,meshphong_frag:ng,meshphysical_vert:ig,meshphysical_frag:sg,meshtoon_vert:rg,meshtoon_frag:ag,points_vert:og,points_frag:lg,shadow_vert:cg,shadow_frag:hg,sprite_vert:dg,sprite_frag:ug},Be={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new _t}},envmap:{envMap:{value:null},envMapRotation:{value:new _t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new _t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new _t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new _t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new _t},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new _t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new _t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new _t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new _t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0},uvTransform:{value:new _t}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}}},oi={basic:{uniforms:wn([Be.common,Be.specularmap,Be.envmap,Be.aomap,Be.lightmap,Be.fog]),vertexShader:Mt.meshbasic_vert,fragmentShader:Mt.meshbasic_frag},lambert:{uniforms:wn([Be.common,Be.specularmap,Be.envmap,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.fog,Be.lights,{emissive:{value:new rt(0)}}]),vertexShader:Mt.meshlambert_vert,fragmentShader:Mt.meshlambert_frag},phong:{uniforms:wn([Be.common,Be.specularmap,Be.envmap,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.fog,Be.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:Mt.meshphong_vert,fragmentShader:Mt.meshphong_frag},standard:{uniforms:wn([Be.common,Be.envmap,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.roughnessmap,Be.metalnessmap,Be.fog,Be.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Mt.meshphysical_vert,fragmentShader:Mt.meshphysical_frag},toon:{uniforms:wn([Be.common,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.gradientmap,Be.fog,Be.lights,{emissive:{value:new rt(0)}}]),vertexShader:Mt.meshtoon_vert,fragmentShader:Mt.meshtoon_frag},matcap:{uniforms:wn([Be.common,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.fog,{matcap:{value:null}}]),vertexShader:Mt.meshmatcap_vert,fragmentShader:Mt.meshmatcap_frag},points:{uniforms:wn([Be.points,Be.fog]),vertexShader:Mt.points_vert,fragmentShader:Mt.points_frag},dashed:{uniforms:wn([Be.common,Be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Mt.linedashed_vert,fragmentShader:Mt.linedashed_frag},depth:{uniforms:wn([Be.common,Be.displacementmap]),vertexShader:Mt.depth_vert,fragmentShader:Mt.depth_frag},normal:{uniforms:wn([Be.common,Be.bumpmap,Be.normalmap,Be.displacementmap,{opacity:{value:1}}]),vertexShader:Mt.meshnormal_vert,fragmentShader:Mt.meshnormal_frag},sprite:{uniforms:wn([Be.sprite,Be.fog]),vertexShader:Mt.sprite_vert,fragmentShader:Mt.sprite_frag},background:{uniforms:{uvTransform:{value:new _t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Mt.background_vert,fragmentShader:Mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new _t}},vertexShader:Mt.backgroundCube_vert,fragmentShader:Mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Mt.cube_vert,fragmentShader:Mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Mt.equirect_vert,fragmentShader:Mt.equirect_frag},distanceRGBA:{uniforms:wn([Be.common,Be.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Mt.distanceRGBA_vert,fragmentShader:Mt.distanceRGBA_frag},shadow:{uniforms:wn([Be.lights,Be.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:Mt.shadow_vert,fragmentShader:Mt.shadow_frag}};oi.physical={uniforms:wn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new _t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new _t},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new _t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new _t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new _t},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new _t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new _t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new _t},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new _t},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new _t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new _t},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new _t}}]),vertexShader:Mt.meshphysical_vert,fragmentShader:Mt.meshphysical_frag};const Ha={r:0,b:0,g:0},as=new ii,fg=new At;function pg(n,e,t,i,s,r,a){const o=new rt(0);let c=r===!0?0:1,h,d,f=null,p=0,m=null;function x(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y)),y}function M(v){let y=!1;const E=x(v);E===null?u(o,c):E&&E.isColor&&(u(E,1),y=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,y){const E=x(y);E&&(E.isCubeTexture||E.mapping===vo)?(d===void 0&&(d=new O(new _e(1,1,1),new fn({name:"BackgroundCubeMaterial",uniforms:hr(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),as.copy(y.backgroundRotation),as.x*=-1,as.y*=-1,as.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(as.y*=-1,as.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(fg.makeRotationFromEuler(as)),d.material.toneMapped=Rt.getTransfer(E.colorSpace)!==Bt,(f!==E||p!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,f=E,p=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new O(new Wt(2,2),new fn({name:"BackgroundMaterial",uniforms:hr(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.toneMapped=Rt.getTransfer(E.colorSpace)!==Bt,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,f=E,p=E.version,m=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function u(v,y){v.getRGB(Ha,lu(n)),i.buffers.color.setClear(Ha.r,Ha.g,Ha.b,y,a)}function _(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),c=y,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,u(o,c)},render:M,addToRenderList:g,dispose:_}}function mg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let r=s,a=!1;function o(S,L,F,W,Q){let te=!1;const q=f(W,F,L);r!==q&&(r=q,h(r.object)),te=m(S,W,F,Q),te&&x(S,W,F,Q),Q!==null&&e.update(Q,n.ELEMENT_ARRAY_BUFFER),(te||a)&&(a=!1,y(S,L,F,W),Q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Q).buffer))}function c(){return n.createVertexArray()}function h(S){return n.bindVertexArray(S)}function d(S){return n.deleteVertexArray(S)}function f(S,L,F){const W=F.wireframe===!0;let Q=i[S.id];Q===void 0&&(Q={},i[S.id]=Q);let te=Q[L.id];te===void 0&&(te={},Q[L.id]=te);let q=te[W];return q===void 0&&(q=p(c()),te[W]=q),q}function p(S){const L=[],F=[],W=[];for(let Q=0;Q<t;Q++)L[Q]=0,F[Q]=0,W[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:W,object:S,attributes:{},index:null}}function m(S,L,F,W){const Q=r.attributes,te=L.attributes;let q=0;const Z=F.getAttributes();for(const ne in Z)if(Z[ne].location>=0){const me=Q[ne];let Ge=te[ne];if(Ge===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(Ge=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(Ge=S.instanceColor)),me===void 0||me.attribute!==Ge||Ge&&me.data!==Ge.data)return!0;q++}return r.attributesNum!==q||r.index!==W}function x(S,L,F,W){const Q={},te=L.attributes;let q=0;const Z=F.getAttributes();for(const ne in Z)if(Z[ne].location>=0){let me=te[ne];me===void 0&&(ne==="instanceMatrix"&&S.instanceMatrix&&(me=S.instanceMatrix),ne==="instanceColor"&&S.instanceColor&&(me=S.instanceColor));const Ge={};Ge.attribute=me,me&&me.data&&(Ge.data=me.data),Q[ne]=Ge,q++}r.attributes=Q,r.attributesNum=q,r.index=W}function M(){const S=r.newAttributes;for(let L=0,F=S.length;L<F;L++)S[L]=0}function g(S){u(S,0)}function u(S,L){const F=r.newAttributes,W=r.enabledAttributes,Q=r.attributeDivisors;F[S]=1,W[S]===0&&(n.enableVertexAttribArray(S),W[S]=1),Q[S]!==L&&(n.vertexAttribDivisor(S,L),Q[S]=L)}function _(){const S=r.newAttributes,L=r.enabledAttributes;for(let F=0,W=L.length;F<W;F++)L[F]!==S[F]&&(n.disableVertexAttribArray(F),L[F]=0)}function v(S,L,F,W,Q,te,q){q===!0?n.vertexAttribIPointer(S,L,F,Q,te):n.vertexAttribPointer(S,L,F,W,Q,te)}function y(S,L,F,W){M();const Q=W.attributes,te=F.getAttributes(),q=L.defaultAttributeValues;for(const Z in te){const ne=te[Z];if(ne.location>=0){let de=Q[Z];if(de===void 0&&(Z==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),Z==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const me=de.normalized,Ge=de.itemSize,I=e.get(de);if(I===void 0)continue;const Ae=I.buffer,ye=I.type,Ce=I.bytesPerElement,$=ye===n.INT||ye===n.UNSIGNED_INT||de.gpuType===Lc;if(de.isInterleavedBufferAttribute){const K=de.data,Me=K.stride,be=de.offset;if(K.isInstancedInterleavedBuffer){for(let Ne=0;Ne<ne.locationSize;Ne++)u(ne.location+Ne,K.meshPerAttribute);S.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ne=0;Ne<ne.locationSize;Ne++)g(ne.location+Ne);n.bindBuffer(n.ARRAY_BUFFER,Ae);for(let Ne=0;Ne<ne.locationSize;Ne++)v(ne.location+Ne,Ge/ne.locationSize,ye,me,Me*Ce,(be+Ge/ne.locationSize*Ne)*Ce,$)}else{if(de.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)u(ne.location+K,de.meshPerAttribute);S.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let K=0;K<ne.locationSize;K++)g(ne.location+K);n.bindBuffer(n.ARRAY_BUFFER,Ae);for(let K=0;K<ne.locationSize;K++)v(ne.location+K,Ge/ne.locationSize,ye,me,Ge*Ce,Ge/ne.locationSize*K*Ce,$)}}else if(q!==void 0){const me=q[Z];if(me!==void 0)switch(me.length){case 2:n.vertexAttrib2fv(ne.location,me);break;case 3:n.vertexAttrib3fv(ne.location,me);break;case 4:n.vertexAttrib4fv(ne.location,me);break;default:n.vertexAttrib1fv(ne.location,me)}}}}_()}function E(){R();for(const S in i){const L=i[S];for(const F in L){const W=L[F];for(const Q in W)d(W[Q].object),delete W[Q];delete L[F]}delete i[S]}}function T(S){if(i[S.id]===void 0)return;const L=i[S.id];for(const F in L){const W=L[F];for(const Q in W)d(W[Q].object),delete W[Q];delete L[F]}delete i[S.id]}function C(S){for(const L in i){const F=i[L];if(F[S.id]===void 0)continue;const W=F[S.id];for(const Q in W)d(W[Q].object),delete W[Q];delete F[S.id]}}function R(){w(),a=!0,r!==s&&(r=s,h(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:g,disableUnusedAttributes:_}}function xg(n,e,t){let i;function s(h){i=h}function r(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function a(h,d,f){f!==0&&(n.drawArraysInstanced(i,h,d,f),t.update(d,i,f))}function o(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,f);let m=0;for(let x=0;x<f;x++)m+=d[x];t.update(m,i,1)}function c(h,d,f,p){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<h.length;x++)a(h[x],d[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(i,h,0,d,0,p,0,f);let x=0;for(let M=0;M<f;M++)x+=d[M]*p[M];t.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function gg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==ei&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const R=C===fi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==xi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ci&&!R)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(ft("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const f=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function vg(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new cs,o=new _t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||i!==0||s;return s=p,i=f.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,p){t=d(f,p,0)},this.setState=function(f,p,m){const x=f.clippingPlanes,M=f.clipIntersection,g=f.clipShadows,u=n.get(f);if(!s||x===null||x.length===0||r&&!g)r?d(null):h();else{const _=r?0:i,v=_*4;let y=u.clippingState||null;c.value=y,y=d(x,p,v,m);for(let E=0;E!==v;++E)y[E]=t[E];u.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=_}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,p,m,x){const M=f!==null?f.length:0;let g=null;if(M!==0){if(g=c.value,x!==!0||g===null){const u=m+M*4,_=p.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<u)&&(g=new Float32Array(u));for(let v=0,y=m;v!==M;++v,y+=4)a.copy(f[v]).applyMatrix4(_,o),a.normal.toArray(g,y),g[y+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}function _g(n){let e=new WeakMap;function t(a,o){return o===Ll?a.mapping=or:o===Dl&&(a.mapping=lr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ll||o===Dl)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new O0(c.height);return h.fromEquirectangularTexture(n,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const qi=4,td=[.125,.215,.35,.446,.526,.582],fs=20,Mg=512,Dr=new eh,nd=new rt;let cl=null,hl=0,dl=0,ul=!1;const yg=new P;class pc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=yg}=r;cl=this._renderer.getRenderTarget(),hl=this._renderer.getActiveCubeFace(),dl=this._renderer.getActiveMipmapLevel(),ul=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(cl,hl,dl),this._renderer.xr.enabled=ul,e.scissorTest=!1,Ks(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===or||e.mapping===lr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),cl=this._renderer.getRenderTarget(),hl=this._renderer.getActiveCubeFace(),dl=this._renderer.getActiveMipmapLevel(),ul=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Wn,minFilter:Wn,generateMipmaps:!1,type:fi,format:ei,colorSpace:cr,depthBuffer:!1},s=id(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=id(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Sg(r)),this._blurMaterial=wg(r,e,t)}return s}_compileMaterial(e){const t=new O(new Xt,e);this._renderer.compile(t,Dr)}_sceneToCubeUV(e,t,i,s,r){const c=new Dn(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,m=f.toneMapping;f.getClearColor(nd),f.toneMapping=Zi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new O(new _e,new Tt({name:"PMREM.Background",side:vn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,g=M.material;let u=!1;const _=e.background;_?_.isColor&&(g.color.copy(_),e.background=null,u=!0):(g.color.copy(nd),u=!0);for(let v=0;v<6;v++){const y=v%3;y===0?(c.up.set(0,h[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[v],r.y,r.z)):y===1?(c.up.set(0,0,h[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[v],r.z)):(c.up.set(0,h[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;Ks(s,y*E,v>2?E:0,E,E),f.setRenderTarget(s),u&&f.render(M,c),f.render(e,c)}f.toneMapping=m,f.autoClear=p,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===or||e.mapping===lr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Ks(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,Dr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget;if(this._ggxMaterial===null){const _=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=bg(this._lodMax,_,v)}const a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(h*h-d*d),p=.05+h*.95,m=f*p,{_lodMax:x}=this,M=this._sizeLods[i],g=3*M*(i>x-qi?i-x+qi:0),u=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=x-t,Ks(r,g,u,3*M,2*M),s.setRenderTarget(r),s.render(o,Dr),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=x-i,Ks(e,g,u,3*M,2*M),s.setRenderTarget(e),s.render(o,Dr)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&jt("blur direction must be either latitudinal or longitudinal!");const d=3,f=this._lodMeshes[s];f.material=h;const p=h.uniforms,m=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*fs-1),M=r/x,g=isFinite(r)?1+Math.floor(d*M):fs;g>fs&&ft(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${fs}`);const u=[];let _=0;for(let C=0;C<fs;++C){const R=C/M,w=Math.exp(-R*R/2);u.push(w),C===0?_+=w:C<g&&(_+=2*w)}for(let C=0;C<u.length;C++)u[C]=u[C]/_;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=u,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-i;const y=this._sizeLods[s],E=3*y*(s>v-qi?s-v+qi:0),T=4*(this._cubeSize-y);Ks(t,E,T,3*y,2*y),c.setRenderTarget(t),c.render(f,Dr)}}function Sg(n){const e=[],t=[],i=[];let s=n;const r=n-qi+1+td.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-qi?c=td[a-n+qi-1]:a===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,f=1+h,p=[d,d,f,d,f,f,d,d,f,f,d,f],m=6,x=6,M=3,g=2,u=1,_=new Float32Array(M*x*m),v=new Float32Array(g*x*m),y=new Float32Array(u*x*m);for(let T=0;T<m;T++){const C=T%3*2/3-1,R=T>2?0:-1,w=[C,R,0,C+2/3,R,0,C+2/3,R+1,0,C,R,0,C+2/3,R+1,0,C,R+1,0];_.set(w,M*x*T),v.set(p,g*x*T);const S=[T,T,T,T,T,T];y.set(S,u*x*T)}const E=new Xt;E.setAttribute("position",new Nn(_,M)),E.setAttribute("uv",new Nn(v,g)),E.setAttribute("faceIndex",new Nn(y,u)),i.push(new O(E,null)),s>qi&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function id(n,e,t){const i=new ni(n,e,t);return i.texture.mapping=vo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ks(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function bg(n,e,t){return new fn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Mg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:So(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function wg(n,e,t){const i=new Float32Array(fs),s=new P(0,1,0);return new fn({name:"SphericalGaussianBlur",defines:{n:fs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:So(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function sd(){return new fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:So(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function rd(){return new fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function So(){return`

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
	`}function Tg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===Ll||c===Dl,d=c===or||c===lr;if(h||d){let f=e.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new pc(n)),f=h?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return h&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new pc(n)),f=h?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function r(o){const c=o.target;c.removeEventListener("dispose",r);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Eg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Qr("WebGLRenderer: "+i+" extension not supported."),s}}}function Ag(n,e,t,i){const s={},r=new WeakMap;function a(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);p.removeEventListener("dispose",a),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function c(f){const p=f.attributes;for(const m in p)e.update(p[m],n.ARRAY_BUFFER)}function h(f){const p=[],m=f.index,x=f.attributes.position;let M=0;if(m!==null){const _=m.array;M=m.version;for(let v=0,y=_.length;v<y;v+=3){const E=_[v+0],T=_[v+1],C=_[v+2];p.push(E,T,T,C,C,E)}}else if(x!==void 0){const _=x.array;M=x.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const E=v+0,T=v+1,C=v+2;p.push(E,T,T,C,C,E)}}else return;const g=new(iu(p)?ou:au)(p,1);g.version=M;const u=r.get(f);u&&e.remove(u),r.set(f,g)}function d(f){const p=r.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&h(f)}else h(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:d}}function Cg(n,e,t){let i;function s(p){i=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function c(p,m){n.drawElements(i,m,r,p*a),t.update(m,i,1)}function h(p,m,x){x!==0&&(n.drawElementsInstanced(i,m,r,p*a,x),t.update(m,i,x))}function d(p,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,p,0,x);let g=0;for(let u=0;u<x;u++)g+=m[u];t.update(g,i,1)}function f(p,m,x,M){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<p.length;u++)h(p[u]/a,m[u],M[u]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,r,p,0,M,0,x);let u=0;for(let _=0;_<x;_++)u+=m[_]*M[_];t.update(u,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function Rg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:jt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Pg(n,e,t){const i=new WeakMap,s=new Gt;function r(a,o,c){const h=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let p=i.get(o);if(p===void 0||p.count!==f){let S=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var m=S;p!==void 0&&p.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),g===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const C=new Float32Array(E*T*4*f),R=new su(C,E,T,f);R.type=ci,R.needsUpdate=!0;const w=y*4;for(let L=0;L<f;L++){const F=u[L],W=_[L],Q=v[L],te=E*T*4*L;for(let q=0;q<F.count;q++){const Z=q*w;x===!0&&(s.fromBufferAttribute(F,q),C[te+Z+0]=s.x,C[te+Z+1]=s.y,C[te+Z+2]=s.z,C[te+Z+3]=0),M===!0&&(s.fromBufferAttribute(W,q),C[te+Z+4]=s.x,C[te+Z+5]=s.y,C[te+Z+6]=s.z,C[te+Z+7]=0),g===!0&&(s.fromBufferAttribute(Q,q),C[te+Z+8]=s.x,C[te+Z+9]=s.y,C[te+Z+10]=s.z,C[te+Z+11]=Q.itemSize===4?s.w:1)}}p={count:f,texture:R,size:new Pe(E,T)},i.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const M=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:r}}function Lg(n,e,t,i){let s=new WeakMap;function r(c){const h=i.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==h&&(e.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return f}function a(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}const Au=new _n,ad=new pu(1,1),Cu=new su,Ru=new S0,Pu=new hu,od=[],ld=[],cd=new Float32Array(16),hd=new Float32Array(9),dd=new Float32Array(4);function mr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=od[s];if(r===void 0&&(r=new Float32Array(s),od[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function ln(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function cn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function bo(n,e){let t=ld[e];t===void 0&&(t=new Int32Array(e),ld[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Dg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Ig(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2fv(this.addr,e),cn(t,e)}}function Ug(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ln(t,e))return;n.uniform3fv(this.addr,e),cn(t,e)}}function Fg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4fv(this.addr,e),cn(t,e)}}function Ng(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),cn(t,e)}else{if(ln(t,i))return;dd.set(i),n.uniformMatrix2fv(this.addr,!1,dd),cn(t,i)}}function zg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),cn(t,e)}else{if(ln(t,i))return;hd.set(i),n.uniformMatrix3fv(this.addr,!1,hd),cn(t,i)}}function Og(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),cn(t,e)}else{if(ln(t,i))return;cd.set(i),n.uniformMatrix4fv(this.addr,!1,cd),cn(t,i)}}function Bg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function kg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2iv(this.addr,e),cn(t,e)}}function Vg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ln(t,e))return;n.uniform3iv(this.addr,e),cn(t,e)}}function Gg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4iv(this.addr,e),cn(t,e)}}function Hg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Wg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2uiv(this.addr,e),cn(t,e)}}function Xg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ln(t,e))return;n.uniform3uiv(this.addr,e),cn(t,e)}}function qg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4uiv(this.addr,e),cn(t,e)}}function Yg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(ad.compareFunction=nu,r=ad):r=Au,t.setTexture2D(e||r,s)}function $g(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ru,s)}function Zg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Pu,s)}function Kg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Cu,s)}function Jg(n){switch(n){case 5126:return Dg;case 35664:return Ig;case 35665:return Ug;case 35666:return Fg;case 35674:return Ng;case 35675:return zg;case 35676:return Og;case 5124:case 35670:return Bg;case 35667:case 35671:return kg;case 35668:case 35672:return Vg;case 35669:case 35673:return Gg;case 5125:return Hg;case 36294:return Wg;case 36295:return Xg;case 36296:return qg;case 35678:case 36198:case 36298:case 36306:case 35682:return Yg;case 35679:case 36299:case 36307:return $g;case 35680:case 36300:case 36308:case 36293:return Zg;case 36289:case 36303:case 36311:case 36292:return Kg}}function jg(n,e){n.uniform1fv(this.addr,e)}function Qg(n,e){const t=mr(e,this.size,2);n.uniform2fv(this.addr,t)}function e1(n,e){const t=mr(e,this.size,3);n.uniform3fv(this.addr,t)}function t1(n,e){const t=mr(e,this.size,4);n.uniform4fv(this.addr,t)}function n1(n,e){const t=mr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function i1(n,e){const t=mr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function s1(n,e){const t=mr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function r1(n,e){n.uniform1iv(this.addr,e)}function a1(n,e){n.uniform2iv(this.addr,e)}function o1(n,e){n.uniform3iv(this.addr,e)}function l1(n,e){n.uniform4iv(this.addr,e)}function c1(n,e){n.uniform1uiv(this.addr,e)}function h1(n,e){n.uniform2uiv(this.addr,e)}function d1(n,e){n.uniform3uiv(this.addr,e)}function u1(n,e){n.uniform4uiv(this.addr,e)}function f1(n,e,t){const i=this.cache,s=e.length,r=bo(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Au,r[a])}function p1(n,e,t){const i=this.cache,s=e.length,r=bo(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ru,r[a])}function m1(n,e,t){const i=this.cache,s=e.length,r=bo(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Pu,r[a])}function x1(n,e,t){const i=this.cache,s=e.length,r=bo(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Cu,r[a])}function g1(n){switch(n){case 5126:return jg;case 35664:return Qg;case 35665:return e1;case 35666:return t1;case 35674:return n1;case 35675:return i1;case 35676:return s1;case 5124:case 35670:return r1;case 35667:case 35671:return a1;case 35668:case 35672:return o1;case 35669:case 35673:return l1;case 5125:return c1;case 36294:return h1;case 36295:return d1;case 36296:return u1;case 35678:case 36198:case 36298:case 36306:case 35682:return f1;case 35679:case 36299:case 36307:return p1;case 35680:case 36300:case 36308:case 36293:return m1;case 36289:case 36303:case 36311:case 36292:return x1}}class v1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Jg(t.type)}}class _1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=g1(t.type)}}class M1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const fl=/(\w+)(\])?(\[|\.)?/g;function ud(n,e){n.seq.push(e),n.map[e.id]=e}function y1(n,e,t){const i=n.name,s=i.length;for(fl.lastIndex=0;;){const r=fl.exec(i),a=fl.lastIndex;let o=r[1];const c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){ud(t,h===void 0?new v1(o,n,e):new _1(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new M1(o),ud(t,f)),t=f}}}class eo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);y1(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function fd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const S1=37297;let b1=0;function w1(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const pd=new _t;function T1(n){Rt._getMatrix(pd,Rt.workingColorSpace,n);const e=`mat3( ${pd.elements.map(t=>t.toFixed(4))} )`;switch(Rt.getTransfer(n)){case io:return[e,"LinearTransferOETF"];case Bt:return[e,"sRGBTransferOETF"];default:return ft("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function md(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+w1(n.getShaderSource(e),o)}else return r}function E1(n,e){const t=T1(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function A1(n,e){let t;switch(e){case Hd:t="Linear";break;case Wd:t="Reinhard";break;case Xd:t="Cineon";break;case Pc:t="ACESFilmic";break;case Yd:t="AgX";break;case $d:t="Neutral";break;case qd:t="Custom";break;default:ft("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Wa=new P;function C1(){Rt.getLuminanceCoefficients(Wa);const n=Wa.x.toFixed(4),e=Wa.y.toFixed(4),t=Wa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function R1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fr).join(`
`)}function P1(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function L1(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Fr(n){return n!==""}function xd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const D1=/^[ \t]*#include +<([\w\d./]+)>/gm;function mc(n){return n.replace(D1,U1)}const I1=new Map;function U1(n,e){let t=Mt[e];if(t===void 0){const i=I1.get(e);if(i!==void 0)t=Mt[i],ft('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return mc(t)}const F1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vd(n){return n.replace(F1,N1)}function N1(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _d(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function z1(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Vd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Gd?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ti&&(e="SHADOWMAP_TYPE_VSM"),e}function O1(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case or:case lr:e="ENVMAP_TYPE_CUBE";break;case vo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function B1(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===lr&&(e="ENVMAP_MODE_REFRACTION"),e}function k1(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Rc:e="ENVMAP_BLENDING_MULTIPLY";break;case kf:e="ENVMAP_BLENDING_MIX";break;case Vf:e="ENVMAP_BLENDING_ADD";break}return e}function V1(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function G1(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=z1(t),h=O1(t),d=B1(t),f=k1(t),p=V1(t),m=R1(t),x=P1(r),M=s.createProgram();let g,u,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Fr).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Fr).join(`
`),u.length>0&&(u+=`
`)):(g=[_d(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fr).join(`
`),u=[_d(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zi?"#define TONE_MAPPING":"",t.toneMapping!==Zi?Mt.tonemapping_pars_fragment:"",t.toneMapping!==Zi?A1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Mt.colorspace_pars_fragment,E1("linearToOutputTexel",t.outputColorSpace),C1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Fr).join(`
`)),a=mc(a),a=xd(a,t),a=gd(a,t),o=mc(o),o=xd(o,t),o=gd(o,t),a=vd(a),o=vd(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",t.glslVersion===xh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const v=_+g+a,y=_+u+o,E=fd(s,s.VERTEX_SHADER,v),T=fd(s,s.FRAGMENT_SHADER,y);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function C(L){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(M)||"",W=s.getShaderInfoLog(E)||"",Q=s.getShaderInfoLog(T)||"",te=F.trim(),q=W.trim(),Z=Q.trim();let ne=!0,de=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,E,T);else{const me=md(s,E,"vertex"),Ge=md(s,T,"fragment");jt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+te+`
`+me+`
`+Ge)}else te!==""?ft("WebGLProgram: Program Info Log:",te):(q===""||Z==="")&&(de=!1);de&&(L.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:Z,prefix:u}})}s.deleteShader(E),s.deleteShader(T),R=new eo(s,M),w=L1(s,M)}let R;this.getUniforms=function(){return R===void 0&&C(this),R};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(M,S1)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=b1++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let H1=0;class W1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new X1(e),t.set(e,i)),i}}class X1{constructor(e){this.id=H1++,this.code=e,this.usedTimes=0}}function q1(n,e,t,i,s,r,a){const o=new Hc,c=new W1,h=new Set,d=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(w){return h.add(w),w===0?"uv":`uv${w}`}function g(w,S,L,F,W){const Q=F.fog,te=W.geometry,q=w.isMeshStandardMaterial?F.environment:null,Z=(w.isMeshStandardMaterial?t:e).get(w.envMap||q),ne=Z&&Z.mapping===vo?Z.image.height:null,de=x[w.type];w.precision!==null&&(m=s.getMaxPrecision(w.precision),m!==w.precision&&ft("WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));const me=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Ge=me!==void 0?me.length:0;let I=0;te.morphAttributes.position!==void 0&&(I=1),te.morphAttributes.normal!==void 0&&(I=2),te.morphAttributes.color!==void 0&&(I=3);let Ae,ye,Ce,$;if(de){const Ct=oi[de];Ae=Ct.vertexShader,ye=Ct.fragmentShader}else Ae=w.vertexShader,ye=w.fragmentShader,c.update(w),Ce=c.getVertexShaderID(w),$=c.getFragmentShaderID(w);const K=n.getRenderTarget(),Me=n.state.buffers.depth.getReversed(),be=W.isInstancedMesh===!0,Ne=W.isBatchedMesh===!0,je=!!w.map,It=!!w.matcap,Qe=!!Z,Lt=!!w.aoMap,B=!!w.lightMap,mt=!!w.bumpMap,pt=!!w.normalMap,Dt=!!w.displacementMap,Ze=!!w.emissiveMap,Nt=!!w.metalnessMap,nt=!!w.roughnessMap,ut=w.anisotropy>0,D=w.clearcoat>0,A=w.dispersion>0,J=w.iridescence>0,ce=w.sheen>0,pe=w.transmission>0,re=ut&&!!w.anisotropyMap,Ke=D&&!!w.clearcoatMap,Le=D&&!!w.clearcoatNormalMap,et=D&&!!w.clearcoatRoughnessMap,He=J&&!!w.iridescenceMap,xe=J&&!!w.iridescenceThicknessMap,we=ce&&!!w.sheenColorMap,at=ce&&!!w.sheenRoughnessMap,st=!!w.specularMap,Ve=!!w.specularColorMap,ot=!!w.specularIntensityMap,G=pe&&!!w.transmissionMap,Oe=pe&&!!w.thicknessMap,Fe=!!w.gradientMap,De=!!w.alphaMap,Se=w.alphaTest>0,ue=!!w.alphaHash,Xe=!!w.extensions;let lt=Zi;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(lt=n.toneMapping);const Ut={shaderID:de,shaderType:w.type,shaderName:w.name,vertexShader:Ae,fragmentShader:ye,defines:w.defines,customVertexShaderID:Ce,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:Ne,batchingColor:Ne&&W._colorsTexture!==null,instancing:be,instancingColor:be&&W.instanceColor!==null,instancingMorph:be&&W.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:cr,alphaToCoverage:!!w.alphaToCoverage,map:je,matcap:It,envMap:Qe,envMapMode:Qe&&Z.mapping,envMapCubeUVHeight:ne,aoMap:Lt,lightMap:B,bumpMap:mt,normalMap:pt,displacementMap:p&&Dt,emissiveMap:Ze,normalMapObjectSpace:pt&&w.normalMapType===Xf,normalMapTangentSpace:pt&&w.normalMapType===Bc,metalnessMap:Nt,roughnessMap:nt,anisotropy:ut,anisotropyMap:re,clearcoat:D,clearcoatMap:Ke,clearcoatNormalMap:Le,clearcoatRoughnessMap:et,dispersion:A,iridescence:J,iridescenceMap:He,iridescenceThicknessMap:xe,sheen:ce,sheenColorMap:we,sheenRoughnessMap:at,specularMap:st,specularColorMap:Ve,specularIntensityMap:ot,transmission:pe,transmissionMap:G,thicknessMap:Oe,gradientMap:Fe,opaque:w.transparent===!1&&w.blending===er&&w.alphaToCoverage===!1,alphaMap:De,alphaTest:Se,alphaHash:ue,combine:w.combine,mapUv:je&&M(w.map.channel),aoMapUv:Lt&&M(w.aoMap.channel),lightMapUv:B&&M(w.lightMap.channel),bumpMapUv:mt&&M(w.bumpMap.channel),normalMapUv:pt&&M(w.normalMap.channel),displacementMapUv:Dt&&M(w.displacementMap.channel),emissiveMapUv:Ze&&M(w.emissiveMap.channel),metalnessMapUv:Nt&&M(w.metalnessMap.channel),roughnessMapUv:nt&&M(w.roughnessMap.channel),anisotropyMapUv:re&&M(w.anisotropyMap.channel),clearcoatMapUv:Ke&&M(w.clearcoatMap.channel),clearcoatNormalMapUv:Le&&M(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&M(w.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&M(w.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&M(w.iridescenceThicknessMap.channel),sheenColorMapUv:we&&M(w.sheenColorMap.channel),sheenRoughnessMapUv:at&&M(w.sheenRoughnessMap.channel),specularMapUv:st&&M(w.specularMap.channel),specularColorMapUv:Ve&&M(w.specularColorMap.channel),specularIntensityMapUv:ot&&M(w.specularIntensityMap.channel),transmissionMapUv:G&&M(w.transmissionMap.channel),thicknessMapUv:Oe&&M(w.thicknessMap.channel),alphaMapUv:De&&M(w.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(pt||ut),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!te.attributes.uv&&(je||De),fog:!!Q,useFog:w.fog===!0,fogExp2:!!Q&&Q.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Me,skinning:W.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Ge,morphTextureStride:I,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:lt,decodeVideoTexture:je&&w.map.isVideoTexture===!0&&Rt.getTransfer(w.map.colorSpace)===Bt,decodeVideoTextureEmissive:Ze&&w.emissiveMap.isVideoTexture===!0&&Rt.getTransfer(w.emissiveMap.colorSpace)===Bt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===xt,flipSided:w.side===vn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Xe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&w.extensions.multiDraw===!0||Ne)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ut.vertexUv1s=h.has(1),Ut.vertexUv2s=h.has(2),Ut.vertexUv3s=h.has(3),h.clear(),Ut}function u(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const L in w.defines)S.push(L),S.push(w.defines[L]);return w.isRawShaderMaterial===!1&&(_(S,w),v(S,w),S.push(n.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function _(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function v(w,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),w.push(o.mask)}function y(w){const S=x[w.type];let L;if(S){const F=oi[S];L=ta.clone(F.uniforms)}else L=w.uniforms;return L}function E(w,S){let L;for(let F=0,W=d.length;F<W;F++){const Q=d[F];if(Q.cacheKey===S){L=Q,++L.usedTimes;break}}return L===void 0&&(L=new G1(n,S,w,r),d.push(L)),L}function T(w){if(--w.usedTimes===0){const S=d.indexOf(w);d[S]=d[d.length-1],d.pop(),w.destroy()}}function C(w){c.remove(w)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:C,programs:d,dispose:R}}function Y1(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function $1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Md(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function yd(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f,p,m,x,M,g){let u=n[e];return u===void 0?(u={id:f.id,object:f,geometry:p,material:m,groupOrder:x,renderOrder:f.renderOrder,z:M,group:g},n[e]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=m,u.groupOrder=x,u.renderOrder=f.renderOrder,u.z=M,u.group=g),e++,u}function o(f,p,m,x,M,g){const u=a(f,p,m,x,M,g);m.transmission>0?i.push(u):m.transparent===!0?s.push(u):t.push(u)}function c(f,p,m,x,M,g){const u=a(f,p,m,x,M,g);m.transmission>0?i.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function h(f,p){t.length>1&&t.sort(f||$1),i.length>1&&i.sort(p||Md),s.length>1&&s.sort(p||Md)}function d(){for(let f=e,p=n.length;f<p;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:d,sort:h}}function Z1(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new yd,n.set(i,[a])):s>=r.length?(a=new yd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function K1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new rt};break;case"SpotLight":t={position:new P,direction:new P,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function J1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let j1=0;function Q1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ev(n){const e=new K1,t=J1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new P);const s=new P,r=new At,a=new At;function o(h){let d=0,f=0,p=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let m=0,x=0,M=0,g=0,u=0,_=0,v=0,y=0,E=0,T=0,C=0;h.sort(Q1);for(let w=0,S=h.length;w<S;w++){const L=h[w],F=L.color,W=L.intensity,Q=L.distance,te=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=F.r*W,f+=F.g*W,p+=F.b*W;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],W);C++}else if(L.isDirectionalLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.directionalShadow[m]=ne,i.directionalShadowMap[m]=te,i.directionalShadowMatrix[m]=L.shadow.matrix,_++}i.directional[m]=q,m++}else if(L.isSpotLight){const q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(F).multiplyScalar(W),q.distance=Q,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const Z=L.shadow;if(L.map&&(i.spotLightMap[E]=L.map,E++,Z.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[M]=Z.matrix,L.castShadow){const ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=te,y++}M++}else if(L.isRectAreaLight){const q=e.get(L);q.color.copy(F).multiplyScalar(W),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=q,g++}else if(L.isPointLight){const q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const Z=L.shadow,ne=t.get(L);ne.shadowIntensity=Z.intensity,ne.shadowBias=Z.bias,ne.shadowNormalBias=Z.normalBias,ne.shadowRadius=Z.radius,ne.shadowMapSize=Z.mapSize,ne.shadowCameraNear=Z.camera.near,ne.shadowCameraFar=Z.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=L.shadow.matrix,v++}i.point[x]=q,x++}else if(L.isHemisphereLight){const q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(W),q.groundColor.copy(L.groundColor).multiplyScalar(W),i.hemi[u]=q,u++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Be.LTC_FLOAT_1,i.rectAreaLTC2=Be.LTC_FLOAT_2):(i.rectAreaLTC1=Be.LTC_HALF_1,i.rectAreaLTC2=Be.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=p;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==M||R.rectAreaLength!==g||R.hemiLength!==u||R.numDirectionalShadows!==_||R.numPointShadows!==v||R.numSpotShadows!==y||R.numSpotMaps!==E||R.numLightProbes!==C)&&(i.directional.length=m,i.spot.length=M,i.rectArea.length=g,i.point.length=x,i.hemi.length=u,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=y+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,R.directionalLength=m,R.pointLength=x,R.spotLength=M,R.rectAreaLength=g,R.hemiLength=u,R.numDirectionalShadows=_,R.numPointShadows=v,R.numSpotShadows=y,R.numSpotMaps=E,R.numLightProbes=C,i.version=j1++)}function c(h,d){let f=0,p=0,m=0,x=0,M=0;const g=d.matrixWorldInverse;for(let u=0,_=h.length;u<_;u++){const v=h[u];if(v.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(v.isSpotLight){const y=i.spot[m];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const y=i.rectArea[x];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(v.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){const y=i.point[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){const y=i.hemi[M];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(g),M++}}}return{setup:o,setupView:c,state:i}}function Sd(n){const e=new ev(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function r(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function tv(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Sd(n),e.set(s,[o])):r>=a.length?(o=new Sd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const nv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iv=`uniform sampler2D shadow_pass;
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
}`;function sv(n,e,t){let i=new qc;const s=new Pe,r=new Pe,a=new Gt,o=new Tp({depthPacking:Wf}),c=new Ep,h={},d=t.maxTextureSize,f={[Qi]:vn,[vn]:Qi,[xt]:xt},p=new fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:nv,fragmentShader:iv}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Xt;x.setAttribute("position",new Nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new O(x,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vd;let u=this.type;this.render=function(T,C,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const w=n.getRenderTarget(),S=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),F=n.state;F.setBlending(ui),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const W=u!==Ti&&this.type===Ti,Q=u===Ti&&this.type!==Ti;for(let te=0,q=T.length;te<q;te++){const Z=T[te],ne=Z.shadow;if(ne===void 0){ft("WebGLShadowMap:",Z,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const de=ne.getFrameExtents();if(s.multiply(de),r.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/de.x),s.x=r.x*de.x,ne.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/de.y),s.y=r.y*de.y,ne.mapSize.y=r.y)),ne.map===null||W===!0||Q===!0){const Ge=this.type!==Ti?{minFilter:Fn,magFilter:Fn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new ni(s.x,s.y,Ge),ne.map.texture.name=Z.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const me=ne.getViewportCount();for(let Ge=0;Ge<me;Ge++){const I=ne.getViewport(Ge);a.set(r.x*I.x,r.y*I.y,r.x*I.z,r.y*I.w),F.viewport(a),ne.updateMatrices(Z,Ge),i=ne.getFrustum(),y(C,R,ne.camera,Z,this.type)}ne.isPointLightShadow!==!0&&this.type===Ti&&_(ne,R),ne.needsUpdate=!1}u=this.type,g.needsUpdate=!1,n.setRenderTarget(w,S,L)};function _(T,C){const R=e.update(M);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new ni(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,R,p,M,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,R,m,M,null)}function v(T,C,R,w){let S=null;const L=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)S=L;else if(S=R.isPointLight===!0?c:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=S.uuid,W=C.uuid;let Q=h[F];Q===void 0&&(Q={},h[F]=Q);let te=Q[W];te===void 0&&(te=S.clone(),Q[W]=te,C.addEventListener("dispose",E)),S=te}if(S.visible=C.visible,S.wireframe=C.wireframe,w===Ti?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:f[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,R.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=n.properties.get(S);F.light=R}return S}function y(T,C,R,w,S){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Ti)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const W=e.update(T),Q=T.material;if(Array.isArray(Q)){const te=W.groups;for(let q=0,Z=te.length;q<Z;q++){const ne=te[q],de=Q[ne.materialIndex];if(de&&de.visible){const me=v(T,de,w,S);T.onBeforeShadow(n,T,C,R,W,me,ne),n.renderBufferDirect(R,null,W,me,T,ne),T.onAfterShadow(n,T,C,R,W,me,ne)}}}else if(Q.visible){const te=v(T,Q,w,S);T.onBeforeShadow(n,T,C,R,W,te,null),n.renderBufferDirect(R,null,W,te,T,null),T.onAfterShadow(n,T,C,R,W,te,null)}}const F=T.children;for(let W=0,Q=F.length;W<Q;W++)y(F[W],C,R,w,S)}function E(T){T.target.removeEventListener("dispose",E);for(const R in h){const w=h[R],S=T.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const rv={[wl]:Tl,[El]:Rl,[Al]:Pl,[ar]:Cl,[Tl]:wl,[Rl]:El,[Pl]:Al,[Cl]:ar};function av(n,e){function t(){let G=!1;const Oe=new Gt;let Fe=null;const De=new Gt(0,0,0,0);return{setMask:function(Se){Fe!==Se&&!G&&(n.colorMask(Se,Se,Se,Se),Fe=Se)},setLocked:function(Se){G=Se},setClear:function(Se,ue,Xe,lt,Ut){Ut===!0&&(Se*=lt,ue*=lt,Xe*=lt),Oe.set(Se,ue,Xe,lt),De.equals(Oe)===!1&&(n.clearColor(Se,ue,Xe,lt),De.copy(Oe))},reset:function(){G=!1,Fe=null,De.set(-1,0,0,0)}}}function i(){let G=!1,Oe=!1,Fe=null,De=null,Se=null;return{setReversed:function(ue){if(Oe!==ue){const Xe=e.get("EXT_clip_control");ue?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT),Oe=ue;const lt=Se;Se=null,this.setClear(lt)}},getReversed:function(){return Oe},setTest:function(ue){ue?K(n.DEPTH_TEST):Me(n.DEPTH_TEST)},setMask:function(ue){Fe!==ue&&!G&&(n.depthMask(ue),Fe=ue)},setFunc:function(ue){if(Oe&&(ue=rv[ue]),De!==ue){switch(ue){case wl:n.depthFunc(n.NEVER);break;case Tl:n.depthFunc(n.ALWAYS);break;case El:n.depthFunc(n.LESS);break;case ar:n.depthFunc(n.LEQUAL);break;case Al:n.depthFunc(n.EQUAL);break;case Cl:n.depthFunc(n.GEQUAL);break;case Rl:n.depthFunc(n.GREATER);break;case Pl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}De=ue}},setLocked:function(ue){G=ue},setClear:function(ue){Se!==ue&&(Oe&&(ue=1-ue),n.clearDepth(ue),Se=ue)},reset:function(){G=!1,Fe=null,De=null,Se=null,Oe=!1}}}function s(){let G=!1,Oe=null,Fe=null,De=null,Se=null,ue=null,Xe=null,lt=null,Ut=null;return{setTest:function(Ct){G||(Ct?K(n.STENCIL_TEST):Me(n.STENCIL_TEST))},setMask:function(Ct){Oe!==Ct&&!G&&(n.stencilMask(Ct),Oe=Ct)},setFunc:function(Ct,yn,pn){(Fe!==Ct||De!==yn||Se!==pn)&&(n.stencilFunc(Ct,yn,pn),Fe=Ct,De=yn,Se=pn)},setOp:function(Ct,yn,pn){(ue!==Ct||Xe!==yn||lt!==pn)&&(n.stencilOp(Ct,yn,pn),ue=Ct,Xe=yn,lt=pn)},setLocked:function(Ct){G=Ct},setClear:function(Ct){Ut!==Ct&&(n.clearStencil(Ct),Ut=Ct)},reset:function(){G=!1,Oe=null,Fe=null,De=null,Se=null,ue=null,Xe=null,lt=null,Ut=null}}}const r=new t,a=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},f={},p=new WeakMap,m=[],x=null,M=!1,g=null,u=null,_=null,v=null,y=null,E=null,T=null,C=new rt(0,0,0),R=0,w=!1,S=null,L=null,F=null,W=null,Q=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Z=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=Z>=1):ne.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=Z>=2);let de=null,me={};const Ge=n.getParameter(n.SCISSOR_BOX),I=n.getParameter(n.VIEWPORT),Ae=new Gt().fromArray(Ge),ye=new Gt().fromArray(I);function Ce(G,Oe,Fe,De){const Se=new Uint8Array(4),ue=n.createTexture();n.bindTexture(G,ue),n.texParameteri(G,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(G,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Xe=0;Xe<Fe;Xe++)G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?n.texImage3D(Oe,0,n.RGBA,1,1,De,0,n.RGBA,n.UNSIGNED_BYTE,Se):n.texImage2D(Oe+Xe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Se);return ue}const $={};$[n.TEXTURE_2D]=Ce(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Ce(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Ce(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Ce(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(n.DEPTH_TEST),a.setFunc(ar),mt(!1),pt(uh),K(n.CULL_FACE),Lt(ui);function K(G){d[G]!==!0&&(n.enable(G),d[G]=!0)}function Me(G){d[G]!==!1&&(n.disable(G),d[G]=!1)}function be(G,Oe){return f[G]!==Oe?(n.bindFramebuffer(G,Oe),f[G]=Oe,G===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Oe),G===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Oe),!0):!1}function Ne(G,Oe){let Fe=m,De=!1;if(G){Fe=p.get(Oe),Fe===void 0&&(Fe=[],p.set(Oe,Fe));const Se=G.textures;if(Fe.length!==Se.length||Fe[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,Xe=Se.length;ue<Xe;ue++)Fe[ue]=n.COLOR_ATTACHMENT0+ue;Fe.length=Se.length,De=!0}}else Fe[0]!==n.BACK&&(Fe[0]=n.BACK,De=!0);De&&n.drawBuffers(Fe)}function je(G){return x!==G?(n.useProgram(G),x=G,!0):!1}const It={[us]:n.FUNC_ADD,[bf]:n.FUNC_SUBTRACT,[wf]:n.FUNC_REVERSE_SUBTRACT};It[Tf]=n.MIN,It[Ef]=n.MAX;const Qe={[Af]:n.ZERO,[Cf]:n.ONE,[Rf]:n.SRC_COLOR,[Sl]:n.SRC_ALPHA,[Ff]:n.SRC_ALPHA_SATURATE,[If]:n.DST_COLOR,[Lf]:n.DST_ALPHA,[Pf]:n.ONE_MINUS_SRC_COLOR,[bl]:n.ONE_MINUS_SRC_ALPHA,[Uf]:n.ONE_MINUS_DST_COLOR,[Df]:n.ONE_MINUS_DST_ALPHA,[Nf]:n.CONSTANT_COLOR,[zf]:n.ONE_MINUS_CONSTANT_COLOR,[Of]:n.CONSTANT_ALPHA,[Bf]:n.ONE_MINUS_CONSTANT_ALPHA};function Lt(G,Oe,Fe,De,Se,ue,Xe,lt,Ut,Ct){if(G===ui){M===!0&&(Me(n.BLEND),M=!1);return}if(M===!1&&(K(n.BLEND),M=!0),G!==Sf){if(G!==g||Ct!==w){if((u!==us||y!==us)&&(n.blendEquation(n.FUNC_ADD),u=us,y=us),Ct)switch(G){case er:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Qn:n.blendFunc(n.ONE,n.ONE);break;case fh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ph:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:jt("WebGLState: Invalid blending: ",G);break}else switch(G){case er:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Qn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case fh:jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ph:jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:jt("WebGLState: Invalid blending: ",G);break}_=null,v=null,E=null,T=null,C.set(0,0,0),R=0,g=G,w=Ct}return}Se=Se||Oe,ue=ue||Fe,Xe=Xe||De,(Oe!==u||Se!==y)&&(n.blendEquationSeparate(It[Oe],It[Se]),u=Oe,y=Se),(Fe!==_||De!==v||ue!==E||Xe!==T)&&(n.blendFuncSeparate(Qe[Fe],Qe[De],Qe[ue],Qe[Xe]),_=Fe,v=De,E=ue,T=Xe),(lt.equals(C)===!1||Ut!==R)&&(n.blendColor(lt.r,lt.g,lt.b,Ut),C.copy(lt),R=Ut),g=G,w=!1}function B(G,Oe){G.side===xt?Me(n.CULL_FACE):K(n.CULL_FACE);let Fe=G.side===vn;Oe&&(Fe=!Fe),mt(Fe),G.blending===er&&G.transparent===!1?Lt(ui):Lt(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),r.setMask(G.colorWrite);const De=G.stencilWrite;o.setTest(De),De&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),Ze(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):Me(n.SAMPLE_ALPHA_TO_COVERAGE)}function mt(G){S!==G&&(G?n.frontFace(n.CW):n.frontFace(n.CCW),S=G)}function pt(G){G!==Mf?(K(n.CULL_FACE),G!==L&&(G===uh?n.cullFace(n.BACK):G===yf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Me(n.CULL_FACE),L=G}function Dt(G){G!==F&&(q&&n.lineWidth(G),F=G)}function Ze(G,Oe,Fe){G?(K(n.POLYGON_OFFSET_FILL),(W!==Oe||Q!==Fe)&&(n.polygonOffset(Oe,Fe),W=Oe,Q=Fe)):Me(n.POLYGON_OFFSET_FILL)}function Nt(G){G?K(n.SCISSOR_TEST):Me(n.SCISSOR_TEST)}function nt(G){G===void 0&&(G=n.TEXTURE0+te-1),de!==G&&(n.activeTexture(G),de=G)}function ut(G,Oe,Fe){Fe===void 0&&(de===null?Fe=n.TEXTURE0+te-1:Fe=de);let De=me[Fe];De===void 0&&(De={type:void 0,texture:void 0},me[Fe]=De),(De.type!==G||De.texture!==Oe)&&(de!==Fe&&(n.activeTexture(Fe),de=Fe),n.bindTexture(G,Oe||$[G]),De.type=G,De.texture=Oe)}function D(){const G=me[de];G!==void 0&&G.type!==void 0&&(n.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function A(){try{n.compressedTexImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function J(){try{n.compressedTexImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function ce(){try{n.texSubImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function pe(){try{n.texSubImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function Ke(){try{n.compressedTexSubImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function Le(){try{n.texStorage2D(...arguments)}catch(G){G("WebGLState:",G)}}function et(){try{n.texStorage3D(...arguments)}catch(G){G("WebGLState:",G)}}function He(){try{n.texImage2D(...arguments)}catch(G){G("WebGLState:",G)}}function xe(){try{n.texImage3D(...arguments)}catch(G){G("WebGLState:",G)}}function we(G){Ae.equals(G)===!1&&(n.scissor(G.x,G.y,G.z,G.w),Ae.copy(G))}function at(G){ye.equals(G)===!1&&(n.viewport(G.x,G.y,G.z,G.w),ye.copy(G))}function st(G,Oe){let Fe=h.get(Oe);Fe===void 0&&(Fe=new WeakMap,h.set(Oe,Fe));let De=Fe.get(G);De===void 0&&(De=n.getUniformBlockIndex(Oe,G.name),Fe.set(G,De))}function Ve(G,Oe){const De=h.get(Oe).get(G);c.get(Oe)!==De&&(n.uniformBlockBinding(Oe,De,G.__bindingPointIndex),c.set(Oe,De))}function ot(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},de=null,me={},f={},p=new WeakMap,m=[],x=null,M=!1,g=null,u=null,_=null,v=null,y=null,E=null,T=null,C=new rt(0,0,0),R=0,w=!1,S=null,L=null,F=null,W=null,Q=null,Ae.set(0,0,n.canvas.width,n.canvas.height),ye.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:Me,bindFramebuffer:be,drawBuffers:Ne,useProgram:je,setBlending:Lt,setMaterial:B,setFlipSided:mt,setCullFace:pt,setLineWidth:Dt,setPolygonOffset:Ze,setScissorTest:Nt,activeTexture:nt,bindTexture:ut,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:He,texImage3D:xe,updateUBOMapping:st,uniformBlockBinding:Ve,texStorage2D:Le,texStorage3D:et,texSubImage2D:ce,texSubImage3D:pe,compressedTexSubImage2D:re,compressedTexSubImage3D:Ke,scissor:we,viewport:at,reset:ot}}function ov(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Pe,d=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(D,A){return m?new OffscreenCanvas(D,A):ro("canvas")}function M(D,A,J){let ce=1;const pe=ut(D);if((pe.width>J||pe.height>J)&&(ce=J/Math.max(pe.width,pe.height)),ce<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const re=Math.floor(ce*pe.width),Ke=Math.floor(ce*pe.height);f===void 0&&(f=x(re,Ke));const Le=A?x(re,Ke):f;return Le.width=re,Le.height=Ke,Le.getContext("2d").drawImage(D,0,0,re,Ke),ft("WebGLRenderer: Texture has been resized from ("+pe.width+"x"+pe.height+") to ("+re+"x"+Ke+")."),Le}else return"data"in D&&ft("WebGLRenderer: Image in DataTexture is too big ("+pe.width+"x"+pe.height+")."),D;return D}function g(D){return D.generateMipmaps}function u(D){n.generateMipmap(D)}function _(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(D,A,J,ce,pe=!1){if(D!==null){if(n[D]!==void 0)return n[D];ft("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let re=A;if(A===n.RED&&(J===n.FLOAT&&(re=n.R32F),J===n.HALF_FLOAT&&(re=n.R16F),J===n.UNSIGNED_BYTE&&(re=n.R8)),A===n.RED_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.R8UI),J===n.UNSIGNED_SHORT&&(re=n.R16UI),J===n.UNSIGNED_INT&&(re=n.R32UI),J===n.BYTE&&(re=n.R8I),J===n.SHORT&&(re=n.R16I),J===n.INT&&(re=n.R32I)),A===n.RG&&(J===n.FLOAT&&(re=n.RG32F),J===n.HALF_FLOAT&&(re=n.RG16F),J===n.UNSIGNED_BYTE&&(re=n.RG8)),A===n.RG_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RG8UI),J===n.UNSIGNED_SHORT&&(re=n.RG16UI),J===n.UNSIGNED_INT&&(re=n.RG32UI),J===n.BYTE&&(re=n.RG8I),J===n.SHORT&&(re=n.RG16I),J===n.INT&&(re=n.RG32I)),A===n.RGB_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGB8UI),J===n.UNSIGNED_SHORT&&(re=n.RGB16UI),J===n.UNSIGNED_INT&&(re=n.RGB32UI),J===n.BYTE&&(re=n.RGB8I),J===n.SHORT&&(re=n.RGB16I),J===n.INT&&(re=n.RGB32I)),A===n.RGBA_INTEGER&&(J===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),J===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),J===n.UNSIGNED_INT&&(re=n.RGBA32UI),J===n.BYTE&&(re=n.RGBA8I),J===n.SHORT&&(re=n.RGBA16I),J===n.INT&&(re=n.RGBA32I)),A===n.RGB&&(J===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),J===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),A===n.RGBA){const Ke=pe?io:Rt.getTransfer(ce);J===n.FLOAT&&(re=n.RGBA32F),J===n.HALF_FLOAT&&(re=n.RGBA16F),J===n.UNSIGNED_BYTE&&(re=Ke===Bt?n.SRGB8_ALPHA8:n.RGBA8),J===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),J===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function y(D,A){let J;return D?A===null||A===ys||A===Kr?J=n.DEPTH24_STENCIL8:A===ci?J=n.DEPTH32F_STENCIL8:A===Zr&&(J=n.DEPTH24_STENCIL8,ft("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ys||A===Kr?J=n.DEPTH_COMPONENT24:A===ci?J=n.DEPTH_COMPONENT32F:A===Zr&&(J=n.DEPTH_COMPONENT16),J}function E(D,A){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==Fn&&D.minFilter!==Wn?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function T(D){const A=D.target;A.removeEventListener("dispose",T),R(A),A.isVideoTexture&&d.delete(A)}function C(D){const A=D.target;A.removeEventListener("dispose",C),S(A)}function R(D){const A=i.get(D);if(A.__webglInit===void 0)return;const J=D.source,ce=p.get(J);if(ce){const pe=ce[A.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&w(D),Object.keys(ce).length===0&&p.delete(J)}i.remove(D)}function w(D){const A=i.get(D);n.deleteTexture(A.__webglTexture);const J=D.source,ce=p.get(J);delete ce[A.__cacheKey],a.memory.textures--}function S(D){const A=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(A.__webglFramebuffer[ce]))for(let pe=0;pe<A.__webglFramebuffer[ce].length;pe++)n.deleteFramebuffer(A.__webglFramebuffer[ce][pe]);else n.deleteFramebuffer(A.__webglFramebuffer[ce]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ce])}else{if(Array.isArray(A.__webglFramebuffer))for(let ce=0;ce<A.__webglFramebuffer.length;ce++)n.deleteFramebuffer(A.__webglFramebuffer[ce]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ce=0;ce<A.__webglColorRenderbuffer.length;ce++)A.__webglColorRenderbuffer[ce]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ce]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=D.textures;for(let ce=0,pe=J.length;ce<pe;ce++){const re=i.get(J[ce]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),a.memory.textures--),i.remove(J[ce])}i.remove(D)}let L=0;function F(){L=0}function W(){const D=L;return D>=s.maxTextures&&ft("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function Q(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function te(D,A){const J=i.get(D);if(D.isVideoTexture&&Nt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const ce=D.image;if(ce===null)ft("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)ft("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,D,A);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,J.__webglTexture,n.TEXTURE0+A)}function q(D,A){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,J.__webglTexture,n.TEXTURE0+A)}function Z(D,A){const J=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}t.bindTexture(n.TEXTURE_3D,J.__webglTexture,n.TEXTURE0+A)}function ne(D,A){const J=i.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture,n.TEXTURE0+A)}const de={[Mn]:n.REPEAT,[Pi]:n.CLAMP_TO_EDGE,[Il]:n.MIRRORED_REPEAT},me={[Fn]:n.NEAREST,[Gf]:n.NEAREST_MIPMAP_NEAREST,[xa]:n.NEAREST_MIPMAP_LINEAR,[Wn]:n.LINEAR,[Do]:n.LINEAR_MIPMAP_NEAREST,[ps]:n.LINEAR_MIPMAP_LINEAR},Ge={[qf]:n.NEVER,[jf]:n.ALWAYS,[Yf]:n.LESS,[nu]:n.LEQUAL,[$f]:n.EQUAL,[Jf]:n.GEQUAL,[Zf]:n.GREATER,[Kf]:n.NOTEQUAL};function I(D,A){if(A.type===ci&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Wn||A.magFilter===Do||A.magFilter===xa||A.magFilter===ps||A.minFilter===Wn||A.minFilter===Do||A.minFilter===xa||A.minFilter===ps)&&ft("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,de[A.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,de[A.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,de[A.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,me[A.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,me[A.minFilter]),A.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Ge[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Fn||A.minFilter!==xa&&A.minFilter!==ps||A.type===ci&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Ae(D,A){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",T));const ce=A.source;let pe=p.get(ce);pe===void 0&&(pe={},p.set(ce,pe));const re=Q(A);if(re!==D.__cacheKey){pe[re]===void 0&&(pe[re]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,J=!0),pe[re].usedTimes++;const Ke=pe[D.__cacheKey];Ke!==void 0&&(pe[D.__cacheKey].usedTimes--,Ke.usedTimes===0&&w(A)),D.__cacheKey=re,D.__webglTexture=pe[re].texture}return J}function ye(D,A,J){return Math.floor(Math.floor(D/J)/A)}function Ce(D,A,J,ce){const re=D.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,J,ce,A.data);else{re.sort((xe,we)=>xe.start-we.start);let Ke=0;for(let xe=1;xe<re.length;xe++){const we=re[Ke],at=re[xe],st=we.start+we.count,Ve=ye(at.start,A.width,4),ot=ye(we.start,A.width,4);at.start<=st+1&&Ve===ot&&ye(at.start+at.count-1,A.width,4)===Ve?we.count=Math.max(we.count,at.start+at.count-we.start):(++Ke,re[Ke]=at)}re.length=Ke+1;const Le=n.getParameter(n.UNPACK_ROW_LENGTH),et=n.getParameter(n.UNPACK_SKIP_PIXELS),He=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let xe=0,we=re.length;xe<we;xe++){const at=re[xe],st=Math.floor(at.start/4),Ve=Math.ceil(at.count/4),ot=st%A.width,G=Math.floor(st/A.width),Oe=Ve,Fe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ot),n.pixelStorei(n.UNPACK_SKIP_ROWS,G),t.texSubImage2D(n.TEXTURE_2D,0,ot,G,Oe,Fe,J,ce,A.data)}D.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Le),n.pixelStorei(n.UNPACK_SKIP_PIXELS,et),n.pixelStorei(n.UNPACK_SKIP_ROWS,He)}}function $(D,A,J){let ce=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ce=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ce=n.TEXTURE_3D);const pe=Ae(D,A),re=A.source;t.bindTexture(ce,D.__webglTexture,n.TEXTURE0+J);const Ke=i.get(re);if(re.version!==Ke.__version||pe===!0){t.activeTexture(n.TEXTURE0+J);const Le=Rt.getPrimaries(Rt.workingColorSpace),et=A.colorSpace===Xi?null:Rt.getPrimaries(A.colorSpace),He=A.colorSpace===Xi||Le===et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let xe=M(A.image,!1,s.maxTextureSize);xe=nt(A,xe);const we=r.convert(A.format,A.colorSpace),at=r.convert(A.type);let st=v(A.internalFormat,we,at,A.colorSpace,A.isVideoTexture);I(ce,A);let Ve;const ot=A.mipmaps,G=A.isVideoTexture!==!0,Oe=Ke.__version===void 0||pe===!0,Fe=re.dataReady,De=E(A,xe);if(A.isDepthTexture)st=y(A.format===jr,A.type),Oe&&(G?t.texStorage2D(n.TEXTURE_2D,1,st,xe.width,xe.height):t.texImage2D(n.TEXTURE_2D,0,st,xe.width,xe.height,0,we,at,null));else if(A.isDataTexture)if(ot.length>0){G&&Oe&&t.texStorage2D(n.TEXTURE_2D,De,st,ot[0].width,ot[0].height);for(let Se=0,ue=ot.length;Se<ue;Se++)Ve=ot[Se],G?Fe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,Ve.width,Ve.height,we,at,Ve.data):t.texImage2D(n.TEXTURE_2D,Se,st,Ve.width,Ve.height,0,we,at,Ve.data);A.generateMipmaps=!1}else G?(Oe&&t.texStorage2D(n.TEXTURE_2D,De,st,xe.width,xe.height),Fe&&Ce(A,xe,we,at)):t.texImage2D(n.TEXTURE_2D,0,st,xe.width,xe.height,0,we,at,xe.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){G&&Oe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,De,st,ot[0].width,ot[0].height,xe.depth);for(let Se=0,ue=ot.length;Se<ue;Se++)if(Ve=ot[Se],A.format!==ei)if(we!==null)if(G){if(Fe)if(A.layerUpdates.size>0){const Xe=ed(Ve.width,Ve.height,A.format,A.type);for(const lt of A.layerUpdates){const Ut=Ve.data.subarray(lt*Xe/Ve.data.BYTES_PER_ELEMENT,(lt+1)*Xe/Ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,lt,Ve.width,Ve.height,1,we,Ut)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,0,Ve.width,Ve.height,xe.depth,we,Ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Se,st,Ve.width,Ve.height,xe.depth,0,Ve.data,0,0);else ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Fe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Se,0,0,0,Ve.width,Ve.height,xe.depth,we,at,Ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Se,st,Ve.width,Ve.height,xe.depth,0,we,at,Ve.data)}else{G&&Oe&&t.texStorage2D(n.TEXTURE_2D,De,st,ot[0].width,ot[0].height);for(let Se=0,ue=ot.length;Se<ue;Se++)Ve=ot[Se],A.format!==ei?we!==null?G?Fe&&t.compressedTexSubImage2D(n.TEXTURE_2D,Se,0,0,Ve.width,Ve.height,we,Ve.data):t.compressedTexImage2D(n.TEXTURE_2D,Se,st,Ve.width,Ve.height,0,Ve.data):ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Fe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,Ve.width,Ve.height,we,at,Ve.data):t.texImage2D(n.TEXTURE_2D,Se,st,Ve.width,Ve.height,0,we,at,Ve.data)}else if(A.isDataArrayTexture)if(G){if(Oe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,De,st,xe.width,xe.height,xe.depth),Fe)if(A.layerUpdates.size>0){const Se=ed(xe.width,xe.height,A.format,A.type);for(const ue of A.layerUpdates){const Xe=xe.data.subarray(ue*Se/xe.data.BYTES_PER_ELEMENT,(ue+1)*Se/xe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ue,xe.width,xe.height,1,we,at,Xe)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xe.width,xe.height,xe.depth,we,at,xe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,st,xe.width,xe.height,xe.depth,0,we,at,xe.data);else if(A.isData3DTexture)G?(Oe&&t.texStorage3D(n.TEXTURE_3D,De,st,xe.width,xe.height,xe.depth),Fe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xe.width,xe.height,xe.depth,we,at,xe.data)):t.texImage3D(n.TEXTURE_3D,0,st,xe.width,xe.height,xe.depth,0,we,at,xe.data);else if(A.isFramebufferTexture){if(Oe)if(G)t.texStorage2D(n.TEXTURE_2D,De,st,xe.width,xe.height);else{let Se=xe.width,ue=xe.height;for(let Xe=0;Xe<De;Xe++)t.texImage2D(n.TEXTURE_2D,Xe,st,Se,ue,0,we,at,null),Se>>=1,ue>>=1}}else if(ot.length>0){if(G&&Oe){const Se=ut(ot[0]);t.texStorage2D(n.TEXTURE_2D,De,st,Se.width,Se.height)}for(let Se=0,ue=ot.length;Se<ue;Se++)Ve=ot[Se],G?Fe&&t.texSubImage2D(n.TEXTURE_2D,Se,0,0,we,at,Ve):t.texImage2D(n.TEXTURE_2D,Se,st,we,at,Ve);A.generateMipmaps=!1}else if(G){if(Oe){const Se=ut(xe);t.texStorage2D(n.TEXTURE_2D,De,st,Se.width,Se.height)}Fe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,we,at,xe)}else t.texImage2D(n.TEXTURE_2D,0,st,we,at,xe);g(A)&&u(ce),Ke.__version=re.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function K(D,A,J){if(A.image.length!==6)return;const ce=Ae(D,A),pe=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+J);const re=i.get(pe);if(pe.version!==re.__version||ce===!0){t.activeTexture(n.TEXTURE0+J);const Ke=Rt.getPrimaries(Rt.workingColorSpace),Le=A.colorSpace===Xi?null:Rt.getPrimaries(A.colorSpace),et=A.colorSpace===Xi||Ke===Le?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const He=A.isCompressedTexture||A.image[0].isCompressedTexture,xe=A.image[0]&&A.image[0].isDataTexture,we=[];for(let ue=0;ue<6;ue++)!He&&!xe?we[ue]=M(A.image[ue],!0,s.maxCubemapSize):we[ue]=xe?A.image[ue].image:A.image[ue],we[ue]=nt(A,we[ue]);const at=we[0],st=r.convert(A.format,A.colorSpace),Ve=r.convert(A.type),ot=v(A.internalFormat,st,Ve,A.colorSpace),G=A.isVideoTexture!==!0,Oe=re.__version===void 0||ce===!0,Fe=pe.dataReady;let De=E(A,at);I(n.TEXTURE_CUBE_MAP,A);let Se;if(He){G&&Oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,De,ot,at.width,at.height);for(let ue=0;ue<6;ue++){Se=we[ue].mipmaps;for(let Xe=0;Xe<Se.length;Xe++){const lt=Se[Xe];A.format!==ei?st!==null?G?Fe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe,0,0,lt.width,lt.height,st,lt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe,ot,lt.width,lt.height,0,lt.data):ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe,0,0,lt.width,lt.height,st,Ve,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe,ot,lt.width,lt.height,0,st,Ve,lt.data)}}}else{if(Se=A.mipmaps,G&&Oe){Se.length>0&&De++;const ue=ut(we[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,De,ot,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(xe){G?Fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,we[ue].width,we[ue].height,st,Ve,we[ue].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,ot,we[ue].width,we[ue].height,0,st,Ve,we[ue].data);for(let Xe=0;Xe<Se.length;Xe++){const Ut=Se[Xe].image[ue].image;G?Fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe+1,0,0,Ut.width,Ut.height,st,Ve,Ut.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe+1,ot,Ut.width,Ut.height,0,st,Ve,Ut.data)}}else{G?Fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,st,Ve,we[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,ot,st,Ve,we[ue]);for(let Xe=0;Xe<Se.length;Xe++){const lt=Se[Xe];G?Fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe+1,0,0,st,Ve,lt.image[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Xe+1,ot,st,Ve,lt.image[ue])}}}g(A)&&u(n.TEXTURE_CUBE_MAP),re.__version=pe.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function Me(D,A,J,ce,pe,re){const Ke=r.convert(J.format,J.colorSpace),Le=r.convert(J.type),et=v(J.internalFormat,Ke,Le,J.colorSpace),He=i.get(A),xe=i.get(J);if(xe.__renderTarget=A,!He.__hasExternalTextures){const we=Math.max(1,A.width>>re),at=Math.max(1,A.height>>re);pe===n.TEXTURE_3D||pe===n.TEXTURE_2D_ARRAY?t.texImage3D(pe,re,et,we,at,A.depth,0,Ke,Le,null):t.texImage2D(pe,re,et,we,at,0,Ke,Le,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),Ze(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ce,pe,xe.__webglTexture,0,Dt(A)):(pe===n.TEXTURE_2D||pe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ce,pe,xe.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function be(D,A,J){if(n.bindRenderbuffer(n.RENDERBUFFER,D),A.depthBuffer){const ce=A.depthTexture,pe=ce&&ce.isDepthTexture?ce.type:null,re=y(A.stencilBuffer,pe),Ke=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Le=Dt(A);Ze(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Le,re,A.width,A.height):J?n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,re,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,re,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ke,n.RENDERBUFFER,D)}else{const ce=A.textures;for(let pe=0;pe<ce.length;pe++){const re=ce[pe],Ke=r.convert(re.format,re.colorSpace),Le=r.convert(re.type),et=v(re.internalFormat,Ke,Le,re.colorSpace),He=Dt(A);J&&Ze(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,He,et,A.width,A.height):Ze(A)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,He,et,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,et,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ne(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=i.get(A.depthTexture);ce.__renderTarget=A,(!ce.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),te(A.depthTexture,0);const pe=ce.__webglTexture,re=Dt(A);if(A.depthTexture.format===Jr)Ze(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,pe,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,pe,0);else if(A.depthTexture.format===jr)Ze(A)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,pe,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,pe,0);else throw new Error("Unknown depthTexture format")}function je(D){const A=i.get(D),J=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const ce=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ce){const pe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ce.removeEventListener("dispose",pe)};ce.addEventListener("dispose",pe),A.__depthDisposeCallback=pe}A.__boundDepthTexture=ce}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ce=D.texture.mipmaps;ce&&ce.length>0?Ne(A.__webglFramebuffer[0],D):Ne(A.__webglFramebuffer,D)}else if(J){A.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ce]),A.__webglDepthbuffer[ce]===void 0)A.__webglDepthbuffer[ce]=n.createRenderbuffer(),be(A.__webglDepthbuffer[ce],D,!1);else{const pe=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer[ce];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,re)}}else{const ce=D.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),be(A.__webglDepthbuffer,D,!1);else{const pe=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function It(D,A,J){const ce=i.get(D);A!==void 0&&Me(ce.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),J!==void 0&&je(D)}function Qe(D){const A=D.texture,J=i.get(D),ce=i.get(A);D.addEventListener("dispose",C);const pe=D.textures,re=D.isWebGLCubeRenderTarget===!0,Ke=pe.length>1;if(Ke||(ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture()),ce.__version=A.version,a.memory.textures++),re){J.__webglFramebuffer=[];for(let Le=0;Le<6;Le++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Le]=[];for(let et=0;et<A.mipmaps.length;et++)J.__webglFramebuffer[Le][et]=n.createFramebuffer()}else J.__webglFramebuffer[Le]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Le=0;Le<A.mipmaps.length;Le++)J.__webglFramebuffer[Le]=n.createFramebuffer()}else J.__webglFramebuffer=n.createFramebuffer();if(Ke)for(let Le=0,et=pe.length;Le<et;Le++){const He=i.get(pe[Le]);He.__webglTexture===void 0&&(He.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&Ze(D)===!1){J.__webglMultisampledFramebuffer=n.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Le=0;Le<pe.length;Le++){const et=pe[Le];J.__webglColorRenderbuffer[Le]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,J.__webglColorRenderbuffer[Le]);const He=r.convert(et.format,et.colorSpace),xe=r.convert(et.type),we=v(et.internalFormat,He,xe,et.colorSpace,D.isXRRenderTarget===!0),at=Dt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,at,we,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Le,n.RENDERBUFFER,J.__webglColorRenderbuffer[Le])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=n.createRenderbuffer(),be(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ce.__webglTexture),I(n.TEXTURE_CUBE_MAP,A);for(let Le=0;Le<6;Le++)if(A.mipmaps&&A.mipmaps.length>0)for(let et=0;et<A.mipmaps.length;et++)Me(J.__webglFramebuffer[Le][et],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Le,et);else Me(J.__webglFramebuffer[Le],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0);g(A)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ke){for(let Le=0,et=pe.length;Le<et;Le++){const He=pe[Le],xe=i.get(He);let we=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(we=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(we,xe.__webglTexture),I(we,He),Me(J.__webglFramebuffer,D,He,n.COLOR_ATTACHMENT0+Le,we,0),g(He)&&u(we)}t.unbindTexture()}else{let Le=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Le=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Le,ce.__webglTexture),I(Le,A),A.mipmaps&&A.mipmaps.length>0)for(let et=0;et<A.mipmaps.length;et++)Me(J.__webglFramebuffer[et],D,A,n.COLOR_ATTACHMENT0,Le,et);else Me(J.__webglFramebuffer,D,A,n.COLOR_ATTACHMENT0,Le,0);g(A)&&u(Le),t.unbindTexture()}D.depthBuffer&&je(D)}function Lt(D){const A=D.textures;for(let J=0,ce=A.length;J<ce;J++){const pe=A[J];if(g(pe)){const re=_(D),Ke=i.get(pe).__webglTexture;t.bindTexture(re,Ke),u(re),t.unbindTexture()}}}const B=[],mt=[];function pt(D){if(D.samples>0){if(Ze(D)===!1){const A=D.textures,J=D.width,ce=D.height;let pe=n.COLOR_BUFFER_BIT;const re=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ke=i.get(D),Le=A.length>1;if(Le)for(let He=0;He<A.length;He++)t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ke.__webglMultisampledFramebuffer);const et=D.texture.mipmaps;et&&et.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ke.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ke.__webglFramebuffer);for(let He=0;He<A.length;He++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(pe|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(pe|=n.STENCIL_BUFFER_BIT)),Le){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ke.__webglColorRenderbuffer[He]);const xe=i.get(A[He]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,xe,0)}n.blitFramebuffer(0,0,J,ce,0,0,J,ce,pe,n.NEAREST),c===!0&&(B.length=0,mt.length=0,B.push(n.COLOR_ATTACHMENT0+He),D.depthBuffer&&D.resolveDepthBuffer===!1&&(B.push(re),mt.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,mt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Le)for(let He=0;He<A.length;He++){t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.RENDERBUFFER,Ke.__webglColorRenderbuffer[He]);const xe=i.get(A[He]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ke.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.TEXTURE_2D,xe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ke.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const A=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Dt(D){return Math.min(s.maxSamples,D.samples)}function Ze(D){const A=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Nt(D){const A=a.render.frame;d.get(D)!==A&&(d.set(D,A),D.update())}function nt(D,A){const J=D.colorSpace,ce=D.format,pe=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==cr&&J!==Xi&&(Rt.getTransfer(J)===Bt?(ce!==ei||pe!==xi)&&ft("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):jt("WebGLTextures: Unsupported texture color space:",J)),A}function ut(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(h.width=D.naturalWidth||D.width,h.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(h.width=D.displayWidth,h.height=D.displayHeight):(h.width=D.width,h.height=D.height),h}this.allocateTextureUnit=W,this.resetTextureUnits=F,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=Z,this.setTextureCube=ne,this.rebindTextures=It,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=Lt,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=je,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Ze}function lv(n,e){function t(i,s=Xi){let r;const a=Rt.getTransfer(s);if(i===xi)return n.UNSIGNED_BYTE;if(i===Dc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ic)return n.UNSIGNED_SHORT_5_5_5_1;if(i===jd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Qd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Kd)return n.BYTE;if(i===Jd)return n.SHORT;if(i===Zr)return n.UNSIGNED_SHORT;if(i===Lc)return n.INT;if(i===ys)return n.UNSIGNED_INT;if(i===ci)return n.FLOAT;if(i===fi)return n.HALF_FLOAT;if(i===eu)return n.ALPHA;if(i===tu)return n.RGB;if(i===ei)return n.RGBA;if(i===Jr)return n.DEPTH_COMPONENT;if(i===jr)return n.DEPTH_STENCIL;if(i===Uc)return n.RED;if(i===Fc)return n.RED_INTEGER;if(i===Nc)return n.RG;if(i===zc)return n.RG_INTEGER;if(i===Oc)return n.RGBA_INTEGER;if(i===Ka||i===Ja||i===ja||i===Qa)if(a===Bt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ka)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ka)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ja)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Qa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ul||i===Fl||i===Nl||i===zl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ul)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Nl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===zl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ol||i===Bl||i===kl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ol||i===Bl)return a===Bt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===kl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Vl||i===Gl||i===Hl||i===Wl||i===Xl||i===ql||i===Yl||i===$l||i===Zl||i===Kl||i===Jl||i===jl||i===Ql||i===ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Vl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Gl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Hl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Wl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Xl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ql)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===$l)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Zl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Kl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Jl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jl)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ql)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ec)return a===Bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===tc||i===nc||i===ic)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===tc)return a===Bt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sc||i===rc||i===ac||i===oc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ac)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===oc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Kr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const cv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hv=`
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

}`;class dv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new mu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new fn({vertexShader:cv,fragmentShader:hv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new O(new Wt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class uv extends fr{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,h=null,d=null,f=null,p=null,m=null,x=null;const M=typeof XRWebGLBinding<"u",g=new dv,u={},_=t.getContextAttributes();let v=null,y=null;const E=[],T=[],C=new Pe;let R=null;const w=new Dn;w.viewport=new Gt;const S=new Dn;S.viewport=new Gt;const L=[w,S],F=new Pp;let W=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new Qo,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new Qo,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new Qo,E[$]=K),K.getHandSpace()};function te($){const K=T.indexOf($.inputSource);if(K===-1)return;const Me=E[K];Me!==void 0&&(Me.update($.inputSource,$.frame,h||a),Me.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}W=null,Q=null,g.reset();for(const $ in u)delete u[$];e.setRenderTarget(v),m=null,p=null,f=null,s=null,y=null,Ce.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&ft("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&ft("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),_.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,be=null,Ne=null;_.depth&&(Ne=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=_.stencil?jr:Jr,be=_.stencil?Kr:ys);const je={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:r};f=this.getBinding(),p=f.createProjectionLayer(je),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),y=new ni(p.textureWidth,p.textureHeight,{format:ei,type:xi,depthTexture:new pu(p.textureWidth,p.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const Me={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Me),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new ni(m.framebufferWidth,m.framebufferHeight,{format:ei,type:xi,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),Ce.setContext(s),Ce.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z($){for(let K=0;K<$.removed.length;K++){const Me=$.removed[K],be=T.indexOf(Me);be>=0&&(T[be]=null,E[be].disconnect(Me))}for(let K=0;K<$.added.length;K++){const Me=$.added[K];let be=T.indexOf(Me);if(be===-1){for(let je=0;je<E.length;je++)if(je>=T.length){T.push(Me),be=je;break}else if(T[je]===null){T[je]=Me,be=je;break}if(be===-1)break}const Ne=E[be];Ne&&Ne.connect(Me)}}const ne=new P,de=new P;function me($,K,Me){ne.setFromMatrixPosition(K.matrixWorld),de.setFromMatrixPosition(Me.matrixWorld);const be=ne.distanceTo(de),Ne=K.projectionMatrix.elements,je=Me.projectionMatrix.elements,It=Ne[14]/(Ne[10]-1),Qe=Ne[14]/(Ne[10]+1),Lt=(Ne[9]+1)/Ne[5],B=(Ne[9]-1)/Ne[5],mt=(Ne[8]-1)/Ne[0],pt=(je[8]+1)/je[0],Dt=It*mt,Ze=It*pt,Nt=be/(-mt+pt),nt=Nt*-mt;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(nt),$.translateZ(Nt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ne[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ut=It+Nt,D=Qe+Nt,A=Dt-nt,J=Ze+(be-nt),ce=Lt*Qe/D*ut,pe=B*Qe/D*ut;$.projectionMatrix.makePerspective(A,J,ce,pe,ut,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ge($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,Me=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(Me=g.depthFar)),F.near=S.near=w.near=K,F.far=S.far=w.far=Me,(W!==F.near||Q!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),W=F.near,Q=F.far),F.layers.mask=$.layers.mask|6,w.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const be=$.parent,Ne=F.cameras;Ge(F,be);for(let je=0;je<Ne.length;je++)Ge(Ne[je],be);Ne.length===2?me(F,w,S):F.projectionMatrix.copy(w.projectionMatrix),I($,F,be)};function I($,K,Me){Me===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(Me.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ea*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function($){return u[$]};let Ae=null;function ye($,K){if(d=K.getViewerPose(h||a),x=K,d!==null){const Me=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let be=!1;Me.length!==F.cameras.length&&(F.cameras.length=0,be=!0);for(let Qe=0;Qe<Me.length;Qe++){const Lt=Me[Qe];let B=null;if(m!==null)B=m.getViewport(Lt);else{const pt=f.getViewSubImage(p,Lt);B=pt.viewport,Qe===0&&(e.setRenderTargetTextures(y,pt.colorTexture,pt.depthStencilTexture),e.setRenderTarget(y))}let mt=L[Qe];mt===void 0&&(mt=new Dn,mt.layers.enable(Qe),mt.viewport=new Gt,L[Qe]=mt),mt.matrix.fromArray(Lt.transform.matrix),mt.matrix.decompose(mt.position,mt.quaternion,mt.scale),mt.projectionMatrix.fromArray(Lt.projectionMatrix),mt.projectionMatrixInverse.copy(mt.projectionMatrix).invert(),mt.viewport.set(B.x,B.y,B.width,B.height),Qe===0&&(F.matrix.copy(mt.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),be===!0&&F.cameras.push(mt)}const Ne=s.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=i.getBinding();const Qe=f.getDepthInformation(Me[0]);Qe&&Qe.isValid&&Qe.texture&&g.init(Qe,s.renderState)}if(Ne&&Ne.includes("camera-access")&&M){e.state.unbindTexture(),f=i.getBinding();for(let Qe=0;Qe<Me.length;Qe++){const Lt=Me[Qe].camera;if(Lt){let B=u[Lt];B||(B=new mu,u[Lt]=B);const mt=f.getCameraImage(Lt);B.sourceTexture=mt}}}}for(let Me=0;Me<E.length;Me++){const be=T[Me],Ne=E[Me];be!==null&&Ne!==void 0&&Ne.update(be,K,h||a)}Ae&&Ae($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Ce=new Eu;Ce.setAnimationLoop(ye),this.setAnimationLoop=function($){Ae=$},this.dispose=function(){}}}const os=new ii,fv=new At;function pv(n,e){function t(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function i(g,u){u.color.getRGB(g.fogColor.value,lu(n)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function s(g,u,_,v,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(g,u):u.isMeshToonMaterial?(r(g,u),f(g,u)):u.isMeshPhongMaterial?(r(g,u),d(g,u)):u.isMeshStandardMaterial?(r(g,u),p(g,u),u.isMeshPhysicalMaterial&&m(g,u,y)):u.isMeshMatcapMaterial?(r(g,u),x(g,u)):u.isMeshDepthMaterial?r(g,u):u.isMeshDistanceMaterial?(r(g,u),M(g,u)):u.isMeshNormalMaterial?r(g,u):u.isLineBasicMaterial?(a(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?c(g,u,_,v):u.isSpriteMaterial?h(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,t(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===vn&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,t(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===vn&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,t(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,t(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const _=e.get(u),v=_.envMap,y=_.envMapRotation;v&&(g.envMap.value=v,os.copy(y),os.x*=-1,os.y*=-1,os.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),g.envMapRotation.value.setFromMatrix4(fv.makeRotationFromEuler(os)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,g.aoMapTransform))}function a(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function c(g,u,_,v){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*_,g.scale.value=v*.5,u.map&&(g.map.value=u.map,t(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function d(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function f(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function p(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function m(g,u,_){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===vn&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function M(g,u){const _=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function mv(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,v){const y=v.program;i.uniformBlockBinding(_,y)}function h(_,v){let y=s[_.id];y===void 0&&(x(_),y=d(_),s[_.id]=y,_.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(_,E);const T=e.render.frame;r[_.id]!==T&&(p(_),r[_.id]=T)}function d(_){const v=f();_.__bindingPointIndex=v;const y=n.createBuffer(),E=_.__size,T=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,y),y}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return jt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(_){const v=s[_.id],y=_.uniforms,E=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,C=y.length;T<C;T++){const R=Array.isArray(y[T])?y[T]:[y[T]];for(let w=0,S=R.length;w<S;w++){const L=R[w];if(m(L,T,w,E)===!0){const F=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let Q=0;for(let te=0;te<W.length;te++){const q=W[te],Z=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,F+Q,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,Q),Q+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(_,v,y,E){const T=_.value,C=v+"_"+y;if(E[C]===void 0)return typeof T=="number"||typeof T=="boolean"?E[C]=T:E[C]=T.clone(),!0;{const R=E[C];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[C]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function x(_){const v=_.uniforms;let y=0;const E=16;for(let C=0,R=v.length;C<R;C++){const w=Array.isArray(v[C])?v[C]:[v[C]];for(let S=0,L=w.length;S<L;S++){const F=w[S],W=Array.isArray(F.value)?F.value:[F.value];for(let Q=0,te=W.length;Q<te;Q++){const q=W[Q],Z=M(q),ne=y%E,de=ne%Z.boundary,me=ne+de;y+=de,me!==0&&E-me<Z.storage&&(y+=E-me),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Z.storage}}}const T=y%E;return T>0&&(y+=E-T),_.__size=y,_.__cache={},this}function M(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?ft("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ft("WebGLRenderer: Unsupported uniform value type.",_),v}function g(_){const v=_.target;v.removeEventListener("dispose",g);const y=a.indexOf(v.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function u(){for(const _ in s)n.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:c,update:h,dispose:u}}const xv=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let wi=null;function gv(){return wi===null&&(wi=new fu(xv,32,32,Nc,fi),wi.minFilter=Wn,wi.magFilter=Wn,wi.wrapS=Pi,wi.wrapT=Pi,wi.generateMipmaps=!1,wi.needsUpdate=!0),wi}class vv{constructor(e={}){const{canvas:t=Qf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const x=new Set([Oc,zc,Fc]),M=new Set([xi,ys,Zr,Kr,Dc,Ic]),g=new Uint32Array(4),u=new Int32Array(4);let _=null,v=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let C=!1;this._outputColorSpace=Et;let R=0,w=0,S=null,L=-1,F=null;const W=new Gt,Q=new Gt;let te=null;const q=new rt(0);let Z=0,ne=t.width,de=t.height,me=1,Ge=null,I=null;const Ae=new Gt(0,0,ne,de),ye=new Gt(0,0,ne,de);let Ce=!1;const $=new qc;let K=!1,Me=!1;const be=new At,Ne=new P,je=new Gt,It={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Qe=!1;function Lt(){return S===null?me:1}let B=i;function mt(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Cc}`),t.addEventListener("webglcontextlost",Se,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",Xe,!1),B===null){const U="webgl2";if(B=mt(U,b),B===null)throw mt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw b("WebGLRenderer: "+b.message),b}let pt,Dt,Ze,Nt,nt,ut,D,A,J,ce,pe,re,Ke,Le,et,He,xe,we,at,st,Ve,ot,G,Oe;function Fe(){pt=new Eg(B),pt.init(),ot=new lv(B,pt),Dt=new gg(B,pt,e,ot),Ze=new av(B,pt),Dt.reversedDepthBuffer&&p&&Ze.buffers.depth.setReversed(!0),Nt=new Rg(B),nt=new Y1,ut=new ov(B,pt,Ze,nt,Dt,ot,Nt),D=new _g(T),A=new Tg(T),J=new Ip(B),G=new mg(B,J),ce=new Ag(B,J,Nt,G),pe=new Lg(B,ce,J,Nt),at=new Pg(B,Dt,ut),He=new vg(nt),re=new q1(T,D,A,pt,Dt,G,He),Ke=new pv(T,nt),Le=new Z1,et=new tv(pt),we=new pg(T,D,A,Ze,pe,m,c),xe=new sv(T,pe,Dt),Oe=new mv(B,Nt,Dt,Ze),st=new xg(B,pt,Nt),Ve=new Cg(B,pt,Nt),Nt.programs=re.programs,T.capabilities=Dt,T.extensions=pt,T.properties=nt,T.renderLists=Le,T.shadowMap=xe,T.state=Ze,T.info=Nt}Fe();const De=new uv(T,B);this.xr=De,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const b=pt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=pt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return me},this.setPixelRatio=function(b){b!==void 0&&(me=b,this.setSize(ne,de,!1))},this.getSize=function(b){return b.set(ne,de)},this.setSize=function(b,U,V=!0){if(De.isPresenting){ft("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=b,de=U,t.width=Math.floor(b*me),t.height=Math.floor(U*me),V===!0&&(t.style.width=b+"px",t.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(ne*me,de*me).floor()},this.setDrawingBufferSize=function(b,U,V){ne=b,de=U,me=V,t.width=Math.floor(b*V),t.height=Math.floor(U*V),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(W)},this.getViewport=function(b){return b.copy(Ae)},this.setViewport=function(b,U,V,X){b.isVector4?Ae.set(b.x,b.y,b.z,b.w):Ae.set(b,U,V,X),Ze.viewport(W.copy(Ae).multiplyScalar(me).round())},this.getScissor=function(b){return b.copy(ye)},this.setScissor=function(b,U,V,X){b.isVector4?ye.set(b.x,b.y,b.z,b.w):ye.set(b,U,V,X),Ze.scissor(Q.copy(ye).multiplyScalar(me).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(b){Ze.setScissorTest(Ce=b)},this.setOpaqueSort=function(b){Ge=b},this.setTransparentSort=function(b){I=b},this.getClearColor=function(b){return b.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,V=!0){let X=0;if(b){let k=!1;if(S!==null){const oe=S.texture.format;k=x.has(oe)}if(k){const oe=S.texture.type,ae=M.has(oe),j=we.getClearColor(),he=we.getClearAlpha(),Te=j.r,ze=j.g,Ee=j.b;ae?(g[0]=Te,g[1]=ze,g[2]=Ee,g[3]=he,B.clearBufferuiv(B.COLOR,0,g)):(u[0]=Te,u[1]=ze,u[2]=Ee,u[3]=he,B.clearBufferiv(B.COLOR,0,u))}else X|=B.COLOR_BUFFER_BIT}U&&(X|=B.DEPTH_BUFFER_BIT),V&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Se,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",Xe,!1),we.dispose(),Le.dispose(),et.dispose(),nt.dispose(),D.dispose(),A.dispose(),pe.dispose(),G.dispose(),Oe.dispose(),re.dispose(),De.dispose(),De.removeEventListener("sessionstart",fa),De.removeEventListener("sessionend",vr),si.stop()};function Se(b){b.preventDefault(),ao("WebGLRenderer: Context Lost."),C=!0}function ue(){ao("WebGLRenderer: Context Restored."),C=!1;const b=Nt.autoReset,U=xe.enabled,V=xe.autoUpdate,X=xe.needsUpdate,k=xe.type;Fe(),Nt.autoReset=b,xe.enabled=U,xe.autoUpdate=V,xe.needsUpdate=X,xe.type=k}function Xe(b){jt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function lt(b){const U=b.target;U.removeEventListener("dispose",lt),Ut(U)}function Ut(b){Ct(b),nt.remove(b)}function Ct(b){const U=nt.get(b).programs;U!==void 0&&(U.forEach(function(V){re.releaseProgram(V)}),b.isShaderMaterial&&re.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,V,X,k,oe){U===null&&(U=It);const ae=k.isMesh&&k.matrixWorld.determinant()<0,j=N(b,U,V,X,k);Ze.setMaterial(X,ae);let he=V.index,Te=1;if(X.wireframe===!0){if(he=ce.getWireframeAttribute(V),he===void 0)return;Te=2}const ze=V.drawRange,Ee=V.attributes.position;let Ie=ze.start*Te,ct=(ze.start+ze.count)*Te;oe!==null&&(Ie=Math.max(Ie,oe.start*Te),ct=Math.min(ct,(oe.start+oe.count)*Te)),he!==null?(Ie=Math.max(Ie,0),ct=Math.min(ct,he.count)):Ee!=null&&(Ie=Math.max(Ie,0),ct=Math.min(ct,Ee.count));const gt=ct-Ie;if(gt<0||gt===1/0)return;G.setup(k,X,j,V,he);let bt,vt=st;if(he!==null&&(bt=J.get(he),vt=Ve,vt.setIndex(bt)),k.isMesh)X.wireframe===!0?(Ze.setLineWidth(X.wireframeLinewidth*Lt()),vt.setMode(B.LINES)):vt.setMode(B.TRIANGLES);else if(k.isLine){let We=X.linewidth;We===void 0&&(We=1),Ze.setLineWidth(We*Lt()),k.isLineSegments?vt.setMode(B.LINES):k.isLineLoop?vt.setMode(B.LINE_LOOP):vt.setMode(B.LINE_STRIP)}else k.isPoints?vt.setMode(B.POINTS):k.isSprite&&vt.setMode(B.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),vt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(pt.get("WEBGL_multi_draw"))vt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const We=k._multiDrawStarts,wt=k._multiDrawCounts,ht=k._multiDrawCount,qt=he?J.get(he).bytesPerElement:1,vi=nt.get(X).currentProgram.getUniforms();for(let Kt=0;Kt<ht;Kt++)vi.setValue(B,"_gl_DrawID",Kt),vt.render(We[Kt]/qt,wt[Kt])}else if(k.isInstancedMesh)vt.renderInstances(Ie,gt,k.count);else if(V.isInstancedBufferGeometry){const We=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,wt=Math.min(V.instanceCount,We);vt.renderInstances(Ie,gt,wt)}else vt.render(Ie,gt)};function yn(b,U,V){b.transparent===!0&&b.side===xt&&b.forceSinglePass===!1?(b.side=vn,b.needsUpdate=!0,sn(b,U,V),b.side=Qi,b.needsUpdate=!0,sn(b,U,V),b.side=xt):sn(b,U,V)}this.compile=function(b,U,V=null){V===null&&(V=b),v=et.get(V),v.init(U),E.push(v),V.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),b!==V&&b.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),v.setupLights();const X=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const oe=k.material;if(oe)if(Array.isArray(oe))for(let ae=0;ae<oe.length;ae++){const j=oe[ae];yn(j,V,k),X.add(j)}else yn(oe,V,k),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(b,U,V=null){const X=this.compile(b,U,V);return new Promise(k=>{function oe(){if(X.forEach(function(ae){nt.get(ae).currentProgram.isReady()&&X.delete(ae)}),X.size===0){k(b);return}setTimeout(oe,10)}pt.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let pn=null;function qn(b){pn&&pn(b)}function fa(){si.stop()}function vr(){si.start()}const si=new Eu;si.setAnimationLoop(qn),typeof self<"u"&&si.setContext(self),this.setAnimationLoop=function(b){pn=b,De.setAnimationLoop(b),b===null?si.stop():si.start()},De.addEventListener("sessionstart",fa),De.addEventListener("sessionend",vr),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),De.enabled===!0&&De.isPresenting===!0&&(De.cameraAutoUpdate===!0&&De.updateCamera(U),U=De.getCamera()),b.isScene===!0&&b.onBeforeRender(T,b,U,S),v=et.get(b,E.length),v.init(U),E.push(v),be.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),$.setFromProjectionMatrix(be,hi,U.reversedDepth),Me=this.localClippingEnabled,K=He.init(this.clippingPlanes,Me),_=Le.get(b,y.length),_.init(),y.push(_),De.enabled===!0&&De.isPresenting===!0){const oe=T.xr.getDepthSensingMesh();oe!==null&&ri(oe,U,-1/0,T.sortObjects)}ri(b,U,0,T.sortObjects),_.finish(),T.sortObjects===!0&&_.sort(Ge,I),Qe=De.enabled===!1||De.isPresenting===!1||De.hasDepthSensing()===!1,Qe&&we.addToRenderList(_,b),this.info.render.frame++,K===!0&&He.beginShadows();const V=v.state.shadowsArray;xe.render(V,b,U),K===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=_.opaque,k=_.transmissive;if(v.setupLights(),U.isArrayCamera){const oe=U.cameras;if(k.length>0)for(let ae=0,j=oe.length;ae<j;ae++){const he=oe[ae];_r(X,k,b,he)}Qe&&we.render(b);for(let ae=0,j=oe.length;ae<j;ae++){const he=oe[ae];ai(_,b,he,he.viewport)}}else k.length>0&&_r(X,k,b,U),Qe&&we.render(b),ai(_,b,U);S!==null&&w===0&&(ut.updateMultisampleRenderTarget(S),ut.updateRenderTargetMipmap(S)),b.isScene===!0&&b.onAfterRender(T,b,U),G.resetDefaultState(),L=-1,F=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&He.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,y.pop(),y.length>0?_=y[y.length-1]:_=null};function ri(b,U,V,X){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)V=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)v.pushLight(b),b.castShadow&&v.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||$.intersectsSprite(b)){X&&je.setFromMatrixPosition(b.matrixWorld).applyMatrix4(be);const ae=pe.update(b),j=b.material;j.visible&&_.push(b,ae,j,V,je.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||$.intersectsObject(b))){const ae=pe.update(b),j=b.material;if(X&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),je.copy(b.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),je.copy(ae.boundingSphere.center)),je.applyMatrix4(b.matrixWorld).applyMatrix4(be)),Array.isArray(j)){const he=ae.groups;for(let Te=0,ze=he.length;Te<ze;Te++){const Ee=he[Te],Ie=j[Ee.materialIndex];Ie&&Ie.visible&&_.push(b,ae,Ie,V,je.z,Ee)}}else j.visible&&_.push(b,ae,j,V,je.z,null)}}const oe=b.children;for(let ae=0,j=oe.length;ae<j;ae++)ri(oe[ae],U,V,X)}function ai(b,U,V,X){const{opaque:k,transmissive:oe,transparent:ae}=b;v.setupLightsView(V),K===!0&&He.setGlobalState(T.clippingPlanes,V),X&&Ze.viewport(W.copy(X)),k.length>0&&Ls(k,U,V),oe.length>0&&Ls(oe,U,V),ae.length>0&&Ls(ae,U,V),Ze.buffers.depth.setTest(!0),Ze.buffers.depth.setMask(!0),Ze.buffers.color.setMask(!0),Ze.setPolygonOffset(!1)}function _r(b,U,V,X){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new ni(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float")?fi:xi,minFilter:ps,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Rt.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],ae=X.viewport||W;oe.setSize(ae.z*T.transmissionResolutionScale,ae.w*T.transmissionResolutionScale);const j=T.getRenderTarget(),he=T.getActiveCubeFace(),Te=T.getActiveMipmapLevel();T.setRenderTarget(oe),T.getClearColor(q),Z=T.getClearAlpha(),Z<1&&T.setClearColor(16777215,.5),T.clear(),Qe&&we.render(V);const ze=T.toneMapping;T.toneMapping=Zi;const Ee=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),K===!0&&He.setGlobalState(T.clippingPlanes,X),Ls(b,V,X),ut.updateMultisampleRenderTarget(oe),ut.updateRenderTargetMipmap(oe),pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let ct=0,gt=U.length;ct<gt;ct++){const bt=U[ct],{object:vt,geometry:We,material:wt,group:ht}=bt;if(wt.side===xt&&vt.layers.test(X.layers)){const qt=wt.side;wt.side=vn,wt.needsUpdate=!0,pa(vt,V,X,We,wt,ht),wt.side=qt,wt.needsUpdate=!0,Ie=!0}}Ie===!0&&(ut.updateMultisampleRenderTarget(oe),ut.updateRenderTargetMipmap(oe))}T.setRenderTarget(j,he,Te),T.setClearColor(q,Z),Ee!==void 0&&(X.viewport=Ee),T.toneMapping=ze}function Ls(b,U,V){const X=U.isScene===!0?U.overrideMaterial:null;for(let k=0,oe=b.length;k<oe;k++){const ae=b[k],{object:j,geometry:he,group:Te}=ae;let ze=ae.material;ze.allowOverride===!0&&X!==null&&(ze=X),j.layers.test(V.layers)&&pa(j,U,V,he,ze,Te)}}function pa(b,U,V,X,k,oe){b.onBeforeRender(T,U,V,X,k,oe),b.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(T,U,V,X,b,oe),k.transparent===!0&&k.side===xt&&k.forceSinglePass===!1?(k.side=vn,k.needsUpdate=!0,T.renderBufferDirect(V,U,X,k,b,oe),k.side=Qi,k.needsUpdate=!0,T.renderBufferDirect(V,U,X,k,b,oe),k.side=xt):T.renderBufferDirect(V,U,X,k,b,oe),b.onAfterRender(T,U,V,X,k,oe)}function sn(b,U,V){U.isScene!==!0&&(U=It);const X=nt.get(b),k=v.state.lights,oe=v.state.shadowsArray,ae=k.state.version,j=re.getParameters(b,k.state,oe,U,V),he=re.getProgramCacheKey(j);let Te=X.programs;X.environment=b.isMeshStandardMaterial?U.environment:null,X.fog=U.fog,X.envMap=(b.isMeshStandardMaterial?A:D).get(b.envMap||X.environment),X.envMapRotation=X.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Te===void 0&&(b.addEventListener("dispose",lt),Te=new Map,X.programs=Te);let ze=Te.get(he);if(ze!==void 0){if(X.currentProgram===ze&&X.lightsStateVersion===ae)return Mr(b,j),ze}else j.uniforms=re.getUniforms(b),b.onBeforeCompile(j,T),ze=re.acquireProgram(j,he),Te.set(he,ze),X.uniforms=j.uniforms;const Ee=X.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ee.clippingPlanes=He.uniform),Mr(b,j),X.needsLights=Y(b),X.lightsStateVersion=ae,X.needsLights&&(Ee.ambientLightColor.value=k.state.ambient,Ee.lightProbe.value=k.state.probe,Ee.directionalLights.value=k.state.directional,Ee.directionalLightShadows.value=k.state.directionalShadow,Ee.spotLights.value=k.state.spot,Ee.spotLightShadows.value=k.state.spotShadow,Ee.rectAreaLights.value=k.state.rectArea,Ee.ltc_1.value=k.state.rectAreaLTC1,Ee.ltc_2.value=k.state.rectAreaLTC2,Ee.pointLights.value=k.state.point,Ee.pointLightShadows.value=k.state.pointShadow,Ee.hemisphereLights.value=k.state.hemi,Ee.directionalShadowMap.value=k.state.directionalShadowMap,Ee.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ee.spotShadowMap.value=k.state.spotShadowMap,Ee.spotLightMatrix.value=k.state.spotLightMatrix,Ee.spotLightMap.value=k.state.spotLightMap,Ee.pointShadowMap.value=k.state.pointShadowMap,Ee.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=ze,X.uniformsList=null,ze}function ma(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=eo.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Mr(b,U){const V=nt.get(b);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function N(b,U,V,X,k){U.isScene!==!0&&(U=It),ut.resetTextureUnits();const oe=U.fog,ae=X.isMeshStandardMaterial?U.environment:null,j=S===null?T.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:cr,he=(X.isMeshStandardMaterial?A:D).get(X.envMap||ae),Te=X.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,ze=!!V.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ee=!!V.morphAttributes.position,Ie=!!V.morphAttributes.normal,ct=!!V.morphAttributes.color;let gt=Zi;X.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(gt=T.toneMapping);const bt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,vt=bt!==void 0?bt.length:0,We=nt.get(X),wt=v.state.lights;if(K===!0&&(Me===!0||b!==F)){const Sn=b===F&&X.id===L;He.setState(X,b,Sn)}let ht=!1;X.version===We.__version?(We.needsLights&&We.lightsStateVersion!==wt.state.version||We.outputColorSpace!==j||k.isBatchedMesh&&We.batching===!1||!k.isBatchedMesh&&We.batching===!0||k.isBatchedMesh&&We.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&We.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&We.instancing===!1||!k.isInstancedMesh&&We.instancing===!0||k.isSkinnedMesh&&We.skinning===!1||!k.isSkinnedMesh&&We.skinning===!0||k.isInstancedMesh&&We.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&We.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&We.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&We.instancingMorph===!1&&k.morphTexture!==null||We.envMap!==he||X.fog===!0&&We.fog!==oe||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==He.numPlanes||We.numIntersection!==He.numIntersection)||We.vertexAlphas!==Te||We.vertexTangents!==ze||We.morphTargets!==Ee||We.morphNormals!==Ie||We.morphColors!==ct||We.toneMapping!==gt||We.morphTargetsCount!==vt)&&(ht=!0):(ht=!0,We.__version=X.version);let qt=We.currentProgram;ht===!0&&(qt=sn(X,U,k));let vi=!1,Kt=!1,Bn=!1;const zt=qt.getUniforms(),rn=We.uniforms;if(Ze.useProgram(qt.program)&&(vi=!0,Kt=!0,Bn=!0),X.id!==L&&(L=X.id,Kt=!0),vi||F!==b){Ze.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),zt.setValue(B,"projectionMatrix",b.projectionMatrix),zt.setValue(B,"viewMatrix",b.matrixWorldInverse);const En=zt.map.cameraPosition;En!==void 0&&En.setValue(B,Ne.setFromMatrixPosition(b.matrixWorld)),Dt.logarithmicDepthBuffer&&zt.setValue(B,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&zt.setValue(B,"isOrthographic",b.isOrthographicCamera===!0),F!==b&&(F=b,Kt=!0,Bn=!0)}if(k.isSkinnedMesh){zt.setOptional(B,k,"bindMatrix"),zt.setOptional(B,k,"bindMatrixInverse");const Sn=k.skeleton;Sn&&(Sn.boneTexture===null&&Sn.computeBoneTexture(),zt.setValue(B,"boneTexture",Sn.boneTexture,ut))}k.isBatchedMesh&&(zt.setOptional(B,k,"batchingTexture"),zt.setValue(B,"batchingTexture",k._matricesTexture,ut),zt.setOptional(B,k,"batchingIdTexture"),zt.setValue(B,"batchingIdTexture",k._indirectTexture,ut),zt.setOptional(B,k,"batchingColorTexture"),k._colorsTexture!==null&&zt.setValue(B,"batchingColorTexture",k._colorsTexture,ut));const kn=V.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&at.update(k,V,qt),(Kt||We.receiveShadow!==k.receiveShadow)&&(We.receiveShadow=k.receiveShadow,zt.setValue(B,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(rn.envMap.value=he,rn.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&U.environment!==null&&(rn.envMapIntensity.value=U.environmentIntensity),rn.dfgLUT!==void 0&&(rn.dfgLUT.value=gv()),Kt&&(zt.setValue(B,"toneMappingExposure",T.toneMappingExposure),We.needsLights&&z(rn,Bn),oe&&X.fog===!0&&Ke.refreshFogUniforms(rn,oe),Ke.refreshMaterialUniforms(rn,X,me,de,v.state.transmissionRenderTarget[b.id]),eo.upload(B,ma(We),rn,ut)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(eo.upload(B,ma(We),rn,ut),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&zt.setValue(B,"center",k.center),zt.setValue(B,"modelViewMatrix",k.modelViewMatrix),zt.setValue(B,"normalMatrix",k.normalMatrix),zt.setValue(B,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Sn=X.uniformsGroups;for(let En=0,Lo=Sn.length;En<Lo;En++){const ts=Sn[En];Oe.update(ts,qt),Oe.bind(ts,qt)}}return qt}function z(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Y(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(b,U,V){const X=nt.get(b);X.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),nt.get(b.texture).__webglTexture=U,nt.get(b.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:V,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const V=nt.get(b);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0};const ee=B.createFramebuffer();this.setRenderTarget=function(b,U=0,V=0){S=b,R=U,w=V;let X=!0,k=null,oe=!1,ae=!1;if(b){const he=nt.get(b);if(he.__useDefaultFramebuffer!==void 0)Ze.bindFramebuffer(B.FRAMEBUFFER,null),X=!1;else if(he.__webglFramebuffer===void 0)ut.setupRenderTarget(b);else if(he.__hasExternalTextures)ut.rebindTextures(b,nt.get(b.texture).__webglTexture,nt.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ee=b.depthTexture;if(he.__boundDepthTexture!==Ee){if(Ee!==null&&nt.has(Ee)&&(b.width!==Ee.image.width||b.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(b)}}const Te=b.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(ae=!0);const ze=nt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ze[U])?k=ze[U][V]:k=ze[U],oe=!0):b.samples>0&&ut.useMultisampledRTT(b)===!1?k=nt.get(b).__webglMultisampledFramebuffer:Array.isArray(ze)?k=ze[V]:k=ze,W.copy(b.viewport),Q.copy(b.scissor),te=b.scissorTest}else W.copy(Ae).multiplyScalar(me).floor(),Q.copy(ye).multiplyScalar(me).floor(),te=Ce;if(V!==0&&(k=ee),Ze.bindFramebuffer(B.FRAMEBUFFER,k)&&X&&Ze.drawBuffers(b,k),Ze.viewport(W),Ze.scissor(Q),Ze.setScissorTest(te),oe){const he=nt.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,he.__webglTexture,V)}else if(ae){const he=U;for(let Te=0;Te<b.textures.length;Te++){const ze=nt.get(b.textures[Te]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Te,ze.__webglTexture,V,he)}}else if(b!==null&&V!==0){const he=nt.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,he.__webglTexture,V)}L=-1},this.readRenderTargetPixels=function(b,U,V,X,k,oe,ae,j=0){if(!(b&&b.isWebGLRenderTarget)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=nt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he){Ze.bindFramebuffer(B.FRAMEBUFFER,he);try{const Te=b.textures[j],ze=Te.format,Ee=Te.type;if(!Dt.textureFormatReadable(ze)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(Ee)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-X&&V>=0&&V<=b.height-k&&(b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+j),B.readPixels(U,V,X,k,ot.convert(ze),ot.convert(Ee),oe))}finally{const Te=S!==null?nt.get(S).__webglFramebuffer:null;Ze.bindFramebuffer(B.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(b,U,V,X,k,oe,ae,j=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=nt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ae!==void 0&&(he=he[ae]),he)if(U>=0&&U<=b.width-X&&V>=0&&V<=b.height-k){Ze.bindFramebuffer(B.FRAMEBUFFER,he);const Te=b.textures[j],ze=Te.format,Ee=Te.type;if(!Dt.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ie=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ie),B.bufferData(B.PIXEL_PACK_BUFFER,oe.byteLength,B.STREAM_READ),b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+j),B.readPixels(U,V,X,k,ot.convert(ze),ot.convert(Ee),0);const ct=S!==null?nt.get(S).__webglFramebuffer:null;Ze.bindFramebuffer(B.FRAMEBUFFER,ct);const gt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await e0(B,gt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ie),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,oe),B.deleteBuffer(Ie),B.deleteSync(gt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,V=0){const X=Math.pow(2,-V),k=Math.floor(b.image.width*X),oe=Math.floor(b.image.height*X),ae=U!==null?U.x:0,j=U!==null?U.y:0;ut.setTexture2D(b,0),B.copyTexSubImage2D(B.TEXTURE_2D,V,0,0,ae,j,k,oe),Ze.unbindTexture()};const ie=B.createFramebuffer(),le=B.createFramebuffer();this.copyTextureToTexture=function(b,U,V=null,X=null,k=0,oe=null){oe===null&&(k!==0?(Qr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=k,k=0):oe=0);let ae,j,he,Te,ze,Ee,Ie,ct,gt;const bt=b.isCompressedTexture?b.mipmaps[oe]:b.image;if(V!==null)ae=V.max.x-V.min.x,j=V.max.y-V.min.y,he=V.isBox3?V.max.z-V.min.z:1,Te=V.min.x,ze=V.min.y,Ee=V.isBox3?V.min.z:0;else{const kn=Math.pow(2,-k);ae=Math.floor(bt.width*kn),j=Math.floor(bt.height*kn),b.isDataArrayTexture?he=bt.depth:b.isData3DTexture?he=Math.floor(bt.depth*kn):he=1,Te=0,ze=0,Ee=0}X!==null?(Ie=X.x,ct=X.y,gt=X.z):(Ie=0,ct=0,gt=0);const vt=ot.convert(U.format),We=ot.convert(U.type);let wt;U.isData3DTexture?(ut.setTexture3D(U,0),wt=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ut.setTexture2DArray(U,0),wt=B.TEXTURE_2D_ARRAY):(ut.setTexture2D(U,0),wt=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);const ht=B.getParameter(B.UNPACK_ROW_LENGTH),qt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),vi=B.getParameter(B.UNPACK_SKIP_PIXELS),Kt=B.getParameter(B.UNPACK_SKIP_ROWS),Bn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,bt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,bt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Te),B.pixelStorei(B.UNPACK_SKIP_ROWS,ze),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Ee);const zt=b.isDataArrayTexture||b.isData3DTexture,rn=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const kn=nt.get(b),Sn=nt.get(U),En=nt.get(kn.__renderTarget),Lo=nt.get(Sn.__renderTarget);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,En.__webglFramebuffer),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,Lo.__webglFramebuffer);for(let ts=0;ts<he;ts++)zt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,nt.get(b).__webglTexture,k,Ee+ts),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,nt.get(U).__webglTexture,oe,gt+ts)),B.blitFramebuffer(Te,ze,ae,j,Ie,ct,ae,j,B.DEPTH_BUFFER_BIT,B.NEAREST);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(k!==0||b.isRenderTargetTexture||nt.has(b)){const kn=nt.get(b),Sn=nt.get(U);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,ie),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,le);for(let En=0;En<he;En++)zt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,kn.__webglTexture,k,Ee+En):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,kn.__webglTexture,k),rn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Sn.__webglTexture,oe,gt+En):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Sn.__webglTexture,oe),k!==0?B.blitFramebuffer(Te,ze,ae,j,Ie,ct,ae,j,B.COLOR_BUFFER_BIT,B.NEAREST):rn?B.copyTexSubImage3D(wt,oe,Ie,ct,gt+En,Te,ze,ae,j):B.copyTexSubImage2D(wt,oe,Ie,ct,Te,ze,ae,j);Ze.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ze.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else rn?b.isDataTexture||b.isData3DTexture?B.texSubImage3D(wt,oe,Ie,ct,gt,ae,j,he,vt,We,bt.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(wt,oe,Ie,ct,gt,ae,j,he,vt,bt.data):B.texSubImage3D(wt,oe,Ie,ct,gt,ae,j,he,vt,We,bt):b.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,oe,Ie,ct,ae,j,vt,We,bt.data):b.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,oe,Ie,ct,bt.width,bt.height,vt,bt.data):B.texSubImage2D(B.TEXTURE_2D,oe,Ie,ct,ae,j,vt,We,bt);B.pixelStorei(B.UNPACK_ROW_LENGTH,ht),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,qt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,vi),B.pixelStorei(B.UNPACK_SKIP_ROWS,Kt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Bn),oe===0&&U.generateMipmaps&&B.generateMipmap(wt),Ze.unbindTexture()},this.initRenderTarget=function(b){nt.get(b).__webglFramebuffer===void 0&&ut.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?ut.setTextureCube(b,0):b.isData3DTexture?ut.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?ut.setTexture2DArray(b,0):ut.setTexture2D(b,0),Ze.unbindTexture()},this.resetState=function(){R=0,w=0,S=null,Ze.reset(),G.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rt._getUnpackColorSpace()}}function xc(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new Xt;let h=0;for(let d=0;d<n.length;++d){const f=n[d];let p=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in f.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(f.attributes[m]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in f.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(f.morphAttributes[m])}if(e){let m;if(t)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,m,d),h+=m}}if(t){let d=0;const f=[];for(let p=0;p<n.length;++p){const m=n[p].index;for(let x=0;x<m.count;++x)f.push(m.getX(x)+d);d+=n[p].attributes.position.count}c.setIndex(f)}for(const d in r){const f=bd(r[d]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,f)}for(const d in a){const f=a[d][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let p=0;p<f;++p){const m=[];for(let M=0;M<a[d].length;++M)m.push(a[d][M][p]);const x=bd(m);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function bd(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=d.count*t}const a=new e(r),o=new Nn(a,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const f=c/t;for(let p=0,m=d.count;p<m;p++)for(let x=0;x<t;x++){const M=d.getComponent(p,x);o.setComponent(p+f,x,M)}}else a.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class _v extends du{constructor(){super();const e=new _e;e.deleteAttribute("uv");const t=new H({side:vn}),i=new H,s=new Qc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new O(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new tn(e,i,6),o=new Vt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new O(e,Js(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new O(e,Js(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new O(e,Js(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const f=new O(e,Js(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new O(e,Js(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new O(e,Js(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Js(n){return new wp({color:0,emissive:16777215,emissiveIntensity:n})}const to={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class xr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Mv=new eh(-1,1,1,-1,0,1);class yv extends Xt{constructor(){super(),this.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new St([0,2,0,0,2,0],2))}}const Sv=new yv;class th{constructor(e){this._mesh=new O(Sv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Mv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Lu extends xr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof fn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ta.clone(e.uniforms),this.material=new fn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new th(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class wd extends xr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class bv extends xr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class wv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Pe);this._width=i.width,this._height=i.height,t=new ni(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:fi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Lu(to),this.copyPass.material.blending=ui,this.clock=new Tu}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}wd!==void 0&&(a instanceof wd?i=!0:a instanceof bv&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Pe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Tv extends xr{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new rt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Xa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Ev extends xr{constructor(){super(),this.uniforms=ta.clone(Xa.uniforms),this.material=new bp({name:Xa.name,uniforms:this.uniforms,vertexShader:Xa.vertexShader,fragmentShader:Xa.fragmentShader}),this._fsQuad=new th(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Rt.getTransfer(this._outputColorSpace)===Bt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Hd?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Wd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Xd?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Pc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Yd?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$d?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===qd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Av={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new rt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ur extends xr{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Pe(e.x,e.y):new Pe(256,256),this.clearColor=new rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new ni(r,a,{type:fi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const f=new ni(r,a,{type:fi});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const p=new ni(r,a,{type:fi});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}const o=Av;this.highPassUniforms=ta.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new fn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Pe(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ta.clone(to.uniforms),this.blendMaterial=new fn({uniforms:this.copyUniforms,vertexShader:to.vertexShader,fragmentShader:to.fragmentShader,blending:Qn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new rt,this._oldClearAlpha=1,this._basic=new Tt,this._fsQuad=new th(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Pe(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ur.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ur.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new fn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Pe(.5,.5)},direction:{value:new Pe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new fn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ur.BlurDirectionX=new Pe(1,0);ur.BlurDirectionY=new Pe(0,1);const ha=document.querySelector("#game"),Jt=new vv({canvas:ha,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),wo=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;Jt.setPixelRatio(Math.min(window.devicePixelRatio,wo?1.5:2));Jt.setSize(window.innerWidth,window.innerHeight);Jt.shadowMap.enabled=!wo;Jt.info.autoReset=!1;Jt.shadowMap.type=Gd;Jt.outputColorSpace=Et;Jt.toneMapping=Pc;Jt.toneMappingExposure=1.12;const $e=new du;window.__steelRibbonScene=$e;$e.background=new rt(16764588);$e.fog=new Wc(14719602,360,2150);const Du=new pc(Jt);Du.compileEquirectangularShader();$e.environment=Du.fromScene(new _v,.04).texture;$e.environmentIntensity=.58;const Ue=new Dn(69,window.innerWidth/window.innerHeight,.08,1800);$e.add(Ue);const qe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const tt=new Set,Re={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},Cv=new Tu,$t=new P(0,1,0),nh=new P,Iu=new P,To=new P,un=new Vt,Uu=.86,gc=1.2,Rv=.78,Xn=.55,Ot={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ws=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],Fu=Math.max(...ws.map(n=>n.width));let Ki=0,se=ws[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};qe.best.textContent=`Best score ${l.best}`;let ti=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function Ui(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&ti==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}Ui();function Pv(){ti=ti==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",ti),Ui(),l.message=ti==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const qa=[];function _s(n,e=!1){let t=qa.find(s=>!s.busy);t||(qa.length>=4?t=qa[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),qa.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function Ts(n=880,e=.16,t="triangle",i=.16){if(!Ye)return;const{ctx:s}=Ye,r=s.createOscillator(),a=s.createGain();r.type=t,r.frequency.setValueAtTime(n,s.currentTime),r.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),a.gain.setValueAtTime(i,s.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),r.connect(a).connect(Ye.master||s.destination),r.start(),r.stop(s.currentTime+e+.06)}function Lv(n){const e=ge.clamp(n,0,1);return e*e*(3-2*e)}function Dv(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,r=i.start+i.carry,a=i.end+i.settle;e>=s&&e<=r?t+=i.rise*ge.clamp((e-s)/(i.approach+i.carry),0,1):e>r&&e<=i.end?t+=i.rise:e>i.end&&e<=a&&(t+=i.rise*(1-Lv((e-i.end)/i.settle)))}return t}function ih(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,r=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,a=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:r,z:a,t:i,n:t}}function Nu(n,e){const{t,n:i}=ih(n,e),s=n.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of n.ramps){let o=i-a.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=Dv(n,i),r}function Ya(n){const{x:e,z:t,n:i}=ih(se,n),s=Nu(se,i);return new P(e,s,t)}function dt(n){const e=(n%se.length+se.length)%se.length,t=Ya(e),i=Ya(e+2).sub(t).normalize(),s=nh.crossVectors($t,i).normalize(),r=Ya(e-2).y,a=Ya(e+2).y,o=Math.atan2(a-r,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function mi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Td(n){return ge.clamp(n/(se.length*se.laps),0,1)}function pl(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let r=i;r<=s;r++){const a=r*se.length+t;if(n<a&&e>=a)return!0}return!1}function Iv(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)i.fillStyle=(o+a)%2?"#101318":"#f5f1df",i.fillRect(o*s,a*s,s,s);const r=new en(t);return r.colorSpace=Et,r.wrapS=Mn,r.wrapT=Mn,r.repeat.set(3,1),r}function Uv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<n;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(n,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Et,s.wrapS=Mn,s.wrapT=Mn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),s}function Fv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let r=0;r<120;r++){const a=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(a,o,0,a,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(a,o,c,0,Math.PI*2),t.fill()}for(let r=0;r<9e3;r++){const a=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${a})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let r=-n;r<n*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+n*.65,n),t.stroke();const s=new en(e);return s.colorSpace=Et,s.wrapS=Mn,s.wrapT=Mn,s.repeat.set(18,18),s.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),s}function Nv(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let r=0;r<26e3;r++){const a=Math.random()<.48;t.fillStyle=a?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let r=0;r<24;r++){let a=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(a,o);for(let c=0;c<7;c++)a+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(a,o);t.stroke()}const s=new en(e);return s.colorSpace=Et,s.wrapS=Mn,s.wrapT=Mn,s.repeat.set(9,16),s.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),s}function zv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new en(e);return s.colorSpace=Et,s}function js(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<n;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new en(i);return r.colorSpace=Et,r}function Ov(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const a=(c,h,d,f)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,f),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,f),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+f-2),s.moveTo(c+2,h+f*.52),s.lineTo(c+d-2,h+f*.52),s.stroke()};a(n*.12,e*.24,n*.19,e*.2),a(n*.68,e*.25,n*.2,e*.2),a(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new en(i);return o.colorSpace=Et,o.wrapS=Mn,o.wrapT=Mn,o.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),o}function Bv(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<n+20;r+=26){t.beginPath();for(let a=-10;a<n+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<n;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,n*.24,r-8,n*.58,r+7,n),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new en(e);return s.colorSpace=Et,s.wrapS=Mn,s.wrapT=Mn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),s}function kv(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let a=18;a<e;a+=24)i.beginPath(),i.moveTo(8,a),i.lineTo(n-8,a),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const r=new en(t);return r.colorSpace=Et,r}function Ed(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=i?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),i&&r.rotate(-Math.PI/2),r.font=`900 ${i?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(n,0,0),r.restore();const c=new en(s);return c.colorSpace=Et,c}const Gi=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],ho=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],Hi=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function zu(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new en(i);return a.colorSpace=Et,a.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),a}function ml(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new en(t);return s.colorSpace=Et,s}function xl(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,n,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let c=18;c<e;c+=22){r.beginPath(),r.moveTo(0,c),r.lineTo(n,c),r.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)r.beginPath(),r.moveTo(h,c-18),r.lineTo(h,c),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,n-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)r.fillRect(c,e*.62,52,e*.19);r.fillStyle=i,r.fillRect(22,e*.49,n-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=i,r.shadowBlur=12,r.fillText("OPEN",n/2,e*.28,n*.76),r.shadowBlur=0;const o=new en(s);return o.colorSpace=Et,o.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),o}function Vv(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let r=18;r<e;r+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,r,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,r+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let r=0;r<n;r+=64)i.beginPath(),i.moveTo(r,0),i.lineTo(r,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new en(t);return s.colorSpace=Et,s.anisotropy=Math.min(16,Jt.capabilities.getMaxAnisotropy()),s}function Gv(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,r=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const a=new en(e);return a.colorSpace=Et,a}function ve(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function ms(n,e,t,i){const s=t*.5,r=i*.5;let a=ve(n,e);for(const o of[-s,0,s])for(const c of[-r,0,r])a=Math.min(a,ve(n+o,e+c));return a}function Eo(n,e,t=10){const{x0:i,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=Ot;if(n<i-c||n>s+c||e<a-c||e>r+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const Yi={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function In(n,e,t,i,s=8){const{x0:r,x1:a,zNear:o,zFar:c,pitch:h,streetW:d}=Ot,f=t*.5,p=i*.5,m=d*.5+s;let x=null;const M=(g,u,_)=>{(!x||_>x.overlap)&&(x={axis:g,road:u,overlap:_})};for(let g=r;g<=a+1;g+=h){if(e+p<c-m||e-p>o+m)continue;const u=f+m-Math.abs(n-g);u>0&&M("x",Math.round(g),u)}for(let g=o;g>=c-1;g-=h){if(n+f<r-m||n-f>a+m)continue;const u=p+m-Math.abs(e-g);u>0&&M("z",Math.round(g),u)}return x}const Es=[],Ou=[];function Bu(n=1){const e=new fn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return Ou.push(e),e}function ku(n,e,t,i=t){Es.push({x:n,z:e,rx:t,rz:i})}function Hv(n,e){let t=0,i=null;for(const s of Es){const r=(n-s.x)/s.rx,a=(e-s.z)/s.rz,o=r*r+a*a;if(o<1){const c=Math.pow(1-o,1.35);c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const nr=[],gl=[],Vu=[];let uo=0;function Cn(n,e){return Vu.push({obj:n,update:e}),n}function Gu(n){uo+=n;for(const e of Vu)e.update(uo,n)}function Ao(){if(gl.length===0)for(let n=0;n<ws.length;n++){const e=ws[n];for(let t=0;t<e.length;t+=14){const i=ih(e,t);gl.push({x:i.x,y:Nu(e,t),z:i.z,s:t,courseIndex:n})}}return gl}function An(n,e,t=0){let i=null,s=1/0;for(const r of Ao()){const a=n-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,i=r)}return{clearance:s-t-Fu*.58,distance:s,nearestS:i?.s??0}}function hs(n,e,t,i,s,r=9){const a=t*.5,o=i*.5,c=Fu*.62+r;let h=null;for(const d of Ao()){const f=Math.max(Math.abs(d.x-n)-a,0),p=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(f,p)-c;if(m>0)continue;const x=d.y-2.8,M=s-x;M<=0||(!h||M-m>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:M,score:M-m})}return h}function Kn(n,e,t,i=96){for(let s=0;s<i;s++){const r=n(s);if(An(r.x,r.z,e).clearance>=t&&!In(r.x,r.z,e*2,e*2,3.5))return r}return null}function Jn(n,e,t,i,s){const r=An(e,t,i);nr.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function Wv(){const n=[...nr].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:nr.length,unsafe:nr.filter(e=>e.clearance<e.margin),closest:n}}function Tn(n,e,t,i,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new O(new Je(i,i,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors($t,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}function Xv(){const n=new Ap(16757626,3097190,.66);$e.add(n);const e=new ll(7179775,.6);e.position.set(260,145,-260),$e.add(e);const t=new ll(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,$e.add(t);const i=new ll(16742973,.5);i.position.set(-180,35,280),$e.add(i);const s=new Qc(5556479,90,900,2);s.position.set(0,88,-920),$e.add(s)}let Wi=null;function qv(){const n=new P(-310,150,230).normalize();Wi=new O(new Yt(1200,48,32),new fn({side:vn,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n}},vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,fragmentShader:`
        varying vec3 vDir;
        uniform vec3 uSunDir;
        void main() {
          float h = clamp(vDir.y, -0.08, 1.0);
          // vertical gradient: peach horizon -> mauve band -> steel blue -> deep indigo zenith
          vec3 zenith  = vec3(0.06, 0.09, 0.24);
          vec3 upper   = vec3(0.2, 0.24, 0.47);
          vec3 band    = vec3(0.56, 0.36, 0.47);
          vec3 horizon = vec3(0.95, 0.66, 0.44);
          vec3 col = mix(horizon, band, smoothstep(0.0, 0.09, h));
          col = mix(col, upper, smoothstep(0.06, 0.26, h));
          col = mix(col, zenith, smoothstep(0.2, 0.62, h));
          // warm scattering lobe around the sun, wide at the horizon
          float sunAmt = max(dot(vDir, uSunDir), 0.0);
          col += vec3(1.0, 0.58, 0.28) * pow(sunAmt, 5.0) * 0.5;
          col += vec3(1.0, 0.78, 0.5) * pow(sunAmt, 26.0) * 0.8;
          // opposite-side cool deepening keeps the far sky moody
          float away = max(dot(vDir, -uSunDir), 0.0);
          col = mix(col, vec3(0.14, 0.15, 0.32), 0.42 * pow(away, 1.6) * (1.0 - h * 0.4));
          gl_FragColor = vec4(col, 1.0);
        }`})),Wi.renderOrder=-100,Wi.frustumCulled=!1,$e.add(Wi);const e=n,t=new Tt({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new O(new on(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),Wi.add(i);const s=new Tt({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:Qn});for(const[r,a]of[[120,.2],[250,.085],[520,.035]]){const o=new O(new on(r,48),s.clone());o.material.opacity=a,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),Wi.add(o)}}function Yv(){const n=new H({map:Fv(),color:8231526,roughness:.98,metalness:.02}),e=new O(new Wt(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let p=0;p<t.count;p++){const m=t.getX(p),x=t.getY(p);t.setZ(p,ve(m,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),$e.add(e);const i=new H({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:xt});for(let p=0;p<3;p++){const m=150-p*190,x=-760-p*420,M=980,g=64+p*18,u=new O(new Wt(980,64+p*18,1,1),i.clone());u.rotation.x=-Math.PI/2,u.rotation.z=-.34+p*.03,u.position.set(m,ms(m,x,M,g)-.55,x),u.renderOrder=-4,$e.add(u)}const s=[new H({color:4352578,roughness:1}),new H({color:6910014,roughness:1}),new H({color:3562320,roughness:1})];for(let p=0;p<46;p++){const m=28+Math.random()*90,x=-900+Math.random()*1800,M=-260-Math.random()*1780,g=[ve(x,M)];for(let _=0;_<6;_++)g.push(ve(x+Math.cos(_)*m*.9,M+Math.sin(_*1.9)*m*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const u=new O(new on(m,9),s[p%s.length]);u.rotation.x=-Math.PI/2,u.rotation.z=Math.random()*Math.PI,u.position.set(x,Math.max(...g)+.07,M),u.scale.y=.32+Math.random()*.5,u.receiveShadow=!0,$e.add(u)}const r=new Tt({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let p=0;p<32;p++){const m=new O(new on(70+Math.random()*150,22),r.clone());m.material.opacity=.008+Math.random()*.014,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),m.position.y<8&&Yi.lowFogDisks++,m.scale.y=.22+Math.random()*.26,m.renderOrder=-6,$e.add(m)}const a=[new H({color:5991785,roughness:1}),new H({color:7633254,roughness:1}),new H({color:4874865,roughness:1})],o=new H({color:15068905,roughness:.95});for(let p=0;p<52;p++){const m=78+Math.random()*180,x=52+Math.random()*115,M=Kn(u=>{const _=p/52*Math.PI*2+u*1.77,v=1380+Math.random()*820+u*18;return{x:Math.cos(_)*v,z:Math.sin(_)*v-1180}},x,480);if(!M)continue;const g=new O(new Ai(x,m,5+Math.floor(Math.random()*2)),a[p%a.length]);if(g.position.set(M.x,-9,M.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,$e.add(g),Jn("mountain",M.x,M.z,x,480),m>160){const u=new O(new Ai(x*.34,m*.22,5),o);u.position.copy(g.position).add(new P(0,m*.39,0)),u.rotation.y=g.rotation.y,$e.add(u)}}const c=new H({color:4926748,roughness:.9});new H({color:2055221,roughness:.92}),new H({color:3109954,roughness:.95}),new H({color:1589042,roughness:.9});{const p=new Je(.28,.42,1,6).translate(0,.5,0),m=xc([new Ai(2.7,5.4,7).translate(0,1.9,0),new Ai(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Ai(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new rt(v)),M=new tn(p,c,185),g=new tn(m,new H({roughness:.92}),185),u=new Vt;let _=0;for(let v=0;v<185;v++){const y=.58+Math.random()*1.05,E=8*y,T=Kn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!T)continue;const{x:C,z:R}=T;if(Eo(C,R,18))continue;const w=ve(C,R)+.8,S=2.2+Math.random()*3.8;u.position.set(C,w,R),u.rotation.y=Math.random()*Math.PI,u.scale.set(y,S,y),u.updateMatrix(),M.setMatrixAt(_,u.matrix),u.position.set(C,w+S,R),u.scale.set(y,y,y),u.updateMatrix(),g.setMatrixAt(_,u.matrix),g.setColorAt(_,x[v%3]),_++,Jn("tree",C,R,E,145)}M.count=_,g.count=_,M.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,$e.add(M),$e.add(g)}{const p=x=>{const M=document.createElement("canvas");M.width=256,M.height=128;const g=M.getContext("2d"),u=(v,y)=>Math.sin(x*y+v*37.7)*.5+.5;for(let v=0;v<16;v++){const y=v/15,E=Math.sin(y*Math.PI),T=24+y*208,C=66+(u(v,53)-.5)*22*E,R=(18+u(v,29)*22)*(.45+E*.75),w=g.createRadialGradient(T,C-R*.18,0,T,C,R);w.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),w.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),w.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=w,g.beginPath(),g.arc(T,C,R,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const y=.12+v/9*.76,E=y*256,T=20+u(v,71)*16,C=g.createRadialGradient(E,92,0,E,92,T);C.addColorStop(0,"rgba(255, 176, 128, 0.22)"),C.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=C,g.beginPath(),g.arc(E,92,T,0,Math.PI*2),g.fill()}const _=new en(M);return _.colorSpace=Et,_},m=[p(1),p(2),p(3)];ke.cloudSprites=0;for(let x=0;x<44;x++){const M=new Xc({map:m[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new cc(M),u=170+Math.random()*280;g.scale.set(u,u*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,$e.add(g),ke.cloudSprites++,Cn(g,_=>{g.position.x+=Math.sin(_*.05+x)*.02})}}const h=[new H({color:6186600,roughness:.68,metalness:.2}),new H({color:7829101,roughness:.72,metalness:.18}),new H({color:4544612,roughness:.62,metalness:.24})],d=new H({color:2962232,roughness:.65,metalness:.35});for(let p=0;p<44;p++){const m=new it,x=20+Math.random()*95,M=8+Math.random()*18,g=8+Math.random()*18,u=new O(new _e(M,x,g),h[p%h.length]);u.position.y=x/2,u.castShadow=!0,u.receiveShadow=!0,m.add(u);const _=js(160,320,.28+Math.random()*.36),v=new H({map:_,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:_,emissiveIntensity:.3});for(const C of[-1,1]){const R=new O(new Wt(M*.82,x*.74),v);R.position.set(0,x*.53,C*(g/2+.08)),R.rotation.y=C<0?Math.PI:0,m.add(R)}const y=new O(new _e(M*1.08,1.2,g*1.08),d);if(y.position.y=x+.7,m.add(y),Math.random()<.32){const C=new O(new Je(.18,.3,10+Math.random()*12,8),d);C.position.y=x+6.5,m.add(C)}const E=Math.hypot(M,g)*.65,T=Kn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);T&&(m.position.set(T.x,ms(T.x,T.z,M,g)-.7,T.z),m.rotation.y=Math.random()*Math.PI,$e.add(m),Jn("building",T.x,T.z,E,240))}const f=new H({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let p=0;p<18;p++){const m=new it,x=Gi[p%Gi.length],M=ho[(p*3+1)%ho.length],g=Hi[p%Hi.length],u=new H({map:zu(x,M,g),color:16777215,roughness:.22,metalness:.04,emissive:new rt(g),emissiveIntensity:.28}),_=22+Math.random()*18,v=8+Math.random()*4,y=new O(new _e(_,v,.5),u);y.position.y=10,m.add(y);const E=new O(new _e(_+1.2,.32,.75),f);E.position.y=10+v*.5+.25,m.add(E);for(const C of[-7,7]){const R=new O(new Je(.24,.32,10,8),f);R.position.set(C,5,-.2),m.add(R)}const T=Kn(()=>({x:-780+Math.random()*1560,z:-450-p*135+Math.random()*80-40}),22,175,50);T&&(m.position.set(T.x,ve(T.x,T.z)+.5,T.z),m.rotation.y=-.35+Math.random()*.7,$e.add(m),Jn("billboard",T.x,T.z,22,175),ds("roadside-billboard",T.x,m.position.y+10,T.z))}}function $v(){for(let u=0;u<3;u++){const _=[4012638,5326704,7035525][u],v=new Tt({color:_,transparent:!0,opacity:.6-u*.14,depthWrite:!1,fog:!1}),y=60,E=5200,T=new Wt(E,360,y,1),C=T.attributes.position;for(let w=0;w<=y;w++){const S=w/y,L=(Math.sin(S*22+u*3)*.5+Math.sin(S*9+u)*.5)*70+120;C.setY(w,L),C.setY(w+y+1,-180)}C.needsUpdate=!0;const R=new O(T,v);R.position.set(0,40,-2300-u*360),$e.add(R)}const n=new H({color:5583649,roughness:.9}),e=[new H({color:3837754,roughness:.9}),new H({color:7319100,roughness:.92}),new H({color:13075258,roughness:.9}),new H({color:15182276,roughness:.88})];for(let u=0;u<48;u++){const _=.7+Math.random()*1.2,v=9*_,y=Kn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!y)continue;const{x:E,z:T}=y;if(Eo(E,T,18))continue;const C=ve(E,T)+.6,R=new it,w=2.6+Math.random()*3.4,S=new O(new Je(.34,.5,w,6),n);S.position.y=w/2,R.add(S);const L=e[Math.floor(Math.random()*e.length)],F=3+Math.floor(Math.random()*3);for(let W=0;W<F;W++){const Q=2.4+Math.random()*1.8,te=new O(new Yt(Q,9,7),L);te.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,R.add(te)}R.position.set(E,C,T),R.scale.setScalar(_),$e.add(R),Jn("tree",E,T,v,150)}const t=[new H({color:7762025,roughness:1,flatShading:!0,side:xt}),new H({color:9077368,roughness:1,flatShading:!0,side:xt}),new H({color:6249043,roughness:1,flatShading:!0,side:xt})];for(let u=0;u<70;u++){const _=2+Math.random()*7,v=Kn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),_,70,30);if(!v)continue;const{x:y,z:E}=v,T=new O(new Jc(_,0),t[u%t.length]),C=T.geometry.attributes.position;for(let R=0;R<C.count;R++)C.setXYZ(R,C.getX(R)*(.8+Math.random()*.4),C.getY(R)*(.6+Math.random()*.4),C.getZ(R)*(.8+Math.random()*.4));C.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,ve(y,E)+_*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,$e.add(T),li.push({kind:"rock",x:y,z:E,radius:_*1.12}),Jn("rock",y,E,_,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let u=0;u<14;u++){const _=130+Math.random()*200,v=130+Math.random()*200,y=Kn(()=>{for(let L=0;L<6;L++){const F=-1500+Math.random()*3e3,W=-700-Math.random()*1700,Q=[ve(F,W),ve(F+_*.45,W+v*.45),ve(F-_*.45,W+v*.45),ve(F+_*.45,W-v*.45),ve(F-_*.45,W-v*.45)];if(Math.max(...Q)-Math.min(...Q)<1)return{x:F,z:W}}return{x:1e5,z:1e5}},Math.max(_,v)*.5,40,24);if(!y||y.x>9e4)continue;const{x:E,z:T}=y,C=new it,R=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let L=0;L<R;L++){const F=new H({color:L%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),W=new O(new Wt(_,v/R),F);W.rotation.x=-Math.PI/2,W.position.set(0,.05,-v/2+(L+.5)*(v/R)),C.add(W)}const S=Math.max(ve(E,T),ve(E+_*.45,T+v*.45),ve(E-_*.45,T+v*.45),ve(E+_*.45,T-v*.45),ve(E-_*.45,T-v*.45));C.position.set(E,S+.06,T),C.rotation.y=Math.random()*Math.PI,$e.add(C),Jn("field",E,T,Math.max(_,v)*.5,40)}{const u=Kn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(u){const _=new O(new on(150,48),Bu(9));_.rotation.x=-Math.PI/2,_.position.set(u.x,ms(u.x,u.z,450,300)+.08,u.z),_.scale.set(1.5,1,1),_.renderOrder=-4,$e.add(_),ku(u.x,u.z,222,148),Yi.waterBlockers++,Jn("lake",u.x,u.z,170,60)}}const s=new H({color:15922422,roughness:.5,metalness:.2});for(let u=0;u<9;u++){const _=u/9*Math.PI*2+.6,v=1500+Math.random()*700,y=Math.cos(_)*v,E=Math.sin(_)*v-1150,T=60+Math.random()*40,C=new it,R=new O(new Je(1.1,2.2,T,10),s);R.position.y=T/2,C.add(R);const w=new it;w.position.set(0,T,3);const S=new O(new _e(3,3,7),s);w.add(S);const L=new it;L.position.z=3.5;for(let W=0;W<3;W++){const Q=new O(new _e(1.1,26,.5),s);Q.position.y=13;const te=new it;te.add(Q),te.rotation.z=W/3*Math.PI*2,L.add(te)}w.add(L),C.add(w),C.position.set(y,-8,E),C.rotation.y=Math.random()*Math.PI,$e.add(C);const F=.5+Math.random()*.5;Cn(L,W=>{L.rotation.z=W*F})}const r=new H({color:7041398,roughness:.6,metalness:.4}),a=new hc({color:2764595,transparent:!0,opacity:.5});let o=null;for(let u=0;u<7;u++){const _=-1100+u*360,v=-1650-Math.sin(u*.7)*120,y=48,E=new it,T=6;for(const R of[-1,1])for(const w of[-1,1]){const S=new O(new Je(.4,.7,y,5),r);S.position.set(R*T,y/2,w*T),S.rotation.z=-R*.08,S.rotation.x=w*.08,E.add(S)}for(const R of[y*.6,y*.82,y]){const w=new O(new _e(T*4,.8,.8),r);w.position.y=R,E.add(w)}E.position.set(_,ve(_,v)-2,v),$e.add(E);const C=ve(_,v)-2+y;if(o)for(const R of[-T*2,0,T*2]){const w=o.x+R,S=o.z,L=_+R,F=v,W=[],Q=12;for(let q=0;q<=Q;q++){const Z=q/Q,ne=Math.sin(Z*Math.PI)*6;W.push(new P(w+(L-w)*Z,o.y-ne+(C-o.y)*Z,S+(F-S)*Z))}const te=new Gh(new Xt().setFromPoints(W),a);$e.add(te)}o={x:_,y:C,z:v}}const c=new H({color:11680302,roughness:.6,metalness:.3}),h=new H({color:15263976,roughness:.6,metalness:.3});for(let u=0;u<5;u++){const _=Kn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!_)continue;const{x:v,z:y}=_,E=70+Math.random()*50,T=new it,C=8;for(let L=0;L<C;L++){const F=new O(new Je(.5,.7,E/C,4),L%2?h:c);F.position.y=(L+.5)*(E/C),F.rotation.y=Math.PI/4,T.add(F)}const R=new H({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new O(new Yt(1.1,10,8),R);w.position.y=E+1,T.add(w),T.position.set(v,ve(v,y),y),$e.add(T),Jn("mast",v,y,8,120);const S=Math.random()*Math.PI*2;Cn(w,L=>{R.emissiveIntensity=Math.sin(L*2.4+S)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let u=0;u<6;u++){const _=new it,v=d[u%d.length],y=new H({map:n2(v[0],v[1]),roughness:.5,metalness:.05,emissive:new rt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new O(new Yt(11,20,16),y);E.scale.y=1.25,_.add(E);const T=new O(new _e(3.4,3,3.4),new H({color:8014371,roughness:.9}));T.position.y=-17,_.add(T);const C=new hc({color:3811866});for(const F of[-1,1])for(const W of[-1,1]){const Q=new Gh(new Xt().setFromPoints([new P(F*1.6,-15.5,W*1.6),new P(F*7,-3,W*7)]),C);_.add(Q)}const R=-700+Math.random()*1400,w=-700-Math.random()*1200,S=280+Math.random()*100;_.position.set(R,S,w),$e.add(_);const L=Math.random()*Math.PI*2;Cn(_,F=>{_.position.y=S+Math.sin(F*.5+L)*6,_.position.x=R+Math.sin(F*.08+L)*90,_.rotation.z=Math.sin(F*.4+L)*.04})}const f=new Tt({color:2829104,side:xt,fog:!1});function p(){const u=new Kc;return u.moveTo(0,0),u.lineTo(-2.6,1.1),u.lineTo(-2.2,.2),u.lineTo(0,.5),u.lineTo(2.2,.2),u.lineTo(2.6,1.1),u.lineTo(0,0),new O(new yo(u),f)}for(let u=0;u<5;u++){const _=new it,v=5+Math.floor(Math.random()*5),y=[];for(let L=0;L<v;L++){const F=p(),W=L%2?1:-1,Q=Math.ceil(L/2);F.position.set(W*Q*5,-Q*2.4,0),F.rotation.x=-Math.PI/2,_.add(F),y.push(F)}const E=150+Math.random()*120,T=-500-Math.random()*1400,C=18+Math.random()*14,R=1400,w=-700+Math.random()*1400;_.position.set(w,E,T),$e.add(_);const S=Math.random()*Math.PI*2;Cn(_,(L,F)=>{_.position.x+=C*F,_.position.x>R&&(_.position.x=-R);const W=Math.sin(L*6+S);for(const Q of y)Q.rotation.x=-Math.PI/2+W*.4})}{const u=new it,_=new H({color:14673644,roughness:.4,metalness:.2}),v=new O(new Yt(20,20,16),_);v.scale.set(2.6,1,1),u.add(v);const y=new H({color:13781835,roughness:.6});for(let w=0;w<3;w++){const S=new O(new _e(10,9,.6),y);S.position.x=-46,S.rotation.x=w/3*Math.PI*2,u.add(S)}const E=new O(new _e(10,4,4),new H({color:3356475,roughness:.7}));E.position.y=-19,u.add(E);const T=new O(new Wt(40,10),new Tt({map:sh("STEEL RIBBON"),transparent:!0,side:xt}));T.position.set(60,0,0),u.add(T);const C=900,R=240;u.position.set(0,R,-1200),$e.add(u),Cn(u,w=>{const S=w*.05;u.position.x=Math.cos(S)*C,u.position.z=-1200+Math.sin(S)*C*.5,u.position.y=R+Math.sin(w*.3)*8,u.rotation.y=-S+Math.PI/2})}const m=new Tt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let u=0;u<14;u++){const _=new O(new Wt(220+Math.random()*360,16+Math.random()*22),m.clone());_.material.opacity=.12+Math.random()*.18,_.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),_.rotation.x=-Math.PI/2.1,_.rotation.z=Math.random()*Math.PI,_.scale.y=.3,$e.add(_);const v=2+Math.random()*3;Cn(_,(y,E)=>{_.position.x+=v*E,_.position.x>1400&&(_.position.x=-1400)})}const x=new H({color:13620954,roughness:.6,metalness:.2}),M=new Tt({map:i2(),side:xt});for(let u=0;u<4;u++){const _=Kn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!_)continue;const{x:v,z:y}=_,E=new it,T=60+Math.random()*40,C=new O(new _e(T,1.4,26),x);C.position.set(0,26,-4),C.rotation.x=-.32,E.add(C);const R=new O(new Wt(T*.94,24),M);R.position.set(0,12,6),R.rotation.x=-.85,E.add(R);for(const w of[-T/2,T/2]){const S=new O(new _e(1.4,26,1.4),x);S.position.set(w,13,-8),E.add(S)}E.position.set(v,ve(v,y),y),E.rotation.y=Math.atan2(-v,-y)+(Math.random()-.5)*.5,$e.add(E),Jn("grandstand",v,y,40,30)}const g=[16731486,16765503,16777215,11824127];for(let u=0;u<90;u++){const _=Kn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!_)continue;const{x:v,z:y}=_,E=new it,T=g[Math.floor(Math.random()*g.length)],C=new Tt({color:T,side:xt}),R=5+Math.floor(Math.random()*6);for(let w=0;w<R;w++){const S=new O(new on(.5+Math.random()*.4,5),C);S.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),S.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,S.rotation.z=Math.random()*Math.PI,E.add(S)}E.position.set(v,ve(v,y),y),$e.add(E),Jn("flowers",v,y,3,20)}}const an=[],Gn=[];let vc=0;const li=[],Ps=[],Un=[],_c=[],ra=[],ir=[],ke={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},fo=[];function ds(n,e,t,i){ke.signs++,fo.length<160&&fo.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function Vi(n,e,t=1){ke[n][e]=(ke[n][e]||0)+t}function Zv(n,e){const t=new it,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,r=new H({color:e,roughness:.34,metalness:.28}),a=new H({color:new rt(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new H({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),c=new H({color:395016,roughness:.72,metalness:.02}),h=new H({color:14147041,roughness:.2,metalness:.68}),d=new H({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:1.7}),f=new H({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:1.45}),p=new O(new _e(s.w,s.h,s.l),n==="taxi"?new H({color:16767293,roughness:.36,metalness:.24}):r);p.position.y=.95,t.add(p);const m=new O(new _e(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(m.position.set(0,1.65,s.cabinZ),t.add(m),!s.bus){const u=new O(new _e(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);u.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(u);for(const _ of[-1,1]){const v=new O(new _e(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);v.position.set(_*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(v)}}if(s.bed){const u=new O(new _e(s.w*.94,.58,s.l*.38),a);u.position.set(0,1.2,1.35),t.add(u)}if(s.box){const u=new O(new _e(s.box[0],s.box[1],s.box[2]),new H({color:15130833,roughness:.62,metalness:.05}));u.position.set(0,1.55,1.25),t.add(u)}if(s.bus){const u=new O(new _e(s.w+.06,.28,s.l*.86),a);u.position.set(0,1.38,0),t.add(u);for(let _=-2.8;_<=3.1;_+=1.2)for(const v of[-1,1]){const y=new O(new _e(.08,.64,.72),o);y.position.set(v*(s.w*.5+.05),2.08,_),t.add(y)}}if(s.sign){const u=new O(new _e(1,.24,.46),new H({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));u.position.set(0,2.2,-.35),t.add(u)}const x=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],M=[],g=new H({color:1250072,roughness:.86,metalness:.04});for(const u of x)for(const _ of[-s.w*.54,s.w*.54]){const v=new O(new Je(.42,.42,.36,14),c);v.rotation.z=Math.PI/2,v.position.set(_,.45,u),t.add(v),M.push(v);const y=new O(new Je(.18,.18,.38,10),h);y.rotation.z=Math.PI/2,y.position.set(_,.45,u),t.add(y);const E=new O(new _e(.3,.34,1.12),g);E.position.set(_*1.02,.72,u),t.add(E)}for(const u of[-s.l*.5-.06,s.l*.5+.06]){const _=new O(new _e(s.w*1.02,.24,.16),g);_.position.set(0,.62,u),t.add(_)}for(const u of[-s.w*.28,s.w*.28]){const _=new O(new _e(.42,.2,.1),d);_.position.set(u,.95,-s.l*.52-.04),t.add(_);const v=new O(new _e(.36,.22,.1),f);v.position.set(u,.98,s.l*.52+.04),t.add(v)}return t.userData={wheels:M,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(u=>{u.castShadow=!1,u.receiveShadow=!0}),t}function Hu(n,e){const t=new it,i=new H({color:12947299,roughness:.72}),s=new H({color:n,roughness:.68}),r=new H({color:e,roughness:.76}),a=new H({color:1119001,roughness:.82}),o=new O(new Je(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const c=new O(new Yt(.24,10,8),i);c.position.y=2.02,t.add(c);const h=new O(new Yt(.25,8,5),a);h.scale.y=.5,h.position.y=2.17,t.add(h);const d=[];for(const f of[-.16,.16]){const p=new O(new Je(.075,.09,.78,6),r);p.position.set(f,.58,0),t.add(p),d.push({mesh:p,side:Math.sign(f),baseY:.58,amp:.28})}for(const f of[-.38,.38]){const p=new O(new Je(.055,.065,.72,6),i);p.position.set(f,1.33,0),p.rotation.z=f<0?-.18:.18,t.add(p),d.push({mesh:p,side:-Math.sign(f),baseY:1.33,amp:.34})}return t.userData.limbs=d,t.traverse(f=>{f.castShadow=!0,f.receiveShadow=!0}),t}function Kv(n,e,t){const{X0:i,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],f=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,x=[],M=[];for(let I=i;I<=s+1;I+=o)x.push(Math.round(I));for(let I=r;I>=a-1;I-=o)M.push(Math.round(I));M.sort((I,Ae)=>I-Ae);const g=x[0],u=x[x.length-1],_=M[0],v=M[M.length-1];Un.length=0,_c.length=0,ra.length=0,ir.length=0,ke.traffic=0,ke.pedestrians=0,ke.types={},ke.turns=0,ke.splats=0,ke.trafficCrashes=0,ke.streetLights=0,ke.trafficLights=0,ke.stopSigns=0;const y=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*c*.23,T=(I,Ae)=>{let ye=0,Ce=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-Ae);K<Ce&&(Ce=K,ye=$)}return ye},C=(I,Ae,ye)=>{const Ce=I==="ns"?M:x;if(ye>0){for(const $ of Ce)if($>Ae+.05)return $;return Ce[Ce.length-1]}for(let $=Ce.length-1;$>=0;$--)if(Ce[$]<Ae-.05)return Ce[$];return Ce[0]},R=I=>{const Ae=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+Ae,z:I.along}:{x:I.along,z:I.road+Ae}},w=I=>{if(l.mode!=="roam")return null;const Ae=R(I);if(Math.abs(l.roamPos.y-(ve(Ae.x,Ae.z)+Xn))>4.2)return null;const ye=I.axis==="ns"?0:I.dir,Ce=I.axis==="ns"?I.dir:0,$=l.roamPos.x-Ae.x,K=l.roamPos.z-Ae.z,Me=$*ye+K*Ce,be=I.axis==="ns"?$:K,Ne=Math.abs(be),je=Math.hypot($,K),It=I.mesh?.userData?.colliderHalfW||2,Qe=I.mesh?.userData?.colliderHalfD||3;return je<gn+Math.max(It,Qe)*.55||Me>-1.5&&Me<Qe+4.2&&Ne<gn+It*.85?{crash:!0}:Me>0&&Me<30&&Ne<c*.36?{avoidOffset:(be>=0?-1:1)*I.maxAvoidOffset,stop:Me<13&&Ne<gn+It*.95}:null},S=(I,Ae)=>`${Math.round(I)},${Math.round(Ae)}`,L=(I,Ae)=>{const ye=((Ae+I.phase)%15.5+15.5)%15.5;return ye<6.2?"ns":ye<7.4?"yellow-ns":ye<13.6?"ew":"yellow-ew"},F=(I,Ae)=>{const ye=I.axis==="ns"?I.road:I.next,Ce=I.axis==="ns"?I.next:I.road,$=S(ye,Ce),K=h.get($);if(!K)return null;if(K.type==="signal"){const Me=L(K,Ae),be=Me===`yellow-${I.axis}`;return Me===I.axis&&!be?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},W=(I,Ae=!1)=>{const ye=I.axis,Ce=I.along,$=ye==="ns"?x:M,K=I.road,Me=T($,K),be=[],Ne=ye==="ns"?_:g,je=ye==="ns"?v:u;!Ae&&Ce+I.dir*o>=Ne&&Ce+I.dir*o<=je&&be.push({axis:ye,road:I.road,along:Ce,dir:I.dir,turn:!1}),Me>0&&be.push({axis:ye==="ns"?"ew":"ns",road:Ce,along:K,dir:-1,turn:!0}),Me<$.length-1&&be.push({axis:ye==="ns"?"ew":"ns",road:Ce,along:K,dir:1,turn:!0}),be.length||be.push({axis:ye,road:I.road,along:Ce,dir:-I.dir,turn:!0});const It=be.filter(Lt=>Lt.turn),Qe=!Ae&&It.length&&Math.random()<.42?y(It):y(be);(Qe.turn||Qe.axis!==ye)&&ke.turns++,I.axis=Qe.axis,I.road=Qe.road,I.along=Qe.along,I.dir=Qe.dir,I.laneOffset=E(I.dir),I.next=C(I.axis,I.along,I.dir),I.turnBlend=Qe.turn?1:0,I.lastControlKey=null};for(let I=0;I<m;I++){const Ae=Math.random()<.56?"ns":"ew",ye=f[I%f.length],Ce=Math.random()<.5?-1:1,$=(ye==="bus"||ye==="boxTruck"?10:13)+Math.random()*9,K={axis:Ae,dir:Ce,road:y(Ae==="ns"?x:M),laneOffset:E(Ce),along:y(Ae==="ns"?M:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Zv(ye,d[I*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=C(K.axis,K.along,K.dir),Un.push(K.collider),p.push(K),_c.push(K),n.add(K.mesh),ke.types[ye]=(ke.types[ye]||0)+1}function Q(I,Ae=0,ye=0){let Ce=Math.max(0,I.speed*ye);const $=w(I);for($?.crash?(cf(I,l.roamPos),Ce=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,ye*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Ce=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,ye*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-ye),Ce=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-ye),Ce=0);Ce>0;){const B=F(I,Ae);if(B){const pt=I.next-I.dir*(B.kind==="signal"?12:8),Dt=(pt-I.along)*I.dir;if(Dt>=-.35&&Dt<=Ce+.25){I.along=pt,I.brakePulse=1,Ce=0,B.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=B.key);break}}const mt=Math.abs(I.next-I.along);if(Ce<mt)I.along+=I.dir*Ce,Ce=0;else{I.along=I.next,Ce-=mt;const pt=I.next<=(I.axis==="ns"?_:g)+.05||I.next>=(I.axis==="ns"?v:u)-.05;W(I,pt)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-ye*3.2),I.turnBlend=Math.max(0,I.turnBlend-ye*3.2);const{x:K,z:Me}=R(I),be=I.axis==="ns"?0:I.dir,Ne=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,ve(K,Me)+.28+Math.sin(Ae*3.2+I.bob)*.035,Me);const je=Math.atan2(-be,-Ne),It=Math.atan2(Math.sin(je-I.mesh.rotation.y),Math.cos(je-I.mesh.rotation.y));I.mesh.rotation.y+=It*Math.min(1,ye*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(Ae*22+I.bob)*.02);for(const B of I.mesh.userData.wheels||[])B.rotation.x-=I.dir*I.speed*ye*1.7;const Qe=I.mesh.userData.colliderHalfD,Lt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=Me,I.collider.hw=I.axis==="ns"?Lt:Qe,I.collider.hd=I.axis==="ns"?Qe:Lt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of p)Q(I,0,0);ke.traffic=p.length,Cn(n,(I,Ae)=>{for(const ye of p)Q(ye,I,Ae)});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],Z=[],ne=45;for(let I=0;I<ne;I++){const Ae=Math.random()<.56?"ns":"ew",ye=e[Math.random()*e.length|0],Ce=Math.abs(ye.z1-ye.z0)>Math.abs(ye.x1-ye.x0),$=Ae==="ns"?Ce?"ns":"ew":Ce?"ew":"ns",K=Math.random()<.5?-1:1,Me=Math.random()<.5?-1:1,be={axis:$,dir:K,sideSign:Me,coord:y($==="ns"?x:M),along:$==="ns"?a+Math.random()*(r-a):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Hu(te[I%te.length],q[I*2%q.length])};I<14&&(be.axis="ns",be.coord=80,be.sideSign=I%2?-1:1,be.dir=I%3===0?1:-1,be.along=350-I*24,be.speed=1.5+I%4*.35),Z.push(be),ra.push(be),be.mesh.traverse(Ne=>Ne.castShadow=!1),n.add(be.mesh)}const de=new Tt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:xt}),me=new Tt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:xt});for(let I=0;I<18;I++){const Ae=new it,ye=new O(new on(1,12),de.clone());ye.rotation.x=-Math.PI/2,Ae.add(ye);for(let Ce=0;Ce<7;Ce++){const $=new O(new on(.25+Math.random()*.25,8),me.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Ce)*(.6+Math.random()*1.2),.01,Math.sin(Ce*1.7)*(.5+Math.random()*1.1)),Ae.add($)}Ae.visible=!1,Ae.userData.life=0,Ae.userData.maxLife=2.8,Ae.position.y=-99,n.add(Ae),ir.push(Ae)}function Ge(I,Ae=0,ye=0){if(!I.active)if(I.respawn-=ye,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*ye,I.axis==="ns"?(I.along<a-28&&(I.along=r+28),I.along>r+28&&(I.along=a-28)):(I.along<i-28&&(I.along=s+28),I.along>s+28&&(I.along=i-28));const Ce=I.sideSign*(c*.66+1.2),$=I.axis==="ns"?I.coord+Ce:I.along,K=I.axis==="ns"?I.along:I.coord+Ce,Me=I.axis==="ns"?0:I.dir,be=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,ve($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-Me,-be);const Ne=Math.sin(Ae*7+I.phase);for(const je of I.mesh.userData.limbs||[])je.mesh.rotation.x=Ne*je.amp*je.side,je.mesh.position.y=je.baseY+Math.abs(Ne)*.025}for(const I of Z)Ge(I,0,0);ke.pedestrians=Z.length,Cn(n,(I,Ae)=>{for(const ye of Z)Ge(ye,I,Ae);for(const ye of ir){if(!ye.visible)continue;ye.userData.life-=Ae;const Ce=ye.userData.life,$=ge.clamp(Ce/ye.userData.maxLife,0,1);ye.scale.setScalar(1+(1-$)*.35),ye.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Ce<=0&&(ye.visible=!1)}})}function Jv(){const n=new it,e=new Vt;new Ii().setFromAxisAngle(new P(1,0,0),-Math.PI/2),ke.roadDetails={},ke.buildingArchetypes={},ke.zones={},ke.openerProps=0;const t=Ot.x0,i=Ot.x1,s=Ot.zNear,r=Ot.zFar,a=Ot.pitch,o=Ot.streetW,c=a-o,h=[],d=[];for(let N=t;N<=i+1;N+=a)h.push(Math.round(N));for(let N=s;N>=r-1;N-=a)d.push(Math.round(N));const f=[];for(const N of h)f.push({x0:N,z0:s,x1:N,z1:r});for(const N of d)f.push({x0:t,z0:N,x1:i,z1:N});function p(N,z){const Y=N.x1-N.x0,ee=N.z1-N.z0,ie=Math.hypot(Y,ee)||1,le=-ee/ie,b=Y/ie;return{x0:N.x0+le*z,z0:N.z0+b*z,x1:N.x1+le*z,z1:N.z1+b*z}}function m(N,z,Y){const ee=[],ie=[];for(const b of N){const U=b.x1-b.x0,V=b.z1-b.z0,X=Math.hypot(U,V),k=Math.max(1,Math.round(X/14)),oe=U/X,ae=-(V/X),j=oe;let he=null,Te=null;for(let ze=0;ze<=k;ze++){const Ee=ze/k,Ie=Ee*X/68,ct=b.x0+U*Ee,gt=b.z0+V*Ee,bt=ct+ae*z,vt=gt+j*z,We=ct-ae*z,wt=gt-j*z,ht=[bt,ve(bt,vt)+Y,vt,Ie],qt=[We,ve(We,wt)+Y,wt,Ie];he&&(ee.push(he[0],he[1],he[2],Te[0],Te[1],Te[2],qt[0],qt[1],qt[2]),ee.push(he[0],he[1],he[2],qt[0],qt[1],qt[2],ht[0],ht[1],ht[2]),ie.push(0,he[3],1,Te[3],1,qt[3]),ie.push(0,he[3],1,qt[3],0,ht[3])),he=ht,Te=qt}}const le=new Xt;return le.setAttribute("position",new St(ee,3)),le.setAttribute("uv",new St(ie,2)),le.computeVertexNormals(),le}const x=new H({map:Nv(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:xt}),M=new H({color:11054244,roughness:.62,metalness:.04}),g=new H({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),u=new H({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),_=new H({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new H({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const N of f)y.push(p(N,o*.5+3.3),p(N,-13.3)),E.push(p(N,o*.5+.42),p(N,-10.42));const T=new O(m(y,2.9,.66),M);T.receiveShadow=!0,n.add(T);const C=new O(m(E,.28,.78),g);C.receiveShadow=!0,n.add(C),Vi("roadDetails","sidewalkRuns",y.length),Vi("roadDetails","curbRuns",E.length);const R=new O(m(f,o/2,.55),x);R.receiveShadow=!0,n.add(R);const w=new H({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:xt});n.add(new O(m(f,.4,.62),w));let S=0,L=0,F=0;for(let N=1;N<h.length-1;N++)for(let z=1;z<d.length-1;z++){const Y=h[N],ee=d[z];if(!(An(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const le=new O(new _e(o*.92,.07,1.15),u);le.position.set(Y,ve(Y,ee+ie*13)+.83,ee+ie*13),le.receiveShadow=!0,n.add(le);const b=new O(new _e(1.15,.07,o*.92),u);b.position.set(Y+ie*13,ve(Y+ie*13,ee)+.83,ee),b.receiveShadow=!0,n.add(b),S+=2}}const W=new Kc;W.moveTo(0,5.8),W.lineTo(2.5,1.6),W.lineTo(.72,1.6),W.lineTo(.72,-5.2),W.lineTo(-.72,-5.2),W.lineTo(-.72,1.6),W.lineTo(-2.5,1.6),W.closePath();const Q=new yo(W);Q.rotateX(-Math.PI/2);for(const N of f){const z=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const le=(ie+.5)/ee,b=N.x0+(N.x1-N.x0)*le,U=N.z0+(N.z1-N.z0)*le;if(An(b,U,4).clearance<2)continue;const V=new O(Q,_);if(V.position.set(b,ve(b,U)+.86,U),V.rotation.y=z?0:Math.PI/2,V.scale.setScalar(.9),n.add(V),L++,ie%2===0){const X=new O(new Je(1.05,1.05,.08,24),v);X.position.set(b+(z?3.8:0),ve(b,U)+.84,U+(z?0:3.8)),n.add(X),F++}}}Vi("roadDetails","crosswalks",S),Vi("roadDetails","laneArrows",L),Vi("roadDetails","manholes",F);const te=new Tt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:xt,blending:Qn}),q=new Tt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:xt,blending:Qn});for(let N=0;N<120;N++){const z=f[Math.random()*f.length|0],Y=Math.random(),ee=z.x0+(z.x1-z.x0)*Y,ie=z.z0+(z.z1-z.z0)*Y;if(An(ee,ie,4).clearance<2)continue;const le=new O(new on(1,18),(N%4===0?q:te).clone());le.rotation.x=-Math.PI/2,le.rotation.z=Math.atan2(z.x1-z.x0,z.z1-z.z0)+(Math.random()-.5)*.35,le.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),le.position.set(ee+(Math.random()-.5)*o*.7,ve(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(le)}const Z=[js(160,320,.5),js(160,320,.62),js(160,320,.42)],ne=[new H({map:Z[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:Z[0],emissiveIntensity:.34}),new H({map:Z[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:Z[1],emissiveIntensity:.32}),new H({map:Z[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:Z[2],emissiveIntensity:.36})],de=new _e(1,1,1),me=[[],[],[]],Ge=[],I=[],Ae=[],ye=[],Ce=[],$=[],K=[],Me=[],be=[],Ne=[],je=[],It=[],Qe=[],Lt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=Ov(256,256,"#dbcdb8"),mt=Bv(),pt=kv(),Dt=[xl(512,384,"#944737","#2e95bf"),xl(512,384,"#7e4d3e","#d04d65"),xl(512,384,"#a65a35","#4fba6d")],Ze=Vv();function Nt(N,z){Vi("zones",N),Vi("buildingArchetypes",z)}function nt(N,z,Y,ee,ie,le="downtown"){if(In(N,z,Y,ee))return!1;const b=ms(N,z,Y,ee)-1.1;if(hs(N,z,Y,ee,b+ie+2))return!1;if(e.position.set(N,b+ie/2,z),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),me[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,b+ie+.6,z),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),Ge.push(e.matrix.clone()),ie>26){const U=Math.random()<.72?3790847:16730294;for(const V of[-1,1])e.position.set(N,b+ie+1.35,z+V*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),Ae.push(U);Math.random()<.34&&ye.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:b,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const U=Math.random()<.5?"x":"z";Ce.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:b,axis:U,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const U=Math.random()<.5?"x":"z";$.push({px:N,pz:z,w:Y,d:ee,h:ie,gy:b,axis:U,side:Math.random()<.5?-1:1})}return an.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+2}),Nt(le,ie>64?"glassTower":"midrise"),!0}function ut(N,z,Y,ee,ie,le="residential"){if(In(N,z,Y,ee))return!1;const b=ms(N,z,Y,ee)-.55,U=2+Math.random()*2.4;if(hs(N,z,Y,ee,b+ie+U+1.5,6))return!1;e.position.set(N,b+ie/2,z),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),K.push(e.matrix.clone()),an.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+U+1.5}),Me.push(Lt[Math.random()*Lt.length|0]),e.position.set(N,b+ie+U/2,z),e.scale.set(Y*.82,U,ee*.82),e.updateMatrix(),be.push(e.matrix.clone());const V=t+Math.round((N-t)/a)*a,X=s-Math.round((s-z)/a)*a,k=Math.abs(N-V)<Math.abs(z-X),oe=k?V>N?1:-1:X>z?1:-1,ae=Math.min(k?ee*.46:Y*.46,8.5),j=Math.min(ie*.58,4.6),he=Math.min(24,Math.max(8,k?Math.abs(V-N)-Y*.5-o*.35:Math.abs(X-z)-ee*.5-o*.35));e.quaternion.identity(),k?(e.position.set(N+oe*(Y*.5+.1),b+j*.5+.1,z-ee*.16),e.scale.set(.24,j,ae),e.updateMatrix(),Ne.push(e.matrix.clone()),e.position.set(N+oe*(Y*.5+he*.5),ve(N+oe*(Y*.5+he*.5),z)+.08,z-ee*.16),e.scale.set(he,.08,ae*1.18)):(e.position.set(N-Y*.16,b+j*.5+.1,z+oe*(ee*.5+.1)),e.scale.set(ae,j,.24),e.updateMatrix(),Ne.push(e.matrix.clone()),e.position.set(N-Y*.16,ve(N,z+oe*(ee*.5+he*.5))+.08,z+oe*(ee*.5+he*.5)),e.scale.set(ae*1.18,.08,he)),e.updateMatrix(),je.push(e.matrix.clone()),e.position.set(N,b+.02,z),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),It.push(e.matrix.clone());for(let Te=0;Te<3;Te++){const ze=k?N+oe*(Y*.55):N+(Te-1)*Y*.25,Ee=k?z+(Te-1)*ee*.28:z+oe*(ee*.55);e.position.set(ze,ve(ze,Ee)+.55,Ee);const Ie=.85+Math.random()*.75;e.scale.set(Ie*1.35,Ie,Ie*1.35),e.updateMatrix(),Qe.push(e.matrix.clone())}return Nt(le,"residentialHouse"),!0}function D(N,z,Y,ee,ie,le="commercial"){if(In(N,z,Y,ee))return!1;const b=ms(N,z,Y,ee)-.8;if(hs(N,z,Y,ee,b+ie+2,7))return!1;const U=new H({map:Ze,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),V=new O(new _e(Y,ie,ee),U);V.position.set(N,b+ie/2,z),V.castShadow=!0,V.receiveShadow=!0,n.add(V);const X=new H({color:7502722,roughness:.52,metalness:.15}),k=new O(new _e(Y*.72,.32,ee*.18),X);k.position.set(N,b+ie*.38,z+ee*.18),k.rotation.z=.13,n.add(k);const oe=new H({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let ae=5;ae<ie;ae+=9){const j=new O(new _e(Y*1.02,.24,.22),oe);j.position.set(N,b+ae,z+ee*.5+.14),n.add(j)}return an.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+2}),Nt(le,"parkingGarage"),!0}function A(N,z,Y,ee,ie,le="commercial"){if(In(N,z,Y,ee))return!1;const b=ms(N,z,Y,ee)-.65;if(hs(N,z,Y,ee,b+ie+2,7))return!1;const U=new H({map:Dt[Math.random()*Dt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),V=new O(new _e(Y,ie,ee),U);V.position.set(N,b+ie/2,z),V.castShadow=!0,V.receiveShadow=!0,n.add(V);const X=new O(new _e(Y*1.06,.9,ee*1.06),new H({color:2237478,roughness:.56,metalness:.18}));X.position.set(N,b+ie+.45,z),n.add(X);const k=t+Math.round((N-t)/a)*a,oe=s-Math.round((s-z)/a)*a,ae=Math.abs(N-k)<Math.abs(z-oe),j=ae?k>N?1:-1:oe>z?1:-1,he=Hi[(N+z|0)%Hi.length]||"#ffd45b",Te=new Tt({map:ml(Gi[(Math.abs(N)+Math.abs(z)|0)%Gi.length],he),transparent:!0,side:xt,depthWrite:!1}),ze=new O(new Wt(Math.min(16,ae?ee*.82:Y*.82),4.2),Te);return ae?(ze.position.set(N+j*(Y*.5+.2),b+ie*.66,z),ze.rotation.y=j>0?Math.PI/2:-Math.PI/2):(ze.position.set(N,b+ie*.66,z+j*(ee*.5+.2)),ze.rotation.y=j<0?Math.PI:0),n.add(ze),ds("storefront-sign",ze.position.x,ze.position.y,ze.position.z),an.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:b+ie+2}),Nt(le,"brickStorefront"),!0}for(let N=t+a/2;N<=i-a/2;N+=a)for(let z=s-a/2;z>=r+a/2;z-=a){const Y=An(N,z,c*.5).clearance;if(Y<2)continue;const ee=z>40&&z<380&&N>-360&&N<360,ie=ee?"showcase":z<-920?"industrial":Y>230||z<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const le=c/3;for(let b=0;b<3;b++)for(let U=0;U<3;U++){if(Math.random()<.08)continue;const V=N-c/2+le*(b+.5)+(Math.random()-.5)*le*.3,X=z-c/2+le*(U+.5)+(Math.random()-.5)*le*.3;if(An(V,X,8).clearance<1)continue;const k=le*(.54+Math.random()*.24),oe=le*(.54+Math.random()*.24);!ee&&Math.random()<.16?nt(V,X,k*.9,oe*.9,12+Math.random()*12,ie):ut(V,X,k,oe,5+Math.random()*4.5,ie)}}else{const le=Y>230,b=le?ge.clamp(58+Y*1.15,68,205):ge.clamp(22+Y*.3,22,66),U=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let V=0;V<U;V++){const X=15+Math.random()*Math.min(30,c*.46),k=15+Math.random()*Math.min(30,c*.46),oe=N+(Math.random()-.5)*(c-X),ae=z+(Math.random()-.5)*(c-k);if(An(oe,ae,Math.hypot(X,k)*.5).clearance<2)continue;const j=(18+Math.random()*(b-18))*(le&&Math.random()<.24?1.35:1);!le&&(Math.random()<.38&&A(oe,ae,Math.max(18,X*1.12),Math.max(18,k*1.08),12+Math.random()*14,ie)||Math.random()<.18&&D(oe,ae,Math.max(24,X*1.35),Math.max(24,k*1.28),24+Math.random()*24,ie))||nt(oe,ae,X,k,j,ie)}}}for(let N=0;N<3;N++){if(!me[N].length)continue;const z=new tn(de,ne[N],me[N].length);for(let Y=0;Y<me[N].length;Y++)z.setMatrixAt(Y,me[N][Y]);z.instanceMatrix.needsUpdate=!0,z.castShadow=!0,z.receiveShadow=!0,n.add(z)}if(Ge.length){const N=new H({color:2896696,roughness:.62,metalness:.34}),z=new tn(de,N,Ge.length);for(let Y=0;Y<Ge.length;Y++)z.setMatrixAt(Y,Ge[Y]);z.instanceMatrix.needsUpdate=!0,n.add(z)}if(I.length){const N=new H({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),z=new tn(de,N,I.length);for(let Y=0;Y<I.length;Y++)z.setMatrixAt(Y,I[Y]),z.setColorAt(Y,new rt(Ae[Y]));z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),n.add(z)}if(K.length){const N=new H({color:4891451,roughness:.88,metalness:.02}),z=new tn(de,N,It.length);for(let j=0;j<It.length;j++)z.setMatrixAt(j,It[j]);z.instanceMatrix.needsUpdate=!0,z.receiveShadow=!0,n.add(z);const Y=new H({color:12040883,roughness:.48,metalness:.05}),ee=new tn(de,Y,je.length);for(let j=0;j<je.length;j++)ee.setMatrixAt(j,je[j]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new H({map:B,roughness:.78,metalness:.03}),le=new tn(de,ie,K.length);for(let j=0;j<K.length;j++)le.setMatrixAt(j,K[j]),le.setColorAt(j,new rt(Me[j]));le.instanceMatrix.needsUpdate=!0,le.instanceColor&&(le.instanceColor.needsUpdate=!0),le.castShadow=!0,le.receiveShadow=!0,n.add(le);const b=new Ai(.72,1,4);b.rotateY(Math.PI/4);const U=new H({map:mt,color:14314033,roughness:.72}),V=new tn(b,U,be.length);for(let j=0;j<be.length;j++)V.setMatrixAt(j,be[j]);V.instanceMatrix.needsUpdate=!0,V.castShadow=!0,n.add(V);const X=new H({map:pt,roughness:.38,metalness:.18}),k=new tn(de,X,Ne.length);for(let j=0;j<Ne.length;j++)k.setMatrixAt(j,Ne[j]);k.instanceMatrix.needsUpdate=!0,n.add(k);const oe=new H({color:3112239,roughness:.88,metalness:.02}),ae=new tn(new Yt(1,8,6),oe,Qe.length);for(let j=0;j<Qe.length;j++)ae.setMatrixAt(j,Qe[j]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(ye.length,34);N++){const z=ye[N],Y=J[N%J.length],ee=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new Tt({map:Ed(Y,ee),transparent:!0,side:xt,depthWrite:!1}),le=new O(new Wt(8,24),ie);le.position.set(z.px,z.gy+Math.max(14,z.h*.58),z.pz+z.zSide*(z.d*.5+.25)),le.rotation.y=z.zSide<0?Math.PI:0,n.add(le),ds("vertical-neon",le.position.x,le.position.y,le.position.z)}for(let N=0;N<Math.min(Ce.length,48);N++){const z=Ce[N],Y=Gi[(N*5+2)%Gi.length],ee=Hi[(N*2+1)%Hi.length],ie=new Tt({map:ml(Y,ee),transparent:!0,side:xt,depthWrite:!1}),le=Math.min(17,(z.axis==="x"?z.d:z.w)*.82),b=new O(new Wt(le,4.7),ie),U=z.gy+Math.max(6.2,Math.min(z.h-3.5,z.h*(.28+N%3*.12)));z.axis==="x"?(b.position.set(z.px+z.side*(z.w*.5+.22),U,z.pz),b.rotation.y=z.side>0?Math.PI/2:-Math.PI/2):(b.position.set(z.px,U,z.pz+z.side*(z.d*.5+.22)),b.rotation.y=z.side<0?Math.PI:0),n.add(b),ds("wall-sign",b.position.x,b.position.y,b.position.z)}for(let N=0;N<Math.min($.length,18);N++){const z=$[N],Y=Gi[(N*7+4)%Gi.length],ee=ho[(N*5+3)%ho.length],ie=Hi[(N+3)%Hi.length],le=new it,b=new H({map:zu(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new rt(ie),emissiveIntensity:.34}),U=Math.min(18,(z.axis==="x"?z.d:z.w)*.86),V=new O(new _e(U,5.2,.42),b);V.position.y=4.8,le.add(V);const X=new H({color:1053978,roughness:.44,metalness:.28});for(const k of[-U*.34,U*.34]){const oe=new O(new Je(.13,.17,5,8),X);oe.position.set(k,2.25,-.2),le.add(oe)}le.position.set(z.px,z.gy+z.h+.7,z.pz),le.rotation.y=z.axis==="x"?z.side>0?Math.PI/2:-Math.PI/2:z.side<0?Math.PI:0,n.add(le),ds("roof-billboard",le.position.x,le.position.y+4.8,le.position.z)}const ce=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],pe=xc([new _e(2.2,.72,4.6).translate(0,.78,0),new _e(1.7,.56,2.15).translate(0,1.42,-.22)]),re=xc([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,z])=>new Je(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,z))),Ke=130,Le=new tn(pe,new H({roughness:.42,metalness:.36}),Ke),et=new tn(re,new H({color:1512727,roughness:.9}),Ke);let He=0,xe=0;for(;He<Ke&&xe<Ke*6;){xe++;const N=Math.random()<.5,z=N?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(An(z,Y,4).clearance<2)continue;const ee=ve(z,Y)+.06;e.position.set(z,ee,Y),e.quaternion.setFromAxisAngle($t,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Le.setMatrixAt(He,e.matrix),et.setMatrixAt(He,e.matrix),Le.setColorAt(He,new rt(ce[Math.random()*ce.length|0])),He++}Le.count=He,et.count=He,Le.instanceMatrix.needsUpdate=!0,et.instanceMatrix.needsUpdate=!0,Le.instanceColor&&(Le.instanceColor.needsUpdate=!0),Le.castShadow=!0,n.add(Le),n.add(et);const we=new Map,at=(N,z)=>`${Math.round(N)},${Math.round(z)}`;function st(N,z){const Y=((z+N.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Ve(){const N=[],z=new H({color:1120028,roughness:.38,metalness:.62}),Y=new H({color:1382685,roughness:.34,metalness:.38}),ee=Gv(),ie=new Tt({map:ee,transparent:!0,side:xt}),le=new H({color:5050642,roughness:.48,metalness:.12}),b=(ae,j)=>new H({color:ae,roughness:.16,metalness:.02,emissive:j,emissiveIntensity:.2}),U=(ae,j,he,Te,ze,Ee)=>{const Ie=new it,ct=new O(new _e(1.15,2.85,.75),Y);Ie.add(ct);const gt=b(16724008,16717836),bt=b(16767053,16757276),vt=b(4521842,1693789),We=[gt,bt,vt];for(let wt=0;wt<3;wt++){const ht=new O(new Yt(.28,12,8),We[wt]);ht.position.set(0,.78-wt*.78,-.42),Ie.add(ht)}Ie.position.set(he,Te,ze),Ie.rotation.y=Ee,ae.add(Ie),N.push({axis:j,red:gt,yellow:bt,green:vt,control:ae.userData.control})},V=(ae,j,he)=>{const Te=at(ae,j),ze={type:"signal",x:ae,z:j,phase:he%4*2.1};we.set(Te,ze);const Ee=ve(ae,j),Ie=new it;Ie.userData.control=ze;const ct=o*.72,gt=o*.72,bt=new O(new Je(.18,.24,8.2,8),z);bt.position.set(ct,4.1,gt),Ie.add(bt);const vt=new O(new _e(o*1.65,.2,.2),z);vt.position.set(ct-o*.72,8,gt),Ie.add(vt);const We=new O(new _e(.2,.2,o*1.65),z);We.position.set(ct,7.55,gt-o*.72),Ie.add(We),U(Ie,"ns",ct-o*1.24,7.52,gt,0),U(Ie,"ns",ct-o*.18,7.52,-gt,Math.PI),U(Ie,"ew",ct,7.05,gt-o*1.24,Math.PI/2),U(Ie,"ew",-ct,7.05,gt-o*.18,-Math.PI/2),Ie.position.set(ae,Ee,j),Ie.traverse(wt=>{wt.castShadow=!0,wt.receiveShadow=!0}),n.add(Ie)},X=(ae,j,he)=>{const Te=at(ae,j);we.set(Te,{type:"stop",x:ae,z:j,phase:0});const ze=ve(ae,j),Ee=new it,Ie=he%2?-1:1,ct=he%3?1:-1,gt=new O(new Je(.12,.16,4.2,7),z);gt.position.y=2.1,Ee.add(gt);const bt=new O(new on(1.04,8),le);bt.position.y=4.55,bt.rotation.y=Math.PI,Ee.add(bt);const vt=new O(new Wt(2.05,2.05),ie);vt.position.set(0,4.55,-.04),Ee.add(vt),Ee.position.set(ae+Ie*o*.74,ze,j+ct*o*.74),Ee.rotation.y=Math.atan2(Ie,ct),Ee.traverse(We=>{We.castShadow=!0,We.receiveShadow=!0}),n.add(Ee)};let k=0,oe=0;for(let ae=1;ae<h.length-1;ae++)for(let j=1;j<d.length-1;j++){const he=h[ae],Te=d[j];if(An(he,Te,o*.9).clearance<2)continue;const ze=Math.abs(he-80)<=a*1.05&&Te<=s&&Te>=-560,Ee=Te<-260&&Te>-1180&&(ae+j)%4===0,Ie=Te>-360&&(ae+j)%2===0;ze&&j%2===0||Ee?V(he,Te,k++):(Ie||(ae+j)%5===0&&Te>-820)&&X(he,Te,oe++)}return Cn(n,ae=>{for(const j of N){const he=st(j.control,ae);j.red.emissiveIntensity=he.green===j.axis||he.yellow===j.axis?.12:2.3,j.yellow.emissiveIntensity=he.yellow===j.axis?2.6:.12,j.green.emissiveIntensity=he.green===j.axis?2.6:.1}}),{trafficLights:k,stopSigns:oe}}const ot=Ve();Kv(n,f,{X0:t,X1:i,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:we}),ke.trafficLights=ot.trafficLights,ke.stopSigns=ot.stopSigns;const G=new Je(.12,.16,7.2,7),Oe=new Yt(.46,10,8),Fe=new Wt(2.8,13),De=new H({color:1581353,roughness:.42,metalness:.68}),Se=new H({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),ue=new Tt({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:xt,blending:Qn}),Xe=zv(),lt=new Xc({map:Xe,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:Qn}),Ut=132,Ct=new tn(G,De,Ut),yn=new tn(Oe,Se,Ut),pn=new tn(Fe,ue,Ut);let qn=0;for(let N=0;N<Ut*2&&qn<Ut;N++){const z=Math.random()<.5,Y=z?t+Math.round(Math.random()*((i-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(An(Y,ee,3).clearance<2)continue;const ie=ve(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Ct.setMatrixAt(qn,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),yn.setMatrixAt(qn,e.matrix);const le=new cc(lt);le.position.set(Y,ie+7.5,ee);const b=6.2+Math.random()*2.4;le.scale.set(b,b,1),n.add(le),Yi.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(z?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),pn.setMatrixAt(qn,e.matrix),qn++}Ct.count=qn,yn.count=qn,pn.count=qn,Ct.instanceMatrix.needsUpdate=!0,yn.instanceMatrix.needsUpdate=!0,pn.instanceMatrix.needsUpdate=!0,n.add(Ct,yn,pn),ke.streetLights=qn,n.add(new O(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),M)),n.add(new O(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new O(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const fa=new H({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const z=new O(new _e(1.15,.09,13.5),fa);z.position.set(80,ve(80,N)+.9,N),z.receiveShadow=!0,n.add(z)}for(const N of[286,156,26,-104])for(let z=0;z<7;z++){const Y=new O(new _e(2,.08,11.8),u),ee=71.2+z*2.95;Y.position.set(ee,ve(ee,N)+.91,N),Y.receiveShadow=!0,n.add(Y),Vi("roadDetails","openerCrosswalkStripes")}function vr(N,z,Y,ee=!1){const ie=ve(N,z),le=new it,b=new O(new Je(.16,.22,9.5,8),De);b.position.y=4.75,le.add(b);const U=new O(new _e(3.8,.22,.22),De);U.position.set(Y*1.75,8.95,0),le.add(U);const V=new O(new Yt(.62,12,8),Se);V.position.set(Y*3.6,8.82,0),le.add(V);const X=new cc(lt.clone());X.position.copy(V.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),le.add(X),Yi.streetGlowSprites++;const k=new O(new Wt(3.2,15),ue.clone());if(k.position.set(Y*2.8,.72,0),k.rotation.x=-Math.PI/2,k.scale.y=.7+Math.random()*.35,le.add(k),ee){const oe=new Qc(16762474,4.4,66,2);oe.position.copy(V.position),le.add(oe)}le.position.set(N,ie,z),n.add(le),ke.streetLights++}let si=0;for(let N=340;N>=-700;N-=118)vr(63,N,1,si++%3===0),vr(97,N-42,-1,si++%3===0);function ri(N,z,Y,ee,ie=6010942){const le=new H({color:ie,roughness:.92,metalness:.01}),b=new O(new _e(Y,.08,ee),le);return b.position.set(N,ve(N,z)+.06,z),b.receiveShadow=!0,n.add(b),ke.openerProps++,b}function ai(N,z,Y=1){const ee=ve(N,z),ie=new it,le=new O(new Je(.35,.55,5.5,8),new H({color:6832160,roughness:.88}));le.position.y=2.75,ie.add(le);const b=new H({color:6065982,roughness:.86}),U=new H({color:3959601,roughness:.9}),V=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<V.length;X++){const[k,oe,ae,j]=V[X],he=new O(new Yt(j,12,8),X%2?U:b);he.position.set(k,oe,ae),he.scale.y=.78,he.castShadow=!0,ie.add(he)}return ie.position.set(N,ee,z),ie.scale.setScalar(Y),n.add(ie),li.push({kind:"tree",x:N,z,radius:3.4*Y,maxY:ee+11*Y}),ke.openerProps++,ie}function _r(N,z,Y=0){const ee=new it,ie=new H({color:10970418,roughness:.64,metalness:.04}),le=new H({color:1910317,roughness:.46,metalness:.5});for(const b of[1.05,1.55]){const U=new O(new _e(6.8,.22,.44),ie);U.position.y=b,ee.add(U)}for(const b of[-2.7,2.7]){const U=new O(new _e(.22,1.2,.35),le);U.position.set(b,.62,0),ee.add(U)}ee.position.set(N,ve(N,z),z),ee.rotation.y=Y,n.add(ee),ke.openerProps++}function Ls(N,z){const Y=new H({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new it,ie=new O(new Je(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const le=new O(new Yt(.42,12,8),Y);le.position.y=1.32,ee.add(le);const b=new O(new Je(.16,.16,1.1,10),Y);b.rotation.z=Math.PI/2,b.position.y=.9,ee.add(b),ee.position.set(N,ve(N,z),z),n.add(ee),ke.openerProps++}function pa(N,z,Y=0){const ee=new it,ie=new H({color:1185821,roughness:.36,metalness:.68}),le=new H({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),b=new H({color:2370611,roughness:.42,metalness:.32}),U=new O(new _e(8.5,.35,3.2),b);U.position.y=4.2,ee.add(U);for(const k of[-3.8,3.8]){const oe=new O(new Je(.09,.11,4.1,7),ie);oe.position.set(k,2.05,-1.25),ee.add(oe)}const V=new O(new _e(8,2.8,.08),le);V.position.set(0,2.2,1.35),ee.add(V);const X=new O(new Wt(2.3,2.8),new Tt({map:ml("BUS","#4ff3ff"),transparent:!0,side:xt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(N,ve(N,z),z),ee.rotation.y=Y,n.add(ee),ds("bus-shelter-ad",N,ve(N,z)+2.2,z),ke.openerProps++}function sn(N,z,Y,ee,ie,le,b,U=null,V=0){if(In(N,z,Y,ee,12))return!1;const X=ve(N,z)-.45;if(hs(N,z,Y,ee,X+ie+2))return!1;const k=N<80?1:-1,oe=new H({map:js(192,512,b),color:le,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),ae=new O(new _e(Y,ie,ee),oe);ae.position.set(N,X+ie/2,z),ae.castShadow=!1,ae.receiveShadow=!0,n.add(ae);const j=new H({map:js(220,620,Math.min(.86,b+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:xt}),he=new O(new Wt(ee*.78,ie*.74),j);he.position.set(N+k*(Y/2+.09),X+ie*.54,z),he.rotation.y=k>0?Math.PI/2:-Math.PI/2,n.add(he);for(const Ee of[-1,1]){const Ie=new O(new Wt(Y*.82,ie*.72),j.clone());Ie.position.set(N,X+ie*.55,z+Ee*(ee/2+.1)),Ie.rotation.y=Ee>0?0:Math.PI,n.add(Ie)}const Te=new O(new _e(Y*1.04,1.2,ee*1.04),new H({color:1778733,roughness:.34,metalness:.38}));Te.position.set(N,X+ie+.7,z),n.add(Te);const ze=new H({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ee of[-1,1]){const Ie=new O(new _e(Y*1.1,.22,.18),ze);Ie.position.set(N,X+ie+1.4,z+Ee*(ee/2+.18)),n.add(Ie)}if(U&&V){const Ee=new Tt({map:Ed(U,U==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:xt,depthWrite:!1}),Ie=new O(new Wt(7.5,24),Ee);Ie.position.set(N+V*(Y/2+.3),X+Math.min(ie-8,ie*.58),z),Ie.rotation.y=V>0?Math.PI/2:-Math.PI/2,n.add(Ie),ds("showcase-neon",Ie.position.x,Ie.position.y,Ie.position.z)}return an.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),Nt("showcase","glassTower"),!0}function ma(N,z,Y,ee=3.2){const ie=N*.5+ee,le=z*.5+ee,b=Math.max(2,Math.abs(ie-le)*.72),U=N>=z?[-ie,0,-le,ie,0,-le,b,Y,0,-ie,0,-le,b,Y,0,-b,Y,0,ie,0,-le,ie,0,le,b,Y,0,ie,0,le,-ie,0,le,-b,Y,0,ie,0,le,b,Y,0,-b,Y,0,-ie,0,le,-ie,0,-le,-b,Y,0]:[-ie,0,-le,ie,0,-le,0,Y,-b,ie,0,-le,ie,0,le,0,Y,b,ie,0,-le,0,Y,b,0,Y,-b,ie,0,le,-ie,0,le,0,Y,b,-ie,0,le,-ie,0,-le,0,Y,-b,-ie,0,le,0,Y,-b,0,Y,b],V=new Xt;return V.setAttribute("position",new St(U,3)),V.computeVertexNormals(),V}function Mr(N,z,Y,ee,ie,le,b={}){if(In(N,z,Y,ee,12))return!1;const U=ve(N,z)-.3;if(hs(N,z,Y,ee,U+ie+(b.roofH??8.2)+1,6))return!1;const V=b.frontZ??-1,X=new H({map:B,color:b.wallColor??14734788,roughness:.68,metalness:.03}),k=new O(new _e(Y,ie,ee),X);k.position.set(N,U+ie/2,z),k.castShadow=!0,k.receiveShadow=!0,n.add(k);const oe=new H({map:mt,color:le,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ae=b.roofH??8.2,j=new O(ma(Y,ee,ae),oe);j.position.set(N,U+ie,z),j.castShadow=!0,j.receiveShadow=!0,n.add(j);const he=new H({color:15985112,roughness:.42,metalness:.05}),Te=new O(new _e(Y+7,.42,1.2),he);Te.position.set(N,U+ie+.12,z+V*(ee*.5+1.4)),n.add(Te);const ze=Te.clone();ze.position.z=z-V*(ee*.5+1.4),n.add(ze);const Ee=Math.min(18,Y*.38),Ie=new O(new _e(Ee,ie*.55,.32),new H({map:pt,roughness:.34,metalness:.2}));Ie.position.set(N+Y*.18,U+ie*.33,z+V*(ee*.5+.22)),n.add(Ie);const ct=new O(new _e(5.2,7.2,.28),new H({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ct.position.set(N-Y*.25,U+3.7,z+V*(ee/2+.24)),n.add(ct);const gt=new H({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),bt=new H({color:3353638,roughness:.38});for(const Kt of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(Kt-Y*.18)<Ee*.45)continue;const Bn=new O(new _e(6.2,4.8,.26),bt);Bn.position.set(N+Kt,U+ie*.58,z+V*(ee*.5+.28)),n.add(Bn);const zt=new O(new _e(4.8,3.4,.3),gt);zt.position.copy(Bn.position),zt.position.z+=V*.04,n.add(zt)}const vt=new H({color:12370619,roughness:.44,metalness:.04}),We=new O(new _e(Ee*1.18,.12,34),vt);We.position.set(N+Y*.18,ve(N+Y*.18,z+V*(ee*.5+17))+.11,z+V*(ee*.5+17)),n.add(We);const wt=new H({color:5679925,roughness:.86,metalness:.01}),ht=new O(new _e(Y+10,.08,ee+12),wt);ht.position.set(N,ve(N,z)-.18,z),ht.receiveShadow=!0,n.add(ht),ht.renderOrder=-1;const qt=new H({color:3042609,roughness:.84}),vi=[new H({color:16766544,roughness:.58}),new H({color:16738974,roughness:.58}),new H({color:16314584,roughness:.58})];for(let Kt=0;Kt<9;Kt++){const Bn=N-Y*.44+Kt*(Y*.11),zt=z+V*(ee*.5+2.2+Kt%2*1.5),rn=new O(new Yt(1.35+Kt%3*.22,10,7),Kt%4===0?vi[Kt%vi.length]:qt);rn.position.set(Bn,ve(Bn,zt)+.95,zt),rn.scale.y=.72,rn.castShadow=!0,n.add(rn)}return an.push({x:N,z,hw:Y*.5,hd:ee*.5,maxY:U+ie+5}),Nt("showcase","lowStorefront"),!0}return ri(45,318,36,84,6404169),ri(116,318,36,84,6074179),ri(44,188,34,84,6798662),ri(118,188,36,84,5941822),ri(43,60,34,82,5679164),ri(118,60,36,82,6864197),sn(18,315,70,54,154,2311775,.72,"HOTEL",1),sn(17,185,72,58,188,1522779,.78,null,0),sn(31,55,44,56,138,2840688,.66,"OPEN",1),sn(24,-75,52,64,182,1913933,.7,null,0),sn(145,315,68,54,116,2776440,.72,null,0),sn(146,185,70,58,146,2314602,.76,null,0),sn(142,55,42,56,156,1590364,.68,"CAFE",-1),sn(134,-75,48,64,114,3688540,.62,null,0),sn(-70,315,52,52,146,2112085,.68,null,0),sn(228,185,48,58,148,3235186,.66,null,0),sn(-78,185,48,56,134,2181730,.68,null,0),sn(236,315,44,54,104,3104884,.66,null,0),Mr(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Mr(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),sn(-48,-360,54,56,148,2439765,.58,null,0),sn(172,-430,50,56,132,3817032,.66,"OPEN",-1),ai(112,227,1.35),ai(104,221,1.05),ai(121,233,1.15),_r(112,217,0),ai(50,292,1.2),ai(111,316,.95),ai(48,137,.9),ai(116,102,1.05),_r(47,248,Math.PI/2),Ls(57,226),pa(111,260,-Math.PI/2),$e.add(n),n}function Wu(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=dt(i),c=new P(o.tangent.x,0,o.tangent.z).normalize(),h=new P().crossVectors($t,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*se.width*.5),f=t==="off"?1:-1,p=d.x+c.x*s*f+h.x*e*r,m=d.z+c.z*s*f+h.z*e*r,x=new P(p,ve(p,m)+.4,m),M=t==="off"?d:x,g=t==="off"?x:d,u=26,_=[];for(let q=0;q<=u;q++){const Z=q/u,ne=Z*Z*(3-2*Z),de=t==="off"?1-(1-Z)*(1-Z):ne;_.push(new P(ge.lerp(M.x,g.x,Z),ge.lerp(M.y,g.y,de),ge.lerp(M.z,g.z,Z)))}const v=7.4,y=new P,E=new P,T=[],C=[];for(let q=0;q<=u;q++)E.subVectors(_[Math.min(u,q+1)],_[Math.max(0,q-1)]),E.y=0,E.normalize(),y.crossVectors($t,E).normalize(),T.push(_[q].clone().addScaledVector(y,-v)),C.push(_[q].clone().addScaledVector(y,v));const R={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:_.map(q=>q.clone()),segments:[]};for(let q=0;q<u;q++){const Z=_[q],ne=_[q+1],de=ne.x-Z.x,me=ne.z-Z.z,Ge=Math.max(1e-4,de*de+me*me);R.segments.push({a:Z.clone(),b:ne.clone(),abx:de,abz:me,lenSq:Ge,u0:q/u,u1:(q+1)/u})}Ps.push(R);const w=[];for(let q=0;q<u;q++){const Z=T[q],ne=C[q],de=T[q+1],me=C[q+1];w.push(Z.x,Z.y,Z.z,ne.x,ne.y,ne.z,me.x,me.y,me.z),w.push(Z.x,Z.y,Z.z,me.x,me.y,me.z,de.x,de.y,de.z)}const S=new Xt;S.setAttribute("position",new St(w,3)),S.computeVertexNormals();const L=new H({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:xt});n.add(new O(S,L));const F=new H({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<u;q++)Tn(n,T[q].clone().setY(T[q].y+1),T[q+1].clone().setY(T[q+1].y+1),.16,F),Tn(n,C[q].clone().setY(C[q].y+1),C[q+1].clone().setY(C[q+1].y+1),.16,F);const W=new H({color:7173241,roughness:.82});for(let q=3;q<u;q+=3){const Z=_[q],ne=ve(Z.x,Z.z),de=Z.y-ne;if(de<3||In(Z.x,Z.z,3.2,3.2,1.2))continue;const me=new O(new Je(.9,1.15,de,8),W);me.position.set(Z.x,ne+de/2,Z.z),n.add(me),Gn.push({x:Z.x,z:Z.z,hw:1.3,hd:1.3,maxY:Z.y-.9})}const Q=new Tt({map:sh(a),transparent:!0,side:xt}),te=new O(new Wt(12,3),Q);te.position.copy(t==="off"?d:x).add(new P(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const Z=new O(new Je(.2,.26,6,6),W),ne=t==="off"?d:x;Z.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(Z)}}function jv(n,e=1){Wu(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function Qv(n,e=-1){Wu(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function e2(){const n=new it,e=[],t=new rt(14170671),i=new rt(15922680),s=new H({color:3883336,roughness:.6,metalness:.3}),r=new Tt({map:t2(),transparent:!0,side:xt}),a=new H({color:4926748,roughness:.9}),o=[new H({color:2055221,roughness:.92}),new H({color:3109954,roughness:.95}),new H({color:2583370,roughness:.9})],c=new H({color:7040883,roughness:.95,side:xt}),h=12,d=[],f=[];let p=0;for(let x=0;x<se.length;x+=h){if(mi(x+h*.5)){p++;continue}const M=dt(x),g=dt(x+h),u=M.p.clone().add(g.p).multiplyScalar(.5),{sideways:_,normal:v,q:y}=Ci(M,g);for(const E of[-1,1]){const T=u.clone().addScaledVector(_,E*se.width*.5).addScaledVector(v,.5);d.push(T),f.push(y),e.push(p%2===0?t:i)}if(p%16===8){const E=(p>>4)%2?1:-1,T=u.clone().addScaledVector(_,E*se.width*.52).addScaledVector(v,.4),C=new it,R=new O(new Wt(4.4,2.6),r);R.position.y=3.4,R.rotation.y=Math.PI,C.add(R);const w=new Je(.12,.16,3.4,5);for(const S of[-1.5,1.5]){const L=new O(w,s);L.position.set(S,1.7,0),C.add(L)}C.position.copy(T),C.quaternion.copy(y),n.add(C)}p++}for(let x=0;x<se.length;x+=16){const M=dt(x),g=1+(Math.random()<.5?1:0);for(let u=0;u<g;u++){const _=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,y=M.p.x+M.side.x*v*_+(Math.random()-.5)*16,E=M.p.z+M.side.z*v*_+(Math.random()-.5)*16;if(Eo(y,E,18)||In(y,E,12,12,3.5))continue;const T=ve(y,E);if(Math.random()<.78){const C=.7+Math.random()*1.5,R=new it,w=2.4+Math.random()*4.2,S=new O(new Je(.26,.42,w,6),a);S.position.y=w/2,R.add(S);const L=2+Math.floor(Math.random()*3);for(let F=0;F<L;F++){const W=new O(new Ai(2.4+Math.random()*1.6-F*.2,4.6+Math.random()*2.4,7),o[(u+F+x)%o.length]);W.position.y=w+F*1.4+1.5,W.rotation.y=Math.random()*Math.PI,R.add(W)}R.position.set(y,T+.6,E),R.scale.setScalar(C),n.add(R)}else{const C=1.4+Math.random()*3.6,R=new O(new Yc(C,0),c);R.position.set(y,T+C*.35,E),R.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),R.scale.set(1,.7+Math.random()*.4,1),n.add(R),Gn.push({kind:"rock",x:y,z:E,radius:C*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const M=se.length*x/3+6;if(mi(M))continue;const g=dt(M),u=dt(M+h),_=g.p.clone().add(u.p).multiplyScalar(.5),{q:v}=Ci(g,u),y=se.width*.5+1.2,E=9,T=new it,C=new Je(.4,.55,E,7);for(const F of[-1,1]){const W=new O(C,s);W.position.set(F*y,E/2,0),T.add(W)}const R=y*2,w=new O(new _e(R,1.1,1.1),s);w.position.y=E,T.add(w);const S=new Tt({map:sh(m[x]),transparent:!0,side:xt}),L=new O(new Wt(R*.82,3),S);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(_),T.quaternion.copy(v),n.add(T)}if(d.length){const x=new Je(.18,.24,3,6);x.translate(0,1.5,0);const M=new Yt(.34,8,6);M.translate(0,3.2,0);const g=new H({color:10134440,roughness:.7,metalness:.2}),u=new H({roughness:.55}),_=new tn(x,g,d.length),v=new tn(M,u,d.length),y=new Vt;for(let E=0;E<d.length;E++)y.position.copy(d[E]),y.quaternion.copy(f[E]),y.updateMatrix(),_.setMatrixAt(E,y.matrix),v.setMatrixAt(E,y.matrix),v.setColorAt(E,e[E]);_.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(_),n.add(v)}return jv(n),Qv(n),$e.add(n),n}function t2(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new en(n);return t.colorSpace=Et,t}function sh(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new en(e);return i.colorSpace=Et,i}function n2(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)i.fillStyle=c%2?s:r,i.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new en(t);return o.colorSpace=Et,o}function i2(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*n.width,a=Math.random()*n.height;e.fillRect(r,a,2.4,2.4)}const i=new en(n);return i.colorSpace=Et,i.wrapS=Mn,i.repeat.set(3,1),i}function Ht(n,e,t,i,s){const r=new O(new _e(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(i),r.castShadow=!1,r.receiveShadow=!0,n.add(r),r}function Ci(n,e){const t=e.p.clone().sub(n.p).normalize(),i=nh.crossVectors($t,t).normalize();let s=t.clone().cross(i).normalize();const r=(n.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new Ii().setFromAxisAngle(t,r);i.applyQuaternion(c),s.applyQuaternion(c)}const a=new At().makeBasis(i,s,t),o=new Ii().setFromRotationMatrix(a);return{tangent:t,sideways:i,normal:s,q:o}}function Ad(n,e,t,i){const s=[],r=[],a=[],o=se.width*.47;let c=0;for(let f=e;f<=t;f+=8){const p=dt(Math.min(f,t)),m=Ci(p,dt(p.s+2)),x=Math.sin(f*.018)*.04,M=p.p.clone().addScaledVector(m.sideways,-o).addScaledVector(m.normal,.46+x),g=p.p.clone().addScaledVector(m.sideways,o).addScaledVector(m.normal,.46-x);s.push(M.x,M.y,M.z,g.x,g.y,g.z);const u=(f-e)/64;if(r.push(0,u,1,u),c>0){const _=(c-1)*2,v=c*2;a.push(_,_+1,v,_+1,v+1,v)}c++}const h=new Xt;h.setAttribute("position",new St(s,3)),h.setAttribute("uv",new St(r,2)),h.setIndex(a),h.computeVertexNormals();const d=new O(h,i);d.receiveShadow=!0,n.add(d)}function s2(n,e){let t=0;for(const i of se.gaps)Ad(n,t,Math.max(t,i.start-4),e),t=i.end+4;Ad(n,t,se.length,e)}function r2(n,e,t){const i=dt(e.s+2),{normal:s,q:r}=Ci(e,i),a=new it;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new O(new _e(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new O(new _e(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const h=new O(new _e(.42,.1,3.8),t);h.position.set(0,.01,-1.9),a.add(h),n.add(a)}function a2(){const n=new it;$e.add(n),vc=0;const e=new H({color:12171149,roughness:.72,metalness:.08}),t=new H({color:9869942,roughness:.78,metalness:.05}),i=new H({color:15255629,roughness:.28,metalness:.72}),s=new H({color:8204328,roughness:.3,metalness:.85}),r=new H({color:6120040,roughness:.5,metalness:.6}),a=new H({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new H({color:14270570,roughness:.35,metalness:.65}),c=new H({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new H({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new H({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),f=new H({color:4935486,roughness:.92,metalness:.04}),p=new H({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new H({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new H({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),M=new H({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new H({color:15919561,roughness:.82,metalness:.02});new H({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const u=new H({map:Uv(),roughness:.74,metalness:.08}),_=new Tt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;s2(n,u);function y(E,T=!1){if(mi(E))return!1;const C=dt(E),R=dt(E+3),{sideways:w,normal:S,q:L}=Ci(C,R),F=C.p,W=ve(F.x,F.z),Q=F.y-.95;if(Q-W<10)return!1;const te=se.width*(T?.43:.35),q=Q,Z=W+.25,ne=T?.56:.42,de=T?2.4:1.75,me=T?.52:.36,Ge=[],I=[];for(const Me of[-1,1])if(In(F.x+w.x*Me*te,F.z+w.z*Me*te,de*2.2,de*2.2,1.2))return!1;for(const Me of[-1,1]){const be=F.clone().addScaledVector(w,Me*te).addScaledVector(S,-.85);be.y=q;const Ne=new P(be.x,Z,be.z);Tn(n,Ne,be,ne,r);const je=new O(new Je(de,de*1.12,me,12),r);je.position.set(Ne.x,W+me*.5,Ne.z),je.receiveShadow=!0,n.add(je),Ge.push(be),I.push(Ne),Gn.push({x:Ne.x,z:Ne.z,hw:de*.92,hd:de*.92,maxY:q-.7})}const Ae=F.clone().addScaledVector(S,-1.05);Ae.y=q,Ht(n,new P(se.width*.92,T?.58:.42,T?1.55:1.15),Ae,L,a);const ye=I[0].clone();ye.y+=(q-Z)*.28;const Ce=I[1].clone();Ce.y+=(q-Z)*.28;const $=Ge[0].clone();$.y-=1;const K=Ge[1].clone();if(K.y-=1,Tn(n,ye,K,T?.18:.14,c),Tn(n,Ce,$,T?.18:.14,c),T){const Me=I[0].clone();Me.y+=(q-Z)*.58;const be=I[1].clone();be.y+=(q-Z)*.58,Tn(n,I[0].clone().setY(Z+1.2),be,.16,c),Tn(n,I[1].clone().setY(Z+1.2),Me,.16,c),Tn(n,Me,K,.16,c),Tn(n,be,$,.16,c)}return vc++,!0}for(let E=0;E<se.length;E+=v){if(mi(E+v*.5))continue;const T=dt(E),C=dt(E+v),R=T.p.clone().add(C.p).multiplyScalar(.5),{sideways:w,normal:S,q:L}=Ci(T,C),F=T.p.distanceTo(C.p)+.45,W=Math.floor(E/(v*2))%2?e:t;Ht(n,new P(se.width,.62,F),R.clone().addScaledVector(S,-.05),L,W),Ht(n,new P(se.width-2.8,.08,F*.86),R.clone().addScaledVector(S,.36),L,f),Ht(n,new P(.2,.1,F*.76),R.clone().addScaledVector(w,-se.width*.19).addScaledVector(S,.43),L,f),Ht(n,new P(.2,.1,F*.76),R.clone().addScaledVector(w,se.width*.19).addScaledVector(S,.43),L,f),E%48===0&&(Ht(n,new P(.14,.08,F*.62),R.clone().addScaledVector(w,-se.width*.08).addScaledVector(S,.51),L,M),Ht(n,new P(.14,.08,F*.62),R.clone().addScaledVector(w,se.width*.08).addScaledVector(S,.51),L,M)),E%120===0&&Ht(n,new P(se.width*.42,.07,.72),R.clone().addScaledVector(S,.55),L,g),Ht(n,new P(se.width+1.2,.35,F*.94),R.clone().addScaledVector(S,-.56),L,a),Ht(n,new P(.42,.42,F*.9),R.clone().addScaledVector(w,-se.width*.36).addScaledVector(S,-.78),L,x),Ht(n,new P(.42,.42,F*.9),R.clone().addScaledVector(w,se.width*.36).addScaledVector(S,-.78),L,x);const Q=R.clone().addScaledVector(w,-se.width*.51),te=R.clone().addScaledVector(w,se.width*.51);if(Ht(n,new P(.32,.46,F),Q.clone().addScaledVector(S,.28),L,i),Ht(n,new P(.32,.46,F),te.clone().addScaledVector(S,.28),L,i),Ht(n,new P(.26,.72,F*.94),Q.clone().addScaledVector(S,-.22),L,a),Ht(n,new P(.26,.72,F*.94),te.clone().addScaledVector(S,-.22),L,a),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const Z=new O(new Je(.16,.2,.12,10),o);Z.position.copy(R).addScaledVector(w,q).addScaledVector(S,.46),Z.quaternion.copy(L),Z.castShadow=!1,n.add(Z)}if(E%72===0&&(Ht(n,new P(.34,1.56,3.4),R.clone().addScaledVector(w,-se.width*.66).addScaledVector(S,1.16),L,s),Ht(n,new P(.34,1.56,3.4),R.clone().addScaledVector(w,se.width*.66).addScaledVector(S,1.16),L,s),Ht(n,new P(.18,.18,4.4),R.clone().addScaledVector(w,-se.width*.62).addScaledVector(S,1.94),L,s),Ht(n,new P(.18,.18,4.4),R.clone().addScaledVector(w,se.width*.62).addScaledVector(S,1.94),L,s),Ht(n,new P(.12,.12,4),R.clone().addScaledVector(w,-se.width*.62).addScaledVector(S,1.38),L,i),Ht(n,new P(.12,.12,4),R.clone().addScaledVector(w,se.width*.62).addScaledVector(S,1.38),L,i),Tn(n,R.clone().addScaledVector(w,-se.width*.58).addScaledVector(S,-1.08),R.clone().addScaledVector(w,se.width*.58).addScaledVector(S,-1.08),.11,c),Tn(n,R.clone().addScaledVector(w,-se.width*.48).addScaledVector(S,-1),R.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,c),Tn(n,R.clone().addScaledVector(w,se.width*.48).addScaledVector(S,-1),R.clone().addScaledVector(w,0).addScaledVector(S,-2.2),.09,c)),E%96===0){const q=new O(new on(1,28),_);q.rotation.x=-Math.PI/2,q.position.set(R.x,-4.72,R.z),q.scale.set(se.width*.9,Math.max(10,F*2.2),1),q.rotation.z=Math.atan2(Ci(T,C).tangent.x,Ci(T,C).tangent.z),n.add(q)}if(E%144===0){const q=R.clone().addScaledVector(w,-se.width*.74).addScaledVector(S,2),Z=R.clone().addScaledVector(w,se.width*.74).addScaledVector(S,2);Tn(n,q.clone().addScaledVector(S,-1.2),q.clone().addScaledVector(S,1.1),.12,s),Tn(n,Z.clone().addScaledVector(S,-1.2),Z.clone().addScaledVector(S,1.1),.12,s),Ht(n,new P(.46,.72,.46),q.clone().addScaledVector(S,1.15),L,h),Ht(n,new P(.46,.72,.46),Z.clone().addScaledVector(S,1.15),L,h)}if(E%288===0){const q=R.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(S,5.2);Ht(n,new P(.44,.44,.44),q.clone(),L,p),Tn(n,q.clone().addScaledVector(S,-.2),R.clone().addScaledVector(S,1),.05,c)}E%48===0&&y(E+v*.5,!1),E%168===0&&!mi(E+16)&&r2(n,dt(E+5),d)}for(const E of se.gaps){const T=dt(E.start-3),C=dt(E.end+3);for(const R of[T,C]){const w=dt(R.s+2),{normal:S,q:L}=Ci(R,w);Ht(n,new P(se.width-1.2,.08,4.6),R.p.clone().addScaledVector(S,.54),L,h),Ht(n,new P(se.width*.62,.09,1.3),R.p.clone().addScaledVector(S,.62).addScaledVector(R.tangent,R===T?-6.3:6.3),L,g);for(const F of[-se.width*.42,0,se.width*.42]){const W=R.p.clone().addScaledVector(R.side,F).addScaledVector(S,2.35);Ht(n,new P(.46,.46,.46),W,L,F===0?m:h)}y(R.s+(R===T?-9:9),!0),y(R.s+(R===T?-24:24),!0)}}return n}function Xu(n=13710372,e=7740696){const t=new it,i=new H({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new H({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new H({color:329225,roughness:.52,metalness:.12}),a=new H({color:1053463,roughness:.38,metalness:.34}),o=new H({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new H({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new H({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new H({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),f=new H({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),p=new H({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),m=new H({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new H({color:329225,roughness:.44,metalness:.22}),M=new O(new on(3.65,36),new Tt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.08,M.scale.z=1.58,t.add(M);const g=(y,E,T,C,R=null,w=null)=>{const S=new O(E,T);return S.name=y,S.position.copy(C),R&&S.rotation.set(R.x||0,R.y||0,R.z||0),w&&S.scale.copy(w),t.add(S),S},u=(y,E,T,C,R,w,S=0,L=0,F=0)=>g(y,new _e(E.x,E.y,E.z),T,new P(C,R,w),new P(S,L,F));u("low black undertray",new P(5.25,.28,8.45),r,0,.45,-.08),u("wide wedge body tub",new P(4.85,.86,6.65),i,0,.98,.28,-.035),u("sloped front wedge nose",new P(3.7,.64,3.35),i,0,.83,-3.75,-.145),u("front black splitter",new P(5.25,.13,.78),r,0,.35,-5.6),u("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),u("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),u("left rear haunch",new P(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),u("right rear haunch",new P(.72,.74,2.55),i,2.53,1.18,2.08,-.04),u("left front fender flare",new P(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),u("right front fender flare",new P(.46,.54,1.38),i,2.55,.98,-2.78,-.04),u("black rear fascia",new P(4.72,.66,.2),a,0,1.02,4.04),u("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),u("front windshield",new P(2.8,.13,1.15),h,0,1.78,-1.25,-.48),u("roof glass",new P(2.34,.18,1.55),h,0,2.08,-.2,-.13),u("left side window",new P(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),u("right side window",new P(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),u("black a pillar left",new P(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),u("black a pillar right",new P(.12,.86,.14),x,1.46,1.75,-1.22,-.48),u("rear deck panel",new P(3.5,.18,2.18),i,0,1.7,2,-.2);for(let y=0;y<7;y++)u("black rear deck louver",new P(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);u("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])u("spoiler side endplate",new P(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])u("thin hood crease",new P(.08,.04,2.55),x,y*.36,1.27,-3.45,-.15),u("door seam",new P(.035,.68,1.75),x,y,1.16,-.2),u("side intake",new P(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])u("pop up headlight glass",new P(.62,.12,.18),p,y,1.02,-5.28,-.16);u("tail light backplate",new P(3.86,.46,.08),x,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])u("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(y)>1?d:f,y,1.08,4.24);u("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),u("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),u("left black roof rail",new P(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),u("right black roof rail",new P(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])u("angular side mirror arm",new P(.42,.08,.08),x,y,1.62,-1.55,0,0,y<0?-.14:.14),u("blue tinted side mirror",new P(.12,.34,.46),h,y*1.03,1.62,-1.65,0,y<0?.24:-.24),u("flush door handle",new P(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])u("left wheel arch shadow",new P(.08,.9,1.75),x,-2.82,.78,y),u("right wheel arch shadow",new P(.08,.9,1.75),x,2.82,.78,y);u("black license recess",new P(.9,.24,.08),a,0,.76,4.31);const _=[],v=(y,E,T=!1)=>{const C=new it;C.name=T?"steering front wheel assembly":"rear wheel assembly",C.position.set(y,.54,E);const R=new O(new Je(.88,.88,.62,28),r);R.name="wide performance tire",R.rotation.z=Math.PI/2,C.add(R);const w=new O(new bs(.88,.06,10,32),r);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,C.add(w);const S=new O(new Je(.42,.42,.66,24),o);S.name="chrome wheel rim",S.rotation.z=Math.PI/2,C.add(S);const L=new O(new Je(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=y>0?-.05:.05,C.add(L);for(let Q=0;Q<8;Q++){const te=new O(new _e(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=Q/8*Math.PI*2,te.position.set(y>0?.035:-.035,0,.22),C.add(te)}const F=new O(new _e(.1,.22,.18),f);F.name="small brake caliper",F.position.set(y>0?-.39:.39,.18,-.38),C.add(F);const W=new O(new Je(.17,.17,.72,18),c);W.name="dark center cap",W.rotation.z=Math.PI/2,C.add(W),t.add(C),T&&_.push(C)};for(const y of[-2.4,2.4])v(y,-2.65,!0),v(y,2.42,!1);t.userData.frontWheels=_,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new O(new Je(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),$e.add(t),t}function o2(){const n=new it,e=new H({color:3949112,roughness:.62,metalness:.3}),t=new H({color:460551,roughness:.55}),i=new H({color:3162419,roughness:.5,metalness:.42}),s=new H({color:16767297,roughness:.38,metalness:.25}),r=new H({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new H({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new H({color:1118995,roughness:.7,metalness:.05}),c=new O(new _e(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new O(new _e(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new O(new _e(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const f=new O(new Wt(2.8,.82,1,1),a);f.position.set(0,-.17,-1.08),f.rotation.x=-.36,n.add(f);const p=new O(new bs(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,n.add(p);for(let m=0;m<3;m++){const x=new O(new _e(.34,.025,.035),i);x.position.copy(p.position),x.rotation.copy(p.rotation),x.rotation.z+=m/3*Math.PI*2,n.add(x)}for(let m=0;m<6;m++){const x=new O(new Je(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),n.add(x)}for(const m of[-1.08,1.08]){const x=new O(new Je(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(m,-.68,-1.58),n.add(x);const M=new O(new bs(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(m*.8,-.48,-1.74),M.rotation.x=Math.PI/2,n.add(M)}for(const m of[-1.14,-.84,.84,1.14]){const x=new O(new Je(.035,.04,.028,8),i);x.position.set(m,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const m of[-.52,.52]){const x=new O(new Yt(.045,12,8),r);x.position.set(m,-.34,-1.22),n.add(x)}n.position.set(0,0,0),Ue.add(n),hn=n}function l2(){const n=new H({color:16119285,roughness:.35,metalness:.25}),e=new H({color:1184274,roughness:.45}),t=new H({map:Iv(),roughness:.42,metalness:.05}),i=new H({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=dt(0),r=new At().makeBasis(s.side,$t,s.tangent),a=new Ii().setFromRotationMatrix(r),o=new it;for(const d of[-se.width*.58,se.width*.58]){const f=new O(new _e(.8,11,.8),n);f.position.copy(s.p).addScaledVector(s.side,d).addScaledVector($t,5.4),f.quaternion.copy(a),o.add(f)}const c=new O(new _e(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector($t,11.2),c.quaternion.copy(a),o.add(c);const h=new O(new _e(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector($t,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(a),o.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const f=new O(new Yt(.32,16,10),i);f.position.copy(s.p).addScaledVector(s.side,d).addScaledVector($t,10.25),o.add(f)}return $e.add(o),o}function rh(n,e,t){const i={body:new H({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new H({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new H({color:329225,roughness:.52,metalness:.12}),dark:new H({color:1053463,roughness:.38,metalness:.34}),chrome:new H({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new H({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new H({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new H({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new H({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new H({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new H({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new H({color:329225,roughness:.44,metalness:.22})},s=new O(new on(3.65,36),new Tt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const r=(h,d,f,p,m=null,x=null)=>{const M=new O(d,f);return M.name=h,M.position.copy(p),m&&M.rotation.set(m.x||0,m.y||0,m.z||0),x&&M.scale.copy(x),n.add(M),M},a=(h,d,f,p,m,x,M,g,u=0,_=0,v=0)=>r(h,new _e(d,f,p),m,new P(x,M,g),{x:u,y:_,z:v}),o=[];function c(h,d,f,p=.88,m=.62){const x=new it;x.name=f?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,p*.62+.18,d);const M=new O(new Je(p,p,m,28),i.black);M.name="performance tire",M.rotation.z=Math.PI/2,x.add(M);const g=new O(new bs(p,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const u=new O(new Je(p*.48,p*.48,m+.04,24),i.chrome);u.name="chrome rim",u.rotation.z=Math.PI/2,x.add(u);const _=new O(new Je(p*.62,p*.62,.08,24),i.disc);_.name="brake disc",_.rotation.z=Math.PI/2,_.position.x=h>0?-.05:.05,x.add(_);for(let y=0;y<8;y++){const E=new O(new _e(.08,.055,m),i.chrome);E.name="wheel spoke",E.rotation.x=y/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,p*.25),x.add(E)}const v=new O(new Je(.17,.17,m+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),f&&o.push(x),x}return{mats:i,part:r,box:a,wheel:c,frontWheels:o}}function c2(n=15616818,e=2434871){const t=new it,i=rh(t,n,e),{mats:s,box:r}=i;r("low undertray",4.6,.26,9.2,s.black,0,.42,0),r("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),r("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),r("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),r("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),r("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),r("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),r("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),r("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),r("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),r("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),r("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),r("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),r("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),r("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let a=0;a<6;a++)r("engine deck vent",2.9,.1,.16,s.dark,0,1.47+a*.008,1.3+a*.42,-.05);r("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),r("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),r("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const a of[-.72,.72])r("slit headlight",.85,.09,.14,s.headLamp,a,.92,-6.1,-.1);for(const a of[-1.5,1.5])r("beltline chrome strip",.05,.06,5.4,s.chrome,a*1.36,1.3,-.4);for(const a of[-.4,.4]){const o=new O(new Je(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(a,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),$e.add(t),t}function h2(n=4165830,e=15908108){const t=new it,i=rh(t,n,e),{mats:s,box:r}=i;r("undertray",5,.3,7.6,s.black,0,.48,0),r("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),r("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),r("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),r("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),r("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),r("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),r("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),r("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),r("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),r("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),r("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),r("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),r("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const a of[-2.05,-.85,.85,2.05]){const o=new O(new Je(.21,.21,.1,18),Math.abs(a)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(a,1.28,3.78),t.add(o)}for(const a of[-1.7,1.7])r("square headlamp",.7,.3,.12,s.headLamp,a,1.22,-4.62);r("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const a of[-1,1]){const o=new O(new Je(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(a*2.62,.55,.4),t.add(o),r("side pipe heat shield",.16,.28,2.4,s.dark,a*2.62,.72,.4),r("fender flare front",.5,.6,1.6,s.body,a*2.6,1,-2.5,-.03),r("fender flare rear",.55,.68,1.9,s.body,a*2.62,1.05,2.3,-.03),r("racing stripe",.8,.02,6.8,s.trim,a*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),$e.add(t),t}function d2(n=16764159,e=526344){const t=new it,i=rh(t,n,e),{mats:s,box:r}=i;r("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),r("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),r("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),r("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),r("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),r("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),r("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),r("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),r("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),r("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),r("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),r("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),r("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),r("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),r("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const a of[-1,1]){const o=new O(new Je(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=a*.42,o.position.set(a*.75,1.85,.35),t.add(o),r("front fender pod",.62,.4,1.5,s.body,a*1.85,.95,-2.15,-.05),r("rear fender pod",.68,.46,1.7,s.body,a*1.9,1,2.15,-.05),r("pod brace arm",.5,.1,.12,s.steel,a*1.45,.98,-2.15),r("number roundel",.04,.5,.5,s.trim,a*1.79,1.05,.2)}for(const a of[-.85,.85])r("bug eye headlamp",.34,.26,.14,s.headLamp,a,1.08,-3.66),r("tail lamp block",.4,.22,.1,Math.abs(a)>.5?s.tailHot:s.tailWarm,a*1.6,1.14,3.14);{const a=new O(new Je(.15,.15,.5,14),s.chrome);a.name="single stinger exhaust",a.rotation.x=Math.PI/2,a.position.set(.65,.78,3.28),t.add(a)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(a=>{a.castShadow=!0,a.receiveShadow=!0}),$e.add(t),t}const As=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>Xu(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>c2()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>h2()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>d2()}];let Ji=ge.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function $i(){return As[Ji].stats}const qu=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],On=qu.map((n,e)=>({...n,idx:e,mesh:Xu(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),u2=On[0].mesh;let Pt=As[Ji].build();function f2(n){Ji=ge.clamp(n,0,As.length-1),localStorage.setItem("steel-ribbon-carmodel",String(Ji));const e=Pt.visible;Qs(Pt),Pt=As[Ji].build(),Pt.visible=e,typeof Ac=="function"&&Ac()}for(const n of On)n.mesh.visible=!1,$e.add(n.mesh);function Co(n){for(const e of On)e.mesh.visible=n}const p2=[10,6,4,2];let Ft=null;try{Ft=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function da(){return Ft?.active?Ft.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function Yu(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Ft))}function m2(){Ft={division:da(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},Yu()}function $u(n){return["One","Two","Three","Four"][ge.clamp(n,1,4)-1]}function Zu(){return[{key:"you",label:"You",pts:Ft?.points.you??0},...qu.map(e=>({key:e.key,label:e.label,pts:Ft?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Pt.visible=!1;qv();Xv();ke.signs=0;fo.length=0;Yv();$v();Jv();let Cd=null,Rd=null,Pd=null,hn=null,vl=null;const Zt=[];o2();function Qs(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),$e.remove(n))}const sr=[],aa=[];let Ld=null;function x2(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new en(n);return t.colorSpace=Et,t}function g2(n,e){if(mi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of Ps)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function v2(n){const e=new H({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:xt}),t=new Je(.09,.12,1.05,6),i=new H({color:4210757,roughness:.55,metalness:.5}),s=6;let r=0,a=0;const o=new tn(t,i,Math.ceil(se.length/12*2)+8),c=new Vt;for(const h of[-1,1]){const d=h*(se.width*.5+.55),f=[],p=x=>{if(!(x.length<2)){for(let M=0;M<x.length-1;M++){const g=x[M],u=x[M+1];f.push(g.x,g.y+1.12,g.z,u.x,u.y+1.12,u.z,u.x,u.y+1.5,u.z),f.push(g.x,g.y+1.12,g.z,u.x,u.y+1.5,u.z,g.x,g.y+1.5,g.z)}r++}};let m=[];for(let x=0;x<=se.length;x+=s){if(g2(x%se.length,h)){p(m),m=[];continue}const M=dt(x%se.length);if(m.push(M.p.clone().addScaledVector(M.side,d).addScaledVector($t,.58)),x%12===0){const g=m[m.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(a++,c.matrix)}}if(p(m),f.length){const x=new Xt;x.setAttribute("position",new St(f,3)),x.computeVertexNormals(),n.add(new O(x,e))}}o.count=a,o.instanceMatrix.needsUpdate=!0,n.add(o),ke.railRuns=r,ke.railPosts=a}function _2(){sr.length=0,aa.length=0;const n=new it,e=new Tt({map:x2(),transparent:!0,depthWrite:!1,side:xt,blending:Qn,opacity:.9}),t=new Wt(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][sr.length%3]*se.width,d=dt(c),f=new O(t,e),p=new P().crossVectors(d.side,d.tangent).normalize();p.y<0&&p.multiplyScalar(-1);const m=new At().makeBasis(d.side,p,new P().crossVectors(d.side,p).normalize());f.quaternion.setFromRotationMatrix(m),f.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(p,.84),n.add(f),sr.push({s:c,lat:h})}const i=new Yt(.17,8,6),s=new H({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),r=Math.max(60,Math.round(se.length/24));{const c=new tn(i,s,r*2),h=new Vt;let d=0;for(let f=0;f<r;f++){const p=f/r*se.length;if(mi(p))continue;const m=dt(p);for(const x of[-1,1])h.position.copy(m.p).addScaledVector(m.side,x*(se.width*.5+.22)).addScaledVector($t,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const a=new Je(.09,.12,1.5,8),o=new H({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=dt(Math.max(6,c.start-22));for(const d of[-1,1]){const f=new H({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),p=new it,m=new O(a,o),x=new O(new Yt(.3,10,8),f);m.position.y=.75,x.position.y=1.65,p.add(m),p.add(x),p.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector($t,.55),n.add(p),aa.push(f)}}return v2(n),$e.add(n),n}Cn(new Vt,n=>{if(!aa.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of aa)t.emissiveIntensity=e});function ua(n){return Ki=ge.clamp(n,0,ws.length-1),se=ws[Ki],Gn.length=0,Ps.length=0,Qs(Cd),Qs(Rd),Qs(Pd),Qs(Ld),Cd=a2(),Rd=l2(),Pd=e2(),Ld=_2(),ah(),qe.trackName.textContent=se.name,qe.courseName&&(qe.courseName.textContent=se.name),qe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Ki)}),se.name}ua(0);function M2(){vl&&$e.remove(vl),Zt.length=0;const n=new it,e=new H({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Tt({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:xt,blending:Qn}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const r=i[s],a=ve(r.x,r.z)+4.2,o=new it,c=new O(new bs(5.6,.22,12,52),e.clone());c.rotation.y=r.yaw,o.add(c);const h=new O(new on(4.7,32),t.clone());h.rotation.y=r.yaw,o.add(h);const d=new H({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new O(new Je(.11,.16,6.2,8),d);m.position.set(Math.cos(r.yaw)*p,-1.1,Math.sin(r.yaw)*p),o.add(m)}const f=new O(new Yt(.45,16,10),e.clone());f.position.y=4.1,o.add(f),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,n.add(o),Zt.push({...r,y:a,radius:8.5,marker:o,collected:!1})}Cn(n,s=>{for(let r=0;r<Zt.length;r++){const a=Zt[r],o=r===l.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),$e.add(n),vl=n}M2();function y2(){const n=new it,e=new H({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,r=-1330+Math.random()*1620,a=15+Math.random()*12;if(In(s,r,a*2+14,a*2+14,10)||An(s,r,a).clearance<-6||Zt.some(d=>Math.hypot(d.x-s,d.z-r)<a+26)||Es.some(d=>Math.hypot(d.x-s,d.z-r)<d.rx+a+60)||an.some(d=>Math.abs(d.x-s)<d.hw+a+2&&Math.abs(d.z-r)<d.hd+a+2)||li.some(d=>{const f=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-r)<f+a+2})||nr.some(d=>Math.hypot(d.x-s,d.z-r)<(d.radius||4)+a+2))continue;const o=ve(s,r);if(Math.max(Math.abs(ve(s+a,r)-o),Math.abs(ve(s-a,r)-o),Math.abs(ve(s,r+a)-o),Math.abs(ve(s,r-a)-o))>1.7)continue;const c=new O(new Mo(a*.96,a*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,r),c.renderOrder=-4,n.add(c);const h=new O(new on(a,36),Bu(Math.max(1.2,a/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,r),h.renderOrder=-3,n.add(h),ku(s,r,a*.98),t++}ke.ponds=t,$e.add(n),ah()}y2();const zn=Hu(3375807,15905331);zn.visible=!1,zn.scale.setScalar(1.06),$e.add(zn);const Di=new P(0,0,0);let Mc=0,fe=null;function S2(){const n=new it,e=new H({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new H({color:1710623,roughness:.5,metalness:.3}),i=new H({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new H({color:5860442,roughness:.25,metalness:.8}),r=new H({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),a=(h,d,f,p,m,x,M=0,g=0,u=0)=>{const _=new O(d,f);return _.name=h,_.position.set(p,m,x),_.rotation.set(M,g,u),n.add(_),_};a("cabin hull",new _e(2.5,2,4.4),e,0,2.1,-.4),a("cabin floor pan",new _e(2.6,.4,4.8),t,0,1.05,-.3),a("nose glass",new _e(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),a("left door glass",new _e(.1,1.1,2),i,-1.28,2.3,-.7),a("right door glass",new _e(.1,1.1,2),i,1.28,2.3,-.7),a("roof turbine housing",new _e(1.5,.8,2.4),t,0,3.4,-.2),a("exhaust stub",new Je(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),a("tail boom",new _e(.55,.6,4.6),e,0,2.7,3.4,.02),a("tail fin",new _e(.14,1.5,1),e,0,3.4,5.5,0,0,0),a("tail plane",new _e(1.5,.12,.6),e,0,3,4.6),a("nose lamp",new _e(.5,.2,.12),r,0,1.6,-2.95);for(const h of[-1,1])a("skid rail",new _e(.16,.16,4.4),s,h*1.15,.32,-.4),a("skid strut front",new _e(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),a("skid strut rear",new _e(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);a("rotor hub",new Je(.22,.28,.5,10),s,0,3.95,-.2);const o=new it;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new O(new _e(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new it;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new O(new _e(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function b2(){let n=null;for(let d=0;d<700&&!n;d++){const f=-520+Math.random()*1040,p=-1200+Math.random()*1500;if(Math.hypot(f-80,p-300)>(d<350?420:1200)||In(f,p,26,26,6))continue;const m=ve(f,p);Math.max(Math.abs(ve(f+11,p)-m),Math.abs(ve(f-11,p)-m),Math.abs(ve(f,p+11)-m),Math.abs(ve(f,p-11)-m))>.8||an.some(x=>Math.abs(x.x-f)<x.hw+13&&Math.abs(x.z-p)<x.hd+13)||nr.some(x=>Math.hypot(x.x-f,x.z-p)<(x.radius||4)+13)||Es.some(x=>Math.hypot(x.x-f,x.z-p)<x.rx+16)||Zt.some(x=>Math.hypot(x.x-f,x.z-p)<24)||An(f,p,12).clearance<2||(n={x:f,z:p,y:m})}n||(n={x:150,z:330,y:ve(150,330)});const e=new it,t=new H({color:4671310,roughness:.85,metalness:.05}),i=new O(new Je(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const r=s.getContext("2d");r.strokeStyle="#ffd45b",r.lineWidth=12,r.beginPath(),r.arc(128,128,104,0,Math.PI*2),r.stroke(),r.fillStyle="#ffd45b",r.font="900 150px Arial",r.textAlign="center",r.textBaseline="middle",r.fillText("H",128,136);const a=new en(s);a.colorSpace=Et;const o=new O(new on(9.6,36),new Tt({map:a,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new H({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const f=d/8*Math.PI*2,p=new O(new Yt(.22,8,6),c);p.position.set(n.x+Math.cos(f)*10.2,n.y+.34,n.z+Math.sin(f)*10.2),e.add(p)}$e.add(e);const h=S2();h.mesh.position.set(n.x,n.y+.24,n.z),$e.add(h.mesh),fe={pad:n,pos:new P(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new P,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},fe.mesh.quaternion.setFromAxisAngle($t,-fe.yaw),ke.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}b2();Cn(new Vt,(n,e)=>{if(!fe)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;fe.rpm+=(t-fe.rpm)*Math.min(1,e*(t?1.4:.5)),fe.rotor.rotation.y+=fe.rpm*26*e,fe.tailRotor.rotation.x+=fe.rpm*42*e});const w2=new Tt({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),no=Array.from({length:42},()=>{const n=new O(new Yt(.14,6,5),w2);return n.visible=!1,$e.add(n),{mesh:n,life:0,velocity:new P}}),T2=new Tt({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:xt}),yc=Array.from({length:14},()=>{const n=new O(new Mo(.82,1,28),T2.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,$e.add(n),{mesh:n,life:0,maxLife:1}});function Ku(n,e,t=1){const i=yc.find(s=>s.life<=0)||yc[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,ve(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function E2(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=no.find(r=>r.life<=0)||no[i%no.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}Ku(n.x,n.z,1.6)}Cn(new Vt,(n,e)=>{for(const t of no)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of yc)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const gr=new wv(Jt);gr.addPass(new Tv($e,Ue));const Ju=new ur(new Pe(window.innerWidth,window.innerHeight),.4,.72,.86);gr.addPass(Ju);gr.addPass(new Ev);const A2={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Nr=new Lu(A2);gr.addPass(Nr);const C2=new H({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Gr=Array.from({length:72},()=>{const n=new O(new Yt(.1,8,5),C2);return n.visible=!1,$e.add(n),{mesh:n,life:0,velocity:new P}}),R2=new Tt({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:xt}),Hr=Array.from({length:90},()=>{const n=new O(new on(1,18),R2.clone());return n.visible=!1,$e.add(n),{mesh:n,life:0,maxLife:1,velocity:new P,spin:0}}),P2=new H({color:2962232,roughness:.58,metalness:.34}),Wr=Array.from({length:48},()=>{const n=new O(new _e(.18,.08,.26),P2);return n.visible=!1,$e.add(n),{mesh:n,life:0,velocity:new P,spin:new P}});let Ye=null;function ju(){if(Ye)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=(M,g)=>{const u=n.createOscillator(),_=n.createGain();return u.type=M,_.gain.value=g,u.connect(_),_.connect(t),u.start(),{o:u,g:_}},r=s("sawtooth",.5),a=s("square",.26),o=s("triangle",.1),c=n.createBuffer(1,n.sampleRate*2,n.sampleRate),h=c.getChannelData(0);for(let M=0;M<h.length;M++)h[M]=Math.random()*2-1;const d=(M,g,u,_)=>{const v=n.createBufferSource(),y=n.createBiquadFilter(),E=n.createGain();return v.buffer=c,v.loop=!0,v.playbackRate.value=_,y.type=M,y.frequency.value=g,y.Q.value=u,E.gain.value=1e-4,v.connect(y),y.connect(E),E.connect(e),v.start(),{filter:y,gain:E}},f=d("bandpass",900,.6,1),p=d("highpass",1800,.8,.82),m=d("bandpass",300,1.4,.5),x=n.createGain();x.gain.value=1e-4,x.connect(e),Ye={ctx:n,master:e,engine:r.o,engineGain:i,filter:t,rumble:r,growl:a,whine:o,wind:f,skid:p,boost:m,musicGain:x,nextNote:0,beat:0,prevBoost:!1}}function Cs(){Ye||ju(),Ye?.ctx.state==="suspended"&&Ye.ctx.resume().catch(()=>{})}function Xr(n){if(!Ye)return;const{ctx:e}=Ye,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Ye.master),t.start(),t.stop(e.currentTime+.24)}function L2(){if(!Ye)return;const{ctx:n}=Ye,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Ye.master),e.start(),e.stop(n.currentTime+.6)}function D2(){if(!Ye)return;const n=Ye.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=Qu(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Ye.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),r=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),r.gain.setValueAtTime(.22,n.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(r).connect(Ye.master),s.start(),s.stop(n.currentTime+.26)}let _l=null;function Qu(){if(_l)return _l;const n=Ye.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return _l=e}function I2(n=1){if(!Ye)return;const{ctx:e}=Ye,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=Qu(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Ye.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Dd={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function Id(n,e,t,i,s,r){const{ctx:a}=Ye,o=a.createOscillator(),c=a.createBiquadFilter(),h=a.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=r,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(Ye.musicGain),o.start(e),o.stop(e+t+.05)}function U2(){const{ctx:n}=Ye,e=60/92/2;for(Ye.nextNote<n.currentTime-1&&(Ye.nextNote=n.currentTime+.08);Ye.nextNote<n.currentTime+.35;){const t=Ye.beat%32,i=t/8|0;t%4===0&&Id(Dd.bass[i],Ye.nextNote,.5,"triangle",.5,420),Id(Dd.arps[i][t%4],Ye.nextNote,.19,"sawtooth",.16,1300),Ye.nextNote+=e,Ye.beat++}}function rr(n,e=18){const t=Math.min(e,Gr.length);for(let i=0;i<t;i++){const s=Gr.find(r=>r.life<=0)||Gr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function ef(n,e=10,t=1){const i=Math.min(e,Hr.length);for(let s=0;s<i;s++){const r=Hr.find(a=>a.life<=0)||Hr[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function F2(n,e=8,t=1){const i=Math.min(e,Wr.length);for(let s=0;s<i;s++){const r=Wr.find(a=>a.life<=0)||Wr[s];r.mesh.visible=!0,r.mesh.position.copy(n).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function N2(n,e=Math.abs(l.speed),t="CRASH"){const i=ge.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=ge.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),rr(n,Math.round(10+i*24)),ef(n,Math.round(5+i*12),i),F2(n,Math.round(3+i*8),i),Xr(18+i*34)}function z2(n){for(const e of Gr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of Hr){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Ue.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of Wr)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function O2(){if(!Ye)return;const{ctx:n}=Ye,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,r=ge.clamp((s-900)/6600,0,1),a=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=i?26+(fe?.rpm||0)*14:46+r*142;Ye.rumble.o.frequency.setTargetAtTime(c,e,.03),Ye.growl.o.frequency.setTargetAtTime(i?c*2:c*1.5+3.2,e,.03),Ye.whine.o.frequency.setTargetAtTime(i?620+a*4:c*4.03,e,.03),Ye.whine.g.gain.setTargetAtTime(i?.12:.04+r*.17,e,.08),Ye.filter.frequency.setTargetAtTime((420+r*2400+a*5)*(1-.6*o),e,.06),Ye.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.05+r*.052:1e-4)*(1-.42*o),e,.07),Ye.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(a-55)/850)):1e-4,e,.15),Ye.wind.filter.frequency.setTargetAtTime(700+a*8,e,.12);const h=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0;Ye.skid.gain.gain.setTargetAtTime(t&&h>.32?(h-.32)*.15:1e-4,e,.09),l.boosting&&!Ye.prevBoost&&L2(),Ye.prevBoost=!!l.boosting,Ye.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),Ye.boost.filter.frequency.setTargetAtTime(l.boosting?420+a*3:260,e,.1),Ye.musicGain.gain.setTargetAtTime(l.mode==="menu"?.16:.028,e,.5),U2()}function oa(n=!1,e=!1,t=!1){ju(),Cs(),tt.clear(),ca();const i=n||e;l.seasonRace=t&&!i;for(let r=0;r<On.length;r++){const a=On[r];a.distance=i?-900:-26-r*7,a.finished=0,a.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=dt(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],s_(),r_(),qe.menu.classList.add("hidden"),qe.result.classList.add("hidden"),qe.resultStats.innerHTML="",qe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",qe.trackName.textContent=se.name,Pt.visible=!1,hn&&(hn.visible=!0),document.body.classList.remove("roam-mode"),Ui(),window.__freeCam=!1}function po(){Cs(),l.mode="roam",l.practice=!0,l.freeRun=!1,tt.clear(),ca();let n=80,e=338;An(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,ve(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Re.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",zn.visible=!1,fe&&(fe.pos.set(fe.pad.x,fe.pad.y+.24,fe.pad.z),fe.vel.set(0,0,0),fe.mesh.position.copy(fe.pos));for(const s of Zt)s.collected=!1;l.message="",l.messageTimer=0,Co(!1),Pt.visible=!0,hn&&(hn.visible=!1),document.body.classList.add("roam-mode"),Ui(),window.__freeCam=!1,qe.menu.classList.add("hidden"),qe.result.classList.add("hidden"),qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",ji();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);Ue.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),Tc(),Ue.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),Ue.fov=69,Ue.updateProjectionMatrix()}function ji(){Pt.position.set(l.roamPos.x,l.roamPos.y+.3-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),Pt.quaternion.setFromAxisAngle($t,-l.roamYaw),Pt.rotateZ(-l.wheelSteer*ge.clamp(Math.abs(l.speed)/90,0,1)*.1),Pt.rotateX(l.roamAir?ge.clamp(-l.roamVy*.014,-.3,.34):ge.clamp(l.roamSuspension,-.16,.22))}function tf(n,e){let t=null;for(const s of Ps)for(const r of s.segments){const a=n-r.a.x,o=e-r.a.z,c=ge.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),h=r.a.x+r.abx*c,d=r.a.z+r.abz*c,f=Math.hypot(n-h,e-d);if(f>s.halfW+gn*1.15)continue;const p=ge.lerp(r.a.y,r.b.y,c),m=ge.lerp(r.u0,r.u1,c),x=f+Math.max(0,ve(n,e)-p)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function nf(n,e,t=ve(n,e),i=!1){let s=null;const r=10;for(let o=0;o<se.length;o+=r){if(mi(o+r*.5))continue;const c=dt(o),h=dt(o+r),d=h.p.x-c.p.x,f=h.p.z-c.p.z,p=Math.max(1e-4,d*d+f*f),m=ge.clamp(((n-c.p.x)*d+(e-c.p.z)*f)/p,0,1),x=c.p.x+d*m,M=c.p.z+f*m,g=n-x,u=e-M,_=Math.hypot(g,u);if(_>se.width*.5+gn*.45)continue;const v=ge.lerp(c.p.y,h.p.y,m)+.58;if(!i&&t<v-5)continue;const y=new P(f,0,-d).normalize(),E=ge.clamp(g*y.x+u*y.z,-se.width*.44,se.width*.44);(!s||_<s.dist)&&(s={kind:"track",y:v,s:o+r*m,lateral:E,tangentX:d,tangentZ:f,dist:_})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function xs(n,e,t=l.roamPos.y){const i=ve(n,e);let s={kind:"ground",y:i};const r=tf(n,e);r&&r.y>=i-1.2&&(s=r);const a=nf(n,e,Math.max(t,s.y));return!(s.kind==="ramp"&&s.rampType==="off")&&a&&a.y>=s.y-.8&&(s=a),s}function Ud(n){if(n.rampType==="off")return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=dt(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=ge.clamp(n.lateral??0,-se.width*.32,se.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=ge.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),Co(!1),Pt.visible=!1,hn&&(hn.visible=!0),document.body.classList.remove("roam-mode"),Ui(),qe.position.textContent="FREE RUN",qe.trackName.textContent=se.name,ji(),!0}function B2(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,r=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+Xn,t.z+r*3.5),l.roamYaw=Math.atan2(s,-r),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=ge.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),Co(!1),Pt.visible=!0,hn&&(hn.visible=!1),document.body.classList.add("roam-mode"),Ui(),l.vehicle="car",zn.visible=!1,qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",ji();const a=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return Ue.position.set(l.roamPos.x-a*17,l.roamPos.y+7.2,l.roamPos.z-o*17),Ue.lookAt(l.roamPos.x+a*13,l.roamPos.y+2.45,l.roamPos.z+o*13),Ue.fov=69,Ue.updateProjectionMatrix(),rr(l.roamPos.clone().add(new P(0,.6,0)),10),!0}function k2(){const n=To.set(0,0,-1).applyQuaternion(Ue.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",altitude:+(l.roamPos.y-ve(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Re.steer,throttle:Re.throttle,brake:Re.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var Ms=document.createElement("canvas");Ms.id="minimap",Ms.width=256,Ms.height=256;document.querySelector("#app")?.appendChild(Ms);var Sc=null,V2=0,gs={cx:0,cz:-570,span:2180};function Ln(n,e,t){return[((n-gs.cx)/gs.span+.5)*t,((e-gs.cz)/gs.span+.5)*t]}function ah(){if(!gs)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Ot.x0;s<=Ot.x1+1;s+=Ot.pitch){const[r,a]=Ln(s,Ot.zNear,n),[o,c]=Ln(s,Ot.zFar,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,c),t.stroke()}for(let s=Ot.zNear;s>=Ot.zFar-1;s-=Ot.pitch){const[r,a]=Ln(Ot.x0,s,n),[o,c]=Ln(Ot.x1,s,n);t.beginPath(),t.moveTo(r,a),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Ao())if(s.courseIndex===Ki){const[r,a]=Ln(s.x,s.z,n);i?t.moveTo(r,a):t.lineTo(r,a),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of Es){const[r,a]=Ln(s.x,s.z,n);t.beginPath(),t.ellipse(r,a,Math.max(3,s.rx/gs.span*n),Math.max(3,s.rz/gs.span*n),0,0,Math.PI*2),t.fill()}Sc=e}function G2(){const n=l.mode==="roam";if((Ms.style.display=n?"block":"none")&&!n||!n||!Sc||V2++%2)return;const e=Ms.width,t=Ms.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(Sc,0,0,e,e);for(const r of Ps)if(r.rampType==="on"&&r.points?.length){const a=r.points[0],[o,c]=Ln(a.x,a.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let r=0;r<Zt.length;r++){const a=Zt[r],[o,c]=Ln(a.x,a.z,e),h=r===l.objectiveIndex%Zt.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(uo*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const r of Un){const[a,o]=Ln(r.x,r.z,e);t.fillRect(a-1.4,o-1.4,2.8,2.8)}if(fe){const[r,a]=Ln(fe.pad.x,fe.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",r,a+4),l.vehicle!=="heli"){const[o,c]=Ln(fe.pos.x,fe.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"){const[r,a]=Ln(Di.x,Di.z,e);t.fillStyle="#7dc4ff",t.fillRect(r-2.4,a-2.4,4.8,4.8)}const[i,s]=Ln(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}ah();let ls=null;function H2(){ls||(ls=new O(new Je(2.4,3.2,620,12,1,!0),new Tt({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:Qn,side:xt,fog:!1})),ls.renderOrder=5,$e.add(ls));const n=l.mode==="roam"&&Zt.length>0;if(ls.visible=n,!n)return;const e=Zt[l.objectiveIndex%Zt.length];ls.position.set(e.x,e.y+296,e.z),ls.material.opacity=.1+Math.sin(uo*3.1)*.04}function oh(){if(l.mode!=="roam"||Zt.length===0)return;const n=Zt[l.objectiveIndex%Zt.length];if(!n)return;const e=l.roamPos.x-n.x,t=l.roamPos.z-n.z,i=Math.abs(l.roamPos.y-n.y);e*e+t*t>n.radius*n.radius||i>8.5||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%Zt.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,_s(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),Ts(880,.16),setTimeout(()=>Ts(1245,.2),90),rr(new P(n.x,n.y,n.z),18))}function sf(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(tt.has("KeyW")||tt.has("ArrowUp")?1:0,Re.throttle),i=Math.max(tt.has("KeyS")||tt.has("ArrowDown")?1:0,Re.brake),s=ge.clamp((tt.has("KeyD")||tt.has("ArrowRight")?1:0)-(tt.has("KeyA")||tt.has("ArrowLeft")?1:0)+Re.steer,-1,1)*Uu,r=(tt.has("ShiftLeft")||tt.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const y=l.speed<0?38:0;l.speed+=((r?70:42)*$i().accel+y)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=ge.clamp(l.speed,-24,135*$i().top),l.boosting=r,r?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*$i().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n));const a=-l.wheelSteer*.55,o=Pt.userData.frontWheels;o&&(o[0].rotation.y=a,o[1].rotation.y=a);const c=Math.abs(l.speed),h=tt.has("Space")&&!l.roamAir;if(c>gc){const y=ge.clamp((c-gc)/5,0,1),E=1-.36*ge.clamp((c-34)/85,0,1),T=Rv*1.08*y*E*(h?1.85:1)*$i().grip;l.roamYaw+=l.wheelSteer*T*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=ge.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),f=Math.sin(d),p=-Math.cos(d),m=(l.speed-e)/Math.max(.001,n),x=ge.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-m-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(m)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const y=new P(l.roamPos.x-f*3.2,l.roamPos.y+.2,l.roamPos.z-p*3.2);ef(y,2,l.roamSlip)}const M=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(M/1.2));let u=!1,_=!1,v=xs(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let y=0;y<g;y++)l.roamPos.x+=f*l.speed*n/g,l.roamPos.z+=p*l.speed*n/g,v=xs(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Xn),j2(l.roamPos,v)&&(_=!0),hf(l.roamPos,v)&&(u=!0),v=xs(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+Xn);l.roamPos.x=ge.clamp(l.roamPos.x,-820,820),l.roamPos.z=ge.clamp(l.roamPos.z,-1620,480),u&&(l.collisionCooldown<=0&&(N2(new P(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),_&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9),lf(n,e),q2(n,h,u),$2(n,u),v=xs(l.roamPos.x,l.roamPos.z,l.roamPos.y),Y2(n,v),!(v.kind==="ramp"&&v.u>.72&&Ud(v))&&(v.kind==="track"&&Ud(v)||(oh(),ji(),tt.has("KeyR")&&(po(),tt.delete("KeyR"))))}function bc(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;Di.copy(l.roamPos),Mc=l.roamYaw,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=ve(l.roamPos.x,l.roamPos.z)+.05,zn.visible=!0,l.message="On foot — E enters the car or helicopter",l.messageTimer=1.6,!0}function rf(){return l.vehicle!=="foot"||l.roamPos.distanceTo(Di)>7?!1:(l.vehicle="car",l.roamPos.copy(Di),l.roamYaw=Mc,l.camYaw=Mc,l.speed=0,zn.visible=!1,ji(),!0)}function af(){return l.vehicle!=="foot"||!fe||l.roamPos.distanceTo(fe.pos)>9?!1:(l.vehicle="heli",l.roamPos.copy(fe.pos),l.roamYaw=fe.yaw,l.camYaw=fe.yaw,l.speed=0,fe.vel.set(0,0,0),zn.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function wc(){if(l.vehicle!=="heli"||!fe)return!1;const n=ve(fe.pos.x,fe.pos.z);return fe.pos.y-n>4.2||fe.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",l.roamPos.x=fe.pos.x+Math.cos(fe.yaw)*-4.2,l.roamPos.z=fe.pos.z+Math.sin(fe.yaw)*-4.2,l.roamPos.y=ve(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,zn.visible=!0,!0)}function of(){l.mode==="roam"&&(l.vehicle==="car"?bc()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?rf()||af():wc())}function W2(n){const e=Math.max(tt.has("KeyW")||tt.has("ArrowUp")?1:0,Re.throttle),t=Math.max(tt.has("KeyS")||tt.has("ArrowDown")?1:0,Re.brake),i=ge.clamp((tt.has("KeyD")||tt.has("ArrowRight")?1:0)-(tt.has("KeyA")||tt.has("ArrowLeft")?1:0)+Re.steer,-1,1),s=tt.has("ShiftLeft")||tt.has("ShiftRight"),r=l.speed,a=(e-t)*(s?14.5:6.4);l.speed+=(a-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,hf(l.roamPos,{kind:"ground"}),l.roamPos.x=ge.clamp(l.roamPos.x,-820,820),l.roamPos.z=ge.clamp(l.roamPos.z,-1620,480),l.roamPos.y=ve(l.roamPos.x,l.roamPos.z)+.05,lf(n,r),oh(),zn.position.copy(l.roamPos),zn.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*ge.clamp(Math.abs(l.speed)/5,0,1);for(const p of zn.userData.limbs||[])p.mesh.rotation.x=h*p.amp*p.side*2.2,p.mesh.position.y=p.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(Di)<7,f=fe&&l.roamPos.distanceTo(fe.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):f&&(l.message="E — enter helicopter",l.messageTimer=.2))}function X2(n){if(!fe)return;const e=Math.max(tt.has("KeyW")||tt.has("ArrowUp")?1:0,Re.throttle)-Math.max(tt.has("KeyS")||tt.has("ArrowDown")?1:0,Re.brake),t=ge.clamp((tt.has("KeyA")||tt.has("ArrowLeft")?1:0)-(tt.has("KeyD")||tt.has("ArrowRight")?1:0)-Re.steer,-1,1),i=fe.rpm>.55,s=tt.has("ShiftLeft")||tt.has("ShiftRight"),r=wo?s?1:fe.pos.y-ve(fe.pos.x,fe.pos.z)>6?-.45:0:tt.has("Space")?1:s?-1:0;fe.yaw-=t*1.5*n*(i?1:.2);const a=Math.sin(fe.yaw),o=-Math.cos(fe.yaw);i&&(fe.vel.x+=a*e*30*n,fe.vel.z+=o*e*30*n,fe.vel.y+=r*24*n,r===0&&(fe.vel.y-=fe.vel.y*1.6*n)),fe.vel.x-=fe.vel.x*.85*n,fe.vel.z-=fe.vel.z*.85*n,fe.vel.y-=fe.vel.y*1.1*n,fe.pos.addScaledVector(fe.vel,n);const c=ve(fe.pos.x,fe.pos.z);fe.pos.x=ge.clamp(fe.pos.x,-1500,1500),fe.pos.z=ge.clamp(fe.pos.z,-1900,700),fe.pos.y=Math.min(fe.pos.y,300),fe.pos.y<c+1.1&&(fe.pos.y=c+1.1,fe.vel.y=Math.max(0,fe.vel.y)),(qr(fe.pos,an)||qr(fe.pos,li))&&(fe.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=fe.pos.x,l.roamPos.y=fe.pos.y,l.roamPos.z=fe.pos.z,l.roamYaw=fe.yaw,l.speed=Math.hypot(fe.vel.x,fe.vel.z),fe.mesh.position.copy(fe.pos),fe.mesh.quaternion.setFromAxisAngle($t,-fe.yaw),fe.mesh.rotateX(ge.clamp((fe.vel.x*a+fe.vel.z*o)*.008,-.24,.24)),fe.mesh.rotateZ(ge.clamp(t*.14,-.2,.2)),oh()}function q2(n,e,t){if(e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.round(l.driftAcc);l.score+=s,_s(`+${s} DRIFT`),Ts(600,.16,"square",.1)}l.driftT=0,l.driftAcc=0}}function Y2(n,e){const t=e.y+Xn,i=l.roamPrevY??t;if(!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0):(l.roamVy=ge.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir&&(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.roamPos.y<=t)){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),Xr(Math.min(24,s*.85)),l.roamSuspension+=.16),l.roamAirT>.45){const r=Math.round(40+l.roamAirT*70);l.score+=r,_s(`+${r} AIR`),Ts(760,.14)}}l.roamPrevY=l.roamPos.y}const gn=2.6;function lf(n,e){const t=l.waterDepth||0;if(l.roamPos.y>ve(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=Hv(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(E2(l.roamPos.clone(),Math.abs(e)),I2(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,Ku(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function $2(n,e){for(const t of Un)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of Un){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,r=l.roamPos.z-t.z,a=(t.hw+t.hd)*.5+gn+2.4;if(s*s+r*r<a*a&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,_s("+45 NEAR MISS"),Ts(520,.12,"square",.07);break}}}function qr(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+Xn+.45)continue;if(s.radius){const f=s.radius+gn,p=n.x-s.x,m=n.z-s.z,x=p*p+m*m;if(x>=f*f)continue;t=!0;const M=Math.max(1e-4,Math.sqrt(x));n.x=s.x+p/M*f,n.z=s.z+m/M*f;continue}const r=s.hw+gn,a=s.hd+gn,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const h=r-Math.abs(o),d=a-Math.abs(c);h<d?n.x=s.x+(o<0?-r:r):n.z=s.z+(c<0?-a:a)}return t}function cf(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Ot.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,r=n.mesh?.position?.z??n.collider?.z??n.along,a=n.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;n.avoidOffset=ge.clamp((n.avoidOffset||0)+a*i*.9,-i,i),t&&(ke.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=a*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function Z2(n){let e=!1;for(let t=0;t<Un.length;t++){const i=Un[t];if(i.maxY!=null&&n.y>i.maxY+Xn+.45)continue;const s=i.hw+gn,r=i.hd+gn,a=n.x-i.x,o=n.z-i.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,cf(i.actor,n);const c=s-Math.abs(a),h=r-Math.abs(o);c<h?n.x=i.x+(a<0?-s:s):n.z=i.z+(o<0?-r:r)}return e}function K2(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+Xn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function J2(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,ke.splats++,D2();const e=ir.find(t=>!t.visible)||ir[ke.splats%Math.max(1,ir.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,ve(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function j2(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of ra){if(!i.active)continue;const s=n.x-i.x,r=n.z-i.z,a=gn+i.hitRadius;s*s+r*r>a*a||Math.abs(n.y-(ve(i.x,i.z)+Xn))>3.2||(J2(i),t=!0)}return t}function hf(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=qr(n,an),r=e?.kind==="ground"?qr(n,Gn):!1,a=qr(n,li),o=e?.kind==="ground"?Z2(n):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function df(n){const e=Re.lookX*1.18,t=Re.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Re.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function lh(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const r=s/10,a=ge.lerp(n.x,e.x,r),o=ge.lerp(n.z,e.z,r),c=ge.lerp(n.y,e.y,r),h=ve(a,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,r)))}return i}function Q2(n,e){const t=ve(n,e);let i=null;const s=tf(n,e);s&&s.y>t+4&&(i=s);const r=nf(n,e,1e3,!0);return r&&r.y>t+4&&(!i||r.y>i.y)&&(i=r),i}function mo(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const r=s/14,a=ge.lerp(n.x,e.x,r),o=ge.lerp(n.z,e.z,r),c=ge.lerp(n.y,e.y,r),h=Q2(a,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,r)))}return Math.min(54,i)}function Tc(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=ge.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,r={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};Ue.position.y+=lh(r,Ue.position,3.4),Ue.position.y+=mo(r,Ue.position,4.2)}function uf(n){if(window.__freeCam)return;if(df(n),Math.abs(l.speed)>gc){let x=l.roamYaw-l.camYaw;x=Math.atan2(Math.sin(x),Math.cos(x)),l.camYaw+=x*(1-Math.pow(.08,n))}const e=l.camYaw+l.camLookYaw,t=Math.sin(e),i=-Math.cos(e),s=l.roamPos,r=ge.clamp(l.cameraZoom,-.42,.9),a=ge.clamp(Math.abs(l.speed)/135,0,1),o=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},c=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+r*.72)*o.d,h=(7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+l.camLookPitch*5.8)*o.h,d=Iu.set(s.x-t*c,s.y+h,s.z-i*c);if(l.cameraShake>.01||l.collisionDrama>.01){const x=l.cameraShake+l.collisionDrama*.42;d.x+=(Math.random()-.5)*x*1.2,d.y+=(Math.random()-.5)*x*.75,d.z+=(Math.random()-.5)*x*1.2}const f=To.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+l.camLookPitch*13.5,s.z+i*(13+a*8-Math.min(r,0)*6));d.y=Math.max(d.y,ve(d.x,d.z)+3.5),d.y+=lh(f,d,3.4),d.y+=mo(f,d,4.2);const p=l.roamSlip>.35?.006:.0026;Ue.position.lerp(d,1-Math.pow(p,n)),Ue.position.y+=mo(f,Ue.position,3.8)*.72,un.position.copy(Ue.position),un.lookAt(f),un.rotateY(Math.PI),un.rotateZ(-l.wheelSteer*a*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),Ue.quaternion.slerp(un.quaternion,1-Math.pow(.05,n));const m=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+r*10;Math.abs(Ue.fov-m)>.02&&(Ue.fov+=(m-Ue.fov)*(1-Math.pow(.01,n)),Ue.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function e_(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),qe.best.textContent=`Best score ${l.best}`,qe.resultText.textContent=`${n} Score ${t}. Time ${xo(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?xo(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&Ft?.active&&e){[{key:"you",metric:l.totalDistance+.001},...On.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Ft.points[c.key]+=p2[h]??0),Ft.raceIndex++;const a=Ft.raceIndex>=4,o=Zu();if(a){Ft.active=!1;const c=o[0].key==="you";c&&Ft.division>1?(localStorage.setItem("steel-ribbon-division",String(Ft.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${$u(Ft.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}Yu(),s=`<span>Season — after race ${Ft.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,qe.againBtn.textContent=Ft.active?"Next Race":"Back to Menu"}else qe.againBtn.textContent="Race Again";qe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,Po(),qe.result.classList.remove("hidden")}function Fd(n="Craned back to the ribbon"){const e=dt(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function ch(n,e){return ge.clamp(e*n.tangent.y,-48,48)}function t_(n=94){return se.gaps.map(e=>{const t=dt(e.start),i=dt(e.end+3),s=(e.end-e.start)/Math.max(1,n),r=ch(t,n),a=t.p.y+2.1+r*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(ge.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Nd(n,e){l.grounded=!1,l.yVel=ch(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return ch(dt(n),e)},gapJumpReport(n){return t_(n)},sceneryClearanceReport(){return Wv()},setSpeed(n){return l.speed=ge.clamp(n,-14,156-l.damage*.42),Yr(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=dt(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=ge.clamp(t,-se.width*.48,se.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=ge.clamp(e,-14,156-l.damage*.42),Yr(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=ge.clamp(n,0,99),Yr(),l.damage},setCourse(n){return ua(n)},flyCam(n,e,t,i,s,r){return window.__freeCam=!0,Ue.position.set(n,e,t),Ue.lookAt(i,s,r),Ue.fov=62,Ue.updateProjectionMatrix(),"freecam"},listBoostPads(){return sr.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return Es.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1)}))},seasonInfo(){return{season:Ft,division:da(),position:hh(),seasonRace:!!l.seasonRace,rivals:On.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Ft=null,Po(),"reset"},renderInfo(){return{calls:ke.renderCalls||0,triangles:ke.renderTris||0,geometries:Jt.info.memory.geometries,textures:Jt.info.memory.textures,mobilePerf:wo}},trafficInfo(){const n=Un[0]?.actor?.mesh;return{colliders:Un.length,wheels:n?.userData?.wheels?.length??0,pedestrians:ke.pedestrians||0}},audioInfo(){return Ye?{state:Ye.ctx.state,master:+Ye.master.gain.value.toFixed(2),engine:!!Ye.rumble&&!!Ye.growl&&!!Ye.whine,fx:!!Ye.wind&&!!Ye.skid&&!!Ye.boost,music:!!Ye.musicGain,beat:Ye.beat}:null},colliderAudit(){const n=[],e=[],t=Ot.streetW*.5;for(let r=Ot.x0;r<=Ot.x1+1;r+=Ot.pitch)n.push(Math.round(r));for(let r=Ot.zNear;r>=Ot.zFar-1;r-=Ot.pitch)e.push(Math.round(r));const i=[],s=(r,a,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=ve(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const f of n)Math.abs(o.x-f)<t+c+gn&&o.z<Ot.zNear+h&&o.z>Ot.zFar-h&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${f}`,overlap:+(t+c+gn-Math.abs(o.x-f)).toFixed(1)});for(const f of e)Math.abs(o.z-f)<t+h+gn&&o.x<Ot.x1+c&&o.x>Ot.x0-c&&i.push({arr:r,idx:a,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${f}`,overlap:+(t+h+gn-Math.abs(o.z-f)).toFixed(1)})}};return an.forEach((r,a)=>s("Mn",a,r)),li.forEach((r,a)=>s("Di",a,r)),Gn.forEach((r,a)=>s("$n",a,r)),{total:an.length+li.length+Gn.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&po(),n==="foot"?l.vehicle==="car"?bc(!0):l.vehicle==="heli"&&wc():n==="heli"&&fe?(l.vehicle==="car"&&bc(!0),l.roamPos.set(fe.pos.x+3,ve(fe.pos.x+3,fe.pos.z),fe.pos.z),af()):n==="car"&&(l.vehicle==="heli"&&(fe.pos.y=ve(fe.pos.x,fe.pos.z)+1.1,fe.vel.set(0,0,0),wc()),l.vehicle==="foot"&&(l.roamPos.copy(Di),rf())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:zn.visible,heli:fe?{x:+fe.pos.x.toFixed(1),y:+fe.pos.y.toFixed(1),z:+fe.pos.z.toFixed(1),rpm:+fe.rpm.toFixed(2),pad:fe.pad?{x:+fe.pad.x.toFixed(1),z:+fe.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Di.x.toFixed(1),z:+Di.z.toFixed(1)}}},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&po(),l.roamPos.set(n,ve(n,e)+Xn,e),l.roamYaw=t,l.camYaw=t,l.speed=i,ji(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{...Yi,boostPads:sr.length,gapBeacons:aa.length,railRuns:ke.railRuns||0,railPosts:ke.railPosts||0,ponds:Es.length,cityPonds:ke.ponds||0,cloudSprites:ke.cloudSprites||0,helipad:ke.helipad||null}},stats(){return{trafficCrashes:ke.trafficCrashes,splats:ke.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},viewInfo(){const n=dt(l.s),e=l.y-2.1;return{trackView:ti,mode:l.mode,carVisible:Pt.visible,cockpitVisible:!!(hn&&hn.visible),camY:+Ue.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!di,overheadY:+Ec(Ue.position.x,Ue.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return ti=n==="cockpit"?"cockpit":"chase",Ui(),ti},listCourses(){return ws.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:Ki,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new Lp(new P(n,400,e),new P(0,-1,0),0,1e3);t.camera=Ue;const i=t.intersectObjects($e.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=xs(n,e,400);return{x:n,z:e,ground:+ve(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return Ps.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],r=n.segments[0],a=n.segments[n.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(n=8){return an.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return Gn.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=Gn.filter(e=>e.hw);return{supports:vc,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of an){const i=hs(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:an.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of an){const i=In(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:an.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return li.concat(Gn.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:ke.traffic,pedestrians:ke.pedestrians,pedestriansActive:ra.filter(e=>e.active).length,turns:ke.turns,splats:ke.splats,trafficCrashes:ke.trafficCrashes,streetLights:ke.streetLights,trafficLights:ke.trafficLights,stopSigns:ke.stopSigns,signs:ke.signs,roadDetails:{...ke.roadDetails},buildingArchetypes:{...ke.buildingArchetypes},zones:{...ke.zones},openerProps:ke.openerProps,signSamples:fo.slice(0,n),types:{...ke.types},offRoadTraffic:Un.filter(e=>!Eo(e.x,e.z,2)).length,trafficRoutes:_c.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Un.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:ra.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...ke.roadDetails},e={...ke.buildingArchetypes},t={...ke.zones},i=Object.values(e).filter(r=>r>0).length,s=Object.values(t).filter(r=>r>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,ke.signs/7)+Math.min(14,ke.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:ke.openerProps,signs:ke.signs,streetLights:ke.streetLights,streetGlowSprites:Yi.streetGlowSprites,waterBlockers:Yi.waterBlockers,lowFogDisks:Yi.lowFogDisks}},objectiveReport(){const n=Zt[l.objectiveIndex%Math.max(1,Zt.length)];return{total:Zt.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:Zt.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:Hr.filter(n=>n.life>0).length,debrisActive:Wr.filter(n=>n.life>0).length,sparksActive:Gr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Pt.userData.detailReport},racer:{...u2.userData.detailReport},namedParts:Pt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);Gu(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=dt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,r=Math.atan2(t.tangent.x,-t.tangent.z),a=ve(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,a+Xn,s),l.roamYaw=r,l.camYaw=r,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Re.lookX=0,Re.lookY=0,Re.zoom=0,l.wheelSteer=0,l.speed=0,ji();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return Ue.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),Tc(),Ue.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),Ue.fov=69,Ue.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=xs(n,e,l.roamPos.y);l.roamPos.set(n,i.y+Xn,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,ji();const s=Math.sin(l.roamYaw),r=-Math.cos(l.roamYaw);return Ue.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-r*17),Tc(),Ue.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+r*13),Ue.fov=69,Ue.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Re.zoom,i=30){Re.lookX=ge.clamp(n,-1,1),Re.lookY=ge.clamp(e,-1,1),Re.zoom=ge.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?uf(1/60):dh(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Re.steer,throttle:Re.throttle,brake:Re.brake};Re.steer=ge.clamp(e,-1,1),Re.throttle=ge.clamp(t,0,1),Re.brake=ge.clamp(i,0,1);const r=1/60;let a=Math.max(0,Math.min(n,8));for(;a>0;){const o=Math.min(r,a);if(sf(o),l.mode!=="roam")break;a-=o}return Re.steer=s.steer,Re.throttle=s.throttle,Re.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(ff(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=Iu.set(0,0,-1).applyQuaternion(Pt.quaternion).normalize(),t=To.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=xs(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+ve(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+Ue.position.x.toFixed(2),camY:+Ue.position.y.toFixed(2),camZ:+Ue.position.z.toFixed(2),fov:+Ue.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+lh({x:n.x,y:n.y+2.6,z:n.z},{x:Ue.position.x,y:Ue.position.y,z:Ue.position.z},2.4).toFixed(3),elevatedCameraLift:+mo({x:n.x,y:n.y+2.6,z:n.z},{x:Ue.position.x,y:Ue.position.y,z:Ue.position.z},3.8).toFixed(3),colliders:an.length+Gn.length+li.length+Un.length,insideBuilding:an.concat(Gn,li,Un).some(s=>K2(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Pt.userData.frontWheels?+Pt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function ff(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(tt.has("KeyW")||tt.has("ArrowUp")?1:0,Re.throttle),i=Math.max(tt.has("KeyS")||tt.has("ArrowDown")?1:0,Re.brake),s=ge.clamp((tt.has("KeyD")||tt.has("ArrowRight")?1:0)-(tt.has("KeyA")||tt.has("ArrowLeft")?1:0)+Re.steer,-1,1)*Uu,r=t>.03&&!e,a=(tt.has("ShiftLeft")||tt.has("ShiftRight"))&&l.boost>.02&&r&&l.grounded,o=dt(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(r){const v=l.speed<0?40:0;l.speed+=((a?68:40)*$i().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=ge.clamp(l.speed,-16,156*$i().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=a,a?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*$i().boostRegen);const f=tt.has("Space")&&l.grounded,p=(16+h*.13)*(f?1.45:1)*$i().grip;l.lateralVel-=s*p*n,l.lateralVel-=l.lateralVel*(l.grounded?f?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const m=mi(l.s),x=Math.abs(l.lateral)<se.width*.52,M=!m&&x;if(l.grounded&&(!M||Math.abs(l.lateral)>se.width*.5)&&Nd(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=ge.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>se.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&rr(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*se.width*.55).addScaledVector($t,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=dt(l.s),y=v.p.y+2.1;if(!mi(l.s)&&Math.abs(l.lateral)<se.width*.55&&l.y<=y&&l.yVel<0){const E=-l.yVel,T=Math.abs(l.lateral)<se.width*.34&&E<30,C=Math.round(T?260+l.airtime*85:Math.max(30,120-E));l.y=y,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-se.width*.36)*1.8,l.score+=C,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=T?"Clean landing":"Hard landing",l.messageTimer=.9,T?l.cleanLandings+=1:l.hardLandings+=1,_s(`+${C} ${T?"CLEAN AIR":"LANDED"}`,T),T&&Ts(990,.14),Xr(E),rr(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector($t,.7),T?7:24),l.airtime=0}l.y<-55&&(l.damage+=28,Fd("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%se.length+se.length)%se.length,o_();const u=Ps.find(v=>v.rampType==="off");if(l.freeRun&&u&&pl(g,l.totalDistance,u.exitS)&&l.lateral*u.dirSel>se.width*.2&&B2(u))return;const _=Math.floor(l.totalDistance/se.length)+1;if(_>l.lap){const v=l.time-l.lapStartTime;a_(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=_,l.score+=1200,_s("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=se.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>se.laps&&(()=>{const y=hh();e_(y===1?"You took the chequered gantry.":`You finished P${y}.`,y)})()}for(const v of se.gaps)pl(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&Nd(dt(v.start),v.name));if(l.grounded){for(const v of sr)if(pl(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const y=dt(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,_s("+90 BOOST"),Ts(640,.22,"sawtooth",.1),rr(y.p.clone().addScaledVector(y.side,v.lat).addScaledVector($t,1),10),Xr(14);break}}l.damage=ge.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),Xr(40),l.damage=90),tt.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),Fd("Manual reset"),tt.delete("KeyR"))}function zd(n){const e=se.length*se.laps,t=1+.07*(4-da());for(const i of On){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=ge.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let f=i.base+d+h;i.key==="bishop"&&(f+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(f+=10*ge.clamp(i.distance/Math.max(1,e),0,1)),i.speed=ge.clamp(f*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=dt(i.s),r=Math.abs(i.distance-l.totalDistance);let a=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(r<14){const c=(l.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);a=ge.lerp(c,a,r/14)}i.mesh.position.copy(s.p).addScaledVector($t,1.4).addScaledVector(s.side,a),i.mesh.quaternion.setFromRotationMatrix(new At().makeBasis(s.side,$t,s.tangent));const o=r<26&&ti==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...On.map(i=>i.distance)),l.rivalS=(l.rivalDistance%se.length+se.length)%se.length}function hh(){return l.practice?1:1+On.filter(n=>n.distance>l.totalDistance).length}function n_(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),Ue.position.copy(i);const r=Math.abs(l.speed),a=68+Math.min(10,r*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(Ue.fov-a)>.02&&(Ue.fov+=(a-Ue.fov)*(1-Math.pow(.004,n)),Ue.updateProjectionMatrix());const o=dt(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,r/680),un.position.copy(Ue.position),un.lookAt(c),un.rotateY(Math.PI),un.rotateY(-l.camLookYaw),un.rotateZ(-e.bank*.72-l.lateralVel*.006),un.rotateX(e.grade*.18+(l.grounded?0:ge.clamp(l.yVel,-30,30)*-.006)),Ue.quaternion.slerp(un.quaternion,1-Math.pow(8e-4,n))}function Ec(n,e,t,i){let s=1/0;const r=se.width*.5+2.2;for(const a of Ao()){if(a.courseIndex!==Ki||a.y<t||a.y>i||a.y>=s)continue;const o=n-a.x,c=e-a.z;o*o+c*c<r*r&&(s=a.y)}return s}function i_(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+ge.clamp(l.cameraZoom,-.42,.9)*8,r=4.6+t*.014+l.camLookPitch*10,a=dt(l.s-s),o=Ec(a.p.x,a.p.z,i+5,i+64);o-1.5<a.p.y+2&&(s=6.4,r=2.7,a=dt(l.s-s),o=Ec(a.p.x,a.p.z,i+5,i+64));let c=ge.lerp(a.p.y,i,.62)+r;const h=nh.set(a.p.x+a.side.x*l.lateral*.72,0,a.p.z+a.side.z*l.lateral*.72);if(c=Math.max(c,a.p.y+2.35,ve(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const m=l.cameraShake;h.x+=(Math.random()-.5)*m*1.1,h.y+=(Math.random()-.5)*m*.6,h.z+=(Math.random()-.5)*m*1.1}Ue.position.distanceTo(h)>70&&Ue.position.copy(h),Ue.position.lerp(h,1-Math.pow(2e-4,n)),Ue.position.y=Math.max(Ue.position.y,a.p.y+2.05),o<1/0&&(Ue.position.y=Math.min(Ue.position.y,o-1.4));const d=dt(l.s+17+t*.09),f=d.p.clone().addScaledVector(d.side,l.lateral*.55);f.y+=2.1+l.camLookPitch*12,l.grounded||(f.y=ge.lerp(f.y,l.y+1.2,.5)),un.position.copy(Ue.position),un.lookAt(f),un.rotateY(Math.PI),un.rotateY(-l.camLookYaw),un.rotateZ(-e.bank*.42-l.lateralVel*.0034),Ue.quaternion.slerp(un.quaternion,1-Math.pow(4e-4,n));const p=66+Math.min(11,t*.055)+(l.boosting?5:0)+ge.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(Ue.fov-p)>.02&&(Ue.fov+=(p-Ue.fov)*(1-Math.pow(.004,n)),Ue.updateProjectionMatrix())}let Ri=null,di=null,Ei=0;function s_(){try{di=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+Ki)||"null")}catch{di=null}Ei=0}function r_(){Ri&&Qs(Ri),Ri=As[Ji].build(),Ri.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),Ri.visible=!1}function a_(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||di&&n>=di.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);di={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+Ki,JSON.stringify(di))}catch{}l.message=`Ghost saved — ${xo(n)}`,l.messageTimer=1.3,Ei=0}function o_(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function l_(){if(!Ri)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&di?.samples?.length>2&&!window.__freeCam;if(Ri.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,di.time),t=di.samples;for(e<(t[Ei]?.[0]??0)&&(Ei=0);Ei<t.length-2&&t[Ei+1][0]<e;)Ei++;const i=t[Ei],s=t[Math.min(Ei+1,t.length-1)],r=ge.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),a=ge.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:r),o=ge.lerp(i[2],s[2],r),c=ge.lerp(i[3],s[3],r),h=dt((a%se.length+se.length)%se.length);Ri.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),Ri.quaternion.setFromRotationMatrix(new At().makeBasis(h.side,$t,h.tangent))}function c_(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&ti==="chase"&&!window.__freeCam;if(hn&&(hn.visible=!e),Pt.visible!==e&&(Pt.visible=e),!e)return;const t=dt(l.s);Pt.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new At().makeBasis(t.side,$t,t.tangent);Pt.quaternion.setFromRotationMatrix(i),l.grounded?(Pt.rotateX(-t.grade*.5),Pt.rotateZ(t.bank*.6+ge.clamp(l.lateralVel*.012,-.16,.16))):Pt.rotateX(ge.clamp(-l.yVel*.011,-.34,.4));const s=Pt.userData.frontWheels,r=ge.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=r,s[1].rotation.y=r)}let $a=.6;function h_(n){if(window.__freeCam)return;$a+=n*.13;const e=80,t=300,i=ve(e,t);Pt.visible=!0,hn&&(hn.visible=!1),Pt.position.set(e,i+.85,t),Pt.quaternion.setFromAxisAngle($t,Math.PI*.24);const s=16.5;Ue.position.set(e+Math.cos($a)*s,i+5.3+Math.sin($a*.57)*1.1,t+Math.sin($a)*s),Ue.lookAt(e,i+1.5,t),Ue.rotateY(.3),Math.abs(Ue.fov-58)>.1&&(Ue.fov=58,Ue.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function dh(n){if(window.__freeCam)return;df(n);const e=dt(l.s);ti==="chase"&&l.mode!=="menu"?i_(n,e):n_(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=To.set(0,0,-1).applyQuaternion(Ue.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Re.steer,throttle:Re.throttle,brake:Re.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const vs={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Ir=[28,54,82,110,134,156];function d_(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<Ir.length;o++)n>Ir[o]&&(e=o+2);e=Math.min(e,Ir.length);const t=e===1?0:Ir[e-2],i=Ir[e-1],s=i>t?ge.clamp((n-t)/(i-t),0,1):0,r=e===1?vs.idle:vs.postShift;let a=r+s*(vs.shift-r);return n<.4&&(a=vs.idle),{gear:e,rpm:a}}let Od=performance.now(),Ml=0,yl=0;function pf(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const r=i/2,a=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:r,cy:a,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[r+Math.cos(c)*h,a-Math.sin(c)*h]}}function u_(n,e){const t=qe.speedo;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:c}=pf(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const M=x/h,g=o(M),u=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=u?Math.max(1.4,a*.035):Math.max(1,a*.02);const _=c(g,a-a*.02),v=c(g,a-a*(u?.18:.1));if(i.beginPath(),i.moveTo(_[0],_[1]),i.lineTo(v[0],v[1]),i.stroke(),u){const y=c(g,a-a*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),y[0],y[1])}}const d=ge.clamp(n/h,0,1),f=o(d),p=c(f,a-a*.06),m=c(f+Math.PI,a*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=a*.18,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(m[0],m[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,r-a*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,r+a*.02)}function f_(n,e){const t=qe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:r,R:a,aFor:o,at:c}=pf(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,a*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,r,a,o(1),o(0)),i.stroke();const d=ge.clamp(n,0,1),f=n<.25;i.strokeStyle=f?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?a*.25:a*.1,i.lineWidth=Math.max(2,a*.07),i.beginPath(),i.arc(s,r,a,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let M=0;M<=h;M+=3){const g=M/h,u=o(g),_=M%6===0;i.strokeStyle=M>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=_?Math.max(1.3,a*.03):Math.max(1,a*.018);const v=c(u,a-a*.02),y=c(u,a-a*(_?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(y[0],y[1]),i.stroke(),_){const E=c(u,a-a*.33);i.fillStyle="#cfeeff",i.fillText(String(M),E[0],E[1])}}const p=o(d),m=c(p,a-a*.06),x=c(p+Math.PI,a*.14);i.strokeStyle=f?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=a*.16,i.lineWidth=Math.max(1.8,a*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,a*.03),i.beginPath(),i.arc(s,r,a*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,r-a*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=a*.3,i.beginPath(),i.arc(s,r+a*.02,a*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function p_(n,e){const t=qe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,h=Math.min(r*.46,a*.9),d=vs.max,f=v=>Math.PI-v*Math.PI,p=(v,y)=>[o+Math.cos(v)*y,c-Math.sin(v)*y];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,f(1),f(0)),i.stroke();const m=vs.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,f(1),f(m)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const y=v/9,E=f(y),T=v*1e3>=vs.redline;i.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const C=p(E,h-h*.02),R=p(E,h-h*.18);i.beginPath(),i.moveTo(C[0],C[1]),i.lineTo(R[0],R[1]),i.stroke();const w=p(E,h-h*.34);if(i.fillStyle=T?"#ff8077":"#cfeeff",i.fillText(String(v),w[0],w[1]),v<9){const S=f((v+.5)/9),L=p(S,h-h*.02),F=p(S,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(L[0],L[1]),i.lineTo(F[0],F[1]),i.stroke()}}const x=ge.clamp(n/d,0,1),M=f(x),g=p(M,h-h*.06),u=p(M+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(u[0],u[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const _=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(_,o,c+h*.02)}function Yr(){se.length*se.laps;const n=Td(l.practice?l.totalDistance%se.length:l.totalDistance),e=l.practice?"SOLO":`P${hh()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),qe.damage.style.width=`${Math.round(l.damage)}%`,qe.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,se.laps)}/${se.laps}`,qe.timer.textContent=xo(l.time);const t=l.mode==="roam";qe.score.textContent=t?`Gates ${l.objectiveHits}/${Zt.length}  Score ${Math.round(l.score)}`:`Score ${Math.round(l.score)}`;const i=l.mode==="race"||l.mode==="paused"||t;if(qe.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${da()}`,t&&Zt.length){const h=Zt[l.objectiveIndex%Zt.length];qe.trackName.textContent=h?`Next: ${h.label}`:"City Streets"}qe.hud.style.display=i?"flex":"none",qe.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",qe.touchControls.style.display=i?"":"none",qe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const h of On)h.progEl&&(h.progEl.style.width=`${Math.round((l.practice?0:Td(h.distance))*100)}%`);const s=d_();l.gear=s.gear;const r=performance.now(),a=Math.min(.05,(r-Od)/1e3);Od=r;const o=1-Math.exp(-a*(s.rpm>l.tachRpm?10:6));l.tachRpm+=(s.rpm-l.tachRpm)*o,p_(l.tachRpm,s.gear);const c=Math.abs(l.speed)*2.25;Ml+=(c-Ml)*(1-Math.exp(-a*8)),yl+=(l.boost-yl)*(1-Math.exp(-a*9)),u_(Ml,l.speed<-.5),f_(yl,l.boosting),qe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),qe.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(qe.centerMessage.textContent="Paused",qe.centerMessage.classList.remove("hidden")):l.messageTimer>0?(qe.centerMessage.textContent=l.message,qe.centerMessage.classList.remove("hidden")):qe.centerMessage.classList.add("hidden")}function xo(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function mf(){Jt.info.reset();const n=Cv.getDelta(),e=Math.min(.033,n);l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?W2(e):l.vehicle==="heli"?X2(e):sf(e),uf(e),k2()):l.mode==="menu"?(zd(e),h_(e)):(ff(e),zd(e),c_(),l_(),dh(e)),H2(),G2(),Wi&&Wi.position.copy(Ue.position),z2(e),Gu(e),Yr(),O2(),Nr.uniforms.uTime.value+=e,Ou.forEach(i=>i.uniforms.uTime.value+=e),Nr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(tt.has("ShiftLeft")||tt.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);Nr.uniforms.uBoost.value+=(t-Nr.uniforms.uBoost.value)*Math.min(1,e*6),gr.render(),ke.renderCalls=Jt.info.render.calls,ke.renderTris=Jt.info.render.triangles,requestAnimationFrame(mf)}window.addEventListener("keydown",n=>{tt.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused")&&Pv(),n.code==="KeyE"&&of(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",tt.clear(),ca()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",ca(),Pt.visible=!1,hn&&(hn.visible=!0),document.body.classList.remove("roam-mode"),Ui(),qe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>tt.delete(n.code));window.addEventListener("resize",()=>{Ue.aspect=window.innerWidth/window.innerHeight,Ue.updateProjectionMatrix(),Jt.setSize(window.innerWidth,window.innerHeight),gr.setSize(window.innerWidth,window.innerHeight),Ju.setSize(window.innerWidth,window.innerHeight)});const go=()=>{Cs(),window.removeEventListener("pointerdown",go),window.removeEventListener("keydown",go)};window.addEventListener("pointerdown",go);window.addEventListener("keydown",go);const la=document.createElement("button");la.id="volBtn",la.type="button";function xf(){la.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}xf();la.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Ye&&Ye.master.gain.setTargetAtTime(e,Ye.ctx.currentTime,.05),xf()});qe.menu.appendChild(la);const $r=document.createElement("button");$r.id="actionBtn",$r.type="button",$r.textContent="E";$r.addEventListener("pointerdown",n=>{n.preventDefault(),Cs(),of()});qe.touchControls.appendChild($r);const Ro=document.createElement("div");Ro.className="course-select";Ro.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';qe.freeRunBtn.parentNode.insertBefore(Ro,qe.freeRunBtn);const gf=[];As.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>f2(e)),Ro.querySelector("#carButtons").appendChild(t),gf.push(t)});function Ac(){const n=As[Ji],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),gf.forEach((t,i)=>t.classList.toggle("active",i===Ji))}Ac();qe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+On.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");qe.playerProgress=document.querySelector("#playerProgress");On.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function Po(){const n=da();qe.startBtn.textContent=Ft?.active?`Continue Season — Race ${Ft.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=Zu();e.innerHTML=`<span>Division ${$u(n)}${Ft?.active?` — after race ${Ft.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Ft?` — ${i.pts} pts`:""}</b>`).join("")}}function m_(){l.mode="menu",ca(),Pt.visible=!1,hn&&(hn.visible=!0),Co(!1),document.body.classList.remove("roam-mode"),Ui(),Po(),qe.result.classList.add("hidden"),qe.menu.classList.remove("hidden")}Po();qe.startBtn.addEventListener("click",()=>{Ft&&Ft.active||m2(),ua(ge.clamp(Ft.raceIndex,0,3)),oa(!1,!1,!0)});qe.practiceBtn.addEventListener("click",()=>oa(!0));qe.freeRunBtn.addEventListener("click",()=>oa(!0,!0));qe.roamBtn.addEventListener("click",()=>po());qe.againBtn.addEventListener("click",()=>{l.seasonRace&&Ft?Ft.active&&Ft.raceIndex<4?(ua(Ft.raceIndex),oa(!1,!1,!0)):m_():oa(!1)});qe.courseButtons.forEach(n=>{n.addEventListener("click",()=>ua(Number(n.dataset.course)))});function vf(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function ca(){Re.steer=0,Re.throttle=0,Re.brake=0,Re.lookX=0,Re.lookY=0,Re.zoom=0,Re.lookPointer=null,Re.drivePointer=null,Re.pinchStartDistance=0,Re.pinchStartZoom=0;for(const n of qe.touchControls.querySelectorAll(".touch-stick"))vf(n)}function Za(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=ge.clamp(e.clientX-(t.left+t.width/2),-i,i),r=ge.clamp(e.clientY-(t.top+t.height/2),-i,i),a=n.dataset.stick;if(n.classList.add("active"),a==="look")Re.lookX=ge.clamp(s/i,-1,1),Re.lookY=ge.clamp(-r/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Re.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Re.lookY*i)}px`);else{const o=ge.clamp(s/i,-1,1),c=ge.clamp(-r/i,-1,1);Re.steer=o,Re.throttle=Math.max(0,c),Re.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function Bd(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function kd(n,e){e==="look"?(Re.lookX=0,Re.lookY=0,Re.lookPointer=null):(Re.steer=0,Re.throttle=0,Re.brake=0,Re.drivePointer=null),vf(n)}function x_(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function _f(n,e=!1){if(n.touches.length<2){Re.pinchStartDistance=0;return}const t=x_(n.touches[0],n.touches[1]);if(e||!(Re.pinchStartDistance>0)){Re.pinchStartDistance=t,Re.pinchStartZoom=Re.zoom;return}const i=Math.max(.2,t/Re.pinchStartDistance);Re.zoom=ge.clamp(Re.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of qe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),Cs(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Re.lookPointer=s.pointerId),e==="drive"&&(Re.drivePointer=s.pointerId),Za(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Re.lookPointer:Re.drivePointer)===s.pointerId&&(s.preventDefault(),Za(n,s))},{passive:!1});const t=s=>{(e==="look"?Re.lookPointer:Re.drivePointer)===s.pointerId&&kd(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),Cs(),l.mode==="paused"&&(l.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Re.lookPointer=r.identifier),e==="drive"&&(Re.drivePointer=r.identifier),Za(n,r))},{passive:!1}),n.addEventListener("touchmove",s=>{const r=e==="look"?Re.lookPointer:Re.drivePointer,a=Bd(s,r);a&&(s.preventDefault(),Za(n,a))},{passive:!1});const i=s=>{const r=e==="look"?Re.lookPointer:Re.drivePointer;Bd(s,r)&&(s.preventDefault(),kd(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of qe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),Cs(),tt.add(e),n.setPointerCapture(i.pointerId)});const t=()=>tt.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}ha.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),_f(n,!0))},{passive:!1});ha.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),_f(n))},{passive:!1});ha.addEventListener("touchend",n=>{n.touches.length<2&&(Re.pinchStartDistance=0)},{passive:!1});ha.addEventListener("touchcancel",()=>{Re.pinchStartDistance=0},{passive:!1});const g_=dt(l.s);l.y=g_.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;dh(.016);Yr();mf();
