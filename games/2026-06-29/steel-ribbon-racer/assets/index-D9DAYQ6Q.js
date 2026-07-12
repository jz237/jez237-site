(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Hh="181",Ap=0,Od=1,Cp=2,S0=1,T0=2,es=3,As=0,Fn=1,wt=2,Ni=0,Fa=1,ri=2,Bd=3,Vd=4,Rp=5,Hs=100,Pp=101,Lp=102,Dp=103,Ip=104,Fp=200,Up=201,zp=202,Np=203,Fc=204,Uc=205,kp=206,Op=207,Bp=208,Vp=209,Gp=210,Hp=211,Wp=212,Xp=213,qp=214,zc=0,Nc=1,kc=2,Ba=3,Oc=4,Bc=5,Vc=6,Gc=7,Wh=0,Yp=1,$p=2,Ss=0,E0=1,A0=2,C0=3,Xh=4,R0=5,P0=6,L0=7,D0=300,Va=301,Ga=302,Hc=303,Wc=304,El=306,Nn=1e3,is=1001,Xc=1002,Jn=1003,Zp=1004,oo=1005,oi=1006,Bl=1007,Xs=1008,Wi=1009,I0=1010,F0=1011,Dr=1012,qh=1013,ea=1014,Fi=1015,ki=1016,Yh=1017,$h=1018,Ir=1020,U0=35902,z0=35899,N0=1021,k0=1022,_i=1023,Fr=1026,Ur=1027,Zh=1028,Kh=1029,Jh=1030,jh=1031,Qh=1033,Ko=33776,Jo=33777,jo=33778,Qo=33779,qc=35840,Yc=35841,$c=35842,Zc=35843,Kc=36196,Jc=37492,jc=37496,Qc=37808,eh=37809,th=37810,nh=37811,ih=37812,sh=37813,ah=37814,rh=37815,oh=37816,lh=37817,ch=37818,hh=37819,dh=37820,uh=37821,fh=36492,ph=36494,mh=36495,xh=36283,gh=36284,vh=36285,Mh=36286,Kp=3200,Jp=3201,ed=0,jp=1,_s="",Pt="srgb",Ha="srgb-linear",al="linear",$t="srgb",oa=7680,Gd=519,Qp=512,em=513,tm=514,O0=515,nm=516,im=517,sm=518,am=519,_h=35044,Hd="300 es",Ui=2e3,rl=2001;function B0(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ol(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function rm(){const n=ol("canvas");return n.style.display="block",n}const Wd={};function ll(...n){const e="THREE."+n.shift();console.log(e,...n)}function vt(...n){const e="THREE."+n.shift();console.warn(e,...n)}function ln(...n){const e="THREE."+n.shift();console.error(e,...n)}function zr(...n){const e=n.join(" ");e in Wd||(Wd[e]=!0,vt(...n))}function om(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}class $a{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xd=1234567;const _r=Math.PI/180,Nr=180/Math.PI;function Oi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rn[n&255]+Rn[n>>8&255]+Rn[n>>16&255]+Rn[n>>24&255]+"-"+Rn[e&255]+Rn[e>>8&255]+"-"+Rn[e>>16&15|64]+Rn[e>>24&255]+"-"+Rn[t&63|128]+Rn[t>>8&255]+"-"+Rn[t>>16&255]+Rn[t>>24&255]+Rn[i&255]+Rn[i>>8&255]+Rn[i>>16&255]+Rn[i>>24&255]).toLowerCase()}function Dt(n,e,t){return Math.max(e,Math.min(t,n))}function td(n,e){return(n%e+e)%e}function lm(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function cm(n,e,t){return n!==e?(t-n)/(e-n):0}function yr(n,e,t){return(1-t)*n+t*e}function hm(n,e,t,i){return yr(n,e,1-Math.exp(-t*i))}function dm(n,e=1){return e-Math.abs(td(n,e*2)-e)}function um(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function fm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function pm(n,e){return n+Math.floor(Math.random()*(e-n+1))}function mm(n,e){return n+Math.random()*(e-n)}function xm(n){return n*(.5-Math.random())}function gm(n){n!==void 0&&(Xd=n);let e=Xd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function vm(n){return n*_r}function Mm(n){return n*Nr}function _m(n){return(n&n-1)===0&&n!==0}function ym(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function bm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function wm(n,e,t,i,s){const a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),h=a((e+i)/2),d=r((e+i)/2),u=a((e-i)/2),m=r((e-i)/2),p=a((i-e)/2),x=r((i-e)/2);switch(s){case"XYX":n.set(o*d,c*u,c*m,o*h);break;case"YZY":n.set(c*m,o*d,c*u,o*h);break;case"ZXZ":n.set(c*u,c*m,o*d,o*h);break;case"XZX":n.set(o*d,c*x,c*p,o*h);break;case"YXY":n.set(c*p,o*d,c*x,o*h);break;case"ZYZ":n.set(c*x,c*p,o*d,o*h);break;default:vt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function gi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Zt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const xe={DEG2RAD:_r,RAD2DEG:Nr,generateUUID:Oi,clamp:Dt,euclideanModulo:td,mapLinear:lm,inverseLerp:cm,lerp:yr,damp:hm,pingpong:dm,smoothstep:um,smootherstep:fm,randInt:pm,randFloat:mm,randFloatSpread:xm,seededRandom:gm,degToRad:vm,radToDeg:Mm,isPowerOfTwo:_m,ceilPowerOfTwo:ym,floorPowerOfTwo:bm,setQuaternionFromProperEuler:wm,normalize:Zt,denormalize:gi};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Dt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Dt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class as{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let c=i[s+0],h=i[s+1],d=i[s+2],u=i[s+3],m=a[r+0],p=a[r+1],x=a[r+2],_=a[r+3];if(o<=0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=m,e[t+1]=p,e[t+2]=x,e[t+3]=_;return}if(u!==_||c!==m||h!==p||d!==x){let g=c*m+h*p+d*x+u*_;g<0&&(m=-m,p=-p,x=-x,_=-_,g=-g);let f=1-o;if(g<.9995){const y=Math.acos(g),v=Math.sin(y);f=Math.sin(f*y)/v,o=Math.sin(o*y)/v,c=c*f+m*o,h=h*f+p*o,d=d*f+x*o,u=u*f+_*o}else{c=c*f+m*o,h=h*f+p*o,d=d*f+x*o,u=u*f+_*o;const y=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=y,h*=y,d*=y,u*=y}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],c=i[s+1],h=i[s+2],d=i[s+3],u=a[r],m=a[r+1],p=a[r+2],x=a[r+3];return e[t]=o*x+d*u+c*p-h*m,e[t+1]=c*x+d*m+h*u-o*p,e[t+2]=h*x+d*p+o*m-c*u,e[t+3]=d*x-o*u-c*m-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,h=o(i/2),d=o(s/2),u=o(a/2),m=c(i/2),p=c(s/2),x=c(a/2);switch(r){case"XYZ":this._x=m*d*u+h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u-m*p*x;break;case"YXZ":this._x=m*d*u+h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u+m*p*x;break;case"ZXY":this._x=m*d*u-h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u-m*p*x;break;case"ZYX":this._x=m*d*u-h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u+m*p*x;break;case"YZX":this._x=m*d*u+h*p*x,this._y=h*p*u+m*d*x,this._z=h*d*x-m*p*u,this._w=h*d*u-m*p*x;break;case"XZY":this._x=m*d*u-h*p*x,this._y=h*p*u-m*d*x,this._z=h*d*x+m*p*u,this._w=h*d*u+m*p*x;break;default:vt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],h=t[2],d=t[6],u=t[10],m=i+o+u;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(d-c)*p,this._y=(a-h)*p,this._z=(r-s)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+r)/p,this._z=(a+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(a-h)/p,this._x=(s+r)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(r-s)/p,this._x=(a+h)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Dt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=i*d+r*o+s*h-a*c,this._y=s*d+r*c+a*o-i*h,this._z=a*d+r*h+i*c-s*o,this._w=r*d-i*o-s*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){const h=Math.acos(o),d=Math.sin(h);c=Math.sin(c*h)/d,t=Math.sin(t*h)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,h=2*(r*s-o*i),d=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+c*h+r*u-o*d,this.y=i+c*d+o*h-a*u,this.z=s+c*u+a*d-r*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this.z=Dt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this.z=Dt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Dt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Vl.copy(this).projectOnVector(e),this.sub(Vl)}reflect(e){return this.sub(Vl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Dt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vl=new L,qd=new as;class Rt{constructor(e,t,i,s,a,r,o,c,h){Rt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h)}set(e,t,i,s,a,r,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],c=i[6],h=i[1],d=i[4],u=i[7],m=i[2],p=i[5],x=i[8],_=s[0],g=s[3],f=s[6],y=s[1],v=s[4],M=s[7],E=s[2],S=s[5],C=s[8];return a[0]=r*_+o*y+c*E,a[3]=r*g+o*v+c*S,a[6]=r*f+o*M+c*C,a[1]=h*_+d*y+u*E,a[4]=h*g+d*v+u*S,a[7]=h*f+d*M+u*C,a[2]=m*_+p*y+x*E,a[5]=m*g+p*v+x*S,a[8]=m*f+p*M+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*r*d-t*o*h-i*a*d+i*o*c+s*a*h-s*r*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=d*r-o*h,m=o*c-d*a,p=h*a-r*c,x=t*u+i*m+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=u*_,e[1]=(s*h-d*i)*_,e[2]=(o*i-s*r)*_,e[3]=m*_,e[4]=(d*t-s*c)*_,e[5]=(s*a-o*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(r*t-i*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const c=Math.cos(a),h=Math.sin(a);return this.set(i*c,i*h,-i*(c*r+h*o)+r+e,-s*h,s*c,-s*(-h*r+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Gl.makeScale(e,t)),this}rotate(e){return this.premultiply(Gl.makeRotation(-e)),this}translate(e,t){return this.premultiply(Gl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Gl=new Rt,Yd=new Rt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$d=new Rt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Sm(){const n={enabled:!0,workingColorSpace:Ha,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===$t&&(s.r=ss(s.r),s.g=ss(s.g),s.b=ss(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===$t&&(s.r=Ua(s.r),s.g=Ua(s.g),s.b=Ua(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===_s?al:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return zr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return zr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ha]:{primaries:e,whitePoint:i,transfer:al,toXYZ:Yd,fromXYZ:$d,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Pt},outputColorSpaceConfig:{drawingBufferColorSpace:Pt}},[Pt]:{primaries:e,whitePoint:i,transfer:$t,toXYZ:Yd,fromXYZ:$d,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Pt}}}),n}const kt=Sm();function ss(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ua(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let la;class Tm{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{la===void 0&&(la=ol("canvas")),la.width=e.width,la.height=e.height;const s=la.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=la}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ol("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=ss(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ss(t[i]/255)*255):t[i]=ss(t[i]);return{data:t,width:e.width,height:e.height}}else return vt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Em=0;class nd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=Oi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Hl(s[r].image)):a.push(Hl(s[r]))}else a=Hl(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Hl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Tm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(vt("Texture: Unable to serialize Texture."),{})}let Am=0;const Wl=new L;class Un extends $a{constructor(e=Un.DEFAULT_IMAGE,t=Un.DEFAULT_MAPPING,i=is,s=is,a=oi,r=Xs,o=_i,c=Wi,h=Un.DEFAULT_ANISOTROPY,d=_s){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Am++}),this.uuid=Oi(),this.name="",this.source=new nd(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Rt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Wl).x}get height(){return this.source.getSize(Wl).y}get depth(){return this.source.getSize(Wl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){vt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){vt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==D0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Nn:e.x=e.x-Math.floor(e.x);break;case is:e.x=e.x<0?0:1;break;case Xc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Nn:e.y=e.y-Math.floor(e.y);break;case is:e.y=e.y<0?0:1;break;case Xc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Un.DEFAULT_IMAGE=null;Un.DEFAULT_MAPPING=D0;Un.DEFAULT_ANISOTROPY=1;class Kt{constructor(e=0,t=0,i=0,s=1){Kt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const c=e.elements,h=c[0],d=c[4],u=c[8],m=c[1],p=c[5],x=c[9],_=c[2],g=c[6],f=c[10];if(Math.abs(d-m)<.01&&Math.abs(u-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+m)<.1&&Math.abs(u+_)<.1&&Math.abs(x+g)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,M=(p+1)/2,E=(f+1)/2,S=(d+m)/4,C=(u+_)/4,A=(x+g)/4;return v>M&&v>E?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=S/i,a=C/i):M>E?M<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),i=S/s,a=A/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=C/a,s=A/a),this.set(i,s,a,t),this}let y=Math.sqrt((g-x)*(g-x)+(u-_)*(u-_)+(m-d)*(m-d));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(u-_)/y,this.z=(m-d)/y,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this.z=Dt(this.z,e.z,t.z),this.w=Dt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this.z=Dt(this.z,e,t),this.w=Dt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Dt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cm extends $a{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Kt(0,0,e,t),this.scissorTest=!1,this.viewport=new Kt(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Un(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:oi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new nd(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends Cm{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class V0 extends Un{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=is,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Rm extends Un{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=is,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sa{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(di.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(di.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=di.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,di):di.fromBufferAttribute(a,r),di.applyMatrix4(e.matrixWorld),this.expandByPoint(di);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),lo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),lo.copy(i.boundingBox)),lo.applyMatrix4(e.matrixWorld),this.union(lo)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,di),di.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ir),co.subVectors(this.max,ir),ca.subVectors(e.a,ir),ha.subVectors(e.b,ir),da.subVectors(e.c,ir),os.subVectors(ha,ca),ls.subVectors(da,ha),Is.subVectors(ca,da);let t=[0,-os.z,os.y,0,-ls.z,ls.y,0,-Is.z,Is.y,os.z,0,-os.x,ls.z,0,-ls.x,Is.z,0,-Is.x,-os.y,os.x,0,-ls.y,ls.x,0,-Is.y,Is.x,0];return!Xl(t,ca,ha,da,co)||(t=[1,0,0,0,1,0,0,0,1],!Xl(t,ca,ha,da,co))?!1:(ho.crossVectors(os,ls),t=[ho.x,ho.y,ho.z],Xl(t,ca,ha,da,co))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,di).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(di).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const $i=[new L,new L,new L,new L,new L,new L,new L,new L],di=new L,lo=new sa,ca=new L,ha=new L,da=new L,os=new L,ls=new L,Is=new L,ir=new L,co=new L,ho=new L,Fs=new L;function Xl(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Fs.fromArray(n,a);const o=s.x*Math.abs(Fs.x)+s.y*Math.abs(Fs.y)+s.z*Math.abs(Fs.z),c=e.dot(Fs),h=t.dot(Fs),d=i.dot(Fs);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const Pm=new sa,sr=new L,ql=new L;class Za{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Pm.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;sr.subVectors(e,this.center);const t=sr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(sr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ql.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(sr.copy(e.center).add(ql)),this.expandByPoint(sr.copy(e.center).sub(ql))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Zi=new L,Yl=new L,uo=new L,cs=new L,$l=new L,fo=new L,Zl=new L;class id{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Zi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zi.copy(this.origin).addScaledVector(this.direction,t),Zi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Yl.copy(e).add(t).multiplyScalar(.5),uo.copy(t).sub(e).normalize(),cs.copy(this.origin).sub(Yl);const a=e.distanceTo(t)*.5,r=-this.direction.dot(uo),o=cs.dot(this.direction),c=-cs.dot(uo),h=cs.lengthSq(),d=Math.abs(1-r*r);let u,m,p,x;if(d>0)if(u=r*c-o,m=r*o-c,x=a*d,u>=0)if(m>=-x)if(m<=x){const _=1/d;u*=_,m*=_,p=u*(u+r*m+2*o)+m*(r*u+m+2*c)+h}else m=a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;else m=-a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;else m<=-x?(u=Math.max(0,-(-r*a+o)),m=u>0?-a:Math.min(Math.max(-a,-c),a),p=-u*u+m*(m+2*c)+h):m<=x?(u=0,m=Math.min(Math.max(-a,-c),a),p=m*(m+2*c)+h):(u=Math.max(0,-(r*a+o)),m=u>0?a:Math.min(Math.max(-a,-c),a),p=-u*u+m*(m+2*c)+h);else m=r>0?-a:a,u=Math.max(0,-(r*m+o)),p=-u*u+m*(m+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Yl).addScaledVector(uo,m),p}intersectSphere(e,t){Zi.subVectors(e.center,this.origin);const i=Zi.dot(this.direction),s=Zi.dot(Zi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,m=this.origin;return h>=0?(i=(e.min.x-m.x)*h,s=(e.max.x-m.x)*h):(i=(e.max.x-m.x)*h,s=(e.min.x-m.x)*h),d>=0?(a=(e.min.y-m.y)*d,r=(e.max.y-m.y)*d):(a=(e.max.y-m.y)*d,r=(e.min.y-m.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-m.z)*u,c=(e.max.z-m.z)*u):(o=(e.max.z-m.z)*u,c=(e.min.z-m.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Zi)!==null}intersectTriangle(e,t,i,s,a){$l.subVectors(t,e),fo.subVectors(i,e),Zl.crossVectors($l,fo);let r=this.direction.dot(Zl),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;cs.subVectors(this.origin,e);const c=o*this.direction.dot(fo.crossVectors(cs,fo));if(c<0)return null;const h=o*this.direction.dot($l.cross(cs));if(h<0||c+h>r)return null;const d=-o*cs.dot(Zl);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class bt{constructor(e,t,i,s,a,r,o,c,h,d,u,m,p,x,_,g){bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,c,h,d,u,m,p,x,_,g)}set(e,t,i,s,a,r,o,c,h,d,u,m,p,x,_,g){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=c,f[2]=h,f[6]=d,f[10]=u,f[14]=m,f[3]=p,f[7]=x,f[11]=_,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new bt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/ua.setFromMatrixColumn(e,0).length(),a=1/ua.setFromMatrixColumn(e,1).length(),r=1/ua.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const m=r*d,p=r*u,x=o*d,_=o*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=p+x*h,t[5]=m-_*h,t[9]=-o*c,t[2]=_-m*h,t[6]=x+p*h,t[10]=r*c}else if(e.order==="YXZ"){const m=c*d,p=c*u,x=h*d,_=h*u;t[0]=m+_*o,t[4]=x*o-p,t[8]=r*h,t[1]=r*u,t[5]=r*d,t[9]=-o,t[2]=p*o-x,t[6]=_+m*o,t[10]=r*c}else if(e.order==="ZXY"){const m=c*d,p=c*u,x=h*d,_=h*u;t[0]=m-_*o,t[4]=-r*u,t[8]=x+p*o,t[1]=p+x*o,t[5]=r*d,t[9]=_-m*o,t[2]=-r*h,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const m=r*d,p=r*u,x=o*d,_=o*u;t[0]=c*d,t[4]=x*h-p,t[8]=m*h+_,t[1]=c*u,t[5]=_*h+m,t[9]=p*h-x,t[2]=-h,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const m=r*c,p=r*h,x=o*c,_=o*h;t[0]=c*d,t[4]=_-m*u,t[8]=x*u+p,t[1]=u,t[5]=r*d,t[9]=-o*d,t[2]=-h*d,t[6]=p*u+x,t[10]=m-_*u}else if(e.order==="XZY"){const m=r*c,p=r*h,x=o*c,_=o*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=m*u+_,t[5]=r*d,t[9]=p*u-x,t[2]=x*u-p,t[6]=o*d,t[10]=_*u+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Lm,e,Dm)}lookAt(e,t,i){const s=this.elements;return Yn.subVectors(e,t),Yn.lengthSq()===0&&(Yn.z=1),Yn.normalize(),hs.crossVectors(i,Yn),hs.lengthSq()===0&&(Math.abs(i.z)===1?Yn.x+=1e-4:Yn.z+=1e-4,Yn.normalize(),hs.crossVectors(i,Yn)),hs.normalize(),po.crossVectors(Yn,hs),s[0]=hs.x,s[4]=po.x,s[8]=Yn.x,s[1]=hs.y,s[5]=po.y,s[9]=Yn.y,s[2]=hs.z,s[6]=po.z,s[10]=Yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],c=i[8],h=i[12],d=i[1],u=i[5],m=i[9],p=i[13],x=i[2],_=i[6],g=i[10],f=i[14],y=i[3],v=i[7],M=i[11],E=i[15],S=s[0],C=s[4],A=s[8],w=s[12],b=s[1],P=s[5],D=s[9],O=s[13],Z=s[2],te=s[6],q=s[10],J=s[14],ne=s[3],pe=s[7],ve=s[11],$e=s[15];return a[0]=r*S+o*b+c*Z+h*ne,a[4]=r*C+o*P+c*te+h*pe,a[8]=r*A+o*D+c*q+h*ve,a[12]=r*w+o*O+c*J+h*$e,a[1]=d*S+u*b+m*Z+p*ne,a[5]=d*C+u*P+m*te+p*pe,a[9]=d*A+u*D+m*q+p*ve,a[13]=d*w+u*O+m*J+p*$e,a[2]=x*S+_*b+g*Z+f*ne,a[6]=x*C+_*P+g*te+f*pe,a[10]=x*A+_*D+g*q+f*ve,a[14]=x*w+_*O+g*J+f*$e,a[3]=y*S+v*b+M*Z+E*ne,a[7]=y*C+v*P+M*te+E*pe,a[11]=y*A+v*D+M*q+E*ve,a[15]=y*w+v*O+M*J+E*$e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],h=e[13],d=e[2],u=e[6],m=e[10],p=e[14],x=e[3],_=e[7],g=e[11],f=e[15];return x*(+a*c*u-s*h*u-a*o*m+i*h*m+s*o*p-i*c*p)+_*(+t*c*p-t*h*m+a*r*m-s*r*p+s*h*d-a*c*d)+g*(+t*h*u-t*o*p-a*r*u+i*r*p+a*o*d-i*h*d)+f*(-s*o*d-t*c*u+t*o*m+s*r*u-i*r*m+i*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=e[9],m=e[10],p=e[11],x=e[12],_=e[13],g=e[14],f=e[15],y=u*g*h-_*m*h+_*c*p-o*g*p-u*c*f+o*m*f,v=x*m*h-d*g*h-x*c*p+r*g*p+d*c*f-r*m*f,M=d*_*h-x*u*h+x*o*p-r*_*p-d*o*f+r*u*f,E=x*u*c-d*_*c-x*o*m+r*_*m+d*o*g-r*u*g,S=t*y+i*v+s*M+a*E;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/S;return e[0]=y*C,e[1]=(_*m*a-u*g*a-_*s*p+i*g*p+u*s*f-i*m*f)*C,e[2]=(o*g*a-_*c*a+_*s*h-i*g*h-o*s*f+i*c*f)*C,e[3]=(u*c*a-o*m*a-u*s*h+i*m*h+o*s*p-i*c*p)*C,e[4]=v*C,e[5]=(d*g*a-x*m*a+x*s*p-t*g*p-d*s*f+t*m*f)*C,e[6]=(x*c*a-r*g*a-x*s*h+t*g*h+r*s*f-t*c*f)*C,e[7]=(r*m*a-d*c*a+d*s*h-t*m*h-r*s*p+t*c*p)*C,e[8]=M*C,e[9]=(x*u*a-d*_*a-x*i*p+t*_*p+d*i*f-t*u*f)*C,e[10]=(r*_*a-x*o*a+x*i*h-t*_*h-r*i*f+t*o*f)*C,e[11]=(d*o*a-r*u*a-d*i*h+t*u*h+r*i*p-t*o*p)*C,e[12]=E*C,e[13]=(d*_*s-x*u*s+x*i*m-t*_*m-d*i*g+t*u*g)*C,e[14]=(x*o*s-r*_*s-x*i*c+t*_*c+r*i*g-t*o*g)*C,e[15]=(r*u*s-d*o*s+d*i*c-t*u*c-r*i*m+t*o*m)*C,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,c=e.z,h=a*r,d=a*o;return this.set(h*r+i,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+i,d*c-s*r,0,h*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,h=a+a,d=r+r,u=o+o,m=a*h,p=a*d,x=a*u,_=r*d,g=r*u,f=o*u,y=c*h,v=c*d,M=c*u,E=i.x,S=i.y,C=i.z;return s[0]=(1-(_+f))*E,s[1]=(p+M)*E,s[2]=(x-v)*E,s[3]=0,s[4]=(p-M)*S,s[5]=(1-(m+f))*S,s[6]=(g+y)*S,s[7]=0,s[8]=(x+v)*C,s[9]=(g-y)*C,s[10]=(1-(m+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=ua.set(s[0],s[1],s[2]).length();const r=ua.set(s[4],s[5],s[6]).length(),o=ua.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],ui.copy(this);const h=1/a,d=1/r,u=1/o;return ui.elements[0]*=h,ui.elements[1]*=h,ui.elements[2]*=h,ui.elements[4]*=d,ui.elements[5]*=d,ui.elements[6]*=d,ui.elements[8]*=u,ui.elements[9]*=u,ui.elements[10]*=u,t.setFromRotationMatrix(ui),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=Ui,c=!1){const h=this.elements,d=2*a/(t-e),u=2*a/(i-s),m=(t+e)/(t-e),p=(i+s)/(i-s);let x,_;if(c)x=a/(r-a),_=r*a/(r-a);else if(o===Ui)x=-(r+a)/(r-a),_=-2*r*a/(r-a);else if(o===rl)x=-r/(r-a),_=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=m,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=_,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Ui,c=!1){const h=this.elements,d=2/(t-e),u=2/(i-s),m=-(t+e)/(t-e),p=-(i+s)/(i-s);let x,_;if(c)x=1/(r-a),_=r/(r-a);else if(o===Ui)x=-2/(r-a),_=-(r+a)/(r-a);else if(o===rl)x=-1/(r-a),_=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=m,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=x,h[14]=_,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ua=new L,ui=new bt,Lm=new L(0,0,0),Dm=new L(1,1,1),hs=new L,po=new L,Yn=new L,Zd=new bt,Kd=new as;class wi{constructor(e=0,t=0,i=0,s=wi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],h=s[5],d=s[9],u=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Dt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(Dt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Dt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,p),this._y=0);break;default:vt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Zd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kd.setFromEuler(this),this.setFromQuaternion(Kd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}wi.DEFAULT_ORDER="XYZ";class sd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Im=0;const Jd=new L,fa=new as,Ki=new bt,mo=new L,ar=new L,Fm=new L,Um=new as,jd=new L(1,0,0),Qd=new L(0,1,0),eu=new L(0,0,1),tu={type:"added"},zm={type:"removed"},pa={type:"childadded",child:null},Kl={type:"childremoved",child:null};class zt extends $a{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Im++}),this.uuid=Oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zt.DEFAULT_UP.clone();const e=new L,t=new wi,i=new as,s=new L(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new bt},normalMatrix:{value:new Rt}}),this.matrix=new bt,this.matrixWorld=new bt,this.matrixAutoUpdate=zt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fa.setFromAxisAngle(e,t),this.quaternion.multiply(fa),this}rotateOnWorldAxis(e,t){return fa.setFromAxisAngle(e,t),this.quaternion.premultiply(fa),this}rotateX(e){return this.rotateOnAxis(jd,e)}rotateY(e){return this.rotateOnAxis(Qd,e)}rotateZ(e){return this.rotateOnAxis(eu,e)}translateOnAxis(e,t){return Jd.copy(e).applyQuaternion(this.quaternion),this.position.add(Jd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(jd,e)}translateY(e){return this.translateOnAxis(Qd,e)}translateZ(e){return this.translateOnAxis(eu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ki.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?mo.copy(e):mo.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ki.lookAt(ar,mo,this.up):Ki.lookAt(mo,ar,this.up),this.quaternion.setFromRotationMatrix(Ki),s&&(Ki.extractRotation(s.matrixWorld),fa.setFromRotationMatrix(Ki),this.quaternion.premultiply(fa.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ln("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tu),pa.child=e,this.dispatchEvent(pa),pa.child=null):ln("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zm),Kl.child=e,this.dispatchEvent(Kl),Kl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ki.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ki.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ki),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tu),pa.child=e,this.dispatchEvent(pa),pa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,e,Fm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,Um,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),h=r(e.textures),d=r(e.images),u=r(e.shapes),m=r(e.skeletons),p=r(e.animations),x=r(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=s,i;function r(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}zt.DEFAULT_UP=new L(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fi=new L,Ji=new L,Jl=new L,ji=new L,ma=new L,xa=new L,nu=new L,jl=new L,Ql=new L,ec=new L,tc=new Kt,nc=new Kt,ic=new Kt;class ai{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),fi.subVectors(e,t),s.cross(fi);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){fi.subVectors(s,t),Ji.subVectors(i,t),Jl.subVectors(e,t);const r=fi.dot(fi),o=fi.dot(Ji),c=fi.dot(Jl),h=Ji.dot(Ji),d=Ji.dot(Jl),u=r*h-o*o;if(u===0)return a.set(0,0,0),null;const m=1/u,p=(h*c-o*d)*m,x=(r*d-o*c)*m;return a.set(1-p-x,x,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,ji)===null?!1:ji.x>=0&&ji.y>=0&&ji.x+ji.y<=1}static getInterpolation(e,t,i,s,a,r,o,c){return this.getBarycoord(e,t,i,s,ji)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,ji.x),c.addScaledVector(r,ji.y),c.addScaledVector(o,ji.z),c)}static getInterpolatedAttribute(e,t,i,s,a,r){return tc.setScalar(0),nc.setScalar(0),ic.setScalar(0),tc.fromBufferAttribute(e,t),nc.fromBufferAttribute(e,i),ic.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(tc,a.x),r.addScaledVector(nc,a.y),r.addScaledVector(ic,a.z),r}static isFrontFacing(e,t,i,s){return fi.subVectors(i,t),Ji.subVectors(e,t),fi.cross(Ji).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fi.subVectors(this.c,this.b),Ji.subVectors(this.a,this.b),fi.cross(Ji).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ai.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ai.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return ai.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return ai.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ai.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;ma.subVectors(s,i),xa.subVectors(a,i),jl.subVectors(e,i);const c=ma.dot(jl),h=xa.dot(jl);if(c<=0&&h<=0)return t.copy(i);Ql.subVectors(e,s);const d=ma.dot(Ql),u=xa.dot(Ql);if(d>=0&&u<=d)return t.copy(s);const m=c*u-d*h;if(m<=0&&c>=0&&d<=0)return r=c/(c-d),t.copy(i).addScaledVector(ma,r);ec.subVectors(e,a);const p=ma.dot(ec),x=xa.dot(ec);if(x>=0&&p<=x)return t.copy(a);const _=p*h-c*x;if(_<=0&&h>=0&&x<=0)return o=h/(h-x),t.copy(i).addScaledVector(xa,o);const g=d*x-p*u;if(g<=0&&u-d>=0&&p-x>=0)return nu.subVectors(a,s),o=(u-d)/(u-d+(p-x)),t.copy(s).addScaledVector(nu,o);const f=1/(g+_+m);return r=_*f,o=m*f,t.copy(i).addScaledVector(ma,r).addScaledVector(xa,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const G0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ds={h:0,s:0,l:0},xo={h:0,s:0,l:0};function sc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,kt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=kt.workingColorSpace){return this.r=e,this.g=t,this.b=i,kt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=kt.workingColorSpace){if(e=td(e,1),t=Dt(t,0,1),i=Dt(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=sc(r,a,e+1/3),this.g=sc(r,a,e),this.b=sc(r,a,e-1/3)}return kt.colorSpaceToWorking(this,s),this}setStyle(e,t=Pt){function i(a){a!==void 0&&parseFloat(a)<1&&vt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:vt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);vt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const i=G0[e.toLowerCase()];return i!==void 0?this.setHex(i,t):vt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}copyLinearToSRGB(e){return this.r=Ua(e.r),this.g=Ua(e.g),this.b=Ua(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return kt.workingToColorSpace(Pn.copy(this),e),Math.round(Dt(Pn.r*255,0,255))*65536+Math.round(Dt(Pn.g*255,0,255))*256+Math.round(Dt(Pn.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=kt.workingColorSpace){kt.workingToColorSpace(Pn.copy(this),t);const i=Pn.r,s=Pn.g,a=Pn.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,h;const d=(o+r)/2;if(o===r)c=0,h=0;else{const u=r-o;switch(h=d<=.5?u/(r+o):u/(2-r-o),r){case i:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-i)/u+2;break;case a:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=kt.workingColorSpace){return kt.workingToColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=Pt){kt.workingToColorSpace(Pn.copy(this),e);const t=Pn.r,i=Pn.g,s=Pn.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ds),this.setHSL(ds.h+e,ds.s+t,ds.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ds),e.getHSL(xo);const i=yr(ds.h,xo.h,t),s=yr(ds.s,xo.s,t),a=yr(ds.l,xo.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pn=new rt;rt.NAMES=G0;let Nm=0;class Ls extends $a{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Nm++}),this.uuid=Oi(),this.name="",this.type="Material",this.blending=Fa,this.side=As,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fc,this.blendDst=Uc,this.blendEquation=Hs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=Ba,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oa,this.stencilZFail=oa,this.stencilZPass=oa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){vt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){vt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Fa&&(i.blending=this.blending),this.side!==As&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Fc&&(i.blendSrc=this.blendSrc),this.blendDst!==Uc&&(i.blendDst=this.blendDst),this.blendEquation!==Hs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ba&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==oa&&(i.stencilFail=this.stencilFail),this.stencilZFail!==oa&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==oa&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Et extends Ls{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wi,this.combine=Wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fn=new L,go=new Ue;let km=0;class jn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:km++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=_h,this.updateRanges=[],this.gpuType=Fi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)go.fromBufferAttribute(this,t),go.applyMatrix3(e),this.setXY(t,go.x,go.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix3(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix4(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyNormalMatrix(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.transformDirection(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=gi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Zt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array),a=Zt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_h&&(e.usage=this.usage),e}}class H0 extends jn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class W0 extends jn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class St extends jn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Om=0;const ni=new bt,ac=new zt,ga=new L,$n=new sa,rr=new sa,wn=new L;class jt extends $a{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Om++}),this.uuid=Oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(B0(e)?W0:H0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Rt().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ni.makeRotationFromQuaternion(e),this.applyMatrix4(ni),this}rotateX(e){return ni.makeRotationX(e),this.applyMatrix4(ni),this}rotateY(e){return ni.makeRotationY(e),this.applyMatrix4(ni),this}rotateZ(e){return ni.makeRotationZ(e),this.applyMatrix4(ni),this}translate(e,t,i){return ni.makeTranslation(e,t,i),this.applyMatrix4(ni),this}scale(e,t,i){return ni.makeScale(e,t,i),this.applyMatrix4(ni),this}lookAt(e){return ac.lookAt(e),ac.updateMatrix(),this.applyMatrix4(ac.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ga).negate(),this.translate(ga.x,ga.y,ga.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new St(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&vt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ln("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];$n.setFromBufferAttribute(a),this.morphTargetsRelative?(wn.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(wn),wn.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(wn)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ln('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Za);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ln("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if($n.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];rr.setFromBufferAttribute(o),this.morphTargetsRelative?(wn.addVectors($n.min,rr.min),$n.expandByPoint(wn),wn.addVectors($n.max,rr.max),$n.expandByPoint(wn)):($n.expandByPoint(rr.min),$n.expandByPoint(rr.max))}$n.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)wn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(wn));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)wn.fromBufferAttribute(o,h),c&&(ga.fromBufferAttribute(e,h),wn.add(ga)),s=Math.max(s,i.distanceToSquared(wn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ln('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ln("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new jn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<i.count;A++)o[A]=new L,c[A]=new L;const h=new L,d=new L,u=new L,m=new Ue,p=new Ue,x=new Ue,_=new L,g=new L;function f(A,w,b){h.fromBufferAttribute(i,A),d.fromBufferAttribute(i,w),u.fromBufferAttribute(i,b),m.fromBufferAttribute(a,A),p.fromBufferAttribute(a,w),x.fromBufferAttribute(a,b),d.sub(h),u.sub(h),p.sub(m),x.sub(m);const P=1/(p.x*x.y-x.x*p.y);isFinite(P)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(u,-p.y).multiplyScalar(P),g.copy(u).multiplyScalar(p.x).addScaledVector(d,-x.x).multiplyScalar(P),o[A].add(_),o[w].add(_),o[b].add(_),c[A].add(g),c[w].add(g),c[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let A=0,w=y.length;A<w;++A){const b=y[A],P=b.start,D=b.count;for(let O=P,Z=P+D;O<Z;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const v=new L,M=new L,E=new L,S=new L;function C(A){E.fromBufferAttribute(s,A),S.copy(E);const w=o[A];v.copy(w),v.sub(E.multiplyScalar(E.dot(w))).normalize(),M.crossVectors(S,w);const P=M.dot(c[A])<0?-1:1;r.setXYZW(A,v.x,v.y,v.z,P)}for(let A=0,w=y.length;A<w;++A){const b=y[A],P=b.start,D=b.count;for(let O=P,Z=P+D;O<Z;O+=3)C(e.getX(O+0)),C(e.getX(O+1)),C(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new jn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);const s=new L,a=new L,r=new L,o=new L,c=new L,h=new L,d=new L,u=new L;if(e)for(let m=0,p=e.count;m<p;m+=3){const x=e.getX(m+0),_=e.getX(m+1),g=e.getX(m+2);s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,_),r.fromBufferAttribute(t,g),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,g),o.add(d),c.add(d),h.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),a.fromBufferAttribute(t,m+1),r.fromBufferAttribute(t,m+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(m+0,d.x,d.y,d.z),i.setXYZ(m+1,d.x,d.y,d.z),i.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wn.fromBufferAttribute(e,t),wn.normalize(),e.setXYZ(t,wn.x,wn.y,wn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,u=o.normalized,m=new h.constructor(c.length*d);let p=0,x=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*d;for(let f=0;f<d;f++)m[x++]=h[p++]}return new jn(m,d,u)}if(this.index===null)return vt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new jt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,i);t.setAttribute(o,h)}const a=this.morphAttributes;for(const o in a){const c=[],h=a[o];for(let d=0,u=h.length;d<u;d++){const m=h[d],p=e(m,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const h=r[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,m=h.length;u<m;u++){const p=h[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],u=a[h];for(let m=0,p=u.length;m<p;m++)d.push(u[m].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let h=0,d=r.length;h<d;h++){const u=r[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const iu=new bt,Us=new id,vo=new Za,su=new L,Mo=new L,_o=new L,yo=new L,rc=new L,bo=new L,au=new L,wo=new L;class z extends zt{constructor(e=new jt,t=new Et){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){bo.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=o[c],u=a[c];d!==0&&(rc.fromBufferAttribute(u,e),r?bo.addScaledVector(rc,d):bo.addScaledVector(rc.sub(t),d))}t.add(bo)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),vo.copy(i.boundingSphere),vo.applyMatrix4(a),Us.copy(e.ray).recast(e.near),!(vo.containsPoint(Us.origin)===!1&&(Us.intersectSphere(vo,su)===null||Us.origin.distanceToSquared(su)>(e.far-e.near)**2))&&(iu.copy(a).invert(),Us.copy(e.ray).applyMatrix4(iu),!(i.boundingBox!==null&&Us.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Us)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,m=a.groups,p=a.drawRange;if(o!==null)if(Array.isArray(r))for(let x=0,_=m.length;x<_;x++){const g=m[x],f=r[g.materialIndex],y=Math.max(g.start,p.start),v=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let M=y,E=v;M<E;M+=3){const S=o.getX(M),C=o.getX(M+1),A=o.getX(M+2);s=So(this,f,e,i,h,d,u,S,C,A),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let g=x,f=_;g<f;g+=3){const y=o.getX(g),v=o.getX(g+1),M=o.getX(g+2);s=So(this,r,e,i,h,d,u,y,v,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let x=0,_=m.length;x<_;x++){const g=m[x],f=r[g.materialIndex],y=Math.max(g.start,p.start),v=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let M=y,E=v;M<E;M+=3){const S=M,C=M+1,A=M+2;s=So(this,f,e,i,h,d,u,S,C,A),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let g=x,f=_;g<f;g+=3){const y=g,v=g+1,M=g+2;s=So(this,r,e,i,h,d,u,y,v,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Bm(n,e,t,i,s,a,r,o){let c;if(e.side===Fn?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,e.side===As,o),c===null)return null;wo.copy(o),wo.applyMatrix4(n.matrixWorld);const h=t.ray.origin.distanceTo(wo);return h<t.near||h>t.far?null:{distance:h,point:wo.clone(),object:n}}function So(n,e,t,i,s,a,r,o,c,h){n.getVertexPosition(o,Mo),n.getVertexPosition(c,_o),n.getVertexPosition(h,yo);const d=Bm(n,e,t,i,Mo,_o,yo,au);if(d){const u=new L;ai.getBarycoord(au,Mo,_o,yo,u),s&&(d.uv=ai.getInterpolatedAttribute(s,o,c,h,u,new Ue)),a&&(d.uv1=ai.getInterpolatedAttribute(a,o,c,h,u,new Ue)),r&&(d.normal=ai.getInterpolatedAttribute(r,o,c,h,u,new L),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const m={a:o,b:c,c:h,normal:new L,materialIndex:0};ai.getNormal(Mo,_o,yo,m.normal),d.face=m,d.barycoord=u}return d}class le extends jt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],h=[],d=[],u=[];let m=0,p=0;x("z","y","x",-1,-1,i,t,e,r,a,0),x("z","y","x",1,-1,i,t,-e,r,a,1),x("x","z","y",1,1,e,i,t,s,r,2),x("x","z","y",1,-1,e,i,-t,s,r,3),x("x","y","z",1,-1,e,t,i,s,a,4),x("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new St(h,3)),this.setAttribute("normal",new St(d,3)),this.setAttribute("uv",new St(u,2));function x(_,g,f,y,v,M,E,S,C,A,w){const b=M/C,P=E/A,D=M/2,O=E/2,Z=S/2,te=C+1,q=A+1;let J=0,ne=0;const pe=new L;for(let ve=0;ve<q;ve++){const $e=ve*P-O;for(let I=0;I<te;I++){const Ce=I*b-D;pe[_]=Ce*y,pe[g]=$e*v,pe[f]=Z,h.push(pe.x,pe.y,pe.z),pe[_]=0,pe[g]=0,pe[f]=S>0?1:-1,d.push(pe.x,pe.y,pe.z),u.push(I/C),u.push(1-ve/A),J+=1}}for(let ve=0;ve<A;ve++)for(let $e=0;$e<C;$e++){const I=m+$e+te*ve,Ce=m+$e+te*(ve+1),be=m+($e+1)+te*(ve+1),Re=m+($e+1)+te*ve;c.push(I,Ce,Re),c.push(Ce,be,Re),ne+=6}o.addGroup(p,ne,w),p+=ne,m+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new le(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Wa(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(vt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Gn(n){const e={};for(let t=0;t<n.length;t++){const i=Wa(n[t]);for(const s in i)e[s]=i[s]}return e}function Vm(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function X0(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:kt.workingColorSpace}const kr={clone:Wa,merge:Gn};var Gm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tn extends Ls{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gm,this.fragmentShader=Hm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wa(e.uniforms),this.uniformsGroups=Vm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class q0 extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new bt,this.projectionMatrix=new bt,this.projectionMatrixInverse=new bt,this.coordinateSystem=Ui,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const us=new L,ru=new Ue,ou=new Ue;class Zn extends q0{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Nr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(_r*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Nr*2*Math.atan(Math.tan(_r*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){us.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(us.x,us.y).multiplyScalar(-e/us.z),us.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(us.x,us.y).multiplyScalar(-e/us.z)}getViewSize(e,t){return this.getViewBounds(e,ru,ou),t.subVectors(ou,ru)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(_r*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,h=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*i/h,s*=r.width/c,i*=r.height/h}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const va=-90,Ma=1;class Wm extends zt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zn(va,Ma,e,t);s.layers=this.layers,this.add(s);const a=new Zn(va,Ma,e,t);a.layers=this.layers,this.add(a);const r=new Zn(va,Ma,e,t);r.layers=this.layers,this.add(r);const o=new Zn(va,Ma,e,t);o.layers=this.layers,this.add(o);const c=new Zn(va,Ma,e,t);c.layers=this.layers,this.add(c);const h=new Zn(va,Ma,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,c]=t;for(const h of t)this.remove(h);if(e===Ui)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===rl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,h,d]=this.children,u=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,m,p),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Y0 extends Un{constructor(e=[],t=Va,i,s,a,r,o,c,h,d){super(e,t,i,s,a,r,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Xm extends bi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Y0(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new le(5,5,5),a=new Tn({name:"CubemapFromEquirect",uniforms:Wa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fn,blending:Ni});a.uniforms.tEquirect.value=t;const r=new z(s,a),o=t.minFilter;return t.minFilter===Xs&&(t.minFilter=oi),new Wm(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class tt extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qm={type:"move"};class oc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){r=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),f=this._getHandJoint(h,_);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],m=d.position.distanceTo(u.position),p=.02,x=.005;h.inputState.pinching&&m>p+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=p-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qm)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new tt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class ad{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new rt(e),this.near=t,this.far=i}clone(){return new ad(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class $0 extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wi,this.environmentIntensity=1,this.environmentRotation=new wi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Ym{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=_h,this.updateRanges=[],this.version=0,this.uuid=Oi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Bn=new L;class cl{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Bn.fromBufferAttribute(this,t),Bn.applyMatrix4(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Bn.fromBufferAttribute(this,t),Bn.applyNormalMatrix(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Bn.fromBufferAttribute(this,t),Bn.transformDirection(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=gi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Zt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=gi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=gi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=gi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=gi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),s=Zt(s,this.array),a=Zt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){ll("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new jn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new cl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ll("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Al extends Ls{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let _a;const or=new L,ya=new L,ba=new L,wa=new Ue,lr=new Ue,Z0=new bt,To=new L,cr=new L,Eo=new L,lu=new Ue,lc=new Ue,cu=new Ue;class hl extends zt{constructor(e=new Al){if(super(),this.isSprite=!0,this.type="Sprite",_a===void 0){_a=new jt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Ym(t,5);_a.setIndex([0,1,2,0,2,3]),_a.setAttribute("position",new cl(i,3,0,!1)),_a.setAttribute("uv",new cl(i,2,3,!1))}this.geometry=_a,this.material=e,this.center=new Ue(.5,.5),this.count=1}raycast(e,t){e.camera===null&&ln('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ya.setFromMatrixScale(this.matrixWorld),Z0.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ba.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ya.multiplyScalar(-ba.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;Ao(To.set(-.5,-.5,0),ba,r,ya,s,a),Ao(cr.set(.5,-.5,0),ba,r,ya,s,a),Ao(Eo.set(.5,.5,0),ba,r,ya,s,a),lu.set(0,0),lc.set(1,0),cu.set(1,1);let o=e.ray.intersectTriangle(To,cr,Eo,!1,or);if(o===null&&(Ao(cr.set(-.5,.5,0),ba,r,ya,s,a),lc.set(0,1),o=e.ray.intersectTriangle(To,Eo,cr,!1,or),o===null))return;const c=e.ray.origin.distanceTo(or);c<e.near||c>e.far||t.push({distance:c,point:or.clone(),uv:ai.getInterpolation(or,To,cr,Eo,lu,lc,cu,new Ue),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ao(n,e,t,i,s,a){wa.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(lr.x=a*wa.x-s*wa.y,lr.y=s*wa.x+a*wa.y):lr.copy(wa),n.copy(e),n.x+=lr.x,n.y+=lr.y,n.applyMatrix4(Z0)}class K0 extends Un{constructor(e=null,t=1,i=1,s,a,r,o,c,h=Jn,d=Jn,u,m){super(null,r,o,c,h,d,s,a,u,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dl extends jn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Sa=new bt,hu=new bt,Co=[],du=new sa,$m=new bt,hr=new z,dr=new Za;class nn extends z{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new dl(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,$m)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new sa),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Sa),du.copy(e.boundingBox).applyMatrix4(Sa),this.boundingBox.union(du)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Za),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Sa),dr.copy(e.boundingSphere).applyMatrix4(Sa),this.boundingSphere.union(dr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=e*a+1;for(let o=0;o<i.length;o++)i[o]=s[r+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(hr.geometry=this.geometry,hr.material=this.material,hr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),dr.copy(this.boundingSphere),dr.applyMatrix4(i),e.ray.intersectsSphere(dr)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,Sa),hu.multiplyMatrices(i,Sa),hr.matrixWorld=hu,hr.raycast(e,Co);for(let r=0,o=Co.length;r<o;r++){const c=Co[r];c.instanceId=a,c.object=this,t.push(c)}Co.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new dl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new K0(new Float32Array(s*this.count),s,this.count,Zh,Fi));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const o=this.geometry.morphTargetsRelative?1:1-r,c=s*e;a[c]=o,a.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const cc=new L,Zm=new L,Km=new Rt;class Bs{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=cc.subVectors(i,t).cross(Zm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(cc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Km.getNormalMatrix(e),s=this.coplanarPoint(cc).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zs=new Za,Jm=new Ue(.5,.5),Ro=new L;class rd{constructor(e=new Bs,t=new Bs,i=new Bs,s=new Bs,a=new Bs,r=new Bs){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ui,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],h=a[3],d=a[4],u=a[5],m=a[6],p=a[7],x=a[8],_=a[9],g=a[10],f=a[11],y=a[12],v=a[13],M=a[14],E=a[15];if(s[0].setComponents(h-r,p-d,f-x,E-y).normalize(),s[1].setComponents(h+r,p+d,f+x,E+y).normalize(),s[2].setComponents(h+o,p+u,f+_,E+v).normalize(),s[3].setComponents(h-o,p-u,f-_,E-v).normalize(),i)s[4].setComponents(c,m,g,M).normalize(),s[5].setComponents(h-c,p-m,f-g,E-M).normalize();else if(s[4].setComponents(h-c,p-m,f-g,E-M).normalize(),t===Ui)s[5].setComponents(h+c,p+m,f+g,E+M).normalize();else if(t===rl)s[5].setComponents(c,m,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zs)}intersectsSprite(e){zs.center.set(0,0,0);const t=Jm.distanceTo(e.center);return zs.radius=.7071067811865476+t,zs.applyMatrix4(e.matrixWorld),this.intersectsSphere(zs)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Ro.x=s.normal.x>0?e.max.x:e.min.x,Ro.y=s.normal.y>0?e.max.y:e.min.y,Ro.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ro)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ul extends Ls{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const fl=new L,pl=new L,uu=new bt,ur=new id,Po=new Za,hc=new L,fu=new L;class yh extends zt{constructor(e=new jt,t=new ul){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)fl.fromBufferAttribute(t,s-1),pl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=fl.distanceTo(pl);e.setAttribute("lineDistance",new St(i,1))}else vt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Po.copy(i.boundingSphere),Po.applyMatrix4(s),Po.radius+=a,e.ray.intersectsSphere(Po)===!1)return;uu.copy(s).invert(),ur.copy(e.ray).applyMatrix4(uu);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,d=i.index,m=i.attributes.position;if(d!==null){const p=Math.max(0,r.start),x=Math.min(d.count,r.start+r.count);for(let _=p,g=x-1;_<g;_+=h){const f=d.getX(_),y=d.getX(_+1),v=Lo(this,e,ur,c,f,y,_);v&&t.push(v)}if(this.isLineLoop){const _=d.getX(x-1),g=d.getX(p),f=Lo(this,e,ur,c,_,g,x-1);f&&t.push(f)}}else{const p=Math.max(0,r.start),x=Math.min(m.count,r.start+r.count);for(let _=p,g=x-1;_<g;_+=h){const f=Lo(this,e,ur,c,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){const _=Lo(this,e,ur,c,x-1,p,x-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Lo(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(fl.fromBufferAttribute(o,s),pl.fromBufferAttribute(o,a),t.distanceSqToSegment(fl,pl,hc,fu)>i)return;hc.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(hc);if(!(h<e.near||h>e.far))return{distance:h,point:fu.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const pu=new L,mu=new L;class jm extends yh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)pu.fromBufferAttribute(t,s),mu.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+pu.distanceTo(mu);e.setAttribute("lineDistance",new St(i,1))}else vt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Qt extends Un{constructor(e,t,i,s,a,r,o,c,h){super(e,t,i,s,a,r,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class J0 extends Un{constructor(e,t,i=ea,s,a,r,o=Jn,c=Jn,h,d=Fr,u=1){if(d!==Fr&&d!==Ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:u};super(m,s,a,r,o,c,d,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nd(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class j0 extends Un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class _n extends jt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],c=[],h=new L,d=new Ue;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,m=3;u<=t;u++,m+=3){const p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),r.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(r[m]/e+1)/2,d.y=(r[m+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new St(r,3)),this.setAttribute("normal",new St(o,3)),this.setAttribute("uv",new St(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _n(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class We extends jt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],m=[],p=[];let x=0;const _=[],g=i/2;let f=0;y(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new St(u,3)),this.setAttribute("normal",new St(m,3)),this.setAttribute("uv",new St(p,2));function y(){const M=new L,E=new L;let S=0;const C=(t-e)/i;for(let A=0;A<=a;A++){const w=[],b=A/a,P=b*(t-e)+e;for(let D=0;D<=s;D++){const O=D/s,Z=O*c+o,te=Math.sin(Z),q=Math.cos(Z);E.x=P*te,E.y=-b*i+g,E.z=P*q,u.push(E.x,E.y,E.z),M.set(te,C,q).normalize(),m.push(M.x,M.y,M.z),p.push(O,1-b),w.push(x++)}_.push(w)}for(let A=0;A<s;A++)for(let w=0;w<a;w++){const b=_[w][A],P=_[w+1][A],D=_[w+1][A+1],O=_[w][A+1];(e>0||w!==0)&&(d.push(b,P,O),S+=3),(t>0||w!==a-1)&&(d.push(P,D,O),S+=3)}h.addGroup(f,S,0),f+=S}function v(M){const E=x,S=new Ue,C=new L;let A=0;const w=M===!0?e:t,b=M===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*b,0),m.push(0,b,0),p.push(.5,.5),x++;const P=x;for(let D=0;D<=s;D++){const Z=D/s*c+o,te=Math.cos(Z),q=Math.sin(Z);C.x=w*q,C.y=g*b,C.z=w*te,u.push(C.x,C.y,C.z),m.push(0,b,0),S.x=te*.5+.5,S.y=q*.5*b+.5,p.push(S.x,S.y),x++}for(let D=0;D<s;D++){const O=E+D,Z=P+D;M===!0?d.push(Z,Z+1,O):d.push(Z+1,Z,O),A+=3}h.addGroup(f,A,M===!0?1:2),f+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new We(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Di extends We{constructor(e=1,t=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new Di(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Cl extends jt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),h(i),d(),this.setAttribute("position",new St(a,3)),this.setAttribute("normal",new St(a.slice(),3)),this.setAttribute("uv",new St(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new L,M=new L,E=new L;for(let S=0;S<t.length;S+=3)p(t[S+0],v),p(t[S+1],M),p(t[S+2],E),c(v,M,E,y)}function c(y,v,M,E){const S=E+1,C=[];for(let A=0;A<=S;A++){C[A]=[];const w=y.clone().lerp(M,A/S),b=v.clone().lerp(M,A/S),P=S-A;for(let D=0;D<=P;D++)D===0&&A===S?C[A][D]=w:C[A][D]=w.clone().lerp(b,D/P)}for(let A=0;A<S;A++)for(let w=0;w<2*(S-A)-1;w++){const b=Math.floor(w/2);w%2===0?(m(C[A][b+1]),m(C[A+1][b]),m(C[A][b])):(m(C[A][b+1]),m(C[A+1][b+1]),m(C[A+1][b]))}}function h(y){const v=new L;for(let M=0;M<a.length;M+=3)v.x=a[M+0],v.y=a[M+1],v.z=a[M+2],v.normalize().multiplyScalar(y),a[M+0]=v.x,a[M+1]=v.y,a[M+2]=v.z}function d(){const y=new L;for(let v=0;v<a.length;v+=3){y.x=a[v+0],y.y=a[v+1],y.z=a[v+2];const M=g(y)/2/Math.PI+.5,E=f(y)/Math.PI+.5;r.push(M,1-E)}x(),u()}function u(){for(let y=0;y<r.length;y+=6){const v=r[y+0],M=r[y+2],E=r[y+4],S=Math.max(v,M,E),C=Math.min(v,M,E);S>.9&&C<.1&&(v<.2&&(r[y+0]+=1),M<.2&&(r[y+2]+=1),E<.2&&(r[y+4]+=1))}}function m(y){a.push(y.x,y.y,y.z)}function p(y,v){const M=y*3;v.x=e[M+0],v.y=e[M+1],v.z=e[M+2]}function x(){const y=new L,v=new L,M=new L,E=new L,S=new Ue,C=new Ue,A=new Ue;for(let w=0,b=0;w<a.length;w+=9,b+=6){y.set(a[w+0],a[w+1],a[w+2]),v.set(a[w+3],a[w+4],a[w+5]),M.set(a[w+6],a[w+7],a[w+8]),S.set(r[b+0],r[b+1]),C.set(r[b+2],r[b+3]),A.set(r[b+4],r[b+5]),E.copy(y).add(v).add(M).divideScalar(3);const P=g(E);_(S,b+0,y,P),_(C,b+2,v,P),_(A,b+4,M,P)}}function _(y,v,M,E){E<0&&y.x===1&&(r[v]=y.x-1),M.x===0&&M.z===0&&(r[v]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cl(e.vertices,e.indices,e.radius,e.details)}}class od extends Cl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=1/i,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new od(e.radius,e.detail)}}class Xi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){vt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,c=a-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-r,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const d=i[s],m=i[s+1]-d,p=(r-d)/m;return(s+p)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=t||(r.isVector2?new Ue:new L);return c.copy(o).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,s=[],a=[],r=[],o=new L,c=new bt;for(let p=0;p<=e;p++){const x=p/e;s[p]=this.getTangentAt(x,new L)}a[0]=new L,r[0]=new L;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),m=Math.abs(s[0].z);d<=h&&(h=d,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),m<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let p=1;p<=e;p++){if(a[p]=a[p-1].clone(),r[p]=r[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(Dt(s[p-1].dot(s[p]),-1,1));a[p].applyMatrix4(c.makeRotationAxis(o,x))}r[p].crossVectors(s[p],a[p])}if(t===!0){let p=Math.acos(Dt(a[0].dot(a[e]),-1,1));p/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(p=-p);for(let x=1;x<=e;x++)a[x].applyMatrix4(c.makeRotationAxis(s[x],p*x)),r[x].crossVectors(s[x],a[x])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ld extends Xi{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ue){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),m=c-this.aX,p=h-this.aY;c=m*d-p*u+this.aX,h=m*u+p*d+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Qm extends ld{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function cd(){let n=0,e=0,t=0,i=0;function s(a,r,o,c){n=a,e=o,t=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,h){s(r,o,h*(o-a),h*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,h,d,u){let m=(r-a)/h-(o-a)/(h+d)+(o-r)/d,p=(o-r)/d-(c-r)/(d+u)+(c-o)/u;m*=d,p*=d,s(r,o,m,p)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const Do=new L,dc=new cd,uc=new cd,fc=new cd;class ex extends Xi{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%a]:(Do.subVectors(s[0],s[1]).add(s[0]),h=Do);const u=s[o%a],m=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(Do.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=Do),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(m),p),g=Math.pow(m.distanceToSquared(d),p);_<1e-4&&(_=1),x<1e-4&&(x=_),g<1e-4&&(g=_),dc.initNonuniformCatmullRom(h.x,u.x,m.x,d.x,x,_,g),uc.initNonuniformCatmullRom(h.y,u.y,m.y,d.y,x,_,g),fc.initNonuniformCatmullRom(h.z,u.z,m.z,d.z,x,_,g)}else this.curveType==="catmullrom"&&(dc.initCatmullRom(h.x,u.x,m.x,d.x,this.tension),uc.initCatmullRom(h.y,u.y,m.y,d.y,this.tension),fc.initCatmullRom(h.z,u.z,m.z,d.z,this.tension));return i.set(dc.calc(c),uc.calc(c),fc.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function xu(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+a+r)*c+(-3*t+3*i-2*a-r)*o+a*n+t}function tx(n,e){const t=1-n;return t*t*e}function nx(n,e){return 2*(1-n)*n*e}function ix(n,e){return n*n*e}function br(n,e,t,i){return tx(n,e)+nx(n,t)+ix(n,i)}function sx(n,e){const t=1-n;return t*t*t*e}function ax(n,e){const t=1-n;return 3*t*t*n*e}function rx(n,e){return 3*(1-n)*n*n*e}function ox(n,e){return n*n*n*e}function wr(n,e,t,i,s){return sx(n,e)+ax(n,t)+rx(n,i)+ox(n,s)}class Q0 extends Xi{constructor(e=new Ue,t=new Ue,i=new Ue,s=new Ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Ue){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(wr(e,s.x,a.x,r.x,o.x),wr(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lx extends Xi{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(wr(e,s.x,a.x,r.x,o.x),wr(e,s.y,a.y,r.y,o.y),wr(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ef extends Xi{constructor(e=new Ue,t=new Ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ue){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cx extends Xi{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class tf extends Xi{constructor(e=new Ue,t=new Ue,i=new Ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ue){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(br(e,s.x,a.x,r.x),br(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hx extends Xi{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(br(e,s.x,a.x,r.x),br(e,s.y,a.y,r.y),br(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class nf extends Xi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ue){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],h=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(xu(o,c.x,h.x,d.x,u.x),xu(o,c.y,h.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new Ue().fromArray(s))}return this}}var gu=Object.freeze({__proto__:null,ArcCurve:Qm,CatmullRomCurve3:ex,CubicBezierCurve:Q0,CubicBezierCurve3:lx,EllipseCurve:ld,LineCurve:ef,LineCurve3:cx,QuadraticBezierCurve:tf,QuadraticBezierCurve3:hx,SplineCurve:nf});class dx extends Xi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new gu[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),h=c===0?0:1-r/c;return o.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(o);for(let h=0;h<c.length;h++){const d=c[h];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new gu[s.type]().fromJSON(s))}return this}}class vu extends dx{constructor(e){super(),this.type="Path",this.currentPoint=new Ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new ef(this.currentPoint.clone(),new Ue(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new tf(this.currentPoint.clone(),new Ue(e,t),new Ue(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new Q0(this.currentPoint.clone(),new Ue(e,t),new Ue(i,s),new Ue(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new nf(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,i,s,a,r,o,c),this}absellipse(e,t,i,s,a,r,o,c){const h=new ld(e,t,i,s,a,r,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class hd extends vu{constructor(e){super(e),this.uuid=Oi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new vu().fromJSON(s))}return this}}function ux(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=sf(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,h;if(i&&(a=gx(n,e,a,t)),n.length>80*t){o=n[0],c=n[1];let d=o,u=c;for(let m=t;m<s;m+=t){const p=n[m],x=n[m+1];p<o&&(o=p),x<c&&(c=x),p>d&&(d=p),x>u&&(u=x)}h=Math.max(d-o,u-c),h=h!==0?32767/h:0}return Or(a,r,t,o,c,h,0),r}function sf(n,e,t,i,s){let a;if(s===Cx(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=Mu(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=Mu(r/i|0,n[r],n[r+1],a);return a&&Xa(a,a.next)&&(Vr(a),a=a.next),a}function ta(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Xa(t,t.next)||cn(t.prev,t,t.next)===0)){if(Vr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Or(n,e,t,i,s,a,r){if(!n)return;!r&&a&&bx(n,i,s,a);let o=n;for(;n.prev!==n.next;){const c=n.prev,h=n.next;if(a?px(n,i,s,a):fx(n)){e.push(c.i,n.i,h.i),Vr(n),n=h.next,o=h.next;continue}if(n=h,n===o){r?r===1?(n=mx(ta(n),e),Or(n,e,t,i,s,a,2)):r===2&&xx(n,e,t,i,s,a):Or(ta(n),e,t,i,s,a,1);break}}}function fx(n){const e=n.prev,t=n,i=n.next;if(cn(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,c=t.y,h=i.y,d=Math.min(s,a,r),u=Math.min(o,c,h),m=Math.max(s,a,r),p=Math.max(o,c,h);let x=i.next;for(;x!==e;){if(x.x>=d&&x.x<=m&&x.y>=u&&x.y<=p&&gr(s,o,a,c,r,h,x.x,x.y)&&cn(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function px(n,e,t,i){const s=n.prev,a=n,r=n.next;if(cn(s,a,r)>=0)return!1;const o=s.x,c=a.x,h=r.x,d=s.y,u=a.y,m=r.y,p=Math.min(o,c,h),x=Math.min(d,u,m),_=Math.max(o,c,h),g=Math.max(d,u,m),f=bh(p,x,e,t,i),y=bh(_,g,e,t,i);let v=n.prevZ,M=n.nextZ;for(;v&&v.z>=f&&M&&M.z<=y;){if(v.x>=p&&v.x<=_&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&gr(o,d,c,u,h,m,v.x,v.y)&&cn(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=p&&M.x<=_&&M.y>=x&&M.y<=g&&M!==s&&M!==r&&gr(o,d,c,u,h,m,M.x,M.y)&&cn(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=_&&v.y>=x&&v.y<=g&&v!==s&&v!==r&&gr(o,d,c,u,h,m,v.x,v.y)&&cn(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=y;){if(M.x>=p&&M.x<=_&&M.y>=x&&M.y<=g&&M!==s&&M!==r&&gr(o,d,c,u,h,m,M.x,M.y)&&cn(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function mx(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Xa(i,s)&&rf(i,t,t.next,s)&&Br(i,s)&&Br(s,i)&&(e.push(i.i,t.i,s.i),Vr(t),Vr(t.next),t=n=s),t=t.next}while(t!==n);return ta(t)}function xx(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&Tx(r,o)){let c=of(r,o);r=ta(r,r.next),c=ta(c,c.next),Or(r,e,t,i,s,a,0),Or(c,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function gx(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,c=a<r-1?e[a+1]*i:n.length,h=sf(n,o,c,i,!1);h===h.next&&(h.steiner=!0),s.push(Sx(h))}s.sort(vx);for(let a=0;a<s.length;a++)t=Mx(s[a],t);return t}function vx(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Mx(n,e){const t=_x(n,e);if(!t)return e;const i=of(t,n);return ta(i,i.next),ta(t,t.next)}function _x(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(Xa(n,t))return t;do{if(Xa(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,c=r.x,h=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=c&&i!==t.x&&af(s<h?i:a,s,c,h,s<h?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Br(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&yx(r,t)))&&(r=t,d=u)}t=t.next}while(t!==o);return r}function yx(n,e){return cn(n.prev,n,e.prev)<0&&cn(e.next,n,n.next)<0}function bx(n,e,t,i){let s=n;do s.z===0&&(s.z=bh(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,wx(s)}function wx(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let h=0;h<t&&(o++,r=r.nextZ,!!r);h++);let c=t;for(;o>0||c>0&&r;)o!==0&&(c===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function bh(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Sx(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function af(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function gr(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&af(n,e,t,i,s,a,r,o)}function Tx(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Ex(n,e)&&(Br(n,e)&&Br(e,n)&&Ax(n,e)&&(cn(n.prev,n,e.prev)||cn(n,e.prev,e))||Xa(n,e)&&cn(n.prev,n,n.next)>0&&cn(e.prev,e,e.next)>0)}function cn(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Xa(n,e){return n.x===e.x&&n.y===e.y}function rf(n,e,t,i){const s=Fo(cn(n,e,t)),a=Fo(cn(n,e,i)),r=Fo(cn(t,i,n)),o=Fo(cn(t,i,e));return!!(s!==a&&r!==o||s===0&&Io(n,t,e)||a===0&&Io(n,i,e)||r===0&&Io(t,n,i)||o===0&&Io(t,e,i))}function Io(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Fo(n){return n>0?1:n<0?-1:0}function Ex(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&rf(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Br(n,e){return cn(n.prev,n,n.next)<0?cn(n,e,n.next)>=0&&cn(n,n.prev,e)>=0:cn(n,e,n.prev)<0||cn(n,n.next,e)<0}function Ax(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function of(n,e){const t=wh(n.i,n.x,n.y),i=wh(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function Mu(n,e,t,i){const s=wh(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Vr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function wh(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Cx(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class Rx{static triangulate(e,t,i=2){return ux(e,t,i)}}class Sr{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return Sr.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];_u(e),yu(i,e);let r=e.length;t.forEach(_u);for(let c=0;c<t.length;c++)s.push(r),r+=t[c].length,yu(i,t[c]);const o=Rx.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function _u(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function yu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class dd extends Cl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new dd(e.radius,e.detail)}}class Ut extends jt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,d=c+1,u=e/o,m=t/c,p=[],x=[],_=[],g=[];for(let f=0;f<d;f++){const y=f*m-r;for(let v=0;v<h;v++){const M=v*u-a;x.push(M,-y,0),_.push(0,0,1),g.push(v/o),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<o;y++){const v=y+h*f,M=y+h*(f+1),E=y+1+h*(f+1),S=y+1+h*f;p.push(v,M,S),p.push(M,E,S)}this.setIndex(p),this.setAttribute("position",new St(x,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ut(e.width,e.height,e.widthSegments,e.heightSegments)}}class Rl extends jt{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let u=e;const m=(t-e)/s,p=new L,x=new Ue;for(let _=0;_<=s;_++){for(let g=0;g<=i;g++){const f=a+g/i*r;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),h.push(0,0,1),x.x=(p.x/t+1)/2,x.y=(p.y/t+1)/2,d.push(x.x,x.y)}u+=m}for(let _=0;_<s;_++){const g=_*(i+1);for(let f=0;f<i;f++){const y=f+g,v=y,M=y+i+1,E=y+i+2,S=y+1;o.push(v,M,S),o.push(M,E,S)}}this.setIndex(o),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(h,3)),this.setAttribute("uv",new St(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Pl extends jt{constructor(e=new hd([new Ue(0,.5),new Ue(-.5,-.5),new Ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new St(s,3)),this.setAttribute("normal",new St(a,3)),this.setAttribute("uv",new St(r,2));function h(d){const u=s.length/3,m=d.extractPoints(t);let p=m.shape;const x=m.holes;Sr.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,f=x.length;g<f;g++){const y=x[g];Sr.isClockWise(y)===!0&&(x[g]=y.reverse())}const _=Sr.triangulateShape(p,x);for(let g=0,f=x.length;g<f;g++){const y=x[g];p=p.concat(y)}for(let g=0,f=p.length;g<f;g++){const y=p[g];s.push(y.x,y.y,0),a.push(0,0,1),r.push(y.x,y.y)}for(let g=0,f=_.length;g<f;g++){const y=_[g],v=y[0]+u,M=y[1]+u,E=y[2]+u;i.push(v,M,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Px(t,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const r=t[e.shapes[s]];i.push(r)}return new Pl(i,e.curveSegments)}}function Px(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}class Ot extends jt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+o,Math.PI);let h=0;const d=[],u=new L,m=new L,p=[],x=[],_=[],g=[];for(let f=0;f<=i;f++){const y=[],v=f/i;let M=0;f===0&&r===0?M=.5/t:f===i&&c===Math.PI&&(M=-.5/t);for(let E=0;E<=t;E++){const S=E/t;u.x=-e*Math.cos(s+S*a)*Math.sin(r+v*o),u.y=e*Math.cos(r+v*o),u.z=e*Math.sin(s+S*a)*Math.sin(r+v*o),x.push(u.x,u.y,u.z),m.copy(u).normalize(),_.push(m.x,m.y,m.z),g.push(S+M,1-v),y.push(h++)}d.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){const v=d[f][y+1],M=d[f][y],E=d[f+1][y],S=d[f+1][y+1];(f!==0||r>0)&&p.push(v,M,S),(f!==i-1||c<Math.PI)&&p.push(M,E,S)}this.setIndex(p),this.setAttribute("position",new St(x,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Cs extends jt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],h=[],d=new L,u=new L,m=new L;for(let p=0;p<=i;p++)for(let x=0;x<=s;x++){const _=x/s*a,g=p/i*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(_),u.y=(e+t*Math.cos(g))*Math.sin(_),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),m.subVectors(u,d).normalize(),c.push(m.x,m.y,m.z),h.push(x/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let x=1;x<=s;x++){const _=(s+1)*p+x-1,g=(s+1)*(p-1)+x-1,f=(s+1)*(p-1)+x,y=(s+1)*p+x;r.push(_,g,y),r.push(g,f,y)}this.setIndex(r),this.setAttribute("position",new St(o,3)),this.setAttribute("normal",new St(c,3)),this.setAttribute("uv",new St(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Lx extends Tn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class W extends Ls{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ed,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dx extends Ls{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ed,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wi,this.combine=Wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ix extends Ls{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Kp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Fx extends Ls{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ud extends zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ux extends ud{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const pc=new bt,bu=new L,wu=new L;class lf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=Wi,this.map=null,this.mapPass=null,this.matrix=new bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rd,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new Kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;bu.setFromMatrixPosition(e.matrixWorld),t.position.copy(bu),wu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wu),t.updateMatrixWorld(),pc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(pc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(pc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Su=new bt,fr=new L,mc=new L;class zx extends lf{constructor(){super(new Zn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ue(4,2),this._viewportCount=6,this._viewports=[new Kt(2,1,1,1),new Kt(0,1,1,1),new Kt(3,1,1,1),new Kt(1,1,1,1),new Kt(3,0,1,1),new Kt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),fr.setFromMatrixPosition(e.matrixWorld),i.position.copy(fr),mc.copy(i.position),mc.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(mc),i.updateMatrixWorld(),s.makeTranslation(-fr.x,-fr.y,-fr.z),Su.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Su,i.coordinateSystem,i.reversedDepth)}}class fd extends ud{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new zx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class pd extends q0{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Nx extends lf{constructor(){super(new pd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xc extends ud{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new Nx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class kx extends Zn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class cf{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Tu=new bt;class Ox{constructor(e,t,i=0,s=1/0){this.ray=new id(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new sd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ln("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Tu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Tu),this}intersectObject(e,t=!0,i=[]){return Sh(e,this,i,t),i.sort(Eu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)Sh(e[s],this,i,t);return i.sort(Eu),i}}function Eu(n,e){return n.distance-e.distance}function Sh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Sh(a[r],e,t,!0)}}function Au(n,e,t,i){const s=Bx(i);switch(t){case N0:return n*e;case Zh:return n*e/s.components*s.byteLength;case Kh:return n*e/s.components*s.byteLength;case Jh:return n*e*2/s.components*s.byteLength;case jh:return n*e*2/s.components*s.byteLength;case k0:return n*e*3/s.components*s.byteLength;case _i:return n*e*4/s.components*s.byteLength;case Qh:return n*e*4/s.components*s.byteLength;case Ko:case Jo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case jo:case Qo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yc:case Zc:return Math.max(n,16)*Math.max(e,8)/4;case qc:case $c:return Math.max(n,8)*Math.max(e,8)/2;case Kc:case Jc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case jc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Qc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case eh:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case th:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case nh:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ih:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case sh:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ah:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case rh:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case oh:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case lh:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ch:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case hh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case dh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case uh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case fh:case ph:case mh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case xh:case gh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case vh:case Mh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Bx(n){switch(n){case Wi:case I0:return{byteLength:1,components:1};case Dr:case F0:case ki:return{byteLength:2,components:1};case Yh:case $h:return{byteLength:2,components:4};case ea:case qh:case Fi:return{byteLength:4,components:1};case U0:case z0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hh}}));typeof window<"u"&&(window.__THREE__?vt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hh);function hf(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Vx(n){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,u=h.byteLength,m=n.createBuffer();n.bindBuffer(c,m),n.bufferData(c,h,d),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=n.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){const d=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,d);else{u.sort((p,x)=>p.start-x.start);let m=0;for(let p=1;p<u.length;p++){const x=u[m],_=u[p];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++m,u[m]=_)}u.length=m+1;for(let p=0,x=u.length;p<x;p++){const _=u[p];n.bufferSubData(h,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:a,update:r}}var Gx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hx=`#ifdef USE_ALPHAHASH
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
#endif`,Wx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$x=`#ifdef USE_AOMAP
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
#endif`,Zx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kx=`#ifdef USE_BATCHING
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
#endif`,Jx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,tg=`#ifdef USE_IRIDESCENCE
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
#endif`,ng=`#ifdef USE_BUMPMAP
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
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,sg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,rg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,og=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,dg=`#define PI 3.141592653589793
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
} // validated`,ug=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,fg=`vec3 transformedNormal = objectNormal;
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
#endif`,pg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_g=`#ifdef USE_ENVMAP
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
#endif`,yg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,bg=`#ifdef USE_ENVMAP
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
#endif`,wg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sg=`#ifdef USE_ENVMAP
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
#endif`,Tg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Eg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ag=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rg=`#ifdef USE_GRADIENTMAP
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
}`,Pg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ig=`uniform bool receiveShadow;
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
#endif`,Fg=`#ifdef USE_ENVMAP
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
#endif`,Ug=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Og=`PhysicalMaterial material;
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
#endif`,Bg=`uniform sampler2D dfgLUT;
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
}`,Vg=`
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
#endif`,Gg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Hg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$g=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jg=`#if defined( USE_POINTS_UV )
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
#endif`,jg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,e1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,t1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,n1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,i1=`#ifdef USE_MORPHTARGETS
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
#endif`,s1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,a1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,r1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,o1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,l1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,c1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,h1=`#ifdef USE_NORMALMAP
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
#endif`,d1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,u1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,f1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,p1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,m1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,x1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,g1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,v1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,M1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,y1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,b1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,w1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,S1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,T1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,E1=`float getShadowMask() {
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
}`,A1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,C1=`#ifdef USE_SKINNING
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
#endif`,R1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,P1=`#ifdef USE_SKINNING
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
#endif`,L1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,D1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,I1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,F1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,U1=`#ifdef USE_TRANSMISSION
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
#endif`,z1=`#ifdef USE_TRANSMISSION
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
#endif`,N1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,k1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,O1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,B1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const V1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,G1=`uniform sampler2D t2D;
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
}`,H1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,W1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,X1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,q1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Y1=`#include <common>
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
}`,$1=`#if DEPTH_PACKING == 3200
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
}`,Z1=`#define DISTANCE
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
}`,K1=`#define DISTANCE
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
}`,J1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,j1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q1=`uniform float scale;
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
}`,e2=`uniform vec3 diffuse;
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
}`,t2=`#include <common>
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
}`,n2=`uniform vec3 diffuse;
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
}`,i2=`#define LAMBERT
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
}`,s2=`#define LAMBERT
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
}`,a2=`#define MATCAP
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
}`,r2=`#define MATCAP
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
}`,o2=`#define NORMAL
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
}`,l2=`#define NORMAL
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
}`,c2=`#define PHONG
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
}`,h2=`#define PHONG
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
}`,d2=`#define STANDARD
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
}`,u2=`#define STANDARD
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
}`,f2=`#define TOON
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
}`,p2=`#define TOON
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
}`,m2=`uniform float size;
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
}`,x2=`uniform vec3 diffuse;
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
}`,g2=`#include <common>
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
}`,v2=`uniform vec3 color;
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
}`,M2=`uniform float rotation;
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
}`,_2=`uniform vec3 diffuse;
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
}`,Lt={alphahash_fragment:Gx,alphahash_pars_fragment:Hx,alphamap_fragment:Wx,alphamap_pars_fragment:Xx,alphatest_fragment:qx,alphatest_pars_fragment:Yx,aomap_fragment:$x,aomap_pars_fragment:Zx,batching_pars_vertex:Kx,batching_vertex:Jx,begin_vertex:jx,beginnormal_vertex:Qx,bsdfs:eg,iridescence_fragment:tg,bumpmap_pars_fragment:ng,clipping_planes_fragment:ig,clipping_planes_pars_fragment:sg,clipping_planes_pars_vertex:ag,clipping_planes_vertex:rg,color_fragment:og,color_pars_fragment:lg,color_pars_vertex:cg,color_vertex:hg,common:dg,cube_uv_reflection_fragment:ug,defaultnormal_vertex:fg,displacementmap_pars_vertex:pg,displacementmap_vertex:mg,emissivemap_fragment:xg,emissivemap_pars_fragment:gg,colorspace_fragment:vg,colorspace_pars_fragment:Mg,envmap_fragment:_g,envmap_common_pars_fragment:yg,envmap_pars_fragment:bg,envmap_pars_vertex:wg,envmap_physical_pars_fragment:Fg,envmap_vertex:Sg,fog_vertex:Tg,fog_pars_vertex:Eg,fog_fragment:Ag,fog_pars_fragment:Cg,gradientmap_pars_fragment:Rg,lightmap_pars_fragment:Pg,lights_lambert_fragment:Lg,lights_lambert_pars_fragment:Dg,lights_pars_begin:Ig,lights_toon_fragment:Ug,lights_toon_pars_fragment:zg,lights_phong_fragment:Ng,lights_phong_pars_fragment:kg,lights_physical_fragment:Og,lights_physical_pars_fragment:Bg,lights_fragment_begin:Vg,lights_fragment_maps:Gg,lights_fragment_end:Hg,logdepthbuf_fragment:Wg,logdepthbuf_pars_fragment:Xg,logdepthbuf_pars_vertex:qg,logdepthbuf_vertex:Yg,map_fragment:$g,map_pars_fragment:Zg,map_particle_fragment:Kg,map_particle_pars_fragment:Jg,metalnessmap_fragment:jg,metalnessmap_pars_fragment:Qg,morphinstance_vertex:e1,morphcolor_vertex:t1,morphnormal_vertex:n1,morphtarget_pars_vertex:i1,morphtarget_vertex:s1,normal_fragment_begin:a1,normal_fragment_maps:r1,normal_pars_fragment:o1,normal_pars_vertex:l1,normal_vertex:c1,normalmap_pars_fragment:h1,clearcoat_normal_fragment_begin:d1,clearcoat_normal_fragment_maps:u1,clearcoat_pars_fragment:f1,iridescence_pars_fragment:p1,opaque_fragment:m1,packing:x1,premultiplied_alpha_fragment:g1,project_vertex:v1,dithering_fragment:M1,dithering_pars_fragment:_1,roughnessmap_fragment:y1,roughnessmap_pars_fragment:b1,shadowmap_pars_fragment:w1,shadowmap_pars_vertex:S1,shadowmap_vertex:T1,shadowmask_pars_fragment:E1,skinbase_vertex:A1,skinning_pars_vertex:C1,skinning_vertex:R1,skinnormal_vertex:P1,specularmap_fragment:L1,specularmap_pars_fragment:D1,tonemapping_fragment:I1,tonemapping_pars_fragment:F1,transmission_fragment:U1,transmission_pars_fragment:z1,uv_pars_fragment:N1,uv_pars_vertex:k1,uv_vertex:O1,worldpos_vertex:B1,background_vert:V1,background_frag:G1,backgroundCube_vert:H1,backgroundCube_frag:W1,cube_vert:X1,cube_frag:q1,depth_vert:Y1,depth_frag:$1,distanceRGBA_vert:Z1,distanceRGBA_frag:K1,equirect_vert:J1,equirect_frag:j1,linedashed_vert:Q1,linedashed_frag:e2,meshbasic_vert:t2,meshbasic_frag:n2,meshlambert_vert:i2,meshlambert_frag:s2,meshmatcap_vert:a2,meshmatcap_frag:r2,meshnormal_vert:o2,meshnormal_frag:l2,meshphong_vert:c2,meshphong_frag:h2,meshphysical_vert:d2,meshphysical_frag:u2,meshtoon_vert:f2,meshtoon_frag:p2,points_vert:m2,points_frag:x2,shadow_vert:g2,shadow_frag:v2,sprite_vert:M2,sprite_frag:_2},He={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Rt},alphaMap:{value:null},alphaMapTransform:{value:new Rt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Rt}},envmap:{envMap:{value:null},envMapRotation:{value:new Rt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Rt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Rt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Rt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Rt},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Rt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Rt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Rt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Rt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Rt},alphaTest:{value:0},uvTransform:{value:new Rt}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Rt},alphaMap:{value:null},alphaMapTransform:{value:new Rt},alphaTest:{value:0}}},Pi={basic:{uniforms:Gn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.fog]),vertexShader:Lt.meshbasic_vert,fragmentShader:Lt.meshbasic_frag},lambert:{uniforms:Gn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:Lt.meshlambert_vert,fragmentShader:Lt.meshlambert_frag},phong:{uniforms:Gn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:Lt.meshphong_vert,fragmentShader:Lt.meshphong_frag},standard:{uniforms:Gn([He.common,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.roughnessmap,He.metalnessmap,He.fog,He.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag},toon:{uniforms:Gn([He.common,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.gradientmap,He.fog,He.lights,{emissive:{value:new rt(0)}}]),vertexShader:Lt.meshtoon_vert,fragmentShader:Lt.meshtoon_frag},matcap:{uniforms:Gn([He.common,He.bumpmap,He.normalmap,He.displacementmap,He.fog,{matcap:{value:null}}]),vertexShader:Lt.meshmatcap_vert,fragmentShader:Lt.meshmatcap_frag},points:{uniforms:Gn([He.points,He.fog]),vertexShader:Lt.points_vert,fragmentShader:Lt.points_frag},dashed:{uniforms:Gn([He.common,He.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Lt.linedashed_vert,fragmentShader:Lt.linedashed_frag},depth:{uniforms:Gn([He.common,He.displacementmap]),vertexShader:Lt.depth_vert,fragmentShader:Lt.depth_frag},normal:{uniforms:Gn([He.common,He.bumpmap,He.normalmap,He.displacementmap,{opacity:{value:1}}]),vertexShader:Lt.meshnormal_vert,fragmentShader:Lt.meshnormal_frag},sprite:{uniforms:Gn([He.sprite,He.fog]),vertexShader:Lt.sprite_vert,fragmentShader:Lt.sprite_frag},background:{uniforms:{uvTransform:{value:new Rt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Lt.background_vert,fragmentShader:Lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Rt}},vertexShader:Lt.backgroundCube_vert,fragmentShader:Lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Lt.cube_vert,fragmentShader:Lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Lt.equirect_vert,fragmentShader:Lt.equirect_frag},distanceRGBA:{uniforms:Gn([He.common,He.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Lt.distanceRGBA_vert,fragmentShader:Lt.distanceRGBA_frag},shadow:{uniforms:Gn([He.lights,He.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:Lt.shadow_vert,fragmentShader:Lt.shadow_frag}};Pi.physical={uniforms:Gn([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Rt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Rt},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Rt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Rt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Rt},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Rt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Rt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Rt},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Rt},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Rt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Rt},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Rt}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag};const Uo={r:0,b:0,g:0},Ns=new wi,y2=new bt;function b2(n,e,t,i,s,a,r){const o=new rt(0);let c=a===!0?0:1,h,d,u=null,m=0,p=null;function x(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?t:e).get(M)),M}function _(v){let M=!1;const E=x(v);E===null?f(o,c):E&&E.isColor&&(f(E,1),M=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,M){const E=x(M);E&&(E.isCubeTexture||E.mapping===El)?(d===void 0&&(d=new z(new le(1,1,1),new Tn({name:"BackgroundCubeMaterial",uniforms:Wa(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Ns.copy(M.backgroundRotation),Ns.x*=-1,Ns.y*=-1,Ns.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ns.y*=-1,Ns.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(y2.makeRotationFromEuler(Ns)),d.material.toneMapped=kt.getTransfer(E.colorSpace)!==$t,(u!==E||m!==E.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,m=E.version,p=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new z(new Ut(2,2),new Tn({name:"BackgroundMaterial",uniforms:Wa(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:As,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.toneMapped=kt.getTransfer(E.colorSpace)!==$t,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||m!==E.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=E,m=E.version,p=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function f(v,M){v.getRGB(Uo,X0(n)),i.buffers.color.setClear(Uo.r,Uo.g,Uo.b,M,r)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,M=1){o.set(v),c=M,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,f(o,c)},render:_,addToRenderList:g,dispose:y}}function w2(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=m(null);let a=s,r=!1;function o(b,P,D,O,Z){let te=!1;const q=u(O,D,P);a!==q&&(a=q,h(a.object)),te=p(b,O,D,Z),te&&x(b,O,D,Z),Z!==null&&e.update(Z,n.ELEMENT_ARRAY_BUFFER),(te||r)&&(r=!1,M(b,P,D,O),Z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,P,D){const O=D.wireframe===!0;let Z=i[b.id];Z===void 0&&(Z={},i[b.id]=Z);let te=Z[P.id];te===void 0&&(te={},Z[P.id]=te);let q=te[O];return q===void 0&&(q=m(c()),te[O]=q),q}function m(b){const P=[],D=[],O=[];for(let Z=0;Z<t;Z++)P[Z]=0,D[Z]=0,O[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:D,attributeDivisors:O,object:b,attributes:{},index:null}}function p(b,P,D,O){const Z=a.attributes,te=P.attributes;let q=0;const J=D.getAttributes();for(const ne in J)if(J[ne].location>=0){const ve=Z[ne];let $e=te[ne];if($e===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&($e=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&($e=b.instanceColor)),ve===void 0||ve.attribute!==$e||$e&&ve.data!==$e.data)return!0;q++}return a.attributesNum!==q||a.index!==O}function x(b,P,D,O){const Z={},te=P.attributes;let q=0;const J=D.getAttributes();for(const ne in J)if(J[ne].location>=0){let ve=te[ne];ve===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor));const $e={};$e.attribute=ve,ve&&ve.data&&($e.data=ve.data),Z[ne]=$e,q++}a.attributes=Z,a.attributesNum=q,a.index=O}function _(){const b=a.newAttributes;for(let P=0,D=b.length;P<D;P++)b[P]=0}function g(b){f(b,0)}function f(b,P){const D=a.newAttributes,O=a.enabledAttributes,Z=a.attributeDivisors;D[b]=1,O[b]===0&&(n.enableVertexAttribArray(b),O[b]=1),Z[b]!==P&&(n.vertexAttribDivisor(b,P),Z[b]=P)}function y(){const b=a.newAttributes,P=a.enabledAttributes;for(let D=0,O=P.length;D<O;D++)P[D]!==b[D]&&(n.disableVertexAttribArray(D),P[D]=0)}function v(b,P,D,O,Z,te,q){q===!0?n.vertexAttribIPointer(b,P,D,Z,te):n.vertexAttribPointer(b,P,D,O,Z,te)}function M(b,P,D,O){_();const Z=O.attributes,te=D.getAttributes(),q=P.defaultAttributeValues;for(const J in te){const ne=te[J];if(ne.location>=0){let pe=Z[J];if(pe===void 0&&(J==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),J==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor)),pe!==void 0){const ve=pe.normalized,$e=pe.itemSize,I=e.get(pe);if(I===void 0)continue;const Ce=I.buffer,be=I.type,Re=I.bytesPerElement,$=be===n.INT||be===n.UNSIGNED_INT||pe.gpuType===qh;if(pe.isInterleavedBufferAttribute){const K=pe.data,we=K.stride,Pe=pe.offset;if(K.isInstancedInterleavedBuffer){for(let Oe=0;Oe<ne.locationSize;Oe++)f(ne.location+Oe,K.meshPerAttribute);b.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Oe=0;Oe<ne.locationSize;Oe++)g(ne.location+Oe);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let Oe=0;Oe<ne.locationSize;Oe++)v(ne.location+Oe,$e/ne.locationSize,be,ve,we*Re,(Pe+$e/ne.locationSize*Oe)*Re,$)}else{if(pe.isInstancedBufferAttribute){for(let K=0;K<ne.locationSize;K++)f(ne.location+K,pe.meshPerAttribute);b.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let K=0;K<ne.locationSize;K++)g(ne.location+K);n.bindBuffer(n.ARRAY_BUFFER,Ce);for(let K=0;K<ne.locationSize;K++)v(ne.location+K,$e/ne.locationSize,be,ve,$e*Re,$e/ne.locationSize*K*Re,$)}}else if(q!==void 0){const ve=q[J];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ne.location,ve);break;case 3:n.vertexAttrib3fv(ne.location,ve);break;case 4:n.vertexAttrib4fv(ne.location,ve);break;default:n.vertexAttrib1fv(ne.location,ve)}}}}y()}function E(){A();for(const b in i){const P=i[b];for(const D in P){const O=P[D];for(const Z in O)d(O[Z].object),delete O[Z];delete P[D]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const D in P){const O=P[D];for(const Z in O)d(O[Z].object),delete O[Z];delete P[D]}delete i[b.id]}function C(b){for(const P in i){const D=i[P];if(D[b.id]===void 0)continue;const O=D[b.id];for(const Z in O)d(O[Z].object),delete O[Z];delete D[b.id]}}function A(){w(),r=!0,a!==s&&(a=s,h(a.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function S2(n,e,t){let i;function s(h){i=h}function a(h,d){n.drawArrays(i,h,d),t.update(d,i,1)}function r(h,d,u){u!==0&&(n.drawArraysInstanced(i,h,d,u),t.update(d,i,u))}function o(h,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,d,0,u);let p=0;for(let x=0;x<u;x++)p+=d[x];t.update(p,i,1)}function c(h,d,u,m){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<h.length;x++)r(h[x],d[x],m[x]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,d,0,m,0,u);let x=0;for(let _=0;_<u;_++)x+=d[_]*m[_];t.update(x,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function T2(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==_i&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const A=C===ki&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Wi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Fi&&!A)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(vt("WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:m,maxTextures:p,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:E,maxSamples:S}}function E2(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Bs,o=new Rt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,m){const p=u.length!==0||m||i!==0||s;return s=m,i=u.length,p},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,m){t=d(u,m,0)},this.setState=function(u,m,p){const x=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,f=n.get(u);if(!s||x===null||x.length===0||a&&!g)a?d(null):h();else{const y=a?0:i,v=y*4;let M=f.clippingState||null;c.value=M,M=d(x,m,v,p);for(let E=0;E!==v;++E)M[E]=t[E];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,m,p,x){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=c.value,x!==!0||g===null){const f=p+_*4,y=m.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,M=p;v!==_;++v,M+=4)r.copy(u[v]).applyMatrix4(y,o),r.normal.toArray(g,M),g[M+3]=r.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function A2(n){let e=new WeakMap;function t(r,o){return o===Hc?r.mapping=Va:o===Wc&&(r.mapping=Ga),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Hc||o===Wc)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const h=new Xm(c.height);return h.fromEquirectangularTexture(n,r),e.set(r,h),r.addEventListener("dispose",s),t(h.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const ys=4,Cu=[.125,.215,.35,.446,.526,.582],Ws=20,C2=512,pr=new pd,Ru=new rt;let gc=null,vc=0,Mc=0,_c=!1;const R2=new L;class Th{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=R2}=a;gc=this._renderer.getRenderTarget(),vc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),_c=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Du(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(gc,vc,Mc),this._renderer.xr.enabled=_c,e.scissorTest=!1,Ta(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Va||e.mapping===Ga?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),gc=this._renderer.getRenderTarget(),vc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),_c=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:ki,format:_i,colorSpace:Ha,depthBuffer:!1},s=Pu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pu(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=P2(a)),this._blurMaterial=D2(a,e,t)}return s}_compileMaterial(e){const t=new z(new jt,e);this._renderer.compile(t,pr)}_sceneToCubeUV(e,t,i,s,a){const c=new Zn(90,1,t,i),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,m=u.autoClear,p=u.toneMapping;u.getClearColor(Ru),u.toneMapping=Ss,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new z(new le,new Et({name:"PMREM.Background",side:Fn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let f=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,f=!0):(g.color.copy(Ru),f=!0);for(let v=0;v<6;v++){const M=v%3;M===0?(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+d[v],a.y,a.z)):M===1?(c.up.set(0,0,h[v]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+d[v],a.z)):(c.up.set(0,h[v],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+d[v]));const E=this._cubeSize;Ta(s,M*E,v>2?E:0,E,E),u.setRenderTarget(s),f&&u.render(_,c),u.render(e,c)}u.toneMapping=p,u.autoClear=m,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Va||e.mapping===Ga;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Du()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lu());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;Ta(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,pr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget;if(this._ggxMaterial===null){const y=3*Math.max(this._cubeSize,16),v=4*this._cubeSize;this._ggxMaterial=L2(this._lodMax,y,v)}const r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const c=r.uniforms,h=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-d*d),m=.05+h*.95,p=u*m,{_lodMax:x}=this,_=this._sizeLods[i],g=3*_*(i>x-ys?i-x+ys:0),f=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=x-t,Ta(a,g,f,3*_,2*_),s.setRenderTarget(a),s.render(o,pr),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-i,Ta(e,g,f,3*_,2*_),s.setRenderTarget(e),s.render(o,pr)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const c=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&ln("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=h;const m=h.uniforms,p=this._sizeLods[i]-1,x=isFinite(a)?Math.PI/(2*p):2*Math.PI/(2*Ws-1),_=a/x,g=isFinite(a)?1+Math.floor(d*_):Ws;g>Ws&&vt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ws}`);const f=[];let y=0;for(let C=0;C<Ws;++C){const A=C/_,w=Math.exp(-A*A/2);f.push(w),C===0?y+=w:C<g&&(y+=2*w)}for(let C=0;C<f.length;C++)f[C]=f[C]/y;m.envMap.value=e.texture,m.samples.value=g,m.weights.value=f,m.latitudinal.value=r==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:v}=this;m.dTheta.value=x,m.mipInt.value=v-i;const M=this._sizeLods[s],E=3*M*(s>v-ys?s-v+ys:0),S=4*(this._cubeSize-M);Ta(t,E,S,3*M,2*M),c.setRenderTarget(t),c.render(u,pr)}}function P2(n){const e=[],t=[],i=[];let s=n;const a=n-ys+1+Cu.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-ys?c=Cu[r-n+ys-1]:r===0&&(c=0),t.push(c);const h=1/(o-2),d=-h,u=1+h,m=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,x=6,_=3,g=2,f=1,y=new Float32Array(_*x*p),v=new Float32Array(g*x*p),M=new Float32Array(f*x*p);for(let S=0;S<p;S++){const C=S%3*2/3-1,A=S>2?0:-1,w=[C,A,0,C+2/3,A,0,C+2/3,A+1,0,C,A,0,C+2/3,A+1,0,C,A+1,0];y.set(w,_*x*S),v.set(m,g*x*S);const b=[S,S,S,S,S,S];M.set(b,f*x*S)}const E=new jt;E.setAttribute("position",new jn(y,_)),E.setAttribute("uv",new jn(v,g)),E.setAttribute("faceIndex",new jn(M,f)),i.push(new z(E,null)),s>ys&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Pu(n,e,t){const i=new bi(n,e,t);return i.texture.mapping=El,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ta(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function L2(n,e,t){return new Tn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:C2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function D2(n,e,t){const i=new Float32Array(Ws),s=new L(0,1,0);return new Tn({name:"SphericalGaussianBlur",defines:{n:Ws,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Lu(){return new Tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Du(){return new Tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Ll(){return`

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
	`}function I2(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===Hc||c===Wc,d=c===Va||c===Ga;if(h||d){let u=e.get(o);const m=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new Th(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return h&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new Th(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function a(o){const c=o.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function F2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&zr("WebGLRenderer: "+i+" extension not supported."),s}}}function U2(n,e,t,i){const s={},a=new WeakMap;function r(u){const m=u.target;m.index!==null&&e.remove(m.index);for(const x in m.attributes)e.remove(m.attributes[x]);m.removeEventListener("dispose",r),delete s[m.id];const p=a.get(m);p&&(e.remove(p),a.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(u,m){return s[m.id]===!0||(m.addEventListener("dispose",r),s[m.id]=!0,t.memory.geometries++),m}function c(u){const m=u.attributes;for(const p in m)e.update(m[p],n.ARRAY_BUFFER)}function h(u){const m=[],p=u.index,x=u.attributes.position;let _=0;if(p!==null){const y=p.array;_=p.version;for(let v=0,M=y.length;v<M;v+=3){const E=y[v+0],S=y[v+1],C=y[v+2];m.push(E,S,S,C,C,E)}}else if(x!==void 0){const y=x.array;_=x.version;for(let v=0,M=y.length/3-1;v<M;v+=3){const E=v+0,S=v+1,C=v+2;m.push(E,S,S,C,C,E)}}else return;const g=new(B0(m)?W0:H0)(m,1);g.version=_;const f=a.get(u);f&&e.remove(f),a.set(u,g)}function d(u){const m=a.get(u);if(m){const p=u.index;p!==null&&m.version<p.version&&h(u)}else h(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function z2(n,e,t){let i;function s(m){i=m}let a,r;function o(m){a=m.type,r=m.bytesPerElement}function c(m,p){n.drawElements(i,p,a,m*r),t.update(p,i,1)}function h(m,p,x){x!==0&&(n.drawElementsInstanced(i,p,a,m*r,x),t.update(p,i,x))}function d(m,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,a,m,0,x);let g=0;for(let f=0;f<x;f++)g+=p[f];t.update(g,i,1)}function u(m,p,x,_){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<m.length;f++)h(m[f]/r,p[f],_[f]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,a,m,0,_,0,x);let f=0;for(let y=0;y<x;y++)f+=p[y]*_[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function N2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:ln("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function k2(n,e,t){const i=new WeakMap,s=new Kt;function a(r,o,c){const h=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let m=i.get(o);if(m===void 0||m.count!==u){let b=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var p=b;m!==void 0&&m.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;x===!0&&(M=1),_===!0&&(M=2),g===!0&&(M=3);let E=o.attributes.position.count*M,S=1;E>e.maxTextureSize&&(S=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const C=new Float32Array(E*S*4*u),A=new V0(C,E,S,u);A.type=Fi,A.needsUpdate=!0;const w=M*4;for(let P=0;P<u;P++){const D=f[P],O=y[P],Z=v[P],te=E*S*4*P;for(let q=0;q<D.count;q++){const J=q*w;x===!0&&(s.fromBufferAttribute(D,q),C[te+J+0]=s.x,C[te+J+1]=s.y,C[te+J+2]=s.z,C[te+J+3]=0),_===!0&&(s.fromBufferAttribute(O,q),C[te+J+4]=s.x,C[te+J+5]=s.y,C[te+J+6]=s.z,C[te+J+7]=0),g===!0&&(s.fromBufferAttribute(Z,q),C[te+J+8]=s.x,C[te+J+9]=s.y,C[te+J+10]=s.z,C[te+J+11]=Z.itemSize===4?s.w:1)}}m={count:u,texture:A,size:new Ue(E,S)},i.set(o,m),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let x=0;for(let g=0;g<h.length;g++)x+=h[g];const _=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:a}}function O2(n,e,t,i){let s=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return u}function r(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:r}}const df=new Un,Iu=new J0(1,1),uf=new V0,ff=new Rm,pf=new Y0,Fu=[],Uu=[],zu=new Float32Array(16),Nu=new Float32Array(9),ku=new Float32Array(4);function Ka(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Fu[s];if(a===void 0&&(a=new Float32Array(s),Fu[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function yn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function bn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Dl(n,e){let t=Uu[e];t===void 0&&(t=new Int32Array(e),Uu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function B2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function V2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2fv(this.addr,e),bn(t,e)}}function G2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;n.uniform3fv(this.addr,e),bn(t,e)}}function H2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4fv(this.addr,e),bn(t,e)}}function W2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;ku.set(i),n.uniformMatrix2fv(this.addr,!1,ku),bn(t,i)}}function X2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;Nu.set(i),n.uniformMatrix3fv(this.addr,!1,Nu),bn(t,i)}}function q2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),bn(t,e)}else{if(yn(t,i))return;zu.set(i),n.uniformMatrix4fv(this.addr,!1,zu),bn(t,i)}}function Y2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function $2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2iv(this.addr,e),bn(t,e)}}function Z2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3iv(this.addr,e),bn(t,e)}}function K2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4iv(this.addr,e),bn(t,e)}}function J2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function j2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;n.uniform2uiv(this.addr,e),bn(t,e)}}function Q2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;n.uniform3uiv(this.addr,e),bn(t,e)}}function ev(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;n.uniform4uiv(this.addr,e),bn(t,e)}}function tv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Iu.compareFunction=O0,a=Iu):a=df,t.setTexture2D(e||a,s)}function nv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||ff,s)}function iv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||pf,s)}function sv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||uf,s)}function av(n){switch(n){case 5126:return B2;case 35664:return V2;case 35665:return G2;case 35666:return H2;case 35674:return W2;case 35675:return X2;case 35676:return q2;case 5124:case 35670:return Y2;case 35667:case 35671:return $2;case 35668:case 35672:return Z2;case 35669:case 35673:return K2;case 5125:return J2;case 36294:return j2;case 36295:return Q2;case 36296:return ev;case 35678:case 36198:case 36298:case 36306:case 35682:return tv;case 35679:case 36299:case 36307:return nv;case 35680:case 36300:case 36308:case 36293:return iv;case 36289:case 36303:case 36311:case 36292:return sv}}function rv(n,e){n.uniform1fv(this.addr,e)}function ov(n,e){const t=Ka(e,this.size,2);n.uniform2fv(this.addr,t)}function lv(n,e){const t=Ka(e,this.size,3);n.uniform3fv(this.addr,t)}function cv(n,e){const t=Ka(e,this.size,4);n.uniform4fv(this.addr,t)}function hv(n,e){const t=Ka(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function dv(n,e){const t=Ka(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function uv(n,e){const t=Ka(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function fv(n,e){n.uniform1iv(this.addr,e)}function pv(n,e){n.uniform2iv(this.addr,e)}function mv(n,e){n.uniform3iv(this.addr,e)}function xv(n,e){n.uniform4iv(this.addr,e)}function gv(n,e){n.uniform1uiv(this.addr,e)}function vv(n,e){n.uniform2uiv(this.addr,e)}function Mv(n,e){n.uniform3uiv(this.addr,e)}function _v(n,e){n.uniform4uiv(this.addr,e)}function yv(n,e,t){const i=this.cache,s=e.length,a=Dl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||df,a[r])}function bv(n,e,t){const i=this.cache,s=e.length,a=Dl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||ff,a[r])}function wv(n,e,t){const i=this.cache,s=e.length,a=Dl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||pf,a[r])}function Sv(n,e,t){const i=this.cache,s=e.length,a=Dl(t,s);yn(i,a)||(n.uniform1iv(this.addr,a),bn(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||uf,a[r])}function Tv(n){switch(n){case 5126:return rv;case 35664:return ov;case 35665:return lv;case 35666:return cv;case 35674:return hv;case 35675:return dv;case 35676:return uv;case 5124:case 35670:return fv;case 35667:case 35671:return pv;case 35668:case 35672:return mv;case 35669:case 35673:return xv;case 5125:return gv;case 36294:return vv;case 36295:return Mv;case 36296:return _v;case 35678:case 36198:case 36298:case 36306:case 35682:return yv;case 35679:case 36299:case 36307:return bv;case 35680:case 36300:case 36308:case 36293:return wv;case 36289:case 36303:case 36311:case 36292:return Sv}}class Ev{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=av(t.type)}}class Av{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Tv(t.type)}}class Cv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const yc=/(\w+)(\])?(\[|\.)?/g;function Ou(n,e){n.seq.push(e),n.map[e.id]=e}function Rv(n,e,t){const i=n.name,s=i.length;for(yc.lastIndex=0;;){const a=yc.exec(i),r=yc.lastIndex;let o=a[1];const c=a[2]==="]",h=a[3];if(c&&(o=o|0),h===void 0||h==="["&&r+2===s){Ou(t,h===void 0?new Ev(o,n,e):new Av(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Cv(o),Ou(t,u)),t=u}}}class el{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);Rv(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Bu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Pv=37297;let Lv=0;function Dv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Vu=new Rt;function Iv(n){kt._getMatrix(Vu,kt.workingColorSpace,n);const e=`mat3( ${Vu.elements.map(t=>t.toFixed(4))} )`;switch(kt.getTransfer(n)){case al:return[e,"LinearTransferOETF"];case $t:return[e,"sRGBTransferOETF"];default:return vt("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Gu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Dv(n.getShaderSource(e),o)}else return a}function Fv(n,e){const t=Iv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Uv(n,e){let t;switch(e){case E0:t="Linear";break;case A0:t="Reinhard";break;case C0:t="Cineon";break;case Xh:t="ACESFilmic";break;case P0:t="AgX";break;case L0:t="Neutral";break;case R0:t="Custom";break;default:vt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const zo=new L;function zv(){kt.getLuminanceCoefficients(zo);const n=zo.x.toFixed(4),e=zo.y.toFixed(4),t=zo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function kv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Ov(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function vr(n){return n!==""}function Hu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Bv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Eh(n){return n.replace(Bv,Gv)}const Vv=new Map;function Gv(n,e){let t=Lt[e];if(t===void 0){const i=Vv.get(e);if(i!==void 0)t=Lt[i],vt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Eh(t)}const Hv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xu(n){return n.replace(Hv,Wv)}function Wv(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function qu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function Xv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===S0?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===T0?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===es&&(e="SHADOWMAP_TYPE_VSM"),e}function qv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Va:case Ga:e="ENVMAP_TYPE_CUBE";break;case El:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Yv(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Ga&&(e="ENVMAP_MODE_REFRACTION"),e}function $v(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Wh:e="ENVMAP_BLENDING_MULTIPLY";break;case Yp:e="ENVMAP_BLENDING_MIX";break;case $p:e="ENVMAP_BLENDING_ADD";break}return e}function Zv(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Kv(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=Xv(t),h=qv(t),d=Yv(t),u=$v(t),m=Zv(t),p=Nv(t),x=kv(a),_=s.createProgram();let g,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(vr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(vr).join(`
`),f.length>0&&(f+=`
`)):(g=[qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),f=[qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ss?"#define TONE_MAPPING":"",t.toneMapping!==Ss?Lt.tonemapping_pars_fragment:"",t.toneMapping!==Ss?Uv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Lt.colorspace_pars_fragment,Fv("linearToOutputTexel",t.outputColorSpace),zv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vr).join(`
`)),r=Eh(r),r=Hu(r,t),r=Wu(r,t),o=Eh(o),o=Hu(o,t),o=Wu(o,t),r=Xu(r),o=Xu(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Hd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Hd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=y+g+r,M=y+f+o,E=Bu(s,s.VERTEX_SHADER,v),S=Bu(s,s.FRAGMENT_SHADER,M);s.attachShader(_,E),s.attachShader(_,S),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(P){if(n.debug.checkShaderErrors){const D=s.getProgramInfoLog(_)||"",O=s.getShaderInfoLog(E)||"",Z=s.getShaderInfoLog(S)||"",te=D.trim(),q=O.trim(),J=Z.trim();let ne=!0,pe=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ne=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,E,S);else{const ve=Gu(s,E,"vertex"),$e=Gu(s,S,"fragment");ln("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+te+`
`+ve+`
`+$e)}else te!==""?vt("WebGLProgram: Program Info Log:",te):(q===""||J==="")&&(pe=!1);pe&&(P.diagnostics={runnable:ne,programLog:te,vertexShader:{log:q,prefix:g},fragmentShader:{log:J,prefix:f}})}s.deleteShader(E),s.deleteShader(S),A=new el(s,_),w=Ov(s,_)}let A;this.getUniforms=function(){return A===void 0&&C(this),A};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,Pv)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Lv++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=S,this}let Jv=0;class jv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Qv(e),t.set(e,i)),i}}class Qv{constructor(e){this.id=Jv++,this.code=e,this.usedTimes=0}}function eM(n,e,t,i,s,a,r){const o=new sd,c=new jv,h=new Set,d=[],u=s.logarithmicDepthBuffer,m=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return h.add(w),w===0?"uv":`uv${w}`}function g(w,b,P,D,O){const Z=D.fog,te=O.geometry,q=w.isMeshStandardMaterial?D.environment:null,J=(w.isMeshStandardMaterial?t:e).get(w.envMap||q),ne=J&&J.mapping===El?J.image.height:null,pe=x[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&vt("WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const ve=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,$e=ve!==void 0?ve.length:0;let I=0;te.morphAttributes.position!==void 0&&(I=1),te.morphAttributes.normal!==void 0&&(I=2),te.morphAttributes.color!==void 0&&(I=3);let Ce,be,Re,$;if(pe){const Nt=Pi[pe];Ce=Nt.vertexShader,be=Nt.fragmentShader}else Ce=w.vertexShader,be=w.fragmentShader,c.update(w),Re=c.getVertexShaderID(w),$=c.getFragmentShaderID(w);const K=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Pe=O.isInstancedMesh===!0,Oe=O.isBatchedMesh===!0,nt=!!w.map,Ht=!!w.matcap,at=!!J,Bt=!!w.aoMap,B=!!w.lightMap,Tt=!!w.bumpMap,yt=!!w.normalMap,Vt=!!w.displacementMap,Qe=!!w.emissiveMap,qt=!!w.metalnessMap,ot=!!w.roughnessMap,Mt=w.anisotropy>0,F=w.clearcoat>0,R=w.dispersion>0,j=w.iridescence>0,ue=w.sheen>0,ge=w.transmission>0,re=Mt&&!!w.anisotropyMap,et=F&&!!w.clearcoatMap,Fe=F&&!!w.clearcoatNormalMap,it=F&&!!w.clearcoatRoughnessMap,Ye=j&&!!w.iridescenceMap,_e=j&&!!w.iridescenceThicknessMap,Le=ue&&!!w.sheenColorMap,ht=ue&&!!w.sheenRoughnessMap,ct=!!w.specularMap,Xe=!!w.specularColorMap,ut=!!w.specularIntensityMap,H=ge&&!!w.transmissionMap,Ge=ge&&!!w.thicknessMap,ke=!!w.gradientMap,ze=!!w.alphaMap,Te=w.alphaTest>0,me=!!w.alphaHash,Je=!!w.extensions;let ft=Ss;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(ft=n.toneMapping);const Wt={shaderID:pe,shaderType:w.type,shaderName:w.name,vertexShader:Ce,fragmentShader:be,defines:w.defines,customVertexShaderID:Re,customFragmentShaderID:$,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Oe,batchingColor:Oe&&O._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&O.instanceColor!==null,instancingMorph:Pe&&O.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ha,alphaToCoverage:!!w.alphaToCoverage,map:nt,matcap:Ht,envMap:at,envMapMode:at&&J.mapping,envMapCubeUVHeight:ne,aoMap:Bt,lightMap:B,bumpMap:Tt,normalMap:yt,displacementMap:m&&Vt,emissiveMap:Qe,normalMapObjectSpace:yt&&w.normalMapType===jp,normalMapTangentSpace:yt&&w.normalMapType===ed,metalnessMap:qt,roughnessMap:ot,anisotropy:Mt,anisotropyMap:re,clearcoat:F,clearcoatMap:et,clearcoatNormalMap:Fe,clearcoatRoughnessMap:it,dispersion:R,iridescence:j,iridescenceMap:Ye,iridescenceThicknessMap:_e,sheen:ue,sheenColorMap:Le,sheenRoughnessMap:ht,specularMap:ct,specularColorMap:Xe,specularIntensityMap:ut,transmission:ge,transmissionMap:H,thicknessMap:Ge,gradientMap:ke,opaque:w.transparent===!1&&w.blending===Fa&&w.alphaToCoverage===!1,alphaMap:ze,alphaTest:Te,alphaHash:me,combine:w.combine,mapUv:nt&&_(w.map.channel),aoMapUv:Bt&&_(w.aoMap.channel),lightMapUv:B&&_(w.lightMap.channel),bumpMapUv:Tt&&_(w.bumpMap.channel),normalMapUv:yt&&_(w.normalMap.channel),displacementMapUv:Vt&&_(w.displacementMap.channel),emissiveMapUv:Qe&&_(w.emissiveMap.channel),metalnessMapUv:qt&&_(w.metalnessMap.channel),roughnessMapUv:ot&&_(w.roughnessMap.channel),anisotropyMapUv:re&&_(w.anisotropyMap.channel),clearcoatMapUv:et&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Fe&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ye&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:ht&&_(w.sheenRoughnessMap.channel),specularMapUv:ct&&_(w.specularMap.channel),specularColorMapUv:Xe&&_(w.specularColorMap.channel),specularIntensityMapUv:ut&&_(w.specularIntensityMap.channel),transmissionMapUv:H&&_(w.transmissionMap.channel),thicknessMapUv:Ge&&_(w.thicknessMap.channel),alphaMapUv:ze&&_(w.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(yt||Mt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!te.attributes.uv&&(nt||ze),fog:!!Z,useFog:w.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:O.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:$e,morphTextureStride:I,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ft,decodeVideoTexture:nt&&w.map.isVideoTexture===!0&&kt.getTransfer(w.map.colorSpace)===$t,decodeVideoTextureEmissive:Qe&&w.emissiveMap.isVideoTexture===!0&&kt.getTransfer(w.emissiveMap.colorSpace)===$t,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===wt,flipSided:w.side===Fn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Je&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&w.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Wt.vertexUv1s=h.has(1),Wt.vertexUv2s=h.has(2),Wt.vertexUv3s=h.has(3),h.clear(),Wt}function f(w){const b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)b.push(P),b.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(y(b,w),v(b,w),b.push(n.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function y(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function v(w,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),w.push(o.mask)}function M(w){const b=x[w.type];let P;if(b){const D=Pi[b];P=kr.clone(D.uniforms)}else P=w.uniforms;return P}function E(w,b){let P;for(let D=0,O=d.length;D<O;D++){const Z=d[D];if(Z.cacheKey===b){P=Z,++P.usedTimes;break}}return P===void 0&&(P=new Kv(n,b,w,a),d.push(P)),P}function S(w){if(--w.usedTimes===0){const b=d.indexOf(w);d[b]=d[d.length-1],d.pop(),w.destroy()}}function C(w){c.remove(w)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:M,acquireProgram:E,releaseProgram:S,releaseShaderCache:C,programs:d,dispose:A}}function tM(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function nM(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Yu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function $u(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,m,p,x,_,g){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:m,material:p,groupOrder:x,renderOrder:u.renderOrder,z:_,group:g},n[e]=f):(f.id=u.id,f.object=u,f.geometry=m,f.material=p,f.groupOrder=x,f.renderOrder=u.renderOrder,f.z=_,f.group=g),e++,f}function o(u,m,p,x,_,g){const f=r(u,m,p,x,_,g);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function c(u,m,p,x,_,g){const f=r(u,m,p,x,_,g);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,m){t.length>1&&t.sort(u||nM),i.length>1&&i.sort(m||Yu),s.length>1&&s.sort(m||Yu)}function d(){for(let u=e,m=n.length;u<m;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:h}}function iM(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new $u,n.set(i,[r])):s>=a.length?(r=new $u,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function sM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new rt};break;case"SpotLight":t={position:new L,direction:new L,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function aM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let rM=0;function oM(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function lM(n){const e=new sM,t=aM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new L);const s=new L,a=new bt,r=new bt;function o(h){let d=0,u=0,m=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,x=0,_=0,g=0,f=0,y=0,v=0,M=0,E=0,S=0,C=0;h.sort(oM);for(let w=0,b=h.length;w<b;w++){const P=h[w],D=P.color,O=P.intensity,Z=P.distance,te=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=D.r*O,u+=D.g*O,m+=D.b*O;else if(P.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(P.sh.coefficients[q],O);C++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const J=P.shadow,ne=t.get(P);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize=J.mapSize,i.directionalShadow[p]=ne,i.directionalShadowMap[p]=te,i.directionalShadowMatrix[p]=P.shadow.matrix,y++}i.directional[p]=q,p++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(D).multiplyScalar(O),q.distance=Z,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,i.spot[_]=q;const J=P.shadow;if(P.map&&(i.spotLightMap[E]=P.map,E++,J.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=J.matrix,P.castShadow){const ne=t.get(P);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize=J.mapSize,i.spotShadow[_]=ne,i.spotShadowMap[_]=te,M++}_++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(D).multiplyScalar(O),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=q,g++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const J=P.shadow,ne=t.get(P);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize=J.mapSize,ne.shadowCameraNear=J.camera.near,ne.shadowCameraFar=J.camera.far,i.pointShadow[x]=ne,i.pointShadowMap[x]=te,i.pointShadowMatrix[x]=P.shadow.matrix,v++}i.point[x]=q,x++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(O),q.groundColor.copy(P.groundColor).multiplyScalar(O),i.hemi[f]=q,f++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=He.LTC_FLOAT_1,i.rectAreaLTC2=He.LTC_FLOAT_2):(i.rectAreaLTC1=He.LTC_HALF_1,i.rectAreaLTC2=He.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=m;const A=i.hash;(A.directionalLength!==p||A.pointLength!==x||A.spotLength!==_||A.rectAreaLength!==g||A.hemiLength!==f||A.numDirectionalShadows!==y||A.numPointShadows!==v||A.numSpotShadows!==M||A.numSpotMaps!==E||A.numLightProbes!==C)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+E-S,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=C,A.directionalLength=p,A.pointLength=x,A.spotLength=_,A.rectAreaLength=g,A.hemiLength=f,A.numDirectionalShadows=y,A.numPointShadows=v,A.numSpotShadows=M,A.numSpotMaps=E,A.numLightProbes=C,i.version=rM++)}function c(h,d){let u=0,m=0,p=0,x=0,_=0;const g=d.matrixWorldInverse;for(let f=0,y=h.length;f<y;f++){const v=h[f];if(v.isDirectionalLight){const M=i.directional[u];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),u++}else if(v.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),p++}else if(v.isRectAreaLight){const M=i.rectArea[x];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(r),M.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){const M=i.point[m];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),m++}else if(v.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:i}}function Zu(n){const e=new lM(n),t=[],i=[];function s(d){h.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function cM(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new Zu(n),e.set(s,[o])):a>=r.length?(o=new Zu(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const hM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dM=`uniform sampler2D shadow_pass;
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
}`;function uM(n,e,t){let i=new rd;const s=new Ue,a=new Ue,r=new Kt,o=new Ix({depthPacking:Jp}),c=new Fx,h={},d=t.maxTextureSize,u={[As]:Fn,[Fn]:As,[wt]:wt},m=new Tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:hM,fragmentShader:dM}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const x=new jt;x.setAttribute("position",new jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new z(x,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=S0;let f=this.type;this.render=function(S,C,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const w=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),D=n.state;D.setBlending(Ni),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const O=f!==es&&this.type===es,Z=f===es&&this.type!==es;for(let te=0,q=S.length;te<q;te++){const J=S[te],ne=J.shadow;if(ne===void 0){vt("WebGLShadowMap:",J,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;s.copy(ne.mapSize);const pe=ne.getFrameExtents();if(s.multiply(pe),a.copy(ne.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/pe.x),s.x=a.x*pe.x,ne.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/pe.y),s.y=a.y*pe.y,ne.mapSize.y=a.y)),ne.map===null||O===!0||Z===!0){const $e=this.type!==es?{minFilter:Jn,magFilter:Jn}:{};ne.map!==null&&ne.map.dispose(),ne.map=new bi(s.x,s.y,$e),ne.map.texture.name=J.name+".shadowMap",ne.camera.updateProjectionMatrix()}n.setRenderTarget(ne.map),n.clear();const ve=ne.getViewportCount();for(let $e=0;$e<ve;$e++){const I=ne.getViewport($e);r.set(a.x*I.x,a.y*I.y,a.x*I.z,a.y*I.w),D.viewport(r),ne.updateMatrices(J,$e),i=ne.getFrustum(),M(C,A,ne.camera,J,this.type)}ne.isPointLightShadow!==!0&&this.type===es&&y(ne,A),ne.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(w,b,P)};function y(S,C){const A=e.update(_);m.defines.VSM_SAMPLES!==S.blurSamples&&(m.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new bi(s.x,s.y)),m.uniforms.shadow_pass.value=S.map.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(C,null,A,m,_,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(C,null,A,p,_,null)}function v(S,C,A,w){let b=null;const P=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)b=P;else if(b=A.isPointLight===!0?c:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const D=b.uuid,O=C.uuid;let Z=h[D];Z===void 0&&(Z={},h[D]=Z);let te=Z[O];te===void 0&&(te=b.clone(),Z[O]=te,C.addEventListener("dispose",E)),b=te}if(b.visible=C.visible,b.wireframe=C.wireframe,w===es?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const D=n.properties.get(b);D.light=A}return b}function M(S,C,A,w,b){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===es)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const O=e.update(S),Z=S.material;if(Array.isArray(Z)){const te=O.groups;for(let q=0,J=te.length;q<J;q++){const ne=te[q],pe=Z[ne.materialIndex];if(pe&&pe.visible){const ve=v(S,pe,w,b);S.onBeforeShadow(n,S,C,A,O,ve,ne),n.renderBufferDirect(A,null,O,ve,S,ne),S.onAfterShadow(n,S,C,A,O,ve,ne)}}}else if(Z.visible){const te=v(S,Z,w,b);S.onBeforeShadow(n,S,C,A,O,te,null),n.renderBufferDirect(A,null,O,te,S,null),S.onAfterShadow(n,S,C,A,O,te,null)}}const D=S.children;for(let O=0,Z=D.length;O<Z;O++)M(D[O],C,A,w,b)}function E(S){S.target.removeEventListener("dispose",E);for(const A in h){const w=h[A],b=S.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}const fM={[zc]:Nc,[kc]:Vc,[Oc]:Gc,[Ba]:Bc,[Nc]:zc,[Vc]:kc,[Gc]:Oc,[Bc]:Ba};function pM(n,e){function t(){let H=!1;const Ge=new Kt;let ke=null;const ze=new Kt(0,0,0,0);return{setMask:function(Te){ke!==Te&&!H&&(n.colorMask(Te,Te,Te,Te),ke=Te)},setLocked:function(Te){H=Te},setClear:function(Te,me,Je,ft,Wt){Wt===!0&&(Te*=ft,me*=ft,Je*=ft),Ge.set(Te,me,Je,ft),ze.equals(Ge)===!1&&(n.clearColor(Te,me,Je,ft),ze.copy(Ge))},reset:function(){H=!1,ke=null,ze.set(-1,0,0,0)}}}function i(){let H=!1,Ge=!1,ke=null,ze=null,Te=null;return{setReversed:function(me){if(Ge!==me){const Je=e.get("EXT_clip_control");me?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Ge=me;const ft=Te;Te=null,this.setClear(ft)}},getReversed:function(){return Ge},setTest:function(me){me?K(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(me){ke!==me&&!H&&(n.depthMask(me),ke=me)},setFunc:function(me){if(Ge&&(me=fM[me]),ze!==me){switch(me){case zc:n.depthFunc(n.NEVER);break;case Nc:n.depthFunc(n.ALWAYS);break;case kc:n.depthFunc(n.LESS);break;case Ba:n.depthFunc(n.LEQUAL);break;case Oc:n.depthFunc(n.EQUAL);break;case Bc:n.depthFunc(n.GEQUAL);break;case Vc:n.depthFunc(n.GREATER);break;case Gc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ze=me}},setLocked:function(me){H=me},setClear:function(me){Te!==me&&(Ge&&(me=1-me),n.clearDepth(me),Te=me)},reset:function(){H=!1,ke=null,ze=null,Te=null,Ge=!1}}}function s(){let H=!1,Ge=null,ke=null,ze=null,Te=null,me=null,Je=null,ft=null,Wt=null;return{setTest:function(Nt){H||(Nt?K(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(Nt){Ge!==Nt&&!H&&(n.stencilMask(Nt),Ge=Nt)},setFunc:function(Nt,kn,Cn){(ke!==Nt||ze!==kn||Te!==Cn)&&(n.stencilFunc(Nt,kn,Cn),ke=Nt,ze=kn,Te=Cn)},setOp:function(Nt,kn,Cn){(me!==Nt||Je!==kn||ft!==Cn)&&(n.stencilOp(Nt,kn,Cn),me=Nt,Je=kn,ft=Cn)},setLocked:function(Nt){H=Nt},setClear:function(Nt){Wt!==Nt&&(n.clearStencil(Nt),Wt=Nt)},reset:function(){H=!1,Ge=null,ke=null,ze=null,Te=null,me=null,Je=null,ft=null,Wt=null}}}const a=new t,r=new i,o=new s,c=new WeakMap,h=new WeakMap;let d={},u={},m=new WeakMap,p=[],x=null,_=!1,g=null,f=null,y=null,v=null,M=null,E=null,S=null,C=new rt(0,0,0),A=0,w=!1,b=null,P=null,D=null,O=null,Z=null;const te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,J=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=J>=1):ne.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=J>=2);let pe=null,ve={};const $e=n.getParameter(n.SCISSOR_BOX),I=n.getParameter(n.VIEWPORT),Ce=new Kt().fromArray($e),be=new Kt().fromArray(I);function Re(H,Ge,ke,ze){const Te=new Uint8Array(4),me=n.createTexture();n.bindTexture(H,me),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Je=0;Je<ke;Je++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(Ge,0,n.RGBA,1,1,ze,0,n.RGBA,n.UNSIGNED_BYTE,Te):n.texImage2D(Ge+Je,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Te);return me}const $={};$[n.TEXTURE_2D]=Re(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=Re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=Re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=Re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),K(n.DEPTH_TEST),r.setFunc(Ba),Tt(!1),yt(Od),K(n.CULL_FACE),Bt(Ni);function K(H){d[H]!==!0&&(n.enable(H),d[H]=!0)}function we(H){d[H]!==!1&&(n.disable(H),d[H]=!1)}function Pe(H,Ge){return u[H]!==Ge?(n.bindFramebuffer(H,Ge),u[H]=Ge,H===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Ge),H===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Ge),!0):!1}function Oe(H,Ge){let ke=p,ze=!1;if(H){ke=m.get(Ge),ke===void 0&&(ke=[],m.set(Ge,ke));const Te=H.textures;if(ke.length!==Te.length||ke[0]!==n.COLOR_ATTACHMENT0){for(let me=0,Je=Te.length;me<Je;me++)ke[me]=n.COLOR_ATTACHMENT0+me;ke.length=Te.length,ze=!0}}else ke[0]!==n.BACK&&(ke[0]=n.BACK,ze=!0);ze&&n.drawBuffers(ke)}function nt(H){return x!==H?(n.useProgram(H),x=H,!0):!1}const Ht={[Hs]:n.FUNC_ADD,[Pp]:n.FUNC_SUBTRACT,[Lp]:n.FUNC_REVERSE_SUBTRACT};Ht[Dp]=n.MIN,Ht[Ip]=n.MAX;const at={[Fp]:n.ZERO,[Up]:n.ONE,[zp]:n.SRC_COLOR,[Fc]:n.SRC_ALPHA,[Gp]:n.SRC_ALPHA_SATURATE,[Bp]:n.DST_COLOR,[kp]:n.DST_ALPHA,[Np]:n.ONE_MINUS_SRC_COLOR,[Uc]:n.ONE_MINUS_SRC_ALPHA,[Vp]:n.ONE_MINUS_DST_COLOR,[Op]:n.ONE_MINUS_DST_ALPHA,[Hp]:n.CONSTANT_COLOR,[Wp]:n.ONE_MINUS_CONSTANT_COLOR,[Xp]:n.CONSTANT_ALPHA,[qp]:n.ONE_MINUS_CONSTANT_ALPHA};function Bt(H,Ge,ke,ze,Te,me,Je,ft,Wt,Nt){if(H===Ni){_===!0&&(we(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),H!==Rp){if(H!==g||Nt!==w){if((f!==Hs||M!==Hs)&&(n.blendEquation(n.FUNC_ADD),f=Hs,M=Hs),Nt)switch(H){case Fa:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ri:n.blendFunc(n.ONE,n.ONE);break;case Bd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Vd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:ln("WebGLState: Invalid blending: ",H);break}else switch(H){case Fa:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ri:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Bd:ln("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Vd:ln("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ln("WebGLState: Invalid blending: ",H);break}y=null,v=null,E=null,S=null,C.set(0,0,0),A=0,g=H,w=Nt}return}Te=Te||Ge,me=me||ke,Je=Je||ze,(Ge!==f||Te!==M)&&(n.blendEquationSeparate(Ht[Ge],Ht[Te]),f=Ge,M=Te),(ke!==y||ze!==v||me!==E||Je!==S)&&(n.blendFuncSeparate(at[ke],at[ze],at[me],at[Je]),y=ke,v=ze,E=me,S=Je),(ft.equals(C)===!1||Wt!==A)&&(n.blendColor(ft.r,ft.g,ft.b,Wt),C.copy(ft),A=Wt),g=H,w=!1}function B(H,Ge){H.side===wt?we(n.CULL_FACE):K(n.CULL_FACE);let ke=H.side===Fn;Ge&&(ke=!ke),Tt(ke),H.blending===Fa&&H.transparent===!1?Bt(Ni):Bt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),r.setFunc(H.depthFunc),r.setTest(H.depthTest),r.setMask(H.depthWrite),a.setMask(H.colorWrite);const ze=H.stencilWrite;o.setTest(ze),ze&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Qe(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function Tt(H){b!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),b=H)}function yt(H){H!==Ap?(K(n.CULL_FACE),H!==P&&(H===Od?n.cullFace(n.BACK):H===Cp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),P=H}function Vt(H){H!==D&&(q&&n.lineWidth(H),D=H)}function Qe(H,Ge,ke){H?(K(n.POLYGON_OFFSET_FILL),(O!==Ge||Z!==ke)&&(n.polygonOffset(Ge,ke),O=Ge,Z=ke)):we(n.POLYGON_OFFSET_FILL)}function qt(H){H?K(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function ot(H){H===void 0&&(H=n.TEXTURE0+te-1),pe!==H&&(n.activeTexture(H),pe=H)}function Mt(H,Ge,ke){ke===void 0&&(pe===null?ke=n.TEXTURE0+te-1:ke=pe);let ze=ve[ke];ze===void 0&&(ze={type:void 0,texture:void 0},ve[ke]=ze),(ze.type!==H||ze.texture!==Ge)&&(pe!==ke&&(n.activeTexture(ke),pe=ke),n.bindTexture(H,Ge||$[H]),ze.type=H,ze.texture=Ge)}function F(){const H=ve[pe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function R(){try{n.compressedTexImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function ue(){try{n.texSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function ge(){try{n.texSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function et(){try{n.compressedTexSubImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Fe(){try{n.texStorage2D(...arguments)}catch(H){H("WebGLState:",H)}}function it(){try{n.texStorage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Ye(){try{n.texImage2D(...arguments)}catch(H){H("WebGLState:",H)}}function _e(){try{n.texImage3D(...arguments)}catch(H){H("WebGLState:",H)}}function Le(H){Ce.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),Ce.copy(H))}function ht(H){be.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),be.copy(H))}function ct(H,Ge){let ke=h.get(Ge);ke===void 0&&(ke=new WeakMap,h.set(Ge,ke));let ze=ke.get(H);ze===void 0&&(ze=n.getUniformBlockIndex(Ge,H.name),ke.set(H,ze))}function Xe(H,Ge){const ze=h.get(Ge).get(H);c.get(Ge)!==ze&&(n.uniformBlockBinding(Ge,ze,H.__bindingPointIndex),c.set(Ge,ze))}function ut(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},pe=null,ve={},u={},m=new WeakMap,p=[],x=null,_=!1,g=null,f=null,y=null,v=null,M=null,E=null,S=null,C=new rt(0,0,0),A=0,w=!1,b=null,P=null,D=null,O=null,Z=null,Ce.set(0,0,n.canvas.width,n.canvas.height),be.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:K,disable:we,bindFramebuffer:Pe,drawBuffers:Oe,useProgram:nt,setBlending:Bt,setMaterial:B,setFlipSided:Tt,setCullFace:yt,setLineWidth:Vt,setPolygonOffset:Qe,setScissorTest:qt,activeTexture:ot,bindTexture:Mt,unbindTexture:F,compressedTexImage2D:R,compressedTexImage3D:j,texImage2D:Ye,texImage3D:_e,updateUBOMapping:ct,uniformBlockBinding:Xe,texStorage2D:Fe,texStorage3D:it,texSubImage2D:ue,texSubImage3D:ge,compressedTexSubImage2D:re,compressedTexSubImage3D:et,scissor:Le,viewport:ht,reset:ut}}function mM(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ue,d=new WeakMap;let u;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(F,R){return p?new OffscreenCanvas(F,R):ol("canvas")}function _(F,R,j){let ue=1;const ge=Mt(F);if((ge.width>j||ge.height>j)&&(ue=j/Math.max(ge.width,ge.height)),ue<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const re=Math.floor(ue*ge.width),et=Math.floor(ue*ge.height);u===void 0&&(u=x(re,et));const Fe=R?x(re,et):u;return Fe.width=re,Fe.height=et,Fe.getContext("2d").drawImage(F,0,0,re,et),vt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+re+"x"+et+")."),Fe}else return"data"in F&&vt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),F;return F}function g(F){return F.generateMipmaps}function f(F){n.generateMipmap(F)}function y(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(F,R,j,ue,ge=!1){if(F!==null){if(n[F]!==void 0)return n[F];vt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let re=R;if(R===n.RED&&(j===n.FLOAT&&(re=n.R32F),j===n.HALF_FLOAT&&(re=n.R16F),j===n.UNSIGNED_BYTE&&(re=n.R8)),R===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(re=n.R8UI),j===n.UNSIGNED_SHORT&&(re=n.R16UI),j===n.UNSIGNED_INT&&(re=n.R32UI),j===n.BYTE&&(re=n.R8I),j===n.SHORT&&(re=n.R16I),j===n.INT&&(re=n.R32I)),R===n.RG&&(j===n.FLOAT&&(re=n.RG32F),j===n.HALF_FLOAT&&(re=n.RG16F),j===n.UNSIGNED_BYTE&&(re=n.RG8)),R===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(re=n.RG8UI),j===n.UNSIGNED_SHORT&&(re=n.RG16UI),j===n.UNSIGNED_INT&&(re=n.RG32UI),j===n.BYTE&&(re=n.RG8I),j===n.SHORT&&(re=n.RG16I),j===n.INT&&(re=n.RG32I)),R===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(re=n.RGB8UI),j===n.UNSIGNED_SHORT&&(re=n.RGB16UI),j===n.UNSIGNED_INT&&(re=n.RGB32UI),j===n.BYTE&&(re=n.RGB8I),j===n.SHORT&&(re=n.RGB16I),j===n.INT&&(re=n.RGB32I)),R===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),j===n.UNSIGNED_INT&&(re=n.RGBA32UI),j===n.BYTE&&(re=n.RGBA8I),j===n.SHORT&&(re=n.RGBA16I),j===n.INT&&(re=n.RGBA32I)),R===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),R===n.RGBA){const et=ge?al:kt.getTransfer(ue);j===n.FLOAT&&(re=n.RGBA32F),j===n.HALF_FLOAT&&(re=n.RGBA16F),j===n.UNSIGNED_BYTE&&(re=et===$t?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function M(F,R){let j;return F?R===null||R===ea||R===Ir?j=n.DEPTH24_STENCIL8:R===Fi?j=n.DEPTH32F_STENCIL8:R===Dr&&(j=n.DEPTH24_STENCIL8,vt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===ea||R===Ir?j=n.DEPTH_COMPONENT24:R===Fi?j=n.DEPTH_COMPONENT32F:R===Dr&&(j=n.DEPTH_COMPONENT16),j}function E(F,R){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==Jn&&F.minFilter!==oi?Math.log2(Math.max(R.width,R.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?R.mipmaps.length:1}function S(F){const R=F.target;R.removeEventListener("dispose",S),A(R),R.isVideoTexture&&d.delete(R)}function C(F){const R=F.target;R.removeEventListener("dispose",C),b(R)}function A(F){const R=i.get(F);if(R.__webglInit===void 0)return;const j=F.source,ue=m.get(j);if(ue){const ge=ue[R.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&w(F),Object.keys(ue).length===0&&m.delete(j)}i.remove(F)}function w(F){const R=i.get(F);n.deleteTexture(R.__webglTexture);const j=F.source,ue=m.get(j);delete ue[R.__cacheKey],r.memory.textures--}function b(F){const R=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++){if(Array.isArray(R.__webglFramebuffer[ue]))for(let ge=0;ge<R.__webglFramebuffer[ue].length;ge++)n.deleteFramebuffer(R.__webglFramebuffer[ue][ge]);else n.deleteFramebuffer(R.__webglFramebuffer[ue]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[ue])}else{if(Array.isArray(R.__webglFramebuffer))for(let ue=0;ue<R.__webglFramebuffer.length;ue++)n.deleteFramebuffer(R.__webglFramebuffer[ue]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ue=0;ue<R.__webglColorRenderbuffer.length;ue++)R.__webglColorRenderbuffer[ue]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[ue]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const j=F.textures;for(let ue=0,ge=j.length;ue<ge;ue++){const re=i.get(j[ue]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),r.memory.textures--),i.remove(j[ue])}i.remove(F)}let P=0;function D(){P=0}function O(){const F=P;return F>=s.maxTextures&&vt("WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+s.maxTextures),P+=1,F}function Z(F){const R=[];return R.push(F.wrapS),R.push(F.wrapT),R.push(F.wrapR||0),R.push(F.magFilter),R.push(F.minFilter),R.push(F.anisotropy),R.push(F.internalFormat),R.push(F.format),R.push(F.type),R.push(F.generateMipmaps),R.push(F.premultiplyAlpha),R.push(F.flipY),R.push(F.unpackAlignment),R.push(F.colorSpace),R.join()}function te(F,R){const j=i.get(F);if(F.isVideoTexture&&qt(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&j.__version!==F.version){const ue=F.image;if(ue===null)vt("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)vt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(j,F,R);return}}else F.isExternalTexture&&(j.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+R)}function q(F,R){const j=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&j.__version!==F.version){$(j,F,R);return}else F.isExternalTexture&&(j.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+R)}function J(F,R){const j=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&j.__version!==F.version){$(j,F,R);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+R)}function ne(F,R){const j=i.get(F);if(F.version>0&&j.__version!==F.version){K(j,F,R);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+R)}const pe={[Nn]:n.REPEAT,[is]:n.CLAMP_TO_EDGE,[Xc]:n.MIRRORED_REPEAT},ve={[Jn]:n.NEAREST,[Zp]:n.NEAREST_MIPMAP_NEAREST,[oo]:n.NEAREST_MIPMAP_LINEAR,[oi]:n.LINEAR,[Bl]:n.LINEAR_MIPMAP_NEAREST,[Xs]:n.LINEAR_MIPMAP_LINEAR},$e={[Qp]:n.NEVER,[am]:n.ALWAYS,[em]:n.LESS,[O0]:n.LEQUAL,[tm]:n.EQUAL,[sm]:n.GEQUAL,[nm]:n.GREATER,[im]:n.NOTEQUAL};function I(F,R){if(R.type===Fi&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===oi||R.magFilter===Bl||R.magFilter===oo||R.magFilter===Xs||R.minFilter===oi||R.minFilter===Bl||R.minFilter===oo||R.minFilter===Xs)&&vt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,pe[R.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,pe[R.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,pe[R.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,ve[R.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,ve[R.minFilter]),R.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,$e[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Jn||R.minFilter!==oo&&R.minFilter!==Xs||R.type===Fi&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(F,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,s.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function Ce(F,R){let j=!1;F.__webglInit===void 0&&(F.__webglInit=!0,R.addEventListener("dispose",S));const ue=R.source;let ge=m.get(ue);ge===void 0&&(ge={},m.set(ue,ge));const re=Z(R);if(re!==F.__cacheKey){ge[re]===void 0&&(ge[re]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,j=!0),ge[re].usedTimes++;const et=ge[F.__cacheKey];et!==void 0&&(ge[F.__cacheKey].usedTimes--,et.usedTimes===0&&w(R)),F.__cacheKey=re,F.__webglTexture=ge[re].texture}return j}function be(F,R,j){return Math.floor(Math.floor(F/j)/R)}function Re(F,R,j,ue){const re=F.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,R.width,R.height,j,ue,R.data);else{re.sort((_e,Le)=>_e.start-Le.start);let et=0;for(let _e=1;_e<re.length;_e++){const Le=re[et],ht=re[_e],ct=Le.start+Le.count,Xe=be(ht.start,R.width,4),ut=be(Le.start,R.width,4);ht.start<=ct+1&&Xe===ut&&be(ht.start+ht.count-1,R.width,4)===Xe?Le.count=Math.max(Le.count,ht.start+ht.count-Le.start):(++et,re[et]=ht)}re.length=et+1;const Fe=n.getParameter(n.UNPACK_ROW_LENGTH),it=n.getParameter(n.UNPACK_SKIP_PIXELS),Ye=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,R.width);for(let _e=0,Le=re.length;_e<Le;_e++){const ht=re[_e],ct=Math.floor(ht.start/4),Xe=Math.ceil(ht.count/4),ut=ct%R.width,H=Math.floor(ct/R.width),Ge=Xe,ke=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ut),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,ut,H,Ge,ke,j,ue,R.data)}F.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Fe),n.pixelStorei(n.UNPACK_SKIP_PIXELS,it),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ye)}}function $(F,R,j){let ue=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ue=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ue=n.TEXTURE_3D);const ge=Ce(F,R),re=R.source;t.bindTexture(ue,F.__webglTexture,n.TEXTURE0+j);const et=i.get(re);if(re.version!==et.__version||ge===!0){t.activeTexture(n.TEXTURE0+j);const Fe=kt.getPrimaries(kt.workingColorSpace),it=R.colorSpace===_s?null:kt.getPrimaries(R.colorSpace),Ye=R.colorSpace===_s||Fe===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let _e=_(R.image,!1,s.maxTextureSize);_e=ot(R,_e);const Le=a.convert(R.format,R.colorSpace),ht=a.convert(R.type);let ct=v(R.internalFormat,Le,ht,R.colorSpace,R.isVideoTexture);I(ue,R);let Xe;const ut=R.mipmaps,H=R.isVideoTexture!==!0,Ge=et.__version===void 0||ge===!0,ke=re.dataReady,ze=E(R,_e);if(R.isDepthTexture)ct=M(R.format===Ur,R.type),Ge&&(H?t.texStorage2D(n.TEXTURE_2D,1,ct,_e.width,_e.height):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Le,ht,null));else if(R.isDataTexture)if(ut.length>0){H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,ut[0].width,ut[0].height);for(let Te=0,me=ut.length;Te<me;Te++)Xe=ut[Te],H?ke&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Xe.width,Xe.height,Le,ht,Xe.data):t.texImage2D(n.TEXTURE_2D,Te,ct,Xe.width,Xe.height,0,Le,ht,Xe.data);R.generateMipmaps=!1}else H?(Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height),ke&&Re(R,_e,Le,ht)):t.texImage2D(n.TEXTURE_2D,0,ct,_e.width,_e.height,0,Le,ht,_e.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){H&&Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,ut[0].width,ut[0].height,_e.depth);for(let Te=0,me=ut.length;Te<me;Te++)if(Xe=ut[Te],R.format!==_i)if(Le!==null)if(H){if(ke)if(R.layerUpdates.size>0){const Je=Au(Xe.width,Xe.height,R.format,R.type);for(const ft of R.layerUpdates){const Wt=Xe.data.subarray(ft*Je/Xe.data.BYTES_PER_ELEMENT,(ft+1)*Je/Xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,ft,Xe.width,Xe.height,1,Le,Wt)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,0,Xe.width,Xe.height,_e.depth,Le,Xe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Te,ct,Xe.width,Xe.height,_e.depth,0,Xe.data,0,0);else vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?ke&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Te,0,0,0,Xe.width,Xe.height,_e.depth,Le,ht,Xe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Te,ct,Xe.width,Xe.height,_e.depth,0,Le,ht,Xe.data)}else{H&&Ge&&t.texStorage2D(n.TEXTURE_2D,ze,ct,ut[0].width,ut[0].height);for(let Te=0,me=ut.length;Te<me;Te++)Xe=ut[Te],R.format!==_i?Le!==null?H?ke&&t.compressedTexSubImage2D(n.TEXTURE_2D,Te,0,0,Xe.width,Xe.height,Le,Xe.data):t.compressedTexImage2D(n.TEXTURE_2D,Te,ct,Xe.width,Xe.height,0,Xe.data):vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?ke&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Xe.width,Xe.height,Le,ht,Xe.data):t.texImage2D(n.TEXTURE_2D,Te,ct,Xe.width,Xe.height,0,Le,ht,Xe.data)}else if(R.isDataArrayTexture)if(H){if(Ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,ct,_e.width,_e.height,_e.depth),ke)if(R.layerUpdates.size>0){const Te=Au(_e.width,_e.height,R.format,R.type);for(const me of R.layerUpdates){const Je=_e.data.subarray(me*Te/_e.data.BYTES_PER_ELEMENT,(me+1)*Te/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,me,_e.width,_e.height,1,Le,ht,Je)}R.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Le,ht,_e.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,_e.width,_e.height,_e.depth,0,Le,ht,_e.data);else if(R.isData3DTexture)H?(Ge&&t.texStorage3D(n.TEXTURE_3D,ze,ct,_e.width,_e.height,_e.depth),ke&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Le,ht,_e.data)):t.texImage3D(n.TEXTURE_3D,0,ct,_e.width,_e.height,_e.depth,0,Le,ht,_e.data);else if(R.isFramebufferTexture){if(Ge)if(H)t.texStorage2D(n.TEXTURE_2D,ze,ct,_e.width,_e.height);else{let Te=_e.width,me=_e.height;for(let Je=0;Je<ze;Je++)t.texImage2D(n.TEXTURE_2D,Je,ct,Te,me,0,Le,ht,null),Te>>=1,me>>=1}}else if(ut.length>0){if(H&&Ge){const Te=Mt(ut[0]);t.texStorage2D(n.TEXTURE_2D,ze,ct,Te.width,Te.height)}for(let Te=0,me=ut.length;Te<me;Te++)Xe=ut[Te],H?ke&&t.texSubImage2D(n.TEXTURE_2D,Te,0,0,Le,ht,Xe):t.texImage2D(n.TEXTURE_2D,Te,ct,Le,ht,Xe);R.generateMipmaps=!1}else if(H){if(Ge){const Te=Mt(_e);t.texStorage2D(n.TEXTURE_2D,ze,ct,Te.width,Te.height)}ke&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Le,ht,_e)}else t.texImage2D(n.TEXTURE_2D,0,ct,Le,ht,_e);g(R)&&f(ue),et.__version=re.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function K(F,R,j){if(R.image.length!==6)return;const ue=Ce(F,R),ge=R.source;t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+j);const re=i.get(ge);if(ge.version!==re.__version||ue===!0){t.activeTexture(n.TEXTURE0+j);const et=kt.getPrimaries(kt.workingColorSpace),Fe=R.colorSpace===_s?null:kt.getPrimaries(R.colorSpace),it=R.colorSpace===_s||et===Fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);const Ye=R.isCompressedTexture||R.image[0].isCompressedTexture,_e=R.image[0]&&R.image[0].isDataTexture,Le=[];for(let me=0;me<6;me++)!Ye&&!_e?Le[me]=_(R.image[me],!0,s.maxCubemapSize):Le[me]=_e?R.image[me].image:R.image[me],Le[me]=ot(R,Le[me]);const ht=Le[0],ct=a.convert(R.format,R.colorSpace),Xe=a.convert(R.type),ut=v(R.internalFormat,ct,Xe,R.colorSpace),H=R.isVideoTexture!==!0,Ge=re.__version===void 0||ue===!0,ke=ge.dataReady;let ze=E(R,ht);I(n.TEXTURE_CUBE_MAP,R);let Te;if(Ye){H&&Ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,ut,ht.width,ht.height);for(let me=0;me<6;me++){Te=Le[me].mipmaps;for(let Je=0;Je<Te.length;Je++){const ft=Te[Je];R.format!==_i?ct!==null?H?ke&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,0,0,ft.width,ft.height,ct,ft.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,ut,ft.width,ft.height,0,ft.data):vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,0,0,ft.width,ft.height,ct,Xe,ft.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je,ut,ft.width,ft.height,0,ct,Xe,ft.data)}}}else{if(Te=R.mipmaps,H&&Ge){Te.length>0&&ze++;const me=Mt(Le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ze,ut,me.width,me.height)}for(let me=0;me<6;me++)if(_e){H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Le[me].width,Le[me].height,ct,Xe,Le[me].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,ut,Le[me].width,Le[me].height,0,ct,Xe,Le[me].data);for(let Je=0;Je<Te.length;Je++){const Wt=Te[Je].image[me].image;H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,0,0,Wt.width,Wt.height,ct,Xe,Wt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,ut,Wt.width,Wt.height,0,ct,Xe,Wt.data)}}else{H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,ct,Xe,Le[me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,ut,ct,Xe,Le[me]);for(let Je=0;Je<Te.length;Je++){const ft=Te[Je];H?ke&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,0,0,ct,Xe,ft.image[me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Je+1,ut,ct,Xe,ft.image[me])}}}g(R)&&f(n.TEXTURE_CUBE_MAP),re.__version=ge.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function we(F,R,j,ue,ge,re){const et=a.convert(j.format,j.colorSpace),Fe=a.convert(j.type),it=v(j.internalFormat,et,Fe,j.colorSpace),Ye=i.get(R),_e=i.get(j);if(_e.__renderTarget=R,!Ye.__hasExternalTextures){const Le=Math.max(1,R.width>>re),ht=Math.max(1,R.height>>re);ge===n.TEXTURE_3D||ge===n.TEXTURE_2D_ARRAY?t.texImage3D(ge,re,it,Le,ht,R.depth,0,et,Fe,null):t.texImage2D(ge,re,it,Le,ht,0,et,Fe,null)}t.bindFramebuffer(n.FRAMEBUFFER,F),Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,ge,_e.__webglTexture,0,Vt(R)):(ge===n.TEXTURE_2D||ge>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ue,ge,_e.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(F,R,j){if(n.bindRenderbuffer(n.RENDERBUFFER,F),R.depthBuffer){const ue=R.depthTexture,ge=ue&&ue.isDepthTexture?ue.type:null,re=M(R.stencilBuffer,ge),et=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Fe=Vt(R);Qe(R)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Fe,re,R.width,R.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,re,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,re,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,F)}else{const ue=R.textures;for(let ge=0;ge<ue.length;ge++){const re=ue[ge],et=a.convert(re.format,re.colorSpace),Fe=a.convert(re.type),it=v(re.internalFormat,et,Fe,re.colorSpace),Ye=Vt(R);j&&Qe(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ye,it,R.width,R.height):Qe(R)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ye,it,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,it,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(F,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,F),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ue=i.get(R.depthTexture);ue.__renderTarget=R,(!ue.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),te(R.depthTexture,0);const ge=ue.__webglTexture,re=Vt(R);if(R.depthTexture.format===Fr)Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ge,0);else if(R.depthTexture.format===Ur)Qe(R)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function nt(F){const R=i.get(F),j=F.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==F.depthTexture){const ue=F.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),ue){const ge=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,ue.removeEventListener("dispose",ge)};ue.addEventListener("dispose",ge),R.__depthDisposeCallback=ge}R.__boundDepthTexture=ue}if(F.depthTexture&&!R.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const ue=F.texture.mipmaps;ue&&ue.length>0?Oe(R.__webglFramebuffer[0],F):Oe(R.__webglFramebuffer,F)}else if(j){R.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[ue]),R.__webglDepthbuffer[ue]===void 0)R.__webglDepthbuffer[ue]=n.createRenderbuffer(),Pe(R.__webglDepthbuffer[ue],F,!1);else{const ge=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=R.__webglDepthbuffer[ue];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,re)}}else{const ue=F.texture.mipmaps;if(ue&&ue.length>0?t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),Pe(R.__webglDepthbuffer,F,!1);else{const ge=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ht(F,R,j){const ue=i.get(F);R!==void 0&&we(ue.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&nt(F)}function at(F){const R=F.texture,j=i.get(F),ue=i.get(R);F.addEventListener("dispose",C);const ge=F.textures,re=F.isWebGLCubeRenderTarget===!0,et=ge.length>1;if(et||(ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture()),ue.__version=R.version,r.memory.textures++),re){j.__webglFramebuffer=[];for(let Fe=0;Fe<6;Fe++)if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer[Fe]=[];for(let it=0;it<R.mipmaps.length;it++)j.__webglFramebuffer[Fe][it]=n.createFramebuffer()}else j.__webglFramebuffer[Fe]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer=[];for(let Fe=0;Fe<R.mipmaps.length;Fe++)j.__webglFramebuffer[Fe]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(et)for(let Fe=0,it=ge.length;Fe<it;Fe++){const Ye=i.get(ge[Fe]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=n.createTexture(),r.memory.textures++)}if(F.samples>0&&Qe(F)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Fe=0;Fe<ge.length;Fe++){const it=ge[Fe];j.__webglColorRenderbuffer[Fe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[Fe]);const Ye=a.convert(it.format,it.colorSpace),_e=a.convert(it.type),Le=v(it.internalFormat,Ye,_e,it.colorSpace,F.isXRRenderTarget===!0),ht=Vt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,ht,Le,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Fe,n.RENDERBUFFER,j.__webglColorRenderbuffer[Fe])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(j.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ue.__webglTexture),I(n.TEXTURE_CUBE_MAP,R);for(let Fe=0;Fe<6;Fe++)if(R.mipmaps&&R.mipmaps.length>0)for(let it=0;it<R.mipmaps.length;it++)we(j.__webglFramebuffer[Fe][it],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Fe,it);else we(j.__webglFramebuffer[Fe],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Fe,0);g(R)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(et){for(let Fe=0,it=ge.length;Fe<it;Fe++){const Ye=ge[Fe],_e=i.get(Ye);let Le=n.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Le=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Le,_e.__webglTexture),I(Le,Ye),we(j.__webglFramebuffer,F,Ye,n.COLOR_ATTACHMENT0+Fe,Le,0),g(Ye)&&f(Le)}t.unbindTexture()}else{let Fe=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Fe=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Fe,ue.__webglTexture),I(Fe,R),R.mipmaps&&R.mipmaps.length>0)for(let it=0;it<R.mipmaps.length;it++)we(j.__webglFramebuffer[it],F,R,n.COLOR_ATTACHMENT0,Fe,it);else we(j.__webglFramebuffer,F,R,n.COLOR_ATTACHMENT0,Fe,0);g(R)&&f(Fe),t.unbindTexture()}F.depthBuffer&&nt(F)}function Bt(F){const R=F.textures;for(let j=0,ue=R.length;j<ue;j++){const ge=R[j];if(g(ge)){const re=y(F),et=i.get(ge).__webglTexture;t.bindTexture(re,et),f(re),t.unbindTexture()}}}const B=[],Tt=[];function yt(F){if(F.samples>0){if(Qe(F)===!1){const R=F.textures,j=F.width,ue=F.height;let ge=n.COLOR_BUFFER_BIT;const re=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=i.get(F),Fe=R.length>1;if(Fe)for(let Ye=0;Ye<R.length;Ye++)t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,et.__webglMultisampledFramebuffer);const it=F.texture.mipmaps;it&&it.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let Ye=0;Ye<R.length;Ye++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(ge|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(ge|=n.STENCIL_BUFFER_BIT)),Fe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,et.__webglColorRenderbuffer[Ye]);const _e=i.get(R[Ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_e,0)}n.blitFramebuffer(0,0,j,ue,0,0,j,ue,ge,n.NEAREST),c===!0&&(B.length=0,Tt.length=0,B.push(n.COLOR_ATTACHMENT0+Ye),F.depthBuffer&&F.resolveDepthBuffer===!1&&(B.push(re),Tt.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Tt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,B))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Fe)for(let Ye=0;Ye<R.length;Ye++){t.bindFramebuffer(n.FRAMEBUFFER,et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.RENDERBUFFER,et.__webglColorRenderbuffer[Ye]);const _e=i.get(R[Ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ye,n.TEXTURE_2D,_e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,et.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&c){const R=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Vt(F){return Math.min(s.maxSamples,F.samples)}function Qe(F){const R=i.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function qt(F){const R=r.render.frame;d.get(F)!==R&&(d.set(F,R),F.update())}function ot(F,R){const j=F.colorSpace,ue=F.format,ge=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||j!==Ha&&j!==_s&&(kt.getTransfer(j)===$t?(ue!==_i||ge!==Wi)&&vt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ln("WebGLTextures: Unsupported texture color space:",j)),R}function Mt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(h.width=F.naturalWidth||F.width,h.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(h.width=F.displayWidth,h.height=F.displayHeight):(h.width=F.width,h.height=F.height),h}this.allocateTextureUnit=O,this.resetTextureUnits=D,this.setTexture2D=te,this.setTexture2DArray=q,this.setTexture3D=J,this.setTextureCube=ne,this.rebindTextures=Ht,this.setupRenderTarget=at,this.updateRenderTargetMipmap=Bt,this.updateMultisampleRenderTarget=yt,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=we,this.useMultisampledRTT=Qe}function xM(n,e){function t(i,s=_s){let a;const r=kt.getTransfer(s);if(i===Wi)return n.UNSIGNED_BYTE;if(i===Yh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===$h)return n.UNSIGNED_SHORT_5_5_5_1;if(i===U0)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===z0)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===I0)return n.BYTE;if(i===F0)return n.SHORT;if(i===Dr)return n.UNSIGNED_SHORT;if(i===qh)return n.INT;if(i===ea)return n.UNSIGNED_INT;if(i===Fi)return n.FLOAT;if(i===ki)return n.HALF_FLOAT;if(i===N0)return n.ALPHA;if(i===k0)return n.RGB;if(i===_i)return n.RGBA;if(i===Fr)return n.DEPTH_COMPONENT;if(i===Ur)return n.DEPTH_STENCIL;if(i===Zh)return n.RED;if(i===Kh)return n.RED_INTEGER;if(i===Jh)return n.RG;if(i===jh)return n.RG_INTEGER;if(i===Qh)return n.RGBA_INTEGER;if(i===Ko||i===Jo||i===jo||i===Qo)if(r===$t)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Ko)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Jo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===jo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Qo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Ko)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Jo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===jo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Qo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===qc||i===Yc||i===$c||i===Zc)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===qc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Yc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===$c)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Zc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Kc||i===Jc||i===jc)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Kc||i===Jc)return r===$t?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===jc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Qc||i===eh||i===th||i===nh||i===ih||i===sh||i===ah||i===rh||i===oh||i===lh||i===ch||i===hh||i===dh||i===uh)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Qc)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===eh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===th)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===nh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ih)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===sh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ah)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===rh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===oh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===lh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ch)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===hh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===uh)return r===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===fh||i===ph||i===mh)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===fh)return r===$t?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ph)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===mh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===xh||i===gh||i===vh||i===Mh)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===xh)return a.COMPRESSED_RED_RGTC1_EXT;if(i===gh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===vh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Mh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ir?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const gM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vM=`
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

}`;class MM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new j0(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Tn({vertexShader:gM,fragmentShader:vM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new z(new Ut(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _M extends $a{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,h=null,d=null,u=null,m=null,p=null,x=null;const _=typeof XRWebGLBinding<"u",g=new MM,f={},y=t.getContextAttributes();let v=null,M=null;const E=[],S=[],C=new Ue;let A=null;const w=new Zn;w.viewport=new Kt;const b=new Zn;b.viewport=new Kt;const P=[w,b],D=new kx;let O=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new oc,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new oc,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new oc,E[$]=K),K.getHandSpace()};function te($){const K=S.indexOf($.inputSource);if(K===-1)return;const we=E[K];we!==void 0&&(we.update($.inputSource,$.frame,h||r),we.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",te),s.removeEventListener("selectstart",te),s.removeEventListener("selectend",te),s.removeEventListener("squeeze",te),s.removeEventListener("squeezestart",te),s.removeEventListener("squeezeend",te),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",J);for(let $=0;$<E.length;$++){const K=S[$];K!==null&&(S[$]=null,E[$].disconnect(K))}O=null,Z=null,g.reset();for(const $ in f)delete f[$];e.setRenderTarget(v),p=null,m=null,u=null,s=null,M=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&vt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&vt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",te),s.addEventListener("selectstart",te),s.addEventListener("selectend",te),s.addEventListener("squeeze",te),s.addEventListener("squeezestart",te),s.addEventListener("squeezeend",te),s.addEventListener("end",q),s.addEventListener("inputsourceschange",J),y.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,Pe=null,Oe=null;y.depth&&(Oe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=y.stencil?Ur:Fr,Pe=y.stencil?Ir:ea);const nt={colorFormat:t.RGBA8,depthFormat:Oe,scaleFactor:a};u=this.getBinding(),m=u.createProjectionLayer(nt),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),M=new bi(m.textureWidth,m.textureHeight,{format:_i,type:Wi,depthTexture:new J0(m.textureWidth,m.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const we={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new bi(p.framebufferWidth,p.framebufferHeight,{format:_i,type:Wi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),h=null,r=await s.requestReferenceSpace(o),Re.setContext(s),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function J($){for(let K=0;K<$.removed.length;K++){const we=$.removed[K],Pe=S.indexOf(we);Pe>=0&&(S[Pe]=null,E[Pe].disconnect(we))}for(let K=0;K<$.added.length;K++){const we=$.added[K];let Pe=S.indexOf(we);if(Pe===-1){for(let nt=0;nt<E.length;nt++)if(nt>=S.length){S.push(we),Pe=nt;break}else if(S[nt]===null){S[nt]=we,Pe=nt;break}if(Pe===-1)break}const Oe=E[Pe];Oe&&Oe.connect(we)}}const ne=new L,pe=new L;function ve($,K,we){ne.setFromMatrixPosition(K.matrixWorld),pe.setFromMatrixPosition(we.matrixWorld);const Pe=ne.distanceTo(pe),Oe=K.projectionMatrix.elements,nt=we.projectionMatrix.elements,Ht=Oe[14]/(Oe[10]-1),at=Oe[14]/(Oe[10]+1),Bt=(Oe[9]+1)/Oe[5],B=(Oe[9]-1)/Oe[5],Tt=(Oe[8]-1)/Oe[0],yt=(nt[8]+1)/nt[0],Vt=Ht*Tt,Qe=Ht*yt,qt=Pe/(-Tt+yt),ot=qt*-Tt;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(qt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Oe[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const Mt=Ht+qt,F=at+qt,R=Vt-ot,j=Qe+(Pe-ot),ue=Bt*at/F*Mt,ge=B*at/F*Mt;$.projectionMatrix.makePerspective(R,j,ue,ge,Mt,F),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function $e($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,we=$.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(we=g.depthFar)),D.near=b.near=w.near=K,D.far=b.far=w.far=we,(O!==D.near||Z!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,Z=D.far),D.layers.mask=$.layers.mask|6,w.layers.mask=D.layers.mask&3,b.layers.mask=D.layers.mask&5;const Pe=$.parent,Oe=D.cameras;$e(D,Pe);for(let nt=0;nt<Oe.length;nt++)$e(Oe[nt],Pe);Oe.length===2?ve(D,w,b):D.projectionMatrix.copy(w.projectionMatrix),I($,D,Pe)};function I($,K,we){we===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(we.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Nr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(m===null&&p===null))return c},this.setFoveation=function($){c=$,m!==null&&(m.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function($){return f[$]};let Ce=null;function be($,K){if(d=K.getViewerPose(h||r),x=K,d!==null){const we=d.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let Pe=!1;we.length!==D.cameras.length&&(D.cameras.length=0,Pe=!0);for(let at=0;at<we.length;at++){const Bt=we[at];let B=null;if(p!==null)B=p.getViewport(Bt);else{const yt=u.getViewSubImage(m,Bt);B=yt.viewport,at===0&&(e.setRenderTargetTextures(M,yt.colorTexture,yt.depthStencilTexture),e.setRenderTarget(M))}let Tt=P[at];Tt===void 0&&(Tt=new Zn,Tt.layers.enable(at),Tt.viewport=new Kt,P[at]=Tt),Tt.matrix.fromArray(Bt.transform.matrix),Tt.matrix.decompose(Tt.position,Tt.quaternion,Tt.scale),Tt.projectionMatrix.fromArray(Bt.projectionMatrix),Tt.projectionMatrixInverse.copy(Tt.projectionMatrix).invert(),Tt.viewport.set(B.x,B.y,B.width,B.height),at===0&&(D.matrix.copy(Tt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Pe===!0&&D.cameras.push(Tt)}const Oe=s.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const at=u.getDepthInformation(we[0]);at&&at.isValid&&at.texture&&g.init(at,s.renderState)}if(Oe&&Oe.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let at=0;at<we.length;at++){const Bt=we[at].camera;if(Bt){let B=f[Bt];B||(B=new j0,f[Bt]=B);const Tt=u.getCameraImage(Bt);B.sourceTexture=Tt}}}}for(let we=0;we<E.length;we++){const Pe=S[we],Oe=E[we];Pe!==null&&Oe!==void 0&&Oe.update(Pe,K,h||r)}Ce&&Ce($,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Re=new hf;Re.setAnimationLoop(be),this.setAnimationLoop=function($){Ce=$},this.dispose=function(){}}}const ks=new wi,yM=new bt;function bM(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,X0(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,y,v,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(g,f):f.isMeshToonMaterial?(a(g,f),u(g,f)):f.isMeshPhongMaterial?(a(g,f),d(g,f)):f.isMeshStandardMaterial?(a(g,f),m(g,f),f.isMeshPhysicalMaterial&&p(g,f,M)):f.isMeshMatcapMaterial?(a(g,f),x(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),_(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?c(g,f,y,v):f.isSpriteMaterial?h(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===Fn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===Fn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const y=e.get(f),v=y.envMap,M=y.envMapRotation;v&&(g.envMap.value=v,ks.copy(M),ks.x*=-1,ks.y*=-1,ks.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ks.y*=-1,ks.z*=-1),g.envMapRotation.value.setFromMatrix4(yM.makeRotationFromEuler(ks)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,y,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*y,g.scale.value=v*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function m(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,y){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Fn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,f){f.matcap&&(g.matcap.value=f.matcap)}function _(g,f){const y=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function wM(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){const M=v.program;i.uniformBlockBinding(y,M)}function h(y,v){let M=s[y.id];M===void 0&&(x(y),M=d(y),s[y.id]=M,y.addEventListener("dispose",g));const E=v.program;i.updateUBOMapping(y,E);const S=e.render.frame;a[y.id]!==S&&(m(y),a[y.id]=S)}function d(y){const v=u();y.__bindingPointIndex=v;const M=n.createBuffer(),E=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,E,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function u(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return ln("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(y){const v=s[y.id],M=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let S=0,C=M.length;S<C;S++){const A=Array.isArray(M[S])?M[S]:[M[S]];for(let w=0,b=A.length;w<b;w++){const P=A[w];if(p(P,S,w,E)===!0){const D=P.__offset,O=Array.isArray(P.value)?P.value:[P.value];let Z=0;for(let te=0;te<O.length;te++){const q=O[te],J=_(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,D+Z,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,Z),Z+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,D,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,v,M,E){const S=y.value,C=v+"_"+M;if(E[C]===void 0)return typeof S=="number"||typeof S=="boolean"?E[C]=S:E[C]=S.clone(),!0;{const A=E[C];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return E[C]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function x(y){const v=y.uniforms;let M=0;const E=16;for(let C=0,A=v.length;C<A;C++){const w=Array.isArray(v[C])?v[C]:[v[C]];for(let b=0,P=w.length;b<P;b++){const D=w[b],O=Array.isArray(D.value)?D.value:[D.value];for(let Z=0,te=O.length;Z<te;Z++){const q=O[Z],J=_(q),ne=M%E,pe=ne%J.boundary,ve=ne+pe;M+=pe,ve!==0&&E-ve<J.storage&&(M+=E-ve),D.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=M,M+=J.storage}}}const S=M%E;return S>0&&(M+=E-S),y.__size=M,y.__cache={},this}function _(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?vt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):vt("WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const M=r.indexOf(v.__bindingPointIndex);r.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:h,dispose:f}}const SM=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Qi=null;function TM(){return Qi===null&&(Qi=new K0(SM,32,32,Jh,ki),Qi.minFilter=oi,Qi.magFilter=oi,Qi.wrapS=is,Qi.wrapT=is,Qi.generateMipmaps=!1,Qi.needsUpdate=!0),Qi}class EM{constructor(e={}){const{canvas:t=rm(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;const x=new Set([Qh,jh,Kh]),_=new Set([Wi,ea,Dr,Ir,Yh,$h]),g=new Uint32Array(4),f=new Int32Array(4);let y=null,v=null;const M=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ss,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let C=!1;this._outputColorSpace=Pt;let A=0,w=0,b=null,P=-1,D=null;const O=new Kt,Z=new Kt;let te=null;const q=new rt(0);let J=0,ne=t.width,pe=t.height,ve=1,$e=null,I=null;const Ce=new Kt(0,0,ne,pe),be=new Kt(0,0,ne,pe);let Re=!1;const $=new rd;let K=!1,we=!1;const Pe=new bt,Oe=new L,nt=new Kt,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function Bt(){return b===null?ve:1}let B=i;function Tt(T,U){return t.getContext(T,U)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Hh}`),t.addEventListener("webglcontextlost",Te,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",Je,!1),B===null){const U="webgl2";if(B=Tt(U,T),B===null)throw Tt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw T("WebGLRenderer: "+T.message),T}let yt,Vt,Qe,qt,ot,Mt,F,R,j,ue,ge,re,et,Fe,it,Ye,_e,Le,ht,ct,Xe,ut,H,Ge;function ke(){yt=new F2(B),yt.init(),ut=new xM(B,yt),Vt=new T2(B,yt,e,ut),Qe=new pM(B,yt),Vt.reversedDepthBuffer&&m&&Qe.buffers.depth.setReversed(!0),qt=new N2(B),ot=new tM,Mt=new mM(B,yt,Qe,ot,Vt,ut,qt),F=new A2(S),R=new I2(S),j=new Vx(B),H=new w2(B,j),ue=new U2(B,j,qt,H),ge=new O2(B,ue,j,qt),ht=new k2(B,Vt,Mt),Ye=new E2(ot),re=new eM(S,F,R,yt,Vt,H,Ye),et=new bM(S,ot),Fe=new iM,it=new cM(yt),Le=new b2(S,F,R,Qe,ge,p,c),_e=new uM(S,ge,Vt),Ge=new wM(B,qt,Vt,Qe),ct=new S2(B,yt,qt),Xe=new z2(B,yt,qt),qt.programs=re.programs,S.capabilities=Vt,S.extensions=yt,S.properties=ot,S.renderLists=Fe,S.shadowMap=_e,S.state=Qe,S.info=qt}ke();const ze=new _M(S,B);this.xr=ze,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const T=yt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=yt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(T){T!==void 0&&(ve=T,this.setSize(ne,pe,!1))},this.getSize=function(T){return T.set(ne,pe)},this.setSize=function(T,U,G=!0){if(ze.isPresenting){vt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=T,pe=U,t.width=Math.floor(T*ve),t.height=Math.floor(U*ve),G===!0&&(t.style.width=T+"px",t.style.height=U+"px"),this.setViewport(0,0,T,U)},this.getDrawingBufferSize=function(T){return T.set(ne*ve,pe*ve).floor()},this.setDrawingBufferSize=function(T,U,G){ne=T,pe=U,ve=G,t.width=Math.floor(T*G),t.height=Math.floor(U*G),this.setViewport(0,0,T,U)},this.getCurrentViewport=function(T){return T.copy(O)},this.getViewport=function(T){return T.copy(Ce)},this.setViewport=function(T,U,G,X){T.isVector4?Ce.set(T.x,T.y,T.z,T.w):Ce.set(T,U,G,X),Qe.viewport(O.copy(Ce).multiplyScalar(ve).round())},this.getScissor=function(T){return T.copy(be)},this.setScissor=function(T,U,G,X){T.isVector4?be.set(T.x,T.y,T.z,T.w):be.set(T,U,G,X),Qe.scissor(Z.copy(be).multiplyScalar(ve).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(T){Qe.setScissorTest(Re=T)},this.setOpaqueSort=function(T){$e=T},this.setTransparentSort=function(T){I=T},this.getClearColor=function(T){return T.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(T=!0,U=!0,G=!0){let X=0;if(T){let V=!1;if(b!==null){const oe=b.texture.format;V=x.has(oe)}if(V){const oe=b.texture.type,ae=_.has(oe),Q=Le.getClearColor(),fe=Le.getClearAlpha(),De=Q.r,Ve=Q.g,Ie=Q.b;ae?(g[0]=De,g[1]=Ve,g[2]=Ie,g[3]=fe,B.clearBufferuiv(B.COLOR,0,g)):(f[0]=De,f[1]=Ve,f[2]=Ie,f[3]=fe,B.clearBufferiv(B.COLOR,0,f))}else X|=B.COLOR_BUFFER_BIT}U&&(X|=B.DEPTH_BUFFER_BIT),G&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Te,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",Je,!1),Le.dispose(),Fe.dispose(),it.dispose(),ot.dispose(),F.dispose(),R.dispose(),ge.dispose(),H.dispose(),Ge.dispose(),re.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",so),ze.removeEventListener("sessionend",er),Si.stop()};function Te(T){T.preventDefault(),ll("WebGLRenderer: Context Lost."),C=!0}function me(){ll("WebGLRenderer: Context Restored."),C=!1;const T=qt.autoReset,U=_e.enabled,G=_e.autoUpdate,X=_e.needsUpdate,V=_e.type;ke(),qt.autoReset=T,_e.enabled=U,_e.autoUpdate=G,_e.needsUpdate=X,_e.type=V}function Je(T){ln("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ft(T){const U=T.target;U.removeEventListener("dispose",ft),Wt(U)}function Wt(T){Nt(T),ot.remove(T)}function Nt(T){const U=ot.get(T).programs;U!==void 0&&(U.forEach(function(G){re.releaseProgram(G)}),T.isShaderMaterial&&re.releaseShaderCache(T))}this.renderBufferDirect=function(T,U,G,X,V,oe){U===null&&(U=Ht);const ae=V.isMesh&&V.matrixWorld.determinant()<0,Q=N(T,U,G,X,V);Qe.setMaterial(X,ae);let fe=G.index,De=1;if(X.wireframe===!0){if(fe=ue.getWireframeAttribute(G),fe===void 0)return;De=2}const Ve=G.drawRange,Ie=G.attributes.position;let Ne=Ve.start*De,pt=(Ve.start+Ve.count)*De;oe!==null&&(Ne=Math.max(Ne,oe.start*De),pt=Math.min(pt,(oe.start+oe.count)*De)),fe!==null?(Ne=Math.max(Ne,0),pt=Math.min(pt,fe.count)):Ie!=null&&(Ne=Math.max(Ne,0),pt=Math.min(pt,Ie.count));const At=pt-Ne;if(At<0||At===1/0)return;H.setup(V,X,Q,G,fe);let It,Ct=ct;if(fe!==null&&(It=j.get(fe),Ct=Xe,Ct.setIndex(It)),V.isMesh)X.wireframe===!0?(Qe.setLineWidth(X.wireframeLinewidth*Bt()),Ct.setMode(B.LINES)):Ct.setMode(B.TRIANGLES);else if(V.isLine){let Ze=X.linewidth;Ze===void 0&&(Ze=1),Qe.setLineWidth(Ze*Bt()),V.isLineSegments?Ct.setMode(B.LINES):V.isLineLoop?Ct.setMode(B.LINE_LOOP):Ct.setMode(B.LINE_STRIP)}else V.isPoints?Ct.setMode(B.POINTS):V.isSprite&&Ct.setMode(B.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)zr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ct.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(yt.get("WEBGL_multi_draw"))Ct.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Ze=V._multiDrawStarts,Ft=V._multiDrawCounts,xt=V._multiDrawCount,tn=fe?j.get(fe).bytesPerElement:1,Yi=ot.get(X).currentProgram.getUniforms();for(let an=0;an<xt;an++)Yi.setValue(B,"_gl_DrawID",an),Ct.render(Ze[an]/tn,Ft[an])}else if(V.isInstancedMesh)Ct.renderInstances(Ne,At,V.count);else if(G.isInstancedBufferGeometry){const Ze=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ft=Math.min(G.instanceCount,Ze);Ct.renderInstances(Ne,At,Ft)}else Ct.render(Ne,At)};function kn(T,U,G){T.transparent===!0&&T.side===wt&&T.forceSinglePass===!1?(T.side=Fn,T.needsUpdate=!0,xn(T,U,G),T.side=As,T.needsUpdate=!0,xn(T,U,G),T.side=wt):xn(T,U,G)}this.compile=function(T,U,G=null){G===null&&(G=T),v=it.get(G),v.init(U),E.push(v),G.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(v.pushLight(V),V.castShadow&&v.pushShadow(V))}),T!==G&&T.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(v.pushLight(V),V.castShadow&&v.pushShadow(V))}),v.setupLights();const X=new Set;return T.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const oe=V.material;if(oe)if(Array.isArray(oe))for(let ae=0;ae<oe.length;ae++){const Q=oe[ae];kn(Q,G,V),X.add(Q)}else kn(oe,G,V),X.add(oe)}),v=E.pop(),X},this.compileAsync=function(T,U,G=null){const X=this.compile(T,U,G);return new Promise(V=>{function oe(){if(X.forEach(function(ae){ot.get(ae).currentProgram.isReady()&&X.delete(ae)}),X.size===0){V(T);return}setTimeout(oe,10)}yt.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Cn=null;function hi(T){Cn&&Cn(T)}function so(){Si.stop()}function er(){Si.start()}const Si=new hf;Si.setAnimationLoop(hi),typeof self<"u"&&Si.setContext(self),this.setAnimationLoop=function(T){Cn=T,ze.setAnimationLoop(T),T===null?Si.stop():Si.start()},ze.addEventListener("sessionstart",so),ze.addEventListener("sessionend",er),this.render=function(T,U){if(U!==void 0&&U.isCamera!==!0){ln("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(U),U=ze.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,U,b),v=it.get(T,E.length),v.init(U),E.push(v),Pe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),$.setFromProjectionMatrix(Pe,Ui,U.reversedDepth),we=this.localClippingEnabled,K=Ye.init(this.clippingPlanes,we),y=Fe.get(T,M.length),y.init(),M.push(y),ze.enabled===!0&&ze.isPresenting===!0){const oe=S.xr.getDepthSensingMesh();oe!==null&&Ti(oe,U,-1/0,S.sortObjects)}Ti(T,U,0,S.sortObjects),y.finish(),S.sortObjects===!0&&y.sort($e,I),at=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,at&&Le.addToRenderList(y,T),this.info.render.frame++,K===!0&&Ye.beginShadows();const G=v.state.shadowsArray;_e.render(G,T,U),K===!0&&Ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=y.opaque,V=y.transmissive;if(v.setupLights(),U.isArrayCamera){const oe=U.cameras;if(V.length>0)for(let ae=0,Q=oe.length;ae<Q;ae++){const fe=oe[ae];tr(X,V,T,fe)}at&&Le.render(T);for(let ae=0,Q=oe.length;ae<Q;ae++){const fe=oe[ae];Ei(y,T,fe,fe.viewport)}}else V.length>0&&tr(X,V,T,U),at&&Le.render(T),Ei(y,T,U);b!==null&&w===0&&(Mt.updateMultisampleRenderTarget(b),Mt.updateRenderTargetMipmap(b)),T.isScene===!0&&T.onAfterRender(S,T,U),H.resetDefaultState(),P=-1,D=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&Ye.setGlobalState(S.clippingPlanes,v.state.camera)):v=null,M.pop(),M.length>0?y=M[M.length-1]:y=null};function Ti(T,U,G,X){if(T.visible===!1)return;if(T.layers.test(U.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(U);else if(T.isLight)v.pushLight(T),T.castShadow&&v.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||$.intersectsSprite(T)){X&&nt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Pe);const ae=ge.update(T),Q=T.material;Q.visible&&y.push(T,ae,Q,G,nt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||$.intersectsObject(T))){const ae=ge.update(T),Q=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),nt.copy(T.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),nt.copy(ae.boundingSphere.center)),nt.applyMatrix4(T.matrixWorld).applyMatrix4(Pe)),Array.isArray(Q)){const fe=ae.groups;for(let De=0,Ve=fe.length;De<Ve;De++){const Ie=fe[De],Ne=Q[Ie.materialIndex];Ne&&Ne.visible&&y.push(T,ae,Ne,G,nt.z,Ie)}}else Q.visible&&y.push(T,ae,Q,G,nt.z,null)}}const oe=T.children;for(let ae=0,Q=oe.length;ae<Q;ae++)Ti(oe[ae],U,G,X)}function Ei(T,U,G,X){const{opaque:V,transmissive:oe,transparent:ae}=T;v.setupLightsView(G),K===!0&&Ye.setGlobalState(S.clippingPlanes,G),X&&Qe.viewport(O.copy(X)),V.length>0&&ra(V,U,G),oe.length>0&&ra(oe,U,G),ae.length>0&&ra(ae,U,G),Qe.buffers.depth.setTest(!0),Qe.buffers.depth.setMask(!0),Qe.buffers.color.setMask(!0),Qe.setPolygonOffset(!1)}function tr(T,U,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new bi(1,1,{generateMipmaps:!0,type:yt.has("EXT_color_buffer_half_float")||yt.has("EXT_color_buffer_float")?ki:Wi,minFilter:Xs,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:kt.workingColorSpace}));const oe=v.state.transmissionRenderTarget[X.id],ae=X.viewport||O;oe.setSize(ae.z*S.transmissionResolutionScale,ae.w*S.transmissionResolutionScale);const Q=S.getRenderTarget(),fe=S.getActiveCubeFace(),De=S.getActiveMipmapLevel();S.setRenderTarget(oe),S.getClearColor(q),J=S.getClearAlpha(),J<1&&S.setClearColor(16777215,.5),S.clear(),at&&Le.render(G);const Ve=S.toneMapping;S.toneMapping=Ss;const Ie=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),K===!0&&Ye.setGlobalState(S.clippingPlanes,X),ra(T,G,X),Mt.updateMultisampleRenderTarget(oe),Mt.updateRenderTargetMipmap(oe),yt.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let pt=0,At=U.length;pt<At;pt++){const It=U[pt],{object:Ct,geometry:Ze,material:Ft,group:xt}=It;if(Ft.side===wt&&Ct.layers.test(X.layers)){const tn=Ft.side;Ft.side=Fn,Ft.needsUpdate=!0,ao(Ct,G,X,Ze,Ft,xt),Ft.side=tn,Ft.needsUpdate=!0,Ne=!0}}Ne===!0&&(Mt.updateMultisampleRenderTarget(oe),Mt.updateRenderTargetMipmap(oe))}S.setRenderTarget(Q,fe,De),S.setClearColor(q,J),Ie!==void 0&&(X.viewport=Ie),S.toneMapping=Ve}function ra(T,U,G){const X=U.isScene===!0?U.overrideMaterial:null;for(let V=0,oe=T.length;V<oe;V++){const ae=T[V],{object:Q,geometry:fe,group:De}=ae;let Ve=ae.material;Ve.allowOverride===!0&&X!==null&&(Ve=X),Q.layers.test(G.layers)&&ao(Q,U,G,fe,Ve,De)}}function ao(T,U,G,X,V,oe){T.onBeforeRender(S,U,G,X,V,oe),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),V.onBeforeRender(S,U,G,X,T,oe),V.transparent===!0&&V.side===wt&&V.forceSinglePass===!1?(V.side=Fn,V.needsUpdate=!0,S.renderBufferDirect(G,U,X,V,T,oe),V.side=As,V.needsUpdate=!0,S.renderBufferDirect(G,U,X,V,T,oe),V.side=wt):S.renderBufferDirect(G,U,X,V,T,oe),T.onAfterRender(S,U,G,X,V,oe)}function xn(T,U,G){U.isScene!==!0&&(U=Ht);const X=ot.get(T),V=v.state.lights,oe=v.state.shadowsArray,ae=V.state.version,Q=re.getParameters(T,V.state,oe,U,G),fe=re.getProgramCacheKey(Q);let De=X.programs;X.environment=T.isMeshStandardMaterial?U.environment:null,X.fog=U.fog,X.envMap=(T.isMeshStandardMaterial?R:F).get(T.envMap||X.environment),X.envMapRotation=X.environment!==null&&T.envMap===null?U.environmentRotation:T.envMapRotation,De===void 0&&(T.addEventListener("dispose",ft),De=new Map,X.programs=De);let Ve=De.get(fe);if(Ve!==void 0){if(X.currentProgram===Ve&&X.lightsStateVersion===ae)return nr(T,Q),Ve}else Q.uniforms=re.getUniforms(T),T.onBeforeCompile(Q,S),Ve=re.acquireProgram(Q,fe),De.set(fe,Ve),X.uniforms=Q.uniforms;const Ie=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ie.clippingPlanes=Ye.uniform),nr(T,Q),X.needsLights=Y(T),X.lightsStateVersion=ae,X.needsLights&&(Ie.ambientLightColor.value=V.state.ambient,Ie.lightProbe.value=V.state.probe,Ie.directionalLights.value=V.state.directional,Ie.directionalLightShadows.value=V.state.directionalShadow,Ie.spotLights.value=V.state.spot,Ie.spotLightShadows.value=V.state.spotShadow,Ie.rectAreaLights.value=V.state.rectArea,Ie.ltc_1.value=V.state.rectAreaLTC1,Ie.ltc_2.value=V.state.rectAreaLTC2,Ie.pointLights.value=V.state.point,Ie.pointLightShadows.value=V.state.pointShadow,Ie.hemisphereLights.value=V.state.hemi,Ie.directionalShadowMap.value=V.state.directionalShadowMap,Ie.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ie.spotShadowMap.value=V.state.spotShadowMap,Ie.spotLightMatrix.value=V.state.spotLightMatrix,Ie.spotLightMap.value=V.state.spotLightMap,Ie.pointShadowMap.value=V.state.pointShadowMap,Ie.pointShadowMatrix.value=V.state.pointShadowMatrix),X.currentProgram=Ve,X.uniformsList=null,Ve}function ro(T){if(T.uniformsList===null){const U=T.currentProgram.getUniforms();T.uniformsList=el.seqWithValue(U.seq,T.uniforms)}return T.uniformsList}function nr(T,U){const G=ot.get(T);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function N(T,U,G,X,V){U.isScene!==!0&&(U=Ht),Mt.resetTextureUnits();const oe=U.fog,ae=X.isMeshStandardMaterial?U.environment:null,Q=b===null?S.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Ha,fe=(X.isMeshStandardMaterial?R:F).get(X.envMap||ae),De=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ie=!!G.morphAttributes.position,Ne=!!G.morphAttributes.normal,pt=!!G.morphAttributes.color;let At=Ss;X.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(At=S.toneMapping);const It=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ct=It!==void 0?It.length:0,Ze=ot.get(X),Ft=v.state.lights;if(K===!0&&(we===!0||T!==D)){const On=T===D&&X.id===P;Ye.setState(X,T,On)}let xt=!1;X.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==Ft.state.version||Ze.outputColorSpace!==Q||V.isBatchedMesh&&Ze.batching===!1||!V.isBatchedMesh&&Ze.batching===!0||V.isBatchedMesh&&Ze.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Ze.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Ze.instancing===!1||!V.isInstancedMesh&&Ze.instancing===!0||V.isSkinnedMesh&&Ze.skinning===!1||!V.isSkinnedMesh&&Ze.skinning===!0||V.isInstancedMesh&&Ze.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ze.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ze.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ze.instancingMorph===!1&&V.morphTexture!==null||Ze.envMap!==fe||X.fog===!0&&Ze.fog!==oe||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==Ye.numPlanes||Ze.numIntersection!==Ye.numIntersection)||Ze.vertexAlphas!==De||Ze.vertexTangents!==Ve||Ze.morphTargets!==Ie||Ze.morphNormals!==Ne||Ze.morphColors!==pt||Ze.toneMapping!==At||Ze.morphTargetsCount!==Ct)&&(xt=!0):(xt=!0,Ze.__version=X.version);let tn=Ze.currentProgram;xt===!0&&(tn=xn(X,U,V));let Yi=!1,an=!1,ei=!1;const Yt=tn.getUniforms(),gn=Ze.uniforms;if(Qe.useProgram(tn.program)&&(Yi=!0,an=!0,ei=!0),X.id!==P&&(P=X.id,an=!0),Yi||D!==T){Qe.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Yt.setValue(B,"projectionMatrix",T.projectionMatrix),Yt.setValue(B,"viewMatrix",T.matrixWorldInverse);const Xn=Yt.map.cameraPosition;Xn!==void 0&&Xn.setValue(B,Oe.setFromMatrixPosition(T.matrixWorld)),Vt.logarithmicDepthBuffer&&Yt.setValue(B,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Yt.setValue(B,"isOrthographic",T.isOrthographicCamera===!0),D!==T&&(D=T,an=!0,ei=!0)}if(V.isSkinnedMesh){Yt.setOptional(B,V,"bindMatrix"),Yt.setOptional(B,V,"bindMatrixInverse");const On=V.skeleton;On&&(On.boneTexture===null&&On.computeBoneTexture(),Yt.setValue(B,"boneTexture",On.boneTexture,Mt))}V.isBatchedMesh&&(Yt.setOptional(B,V,"batchingTexture"),Yt.setValue(B,"batchingTexture",V._matricesTexture,Mt),Yt.setOptional(B,V,"batchingIdTexture"),Yt.setValue(B,"batchingIdTexture",V._indirectTexture,Mt),Yt.setOptional(B,V,"batchingColorTexture"),V._colorsTexture!==null&&Yt.setValue(B,"batchingColorTexture",V._colorsTexture,Mt));const ti=G.morphAttributes;if((ti.position!==void 0||ti.normal!==void 0||ti.color!==void 0)&&ht.update(V,G,tn),(an||Ze.receiveShadow!==V.receiveShadow)&&(Ze.receiveShadow=V.receiveShadow,Yt.setValue(B,"receiveShadow",V.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(gn.envMap.value=fe,gn.flipEnvMap.value=fe.isCubeTexture&&fe.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&U.environment!==null&&(gn.envMapIntensity.value=U.environmentIntensity),gn.dfgLUT!==void 0&&(gn.dfgLUT.value=TM()),an&&(Yt.setValue(B,"toneMappingExposure",S.toneMappingExposure),Ze.needsLights&&k(gn,ei),oe&&X.fog===!0&&et.refreshFogUniforms(gn,oe),et.refreshMaterialUniforms(gn,X,ve,pe,v.state.transmissionRenderTarget[T.id]),el.upload(B,ro(Ze),gn,Mt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(el.upload(B,ro(Ze),gn,Mt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Yt.setValue(B,"center",V.center),Yt.setValue(B,"modelViewMatrix",V.modelViewMatrix),Yt.setValue(B,"normalMatrix",V.normalMatrix),Yt.setValue(B,"modelMatrix",V.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const On=X.uniformsGroups;for(let Xn=0,Ol=On.length;Xn<Ol;Xn++){const Ds=On[Xn];Ge.update(Ds,tn),Ge.bind(Ds,tn)}}return tn}function k(T,U){T.ambientLightColor.needsUpdate=U,T.lightProbe.needsUpdate=U,T.directionalLights.needsUpdate=U,T.directionalLightShadows.needsUpdate=U,T.pointLights.needsUpdate=U,T.pointLightShadows.needsUpdate=U,T.spotLights.needsUpdate=U,T.spotLightShadows.needsUpdate=U,T.rectAreaLights.needsUpdate=U,T.hemisphereLights.needsUpdate=U}function Y(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(T,U,G){const X=ot.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ot.get(T.texture).__webglTexture=U,ot.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:G,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,U){const G=ot.get(T);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0};const ee=B.createFramebuffer();this.setRenderTarget=function(T,U=0,G=0){b=T,A=U,w=G;let X=!0,V=null,oe=!1,ae=!1;if(T){const fe=ot.get(T);if(fe.__useDefaultFramebuffer!==void 0)Qe.bindFramebuffer(B.FRAMEBUFFER,null),X=!1;else if(fe.__webglFramebuffer===void 0)Mt.setupRenderTarget(T);else if(fe.__hasExternalTextures)Mt.rebindTextures(T,ot.get(T.texture).__webglTexture,ot.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ie=T.depthTexture;if(fe.__boundDepthTexture!==Ie){if(Ie!==null&&ot.has(Ie)&&(T.width!==Ie.image.width||T.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Mt.setupDepthRenderbuffer(T)}}const De=T.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(ae=!0);const Ve=ot.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ve[U])?V=Ve[U][G]:V=Ve[U],oe=!0):T.samples>0&&Mt.useMultisampledRTT(T)===!1?V=ot.get(T).__webglMultisampledFramebuffer:Array.isArray(Ve)?V=Ve[G]:V=Ve,O.copy(T.viewport),Z.copy(T.scissor),te=T.scissorTest}else O.copy(Ce).multiplyScalar(ve).floor(),Z.copy(be).multiplyScalar(ve).floor(),te=Re;if(G!==0&&(V=ee),Qe.bindFramebuffer(B.FRAMEBUFFER,V)&&X&&Qe.drawBuffers(T,V),Qe.viewport(O),Qe.scissor(Z),Qe.setScissorTest(te),oe){const fe=ot.get(T.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,G)}else if(ae){const fe=U;for(let De=0;De<T.textures.length;De++){const Ve=ot.get(T.textures[De]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+De,Ve.__webglTexture,G,fe)}}else if(T!==null&&G!==0){const fe=ot.get(T.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,fe.__webglTexture,G)}P=-1},this.readRenderTargetPixels=function(T,U,G,X,V,oe,ae,Q=0){if(!(T&&T.isWebGLRenderTarget)){ln("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe){Qe.bindFramebuffer(B.FRAMEBUFFER,fe);try{const De=T.textures[Q],Ve=De.format,Ie=De.type;if(!Vt.textureFormatReadable(Ve)){ln("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Vt.textureTypeReadable(Ie)){ln("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=T.width-X&&G>=0&&G<=T.height-V&&(T.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Q),B.readPixels(U,G,X,V,ut.convert(Ve),ut.convert(Ie),oe))}finally{const De=b!==null?ot.get(b).__webglFramebuffer:null;Qe.bindFramebuffer(B.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(T,U,G,X,V,oe,ae,Q=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe)if(U>=0&&U<=T.width-X&&G>=0&&G<=T.height-V){Qe.bindFramebuffer(B.FRAMEBUFFER,fe);const De=T.textures[Q],Ve=De.format,Ie=De.type;if(!Vt.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Vt.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ne),B.bufferData(B.PIXEL_PACK_BUFFER,oe.byteLength,B.STREAM_READ),T.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Q),B.readPixels(U,G,X,V,ut.convert(Ve),ut.convert(Ie),0);const pt=b!==null?ot.get(b).__webglFramebuffer:null;Qe.bindFramebuffer(B.FRAMEBUFFER,pt);const At=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await om(B,At,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ne),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,oe),B.deleteBuffer(Ne),B.deleteSync(At),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,U=null,G=0){const X=Math.pow(2,-G),V=Math.floor(T.image.width*X),oe=Math.floor(T.image.height*X),ae=U!==null?U.x:0,Q=U!==null?U.y:0;Mt.setTexture2D(T,0),B.copyTexSubImage2D(B.TEXTURE_2D,G,0,0,ae,Q,V,oe),Qe.unbindTexture()};const ie=B.createFramebuffer(),he=B.createFramebuffer();this.copyTextureToTexture=function(T,U,G=null,X=null,V=0,oe=null){oe===null&&(V!==0?(zr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=V,V=0):oe=0);let ae,Q,fe,De,Ve,Ie,Ne,pt,At;const It=T.isCompressedTexture?T.mipmaps[oe]:T.image;if(G!==null)ae=G.max.x-G.min.x,Q=G.max.y-G.min.y,fe=G.isBox3?G.max.z-G.min.z:1,De=G.min.x,Ve=G.min.y,Ie=G.isBox3?G.min.z:0;else{const ti=Math.pow(2,-V);ae=Math.floor(It.width*ti),Q=Math.floor(It.height*ti),T.isDataArrayTexture?fe=It.depth:T.isData3DTexture?fe=Math.floor(It.depth*ti):fe=1,De=0,Ve=0,Ie=0}X!==null?(Ne=X.x,pt=X.y,At=X.z):(Ne=0,pt=0,At=0);const Ct=ut.convert(U.format),Ze=ut.convert(U.type);let Ft;U.isData3DTexture?(Mt.setTexture3D(U,0),Ft=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Mt.setTexture2DArray(U,0),Ft=B.TEXTURE_2D_ARRAY):(Mt.setTexture2D(U,0),Ft=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);const xt=B.getParameter(B.UNPACK_ROW_LENGTH),tn=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Yi=B.getParameter(B.UNPACK_SKIP_PIXELS),an=B.getParameter(B.UNPACK_SKIP_ROWS),ei=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,It.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,It.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,De),B.pixelStorei(B.UNPACK_SKIP_ROWS,Ve),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Ie);const Yt=T.isDataArrayTexture||T.isData3DTexture,gn=U.isDataArrayTexture||U.isData3DTexture;if(T.isDepthTexture){const ti=ot.get(T),On=ot.get(U),Xn=ot.get(ti.__renderTarget),Ol=ot.get(On.__renderTarget);Qe.bindFramebuffer(B.READ_FRAMEBUFFER,Xn.__webglFramebuffer),Qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,Ol.__webglFramebuffer);for(let Ds=0;Ds<fe;Ds++)Yt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ot.get(T).__webglTexture,V,Ie+Ds),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ot.get(U).__webglTexture,oe,At+Ds)),B.blitFramebuffer(De,Ve,ae,Q,Ne,pt,ae,Q,B.DEPTH_BUFFER_BIT,B.NEAREST);Qe.bindFramebuffer(B.READ_FRAMEBUFFER,null),Qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(V!==0||T.isRenderTargetTexture||ot.has(T)){const ti=ot.get(T),On=ot.get(U);Qe.bindFramebuffer(B.READ_FRAMEBUFFER,ie),Qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,he);for(let Xn=0;Xn<fe;Xn++)Yt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ti.__webglTexture,V,Ie+Xn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ti.__webglTexture,V),gn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,On.__webglTexture,oe,At+Xn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,On.__webglTexture,oe),V!==0?B.blitFramebuffer(De,Ve,ae,Q,Ne,pt,ae,Q,B.COLOR_BUFFER_BIT,B.NEAREST):gn?B.copyTexSubImage3D(Ft,oe,Ne,pt,At+Xn,De,Ve,ae,Q):B.copyTexSubImage2D(Ft,oe,Ne,pt,De,Ve,ae,Q);Qe.bindFramebuffer(B.READ_FRAMEBUFFER,null),Qe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else gn?T.isDataTexture||T.isData3DTexture?B.texSubImage3D(Ft,oe,Ne,pt,At,ae,Q,fe,Ct,Ze,It.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(Ft,oe,Ne,pt,At,ae,Q,fe,Ct,It.data):B.texSubImage3D(Ft,oe,Ne,pt,At,ae,Q,fe,Ct,Ze,It):T.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,oe,Ne,pt,ae,Q,Ct,Ze,It.data):T.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,oe,Ne,pt,It.width,It.height,Ct,It.data):B.texSubImage2D(B.TEXTURE_2D,oe,Ne,pt,ae,Q,Ct,Ze,It);B.pixelStorei(B.UNPACK_ROW_LENGTH,xt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,tn),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Yi),B.pixelStorei(B.UNPACK_SKIP_ROWS,an),B.pixelStorei(B.UNPACK_SKIP_IMAGES,ei),oe===0&&U.generateMipmaps&&B.generateMipmap(Ft),Qe.unbindTexture()},this.initRenderTarget=function(T){ot.get(T).__webglFramebuffer===void 0&&Mt.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Mt.setTextureCube(T,0):T.isData3DTexture?Mt.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Mt.setTexture2DArray(T,0):Mt.setTexture2D(T,0),Qe.unbindTexture()},this.resetState=function(){A=0,w=0,b=null,Qe.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=kt._getDrawingBufferColorSpace(e),t.unpackColorSpace=kt._getUnpackColorSpace()}}function Dn(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),a={},r={},o=n[0].morphTargetsRelative,c=new jt;let h=0;for(let d=0;d<n.length;++d){const u=n[d];let m=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.attributes[p]),m++}if(m!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,d),h+=p}}if(t){let d=0;const u=[];for(let m=0;m<n.length;++m){const p=n[m].index;for(let x=0;x<p.count;++x)u.push(p.getX(x)+d);d+=n[m].attributes.position.count}c.setIndex(u)}for(const d in a){const u=Ku(a[d]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,u)}for(const d in r){const u=r[d][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let m=0;m<u;++m){const p=[];for(let _=0;_<r[d].length;++_)p.push(r[d][_][m]);const x=Ku(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(x)}}return c}function Ku(n){let e,t,i,s=-1,a=0;for(let h=0;h<n.length;++h){const d=n[h];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=d.itemSize),t!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=d.normalized),i!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=d.count*t}const r=new e(a),o=new jn(r,t,i);let c=0;for(let h=0;h<n.length;++h){const d=n[h];if(d.isInterleavedBufferAttribute){const u=c/t;for(let m=0,p=d.count;m<p;m++)for(let x=0;x<t;x++){const _=d.getComponent(m,x);o.setComponent(m+u,x,_)}}else r.set(d.array,c);c+=d.count*t}return s!==void 0&&(o.gpuType=s),o}class AM extends $0{constructor(){super();const e=new le;e.deleteAttribute("uv");const t=new W({side:Fn}),i=new W,s=new fd(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new z(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new nn(e,i,6),o=new zt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const c=new z(e,Ea(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const h=new z(e,Ea(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const d=new z(e,Ea(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new z(e,Ea(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const m=new z(e,Ea(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const p=new z(e,Ea(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ea(n){return new Dx({color:0,emissive:16777215,emissiveIntensity:n})}const tl={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ja{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const CM=new pd(-1,1,1,-1,0,1);class RM extends jt{constructor(){super(),this.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new St([0,2,0,0,2,0],2))}}const PM=new RM;class md{constructor(e){this._mesh=new z(PM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,CM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class mf extends Ja{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Tn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=kr.clone(e.uniforms),this.material=new Tn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new md(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Ju extends Ja{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class LM extends Ja{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class DM{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Ue);this._width=i.width,this._height=i.height,t=new bi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ki}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new mf(tl),this.copyPass.material.blending=Ni,this.clock=new cf}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,a=this.passes.length;s<a;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Ju!==void 0&&(r instanceof Ju?i=!0:r instanceof LM&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class IM extends Ja{constructor(e,t,i=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new rt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const No={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class FM extends Ja{constructor(){super(),this.uniforms=kr.clone(No.uniforms),this.material=new Lx({name:No.name,uniforms:this.uniforms,vertexShader:No.vertexShader,fragmentShader:No.fragmentShader}),this._fsQuad=new md(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},kt.getTransfer(this._outputColorSpace)===$t&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===E0?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===A0?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===C0?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Xh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===P0?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===L0?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===R0&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const UM={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new rt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class qa extends Ja{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ue(e.x,e.y):new Ue(256,256),this.clearColor=new rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new bi(a,r,{type:ki}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new bi(a,r,{type:ki});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const m=new bi(a,r,{type:ki});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),a=Math.round(a/2),r=Math.round(r/2)}const o=UM;this.highPassUniforms=kr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Tn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ue(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=kr.clone(tl.uniforms),this.blendMaterial=new Tn({uniforms:this.copyUniforms,vertexShader:tl.vertexShader,fragmentShader:tl.fragmentShader,blending:ri,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new rt,this._oldClearAlpha=1,this._basic=new Et,this._fsQuad=new md(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new Ue(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=qa.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=qa.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new Tn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ue(.5,.5)},direction:{value:new Ue(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new Tn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}qa.BlurDirectionX=new Ue(1,0);qa.BlurDirectionY=new Ue(0,1);const Jr=document.querySelector("#game"),rn=new EM({canvas:Jr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),ja=(window.matchMedia?.("(pointer: coarse)").matches??!1)||window.innerWidth<720;rn.setPixelRatio(Math.min(window.devicePixelRatio,ja?1.5:2));rn.setSize(window.innerWidth,window.innerHeight);rn.shadowMap.enabled=!ja;rn.info.autoReset=!1;rn.shadowMap.type=T0;rn.outputColorSpace=Pt;rn.toneMapping=Xh;rn.toneMappingExposure=1.12;const Se=new $0;window.__steelRibbonScene=Se;Se.background=new rt(16764588);Se.fog=new ad(14719602,360,2150);const xf=new Th(rn);xf.compileEquirectangularShader();Se.environment=xf.fromScene(new AM,.04).texture;Se.environmentIntensity=.58;const ye=new Zn(69,window.innerWidth/window.innerHeight,.08,1800);Se.add(ye);const qe={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const je=new Set,Ee={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},zM=new cf,sn=new L(0,1,0),xd=new L,gd=new L,Il=new L,on=new zt,gf=.86,Ah=1.2,NM=.78,zn=.55,Be={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},na=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],vf=Math.max(...na.map(n=>n.width));let Ts=0,se=na[0];const l={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new L,best:Number(localStorage.getItem("steel-ribbon-best")||0)};qe.best.textContent=`Best score ${l.best}`;let yi=localStorage.getItem("steel-ribbon-view")==="cockpit"?"cockpit":"chase";function qi(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result";document.body.classList.toggle("chase-mode",n&&yi==="chase"),document.body.classList.toggle("menu-mode",l.mode==="menu")}qi();function kM(){yi=yi==="chase"?"cockpit":"chase",localStorage.setItem("steel-ribbon-view",yi),qi(),l.message=yi==="chase"?"Chase camera":"Cockpit camera",l.messageTimer=.9}const ko=[];function Bi(n,e=!1){let t=ko.find(s=>!s.busy);t||(ko.length>=4?t=ko[0]:(t={node:document.createElement("div"),busy:!1,t:null},t.node.className="score-pop",document.body.appendChild(t.node),ko.push(t)));const i=t.node;i.classList.toggle("gold",e),i.textContent=n,i.style.left=`calc(50% + ${Math.random()*90-45|0}px)`,i.style.top=`${33+Math.random()*9}%`,i.classList.remove("pop"),i.offsetWidth,i.classList.add("pop"),t.busy=!0,clearTimeout(t.t),t.t=setTimeout(()=>t.busy=!1,1e3)}function En(n=880,e=.16,t="triangle",i=.16){if(!Ae)return;const{ctx:s}=Ae,a=s.createOscillator(),r=s.createGain();a.type=t,a.frequency.setValueAtTime(n,s.currentTime),a.frequency.exponentialRampToValueAtTime(n*1.5,s.currentTime+e),r.gain.setValueAtTime(i,s.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+e+.05),a.connect(r).connect(Ae.master||s.destination),a.start(),a.stop(s.currentTime+e+.06)}let ju=0;function OM(){if(!Ae||Ae.ctx.currentTime-ju<.45)return;ju=Ae.ctx.currentTime;const{ctx:n}=Ae,e=[352,396,440][Math.random()*3|0];for(const[t,i]of[[0,.14],[.2,.22]]){const s=n.createOscillator(),a=n.createOscillator(),r=n.createGain(),o=n.currentTime+t;s.type="square",a.type="square",s.frequency.value=e,a.frequency.value=e*1.26,r.gain.setValueAtTime(1e-4,o),r.gain.linearRampToValueAtTime(.05,o+.015),r.gain.setValueAtTime(.05,o+i),r.gain.exponentialRampToValueAtTime(1e-4,o+i+.04),s.connect(r),a.connect(r),r.connect(Ae.master),s.start(o),a.start(o),s.stop(o+i+.05),a.stop(o+i+.05)}}function BM(n){const e=xe.clamp(n,0,1);return e*e*(3-2*e)}function VM(n,e){let t=0;for(const i of n.gaps){const s=i.start-i.approach,a=i.start+i.carry,r=i.end+i.settle;e>=s&&e<=a?t+=i.rise*xe.clamp((e-s)/(i.approach+i.carry),0,1):e>a&&e<=i.end?t+=i.rise:e>i.end&&e<=r&&(t+=i.rise*(1-BM((e-i.end)/i.settle)))}return t}function vd(n,e){const t=(e%n.length+n.length)%n.length,i=t/n.length*Math.PI*2,s=n.shape,a=Math.sin(i)*s.x1+Math.sin(i*2)*s.x2+Math.cos(i*3)*s.x3,r=Math.cos(i)*s.z1+Math.cos(i*2)*s.z2+Math.sin(i*3)*s.z3;return{x:a,z:r,t:i,n:t}}function Mf(n,e){const{t,n:i}=vd(n,e),s=n.shape;let a=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const r of n.ramps){let o=i-r.s;o>n.length/2&&(o-=n.length),o<-n.length/2&&(o+=n.length),a+=r.amp*Math.exp(-(o*o)/(r.width*r.width))}return a+=VM(n,i),a}function Oo(n){const{x:e,z:t,n:i}=vd(se,n),s=Mf(se,i);return new L(e,s,t)}function mt(n){const e=(n%se.length+se.length)%se.length,t=Oo(e),i=Oo(e+2).sub(t).normalize(),s=xd.crossVectors(sn,i).normalize(),a=Oo(e-2).y,r=Oo(e+2).y,o=Math.atan2(r-a,4),c=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,h=se.gaps.find(d=>e>d.start&&e<d.end);return{s:e,p:t,tangent:i,side:s.clone(),grade:o,bank:c,gap:h}}function Vi(n){const e=(n%se.length+se.length)%se.length;return se.gaps.some(t=>e>t.start&&e<t.end)}function Qu(n){return xe.clamp(n/(se.length*se.laps),0,1)}function bc(n,e,t){const i=Math.floor(n/se.length),s=Math.floor(e/se.length);for(let a=i;a<=s;a++){const r=a*se.length+t;if(n<r&&e>=r)return!0}return!1}function GM(n=256,e=8){const t=document.createElement("canvas");t.width=n,t.height=n;const i=t.getContext("2d"),s=n/e;for(let r=0;r<e;r++)for(let o=0;o<e;o++)i.fillStyle=(o+r)%2?"#101318":"#f5f1df",i.fillRect(o*s,r*s,s,s);const a=new Qt(t);return a.colorSpace=Pt,a.wrapS=Nn,a.wrapT=Nn,a.repeat.set(3,1),a}function HM(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,0);i.addColorStop(0,"#9c9b77"),i.addColorStop(.18,"#c9c69a"),i.addColorStop(.5,"#9f9f79"),i.addColorStop(.82,"#c0bd91"),i.addColorStop(1,"#858563"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let a=0;a<n;a+=64)t.beginPath(),t.moveTo(0,a+2),t.lineTo(n,a+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const a of[48,464])t.beginPath(),t.moveTo(a,0),t.lineTo(a,n),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let a=0;a<42;a++){const r=n*(.28+Math.random()*.44),o=Math.random()*n;t.beginPath(),t.moveTo(r,o),t.bezierCurveTo(r+Math.random()*22-11,o+36,r+Math.random()*22-11,o+82,r+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let a=0;a<36;a++)t.beginPath(),t.ellipse(Math.random()*n,Math.random()*n,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let a=0;a<2200;a++){const r=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${r}, ${r}, ${r-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new Qt(e);return s.colorSpace=Pt,s.wrapS=Nn,s.wrapT=Nn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),s}function WM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2e6a40"),i.addColorStop(.42,"#487443"),i.addColorStop(1,"#1f4a37"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<120;a++){const r=Math.random()*n,o=Math.random()*n,c=30+Math.random()*120,h=t.createRadialGradient(r,o,0,r,o,c),d=Math.random()<.4;h.addColorStop(0,d?`rgba(140, 150, 70, ${.06+Math.random()*.1})`:`rgba(30, 90, 52, ${.08+Math.random()*.12})`),h.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=h,t.beginPath(),t.arc(r,o,c,0,Math.PI*2),t.fill()}for(let a=0;a<9e3;a++){const r=.03+Math.random()*.09,o=82+Math.floor(Math.random()*80);t.fillStyle=`rgba(${34+Math.random()*34}, ${o}, ${36+Math.random()*30}, ${r})`,t.fillRect(Math.random()*n,Math.random()*n,1,1+Math.random()*3)}t.strokeStyle="rgba(214, 224, 150, 0.06)",t.lineWidth=2;for(let a=-n;a<n*1.5;a+=76)t.beginPath(),t.moveTo(a,0),t.lineTo(a+n*.65,n),t.stroke();const s=new Qt(e);return s.colorSpace=Pt,s.wrapS=Nn,s.wrapT=Nn,s.repeat.set(18,18),s.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),s}function XM(n=1024){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#2c2d31"),i.addColorStop(.5,"#35363a"),i.addColorStop(1,"#28292d"),t.fillStyle=i,t.fillRect(0,0,n,n);for(let a=0;a<26e3;a++){const r=Math.random()<.48;t.fillStyle=r?`rgba(232, 224, 210, ${.025+Math.random()*.05})`:`rgba(0, 0, 0, ${.035+Math.random()*.06})`,t.fillRect(Math.random()*n,Math.random()*n,Math.random()<.12?2:1,1)}t.strokeStyle="rgba(12, 12, 14, 0.32)",t.lineWidth=1.3;for(let a=0;a<24;a++){let r=Math.random()*n,o=Math.random()*n;t.beginPath(),t.moveTo(r,o);for(let c=0;c<7;c++)r+=(Math.random()-.5)*64,o+=Math.random()*46,t.lineTo(r,o);t.stroke()}const s=new Qt(e);return s.colorSpace=Pt,s.wrapS=Nn,s.wrapT=Nn,s.repeat.set(9,16),s.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),s}function qM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);i.addColorStop(0,"rgba(255, 255, 238, 1)"),i.addColorStop(.12,"rgba(255, 239, 178, 0.92)"),i.addColorStop(.35,"rgba(255, 191, 92, 0.36)"),i.addColorStop(.72,"rgba(255, 169, 72, 0.10)"),i.addColorStop(1,"rgba(255, 169, 72, 0)"),t.fillStyle=i,t.fillRect(0,0,n,n);const s=new Qt(e);return s.colorSpace=Pt,s}function Ca(n=128,e=256,t=.42){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,n,e);for(let r=10;r<e-8;r+=18)for(let o=9;o<n-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,r,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let r=0;r<n;r+=15)s.beginPath(),s.moveTo(r+3,0),s.lineTo(r+3,e),s.stroke();const a=new Qt(i);return a.colorSpace=Pt,a}function YM(n=256,e=256,t="#d9d0bd"){const i=document.createElement("canvas");i.width=n,i.height=e;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,n,e);a.addColorStop(0,t),a.addColorStop(.58,"#f0e5d2"),a.addColorStop(1,"#b9b0a1"),s.fillStyle=a,s.fillRect(0,0,n,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const h=180+Math.random()*60;s.fillStyle=`rgba(${h}, ${h}, ${h-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*n,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,n,e*.2);const r=(c,h,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,h,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,h,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,h+2),s.lineTo(c+d*.5,h+u-2),s.moveTo(c+2,h+u*.52),s.lineTo(c+d-2,h+u*.52),s.stroke()};r(n*.12,e*.24,n*.19,e*.2),r(n*.68,e*.25,n*.2,e*.2),r(n*.43,e*.5,n*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(n*.43,e*.62,n*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(n*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new Qt(i);return o.colorSpace=Pt,o.wrapS=Nn,o.wrapT=Nn,o.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),o}function $M(n=512){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,n,n);i.addColorStop(0,"#e77b36"),i.addColorStop(.45,"#a63f24"),i.addColorStop(1,"#6b271d"),t.fillStyle=i,t.fillRect(0,0,n,n),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let a=-20;a<n+20;a+=26){t.beginPath();for(let r=-10;r<n+10;r+=12){const o=a+Math.sin((r+a)*.045)*3;r===-10?t.moveTo(r,o):t.lineTo(r,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let a=0;a<n;a+=20)t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+8,n*.24,a-8,n*.58,a+7,n),t.stroke();for(let a=0;a<1400;a++){const r=112+Math.random()*110;t.fillStyle=`rgba(${r}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*n,Math.random()*n,1+Math.random()*2,1+Math.random()*2)}const s=new Qt(e);return s.colorSpace=Pt,s.wrapS=Nn,s.wrapT=Nn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),s}function ZM(n=256,e=160){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d"),s=i.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),i.fillStyle=s,i.fillRect(0,0,n,e),i.strokeStyle="rgba(210, 225, 232, 0.18)",i.lineWidth=3;for(let r=18;r<e;r+=24)i.beginPath(),i.moveTo(8,r),i.lineTo(n-8,r),i.stroke();i.strokeStyle="rgba(8, 10, 12, 0.72)",i.lineWidth=8,i.strokeRect(4,4,n-8,e-8);const a=new Qt(t);return a.colorSpace=Pt,a}function e0(n,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",i=!0){const s=document.createElement("canvas");s.width=i?128:384,s.height=i?384:128;const a=s.getContext("2d"),{width:r,height:o}=s;a.fillStyle=t,a.fillRect(0,0,r,o),a.strokeStyle=e,a.lineWidth=i?5:6,a.strokeRect(8,8,r-16,o-16),a.save(),a.translate(r/2,o/2),i&&a.rotate(-Math.PI/2),a.font=`900 ${i?54:48}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=e,a.shadowBlur=18,a.fillStyle=e,a.fillText(n,0,0),a.restore();const c=new Qt(s);return c.colorSpace=Pt,c}const vs=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],ml=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],Ms=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function _f(n,e,t="#4ff3ff"){const i=document.createElement("canvas");i.width=640,i.height=256;const s=i.getContext("2d"),a=s.createLinearGradient(0,0,640,256);a.addColorStop(0,"#111722"),a.addColorStop(.55,"#20344a"),a.addColorStop(1,"#171024"),s.fillStyle=a,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(n,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const r=new Qt(i);return r.colorSpace=Pt,r.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),r}function wc(n,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const i=t.getContext("2d");i.fillStyle="#151922",i.fillRect(0,0,384,128),i.fillStyle=e,i.fillRect(0,0,384,12),i.fillRect(0,116,384,12),i.strokeStyle="rgba(255,255,255,0.32)",i.lineWidth=4,i.strokeRect(12,16,360,96),i.shadowColor=e,i.shadowBlur=14,i.fillStyle="#f8fbff",i.font="900 38px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n,192,64,330);const s=new Qt(t);return s.colorSpace=Pt,s}function Sc(n=512,e=384,t="#9d4d3d",i="#2d86b7"){const s=document.createElement("canvas");s.width=n,s.height=e;const a=s.getContext("2d"),r=a.createLinearGradient(0,0,n,e);r.addColorStop(0,t),r.addColorStop(.55,"#b96a55"),r.addColorStop(1,"#633428"),a.fillStyle=r,a.fillRect(0,0,n,e),a.strokeStyle="rgba(50, 24, 18, 0.42)",a.lineWidth=2;for(let c=18;c<e;c+=22){a.beginPath(),a.moveTo(0,c),a.lineTo(n,c),a.stroke();for(let h=Math.floor(c/22)%2*28;h<n;h+=56)a.beginPath(),a.moveTo(h,c-18),a.lineTo(h,c),a.stroke()}a.fillStyle="rgba(17, 24, 31, 0.92)",a.fillRect(34,e*.58,n-68,e*.28),a.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<n-48;c+=78)a.fillRect(c,e*.62,52,e*.19);a.fillStyle=i,a.fillRect(22,e*.49,n-44,34),a.fillStyle="#f7f4df",a.font="900 42px Arial Black, Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.shadowColor=i,a.shadowBlur=12,a.fillText("OPEN",n/2,e*.28,n*.76),a.shadowBlur=0;const o=new Qt(s);return o.colorSpace=Pt,o.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),o}function KM(n=384,e=384){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");i.fillStyle="#868f96",i.fillRect(0,0,n,e);for(let a=18;a<e;a+=54)i.fillStyle="rgba(30, 38, 44, 0.62)",i.fillRect(22,a,n-44,24),i.fillStyle="rgba(215, 225, 232, 0.44)",i.fillRect(20,a+26,n-40,6);i.strokeStyle="rgba(255,255,255,0.22)",i.lineWidth=3;for(let a=0;a<n;a+=64)i.beginPath(),i.moveTo(a,0),i.lineTo(a,e),i.stroke();i.fillStyle="#ffffff",i.font="900 96px Arial Black, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("P",n*.5,e*.48);const s=new Qt(t);return s.colorSpace=Pt,s.anisotropy=Math.min(16,rn.capabilities.getMaxAnisotropy()),s}function JM(n=256){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d"),i=n/2,s=n/2,a=n*.43;t.clearRect(0,0,n,n),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,h=i+Math.cos(c)*a,d=s+Math.sin(c)*a;o===0?t.moveTo(h,d):t.lineTo(h,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=n*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(n*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",i,s+n*.015);const r=new Qt(e);return r.colorSpace=Pt,r}function ce(n,e){return-7+Math.sin(n*.018)*4+Math.cos(e*.014)*5+Math.sin((n+e)*.006)*10}function Ra(n,e,t,i){const s=t*.5,a=i*.5;let r=ce(n,e);for(const o of[-s,0,s])for(const c of[-a,0,a])r=Math.min(r,ce(n+o,e+c));return r}function Fl(n,e,t=10){const{x0:i,x1:s,zNear:a,zFar:r,pitch:o,streetW:c}=Be;if(n<i-c||n>s+c||e<r-c||e>a+c)return!1;const h=Math.abs((n-i+o/2)%o-o/2),d=Math.abs((a-e+o/2)%o-o/2);return Math.min(h,d)<c*.5+t}const bs={streetGlowSprites:0,waterBlockers:0,lowFogDisks:0};function Ln(n,e,t,i,s=8){const{x0:a,x1:r,zNear:o,zFar:c,pitch:h,streetW:d}=Be,u=t*.5,m=i*.5,p=d*.5+s;let x=null;const _=(g,f,y)=>{(!x||y>x.overlap)&&(x={axis:g,road:f,overlap:y})};for(let g=a;g<=r+1;g+=h){if(e+m<c-p||e-m>o+p)continue;const f=u+p-Math.abs(n-g);f>0&&_("x",Math.round(g),f)}for(let g=o;g>=c-1;g-=h){if(n+u<a-p||n-u>r+p)continue;const f=m+p-Math.abs(e-g);f>0&&_("z",Math.round(g),f)}return x}const ia=[],yf=[],Mn={spots:[],im:null,imW:null};function bf(n=1){const e=new Tn({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uScale:{value:n}},vertexShader:`
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
      }`});return yf.push(e),e}function wf(n,e,t,i=t,s=null){ia.push({x:n,z:e,rx:t,rz:i,waterY:s})}function Js(n,e){let t=0,i=null;for(const s of ia){const a=(n-s.x)/s.rx,r=(e-s.z)/s.rz,o=a*a+r*r;if(o<1){let c=Math.pow(1-o,1.35);s.waterY!=null&&(c*=xe.clamp((s.waterY-ce(n,e))/.55,0,1)),c>t&&(t=c,i=s)}}return{depth:t,pond:i}}const za=[],Tc=[],Md=[];let xl=0;function pn(n,e){return Md.push({obj:n,update:e}),n}function Sf(n){xl+=n;for(const e of Md)e.update(xl,n)}function Ul(){if(Tc.length===0)for(let n=0;n<na.length;n++){const e=na[n];for(let t=0;t<e.length;t+=14){const i=vd(e,t);Tc.push({x:i.x,y:Mf(e,t),z:i.z,s:t,courseIndex:n})}}return Tc}function Sn(n,e,t=0){let i=null,s=1/0;for(const a of Ul()){const r=n-a.x,o=e-a.z,c=Math.hypot(r,o);c<s&&(s=c,i=a)}return{clearance:s-t-vf*.58,distance:s,nearestS:i?.s??0}}function Vs(n,e,t,i,s,a=9){const r=t*.5,o=i*.5,c=vf*.62+a;let h=null;for(const d of Ul()){const u=Math.max(Math.abs(d.x-n)-r,0),m=Math.max(Math.abs(d.z-e)-o,0),p=Math.hypot(u,m)-c;if(p>0)continue;const x=d.y-2.8,_=s-x;_<=0||(!h||_-p>h.score)&&(h={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:p,verticalIntrusion:_,score:_-p})}return h}function pi(n,e,t,i=96){for(let s=0;s<i;s++){const a=n(s);if(Sn(a.x,a.z,e).clearance>=t&&!Ln(a.x,a.z,e*2,e*2,3.5))return a}return null}function mi(n,e,t,i,s){const a=Sn(e,t,i);za.push({kind:n,x:Math.round(e),z:Math.round(t),radius:Math.round(i),margin:s,clearance:Math.round(a.clearance),nearestS:Math.round(a.nearestS)})}function jM(){const n=[...za].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:za.length,unsafe:za.filter(e=>e.clearance<e.margin),closest:n}}function Hn(n,e,t,i,s){const a=e.clone().add(t).multiplyScalar(.5),r=t.clone().sub(e),o=new z(new We(i,i,r.length(),8),s);return o.position.copy(a),o.quaternion.setFromUnitVectors(sn,r.normalize()),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}const mn={cloudMats:[],glowMats:[]};function QM(){const n=new Ux(16757626,3097190,.66);Se.add(n);const e=new xc(7179775,.6);e.position.set(260,145,-260),Se.add(e);const t=new xc(16752724,2.3);t.position.set(-310,150,230),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Se.add(t);const i=new xc(16742973,.5);i.position.set(-180,35,280),Se.add(i);const s=new fd(5556479,90,900,2);s.position.set(0,88,-920),Se.add(s),mn.hemi=n,mn.fill=e,mn.key=t,mn.rim=i}let xi=null;function e_(){const n=new L(-310,150,230).normalize();xi=new z(new Ot(1200,48,32),new Tn({side:Fn,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:n},uDay:{value:0},uNight:{value:0},uRain:{value:0}},vertexShader:`
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
        }`})),xi.renderOrder=-100,xi.frustumCulled=!1,Se.add(xi);const e=n,t=new Et({color:16764250,transparent:!0,opacity:.92,depthWrite:!1,fog:!1}),i=new z(new _n(46,48),t);i.position.copy(e).multiplyScalar(1085),i.lookAt(0,0,0),xi.add(i);const s=new Et({color:16748115,transparent:!0,opacity:.16,depthWrite:!1,fog:!1,blending:ri});for(const[a,r]of[[120,.2],[250,.085],[520,.035]]){const o=new z(new _n(a,48),s.clone());o.material.opacity=r,o.position.copy(e).multiplyScalar(1060),o.lookAt(0,0,0),xi.add(o),mn.glowMats.push({mat:o.material,dusk:r})}mn.skyU=xi.material.uniforms,mn.sunMat=t}function t_(){const n=new W({map:WM(),color:8231526,roughness:.98,metalness:.02}),e=new z(new Ut(4200,4200,300,300),n);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let m=0;m<t.count;m++){const p=t.getX(m),x=t.getY(m);t.setZ(m,ce(p,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Se.add(e);const i=new W({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.46,depthWrite:!1,side:wt});for(let m=0;m<3;m++){const p=150-m*190,x=-760-m*420,_=980,g=64+m*18,f=new z(new Ut(980,64+m*18,1,1),i.clone());f.rotation.x=-Math.PI/2,f.rotation.z=-.34+m*.03,f.position.set(p,Ra(p,x,_,g)-.55,x),f.renderOrder=-4,Se.add(f)}const s=[new W({color:4352578,roughness:1}),new W({color:6910014,roughness:1}),new W({color:3562320,roughness:1})];for(let m=0;m<46;m++){const p=28+Math.random()*90,x=-900+Math.random()*1800,_=-260-Math.random()*1780,g=[ce(x,_)];for(let y=0;y<6;y++)g.push(ce(x+Math.cos(y)*p*.9,_+Math.sin(y*1.9)*p*.9));if(Math.max(...g)-Math.min(...g)>.9)continue;const f=new z(new _n(p,9),s[m%s.length]);f.rotation.x=-Math.PI/2,f.rotation.z=Math.random()*Math.PI,f.position.set(x,Math.max(...g)+.07,_),f.scale.y=.32+Math.random()*.5,f.receiveShadow=!0,Se.add(f)}const a=new Et({color:14217471,transparent:!0,opacity:.028,depthWrite:!1});for(let m=0;m<32;m++){const p=new z(new _n(70+Math.random()*150,22),a.clone());p.material.opacity=.008+Math.random()*.014,p.rotation.x=-Math.PI/2,p.position.set(-1050+Math.random()*2100,22+Math.random()*18,-520-Math.random()*1820),p.position.y<8&&bs.lowFogDisks++,p.scale.y=.22+Math.random()*.26,p.renderOrder=-6,Se.add(p)}const r=[new W({color:5991785,roughness:1}),new W({color:7633254,roughness:1}),new W({color:4874865,roughness:1})],o=new W({color:15068905,roughness:.95});for(let m=0;m<52;m++){const p=78+Math.random()*180,x=52+Math.random()*115,_=pi(f=>{const y=m/52*Math.PI*2+f*1.77,v=1380+Math.random()*820+f*18;return{x:Math.cos(y)*v,z:Math.sin(y)*v-1180}},x,480);if(!_)continue;const g=new z(new Di(x,p,5+Math.floor(Math.random()*2)),r[m%r.length]);if(g.position.set(_.x,-9,_.z),g.rotation.y=Math.random()*Math.PI,g.castShadow=!0,g.receiveShadow=!0,Se.add(g),mi("mountain",_.x,_.z,x,480),p>160){const f=new z(new Di(x*.34,p*.22,5),o);f.position.copy(g.position).add(new L(0,p*.39,0)),f.rotation.y=g.rotation.y,Se.add(f)}}const c=new W({color:4926748,roughness:.9});new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:1589042,roughness:.9});{const m=new We(.28,.42,1,6).translate(0,.5,0),p=Dn([new Di(2.7,5.4,7).translate(0,1.9,0),new Di(2.1,4.9,7).rotateY(.6).translate(0,3.35,0),new Di(1.55,4.1,7).rotateY(1.2).translate(0,4.7,0)]),x=[2055221,3109954,1589042].map(v=>new rt(v)),_=new nn(m,c,185),g=new nn(p,new W({roughness:.92}),185),f=new zt;let y=0;for(let v=0;v<185;v++){const M=.58+Math.random()*1.05,E=8*M,S=pi(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),E,145,40);if(!S)continue;const{x:C,z:A}=S;if(Fl(C,A,18))continue;const w=ce(C,A)+.8,b=2.2+Math.random()*3.8;f.position.set(C,w,A),f.rotation.y=Math.random()*Math.PI,f.scale.set(M,b,M),f.updateMatrix(),_.setMatrixAt(y,f.matrix),f.position.set(C,w+b,A),f.scale.set(M,M,M),f.updateMatrix(),g.setMatrixAt(y,f.matrix),g.setColorAt(y,x[v%3]),y++,mi("tree",C,A,E,145)}_.count=y,g.count=y,_.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.castShadow=!0,Se.add(_),Se.add(g)}{const m=x=>{const _=document.createElement("canvas");_.width=256,_.height=128;const g=_.getContext("2d"),f=(v,M)=>Math.sin(x*M+v*37.7)*.5+.5;for(let v=0;v<16;v++){const M=v/15,E=Math.sin(M*Math.PI),S=24+M*208,C=66+(f(v,53)-.5)*22*E,A=(18+f(v,29)*22)*(.45+E*.75),w=g.createRadialGradient(S,C-A*.18,0,S,C,A);w.addColorStop(0,`rgba(255, 240, 226, ${.5+E*.3})`),w.addColorStop(.55,`rgba(252, 214, 196, ${.3+E*.16})`),w.addColorStop(1,"rgba(250, 200, 185, 0)"),g.fillStyle=w,g.beginPath(),g.arc(S,C,A,0,Math.PI*2),g.fill()}for(let v=0;v<10;v++){const M=.12+v/9*.76,E=M*256,S=20+f(v,71)*16,C=g.createRadialGradient(E,92,0,E,92,S);C.addColorStop(0,"rgba(255, 176, 128, 0.22)"),C.addColorStop(1,"rgba(255, 170, 120, 0)"),g.fillStyle=C,g.beginPath(),g.arc(E,92,S,0,Math.PI*2),g.fill()}const y=new Qt(_);return y.colorSpace=Pt,y},p=[m(1),m(2),m(3)];Me.cloudSprites=0;for(let x=0;x<44;x++){const _=new Al({map:p[x%3],transparent:!0,depthWrite:!1,opacity:.8+Math.random()*.2,fog:!1}),g=new hl(_),f=170+Math.random()*280;g.scale.set(f,f*(.32+Math.random()*.14),1),g.position.set(-1500+Math.random()*3e3,200+Math.random()*210,-1400+Math.random()*2600),g.renderOrder=-50,Se.add(g),Me.cloudSprites++,pn(g,y=>{g.position.x+=Math.sin(y*.05+x)*.02})}}const h=[new W({color:6186600,roughness:.68,metalness:.2}),new W({color:7829101,roughness:.72,metalness:.18}),new W({color:4544612,roughness:.62,metalness:.24})],d=new W({color:2962232,roughness:.65,metalness:.35});for(let m=0;m<44;m++){const p=new tt,x=20+Math.random()*95,_=8+Math.random()*18,g=8+Math.random()*18,f=new z(new le(_,x,g),h[m%h.length]);f.position.y=x/2,f.castShadow=!0,f.receiveShadow=!0,p.add(f);const y=Ca(160,320,.28+Math.random()*.36),v=new W({map:y,color:10414079,roughness:.24,metalness:.12,emissive:16758903,emissiveMap:y,emissiveIntensity:.3});for(const C of[-1,1]){const A=new z(new Ut(_*.82,x*.74),v);A.position.set(0,x*.53,C*(g/2+.08)),A.rotation.y=C<0?Math.PI:0,p.add(A)}const M=new z(new le(_*1.08,1.2,g*1.08),d);if(M.position.y=x+.7,p.add(M),Math.random()<.32){const C=new z(new We(.18,.3,10+Math.random()*12,8),d);C.position.y=x+6.5,p.add(C)}const E=Math.hypot(_,g)*.65,S=pi(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),E,240,60);S&&(p.position.set(S.x,Ra(S.x,S.z,_,g)-.7,S.z),p.rotation.y=Math.random()*Math.PI,Se.add(p),mi("building",S.x,S.z,E,240))}const u=new W({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let m=0;m<18;m++){const p=new tt,x=vs[m%vs.length],_=ml[(m*3+1)%ml.length],g=Ms[m%Ms.length],f=new W({map:_f(x,_,g),color:16777215,roughness:.22,metalness:.04,emissive:new rt(g),emissiveIntensity:.28}),y=22+Math.random()*18,v=8+Math.random()*4,M=new z(new le(y,v,.5),f);M.position.y=10,p.add(M);const E=new z(new le(y+1.2,.32,.75),u);E.position.y=10+v*.5+.25,p.add(E);for(const C of[-7,7]){const A=new z(new We(.24,.32,10,8),u);A.position.set(C,5,-.2),p.add(A)}const S=pi(()=>({x:-780+Math.random()*1560,z:-450-m*135+Math.random()*80-40}),22,175,50);S&&(p.position.set(S.x,ce(S.x,S.z)+.5,S.z),p.rotation.y=-.35+Math.random()*.7,Se.add(p),mi("billboard",S.x,S.z,22,175),Gs("roadside-billboard",S.x,p.position.y+10,S.z))}}function n_(){for(let f=0;f<3;f++){const y=[4012638,5326704,7035525][f],v=new Et({color:y,transparent:!0,opacity:.6-f*.14,depthWrite:!1,fog:!1}),M=60,E=5200,S=new Ut(E,360,M,1),C=S.attributes.position;for(let w=0;w<=M;w++){const b=w/M,P=(Math.sin(b*22+f*3)*.5+Math.sin(b*9+f)*.5)*70+120;C.setY(w,P),C.setY(w+M+1,-180)}C.needsUpdate=!0;const A=new z(S,v);A.position.set(0,40,-2300-f*360),Se.add(A)}const n=new W({color:5583649,roughness:.9}),e=[new W({color:3837754,roughness:.9}),new W({color:7319100,roughness:.92}),new W({color:13075258,roughness:.9}),new W({color:15182276,roughness:.88})];for(let f=0;f<48;f++){const y=.7+Math.random()*1.2,v=9*y,M=pi(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!M)continue;const{x:E,z:S}=M;if(Fl(E,S,18))continue;const C=ce(E,S)+.6,A=new tt,w=2.6+Math.random()*3.4,b=new z(new We(.34,.5,w,6),n);b.position.y=w/2,A.add(b);const P=e[Math.floor(Math.random()*e.length)],D=3+Math.floor(Math.random()*3);for(let O=0;O<D;O++){const Z=2.4+Math.random()*1.8,te=new z(new Ot(Z,9,7),P);te.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),te.scale.y=.82+Math.random()*.3,A.add(te)}A.position.set(E,C,S),A.scale.setScalar(y),Se.add(A),mi("tree",E,S,v,150)}const t=[new W({color:7762025,roughness:1,flatShading:!0,side:wt}),new W({color:9077368,roughness:1,flatShading:!0,side:wt}),new W({color:6249043,roughness:1,flatShading:!0,side:wt})];for(let f=0;f<70;f++){const y=2+Math.random()*7,v=pi(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),y,70,30);if(!v)continue;const{x:M,z:E}=v,S=new z(new dd(y,0),t[f%t.length]),C=S.geometry.attributes.position;for(let A=0;A<C.count;A++)C.setXYZ(A,C.getX(A)*(.8+Math.random()*.4),C.getY(A)*(.6+Math.random()*.4),C.getZ(A)*(.8+Math.random()*.4));C.needsUpdate=!0,S.geometry.computeVertexNormals(),S.position.set(M,ce(M,E)+y*.35,E),S.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),S.castShadow=!0,Se.add(S),vi.push({kind:"rock",x:M,z:E,radius:y*1.12}),mi("rock",M,E,y,70)}const i=[11969084,9416262,7314255,13218138,8228670];for(let f=0;f<14;f++){const y=130+Math.random()*200,v=130+Math.random()*200,M=pi(()=>{for(let P=0;P<6;P++){const D=-1500+Math.random()*3e3,O=-700-Math.random()*1700,Z=[ce(D,O),ce(D+y*.45,O+v*.45),ce(D-y*.45,O+v*.45),ce(D+y*.45,O-v*.45),ce(D-y*.45,O-v*.45)];if(Math.max(...Z)-Math.min(...Z)<1)return{x:D,z:O}}return{x:1e5,z:1e5}},Math.max(y,v)*.5,40,24);if(!M||M.x>9e4)continue;const{x:E,z:S}=M,C=new tt,A=5+Math.floor(Math.random()*4),w=i[Math.floor(Math.random()*i.length)];for(let P=0;P<A;P++){const D=new W({color:P%2?w:i[Math.floor(Math.random()*i.length)],roughness:1}),O=new z(new Ut(y,v/A),D);O.rotation.x=-Math.PI/2,O.position.set(0,.05,-v/2+(P+.5)*(v/A)),C.add(O)}const b=Math.max(ce(E,S),ce(E+y*.45,S+v*.45),ce(E-y*.45,S+v*.45),ce(E+y*.45,S-v*.45),ce(E-y*.45,S-v*.45));C.position.set(E,b+.06,S),C.rotation.y=Math.random()*Math.PI,Se.add(C),mi("field",E,S,Math.max(y,v)*.5,40)}{const f=pi(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(f){const y=[ce(f.x,f.z)];for(let E=0;E<8;E++)y.push(ce(f.x+Math.cos(E/8*Math.PI*2)*110,f.z+Math.sin(E/8*Math.PI*2)*74),ce(f.x+Math.cos(E/8*Math.PI*2)*200,f.z+Math.sin(E/8*Math.PI*2)*132));y.sort((E,S)=>E-S);const v=y[4]+.4,M=new z(new _n(150,48),bf(9));M.rotation.x=-Math.PI/2,M.position.set(f.x,v,f.z),M.scale.set(1.5,1,1),M.renderOrder=-4,Se.add(M),wf(f.x,f.z,222,148,v),bs.waterBlockers++,mi("lake",f.x,f.z,170,60)}}const s=new W({color:15922422,roughness:.5,metalness:.2});for(let f=0;f<9;f++){const y=f/9*Math.PI*2+.6,v=1500+Math.random()*700,M=Math.cos(y)*v,E=Math.sin(y)*v-1150,S=60+Math.random()*40,C=new tt,A=new z(new We(1.1,2.2,S,10),s);A.position.y=S/2,C.add(A);const w=new tt;w.position.set(0,S,3);const b=new z(new le(3,3,7),s);w.add(b);const P=new tt;P.position.z=3.5;for(let O=0;O<3;O++){const Z=new z(new le(1.1,26,.5),s);Z.position.y=13;const te=new tt;te.add(Z),te.rotation.z=O/3*Math.PI*2,P.add(te)}w.add(P),C.add(w),C.position.set(M,-8,E),C.rotation.y=Math.random()*Math.PI,Se.add(C);const D=.5+Math.random()*.5;pn(P,O=>{P.rotation.z=O*D})}const a=new W({color:7041398,roughness:.6,metalness:.4}),r=new ul({color:2764595,transparent:!0,opacity:.5});let o=null;for(let f=0;f<7;f++){const y=-1100+f*360,v=-1650-Math.sin(f*.7)*120,M=48,E=new tt,S=6;for(const A of[-1,1])for(const w of[-1,1]){const b=new z(new We(.4,.7,M,5),a);b.position.set(A*S,M/2,w*S),b.rotation.z=-A*.08,b.rotation.x=w*.08,E.add(b)}for(const A of[M*.6,M*.82,M]){const w=new z(new le(S*4,.8,.8),a);w.position.y=A,E.add(w)}E.position.set(y,ce(y,v)-2,v),Se.add(E);const C=ce(y,v)-2+M;if(o)for(const A of[-S*2,0,S*2]){const w=o.x+A,b=o.z,P=y+A,D=v,O=[],Z=12;for(let q=0;q<=Z;q++){const J=q/Z,ne=Math.sin(J*Math.PI)*6;O.push(new L(w+(P-w)*J,o.y-ne+(C-o.y)*J,b+(D-b)*J))}const te=new yh(new jt().setFromPoints(O),r);Se.add(te)}o={x:y,y:C,z:v}}const c=new W({color:11680302,roughness:.6,metalness:.3}),h=new W({color:15263976,roughness:.6,metalness:.3});for(let f=0;f<5;f++){const y=pi(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!y)continue;const{x:v,z:M}=y,E=70+Math.random()*50,S=new tt,C=8;for(let P=0;P<C;P++){const D=new z(new We(.5,.7,E/C,4),P%2?h:c);D.position.y=(P+.5)*(E/C),D.rotation.y=Math.PI/4,S.add(D)}const A=new W({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new z(new Ot(1.1,10,8),A);w.position.y=E+1,S.add(w),S.position.set(v,ce(v,M),M),Se.add(S),mi("mast",v,M,8,120);const b=Math.random()*Math.PI*2;pn(w,P=>{A.emissiveIntensity=Math.sin(P*2.4+b)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let f=0;f<6;f++){const y=new tt,v=d[f%d.length],M=new W({map:v_(v[0],v[1]),roughness:.5,metalness:.05,emissive:new rt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new z(new Ot(11,20,16),M);E.scale.y=1.25,y.add(E);const S=new z(new le(3.4,3,3.4),new W({color:8014371,roughness:.9}));S.position.y=-17,y.add(S);const C=new ul({color:3811866});for(const D of[-1,1])for(const O of[-1,1]){const Z=new yh(new jt().setFromPoints([new L(D*1.6,-15.5,O*1.6),new L(D*7,-3,O*7)]),C);y.add(Z)}const A=-700+Math.random()*1400,w=-700-Math.random()*1200,b=280+Math.random()*100;y.position.set(A,b,w),Se.add(y);const P=Math.random()*Math.PI*2;pn(y,D=>{y.position.y=b+Math.sin(D*.5+P)*6,y.position.x=A+Math.sin(D*.08+P)*90,y.rotation.z=Math.sin(D*.4+P)*.04})}const u=new Et({color:2829104,side:wt,fog:!1});function m(){const f=new hd;return f.moveTo(0,0),f.lineTo(-2.6,1.1),f.lineTo(-2.2,.2),f.lineTo(0,.5),f.lineTo(2.2,.2),f.lineTo(2.6,1.1),f.lineTo(0,0),new z(new Pl(f),u)}for(let f=0;f<5;f++){const y=new tt,v=5+Math.floor(Math.random()*5),M=[];for(let P=0;P<v;P++){const D=m(),O=P%2?1:-1,Z=Math.ceil(P/2);D.position.set(O*Z*5,-Z*2.4,0),D.rotation.x=-Math.PI/2,y.add(D),M.push(D)}const E=150+Math.random()*120,S=-500-Math.random()*1400,C=18+Math.random()*14,A=1400,w=-700+Math.random()*1400;y.position.set(w,E,S),Se.add(y);const b=Math.random()*Math.PI*2;pn(y,(P,D)=>{y.position.x+=C*D,y.position.x>A&&(y.position.x=-A);const O=Math.sin(P*6+b);for(const Z of M)Z.rotation.x=-Math.PI/2+O*.4})}{const f=new tt,y=new W({color:14673644,roughness:.4,metalness:.2}),v=new z(new Ot(20,20,16),y);v.scale.set(2.6,1,1),f.add(v);const M=new W({color:13781835,roughness:.6});for(let w=0;w<3;w++){const b=new z(new le(10,9,.6),M);b.position.x=-46,b.rotation.x=w/3*Math.PI*2,f.add(b)}const E=new z(new le(10,4,4),new W({color:3356475,roughness:.7}));E.position.y=-19,f.add(E);const S=new z(new Ut(40,10),new Et({map:yd("STEEL RIBBON"),transparent:!0,side:wt}));S.position.set(60,0,0),f.add(S);const C=900,A=240;f.position.set(0,A,-1200),Se.add(f),pn(f,w=>{const b=w*.05;f.position.x=Math.cos(b)*C,f.position.z=-1200+Math.sin(b)*C*.5,f.position.y=A+Math.sin(w*.3)*8,f.rotation.y=-b+Math.PI/2})}const p=new Et({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let f=0;f<14;f++){const y=new z(new Ut(220+Math.random()*360,16+Math.random()*22),p.clone());y.material.opacity=.12+Math.random()*.18,y.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),y.rotation.x=-Math.PI/2.1,y.rotation.z=Math.random()*Math.PI,y.scale.y=.3,Se.add(y);const v=2+Math.random()*3;pn(y,(M,E)=>{y.position.x+=v*E,y.position.x>1400&&(y.position.x=-1400)})}const x=new W({color:13620954,roughness:.6,metalness:.2}),_=new Et({map:M_(),side:wt});for(let f=0;f<4;f++){const y=pi(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!y)continue;const{x:v,z:M}=y,E=new tt,S=60+Math.random()*40,C=new z(new le(S,1.4,26),x);C.position.set(0,26,-4),C.rotation.x=-.32,E.add(C);const A=new z(new Ut(S*.94,24),_);A.position.set(0,12,6),A.rotation.x=-.85,E.add(A);for(const w of[-S/2,S/2]){const b=new z(new le(1.4,26,1.4),x);b.position.set(w,13,-8),E.add(b)}E.position.set(v,ce(v,M),M),E.rotation.y=Math.atan2(-v,-M)+(Math.random()-.5)*.5,Se.add(E),mi("grandstand",v,M,40,30)}const g=[16731486,16765503,16777215,11824127];for(let f=0;f<90;f++){const y=pi(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!y)continue;const{x:v,z:M}=y,E=new tt,S=g[Math.floor(Math.random()*g.length)],C=new Et({color:S,side:wt}),A=5+Math.floor(Math.random()*6);for(let w=0;w<A;w++){const b=new z(new _n(.5+Math.random()*.4,5),C);b.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),b.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,b.rotation.z=Math.random()*Math.PI,E.add(b)}E.position.set(v,ce(v,M),M),Se.add(E),mi("flowers",v,M,3,20)}}const un=[],si=[];let Ch=0;const vi=[],aa=[],An=[],Pa=[],Es=[],Na=[],Me={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},gl=[];function Gs(n,e,t,i){Me.signs++,gl.length<160&&gl.push({kind:n,x:+e.toFixed(1),y:+t.toFixed(1),z:+i.toFixed(1)})}function fs(n,e,t=1){Me[n][e]=(Me[n][e]||0)+t}let Bo=null,t0=null;function jr(){return Bo||(Bo=new W({vertexColors:!0,roughness:.42,metalness:.22}),Bo.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aEmissive;
varying vec3 vEmissive;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vEmissive = aEmissive;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vEmissive;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += vEmissive;`)},t0=new W({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2})),{opaque:Bo,glass:t0}}const ps=new rt;function dt(n,e,t,i=0,s=1){const a=n.clone();e&&a.applyMatrix4(e);const r=a.attributes.position.count,o=new Float32Array(r*3),c=new Float32Array(r*3);ps.set(t??16777215);for(let h=0;h<r;h++)o[h*3]=ps.r,o[h*3+1]=ps.g,o[h*3+2]=ps.b;if(i){ps.set(i).multiplyScalar(s);for(let h=0;h<r;h++)c[h*3]=ps.r,c[h*3+1]=ps.g,c[h*3+2]=ps.b}return a.setAttribute("color",new St(o,3)),a.setAttribute("aEmissive",new St(c,3)),a}function _t(n,e,t,i=0){return(i?new bt().makeRotationZ(i):new bt).setPosition(n,e,t)}function Qr(n,e){const t=new tt,i={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=i[n]||i.compact,{opaque:a,glass:r}=jr(),o=n==="taxi"?16767293:e,c=new rt(e).multiplyScalar(.52).getHex(),h=[],d=[];if(h.push(dt(new le(s.w,s.h,s.l),_t(0,.95,0),o)),(s.bus?d:h).push(dt(new le(s.cabin[0],s.cabin[1],s.cabin[2]),_t(0,1.65,s.cabinZ),s.bus?10217727:e)),!s.bus){d.push(dt(new le(s.cabin[0]*.78,s.cabin[1]*.55,.08),_t(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),10217727));for(const y of[-1,1])d.push(dt(new le(.08,s.cabin[1]*.5,s.cabin[2]*.48),_t(y*(s.cabin[0]*.5+.04),1.68,s.cabinZ),10217727))}if(s.bed&&h.push(dt(new le(s.w*.94,.58,s.l*.38),_t(0,1.2,1.35),c)),s.box&&h.push(dt(new le(s.box[0],s.box[1],s.box[2]),_t(0,1.55,1.25),15130833)),s.bus){h.push(dt(new le(s.w+.06,.28,s.l*.86),_t(0,1.38,0),c));const y=new le(.08,.64,.72);for(let v=-2.8;v<=3.1;v+=1.2)for(const M of[-1,1])d.push(dt(y,_t(M*(s.w*.5+.05),2.08,v),10217727))}s.sign&&h.push(dt(new le(1,.24,.46),_t(0,2.2,-.35),16774310,16765773,.9));const u=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],m=[],p=Dn([dt(new We(.42,.42,.36,14),_t(0,0,0,Math.PI/2),395016),dt(new We(.18,.18,.38,10),_t(0,0,0,Math.PI/2),14147041)],!1),x=new le(.3,.34,1.12);for(const y of u)for(const v of[-s.w*.54,s.w*.54]){const M=new z(p,a);M.position.set(v,.45,y),t.add(M),m.push(M),h.push(dt(x,_t(v*1.02,.72,y),1250072))}const _=new le(s.w*1.02,.24,.16);for(const y of[-s.l*.5-.06,s.l*.5+.06])h.push(dt(_,_t(0,.62,y),1250072));const g=new le(.42,.2,.1),f=new le(.36,.22,.1);for(const y of[-s.w*.28,s.w*.28])h.push(dt(g,_t(y,.95,-s.l*.52-.04),16774064,16765788,1.7)),h.push(dt(f,_t(y,.98,s.l*.52+.04),16725033,16717325,1.45));if(s.bus){const y=[11893070,9657655,13018202,8541761][(e>>>4)%4],v=-s.cabin[0]*.27,M=s.cabinZ-s.cabin[2]/2+.55;h.push(dt(new Ot(.155,8,6),_t(v,2.06,M),y));const E=new Ot(.145,8,5);E.scale(1,.55,1),h.push(dt(E,_t(v,2.18,M),1119001))}return t.add(new z(Dn(h,!1),a)),d.length&&t.add(new z(Dn(d,!1),r)),t.userData={wheels:m,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55,plateHalfL:s.l/2,hasDriver:!!s.bus},t.traverse(y=>{y.castShadow=!1,y.receiveShadow=!0}),t}function _d(n,e){const t=new tt,{opaque:i}=jr(),s=new Ot(.25,8,5);s.scale(1,.5,1),t.add(new z(Dn([dt(new We(.28,.34,.95,8),_t(0,1.35,0),n),dt(new Ot(.24,10,8),_t(0,2.02,0),12947299),dt(s,_t(0,2.17,0),1119001)],!1),i));const a=[],r=dt(new We(.075,.09,.78,6),null,e),o=dt(new We(.055,.065,.72,6),null,12947299);for(const c of[-.16,.16]){const h=new z(r,i);h.position.set(c,.58,0),t.add(h),a.push({mesh:h,side:Math.sign(c),baseY:.58,amp:.28})}for(const c of[-.38,.38]){const h=new z(o,i);h.position.set(c,1.33,0),h.rotation.z=c<0?-.18:.18,t.add(h),a.push({mesh:h,side:-Math.sign(c),baseY:1.33,amp:.34})}return t.userData.limbs=a,t.traverse(c=>{c.castShadow=!0,c.receiveShadow=!0}),t}const n0="BCDFGHJKLMNPRSTVWXZ",i_=["FCK","SHT","DCK","CNT","KKK","WTF","FML","NGR","FGT","SLT","DMN","BTC","JZZ"],Vo=340;function Tf(n){let e=n>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}let Go=null;function s_(){if(Go)return Go;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<64;s++){const a=Tf(335585+s*2654435761);let r="";do{r="";for(let d=0;d<3;d++)r+=n0[a()*n0.length|0]}while(i_.includes(r));r+=" ";for(let d=0;d<3;d++)r+=a()*10|0;t.push(r);const o=s%8*128,c=(s/8|0)*64,h=s%9===3;e.fillStyle=h?"#f3d268":"#ece9dc",e.fillRect(o+6,c+8,116,48),e.strokeStyle="#25304d",e.lineWidth=3,e.strokeRect(o+7.5,c+9.5,113,45),e.fillStyle="#1c2848",e.textAlign="center",e.textBaseline="middle",e.font="bold 30px 'Courier New', monospace",e.fillText(r,o+64,c+38),e.font="bold 10px sans-serif",e.fillText("STEEL STATE",o+64,c+17)}const i=new Qt(n);return i.colorSpace=Pt,i.anisotropy=4,Go={texture:i,texts:t},Go}const a_=new L(1,1,1),Ec=new bt,Ho=new bt,Ii={mesh:null,texts:null,statics:[],dynamics:[],_zero:new bt().makeScale(0,0,0),ensure(){if(this.mesh)return;const{texture:n,texts:e}=s_();this.texts=e;const t=new Ut(.55,.17);t.setAttribute("aPlateSlot",new dl(new Float32Array(Vo*2),2));const i=new Et({map:n});i.customProgramCacheKey=()=>"plate-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aPlateSlot;
varying vec2 vPlateUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vPlateUv = uv * 0.125 + aPlateSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vPlateUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vPlateUv );")},this.mesh=new nn(t,i,Vo),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!1;for(let s=0;s<Vo;s++)this.mesh.setMatrixAt(s,this._zero);Se.add(this.mesh)},_slot(n){const e=n%64;return{u:e%8*.125,v:(7-(e/8|0))*.125,s:e}},_offsets(n,e=.03){return{offF:new bt().makeRotationY(Math.PI).setPosition(0,.62,-(n+e)),offR:new bt().setPosition(0,.62,n+e)}},resetStatic(){this.ensure(),this.statics.length=0;for(let n=0;n<260;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},resetDynamic(){this.ensure(),this.dynamics.length=0;for(let n=260;n<Vo;n++)this.mesh.setMatrixAt(n,this._zero);this.mesh.instanceMatrix.needsUpdate=!0},addStatic(n,e,t,i){if(this.ensure(),this.statics.length>=130)return;const s=this.statics.length*2,{u:a,v:r,s:o}=this._slot(t*13+29),c={matrix:n.clone(),spot:i,wasTaken:null,iF:s,iR:s+1,slot:o,...this._offsets(e)},h=this.mesh.geometry.getAttribute("aPlateSlot");h.setXY(c.iF,a,r),h.setXY(c.iR,a,r),h.needsUpdate=!0,this.statics.push(c),this._applyStatic(c)},_applyStatic(n){n.wasTaken=!!(n.spot&&n.spot.taken),n.wasTaken?(this.mesh.setMatrixAt(n.iF,this._zero),this.mesh.setMatrixAt(n.iR,this._zero)):(this.mesh.setMatrixAt(n.iF,Ho.multiplyMatrices(n.matrix,n.offF)),this.mesh.setMatrixAt(n.iR,Ho.multiplyMatrices(n.matrix,n.offR))),this.mesh.instanceMatrix.needsUpdate=!0},addDynamic(n,e){if(this.ensure(),this.dynamics.length>=40)return;const t=260+this.dynamics.length*2,{u:i,v:s,s:a}=this._slot(e*37+11),r=this.mesh.geometry.getAttribute("aPlateSlot");r.setXY(t,i,s),r.setXY(t+1,i,s),r.needsUpdate=!0,this.dynamics.push({carMesh:n,iF:t,iR:t+1,slot:a,...this._offsets(n.userData.plateHalfL||2.2,.155)})},update(){if(!(!this.mesh||!this.dynamics.length)){for(const n of this.dynamics)Ec.compose(n.carMesh.position,n.carMesh.quaternion,a_),this.mesh.setMatrixAt(n.iF,Ho.multiplyMatrices(Ec,n.offF)),this.mesh.setMatrixAt(n.iR,Ho.multiplyMatrices(Ec,n.offR));for(const n of this.statics)!!(n.spot&&n.spot.taken)!==n.wasTaken&&this._applyStatic(n);this.mesh.instanceMatrix.needsUpdate=!0}}},Rh=40,i0=[[["running late again","me"],["the ribbon jam??","them"],["every. time.","me"]],[["pizza tonight?","them"],["obviously","me"],["extra olives","them"]],[["did u see that stunt","me"],["the triple flip?!","them"],["unreal","me"]],[["buy milk pls","them"],["on it","me"],["and cookies","them"]],[["gate 8 is glowing","me"],["on my way!!","them"]],[["new high score","me"],["screenshot or it","them"],["didn't happen","them"]],[["taxi 27 honked at me","me"],["classic 27","them"]],[["lost my parking spot","me"],["someone STOLE it??","them"],["drove right off","me"]]];let Wo=null;function r_(){if(Wo)return Wo;const n=document.createElement("canvas");n.width=512,n.height=512;const e=n.getContext("2d");for(let i=0;i<8;i++){const s=i%4*128,a=(i/4|0)*256,r=i0[i%i0.length];e.fillStyle="#101823",e.fillRect(s,a,128,256),e.fillStyle="#1c2a3a",e.fillRect(s,a,128,26),e.fillStyle="#9fd6ff",e.font="bold 14px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("chat",s+64,a+14),e.font="bold 16px sans-serif",e.textAlign="left";let o=a+42;for(const[c,h]of r){const d=h==="me",u=Math.min(116,e.measureText(c).width+14),m=d?s+124-u:s+4;e.fillStyle=d?"#2f7fd4":"#2a3546",e.beginPath(),e.roundRect(m,o,u,34,10),e.fill(),e.fillStyle="#eaf4ff",e.fillText(c,m+7,o+18),o+=42}}const t=new Qt(n);return t.colorSpace=Pt,t.anisotropy=4,Wo={texture:t,mat:new Et({map:t})},Wo}const La={kits:null,pool:0,_timer:0,ensure(){if(this.kits)return;this.pool=ja?4:8;const{opaque:n}=jr(),e=[1976625,3153952,5985575,2503224,4400680,1710618,5124895,3355970],t=[9067082,7952701,10707786,8341813,9067082,7952701,10707786,8341813],i=[3087378,1975326,4022546,3087378,1975326,4022546,3087378,1975326];this.kits=[];for(let s=0;s<this.pool;s++){const a=[],r=new Ot(.038,6,5),o=new le(.078,.02,.02),c=new Ot(.03,6,5),h=new le(.09,.022,.02);for(const b of[-.085,.085])a.push(dt(r,_t(b,2.06,-.198),1842476)),a.push(dt(o,_t(b,2.118,-.207),i[s%i.length]));a.push(dt(c,_t(0,2,-.229),11893070)),a.push(dt(h,_t(0,1.935,-.216),t[s%t.length]));const d=new z(Dn(a,!1),n),u=dt(new Ot(.056,6,5),null,12947299),m=dt(new le(.13,.07,.24),null,e[s%e.length]),p=new z(u,n),x=new z(u,n),_=new z(m,n),g=new z(m,n);p.position.set(0,-.38,0),x.position.set(0,-.38,0),_.position.set(0,-.42,-.045),g.position.set(0,-.42,-.045);const f=r_(),y=new tt,v=new z(dt(new le(.075,.15,.014),null,1315356),n),M=new Ut(.062,.128),E=s%4*.25,S=1-((s/4|0)+1)*.5,C=M.attributes.uv;for(let b=0;b<C.count;b++)C.setXY(b,E+C.getX(b)*.25,S+C.getY(b)*.5);const A=new z(M,f.mat);A.position.z=.0095,y.add(v),y.add(A),y.position.set(.34,1.47,-.36),y.quaternion.setFromUnitVectors(new L(0,0,1),new L(-.34,.55,.36).normalize());const w={face:d,handL:p,handR:x,shoeL:_,shoeR:g,phone:y,texting:!1,ped:null};for(const b of[d,p,x,_,g,y,v,A])b.userData.kitPart=!0,b.castShadow=!1,b.receiveShadow=!0;this.kits.push(w)}},attach(n,e,t){const i=e.mesh,s=i.userData.limbs||[];i.add(n.face),s[0]?.mesh.add(n.shoeL),s[1]?.mesh.add(n.shoeR),s[2]?.mesh.add(n.handL),s[3]?.mesh.add(n.handR),n.texting=!!t,n.texting&&i.add(n.phone),n.ped=e},detach(n){for(const e of[n.face,n.handL,n.handR,n.shoeL,n.shoeR,n.phone])e.removeFromParent();n.ped=null,n.texting=!1},reset(){if(this.kits)for(const n of this.kits)n.ped&&this.detach(n)},promotedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.ped?1:0),0):0},update(n){if(!Es.length){this.reset();return}if(this.kits){for(const o of this.kits)if(o.ped&&o.texting){const c=o.ped.mesh.userData.limbs?.[3]?.mesh;c&&(c.rotation.x=-2.05,c.position.y=1.33)}}if(this._timer-=n,this._timer>0)return;this._timer=.35,this.ensure();const e=ye.position.x,t=ye.position.z,i=Rh*Rh,s=[];for(let o=0;o<Es.length;o++){const c=Es[o];if(!c.active||!c.mesh.visible)continue;const h=c.x-e,d=c.z-t,u=h*h+d*d;u<i&&s.push({a:c,idx:o,d2:u})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool),r=new Set(a.map(o=>o.a));for(const o of this.kits)o.ped&&(!r.has(o.ped)||!o.ped.active||!o.ped.mesh.visible)&&this.detach(o);for(const o of a){const c=this.kits[o.idx%this.pool];c.ped!==o.a&&(c.ped&&r.has(c.ped)||(c.ped&&this.detach(c),this.attach(c,o.a,o.idx%3===0)))}}};let Xo=null;function o_(){if(Xo)return Xo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=[];for(let s=0;s<8;s++){const a=s%4*256,r=(s/4|0)*256,o=(s*97+13)%90+10;t.push(o),e.fillStyle="#14203a",e.textAlign="center",e.textBaseline="middle",e.font="bold 88px sans-serif",e.fillText(`TAXI ${o}`,a+128,r+96),e.font="bold 34px sans-serif",e.fillText("STEEL CITY CAB",a+128,r+178)}const i=new Qt(n);return i.colorSpace=Pt,i.anisotropy=4,Xo={texture:i,nums:t,mat:new Et({map:i,transparent:!0,alphaTest:.25})},Xo}const Ph={pool:null,used:0,ensure(){if(this.pool)return;const n=o_();this.pool=[];for(let e=0;e<8;e++){const t=e%4*.25,i=1-((e/4|0)+1)*.5,s=[];for(const[r,o]of[[-.585,Math.PI],[-.115,0]]){const c=new Ut(.94,.2),h=c.attributes.uv;for(let d=0;d<h.count;d++)h.setXY(d,t+h.getX(d)*.25,i+.25+h.getY(d)*.25);o&&c.rotateY(o),c.translate(0,2.2,r),s.push(c)}for(const[r,o]of[[1.13,Math.PI/2],[-1.13,-Math.PI/2]]){const c=new Ut(.62,.3),h=c.attributes.uv;for(let d=0;d<h.count;d++)h.setXY(d,t+h.getX(d)*.25,i+h.getY(d)*.5);c.rotateY(o),c.translate(r,1.05,-.2),s.push(c)}const a=new z(Dn(s,!1),n.mat);a.castShadow=!1,a.receiveShadow=!1,a.userData.taxiSign=e,this.pool.push(a)}},reset(){if(this.pool)for(const n of this.pool)n.removeFromParent();this.used=0},attach(n){this.ensure(),!(this.used>=this.pool.length)&&n.add(this.pool[this.used++])},count(){return this.pool?this.pool.reduce((n,e)=>n+(e.parent?1:0),0):0}};let qo=null;function l_(){if(qo)return qo;const n=document.createElement("canvas");n.width=1024,n.height=512;const e=n.getContext("2d"),t=(a,r,o)=>{const d=["#e8a45c","#7fb8d8","#e8c087","#c77bd8"][o],u=["#ffdba4","#c8ecff","#ffe9c4","#ffb3ec"][o],m=e.createLinearGradient(a,r,a,r+224);m.addColorStop(0,u),m.addColorStop(.55,d),m.addColorStop(1,["#8a5a2c","#3f6c86","#8a6a3c","#6c3f86"][o]),e.fillStyle=m,e.fillRect(a,r,512,224),e.strokeStyle="#221a14",e.lineWidth=10,e.strokeRect(a+5,r+5,502,214),e.lineWidth=4,e.beginPath(),e.moveTo(a+512/2,r),e.lineTo(a+512/2,r+224),e.moveTo(a,r+224/2),e.lineTo(a+512,r+224/2),e.stroke(),e.fillStyle="rgba(255, 230, 180, 0.85)";for(let p=a+60;p<a+512-40;p+=110)e.fillRect(p,r+8,3,26),e.beginPath(),e.moveTo(p-12,r+34),e.lineTo(p+15,r+34),e.lineTo(p+1.5,r+48),e.fill();if(e.fillStyle="rgba(10, 8, 12, 0.88)",o===0)for(let p=a+70;p<a+512-60;p+=150)e.fillRect(p,r+150,74,8),e.fillRect(p+33,r+158,8,52),e.fillRect(p-18,r+168,26,42),e.fillRect(p+66,r+168,26,42);else if(o===1)for(let p=a+50;p<a+512-60;p+=90)e.fillRect(p,r+60,12,60),e.fillRect(p-14,r+76,40,10),e.beginPath(),e.arc(p+6,r+180,26,0,7),e.fill();else if(o===2){for(const p of[80,130,180])e.fillRect(a+40,r+p,432,8);e.fillStyle="rgba(30, 22, 16, 0.9)";for(const p of[56,106,156])for(let x=a+56;x<a+512-70;x+=44)e.fillRect(x,r+p,26,22)}else for(let p=a+60;p<a+512-80;p+=120)e.fillRect(p,r+90,62,120),e.fillStyle=["#4ff3ff","#ff4fb7","#68ff8f"][(p/120|0)%3],e.fillRect(p+10,r+104,42,34),e.fillStyle="rgba(10, 8, 12, 0.88)"};t(0,0,0),t(512,0,1),t(0,224,2),t(512,224,3);const i=(a,r,o,c,h)=>{e.fillStyle=c,e.fillRect(a+4,452,r-8,56),e.strokeStyle=h,e.lineWidth=3,e.strokeRect(a+7,455,r-14,50),e.fillStyle=h,e.font="900 26px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(o,a+r/2,481,r-24)};i(0,150,"OPEN","#1d3a24","#7dffa5"),i(150,150,"CLOSED","#3a1d1d","#ff8d7d"),i(300,190,"BACK IN 5","#33301d","#ffe27d");const s=new Qt(n);return s.colorSpace=Pt,s.anisotropy=4,qo={texture:s,mat:new Et({map:s})},qo}const qs={spots:[],kits:null,pool:0,_timer:0,resetSpots(){if(this.spots.length=0,this.kits)for(const n of this.kits)n.group.visible=!1,n.spot=null},addSpot(n,e,t,i,s){this.spots.push({x:n,y:e,z:t,yaw:i,w:s})},ensure(){if(this.kits)return;this.pool=ja?2:4;const n=l_();this.kits=[];for(let e=0;e<this.pool;e++){const t=new tt,i=e%2*.5,s=e<2?.5625:.125,a=new Ut(5.6,1.9),r=a.attributes.uv;for(let y=0;y<r.count;y++)r.setXY(y,i+r.getX(y)*.5,s+r.getY(y)*.4375);const o=new z(a,n.mat);o.position.set(-.7,1.55,.06),t.add(o);const c=new z(new le(1.3,2.3,.03),new W({color:15326941,roughness:.7,metalness:.05}));c.position.set(2.75,1.15,.03),t.add(c);const h=new z(new le(1.02,2.14,.05),new W({color:5910302,roughness:.55,metalness:.15}));h.position.set(2.75,1.07,.05),t.add(h);const d=new z(new Ut(.6,.8),new W({color:10217727,roughness:.1,metalness:.1,emissive:2963258,emissiveIntensity:.5}));d.position.set(2.75,1.5,.081),t.add(d);const u=new z(new le(.035,.17,.045),new W({color:13092431,roughness:.3,metalness:.85}));u.position.set(3.14,1.02,.09),t.add(u);const m=[150,150,190][e%3]/150,p=new Ut(.34*m,.14),x=p.attributes.uv,_=[0,150/1024,300/1024][e%3],g=[150/1024,150/1024,190/1024][e%3];for(let y=0;y<x.count;y++)x.setXY(y,_+x.getX(y)*g,(4+x.getY(y)*56)/512);const f=new z(p,n.mat);f.position.set(2.75,.62,.085),t.add(f),t.traverse(y=>(y.castShadow=!1,y.receiveShadow=!1,y.userData.dressKit=!0)),t.visible=!1,Se.add(t),this.kits.push({group:t,spot:null})}},dressedCount(){return this.kits?this.kits.reduce((n,e)=>n+(e.spot?1:0),0):0},update(n){if(!this.spots.length||(this._timer-=n,this._timer>0))return;this._timer=.4,this.ensure();const e=ye.position.x,t=ye.position.z,i=2025,s=[];for(const o of this.spots){const c=o.x-e,h=o.z-t,d=c*c+h*h;d<i&&s.push({s:o,d2:d})}s.sort((o,c)=>o.d2-c.d2);const a=s.slice(0,this.pool).map(o=>o.s),r=new Set(a);for(const o of this.kits)o.spot&&!r.has(o.spot)&&(o.spot=null,o.group.visible=!1);for(const o of a){if(this.kits.some(h=>h.spot===o))continue;const c=this.kits.find(h=>!h.spot);if(!c)break;c.spot=o,c.group.position.set(o.x,o.y,o.z),c.group.rotation.y=o.yaw,c.group.scale.setScalar(Math.min(1,o.w*.72/7)),c.group.visible=!0}}},Ci={meshes:null,counts:{hydrants:0,meters:0,benches:0,cans:0},sample:[]};function c_(n,e,t,i,s,a,r,o){const{opaque:c}=jr(),h=Dn([dt(new We(.11,.13,.1,6),_t(0,.05,0),2894892),dt(new We(.09,.1,.34,6),_t(0,.27,0),15021620),dt(new Ot(.095,6,4),_t(0,.47,0),15021620),dt(new We(.035,.035,.3,6),_t(0,.33,0,Math.PI/2),13840175),dt(new We(.03,.03,.08,6),_t(0,.56,0),16765778)],!1),d=Dn([dt(new We(.024,.03,1.04,6),_t(0,.52,0),3092306),dt(new le(.15,.22,.09),_t(0,1.13,0),5395032),dt(new le(.11,.1,.02),_t(0,1.16,-.047),13036239)],!1),u=Dn([dt(new le(.14,.42,.42),_t(-.62,.21,0),2432796),dt(new le(.14,.42,.42),_t(.62,.21,0),2432796),dt(new le(.12,.62,.06),_t(-.62,.7,.21),2432796),dt(new le(.12,.62,.06),_t(.62,.7,.21),2432796),dt(new le(1.55,.05,.16),_t(0,.44,-.12),9130315),dt(new le(1.55,.05,.16),_t(0,.44,.08),9130315),dt(new le(1.55,.16,.05),_t(0,.68,.2),9130315),dt(new le(1.55,.16,.05),_t(0,.9,.22),9130315)],!1),m=Dn([dt(new We(.19,.16,.52,8),_t(0,.26,0),3225437),dt(new We(.2,.2,.05,8),_t(0,.55,0),4936027),dt(new We(.13,.13,.03,8),_t(0,.57,0),1118996)],!1),p=[{key:"hydrants",geo:h,cap:46},{key:"meters",geo:d,cap:60},{key:"benches",geo:u,cap:33},{key:"cans",geo:m,cap:46}];if(Ci.meshes)for(const v of Ci.meshes)v.removeFromParent(),v.geometry.dispose();Ci.meshes=[],Ci.sample=[];const x={},_=new zt,g=Tf(61453);for(const v of p){const M=new nn(v.geo,c,v.cap);M.frustumCulled=!1,M.castShadow=!1,M.receiveShadow=!0,M.userData.furniture=v.key,M.userData.used=0,x[v.key]=M,Ci.meshes.push(M),n.add(M)}const f=(v,M,E,S)=>{const C=x[v];C.userData.used>=C.count||(_.position.set(M,ce(M,E)+.02,E),_.rotation.y=S,_.updateMatrix(),C.setMatrixAt(C.userData.used++,_.matrix),Ci.sample.length<8&&Ci.sample.push({key:v,x:+M.toFixed(1),z:+E.toFixed(1)}))},y=(v,M)=>{const E=v?i+9:e+9,S=v?s-9:t-9;for(let C=E;C<=S;C+=15+g()*10){const A=v?Math.abs((C-s)%a+a)%a:Math.abs((C-e)%a+a)%a;if(A<13||A>a-13)continue;const w=g()<.5?-1:1,b=w*(r*.66+1.35),P=v?M+b:C,D=v?C:M+b;if(o(P,D,.6).clearance<.8)continue;const O=g();O<.27?f("hydrants",P,D,g()*6.28):O<.58?f("meters",P,D,v?w*Math.PI*.5:w>0?Math.PI:0):O<.76?f("benches",P,D,v?w*Math.PI*.5:w>0?Math.PI:0):f("cans",P,D,g()*6.28)}};for(let v=e;v<=t+1;v+=a)y(!0,Math.round(v));for(let v=s;v>=i-1;v-=a)y(!1,Math.round(v));for(const v of p){const M=x[v.key];M.count=M.userData.used,M.instanceMatrix.needsUpdate=!0,Ci.counts[v.key]=M.userData.used}}const vl=["RIBBON AVE","COIL ST","PISTON BLVD","TORQUE WAY","APEX DR","CHICANE CT","GEARBOX ST","TURBINE AVE","SPOKE LN","CAMBER RD","NITRO AVE","DYNAMO ST","CLUTCH ST","MANIFOLD AVE","OCTANE BLVD","SPOILER ST","DOWNSHIFT DR","HAIRPIN RD","SLIPSTREAM AVE","REDLINE ST","IGNITION WAY","FLYWHEEL RD","BANKED AVE","PIT LANE","VELOCITY BLVD","CHROME ST","SPROCKET ST","AERO WAY","MEDALLION RD","CROSSWALK CT","OVERPASS AVE","STEEL RIBBON PKWY"];let Yo=null;function h_(){if(Yo)return Yo;const n=document.createElement("canvas");n.width=1024,n.height=256;const e=n.getContext("2d");for(let s=0;s<32;s++){const a=s%8*128,r=(s/8|0)*64;e.fillStyle="#175430",e.fillRect(a+2,r+14,124,36),e.strokeStyle="#e8f4ea",e.lineWidth=2.5,e.strokeRect(a+4.5,r+16.5,119,31),e.fillStyle="#f2fbf4",e.font="bold 17px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(vl[s%vl.length],a+64,r+33,112)}const t=new Qt(n);t.colorSpace=Pt,t.anisotropy=4;const i=new Et({map:t});return i.customProgramCacheKey=()=>"street-sign-atlas",i.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aSignSlot;
varying vec2 vSignUv;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vSignUv = uv * vec2(0.125, 0.25) + aSignSlot;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vSignUv;`).replace("#include <map_fragment>","diffuseColor *= texture2D( map, vSignUv );")},Yo={texture:t,mat:i},Yo}const ii={poles:0,blades:0,meshes:null,sample:[]};function d_(n,e,t,i,s,a,r,o){const c=h_(),{opaque:h}=jr();if(ii.meshes)for(const A of ii.meshes)A.removeFromParent(),A.geometry.dispose();ii.meshes=[],ii.sample=[];const d=[],u=[];for(let A=e;A<=t+1;A+=a)d.push(Math.round(A));for(let A=s;A>=i-1;A-=a)u.push(Math.round(A));const m=d.length*u.length+4,p=Dn([dt(new We(.035,.045,2.55,6),_t(0,1.275,0),1590848),dt(new We(.05,.05,.06,6),_t(0,2.58,0),2894377)],!1),x=new nn(p,h,m),_=new Ut(.92,.17),g=new Ut(.92,.17);g.rotateY(Math.PI);const f=Dn([_,g],!1);f.setAttribute("aSignSlot",new dl(new Float32Array(m*2*2),2));const y=new nn(f,c.mat,m*2),v=f.getAttribute("aSignSlot");for(const A of[x,y])A.frustumCulled=!1,A.castShadow=!1,A.receiveShadow=!0,n.add(A),ii.meshes.push(A);const M=new zt;let E=0,S=0;const C=(A,w)=>(A?w:d.length+w)%32;for(let A=0;A<d.length;A++)for(let w=0;w<u.length;w++){const b=d[A]+r*.66+1.5,P=u[w]+r*.66+1.5;if(o(b,P,.5).clearance<.7||E>=m||S+2>y.count)continue;const D=ce(b,P)+.02;M.position.set(b,D,P),M.rotation.y=0,M.updateMatrix(),x.setMatrixAt(E++,M.matrix);const O=C(!0,A),Z=C(!1,w);M.position.set(b,D+2.4,P),M.rotation.y=Math.PI/2,M.updateMatrix(),y.setMatrixAt(S,M.matrix),v.setXY(S,O%8*.125,(3-(O/8|0))*.25),S++,M.position.set(b,D+2.56,P),M.rotation.y=0,M.updateMatrix(),y.setMatrixAt(S,M.matrix),v.setXY(S,Z%8*.125,(3-(Z/8|0))*.25),S++,ii.sample.length<4&&ii.sample.push({x:+b.toFixed(1),y:+D.toFixed(2),z:+P.toFixed(1),ns:vl[O],ew:vl[Z]})}x.count=E,y.count=S,x.instanceMatrix.needsUpdate=!0,y.instanceMatrix.needsUpdate=!0,v.needsUpdate=!0,ii.poles=E,ii.blades=S}function u_(n,e,t){const{X0:i,X1:s,ZN:a,ZF:r,pitch:o,streetW:c,trafficControls:h=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],m=[],p=30,x=[],_=[];for(let I=i;I<=s+1;I+=o)x.push(Math.round(I));for(let I=a;I>=r-1;I-=o)_.push(Math.round(I));_.sort((I,Ce)=>I-Ce);const g=x[0],f=x[x.length-1],y=_[0],v=_[_.length-1];An.length=0,Pa.length=0,Es.length=0,Na.length=0,Me.traffic=0,Me.pedestrians=0,Me.types={},Me.turns=0,Me.splats=0,Me.trafficCrashes=0,Me.streetLights=0,Me.trafficLights=0,Me.stopSigns=0,Ii.resetDynamic(),La.reset(),Ph.reset();const M=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*c*.23,S=(I,Ce)=>{let be=0,Re=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-Ce);K<Re&&(Re=K,be=$)}return be},C=(I,Ce,be)=>{const Re=I==="ns"?_:x;if(be>0){for(const $ of Re)if($>Ce+.05)return $;return Re[Re.length-1]}for(let $=Re.length-1;$>=0;$--)if(Re[$]<Ce-.05)return Re[$];return Re[0]},A=I=>{const Ce=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+Ce,z:I.along}:{x:I.along,z:I.road+Ce}},w=I=>{if(l.mode!=="roam")return null;const Ce=A(I);if(Math.abs(l.roamPos.y-(ce(Ce.x,Ce.z)+zn))>4.2)return null;const be=I.axis==="ns"?0:I.dir,Re=I.axis==="ns"?I.dir:0,$=l.roamPos.x-Ce.x,K=l.roamPos.z-Ce.z,we=$*be+K*Re,Pe=I.axis==="ns"?$:K,Oe=Math.abs(Pe),nt=Math.hypot($,K),Ht=I.mesh?.userData?.colliderHalfW||2,at=I.mesh?.userData?.colliderHalfD||3;return nt<In+Math.max(Ht,at)*.55||we>-1.5&&we<at+4.2&&Oe<In+Ht*.85?{crash:!0}:we>0&&we<30&&Oe<c*.36?{avoidOffset:(Pe>=0?-1:1)*I.maxAvoidOffset,stop:we<13&&Oe<In+Ht*.95}:null},b=(I,Ce)=>`${Math.round(I)},${Math.round(Ce)}`,P=(I,Ce)=>{const be=((Ce+I.phase)%15.5+15.5)%15.5;return be<6.2?"ns":be<7.4?"yellow-ns":be<13.6?"ew":"yellow-ew"},D=(I,Ce)=>{const be=I.axis==="ns"?I.road:I.next,Re=I.axis==="ns"?I.next:I.road,$=b(be,Re),K=h.get($);if(!K)return null;if(K.type==="signal"){const we=P(K,Ce),Pe=we===`yellow-${I.axis}`;return we===I.axis&&!Pe?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},O=(I,Ce=!1)=>{const be=I.axis,Re=I.along,$=be==="ns"?x:_,K=I.road,we=S($,K),Pe=[],Oe=be==="ns"?y:g,nt=be==="ns"?v:f;!Ce&&Re+I.dir*o>=Oe&&Re+I.dir*o<=nt&&Pe.push({axis:be,road:I.road,along:Re,dir:I.dir,turn:!1}),we>0&&Pe.push({axis:be==="ns"?"ew":"ns",road:Re,along:K,dir:-1,turn:!0}),we<$.length-1&&Pe.push({axis:be==="ns"?"ew":"ns",road:Re,along:K,dir:1,turn:!0}),Pe.length||Pe.push({axis:be,road:I.road,along:Re,dir:-I.dir,turn:!0});const Ht=Pe.filter(Bt=>Bt.turn),at=!Ce&&Ht.length&&Math.random()<.42?M(Ht):M(Pe);(at.turn||at.axis!==be)&&Me.turns++,I.axis=at.axis,I.road=at.road,I.along=at.along,I.dir=at.dir,I.laneOffset=E(I.dir),I.next=C(I.axis,I.along,I.dir),I.turnBlend=at.turn?1:0,I.lastControlKey=null};for(let I=0;I<p;I++){const Ce=Math.random()<.56?"ns":"ew",be=u[I%u.length],Re=Math.random()<.5?-1:1,$=(be==="bus"||be==="boxTruck"?10:13)+Math.random()*9,K={axis:Ce,dir:Re,type:be,road:M(Ce==="ns"?x:_),laneOffset:E(Re),along:M(Ce==="ns"?_:x),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:Qr(be,d[I*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=C(K.axis,K.along,K.dir),An.push(K.collider),m.push(K),Pa.push(K),n.add(K.mesh),Ii.addDynamic(K.mesh,I),be==="taxi"&&Ph.attach(K.mesh),Me.types[be]=(Me.types[be]||0)+1}function Z(I,Ce=0,be=0){if(I.stolen)return;let Re=Math.max(0,I.speed*be);I.panicT>0?(I.panicT-=be,Re*=.32,I.brakePulse=1,I.avoidOffset+=(Math.sign(I.laneOffset||1)*2.1-I.avoidOffset)*Math.min(1,be*3),I.honked||(I.honked=!0,OM())):I.honked=!1;const $=w(I);for($?.crash?(np(I,l.roamPos),Re=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,be*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Re=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,be*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-be),Re=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-be),Re=0);Re>0;){const B=D(I,Ce);if(B){const yt=I.next-I.dir*(B.kind==="signal"?12:8),Vt=(yt-I.along)*I.dir;if(Vt>=-.35&&Vt<=Re+.25){I.along=yt,I.brakePulse=1,Re=0,B.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=B.key);break}}const Tt=Math.abs(I.next-I.along);if(Re<Tt)I.along+=I.dir*Re,Re=0;else{I.along=I.next,Re-=Tt;const yt=I.next<=(I.axis==="ns"?y:g)+.05||I.next>=(I.axis==="ns"?v:f)-.05;O(I,yt)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-be*3.2),I.turnBlend=Math.max(0,I.turnBlend-be*3.2);const{x:K,z:we}=A(I),Pe=I.axis==="ns"?0:I.dir,Oe=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,ce(K,we)+.28+Math.sin(Ce*3.2+I.bob)*.035,we);const nt=Math.atan2(-Pe,-Oe),Ht=Math.atan2(Math.sin(nt-I.mesh.rotation.y),Math.cos(nt-I.mesh.rotation.y));I.mesh.rotation.y+=Ht*Math.min(1,be*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(Ce*22+I.bob)*.02);for(const B of I.mesh.userData.wheels||[])B.rotation.x-=I.dir*I.speed*be*1.7;const at=I.mesh.userData.colliderHalfD,Bt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=we,I.collider.hw=I.axis==="ns"?Bt:at,I.collider.hd=I.axis==="ns"?at:Bt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of m)Z(I,0,0);Me.traffic=m.length,pn(n,(I,Ce)=>{for(const be of m)Z(be,I,Ce);Ii.update()});const te=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],J=[],ne=45;for(let I=0;I<ne;I++){const Ce=Math.random()<.56?"ns":"ew",be=e[Math.random()*e.length|0],Re=Math.abs(be.z1-be.z0)>Math.abs(be.x1-be.x0),$=Ce==="ns"?Re?"ns":"ew":Re?"ew":"ns",K=Math.random()<.5?-1:1,we=Math.random()<.5?-1:1,Pe={axis:$,dir:K,sideSign:we,coord:M($==="ns"?x:_),along:$==="ns"?r+Math.random()*(a-r):i+Math.random()*(s-i),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:_d(te[I%te.length],q[I*2%q.length])};I<14&&(Pe.axis="ns",Pe.coord=80,Pe.sideSign=I%2?-1:1,Pe.dir=I%3===0?1:-1,Pe.along=350-I*24,Pe.speed=1.5+I%4*.35),J.push(Pe),Es.push(Pe),Pe.mesh.traverse(Oe=>Oe.castShadow=!1),n.add(Pe.mesh)}const pe=new Et({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:wt}),ve=new Et({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:wt});for(let I=0;I<18;I++){const Ce=new tt,be=new z(new _n(1,12),pe.clone());be.rotation.x=-Math.PI/2,Ce.add(be);for(let Re=0;Re<7;Re++){const $=new z(new _n(.25+Math.random()*.25,8),ve.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Re)*(.6+Math.random()*1.2),.01,Math.sin(Re*1.7)*(.5+Math.random()*1.1)),Ce.add($)}Ce.visible=!1,Ce.userData.life=0,Ce.userData.maxLife=2.8,Ce.position.y=-99,n.add(Ce),Na.push(Ce)}function $e(I,Ce=0,be=0){if(!I.active)if(I.respawn-=be,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*be,I.axis==="ns"?(I.along<r-28&&(I.along=a+28),I.along>a+28&&(I.along=r-28)):(I.along<i-28&&(I.along=s+28),I.along>s+28&&(I.along=i-28));const Re=I.sideSign*(c*.66+1.2),$=I.axis==="ns"?I.coord+Re:I.along,K=I.axis==="ns"?I.along:I.coord+Re,we=I.axis==="ns"?0:I.dir,Pe=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,ce($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-we,-Pe);const Oe=Math.sin(Ce*7+I.phase);for(const nt of I.mesh.userData.limbs||[])nt.mesh.rotation.x=Oe*nt.amp*nt.side,nt.mesh.position.y=nt.baseY+Math.abs(Oe)*.025}for(const I of J)$e(I,0,0);Me.pedestrians=J.length,pn(n,(I,Ce)=>{for(const be of J)$e(be,I,Ce);La.update(Ce),qs.update(Ce);for(const be of Na){if(!be.visible)continue;be.userData.life-=Ce;const Re=be.userData.life,$=xe.clamp(Re/be.userData.maxLife,0,1);be.scale.setScalar(1+(1-$)*.35),be.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Re<=0&&(be.visible=!1)}})}function f_(){const n=new tt,e=new zt;new as().setFromAxisAngle(new L(1,0,0),-Math.PI/2),Me.roadDetails={},Me.buildingArchetypes={},Me.zones={},Me.openerProps=0;const t=Be.x0,i=Be.x1,s=Be.zNear,a=Be.zFar,r=Be.pitch,o=Be.streetW,c=r-o,h=[],d=[];for(let N=t;N<=i+1;N+=r)h.push(Math.round(N));for(let N=s;N>=a-1;N-=r)d.push(Math.round(N));const u=[];for(const N of h)u.push({x0:N,z0:s,x1:N,z1:a});for(const N of d)u.push({x0:t,z0:N,x1:i,z1:N});function m(N,k){const Y=N.x1-N.x0,ee=N.z1-N.z0,ie=Math.hypot(Y,ee)||1,he=-ee/ie,T=Y/ie;return{x0:N.x0+he*k,z0:N.z0+T*k,x1:N.x1+he*k,z1:N.z1+T*k}}function p(N,k,Y){const ee=[],ie=[];for(const T of N){const U=T.x1-T.x0,G=T.z1-T.z0,X=Math.hypot(U,G),V=Math.max(1,Math.round(X/14)),oe=U/X,ae=-(G/X),Q=oe;let fe=null,De=null;for(let Ve=0;Ve<=V;Ve++){const Ie=Ve/V,Ne=Ie*X/68,pt=T.x0+U*Ie,At=T.z0+G*Ie,It=pt+ae*k,Ct=At+Q*k,Ze=pt-ae*k,Ft=At-Q*k,xt=[It,ce(It,Ct)+Y,Ct,Ne],tn=[Ze,ce(Ze,Ft)+Y,Ft,Ne];fe&&(ee.push(fe[0],fe[1],fe[2],De[0],De[1],De[2],tn[0],tn[1],tn[2]),ee.push(fe[0],fe[1],fe[2],tn[0],tn[1],tn[2],xt[0],xt[1],xt[2]),ie.push(0,fe[3],1,De[3],1,tn[3]),ie.push(0,fe[3],1,tn[3],0,xt[3])),fe=xt,De=tn}}const he=new jt;return he.setAttribute("position",new St(ee,3)),he.setAttribute("uv",new St(ie,2)),he.computeVertexNormals(),he}const x=(mn.roadMat=new W({map:XM(),color:15132390,roughness:.62,metalness:.1,envMapIntensity:.8,side:wt}),mn.roadMat),_=new W({color:11054244,roughness:.62,metalness:.04}),g=new W({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),f=new W({color:13617592,roughness:.56,metalness:.02,emissive:3158064,emissiveIntensity:.06}),y=new W({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new W({color:3422266,roughness:.58,metalness:.48}),M=[],E=[];for(const N of u)M.push(m(N,o*.5+3.3),m(N,-13.3)),E.push(m(N,o*.5+.42),m(N,-10.42));const S=new z(p(M,2.9,.66),_);S.receiveShadow=!0,n.add(S);const C=new z(p(E,.28,.78),g);C.receiveShadow=!0,n.add(C),fs("roadDetails","sidewalkRuns",M.length),fs("roadDetails","curbRuns",E.length);const A=new z(p(u,o/2,.55),x);A.receiveShadow=!0,n.add(A);const w=new W({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:wt});n.add(new z(p(u,.4,.62),w));let b=0,P=0,D=0;for(let N=1;N<h.length-1;N++)for(let k=1;k<d.length-1;k++){const Y=h[N],ee=d[k];if(!(Sn(Y,ee,o*.75).clearance<2))for(const ie of[-1,1]){const he=new z(new le(o*.92,.07,1.15),f);he.position.set(Y,ce(Y,ee+ie*13)+.83,ee+ie*13),he.receiveShadow=!0,n.add(he);const T=new z(new le(1.15,.07,o*.92),f);T.position.set(Y+ie*13,ce(Y+ie*13,ee)+.83,ee),T.receiveShadow=!0,n.add(T),b+=2}}const O=new hd;O.moveTo(0,5.8),O.lineTo(2.5,1.6),O.lineTo(.72,1.6),O.lineTo(.72,-5.2),O.lineTo(-.72,-5.2),O.lineTo(-.72,1.6),O.lineTo(-2.5,1.6),O.closePath();const Z=new Pl(O);Z.rotateX(-Math.PI/2);for(const N of u){const k=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),Y=Math.hypot(N.x1-N.x0,N.z1-N.z0),ee=Math.max(2,Math.floor(Y/280));for(let ie=0;ie<ee;ie++){const he=(ie+.5)/ee,T=N.x0+(N.x1-N.x0)*he,U=N.z0+(N.z1-N.z0)*he;if(Sn(T,U,4).clearance<2)continue;const G=new z(Z,y);if(G.position.set(T,ce(T,U)+.86,U),G.rotation.y=k?0:Math.PI/2,G.scale.setScalar(.9),n.add(G),P++,ie%2===0){const X=new z(new We(1.05,1.05,.08,24),v);X.position.set(T+(k?3.8:0),ce(T,U)+.84,U+(k?0:3.8)),n.add(X),D++}}}fs("roadDetails","crosswalks",b),fs("roadDetails","laneArrows",P),fs("roadDetails","manholes",D);const te=new Et({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:wt,blending:ri}),q=new Et({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:wt,blending:ri});for(let N=0;N<120;N++){const k=u[Math.random()*u.length|0],Y=Math.random(),ee=k.x0+(k.x1-k.x0)*Y,ie=k.z0+(k.z1-k.z0)*Y;if(Sn(ee,ie,4).clearance<2)continue;const he=new z(new _n(1,18),(N%4===0?q:te).clone());he.rotation.x=-Math.PI/2,he.rotation.z=Math.atan2(k.x1-k.x0,k.z1-k.z0)+(Math.random()-.5)*.35,he.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),he.position.set(ee+(Math.random()-.5)*o*.7,ce(ee,ie)+.66,ie+(Math.random()-.5)*o*.7),n.add(he)}const J=[Ca(160,320,.5),Ca(160,320,.62),Ca(160,320,.42)],ne=[new W({map:J[0],color:7042688,roughness:.42,metalness:.26,emissive:16764026,emissiveMap:J[0],emissiveIntensity:.34}),new W({map:J[1],color:8550507,roughness:.46,metalness:.22,emissive:16770210,emissiveMap:J[1],emissiveIntensity:.32}),new W({map:J[2],color:4414064,roughness:.4,metalness:.3,emissive:13096959,emissiveMap:J[2],emissiveIntensity:.36})],pe=new le(1,1,1),ve=[[],[],[]],$e=[],I=[],Ce=[],be=[],Re=[],$=[],K=[],we=[],Pe=[],Oe=[],nt=[],Ht=[],at=[],Bt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],B=YM(256,256,"#dbcdb8"),Tt=$M(),yt=ZM(),Vt=[Sc(512,384,"#944737","#2e95bf"),Sc(512,384,"#7e4d3e","#d04d65"),Sc(512,384,"#a65a35","#4fba6d")],Qe=KM();function qt(N,k){fs("zones",N),fs("buildingArchetypes",k)}function ot(N,k,Y,ee,ie,he="downtown"){if(Ln(N,k,Y,ee))return!1;const T=Ra(N,k,Y,ee)-1.1;if(Vs(N,k,Y,ee,T+ie+2))return!1;if(e.position.set(N,T+ie/2,k),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),ve[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,T+ie+.6,k),e.scale.set(Y*1.04,1.2,ee*1.04),e.updateMatrix(),$e.push(e.matrix.clone()),ie>26){const U=Math.random()<.72?3790847:16730294;for(const G of[-1,1])e.position.set(N,T+ie+1.35,k+G*(ee*.52+.12)),e.scale.set(Y*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),Ce.push(U);Math.random()<.34&&be.push({px:N,pz:k,w:Y,d:ee,h:ie,gy:T,zSide:Math.random()<.5?-1:1})}if(ie>14&&Math.random()<.48){const U=Math.random()<.5?"x":"z";Re.push({px:N,pz:k,w:Y,d:ee,h:ie,gy:T,axis:U,side:Math.random()<.5?-1:1})}if(ie>28&&Math.random()<.18){const U=Math.random()<.5?"x":"z";$.push({px:N,pz:k,w:Y,d:ee,h:ie,gy:T,axis:U,side:Math.random()<.5?-1:1})}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:T+ie+2}),qt(he,ie>64?"glassTower":"midrise"),!0}function Mt(N,k,Y,ee,ie,he="residential"){if(Ln(N,k,Y,ee))return!1;const T=Ra(N,k,Y,ee)-.55,U=2+Math.random()*2.4;if(Vs(N,k,Y,ee,T+ie+U+1.5,6))return!1;e.position.set(N,T+ie/2,k),e.quaternion.identity(),e.scale.set(Y,ie,ee),e.updateMatrix(),K.push(e.matrix.clone()),un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:T+ie+U+1.5}),we.push(Bt[Math.random()*Bt.length|0]),e.position.set(N,T+ie+U/2,k),e.scale.set(Y*.82,U,ee*.82),e.updateMatrix(),Pe.push(e.matrix.clone());const G=t+Math.round((N-t)/r)*r,X=s-Math.round((s-k)/r)*r,V=Math.abs(N-G)<Math.abs(k-X),oe=V?G>N?1:-1:X>k?1:-1,ae=Math.min(V?ee*.46:Y*.46,8.5),Q=Math.min(ie*.58,4.6),fe=Math.min(24,Math.max(8,V?Math.abs(G-N)-Y*.5-o*.35:Math.abs(X-k)-ee*.5-o*.35));e.quaternion.identity(),V?(e.position.set(N+oe*(Y*.5+.1),T+Q*.5+.1,k-ee*.16),e.scale.set(.24,Q,ae),e.updateMatrix(),Oe.push(e.matrix.clone()),e.position.set(N+oe*(Y*.5+fe*.5),ce(N+oe*(Y*.5+fe*.5),k)+.08,k-ee*.16),e.scale.set(fe,.08,ae*1.18)):(e.position.set(N-Y*.16,T+Q*.5+.1,k+oe*(ee*.5+.1)),e.scale.set(ae,Q,.24),e.updateMatrix(),Oe.push(e.matrix.clone()),e.position.set(N-Y*.16,ce(N,k+oe*(ee*.5+fe*.5))+.08,k+oe*(ee*.5+fe*.5)),e.scale.set(ae*1.18,.08,fe)),e.updateMatrix(),nt.push(e.matrix.clone()),e.position.set(N,T+.02,k),e.scale.set(Y*1.58,.05,ee*1.58),e.updateMatrix(),Ht.push(e.matrix.clone());for(let De=0;De<3;De++){const Ve=V?N+oe*(Y*.55):N+(De-1)*Y*.25,Ie=V?k+(De-1)*ee*.28:k+oe*(ee*.55);e.position.set(Ve,ce(Ve,Ie)+.55,Ie);const Ne=.85+Math.random()*.75;e.scale.set(Ne*1.35,Ne,Ne*1.35),e.updateMatrix(),at.push(e.matrix.clone())}return qt(he,"residentialHouse"),!0}function F(N,k,Y,ee,ie,he="commercial"){if(Ln(N,k,Y,ee))return!1;const T=Ra(N,k,Y,ee)-.8;if(Vs(N,k,Y,ee,T+ie+2,7))return!1;const U=new W({map:Qe,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),G=new z(new le(Y,ie,ee),U);G.position.set(N,T+ie/2,k),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new W({color:7502722,roughness:.52,metalness:.15}),V=new z(new le(Y*.72,.32,ee*.18),X);V.position.set(N,T+ie*.38,k+ee*.18),V.rotation.z=.13,n.add(V);const oe=new W({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let ae=5;ae<ie;ae+=9){const Q=new z(new le(Y*1.02,.24,.22),oe);Q.position.set(N,T+ae,k+ee*.5+.14),n.add(Q)}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:T+ie+2}),qt(he,"parkingGarage"),!0}function R(N,k,Y,ee,ie,he="commercial"){if(Ln(N,k,Y,ee))return!1;const T=Ra(N,k,Y,ee)-.65;if(Vs(N,k,Y,ee,T+ie+2,7))return!1;const U=new W({map:Vt[Math.random()*Vt.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),G=new z(new le(Y,ie,ee),U);G.position.set(N,T+ie/2,k),G.castShadow=!0,G.receiveShadow=!0,n.add(G);const X=new z(new le(Y*1.06,.9,ee*1.06),new W({color:2237478,roughness:.56,metalness:.18}));X.position.set(N,T+ie+.45,k),n.add(X);const V=t+Math.round((N-t)/r)*r,oe=s-Math.round((s-k)/r)*r,ae=Math.abs(N-V)<Math.abs(k-oe),Q=ae?V>N?1:-1:oe>k?1:-1,fe=Ms[(N+k|0)%Ms.length]||"#ffd45b",De=new Et({map:wc(vs[(Math.abs(N)+Math.abs(k)|0)%vs.length],fe),transparent:!0,side:wt,depthWrite:!1}),Ve=new z(new Ut(Math.min(16,ae?ee*.82:Y*.82),4.2),De);return ae?(Ve.position.set(N+Q*(Y*.5+.2),T+ie*.66,k),Ve.rotation.y=Q>0?Math.PI/2:-Math.PI/2):(Ve.position.set(N,T+ie*.66,k+Q*(ee*.5+.2)),Ve.rotation.y=Q<0?Math.PI:0),n.add(Ve),Gs("storefront-sign",Ve.position.x,Ve.position.y,Ve.position.z),qs.addSpot(ae?N+Q*(Y*.5):N,T,ae?k:k+Q*(ee*.5),ae?Q>0?Math.PI/2:-Math.PI/2:Q<0?Math.PI:0,ae?ee:Y),un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:T+ie+2}),qt(he,"brickStorefront"),!0}qs.resetSpots();for(let N=t+r/2;N<=i-r/2;N+=r)for(let k=s-r/2;k>=a+r/2;k-=r){const Y=Sn(N,k,c*.5).clearance;if(Y<2)continue;const ee=k>40&&k<380&&N>-360&&N<360,ie=ee?"showcase":k<-920?"industrial":Y>230||k<-430?"downtown":Y<90?"residential":"commercial";if(Y<90||ee){const he=c/3;for(let T=0;T<3;T++)for(let U=0;U<3;U++){if(Math.random()<.08)continue;const G=N-c/2+he*(T+.5)+(Math.random()-.5)*he*.3,X=k-c/2+he*(U+.5)+(Math.random()-.5)*he*.3;if(Sn(G,X,8).clearance<1)continue;const V=he*(.54+Math.random()*.24),oe=he*(.54+Math.random()*.24);!ee&&Math.random()<.16?ot(G,X,V*.9,oe*.9,12+Math.random()*12,ie):Mt(G,X,V,oe,5+Math.random()*4.5,ie)}}else{const he=Y>230,T=he?xe.clamp(58+Y*1.15,68,205):xe.clamp(22+Y*.3,22,66),U=4+(Math.random()<.72?1:0)+(Math.random()<.5?1:0)+(Math.random()<.32?1:0);for(let G=0;G<U;G++){const X=15+Math.random()*Math.min(30,c*.46),V=15+Math.random()*Math.min(30,c*.46),oe=N+(Math.random()-.5)*(c-X),ae=k+(Math.random()-.5)*(c-V);if(Sn(oe,ae,Math.hypot(X,V)*.5).clearance<2)continue;const Q=(18+Math.random()*(T-18))*(he&&Math.random()<.24?1.35:1);!he&&(Math.random()<.38&&R(oe,ae,Math.max(18,X*1.12),Math.max(18,V*1.08),12+Math.random()*14,ie)||Math.random()<.18&&F(oe,ae,Math.max(24,X*1.35),Math.max(24,V*1.28),24+Math.random()*24,ie))||ot(oe,ae,X,V,Q,ie)}}}c_(n,t,i,a,s,r,o,Sn),d_(n,t,i,a,s,r,o,Sn);for(let N=0;N<3;N++){if(!ve[N].length)continue;const k=new nn(pe,ne[N],ve[N].length);for(let Y=0;Y<ve[N].length;Y++)k.setMatrixAt(Y,ve[N][Y]);k.instanceMatrix.needsUpdate=!0,k.castShadow=!0,k.receiveShadow=!0,n.add(k)}if($e.length){const N=new W({color:2896696,roughness:.62,metalness:.34}),k=new nn(pe,N,$e.length);for(let Y=0;Y<$e.length;Y++)k.setMatrixAt(Y,$e[Y]);k.instanceMatrix.needsUpdate=!0,n.add(k)}if(I.length){const N=new W({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),k=new nn(pe,N,I.length);for(let Y=0;Y<I.length;Y++)k.setMatrixAt(Y,I[Y]),k.setColorAt(Y,new rt(Ce[Y]));k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),n.add(k)}if(K.length){const N=new W({color:4891451,roughness:.88,metalness:.02}),k=new nn(pe,N,Ht.length);for(let Q=0;Q<Ht.length;Q++)k.setMatrixAt(Q,Ht[Q]);k.instanceMatrix.needsUpdate=!0,k.receiveShadow=!0,n.add(k);const Y=new W({color:12040883,roughness:.48,metalness:.05}),ee=new nn(pe,Y,nt.length);for(let Q=0;Q<nt.length;Q++)ee.setMatrixAt(Q,nt[Q]);ee.instanceMatrix.needsUpdate=!0,ee.receiveShadow=!0,n.add(ee);const ie=new W({map:B,roughness:.78,metalness:.03}),he=new nn(pe,ie,K.length);for(let Q=0;Q<K.length;Q++)he.setMatrixAt(Q,K[Q]),he.setColorAt(Q,new rt(we[Q]));he.instanceMatrix.needsUpdate=!0,he.instanceColor&&(he.instanceColor.needsUpdate=!0),he.castShadow=!0,he.receiveShadow=!0,n.add(he);const T=new Di(.72,1,4);T.rotateY(Math.PI/4);const U=new W({map:Tt,color:14314033,roughness:.72}),G=new nn(T,U,Pe.length);for(let Q=0;Q<Pe.length;Q++)G.setMatrixAt(Q,Pe[Q]);G.instanceMatrix.needsUpdate=!0,G.castShadow=!0,n.add(G);const X=new W({map:yt,roughness:.38,metalness:.18}),V=new nn(pe,X,Oe.length);for(let Q=0;Q<Oe.length;Q++)V.setMatrixAt(Q,Oe[Q]);V.instanceMatrix.needsUpdate=!0,n.add(V);const oe=new W({color:3112239,roughness:.88,metalness:.02}),ae=new nn(new Ot(1,8,6),oe,at.length);for(let Q=0;Q<at.length;Q++)ae.setMatrixAt(Q,at[Q]);ae.instanceMatrix.needsUpdate=!0,ae.castShadow=!0,ae.receiveShadow=!0,n.add(ae)}const j=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(be.length,34);N++){const k=be[N],Y=j[N%j.length],ee=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ie=new Et({map:e0(Y,ee),transparent:!0,side:wt,depthWrite:!1}),he=new z(new Ut(8,24),ie);he.position.set(k.px,k.gy+Math.max(14,k.h*.58),k.pz+k.zSide*(k.d*.5+.25)),he.rotation.y=k.zSide<0?Math.PI:0,n.add(he),Gs("vertical-neon",he.position.x,he.position.y,he.position.z)}for(let N=0;N<Math.min(Re.length,48);N++){const k=Re[N],Y=vs[(N*5+2)%vs.length],ee=Ms[(N*2+1)%Ms.length],ie=new Et({map:wc(Y,ee),transparent:!0,side:wt,depthWrite:!1}),he=Math.min(17,(k.axis==="x"?k.d:k.w)*.82),T=new z(new Ut(he,4.7),ie),U=k.gy+Math.max(6.2,Math.min(k.h-3.5,k.h*(.28+N%3*.12)));k.axis==="x"?(T.position.set(k.px+k.side*(k.w*.5+.22),U,k.pz),T.rotation.y=k.side>0?Math.PI/2:-Math.PI/2):(T.position.set(k.px,U,k.pz+k.side*(k.d*.5+.22)),T.rotation.y=k.side<0?Math.PI:0),n.add(T),Gs("wall-sign",T.position.x,T.position.y,T.position.z)}for(let N=0;N<Math.min($.length,18);N++){const k=$[N],Y=vs[(N*7+4)%vs.length],ee=ml[(N*5+3)%ml.length],ie=Ms[(N+3)%Ms.length],he=new tt,T=new W({map:_f(Y,ee,ie),color:16777215,roughness:.2,metalness:.06,emissive:new rt(ie),emissiveIntensity:.34}),U=Math.min(18,(k.axis==="x"?k.d:k.w)*.86),G=new z(new le(U,5.2,.42),T);G.position.y=4.8,he.add(G);const X=new W({color:1053978,roughness:.44,metalness:.28});for(const V of[-U*.34,U*.34]){const oe=new z(new We(.13,.17,5,8),X);oe.position.set(V,2.25,-.2),he.add(oe)}he.position.set(k.px,k.gy+k.h+.7,k.pz),he.rotation.y=k.axis==="x"?k.side>0?Math.PI/2:-Math.PI/2:k.side<0?Math.PI:0,n.add(he),Gs("roof-billboard",he.position.x,he.position.y+4.8,he.position.z)}const ue=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ge=Dn([new le(2.2,.72,4.6).translate(0,.78,0),new le(1.7,.56,2.15).translate(0,1.42,-.22)]),re=Dn([[-1.16,-1.5],[1.16,-1.5],[-1.16,1.5],[1.16,1.5]].map(([N,k])=>new We(.36,.36,.3,10).rotateZ(Math.PI/2).translate(N,.38,k))),et=130,Fe=new nn(ge,new W({roughness:.42,metalness:.36}),et),it=new nn(re,new W({color:1512727,roughness:.9}),et);Ii.resetStatic();let Ye=0,_e=0;for(;Ye<et&&_e<et*6;){_e++;const N=Math.random()<.5,k=N?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(i-t),Y=N?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.26);if(Sn(k,Y,4).clearance<2)continue;const ee=ce(k,Y)+.06;e.position.set(k,ee,Y),e.quaternion.setFromAxisAngle(sn,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Fe.setMatrixAt(Ye,e.matrix),it.setMatrixAt(Ye,e.matrix),Fe.setColorAt(Ye,new rt(ue[Math.random()*ue.length|0])),Mn.spots.push({x:k,z:Y,yaw:N?0:-Math.PI/2,idx:Ye,taken:!1}),Ii.addStatic(e.matrix,2.3,Ye,Mn.spots[Mn.spots.length-1]),Ye++}Fe.count=Ye,it.count=Ye,Fe.instanceMatrix.needsUpdate=!0,it.instanceMatrix.needsUpdate=!0,Fe.instanceColor&&(Fe.instanceColor.needsUpdate=!0),Fe.castShadow=!0,Mn.im=Fe,Mn.imW=it,n.add(Fe),n.add(it);const Le=new Map,ht=(N,k)=>`${Math.round(N)},${Math.round(k)}`;function ct(N,k){const Y=((k+N.phase)%15.5+15.5)%15.5;return Y<6.2?{green:"ns",yellow:null}:Y<7.4?{green:null,yellow:"ns"}:Y<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Xe(){const N=[],k=new W({color:1120028,roughness:.38,metalness:.62}),Y=new W({color:1382685,roughness:.34,metalness:.38}),ee=JM(),ie=new Et({map:ee,transparent:!0,side:wt}),he=new W({color:5050642,roughness:.48,metalness:.12}),T=(ae,Q)=>new W({color:ae,roughness:.16,metalness:.02,emissive:Q,emissiveIntensity:.2}),U=(ae,Q,fe,De,Ve,Ie)=>{const Ne=new tt,pt=new z(new le(1.15,2.85,.75),Y);Ne.add(pt);const At=T(16724008,16717836),It=T(16767053,16757276),Ct=T(4521842,1693789),Ze=[At,It,Ct];for(let Ft=0;Ft<3;Ft++){const xt=new z(new Ot(.28,12,8),Ze[Ft]);xt.position.set(0,.78-Ft*.78,-.42),Ne.add(xt)}Ne.position.set(fe,De,Ve),Ne.rotation.y=Ie,ae.add(Ne),N.push({axis:Q,red:At,yellow:It,green:Ct,control:ae.userData.control})},G=(ae,Q,fe)=>{const De=ht(ae,Q),Ve={type:"signal",x:ae,z:Q,phase:fe%4*2.1};Le.set(De,Ve);const Ie=ce(ae,Q),Ne=new tt;Ne.userData.control=Ve;const pt=o*.72,At=o*.72,It=new z(new We(.18,.24,8.2,8),k);It.position.set(pt,4.1,At),Ne.add(It);const Ct=new z(new le(o*1.65,.2,.2),k);Ct.position.set(pt-o*.72,8,At),Ne.add(Ct);const Ze=new z(new le(.2,.2,o*1.65),k);Ze.position.set(pt,7.55,At-o*.72),Ne.add(Ze),U(Ne,"ns",pt-o*1.24,7.52,At,0),U(Ne,"ns",pt-o*.18,7.52,-At,Math.PI),U(Ne,"ew",pt,7.05,At-o*1.24,Math.PI/2),U(Ne,"ew",-pt,7.05,At-o*.18,-Math.PI/2),Ne.position.set(ae,Ie,Q),Ne.traverse(Ft=>{Ft.castShadow=!0,Ft.receiveShadow=!0}),n.add(Ne)},X=(ae,Q,fe)=>{const De=ht(ae,Q);Le.set(De,{type:"stop",x:ae,z:Q,phase:0});const Ve=ce(ae,Q),Ie=new tt,Ne=fe%2?-1:1,pt=fe%3?1:-1,At=new z(new We(.12,.16,4.2,7),k);At.position.y=2.1,Ie.add(At);const It=new z(new _n(1.04,8),he);It.position.y=4.55,It.rotation.y=Math.PI,Ie.add(It);const Ct=new z(new Ut(2.05,2.05),ie);Ct.position.set(0,4.55,-.04),Ie.add(Ct),Ie.position.set(ae+Ne*o*.74,Ve,Q+pt*o*.74),Ie.rotation.y=Math.atan2(Ne,pt),Ie.traverse(Ze=>{Ze.castShadow=!0,Ze.receiveShadow=!0}),n.add(Ie)};let V=0,oe=0;for(let ae=1;ae<h.length-1;ae++)for(let Q=1;Q<d.length-1;Q++){const fe=h[ae],De=d[Q];if(Sn(fe,De,o*.9).clearance<2)continue;const Ve=Math.abs(fe-80)<=r*1.05&&De<=s&&De>=-560,Ie=De<-260&&De>-1180&&(ae+Q)%4===0,Ne=De>-360&&(ae+Q)%2===0;Ve&&Q%2===0||Ie?G(fe,De,V++):(Ne||(ae+Q)%5===0&&De>-820)&&X(fe,De,oe++)}return pn(n,ae=>{for(const Q of N){const fe=ct(Q.control,ae);Q.red.emissiveIntensity=fe.green===Q.axis||fe.yellow===Q.axis?.12:2.3,Q.yellow.emissiveIntensity=fe.yellow===Q.axis?2.6:.12,Q.green.emissiveIntensity=fe.green===Q.axis?2.6:.1}}),{trafficLights:V,stopSigns:oe}}const ut=Xe();u_(n,u,{X0:t,X1:i,ZN:s,ZF:a,pitch:r,streetW:o,trafficControls:Le}),Me.trafficLights=ut.trafficLights,Me.stopSigns=ut.stopSigns;const H=new We(.12,.16,7.2,7),Ge=new Ot(.46,10,8),ke=new Ut(2.8,13),ze=new W({color:1581353,roughness:.42,metalness:.68}),Te=new W({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),me=new Et({color:16760163,transparent:!0,opacity:.07,depthWrite:!1,side:wt,blending:ri}),Je=qM(),ft=new Al({map:Je,color:16765818,transparent:!0,opacity:.68,depthWrite:!1,depthTest:!0,blending:ri}),Wt=132,Nt=new nn(H,ze,Wt),kn=new nn(Ge,Te,Wt),Cn=new nn(ke,me,Wt);let hi=0;for(let N=0;N<Wt*2&&hi<Wt;N++){const k=Math.random()<.5,Y=k?t+Math.round(Math.random()*((i-t)/r))*r+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(i-t),ee=k?a+Math.random()*(s-a):s-Math.round(Math.random()*((s-a)/r))*r+(Math.random()<.5?-1:1)*(o*.58);if(Sn(Y,ee,3).clearance<2)continue;const ie=ce(Y,ee);e.quaternion.identity(),e.position.set(Y,ie+3.6,ee),e.scale.set(1,1,1),e.updateMatrix(),Nt.setMatrixAt(hi,e.matrix),e.position.set(Y,ie+7.5,ee),e.updateMatrix(),kn.setMatrixAt(hi,e.matrix);const he=new hl(ft);he.position.set(Y,ie+7.5,ee);const T=6.2+Math.random()*2.4;he.scale.set(T,T,1),n.add(he),bs.streetGlowSprites++,e.position.set(Y,ie+.72,ee),e.quaternion.setFromAxisAngle(new L(1,0,0),-Math.PI/2),e.rotateZ(k?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Cn.setMatrixAt(hi,e.matrix),hi++}Nt.count=hi,kn.count=hi,Cn.count=hi,Nt.instanceMatrix.needsUpdate=!0,kn.instanceMatrix.needsUpdate=!0,Cn.instanceMatrix.needsUpdate=!0,n.add(Nt,kn,Cn),Me.streetLights=hi,n.add(new z(p([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),_)),n.add(new z(p([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),_)),n.add(new z(p([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),g)),n.add(new z(p([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const so=new W({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const k=new z(new le(1.15,.09,13.5),so);k.position.set(80,ce(80,N)+.9,N),k.receiveShadow=!0,n.add(k)}for(const N of[286,156,26,-104])for(let k=0;k<7;k++){const Y=new z(new le(2,.08,11.8),f),ee=71.2+k*2.95;Y.position.set(ee,ce(ee,N)+.91,N),Y.receiveShadow=!0,n.add(Y),fs("roadDetails","openerCrosswalkStripes")}function er(N,k,Y,ee=!1){const ie=ce(N,k),he=new tt,T=new z(new We(.16,.22,9.5,8),ze);T.position.y=4.75,he.add(T);const U=new z(new le(3.8,.22,.22),ze);U.position.set(Y*1.75,8.95,0),he.add(U);const G=new z(new Ot(.62,12,8),Te);G.position.set(Y*3.6,8.82,0),he.add(G);const X=new hl(ft.clone());X.position.copy(G.position),X.material.opacity=.78+Math.random()*.12,X.scale.set(8.8,8.8,1),he.add(X),bs.streetGlowSprites++;const V=new z(new Ut(3.2,15),me.clone());if(V.position.set(Y*2.8,.72,0),V.rotation.x=-Math.PI/2,V.scale.y=.7+Math.random()*.35,he.add(V),ee){const oe=new fd(16762474,4.4,66,2);oe.position.copy(G.position),he.add(oe)}he.position.set(N,ie,k),n.add(he),Me.streetLights++}let Si=0;for(let N=340;N>=-700;N-=118)er(63,N,1,Si++%3===0),er(97,N-42,-1,Si++%3===0);function Ti(N,k,Y,ee,ie=6010942){const he=new W({color:ie,roughness:.92,metalness:.01}),T=new z(new le(Y,.08,ee),he);return T.position.set(N,ce(N,k)+.06,k),T.receiveShadow=!0,n.add(T),Me.openerProps++,T}function Ei(N,k,Y=1){const ee=ce(N,k),ie=new tt,he=new z(new We(.35,.55,5.5,8),new W({color:6832160,roughness:.88}));he.position.y=2.75,ie.add(he);const T=new W({color:6065982,roughness:.86}),U=new W({color:3959601,roughness:.9}),G=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let X=0;X<G.length;X++){const[V,oe,ae,Q]=G[X],fe=new z(new Ot(Q,12,8),X%2?U:T);fe.position.set(V,oe,ae),fe.scale.y=.78,fe.castShadow=!0,ie.add(fe)}return ie.position.set(N,ee,k),ie.scale.setScalar(Y),n.add(ie),vi.push({kind:"tree",x:N,z:k,radius:3.4*Y,maxY:ee+11*Y}),Me.openerProps++,ie}function tr(N,k,Y=0){const ee=new tt,ie=new W({color:10970418,roughness:.64,metalness:.04}),he=new W({color:1910317,roughness:.46,metalness:.5});for(const T of[1.05,1.55]){const U=new z(new le(6.8,.22,.44),ie);U.position.y=T,ee.add(U)}for(const T of[-2.7,2.7]){const U=new z(new le(.22,1.2,.35),he);U.position.set(T,.62,0),ee.add(U)}ee.position.set(N,ce(N,k),k),ee.rotation.y=Y,n.add(ee),Me.openerProps++}function ra(N,k){const Y=new W({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),ee=new tt,ie=new z(new We(.34,.42,1.25,12),Y);ie.position.y=.65,ee.add(ie);const he=new z(new Ot(.42,12,8),Y);he.position.y=1.32,ee.add(he);const T=new z(new We(.16,.16,1.1,10),Y);T.rotation.z=Math.PI/2,T.position.y=.9,ee.add(T),ee.position.set(N,ce(N,k),k),n.add(ee),Me.openerProps++}function ao(N,k,Y=0){const ee=new tt,ie=new W({color:1185821,roughness:.36,metalness:.68}),he=new W({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),T=new W({color:2370611,roughness:.42,metalness:.32}),U=new z(new le(8.5,.35,3.2),T);U.position.y=4.2,ee.add(U);for(const V of[-3.8,3.8]){const oe=new z(new We(.09,.11,4.1,7),ie);oe.position.set(V,2.05,-1.25),ee.add(oe)}const G=new z(new le(8,2.8,.08),he);G.position.set(0,2.2,1.35),ee.add(G);const X=new z(new Ut(2.3,2.8),new Et({map:wc("BUS","#4ff3ff"),transparent:!0,side:wt}));X.position.set(-2.4,2.2,1.42),ee.add(X),ee.position.set(N,ce(N,k),k),ee.rotation.y=Y,n.add(ee),Gs("bus-shelter-ad",N,ce(N,k)+2.2,k),Me.openerProps++}function xn(N,k,Y,ee,ie,he,T,U=null,G=0){if(Ln(N,k,Y,ee,12))return!1;const X=ce(N,k)-.45;if(Vs(N,k,Y,ee,X+ie+2))return!1;const V=N<80?1:-1,oe=new W({map:Ca(192,512,T),color:he,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),ae=new z(new le(Y,ie,ee),oe);ae.position.set(N,X+ie/2,k),ae.castShadow=!1,ae.receiveShadow=!0,n.add(ae);const Q=new W({map:Ca(220,620,Math.min(.86,T+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:wt}),fe=new z(new Ut(ee*.78,ie*.74),Q);fe.position.set(N+V*(Y/2+.09),X+ie*.54,k),fe.rotation.y=V>0?Math.PI/2:-Math.PI/2,n.add(fe);for(const Ie of[-1,1]){const Ne=new z(new Ut(Y*.82,ie*.72),Q.clone());Ne.position.set(N,X+ie*.55,k+Ie*(ee/2+.1)),Ne.rotation.y=Ie>0?0:Math.PI,n.add(Ne)}const De=new z(new le(Y*1.04,1.2,ee*1.04),new W({color:1778733,roughness:.34,metalness:.38}));De.position.set(N,X+ie+.7,k),n.add(De);const Ve=new W({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ie of[-1,1]){const Ne=new z(new le(Y*1.1,.22,.18),Ve);Ne.position.set(N,X+ie+1.4,k+Ie*(ee/2+.18)),n.add(Ne)}if(U&&G){const Ie=new Et({map:e0(U,U==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:wt,depthWrite:!1}),Ne=new z(new Ut(7.5,24),Ie);Ne.position.set(N+G*(Y/2+.3),X+Math.min(ie-8,ie*.58),k),Ne.rotation.y=G>0?Math.PI/2:-Math.PI/2,n.add(Ne),Gs("showcase-neon",Ne.position.x,Ne.position.y,Ne.position.z)}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:X+ie+2}),qt("showcase","glassTower"),!0}function ro(N,k,Y,ee=3.2){const ie=N*.5+ee,he=k*.5+ee,T=Math.max(2,Math.abs(ie-he)*.72),U=N>=k?[-ie,0,-he,ie,0,-he,T,Y,0,-ie,0,-he,T,Y,0,-T,Y,0,ie,0,-he,ie,0,he,T,Y,0,ie,0,he,-ie,0,he,-T,Y,0,ie,0,he,T,Y,0,-T,Y,0,-ie,0,he,-ie,0,-he,-T,Y,0]:[-ie,0,-he,ie,0,-he,0,Y,-T,ie,0,-he,ie,0,he,0,Y,T,ie,0,-he,0,Y,T,0,Y,-T,ie,0,he,-ie,0,he,0,Y,T,-ie,0,he,-ie,0,-he,0,Y,-T,-ie,0,he,0,Y,-T,0,Y,T],G=new jt;return G.setAttribute("position",new St(U,3)),G.computeVertexNormals(),G}function nr(N,k,Y,ee,ie,he,T={}){if(Ln(N,k,Y,ee,12))return!1;const U=ce(N,k)-.3;if(Vs(N,k,Y,ee,U+ie+(T.roofH??8.2)+1,6))return!1;const G=T.frontZ??-1,X=new W({map:B,color:T.wallColor??14734788,roughness:.68,metalness:.03}),V=new z(new le(Y,ie,ee),X);V.position.set(N,U+ie/2,k),V.castShadow=!0,V.receiveShadow=!0,n.add(V);const oe=new W({map:Tt,color:he,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),ae=T.roofH??8.2,Q=new z(ro(Y,ee,ae),oe);Q.position.set(N,U+ie,k),Q.castShadow=!0,Q.receiveShadow=!0,n.add(Q);const fe=new W({color:15985112,roughness:.42,metalness:.05}),De=new z(new le(Y+7,.42,1.2),fe);De.position.set(N,U+ie+.12,k+G*(ee*.5+1.4)),n.add(De);const Ve=De.clone();Ve.position.z=k-G*(ee*.5+1.4),n.add(Ve);const Ie=Math.min(18,Y*.38),Ne=new z(new le(Ie,ie*.55,.32),new W({map:yt,roughness:.34,metalness:.2}));Ne.position.set(N+Y*.18,U+ie*.33,k+G*(ee*.5+.22)),n.add(Ne);const pt=new z(new le(5.2,7.2,.28),new W({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));pt.position.set(N-Y*.25,U+3.7,k+G*(ee/2+.24)),n.add(pt);const At=new W({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),It=new W({color:3353638,roughness:.38});for(const an of[-Y*.36,-Y*.05,Y*.38]){if(Math.abs(an-Y*.18)<Ie*.45)continue;const ei=new z(new le(6.2,4.8,.26),It);ei.position.set(N+an,U+ie*.58,k+G*(ee*.5+.28)),n.add(ei);const Yt=new z(new le(4.8,3.4,.3),At);Yt.position.copy(ei.position),Yt.position.z+=G*.04,n.add(Yt)}const Ct=new W({color:12370619,roughness:.44,metalness:.04}),Ze=new z(new le(Ie*1.18,.12,34),Ct);Ze.position.set(N+Y*.18,ce(N+Y*.18,k+G*(ee*.5+17))+.11,k+G*(ee*.5+17)),n.add(Ze);const Ft=new W({color:5679925,roughness:.86,metalness:.01}),xt=new z(new le(Y+10,.08,ee+12),Ft);xt.position.set(N,ce(N,k)-.18,k),xt.receiveShadow=!0,n.add(xt),xt.renderOrder=-1;const tn=new W({color:3042609,roughness:.84}),Yi=[new W({color:16766544,roughness:.58}),new W({color:16738974,roughness:.58}),new W({color:16314584,roughness:.58})];for(let an=0;an<9;an++){const ei=N-Y*.44+an*(Y*.11),Yt=k+G*(ee*.5+2.2+an%2*1.5),gn=new z(new Ot(1.35+an%3*.22,10,7),an%4===0?Yi[an%Yi.length]:tn);gn.position.set(ei,ce(ei,Yt)+.95,Yt),gn.scale.y=.72,gn.castShadow=!0,n.add(gn)}return un.push({x:N,z:k,hw:Y*.5,hd:ee*.5,maxY:U+ie+5}),qt("showcase","lowStorefront"),!0}return Ti(45,318,36,84,6404169),Ti(116,318,36,84,6074179),Ti(44,188,34,84,6798662),Ti(118,188,36,84,5941822),Ti(43,60,34,82,5679164),Ti(118,60,36,82,6864197),xn(18,315,70,54,154,2311775,.72,"HOTEL",1),xn(17,185,72,58,188,1522779,.78,null,0),xn(31,55,44,56,138,2840688,.66,"OPEN",1),xn(24,-75,52,64,182,1913933,.7,null,0),xn(145,315,68,54,116,2776440,.72,null,0),xn(146,185,70,58,146,2314602,.76,null,0),xn(142,55,42,56,156,1590364,.68,"CAFE",-1),xn(134,-75,48,64,114,3688540,.62,null,0),xn(-70,315,52,52,146,2112085,.68,null,0),xn(228,185,48,58,148,3235186,.66,null,0),xn(-78,185,48,56,134,2181730,.68,null,0),xn(236,315,44,54,104,3104884,.66,null,0),nr(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),nr(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),xn(-48,-360,54,56,148,2439765,.58,null,0),xn(172,-430,50,56,132,3817032,.66,"OPEN",-1),Ei(112,227,1.35),Ei(104,221,1.05),Ei(121,233,1.15),tr(112,217,0),Ei(50,292,1.2),Ei(111,316,.95),Ei(48,137,.9),Ei(116,102,1.05),tr(47,248,Math.PI/2),ra(57,226),ao(111,260,-Math.PI/2),Se.add(n),n}function Ef(n,{dirSel:e=1,rampType:t="on",merge:i=16,runBack:s=165,runOut:a=52,label:r="ON RAMP"}={}){const o=mt(i),c=new L(o.tangent.x,0,o.tangent.z).normalize(),h=new L().crossVectors(sn,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*se.width*.5),u=t==="off"?1:-1,m=d.x+c.x*s*u+h.x*e*a,p=d.z+c.z*s*u+h.z*e*a,x=new L(m,ce(m,p)+.4,p),_=t==="off"?d:x,g=t==="off"?x:d,f=26,y=[];for(let q=0;q<=f;q++){const J=q/f,ne=J*J*(3-2*J),pe=t==="off"?1-(1-J)*(1-J):ne;y.push(new L(xe.lerp(_.x,g.x,J),xe.lerp(_.y,g.y,pe),xe.lerp(_.z,g.z,J)))}const v=7.4,M=new L,E=new L,S=[],C=[];for(let q=0;q<=f;q++)E.subVectors(y[Math.min(f,q+1)],y[Math.max(0,q-1)]),E.y=0,E.normalize(),M.crossVectors(sn,E).normalize(),S.push(y[q].clone().addScaledVector(M,-v)),C.push(y[q].clone().addScaledVector(M,v));const A={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:i,exitS:i,points:y.map(q=>q.clone()),segments:[]};for(let q=0;q<f;q++){const J=y[q],ne=y[q+1],pe=ne.x-J.x,ve=ne.z-J.z,$e=Math.max(1e-4,pe*pe+ve*ve);A.segments.push({a:J.clone(),b:ne.clone(),abx:pe,abz:ve,lenSq:$e,u0:q/f,u1:(q+1)/f})}aa.push(A);const w=[];for(let q=0;q<f;q++){const J=S[q],ne=C[q],pe=S[q+1],ve=C[q+1];w.push(J.x,J.y,J.z,ne.x,ne.y,ne.z,ve.x,ve.y,ve.z),w.push(J.x,J.y,J.z,ve.x,ve.y,ve.z,pe.x,pe.y,pe.z)}const b=new jt;b.setAttribute("position",new St(w,3)),b.computeVertexNormals();const P=new W({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:wt});n.add(new z(b,P));const D=new W({color:12107972,roughness:.5,metalness:.4});for(let q=0;q<f;q++)Hn(n,S[q].clone().setY(S[q].y+1),S[q+1].clone().setY(S[q+1].y+1),.16,D),Hn(n,C[q].clone().setY(C[q].y+1),C[q+1].clone().setY(C[q+1].y+1),.16,D);const O=new W({color:7173241,roughness:.82});for(let q=3;q<f;q+=3){const J=y[q],ne=ce(J.x,J.z),pe=J.y-ne;if(pe<3||Ln(J.x,J.z,3.2,3.2,1.2))continue;const ve=new z(new We(.9,1.15,pe,8),O);ve.position.set(J.x,ne+pe/2,J.z),n.add(ve),si.push({x:J.x,z:J.z,hw:1.3,hd:1.3,maxY:J.y-.9})}const Z=new Et({map:yd(r),transparent:!0,side:wt}),te=new z(new Ut(12,3),Z);te.position.copy(t==="off"?d:x).add(new L(0,t==="off"?6.2:5.5,0)),te.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),n.add(te);for(const q of[-1,1]){const J=new z(new We(.2,.26,6,6),O),ne=t==="off"?d:x;J.position.set(ne.x+h.x*q*5.4,ne.y+3,ne.z+h.z*q*5.4),n.add(J)}}function p_(n,e=1){Ef(n,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function m_(n,e=-1){Ef(n,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function x_(){const n=new tt,e=[],t=new rt(14170671),i=new rt(15922680),s=new W({color:3883336,roughness:.6,metalness:.3}),a=new Et({map:g_(),transparent:!0,side:wt}),r=new W({color:4926748,roughness:.9}),o=[new W({color:2055221,roughness:.92}),new W({color:3109954,roughness:.95}),new W({color:2583370,roughness:.9})],c=new W({color:7040883,roughness:.95,side:wt}),h=12,d=[],u=[];let m=0;for(let x=0;x<se.length;x+=h){if(Vi(x+h*.5)){m++;continue}const _=mt(x),g=mt(x+h),f=_.p.clone().add(g.p).multiplyScalar(.5),{sideways:y,normal:v,q:M}=ns(_,g);for(const E of[-1,1]){const S=f.clone().addScaledVector(y,E*se.width*.5).addScaledVector(v,.5);d.push(S),u.push(M),e.push(m%2===0?t:i)}if(m%16===8){const E=(m>>4)%2?1:-1,S=f.clone().addScaledVector(y,E*se.width*.52).addScaledVector(v,.4),C=new tt,A=new z(new Ut(4.4,2.6),a);A.position.y=3.4,A.rotation.y=Math.PI,C.add(A);const w=new We(.12,.16,3.4,5);for(const b of[-1.5,1.5]){const P=new z(w,s);P.position.set(b,1.7,0),C.add(P)}C.position.copy(S),C.quaternion.copy(M),n.add(C)}m++}for(let x=0;x<se.length;x+=16){const _=mt(x),g=1+(Math.random()<.5?1:0);for(let f=0;f<g;f++){const y=Math.random()<.5?-1:1,v=se.width/2+12+Math.random()*78,M=_.p.x+_.side.x*v*y+(Math.random()-.5)*16,E=_.p.z+_.side.z*v*y+(Math.random()-.5)*16;if(Fl(M,E,18)||Ln(M,E,12,12,3.5))continue;const S=ce(M,E);if(Math.random()<.78){const C=.7+Math.random()*1.5,A=new tt,w=2.4+Math.random()*4.2,b=new z(new We(.26,.42,w,6),r);b.position.y=w/2,A.add(b);const P=2+Math.floor(Math.random()*3);for(let D=0;D<P;D++){const O=new z(new Di(2.4+Math.random()*1.6-D*.2,4.6+Math.random()*2.4,7),o[(f+D+x)%o.length]);O.position.y=w+D*1.4+1.5,O.rotation.y=Math.random()*Math.PI,A.add(O)}A.position.set(M,S+.6,E),A.scale.setScalar(C),n.add(A)}else{const C=1.4+Math.random()*3.6,A=new z(new od(C,0),c);A.position.set(M,S+C*.35,E),A.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),A.scale.set(1,.7+Math.random()*.4,1),n.add(A),si.push({kind:"rock",x:M,z:E,radius:C*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const _=se.length*x/3+6;if(Vi(_))continue;const g=mt(_),f=mt(_+h),y=g.p.clone().add(f.p).multiplyScalar(.5),{q:v}=ns(g,f),M=se.width*.5+1.2,E=9,S=new tt,C=new We(.4,.55,E,7);for(const D of[-1,1]){const O=new z(C,s);O.position.set(D*M,E/2,0),S.add(O)}const A=M*2,w=new z(new le(A,1.1,1.1),s);w.position.y=E,S.add(w);const b=new Et({map:yd(p[x]),transparent:!0,side:wt}),P=new z(new Ut(A*.82,3),b);P.position.set(0,E-2,0),P.rotation.y=Math.PI,S.add(P),S.position.copy(y),S.quaternion.copy(v),n.add(S)}if(d.length){const x=new We(.18,.24,3,6);x.translate(0,1.5,0);const _=new Ot(.34,8,6);_.translate(0,3.2,0);const g=new W({color:10134440,roughness:.7,metalness:.2}),f=new W({roughness:.55}),y=new nn(x,g,d.length),v=new nn(_,f,d.length),M=new zt;for(let E=0;E<d.length;E++)M.position.copy(d[E]),M.quaternion.copy(u[E]),M.updateMatrix(),y.setMatrixAt(E,M.matrix),v.setMatrixAt(E,M.matrix),v.setColorAt(E,e[E]);y.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),n.add(y),n.add(v)}return p_(n),m_(n),Se.add(n),n}function g_(){const n=document.createElement("canvas");n.width=256,n.height=160;const e=n.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,n.width,n.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let i=-1;i<4;i++){e.beginPath();const s=i*70;e.moveTo(s,16),e.lineTo(s+40,n.height/2),e.lineTo(s,n.height-16),e.lineTo(s+18,n.height-16),e.lineTo(s+58,n.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new Qt(n);return t.colorSpace=Pt,t}function yd(n){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2);const i=new Qt(e);return i.colorSpace=Pt,i}function v_(n,e){const t=document.createElement("canvas");t.width=128,t.height=64;const i=t.getContext("2d"),s="#"+n.toString(16).padStart(6,"0"),a="#"+e.toString(16).padStart(6,"0"),r=8;for(let c=0;c<r;c++)i.fillStyle=c%2?s:a,i.fillRect(c/r*t.width,0,t.width/r+1,t.height);const o=new Qt(t);return o.colorSpace=Pt,o}function M_(){const n=document.createElement("canvas");n.width=256,n.height=128;const e=n.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,n.width,n.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const a=Math.random()*n.width,r=Math.random()*n.height;e.fillRect(a,r,2.4,2.4)}const i=new Qt(n);return i.colorSpace=Pt,i.wrapS=Nn,i.repeat.set(3,1),i}function en(n,e,t,i,s){const a=new z(new le(e.x,e.y,e.z),s);return a.position.copy(t),a.quaternion.copy(i),a.castShadow=!1,a.receiveShadow=!0,n.add(a),a}function ns(n,e){const t=e.p.clone().sub(n.p).normalize(),i=xd.crossVectors(sn,t).normalize();let s=t.clone().cross(i).normalize();const a=(n.bank+e.bank)*.5;if(Math.abs(a)>.001){const c=new as().setFromAxisAngle(t,a);i.applyQuaternion(c),s.applyQuaternion(c)}const r=new bt().makeBasis(i,s,t),o=new as().setFromRotationMatrix(r);return{tangent:t,sideways:i,normal:s,q:o}}function s0(n,e,t,i){const s=[],a=[],r=[],o=se.width*.47;let c=0;for(let u=e;u<=t;u+=8){const m=mt(Math.min(u,t)),p=ns(m,mt(m.s+2)),x=Math.sin(u*.018)*.04,_=m.p.clone().addScaledVector(p.sideways,-o).addScaledVector(p.normal,.46+x),g=m.p.clone().addScaledVector(p.sideways,o).addScaledVector(p.normal,.46-x);s.push(_.x,_.y,_.z,g.x,g.y,g.z);const f=(u-e)/64;if(a.push(0,f,1,f),c>0){const y=(c-1)*2,v=c*2;r.push(y,y+1,v,y+1,v+1,v)}c++}const h=new jt;h.setAttribute("position",new St(s,3)),h.setAttribute("uv",new St(a,2)),h.setIndex(r),h.computeVertexNormals();const d=new z(h,i);d.receiveShadow=!0,n.add(d)}function __(n,e){let t=0;for(const i of se.gaps)s0(n,t,Math.max(t,i.start-4),e),t=i.end+4;s0(n,t,se.length,e)}function y_(n,e,t){const i=mt(e.s+2),{normal:s,q:a}=ns(e,i),r=new tt;r.position.copy(e.p).addScaledVector(s,.73),r.quaternion.copy(a);const o=new z(new le(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,r.add(o);const c=new z(new le(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,r.add(c);const h=new z(new le(.42,.1,3.8),t);h.position.set(0,.01,-1.9),r.add(h),n.add(r)}function b_(){const n=new tt;Se.add(n),Ch=0;const e=new W({color:12171149,roughness:.72,metalness:.08}),t=new W({color:9869942,roughness:.78,metalness:.05}),i=new W({color:15255629,roughness:.28,metalness:.72}),s=new W({color:8204328,roughness:.3,metalness:.85}),a=new W({color:6120040,roughness:.5,metalness:.6}),r=new W({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new W({color:14270570,roughness:.35,metalness:.65}),c=new W({color:7174288,roughness:.5,metalness:.55,emissive:2765904,emissiveIntensity:.22}),h=new W({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new W({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new W({color:4935486,roughness:.92,metalness:.04}),m=new W({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new W({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new W({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),_=new W({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),g=new W({color:15919561,roughness:.82,metalness:.02});new W({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const f=new W({map:HM(),roughness:.74,metalness:.08}),y=new Et({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;__(n,f);function M(E,S=!1){if(Vi(E))return!1;const C=mt(E),A=mt(E+3),{sideways:w,normal:b,q:P}=ns(C,A),D=C.p,O=ce(D.x,D.z),Z=D.y-.95;if(Z-O<10)return!1;const te=se.width*(S?.43:.35),q=Z,J=O+.25,ne=S?.56:.42,pe=S?2.4:1.75,ve=S?.52:.36,$e=[],I=[];for(const we of[-1,1])if(Ln(D.x+w.x*we*te,D.z+w.z*we*te,pe*2.2,pe*2.2,1.2))return!1;for(const we of[-1,1]){const Pe=D.clone().addScaledVector(w,we*te).addScaledVector(b,-.85);Pe.y=q;const Oe=new L(Pe.x,J,Pe.z);Hn(n,Oe,Pe,ne,a);const nt=new z(new We(pe,pe*1.12,ve,12),a);nt.position.set(Oe.x,O+ve*.5,Oe.z),nt.receiveShadow=!0,n.add(nt),$e.push(Pe),I.push(Oe),si.push({x:Oe.x,z:Oe.z,hw:pe*.92,hd:pe*.92,maxY:q-.7})}const Ce=D.clone().addScaledVector(b,-1.05);Ce.y=q,en(n,new L(se.width*.92,S?.58:.42,S?1.55:1.15),Ce,P,r);const be=I[0].clone();be.y+=(q-J)*.28;const Re=I[1].clone();Re.y+=(q-J)*.28;const $=$e[0].clone();$.y-=1;const K=$e[1].clone();if(K.y-=1,Hn(n,be,K,S?.18:.14,c),Hn(n,Re,$,S?.18:.14,c),S){const we=I[0].clone();we.y+=(q-J)*.58;const Pe=I[1].clone();Pe.y+=(q-J)*.58,Hn(n,I[0].clone().setY(J+1.2),Pe,.16,c),Hn(n,I[1].clone().setY(J+1.2),we,.16,c),Hn(n,we,K,.16,c),Hn(n,Pe,$,.16,c)}return Ch++,!0}for(let E=0;E<se.length;E+=v){if(Vi(E+v*.5))continue;const S=mt(E),C=mt(E+v),A=S.p.clone().add(C.p).multiplyScalar(.5),{sideways:w,normal:b,q:P}=ns(S,C),D=S.p.distanceTo(C.p)+.45,O=Math.floor(E/(v*2))%2?e:t;en(n,new L(se.width,.62,D),A.clone().addScaledVector(b,-.05),P,O),en(n,new L(se.width-2.8,.08,D*.86),A.clone().addScaledVector(b,.36),P,u),en(n,new L(.2,.1,D*.76),A.clone().addScaledVector(w,-se.width*.19).addScaledVector(b,.43),P,u),en(n,new L(.2,.1,D*.76),A.clone().addScaledVector(w,se.width*.19).addScaledVector(b,.43),P,u),E%48===0&&(en(n,new L(.14,.08,D*.62),A.clone().addScaledVector(w,-se.width*.08).addScaledVector(b,.51),P,_),en(n,new L(.14,.08,D*.62),A.clone().addScaledVector(w,se.width*.08).addScaledVector(b,.51),P,_)),E%120===0&&en(n,new L(se.width*.42,.07,.72),A.clone().addScaledVector(b,.55),P,g),en(n,new L(se.width+1.2,.35,D*.94),A.clone().addScaledVector(b,-.56),P,r),en(n,new L(.42,.42,D*.9),A.clone().addScaledVector(w,-se.width*.36).addScaledVector(b,-.78),P,x),en(n,new L(.42,.42,D*.9),A.clone().addScaledVector(w,se.width*.36).addScaledVector(b,-.78),P,x);const Z=A.clone().addScaledVector(w,-se.width*.51),te=A.clone().addScaledVector(w,se.width*.51);if(en(n,new L(.32,.46,D),Z.clone().addScaledVector(b,.28),P,i),en(n,new L(.32,.46,D),te.clone().addScaledVector(b,.28),P,i),en(n,new L(.26,.72,D*.94),Z.clone().addScaledVector(b,-.22),P,r),en(n,new L(.26,.72,D*.94),te.clone().addScaledVector(b,-.22),P,r),E%36===0)for(const q of[-se.width*.39,-se.width*.2,se.width*.2,se.width*.39]){const J=new z(new We(.16,.2,.12,10),o);J.position.copy(A).addScaledVector(w,q).addScaledVector(b,.46),J.quaternion.copy(P),J.castShadow=!1,n.add(J)}if(E%72===0&&(en(n,new L(.34,1.56,3.4),A.clone().addScaledVector(w,-se.width*.66).addScaledVector(b,1.16),P,s),en(n,new L(.34,1.56,3.4),A.clone().addScaledVector(w,se.width*.66).addScaledVector(b,1.16),P,s),en(n,new L(.18,.18,4.4),A.clone().addScaledVector(w,-se.width*.62).addScaledVector(b,1.94),P,s),en(n,new L(.18,.18,4.4),A.clone().addScaledVector(w,se.width*.62).addScaledVector(b,1.94),P,s),en(n,new L(.12,.12,4),A.clone().addScaledVector(w,-se.width*.62).addScaledVector(b,1.38),P,i),en(n,new L(.12,.12,4),A.clone().addScaledVector(w,se.width*.62).addScaledVector(b,1.38),P,i),Hn(n,A.clone().addScaledVector(w,-se.width*.58).addScaledVector(b,-1.08),A.clone().addScaledVector(w,se.width*.58).addScaledVector(b,-1.08),.11,c),Hn(n,A.clone().addScaledVector(w,-se.width*.48).addScaledVector(b,-1),A.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c),Hn(n,A.clone().addScaledVector(w,se.width*.48).addScaledVector(b,-1),A.clone().addScaledVector(w,0).addScaledVector(b,-2.2),.09,c)),E%96===0){const q=new z(new _n(1,28),y);q.rotation.x=-Math.PI/2,q.position.set(A.x,-4.72,A.z),q.scale.set(se.width*.9,Math.max(10,D*2.2),1),q.rotation.z=Math.atan2(ns(S,C).tangent.x,ns(S,C).tangent.z),n.add(q)}if(E%144===0){const q=A.clone().addScaledVector(w,-se.width*.74).addScaledVector(b,2),J=A.clone().addScaledVector(w,se.width*.74).addScaledVector(b,2);Hn(n,q.clone().addScaledVector(b,-1.2),q.clone().addScaledVector(b,1.1),.12,s),Hn(n,J.clone().addScaledVector(b,-1.2),J.clone().addScaledVector(b,1.1),.12,s),en(n,new L(.46,.72,.46),q.clone().addScaledVector(b,1.15),P,h),en(n,new L(.46,.72,.46),J.clone().addScaledVector(b,1.15),P,h)}if(E%288===0){const q=A.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*se.width*.92).addScaledVector(b,5.2);en(n,new L(.44,.44,.44),q.clone(),P,m),Hn(n,q.clone().addScaledVector(b,-.2),A.clone().addScaledVector(b,1),.05,c)}E%48===0&&M(E+v*.5,!1),E%168===0&&!Vi(E+16)&&y_(n,mt(E+5),d)}for(const E of se.gaps){const S=mt(E.start-3),C=mt(E.end+3);for(const A of[S,C]){const w=mt(A.s+2),{normal:b,q:P}=ns(A,w);en(n,new L(se.width-1.2,.08,4.6),A.p.clone().addScaledVector(b,.54),P,h),en(n,new L(se.width*.62,.09,1.3),A.p.clone().addScaledVector(b,.62).addScaledVector(A.tangent,A===S?-6.3:6.3),P,g);for(const D of[-se.width*.42,0,se.width*.42]){const O=A.p.clone().addScaledVector(A.side,D).addScaledVector(b,2.35);en(n,new L(.46,.46,.46),O,P,D===0?p:h)}M(A.s+(A===S?-9:9),!0),M(A.s+(A===S?-24:24),!0)}}return n}function Af(n=13710372,e=7740696){const t=new tt,i=new W({color:n,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new W({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),a=new W({color:329225,roughness:.52,metalness:.12}),r=new W({color:1053463,roughness:.38,metalness:.34}),o=new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),h=new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),u=new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),m=new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),p=new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new W({color:329225,roughness:.44,metalness:.22}),_=new z(new _n(3.65,36),new Et({color:0,transparent:!0,opacity:.22,depthWrite:!1}));_.rotation.x=-Math.PI/2,_.position.y=.08,_.scale.z=1.58,t.add(_);const g=(M,E,S,C,A=null,w=null)=>{const b=new z(E,S);return b.name=M,b.position.copy(C),A&&b.rotation.set(A.x||0,A.y||0,A.z||0),w&&b.scale.copy(w),t.add(b),b},f=(M,E,S,C,A,w,b=0,P=0,D=0)=>g(M,new le(E.x,E.y,E.z),S,new L(C,A,w),new L(b,P,D));f("low black undertray",new L(5.25,.28,8.45),a,0,.45,-.08),f("wide wedge body tub",new L(4.85,.86,6.65),i,0,.98,.28,-.035),f("sloped front wedge nose",new L(3.7,.64,3.35),i,0,.83,-3.75,-.145),f("front black splitter",new L(5.25,.13,.78),a,0,.35,-5.6),f("left sculpted rocker panel",new L(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),f("right sculpted rocker panel",new L(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),f("left rear haunch",new L(.72,.74,2.55),i,-2.53,1.18,2.08,-.04),f("right rear haunch",new L(.72,.74,2.55),i,2.53,1.18,2.08,-.04),f("left front fender flare",new L(.46,.54,1.38),i,-2.55,.98,-2.78,-.04),f("right front fender flare",new L(.46,.54,1.38),i,2.55,.98,-2.78,-.04),f("black rear fascia",new L(4.72,.66,.2),r,0,1.02,4.04),f("deep rear bumper",new L(5.32,.38,.48),c,0,.58,4.23),f("front windshield",new L(2.8,.13,1.15),h,0,1.78,-1.25,-.48),f("roof glass",new L(2.34,.18,1.55),h,0,2.08,-.2,-.13),f("left side window",new L(.12,.78,1.9),h,-1.28,1.76,-.15,-.08,.04),f("right side window",new L(.12,.78,1.9),h,1.28,1.76,-.15,-.08,-.04),f("black a pillar left",new L(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),f("black a pillar right",new L(.12,.86,.14),x,1.46,1.75,-1.22,-.48),f("rear deck panel",new L(3.5,.18,2.18),i,0,1.7,2,-.2);for(let M=0;M<7;M++)f("black rear deck louver",new L(3.35,.12,.18),r,0,1.83+M*.015,1.1+M*.28,-.21);f("raised rear spoiler blade",new L(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const M of[-2.28,2.28])f("spoiler side endplate",new L(.24,.78,1.04),s,M,1.43,3.72,0,0,M<0?-.08:.08);for(const M of[-1.78,1.78])f("thin hood crease",new L(.08,.04,2.55),x,M*.36,1.27,-3.45,-.15),f("door seam",new L(.035,.68,1.75),x,M,1.16,-.2),f("side intake",new L(.09,.34,.9),r,Math.sign(M)*2.68,.86,1.42);for(const M of[-1.04,1.04])f("pop up headlight glass",new L(.62,.12,.18),m,M,1.02,-5.28,-.16);f("tail light backplate",new L(3.86,.46,.08),x,0,1.08,4.18);for(const M of[-1.42,-.62,.62,1.42])f("rectangular glowing tail lamp",new L(.54,.28,.1),Math.abs(M)>1?d:u,M,1.08,4.24);f("slim chrome beltline left",new L(.06,.08,4.75),o,-2.72,1.42,-.2),f("slim chrome beltline right",new L(.06,.08,4.75),o,2.72,1.42,-.2),f("left black roof rail",new L(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),f("right black roof rail",new L(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const M of[-2.86,2.86])f("angular side mirror arm",new L(.42,.08,.08),x,M,1.62,-1.55,0,0,M<0?-.14:.14),f("blue tinted side mirror",new L(.12,.34,.46),h,M*1.03,1.62,-1.65,0,M<0?.24:-.24),f("flush door handle",new L(.08,.11,.46),o,M*.94,1.28,.52);for(const M of[-2.65,2.42])f("left wheel arch shadow",new L(.08,.9,1.75),x,-2.82,.78,M),f("right wheel arch shadow",new L(.08,.9,1.75),x,2.82,.78,M);f("black license recess",new L(.9,.24,.08),r,0,.76,4.31);const y=[],v=(M,E,S=!1)=>{const C=new tt;C.name=S?"steering front wheel assembly":"rear wheel assembly",C.position.set(M,.54,E);const A=new z(new We(.88,.88,.62,28),a);A.name="wide performance tire",A.rotation.z=Math.PI/2,C.add(A);const w=new z(new Cs(.88,.06,10,32),a);w.name="rounded tire sidewall",w.rotation.y=Math.PI/2,C.add(w);const b=new z(new We(.42,.42,.66,24),o);b.name="chrome wheel rim",b.rotation.z=Math.PI/2,C.add(b);const P=new z(new We(.56,.56,.08,24),p);P.name="visible brake disc",P.rotation.z=Math.PI/2,P.position.x=M>0?-.05:.05,C.add(P);for(let Z=0;Z<8;Z++){const te=new z(new le(.08,.055,.62),o);te.name="thin wheel spoke",te.rotation.x=Z/8*Math.PI*2,te.position.set(M>0?.035:-.035,0,.22),C.add(te)}const D=new z(new le(.1,.22,.18),u);D.name="small brake caliper",D.position.set(M>0?-.39:.39,.18,-.38),C.add(D);const O=new z(new We(.17,.17,.72,18),c);O.name="dark center cap",O.rotation.z=Math.PI/2,C.add(O),t.add(C),S&&y.push(C)};for(const M of[-2.4,2.4])v(M,-2.65,!0),v(M,2.42,!1);t.userData.frontWheels=y,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const M of[-.92,-.52,.52,.92]){const E=new z(new We(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(M,.43,4.52),t.add(E)}return t.traverse(M=>{M.castShadow=!0,M.receiveShadow=!0}),Se.add(t),t}function w_(){const n=new tt,e=new W({color:3949112,roughness:.62,metalness:.3}),t=new W({color:460551,roughness:.55}),i=new W({color:3162419,roughness:.5,metalness:.42}),s=new W({color:16767297,roughness:.38,metalness:.25}),a=new W({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),r=new W({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.08}),o=new W({color:1118995,roughness:.7,metalness:.05}),c=new z(new le(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),n.add(c);const h=new z(new le(.16,.028,1.92),i);h.position.set(0,-.64,-2.28),n.add(h);const d=new z(new le(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,n.add(d);const u=new z(new Ut(2.8,.82,1,1),r);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,n.add(u);const m=new z(new Cs(.36,.035,12,48),o);m.position.set(0,-.46,-1.02),m.rotation.x=Math.PI/2.75,n.add(m);for(let p=0;p<3;p++){const x=new z(new le(.34,.025,.035),i);x.position.copy(m.position),x.rotation.copy(m.rotation),x.rotation.z+=p/3*Math.PI*2,n.add(x)}for(let p=0;p<6;p++){const x=new z(new We(.16,.16,.56,18),i);x.rotation.z=Math.PI/2,x.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),n.add(x)}for(const p of[-1.08,1.08]){const x=new z(new We(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(p,-.68,-1.58),n.add(x);const _=new z(new Cs(.22,.035,8,28),s);_.scale.set(.72,1.25,.72),_.position.set(p*.8,-.48,-1.74),_.rotation.x=Math.PI/2,n.add(_)}for(const p of[-1.14,-.84,.84,1.14]){const x=new z(new We(.035,.04,.028,8),i);x.position.set(p,-.39,-1.28),x.rotation.x=Math.PI/2,n.add(x)}for(const p of[-.52,.52]){const x=new z(new Ot(.045,12,8),a);x.position.set(p,-.34,-1.22),n.add(x)}n.position.set(0,0,0),ye.add(n),dn=n}function S_(){const n=new W({color:16119285,roughness:.35,metalness:.25}),e=new W({color:1184274,roughness:.45}),t=new W({map:GM(),roughness:.42,metalness:.05}),i=new W({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=mt(0),a=new bt().makeBasis(s.side,sn,s.tangent),r=new as().setFromRotationMatrix(a),o=new tt;for(const d of[-se.width*.58,se.width*.58]){const u=new z(new le(.8,11,.8),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(sn,5.4),u.quaternion.copy(r),o.add(u)}const c=new z(new le(se.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(sn,11.2),c.quaternion.copy(r),o.add(c);const h=new z(new le(se.width+1.2,1.4,.18),e);h.position.copy(s.p).addScaledVector(sn,12.5).addScaledVector(s.tangent,-.55),h.quaternion.copy(r),o.add(h);for(const d of[-se.width*.38,0,se.width*.38]){const u=new z(new Ot(.32,16,10),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(sn,10.25),o.add(u)}return Se.add(o),o}function bd(n,e,t){const i={body:new W({color:e,roughness:.19,metalness:.68,envMapIntensity:1.25}),trim:new W({color:t,roughness:.28,metalness:.58,envMapIntensity:1}),black:new W({color:329225,roughness:.52,metalness:.12}),dark:new W({color:1053463,roughness:.38,metalness:.34}),chrome:new W({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),steel:new W({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),glass:new W({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),tailHot:new W({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:2.4}),tailWarm:new W({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:1.7}),headLamp:new W({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:1.7}),disc:new W({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),matte:new W({color:329225,roughness:.44,metalness:.22})},s=new z(new _n(3.65,36),new Et({color:0,transparent:!0,opacity:.22,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.y=.08,s.scale.z=1.58,n.add(s);const a=(h,d,u,m,p=null,x=null)=>{const _=new z(d,u);return _.name=h,_.position.copy(m),p&&_.rotation.set(p.x||0,p.y||0,p.z||0),x&&_.scale.copy(x),n.add(_),_},r=(h,d,u,m,p,x,_,g,f=0,y=0,v=0)=>a(h,new le(d,u,m),p,new L(x,_,g),{x:f,y,z:v}),o=[];function c(h,d,u,m=.88,p=.62){const x=new tt;x.name=u?"steering front wheel assembly":"rear wheel assembly",x.position.set(h,m*.62+.18,d);const _=new z(new We(m,m,p,28),i.black);_.name="performance tire",_.rotation.z=Math.PI/2,x.add(_);const g=new z(new Cs(m,.06,10,32),i.black);g.name="tire sidewall",g.rotation.y=Math.PI/2,x.add(g);const f=new z(new We(m*.48,m*.48,p+.04,24),i.chrome);f.name="chrome rim",f.rotation.z=Math.PI/2,x.add(f);const y=new z(new We(m*.62,m*.62,.08,24),i.disc);y.name="brake disc",y.rotation.z=Math.PI/2,y.position.x=h>0?-.05:.05,x.add(y);for(let M=0;M<8;M++){const E=new z(new le(.08,.055,p),i.chrome);E.name="wheel spoke",E.rotation.x=M/8*Math.PI*2,E.position.set(h>0?.035:-.035,0,m*.25),x.add(E)}const v=new z(new We(.17,.17,p+.1,18),i.steel);return v.name="center cap",v.rotation.z=Math.PI/2,x.add(v),n.add(x),u&&o.push(x),x}return{mats:i,part:a,box:r,wheel:c,frontWheels:o}}function T_(n=15616818,e=2434871){const t=new tt,i=bd(t,n,e),{mats:s,box:a}=i;a("low undertray",4.6,.26,9.2,s.black,0,.42,0),a("long fuselage body",4.15,.78,8.6,s.body,0,.92,.1,-.012),a("tapered nose cone",2.7,.5,2.5,s.body,0,.78,-5.15,-.12),a("needle splitter",4.5,.1,.7,s.black,0,.34,-6.2),a("front intake slot",2,.16,.14,s.dark,0,.62,-6.15),a("canopy fairing",2.15,.5,3.1,s.body,0,1.5,-1.7,-.06),a("bubble windshield",1.85,.14,1.35,s.glass,0,1.74,-2.7,-.42),a("canopy glass roof",1.7,.13,1.7,s.glass,0,1.86,-1.35,-.1),a("left canopy glass",.1,.5,2.1,s.glass,-1.02,1.6,-1.6,-.05,.03),a("right canopy glass",.1,.5,2.1,s.glass,1.02,1.6,-1.6,-.05,-.03),a("rear engine deck",3.6,.34,3.6,s.body,0,1.28,2.3,-.05),a("left rear wheel fairing",.8,.72,3,s.body,-1.95,.9,2.3),a("right rear wheel fairing",.8,.72,3,s.body,1.95,.9,2.3),a("left fin",.1,.85,1.6,s.trim,-1.6,1.75,3.5,.18),a("right fin",.1,.85,1.6,s.trim,1.6,1.75,3.5,.18);for(let r=0;r<6;r++)a("engine deck vent",2.9,.1,.16,s.dark,0,1.47+r*.008,1.3+r*.42,-.05);a("full width tail bar",3.9,.24,.12,s.tailHot,0,1.24,4.42),a("tail bar backplate",4.1,.4,.08,s.matte,0,1.22,4.36),a("rear diffuser",3.4,.3,.6,s.dark,0,.5,4.3,.25);for(const r of[-.72,.72])a("slit headlight",.85,.09,.14,s.headLamp,r,.92,-6.1,-.1);for(const r of[-1.5,1.5])a("beltline chrome strip",.05,.06,5.4,s.chrome,r*1.36,1.3,-.4);for(const r of[-.4,.4]){const o=new z(new We(.19,.19,.6,16),s.chrome);o.name="center exhaust",o.rotation.x=Math.PI/2,o.position.set(r,.62,4.65),t.add(o)}return i.wheel(-2.14,-3.1,!0,.82,.56),i.wheel(2.14,-3.1,!0,.82,.56),i.wheel(-1.95,2.3,!1,.86,.6),i.wheel(1.95,2.3,!1,.86,.6),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={fins:2,deckVents:6,tailBar:!0,canopy:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Se.add(t),t}function E_(n=4165830,e=15908108){const t=new tt,i=bd(t,n,e),{mats:s,box:a}=i;a("undertray",5,.3,7.6,s.black,0,.48,0),a("slab muscle body",5.15,1.05,6.9,s.body,0,1.1,0,-.01),a("blunt nose clip",4.6,.8,1.3,s.body,0,1,-4,-.06),a("chin spoiler",5,.24,.5,s.dark,0,.48,-4.5),a("hood panel",3.6,.14,2.6,s.trim,0,1.66,-2.4,-.04),a("hood scoop",1.5,.42,1.5,s.dark,0,1.86,-2.2),a("exposed blower intake",1.05,.3,.75,s.chrome,0,2.12,-2.15),a("cabin greenhouse",3.2,.85,2.5,s.body,0,1.98,.55,-.03),a("windshield",2.9,.14,1.2,s.glass,0,2.1,-.7,-.5),a("rear glass",2.9,.13,1,s.glass,0,2.12,1.85,.44),a("left door glass",.12,.62,2,s.glass,-1.58,2.05,.5),a("right door glass",.12,.62,2,s.glass,1.58,2.05,.5),a("ducktail spoiler",4.9,.2,.9,s.body,0,1.9,3.5,.2),a("rear valance",4.8,.6,.3,s.dark,0,.85,3.72);for(const r of[-2.05,-.85,.85,2.05]){const o=new z(new We(.21,.21,.1,18),Math.abs(r)>1.4?s.tailHot:s.tailWarm);o.name="round tail lamp",o.rotation.x=Math.PI/2,o.position.set(r,1.28,3.78),t.add(o)}for(const r of[-1.7,1.7])a("square headlamp",.7,.3,.12,s.headLamp,r,1.22,-4.62);a("chrome front grille",2.2,.4,.1,s.chrome,0,1.2,-4.62);for(const r of[-1,1]){const o=new z(new We(.16,.16,3.4,14),s.chrome);o.name="side exhaust pipe",o.rotation.x=Math.PI/2,o.position.set(r*2.62,.55,.4),t.add(o),a("side pipe heat shield",.16,.28,2.4,s.dark,r*2.62,.72,.4),a("fender flare front",.5,.6,1.6,s.body,r*2.6,1,-2.5,-.03),a("fender flare rear",.55,.68,1.9,s.body,r*2.62,1.05,2.3,-.03),a("racing stripe",.8,.02,6.8,s.trim,r*.55,1.72,0,-.008)}return i.wheel(-2.35,-2.5,!0,.86,.62),i.wheel(2.35,-2.5,!0,.86,.62),i.wheel(-2.4,2.3,!1,.98,.78),i.wheel(2.4,2.3,!1,.98,.78),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={blower:!0,sidePipes:2,roundLamps:4,ducktail:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Se.add(t),t}function A_(n=16764159,e=526344){const t=new tt,i=bd(t,n,e),{mats:s,box:a}=i;a("stubby undertray",3.9,.26,6.2,s.black,0,.46,0),a("tub body",3.55,.72,5.4,s.body,0,.92,.1,-.02),a("snub nose",2.5,.5,1.2,s.body,0,.84,-3.15,-.16),a("front splitter lip",3.8,.12,.5,s.dark,0,.42,-3.7),a("open cockpit surround",2.4,.4,2.4,s.trim,0,1.34,0,-.03),a("low windscreen",2,.12,.7,s.glass,0,1.62,-1.15,-.55),a("halo spine",.16,.14,1.9,s.dark,0,2.08,-.15,-.1),a("seat back panel",1.7,.7,.2,s.dark,0,1.6,.95),a("roof air scoop",.9,.45,1.1,s.trim,0,2.02,.65,.12),a("scoop mouth",.62,.24,.14,s.black,0,2.08,.08),a("rear deck",3.3,.3,1.8,s.body,0,1.16,2.2,-.06),a("kart wing",3.7,.12,.7,s.trim,0,1.78,2.9,-.1),a("wing left strut",.12,.5,.3,s.dark,-1.35,1.5,2.9),a("wing right strut",.12,.5,.3,s.dark,1.35,1.5,2.9),a("rear mesh panel",2.6,.5,.1,s.dark,0,.95,3.1);for(const r of[-1,1]){const o=new z(new We(.09,.09,1.35,10),s.steel);o.name="roll cage hoop",o.rotation.z=r*.42,o.position.set(r*.75,1.85,.35),t.add(o),a("front fender pod",.62,.4,1.5,s.body,r*1.85,.95,-2.15,-.05),a("rear fender pod",.68,.46,1.7,s.body,r*1.9,1,2.15,-.05),a("pod brace arm",.5,.1,.12,s.steel,r*1.45,.98,-2.15),a("number roundel",.04,.5,.5,s.trim,r*1.79,1.05,.2)}for(const r of[-.85,.85])a("bug eye headlamp",.34,.26,.14,s.headLamp,r,1.08,-3.66),a("tail lamp block",.4,.22,.1,Math.abs(r)>.5?s.tailHot:s.tailWarm,r*1.6,1.14,3.14);{const r=new z(new We(.15,.15,.5,14),s.chrome);r.name="single stinger exhaust",r.rotation.x=Math.PI/2,r.position.set(.65,.78,3.28),t.add(r)}return i.wheel(-1.85,-2.15,!0,.74,.52),i.wheel(1.85,-2.15,!0,.74,.52),i.wheel(-1.9,2.15,!1,.8,.58),i.wheel(1.9,2.15,!1,.8,.58),t.userData.frontWheels=i.frontWheels,t.userData.detailReport={rollCage:!0,fenderPods:4,halo:!0,wing:!0},t.traverse(r=>{r.castShadow=!0,r.receiveShadow=!0}),Se.add(t),t}const Rs=[{key:"interceptor",label:"Interceptor",trait:"balanced",stats:{accel:1,top:1,grip:1,boostRegen:1},build:()=>Af(3108784,1916782)},{key:"bullet",label:"Bullet GT",trait:"top speed",stats:{accel:.9,top:1.09,grip:.94,boostRegen:1},build:()=>T_()},{key:"brawler",label:"Brawler 442",trait:"acceleration",stats:{accel:1.16,top:.95,grip:1.04,boostRegen:.92},build:()=>E_()},{key:"zephyr",label:"Zephyr Kart",trait:"grip + boost",stats:{accel:1.06,top:.9,grip:1.18,boostRegen:1.18},build:()=>A_()}];let Gi=xe.clamp(Number(localStorage.getItem("steel-ribbon-carmodel")||0),0,3);function ws(){return l.drivingStolen&&st?p0[st.type]||p0.compact:Rs[Gi].stats}const Cf=[{key:"crowther",label:"Crowther",body:13710372,trim:7740696,lane:.02,base:97,wave:5,waveFreq:.6},{key:"bishop",label:"Bishop",body:3244268,trim:1400130,lane:-.3,base:92,wave:9,waveFreq:.95},{key:"maddock",label:"Maddock",body:16770387,trim:5723991,lane:.3,base:91,wave:6,waveFreq:.5}],qn=Cf.map((n,e)=>({...n,idx:e,mesh:Af(n.body,n.trim),distance:-900,s:0,speed:58,phase:e*2.13,finished:0,progEl:null})),C_=qn[0].mesh;let Gt=Rs[Gi].build();function R_(n){Gi=xe.clamp(n,0,Rs.length-1),localStorage.setItem("steel-ribbon-carmodel",String(Gi));const e=Gt.visible;Da(Gt),Gt=Rs[Gi].build(),Gt.visible=e,typeof Bh=="function"&&Bh()}for(const n of qn)n.mesh.visible=!1,Se.add(n.mesh);function eo(n){for(const e of qn)e.mesh.visible=n}const P_=[10,6,4,2];let Xt=null;try{Xt=JSON.parse(localStorage.getItem("steel-ribbon-season")||"null")}catch{}function to(){return Xt?.active?Xt.division:Number(localStorage.getItem("steel-ribbon-division")||4)}function Rf(){localStorage.setItem("steel-ribbon-season",JSON.stringify(Xt))}function L_(){Xt={division:to(),raceIndex:0,points:{you:0,crowther:0,bishop:0,maddock:0},active:!0},Rf()}function Pf(n){return["One","Two","Three","Four"][xe.clamp(n,1,4)-1]}function Lf(){return[{key:"you",label:"You",pts:Xt?.points.you??0},...Cf.map(e=>({key:e.key,label:e.label,pts:Xt?.points[e.key]??0}))].sort((e,t)=>t.pts-e.pts||(e.key==="you"?1:t.key==="you"?-1:0))}Gt.visible=!1;e_();QM();Me.signs=0;gl.length=0;t_();n_();f_();let a0=null,r0=null,o0=null,dn=null,Ac=null;const Jt=[];w_();function Ps(n){n&&(n.traverse(e=>e.geometry&&e.geometry.dispose()),Se.remove(n))}function Da(n){n&&(n.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose(),i.dispose()}}),Se.remove(n))}const ka=[],Gr=[];let l0=null;function D_(){const n=document.createElement("canvas");n.width=128,n.height=192;const e=n.getContext("2d");e.clearRect(0,0,128,192),e.strokeStyle="#5ff5ff",e.lineWidth=22,e.lineJoin="round",e.lineCap="round";for(const i of[36,96,156])e.beginPath(),e.moveTo(24,i+22),e.lineTo(64,i-22),e.lineTo(104,i+22),e.stroke();const t=new Qt(n);return t.colorSpace=Pt,t}function I_(n,e){if(Vi(n))return!0;for(const t of se.gaps)if(n>t.start-8&&n<t.end+8)return!0;for(const t of aa)if(t.dirSel===e&&(t.rampType==="on"&&t.mergeS!=null&&n>t.mergeS-8&&n<t.mergeS+34||t.rampType==="off"&&t.exitS!=null&&n>t.exitS-34&&n<t.exitS+8))return!0;return!1}function F_(n){const e=new W({color:11253456,roughness:.38,metalness:.62,emissive:3821654,emissiveIntensity:.32,side:wt}),t=new We(.09,.12,1.05,6),i=new W({color:4210757,roughness:.55,metalness:.5}),s=6;let a=0,r=0;const o=new nn(t,i,Math.ceil(se.length/12*2)+8),c=new zt;for(const h of[-1,1]){const d=h*(se.width*.5+.55),u=[],m=x=>{if(!(x.length<2)){for(let _=0;_<x.length-1;_++){const g=x[_],f=x[_+1];u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.12,f.z,f.x,f.y+1.5,f.z),u.push(g.x,g.y+1.12,g.z,f.x,f.y+1.5,f.z,g.x,g.y+1.5,g.z)}a++}};let p=[];for(let x=0;x<=se.length;x+=s){if(I_(x%se.length,h)){m(p),p=[];continue}const _=mt(x%se.length);if(p.push(_.p.clone().addScaledVector(_.side,d).addScaledVector(sn,.58)),x%12===0){const g=p[p.length-1];c.position.set(g.x,g.y+.95,g.z),c.updateMatrix(),o.setMatrixAt(r++,c.matrix)}}if(m(p),u.length){const x=new jt;x.setAttribute("position",new St(u,3)),x.computeVertexNormals(),n.add(new z(x,e))}}o.count=r,o.instanceMatrix.needsUpdate=!0,n.add(o),Me.railRuns=a,Me.railPosts=r}function U_(){ka.length=0,Gr.length=0;const n=new tt,e=new Et({map:D_(),transparent:!0,depthWrite:!1,side:wt,blending:ri,opacity:.9}),t=new Ut(3.6,5.4);t.rotateX(-Math.PI/2);for(let c=170;c<se.length-60;c+=290){if(se.gaps.some(x=>c>x.start-70&&x.end+70>c))continue;const h=[-.24,0,.24][ka.length%3]*se.width,d=mt(c),u=new z(t,e),m=new L().crossVectors(d.side,d.tangent).normalize();m.y<0&&m.multiplyScalar(-1);const p=new bt().makeBasis(d.side,m,new L().crossVectors(d.side,m).normalize());u.quaternion.setFromRotationMatrix(p),u.position.copy(d.p).addScaledVector(d.side,h).addScaledVector(m,.84),n.add(u),ka.push({s:c,lat:h})}const i=new Ot(.17,8,6),s=new W({color:16768392,emissive:16757052,emissiveIntensity:2.1,roughness:.4}),a=Math.max(60,Math.round(se.length/24));{const c=new nn(i,s,a*2),h=new zt;let d=0;for(let u=0;u<a;u++){const m=u/a*se.length;if(Vi(m))continue;const p=mt(m);for(const x of[-1,1])h.position.copy(p.p).addScaledVector(p.side,x*(se.width*.5+.22)).addScaledVector(sn,.78),h.updateMatrix(),c.setMatrixAt(d++,h.matrix)}c.count=d,c.instanceMatrix.needsUpdate=!0,n.add(c)}const r=new We(.09,.12,1.5,8),o=new W({color:2500134,roughness:.6,metalness:.4});for(const c of se.gaps){const h=mt(Math.max(6,c.start-22));for(const d of[-1,1]){const u=new W({color:16724787,emissive:16719904,emissiveIntensity:1.6,roughness:.35}),m=new tt,p=new z(r,o),x=new z(new Ot(.3,10,8),u);p.position.y=.75,x.position.y=1.65,m.add(p),m.add(x),m.position.copy(h.p).addScaledVector(h.side,d*(se.width*.5+.55)).addScaledVector(sn,.55),n.add(m),Gr.push(u)}}return F_(n),Se.add(n),n}pn(new zt,n=>{if(!Gr.length)return;const e=Math.sin(n*8)>0?2.3:.3;for(const t of Gr)t.emissiveIntensity=e});function no(n){return Ts=xe.clamp(n,0,na.length-1),se=na[Ts],si.length=0,aa.length=0,Da(a0),Da(r0),Da(o0),Da(l0),a0=b_(),r0=S_(),o0=x_(),l0=U_(),Td(),qe.trackName.textContent=se.name,qe.courseName&&(qe.courseName.textContent=se.name),qe.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===Ts)}),se.name}no(0);function z_(){Ac&&Se.remove(Ac),Jt.length=0;const n=new tt,e=new W({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new Et({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:wt,blending:ri}),i=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<i.length;s++){const a=i[s],r=ce(a.x,a.z)+4.2,o=new tt,c=new z(new Cs(5.6,.22,12,52),e.clone());c.rotation.y=a.yaw,o.add(c);const h=new z(new _n(4.7,32),t.clone());h.rotation.y=a.yaw,o.add(h);const d=new W({color:1120288,roughness:.42,metalness:.55});for(const m of[-5.1,5.1]){const p=new z(new We(.11,.16,6.2,8),d);p.position.set(Math.cos(a.yaw)*m,-1.1,Math.sin(a.yaw)*m),o.add(p)}const u=new z(new Ot(.45,16,10),e.clone());u.position.y=4.1,o.add(u),o.position.set(a.x,r,a.z),o.userData.index=s,o.userData.baseY=r,o.userData.label=a.label,n.add(o),Jt.push({...a,y:r,radius:8.5,marker:o,collected:!1})}pn(n,s=>{for(let a=0;a<Jt.length;a++){const r=Jt[a],o=a===l.objectiveIndex;r.marker.visible=!r.collected||o,r.marker.position.y=r.y+Math.sin(s*2.2+a)*.35,r.marker.rotation.z=Math.sin(s*1.3+a)*.035,r.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),r.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),Se.add(n),Ac=n}z_();function N_(){const n=new tt,e=new W({color:9075548,roughness:.98,metalness:.02});let t=0;for(let i=0;i<900&&t<4;i++){const s=-560+Math.random()*1120,a=-1330+Math.random()*1620,r=15+Math.random()*12;if(Ln(s,a,r*2+14,r*2+14,10)||Sn(s,a,r).clearance<-6||Jt.some(d=>Math.hypot(d.x-s,d.z-a)<r+26)||ia.some(d=>Math.hypot(d.x-s,d.z-a)<d.rx+r+60)||un.some(d=>Math.abs(d.x-s)<d.hw+r+2&&Math.abs(d.z-a)<d.hd+r+2)||vi.some(d=>{const u=d.radius!=null?d.radius:Math.max(d.hw??0,d.hd??0);return Math.hypot(d.x-s,d.z-a)<u+r+2})||za.some(d=>Math.hypot(d.x-s,d.z-a)<(d.radius||4)+r+2))continue;const o=ce(s,a);if(Math.max(Math.abs(ce(s+r,a)-o),Math.abs(ce(s-r,a)-o),Math.abs(ce(s,a+r)-o),Math.abs(ce(s,a-r)-o))>1.7)continue;const c=new z(new Rl(r*.96,r*1.18,36),e);c.rotation.x=-Math.PI/2,c.position.set(s,o+.09,a),c.renderOrder=-4,n.add(c);const h=new z(new _n(r,36),bf(Math.max(1.2,r/13)));h.rotation.x=-Math.PI/2,h.position.set(s,o+.15,a),h.renderOrder=-3,n.add(h),wf(s,a,r*.98),t++}Me.ponds=t,Se.add(n),Td()}N_();const hn=_d(3375807,15905331);hn.visible=!1,hn.scale.setScalar(1.06),Se.add(hn);const Hi=new L(0,0,0);let Lh=0,de=null;function k_(){const n=new tt,e=new W({color:12872961,roughness:.32,metalness:.55,envMapIntensity:1.1}),t=new W({color:1710623,roughness:.5,metalness:.3}),i=new W({color:7924479,roughness:.06,metalness:.02,transparent:!0,opacity:.42,envMapIntensity:1.5}),s=new W({color:5860442,roughness:.25,metalness:.8}),a=new W({color:16722713,roughness:.2,emissive:16717836,emissiveIntensity:2}),r=(h,d,u,m,p,x,_=0,g=0,f=0)=>{const y=new z(d,u);return y.name=h,y.position.set(m,p,x),y.rotation.set(_,g,f),n.add(y),y};r("cabin hull",new le(2.5,2,4.4),e,0,2.1,-.4),r("cabin floor pan",new le(2.6,.4,4.8),t,0,1.05,-.3),r("nose glass",new le(2.1,1.5,1.1),i,0,2.2,-2.6,-.2),r("left door glass",new le(.1,1.1,2),i,-1.28,2.3,-.7),r("right door glass",new le(.1,1.1,2),i,1.28,2.3,-.7),r("roof turbine housing",new le(1.5,.8,2.4),t,0,3.4,-.2),r("exhaust stub",new We(.18,.22,.7,10),s,.7,3.5,.9,Math.PI/2.3),r("tail boom",new le(.55,.6,4.6),e,0,2.7,3.4,.02),r("tail fin",new le(.14,1.5,1),e,0,3.4,5.5,0,0,0),r("tail plane",new le(1.5,.12,.6),e,0,3,4.6),r("nose lamp",new le(.5,.2,.12),a,0,1.6,-2.95);for(const h of[-1,1])r("skid rail",new le(.16,.16,4.4),s,h*1.15,.32,-.4),r("skid strut front",new le(.12,.9,.12),s,h*1.05,.85,-1.5,0,0,h*.22),r("skid strut rear",new le(.12,.9,.12),s,h*1.05,.85,.9,0,0,h*.22);r("rotor hub",new We(.22,.28,.5,10),s,0,3.95,-.2);const o=new tt;o.name="main rotor";for(const h of[0,Math.PI/2]){const d=new z(new le(11.4,.07,.44),t);d.rotation.y=h,o.add(d)}o.position.set(0,4.2,-.2),n.add(o);const c=new tt;c.name="tail rotor";for(const h of[0,Math.PI/2]){const d=new z(new le(.06,1.7,.24),t);d.rotation.x=h,c.add(d)}return c.position.set(.36,3.1,5.6),n.add(c),n.traverse(h=>{h.castShadow=!0,h.receiveShadow=!0}),{mesh:n,rotor:o,tailRotor:c}}function O_(){let n=null;for(let d=0;d<700&&!n;d++){const u=-520+Math.random()*1040,m=-1200+Math.random()*1500;if(Math.hypot(u-80,m-300)>(d<350?420:1200)||Ln(u,m,26,26,6))continue;const p=ce(u,m);Math.max(Math.abs(ce(u+11,m)-p),Math.abs(ce(u-11,m)-p),Math.abs(ce(u,m+11)-p),Math.abs(ce(u,m-11)-p))>.8||un.some(x=>Math.abs(x.x-u)<x.hw+13&&Math.abs(x.z-m)<x.hd+13)||za.some(x=>Math.hypot(x.x-u,x.z-m)<(x.radius||4)+13)||ia.some(x=>Math.hypot(x.x-u,x.z-m)<x.rx+16)||Jt.some(x=>Math.hypot(x.x-u,x.z-m)<24)||Sn(u,m,12).clearance<2||(n={x:u,z:m,y:p})}n||(n={x:150,z:330,y:ce(150,330)});const e=new tt,t=new W({color:4671310,roughness:.85,metalness:.05}),i=new z(new We(10.5,11,.24,36),t);i.position.set(n.x,n.y+.12,n.z),i.receiveShadow=!0,e.add(i);const s=document.createElement("canvas");s.width=256,s.height=256;const a=s.getContext("2d");a.strokeStyle="#ffd45b",a.lineWidth=12,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke(),a.fillStyle="#ffd45b",a.font="900 150px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("H",128,136);const r=new Qt(s);r.colorSpace=Pt;const o=new z(new _n(9.6,36),new Et({map:r,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(n.x,n.y+.26,n.z),e.add(o);const c=new W({color:6280948,emissive:5301992,emissiveIntensity:2.2,roughness:.4});for(let d=0;d<8;d++){const u=d/8*Math.PI*2,m=new z(new Ot(.22,8,6),c);m.position.set(n.x+Math.cos(u)*10.2,n.y+.34,n.z+Math.sin(u)*10.2),e.add(m)}Se.add(e);const h=k_();h.mesh.scale.setScalar(1.42),h.mesh.position.set(n.x,n.y+.24,n.z),Se.add(h.mesh),de={pad:n,pos:new L(n.x,n.y+.24,n.z),yaw:Math.random()*Math.PI*2,vel:new L,rpm:0,mesh:h.mesh,rotor:h.rotor,tailRotor:h.tailRotor},de.mesh.quaternion.setFromAxisAngle(sn,-de.yaw),Me.helipad={x:+n.x.toFixed(1),z:+n.z.toFixed(1)}}O_();var Li=[],Df=null;function B_(n,e){if(!Li)return 0;for(const t of Li){const i=n-t.x,s=e-t.z,a=i*t.fx+s*t.fz,r=-i*t.fz+s*t.fx;if(!(a<0||a>t.len||Math.abs(r)>t.w*.5))return Df=t,a/t.len*t.h}return 0}function V_(){const n=[{type:"jump",len:17,h:4.4,rail:16734750},{type:"flip",len:11,h:6,rail:16724787},{type:"hoop",len:17,h:4.4,rail:16766208}],e=7.5,t=new W({color:16764268,roughness:.3,emissive:16750444,emissiveIntensity:2.4}),i=new W({color:3821395,roughness:.78,metalness:.08,emissive:1119519,emissiveIntensity:.35}),s=new W({color:16772736,roughness:.4,emissive:16766208,emissiveIntensity:1.3}),a=new W({color:16770669,roughness:.3,emissive:16762880,emissiveIntensity:1.9});for(let r=0;r<700&&Li.length<6;r++){const o=n[Li.length%n.length],{len:c,h}=o,d=Math.random()<.5,u=Math.round((Be.x1-Be.x0)/Be.pitch),m=(d?Be.x0:Be.zFar)+(Math.random()*(d?u:Math.round((Be.zNear-Be.zFar)/Be.pitch))|0)*Be.pitch,p=(Math.random()<.5?-1:1)*(Be.streetW*.5+10+Math.random()*9),x=d?Be.zFar+120+Math.random()*(Be.zNear-Be.zFar-240):Be.x0+120+Math.random()*(Be.x1-Be.x0-240),_=d?m+p:x,g=d?x:m+p,f=d?Math.random()<.5?0:Math.PI:Math.random()<.5?Math.PI/2:-Math.PI/2,y=Math.sin(f),v=-Math.cos(f),M=_+y*c,E=g+v*c;if(Ln(_,g,e+4,e+4,2)||Ln(M,E,e+4,e+4,2)||Sn(_,g,8).clearance<11||Sn(M,E,8).clearance<11||Js(_,g).depth>0||Js(M,E).depth>0||Js(M+y*40,E+v*40).depth>0||Math.abs(ce(_,g)-ce(M,E))>1.1||Li.some(w=>Math.hypot(w.x-_,w.z-g)<150))continue;const S=(w,b,P,D)=>w.some(O=>Math.abs(b-O.x)<(O.hw??O.radius??0)+D&&Math.abs(P-O.z)<(O.hd??O.radius??0)+D);let C=!1;for(const[w,b,P]of[[_-y*45,g-v*45,6],[_-y*22,g-v*22,6],[_,g,7],[M,E,7],[M+y*45,E+v*45,9],[M+y*95,E+v*95,9]])if(S(un,w,b,P)||S(vi,w,b,P)){C=!0;break}if(C)continue;const A={x:_,z:g,yaw:f,fx:y,fz:v,len:c,w:e,h,type:o.type,rail:o.rail};if(o.type==="hoop"){const w=ce(_,g)+h+13;A.hoop={x:M+y*28,y:w,z:E+v*28,r:7}}Li.push(A)}for(const r of Li){const o=new W({color:r.rail,roughness:.4,emissive:r.rail,emissiveIntensity:1.6});if(r.hoop){const A=new z(new Cs(r.hoop.r,.5,10,30),a);A.position.set(r.hoop.x,r.hoop.y,r.hoop.z),A.lookAt(r.hoop.x+r.fx,r.hoop.y,r.hoop.z+r.fz),Se.add(A)}const c=ce(r.x,r.z)+.05,h=-r.fz,d=r.fx,u=r.w*.5,m=[r.x-h*u,c,r.z-d*u],p=[r.x+h*u,c,r.z+d*u],x=[r.x+r.fx*r.len-h*u,c,r.z+r.fz*r.len-d*u],_=[r.x+r.fx*r.len+h*u,c,r.z+r.fz*r.len+d*u],g=[x[0],c+r.h,x[2]],f=[_[0],c+r.h,_[2]],y=[...m,...p,...f,...m,...f,...g,...x,..._,...f,...x,...f,...g,...m,...g,...x,...p,..._,...f],v=new jt;v.setAttribute("position",new St(y,3)),v.computeVertexNormals();const M=new z(v,i);M.castShadow=!1,M.receiveShadow=!0,Se.add(M);const E=Math.hypot(r.len,r.h),S=new le(.26,.24,E),C=new z(new le(1.1,.1,E*.94),s);C.position.set(r.x+r.fx*r.len/2,c+r.h/2+.08,r.z+r.fz*r.len/2),C.lookAt(r.x+r.fx*r.len,c+r.h+.08,r.z+r.fz*r.len),Se.add(C);for(const A of[-1,1]){const w=new z(S,o),b=r.x+h*u*A,P=r.z+d*u*A,D=r.x+r.fx*r.len+h*u*A,O=r.z+r.fz*r.len+d*u*A;w.position.set((b+D)/2,c+r.h/2+.12,(P+O)/2),w.lookAt(D,c+r.h+.12,O),Se.add(w);const Z=new z(new Ot(.34,10,8),t);Z.position.set(D,c+r.h+.55,O),Se.add(Z)}}Me.stuntRamps=Li.length}V_();function G_(){const n=[{z:-220,alt:170,dir:1,speed:30,color:16733525},{z:-720,alt:215,dir:-1,speed:26,color:16773083},{z:-1150,alt:190,dir:1,speed:34,color:9096933},{z:120,alt:240,dir:-1,speed:24,color:5817343}];Me.propPlanes=0;for(const e of n){const t=new tt,i=new W({color:e.color,roughness:.45,metalness:.18}),s=new W({color:2236962,roughness:.55}),a=new z(new We(.85,1.15,7.2,10),i);a.rotation.x=Math.PI/2,t.add(a);const r=new z(new Di(1.16,2.1,10),i);r.rotation.x=-Math.PI/2,r.position.z=-4.6,t.add(r);const o=new z(new Ot(.85,10,8),s);o.scale.set(1,.7,1.5),o.position.set(0,.75,-.9),t.add(o);const c=new z(new le(11.6,.2,2.3),i);c.position.set(0,.15,-.6),t.add(c);const h=new z(new le(4.4,.16,1.35),i);h.position.set(0,.25,3.3),t.add(h);const d=new z(new le(.16,2,1.6),i);d.position.set(0,1.15,3.35),t.add(d);const u=new tt,m=new le(.26,5.4,.12),p=new z(m,s),x=new z(m,s);x.rotation.z=Math.PI/2,u.add(p),u.add(x),u.position.z=-5.75,t.add(u),t.traverse(g=>(g.castShadow=!1,g.receiveShadow=!1)),t.scale.setScalar(2.6),t.rotation.y=e.dir>0?-Math.PI/2:Math.PI/2,t.position.set(-1300+Math.random()*2600,e.alt,e.z),Se.add(t);const _=Math.random()*Math.PI*2;pn(t,(g,f)=>{t.position.x+=e.dir*e.speed*f,t.position.x>1500&&(t.position.x=-1500),t.position.x<-1500&&(t.position.x=1500),t.position.y=e.alt+Math.sin(g*.35+_)*5,t.rotation.z=Math.sin(g*.22+_)*.14,u.rotation.z+=f*38}),Me.propPlanes++}}G_();const lt={cars:[],evadeT:0,nearest:1/0,blocks:[],blockCd:6,bustT:0,panicTick:0},If=new W({color:16716851,emissive:16711731,emissiveIntensity:2.4}),Ff=new W({color:5559551,emissive:2916351,emissiveIntensity:.4});function io(n){if(l.mode!=="roam")return;const e=Math.ceil(l.heat||0);l.heat=Math.min(5,(l.heat||0)+n),lt.evadeT=0,Math.ceil(l.heat)>e&&(l.message=`WANTED ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`,l.messageTimer=1.2)}function Uf(){const n=Qr("compact",16250871),e=new W({color:1381656,roughness:.5,metalness:.15}),t=new z(new le(2.26,.34,1.35),e);t.position.set(0,1.02,0),n.add(t);const i=new z(new le(.62,.24,.46),If),s=new z(new le(.62,.24,.46),Ff);return i.position.set(-.38,2.12,-.35),s.position.set(.38,2.12,-.35),n.add(i),n.add(s),n.traverse(a=>(a.castShadow=!1,a.receiveShadow=!0)),n}function c0(n,e){return un.some(t=>Math.abs(n-t.x)<(t.hw??t.radius??0)+4&&Math.abs(e-t.z)<(t.hd??t.radius??0)+4)||Js(n,e).depth>.35}function H_(){const n=Math.random()*Math.PI*2,e=xe.clamp(l.roamPos.x+Math.cos(n)*320,-780,780),t=xe.clamp(l.roamPos.z+Math.sin(n)*320,-1580,440),i=Uf();Se.add(i);const s={mesh:i,x:e,z:t,yaw:Math.random()*Math.PI*2,speed:60,bumpT:0};return lt.cars.push(s),ci("whoosh",.2,.8,.1),s}function zf(n){Ps(n.mesh),lt.cars=lt.cars.filter(e=>e!==n)}function Nf(n){for(const e of n.meshes)Ps(e);lt.blocks=lt.blocks.filter(e=>e!==n)}function wd(){for(const n of[...lt.cars])zf(n);for(const n of[...lt.blocks])Nf(n);lt.evadeT=0,lt.nearest=1/0,lt.bustT=0,lt.blockCd=6,l.heat=0}function W_(){const n=Math.sin(l.roamYaw),e=-Math.cos(l.roamYaw),t=l.roamPos.x+n*215,i=l.roamPos.z+e*215,s=Be.x0+Math.round((t-Be.x0)/Be.pitch)*Be.pitch,a=Be.zNear-Math.round((Be.zNear-i)/Be.pitch)*Be.pitch,r=Math.abs(t-s),o=Math.abs(i-a);let c,h,d,u,m,p;if(r<=o&&r<Be.streetW*.6)c=s,h=i,d=1,u=0,m=0,p=1;else if(o<Be.streetW*.6)c=t,h=a,d=0,u=1,m=1,p=0;else return!1;if(c<Be.x0||c>Be.x1||h>Be.zNear||h<Be.zFar||lt.blocks.some(v=>Math.hypot(v.x-c,v.z-h)<140))return!1;const x=ce(c,h),_=Be.streetW+3,g=new W({color:1907997,roughness:.6,emissive:11674146,emissiveIntensity:.5}),f=new z(new le(.9,.16,_),g);f.position.set(c,x+.1,h),f.lookAt(c+d,x+.1,h+u),Se.add(f);const y=[f];for(const v of[-1,1]){const M=Uf();M.position.set(c+d*v*(_*.32),x+.06,h+u*v*(_*.32)),M.rotation.y=Math.atan2(d,u)+v*.7,Se.add(M),y.push(M)}return lt.blocks.push({x:c,z:h,latX:d,latZ:u,fwX:m,fwZ:p,w:_,meshes:y,age:0,hitT:0}),l.message="ROADBLOCK AHEAD!",l.messageTimer=1.3,En(500,.2,"square",.1),!0}function X_(){const n=Math.min(600,Math.round(l.score*.12)+150);l.score=Math.max(0,l.score-n),Me.busts=(Me.busts||0)+1,l.message=`BUSTED! -${n}`,l.messageTimer=2,l.cameraShake=.5,En(220,.5,"sawtooth",.14),Ke.state==="active"&&Hr("busted"),l.drivingStolen&&st&&(zl(),l.vehicle="foot",l.speed=0,hn.visible=!0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.message="BUSTED! Ride confiscated"),wd()}function q_(n,e){const t=l.roamPos.x-n.x,i=l.roamPos.z-n.z,s=Math.hypot(t,i),a=l.heat||0;let r=Math.atan2(t,-i);const o=Math.sin(n.yaw),c=-Math.cos(n.yaw);if(c0(n.x+o*17,n.z+c*17)){const u=n.yaw-.7,m=n.yaw+.7;r=!c0(n.x+Math.sin(u)*17,n.z-Math.cos(u)*17)?u:m}const h=Math.atan2(Math.sin(r-n.yaw),Math.cos(r-n.yaw));n.yaw+=xe.clamp(h,-2*e,2*e);const d=s>30?Math.min(112+a*6,Math.abs(l.speed)+30):Math.max(42,Math.abs(l.speed)*.92);n.speed+=(d-n.speed)*Math.min(1,e*.85),n.x+=Math.sin(n.yaw)*n.speed*e,n.z-=Math.cos(n.yaw)*n.speed*e,n.x=xe.clamp(n.x,-800,800),n.z=xe.clamp(n.z,-1600,460),n.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),n.mesh.rotation.y=-n.yaw;for(const u of n.mesh.userData.wheels||[])u.rotation.x-=n.speed*e*1.7;return n.bumpT>0&&(n.bumpT-=e),s<6.2&&n.bumpT<=0&&(n.bumpT=1.3,l.vehicle==="car"?($f(new L(n.x,l.roamPos.y+.8,n.z),Math.abs(l.speed-n.speed)+24,"PIT MANEUVER!"),l.speed*=.78,n.speed*=.4,io(.3)):(l.cameraShake=Math.max(l.cameraShake,.3),l.message="Get out of there!",l.messageTimer=.9)),s}pn(new zt,(n,e)=>{const t=Math.floor(n*3.4)%2;if(If.emissiveIntensity=t?2.6:.35,Ff.emissiveIntensity=t?.35:2.6,l.mode!=="roam"){lt.cars.length&&wd();return}const i=l.heat||0,s=i>=1?Math.min(4,Math.ceil(i)):0;for(;lt.cars.length<s;)H_();for(;lt.cars.length>s;)zf(lt.cars[lt.cars.length-1]);let a=1/0;for(const r of[...lt.cars])a=Math.min(a,q_(r,e));lt.nearest=a,i>0&&a<12&&Math.abs(l.speed)<8?(lt.bustT+=e,lt.bustT>2.2&&(lt.bustT=0,X_())):lt.bustT=Math.max(0,lt.bustT-e*1.5),i>=4&&(lt.blockCd-=e,lt.blockCd<=0&&Math.abs(l.speed)>30&&(W_(),lt.blockCd=12));for(const r of[...lt.blocks]){r.age+=e,r.hitT>0&&(r.hitT-=e),(r.age>40||i<4)&&Nf(r);const o=l.roamPos.x-r.x,c=l.roamPos.z-r.z,h=o*r.latX+c*r.latZ,d=o*r.fwX+c*r.fwZ;Math.abs(h)<r.w*.5&&Math.abs(d)<1.5&&!l.roamAir&&l.vehicle==="car"&&r.hitT<=0&&(r.hitT=2.5,l.spikedT=3.5,l.speed*=.5,l.damage=xe.clamp(l.damage+6,0,100),l.message="SPIKE STRIP!",l.messageTimer=1.2,l.cameraShake=Math.max(l.cameraShake,.4),ci("skid",.55,1.25,.1),io(.15))}if(lt.panicTick-=e,lt.panicTick<=0&&i>0){lt.panicTick=.4;for(const r of An){const o=r.actor;if(!o||!o.type||o.stolen||o.panicT>0)continue;let c=Math.hypot(l.roamPos.x-r.x,l.roamPos.z-r.z)<45;if(!c){for(const h of lt.cars)if(Math.hypot(h.x-r.x,h.z-r.z)<65){c=!0;break}}c&&(o.panicT=1.6)}}i>0&&(a>240?(lt.evadeT+=e,lt.evadeT>9&&(l.heat=Math.max(0,i-1),lt.evadeT=l.heat>0?4:0,l.heat===0&&(l.score+=500,Bi("+500 ESCAPED THE LAW"),En(980,.22),l.message="You lost them",l.messageTimer=1.4))):lt.evadeT=Math.max(0,lt.evadeT-e*.6)),Me.police=lt.cars.length});const Ke={state:"idle",type:null,mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:5,beacons:[]},h0=["van","boxTruck","taxi","pickup"];function kf(n){const e=new z(new We(3.4,3.4,340,12,1,!0),new Et({color:n,transparent:!0,opacity:.15,depthWrite:!1,side:wt,blending:ri}));return e.frustumCulled=!1,Se.add(e),e}function Of(){for(const n of Ke.beacons)n.geometry.dispose(),n.material.dispose(),Se.remove(n);Ke.beacons=[]}function Dh(n,e){for(let t=0;t<220;t++){const i=Math.random()<.5,s=i?Be.x0+(Math.random()*Math.round((Be.x1-Be.x0)/Be.pitch)|0)*Be.pitch:Be.zNear-(Math.random()*Math.round((Be.zNear-Be.zFar)/Be.pitch)|0)*Be.pitch,a=(Math.random()<.5?-1:1)*(Be.streetW*.5+6),r=i?Be.zFar+100+Math.random()*(Be.zNear-Be.zFar-200):Be.x0+100+Math.random()*(Be.x1-Be.x0-200),o=i?s+a:r,c=i?r:s+a,h=Math.hypot(o-l.roamPos.x,c-l.roamPos.z);if(!(h<n||h>e)&&!Ln(o,c,8,8,1)&&!(Js(o,c).depth>0)&&!un.some(d=>Math.abs(o-d.x)<(d.hw??d.radius??0)+5&&Math.abs(c-d.z)<(d.hd??d.radius??0)+5))return{x:o,z:c,yaw:i?0:Math.PI/2}}return null}function Bf(){const n=Dh(200,700);if(!n){Ke.cooldown=4;return}const e=h0[Math.random()*h0.length|0];Ke.type=e,Ke.mesh=Qr(e,[16770048,5814783,16752762,9498256][Math.random()*4|0]),Ke.mesh.userData.stolenYOff=.57,Ke.mesh.position.set(n.x,ce(n.x,n.z)+.28,n.z),Ke.mesh.rotation.y=-n.yaw,Se.add(Ke.mesh),Ke.pickup=n;const t=kf(3531007);t.position.set(n.x,ce(n.x,n.z)+150,n.z),Ke.beacons.push(t),Ke.state="available",l.message=`Delivery job: grab the ${e.toUpperCase()} at the cyan beacon`,l.messageTimer=2}function Y_(){if(Ke.state!=="available"||!Ke.mesh||l.roamPos.distanceTo(Ke.mesh.position)>6)return!1;Cd();const n=Ke.mesh;return st={mesh:n,type:Ke.type,actor:null,parked:null,parkedYaw:0,job:!0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.position.x,ce(n.position.x,n.position.z)+zn,n.position.z),l.roamYaw=Ke.pickup.yaw,l.camYaw=l.roamYaw,l.speed=0,hn.visible=!1,ci("jack",.5,1,.08)||En(340,.18,"square",.1),Qn(),$_(),!0}function $_(){const n=Dh(420,900)||Dh(250,1100);if(!n){Hr("no route");return}Ke.dest=n,Ke.timeLeft=Math.round(14+Math.hypot(n.x-l.roamPos.x,n.z-l.roamPos.z)*.062),Of();const e=kf(16766720);e.position.set(n.x,ce(n.x,n.z)+150,n.z),Ke.beacons.push(e),Ke.state="active",l.message=`Deliver the ${Ke.type.toUpperCase()} to the gold beacon — ${Ke.timeLeft}s`,l.messageTimer=2.2}function Sd(n){Of(),Object.assign(Ke,{state:"idle",mesh:null,pickup:null,dest:null,timeLeft:0,cooldown:n})}function Hr(n){Ke.state!=="idle"&&(st?.job?(zl(),l.vehicle==="car"&&(l.vehicle="foot",hn.visible=!0,l.speed=0,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05)):Ke.mesh&&Ps(Ke.mesh),Sd(9),n!=="silent"&&(l.message=`Delivery failed — ${n}`,l.messageTimer=1.6,En(240,.3,"sawtooth",.1)),Me.deliveryFails=(Me.deliveryFails||0)+1)}function Z_(n){Ps(n),Sd(9),l.message="Delivery failed — vehicle abandoned",l.messageTimer=1.5,Me.deliveryFails=(Me.deliveryFails||0)+1}function K_(){const n=1200+Math.ceil(Ke.timeLeft)*10;l.score+=n,Me.deliveries=(Me.deliveries||0)+1,Bi(`+${n} DELIVERED`,!0),En(980,.18),setTimeout(()=>En(1320,.22),100);const e=st?.mesh;st=null,l.drivingStolen=!1,e&&Ps(e),l.vehicle="foot",l.speed=0,hn.visible=!0,l.roamPos.x-=Math.cos(l.roamYaw)*3.4,l.roamPos.z-=Math.sin(l.roamYaw)*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,Sd(8),l.message="Delivered! Another job will turn up",l.messageTimer=1.8}pn(new zt,(n,e)=>{if(l.mode!=="roam"){Ke.state!=="idle"&&Hr("silent");return}Ke.state==="idle"?(Ke.cooldown-=e,Ke.cooldown<=0&&Bf()):Ke.state==="active"&&(Ke.timeLeft-=e,Ke.timeLeft<=0?Hr("time's up"):l.drivingStolen&&st?.job&&Math.hypot(l.roamPos.x-Ke.dest.x,l.roamPos.z-Ke.dest.z)<15&&Math.abs(l.speed)<26&&K_())});pn(new zt,(n,e)=>{if(!de)return;const t=l.mode==="roam"&&l.vehicle==="heli"?1:0;de.rpm+=(t-de.rpm)*Math.min(1,e*(t?1.4:.5)),de.rotor.rotation.y+=de.rpm*26*e,de.tailRotor.rotation.x+=de.rpm*42*e});const J_=new Et({color:10470630,transparent:!0,opacity:.8,depthWrite:!1}),nl=Array.from({length:42},()=>{const n=new z(new Ot(.14,6,5),J_);return n.visible=!1,Se.add(n),{mesh:n,life:0,velocity:new L}}),j_=new Et({color:12245225,transparent:!0,opacity:.34,depthWrite:!1,side:wt}),Ih=Array.from({length:14},()=>{const n=new z(new Rl(.82,1,28),j_.clone());return n.rotation.x=-Math.PI/2,n.visible=!1,Se.add(n),{mesh:n,life:0,maxLife:1}});function Vf(n,e,t=1){const i=Ih.find(s=>s.life<=0)||Ih[0];i.life=1,i.maxLife=.9+t*.25,i.mesh.visible=!0,i.mesh.position.set(n,ce(n,e)+.22,e),i.mesh.scale.setScalar(1.2*t)}function Q_(n,e=40){const t=Math.min(26,8+e*.22);for(let i=0;i<t;i++){const s=nl.find(a=>a.life<=0)||nl[i%nl.length];s.mesh.visible=!0,s.mesh.position.set(n.x+(Math.random()-.5)*2.4,n.y+.3,n.z+(Math.random()-.5)*2.4),s.velocity.set((Math.random()-.5)*8,2.4+Math.random()*3.6,(Math.random()-.5)*8),s.life=.3+Math.random()*.28}Vf(n.x,n.z,1.6)}pn(new zt,(n,e)=>{for(const t of nl)t.life>0&&(t.life-=e,t.velocity.y-=31*e,t.mesh.position.addScaledVector(t.velocity,e),t.life<=0&&(t.mesh.visible=!1));for(const t of Ih)if(t.life>0){t.life-=e/t.maxLife;const i=1-t.life;t.mesh.scale.setScalar(t.mesh.scale.x+e*(5+i*7)),t.mesh.material.opacity=.34*t.life,t.life<=0&&(t.mesh.visible=!1)}});const Qa=new DM(rn);Qa.addPass(new IM(Se,ye));const Gf=new qa(new Ue(window.innerWidth,window.innerHeight),.4,.72,.86);Qa.addPass(Gf);Qa.addPass(new FM);const ey={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Mr=new mf(ey);Qa.addPass(Mr);const ty=new W({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Tr=Array.from({length:72},()=>{const n=new z(new Ot(.1,8,5),ty);return n.visible=!1,Se.add(n),{mesh:n,life:0,velocity:new L}}),ny=new Et({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:wt}),Er=Array.from({length:90},()=>{const n=new z(new _n(1,18),ny.clone());return n.visible=!1,Se.add(n),{mesh:n,life:0,maxLife:1,velocity:new L,spin:0}}),iy=new W({color:2962232,roughness:.58,metalness:.34}),Ar=Array.from({length:48},()=>{const n=new z(new le(.18,.08,.26),iy);return n.visible=!1,Se.add(n),{mesh:n,life:0,velocity:new L,spin:new L}});let Ae=null;function Hf(){if(Ae)return;const n=new AudioContext,e=n.createGain();e.gain.value=Number(localStorage.getItem("steel-ribbon-vol")??.8),e.connect(n.destination);const t=n.createBiquadFilter();t.type="lowpass",t.frequency.value=540;const i=n.createGain();i.gain.value=1e-4,t.connect(i),i.connect(e);const s=n.createWaveShaper(),a=new Float32Array(1024);for(let A=0;A<1024;A++){const w=(A/511.5-1)*1.6;a[A]=4*w/(1+3*Math.abs(w))}s.curve=a,s.oversample="2x",s.connect(t);const r=n.createGain();r.gain.value=1,r.connect(s);const o=(A,w,b)=>{const P=n.createOscillator(),D=n.createGain();return P.type=A,D.gain.value=w,P.connect(D),D.connect(b),P.start(),{o:P,g:D}},c=o("sine",.5,t),h=o("sawtooth",.3,r),d=o("sawtooth",.3,r),u=o("triangle",.03,t),m=n.createOscillator(),p=n.createGain();m.type="sine",m.frequency.value=12,p.gain.value=0,m.connect(p),p.connect(r.gain),m.start();const x=n.createBuffer(1,n.sampleRate*2,n.sampleRate),_=x.getChannelData(0);for(let A=0;A<_.length;A++)_[A]=Math.random()*2-1;const g=(A,w,b,P)=>{const D=n.createBufferSource(),O=n.createBiquadFilter(),Z=n.createGain();return D.buffer=x,D.loop=!0,D.playbackRate.value=P,O.type=A,O.frequency.value=w,O.Q.value=b,Z.gain.value=1e-4,D.connect(O),O.connect(Z),Z.connect(e),D.start(),{filter:O,gain:Z}},f=g("bandpass",900,.6,1),y=g("highpass",1800,.8,.82),v=g("bandpass",300,1.4,.5),M=g("bandpass",5200,.3,1),E=n.createGain();E.gain.value=1e-4,E.connect(e);const S=n.createOscillator(),C=n.createGain();S.type="triangle",S.frequency.value=660,C.gain.value=1e-4,S.connect(C),C.connect(e),S.start(),Ae={ctx:n,master:e,engine:c.o,engineGain:i,filter:t,rumble:c,growl:h,growlB:d,whine:u,burble:{o:m,depth:p},siren:{o:S,g:C},rain:M,wind:f,skid:y,boost:v,musicGain:E,nextNote:0,beat:0,prevBoost:!1}}const Wf={interceptor:{fMul:1,sub:.55,saw:.4,det:1.007,whine:.05,whineMul:3.02,cutoff:1,burble:1},bullet:{fMul:1.18,sub:.42,saw:.38,det:1.01,whine:.11,whineMul:4.1,cutoff:1.25,burble:.5},brawler:{fMul:.82,sub:.68,saw:.44,det:1.005,whine:.03,whineMul:2.6,cutoff:.8,burble:1.5},zephyr:{fMul:1.45,sub:.3,saw:.34,det:1.014,whine:.14,whineMul:5,cutoff:1.35,burble:.3},compact:{fMul:1.3,sub:.3,saw:.3,det:1.01,whine:.08,whineMul:4,cutoff:1.1,burble:.4},taxi:{fMul:1.15,sub:.36,saw:.32,det:1.008,whine:.06,whineMul:3.6,cutoff:1,burble:.5},pickup:{fMul:.9,sub:.6,saw:.4,det:1.006,whine:.04,whineMul:2.8,cutoff:.85,burble:1.2},van:{fMul:.95,sub:.55,saw:.36,det:1.006,whine:.04,whineMul:3,cutoff:.9,burble:.9},boxTruck:{fMul:.6,sub:.75,saw:.42,det:1.004,whine:.03,whineMul:2.2,cutoff:.62,burble:1.8},bus:{fMul:.52,sub:.8,saw:.42,det:1.004,whine:.05,whineMul:2,cutoff:.55,burble:2}},sy=["interceptor","bullet","brawler","zephyr"];function Xf(){return l.mode==="roam"&&l.drivingStolen&&st?Wf[st.type]?st.type:"compact":sy[Gi]||"interceptor"}function rs(){Ae||Hf(),Ae?.ctx.state==="suspended"&&Ae.ctx.resume().catch(()=>{}),cy()}function Oa(n){if(!Ae)return;const{ctx:e}=Ae,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.value=55+n*2.6,i.gain.setValueAtTime(Math.min(.34,n/55),e.currentTime),i.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(i).connect(Ae.master),t.start(),t.stop(e.currentTime+.24)}function ay(){if(!Ae||ci("whoosh",.4,1,.1))return;const{ctx:n}=Ae,e=n.createOscillator(),t=n.createGain(),i=n.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(85,n.currentTime),e.frequency.exponentialRampToValueAtTime(310,n.currentTime+.45),i.type="lowpass",i.frequency.value=900,t.gain.setValueAtTime(.14,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.55),e.connect(i).connect(t).connect(Ae.master),e.start(),e.stop(n.currentTime+.6)}function ry(){if(!Ae||ci("splat",.6,1,.14))return;const n=Ae.ctx,e=n.createBiquadFilter(),t=n.createGain(),i=n.createBufferSource();i.buffer=qf(),i.loop=!1,i.playbackRate.value=.72,e.type="lowpass",e.frequency.value=760,t.gain.setValueAtTime(.3,n.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.2),i.connect(e),e.connect(t),t.connect(Ae.master),i.start(n.currentTime,Math.random()*1.2,.22);const s=n.createOscillator(),a=n.createGain();s.type="sine",s.frequency.setValueAtTime(300,n.currentTime),s.frequency.exponentialRampToValueAtTime(64,n.currentTime+.2),a.gain.setValueAtTime(.22,n.currentTime),a.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+.24),s.connect(a).connect(Ae.master),s.start(),s.stop(n.currentTime+.26)}let Cc=null;function qf(){if(Cc)return Cc;const n=Ae.ctx,e=n.createBuffer(1,n.sampleRate*2,n.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return Cc=e}function oy(n=1){if(!Ae||ci("splash",Math.min(.6,.28+n*.16),.95,.1))return;const{ctx:e}=Ae,t=e.createBufferSource(),i=e.createBiquadFilter(),s=e.createGain();t.buffer=qf(),t.playbackRate.value=.55,i.type="lowpass",i.frequency.value=950,s.gain.setValueAtTime(Math.min(.32,.14+n*.08),e.currentTime),s.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.34),t.connect(i),i.connect(s),s.connect(Ae.master),t.start(e.currentTime,Math.random()*1.2,.36)}const Kn={buffers:{},loops:{},loading:!1},ly=["splat","crash","whoosh","splash","rotor","jack","land","skid","music"];function cy(){if(!(Kn.loading||!Ae)){Kn.loading=!0;for(const n of ly)fetch(`audio/${n}.mp3`).then(e=>e.ok?e.arrayBuffer():Promise.reject(e.status)).then(e=>Ae.ctx.decodeAudioData(e)).then(e=>Kn.buffers[n]=e).catch(()=>{})}}function ci(n,e=.5,t=1,i=.06){const s=Ae&&Kn.buffers[n];if(!s)return!1;const a=Ae.ctx,r=a.createBufferSource(),o=a.createGain();return r.buffer=s,r.playbackRate.value=t*(1-i/2+Math.random()*i),o.gain.value=e,r.connect(o).connect(Ae.master),r.start(),!0}function Rc(n,e,t=1e-4){if(Kn.loops[n])return Kn.loops[n];if(!Ae||!Kn.buffers[n])return null;const i=Ae.ctx,s=i.createBufferSource(),a=i.createGain();return s.buffer=Kn.buffers[n],s.loop=!0,a.gain.value=t,s.connect(a),a.connect(e||Ae.master),s.start(),Kn.loops[n]={src:s,gain:a}}const d0={bass:[55,55,43.65,49],arps:[[220,261.63,329.63,440],[220,261.63,329.63,523.25],[174.61,220,261.63,349.23],[196,246.94,293.66,392]]};function u0(n,e,t,i,s,a){const{ctx:r}=Ae,o=r.createOscillator(),c=r.createBiquadFilter(),h=r.createGain();o.type=i,o.frequency.value=n,c.type="lowpass",c.frequency.value=a,h.gain.setValueAtTime(1e-4,e),h.gain.linearRampToValueAtTime(s,e+.02),h.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(h),h.connect(Ae.musicGain),o.start(e),o.stop(e+t+.05)}function hy(){const{ctx:n}=Ae,e=60/92/2;for(Ae.nextNote<n.currentTime-1&&(Ae.nextNote=n.currentTime+.08);Ae.nextNote<n.currentTime+.35;){const t=Ae.beat%32,i=t/8|0;t%4===0&&u0(d0.bass[i],Ae.nextNote,.5,"triangle",.5,420),u0(d0.arps[i][t%4],Ae.nextNote,.19,"sawtooth",.16,1300),Ae.nextNote+=e,Ae.beat++}}function js(n,e=18){const t=Math.min(e,Tr.length);for(let i=0;i<t;i++){const s=Tr.find(a=>a.life<=0)||Tr[i];s.mesh.visible=!0,s.mesh.position.copy(n),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Yf(n,e=10,t=1){const i=Math.min(e,Er.length);for(let s=0;s<i;s++){const a=Er.find(r=>r.life<=0)||Er[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new L((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),a.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),a.mesh.material.opacity=.18+Math.random()*.12,a.mesh.scale.setScalar(.8+Math.random()*1.2*t),a.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),a.life=a.maxLife=.55+Math.random()*.55,a.spin=(Math.random()-.5)*2.2}}function dy(n,e=8,t=1){const i=Math.min(e,Ar.length);for(let s=0;s<i;s++){const a=Ar.find(r=>r.life<=0)||Ar[s];a.mesh.visible=!0,a.mesh.position.copy(n).add(new L((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),a.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),a.mesh.scale.setScalar(.8+Math.random()*1.8*t),a.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),a.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),a.life=.65+Math.random()*.55}}function $f(n,e=Math.abs(l.speed),t="CRASH"){const i=xe.clamp(Math.abs(e)/70,.18,1.45);l.collisionHits++,l.collisionDrama=Math.max(l.collisionDrama,i),l.cameraShake=Math.max(l.cameraShake,.25+i*.45),l.damage=xe.clamp(l.damage+i*3.6,0,100),l.message=t,l.messageTimer=Math.max(l.messageTimer,.7),js(n,Math.round(10+i*24)),Yf(n,Math.round(5+i*12),i),dy(n,Math.round(3+i*8),i),ci("crash",Math.min(.75,.2+i*.4),.88+i*.18,.12)||Oa(18+i*34)}function uy(n){for(const e of Tr){if(e.life<=0)continue;e.life-=n,e.velocity.y-=26*n,e.mesh.position.addScaledVector(e.velocity,n);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of Er){if(e.life<=0)continue;e.life-=n,e.mesh.position.addScaledVector(e.velocity,n),e.velocity.y+=.4*n,e.mesh.rotation.z+=e.spin*n;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+n*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(ye.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of Ar)e.life<=0||(e.life-=n,e.velocity.y-=24*n,e.mesh.position.addScaledVector(e.velocity,n),e.mesh.rotation.x+=e.spin.x*n,e.mesh.rotation.y+=e.spin.y*n,e.mesh.rotation.z+=e.spin.z*n,e.life<=0&&(e.mesh.visible=!1))}function fy(){if(!Ae)return;const{ctx:n}=Ae,e=n.currentTime,t=(l.mode==="race"||l.mode==="roam"||l.mode==="paused")&&!(l.mode==="roam"&&l.vehicle==="foot"),i=l.mode==="roam"&&l.vehicle==="heli",s=l.tachRpm||900,a=xe.clamp((s-900)/6600,0,1),r=Math.abs(l.speed),o=l.mode==="roam"&&l.waterDepth||0,c=Wf[Xf()],h=i?26+(de?.rpm||0)*14:(38+a*124)*c.fMul;Ae.rumble.o.frequency.setTargetAtTime(i?h:h*.5,e,.03),Ae.growl.o.frequency.setTargetAtTime(i?h*2:h,e,.03),Ae.growlB.o.frequency.setTargetAtTime(i?h*2.02:h*c.det,e,.03),Ae.whine.o.frequency.setTargetAtTime(i?620+r*4:h*c.whineMul,e,.03),Ae.rumble.g.gain.setTargetAtTime(i?.6:c.sub,e,.08),Ae.growl.g.gain.setTargetAtTime(i?.24:c.saw,e,.08),Ae.growlB.g.gain.setTargetAtTime(i?.2:c.saw*.9,e,.08),Ae.whine.g.gain.setTargetAtTime(i?.12:c.whine*(.15+a*a*a*.85)*2,e,.08),Ae.burble.o.frequency.setTargetAtTime(Math.max(6,h*.25),e,.05),Ae.burble.depth.gain.setTargetAtTime(i?.22:c.burble*.16*(1-a*.8),e,.1),Ae.filter.frequency.setTargetAtTime((380+a*2300+r*5)*c.cutoff*(1-.6*o),e,.06),Ae.engineGain.gain.setTargetAtTime((t&&l.mode!=="paused"?.055+a*.055:1e-4)*(1-.42*o),e,.07),Ae.wind.gain.gain.setTargetAtTime(t?Math.min(.1,Math.max(0,(r-55)/850)):1e-4,e,.15),Ae.wind.filter.frequency.setTargetAtTime(700+r*8,e,.12);const d=l.mode==="roam"?l.roamSlip:l.grounded?Math.min(1,Math.abs(l.lateralVel)/15):0,u=Rc("skid");Ae.skid.gain.gain.setTargetAtTime(t&&d>.32?(d-.32)*(u?.05:.15):1e-4,e,.09),u&&u.gain.gain.setTargetAtTime(t&&d>.32?Math.min(.34,(d-.32)*.55):1e-4,e,.09);const m=Rc("rotor");m&&(m.gain.gain.setTargetAtTime(i?.06+(de?.rpm||0)*.3:1e-4,e,i?.3:.15),m.src.playbackRate.setTargetAtTime(.65+(i&&de?.rpm||0)*.5,e,.4)),l.boosting&&!Ae.prevBoost&&ay(),Ae.prevBoost=!!l.boosting,Ae.boost.gain.gain.setTargetAtTime(t&&l.boosting?.15:1e-4,e,l.boosting?.05:.22),Ae.boost.filter.frequency.setTargetAtTime(l.boosting?420+r*3:260,e,.1),Ae.rain&&Ae.rain.gain.gain.setTargetAtTime(Ya()>.02&&l.mode!=="menu"?Ya()*.045:1e-4,e,.4);const p=l.mode==="roam"&&(l.heat||0)>0&&lt.nearest<460,x=p?Math.min(.06,(460-lt.nearest)/460*.075):1e-4;Ae.siren.g.gain.setTargetAtTime(x,e,.25),Ae.siren.o.frequency.setTargetAtTime(Math.floor(e/.44)%2?924:655,e,.05);const _=localStorage.getItem("steel-ribbon-music")!=="0",g=_?Rc("music",Ae.musicGain,1):Kn.loops.music||null;Ae.musicGain.gain.setTargetAtTime(_?l.mode==="menu"?g?.3:.16:g?.065:.028:1e-4,e,.5),_&&!g&&hy()}function Wr(n=!1,e=!1,t=!1){Hf(),rs(),je.clear(),Yr(),zl();const i=n||e;l.seasonRace=t&&!i;for(let a=0;a<qn.length;a++){const r=qn[a];r.distance=i?-900:-26-a*7,r.finished=0,r.mesh.visible=!i}Object.assign(l,{mode:"race",practice:i,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:i?-900:-28,rivalDistance:i?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":n?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:i?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const s=mt(l.s);l.y=s.p.y+2.1,l.yVel=0,l.ghostRec=[],Oy(),By(),qe.menu.classList.add("hidden"),qe.result.classList.add("hidden"),qe.resultStats.innerHTML="",qe.position.textContent=e?"FREE RUN":n?"PRACTICE":"DIV 4",qe.trackName.textContent=se.name,Gt.visible=!1,dn&&(dn.visible=!0),document.body.classList.remove("roam-mode"),qi(),window.__freeCam=!1}function Ml(){rs(),l.mode="roam",l.practice=!0,l.freeRun=!1,je.clear(),Yr();let n=80,e=338;Sn(n,e,6).clearance<6&&(n=80,e=320),l.roamPos.set(n,ce(n,e),e),l.roamYaw=0,l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ee.zoom=0,l.wheelSteer=0,l.speed=0,l.boost=1,l.damage=0,l.cameraShake=0,l.collisionDrama=0,l.collisionHits=0,l.collisionCooldown=0,l.objectiveIndex=0,l.objectiveHits=0,l.objectiveLap=1,l.driftCombo=0,l.driftComboT=0,l.stuntActive=!1,l.stuntPrime=0,l.sloMoT=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.roamAirT=0,l.vehicle="car",hn.visible=!1,Hr("silent"),zl(),wd(),de&&(de.pos.set(de.pad.x,de.pad.y+.24,de.pad.z),de.vel.set(0,0,0),de.mesh.position.copy(de.pos));for(const s of Jt)s.collected=!1;l.message="",l.messageTimer=0,eo(!1),Gt.visible=!0,dn&&(dn.visible=!1),document.body.classList.add("roam-mode"),qi(),window.__freeCam=!1,qe.menu.classList.add("hidden"),qe.result.classList.add("hidden"),qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",Qn();const t=Math.sin(l.roamYaw),i=-Math.cos(l.roamYaw);ye.position.set(l.roamPos.x-t*17,l.roamPos.y+7.2,l.roamPos.z-i*17),kh(),ye.lookAt(l.roamPos.x+t*13,l.roamPos.y+2.45,l.roamPos.z+i*13),ye.fov=69,ye.updateProjectionMatrix()}function Qn(){const n=Ad();n.position.set(l.roamPos.x,l.roamPos.y+.3-(n.userData.stolenYOff||0)-l.roamSuspension*.45-(l.waterDepth||0)*.38,l.roamPos.z),n.quaternion.setFromAxisAngle(sn,-l.roamYaw),n.rotateZ(-l.wheelSteer*xe.clamp(Math.abs(l.speed)/90,0,1)*.1+(l.roamAir&&l.stuntActive&&l.airRoll||0)),n.rotateX(l.roamAir?l.stuntActive&&l.stuntRamp?.type==="flip"?-(l.flipT||0)*Math.PI*2:xe.clamp(-l.roamVy*.014,-.3,.34):xe.clamp(l.roamSuspension,-.16,.22))}function Zf(n,e){let t=null;for(const s of aa)for(const a of s.segments){const r=n-a.a.x,o=e-a.a.z,c=xe.clamp((r*a.abx+o*a.abz)/a.lenSq,0,1),h=a.a.x+a.abx*c,d=a.a.z+a.abz*c,u=Math.hypot(n-h,e-d);if(u>s.halfW+In*1.15)continue;const m=xe.lerp(a.a.y,a.b.y,c),p=xe.lerp(a.u0,a.u1,c),x=u+Math.max(0,ce(n,e)-m)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:m,u:p,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:a.abx,tangentZ:a.abz,lateral:s.dirSel*se.width*.34,score:x})}if(!t)return null;const i=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=i,t.tangentZ/=i,t}function Kf(n,e,t=ce(n,e),i=!1){let s=null;const a=10;for(let o=0;o<se.length;o+=a){if(Vi(o+a*.5))continue;const c=mt(o),h=mt(o+a),d=h.p.x-c.p.x,u=h.p.z-c.p.z,m=Math.max(1e-4,d*d+u*u),p=xe.clamp(((n-c.p.x)*d+(e-c.p.z)*u)/m,0,1),x=c.p.x+d*p,_=c.p.z+u*p,g=n-x,f=e-_,y=Math.hypot(g,f);if(y>se.width*.5+In*.45)continue;const v=xe.lerp(c.p.y,h.p.y,p)+.58;if(!i&&t<v-5)continue;const M=new L(u,0,-d).normalize(),E=xe.clamp(g*M.x+f*M.z,-se.width*.44,se.width*.44);(!s||y<s.dist)&&(s={kind:"track",y:v,s:o+a*p,lateral:E,tangentX:d,tangentZ:u,dist:y})}if(!s)return null;const r=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=r,s.tangentZ/=r,s}function Ys(n,e,t=l.roamPos.y){const i=ce(n,e),s=B_(n,e);let a=s>0?{kind:"stunt",y:i+s}:{kind:"ground",y:i};const r=Zf(n,e);r&&r.y>=i-1.2&&(a=r);const o=Kf(n,e,Math.max(t,a.y));return!(a.kind==="ramp"&&a.rampType==="off")&&o&&o.y>=a.y-.8&&(a=o),a}function f0(n){if(n.rampType==="off"||l.drivingStolen)return!1;const e=Math.sin(l.roamYaw)*n.tangentX+-Math.cos(l.roamYaw)*n.tangentZ;if(l.speed<10||e<.22)return!1;const t=(n.mergeS??n.s??22)+8,i=mt(t);return l.mode="race",l.practice=!0,l.freeRun=!0,l.breakdownTimer=0,l.s=i.s,l.totalDistance=i.s,l.lastSafeS=i.s,l.lastSafeDistance=i.s,l.lateral=xe.clamp(n.lateral??0,-se.width*.32,se.width*.32),l.lateralVel=-Math.sign(l.lateral)*Math.min(4,Math.abs(l.speed)*.04),l.speed=xe.clamp(Math.max(28,l.speed),18,112),l.grounded=!0,l.y=i.p.y+2.1,l.yVel=0,l.airtime=0,l.rivalS=-900,l.rivalDistance=-900,l.leadState="SOLO",l.message="Merged onto the ribbon",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.35),eo(!1),Gt.visible=!1,dn&&(dn.visible=!0),document.body.classList.remove("roam-mode"),qi(),qe.position.textContent="FREE RUN",qe.trackName.textContent=se.name,Qn(),!0}function py(n,e,t){if(l.mode!=="race")return!1;const i=t.tangent.x,s=t.tangent.z,a=Math.max(1e-4,Math.hypot(i,s));l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(n,ce(n,e)+zn,e),l.roamYaw=Math.atan2(i/a,-s/a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=xe.clamp(Math.abs(l.speed)*.6,12,70),l.grounded=!0,l.yVel=0,l.airtime=0,l.roamAir=!1,l.roamVy=0,l.roamPrevY=null,l.damage=xe.clamp(l.damage+10,0,100),l.cameraShake=Math.max(l.cameraShake,.8),l.message="Off the ribbon — welcome to the streets",l.messageTimer=1.8,ci("land",.6,.92,.08)||Oa(30),js(new L(n,l.roamPos.y+.4,e),20),eo(!1),Gt.visible=!0,dn&&(dn.visible=!1),document.body.classList.add("roam-mode"),qi(),l.vehicle="car",hn.visible=!1,qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",Qn();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),ye.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),ye.fov=69,ye.updateProjectionMatrix(),!0}function my(n){if(!n||l.mode!=="race")return!1;const e=n.segments[0],t=n.points[0],i=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/i,a=e.abz/i;l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(t.x+s*3.5,t.y+zn,t.z+a*3.5),l.roamYaw=Math.atan2(s,-a),l.camYaw=l.roamYaw,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,l.wheelSteer=0,l.speed=xe.clamp(Math.max(24,Math.abs(l.speed)*.82),20,78),l.grounded=!0,l.yVel=0,l.airtime=0,l.message="Exited to city streets",l.messageTimer=1.25,l.cameraShake=Math.max(l.cameraShake,.22),eo(!1),Gt.visible=!0,dn&&(dn.visible=!1),document.body.classList.add("roam-mode"),qi(),l.vehicle="car",hn.visible=!1,qe.position.textContent="FREE ROAM",qe.trackName.textContent="City Streets",Qn();const r=Math.sin(l.roamYaw),o=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-r*17,l.roamPos.y+7.2,l.roamPos.z-o*17),ye.lookAt(l.roamPos.x+r*13,l.roamPos.y+2.45,l.roamPos.z+o*13),ye.fov=69,ye.updateProjectionMatrix(),js(l.roamPos.clone().add(new L(0,.6,0)),10),!0}function xy(){const n=Il.set(0,0,-1).applyQuaternion(ye.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.roamPos.y,yVel:l.yVel,grounded:!l.roamAir,objectiveHits:l.objectiveHits,waterDepth:+(l.waterDepth||0).toFixed(3),driftAngle:+(l.driftAngle||0).toFixed(3),driftCombo:l.driftCombo||0,driftComboT:+(l.driftComboT||0).toFixed(2),driftT:+(l.driftT||0).toFixed(2),driftAcc:+(l.driftAcc||0).toFixed(1),roamView:Ia,heat:+(l.heat||0).toFixed(2),police:lt.cars.length,policeNearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),roadblocks:lt.blocks.length,spikedT:+(l.spikedT||0).toFixed(2),rain:+Ya().toFixed(2),job:{state:Ke.state,type:Ke.type,timeLeft:+Ke.timeLeft.toFixed(1)},stuntActive:!!l.stuntActive,stuntType:l.stuntActive&&l.stuntRamp?.type||null,flipT:+(l.flipT||0).toFixed(2),bullseye:!!l.stuntBullseye,sloMoT:+(l.sloMoT||0).toFixed(2),stunts:Me.stunts||0,airTime:+(l.roamAirT||0).toFixed(2),vehicle:l.vehicle||"car",drivingStolen:!!l.drivingStolen,stolenType:l.drivingStolen&&st?.type||null,altitude:+(l.roamPos.y-ce(l.roamPos.x,l.roamPos.z)).toFixed(1),roamPos:{x:l.roamPos.x,y:l.roamPos.y,z:l.roamPos.z},input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:Math.sin(l.roamYaw),y:0,z:-Math.cos(l.roamYaw)},cameraWorld:{x:n.x,y:n.y,z:n.z}}}var Qs=document.createElement("canvas");Qs.id="minimap",Qs.width=256,Qs.height=256;document.querySelector("#app")?.appendChild(Qs);var Fh=null,gy=0,$s={cx:0,cz:-570,span:2180};function vn(n,e,t){return[((n-$s.cx)/$s.span+.5)*t,((e-$s.cz)/$s.span+.5)*t]}function Td(){if(!$s)return;const n=512,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");t.fillStyle="rgba(9, 15, 24, 0.88)",t.fillRect(0,0,n,n),t.strokeStyle="rgba(150, 185, 215, 0.5)",t.lineWidth=3,t.lineCap="round";for(let s=Be.x0;s<=Be.x1+1;s+=Be.pitch){const[a,r]=vn(s,Be.zNear,n),[o,c]=vn(s,Be.zFar,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}for(let s=Be.zNear;s>=Be.zFar-1;s-=Be.pitch){const[a,r]=vn(Be.x0,s,n),[o,c]=vn(Be.x1,s,n);t.beginPath(),t.moveTo(a,r),t.lineTo(o,c),t.stroke()}t.strokeStyle="rgba(255, 176, 90, 0.85)",t.lineWidth=2.6,t.beginPath();let i=!0;for(const s of Ul())if(s.courseIndex===Ts){const[a,r]=vn(s.x,s.z,n);i?t.moveTo(a,r):t.lineTo(a,r),i=!1}t.closePath(),t.stroke(),t.fillStyle="rgba(96, 168, 255, 0.75)";for(const s of ia){const[a,r]=vn(s.x,s.z,n);t.beginPath(),t.ellipse(a,r,Math.max(3,s.rx/$s.span*n),Math.max(3,s.rz/$s.span*n),0,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 150, 60, 0.95)";for(const s of Li||[]){const[a,r]=vn(s.x,s.z,n);t.save(),t.translate(a,r),t.rotate(s.yaw),t.beginPath(),t.moveTo(0,-7),t.lineTo(4.4,4.4),t.lineTo(-4.4,4.4),t.closePath(),t.fill(),t.restore()}Fh=e}function vy(){const n=l.mode==="roam";if((Qs.style.display=n?"block":"none")&&!n||!n||!Fh||gy++%2)return;const e=Qs.width,t=Qs.getContext("2d");t.clearRect(0,0,e,e),t.drawImage(Fh,0,0,e,e);for(const a of aa)if(a.rampType==="on"&&a.points?.length){const r=a.points[0],[o,c]=vn(r.x,r.z,e);t.fillStyle="#6dff9e",t.beginPath(),t.arc(o,c,4,0,Math.PI*2),t.fill()}for(let a=0;a<Jt.length;a++){const r=Jt[a],[o,c]=vn(r.x,r.z,e),h=a===l.objectiveIndex%Jt.length;t.fillStyle=h?"#7df1ff":"rgba(125, 241, 255, 0.35)",t.beginPath(),t.arc(o,c,h?5.5+Math.sin(xl*5)*1.4:3,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 255, 255, 0.8)";for(const a of An){const[r,o]=vn(a.x,a.z,e);t.fillRect(r-1.4,o-1.4,2.8,2.8)}if(de){const[a,r]=vn(de.pad.x,de.pad.z,e);if(t.fillStyle="#ffd45b",t.font="700 11px Arial",t.textAlign="center",t.fillText("H",a,r+4),l.vehicle!=="heli"){const[o,c]=vn(de.pos.x,de.pos.z,e);t.fillStyle="#8ef0ff",t.beginPath(),t.arc(o,c,3,0,Math.PI*2),t.fill()}}if(l.vehicle!=="car"||l.drivingStolen){const[a,r]=vn(Hi.x,Hi.z,e);t.fillStyle="#7dc4ff",t.fillRect(a-2.4,r-2.4,4.8,4.8)}if(st?.parked){const[a,r]=vn(st.parked.x,st.parked.z,e);t.fillStyle="#ffb35c",t.fillRect(a-2.2,r-2.2,4.4,4.4)}t.fillStyle="#ff4d4d";for(const a of lt.cars){const[r,o]=vn(a.x,a.z,e);t.beginPath(),t.arc(r,o,3.2,0,Math.PI*2),t.fill()}for(const a of lt.blocks){const[r,o]=vn(a.x,a.z,e);t.fillStyle="#ff8080",t.fillRect(r-4,o-1.4,8,2.8)}if(Ke.state==="available"&&Ke.pickup){const[a,r]=vn(Ke.pickup.x,Ke.pickup.z,e);t.fillStyle="#35e0ff",t.fillRect(a-2.6,r-2.6,5.2,5.2)}if(Ke.state==="active"&&Ke.dest){const[a,r]=vn(Ke.dest.x,Ke.dest.z,e);t.save(),t.translate(a,r),t.rotate(Math.PI/4),t.fillStyle="#ffd700",t.fillRect(-3,-3,6,6),t.restore()}const[i,s]=vn(l.roamPos.x,l.roamPos.z,e);t.save(),t.translate(i,s),t.rotate(l.roamYaw),t.fillStyle="#ffd45b",t.beginPath(),t.moveTo(0,-8),t.lineTo(5.2,6),t.lineTo(-5.2,6),t.closePath(),t.fill(),t.restore()}Td();let Ri=null;function My(){Ri||(Ri=new z(new We(2.4,3.2,620,12,1,!0),new Et({color:5750015,transparent:!0,opacity:.13,depthWrite:!1,blending:ri,side:wt,fog:!1})),Ri.renderOrder=5,Se.add(Ri));const n=l.mode==="roam"&&Jt.length>0;if(Ri.visible=n,!n)return;const e=Jt[l.objectiveIndex%Jt.length];Ri.position.set(e.x,e.y+296,e.z),Ri.material.opacity=.1+Math.sin(xl*3.1)*.04}let ms=null;function Ed(){if(l.mode!=="roam"||Jt.length===0){ms=null;return}const n=Jt[l.objectiveIndex%Jt.length];if(!n)return;const e=ms?.x??l.roamPos.x,t=ms?.z??l.roamPos.z,i=ms?.y??l.roamPos.y,s=l.roamPos.x-e,a=l.roamPos.z-t,r=s*s+a*a;if(ms??={x:0,y:0,z:0},ms.x=l.roamPos.x,ms.y=l.roamPos.y,ms.z=l.roamPos.z,r>4e4)return;const o=r>1e-6?xe.clamp(((n.x-e)*s+(n.z-t)*a)/r,0,1):0,c=e+s*o-n.x,h=t+a*o-n.z,d=Math.abs(i+(l.roamPos.y-i)*o-n.y),u=n.radius+1.2;c*c+h*h>u*u||d>10||(n.collected=!0,l.objectiveHits++,l.objectiveIndex=(l.objectiveIndex+1)%Jt.length,l.objectiveIndex===0&&l.objectiveLap++,l.score+=420+Math.round(Math.abs(l.speed)*5),l.boost=Math.min(1,l.boost+.32),l.cameraShake=Math.max(l.cameraShake,.18),l.message=n.label,l.messageTimer=1.05,Bi(`+${420+Math.round(Math.abs(l.speed)*5)} GATE`,!0),En(880,.16),setTimeout(()=>En(1245,.2),90),js(new L(n.x,n.y,n.z),18))}function Jf(n){const e=l.speed;l.collisionCooldown=Math.max(0,l.collisionCooldown-n);const t=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),s=xe.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*gf,a=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&t>.03;if(t>.03){const M=l.speed<0?38:0;l.speed+=((a?70:42)*ws().accel+M)*t*n}i>.03&&(l.speed-=(l.speed>1.2?78:32)*i*n),l.speed-=.00235*l.speed*Math.abs(l.speed)*n,Math.abs(l.speed)>.08?l.speed-=Math.sign(l.speed)*3.6*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=xe.clamp(l.speed,-24,135*ws().top*(l.spikedT>0?.62:1)),l.boosting=a,a?l.boost=Math.max(0,l.boost-n*.22):l.boost=Math.min(1,l.boost+n*.05*ws().boostRegen),l.wheelSteer+=(s-l.wheelSteer)*(1-Math.pow(1e-5,n)),l.spikedT>0&&(l.spikedT-=n);const r=-l.wheelSteer*.55,o=Ad().userData.frontWheels;if(o&&(o[0].rotation.y=r,o[1].rotation.y=r),l.drivingStolen&&st)for(const M of st.mesh.userData.wheels||[])M.rotation.x-=l.speed*n*1.7;const c=Math.abs(l.speed),h=je.has("Space")&&!l.roamAir;if(c>Ah){const M=xe.clamp((c-Ah)/5,0,1),E=1-.36*xe.clamp((c-34)/85,0,1),S=NM*1.08*M*E*(h?1.85:1)*ws().grip*(l.spikedT>0?.55:1)*(1-.26*Ya());l.roamYaw+=l.wheelSteer*S*n*Math.sign(l.speed)}h&&c>8?(l.driftAngle=xe.clamp((l.driftAngle||0)+l.wheelSteer*n*2.5*Math.sign(l.speed),-.62,.62),l.speed-=l.speed*(.12+Math.abs(l.driftAngle)*.45)*n):l.driftAngle=(l.driftAngle||0)*Math.pow(.004,n);const d=l.roamYaw-(l.driftAngle||0),u=Math.sin(d),m=-Math.cos(d),p=(l.speed-e)/Math.max(.001,n),x=xe.clamp(Math.abs(l.wheelSteer)*Math.max(0,c-18)/68+Math.max(0,-p-34)/90+Math.abs(l.driftAngle||0)*1.5,0,1);if(l.roamSlip+=(x-l.roamSlip)*(1-Math.pow(.01,n)),l.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,c/540)+Math.abs(p)*.0018-l.roamSuspension)*(1-Math.pow(.018,n)),l.roamSlip>.38&&Math.random()<n*(3+l.roamSlip*7)){const M=new L(l.roamPos.x-u*3.2,l.roamPos.y+.2,l.roamPos.z-m*3.2);Yf(M,2,l.roamSlip)}const _=Math.abs(l.speed)*n,g=Math.max(1,Math.ceil(_/1.2));let f=!1,y=!1,v=Ys(l.roamPos.x,l.roamPos.z,l.roamPos.y);for(let M=0;M<g;M++)l.roamPos.x+=u*l.speed*n/g,l.roamPos.z+=m*l.speed*n/g,v=Ys(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+zn),Ly(l.roamPos,v)&&(y=!0),ip(l.roamPos,v)&&(f=!0),v=Ys(l.roamPos.x,l.roamPos.z,l.roamPos.y),l.roamAir||(l.roamPos.y=v.y+zn);l.roamPos.x=xe.clamp(l.roamPos.x,-820,820),l.roamPos.z=xe.clamp(l.roamPos.z,-1620,480),f&&(l.collisionCooldown<=0&&($f(new L(l.roamPos.x,l.roamPos.y+.8,l.roamPos.z),e,"IMPACT"),l.collisionCooldown=.38),l.speed*=.28),y&&(l.speed*=.62,l.cameraShake=Math.max(l.cameraShake,.22),l.message="SPLAT!",l.messageTimer=.9,io(.6)),tp(n,e),Ty(n,h,f),Ay(n,f),v=Ys(l.roamPos.x,l.roamPos.z,l.roamPos.y),Ey(n,v),!(v.kind==="ramp"&&v.u>.72&&f0(v))&&(v.kind==="track"&&f0(v)||(Ed(),Qn(),je.has("KeyR")&&(Ml(),je.delete("KeyR"))))}const p0={compact:{accel:.95,top:.9,grip:1,boostRegen:.75},taxi:{accel:.97,top:.92,grip:1,boostRegen:.75},pickup:{accel:.9,top:.88,grip:.94,boostRegen:.7},van:{accel:.84,top:.84,grip:.9,boostRegen:.7},boxTruck:{accel:.7,top:.78,grip:.82,boostRegen:.6},bus:{accel:.62,top:.74,grip:.76,boostRegen:.6}};let st=null;const jf=[];function Ad(){return l.drivingStolen&&st?st.mesh:Gt}function Cd(){if(st){if(st.job){const n=st.mesh;st=null,Z_(n);return}if(st.actor){const n=st.actor.collider,e=st.mesh.position;n.x=e.x,n.z=e.z}jf.push(st),st=null}}function _y(n){Cd(),n.stolen=!0,n.collider.x=1e6,n.collider.z=1e6,Se.attach(n.mesh),n.mesh.userData.stolenYOff=.57;const e=n.axis==="ns"?0:n.dir,t=n.axis==="ns"?n.dir:0;return st={mesh:n.mesh,type:n.type||"compact",actor:n,parked:null,parkedYaw:0},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.mesh.position.x,ce(n.mesh.position.x,n.mesh.position.z)+zn,n.mesh.position.z),l.roamYaw=Math.atan2(e,-t),l.camYaw=l.roamYaw,l.speed=n.speed,hn.visible=!1,l.message=`${(n.type||"car").toUpperCase()} jacked!`,l.messageTimer=1.2,io(1),ci("jack",.5,1,.08)||En(340,.18,"square",.1),Qn(),!0}function yy(n){if(Cd(),n.taken=!0,n.savedM=new bt,Mn.im){const t=new bt().makeScale(1e-4,1e-4,1e-4);Mn.im.getMatrixAt(n.idx,n.savedM),Mn.im.setMatrixAt(n.idx,t),Mn.imW.setMatrixAt(n.idx,t),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0}const e=Qr("compact",[11680564,14205514,15198700,4164178][Math.random()*4|0]);return e.userData.stolenYOff=.57,Se.add(e),st={mesh:e,type:"compact",actor:null,parked:null,parkedYaw:0,spotRef:n},l.vehicle="car",l.drivingStolen=!0,l.roamPos.set(n.x,ce(n.x,n.z)+zn,n.z),l.roamYaw=n.yaw,l.camYaw=n.yaw,l.speed=0,hn.visible=!1,l.message="Borrowed a parked car",l.messageTimer=1.1,io(.7),ci("jack",.45,1.05,.08)||En(300,.16,"square",.09),Qn(),!0}function by(){st.mesh.visible=!0,st.parked=l.roamPos.clone(),st.parkedYaw=l.roamYaw,l.vehicle="foot",l.drivingStolen=!1,l.speed=0,l.driftAngle=0;const n=Math.cos(l.roamYaw),e=Math.sin(l.roamYaw);return l.roamPos.x-=n*3.4,l.roamPos.z-=e*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,hn.visible=!0,!0}function m0(){return!st?.parked||l.roamPos.distanceTo(st.parked)>7?!1:(l.vehicle="car",l.drivingStolen=!0,l.roamPos.copy(st.parked),l.roamYaw=st.parkedYaw,l.camYaw=l.roamYaw,l.speed=0,st.parked=null,hn.visible=!1,Qn(),!0)}function Qf(){for(const n of An){const e=n.actor;if(!(!e||!e.type||e.stolen||Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)>6))return _y(e)}for(const n of Mn.spots)if(!n.taken&&Math.hypot(l.roamPos.x-n.x,l.roamPos.z-n.z)<5.5)return yy(n);return!1}function x0(n){if(n.actor)n.actor.stolen=!1;else{Ps(n.mesh);const e=n.spotRef;e?.savedM&&Mn.im&&(Mn.im.setMatrixAt(e.idx,e.savedM),Mn.imW.setMatrixAt(e.idx,e.savedM),Mn.im.instanceMatrix.needsUpdate=!0,Mn.imW.instanceMatrix.needsUpdate=!0,e.taken=!1)}}function zl(){st&&(x0(st),st=null),jf.splice(0).forEach(x0),l.drivingStolen=!1}function Uh(n=!1){if(l.vehicle!=="car"||!n&&Math.abs(l.speed)>12)return!1;if(l.drivingStolen&&st)return l.roamAir=!1,l.roamVy=0,by(),l.message="On foot — your car is marked on the map",l.messageTimer=1.6,!0;Hi.copy(l.roamPos),Lh=l.roamYaw,Gt.visible=!0,l.vehicle="foot",l.speed=0,l.driftAngle=0,l.roamAir=!1,l.roamVy=0;const e=Math.cos(l.roamYaw),t=Math.sin(l.roamYaw);return l.roamPos.x-=e*3.4,l.roamPos.z-=t*3.4,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,hn.visible=!0,l.message="On foot — E enters your car, the heli, or steals a ride",l.messageTimer=1.6,!0}function zh(){return l.vehicle!=="foot"||l.roamPos.distanceTo(Hi)>7?!1:(l.vehicle="car",l.roamPos.copy(Hi),l.roamYaw=Lh,l.camYaw=Lh,l.speed=0,hn.visible=!1,Qn(),!0)}function ep(){return l.vehicle!=="foot"||!de||l.roamPos.distanceTo(de.pos)>10.5?!1:(l.vehicle="heli",l.roamPos.copy(de.pos),l.roamYaw=de.yaw,l.camYaw=de.yaw,l.speed=0,de.vel.set(0,0,0),hn.visible=!1,l.message="Arrows fly · Space up · Shift down · E lands",l.messageTimer=2.2,!0)}function Nh(){if(l.vehicle!=="heli"||!de)return!1;const n=ce(de.pos.x,de.pos.z);return de.pos.y-n>5.2||de.vel.length()>9?(l.message="Land first — get low and slow",l.messageTimer=1.1,!1):(l.vehicle="foot",de.mesh.visible=!0,l.roamPos.x=de.pos.x+Math.cos(de.yaw)*-5.6,l.roamPos.z=de.pos.z+Math.sin(de.yaw)*-5.6,l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,l.speed=0,hn.visible=!0,!0)}function Rd(){l.mode==="roam"&&(l.vehicle==="car"?Uh()||(l.message="Slow down to step out",l.messageTimer=.9):l.vehicle==="foot"?(l.roamPos.distanceTo(Hi)<=(st?.parked?l.roamPos.distanceTo(st.parked):1/0)?zh()||m0():m0()||zh())||ep()||Y_()||Qf():Nh())}function wy(n){const e=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle),t=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),i=xe.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Ee.steer,-1,1),s=je.has("ShiftLeft")||je.has("ShiftRight"),a=l.speed,r=(e-t)*(s?14.5:6.4);l.speed+=(r-l.speed)*Math.min(1,n*7),l.roamYaw+=i*2.3*n;const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);l.roamPos.x+=o*l.speed*n,l.roamPos.z+=c*l.speed*n,ip(l.roamPos,{kind:"ground"}),l.roamPos.x=xe.clamp(l.roamPos.x,-820,820),l.roamPos.z=xe.clamp(l.roamPos.z,-1620,480),l.roamPos.y=ce(l.roamPos.x,l.roamPos.z)+.05,tp(n,a),Ed(),hn.position.copy(l.roamPos),hn.rotation.y=Math.atan2(-o,-c),l.walkPhase=(l.walkPhase||0)+n*(2+Math.abs(l.speed)*.85);const h=Math.sin(l.walkPhase)*xe.clamp(Math.abs(l.speed)/5,0,1);for(const m of hn.userData.limbs||[])m.mesh.rotation.x=h*m.amp*m.side*2.2,m.mesh.position.y=m.baseY+Math.abs(h)*.03;const d=l.roamPos.distanceTo(Hi)<7,u=de&&l.roamPos.distanceTo(de.pos)<9;l.messageTimer<=0&&(d?(l.message="E — enter car",l.messageTimer=.2):u&&(l.message="E — enter helicopter",l.messageTimer=.2))}function Sy(n){if(!de)return;const e=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle)-Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),t=xe.clamp((je.has("KeyA")||je.has("ArrowLeft")?1:0)-(je.has("KeyD")||je.has("ArrowRight")?1:0)-Ee.steer,-1,1),i=de.rpm>.55,s=je.has("ShiftLeft")||je.has("ShiftRight"),a=ja?s?1:de.pos.y-ce(de.pos.x,de.pos.z)>6?-.45:0:je.has("Space")?1:s?-1:0;de.yaw-=t*1.5*n*(i?1:.2);const r=Math.sin(de.yaw),o=-Math.cos(de.yaw);i&&(de.vel.x+=r*e*30*n,de.vel.z+=o*e*30*n,de.vel.y+=a*24*n,a===0&&(de.vel.y-=de.vel.y*1.6*n)),de.vel.x-=de.vel.x*.85*n,de.vel.z-=de.vel.z*.85*n,de.vel.y-=de.vel.y*1.1*n,de.pos.addScaledVector(de.vel,n);const c=ce(de.pos.x,de.pos.z);de.pos.x=xe.clamp(de.pos.x,-1500,1500),de.pos.z=xe.clamp(de.pos.z,-1900,700),de.pos.y=Math.min(de.pos.y,300),de.pos.y<c+1.1&&(de.pos.y=c+1.1,de.vel.y=Math.max(0,de.vel.y)),(Cr(de.pos,un)||Cr(de.pos,vi))&&(de.vel.multiplyScalar(.25),l.cameraShake=Math.max(l.cameraShake,.2)),l.roamPos.x=de.pos.x,l.roamPos.y=de.pos.y,l.roamPos.z=de.pos.z,l.roamYaw=de.yaw,l.speed=Math.hypot(de.vel.x,de.vel.z),de.mesh.position.copy(de.pos),de.mesh.quaternion.setFromAxisAngle(sn,-de.yaw),de.mesh.rotateX(xe.clamp((de.vel.x*r+de.vel.z*o)*.008,-.24,.24)),de.mesh.rotateZ(xe.clamp(t*.14,-.2,.2)),Ed()}function Ty(n,e,t){const i=e&&Math.abs(l.driftAngle||0)>.16&&Math.abs(l.speed)>24;if(l.driftComboT>0&&(l.driftComboT-=n,l.driftComboT<=0)&&(l.driftCombo=0),t&&(l.driftCombo||l.driftComboT>0)&&(l.driftCombo=0,l.driftComboT=0),i&&!t)l.driftT=(l.driftT||0)+n,l.driftAcc=(l.driftAcc||0)+n*Math.abs(l.speed)*(.7+Math.abs(l.driftAngle));else if(l.driftT){if(!t&&l.driftT>.55){const s=Math.min(5,(l.driftCombo||0)+1),a=Math.round(l.driftAcc*s);l.score+=a,Bi(s>1?`+${a} DRIFT ×${s}`:`+${a} DRIFT`),En(600+s*90,.16,"square",.1),l.driftCombo=s,l.driftComboT=4}l.driftT=0,l.driftAcc=0}}function Ey(n,e){const t=e.y+zn,i=l.roamPrevY??t;if(e.kind==="stunt"&&Math.abs(l.speed)>30&&(l.stuntPrime=.3,l.stuntRamp=Df),l.stuntPrime>0&&(l.stuntPrime-=n),!l.roamAir){const s=(t-i)/Math.max(1e-4,n);Math.abs(l.speed)>26&&s<(l.roamVy||0)-40*n-3.4?(l.roamAir=!0,l.roamAirT=0,l.stuntPrime>0&&(l.stuntActive=!0,l.stuntPrime=0,l.flipT=0,l.airRoll=0,l.stuntBullseye=!1,l.sloMoT=l.stuntRamp?.type==="flip"?1.4:1.15,l.message=l.stuntRamp?.type==="flip"?"BACKFLIP!":"STUNT!",l.messageTimer=1,ci("whoosh",.38,1.2,.08))):(l.roamVy=xe.clamp(s,-70,70),l.roamPos.y=t)}if(l.roamAir){if(l.roamVy-=34*n,l.roamAirT+=n,l.roamPos.y=l.roamPos.y+l.roamVy*n,l.stuntActive){l.stuntRamp?.type==="flip"&&(l.flipT=Math.min(1,(l.flipT||0)+n/1.05));const s=(je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0);l.airRoll=(l.airRoll||0)+s*n*4.4;const a=l.stuntRamp?.hoop;a&&!l.stuntBullseye&&Math.hypot(l.roamPos.x-a.x,l.roamPos.y-a.y,l.roamPos.z-a.z)<a.r-.4&&(l.stuntBullseye=!0,l.message="BULLSEYE!",l.messageTimer=1,En(1240,.2,"square",.14))}if(l.roamPos.y<=t){l.roamPos.y=t,l.roamAir=!1;const s=-l.roamVy;if(l.roamVy=0,s>9&&(l.cameraShake=Math.max(l.cameraShake,Math.min(.5,s/40)),ci("land",Math.min(.62,s/42),1,.1)||Oa(Math.min(24,s*.85)),l.roamSuspension+=.16),l.stuntActive){const a=Math.floor(Math.abs(l.airRoll||0)/(Math.PI*2)),r=l.stuntRamp?.type==="flip"&&(l.flipT||0)>=.96;let o=160+l.roamAirT*240+Math.abs(l.speed)*1.4+a*140;r&&(o*=1.6),l.stuntBullseye&&(o*=2),o=Math.round(o);const c=[r&&"BACKFLIP",a>0&&`ROLL ×${a}`,l.stuntBullseye&&"BULLSEYE ×2"].filter(Boolean).join(" · ");l.score+=o,Me.stunts=(Me.stunts||0)+1,Bi(`STUNT +${o}`),c&&(l.message=c,l.messageTimer=1.4),En(880,.2,"square",.12),l.stuntActive=!1,l.flipT=0,l.airRoll=0}else if(l.roamAirT>.45){const a=Math.round(40+l.roamAirT*70);l.score+=a,Bi(`+${a} AIR`),En(760,.14)}}}l.roamPrevY=l.roamPos.y}const In=2.6;function tp(n,e){const t=l.waterDepth||0;if(l.roamPos.y>ce(l.roamPos.x,l.roamPos.z)+2.5){l.waterDepth=0;return}const i=Js(l.roamPos.x,l.roamPos.z);l.waterDepth=i.depth,!(i.depth<=.02)&&(l.speed-=l.speed*(.85+5.2*i.depth)*i.depth*n,t<=.02&&Math.abs(e)>16&&(Q_(l.roamPos.clone(),Math.abs(e)),oy(Math.abs(e)/60),l.cameraShake=Math.max(l.cameraShake,.16),l.message="SPLASH",l.messageTimer=.7),l.wakeT=(l.wakeT??0)-n,Math.abs(l.speed)>5&&l.wakeT<=0&&(l.wakeT=.15,Vf(l.roamPos.x-Math.sin(l.roamYaw)*1.5,l.roamPos.z+Math.cos(l.roamYaw)*1.5,.8+Math.abs(l.speed)*.012)))}function Ay(n,e){for(const t of An)t.actor&&t.actor.nearMissT>0&&(t.actor.nearMissT-=n);if(!(e||Math.abs(l.speed)<32||l.collisionCooldown>0))for(const t of An){const i=t.actor;if(!i||(i.nearMissT||0)>0)continue;const s=l.roamPos.x-t.x,a=l.roamPos.z-t.z,r=(t.hw+t.hd)*.5+In+2.4;if(s*s+a*a<r*r&&Math.abs(l.roamPos.y-(t.maxY??l.roamPos.y))<7){i.nearMissT=1.8,l.score+=45,l.nearMisses+=1,Bi("+45 NEAR MISS"),En(520,.12,"square",.07);break}}}function Cr(n,e){let t=!1;for(let i=0;i<e.length;i++){const s=e[i];if(s.maxY!=null&&n.y>s.maxY+zn+.45)continue;if(s.radius){const u=s.radius+In,m=n.x-s.x,p=n.z-s.z,x=m*m+p*p;if(x>=u*u)continue;t=!0;const _=Math.max(1e-4,Math.sqrt(x));n.x=s.x+m/_*u,n.z=s.z+p/_*u;continue}const a=s.hw+In,r=s.hd+In,o=n.x-s.x,c=n.z-s.z;if(Math.abs(o)>=a||Math.abs(c)>=r)continue;t=!0;const h=a-Math.abs(o),d=r-Math.abs(c);h<d?n.x=s.x+(o<0?-a:a):n.z=s.z+(c<0?-r:r)}return t}function np(n,e=l.roamPos){if(!n)return;const t=(n.crashTimer||0)<=.05;n.crashTimer=Math.max(n.crashTimer||0,1.15+Math.random()*.45),n.waitTimer=Math.max(n.waitTimer||0,.55),n.brakePulse=1;const i=n.maxAvoidOffset||Be.streetW*.3,s=n.mesh?.position?.x??n.collider?.x??n.road,a=n.mesh?.position?.z??n.collider?.z??n.along,r=n.axis==="ns"?e.x-s>=0?-1:1:e.z-a>=0?-1:1;n.avoidOffset=xe.clamp((n.avoidOffset||0)+r*i*.9,-i,i),t&&(Me.trafficCrashes++,n.along-=n.dir*1.8,n.mesh&&(n.mesh.rotation.y+=r*.08),l.mode==="roam"&&(l.cameraShake=Math.max(l.cameraShake,.32),l.message="TRAFFIC CRASH",l.messageTimer=.85))}function Cy(n){let e=!1;for(let t=0;t<An.length;t++){const i=An[t];if(i.maxY!=null&&n.y>i.maxY+zn+.45)continue;const s=i.hw+In,a=i.hd+In,r=n.x-i.x,o=n.z-i.z;if(Math.abs(r)>=s||Math.abs(o)>=a)continue;e=!0,np(i.actor,n);const c=s-Math.abs(r),h=a-Math.abs(o);c<h?n.x=i.x+(r<0?-s:s):n.z=i.z+(o<0?-a:a)}return e}function Ry(n,e,t=0){return e.maxY!=null&&n.y>e.maxY+zn+.45?!1:e.radius?Math.hypot(n.x-e.x,n.z-e.z)<e.radius+t:Math.abs(n.x-e.x)<e.hw+t&&Math.abs(n.z-e.z)<e.hd+t}function Py(n){n.active=!1,n.respawn=4.5+Math.random()*1.5,n.mesh.visible=!1,Me.splats++,ry();const e=Na.find(t=>!t.visible)||Na[Me.splats%Math.max(1,Na.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(n.x,ce(n.x,n.z)+.08,n.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function Ly(n,e=null){if(e?.kind!=="ground"||Math.abs(l.speed)<5)return!1;let t=!1;for(const i of Es){if(!i.active)continue;const s=n.x-i.x,a=n.z-i.z,r=In+i.hitRadius;s*s+a*a>r*r||Math.abs(n.y-(ce(i.x,i.z)+zn))>3.2||(Py(i),t=!0)}return t}function ip(n,e=null){let t=!1;for(let i=0;i<2;i++){const s=Cr(n,un),a=e?.kind==="ground"?Cr(n,si):!1,r=Cr(n,vi),o=e?.kind==="ground"?Cy(n):!1;if(!s&&!a&&!r&&!o)break;t=!0}return t}function sp(n){const e=Ee.lookX*1.18,t=Ee.lookY*.58;l.camLookYaw+=(e-l.camLookYaw)*(1-Math.pow(.002,n)),l.camLookPitch+=(t-l.camLookPitch)*(1-Math.pow(.002,n)),l.cameraZoom+=(Ee.zoom-l.cameraZoom)*(1-Math.pow(.018,n))}function Pd(n,e,t=3.2){let i=0;for(let s=1;s<=10;s++){const a=s/10,r=xe.lerp(n.x,e.x,a),o=xe.lerp(n.z,e.z,a),c=xe.lerp(n.y,e.y,a),h=ce(r,o)+t;h>c&&(i=Math.max(i,(h-c)/Math.max(.08,a)))}return i}function Dy(n,e){const t=ce(n,e);let i=null;const s=Zf(n,e);s&&s.y>t+4&&(i=s);const a=Kf(n,e,1e3,!0);return a&&a.y>t+4&&(!i||a.y>i.y)&&(i=a),i}function _l(n,e,t=4){let i=0;for(let s=2;s<=14;s++){const a=s/14,r=xe.lerp(n.x,e.x,a),o=xe.lerp(n.z,e.z,a),c=xe.lerp(n.y,e.y,a),h=Dy(r,o);if(!h||n.y<h.y-10)continue;const d=h.y+t-c;d>0&&(i=Math.max(i,d/Math.max(.16,a)))}return Math.min(54,i)}function kh(){const n=l.camYaw+l.camLookYaw,e=Math.sin(n),t=-Math.cos(n),i=xe.clamp(l.cameraZoom,-.42,.9),s=l.roamPos,a={x:s.x+e*(12-Math.min(i,0)*6),y:s.y+2.6+l.camLookPitch*13.5,z:s.z+t*(12-Math.min(i,0)*6)};ye.position.y+=Pd(a,ye.position,3.4),ye.position.y+=_l(a,ye.position,4.2)}let Ia=localStorage.getItem("steel-ribbon-roam-view")==="hood"?"hood":"chase";function Iy(){Ia=Ia==="chase"?"hood":"chase",localStorage.setItem("steel-ribbon-roam-view",Ia),l.message=Ia==="hood"?"First person":"Third person",l.messageTimer=.9}function ap(){return l.vehicle==="heli"&&de?de.mesh:Ad()}function Fy(n){const e=ap(),t=l.roamYaw+l.camLookYaw*.8,i=Math.sin(t),s=-Math.cos(t),a=l.vehicle==="heli",r=a?2.6:1.42,o=a?1.2:.85;if(e.visible=!1,ye.position.set(l.roamPos.x+i*o,l.roamPos.y+r-l.roamSuspension*.4,l.roamPos.z+s*o),l.cameraShake>.01){const h=l.cameraShake*.5;ye.position.x+=(Math.random()-.5)*h,ye.position.y+=(Math.random()-.5)*h*.6}on.position.copy(ye.position),on.lookAt(l.roamPos.x+i*30,l.roamPos.y+r+l.camLookPitch*16+(l.roamAir?l.roamVy*.06:0),l.roamPos.z+s*30),on.rotateY(Math.PI),on.rotateZ((l.roamAir&&l.stuntActive&&l.airRoll||0)-l.wheelSteer*.05),ye.quaternion.slerp(on.quaternion,1-Math.pow(.001,n));const c=76+Math.min(14,Math.abs(l.speed)*.08);Math.abs(ye.fov-c)>.02&&(ye.fov+=(c-ye.fov)*(1-Math.pow(.01,n)),ye.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function rp(n){if(window.__freeCam)return;if(sp(n),Math.abs(l.speed)>Ah){let _=l.roamYaw-l.camYaw;_=Math.atan2(Math.sin(_),Math.cos(_)),l.camYaw+=_*(1-Math.pow(.08,n))}if(Ia==="hood"&&l.vehicle!=="foot"){Fy(n);return}const e=ap();e.visible||(e.visible=!0);const t=l.camYaw+l.camLookYaw,i=Math.sin(t),s=-Math.cos(t),a=l.roamPos,r=xe.clamp(l.cameraZoom,-.42,.9),o=xe.clamp(Math.abs(l.speed)/135,0,1),c=l.vehicle==="foot"?{d:.42,h:.5}:l.vehicle==="heli"?{d:1.55,h:1.4}:{d:1,h:1},h=(17+Math.abs(l.speed)*.11+l.roamSlip*3)*(1+r*.72)*c.d,d=(7.2+o*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+l.camLookPitch*5.8)*c.h,u=gd.set(a.x-i*h,a.y+d,a.z-s*h);if(l.cameraShake>.01||l.collisionDrama>.01){const _=l.cameraShake+l.collisionDrama*.42;u.x+=(Math.random()-.5)*_*1.2,u.y+=(Math.random()-.5)*_*.75,u.z+=(Math.random()-.5)*_*1.2}const m=Il.set(a.x+i*(13+o*8-Math.min(r,0)*6),a.y+2.45+l.camLookPitch*13.5,a.z+s*(13+o*8-Math.min(r,0)*6));u.y=Math.max(u.y,ce(u.x,u.z)+3.5),u.y+=Pd(m,u,3.4),u.y+=_l(m,u,4.2);const p=l.roamSlip>.35?.006:.0026;ye.position.lerp(u,1-Math.pow(p,n)),ye.position.y+=_l(m,ye.position,3.8)*.72,on.position.copy(ye.position),on.lookAt(m),on.rotateY(Math.PI),on.rotateZ(-l.wheelSteer*o*.18+l.roamSlip*Math.sign(l.wheelSteer||1)*.05),ye.quaternion.slerp(on.quaternion,1-Math.pow(.05,n));const x=69+Math.min(13,Math.abs(l.speed)*.075)+l.roamSlip*2.5+r*10;Math.abs(ye.fov-x)>.02&&(ye.fov+=(x-ye.fov)*(1-Math.pow(.01,n)),ye.updateProjectionMatrix()),l.cameraShake=Math.max(0,l.cameraShake-n*2.4),l.collisionDrama=Math.max(0,l.collisionDrama-n*1.8)}function Uy(n,e=null){if(l.mode==="result")return;l.mode="result";const t=Math.max(0,Math.round(l.score-l.damage*9+Math.max(0,220-l.time)*45));t>l.best&&(l.best=t,localStorage.setItem("steel-ribbon-best",String(t))),qe.best.textContent=`Best score ${l.best}`,qe.resultText.textContent=`${n} Score ${t}. Time ${yl(l.time)}. Damage ${Math.round(l.damage)}%.`;const i=Number.isFinite(l.bestLap)?yl(l.bestLap):"--:--.-";let s="";if(l.seasonRace&&Xt?.active&&e){[{key:"you",metric:l.totalDistance+.001},...qn.map(c=>({key:c.key,metric:c.distance}))].sort((c,h)=>h.metric-c.metric).forEach((c,h)=>Xt.points[c.key]+=P_[h]??0),Xt.raceIndex++;const r=Xt.raceIndex>=4,o=Lf();if(r){Xt.active=!1;const c=o[0].key==="you";c&&Xt.division>1?(localStorage.setItem("steel-ribbon-division",String(Xt.division-1)),s+=`<b>🏆 CHAMPION — promoted to Division ${Pf(Xt.division-1)}!</b>`):s+=c?"<b>🏆 Season champion!</b>":`<b>Season over — ${o[0].label} takes the title.</b>`}Rf(),s=`<span>Season — after race ${Xt.raceIndex}/4</span>`+o.map((c,h)=>`<b>${h+1}. ${c.label} — ${c.pts} pts</b>`).join("")+s,qe.againBtn.textContent=Xt.active?"Next Race":"Back to Menu"}else qe.againBtn.textContent="Race Again";qe.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${i}</b>
    <b>Clean landings: ${l.cleanLandings}</b>
    <b>Hard landings: ${l.hardLandings}</b>
    <b>Recoveries: ${l.recoveries}</b>
    <b>Near edges: ${Math.round(l.nearMisses)}</b>
    ${s}
  `,kl(),Number.isFinite(l.bestLap)&&l.bestLap>3&&bp("lap",Math.round(1e6/l.bestLap),{time:+l.bestLap.toFixed(2),course:se.name,car:Rs[Gi]?.label||""}),qe.result.classList.remove("hidden")}function Pc(n="Craned back to the ribbon"){const e=mt(l.lastSafeS);l.s=l.lastSafeS,l.totalDistance=l.lastSafeDistance,l.lateral=0,l.lateralVel=0,l.y=e.p.y+2.1,l.yVel=0,l.speed=Math.max(16,l.speed*.32),l.grounded=!0,l.cameraShake=1.2,l.message=n,l.messageTimer=1.4,l.recoveries+=1}function Ld(n,e){return xe.clamp(e*n.tangent.y,-48,48)}function zy(n=94){return se.gaps.map(e=>{const t=mt(e.start),i=mt(e.end+3),s=(e.end-e.start)/Math.max(1,n),a=Ld(t,n),r=t.p.y+2.1+a*s-.5*31*s*s,o=i.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(xe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(a*10)/10,projectedClearance:Math.round((r-o)*10)/10}})}function g0(n,e){l.grounded=!1,l.yVel=Ld(n,l.speed),l.airtime=0,e&&(l.message=e)}window.__steelRibbonDebug={launchVelocityAt(n,e){return Ld(mt(n),e)},gapJumpReport(n){return zy(n)},sceneryClearanceReport(){return jM()},setSpeed(n){return l.speed=xe.clamp(n,-14,156-l.damage*.42),Rr(),l.speed},setTrackPosition(n,e=l.speed,t=0){const i=mt(n);return l.totalDistance=n,l.s=i.s,l.lastSafeS=i.s,l.lastSafeDistance=n,l.lateral=xe.clamp(t,-se.width*.48,se.width*.48),l.lateralVel=0,l.y=i.p.y+2.1,l.yVel=0,l.grounded=!0,l.speed=xe.clamp(e,-14,156-l.damage*.42),Rr(),{s:l.s,totalDistance:l.totalDistance,speed:l.speed,lateral:l.lateral,y:l.y}},setDamage(n){return l.damage=xe.clamp(n,0,99),Rr(),l.damage},setCourse(n){return no(n)},flyCam(n,e,t,i,s,a){return window.__freeCam=!0,ye.position.set(n,e,t),ye.lookAt(i,s,a),ye.fov=62,ye.updateProjectionMatrix(),"freecam"},listBoostPads(){return ka.map(n=>({s:n.s,lat:+n.lat.toFixed(2)}))},listPonds(){return ia.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),rx:+n.rx.toFixed(1),rz:+n.rz.toFixed(1),waterY:n.waterY==null?null:+n.waterY.toFixed(2)}))},waterAt(n,e){return{depth:+Js(n,e).depth.toFixed(3),ground:+ce(n,e).toFixed(2)}},activeGate(){const n=Jt[l.objectiveIndex%Jt.length];return n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null},seasonInfo(){return{season:Xt,division:to(),position:Dd(),seasonRace:!!l.seasonRace,rivals:qn.map(n=>({key:n.key,d:+n.distance.toFixed(1),finished:+n.finished.toFixed(1)}))}},resetSeason(){return localStorage.removeItem("steel-ribbon-season"),localStorage.removeItem("steel-ribbon-division"),Xt=null,kl(),"reset"},renderInfo(){return{calls:Me.renderCalls||0,triangles:Me.renderTris||0,geometries:rn.info.memory.geometries,textures:rn.info.memory.textures,mobilePerf:ja,staticMerge:Me.staticMerge||null}},drawAudit(n=20){const e=new Map;return Se.traverse(t=>{if(!t.visible||!t.isMesh&&!t.isSprite&&!t.isLine&&!t.isPoints)return;const i=t.geometry?.parameters,s=i?Object.values(i).filter(r=>typeof r=="number").map(r=>+r.toFixed(2)).join("x"):`verts${t.geometry?.attributes?.position?.count??"?"}`,a=`${t.geometry?.type||t.type}(${s})${t.isInstancedMesh?`[inst ${t.count}]`:""}`;e.set(a,(e.get(a)||0)+1)}),[...e.entries()].sort((t,i)=>i[1]-t[1]).slice(0,n)},trafficInfo(){const n=An[0]?.actor?.mesh;return{colliders:An.length,wheels:n?.userData?.wheels?.length??0,pedestrians:Me.pedestrians||0}},nearestTrafficCar(n,e){let t=null;for(const i of An){const s=i.actor;if(!s||!s.type||s.stolen)continue;const a=Math.hypot(n-i.x,e-i.z);(!t||a<t.d)&&(t={x:+i.x.toFixed(1),z:+i.z.toFixed(1),type:s.type,d:+a.toFixed(1)})}return t},audioInfo(){return Ae?{state:Ae.ctx.state,master:+Ae.master.gain.value.toFixed(2),engine:!!Ae.rumble&&!!Ae.growl&&!!Ae.whine,fx:!!Ae.wind&&!!Ae.skid&&!!Ae.boost,music:!!Ae.musicGain,beat:Ae.beat,samples:Object.keys(Kn.buffers).length,sampleLoops:Object.keys(Kn.loops),musicSample:!!Kn.buffers.music,musicOn:localStorage.getItem("steel-ribbon-music")!=="0",engineProfile:Xf(),engineV2:!!Ae.growlB&&!!Ae.burble}:null},colliderAudit(){const n=[],e=[],t=Be.streetW*.5;for(let a=Be.x0;a<=Be.x1+1;a+=Be.pitch)n.push(Math.round(a));for(let a=Be.zNear;a>=Be.zFar-1;a-=Be.pitch)e.push(Math.round(a));const i=[],s=(a,r,o)=>{const c=o.radius!=null?o.radius:o.hw??0,h=o.radius!=null?o.radius:o.hd??0,d=ce(o.x,o.z);if(!(o.maxY!=null&&o.maxY<d+1.05)){for(const u of n)Math.abs(o.x-u)<t+c+In&&o.z<Be.zNear+h&&o.z>Be.zFar-h&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`x=${u}`,overlap:+(t+c+In-Math.abs(o.x-u)).toFixed(1)});for(const u of e)Math.abs(o.z-u)<t+h+In&&o.x<Be.x1+c&&o.x>Be.x0-c&&i.push({arr:a,idx:r,kind:o.kind??"box",x:+o.x.toFixed(1),z:+o.z.toFixed(1),r:+Math.max(c,h).toFixed(1),road:`z=${u}`,overlap:+(t+h+In-Math.abs(o.z-u)).toFixed(1)})}};return un.forEach((a,r)=>s("Mn",r,a)),vi.forEach((a,r)=>s("Di",r,a)),si.forEach((a,r)=>s("$n",r,a)),{total:un.length+vi.length+si.length,blockers:i}},setVehicle(n){return l.mode!=="roam"&&Ml(),n==="foot"?l.vehicle==="car"?Uh(!0):l.vehicle==="heli"&&Nh():n==="heli"&&de?(l.vehicle==="car"&&Uh(!0),l.roamPos.set(de.pos.x+3,ce(de.pos.x+3,de.pos.z),de.pos.z),ep()):n==="car"&&(l.vehicle==="heli"&&(de.pos.y=ce(de.pos.x,de.pos.z)+1.1,de.vel.set(0,0,0),Nh()),l.vehicle==="foot"&&(l.roamPos.copy(Hi),zh())),l.vehicle},vehicleInfo(){return{vehicle:l.vehicle||"car",walkerVisible:hn.visible,heli:de?{x:+de.pos.x.toFixed(1),y:+de.pos.y.toFixed(1),z:+de.pos.z.toFixed(1),rpm:+de.rpm.toFixed(2),scale:+de.mesh.scale.x.toFixed(2),pad:de.pad?{x:+de.pad.x.toFixed(1),z:+de.pad.z.toFixed(1)}:null}:null,parkedCar:{x:+Hi.x.toFixed(1),z:+Hi.z.toFixed(1)},drivingStolen:!!l.drivingStolen,stolen:st?{type:st.type,fromTraffic:!!st.actor,pos:{x:+st.mesh.position.x.toFixed(1),y:+st.mesh.position.y.toFixed(2),z:+st.mesh.position.z.toFixed(1)},visible:st.mesh.visible,inScene:st.mesh.parent===Se,parked:st.parked?{x:+st.parked.x.toFixed(1),z:+st.parked.z.toFixed(1)}:null}:null,parkedSpots:Mn.spots.length}},stealNearest(){return l.mode==="roam"&&l.vehicle==="foot"?Qf():!1},setHeat(n){return l.mode==="roam"&&(l.heat=xe.clamp(n,0,5)),l.heat||0},policeInfo(){return{heat:+(l.heat||0).toFixed(2),cars:lt.cars.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),speed:+n.speed.toFixed(1)})),nearest:lt.nearest===1/0?null:+lt.nearest.toFixed(1),evadeT:+lt.evadeT.toFixed(1),bustT:+lt.bustT.toFixed(2),blocks:lt.blocks.map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),age:+n.age.toFixed(1)})),busts:Me.busts||0}},policeTeleportNearest(n,e){const t=lt.cars[0];return t?(t.x=n,t.z=e,!0):!1},jobInfo(){return{state:Ke.state,type:Ke.type,timeLeft:+Ke.timeLeft.toFixed(1),pickup:Ke.pickup?{x:+Ke.pickup.x.toFixed(1),z:+Ke.pickup.z.toFixed(1)}:null,dest:Ke.dest?{x:+Ke.dest.x.toFixed(1),z:+Ke.dest.z.toFixed(1)}:null,deliveries:Me.deliveries||0,fails:Me.deliveryFails||0}},jobSpawnNow(){return Ke.state==="idle"&&(Ke.cooldown=0,Bf()),Ke.state},setWeather(n){return(n==="rain"||n==="clear")&&n!==li&&(Ud(),localStorage.setItem("steel-ribbon-weather",li)),li},weatherInfo(){return{mode:li,amt:+Ya().toFixed(2),roadRoughness:+(mn.roadMat?.roughness??-1).toFixed(2)}},panickedTraffic(){let n=0;for(const e of An)e.actor?.panicT>0&&n++;return n},mpInfo(){return{connected:gt.connected,room:gt.room,id:gt.id,peers:[...gt.peers.values()].map(n=>({name:n.name,has:n.has,x:+(n.tx||0).toFixed(1),z:+(n.tz||0).toFixed(1)}))}},mpJoin(n,e){const t=document.querySelector("#mpRoom"),i=document.querySelector("#mpName");return t&&(t.value=n),i&&(i.value=e),Ep(),gt.room},mpLeave(){return Tl(!0),!gt.connected},boardsInfo(){return yp(Kr).then(n=>({mode:Kr,rows:n?n.length:null,ok:n!==null}))},gamepadInfo(){return{active:Vn.active}},setTod(n){return Lr.includes(n)&&(Wn=n,localStorage.setItem("steel-ribbon-tod",n),zd()),Wn},todInfo(){return{mode:Wn,day:+il.toFixed(3),night:+sl.toFixed(3)}},listStuntRamps(){return(Li||[]).map(n=>({x:+n.x.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),len:n.len,h:n.h,type:n.type,hoop:n.hoop?{x:+n.hoop.x.toFixed(1),y:+n.hoop.y.toFixed(1),z:+n.hoop.z.toFixed(1),r:n.hoop.r}:null}))},nearestParkedSpot(n,e){let t=null;for(const i of Mn.spots){if(i.taken)continue;const s=Math.hypot(n-i.x,e-i.z);(!t||s<t.d)&&(t={x:i.x,z:i.z,d:+s.toFixed(1)})}return t},setRoamPos(n,e,t=0,i=0){return l.mode!=="roam"&&Ml(),l.roamPos.set(n,ce(n,e)+zn,e),l.roamYaw=t,l.camYaw=t,l.speed=i,Qn(),{x:l.roamPos.x,y:+l.roamPos.y.toFixed(2),z:l.roamPos.z}},sceneryCounters(){return{...bs,boostPads:ka.length,gapBeacons:Gr.length,railRuns:Me.railRuns||0,railPosts:Me.railPosts||0,ponds:ia.length,cityPonds:Me.ponds||0,cloudSprites:Me.cloudSprites||0,helipad:Me.helipad||null,stuntRamps:Me.stuntRamps||0,propPlanes:Me.propPlanes||0}},stats(){return{trafficCrashes:Me.trafficCrashes,splats:Me.splats,roamPos:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1)},speed:+l.speed.toFixed(2),cooldown:+l.collisionCooldown.toFixed(2)}},detailReport(){return{plates:Ii.mesh?{atlasSlots:64,traffic:Ii.dynamics.length,parked:Ii.statics.length,uniqueTexts:new Set(Ii.texts).size,sample:Ii.texts.slice(0,5)}:null,drivers:{cars:Pa.length,withDriver:Pa.reduce((n,e)=>n+(e.mesh?.userData?.hasDriver?1:0),0)},taxis:{count:Pa.reduce((n,e)=>n+(e.type==="taxi"?1:0),0),signed:Ph.count()},storefronts:{spots:qs.spots.length,dressed:qs.dressedCount(),pool:qs.pool,sample:qs.spots.slice(0,2).map(n=>({x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),yaw:+n.yaw.toFixed(2),w:+n.w.toFixed(1)}))},furniture:{...Ci.counts,sample:Ci.sample.slice(0,4)},streetSigns:{poles:ii.poles,blades:ii.blades,sample:ii.sample.slice(0,3)},peds:{pool:La.pool,promoted:La.promotedCount(),texting:(La.kits||[]).reduce((n,e)=>n+(e.ped&&e.texting?1:0),0),radius:Rh,sample:(La.kits||[]).filter(n=>n.ped).slice(0,3).map(n=>{const e={x:+n.ped.x.toFixed(1),y:+n.ped.mesh.position.y.toFixed(2),z:+n.ped.z.toFixed(1),axis:n.ped.axis,dir:n.ped.dir,t:n.texting?1:0};if(n.texting){const t=n.phone.getWorldPosition(new L);e.phone={x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)}}return e})}}},viewInfo(){const n=mt(l.s),e=l.y-2.1;return{trackView:yi,mode:l.mode,carVisible:Gt.visible,cockpitVisible:!!(dn&&dn.visible),camY:+ye.position.y.toFixed(2),deckY:+(n.p.y+.58).toFixed(2),carY:+l.y.toFixed(2),ghostRecLen:l.ghostRec?.length??-1,ghostLoaded:!!zi,overheadY:+Oh(ye.position.x,ye.position.z,e+5,e+64).toFixed(2)}},setTrackView(n){return yi=n==="cockpit"?"cockpit":"chase",qi(),yi},listCourses(){return na.map((n,e)=>({index:e,name:n.name,length:n.length,width:n.width,laps:n.laps,gaps:n.gaps.length}))},courseInfo(){return{index:Ts,name:se.name,length:se.length,width:se.width,laps:se.laps}},probeDown(n,e){const t=new Ox(new L(n,400,e),new L(0,-1,0),0,1e3);t.camera=ye;const i=t.intersectObjects(Se.children,!0).map(a=>({y:+a.point.y.toFixed(2),name:a.object.material?.color?"#"+a.object.material.color.getHexString():"?"})),s=Ys(n,e,400);return{x:n,z:e,ground:+ce(n,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:i.slice(0,5)}},rampSurfaceReport(){return aa.map((n,e)=>{const t=n.points[0],i=n.points[n.points.length-1],s=n.points[n.points.length/2|0],a=n.segments[0],r=n.segments[n.segments.length-1],o=Math.atan2(a.abx,-a.abz);return{index:e,rampType:n.rampType,mergeS:n.mergeS,exitS:n.exitS,dirSel:n.dirSel,halfW:n.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2)},climb:+(i.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(r.abx,-r.abz).toFixed(4)}})},colliderSample(n=8){return un.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(n=8){return si.filter(e=>e.hw).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const n=si.filter(e=>e.hw);return{supports:Ch,pylonColliders:n.length,gaps:se.gaps.length,sample:n.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(n=12){const e=[];for(const t of un){const i=Vs(t.x,t.z,t.hw*2,t.hd*2,t.maxY);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:i.courseIndex,s:+i.s.toFixed(1),trackY:+i.trackY.toFixed(1),horizontalClearance:+i.horizontalClearance.toFixed(1),verticalIntrusion:+i.verticalIntrusion.toFixed(1)})}return e.sort((t,i)=>i.verticalIntrusion-t.verticalIntrusion),{totalBuildings:un.length,conflicts:e.length,sample:e.slice(0,n)}},buildingStreetConflictReport(n=12){const e=[];for(const t of un){const i=Ln(t.x,t.z,t.hw*2,t.hd*2,0);i&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:i.axis,road:i.road,overlap:+i.overlap.toFixed(1)})}return e.sort((t,i)=>i.overlap-t.overlap),{totalBuildings:un.length,conflicts:e.length,sample:e.slice(0,n)}},rockColliderSample(n=8){return vi.concat(si.filter(e=>e.kind==="rock")).slice(0,n).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(n=8){return{traffic:Me.traffic,pedestrians:Me.pedestrians,pedestriansActive:Es.filter(e=>e.active).length,turns:Me.turns,splats:Me.splats,trafficCrashes:Me.trafficCrashes,streetLights:Me.streetLights,trafficLights:Me.trafficLights,stopSigns:Me.stopSigns,signs:Me.signs,roadDetails:{...Me.roadDetails},buildingArchetypes:{...Me.buildingArchetypes},zones:{...Me.zones},openerProps:Me.openerProps,signSamples:gl.slice(0,n),types:{...Me.types},offRoadTraffic:An.filter(e=>!Fl(e.x,e.z,2)).length,trafficRoutes:Pa.slice(0,n).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:An.slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:Es.filter(e=>e.active).slice(0,n).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const n={...Me.roadDetails},e={...Me.buildingArchetypes},t={...Me.zones},i=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(n.crosswalks||0)/8)+Math.min(18,(n.laneArrows||0)/3)+Math.min(14,(n.manholes||0)/4)+Math.min(16,Me.signs/7)+Math.min(14,Me.openerProps*1.4)+Math.min(13,i*2.6)).toFixed(1),roadDetails:n,buildingArchetypes:e,zones:t,archetypeKinds:i,zoneKinds:s,openerProps:Me.openerProps,signs:Me.signs,streetLights:Me.streetLights,streetGlowSprites:bs.streetGlowSprites,waterBlockers:bs.waterBlockers,lowFogDisks:bs.lowFogDisks}},objectiveReport(){const n=Jt[l.objectiveIndex%Math.max(1,Jt.length)];return{total:Jt.length,hits:l.objectiveHits,index:l.objectiveIndex,lap:l.objectiveLap,next:n?{x:+n.x.toFixed(1),y:+n.y.toFixed(1),z:+n.z.toFixed(1),label:n.label}:null,collected:Jt.filter(e=>e.collected).length,score:Math.round(l.score),boost:+l.boost.toFixed(2)}},drivingFeelReport(){return{speed:+l.speed.toFixed(2),wheelSteer:+(l.wheelSteer||0).toFixed(3),slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),cameraShake:+(l.cameraShake||0).toFixed(3),collisionDrama:+(l.collisionDrama||0).toFixed(3),collisionHits:l.collisionHits,smokeActive:Er.filter(n=>n.life>0).length,debrisActive:Ar.filter(n=>n.life>0).length,sparksActive:Tr.filter(n=>n.life>0).length}},vehicleDetailReport(){return{player:{...Gt.userData.detailReport},racer:{...C_.userData.detailReport},namedParts:Gt.children.filter(n=>n.name).map(n=>n.name).slice(0,24)}},advanceCityLife(n=1){const e=.03333333333333333;let t=Math.max(0,Math.min(n,60));for(;t>0;){const i=Math.min(e,t);Sf(i),t-=i}return this.cityLifeReport(12)},setRoamUnderTrack(n=260,e=0){const t=mt(n),i=t.p.x+t.side.x*e,s=t.p.z+t.side.z*e,a=Math.atan2(t.tangent.x,-t.tangent.z),r=ce(i,s);l.mode="roam",l.practice=!0,l.freeRun=!1,l.roamPos.set(i,r+zn,s),l.roamYaw=a,l.camYaw=a,l.camLookYaw=0,l.camLookPitch=0,l.cameraZoom=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,l.wheelSteer=0,l.speed=0,Qn();const o=Math.sin(l.roamYaw),c=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-o*17,l.roamPos.y+7.2,l.roamPos.z-c*17),kh(),ye.lookAt(l.roamPos.x+o*13,l.roamPos.y+2.45,l.roamPos.z+c*13),ye.fov=69,ye.updateProjectionMatrix(),{...this.roamReport(),trackY:+t.p.y.toFixed(2),deckClearance:+(t.p.y-l.roamPos.y).toFixed(2)}},setRoamPose(n,e,t){const i=Ys(n,e,l.roamPos.y);l.roamPos.set(n,i.y+zn,e),l.roamYaw=t,l.camYaw=t,l.camLookYaw=0,l.camLookPitch=0,l.wheelSteer=0,l.speed=0,Qn();const s=Math.sin(l.roamYaw),a=-Math.cos(l.roamYaw);return ye.position.set(l.roamPos.x-s*17,l.roamPos.y+7.2,l.roamPos.z-a*17),kh(),ye.lookAt(l.roamPos.x+s*13,l.roamPos.y+2.45,l.roamPos.z+a*13),ye.fov=69,ye.updateProjectionMatrix(),this.roamReport()},setTouchCamera(n=0,e=0,t=Ee.zoom,i=30){Ee.lookX=xe.clamp(n,-1,1),Ee.lookY=xe.clamp(e,-1,1),Ee.zoom=xe.clamp(t,-.42,.9);for(let s=0;s<i;s++)l.mode==="roam"?rp(1/60):Id(1/60);return this.roamReport()},simulateRoamDrive(n=1,e=0,t=0,i=0){if(l.mode!=="roam")return this.roamReport();const s={steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake};Ee.steer=xe.clamp(e,-1,1),Ee.throttle=xe.clamp(t,0,1),Ee.brake=xe.clamp(i,0,1);const a=1/60;let r=Math.max(0,Math.min(n,8));for(;r>0;){const o=Math.min(a,r);if(Jf(o),l.mode!=="roam")break;r-=o}return Ee.steer=s.steer,Ee.throttle=s.throttle,Ee.brake=s.brake,this.roamReport()},simulateTrackDrive(n=1){if(l.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(n,8));for(;t>0;){const i=Math.min(e,t);if(op(i),l.mode!=="race")break;t-=i}return this.roamReport()},roamReport(){const n=l.roamPos,e=gd.set(0,0,-1).applyQuaternion(Gt.quaternion).normalize(),t=Il.set(Math.sin(l.roamYaw),0,-Math.cos(l.roamYaw)).normalize(),i=Ys(n.x,n.z,n.y);return{mode:l.mode,s:+l.s.toFixed(2),totalDistance:+l.totalDistance.toFixed(2),x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2),yaw:+l.roamYaw.toFixed(3),camYaw:+l.camYaw.toFixed(3),speed:+l.speed.toFixed(2),groundXZ:+ce(n.x,n.z).toFixed(2),surface:i.kind,surfaceY:+i.y.toFixed(2),camX:+ye.position.x.toFixed(2),camY:+ye.position.y.toFixed(2),camZ:+ye.position.z.toFixed(2),fov:+ye.fov.toFixed(2),lookYaw:+l.camLookYaw.toFixed(3),lookPitch:+l.camLookPitch.toFixed(3),cameraZoom:+l.cameraZoom.toFixed(3),cameraSightLift:+Pd({x:n.x,y:n.y+2.6,z:n.z},{x:ye.position.x,y:ye.position.y,z:ye.position.z},2.4).toFixed(3),elevatedCameraLift:+_l({x:n.x,y:n.y+2.6,z:n.z},{x:ye.position.x,y:ye.position.y,z:ye.position.z},3.8).toFixed(3),colliders:un.length+si.length+vi.length+An.length,insideBuilding:un.concat(si,vi,An).some(s=>Ry(n,s)),objectiveHits:l.objectiveHits,objectiveIndex:l.objectiveIndex,collisionHits:l.collisionHits,slip:+(l.roamSlip||0).toFixed(3),suspension:+(l.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Gt.userData.frontWheels?+Gt.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function op(n){if(l.mode!=="race")return;l.time+=n,l.freeRun&&(l.damage=0);const e=l.breakdownTimer>0;e&&(l.breakdownTimer-=n,l.breakdownTimer<=0&&(l.damage=55,l.message="Patched up — back on it",l.messageTimer=1.2));const t=Math.max(je.has("KeyW")||je.has("ArrowUp")?1:0,Ee.throttle),i=Math.max(je.has("KeyS")||je.has("ArrowDown")?1:0,Ee.brake),s=xe.clamp((je.has("KeyD")||je.has("ArrowRight")?1:0)-(je.has("KeyA")||je.has("ArrowLeft")?1:0)+Ee.steer,-1,1)*gf,a=t>.03&&!e,r=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&a&&l.grounded,o=mt(l.s),c=o.p.y+2.1,h=Math.abs(l.speed);if(a){const v=l.speed<0?40:0;l.speed+=((r?68:40)*ws().accel+v)*t*n}if(i>.03){const v=l.speed>1.2?70:26;l.speed-=v*i*n}const d=l.grounded?.0024:.0011;l.speed-=d*l.speed*h*n,h>.08?l.speed-=Math.sign(l.speed)*(l.grounded?2.2:.3)*n:t<=.03&&i<=.03&&(l.speed=0),l.speed=xe.clamp(l.speed,-16,156*ws().top-l.damage*.8),e&&(l.speed=Math.min(l.speed,14)),l.boosting=r,r?(l.boost=Math.max(0,l.boost-n*.21),l.score+=28*n):l.boost=Math.min(1,l.boost+n*(l.grounded?.045:.018)*ws().boostRegen);const u=je.has("Space")&&l.grounded,m=(16+h*.13)*(u?1.45:1)*ws().grip;l.lateralVel-=s*m*n,l.lateralVel-=l.lateralVel*(l.grounded?u?2.2:4.1:.7)*n,l.lateral+=l.lateralVel*n;const p=Vi(l.s),x=Math.abs(l.lateral)<se.width*.52,_=!p&&x;if(l.grounded&&(!_||Math.abs(l.lateral)>se.width*.5)&&g0(o,x?"":"Edge slip"),l.grounded){const v=Math.sin(l.time*18)*Math.min(.22,Math.abs(l.speed)/700);l.y=xe.lerp(l.y,c+v,.5),l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.score+=Math.max(0,l.speed)*n*.34,Math.abs(l.lateral)>se.width*.42&&(l.damage+=n*(1.2+Math.abs(l.speed)*.035),l.cameraShake=Math.max(l.cameraShake,.24),l.nearMisses+=n*.8,Math.random()<n*5&&js(o.p.clone().addScaledVector(o.side,Math.sign(l.lateral)*se.width*.55).addScaledVector(sn,1.2),4))}else{l.yVel-=31*n,l.y+=l.yVel*n,l.airtime+=n,l.score+=n*11;const v=mt(l.s),M=v.p.y+2.1;if(!Vi(l.s)&&Math.abs(l.lateral)<se.width*.55&&l.y<=M&&l.yVel<0){const E=-l.yVel,S=Math.abs(l.lateral)<se.width*.34&&E<30,C=Math.round(S?260+l.airtime*85:Math.max(30,120-E));l.y=M,l.grounded=!0,l.yVel=0,l.lastSafeS=l.s,l.lastSafeDistance=l.totalDistance,l.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(l.lateral)-se.width*.36)*1.8,l.score+=C,l.cameraShake=Math.max(l.cameraShake,E/34),l.message=S?"Clean landing":"Hard landing",l.messageTimer=.9,S?l.cleanLandings+=1:l.hardLandings+=1,Bi(`+${C} ${S?"CLEAN AIR":"LANDED"}`,S),S&&En(990,.14),Oa(E),js(v.p.clone().addScaledVector(v.side,l.lateral).addScaledVector(sn,.7),S?7:24),l.airtime=0}if(l.practice||l.freeRun){if(!l.grounded&&l.yVel<-6){const E=mt(l.s),S=E.p.x+E.side.x*l.lateral,C=E.p.z+E.side.z*l.lateral,A=ce(S,C);l.y<=A+1.3&&py(S,C,E)}l.y<-55&&(l.damage+=28,Pc("Track crew recovery"))}else l.y<-55&&(l.damage+=28,Pc("Track crew recovery"))}const g=l.totalDistance;l.totalDistance+=l.speed*n,l.s=(l.totalDistance%se.length+se.length)%se.length,Gy();const f=aa.find(v=>v.rampType==="off");if(l.freeRun&&f&&bc(g,l.totalDistance,f.exitS)&&l.lateral*f.dirSel>se.width*.2&&my(f))return;const y=Math.floor(l.totalDistance/se.length)+1;if(y>l.lap){const v=l.time-l.lapStartTime;Vy(v),l.ghostRec=[],l.splitTimes.push(v),l.bestLap=Math.min(l.bestLap,v),l.lapStartTime=l.time,l.lap=y,l.score+=1200,Bi("+1200 LAP",!0),l.message=l.practice?`Lap ${l.lap}`:l.lap<=se.laps?`Lap ${l.lap}`:"Season race complete",l.messageTimer=1.4,!l.practice&&l.lap>se.laps&&(()=>{const M=Dd();Uy(M===1?"You took the chequered gantry.":`You finished P${M}.`,M)})()}for(const v of se.gaps)bc(g,l.totalDistance,v.start)&&(l.message=v.name,l.messageTimer=1.1,l.grounded&&g0(mt(v.start),v.name));if(l.grounded){for(const v of ka)if(bc(g,l.totalDistance,v.s)&&Math.abs(l.lateral-v.lat)<3.4){const M=mt(v.s);l.boost=Math.min(1,l.boost+.45),l.speed=Math.min(l.speed+9,156-l.damage*.8),l.score+=90,l.cameraShake=Math.max(l.cameraShake,.16),l.message="BOOST PAD",l.messageTimer=.8,Bi("+90 BOOST"),En(640,.22,"sawtooth",.1),js(M.p.clone().addScaledVector(M.side,v.lat).addScaledVector(sn,1),10),Oa(14);break}}l.damage=xe.clamp(l.damage,0,100),!l.freeRun&&l.damage>=90&&l.breakdownTimer<=0&&(l.breakdownTimer=2.6,l.message="Chassis cracked — limping to repair",l.messageTimer=1.6,l.cameraShake=Math.max(l.cameraShake,.8),Oa(40),l.damage=90),je.has("KeyR")&&(l.damage=Math.min(99,l.damage+8),Pc("Manual reset"),je.delete("KeyR"))}function v0(n){const e=se.length*se.laps,t=1+.07*(4-to());for(const i of qn){if(l.mode==="race"&&!l.practice){const c=l.totalDistance-i.distance,h=xe.clamp(c*.055,-11,15),d=Math.sin(l.time*i.waveFreq+i.phase)*i.wave;let u=i.base+d+h;i.key==="bishop"&&(u+=11*Math.exp(-l.time/22)),i.key==="maddock"&&(u+=10*xe.clamp(i.distance/Math.max(1,e),0,1)),i.speed=xe.clamp(u*t,60,134),i.distance+=i.speed*n,i.distance>=e&&!i.finished&&(i.finished=l.time,l.message=`${i.label} takes the flag`,l.messageTimer=1.1)}i.s=(i.distance%se.length+se.length)%se.length;const s=mt(i.s),a=Math.abs(i.distance-l.totalDistance);let r=i.lane*se.width+Math.sin(i.s*.02+i.phase)*1.2;if(a<14){const c=(l.lateral>=0?-1:1)*se.width*(.22+Math.abs(i.lane)*.4);r=xe.lerp(c,r,a/14)}i.mesh.position.copy(s.p).addScaledVector(sn,1.4).addScaledVector(s.side,r),i.mesh.quaternion.setFromRotationMatrix(new bt().makeBasis(s.side,sn,s.tangent));const o=a<26&&yi==="cockpit";i.mesh.visible=(l.mode==="race"||l.mode==="paused"||l.mode==="result")&&!l.practice&&!o}l.rivalDistance=Math.max(...qn.map(i=>i.distance)),l.rivalS=(l.rivalDistance%se.length+se.length)%se.length}function Dd(){return l.practice?1:1+qn.filter(n=>n.distance>l.totalDistance).length}function Ny(n,e){const t=e.side.clone().multiplyScalar(l.lateral),i=e.p.clone().add(t);i.y=l.y;const s=l.cameraShake;s>.01&&(i.x+=(Math.random()-.5)*s*.8,i.y+=(Math.random()-.5)*s*.45),ye.position.copy(i);const a=Math.abs(l.speed),r=68+Math.min(10,a*.055)+(l.boosting?3:0)+l.cameraZoom*12;Math.abs(ye.fov-r)>.02&&(ye.fov+=(r-ye.fov)*(1-Math.pow(.004,n)),ye.updateProjectionMatrix());const o=mt(l.s+34+l.speed*.16),c=o.p.clone().addScaledVector(o.side,l.lateral*.45);c.y+=1.7+l.camLookPitch*12+Math.sin(l.time*8)*Math.min(.2,a/680),on.position.copy(ye.position),on.lookAt(c),on.rotateY(Math.PI),on.rotateY(-l.camLookYaw),on.rotateZ(-e.bank*.72-l.lateralVel*.006),on.rotateX(e.grade*.18+(l.grounded?0:xe.clamp(l.yVel,-30,30)*-.006)),ye.quaternion.slerp(on.quaternion,1-Math.pow(8e-4,n))}function Oh(n,e,t,i){let s=1/0;const a=se.width*.5+2.2;for(const r of Ul()){if(r.courseIndex!==Ts||r.y<t||r.y>i||r.y>=s)continue;const o=n-r.x,c=e-r.z;o*o+c*c<a*a&&(s=r.y)}return s}function ky(n,e){const t=Math.abs(l.speed),i=l.y-2.1;let s=12.8+t*.05+xe.clamp(l.cameraZoom,-.42,.9)*8,a=4.6+t*.014+l.camLookPitch*10,r=mt(l.s-s),o=Oh(r.p.x,r.p.z,i+5,i+64);o-1.5<r.p.y+2&&(s=6.4,a=2.7,r=mt(l.s-s),o=Oh(r.p.x,r.p.z,i+5,i+64));let c=xe.lerp(r.p.y,i,.62)+a;const h=xd.set(r.p.x+r.side.x*l.lateral*.72,0,r.p.z+r.side.z*l.lateral*.72);if(c=Math.max(c,r.p.y+2.35,ce(h.x,h.z)+2.8),o<1/0&&(c=Math.min(c,o-1.5)),h.y=c,l.cameraShake>.01){const p=l.cameraShake;h.x+=(Math.random()-.5)*p*1.1,h.y+=(Math.random()-.5)*p*.6,h.z+=(Math.random()-.5)*p*1.1}ye.position.distanceTo(h)>70&&ye.position.copy(h),ye.position.lerp(h,1-Math.pow(2e-4,n)),ye.position.y=Math.max(ye.position.y,r.p.y+2.05),o<1/0&&(ye.position.y=Math.min(ye.position.y,o-1.4));const d=mt(l.s+17+t*.09),u=d.p.clone().addScaledVector(d.side,l.lateral*.55);u.y+=2.1+l.camLookPitch*12,l.grounded||(u.y=xe.lerp(u.y,l.y+1.2,.5)),on.position.copy(ye.position),on.lookAt(u),on.rotateY(Math.PI),on.rotateY(-l.camLookYaw),on.rotateZ(-e.bank*.42-l.lateralVel*.0034),ye.quaternion.slerp(on.quaternion,1-Math.pow(4e-4,n));const m=66+Math.min(11,t*.055)+(l.boosting?5:0)+xe.clamp(l.cameraZoom,-.42,.9)*10;Math.abs(ye.fov-m)>.02&&(ye.fov+=(m-ye.fov)*(1-Math.pow(.004,n)),ye.updateProjectionMatrix())}let Mi=null,zi=null,ts=0;function Oy(){try{zi=JSON.parse(localStorage.getItem("steel-ribbon-ghost-"+Ts)||"null")}catch{zi=null}ts=0}function By(){Mi&&Da(Mi),Mi=Rs[Gi].build(),Mi.traverse(n=>{n.castShadow=!1,n.receiveShadow=!1,n.material&&(n.material=n.material.clone(),n.material.transparent=!0,n.material.opacity=Math.min(n.material.opacity??1,.28),n.material.depthWrite=!1)}),Mi.visible=!1}function Vy(n){if(!(l.practice||l.freeRun)||!l.ghostRec||l.ghostRec.length<12||zi&&n>=zi.time)return;const e=Math.max(1,Math.floor(l.ghostRec.length/700)),t=l.ghostRec.filter((i,s)=>s%e===0);zi={time:+n.toFixed(2),samples:t};try{localStorage.setItem("steel-ribbon-ghost-"+Ts,JSON.stringify(zi))}catch{}l.message=`Ghost saved — ${yl(n)}`,l.messageTimer=1.3,ts=0}function Gy(){if(l.mode!=="race")return;l.ghostRec||(l.ghostRec=[]);const n=l.time-l.lapStartTime,e=l.ghostRec[l.ghostRec.length-1];(!e||n-e[0]>.08)&&l.ghostRec.length<4e3&&l.ghostRec.push([+n.toFixed(2),+l.s.toFixed(1),+l.lateral.toFixed(2),+l.y.toFixed(2)])}function Hy(){if(!Mi)return;const n=l.mode==="race"&&(l.practice||l.freeRun)&&zi?.samples?.length>2&&!window.__freeCam;if(Mi.visible=n,!n)return;const e=(l.time-l.lapStartTime)%Math.max(.01,zi.time),t=zi.samples;for(e<(t[ts]?.[0]??0)&&(ts=0);ts<t.length-2&&t[ts+1][0]<e;)ts++;const i=t[ts],s=t[Math.min(ts+1,t.length-1)],a=xe.clamp((e-i[0])/Math.max(.01,s[0]-i[0]),0,1),r=xe.lerp(i[1],s[1],Math.abs(s[1]-i[1])>se.length*.5?0:a),o=xe.lerp(i[2],s[2],a),c=xe.lerp(i[3],s[3],a),h=mt((r%se.length+se.length)%se.length);Mi.position.set(h.p.x+h.side.x*o,c-.72,h.p.z+h.side.z*o),Mi.quaternion.setFromRotationMatrix(new bt().makeBasis(h.side,sn,h.tangent))}function Wy(){const n=l.mode==="race"||l.mode==="paused"||l.mode==="result",e=n&&yi==="chase"&&!window.__freeCam;if(dn&&(dn.visible=!e),Gt.visible!==e&&(Gt.visible=e),!e)return;const t=mt(l.s);Gt.position.set(t.p.x+t.side.x*l.lateral,l.y-.72,t.p.z+t.side.z*l.lateral);const i=new bt().makeBasis(t.side,sn,t.tangent);Gt.quaternion.setFromRotationMatrix(i),l.grounded?(Gt.rotateX(-t.grade*.5),Gt.rotateZ(t.bank*.6+xe.clamp(l.lateralVel*.012,-.16,.16))):Gt.rotateX(xe.clamp(-l.yVel*.011,-.34,.4));const s=Gt.userData.frontWheels,a=xe.clamp(-l.lateralVel*.05,-.5,.5);s&&(s[0].rotation.y=a,s[1].rotation.y=a)}let $o=.6;function Xy(n){if(window.__freeCam)return;$o+=n*.13;const e=80,t=300,i=ce(e,t);Gt.visible=!0,dn&&(dn.visible=!1),Gt.position.set(e,i+.85,t),Gt.quaternion.setFromAxisAngle(sn,Math.PI*.24);const s=16.5;ye.position.set(e+Math.cos($o)*s,i+5.3+Math.sin($o*.57)*1.1,t+Math.sin($o)*s),ye.lookAt(e,i+1.5,t),ye.rotateY(.3),Math.abs(ye.fov-58)>.1&&(ye.fov=58,ye.updateProjectionMatrix()),window.__steelRibbonTelemetry&&(window.__steelRibbonTelemetry.mode=l.mode)}function Id(n){if(window.__freeCam)return;sp(n);const e=mt(l.s);yi==="chase"&&l.mode!=="menu"?ky(n,e):Ny(n,e),l.cameraShake=Math.max(0,l.cameraShake-n*1.9);const t=Il.set(0,0,-1).applyQuaternion(ye.quaternion).normalize();window.__steelRibbonTelemetry={mode:l.mode,s:l.s,totalDistance:l.totalDistance,rivalDistance:l.rivalDistance,speed:l.speed,lap:l.lap,score:l.score,damage:l.damage,y:l.y,yVel:l.yVel,grounded:l.grounded,input:{steer:Ee.steer,throttle:Ee.throttle,brake:Ee.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:t.x,y:t.y,z:t.z}}}const Zs={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},mr=[28,54,82,110,134,156];function qy(){const n=Math.abs(l.speed);let e=1;for(let o=0;o<mr.length;o++)n>mr[o]&&(e=o+2);e=Math.min(e,mr.length);const t=e===1?0:mr[e-2],i=mr[e-1],s=i>t?xe.clamp((n-t)/(i-t),0,1):0,a=e===1?Zs.idle:Zs.postShift;let r=a+s*(Zs.shift-a);return n<.4&&(r=Zs.idle),{gear:e,rpm:r}}let M0=performance.now(),Lc=0,Dc=0;function lp(n){const e=n.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),i=n.clientWidth||120,s=n.clientHeight||70;(n.width!==Math.round(i*t)||n.height!==Math.round(s*t))&&(n.width=Math.round(i*t),n.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,i,s);const a=i/2,r=s-s*.14,o=Math.min(i*.46,s*.9);return{ctx:e,w:i,h:s,cx:a,cy:r,R:o,aFor:c=>Math.PI-c*Math.PI,at:(c,h)=>[a+Math.cos(c)*h,r-Math.sin(c)*h]}}function Yy(n,e){const t=qe.speedo;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=lp(t),h=360;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke(),i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let x=0;x<=h;x+=20){const _=x/h,g=o(_),f=x%80===0;i.strokeStyle="rgba(180, 230, 255, 0.85)",i.lineWidth=f?Math.max(1.4,r*.035):Math.max(1,r*.02);const y=c(g,r-r*.02),v=c(g,r-r*(f?.18:.1));if(i.beginPath(),i.moveTo(y[0],y[1]),i.lineTo(v[0],v[1]),i.stroke(),f){const M=c(g,r-r*.34);i.fillStyle="#cfeeff",i.fillText(String(x/10),M[0],M[1])}}const d=xe.clamp(n/h,0,1),u=o(d),m=c(u,r-r*.06),p=c(u+Math.PI,r*.14);i.strokeStyle="#7df1ff",i.shadowColor="rgba(80, 220, 255, 0.9)",i.shadowBlur=r*.18,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(p[0],p[1]),i.lineTo(m[0],m[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("MPH",s,a-r*.26),i.fillStyle=e?"#ff8077":"#f2f8ff",i.font=`800 ${Math.max(9,r*.2)}px "Courier New", monospace`,i.fillText(e?`-${Math.round(n)}`:String(Math.round(n)),s,a+r*.02)}function $y(n,e){const t=qe.boostGauge;if(!t)return;const{ctx:i,cx:s,cy:a,R:r,aFor:o,at:c}=lp(t),h=18;i.lineCap="round",i.lineWidth=Math.max(2,r*.07),i.strokeStyle="rgba(120, 205, 255, 0.3)",i.beginPath(),i.arc(s,a,r,o(1),o(0)),i.stroke();const d=xe.clamp(n,0,1),u=n<.25;i.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",i.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",i.shadowBlur=e?r*.25:r*.1,i.lineWidth=Math.max(2,r*.07),i.beginPath(),i.arc(s,a,r,o(d),o(0)),i.stroke(),i.shadowBlur=0,i.font=`700 ${Math.max(6,r*.15)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let _=0;_<=h;_+=3){const g=_/h,f=o(g),y=_%6===0;i.strokeStyle=_>=h*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",i.lineWidth=y?Math.max(1.3,r*.03):Math.max(1,r*.018);const v=c(f,r-r*.02),M=c(f,r-r*(y?.17:.1));if(i.beginPath(),i.moveTo(v[0],v[1]),i.lineTo(M[0],M[1]),i.stroke(),y){const E=c(f,r-r*.33);i.fillStyle="#cfeeff",i.fillText(String(_),E[0],E[1])}}const m=o(d),p=c(m,r-r*.06),x=c(m+Math.PI,r*.14);i.strokeStyle=u?"#ff5436":"#ffd23f",i.shadowColor="rgba(255, 200, 60, 0.8)",i.shadowBlur=r*.16,i.lineWidth=Math.max(1.8,r*.05),i.beginPath(),i.moveTo(x[0],x[1]),i.lineTo(p[0],p[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,r*.03),i.beginPath(),i.arc(s,a,r*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,r*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("BOOST psi",s,a-r*.26),e&&(i.fillStyle="#ffce4a",i.shadowColor="rgba(255, 190, 60, 0.95)",i.shadowBlur=r*.3,i.beginPath(),i.arc(s,a+r*.02,r*.07,0,Math.PI*2),i.fill(),i.shadowBlur=0)}function Zy(n,e){const t=qe.tach;if(!t)return;const i=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),a=t.clientWidth||160,r=t.clientHeight||70;(t.width!==Math.round(a*s)||t.height!==Math.round(r*s))&&(t.width=Math.round(a*s),t.height=Math.round(r*s)),i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,a,r);const o=a/2,c=r-r*.14,h=Math.min(a*.46,r*.9),d=Zs.max,u=v=>Math.PI-v*Math.PI,m=(v,M)=>[o+Math.cos(v)*M,c-Math.sin(v)*M];i.lineCap="round",i.lineWidth=Math.max(2,h*.07),i.strokeStyle="rgba(120, 205, 255, 0.32)",i.beginPath(),i.arc(o,c,h,u(1),u(0)),i.stroke();const p=Zs.redline/d;i.strokeStyle="#ff3b30",i.beginPath(),i.arc(o,c,h,u(1),u(p)),i.stroke(),i.font=`700 ${Math.max(7,h*.17)}px "Courier New", monospace`,i.textAlign="center",i.textBaseline="middle";for(let v=0;v<=9;v++){const M=v/9,E=u(M),S=v*1e3>=Zs.redline;i.strokeStyle=S?"#ff6155":"rgba(180, 230, 255, 0.9)",i.lineWidth=Math.max(1.4,h*.035);const C=m(E,h-h*.02),A=m(E,h-h*.18);i.beginPath(),i.moveTo(C[0],C[1]),i.lineTo(A[0],A[1]),i.stroke();const w=m(E,h-h*.34);if(i.fillStyle=S?"#ff8077":"#cfeeff",i.fillText(String(v),w[0],w[1]),v<9){const b=u((v+.5)/9),P=m(b,h-h*.02),D=m(b,h-h*.1);i.strokeStyle="rgba(150, 210, 255, 0.5)",i.lineWidth=Math.max(1,h*.02),i.beginPath(),i.moveTo(P[0],P[1]),i.lineTo(D[0],D[1]),i.stroke()}}const x=xe.clamp(n/d,0,1),_=u(x),g=m(_,h-h*.06),f=m(_+Math.PI,h*.14);i.strokeStyle="#ffdd48",i.shadowColor="rgba(255, 200, 60, 0.9)",i.shadowBlur=h*.18,i.lineWidth=Math.max(1.8,h*.05),i.beginPath(),i.moveTo(f[0],f[1]),i.lineTo(g[0],g[1]),i.stroke(),i.shadowBlur=0,i.fillStyle="#13303d",i.strokeStyle="#6ec7ff",i.lineWidth=Math.max(1,h*.03),i.beginPath(),i.arc(o,c,h*.1,0,Math.PI*2),i.fill(),i.stroke(),i.fillStyle="rgba(135, 223, 255, 0.85)",i.font=`700 ${Math.max(6,h*.12)}px "Courier New", monospace`,i.textBaseline="alphabetic",i.fillText("x1000 r/min",o,c-h*.26);const y=l.speed<-.5?"R":String(e);i.fillStyle="#f2f8ff",i.font=`800 ${Math.max(9,h*.22)}px "Courier New", monospace`,i.fillText(y,o,c+h*.02)}function Rr(){se.length*se.laps;const n=Qu(l.practice?l.totalDistance%se.length:l.totalDistance),e=l.practice?"SOLO":`P${Dd()}`;e!==l.leadState&&l.mode==="race"&&(l.leadState=e,l.practice||(l.message=e==="P1"?"You took the lead":`Now ${e}`,l.messageTimer=.95)),qe.damage.style.width=`${Math.round(l.damage)}%`,qe.lap.textContent=l.practice?`LAP ${l.lap}`:`${Math.min(l.lap,se.laps)}/${se.laps}`,qe.timer.textContent=yl(l.time);const t=l.mode==="roam",i=t&&l.driftCombo>0&&l.driftComboT>0?`  ·  DRIFT ×${Math.min(5,l.driftCombo+1)}`:"";qe.score.textContent=t?`Gates ${l.objectiveHits}/${Jt.length}  Score ${Math.round(l.score)}${i}`:`Score ${Math.round(l.score)}`;const s=l.mode==="race"||l.mode==="paused"||t;if(qe.position.textContent=t?l.vehicle==="foot"?"ON FOOT":l.vehicle==="heli"?"HELICOPTER":l.drivingStolen&&st?`${st.type.toUpperCase()} · STOLEN`:"FREE ROAM":l.freeRun?"FREE RUN":l.practice?"PRACTICE":`${e} DIV ${to()}`,t&&Jt.length){const d=Jt[l.objectiveIndex%Jt.length];qe.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}t&&(l.heat||0)>=1&&(qe.position.textContent+=`  ${"★".repeat(Math.min(5,Math.ceil(l.heat)))}`),t&&Ke.state==="active"&&(qe.trackName.textContent=`Deliver the ${Ke.type.toUpperCase()} · ${Math.max(0,Math.ceil(Ke.timeLeft))}s`),qe.hud.style.display=s?"flex":"none",qe.raceStrip.style.display=l.mode==="race"||l.mode==="paused"?"grid":"none",qe.touchControls.style.display=s?"":"none",qe.playerProgress.style.width=`${Math.round(n*100)}%`;for(const d of qn)d.progEl&&(d.progEl.style.width=`${Math.round((l.practice?0:Qu(d.distance))*100)}%`);const a=qy();l.gear=a.gear;const r=performance.now(),o=Math.min(.05,(r-M0)/1e3);M0=r;const c=1-Math.exp(-o*(a.rpm>l.tachRpm?10:6));l.tachRpm+=(a.rpm-l.tachRpm)*c,Zy(l.tachRpm,a.gear);const h=Math.abs(l.speed)*2.25;Lc+=(h-Lc)*(1-Math.exp(-o*8)),Dc+=(l.boost-Dc)*(1-Math.exp(-o*9)),Yy(Lc,l.speed<-.5),$y(Dc,l.boosting),qe.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(l.speed)-44)/150)),qe.damageFx.style.opacity=l.damage<18?0:Math.min(.72,(l.damage-18)/82),l.mode==="paused"?(qe.centerMessage.textContent="Paused",qe.centerMessage.classList.remove("hidden")):l.messageTimer>0?(qe.centerMessage.textContent=l.message,qe.centerMessage.classList.remove("hidden")):qe.centerMessage.classList.add("hidden")}function yl(n){const e=Math.floor(n/60),t=n-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}const Vn={active:!1,prev:{}};function Ky(){let n=null;if(navigator.getGamepads){for(const d of navigator.getGamepads())if(d&&d.connected){n=d;break}}if(!n){if(Vn.active){Vn.active=!1,Ee.steer=0,Ee.throttle=0,Ee.brake=0;for(const d of["Space","ShiftLeft"])Vn.prev[d]&&(je.delete(d),Vn.prev[d]=!1)}return}const e=d=>Math.abs(d)<.14?0:d,t=e(n.axes[0]||0),i=Math.max(n.buttons[7]?.value||0,n.buttons[0]?.pressed?1:0),s=Math.max(n.buttons[6]?.value||0,n.buttons[1]?.pressed?1:0),a=!!n.buttons[2]?.pressed,r=!!n.buttons[3]?.pressed,o=!!n.buttons[5]?.pressed,c=!!n.buttons[9]?.pressed;if(!Vn.active&&!t&&!i&&!s&&!a&&!r&&!o&&!c)return;Vn.active||rs(),Vn.active=!0,Ee.steer=t,Ee.throttle=i,Ee.brake=s;const h=(d,u)=>{u&&!Vn.prev[d]?je.add(d):!u&&Vn.prev[d]&&je.delete(d),Vn.prev[d]=u};h("Space",a),h("ShiftLeft",o),r&&!Vn.prev.actB&&l.mode==="roam"&&Rd(),Vn.prev.actB=r,c&&!Vn.prev.startB&&window.dispatchEvent(new KeyboardEvent("keydown",{code:l.mode==="race"||l.mode==="paused"?"KeyP":"Escape"})),Vn.prev.startB=c}function cp(){rn.info.reset(),Ky();const n=zM.getDelta();let e=Math.min(.033,n);l.sloMoT>0&&(l.sloMoT=Math.max(0,l.sloMoT-e),e*=.42),l.messageTimer>0&&(l.messageTimer-=e),l.mode==="roam"?(l.vehicle==="foot"?wy(e):l.vehicle==="heli"?Sy(e):Jf(e),rp(e),xy()):l.mode==="menu"?(v0(e),Xy(e)):(op(e),v0(e),Wy(),Hy(),Id(e)),My(),vy(),xi&&xi.position.copy(ye.position),uy(e),Sf(e),Rr(),fy(),Mr.uniforms.uTime.value+=e,yf.forEach(i=>i.uniforms.uTime.value+=e),Mr.uniforms.uSpeed.value=Math.min(1,Math.abs(l.speed)/150);const t=(je.has("ShiftLeft")||je.has("ShiftRight"))&&l.boost>.02&&(l.mode==="race"||l.mode==="roam")?1:Math.min(.75,l.roamSlip*.55+l.collisionDrama*.6);Mr.uniforms.uBoost.value+=(t-Mr.uniforms.uBoost.value)*Math.min(1,e*6),Qa.render(),Me.renderCalls=rn.info.render.calls,Me.renderTris=rn.info.render.triangles,requestAnimationFrame(cp)}window.addEventListener("keydown",n=>{je.add(n.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(n.code)&&n.preventDefault(),n.code==="KeyC"&&(l.mode==="race"||l.mode==="paused"?kM():l.mode==="roam"&&l.vehicle!=="foot"&&Iy()),n.code==="KeyE"&&Rd(),n.code==="KeyN"&&Mp(),n.code==="KeyV"&&Ud(),n.code==="KeyP"&&l.mode==="race"?(l.mode="paused",je.clear(),Yr()):n.code==="KeyP"&&l.mode==="paused"?l.mode="race":n.code==="Escape"&&(l.mode==="race"||l.mode==="paused"||l.mode==="roam")&&(l.mode="menu",Yr(),Gt.visible=!1,dn&&(dn.visible=!0),document.body.classList.remove("roam-mode"),qi(),qe.menu.classList.remove("hidden"))});window.addEventListener("keyup",n=>je.delete(n.code));window.addEventListener("resize",()=>{ye.aspect=window.innerWidth/window.innerHeight,ye.updateProjectionMatrix(),rn.setSize(window.innerWidth,window.innerHeight),Qa.setSize(window.innerWidth,window.innerHeight),Gf.setSize(window.innerWidth,window.innerHeight)});const bl=()=>{rs(),window.removeEventListener("pointerdown",bl),window.removeEventListener("keydown",bl)};window.addEventListener("pointerdown",bl);window.addEventListener("keydown",bl);const Xr=document.createElement("button");Xr.id="volBtn",Xr.type="button";function hp(){Xr.textContent=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?"🔇 Sound off":"🔊 Sound on"}hp();Xr.addEventListener("click",n=>{n.stopPropagation();const e=Number(localStorage.getItem("steel-ribbon-vol")??.8)<=.001?.8:0;localStorage.setItem("steel-ribbon-vol",String(e)),Ae&&Ae.master.gain.setTargetAtTime(e,Ae.ctx.currentTime,.05),hp()});const dp=document.querySelector("#menuToggles")||qe.menu;dp.appendChild(Xr);const qr=document.createElement("button");qr.id="musicBtn",qr.type="button";function up(){qr.textContent=localStorage.getItem("steel-ribbon-music")!=="0"?"🎵 Music on":"🎵 Music off"}up();qr.addEventListener("click",n=>{n.stopPropagation();const e=localStorage.getItem("steel-ribbon-music")!=="0";localStorage.setItem("steel-ribbon-music",e?"0":"1"),rs(),up()});dp.appendChild(qr);const Pr=document.createElement("button");Pr.id="actionBtn",Pr.type="button",Pr.textContent="E";Pr.addEventListener("pointerdown",n=>{n.preventDefault(),rs(),Rd()});qe.touchControls.appendChild(Pr);const Nl=document.createElement("div");Nl.className="course-select";Nl.innerHTML='<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>';qe.freeRunBtn.parentNode.insertBefore(Nl,qe.freeRunBtn);const fp=[];Rs.forEach((n,e)=>{const t=document.createElement("button");t.className="course-btn",t.type="button",t.textContent=String(e+1),t.title=`${n.label} — ${n.trait}`,t.addEventListener("click",()=>R_(e)),Nl.querySelector("#carButtons").appendChild(t),fp.push(t)});function Bh(){const n=Rs[Gi],e=document.querySelector("#carName");e&&(e.textContent=`${n.label} · ${n.trait}`),fp.forEach((t,i)=>t.classList.toggle("active",i===Gi))}Bh();qe.raceStrip.innerHTML='<span>YOU<i id="playerProgress"></i></span>'+qn.map(n=>`<span>${n.label.slice(0,4).toUpperCase()}<i id="prog-${n.key}"></i></span>`).join("");qe.playerProgress=document.querySelector("#playerProgress");qn.forEach(n=>n.progEl=document.querySelector(`#prog-${n.key}`));function kl(){const n=to();qe.startBtn.textContent=Xt?.active?`Continue Season — Race ${Xt.raceIndex+1}/4`:`Start Season (Div ${n})`;const e=document.querySelector("#menu .league");if(e){const t=Lf();e.innerHTML=`<span>Division ${Pf(n)}${Xt?.active?` — after race ${Xt.raceIndex}/4`:""}</span>`+t.map((i,s)=>`<b>${s+1}. ${i.label}${Xt?` — ${i.pts} pts`:""}</b>`).join("")}}function Jy(){l.mode==="roam"&&l.score>800&&bp("roam",l.score,{deliveries:Me.deliveries||0,stunts:Me.stunts||0,busts:Me.busts||0}),l.mode="menu",Yr(),Gt.visible=!1,dn&&(dn.visible=!0),eo(!1),document.body.classList.remove("roam-mode"),qi(),kl(),qe.result.classList.add("hidden"),qe.menu.classList.remove("hidden")}kl();qe.startBtn.addEventListener("click",()=>{Xt&&Xt.active||L_(),no(xe.clamp(Xt.raceIndex,0,3)),Wr(!1,!1,!0)});qe.practiceBtn.addEventListener("click",()=>Wr(!0));qe.freeRunBtn.addEventListener("click",()=>Wr(!0,!0));qe.roamBtn.addEventListener("click",()=>Ml());qe.againBtn.addEventListener("click",()=>{l.seasonRace&&Xt?Xt.active&&Xt.raceIndex<4?(no(Xt.raceIndex),Wr(!1,!1,!0)):Jy():Wr(!1)});qe.courseButtons.forEach(n=>{n.addEventListener("click",()=>no(Number(n.dataset.course)))});function pp(n){n&&(n.classList.remove("active"),n.style.setProperty("--stick-x","0px"),n.style.setProperty("--stick-y","0px"))}function Yr(){Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.lookX=0,Ee.lookY=0,Ee.zoom=0,Ee.lookPointer=null,Ee.drivePointer=null,Ee.pinchStartDistance=0,Ee.pinchStartZoom=0;for(const n of qe.touchControls.querySelectorAll(".touch-stick"))pp(n)}function Zo(n,e){const t=n.getBoundingClientRect(),i=Math.min(t.width,t.height)*.36;if(!(i>0))return;const s=xe.clamp(e.clientX-(t.left+t.width/2),-i,i),a=xe.clamp(e.clientY-(t.top+t.height/2),-i,i),r=n.dataset.stick;if(n.classList.add("active"),r==="look")Ee.lookX=xe.clamp(s/i,-1,1),Ee.lookY=xe.clamp(-a/i,-1,1),n.style.setProperty("--stick-x",`${Math.round(Ee.lookX*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-Ee.lookY*i)}px`);else{const o=xe.clamp(s/i,-1,1),c=xe.clamp(-a/i,-1,1);Ee.steer=o,Ee.throttle=Math.max(0,c),Ee.brake=Math.max(0,-c),n.style.setProperty("--stick-x",`${Math.round(o*i)}px`),n.style.setProperty("--stick-y",`${Math.round(-c*i)}px`)}}function _0(n,e){return Array.from(n.changedTouches).find(t=>t.identifier===e)}function y0(n,e){e==="look"?(Ee.lookX=0,Ee.lookY=0,Ee.lookPointer=null):(Ee.steer=0,Ee.throttle=0,Ee.brake=0,Ee.drivePointer=null),pp(n)}function jy(n,e){return Math.hypot(n.clientX-e.clientX,n.clientY-e.clientY)}function mp(n,e=!1){if(n.touches.length<2){Ee.pinchStartDistance=0;return}const t=jy(n.touches[0],n.touches[1]);if(e||!(Ee.pinchStartDistance>0)){Ee.pinchStartDistance=t,Ee.pinchStartZoom=Ee.zoom;return}const i=Math.max(.2,t/Ee.pinchStartDistance);Ee.zoom=xe.clamp(Ee.pinchStartZoom-Math.log(i)*1.15,-.42,.9)}for(const n of qe.touchControls.querySelectorAll(".touch-stick")){const e=n.dataset.stick;n.addEventListener("pointerdown",s=>{s.preventDefault(),rs(),l.mode==="paused"&&(l.mode="race"),e==="look"&&(Ee.lookPointer=s.pointerId),e==="drive"&&(Ee.drivePointer=s.pointerId),Zo(n,s)},{passive:!1}),n.addEventListener("pointermove",s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&(s.preventDefault(),Zo(n,s))},{passive:!1});const t=s=>{(e==="look"?Ee.lookPointer:Ee.drivePointer)===s.pointerId&&y0(n,e)};n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("touchstart",s=>{s.preventDefault(),rs(),l.mode==="paused"&&(l.mode="race");const a=s.changedTouches[0];a&&(e==="look"&&(Ee.lookPointer=a.identifier),e==="drive"&&(Ee.drivePointer=a.identifier),Zo(n,a))},{passive:!1}),n.addEventListener("touchmove",s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer,r=_0(s,a);r&&(s.preventDefault(),Zo(n,r))},{passive:!1});const i=s=>{const a=e==="look"?Ee.lookPointer:Ee.drivePointer;_0(s,a)&&(s.preventDefault(),y0(n,e))};n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}for(const n of qe.touchControls.querySelectorAll("button")){const e=n.dataset.code;n.addEventListener("pointerdown",i=>{i.preventDefault(),rs(),je.add(e),n.setPointerCapture(i.pointerId)});const t=()=>je.delete(e);n.addEventListener("pointerup",t),n.addEventListener("pointercancel",t),n.addEventListener("lostpointercapture",t)}Jr.addEventListener("touchstart",n=>{n.touches.length>=2&&(n.preventDefault(),mp(n,!0))},{passive:!1});Jr.addEventListener("touchmove",n=>{n.touches.length>=2&&(n.preventDefault(),mp(n))},{passive:!1});Jr.addEventListener("touchend",n=>{n.touches.length<2&&(Ee.pinchStartDistance=0)},{passive:!1});Jr.addEventListener("touchcancel",()=>{Ee.pinchStartDistance=0},{passive:!1});var Ai=0;function Ya(){return Ai}let li=localStorage.getItem("steel-ribbon-weather")||"clear";li==="rain"||(li="clear");const Fd=420,xp=[];for(let n=0;n<Fd;n++)xp.push({x:(Math.random()-.5)*130,y:Math.random()*90,z:(Math.random()-.5)*130});const wl=new jt;wl.setAttribute("position",new St(new Float32Array(Fd*6),3));const gp=new ul({color:10203340,transparent:!0,opacity:0,depthWrite:!1}),Ks=new jm(wl,gp);Ks.frustumCulled=!1,Ks.renderOrder=40,Ks.visible=!1,Se.add(Ks);pn(new zt,(n,e)=>{const t=li==="rain"?1:0;if(Ai+=(t-Ai)*Math.min(1,e*1.3),t===0&&Ai<.01&&(Ai=0),Ks.visible=Ai>.02,gp.opacity=.34*Ai,Ks.visible){Ks.position.copy(ye.position);const i=wl.attributes.position.array;for(let s=0;s<Fd;s++){const a=xp[s];a.y-=96*e,a.y<-8&&(a.y+=98);const r=s*6;i[r]=a.x,i[r+1]=a.y,i[r+2]=a.z,i[r+3]=a.x+.3,i[r+4]=a.y-1.7,i[r+5]=a.z}wl.attributes.position.needsUpdate=!0}mn.roadMat&&(mn.roadMat.roughness=.62-.37*Ai,mn.roadMat.metalness=.1+.26*Ai,mn.roadMat.envMapIntensity=.8+.9*Ai)});function Ud(){li=li==="rain"?"clear":"rain",localStorage.setItem("steel-ribbon-weather",li),vp(),l.message=li==="rain"?"Rain rolling in":"Skies clearing",l.messageTimer=1.2}const $r=document.createElement("button");$r.id="weatherBtn",$r.type="button";function vp(){$r.textContent=li==="rain"?"🌧 Rain":"☀ Clear"}vp();$r.addEventListener("click",n=>{n.stopPropagation(),Ud()});(document.querySelector("#menuToggles")||qe.menu).appendChild($r);const Lr=["dusk","night","day","cycle"],Qy={dusk:"🌇",night:"🌃",day:"🌞",cycle:"🔁"};let Wn=localStorage.getItem("steel-ribbon-tod")||"dusk";Lr.includes(Wn)||(Wn="dusk");let il=0,sl=0,Ic=95;const eb=new rt,Vh=new rt,tb=new rt;function Os(n,e,t,i,s){return tb.set(n).lerp(eb.set(e),i).lerp(Vh.set(t),s)}const xs=(n,e,t,i,s)=>n+(e-n)*i+(t-n)*s;Se.traverse(n=>{n.isSprite&&n.renderOrder===-50&&mn.cloudMats.push(n.material)});function nb(n,e){if(!mn.skyU)return;const t=Ya();mn.skyU.uDay.value=n,mn.skyU.uNight.value=e,mn.skyU.uRain.value=t;const i=mn;i.hemi.color.copy(Os(16757626,12573183,2371663,n,e)),i.hemi.groundColor.copy(Os(3097190,5925464,789534,n,e)),i.hemi.intensity=xs(.66,.95,.22,n,e)*(1-.38*t),i.fill.color.copy(Os(7179775,13096432,2240591,n,e)),i.fill.intensity=xs(.6,.5,.16,n,e)*(1-.3*t),i.key.color.copy(Os(16752724,16774880,10336511,n,e)),i.key.intensity=xs(2.3,2.6,.45,n,e)*(1-.5*t),i.rim.intensity=xs(.5,.3,.1,n,e)*(1-.4*t),Se.fog.color.copy(Os(14719602,12834794,723741,n,e).lerp(Vh.set(5923950),.6*t)),Se.fog.near=xs(360,430,300,n,e)*(1-.45*t),Se.fog.far=xs(2150,2600,1650,n,e)*(1-.35*t),i.sunMat.color.copy(Os(16764250,16777198,14542591,n,e)),i.sunMat.opacity=xs(.92,.95,.5,n,e)*(1-.85*t);for(const a of i.glowMats)a.mat.opacity=xs(a.dusk,a.dusk*.55,a.dusk*.18,n,e)*(1-.7*t);const s=Os(16777215,16777215,3687001,n,e).lerp(Vh.set(4147533),.65*t);for(const a of i.cloudMats)a.color.copy(s)}pn(new zt,(n,e)=>{let t=0,i=0;if(Wn==="day")t=1;else if(Wn==="night")i=1;else if(Wn==="cycle"){Ic=(Ic+e)%270;const a=Ic;a<60?t=1:a<90?t=1-(a-60)/30:a<120||(a<150?i=(a-120)/30:a<210?i=1:a<240?i=1-(a-210)/30:t=(a-240)/30)}const s=Math.min(1,e*1.4);il+=(t-il)*s,sl+=(i-sl)*s,nb(il,sl)});function Mp(){Wn=Lr[(Lr.indexOf(Wn)+1)%Lr.length],localStorage.setItem("steel-ribbon-tod",Wn),zd(),l.message=`Time of day: ${Wn.toUpperCase()}`,l.messageTimer=1.2}const Zr=document.createElement("button");Zr.id="todBtn",Zr.type="button";function zd(){Zr.textContent=`${Qy[Wn]} ${Wn[0].toUpperCase()}${Wn.slice(1)}`}zd();Zr.addEventListener("click",n=>{n.stopPropagation(),Mp()});(document.querySelector("#menuToggles")||qe.menu).appendChild(Zr);const b0=document.querySelector("#menuMain"),ib=document.querySelector("#onlinePanel"),sb=document.querySelector("#scoresPanel");function Sl(n){b0&&(b0.classList.toggle("hidden",!!n),ib.classList.toggle("hidden",n!=="online"),sb.classList.toggle("hidden",n!=="scores"))}const _p={lap:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-laps-v1",roam:"https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-roam-v1"},Gh="steel-ribbon-initials",Aa=document.querySelector("#initials");Aa&&(Aa.value=localStorage.getItem(Gh)||"",Aa.addEventListener("input",()=>{Aa.value=Aa.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,3),localStorage.setItem(Gh,Aa.value)}));function ab(){return(localStorage.getItem(Gh)||"").slice(0,3)}let Kr="lap";async function yp(n){try{const e=new AbortController,t=setTimeout(()=>e.abort(),7e3),i=await fetch(_p[n],{signal:e.signal,cache:"no-store"});clearTimeout(t);const s=await i.json();return(Array.isArray(s)?s:s.scores||[]).filter(r=>Number(r.score)>0).sort((r,o)=>o.score-r.score).slice(0,12)}catch{return null}}async function bp(n,e,t={}){const i=ab();if(!i||!(e>0))return!1;try{const s=new AbortController,a=setTimeout(()=>s.abort(),7e3);return await fetch(_p[n],{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initials:i,score:Math.max(0,Math.floor(e)),extra:t}),signal:s.signal}),clearTimeout(a),Me.scoresPosted=(Me.scoresPosted||0)+1,!0}catch{return!1}}async function wp(){const n=document.querySelector("#scoreBoard");if(!n)return;n.textContent="Loading…";const e=await yp(Kr);if(!e){n.textContent="Leaderboard unreachable — try again later.";return}if(!e.length){n.textContent="No entries yet — set your initials and claim the first spot.";return}n.innerHTML=e.map((t,i)=>{const s=String(t.initials||t.name||"???").slice(0,3),a=Kr==="lap"?t.extra?.time?`${Number(t.extra.time).toFixed(2)}s — ${t.extra.course||"?"}`:Math.round(t.score):Math.round(t.score).toLocaleString();return`<div class="score-row"><i>${i+1}</i><b>${s}</b><span>${a}</span></div>`}).join("")}for(const[n,e]of[["#lapBoardBtn","lap"],["#roamBoardBtn","roam"]]){const t=document.querySelector(n);t&&t.addEventListener("click",()=>{Kr=e,document.querySelector("#lapBoardBtn")?.classList.toggle("active-board",e==="lap"),document.querySelector("#roamBoardBtn")?.classList.toggle("active-board",e==="roam"),wp()})}document.querySelector("#scoresBtn")?.addEventListener("click",()=>(Sl("scores"),wp()));document.querySelector("#scoresBackBtn")?.addEventListener("click",()=>Sl(null));const rb="wss://iron-ridge-online.jez237.workers.dev/ws",Sp="steel-ribbon-mp-room",Tp="steel-ribbon-mp-name",gt={ws:null,connected:!1,id:null,room:"",name:"",peers:new Map,lastState:0,lastPing:0,manual:!1},xr=(n,e,t)=>String(n||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,t)||e;function ob(){const n="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let e="";const t=new Uint8Array(5);crypto.getRandomValues(t);for(const i of t)e+=n[i%n.length];return e}function gs(n){const e=document.querySelector("#mpStatus");e&&(e.textContent=n)}function lb(n){const e=document.createElement("canvas");e.width=256,e.height=64;const t=e.getContext("2d");t.clearRect(0,0,256,64),t.fillStyle="rgba(10, 16, 26, 0.78)",t.fillRect(14,10,228,42),t.strokeStyle="rgba(140, 200, 255, 0.9)",t.lineWidth=3,t.strokeRect(14,10,228,42),t.fillStyle="#d8ecff",t.font="800 24px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,128,32,208);const i=new Qt(e);i.colorSpace=Pt;const s=new hl(new Al({map:i,transparent:!0,depthTest:!1}));return s.scale.set(7.4,1.85,1),s}function w0(n,e){let t=gt.peers.get(n);return t||(t={id:n,name:e||"DRIVER",hue:[...n].reduce((i,s)=>i+s.charCodeAt(0),0),tx:0,ty:0,tz:0,tyaw:0,v:"car",has:!1,lastSeen:performance.now()},gt.peers.set(n,t)),e&&(t.name=e),t}function cb(n){n.car||(n.car=Qr("compact",[16739693,5163247,16770048,9498256,3531007][n.hue%5]),n.car.userData.stolenYOff=.57,Se.add(n.car),n.walker=_d(9464783,4149685),n.walker.visible=!1,Se.add(n.walker),n.label=lb(n.name),Se.add(n.label))}function Nd(n){n.car&&Ps(n.car),n.walker&&Ps(n.walker),n.label&&(n.label.material.map?.dispose(),n.label.material.dispose(),Se.remove(n.label)),gt.peers.delete(n.id)}function Tl(n=!0){if(gt.manual=n,gt.ws)try{gt.ws.close(1e3,"leave")}catch{}gt.ws=null,gt.connected=!1,gt.id=null;for(const e of[...gt.peers.values()])Nd(e);gs("Not connected."),kd()}function Ep(){Tl(!0);const n=xr(document.querySelector("#mpName")?.value,"DRIVER",12),e=xr(document.querySelector("#mpRoom")?.value,"",10)||ob(),t=document.querySelector("#mpRoom");t&&(t.value=e),localStorage.setItem(Sp,e),localStorage.setItem(Tp,n),gt.room=e,gt.name=n,gt.manual=!1,gs(`Connecting to ${e}…`);let i;try{i=new WebSocket(`${rb}/${encodeURIComponent(`SRR-${e}`)}`)}catch{gs("Connection failed.");return}gt.ws=i,i.onopen=()=>{gt.connected=!0,i.send(JSON.stringify({type:"hello",name:n})),gs(`Room ${e} — connected`),kd()},i.onclose=()=>{gt.ws===i&&(Tl(!0),gs(gt.manual?"Not connected.":"Connection dropped."))},i.onerror=()=>gs("Connection failed — try again."),i.onmessage=s=>{let a;try{a=JSON.parse(s.data)}catch{return}if(a.type==="welcome"){gt.id=a.id,gs(`Room ${gt.room} — ${Math.max(1,Number(a.count)||1)} cruising`);return}if(a.type==="peers"){const r=new Set((a.peers||[]).filter(o=>o.id!==gt.id).map(o=>o.id));for(const o of[...gt.peers.values()])r.has(o.id)||Nd(o);for(const o of a.peers||[]){if(!o.id||o.id===gt.id)continue;const c=gt.peers.has(o.id);w0(o.id,xr(o.name,"DRIVER",12)),c||l.mode==="roam"&&(l.message=`${xr(o.name,"DRIVER",12)} joined the cruise`,l.messageTimer=1.6)}gs(`Room ${gt.room} — ${gt.peers.size+1} cruising`);return}if(!(!a.from||a.from===gt.id)&&a.type==="state"&&a.state){const r=w0(a.from,a.name&&xr(a.name,"DRIVER",12));r.tx=Number(a.state.x)||0,r.ty=Number(a.state.y)||0,r.tz=Number(a.state.z)||0,r.tyaw=Number(a.state.yaw)||0,r.v=a.state.v==="foot"?"foot":"car",r.lastSeen=performance.now(),r.has||(cb(r),r.car.position.set(r.tx,r.ty,r.tz),r.has=!0)}}}function kd(){const n=document.querySelector("#mpJoinBtn"),e=document.querySelector("#mpLeaveBtn");n&&(n.textContent=gt.connected?"Switch Room":"Join Room"),e&&e.classList.toggle("hidden",!gt.connected)}{const n=document.querySelector("#mpName"),e=document.querySelector("#mpRoom");n&&(n.value=localStorage.getItem(Tp)||""),e&&(e.value=localStorage.getItem(Sp)||""),document.querySelector("#onlineBtn")?.addEventListener("click",()=>Sl("online")),document.querySelector("#onlineBackBtn")?.addEventListener("click",()=>Sl(null)),document.querySelector("#mpJoinBtn")?.addEventListener("click",Ep),document.querySelector("#mpLeaveBtn")?.addEventListener("click",()=>Tl(!0)),kd()}pn(new zt,(n,e)=>{if(!gt.connected)return;const t=performance.now();for(const i of[...gt.peers.values()]){if(!i.has)continue;if(t-i.lastSeen>12e3){Nd(i);continue}const s=1-Math.exp(-10*e),a=i.v!=="foot";i.car.visible=a,i.walker.visible=!a;const r=a?i.car:i.walker;if(r.position.lerp(gd.set(i.tx,i.ty-(a?.25:.5),i.tz),s),r.rotation.y=-i.tyaw,i.label.position.set(r.position.x,r.position.y+(a?3.4:3),r.position.z),a)for(const o of i.car.userData.wheels||[])o.rotation.x-=20*e}t-gt.lastPing>5e3&&(gt.lastPing=t,gt.ws?.readyState===1&&gt.ws.send(JSON.stringify({type:"ping",t}))),l.mode==="roam"&&t-gt.lastState>95&&gt.ws?.readyState===1&&(gt.lastState=t,gt.ws.send(JSON.stringify({type:"state",name:gt.name,state:{x:+l.roamPos.x.toFixed(1),y:+l.roamPos.y.toFixed(1),z:+l.roamPos.z.toFixed(1),yaw:+l.roamYaw.toFixed(2),v:l.vehicle==="foot"?"foot":"car"}}))),Me.mpPeers=gt.peers.size});function hb(){const n=new Set,e=c=>c&&c.traverse(h=>n.add(h)),t=c=>{let h=0;return c.traverse(d=>d.isMesh&&h++),h};for(const c of Md)c.obj&&c.obj.parent&&t(c.obj)<=300&&e(c.obj);for(const c of Jt)e(c.marker);e(Gt),e(hn),typeof dn<"u"&&e(dn),typeof Mi<"u"&&e(Mi),de&&e(de.mesh),typeof xi<"u"&&e(xi),typeof Ri<"u"&&Ri&&e(Ri);for(const c of qn)e(c.mesh);const i=new Map;Se.traverse(c=>{if(!c.isMesh||c.isInstancedMesh||!c.visible||n.has(c))return;for(let p=c;p&&p!==Se;p=p.parent){if(n.has(p)||!p.visible)return;const x=p.userData;if(x&&(x.wheels||x.limbs||x.frontWheels))return}const h=c.material;if(!h||Array.isArray(h)||h.transparent||h.blending!==1||!(h.isMeshStandardMaterial||h.isMeshBasicMaterial||h.isMeshLambertMaterial))return;const d=c.geometry;if(!d?.attributes?.position||!d.attributes.normal||!d.attributes.uv||!d.index)return;const u=`${h.uuid}|${c.castShadow?1:0}${c.receiveShadow?1:0}`;let m=i.get(u);m||i.set(u,m=[]),m.push(c)});let s=0,a=0;const r=new Map;for(const c of i.values())if(!(c.length<6))try{const h=c.map(p=>{p.updateWorldMatrix(!0,!1);const x=p.geometry.clone().applyMatrix4(p.matrixWorld);for(const _ of Object.keys(x.attributes))_==="position"||_==="normal"||_==="uv"||x.deleteAttribute(_);return x}),d=Dn(h,!1);if(!d)continue;const u=c[0],m=new z(d,u.material);m.castShadow=u.castShadow,m.receiveShadow=u.receiveShadow,m.matrixAutoUpdate=!1,Se.add(m);for(const p of c)r.set(p.geometry.uuid,p.geometry),p.removeFromParent(),a++;s++}catch{}const o=new Set;Se.traverse(c=>c.geometry&&o.add(c.geometry.uuid));for(const[c,h]of r)o.has(c)||h.dispose();Me.staticMerge={groups:s,meshesRemoved:a}}hb();const db=mt(l.s);l.y=db.p.y+2.1;l.lastSafeS=l.s;l.lastSafeDistance=l.totalDistance;Id(.016);Rr();cp();
